# Navigatie-duidelijkheid — Plan

> Probleem (tester-feedback): spelers weten niet waar ze heen moeten. Onduidelijk wat
> "terug naar vorige stad", "volgende stad" en "wild" is — zowel in de game als op de map.
> Doel: op elk moment is glashelder waar je bent, waar je heen moet, en wat elke uitgang is.

## Diagnose (huidige staat)
- **Map-UI** (`js/ui/menu.js` `_drawMap`): handgetekende bezier-continent + hardgecodeerde
  stads-/route-posities. Geen "je bent hier", geen stadsnamen, geen route-nummers bij de lijnen,
  geen onderscheid bezocht/onbezocht, geen wild-zones.
- **In-game** (`js/world/overworld.js` `drawObjectiveHint`): één globale pill met het volgende
  gym-doel. Zegt niet welke richting, en helpt niet binnen een route (welke uitgang = vooruit/terug).
- **Routebordjes**: bestaan (auto-injectie, Fase 1.7) maar passief — je moet er naartoe lopen.

---

## A. Fundament: één region-graph (data-gedreven)
De bron van alle navigatie. Eén tabel die zowel de map-UI als de in-game cues voedt — schaalt
automatisch mee met nieuwe steden (Fase 7) en de Fairy-gym (Fase 3).

```
DG.REGION = {
  nodes: {
    AMBERTOWN:      { name:'Ambertown', type:'town', x, y, order:0 },
    ROUTE_1:        { name:'Route 1', type:'route', x, y, order:0.5 },
    SHELLCREEK_CITY:{ name:'Shellcreek City', type:'gym', gym:1, leader:'…', x, y, order:1 },
    SHELLCREEK_WILD:{ name:'Coastal Area', type:'wild', x, y },
    ...
  },
  edges: [ {from:'AMBERTOWN', to:'ROUTE_1', dir:'N'}, ... ],  // dir = kompasrichting
}
```
- `type`: town / gym / route / wild / cave / landmark / shop.
- `order`: progressievolgorde → bepaalt "vorige" vs "volgende".
- Afgeleid uit de bestaande `DG.MAPS` warp-graph waar mogelijk; handmatig aangevuld voor labels/posities.
**Bestanden:** nieuw `js/data/region.js`.

## B. Map-UI overhaul (`_drawMap`)
Van decoratief → leesbaar. Behoud sfeer als subtiele achtergrond, leg er een heldere functionele
laag overheen.
1. **Knooppunten met labels**: elke stad = duidelijk icoon + **naam eronder**. Gym-steden krijgen
   een badge-icoon (gekleurd = verslagen, grijs = nog niet).
2. **Routes als genummerde lijnen** tussen knooppunten ("Route 3"), met pijltjes die de
   progressierichting tonen.
3. **"Je bent hier"** — pulserende marker op je huidige node/route.
4. **Highlight-laag**:
   - Huidige locatie (wit/pulserend).
   - **Volgende doel** (gouden ring + "→ NEXT").
   - **Vorige stad** (subtiel "← terug" label).
5. **Bezocht/onbezocht**: onbezochte gebieden grijs/met `?`; verschijnen pas in kleur na bezoek.
6. **Wild-zones** apart icoon (gras-symbool) + label.
7. **Speciale plekken** (fossiel-lab, safari, secret tunnel, legendary — Fase 6/7) eigen iconen,
   pas zichtbaar na ontdekking.
8. **Legenda** onderaan (stad / gym / route / wild / jij / doel).
9. **Cursor/scroll**: optioneel een selecteerbare node die naam + status + "wat is hier" toont.
**Bestanden:** `js/ui/menu.js` (`_drawMap` herschrijven, data uit `region.js`).

## C. In-game wegwijzers
Het meeste winst zit hier — je moet het zónder de map al snappen.
1. **Gebiedsnaam bij binnenkomst** (à la Pokémon): bij het laden van een nieuwe map een banner
   die in/uit-faded: *"Route 3 — Sand Wastes"* / *"Dustwall Town"*. Direct besef van waar je bent.
2. **Richting-uitgangen**: bij elke route-uitgang (de corridor-opening) een klein bord/pijl met
   bestemming: bovenrand `▲ Dustwall Town`, onderrand `▼ Pyreside City`. Baken het ook op de
   grond af (al deels via Fase 1.7-bordjes — uitbreiden naar **beide** uiteinden + bestemming).
3. **Slimmere doel-pill**: niet alleen "Reach Pyreside", maar mét richting vanaf je huidige map:
   *"→ Pyreside City — zuid via Route 3"*. Afgeleid uit de region-graph (kortste pad naar het doel).
4. **Kompas/pijl-HUD** (optioneel): klein pijltje aan de schermrand dat naar de volgende-stad-uitgang
   wijst, zodat je op een grote route weet welke kant op.
5. **Kleur/markering wild vs pad**: tall-grass (wild) krijgt een subtiel "wild"-randje of het
   gebiedsnaam-bordje vermeldt "wilde DinoMon hier". Stadsingang vs route-uitgang visueel onderscheiden.
6. **"Vorige stad"-besef**: de uitgang terug naar de vorige stad krijgt altijd een `← <stad>`-bordje.
**Bestanden:** `js/world/overworld.js` (entry-banner, doel-pill, kompas, sign-uitbreiding),
`js/data/region.js` (paden/richting), evt. `js/engine/renderer.js` (HUD-pijl).

## D. Volgorde van uitvoeren
1. **C1 (gebiedsnaam-banner)** + **C3 (slimmere doel-pill)** — snelste, grootste duidelijkheidswinst.
2. **C2/C6 (richting-bordjes bij uitgangen, vorige/volgende)** — lost "welke uitgang?" op.
3. **A (region-graph)** — fundament; nodig voor een goede map en pad-berekening.
4. **B (map-UI overhaul)** — bovenop de graph.
5. **C4 (kompas)** — optionele extra.

## E. Afhankelijkheden
- De graph (A) moet de nieuwe Fairy-stad (Fase 3) en nieuwe steden (Fase 7) bevatten → graph
  data-gedreven opzetten zodat toevoegen triviaal is.
- Sluit aan op de al-gefixte instap-richting (Fase 1.1) en routebordjes (Fase 1.7).

## Open keuze voor Tigo
- **Map-stijl**: artistiek-mét-labels (sfeer behouden) vs strak schematisch (maximaal leesbaar).
- **Hoeveel hand-holding in-game**: altijd-zichtbaar kompas/pijl vs alleen bordjes + banner.

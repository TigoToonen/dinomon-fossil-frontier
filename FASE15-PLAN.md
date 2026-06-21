# FASE 15 — Grote Overhaul (Masterplan)

> **Aanpak (bevestigd):** Eén samenhangend, gefaseerd plan. Volgorde = op afhankelijkheid:
> eerst bugfixes → dan TM-route-gating (#1 prioriteit) → dan visueel → dan content.
> Gym-teams lopen **2 → 6** op. Wereld-uitbreiding is **ambitieus** (6-8 nieuwe steden).
> Fossiel-DinoMon worden **nieuwe exclusieve soorten**.

> ## ✅ Vriendennamen ontvangen + NIEUWE Fairy-gym
> Er komt een **9e gym** bij: een **Fairy-gym tussen gym 4 en 5** (nieuwe stad, leader **AFK Jorn**).
> Gym 1 wordt **Normal** (i.p.v. Fossil). Volledige roster in **Fase 3**.

---

## Huidige situatie (referentie)

**8 gyms** (`js/data/trainers.js`, `js/data/maps.js`):

| # | Stad | Leader (nu) | Type | Team nu |
|---|------|-------------|------|---------|
| 1 | Shellcreek City | Rex | Fossil | 3 |
| 2 | Dustwall Town | Ridley | Rock | 3 |
| 3 | Pyreside City | Ignis | Fire | 3 |
| 4 | Ferngrove Town | Sylva | Grass | 3 |
| 5 | Stonehaven City | Terra | Dragon/Rock | 3 |
| 6 | Crestfall Town | Volt | Electric | 3 |
| 7 | Bogmire City | Marina | Water | 3 |
| 8 | Apex Summit | Valdez | Mixed | 3 |

**Belangrijkste codebestanden:**
- Wereld/maps: `js/data/maps.js` (4848 r), `js/world/overworld.js` (2122 r)
- Sprites: `js/sprites/spriteRenderer.js` (6648 r) — procedureel, archetype+variant+stage
- Battle: `js/battle/battle.js` (2718 r), moves `js/data/moves.js` (5772 r)
- Trainers: `js/data/trainers.js` (2069 r)
- Field moves/TM: `js/world/fieldMoves.js`, `js/data/tmData.js`
- UI: `js/ui/menu.js` (map), `js/ui/bagMenu.js`, `js/ui/partyMenu.js`, `js/ui/boxUI.js`, `js/ui/dexMenu.js`

---

# FASE 1 — Core bugfixes (geen content, snelle winst)

Doel: alles wat "kapot of gek voelt" wegwerken voordat we uitbreiden.

### 1.1 Wild-instap-richting klopt overal
**Probleem:** warps zetten je op een vaste `targetX/targetY` zonder looprichting → je "valt" van boven binnen.
**Oplossing:**
- Voeg optioneel `facing` toe aan elke warp-definitie. Waar afwezig: **afleiden** uit de positie van de warp-tile op de doelmap (warp aan onderrand ⇒ speler kijkt omhoog/loopt naar binnen, bovenrand ⇒ omlaag, etc.).
- In `overworld.js > _startTransition()`: zet `_gs.player.facing` op basis van `warp.facing` of de afgeleide richting, en spawn de speler **één tile naar binnen** vanaf de rand i.p.v. exact op de rand.
- Centrale helper `_resolveSpawn(targetMap, x, y, facing)` zodat dit voor álle warps geldt (gyms, steden, routes, grotten).
**Bestanden:** `js/world/overworld.js`, evt. kleine veldtoevoeging in `js/data/maps.js` warps.

### 1.2 Multi-turn moves locken écht
**Probleem:** `TWO_TURN` ontlaadt na turn 1 → je kunt daarna vrij wisselen. Rollout/Dig/Surf voelen stuk.
**Oplossing:** nieuw `MULTI_TURN`-mechanisme in `battle.js`:
- `actor._locked = { moveId, turnsLeft, kind }`. Zolang `turnsLeft>0` wordt het move-menu overgeslagen en wordt dezelfde move geforceerd.
- **ROLLOUT / ICE BALL**: 5 turns, damage ×1.5 per turn cumulatief, breekt bij mis.
- **DIG / FLY / DIVE / SOLAR_BEAM**: 2-turn (charge turn = onkwetsbaar/charging, turn 2 = hit), tijdens charge geen menu.
- **PETAL_DANCE / THRASH / OUTRAGE**: 2-3 turns lock, daarna confusion.
- Lock wordt gewist bij: faint, switch (met juiste straf), of natuurlijke afloop.
**Bestanden:** `js/battle/battle.js`, flags in `js/data/moves.js` (zet juiste `effect.type` per move).

### 1.3 Markt overal toegankelijk
**Probleem:** Ferngrove, Crestfall, Bogmire hebben geen shop-map.
**Oplossing:**
- Voeg `*_SHOP` maps + warps toe voor deze 3 steden (template hergebruiken van bestaande shops, regels ~4388-4560 in `maps.js`).
- Maak één herbruikbaar shop-template (`_makeShop(id, inventoryTier)`) zodat élke (ook nieuwe) stad eenvoudig een markt krijgt met een tier-gebaseerde inventaris (potions/balls/etc. schalen met progressie).
**Bestanden:** `js/data/maps.js`.

### 1.4 Ingang Dinocentrum betrouwbaar
**Probleem:** ingang werkt "niet altijd".
**Oorzaak (te verifiëren):** waarschijnlijk warp-tile op een blocked tile of off-by-one met de deur-tile (68).
**Oplossing:** audit van álle center/shop/gym deur-warps: deur-tile (68) staat op de juiste plek, warp-coördinaat ligt op de deur, en spawn binnen ligt op een walkable tile vóór de balie. Voeg een dev-check toe die alle warps valideert (bestaat target, target-tile walkable). Sluit aan op `_nudgeToWalkable`.
**Bestanden:** `js/data/maps.js`, `js/world/overworld.js`, kleine validator (los script à la bestaande `validate_*.js`).

### 1.5 Dual-types weergeven
**Probleem:** UI toont alleen `types[0]`.
**Oplossing:** overal waar een type-badge wordt getekend, lus over `sp.types` (1 of 2 badges) met de juiste `TYPE_COLORS`.
**Plekken:** `js/ui/partyMenu.js` (r.516, 554), `js/ui/boxUI.js` (r.317), battle-HUD in `js/battle/battle.js`, en `js/ui/dexMenu.js`. Eén helper `drawTypeBadges(ctx, types, x, y)`.

### 1.6 Item in battle → kies op wie
**Probleem:** bag-UI stuurt healing-item meteen door zonder mon-keuze (battle ondersteunt `targetIndex` al).
**Oplossing:** in `bagMenu.openBattle`-flow: bij een healing/revive-item eerst `SELECT_MON`-scherm tonen, dan `_battleOnUsed(itemId, targetIndex)`. Balls slaan de mon-keuze over (richten op tegenstander).
**Bestanden:** `js/ui/bagMenu.js` (r.206-229), aansluiting `js/battle/battle.js` `_doItemAction` (r.2356-2406, gebruikt `act.targetIndex` al).

### 1.7 Bordjes per route
**Oplossing:** plaats een sign-tile (67) + dialoog aan het begin van elke route met naam + hint ("Route 8 — Pas op voor wilde Electric-types. Heb je SURF al?"). Data-gedreven lijst `ROUTE_SIGNS` zodat nieuwe routes meteen meedoen.
**Bestanden:** `js/data/maps.js`.

---

# FASE 2 — TM-systeem & route-gating  ⭐ (jouw #1)

Doel: TM's voelen belangrijk en zijn **verplicht** om verder te komen.

### 2.1 TM-beloning na elke gym
- Elke gymleader geeft bij verslaan een **specifieke TM** (Rock Smash, Cut, Surf, Strength, Flash, Dig/Rock Climb, Waterfall, Fly).
- Mapping gym → TM zo gekozen dat de TM precies de **volgende route** ontgrendelt.

### 2.2 Prominente "TM ontvangen"-presentatie
- Vol-scherm overlay (zoals evolutie-anim): icoon van de TM, naam, beschrijving, "Gebruik dit om <obstakel> te verwijderen". Geluid + animatie.
- Daarna automatische prompt: "Wil je <TM> aan een DinoMon leren?" → mon-select.
**Bestanden:** nieuwe `js/ui/tmReward.js` (analoog aan `evoAnim.js`), trigger in trainer-overwinnings-event.

### 2.3 Route-obstakels (de kern)
- Nieuwe tile-types / objecten: **blokkerende rots (Rock Smash/Strength)**, **boom (Cut)**, **diep water (Surf)**, **donkere grot (Flash)**, **steile rand (Rock Climb)**, **waterval (Waterfall)**.
- Elk obstakel heeft `requires: { tm:'CUT', gymFlag:'TRAINER_GYM_X_DEFEATED' }`. Pas door als beide gelden; anders dialoog ("Een dikke rots verspert de weg. Je hebt iets nodig om hem te verbrijzelen.").
- Interactie: speler kijkt naar obstakel + drukt A → check field move → verwijder/loop door + animatie.
- Plaats minstens 1 verplicht obstakel ná elke gym, zó dat de net-verkregen TM de enige weg vrijmaakt (lineaire gating, met optionele zijpaden voor extra exploratie).
**Bestanden:** `js/world/fieldMoves.js` (gating-logica), `js/data/maps.js` (obstakels plaatsen), `js/world/overworld.js` (interactie), tile-render in `js/engine/renderer.js`.

### 2.4 Field-move logica opschonen
- `canSurf/canCut/...` checken nu badge-flag + party-move. Uitbreiden zodat obstakel-interactie hetzelfde pad gebruikt, met nette faal-dialogen.

---

# FASE 3 — Gym-teams schalen + hernoemen naar vrienden + Fairy-gym

### 3.0 Nieuwe gym-roster (9 gyms)
De Fairy-gym wordt ingevoegd als **gym 5** (tussen Grass en Dragon/Rock). Gym 1 wordt **Normal**.

| # | Stad | Leader (nieuw) | Type | Oude leader |
|---|------|----------------|------|-------------|
| 1 | Shellcreek City | **Normal Normi** | Normal | Rex (Fossil) |
| 2 | Dustwall Town | **Jam Sennings** (zonder shirt) | Rock/mining | Ridley |
| 3 | Pyreside City | **Asset Toverdijk** | Fire | Ignis |
| 4 | Ferngrove Town | **PuKing Maarten** | Grass | Sylva |
| 5 | **NIEUWE STAD** | **AFK Jorn** | **Fairy** | — (nieuw) |
| 6 | Stonehaven City | **Rock Hard Toonen** | Dragon/Rock | Terra |
| 7 | Crestfall Town | **Beyblade Luuk** | Electric | Volt |
| 8 | Bogmire City | **Surfing Peter** | Water | Marina |
| 9 | Apex Summit | **Bipolar Fieke** | Mixed | Valdez |

> **Let op gym 1:** wordt van Fossil → **Normal**. De fossiel-identiteit verhuist naar het
> dedicated **fossiel-lab** (Fase 6/7), dus het thema gaat niet verloren.

### 3.1 Teamgrootte 2 → 6 (over 9 gyms)
| Gym | 1 | 2 | 3 | 4 | 5 (Fairy) | 6 | 7 | 8 | 9 |
|-----|---|---|---|---|---|---|---|---|---|
| # mons | 2 | 2 | 3 | 3 | 4 | 4 | 5 | 5 | 6 |

- Voeg per gym extra teamleden toe die **passen bij het type-thema** + level-curve (laatste mon = ace).
- Levels herbalanceren: Fairy-gym ligt qua niveau **tussen gym 4 (~L38) en gym 6/oud-5 (~L44)**, dus ace ~L40-42. Alle gyms erna schuiven licht op.
- Reguliere trainers houden 1-2 mons (verschil met leaders blijft voelbaar).
**Bestanden:** `js/data/trainers.js`.

### 3.2 Hernoemen
- Vervang `name` + dialoog/verwijzingen van alle gym-leaders volgens tabel 3.0. Grep op oude namen (Rex/Ridley/Ignis/Sylva/Terra/Volt/Marina/Valdez) om niets te missen. Badge-namen mogen meebewegen.

### 3.3 NIEUWE Fairy-stad + gym (AFK Jorn)
Volwaardige nieuwe stad tussen Ferngrove en Stonehaven, met werkende type-integratie:
- **Nieuwe stad-map** (markt via `_makeShop`, dinocentrum, bordjes, NPC's, gym-gebouw).
- **Nieuwe route(s)** die Ferngrove → nieuwe stad → Stonehaven verbinden, met een **TM-gate** (Fase 2) ervoor zodat de progressie klopt.
- **Gym AFK Jorn** met 4 Fairy-mons (curve gym 5), ace op ~L42, eigen badge.
- **Map-node** toevoegen in de nieuwe map-UI (Fase 4.2).
- Verwijzingen in `story.js` (verhaal/volgorde) en de gym-voortgangslogica bijwerken (badge-telling 8→9).

### 3.4 Genoeg Fairy-DinoMon  ⭐
Nu bestaat alleen Fairywing → Bloomsaur → Florosaur (en 2 zijn Fairy/**Grass**). Te weinig + overlap met Grass-gym.
- **2-3 nieuwe Fairy-evolutielijnen** (≈6-9 nieuwe soorten) met **nieuwe sprites** (Fase 4.1-stijl), waarvan minimaal één **puur Fairy** en enkele Fairy-duals (bv. Fairy/Flying, Fairy/Psychic, Fairy/Ice) voor variatie.
- Verdeel ze over: AFK Jorn's gymteam, wilde encounters rond de nieuwe stad/route, en evt. een sidequest-beloning.
- Type-werking volledig testen: effectiviteit (sterk vs Dragon/Dark/Fighting, zwak vs Poison/Steel), dual-type weergave (Fase 1.5), STAB, AI.
**Bestanden:** `js/data/dinomons.js` (soorten/learnsets/evo), `js/sprites/spriteRenderer.js` (sprites), `js/data/maps.js` (encounter-tables), `js/data/trainers.js` (gymteam).

---

# FASE 4 — Visuele overhaul

### 4.1 Evoluties die écht verschillen ⭐
**Probleem:** zelfde archetype+variant per lijn; alleen schaal verandert.
**Oplossing:** stage-gestuurde **feature-lagen** in `spriteRenderer.js`. Per archetype-tekenfunctie features toevoegen die afhangen van stage (0/1/2):
- **Stage 1:** grotere/extra hoorns, ruggenplaten/spikes, klauwen, fellere secundaire kleur, eerste vleugel-stompjes.
- **Stage 2 (final):** volwaardige **vleugels**, dubbele spike-rijen, kuif/kroon, gloed/aura, scherpere silhouet-uitstekers, extra koppen/staartwapens waar passend.
- Generieke helpers: `drawWings(ctx, style, stage)`, `drawSpikes(...)`, `drawCrest(...)`, `drawHorns(...)`, `drawAura(...)` — per archetype geconfigureerd zodat een hele lijn een herkenbare maar duidelijk geüpgradede vorm krijgt.
- Behoud type-kleuren; voeg meer contrast/detail toe per stage.
**Bestanden:** `js/sprites/spriteRenderer.js` (archetype-functies + nieuwe feature-helpers). Grootste visuele klus.

### 4.2 Map-UI overhaul
**Probleem:** huidige `_drawMap` is een vaag bezier-continent zonder duidelijke route-structuur.
**Oplossing:** herontwerp naar een **leesbare regio-kaart**:
- Duidelijke knooppunten (steden) met labels + gym-badge-icoon (verdiend = gekleurd, anders grijs).
- Routes als zichtbare paden/lijnen tussen steden, met routenummers.
- Iconen voor bezienswaardigheden (safari, fossiel-lab, secret tunnel-ingang, legendary-plekken — pas zichtbaar na ontdekking).
- "Je bent hier"-marker. Biome-kleuren als subtiele achtergrond i.p.v. dominant.
- Schaalt mee met de nieuwe steden uit Fase 7 (data-gedreven node/edge-lijst i.p.v. hardgecodeerde curves).
**Bestanden:** `js/ui/menu.js` (`_drawMap`), nieuwe data `MAP_NODES`/`MAP_EDGES`.

### 4.3 Route na gym 6
- Herontwerp ROUTE_8A-D: minder identieke mountain-borders, echte hoogteverloop/variatie, logische in/uitgangen, decoratie. Sluit aan op de instap-richting-fix (1.1).
**Bestanden:** `js/data/maps.js` (ROUTE_8*).

---

# FASE 5 — Items in het wild (dinoball-pickups)

Doel: rondslingerende items + verborgen items zoals in Pokémon.

- **Zichtbare pickup**: object op de grond dat eruitziet als een **dinoball**; oplopen + A = oppakken, verdwijnt, vlag gezet (niet respawnen).
- **Verborgen items**: onzichtbaar, vindbaar door op verdachte tiles A te drukken (later evt. een dowsing-item).
- **Loot:** potions, balls, **Rare Candy**, TM's, evolutiestenen, money-items, en zeldzame vondsten.
- Data-gedreven `groundItems: [{x,y,item,qty,flag}]` per map; helper render + pickup-logica.
**Bestanden:** `js/data/maps.js` (item-plaatsing), `js/world/overworld.js` (pickup), `js/engine/renderer.js` (sprite), `js/ui/bagMenu.js` (al aanwezig voor opslag).

---

# FASE 6 — Fossielen (step-based, nieuwe exclusieve soorten)

Doel: fossielen die je meedraagt en die op basis van **stappen** uitkomen in unieke DinoMon.

### 6.1 Mechaniek
- Fossiel = key-item dat je later in de game krijgt (bv. na gym 5 + bij het fossiel-lab in een nieuwe stad).
- **Step-counter**: per gedragen fossiel telt de game je stappen; bij drempel (bv. 500/1000 stappen) "ontwaakt" het fossiel → keuze om te wekken in het lab → nieuwe DinoMon in party/box.
- Meerdere fossielen tegelijk dragen kan, elk eigen teller. UI in bag/key-items met voortgangsbalk.

### 6.2 Soorten (minimaal 5, elk met evoluties)
- **5+ volledig nieuwe fossiel-exclusieve DinoMon**, elk met een eigen 2-3-traps evolutielijn en **nieuwe sprites** (nieuwe archetypes of duidelijke varianten in `spriteRenderer.js`).
- Thema's bv.: Amber (Bug/Rock), Tar (Dark/Rock), Ice-core (Ice/Rock), Sea-fossil (Water/Rock), Sky-fossil (Flying/Rock). Definitief overzicht in detailplan.
- Alleen verkrijgbaar via fossielen → maakt ze speciaal.
**Bestanden:** `js/data/dinomons.js` (soorten+learnsets+evo), `js/sprites/spriteRenderer.js` (sprites), nieuw `js/world/fossils.js` (step-logica), `js/ui/bagMenu.js` (UI), lab-NPC in een nieuwe stad.

---

# FASE 7 — Wereld-uitbreiding (ambitieus: 6-8 nieuwe steden)

Doel: de wereld voelt groot en levend; wisselende grootte en volgorde.

### 7.1 Variatie & structuur
- Nieuwe steden **wisselend van grootte** (gehucht ↔ grote stad) en niet strikt lineair: zijwegen, optionele gebieden, terugkeerlocaties.
- Elke nieuwe stad heeft minimaal: een markt (via `_makeShop`), bordjes, en een reden om er te zijn.

### 7.2 Concrete nieuwe locaties
1. **Story-stad(en)** — verhalende stad met NPC-arc, kleine quest, lore over Primordial Aura/fossielen.
2. **Safari-zone** — apart vang-gebied (beperkte ballen/tijd of zones), zeldzame soorten, eigen vang-mechaniek-variant.
3. **Team Extinction-stad** — volledig door de antagonist bezet; mini-dungeon, grunts, plot-beat, beloning.
4. **Masterball-stad** — quest/puzzel die leidt tot een (zeer schaarse) Masterball; evt. ook andere unieke items.
5. **Legendary-quest-locatie(s)** — 1-2 **legendary DinoMon** met aanloop-quest (aanwijzingen, item nodig, uniek encounter). Sluit aan op bestaande legendary-soorten + evt. nieuwe.
6. **Fossiel-lab-stad** — thuisbasis fossiel-mechaniek (Fase 6).
7. **Secret tunnel** — verborgen ingang (achter een Fase-2 obstakel/field move) die naar een **speciale route** leidt met een unieke beloning (zeldzame DinoMon / item / TM).
8. **Compound City — Daytrader Niels** (zie 7.4).

### 7.4 Compound City — Daytrader Niels  💰
Een eigen, leuke geld/investeer-stad rond **Daytrader Niels**: een investeerder die jonge talenten
"financiert". Zijn trainers werken vóór hem en battelen om rendement op te bouwen.

**Stadssfeer:** beurs/finance-thema — "Bull Market Boulevard", tickers op gebouwen, een grote
**DinoExchange** (de beurs), een bank, koffie-tentjes vol "analisten". Pun-rijke NPC-namen
(Bull, Bear, Dividend Dave). Visueel groen/goud met stijgende-grafiek-decoratie.

**Wie is Niels:** geen gym-leader, maar een **speciale boss/leader** die in "young potentials"
investeert. Je ontmoet eerst zijn **portfolio van junior-trainers** (een gauntlet van "interns/
analysts"), daarna Niels zelf met een sterk **blue-chip team**.

**Compounding-mechaniek (de kern van de stad):**
- **DinoFund** bij de DinoExchange: je kunt **DinoDollars storten** die **compounden** op basis van
  je **stappen** (sluit aan op de Fase-6 step-counter) — bv. +X% rente per N stappen, met een cap.
- **Risk/reward keuze:** "Safe bond" (lage, gegarandeerde rente) vs "High-risk stock" (hogere rente,
  kleine kans op een dip/verlies) — leuke gok-laag.
- **Dividend-battles:** de junior-trainers herbattle-baar voor "dividend" (terugkerende inkomsten),
  schalend met hoe vaak je investeert → speelse uitleg van compounding.
- **Niels' aanbod (sidequest):** investeer een bedrag in een rookie; na X stappen/battles betaalt
  het uit in een beloning (zeldzaam item, TM, of geld-multiplier). Mislukken = les over risico,
  met een knipoog.
- **Beloningen:** uniek key-item (bv. **"Amulet Coin"-variant / Compound Card** die battle-geld
  verhoogt), evt. een exclusieve DinoMon-egg, en bragging rights op een **leaderboard-bordje**
  ("Net Worth").

**Tone:** humoristisch, finance-meme-stijl, maar de mechaniek leert echt iets over compounding.

**Bestanden:** `js/data/maps.js` (Compound City + DinoExchange-interieur), `js/data/trainers.js`
(Niels + junior-portfolio, herbattle-baar), `js/world/quests.js` (investeer-quest), nieuw
`js/world/dinofund.js` (compounding/rente-logica + save-state), `js/ui/` (DinoFund-scherm met
saldo/rente/voortgang), `js/data/story.js` (dialoog), map-node in `js/ui/menu.js`.

### 7.5 Sidequests-raamwerk
- Lichtgewicht quest-systeem: `quests: [{id, giverNpc, steps, reward, flags}]`, voortgang via save-flags. Hergebruikbaar voor alle steden.
**Bestanden:** `js/data/maps.js` (alle nieuwe maps + verbindingen), `js/data/story.js` (dialoog/lore), `js/data/trainers.js` (grunts/quest-trainers), nieuw `js/world/quests.js`, `js/world/events.js` (triggers), map-nodes in `js/ui/menu.js` (Fase 4.2).

---

## Volgorde-samenvatting & afhankelijkheden

```
Fase 1  Bugfixes ───────────────┐ (fundament: spawn, types, item-target, shops, signs)
Fase 2  TM-gating ⭐ ────────────┤ (gebruikt 1.1 spawn + nieuwe obstakel-tiles)
Fase 3  Gym-teams + namen        │ (vereist vriendennamen)
Fase 4  Visueel (evo/map/route)  │ (4.2 map gebruikt 7's node-data → samen finetunen)
Fase 5  Wild-items ──────────────┤ (basis voor 6 fossiel-items & 7 beloningen)
Fase 6  Fossielen ───────────────┤ (gebruikt 5 + nieuwe sprites uit 4.1)
Fase 7  Wereld-uitbreiding ──────┘ (gebruikt 1.3 shops, 2 gating, 5 items, 6 lab)
```

> **Let op:** door de extra Fairy-gym werkt het spel nu met **9 gyms/badges**. Alle
> badge-tellingen, gating-flags en de eindgame-check (9e badge i.p.v. 8e) schuiven mee.

## Wat ik per fase oplever
Per fase: code-wijzigingen + visuele verificatie via de bestaande test-harness
(`?devloop=1` + `__PUMP` + `shot_server.py`) en daarna een v-bump + git push naar
`tigotoonen.github.io/dinomon-fossil-frontier`.

## Status
Alle keuzes + vriendennamen ontvangen. Niets meer nodig — klaar om te bouwen.

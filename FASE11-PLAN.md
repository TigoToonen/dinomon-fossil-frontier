# FASE 11 — Wereld & Sfeer: battle-achtergronden + overworld-atmosfeer

> Status-legenda: `[ ]` = nog te doen · `[x]` = klaar · `[~]` = mee bezig

**De strategie**: de acteurs (dino's, moves) zijn af — nu het toneel. Deel A trekt de
battle-achtergronden in dezelfde pixel-stijl als de sprites (zelfde hefboomtruc als
fase 2: één pipeline-wrapper i.p.v. alle biome-code herschrijven) en maakt ze levend.
Deel B geeft de overworld geanimeerde tegels, weer, vuurvliegjes en wolkschaduwen.

---

## Stap 0 — Analyse ✅
- [x] Achtergrond-grens in drawBattleScene bepaald (alles vóór de dino-tekenlaag)
- [x] 12 biome-thema's geïnventariseerd (COASTAL, VOLCANIC, FOREST, TUNDRA, DESERT…)
- [x] Verrassing: hoog gras en water animeren al, en de overworld had al een
      volwaardig weer-systeem (DG_MAP_WEATHER) + dag/nacht-overlay → Deel B verkleind
      tot de échte gaten (glinster, vuurvliegjes, wolkschaduwen)

## Deel A — Battle-achtergronden

### Stap A1 — Pixel-pipeline voor de achtergrond ✅
- [x] Complete bestaande achtergrond rendert naar half-res offscreen → lichte posterize
      (14 niveaus) → blokkig ×2 — biome-code zelf ongewijzigd; animaties pixelen mee
- [x] Performance: achtergrond ververst op 30 fps (skip-frames tekenen naar een
      wegwerp-canvasje); battle-frametijd 4,5 ms van 16,7 budget
- [x] Visueel: f11_battle_coastal.png (gepixeld strand), f11_battle_volcanic.png
      (dreigend vulkaanlandschap met sintels)

### Stap A2 — Dag/nacht in de battle ✅
- [x] Multiply-tint over de achtergrond: avondrood piekt halverwege, maanlicht-blauw
      groeit door — f11_battle_night.png (maanlichte nacht-battle)

### Stap A3 — Levende lagen per biome ✅
- [x] Drie drijvende pixelwolken (alleen buiten; binnen/grot overgeslagen)
- [x] Biome-deeltjes met 4 bewegingsmodi: sintels stijgen (vulkaan/moeras/kust-spray),
      bladeren dwarrelen (bos/amber), sneeuw valt (toendra/top/berg), stuifzand
      waait (woestijn), stofjes (default) — getekend ín de pixel-laag

## Deel B — Overworld-atmosfeer

### Stap B1 — Geanimeerde tegels ✅
- [x] Water: periodieke zonneglinster toegevoegd (golfjes + schuim bestonden al)
- [x] Hoog gras wuifde al met de anim-teller — geverifieerd, niets nodig

### Stap B2 — Weer per gebied ✅
- [x] Bestond al volledig (regen/bladeren/sneeuw/zandstorm/as + onweersflitsen via
      DG_MAP_WEATHER) — gecontroleerd en intact gelaten

### Stap B3 — Nacht & wolken ✅
- [x] Vuurvliegjes: 7 dwalende gloeipuntjes met puls, additief, bóven de
      nacht-dimming getekend — f11_overworld_nacht.png
- [x] Wolkschaduwen: 2 grote zachte vlekken die overdag langzaam overdrijven —
      f11_overworld_dag.png

## Stap 5 — Integratie & eindtest ✅
- [x] Screenshots: battle coastal/vulkaan/nacht + overworld dag/nacht
- [x] Regressie: battle-flow, HUD, mons en effecten onaangetast (alles ná de
      achtergrond-blit tekent op het echte canvas)
- [x] 0 console-errors; versie-bumps: spriteRenderer ?v=93, renderer ?v=88

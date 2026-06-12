# FASE 12 — Leesbaarheid, DinoMons v3 & Battle-uitlijning

> `[ ]` = te doen · `[x]` = klaar

## Deel A — Overworld-leesbaarheid ✅
- [x] Oever-randen: buren-bewuste pass in de renderer (bitmask per kant) — watertegels
      krijgen donkere waterlijn + geanimeerde schuimrand waar land grenst (f12_shore.png)
- [x] Contrast-pass: kust-gras van teal naar groen (kort + hoog gras), water dieper blauw
- [x] Pad-randen waar pad aan gras grenst (zelfde mechaniek)
- [x] Hek-tegel (70) getekend + patch: boomblokken naast het pad op Route 1/1A/1B worden
      hekken — beide solide, dus loopbaarheid identiek (f12_fences.png)

## Deel B — DinoMon-sprites v3 ✅
- [x] Patroon-overlays type-gestuurd (strepen/vlekken/schubben/counter), periode + fase
      per soort via seed — Tindrel heeft tijgerstrepen, Boneback stippen (f12_dinos_v3.png)
- [x] Counter-shading: rug −8% → buik +10% op alle soorten
- [x] Dither-tweede-ring in licht én schaduw (dambord-pixels)
- [x] Gekleurde outlines: per pixel ×0,32 van de aangrenzende kleur

## Deel C — Battle-uitlijning ✅
- [x] Vijand-anker +49px: sprite-centrum op het platformcentrum (290) — schaduw,
      status-aura, dig-zandhoop, EPOS (290) en ECTR (290) mee (f12_battle_align.png)
- [x] Speler-kant klopte al (centrum 73 vs platform 71)

## Eindtest ✅
- [x] Screenshots: dino-raster v3, battle-uitlijning, hekken, oeverranden
- [x] 0 console-errors; versie-bumps: maps ?v=89, battleAnim ?v=94,
      spriteRenderer ?v=94, renderer ?v=89

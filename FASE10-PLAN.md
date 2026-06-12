# FASE 10 — Move-visuals: van 15 sjablonen naar herkenbare aanvallen

> Status-legenda: `[ ]` = nog te doen · `[x]` = klaar · `[~]` = mee bezig

## Stap 0 — Analyse ✅
- [x] 976 move-entries verdeeld over 15 generieke deeltjes-sjablonen; top-3 (MELEE/SLAM/
      BURST) dekt ⅓ van alles — Flamethrower is dezelfde puf als Ember
- [x] Twee moves verwijzen naar niet-bestaande stijlen (SPARKLE, SLASH) → stille fallback
- [x] Beam heeft als enige een getekende vorm — dat wordt het model voor de nieuwe stijlen

## Stap 1 — Acht nieuwe getekende stijl-primitieven ✅
- [x] STREAM — straal met golvende tongen uit de bek (f10_stream.png: échte vlammenwerper)
- [x] BOLT — vertakte bliksem van boven met flits + zijtak (f10_bolt.png)
- [x] RAIN — bombardement uit de lucht met inslag-stof; na eerste check dichter gemaakt
      (spawn ×2, grotere brokken — f10_rain2.png)
- [x] SLASH — klauw-halvemanen over het doelwit (f10_slash.png)
- [x] CHOMP — kaakhelften met tanden klappen dicht (f10_chomp.png)
- [x] ORB — opladen bij de bek → vliegt in een boog → explodeert (f10_orb.png)
- [x] QUAKE — zwarte grond-scheuren + puin + zware dreun (f10_quake.png)
- [x] TWISTER — draaiende wervelbanden om het doelwit (f10_twister.png)

## Stap 2 — Slimme toewijzing ✅
- [x] Expliciete lijst (~45 iconische moves) + 8 naam-patronen als data-patch in moves.js
      — datacheck: 124 moves hergemapt (STREAM 18, BOLT 15, SLASH 37, CHOMP 13,
      ORB 12, QUAKE 7, RAIN 7, TWISTER 15)
- [x] STATUS-moves onaangeroerd, multi-hits behouden MULTI (Fireworks ✓), SPARKLE gerepareerd
- [x] Karakter-parameters: Flamethrower breed, Hydro Pump dun/snel, Water Gun klein,
      Overheat extra breed, Thunder 3 schichten vs Thunder Shock 1

## Stap 3 — Element-impacts op de verdediger ✅
- [x] 16 type-eigen inslagen bij move-afronding (vuur t/m normal), alleen bij schade-moves
- [x] Eén subtiele ring als onderlaag (tweede ring vervangen door de element-burst)

## Stap 4 — Gewicht voor zware moves ✅
- [x] Power ≥ 100: 16-frame mini-charge (convergerende energie, geen letterbox/banner/
      slow-motion) — windup-vonkjes zichtbaar op f10_windup.png

## Stap 5 — SFX-accenten per stijl ✅
- [x] playStyleAccent in audio.js: BOLT donderklap (met echo), STREAM aanhoudende jet,
      CHOMP dubbele kaak-klik, QUAKE 38Hz-rommel met tremolo, SLASH 3 zwiepen,
      ORB oplaad-glissando, TWISTER windvlaag, RAIN 3 doffe ploffen

## Stap 6 — Integratie & eindtest ✅
- [x] Visuele matrix: alle 8 stijlen vastgelegd in een echte battle (f10_*.png)
- [x] Regressie: signature-cinematics intact ("★ Frill Flare ★" + letterbox op
      f10_sig_regressie.png); multi-hits onaangetast
- [x] Performance 1,4 ms/frame; 0 console-errors over de hele fase
- [x] Versie-bumps: moves ?v=82, battleAnim ?v=93, audio ?v=85

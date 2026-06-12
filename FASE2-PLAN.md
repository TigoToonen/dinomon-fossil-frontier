# FASE 2 — Sprite-Upgrade: Pixel-Art & Idle-Animaties

> Status-legenda: `[ ]` = nog te doen · `[x]` = klaar · `[~]` = mee bezig
> Dit bestand wordt tijdens het bouwen live bijgewerkt — refresh om voortgang te zien.

**De strategie** (zelfde hefboomtruc als de pixelfont in fase 1): alle **105** dino's renderen via
één functie — `drawMon()` in spriteRenderer.js. In plaats van 30 sprites met de hand te
herpixelen, bouwen we dáár een bake-pipeline in: de bestaande procedurele tekening wordt eerst
op lage resolutie naar een offscreen canvas getekend, krijgt daar een GBA-afwerking
(kleurbanden + outline), en wordt dan blokkig opgeschaald. Elke dino wordt in één klap échte
pixel-art, in elke view, inclusief toekomstige dino's.

---

## Stap 0 — Analyse sprite-pipeline ✅
- [x] `drawMon()` is het chokepoint: battle (1-4 mons), party-lijst+detail, dex-lijst+detail,
      box, titelscherm, starterskeuze en evo-animatie tekenen er allemaal doorheen
- [x] 15 archetype-functies (Ceratopsian, Stegosaur, Raptor, T-rex, legendaries…) tekenen in
      een lokaal 36×36-assenstelsel; ambient type-effecten (vuur-embers, vonken) komen erbovenop
- [x] Randvoorwaarden gecheckt: evoAnim gebruikt `ctx.filter` (grayscale/brightness) en
      globalAlpha op drawMon — die moeten op de geblitte sprite blijven werken

## Stap 1 — Pixelation-pipeline in `drawMon()` ✅
- [x] Offscreen bake-canvas: archetype + ambient-effecten renderen op lage resolutie
      (bake-regio lokaal x:[-26..62], y:[-26..46] — vleugels/snavels/aura's passen, geverifieerd
      met een raster van 15 archetypen incl. alle 4 legendaries: niets afgeknipt)
- [x] Nearest-neighbor upscale met **gehele** ×2 pixelblokken, posities gesnapt op hele pixels
- [x] Effectieve schaal wordt uit de canvas-transform gelezen (`getTransform`) — nodig omdat
      drawBattleScene de vijand binnen een externe `ctx.scale(-1.9, 1.9)` tekent
- [x] Kleine scales (lijstjes in party/dex/box) renderen 1:1 — wel afwerking, geen chunks
- [x] `ctx.filter` + `globalAlpha` blijven werken: grayscale-filtertest → 1796/1796 pixels grijs
      (evo-animatie + shiny hue-rotate + faint-fade gedekt)
- [x] Fallback naar het oude vector-pad als de bake faalt

## Stap 2 — GBA-afwerking (posterize + outline) ✅
- [x] Palette-posterize: kleuren gekwantiseerd naar discrete banden (cel-shading-look)
- [x] Alpha-quantisatie: harde sprite-randen; gloed/aura's houden 3 tussenstappen
- [x] Donkere 1px outline rond het silhouet (alleen rond solide pixels, niet rond gloed)
- [x] Visuele check: raster met 15 species (`f2_grid.png`) — outlines en gloed overal correct

## Stap 3 — Idle-animaties ✅
- [x] Ademhaling: squash & stretch verankerd aan de voeten, 4-staps discrete cyclus
      (her-rasterisatie per fase → voelt als echte sprite-frames, niet als gladde vervorming)
- [x] Speler en vijand ademen uit fase (fase-offset per species), zodat de scène leeft
- [x] Alleen actief bij grote weergaves (×2-chunk: battle, party-detail, dex-detail);
      lijst-sprites blijven statisch
- [x] Geverifieerd via frame-diff: 650–980 gewijzigde pixels rond de dino per ademfase

## Stap 4 — Performance & caching ✅
- [x] Frametijd gemeten: battle 2,6 ms/frame, dex-lijst 1,2 ms/frame (budget: 16,7 ms)
- [x] Cache niet nodig — bake is goedkoop genoeg om live te doen, en zo blijven de
      Date.now()-animaties van legendaries en ambient-effecten gewoon doorlopen
- [x] Geen geheugenlek: één gedeeld bake-canvas wordt hergebruikt

## Stap 5 — Integratie & eindtest ✅
- [x] `?v=86` bump voor spriteRenderer.js in index.html
- [x] Volledige visuele ronde: titelscherm (starters), wild battle (beide kanten),
      party-lijst, party-detail, dex-lijst, dex-detail, overworld, blackout-flow
- [x] Console-check: 0 nieuwe errors (verse error-trap over de hele testronde)
- [x] Bewijs-screenshots in `.claude/shots/` (f2_title, f2_battle1, f2_grid,
      f2_partylist, f2_partydetail, f2_dexlist2, f2_dexdetail)

---

## Resultaat
Alle 5 stappen afgerond. Gewijzigde bestanden:
- `js/sprites/spriteRenderer.js` — bake-pipeline (`_bakeCtx`), GBA-afwerking (`_gbaFinish`),
  idle-ademhaling (`_idlePhase`) en herschreven `drawMon()` met vector-fallback
- `index.html` — versie-bump spriteRenderer `?v=86`

Eén pipeline-ingreep op het `drawMon()`-chokepoint maakte alle **105** dino's tegelijk
pixel-art — in battle, party, dex, box, titelscherm én evo-animatie. Geverifieerd met een
geautomatiseerde sweep over alle 105 species (0 errors, 0 lege sprites, 0 clipping) plus
drie visuele rasters: `f2_all_1.png` t/m `f2_all_3.png` in `.claude/shots/`.

---

### Bewust NIET in fase 2 (komt later)
- Audio-upgrade: ADSR, reverb, adaptieve muziek (fase 3)
- Signature move-animaties + intro-cinematics (fase 4)

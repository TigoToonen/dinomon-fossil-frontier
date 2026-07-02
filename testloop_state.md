# 🔁 Testloop-staat — oneindige feedback-loop

## RONDE 3 — VERDIEPING, VOLLEDIG GROEN (juli 2026)
Nieuwe dimensies (geen herhaling):
- ✅ deepsweep.js (nieuw, 22 checks): corrupt-save-robuustheid (7 soorten kapotte JSON → nooit een crash, listSlots overleeft), evolutie via échte battle-EXP (TINDREL→TINDRAK op lv16, queue werkt), soak van 25 opeenvolgende gevechten op één gamestate (beloning elke keer exact, geen volatile-restanten)
- ✅ Mode-fuzz (fuzz.js: HARD=1 / WEATHER=<key> env-support): 480 extra chaos-gevechten onder Hard Mode, SANDSTORM, BLIZZARD en HARD+ASH_FALL — 0 hangs/exceptions. Fuzz-totaal: 1440 gevechten over 12 seeds/modes
- **Bugs gevonden in ronde 3: NUL**

## RONDE 2 — VOLLEDIG GROEN (volledige her-run vanaf het begin, juli 2026)
Alle 12 harnesses opnieuw gedraaid + visuele her-pass + browser-checks:
- ✅ validate_game (0 blocking) · bugcheck · integrity_scan · walkthrough (start→credits) · contentsweep · persistsweep — alle exit 0
- ✅ movesweep (1005 moves) · trainersweep (163 trainers) · simbattle (28 checks) · edgesweep (10 checks)
- ✅ fuzz VERSE seeds 20260702/88888/12321 — 360 nieuwe chaos-gevechten schoon (totaal 960 over 8 seeds)
- ✅ Visuele her-pass: alle 118 maps opnieuw geschoten (r2_vis0-4) en beoordeeld — geen regressies
- ✅ G1 input-chaos ronde 2 (menu+battle-mix) · G3 1,06 ms/frame · 0 console-warnings
- **Bugs gevonden in ronde 2: NUL** — de 7 fixes uit ronde 1 houden stand; geen regressies uit parallel werk
> Dit bestand is het geheugen van de bugtest-loop. Elke iteratie: lees dit,
> pak het volgende blok, test, fix, borg regressie, commit, werk dit bij.
> Prioriteit: speler-blokkerend > fout gedrag > cosmetisch.

## Dekking  (⬜ open · 🔄 bezig · ✅ gedekt · ♻️ herhalen per ronde)

### A. Progressie & Wereld
- ✅ A1 Playthrough-simulatie start→credits (walkthrough.js) — 9/9 badges in juiste volgorde, 3/3 eindvlaggen, 118/119 maps, exit 0
- ✅ A2 Softlock-jacht map-niveau (terugweg-scan in walkthrough.js: 0 warnings) — NB: duw-states van Strength-rotsen niet modelleerbaar, handmatige playtest-notitie
- ⬜ A3 Alle field-move-gates per map (83-87) + fly naar elke stad
- ⬜ A4 Overworld-fysica (collision, ice, lava, warps 2-richtingen)
- ✅ A5 Encounter-tabellen (integrity_scan.js) — 3 BUGS GEFIXT: MT_CRETACEOUS/GLACIAL_PASS/APEXSUMMIT_WILD hadden 0 encounter-tegels (tabellen dood), STONEHAVEN_WILD lege grass-tabel; loader-patch `_ensureEncounterTiles` + tabel-fix. Fishing/safari/repel nog ⬜
- ✅ A6 Flags-integriteit (integrity_scan.js: referenced-vs-grantable, 0 warns) — quest-keten-runtime nog ⬜

### B. Gevechten
- ✅ B1 Alle 1005 moves 1× echt uitgevoerd (movesweep.js: 0 FAIL; 8 onbereikbare dode moves genoteerd, OMNI_RAISE-status-gat gedicht)
- ✅ B2 Alle 163 trainers volledig uitgevochten (trainersweep.js: 160W/3L/0 FAIL) — KRITIEKE LIVELOCK GEFIXT; scripted 2v2-double-battle (Flint+Morax vs Cretaceous) headless WIN na 123 beurten (it.10)
- ✅ B3 Alle 121 soorten: create lv5/36/71/100, stats/moves geldig, evolutie- en steen-ketens kloppen (contentsweep.js: 0 FAIL/0 WARN)
- ✅ B4 Status/volatile-lekken (simbattle test 4 + battle-einde-strip)
- ✅ B5 Battle-randgevallen (edgesweep.js: Struggle bij PP-op, vangen→party/box/box-vol-release, bal-op-trainer geweigerd — 0 FAIL)

### C. Items & Economie
- ✅ C1 Item-effecten: heal/cure/revive incl. weigering op ongeldig doel, ballen, stenen (contentsweep.js: 0 FAIL) — shop-koop/verkoop-UI nog ⬜
- ✅ C2 Economie-flows (edgesweep.js) + shop-UI beide richtingen live geverifieerd: koop exact −¥3000, SELL exact +¥150 (halve prijs), voorraad klopt (it.9/11). Fly-runtime end-to-end OK (bestemmingen op VISITED_-flags, cutscene, aankomst voor DinoCenter — it.11)

### D. Visueel
- ✅ D1 Screenshot-pass ALLE 118 maps beoordeeld (collages vis01-vis13 in .claude/shots) — geen kapotte tiles/sprites/layouts; Murk Hollow-duisternis = bedoelde Flash-mechaniek; nieuwe encounter-tegels ogen als rotspartijen (past bij thema)
- ✅ D2 UI-schermen: party/bag/battle/shop visueel geverifieerd met extreme data (d3_*-shots, it.9); dex/kaart/badges eerder al door parallelle sessie
- ✅ D3 Tekst-overflow: 12×W-namen passen in party + battle-nameplates; ¥9.999.999 nu netjes — 2 BUGS GEFIXT: ¥-glyph ontbrak in pixelfont (baseline-verschoven fallback-rendering) + shopgeld verdween achter de SAVED-badge

### E. Verhaal & Dialogen
- ✅ E1 Elke dialogue-key bestaat (integrity_scan.js: NPC's + trainers, 0 missing)
- ✅ E2 Quiz-gyms: alle 24 vragen structureel gezond (optionA=juist, afleiders bevatten het juiste antwoord niet, flags compleet) — runtime shuffle/reset via gym-reset-mechaniek al gedekt

### F4 (uit F-blok)
- ✅ F4 Hard Mode actief: heal-items geweigerd in battle, ballen toegestaan (edgesweep.js)

### F. Systemen & Persistentie
- ✅ F1 Save/load-roundtrip (persistsweep.js: 23 checks) + legacy-migratie werkt bij page-load (oude single-save → slot 0, geladen met naam/geld/mons intact — it.11)
- ⬜ F2 PC/Box vol + laatste mon
- ⬜ F3 Eggs & fossiel-incubatie
- ⬜ F4 Difficulty modes echt actief
- ⬜ F5 Opties persisteren

### G. Techniek
- ✅ G1 Input-misbruik: key-spam tijdens warp-transities, raw bursts en battle-intro's (3 rondes) — 0 errors, staat herstelt netjes (it.9)
- ✅ G2 Console-hygiëne: 0 errors/warnings over boot + save-load + 118 map-warps + menu's + live gevecht (preview-sessie it.6)
- ✅ G3 Performance: 1,38 ms/frame (12× marge op 60fps) + mobiele canvas-scaling OK (375px: aspect behouden, touch-controls + knoppen zichtbaar — it.11)
- ✅ G4 Audio-keys bestaan overal (integrity_scan.js: playMusic-calls + map.music, 0 missing)

### H. Verdieping (loop ♻️)
- ♻️ H1 Fuzz (fuzz.js, seedbaar): 600 chaos-gevechten over 5 seeds (424242/777/31337/90210/555) — 0 hangs/0 exceptions; elke ronde nieuwe seeds draaien

### F3 (uit F-blok)
- ✅ F3 Eggs: hatch-flow/daycare-structuur gereviewd; eggs geblokkeerd in battle-switch (UI én engine-guards); egg-blackout-softlock gefixt; fossiel-incubatie-logica gereviewd (steps→FOSSIL_READY→lab-revive, beide meldingspaden kloppen) — it.10
- ✅ F5 Opties persisteren (persistsweep) + Battle FX werkt (simbattle-sessie)

## Gevonden bugs (open)
_(geen)_

## Gefixt deze loop
1. **MT_CRETACEOUS / GLACIAL_PASS / APEXSUMMIT_WILD: nul wilde encounters** — tabellen bestonden, maar geen enkele encounter-tegel (2/8). Fix: `_ensureEncounterTiles`-loader-patch in maps.js (149 tegels) — it.2.
2. **STONEHAVEN_WILD: gras-tegels (2) lazen de lege grass-tabel**; de gevulde cave-tabel werd daar genegeerd. Fix: grass-tabel gevuld — it.2.
3. **KRITIEK — oneindige faint-loop bij AI-switch**: `_doEnemySwitch` synchroniseerde `enemyPartyIndex` niet; bij de volgende faint zocht de engine alleen voorbij de index en miste de nog-levende mon ervóór → livelock + herhaalde EXP (trof o.a. Niels-rematch en gym-rematches). Fix: faint-advance zoekt de eerste levende mon + switch synct de index — it.3.
4. **OMNI_RAISE als status-move deed niets** ("But it failed!") — case toegevoegd in `_applyStatusMove` — it.3.
5. **KRITIEK — egg-blackout-softlock**: een EI telde als "levende mon" in de blackout-check; party = alle mons fainted + ei → geen blackout én niet kunnen wisselen → speler zat voor eeuwig vast in het switch-scherm. Fix: eggs uitgesloten in beide alive-checks + engine-guards tegen egg-switches — it.8 (fuzz-vondst, 360/360 gevechten daarna schoon).
6. **¥-teken rendere verschoven** (pixelfont miste de glyph; fallback negeerde de baseline) — ¥-glyph toegevoegd aan uiKit + fallback-baseline-fix — it.9.
7. **Shopgeld verdween achter de SAVED-badge** bij hoge bedragen — rechts uitgelijnd vóór de badge-zone — it.9.

## Design-vragen voor Tigo
_(geen)_

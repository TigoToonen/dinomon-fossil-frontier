# 🔁 Testloop-staat — oneindige feedback-loop
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
- ✅ B2 Alle 163 trainers volledig uitgevochten (trainersweep.js: 160W/3L/0 FAIL) — KRITIEKE LIVELOCK GEFIXT; scripted double-battle nog ⬜
- ✅ B3 Alle 121 soorten: create lv5/36/71/100, stats/moves geldig, evolutie- en steen-ketens kloppen (contentsweep.js: 0 FAIL/0 WARN)
- ✅ B4 Status/volatile-lekken (simbattle test 4 + battle-einde-strip)
- ✅ B5 Battle-randgevallen (edgesweep.js: Struggle bij PP-op, vangen→party/box/box-vol-release, bal-op-trainer geweigerd — 0 FAIL)

### C. Items & Economie
- ✅ C1 Item-effecten: heal/cure/revive incl. weigering op ongeldig doel, ballen, stenen (contentsweep.js: 0 FAIL) — shop-koop/verkoop-UI nog ⬜
- ✅ C2 Economie-flows (edgesweep.js: blackout op ¥0 blijft 0, beloning exact, Compound Card ×1.5 exact 1×) — shop-UI-koop/verkoop nog ⬜

### D. Visueel
- ✅ D1 Screenshot-pass ALLE 118 maps beoordeeld (collages vis01-vis13 in .claude/shots) — geen kapotte tiles/sprites/layouts; Murk Hollow-duisternis = bedoelde Flash-mechaniek; nieuwe encounter-tegels ogen als rotspartijen (past bij thema)
- 🔄 D2 UI-schermen: overworld/menu/party/battle-scene visueel OK (vis14_ui); bag/dex/kaart/badges recent al visueel geverifieerd door parallelle sessie — volgende ronde opnieuw schieten met betere menu-choreografie
- ⬜ D3 Tekst-overflow (12-char namen, ¥, substituties)

### E. Verhaal & Dialogen
- ✅ E1 Elke dialogue-key bestaat (integrity_scan.js: NPC's + trainers, 0 missing)
- ✅ E2 Quiz-gyms: alle 24 vragen structureel gezond (optionA=juist, afleiders bevatten het juiste antwoord niet, flags compleet) — runtime shuffle/reset via gym-reset-mechaniek al gedekt

### F4 (uit F-blok)
- ✅ F4 Hard Mode actief: heal-items geweigerd in battle, ballen toegestaan (edgesweep.js)

### F. Systemen & Persistentie
- ✅ F1 Save/load-roundtrip (persistsweep.js: 23 checks — party/status/shiny/held/bag/geld/badges/flags/dex/box/beachcoin/tower/locatie/settings + dubbele roundtrip + slot-onafhankelijkheid + delete) — legacy-migratie nog ⬜
- ⬜ F2 PC/Box vol + laatste mon
- ⬜ F3 Eggs & fossiel-incubatie
- ⬜ F4 Difficulty modes echt actief
- ⬜ F5 Opties persisteren

### G. Techniek
- ⬜ G1 Input-misbruik / transitions
- ✅ G2 Console-hygiëne: 0 errors/warnings over boot + save-load + 118 map-warps + menu's + live gevecht (preview-sessie it.6)
- ⬜ G3 Performance / canvas-scaling
- ✅ G4 Audio-keys bestaan overal (integrity_scan.js: playMusic-calls + map.music, 0 missing)

### H. Verdieping (loop ♻️)
- ♻️ H1 Combinatie-stress + fuzz; terug naar A met nieuwe kennis

## Gevonden bugs (open)
_(geen)_

## Gefixt deze loop
1. **MT_CRETACEOUS / GLACIAL_PASS / APEXSUMMIT_WILD: nul wilde encounters** — tabellen bestonden, maar geen enkele encounter-tegel (2/8). Fix: `_ensureEncounterTiles`-loader-patch in maps.js (149 tegels) — it.2.
2. **STONEHAVEN_WILD: gras-tegels (2) lazen de lege grass-tabel**; de gevulde cave-tabel werd daar genegeerd. Fix: grass-tabel gevuld — it.2.
3. **KRITIEK — oneindige faint-loop bij AI-switch**: `_doEnemySwitch` synchroniseerde `enemyPartyIndex` niet; bij de volgende faint zocht de engine alleen voorbij de index en miste de nog-levende mon ervóór → livelock + herhaalde EXP (trof o.a. Niels-rematch en gym-rematches). Fix: faint-advance zoekt de eerste levende mon + switch synct de index — it.3.
4. **OMNI_RAISE als status-move deed niets** ("But it failed!") — case toegevoegd in `_applyStatusMove` — it.3.

## Design-vragen voor Tigo
_(geen)_

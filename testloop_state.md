# 🔁 Testloop-staat — oneindige feedback-loop

## RONDE 9 — GROTE ENGINE-BUG: ~helft van de roster kon niet aanvallen (juli 2026)
De Elite-Four-gauntlet-audit (e4gauntlet.js, nieuw) legde een 0%-clear bloot; instrumentatie leidde naar de echte oorzaak, NIET balans maar een engine-bug:
- **BUG (kritiek, hele game): `createDinoMon` gaf auto-movesets via `learnedAll.slice(-4)` = laatste 4 learnset-moves, zonder damage-garantie. 56 van de 121 soorten (incl. starter PYROCERATH, TITANOSAUR, GHOSTBONE, MEGASTONE, SKYFANG) spawnden met UITSLUITEND setup-moves (Swords Dance/Bulk Up/Work Up...) → konden niet aanvallen.** Wild stonden ze eeuwig te buffen; gevangen was de mon nutteloos tot handmatig herleren.
- **FIX** (saveload.js v82): auto-derive begint met recentste 4 maar garandeert tot 2 damage-moves door oudste status-slots te ruilen. Na fix: 0/121 soorten zonder aanval. Setup-flavor blijft (2 damage + 2 setup).
- Dit verklaarde ook de "onwinbare" E4: mijn gauntlet-teams zaten er vol mee. Aparte balans-vraag (E4 attrition-zwaarte) pas te beoordelen ná deze fix.
- Nieuw permanent meet-instrument e4gauntlet.js (no-heal 5-battle attrition-model, COVERAGE/SMART/ITEMS-modi).
- **Impact-bewijs** (competente speler, e4gauntlet): Aurora faalde 26/40 vóór → 3/40 ná de fix; de gauntlet loopt nu vloeiend door tot Phantom/Champion (logische no-heal-eindmuur). Regressie na fix: validate 0-blocking, bugcheck 0, contentsweep 0. saveload.js v82.
- Open (informatief, geen bug): de E4 blijft een steile no-heal-attrition; volledige 0% auto-clears is puur mijn item-loze model (echte speler met potions cleart Phantom/Corvus). Balans-oordeel pas na playtesting.

## RONDE 8 — BALANS-AUDIT: ECHTE DIFFICULTY-SPIKE GEVONDEN (juli 2026)
Eerste ronde die géén "groen/rood" is maar een DESIGN-bevinding. gymgauntlet.js (nieuw): simuleert per gym N=40 gevechten met de speler-kant door de echte BattleAI (tier 3, competent, geen items), 3 team-modellen ter controle.
- **Vondst**: de moeilijkheid maakt een CLIFF na Terra. Eerste 6 gyms ✓ (prepared speler ~100%). Laatste 3 blijven over ALLE modellen een spike:
  - Volt (lv50): 43–45% win, 47–65 beurten, haalt regelmatig de turn-cap (draws) — verlamming-spam (4×Thunder Wave+3×Static) + 2×Lightning Rod muurt Electric-teams
  - Marina (lv58): 8–18% win
  - Valdez (lv68): 3% win — bijna onwinbaar zelfs voor een type-counter, over-leveld, sterk team
- **Vals alarm opgelost**: AFK Jorn leek een spike (40%) maar was mijn kale random-model; met een fatsoenlijk team 80–98% → gebalanceerd.
- Caveat in het model: geen items/revives (echte speler heeft die wel), dus absolute % is een ondergrens; de RELATIEVE cliff is het echte signaal.
- **BESLIST (Tigo): matig verzachten** → doorgevoerd it.8:
  - Volt: verlamming-spam 4×→1× Thunder Wave (rest offensief), levels −2 → stall grotendeels weg (draws sterk omlaag, win 43→80% bij vast speler-level)
  - Marina: Toxic-stall 3×→1×, levels −3
  - Valdez: 6→5 mons (dubbele TEMPESTFANG eruit), levels −3 → win 3→18% bij vast speler-level
  - trainers.js v101. Methodologie-noot: het model verbiedt items/strategisch wisselen, dus absolute % is een pessimistische ONDERGRENS — bewust NIET najagen tot exact 55-70% om de finale niet kapot te nerfen voor echte spelers (die items hebben). De relatieve cliff is nu fors zachter.
- Nieuw meet-inzicht in gymgauntlet.js: speler-level = ROUTE_LEVEL (los van gym-ace) zodat een gym-nerf de speler niet meeverzwakt.
- **Eindverificatie na rebalans**: trainersweep 160W/3L/**0 FAIL** (identiek aan vóór; geen kapotte movesets/exceptions). 3 aangepaste gyms los verslaanbaar (Volt 35/Marina 15/Valdez 10 beurten met sterk team). Valdez→E4-gap gecheckt: Valdez ace 65 → eerste Elite (Aurora) 80; die +15 bestond al (+12 met oude lv68) en wordt overbrugd door Fossil Training Grounds + rematches → GEEN nieuwe cliff door mijn −3.

## RONDE 7 — MECHANISCHE CORRECTHEID, VOLLEDIG GROEN (juli 2026)
Nieuwe dimensie: niet "crasht niet" maar "doet het JUISTE". mechsweep.js (nieuw, 11 checks) met vastgezette RNG + synthetische soorten (gecontroleerde types/stats):
- ✅ STAB = exact 1,5× · super-effectief = 2× + juist label · niet-erg = 0,5× · immuniteit = 0 damage
- ✅ +2 aanval-stage ≈ 2× damage · crit vuurt bij lage roll en verhoogt · burn = 0,5× op fysiek
- ✅ Gedrag in echte gevechten: +prio-move slaat eerst ondanks lage speed · recoil beschadigt gebruiker · 34 multi-hit-moves hebben geldige hit-ranges (1-5) · geen OHKO-moves (n.v.t.)
- **Bugs gevonden in ronde 7: NUL** — de damage-formule is nu bewezen correct, niet alleen crash-vrij

## RONDE 6 — ONBOARDING + POST-GAME-FEATURES, VOLLEDIG GROEN (juli 2026)
Het echte nieuwe-speler-pad en mijn eigen features via het interactie-pad:
- ✅ Nieuwe-speler-onboarding volledig via echte input: titel → slot → naam typen ("Bot") → starter (Tindrel lv5) → rival-gevecht → STARTER_CHOSEN + RIVAL_NAMED-flags, aankomst DinoCenter
- ✅ Battle Tower end-to-end: Tower Master aanspreken → keuzemenu → "Tower Challenger #1" gevecht → winst → towerStreak 0→1, towerBest bijgewerkt
- ✅ Move Relearner (Compound City): NPC bedraad, dialoog opent, logica geverifieerd (learnset-filter op ≤level & niet-geleerd, ¥3000-fee, slot-vervanging) — correct
- ✅ Name Rater aanwezig (Compound City 15,12)
- Diagnose-noot: 2 initiële "faal"-metingen waren beide harnas-artefacten (speler keek verkeerde kant op / blinde menu-navigatie), geen game-bugs
- **Bugs gevonden in ronde 6: NUL** — vijfde opeenvolgende schone ronde

## RONDE 5 — ECHTE-GAMEPLAY-INTEGRATIE, VOLLEDIG GROEN (juli 2026)
Voor het eerst alles via écht spelen (toetsen, lopen, zichtlijnen) i.p.v. programmatisch:
- ✅ Gras-encounter door echt te LOPEN: 13 stappen in hoog gras → wilde Bugling lv5 (conform tabel), wegvluchten OK
- ✅ Trainer-line-of-sight volledig: stap in Bretts zichtlijn → alert → auto-engage → gevecht → winst → defeat-flag → exact ¥200
- ✅ Alle 3 veldmove-gates door echt gameplay geklaard: Rock Smash (Route 3A), Cut (Route 5A), Strength (Safari Zone) — tegel 84/85/86 → vloer
- ✅ Alle 15 animatiestijlen afgevuurd in de echte renderer — 0 errors
- ✅ Audio produceert echt signaal (getLevel 0.0055) · 0 console-warnings
- **Bugs gevonden in ronde 5: NUL** — vierde opeenvolgende schone ronde

## RONDE 4 — DUBBELGEVECHT-CHAOS, VOLLEDIG GROEN (juli 2026)
- ✅ doublefuzz.js (nieuw): 80 chaos-2v2-gevechten over 2 seeds (random trainer-trio's, random targeting via switchDoubleTarget, ongeldige moves/switches, gewonde parties) — 0 hangs/exceptions; de double-faint-logica bevat GEEN variant van de single-battle-livelock
- ✅ Tower-teamgeneratie: alle streak-tiers 0-50 leveren geldige teams (lv-cap 95)
- ✅ Beachcoin-invarianten hercheckt (20k simulaties): cap exact ≤1,5×, nooit negatief
- **Bugs gevonden in ronde 4: NUL** — derde opeenvolgende schone ronde

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
8. **KRITIEK — 56/121 soorten konden niet aanvallen**: `createDinoMon` auto-moveset = `learnedAll.slice(-4)` pakte de 4 hoogste learnset-moves, vaak allemaal setup. Wild-encounters stonden eeuwig te buffen; gevangen mons waren nutteloos. Fix: damage-move-garantie (tot 2) in de auto-derive — ronde 9. Gevonden via de Elite-Four-attrition-audit.

## Design-vragen voor Tigo
- ✅ AFGEHANDELD: late-game difficulty-cliff → Tigo koos "matig verzachten", doorgevoerd it.8 (zie ronde 8 hierboven). Open vervolg: Marina bleef in het model taai (~10-13%) omdat de nerf alleen levels/Toxic raakte, niet de bulk van SWAMPJAW/TIDANOSAURUS — als playtesting het bevestigt kan een extra pass Marina's bulk/coverage temperen.

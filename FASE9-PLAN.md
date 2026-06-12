# FASE 9 — Playtest-polish ronde 2 (8 punten)

> Status-legenda: `[ ]` = nog te doen · `[x]` = klaar · `[~]` = mee bezig

## Stap 0 — Analyse ✅
- [x] TWO_TURN-moves (Fly/Dig/Phantom Force) hebben alleen een tekstregel: geen
      onraakbaarheid, geen visual
- [x] Gym-vlaggen (quiz + verslagen trainers) blijven permanent staan na verlies
- [x] Blackout = korte fade + tekst achteraf; geen geldstraf
- [x] Foute-pad-trainer 2 kijkt naar beneden terwijl je links langsloopt → LOS mist je
- [x] Status-schade past HP stilletjes aan; geen schadegetal
- [x] 16 moves met effect-type 'MULTI_HIT' + hits als tekst ('2-5') — engine kent
      alleen 'MULTI' + [min,max] → ze raken 1×
- [x] REVIVE alleen in de eindshop; Shellcreek-shop-uitgang wijst nog naar de oude deur

## Stap 1 — Fly/Dig/Phantom Force ✅
- [x] Onraakbaar tijdens de oplaadbeurt — getest: "Tindrel avoided the attack!" in
      beeld, HP onaangetast (f9_dig_avoid/f9_dig_hit.png)
- [x] Visueel: Dig = dino weg + zandhoop met stofjes op het platform (f9_dig1.png),
      Fly = dino uit beeld (zelfde mechanisme), Phantom Force = schim op 15% alpha
- [x] Charge-visual netjes gereset bij aanval, faint, wissel en battle-start

## Stap 2 — Gym-reset bij verlies ✅
- [x] Getest: vlaggen gezet → verloren in de gym → quiz- én trainer-vlaggen gewist,
      speler bij het DinoCenter; badge/leider-vlaggen onaangetast; generiek (GYM_THEME)

## Stap 3 — Blackout-scherm + geldstraf ✅
- [x] Volledig zwart met "You have no DinoMons left to fight!" + groot rood
      "You blacked out!" (f9_blackout.png), hold van 150 frames
- [x] 50% geldverlies — gemeten: ¥729 → ¥365 — + melding bij het ontwaken
      (de oude code had een stille 10%-straf zonder melding)

## Stap 4 — Gym-trainers vallen automatisch aan ✅
- [x] Alle TW2-trainers (3 per gym × 8 gyms) kijken nu de gang in (LEFT) — datacheck ✓;
      line-of-sight (4 tegels) vangt je bij binnenkomst; TW1/TC stonden al op het pad

## Stap 5 — Zichtbare status-schade ✅
- [x] Schadegetallen bij status-ticks via onShow (oranje brand / paars gif / grijsblauw
      overig, incl. weer-schade), getimed met bericht + bestaande animatie
- [x] Bonus-bugfix: de weer-schade-code las DG.DINOMONS (bestaat niet) — elke beurt
      met schade-weer (Sea Spray, Sandstorm…) gooide een error en brak de
      end-of-turn af. Nu DG.SPECIES → weer-schade werkt voor het eerst écht

## Stap 6 — Multi-hit-reparatie ✅
- [x] Normalisatie-patch onderaan moves.js — datacheck: FIREWORKS = MULTI [2,5],
      20 werkende multi-hit-moves totaal; in battle getest: "Hit 1!" / "Hit 2!" ✓

## Stap 7 — Revive in de shops ✅
- [x] Shellcreek-shop: REVIVE erin, SUPERPOTION eruit (datacheck ✓)
- [x] REVIVE ook in de 4 midden-game-shoplijsten toegevoegd
- [x] Shop-uitgang wijst weer naar vóór de verplaatste deur

## Stap 8 — Integratie & eindtest ✅
- [x] Versie-bumps: moves ?v=81, maps ?v=88, battle ?v=88, battleAnim ?v=91,
      spriteRenderer ?v=91, renderer ?v=87, main ?v=84
- [x] Geteste flows: Dig-ontwijken, Fireworks-multi-hit, blackout + geldstraf,
      gym-verlies → volledige reset; 0 errors na de weer-bugfix
- [x] Save-hygiëne: Tigo's moves/HP/geld/positie hersteld na de tests

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
- ⬜ A5 Encounter-tabellen (rates/levels), fishing, safari, repel
- ⬜ A6 Flags-integriteit + quest-ketens end-to-end

### B. Gevechten
- ⬜ B1 Alle 1005 moves 1× echt uitgevoerd
- ⬜ B2 Alle 163 trainers volledig uitgevochten (incl. double battles)
- ⬜ B3 Alle 121 soorten: create/level/evolve/learnset/shiny
- ⬜ B4 Status/volatile-lekken over switch & battle-einde
- ⬜ B5 Battle-randgevallen (Struggle, forced switch, vangen→box)

### C. Items & Economie
- ⬜ C1 Elk item kopen/verkopen/gebruiken (geldig + ongeldig doel)
- ⬜ C2 Economie-flows (geen negatief/overflow, prijzen consistent)

### D. Visueel
- ⬜ D1 Screenshot-pass alle maps (ik beoordeel elk beeld)
- ⬜ D2 Alle UI-schermen
- ⬜ D3 Tekst-overflow (12-char namen, ¥, substituties)

### E. Verhaal & Dialogen
- ⬜ E1 Elke dialogue-key bestaat / geen rauwe keys op scherm
- ⬜ E2 Quiz-gyms: vragen/shuffle/fout-pad/reset

### F. Systemen & Persistentie
- ⬜ F1 Save/load-roundtrip na elke systeemactie; slots; legacy
- ⬜ F2 PC/Box vol + laatste mon
- ⬜ F3 Eggs & fossiel-incubatie
- ⬜ F4 Difficulty modes echt actief
- ⬜ F5 Opties persisteren

### G. Techniek
- ⬜ G1 Input-misbruik / transitions
- ⬜ G2 Console-hygiëne volledige playthrough
- ⬜ G3 Performance / canvas-scaling
- ⬜ G4 Audio-keys bestaan overal

### H. Verdieping (loop ♻️)
- ♻️ H1 Combinatie-stress + fuzz; terug naar A met nieuwe kennis

## Gevonden bugs (open)
_(geen)_

## Gefixt deze loop
_(nog geen)_

## Design-vragen voor Tigo
_(geen)_

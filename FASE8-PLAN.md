# FASE 8 — Playtest-polish (7 punten uit Tigo's speelsessie)

> Status-legenda: `[ ]` = nog te doen · `[x]` = klaar · `[~]` = mee bezig

## Stap 0 — Analyse ✅
- [x] Audio-haperen: scheduler plant maar 0,15s vooruit + ruis-buffers worden per
      stap/tik opnieuw gegenereerd (GC-druk) + reverb-belasting
- [x] "Mist": intro-flits dooft alleen uit tijdens move-animaties → waas blijft hangen
- [x] Witte ringen: impact-ringen op vaste ankers naast de dino's + fel door fase 6-glow
- [x] Route 1: wilde encounters kloppen; Lass Mina heeft een lv 6 FAIRYWING (trainerdata)
- [x] Vangkansen: formule capt op 94% — commons zitten op volle HP al aan die cap
- [x] Shellcreek City: shop-deur ingemetseld (rij 4 achter muur), center-warp aan de
      zijkant i.p.v. straatkant, nep-deur zonder warp op linkergebouw
- [x] Gym-quiz: opening van 2 tegels waarvan de quizmaster er 1 blokkeert; zijpaden
      4-5 tegels breed met maar 1 gate-tegel — geldt voor alle 8 gyms (zelfde formaat)

## Stap 1 — Audio-haperen ✅
- [x] Lookahead 0,15s → 0,4s, poll-interval 50 → 100 ms (ongevoelig voor drukke frames)
- [x] Ruis-buffers éénmalig genereren en hergebruiken via `_noise()`-cache
      (snare, hihat, 5 voetstap-varianten, vangst-whoosh/barst)
- [x] Voetstap-throttle: max ~12 stappen/s aan geluid

## Stap 2 — De "mist" bij battle-start ✅
- [x] Flits-uitdoving verplaatst: loopt nu altijd, niet alleen tijdens move-animaties
- [x] Visueel bevestigd: battle-start toont frisse kleuren zonder waas (f8_nomist.png)

## Stap 3 — Witte ringen ✅
- [x] Impact-ringen verankerd op de échte sprite-centra (PCTR/ECTR i.p.v. oude ankers)
- [x] Subtieler: kleiner, alleen type-kleur (felwitte ring weg), alpha 0,8 → 0,45
- [x] Charge-ringen van signature moves zelfde anker-fix

## Stap 4 — Balans: vangkansen + trainerteams ✅
- [x] Vangformule: deler 45 → 255, cap 94% → 90% — gemeten: Normlet (rate 200)
      volle HP 26%, bijna-dood 76%; zeldzaam (rate 45) volle HP ~6%
- [x] Lass Mina's lv 6 FAIRYWING → SPARKLET lv 6 (Route 1-soort); Jake/Rex-teams gecheckt

## Stap 5 — Shellcreek City: deuren ✅
- [x] DinoCenter: deur + warp naar de straatkant — in-game getest: recht naar binnen ✓
- [x] Shop: deur + warp van de ingemetselde rij naar de straatkant — getest ✓
- [x] Nep-deur zonder warp op het linkergebouw weggehaald

## Stap 6 — Gym-quiz wordt een echte poort ✅
- [x] Quiz-opening naar 1 tegel; quizmaster blokkeert fysiek — getest: speler komt
      er niet langs (positie blijft (14,16) bij duwen)
- [x] Na antwoord: vlaggen gezet, quizmaster weg, doorgang vrij (naar (14,14)) ✓
- [x] Zijpaden dichtgemetseld op de Energy Gates na: het pad van je antwoord opent
- [x] In één keer voor alle 8 gyms via een data-patch onderin maps.js

## Stap 7 — Integratie & eindtest ✅
- [x] Versie-bumps: audio ?v=84, battleAnim ?v=90, battle ?v=86, trainers ?v=86, maps ?v=87
- [x] Volledige ronde: battle zonder mist, ringen op de dino, vangkans-getallen,
      Mina-team, center/shop via de voordeur, gym-poort-flow end-to-end
- [x] Console-check: 0 errors over de hele fase
- [x] Save-hygiëne: test-autosave gecorrigeerd — quiz-vlaggen gewist, positie voor
      het Dino Center, Tindrel genezen

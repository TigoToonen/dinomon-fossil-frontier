# FASE 3 — Audio-Upgrade: Ruimte, Klankkleur & Adaptieve Muziek

> Status-legenda: `[ ]` = nog te doen · `[x]` = klaar · `[~]` = mee bezig
> Dit bestand wordt tijdens het bouwen live bijgewerkt — refresh om voortgang te zien.

**De strategie**: het audiosysteem (audio.js) heeft al een goede basis — een lookahead-
scheduler met 4 stemmen en per-type move-SFX. Wat ontbreekt is *productie*: alles klinkt
droog (geen reverb), de instrumenten hebben kale enveloppes, trackwissels zijn harde knips,
en de muziek reageert nergens op. Fase 3 bouwt een effects-bus (reverb/delay/compressor),
geeft elke stem een echte ADSR + klankkleur, en maakt de muziek adaptief (crossfades,
ducking, battle-intensiteit, dag/nacht).

**Verificatie zonder oren**: audio is niet te screenshotten — we meten met een AnalyserNode
op de master-bus (RMS-energie, reverb-staart na een stilte, duck-dips) zodat elke stap
kwantitatief aantoonbaar is.

---

## Stap 0 — Analyse ✅
- [x] audio.js in kaart: scheduler (50ms poll, 0.15s lookahead), _osc met basis-envelope,
      kick/snare/hihat, 15 UI-SFX + 17 move-SFX-functies, jingles, footsteps
- [x] Alles routeert droog naar musicGain/sfxGain → master; geen effects, geen filters
- [x] playMusic = harde knip; geen koppeling met gamestate (HP, dag/nacht)

## Stap 1 — Effects-bus: ruimte & glue ✅
- [x] Procedurele reverb: stereo impulse-response (1,7s ruisverval) → ConvolverNode als
      send-bus; muziek subtiel (0.14), SFX ruimer (0.22), UI-bus blijft droog
- [x] Echo/delay-bus (0,27s feedback-delay) voor jingles en signature moves
- [x] DynamicsCompressor op de master als glue (threshold −16 dB, ratio 5:1)
- [x] AnalyserNode-meetpunt + `getLevel()`/`getDebugState()` als verificatie-API
- [x] **Meting**: stiltevloer 0 → blip van 0,15s → 0,0055 RMS staart op 400 én 800 ms ✓

## Stap 2 — Instrument-upgrade: ADSR & klankkleur ✅
- [x] Echte ADSR per stem-rol via opties op `_osc` (attack/decay/sustain/release)
- [x] Melodie: dubbele oscillator met 7 cents detune (chorus-warmte) + zachtere top
- [x] Bas: lowpass op 820 Hz — de square schreeuwt niet meer
- [x] Pad: attack van een halve beat, release van ruim een beat — echte achtergrondlaag
- [x] Drums: kick met click+body, snare met 185 Hz toon-body + ruis, hihat-decayvariatie,
      accent op tel 1 van elke maat
- [x] Humanize: ±13% velocity-variatie per beat op de melodie
- [x] Klik-fix: mini-attack op playSfx en alle drumstemmen

## Stap 3 — Adaptieve muziek ✅
- [x] Crossfade bij trackwissel — **meting**: gain 0,13 halverwege de fade → 0,5 hersteld ✓
- [x] Ducking bij victory/level-up/evolutie/heal/crit — **meting**: 0,5 → 0,2 → 0,5 terug ✓
- [x] Battle-intensiteit bij HP < 25% (arpeggio + offbeat-hihats via `setIntensity()`,
      aangestuurd vanuit Battle.update, reset buiten battle)
      — **meting**: hihat-band (7-16 kHz) 19× meer energie, arpeggio-band (1,5-5 kHz) +65%;
      koppeling: volle HP = 0 → lage HP = 1 → na battle = 0 ✓
- [x] Dag/nacht via `DG.getNightFactor`: zachtere melodie, donkerder filter, dunnere drums

## Stap 4 — SFX-pass ✅
- [x] Move-SFX lopen door de reverb-send (sfxGain-bus) → impact klinkt groter
- [x] Signature moves (fase 4-koppeling): sub-boom (72→38 Hz sweep) + echo-bus
      — **meting**: direct 0,176 RMS, echo-staart op 900 ms nog 3× de vloer ✓
- [x] UI-geluiden (menu/select/error) via aparte droge bus — geen reverb in menu's
- [x] Victory-jingle van setTimeout naar sample-accuraat vooruit plannen omgezet

## Stap 5 — Integratie & eindtest ✅
- [x] Versie-bumps: audio ?v=82, battleAnim ?v=87, battle ?v=84
- [x] Testronde: titelmuziek door de nieuwe pipeline, wilde battle (intro-jingles + flee),
      track-crossfade, victory-duck, signature-boom — alles draaiend gemeten
- [x] Volume-instellingen werken: setMusicVolume(0,25) → gemeten 0,25 → hersteld 0,5 ✓
- [x] Console-check: 0 errors over de hele fase (verse error-trap)
- [x] Meetresultaten gedocumenteerd in dit bestand (zie metingen per stap)

---

## Resultaat
Alle 5 stappen afgerond. Gewijzigde bestanden:
- `js/engine/audio.js` — effects-bussen (reverb/delay/compressor/UI-dry), `_buildIR`,
  ADSR-`_osc` met detune/lowpass, rijkere drums, crossfade, `_duck`, `setIntensity`,
  dag/nacht-mix, intensiteitslaag, meet-API (`getLevel`/`getDebugState`)
- `js/battle/battle.js` — intensiteit-aansturing op HP in Battle.update
- `js/battle/battleAnim.js` — signature moves spelen het zware SFX-profiel
- `index.html` — versie-bumps

Bijzonder aan deze fase: audio is onzichtbaar, dus elke claim is **gemeten** via een
AnalyserNode op de master-bus (RMS + frequentiebanden) in plaats van "het zal wel kloppen".

---

### Bewust NIET in fase 3
- Online deployment + accounts/cloud-saves (fase 5a/5b — staat klaar als volgende stap)

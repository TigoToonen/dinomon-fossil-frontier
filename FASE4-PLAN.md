# FASE 4 — Signature Move-Cinematics & Intro's

> Status-legenda: `[ ]` = nog te doen · `[x]` = klaar · `[~]` = mee bezig
> Dit bestand wordt tijdens het bouwen live bijgewerkt — refresh om voortgang te zien.

**De strategie**: het battle-animatiesysteem (battleAnim.js) heeft al 15 generieke stijlen
(beam, burst, wave…) per type-kleur. Wat ontbreekt is *spektakel*: de 19 signature moves uit
moves.js voelen nu hetzelfde als een gewone Tackle. Fase 4 bouwt een cinematische laag
(letterbox, slow-motion, move-banner, charge-up) die voor élke signature move aangaat, met
per move een eigen choreografie-accent. Daarbovenop: filmische battle-intro's voor wilde
dino's (silhouet-reveal) en trainers (ball-throw + banner-upgrade).

---

## Stap 0 — Analyse ✅
- [x] battleAnim.js in kaart: 15 stijl-ticks, special-anims (FAINT/CATCH/INTRO/…),
      particles/_flash/_shake/camera-infrastructuur uit fase 1 herbruikbaar
- [x] 19 signature moves geïdentificeerd in moves.js (FRILL_FLARE t/m NECK_LASSO)
- [x] `trigger()` krijgt moveId niet door — battle.js moet die op 2 plekken meegeven
- [x] Intro: flits + confetti + scale-in; trainer-banner bestaat al (fase 1-bugfix)

## Stap 1 — Cinematisch framework ✅
- [x] Letterbox-balken (schuiven in/uit met easing) — renderen als laatste pass, dus óver
      de HUD en het dialoogvenster heen (nieuwe `drawCinematics()`-hook in de renderer)
- [x] Move-banner: "★ Frill Flare ★" in pixelfont op de bovenste balk, in de type-kleur
- [x] Slow-motion: charge-fase loopt op halve snelheid → traag en zwaar gevoel
- [x] Charge-up: convergerende energie-deeltjes + krimpende aura-ringen + camera-zoom
      op de aanvaller (fase 1-camera hergebruikt), aanvaller komt licht omhoog
- [x] `trigger()` uitgebreid met moveId (backwards-compatible), battle.js geeft hem door
      op beide aanroep-plekken (normaal + multi-hit)

## Stap 2 — Signature-choreografieën (19 moves) ✅
- [x] Alle 19 signature moves krijgen: charge → flits → unleash, letterbox + banner,
      intensiteit+1 en camera-werk; de 13 zonder eigen script spelen hun bestaande
      animStyle als verzwaarde unleash
- [x] 6 volledig unieke unleash-scripts: EXTINCTION_BEAM (oplaad-orb → megabeam + as-regen
      over het hele veld), ANCIENT_TORRENT (waterzuil + golfmuur), FRILL_FLARE (vlammenring
      vanaf de frill), FOSSIL_MEMORY (roterende runencirkel + convergerende scherven),
      SKULL_SLAM (de dino springt écht in een komeetboog van zijn platform naar de vijand,
      schokgolf + puin bij landing), GLACIAL_MIND (vorst kruipt vanaf de schermranden binnen)
- [x] Visueel geverifieerd in echte battles: Frill Flare (charge/unleash/impact),
      Skull Slam (charge/vlucht/landing), Extinction Beam (orb/beam/as) — zie screenshots

## Stap 3 — Wild-intro cinematic ✅
- [x] Wilde dino verschijnt als zwart silhouet (`getBattleIntroState().silhouette` +
      ctx.filter op het bestaande intro-pad in spriteRenderer)
- [x] Reveal op f34: witte flits + gouden radiale burst + camera-punch → silhouet wordt kleur
- [x] Visuele check: silhouet-frame en reveal-frame vastgelegd (f4_silhouette/f4_reveal)

## Stap 4 — Trainer-intro cinematic ✅
- [x] Ball-throw: bal vliegt in een boog van buiten beeld naar het lege platform
      (bestaande _drawBall hergebruikt), dino materialiseert groeiend uit de flits
- [x] Banner-upgrade: diagonale band met rode accent-schuine rand, boven de HUD
- [x] Bugfix onderweg: de intro-animatie tikte onzichtbaar weg áchter het VS-scherm
      → trainer-intro start nu pas als het VS-scherm sluit (`_pendingIntro` in battle.js)
- [x] Bonus: de slapende `isBattleIntro`-hook in battle.js (wees naar een functie die
      niet bestond) is nu geïmplementeerd — de battle wacht netjes tot de throw klaar is
- [x] Visuele check: throw-frame, ball-open, materialize, banner (f4_tr_fix3/4, f4_tr_done)

## Stap 5 — Integratie & eindtest ✅
- [x] Versie-bumps: battleAnim ?v=86, battle ?v=83, renderer ?v=86, spriteRenderer ?v=87
- [x] Volledige testronde: wilde battle (silhouet-intro + 3 signature moves), trainer-battle
      (VS-scherm → ball-throw → gevecht → overwinning), vijandelijke gewone moves (Vine Whip,
      Tackle) spelen ongewijzigd, eff-flash/crit/damage-numbers uit fase 1 werken er doorheen
- [x] Console-check: 0 errors over de hele testronde (verse error-trap)
- [x] Performance: 0,95 ms/frame in battle (budget 16,7 ms)
- [x] Bewijs-screenshots in `.claude/shots/` (f4_*)
- [x] Save-hygiëne: Tindrels test-moveset teruggedraaid naar Tackle/Ember/Fire Spin en
      opnieuw opgeslagen — de save bevat geen debug-moves

---

## Resultaat
Alle 5 stappen afgerond. Gewijzigde bestanden:
- `js/battle/battleAnim.js` — cinematisch framework (letterbox/banner/slow-mo/charge),
  6 unieke signature-scripts, intro-upgrades (silhouet-reveal, ball-throw, diagonale banner),
  nieuwe API's: `getBattleIntroState`, `isBattleIntro`, `drawCinematics`
- `js/battle/battle.js` — moveId doorgeven aan animaties, trainer-intro ná het VS-scherm
- `js/engine/renderer.js` — cinematics-pass als laatste tekenlaag in battle
- `js/sprites/spriteRenderer.js` — silhouet-filter tijdens wild-intro
- `index.html` — versie-bumps

---

### Bewust NIET in fase 4
- Audio-upgrade: ADSR, reverb, adaptieve muziek (fase 3 — staat nog open)

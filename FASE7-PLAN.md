# FASE 7 — Rivalnaam-moment & Vangst-polish

> Status-legenda: `[ ]` = nog te doen · `[x]` = klaar · `[~]` = mee bezig
> Dit bestand wordt tijdens het bouwen live bijgewerkt — refresh om voortgang te zien.

Twee delen: **(A)** de 'b'-bug in naam-invoer fixen en de rivalnaam verplaatsen naar een
logisch verhaalmoment (de professor vraagt het), en **(B)** de vangst-ervaring: geluid bij
elke fase van de worp, en een gevangen dino die ook gevangen blíjft (mét Gotcha-moment).

---

## Stap 0 — Analyse ✅
- [x] 'b'-bug: letter-toetsen zijn óók gamepad-knoppen; rival-invoerscherm pollt
      `isPressed('B')` en navigeert terug terwijl de letter getypt wordt
- [x] Rivalnaam zit nu in de nieuwe-spel-funnel (naam → rivalnaam → moeilijkheid)
- [x] FLINT_INTRO is de éérste vermelding van de rival; substitutie (Flint→naam) zit al
      in dialogueBox + battle, dus laat benoemen werkt automatisch overal door
- [x] Vangst: animatie heeft 0 geluiden; na succes verdwijnt de bal en wordt de dino
      weer getekend (leest als ontsnapping)

## Deel A — Rivalnaam

### Stap A1 — Bugfix tekstinvoer ✅
- [x] Rival-invoerscherm gebruikt geen gamepad-polling meer — alleen Enter, Escape en
      Backspace sturen het aan (zelfde aanpak die nickname-invoer al had)
- [x] Test: "Bram" (spelersnaam) en "Boris" (rivalnaam, mét hoofdletter B) getypt —
      scherm bleef open, buffer correct ✓

### Stap A2 — Rivalnaam uit het startmenu ✅
- [x] Nieuw spel is nu: eigen naam → moeilijkheid → spelen (rivalnaam-scherm eruit)
- [x] Default rivalnaam blijft 'Flint' tot het verhaalmoment

### Stap A3 — Het professor-vraagmoment ✅
- [x] Nieuwe dialogen RIVAL_NAME_ASK ("...what was his name again?") en
      RIVAL_NAME_CONFIRM ("Boris! Of course. How could I forget.") in story.js
- [x] `_ensureRivalNamed()` haakt in op béide eerste-ontmoeting-routes (auto na starter
      én via de NPC, alleen bij ontmoeting 1); invoer via het bestaande scherm
- [x] Naam opgeslagen (save + substitutie) + eenmalige vlag RIVAL_NAMED; Escape → 'Flint'
- [x] Bestaande saves met eigen rivalnaam slaan het moment over
- [x] Bonusfix onderweg: het VS-scherm en battle-berichten toonden de rúwe trainernaam
      ("Flint") — substitutie gebeurt nu op een kopie van de trainerdata bij battle-start,
      dus VS-scherm ("Bram vs Boris" ✓), banner én beloningsregel kloppen overal

## Deel B — Vangst-polish

### Stap B1 — Geluid bij elke fase ✅
- [x] `playCatchSfx()` in audio.js: THROW (whoosh), IMPACT (plok+zuig), SHAKE (tik-tak),
      LOCK (klik + succes-chime met ducking en echo-staart), BREAK (barst)
- [x] Gekoppeld aan de animatie-frames; gemeten: duidelijke niveaus per fase
      (worp 0,02 → wiebel 0,15-0,18 → barst 0,09 RMS) ✓

### Stap B2 — Gevangen blijft gevangen ✅
- [x] `_caughtBall`-state: na succes blijft de dino verborgen tot de battle sluit
      (getCatchMonScale → 0; gemeten: monVerborgen = true ná de animatie) ✓
- [x] De dichte bal blijft met een pulserende gloed op het veld liggen (reset bij
      de volgende battle via clearQueue)

### Stap B3 — Het Gotcha-moment ✅
- [x] Klik-flits (lichtring) op de bal op het lock-moment
- [x] Drie gouden vijfpuntige sterren (nieuwe 'star'-particle, additief) poppen op
      en dwarrelen neer — vastgelegd op `f7_gotcha_stars.png` ✓
- [x] Ontsnapping behoudt zijn gedrag, nu mét barst-geluid; dino komt terug (scale 1) ✓

## Stap 5 — Integratie & eindtest ✅
- [x] Versie-bumps: main ?v=83, story ?v=86, overworld ?v=81, audio ?v=83,
      battleAnim ?v=89, battle ?v=85
- [x] Volledige nieuwe-game-flow getest: naam "Bram" → moeilijkheid → intro →
      professor-vraagmoment → "Boris" → bevestiging → rival-battle met juiste naam
      in dialoog, VS-scherm en post-battle tekst
- [x] Vangst getest: ontsnapping (2 wiebels) én succes (3 wiebels + sterren + bal blijft)
- [x] Test-save (Bram) opgeruimd; Tigo's save onaangetast
- [x] Console-check: 0 nieuwe errors (enige melding kwam uit een test-volgorde die
      in het echte spel niet kan voorkomen: rival-battle zonder starter)

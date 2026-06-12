# FASE 1 — "Juice & Feel" Upgrade Plan

> Status-legenda: `[ ]` = nog te doen · `[x]` = klaar · `[~]` = mee bezig
> Dit bestand wordt tijdens het bouwen live bijgewerkt — refresh om voortgang te zien.

---

## Stap 0 — Analyse codebase
- [x] Render-pipeline, sprite-systeem, battle-anim, audio en UI in kaart gebracht
- [x] Integratiepunten bepaald (renderer.js, battleAnim.js, battle.js, spriteRenderer.js, dialogueBox.js)

## Stap 1 — UI-Kit fundament (`js/ui/uiKit.js` — nieuw bestand) ✅
- [x] Kleurtokens + paneel-helper: consistente pixel-borders in 9-slice-stijl voor alle UI-panelen
- [x] Procedurele pixelfont: eigen bitmap-glyphs (A-Z, a-z, 0-9, leestekens, pijlen), geen externe dependency
- [x] Globale `fillText`/`measureText`-hook: ALLE 273 bestaande tekst-calls krijgen automatisch de pixelfont
      (emoji's en onbekende tekens vallen netjes terug op de oude rendering)
- [x] String-cache voor performance (gerenderde teksten worden hergebruikt)
- [x] Echte descenders voor g/j/p/q/y (na eerste visuele check toegevoegd)
- [x] Script geladen in index.html + visuele check: titelscherm, slot-select, naam-invoer, dialoog ✓
- [x] Bonus: dev-testharnas (`?devloop=1` + shot-server) zodat elke stap visueel verifieerbaar is

## Stap 2 — Transities & UI-animatie ✅
- [x] Battle-intro wipe: retro blinds + dubbele flits in plaats van simpele zwarte fade
- [x] Battle-reveal: scherm vouwt open vanuit zwart bij binnenkomst battle
- [x] Menu slide-in met easing (nu: instant verschijnen)
- [x] Dialoogbox pop-in animatie + restyle naar UIKit-paneel + groot GBA-formaat tekst (scale 2)
- [x] Bugfix onderweg: gelekte `textAlign`-state liet dialoogregels half buiten beeld renderen
      → frame-start reset in renderer + expliciete align in dialoogbox
- [x] Visuele check: dialoog (pop-in + tekst), starterskeuze-menu, trainer-VS, battle-scene ✓

## Stap 3 — Battle juice ✅
- [x] Damage numbers: opspringende schadegetallen met boogje en fade
      (geel/groot bij super effective, oranje bij crit, grijs bij weak, groen bij heal/drain, paars bij recoil)
- [x] Hit-stop: 2-7 freeze-frames op het moment van impact (zwaarder bij crit/super)
- [x] Battle-camera: zoom-punch richting het doelwit bij crits & super effective, langzame zoom bij KO
- [x] HP-bar "white trail": balk loopt licht na voordat hij leegloopt
- [x] Gekoppeld aan alle schade-paden: normale hits, multi-hits, recoil, drain
- [x] Visuele check in echte battle: damage numbers + white-trail bevestigd op screenshots ✓

## Stap 4 — Overworld diepte ✅
- [x] Drop-shadows onder beide dino's in battle (krimpen mee bij sprong, faden bij KO)
      — speler & NPC's hadden al subtiele schaduwen, die zijn behouden
- [x] Voetstap-stofwolkjes bij elke tegelstap (wereld-coördinaten, faden uit)
- [x] Visuele check: battle-schaduwen op screenshot ✓, stof via pixel-sampling bevestigd ✓

## Stap 5 — Integratie & eindtest ✅
- [x] Cache-busting: `?v=` versies opgehoogd voor alle gewijzigde bestanden
- [x] Volledige playtest via preview: title → slot select → naam-invoer → intro-dialoog →
      starterskeuze → trainer-VS → battle (win/verlies + blackout) → overworld → menu → party → bag
- [x] Console-check op errors → bonus-bugfix: trainer-banner zat in de update-fase
      (geen `ctx` beschikbaar) en gooide elke intro-frame een error; verplaatst naar de draw-fase
- [x] Bewijs-screenshots opgeslagen in `.claude/shots/`

---

## Resultaat
Alle 5 stappen afgerond. Gewijzigde/nieuwe bestanden:
- **NIEUW** `js/ui/uiKit.js` — pixelfont + tokens + paneel-helper + battle-wipe + easing
- `js/ui/dialogueBox.js` — pop-in, UIKit-paneel, groot GBA-formaat tekst
- `js/engine/renderer.js` — frame-state reset, menu-slide, battle-reveal, wipe-koppeling, camera, voetstap-stof
- `js/battle/battleAnim.js` — damage numbers, hit-stop, camera-punch, KO-zoom, banner-bugfix
- `js/battle/battle.js` — popDamage-hooks (normaal/multi/recoil/drain)
- `js/sprites/spriteRenderer.js` — HP white-trail, battle-schaduwen onder beide dino's
- `js/main.js` — `DG_GET_GS()` debug-getter
- `index.html` — uiKit-script, dev-testharnas (`?devloop=1`), versie-bumps
- `.claude/shot_server.py` — dev-tool: ontvangt canvas-screenshots voor visuele verificatie

---

### Bewust NIET in fase 1 (komt in fase 2-4)
- Pixel-art kwaliteitspass + idle-animaties op dino's (fase 2)
- Audio-upgrade: ADSR, reverb, adaptieve muziek (fase 3)
- Signature move-animaties + intro-cinematics (fase 4)

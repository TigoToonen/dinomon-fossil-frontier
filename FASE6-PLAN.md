# FASE 6 — Dino Make-over: Anatomie, Hit-reacties & Evolutie

> Status-legenda: `[ ]` = nog te doen · `[x]` = klaar · `[~]` = mee bezig
> Dit bestand wordt tijdens het bouwen live bijgewerkt — refresh om voortgang te zien.

**De strategie**: drie upgrades die allemaal over de dino's zelf gaan.
(1) Mooiere lichamen: een cel-shading-pass in de bake-pipeline die ALLE 105 dino's in één
klap consistent belicht (licht linksboven, schaduw rechtsonder — zelfde hefboomtruc als
fase 2), plus anatomie-details op de meest gespeelde archetypes. (2) Klappen die zichtbaar
aankomen óp de dino: wit-flits, terugdeinzen, impact-frames. (3) Een evolutie-cinematic
die het piekmoment ook zo laat voelen.

---

## Stap 0 — Analyse ✅
- [x] Bake-pipeline uit fase 2 is het hefboompunt voor belichting (één pass = 105 dino's)
- [x] popDamage (fase 1) is het natuurlijke haakje voor hit-reacties per kant
- [x] Archetype-functies hebben lokale coördinaten — anatomie-details per functie toevoegen
- [x] evoAnim.js bekijken voor de cinematic-upgrade (fases + filters)

## Stap 1 — Cel-shading voor alle 105 dino's ✅
- [x] Rim-light: pixels aan de linker-/bovenrand van het silhouet worden opgelicht
- [x] Kernschaduw: pixels aan de rechter-/onderrand worden verdonkerd
- [x] Werkt op het silhouet-masker (vóór de outline) — gloed/aura's onaangetast
- [x] Visuele check: 15-archetypen-raster (`f6_celshading.png`) — belichting consistent ✓

## Stap 2 — Anatomie-details op de kern-archetypes ✅
- [x] CERATOPSIAN (Tindrel-lijn!): wenkbrauwrichel, neusgat, klauwtjes
- [x] RAPTOR: échte sikkelklauw (handelsmerk!), teenklauwtjes, roofdier-wenkbrauwband
- [x] STEGOSAUR: teenklauwtjes op alle vier de poten, wenkbrauwrichel, neusgat
- [x] TREX: dubbele witte teenklauwen, zware wenkbrauwrichel, neusgat
- [x] AQUATIC: vin-membraan-lijnen, kieuwspleten achter de kop, wenkbrauwrichel
- [x] PTEROSAUR: klauwtje op de vleugelknik, grijpklauwtjes aan de pootjes
- [x] Visuele check: 8 dino's groot in beeld (`f6_anatomy.png`) — details leesbaar ✓
      (cel-shading + details zijn stage-onafhankelijk: zelfde codepad voor alle 3 stages)

## Stap 3 — Hit-reacties op de dino ✅
- [x] Wit-flits: de geraakte dino knippert wit op het inslagmoment, houdt vast tijdens
      de hit-stop en knippert daarna uit (filter op de bake-blit, via `getHitReact()`)
- [x] Terugdeins: knockback-offset van de verdediger (~7px), veert terug
- [x] Impact-frames bij crit/super: 1 frame wit + 1 frame kleur-geïnverteerd (anime-stijl)
- [x] Visuele check: wit frame, inversie-frame én witte dino vastgelegd
      (`f6_impact1/2.png`, `f6_hitflash.png`) ✓

## Stap 4 — Additive glow op effecten ✅
- [x] Beams, hit-rings en energie-particles (vlam/vonk/kristal/druppel/lijn) renderen
      met `globalCompositeOperation: 'lighter'` → echt gloeiend licht
- [x] As/puin/rots-particles blijven bewust mat
- [x] Visuele check: gloeiende beam-flits op screenshot (`f6_beamglow.png`) ✓

## Stap 5 — Evolutie-cinematic ✅
- [x] Vooraf-analyse: er bleek al een 9-fasen "Fossil Awakening" te bestaan (verstenen →
      barsten → explosie → emerge) — gericht verrijkt i.p.v. herbouwd
- [x] Versnellend wit-silhouet-knipperen in de GLOW-fase (het klassieke evolutie-flikkeren)
- [x] Gouden lichtspiraal die naar binnen draait tijdens het opladen (additive)
- [x] Cinematische letterbox om de hele sequence (schuift in bij DARKEN, uit bij FADE)
- [x] Visuele check: flikker+spiraal, verstening, barsten, explosie-met-puin en
      pulse-landing van Tindrak vastgelegd (`f6_evo_*.png`) ✓

## Stap 6 — Integratie & eindtest ✅
- [x] Versie-bumps: spriteRenderer ?v=90, battleAnim ?v=88, evoAnim ?v=81
- [x] Volledige ronde: battle met crit (impact+flits+recoil), beam-glow, volledige
      evolutie-cyclus tot en met afronding (evoKlaar: true)
- [x] Console-check: 0 errors over de hele fase; frametijd 1,3 ms (budget 16,7 ms)
- [x] Bewijs-screenshots in `.claude/shots/` (f6_*)

---

## Resultaat
Alle 6 stappen afgerond. Gewijzigde bestanden:
- `js/sprites/spriteRenderer.js` — cel-shading-pass in `_gbaFinish` (alle 105 dino's),
  anatomie-details op 6 archetypes, hit-flits + terugdeins op beide battle-mons
- `js/battle/battleAnim.js` — `getHitReact()`, impact-frames (wit + inversie),
  additive glow op beams/rings/energie-particles
- `js/battle/evoAnim.js` — evolutie-flikkeren, lichtspiraal, letterbox
- `index.html` — versie-bumps

---

### Bewust NIET in fase 6
- Battle-achtergronden pixel/parallax-pass en overworld-sfeer (kandidaat fase 7)
- Online deployment (fase 5a/5b — staat klaar)

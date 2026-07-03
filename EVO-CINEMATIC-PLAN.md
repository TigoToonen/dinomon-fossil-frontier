# EVO-CINEMATIC-PLAN — "Fossil Awakening 2.0"

> **STATUS: geïmplementeerd (juli 2026).** Alle fases A–F gebouwd en headless
> geverifieerd (screenshots in .claude/shots/evo*.png). Nog niet gedeployed.

Doel: de evolutie-sequence naar het niveau van de Pokémon X/Y evolutie-cinematic tillen
(referentie: IG-reel the_poke_playa — "What? Crashout is evolving!"), maar met behoud van
onze eigen fossiel-identiteit (verstenen → barsten → herrijzen).

## Wat de referentie heeft dat wij missen

| # | Referentie (Pokémon X/Y)                                    | Bij ons nu |
|---|--------------------------------------------------------------|------------|
| 1 | Dialoog VOORAF: "What? [bijnaam] is evolving!" + spanning    | Beide messages worden vóór de animatie gepusht; animatie dekt ze direct af |
| 2 | Eigen "evolutiekamer": gloeiend platform, spotlight, void    | Zwart scherm + amberen gloed |
| 3 | Silhouet morpht heen-en-weer tussen OUDE en NIEUWE vorm, versnellend | Alleen oude vorm flikkert wit; nieuwe vorm wordt nooit geteaset |
| 4 | Muziek loopt synchroon met de fases op (spanning → stilte → fanfare) | Eén 8-noten arpeggio bij de start |
| 5 | Roep/roar van de nieuwe mon bij de reveal                    | Geen cry-systeem |
| 6 | Achteraf: "Congratulations! Your [bijnaam] evolved into X!"  | Message verschijnt vóór i.p.v. ná de animatie |
| 7 | B-knop annuleert de evolutie                                 | Niet aanwezig |

## Fase A — Regie & framing (battle.js, main.js)
- `_doEvolution` splitsen: eerst alleen `"Wat?! ${oldName} is evolving!"` tonen (DialogueBox,
  wacht op Z), dán pas `_notifyUI({event:'EVOLUTION'})`. De "Congratulations!"-regel verhuist
  naar de `onComplete`-callback van `DG.EvoAnim.start(...)`.
- Bijnaam gebruiken (`mon.nickname || sp.name`) in beide regels — dat maakt het persoonlijk,
  precies wat de reel zo leuk maakt ("Crashout").
- Na de congrats-box: kleine dex-notitie als de soort nieuw is ("GOGOATA werd geregistreerd
  in de DinoDex!").
- **Stat-diff kaartje** na de reveal: HP +12, ATK +8 … (oude vs. nieuwe stats uit
  `recalcStats`) — 2 sec, oplopende tellers. Dit heeft zelfs Pokémon niet; goedkope wow.

## Fase B — De evolutiekamer (evoAnim.js)
- Nieuwe achtergrond i.p.v. plat zwart: donkerblauwe verticale gradient-void, gloeiende
  **cirkelvormige platform-ellips** onder de mon (radial gradient, amber i.p.v. X/Y-blauw =
  fossiel-thema), zachte spotlight-kegel van boven.
- Langzaam stijgende stofdeeltjes/lichtmotes over de hele sequence (hergebruik motes-code
  uit hatchAnim.js).
- Subtiele langzame zoom-in over de hele sequence (scale 1.0 → 1.12 op een wrapper-transform)
  voor camera-gevoel. Letterbox bestaat al — behouden.

## Fase C — Morph-climax (evoAnim.js)
- GLOW-fase vervangen door **MORPH-fase**: wit silhouet (brightness(10) saturate(0)) wisselt
  tussen `_oldId` en `_newId`, met squash & stretch (oud krimpt → nieuw groeit erdoorheen),
  in een versnellend ritme (interval 40 → 6 frames). Dit is hét kern-shot van de referentie.
- PETRIFY/RUMBLE/CRACK blijven — dat is onze identiteit — maar de cracks lopen synchroon
  met de morph-flitsen op (elke morph-tik = 1 extra crack + korte shake-puls).
- FLASH: 2 frames vóór de flits alles bevriezen + audio dempen (stilte-beat), dan god-rays
  (12 roterende lichtstralen vanuit centrum, composite 'lighter') door de white-out heen.
- EMERGE: nieuwe mon komt op als silhouet dat van onder naar boven "kleurt" (clip-rect wipe)
  + sparkle-burst, i.p.v. alleen brightness-fade.

## Fase D — Audio (audio.js)
- `playEvolutionScore(phaseCallback)`: doorlopende score i.p.v. one-shot —
  1) tension-loop: lage pulserende kwinten, tempo stijgt met de morph-frequentie mee;
  2) hard afkappen op de stilte-beat;
  3) flits: impact-boom + shimmer;
  4) reveal: bestaande fanfare, maar 2× zo lang met slotakkoord.
- `playCry(speciesId)`: procedurele roar per type (hergebruik de bestaande type-timbres zoals
  'Ember'/'Aurora' sweeps) + pitch op basis van grootte/stats — afgespeeld op de PULSE-fase.
  Bonus: ook bruikbaar bij battle-intro en dex.

## Fase E — B-knop annuleren (klassieker!)
- Tijdens DARKEN t/m CRACK: B indrukken → morph hapert, glow dooft ("Huh? ${name} stopte
  met evolueren!"), mon keert grijs→kleur terug, battle hervat. Vlag `mon._evoCancelled`
  zodat hij bij de volgende level-up opnieuw in de queue komt.
- Kleine hint "B = stop" rechtsonder, fade-out na 2 sec.

## Fase F — Polish & verificatie
- Shiny: regenboog-rings + gouden platform (bestaat deels al via `_isShiny`).
- Z-knop = versnellen (2× speed), niet skippen — je wilt dat spelers hem zien.
- Testen headless via `?devloop=1` + `__PUMP` + shot_server.py; evolutie forceren via
  forced-faint-truc (zie geheugen evolutie-systeem). Screenshots op de fase-overgangen
  MORPH/FLASH/EMERGE/PULSE als visuele checkpoints.

## Volgorde & omvang
A (regie) → B (kamer) → C (morph) zijn de kern en geven 80% van het effect.
D (audio) maakt het af, E en F zijn kers-op-de-taart. Alles zit in 3 bestanden:
`js/battle/battle.js`, `js/battle/evoAnim.js`, `js/engine/audio.js`.

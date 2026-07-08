# DinoMon — Cry Sound Overhaul Plan

Doel: elke DinoMon een herkenbaar eigen geluid geven dat **past bij het type**, en
legendarische + mega's een écht epische brul. Nu delen 12 van de 18 types dezelfde
klankmotor (`bright` vs `sawtooth+growl`), waardoor alles op elkaar lijkt.

## Ontwerpprincipe (3 lagen)

1. **TYPE = klankfamilie** — het primaire type bepaalt de synthese-*recept* (fluit,
   brul, blub, klok, zap…). Dít is de nieuwe hoofd-as die nu ontbreekt.
2. **HASH = individu** — de bestaande deterministische species-hash varieert bínnen
   de familie: toonhoogte-offset, contour-details, 1/2 lettergrepen, vibrato,
   formant. Zelfde soort = altijd zelfde roep; twee vuurdino's klinken beide als
   vuur maar hoorbaar verschillend.
3. **BST = grootte** — hoge BST → lager/zwaarder/langer; lage BST → hoger/korter.
   (Blijft zoals nu, maar per familie anders geschaald.)

Secundair type geeft een korte **accent-laag** bovenop het primaire recept
(bijv. FIRE/DRAGON = drakenbrul met vuur-crackle erover).

---

## De 18 type-stemmen

Elke familie heeft een eigen synthese-"motor". Aantal = # soorten met dat primaire type.

| Type | # | Karakter | Synthese-recept (Web Audio bouwstenen) |
|------|---|----------|----------------------------------------|
| **FLYING** | 5 | Fluit / krijs | Pure sine/triangle, hoge f0 (×2.4), lichte *breath*-ruis via highpass; snelle ondiepe tremolo; opgaande chirp-contour. Pterosaurus-fluit. |
| **WATER** | 17 | Blub / gorgel | Reeks korte bubbel-blips (sine met snelle neerwaartse pitch-bloop), lowpass ~900 Hz; gorgel-ruisbed (bandpass ~400 Hz, amplitude-gemoduleerd). |
| **FIRE** | 10 | Knetter-brul | Sawtooth-brul + knetterende ruis-bursts (random pops door bandpass), warme lichte distortion; opwaartse "flare" aan het eind. |
| **GRASS** | 9 | Rietblaas / warble | Zachte reed-toon (triangle + smalle puls), blad-ruis (highpass, zacht), trage warble; mellow en organisch. |
| **ELECTRIC** | 8 | Zap / buzz | Pulse/square met snelle amplitude-gating (stotter/buzz), hoge f0, korte zap-downsweep aan de kop; ring-mod bijklank. |
| **ICE** | 8 | Kristal / chime | Glasachtige bel (sine + hoge boventoon), shimmer-highpass sparkle; helder uitrinkelend verval, geen gegrom. |
| **DARK** | 8 | Grauw / sis | Lage rauwe sawtooth-grauw + ruis-sis, dreigend, neerwaartse contour, lichte detune voor vuiligheid. |
| **GROUND** | 8 | Stamp-brul | Lage sub-thump (sine 60→40 Hz) + stoffige lowpass-ruis + korte middenbrul; aardse dreun. |
| **ROCK** | 9 | Grind / rommel | Lage grindende toon (lowpass-ruis + lage saw), kort en korrelig; steen-op-steen. |
| **FAIRY** | 9 | Twinkel / belletje | Heldere glockenspiel-blips, licht en speels, opgaand mini-arpeggio (0-4-7), sparkle-highpass. |
| **NORMAL** | 5 | Neutrale roep | Midden dino-call (triangle+saw mix), simpel — de "basis"stem waar de rest zich van afzet. |
| **DRAGON** | 5 | Mini-brul | Gelaagde saw + sub, rauw, krachtige neerwaartse brul + gegrom-bed. (Legendaries krijgen de XL-versie, zie onder.) |
| **PSYCHIC** | 3 | Etherische wobble | Verstemde sines (beating/ring-mod), trage diepe vibrato, veel reverb, glijdende glissando; onaards. |
| **STEEL** | 3 | Klang / metaal | Inharmonische partialen (detuned square door resonante bandpass), industriële metaalring. |
| **FIGHTING** | 3 | Grom-schreeuw | Punchy midden-"hah"-burst, kort en fel, snelle attack; vocaal-agressief. |
| **GHOST** | 3 | Weeklacht / kreun | Hol, verstemd, ademend, wiebelende toonhoogte, reverb-zwaar, neerwaartse moan; griezelig. |
| **POISON** | 3 | Sludge / sis-bubbel | Natte borrelende hiss (Water-achtig maar rauwer/ziekelijk), lichte detune. |
| **BUG** | 5 | Getsjirp / stridulatie | Snel amplitude-gemoduleerde buzz (krekel-triller), klikkerig; cicade-achtig. |

> Alle 18 dekken de volledige roster. Types met weinig soorten (PSYCHIC/STEEL/
> FIGHTING/GHOST/POISON = 3) krijgen tóch een eigen motor zodat ze uniek zijn.

---

## Legendarische & Mega — de epische brul

De 5 uitzonderingen krijgen een **XL-brullaag** bovenop hun type-karakter:

| Soort | Type | Basiskarakter + epische laag |
|-------|------|------------------------------|
| **Primordia** | DRAGON | De oer-drakenbrul: diepste, langste (~2s), meest gelaagd. |
| **Megavore** | DRAGON/DARK | Drakenbrul + duistere sis-onderlaag, roofdier. |
| **Titanrex** (MEGA) | ROCK/FIRE | Brul + steen-grind + vuur-crackle; berg die scheurt. |
| **Crateron** | FIRE/DRAGON | Vulkanische drakenbrul + laaiend knetterbed. |
| **Glaciodon** | WATER/PSYCHIC | Diepe brul met kristallijne, etherische psychic-shimmer. |

Recept van de epische laag (los van type):
- **Sub-drop**: sine 90→35 Hz onder alles (het "gewicht").
- **3–4 verstemde oscillatoren** (saw) samen → dikke, rauwe kern (unisono +detune ±12/±18 ct).
- **Ruis-brul-bed**: lowpass/bandpass-ruis, lang, amplitude-gemoduleerd (ademend).
- **Contour**: dramatisch — kort omhoog ("inademen"), dan lange neerwaartse crash.
- **Duur ~1.4–2.0 s** i.p.v. 0.4–0.7 s.
- **Zware reverb-staart** (bestaande `_revSendSfx`, evt. tijdelijk hoger).
- **Impact-boem** aan de kop (korte low kick) zodat 'ie "landt".
- Type tint de brul (fire→crackle top, rock→grind, ice/psychic→shimmer).

Resultaat: onmiskenbaar "dit is een grote". Ook bruikbaar als accent bij hun
intro/evolutie-cinematics.

---

## Individualiteit binnen een type (blijft deterministisch)

De hash stuurt per soort, binnen de familie-grenzen:
- toonhoogte-offset (±10–20%), duur, 1 of 2 lettergrepen + "antwoord"-interval;
- contour-variant (op-neer / dalend / golvend);
- vibrato-snelheid & -diepte, filter-cutoff, formant/detune;
- familie-specifiek accent (bijv. # bubbels bij WATER, knetterdichtheid bij FIRE,
  arpeggio-noten bij FAIRY).

Zo verschillen de 17 waterdino's onderling, maar klinken ze allemaal *als water*.

---

## Implementatie-aanpak (nog niet uitvoeren)

1. **`_cryVoice(speciesId)` uitbreiden** met een `family`-veld op basis van
   `types[0]` (dispatch-tabel type → familie-id), plus `epic`-flag voor
   `isLegendary || isMega`, plus secundair-type-accent.
2. **`playCry()` refactoren** naar een dispatcher: per familie een eigen
   `_cryX(v, t)`-bouwer (bijv. `_cryFlute`, `_cryBubble`, `_cryRoar`, `_cryChime`,
   `_cryZap`, …). Gedeelde helpers voor envelope/ruis/vibrato hergebruiken.
3. **Epische laag** als aparte `_cryEpic(v, t)` die vóór/onder de type-bouwer draait.
4. Bestaande `_noise()`-cache en effect-bussen (reverb/delay) hergebruiken; geen
   nieuwe architectuur nodig.

## Verificatie

- Cries zijn deterministisch en `_cryVoice()` is al geëxporteerd → makkelijk te
  tunen/testen zonder de hele game te draaien.
- Test-harnas (`?devloop=1` + `__PUMP` + shot_server) is voor beeld; voor geluid
  een klein test-paneeltje dat per type één soort afspeelt (A/B) om te horen of de
  families echt verschillen. Steekproef: 1 soort per type + de 5 legendaries.

## Openstaande keuzes voor jou

- **Scope-volgorde**: eerst de 18 type-motoren, dan de epische laag? Of andersom?
- **Secundair-type-accent**: meteen meenemen of fase 2?
- **Zwaardering per type**: klopt de karakterkeuze (bijv. POISON als "natte sis",
  GHOST als "kreun") met hoe jij de dino's voor je ziet?

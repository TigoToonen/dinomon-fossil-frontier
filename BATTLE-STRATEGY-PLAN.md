# BATTLE-STRATEGY-PLAN — van "snelste wint" naar schaar-steen-papier

> **STATUS: Fase 1 (status 2.0) + 1½ (Resins & Sap Farm) + 2 (vanguards)
> gebouwd en geverifieerd (juli 2026).** validate_battle.js groen:
> 121/121 soorten leren de vanguard van hun primaire type (runtime-
> injectie op Lv.24 in dinomons.js, DG.VANGUARDS), geen prio-move >45
> power meer (uitz.: Sucker Punch mét echte faal-conditie, Water
> Shuriken, onleerbare First Impression). Headless bewezen: trage mon
> met Static Jab slaat 20×-snellere vijand vóór; Sucker Punch faalt vs
> status en gaat eerst vs aanval; Ancient Guard (Stoneskull/Cryosaur)
> blokkeert priority volledig; Tremor Sense (Boneback/Rockflip) halveert
> (meting 0,45×). AI tier-3 kent de vanguard-finish (×4 score bij KO).
> Afwijkingen 1½: boer ín Ferngrove-oostgrove; dagvoorraad = rouleren­de
> special.
>
> **Fase 3 gebouwd:** audit wees uit dat 64/65 abilities al écht werken
> (veel beter dan verwacht; de "arg-shift-bug" bestond niet). Predator's
> Mind compleet gemaakt (+10% crit; never-miss bestond al). Priority is
> nu overal zichtbaar (▲/▼ + "Priority +1"-effectregel). Nieuw + bewezen:
> Poison Heal (Tarclaw/Tarrasaur), Shed Skin (Amberlite/Amberwing, 28,7%
> gemeten), Quick Feet (Aerolith/Aerodon, ×1,5), Synchronize (Gemlet-lijn,
> bounce bevestigd), Flame Body (Lavaclaw). Sturdy: 15 → 5 soorten.
> **Fase 4 gebouwd:** AI-tiers schalen met badges (3+ → tier 2, 6+ →
> tier 3; zelfde trainer kiest 46%→86% vaker de juiste move), en E4/
> Champion kregen tier 4: één beurt vooruitdenken (beurtvolgorde incl.
> priority, dodelijke-klap-die-eerst-landt wint, geen setup onder
> doodsdreiging, setup juist bij ruime HP-marge) — deterministisch.
> **Kernmetriek gemeten** (measure_speedwin.js, 1200 gevechten per kant,
> baseline via git-worktree op HEAD): snelste mon wint 56,9% → 53,3%,
> gevechtsduur 2,8 → 3,1 beurten. Eerlijke duiding: de 75%-aanname uit
> dit plan bleek te somber voor gelijke-level 1v1's; de winst zit vooral
> in nieuwe keuzeruimte (status blijft plakken, vanguards, anti-prio,
> Resins) en tegenstanders die meeschalen. Gym-team-synergie is bewust
> NIET aangeraakt (parallelle sessie balanceert gyms actief).
> Nog niet gedeployed.

Doel: gevechten worden strategischer naarmate je verder komt. Nu wint bijna
altijd de snelste mon met de beste ability. Dit plan bouwt drie tegenkrachten
in — priority (traag verslaat snel), status (investeren in latere beurten) en
ability-synergie — en maakt alle regels zichtbaar zodat de speler er op kán
spelen. Strategie zonder informatie is gokken.

## Wat de audit vond (waarom het nu zo voelt)

**Status-effecten zijn te zwak én onzichtbaar:**
1. Elke status (burn/poison/para/freeze) duurt random 1–3 beurten en geneest
   vanzelf — statusEffects.js:34. Een burn die na 1 beurt verdwijnt is geen
   strategie, dus blijft alleen raw damage over. Dit is de kernoorzaak.
2. De duur is nergens zichtbaar; het voelt daardoor willekeurig/kapot.
3. **Echte bug:** TOXIC zegt "badly poisoned, worsens every turn" maar doet
   `status:'POISON'` (gewoon 1/8) — de escalerende BADPOISON-code in
   statusEffects.js is voor TOXIC dood; slechts één andere move gebruikt hem.
4. Vijf parallelle effect-formaten in moves.js (STATUS_CHANCE + legacy
   BURN_CHANCE/POISON_CHANCE/FREEZE_CHANCE/PARALYSIS/SLEEP) — gealiased in
   battle.js:864, maar dit soort dubbelheid baart bugs zoals #3.
5. Omschrijvingen zijn flavour-tekst zonder getallen: geen kans, geen schade
   per beurt, geen duur.
De schade-tick zelf WERKT (endOfTurnTick → battle.js:2166, incl. popup-getal);
het probleem is balans + zichtbaarheid, niet de motor.

**Priority is een rommeltje:**
6. 36 priority-moves in de data, maar 17 zijn door NIEMAND leerbaar
   (o.a. Sucker Punch, First Impression, alle nieuwe *_STRIKE-varianten).
7. Vier typen hebben géén priority-aanval: GROUND, PSYCHIC, POISON, ELECTRIC.
8. Power-creep: MIND_DIVE (95 pwr, prio 1!), PLATE_SLAM (80), RIVER_RUSH/
   AERIAL_BLITZ/SUPERSONIC_STRIKE (70) — een 95-power prioritymove maakt het
   speed-probleem juist érger. Klassieke regel: priority ≈ 40-45 power.

**Abilities:**
9. 63 abilities, maar scheef verdeeld: Sturdy op 15 soorten (12%!), veel
   uniques. Welke er écht geïmplementeerd zijn in battle.js is niet
   geïnventariseerd; minstens één soort heeft per ongeluk de ability-
   OMSCHRIJVING in het ability-veld staan ("Summons Hail when entering
   battle" i.p.v. 'Snow Warning') — arg-shift in dinomons.js.

**AI:** kiest gewogen-random op type-effectiviteit; kent geen priority-finish,
geen switchen, geen vooruitdenken. Moeilijker = alleen hogere levels.

---

## Fase 1 — Status 2.0: betrouwbaar, voelbaar, leesbaar

**1a. Eén canoniek formaat.** Migratiescript: alle legacy-effecttypes →
`STATUS_CHANCE {status, chance}`; TOXIC → `BADPOISON`. Alias-laag blijft als
vangnet maar de data wordt schoon. Validator `validate_battle.js` bewaakt het.

**1b. Nieuwe status-regels — het 20%-herstelmodel (GEKOZEN door Tigo).**
Status blijft hangen, maar geneest elke beurt met een kans. Belangrijke
regel: de eerste beurt is GEGARANDEERD (herstelkans telt pas vanaf de
tweede end-of-turn) — anders voelt het weer zo willekeurig als nu.

| Status | Effect | Schade/beurt | Zelfherstel | Verwachte duur | Genezing |
|---|---|---|---|---|---|
| BRN Burn | ATK ×0,5 | 1/16 max HP | 20%/beurt | ~5 beurten | Cooling Resin, Center |
| PSN Poison | — | 1/8 max HP | 20%/beurt | ~5 beurten | Cleansing Resin, Center |
| TOX Toxic | — | n/16, n +1 per beurt | **10%**/beurt | ~10 beurten | Cleansing/Golden Resin — bijna verplicht ingrijpen |
| PAR Paralysis | SPD ×0,5 + 25% beurt-skip | — | 20%/beurt | ~5 beurten | Supple Resin, Center |
| SLP Sleep | kan niet bewegen | — | teller 1–3, ZICHTBAAR in HUD | 1–3 beurten | Rousing Resin of vanzelf |
| FRZ Freeze | kan niet bewegen | — | 20% ontdooi/beurt (dubbel genezingspad verwijderd) | ~5 beurten | Thawing Resin, of een fire-hit |

Twee smaken onzekerheid, bewust: SLP is een zichtbare aftelklok ("nog 1
beurt — nu setuppen of switchen?"), de rest is een kansspel per beurt
("herstelt hij…? nee!"). Item gebruiken = een beurt kwijt maar zékerheid;
gokken op de 20% is gratis maar kan het gevecht kosten. TOX op 10% is de
"commit"-status waar wachten bijna altijd verliest.
Genezings-melding altijd mét getallen: "Crashout is paralysed! (SPD ½,
25% skip — 20% herstelkans per beurt)".

**1c. Zichtbaarheid overal (de vier vragen van Tigo, automatisch beantwoord):**
- Status-badge in battle-HUD krijgt een **beurten-teller** (SLP 2) waar van
  toepassing, en TOX toont de escalatie (TOX ×3).
- Bij het oplopen één regel mét getallen: "Crashout is burned! (1/16 HP per
  beurt, ATK gehalveerd — tot genezen)".
- **Move-detail** (summary én battle-moveselect) krijgt een effectregel die
  AUTOMATISCH uit de data wordt gegenereerd — kan dus nooit meer liegen:
  "30% PSN · 1/8 HP/beurt" of "100% TOX · oplopend 1/16→".
  Eén generator-functie `DG.MoveFX.describe(move)` in plaats van 1005
  handgeschreven omschrijvingen nalopen.
- Dex-ability-regel idem: getallen in de desc ("Static: 30% PAR bij contact").

## Fase 1½ — Primal Resins: de berry-familie van DinoMon

Geen berries maar **hars (resin)** — thematisch perfect: barnsteen ÍS
gefossiliseerde hars, en het spel heet Fossil Frontier met Ambertown en de
Amber Ball. Dino's likken hars van oerbomen (araucaria's — echte Jura-
flora). In-game familienaam: **Resins**, eigen sectie in de tas.

**1½a. De acht Resins** (held-item: wordt automatisch opgegeten zodra de
conditie triggert — de motor hiervoor bestaat al via de Lum Berry-hook in
battle.js:1421; daarnaast gewoon uit de tas te gebruiken):

| Resin | Werking | Tier |
|---|---|---|
| Cooling Resin | geneest BRN | basis |
| Cleansing Resin | geneest PSN én TOX | basis |
| Supple Resin | geneest PAR | basis |
| Rousing Resin | wekt uit SLP | mid |
| Thawing Resin | ontdooit FRZ | mid |
| Clarity Resin | geneest verwardheid | mid |
| Golden Resin | geneest élke status (Lum-opvolger) | laat/zeldzaam |
| Vital Resin | herstelt 25% HP zodra HP < 50% | mid |

Migratie: bestaande LUM_BERRY wordt GOLDEN_RESIN (save-load converteert het
oude id, niemand raakt zijn item kwijt). De losse Antidote/Burn Heal-items
blijven bestaan als goedkope niet-held variant, of gaan op in de Resins —
beslissen bij de bouw (voorkeur: opgaan in Resins, één systeem).

**1½b. Vindbaar in het wild.** Resins liggen als dinobal-pickups op alle
routes (bestaand item-pickup-systeem): elke route krijgt 1-2 zichtbare +
1 verborgen Resin passend bij het gebied (gifmoeras → Cleansing, vulkaan-
route → Cooling, enz.). Wilde DinoMons van het passende type dragen soms
een Resin (5-10%) — vangen loont.

**1½c. Overal te koop, sterkte schaalt met voortgang.** Elke stad-shop
krijgt een Resins-plank; het assortiment groeit met badges:
- 0-2 badges: Cooling / Cleansing / Supple (~150)
- 3-5 badges: + Rousing / Thawing / Vital (~250-400)
- 6+ badges: + Clarity (~500) en Golden Resin (~800)

**1½d. De Sap Farm — kopen én verkopen bij de harsboer.** Zijgebiedje bij
FERNGROVE_TOWN (flora-thema past): een boerderij met getapte oerbomen.
De harsboer:
- verkoopt het VOLLEDIGE assortiment dat jouw badge-tier toestaat, plus
  een dagvoorraad van 3 stuks van één tier hoger ("vers getapt vandaag") —
  dagwissel via de bestaande day-tracking (roamingMon gebruikt die al);
- koopt Resins in voor 75% van de winkelwaarde (normale verkoop is 50%) —
  dé plek om je wild-vondsten en gedragen Resins van gevangen mons te
  slijten;
- kleine fetch-quest ("breng me 5 wilde Resins") ontgrendelt de Golden
  Resin-voorraad vóór badge 6.
NPC/kaart-werk: mini-map (bestaand side-area patroon via route-side-warps,
zie Fase 7-aanpak), 1 boer-NPC met shop-dialoog in koop- én verkoopstand.

Hiermee is de genezings-economie rond: vinden (routes/wilde mons) →
gebruiken of verkopen (boer) → bijkopen (overal, boer heeft het beste
assortiment) → automatisch (held Resin als verzekering).

## Fase 2 — Vanguard-moves: per type één priority-aanval

Ontwerpregels: prio +1, power 40–45, 100% acc — sterk genoeg om een KO af te
maken of een sweeper te stoppen, te zwak om te spammen. De schaar wordt:
snel verslaat traag → priority verslaat snel → anti-priority-tank verslaat
priority (zie 2d).

**2a. Bestaand herbruiken (10):** Quick Attack (NORMAL), Aqua Jet (WATER),
Ice Shard (ICE), Mach Punch (FIGHTING), Bullet Punch (STEEL), Accelerock
(ROCK), Shadow Sneak (GHOST), Firecracker (FIRE, 45), Pixie Strike (FAIRY,
50→45), Skitter (BUG, 55→45). Sucker Punch (DARK, 70) krijgt zijn klassieke
voorwaarde: faalt als het doelwit geen aanval koos — hoog risico, hoge
beloning, past bij DARK.

**2b. Nieuw maken (5) voor de gaten:** Mud Dart (GROUND), Mind Flick
(PSYCHIC), Venom Dart (POISON, 30% PSN? nee — géén secundair effect op
vanguards, anders sluipt de power-creep terug), Static Jab (ELECTRIC),
Leaf Dart (GRASS). Namen/flavour in fossiel-stijl mag anders.

**2c. Balans-nerfs:** MIND_DIVE en PLATE_SLAM → prio 0 (blijven sterke moves,
geen priority meer); RIVER_RUSH/AERIAL_BLITZ/SUPERSONIC_STRIKE/GLIDE_STRIKE/
PHANTOM_CLAW/SHADOWSTEP/SWIFT_WING → óf prio 0, óf power → 40-45 en dan de
vanguard van hun type worden. WATER_SHURIKEN (15×multi) mag blijven — leuk.

**2d. Learnsets + tegenspel:**
- Injectiescript (à la expand_learnsets_v3.js): elke soort leert de vanguard
  van zijn primaire type rond Lv.22–28 → elke speler HEEFT het gereedschap.
- 2 anti-priority abilities voor trage tanks: "Ancient Guard" (immuun voor
  priority-aanvallen) op 2-3 defensieve fossielen, en "Tremor Sense"
  (priority-aanvallen doen halve schade). Zo ontstaat teambuilding.

## Fase 3 — Abilities: audit, herverdeling, synergie

**3a. Implementatie-audit.** Script dat alle 63 ability-namen grept in
battle.js/statusEffects.js → drie lijsten: werkt / flavour-only / kapot.
Fix meteen de arg-shift-bug (species met desc in het ability-veld) en
check de entry-abilities (Drought/Drizzle/Sand Stream/Snow Warning).
Flavour-only abilities krijgen óf een implementatie óf worden vervangen.

**3b. Herverdeling.** Sturdy terug naar ~6 échte tanks; vrijgekomen slots
krijgen abilities uit de nieuwe categorieën (3c) passend bij het type/thema.

**3c. Nieuwe strategische categorieën (±12 nieuw, elk max 3-4 soorten):**
1. **Status-synergie** (beloont Fase 1): Poison Heal (PSN geneest 1/8 i.p.v.
   schaadt), Flame Body (30% BRN bij contact), Synchronize (status kaatst
   terug), Shed Skin (30%/beurt zelfgenezing), Quick Feet (PAR: geen
   SPD-malus, ×1,5) — naast bestaande Guts.
2. **Anti-priority**: Ancient Guard, Tremor Sense (zie 2d).
3. **Pinch-abilities**: Blaze/Torrent/Overgrow/Swarm bestaan al — familie
   afmaken voor de overige aanvalstypen (onder 1/3 HP: type-moves ×1,5).
4. **Entry-abilities**: bestaande weather-setters naar gym/E4-teams.
Elke nieuwe ability: implementatie + activatie-popup ("Guts activated!") +
desc mét getallen. Geen ability zonder zichtbare trigger.

## Fase 4 — De strategische curve: AI-tiers op badges

Moeilijker moet slimmer betekenen, niet alleen hoger level:
- **Tier 0** (0–2 badges): huidige gewogen-random — beginners-vriendelijk.
- **Tier 1** (3–5): gebruikt status alleen als het doelwit schoon is, setup
  alleen achter een kill-loze beurt, en de **vanguard-finish** (als priority
  de KO haalt vóór de snellere speler slaat → altijd doen).
- **Tier 2** (6–9 + gym-leiders): switcht bij dubbel-zwakke matchup, bewaart
  zijn tank tegen sweepers, gebruikt anti-priority bewust.
- **Tier 3** (E4/Champion/rival-finale): kiest via 1-beurt-vooruit simulatie
  (verwachte schade beide kanten, incl. status-waarde) — geen cheats, wel
  scherp spel.
Gym-teams krijgen ability/status-synergie als identiteit (Volt-gym = PAR-
thema met Static; Fairy-gym AFK Jorn = Cute Charm/confusion; enz.) — dit is
waar "hoe verder, hoe strategischer" letterlijk voelbaar wordt.

## Fase 5 — Bewijs dat het werkt

1. `validate_battle.js`: effect-formaten canoniek, elke ability geïmplemen-
   teerd-of-bewust-flavour, vanguard-dekking = 18/18 typen, prio-power ≤ 45.
2. Status-unit-sims headless: burn tikt élke beurt, TOX escaleert 1/16→2/16→,
   PAR blijft tot genezen, teller-weergave klopt.
3. **De kernmetriek**: 1000 gesimuleerde gevechten (bestaande sim-infra):
   "% gewonnen door de snelste mon" moet aantoonbaar dalen (nu vermoedelijk
   ~75%+, doel ~55-60%), zonder dat gevechtsduur explodeert (>15 beurten
   gemiddeld = te defensief).
4. Shot-harness screenshots: status-teller in HUD, effectregel in move-
   detail, ability-popup.

## Volgorde & omvang

Fase 1 eerst (fundament + directe fix van wat "kapot voelt"), dan 1½
(Resins — genezen moet er zijn zodra status blijft plakken!), dan 2
(vanguards), dan 3 (abilities), dan 4 (AI). Fase 5 loopt mee per fase.
Raakt: moves.js, dinomons.js, statusEffects.js, battle.js, battleAI.js,
constants.js (items), bagMenu.js, partyMenu.js (move-detail),
spriteRenderer.js (HUD-badge), maps.js + events.js (Sap Farm, pickups),
shops-data, saveload.js (LUM_BERRY-migratie) + 2 nieuwe scripts
(migratie, validator). Ontwerpkeuzes zijn gemaakt: 20%-herstelmodel
(Fase 1b) en Resins als berry-familie (Fase 1½).

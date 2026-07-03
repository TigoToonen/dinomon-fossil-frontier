# EVO-STAGE-PLAN — "Welke stage ben ik, van hoeveel?"

> **STATUS: geïmplementeerd (juli 2026), optie A (pips) + C (lijn-strip).**
> Datacheck: validate_evochain.js (121 soorten groen). Screenshots:
> .claude/shots/stage1…stage8. Nog niet gedeployed.

Doel: overal in het spel (gevecht, dex, team, box/computer) in één oogopslag
duidelijk maken op welke evolutie-stage een DinoMon zit én hoeveel stages de
lijn in totaal heeft.

## Stap 0 — De datalaag (fundament, moet eerst)

Er is nu géén betrouwbare bron voor "stage X van Y":
- `_STAGE_MAP` in spriteRenderer.js (regel ~4964) is een handmatige lijst die
  alleen voor sprite-schaal wordt gebruikt — niet gekoppeld aan de echte data.
- `sp.prevForm` wordt in dinomons.js (~1689) alleen uit `evolvesTo` afgeleid,
  terwijl er VIJF evolutie-bronnen zijn (constants.js ~556-615): level
  (`evolvesTo`/`evolvesAt`), stenen, happiness, ruil en draag-items.

**Bouw `DG.EvoChain`** (nieuw bestandje `js/data/evoChain.js`, laden ná
dinomons.js + constants.js): bij het laden één keer een graaf bouwen uit alle
vijf tabellen. Per speciesId cachen:

```
{ stage: 2, total: 3, chain: ['TINDREL','TINDRAK','PYROCERATH'],
  hows: ['Lv.16', 'Lv.34'] }   // voorwaarde per stap, voor de detail-schermen
```

- `stage` = afstand vanaf de wortel + 1; `total` = langste pad door de soort.
- Meerdere routes naar hetzelfde doel (MUDFIN → SWAMPJAW via steen/ruil/item,
  FAIRYWING → BLOOMSAUR via steen én happiness) zijn géén echte vertakkingen —
  zelfde target, dus dedupliceren op target-id. Guard wel op echte branches:
  dan langste pad voor `total`.
- Soorten zonder lijn (legendaries, losse mons): `{stage:1, total:1}`.
- Bonus: `_STAGE_MAP` kan daarna weg — sprite-schaal kan `stage-1` uit
  EvoChain gebruiken (aparte opruimklus, niet blokkerend).

## De weergave-opties (keuze voor Tigo)

**Optie A — Fossiel-pips ◆◆◇ (aanbeveling voor "overal")**
Kleine diamant-pips direct naast het level. Gevuld amber = bereikte stage,
holle outline = nog te gaan. Volledig geëvolueerd = laatste pip krijgt een
gouden glans-randje. ~7px per pip, dus past op elk scherm, taalvrij, en het
totaal is meteen zichtbaar (3 pips = 3 stages). Geen tekst = geen ruimtegebrek.
Bij `total === 1` tonen we níéts (scheelt ruis bij legendaries).

**Optie B — Stage-badge "II/III"**
Klein chipje in de stijl van de bestaande type-badge. Explicieter ("dit is
stage 2 van 3" hoeft niet geteld te worden), maar tekst-drukker en op de
smalle box-rijen (namen zijn daar al afgekapt op 7 tekens) te krap.

**Optie C — Mini-lijn met sprites (alleen voor detail-schermen)**
De hele evolutielijn als rij mini-sprites met pijltjes; de huidige vorm
omkaderd; de voorwaarde ("Lv.34", "Fire Stone", "vriendschap") onder elke
pijl. Ongevangen/ongeziene vormen als donker silhouet met "?" — zo blijft
het totaal zichtbaar zonder te spoileren. Te groot voor lijsten, perfect
voor dex-detail en de team-summary.

**Optie D — Segmentbalkje (afgevallen)**
Een progressiebalk onder de naam concurreert visueel met HP- en EXP-balken
en leest als "voortgang binnen dit level" — verwarrend. Niet doen.

**Aanbeveling: A + C combineren.** Pips als universele micro-indicator op
álle schermen; de sprite-lijn als rijke weergave op de twee plekken waar
ruimte is (dex-detail, summary). B alleen als Tigo tekst boven symbolen
verkiest — de plekken zijn identiek.

## Stap 1 — Pips-component + alle lijstweergaven

Eén tekenfunctie in uiKit: `DG.UIKit.drawStagePips(ctx, x, y, speciesId, {size})`
(leest DG.EvoChain, tekent niks bij total 1). Dan aanhaken op:

| Scherm | Plek | Anker |
|---|---|---|
| Gevecht (beide HUD-plates) | onder `Lv.` rechtsboven | spriteRenderer.js `_drawMonHUD` ~6610 |
| Team-lijst | achter `Lv.${mon.level}` | partyMenu.js ~563 |
| Team-summary header | naast naam+level | partyMenu.js ~708 |
| Box/computer detailpaneel | achter `Lv.` | boxUI.js ~259 |
| Dex-lijst (alleen caught) | rechts in de rij | dexMenu.js lijst-loop |
| Evolutie-cinematic STATS-kaart | "STAGE 2/3" chip in de titelbalk | evoAnim.js `_drawStatCard` |

Spoiler-regel: pips tonen altijd het TOTAAL (ook ongezien — je ziet dus "er
is nog een 3e vorm"), maar verklappen nooit wélke. Dat is dezelfde keuze als
klassiek Pokémon ("Dratini is in het 1e stadium") en maakt de indicator
nuttig als verzamel-prikkel.

## Stap 2 — Evolutielijn-strip (optie C) op de detail-schermen

Component `DG.UIKit.drawEvoChainStrip(ctx, x, y, speciesId, gs, {w})`:
- mini-sprites via `DG.SpriteRenderer.drawMon` op scale ~0.8, pijl + voorwaarde
  (`hows[]` uit EvoChain) ertussen, huidige vorm met amber kader + glow;
- niet-geziene vormen: sprite met `brightness(0)`-filter + "?" (silhouet);
- vervangt in dex-detail de huidige éénregelige
  `Evolves → X at Lv.Y` (dexMenu.js ~427-431) — die regel toont nu alleen de
  vólgende stap en alleen voor level-evo's; steen/happiness/ruil-lijnen missen.
- ook onderin de team-summary (daar is nog een lege strook onder de moves).

## Stap 3 — Verificatie

Headless via de bekende harness (?devloop=1 + __PUMP + shot_server):
1. Battle starten → shot van beide HUD-plates met pips (stage 1/3 vs 3/3).
2. Dex-detail van een caught 3-traps lijn + een steen-lijn + een legendary.
3. Team + box openen met gemengde party (1/1, 2/3, 3/3, shiny).
4. Consistentie-check script (node): voor alle 121 soorten stage/total
   berekenen en asserten dat elke `chain` klopt met de vijf brontabellen
   (geen wezen, geen cycli, totalen 1-3).

## Volgorde & omvang

Stap 0 (datalaag) → Stap 1 (pips overal) is de kern en direct overal
zichtbaar. Stap 2 is de visuele kers voor dex/summary. Raakt: nieuw
`js/data/evoChain.js`, uiKit.js, spriteRenderer.js, partyMenu.js, boxUI.js,
dexMenu.js, evoAnim.js + index.html (v-bumps).

// ════════════════════════════════════════════════════════════════
// DinoMon — battle/status consistentie-check (BATTLE-STRATEGY Fase 1)
// 1) moves.js: geen legacy effect-formaten, TOXIC = BADPOISON,
//    elke STATUS_CHANCE heeft geldige status + kans.
// 2) statusEffects.js gedrags-sims: schade tikt élke beurt, eerste
//    beurt gegarandeerd, herstel ≈20%/beurt (TOX 10%), TOX escaleert,
//    SLP-teller zichtbaar, FRZ geneest niet via end-of-turn.
// Run:  node validate_battle.js
// ════════════════════════════════════════════════════════════════
const fs = require('fs');
globalThis.window = globalThis;
function load(f) { (0, eval)(fs.readFileSync(f, 'utf8')); }
load('js/constants.js');
load('js/data/moves.js');
load('js/data/dinomons.js');
load('js/battle/statusEffects.js');

const issues = [];
const add = (m) => issues.push(m);

// ── 1. Data-checks ─────────────────────────────────────────
const LEGACY = ['BURN_CHANCE', 'POISON_CHANCE', 'FREEZE_CHANCE'];
const VALID_STATUS = ['BURN', 'POISON', 'BADPOISON', 'PARALYSIS', 'SLEEP', 'FREEZE'];
let statusMoves = 0;
for (const id in DG.MOVES) {
  const e = DG.MOVES[id].effect;
  if (!e || !e.type) continue;
  if (LEGACY.includes(e.type)) add(`${id}: legacy effect-type ${e.type}`);
  if ((e.type === 'PARALYSIS' || e.type === 'SLEEP') && e.chance !== undefined) {
    add(`${id}: legacy effect-type ${e.type} (moet STATUS_CHANCE zijn)`);
  }
  if (e.type === 'STATUS_CHANCE') {
    statusMoves++;
    if (!VALID_STATUS.includes(e.status)) add(`${id}: onbekende status ${e.status}`);
    if (!(e.chance >= 1 && e.chance <= 100)) add(`${id}: ongeldige kans ${e.chance}`);
  }
}
if (DG.MOVES.TOXIC.effect.status !== 'BADPOISON') add('TOXIC past geen BADPOISON toe');

// ── 2. Gedrags-sims ────────────────────────────────────────
function mkMon() {
  // NORMLET (NORMAL-type): immuun voor niets — Fire-types kunnen bv. niet branden
  return { speciesId: 'NORMLET', nickname: null, level: 20,
           hp: { current: 160, max: 160 },
           stats: { hp:160, atk:50, def:50, spAtk:50, spDef:50, spd:50 },
           statusEffect: null, statusTurns: 0, confusionTurns: 0 };
}
const S = DG.StatusEffects;
const realRandom = Math.random;

// 2a. Burn: schade élke beurt; eerste end-of-turn NOOIT herstel
Math.random = () => 0.0; // herstel-roll slaagt altijd (0 < 0.20) — worst case
{
  const m = mkMon();
  S.apply(m, DG.STATUS.BURN);
  const hp0 = m.hp.current;
  S.endOfTurnTick(m, null);
  if (m.hp.current !== hp0 - 10) add(`burn-schade klopt niet: ${hp0 - m.hp.current} i.p.v. 10 (1/16)`);
  if (m.statusEffect !== DG.STATUS.BURN) add('burn verdween al na de 1e beurt (gegarandeerde beurt geschonden)');
  S.endOfTurnTick(m, null);
  if (m.statusEffect !== null) add('burn herstelde niet bij rand=0 op de 2e beurt');
}

// 2b. Burn blijft eeuwig bij rand≥0.2 (geen stiekeme duur meer)
Math.random = () => 0.99;
{
  const m = mkMon();
  S.apply(m, DG.STATUS.BURN);
  for (let i = 0; i < 12; i++) S.endOfTurnTick(m, null);
  if (m.statusEffect !== DG.STATUS.BURN) add('burn verdween ondanks rand=0.99 — er zit nog een duur-pad in');
  if (m.hp.current !== 160 - 12 * 10) add(`burn tikte niet elke beurt: ${160 - m.hp.current} schade na 12 beurten`);
}

// 2c. Herstelkans ≈ 20% per beurt (statistisch, echte random)
Math.random = realRandom;
{
  let recoveredAt = [];
  for (let run = 0; run < 4000; run++) {
    const m = mkMon(); m.hp.max = 1600; m.hp.current = 1600;
    S.apply(m, DG.STATUS.PARALYSIS);
    for (let t = 1; t <= 60 && m.statusEffect; t++) {
      S.endOfTurnTick(m, null);
      if (!m.statusEffect) recoveredAt.push(t);
    }
  }
  const meanT = recoveredAt.reduce((a,b)=>a+b,0) / recoveredAt.length;
  // verwachting: 1 gegarandeerde beurt + geometrisch p=0.2 → gem. ≈ 1 + 5 = 6
  if (!(meanT > 5.2 && meanT < 6.8)) add(`PAR-herstel wijkt af: gemiddeld ${meanT.toFixed(2)} beurten (verwacht ~6)`);
  const firstTurn = recoveredAt.filter(t => t === 1).length;
  if (firstTurn > 0) add(`PAR herstelde ${firstTurn}× al op beurt 1 (gegarandeerde beurt geschonden)`);
}

// 2d. Toxic escaleert 1/16 → 2/16 → 3/16 en herstelt ~10%
Math.random = () => 0.99;
{
  const m = mkMon();
  S.apply(m, DG.STATUS.BADPOISON);
  const drops = [];
  for (let i = 0; i < 3; i++) {
    const before = m.hp.current;
    S.endOfTurnTick(m, null);
    drops.push(before - m.hp.current);
  }
  if (drops.join(',') !== '10,20,30') add(`TOX escaleert niet (schade: ${drops.join(',')} — verwacht 10,20,30)`);
}
Math.random = realRandom;
{
  let rec = 0, total = 6000;
  for (let run = 0; run < total; run++) {
    const m = mkMon();
    S.apply(m, DG.STATUS.BADPOISON);
    S.endOfTurnTick(m, null);        // beurt 1: gegarandeerd
    if (!m.statusEffect) { add('TOX herstelde op beurt 1'); break; }
    S.endOfTurnTick(m, null);        // beurt 2: 10% kans
    if (!m.statusEffect) rec++;
  }
  const pct = rec / total;
  if (!(pct > 0.07 && pct < 0.13)) add(`TOX-herstelkans wijkt af: ${(pct*100).toFixed(1)}% (verwacht ~10%)`);
}

// 2e. Sleep: teller 1–3, badge toont hem, telt af bij beweegpogingen
{
  const seen = new Set();
  for (let i = 0; i < 200; i++) {
    const m = mkMon();
    S.apply(m, DG.STATUS.SLEEP);
    seen.add(m.statusTurns);
    if (i === 0) {
      const b = S.badgeText(m);
      if (!/^SLP \d$/.test(b)) add(`SLP-badge zonder teller: "${b}"`);
    }
  }
  if (![...seen].every(t => t >= 1 && t <= 3)) add(`SLP-duur buiten 1-3: ${[...seen].join(',')}`);
}

// 2f. Freeze: end-of-turn geneest NIET (alleen freezeCheck/fire doet dat)
Math.random = () => 0.0;
{
  const m = mkMon();
  S.apply(m, DG.STATUS.FREEZE);
  for (let i = 0; i < 5; i++) S.endOfTurnTick(m, null);
  if (m.statusEffect !== DG.STATUS.FREEZE) add('FRZ genas via end-of-turn — dubbel genezingspad is terug');
  const r = S.freezeCheck(m); // rand=0 < 0.2 → ontdooit
  if (m.statusEffect !== null || !r.canMove) add('freezeCheck ontdooide niet bij rand=0');
}
Math.random = realRandom;

// 2g. TOX-badge toont escalatie
{
  const m = mkMon();
  S.apply(m, DG.STATUS.BADPOISON);
  Math.random = () => 0.99;
  S.endOfTurnTick(m, null); S.endOfTurnTick(m, null);
  Math.random = realRandom;
  if (S.badgeText(m) !== 'TOX×2') add(`TOX-badge klopt niet: "${S.badgeText(m)}"`);
}

// ── 3. Fase 2: vanguard-checks ─────────────────────────────
// 3a. Elk van de 18 typen heeft een vanguard die bestaat, prio ≥1 en ≤45 power heeft
const ALL_TYPES = ['NORMAL','FIRE','WATER','GRASS','ELECTRIC','ICE','FIGHTING','POISON',
  'GROUND','FLYING','PSYCHIC','BUG','ROCK','GHOST','DRAGON','DARK','STEEL','FAIRY'];
if (!DG.VANGUARDS) add('DG.VANGUARDS ontbreekt');
else {
  for (const t of ALL_TYPES) {
    const vg = DG.VANGUARDS[t];
    const m = vg && DG.MOVES[vg];
    if (!m) { add(`type ${t}: geen (bestaande) vanguard`); continue; }
    if (!(m.priority >= 1)) add(`${vg}: prio ${m.priority} < 1`);
    if (m.type !== t) add(`${vg}: type ${m.type} ≠ ${t}`);
    // power-cap 45; SUCKER_PUNCH (70) mag door zijn faal-conditie
    if (vg !== 'SUCKER_PUNCH' && (m.power || 0) > 45) add(`${vg}: power ${m.power} > 45`);
  }
}
// 3b. Geen enkele andere schade-move met prio >0 boven de 45-cap
// (uitzonderingen: Sucker Punch = conditie, Water Shuriken = 15×multi,
//  First Impression = door niemand leerbaar, klassiek 90/prio2)
const PRIO_OK = new Set(['SUCKER_PUNCH', 'WATER_SHURIKEN', 'FIRST_IMPRESSION']);
for (const id in DG.MOVES) {
  const m = DG.MOVES[id];
  if ((m.priority || 0) > 0 && (m.power || 0) > 45 && !PRIO_OK.has(id)) {
    add(`${id}: prio ${m.priority} met power ${m.power} — power-creep`);
  }
}
// 3c. Learnset-injectie: elke soort met een primair-type-vanguard kan er één leren
const VG_IDS = new Set(Object.values(DG.VANGUARDS || {}));
let vgCovered = 0, vgTotal = 0;
for (const id in DG.SPECIES) {
  const s = DG.SPECIES[id];
  const t = s.types && s.types[0];
  if (!t || !DG.VANGUARDS[t]) continue;
  vgTotal++;
  const has = (s.learnset || []).some(e => {
    const mv = Array.isArray(e.move) ? e.move : [e.move];
    return mv.some(x => VG_IDS.has(x));
  });
  if (has) vgCovered++;
  else add(`${id}: geen vanguard in learnset (type ${t})`);
}
// 3d. Anti-priority abilities toegewezen
const abCount = {};
for (const id in DG.SPECIES) { const a = DG.SPECIES[id].ability; abCount[a] = (abCount[a] || 0) + 1; }
if (!(abCount['Ancient Guard'] >= 2)) add('Ancient Guard op minder dan 2 soorten');
if (!(abCount['Tremor Sense'] >= 2)) add('Tremor Sense op minder dan 2 soorten');

// ── 4. Fase 3: ability-checks ──────────────────────────────
// 4a. Elke toegewezen ability komt voor in de engine (naam-zoektocht ZONDER
// quotes — les van Predator's Mind: apostrof-namen staan in dubbele quotes)
const engineSrc = fs.readFileSync('js/battle/battle.js', 'utf8')
                + fs.readFileSync('js/battle/statusEffects.js', 'utf8')
                + fs.readFileSync('js/battle/typeChart.js', 'utf8')
                + fs.readFileSync('js/battle/battleAI.js', 'utf8');
for (const a in abCount) {
  if (!engineSrc.includes(a)) add(`ability "${a}" is flavour-only (nergens in de engine)`);
}
// 4b. Nieuwe status-synergie-abilities zijn toegewezen; Sturdy is verdund
for (const a of ['Poison Heal', 'Shed Skin', 'Quick Feet', 'Synchronize', 'Flame Body']) {
  if (!(abCount[a] >= 1)) add(`${a} aan geen enkele soort toegewezen`);
}
if (abCount['Sturdy'] > 8) add(`Sturdy nog steeds op ${abCount['Sturdy']} soorten (inflatie)`);

console.log(`Vanguard-dekking: ${vgCovered}/${vgTotal} soorten | Sturdy op ${abCount['Sturdy']} soorten`);
console.log('═══ Battle/status validatie (Fase 1 + 2 + 3) ═══');
console.log(`STATUS_CHANCE-moves: ${statusMoves}`);
if (issues.length === 0) {
  console.log('ALLES OK — formaat canoniek, 20%-herstelmodel gedraagt zich exact volgens plan.');
} else {
  console.log(`${issues.length} PROBLEMEN:`);
  issues.forEach(m => console.log('  - ' + m));
  process.exitCode = 1;
}

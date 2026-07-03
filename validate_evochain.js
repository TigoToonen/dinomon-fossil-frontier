// ════════════════════════════════════════════════════════════════
// DinoMon — EvoChain consistentie-check (EVO-STAGE-PLAN stap 3)
// Controleert voor ALLE soorten dat stage/total/chain kloppen met de
// vijf evolutie-brontabellen. Run:  node validate_evochain.js
// ════════════════════════════════════════════════════════════════
const fs = require('fs');
globalThis.window = globalThis;
function load(f) { (0, eval)(fs.readFileSync(f, 'utf8')); }
load('js/constants.js');
load('js/data/moves.js');
load('js/data/dinomons.js');
load('js/data/evoChain.js');

const S = DG.SPECIES;
const issues = [];
const add = (m) => issues.push(m);

// Verzamel alle geldige edges uit de vijf bronnen (from|to)
const validEdges = new Set();
for (const id in S) {
  if (S[id].evolvesTo && S[S[id].evolvesTo]) validEdges.add(id + '|' + S[id].evolvesTo);
}
for (const st in (DG.STONE_EVOLUTIONS || {})) {
  const t = DG.STONE_EVOLUTIONS[st];
  for (const f in t) if (S[f] && S[t[f]]) validEdges.add(f + '|' + t[f]);
}
for (const f in (DG.HAPPINESS_EVOLUTIONS || {})) {
  const to = DG.HAPPINESS_EVOLUTIONS[f].evolves;
  if (S[f] && S[to]) validEdges.add(f + '|' + to);
}
for (const f in (DG.TRADE_EVOLUTIONS || {})) {
  const to = DG.TRADE_EVOLUTIONS[f];
  if (S[f] && S[to]) validEdges.add(f + '|' + to);
}
for (const f in (DG.HELD_ITEM_EVOLUTIONS || {})) {
  const to = DG.HELD_ITEM_EVOLUTIONS[f].evolves;
  if (S[f] && S[to]) validEdges.add(f + '|' + to);
}

let n = 0;
const totals = {};
for (const id in S) {
  n++;
  const info = DG.EvoChain.get(id);
  totals[info.total] = (totals[info.total] || 0) + 1;
  if (!(info.stage >= 1)) add(`${id}: stage ${info.stage} < 1`);
  if (!(info.total >= info.stage)) add(`${id}: total ${info.total} < stage ${info.stage}`);
  if (info.total > 3) add(`${id}: onverwacht lange lijn (total ${info.total}) — check de data`);
  if (info.chain[info.stage - 1] !== id) add(`${id}: chain[stage-1] is ${info.chain[info.stage - 1]}`);
  if (info.chain.length !== info.total) add(`${id}: chain.length ${info.chain.length} ≠ total ${info.total}`);
  if (info.hows.length !== info.chain.length - 1) add(`${id}: hows.length klopt niet`);
  if (new Set(info.chain).size !== info.chain.length) add(`${id}: cyclus/duplicaat in chain`);
  for (let i = 0; i < info.chain.length - 1; i++) {
    const e = info.chain[i] + '|' + info.chain[i + 1];
    if (!validEdges.has(e)) add(`${id}: stap ${e} bestaat in geen enkele evolutietabel`);
  }
}

// Spot-checks van bekende lijnen
const expect = (id, stage, total) => {
  const i = DG.EvoChain.get(id);
  if (i.stage !== stage || i.total !== total) {
    add(`spot-check ${id}: verwacht ${stage}/${total}, kreeg ${i.stage}/${i.total} (chain: ${i.chain.join('→')})`);
  }
};
expect('TINDREL', 1, 3);
expect('TINDRAK', 2, 3);
expect('PYROCERATH', 3, 3);
expect('SHADOWLET', 1, 3);   // happiness-lijn: SHADOWLET→DUSKFANG→NIGHTREX
expect('NIGHTREX', 3, 3);
expect('STEELBACK', 1, 3);   // ruil/item-lijn: STEELBACK→IRONSCALE→TITANOSAUR
expect('EMBRIX', 1, 3);      // steen-lijn: EMBRIX→SOLARIX→SCORCHBACK
expect('SCORCHBACK', 3, 3);
// Steen-only regel: het label EMBRIX→SOLARIX moet de steen zijn, niet Lv.22
{
  const i = DG.EvoChain.get('EMBRIX');
  if (i.hows[0] !== 'Fire Stone') add(`EMBRIX: how-label "${i.hows[0]}" — verwacht "Fire Stone" (steen-only lijn)`);
}
if (S.GLACIODON) expect('GLACIODON', 1, 1); // legendary, geen lijn

console.log(`═══ EvoChain validatie ═══`);
console.log(`Soorten: ${n}  |  lijnen per lengte:`, totals);
if (issues.length === 0) {
  console.log('ALLES OK — stage/total/chain consistent met alle vijf evolutietabellen.');
} else {
  console.log(`${issues.length} PROBLEMEN:`);
  issues.forEach(m => console.log('  - ' + m));
  process.exitCode = 1;
}

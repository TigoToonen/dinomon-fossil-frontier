// learnsweep.js — DATA-INTEGRITEIT van movesets (ronde 11). Een ongeldig move-ID
// in een learnset of trainer-party wordt stil weggefilterd → een mon leert de
// move nooit, zonder foutmelding. Deze scan vangt zulke typo's/dode verwijzingen.
//   1. Elk learnset-move-ID bestaat (ook binnen array-pools)
//   2. Elke soort levert op div. levels een battle-klare moveset (≥1 damage)
//   3. Elke trainer-party-move bestaat + zit in de learnset van die soort
//   4. TM/HM-move-IDs bestaan
// Run: node learnsweep.js   (exit 1 bij FAIL)
'use strict';
const fs = require('fs');
globalThis.window = globalThis;
globalThis.localStorage = { getItem:()=>null, setItem:()=>{}, removeItem:()=>{} };
const noop = new Proxy(function(){}, { get:()=>noop, apply:()=>undefined });
function L(f){ (0,eval)(fs.readFileSync(f,'utf8')); }
['js/constants.js','js/data/moves.js','js/data/dinomons.js','js/data/natures.js',
 'js/data/tmData.js','js/data/trainers.js','js/engine/saveload.js'].forEach(L);

const fails = [], warns = [];
const isDmg = id => { const m = DG.MOVES[id]; return m && m.category !== 'STATUS' && (m.power||0) > 0; };

// ── 1. Learnset-integriteit (incl. array-pools) ──────────────
let poolCount = 0, entryCount = 0;
for (const sid in DG.SPECIES){
  const s = DG.SPECIES[sid]; if (!s.learnset) continue;
  for (const e of s.learnset){
    entryCount++;
    const ids = Array.isArray(e.move) ? e.move : [e.move];
    if (Array.isArray(e.move)) poolCount++;
    for (const id of ids){
      if (typeof id !== 'string' || !DG.MOVES[id])
        fails.push(`learnset ${sid} lv${e.level}: ongeldig move-ID "${id}"`);
    }
    if (Array.isArray(e.move) && !e.move.some(id => DG.MOVES[id]))
      fails.push(`learnset ${sid} lv${e.level}: pool heeft GEEN geldige move`);
  }
}
console.log(`[1] Learnset-IDs: ${entryCount} entries (${poolCount} pools) gecontroleerd — ${fails.length} ongeldig`);

// ── 2. Elke soort battle-klaar op meerdere levels ────────────
let noDmg = 0;
for (const sid in DG.SPECIES){
  const s = DG.SPECIES[sid]; if (s.speciesCategory === 'FORME' || !(s.learnset||[]).length) continue;
  for (const lvl of [5,15,30,50,70,100]){
    const hasDmgInLearnset = s.learnset.some(e => {
      const ids = Array.isArray(e.move) ? e.move : [e.move];
      return e.level <= lvl && ids.some(isDmg);
    });
    if (!hasDmgInLearnset) continue;   // niks te verwachten
    const m = DG.SaveLoad.createDinoMon(sid, lvl);
    if (!m) { fails.push(`createDinoMon faalt: ${sid} lv${lvl}`); continue; }
    if (!m.moves.some(mv => isDmg(mv.moveId))){ noDmg++; fails.push(`${sid} lv${lvl}: auto-moveset zonder damage [${m.moves.map(x=>x.moveId).join(',')}]`); }
  }
}
console.log(`[2] Battle-klaar: alle soorten × 6 levels — ${noDmg} zonder damage-move`);

// ── 3. Trainer-party-moves bestaan + zitten in de learnset ───
let tMoveBad = 0, tNotInLearnset = 0, tChecked = 0;
for (const tid in DG.TRAINERS){
  const t = DG.TRAINERS[tid]; if (!t.party) continue;
  for (const p of t.party){
    const s = DG.SPECIES[p.speciesId];
    if (!s){ fails.push(`trainer ${tid}: onbekende soort ${p.speciesId}`); continue; }
    const learnIds = new Set((s.learnset||[]).flatMap(e => Array.isArray(e.move) ? e.move : [e.move]));
    const tmIds = new Set(Object.keys(DG.TM_DATA || {}).map(k => (DG.TM_DATA[k].move || DG.TM_DATA[k])));
    for (const mv of (p.moves||[])){
      tChecked++;
      if (!DG.MOVES[mv]){ tMoveBad++; fails.push(`trainer ${tid}/${p.speciesId}: ongeldige move "${mv}"`); continue; }
      // info-warn: move niet in learnset én geen TM (mag legaal zijn via tutor, dus WARN niet FAIL)
      if (!learnIds.has(mv) && !tmIds.has(mv)) { tNotInLearnset++; warns.push(`trainer ${tid}/${p.speciesId}: "${mv}" niet in learnset/TM (tutor-move?)`); }
    }
  }
}
console.log(`[3] Trainer-moves: ${tChecked} gecontroleerd — ${tMoveBad} ongeldig, ${tNotInLearnset} buiten learnset (info)`);

// ── 4. TM/HM-move-IDs bestaan ────────────────────────────────
let tmBad = 0, tmN = 0;
for (const k in (DG.TM_DATA || {})){
  const mid = DG.TM_DATA[k].move || DG.TM_DATA[k]; tmN++;
  if (typeof mid === 'string' && !DG.MOVES[mid]){ tmBad++; fails.push(`TM ${k}: ongeldige move "${mid}"`); }
}
console.log(`[4] TM/HM: ${tmN} gecontroleerd — ${tmBad} ongeldig`);

console.log(`\nFAIL: ${fails.length}   (WARN: ${warns.length})`);
fails.slice(0,40).forEach(f=>console.log('  [FAIL] '+f));
if (process.env.SHOW_WARN) warns.slice(0,40).forEach(w=>console.log('  [warn] '+w));
process.exit(fails.length ? 1 : 0);

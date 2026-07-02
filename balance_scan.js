// balance_scan.js — analytic balance scan over species + moves.
// Run: node balance_scan.js   (report only; flags outliers, changes nothing)
'use strict';
const fs = require('fs');
globalThis.window = globalThis;
function L(f){ (0,eval)(fs.readFileSync(f,'utf8')); }
L('js/constants.js'); L('js/data/moves.js'); L('js/data/dinomons.js');

const S = DG.SPECIES, M = DG.MOVES;

// ── 1. MOVE OUTLIERS: effective power = power × accuracy × avg hits ─────────
const dmgMoves = Object.values(M).filter(m => (m.category==='PHYSICAL'||m.category==='SPECIAL') && (m.power||0) > 0);
const evalMove = (m) => {
  const acc = (m.accuracy && m.accuracy < 999) ? m.accuracy/100 : 1;
  let hits = 1;
  const e = m.effect || {};
  if (e.type==='MULTI'){ const [lo,hi] = e.hits || [e.min||2, e.max||5]; hits = (lo+hi)/2 * 0.85; }
  let ep = m.power * acc * hits;
  if (e.type==='TWO_TURN' || e.type==='RECHARGE') ep *= 0.5;  // costs an extra turn
  if (e.type==='RECOIL') ep *= 0.85;
  return Math.round(ep);
};
const scored = dmgMoves.map(m=>({ id:m.id, type:m.type, pw:m.power, acc:m.accuracy, ep:evalMove(m), eff:(m.effect||{}).type||'NONE' }));
scored.sort((a,b)=>b.ep-a.ep);
console.log('═══ MOVES — hoogste effectieve power (top 12) ═══');
scored.slice(0,12).forEach(m=>console.log(`  ${m.id.padEnd(20)} ep=${String(m.ep).padStart(4)}  (pw ${m.pw}, acc ${m.acc}, ${m.eff})`));
console.log('═══ MOVES — laagste effectieve power (bottom 8, >0 pw) ═══');
scored.slice(-8).forEach(m=>console.log(`  ${m.id.padEnd(20)} ep=${String(m.ep).padStart(4)}  (pw ${m.pw}, acc ${m.acc}, ${m.eff})`));

// ── 2. SPECIES OUTLIERS: BST + offense/bulk, grouped by evolution stage ─────
const isFinal = id => !S[id].evolvesTo;
const stageOf = id => { let d=0,c=id; while(S[c] && S[c].prevForm){ c=S[c].prevForm; d++; } return d; };
const rows = Object.keys(S).map(id=>{
  const sp=S[id], bs=sp.baseStats||{};
  const bst=(bs.hp||0)+(bs.atk||0)+(bs.def||0)+(bs.spAtk||0)+(bs.spDef||0)+(bs.spd||0);
  // best usable STAB move in learnset (≤ lv50)
  let best=0, bestId='-';
  (sp.learnset||[]).forEach(Le=>{ if(Le.level>50) return; const mv=M[Le.move]; if(!mv||!(mv.power>0)) return;
    const stab=(sp.types||[]).includes(mv.type)?1.5:1; const ep=evalMove(mv)*stab*((mv.category==='PHYSICAL'?bs.atk:bs.spAtk)||50)/100;
    if(ep>best){best=Math.round(ep);bestId=mv.id;} });
  return { id, bst, off:best, bestId, legendary:!!sp.isLegendary, final:isFinal(id), stage:stageOf(id) };
});
const finals = rows.filter(r=>r.final && !r.legendary);
const avg = finals.reduce((a,r)=>a+r.bst,0)/finals.length;
finals.sort((a,b)=>b.bst-a.bst);
console.log(`\n═══ SOORTEN — eindvormen (niet-legendary), gem. BST ${Math.round(avg)} ═══`);
console.log('  Sterkste 6:');
finals.slice(0,6).forEach(r=>console.log(`    ${r.id.padEnd(14)} BST ${r.bst}  offense ${r.off} (${r.bestId})`));
console.log('  Zwakste 6:');
finals.slice(-6).forEach(r=>console.log(`    ${r.id.padEnd(14)} BST ${r.bst}  offense ${r.off} (${r.bestId})`));
// finals with NO damaging STAB by lv50 = real problem
const noStab = finals.filter(r=>r.off===0);
console.log(noStab.length ? `  ⚠ eindvormen ZONDER damaging move ≤lv50: ${noStab.map(r=>r.id).join(', ')}` : '  ✓ elke eindvorm heeft een damaging move ≤lv50');

// stat anomalies: a stat of 0/undefined or >200 on any species
const weird = rows.filter(r=>{ const bs=S[r.id].baseStats||{}; return ['hp','atk','def','spAtk','spDef','spd'].some(k=>!(bs[k]>0) || bs[k]>200); });
console.log(weird.length ? `  ⚠ soorten met rare base stats (0/undefined/>200): ${weird.map(r=>r.id).join(', ')}` : '  ✓ geen kapotte base stats');

// damaging moves nobody can learn ≤ lv50 with power>140 (balance watch)
console.log('\nKlaar — dit is een rapportage; er is niets gewijzigd.');

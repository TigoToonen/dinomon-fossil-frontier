// speciesrating.js — SOORT-BALANS-AUDIT (ronde 10, betrouwbaar ná de move-fix).
// Elke soort krijgt zijn STERKSTE damage-loadout (isoleert stats+typing, geen
// moveset-RNG) en vecht op gelijk level tegen een vast, divers referentiepanel.
// Win-% = inherente kracht. We rapporteren de over- en underpowered outliers.
// Run: node speciesrating.js [level]
'use strict';
const fs = require('fs');
globalThis.window = globalThis;
globalThis.localStorage = { getItem:()=>null, setItem:()=>{}, removeItem:()=>{} };
const noop = new Proxy(function(){}, { get:()=>noop, apply:()=>undefined });
function L(f){ (0,eval)(fs.readFileSync(f,'utf8')); }
['js/constants.js','js/data/moves.js','js/data/dinomons.js','js/data/natures.js',
 'js/data/tmData.js','js/data/trainers.js','js/data/maps.js','js/battle/typeChart.js',
 'js/battle/statusEffects.js','js/battle/battleAI.js','js/engine/saveload.js',
 'js/battle/battle.js'].forEach(L);
DG.BattleAnim = noop; DG.Audio = noop; DG.Input = noop;
DG.DialogueBox = { show:(m,cb)=>{ if(typeof cb==='function') cb(); }, update:()=>{} };

const B = DG.Battle, AI = DG.BattleAI;
const LEVEL = parseInt(process.argv[2] || '50', 10);
const bstOf = id => { const s=DG.SPECIES[id]; return s&&s.baseStats?Object.values(s.baseStats).reduce((a,b)=>a+b,0):0; };

const ALL = Object.keys(DG.SPECIES).filter(id => {
  const s = DG.SPECIES[id]; return s && s.baseStats && s.speciesCategory !== 'FORME' && (s.learnset||[]).length > 0;
});

// sterkste damage-loadout: top-4 damage-moves op power*(STAB?1.5:1), min. 1 STAB indien mogelijk
function bestLoadout(id, level){
  const s = DG.SPECIES[id]; const types = s.types || [];
  const dmg = (s.learnset||[]).filter(e => e.level <= level)
    .flatMap(e => Array.isArray(e.move) ? e.move : [e.move])   // resolve pool-entries
    .filter(m => { const mv = DG.MOVES[m]; return mv && mv.category !== 'STATUS' && (mv.power||0) > 0; });
  const uniq = [...new Set(dmg)];
  uniq.sort((a,b) => {
    const ma=DG.MOVES[a], mb=DG.MOVES[b];
    const sa=(ma.power||0)*(types.includes(ma.type)?1.5:1), sb=(mb.power||0)*(types.includes(mb.type)?1.5:1);
    return sb - sa;
  });
  return uniq.slice(0,4);
}
function mk(id, level){
  const lo = bestLoadout(id, level);
  const m = DG.SaveLoad.createDinoMon(id, level, null, lo.length ? lo : undefined);
  if (m) m.hp.current = m.hp.max;
  return m;
}

// referentiepanel: 12 diverse soorten (spreiding types + BST), vast
const PANEL = ['PYROCERATH','GLACIODON','TITANOSAUR','SKYFANG','GHOSTBONE','MEGASTONE',
               'VERDANTHORN','THUNDERSAUR','TOXICARNO','SOLARIX','NIGHTREX','SWAMPZILLA']
               .filter(id => DG.SPECIES[id]);

function duel(aId, bId){
  const A = mk(aId, LEVEL), Bm = mk(bId, LEVEL);
  if (!A || !Bm || !A.moves.length || !Bm.moves.length) return null;
  const gs = { player:{ party:[A], bag:{}, money:0, flags:{}, badges:[], dex:{}, stats:{}, box:[], currentMap:'X', x:5, y:5 }, settings:{ textSpeed:'FAST' } };
  let result = null, turns = 0;
  B.start({ type:'WILD', enemy: Bm, gameState: gs, onEnd: r => result = r });
  for (let f=0; f<40000 && B.isActive(); f++){
    B.update(16); const st = B.getState();
    if (st === 'PLAYER_INPUT'){ turns++; if (turns>200){ result='DRAW'; break; }
      const bt = B.getBattle(); let a; try { a = AI.chooseAction({aiTier:3}, bt.playerMon, bt.enemyMon, {}); } catch(e){ a={type:'MOVE',moveIndex:0}; }
      B.submitPlayerAction(a); }
    if (st === 'LEARN_MOVE'){ try{ B.confirmLearnMove(-1); }catch(e){} }
  }
  return result;  // WIN = soort A won
}

console.log(`═══ Soort-power-rating op lv${LEVEL} (best loadout vs 12-soorten-panel) ═══`);
const rows = [];
for (const id of ALL){
  if (PANEL.includes(id)) { /* panel-soorten ook raten */ }
  let w=0, n=0;
  for (const p of PANEL){ if (p===id) continue; const r = duel(id, p); if (r===null) continue; n++; if (r==='WIN') w++; }
  if (n) rows.push({ id, wr: w/n, bst: bstOf(id), types:(DG.SPECIES[id].types||[]).join('/') });
}
rows.sort((a,b)=>b.wr-a.wr);
const fmt = r => `${r.id.padEnd(14)} ${(r.wr*100).toFixed(0).padStart(3)}%  BST${String(r.bst).padStart(3)}  ${r.types}`;
console.log('\n▲ TOP 12 (mogelijk overpowered):');
rows.slice(0,12).forEach(r=>console.log('  '+fmt(r)));
console.log('\n▼ BODEM 12 (mogelijk underpowered):');
rows.slice(-12).forEach(r=>console.log('  '+fmt(r)));
// outliers: hoge win% bij lage BST (te sterk voor stats) of omgekeerd
const overByBst = rows.filter(r => r.wr>=0.75 && r.bst<420).sort((a,b)=>b.wr-a.wr);
const weakHighBst = rows.filter(r => r.wr<=0.30 && r.bst>=480).sort((a,b)=>a.wr-b.wr);
console.log('\n⚠ Sterk ondanks LAGE BST (<420, win≥75%):');
overByBst.slice(0,10).forEach(r=>console.log('  '+fmt(r)));
console.log('\n⚠ Zwak ondanks HOGE BST (≥480, win≤30%) — verdachte movepools/typing:');
weakHighBst.slice(0,10).forEach(r=>console.log('  '+fmt(r)));
fs.writeFileSync('.claude/speciesrating.json', JSON.stringify(rows, null, 1));
process.exit(0);

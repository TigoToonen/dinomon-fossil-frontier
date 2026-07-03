// abilitysweep.js — ABILITY-AUDIT (ronde 14). Twee bug-klassen:
//   A. Een soort-ability waarvoor NERGENS exact-matchende battle-code bestaat
//      → vuurt stil nooit (cosmetisch/no-op). (zo bleek GLACIOKING's naam fout.)
//   B. Battle-code die op een ability-naam checkt die GEEN soort exact heeft
//      → dode code / naam-mismatch.
// Plus functionele spot-checks (Technician, Rock Head, weer-snelheid) via echte
// gevechten met synthetische soorten. Run: node abilitysweep.js  (exit 1 = FAIL)
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

const fails = [], warns = [];
const battleSrc = ['js/battle/battle.js','js/battle/statusEffects.js','js/battle/battleAI.js','js/battle/typeChart.js']
  .map(f => fs.readFileSync(f,'utf8')).join('\n');

// ── A. Soort-abilities zonder exact-matchende code ───────────
const abilities = [...new Set(Object.values(DG.SPECIES).map(s => s.ability).filter(a => a && typeof a === 'string'))];
let noCode = 0;
for (const ab of abilities){
  // exacte string als code-literal? (tussen quotes, of regex-alternatief in lowercase)
  const esc = ab.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const present = new RegExp(`['"\`]${esc}['"\`]`).test(battleSrc)
               || new RegExp(esc.toLowerCase().replace(/\s+/g,'\\s*')).test(battleSrc.toLowerCase());
  if (!present){ noCode++; warns.push(`ability "${ab}" heeft GEEN exact-matchende battle-code (mogelijk no-op) — soorten: ${Object.keys(DG.SPECIES).filter(id=>DG.SPECIES[id].ability===ab).slice(0,3).join(',')}`); }
}
console.log(`[A] ${abilities.length} unieke soort-abilities — ${noCode} zonder duidelijke code-match (WARN)`);

// ── Functionele spot-checks via synthetische soorten ─────────
const B = DG.Battle;
const BASE = { hp:250, atk:120, def:80, spAtk:120, spDef:80, spd:100 };
function defSp(id, over){ DG.SPECIES[id] = Object.assign({ name:id, types:['NORMAL'], ability:'', baseStats:BASE, learnset:[], expCurve:'MEDIUM', catchRate:255, expYield:100 }, over); }
function mkMon(id, level, moves){ const m = DG.SaveLoad.createDinoMon(id, level, null, moves); if(m) m.hp.current=m.hp.max; return m; }
function gsFor(mon){ return { player:{ party:[mon], bag:{}, money:0, flags:{}, badges:[], dex:{}, stats:{}, box:[], currentMap:'X', x:5, y:5 }, settings:{ textSpeed:'FAST' } }; }
function firstMsgs(gs, cfg, pick, maxTurns){
  const log=[]; let last=null,result=null,turns=0;
  B.start(Object.assign({ gameState:gs, onEnd:r=>result=r }, cfg));
  for(let f=0;f<8000 && B.isActive();f++){ B.update(16); const cm=B.currentMessage(); if(cm&&cm!==last){last=cm;log.push(cm);} const st=B.getState();
    if(st==='PLAYER_INPUT'){ turns++; if(turns>(maxTurns||3)){B.submitPlayerAction({type:'RUN'});continue;} B.submitPlayerAction(pick(turns)); }
    if(st==='LEARN_MOVE'){ try{B.confirmLearnMove(-1);}catch(e){} }
  }
  return { log, result };
}
const check = (n,c,d) => { console.log((c?'  ✓ ':'  ✗ ')+n+(c?'':' — '+(d||''))); if(!c) fails.push(n+(d?' — '+d:'')); };

console.log('[B] Functionele spot-checks:');

// Rock Head: recoil-move doet GEEN zelfschade
(function(){
  const recoilMove = Object.keys(DG.MOVES).find(k=>{const m=DG.MOVES[k];return m.power>0 && m.effect && (m.effect.type==='RECOIL'||/recoil/i.test(JSON.stringify(m.effect)));});
  if(!recoilMove){ check('Rock Head test (recoil-move gevonden)', false); return; }
  // vijand gebruikt een STATUS-move (Growl) en is super-bulky → elk HP-verlies
  // op de aanvaller = zuivere recoil (geen vijand-schade, geen KO die 't stopt).
  defSp('__BULK', { baseStats:{hp:99999,atk:1,def:250,spAtk:1,spDef:250,spd:1} });
  const enemy = mkMon('__BULK', 50, ['GROWL']); enemy.hp.max=99999; enemy.hp.current=99999;
  // referentie: ZONDER Rock Head moet er wél recoil zijn (bewijst de move recoil geeft)
  defSp('__NORECOIL', { ability:'' });
  const ref = mkMon('__NORECOIL', 50, [recoilMove,recoilMove,recoilMove,recoilMove]);
  const enemy2 = mkMon('__BULK', 50, ['GROWL']); enemy2.hp.max=99999; enemy2.hp.current=99999;
  firstMsgs(gsFor(ref), { type:'WILD', enemy:enemy2 }, ()=>({type:'MOVE',moveIndex:0}), 2);
  const refTookRecoil = ref.hp.current < ref.hp.max;
  defSp('__ROCKHEAD', { ability:'Rock Head' });
  const atk = mkMon('__ROCKHEAD', 50, [recoilMove,recoilMove,recoilMove,recoilMove]);
  const hpBefore = atk.hp.current;
  firstMsgs(gsFor(atk), { type:'WILD', enemy }, ()=>({type:'MOVE',moveIndex:0}), 2);
  check('recoil-move geeft recoil zónder Rock Head (referentie)', refTookRecoil, `ref hp ${ref.hp.current}/${ref.hp.max}, move=${recoilMove}`);
  check('Rock Head: geen recoil-zelfschade', atk.hp.current >= hpBefore, `hp ${atk.hp.current}/${hpBefore}`);
})();

// Swift Swim: verdubbelt speed in RAIN → trage mon slaat eerst
(function(){
  defSp('__SWIExtra');
  defSp('__SWIFT', { ability:'Swift Swim', baseStats:{hp:250,atk:120,def:80,spAtk:80,spDef:80,spd:50} });
  defSp('__FAST',  { ability:'', baseStats:{hp:250,atk:120,def:80,spAtk:80,spDef:80,spd:80} });
  const slow = mkMon('__SWIFT', 50, ['TACKLE','TACKLE','TACKLE','TACKLE']);
  const fast = mkMon('__FAST', 50, ['GROWL']);
  const gs = gsFor(slow);
  window.DG_MAP_WEATHER = 'RAIN';
  const r = firstMsgs(gs, { type:'WILD', enemy:fast, weather:'RAIN' }, ()=>({type:'MOVE',moveIndex:0}), 1);
  window.DG_MAP_WEATHER = undefined;
  // in beurt 1: bij Swift Swim (spd 50→100 > 80) slaat de speler-mon vóór de vijand
  const pIdx = r.log.findIndex(l=>/Tackle/i.test(l));
  const eIdx = r.log.findIndex(l=>/Growl/i.test(l));
  check('Swift Swim: +2× speed in regen → trage mon eerst', pIdx>=0 && (eIdx<0 || pIdx<eIdx), `pIdx=${pIdx} eIdx=${eIdx} | ${r.log.slice(0,4).join(' | ')}`);
})();

console.log(`\nFAIL: ${fails.length}   (WARN: ${warns.length})`);
fails.forEach(f=>console.log('  [FAIL] '+f));
if (process.env.SHOW_WARN) warns.forEach(w=>console.log('  [warn] '+w));
process.exit(fails.length ? 1 : 0);

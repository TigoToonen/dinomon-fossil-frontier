// movesweep.js — voert ELKE move minstens 1× uit in een echt gevecht (fase B1).
// Detecteert: exceptions, vastlopers (geen PLAYER_INPUT meer), damaging moves
// die geen schade doen zonder miss/immuun-reden, en status-moves die altijd
// "But it failed!" geven. Run: node movesweep.js   (exit 1 bij FAIL)
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

const B = DG.Battle;
const fails = [];   // echte problemen
const notes = [];   // verdacht maar mogelijk context-gebonden

function testMove(moveId){
  const mv = DG.MOVES[moveId];
  const atk = DG.SaveLoad.createDinoMon('TINDREL', 80, null, [moveId, moveId, moveId, moveId]);
  atk.hp.max = 99999; atk.hp.current = 99999;
  const enemy = DG.SaveLoad.createDinoMon('MIDDODON', 40, null, ['LEER','LEER','LEER','LEER']);
  enemy.hp.max = 99999; enemy.hp.current = 99999;
  const gs = { player:{ party:[atk], bag:{}, money:0, flags:{}, badges:[], dex:{}, stats:{},
                        currentMap:'X', x:5, y:5 }, settings:{ textSpeed:'FAST' } };
  const log = []; let last = null, turns = 0, inputSeen = 0;
  let threw = null;
  try {
    B.start({ type:'WILD', enemy, gameState: gs, onEnd:()=>{} });
    for (let f = 0; f < 5000; f++){
      B.update(16);
      const cm = B.currentMessage();
      if (cm && cm !== last){ last = cm; log.push(cm); }
      const st = B.getState();
      if (st === 'PLAYER_INPUT'){
        inputSeen++;
        turns++;
        if (turns > 3){ B.submitPlayerAction({ type:'RUN' }); continue; }
        B.submitPlayerAction({ type:'MOVE', moveIndex: 0 });
      }
      if (st === 'LEARN_MOVE'){ try{ B.confirmLearnMove(-1); }catch(e){} }
      if (!B.isActive()) break;
    }
  } catch(e){ threw = e; }
  // forceer einde voor de volgende move
  try { if (B.isActive()){ /* hard reset via RUN-loop faalde */ } } catch(e){}

  if (threw) { fails.push(`${moveId}: EXCEPTION ${threw.message}`); return; }
  if (inputSeen === 0) { fails.push(`${moveId}: gevecht bereikt nooit PLAYER_INPUT (vastloper)`); return; }
  if (turns <= 1 && B.isActive()) { fails.push(`${moveId}: gevecht loopt vast na 1 beurt`); return; }

  const dmgMove = (mv.category === 'PHYSICAL' || mv.category === 'SPECIAL') && (mv.power || 0) > 0;
  const hpDrop = 99999 - enemy.hp.current;
  const missOrImmune = log.some(l => /missed|no effect|doesn'?t affect|avoided|protected|charging|absorbed|immune|floating|is charging|flew up|dug|vanish/i.test(l));
  if (dmgMove && hpDrop <= 0 && !missOrImmune)
    fails.push(`${moveId}: damaging move deed 0 schade zonder miss/immuun-reden (log: ${log.slice(1,4).join(' | ')})`);
  if (mv.category === 'STATUS'){
    const failedEvery = log.filter(l=>/But it failed!/.test(l)).length >= turns - 1 && turns >= 3;
    if (failedEvery) notes.push(`${moveId}: status-move faalde elke beurt (effect ${((mv.effect||{}).type)||'NONE'})`);
  }
}

const all = Object.keys(DG.MOVES);
console.log(`═══ Move-sweep over ${all.length} moves ═══`);
let done = 0;
for (const id of all){
  testMove(id);
  if (++done % 200 === 0) console.log(`  ...${done}/${all.length}`);
}
console.log(`\nFAIL: ${fails.length} | verdacht: ${notes.length}`);
fails.slice(0, 40).forEach(f=>console.log('  [FAIL] '+f));
if (fails.length > 40) console.log(`  ...en ${fails.length-40} meer`);
notes.slice(0, 25).forEach(n=>console.log('  [note] '+n));
if (notes.length > 25) console.log(`  ...en ${notes.length-25} meer`);
process.exit(fails.length ? 1 : 0);

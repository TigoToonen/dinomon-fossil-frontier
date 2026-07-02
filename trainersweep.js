// trainersweep.js — vecht ELKE trainer volledig uit (fase B2).
// Detecteert: exceptions, vastlopers, gevechten die nooit eindigen.
// Run: node trainersweep.js   (exit 1 bij FAIL)
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
const fails = [];

function fightTrainer(tid){
  const t = DG.TRAINERS[tid];
  if (!t || !Array.isArray(t.party) || !t.party.length){ fails.push(`${tid}: geen/lege party`); return null; }
  // sterk spelersteam zodat het gevecht eindig is
  const p1 = DG.SaveLoad.createDinoMon('PYROCERATH', 100); p1.hp.current = p1.hp.max;
  const p2 = DG.SaveLoad.createDinoMon('GLACIODON', 100);  p2.hp.current = p2.hp.max;
  const gs = { player:{ party:[p1,p2], bag:{}, money:0, flags:{}, badges:[], dex:{}, stats:{},
                        currentMap:'X', x:5, y:5 }, settings:{ textSpeed:'FAST' } };
  let result = null, threw = null;
  try {
    const fe = DG.SaveLoad.createDinoMon(t.party[0].speciesId, t.party[0].level, null, t.party[0].moves);
    B.start({ type:'TRAINER', enemy: fe, trainerData: t, gameState: gs, onEnd: r => result = r });
    let turns = 0;
    for (let f = 0; f < 60000; f++){
      B.update(16);
      const st = B.getState();
      if (st === 'PLAYER_INPUT'){
        const bt = B.getBattle();
        if (bt && bt.isForcedSwitch){
          const i = gs.player.party.findIndex(m => m && m.hp.current > 0);
          B.submitPlayerAction({ type:'SWITCH', targetIndex: i >= 0 ? i : 0 });
          continue;
        }
        if (++turns > 400){ fails.push(`${tid}: >400 beurten — mogelijk oneindig gevecht`); return null; }
        B.submitPlayerAction({ type:'MOVE', moveIndex: turns % 4 === 0 ? 1 : 0 });
      }
      if (st === 'LEARN_MOVE'){ try{ B.confirmLearnMove(-1); }catch(e){} }
      if (!B.isActive()) break;
    }
  } catch(e){ threw = e; }
  if (threw){ fails.push(`${tid}: EXCEPTION ${threw.message}`); return null; }
  if (result !== 'WIN' && result !== 'LOSE' && B.isActive()){ fails.push(`${tid}: gevecht eindigt niet (state ${B.getState()})`); return null; }
  return result;
}

const ids = Object.keys(DG.TRAINERS);
console.log(`═══ Trainer-sweep over ${ids.length} trainers ═══`);
let wins = 0, losses = 0, done = 0;
for (const tid of ids){
  const r = fightTrainer(tid);
  if (r === 'WIN') wins++; else if (r === 'LOSE') losses++;
  if (++done % 40 === 0) console.log(`  ...${done}/${ids.length}`);
}
console.log(`\nUitslag: ${wins} WIN / ${losses} LOSE / ${fails.length} FAIL`);
fails.forEach(f=>console.log('  [FAIL] '+f));
process.exit(fails.length ? 1 : 0);

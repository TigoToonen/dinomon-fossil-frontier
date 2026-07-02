// edgesweep.js — fase B5 (battle-randgevallen) + C2 (economie) + E2 (quiz-gyms)
// + F4 (Hard Mode). Run: node edgesweep.js   (exit 1 bij FAIL)
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
const check = (name, cond, detail) => { if(!cond) fails.push(name + (detail?(' — '+detail):'')); console.log((cond?'  ✓ ':'  ✗ ')+name+(cond?'':(' — '+(detail||'')))); };

function newGs(party, bag){ return { player:{ party, bag: bag||{}, money:0, flags:{}, badges:[],
  dex:{}, stats:{}, box:[], currentMap:'X', x:5, y:5 }, settings:{ textSpeed:'FAST' } }; }
function drive(gs, pick, opts){
  opts = opts || {};
  const log = []; let last = null, turns = 0, result = null;
  const onEnd = r => result = r;
  B.start(Object.assign({ gameState: gs, onEnd }, opts.cfg));
  for (let f = 0; f < (opts.maxFrames||20000); f++){
    B.update(16);
    const cm = B.currentMessage(); if (cm && cm !== last){ last = cm; log.push(cm); }
    const st = B.getState();
    if (st === 'PLAYER_INPUT'){
      const bt = B.getBattle();
      if (bt && bt.isForcedSwitch){
        const i = gs.player.party.findIndex(m=>m&&m.hp.current>0);
        B.submitPlayerAction({type:'SWITCH', targetIndex: i>=0?i:0}); continue;
      }
      turns++;
      if (turns > (opts.maxTurns||30)){ B.submitPlayerAction({type:'RUN'}); continue; }
      B.submitPlayerAction(pick(bt, turns));
    }
    if (st === 'LEARN_MOVE'){ try{ B.confirmLearnMove(-1); }catch(e){} }
    if (!B.isActive()) break;
  }
  return { log, result, turns };
}

console.log('═══ Edge-sweep (B5/C2/E2/F4) ═══');

// B5.1 — PP op → Struggle
(function(){
  const atk = DG.SaveLoad.createDinoMon('TINDREL', 60, null, ['TACKLE']);
  atk.hp.max=9999; atk.hp.current=9999; atk.moves.forEach(m=>m.ppCurrent=1);
  const enemy = DG.SaveLoad.createDinoMon('MIDDODON', 30, null, ['LEER']); enemy.hp.max=99999; enemy.hp.current=99999;
  const r = drive(newGs([atk]), ()=>({type:'MOVE',moveIndex:0}), { cfg:{type:'WILD', enemy}, maxTurns:5 });
  check('B5 PP op → Struggle (met recoil)', r.log.some(l=>/Struggle/i.test(l)) && r.log.some(l=>/recoil/i.test(l)), r.log.slice(-4).join(' | '));
})();

// B5.2 — vangen met ruimte → in party
(function(){
  const atk = DG.SaveLoad.createDinoMon('TINDREL', 60); atk.hp.current=atk.hp.max;
  const enemy = DG.SaveLoad.createDinoMon('BUGLING', 5); enemy.hp.current=1;
  const gs = newGs([atk], { MASTERBALL:1 });
  const r = drive(gs, ()=>({type:'ITEM', itemId:'MASTERBALL'}), { cfg:{type:'WILD', enemy}, maxTurns:3 });
  check('B5 vangen → CAUGHT + in party', r.result==='CAUGHT' && gs.player.party.length===2, `result=${r.result} party=${gs.player.party.length}`);
})();

// B5.3 — vangen met volle party → PC Box
(function(){
  const party = Array.from({length:6}, ()=>{ const m=DG.SaveLoad.createDinoMon('TINDREL', 30); m.hp.current=m.hp.max; return m; });
  const enemy = DG.SaveLoad.createDinoMon('BUGLING', 5); enemy.hp.current=1;
  const gs = newGs(party, { MASTERBALL:1 });
  const r = drive(gs, ()=>({type:'ITEM', itemId:'MASTERBALL'}), { cfg:{type:'WILD', enemy}, maxTurns:3 });
  check('B5 volle party → box', r.result==='CAUGHT' && gs.player.box.length===1 && gs.player.party.length===6,
        `result=${r.result} box=${gs.player.box.length}`);
})();

// B5.4 — volle party + volle box → released, geen crash
(function(){
  const party = Array.from({length:6}, ()=>{ const m=DG.SaveLoad.createDinoMon('TINDREL', 30); m.hp.current=m.hp.max; return m; });
  const enemy = DG.SaveLoad.createDinoMon('BUGLING', 5); enemy.hp.current=1;
  const gs = newGs(party, { MASTERBALL:1 });
  gs.player.box = Array.from({length:90}, ()=>DG.SaveLoad.createDinoMon('BUGLING', 5));
  const r = drive(gs, ()=>({type:'ITEM', itemId:'MASTERBALL'}), { cfg:{type:'WILD', enemy}, maxTurns:3 });
  check('B5 box vol → released-melding, geen crash', r.result==='CAUGHT' && gs.player.box.length===90 && r.log.some(l=>/released/i.test(l)),
        `result=${r.result} box=${gs.player.box.length}`);
})();

// B5.5 — bal op trainer-mon → geweigerd, gevecht loopt door
(function(){
  const atk = DG.SaveLoad.createDinoMon('PYROCERATH', 100, null, ['FLAMETHROWER','FLAMETHROWER','FLAMETHROWER','FLAMETHROWER']); atk.hp.current=atk.hp.max;
  const t = DG.TRAINERS.HIKER_BRETT;
  const fe = DG.SaveLoad.createDinoMon(t.party[0].speciesId, t.party[0].level, null, t.party[0].moves);
  const gs = newGs([atk], { MASTERBALL:2 });
  let threwBall = false;
  const r = drive(gs, (bt,turn)=>{ if(turn===1 && !threwBall){ threwBall=true; return {type:'ITEM', itemId:'MASTERBALL'}; } return {type:'MOVE',moveIndex:0}; },
    { cfg:{type:'TRAINER', enemy:fe, trainerData:t}, maxTurns:30 });
  check("B5 bal op trainer-mon geweigerd", r.log.some(l=>/can't catch a trainer/i.test(l)) && (r.result==='WIN'||r.result==='LOSE'),
        `result=${r.result}`);
})();

// C2.1 — blackout op ¥0 → geld blijft 0 (niet negatief)
(function(){
  const atk = DG.SaveLoad.createDinoMon('BUGLING', 3); atk.hp.current=atk.hp.max;
  const t = DG.TRAINERS.ELITE_AURORA;
  const fe = DG.SaveLoad.createDinoMon(t.party[0].speciesId, t.party[0].level, null, t.party[0].moves);
  const gs = newGs([atk]); gs.player.money = 0;
  const r = drive(gs, ()=>({type:'MOVE',moveIndex:0}), { cfg:{type:'TRAINER', enemy:fe, trainerData:t}, maxTurns:10 });
  check('C2 blackout op ¥0 → geld 0, niet negatief', r.result==='LOSE' && gs.player.money===0, `money=${gs.player.money}`);
})();

// C2.2 — beloning exact; Compound Card ×1.5 exact één keer
(function(){
  const t = DG.TRAINERS.HIKER_BRETT;
  function fight(bag){
    const atk = DG.SaveLoad.createDinoMon('PYROCERATH', 100, null, ['FLAMETHROWER','FLAMETHROWER','FLAMETHROWER','FLAMETHROWER']); atk.hp.current=atk.hp.max;
    const fe = DG.SaveLoad.createDinoMon(t.party[0].speciesId, t.party[0].level, null, t.party[0].moves);
    const gs = newGs([atk], bag);
    const r = drive(gs, ()=>({type:'MOVE',moveIndex:0}), { cfg:{type:'TRAINER', enemy:fe, trainerData:t}, maxTurns:30 });
    return { r, money: gs.player.money };
  }
  const plain = fight({});
  const card  = fight({ COMPOUND_CARD:1 });
  check('C2 beloning exact (zonder card)', plain.r.result==='WIN' && plain.money === (t.reward||0), `money=${plain.money} verwacht=${t.reward}`);
  check('C2 Compound Card ×1.5 exact één keer', card.r.result==='WIN' && card.money === Math.round((t.reward||0)*1.5), `money=${card.money} verwacht=${Math.round((t.reward||0)*1.5)}`);
})();

// E2 — quiz-gyms statisch: structuur + juiste antwoord niet in de afleiders
(function(){
  let quizN = 0, bad = 0;
  for (const mid in DG.MAPS){
    for (const n of (DG.MAPS[mid].npcs||[])){
      if (!n.quizQuestion) continue;
      quizN++;
      const correct = (n.quizOptionA||'').replace(/^A\)\s*/,'').trim();
      const problems = [];
      if (!n.quizOptionA) problems.push('geen optionA');
      if (!Array.isArray(n.quizWrong) || n.quizWrong.length < 2) problems.push('te weinig afleiders');
      if ((n.quizWrong||[]).some(w=>w.trim().toLowerCase()===correct.toLowerCase())) problems.push('juiste antwoord zit in de afleiders');
      if (!n.quizCorrectFlag || !n.quizDoneFlag) problems.push('flags incompleet');
      if (problems.length){ bad++; fails.push(`E2 ${mid}/${n.id}: ${problems.join(', ')}`); }
    }
  }
  check(`E2 quiz-structuur (${quizN} vragen)`, bad===0, `${bad} met problemen`);
})();

// F4 — Hard Mode: heal-items geweigerd in battle, ballen wel toegestaan
(function(){
  window._CURRENT_DIFFICULTY = 'HARD';
  const atk = DG.SaveLoad.createDinoMon('PYROCERATH', 100); atk.hp.current = Math.floor(atk.hp.max/2);
  const enemy = DG.SaveLoad.createDinoMon('BUGLING', 5); enemy.hp.current = 1;
  const gs = newGs([atk], { POTION:1, MASTERBALL:1 });
  let usedPotion = false;
  const r = drive(gs, (bt,turn)=>{ if(turn===1){ usedPotion=true; return {type:'ITEM', itemId:'POTION'}; } return {type:'ITEM', itemId:'MASTERBALL'}; },
    { cfg:{type:'WILD', enemy}, maxTurns:4 });
  window._CURRENT_DIFFICULTY = undefined;
  check('F4 Hard Mode: potion geweigerd, bal werkt', r.log.some(l=>/banned in Hard Mode/i.test(l)) && r.result==='CAUGHT',
        `result=${r.result} log=${r.log.filter(l=>/banned|threw/i.test(l)).join(' | ')}`);
})();

console.log(`\nFAIL: ${fails.length}`);
fails.forEach(f=>console.log('  [FAIL] '+f));
process.exit(fails.length ? 1 : 0);

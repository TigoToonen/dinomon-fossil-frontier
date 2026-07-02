// fuzz.js — fase H1: chaos-testen van de battle-engine met random (soms
// ONGELDIGE) input: rare parties (eggs, 1-HP, gestatust), random acties
// (ongeldige move-indexes, egg-switches, ontbrekende items). Assert: nooit
// een exception, nooit een hang. Run: node fuzz.js [seed]  (exit 1 bij FAIL)
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

// deterministische RNG (seed reproduceert een gevonden crash)
const SEED = parseInt(process.argv[2] || '424242', 10);
let _s = SEED >>> 0;
Math.random = function(){ _s = (_s * 1664525 + 1013904223) >>> 0; return _s / 4294967296; };
const R  = n => Math.floor(Math.random() * n);
const pick = a => a[R(a.length)];

const B = DG.Battle;
const SP = Object.keys(DG.SPECIES);
const TR = Object.keys(DG.TRAINERS);
const STATUSES = [null, 'BURN', 'POISON', 'PARALYSIS', 'SLEEP', 'FREEZE'];
const fails = [];

function randMon(){
  const m = DG.SaveLoad.createDinoMon(pick(SP), 5 + R(96));
  if (!m) return null;
  m.hp.current = [m.hp.max, 1, Math.ceil(m.hp.max/2), 0][R(4)];
  m.statusEffect = pick(STATUSES);
  if (Math.random() < 0.15) m.isShiny = true;
  if (Math.random() < 0.15) m.heldItem = pick(['LEFTOVERS','FOCUS_SASH','LIFE_ORB','LUM_BERRY']);
  return m;
}
function randEgg(){
  return { isEgg:true, speciesId:'EGG', parentSpecies:pick(SP), eggSteps:0, hatchSteps:2560,
    nickname:'Egg', level:1, hp:{current:1,max:1},
    stats:{hp:1,atk:1,def:1,spAtk:1,spDef:1,spd:1},
    ivs:{hp:0,atk:0,def:0,spAtk:0,spDef:0,spd:0}, evs:{hp:0,atk:0,def:0,spAtk:0,spDef:0,spd:0},
    moves:[], exp:0, nature:'HARDY', happiness:70, heldItem:null, statusEffect:null, statusTurns:0, confusionTurns:0 };
}
function randAction(gs){
  const roll = R(10);
  if (roll < 5)  return { type:'MOVE',   moveIndex: [0,1,2,3,-1,7][R(6)] };          // soms ongeldig
  if (roll < 7)  return { type:'SWITCH', targetIndex: R(8) };                          // soms buiten bereik/egg
  if (roll < 9)  return { type:'ITEM',   itemId: pick(['POTION','MASTERBALL','ULTRABALL','RARE_CANDY','ONZIN_ITEM']) };
  return { type:'RUN' };
}

const N = 120;
let ended = 0, hung = 0;
console.log(`═══ Fuzz: ${N} chaos-gevechten (seed ${SEED}) ═══`);
for (let i = 0; i < N; i++){
  // party: 1-4 mons, soms met egg, garandeer 1 levende niet-egg
  const party = [];
  const lead = DG.SaveLoad.createDinoMon(pick(SP), 30 + R(60)); lead.hp.current = lead.hp.max;
  party.push(lead);
  const extra = R(3);
  for (let k = 0; k < extra; k++) party.push(Math.random() < 0.25 ? randEgg() : randMon());
  const bag = { POTION: R(3), MASTERBALL: R(2), ULTRABALL: R(3) };
  const gs = { player:{ party, bag, money:R(5000), flags:{}, badges:[], dex:{}, stats:{}, box:[],
                        currentMap:'X', x:5, y:5 }, settings:{ textSpeed:'FAST' } };
  const asTrainer = Math.random() < 0.4;
  let cfg;
  if (asTrainer){
    const t = DG.TRAINERS[pick(TR)];
    if (!t.party || !t.party.length) { continue; }
    const fe = DG.SaveLoad.createDinoMon(t.party[0].speciesId, t.party[0].level, null, t.party[0].moves);
    cfg = { type:'TRAINER', enemy:fe, trainerData:t };
  } else {
    const e = randMon() || DG.SaveLoad.createDinoMon('BUGLING', 10); if (e.hp.current<=0) e.hp.current = 1;
    cfg = { type:'WILD', enemy:e };
  }
  let threw = null, result = null, turns = 0, framesSinceInput = 0;
  const DBG = parseInt(process.env.DBG || '-1', 10) === i;
  const dbgLog = []; let dbgLast = null;
  try {
    B.start(Object.assign({ gameState:gs, onEnd:r=>result=r }, cfg));
    for (let f = 0; f < 30000; f++){
      B.update(16);
      if (DBG){ const cm = B.currentMessage(); if (cm && cm !== dbgLast){ dbgLast = cm; dbgLog.push(cm); } }
      const st = B.getState();
      if (st === 'PLAYER_INPUT'){
        framesSinceInput = 0;
        const bt = B.getBattle();
        turns++;
        if (turns > 60){
          // na 60 beurten: alleen nog aanvallen (move 0) zodat PP-uitputting →
          // Struggle het gevecht gegarandeeerd beëindigt; RUN werkt niet vs trainers
          if (turns > 500){ hung++; fails.push(`fuzz #${i}: gevecht eindigt niet na 500 beurten (${cfg.type}${cfg.trainerData?' '+cfg.trainerData.id:''}, seed ${SEED})`); break; }
          B.submitPlayerAction(cfg.type==='TRAINER' ? {type:'MOVE', moveIndex:0} : {type:'RUN'});
          continue; }
        B.submitPlayerAction((bt && bt.isForcedSwitch)
          ? { type:'SWITCH', targetIndex: Math.random()<0.3 ? R(8) : Math.max(0, gs.player.party.findIndex(m=>m&&!m.isEgg&&m.hp.current>0)) }
          : randAction(gs));
      } else { framesSinceInput++; if (framesSinceInput > 15000){ hung++; fails.push(`fuzz #${i}: hang in state ${st} (seed ${SEED})`); break; } }
      if (st === 'LEARN_MOVE'){ try{ B.confirmLearnMove(-1); }catch(e){} framesSinceInput = 0; }
      if (!B.isActive()) break;
    }
  } catch(e){ threw = e; }
  if (threw) fails.push(`fuzz #${i}: EXCEPTION ${threw.message} (seed ${SEED}, ${cfg.type}${cfg.trainerData?' '+cfg.trainerData.id:''})`);
  else if (result || !B.isActive()) ended++;
  if (DBG){
    const bt = B.isActive() && B.getBattle();
    const dump = ['=== DBG fuzz #'+i+' ===',
      'party: '+gs.player.party.map(m=>(m.isEgg?'EGG':m.speciesId+' lv'+m.level)+' hp'+m.hp.current+'/'+m.hp.max+(m.statusEffect?' '+m.statusEffect:'')).join(' | ')];
    if (bt) dump.push('STUCK: playerMon='+bt.playerMon.speciesId+' hp'+bt.playerMon.hp.current+' pp='+bt.playerMon.moves.map(m=>m.moveId+':'+m.ppCurrent).join(','),
                      '  enemyMon='+bt.enemyMon.speciesId+' hp'+bt.enemyMon.hp.current+'/'+bt.enemyMon.hp.max+' pp='+bt.enemyMon.moves.map(m=>m.moveId+':'+m.ppCurrent).join(','));
    dump.push('laatste 20 msgs: '+dbgLog.slice(-20).join(' || '));
    fs.writeFileSync('.claude/fuzzdbg.txt', dump.join('\n'));
  }
}
console.log(`afgerond: ${ended}/${N} | hangs: ${hung} | exceptions: ${fails.length - hung}`);
fails.slice(0,15).forEach(f=>console.log('  [FAIL] '+f));
process.exit(fails.length ? 1 : 0);

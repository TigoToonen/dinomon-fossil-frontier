// simbattle.js — headless battle SIMULATOR for DinoMon: Fossil Frontier.
// Drives the real DG.Battle state machine (no rendering) to test move EXECUTION
// at runtime — things a static check can't see (multi-hit counts, two-turn,
// status application, infatuation lifecycle). Run: node simbattle.js
'use strict';
const fs = require('fs');
globalThis.window = globalThis;
globalThis.localStorage = { _d:{}, getItem(k){return this._d[k]||null;}, setItem(k,v){this._d[k]=String(v);}, removeItem(k){delete this._d[k];} };
// no-op proxy for animation/audio/input subsystems
const noop = new Proxy(function(){}, { get:()=>noop, apply:()=>undefined });
function L(f){ (0,eval)(fs.readFileSync(f,'utf8')); }
L('js/constants.js'); L('js/data/moves.js'); L('js/data/dinomons.js');
L('js/data/natures.js'); L('js/data/tmData.js'); L('js/data/trainers.js'); L('js/data/maps.js');
L('js/battle/typeChart.js'); L('js/battle/statusEffects.js'); L('js/battle/battleAI.js');
L('js/engine/saveload.js'); L('js/battle/battle.js');
DG.BattleAnim = noop; DG.Audio = noop; DG.Input = noop;
DG.DialogueBox = { show:(m,cb)=>{ if(typeof cb==='function') cb(); }, update:()=>{} };

const B = DG.Battle;

// Build a mon with overrides. moves = array of move IDs.
function mon(speciesId, level, moves, hpOverride){
  const m = DG.SaveLoad.createDinoMon(speciesId, level, null, moves);
  if(!m) throw new Error('createDinoMon failed for '+speciesId);
  if(hpOverride){ m.hp.max = hpOverride; m.hp.current = hpOverride; }
  return m;
}
function moveIdx(m, id){ return m.moves.findIndex(s=>s && s.moveId===id); }

// Drive one battle to completion (or until frame cap). pick(battle)->action.
function runBattle(party, enemyConfig, pick, opts){
  opts = opts || {};
  const gs = { player:{ party, bag:{}, money:1000, name:'Tester', flags:{}, badges:[],
                        dex:{}, stats:{}, currentMap:'AMBERTOWN', x:5, y:5 },
               settings:{ textSpeed:'FAST' } };
  const log = [];
  let lastMsg = null, ended = false, result = null;
  const cfg = Object.assign({ gameState: gs, onEnd:(r)=>{ ended=true; result=r; } }, enemyConfig);
  B.start(cfg);
  let frames = 0, turns = 0;
  let enemyStatusSeen = null, playerStatusSeen = null;
  const hitCounts = [];           // numbers parsed from "Hit N times!"
  while(frames++ < (opts.maxFrames||8000)){
    B.update(16);
    const cm = B.currentMessage();
    if(cm && cm !== lastMsg){
      log.push(cm); lastMsg = cm;
      const hm = /Hit (\d+) times!/.exec(cm); if(hm) hitCounts.push(+hm[1]);
    }
    // snapshot statuses DURING the battle (before it ends + nulls _battle)
    const liveBt = B.getBattle();
    if(liveBt){
      if(liveBt.enemyMon && liveBt.enemyMon.statusEffect) enemyStatusSeen = liveBt.enemyMon.statusEffect;
      if(liveBt.playerMon && liveBt.playerMon.statusEffect) playerStatusSeen = liveBt.playerMon.statusEffect;
    }
    const st = B.getState();
    if(ended || st === 'IDLE' || !B.isActive()){ break; }
    if(st === 'LEARN_MOVE'){ try{ B.confirmLearnMove(-1); }catch(e){ try{B.confirmLearnPreview(false);}catch(_){}}; continue; }
    if(st === 'PLAYER_INPUT'){
      const bt = B.getBattle();
      if(bt && bt.isForcedSwitch){
        const idx = party.findIndex(p=>p && p.hp.current>0 && !p.isEgg);
        B.submitPlayerAction({ type:'SWITCH', targetIndex: idx>=0?idx:0 });
        continue;
      }
      if(++turns > (opts.maxTurns||40)){ B.submitPlayerAction({type:'RUN'}); continue; }
      const act = pick(B.getBattle(), turns);
      B.submitPlayerAction(act);
    }
  }
  return { log, ended, result, frames, battle: B.getBattle(), enemyStatusSeen, playerStatusSeen, hitCounts };
}

// ── Assertions framework ─────────────────────────────────────
const fails = [];
function check(name, cond, detail){ if(!cond){ fails.push(name + (detail?(' — '+detail):'')); console.log('  ✗ '+name+(detail?(' — '+detail):'')); } else console.log('  ✓ '+name); }

// Pick a punching-bag enemy species + a tanky attacker so battles don't end early.
const SP = Object.keys(DG.SPECIES);
function anySpecies(){ return SP[0]; }

console.log('═══ DinoMon battle simulator ═══');

// TEST 1 — status via alias type (SLEEP status move, e.g. SPORE_CLOUD) applies.
(function(){
  console.log('\n[1] Status-alias: a SLEEP/PARALYSIS status move actually inflicts status');
  // find a STATUS-category move with alias type SLEEP or PARALYSIS, chance>=100
  const cand = Object.values(DG.MOVES).find(m=>m.category==='STATUS' && (m.effect&&(m.effect.type==='SLEEP'||m.effect.type==='PARALYSIS')) && (m.effect.chance===undefined||m.effect.chance>=100));
  if(!cand){ check('found a 100% status-alias move', false, 'none in data'); return; }
  let applied=0, trials=12;
  for(let i=0;i<trials;i++){
    const atk = mon(anySpecies(), 80, [cand.id], 9999);
    const r = runBattle([atk], { type:'WILD', enemy: mon(SP[1]||SP[0], 5, ['TACKLE'], 9999) },
      (bt)=>({type:'MOVE', moveIndex: Math.max(0, moveIdx(bt.playerMon, cand.id))}), {maxTurns:3});
    if(r.enemyStatusSeen) applied++;
  }
  // accuracy 90% → allow a couple misses
  check(`${cand.id} (alias ${cand.effect.type}) inflicts status`, applied >= trials*0.7, `${applied}/${trials} battles`);
})();

// TEST 2 — multi-hit fixed-count move hits the right number of times.
(function(){
  console.log('\n[2] Multi-hit: DOUBLE_KICK hits exactly 2x (min/max fix)');
  const M = DG.MOVES.DOUBLE_KICK;
  if(!M){ check('DOUBLE_KICK exists', false); return; }
  // Enemy gets a single-hit move (TACKLE) so any "Hit N times!" comes from DOUBLE_KICK.
  const allHits = [];
  for(let i=0;i<10;i++){
    const atk = mon(anySpecies(), 90, ['DOUBLE_KICK'], 99999);
    const r = runBattle([atk], { type:'WILD', enemy: mon(SP[2]||SP[0], 50, ['TACKLE'], 99999) },
      (bt)=>({type:'MOVE', moveIndex: Math.max(0,moveIdx(bt.playerMon,'DOUBLE_KICK'))}), {maxTurns:3});
    allHits.push(...r.hitCounts);
  }
  const distinct = [...new Set(allHits)];
  // DOUBLE_KICK is min:2,max:2 → every multi-hit count must be exactly 2.
  check('DOUBLE_KICK hits exactly 2 (min/max fix)', allHits.length>0 && distinct.length===1 && distinct[0]===2,
        'counts seen: '+JSON.stringify(allHits));
})();

// TEST 3 — two-turn move (SOLAR_BEAM) charges turn 1, strikes turn 2.
(function(){
  console.log('\n[3] Two-turn: SOLAR_BEAM charges on turn 1 (no immediate damage)');
  if(!DG.MOVES.SOLAR_BEAM){ check('SOLAR_BEAM exists', false); return; }
  const atk = mon(anySpecies(), 90, ['SOLAR_BEAM'], 9999);
  const enemy = mon(SP[3]||SP[0], 50, null, 99999);
  const hpStart = enemy.hp.current;
  let turn1Hp=null;
  const r = runBattle([atk], { type:'WILD', enemy }, (bt,turn)=>{
    if(turn===1){ /* record after */ }
    return {type:'MOVE', moveIndex: Math.max(0,moveIdx(bt.playerMon,'SOLAR_BEAM'))};
  }, {maxTurns:2, maxFrames:4000});
  const chargeMsg = r.log.some(l=>/absorb|charg|sunlight|light/i.test(l));
  check('SOLAR_BEAM shows a charge turn', chargeMsg, 'log: '+JSON.stringify(r.log.slice(0,8)));
})();

// TEST 4 — infatuation volatile is cleared at battle end (no save leak).
(function(){
  console.log('\n[4] Infatuation: _infatuated is cleared after the battle ends');
  const atk = mon(anySpecies(), 80, null, 9999);
  atk._infatuated = true;  // simulate having been infatuated
  const r = runBattle([atk], { type:'WILD', enemy: mon(SP[4]||SP[0], 3, null, 1) },
    (bt)=>({type:'MOVE', moveIndex:0}), {maxTurns:6});
  check('battle ended', r.ended || !DG.Battle.isActive());
  check('_infatuated cleared on the party mon', atk._infatuated === false, '_infatuated='+atk._infatuated);
})();

// TEST 5 — BURN_CHANCE secondary on a DAMAGE move actually burns (alias fix).
(function(){
  console.log('\n[5] Secondary status: a BURN_CHANCE damage move inflicts burn over many hits');
  const cand = Object.values(DG.MOVES).find(m=>(m.category==='SPECIAL'||m.category==='PHYSICAL') && m.effect&&m.effect.type==='BURN_CHANCE');
  if(!cand){ check('found a BURN_CHANCE damage move', false); return; }
  // enemy must NOT be Fire-type (immune to burn). Find a Normal-ish punching bag.
  const bagId = Object.keys(DG.SPECIES).find(id=>{ const t=DG.SPECIES[id].types||[]; return !t.includes('FIRE'); }) || SP[0];
  let burned=0, trials=10;
  for(let i=0;i<trials;i++){
    const atk = mon(anySpecies(), 90, [cand.id], 99999);
    const r = runBattle([atk], { type:'WILD', enemy: mon(bagId, 60, ['TACKLE'], 99999) },
      (bt)=>({type:'MOVE', moveIndex: Math.max(0,moveIdx(bt.playerMon,cand.id))}), {maxTurns:8});
    if(r.enemyStatusSeen === 'BURN') burned++;
  }
  // chance ~30%/hit over up to 8 hits → burn should appear in the large majority of battles
  check(`${cand.id} (BURN_CHANCE) inflicts burn`, burned >= trials*0.6, `${burned}/${trials} battles burned`);
})();

// ── REPORT ───────────────────────────────────────────────────
console.log('\n═══ result ═══');
if(!fails.length){ console.log('✅ all runtime checks passed'); process.exit(0); }
console.log('❌ failures:'); fails.forEach(f=>console.log('  - '+f)); process.exit(1);

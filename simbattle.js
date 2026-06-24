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
  const gs = { player:{ party, bag: Object.assign({}, opts.bag), money:1000, name:'Tester', flags:{}, badges:[],
                        dex:{}, stats:{}, currentMap:'AMBERTOWN', x:5, y:5 },
               settings:{ textSpeed:'FAST' } };
  const log = [];
  let lastMsg = null, ended = false, result = null;
  const cfg = Object.assign({ gameState: gs, onEnd:(r)=>{ ended=true; result=r; } }, enemyConfig);
  B.start(cfg);
  let frames = 0, turns = 0;
  let enemyStatusSeen = null, playerStatusSeen = null, weatherSeen = null, enemyHpAtStatus = null, enemyHpLast = null;
  const hitCounts = [];           // numbers parsed from "Hit N times!"
  const enemyHpLog = [];          // enemy hp.current snapshotted at each PLAYER_INPUT
  const logMarks = [];            // log.length at the start of each player turn
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
      if(liveBt.enemyMon){ enemyHpLast = liveBt.enemyMon.hp.current; }
      if(liveBt.enemyMon && liveBt.enemyMon.statusEffect){ if(!enemyStatusSeen) enemyHpAtStatus = liveBt.enemyMon.hp.current; enemyStatusSeen = liveBt.enemyMon.statusEffect; }
      if(liveBt.playerMon && liveBt.playerMon.statusEffect) playerStatusSeen = liveBt.playerMon.statusEffect;
      if(liveBt.weather) weatherSeen = liveBt.weather;
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
      if(bt && bt.enemyMon) enemyHpLog.push(bt.enemyMon.hp.current);
      logMarks.push(log.length);   // log index at the start of this turn
      if(++turns > (opts.maxTurns||40)){ B.submitPlayerAction({type:'RUN'}); continue; }
      const act = pick(B.getBattle(), turns);
      B.submitPlayerAction(act);
    }
  }
  return { log, ended, result, frames, battle: B.getBattle(), enemyStatusSeen, enemyHpAtStatus, lastEnemyHp: enemyHpLast, playerStatusSeen, weatherSeen, hitCounts, enemyHpLog, logMarks, caught: B.getCaughtMon ? B.getCaughtMon() : null };
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

// TEST 6 — Semi-invulnerability: a charging FLY user can't be hit that turn.
(function(){
  console.log('\n[6] Semi-invuln: FLY user is untouchable on its charge turn');
  if(!DG.MOVES.FLY){ check('FLY exists', false); return; }
  let avoided=0, trials=8;
  for(let i=0;i<trials;i++){
    const atk = mon(anySpecies(), 95, ['FLY'], 9999);          // fast (high level) → charges first
    const enemy = mon(SP[2]||SP[0], 40, ['TACKLE'], 9999);
    const r = runBattle([atk], { type:'WILD', enemy },
      (bt)=>({type:'MOVE', moveIndex:0}), {maxTurns:3, maxFrames:5000});
    if(r.log.some(l=>/avoided the attack|flew up|protected|avoided/i.test(l))) avoided++;
  }
  check('FLY grants semi-invulnerability on the charge turn', avoided >= trials*0.6, `${avoided}/${trials} battles showed an avoided hit`);
})();

// TEST 7 — Recharge: after HYPER_BEAM the user must recharge next turn.
(function(){
  console.log('\n[7] Recharge: HYPER_BEAM forces a recharge turn');
  if(!DG.MOVES.HYPER_BEAM){ check('HYPER_BEAM exists', false); return; }
  const atk = mon(anySpecies(), 95, ['HYPER_BEAM'], 99999);
  const enemy = mon(SP[2]||SP[0], 60, ['TACKLE'], 99999);
  const r = runBattle([atk], { type:'WILD', enemy }, (bt)=>({type:'MOVE', moveIndex:0}), {maxTurns:4, maxFrames:6000});
  check('HYPER_BEAM triggers "must recharge!"', r.log.some(l=>/recharge/i.test(l)), 'log: '+JSON.stringify(r.log.filter(l=>/recharge|Hyper/i.test(l))));
})();

// TEST 8 — Type immunity: an Electric move does NOTHING to a Ground type.
(function(){
  console.log('\n[8] Type immunity: Electric vs Ground deals 0 damage');
  const elec = Object.values(DG.MOVES).find(m=>m.type==='ELECTRIC'&&(m.category==='SPECIAL'||m.category==='PHYSICAL')&&m.power>0);
  const ground = Object.keys(DG.SPECIES).find(id=>{const t=DG.SPECIES[id].types||[]; return t.includes('GROUND')&&!t.includes('FLYING');});
  if(!elec||!ground){ check('found electric move + ground species', false); return; }
  const atk = mon(anySpecies(), 90, [elec.id], 9999);
  const enemy = mon(ground, 50, ['LEER'], 99999); // LEER = non-contact, no incidental chip
  const startHp = enemy.hp.current;
  const r = runBattle([atk], { type:'WILD', enemy }, (bt)=>({type:'MOVE', moveIndex:0}), {maxTurns:2, maxFrames:4000});
  const dmg = startHp - (r.enemyHpLog.length ? r.enemyHpLog[r.enemyHpLog.length-1] : startHp);
  const immuneMsg = r.log.some(l=>/doesn'?t affect|no effect|not affect|immune/i.test(l));
  check(`${elec.id} does 0 damage to ${ground} (Ground)`, dmg===0, `dealt ${dmg}`);
  check('immunity message shown', immuneMsg, 'log: '+JSON.stringify(r.log.slice(0,8)));
})();

// TEST 9 — Stat stages affect damage: +2 Atk (Swords Dance) ~doubles physical damage.
(function(){
  console.log('\n[9] Stat stages: +2 Atk via SWORDS_DANCE increases physical damage');
  if(!DG.MOVES.SWORDS_DANCE || !DG.MOVES.TACKLE){ check('SWORDS_DANCE + TACKLE exist', false); return; }
  const ground = Object.keys(DG.SPECIES).find(id=>{const t=DG.SPECIES[id].types||[]; return t.includes('GROUND')&&!t.includes('FLYING');}) || SP[0];
  function avg(a){ return a.reduce((x,y)=>x+y,0)/a.length; }
  const base=[], boosted=[];
  for(let i=0;i<12;i++){
    // baseline: just TACKLE (higher level → bigger, more stable damage; LEER enemy = no contact chip)
    let atk = mon(anySpecies(), 75, ['TACKLE'], 999999);
    let r = runBattle([atk], { type:'WILD', enemy: mon(ground, 60, ['LEER'], 999999) },
      (bt)=>({type:'MOVE', moveIndex:0}), {maxTurns:2, maxFrames:4000});
    if(r.enemyHpLog.length>=2) base.push(r.enemyHpLog[0]-r.enemyHpLog[1]);
    // boosted: SWORDS_DANCE then TACKLE
    atk = mon(anySpecies(), 75, ['SWORDS_DANCE','TACKLE'], 999999);
    r = runBattle([atk], { type:'WILD', enemy: mon(ground, 60, ['LEER'], 999999) },
      (bt,turn)=>({type:'MOVE', moveIndex: turn===1?0:1}), {maxTurns:3, maxFrames:5000});
    if(r.enemyHpLog.length>=3) boosted.push(r.enemyHpLog[1]-r.enemyHpLog[2]);
  }
  const ba=avg(base), bo=avg(boosted);
  // +2 Atk ≈ 2× physical damage; require a clear ≥1.4× lift (well above crit/roll noise over 12 trials)
  check('+2 Atk meaningfully raises damage', base.length>0 && boosted.length>0 && bo > ba*1.4, `baseline avg ${ba.toFixed(0)}, boosted avg ${bo.toFixed(0)}`);
})();

function findMove(pred){ return Object.values(DG.MOVES).find(pred); }
function nonType(t){ return Object.keys(DG.SPECIES).find(id=>!((DG.SPECIES[id].types)||[]).includes(t)) || SP[0]; }

// TEST 10 — Leech Seed drains the foe each turn.
(function(){
  console.log('\n[10] Leech Seed: foe loses HP each turn, no player attack needed');
  const seed = findMove(m=>m.effect&&m.effect.type==='LEECH_SEED');
  if(!seed){ check('LEECH_SEED move exists', false); return; }
  // MIDDODON (Ground/Rock, non-Grass, end-of-turn runs cleanly). Loop a few times.
  const RELIABLE = DG.SPECIES.MIDDODON ? 'MIDDODON' : nonType('GRASS');
  let seeded=0, sapped=0;
  for(let i=0;i<6;i++){
    const atk = mon(anySpecies(), 80, [seed.id, 'SWORDS_DANCE'], 9999);
    const r = runBattle([atk], { type:'WILD', enemy: mon(RELIABLE, 50, ['LEER'], 99999) },
      (bt,turn)=>({type:'MOVE', moveIndex: turn===1?0:1}), {maxTurns:6, maxFrames:7000});
    if(r.log.some(l=>/seeded/i.test(l))) seeded++;
    if(r.log.some(l=>/sapped by Leech Seed/i.test(l))) sapped++;
  }
  check('Leech Seed seeds the foe', seeded>0, `${seeded}/6`);
  check('Leech Seed saps HP each turn', sapped>0, `${sapped}/6`);
})();

// TEST 11 — Stealth Rock damages a switched-in foe (trainer battle, 2 mons).
(function(){
  console.log('\n[11] Stealth Rock: the foe\'s next mon takes entry damage');
  const sr = findMove(m=>m.effect&&m.effect.type==='STEALTH_ROCK');
  if(!sr){ check('STEALTH_ROCK move exists', false); return; }
  const bag = nonType('FLYING'); // entry-damaged mon shouldn't be immune; any non-flying works
  const atk = mon(anySpecies(), 95, [sr.id, 'TACKLE'], 99999);
  const trainer = { name:'Tester Rival', party:[ {speciesId:bag, level:5}, {speciesId:bag, level:5} ] };
  const r = runBattle([atk], { type:'TRAINER', trainerData: trainer },
    (bt,turn)=>({type:'MOVE', moveIndex: turn===1?0:1}), {maxTurns:8, maxFrames:9000});
  check('a switched-in foe is hurt by stealth rocks', r.log.some(l=>/hurt by the stealth rocks/i.test(l)), 'rock lines: '+JSON.stringify(r.log.filter(l=>/stones|stealth rocks/i.test(l))));
})();

// TEST 12 — Weather move actually sets weather.
(function(){
  console.log('\n[12] Weather: a SET_WEATHER move sets battle weather');
  const w = findMove(m=>m.effect&&m.effect.type==='SET_WEATHER'&&m.effect.weather&&m.effect.weather!=='NONE');
  if(!w){ check('SET_WEATHER move exists', false); return; }
  const RELIABLE = DG.SPECIES.MIDDODON ? 'MIDDODON' : (SP[2]||SP[0]);
  let set=0;
  for(let i=0;i<4;i++){
    const atk = mon(anySpecies(), 80, [w.id, 'SWORDS_DANCE'], 9999);
    const r = runBattle([atk], { type:'WILD', enemy: mon(RELIABLE, 40, ['LEER'], 99999) },
      (bt,turn)=>({type:'MOVE', moveIndex: turn===1?0:1}), {maxTurns:3, maxFrames:4000});
    if(r.weatherSeen) set++;
  }
  check(`${w.id} sets weather`, set>0, `${set}/4 battles set weather`);
})();

// TEST 13 — Confusion move confuses the foe.
(function(){
  console.log('\n[13] Confusion: a CONFUSE move confuses the foe');
  const c = findMove(m=>m.category==='STATUS' && m.effect&&m.effect.type==='CONFUSE');
  if(!c){ check('CONFUSE status move exists', false); return; }
  let conf=0, trials=8;
  for(let i=0;i<trials;i++){
    const atk = mon(anySpecies(), 80, [c.id], 9999);
    const r = runBattle([atk], { type:'WILD', enemy: mon(SP[2]||SP[0], 40, ['TACKLE'], 99999) },
      (bt)=>({type:'MOVE', moveIndex:0}), {maxTurns:3, maxFrames:4000});
    if(r.log.some(l=>/confus/i.test(l))) conf++;
  }
  check(`${c.id} confuses the foe`, conf >= trials*0.7, `${conf}/${trials}`);
})();

// TEST 14 — Drain move heals the user.
(function(){
  console.log('\n[14] Drain: a draining move heals the user');
  const d = findMove(m=>(m.category==='SPECIAL'||m.category==='PHYSICAL') && m.effect&&m.effect.type==='DRAIN');
  if(!d){ check('DRAIN move exists', false); return; }
  const atk = mon(anySpecies(), 85, [d.id], 9999);
  atk.hp.current = 50; // hurt, so healing is observable
  const r = runBattle([atk], { type:'WILD', enemy: mon(nonType(d.type), 40, ['TACKLE'], 99999) },
    (bt)=>({type:'MOVE', moveIndex:0}), {maxTurns:2, maxFrames:4000});
  check(`${d.id} drains energy`, r.log.some(l=>/drained energy/i.test(l)), 'log: '+JSON.stringify(r.log.slice(0,6)));
})();

// TEST 15 — Recoil move hurts the user.
(function(){
  console.log('\n[15] Recoil: a recoil move hurts the user');
  const rc = findMove(m=>(m.category==='SPECIAL'||m.category==='PHYSICAL') && m.effect&&m.effect.type==='RECOIL');
  if(!rc){ check('RECOIL move exists', false); return; }
  const atk = mon(anySpecies(), 85, [rc.id], 99999);
  const r = runBattle([atk], { type:'WILD', enemy: mon(nonType(rc.type), 50, ['TACKLE'], 99999) },
    (bt)=>({type:'MOVE', moveIndex:0}), {maxTurns:2, maxFrames:4000});
  check(`${rc.id} causes recoil`, r.log.some(l=>/hurt by recoil/i.test(l)), 'log: '+JSON.stringify(r.log.slice(0,6)));
})();

// TEST 16 — One-hit KO move can instantly faint a lower-level foe.
(function(){
  console.log('\n[16] OHKO: a one-hit KO move can instantly faint a weaker foe');
  const o = findMove(m=>m.effect&&m.effect.type==='ONE_HIT_KO');
  if(!o){ check('ONE_HIT_KO move exists', false); return; }
  let ko=0, trials=20;
  for(let i=0;i<trials;i++){
    const atk = mon(anySpecies(), 90, [o.id], 9999);
    const r = runBattle([atk], { type:'WILD', enemy: mon(nonType(o.type), 20, ['TACKLE'], 200) },
      (bt)=>({type:'MOVE', moveIndex:0}), {maxTurns:5, maxFrames:5000});
    if(r.log.some(l=>/one-hit KO/i.test(l))) ko++;
  }
  check(`${o.id} lands a one-hit KO sometimes`, ko >= 1, `${ko}/${trials} OHKOs (accuracy-gated)`);
})();

// TEST 17 — Master Ball always catches a wild DinoMon.
(function(){
  console.log('\n[17] Catch: a Master Ball catches a wild DinoMon');
  const ballId = DG.ITEMS.MASTERBALL ? 'MASTERBALL' : (DG.ITEMS.DINOMASTERBALL ? 'DINOMASTERBALL' : null);
  if(!ballId){ check('a 255-modifier ball exists', false); return; }
  const atk = mon(anySpecies(), 80, null, 9999);
  const r = runBattle([atk], { type:'WILD', enemy: mon(SP[3]||SP[0], 30, null, 9999) },
    (bt)=>({type:'ITEM', itemId: ballId}), {maxTurns:3, maxFrames:5000, bag:{ [ballId]:5 }});
  check('Master Ball catches', r.result==='CAUGHT' || !!r.caught || r.log.some(l=>/caught/i.test(l)), 'result='+r.result+' log: '+JSON.stringify(r.log.slice(-4)));
})();

// helper: find a STATUS-category move that inflicts a given status
function findStatusMove(status){
  return findMove(m=>m.category==='STATUS' && m.effect && (
    (m.effect.type==='STATUS_CHANCE' && m.effect.status===status && (m.effect.chance===undefined||m.effect.chance>=100)) ||
    (status==='POISON' && m.effect.type==='POISON_CHANCE' && (m.effect.chance>=100)) ||
    (status==='BURN'   && m.effect.type==='BURN_CHANCE'   && (m.effect.chance>=100)) ||
    (status==='PARALYSIS' && m.effect.type==='PARALYSIS' && (m.effect.chance>=100))
  ));
}

// TEST 18 — Poison chips the foe each turn (per-turn status damage works).
(function(){
  console.log('\n[18] Poison: a poisoned foe loses HP each turn');
  const pm = findStatusMove('POISON');
  if(!pm){ check('a 100% poison status move exists', false); return; }
  const bag = nonType('POISON'), bag2 = (DG.SPECIES[bag].types||[]).includes('STEEL')?SP[0]:bag;
  // Status moves can MISS (accuracy<100), so run several trials and only assert
  // the chip on trials where the poison actually landed.
  // Use a reliable enemy (MIDDODON: Ground/Rock, poisonable, end-of-turn runs cleanly).
  const RELIABLE = DG.SPECIES.MIDDODON ? 'MIDDODON' : bag2;
  let landed=0, chippedWhenLanded=0;
  for(let i=0;i<10;i++){
    const atk = mon(anySpecies(), 85, [pm.id, 'SWORDS_DANCE'], 9999);
    const enemy = mon(RELIABLE, 50, ['LEER'], 99999);
    const r = runBattle([atk], { type:'WILD', enemy },
      (bt,turn)=>({type:'MOVE', moveIndex: turn===1?0:1}), {maxTurns:6, maxFrames:7000});
    if(r.enemyStatusSeen==='POISON'||r.enemyStatusSeen==='BADPOISON'){ landed++; if(r.log.some(l=>/hurt by poison/i.test(l))) chippedWhenLanded++; }
  }
  // ≥80%: the only non-chip case is when the status lands on the very last turn
  // before the harness flees (no end-of-turn left), which is a harness timing edge.
  check(`${pm.id} poison lands then chips HP each turn`, landed>0 && chippedWhenLanded>=Math.ceil(landed*0.8), `landed ${landed}, chipped ${chippedWhenLanded}`);
})();

// TEST 19 — Burn chips the foe each turn.
(function(){
  console.log('\n[19] Burn: a burned foe loses HP each turn');
  const bm = findStatusMove('BURN');
  if(!bm){ check('a 100% burn status move exists', false); return; }
  const RELIABLE = DG.SPECIES.MIDDODON ? 'MIDDODON' : nonType('FIRE'); // Ground/Rock, burnable
  let landed=0, chippedWhenLanded=0;
  for(let i=0;i<10;i++){
    const atk = mon(anySpecies(), 85, [bm.id, 'SWORDS_DANCE'], 9999);
    const enemy = mon(RELIABLE, 50, ['LEER'], 99999);
    const r = runBattle([atk], { type:'WILD', enemy },
      (bt,turn)=>({type:'MOVE', moveIndex: turn===1?0:1}), {maxTurns:6, maxFrames:7000});
    if(r.enemyStatusSeen==='BURN'){ landed++; if(r.log.some(l=>/hurt by its burn/i.test(l))) chippedWhenLanded++; }
  }
  check(`${bm.id} burn lands then chips HP each turn`, landed>0 && chippedWhenLanded>=Math.ceil(landed*0.8), `landed ${landed}, chipped ${chippedWhenLanded}`);
})();

// TEST 20 — Levitate ability grants Ground immunity (implemented-ability sanity).
(function(){
  console.log('\n[20] Ability Levitate: immune to Ground moves');
  const levSp = Object.keys(DG.SPECIES).find(id=>DG.SPECIES[id].ability==='Levitate');
  const grd = findMove(m=>m.type==='GROUND'&&(m.category==='PHYSICAL'||m.category==='SPECIAL')&&m.power>0);
  if(!levSp||!grd){ check('found a Levitate species + Ground move', false); return; }
  // Enemy uses only LEER (non-contact) so the player's possible contact-status
  // ability can't inflict incidental chip damage that muddies the reading.
  const atk = mon(anySpecies(), 90, [grd.id], 9999);
  const enemy = mon(levSp, 50, ['LEER'], 99999);
  const r = runBattle([atk], { type:'WILD', enemy }, (bt)=>({type:'MOVE', moveIndex:0}), {maxTurns:2, maxFrames:4000});
  check(`Levitate ${levSp} is immune to ${grd.id} (Ground)`,
        r.log.some(l=>/floating|levitate|immune|doesn'?t affect|no effect/i.test(l)),
        'log: '+JSON.stringify(r.log.slice(0,8)));
})();

function speciesWith(ability){ return Object.keys(DG.SPECIES).find(id=>DG.SPECIES[id].ability===ability); }

// TEST 21 — Limber ability blocks paralysis.
(function(){
  console.log('\n[21] Ability Limber: immune to paralysis');
  const sp = speciesWith('Limber');
  const tw = findMove(m=>m.category==='STATUS' && m.effect && ((m.effect.type==='STATUS_CHANCE'&&m.effect.status==='PARALYSIS')||m.effect.type==='PARALYSIS') && (m.effect.chance>=100));
  if(!sp||!tw){ check('found Limber species + paralysis move', false); return; }
  let blocked=0, paralyzed=0;
  for(let i=0;i<6;i++){
    const atk = mon(anySpecies(), 85, [tw.id, 'SWORDS_DANCE'], 9999);
    const r = runBattle([atk], { type:'WILD', enemy: mon(sp, 50, ['LEER'], 99999) },
      (bt,turn)=>({type:'MOVE', moveIndex: turn===1?0:1}), {maxTurns:3, maxFrames:4000});
    if(r.log.some(l=>/Limber/i.test(l))) blocked++;
    if(r.enemyStatusSeen==='PARALYSIS') paralyzed++;
  }
  check(`Limber blocks paralysis (${tw.id})`, blocked>0 && paralyzed===0, `blocked ${blocked}, paralyzed ${paralyzed}`);
})();

// TEST 22 — Keen Eye prevents accuracy loss.
(function(){
  console.log('\n[22] Ability Keen Eye: accuracy cannot be lowered');
  const sp = speciesWith('Keen Eye');
  const accDown = findMove(m=>m.effect && (m.effect.type==='STAT'||m.effect.type==='STAT_LOWER') && (m.effect.stat==='accuracy'||m.effect.stat==='acc') && m.effect.target!=='self');
  if(!sp||!accDown){ check('found Keen Eye species + accuracy-down move', false); return; }
  const atk = mon(anySpecies(), 85, [accDown.id, 'SWORDS_DANCE'], 9999);
  const r = runBattle([atk], { type:'WILD', enemy: mon(sp, 50, ['LEER'], 99999) },
    (bt,turn)=>({type:'MOVE', moveIndex:0}), {maxTurns:3, maxFrames:4000});
  check(`Keen Eye blocks ${accDown.id}`, r.log.some(l=>/Keen Eye/i.test(l)), 'log: '+JSON.stringify(r.log.filter(l=>/Keen|accuracy|acc/i.test(l))));
})();

// TEST 23 — Ice Body heals in hail.
(function(){
  console.log('\n[23] Ability Ice Body: heals each turn in hail');
  const sp = speciesWith('Ice Body');
  const hailMove = findMove(m=>m.effect&&m.effect.type==='SET_WEATHER'&&(m.effect.weather==='HAIL'||m.effect.weather==='SNOW'));
  if(!sp||!hailMove){ check('found Ice Body species + hail move', false); return; }
  const RELIABLE = DG.SPECIES.MIDDODON ? 'MIDDODON' : nonType('FIRE');
  let healed=0;
  for(let i=0;i<6;i++){
    const atk = mon(sp, 85, [hailMove.id, 'SWORDS_DANCE'], 9999);
    atk.hp.current = 50;
    const r = runBattle([atk], { type:'WILD', enemy: mon(RELIABLE, 40, ['LEER'], 9999) },
      (bt,turn)=>({type:'MOVE', moveIndex: turn===1?0:1}), {maxTurns:6, maxFrames:7000});
    if(r.log.some(l=>/Ice Body/i.test(l))) healed++;
  }
  check('Ice Body restores HP in hail', healed>0, `${healed}/6 battles showed an Ice Body heal`);
})();

// TEST 24 — Chlorophyll doubles Speed in sun (acts before an equal-speed foe).
(function(){
  console.log('\n[24] Ability Chlorophyll: doubles Speed in sun (turn order)');
  const sp = speciesWith('Chlorophyll');
  const sun = findMove(m=>m.effect&&m.effect.type==='SET_WEATHER'&&m.effect.weather==='SUN');
  if(!sp||!sun){ check('found Chlorophyll species + sun move', false); return; }
  // Pick an enemy that is normally FASTER than the Chlorophyll mon, but slower than 2×it,
  // and has no weather-speed ability — so sun flips the turn order. This isolates the ×2.
  const baseSpd = DG.SPECIES[sp].baseStats.spd;
  const WS = ['Chlorophyll','Swift Swim','Sand Rush','Slush Rush'];
  const foe = Object.keys(DG.SPECIES).find(id=>{ const s=DG.SPECIES[id]; const sd=s.baseStats.spd;
    return !WS.includes(s.ability) && sd > baseSpd && sd < baseSpd*2; });
  if(!foe){ check('found a faster non-weather-speed foe', false, `no species with spd in (${baseSpd},${baseSpd*2})`); return; }
  let sunPlayerFirst=0, evalSun=0;
  for(let i=0;i<8;i++){
    const atk = mon(sp, 50, [sun.id, 'SWORDS_DANCE'], 9999);
    // All-Tackle (priority 0) so turn order is decided purely by Speed, not a priority move.
    const enemy = mon(foe, 50, ['TACKLE','TACKLE','TACKLE','TACKLE'], 9999);
    const r = runBattle([atk], { type:'WILD', enemy },
      (bt,turn)=>({type:'MOVE', moveIndex: turn===1?0:1}), {maxTurns:4, maxFrames:5000});
    if(r.logMarks.length>=3){
      const slice = r.log.slice(r.logMarks[1], r.logMarks[2]); // turn 2 (sun up)
      // Detect turn order by ATTACKER NAME (player species vs foe species), robust to move choice.
      const pName = DG.SPECIES[sp].name, fName = DG.SPECIES[foe].name;
      const pi = slice.findIndex(l=>new RegExp(pName+' used','i').test(l));
      const fi = slice.findIndex(l=>new RegExp(fName+' used','i').test(l));
      if(pi>=0 && fi>=0){ evalSun++; if(pi<fi) sunPlayerFirst++; }
    }
  }
  check(`Chlorophyll ${sp} outspeeds faster foe ${foe} in sun`, evalSun>0 && sunPlayerFirst>=Math.ceil(evalSun*0.8), `${sunPlayerFirst}/${evalSun} sun-turns player-first (base spd ${baseSpd} vs ${DG.SPECIES[foe].baseStats.spd})`);
})();

// ── REPORT ───────────────────────────────────────────────────
console.log('\n═══ result ═══');
if(!fails.length){ console.log('✅ all runtime checks passed'); process.exit(0); }
console.log('❌ failures:'); fails.forEach(f=>console.log('  - '+f)); process.exit(1);

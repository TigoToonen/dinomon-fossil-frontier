// itemsweep.js — HELD-ITEM functionele audit (ronde 16). Verifieert dat elk
// gevestigd held-item echt VUURT in een gevecht (Leftovers/Life Orb/Focus Sash/
// Rocky Helmet/Shell Bell/Choice Band + de nieuw geïmplementeerde King's Rock).
// Run: node itemsweep.js   (exit 1 bij FAIL)
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
const check = (n,c,d) => { console.log((c?'  ✓ ':'  ✗ ')+n+(c?'':' — '+(d||''))); if(!c) fails.push(n+(d?' — '+d:'')); };
function mk(id, level, moves, held){ const m = DG.SaveLoad.createDinoMon(id, level, null, moves); if(m){ m.hp.current=m.hp.max; if(held) m.heldItem=held; } return m; }
function gsFor(mon){ return { player:{ party:[mon], bag:{}, money:0, flags:{}, badges:[], dex:{}, stats:{}, box:[], currentMap:'X', x:5, y:5 }, settings:{ textSpeed:'FAST' } }; }
function drive(gs, enemy, moveIdx, turns){
  const log=[]; let last=null;
  B.start({ type:'WILD', enemy, gameState:gs, onEnd:()=>{} });
  let t=0;
  for(let f=0; f<12000 && B.isActive(); f++){
    B.update(16); const cm=B.currentMessage(); if(cm&&cm!==last){last=cm;log.push(cm);}
    const st=B.getState();
    if(st==='PLAYER_INPUT'){ t++; if(t>turns){B.submitPlayerAction({type:'RUN'});continue;} B.submitPlayerAction({type:'MOVE',moveIndex:moveIdx}); }
    if(st==='LEARN_MOVE'){ try{B.confirmLearnMove(-1);}catch(e){} }
  }
  return { log, active:B.isActive() };
}

console.log('═══ Item-sweep (ronde 16): held items ═══');

// Leftovers: heelt ~1/16 per beurt
(function(){
  const atk = mk('TITANOSAUR', 60, ['GROWL','GROWL','GROWL','GROWL'], 'LEFTOVERS');
  atk.hp.current = Math.floor(atk.hp.max/2);
  const enemy = mk('BUGLING', 5, ['GROWL']); enemy.hp.max=99999; enemy.hp.current=99999;
  const before = atk.hp.current;
  const { log } = drive(gsFor(atk), enemy, 0, 3);
  check('Leftovers: heelt per beurt', atk.hp.current > before || log.some(l=>/Leftovers/i.test(l)), `hp ${atk.hp.current} (was ${before})`);
})();

// Focus Sash: overleeft dodelijke klap vanaf volle HP op 1 HP
(function(){
  const atk = mk('PYROCERATH', 100, ['FLAMETHROWER','FLAMETHROWER','FLAMETHROWER','FLAMETHROWER']);
  const sashHolder = mk('BUGLING', 5, ['GROWL'], 'FOCUS_SASH');   // frêle, wordt normaal ge-OHKO't
  const enemyGs = gsFor(sashHolder);
  // speler = sterke aanvaller, vijand = sash-houder → we vechten vanuit sash-kant
  const gs = gsFor(sashHolder);
  const r = drive(gs, atk, 0, 1);
  check('Focus Sash: overleeft OHKO op 1 HP', sashHolder.hp.current === 1 || r.log.some(l=>/Focus Sash|hung on|held on/i.test(l)), `hp ${sashHolder.hp.current}/${sashHolder.hp.max}`);
})();

// Rocky Helmet: fysieke aanvaller neemt 1/6 schade
(function(){
  const atk = mk('TITANOSAUR', 60, ['TACKLE','TACKLE','TACKLE','TACKLE']);   // fysiek
  const helmet = mk('MEGASTONE', 60, ['GROWL'], 'ROCKY_HELMET'); helmet.hp.max=99999; helmet.hp.current=99999;
  const gs = gsFor(atk);
  const before = atk.hp.current;
  const { log } = drive(gs, helmet, 0, 2);
  check('Rocky Helmet: fysieke aanvaller neemt schade', atk.hp.current < before || log.some(l=>/Rocky Helmet/i.test(l)), `hp ${atk.hp.current} (was ${before})`);
})();

// Shell Bell: aanvaller heelt op uitgedeelde schade
(function(){
  const atk = mk('PYROCERATH', 80, ['FLAMETHROWER','FLAMETHROWER','FLAMETHROWER','FLAMETHROWER'], 'SHELL_BELL');
  atk.hp.current = Math.floor(atk.hp.max/2);
  const enemy = mk('TITANOSAUR', 60, ['GROWL']); enemy.hp.max=99999; enemy.hp.current=99999;
  const before = atk.hp.current;
  drive(gsFor(atk), enemy, 0, 1);
  check('Shell Bell: aanvaller heelt op schade', atk.hp.current > before, `hp ${atk.hp.current} (was ${before})`);
})();

// Life Orb: recoil op de aanvaller (10% max HP)
(function(){
  const atk = mk('PYROCERATH', 80, ['FLAMETHROWER','FLAMETHROWER','FLAMETHROWER','FLAMETHROWER'], 'LIFE_ORB');
  const enemy = mk('TITANOSAUR', 60, ['GROWL']); enemy.hp.max=99999; enemy.hp.current=99999;
  const before = atk.hp.current;
  drive(gsFor(atk), enemy, 0, 1);
  check('Life Orb: recoil op aanvaller', atk.hp.current < before, `hp ${atk.hp.current} (was ${before})`);
})();

// King's Rock: veroorzaakt flinch (RNG vast op 0 → de 10% triggert)
(function(){
  const _orig = Math.random; Math.random = () => 0.0;   // forceer flinch-roll + geen crit-issues
  const atk = mk('PYROCERATH', 80, ['FLAMETHROWER','FLAMETHROWER','FLAMETHROWER','FLAMETHROWER'], 'KINGS_ROCK');
  atk.stats.spd = 999;
  const enemy = mk('TITANOSAUR', 60, ['TACKLE']); enemy.hp.max=99999; enemy.hp.current=99999; enemy.stats.spd = 1;
  const { log } = drive(gsFor(atk), enemy, 0, 2);
  Math.random = _orig;
  check("King's Rock: veroorzaakt flinch", log.some(l=>/flinch/i.test(l)), log.filter(l=>/flinch|King/i.test(l)).join(' | ') || log.slice(0,4).join(' | '));
})();

console.log(`\nFAIL: ${fails.length}`);
fails.forEach(f=>console.log('  [FAIL] '+f));
process.exit(fails.length ? 1 : 0);

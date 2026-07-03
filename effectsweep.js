// effectsweep.js — MOVE-EFFECT functionele audit (ronde 15). Verifieert dat de
// laagst-gedekte / nooit-geteste effect-types echt VUREN in een gevecht (de
// OMNI_RAISE-klasse: "geïmplementeerd" maar deed niks). Focus: SET_WEATHER,
// LEECH_SEED, HEAL, DRAIN, ONE_HIT_KO (die laatste is nooit getest — mechsweep
// zocht op 'OHKO' i.p.v. de echte type 'ONE_HIT_KO'). Run: node effectsweep.js
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

function mk(id, level, moves){ const m = DG.SaveLoad.createDinoMon(id, level, null, moves); if(m) m.hp.current=m.hp.max; return m; }
function gsFor(mon){ return { player:{ party:[mon], bag:{}, money:0, flags:{}, badges:[], dex:{}, stats:{}, box:[], currentMap:'X', x:5, y:5 }, settings:{ textSpeed:'FAST' } }; }
// draai N speler-beurten met vaste move; return {log, enemy, atk}
function drive(gs, enemy, moveIdx, turns){
  const log=[]; let last=null;
  B.start({ type:'WILD', enemy, gameState:gs, onEnd:()=>{} });
  let t=0;
  for(let f=0; f<12000 && B.isActive(); f++){
    B.update(16); const cm=B.currentMessage(); if(cm&&cm!==last){last=cm;log.push(cm);}
    const st=B.getState();
    if(st==='PLAYER_INPUT'){ t++; if(t>turns){ B.submitPlayerAction({type:'RUN'}); continue; } B.submitPlayerAction({type:'MOVE',moveIndex:moveIdx}); }
    if(st==='LEARN_MOVE'){ try{B.confirmLearnMove(-1);}catch(e){} }
  }
  return { log, bt: B.isActive()?B.getBattle():null };
}

console.log('═══ Effect-sweep (ronde 15): functionele move-effecten ═══');

// SET_WEATHER — RAIN_DANCE zet de regen
(function(){
  const atk = mk('GLACIODON', 60, ['RAIN_DANCE','TACKLE','TACKLE','TACKLE']);
  const enemy = mk('TITANOSAUR', 60); enemy.hp.max=99999; enemy.hp.current=99999;
  const { log } = drive(gsFor(atk), enemy, 0, 1);
  check('SET_WEATHER: Rain Dance zet weer (melding)', log.some(l=>/rain|regen|weather|started to rain/i.test(l)), log.slice(0,4).join(' | '));
})();

// LEECH_SEED — vijand verliest HP, gebruiker wint HP
(function(){
  const atk = mk('VERDANTHORN', 60, ['LEECH_SEED','LEECH_SEED','LEECH_SEED','LEECH_SEED']);
  atk.hp.current = Math.floor(atk.hp.max/2);   // ruimte om te helen
  // vijand met status-move (Growl) + niet-Grass type + veel HP → seed landt en
  // tikt zonder tegenschade/vroeg einde (single-run-flakiness weg).
  const enemy = mk('TITANOSAUR', 60, ['GROWL']); enemy.hp.max=99999; enemy.hp.current=99999;
  const eHpBefore = enemy.hp.current, aHpBefore = atk.hp.current;
  const { log } = drive(gsFor(atk), enemy, 0, 5);   // seed + laat 't tikken
  check('LEECH_SEED: vijand verliest HP over beurten', enemy.hp.current < eHpBefore, `enemy ${enemy.hp.current}/${eHpBefore}`);
  check('LEECH_SEED: gebruiker wint HP', atk.hp.current > aHpBefore, `atk ${atk.hp.current}/${aHpBefore}`);
})();

// HEAL — RECOVER herstelt HP
(function(){
  const atk = mk('TITANOSAUR', 60, ['RECOVER','TACKLE','TACKLE','TACKLE']);
  atk.hp.current = 1;
  const enemy = mk('BUGLING', 5); enemy.hp.max=99999; enemy.hp.current=99999;   // doet ~geen schade
  const before = atk.hp.current;
  drive(gsFor(atk), enemy, 0, 1);
  check('HEAL: Recover herstelt HP', atk.hp.current > before + 10, `hp ${atk.hp.current}/${atk.hp.max} (was ${before})`);
})();

// DRAIN — GIGA_DRAIN heelt de aanvaller
(function(){
  const atk = mk('VERDANTHORN', 60, ['GIGA_DRAIN','TACKLE','TACKLE','TACKLE']);
  atk.hp.current = Math.floor(atk.hp.max/2);
  // vijand gebruikt een STATUS-move (Growl) → deelt geen schade uit, dus elke
  // HP-winst op de aanvaller = zuivere drain-heal. Bulky zodat Giga Drain
  // schade doet om van te helen, maar niet KO't.
  const enemy = mk('TITANOSAUR', 60, ['GROWL']); enemy.hp.max=99999; enemy.hp.current=99999;
  const before = atk.hp.current;
  drive(gsFor(atk), enemy, 0, 1);
  check('DRAIN: Giga Drain heelt de aanvaller', atk.hp.current > before, `hp ${atk.hp.current} (was ${before})`);
})();

// ONE_HIT_KO — Fissure KO't in één klap (accuracy ~30%, dus meerdere pogingen)
(function(){
  const ohkoMove = Object.keys(DG.MOVES).find(k=>DG.MOVES[k].effect&&DG.MOVES[k].effect.type==='ONE_HIT_KO');
  if(!ohkoMove){ check('ONE_HIT_KO-move gevonden', false); return; }
  let koed=false, landedMsg=false;
  for(let tryn=0; tryn<25 && !koed; tryn++){
    const atk = mk('TITANOSAUR', 80, [ohkoMove,ohkoMove,ohkoMove,ohkoMove]);
    const enemy = mk('MEGASTONE', 60);
    const { log } = drive(gsFor(atk), enemy, 0, 1);
    if(log.some(l=>/one-hit KO|one hit KO|OHKO|instantly|fainted/i.test(l))) landedMsg=true;
    if(enemy.hp.current<=0 || log.some(l=>/one-hit KO|one hit KO/i.test(l))) koed=true;
  }
  check(`ONE_HIT_KO (${ohkoMove}): KO't in één klap wanneer 't raakt`, koed, 'geen KO in 25 pogingen');
})();

console.log(`\nFAIL: ${fails.length}`);
fails.forEach(f=>console.log('  [FAIL] '+f));
process.exit(fails.length ? 1 : 0);

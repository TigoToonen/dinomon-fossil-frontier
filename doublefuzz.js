// doublefuzz.js — ronde 4: chaos-testen van DUBBELGEVECHTEN (startDouble) met
// random trainer-trio's, random targeting en rare acties, plus Tower-team-
// generatie-sanity en Beachcoin-invarianten. Run: node doublefuzz.js [seed]
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

const SEED = parseInt(process.argv[2] || '440044', 10);
let _s = SEED >>> 0;
Math.random = function(){ _s = (_s * 1664525 + 1013904223) >>> 0; return _s / 4294967296; };
const R = n => Math.floor(Math.random() * n);
const pick = a => a[R(a.length)];

const B = DG.Battle;
const SP = Object.keys(DG.SPECIES);
const TR = Object.keys(DG.TRAINERS).filter(t => (DG.TRAINERS[t].party||[]).length > 0);
const fails = [];

// ── 1. Dubbelgevecht-fuzz ────────────────────────────────────
const N = 40;
console.log(`═══ Double-fuzz: ${N} chaos-2v2-gevechten (seed ${SEED}) ═══`);
let ended = 0;
for (let i = 0; i < N; i++){
  const party = [];
  for (let k = 0; k < 2 + R(2); k++){
    const m = DG.SaveLoad.createDinoMon(pick(SP), 40 + R(60));
    m.hp.current = k === 0 ? m.hp.max : [m.hp.max, 1, Math.ceil(m.hp.max/2)][R(3)];
    party.push(m);
  }
  const gs = { player:{ party, bag:{ POTION:2 }, money:1000, flags:{}, badges:[], dex:{}, stats:{}, box:[],
                        currentMap:'X', x:5, y:5 }, settings:{ textSpeed:'FAST' } };
  let result = null, threw = null, turns = 0, stuck = 0;
  try {
    B.startDouble({
      enemy1Trainer: DG.TRAINERS[pick(TR)],
      enemy2Trainer: DG.TRAINERS[pick(TR)],
      allyTrainer:   DG.TRAINERS[pick(TR)],
      gameState: gs, onEnd: r => result = r,
    });
    for (let f = 0; f < 60000; f++){
      B.update(16);
      const st = B.getState();
      if (st === 'PLAYER_INPUT'){
        stuck = 0;
        const bt = B.getBattle();
        if (bt && bt.isForcedSwitch){
          const idx = party.findIndex(m => m && !m.isEgg && m.hp.current > 0);
          B.submitPlayerAction({ type:'SWITCH', targetIndex: idx >= 0 ? idx : 0 });
          continue;
        }
        turns++;
        if (turns > 250){ fails.push(`dbl #${i}: >250 beurten (seed ${SEED})`); break; }
        if (Math.random() < 0.3 && B.switchDoubleTarget) { try { B.switchDoubleTarget(); } catch(e){} }
        B.submitPlayerAction(Math.random() < 0.8
          ? { type:'MOVE', moveIndex: [0,1,2,3,-1][R(5)] }
          : { type:'SWITCH', targetIndex: R(5) });
      } else { if (++stuck > 15000){ fails.push(`dbl #${i}: hang in ${st} (seed ${SEED})`); break; } }
      if (st === 'LEARN_MOVE'){ try{ B.confirmLearnMove(-1); }catch(e){} stuck = 0; }
      if (!B.isActive()) break;
    }
  } catch(e){ threw = e; }
  if (threw) fails.push(`dbl #${i}: EXCEPTION ${threw.message} (seed ${SEED})`);
  else if (result || !B.isActive()) ended++;
}
console.log(`afgerond: ${ended}/${N}`);

// ── 2. Tower-teamgeneratie: elke streak-tier levert geldige teams ──
(function(){
  console.log('\n═══ Tower-teamgeneratie (streak 0..50) ═══');
  let bad = 0;
  for (let streak = 0; streak <= 50; streak += 5){
    const lvl = Math.min(95, 65 + streak * 2);
    for (let t = 0; t < 5; t++){
      const ids = Object.keys(DG.SPECIES);
      for (let j = 0; j < 3; j++){
        const m = DG.SaveLoad.createDinoMon(ids[R(ids.length)], Math.max(5, lvl - 2 + j * 2));
        if (!m || !(m.hp.max > 0) || !m.moves.length){ bad++; fails.push(`tower streak ${streak}: ongeldige mon`); }
      }
    }
  }
  console.log(bad === 0 ? '  ✓ alle streak-tiers (0-50) leveren geldige teams' : `  ✗ ${bad} ongeldige`);
})();

// ── 3. Beachcoin-invarianten (hercheck na alle wijzigingen) ──
(function(){
  console.log('\n═══ Beachcoin-invarianten ═══');
  const CAP = 1.5, RUG = 0.08, MN = 0.70, MX = 1.45;
  function roll(v, basis){ if (!(v > 0)) return [0, basis];
    if (Math.random() < RUG) return [0, 0];
    const f = MN + Math.random() * (MX - MN);
    v = Math.max(0, Math.min(Math.round(basis * CAP), Math.round(v * f)));
    if (v <= 0) basis = 0; return [v, basis]; }
  let maxEver = 0, neg = 0;
  for (let i = 0; i < 20000; i++){
    let basis = 1000, v = 1000;
    for (let k = 0; k < 1 + R(12); k++) [v, basis] = roll(v, basis);
    if (v > maxEver) maxEver = v;
    if (v < 0) neg++;
  }
  const ok = maxEver <= 1500 && neg === 0;
  console.log(ok ? `  ✓ cap houdt (max ${maxEver} ≤ 1500), nooit negatief` : `  ✗ max ${maxEver} / neg ${neg}`);
  if (!ok) fails.push('beachcoin-invariant geschonden');
})();

console.log(`\nFAIL: ${fails.length}`);
fails.slice(0, 12).forEach(f => console.log('  [FAIL] ' + f));
process.exit(fails.length ? 1 : 0);

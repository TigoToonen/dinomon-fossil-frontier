// ════════════════════════════════════════════════════════════════
// DinoMon — kernmetriek BATTLE-STRATEGY Fase 4/5:
// "% van de gevechten gewonnen door de snelste mon" bij gelijkwaardig
// spel (beide kanten tier-3 AI, zelfde level, willekeurige soorten).
// Doel van het hele traject: dit cijfer moet richting ~55-60% (was
// naar schatting 75%+ vóór status 2.0 / vanguards / anti-priority).
// Run:  node measure_speedwin.js [aantal]   (default 400)
// ════════════════════════════════════════════════════════════════
'use strict';
const fs = require('fs');
globalThis.window = globalThis;
const _store = {};
globalThis.localStorage = {
  getItem: k => (k in _store ? _store[k] : null),
  setItem: (k, v) => { _store[k] = String(v); },
  removeItem: k => { delete _store[k]; },
};
const noop = new Proxy(function(){}, { get: () => noop, apply: () => undefined });
function L(f) { (0, eval)(fs.readFileSync(f, 'utf8')); }
['js/constants.js','js/data/moves.js','js/data/dinomons.js','js/data/natures.js',
 'js/data/tmData.js','js/data/trainers.js','js/data/maps.js','js/battle/typeChart.js',
 'js/battle/statusEffects.js','js/battle/battleAI.js','js/engine/saveload.js',
 'js/battle/battle.js'].forEach(L);
DG.BattleAnim = noop; DG.Audio = noop; DG.Input = noop;
DG.DialogueBox = { show: (m, cb) => { if (typeof cb === 'function') cb(); }, update: () => {} };
DG.BattleUI = { notify: () => {} };

const B = DG.Battle;
const RUNS = parseInt(process.argv[2], 10) || 400;
const LEVEL = 30;

// Alleen niet-legendaries met ≥2 damage-moves op dit level
const pool = Object.keys(DG.SPECIES).filter(id => {
  const s = DG.SPECIES[id];
  if (s.isLegendary || s.isMega || s.legendary || s.mega) return false;
  return true;
});

function runBattle() {
  const idA = pool[Math.floor(Math.random() * pool.length)];
  let idB = pool[Math.floor(Math.random() * pool.length)];
  if (idB === idA) idB = pool[(pool.indexOf(idA) + 7) % pool.length];

  const gs = DG.SaveLoad.createNewGame('Sim', 'Flint');
  gs.player.badges = ['1','2','3','4','5','6'];       // beide kanten spelen tier-3
  const monA = DG.SaveLoad.createDinoMon(idA, LEVEL);
  gs.player.party = [monA];
  const trainerData = { name: 'SimBot', aiTier: 3, reward: 0,
                        party: [{ speciesId: idB, level: LEVEL }] };
  B.start({ type: 'TRAINER', trainerData, gameState: gs, onEnd: () => {} });
  const monB = B.getBattle().enemyMon;

  const fasterIsA = monA.stats.spd === monB.stats.spd ? null : monA.stats.spd > monB.stats.spd;
  const simTrainer = { aiTier: 3 };

  let turns = 0, guard = 0;
  while (B.isActive() && guard++ < 30000) {
    B.update(16);
    if (B.getState() === 'PLAYER_INPUT') {
      turns++;
      if (turns > 200) return null; // patstelling — telt niet mee
      const act = DG.BattleAI.chooseAction(simTrainer, monA, B.getBattle().enemyMon, {});
      B.submitPlayerAction(act);
    }
  }
  if (guard >= 30000) return null;
  const res = B.getLastResult();
  if (res !== 'WIN' && res !== 'LOSE') return null;   // run/catch/other
  const aWon = res === 'WIN';
  return { fasterIsA, aWon, turns };
}

let fasterWins = 0, decided = 0, ties = 0, skipped = 0, totalTurns = 0, counted = 0;
for (let i = 0; i < RUNS; i++) {
  let r = null;
  try { r = runBattle(); } catch (e) { skipped++; continue; }
  if (!r) { skipped++; continue; }
  counted++; totalTurns += r.turns;
  if (r.fasterIsA === null) { ties++; continue; }
  decided++;
  if (r.fasterIsA === r.aWon) fasterWins++;
}

console.log('═══ Kernmetriek: wint de snelste mon? ═══');
console.log(`Gevechten geteld: ${counted} (van ${RUNS}; ${skipped} geskipt, ${ties} gelijke snelheid)`);
console.log(`Snelste mon wint: ${fasterWins}/${decided} = ${(100 * fasterWins / Math.max(1, decided)).toFixed(1)}%`);
console.log(`Gemiddelde duur: ${(totalTurns / Math.max(1, counted)).toFixed(1)} beurten`);
console.log('Doel: ~55-60% (50% = snelheid irrelevant, 75%+ = speed wint alles)');

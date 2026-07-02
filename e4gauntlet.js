// e4gauntlet.js — BALANS-AUDIT (ronde 9): de Elite Four is een ATTRITION-
// gauntlet — 5 gevechten achter elkaar (Aurora→Ember→Garnet→Phantom→Corvus)
// ZONDER healen ertussen; party draagt HP/PP/faints mee. Geen bestaande harnas
// test dit (die resetten HP per gevecht). We meten clear-rate + waar spelers
// muren raken, in 2 modellen (geen items = ondergrens / met items = realistisch).
// Run: node e4gauntlet.js [N] [playerLevel]   env ITEMS=1 voor item-model
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

const B = DG.Battle, AI = DG.BattleAI;
const N = parseInt(process.argv[2] || '40', 10);
const PLVL = parseInt(process.argv[3] || '82', 10);   // realistisch pre-E4-level na de brug
const USE_ITEMS = process.env.ITEMS === '1';

const E4 = ['ELITE_AURORA','ELITE_EMBER','ELITE_GARNET','ELITE_PHANTOM','GRAND_ARCHON_CORVUS'];
const LABELS = ['Aurora','Ember','Garnet','Phantom','Corvus'];

// sterke, gevarieerde endgame-pool (fatsoenlijk geëvolueerd)
const POOL = Object.keys(DG.SPECIES).filter(id => {
  const s = DG.SPECIES[id]; if (!s || !s.baseStats || s.speciesCategory === 'FORME') return false;
  const bst = Object.values(s.baseStats).reduce((a,b)=>a+b,0);
  return bst >= 480 && bst < 600 && (s.learnset||[]).length > 0;
});

// COVERAGE=1 → bouw een team met brede offensieve dekking (elk E4-thema heeft
// minstens één super-effectieve aanvaller), zoals een voorbereide speler.
const COVERAGE = process.env.COVERAGE === '1';
// SMART=1 → speler wisselt weg als de actieve mon geen fatsoenlijke damage kan
// doen maar een bankmon wél (modelleert menselijk strategisch wisselen).
const SMART = process.env.SMART === '1';

// beste effectiviteit die een mon met een damage-move tegen een doel haalt
function bestEffVs(mon, enemyMon){
  let best = 0;
  for (const mv of (mon.moves||[])){ const m = DG.MOVES[mv.moveId]; if (!m || m.category==='STATUS' || !m.power) continue;
    const es = DG.SPECIES[enemyMon.speciesId]; const eff = es ? DG.TypeChart.getEffectiveness(m.type, es.types) : 1;
    if (eff > best) best = eff;
  }
  return best;
}

function buildTeam(){
  const team = [];
  const used = new Set();
  if (COVERAGE){
    // verzeker één super-effectieve aanvaller tegen elk E4-hoofdtype
    const needTypes = [...new Set(E4.flatMap(g => DG.TRAINERS[g].party.map(p=>(DG.SPECIES[p.speciesId]||{}).types||[]).flat()))];
    for (const gt of needTypes){
      if (team.length >= 6) break;
      const cand = POOL.filter(id => !used.has(id) && (DG.SPECIES[id].learnset||[]).some(Lm => { const mv=DG.MOVES[Lm.move]; return mv && mv.category!=='STATUS' && mv.power && DG.TypeChart.getEffectiveness(mv.type,[gt])>1; }));
      if (!cand.length) continue;
      const id = cand[Math.floor(Math.random()*cand.length)]; used.add(id);
      const m = DG.SaveLoad.createDinoMon(id, PLVL); if (m && m.hp.max>0 && m.moves.length){ m.hp.current=m.hp.max; team.push(m); }
    }
  }
  while (team.length < 6){
    const id = POOL[Math.floor(Math.random()*POOL.length)];
    if (used.has(id)) continue; used.add(id);
    const m = DG.SaveLoad.createDinoMon(id, PLVL);
    if (m && m.hp.max > 0 && m.moves.length){ m.hp.current = m.hp.max; team.push(m); }
  }
  return team;
}

// speler-actie: tier-3 AI kiest de zet; met ITEMS heelt hij als de actieve mon
// onder 30% zakt en er nog een Hyper Potion is (simpele, redelijke heuristiek)
function playerAction(bt, gs){
  const mon = bt.playerMon, team = gs.player.party;
  if (USE_ITEMS && mon.hp.current > 0 && mon.hp.current < mon.hp.max*0.30 && (gs.player.bag.HYPERPOTION||0) > 0){
    return { type:'ITEM', itemId:'HYPERPOTION' };
  }
  // SMART: als de actieve mon niks kan raken (best <1×) maar een bankmon wél
  // ≥2×, wissel naar de beste matchup (menselijk spel).
  if (SMART){
    const cur = bestEffVs(mon, bt.enemyMon);
    if (cur < 1){
      let bestIdx = -1, bestScore = cur;
      for (let i = 0; i < team.length; i++){ const c = team[i];
        if (!c || c===mon || c.hp.current<=0) continue;
        const e = bestEffVs(c, bt.enemyMon);
        if (e > bestScore){ bestScore = e; bestIdx = i; }
      }
      if (bestIdx >= 0 && bestScore >= 2) return { type:'SWITCH', targetIndex: bestIdx };
    }
  }
  try { return AI.chooseAction({ aiTier:3 }, mon, bt.enemyMon, {}); }
  catch(e){ return { type:'MOVE', moveIndex:0 }; }
}

// één gevecht op de doorlopende gamestate; geen HP-reset. return 'WIN'|'LOSE'|'DRAW'
function oneFight(gs, trainer){
  const team = gs.player.party;
  const fe = DG.SaveLoad.createDinoMon(trainer.party[0].speciesId, trainer.party[0].level, null, trainer.party[0].moves);
  let result = null, turns = 0;
  B.start({ type:'TRAINER', enemy: fe, trainerData: trainer, gameState: gs, onEnd: r => result = r });
  for (let f = 0; f < 80000 && B.isActive(); f++){
    B.update(16);
    const st = B.getState();
    if (st === 'PLAYER_INPUT'){
      const bt = B.getBattle();
      if (bt && bt.isForcedSwitch){
        const inMon = AI.chooseSwitchIn(team.filter(m=>m&&m.hp.current>0), bt.enemyMon);
        const idx = inMon ? team.indexOf(inMon) : team.findIndex(m=>m&&m.hp.current>0);
        B.submitPlayerAction({ type:'SWITCH', targetIndex: idx>=0?idx:0 });
        continue;
      }
      turns++; if (turns > 300){ result = 'DRAW'; break; }
      B.submitPlayerAction(playerAction(bt, gs));
    }
    if (st === 'LEARN_MOVE'){ try{ B.confirmLearnMove(-1); }catch(e){} }
  }
  return result || 'DRAW';
}

function aliveCount(team){ return team.filter(m=>m&&m.hp.current>0).length; }

console.log(`═══ Elite-Four-gauntlet: ${N} runs, speler lv${PLVL}, ${USE_ITEMS?'MÉT items (20 Hyper Potion)':'GEEN items (ondergrens)'} ═══`);
console.log('(5 gevechten achter elkaar, GEEN heal ertussen — party draagt schade mee)\n');

let fullClears = 0;
const wallAt = [0,0,0,0,0];   // waar de run strandt per Elite
const reachedAlive = [[],[],[],[],[]];   // levende mons bij aanvang van elke Elite

for (let i = 0; i < N; i++){
  const gs = { player:{ party: buildTeam(), bag: USE_ITEMS ? { HYPERPOTION:20 } : {}, money:0,
                        flags:{}, badges:[], dex:{}, stats:{}, box:[], currentMap:'X', x:5, y:5 },
               settings:{ textSpeed:'FAST' } };
  let stage = 0;
  for (; stage < E4.length; stage++){
    reachedAlive[stage].push(aliveCount(gs.player.party));
    if (aliveCount(gs.player.party) === 0){ break; }
    const res = oneFight(gs, DG.TRAINERS[E4[stage]]);
    if (res !== 'WIN'){ wallAt[stage]++; break; }
    // GEEN heal — party blijft zoals hij is (mutatie persisteert op dezelfde objecten)
  }
  if (stage === E4.length) fullClears++;
}

console.log(`VOLLEDIGE CLEARS (Aurora t/m Corvus): ${fullClears}/${N} = ${(fullClears/N*100).toFixed(0)}%\n`);
console.log('Waar stranden runs (aantal dat hier faalt):');
for (let s = 0; s < E4.length; s++){
  const avgAlive = reachedAlive[s].length ? (reachedAlive[s].reduce((a,b)=>a+b,0)/reachedAlive[s].length) : 0;
  console.log(`  ${LABELS[s].padEnd(8)} bereikt door ${String(reachedAlive[s].length).padStart(3)} runs (gem. ${avgAlive.toFixed(1)} mons over) — faalt hier: ${wallAt[s]}`);
}
fs.writeFileSync('.claude/e4gauntlet.json', JSON.stringify({ PLVL, USE_ITEMS, N, fullClears, wallAt }, null, 2));
process.exit(0);

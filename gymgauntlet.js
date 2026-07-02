// gymgauntlet.js — BALANS-AUDIT (ronde 8): wint een COMPETENTE speler op het
// bedoelde level elke gym? Speler-kant wordt door de echte BattleAI (tier 3)
// gestuurd — geen domme zetten, geen items. Per gym N verse level-passende
// random teams; we meten win-rate en gemiddelde beurten. Doel: elke gym
// beatable maar niet triviaal. Run: node gymgauntlet.js [N]
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

// effectieve badge-volgorde (AFK Jorn ingevoegd tussen Terra en Volt)
const GYMS = ['GYM_REX','GYM_RIDLEY','GYM_IGNIS','GYM_SYLVA','GYM_TERRA','GYM_AFKJORN','GYM_VOLT','GYM_MARINA','GYM_VALDEZ'];

// REALISTIC=1 → modelleer een echte, voorbereide speler: teampool met BST die
// meestijgt met de vordering (geen frêle early-mons in je endgame-team) en +2
// arrival-level. Standaard = "kaal" model (elk level-passend team, exact ace).
const REALISTIC = process.env.REALISTIC === '1';

function bstOf(id){ const s=DG.SPECIES[id]; return s&&s.baseStats?Object.values(s.baseStats).reduce((a,b)=>a+b,0):0; }
const ALL = Object.keys(DG.SPECIES).filter(id => {
  const s = DG.SPECIES[id]; if (!s || !s.baseStats || s.speciesCategory === 'FORME') return false;
  const bst = bstOf(id); return bst > 0 && bst < 600 && (s.learnset||[]).length > 0;
});

// COUNTER=1 → speler brengt een TYPE-PASSEND, sterk team: alleen mons die super-
// effectief zijn tegen de gym-hoofdtypes én zelf niet zwak/immuun-walled worden.
// Modelleert een speler die zich voorbereidt (de bedoelde weg door een gym).
const COUNTER = process.env.COUNTER === '1';

function poolFor(gymIndex, gymTrainer){
  if (COUNTER){
    const gymTypes = [...new Set(gymTrainer.party.map(p=>(DG.SPECIES[p.speciesId]||{}).types||[]).flat())];
    const strong = ALL.filter(id => {
      if (bstOf(id) < 440) return false;                 // fatsoenlijk geëvolueerd
      const s = DG.SPECIES[id];
      // heeft minstens één aanval super-effectief tegen een gym-type
      return (s.learnset||[]).some(Lm => { const mv=DG.MOVES[Lm.move]; if(!mv||mv.category==='STATUS')return false;
        return gymTypes.some(gt => DG.TypeChart.getEffectiveness(mv.type,[gt])>1); });
    });
    return strong.length >= 8 ? strong : ALL.filter(id=>bstOf(id)>=440);
  }
  if (!REALISTIC) return ALL;
  const minBST = [0,0,300,340,380,400,430,460,480][gymIndex] || 0;
  const p = ALL.filter(id => bstOf(id) >= minBST);
  return p.length >= 12 ? p : ALL;
}

function randTeam(level, size, pool){
  const team = [];
  for (let i = 0; i < size; i++){
    const id = pool[Math.floor(Math.random()*pool.length)];
    const m = DG.SaveLoad.createDinoMon(id, level);   // natuurlijke learnset-moves
    if (m && m.hp.max > 0 && m.moves.length){ m.hp.current = m.hp.max; team.push(m); }
    else i--;
  }
  return team;
}

// één gym-gevecht, speler competent gestuurd; return 'WIN'|'LOSE'|'DRAW' + turns
function fightGym(team, gymTrainer){
  const gs = { player:{ party: team, bag:{}, money:0, flags:{}, badges:[], dex:{}, stats:{}, box:[],
                        currentMap:'X', x:5, y:5 }, settings:{ textSpeed:'FAST' } };
  const firstEnemy = DG.SaveLoad.createDinoMon(gymTrainer.party[0].speciesId, gymTrainer.party[0].level, null, gymTrainer.party[0].moves);
  let result = null, turns = 0;
  B.start({ type:'TRAINER', enemy: firstEnemy, trainerData: gymTrainer, gameState: gs, onEnd: r => result = r });
  for (let f = 0; f < 60000 && B.isActive(); f++){
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
      turns++;
      if (turns > 200){ result = 'DRAW'; break; }
      // competente speler: tier-3 AI kiest onze zet
      let act;
      try { act = AI.chooseAction({ aiTier:3 }, bt.playerMon, bt.enemyMon, {}); }
      catch(e){ act = { type:'MOVE', moveIndex:0 }; }
      B.submitPlayerAction(act || { type:'MOVE', moveIndex:0 });
    }
    if (st === 'LEARN_MOVE'){ try{ B.confirmLearnMove(-1); }catch(e){} }
  }
  return { result: result || 'DRAW', turns };
}

console.log(`═══ Gym-gauntlet: ${N} competente runs per gym ═══`);
console.log('(win-rate op ace-level = verwacht arrival; team = random level-passend, speler=AI-tier3)\n');
console.log(REALISTIC ? '[REALISTIC-model: BST-passende pool + arrival op ace+2]\n' : '[KAAL model: elk level-passend team, exact ace-level]\n');
const rows = [];
for (let gi = 0; gi < GYMS.length; gi++){
  const gid = GYMS[gi];
  const t = DG.TRAINERS[gid];
  const ace = Math.max(...t.party.map(p=>p.level));
  // Speler-level = wat de ROUTE levert bij aankomst (los van de gym-ace, zodat
  // een gym-nerf niet stiekem ook de speler verzwakt). Route-curve = originele
  // aces vóór de ronde-8-rebalans.
  const ROUTE_LEVEL = [14,22,32,38,44,42,50,58,68];
  const plvl = ROUTE_LEVEL[gi] + (REALISTIC || COUNTER ? 2 : 0);
  const pool = poolFor(gi, t);
  const size = Math.min(6, t.party.length + 1);   // speler mag 1 mon meer dan de gym
  let wins = 0, turnsum = 0, losses = 0, draws = 0;
  for (let i = 0; i < N; i++){
    const { result, turns } = fightGym(randTeam(plvl, size, pool), t);
    if (result === 'WIN'){ wins++; turnsum += turns; }
    else if (result === 'LOSE') losses++;
    else draws++;
  }
  const wr = wins / N;
  const avgTurns = wins ? (turnsum/wins) : 0;
  let verdict = '✓ gebalanceerd';
  if (wr < 0.45)      verdict = '⚠ MOEILIJK (mogelijk difficulty-spike)';
  else if (wr > 0.97 && avgTurns < 4) verdict = '⚠ TRIVIAAL (te makkelijk)';
  rows.push({ gym: gid.replace('GYM_',''), ace, wr, avgTurns, draws, verdict });
  console.log(`${(gid.replace('GYM_','')+' (lv'+ace+')').padEnd(20)} win ${(wr*100).toFixed(0).padStart(3)}%  ~${avgTurns.toFixed(1)} beurten  ${draws?('draws '+draws+'  '):''}${verdict}`);
}

const flags = rows.filter(r => r.verdict.includes('⚠'));
console.log(`\nGemarkeerde gyms: ${flags.length}`);
flags.forEach(r => console.log(`  • ${r.gym}: ${(r.wr*100).toFixed(0)}% win — ${r.verdict}`));
fs.writeFileSync('.claude/gymgauntlet.json', JSON.stringify(rows, null, 2));
process.exit(0);

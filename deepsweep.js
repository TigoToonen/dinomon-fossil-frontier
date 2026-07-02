// deepsweep.js — ronde-3-verdieping van de testloop:
//   1. Corrupt-save-robuustheid (kapotte JSON mag nooit crashen)
//   2. Evolutie-tijdens-battle via echte EXP (level-up → evolutie-queue)
//   3. Soak: 25 gevechten achter elkaar op ÉÉN gamestate (state-accumulatie)
// Run: node deepsweep.js   (exit 1 bij FAIL)
'use strict';
const fs = require('fs');
globalThis.window = globalThis;
const _store = {};
globalThis.localStorage = {
  getItem: k => (k in _store ? _store[k] : null),
  setItem: (k,v) => { _store[k] = String(v); },
  removeItem: k => { delete _store[k]; },
};
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
const check = (n,c,d) => { console.log((c?'  ✓ ':'  ✗ ')+n+(c?'':(' — '+(d||'')))); if(!c) fails.push(n+(d?(' — '+d):'')); };

console.log('═══ Deep-sweep (ronde 3) ═══');

// ── 1. Corrupt-save-robuustheid ──────────────────────────────
(function(){
  console.log('\n[1] Corrupte saves crashen nooit');
  const cases = {
    'lege string':      '',
    'kapotte JSON':     '{"player": {"name": "Tig',
    'verkeerd type':    '"gewoon een string"',
    'null':             'null',
    'leeg object':      '{}',
    'party is string':  '{"version":14,"player":{"name":"X","party":"HACKED"}}',
    'mon zonder hp':    '{"version":14,"player":{"name":"X","party":[{"speciesId":"TINDREL","level":5}],"bag":{},"flags":{}},"settings":{}}',
  };
  for (const [naam, raw] of Object.entries(cases)){
    _store['DG_SAVE_SLOT_2'] = raw;
    let loaded, threw = null;
    try { loaded = DG.SaveLoad.loadSlot(2); } catch(e){ threw = e; }
    check(`corrupt (${naam}): geen exception`, !threw, threw && threw.message);
    // listSlots mag er ook niet op stuklopen
    let threw2 = null; try { DG.SaveLoad.listSlots(); } catch(e){ threw2 = e; }
    check(`corrupt (${naam}): listSlots overleeft`, !threw2, threw2 && threw2.message);
  }
  delete _store['DG_SAVE_SLOT_2'];
})();

// ── 2. Evolutie via echte battle-EXP ─────────────────────────
(function(){
  console.log('\n[2] Level-up + evolutie-queue via echte battle-EXP');
  // soort met een level-up-evolutie net boven het startlevel kiezen
  // laagste level-up-evolutie in de game pakken
  const evoId = Object.keys(DG.SPECIES)
    .filter(id => DG.SPECIES[id].evolvesTo && DG.SPECIES[id].evolvesAt > 1)
    .sort((a,b) => DG.SPECIES[a].evolvesAt - DG.SPECIES[b].evolvesAt)[0];
  if (!evoId){ check('evolueerbare soort gevonden', false); return; }
  const evoAt = DG.SPECIES[evoId].evolvesAt, target = DG.SPECIES[evoId].evolvesTo;
  const mon = DG.SaveLoad.createDinoMon(evoId, evoAt - 1);   // 1 level onder evolutie
  mon.hp.current = mon.hp.max;
  const gs = { player:{ party:[mon], bag:{}, money:0, flags:{}, badges:[], dex:{}, stats:{}, box:[],
                        currentMap:'X', x:5, y:5 }, settings:{ textSpeed:'FAST' } };
  // hoge-level vijand voor bulk-EXP; 1 HP zodat 1 klap volstaat
  const enemy = DG.SaveLoad.createDinoMon('MEGASTONE', 60); enemy.hp.current = 1;
  let result = null, threw = null;
  try {
    B.start({ type:'WILD', enemy, gameState: gs, onEnd: r => result = r });
    for (let f = 0; f < 20000 && B.isActive(); f++){
      B.update(16);
      const st = B.getState();
      if (st === 'PLAYER_INPUT') B.submitPlayerAction({ type:'MOVE', moveIndex:0 });
      if (st === 'LEARN_MOVE'){ try{ B.confirmLearnMove(-1); }catch(e){} }
    }
  } catch(e){ threw = e; }
  check('EXP-gevecht zonder exception', !threw, threw && threw.message);
  check('gevecht gewonnen', result === 'WIN', 'result='+result);
  check(`level steeg voorbij ${evoAt-1}`, mon.level >= evoAt, 'level='+mon.level);
  const evolved = mon.speciesId === target || mon._evoQueued || (gs.player.party[0].speciesId === target);
  check(`evolutie ${evoId}→${target} uitgevoerd of in de queue`, evolved,
        `speciesId=${gs.player.party[0].speciesId} _evoQueued=${mon._evoQueued}`);
})();

// ── 3. Soak: 25 gevechten op één gamestate ───────────────────
(function(){
  console.log('\n[3] Soak: 25 opeenvolgende gevechten op één gamestate');
  const m1 = DG.SaveLoad.createDinoMon('PYROCERATH', 100, null, ['FLAMETHROWER','FLAMETHROWER','FLAMETHROWER','FLAMETHROWER']);
  const gs = { player:{ party:[m1], bag:{ POTION: 10 }, money: 1000, flags:{}, badges:[], dex:{}, stats:{}, box:[],
                        currentMap:'X', x:5, y:5 }, settings:{ textSpeed:'FAST' } };
  let wins = 0, threw = null, moneyOk = true;
  const t = DG.TRAINERS.HIKER_BRETT, verwachtPerWin = t.reward || 0;
  try {
    for (let i = 0; i < 25; i++){
      m1.hp.current = m1.hp.max; m1.statusEffect = null;
      m1.moves.forEach(mv => mv.ppCurrent = mv.ppMax);
      const geldVoor = gs.player.money;
      const fe = DG.SaveLoad.createDinoMon(t.party[0].speciesId, t.party[0].level, null, t.party[0].moves);
      let res = null;
      B.start({ type:'TRAINER', enemy: fe, trainerData: t, gameState: gs, onEnd: r => res = r });
      for (let f = 0; f < 30000 && B.isActive(); f++){
        B.update(16);
        const st = B.getState();
        if (st === 'PLAYER_INPUT') B.submitPlayerAction({ type:'MOVE', moveIndex:0 });
        if (st === 'LEARN_MOVE'){ try{ B.confirmLearnMove(-1); }catch(e){} }
      }
      if (res === 'WIN'){ wins++;
        if (gs.player.money !== geldVoor + verwachtPerWin) moneyOk = false;
      }
    }
  } catch(e){ threw = e; }
  check('25 gevechten zonder exception', !threw, threw && threw.message);
  check('25/25 gewonnen', wins === 25, wins+'/25');
  check('beloning elke keer EXACT (geen accumulatie-lek)', moneyOk, 'geld='+gs.player.money);
  // volatiles mogen niet op de saved mon achterblijven
  const vol = ['_infatuated','_lock','_charging','_rechargeNext','_flinched','_seeded','_rolloutMult'];
  const dirty = vol.filter(k => m1[k] && m1[k] !== 1);
  check('geen volatile-restanten op de party-mon', dirty.length === 0, dirty.join(','));
})();

console.log(`\nFAIL: ${fails.length}`);
fails.forEach(f=>console.log('  [FAIL] '+f));
process.exit(fails.length ? 1 : 0);

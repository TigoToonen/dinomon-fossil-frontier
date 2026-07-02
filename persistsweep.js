// persistsweep.js — fase F1/F4: save→load-roundtrip + difficulty-checks.
// Bouwt een rijke gamestate (party/box/eggs/beachcoin/tower/flags), saved,
// laadt terug en vergelijkt alle kritieke velden. Run: node persistsweep.js
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
 'js/data/tmData.js','js/engine/saveload.js'].forEach(L);
DG.Audio = noop; DG.DialogueBox = { show:(m,cb)=>cb&&cb(), update:()=>{} };

const fails = [];
const eq = (a,b) => JSON.stringify(a) === JSON.stringify(b);

// ── rijke gamestate bouwen ───────────────────────────────────
const gs = DG.SaveLoad.createNewGame ? DG.SaveLoad.createNewGame('Tester') : null;
if (!gs) { console.log('createNewGame ontbreekt — val terug op handmatige gs'); }
const state = gs || { player:{}, settings:{} };
const p = state.player;
p.name = 'Tester';
p.party = [
  Object.assign(DG.SaveLoad.createDinoMon('TINDREL', 42, 'Vlammetje'), { isShiny:true, heldItem:'LEFTOVERS' }),
  DG.SaveLoad.createDinoMon('GLACIODON', 66),
];
p.party[0].hp.current = 17;                       // deels gewond
p.party[0].statusEffect = 'BURN';                 // met status
p.bag = { POTION: 3, ULTRABALL: 7, RARE_CANDY: 2, HM_SURF: 1 };
p.money = 133700;
p.badges = ['Herd Badge','Fossil Badge'];
p.flags = { BADGE_1: true, BADGE_2: true, TRAINER_HIKER_BRETT_DEFEATED: true, SURF_UNLOCKED: true };
p.dex = { TINDREL: { seen:true, caught:true }, QUAKELING: { seen:true, caught:false } };
p.box = [ DG.SaveLoad.createDinoMon('BUGLING', 9) ];
p.beachcoin = { value: 4200, basis: 3000, lastSwing: null };
p.towerStreak = 7; p.towerBest = 12;
p.currentMap = 'COMPOUND_CITY'; p.x = 9; p.y = 13;
p.steps = 5555; p.playtime = 3600;
state.settings = { textSpeed:'FAST', battleFx:'OFF', musicVolume:0.4, sfxVolume:0.7 };

// ── save → load → vergelijk ─────────────────────────────────
DG.SaveLoad.setActiveSlot(0);
DG.SaveLoad.save(state);
const loaded = DG.SaveLoad.loadSlot(0);
if (!loaded) { console.log('FAIL: loadSlot(0) gaf null'); process.exit(1); }
const lp = loaded.player;

const checks = [
  ['naam',        () => lp.name === 'Tester'],
  ['party-lengte',() => lp.party.length === 2],
  ['soort+level', () => lp.party[0].speciesId==='TINDREL' && lp.party[0].level===42],
  ['nickname',    () => lp.party[0].nickname === 'Vlammetje'],
  ['hp deels',    () => lp.party[0].hp.current === 17],
  ['status',      () => lp.party[0].statusEffect === 'BURN'],
  ['shiny',       () => lp.party[0].isShiny === true],
  ['held item',   () => lp.party[0].heldItem === 'LEFTOVERS'],
  ['moves',       () => eq(lp.party[0].moves.map(m=>m.moveId), p.party[0].moves.map(m=>m.moveId))],
  ['bag',         () => eq(lp.bag, p.bag)],
  ['geld',        () => lp.money === 133700],
  ['badges',      () => eq(lp.badges, p.badges)],
  ['flags',       () => lp.flags.BADGE_2 === true && lp.flags.SURF_UNLOCKED === true && lp.flags.TRAINER_HIKER_BRETT_DEFEATED === true],
  ['dex',         () => eq(lp.dex.TINDREL, {seen:true,caught:true}) && lp.dex.QUAKELING.caught === false],
  ['box',         () => Array.isArray(lp.box) && lp.box.length===1 && lp.box[0].speciesId==='BUGLING'],
  ['beachcoin',   () => lp.beachcoin && lp.beachcoin.value===4200 && lp.beachcoin.basis===3000],
  ['tower',       () => lp.towerStreak===7 && lp.towerBest===12],
  ['locatie',     () => lp.currentMap==='COMPOUND_CITY' && lp.x===9 && lp.y===13],
  ['steps/tijd',  () => lp.steps===5555 && lp.playtime===3600],
  ['settings',    () => loaded.settings.textSpeed==='FAST' && loaded.settings.battleFx==='OFF' && loaded.settings.musicVolume===0.4],
];
checks.forEach(([naam, ok]) => { let r=false; try { r = ok(); } catch(e){ r=false; }
  if (!r) fails.push(`F1 roundtrip: '${naam}' overleeft save→load niet`); });

// ── dubbele roundtrip (save van geladen staat) ──────────────
DG.SaveLoad.save(loaded);
const loaded2 = DG.SaveLoad.loadSlot(0);
if (!eq(loaded2.player.party.map(m=>[m.speciesId,m.level,m.hp.current]),
        loaded.player.party.map(m=>[m.speciesId,m.level,m.hp.current])))
  fails.push('F1: tweede roundtrip muteert party');

// ── slots onafhankelijk ─────────────────────────────────────
DG.SaveLoad.setActiveSlot(1);
const gs2 = JSON.parse(JSON.stringify(state)); gs2.player.name = 'Slot2';
DG.SaveLoad.save(gs2);
DG.SaveLoad.setActiveSlot(0);
const back = DG.SaveLoad.loadSlot(0);
if (back.player.name !== 'Tester') fails.push('F1: slot 1 overschreef slot 0');
const slots = DG.SaveLoad.listSlots ? DG.SaveLoad.listSlots() : null;
if (slots && slots.filter(s=>!s.empty).length < 2) fails.push('F1: listSlots ziet de 2 gevulde slots niet');
if (DG.SaveLoad.deleteSlot) { DG.SaveLoad.deleteSlot(1);
  const after = DG.SaveLoad.listSlots ? DG.SaveLoad.listSlots() : [];
  if (after.length && after.find(s=>s.id===1) && !after.find(s=>s.id===1).empty) fails.push('F1: deleteSlot(1) verwijdert niet');
}

console.log('═══ Persist-sweep (F1 save/load) ═══');
console.log(`checks: ${checks.length + 3} | FAIL: ${fails.length}`);
fails.forEach(f=>console.log('  [FAIL] '+f));
process.exit(fails.length ? 1 : 0);

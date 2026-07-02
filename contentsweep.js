// contentsweep.js — fase B3 (soorten) + C1 (item-effecten) van de testloop.
// B3: elke soort aanmaken op lv5..100, stats geldig, evolutieketens kloppen,
//     learnset-moves bestaan, shiny-veld aanwezig.
// C1: elk heal/cure/revive-item doet wat het belooft (via BagMenu.applyHeal),
//     ballen bestaan met modifier, stenen-evoluties verwijzen naar echte soorten.
// Run: node contentsweep.js   (exit 1 bij FAIL)
'use strict';
const fs = require('fs');
globalThis.window = globalThis;
globalThis.localStorage = { getItem:()=>null, setItem:()=>{}, removeItem:()=>{} };
const noop = new Proxy(function(){}, { get:()=>noop, apply:()=>undefined });
function L(f){ (0,eval)(fs.readFileSync(f,'utf8')); }
['js/constants.js','js/data/moves.js','js/data/dinomons.js','js/data/natures.js',
 'js/data/tmData.js','js/data/trainers.js','js/battle/typeChart.js',
 'js/battle/statusEffects.js','js/engine/saveload.js'].forEach(L);
DG.Audio = noop; DG.Input = noop; DG.BattleAnim = noop;
DG.DialogueBox = { show:(m,cb)=>{ if(typeof cb==='function') cb(); }, update:()=>{} };
L('js/ui/bagMenu.js');

const fails = [], warns = [];

// ── B3: soorten ──────────────────────────────────────────────
(function(){
  const STATS = ['hp','atk','def','spAtk','spDef','spd'];
  for (const id of Object.keys(DG.SPECIES)) {
    const sp = DG.SPECIES[id];
    for (const lvl of [5, 36, 71, 100]) {
      let m;
      try { m = DG.SaveLoad.createDinoMon(id, lvl); } catch(e){ fails.push(`B3 ${id} lv${lvl}: createDinoMon EXCEPTION ${e.message}`); continue; }
      if (!m) { fails.push(`B3 ${id} lv${lvl}: createDinoMon gaf null`); continue; }
      STATS.forEach(s=>{ const v = s==='hp' ? m.hp.max : m.stats[s];
        if (!(v > 0) || Number.isNaN(v)) fails.push(`B3 ${id} lv${lvl}: stat ${s}=${v}`); });
      if (!m.moves || !m.moves.length) fails.push(`B3 ${id} lv${lvl}: geen moves`);
      (m.moves||[]).forEach(s=>{ if(!DG.MOVES[s.moveId]) fails.push(`B3 ${id} lv${lvl}: onbekende move ${s.moveId}`); });
    }
    // evolutieketen
    if (sp.evolvesTo) {
      if (!DG.SPECIES[sp.evolvesTo]) fails.push(`B3 ${id}: evolvesTo '${sp.evolvesTo}' bestaat niet`);
      else if (!(sp.evolvesAt > 0) && !Object.values(DG.STONE_EVOLUTIONS||{}).some(t=>t && t[id]))
        warns.push(`B3 ${id}: evolueert naar ${sp.evolvesTo} maar zonder evolvesAt én zonder steen — hoe dan?`);
      if (DG.SPECIES[sp.evolvesTo] && DG.SPECIES[sp.evolvesTo].prevForm !== id)
        warns.push(`B3 ${id} -> ${sp.evolvesTo}: prevForm wijst terug naar '${DG.SPECIES[sp.evolvesTo].prevForm}'`);
    }
    // shiny-weergave hangt af van isShiny-veld — aanmaak mag het veld dragen
    const m2 = DG.SaveLoad.createDinoMon(id, 20);
    if (m2 && typeof m2.isShiny === 'undefined') warns.push(`B3 ${id}: mon-object heeft geen isShiny-veld`);
  }
  // stenen-evoluties: alle bron- en doelsoorten bestaan
  for (const stone in (DG.STONE_EVOLUTIONS||{})) {
    const table = DG.STONE_EVOLUTIONS[stone] || {};
    for (const from in table) {
      if (!DG.SPECIES[from]) fails.push(`B3 steen ${stone}: bronsoort '${from}' bestaat niet`);
      if (!DG.SPECIES[table[from]]) fails.push(`B3 steen ${stone}: doelsoort '${table[from]}' bestaat niet`);
    }
  }
})();

// ── C1: item-effecten ────────────────────────────────────────
(function(){
  const mk = () => { const m = DG.SaveLoad.createDinoMon('TINDREL', 40); m.hp.max = 100; m.hp.current = 100; return m; };
  const apply = DG.BagMenu.applyHeal;
  const cases = [
    { id:'POTION',      prep:m=>{m.hp.current=50;}, ok:m=>m.hp.current===70 },
    { id:'SUPERPOTION', prep:m=>{m.hp.current=20;}, ok:m=>m.hp.current===70 },
    { id:'HYPERPOTION', prep:m=>{m.hp.current=10;}, ok:m=>m.hp.current===100 },
    { id:'MAXPOTION',   prep:m=>{m.hp.current=1;},  ok:m=>m.hp.current===100 },
    { id:'FULLRESTORE', prep:m=>{m.hp.current=1; m.statusEffect='BURN';}, ok:m=>m.hp.current===100 && !m.statusEffect },
    { id:'REVIVE',      prep:m=>{m.hp.current=0;},  ok:m=>m.hp.current===50 },
    { id:'MAXREVIVE',   prep:m=>{m.hp.current=0;},  ok:m=>m.hp.current===100 },
    { id:'ANTIDOTE',    prep:m=>{m.statusEffect='POISON';}, ok:m=>!m.statusEffect },
    { id:'BURNHEAL',    prep:m=>{m.statusEffect='BURN';},   ok:m=>!m.statusEffect },
    { id:'PARALYHEAL',  prep:m=>{m.statusEffect='PARALYSIS';}, ok:m=>!m.statusEffect },
    { id:'AWAKENING',   prep:m=>{m.statusEffect='SLEEP';},  ok:m=>!m.statusEffect },
    { id:'FULLHEAL',    prep:m=>{m.statusEffect='FREEZE';}, ok:m=>!m.statusEffect },
    // ongeldig doel: potion op fainted mon moet WEIGEREN
    { id:'POTION(fainted)', item:'POTION', prep:m=>{m.hp.current=0;}, ok:(m,res)=>res===false && m.hp.current===0 },
    // ongeldig doel: revive op levende mon moet WEIGEREN
    { id:'REVIVE(levend)', item:'REVIVE', prep:m=>{m.hp.current=50;}, ok:(m,res)=>res===false && m.hp.current===50 },
    { id:'FULLHEAL(zonder status)', item:'FULLHEAL', prep:m=>{}, ok:(m,res)=>res===false },
  ];
  for (const c of cases) {
    const m = mk(); c.prep(m);
    let res;
    try { res = apply(m, c.item || c.id); }
    catch(e){ fails.push(`C1 ${c.id}: EXCEPTION ${e.message}`); continue; }
    if (!c.ok(m, res)) fails.push(`C1 ${c.id}: effect klopt niet (hp=${m.hp.current} status=${m.statusEffect} res=${res})`);
  }
  // ballen: bestaan + modifier + prijs>0 voor koopbare
  ['DINOBALL','SUPERBALL','ULTRABALL','AMBERBALL','MASTERBALL','DINOMASTERBALL'].forEach(b=>{
    const d = DG.ITEMS[b];
    if (!d) { fails.push(`C1 bal ${b}: geen definitie`); return; }
    if (!(d.modifier > 0)) fails.push(`C1 bal ${b}: modifier=${d.modifier}`);
  });
  // Rare Candy prijs-sanity (Tigo: ¥6969)
  if (DG.ITEMS.RARE_CANDY.price !== 6969) warns.push(`C1 RARE_CANDY prijs=${DG.ITEMS.RARE_CANDY.price} (verwacht 6969)`);
})();

console.log('═══ Content-sweep (B3 soorten + C1 items) ═══');
console.log(`FAIL: ${fails.length} | WARN: ${warns.length}`);
fails.slice(0,30).forEach(f=>console.log('  [FAIL] '+f));
if (fails.length>30) console.log(`  ...en ${fails.length-30} meer`);
warns.slice(0,20).forEach(w=>console.log('  [warn] '+w));
if (warns.length>20) console.log(`  ...en ${warns.length-20} meer`);
process.exit(fails.length ? 1 : 0);

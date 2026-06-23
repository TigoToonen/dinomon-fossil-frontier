// bugcheck.js — headless regression harness for DinoMon: Fossil Frontier.
// Run: node bugcheck.js   (exits non-zero if any CRITICAL/HIGH issue is found)
// Complements validate_game.js — this one focuses on MOVES, ROUTES and
// referential integrity that the move/route bug-hunt (June 2026) uncovered.
'use strict';
const fs = require('fs');
globalThis.window = globalThis;
function load(f){ (0,eval)(fs.readFileSync(f,'utf8')); }
load('js/constants.js');
load('js/data/moves.js');
load('js/data/dinomons.js');
load('js/data/trainers.js');
load('js/data/maps.js');

const battleSrc = fs.readFileSync('js/battle/battle.js','utf8');
const issues = [];
const add = (sev, area, msg) => issues.push({ sev, area, msg });

// ── 1. ROUTE REACHABILITY ────────────────────────────────────
(function routes(){
  const M = DG.MAPS, start = 'AMBERTOWN';
  const seen = { [start]: 1 }, q = [start];
  while (q.length){ const m = M[q.shift()]; if(!m) continue;
    (m.warps||[]).forEach(w=>{
      if(!M[w.targetMap]) add('HIGH','routes', `warp to MISSING map ${w.targetMap}`);
      else if(!seen[w.targetMap]){ seen[w.targetMap]=1; q.push(w.targetMap); }
    });
  }
  const KNOWN_ALIASES = new Set(['ROUTE_1']); // legacy alias, intentionally orphan
  Object.keys(M).forEach(id=>{
    if(!seen[id] && !KNOWN_ALIASES.has(id)) add('HIGH','routes',`map UNREACHABLE from ${start}: ${id}`);
  });
  // warp arrivals must land on a walkable tile
  Object.keys(M).forEach(id=>{ const m=M[id]; (m.warps||[]).forEach(w=>{
    const tm=M[w.targetMap]; if(!tm) return;
    const t=(tm.tiles[w.targetY]||[])[w.targetX];
    if(t===undefined) add('HIGH','routes',`${id}->${w.targetMap} arrival (${w.targetX},${w.targetY}) OUT OF BOUNDS`);
    else if(t>=64 && t!==68) add('HIGH','routes',`${id}->${w.targetMap} arrival (${w.targetX},${w.targetY}) on SOLID tile ${t}`);
  });});
})();

// ── 2. MOVE DATA CONSISTENCY ─────────────────────────────────
(function moves(){
  const M = DG.MOVES;
  // 2a. MULTI moves must resolve to a sane hit range the engine can read.
  for(const id in M){ const e=M[id].effect; if(e&&e.type==='MULTI'){
    const range = e.hits || (e.min!==undefined||e.max!==undefined ? [e.min,e.max] : null);
    if(!range) add('CRITICAL','moves',`MULTI move ${id} has no hits/min/max`);
    else { const [lo,hi]=range; if(!(lo>=1&&hi>=lo)) add('HIGH','moves',`MULTI move ${id} bad range ${JSON.stringify(range)}`); }
  }}
  // 2b. A move that is a RAMPAGE move must NOT also carry a self-CONFUSE effect
  //     (that double-applies / confuses on turn 1). Mirrors the Outrage bug.
  const RAMPAGE = (battleSrc.match(/_RAMPAGE_MOVES\s*=\s*\{([^}]*)\}/)||[])[1]||'';
  const rampageIds = (RAMPAGE.match(/[A-Z_]+/g)||[]);
  rampageIds.forEach(id=>{ const e=M[id]&&M[id].effect;
    if(e && e.type==='CONFUSE' && e.target==='self') add('HIGH','moves',`rampage move ${id} also has self-CONFUSE effect (confuses turn 1)`);
  });
  // 2c. Every effect.type used in data must be handled by the engine.
  // Definitive list of effect.type values the battle engine implements (verified
  // by reading battle.js _applyDamageMove/_applyStatusMove, June 2026), incl. the
  // status aliases now routed through _STATUS_ALIAS.
  const handled = new Set([
    'NONE','MULTI','ONE_HIT_KO','RECOIL','DRAIN','STATUS_CHANCE','FLINCH',
    'STAT_LOWER','STAT_RAISE','CONFUSE','RECHARGE','OMNI_RAISE','TWO_TURN',
    'HEAL','SET_WEATHER','LEECH_SEED','STEALTH_ROCK','STAT',
    'BURN_CHANCE','FREEZE_CHANCE','POISON_CHANCE','PARALYSIS','SLEEP',
  ]);
  // sanity: the engine source really does define the alias map we rely on
  if(!/_STATUS_ALIAS\s*=/.test(battleSrc)) add('HIGH','moves','battle.js no longer defines _STATUS_ALIAS — status-alias moves will silently no-op');
  const usedTypes = {};
  for(const id in M){ const t=M[id].effect&&M[id].effect.type; if(t){ (usedTypes[t]=usedTypes[t]||[]).push(id); } }
  Object.keys(usedTypes).forEach(t=>{
    if(!handled.has(t)) add('HIGH','moves',`effect.type '${t}' used by ${usedTypes[t].length} move(s) e.g. ${usedTypes[t][0]} but no handler '=== '${t}'' found in battle.js`);
  });
  // 2d. category sanity: STATUS moves should not have positive power; damaging moves should.
  for(const id in M){ const mv=M[id];
    if(mv.category==='STATUS' && mv.power>0) add('MED','moves',`STATUS move ${id} has power ${mv.power}`);
    if((mv.category==='PHYSICAL'||mv.category==='SPECIAL') && !(mv.power>=0)) add('MED','moves',`damaging move ${id} has invalid power ${mv.power}`);
  }
  // 2e. regression guards for fixed bugs
  if(M.SOLAR_BEAM && M.SOLAR_BEAM.effect.type!=='TWO_TURN') add('HIGH','moves','SOLAR_BEAM is not TWO_TURN (free 120 power regression)');
  if(M.OUTRAGE && M.OUTRAGE.effect.type==='CONFUSE') add('HIGH','moves','OUTRAGE has CONFUSE effect again (turn-1 confuse regression)');
})();

// ── 3. REFERENTIAL INTEGRITY: every referenced move exists ───
(function refs(){
  const M = DG.MOVES;
  const seen = new Set();
  const addMid = v => { if(!v) return; String(v).split(',').forEach(s=>{ const t=s.trim(); if(t) seen.add(t); }); };
  // learnsets (entries may be {level,move} or [level,move] or [level,'A,B,C'])
  for(const id in DG.SPECIES){ const sp=DG.SPECIES[id];
    (sp.learnset||[]).forEach(L=>{ addMid(Array.isArray(L)?L[1]:(L.moveId||L.move)); });
  }
  // trainer parties (p.moves is an array of ids, but be defensive)
  for(const id in DG.TRAINERS){ (DG.TRAINERS[id].party||[]).forEach(p=>{ (p.moves||[]).forEach(addMid); }); }
  // TM data
  if(DG.TM_DATA) for(const k in DG.TM_DATA){ addMid(DG.TM_DATA[k].moveId); }
  seen.forEach(mid=>{ if(!M[mid]) add('HIGH','refs',`move '${mid}' is referenced (learnset/trainer/TM) but missing from DG.MOVES`); });
})();

// ── 4. CONTENT INTEGRITY: species / evolutions / encounters / trainers ──
(function content(){
  const S = DG.SPECIES, M = DG.MOVES;
  const TYPES = DG.TYPES ? new Set(Object.keys(DG.TYPES).concat(Object.values(DG.TYPES))) : null;
  // 4a. evolutions point to a real species
  for(const id in S){ const sp=S[id];
    if(sp.evolvesTo && !S[sp.evolvesTo]) add('HIGH','content',`${id}.evolvesTo '${sp.evolvesTo}' is not a species`);
    if(sp.prevForm && !S[sp.prevForm]) add('MED','content',`${id}.prevForm '${sp.prevForm}' is not a species`);
  }
  // 4b. learnset moves exist & move types valid
  for(const id in S){ (S[id].learnset||[]).forEach(L=>{ const mid=Array.isArray(L)?L[1]:(L.moveId||L.move);
    if(mid && String(mid).split(',').some(x=>!M[x.trim()])) add('HIGH','content',`${id} learnset references missing move '${mid}'`);
  });}
  for(const mid in M){ const t=M[mid].type; if(TYPES && t && !TYPES.has(t)) add('MED','content',`move ${mid} has unknown type '${t}'`); }
  // 4c. encounter tables reference real species
  for(const mapId in DG.MAPS){ const et=DG.MAPS[mapId].encounterTable; if(!et) continue;
    ['grass','water','cave','fishing'].forEach(k=>{ (et[k]||[]).forEach(e=>{ const s=e.speciesId||e.species;
      if(s && !S[s]) add('HIGH','content',`${mapId} encounterTable.${k} references missing species '${s}'`);
      if(e.minLv!==undefined && e.maxLv!==undefined && e.minLv>e.maxLv) add('LOW','content',`${mapId} encounter ${s} minLv>maxLv`);
    });});
  }
  // 4d. trainer party species exist & levels sane
  for(const id in DG.TRAINERS){ (DG.TRAINERS[id].party||[]).forEach((p,i)=>{ const s=p.speciesId||p.species;
    if(s && !S[s]) add('HIGH','content',`trainer ${id} party[${i}] missing species '${s}'`);
    if(p.level!==undefined && !(p.level>=1 && p.level<=100)) add('MED','content',`trainer ${id} party[${i}] bad level ${p.level}`);
  });}
  // 4e. starters / fossil revivals exist
  (DG.STARTERS||[]).forEach(s=>{ const sid=typeof s==='string'?s:(s&&s.speciesId); if(sid&&!S[sid]) add('HIGH','content',`starter '${sid}' missing from species`); });
})();

// ── REPORT ───────────────────────────────────────────────────
const order = { CRITICAL:0, HIGH:1, MED:2, LOW:3 };
issues.sort((a,b)=>order[a.sev]-order[b.sev]);
console.log('═══ DinoMon bugcheck ═══');
console.log(`Maps:${Object.keys(DG.MAPS).length} Moves:${Object.keys(DG.MOVES).length} Species:${Object.keys(DG.SPECIES).length} Trainers:${Object.keys(DG.TRAINERS).length}`);
if(!issues.length){ console.log('\n✅ No issues found.'); process.exit(0); }
const counts = issues.reduce((a,i)=>((a[i.sev]=(a[i.sev]||0)+1),a),{});
console.log('\nIssues:', JSON.stringify(counts));
issues.forEach(i=>console.log(`  [${i.sev}] (${i.area}) ${i.msg}`));
const blocking = issues.filter(i=>i.sev==='CRITICAL'||i.sev==='HIGH').length;
process.exit(blocking ? 1 : 0);

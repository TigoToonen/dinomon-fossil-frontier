// walkthrough.js — headless playthrough-simulatie (fase A van de testloop).
// Bewijst dat de storyline van start tot credits haalbaar is: saturatie-BFS over
// alle maps met flag/badge/HM-gates, NPC-blokkades en warp-vereisten.
// Run: node walkthrough.js   (exit 1 bij een blokkerend probleem)
'use strict';
const fs = require('fs');
globalThis.window = globalThis;
function L(f){ (0,eval)(fs.readFileSync(f,'utf8')); }
L('js/constants.js'); L('js/data/moves.js'); L('js/data/dinomons.js');
L('js/data/trainers.js'); L('js/data/maps.js');

const M = DG.MAPS;
const START = { map:'AMBERTOWN', x:10, y:10 };   // na het lab-intro
const issues = [];
const add = (sev,msg) => issues.push({sev,msg});

// ── speler-staat ─────────────────────────────────────────────
const flags = new Set();
let badges = 0;
const HM_BY_BADGE = {2:'ROCK_SMASH_UNLOCKED',3:'FLASH_UNLOCKED',4:'CUT_UNLOCKED',
                     6:'STRENGTH_UNLOCKED',7:'FLY_UNLOCKED',8:'SURF_UNLOCKED',9:'DIVE_UNLOCKED'};

// ── loopbaarheid ─────────────────────────────────────────────
function npcBlocks(n){
  // zichtbaar = (geen requiresFlag of flag gezet) en (geen flagToHide of flag NIET gezet)
  const visible = (!n.requiresFlag || flags.has(n.requiresFlag)) && (!n.flagToHide || !flags.has(n.flagToHide));
  if (!visible) return false;
  if (n.trainerRef) return false;               // trainers zijn verslaanbaar → passeerbaar
  if (n.movementType === 'WANDER') return false; // zwervers lopen weg → niet permanent blokkerend
  return true;                                   // stilstaande NPC blokkeert zijn tegel
}
function tileWalkable(t){
  if (t === undefined) return false;
  if (t === 68) return true;                     // deur
  if (t === 3 || t === 87) return flags.has('SURF_UNLOCKED');
  if (t === 83) return flags.has('SURF_UNLOCKED');   // waterval vereist surf-basis
  if (t === 84) return flags.has('ROCK_SMASH_UNLOCKED');
  if (t === 85) return flags.has('CUT_UNLOCKED');
  if (t === 86) return flags.has('STRENGTH_UNLOCKED');
  return t < 64;
}
function key(m,x,y){ return m+':'+x+','+y; }

// ── globale BFS over alle maps gegeven huidige flags ─────────
function computeReachable(){
  const seen = new Set();
  const q = [[START.map, START.x, START.y]];
  seen.add(key(START.map, START.x, START.y));
  const blockers = {};   // per map: set van geblokkeerde tegels (NPC's)
  const reachedMaps = new Set([START.map]);
  while(q.length){
    const [mid,x,y] = q.shift();
    const m = M[mid]; if(!m) continue;
    // warp op deze tegel?
    for(const w of (m.warps||[])){
      if(w.x===x && w.y===y && (!w.requiresFlag || flags.has(w.requiresFlag))){
        const tk = key(w.targetMap, w.targetX, w.targetY);
        if(M[w.targetMap] && !seen.has(tk)){ seen.add(tk); reachedMaps.add(w.targetMap); q.push([w.targetMap,w.targetX,w.targetY]); }
      }
    }
    // buurtegels
    for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){
      const nx=x+dx, ny=y+dy, nk=key(mid,nx,ny);
      if(seen.has(nk)) continue;
      const t=(m.tiles[ny]||[])[nx];
      if(!tileWalkable(t)) continue;
      if(!blockers[mid]) blockers[mid] = new Set((m.npcs||[]).filter(npcBlocks).map(n=>n.x+','+n.y));
      if(blockers[mid].has(nx+','+ny)) continue;
      seen.add(nk); q.push([mid,nx,ny]);
    }
  }
  return { seen, reachedMaps };
}
function npcReachable(seen, mid, n){
  // aanspreekbaar: een buurtegel is bereikt (of hij staat over een balie — 74/76 ertussen)
  const m = M[mid];
  for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){
    if(seen.has(key(mid, n.x+dx, n.y+dy))) return true;
    const bt=(m.tiles[n.y+dy]||[])[n.x+dx];
    if((bt===74||bt===76) && seen.has(key(mid, n.x+2*dx, n.y+2*dy))) return true;
  }
  return false;
}

// ── saturatie: flags verzamelen tot niets meer verandert ─────
const beatenLeaders = new Set();
const badgeLog = [];
let rounds = 0;
for(;;){
  if(++rounds > 60){ add('FAIL','saturatie convergeert niet (>60 rondes)'); break; }
  const { seen, reachedMaps } = computeReachable();
  let changed = false;
  const grant = f => { if(f && !flags.has(f)){ flags.add(f); changed = true; } };

  for(const mid of reachedMaps){
    const m = M[mid];
    // map-events die flags zetten
    for(const ev of (m.events||[])){
      if(ev.flagSet && (!ev.flagRequired || flags.has(ev.flagRequired))) grant(ev.flagSet);
    }
    for(const n of (m.npcs||[])){
      const visible = (!n.requiresFlag || flags.has(n.requiresFlag)) && (!n.flagToHide || !flags.has(n.flagToHide));
      if(!visible || !npcReachable(seen, mid, n)) continue;
      // trainer verslaan
      const ref = n.trainerRef || n.trainerId;
      if(ref && DG.TRAINERS[ref] && !flags.has('TRAINER_'+ref+'_DEFEATED')){
        grant('TRAINER_'+ref+'_DEFEATED');
        const t = DG.TRAINERS[ref];
        if(t.isGymLeader && !beatenLeaders.has(ref)){
          beatenLeaders.add(ref); badges++;
          grant('BADGE_'+badges);
          if(HM_BY_BADGE[badges]) grant(HM_BY_BADGE[badges]);
          badgeLog.push(`badge ${badges}: ${t.name} (${mid})`);
        }
        if(ref==='ELITE_AURORA') grant('ELITE_1_DONE');
        if(ref==='ELITE_EMBER')  grant('ELITE_2_DONE');
        if(ref==='ELITE_GARNET') grant('ELITE_3_DONE');
        if(ref==='ELITE_PHANTOM')grant('ELITE_4_DONE');
        if(ref==='GRAND_ARCHON_CORVUS'){ grant('CHAMPION_DEFEATED'); grant('MEGA_AVAILABLE'); }
        if(ref==='DIRECTOR_CLADE') grant('DIRECTOR_CLADE_DEFEATED');
      }
      // quiz-vlaggen (gym-doolhof opent op quizCorrectFlag/quizDoneFlag)
      if(n.quizCorrectFlag) grant(n.quizCorrectFlag);
      if(n.quizDoneFlag)    grant(n.quizDoneFlag);
      if(n.quizWrongFlag)   grant(n.quizWrongFlag);
    }
  }
  if(!changed) break;
}

// ── assertions ───────────────────────────────────────────────
const { seen: finalSeen, reachedMaps: finalMaps } = computeReachable();
console.log('═══ Walkthrough-simulatie ═══');
badgeLog.forEach(b=>console.log('  '+b));
if(badges < 9) add('FAIL', `slechts ${badges}/9 badges haalbaar`);
['ELITE_1_DONE','ELITE_2_DONE','ELITE_3_DONE','ELITE_4_DONE','CHAMPION_DEFEATED','DIRECTOR_CLADE_DEFEATED']
  .forEach(f=>{ if(!flags.has(f)) add('FAIL', `eindspel-vlag niet haalbaar: ${f}`); });
['FOSSIL_CITADEL','FOSSIL_TRAINING_GROUNDS','MT_CRETACEOUS','DIRECTOR_CLADE_CHAMBER']
  .forEach(mid=>{ if(!finalMaps.has(mid)) add('FAIL', `map onbereikbaar: ${mid}`); });

// onbereikbare maps (eindstand) — ROUTE_1 is bekende legacy-alias
const KNOWN = new Set(['ROUTE_1']);
Object.keys(M).forEach(mid=>{ if(!finalMaps.has(mid) && !KNOWN.has(mid)) add('WARN', `map nooit bereikt: ${mid}`); });

// softlock-scan: heen-maar-niet-terug (map-niveau, eindstand-flags)
// terug-BFS: kan elke bereikte map AMBERTOWN weer bereiken via warps?
(function(){
  // bouw map-graaf: edge A->B als er een bereikbare warp A->B is
  const edges = {};
  for(const mid of finalMaps){ edges[mid]=new Set();
    for(const w of (M[mid].warps||[])){
      if((!w.requiresFlag || flags.has(w.requiresFlag)) && M[w.targetMap] &&
         finalSeen.has(key(mid,w.x,w.y))) edges[mid].add(w.targetMap);
    }
  }
  // kan map X terug naar AMBERTOWN?
  const canReturn = new Set(['AMBERTOWN']);
  let ch=true;
  while(ch){ ch=false;
    for(const mid of finalMaps){ if(canReturn.has(mid)) continue;
      if([...(edges[mid]||[])].some(t=>canReturn.has(t))){ canReturn.add(mid); ch=true; }
    }
  }
  for(const mid of finalMaps){ if(!canReturn.has(mid)) add('WARN', `mogelijk softlock: ${mid} heeft geen terugweg naar Ambertown`); }
})();

// ── rapport ──────────────────────────────────────────────────
const fails = issues.filter(i=>i.sev==='FAIL');
const warns = issues.filter(i=>i.sev==='WARN');
console.log(`\nBadges: ${badges}/9 | eindspel-vlaggen: ${['ELITE_4_DONE','CHAMPION_DEFEATED','DIRECTOR_CLADE_DEFEATED'].filter(f=>flags.has(f)).length}/3 | maps bereikt: ${finalMaps.size}/${Object.keys(M).length}`);
if(warns.length){ console.log('\nWARN:'); warns.forEach(i=>console.log('  - '+i.msg)); }
if(fails.length){ console.log('\nFAIL:'); fails.forEach(i=>console.log('  - '+i.msg)); process.exit(1); }
console.log('\n✅ storyline start→credits volledig haalbaar');
process.exit(0);

// Focused audit of FERNGROVE_GYM (grass gym). Run: node .claude/audit_grassgym.js
const fs = require('fs');
globalThis.window = globalThis;
function load(f){ (0,eval)(fs.readFileSync(f,'utf8')); }
['js/constants.js','js/data/moves.js','js/data/dinomons.js','js/data/trainers.js','js/data/maps.js','js/data/story.js']
  .forEach(load);

const M = DG.MAPS.FERNGROVE_GYM;
const T = DG.TRAINERS, S = DG.STORY && DG.STORY.DIALOGUES;
const out = [];
const log = (...a)=>out.push(a.join(' '));

// ---- tile helpers ----
const tile = (x,y)=> (M.tiles[y]||[])[x];
const solid = (t)=> t!==undefined && t>=64 && t!==68; // 68=door walkable
const inb = (x,y)=> y>=0&&y<M.tiles.length&&x>=0&&x<(M.tiles[y]||[]).length;

// occupancy from NPCs, honoring conditional visibility for a given flag-set
function occSet(flags){
  const occ = {};
  for (const n of M.npcs){
    // hidden when flagToHide is set; hidden when requiresFlag is NOT set
    if (n.flagToHide && flags.has(n.flagToHide)) continue;
    if (n.requiresFlag && !flags.has(n.requiresFlag)) continue;
    occ[n.x+','+n.y] = n;
  }
  return occ;
}
function bfs(sx,sy,flags){
  const occ = occSet(flags);
  const seen = new Set([sx+','+sy]);
  const q=[[sx,sy]];
  while(q.length){
    const [x,y]=q.shift();
    for(const [dx,dy] of [[0,1],[0,-1],[1,0],[-1,0]]){
      const nx=x+dx, ny=y+dy, k=nx+','+ny;
      if(!inb(nx,ny)||seen.has(k)) continue;
      if(solid(tile(nx,ny))) continue;
      if(occ[k]) continue; // NPC blocks
      seen.add(k); q.push([nx,ny]);
    }
  }
  return seen;
}

log('=== FERNGROVE_GYM audit ===');
log('size', M.width+'x'+M.height, 'tilesRows='+M.tiles.length, 'tileCols='+(M.tiles[0]||[]).length);

// entrance = warp tiles
const warpIn = M.warps.map(w=>`(${w.x},${w.y})->${w.targetMap} lock=${w.gymLock||'-'}`);
log('warps:', warpIn.join(' | '));
const entry = M.warps[0]; // player arrives adjacent; treat warp tile as start (door walkable)

// Leader position
const leader = M.npcs.find(n=>n.id==='GYM_LEADER_SYLVA');
log('leader at', leader? `(${leader.x},${leader.y})`:'MISSING', 'name(npc)='+(leader&&leader.name));
log('leader trainer name=', T.GYM_SYLVA && T.GYM_SYLVA.name, 'party size='+(T.GYM_SYLVA?T.GYM_SYLVA.party.length:'?'));

// Reachability scenarios. We start the BFS from the tile just above the door.
const startX = entry.x, startY = entry.y-1;
log('\n-- start tile', `(${startX},${startY})`, 'tile='+tile(startX,startY));

function scenario(name, flags){
  const reach = bfs(startX,startY,flags);
  const canLeader = leader && [[0,1],[0,-1],[1,0],[-1,0]].some(([dx,dy])=>reach.has((leader.x+dx)+','+(leader.y+dy)));
  log(`\n[${name}] reachable tiles=${reach.size} | canReachLeader=${canLeader}`);
  return reach;
}

// All correct: every stage answered right (left path gates open)
const allCorrect = new Set(['GYM_SYLVA_S1_CORRECT','GYM_SYLVA_S1_DONE','GYM_SYLVA_S2_CORRECT','GYM_SYLVA_S2_DONE','GYM_SYLVA_S3_CORRECT','GYM_SYLVA_S3_DONE']);
scenario('all correct', allCorrect);
// All wrong: right path gates open
const allWrong = new Set(['GYM_SYLVA_S1_WRONG','GYM_SYLVA_S1_DONE','GYM_SYLVA_S2_WRONG','GYM_SYLVA_S2_DONE','GYM_SYLVA_S3_WRONG','GYM_SYLVA_S3_DONE']);
scenario('all wrong', allWrong);
// No answers yet: fresh entry, can you reach the first quiz NPC?
const fresh = scenario('fresh (no flags)', new Set());

// Mixed: S1 correct, S2 wrong, S3 correct
scenario('mixed C/W/C', new Set(['GYM_SYLVA_S1_CORRECT','GYM_SYLVA_S1_DONE','GYM_SYLVA_S2_WRONG','GYM_SYLVA_S2_DONE','GYM_SYLVA_S3_CORRECT','GYM_SYLVA_S3_DONE']));

// ---- visualize reachability for all-correct ----
function viz(flags, label){
  const reach = bfs(startX,startY,flags);
  const occ = occSet(flags);
  log('\nMAP ['+label+']  . =reachable  # =solid  N =npc/gate  ? =unreachable-floor  L=leader');
  for(let y=0;y<M.tiles.length;y++){
    let s='';
    for(let x=0;x<(M.tiles[y]||[]).length;x++){
      const k=x+','+y;
      const t=tile(x,y);
      if(occ[k]) s+= (occ[k].id&&/LEADER/.test(occ[k].id))?'L':'N';
      else if(solid(t)) s+='#';
      else if(reach.has(k)) s+='.';
      else s+='?';
    }
    log(('  y'+y).padEnd(5)+s);
  }
}
// realistic full playthroughs (mark trainers defeated as you'd beat them)
const realCorrect = new Set([
  'GYM_SYLVA_S1_CORRECT','GYM_SYLVA_S1_DONE','TRAINER_SYLVA_S1_TC_DEFEATED',
  'GYM_SYLVA_S2_CORRECT','GYM_SYLVA_S2_DONE','TRAINER_SYLVA_S2_TC_DEFEATED',
  'GYM_SYLVA_S3_CORRECT','GYM_SYLVA_S3_DONE','TRAINER_SYLVA_S3_TC_DEFEATED',
]);
const realWrong = new Set([
  'GYM_SYLVA_S1_WRONG','GYM_SYLVA_S1_DONE','TRAINER_SYLVA_S1_TW1_DEFEATED','TRAINER_SYLVA_S1_TW2_DEFEATED',
  'GYM_SYLVA_S2_WRONG','GYM_SYLVA_S2_DONE','TRAINER_SYLVA_S2_TW1_DEFEATED','TRAINER_SYLVA_S2_TW2_DEFEATED',
  'GYM_SYLVA_S3_WRONG','GYM_SYLVA_S3_DONE','TRAINER_SYLVA_S3_TW1_DEFEATED','TRAINER_SYLVA_S3_TW2_DEFEATED',
]);
scenario('REAL correct path (trainers beaten)', realCorrect);
scenario('REAL wrong path (trainers beaten)', realWrong);
viz(realCorrect,'real correct');
viz(realWrong,'real wrong');
viz(allCorrect,'all correct');

// ---- can fresh player reach each quiz NPC to even answer? ----
for (const q of ['GYM_SYLVA_S1_QUIZ','GYM_SYLVA_S2_QUIZ','GYM_SYLVA_S3_QUIZ']){
  const n = M.npcs.find(x=>x.id===q);
  // a quiz is answerable if some adjacent tile is reachable given the prior stage solved
}

// ---- trainer refs exist & flag naming consistency ----
log('\n-- trainerRef + flag checks --');
for (const n of M.npcs){
  if (n.trainerRef){
    const t=T[n.trainerRef];
    if(!t) log('  MISSING trainer', n.trainerRef, 'on npc', n.id);
    // the engine sets TRAINER_<ref>_DEFEATED; npc.flagToHide should match
    const expected = 'TRAINER_'+n.trainerRef+'_DEFEATED';
    if (n.flagToHide && n.flagToHide!==expected)
      log('  FLAG MISMATCH', n.id, 'flagToHide='+n.flagToHide, 'expected='+expected);
  }
}

// ---- quiz correctness vs lore ----
log('\n-- quiz answers --');
M.npcs.filter(n=>n.onInteract==='TRIGGER_GYM_QUIZ').forEach(n=>{
  log('  Q:', n.quizQuestion, '| correct(optA)=', n.quizOptionA, '| wrong=', JSON.stringify(n.quizWrong));
});

// ---- name consistency: scan dialogue strings the player sees ----
log('\n-- name "Sylva" appearances player can read --');
const friend = T.GYM_SYLVA.name;
log('  battle name =', friend);
M.npcs.forEach(n=>{
  (n.dialogue||[]).forEach(d=>{ if(typeof d==='string' && /sylva/i.test(d)) log('   npc',n.id,'dialogue:', JSON.stringify(d)); });
});
Object.keys(T).filter(k=>k.startsWith('SYLVA_')||k==='GYM_SYLVA').forEach(k=>{
  const t=T[k];
  ['loseDialogue','winDialogue'].forEach(f=>{ if(t[f]&&/sylva/i.test(t[f])) log('   trainer',k,f+':',JSON.stringify(t[f])); });
});

console.log(out.join('\n'));

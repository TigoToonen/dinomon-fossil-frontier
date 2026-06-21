// ════════════════════════════════════════════════════════════════
// DinoMon — game integrity validator (self-check feedback loop)
// Loads the pure-data modules headless and checks for the kinds of bugs
// that break progression: broken routes, wrong numbering, unreachable
// areas, ungated gyms (walk past without the badge), bad references.
// Run:  node validate_game.js
// ════════════════════════════════════════════════════════════════
const fs = require('fs');
globalThis.window = globalThis;
function load(f) { (0, eval)(fs.readFileSync(f, 'utf8')); }
load('js/constants.js');
load('js/data/moves.js');
load('js/data/dinomons.js');
load('js/data/trainers.js');
load('js/data/maps.js');

const MAPS = DG.MAPS, SPECIES = DG.SPECIES, MOVES = DG.MOVES, TRAINERS = DG.TRAINERS;
const issues = [];
const add = (cat, msg) => issues.push({ cat, msg });

const tileAt = (m, x, y) => (m.tiles && m.tiles[y]) ? m.tiles[y][x] : undefined;
const isSolid = t => (t >= 64 && t !== 68);          // 68 = door (walkable warp)
const warpDest = w => w.targetMap || w.mapId;
const warpX = w => (w.targetX !== undefined ? w.targetX : w.destX);
const warpY = w => (w.targetY !== undefined ? w.targetY : w.destY);

// ── 1. Warp targets exist + entrance steppable + spawn walkable ──
for (const id in MAPS) {
  const m = MAPS[id];
  for (const w of (m.warps || [])) {
    const dst = warpDest(w);
    if (!MAPS[dst]) { add('WARP_MISSING', `${id} warp(${w.x},${w.y}) -> ${dst} (no such map)`); continue; }
    if (m.tiles) {
      const t = tileAt(m, w.x, w.y);
      if (t === undefined) add('ENTRANCE_OOB', `${id} warp at (${w.x},${w.y}) out of bounds`);
      else if (isSolid(t)) add('ENTRANCE_SOLID', `${id} warp(${w.x},${w.y}) on solid tile ${t} -> ${dst} (can't step on)`);
    }
    const d = MAPS[dst];
    if (d && d.tiles) {
      const dt = tileAt(d, warpX(w), warpY(w));
      if (dt !== undefined && isSolid(dt)) add('SPAWN_SOLID', `${id} -> ${dst} spawn (${warpX(w)},${warpY(w)}) solid tile ${dt}`);
    }
  }
}

// ── 2. Reachability from AMBERTOWN over the warp graph ──
const START = 'AMBERTOWN';
const reach = new Set([START]);
let frontier = [START];
while (frontier.length) {
  const next = [];
  for (const id of frontier) {
    const m = MAPS[id]; if (!m) continue;
    for (const w of (m.warps || [])) {
      const d = warpDest(w);
      if (MAPS[d] && !reach.has(d)) { reach.add(d); next.push(d); }
    }
  }
  frontier = next;
}
const REACH_WHITELIST = new Set(['ROUTE_1']); // legacy save-compat alias map
for (const id in MAPS) {
  if (!reach.has(id) && !REACH_WHITELIST.has(id)) add('UNREACHABLE', `${id} cannot be reached from ${START}`);
}

// ── 3. One-way warps (A->B with no B->A) — can strand the player ──
function hasWarpTo(fromId, toId) {
  const m = MAPS[fromId]; if (!m) return false;
  return (m.warps || []).some(w => warpDest(w) === toId);
}
for (const id in MAPS) {
  const seen = new Set();
  for (const w of (MAPS[id].warps || [])) {
    const d = warpDest(w);
    if (!MAPS[d] || seen.has(d)) continue; seen.add(d);
    if (!hasWarpTo(d, id)) add('ONE_WAY', `${id} -> ${d} has no return warp`);
  }
}

// ── 4. Trainer party species + moves valid ──
const validMoves = new Set(Object.keys(MOVES));
for (const tid in TRAINERS) {
  const t = TRAINERS[tid];
  for (const p of (t.party || [])) {
    if (!SPECIES[p.speciesId]) add('TRAINER_SPECIES', `${tid}: unknown species ${p.speciesId}`);
    for (const mv of (p.moves || [])) if (!validMoves.has(mv)) add('TRAINER_MOVE', `${tid}/${p.speciesId}: unknown move ${mv}`);
  }
}

// ── 5. Encounter tables: species exist ──
for (const id in MAPS) {
  const et = MAPS[id].encounterTable;
  if (!et) continue;
  for (const k of Object.keys(et)) {
    for (const e of (et[k] || [])) if (!SPECIES[e.speciesId]) add('ENCOUNTER_SPECIES', `${id}.${k}: unknown species ${e.speciesId}`);
  }
}

// ── 6. Evolution chains valid ──
for (const sid in SPECIES) {
  const s = SPECIES[sid];
  if (s.evolvesTo && !SPECIES[s.evolvesTo]) add('EVO_TARGET', `${sid} evolvesTo missing ${s.evolvesTo}`);
  if (s.prevForm && !SPECIES[s.prevForm]) add('EVO_PREV', `${sid} prevForm missing ${s.prevForm}`);
  for (const l of (s.learnset || [])) {
    const mv = l.move;
    const arr = Array.isArray(mv) ? mv : [mv];
    for (const m of arr) if (!validMoves.has(m)) add('LEARN_MOVE', `${sid} learnset unknown move ${m}`);
  }
}

// ── 7. Gym gating (spec-based): every FORWARD exit from a gym town must be
// gated by that town's badge, so you can't walk past without beating the gym.
// Update GATING when the gym order changes (e.g. inserting the Fairy gym).
const GATING = {
  SHELLCREEK_CITY: { badge: 'BADGE_1', forward: ['ROUTE_2A'] },
  DUSTWALL_TOWN:   { badge: 'BADGE_2', forward: ['ROUTE_3A'] },
  PYRESIDE_CITY:   { badge: 'BADGE_3', forward: ['ROUTE_4A'] },
  FERNGROVE_TOWN:  { badge: 'BADGE_4', forward: ['ROUTE_5A'] },
  STONEHAVEN_CITY: { badge: 'BADGE_5', forward: ['ROUTE_6A', 'ROUTE_7A'] },
  CRESTFALL_TOWN:  { badge: 'BADGE_6', forward: ['ROUTE_8A'] },
  BOGMIRE_CITY:    { badge: 'BADGE_7', forward: ['ROUTE_9A'] },
  APEXSUMMIT:      { badge: 'BADGE_8', forward: ['MT_CRETACEOUS', 'FOSSIL_GATEWAY'] },
};
for (const town in GATING) {
  const m = MAPS[town];
  if (!m) { add('GYM_GATING', `${town} (in spec) does not exist`); continue; }
  const { badge, forward } = GATING[town];
  for (const fwd of forward) {
    const ws = (m.warps || []).filter(w => warpDest(w) === fwd);
    if (ws.length === 0) { add('GYM_GATING', `${town}: no warp to forward target ${fwd}`); continue; }
    for (const w of ws) {
      if (w.requiresFlag !== badge) {
        add('GYM_UNGATED', `${town} -> ${fwd} (${w.x},${w.y}) requiresFlag=${w.requiresFlag || '-'} (expected ${badge}) — walk-past risk`);
      }
    }
  }
}

// ── Report ──
const cats = {};
for (const it of issues) (cats[it.cat] = cats[it.cat] || []).push(it.msg);
console.log('═══ DinoMon game validation ═══');
console.log(`Maps:${Object.keys(MAPS).length} Species:${Object.keys(SPECIES).length} Moves:${Object.keys(MOVES).length} Trainers:${Object.keys(TRAINERS).length}`);
const order = ['WARP_MISSING','ENTRANCE_OOB','ENTRANCE_SOLID','SPAWN_SOLID','UNREACHABLE','TRAINER_SPECIES','TRAINER_MOVE','ENCOUNTER_SPECIES','EVO_TARGET','EVO_PREV','LEARN_MOVE','GYM_UNGATED','GYM_GATING','ONE_WAY'];
for (const c of order) {
  if (!cats[c]) continue;
  console.log(`\n[${c}] ${cats[c].length}`);
  for (const m of cats[c].slice(0, 40)) console.log('  - ' + m);
  if (cats[c].length > 40) console.log(`  ... +${cats[c].length - 40} more`);
}
const blocking = issues.filter(i => i.cat !== 'ONE_WAY').length;  // ONE_WAY is informational
console.log(`\nTOTAL issues: ${issues.length} (blocking: ${blocking}, info ONE_WAY: ${issues.length - blocking})`);

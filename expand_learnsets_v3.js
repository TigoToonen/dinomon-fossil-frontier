/**
 * expand_learnsets_v3.js
 * Rebuilds every learnset in dinomons.js with auto-generated type pools from moves.js.
 * Targets: Stage1=8, Stage2=11, Stage3=14, Legendary=15
 * Adds randomizer slots at key level thresholds.
 * Fixes all invalid move references.
 */
const fs = require('fs');

// ── 1. Build move pools from moves.js ───────────────────────────────
const moveSrc = fs.readFileSync('./js/data/moves.js', 'utf8');
const VALID = new Set();
const POOLS = {};
// power tiers: early ≤50, mid 51-90, late >90, status = STATUS category

// Use line-by-line extraction to handle both multi-line and single-line move formats
const moveLines = moveSrc.split('\n');
let curMoveId = null, curMoveText = '';
function flushMove() {
  if (!curMoveId || curMoveId === 'DG') { curMoveId = null; curMoveText = ''; return; }
  const type  = (curMoveText.match(/type:\s*'([^']+)'/)    || [])[1];
  const power = parseInt((curMoveText.match(/power:\s*(\d+)/) || [,0])[1]) || 0;
  const cat   = (curMoveText.match(/category:\s*'([^']+)'/) || [])[1];
  VALID.add(curMoveId);
  if (type) {
    if (!POOLS[type]) POOLS[type] = { early:[], mid:[], late:[], status:[] };
    if (cat === 'STATUS')  POOLS[type].status.push(curMoveId);
    else if (power <= 50)  POOLS[type].early.push(curMoveId);
    else if (power <= 90)  POOLS[type].mid.push(curMoveId);
    else                   POOLS[type].late.push(curMoveId);
  }
  curMoveId = null; curMoveText = '';
}
for (const line of moveLines) {
  const startM = line.match(/^\s{2}([A-Z_0-9]+):\s*\{/);
  if (startM) {
    flushMove();
    curMoveId = startM[1];
    curMoveText = line;
    // Single-line move (ends with } or },)
    if (/\}[,]?\s*$/.test(line) && (line.match(/\{/g)||[]).length === (line.match(/\}/g)||[]).length) {
      flushMove();
    }
  } else if (curMoveId) {
    curMoveText += '\n' + line;
    // Check if this closes the move object
    const opens = (curMoveText.match(/\{/g)||[]).length;
    const closes = (curMoveText.match(/\}/g)||[]).length;
    if (closes >= opens && closes > 0) flushMove();
  }
}
flushMove();
console.log('Valid moves:', VALID.size, '| Types covered:', Object.keys(POOLS).length);

// Universal status moves good for any species
const UNIV_STATUS = ['LEER','GROWL','SMOKESCREEN','TAIL_WHIP','WORK_UP',
  'SWORDS_DANCE','DRAGON_DANCE','BULK_UP','CALM_MIND','NASTY_PLOT',
  'IRON_DEFENSE','ROCK_POLISH','COIL','COTTON_GUARD','CHARGE',
  'TAILWIND','RECOVER','SYNTHESIS'].filter(id => VALID.has(id));

// ── 2. Parse _ls() text into entries ────────────────────────────────
function parseLs(text) {
  const entries = [];
  const toks = [];
  let i = 0;
  while (i < text.length) {
    if (text[i] === "'") {
      const end = text.indexOf("'", i+1);
      if (end === -1) { i++; continue; }
      toks.push(text.slice(i+1, end));
      i = end + 1;
    } else if (text[i] === '[') {
      const end = text.indexOf(']', i);
      if (end === -1) { i++; continue; }
      const inner = text.slice(i+1, end).replace(/'/g,'').split(',').map(s=>s.trim()).filter(Boolean);
      toks.push(inner);
      i = end + 1;
    } else if (/\d/.test(text[i])) {
      let j = i;
      while (j < text.length && /\d/.test(text[j])) j++;
      toks.push(parseInt(text.slice(i,j)));
      i = j;
    } else {
      i++;
    }
  }
  for (let k = 0; k+1 < toks.length; k+=2) {
    if (typeof toks[k] === 'number') entries.push({ level: toks[k], move: toks[k+1] });
  }
  return entries;
}

// ── 3. Build _ls() text from entries ────────────────────────────────
function buildLs(entries) {
  const pairs = entries.map(e => {
    if (Array.isArray(e.move)) return `${e.level},['${e.move.join("','")}']`;
    return `${e.level},'${e.move}'`;
  });
  const lines = [];
  for (let i = 0; i < pairs.length; i += 4) {
    lines.push('    ' + pairs.slice(i,i+4).join(','));
  }
  return `_ls(\n${lines.join(',\n')}\n  )`;
}

// ── 4. Expand learnset ───────────────────────────────────────────────
function expandLearnset(existing, types, stage, legendary) {
  const target = legendary ? 15 : stage === 1 ? 8 : stage === 2 ? 11 : 14;

  // Filter existing to valid-only, keep first coreMax valid entries
  const coreMax = stage === 1 ? 3 : stage === 2 ? 4 : 5;
  const validExisting = existing.filter(e => {
    if (Array.isArray(e.move)) {
      e.move = e.move.filter(id => VALID.has(id));
      return e.move.length >= 2;
    }
    return VALID.has(e.move);
  });
  const core = validExisting.slice(0, coreMax);

  const chosen = new Set();
  for (const e of core) {
    if (Array.isArray(e.move)) e.move.forEach(id => chosen.add(id));
    else chosen.add(e.move);
  }

  const p1 = POOLS[types[0]] || POOLS.NORMAL;
  const p2 = types[1] ? (POOLS[types[1]] || {}) : {};

  function pick(pool) {
    for (const id of pool) {
      if (VALID.has(id) && !chosen.has(id)) { chosen.add(id); return id; }
    }
    return null;
  }

  // Priority-ordered move sequence for progression
  const seq = [
    ...(p1.early || []),
    ...UNIV_STATUS,
    ...(p2.early || []),
    ...(p1.mid   || []),
    ...(p1.status|| []),
    ...(p2.mid   || []),
    ...(p2.status|| []),
    ...(p1.late  || []),
    ...(p2.late  || []),
    // fallback: repeat pools to ensure enough
    ...(p1.early || []),
    ...(p1.mid   || []),
    ...(p1.late  || []),
  ];

  // Level schedule by stage
  const lvls = {
    1:   [1, 5, 9, 14, 20, 28, 36, 46],
    2:   [1, 5, 10, 16, 22, 28, 34, 40, 48, 56, 64],
    3:   [1, 5, 10, 16, 22, 28, 34, 40, 46, 52, 58, 64, 70, 78],
    leg: [1, 5, 10, 15, 22, 30, 38, 46, 54, 62, 70, 78, 86, 94, 100],
  };
  const levelList = legendary ? lvls.leg : lvls[Math.min(stage, 3)];
  const usedLevels = new Set(core.map(e => e.level));
  const availLevels = levelList.filter(l => !usedLevels.has(l));

  const result = [...core];
  const movesNeeded = target - result.length;
  let lvIdx = 0;

  for (let added = 0; added < movesNeeded && lvIdx < availLevels.length; lvIdx++) {
    const id = pick(seq);
    if (!id) break;
    result.push({ level: availLevels[lvIdx], move: id });
    added++;
  }

  result.sort((a, b) => a.level - b.level);

  // ── 5. Add randomizer slots ─────────────────────────────────────
  function addRandSlot(targetLv, pool) {
    if (result.find(e => Array.isArray(e.move) && Math.abs(e.level - targetLv) <= 5)) return;
    const avail = pool.filter(id => VALID.has(id) && !chosen.has(id)).slice(0, 4);
    if (avail.length < 2) return;
    avail.forEach(id => chosen.add(id));
    let insertLv = targetLv;
    while (result.find(e => e.level === insertLv)) insertLv++;
    let idx = result.findIndex(e => e.level > insertLv);
    if (idx === -1) idx = result.length;
    result.splice(idx, 0, { level: insertLv, move: avail });
  }

  const rand1 = [...(p1.mid||[]), ...(p1.late||[])];
  const rand2 = [...(p2.mid||[]), ...(p2.late||[])];
  const randAll = [...new Set([...rand1, ...rand2, ...(p1.early||[])])];

  if (stage === 1) {
    addRandSlot(10, [...(p1.mid||[]), ...(p2.early||[]), ...(p1.early||[])]);
  } else if (stage === 2) {
    addRandSlot(24, [...(p1.mid||[]), ...(p2.mid||[])]);
  } else { // stage 3 or legendary
    addRandSlot(40, rand1);
    addRandSlot(54, [...(p1.late||[]), ...(p2.late||[]), ...(p1.mid||[])]);
  }

  result.sort((a, b) => a.level - b.level);
  return result;
}

// ── 6. Build stage + legendary maps ─────────────────────────────────
const LEGENDARY_IDS = new Set(['CRATERON','GLACIODON','PRIMORDIA','MEGAVORE','TITANREX']);

let src = fs.readFileSync('./js/data/dinomons.js', 'utf8');

// type map
const typeMap = {};
for (const [, id, typesStr] of src.matchAll(/_sp\(\s*'([A-Z_]+)'\s*,[^,]+,\s*\[([^\]]*)\]/g)) {
  typeMap[id] = typesStr.replace(/'/g,'').split(',').map(s=>s.trim()).filter(Boolean);
}

// stage map using the reliable pattern: after _ls(), check evolvesTo and prevForm
const stageMap = {};
const stagePat = /_sp\(\s*'([A-Z_]+)'[\s\S]*?_ls\([\s\S]*?\)\s*,\s*([^,\n]+),\s*[^,\n]+,\s*([^,\n]+),/g;
let sm;
while ((sm = stagePat.exec(src)) !== null) {
  const id = sm[1];
  const evolvesTo = sm[2].trim();
  const prevForm  = sm[3].trim();
  const hasEvo  = evolvesTo !== 'null';
  const hasPrev = prevForm  !== 'null';
  if (LEGENDARY_IDS.has(id)) { stageMap[id] = 3; continue; }
  if      (hasEvo && !hasPrev) stageMap[id] = 1;
  else if (hasEvo &&  hasPrev) stageMap[id] = 2;
  else if (!hasEvo && hasPrev) stageMap[id] = 3;
  else                          stageMap[id] = 1; // single-stage
}

const stageDist = {1:0,2:0,3:0};
for (const s of Object.values(stageMap)) stageDist[s]++;
console.log('Stage distribution:', stageDist, '| Legendary:', LEGENDARY_IDS.size);

// ── 7. Replace each _ls() using line-based parser ───────────────────
const lines = src.split('\n');
const out = [];
let curId = null;
let inLs = false, lsBuf = '', lsDepth = 0, lsBeforeLine = '';
let replacements = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // Detect species start
  const spM = line.match(/_sp\(\s*'([A-Z_]+)'/);
  if (spM) curId = spM[1];

  if (!inLs && line.includes('_ls(') && !line.includes('function _ls(')) {
    const lsIdx = line.indexOf('_ls(');
    const before = line.slice(0, lsIdx);
    const after  = line.slice(lsIdx + 4);

    let depth = 1, buf = after;
    // Quick single-line check
    let closePos = -1;
    for (let ci = 0; ci < buf.length; ci++) {
      if (buf[ci] === '(') depth++;
      else if (buf[ci] === ')') { depth--; if (depth === 0) { closePos = ci; break; } }
    }

    if (closePos !== -1) {
      // Single-line _ls
      const inner = buf.slice(0, closePos);
      const rest  = buf.slice(closePos + 1);
      const types = typeMap[curId]  || ['NORMAL'];
      const stage = stageMap[curId] || 1;
      const legendary = LEGENDARY_IDS.has(curId);
      const expanded = expandLearnset(parseLs(inner), types, stage, legendary);
      out.push(before + buildLs(expanded) + rest);
      replacements++;
      continue;
    }

    // Multi-line
    inLs = true;
    lsBuf = after;
    lsDepth = depth;
    lsBeforeLine = before;
    out.push('###LS_PLACEHOLDER###');
    continue;
  }

  if (inLs) {
    lsBuf += '\n' + line;
    for (const ch of line) {
      if (ch === '(') lsDepth++;
      else if (ch === ')') lsDepth--;
    }
    if (lsDepth <= 0) {
      const closePos = lsBuf.lastIndexOf(')');
      const inner = lsBuf.slice(0, closePos);
      const rest  = lsBuf.slice(closePos + 1);
      const types = typeMap[curId]  || ['NORMAL'];
      const stage = stageMap[curId] || 1;
      const legendary = LEGENDARY_IDS.has(curId);
      const expanded = expandLearnset(parseLs(inner), types, stage, legendary);
      const newLs = buildLs(expanded) + rest;
      // Replace placeholder
      for (let pi = out.length - 1; pi >= 0; pi--) {
        if (out[pi] === '###LS_PLACEHOLDER###') { out[pi] = lsBeforeLine + newLs; break; }
      }
      inLs = false; lsBuf = ''; lsDepth = 0;
      replacements++;
    }
    continue;
  }

  out.push(line);
}

const finalSrc = out.join('\n').replace(/dinomons\.js v\d+/, 'dinomons.js v9');
fs.writeFileSync('./js/data/dinomons.js', finalSrc, 'utf8');
console.log(`Replaced ${replacements} learnsets → dinomons.js v9`);

// ── 8. Validate output ───────────────────────────────────────────────
const outSrc = fs.readFileSync('./js/data/dinomons.js', 'utf8');
const spLsPat2 = /_sp\(\s*'([A-Z_]+)'[\s\S]*?_ls\(([\s\S]*?)\)(?=\s*\n\s*,)/g;
let vm;
const results = { 1:[], 2:[], 3:[] };
let invalid = 0, totalRand = 0;

while ((vm = spLsPat2.exec(outSrc)) !== null) {
  const id = vm[1];
  const entries = parseLs(vm[2]);
  const stage = stageMap[id] || 1;
  const cnt = entries.filter(e => !Array.isArray(e.move)).length;
  const rnd = entries.filter(e => Array.isArray(e.move)).length;
  results[stage].push({ id, cnt, rnd });
  totalRand += rnd;
  for (const e of entries) {
    const ids = Array.isArray(e.move) ? e.move : [e.move];
    ids.forEach(mid => { if (!VALID.has(mid)) { invalid++; console.log(' INVALID:', id, mid); }});
  }
}

for (const [stage, arr] of Object.entries(results)) {
  if (!arr.length) continue;
  const cnts = arr.map(v=>v.cnt);
  const avg = (cnts.reduce((a,b)=>a+b,0)/cnts.length).toFixed(1);
  const mn = Math.min(...cnts), mx = Math.max(...cnts);
  const tgt = stage==1?8:stage==2?11:14;
  const under = cnts.filter(c=>c<tgt-1).length;
  console.log(`Stage ${stage} (${arr.length} species): avg=${avg}, min=${mn}, max=${mx}, tgt=${tgt}, under=${under}`);
}
console.log(`Total rand slots: ${totalRand}, Invalid refs: ${invalid}`);

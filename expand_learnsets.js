/**
 * expand_learnsets.js v2 — text-based parser for dinomons.js
 * Expands every learnset to hit stage targets and adds randomizer slots.
 */
const fs = require('fs');

// ── Load valid move IDs ────────────────────────────────────────────
const DG = {};
eval(fs.readFileSync('./js/data/moves.js','utf8')
  .replace(/window\.DG\s*=\s*window\.DG\s*\|\|\s*\{\};/,'')
  .replace(/\bwindow\.DG\b/g,'DG'));
const VALID = new Set(Object.keys(DG.MOVES || {}));
const v = (...ids) => ids.filter(id => VALID.has(id));

// ── Move pools per type ─────────────────────────────────────────────
const POOLS = {
  FIRE:     { early:v('EMBER','FIRE_SPIN','FIRE_FANG','WILL_O_WISP'),
              mid:  v('FLAME_CHARGE','FLAMETHROWER','LAVA_PLUME','INCINERATE','BLAZE_KICK','FIERY_DANCE','SCORCHING_SANDS','SUNNY_DAY','HEAT_WAVE','MYSTICAL_FIRE'),
              late: v('FIRE_BLAST','OVERHEAT','MAGMA_STORM','INFERNO','PYRO_BALL','BURN_UP','ERUPTION') },
  WATER:    { early:v('WATER_GUN','BUBBLE','AQUA_JET','CLAMP'),
              mid:  v('WATERFALL','SURF','SCALD','BRINE','LIQUIDATION','RAIN_DANCE','SPARKLING_ARIA','WHIRLPOOL','CRABHAMMER'),
              late: v('HYDRO_PUMP','AQUA_TAIL','WATER_SPOUT','ORIGIN_PULSE','MUDDY_WATER') },
  GRASS:    { early:v('VINE_WHIP','RAZOR_LEAF','MAGICAL_LEAF','BULLET_SEED'),
              mid:  v('ENERGY_BALL','MEGA_DRAIN','GIGA_DRAIN','LEECH_SEED','SYNTHESIS','SPORE','TROP_KICK','INGRAIN','COTTON_GUARD'),
              late: v('SOLAR_BEAM','LEAF_STORM','PETAL_DANCE','POWER_WHIP','SOLAR_BLADE') },
  ELECTRIC: { early:v('THUNDER_SHOCK','NUZZLE','ELECTROWEB','SPARK'),
              mid:  v('THUNDER_WAVE','THUNDERBOLT','DISCHARGE','CHARGE','EERIE_IMPULSE','MAGNETIC_FLUX','RISING_VOLTAGE','PARABOLIC_CHARGE'),
              late: v('THUNDER','VOLT_TACKLE','WILD_CHARGE','ZAP_CANNON') },
  ICE:      { early:v('ICE_SHARD','POWDER_SNOW','AURORA_BEAM'),
              mid:  v('HAIL','GLACIATE','ICE_BEAM','ICE_PUNCH','FREEZE_DRY','AURORA_VEIL','SNOWSCAPE','FROST_BREATH','TRIPLE_AXEL'),
              late: v('BLIZZARD','ICICLE_CRASH','ICE_HAMMER') },
  DRAGON:   { early:v('DRAGON_BREATH','BREAKING_SWIPE','DRAGON_RAGE'),
              mid:  v('DRAGON_CLAW','DRAGON_DARTS','DRAGON_PULSE','SCALE_SHOT','CLANGING_SCALES'),
              late: v('OUTRAGE','DRAGON_RUSH','SPACIAL_REND','DRACO_METEOR','ROAR_OF_TIME','ETERNABEAM') },
  PSYCHIC:  { early:v('CONFUSION','PSYBEAM'),
              mid:  v('PSYCHIC_MOVE','PSYSHOCK','LIGHT_SCREEN','REFLECT','MIND_FOCUS','EXTRASENSORY','TRICK','FUTURE_SIGHT'),
              late: v('FUTURE_SIGHT','PSYSHOCK') },
  DARK:     { early:v('BITE','SNARL','SHADOW_SNEAK','ASSURANCE'),
              mid:  v('CRUNCH','DARK_PULSE','SUCKER_PUNCH','THROAT_CHOP','NIGHT_SLASH','EMBARGO','SNARL_BLAST','PARTING_SHOT'),
              late: v('FOUL_PLAY','BEAT_UP') },
  GHOST:    { early:v('SHADOW_SNEAK','HEX'),
              mid:  v('SHADOW_BALL','PHANTOM_FORCE','CURSE_MOVE','TRICK_OR_TREAT','DESTINY_BOND'),
              late: v('POLTERGEIST','SHADOW_BALL') },
  ROCK:     { early:v('ROCK_THROW','ROLLOUT','ROCK_TOMB'),
              mid:  v('ROCK_SLIDE','STEALTH_ROCK','ANCIENT_POWER','POWER_GEM','ROCK_BLAST','ROCK_POLISH','SMASH_DOWN','WIDE_GUARD'),
              late: v('STONE_EDGE','SKULL_SLAM') },
  GROUND:   { early:v('SAND_ATTACK','BULLDOZE','MUDSLAP','MUD_SHOT'),
              mid:  v('EARTHQUAKE','MUD_BOMB','MAGNITUDE','BONE_RUSH','BONEMERANG','STEALTH_ROCK','HIGH_HORSEPOWER'),
              late: v('EARTHQUAKE','FISSURE') },
  STEEL:    { early:v('METAL_CLAW','BULLET_PUNCH','SMART_STRIKE'),
              mid:  v('IRON_HEAD','IRON_DEFENSE','IRON_TAIL','FLASH_CANNON','GYRO_BALL','STEEL_ROLLER'),
              late: v('STEEL_BEAM','STEEL_ROLLER') },
  FIGHTING: { early:v('KARATE_CHOP','MACH_PUNCH','VACUUM_WAVE'),
              mid:  v('SUBMISSION','CROSS_CHOP','DRAIN_PUNCH','AURA_SPHERE','DYNAMIC_PUNCH'),
              late: v('CLOSE_COMBAT','SUPERPOWER','COLLISION_COURSE') },
  POISON:   { early:v('POISON_STING','ACID','SLUDGE','ACID_SPRAY'),
              mid:  v('TOXIC','SLUDGE_BOMB','VENOSHOCK','CROSS_POISON','POISON_JAB','GASTRO_ACID','COIL'),
              late: v('GUNK_SHOT','VENOSHOCK') },
  FLYING:   { early:v('GUST','WING_ATTACK'),
              mid:  v('AERIAL_ACE','AIR_SLASH','FLY','ROOST','TAILWIND','DEFOG'),
              late: v('HURRICANE','BRAVE_BIRD') },
  BUG:      { early:v('FURY_CUTTER','LUNGE'),
              mid:  v('SILVER_WIND','BUG_BUZZ','LEECH_LIFE','U_TURN','WING_DANCE','ATTACK_ORDER'),
              late: v('ATTACK_ORDER','BUG_BUZZ') },
  FAIRY:    { early:v('DISARMING_VOICE','BABY_DOLL_EYES','SWEET_KISS'),
              mid:  v('DRAINING_KISS','DAZZLING_GLEAM','CHARM','MISTY_TERRAIN','PLAY_ROUGH'),
              late: v('MOONBLAST','LIGHT_OF_RUIN') },
  NORMAL:   { early:v('TACKLE','SCRATCH','POUND','QUICK_ATTACK','QUICK_STRIKE','ECHOED_VOICE'),
              mid:  v('HEADBUTT','BODY_SLAM','SMOKESCREEN','SLAM_DOWN','WORK_UP','RECOVER','RAPID_SPIN','HYPER_VOICE'),
              late: v('DOUBLE_EDGE','HYPER_BEAM','LAST_RESORT','EXPLOSION') },
};
const STAT_MOVES = v('SWORDS_DANCE','CALM_MIND','DRAGON_DANCE','BULK_UP','NASTY_PLOT','LEER','GROWL','SMOKESCREEN','TAIL_WHIP','WORK_UP','IRON_DEFENSE','ROCK_POLISH','COIL','COTTON_GUARD','TAILWIND','CHARGE','MAGNETIC_FLUX');

// ── Parse _ls() text into entries ───────────────────────────────────
function parseLs(lsText) {
  // lsText = everything inside _ls(...)
  const entries = [];
  // tokenise: numbers and quoted strings / arrays
  const toks = [];
  let i = 0;
  while (i < lsText.length) {
    if (lsText[i] === "'") {
      const end = lsText.indexOf("'", i+1);
      toks.push(lsText.slice(i+1, end));
      i = end+1;
    } else if (lsText[i] === '[') {
      const end = lsText.indexOf(']', i);
      const inner = lsText.slice(i+1, end).replace(/'/g,'').split(',').map(s=>s.trim()).filter(Boolean);
      toks.push(inner);
      i = end+1;
    } else if (/\d/.test(lsText[i])) {
      let j = i;
      while (j < lsText.length && /\d/.test(lsText[j])) j++;
      toks.push(parseInt(lsText.slice(i,j)));
      i = j;
    } else {
      i++;
    }
  }
  for (let k = 0; k+1 < toks.length; k+=2) {
    if (typeof toks[k] === 'number') {
      entries.push({ level: toks[k], move: toks[k+1] });
    }
  }
  return entries;
}

// ── Build new _ls() text ─────────────────────────────────────────────
function buildLs(entries) {
  const pairs = entries.map(e => {
    if (Array.isArray(e.move)) {
      return `${e.level},['${e.move.join("','")}']`;
    }
    return `${e.level},'${e.move}'`;
  });
  // Group in lines of 4 pairs for readability
  const lines = [];
  for (let i = 0; i < pairs.length; i += 4) {
    lines.push(pairs.slice(i, i+4).join(','));
  }
  return `_ls(${lines.join(',\n    ')})`;
}

// ── Expand a learnset ────────────────────────────────────────────────
function expand(entries, types, stage, legendary) {
  const target = legendary ? 13 : stage === 1 ? 7 : stage === 2 ? 10 : 13;
  const chosen = new Set(entries.map(e => Array.isArray(e.move) ? e.move[0] : e.move));

  const p1 = POOLS[types[0]] || POOLS.NORMAL;
  const p2 = types[1] ? (POOLS[types[1]] || {}) : {};

  function pick(pool) {
    for (const id of pool) {
      if (!chosen.has(id)) { chosen.add(id); return id; }
    }
    return null;
  }

  const result = [...entries];
  const maxL = result.length ? Math.max(...result.map(e=>e.level)) : 1;

  // Add moves until we hit target
  const schedule = [];

  if (stage >= 2 || legendary) {
    // Add a mid primary type move
    const m1 = pick([...p1.mid]);
    if (m1) schedule.push({ level: Math.max(maxL+4, stage===1?16:stage===2?28:32), move: m1 });

    // Add secondary type move
    if (p2.mid) {
      const m2 = pick([...p2.mid]);
      if (m2) schedule.push({ level: Math.max(maxL+6, stage===1?18:stage===2?32:36), move: m2 });
    }

    // Add a stat move
    const st = pick(STAT_MOVES);
    if (st) schedule.push({ level: Math.max(maxL+8, stage===1?20:stage===2?34:38), move: st });
  }

  if (stage >= 3 || legendary) {
    // Strong primary
    const s1 = pick([...p1.late]);
    if (s1) schedule.push({ level: 42, move: s1 });
    // Strong secondary
    if (p2.late) {
      const s2 = pick([...p2.late]);
      if (s2) schedule.push({ level: 48, move: s2 });
    }
    // Finisher
    const fin = pick([...p1.late, ...(p2.late||[])]);
    if (fin) schedule.push({ level: 56, move: fin });
  } else if (stage === 2) {
    const s1 = pick([...p1.late, ...(p2.late||[])]);
    if (s1) schedule.push({ level: 38, move: s1 });
  } else {
    // Stage 1 mid
    const m = pick([...p1.mid]);
    if (m) schedule.push({ level: 18, move: m });
  }

  // Fill remaining
  while (result.length + schedule.length < target) {
    const extras = [...p1.mid, ...(p2.mid||[]), ...p1.early, ...STAT_MOVES];
    const e = pick(extras);
    if (!e) break;
    const lastL = schedule.length ? schedule[schedule.length-1].level : maxL;
    schedule.push({ level: lastL + 4, move: e });
  }

  result.push(...schedule);
  result.sort((a,b) => a.level - b.level);

  // ── Add randomizer slots ─────────────────────────────────────────
  function addRandSlot(targetLv, pool) {
    const avail = pool.filter(id => !chosen.has(id)).slice(0,4);
    if (avail.length < 2) return;
    const alreadyNear = result.find(e => Array.isArray(e.move) && Math.abs(e.level-targetLv)<=4);
    if (alreadyNear) return;
    avail.forEach(id => chosen.add(id));
    let idx = result.findIndex(e => e.level > targetLv);
    if (idx === -1) idx = result.length;
    result.splice(idx, 0, { level: targetLv, move: avail });
  }

  const rand1 = [...p1.mid, ...p1.early];
  const rand2 = p2.mid ? [...p2.mid, ...(p2.early||[])] : rand1;
  const randAll = [...new Set([...rand1, ...rand2])];

  if (!legendary) {
    if (stage === 1) {
      addRandSlot(10, randAll);
    } else if (stage === 2) {
      addRandSlot(24, randAll);
    } else {
      addRandSlot(40, [...p1.mid, ...(p2.mid||[])]);
      addRandSlot(54, [...p1.late, ...(p2.late||[])]);
    }
  }

  return result;
}

// ── Main: parse dinomons.js and replace each _ls(...) ───────────────
let src = fs.readFileSync('./js/data/dinomons.js', 'utf8');

// Fix version header
src = src.replace(
  /\/\/ DinoMon.*?dinomons\.js.*/,
  '// DinoMon: Fossil Frontier — data/dinomons.js v8'
);

// Find all _sp() blocks: extract id, types, stage info, and replace _ls()
// Pattern: _sp('ID','Name',['TYPE1',...], {bs}, _ls(...), ...)
// We process block by block.

let replacements = 0;
let pos = 0;

// Collect all species ids and their stages for context
// First pass: just collect id, evolvesTo, prevForm
const specInfo = {};
const spPat = /_sp\(\s*'([A-Z_]+)'/g;
const fullPat = /_sp\(\s*'([A-Z_]+)'[^)]*?evolvesTo[^)]*?\)/gs; // too complex

// Simpler: parse the _sp calls to extract: id, types, evolvesTo, prevForm, legendary
// _sp(id, name, [types...], bs, _ls(...), evolvesTo, evolvesAt, prevForm, ability, ..., legendary, ...)
// args by position:  0      1      2      3     4         5         6       7        8     9,10,11,12,13,14 ...

const spCallPat = /_sp\(\s*'([A-Z_]+)'\s*,\s*'[^']*'\s*,\s*\[([^\]]*)\]/g;
let m;
while ((m = spCallPat.exec(src)) !== null) {
  const id = m[1];
  const types = m[2].replace(/'/g,'').split(',').map(s=>s.trim()).filter(Boolean);
  specInfo[id] = { types };
}

// Second pass: determine stages by looking at evolvesTo/prevForm text
// _sp('ID', 'Name', [...], {...}, _ls(...), evolvesTo_or_null, evolvesAt_or_null, prevForm_or_null, ...)
const stageInfo = {};
const spFullPat = /_sp\(\s*'([A-Z_]+)'[\s\S]*?_ls\([\s\S]*?\)\s*,\s*([^,]+),\s*([^,]+),\s*([^,]+),/g;
while ((m = spFullPat.exec(src)) !== null) {
  const id = m[1];
  const evolvesTo = m[2].trim();
  const prevForm  = m[4].trim();
  const hasEvo  = evolvesTo !== 'null' && !evolvesTo.startsWith('"') || evolvesTo.startsWith("'");
  const hasPrev = prevForm  !== 'null' && !prevForm.startsWith('"')  || prevForm.startsWith("'");
  stageInfo[id] = { hasEvo, hasPrev };
}

function getStage(id) {
  const info = stageInfo[id];
  if (!info) return 2;
  if (info.hasEvo  && !info.hasPrev) return 1;
  if (info.hasEvo  &&  info.hasPrev) return 2;
  if (!info.hasEvo &&  info.hasPrev) return 3;
  return 1;
}

// Check legendary flag: appears late in _sp call (position 13)
const legendaryIds = new Set();
const legPat = /_sp\(\s*'([A-Z_]+)'([\s\S]*?)\)/g;
while ((m = legPat.exec(src)) !== null) {
  const args = m[2].split(',');
  // legendary is arg index 13 (0-based after id), which is arg[12] of the remainder
  if (args.length >= 13) {
    const legArg = args[12].trim();
    if (legArg === 'true') legendaryIds.add(m[1]);
  }
}

// Replace each _ls(...) within a _sp() call context
// Find each _sp block, then replace the _ls inside it
const finalSrc = src.replace(
  /(_sp\(\s*'([A-Z_]+)'[\s\S]*?)(_ls\()([\s\S]*?)(\))([\s\S]*?)(,\s*(?:null|'[A-Z_]+')\s*,)/g,
  (match, pre, id, lsOpen, lsInner, lsClose, post, afterLs) => {
    const types = (specInfo[id] || {}).types || ['NORMAL'];
    const stage = getStage(id);
    const legendary = legendaryIds.has(id);
    const existing = parseLs(lsInner);
    const expanded = expand(existing, types, stage, legendary);
    const newLs = buildLs(expanded);
    replacements++;
    return pre + newLs + post + afterLs;
  }
);

if (replacements === 0) {
  // Try simpler replacement: just find _ls(...) patterns after each _sp start
  console.log('Pattern not matched, trying line-based approach...');

  // Find each species block by looking for lines with _sp('ID',
  const lines = src.split('\n');
  const outLines = [];
  let curId = null, curTypes = [], curStage = 1, curLeg = false;
  let inLs = false, lsBuf = '', lsDepth = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detect _sp start
    const spM = line.match(/_sp\(\s*'([A-Z_]+)'/);
    if (spM) {
      curId = spM[1];
      curTypes = (specInfo[curId] || {}).types || ['NORMAL'];
      curStage = getStage(curId);
      curLeg = legendaryIds.has(curId);
    }

    // Detect _ls( start
    if (!inLs && line.includes('_ls(')) {
      const lsStart = line.indexOf('_ls(');
      inLs = true;
      lsBuf = line.slice(lsStart + 4); // content after _ls(
      lsDepth = 1 + (lsBuf.match(/\(/g)||[]).length - (lsBuf.match(/\)/g)||[]).length;

      if (lsDepth <= 0) {
        // single-line _ls
        const closeIdx = lsBuf.lastIndexOf(')');
        const inner = lsBuf.slice(0, closeIdx);
        const rest = lsBuf.slice(closeIdx+1);
        const existing = parseLs(inner);
        const expanded = expand(existing, curTypes, curStage, curLeg);
        const newLs = buildLs(expanded);
        outLines.push(line.slice(0, lsStart) + newLs + rest);
        inLs = false; lsBuf = '';
        replacements++;
        continue;
      }

      outLines.push(line.slice(0, lsStart) + '_LS_PLACEHOLDER_START');
      continue;
    }

    if (inLs) {
      lsBuf += '\n' + line;
      lsDepth += (line.match(/\(/g)||[]).length - (line.match(/\)/g)||[]).length;
      if (lsDepth <= 0) {
        // Find closing )
        const closeIdx = lsBuf.lastIndexOf(')');
        const inner = lsBuf.slice(0, closeIdx);
        const rest = lsBuf.slice(closeIdx+1);
        const existing = parseLs(inner);
        const expanded = expand(existing, curTypes, curStage, curLeg);
        const newLs = buildLs(expanded);
        // Replace the placeholder
        const lastOut = outLines[outLines.length-1];
        outLines[outLines.length-1] = lastOut.replace('_LS_PLACEHOLDER_START', newLs + rest);
        inLs = false; lsBuf = '';
        replacements++;
      }
      continue;
    }

    outLines.push(line);
  }

  fs.writeFileSync('./js/data/dinomons.js', outLines.join('\n'), 'utf8');
} else {
  fs.writeFileSync('./js/data/dinomons.js', finalSrc, 'utf8');
}

console.log(`Done! Replaced ${replacements} learnsets.`);

// Validate: count species and avg learnset sizes
const src2 = fs.readFileSync('./js/data/dinomons.js','utf8');
const lsMatches = [...src2.matchAll(/_ls\(([\s\S]*?)\)(?=\s*,)/g)];
const sizes = lsMatches.map(m => parseLs(m[1]).length);
const total = sizes.length;
const avg = total ? (sizes.reduce((a,b)=>a+b,0)/total).toFixed(1) : 0;
const mn = total ? Math.min(...sizes) : 0;
const mx = total ? Math.max(...sizes) : 0;
const randCount = lsMatches.reduce((sum, m) => {
  return sum + (m[1].match(/\['/g)||[]).length;
}, 0);
console.log(`Species with learnsets: ${total}`);
console.log(`Avg moves per learnset: ${avg} (min ${mn}, max ${mx})`);
console.log(`Total randomizer slots: ${randCount}`);

/**
 * add_anim_style.js
 * Adds animStyle property to every existing move in moves.js
 * Run with: node add_anim_style.js
 */
const fs = require('fs');

const filePath = './js/data/moves.js';

// Base animStyle per type + category
const TYPE_STYLE = {
  NORMAL:   { PHYSICAL: 'MELEE',    SPECIAL: 'PROJECTILE', STATUS: 'SELF'  },
  FIRE:     { PHYSICAL: 'BURST',    SPECIAL: 'BURST',      STATUS: 'FIELD' },
  WATER:    { PHYSICAL: 'WAVE',     SPECIAL: 'WAVE',       STATUS: 'FIELD' },
  GRASS:    { PHYSICAL: 'CONE',     SPECIAL: 'CONE',       STATUS: 'FIELD' },
  ELECTRIC: { PHYSICAL: 'BEAM',     SPECIAL: 'BEAM',       STATUS: 'PULSE' },
  ICE:      { PHYSICAL: 'SLAM',     SPECIAL: 'CONE',       STATUS: 'FIELD' },
  FIGHTING: { PHYSICAL: 'MELEE',    SPECIAL: 'PULSE',      STATUS: 'SELF'  },
  POISON:   { PHYSICAL: 'VORTEX',   SPECIAL: 'VORTEX',     STATUS: 'FIELD' },
  GROUND:   { PHYSICAL: 'WAVE',     SPECIAL: 'WAVE',       STATUS: 'FIELD' },
  FLYING:   { PHYSICAL: 'ARC',      SPECIAL: 'ARC',        STATUS: 'FIELD' },
  PSYCHIC:  { PHYSICAL: 'PULSE',    SPECIAL: 'PULSE',      STATUS: 'AURA'  },
  BUG:      { PHYSICAL: 'MULTI',    SPECIAL: 'MULTI',      STATUS: 'FIELD' },
  ROCK:     { PHYSICAL: 'ARC',      SPECIAL: 'BURST',      STATUS: 'FIELD' },
  GHOST:    { PHYSICAL: 'VORTEX',   SPECIAL: 'VORTEX',     STATUS: 'AURA'  },
  DRAGON:   { PHYSICAL: 'SLAM',     SPECIAL: 'BEAM',       STATUS: 'AURA'  },
  DARK:     { PHYSICAL: 'SLAM',     SPECIAL: 'AURA',       STATUS: 'FIELD' },
  STEEL:    { PHYSICAL: 'SLAM',     SPECIAL: 'BEAM',       STATUS: 'SELF'  },
  FAIRY:    { PHYSICAL: 'PULSE',    SPECIAL: 'PULSE',      STATUS: 'AURA'  },
};

// Effect-type overrides (take priority over type+category)
const EFFECT_STYLE = {
  DRAIN:       'DRAIN',
  MULTI:       'MULTI',
  RECOIL:      'SLAM',
  TWO_TURN:    'AURA',
  RECHARGE:    'BEAM',
  ONE_HIT_KO:  'VORTEX',
  OMNI_RAISE:  'SELF',
  SET_WEATHER: 'FIELD',
  LEECH_SEED:  'DRAIN',
  STEALTH_ROCK:'FIELD',
};

// Moves that should use SELF regardless (stat-raising status moves targeting self)
const STAT_RAISE_SELF_TYPES = {
  NORMAL: 'SELF', FIRE: 'SELF', WATER: 'SELF', GRASS: 'SELF',
  ELECTRIC: 'SELF', ICE: 'SELF', FIGHTING: 'SELF', POISON: 'SELF',
  GROUND: 'SELF', FLYING: 'SELF', PSYCHIC: 'AURA', BUG: 'SELF',
  ROCK: 'SELF', GHOST: 'AURA', DRAGON: 'AURA', DARK: 'AURA',
  STEEL: 'SELF', FAIRY: 'AURA',
};

function getAnimStyle(type, category, effectType, effectTarget) {
  // Special effect overrides
  if (EFFECT_STYLE[effectType]) return EFFECT_STYLE[effectType];

  // Stat raise/lower targeting self → SELF/AURA
  if (effectType === 'STAT_RAISE' && effectTarget === 'self') {
    return STAT_RAISE_SELF_TYPES[type] || 'SELF';
  }
  // Stat lower targeting opponent → FIELD
  if (effectType === 'STAT_LOWER' && effectTarget !== 'self') return 'FIELD';
  // Confuse targeting opponent → VORTEX
  if (effectType === 'CONFUSE' && effectTarget !== 'self') return 'VORTEX';
  if (effectType === 'CONFUSE' && effectTarget === 'self') return 'SELF';

  // Default lookup
  const typeMap = TYPE_STYLE[type] || TYPE_STYLE['NORMAL'];
  return typeMap[category] || 'PROJECTILE';
}

// ── Main processing ──────────────────────────────────────────
let content = fs.readFileSync(filePath, 'utf8');

// Split into move blocks by finding top-level keys (move IDs)
// We'll process line by line, tracking state per move block
const lines = content.split('\n');
const output = [];

let curType = null;
let curCat  = null;
let curEffType = null;
let curEffTarget = null;
let skipBlock = false;  // true if block already has animStyle

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // Detect type
  const tm = line.match(/^\s+type:\s+'([A-Z]+)'/);
  if (tm) curType = tm[1];

  // Detect category
  const cm = line.match(/^\s+category:\s+'([A-Z]+)'/);
  if (cm) curCat = cm[1];

  // Detect effect type and target (inline object or multi-line)
  const em = line.match(/effect:\s*\{[^}]*type:\s*'([A-Z_]+)'(?:.*target:\s*'([a-z]+)')?/);
  if (em) {
    curEffType   = em[1] || null;
    curEffTarget = em[2] || null;
  }

  // If animStyle already present in this block, mark skip
  if (line.includes('animStyle:')) skipBlock = true;

  // Detect priority line → insert animStyle right after it
  const pm = line.match(/^(\s+)priority:\s+(-?\d+),\s*$/);
  if (pm && !skipBlock) {
    output.push(line);
    // Determine style
    const style = getAnimStyle(curType, curCat, curEffType, curEffTarget);
    output.push(`${pm[1]}animStyle: '${style}',`);
    // Reset block state
    curType = null; curCat = null; curEffType = null; curEffTarget = null;
    skipBlock = false;
    continue;
  }

  // When we reach the closing brace+comma of a top-level entry, reset skip flag
  // Top-level entries close with "  }," (2-space indent)
  if (/^  \},?\s*$/.test(line)) {
    skipBlock = false;
    curType = null; curCat = null; curEffType = null; curEffTarget = null;
  }

  output.push(line);
}

const result = output.join('\n');
fs.writeFileSync(filePath, result, 'utf8');

// Count how many animStyle lines were added
const added = (result.match(/animStyle:/g) || []).length;
console.log(`Done! animStyle added. Total animStyle properties in file: ${added}`);

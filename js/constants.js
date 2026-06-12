// ============================================================
// DinoMon: Fossil Frontier — constants.js
// Global namespace setup and all game constants
// v20 — Added RIVAL_NAME_ENTRY state + DG.getRivalName helper
// ============================================================

window.DG = window.DG || {};

// ── Game States ──────────────────────────────────────────────
DG.STATE = {
  TITLE:              'TITLE',
  SLOT_SELECT:        'SLOT_SELECT',
  NAME_ENTRY:         'NAME_ENTRY',
  RIVAL_NAME_ENTRY:   'RIVAL_NAME_ENTRY',
  DIFFICULTY_SELECT:  'DIFFICULTY_SELECT',
  NICKNAME_ENTRY:     'NICKNAME_ENTRY',
  STARTER:    'STARTER',
  OVERWORLD:  'OVERWORLD',
  BATTLE:     'BATTLE',
  DIALOGUE:   'DIALOGUE',
  MENU:       'MENU',
  PARTY:      'PARTY',
  BAG:        'BAG',
  DEX:        'DEX',
  BOX_UI:     'BOX_UI',
  EVOLUTION:  'EVOLUTION',
  GAMEOVER:   'GAMEOVER',
  TRANSITION: 'TRANSITION',
  CUTSCENE:   'CUTSCENE',
};

// ── Rival name helper ─────────────────────────────────────────
// window._RIVAL_NAME is set by main.js at game start / new game.
// Falls back to 'Flint' so older saves work without a stored name.
DG.getRivalName = function() {
  return (window._RIVAL_NAME && window._RIVAL_NAME.trim()) ? window._RIVAL_NAME.trim() : 'Flint';
};

// ── Types ─────────────────────────────────────────────────────
DG.TYPE = {
  NORMAL:   'NORMAL',
  FIRE:     'FIRE',
  WATER:    'WATER',
  GRASS:    'GRASS',
  ELECTRIC: 'ELECTRIC',
  ICE:      'ICE',
  FIGHTING: 'FIGHTING',
  POISON:   'POISON',
  GROUND:   'GROUND',
  FLYING:   'FLYING',
  PSYCHIC:  'PSYCHIC',
  BUG:      'BUG',
  ROCK:     'ROCK',
  GHOST:    'GHOST',
  DRAGON:   'DRAGON',
  DARK:     'DARK',
  STEEL:    'STEEL',
  FAIRY:    'FAIRY',
};

// ── Move Categories ───────────────────────────────────────────
DG.CATEGORY = {
  PHYSICAL: 'PHYSICAL',
  SPECIAL:  'SPECIAL',
  STATUS:   'STATUS',
};

// ── Animation Styles (15 visual styles for move animations) ──
// Each move carries an `animStyle` property; battleAnim.js uses
// this + the move type (for color) + power (for intensity) to
// produce 810 distinct visual combinations (15 × 18 × 5 intensities).
DG.ANIM_STYLE = {
  BEAM:       'BEAM',       // sustained energy beam from attacker to target
  PROJECTILE: 'PROJECTILE', // arc of particles flying attacker → target
  BURST:      'BURST',      // explosion centred on the target
  WAVE:       'WAVE',       // ripple / shockwave expanding outward
  MELEE:      'MELEE',      // attacker lunges and strikes target
  FIELD:      'FIELD',      // environmental effect (whole-screen tint + particles)
  SELF:       'SELF',       // glows / aura centred on the attacker (buff moves)
  AURA:       'AURA',       // slow pulsing ring around attacker (charge / boost)
  DRAIN:      'DRAIN',      // particles flow from target back to attacker
  MULTI:      'MULTI',      // rapid repeated small hits (uses hit-queue internally)
  ARC:        'ARC',        // high ballistic arc (like a boulder or bone)
  CONE:       'CONE',       // cone / spray from attacker toward target
  SLAM:       'SLAM',       // attacker body-slams the target (contact + quake)
  VORTEX:     'VORTEX',     // spiral vortex centred on target
  PULSE:      'PULSE',      // concentric rings pulsing outward from attacker
};

// ── Status Effects ────────────────────────────────────────────
DG.STATUS = {
  NONE:       null,
  BURN:       'BURN',
  PARALYSIS:  'PARALYSIS',
  POISON:     'POISON',
  BADPOISON:  'BADPOISON',
  SLEEP:      'SLEEP',
  FREEZE:     'FREEZE',
  CONFUSION:  'CONFUSION',
};

// ── Tile IDs ──────────────────────────────────────────────────
// 0–63 walkable, 64+ solid
DG.TILE = {
  FLOOR:        0,  // plain floor / path
  GRASS:        1,  // short grass (no encounter)
  TALL_GRASS:   2,  // tall grass (encounter zone)
  WATER:        3,  // water (navigable with surf)
  SAND:         4,  // sand path
  DIRT:         5,  // dirt floor (indoors)
  ICE:          6,  // ice floor (slide)
  LAVA:         7,  // lava (damages)
  SWAMP:        8,  // swamp (encounter zone)
  FLOWER:       9,  // flower patch (no encounter)
  // Aliases for world/encounter/overworld modules
  PATH:         0,  // = FLOOR
  INDOOR_FLOOR: 0,  // = FLOOR
  CAVE_FLOOR:   8,  // = SWAMP (encounter zone)
  DEEP_WATER:   3,  // = WATER
  BRIDGE:       0,  // = FLOOR
  WARP:         0,  // handled by warp array
  STAIRS_UP:    0,
  STAIRS_DOWN:  0,
  // Solid
  TREE:         64, // tree (solid)
  WALL:         65, // building wall
  MOUNTAIN:     66, // mountain tile
  SIGN:         67, // sign (interact)
  DOOR:         68, // door (warp trigger)
  ROCK:         69, // pushable/solid rock
  FENCE:        70, // fence
  WATER_EDGE:   71, // water border
  CAVE_WALL:    72, // cave wall
  STATUE:       73, // decoration
  COUNTER:      74, // shop counter
  PC:           75, // PC (DinoMon box)
  HEAL_PAD:     76, // healing pad
  CHAIR:        77, // chair/seat (solid)
  GYM_DECO:     77, // gym themed decoration (alias for CHAIR, themed per DG_MAP_THEME)
  TABLE:        78, // table (solid)
  TV:           79, // television (solid)
  BED:          80, // bed (solid)
  SHELF:        81, // bookshelf (solid)
  PLANT:        82, // indoor plant (solid, but visual only)
  WATERFALL:    83, // waterfall (HM Waterfall needed to climb)
  BREAKABLE_ROCK: 84, // smashable rock (HM Rock Smash)
  CUT_TREE:     85, // cuttable small tree (HM Cut)
  DEEP_WATER_TILE: 87, // requires Surf to cross (solid without surfing)
  FISHING_SPOT: 88, // rippling water — higher bite rate
};

// ── Canvas Config ─────────────────────────────────────────────
DG.CANVAS = {
  W:         480,
  H:         320,
  TILE_SIZE: 32,
  TILES_X:   15,   // 480 / 32
  TILES_Y:   10,   // 320 / 32
};

// ── Battle Config ─────────────────────────────────────────────
DG.BATTLE = {
  STAT_STAGES: [0.25, 0.285, 0.333, 0.4, 0.5, 0.667, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0],
  STAGE_OFFSET: 6, // index 6 = stage 0 = multiplier 1.0
  MAX_STAGE:  6,
  MIN_STAGE: -6,
  STAB_BONUS: 1.5,
  RANDOM_MIN: 0.85,
  CATCH_BALL: {
    DINOBALL:       1.0,
    SUPERBALL:      2.5,
    ULTRABALL:      5.0,
    AMBERBALL:      9.0,
    MASTERBALL:     255,
    DINOMASTERBALL: 255,
  },
};

// ── Weather States ─────────────────────────────────────────────
DG.WEATHER = {
  NONE:        null,
  SUNNY:       'SUNNY',
  SEA_SPRAY:   'SEA_SPRAY',
  SANDSTORM:   'SANDSTORM',
  ASH_FALL:    'ASH_FALL',
  LEAVES:      'LEAVES',
  WIND_DUST:   'WIND_DUST',
  BLIZZARD:    'BLIZZARD',
  FOG:         'FOG',
  THUNDERSTORM:'THUNDERSTORM',
  // Legacy aliases (used by move effects)
  RAIN:        'SEA_SPRAY',
  SUN:         'SUNNY',
  HAIL:        'BLIZZARD',
};

// ── Theme → Weather mapping ────────────────────────────────────
// Determines which weather starts automatically when entering a map
DG.THEME_TO_WEATHER = {
  AMBER:    'SUNNY',
  DEFAULT:  'SUNNY',
  COASTAL:  'SEA_SPRAY',
  DESERT:   'SANDSTORM',
  VOLCANIC: 'ASH_FALL',
  FOREST:   'LEAVES',
  GRANITE:  'WIND_DUST',
  MOUNTAIN: 'WIND_DUST',
  TUNDRA:   'BLIZZARD',
  SUMMIT:   'BLIZZARD',
  SWAMP:    'FOG',
  ELECTRIC: 'THUNDERSTORM',
  // Indoor maps / gyms: no auto-weather
  LAB: null, CENTER: null, HOUSE: null, SHOP: null,
  FIRE: null, ROCK: null, GRASS: null, GROUND: null,
  WATER: null, DRAGON: null, NORMAL: null, CHAMPION: null,
};

// ── Weather Battle Effects ─────────────────────────────────────
// damage: types that take 1/16 HP per turn
// immune: types that are immune to damage
// healTypes: types that heal 1/16 HP per turn
// moveBonus: { TYPE: multiplier } — move type power multiplier
// movePenalty: { TYPE: multiplier }
// accuracyMod: accuracy multiplier for ALL moves (1.0 = no change)
// statusChance: { STATUS: probability 0–1 } — extra status roll per turn
DG.WEATHER_EFFECTS = {
  SUNNY: {
    damage:      ['ICE'],
    immune:      ['FIRE'],
    healTypes:   ['FIRE','GRASS'],
    moveBonus:   { FIRE: 1.25 },
    movePenalty: { WATER: 0.75 },
    accuracyMod: 1.0,
    statusChance:{},
    label: '☀ SUNNY',       border: '#ffcc00', bg: '#3a2800',
  },
  SEA_SPRAY: {
    damage:      ['FIRE','ROCK'],
    immune:      ['WATER'],
    healTypes:   [],
    moveBonus:   { WATER: 1.25 },
    movePenalty: { FIRE: 0.75 },
    accuracyMod: 1.0,
    statusChance:{},
    label: '🌊 SEA SPRAY',  border: '#4488cc', bg: '#1a2a4a',
  },
  SANDSTORM: {
    damage:      ['WATER','GRASS','FIRE','FLYING'],
    immune:      ['ROCK','GROUND','STEEL'],
    healTypes:   [],
    moveBonus:   { ROCK: 1.25 },
    movePenalty: {},
    accuracyMod: 0.90,
    statusChance:{},
    label: '🌪 SANDSTORM',  border: '#c8a030', bg: '#2a1e00',
  },
  ASH_FALL: {
    damage:      ['GRASS','WATER','ICE'],
    immune:      ['FIRE'],
    healTypes:   [],
    moveBonus:   { FIRE: 1.25 },
    movePenalty: {},
    accuracyMod: 1.0,
    statusChance:{ POISON: 0.05 },
    label: '🌋 ASH FALL',   border: '#cc6622', bg: '#1a0800',
  },
  LEAVES: {
    damage:      [],
    immune:      [],
    healTypes:   ['GRASS'],
    moveBonus:   { GRASS: 1.25 },
    movePenalty: {},
    accuracyMod: 1.0,
    statusChance:{ SLEEP: 0.05 },
    label: '🍃 POLLEN',     border: '#60c030', bg: '#0a1800',
  },
  WIND_DUST: {
    damage:      ['FLYING'],
    immune:      [],
    healTypes:   [],
    moveBonus:   {},
    movePenalty: {},
    accuracyMod: 0.95,
    statusChance:{},
    label: '💨 WIND',       border: '#a09080', bg: '#1a1408',
  },
  BLIZZARD: {
    damage:      ['FIRE','BUG','FLYING'],
    immune:      ['ICE'],
    healTypes:   [],
    moveBonus:   { ICE: 1.25 },
    movePenalty: {},
    accuracyMod: 1.0,
    statusChance:{},
    label: '❄ BLIZZARD',   border: '#88ccee', bg: '#0e1e30',
  },
  FOG: {
    damage:      [],
    immune:      [],
    healTypes:   [],
    moveBonus:   { POISON: 1.15 },
    movePenalty: {},
    accuracyMod: 0.80,
    statusChance:{},
    label: '🌫 FOG',        border: '#80a880', bg: '#101810',
  },
  THUNDERSTORM: {
    damage:      ['FLYING','WATER'],
    immune:      ['ELECTRIC','GROUND'],
    healTypes:   [],
    moveBonus:   { ELECTRIC: 1.25 },
    movePenalty: {},
    accuracyMod: 1.0,
    statusChance:{ PARALYSIS: 0.08 },
    label: '⚡ STORM',      border: '#ffee40', bg: '#0a0a18',
  },
};

// ── Stat Stage Multiplier Helper ──────────────────────────────
DG.stageMultiplier = function(stage) {
  const idx = DG.BATTLE.STAGE_OFFSET + Math.max(-6, Math.min(6, stage));
  return DG.BATTLE.STAT_STAGES[idx];
};

// ── Experience Growth Curves ──────────────────────────────────
DG.EXP_CURVE = {
  FAST:   function(lv) { return Math.floor(4 * lv * lv * lv / 5); },
  MEDIUM: function(lv) { return lv * lv * lv; },
  SLOW:   function(lv) { return Math.floor(5 * lv * lv * lv / 4); },
};

// ── Item Data ─────────────────────────────────────────────────
DG.ITEMS = {
  POTION:       { name: 'Potion',        heal: 20,  price: 300,  type: 'HEAL' },
  SUPERPOTION:  { name: 'Super Potion',  heal: 50,  price: 700,  type: 'HEAL' },
  HYPERPOTION:  { name: 'Hyper Potion',  heal: 120, price: 1500, type: 'HEAL' },
  MAXPOTION:    { name: 'Max Potion',    heal: 999, price: 2500, type: 'HEAL' },
  REVIVE:       { name: 'Revive',        heal: 0.5, price: 1500, type: 'REVIVE' },
  MAXREVIVE:    { name: 'Max Revive',    heal: 1.0, price: 4000, type: 'REVIVE' },
  DINOBALL:     { name: 'DinoBall',      modifier: 1.0,  price: 200,  type: 'BALL' },
  SUPERBALL:    { name: 'SuperBall',     modifier: 1.5,  price: 600,  type: 'BALL' },
  ULTRABALL:    { name: 'UltraBall',     modifier: 2.0,  price: 1200, type: 'BALL' },
  AMBERBALL:    { name: 'AmberBall',     modifier: 3.0,  price: 0,    type: 'BALL' }, // story reward
  MASTERBALL:      { name: 'DinoMasterBall',modifier: 255,  price: 0,    type: 'BALL' }, // MEGA only
  DINOMASTERBALL:  { name: 'DinoMasterBall',modifier: 255,  price: 0,    type: 'BALL' }, // alias
  ANTIDOTE:     { name: 'Antidote',      price: 100, type: 'CURE', cures: ['POISON','BADPOISON'] },
  BURNHEAL:     { name: 'Burn Heal',     price: 250, type: 'CURE', cures: ['BURN'] },
  PARALYHEAL:   { name: 'Paralyze Heal', price: 200, type: 'CURE', cures: ['PARALYSIS'] },
  AWAKENING:    { name: 'Awakening',     price: 250, type: 'CURE', cures: ['SLEEP'] },
  FULLHEAL:     { name: 'Full Heal',     price: 600, type: 'CURE', cures: 'ALL' },
  AMBERF:       { name: 'Amber Fragment',price: 0,   type: 'KEY' },
  FOSSIL_KEY:   { name: 'Fossil Key',    price: 0,   type: 'KEY' },
  // Repels
  REPEL:        { name: 'Repel',         price: 350, type: 'REPEL', steps: 100 },
  SUPER_REPEL:  { name: 'Super Repel',   price: 500, type: 'REPEL', steps: 200 },
  MAX_REPEL:    { name: 'Max Repel',     price: 700, type: 'REPEL', steps: 250 },
  // Rods
  OLD_ROD:      { name: 'Old Rod',       price: 0,   type: 'KEY',   rodTier: 1 },
  GOOD_ROD:     { name: 'Good Rod',      price: 0,   type: 'KEY',   rodTier: 2 },
  SUPER_ROD:    { name: 'Super Rod',     price: 0,   type: 'KEY',   rodTier: 3 },
  // Key Items
  RUNNING_SHOES:{ name: 'Running Shoes', price: 0,   type: 'KEY' },
  BIKE:         { name: 'Bicycle',       price: 0,   type: 'KEY' },
  SURF_BOARD:   { name: 'Surf Badge',    price: 0,   type: 'KEY' }, // unlocked by badge
  // Evolution Stones
  FIRE_STONE:   { name: 'Fire Stone',   price: 2100, type: 'STONE' },
  WATER_STONE:  { name: 'Water Stone',  price: 2100, type: 'STONE' },
  THUNDER_STONE:{ name: 'Thunder Stone',price: 2100, type: 'STONE' },
  LEAF_STONE:   { name: 'Leaf Stone',   price: 2100, type: 'STONE' },
  ICE_STONE:    { name: 'Ice Stone',    price: 2100, type: 'STONE' },
  DAWN_STONE:   { name: 'Dawn Stone',   price: 3000, type: 'STONE' },
  // Held Items (for held-item evolutions and battle boosts)
  DEEP_SEA_TOOTH: { name: 'Deep Sea Tooth', price: 0, type: 'HELD', effect: 'EVOLVE' },
  DEEP_SEA_SCALE: { name: 'Deep Sea Scale', price: 0, type: 'HELD', effect: 'EVOLVE' },
  METAL_COAT:   { name: 'Metal Coat',  price: 0, type: 'HELD', effect: 'EVOLVE' },
  KINGS_ROCK:   { name: "King's Rock", price: 0, type: 'HELD', effect: 'FLINCH' },
  LIFE_ORB:     { name: 'Life Orb',    price: 0, type: 'HELD', effect: 'LIFE_ORB' },
  LEFTOVERS:    { name: 'Leftovers',   price: 0, type: 'HELD', effect: 'LEFTOVERS' },
  CHOICE_BAND:  { name: 'Choice Band', price: 0, type: 'HELD', effect: 'CHOICE_BAND' },
  CHOICE_SPECS: { name: 'Choice Specs',price: 0, type: 'HELD', effect: 'CHOICE_SPECS' },
  LUM_BERRY:    { name: 'Lum Berry',   price: 0, type: 'HELD', effect: 'LUM_BERRY' },
  FOCUS_SASH:   { name: 'Focus Sash',  price: 0, type: 'HELD', effect: 'FOCUS_SASH' },
  ROCKY_HELMET: { name: 'Rocky Helmet',price: 0, type: 'HELD', effect: 'ROCKY_HELMET' },
  SHELL_BELL:   { name: 'Shell Bell',  price: 0, type: 'HELD', effect: 'SHELL_BELL' },
};

// ── Facing Directions ─────────────────────────────────────────
DG.DIR = { UP: 'UP', DOWN: 'DOWN', LEFT: 'LEFT', RIGHT: 'RIGHT' };
DG.DIR_VEC = {
  UP:    { dx: 0,  dy: -1 },
  DOWN:  { dx: 0,  dy:  1 },
  LEFT:  { dx: -1, dy:  0 },
  RIGHT: { dx: 1,  dy:  0 },
};

// ── Colors ────────────────────────────────────────────────────
DG.TYPE_COLOR = {
  NORMAL:   '#A8A878', FIRE:     '#F08030', WATER:    '#6890F0',
  GRASS:    '#78C850', ELECTRIC: '#F8D030', ICE:      '#98D8D8',
  FIGHTING: '#C03028', POISON:   '#A040A0', GROUND:   '#E0C068',
  FLYING:   '#A890F0', PSYCHIC:  '#F85888', BUG:      '#A8B820',
  ROCK:     '#B8A038', GHOST:    '#705898', DRAGON:   '#7038F8',
  DARK:     '#705848', STEEL:    '#B8B8D0', FAIRY:    '#EE99AC',
};

DG.TYPE_DARK = {
  NORMAL:   '#6D6D4E', FIRE:     '#9C531F', WATER:    '#445E9C',
  GRASS:    '#4E8234', ELECTRIC: '#A1871F', ICE:      '#638D8D',
  FIGHTING: '#7D1F1A', POISON:   '#682A68', GROUND:   '#927D44',
  FLYING:   '#6D5E9C', PSYCHIC:  '#A13959', BUG:      '#6D7815',
  ROCK:     '#786824', GHOST:    '#493566', DRAGON:   '#4924A1',
  DARK:     '#49392F', STEEL:    '#787887', FAIRY:    '#9B6470',
};

// ── UI Colors ─────────────────────────────────────────────────
DG.UI = {
  BOX_BG:     '#1a1a2e',
  BOX_BORDER: '#e94560',
  TEXT:       '#ffffff',
  TEXT_DARK:  '#aaaaaa',
  HP_HIGH:    '#44dd44',
  HP_MID:     '#dddd00',
  HP_LOW:     '#dd4444',
  EXP_BAR:    '#4488ff',
  MENU_SEL:   '#e94560',
};

// ── Keyboard Codes ────────────────────────────────────────────
DG.KEY = {
  UP:     ['ArrowUp', 'w', 'W'],
  DOWN:   ['ArrowDown', 's', 'S'],
  LEFT:   ['ArrowLeft', 'a', 'A'],
  RIGHT:  ['ArrowRight', 'd', 'D'],
  A:      ['z', 'Z', 'Enter', ' '],      // confirm / interact
  B:      ['b', 'B', 'Backspace'],       // cancel / back  (Escape handled via START)
  START:  ['Escape', 'p', 'P'],          // open menu / also closes menus
  SELECT: ['Tab', 'q', 'Q'],             // toggle dex
};

// ── Battle Phases ─────────────────────────────────────────────
DG.BPHASE = {
  PLAYER_INPUT:  'PLAYER_INPUT',
  MOVE_SELECT:   'MOVE_SELECT',
  ENEMY_INPUT:   'ENEMY_INPUT',
  EXECUTE:       'EXECUTE',
  ANIMATION:     'ANIMATION',
  SWITCH_OUT:    'SWITCH_OUT',
  SWITCH_IN:     'SWITCH_IN',
  CATCH_ATTEMPT: 'CATCH_ATTEMPT',
  LEVEL_UP:      'LEVEL_UP',
  EVOLUTION:     'EVOLUTION',
  BATTLE_END:    'BATTLE_END',
};

// ── Time of Day ───────────────────────────────────────────────
DG.TIME = {
  MORNING: 'MORNING', // 05:00–09:59
  DAY:     'DAY',     // 10:00–17:59
  EVENING: 'EVENING', // 18:00–20:59
  NIGHT:   'NIGHT',   // 21:00–04:59
};

// ── Seasons (based on real calendar month) ────────────────────
DG.SEASON = {
  SPRING: 'SPRING', // Mar–May
  SUMMER: 'SUMMER', // Jun–Aug
  AUTUMN: 'AUTUMN', // Sep–Nov
  WINTER: 'WINTER', // Dec–Feb
};

// ── Helper: get current time of day ───────────────────────────
DG.getTimeOfDay = function() {
  const h = new Date().getHours();
  if (h >=  5 && h <  10) return DG.TIME.MORNING;
  if (h >= 10 && h <  18) return DG.TIME.DAY;
  if (h >= 18 && h <  21) return DG.TIME.EVENING;
  return DG.TIME.NIGHT;
};

// ── Helper: smooth 0–1 darkness value for visual tinting ──────
// 0 = full daylight, 1 = full night
DG.getNightFactor = function() {
  const now = new Date();
  const timeDecimal = now.getHours() + now.getMinutes() / 60;
  // Bright: 9–16 → factor 0. Dark: 22–5 → factor 1. Smooth transitions.
  if (timeDecimal >= 9 && timeDecimal <= 16) return 0;
  if (timeDecimal >= 22 || timeDecimal <= 5) return 1;
  if (timeDecimal > 16 && timeDecimal < 22) return (timeDecimal - 16) / 6; // 0→1 over evening
  if (timeDecimal > 5  && timeDecimal < 9)  return 1 - (timeDecimal - 5) / 4; // 1→0 over morning
  return 0;
};

// ── Time-change callback hook (set by audio system) ───────────
// Audio or other systems can assign a function here to react when
// the in-game time of day changes (checked every 60 seconds).
DG.onTimeChange = null;
(function() {
  var _lastTod = DG.getTimeOfDay();
  setInterval(function() {
    var tod = DG.getTimeOfDay();
    if (tod !== _lastTod) {
      _lastTod = tod;
      if (typeof DG.onTimeChange === 'function') DG.onTimeChange(tod);
    }
  }, 60000);
}());

// ── Helper: get current season ────────────────────────────────
DG.getSeason = function() {
  const m = new Date().getMonth(); // 0=Jan
  if (m >= 2 && m <= 4) return DG.SEASON.SPRING;
  if (m >= 5 && m <= 7) return DG.SEASON.SUMMER;
  if (m >= 8 && m <= 10) return DG.SEASON.AUTUMN;
  return DG.SEASON.WINTER;
};

// ── NPC Movement Types ────────────────────────────────────────
DG.NPC_MOVE = {
  STATIONARY: 'STATIONARY',
  WANDER:     'WANDER',
  PATROL:     'PATROL',
};

// ── Wild encounter base step count ────────────────────────────
DG.ENCOUNTER_STEPS = 128; // avg steps between encounters in tall grass

// ── Stone Evolution Table ─────────────────────────────────
// speciesId → { stone: 'STONE_ID', evolves: 'TARGET_ID' }
DG.STONE_EVOLUTIONS = {
  FIRE_STONE: {
    EMBRIX:    'SOLARIX',
    FIRECOAL:  'LAVACLAW',
    SPARKHORN: 'VOLTSCALE',  // Fire Stone alternative path
  },
  WATER_STONE: {
    AQUEEL:    'PLESIWAVE',
    MUDFIN:    'SWAMPJAW',
    MARSHFIN:  'BOGZILLA',
  },
  THUNDER_STONE: {
    SPARKHORN: 'VOLTSCALE',
    SPARKLET:  'VOLTHORN',
    STORMWING: 'TEMPESTFANG',
  },
  LEAF_STONE: {
    LEAFAWN:   'FERNASAUR',
    FRONDLET:  'VINOSAUR',
    LEAFCUB:   'SPRIGDON',
  },
  ICE_STONE: {
    CRYOPHIN:  'GLACIOHORN',
    FROSTLING: 'BLIZZHORN',
    ICECAP:    'BLIZZFANG',
  },
  DAWN_STONE: {
    GHOSTBONE: 'SPIRITHORN',
    FAIRYWING: 'BLOOMSAUR',
  },
};

// ── Happiness Evolution Table ─────────────────────────────
// Certain species evolve when leveled up with high happiness (≥220)
DG.HAPPINESS_EVOLUTIONS = {
  SHADOWLET: { evolves: 'DUSKFANG',   minHappiness: 220 },
  DUSKFANG:  { evolves: 'NIGHTREX',   minHappiness: 220 },
  FAIRYWING: { evolves: 'BLOOMSAUR',  minHappiness: 220 },
  NORMLET:   { evolves: 'PACKDINO',   minHappiness: 160 },
};

// ── Trade Evolution Table ─────────────────────────────────
// These species evolve when traded (via NPC trade)
DG.TRADE_EVOLUTIONS = {
  STEELBACK:  'IRONSCALE',
  IRONSCALE:  'TITANOSAUR',
  MUDFIN:     'SWAMPJAW',       // trade without item
  ROCKFLIP:   'BOULDERDON',
};

// ── Held Item Evolution Table ─────────────────────────────
// Evolve when leveled up while holding specific item
DG.HELD_ITEM_EVOLUTIONS = {
  AQUAFLIP: { item: 'DEEP_SEA_TOOTH', evolves: 'SEAFANG' },
  MUDFIN:   { item: 'DEEP_SEA_SCALE', evolves: 'SWAMPJAW' },
  STEELBACK:{ item: 'METAL_COAT',     evolves: 'IRONSCALE' },
  IRONSCALE:{ item: 'METAL_COAT',     evolves: 'TITANOSAUR' },
};

// ── EV Yield Table ────────────────────────────────────────
// What EVs each species grants when defeated in battle
DG.EV_YIELD = {
  // Starters
  TINDREL:    { spAtk: 1 }, TINDRAK:    { spAtk: 2 }, PYROCERATH: { spAtk: 3 },
  LEAFAWN:    { spDef: 1 }, FERNASAUR:  { spDef: 2 }, VERDANTHORN:{ def: 3 },
  AQUEEL:     { spd: 1 },   PLESIWAVE:  { spd: 2 },   TIDANOSAURUS:{ hp: 3 },
  // Early routes
  NORMLET:    { hp: 1 },    PACKDINO:   { hp: 2 },    HERDSAUR:   { hp: 3 },
  BUGLING:    { spd: 1 },   BUGCLAW:    { spd: 2 },   INSECTADON: { atk: 3 },
  QUICKFEET:  { spd: 1 },   SWIFTCLAW:  { spd: 2 },
  // Rock/Ground
  BONEBACK:   { def: 1 },   STONESKULL: { def: 2 },   OSSIFANG:   { def: 3 },
  QUAKELING:  { atk: 1 },   MIDDODON:   { atk: 2 },   TERRADON:   { atk: 3 },
  ROCKLETT:   { def: 1 },   BOULDERFANG:{ def: 2 },   MEGASTONE:  { def: 3 },
  SANDCLAW:   { spd: 1 },   DESERTFANG: { spd: 2 },   DUNECROWN:  { spd: 3 },
  DIGCLAW:    { atk: 1 },   TUNNELDON:  { atk: 2 },
  ROCKFLIP:   { def: 1 },   BOULDERDON: { def: 2 },
  // Fire
  EMBRIX:     { spAtk: 1 }, SOLARIX:    { spAtk: 2 }, SCORCHBACK: { spAtk: 3 },
  FIRECOAL:   { atk: 1 },   LAVACLAW:   { atk: 2 },   MAGMADON:   { atk: 3 },
  // Water
  MUDFIN:     { hp: 1 },    SWAMPJAW:   { hp: 2 },    SWAMPZILLA: { hp: 3 },
  AQUAFLIP:   { spAtk: 1 }, SEAFANG:    { spAtk: 2 }, ABYSSAUR:   { spAtk: 3 },
  MARSHFIN:   { hp: 1 },    BOGZILLA:   { hp: 2 },
  // Grass
  FRONDLET:   { spDef: 1 }, VINOSAUR:   { spDef: 2 }, CANOPYREX:  { spDef: 3 },
  LEAFCUB:    { spAtk: 1 }, SPRIGDON:   { spAtk: 2 }, JUNGLESAUR: { spAtk: 3 },
  // Electric
  SPARKHORN:  { spAtk: 1 }, VOLTSCALE:  { spAtk: 2 }, THUNDERSAUR:{ spAtk: 3 },
  SPARKLET:   { spd: 1 },   VOLTHORN:   { spd: 2 },
  STORMWING:  { spd: 1 },   TEMPESTFANG:{ spd: 2 },   CYCLOSAUR:  { spAtk: 3 },
  // Ice
  FROSTLING:  { spAtk: 1 }, BLIZZHORN:  { spAtk: 2 }, GLACIOKING: { spAtk: 3 },
  ICECAP:     { spAtk: 1 }, BLIZZFANG:  { spAtk: 2 }, POLARCROWN: { spAtk: 3 },
  CRYOPHIN:   { spd: 1 },   GLACIOHORN: { spd: 2 },   PERMAFROST: { spd: 3 },
  // Dragon/Flying
  PTRYX:      { atk: 1 },   SWOOPTER:   { atk: 2 },   SKYFANG:    { atk: 3 },
  SOARWING:   { spd: 1 },   GLIDEREX:   { spd: 2 },   SKYMASTER:  { spd: 3 },
  DARKSCALE:  { atk: 1 },   SHADOWCLAW: { atk: 2 },   OBSIDIUDON: { atk: 3 },
  // Dark/Ghost
  SHADOWLET:  { spd: 1 },   DUSKFANG:   { spd: 2 },   NIGHTREX:   { spd: 3 },
  GHOSTBONE:  { spAtk: 1 }, SPIRITHORN: { spAtk: 2 }, PHANTOSAUR: { spAtk: 3 },
  // Steel
  STEELBACK:  { def: 1 },   IRONSCALE:  { def: 2 },   TITANOSAUR: { def: 3 },
  // Fighting/Psychic/Fairy/Poison/Bug/Fairy
  FIGHTCLAW:  { atk: 1 },   POWERDON:   { atk: 2 },   RAMPASAUR:  { atk: 3 },
  VENOMJAW:   { spAtk: 1 }, MIASMARK:   { spAtk: 2 }, TOXICARNO:  { spAtk: 3 },
  VIPERFANG:  { atk: 1 },   TOXIDRAW:   { atk: 2 },   VENOMSAUR:  { atk: 3 },
  FAIRYWING:  { spDef: 1 }, BLOOMSAUR:  { spDef: 2 }, FLOROSAUR:  { spDef: 3 },
  // Legendaries give big EV
  GLACIODON:  { spd: 3 },
  CRATERON:   { spAtk: 3 },
  PRIMORDIA:  { spAtk: 3 },
  MEGAVORE:   { atk: 3 },
  TITANREX:   { def: 3 },
};

// ── Day Care / Egg Compatibility ──────────────────────────
// DinoMons in the same egg group can produce eggs together
DG.EGG_GROUPS = {
  DRAGON:   ['TINDREL','TINDRAK','PYROCERATH','PTRYX','SWOOPTER','SKYFANG',
             'CRYOPHIN','GLACIOHORN','PERMAFROST','DARKSCALE','SHADOWCLAW','OBSIDIUDON',
             'AQUEEL','PLESIWAVE','TIDANOSAURUS','AQUAFLIP','SEAFANG','ABYSSAUR',
             'SOARWING','GLIDEREX','SKYMASTER','STORMWING','TEMPESTFANG','CYCLOSAUR',
             'ICECAP','BLIZZFANG','POLARCROWN'],
  LAND:     ['LEAFAWN','FERNASAUR','VERDANTHORN','QUAKELING','MIDDODON','TERRADON',
             'EMBRIX','SOLARIX','SCORCHBACK','BONEBACK','STONESKULL','OSSIFANG',
             'FRONDLET','VINOSAUR','CANOPYREX','FIGHTCLAW','POWERDON','RAMPASAUR',
             'SANDCLAW','DESERTFANG','DUNECROWN','LEAFCUB','SPRIGDON','JUNGLESAUR',
             'FIRECOAL','LAVACLAW','MAGMADON'],
  WATER:    ['MUDFIN','SWAMPJAW','SWAMPZILLA','MARSHFIN','BOGZILLA',
             'FROSTLING','BLIZZHORN','GLACIOKING'],
  FAIRY:    ['FAIRYWING','BLOOMSAUR','FLOROSAUR','NORMLET','PACKDINO','HERDSAUR'],
  BUG:      ['BUGLING','BUGCLAW','INSECTADON'],
  GHOST:    ['GHOSTBONE','SPIRITHORN','PHANTOSAUR','SHADOWLET','DUSKFANG','NIGHTREX'],
  MINERAL:  ['STEELBACK','IRONSCALE','TITANOSAUR','ROCKLETT','BOULDERFANG','MEGASTONE',
             'ROCKFLIP','BOULDERDON'],
  AMORPHOUS:['VENOMJAW','MIASMARK','TOXICARNO','VIPERFANG','TOXIDRAW','VENOMSAUR'],
  FIELD:    ['QUICKFEET','SWIFTCLAW','DIGCLAW','TUNNELDON',
             'SPARKLET','VOLTHORN','SPARKHORN','VOLTSCALE','THUNDERSAUR'],
};

// Reverse lookup: speciesId → egg group name
DG.getEggGroup = function(speciesId) {
  for (const [group, members] of Object.entries(DG.EGG_GROUPS)) {
    if (members.includes(speciesId)) return group;
  }
  return null;
};

// Hatch steps by species (base species of the line)
DG.HATCH_STEPS = {
  default: 2560,
  // Starters hatch faster
  TINDREL: 5120, LEAFAWN: 5120, AQUEEL: 5120,
  // Legendaries can't breed (excluded)
};

console.log('[DinoMon] Constants loaded.');

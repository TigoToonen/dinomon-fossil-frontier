/**
 * add_new_moves.js
 * Appends ~188 new moves to moves.js (before the closing };)
 * Run with: node add_new_moves.js
 */
const fs = require('fs');
const filePath = './js/data/moves.js';

const NEW_MOVES = `
  // ═══════════════════════════════════════════════
  // NEW MOVES — v11 expansion
  // ═══════════════════════════════════════════════

  // ─────────────────────────────────────────────
  // NORMAL — new
  // ─────────────────────────────────────────────

  RAPID_SPIN: {
    id: 'RAPID_SPIN', name: 'Rapid Spin', type: 'NORMAL', category: 'PHYSICAL',
    power: 50, accuracy: 100, pp: 40, priority: 0, animStyle: 'MELEE',
    effect: { type: 'STAT_RAISE', stat: 'spd', stages: 1, chance: 100, target: 'self' },
    description: 'A spin attack that removes entry hazards and raises the user\'s Speed.'
  },

  SLAM_DOWN: {
    id: 'SLAM_DOWN', name: 'Slam Down', type: 'NORMAL', category: 'PHYSICAL',
    power: 80, accuracy: 100, pp: 15, priority: 0, animStyle: 'SLAM',
    effect: { type: 'FLINCH', chance: 30 },
    description: 'The user crashes down on the target with tremendous force. May cause flinching.'
  },

  LAST_RESORT: {
    id: 'LAST_RESORT', name: 'Last Resort', type: 'NORMAL', category: 'PHYSICAL',
    power: 140, accuracy: 100, pp: 5, priority: 0, animStyle: 'SLAM',
    effect: { type: 'NONE' },
    description: 'This move can only be used after all other moves have been used at least once.'
  },

  HYPER_VOICE: {
    id: 'HYPER_VOICE', name: 'Hyper Voice', type: 'NORMAL', category: 'SPECIAL',
    power: 90, accuracy: 100, pp: 10, priority: 0, animStyle: 'WAVE',
    effect: { type: 'NONE' },
    description: 'The user lets out a horribly echoing shout that strikes the target with great force.'
  },

  ECHOED_VOICE: {
    id: 'ECHOED_VOICE', name: 'Echoed Voice', type: 'NORMAL', category: 'SPECIAL',
    power: 40, accuracy: 100, pp: 15, priority: 0, animStyle: 'PULSE',
    effect: { type: 'NONE' },
    description: 'The user attacks the target with an echoing voice. Power increases with each consecutive use.'
  },

  WORK_UP: {
    id: 'WORK_UP', name: 'Work Up', type: 'NORMAL', category: 'STATUS',
    power: null, accuracy: 999, pp: 30, priority: 0, animStyle: 'SELF',
    effect: { type: 'STAT_RAISE', stats: ['atk','spAtk'], stages: 1, chance: 100, target: 'self' },
    description: 'The user is roused, and its Attack and Special Attack stats both rise by one stage.'
  },

  EXPLOSION: {
    id: 'EXPLOSION', name: 'Explosion', type: 'NORMAL', category: 'PHYSICAL',
    power: 250, accuracy: 100, pp: 5, priority: 0, animStyle: 'BURST',
    effect: { type: 'RECOIL', fraction: 1.0 },
    description: 'The user explodes with full force. This knocks out the user but deals massive damage.'
  },

  RECOVER: {
    id: 'RECOVER', name: 'Recover', type: 'NORMAL', category: 'STATUS',
    power: null, accuracy: 999, pp: 10, priority: 0, animStyle: 'SELF',
    effect: { type: 'HEAL', fraction: 0.5 },
    description: 'The user heals up by restoring its own HP. The user recovers half its max HP.'
  },

  BIDE: {
    id: 'BIDE', name: 'Bide', type: 'NORMAL', category: 'PHYSICAL',
    power: null, accuracy: 999, pp: 10, priority: 1, animStyle: 'AURA',
    effect: { type: 'NONE' },
    description: 'The user endures attacks for two turns, then strikes back with double the pain received.'
  },

  MEMENTO: {
    id: 'MEMENTO', name: 'Memento', type: 'NORMAL', category: 'STATUS',
    power: null, accuracy: 100, pp: 10, priority: 0, animStyle: 'VORTEX',
    effect: { type: 'STAT_LOWER', stats: ['atk','spAtk'], stages: -2, chance: 100, target: 'opponent' },
    description: 'The user faints to sharply lower the target\'s Attack and Special Attack.'
  },

  REFRESH: {
    id: 'REFRESH', name: 'Refresh', type: 'NORMAL', category: 'STATUS',
    power: null, accuracy: 999, pp: 20, priority: 0, animStyle: 'SELF',
    effect: { type: 'NONE' },
    description: 'The user rests to cure itself of a poisoning, burn, or paralysis.'
  },

  // ─────────────────────────────────────────────
  // FIRE — new
  // ─────────────────────────────────────────────

  HEAT_WAVE: {
    id: 'HEAT_WAVE', name: 'Heat Wave', type: 'FIRE', category: 'SPECIAL',
    power: 95, accuracy: 90, pp: 10, priority: 0, animStyle: 'CONE',
    effect: { type: 'STATUS_CHANCE', status: 'BURN', chance: 10 },
    description: 'The user exhales a heated breath on the target. It may also leave the target with a burn.'
  },

  MYSTICAL_FIRE: {
    id: 'MYSTICAL_FIRE', name: 'Mystical Fire', type: 'FIRE', category: 'SPECIAL',
    power: 75, accuracy: 100, pp: 10, priority: 0, animStyle: 'BURST',
    effect: { type: 'STAT_LOWER', stat: 'spAtk', stages: -1, chance: 100, target: 'opponent' },
    description: 'The user attacks by breathing a special, hot fire. This also lowers the target\'s Special Attack.'
  },

  INCINERATE: {
    id: 'INCINERATE', name: 'Incinerate', type: 'FIRE', category: 'SPECIAL',
    power: 60, accuracy: 100, pp: 15, priority: 0, animStyle: 'CONE',
    effect: { type: 'NONE' },
    description: 'The user attacks the target with fire. The resulting heat destroys held Berries.'
  },

  FIRE_FANG: {
    id: 'FIRE_FANG', name: 'Fire Fang', type: 'FIRE', category: 'PHYSICAL',
    power: 65, accuracy: 95, pp: 15, priority: 0, animStyle: 'MELEE',
    effect: { type: 'STATUS_CHANCE', status: 'BURN', chance: 10 },
    description: 'The user bites with flame-cloaked fangs. It may also make the target flinch or leave it burned.'
  },

  BLAZE_KICK: {
    id: 'BLAZE_KICK', name: 'Blaze Kick', type: 'FIRE', category: 'PHYSICAL',
    power: 85, accuracy: 90, pp: 10, priority: 0, animStyle: 'MELEE',
    effect: { type: 'STATUS_CHANCE', status: 'BURN', chance: 10 },
    description: 'The user launches a kick with a high critical-hit ratio. It may also leave the target with a burn.'
  },

  FIERY_DANCE: {
    id: 'FIERY_DANCE', name: 'Fiery Dance', type: 'FIRE', category: 'SPECIAL',
    power: 80, accuracy: 100, pp: 10, priority: 0, animStyle: 'BURST',
    effect: { type: 'STAT_RAISE', stat: 'spAtk', stages: 1, chance: 50, target: 'self' },
    description: 'Cloaked in flames, the user dances and attacks the target. It may also raise the user\'s Special Attack.'
  },

  MAGMA_STORM: {
    id: 'MAGMA_STORM', name: 'Magma Storm', type: 'FIRE', category: 'SPECIAL',
    power: 100, accuracy: 75, pp: 5, priority: 0, animStyle: 'VORTEX',
    effect: { type: 'NONE' },
    description: 'Enslared by a fiery vortex of magma for four to five turns, the target can\'t flee.'
  },

  INFERNO: {
    id: 'INFERNO', name: 'Inferno', type: 'FIRE', category: 'SPECIAL',
    power: 100, accuracy: 50, pp: 5, priority: 0, animStyle: 'BURST',
    effect: { type: 'STATUS_CHANCE', status: 'BURN', chance: 100 },
    description: 'The user sets an inferno to the target. It always inflicts a burn if it hits.'
  },

  FLAME_WHEEL: {
    id: 'FLAME_WHEEL', name: 'Flame Wheel', type: 'FIRE', category: 'PHYSICAL',
    power: 60, accuracy: 100, pp: 25, priority: 0, animStyle: 'MELEE',
    effect: { type: 'STATUS_CHANCE', status: 'BURN', chance: 10 },
    description: 'The user rolls itself into a fiery ball and charges at the target. It may also leave a burn.'
  },

  PYRO_BALL: {
    id: 'PYRO_BALL', name: 'Pyro Ball', type: 'FIRE', category: 'PHYSICAL',
    power: 120, accuracy: 90, pp: 5, priority: 0, animStyle: 'ARC',
    effect: { type: 'STATUS_CHANCE', status: 'BURN', chance: 10 },
    description: 'The user attacks by igniting a massive ball of fire and launching it at the target.'
  },

  SCORCHING_SANDS: {
    id: 'SCORCHING_SANDS', name: 'Scorching Sands', type: 'FIRE', category: 'SPECIAL',
    power: 70, accuracy: 100, pp: 10, priority: 0, animStyle: 'WAVE',
    effect: { type: 'STATUS_CHANCE', status: 'BURN', chance: 30 },
    description: 'The user throws scorching sand at the target. It may also leave a burn.'
  },

  BURN_UP: {
    id: 'BURN_UP', name: 'Burn Up', type: 'FIRE', category: 'SPECIAL',
    power: 130, accuracy: 100, pp: 5, priority: 0, animStyle: 'BURST',
    effect: { type: 'STAT_LOWER', stat: 'spAtk', stages: -1, chance: 100, target: 'self' },
    description: 'To avoid overheating, the user burns itself out, losing its Fire type briefly.'
  },

  // ─────────────────────────────────────────────
  // WATER — new
  // ─────────────────────────────────────────────

  MUDDY_WATER: {
    id: 'MUDDY_WATER', name: 'Muddy Water', type: 'WATER', category: 'SPECIAL',
    power: 90, accuracy: 85, pp: 10, priority: 0, animStyle: 'WAVE',
    effect: { type: 'STAT_LOWER', stat: 'acc', stages: -1, chance: 30, target: 'opponent' },
    description: 'The user attacks with turbid, muddy water. It may also lower the target\'s accuracy.'
  },

  SCALD: {
    id: 'SCALD', name: 'Scald', type: 'WATER', category: 'SPECIAL',
    power: 80, accuracy: 100, pp: 15, priority: 0, animStyle: 'WAVE',
    effect: { type: 'STATUS_CHANCE', status: 'BURN', chance: 30 },
    description: 'The user shoots boiling hot water at its target. It may also leave the target with a burn.'
  },

  WHIRLPOOL: {
    id: 'WHIRLPOOL', name: 'Whirlpool', type: 'WATER', category: 'SPECIAL',
    power: 35, accuracy: 85, pp: 15, priority: 0, animStyle: 'VORTEX',
    effect: { type: 'NONE' },
    description: 'The user traps the target in a violent swirling whirlpool for four to five turns.'
  },

  BRINE: {
    id: 'BRINE', name: 'Brine', type: 'WATER', category: 'SPECIAL',
    power: 65, accuracy: 100, pp: 10, priority: 0, animStyle: 'PROJECTILE',
    effect: { type: 'NONE' },
    description: 'If the target has half its HP or less, this attack will hit with double the power.'
  },

  LIQUIDATION: {
    id: 'LIQUIDATION', name: 'Liquidation', type: 'WATER', category: 'PHYSICAL',
    power: 85, accuracy: 100, pp: 10, priority: 0, animStyle: 'SLAM',
    effect: { type: 'STAT_LOWER', stat: 'def', stages: -1, chance: 20, target: 'opponent' },
    description: 'The user slams into the target using a full-force blast of water. It may also lower Defense.'
  },

  CRABHAMMER: {
    id: 'CRABHAMMER', name: 'Crabhammer', type: 'WATER', category: 'PHYSICAL',
    power: 100, accuracy: 90, pp: 10, priority: 0, animStyle: 'MELEE',
    effect: { type: 'NONE' },
    description: 'The target is hammered with a large, heavy claw. High critical-hit ratio.'
  },

  RAIN_DANCE: {
    id: 'RAIN_DANCE', name: 'Rain Dance', type: 'WATER', category: 'STATUS',
    power: null, accuracy: 999, pp: 5, priority: 0, animStyle: 'FIELD',
    effect: { type: 'SET_WEATHER', weather: 'RAIN' },
    description: 'The user summons a heavy rain that falls for five turns, powering up Water moves.'
  },

  WATER_SPOUT: {
    id: 'WATER_SPOUT', name: 'Water Spout', type: 'WATER', category: 'SPECIAL',
    power: 150, accuracy: 100, pp: 5, priority: 0, animStyle: 'BURST',
    effect: { type: 'NONE' },
    description: 'The user fires a massive geyser at the foe. The lower the user\'s HP, the less powerful this move.'
  },

  SPARKLING_ARIA: {
    id: 'SPARKLING_ARIA', name: 'Sparkling Aria', type: 'WATER', category: 'SPECIAL',
    power: 90, accuracy: 100, pp: 10, priority: 0, animStyle: 'WAVE',
    effect: { type: 'NONE' },
    description: 'The user bursts into song, emitting many bubbles. Cures the target\'s burn condition.'
  },

  ORIGIN_PULSE: {
    id: 'ORIGIN_PULSE', name: 'Origin Pulse', type: 'WATER', category: 'SPECIAL',
    power: 110, accuracy: 85, pp: 10, priority: 0, animStyle: 'PULSE',
    effect: { type: 'NONE' },
    description: 'The user attacks with a prehistoric pulse of water from the dawn of the seas.'
  },

  WATER_PLEDGE: {
    id: 'WATER_PLEDGE', name: 'Water Pledge', type: 'WATER', category: 'SPECIAL',
    power: 80, accuracy: 100, pp: 10, priority: 0, animStyle: 'WAVE',
    effect: { type: 'NONE' },
    description: 'A column of water strikes the target. Combined with fire, it creates a rainbow.'
  },

  CLAMP: {
    id: 'CLAMP', name: 'Clamp', type: 'WATER', category: 'PHYSICAL',
    power: 35, accuracy: 85, pp: 15, priority: 0, animStyle: 'MELEE',
    effect: { type: 'NONE' },
    description: 'The target is clamped and squeezed by the user\'s very thick and sturdy shell for four to five turns.'
  },

  // ─────────────────────────────────────────────
  // GRASS — new
  // ─────────────────────────────────────────────

  LEAF_STORM: {
    id: 'LEAF_STORM', name: 'Leaf Storm', type: 'GRASS', category: 'SPECIAL',
    power: 130, accuracy: 90, pp: 5, priority: 0, animStyle: 'VORTEX',
    effect: { type: 'STAT_LOWER', stat: 'spAtk', stages: -2, chance: 100, target: 'self' },
    description: 'The user whips up a storm of sharp leaves around the target. The attack\'s recoil lowers Sp. Atk.'
  },

  GIGA_DRAIN: {
    id: 'GIGA_DRAIN', name: 'Giga Drain', type: 'GRASS', category: 'SPECIAL',
    power: 75, accuracy: 100, pp: 10, priority: 0, animStyle: 'DRAIN',
    effect: { type: 'DRAIN', fraction: 0.5 },
    description: 'A nutrient-draining attack. The user\'s HP is restored by half the damage taken by the target.'
  },

  PETAL_DANCE: {
    id: 'PETAL_DANCE', name: 'Petal Dance', type: 'GRASS', category: 'SPECIAL',
    power: 120, accuracy: 100, pp: 10, priority: 0, animStyle: 'VORTEX',
    effect: { type: 'CONFUSE', chance: 100, target: 'self' },
    description: 'The user attacks with a face-up of petals for two to three turns, then falls into confusion.'
  },

  BULLET_SEED: {
    id: 'BULLET_SEED', name: 'Bullet Seed', type: 'GRASS', category: 'PHYSICAL',
    power: 25, accuracy: 100, pp: 30, priority: 0, animStyle: 'MULTI',
    effect: { type: 'MULTI', min: 2, max: 5 },
    description: 'The user forcefully shoots seeds at the target two to five times in a row.'
  },

  MAGICAL_LEAF: {
    id: 'MAGICAL_LEAF', name: 'Magical Leaf', type: 'GRASS', category: 'SPECIAL',
    power: 60, accuracy: 999, pp: 20, priority: 0, animStyle: 'PROJECTILE',
    effect: { type: 'NONE' },
    description: 'The user scatters curious leaves that always strike the target. This attack cannot be avoided.'
  },

  SPORE: {
    id: 'SPORE', name: 'Spore', type: 'GRASS', category: 'STATUS',
    power: null, accuracy: 100, pp: 15, priority: 0, animStyle: 'FIELD',
    effect: { type: 'STATUS_CHANCE', status: 'SLEEP', chance: 100 },
    description: 'The user scatters bursts of spores that induce sleep.'
  },

  COTTON_GUARD: {
    id: 'COTTON_GUARD', name: 'Cotton Guard', type: 'GRASS', category: 'STATUS',
    power: null, accuracy: 999, pp: 10, priority: 0, animStyle: 'SELF',
    effect: { type: 'STAT_RAISE', stat: 'def', stages: 3, chance: 100, target: 'self' },
    description: 'The user protects itself by wrapping its body in soft cotton, drastically raising its Defense.'
  },

  GRASSY_TERRAIN: {
    id: 'GRASSY_TERRAIN', name: 'Grassy Terrain', type: 'GRASS', category: 'STATUS',
    power: null, accuracy: 999, pp: 10, priority: 0, animStyle: 'FIELD',
    effect: { type: 'SET_WEATHER', weather: 'NONE' },
    description: 'The user turns the battlefield into lush grassland for five turns, boosting Grass moves.'
  },

  INGRAIN: {
    id: 'INGRAIN', name: 'Ingrain', type: 'GRASS', category: 'STATUS',
    power: null, accuracy: 999, pp: 20, priority: 0, animStyle: 'SELF',
    effect: { type: 'NONE' },
    description: 'The user lays roots that restore its HP each turn. The user can no longer flee or switch out.'
  },

  POWER_WHIP: {
    id: 'POWER_WHIP', name: 'Power Whip', type: 'GRASS', category: 'PHYSICAL',
    power: 120, accuracy: 85, pp: 10, priority: 0, animStyle: 'MELEE',
    effect: { type: 'NONE' },
    description: 'The user violently whirls its vines or tentacles to harshly lash the target.'
  },

  TROP_KICK: {
    id: 'TROP_KICK', name: 'Trop Kick', type: 'GRASS', category: 'PHYSICAL',
    power: 70, accuracy: 100, pp: 15, priority: 0, animStyle: 'MELEE',
    effect: { type: 'STAT_LOWER', stat: 'atk', stages: -1, chance: 100, target: 'opponent' },
    description: 'The user lands an intense kick of tropical heat on the target. This also lowers the target\'s Attack.'
  },

  SOLAR_BLADE: {
    id: 'SOLAR_BLADE', name: 'Solar Blade', type: 'GRASS', category: 'PHYSICAL',
    power: 125, accuracy: 100, pp: 10, priority: 0, animStyle: 'BEAM',
    effect: { type: 'TWO_TURN', chargeMsg: 'is gathering sunlight into a blade!' },
    description: 'The user charges up sunlight in a single turn, then cuts the target on the next turn.'
  },

  // ─────────────────────────────────────────────
  // ELECTRIC — new
  // ─────────────────────────────────────────────

  CHARGE: {
    id: 'CHARGE', name: 'Charge', type: 'ELECTRIC', category: 'STATUS',
    power: null, accuracy: 999, pp: 20, priority: 0, animStyle: 'AURA',
    effect: { type: 'STAT_RAISE', stat: 'spDef', stages: 1, chance: 100, target: 'self' },
    description: 'The user charges power to boost the next Electric move. It also raises Sp. Def.'
  },

  DISCHARGE: {
    id: 'DISCHARGE', name: 'Discharge', type: 'ELECTRIC', category: 'SPECIAL',
    power: 80, accuracy: 100, pp: 15, priority: 0, animStyle: 'PULSE',
    effect: { type: 'STATUS_CHANCE', status: 'PARALYSIS', chance: 30 },
    description: 'A flare of electricity is loosed to strike the foe. It may also paralyze the target.'
  },

  WILD_CHARGE: {
    id: 'WILD_CHARGE', name: 'Wild Charge', type: 'ELECTRIC', category: 'PHYSICAL',
    power: 90, accuracy: 100, pp: 15, priority: 0, animStyle: 'MELEE',
    effect: { type: 'RECOIL', fraction: 0.25 },
    description: 'The user shrouds itself in electricity and smashes into its target. It also damages the user a little.'
  },

  NUZZLE: {
    id: 'NUZZLE', name: 'Nuzzle', type: 'ELECTRIC', category: 'PHYSICAL',
    power: 20, accuracy: 100, pp: 20, priority: 0, animStyle: 'MELEE',
    effect: { type: 'STATUS_CHANCE', status: 'PARALYSIS', chance: 100 },
    description: 'The user attacks by nuzzling the target. It always leaves the target with paralysis.'
  },

  ZAP_CANNON: {
    id: 'ZAP_CANNON', name: 'Zap Cannon', type: 'ELECTRIC', category: 'SPECIAL',
    power: 120, accuracy: 50, pp: 5, priority: 0, animStyle: 'PROJECTILE',
    effect: { type: 'STATUS_CHANCE', status: 'PARALYSIS', chance: 100 },
    description: 'The user fires an electric blast like a cannon to inflict damage and paralysis.'
  },

  MAGNETIC_FLUX: {
    id: 'MAGNETIC_FLUX', name: 'Magnetic Flux', type: 'ELECTRIC', category: 'STATUS',
    power: null, accuracy: 999, pp: 20, priority: 0, animStyle: 'SELF',
    effect: { type: 'STAT_RAISE', stats: ['def','spDef'], stages: 1, chance: 100, target: 'self' },
    description: 'The user manipulates magnetic fields around itself, raising its Defense and Sp. Def.'
  },

  ELECTROWEB: {
    id: 'ELECTROWEB', name: 'Electroweb', type: 'ELECTRIC', category: 'SPECIAL',
    power: 55, accuracy: 95, pp: 15, priority: 0, animStyle: 'PROJECTILE',
    effect: { type: 'STAT_LOWER', stat: 'spd', stages: -1, chance: 100, target: 'opponent' },
    description: 'The user captures and attacks by using an electric net. It always lowers the target\'s Speed.'
  },

  PARABOLIC_CHARGE: {
    id: 'PARABOLIC_CHARGE', name: 'Parabolic Charge', type: 'ELECTRIC', category: 'SPECIAL',
    power: 65, accuracy: 100, pp: 20, priority: 0, animStyle: 'DRAIN',
    effect: { type: 'DRAIN', fraction: 0.5 },
    description: 'The user attacks in a wide arc and restores HP equal to half the damage dealt.'
  },

  EERIE_IMPULSE: {
    id: 'EERIE_IMPULSE', name: 'Eerie Impulse', type: 'ELECTRIC', category: 'STATUS',
    power: null, accuracy: 100, pp: 15, priority: 0, animStyle: 'PULSE',
    effect: { type: 'STAT_LOWER', stat: 'spAtk', stages: -2, chance: 100, target: 'opponent' },
    description: 'The user exposes the target to a sinister jolt of electricity that harshly lowers the target\'s Sp. Atk.'
  },

  RISING_VOLTAGE: {
    id: 'RISING_VOLTAGE', name: 'Rising Voltage', type: 'ELECTRIC', category: 'SPECIAL',
    power: 70, accuracy: 100, pp: 20, priority: 0, animStyle: 'BEAM',
    effect: { type: 'NONE' },
    description: 'Using an electric field, the user attacks the target. Power doubles on Electric Terrain.'
  },

  // ─────────────────────────────────────────────
  // ICE — new
  // ─────────────────────────────────────────────

  POWDER_SNOW: {
    id: 'POWDER_SNOW', name: 'Powder Snow', type: 'ICE', category: 'SPECIAL',
    power: 40, accuracy: 100, pp: 25, priority: 0, animStyle: 'CONE',
    effect: { type: 'STATUS_CHANCE', status: 'FREEZE', chance: 10 },
    description: 'The user attacks with a chilling gust of powdery snow. May freeze the target.'
  },

  FROST_BREATH: {
    id: 'FROST_BREATH', name: 'Frost Breath', type: 'ICE', category: 'SPECIAL',
    power: 60, accuracy: 90, pp: 10, priority: 0, animStyle: 'CONE',
    effect: { type: 'NONE' },
    description: 'The user blows its cold breath on the target. This attack always results in a critical hit.'
  },

  AURORA_BEAM: {
    id: 'AURORA_BEAM', name: 'Aurora Beam', type: 'ICE', category: 'SPECIAL',
    power: 65, accuracy: 100, pp: 20, priority: 0, animStyle: 'BEAM',
    effect: { type: 'STAT_LOWER', stat: 'atk', stages: -1, chance: 10, target: 'opponent' },
    description: 'The target is hit with a rainbow-colored beam. It may also lower the target\'s Attack.'
  },

  ICE_PUNCH: {
    id: 'ICE_PUNCH', name: 'Ice Punch', type: 'ICE', category: 'PHYSICAL',
    power: 75, accuracy: 100, pp: 15, priority: 0, animStyle: 'MELEE',
    effect: { type: 'STATUS_CHANCE', status: 'FREEZE', chance: 10 },
    description: 'The target is punched with an icy fist. It may also leave the target frozen.'
  },

  GLACIATE: {
    id: 'GLACIATE', name: 'Glaciate', type: 'ICE', category: 'SPECIAL',
    power: 65, accuracy: 95, pp: 10, priority: 0, animStyle: 'WAVE',
    effect: { type: 'STAT_LOWER', stat: 'spd', stages: -1, chance: 100, target: 'opponent' },
    description: 'The user attacks by blowing freezing cold air at opposing DinoMon. It lowers their Speed.'
  },

  FREEZE_DRY: {
    id: 'FREEZE_DRY', name: 'Freeze-Dry', type: 'ICE', category: 'SPECIAL',
    power: 70, accuracy: 100, pp: 20, priority: 0, animStyle: 'CONE',
    effect: { type: 'STATUS_CHANCE', status: 'FREEZE', chance: 10 },
    description: 'The user rapidly cools the target. This move is super-effective against Water-type DinoMon.'
  },

  AURORA_VEIL: {
    id: 'AURORA_VEIL', name: 'Aurora Veil', type: 'ICE', category: 'STATUS',
    power: null, accuracy: 999, pp: 20, priority: 0, animStyle: 'SELF',
    effect: { type: 'STAT_RAISE', stats: ['def','spDef'], stages: 1, chance: 100, target: 'self' },
    description: 'A wondrous wall of light reduces damage from physical and special attacks for five turns.'
  },

  ICE_HAMMER: {
    id: 'ICE_HAMMER', name: 'Ice Hammer', type: 'ICE', category: 'PHYSICAL',
    power: 100, accuracy: 90, pp: 10, priority: 0, animStyle: 'SLAM',
    effect: { type: 'STAT_LOWER', stat: 'spd', stages: -1, chance: 100, target: 'self' },
    description: 'The user swings its arms and deals a massive icy blow. This lowers the user\'s Speed.'
  },

  SNOWSCAPE: {
    id: 'SNOWSCAPE', name: 'Snowscape', type: 'ICE', category: 'STATUS',
    power: null, accuracy: 999, pp: 10, priority: 0, animStyle: 'FIELD',
    effect: { type: 'SET_WEATHER', weather: 'HAIL' },
    description: 'The user summons a snowstorm for five turns, powering up Ice-type moves.'
  },

  TRIPLE_AXEL: {
    id: 'TRIPLE_AXEL', name: 'Triple Axel', type: 'ICE', category: 'PHYSICAL',
    power: 20, accuracy: 90, pp: 10, priority: 0, animStyle: 'MULTI',
    effect: { type: 'MULTI', min: 3, max: 3 },
    description: 'A consecutive three-hit attack that becomes more powerful with each successive hit.'
  },

  // ─────────────────────────────────────────────
  // FIGHTING — new
  // ─────────────────────────────────────────────

  MACH_PUNCH: {
    id: 'MACH_PUNCH', name: 'Mach Punch', type: 'FIGHTING', category: 'PHYSICAL',
    power: 40, accuracy: 100, pp: 30, priority: 1, animStyle: 'MELEE',
    effect: { type: 'NONE' },
    description: 'The user throws a punch at blinding speed. It is certain to strike first.'
  },

  KARATE_CHOP: {
    id: 'KARATE_CHOP', name: 'Karate Chop', type: 'FIGHTING', category: 'PHYSICAL',
    power: 50, accuracy: 100, pp: 25, priority: 0, animStyle: 'MELEE',
    effect: { type: 'NONE' },
    description: 'The target is attacked with a sharp chop. High critical-hit ratio.'
  },

  SUBMISSION: {
    id: 'SUBMISSION', name: 'Submission', type: 'FIGHTING', category: 'PHYSICAL',
    power: 80, accuracy: 80, pp: 20, priority: 0, animStyle: 'SLAM',
    effect: { type: 'RECOIL', fraction: 0.25 },
    description: 'The user grabs the target and recklessly dives for the ground. The user also takes damage.'
  },

  CROSS_CHOP: {
    id: 'CROSS_CHOP', name: 'Cross Chop', type: 'FIGHTING', category: 'PHYSICAL',
    power: 100, accuracy: 80, pp: 5, priority: 0, animStyle: 'MELEE',
    effect: { type: 'NONE' },
    description: 'The user delivers a double chop with forearms crossed. High critical-hit ratio.'
  },

  DYNAMIC_PUNCH: {
    id: 'DYNAMIC_PUNCH', name: 'Dynamic Punch', type: 'FIGHTING', category: 'PHYSICAL',
    power: 100, accuracy: 50, pp: 5, priority: 0, animStyle: 'SLAM',
    effect: { type: 'CONFUSE', chance: 100, target: 'opponent' },
    description: 'The user punches with full, concentrated power. It always confuses the target if it hits.'
  },

  SUPERPOWER: {
    id: 'SUPERPOWER', name: 'Superpower', type: 'FIGHTING', category: 'PHYSICAL',
    power: 120, accuracy: 100, pp: 5, priority: 0, animStyle: 'SLAM',
    effect: { type: 'STAT_LOWER', stats: ['atk','def'], stages: -1, chance: 100, target: 'self' },
    description: 'The user attacks the target with great power. However, this also lowers the user\'s Attack and Defense.'
  },

  DRAIN_PUNCH: {
    id: 'DRAIN_PUNCH', name: 'Drain Punch', type: 'FIGHTING', category: 'PHYSICAL',
    power: 75, accuracy: 100, pp: 10, priority: 0, animStyle: 'DRAIN',
    effect: { type: 'DRAIN', fraction: 0.5 },
    description: 'An energy-draining punch. The user\'s HP is restored by half the damage taken by the target.'
  },

  AURA_SPHERE: {
    id: 'AURA_SPHERE', name: 'Aura Sphere', type: 'FIGHTING', category: 'SPECIAL',
    power: 80, accuracy: 999, pp: 20, priority: 0, animStyle: 'PULSE',
    effect: { type: 'NONE' },
    description: 'The user looses a blast of aura power that always strikes its target. It never misses.'
  },

  VACUUM_WAVE: {
    id: 'VACUUM_WAVE', name: 'Vacuum Wave', type: 'FIGHTING', category: 'SPECIAL',
    power: 40, accuracy: 100, pp: 30, priority: 1, animStyle: 'WAVE',
    effect: { type: 'NONE' },
    description: 'The user whirls its fists to send a wave of pure vacuum at the target. It always goes first.'
  },

  COLLISION_COURSE: {
    id: 'COLLISION_COURSE', name: 'Collision Course', type: 'FIGHTING', category: 'PHYSICAL',
    power: 100, accuracy: 100, pp: 5, priority: 0, animStyle: 'SLAM',
    effect: { type: 'NONE' },
    description: 'The user transforms and crashes into the target with great power. Boosted if super effective.'
  },

  // ─────────────────────────────────────────────
  // POISON — new
  // ─────────────────────────────────────────────

  ACID: {
    id: 'ACID', name: 'Acid', type: 'POISON', category: 'SPECIAL',
    power: 40, accuracy: 100, pp: 30, priority: 0, animStyle: 'CONE',
    effect: { type: 'STAT_LOWER', stat: 'spDef', stages: -1, chance: 10, target: 'opponent' },
    description: 'The target is attacked with a corrosive liquid. It may also lower the target\'s Sp. Def.'
  },

  SLUDGE: {
    id: 'SLUDGE', name: 'Sludge', type: 'POISON', category: 'SPECIAL',
    power: 65, accuracy: 100, pp: 20, priority: 0, animStyle: 'PROJECTILE',
    effect: { type: 'STATUS_CHANCE', status: 'POISON', chance: 30 },
    description: 'Unsanitary sludge is hurled at the target. It may also poison the target.'
  },

  GUNK_SHOT: {
    id: 'GUNK_SHOT', name: 'Gunk Shot', type: 'POISON', category: 'PHYSICAL',
    power: 120, accuracy: 80, pp: 5, priority: 0, animStyle: 'ARC',
    effect: { type: 'STATUS_CHANCE', status: 'POISON', chance: 30 },
    description: 'The user shoots filthy garbage at the target. It may also poison the target.'
  },

  VENOSHOCK: {
    id: 'VENOSHOCK', name: 'Venoshock', type: 'POISON', category: 'SPECIAL',
    power: 65, accuracy: 100, pp: 10, priority: 0, animStyle: 'BURST',
    effect: { type: 'NONE' },
    description: 'The user drenches the target in a special poisonous liquid. Power doubles if the target is poisoned.'
  },

  CROSS_POISON: {
    id: 'CROSS_POISON', name: 'Cross Poison', type: 'POISON', category: 'PHYSICAL',
    power: 70, accuracy: 100, pp: 20, priority: 0, animStyle: 'MELEE',
    effect: { type: 'STATUS_CHANCE', status: 'POISON', chance: 10 },
    description: 'A slashing attack with a poisonous blade that may poison the target. High critical-hit ratio.'
  },

  POISON_JAB: {
    id: 'POISON_JAB', name: 'Poison Jab', type: 'POISON', category: 'PHYSICAL',
    power: 80, accuracy: 100, pp: 20, priority: 0, animStyle: 'MELEE',
    effect: { type: 'STATUS_CHANCE', status: 'POISON', chance: 30 },
    description: 'The target is stabbed with a tentacle or arm steeped in poison. It may also poison the target.'
  },

  GASTRO_ACID: {
    id: 'GASTRO_ACID', name: 'Gastro Acid', type: 'POISON', category: 'STATUS',
    power: null, accuracy: 100, pp: 10, priority: 0, animStyle: 'FIELD',
    effect: { type: 'STAT_LOWER', stat: 'spDef', stages: -1, chance: 100, target: 'opponent' },
    description: 'The user belches out corrosive acid that lowers the target\'s Sp. Def stat.'
  },

  TOXIC_SPIKES: {
    id: 'TOXIC_SPIKES', name: 'Toxic Spikes', type: 'POISON', category: 'STATUS',
    power: null, accuracy: 999, pp: 20, priority: 0, animStyle: 'FIELD',
    effect: { type: 'STEALTH_ROCK' },
    description: 'The user lays toxic spikes around the opposing team. Poisoning foes that switch in.'
  },

  ACID_SPRAY: {
    id: 'ACID_SPRAY', name: 'Acid Spray', type: 'POISON', category: 'SPECIAL',
    power: 40, accuracy: 100, pp: 20, priority: 0, animStyle: 'PROJECTILE',
    effect: { type: 'STAT_LOWER', stat: 'spDef', stages: -2, chance: 100, target: 'opponent' },
    description: 'The user spits acidic fluid that sharply lowers the target\'s Sp. Def.'
  },

  COIL: {
    id: 'COIL', name: 'Coil', type: 'POISON', category: 'STATUS',
    power: null, accuracy: 999, pp: 20, priority: 0, animStyle: 'SELF',
    effect: { type: 'STAT_RAISE', stats: ['atk','def'], stages: 1, chance: 100, target: 'self' },
    description: 'The user coils up and concentrates, raising its Attack and Defense stats.'
  },

  // ─────────────────────────────────────────────
  // GROUND — new
  // ─────────────────────────────────────────────

  MUD_SHOT: {
    id: 'MUD_SHOT', name: 'Mud Shot', type: 'GROUND', category: 'SPECIAL',
    power: 55, accuracy: 95, pp: 15, priority: 0, animStyle: 'PROJECTILE',
    effect: { type: 'STAT_LOWER', stat: 'spd', stages: -1, chance: 100, target: 'opponent' },
    description: 'The user attacks the target by hurling a blob of mud. This always lowers the target\'s Speed.'
  },

  MUDSLAP: {
    id: 'MUDSLAP', name: 'Mud-Slap', type: 'GROUND', category: 'SPECIAL',
    power: 20, accuracy: 100, pp: 10, priority: 0, animStyle: 'PROJECTILE',
    effect: { type: 'STAT_LOWER', stat: 'acc', stages: -1, chance: 100, target: 'opponent' },
    description: 'The user hurls mud in the target\'s face to inflict damage and lower accuracy.'
  },

  BONE_RUSH: {
    id: 'BONE_RUSH', name: 'Bone Rush', type: 'GROUND', category: 'PHYSICAL',
    power: 25, accuracy: 90, pp: 10, priority: 0, animStyle: 'MULTI',
    effect: { type: 'MULTI', min: 2, max: 5 },
    description: 'The user strikes the target with a hard bone two to five times in a row.'
  },

  BONEMERANG: {
    id: 'BONEMERANG', name: 'Bonemerang', type: 'GROUND', category: 'PHYSICAL',
    power: 50, accuracy: 90, pp: 10, priority: 0, animStyle: 'ARC',
    effect: { type: 'MULTI', min: 2, max: 2 },
    description: 'The user throws the bone it holds. The bone hits the target twice — there and back.'
  },

  FISSURE: {
    id: 'FISSURE', name: 'Fissure', type: 'GROUND', category: 'PHYSICAL',
    power: null, accuracy: 30, pp: 5, priority: 0, animStyle: 'WAVE',
    effect: { type: 'ONE_HIT_KO' },
    description: 'The user opens a fissure in the ground and drops the target in. One-hit KO if it hits.'
  },

  MAGNITUDE: {
    id: 'MAGNITUDE', name: 'Magnitude', type: 'GROUND', category: 'PHYSICAL',
    power: 70, accuracy: 100, pp: 30, priority: 0, animStyle: 'WAVE',
    effect: { type: 'NONE' },
    description: 'The user attacks with random magnitude seismic waves. Power varies each use.'
  },

  HIGH_HORSEPOWER: {
    id: 'HIGH_HORSEPOWER', name: 'High Horsepower', type: 'GROUND', category: 'PHYSICAL',
    power: 95, accuracy: 95, pp: 10, priority: 0, animStyle: 'SLAM',
    effect: { type: 'NONE' },
    description: 'The user fiercely attacks the target using its entire body.'
  },

  MUD_BOMB: {
    id: 'MUD_BOMB', name: 'Mud Bomb', type: 'GROUND', category: 'SPECIAL',
    power: 65, accuracy: 85, pp: 10, priority: 0, animStyle: 'ARC',
    effect: { type: 'STAT_LOWER', stat: 'acc', stages: -1, chance: 30, target: 'opponent' },
    description: 'The user launches a hard clump of mud at the target. It may also lower the target\'s accuracy.'
  },

  // ─────────────────────────────────────────────
  // FLYING — new
  // ─────────────────────────────────────────────

  WING_ATTACK: {
    id: 'WING_ATTACK', name: 'Wing Attack', type: 'FLYING', category: 'PHYSICAL',
    power: 60, accuracy: 100, pp: 35, priority: 0, animStyle: 'ARC',
    effect: { type: 'NONE' },
    description: 'The target is struck with large, imposing wings spread wide to inflict damage.'
  },

  AIR_SLASH: {
    id: 'AIR_SLASH', name: 'Air Slash', type: 'FLYING', category: 'SPECIAL',
    power: 75, accuracy: 95, pp: 15, priority: 0, animStyle: 'ARC',
    effect: { type: 'FLINCH', chance: 30 },
    description: 'The user attacks with a blade of air that it whips up with its wings. It may also flinch.'
  },

  HURRICANE: {
    id: 'HURRICANE', name: 'Hurricane', type: 'FLYING', category: 'SPECIAL',
    power: 110, accuracy: 70, pp: 10, priority: 0, animStyle: 'VORTEX',
    effect: { type: 'CONFUSE', chance: 30, target: 'opponent' },
    description: 'The user attacks by wrapping its opponent in a fierce wind that flies up into the sky. May confuse.'
  },

  FLY: {
    id: 'FLY', name: 'Fly', type: 'FLYING', category: 'PHYSICAL',
    power: 90, accuracy: 95, pp: 15, priority: 0, animStyle: 'ARC',
    effect: { type: 'TWO_TURN', chargeMsg: 'flew up high!' },
    description: 'The user soars up with its wings, then strikes its target on the next turn.'
  },

  BRAVE_BIRD: {
    id: 'BRAVE_BIRD', name: 'Brave Bird', type: 'FLYING', category: 'PHYSICAL',
    power: 120, accuracy: 100, pp: 15, priority: 0, animStyle: 'SLAM',
    effect: { type: 'RECOIL', fraction: 0.33 },
    description: 'The user tucks in its wings and charges from a low altitude. The user also takes serious damage.'
  },

  ROOST: {
    id: 'ROOST', name: 'Roost', type: 'FLYING', category: 'STATUS',
    power: null, accuracy: 999, pp: 10, priority: 0, animStyle: 'SELF',
    effect: { type: 'HEAL', fraction: 0.5 },
    description: 'The user lands and rests its body. It restores the user\'s HP by up to half of its max HP.'
  },

  DEFOG: {
    id: 'DEFOG', name: 'Defog', type: 'FLYING', category: 'STATUS',
    power: null, accuracy: 999, pp: 15, priority: 0, animStyle: 'FIELD',
    effect: { type: 'STAT_LOWER', stat: 'eva', stages: -1, chance: 100, target: 'opponent' },
    description: 'A sharp blast of air sweeps away entry hazards and lowers the target\'s evasiveness.'
  },

  TAILWIND: {
    id: 'TAILWIND', name: 'Tailwind', type: 'FLYING', category: 'STATUS',
    power: null, accuracy: 999, pp: 15, priority: 0, animStyle: 'FIELD',
    effect: { type: 'STAT_RAISE', stat: 'spd', stages: 2, chance: 100, target: 'self' },
    description: 'The user whips up a turbulent whirlwind that sharply raises the user\'s Speed for four turns.'
  },

  // ─────────────────────────────────────────────
  // PSYCHIC — new
  // ─────────────────────────────────────────────

  CONFUSION: {
    id: 'CONFUSION', name: 'Confusion', type: 'PSYCHIC', category: 'SPECIAL',
    power: 50, accuracy: 100, pp: 25, priority: 0, animStyle: 'PULSE',
    effect: { type: 'CONFUSE', chance: 10, target: 'opponent' },
    description: 'The target is hit by a weak telekinetic force. It may also leave the target confused.'
  },

  PSYSHOCK: {
    id: 'PSYSHOCK', name: 'Psyshock', type: 'PSYCHIC', category: 'SPECIAL',
    power: 80, accuracy: 100, pp: 10, priority: 0, animStyle: 'PULSE',
    effect: { type: 'NONE' },
    description: 'The user materialises an odd psychic wave to attack the target. It hits using the target\'s Defense.'
  },

  FUTURE_SIGHT: {
    id: 'FUTURE_SIGHT', name: 'Future Sight', type: 'PSYCHIC', category: 'SPECIAL',
    power: 120, accuracy: 100, pp: 10, priority: 0, animStyle: 'AURA',
    effect: { type: 'NONE' },
    description: 'After targets the foe, a concentrated bundle of light blasts the target two turns later.'
  },

  TRICK: {
    id: 'TRICK', name: 'Trick', type: 'PSYCHIC', category: 'STATUS',
    power: null, accuracy: 100, pp: 10, priority: 0, animStyle: 'AURA',
    effect: { type: 'NONE' },
    description: 'The user catches the target off guard and swaps items with it.'
  },

  LIGHT_SCREEN: {
    id: 'LIGHT_SCREEN', name: 'Light Screen', type: 'PSYCHIC', category: 'STATUS',
    power: null, accuracy: 999, pp: 30, priority: 0, animStyle: 'SELF',
    effect: { type: 'STAT_RAISE', stat: 'spDef', stages: 1, chance: 100, target: 'self' },
    description: 'A wondrous wall of light halves damage from special attacks for five turns.'
  },

  REFLECT: {
    id: 'REFLECT', name: 'Reflect', type: 'PSYCHIC', category: 'STATUS',
    power: null, accuracy: 999, pp: 20, priority: 0, animStyle: 'SELF',
    effect: { type: 'STAT_RAISE', stat: 'def', stages: 1, chance: 100, target: 'self' },
    description: 'A wondrous wall of light halves damage from physical attacks for five turns.'
  },

  MIND_FOCUS: {
    id: 'MIND_FOCUS', name: 'Mind Focus', type: 'PSYCHIC', category: 'STATUS',
    power: null, accuracy: 999, pp: 20, priority: 0, animStyle: 'AURA',
    effect: { type: 'STAT_RAISE', stats: ['spAtk','spDef'], stages: 1, chance: 100, target: 'self' },
    description: 'The user calms its mind and heightens its focus, raising its Sp. Atk and Sp. Def stats.'
  },

  EXTRASENSORY: {
    id: 'EXTRASENSORY', name: 'Extrasensory', type: 'PSYCHIC', category: 'SPECIAL',
    power: 80, accuracy: 100, pp: 20, priority: 0, animStyle: 'PULSE',
    effect: { type: 'FLINCH', chance: 10 },
    description: 'The user attacks with an odd, unseeable power. It may also make the target flinch.'
  },

  // ─────────────────────────────────────────────
  // BUG — new
  // ─────────────────────────────────────────────

  FURY_CUTTER: {
    id: 'FURY_CUTTER', name: 'Fury Cutter', type: 'BUG', category: 'PHYSICAL',
    power: 40, accuracy: 95, pp: 20, priority: 0, animStyle: 'MULTI',
    effect: { type: 'NONE' },
    description: 'The target is slashed with scythes or claws. Power increases with consecutive uses.'
  },

  SILVER_WIND: {
    id: 'SILVER_WIND', name: 'Silver Wind', type: 'BUG', category: 'SPECIAL',
    power: 60, accuracy: 100, pp: 5, priority: 0, animStyle: 'PROJECTILE',
    effect: { type: 'OMNI_RAISE', chance: 10 },
    description: 'The target is attacked with powdery scales. It may also raise all the user\'s base stats.'
  },

  BUG_BUZZ: {
    id: 'BUG_BUZZ', name: 'Bug Buzz', type: 'BUG', category: 'SPECIAL',
    power: 90, accuracy: 100, pp: 10, priority: 0, animStyle: 'WAVE',
    effect: { type: 'STAT_LOWER', stat: 'spDef', stages: -1, chance: 10, target: 'opponent' },
    description: 'The user vibrates its wings to generate a damaging sound wave. It may also lower Sp. Def.'
  },

  LEECH_LIFE: {
    id: 'LEECH_LIFE', name: 'Leech Life', type: 'BUG', category: 'PHYSICAL',
    power: 80, accuracy: 100, pp: 10, priority: 0, animStyle: 'DRAIN',
    effect: { type: 'DRAIN', fraction: 0.5 },
    description: 'The user drains the target\'s blood. The user\'s HP is restored by half the damage dealt.'
  },

  U_TURN: {
    id: 'U_TURN', name: 'U-turn', type: 'BUG', category: 'PHYSICAL',
    power: 70, accuracy: 100, pp: 20, priority: 0, animStyle: 'MELEE',
    effect: { type: 'NONE' },
    description: 'After making its attack, the user rushes back to switch places with a party DinoMon.'
  },

  WING_DANCE: {
    id: 'WING_DANCE', name: 'Wing Dance', type: 'BUG', category: 'STATUS',
    power: null, accuracy: 999, pp: 20, priority: 0, animStyle: 'SELF',
    effect: { type: 'STAT_RAISE', stats: ['spAtk','spDef','spd'], stages: 1, chance: 100, target: 'self' },
    description: 'The user performs a magnificent dance that raises its Sp. Atk, Sp. Def, and Speed by one each.'
  },

  LUNGE: {
    id: 'LUNGE', name: 'Lunge', type: 'BUG', category: 'PHYSICAL',
    power: 80, accuracy: 100, pp: 15, priority: 0, animStyle: 'MELEE',
    effect: { type: 'STAT_LOWER', stat: 'atk', stages: -1, chance: 100, target: 'opponent' },
    description: 'The user makes a lunge at the target. This also lowers the target\'s Attack stat.'
  },

  ATTACK_ORDER: {
    id: 'ATTACK_ORDER', name: 'Attack Order', type: 'BUG', category: 'PHYSICAL',
    power: 90, accuracy: 100, pp: 15, priority: 0, animStyle: 'MULTI',
    effect: { type: 'NONE' },
    description: 'The user calls out its underlings to pummel the target. High critical-hit ratio.'
  },

  // ─────────────────────────────────────────────
  // ROCK — new
  // ─────────────────────────────────────────────

  ROLLOUT: {
    id: 'ROLLOUT', name: 'Rollout', type: 'ROCK', category: 'PHYSICAL',
    power: 30, accuracy: 90, pp: 20, priority: 0, animStyle: 'MELEE',
    effect: { type: 'NONE' },
    description: 'The user continually rolls into the target over five turns. Power increases each turn.'
  },

  ROCK_BLAST: {
    id: 'ROCK_BLAST', name: 'Rock Blast', type: 'ROCK', category: 'PHYSICAL',
    power: 25, accuracy: 90, pp: 10, priority: 0, animStyle: 'MULTI',
    effect: { type: 'MULTI', min: 2, max: 5 },
    description: 'The user hurls hard rocks at the target. Two to five rocks are launched in a row.'
  },

  ROCK_POLISH: {
    id: 'ROCK_POLISH', name: 'Rock Polish', type: 'ROCK', category: 'STATUS',
    power: null, accuracy: 999, pp: 20, priority: 0, animStyle: 'SELF',
    effect: { type: 'STAT_RAISE', stat: 'spd', stages: 2, chance: 100, target: 'self' },
    description: 'The user polishes its body to reduce drag. This sharply raises the Speed stat.'
  },

  SMASH_DOWN: {
    id: 'SMASH_DOWN', name: 'Smash Down', type: 'ROCK', category: 'PHYSICAL',
    power: 75, accuracy: 100, pp: 10, priority: 0, animStyle: 'SLAM',
    effect: { type: 'STAT_LOWER', stat: 'def', stages: -1, chance: 30, target: 'opponent' },
    description: 'The user smashes the target with a heavy blow from above. May crack the target\'s defenses.'
  },

  ANCIENT_POWER: {
    id: 'ANCIENT_POWER', name: 'Ancient Power', type: 'ROCK', category: 'SPECIAL',
    power: 60, accuracy: 100, pp: 5, priority: 0, animStyle: 'BURST',
    effect: { type: 'OMNI_RAISE', chance: 10 },
    description: 'The user attacks with a prehistoric power. It may also raise all the user\'s stats.'
  },

  POWER_GEM: {
    id: 'POWER_GEM', name: 'Power Gem', type: 'ROCK', category: 'SPECIAL',
    power: 80, accuracy: 100, pp: 20, priority: 0, animStyle: 'BURST',
    effect: { type: 'NONE' },
    description: 'The user attacks with a ray of light that sparkles as if it were made of gemstones.'
  },

  WIDE_GUARD: {
    id: 'WIDE_GUARD', name: 'Wide Guard', type: 'ROCK', category: 'STATUS',
    power: null, accuracy: 999, pp: 10, priority: 3, animStyle: 'SELF',
    effect: { type: 'STAT_RAISE', stat: 'def', stages: 1, chance: 100, target: 'self' },
    description: 'The user and its allies are protected from wide-ranging attacks for that turn.'
  },

  ROCK_TOMB: {
    id: 'ROCK_TOMB', name: 'Rock Tomb', type: 'ROCK', category: 'PHYSICAL',
    power: 60, accuracy: 95, pp: 15, priority: 0, animStyle: 'ARC',
    effect: { type: 'STAT_LOWER', stat: 'spd', stages: -1, chance: 100, target: 'opponent' },
    description: 'Boulders are hurled at the target. This also lowers the target\'s Speed.'
  },

  // ─────────────────────────────────────────────
  // GHOST — new
  // ─────────────────────────────────────────────

  HEX: {
    id: 'HEX', name: 'Hex', type: 'GHOST', category: 'SPECIAL',
    power: 65, accuracy: 100, pp: 10, priority: 0, animStyle: 'VORTEX',
    effect: { type: 'NONE' },
    description: 'This relentless attack does massive damage to a target affected by a status condition.'
  },

  SHADOW_SNEAK: {
    id: 'SHADOW_SNEAK', name: 'Shadow Sneak', type: 'GHOST', category: 'PHYSICAL',
    power: 40, accuracy: 100, pp: 30, priority: 1, animStyle: 'PROJECTILE',
    effect: { type: 'NONE' },
    description: 'The user extends its shadow and attacks the target from behind. Always strikes first.'
  },

  SHADOW_BALL: {
    id: 'SHADOW_BALL', name: 'Shadow Ball', type: 'GHOST', category: 'SPECIAL',
    power: 80, accuracy: 100, pp: 15, priority: 0, animStyle: 'PROJECTILE',
    effect: { type: 'STAT_LOWER', stat: 'spDef', stages: -1, chance: 20, target: 'opponent' },
    description: 'The user hurls a shadowy blob at the target. It may also lower the target\'s Sp. Def.'
  },

  PHANTOM_FORCE: {
    id: 'PHANTOM_FORCE', name: 'Phantom Force', type: 'GHOST', category: 'PHYSICAL',
    power: 90, accuracy: 100, pp: 10, priority: 0, animStyle: 'VORTEX',
    effect: { type: 'TWO_TURN', chargeMsg: 'vanished instantly!' },
    description: 'The user vanishes, then strikes the target on the next turn. Hits through Protect.'
  },

  CURSE_MOVE: {
    id: 'CURSE_MOVE', name: 'Curse', type: 'GHOST', category: 'STATUS',
    power: null, accuracy: 999, pp: 10, priority: 0, animStyle: 'AURA',
    effect: { type: 'STAT_RAISE', stats: ['atk','def'], stages: 1, chance: 100, target: 'self' },
    description: 'The user lays a curse on the target. A Ghost type halves its HP to put a curse on the target.'
  },

  DESTINY_BOND: {
    id: 'DESTINY_BOND', name: 'Destiny Bond', type: 'GHOST', category: 'STATUS',
    power: null, accuracy: 999, pp: 5, priority: 0, animStyle: 'AURA',
    effect: { type: 'NONE' },
    description: 'If the user faints, the target is guaranteed to faint as well on that same turn.'
  },

  TRICK_OR_TREAT: {
    id: 'TRICK_OR_TREAT', name: 'Trick-or-Treat', type: 'GHOST', category: 'STATUS',
    power: null, accuracy: 100, pp: 20, priority: 0, animStyle: 'FIELD',
    effect: { type: 'STAT_LOWER', stat: 'def', stages: -1, chance: 100, target: 'opponent' },
    description: 'The user dresses the target in a Ghost costume to unnerve it and lower its Defense.'
  },

  POLTERGEIST: {
    id: 'POLTERGEIST', name: 'Poltergeist', type: 'GHOST', category: 'PHYSICAL',
    power: 110, accuracy: 90, pp: 5, priority: 0, animStyle: 'VORTEX',
    effect: { type: 'NONE' },
    description: 'The user attacks the target by controlling the target\'s item with poltergeist power.'
  },

  // ─────────────────────────────────────────────
  // DARK — new
  // ─────────────────────────────────────────────

  ASSURANCE: {
    id: 'ASSURANCE', name: 'Assurance', type: 'DARK', category: 'PHYSICAL',
    power: 60, accuracy: 100, pp: 10, priority: 0, animStyle: 'SLAM',
    effect: { type: 'NONE' },
    description: 'If the target has already taken damage this turn, this attack\'s power is doubled.'
  },

  SUCKER_PUNCH: {
    id: 'SUCKER_PUNCH', name: 'Sucker Punch', type: 'DARK', category: 'PHYSICAL',
    power: 70, accuracy: 100, pp: 5, priority: 1, animStyle: 'MELEE',
    effect: { type: 'NONE' },
    description: 'This move enables the user to attack first. It fails if the target isn\'t readying an attack.'
  },

  THROAT_CHOP: {
    id: 'THROAT_CHOP', name: 'Throat Chop', type: 'DARK', category: 'PHYSICAL',
    power: 80, accuracy: 100, pp: 15, priority: 0, animStyle: 'MELEE',
    effect: { type: 'NONE' },
    description: 'The user attacks the target\'s throat. The target is prevented from using sound-based moves.'
  },

  NIGHT_SLASH: {
    id: 'NIGHT_SLASH', name: 'Night Slash', type: 'DARK', category: 'PHYSICAL',
    power: 70, accuracy: 100, pp: 15, priority: 0, animStyle: 'SLAM',
    effect: { type: 'NONE' },
    description: 'The user slashes the target the instant an opportunity arises. High critical-hit ratio.'
  },

  BEAT_UP: {
    id: 'BEAT_UP', name: 'Beat Up', type: 'DARK', category: 'PHYSICAL',
    power: 10, accuracy: 100, pp: 10, priority: 0, animStyle: 'MULTI',
    effect: { type: 'MULTI', min: 2, max: 5 },
    description: 'The user calls on its allies to also attack the target. Multiple hits are dealt.'
  },

  EMBARGO: {
    id: 'EMBARGO', name: 'Embargo', type: 'DARK', category: 'STATUS',
    power: null, accuracy: 100, pp: 15, priority: 0, animStyle: 'FIELD',
    effect: { type: 'STAT_LOWER', stat: 'spAtk', stages: -1, chance: 100, target: 'opponent' },
    description: 'The user seals the target\'s ability to use items and lowers its Sp. Atk.'
  },

  PARTING_SHOT: {
    id: 'PARTING_SHOT', name: 'Parting Shot', type: 'DARK', category: 'STATUS',
    power: null, accuracy: 100, pp: 20, priority: 0, animStyle: 'FIELD',
    effect: { type: 'STAT_LOWER', stats: ['atk','spAtk'], stages: -1, chance: 100, target: 'opponent' },
    description: 'The user shoots taunting words at the foe before retreating, lowering Attack and Sp. Atk.'
  },

  SNARL_BLAST: {
    id: 'SNARL_BLAST', name: 'Snarl Blast', type: 'DARK', category: 'SPECIAL',
    power: 55, accuracy: 95, pp: 15, priority: 0, animStyle: 'WAVE',
    effect: { type: 'STAT_LOWER', stat: 'spAtk', stages: -1, chance: 100, target: 'opponent' },
    description: 'The user yells its rage, launching a dark shockwave that lowers the target\'s Sp. Atk.'
  },

  // ─────────────────────────────────────────────
  // STEEL — new
  // ─────────────────────────────────────────────

  BULLET_PUNCH: {
    id: 'BULLET_PUNCH', name: 'Bullet Punch', type: 'STEEL', category: 'PHYSICAL',
    power: 40, accuracy: 100, pp: 30, priority: 1, animStyle: 'MELEE',
    effect: { type: 'NONE' },
    description: 'The user coats its fists with steel and punches the target. It always goes first.'
  },

  STEEL_BEAM: {
    id: 'STEEL_BEAM', name: 'Steel Beam', type: 'STEEL', category: 'SPECIAL',
    power: 140, accuracy: 95, pp: 5, priority: 0, animStyle: 'BEAM',
    effect: { type: 'RECOIL', fraction: 0.5 },
    description: 'The user fires a beam of steel that it collected from the environment. The user takes serious damage.'
  },

  METAL_BURST: {
    id: 'METAL_BURST', name: 'Metal Burst', type: 'STEEL', category: 'PHYSICAL',
    power: null, accuracy: 100, pp: 10, priority: -3, animStyle: 'BURST',
    effect: { type: 'NONE' },
    description: 'The user retaliates against the target with 1.5x the power of the attack it received.'
  },

  GYRO_BALL: {
    id: 'GYRO_BALL', name: 'Gyro Ball', type: 'STEEL', category: 'PHYSICAL',
    power: 75, accuracy: 100, pp: 5, priority: 0, animStyle: 'MELEE',
    effect: { type: 'NONE' },
    description: 'The user tackles the target with a high-speed spin. Slower users hit harder.'
  },

  SMART_STRIKE: {
    id: 'SMART_STRIKE', name: 'Smart Strike', type: 'STEEL', category: 'PHYSICAL',
    power: 70, accuracy: 999, pp: 10, priority: 0, animStyle: 'MELEE',
    effect: { type: 'NONE' },
    description: 'The user targets the foe with a sharp horn that never misses.'
  },

  IRON_TAIL: {
    id: 'IRON_TAIL', name: 'Iron Tail', type: 'STEEL', category: 'PHYSICAL',
    power: 100, accuracy: 75, pp: 15, priority: 0, animStyle: 'SLAM',
    effect: { type: 'STAT_LOWER', stat: 'def', stages: -1, chance: 30, target: 'opponent' },
    description: 'The target is slammed with a steel-hard tail. It may also lower the target\'s Defense stat.'
  },

  STEEL_ROLLER: {
    id: 'STEEL_ROLLER', name: 'Steel Roller', type: 'STEEL', category: 'PHYSICAL',
    power: 130, accuracy: 100, pp: 5, priority: 0, animStyle: 'SLAM',
    effect: { type: 'NONE' },
    description: 'The user attacks while destroying the terrain. Fails if no terrain is present.'
  },

  FLASH_CANNON: {
    id: 'FLASH_CANNON', name: 'Flash Cannon', type: 'STEEL', category: 'SPECIAL',
    power: 80, accuracy: 100, pp: 10, priority: 0, animStyle: 'BEAM',
    effect: { type: 'STAT_LOWER', stat: 'spDef', stages: -1, chance: 10, target: 'opponent' },
    description: 'The user gathers all its light energy and releases it all at once. May lower Sp. Def.'
  },

  // ─────────────────────────────────────────────
  // DRAGON — new
  // ─────────────────────────────────────────────

  DRAGON_RAGE: {
    id: 'DRAGON_RAGE', name: 'Dragon Rage', type: 'DRAGON', category: 'SPECIAL',
    power: 40, accuracy: 100, pp: 10, priority: 0, animStyle: 'BURST',
    effect: { type: 'NONE' },
    description: 'The target is hit with an intense, compressed wave of rage that always deals 40 HP damage.'
  },

  DRACO_METEOR: {
    id: 'DRACO_METEOR', name: 'Draco Meteor', type: 'DRAGON', category: 'SPECIAL',
    power: 130, accuracy: 90, pp: 5, priority: 0, animStyle: 'ARC',
    effect: { type: 'STAT_LOWER', stat: 'spAtk', stages: -2, chance: 100, target: 'self' },
    description: 'Comets are summoned down from the sky onto the target. The attack\'s recoil harshly lowers Sp. Atk.'
  },

  SPACIAL_REND: {
    id: 'SPACIAL_REND', name: 'Spacial Rend', type: 'DRAGON', category: 'SPECIAL',
    power: 100, accuracy: 95, pp: 5, priority: 0, animStyle: 'VORTEX',
    effect: { type: 'NONE' },
    description: 'The user tears the target along with the space around it. High critical-hit ratio.'
  },

  DRAGON_DARTS: {
    id: 'DRAGON_DARTS', name: 'Dragon Darts', type: 'DRAGON', category: 'PHYSICAL',
    power: 50, accuracy: 100, pp: 10, priority: 0, animStyle: 'MULTI',
    effect: { type: 'MULTI', min: 2, max: 2 },
    description: 'The user attacks twice using a pair of dragon darts.'
  },

  CLANGING_SCALES: {
    id: 'CLANGING_SCALES', name: 'Clanging Scales', type: 'DRAGON', category: 'SPECIAL',
    power: 110, accuracy: 100, pp: 5, priority: 0, animStyle: 'WAVE',
    effect: { type: 'STAT_LOWER', stat: 'def', stages: -1, chance: 100, target: 'self' },
    description: 'The user rubs the scales on its entire body and makes a huge noise. Lowers user\'s Defense.'
  },

  BREAKING_SWIPE: {
    id: 'BREAKING_SWIPE', name: 'Breaking Swipe', type: 'DRAGON', category: 'PHYSICAL',
    power: 60, accuracy: 100, pp: 15, priority: 0, animStyle: 'MELEE',
    effect: { type: 'STAT_LOWER', stat: 'atk', stages: -1, chance: 100, target: 'opponent' },
    description: 'The user swings its tough tail wildly to attack. This always lowers the target\'s Attack.'
  },

  DRAGON_RUSH: {
    id: 'DRAGON_RUSH', name: 'Dragon Rush', type: 'DRAGON', category: 'PHYSICAL',
    power: 100, accuracy: 75, pp: 10, priority: 0, animStyle: 'SLAM',
    effect: { type: 'FLINCH', chance: 20 },
    description: 'The user tackles the target while exhibiting overwhelming menace. May cause flinching.'
  },

  SCALE_SHOT: {
    id: 'SCALE_SHOT', name: 'Scale Shot', type: 'DRAGON', category: 'PHYSICAL',
    power: 25, accuracy: 90, pp: 20, priority: 0, animStyle: 'MULTI',
    effect: { type: 'MULTI', min: 2, max: 5 },
    description: 'The user shoots scales at the target two to five times. Raises user\'s Speed but lowers Defense.'
  },

  ROAR_OF_TIME: {
    id: 'ROAR_OF_TIME', name: 'Roar of Time', type: 'DRAGON', category: 'SPECIAL',
    power: 150, accuracy: 90, pp: 5, priority: 0, animStyle: 'BEAM',
    effect: { type: 'RECHARGE' },
    description: 'The user blasts the target with power that distorts space-time. Must recharge next turn.'
  },

  ETERNABEAM: {
    id: 'ETERNABEAM', name: 'Eternabeam', type: 'DRAGON', category: 'SPECIAL',
    power: 160, accuracy: 90, pp: 5, priority: 0, animStyle: 'BEAM',
    effect: { type: 'RECHARGE' },
    description: 'This is the power of the ancient dragon in its primal form. The user must rest on the next turn.'
  },

  // ─────────────────────────────────────────────
  // FAIRY — new
  // ─────────────────────────────────────────────

  DISARMING_VOICE: {
    id: 'DISARMING_VOICE', name: 'Disarming Voice', type: 'FAIRY', category: 'SPECIAL',
    power: 40, accuracy: 999, pp: 15, priority: 0, animStyle: 'WAVE',
    effect: { type: 'NONE' },
    description: 'Letting out a charming cry, the user attacks the target. This attack cannot be avoided.'
  },

  DRAINING_KISS: {
    id: 'DRAINING_KISS', name: 'Draining Kiss', type: 'FAIRY', category: 'SPECIAL',
    power: 50, accuracy: 100, pp: 10, priority: 0, animStyle: 'DRAIN',
    effect: { type: 'DRAIN', fraction: 0.75 },
    description: 'The user steals the target\'s energy with a kiss. The user\'s HP is restored by most of the damage dealt.'
  },

  MOONBLAST: {
    id: 'MOONBLAST', name: 'Moonblast', type: 'FAIRY', category: 'SPECIAL',
    power: 95, accuracy: 100, pp: 15, priority: 0, animStyle: 'BURST',
    effect: { type: 'STAT_LOWER', stat: 'spAtk', stages: -1, chance: 30, target: 'opponent' },
    description: 'Borrowing the power of the moon, the user attacks the target. It may also lower Sp. Atk.'
  },

  CHARM: {
    id: 'CHARM', name: 'Charm', type: 'FAIRY', category: 'STATUS',
    power: null, accuracy: 100, pp: 20, priority: 0, animStyle: 'FIELD',
    effect: { type: 'STAT_LOWER', stat: 'atk', stages: -2, chance: 100, target: 'opponent' },
    description: 'The user gazes at the target rather charmingly, making it less wary. This sharply lowers its Attack.'
  },

  SWEET_KISS: {
    id: 'SWEET_KISS', name: 'Sweet Kiss', type: 'FAIRY', category: 'STATUS',
    power: null, accuracy: 75, pp: 10, priority: 0, animStyle: 'FIELD',
    effect: { type: 'CONFUSE', chance: 100, target: 'opponent' },
    description: 'The user kisses the target with a sweet, angelic cuteness that causes confusion.'
  },

  DAZZLING_GLEAM: {
    id: 'DAZZLING_GLEAM', name: 'Dazzling Gleam', type: 'FAIRY', category: 'SPECIAL',
    power: 80, accuracy: 100, pp: 10, priority: 0, animStyle: 'PULSE',
    effect: { type: 'NONE' },
    description: 'The user damages the target by emitting a powerful flash of light.'
  },

  MISTY_TERRAIN: {
    id: 'MISTY_TERRAIN', name: 'Misty Terrain', type: 'FAIRY', category: 'STATUS',
    power: null, accuracy: 999, pp: 10, priority: 0, animStyle: 'FIELD',
    effect: { type: 'NONE' },
    description: 'The user covers the field in a mystical mist that protects from status conditions for five turns.'
  },

  BABY_DOLL_EYES: {
    id: 'BABY_DOLL_EYES', name: 'Baby-Doll Eyes', type: 'FAIRY', category: 'STATUS',
    power: null, accuracy: 100, pp: 30, priority: 1, animStyle: 'FIELD',
    effect: { type: 'STAT_LOWER', stat: 'atk', stages: -1, chance: 100, target: 'opponent' },
    description: 'The user stares at the target with its baby-doll eyes. This always goes first and lowers Attack.'
  },

  PLAY_ROUGH: {
    id: 'PLAY_ROUGH', name: 'Play Rough', type: 'FAIRY', category: 'PHYSICAL',
    power: 90, accuracy: 90, pp: 10, priority: 0, animStyle: 'MELEE',
    effect: { type: 'STAT_LOWER', stat: 'atk', stages: -1, chance: 10, target: 'opponent' },
    description: 'The user plays rough with the target and attacks it. It may also lower the target\'s Attack.'
  },

  LIGHT_OF_RUIN: {
    id: 'LIGHT_OF_RUIN', name: 'Light of Ruin', type: 'FAIRY', category: 'SPECIAL',
    power: 140, accuracy: 90, pp: 5, priority: 0, animStyle: 'BEAM',
    effect: { type: 'RECOIL', fraction: 0.5 },
    description: 'Drawing power from the Eternal Flower, the user fires a beam of energy. The user takes serious damage.'
  },

`;

// ── Read file, remove closing }; and append new moves ──────────────
let content = fs.readFileSync(filePath, 'utf8');

// Remove last }; (the closing of DG.MOVES)
const lastBrace = content.lastIndexOf('};');
if (lastBrace === -1) {
  console.error('ERROR: Could not find closing }; in moves.js');
  process.exit(1);
}

// Check if any of the new move IDs already exist (skip if so)
const existingIds = new Set();
const idMatches = content.matchAll(/^\s+(\w+):\s*\{/gm);
for (const m of idMatches) existingIds.add(m[1]);

// Filter out already-existing moves from NEW_MOVES
let filteredNew = NEW_MOVES;
const newMoveBlocks = NEW_MOVES.split(/(?=\n  [A-Z_]+:\s*\{)/);
const kept = newMoveBlocks.filter(block => {
  const idMatch = block.match(/\n  ([A-Z_]+):\s*\{/);
  if (!idMatch) return true; // keep header comments etc.
  return !existingIds.has(idMatch[1]);
});

filteredNew = kept.join('');
const newCount = (filteredNew.match(/^\s{2}[A-Z_]+:\s*\{/gm) || []).length;

const newContent =
  content.substring(0, lastBrace) +
  filteredNew +
  '\n};\n';

fs.writeFileSync(filePath, newContent, 'utf8');
console.log(`Done! Added ${newCount} new moves to moves.js`);

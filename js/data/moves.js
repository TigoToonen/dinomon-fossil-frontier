/**
 * DinoMon: Fossil Frontier
 * moves.js — Complete move database v8
 * Namespace: window.DG
 */

window.DG = window.DG || {};

DG.MOVES = {

  // ─────────────────────────────────────────────
  // NORMAL
  // ─────────────────────────────────────────────

  TACKLE: {
    id: 'TACKLE',
    name: 'Tackle',
    type: 'NORMAL',
    category: 'PHYSICAL',
    power: 40,
    accuracy: 100,
    pp: 35,
    priority: 0,
    animStyle: 'MELEE',
    effect: { type: 'NONE' },
    description: 'A physical attack in which the user charges and slams into the target.'
  },

  SCRATCH: {
    id: 'SCRATCH',
    name: 'Scratch',
    type: 'NORMAL',
    category: 'PHYSICAL',
    power: 40,
    accuracy: 100,
    pp: 35,
    priority: 0,
    animStyle: 'MELEE',
    effect: { type: 'NONE' },
    description: 'Hard, pointed claws rake the target to inflict damage.'
  },

  POUND: {
    id: 'POUND',
    name: 'Pound',
    type: 'NORMAL',
    category: 'PHYSICAL',
    power: 35,
    accuracy: 100,
    pp: 35,
    priority: 0,
    animStyle: 'MELEE',
    effect: { type: 'NONE' },
    description: 'The target is physically pounded with a long tail or a foreleg. A basic starter strike.'
  },

  QUICK_STRIKE: {
    id: 'QUICK_STRIKE',
    name: 'Quick Strike',
    type: 'NORMAL',
    category: 'PHYSICAL',
    power: 40,
    accuracy: 100,
    pp: 30,
    priority: 1,
    animStyle: 'MELEE',
    effect: { type: 'NONE' },
    description: 'The user lashes out with blinding speed. Always strikes first.'
  },

  HEADBUTT: {
    id: 'HEADBUTT',
    name: 'Headbutt',
    type: 'NORMAL',
    category: 'PHYSICAL',
    power: 70,
    accuracy: 100,
    pp: 15,
    priority: 0,
    animStyle: 'MELEE',
    effect: { type: 'FLINCH', chance: 30 },
    description: 'The user sticks out its head and attacks by charging straight into the target. It may make the target flinch.'
  },

  BODY_SLAM: {
    id: 'BODY_SLAM',
    name: 'Body Slam',
    type: 'NORMAL',
    category: 'PHYSICAL',
    power: 85,
    accuracy: 100,
    pp: 15,
    priority: 0,
    animStyle: 'MELEE',
    effect: { type: 'STATUS_CHANCE', status: 'PARALYSIS', chance: 30 },
    description: 'The user drops onto the target with its full body weight. It may leave the target with paralysis.'
  },

  HYPER_BEAM: {
    id: 'HYPER_BEAM',
    name: 'Hyper Beam',
    type: 'NORMAL',
    category: 'SPECIAL',
    power: 150,
    accuracy: 90,
    pp: 5,
    priority: 0,
    animStyle: 'PROJECTILE',
    effect: { type: 'RECHARGE' },
    description: 'The target is attacked with a powerful beam. The user must rest on the next turn to regain its energy.'
  },

  QUICK_ATTACK: {
    id: 'QUICK_ATTACK',
    name: 'Quick Attack',
    type: 'NORMAL',
    category: 'PHYSICAL',
    power: 40,
    accuracy: 100,
    pp: 30,
    priority: 1,
    animStyle: 'MELEE',
    effect: { type: 'NONE' },
    description: 'The user lunges at the target at a speed that makes it almost invisible. It is sure to strike first.'
  },

  DOUBLE_EDGE: {
    id: 'DOUBLE_EDGE',
    name: 'Double-Edge',
    type: 'NORMAL',
    category: 'PHYSICAL',
    power: 120,
    accuracy: 100,
    pp: 15,
    priority: 0,
    animStyle: 'MELEE',
    effect: { type: 'RECOIL', fraction: 0.33 },
    description: 'A reckless, life-risking tackle in which the user rushes the target. The user also takes serious damage.'
  },

  SWORDS_DANCE: {
    id: 'SWORDS_DANCE',
    name: 'Swords Dance',
    type: 'NORMAL',
    category: 'STATUS',
    power: null,
    accuracy: 999,
    pp: 20,
    priority: 0,
    animStyle: 'SELF',
    effect: { type: 'STAT_RAISE', stat: 'atk', stages: 2, chance: 100, target: 'self' },
    description: 'A frenetic dance to uplift the fighting spirit. It sharply raises the user\'s Attack stat.'
  },

  LEER: {
    id: 'LEER',
    name: 'Leer',
    type: 'NORMAL',
    category: 'STATUS',
    power: null,
    accuracy: 100,
    pp: 30,
    priority: 0,
    animStyle: 'SELF',
    effect: { type: 'STAT_LOWER', stat: 'def', stages: -1, chance: 100, target: 'opponent' },
    description: 'The user gives opposing DinoMon an intimidating leer that lowers their Defense stat.'
  },

  GROWL: {
    id: 'GROWL',
    name: 'Growl',
    type: 'NORMAL',
    category: 'STATUS',
    power: null,
    accuracy: 100,
    pp: 40,
    priority: 0,
    animStyle: 'SELF',
    effect: { type: 'STAT_LOWER', stat: 'atk', stages: -1, chance: 100, target: 'opponent' },
    description: 'The user growls in an endearing way, making opposing DinoMon less wary. Their Attack stat is lowered.'
  },

  TAIL_WHIP: {
    id: 'TAIL_WHIP',
    name: 'Tail Whip',
    type: 'NORMAL',
    category: 'STATUS',
    power: null,
    accuracy: 100,
    pp: 30,
    priority: 0,
    animStyle: 'SELF',
    effect: { type: 'STAT_LOWER', stat: 'def', stages: -1, chance: 100, target: 'opponent' },
    description: 'The user wags its tail cutely, making opposing DinoMon less wary and lowering their Defense stat.'
  },

  SMOKESCREEN: {
    id: 'SMOKESCREEN',
    name: 'Smokescreen',
    type: 'NORMAL',
    category: 'STATUS',
    power: null,
    accuracy: 100,
    pp: 20,
    priority: 0,
    animStyle: 'SELF',
    effect: { type: 'STAT_LOWER', stat: 'acc', stages: -1, chance: 100, target: 'opponent' },
    description: 'The user releases an obscuring cloud of smoke or ink to lower the target\'s accuracy.'
  },

  // ─────────────────────────────────────────────
  // FIRE
  // ─────────────────────────────────────────────

  EMBER: {
    id: 'EMBER',
    name: 'Ember',
    type: 'FIRE',
    category: 'SPECIAL',
    power: 40,
    accuracy: 100,
    pp: 25,
    priority: 0,
    animStyle: 'BURST',
    effect: { type: 'STATUS_CHANCE', status: 'BURN', chance: 10 },
    description: 'The target is attacked with small flames. It may also leave the target with a burn.'
  },

  FLAME_CHARGE: {
    id: 'FLAME_CHARGE',
    name: 'Flame Charge',
    type: 'FIRE',
    category: 'PHYSICAL',
    power: 60,
    accuracy: 100,
    pp: 20,
    priority: 0,
    animStyle: 'BURST',
    effect: { type: 'STAT_RAISE', stat: 'spd', stages: 1, chance: 100, target: 'self' },
    description: 'The user cloaks itself in fire and charges at the target. Always raises the user\'s Speed stat.'
  },

  FIRE_SPIN: {
    id: 'FIRE_SPIN',
    name: 'Fire Spin',
    type: 'FIRE',
    category: 'SPECIAL',
    power: 35,
    accuracy: 85,
    pp: 15,
    priority: 0,
    animStyle: 'BURST',
    effect: { type: 'NONE' },
    description: 'The target becomes trapped within a fierce vortex of fire that rages for four to five turns.'
  },

  FLAMETHROWER: {
    id: 'FLAMETHROWER',
    name: 'Flamethrower',
    type: 'FIRE',
    category: 'SPECIAL',
    power: 90,
    accuracy: 100,
    pp: 15,
    priority: 0,
    animStyle: 'BURST',
    effect: { type: 'STATUS_CHANCE', status: 'BURN', chance: 10 },
    description: 'The target is scorched with an intense blast of fire. It may also leave the target with a burn.'
  },

  FIRE_BLAST: {
    id: 'FIRE_BLAST',
    name: 'Fire Blast',
    type: 'FIRE',
    category: 'SPECIAL',
    power: 110,
    accuracy: 85,
    pp: 5,
    priority: 0,
    animStyle: 'BURST',
    effect: { type: 'STATUS_CHANCE', status: 'BURN', chance: 10 },
    description: 'The target is attacked with an intense blast of all-consuming fire. It may also leave the target with a burn.'
  },

  OVERHEAT: {
    id: 'OVERHEAT',
    name: 'Overheat',
    type: 'FIRE',
    category: 'SPECIAL',
    power: 130,
    accuracy: 90,
    pp: 5,
    priority: 0,
    animStyle: 'BURST',
    effect: { type: 'STAT_LOWER', stat: 'spAtk', stages: -2, chance: 100, target: 'self' },
    description: 'The user attacks the target at full power. The attack\'s recoil harshly lowers the user\'s Sp. Atk stat.'
  },

  ERUPTION: {
    id: 'ERUPTION',
    name: 'Eruption',
    type: 'FIRE',
    category: 'SPECIAL',
    power: 150,
    accuracy: 100,
    pp: 5,
    priority: 0,
    animStyle: 'BURST',
    effect: { type: 'NONE' },
    description: 'The user attacks the opposing DinoMon by causing a fiery explosion. The lower the user\'s HP, the lower the move\'s power.'
  },

  WILL_O_WISP: {
    id: 'WILL_O_WISP',
    name: 'Will-O-Wisp',
    type: 'FIRE',
    category: 'STATUS',
    power: null,
    accuracy: 85,
    pp: 15,
    priority: 0,
    animStyle: 'FIELD',
    effect: { type: 'STATUS_CHANCE', status: 'BURN', chance: 100 },
    description: 'The user shoots a sinister flame at the target to inflict a burn.'
  },

  LAVA_PLUME: {
    id: 'LAVA_PLUME',
    name: 'Lava Plume',
    type: 'FIRE',
    category: 'SPECIAL',
    power: 80,
    accuracy: 100,
    pp: 15,
    priority: 0,
    animStyle: 'BURST',
    effect: { type: 'STATUS_CHANCE', status: 'BURN', chance: 30 },
    description: 'The user torches everything around it in an inferno of scarlet flames. It may also leave the target with a burn.'
  },

  SUNNY_DAY: {
    id: 'SUNNY_DAY',
    name: 'Sunny Day',
    type: 'FIRE',
    category: 'STATUS',
    power: null,
    accuracy: 999,
    pp: 5,
    priority: 0,
    animStyle: 'FIELD',
    effect: { type: 'SET_WEATHER', weather: 'SUN' },
    description: 'The user intensifies the sun for five turns, powering up Fire-type moves.'
  },

  // ─────────────────────────────────────────────
  // WATER
  // ─────────────────────────────────────────────

  WATER_GUN: {
    id: 'WATER_GUN',
    name: 'Water Gun',
    type: 'WATER',
    category: 'SPECIAL',
    power: 40,
    accuracy: 100,
    pp: 25,
    priority: 0,
    animStyle: 'WAVE',
    effect: { type: 'NONE' },
    description: 'The target is blasted with a forceful shot of water.'
  },

  BUBBLE: {
    id: 'BUBBLE',
    name: 'Bubble',
    type: 'WATER',
    category: 'SPECIAL',
    power: 30,
    accuracy: 100,
    pp: 30,
    priority: 0,
    animStyle: 'WAVE',
    effect: { type: 'STAT_LOWER', stat: 'spd', stages: -1, chance: 33, target: 'opponent' },
    description: 'A spray of bubbles is forcefully ejected at the target. May lower the target\'s Speed — good chip for leads.'
  },

  AQUA_JET: {
    id: 'AQUA_JET',
    name: 'Aqua Jet',
    type: 'WATER',
    category: 'PHYSICAL',
    power: 40,
    accuracy: 100,
    pp: 20,
    priority: 1,
    animStyle: 'WAVE',
    effect: { type: 'NONE' },
    description: 'The user lunges at the target at a speed that makes it almost invisible. It is sure to strike first.'
  },

  WATERFALL: {
    id: 'WATERFALL',
    name: 'Waterfall',
    type: 'WATER',
    category: 'PHYSICAL',
    power: 80,
    accuracy: 100,
    pp: 15,
    priority: 0,
    animStyle: 'WAVE',
    effect: { type: 'FLINCH', chance: 20 },
    description: 'The user charges at the target and may make it flinch. It can also be used to climb a waterfall.'
  },

  SURF: {
    id: 'SURF',
    name: 'Surf',
    type: 'WATER',
    category: 'SPECIAL',
    power: 90,
    accuracy: 100,
    pp: 15,
    priority: 0,
    animStyle: 'WAVE',
    effect: { type: 'NONE' },
    description: 'The user attacks everything around it by swamping its surroundings with a giant wave.'
  },

  HYDRO_PUMP: {
    id: 'HYDRO_PUMP',
    name: 'Hydro Pump',
    type: 'WATER',
    category: 'SPECIAL',
    power: 110,
    accuracy: 80,
    pp: 5,
    priority: 0,
    animStyle: 'WAVE',
    effect: { type: 'NONE' },
    description: 'The target is blasted by a huge volume of water launched under great pressure.'
  },

  AQUA_TAIL: {
    id: 'AQUA_TAIL',
    name: 'Aqua Tail',
    type: 'WATER',
    category: 'PHYSICAL',
    power: 90,
    accuracy: 90,
    pp: 10,
    priority: 0,
    animStyle: 'WAVE',
    effect: { type: 'NONE' },
    description: 'The user attacks by swinging its tail as if it were a vortex of water. High power, slightly unreliable.'
  },

  RAIN_DANCE: {
    id: 'RAIN_DANCE',
    name: 'Rain Dance',
    type: 'WATER',
    category: 'STATUS',
    power: null,
    accuracy: 999,
    pp: 5,
    priority: 0,
    animStyle: 'FIELD',
    effect: { type: 'SET_WEATHER', weather: 'RAIN' },
    description: 'The user summons a heavy rain that falls for five turns, powering up Water-type moves.'
  },

  // ─────────────────────────────────────────────
  // GRASS
  // ─────────────────────────────────────────────

  VINE_WHIP: {
    id: 'VINE_WHIP',
    name: 'Vine Whip',
    type: 'GRASS',
    category: 'PHYSICAL',
    power: 45,
    accuracy: 100,
    pp: 25,
    priority: 0,
    animStyle: 'CONE',
    effect: { type: 'NONE' },
    description: 'The target is struck with slender, whiplike vines to inflict damage.'
  },

  RAZOR_LEAF: {
    id: 'RAZOR_LEAF',
    name: 'Razor Leaf',
    type: 'GRASS',
    category: 'PHYSICAL',
    power: 25,
    accuracy: 95,
    pp: 20,
    priority: 0,
    animStyle: 'CONE',
    effect: { type: 'MULTI', hits: [2, 5] },
    description: 'Sharp-edged leaves slash at the foe in rapid succession. Strikes two to five times in a row.'
  },

  MEGA_DRAIN: {
    id: 'MEGA_DRAIN',
    name: 'Mega Drain',
    type: 'GRASS',
    category: 'SPECIAL',
    power: 40,
    accuracy: 100,
    pp: 15,
    priority: 0,
    animStyle: 'CONE',
    effect: { type: 'DRAIN', fraction: 0.5 },
    description: 'A nutrient-draining attack. The user\'s HP is restored by half the damage taken by the target.'
  },

  GIGA_DRAIN: {
    id: 'GIGA_DRAIN',
    name: 'Giga Drain',
    type: 'GRASS',
    category: 'SPECIAL',
    power: 75,
    accuracy: 100,
    pp: 10,
    priority: 0,
    animStyle: 'CONE',
    effect: { type: 'DRAIN', fraction: 0.5 },
    description: 'A harsh draining move. The user\'s HP is restored by half the damage taken by the target.'
  },

  ENERGY_BALL: {
    id: 'ENERGY_BALL',
    name: 'Energy Ball',
    type: 'GRASS',
    category: 'SPECIAL',
    power: 90,
    accuracy: 100,
    pp: 10,
    priority: 0,
    animStyle: 'CONE',
    effect: { type: 'STAT_LOWER', stat: 'spDef', stages: -1, chance: 10, target: 'opponent' },
    description: 'The user draws power from nature and fires it at the target. It may also lower the target\'s Sp. Def stat.'
  },

  SOLAR_BEAM: {
    id: 'SOLAR_BEAM',
    name: 'Solar Beam',
    type: 'GRASS',
    category: 'SPECIAL',
    power: 120,
    accuracy: 100,
    pp: 10,
    priority: 0,
    animStyle: 'CONE',
    effect: { type: 'NONE' },
    description: 'In the first turn, the user absorbs sunlight. In the second turn, it unleashes a powerful beam.'
  },

  LEECH_SEED: {
    id: 'LEECH_SEED',
    name: 'Leech Seed',
    type: 'GRASS',
    category: 'STATUS',
    power: null,
    accuracy: 90,
    pp: 10,
    priority: 0,
    animStyle: 'FIELD',
    effect: { type: 'LEECH_SEED' },
    description: 'A seed is planted on the target. It steals some HP from the target every turn.'
  },

  SYNTHESIS: {
    id: 'SYNTHESIS',
    name: 'Synthesis',
    type: 'GRASS',
    category: 'STATUS',
    power: null,
    accuracy: 999,
    pp: 5,
    priority: 0,
    animStyle: 'FIELD',
    effect: { type: 'HEAL', fraction: 0.5 },
    description: 'The user restores its own HP. The amount of HP regained varies with the weather.'
  },

  SPORE_BURST: {
    id: 'SPORE_BURST',
    name: 'Spore Burst',
    type: 'GRASS',
    category: 'SPECIAL',
    power: 55,
    accuracy: 100,
    pp: 20,
    priority: 0,
    animStyle: 'CONE',
    effect: { type: 'STATUS_CHANCE', status: 'SLEEP', chance: 15 },
    description: 'The user releases a cloud of toxic spores at the target. It may cause the target to fall asleep.'
  },

  // ─────────────────────────────────────────────
  // ELECTRIC
  // ─────────────────────────────────────────────

  THUNDER_SHOCK: {
    id: 'THUNDER_SHOCK',
    name: 'Thunder Shock',
    type: 'ELECTRIC',
    category: 'SPECIAL',
    power: 40,
    accuracy: 100,
    pp: 30,
    priority: 0,
    animStyle: 'BEAM',
    effect: { type: 'STATUS_CHANCE', status: 'PARALYSIS', chance: 10 },
    description: 'A jolt of electricity crashes down on the target to inflict damage. It may also leave the target with paralysis.'
  },

  SPARK: {
    id: 'SPARK',
    name: 'Spark',
    type: 'ELECTRIC',
    category: 'PHYSICAL',
    power: 65,
    accuracy: 100,
    pp: 20,
    priority: 0,
    animStyle: 'BEAM',
    effect: { type: 'STATUS_CHANCE', status: 'PARALYSIS', chance: 30 },
    description: 'The user throws an electrically charged tackle at the target. It may also leave the target with paralysis.'
  },

  THUNDERBOLT: {
    id: 'THUNDERBOLT',
    name: 'Thunderbolt',
    type: 'ELECTRIC',
    category: 'SPECIAL',
    power: 90,
    accuracy: 100,
    pp: 15,
    priority: 0,
    animStyle: 'BEAM',
    effect: { type: 'STATUS_CHANCE', status: 'PARALYSIS', chance: 10 },
    description: 'A strong electric blast crashes down on the target. It may also leave the target with paralysis.'
  },

  THUNDER: {
    id: 'THUNDER',
    name: 'Thunder',
    type: 'ELECTRIC',
    category: 'SPECIAL',
    power: 110,
    accuracy: 70,
    pp: 10,
    priority: 0,
    animStyle: 'BEAM',
    effect: { type: 'STATUS_CHANCE', status: 'PARALYSIS', chance: 30 },
    description: 'A wicked thunderbolt is dropped on the target. High paralysis chance; hits through evasion in rain.'
  },

  THUNDER_WAVE: {
    id: 'THUNDER_WAVE',
    name: 'Thunder Wave',
    type: 'ELECTRIC',
    category: 'STATUS',
    power: null,
    accuracy: 90,
    pp: 20,
    priority: 0,
    animStyle: 'PULSE',
    effect: { type: 'STATUS_CHANCE', status: 'PARALYSIS', chance: 100 },
    description: 'The user launches a weak jolt of electricity that paralyzes the target.'
  },

  VOLT_TACKLE: {
    id: 'VOLT_TACKLE',
    name: 'Volt Tackle',
    type: 'ELECTRIC',
    category: 'PHYSICAL',
    power: 120,
    accuracy: 100,
    pp: 15,
    priority: 0,
    animStyle: 'BEAM',
    effect: { type: 'RECOIL', fraction: 0.33 },
    description: 'The user electrifies itself and charges the target. The user also takes serious damage.'
  },

  CHARGE_BEAM: {
    id: 'CHARGE_BEAM',
    name: 'Charge Beam',
    type: 'ELECTRIC',
    category: 'SPECIAL',
    power: 50,
    accuracy: 90,
    pp: 10,
    priority: 0,
    animStyle: 'BEAM',
    effect: { type: 'STAT_RAISE', stat: 'spAtk', stages: 1, chance: 70, target: 'self' },
    description: 'The user fires a concentrated beam of electricity. Usually charges up the user\'s Sp. Atk afterward.'
  },

  // ─────────────────────────────────────────────
  // ICE
  // ─────────────────────────────────────────────

  ICE_SHARD: {
    id: 'ICE_SHARD',
    name: 'Ice Shard',
    type: 'ICE',
    category: 'PHYSICAL',
    power: 40,
    accuracy: 100,
    pp: 30,
    priority: 1,
    animStyle: 'SLAM',
    effect: { type: 'NONE' },
    description: 'The user flash-freezes chunks of ice and hurls them at the target. It always goes first.'
  },

  ICE_BEAM: {
    id: 'ICE_BEAM',
    name: 'Ice Beam',
    type: 'ICE',
    category: 'SPECIAL',
    power: 90,
    accuracy: 100,
    pp: 10,
    priority: 0,
    animStyle: 'CONE',
    effect: { type: 'STATUS_CHANCE', status: 'FREEZE', chance: 10 },
    description: 'The target is struck with an icy-cold beam of energy. It may also leave the target frozen.'
  },

  BLIZZARD: {
    id: 'BLIZZARD',
    name: 'Blizzard',
    type: 'ICE',
    category: 'SPECIAL',
    power: 110,
    accuracy: 70,
    pp: 5,
    priority: 0,
    animStyle: 'CONE',
    effect: { type: 'STATUS_CHANCE', status: 'FREEZE', chance: 10 },
    description: 'A howling blizzard is summoned to strike opposing DinoMon. It may also leave the targets frozen.'
  },

  FREEZE_DRY: {
    id: 'FREEZE_DRY',
    name: 'Freeze-Dry',
    type: 'ICE',
    category: 'SPECIAL',
    power: 70,
    accuracy: 100,
    pp: 20,
    priority: 0,
    animStyle: 'CONE',
    effect: { type: 'STATUS_CHANCE', status: 'FREEZE', chance: 10 },
    description: 'The user rapidly cools the target. It may also leave the target frozen. Super effective on Water types.'
  },

  ICICLE_CRASH: {
    id: 'ICICLE_CRASH',
    name: 'Icicle Crash',
    type: 'ICE',
    category: 'PHYSICAL',
    power: 85,
    accuracy: 90,
    pp: 10,
    priority: 0,
    animStyle: 'SLAM',
    effect: { type: 'FLINCH', chance: 30 },
    description: 'The user attacks by harshly dropping large icicles onto the target. It may also make the target flinch.'
  },

  HAIL: {
    id: 'HAIL',
    name: 'Hail',
    type: 'ICE',
    category: 'STATUS',
    power: null,
    accuracy: 999,
    pp: 10,
    priority: 0,
    animStyle: 'FIELD',
    effect: { type: 'SET_WEATHER', weather: 'HAIL' },
    description: 'The user summons a hailstorm lasting five turns. It damages all DinoMon except Ice types.'
  },

  FROST_BREATH: {
    id: 'FROST_BREATH',
    name: 'Frost Breath',
    type: 'ICE',
    category: 'SPECIAL',
    power: 60,
    accuracy: 90,
    pp: 10,
    priority: 0,
    animStyle: 'CONE',
    effect: { type: 'NONE' },
    description: 'The user blows a cold breath on the target. Always lands a critical hit.'
  },

  // ─────────────────────────────────────────────
  // FIGHTING
  // ─────────────────────────────────────────────

  KARATE_CHOP: {
    id: 'KARATE_CHOP',
    name: 'Karate Chop',
    type: 'FIGHTING',
    category: 'PHYSICAL',
    power: 50,
    accuracy: 100,
    pp: 25,
    priority: 0,
    animStyle: 'MELEE',
    effect: { type: 'NONE' },
    description: 'The target is attacked with a sharp chop. Critical hits land more easily.'
  },

  DYNAMIC_PUNCH: {
    id: 'DYNAMIC_PUNCH',
    name: 'Dynamic Punch',
    type: 'FIGHTING',
    category: 'PHYSICAL',
    power: 100,
    accuracy: 50,
    pp: 5,
    priority: 0,
    animStyle: 'MELEE',
    effect: { type: 'CONFUSE', chance: 100 },
    description: 'The user punches the target with full force. It confuses the target if it hits.'
  },

  CLOSE_COMBAT: {
    id: 'CLOSE_COMBAT',
    name: 'Close Combat',
    type: 'FIGHTING',
    category: 'PHYSICAL',
    power: 120,
    accuracy: 100,
    pp: 5,
    priority: 0,
    animStyle: 'MELEE',
    effect: { type: 'STAT_LOWER', stat: 'def', stages: -1, chance: 100, target: 'self' },
    description: 'The user fights the target up close without guarding itself. It also lowers the user\'s Defense stat.'
  },

  MACH_PUNCH: {
    id: 'MACH_PUNCH',
    name: 'Mach Punch',
    type: 'FIGHTING',
    category: 'PHYSICAL',
    power: 40,
    accuracy: 100,
    pp: 30,
    priority: 1,
    animStyle: 'MELEE',
    effect: { type: 'NONE' },
    description: 'The user throws a punch at blinding speed. It is sure to strike first.'
  },

  CROSS_CHOP: {
    id: 'CROSS_CHOP',
    name: 'Cross Chop',
    type: 'FIGHTING',
    category: 'PHYSICAL',
    power: 100,
    accuracy: 80,
    pp: 5,
    priority: 0,
    animStyle: 'MELEE',
    effect: { type: 'NONE' },
    description: 'The user delivers a double chop with its forearms. Critical hits land more easily.'
  },

  BULK_UP: {
    id: 'BULK_UP',
    name: 'Bulk Up',
    type: 'FIGHTING',
    category: 'STATUS',
    power: null,
    accuracy: 999,
    pp: 20,
    priority: 0,
    animStyle: 'SELF',
    effect: { type: 'STAT_RAISE', stats: ['atk','def'], stages: 1, chance: 100, target: 'self' },
    description: 'The user tenses its muscles to bulk up its body, raising both its Attack and Defense stats.'
  },

  // ─────────────────────────────────────────────
  // POISON
  // ─────────────────────────────────────────────

  POISON_STING: {
    id: 'POISON_STING',
    name: 'Poison Sting',
    type: 'POISON',
    category: 'PHYSICAL',
    power: 15,
    accuracy: 100,
    pp: 35,
    priority: 0,
    animStyle: 'VORTEX',
    effect: { type: 'STATUS_CHANCE', status: 'POISON', chance: 30 },
    description: 'The user stabs the target with a poisonous stinger. It may also poison the target.'
  },

  POISON_FANG: {
    id: 'POISON_FANG',
    name: 'Poison Fang',
    type: 'POISON',
    category: 'PHYSICAL',
    power: 50,
    accuracy: 100,
    pp: 15,
    priority: 0,
    animStyle: 'VORTEX',
    effect: { type: 'STATUS_CHANCE', status: 'POISON', chance: 50 },
    description: 'The user bites the target with poisonous fangs. High chance of leaving the target badly poisoned.'
  },

  SLUDGE_BOMB: {
    id: 'SLUDGE_BOMB',
    name: 'Sludge Bomb',
    type: 'POISON',
    category: 'SPECIAL',
    power: 90,
    accuracy: 100,
    pp: 10,
    priority: 0,
    animStyle: 'VORTEX',
    effect: { type: 'STATUS_CHANCE', status: 'POISON', chance: 30 },
    description: 'Unsanitary sludge is hurled at the target. It may also poison the target.'
  },

  SLUDGE_WAVE: {
    id: 'SLUDGE_WAVE',
    name: 'Sludge Wave',
    type: 'POISON',
    category: 'SPECIAL',
    power: 95,
    accuracy: 100,
    pp: 10,
    priority: 0,
    animStyle: 'VORTEX',
    effect: { type: 'STATUS_CHANCE', status: 'POISON', chance: 10 },
    description: 'The user strikes everything around it by swamping the area with a giant sludge wave.'
  },

  TOXIC: {
    id: 'TOXIC',
    name: 'Toxic',
    type: 'POISON',
    category: 'STATUS',
    power: null,
    accuracy: 90,
    pp: 10,
    priority: 0,
    animStyle: 'FIELD',
    effect: { type: 'STATUS_CHANCE', status: 'POISON', chance: 100 },
    description: 'A move that leaves the target badly poisoned. Its poison damage worsens every turn.'
  },

  POISON_GAS: {
    id: 'POISON_GAS',
    name: 'Poison Gas',
    type: 'POISON',
    category: 'STATUS',
    power: null,
    accuracy: 90,
    pp: 40,
    priority: 0,
    animStyle: 'FIELD',
    effect: { type: 'STATUS_CHANCE', status: 'POISON', chance: 100 },
    description: 'A cloud of poison gas is sprayed in the face of opposing DinoMon, leaving them poisoned.'
  },

  VENOM_DRENCH: {
    id: 'VENOM_DRENCH',
    name: 'Venom Drench',
    type: 'POISON',
    category: 'STATUS',
    power: null,
    accuracy: 100,
    pp: 20,
    priority: 0,
    animStyle: 'FIELD',
    effect: { type: 'STAT_LOWER', stat: 'spAtk', stages: -1, chance: 100, target: 'opponent' },
    description: 'Opposing DinoMon are showered with a potent poison, lowering their Sp. Atk.'
  },

  // ─────────────────────────────────────────────
  // GROUND
  // ─────────────────────────────────────────────

  MUD_SLAP: {
    id: 'MUD_SLAP',
    name: 'Mud-Slap',
    type: 'GROUND',
    category: 'SPECIAL',
    power: 20,
    accuracy: 100,
    pp: 10,
    priority: 0,
    animStyle: 'WAVE',
    effect: { type: 'STAT_LOWER', stat: 'acc', stages: -1, chance: 100, target: 'opponent' },
    description: 'The user hurls mud in the target\'s face to inflict damage and lower its accuracy.'
  },

  SAND_ATTACK: {
    id: 'SAND_ATTACK',
    name: 'Sand Attack',
    type: 'GROUND',
    category: 'STATUS',
    power: null,
    accuracy: 100,
    pp: 15,
    priority: 0,
    animStyle: 'FIELD',
    effect: { type: 'STAT_LOWER', stat: 'acc', stages: -1, chance: 100, target: 'opponent' },
    description: 'Sand is hurled in the target\'s face, reducing its accuracy.'
  },

  BULLDOZE: {
    id: 'BULLDOZE',
    name: 'Bulldoze',
    type: 'GROUND',
    category: 'PHYSICAL',
    power: 60,
    accuracy: 100,
    pp: 20,
    priority: 0,
    animStyle: 'WAVE',
    effect: { type: 'STAT_LOWER', stat: 'spd', stages: -1, chance: 100, target: 'opponent' },
    description: 'The user stomps down on the ground and attacks everything in the area. Hit DinoMon\'s Speed stat is also lowered.'
  },

  BONE_RUSH: {
    id: 'BONE_RUSH',
    name: 'Bone Rush',
    type: 'GROUND',
    category: 'PHYSICAL',
    power: 25,
    accuracy: 90,
    pp: 10,
    priority: 0,
    animStyle: 'WAVE',
    effect: { type: 'MULTI', hits: [2, 5] },
    description: 'The user attacks the target by throwing bones rapidly. Strikes two to five times in a row.'
  },

  DIG: {
    id: 'DIG',
    name: 'Dig',
    type: 'GROUND',
    category: 'PHYSICAL',
    power: 80,
    accuracy: 100,
    pp: 10,
    priority: 0,
    animStyle: 'WAVE',
    effect: { type: 'TWO_TURN', chargeMsg: 'dug underground!' },
    description: 'The user burrows into the ground, then attacks on the next turn.'
  },

  EARTHQUAKE: {
    id: 'EARTHQUAKE',
    name: 'Earthquake',
    type: 'GROUND',
    category: 'PHYSICAL',
    power: 100,
    accuracy: 100,
    pp: 10,
    priority: 0,
    animStyle: 'WAVE',
    effect: { type: 'NONE' },
    description: 'The user sets off an earthquake that strikes every DinoMon around it.'
  },

  MAGNITUDE: {
    id: 'MAGNITUDE',
    name: 'Magnitude',
    type: 'GROUND',
    category: 'PHYSICAL',
    power: 70,
    accuracy: 100,
    pp: 30,
    priority: 0,
    animStyle: 'WAVE',
    effect: { type: 'NONE' },
    description: 'The user looses a ground-shaking quake affecting everyone around the user. Its power varies.'
  },

  FISSURE: {
    id: 'FISSURE',
    name: 'Fissure',
    type: 'GROUND',
    category: 'PHYSICAL',
    power: null,
    accuracy: 30,
    pp: 5,
    priority: 0,
    animStyle: 'WAVE',
    effect: { type: 'ONE_HIT_KO' },
    description: 'The user opens up a fissure in the ground and drops the target in. The target instantly faints if it hits.'
  },

  // ─────────────────────────────────────────────
  // FLYING
  // ─────────────────────────────────────────────

  GUST: {
    id: 'GUST',
    name: 'Gust',
    type: 'FLYING',
    category: 'SPECIAL',
    power: 40,
    accuracy: 100,
    pp: 35,
    priority: 0,
    animStyle: 'ARC',
    effect: { type: 'NONE' },
    description: 'A gust of wind is whipped up by wings and launched at the target to inflict damage.'
  },

  AERIAL_ACE: {
    id: 'AERIAL_ACE',
    name: 'Aerial Ace',
    type: 'FLYING',
    category: 'PHYSICAL',
    power: 60,
    accuracy: 999,
    pp: 20,
    priority: 0,
    animStyle: 'ARC',
    effect: { type: 'NONE' },
    description: 'The user confounds the target with speed, then slashes. This attack never misses.'
  },

  WING_ATTACK: {
    id: 'WING_ATTACK',
    name: 'Wing Attack',
    type: 'FLYING',
    category: 'PHYSICAL',
    power: 60,
    accuracy: 100,
    pp: 35,
    priority: 0,
    animStyle: 'ARC',
    effect: { type: 'NONE' },
    description: 'The target is struck with large, imposing wings spread wide to inflict damage.'
  },

  AIR_SLASH: {
    id: 'AIR_SLASH',
    name: 'Air Slash',
    type: 'FLYING',
    category: 'SPECIAL',
    power: 75,
    accuracy: 95,
    pp: 15,
    priority: 0,
    animStyle: 'ARC',
    effect: { type: 'FLINCH', chance: 30 },
    description: 'The user attacks with a blade of air that slices even the sky. It may cause the target to flinch.'
  },

  BRAVE_BIRD: {
    id: 'BRAVE_BIRD',
    name: 'Brave Bird',
    type: 'FLYING',
    category: 'PHYSICAL',
    power: 120,
    accuracy: 100,
    pp: 15,
    priority: 0,
    animStyle: 'ARC',
    effect: { type: 'RECOIL', fraction: 0.33 },
    description: 'The user tucks in its wings and charges from a low altitude. The user also takes serious damage.'
  },

  TAILWIND: {
    id: 'TAILWIND',
    name: 'Tailwind',
    type: 'FLYING',
    category: 'STATUS',
    power: null,
    accuracy: 999,
    pp: 15,
    priority: 0,
    animStyle: 'FIELD',
    effect: { type: 'STAT_RAISE', stat: 'spd', stages: 2, chance: 100, target: 'self' },
    description: 'The user whips up a turbulent whirlwind that sharply raises the Speed stat of the user\'s party.'
  },

  // ─────────────────────────────────────────────
  // PSYCHIC
  // ─────────────────────────────────────────────

  CONFUSION: {
    id: 'CONFUSION',
    name: 'Confusion',
    type: 'PSYCHIC',
    category: 'SPECIAL',
    power: 50,
    accuracy: 100,
    pp: 25,
    priority: 0,
    animStyle: 'PULSE',
    effect: { type: 'CONFUSE', chance: 10 },
    description: 'The target is hit by a weak telekinetic force. It may also leave the target confused.'
  },

  PSYBEAM: {
    id: 'PSYBEAM',
    name: 'Psybeam',
    type: 'PSYCHIC',
    category: 'SPECIAL',
    power: 65,
    accuracy: 100,
    pp: 20,
    priority: 0,
    animStyle: 'PULSE',
    effect: { type: 'CONFUSE', chance: 10 },
    description: 'The target is attacked with a peculiar ray. It may also leave the target confused.'
  },

  PSYCHIC_MOVE: {
    id: 'PSYCHIC_MOVE',
    name: 'Psychic',
    type: 'PSYCHIC',
    category: 'SPECIAL',
    power: 90,
    accuracy: 100,
    pp: 10,
    priority: 0,
    animStyle: 'PULSE',
    effect: { type: 'STAT_LOWER', stat: 'spDef', stages: -1, chance: 10, target: 'opponent' },
    description: 'The target is hit by a strong telekinetic force. It may also lower the target\'s Sp. Def stat.'
  },

  PSYSTRIKE: {
    id: 'PSYSTRIKE',
    name: 'Psystrike',
    type: 'PSYCHIC',
    category: 'SPECIAL',
    power: 100,
    accuracy: 100,
    pp: 10,
    priority: 0,
    animStyle: 'PULSE',
    effect: { type: 'NONE' },
    description: 'The user materializes an odd psychic wave to attack the target. This attack does physical damage.'
  },

  CALM_MIND: {
    id: 'CALM_MIND',
    name: 'Calm Mind',
    type: 'PSYCHIC',
    category: 'STATUS',
    power: null,
    accuracy: 999,
    pp: 20,
    priority: 0,
    animStyle: 'AURA',
    effect: { type: 'STAT_RAISE', stats: ['spAtk','spDef'], stages: 1, chance: 100, target: 'self' },
    description: 'The user quietly focuses its mind and calms its spirit to raise its Sp. Atk and Sp. Def stats.'
  },

  HYPNOSIS: {
    id: 'HYPNOSIS',
    name: 'Hypnosis',
    type: 'PSYCHIC',
    category: 'STATUS',
    power: null,
    accuracy: 60,
    pp: 20,
    priority: 0,
    animStyle: 'AURA',
    effect: { type: 'STATUS_CHANCE', status: 'SLEEP', chance: 100 },
    description: 'The user employs hypnotic suggestion to make the target fall into a deep sleep.'
  },

  FUTURE_SIGHT: {
    id: 'FUTURE_SIGHT',
    name: 'Future Sight',
    type: 'PSYCHIC',
    category: 'SPECIAL',
    power: 120,
    accuracy: 100,
    pp: 10,
    priority: 0,
    animStyle: 'PULSE',
    effect: { type: 'NONE' },
    description: 'Two turns after this move is used, a hunk of psychic energy attacks the target.'
  },

  // ─────────────────────────────────────────────
  // BUG
  // ─────────────────────────────────────────────

  STRING_SHOT: {
    id: 'STRING_SHOT',
    name: 'String Shot',
    type: 'BUG',
    category: 'STATUS',
    power: null,
    accuracy: 95,
    pp: 40,
    priority: 0,
    animStyle: 'FIELD',
    effect: { type: 'STAT_LOWER', stat: 'spd', stages: -2, chance: 100, target: 'opponent' },
    description: 'Opposing DinoMon are bound with silk blown from the user\'s mouth that harshly lowers their Speed stat.'
  },

  BUG_BITE: {
    id: 'BUG_BITE',
    name: 'Bug Bite',
    type: 'BUG',
    category: 'PHYSICAL',
    power: 60,
    accuracy: 100,
    pp: 20,
    priority: 0,
    animStyle: 'MULTI',
    effect: { type: 'NONE' },
    description: 'The user bites the target. If the target is holding a Berry, the user eats it and gains its effect.'
  },

  SIGNAL_BEAM: {
    id: 'SIGNAL_BEAM',
    name: 'Signal Beam',
    type: 'BUG',
    category: 'SPECIAL',
    power: 75,
    accuracy: 100,
    pp: 15,
    priority: 0,
    animStyle: 'MULTI',
    effect: { type: 'CONFUSE', chance: 10 },
    description: 'The user attacks with a sinister beam of light. It may also confuse the target.'
  },

  X_SCISSOR: {
    id: 'X_SCISSOR',
    name: 'X-Scissor',
    type: 'BUG',
    category: 'PHYSICAL',
    power: 80,
    accuracy: 100,
    pp: 15,
    priority: 0,
    animStyle: 'MULTI',
    effect: { type: 'NONE' },
    description: 'The user slashes at the target by crossing its scythes or claws as if they were a pair of scissors.'
  },

  LEECH_LIFE: {
    id: 'LEECH_LIFE',
    name: 'Leech Life',
    type: 'BUG',
    category: 'PHYSICAL',
    power: 80,
    accuracy: 100,
    pp: 10,
    priority: 0,
    animStyle: 'MULTI',
    effect: { type: 'DRAIN', fraction: 0.5 },
    description: 'The user drains the target\'s blood. The user\'s HP is restored by half the damage taken by the target.'
  },

  QUIVER_DANCE: {
    id: 'QUIVER_DANCE',
    name: 'Quiver Dance',
    type: 'BUG',
    category: 'STATUS',
    power: null,
    accuracy: 999,
    pp: 20,
    priority: 0,
    animStyle: 'FIELD',
    effect: { type: 'STAT_RAISE', stats: ['spAtk','spDef','spd'], stages: 1, chance: 100, target: 'self' },
    description: 'The user lightly performs a beautiful, mystic dance. It raises the user\'s Sp. Atk, Sp. Def, and Speed stats.'
  },

  // ─────────────────────────────────────────────
  // ROCK
  // ─────────────────────────────────────────────

  ROCK_THROW: {
    id: 'ROCK_THROW',
    name: 'Rock Throw',
    type: 'ROCK',
    category: 'PHYSICAL',
    power: 50,
    accuracy: 90,
    pp: 15,
    priority: 0,
    animStyle: 'ARC',
    effect: { type: 'NONE' },
    description: 'The user picks up and throws a small rock at the target to attack.'
  },

  ROCK_SLIDE: {
    id: 'ROCK_SLIDE',
    name: 'Rock Slide',
    type: 'ROCK',
    category: 'PHYSICAL',
    power: 75,
    accuracy: 90,
    pp: 10,
    priority: 0,
    animStyle: 'ARC',
    effect: { type: 'FLINCH', chance: 30 },
    description: 'Large boulders are hurled at the opposing DinoMon to inflict damage. It may also make them flinch.'
  },

  STONE_EDGE: {
    id: 'STONE_EDGE',
    name: 'Stone Edge',
    type: 'ROCK',
    category: 'PHYSICAL',
    power: 100,
    accuracy: 80,
    pp: 5,
    priority: 0,
    animStyle: 'ARC',
    effect: { type: 'NONE' },
    description: 'The user stabs the target from below with sharpened stones. Critical hits land more easily.'
  },

  ROCK_BLAST: {
    id: 'ROCK_BLAST',
    name: 'Rock Blast',
    type: 'ROCK',
    category: 'PHYSICAL',
    power: 25,
    accuracy: 90,
    pp: 10,
    priority: 0,
    animStyle: 'ARC',
    effect: { type: 'MULTI', hits: [2, 5] },
    description: 'The user hurls hard rocks at the target. Two to five rocks are launched in a row.'
  },

  ANCIENT_POWER: {
    id: 'ANCIENT_POWER',
    name: 'Ancient Power',
    type: 'ROCK',
    category: 'SPECIAL',
    power: 60,
    accuracy: 100,
    pp: 5,
    priority: 0,
    animStyle: 'BURST',
    effect: { type: 'OMNI_RAISE', chance: 10 },
    description: 'The user attacks with a prehistoric power. It may also raise all the user\'s stats at once.'
  },

  STEALTH_ROCK: {
    id: 'STEALTH_ROCK',
    name: 'Stealth Rock',
    type: 'ROCK',
    category: 'STATUS',
    power: null,
    accuracy: 999,
    pp: 20,
    priority: 0,
    animStyle: 'FIELD',
    effect: { type: 'STEALTH_ROCK' },
    description: 'The user lays a trap of levitating stones around the opposing team, damaging them upon switching in.'
  },

  SANDSTORM: {
    id: 'SANDSTORM',
    name: 'Sandstorm',
    type: 'ROCK',
    category: 'STATUS',
    power: null,
    accuracy: 999,
    pp: 10,
    priority: 0,
    animStyle: 'FIELD',
    effect: { type: 'SET_WEATHER', weather: 'SANDSTORM' },
    description: 'A five-turn sandstorm is summoned to hurt all combatants except Rock, Ground, and Steel types.'
  },

  // ─────────────────────────────────────────────
  // GHOST
  // ─────────────────────────────────────────────

  SHADOW_BALL: {
    id: 'SHADOW_BALL',
    name: 'Shadow Ball',
    type: 'GHOST',
    category: 'SPECIAL',
    power: 80,
    accuracy: 100,
    pp: 15,
    priority: 0,
    animStyle: 'VORTEX',
    effect: { type: 'STAT_LOWER', stat: 'spDef', stages: -1, chance: 20, target: 'opponent' },
    description: 'The user hurls a shadowy blob at the target. It may also lower the target\'s Sp. Def stat.'
  },

  SHADOW_CLAW: {
    id: 'SHADOW_CLAW',
    name: 'Shadow Claw',
    type: 'GHOST',
    category: 'PHYSICAL',
    power: 70,
    accuracy: 100,
    pp: 15,
    priority: 0,
    animStyle: 'VORTEX',
    effect: { type: 'NONE' },
    description: 'The user slashes with a sharp claw made from shadows. Critical hits land more easily.'
  },

  PHANTOM_FORCE: {
    id: 'PHANTOM_FORCE',
    name: 'Phantom Force',
    type: 'GHOST',
    category: 'PHYSICAL',
    power: 90,
    accuracy: 100,
    pp: 10,
    priority: 0,
    animStyle: 'VORTEX',
    effect: { type: 'TWO_TURN', chargeMsg: 'vanished from sight!' },
    description: 'The user vanishes, then strikes the target on the next turn. Passes through Protect.'
  },

  NIGHT_SHADE: {
    id: 'NIGHT_SHADE',
    name: 'Night Shade',
    type: 'GHOST',
    category: 'SPECIAL',
    power: null,
    accuracy: 100,
    pp: 15,
    priority: 0,
    animStyle: 'VORTEX',
    effect: { type: 'NONE' },
    description: 'The user makes the target see a frightening mirage. It inflicts damage matching the user\'s level.'
  },

  HEX: {
    id: 'HEX',
    name: 'Hex',
    type: 'GHOST',
    category: 'SPECIAL',
    power: 65,
    accuracy: 100,
    pp: 10,
    priority: 0,
    animStyle: 'VORTEX',
    effect: { type: 'NONE' },
    description: 'This relentless attack does massive damage to a target affected by status conditions.'
  },

  CONFUSE_RAY: {
    id: 'CONFUSE_RAY',
    name: 'Confuse Ray',
    type: 'GHOST',
    category: 'STATUS',
    power: null,
    accuracy: 100,
    pp: 10,
    priority: 0,
    animStyle: 'AURA',
    effect: { type: 'CONFUSE', chance: 100 },
    description: 'The target is exposed to a sinister ray that triggers confusion.'
  },

  // ─────────────────────────────────────────────
  // DRAGON
  // ─────────────────────────────────────────────

  DRAGON_RAGE: {
    id: 'DRAGON_RAGE',
    name: 'Dragon Rage',
    type: 'DRAGON',
    category: 'SPECIAL',
    power: 40,
    accuracy: 100,
    pp: 10,
    priority: 0,
    animStyle: 'BEAM',
    effect: { type: 'NONE' },
    description: 'This attack hits the target with a shock wave of pure rage. This attack always inflicts 40 HP damage.'
  },

  DRAGON_BREATH: {
    id: 'DRAGON_BREATH',
    name: 'Dragon Breath',
    type: 'DRAGON',
    category: 'SPECIAL',
    power: 60,
    accuracy: 100,
    pp: 20,
    priority: 0,
    animStyle: 'BEAM',
    effect: { type: 'STATUS_CHANCE', status: 'PARALYSIS', chance: 30 },
    description: 'The user exhales a mighty gust that inflicts damage. It may also leave the target with paralysis.'
  },

  DRAGON_CLAW: {
    id: 'DRAGON_CLAW',
    name: 'Dragon Claw',
    type: 'DRAGON',
    category: 'PHYSICAL',
    power: 80,
    accuracy: 100,
    pp: 15,
    priority: 0,
    animStyle: 'SLAM',
    effect: { type: 'NONE' },
    description: 'The user slashes the target with huge sharp claws.'
  },

  DRAGON_PULSE: {
    id: 'DRAGON_PULSE',
    name: 'Dragon Pulse',
    type: 'DRAGON',
    category: 'SPECIAL',
    power: 85,
    accuracy: 100,
    pp: 10,
    priority: 0,
    animStyle: 'BEAM',
    effect: { type: 'NONE' },
    description: 'The target is attacked with a shock wave generated by the user\'s gaping mouth.'
  },

  OUTRAGE: {
    id: 'OUTRAGE',
    name: 'Outrage',
    type: 'DRAGON',
    category: 'PHYSICAL',
    power: 120,
    accuracy: 100,
    pp: 10,
    priority: 0,
    animStyle: 'SLAM',
    effect: { type: 'CONFUSE', chance: 100, target: 'self' },
    description: 'The user rampages and attacks for two to three turns. The user then becomes confused.'
  },

  DRAGON_DANCE: {
    id: 'DRAGON_DANCE',
    name: 'Dragon Dance',
    type: 'DRAGON',
    category: 'STATUS',
    power: null,
    accuracy: 999,
    pp: 20,
    priority: 0,
    animStyle: 'AURA',
    effect: { type: 'STAT_RAISE', stats: ['atk','spd'], stages: 1, chance: 100, target: 'self' },
    description: 'The user vigorously performs a mystic, powerful dance that raises its Attack and Speed stats.'
  },

  DRACO_METEOR: {
    id: 'DRACO_METEOR',
    name: 'Draco Meteor',
    type: 'DRAGON',
    category: 'SPECIAL',
    power: 130,
    accuracy: 90,
    pp: 5,
    priority: 0,
    animStyle: 'BEAM',
    effect: { type: 'STAT_LOWER', stat: 'spAtk', stages: -2, chance: 100, target: 'self' },
    description: 'Comets are summoned down from the sky. The user\'s Sp. Atk harshly falls after use.'
  },

  // ─────────────────────────────────────────────
  // DARK
  // ─────────────────────────────────────────────

  BITE: {
    id: 'BITE',
    name: 'Bite',
    type: 'DARK',
    category: 'PHYSICAL',
    power: 60,
    accuracy: 100,
    pp: 25,
    priority: 0,
    animStyle: 'SLAM',
    effect: { type: 'FLINCH', chance: 30 },
    description: 'The target is bitten with viciously sharp fangs. It may make the target flinch.'
  },

  SNARL: {
    id: 'SNARL',
    name: 'Snarl',
    type: 'DARK',
    category: 'SPECIAL',
    power: 55,
    accuracy: 95,
    pp: 15,
    priority: 0,
    animStyle: 'AURA',
    effect: { type: 'STAT_LOWER', stat: 'spAtk', stages: -1, chance: 100, target: 'opponent' },
    description: 'The user yells as if it is ranting about something, making opposing DinoMon lose their focus. This lowers their Sp. Atk stat.'
  },

  CRUNCH: {
    id: 'CRUNCH',
    name: 'Crunch',
    type: 'DARK',
    category: 'PHYSICAL',
    power: 80,
    accuracy: 100,
    pp: 15,
    priority: 0,
    animStyle: 'SLAM',
    effect: { type: 'STAT_LOWER', stat: 'def', stages: -1, chance: 20, target: 'opponent' },
    description: 'The user crunches up the target with sharp fangs. It may also lower the target\'s Defense stat.'
  },

  DARK_PULSE: {
    id: 'DARK_PULSE',
    name: 'Dark Pulse',
    type: 'DARK',
    category: 'SPECIAL',
    power: 80,
    accuracy: 100,
    pp: 15,
    priority: 0,
    animStyle: 'AURA',
    effect: { type: 'FLINCH', chance: 20 },
    description: 'The user releases a horrible aura imbued with dark thoughts. It may also make the target flinch.'
  },

  FOUL_PLAY: {
    id: 'FOUL_PLAY',
    name: 'Foul Play',
    type: 'DARK',
    category: 'PHYSICAL',
    power: 95,
    accuracy: 100,
    pp: 15,
    priority: 0,
    animStyle: 'SLAM',
    effect: { type: 'NONE' },
    description: 'The user turns the target\'s power against it. The higher the target\'s Attack stat, the greater the damage it deals.'
  },

  NASTY_PLOT: {
    id: 'NASTY_PLOT',
    name: 'Nasty Plot',
    type: 'DARK',
    category: 'STATUS',
    power: null,
    accuracy: 999,
    pp: 20,
    priority: 0,
    animStyle: 'FIELD',
    effect: { type: 'STAT_RAISE', stat: 'spAtk', stages: 2, chance: 100, target: 'self' },
    description: 'The user stimulates its brain by thinking bad thoughts. This sharply raises the user\'s Sp. Atk stat.'
  },

  NIGHT_SLASH: {
    id: 'NIGHT_SLASH',
    name: 'Night Slash',
    type: 'DARK',
    category: 'PHYSICAL',
    power: 70,
    accuracy: 100,
    pp: 15,
    priority: 0,
    animStyle: 'SLAM',
    effect: { type: 'NONE' },
    description: 'The user slashes the target the instant an opportunity arises. Critical hits land more easily.'
  },

  // ─────────────────────────────────────────────
  // STEEL
  // ─────────────────────────────────────────────

  METAL_CLAW: {
    id: 'METAL_CLAW',
    name: 'Metal Claw',
    type: 'STEEL',
    category: 'PHYSICAL',
    power: 50,
    accuracy: 95,
    pp: 35,
    priority: 0,
    animStyle: 'SLAM',
    effect: { type: 'STAT_RAISE', stat: 'atk', stages: 1, chance: 10, target: 'self' },
    description: 'The target is raked with steel claws. It may also raise the user\'s Attack stat.'
  },

  BULLET_PUNCH: {
    id: 'BULLET_PUNCH',
    name: 'Bullet Punch',
    type: 'STEEL',
    category: 'PHYSICAL',
    power: 40,
    accuracy: 100,
    pp: 30,
    priority: 1,
    animStyle: 'SLAM',
    effect: { type: 'NONE' },
    description: 'The user strikes with a tough punch as fast as a bullet. It always goes first.'
  },

  IRON_HEAD: {
    id: 'IRON_HEAD',
    name: 'Iron Head',
    type: 'STEEL',
    category: 'PHYSICAL',
    power: 80,
    accuracy: 100,
    pp: 15,
    priority: 0,
    animStyle: 'SLAM',
    effect: { type: 'FLINCH', chance: 30 },
    description: 'The user slams the target with its steel-hard head. It may also make the target flinch.'
  },

  FLASH_CANNON: {
    id: 'FLASH_CANNON',
    name: 'Flash Cannon',
    type: 'STEEL',
    category: 'SPECIAL',
    power: 80,
    accuracy: 100,
    pp: 10,
    priority: 0,
    animStyle: 'BEAM',
    effect: { type: 'STAT_LOWER', stat: 'spDef', stages: -1, chance: 10, target: 'opponent' },
    description: 'The user gathers all its light energy and releases it at once. It may also lower the target\'s Sp. Def stat.'
  },

  STEEL_WING: {
    id: 'STEEL_WING',
    name: 'Steel Wing',
    type: 'STEEL',
    category: 'PHYSICAL',
    power: 70,
    accuracy: 90,
    pp: 25,
    priority: 0,
    animStyle: 'SLAM',
    effect: { type: 'STAT_RAISE', stat: 'def', stages: 1, chance: 10, target: 'self' },
    description: 'The user slams the target with its hard-edged wings. It may also raise the user\'s Defense stat.'
  },

  IRON_DEFENSE: {
    id: 'IRON_DEFENSE',
    name: 'Iron Defense',
    type: 'STEEL',
    category: 'STATUS',
    power: null,
    accuracy: 999,
    pp: 15,
    priority: 0,
    animStyle: 'SELF',
    effect: { type: 'STAT_RAISE', stat: 'def', stages: 2, chance: 100, target: 'self' },
    description: 'The user hardens its body\'s surface like iron, sharply raising its Defense stat.'
  },

  // ─────────────────────────────────────────────
  // FAIRY
  // ─────────────────────────────────────────────

  FAIRY_WIND: {
    id: 'FAIRY_WIND',
    name: 'Fairy Wind',
    type: 'FAIRY',
    category: 'SPECIAL',
    power: 40,
    accuracy: 100,
    pp: 30,
    priority: 0,
    animStyle: 'PULSE',
    effect: { type: 'NONE' },
    description: 'The user stirs up a fairy wind and strikes the target with it.'
  },

  DAZZLING_GLEAM: {
    id: 'DAZZLING_GLEAM',
    name: 'Dazzling Gleam',
    type: 'FAIRY',
    category: 'SPECIAL',
    power: 80,
    accuracy: 100,
    pp: 10,
    priority: 0,
    animStyle: 'PULSE',
    effect: { type: 'NONE' },
    description: 'The user damages opposing DinoMon by emitting a powerful flash.'
  },

  MOONBLAST: {
    id: 'MOONBLAST',
    name: 'Moonblast',
    type: 'FAIRY',
    category: 'SPECIAL',
    power: 95,
    accuracy: 100,
    pp: 15,
    priority: 0,
    animStyle: 'PULSE',
    effect: { type: 'STAT_LOWER', stat: 'spAtk', stages: -1, chance: 30, target: 'opponent' },
    description: 'Borrowing the power of the moon, the user attacks the target. It may also lower the target\'s Sp. Atk stat.'
  },

  PLAY_ROUGH: {
    id: 'PLAY_ROUGH',
    name: 'Play Rough',
    type: 'FAIRY',
    category: 'PHYSICAL',
    power: 90,
    accuracy: 90,
    pp: 10,
    priority: 0,
    animStyle: 'PULSE',
    effect: { type: 'STAT_LOWER', stat: 'atk', stages: -1, chance: 10, target: 'opponent' },
    description: 'The user plays rough with the target and attacks it. It may also lower the target\'s Attack stat.'
  },

  BABY_DOLL_EYES: {
    id: 'BABY_DOLL_EYES',
    name: 'Baby-Doll Eyes',
    type: 'FAIRY',
    category: 'STATUS',
    power: null,
    accuracy: 100,
    pp: 30,
    priority: 1,
    animStyle: 'AURA',
    effect: { type: 'STAT_LOWER', stat: 'atk', stages: -1, chance: 100, target: 'opponent' },
    description: 'The user stares at the target with its baby-doll eyes, which lowers the target\'s Attack stat. It always goes first.'
  },

  CHARM: {
    id: 'CHARM',
    name: 'Charm',
    type: 'FAIRY',
    category: 'STATUS',
    power: null,
    accuracy: 100,
    pp: 20,
    priority: 0,
    animStyle: 'AURA',
    effect: { type: 'STAT_LOWER', stat: 'atk', stages: -2, chance: 100, target: 'opponent' },
    description: 'The user gazes at the target rather charmingly, making it less wary. This harshly lowers the target\'s Attack stat.'
  },

  MOONLIGHT: {
    id: 'MOONLIGHT',
    name: 'Moonlight',
    type: 'FAIRY',
    category: 'STATUS',
    power: null,
    accuracy: 999,
    pp: 5,
    priority: 0,
    animStyle: 'AURA',
    effect: { type: 'HEAL', fraction: 0.5 },
    description: 'The user restores its own HP. The amount of HP regained varies with the weather.'
  },

  // ─────────────────────────────────────────────
  // SIGNATURE MOVES
  // ─────────────────────────────────────────────

  FRILL_FLARE: {
    id: 'FRILL_FLARE',
    name: 'Frill Flare',
    type: 'FIRE',
    category: 'SPECIAL',
    power: 65,
    accuracy: 100,
    pp: 15,
    priority: 0,
    animStyle: 'BURST',
    effect: { type: 'STAT_LOWER', stat: 'spDef', stages: -1, chance: 30, target: 'opponent' },
    description: 'The user fans its brilliant frill and unleashes a searing burst of flame. It may lower the foe\'s Sp. Def.'
  },

  ERUPTION_HORN: {
    id: 'ERUPTION_HORN',
    name: 'Eruption Horn',
    type: 'FIRE',
    category: 'SPECIAL',
    power: 50,
    accuracy: 90,
    pp: 5,
    priority: 0,
    animStyle: 'BURST',
    effect: { type: 'MULTI', hits: [2, 3] },
    description: 'The user charges and rams with volcanic horns erupting in fire. Strikes two to three times in a row.'
  },

  JADE_PLATE_SLAM: {
    id: 'JADE_PLATE_SLAM',
    name: 'Jade Plate Slam',
    type: 'GRASS',
    category: 'PHYSICAL',
    power: 110,
    accuracy: 100,
    pp: 10,
    priority: 0,
    animStyle: 'CONE',
    effect: { type: 'STAT_LOWER', stat: 'def', stages: -1, chance: 100, target: 'opponent' },
    description: 'The user drives its ancient jade-plated body into the foe with crushing force, always lowering the foe\'s Defense.'
  },

  ANCIENT_TORRENT: {
    id: 'ANCIENT_TORRENT',
    name: 'Ancient Torrent',
    type: 'WATER',
    category: 'SPECIAL',
    power: 130,
    accuracy: 999,
    pp: 5,
    priority: 0,
    animStyle: 'WAVE',
    effect: { type: 'NONE' },
    description: 'The user channels primal water energy into an unstoppable deluge that never misses and ignores stat changes.'
  },

  SKULL_SLAM: {
    id: 'SKULL_SLAM',
    name: 'Skull Slam',
    type: 'ROCK',
    category: 'PHYSICAL',
    power: 120,
    accuracy: 100,
    pp: 10,
    priority: 0,
    animStyle: 'ARC',
    effect: { type: 'NONE' },
    description: 'The user drives its fossilized skull into the foe at full force. High critical-hit ratio.'
  },

  VENOM_EARTH: {
    id: 'VENOM_EARTH',
    name: 'Venom Earth',
    type: 'PSYCHIC',
    category: 'SPECIAL',
    power: 95,
    accuracy: 100,
    pp: 10,
    priority: 0,
    animStyle: 'PULSE',
    effect: { type: 'STAT_LOWER', stat: 'spd', stages: -1, chance: 40, target: 'opponent' },
    description: 'The user projects psychic venom through the earth beneath the foe. It may sharply lower the foe\'s Speed.'
  },

  EXTINCTION_BEAM: {
    id: 'EXTINCTION_BEAM',
    name: 'Extinction Beam',
    type: 'FIRE',
    category: 'SPECIAL',
    power: 150,
    accuracy: 90,
    pp: 5,
    priority: 0,
    animStyle: 'BURST',
    effect: { type: 'STAT_LOWER', stat: 'spAtk', stages: -2, chance: 100, target: 'self' },
    description: 'The user fires a catastrophic beam of primordial fire. The enormous effort harshly lowers its own Sp. Atk.'
  },

  FOSSIL_MEMORY: {
    id: 'FOSSIL_MEMORY',
    name: 'Fossil Memory',
    type: 'PSYCHIC',
    category: 'SPECIAL',
    power: 120,
    accuracy: 999,
    pp: 5,
    priority: 0,
    animStyle: 'PULSE',
    effect: { type: 'NONE' },
    description: 'The user recalls ancient memories encoded in its bones and releases them as pure psychic force. Never misses.'
  },

  GLACIAL_MIND: {
    id: 'GLACIAL_MIND',
    name: 'Glacial Mind',
    type: 'WATER',
    category: 'SPECIAL',
    power: 110,
    accuracy: 100,
    pp: 10,
    priority: 0,
    animStyle: 'WAVE',
    effect: { type: 'STAT_LOWER', stat: 'spAtk', stages: -1, chance: 100, target: 'opponent' },
    description: 'The user attacks with a freezing torrent of focused water energy, always lowering the foe\'s Sp. Atk.'
  },

  MIND_DIVE: {
    id: 'MIND_DIVE',
    name: 'Mind Dive',
    type: 'DRAGON',
    category: 'PHYSICAL',
    power: 95,
    accuracy: 100,
    pp: 10,
    priority: 1,
    animStyle: 'SLAM',
    effect: { type: 'NONE' },
    description: 'The user dives into the foe\'s psyche with draconic force. Strikes with heightened priority.'
  },

  FOREST_CANOPY: {
    id: 'FOREST_CANOPY',
    name: 'Forest Canopy',
    type: 'GRASS',
    category: 'SPECIAL',
    power: 90,
    accuracy: 100,
    pp: 10,
    priority: 0,
    animStyle: 'CONE',
    effect: { type: 'NONE' },
    description: 'The user summons the power of an ancient forest canopy and unleashes it as a wave of solar energy.'
  },

  SAIL_BLAST: {
    id: 'SAIL_BLAST',
    name: 'Sail Blast',
    type: 'FIRE',
    category: 'SPECIAL',
    power: 75,
    accuracy: 100,
    pp: 15,
    priority: 0,
    animStyle: 'BURST',
    effect: { type: 'STATUS_CHANCE', status: 'BURN', chance: 20 },
    description: 'The user raises its sail-like crest to concentrate solar heat into a focused blast. It may also burn the target.'
  },

  CLUB_SMASH: {
    id: 'CLUB_SMASH',
    name: 'Club Smash',
    type: 'GROUND',
    category: 'PHYSICAL',
    power: 80,
    accuracy: 100,
    pp: 15,
    priority: 0,
    animStyle: 'WAVE',
    effect: { type: 'STAT_LOWER', stat: 'def', stages: -1, chance: 50, target: 'opponent' },
    description: 'The user pounds the foe with its massive tail club, sending shockwaves through its body. May lower Defense.'
  },

  PLATE_SLAM: {
    id: 'PLATE_SLAM',
    name: 'Plate Slam',
    type: 'GRASS',
    category: 'PHYSICAL',
    power: 80,
    accuracy: 100,
    pp: 15,
    priority: 1,
    animStyle: 'CONE',
    effect: { type: 'NONE' },
    description: 'The user charges with its armored plates leading. The reinforced strike always moves first.'
  },

  CRYSTAL_BEAM: {
    id: 'CRYSTAL_BEAM',
    name: 'Crystal Beam',
    type: 'PSYCHIC',
    category: 'SPECIAL',
    power: 85,
    accuracy: 100,
    pp: 10,
    priority: 0,
    animStyle: 'PULSE',
    effect: { type: 'STAT_LOWER', stat: 'spDef', stages: -1, chance: 30, target: 'opponent' },
    description: 'The user fires a crystalline beam of refracted psychic light. It may lower the foe\'s Sp. Def.'
  },

  DIVE_BOMB: {
    id: 'DIVE_BOMB',
    name: 'Dive Bomb',
    type: 'DRAGON',
    category: 'PHYSICAL',
    power: 100,
    accuracy: 95,
    pp: 10,
    priority: 0,
    animStyle: 'SLAM',
    effect: { type: 'NONE' },
    description: 'The user plummets from a great height onto the target. High critical-hit ratio.'
  },

  INFERNO_CHARGE: {
    id: 'INFERNO_CHARGE',
    name: 'Inferno Charge',
    type: 'FIRE',
    category: 'PHYSICAL',
    power: 85,
    accuracy: 100,
    pp: 10,
    priority: 0,
    animStyle: 'BURST',
    effect: { type: 'STAT_RAISE', stat: 'atk', stages: 1, chance: 100, target: 'self' },
    description: 'The user engulfs itself in fire and slams into the foe. The adrenaline of the charge raises the user\'s Attack.'
  },

  SONIC_PULSE: {
    id: 'SONIC_PULSE',
    name: 'Sonic Pulse',
    type: 'WATER',
    category: 'SPECIAL',
    power: 70,
    accuracy: 100,
    pp: 15,
    priority: 0,
    animStyle: 'WAVE',
    effect: { type: 'CONFUSE', chance: 40 },
    description: 'The user emits a disorienting pulse of pressurized water and sound. It may confuse the target.'
  },

  NECK_LASSO: {
    id: 'NECK_LASSO',
    name: 'Neck Lasso',
    type: 'WATER',
    category: 'PHYSICAL',
    power: 55,
    accuracy: 100,
    pp: 20,
    priority: 0,
    animStyle: 'WAVE',
    effect: { type: 'STAT_LOWER', stat: 'spd', stages: -1, chance: 100, target: 'opponent' },
    description: 'The user whips its long neck around the foe and drags it through water, always lowering the foe\'s Speed.'
  },


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

  SUBMISSION: {
    id: 'SUBMISSION', name: 'Submission', type: 'FIGHTING', category: 'PHYSICAL',
    power: 80, accuracy: 80, pp: 20, priority: 0, animStyle: 'SLAM',
    effect: { type: 'RECOIL', fraction: 0.25 },
    description: 'The user grabs the target and recklessly dives for the ground. The user also takes damage.'
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

  BONEMERANG: {
    id: 'BONEMERANG', name: 'Bonemerang', type: 'GROUND', category: 'PHYSICAL',
    power: 50, accuracy: 90, pp: 10, priority: 0, animStyle: 'ARC',
    effect: { type: 'MULTI', min: 2, max: 2 },
    description: 'The user throws the bone it holds. The bone hits the target twice — there and back.'
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

  PSYSHOCK: {
    id: 'PSYSHOCK', name: 'Psyshock', type: 'PSYCHIC', category: 'SPECIAL',
    power: 80, accuracy: 100, pp: 10, priority: 0, animStyle: 'PULSE',
    effect: { type: 'NONE' },
    description: 'The user materialises an odd psychic wave to attack the target. It hits using the target\'s Defense.'
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

  SHADOW_SNEAK: {
    id: 'SHADOW_SNEAK', name: 'Shadow Sneak', type: 'GHOST', category: 'PHYSICAL',
    power: 40, accuracy: 100, pp: 30, priority: 1, animStyle: 'PROJECTILE',
    effect: { type: 'NONE' },
    description: 'The user extends its shadow and attacks the target from behind. Always strikes first.'
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

  SWEET_KISS: {
    id: 'SWEET_KISS', name: 'Sweet Kiss', type: 'FAIRY', category: 'STATUS',
    power: null, accuracy: 75, pp: 10, priority: 0, animStyle: 'FIELD',
    effect: { type: 'CONFUSE', chance: 100, target: 'opponent' },
    description: 'The user kisses the target with a sweet, angelic cuteness that causes confusion.'
  },

  MISTY_TERRAIN: {
    id: 'MISTY_TERRAIN', name: 'Misty Terrain', type: 'FAIRY', category: 'STATUS',
    power: null, accuracy: 999, pp: 10, priority: 0, animStyle: 'FIELD',
    effect: { type: 'NONE' },
    description: 'The user covers the field in a mystical mist that protects from status conditions for five turns.'
  },

  LIGHT_OF_RUIN: {
    id: 'LIGHT_OF_RUIN', name: 'Light of Ruin', type: 'FAIRY', category: 'SPECIAL',
    power: 140, accuracy: 90, pp: 5, priority: 0, animStyle: 'BEAM',
    effect: { type: 'RECOIL', fraction: 0.5 },
    description: 'Drawing power from the Eternal Flower, the user fires a beam of energy. The user takes serious damage.'
  },




  // ═══════════════════════════════════════════════════════════
  // PHASE 1 BATCH 2 MOVES
  // ═══════════════════════════════════════════════════════════

  // ─────────────────────────────────────────────
  // NORMAL — batch 2
  // ─────────────────────────────────────────────

  STOMP: {
    id:'STOMP', name:'Stomp', type:'NORMAL', category:'PHYSICAL',
    power:65, accuracy:100, pp:20, priority:0, animStyle:'SLAM',
    effect:{type:'FLINCH', chance:30},
    description:'The target is stomped with a big foot. It may also make the target flinch.'
  },
  STRENGTH: {
    id:'STRENGTH', name:'Strength', type:'NORMAL', category:'PHYSICAL',
    power:80, accuracy:100, pp:15, priority:0, animStyle:'MELEE',
    effect:{type:'NONE'},
    description:'The target is slugged with a punch thrown at maximum power.'
  },
  MEGA_KICK: {
    id:'MEGA_KICK', name:'Mega Kick', type:'NORMAL', category:'PHYSICAL',
    power:120, accuracy:75, pp:5, priority:0, animStyle:'SLAM',
    effect:{type:'NONE'},
    description:'The target is attacked by a kick launched with muscle-packed power.'
  },
  DIZZY_PUNCH: {
    id:'DIZZY_PUNCH', name:'Dizzy Punch', type:'NORMAL', category:'PHYSICAL',
    power:70, accuracy:100, pp:10, priority:0, animStyle:'MELEE',
    effect:{type:'CONFUSE', chance:20, target:'opponent'},
    description:'The target is hit with rhythmically launched punches. It may also leave the target confused.'
  },
  TAUNT: {
    id:'TAUNT', name:'Taunt', type:'NORMAL', category:'STATUS',
    power:null, accuracy:100, pp:20, priority:0, animStyle:'FIELD',
    effect:{type:'STAT_LOWER', stat:'spAtk', stages:-1, chance:100, target:'opponent'},
    description:'The user taunts the target into a rage that allows it to use only attack moves for three turns.'
  },
  YAWN: {
    id:'YAWN', name:'Yawn', type:'NORMAL', category:'STATUS',
    power:null, accuracy:999, pp:10, priority:0, animStyle:'FIELD',
    effect:{type:'STATUS_CHANCE', status:'SLEEP', chance:100},
    description:'The user lets loose a huge yawn that lulls the target into falling asleep on the next turn.'
  },
  SNORE: {
    id:'SNORE', name:'Snore', type:'NORMAL', category:'SPECIAL',
    power:50, accuracy:100, pp:15, priority:0, animStyle:'WAVE',
    effect:{type:'FLINCH', chance:30},
    description:'A loud attack that can be used only while asleep. It may also make the target flinch.'
  },
  ENDEAVOR: {
    id:'ENDEAVOR', name:'Endeavor', type:'NORMAL', category:'PHYSICAL',
    power:null, accuracy:100, pp:5, priority:0, animStyle:'SLAM',
    effect:{type:'NONE'},
    description:'An attack move that cuts down the opposing DinoMons HP to equal the users HP.'
  },
  HELPING_HAND: {
    id:'HELPING_HAND', name:'Helping Hand', type:'NORMAL', category:'STATUS',
    power:null, accuracy:999, pp:20, priority:5, animStyle:'SELF',
    effect:{type:'STAT_RAISE', stat:'atk', stages:1, chance:100, target:'self'},
    description:'The user assists an ally by boosting the power of its attack. Raises Attack.'
  },
  COSMIC_POWER: {
    id:'COSMIC_POWER', name:'Cosmic Power', type:'NORMAL', category:'STATUS',
    power:null, accuracy:999, pp:20, priority:0, animStyle:'AURA',
    effect:{type:'STAT_RAISE', stats:['def','spDef'], stages:1, chance:100, target:'self'},
    description:'The user absorbs a mystical power from space to raise its Defense and Sp. Def stats.'
  },
  SKULL_BASH: {
    id:'SKULL_BASH', name:'Skull Bash', type:'NORMAL', category:'PHYSICAL',
    power:130, accuracy:100, pp:10, priority:0, animStyle:'SLAM',
    effect:{type:'TWO_TURN', chargeMsg:'is lowering its head!'},
    description:'The user tucks in its head to raise its Defense stat on the first turn, then attacks on the next.'
  },
  BELLY_DRUM: {
    id:'BELLY_DRUM', name:'Belly Drum', type:'NORMAL', category:'STATUS',
    power:null, accuracy:999, pp:10, priority:0, animStyle:'SELF',
    effect:{type:'STAT_RAISE', stat:'atk', stages:3, chance:100, target:'self'},
    description:'The user maximises its Attack stat in exchange for half its max HP.'
  },

  // ─────────────────────────────────────────────
  // FIRE — batch 2
  // ─────────────────────────────────────────────

  FLAME_BURST: {
    id:'FLAME_BURST', name:'Flame Burst', type:'FIRE', category:'SPECIAL',
    power:70, accuracy:100, pp:15, priority:0, animStyle:'BURST',
    effect:{type:'STATUS_CHANCE', status:'BURN', chance:30},
    description:'The user attacks the target with a burst of flame. May leave a burn.'
  },
  SACRED_FIRE: {
    id:'SACRED_FIRE', name:'Sacred Fire', type:'FIRE', category:'PHYSICAL',
    power:100, accuracy:95, pp:5, priority:0, animStyle:'BURST',
    effect:{type:'STATUS_CHANCE', status:'BURN', chance:50},
    description:'The target is razed with a mystical fire of great power. It may leave the target with a burn.'
  },
  HEAT_CRASH: {
    id:'HEAT_CRASH', name:'Heat Crash', type:'FIRE', category:'PHYSICAL',
    power:100, accuracy:100, pp:10, priority:0, animStyle:'SLAM',
    effect:{type:'NONE'},
    description:'The user slams down on the target with its burning body. Heavier users hit harder.'
  },
  TORCH_SONG: {
    id:'TORCH_SONG', name:'Torch Song', type:'FIRE', category:'SPECIAL',
    power:80, accuracy:100, pp:10, priority:0, animStyle:'BEAM',
    effect:{type:'STAT_RAISE', stat:'spAtk', stages:1, chance:100, target:'self'},
    description:'The user attacks with torchlight that it controls. This also raises the users Sp. Atk.'
  },
  BURNING_JEALOUSY: {
    id:'BURNING_JEALOUSY', name:'Burning Jealousy', type:'FIRE', category:'SPECIAL',
    power:70, accuracy:100, pp:5, priority:0, animStyle:'VORTEX',
    effect:{type:'STATUS_CHANCE', status:'BURN', chance:100},
    description:'The user lets out flares of jealousy that always leave the target with a burn.'
  },
  FIRE_PLEDGE: {
    id:'FIRE_PLEDGE', name:'Fire Pledge', type:'FIRE', category:'SPECIAL',
    power:80, accuracy:100, pp:10, priority:0, animStyle:'CONE',
    effect:{type:'NONE'},
    description:'A column of fire hits the target. Combined with Water Pledge, it creates a rainbow.'
  },
  CINDER_STORM: {
    id:'CINDER_STORM', name:'Cinder Storm', type:'FIRE', category:'SPECIAL',
    power:95, accuracy:85, pp:10, priority:0, animStyle:'VORTEX',
    effect:{type:'STATUS_CHANCE', status:'BURN', chance:20},
    description:'A fierce storm of smouldering embers engulfs the target. May cause burns.'
  },
  MAGMA_PLEDGE: {
    id:'MAGMA_PLEDGE', name:'Magma Pledge', type:'FIRE', category:'PHYSICAL',
    power:85, accuracy:100, pp:10, priority:0, animStyle:'ARC',
    effect:{type:'NONE'},
    description:'The user launches a blazing rock at the target. A slow but devastating strike.'
  },
  HOT_SPRING: {
    id:'HOT_SPRING', name:'Hot Spring', type:'FIRE', category:'STATUS',
    power:null, accuracy:999, pp:10, priority:0, animStyle:'FIELD',
    effect:{type:'HEAL', fraction:0.5},
    description:'The user soaks in a natural hot spring, restoring half its HP with soothing heat.'
  },
  ERUPTION_SURGE: {
    id:'ERUPTION_SURGE', name:'Eruption Surge', type:'FIRE', category:'SPECIAL',
    power:120, accuracy:90, pp:5, priority:0, animStyle:'BURST',
    effect:{type:'RECOIL', fraction:0.25},
    description:'The user erupts with volcanic fury. The intense heat also damages the user slightly.'
  },
  DRAGON_FIRE: {
    id:'DRAGON_FIRE', name:'Dragon Fire', type:'FIRE', category:'SPECIAL',
    power:100, accuracy:85, pp:10, priority:0, animStyle:'CONE',
    effect:{type:'STATUS_CHANCE', status:'BURN', chance:20},
    description:'Superheated dragon breath scorches everything in its path. May cause burns.'
  },
  EMBER_BURST: {
    id:'EMBER_BURST', name:'Ember Burst', type:'FIRE', category:'PHYSICAL',
    power:55, accuracy:100, pp:20, priority:0, animStyle:'MULTI',
    effect:{type:'MULTI', min:2, max:3},
    description:'The user launches two to three bursts of flame in quick succession.'
  },

  // ─────────────────────────────────────────────
  // WATER — batch 2
  // ─────────────────────────────────────────────

  SOAK: {
    id:'SOAK', name:'Soak', type:'WATER', category:'STATUS',
    power:null, accuracy:100, pp:20, priority:0, animStyle:'FIELD',
    effect:{type:'STAT_LOWER', stat:'spDef', stages:-1, chance:100, target:'opponent'},
    description:'The user shoots a torrent of water to drench the target, lowering its Sp. Def.'
  },
  DIVE: {
    id:'DIVE', name:'Dive', type:'WATER', category:'PHYSICAL',
    power:80, accuracy:100, pp:10, priority:0, animStyle:'ARC',
    effect:{type:'TWO_TURN', chargeMsg:'dove underwater!'},
    description:'The user dives to the bottom on the first turn, then attacks on the next turn.'
  },
  WATER_PULSE: {
    id:'WATER_PULSE', name:'Water Pulse', type:'WATER', category:'SPECIAL',
    power:60, accuracy:100, pp:20, priority:0, animStyle:'PULSE',
    effect:{type:'CONFUSE', chance:20, target:'opponent'},
    description:'The user attacks the target with a pulsing blast of water. It may also confuse the target.'
  },
  WATER_SHURIKEN: {
    id:'WATER_SHURIKEN', name:'Water Shuriken', type:'WATER', category:'PHYSICAL',
    power:15, accuracy:100, pp:20, priority:1, animStyle:'MULTI',
    effect:{type:'MULTI', min:2, max:5},
    description:'The user flings water shuriken at the target two to five times. Always goes first.'
  },
  STEAM_ERUPTION: {
    id:'STEAM_ERUPTION', name:'Steam Eruption', type:'WATER', category:'SPECIAL',
    power:110, accuracy:95, pp:5, priority:0, animStyle:'BURST',
    effect:{type:'STATUS_CHANCE', status:'BURN', chance:30},
    description:'Superheated steam is fired at the target. It may also leave the target with a burn.'
  },
  FLIP_TURN: {
    id:'FLIP_TURN', name:'Flip Turn', type:'WATER', category:'PHYSICAL',
    power:60, accuracy:100, pp:20, priority:0, animStyle:'MELEE',
    effect:{type:'NONE'},
    description:'The user strikes the target and then moves back. Deals physical water damage.'
  },
  SNIPE_SHOT: {
    id:'SNIPE_SHOT', name:'Snipe Shot', type:'WATER', category:'SPECIAL',
    power:80, accuracy:100, pp:15, priority:0, animStyle:'PROJECTILE',
    effect:{type:'NONE'},
    description:'The user ignores the effects of opposing moves and drops on the target to attack. High crit rate.'
  },
  WAVE_CRASH: {
    id:'WAVE_CRASH', name:'Wave Crash', type:'WATER', category:'PHYSICAL',
    power:120, accuracy:100, pp:10, priority:0, animStyle:'SLAM',
    effect:{type:'RECOIL', fraction:0.33},
    description:'The user shrouds itself in a huge wave and crashes into the target. This also damages the user.'
  },
  AQUA_RING: {
    id:'AQUA_RING', name:'Aqua Ring', type:'WATER', category:'STATUS',
    power:null, accuracy:999, pp:20, priority:0, animStyle:'SELF',
    effect:{type:'HEAL', fraction:0.25},
    description:'The user envelops itself in a veil made of water, restoring its HP a little every turn.'
  },
  TIDAL_STORM: {
    id:'TIDAL_STORM', name:'Tidal Storm', type:'WATER', category:'SPECIAL',
    power:100, accuracy:85, pp:5, priority:0, animStyle:'VORTEX',
    effect:{type:'STAT_LOWER', stat:'spd', stages:-1, chance:30, target:'opponent'},
    description:'A massive tidal surge crashes over the target. May slow the target.'
  },
  HYDRO_STEAM: {
    id:'HYDRO_STEAM', name:'Hydro Steam', type:'WATER', category:'SPECIAL',
    power:80, accuracy:100, pp:15, priority:0, animStyle:'CONE',
    effect:{type:'NONE'},
    description:'The user blasts the target with superheated water vapour. Power doubles in sunlight.'
  },
  OCEANIC_OPERETTA: {
    id:'OCEANIC_OPERETTA', name:'Oceanic Operetta', type:'WATER', category:'SPECIAL',
    power:195, accuracy:100, pp:1, priority:0, animStyle:'WAVE',
    effect:{type:'NONE'},
    description:'A once-per-battle aquatic aria that unleashes a massive wave of ancient ocean power.'
  },

  // ─────────────────────────────────────────────
  // GRASS — batch 2
  // ─────────────────────────────────────────────

  PETAL_BLIZZARD: {
    id:'PETAL_BLIZZARD', name:'Petal Blizzard', type:'GRASS', category:'PHYSICAL',
    power:90, accuracy:100, pp:15, priority:0, animStyle:'BURST',
    effect:{type:'NONE'},
    description:'The user stirs up a violent petal blizzard and attacks everything around it.'
  },
  STRENGTH_SAP: {
    id:'STRENGTH_SAP', name:'Strength Sap', type:'GRASS', category:'STATUS',
    power:null, accuracy:100, pp:10, priority:0, animStyle:'DRAIN',
    effect:{type:'STAT_LOWER', stat:'atk', stages:-1, chance:100, target:'opponent'},
    description:'The user saps the targets power and heals itself by the amount of Attack the target has.'
  },
  SNAP_TRAP: {
    id:'SNAP_TRAP', name:'Snap Trap', type:'GRASS', category:'PHYSICAL',
    power:35, accuracy:100, pp:15, priority:0, animStyle:'MELEE',
    effect:{type:'NONE'},
    description:'The user snares the target in a snap trap. The target is then damaged every turn.'
  },
  HORN_LEECH: {
    id:'HORN_LEECH', name:'Horn Leech', type:'GRASS', category:'PHYSICAL',
    power:75, accuracy:100, pp:10, priority:0, animStyle:'DRAIN',
    effect:{type:'DRAIN', fraction:0.5},
    description:'The user drains the targets energy using its horns, restoring HP by half the damage dealt.'
  },
  WORRY_SEED: {
    id:'WORRY_SEED', name:'Worry Seed', type:'GRASS', category:'STATUS',
    power:null, accuracy:100, pp:10, priority:0, animStyle:'FIELD',
    effect:{type:'STAT_LOWER', stat:'spDef', stages:-1, chance:100, target:'opponent'},
    description:'A seed that causes worry is planted on the target, lowering its Sp. Def stat.'
  },
  STICKY_WEB: {
    id:'STICKY_WEB', name:'Sticky Web', type:'GRASS', category:'STATUS',
    power:null, accuracy:999, pp:20, priority:0, animStyle:'FIELD',
    effect:{type:'STAT_LOWER', stat:'spd', stages:-1, chance:100, target:'opponent'},
    description:'The user weaves a sticky net around the opposing team. Lowers Speed of foes that switch in.'
  },
  FLORAL_HEALING: {
    id:'FLORAL_HEALING', name:'Floral Healing', type:'GRASS', category:'STATUS',
    power:null, accuracy:999, pp:10, priority:0, animStyle:'SELF',
    effect:{type:'HEAL', fraction:0.5},
    description:'The user restores the targets HP using the power of flowers, healing up to half max HP.'
  },
  FRENZY_PLANT: {
    id:'FRENZY_PLANT', name:'Frenzy Plant', type:'GRASS', category:'SPECIAL',
    power:150, accuracy:90, pp:5, priority:0, animStyle:'BURST',
    effect:{type:'RECHARGE'},
    description:'The user slams the target with enormous roots. The user must rest on the next turn.'
  },
  LEAF_BLADE: {
    id:'LEAF_BLADE', name:'Leaf Blade', type:'GRASS', category:'PHYSICAL',
    power:90, accuracy:100, pp:15, priority:0, animStyle:'MELEE',
    effect:{type:'NONE'},
    description:'The user handles a sharp leaf like a sword to slash the target. High critical-hit ratio.'
  },
  JUNGLE_HEALING: {
    id:'JUNGLE_HEALING', name:'Jungle Healing', type:'GRASS', category:'STATUS',
    power:null, accuracy:999, pp:10, priority:0, animStyle:'FIELD',
    effect:{type:'HEAL', fraction:0.25},
    description:'The user draws on the healing power of the jungle, restoring HP and curing status.'
  },
  TRAILBLAZE: {
    id:'TRAILBLAZE', name:'Trailblaze', type:'GRASS', category:'PHYSICAL',
    power:50, accuracy:100, pp:20, priority:0, animStyle:'MELEE',
    effect:{type:'STAT_RAISE', stat:'spd', stages:1, chance:100, target:'self'},
    description:'The user attacks suddenly, leaving a trail of grass. Always raises the users Speed.'
  },
  MATCHA_GOTCHA: {
    id:'MATCHA_GOTCHA', name:'Matcha Gotcha', type:'GRASS', category:'SPECIAL',
    power:80, accuracy:90, pp:15, priority:0, animStyle:'CONE',
    effect:{type:'DRAIN', fraction:0.25},
    description:'The user fires a paste of concentrated grass energy that restores some HP on hit.'
  },

  // ─────────────────────────────────────────────
  // ELECTRIC — batch 2
  // ─────────────────────────────────────────────

  THUNDER_FANG: {
    id:'THUNDER_FANG', name:'Thunder Fang', type:'ELECTRIC', category:'PHYSICAL',
    power:65, accuracy:95, pp:15, priority:0, animStyle:'MELEE',
    effect:{type:'STATUS_CHANCE', status:'PARALYSIS', chance:10},
    description:'The user bites with electrified fangs. May cause paralysis or flinching.'
  },
  VOLT_SWITCH: {
    id:'VOLT_SWITCH', name:'Volt Switch', type:'ELECTRIC', category:'SPECIAL',
    power:70, accuracy:100, pp:20, priority:0, animStyle:'PROJECTILE',
    effect:{type:'NONE'},
    description:'The user attacks, then charges away to let a party member take over the battle.'
  },
  THUNDER_PUNCH: {
    id:'THUNDER_PUNCH', name:'Thunder Punch', type:'ELECTRIC', category:'PHYSICAL',
    power:75, accuracy:100, pp:15, priority:0, animStyle:'MELEE',
    effect:{type:'STATUS_CHANCE', status:'PARALYSIS', chance:10},
    description:'The target is punched with an electrified fist. It may also leave the target with paralysis.'
  },
  BOLT_BEAK: {
    id:'BOLT_BEAK', name:'Bolt Beak', type:'ELECTRIC', category:'PHYSICAL',
    power:85, accuracy:100, pp:10, priority:0, animStyle:'MELEE',
    effect:{type:'NONE'},
    description:'The user stabs the target with a sharp beak of electricity. Power doubles if user moves first.'
  },
  THUNDER_CAGE: {
    id:'THUNDER_CAGE', name:'Thunder Cage', type:'ELECTRIC', category:'SPECIAL',
    power:80, accuracy:90, pp:15, priority:0, animStyle:'VORTEX',
    effect:{type:'STATUS_CHANCE', status:'PARALYSIS', chance:30},
    description:'The user traps the target in a cage of electric bolts. May also paralyse the target.'
  },
  PLASMA_FISTS: {
    id:'PLASMA_FISTS', name:'Plasma Fists', type:'ELECTRIC', category:'PHYSICAL',
    power:100, accuracy:100, pp:15, priority:0, animStyle:'MELEE',
    effect:{type:'NONE'},
    description:'The user attacks with plasma-coated fists. A powerful close-range electric strike.'
  },
  ELECTRIC_TERRAIN: {
    id:'ELECTRIC_TERRAIN', name:'Electric Terrain', type:'ELECTRIC', category:'STATUS',
    power:null, accuracy:999, pp:10, priority:0, animStyle:'FIELD',
    effect:{type:'STAT_RAISE', stat:'spAtk', stages:1, chance:100, target:'self'},
    description:'The user electrifies the battlefield, grounding opponents and boosting Electric moves.'
  },
  LIGHTNING_LANCE: {
    id:'LIGHTNING_LANCE', name:'Lightning Lance', type:'ELECTRIC', category:'SPECIAL',
    power:110, accuracy:90, pp:5, priority:0, animStyle:'BEAM',
    effect:{type:'STATUS_CHANCE', status:'PARALYSIS', chance:30},
    description:'A massive lance of electricity pierces the target. May cause paralysis.'
  },
  THUNDER_STRIKE: {
    id:'THUNDER_STRIKE', name:'Thunder Strike', type:'ELECTRIC', category:'PHYSICAL',
    power:90, accuracy:100, pp:10, priority:0, animStyle:'SLAM',
    effect:{type:'STATUS_CHANCE', status:'PARALYSIS', chance:20},
    description:'The user strikes down with a bolt of concentrated lightning. May cause paralysis.'
  },
  ZAPPY_SLASH: {
    id:'ZAPPY_SLASH', name:'Zappy Slash', type:'ELECTRIC', category:'PHYSICAL',
    power:70, accuracy:100, pp:15, priority:0, animStyle:'MELEE',
    effect:{type:'NONE'},
    description:'The user slashes with electricity-charged claws. High critical-hit ratio.'
  },
  OVERDRIVE: {
    id:'OVERDRIVE', name:'Overdrive', type:'ELECTRIC', category:'SPECIAL',
    power:80, accuracy:100, pp:10, priority:0, animStyle:'PULSE',
    effect:{type:'STAT_LOWER', stat:'spDef', stages:-1, chance:30, target:'opponent'},
    description:'The user blasts the target with maximum electrical output. May lower Sp. Def.'
  },

  // ─────────────────────────────────────────────
  // ICE — batch 2
  // ─────────────────────────────────────────────

  ICICLE_SPEAR: {
    id:'ICICLE_SPEAR', name:'Icicle Spear', type:'ICE', category:'PHYSICAL',
    power:25, accuracy:100, pp:30, priority:0, animStyle:'MULTI',
    effect:{type:'MULTI', min:2, max:5},
    description:'The user launches sharp icicles at the target two to five times in a row.'
  },
  AVALANCHE: {
    id:'AVALANCHE', name:'Avalanche', type:'ICE', category:'PHYSICAL',
    power:60, accuracy:100, pp:10, priority:-4, animStyle:'SLAM',
    effect:{type:'NONE'},
    description:'The user crashes down on the target with an avalanche. Power doubles if the user was hit first.'
  },
  ICE_FANG: {
    id:'ICE_FANG', name:'Ice Fang', type:'ICE', category:'PHYSICAL',
    power:65, accuracy:95, pp:15, priority:0, animStyle:'MELEE',
    effect:{type:'STATUS_CHANCE', status:'FREEZE', chance:10},
    description:'The user bites with cold-infused fangs. It may also make the target flinch or freeze.'
  },
  ICE_SPINNER: {
    id:'ICE_SPINNER', name:'Ice Spinner', type:'ICE', category:'PHYSICAL',
    power:80, accuracy:100, pp:15, priority:0, animStyle:'MELEE',
    effect:{type:'NONE'},
    description:'The user spins rapidly on a coat of ice to crash into the target, removing terrain effects.'
  },
  FREEZE_GLARE: {
    id:'FREEZE_GLARE', name:'Freeze Glare', type:'ICE', category:'SPECIAL',
    power:90, accuracy:100, pp:10, priority:0, animStyle:'BEAM',
    effect:{type:'STATUS_CHANCE', status:'FREEZE', chance:10},
    description:'The user shoots a cold beam from its eyes. It may also leave the target frozen.'
  },
  MOUNTAIN_GALE: {
    id:'MOUNTAIN_GALE', name:'Mountain Gale', type:'ICE', category:'PHYSICAL',
    power:100, accuracy:85, pp:10, priority:0, animStyle:'SLAM',
    effect:{type:'FLINCH', chance:30},
    description:'The user hurls large chunks of ice at the target. It may also make the target flinch.'
  },
  BLIZZARD_LANCE: {
    id:'BLIZZARD_LANCE', name:'Blizzard Lance', type:'ICE', category:'SPECIAL',
    power:110, accuracy:90, pp:5, priority:0, animStyle:'CONE',
    effect:{type:'STATUS_CHANCE', status:'FREEZE', chance:10},
    description:'A concentrated lance of blizzard energy strikes the target. May cause freeze.'
  },
  CHILLY_RECEPTION: {
    id:'CHILLY_RECEPTION', name:'Chilly Reception', type:'ICE', category:'STATUS',
    power:null, accuracy:999, pp:10, priority:0, animStyle:'FIELD',
    effect:{type:'SET_WEATHER', weather:'HAIL'},
    description:'The user tells a horrible joke to summon a blizzard. Switches in snowfall and retreats.'
  },
  SHEER_COLD: {
    id:'SHEER_COLD', name:'Sheer Cold', type:'ICE', category:'SPECIAL',
    power:null, accuracy:30, pp:5, priority:0, animStyle:'VORTEX',
    effect:{type:'ONE_HIT_KO'},
    description:'The target is attacked with a blast of absolute-zero cold. A one-hit KO if it connects.'
  },
  SUBZERO_SLAMMER: {
    id:'SUBZERO_SLAMMER', name:'Subzero Slammer', type:'ICE', category:'PHYSICAL',
    power:120, accuracy:100, pp:5, priority:0, animStyle:'SLAM',
    effect:{type:'NONE'},
    description:'The user body-slams the target with the force of a collapsing glacier.'
  },
  GLACIAL_LANCE: {
    id:'GLACIAL_LANCE', name:'Glacial Lance', type:'ICE', category:'PHYSICAL',
    power:130, accuracy:100, pp:5, priority:0, animStyle:'ARC',
    effect:{type:'NONE'},
    description:'The user hurls a giant icicle lance at the target with overwhelming force.'
  },
  ICE_SHARD_STORM: {
    id:'ICE_SHARD_STORM', name:'Ice Shard Storm', type:'ICE', category:'SPECIAL',
    power:65, accuracy:100, pp:15, priority:0, animStyle:'BURST',
    effect:{type:'STATUS_CHANCE', status:'FREEZE', chance:20},
    description:'A storm of razor-sharp ice shards erupts around the target. May freeze.'
  },

  // ─────────────────────────────────────────────
  // FIGHTING — batch 2
  // ─────────────────────────────────────────────

  LOW_KICK: {
    id:'LOW_KICK', name:'Low Kick', type:'FIGHTING', category:'PHYSICAL',
    power:50, accuracy:100, pp:20, priority:0, animStyle:'MELEE',
    effect:{type:'NONE'},
    description:'A powerful low kick that makes the target trip. Heavier targets take more damage.'
  },
  LOW_SWEEP: {
    id:'LOW_SWEEP', name:'Low Sweep', type:'FIGHTING', category:'PHYSICAL',
    power:65, accuracy:100, pp:20, priority:0, animStyle:'MELEE',
    effect:{type:'STAT_LOWER', stat:'spd', stages:-1, chance:100, target:'opponent'},
    description:'The user makes a swift attack on the targets legs. This always lowers the targets Speed.'
  },
  ROCK_SMASH: {
    id:'ROCK_SMASH', name:'Rock Smash', type:'FIGHTING', category:'PHYSICAL',
    power:40, accuracy:100, pp:15, priority:0, animStyle:'SLAM',
    effect:{type:'STAT_LOWER', stat:'def', stages:-1, chance:50, target:'opponent'},
    description:'The user attacks with a punch that can shatter rocks. It may lower the targets Defense stat.'
  },
  CIRCLE_THROW: {
    id:'CIRCLE_THROW', name:'Circle Throw', type:'FIGHTING', category:'PHYSICAL',
    power:60, accuracy:90, pp:10, priority:-6, animStyle:'SLAM',
    effect:{type:'NONE'},
    description:'The user throws the target and switches in a party member. Always goes last.'
  },
  SEISMIC_TOSS: {
    id:'SEISMIC_TOSS', name:'Seismic Toss', type:'FIGHTING', category:'PHYSICAL',
    power:60, accuracy:100, pp:20, priority:0, animStyle:'ARC',
    effect:{type:'NONE'},
    description:'The target is thrown using gravity. It inflicts damage equal to the users level.'
  },
  FOCUS_PUNCH: {
    id:'FOCUS_PUNCH', name:'Focus Punch', type:'FIGHTING', category:'PHYSICAL',
    power:150, accuracy:100, pp:20, priority:-3, animStyle:'SLAM',
    effect:{type:'NONE'},
    description:'The user focuses its mind before launching a punch. It is extremely powerful but always goes last.'
  },
  HIGH_JUMP_KICK: {
    id:'HIGH_JUMP_KICK', name:'High Jump Kick', type:'FIGHTING', category:'PHYSICAL',
    power:130, accuracy:90, pp:10, priority:0, animStyle:'MELEE',
    effect:{type:'RECOIL', fraction:0.5},
    description:'The target is attacked with a knee kick launched while jumping high. If it misses, the user is hurt.'
  },
  SACRED_SWORD: {
    id:'SACRED_SWORD', name:'Sacred Sword', type:'FIGHTING', category:'PHYSICAL',
    power:90, accuracy:100, pp:15, priority:0, animStyle:'MELEE',
    effect:{type:'NONE'},
    description:'The user attacks by slicing with a long horn. The users stat changes dont affect this attacks damage.'
  },
  BULK_UP_MOVE: {
    id:'BULK_UP_MOVE', name:'Power Training', type:'FIGHTING', category:'STATUS',
    power:null, accuracy:999, pp:20, priority:0, animStyle:'SELF',
    effect:{type:'STAT_RAISE', stats:['atk','def'], stages:1, chance:100, target:'self'},
    description:'The user tenses its muscles and trains intensely, raising both its Attack and Defense stats.'
  },
  SLAM_TACKLE: {
    id:'SLAM_TACKLE', name:'Slam Tackle', type:'FIGHTING', category:'PHYSICAL',
    power:80, accuracy:100, pp:10, priority:0, animStyle:'SLAM',
    effect:{type:'FLINCH', chance:20},
    description:'The user barrels into the target with full-body force. May cause flinching.'
  },
  OUTRAGE_PUNCH: {
    id:'OUTRAGE_PUNCH', name:'Outrage Punch', type:'FIGHTING', category:'PHYSICAL',
    power:110, accuracy:100, pp:5, priority:0, animStyle:'SLAM',
    effect:{type:'CONFUSE', chance:100, target:'self'},
    description:'The user unleashes a furious flurry of punches. The user becomes confused after attacking.'
  },
  ARM_THRUST: {
    id:'ARM_THRUST', name:'Arm Thrust', type:'FIGHTING', category:'PHYSICAL',
    power:15, accuracy:100, pp:20, priority:0, animStyle:'MULTI',
    effect:{type:'MULTI', min:2, max:5},
    description:'The user lets loose a flurry of open-handed arm thrusts that hit two to five times.'
  },

  // ─────────────────────────────────────────────
  // POISON — batch 2
  // ─────────────────────────────────────────────

  BELCH: {
    id:'BELCH', name:'Belch', type:'POISON', category:'SPECIAL',
    power:120, accuracy:90, pp:10, priority:0, animStyle:'BURST',
    effect:{type:'NONE'},
    description:'The user lets out a damaging belch at the target. The user must have eaten a Berry to use this move.'
  },
  POISON_POWDER: {
    id:'POISON_POWDER', name:'Poison Powder', type:'POISON', category:'STATUS',
    power:null, accuracy:75, pp:35, priority:0, animStyle:'FIELD',
    effect:{type:'STATUS_CHANCE', status:'POISON', chance:100},
    description:'The user scatters a cloud of poisonous dust that poisons the target.'
  },
  TOXIC_THREAD: {
    id:'TOXIC_THREAD', name:'Toxic Thread', type:'POISON', category:'STATUS',
    power:null, accuracy:100, pp:20, priority:0, animStyle:'FIELD',
    effect:{type:'STATUS_CHANCE', status:'BADPOISON', chance:100},
    description:'The user shoots poisonous threads to badly poison the target and lower its Speed.'
  },
  NOXIOUS_TORQUE: {
    id:'NOXIOUS_TORQUE', name:'Noxious Torque', type:'POISON', category:'PHYSICAL',
    power:100, accuracy:100, pp:10, priority:0, animStyle:'VORTEX',
    effect:{type:'STATUS_CHANCE', status:'POISON', chance:30},
    description:'The user spins with toxic energy and crashes into the target. May cause poisoning.'
  },
  DIRE_CLAW: {
    id:'DIRE_CLAW', name:'Dire Claw', type:'POISON', category:'PHYSICAL',
    power:80, accuracy:100, pp:15, priority:0, animStyle:'MELEE',
    effect:{type:'STATUS_CHANCE', status:'POISON', chance:50},
    description:'The user lashes out with sharp claws coated in potent venom. May poison the target.'
  },
  MORTAL_SPIN: {
    id:'MORTAL_SPIN', name:'Mortal Spin', type:'POISON', category:'PHYSICAL',
    power:30, accuracy:100, pp:15, priority:0, animStyle:'MELEE',
    effect:{type:'STATUS_CHANCE', status:'POISON', chance:100},
    description:'The user spins rapidly and envelops the target in a toxic whirlwind. Always poisons.'
  },
  POLLEN_PUFF: {
    id:'POLLEN_PUFF', name:'Pollen Puff', type:'POISON', category:'SPECIAL',
    power:90, accuracy:100, pp:15, priority:0, animStyle:'PROJECTILE',
    effect:{type:'STATUS_CHANCE', status:'POISON', chance:30},
    description:'The user attacks the target with an exploding pollen puff. May poison the target.'
  },
  CLEAR_SMOG: {
    id:'CLEAR_SMOG', name:'Clear Smog', type:'POISON', category:'SPECIAL',
    power:50, accuracy:999, pp:15, priority:0, animStyle:'CONE',
    effect:{type:'STAT_LOWER', stat:'spAtk', stages:-1, chance:100, target:'opponent'},
    description:'The user attacks by throwing a clump of special mud that cannot be avoided and lowers Sp. Atk.'
  },
  TOXIC_WHIRL: {
    id:'TOXIC_WHIRL', name:'Toxic Whirl', type:'POISON', category:'SPECIAL',
    power:75, accuracy:90, pp:15, priority:0, animStyle:'VORTEX',
    effect:{type:'STATUS_CHANCE', status:'POISON', chance:20},
    description:'A spinning tornado of toxic energy engulfs the target. May cause poisoning.'
  },

  // ─────────────────────────────────────────────
  // GROUND — batch 2
  // ─────────────────────────────────────────────

  SHORE_UP: {
    id:'SHORE_UP', name:'Shore Up', type:'GROUND', category:'STATUS',
    power:null, accuracy:999, pp:10, priority:0, animStyle:'SELF',
    effect:{type:'HEAL', fraction:0.5},
    description:'The user regains up to half its max HP, restoring more in a sandstorm.'
  },
  THOUSAND_ARROWS: {
    id:'THOUSAND_ARROWS', name:'Thousand Arrows', type:'GROUND', category:'PHYSICAL',
    power:90, accuracy:100, pp:10, priority:0, animStyle:'WAVE',
    effect:{type:'NONE'},
    description:'The user attacks with earthen arrows. Can also strike Flying-type DinoMon.'
  },
  THOUSAND_WAVES: {
    id:'THOUSAND_WAVES', name:'Thousand Waves', type:'GROUND', category:'PHYSICAL',
    power:90, accuracy:100, pp:10, priority:0, animStyle:'WAVE',
    effect:{type:'NONE'},
    description:'The user attacks with great power from the earth. The target is prevented from fleeing.'
  },
  STOMPING_TANTRUM: {
    id:'STOMPING_TANTRUM', name:'Stomping Tantrum', type:'GROUND', category:'PHYSICAL',
    power:75, accuracy:100, pp:10, priority:0, animStyle:'SLAM',
    effect:{type:'NONE'},
    description:'Driven by frustration, the user attacks the target. Power doubles if the users last move failed.'
  },
  SAND_TOMB: {
    id:'SAND_TOMB', name:'Sand Tomb', type:'GROUND', category:'PHYSICAL',
    power:35, accuracy:85, pp:15, priority:0, animStyle:'VORTEX',
    effect:{type:'NONE'},
    description:'The user traps the target inside a harshly raging sandstorm for four to five turns.'
  },
  SPIKES: {
    id:'SPIKES', name:'Spikes', type:'GROUND', category:'STATUS',
    power:null, accuracy:999, pp:20, priority:0, animStyle:'FIELD',
    effect:{type:'STEALTH_ROCK'},
    description:'The user lays spikes around the opposing team. Spikes damage foes that switch in.'
  },
  PRECIPICE_BLADES: {
    id:'PRECIPICE_BLADES', name:'Precipice Blades', type:'GROUND', category:'PHYSICAL',
    power:120, accuracy:85, pp:10, priority:0, animStyle:'BURST',
    effect:{type:'NONE'},
    description:'The user controls a sharp lancing of blades from the ground. An overwhelming ancient power.'
  },
  SCORCHING_SAND: {
    id:'SCORCHING_SAND', name:'Scorching Sand', type:'GROUND', category:'SPECIAL',
    power:70, accuracy:100, pp:10, priority:0, animStyle:'WAVE',
    effect:{type:'STATUS_CHANCE', status:'BURN', chance:30},
    description:'The user throws scorching sand at the target. It may also leave a burn.'
  },
  EARTH_POWER: {
    id:'EARTH_POWER', name:'Earth Power', type:'GROUND', category:'SPECIAL',
    power:90, accuracy:100, pp:10, priority:0, animStyle:'PULSE',
    effect:{type:'STAT_LOWER', stat:'spDef', stages:-1, chance:10, target:'opponent'},
    description:'The user makes the ground under the target erupt with power. It may lower Sp. Def.'
  },
  ROTOTILLER: {
    id:'ROTOTILLER', name:'Rototiller', type:'GROUND', category:'STATUS',
    power:null, accuracy:999, pp:10, priority:0, animStyle:'FIELD',
    effect:{type:'STAT_RAISE', stats:['atk','spAtk'], stages:1, chance:100, target:'self'},
    description:'The user tills the soil, boosting the power of the user and allies Grass-type moves.'
  },
  LAND_WRATH: {
    id:'LAND_WRATH', name:'Lands Wrath', type:'GROUND', category:'PHYSICAL',
    power:90, accuracy:100, pp:10, priority:0, animStyle:'BURST',
    effect:{type:'NONE'},
    description:'The user gathers the fury of the land and attacks the target with a massive earthen blast.'
  },
  TECTONIC_RAGE: {
    id:'TECTONIC_RAGE', name:'Tectonic Rage', type:'GROUND', category:'PHYSICAL',
    power:180, accuracy:100, pp:1, priority:0, animStyle:'WAVE',
    effect:{type:'NONE'},
    description:'The user burrows into the ground and strikes with the power of a catastrophic earthquake.'
  },

  // ─────────────────────────────────────────────
  // FLYING — batch 2
  // ─────────────────────────────────────────────

  SKY_ATTACK: {
    id:'SKY_ATTACK', name:'Sky Attack', type:'FLYING', category:'PHYSICAL',
    power:140, accuracy:90, pp:5, priority:0, animStyle:'ARC',
    effect:{type:'TWO_TURN', chargeMsg:'is glowing!'},
    description:'The user charges with power on the first turn, then unleashes a devastating blow on the next.'
  },
  OBLIVION_WING: {
    id:'OBLIVION_WING', name:'Oblivion Wing', type:'FLYING', category:'SPECIAL',
    power:80, accuracy:100, pp:10, priority:0, animStyle:'DRAIN',
    effect:{type:'DRAIN', fraction:0.75},
    description:'The user absorbs its targets HP with a powerful beam. Restores most of the damage dealt.'
  },
  FEATHER_DANCE: {
    id:'FEATHER_DANCE', name:'Feather Dance', type:'FLYING', category:'STATUS',
    power:null, accuracy:100, pp:15, priority:0, animStyle:'FIELD',
    effect:{type:'STAT_LOWER', stat:'atk', stages:-2, chance:100, target:'opponent'},
    description:'The user covers the target with feathers, sharply reducing its Attack stat.'
  },
  SKY_DROP: {
    id:'SKY_DROP', name:'Sky Drop', type:'FLYING', category:'PHYSICAL',
    power:60, accuracy:100, pp:10, priority:0, animStyle:'ARC',
    effect:{type:'TWO_TURN', chargeMsg:'took the target into the sky!'},
    description:'The user takes the target up into the sky, then drops it on the following turn.'
  },
  BOUNCE: {
    id:'BOUNCE', name:'Bounce', type:'FLYING', category:'PHYSICAL',
    power:85, accuracy:85, pp:5, priority:0, animStyle:'ARC',
    effect:{type:'STATUS_CHANCE', status:'PARALYSIS', chance:30},
    description:'The user bounces up high, then drops on the target on the second turn. May paralyze.'
  },
  DRILL_PECK: {
    id:'DRILL_PECK', name:'Drill Peck', type:'FLYING', category:'PHYSICAL',
    power:80, accuracy:100, pp:20, priority:0, animStyle:'MELEE',
    effect:{type:'NONE'},
    description:'A corkscrewing attack with the beak acting as a drill. High critical-hit ratio.'
  },
  AIR_CUTTER: {
    id:'AIR_CUTTER', name:'Air Cutter', type:'FLYING', category:'SPECIAL',
    power:60, accuracy:95, pp:25, priority:0, animStyle:'CONE',
    effect:{type:'NONE'},
    description:'The user launches razorlike wind to slash the opposing DinoMon. High critical-hit ratio.'
  },
  PECK: {
    id:'PECK', name:'Peck', type:'FLYING', category:'PHYSICAL',
    power:35, accuracy:100, pp:35, priority:0, animStyle:'PROJECTILE',
    effect:{type:'NONE'},
    description:'The target is jabbed with a sharply pointed beak or horn.'
  },
  CHATTER: {
    id:'CHATTER', name:'Chatter', type:'FLYING', category:'SPECIAL',
    power:65, accuracy:100, pp:20, priority:0, animStyle:'WAVE',
    effect:{type:'CONFUSE', chance:10, target:'opponent'},
    description:'The user attacks the target with sound waves of deafening chatter. It may also confuse the target.'
  },
  AERIAL_SLAM: {
    id:'AERIAL_SLAM', name:'Aerial Slam', type:'FLYING', category:'PHYSICAL',
    power:110, accuracy:90, pp:5, priority:0, animStyle:'SLAM',
    effect:{type:'FLINCH', chance:20},
    description:'The user dives from high altitude and slams into the target with tremendous force. May flinch.'
  },
  WIND_BLADE: {
    id:'WIND_BLADE', name:'Wind Blade', type:'FLYING', category:'PHYSICAL',
    power:80, accuracy:100, pp:10, priority:0, animStyle:'ARC',
    effect:{type:'NONE'},
    description:'The user creates a blade of compressed wind and slashes the target. High critical-hit ratio.'
  },
  SUPERSONIC_STRIKE: {
    id:'SUPERSONIC_STRIKE', name:'Supersonic Strike', type:'FLYING', category:'PHYSICAL',
    power:70, accuracy:95, pp:15, priority:1, animStyle:'PROJECTILE',
    effect:{type:'NONE'},
    description:'The user dives at the target with supersonic speed, always striking first.'
  },

  // ─────────────────────────────────────────────
  // PSYCHIC — batch 2
  // ─────────────────────────────────────────────

  STORED_POWER: {
    id:'STORED_POWER', name:'Stored Power', type:'PSYCHIC', category:'SPECIAL',
    power:20, accuracy:100, pp:10, priority:0, animStyle:'AURA',
    effect:{type:'NONE'},
    description:'The user attacks the target with stored power. Power rises with the users boosted stats.'
  },
  HEAL_PULSE: {
    id:'HEAL_PULSE', name:'Heal Pulse', type:'PSYCHIC', category:'STATUS',
    power:null, accuracy:999, pp:10, priority:0, animStyle:'SELF',
    effect:{type:'HEAL', fraction:0.5},
    description:'The user emits a healing pulse that restores the targets HP by up to half of its max HP.'
  },
  TRICK_ROOM: {
    id:'TRICK_ROOM', name:'Trick Room', type:'PSYCHIC', category:'STATUS',
    power:null, accuracy:999, pp:5, priority:-7, animStyle:'FIELD',
    effect:{type:'NONE'},
    description:'The user creates a bizarre area in which slower DinoMon get to move first for five turns.'
  },
  TELEKINESIS: {
    id:'TELEKINESIS', name:'Telekinesis', type:'PSYCHIC', category:'STATUS',
    power:null, accuracy:999, pp:15, priority:0, animStyle:'AURA',
    effect:{type:'STAT_LOWER', stat:'eva', stages:-1, chance:100, target:'opponent'},
    description:'The user makes the target float with its psychic power. The target is easier to hit.'
  },
  EXPANDING_FORCE: {
    id:'EXPANDING_FORCE', name:'Expanding Force', type:'PSYCHIC', category:'SPECIAL',
    power:80, accuracy:100, pp:10, priority:0, animStyle:'PULSE',
    effect:{type:'NONE'},
    description:'The user attacks the target with an expanding force. Power increases on Psychic Terrain.'
  },
  LUMINA_CRASH: {
    id:'LUMINA_CRASH', name:'Lumina Crash', type:'PSYCHIC', category:'SPECIAL',
    power:80, accuracy:100, pp:10, priority:0, animStyle:'BEAM',
    effect:{type:'STAT_LOWER', stat:'spDef', stages:-2, chance:100, target:'opponent'},
    description:'The user attacks with an abnormal light that harshly lowers the targets Sp. Def.'
  },
  MYSTICAL_POWER: {
    id:'MYSTICAL_POWER', name:'Mystical Power', type:'PSYCHIC', category:'SPECIAL',
    power:70, accuracy:90, pp:10, priority:0, animStyle:'AURA',
    effect:{type:'STAT_RAISE', stat:'spAtk', stages:1, chance:100, target:'self'},
    description:'The user attacks using a mysterious power. This also raises the users Sp. Atk stat.'
  },
  PSYCHIC_FANGS: {
    id:'PSYCHIC_FANGS', name:'Psychic Fangs', type:'PSYCHIC', category:'PHYSICAL',
    power:85, accuracy:100, pp:10, priority:0, animStyle:'MELEE',
    effect:{type:'STAT_LOWER', stat:'spDef', stages:-1, chance:50, target:'opponent'},
    description:'The user bites the target with psychic fangs. This may lower the targets Sp. Def.'
  },
  OVERDRIVE_PSY: {
    id:'OVERDRIVE_PSY', name:'Overdrive Psy', type:'PSYCHIC', category:'SPECIAL',
    power:110, accuracy:90, pp:5, priority:0, animStyle:'BURST',
    effect:{type:'NONE'},
    description:'The user overloads the targets mind with psychic energy, causing massive mental damage.'
  },
  ANCIENT_PSY: {
    id:'ANCIENT_PSY', name:'Ancient Power Psy', type:'PSYCHIC', category:'SPECIAL',
    power:60, accuracy:100, pp:5, priority:0, animStyle:'AURA',
    effect:{type:'OMNI_RAISE', chance:10},
    description:'The user attacks with psychic power from ancient times. May raise all the users stats.'
  },
  MIND_BLOWN: {
    id:'MIND_BLOWN', name:'Mind Blown', type:'PSYCHIC', category:'SPECIAL',
    power:150, accuracy:100, pp:5, priority:0, animStyle:'BURST',
    effect:{type:'RECOIL', fraction:0.5},
    description:'The user explodes its own head to inflict damage on everything around it. The user takes serious damage.'
  },

  // ─────────────────────────────────────────────
  // BUG — batch 2
  // ─────────────────────────────────────────────

  MEGAHORN: {
    id:'MEGAHORN', name:'Megahorn', type:'BUG', category:'PHYSICAL',
    power:120, accuracy:85, pp:10, priority:0, animStyle:'SLAM',
    effect:{type:'NONE'},
    description:'Using its tough and impressive horn, the user rams into the target with no letup.'
  },
  PIN_MISSILE: {
    id:'PIN_MISSILE', name:'Pin Missile', type:'BUG', category:'PHYSICAL',
    power:25, accuracy:95, pp:20, priority:0, animStyle:'MULTI',
    effect:{type:'MULTI', min:2, max:5},
    description:'Sharp spikes are shot at the target in rapid succession. They hit two to five times.'
  },
  STRUGGLE_BUG: {
    id:'STRUGGLE_BUG', name:'Struggle Bug', type:'BUG', category:'SPECIAL',
    power:50, accuracy:100, pp:20, priority:0, animStyle:'PROJECTILE',
    effect:{type:'STAT_LOWER', stat:'spAtk', stages:-1, chance:100, target:'opponent'},
    description:'While resisting, the user attacks the opposing DinoMon. This lowers the targets Sp. Atk.'
  },
  FIRST_IMPRESSION: {
    id:'FIRST_IMPRESSION', name:'First Impression', type:'BUG', category:'PHYSICAL',
    power:90, accuracy:100, pp:10, priority:2, animStyle:'MELEE',
    effect:{type:'NONE'},
    description:'The user acts before anyone else, appearing to make a first impression. Only works on the first turn.'
  },
  SKITTER_SMACK: {
    id:'SKITTER_SMACK', name:'Skitter Smack', type:'BUG', category:'PHYSICAL',
    power:70, accuracy:90, pp:10, priority:0, animStyle:'MELEE',
    effect:{type:'STAT_LOWER', stat:'spAtk', stages:-1, chance:100, target:'opponent'},
    description:'The user skitters behind the target to attack. This also lowers the targets Sp. Atk.'
  },
  TAIL_GLOW: {
    id:'TAIL_GLOW', name:'Tail Glow', type:'BUG', category:'STATUS',
    power:null, accuracy:999, pp:20, priority:0, animStyle:'SELF',
    effect:{type:'STAT_RAISE', stat:'spAtk', stages:3, chance:100, target:'self'},
    description:'The user stares at flashing lights to focus its mind, drastically raising its Sp. Atk stat.'
  },
  INFESTATION: {
    id:'INFESTATION', name:'Infestation', type:'BUG', category:'SPECIAL',
    power:20, accuracy:100, pp:20, priority:0, animStyle:'VORTEX',
    effect:{type:'NONE'},
    description:'The target is infested and attacked for four to five turns. The target cant flee during this time.'
  },
  QUIVER_PULSE: {
    id:'QUIVER_PULSE', name:'Quiver Pulse', type:'BUG', category:'STATUS',
    power:null, accuracy:999, pp:10, priority:0, animStyle:'SELF',
    effect:{type:'STAT_RAISE', stat:'spAtk', stages:1, chance:100, target:'self'},
    description:'The user vibrates its wings and emits a resonant pulse, raising its Sp. Atk stat.'
  },
  BUZZING_ASSAULT: {
    id:'BUZZING_ASSAULT', name:'Buzzing Assault', type:'BUG', category:'SPECIAL',
    power:90, accuracy:100, pp:10, priority:0, animStyle:'WAVE',
    effect:{type:'STAT_LOWER', stat:'def', stages:-1, chance:20, target:'opponent'},
    description:'A deafening buzz of insect wings shakes the target. May lower its Defense.'
  },
  SWARM_STRIKE: {
    id:'SWARM_STRIKE', name:'Swarm Strike', type:'BUG', category:'PHYSICAL',
    power:110, accuracy:90, pp:5, priority:0, animStyle:'MULTI',
    effect:{type:'MULTI', min:2, max:3},
    description:'The user calls a swarm to assault the target multiple times with devastating force.'
  },

  // ─────────────────────────────────────────────
  // ROCK — batch 2
  // ─────────────────────────────────────────────

  HEAD_SMASH: {
    id:'HEAD_SMASH', name:'Head Smash', type:'ROCK', category:'PHYSICAL',
    power:150, accuracy:80, pp:5, priority:0, animStyle:'SLAM',
    effect:{type:'RECOIL', fraction:0.5},
    description:'The user attacks the target with a hazardous, full-power headbutt. The user takes serious damage.'
  },
  DIAMOND_STORM: {
    id:'DIAMOND_STORM', name:'Diamond Storm', type:'ROCK', category:'PHYSICAL',
    power:100, accuracy:95, pp:5, priority:0, animStyle:'BURST',
    effect:{type:'STAT_RAISE', stat:'def', stages:2, chance:50, target:'self'},
    description:'The user whips up a storm of diamonds to damage all opponents. May raise the users Defense.'
  },
  ACCELEROCK: {
    id:'ACCELEROCK', name:'Accelerock', type:'ROCK', category:'PHYSICAL',
    power:40, accuracy:100, pp:20, priority:1, animStyle:'PROJECTILE',
    effect:{type:'NONE'},
    description:'The user smashes into the target at high speed. This move always goes first.'
  },
  METEOR_BEAM: {
    id:'METEOR_BEAM', name:'Meteor Beam', type:'ROCK', category:'SPECIAL',
    power:120, accuracy:90, pp:10, priority:0, animStyle:'ARC',
    effect:{type:'STAT_RAISE', stat:'spAtk', stages:1, chance:100, target:'self'},
    description:'The user gathers energy from meteorites to attack. This raises the users Sp. Atk on the first turn.'
  },
  ROCK_WRECKER: {
    id:'ROCK_WRECKER', name:'Rock Wrecker', type:'ROCK', category:'PHYSICAL',
    power:150, accuracy:90, pp:5, priority:0, animStyle:'ARC',
    effect:{type:'RECHARGE'},
    description:'The user launches a huge boulder at the target. The user must rest on the next turn.'
  },
  TARSHOT: {
    id:'TARSHOT', name:'Tarshot', type:'ROCK', category:'STATUS',
    power:null, accuracy:100, pp:15, priority:0, animStyle:'FIELD',
    effect:{type:'STAT_LOWER', stat:'spd', stages:-1, chance:100, target:'opponent'},
    description:'The user flings sticky tar at the opposing DinoMon. This always lowers its Speed stat.'
  },
  SAND_RUSH: {
    id:'SAND_RUSH', name:'Sand Rush', type:'ROCK', category:'STATUS',
    power:null, accuracy:999, pp:10, priority:0, animStyle:'FIELD',
    effect:{type:'SET_WEATHER', weather:'SANDSTORM'},
    description:'The user whips up a sandstorm around itself. Damage is dealt to all non-Rock-type DinoMon.'
  },
  STONE_AXE: {
    id:'STONE_AXE', name:'Stone Axe', type:'ROCK', category:'PHYSICAL',
    power:65, accuracy:90, pp:15, priority:0, animStyle:'SLAM',
    effect:{type:'STEALTH_ROCK'},
    description:'The user swings a stone axe and launches fragments. Splinters become Stealth Rock on the foes side.'
  },
  LUSTER_PURGE: {
    id:'LUSTER_PURGE', name:'Luster Purge', type:'ROCK', category:'SPECIAL',
    power:95, accuracy:100, pp:5, priority:0, animStyle:'BURST',
    effect:{type:'STAT_LOWER', stat:'spDef', stages:-1, chance:50, target:'opponent'},
    description:'The user does away with the target using a purgatory light that may lower Sp. Def.'
  },
  SNAP_ROUND: {
    id:'SNAP_ROUND', name:'Snap Round', type:'ROCK', category:'SPECIAL',
    power:60, accuracy:100, pp:15, priority:0, animStyle:'WAVE',
    effect:{type:'NONE'},
    description:'The user attacks the target with a song of crashing boulders.'
  },
  CRYSTAL_BURST: {
    id:'CRYSTAL_BURST', name:'Crystal Burst', type:'ROCK', category:'SPECIAL',
    power:85, accuracy:100, pp:10, priority:0, animStyle:'BURST',
    effect:{type:'FLINCH', chance:20},
    description:'The user detonates crystallised rock energy at the target. May cause flinching.'
  },
  GEOLOGIC_FORCE: {
    id:'GEOLOGIC_FORCE', name:'Geologic Force', type:'ROCK', category:'PHYSICAL',
    power:110, accuracy:90, pp:10, priority:0, animStyle:'WAVE',
    effect:{type:'NONE'},
    description:'Ancient geological forces are channelled into a devastating physical strike.'
  },

  // ─────────────────────────────────────────────
  // GHOST — batch 2
  // ─────────────────────────────────────────────

  DREAM_EATER: {
    id:'DREAM_EATER', name:'Dream Eater', type:'GHOST', category:'SPECIAL',
    power:100, accuracy:100, pp:15, priority:0, animStyle:'DRAIN',
    effect:{type:'DRAIN', fraction:0.5},
    description:'The user chomps on the target while it is asleep, restoring HP by half the damage taken.'
  },
  SHADOW_PUNCH: {
    id:'SHADOW_PUNCH', name:'Shadow Punch', type:'GHOST', category:'PHYSICAL',
    power:60, accuracy:999, pp:20, priority:0, animStyle:'VORTEX',
    effect:{type:'NONE'},
    description:'The user throws a punch from the shadows. This attack never misses.'
  },
  SPECTRAL_THIEF: {
    id:'SPECTRAL_THIEF', name:'Spectral Thief', type:'GHOST', category:'PHYSICAL',
    power:90, accuracy:100, pp:10, priority:0, animStyle:'AURA',
    effect:{type:'NONE'},
    description:'The user hides in the targets shadow, then strikes while stealing the targets stat boosts.'
  },
  MOONGEIST_BEAM: {
    id:'MOONGEIST_BEAM', name:'Moongeist Beam', type:'GHOST', category:'SPECIAL',
    power:100, accuracy:100, pp:5, priority:0, animStyle:'BEAM',
    effect:{type:'NONE'},
    description:'The user emits a sinister ray to attack the target. This move ignores the targets ability.'
  },
  ASTRAL_BARRAGE: {
    id:'ASTRAL_BARRAGE', name:'Astral Barrage', type:'GHOST', category:'SPECIAL',
    power:120, accuracy:100, pp:5, priority:0, animStyle:'BURST',
    effect:{type:'NONE'},
    description:'The user attacks by sending a frightful amount of small meteors crashing into the target.'
  },
  UMBRAL_DIVE: {
    id:'UMBRAL_DIVE', name:'Umbral Dive', type:'GHOST', category:'PHYSICAL',
    power:80, accuracy:100, pp:10, priority:0, animStyle:'VORTEX',
    effect:{type:'TWO_TURN', chargeMsg:'dived into the shadows!'},
    description:'The user dives into the shadows on the first turn, then emerges to strike on the next turn.'
  },
  SPIRIT_SHACKLE: {
    id:'SPIRIT_SHACKLE', name:'Spirit Shackle', type:'GHOST', category:'PHYSICAL',
    power:80, accuracy:100, pp:10, priority:0, animStyle:'PROJECTILE',
    effect:{type:'NONE'},
    description:'The user attacks while simultaneously stitching the targets shadow to the ground. Target cannot flee.'
  },
  SHADOW_FORCE: {
    id:'SHADOW_FORCE', name:'Shadow Force', type:'GHOST', category:'PHYSICAL',
    power:120, accuracy:100, pp:5, priority:0, animStyle:'VORTEX',
    effect:{type:'TWO_TURN', chargeMsg:'vanished into the shadows!'},
    description:'The user disappears, then strikes the target on the next turn. This attack hits through Protect.'
  },
  EERIE_SPELL: {
    id:'EERIE_SPELL', name:'Eerie Spell', type:'GHOST', category:'SPECIAL',
    power:80, accuracy:100, pp:5, priority:0, animStyle:'PULSE',
    effect:{type:'STAT_LOWER', stat:'spDef', stages:-1, chance:100, target:'opponent'},
    description:'The user attacks with its tremendous ghostly power. This also lowers the targets Sp. Def.'
  },
  SOUL_DRAIN: {
    id:'SOUL_DRAIN', name:'Soul Drain', type:'GHOST', category:'SPECIAL',
    power:90, accuracy:100, pp:10, priority:0, animStyle:'DRAIN',
    effect:{type:'DRAIN', fraction:0.5},
    description:'The user siphons the spiritual energy of the target to restore its own HP.'
  },

  // ─────────────────────────────────────────────
  // DRAGON — batch 2
  // ─────────────────────────────────────────────

  DRAGON_HAMMER: {
    id:'DRAGON_HAMMER', name:'Dragon Hammer', type:'DRAGON', category:'PHYSICAL',
    power:90, accuracy:100, pp:15, priority:0, animStyle:'SLAM',
    effect:{type:'NONE'},
    description:'The user uses its body like a hammer to attack the target and inflict massive damage.'
  },
  CLANGOROUS_SOUL: {
    id:'CLANGOROUS_SOUL', name:'Clangorous Soul', type:'DRAGON', category:'STATUS',
    power:null, accuracy:999, pp:5, priority:0, animStyle:'AURA',
    effect:{type:'OMNI_RAISE', chance:100},
    description:'The user raises all its stats by using some of its HP. Costs 1/3 of the users max HP.'
  },
  TWISTER: {
    id:'TWISTER', name:'Twister', type:'DRAGON', category:'SPECIAL',
    power:40, accuracy:100, pp:20, priority:0, animStyle:'VORTEX',
    effect:{type:'FLINCH', chance:20},
    description:'The user whips up a vicious twister to tear at the opposing DinoMon. It may also make them flinch.'
  },
  DRAGON_TAIL: {
    id:'DRAGON_TAIL', name:'Dragon Tail', type:'DRAGON', category:'PHYSICAL',
    power:60, accuracy:90, pp:10, priority:-6, animStyle:'MELEE',
    effect:{type:'STAT_LOWER', stat:'def', stages:-1, chance:50, target:'opponent'},
    description:'The target is slammed with a dragon tail, forcing it out of battle. Always goes last.'
  },
  DRAGON_ENERGY: {
    id:'DRAGON_ENERGY', name:'Dragon Energy', type:'DRAGON', category:'SPECIAL',
    power:150, accuracy:100, pp:5, priority:0, animStyle:'BEAM',
    effect:{type:'NONE'},
    description:'Converting life-force into power, the user attacks. Power decreases as the users HP decreases.'
  },
  DEVASTATING_DRAKE: {
    id:'DEVASTATING_DRAKE', name:'Devastating Drake', type:'DRAGON', category:'PHYSICAL',
    power:100, accuracy:100, pp:5, priority:0, animStyle:'SLAM',
    effect:{type:'NONE'},
    description:'The user materialises its aura using its DNA, then attacks the target at full force.'
  },
  DUAL_WINGBEAT: {
    id:'DUAL_WINGBEAT', name:'Dual Wingbeat', type:'DRAGON', category:'PHYSICAL',
    power:40, accuracy:90, pp:10, priority:0, animStyle:'MULTI',
    effect:{type:'MULTI', min:2, max:2},
    description:'The user beats its wings with great force and strikes the target twice in a row.'
  },
  DRAGON_MIST: {
    id:'DRAGON_MIST', name:'Dragon Mist', type:'DRAGON', category:'SPECIAL',
    power:70, accuracy:100, pp:15, priority:0, animStyle:'VORTEX',
    effect:{type:'CONFUSE', chance:30, target:'opponent'},
    description:'The user engulfs the target in mystical dragon mist. This may also leave the target confused.'
  },
  ANCIENT_DRAGON: {
    id:'ANCIENT_DRAGON', name:'Ancient Dragonsong', type:'DRAGON', category:'SPECIAL',
    power:95, accuracy:95, pp:5, priority:0, animStyle:'AURA',
    effect:{type:'OMNI_RAISE', chance:10},
    description:'The user sings an ancient draconic song. May raise all the users stats with primordial power.'
  },
  TITANFALL: {
    id:'TITANFALL', name:'Titanfall', type:'DRAGON', category:'PHYSICAL',
    power:130, accuracy:85, pp:5, priority:0, animStyle:'SLAM',
    effect:{type:'FLINCH', chance:30},
    description:'The user crashes down from great height with the force of a falling titan. May cause flinching.'
  },

  // ─────────────────────────────────────────────
  // DARK — batch 2
  // ─────────────────────────────────────────────

  KNOCK_OFF: {
    id:'KNOCK_OFF', name:'Knock Off', type:'DARK', category:'PHYSICAL',
    power:65, accuracy:100, pp:20, priority:0, animStyle:'SLAM',
    effect:{type:'NONE'},
    description:'The user slaps away the targets held item, and that item cant be used in that battle.'
  },
  BRUTAL_SWING: {
    id:'BRUTAL_SWING', name:'Brutal Swing', type:'DARK', category:'PHYSICAL',
    power:60, accuracy:100, pp:20, priority:0, animStyle:'MELEE',
    effect:{type:'NONE'},
    description:'The user swings its body around violently to inflict damage on everything in its vicinity.'
  },
  WICKED_BLOW: {
    id:'WICKED_BLOW', name:'Wicked Blow', type:'DARK', category:'PHYSICAL',
    power:80, accuracy:100, pp:5, priority:0, animStyle:'MELEE',
    effect:{type:'NONE'},
    description:'The user mastered the Dark-type attack to perfection. This move always results in a critical hit.'
  },
  LASH_OUT: {
    id:'LASH_OUT', name:'Lash Out', type:'DARK', category:'PHYSICAL',
    power:75, accuracy:100, pp:5, priority:0, animStyle:'SLAM',
    effect:{type:'NONE'},
    description:'The user lashes out to vent its frustration. Power is doubled if the user had its stats lowered this turn.'
  },
  RUINATION: {
    id:'RUINATION', name:'Ruination', type:'DARK', category:'SPECIAL',
    power:60, accuracy:90, pp:10, priority:0, animStyle:'FIELD',
    effect:{type:'NONE'},
    description:'The user summons a ruinous disaster that cuts the targets HP in half.'
  },
  HYPERSPACE_FURY: {
    id:'HYPERSPACE_FURY', name:'Hyperspace Fury', type:'DARK', category:'PHYSICAL',
    power:100, accuracy:999, pp:5, priority:0, animStyle:'VORTEX',
    effect:{type:'STAT_LOWER', stat:'def', stages:-1, chance:100, target:'self'},
    description:'The user attacks the target by using its arms to seize through an unknown dimension. Lowers users Defense.'
  },
  DARKEST_LARIAT: {
    id:'DARKEST_LARIAT', name:'Darkest Lariat', type:'DARK', category:'PHYSICAL',
    power:85, accuracy:100, pp:10, priority:0, animStyle:'SLAM',
    effect:{type:'NONE'},
    description:'The user swings both its arms and hits the target. The users stat changes dont affect this attack.'
  },
  KOWTOW_CLEAVE: {
    id:'KOWTOW_CLEAVE', name:'Kowtow Cleave', type:'DARK', category:'PHYSICAL',
    power:85, accuracy:999, pp:10, priority:0, animStyle:'MELEE',
    effect:{type:'NONE'},
    description:'The user bows to fool the target, then slashes at it. This attack never misses.'
  },
  FIERY_WRATH: {
    id:'FIERY_WRATH', name:'Fiery Wrath', type:'DARK', category:'SPECIAL',
    power:90, accuracy:100, pp:10, priority:0, animStyle:'AURA',
    effect:{type:'FLINCH', chance:20},
    description:'The user transforms its wrath into a fire-like aura to attack. It may also make targets flinch.'
  },
  ILL_WILL: {
    id:'ILL_WILL', name:'Ill Will', type:'DARK', category:'STATUS',
    power:null, accuracy:100, pp:15, priority:0, animStyle:'FIELD',
    effect:{type:'STAT_LOWER', stats:['atk','spAtk'], stages:-1, chance:100, target:'opponent'},
    description:'The user curses the target with malicious intent, lowering its Attack and Sp. Atk.'
  },
  DARKNESS_PULSE: {
    id:'DARKNESS_PULSE', name:'Darkness Pulse', type:'DARK', category:'SPECIAL',
    power:80, accuracy:100, pp:15, priority:0, animStyle:'PULSE',
    effect:{type:'CONFUSE', chance:20, target:'opponent'},
    description:'The user releases a horrible aura imbued with dark thoughts. It may also make the target confused.'
  },
  SHADOW_RAID: {
    id:'SHADOW_RAID', name:'Shadow Raid', type:'DARK', category:'PHYSICAL',
    power:110, accuracy:100, pp:5, priority:0, animStyle:'VORTEX',
    effect:{type:'STAT_LOWER', stat:'def', stages:-1, chance:30, target:'opponent'},
    description:'The user ambushes with overwhelming shadow energy. May lower the targets Defense.'
  },

  // ─────────────────────────────────────────────
  // STEEL — batch 2
  // ─────────────────────────────────────────────

  ANCHOR_SHOT: {
    id:'ANCHOR_SHOT', name:'Anchor Shot', type:'STEEL', category:'PHYSICAL',
    power:80, accuracy:100, pp:20, priority:0, animStyle:'MELEE',
    effect:{type:'NONE'},
    description:'The user entangles the target with its anchor chain while attacking. Target cannot flee.'
  },
  MIRROR_SHOT: {
    id:'MIRROR_SHOT', name:'Mirror Shot', type:'STEEL', category:'SPECIAL',
    power:65, accuracy:85, pp:10, priority:0, animStyle:'PROJECTILE',
    effect:{type:'STAT_LOWER', stat:'acc', stages:-1, chance:30, target:'opponent'},
    description:'The user flashes a light that bounces off its polished body to blind the target. May lower accuracy.'
  },
  MAGNET_BOMB: {
    id:'MAGNET_BOMB', name:'Magnet Bomb', type:'STEEL', category:'PHYSICAL',
    power:60, accuracy:999, pp:20, priority:0, animStyle:'ARC',
    effect:{type:'NONE'},
    description:'The user launches a magnetic bomb that strikes without fail. This move never misses.'
  },
  AUTOTOMIZE: {
    id:'AUTOTOMIZE', name:'Autotomize', type:'STEEL', category:'STATUS',
    power:null, accuracy:999, pp:15, priority:0, animStyle:'SELF',
    effect:{type:'STAT_RAISE', stat:'spd', stages:2, chance:100, target:'self'},
    description:'The user sheds its heavy outer shell to reduce its weight and boost its Speed drastically.'
  },
  SHIFT_GEAR: {
    id:'SHIFT_GEAR', name:'Shift Gear', type:'STEEL', category:'STATUS',
    power:null, accuracy:999, pp:10, priority:0, animStyle:'SELF',
    effect:{type:'STAT_RAISE', stats:['atk','spd'], stages:1, chance:100, target:'self'},
    description:'The user rotates its gears, raising its Attack stat and sharply raising its Speed stat.'
  },
  HEAVY_SLAM: {
    id:'HEAVY_SLAM', name:'Heavy Slam', type:'STEEL', category:'PHYSICAL',
    power:100, accuracy:100, pp:10, priority:0, animStyle:'SLAM',
    effect:{type:'NONE'},
    description:'The user slams into the target with its heavy body. Heavier users deal more damage.'
  },
  MAKE_IT_RAIN: {
    id:'MAKE_IT_RAIN', name:'Make It Rain', type:'STEEL', category:'SPECIAL',
    power:120, accuracy:100, pp:5, priority:0, animStyle:'ARC',
    effect:{type:'STAT_LOWER', stat:'spAtk', stages:-1, chance:100, target:'self'},
    description:'The user attacks by throwing a mass of coins. This lowers the users Sp. Atk stat.'
  },
  KING_SHIELD: {
    id:'KING_SHIELD', name:'Kings Shield', type:'STEEL', category:'STATUS',
    power:null, accuracy:999, pp:10, priority:3, animStyle:'SELF',
    effect:{type:'STAT_RAISE', stat:'def', stages:2, chance:100, target:'self'},
    description:'The user takes a defensive stance while protecting itself from damage. Sharply raises Defense.'
  },
  IRON_HEAD_STRONG: {
    id:'IRON_HEAD_STRONG', name:'Iron Head Plus', type:'STEEL', category:'PHYSICAL',
    power:100, accuracy:100, pp:10, priority:0, animStyle:'SLAM',
    effect:{type:'FLINCH', chance:30},
    description:'The user slams the target with a heavy metal head. It may also make the target flinch.'
  },
  CORKSCREW_CRASH: {
    id:'CORKSCREW_CRASH', name:'Corkscrew Crash', type:'STEEL', category:'PHYSICAL',
    power:130, accuracy:90, pp:5, priority:0, animStyle:'SLAM',
    effect:{type:'RECOIL', fraction:0.33},
    description:'The user spins like a corkscrew and plunges into the target with great force. The user is also hurt.'
  },
  METEOR_MASH: {
    id:'METEOR_MASH', name:'Meteor Mash', type:'STEEL', category:'PHYSICAL',
    power:90, accuracy:90, pp:10, priority:0, animStyle:'SLAM',
    effect:{type:'STAT_RAISE', stat:'atk', stages:1, chance:20, target:'self'},
    description:'The user fires a meteor-like punch at the target. It may also raise the users Attack.'
  },
  STEEL_SPIKE: {
    id:'STEEL_SPIKE', name:'Steel Spike', type:'STEEL', category:'PHYSICAL',
    power:70, accuracy:100, pp:20, priority:0, animStyle:'PROJECTILE',
    effect:{type:'STATUS_CHANCE', status:'PARALYSIS', chance:20},
    description:'The user fires a magnetic spike that pierces the target. May cause paralysis.'
  },

  // ─────────────────────────────────────────────
  // FAIRY — batch 2
  // ─────────────────────────────────────────────

  FLEUR_CANNON: {
    id:'FLEUR_CANNON', name:'Fleur Cannon', type:'FAIRY', category:'SPECIAL',
    power:130, accuracy:90, pp:5, priority:0, animStyle:'BEAM',
    effect:{type:'STAT_LOWER', stat:'spAtk', stages:-2, chance:100, target:'self'},
    description:'The user unleashes a powerful beam of concentrated fairy energy. This harshly lowers Sp. Atk.'
  },
  GEOMANCY: {
    id:'GEOMANCY', name:'Geomancy', type:'FAIRY', category:'STATUS',
    power:null, accuracy:999, pp:10, priority:0, animStyle:'AURA',
    effect:{type:'STAT_RAISE', stats:['spAtk','spDef','spd'], stages:2, chance:100, target:'self'},
    description:'The user absorbs energy and sharply raises its Sp. Atk, Sp. Def, and Speed on the next turn.'
  },
  SPIRIT_BREAK: {
    id:'SPIRIT_BREAK', name:'Spirit Break', type:'FAIRY', category:'PHYSICAL',
    power:75, accuracy:100, pp:15, priority:0, animStyle:'BURST',
    effect:{type:'STAT_LOWER', stat:'spAtk', stages:-1, chance:100, target:'opponent'},
    description:'The user attacks the target with so much force that it could break the targets spirit. Lowers Sp. Atk.'
  },
  MOONFORCE: {
    id:'MOONFORCE', name:'Moon Force', type:'FAIRY', category:'SPECIAL',
    power:95, accuracy:100, pp:10, priority:0, animStyle:'PULSE',
    effect:{type:'STAT_LOWER', stat:'spAtk', stages:-1, chance:30, target:'opponent'},
    description:'A powerful lunar force blasts the target. It may lower the targets Sp. Atk.'
  },
  FLOWER_SHIELD: {
    id:'FLOWER_SHIELD', name:'Flower Shield', type:'FAIRY', category:'STATUS',
    power:null, accuracy:999, pp:10, priority:0, animStyle:'SELF',
    effect:{type:'STAT_RAISE', stat:'def', stages:1, chance:100, target:'self'},
    description:'The user raises a shield of beautiful flowers around itself, sharply raising its Defense.'
  },
  CRAFTY_SHIELD: {
    id:'CRAFTY_SHIELD', name:'Crafty Shield', type:'FAIRY', category:'STATUS',
    power:null, accuracy:999, pp:10, priority:3, animStyle:'SELF',
    effect:{type:'STAT_RAISE', stats:['def','spDef'], stages:1, chance:100, target:'self'},
    description:'The user protects itself and its allies from status moves with a mystical force field.'
  },
  DECORATE: {
    id:'DECORATE', name:'Decorate', type:'FAIRY', category:'STATUS',
    power:null, accuracy:999, pp:15, priority:0, animStyle:'SELF',
    effect:{type:'STAT_RAISE', stats:['atk','spAtk'], stages:2, chance:100, target:'self'},
    description:'The user covers the target with decorations, sharply raising its Attack and Sp. Atk.'
  },
  STRANGE_STEAM: {
    id:'STRANGE_STEAM', name:'Strange Steam', type:'FAIRY', category:'SPECIAL',
    power:90, accuracy:95, pp:10, priority:0, animStyle:'VORTEX',
    effect:{type:'CONFUSE', chance:20, target:'opponent'},
    description:'The user attacks the target by emitting steam. It may also leave the target confused.'
  },
  STARFALL_SPREE: {
    id:'STARFALL_SPREE', name:'Starfall Spree', type:'FAIRY', category:'PHYSICAL',
    power:100, accuracy:100, pp:10, priority:0, animStyle:'ARC',
    effect:{type:'NONE'},
    description:'Countless stars rain down on the target as a display of overwhelming fairy power.'
  },
  TWINKLE_TACKLE: {
    id:'TWINKLE_TACKLE', name:'Twinkle Tackle', type:'FAIRY', category:'PHYSICAL',
    power:115, accuracy:100, pp:5, priority:0, animStyle:'BURST',
    effect:{type:'NONE'},
    description:'The user charges at the target surrounded by a dazzling fairy light. An overwhelming strike.'
  },
  AROMATIC_MIST: {
    id:'AROMATIC_MIST', name:'Aromatic Mist', type:'FAIRY', category:'STATUS',
    power:null, accuracy:999, pp:20, priority:0, animStyle:'FIELD',
    effect:{type:'STAT_RAISE', stat:'spDef', stages:1, chance:100, target:'self'},
    description:'The user raises the Sp. Def stat of its allies by using a mysterious aroma, or its own Sp. Def.'
  },


LAVA_SURGE: { id:'LAVA_SURGE', name:'Lava Surge', type:'FIRE', category:'SPECIAL', power:85, accuracy:90, pp:10, priority:0, animStyle:'BURST',
    effect:{type:'BURN_CHANCE',chance:30}, description:'A surge of lava erupts upward. May burn the foe.' },
  FIRE_WHEEL: { id:'FIRE_WHEEL', name:'Fire Wheel', type:'FIRE', category:'PHYSICAL', power:70, accuracy:100, pp:15, priority:0, animStyle:'ARC',
    effect:{type:'NONE'}, description:'The user rolls into the foe wrapped in flames.' },
  MAGMA_RAIN: { id:'MAGMA_RAIN', name:'Magma Rain', type:'FIRE', category:'SPECIAL', power:90, accuracy:85, pp:10, priority:0, animStyle:'MULTI',
    effect:{type:'BURN_CHANCE',chance:20}, description:'Molten rock rains down on all foes. May burn.' },
  EMBER_STORM: { id:'EMBER_STORM', name:'Ember Storm', type:'FIRE', category:'SPECIAL', power:60, accuracy:100, pp:20, priority:0, animStyle:'VORTEX',
    effect:{type:'BURN_CHANCE',chance:15}, description:'A swirling storm of embers engulfs the foe.' },
  SCORCHING_BREATH: { id:'SCORCHING_BREATH', name:'Scorching Breath', type:'FIRE', category:'SPECIAL', power:75, accuracy:95, pp:15, priority:0, animStyle:'CONE',
    effect:{type:'BURN_CHANCE',chance:25}, description:'Searing breath scorches the foe. May cause a burn.' },
  INFERNO_DIVE: { id:'INFERNO_DIVE', name:'Inferno Dive', type:'FIRE', category:'PHYSICAL', power:100, accuracy:90, pp:10, priority:0, animStyle:'SLAM',
    effect:{type:'RECOIL',fraction:25}, description:'The user dives into the foe in a blazing spiral. User takes recoil.' },
  VOLCANIC_ASH: { id:'VOLCANIC_ASH', name:'Volcanic Ash', type:'FIRE', category:'STATUS', power:0, accuracy:90, pp:20, priority:0, animStyle:'FIELD',
    effect:{type:'STAT_LOWER',stat:'acc',stages:1}, description:'Ash clouds lower the foes accuracy.' },
  EMBER_CLAW: { id:'EMBER_CLAW', name:'Ember Claw', type:'FIRE', category:'PHYSICAL', power:55, accuracy:100, pp:20, priority:0, animStyle:'MELEE',
    effect:{type:'BURN_CHANCE',chance:20}, description:'Claws blazing with fire slash the foe.' },
  LAVA_PLUNGE: { id:'LAVA_PLUNGE', name:'Lava Plunge', type:'FIRE', category:'PHYSICAL', power:110, accuracy:85, pp:8, priority:0, animStyle:'SLAM',
    effect:{type:'NONE'}, description:'The user plunges into lava and slams the foe with burning force.' },
  HEAT_LANCE: { id:'HEAT_LANCE', name:'Heat Lance', type:'FIRE', category:'SPECIAL', power:80, accuracy:100, pp:10, priority:0, animStyle:'BEAM',
    effect:{type:'NONE'}, description:'A thin beam of superheated plasma pierces the foe.' },
  CHAR_PULSE: { id:'CHAR_PULSE', name:'Char Pulse', type:'FIRE', category:'SPECIAL', power:65, accuracy:100, pp:15, priority:0, animStyle:'PULSE',
    effect:{type:'BURN_CHANCE',chance:10}, description:'A pulse of charring energy radiates outward.' },
  MAGMA_FIST: { id:'MAGMA_FIST', name:'Magma Fist', type:'FIRE', category:'PHYSICAL', power:85, accuracy:95, pp:10, priority:0, animStyle:'MELEE',
    effect:{type:'BURN_CHANCE',chance:30}, description:'A punch wrapped in magma scorches on impact.' },
  SOLAR_FLARE: { id:'SOLAR_FLARE', name:'Solar Flare', type:'FIRE', category:'SPECIAL', power:120, accuracy:80, pp:8, priority:0, animStyle:'BURST',
    effect:{type:'STAT_LOWER',stat:'spDef',stages:1}, description:'A blinding solar burst scalds and lowers Sp. Def.' },
  FIREWORKS: { id:'FIREWORKS', name:'Fireworks', type:'FIRE', category:'SPECIAL', power:50, accuracy:100, pp:20, priority:0, animStyle:'MULTI',
    effect:{type:'MULTI_HIT',hits:'2-5'}, description:'Colorful fire bursts strike 2-5 times.' },
  BURNING_COMET: { id:'BURNING_COMET', name:'Burning Comet', type:'FIRE', category:'SPECIAL', power:100, accuracy:90, pp:10, priority:0, animStyle:'PROJECTILE',
    effect:{type:'BURN_CHANCE',chance:20}, description:'A blazing comet of condensed fire crashes down.' },
  IMMOLATION: { id:'IMMOLATION', name:'Immolation', type:'FIRE', category:'SPECIAL', power:0, accuracy:100, pp:10, priority:0, animStyle:'AURA',
    effect:{type:'STAT_RAISE',stat:'spAtk',stages:3}, description:'The user ignites its own aura, sharply boosting Sp. Atk.' },
  CINDERBLAST: { id:'CINDERBLAST', name:'Cinderblast', type:'FIRE', category:'SPECIAL', power:90, accuracy:100, pp:10, priority:0, animStyle:'BURST',
    effect:{type:'NONE'}, description:'An explosion of cinder and flame erupts at the foe.' },
  SMOLDER: { id:'SMOLDER', name:'Smolder', type:'FIRE', category:'STATUS', power:0, accuracy:100, pp:30, priority:0, animStyle:'FIELD',
    effect:{type:'BURN_CHANCE',chance:100}, description:'Sets the foe ablaze with a steady, persistent flame.' },
  FIRE_SURGE: { id:'FIRE_SURGE', name:'Fire Surge', type:'FIRE', category:'SPECIAL', power:75, accuracy:100, pp:15, priority:0, animStyle:'WAVE',
    effect:{type:'NONE'}, description:'A surging wall of flames sweeps over the foe.' },
  FIRECRACKER: { id:'FIRECRACKER', name:'Firecracker', type:'FIRE', category:'PHYSICAL', power:45, accuracy:100, pp:25, priority:1, animStyle:'PROJECTILE',
    effect:{type:'FLINCH',chance:20}, description:'A fast-flying ember may make the foe flinch.' },
  MAGMA_SHIELD: { id:'MAGMA_SHIELD', name:'Magma Shield', type:'FIRE', category:'STATUS', power:0, accuracy:100, pp:15, priority:0, animStyle:'SELF',
    effect:{type:'STAT_RAISE',stat:'def',stages:2}, description:'Coats the body in magma to raise Defense.' },
  FLAME_TORNADO: { id:'FLAME_TORNADO', name:'Flame Tornado', type:'FIRE', category:'SPECIAL', power:95, accuracy:85, pp:10, priority:0, animStyle:'VORTEX',
    effect:{type:'BURN_CHANCE',chance:30}, description:'A spinning funnel of fire traps the foe.' },
  BONFIRE: { id:'BONFIRE', name:'Bonfire', type:'FIRE', category:'SPECIAL', power:70, accuracy:100, pp:15, priority:0, animStyle:'BURST',
    effect:{type:'STAT_RAISE',stat:'spAtk',stages:1}, description:'The user basks in a bonfire, boosting Sp. Atk.' },
  IGNITE: { id:'IGNITE', name:'Ignite', type:'FIRE', category:'STATUS', power:0, accuracy:95, pp:20, priority:0, animStyle:'FIELD',
    effect:{type:'STAT_LOWER',stat:'spDef',stages:1}, description:'Sets fire to the foes defenses, lowering Sp. Def.' },
  PYRE_WAVE: { id:'PYRE_WAVE', name:'Pyre Wave', type:'FIRE', category:'SPECIAL', power:80, accuracy:95, pp:10, priority:0, animStyle:'WAVE',
    effect:{type:'BURN_CHANCE',chance:25}, description:'A wave of funeral fire rolls over the battlefield.' },

  // ═══════════════════════════════════════════════════════
  // PHASE 2 BATCH A — WATER (25 new)
  // ═══════════════════════════════════════════════════════
  TORRENT_RUSH: { id:'TORRENT_RUSH', name:'Torrent Rush', type:'WATER', category:'PHYSICAL', power:90, accuracy:95, pp:10, priority:0, animStyle:'WAVE',
    effect:{type:'NONE'}, description:'The user rushes at the foe on a powerful torrent.' },
  MIST_VEIL: { id:'MIST_VEIL', name:'Mist Veil', type:'WATER', category:'STATUS', power:0, accuracy:100, pp:20, priority:0, animStyle:'SELF',
    effect:{type:'STAT_RAISE',stat:'def',stages:1}, description:'Wraps the user in a defensive mist.' },
  SEAFOAM_BLAST: { id:'SEAFOAM_BLAST', name:'Seafoam Blast', type:'WATER', category:'SPECIAL', power:65, accuracy:100, pp:20, priority:0, animStyle:'BURST',
    effect:{type:'STAT_LOWER',stat:'spDef',stages:1}, description:'Blasts with seafoam that eats at defenses.' },
  PRESSURE_STREAM: { id:'PRESSURE_STREAM', name:'Pressure Stream', type:'WATER', category:'SPECIAL', power:80, accuracy:100, pp:15, priority:0, animStyle:'BEAM',
    effect:{type:'NONE'}, description:'High-pressure water cuts with pinpoint accuracy.' },
  RIPTIDE: { id:'RIPTIDE', name:'Riptide', type:'WATER', category:'PHYSICAL', power:85, accuracy:95, pp:10, priority:0, animStyle:'WAVE',
    effect:{type:'NONE'}, description:'A sudden rip current drags the foe under.' },
  AQUA_SPIKE: { id:'AQUA_SPIKE', name:'Aqua Spike', type:'WATER', category:'PHYSICAL', power:60, accuracy:100, pp:20, priority:0, animStyle:'PROJECTILE',
    effect:{type:'NONE'}, description:'Sharp spikes of compressed water pierce the foe.' },
  DEEP_CURRENT: { id:'DEEP_CURRENT', name:'Deep Current', type:'WATER', category:'SPECIAL', power:95, accuracy:90, pp:10, priority:0, animStyle:'VORTEX',
    effect:{type:'NONE'}, description:'A deep ocean current spirals around the foe.' },
  GEYSER: { id:'GEYSER', name:'Geyser', type:'WATER', category:'SPECIAL', power:110, accuracy:85, pp:8, priority:0, animStyle:'BURST',
    effect:{type:'NONE'}, description:'A superheated geyser erupts beneath the foe.' },
  BUBBLE_BOMB: { id:'BUBBLE_BOMB', name:'Bubble Bomb', type:'WATER', category:'SPECIAL', power:55, accuracy:100, pp:20, priority:0, animStyle:'PROJECTILE',
    effect:{type:'STAT_LOWER',stat:'spd',stages:1}, description:'Exploding bubbles slow the foe.' },
  GLACIER_WALL: { id:'GLACIER_WALL', name:'Glacier Wall', type:'WATER', category:'STATUS', power:0, accuracy:100, pp:15, priority:0, animStyle:'SELF',
    effect:{type:'STAT_RAISE',stat:'def',stages:2}, description:'Forms an icy wall of glacial water around the user.' },
  MAELSTROM: { id:'MAELSTROM', name:'Maelstrom', type:'WATER', category:'SPECIAL', power:100, accuracy:85, pp:10, priority:0, animStyle:'VORTEX',
    effect:{type:'NONE'}, description:'A violent whirlpool traps and batters the foe.' },
  CREST_WAVE: { id:'CREST_WAVE', name:'Crest Wave', type:'WATER', category:'SPECIAL', power:70, accuracy:100, pp:15, priority:0, animStyle:'WAVE',
    effect:{type:'NONE'}, description:'A cresting tidal wave washes over the foe.' },
  HYDRO_BLADE: { id:'HYDRO_BLADE', name:'Hydro Blade', type:'WATER', category:'PHYSICAL', power:85, accuracy:100, pp:10, priority:0, animStyle:'MELEE',
    effect:{type:'NONE'}, description:'A blade of pressurized water slashes cleanly.' },
  OCEAN_PULSE: { id:'OCEAN_PULSE', name:'Ocean Pulse', type:'WATER', category:'SPECIAL', power:75, accuracy:100, pp:15, priority:0, animStyle:'PULSE',
    effect:{type:'NONE'}, description:'Rhythmic pulses of ocean energy buffet the foe.' },
  WATER_SPEAR: { id:'WATER_SPEAR', name:'Water Spear', type:'WATER', category:'PHYSICAL', power:65, accuracy:100, pp:20, priority:0, animStyle:'PROJECTILE',
    effect:{type:'NONE'}, description:'A sharpened spike of water hurled at speed.' },
  TIDAL_WAVE: { id:'TIDAL_WAVE', name:'Tidal Wave', type:'WATER', category:'SPECIAL', power:120, accuracy:80, pp:5, priority:0, animStyle:'WAVE',
    effect:{type:'NONE'}, description:'A massive tidal wave crashes across the field.' },
  SALTWATER_SURGE: { id:'SALTWATER_SURGE', name:'Saltwater Surge', type:'WATER', category:'SPECIAL', power:70, accuracy:100, pp:15, priority:0, animStyle:'BURST',
    effect:{type:'BURN_CHANCE',chance:10}, description:'Stinging saltwater blasts sting like fire.' },
  AQUA_BURST: { id:'AQUA_BURST', name:'Aqua Burst', type:'WATER', category:'SPECIAL', power:80, accuracy:100, pp:10, priority:0, animStyle:'BURST',
    effect:{type:'NONE'}, description:'An explosive burst of water detonates on contact.' },
  SPRAY_STORM: { id:'SPRAY_STORM', name:'Spray Storm', type:'WATER', category:'SPECIAL', power:55, accuracy:95, pp:20, priority:0, animStyle:'MULTI',
    effect:{type:'MULTI_HIT',hits:'2-5'}, description:'A storm of water droplets strikes 2-5 times.' },
  POOL_CRASH: { id:'POOL_CRASH', name:'Pool Crash', type:'WATER', category:'PHYSICAL', power:100, accuracy:90, pp:10, priority:0, animStyle:'SLAM',
    effect:{type:'RECOIL',fraction:25}, description:'Crashes the foe into a pool of water. Causes recoil.' },
  FOG_SCREEN: { id:'FOG_SCREEN', name:'Fog Screen', type:'WATER', category:'STATUS', power:0, accuracy:100, pp:20, priority:0, animStyle:'FIELD',
    effect:{type:'STAT_LOWER',stat:'acc',stages:1}, description:'Thick fog reduces the foes accuracy.' },
  WATER_FANG: { id:'WATER_FANG', name:'Water Fang', type:'WATER', category:'PHYSICAL', power:65, accuracy:95, pp:15, priority:0, animStyle:'MELEE',
    effect:{type:'PARALYSIS',chance:10}, description:'Watery fangs may paralyze on impact.' },
  UNDERTOW: { id:'UNDERTOW', name:'Undertow', type:'WATER', category:'SPECIAL', power:75, accuracy:100, pp:15, priority:0, animStyle:'WAVE',
    effect:{type:'STAT_LOWER',stat:'spd',stages:1}, description:'A dragging current slows the foe.' },
  FROZEN_TIDE: { id:'FROZEN_TIDE', name:'Frozen Tide', type:'WATER', category:'SPECIAL', power:85, accuracy:90, pp:10, priority:0, animStyle:'WAVE',
    effect:{type:'FREEZE_CHANCE',chance:10}, description:'Supercooled tidal water may freeze the foe.' },
  RIVER_RUSH: { id:'RIVER_RUSH', name:'River Rush', type:'WATER', category:'PHYSICAL', power:70, accuracy:100, pp:15, priority:1, animStyle:'WAVE',
    effect:{type:'NONE'}, description:'The user surges like a river, striking first.' },

  // ═══════════════════════════════════════════════════════
  // PHASE 2 BATCH A — GRASS (25 new)
  // ═══════════════════════════════════════════════════════
  THORN_VOLLEY: { id:'THORN_VOLLEY', name:'Thorn Volley', type:'GRASS', category:'PHYSICAL', power:55, accuracy:95, pp:20, priority:0, animStyle:'MULTI',
    effect:{type:'MULTI_HIT',hits:'2-5'}, description:'A volley of razor thorns strikes 2-5 times.' },
  VERDANT_SURGE: { id:'VERDANT_SURGE', name:'Verdant Surge', type:'GRASS', category:'SPECIAL', power:80, accuracy:100, pp:15, priority:0, animStyle:'WAVE',
    effect:{type:'NONE'}, description:'A surge of verdant energy rolls over the battlefield.' },
  CANOPY_CRASH: { id:'CANOPY_CRASH', name:'Canopy Crash', type:'GRASS', category:'PHYSICAL', power:100, accuracy:90, pp:10, priority:0, animStyle:'SLAM',
    effect:{type:'NONE'}, description:'The user crashes down from the treetop canopy.' },
  SPORE_CLOUD: { id:'SPORE_CLOUD', name:'Spore Cloud', type:'GRASS', category:'STATUS', power:0, accuracy:90, pp:15, priority:0, animStyle:'FIELD',
    effect:{type:'SLEEP',chance:100}, description:'A dense cloud of sleep spores settles on the foe.' },
  VINE_LASH: { id:'VINE_LASH', name:'Vine Lash', type:'GRASS', category:'PHYSICAL', power:75, accuracy:100, pp:15, priority:0, animStyle:'MELEE',
    effect:{type:'NONE'}, description:'Whipping vines snap at the foe with great force.' },
  PHOTON_LEAF: { id:'PHOTON_LEAF', name:'Photon Leaf', type:'GRASS', category:'SPECIAL', power:85, accuracy:100, pp:10, priority:0, animStyle:'PULSE',
    effect:{type:'NONE'}, description:'Leaves charged with solar energy blast the foe.' },
  ROOT_BIND: { id:'ROOT_BIND', name:'Root Bind', type:'GRASS', category:'STATUS', power:0, accuracy:90, pp:20, priority:0, animStyle:'FIELD',
    effect:{type:'PARALYSIS',chance:100}, description:'Underground roots burst up and bind the foe.' },
  BLOOM_BURST: { id:'BLOOM_BURST', name:'Bloom Burst', type:'GRASS', category:'SPECIAL', power:65, accuracy:100, pp:20, priority:0, animStyle:'BURST',
    effect:{type:'STAT_LOWER',stat:'spDef',stages:1}, description:'Pollen bursts lower the foes Sp. Def.' },
  JUNGLE_PULSE: { id:'JUNGLE_PULSE', name:'Jungle Pulse', type:'GRASS', category:'SPECIAL', power:70, accuracy:100, pp:15, priority:0, animStyle:'PULSE',
    effect:{type:'NONE'}, description:'Energy from the jungle floor pulses into the foe.' },
  BRAMBLE_BASH: { id:'BRAMBLE_BASH', name:'Bramble Bash', type:'GRASS', category:'PHYSICAL', power:80, accuracy:95, pp:10, priority:0, animStyle:'SLAM',
    effect:{type:'FLINCH',chance:20}, description:'A slam with thorny brambles may cause flinching.' },
  GRASS_KNOT_STRONG: { id:'GRASS_KNOT_STRONG', name:'Grass Bind', type:'GRASS', category:'SPECIAL', power:90, accuracy:100, pp:10, priority:0, animStyle:'MELEE',
    effect:{type:'NONE'}, description:'Grass coils crush the foe; more effective on heavier foes.' },
  FERN_WAVE: { id:'FERN_WAVE', name:'Fern Wave', type:'GRASS', category:'SPECIAL', power:60, accuracy:100, pp:20, priority:0, animStyle:'WAVE',
    effect:{type:'NONE'}, description:'A rippling wave of fern energy washes over the foe.' },
  OVERGROWTH: { id:'OVERGROWTH', name:'Overgrowth', type:'GRASS', category:'STATUS', power:0, accuracy:100, pp:10, priority:0, animStyle:'SELF',
    effect:{type:'STAT_RAISE',stat:'spAtk',stages:2}, description:'Taps into Overgrowth, sharply raising Sp. Atk.' },
  FOREST_FURY: { id:'FOREST_FURY', name:'Forest Fury', type:'GRASS', category:'PHYSICAL', power:110, accuracy:85, pp:8, priority:0, animStyle:'BURST',
    effect:{type:'RECOIL',fraction:33}, description:'Channels the fury of the forest. Takes recoil.' },
  LEAF_TORNADO: { id:'LEAF_TORNADO', name:'Leaf Tornado', type:'GRASS', category:'SPECIAL', power:65, accuracy:90, pp:15, priority:0, animStyle:'VORTEX',
    effect:{type:'STAT_LOWER',stat:'acc',stages:1}, description:'A vortex of leaves may reduce accuracy.' },
  PHOTOSYNTHESIS: { id:'PHOTOSYNTHESIS', name:'Photosynthesis', type:'GRASS', category:'STATUS', power:0, accuracy:100, pp:10, priority:0, animStyle:'SELF',
    effect:{type:'HEAL',fraction:50}, description:'The user absorbs sunlight to restore half its HP.' },
  WOOD_HAMMER: { id:'WOOD_HAMMER', name:'Wood Hammer', type:'GRASS', category:'PHYSICAL', power:120, accuracy:100, pp:10, priority:0, animStyle:'SLAM',
    effect:{type:'RECOIL',fraction:33}, description:'The user slams with a hardened wooden limb.' },
  SEED_CANNON: { id:'SEED_CANNON', name:'Seed Cannon', type:'GRASS', category:'PHYSICAL', power:70, accuracy:100, pp:15, priority:0, animStyle:'PROJECTILE',
    effect:{type:'NONE'}, description:'Explosive seeds fired at high velocity.' },
  CHLORO_BURST: { id:'CHLORO_BURST', name:'Chloro Burst', type:'GRASS', category:'SPECIAL', power:75, accuracy:100, pp:15, priority:0, animStyle:'BURST',
    effect:{type:'NONE'}, description:'Chlorophyll energy explodes outward from the user.' },
  BARK_SHIELD: { id:'BARK_SHIELD', name:'Bark Shield', type:'GRASS', category:'STATUS', power:0, accuracy:100, pp:20, priority:0, animStyle:'SELF',
    effect:{type:'STAT_RAISE',stat:'def',stages:2}, description:'Hardens a bark shell around the body, raising Defense.' },
  VINE_DRAIN: { id:'VINE_DRAIN', name:'Vine Drain', type:'GRASS', category:'SPECIAL', power:75, accuracy:100, pp:10, priority:0, animStyle:'DRAIN',
    effect:{type:'DRAIN',fraction:50}, description:'Vines drain life from the foe, healing the user.' },
  PETAL_STORM: { id:'PETAL_STORM', name:'Petal Storm', type:'GRASS', category:'PHYSICAL', power:90, accuracy:100, pp:15, priority:0, animStyle:'VORTEX',
    effect:{type:'NONE'}, description:'Razor-edged petals whirl in a violent storm.' },
  SAP_DRAIN: { id:'SAP_DRAIN', name:'Sap Drain', type:'GRASS', category:'SPECIAL', power:55, accuracy:100, pp:20, priority:0, animStyle:'DRAIN',
    effect:{type:'DRAIN',fraction:50}, description:'Draws vital sap from the foe to heal the user.' },
  TANGLE_SHOT: { id:'TANGLE_SHOT', name:'Tangle Shot', type:'GRASS', category:'PHYSICAL', power:50, accuracy:100, pp:20, priority:0, animStyle:'PROJECTILE',
    effect:{type:'STAT_LOWER',stat:'spd',stages:1}, description:'Sticky vine tangles slow the foe.' },
  NATURE_POWER: { id:'NATURE_POWER', name:'Natures Wrath', type:'GRASS', category:'SPECIAL', power:100, accuracy:90, pp:10, priority:0, animStyle:'BURST',
    effect:{type:'NONE'}, description:'Channels the full wrath of nature into an attack.' },

  // ═══════════════════════════════════════════════════════
  // PHASE 2 BATCH A — ELECTRIC (25 new)
  // ═══════════════════════════════════════════════════════
  VOLTAGE_CRASH: { id:'VOLTAGE_CRASH', name:'Voltage Crash', type:'ELECTRIC', category:'PHYSICAL', power:90, accuracy:95, pp:10, priority:0, animStyle:'SLAM',
    effect:{type:'PARALYSIS',chance:20}, description:'Crashes into the foe with electrified body.' },
  CHAIN_LIGHTNING: { id:'CHAIN_LIGHTNING', name:'Chain Lightning', type:'ELECTRIC', category:'SPECIAL', power:70, accuracy:100, pp:15, priority:0, animStyle:'MULTI',
    effect:{type:'PARALYSIS',chance:30}, description:'Lightning chains across multiple targets.' },
  THUNDER_CLAP: { id:'THUNDER_CLAP', name:'Thunder Clap', type:'ELECTRIC', category:'SPECIAL', power:80, accuracy:100, pp:10, priority:0, animStyle:'BURST',
    effect:{type:'FLINCH',chance:20}, description:'A deafening thunderclap may cause flinching.' },
  PLASMA_BURST: { id:'PLASMA_BURST', name:'Plasma Burst', type:'ELECTRIC', category:'SPECIAL', power:85, accuracy:95, pp:10, priority:0, animStyle:'BURST',
    effect:{type:'PARALYSIS',chance:20}, description:'Superheated plasma bursts around the foe.' },
  STATIC_FIELD: { id:'STATIC_FIELD', name:'Static Field', type:'ELECTRIC', category:'STATUS', power:0, accuracy:100, pp:20, priority:0, animStyle:'FIELD',
    effect:{type:'PARALYSIS',chance:100}, description:'Creates a static field that paralyzes the foe.' },
  SPARK_SHOWER: { id:'SPARK_SHOWER', name:'Spark Shower', type:'ELECTRIC', category:'SPECIAL', power:55, accuracy:100, pp:20, priority:0, animStyle:'MULTI',
    effect:{type:'PARALYSIS',chance:10}, description:'A shower of sparks strikes 2-5 times.' },
  ELECTROMAGNETIC: { id:'ELECTROMAGNETIC', name:'Electromagnetic', type:'ELECTRIC', category:'STATUS', power:0, accuracy:100, pp:15, priority:0, animStyle:'FIELD',
    effect:{type:'STAT_LOWER',stat:'spd',stages:2}, description:'An EM pulse sharply slows the foe.' },
  THUNDER_FIST: { id:'THUNDER_FIST', name:'Thunder Fist', type:'ELECTRIC', category:'PHYSICAL', power:85, accuracy:100, pp:10, priority:0, animStyle:'MELEE',
    effect:{type:'PARALYSIS',chance:30}, description:'An electrified punch that may cause paralysis.' },
  GALVANIC_STRIKE: { id:'GALVANIC_STRIKE', name:'Galvanic Strike', type:'ELECTRIC', category:'PHYSICAL', power:75, accuracy:100, pp:15, priority:0, animStyle:'MELEE',
    effect:{type:'NONE'}, description:'A powerful strike channeling galvanic energy.' },
  VOLT_CRASH: { id:'VOLT_CRASH', name:'Volt Crash', type:'ELECTRIC', category:'PHYSICAL', power:100, accuracy:90, pp:10, priority:0, animStyle:'SLAM',
    effect:{type:'PARALYSIS',chance:30}, description:'Crashes with massive electrical voltage.' },
  ARC_FLASH: { id:'ARC_FLASH', name:'Arc Flash', type:'ELECTRIC', category:'SPECIAL', power:60, accuracy:100, pp:20, priority:0, animStyle:'ARC',
    effect:{type:'PARALYSIS',chance:30}, description:'A bright arc of electricity may paralyze.' },
  ELECTRON_BEAM: { id:'ELECTRON_BEAM', name:'Electron Beam', type:'ELECTRIC', category:'SPECIAL', power:130, accuracy:100, pp:5, priority:0, animStyle:'BEAM',
    effect:{type:'STAT_LOWER',stat:'spAtk',stages:2}, description:'Full-power electron beam lowers the users Sp. Atk.' },
  POWER_SURGE: { id:'POWER_SURGE', name:'Power Surge', type:'ELECTRIC', category:'STATUS', power:0, accuracy:100, pp:15, priority:0, animStyle:'SELF',
    effect:{type:'STAT_RAISE',stat:'spAtk',stages:2}, description:'The user overloads, sharply boosting Sp. Atk.' },
  BOLT_STRIKE: { id:'BOLT_STRIKE', name:'Bolt Strike', type:'ELECTRIC', category:'PHYSICAL', power:130, accuracy:85, pp:5, priority:0, animStyle:'BEAM',
    effect:{type:'PARALYSIS',chance:20}, description:'A lightning-speed strike of immense power.' },
  MAGNETIC_PULSE: { id:'MAGNETIC_PULSE', name:'Magnetic Pulse', type:'ELECTRIC', category:'SPECIAL', power:70, accuracy:100, pp:15, priority:0, animStyle:'PULSE',
    effect:{type:'STAT_LOWER',stat:'def',stages:1}, description:'Magnetic waves disrupt the foes defenses.' },
  TESLA_BLAST: { id:'TESLA_BLAST', name:'Tesla Blast', type:'ELECTRIC', category:'SPECIAL', power:90, accuracy:95, pp:10, priority:0, animStyle:'BURST',
    effect:{type:'PARALYSIS',chance:20}, description:'A blast of Tesla-coil electricity shocks the foe.' },
  SHOCK_WAVE_SURGE: { id:'SHOCK_WAVE_SURGE', name:'Shock Surge', type:'ELECTRIC', category:'SPECIAL', power:75, accuracy:100, pp:15, priority:0, animStyle:'WAVE',
    effect:{type:'NONE'}, description:'A shockwave of electricity pulses outward.' },
  LIGHTNING_ROD_HIT: { id:'LIGHTNING_ROD_HIT', name:'Lightning Spear', type:'ELECTRIC', category:'PHYSICAL', power:80, accuracy:100, pp:10, priority:0, animStyle:'BEAM',
    effect:{type:'NONE'}, description:'A concentrated lightning bolt hurled like a spear.' },
  OVERCHARGE: { id:'OVERCHARGE', name:'Overcharge', type:'ELECTRIC', category:'SPECIAL', power:110, accuracy:90, pp:8, priority:0, animStyle:'BURST',
    effect:{type:'RECOIL',fraction:25}, description:'Dangerously overcharges for massive damage. Causes recoil.' },
  ZAP_BURST: { id:'ZAP_BURST', name:'Zap Burst', type:'ELECTRIC', category:'SPECIAL', power:50, accuracy:100, pp:25, priority:0, animStyle:'BURST',
    effect:{type:'PARALYSIS',chance:20}, description:'Quick zap of electricity. May paralyze.' },
  STORMFRONT: { id:'STORMFRONT', name:'Stormfront', type:'ELECTRIC', category:'SPECIAL', power:95, accuracy:90, pp:10, priority:0, animStyle:'VORTEX',
    effect:{type:'PARALYSIS',chance:30}, description:'Summons a storm front that electrifies the field.' },
  CHARGE_STRIKE: { id:'CHARGE_STRIKE', name:'Charge Strike', type:'ELECTRIC', category:'PHYSICAL', power:65, accuracy:100, pp:15, priority:0, animStyle:'MELEE',
    effect:{type:'STAT_RAISE',stat:'spDef',stages:1}, description:'Charges up and strikes, boosting Sp. Def.' },
  NEON_BURST: { id:'NEON_BURST', name:'Neon Burst', type:'ELECTRIC', category:'SPECIAL', power:80, accuracy:100, pp:10, priority:0, animStyle:'BURST',
    effect:{type:'NONE'}, description:'Neon-lit energy detonates in a brilliant flash.' },
  SPARK_TRAIL: { id:'SPARK_TRAIL', name:'Spark Trail', type:'ELECTRIC', category:'PHYSICAL', power:60, accuracy:100, pp:20, priority:0, animStyle:'ARC',
    effect:{type:'PARALYSIS',chance:20}, description:'Leaves a trail of sparks that shocks the foe.' },

  // ═══════════════════════════════════════════════════════
  // PHASE 2 BATCH A — ICE (20 new)
  // ═══════════════════════════════════════════════════════
  FROST_LANCE: { id:'FROST_LANCE', name:'Frost Lance', type:'ICE', category:'PHYSICAL', power:75, accuracy:100, pp:15, priority:0, animStyle:'BEAM',
    effect:{type:'FREEZE_CHANCE',chance:10}, description:'A lance of ice hurled at the foe.' },
  SNOWSTORM: { id:'SNOWSTORM', name:'Snowstorm', type:'ICE', category:'SPECIAL', power:85, accuracy:90, pp:10, priority:0, animStyle:'VORTEX',
    effect:{type:'FREEZE_CHANCE',chance:20}, description:'A raging snowstorm blasts the foe.' },
  CRYO_BEAM: { id:'CRYO_BEAM', name:'Cryo Beam', type:'ICE', category:'SPECIAL', power:100, accuracy:90, pp:10, priority:0, animStyle:'BEAM',
    effect:{type:'FREEZE_CHANCE',chance:30}, description:'A beam of cryogenic energy may freeze the foe.' },
  SLEET_STORM: { id:'SLEET_STORM', name:'Sleet Storm', type:'ICE', category:'SPECIAL', power:65, accuracy:90, pp:15, priority:0, animStyle:'MULTI',
    effect:{type:'STAT_LOWER',stat:'spd',stages:1}, description:'Sleet pellets slow the foe.' },
  PERMAFROST_STRIKE: { id:'PERMAFROST_STRIKE', name:'Permafrost Strike', type:'ICE', category:'PHYSICAL', power:90, accuracy:95, pp:10, priority:0, animStyle:'SLAM',
    effect:{type:'STAT_LOWER',stat:'spd',stages:1}, description:'Freezes the ground beneath the foe on impact.' },
  BLIZZARD_BLADE: { id:'BLIZZARD_BLADE', name:'Blizzard Blade', type:'ICE', category:'PHYSICAL', power:80, accuracy:100, pp:10, priority:0, animStyle:'MELEE',
    effect:{type:'FREEZE_CHANCE',chance:20}, description:'A blade sharpened to arctic cold.' },
  ICE_SPIKE: { id:'ICE_SPIKE', name:'Ice Spike', type:'ICE', category:'PHYSICAL', power:50, accuracy:100, pp:25, priority:0, animStyle:'PROJECTILE',
    effect:{type:'FREEZE_CHANCE',chance:10}, description:'A sharp ice spike hurled at the foe.' },
  TUNDRA_WAVE: { id:'TUNDRA_WAVE', name:'Tundra Wave', type:'ICE', category:'SPECIAL', power:75, accuracy:100, pp:15, priority:0, animStyle:'WAVE',
    effect:{type:'FREEZE_CHANCE',chance:10}, description:'A wave of arctic air sweeps the battlefield.' },
  ABSOLUTE_ZERO: { id:'ABSOLUTE_ZERO', name:'Absolute Zero', type:'ICE', category:'SPECIAL', power:0, accuracy:30, pp:5, priority:0, animStyle:'BEAM',
    effect:{type:'ONE_HIT_KO'}, description:'Drops temperature to absolute zero. One-hit KO if it hits.' },
  AURORA_BLAST: { id:'AURORA_BLAST', name:'Aurora Blast', type:'ICE', category:'SPECIAL', power:80, accuracy:95, pp:10, priority:0, animStyle:'ARC',
    effect:{type:'FREEZE_CHANCE',chance:15}, description:'Northern lights solidify into a freezing blast.' },
  FROSTBITE: { id:'FROSTBITE', name:'Frostbite', type:'ICE', category:'STATUS', power:0, accuracy:100, pp:20, priority:0, animStyle:'FIELD',
    effect:{type:'FREEZE_CHANCE',chance:100}, description:'Inflicts frostbite, freezing the foe solid.' },
  POLAR_VORTEX: { id:'POLAR_VORTEX', name:'Polar Vortex', type:'ICE', category:'SPECIAL', power:110, accuracy:85, pp:8, priority:0, animStyle:'VORTEX',
    effect:{type:'FREEZE_CHANCE',chance:30}, description:'A devastating polar vortex engulfs the field.' },
  FROST_BREATH_CHILL: { id:'FROST_BREATH_CHILL', name:'Frost Breath', type:'ICE', category:'SPECIAL', power:60, accuracy:90, pp:15, priority:0, animStyle:'CONE',
    effect:{type:'FREEZE_CHANCE',chance:30}, description:'Critical-hit-always frosty breath chills the foe.' },
  ICE_WALL: { id:'ICE_WALL', name:'Ice Wall', type:'ICE', category:'STATUS', power:0, accuracy:100, pp:15, priority:0, animStyle:'SELF',
    effect:{type:'STAT_RAISE',stat:'def',stages:2}, description:'Erects a wall of thick ice to raise Defense.' },
  GLACIER_SMASH: { id:'GLACIER_SMASH', name:'Glacier Smash', type:'ICE', category:'PHYSICAL', power:100, accuracy:90, pp:10, priority:0, animStyle:'SLAM',
    effect:{type:'NONE'}, description:'Smashes the foe with a chunk of ancient glacier.' },
  HAILSTONE: { id:'HAILSTONE', name:'Hailstone', type:'ICE', category:'PHYSICAL', power:65, accuracy:100, pp:15, priority:0, animStyle:'PROJECTILE',
    effect:{type:'FLINCH',chance:20}, description:'A large hailstone may cause the foe to flinch.' },
  ARCTIC_WIND: { id:'ARCTIC_WIND', name:'Arctic Wind', type:'ICE', category:'SPECIAL', power:55, accuracy:95, pp:20, priority:0, animStyle:'WAVE',
    effect:{type:'STAT_LOWER',stat:'spd',stages:1}, description:'Freezing arctic winds slow the foe.' },
  SNOWFALL: { id:'SNOWFALL', name:'Snowfall', type:'ICE', category:'STATUS', power:0, accuracy:100, pp:20, priority:0, animStyle:'FIELD',
    effect:{type:'SET_WEATHER',weather:'SNOW'}, description:'Causes heavy snow to fall for 5 turns.' },
  CRYO_PUNCH: { id:'CRYO_PUNCH', name:'Cryo Punch', type:'ICE', category:'PHYSICAL', power:75, accuracy:100, pp:15, priority:0, animStyle:'MELEE',
    effect:{type:'FREEZE_CHANCE',chance:20}, description:'An icy punch that may freeze on contact.' },
  ICE_BEAM_BURST: { id:'ICE_BEAM_BURST', name:'Glacier Beam', type:'ICE', category:'SPECIAL', power:95, accuracy:100, pp:10, priority:0, animStyle:'BEAM',
    effect:{type:'FREEZE_CHANCE',chance:20}, description:'A condensed beam of glacier-cold energy.' },

  // ═══════════════════════════════════════════════════════
  // PHASE 2 BATCH A — NORMAL (20 new)
  // ═══════════════════════════════════════════════════════
  POWER_SLAM: { id:'POWER_SLAM', name:'Power Slam', type:'NORMAL', category:'PHYSICAL', power:85, accuracy:100, pp:10, priority:0, animStyle:'SLAM',
    effect:{type:'NONE'}, description:'A powerful slam attack with the users full body.' },
  SHOCKWAVE_PULSE: { id:'SHOCKWAVE_PULSE', name:'Shockwave', type:'NORMAL', category:'SPECIAL', power:60, accuracy:100, pp:20, priority:0, animStyle:'PULSE',
    effect:{type:'NONE'}, description:'A pulse of raw kinetic energy that never misses.' },
  AERIAL_BLITZ: { id:'AERIAL_BLITZ', name:'Aerial Blitz', type:'NORMAL', category:'PHYSICAL', power:70, accuracy:100, pp:15, priority:1, animStyle:'ARC',
    effect:{type:'NONE'}, description:'A quick aerial charge that always strikes first.' },
  HORN_THRUST: { id:'HORN_THRUST', name:'Horn Thrust', type:'NORMAL', category:'PHYSICAL', power:0, accuracy:30, pp:5, priority:0, animStyle:'MELEE',
    effect:{type:'ONE_HIT_KO'}, description:'Drives a horn into the foe. One-hit KO if it hits.' },
  ECHO_STRIKE: { id:'ECHO_STRIKE', name:'Echo Strike', type:'NORMAL', category:'SPECIAL', power:60, accuracy:100, pp:20, priority:0, animStyle:'PULSE',
    effect:{type:'NONE'}, description:'An echoing strike whose power grows if used repeatedly.' },
  TAIL_SWEEP: { id:'TAIL_SWEEP', name:'Tail Sweep', type:'NORMAL', category:'PHYSICAL', power:55, accuracy:100, pp:20, priority:0, animStyle:'MELEE',
    effect:{type:'STAT_LOWER',stat:'spd',stages:1}, description:'Sweeps the foes legs with the tail.' },
  CRUNCH_SMASH: { id:'CRUNCH_SMASH', name:'Crunch Smash', type:'NORMAL', category:'PHYSICAL', power:90, accuracy:95, pp:10, priority:0, animStyle:'SLAM',
    effect:{type:'FLINCH',chance:20}, description:'A bone-crunching impact may cause flinching.' },
  LAST_STAND: { id:'LAST_STAND', name:'Last Stand', type:'NORMAL', category:'PHYSICAL', power:200, accuracy:100, pp:5, priority:0, animStyle:'BURST',
    effect:{type:'RECOIL',fraction:50}, description:'Unleashes everything in a final desperate blow.' },
  GIGA_IMPACT_SURGE: { id:'GIGA_IMPACT_SURGE', name:'Giga Rush', type:'NORMAL', category:'PHYSICAL', power:110, accuracy:90, pp:10, priority:0, animStyle:'SLAM',
    effect:{type:'RECHARGE'}, description:'A massive rush attack that requires recharging.' },
  GROUND_POUND: { id:'GROUND_POUND', name:'Ground Pound', type:'NORMAL', category:'PHYSICAL', power:75, accuracy:100, pp:15, priority:0, animStyle:'SLAM',
    effect:{type:'FLINCH',chance:30}, description:'Pounds the ground with tremendous force.' },
  PRIMAL_ROAR: { id:'PRIMAL_ROAR', name:'Primal Roar', type:'NORMAL', category:'STATUS', power:0, accuracy:100, pp:20, priority:0, animStyle:'FIELD',
    effect:{type:'STAT_LOWER',stat:'atk',stages:1}, description:'A fearsome roar lowers the foes Attack.' },
  CRUSH_CLAW: { id:'CRUSH_CLAW', name:'Crush Claw', type:'NORMAL', category:'PHYSICAL', power:75, accuracy:95, pp:10, priority:0, animStyle:'MELEE',
    effect:{type:'STAT_LOWER',stat:'def',stages:1}, description:'Crushing claws may lower the foes Defense.' },
  FURY_SWIPES: { id:'FURY_SWIPES', name:'Fury Swipes', type:'NORMAL', category:'PHYSICAL', power:18, accuracy:80, pp:15, priority:0, animStyle:'MULTI',
    effect:{type:'MULTI_HIT',hits:'2-5'}, description:'Rakes with claws 2-5 times.' },
  DINO_DANCE: { id:'DINO_DANCE', name:'Dino Dance', type:'NORMAL', category:'STATUS', power:0, accuracy:100, pp:20, priority:0, animStyle:'SELF',
    effect:{type:'STAT_RAISE',stats:['atk','spd'],stages:1}, description:'A prehistoric dance raises Attack and Speed.' },
  BONE_CLUB: { id:'BONE_CLUB', name:'Bone Club', type:'NORMAL', category:'PHYSICAL', power:65, accuracy:85, pp:20, priority:0, animStyle:'SLAM',
    effect:{type:'FLINCH',chance:10}, description:'Bludgeons with a bone club. May cause flinching.' },
  MEGA_PUNCH: { id:'MEGA_PUNCH', name:'Mega Punch', type:'NORMAL', category:'PHYSICAL', power:80, accuracy:85, pp:20, priority:0, animStyle:'MELEE',
    effect:{type:'NONE'}, description:'A powerful punch thrown with full body weight.' },
  SHARP_STRIKE: { id:'SHARP_STRIKE', name:'Sharp Strike', type:'NORMAL', category:'PHYSICAL', power:70, accuracy:100, pp:15, priority:0, animStyle:'MELEE',
    effect:{type:'NONE'}, description:'A razor-precise strike that always deals solid damage.' },
  RAMPAGE: { id:'RAMPAGE', name:'Rampage', type:'NORMAL', category:'PHYSICAL', power:90, accuracy:100, pp:10, priority:0, animStyle:'SLAM',
    effect:{type:'CONFUSE',self:true}, description:'A rampaging attack that confuses the user.' },
  TRUMPETING: { id:'TRUMPETING', name:'Trumpeting', type:'NORMAL', category:'STATUS', power:0, accuracy:100, pp:15, priority:0, animStyle:'FIELD',
    effect:{type:'STAT_RAISE',stat:'atk',stages:1}, description:'A rallying call boosts the users Attack.' },
  FOSSIL_STRIKE: { id:'FOSSIL_STRIKE', name:'Fossil Strike', type:'NORMAL', category:'PHYSICAL', power:95, accuracy:100, pp:10, priority:0, animStyle:'SLAM',
    effect:{type:'NONE'}, description:'Strikes with the force of ancient fossilized bone.' },

  // ═══════════════════════════════════════════════════════
  // PHASE 2 BATCH A — FIGHTING (20 new)
  // ═══════════════════════════════════════════════════════
  HURRICANE_KICK: { id:'HURRICANE_KICK', name:'Hurricane Kick', type:'FIGHTING', category:'PHYSICAL', power:85, accuracy:95, pp:10, priority:0, animStyle:'ARC',
    effect:{type:'NONE'}, description:'A spinning kick with tornado-like force.' },
  JAB_FLURRY: { id:'JAB_FLURRY', name:'Jab Flurry', type:'FIGHTING', category:'PHYSICAL', power:15, accuracy:100, pp:20, priority:0, animStyle:'MULTI',
    effect:{type:'MULTI_HIT',hits:'2-5'}, description:'A rapid flurry of jabs hits 2-5 times.' },
  POWER_UPPER: { id:'POWER_UPPER', name:'Power Upper', type:'FIGHTING', category:'PHYSICAL', power:90, accuracy:90, pp:10, priority:0, animStyle:'MELEE',
    effect:{type:'NONE'}, description:'A charged uppercut with devastating impact.' },
  GRAPPLE: { id:'GRAPPLE', name:'Grapple', type:'FIGHTING', category:'PHYSICAL', power:75, accuracy:100, pp:15, priority:0, animStyle:'MELEE',
    effect:{type:'STAT_LOWER',stat:'atk',stages:1}, description:'Grapples the foe, lowering its Attack.' },
  IRON_FIST: { id:'IRON_FIST', name:'Iron Fist', type:'FIGHTING', category:'PHYSICAL', power:80, accuracy:100, pp:10, priority:0, animStyle:'MELEE',
    effect:{type:'NONE'}, description:'A fist hardened like iron crashes into the foe.' },
  BODY_PRESS: { id:'BODY_PRESS', name:'Body Press', type:'FIGHTING', category:'PHYSICAL', power:80, accuracy:100, pp:10, priority:0, animStyle:'SLAM',
    effect:{type:'NONE'}, description:'Presses down with full body weight. Uses Defense for damage.' },
  MARTIAL_STRIKE: { id:'MARTIAL_STRIKE', name:'Martial Strike', type:'FIGHTING', category:'PHYSICAL', power:70, accuracy:100, pp:15, priority:0, animStyle:'MELEE',
    effect:{type:'FLINCH',chance:20}, description:'A disciplined martial arts strike.' },
  STOMP_RUSH: { id:'STOMP_RUSH', name:'Stomp Rush', type:'FIGHTING', category:'PHYSICAL', power:95, accuracy:95, pp:10, priority:0, animStyle:'SLAM',
    effect:{type:'NONE'}, description:'Charges and stomps with unstoppable momentum.' },
  POWER_TRIP: { id:'POWER_TRIP', name:'Power Trip', type:'FIGHTING', category:'PHYSICAL', power:20, accuracy:100, pp:10, priority:0, animStyle:'MELEE',
    effect:{type:'NONE'}, description:'Stronger when the user has raised many stats.' },
  TWIN_KICK: { id:'TWIN_KICK', name:'Twin Kick', type:'FIGHTING', category:'PHYSICAL', power:50, accuracy:100, pp:20, priority:0, animStyle:'MULTI',
    effect:{type:'MULTI_HIT',hits:2}, description:'Delivers two precise kicks in succession.' },
  BATTLE_CRY: { id:'BATTLE_CRY', name:'Battle Cry', type:'FIGHTING', category:'STATUS', power:0, accuracy:100, pp:15, priority:0, animStyle:'AURA',
    effect:{type:'STAT_RAISE',stats:['atk','def'],stages:1}, description:'A fierce battle cry raises Attack and Defense.' },
  GROUND_SLAM_FIGHT: { id:'GROUND_SLAM_FIGHT', name:'Impact Crash', type:'FIGHTING', category:'PHYSICAL', power:100, accuracy:90, pp:10, priority:0, animStyle:'SLAM',
    effect:{type:'FLINCH',chance:30}, description:'Crashes into the ground near the foe with flinch-inducing force.' },
  SPINNING_KICK: { id:'SPINNING_KICK', name:'Spinning Kick', type:'FIGHTING', category:'PHYSICAL', power:65, accuracy:100, pp:15, priority:0, animStyle:'ARC',
    effect:{type:'NONE'}, description:'A wide spinning kick hits multiple weak points.' },
  FOCUS_BLAST: { id:'FOCUS_BLAST', name:'Focus Blast', type:'FIGHTING', category:'SPECIAL', power:120, accuracy:70, pp:5, priority:0, animStyle:'BURST',
    effect:{type:'STAT_LOWER',stat:'spDef',stages:1}, description:'A focused blast of fighting energy.' },
  SLAM_DOWN_HARD: { id:'SLAM_DOWN_HARD', name:'Slam Down', type:'FIGHTING', category:'PHYSICAL', power:75, accuracy:100, pp:15, priority:0, animStyle:'SLAM',
    effect:{type:'NONE'}, description:'Slams the foe hard into the ground.' },
  PUMMEL: { id:'PUMMEL', name:'Pummel', type:'FIGHTING', category:'PHYSICAL', power:60, accuracy:100, pp:20, priority:0, animStyle:'MULTI',
    effect:{type:'MULTI_HIT',hits:'2-3'}, description:'Rapid punches batter the foe 2-3 times.' },
  BONE_BREAK: { id:'BONE_BREAK', name:'Bone Break', type:'FIGHTING', category:'PHYSICAL', power:85, accuracy:90, pp:10, priority:0, animStyle:'MELEE',
    effect:{type:'STAT_LOWER',stat:'def',stages:1}, description:'Strikes at weak points to lower Defense.' },
  LARIAT: { id:'LARIAT', name:'Lariat', type:'FIGHTING', category:'PHYSICAL', power:85, accuracy:100, pp:10, priority:0, animStyle:'MELEE',
    effect:{type:'NONE'}, description:'A powerful clothesline that ignores stat changes.' },
  SMASH_CHARGE: { id:'SMASH_CHARGE', name:'Smash Charge', type:'FIGHTING', category:'PHYSICAL', power:110, accuracy:90, pp:8, priority:0, animStyle:'SLAM',
    effect:{type:'STAT_LOWER',stat:'def',stages:1}, description:'Charges and smashes, lowering the foes Defense.' },
  MARTIAL_ARTS: { id:'MARTIAL_ARTS', name:'Martial Arts', type:'FIGHTING', category:'STATUS', power:0, accuracy:100, pp:20, priority:0, animStyle:'SELF',
    effect:{type:'STAT_RAISE',stats:['atk','spd'],stages:1}, description:'Channels martial focus, raising Attack and Speed.' },

  // ═══════════════════════════════════════════════════════
  // PHASE 2 BATCH A — POISON (20 new)
  // ═══════════════════════════════════════════════════════
  VENOM_BURST: { id:'VENOM_BURST', name:'Venom Burst', type:'POISON', category:'SPECIAL', power:85, accuracy:95, pp:10, priority:0, animStyle:'BURST',
    effect:{type:'POISON_CHANCE',chance:30}, description:'A burst of concentrated venom splashes the foe.' },
  ACID_RAIN: { id:'ACID_RAIN', name:'Acid Rain', type:'POISON', category:'SPECIAL', power:70, accuracy:90, pp:15, priority:0, animStyle:'MULTI',
    effect:{type:'POISON_CHANCE',chance:20}, description:'Acidic rain drops hit 2-5 times, may poison.' },
  TOXIC_SLAM: { id:'TOXIC_SLAM', name:'Toxic Slam', type:'POISON', category:'PHYSICAL', power:80, accuracy:100, pp:10, priority:0, animStyle:'SLAM',
    effect:{type:'POISON_CHANCE',chance:30}, description:'Slams with a poison-coated body.' },
  MIASMA_CLOUD: { id:'MIASMA_CLOUD', name:'Miasma Cloud', type:'POISON', category:'STATUS', power:0, accuracy:90, pp:15, priority:0, animStyle:'FIELD',
    effect:{type:'POISON_CHANCE',chance:100}, description:'A cloud of miasma poisons the foe.' },
  NEUROTOXIN: { id:'NEUROTOXIN', name:'Neurotoxin', type:'POISON', category:'SPECIAL', power:75, accuracy:95, pp:15, priority:0, animStyle:'PULSE',
    effect:{type:'STAT_LOWER',stat:'spd',stages:1}, description:'Neurotoxins slow the foes nervous system.' },
  CORROSIVE_SPIT: { id:'CORROSIVE_SPIT', name:'Corrosive Spit', type:'POISON', category:'SPECIAL', power:60, accuracy:100, pp:20, priority:0, animStyle:'PROJECTILE',
    effect:{type:'STAT_LOWER',stat:'def',stages:1}, description:'Corrosive spit eats away at armor.' },
  VENOM_STRIKE: { id:'VENOM_STRIKE', name:'Venom Strike', type:'POISON', category:'PHYSICAL', power:65, accuracy:100, pp:15, priority:0, animStyle:'MELEE',
    effect:{type:'POISON_CHANCE',chance:40}, description:'A venomous slash likely to poison.' },
  ACID_DOWNPOUR: { id:'ACID_DOWNPOUR', name:'Acid Downpour', type:'POISON', category:'SPECIAL', power:100, accuracy:90, pp:10, priority:0, animStyle:'BURST',
    effect:{type:'POISON_CHANCE',chance:20}, description:'A torrential downpour of acid crashes down.' },
  PUTRID_WAVE: { id:'PUTRID_WAVE', name:'Putrid Wave', type:'POISON', category:'SPECIAL', power:75, accuracy:100, pp:15, priority:0, animStyle:'WAVE',
    effect:{type:'POISON_CHANCE',chance:30}, description:'A rotting wave of foul energy sweeps the field.' },
  TOXIC_CLAW: { id:'TOXIC_CLAW', name:'Toxic Claw', type:'POISON', category:'PHYSICAL', power:55, accuracy:100, pp:20, priority:0, animStyle:'MELEE',
    effect:{type:'POISON_CHANCE',chance:50}, description:'Claws coated in toxin likely to poison.' },
  SLUDGE_SURGE: { id:'SLUDGE_SURGE', name:'Sludge Surge', type:'POISON', category:'SPECIAL', power:80, accuracy:90, pp:10, priority:0, animStyle:'WAVE',
    effect:{type:'POISON_CHANCE',chance:30}, description:'A surge of toxic sludge washes over the foe.' },
  PLAGUE_BREATH: { id:'PLAGUE_BREATH', name:'Plague Breath', type:'POISON', category:'SPECIAL', power:70, accuracy:100, pp:15, priority:0, animStyle:'CONE',
    effect:{type:'POISON_CHANCE',chance:30}, description:'Plague-filled breath exhaled in a wide cone.' },
  VIPER_LUNGE: { id:'VIPER_LUNGE', name:'Viper Lunge', type:'POISON', category:'PHYSICAL', power:90, accuracy:95, pp:10, priority:0, animStyle:'MELEE',
    effect:{type:'POISON_CHANCE',chance:20}, description:'Lunges like a viper for a venomous bite.' },
  TOXIC_MIST: { id:'TOXIC_MIST', name:'Toxic Mist', type:'POISON', category:'STATUS', power:0, accuracy:100, pp:20, priority:0, animStyle:'FIELD',
    effect:{type:'STAT_LOWER',stat:'acc',stages:1}, description:'A mist of toxins obscures the foes vision.' },
  CORROSION_PULSE: { id:'CORROSION_PULSE', name:'Corrosion Pulse', type:'POISON', category:'SPECIAL', power:65, accuracy:100, pp:15, priority:0, animStyle:'PULSE',
    effect:{type:'STAT_LOWER',stat:'def',stages:1}, description:'A pulse that corrodes the foes defenses.' },
  VENOM_DRIP: { id:'VENOM_DRIP', name:'Venom Drip', type:'POISON', category:'SPECIAL', power:50, accuracy:100, pp:25, priority:0, animStyle:'PROJECTILE',
    effect:{type:'POISON_CHANCE',chance:40}, description:'Drips venom onto the foe. Likely to poison.' },
  TOXIC_SPINES: { id:'TOXIC_SPINES', name:'Toxic Spines', type:'POISON', category:'PHYSICAL', power:60, accuracy:95, pp:15, priority:0, animStyle:'MULTI',
    effect:{type:'POISON_CHANCE',chance:30}, description:'Fires toxic spines that may poison.' },
  NOXIOUS_CLOUD: { id:'NOXIOUS_CLOUD', name:'Noxious Cloud', type:'POISON', category:'SPECIAL', power:80, accuracy:90, pp:10, priority:0, animStyle:'VORTEX',
    effect:{type:'POISON_CHANCE',chance:50}, description:'A swirling noxious cloud heavily poisons the foe.' },
  VENOM_CANNON: { id:'VENOM_CANNON', name:'Venom Cannon', type:'POISON', category:'SPECIAL', power:110, accuracy:85, pp:8, priority:0, animStyle:'BEAM',
    effect:{type:'POISON_CHANCE',chance:20}, description:'Fires a concentrated beam of venom.' },

  // ═══════════════════════════════════════════════════════
  // PHASE 2 BATCH A — GROUND (20 new)
  // ═══════════════════════════════════════════════════════
  SAND_SURGE: { id:'SAND_SURGE', name:'Sand Surge', type:'GROUND', category:'SPECIAL', power:75, accuracy:100, pp:15, priority:0, animStyle:'WAVE',
    effect:{type:'STAT_LOWER',stat:'acc',stages:1}, description:'A surge of sand obscures the foes vision.' },
  CAVE_IN: { id:'CAVE_IN', name:'Cave In', type:'GROUND', category:'PHYSICAL', power:100, accuracy:90, pp:10, priority:0, animStyle:'SLAM',
    effect:{type:'FLINCH',chance:30}, description:'Collapses the cave ceiling on the foe.' },
  MUD_WAVE: { id:'MUD_WAVE', name:'Mud Wave', type:'GROUND', category:'SPECIAL', power:70, accuracy:100, pp:15, priority:0, animStyle:'WAVE',
    effect:{type:'STAT_LOWER',stat:'acc',stages:1}, description:'A wave of thick mud splashes and obscures.' },
  EARTH_SLAM: { id:'EARTH_SLAM', name:'Earth Slam', type:'GROUND', category:'PHYSICAL', power:90, accuracy:95, pp:10, priority:0, animStyle:'SLAM',
    effect:{type:'NONE'}, description:'Slams with the full weight of the earth.' },
  DUST_STORM: { id:'DUST_STORM', name:'Dust Storm', type:'GROUND', category:'STATUS', power:0, accuracy:100, pp:15, priority:0, animStyle:'FIELD',
    effect:{type:'SET_WEATHER',weather:'SANDSTORM'}, description:'Stirs up a raging dust storm.' },
  SEISMIC_WAVE: { id:'SEISMIC_WAVE', name:'Seismic Wave', type:'GROUND', category:'SPECIAL', power:80, accuracy:95, pp:10, priority:0, animStyle:'WAVE',
    effect:{type:'FLINCH',chance:20}, description:'A seismic wave cracks the ground under the foe.' },
  QUICKSAND: { id:'QUICKSAND', name:'Quicksand', type:'GROUND', category:'STATUS', power:0, accuracy:90, pp:20, priority:0, animStyle:'FIELD',
    effect:{type:'PARALYSIS',chance:100}, description:'The foe sinks in quicksand, unable to move.' },
  BEDROCK_BASH: { id:'BEDROCK_BASH', name:'Bedrock Bash', type:'GROUND', category:'PHYSICAL', power:110, accuracy:90, pp:8, priority:0, animStyle:'SLAM',
    effect:{type:'NONE'}, description:'Smashes with a slab of pure bedrock.' },
  FOSSIL_QUAKE: { id:'FOSSIL_QUAKE', name:'Fossil Quake', type:'GROUND', category:'PHYSICAL', power:85, accuracy:100, pp:10, priority:0, animStyle:'BURST',
    effect:{type:'NONE'}, description:'Awakens fossilized energy deep within the earth.' },
  GRIT: { id:'GRIT', name:'Grit', type:'GROUND', category:'STATUS', power:0, accuracy:100, pp:15, priority:0, animStyle:'SELF',
    effect:{type:'STAT_RAISE',stats:['def','spDef'],stages:1}, description:'Channels gritty resilience to boost both defenses.' },
  ROCK_SLIDE_LOW: { id:'ROCK_SLIDE_LOW', name:'Ground Avalanche', type:'GROUND', category:'PHYSICAL', power:75, accuracy:90, pp:15, priority:0, animStyle:'WAVE',
    effect:{type:'FLINCH',chance:20}, description:'Debris slides toward the foe. May cause flinching.' },
  BURROW: { id:'BURROW', name:'Burrow', type:'GROUND', category:'PHYSICAL', power:80, accuracy:100, pp:10, priority:0, animStyle:'SLAM',
    effect:{type:'TWO_TURN'}, description:'Digs underground then strikes. Invulnerable on first turn.' },
  SAND_VEIL_ATTACK: { id:'SAND_VEIL_ATTACK', name:'Sand Veil', type:'GROUND', category:'STATUS', power:0, accuracy:100, pp:15, priority:0, animStyle:'SELF',
    effect:{type:'STAT_RAISE',stat:'spd',stages:1}, description:'Wraps in a sand veil that boosts Speed.' },
  GROUND_BURST: { id:'GROUND_BURST', name:'Ground Burst', type:'GROUND', category:'SPECIAL', power:90, accuracy:90, pp:10, priority:0, animStyle:'BURST',
    effect:{type:'NONE'}, description:'A geyser of earthen energy bursts upward.' },
  TERRAIN_SLASH: { id:'TERRAIN_SLASH', name:'Terrain Slash', type:'GROUND', category:'PHYSICAL', power:70, accuracy:100, pp:15, priority:0, animStyle:'MELEE',
    effect:{type:'NONE'}, description:'Slashes with a claw that tears up the terrain.' },
  MUDSLIDE: { id:'MUDSLIDE', name:'Mudslide', type:'GROUND', category:'PHYSICAL', power:80, accuracy:90, pp:10, priority:0, animStyle:'WAVE',
    effect:{type:'STAT_LOWER',stat:'spd',stages:1}, description:'A mudslide buries and slows the foe.' },
  CRUSHING_EARTH: { id:'CRUSHING_EARTH', name:'Crushing Earth', type:'GROUND', category:'PHYSICAL', power:100, accuracy:100, pp:10, priority:0, animStyle:'SLAM',
    effect:{type:'STAT_LOWER',stat:'def',stages:1}, description:'The earth compresses the foe, lowering Defense.' },
  FOSSIL_SMASH: { id:'FOSSIL_SMASH', name:'Fossil Smash', type:'GROUND', category:'PHYSICAL', power:80, accuracy:100, pp:15, priority:0, animStyle:'SLAM',
    effect:{type:'NONE'}, description:'Smashes with a prehistoric fossilized limb.' },
  CRATER_MAKER: { id:'CRATER_MAKER', name:'Crater Maker', type:'GROUND', category:'PHYSICAL', power:120, accuracy:85, pp:8, priority:0, animStyle:'SLAM',
    effect:{type:'RECOIL',fraction:25}, description:'Creates a crater on impact. Causes recoil.' },
  ANCIENT_QUAKE: { id:'ANCIENT_QUAKE', name:'Ancient Quake', type:'GROUND', category:'PHYSICAL', power:95, accuracy:90, pp:10, priority:0, animStyle:'BURST',
    effect:{type:'NONE'}, description:'Triggers dormant seismic energy from ancient times.' },

  // ═══════════════════════════════════════════════════════
  // PHASE 2 BATCH A — FLYING (20 new)
  // ═══════════════════════════════════════════════════════
  WIND_SLASH: { id:'WIND_SLASH', name:'Wind Slash', type:'FLYING', category:'PHYSICAL', power:70, accuracy:100, pp:15, priority:0, animStyle:'MELEE',
    effect:{type:'NONE'}, description:'A precise slash with a wind-sharpened wing.' },
  CYCLONE_DIVE: { id:'CYCLONE_DIVE', name:'Cyclone Dive', type:'FLYING', category:'PHYSICAL', power:90, accuracy:95, pp:10, priority:0, animStyle:'ARC',
    effect:{type:'NONE'}, description:'Spirals down in a cyclone to crash into the foe.' },
  FEATHER_BLADE: { id:'FEATHER_BLADE', name:'Feather Blade', type:'FLYING', category:'PHYSICAL', power:55, accuracy:100, pp:20, priority:0, animStyle:'MULTI',
    effect:{type:'MULTI_HIT',hits:'2-5'}, description:'Razor feathers strike 2-5 times.' },
  SKY_FURY: { id:'SKY_FURY', name:'Sky Fury', type:'FLYING', category:'PHYSICAL', power:100, accuracy:90, pp:10, priority:0, animStyle:'SLAM',
    effect:{type:'NONE'}, description:'Crashes from the sky with furious speed.' },
  TAILWIND_BOOST: { id:'TAILWIND_BOOST', name:'Tailwind Boost', type:'FLYING', category:'STATUS', power:0, accuracy:100, pp:15, priority:0, animStyle:'SELF',
    effect:{type:'STAT_RAISE',stat:'spd',stages:2}, description:'Riding the tailwind sharply boosts Speed.' },
  GUST_SLICE: { id:'GUST_SLICE', name:'Gust Slice', type:'FLYING', category:'SPECIAL', power:60, accuracy:100, pp:20, priority:0, animStyle:'ARC',
    effect:{type:'NONE'}, description:'A slice of focused wind cuts through the foe.' },
  WING_STORM: { id:'WING_STORM', name:'Wing Storm', type:'FLYING', category:'PHYSICAL', power:85, accuracy:95, pp:10, priority:0, animStyle:'VORTEX',
    effect:{type:'NONE'}, description:'Beats wings into a storm that pounds the foe.' },
  UPDRAFT: { id:'UPDRAFT', name:'Updraft', type:'FLYING', category:'STATUS', power:0, accuracy:100, pp:20, priority:0, animStyle:'SELF',
    effect:{type:'STAT_RAISE',stats:['def','spd'],stages:1}, description:'An updraft raises Defense and Speed.' },
  RAZOR_WIND_STRIKE: { id:'RAZOR_WIND_STRIKE', name:'Razor Wind', type:'FLYING', category:'SPECIAL', power:80, accuracy:100, pp:10, priority:0, animStyle:'ARC',
    effect:{type:'TWO_TURN'}, description:'Builds then releases razor-edged wind blades.' },
  GLIDE_STRIKE: { id:'GLIDE_STRIKE', name:'Glide Strike', type:'FLYING', category:'PHYSICAL', power:65, accuracy:100, pp:20, priority:1, animStyle:'ARC',
    effect:{type:'NONE'}, description:'Glides in fast for a quick hit.' },
  PTEROSAUR_DIVE: { id:'PTEROSAUR_DIVE', name:'Ptero Dive', type:'FLYING', category:'PHYSICAL', power:95, accuracy:95, pp:10, priority:0, animStyle:'ARC',
    effect:{type:'NONE'}, description:'A pterosaur-speed diving strike.' },
  SKY_BEAM: { id:'SKY_BEAM', name:'Sky Beam', type:'FLYING', category:'SPECIAL', power:80, accuracy:100, pp:10, priority:0, animStyle:'BEAM',
    effect:{type:'NONE'}, description:'A beam of concentrated wind energy from above.' },
  WIND_VEIL: { id:'WIND_VEIL', name:'Wind Veil', type:'FLYING', category:'STATUS', power:0, accuracy:100, pp:20, priority:0, animStyle:'SELF',
    effect:{type:'STAT_RAISE',stat:'def',stages:1}, description:'Wraps in circling winds that bolster Defense.' },
  TEMPEST_STRIKE: { id:'TEMPEST_STRIKE', name:'Tempest Strike', type:'FLYING', category:'SPECIAL', power:90, accuracy:90, pp:10, priority:0, animStyle:'BURST',
    effect:{type:'PARALYSIS',chance:20}, description:'The tempests force may paralyze the foe.' },
  SOAR: { id:'SOAR', name:'Soar', type:'FLYING', category:'STATUS', power:0, accuracy:100, pp:15, priority:0, animStyle:'SELF',
    effect:{type:'STAT_RAISE',stats:['atk','spd'],stages:1}, description:'Soars to great height, boosting Attack and Speed.' },
  TYPHOON: { id:'TYPHOON', name:'Typhoon', type:'FLYING', category:'SPECIAL', power:110, accuracy:85, pp:8, priority:0, animStyle:'VORTEX',
    effect:{type:'NONE'}, description:'Summons a full typhoon against the foe.' },
  AERIAL_VOLLEY: { id:'AERIAL_VOLLEY', name:'Aerial Volley', type:'FLYING', category:'PHYSICAL', power:50, accuracy:100, pp:20, priority:0, animStyle:'MULTI',
    effect:{type:'MULTI_HIT',hits:'2-5'}, description:'A volley of aerial strikes hits 2-5 times.' },
  FEATHER_DANCE_ATK: { id:'FEATHER_DANCE_ATK', name:'Feather Blade Dance', type:'FLYING', category:'PHYSICAL', power:75, accuracy:100, pp:15, priority:0, animStyle:'MELEE',
    effect:{type:'STAT_LOWER',stat:'atk',stages:1}, description:'Dances with bladed feathers, lowering foes Attack.' },
  CLOUD_BURST: { id:'CLOUD_BURST', name:'Cloud Burst', type:'FLYING', category:'SPECIAL', power:75, accuracy:100, pp:15, priority:0, animStyle:'BURST',
    effect:{type:'NONE'}, description:'Condenses clouds into a burst of aerial energy.' },


MIND_CRUSH: { id:'MIND_CRUSH', name:'Mind Crush', type:'PSYCHIC', category:'SPECIAL', power:85, accuracy:100, pp:10, priority:0, animStyle:'PULSE',
    effect:{type:'STAT_LOWER',stat:'spDef',stages:1}, description:'Crushes the foes mind, lowering Sp. Def.' },
  THOUGHT_WAVE: { id:'THOUGHT_WAVE', name:'Thought Wave', type:'PSYCHIC', category:'SPECIAL', power:70, accuracy:100, pp:15, priority:0, animStyle:'WAVE',
    effect:{type:'CONFUSE',chance:30}, description:'Invasive thoughts may confuse the foe.' },
  PSY_LANCE: { id:'PSY_LANCE', name:'Psy Lance', type:'PSYCHIC', category:'SPECIAL', power:80, accuracy:100, pp:10, priority:0, animStyle:'BEAM',
    effect:{type:'NONE'}, description:'A psychic lance of focused mental energy.' },
  COSMIC_STRIKE: { id:'COSMIC_STRIKE', name:'Cosmic Strike', type:'PSYCHIC', category:'SPECIAL', power:95, accuracy:90, pp:10, priority:0, animStyle:'BURST',
    effect:{type:'NONE'}, description:'Channels cosmic energy into a devastating strike.' },
  GRAVITY_PULSE: { id:'GRAVITY_PULSE', name:'Gravity Pulse', type:'PSYCHIC', category:'SPECIAL', power:75, accuracy:100, pp:15, priority:0, animStyle:'PULSE',
    effect:{type:'STAT_LOWER',stat:'spd',stages:1}, description:'A gravity wave slows the foe down.' },
  MIND_BARRIER: { id:'MIND_BARRIER', name:'Mind Barrier', type:'PSYCHIC', category:'STATUS', power:0, accuracy:100, pp:15, priority:0, animStyle:'SELF',
    effect:{type:'STAT_RAISE',stat:'spDef',stages:2}, description:'Erects a mental barrier, sharply raising Sp. Def.' },
  TELEKINETIC_SLAM: { id:'TELEKINETIC_SLAM', name:'Telekinetic Slam', type:'PSYCHIC', category:'SPECIAL', power:90, accuracy:95, pp:10, priority:0, animStyle:'SLAM',
    effect:{type:'NONE'}, description:'Lifts and slams the foe telekinetically.' },
  NEURAL_BLAST: { id:'NEURAL_BLAST', name:'Neural Blast', type:'PSYCHIC', category:'SPECIAL', power:80, accuracy:95, pp:10, priority:0, animStyle:'BURST',
    effect:{type:'PARALYSIS',chance:20}, description:'Fires a neural burst that may cause paralysis.' },
  ILLUSORY_STRIKE: { id:'ILLUSORY_STRIKE', name:'Illusory Strike', type:'PSYCHIC', category:'PHYSICAL', power:65, accuracy:100, pp:20, priority:0, animStyle:'MELEE',
    effect:{type:'CONFUSE',chance:20}, description:'Strikes with a phantom image that may confuse.' },
  DIMENSION_TEAR: { id:'DIMENSION_TEAR', name:'Dimension Tear', type:'PSYCHIC', category:'SPECIAL', power:110, accuracy:85, pp:8, priority:0, animStyle:'VORTEX',
    effect:{type:'NONE'}, description:'Tears a rift in space to unleash devastating energy.' },
  MINDSTORM: { id:'MINDSTORM', name:'Mindstorm', type:'PSYCHIC', category:'SPECIAL', power:75, accuracy:100, pp:15, priority:0, animStyle:'VORTEX',
    effect:{type:'CONFUSE',chance:50}, description:'A storm of psychic energy likely to confuse.' },
  PRECOGNITION: { id:'PRECOGNITION', name:'Precognition', type:'PSYCHIC', category:'STATUS', power:0, accuracy:100, pp:15, priority:0, animStyle:'SELF',
    effect:{type:'STAT_RAISE',stats:['spAtk','spd'],stages:1}, description:'Foresees the battle, raising Sp. Atk and Speed.' },
  PSYCHO_BURST: { id:'PSYCHO_BURST', name:'Psycho Burst', type:'PSYCHIC', category:'SPECIAL', power:100, accuracy:90, pp:10, priority:0, animStyle:'BURST',
    effect:{type:'STAT_LOWER',stat:'spDef',stages:1}, description:'A destructive psycho burst lowers Sp. Def.' },
  ASTRAL_PULSE: { id:'ASTRAL_PULSE', name:'Astral Pulse', type:'PSYCHIC', category:'SPECIAL', power:70, accuracy:100, pp:15, priority:0, animStyle:'PULSE',
    effect:{type:'NONE'}, description:'Pulses of astral energy ripple through the foe.' },
  MIND_MELD: { id:'MIND_MELD', name:'Mind Meld', type:'PSYCHIC', category:'STATUS', power:0, accuracy:100, pp:10, priority:0, animStyle:'AURA',
    effect:{type:'STAT_RAISE',stat:'spAtk',stages:3}, description:'Melds with the cosmos, sharply boosting Sp. Atk.' },
  WARP_BLAST: { id:'WARP_BLAST', name:'Warp Blast', type:'PSYCHIC', category:'SPECIAL', power:90, accuracy:100, pp:10, priority:0, animStyle:'BURST',
    effect:{type:'NONE'}, description:'Warps space to strike with distorted force.' },
  PRISM_BEAM: { id:'PRISM_BEAM', name:'Prism Beam', type:'PSYCHIC', category:'SPECIAL', power:80, accuracy:100, pp:10, priority:0, animStyle:'BEAM',
    effect:{type:'NONE'}, description:'Prismatic psychic light cuts through all defenses.' },
  MIRROR_MIND: { id:'MIRROR_MIND', name:'Mirror Mind', type:'PSYCHIC', category:'STATUS', power:0, accuracy:100, pp:10, priority:0, animStyle:'SELF',
    effect:{type:'STAT_RAISE',stats:['atk','spAtk'],stages:1}, description:'Mirrors the foes power to boost both attacks.' },
  LEVITATE_STRIKE: { id:'LEVITATE_STRIKE', name:'Levitate Strike', type:'PSYCHIC', category:'PHYSICAL', power:75, accuracy:100, pp:15, priority:0, animStyle:'ARC',
    effect:{type:'NONE'}, description:'Levitates and strikes from an unpredictable angle.' },
  ORACLE_BEAM: { id:'ORACLE_BEAM', name:'Oracle Beam', type:'PSYCHIC', category:'SPECIAL', power:120, accuracy:80, pp:5, priority:0, animStyle:'BEAM',
    effect:{type:'STAT_LOWER',stat:'spAtk',stages:2}, description:'A prophetic beam of psychic power, draining focus.' },
  BRAIN_DRAIN: { id:'BRAIN_DRAIN', name:'Brain Drain', type:'PSYCHIC', category:'SPECIAL', power:70, accuracy:100, pp:15, priority:0, animStyle:'DRAIN',
    effect:{type:'DRAIN',fraction:50}, description:'Drains mental energy to heal the user.' },
  PSYCHIC_SHIELD: { id:'PSYCHIC_SHIELD', name:'Psychic Shield', type:'PSYCHIC', category:'STATUS', power:0, accuracy:100, pp:20, priority:0, animStyle:'SELF',
    effect:{type:'STAT_RAISE',stat:'spDef',stages:1}, description:'Creates a psychic shield that boosts Sp. Def.' },
  CHAOS_WAVE: { id:'CHAOS_WAVE', name:'Chaos Wave', type:'PSYCHIC', category:'SPECIAL', power:80, accuracy:90, pp:10, priority:0, animStyle:'WAVE',
    effect:{type:'CONFUSE',chance:30}, description:'A chaotic wave of psychic energy may confuse.' },
  FOCAL_BEAM: { id:'FOCAL_BEAM', name:'Focal Beam', type:'PSYCHIC', category:'SPECIAL', power:85, accuracy:100, pp:10, priority:0, animStyle:'BEAM',
    effect:{type:'NONE'}, description:'A laser-focused beam of pure psychic force.' },
  THIRD_EYE: { id:'THIRD_EYE', name:'Third Eye', type:'PSYCHIC', category:'STATUS', power:0, accuracy:100, pp:15, priority:0, animStyle:'AURA',
    effect:{type:'STAT_RAISE',stats:['spAtk','spDef'],stages:1}, description:'Opens the third eye, raising Sp. Atk and Sp. Def.' },

  // ═══════════════════════════════════════════════════════
  // PHASE 2 BATCH B — ROCK (25 new)
  // ═══════════════════════════════════════════════════════
  BOULDER_TOSS: { id:'BOULDER_TOSS', name:'Boulder Toss', type:'ROCK', category:'PHYSICAL', power:80, accuracy:90, pp:15, priority:0, animStyle:'PROJECTILE',
    effect:{type:'NONE'}, description:'Hurls a giant boulder at the foe.' },
  ROCK_STORM: { id:'ROCK_STORM', name:'Rock Storm', type:'ROCK', category:'PHYSICAL', power:65, accuracy:90, pp:15, priority:0, animStyle:'MULTI',
    effect:{type:'FLINCH',chance:20}, description:'A storm of rocks pelts the foe 2-5 times.' },
  STONE_EDGE_PLUS: { id:'STONE_EDGE_PLUS', name:'Crystal Edge', type:'ROCK', category:'PHYSICAL', power:100, accuracy:80, pp:8, priority:0, animStyle:'MELEE',
    effect:{type:'NONE'}, description:'A razor-edged crystal blade strikes with high crit rate.' },
  GRANITE_SHIELD: { id:'GRANITE_SHIELD', name:'Granite Shield', type:'ROCK', category:'STATUS', power:0, accuracy:100, pp:15, priority:0, animStyle:'SELF',
    effect:{type:'STAT_RAISE',stat:'def',stages:2}, description:'Encases the body in granite, sharply raising Defense.' },
  SHATTER: { id:'SHATTER', name:'Shatter', type:'ROCK', category:'PHYSICAL', power:75, accuracy:100, pp:15, priority:0, animStyle:'BURST',
    effect:{type:'STAT_LOWER',stat:'def',stages:1}, description:'Shatters rocks against the foes armor.' },
  ROCK_AVALANCHE: { id:'ROCK_AVALANCHE', name:'Rock Avalanche', type:'ROCK', category:'PHYSICAL', power:90, accuracy:90, pp:10, priority:0, animStyle:'WAVE',
    effect:{type:'FLINCH',chance:30}, description:'An avalanche of rocks crashes down on the foe.' },
  FOSSIL_BEAM_ROCK: { id:'FOSSIL_BEAM_ROCK', name:'Fossil Beam', type:'ROCK', category:'SPECIAL', power:85, accuracy:100, pp:10, priority:0, animStyle:'BEAM',
    effect:{type:'NONE'}, description:'Fires a beam of condensed fossilized energy.' },
  STONE_SPEAR: { id:'STONE_SPEAR', name:'Stone Spear', type:'ROCK', category:'PHYSICAL', power:65, accuracy:100, pp:20, priority:0, animStyle:'PROJECTILE',
    effect:{type:'NONE'}, description:'A sharpened stone hurled like a javelin.' },
  PETRIFACTION: { id:'PETRIFACTION', name:'Petrifaction', type:'ROCK', category:'STATUS', power:0, accuracy:80, pp:10, priority:0, animStyle:'FIELD',
    effect:{type:'PARALYSIS',chance:100}, description:'Turns the foes limbs to stone, paralyzing them.' },
  ANCIENT_POWER_PLUS: { id:'ANCIENT_POWER_PLUS', name:'Primal Force', type:'ROCK', category:'SPECIAL', power:80, accuracy:100, pp:10, priority:0, animStyle:'AURA',
    effect:{type:'OMNI_RAISE',chance:50}, description:'Ancient power has a 50% chance to raise all stats.' },
  ROCK_PULSE: { id:'ROCK_PULSE', name:'Rock Pulse', type:'ROCK', category:'SPECIAL', power:70, accuracy:100, pp:15, priority:0, animStyle:'PULSE',
    effect:{type:'NONE'}, description:'Pulses of seismic stone energy blast the foe.' },
  GEODE_SLAM: { id:'GEODE_SLAM', name:'Geode Slam', type:'ROCK', category:'PHYSICAL', power:100, accuracy:90, pp:10, priority:0, animStyle:'SLAM',
    effect:{type:'FLINCH',chance:20}, description:'Smashes with a massive crystalline geode.' },
  MINERAL_BURST: { id:'MINERAL_BURST', name:'Mineral Burst', type:'ROCK', category:'PHYSICAL', power:50, accuracy:100, pp:25, priority:0, animStyle:'MULTI',
    effect:{type:'MULTI_HIT',hits:'2-5'}, description:'Launches shards of mineral at high speed.' },
  EARTH_BUSTER: { id:'EARTH_BUSTER', name:'Earth Buster', type:'ROCK', category:'PHYSICAL', power:110, accuracy:90, pp:8, priority:0, animStyle:'SLAM',
    effect:{type:'NONE'}, description:'Buries the foe under a titanic stone fist.' },
  CRYSTAL_LANCE: { id:'CRYSTAL_LANCE', name:'Crystal Lance', type:'ROCK', category:'PHYSICAL', power:80, accuracy:100, pp:10, priority:0, animStyle:'MELEE',
    effect:{type:'FREEZE_CHANCE',chance:10}, description:'A lance of pure crystal may freeze on contact.' },
  GRAVEL_STORM: { id:'GRAVEL_STORM', name:'Gravel Storm', type:'ROCK', category:'SPECIAL', power:55, accuracy:90, pp:20, priority:0, animStyle:'VORTEX',
    effect:{type:'STAT_LOWER',stat:'acc',stages:1}, description:'A storm of gravel lowers accuracy.' },
  ROCK_CANNON: { id:'ROCK_CANNON', name:'Rock Cannon', type:'ROCK', category:'PHYSICAL', power:95, accuracy:85, pp:10, priority:0, animStyle:'PROJECTILE',
    effect:{type:'NONE'}, description:'Fires a cannonball-sized stone at the foe.' },
  STONE_SURGE: { id:'STONE_SURGE', name:'Stone Surge', type:'ROCK', category:'SPECIAL', power:70, accuracy:100, pp:15, priority:0, animStyle:'BURST',
    effect:{type:'NONE'}, description:'A surge of stone fragments erupts upward.' },
  BEDROCK_PULSE: { id:'BEDROCK_PULSE', name:'Bedrock Pulse', type:'ROCK', category:'SPECIAL', power:80, accuracy:100, pp:10, priority:0, animStyle:'PULSE',
    effect:{type:'NONE'}, description:'Pulses from deep bedrock resonate through the foe.' },
  AMBER_TRAP: { id:'AMBER_TRAP', name:'Amber Trap', type:'ROCK', category:'STATUS', power:0, accuracy:90, pp:15, priority:0, animStyle:'FIELD',
    effect:{type:'PARALYSIS',chance:100}, description:'Encases the foe in ancient amber.' },
  MOUNTAIN_CRASH: { id:'MOUNTAIN_CRASH', name:'Mountain Crash', type:'ROCK', category:'PHYSICAL', power:120, accuracy:85, pp:8, priority:0, animStyle:'SLAM',
    effect:{type:'RECOIL',fraction:25}, description:'The force of a mountain brought down on the foe.' },
  ROCK_VEIL: { id:'ROCK_VEIL', name:'Rock Veil', type:'ROCK', category:'STATUS', power:0, accuracy:100, pp:15, priority:0, animStyle:'SELF',
    effect:{type:'STAT_RAISE',stats:['def','spDef'],stages:1}, description:'A veil of rock fragments boosts both defenses.' },
  SPLINTER: { id:'SPLINTER', name:'Splinter', type:'ROCK', category:'PHYSICAL', power:60, accuracy:100, pp:20, priority:0, animStyle:'MULTI',
    effect:{type:'NONE'}, description:'Sharp rock splinters slice the foe 2-5 times.' },
  TECTONIC_PULSE: { id:'TECTONIC_PULSE', name:'Tectonic Pulse', type:'ROCK', category:'SPECIAL', power:90, accuracy:90, pp:10, priority:0, animStyle:'PULSE',
    effect:{type:'NONE'}, description:'Tectonic energy pulses from beneath the battlefield.' },
  STONE_WALL: { id:'STONE_WALL', name:'Stone Wall', type:'ROCK', category:'STATUS', power:0, accuracy:100, pp:20, priority:0, animStyle:'SELF',
    effect:{type:'STAT_RAISE',stat:'def',stages:1}, description:'Raises a stone wall to boost Defense.' },

  // ═══════════════════════════════════════════════════════
  // PHASE 2 BATCH B — GHOST (20 new)
  // ═══════════════════════════════════════════════════════
  SPIRIT_BURST: { id:'SPIRIT_BURST', name:'Spirit Burst', type:'GHOST', category:'SPECIAL', power:85, accuracy:100, pp:10, priority:0, animStyle:'BURST',
    effect:{type:'NONE'}, description:'The trapped energy of spirits bursts outward.' },
  WRAITH_SLASH: { id:'WRAITH_SLASH', name:'Wraith Slash', type:'GHOST', category:'PHYSICAL', power:70, accuracy:100, pp:15, priority:0, animStyle:'MELEE',
    effect:{type:'FLINCH',chance:20}, description:'A spectral slash from a passing wraith.' },
  HAUNTING_PULSE: { id:'HAUNTING_PULSE', name:'Haunting Pulse', type:'GHOST', category:'SPECIAL', power:75, accuracy:100, pp:15, priority:0, animStyle:'PULSE',
    effect:{type:'CONFUSE',chance:30}, description:'Haunting vibrations may confuse the foe.' },
  GHOST_WAVE: { id:'GHOST_WAVE', name:'Ghost Wave', type:'GHOST', category:'SPECIAL', power:65, accuracy:100, pp:20, priority:0, animStyle:'WAVE',
    effect:{type:'NONE'}, description:'A wave of ghostly energy washes over the foe.' },
  SHADOW_BURST: { id:'SHADOW_BURST', name:'Shadow Burst', type:'GHOST', category:'SPECIAL', power:90, accuracy:95, pp:10, priority:0, animStyle:'BURST',
    effect:{type:'STAT_LOWER',stat:'def',stages:1}, description:'A burst of shadows lowers Defense.' },
  SOUL_SPIKE: { id:'SOUL_SPIKE', name:'Soul Spike', type:'GHOST', category:'SPECIAL', power:60, accuracy:100, pp:20, priority:0, animStyle:'PROJECTILE',
    effect:{type:'NONE'}, description:'A spike of pure soul energy pierces the foe.' },
  PHANTOM_PULSE: { id:'PHANTOM_PULSE', name:'Phantom Pulse', type:'GHOST', category:'SPECIAL', power:80, accuracy:100, pp:10, priority:0, animStyle:'PULSE',
    effect:{type:'CONFUSE',chance:20}, description:'Phantom vibrations may cause confusion.' },
  SPECTER_BEAM: { id:'SPECTER_BEAM', name:'Specter Beam', type:'GHOST', category:'SPECIAL', power:100, accuracy:90, pp:10, priority:0, animStyle:'BEAM',
    effect:{type:'NONE'}, description:'A beam of spectral energy from the beyond.' },
  DARK_VOID: { id:'DARK_VOID', name:'Dark Void', type:'GHOST', category:'STATUS', power:0, accuracy:80, pp:10, priority:0, animStyle:'VORTEX',
    effect:{type:'SLEEP',chance:100}, description:'Pulls the foe into a dimension of endless sleep.' },
  GRUDGE_STRIKE: { id:'GRUDGE_STRIKE', name:'Grudge Strike', type:'GHOST', category:'PHYSICAL', power:95, accuracy:90, pp:10, priority:0, animStyle:'MELEE',
    effect:{type:'NONE'}, description:'Strikes with the force of lingering grudges.' },
  TERROR_WAVE: { id:'TERROR_WAVE', name:'Terror Wave', type:'GHOST', category:'STATUS', power:0, accuracy:100, pp:15, priority:0, animStyle:'FIELD',
    effect:{type:'STAT_LOWER',stat:'atk',stages:2}, description:'Terrifying aura sharply lowers the foes Attack.' },
  BANISH: { id:'BANISH', name:'Banish', type:'GHOST', category:'SPECIAL', power:80, accuracy:95, pp:10, priority:0, animStyle:'VORTEX',
    effect:{type:'NONE'}, description:'Banishes the foe to another dimension temporarily.' },
  CURSED_TOUCH: { id:'CURSED_TOUCH', name:'Cursed Touch', type:'GHOST', category:'PHYSICAL', power:65, accuracy:100, pp:15, priority:0, animStyle:'MELEE',
    effect:{type:'POISON_CHANCE',chance:30}, description:'A cursed hand poisons on contact.' },
  AFTERLIFE_BLAST: { id:'AFTERLIFE_BLAST', name:'Afterlife Blast', type:'GHOST', category:'SPECIAL', power:110, accuracy:85, pp:8, priority:0, animStyle:'BURST',
    effect:{type:'NONE'}, description:'A blast of energy from the great beyond.' },
  ECTOPLASM: { id:'ECTOPLASM', name:'Ectoplasm', type:'GHOST', category:'SPECIAL', power:70, accuracy:100, pp:15, priority:0, animStyle:'PROJECTILE',
    effect:{type:'STAT_LOWER',stat:'spDef',stages:1}, description:'Gooey ectoplasm lowers Sp. Def.' },
  GRAVE_WIND: { id:'GRAVE_WIND', name:'Grave Wind', type:'GHOST', category:'STATUS', power:0, accuracy:100, pp:15, priority:0, animStyle:'SELF',
    effect:{type:'STAT_RAISE',stat:'spAtk',stages:2}, description:'Wind from the grave sharply raises Sp. Atk.' },
  PHANTOM_FORCE_BLAST: { id:'PHANTOM_FORCE_BLAST', name:'Ghost Charge', type:'GHOST', category:'PHYSICAL', power:90, accuracy:100, pp:10, priority:0, animStyle:'SLAM',
    effect:{type:'TWO_TURN'}, description:'Vanishes then strikes from another plane.' },
  SHADOWSTEP: { id:'SHADOWSTEP', name:'Shadowstep', type:'GHOST', category:'PHYSICAL', power:60, accuracy:100, pp:20, priority:1, animStyle:'ARC',
    effect:{type:'NONE'}, description:'Steps through shadows to strike with priority.' },
  SPECTER_DRAIN: { id:'SPECTER_DRAIN', name:'Specter Drain', type:'GHOST', category:'SPECIAL', power:75, accuracy:100, pp:10, priority:0, animStyle:'DRAIN',
    effect:{type:'DRAIN',fraction:50}, description:'Drains life force through spectral contact.' },
  BONE_RUSH_GHOST: { id:'BONE_RUSH_GHOST', name:'Ghost Bone', type:'GHOST', category:'PHYSICAL', power:50, accuracy:90, pp:20, priority:0, animStyle:'MULTI',
    effect:{type:'MULTI_HIT',hits:'2-5'}, description:'Slaps with ghostly bones 2-5 times.' },

  // ═══════════════════════════════════════════════════════
  // PHASE 2 BATCH B — DRAGON (20 new)
  // ═══════════════════════════════════════════════════════
  PRIMAL_DRAGON: { id:'PRIMAL_DRAGON', name:'Primal Dragon', type:'DRAGON', category:'SPECIAL', power:110, accuracy:90, pp:8, priority:0, animStyle:'BURST',
    effect:{type:'NONE'}, description:'Channels primordial dragon energy for a massive blast.' },
  SCALE_STORM: { id:'SCALE_STORM', name:'Scale Storm', type:'DRAGON', category:'PHYSICAL', power:70, accuracy:90, pp:15, priority:0, animStyle:'MULTI',
    effect:{type:'STAT_RAISE',stat:'spd',stages:1}, description:'Fires scales rapidly, raising the users Speed.' },
  DRAGON_RUSH_CLAW: { id:'DRAGON_RUSH_CLAW', name:'Dragon Claw Rush', type:'DRAGON', category:'PHYSICAL', power:80, accuracy:100, pp:15, priority:0, animStyle:'MELEE',
    effect:{type:'NONE'}, description:'Rushing claws infused with draconic power.' },
  ANCIENT_WRATH: { id:'ANCIENT_WRATH', name:'Ancient Wrath', type:'DRAGON', category:'SPECIAL', power:100, accuracy:90, pp:10, priority:0, animStyle:'BURST',
    effect:{type:'NONE'}, description:'The wrath of ancient dragons unleashed.' },
  FOSSIL_DRAGON: { id:'FOSSIL_DRAGON', name:'Fossil Dragon', type:'DRAGON', category:'SPECIAL', power:90, accuracy:100, pp:10, priority:0, animStyle:'BEAM',
    effect:{type:'NONE'}, description:'Fossilized dragon energy condensed into a beam.' },
  WING_BLAST: { id:'WING_BLAST', name:'Wing Blast', type:'DRAGON', category:'PHYSICAL', power:75, accuracy:100, pp:15, priority:0, animStyle:'ARC',
    effect:{type:'NONE'}, description:'A powerful flap sends a dragon-wind blast.' },
  DRACO_WAVE: { id:'DRACO_WAVE', name:'Draco Wave', type:'DRAGON', category:'SPECIAL', power:80, accuracy:100, pp:10, priority:0, animStyle:'WAVE',
    effect:{type:'NONE'}, description:'A wave of draconic energy rolls across the field.' },
  DRAGON_DIVE: { id:'DRAGON_DIVE', name:'Dragon Dive', type:'DRAGON', category:'PHYSICAL', power:100, accuracy:90, pp:10, priority:0, animStyle:'SLAM',
    effect:{type:'FLINCH',chance:20}, description:'Dives from altitude cloaked in dragon energy.' },
  DRAGON_STORM: { id:'DRAGON_STORM', name:'Dragon Storm', type:'DRAGON', category:'SPECIAL', power:95, accuracy:85, pp:10, priority:0, animStyle:'VORTEX',
    effect:{type:'NONE'}, description:'A storm brewed from draconic power.' },
  SERPENT_STRIKE: { id:'SERPENT_STRIKE', name:'Serpent Strike', type:'DRAGON', category:'PHYSICAL', power:65, accuracy:100, pp:20, priority:0, animStyle:'MELEE',
    effect:{type:'POISON_CHANCE',chance:20}, description:'A dragon-serpent bite may poison the foe.' },
  APEX_DRAGON: { id:'APEX_DRAGON', name:'Apex Dragon', type:'DRAGON', category:'PHYSICAL', power:120, accuracy:85, pp:5, priority:0, animStyle:'BURST',
    effect:{type:'RECOIL',fraction:25}, description:'The apex predator strike of dragonkind.' },
  DRAGON_PULSE_SURGE: { id:'DRAGON_PULSE_SURGE', name:'Dragon Surge', type:'DRAGON', category:'SPECIAL', power:85, accuracy:100, pp:10, priority:0, animStyle:'PULSE',
    effect:{type:'NONE'}, description:'A surging pulse of dragon-fire energy.' },
  PRIMORDIAL_BREATH: { id:'PRIMORDIAL_BREATH', name:'Primordial Breath', type:'DRAGON', category:'SPECIAL', power:90, accuracy:90, pp:10, priority:0, animStyle:'CONE',
    effect:{type:'BURN_CHANCE',chance:20}, description:'The first flame breathed by the oldest dragons.' },
  DRAGON_FANG: { id:'DRAGON_FANG', name:'Dragon Fang', type:'DRAGON', category:'PHYSICAL', power:60, accuracy:100, pp:20, priority:0, animStyle:'MELEE',
    effect:{type:'FLINCH',chance:20}, description:'A fearsome dragon bite may cause flinching.' },
  WYVERN_STRIKE: { id:'WYVERN_STRIKE', name:'Wyvern Strike', type:'DRAGON', category:'PHYSICAL', power:85, accuracy:95, pp:10, priority:0, animStyle:'ARC',
    effect:{type:'NONE'}, description:'A wyverns signature aerial slash.' },
  SCALE_SHOT_PLUS: { id:'SCALE_SHOT_PLUS', name:'Scale Barrage', type:'DRAGON', category:'PHYSICAL', power:50, accuracy:90, pp:20, priority:0, animStyle:'MULTI',
    effect:{type:'MULTI_HIT',hits:'2-5'}, description:'Fires scales like arrows 2-5 times.' },
  DRAGON_ASCENT: { id:'DRAGON_ASCENT', name:'Dragon Ascent', type:'DRAGON', category:'PHYSICAL', power:110, accuracy:90, pp:10, priority:0, animStyle:'ARC',
    effect:{type:'STAT_LOWER',stats:['def','spDef'],stages:1}, description:'Soars then crashes, lowering users defenses.' },
  CLAW_STORM: { id:'CLAW_STORM', name:'Claw Storm', type:'DRAGON', category:'PHYSICAL', power:50, accuracy:100, pp:20, priority:0, animStyle:'MULTI',
    effect:{type:'MULTI_HIT',hits:'2-5'}, description:'Dragon claws shred the foe 2-5 times.' },
  DRACONIC_AURA: { id:'DRACONIC_AURA', name:'Draconic Aura', type:'DRAGON', category:'STATUS', power:0, accuracy:100, pp:10, priority:0, animStyle:'AURA',
    effect:{type:'STAT_RAISE',stats:['atk','spAtk'],stages:1}, description:'Radiates draconic aura, boosting both attacks.' },
  PREHISTORY: { id:'PREHISTORY', name:'Prehistory', type:'DRAGON', category:'SPECIAL', power:130, accuracy:90, pp:5, priority:0, animStyle:'BURST',
    effect:{type:'RECHARGE'}, description:'Invokes the power of prehistoric dragons. Must recharge.' },

  // ═══════════════════════════════════════════════════════
  // PHASE 2 BATCH B — DARK (20 new)
  // ═══════════════════════════════════════════════════════
  SHADOW_STORM: { id:'SHADOW_STORM', name:'Shadow Storm', type:'DARK', category:'SPECIAL', power:90, accuracy:90, pp:10, priority:0, animStyle:'VORTEX',
    effect:{type:'STAT_LOWER',stat:'spDef',stages:1}, description:'A storm of shadows lowers Sp. Def.' },
  NIGHT_SLASH_SURGE: { id:'NIGHT_SLASH_SURGE', name:'Night Rush', type:'DARK', category:'PHYSICAL', power:75, accuracy:100, pp:15, priority:0, animStyle:'MELEE',
    effect:{type:'NONE'}, description:'A swift strike in total darkness with high crit rate.' },
  DARK_PULSE_WAVE: { id:'DARK_PULSE_WAVE', name:'Dark Surge', type:'DARK', category:'SPECIAL', power:80, accuracy:100, pp:10, priority:0, animStyle:'WAVE',
    effect:{type:'CONFUSE',chance:20}, description:'A dark wave may confuse the foe.' },
  VOID_BLAST: { id:'VOID_BLAST', name:'Void Blast', type:'DARK', category:'SPECIAL', power:100, accuracy:90, pp:10, priority:0, animStyle:'BURST',
    effect:{type:'NONE'}, description:'A blast from the void of absolute darkness.' },
  SHADOW_BITE: { id:'SHADOW_BITE', name:'Shadow Bite', type:'DARK', category:'PHYSICAL', power:65, accuracy:100, pp:15, priority:0, animStyle:'MELEE',
    effect:{type:'FLINCH',chance:30}, description:'A bite from the shadows may cause flinching.' },
  DARK_VEIL: { id:'DARK_VEIL', name:'Dark Veil', type:'DARK', category:'STATUS', power:0, accuracy:100, pp:20, priority:0, animStyle:'SELF',
    effect:{type:'STAT_RAISE',stat:'atk',stages:1}, description:'Shrouds the user in darkness, raising Attack.' },
  ECLIPSE_BEAM: { id:'ECLIPSE_BEAM', name:'Eclipse Beam', type:'DARK', category:'SPECIAL', power:95, accuracy:95, pp:10, priority:0, animStyle:'BEAM',
    effect:{type:'NONE'}, description:'A beam of eclipsed sunlight, pure darkness.' },
  OBLIVION_PULSE: { id:'OBLIVION_PULSE', name:'Oblivion Pulse', type:'DARK', category:'SPECIAL', power:80, accuracy:100, pp:10, priority:0, animStyle:'PULSE',
    effect:{type:'STAT_LOWER',stat:'spDef',stages:1}, description:'Pulses of oblivion energy erode Sp. Def.' },
  MIDNIGHT_CLAW: { id:'MIDNIGHT_CLAW', name:'Midnight Claw', type:'DARK', category:'PHYSICAL', power:80, accuracy:100, pp:10, priority:0, animStyle:'MELEE',
    effect:{type:'NONE'}, description:'Strikes from the darkness of midnight.' },
  DUSK_SLAM: { id:'DUSK_SLAM', name:'Dusk Slam', type:'DARK', category:'PHYSICAL', power:90, accuracy:95, pp:10, priority:0, animStyle:'SLAM',
    effect:{type:'NONE'}, description:'A devastating slam wrapped in dusk shadow.' },
  TERROR_BITE: { id:'TERROR_BITE', name:'Terror Bite', type:'DARK', category:'PHYSICAL', power:85, accuracy:90, pp:10, priority:0, animStyle:'MELEE',
    effect:{type:'STAT_LOWER',stat:'def',stages:1}, description:'A terrifying bite can crack any defense.' },
  ABYSS_WAVE: { id:'ABYSS_WAVE', name:'Abyss Wave', type:'DARK', category:'SPECIAL', power:85, accuracy:100, pp:10, priority:0, animStyle:'WAVE',
    effect:{type:'NONE'}, description:'A wave from the abyss swallows the foe.' },
  SHADOW_AURA: { id:'SHADOW_AURA', name:'Shadow Aura', type:'DARK', category:'STATUS', power:0, accuracy:100, pp:10, priority:0, animStyle:'AURA',
    effect:{type:'STAT_RAISE',stats:['atk','def'],stages:1}, description:'Shadow aura hardens the body, raising Atk and Def.' },
  DARK_VORTEX: { id:'DARK_VORTEX', name:'Dark Vortex', type:'DARK', category:'SPECIAL', power:75, accuracy:100, pp:15, priority:0, animStyle:'VORTEX',
    effect:{type:'CONFUSE',chance:30}, description:'Pulls the foe into a dark spiral of confusion.' },
  NIGHT_TERROR: { id:'NIGHT_TERROR', name:'Night Terror', type:'DARK', category:'SPECIAL', power:70, accuracy:100, pp:15, priority:0, animStyle:'BURST',
    effect:{type:'FLINCH',chance:20}, description:'Terrifying dark energy may cause flinching.' },
  DARKNESS_STRIKE: { id:'DARKNESS_STRIKE', name:'Darkness Strike', type:'DARK', category:'PHYSICAL', power:95, accuracy:90, pp:10, priority:0, animStyle:'MELEE',
    effect:{type:'NONE'}, description:'A strike cloaked in impenetrable darkness.' },
  DARK_DRAIN: { id:'DARK_DRAIN', name:'Dark Drain', type:'DARK', category:'SPECIAL', power:65, accuracy:100, pp:15, priority:0, animStyle:'DRAIN',
    effect:{type:'DRAIN',fraction:50}, description:'Drains energy through dark absorption.' },
  SHADOW_CANNON: { id:'SHADOW_CANNON', name:'Shadow Cannon', type:'DARK', category:'SPECIAL', power:110, accuracy:85, pp:8, priority:0, animStyle:'BEAM',
    effect:{type:'NONE'}, description:'Fires a cannon blast of condensed shadow.' },
  CORRUPT: { id:'CORRUPT', name:'Corrupt', type:'DARK', category:'STATUS', power:0, accuracy:90, pp:15, priority:0, animStyle:'FIELD',
    effect:{type:'STAT_LOWER',stats:['atk','spAtk'],stages:1}, description:'Corrupts the foes power, lowering both attacks.' },
  NIGHT_DIVE: { id:'NIGHT_DIVE', name:'Night Dive', type:'DARK', category:'PHYSICAL', power:100, accuracy:90, pp:10, priority:0, animStyle:'ARC',
    effect:{type:'TWO_TURN'}, description:'Vanishes into darkness then dives on the foe.' },

  // ═══════════════════════════════════════════════════════
  // PHASE 2 BATCH B — STEEL (20 new)
  // ═══════════════════════════════════════════════════════
  IRON_STORM: { id:'IRON_STORM', name:'Iron Storm', type:'STEEL', category:'PHYSICAL', power:70, accuracy:90, pp:15, priority:0, animStyle:'MULTI',
    effect:{type:'NONE'}, description:'A storm of iron shards strikes 2-5 times.' },
  TITANIUM_STRIKE: { id:'TITANIUM_STRIKE', name:'Titanium Strike', type:'STEEL', category:'PHYSICAL', power:90, accuracy:100, pp:10, priority:0, animStyle:'MELEE',
    effect:{type:'NONE'}, description:'A strike with titanium-hardened limbs.' },
  STEEL_SURGE: { id:'STEEL_SURGE', name:'Steel Surge', type:'STEEL', category:'PHYSICAL', power:80, accuracy:100, pp:10, priority:0, animStyle:'WAVE',
    effect:{type:'NONE'}, description:'A surge of steel shards sweeps the battlefield.' },
  MAGNETISM: { id:'MAGNETISM', name:'Magnetism', type:'STEEL', category:'STATUS', power:0, accuracy:100, pp:20, priority:0, animStyle:'FIELD',
    effect:{type:'PARALYSIS',chance:100}, description:'Magnetizes the foes metallic parts, paralyzing them.' },
  IRON_WAVE: { id:'IRON_WAVE', name:'Iron Wave', type:'STEEL', category:'PHYSICAL', power:75, accuracy:100, pp:15, priority:0, animStyle:'WAVE',
    effect:{type:'NONE'}, description:'A wave of iron energy crashes into the foe.' },
  STEEL_DRILL: { id:'STEEL_DRILL', name:'Steel Drill', type:'STEEL', category:'PHYSICAL', power:85, accuracy:95, pp:10, priority:0, animStyle:'MELEE',
    effect:{type:'STAT_LOWER',stat:'def',stages:1}, description:'Drills through defenses, lowering Defense.' },
  ALLOY_SHIELD: { id:'ALLOY_SHIELD', name:'Alloy Shield', type:'STEEL', category:'STATUS', power:0, accuracy:100, pp:15, priority:0, animStyle:'SELF',
    effect:{type:'STAT_RAISE',stats:['def','spDef'],stages:1}, description:'A multi-alloy shield boosts both defenses.' },
  CHROME_BLAST: { id:'CHROME_BLAST', name:'Chrome Blast', type:'STEEL', category:'SPECIAL', power:80, accuracy:100, pp:10, priority:0, animStyle:'BURST',
    effect:{type:'NONE'}, description:'Polished chrome redirects energy into a blast.' },
  STEEL_VORTEX: { id:'STEEL_VORTEX', name:'Steel Vortex', type:'STEEL', category:'PHYSICAL', power:90, accuracy:90, pp:10, priority:0, animStyle:'VORTEX',
    effect:{type:'NONE'}, description:'A vortex of steel shards engulfs the foe.' },
  FORGE_SLAM: { id:'FORGE_SLAM', name:'Forge Slam', type:'STEEL', category:'PHYSICAL', power:100, accuracy:90, pp:10, priority:0, animStyle:'SLAM',
    effect:{type:'NONE'}, description:'Slams with a limb heated in the forge.' },
  ALLOY_STRIKE: { id:'ALLOY_STRIKE', name:'Alloy Strike', type:'STEEL', category:'PHYSICAL', power:70, accuracy:100, pp:15, priority:0, animStyle:'MELEE',
    effect:{type:'NONE'}, description:'Strikes with a body reinforced with rare alloys.' },
  MAGNETIZE: { id:'MAGNETIZE', name:'Magnetize', type:'STEEL', category:'STATUS', power:0, accuracy:100, pp:15, priority:0, animStyle:'SELF',
    effect:{type:'STAT_RAISE',stat:'atk',stages:2}, description:'Magnetizes the body, sharply raising Attack.' },
  STEEL_BEAM_PLUS: { id:'STEEL_BEAM_PLUS', name:'Ferrous Beam', type:'STEEL', category:'SPECIAL', power:140, accuracy:95, pp:5, priority:0, animStyle:'BEAM',
    effect:{type:'RECOIL',fraction:50}, description:'Fires a beam of ferrous energy from the body core.' },
  IRON_CAGE: { id:'IRON_CAGE', name:'Iron Cage', type:'STEEL', category:'STATUS', power:0, accuracy:90, pp:15, priority:0, animStyle:'FIELD',
    effect:{type:'PARALYSIS',chance:100}, description:'An iron cage traps the foe, preventing escape.' },
  BLADE_STORM: { id:'BLADE_STORM', name:'Blade Storm', type:'STEEL', category:'PHYSICAL', power:60, accuracy:95, pp:20, priority:0, animStyle:'MULTI',
    effect:{type:'MULTI_HIT',hits:'2-5'}, description:'Steel blades slice the foe 2-5 times.' },
  TUNGSTEN_CRASH: { id:'TUNGSTEN_CRASH', name:'Tungsten Crash', type:'STEEL', category:'PHYSICAL', power:110, accuracy:90, pp:8, priority:0, animStyle:'SLAM',
    effect:{type:'NONE'}, description:'Crashes with the density of pure tungsten.' },
  STEEL_PULSE: { id:'STEEL_PULSE', name:'Steel Pulse', type:'STEEL', category:'SPECIAL', power:65, accuracy:100, pp:15, priority:0, animStyle:'PULSE',
    effect:{type:'NONE'}, description:'Metal resonates in a pulse of steel energy.' },
  ARMOR_CRUSH: { id:'ARMOR_CRUSH', name:'Armor Crush', type:'STEEL', category:'PHYSICAL', power:80, accuracy:95, pp:10, priority:0, animStyle:'MELEE',
    effect:{type:'STAT_LOWER',stat:'def',stages:2}, description:'Crushes through armor, sharply lowering Defense.' },
  METAL_BURST_STEEL: { id:'METAL_BURST_STEEL', name:'Metal Burst', type:'STEEL', category:'SPECIAL', power:0, accuracy:100, pp:10, priority:0, animStyle:'BURST',
    effect:{type:'NONE'}, description:'Returns damage dealt in the same turn with greater force.' },
  STEEL_AURA: { id:'STEEL_AURA', name:'Steel Aura', type:'STEEL', category:'STATUS', power:0, accuracy:100, pp:10, priority:0, animStyle:'AURA',
    effect:{type:'STAT_RAISE',stat:'def',stages:3}, description:'Radiates steel aura, drastically raising Defense.' },

  // ═══════════════════════════════════════════════════════
  // PHASE 2 BATCH B — FAIRY (20 new)
  // ═══════════════════════════════════════════════════════
  FAIRY_BURST: { id:'FAIRY_BURST', name:'Fairy Burst', type:'FAIRY', category:'SPECIAL', power:85, accuracy:100, pp:10, priority:0, animStyle:'BURST',
    effect:{type:'NONE'}, description:'A burst of sparkling fairy energy.' },
  STARDUST_BEAM: { id:'STARDUST_BEAM', name:'Stardust Beam', type:'FAIRY', category:'SPECIAL', power:80, accuracy:100, pp:10, priority:0, animStyle:'BEAM',
    effect:{type:'NONE'}, description:'A beam of stardust light blinds and damages.' },
  FAIRY_VORTEX: { id:'FAIRY_VORTEX', name:'Fairy Vortex', type:'FAIRY', category:'SPECIAL', power:75, accuracy:100, pp:15, priority:0, animStyle:'VORTEX',
    effect:{type:'CONFUSE',chance:30}, description:'A swirling fairy vortex may confuse the foe.' },
  MOONBEAM: { id:'MOONBEAM', name:'Moonbeam', type:'FAIRY', category:'SPECIAL', power:90, accuracy:100, pp:10, priority:0, animStyle:'BEAM',
    effect:{type:'NONE'}, description:'Pure moonlight condensed into a damaging beam.' },
  ENCHANT: { id:'ENCHANT', name:'Enchant', type:'FAIRY', category:'STATUS', power:0, accuracy:100, pp:15, priority:0, animStyle:'AURA',
    effect:{type:'STAT_RAISE',stat:'spAtk',stages:2}, description:'Enchants the user, sharply raising Sp. Atk.' },
  PETAL_WAVE: { id:'PETAL_WAVE', name:'Petal Wave', type:'FAIRY', category:'SPECIAL', power:70, accuracy:100, pp:15, priority:0, animStyle:'WAVE',
    effect:{type:'NONE'}, description:'A wave of enchanted petals washes over the foe.' },
  FAIRY_SLAM: { id:'FAIRY_SLAM', name:'Fairy Slam', type:'FAIRY', category:'PHYSICAL', power:80, accuracy:100, pp:10, priority:0, animStyle:'SLAM',
    effect:{type:'NONE'}, description:'Slams with a fist crackling with fairy energy.' },
  GLITTER_BEAM: { id:'GLITTER_BEAM', name:'Glitter Beam', type:'FAIRY', category:'SPECIAL', power:65, accuracy:100, pp:20, priority:0, animStyle:'BEAM',
    effect:{type:'STAT_LOWER',stat:'spDef',stages:1}, description:'Glittering beam lowers the foes Sp. Def.' },
  SPARKLE_STORM: { id:'SPARKLE_STORM', name:'Sparkle Storm', type:'FAIRY', category:'SPECIAL', power:75, accuracy:95, pp:15, priority:0, animStyle:'MULTI',
    effect:{type:'NONE'}, description:'A storm of sparkling light strikes 2-5 times.' },
  FAIRY_DRAIN: { id:'FAIRY_DRAIN', name:'Fairy Drain', type:'FAIRY', category:'SPECIAL', power:65, accuracy:100, pp:15, priority:0, animStyle:'DRAIN',
    effect:{type:'DRAIN',fraction:50}, description:'Draws vital energy through fairy magic.' },
  WISH_WAVE: { id:'WISH_WAVE', name:'Wish Wave', type:'FAIRY', category:'STATUS', power:0, accuracy:100, pp:10, priority:0, animStyle:'SELF',
    effect:{type:'HEAL',fraction:50}, description:'Makes a wish to restore half the users HP.' },
  STARDUST_STORM: { id:'STARDUST_STORM', name:'Stardust Storm', type:'FAIRY', category:'SPECIAL', power:90, accuracy:90, pp:10, priority:0, animStyle:'VORTEX',
    effect:{type:'NONE'}, description:'A dazzling storm of cosmic stardust.' },
  FAIRY_PULSE: { id:'FAIRY_PULSE', name:'Fairy Pulse', type:'FAIRY', category:'SPECIAL', power:70, accuracy:100, pp:15, priority:0, animStyle:'PULSE',
    effect:{type:'CONFUSE',chance:20}, description:'Pulsing fairy energy may confuse the foe.' },
  GLISTENING_STRIKE: { id:'GLISTENING_STRIKE', name:'Glistening Strike', type:'FAIRY', category:'PHYSICAL', power:75, accuracy:100, pp:15, priority:0, animStyle:'MELEE',
    effect:{type:'NONE'}, description:'A strike shining with brilliant fairy light.' },
  AURORA_VEIL_ATK: { id:'AURORA_VEIL_ATK', name:'Aurora Strike', type:'FAIRY', category:'SPECIAL', power:80, accuracy:100, pp:10, priority:0, animStyle:'ARC',
    effect:{type:'NONE'}, description:'Strikes with an aurora of fairy energy.' },
  PIXIE_DUST: { id:'PIXIE_DUST', name:'Pixie Dust', type:'FAIRY', category:'STATUS', power:0, accuracy:100, pp:20, priority:0, animStyle:'FIELD',
    effect:{type:'STAT_LOWER',stat:'acc',stages:1}, description:'Scatters pixie dust that clouds vision.' },
  FAIRY_AURA: { id:'FAIRY_AURA', name:'Fairy Aura', type:'FAIRY', category:'STATUS', power:0, accuracy:100, pp:10, priority:0, animStyle:'AURA',
    effect:{type:'STAT_RAISE',stats:['spAtk','spDef'],stages:1}, description:'Fairy aura raises Sp. Atk and Sp. Def.' },
  TWINKLE_BEAM: { id:'TWINKLE_BEAM', name:'Twinkle Beam', type:'FAIRY', category:'SPECIAL', power:55, accuracy:100, pp:25, priority:0, animStyle:'BEAM',
    effect:{type:'CONFUSE',chance:10}, description:'A twinkling beam of starlight may confuse.' },
  LUNAR_BLAST: { id:'LUNAR_BLAST', name:'Lunar Blast', type:'FAIRY', category:'SPECIAL', power:110, accuracy:90, pp:8, priority:0, animStyle:'BURST',
    effect:{type:'NONE'}, description:'Full moon energy condensed into a devastating blast.' },
  RAINBOW_BEAM: { id:'RAINBOW_BEAM', name:'Rainbow Beam', type:'FAIRY', category:'SPECIAL', power:85, accuracy:100, pp:10, priority:0, animStyle:'BEAM',
    effect:{type:'NONE'}, description:'A beam refracting through every color of light.' },

  // ═══════════════════════════════════════════════════════
  // PHASE 2 BATCH B — BUG (20 new)
  // ═══════════════════════════════════════════════════════
  BUG_STORM: { id:'BUG_STORM', name:'Bug Storm', type:'BUG', category:'SPECIAL', power:90, accuracy:90, pp:10, priority:0, animStyle:'VORTEX',
    effect:{type:'NONE'}, description:'A swarm of bugs descends in a violent storm.' },
  SWARM_STRIKE_PLUS: { id:'SWARM_STRIKE_PLUS', name:'Swarm Crash', type:'BUG', category:'PHYSICAL', power:80, accuracy:100, pp:10, priority:0, animStyle:'SLAM',
    effect:{type:'NONE'}, description:'Crashes into the foe with the force of a whole swarm.' },
  SILK_THREAD: { id:'SILK_THREAD', name:'Silk Thread', type:'BUG', category:'STATUS', power:0, accuracy:100, pp:20, priority:0, animStyle:'FIELD',
    effect:{type:'STAT_LOWER',stat:'spd',stages:1}, description:'Sticky silk threads slow the foe.' },
  CARAPACE_SHIELD: { id:'CARAPACE_SHIELD', name:'Carapace Shield', type:'BUG', category:'STATUS', power:0, accuracy:100, pp:15, priority:0, animStyle:'SELF',
    effect:{type:'STAT_RAISE',stat:'def',stages:2}, description:'Hardens the carapace, sharply raising Defense.' },
  BUG_PULSE: { id:'BUG_PULSE', name:'Bug Pulse', type:'BUG', category:'SPECIAL', power:65, accuracy:100, pp:15, priority:0, animStyle:'PULSE',
    effect:{type:'NONE'}, description:'Pulses of insect sonic energy hit the foe.' },
  WING_CUT: { id:'WING_CUT', name:'Wing Cut', type:'BUG', category:'PHYSICAL', power:60, accuracy:100, pp:20, priority:0, animStyle:'MELEE',
    effect:{type:'NONE'}, description:'A precise cut with razor-sharp wings.' },
  COCOON_SLAM: { id:'COCOON_SLAM', name:'Cocoon Slam', type:'BUG', category:'PHYSICAL', power:75, accuracy:100, pp:15, priority:0, animStyle:'SLAM',
    effect:{type:'NONE'}, description:'Slams with a hardened cocoon shell.' },
  BUG_BEAM: { id:'BUG_BEAM', name:'Bug Beam', type:'BUG', category:'SPECIAL', power:80, accuracy:100, pp:10, priority:0, animStyle:'BEAM',
    effect:{type:'NONE'}, description:'A beam of concentrated insect sonic energy.' },
  VENOM_STING_PLUS: { id:'VENOM_STING_PLUS', name:'Venom Sting', type:'BUG', category:'PHYSICAL', power:55, accuracy:100, pp:20, priority:0, animStyle:'PROJECTILE',
    effect:{type:'POISON_CHANCE',chance:50}, description:'A highly venomous sting likely to poison.' },
  BUG_AURA: { id:'BUG_AURA', name:'Swarm Aura', type:'BUG', category:'STATUS', power:0, accuracy:100, pp:15, priority:0, animStyle:'AURA',
    effect:{type:'STAT_RAISE',stat:'atk',stages:2}, description:'Channels swarm power, sharply raising Attack.' },
  ARMOR_SLASH: { id:'ARMOR_SLASH', name:'Armor Slash', type:'BUG', category:'PHYSICAL', power:70, accuracy:100, pp:15, priority:0, animStyle:'MELEE',
    effect:{type:'STAT_LOWER',stat:'def',stages:1}, description:'Slashes with an armored limb, lowering Defense.' },
  HIVE_MIND: { id:'HIVE_MIND', name:'Hive Mind', type:'BUG', category:'STATUS', power:0, accuracy:100, pp:10, priority:0, animStyle:'SELF',
    effect:{type:'STAT_RAISE',stats:['atk','spAtk'],stages:1}, description:'The hive mind boosts both attack stats.' },
  ANTENNA_WAVE: { id:'ANTENNA_WAVE', name:'Antenna Wave', type:'BUG', category:'SPECIAL', power:60, accuracy:100, pp:20, priority:0, animStyle:'WAVE',
    effect:{type:'PARALYSIS',chance:20}, description:'Antenna-generated waves may paralyze.' },
  CHITINOUS_BASH: { id:'CHITINOUS_BASH', name:'Chitinous Bash', type:'BUG', category:'PHYSICAL', power:90, accuracy:95, pp:10, priority:0, animStyle:'SLAM',
    effect:{type:'NONE'}, description:'Bashes with an extremely tough chitinous body.' },
  MOLT_STRIKE: { id:'MOLT_STRIKE', name:'Molt Strike', type:'BUG', category:'PHYSICAL', power:65, accuracy:100, pp:15, priority:0, animStyle:'MELEE',
    effect:{type:'STAT_RAISE',stat:'spd',stages:1}, description:'Molts to reveal a swift new body, boosting Speed.' },
  PHEROMONE: { id:'PHEROMONE', name:'Pheromone', type:'BUG', category:'STATUS', power:0, accuracy:100, pp:20, priority:0, animStyle:'FIELD',
    effect:{type:'STAT_LOWER',stat:'atk',stages:2}, description:'Releases pheromones that sharply lower Attack.' },
  BUG_SLAM: { id:'BUG_SLAM', name:'Bug Slam', type:'BUG', category:'PHYSICAL', power:85, accuracy:95, pp:10, priority:0, animStyle:'SLAM',
    effect:{type:'NONE'}, description:'A slamming attack from a hardened insect body.' },
  LARVA_BLAST: { id:'LARVA_BLAST', name:'Larva Blast', type:'BUG', category:'SPECIAL', power:75, accuracy:100, pp:15, priority:0, animStyle:'PROJECTILE',
    effect:{type:'POISON_CHANCE',chance:20}, description:'Blasts corrosive larval fluid that may poison.' },
  EXOSKELETON: { id:'EXOSKELETON', name:'Exoskeleton', type:'BUG', category:'STATUS', power:0, accuracy:100, pp:10, priority:0, animStyle:'SELF',
    effect:{type:'STAT_RAISE',stats:['def','spDef'],stages:1}, description:'Hardens the exoskeleton, boosting both defenses.' },
  SWARM_PULSE: { id:'SWARM_PULSE', name:'Swarm Pulse', type:'BUG', category:'SPECIAL', power:80, accuracy:100, pp:10, priority:0, animStyle:'PULSE',
    effect:{type:'NONE'}, description:'The unified pulse of an entire swarm.' },


ETHEREAL_SLASH: { id:'ETHEREAL_SLASH', name:'Ethereal Slash', type:'GHOST', category:'PHYSICAL', power:80, accuracy:100, pp:15, priority:0, animStyle:'MELEE',
    effect:{type:'NONE'}, description:'Cuts with an ethereal blade that passes through barriers.' },
  SPIRIT_SURGE: { id:'SPIRIT_SURGE', name:'Spirit Surge', type:'GHOST', category:'SPECIAL', power:75, accuracy:100, pp:15, priority:0, animStyle:'BURST',
    effect:{type:'NONE'}, description:'Surges with the power of many departed spirits.' },
  GHOUL_CLAW: { id:'GHOUL_CLAW', name:'Ghoul Claw', type:'GHOST', category:'PHYSICAL', power:60, accuracy:100, pp:20, priority:0, animStyle:'MELEE',
    effect:{type:'POISON_CHANCE',chance:20}, description:'Ghoulish claws may infect the foe with poison.' },
  POLTERGEIST_WAVE: { id:'POLTERGEIST_WAVE', name:'Poltergeist Wave', type:'GHOST', category:'SPECIAL', power:70, accuracy:95, pp:15, priority:0, animStyle:'WAVE',
    effect:{type:'CONFUSE',chance:30}, description:'Invisible forces strike and may cause confusion.' },
  SOUL_BLAST: { id:'SOUL_BLAST', name:'Soul Blast', type:'GHOST', category:'SPECIAL', power:95, accuracy:90, pp:10, priority:0, animStyle:'BURST',
    effect:{type:'NONE'}, description:'Releases the energy of trapped souls in a burst.' },
  PHANTOM_CLAW: { id:'PHANTOM_CLAW', name:'Phantom Claw', type:'GHOST', category:'PHYSICAL', power:65, accuracy:100, pp:20, priority:1, animStyle:'MELEE',
    effect:{type:'NONE'}, description:'A phantom claw strikes before the foe can react.' },
  WRAITH_WAVE: { id:'WRAITH_WAVE', name:'Wraith Wave', type:'GHOST', category:'SPECIAL', power:80, accuracy:100, pp:10, priority:0, animStyle:'WAVE',
    effect:{type:'STAT_LOWER',stat:'spDef',stages:1}, description:'A wraith wave erodes the foes Sp. Def.' },
  SPECTER_SLAM: { id:'SPECTER_SLAM', name:'Specter Slam', type:'GHOST', category:'PHYSICAL', power:90, accuracy:95, pp:10, priority:0, animStyle:'SLAM',
    effect:{type:'NONE'}, description:'A slam charged with spectral force.' },
  SHADOW_PULSE: { id:'SHADOW_PULSE', name:'Shadow Pulse', type:'GHOST', category:'SPECIAL', power:70, accuracy:100, pp:15, priority:0, animStyle:'PULSE',
    effect:{type:'CONFUSE',chance:20}, description:'Shadowy pulses vibrate through the foes mind.' },
  CURSED_BLAST: { id:'CURSED_BLAST', name:'Cursed Blast', type:'GHOST', category:'SPECIAL', power:100, accuracy:85, pp:8, priority:0, animStyle:'BURST',
    effect:{type:'NONE'}, description:'A blast of ancient cursed energy.' },
  NIGHTMARE_PULSE: { id:'NIGHTMARE_PULSE', name:'Nightmare Pulse', type:'GHOST', category:'SPECIAL', power:75, accuracy:100, pp:15, priority:0, animStyle:'PULSE',
    effect:{type:'CONFUSE',chance:40}, description:'Nightmare energy likely to confuse sleeping foes.' },
  SPIRIT_SHIELD: { id:'SPIRIT_SHIELD', name:'Spirit Shield', type:'GHOST', category:'STATUS', power:0, accuracy:100, pp:15, priority:0, animStyle:'SELF',
    effect:{type:'STAT_RAISE',stats:['def','spDef'],stages:1}, description:'Spirits shield the user, boosting both defenses.' },
  VOID_CLAW: { id:'VOID_CLAW', name:'Void Claw', type:'GHOST', category:'PHYSICAL', power:70, accuracy:100, pp:15, priority:0, animStyle:'MELEE',
    effect:{type:'STAT_LOWER',stat:'def',stages:1}, description:'Strikes from the void, lowering Defense.' },
  HAUNTED_BEAM: { id:'HAUNTED_BEAM', name:'Haunted Beam', type:'GHOST', category:'SPECIAL', power:90, accuracy:100, pp:10, priority:0, animStyle:'BEAM',
    effect:{type:'NONE'}, description:'A beam of energy haunted by fallen spirits.' },
  GRAVE_PULSE: { id:'GRAVE_PULSE', name:'Grave Pulse', type:'GHOST', category:'SPECIAL', power:65, accuracy:100, pp:20, priority:0, animStyle:'PULSE',
    effect:{type:'NONE'}, description:'Energy from the grave pulses through the earth.' },

  // ═══════════════════════════════════════════════════════
  // PHASE 2 BATCH C — FLYING (15 more → total ~37)
  // ═══════════════════════════════════════════════════════
  GALE_STRIKE: { id:'GALE_STRIKE', name:'Gale Strike', type:'FLYING', category:'PHYSICAL', power:80, accuracy:100, pp:15, priority:0, animStyle:'MELEE',
    effect:{type:'NONE'}, description:'Strikes with wind sharpened to a gale.' },
  WIND_SURGE: { id:'WIND_SURGE', name:'Wind Surge', type:'FLYING', category:'SPECIAL', power:75, accuracy:100, pp:15, priority:0, animStyle:'BURST',
    effect:{type:'NONE'}, description:'A surge of compressed wind blasts the foe.' },
  STORMWING_SLAM: { id:'STORMWING_SLAM', name:'Stormwing Slam', type:'FLYING', category:'PHYSICAL', power:100, accuracy:90, pp:10, priority:0, animStyle:'SLAM',
    effect:{type:'NONE'}, description:'Slams with wings channeling storm energy.' },
  FEATHER_STORM: { id:'FEATHER_STORM', name:'Feather Storm', type:'FLYING', category:'SPECIAL', power:80, accuracy:90, pp:10, priority:0, animStyle:'VORTEX',
    effect:{type:'STAT_LOWER',stat:'acc',stages:1}, description:'A feather storm lowers the foes accuracy.' },
  WING_PULSE: { id:'WING_PULSE', name:'Wing Pulse', type:'FLYING', category:'SPECIAL', power:65, accuracy:100, pp:20, priority:0, animStyle:'PULSE',
    effect:{type:'NONE'}, description:'Wing beats send a pulse of air at the foe.' },
  SKYDIVE: { id:'SKYDIVE', name:'Skydive', type:'FLYING', category:'PHYSICAL', power:95, accuracy:95, pp:10, priority:0, animStyle:'ARC',
    effect:{type:'FLINCH',chance:20}, description:'Dives from maximum altitude for a crushing blow.' },
  AERIAL_BEAM: { id:'AERIAL_BEAM', name:'Aerial Beam', type:'FLYING', category:'SPECIAL', power:80, accuracy:100, pp:10, priority:0, animStyle:'BEAM',
    effect:{type:'NONE'}, description:'A beam of wind energy fired from altitude.' },
  SWIFT_WING: { id:'SWIFT_WING', name:'Swift Wing', type:'FLYING', category:'PHYSICAL', power:55, accuracy:100, pp:25, priority:1, animStyle:'ARC',
    effect:{type:'NONE'}, description:'A swift wing strike that never misses.' },
  TORNADO_SPIN: { id:'TORNADO_SPIN', name:'Tornado Spin', type:'FLYING', category:'SPECIAL', power:85, accuracy:85, pp:10, priority:0, animStyle:'VORTEX',
    effect:{type:'FLINCH',chance:30}, description:'Spins up a miniature tornado that may cause flinching.' },
  WIND_DRAIN: { id:'WIND_DRAIN', name:'Wind Drain', type:'FLYING', category:'SPECIAL', power:65, accuracy:100, pp:15, priority:0, animStyle:'DRAIN',
    effect:{type:'DRAIN',fraction:50}, description:'Drains energy through a focused wind vortex.' },
  AERIAL_AURA: { id:'AERIAL_AURA', name:'Aerial Aura', type:'FLYING', category:'STATUS', power:0, accuracy:100, pp:15, priority:0, animStyle:'AURA',
    effect:{type:'STAT_RAISE',stats:['atk','spd'],stages:1}, description:'Aerial aura boosts Attack and Speed.' },
  STORM_SLAM: { id:'STORM_SLAM', name:'Storm Slam', type:'FLYING', category:'PHYSICAL', power:90, accuracy:90, pp:10, priority:0, animStyle:'SLAM',
    effect:{type:'PARALYSIS',chance:30}, description:'A slam charged with storm electricity may paralyze.' },
  CYCLONE_BURST: { id:'CYCLONE_BURST', name:'Cyclone Burst', type:'FLYING', category:'SPECIAL', power:90, accuracy:90, pp:10, priority:0, animStyle:'BURST',
    effect:{type:'NONE'}, description:'A burst of cyclonic force erupts around the foe.' },
  BIRD_OF_PREY: { id:'BIRD_OF_PREY', name:'Bird of Prey', type:'FLYING', category:'PHYSICAL', power:85, accuracy:95, pp:10, priority:0, animStyle:'ARC',
    effect:{type:'FLINCH',chance:20}, description:'A diving strike like a predatory bird.' },
  FEATHER_VEIL: { id:'FEATHER_VEIL', name:'Feather Veil', type:'FLYING', category:'STATUS', power:0, accuracy:100, pp:15, priority:0, animStyle:'SELF',
    effect:{type:'STAT_RAISE',stat:'spd',stages:2}, description:'Sheds old feathers to reveal a swifter form.' },

  // ═══════════════════════════════════════════════════════
  // PHASE 2 BATCH C — FAIRY (12 more → total ~35)
  // ═══════════════════════════════════════════════════════
  GLIMMER_STRIKE: { id:'GLIMMER_STRIKE', name:'Glimmer Strike', type:'FAIRY', category:'PHYSICAL', power:70, accuracy:100, pp:15, priority:0, animStyle:'MELEE',
    effect:{type:'NONE'}, description:'A strike infused with glimmering fairy light.' },
  STARFALL: { id:'STARFALL', name:'Starfall', type:'FAIRY', category:'SPECIAL', power:95, accuracy:90, pp:10, priority:0, animStyle:'MULTI',
    effect:{type:'NONE'}, description:'Stars rain down on the foe.' },
  FAIRY_CLAW: { id:'FAIRY_CLAW', name:'Fairy Claw', type:'FAIRY', category:'PHYSICAL', power:65, accuracy:100, pp:20, priority:0, animStyle:'MELEE',
    effect:{type:'CONFUSE',chance:20}, description:'A fairy-enchanted claw may confuse the foe.' },
  DREAMBEAM: { id:'DREAMBEAM', name:'Dreambeam', type:'FAIRY', category:'SPECIAL', power:85, accuracy:100, pp:10, priority:0, animStyle:'BEAM',
    effect:{type:'SLEEP',chance:10}, description:'A beam of dream energy may put the foe to sleep.' },
  ENCHANTED_SLAM: { id:'ENCHANTED_SLAM', name:'Enchanted Slam', type:'FAIRY', category:'PHYSICAL', power:90, accuracy:95, pp:10, priority:0, animStyle:'SLAM',
    effect:{type:'NONE'}, description:'A slam infused with enchanting fairy magic.' },
  FAIRY_FLAME: { id:'FAIRY_FLAME', name:'Fairy Flame', type:'FAIRY', category:'SPECIAL', power:65, accuracy:100, pp:20, priority:0, animStyle:'BURST',
    effect:{type:'BURN_CHANCE',chance:10}, description:'Magical fairy flame may inflict a burn.' },
  GRACE: { id:'GRACE', name:'Grace', type:'FAIRY', category:'STATUS', power:0, accuracy:100, pp:10, priority:0, animStyle:'SELF',
    effect:{type:'OMNI_RAISE',chance:100}, description:'Channels fairy grace to raise all stats.' },
  MOONFORCE_SURGE: { id:'MOONFORCE_SURGE', name:'Moon Surge', type:'FAIRY', category:'SPECIAL', power:90, accuracy:95, pp:10, priority:0, animStyle:'BURST',
    effect:{type:'STAT_LOWER',stat:'spDef',stages:1}, description:'Moon energy surges to lower the foes Sp. Def.' },
  PIXIE_STRIKE: { id:'PIXIE_STRIKE', name:'Pixie Strike', type:'FAIRY', category:'PHYSICAL', power:50, accuracy:100, pp:25, priority:1, animStyle:'MELEE',
    effect:{type:'NONE'}, description:'A quick pixie strike that always goes first.' },
  STARDUST_PULSE: { id:'STARDUST_PULSE', name:'Stardust Pulse', type:'FAIRY', category:'SPECIAL', power:70, accuracy:100, pp:15, priority:0, animStyle:'PULSE',
    effect:{type:'NONE'}, description:'Cosmic stardust pulses through the foe.' },
  FAIRY_WAVE: { id:'FAIRY_WAVE', name:'Fairy Wave', type:'FAIRY', category:'SPECIAL', power:75, accuracy:100, pp:15, priority:0, animStyle:'WAVE',
    effect:{type:'NONE'}, description:'A wave of pure fairy energy.' },
  MIDSUMMER_BLAST: { id:'MIDSUMMER_BLAST', name:'Midsummer Blast', type:'FAIRY', category:'SPECIAL', power:100, accuracy:90, pp:10, priority:0, animStyle:'BURST',
    effect:{type:'NONE'}, description:'The height of fairy power on midsummer night.' },

  // ═══════════════════════════════════════════════════════
  // PHASE 2 BATCH C — BUG (12 more → total ~35)
  // ═══════════════════════════════════════════════════════
  INSECT_BEAM: { id:'INSECT_BEAM', name:'Insect Beam', type:'BUG', category:'SPECIAL', power:75, accuracy:100, pp:15, priority:0, animStyle:'BEAM',
    effect:{type:'NONE'}, description:'A sonic beam from insect stridulation.' },
  BUG_VORTEX: { id:'BUG_VORTEX', name:'Bug Vortex', type:'BUG', category:'SPECIAL', power:70, accuracy:90, pp:15, priority:0, animStyle:'VORTEX',
    effect:{type:'STAT_LOWER',stat:'acc',stages:1}, description:'A vortex of bugs reduces visibility.' },
  STINGER: { id:'STINGER', name:'Stinger', type:'BUG', category:'PHYSICAL', power:70, accuracy:100, pp:15, priority:0, animStyle:'PROJECTILE',
    effect:{type:'POISON_CHANCE',chance:30}, description:'A precision stinger strike may poison.' },
  BUG_BURST: { id:'BUG_BURST', name:'Bug Burst', type:'BUG', category:'SPECIAL', power:85, accuracy:90, pp:10, priority:0, animStyle:'BURST',
    effect:{type:'NONE'}, description:'The hive explodes outward in a burst attack.' },
  CARAPACE_CRASH: { id:'CARAPACE_CRASH', name:'Carapace Crash', type:'BUG', category:'PHYSICAL', power:95, accuracy:90, pp:10, priority:0, animStyle:'SLAM',
    effect:{type:'NONE'}, description:'Crashes with the full weight of a battle-hardened shell.' },
  GOSSAMER_SLASH: { id:'GOSSAMER_SLASH', name:'Gossamer Slash', type:'BUG', category:'PHYSICAL', power:55, accuracy:100, pp:25, priority:0, animStyle:'MELEE',
    effect:{type:'NONE'}, description:'Razor-thin wings cut like gossamer silk.' },
  DRAGONFLY_DIVE: { id:'DRAGONFLY_DIVE', name:'Dragonfly Dive', type:'BUG', category:'PHYSICAL', power:80, accuracy:100, pp:10, priority:0, animStyle:'ARC',
    effect:{type:'NONE'}, description:'Dives with the speed of a dragonfly.' },
  ACID_COCOON: { id:'ACID_COCOON', name:'Acid Cocoon', type:'BUG', category:'STATUS', power:0, accuracy:100, pp:15, priority:0, animStyle:'SELF',
    effect:{type:'STAT_RAISE',stats:['def','spDef'],stages:2}, description:'Wraps in an acidic cocoon, sharply boosting both defenses.' },
  SKITTER: { id:'SKITTER', name:'Skitter', type:'BUG', category:'PHYSICAL', power:55, accuracy:100, pp:20, priority:1, animStyle:'ARC',
    effect:{type:'STAT_LOWER',stat:'spAtk',stages:1}, description:'A fast skittering strike lowers Sp. Atk.' },
  MULTIBITE: { id:'MULTIBITE', name:'Multibite', type:'BUG', category:'PHYSICAL', power:20, accuracy:100, pp:15, priority:0, animStyle:'MULTI',
    effect:{type:'MULTI_HIT',hits:'2-5'}, description:'Bites rapidly with mandibles 2-5 times.' },
  SILK_BIND: { id:'SILK_BIND', name:'Silk Bind', type:'BUG', category:'STATUS', power:0, accuracy:90, pp:15, priority:0, animStyle:'FIELD',
    effect:{type:'PARALYSIS',chance:100}, description:'Wraps the foe in thick silk, paralyzing them.' },
  COLONY_STRIKE: { id:'COLONY_STRIKE', name:'Colony Strike', type:'BUG', category:'PHYSICAL', power:100, accuracy:90, pp:8, priority:0, animStyle:'SLAM',
    effect:{type:'NONE'}, description:'An entire colony attacks in one crushing blow.' },

  // ═══════════════════════════════════════════════════════
  // PHASE 2 BATCH C — FIGHTING (10 more → total ~34)
  // ═══════════════════════════════════════════════════════
  TITAN_FIST: { id:'TITAN_FIST', name:'Titan Fist', type:'FIGHTING', category:'PHYSICAL', power:110, accuracy:90, pp:8, priority:0, animStyle:'MELEE',
    effect:{type:'NONE'}, description:'A fist with the force of a titan.' },
  WAR_CRY: { id:'WAR_CRY', name:'War Cry', type:'FIGHTING', category:'STATUS', power:0, accuracy:100, pp:15, priority:0, animStyle:'AURA',
    effect:{type:'STAT_RAISE',stat:'atk',stages:2}, description:'A thunderous war cry sharply raises Attack.' },
  COUNTER_CRASH: { id:'COUNTER_CRASH', name:'Counter Crash', type:'FIGHTING', category:'PHYSICAL', power:90, accuracy:95, pp:10, priority:0, animStyle:'SLAM',
    effect:{type:'NONE'}, description:'Counters then crashes into the foe.' },
  GRAPPLE_THROW: { id:'GRAPPLE_THROW', name:'Grapple Throw', type:'FIGHTING', category:'PHYSICAL', power:80, accuracy:100, pp:10, priority:0, animStyle:'SLAM',
    effect:{type:'STAT_LOWER',stat:'spd',stages:1}, description:'Grapples and throws, slowing the foe.' },
  HEADBUTT_STRIKE: { id:'HEADBUTT_STRIKE', name:'Head Strike', type:'FIGHTING', category:'PHYSICAL', power:70, accuracy:100, pp:15, priority:0, animStyle:'MELEE',
    effect:{type:'FLINCH',chance:30}, description:'A headbutt strike may cause flinching.' },
  SWEEP_KICK: { id:'SWEEP_KICK', name:'Sweep Kick', type:'FIGHTING', category:'PHYSICAL', power:65, accuracy:100, pp:20, priority:0, animStyle:'MELEE',
    effect:{type:'STAT_LOWER',stat:'spd',stages:1}, description:'Sweeps the foe off their feet, lowering Speed.' },
  POWER_RUSH: { id:'POWER_RUSH', name:'Power Rush', type:'FIGHTING', category:'PHYSICAL', power:95, accuracy:100, pp:10, priority:0, animStyle:'SLAM',
    effect:{type:'NONE'}, description:'Charges with overwhelming fighting power.' },
  DINOSAUR_STOMP: { id:'DINOSAUR_STOMP', name:'Dino Stomp', type:'FIGHTING', category:'PHYSICAL', power:80, accuracy:100, pp:15, priority:0, animStyle:'SLAM',
    effect:{type:'FLINCH',chance:20}, description:'A prehistoric stomping attack. May cause flinching.' },
  ENDURE_STRIKE: { id:'ENDURE_STRIKE', name:'Endure Strike', type:'FIGHTING', category:'PHYSICAL', power:75, accuracy:100, pp:15, priority:0, animStyle:'MELEE',
    effect:{type:'STAT_RAISE',stat:'def',stages:1}, description:'Tanks a hit then counters, raising own Defense.' },
  FINAL_BLOW: { id:'FINAL_BLOW', name:'Final Blow', type:'FIGHTING', category:'PHYSICAL', power:120, accuracy:85, pp:5, priority:0, animStyle:'SLAM',
    effect:{type:'RECOIL',fraction:25}, description:'A final, desperate, all-or-nothing strike.' },

  // ═══════════════════════════════════════════════════════
  // PHASE 2 BATCH C — STEEL (10 more → total ~34)
  // ═══════════════════════════════════════════════════════
  IRON_PULSE: { id:'IRON_PULSE', name:'Iron Pulse', type:'STEEL', category:'SPECIAL', power:70, accuracy:100, pp:15, priority:0, animStyle:'PULSE',
    effect:{type:'NONE'}, description:'Pulses of iron energy resonate through the foe.' },
  STEEL_CRASH: { id:'STEEL_CRASH', name:'Steel Crash', type:'STEEL', category:'PHYSICAL', power:100, accuracy:90, pp:10, priority:0, animStyle:'SLAM',
    effect:{type:'NONE'}, description:'A steel-body crash of immense weight.' },
  IRON_TORNADO: { id:'IRON_TORNADO', name:'Iron Tornado', type:'STEEL', category:'PHYSICAL', power:85, accuracy:90, pp:10, priority:0, animStyle:'VORTEX',
    effect:{type:'NONE'}, description:'A tornado of iron shards engulfs the foe.' },
  CHROME_STRIKE: { id:'CHROME_STRIKE', name:'Chrome Strike', type:'STEEL', category:'PHYSICAL', power:80, accuracy:100, pp:10, priority:0, animStyle:'MELEE',
    effect:{type:'NONE'}, description:'A polished chrome limb strikes with precision.' },
  STEEL_LANCE: { id:'STEEL_LANCE', name:'Steel Lance', type:'STEEL', category:'PHYSICAL', power:75, accuracy:100, pp:15, priority:0, animStyle:'BEAM',
    effect:{type:'NONE'}, description:'A lance of steel pierces through defenses.' },
  METAL_BURST_WAVE: { id:'METAL_BURST_WAVE', name:'Metal Wave', type:'STEEL', category:'SPECIAL', power:75, accuracy:100, pp:15, priority:0, animStyle:'WAVE',
    effect:{type:'NONE'}, description:'A wave of metallic energy clangs across the field.' },
  IRON_FRENZY: { id:'IRON_FRENZY', name:'Iron Frenzy', type:'STEEL', category:'PHYSICAL', power:50, accuracy:100, pp:20, priority:0, animStyle:'MULTI',
    effect:{type:'MULTI_HIT',hits:'2-5'}, description:'Frenzied iron strikes hit 2-5 times.' },
  STEEL_BEAM_SURGE: { id:'STEEL_BEAM_SURGE', name:'Steel Surge', type:'STEEL', category:'PHYSICAL', power:90, accuracy:100, pp:10, priority:0, animStyle:'BURST',
    effect:{type:'NONE'}, description:'A surge of magnetized steel energy.' },
  FORTRESS: { id:'FORTRESS', name:'Fortress', type:'STEEL', category:'STATUS', power:0, accuracy:100, pp:10, priority:0, animStyle:'SELF',
    effect:{type:'STAT_RAISE',stat:'def',stages:3}, description:'Transforms into a fortress, drastically raising Defense.' },
  METALLIC_PULSE: { id:'METALLIC_PULSE', name:'Metallic Pulse', type:'STEEL', category:'SPECIAL', power:80, accuracy:100, pp:10, priority:0, animStyle:'PULSE',
    effect:{type:'PARALYSIS',chance:20}, description:'Metal resonance may paralyze the foe.' },

  // ═══════════════════════════════════════════════════════
  // PHASE 2 BATCH C — FIRE/WATER/GRASS (extras to balance types)
  // ═══════════════════════════════════════════════════════
  PYROCLASM: { id:'PYROCLASM', name:'Pyroclasm', type:'FIRE', category:'SPECIAL', power:130, accuracy:85, pp:5, priority:0, animStyle:'BURST',
    effect:{type:'RECHARGE'}, description:'A pyroclastic explosion of volcanic force. Must recharge.' },
  LAVA_DRAIN: { id:'LAVA_DRAIN', name:'Lava Drain', type:'FIRE', category:'SPECIAL', power:70, accuracy:100, pp:15, priority:0, animStyle:'DRAIN',
    effect:{type:'DRAIN',fraction:50}, description:'Drains the foes heat energy, healing the user.' },
  FLAME_PULSE: { id:'FLAME_PULSE', name:'Flame Pulse', type:'FIRE', category:'SPECIAL', power:65, accuracy:100, pp:20, priority:0, animStyle:'PULSE',
    effect:{type:'BURN_CHANCE',chance:20}, description:'Pulses of fire energy may burn the foe.' },
  ABYSSAL_TORRENT: { id:'ABYSSAL_TORRENT', name:'Abyssal Torrent', type:'WATER', category:'SPECIAL', power:120, accuracy:85, pp:5, priority:0, animStyle:'BURST',
    effect:{type:'RECHARGE'}, description:'The torrent of the abyss. Must recharge afterward.' },
  WATER_DRAIN: { id:'WATER_DRAIN', name:'Water Drain', type:'WATER', category:'SPECIAL', power:70, accuracy:100, pp:15, priority:0, animStyle:'DRAIN',
    effect:{type:'DRAIN',fraction:50}, description:'Draws moisture from the foe to heal the user.' },
  WATER_PULSE_SURGE: { id:'WATER_PULSE_SURGE', name:'Water Pulse', type:'WATER', category:'SPECIAL', power:65, accuracy:100, pp:20, priority:0, animStyle:'PULSE',
    effect:{type:'CONFUSE',chance:20}, description:'Ultrasonic water pulses may confuse the foe.' },
  ANCIENT_VINE: { id:'ANCIENT_VINE', name:'Ancient Vine', type:'GRASS', category:'PHYSICAL', power:90, accuracy:95, pp:10, priority:0, animStyle:'MELEE',
    effect:{type:'NONE'}, description:'An ancient vine with primordial strength.' },
  GRASS_PULSE: { id:'GRASS_PULSE', name:'Grass Pulse', type:'GRASS', category:'SPECIAL', power:65, accuracy:100, pp:20, priority:0, animStyle:'PULSE',
    effect:{type:'NONE'}, description:'Pulses of grassland energy ripple through the foe.' },
  CHLORO_DRAIN: { id:'CHLORO_DRAIN', name:'Chloro Drain', type:'GRASS', category:'SPECIAL', power:75, accuracy:100, pp:10, priority:0, animStyle:'DRAIN',
    effect:{type:'DRAIN',fraction:50}, description:'Absorbs chlorophyll to restore the users health.' },
  DRAGON_DRAIN: { id:'DRAGON_DRAIN', name:'Dragon Drain', type:'DRAGON', category:'SPECIAL', power:80, accuracy:100, pp:10, priority:0, animStyle:'DRAIN',
    effect:{type:'DRAIN',fraction:50}, description:'Drains the foes draconic energy to heal.' },
  PSYCHIC_DRAIN: { id:'PSYCHIC_DRAIN', name:'Psychic Drain', type:'PSYCHIC', category:'SPECIAL', power:70, accuracy:100, pp:10, priority:0, animStyle:'DRAIN',
    effect:{type:'DRAIN',fraction:50}, description:'Drains mental energy from the foe.' },
  GROUND_DRAIN: { id:'GROUND_DRAIN', name:'Ground Drain', type:'GROUND', category:'SPECIAL', power:70, accuracy:100, pp:10, priority:0, animStyle:'DRAIN',
    effect:{type:'DRAIN',fraction:50}, description:'Draws energy from the earth beneath the foe.' },
  DARK_PULSE_SURGE: { id:'DARK_PULSE_SURGE', name:'Darkness Pulse', type:'DARK', category:'SPECIAL', power:80, accuracy:100, pp:10, priority:0, animStyle:'PULSE',
    effect:{type:'FLINCH',chance:20}, description:'Dark pulses may cause the foe to flinch.' },
  ICE_DRAIN: { id:'ICE_DRAIN', name:'Cryo Drain', type:'ICE', category:'SPECIAL', power:65, accuracy:100, pp:15, priority:0, animStyle:'DRAIN',
    effect:{type:'DRAIN',fraction:50}, description:'Drains body heat from the foe, healing the user.' },
  ROCK_DRAIN: { id:'ROCK_DRAIN', name:'Mineral Drain', type:'ROCK', category:'SPECIAL', power:65, accuracy:100, pp:15, priority:0, animStyle:'DRAIN',
    effect:{type:'DRAIN',fraction:50}, description:'Draws mineral energy from the foe.' },
  ELECTRIC_DRAIN: { id:'ELECTRIC_DRAIN', name:'Volt Drain', type:'ELECTRIC', category:'SPECIAL', power:70, accuracy:100, pp:10, priority:0, animStyle:'DRAIN',
    effect:{type:'DRAIN',fraction:50}, description:'Drains electrical energy from the foe.' },
  POISON_DRAIN: { id:'POISON_DRAIN', name:'Venom Drain', type:'POISON', category:'SPECIAL', power:65, accuracy:100, pp:15, priority:0, animStyle:'DRAIN',
    effect:{type:'DRAIN',fraction:50}, description:'Draws toxic energy from the foe.' },

  // ── HM Field Moves ────────────────────────────────────────────
  CUT: {
    id:'CUT', name:'Cut', type:'NORMAL', category:'PHYSICAL',
    power:50, accuracy:95, pp:30, priority:0, animStyle:'SLASH',
    effect:{type:'NONE'},
    description:'Cuts with sharp claws. Can slice down small trees outside battle.'
  },
  FLASH: {
    id:'FLASH', name:'Flash', type:'NORMAL', category:'STATUS',
    power:null, accuracy:100, pp:20, priority:0, animStyle:'SPARKLE',
    effect:{type:'STAT', target:'FOE', stat:'accuracy', stages:-1},
    description:'Blinds the foe with intense light, lowering Accuracy by 1 stage. Illuminates dark caves.'
  },

};

// ── FASE 9: multi-hit-normalisatie ──────────────────────────────
// Een latere lichting moves (Fireworks e.a. — 16 stuks) gebruikt een afwijkend
// format: type 'MULTI_HIT' met hits als tekst ('2-5'). De engine kent alleen
// 'MULTI' met hits als [min, max], waardoor die moves stilletjes 1× raakten.
// Deze patch vertaalt het afwijkende format bij het laden — en vangt meteen
// toekomstige moves in dezelfde stijl af.
(function _normalizeMultiHit() {
  for (const key in DG.MOVES) {
    const eff = DG.MOVES[key] && DG.MOVES[key].effect;
    if (!eff || eff.type !== 'MULTI_HIT') continue;
    eff.type = 'MULTI';
    if (typeof eff.hits === 'string') {
      const parts = eff.hits.split('-').map(Number);
      eff.hits = [parts[0] || 2, parts[1] || parts[0] || 2];
    } else if (typeof eff.hits === 'number') {
      eff.hits = [eff.hits, eff.hits];
    } else if (!Array.isArray(eff.hits)) {
      eff.hits = [2, 5];
    }
  }
})();

// ── FASE 10: hertoewijzing naar de nieuwe stijl-primitieven ─────
// 976 moves deelden 15 generieke sjablonen. Acht nieuwe getekende stijlen
// (STREAM/BOLT/RAIN/SLASH/CHOMP/ORB/QUAKE/TWISTER) worden hier toegewezen:
// eerst een expliciete lijst voor de iconische moves, daarna naam-patronen
// voor de rest. Alleen niet-STATUS-moves; multi-hits behouden hun MULTI-stijl.
(function _restyleMoves() {
  const explicit = {
    // STREAM — stralen
    FLAMETHROWER:'STREAM', HYDRO_PUMP:'STREAM', WATER_GUN:'STREAM',
    FROST_BREATH:'STREAM', DRAGON_BREATH:'STREAM', WATER_SPOUT:'STREAM',
    ERUPTION:'STREAM', FLASH_CANNON:'STREAM', OVERHEAT:'STREAM',
    // BOLT — bliksem van boven
    THUNDER:'BOLT', THUNDERBOLT:'BOLT', THUNDER_SHOCK:'BOLT',
    ZAP_CANNON:'BOLT', CHARGE_BEAM:'BOLT', DISCHARGE:'BOLT',
    // RAIN — bombardement uit de lucht
    ROCK_SLIDE:'RAIN', DRACO_METEOR:'RAIN', BLIZZARD:'RAIN',
    ICICLE_CRASH:'RAIN', LEAF_STORM:'RAIN',
    // QUAKE — grondschok
    EARTHQUAKE:'QUAKE', MAGNITUDE:'QUAKE', BULLDOZE:'QUAKE', FISSURE:'QUAKE',
    // TWISTER — draaikolk
    FIRE_SPIN:'TWISTER', WHIRLPOOL:'TWISTER', GUST:'TWISTER', PETAL_DANCE:'TWISTER',
    // ORB — energiebol
    ENERGY_BALL:'ORB', SHADOW_BALL:'ORB', AURA_SPHERE:'ORB',
    SLUDGE_BOMB:'ORB', MOONBLAST:'ORB', GUNK_SHOT:'ORB', PYRO_BALL:'ORB',
    // CHOMP — kaken
    BITE:'CHOMP', CRUNCH:'CHOMP', FIRE_FANG:'CHOMP', POISON_FANG:'CHOMP',
    // SLASH — klauwen
    SCRATCH:'SLASH', NIGHT_SLASH:'SLASH', X_SCISSOR:'SLASH', METAL_CLAW:'SLASH',
    DRAGON_CLAW:'SLASH', SHADOW_CLAW:'SLASH', AERIAL_ACE:'SLASH', AIR_SLASH:'SLASH',
    CROSS_CHOP:'SLASH', KARATE_CHOP:'SLASH',
    // reparatie van een kapotte verwijzing (SPARKLE bestond niet)
    FLASH:'PULSE',
  };
  const patterns = [
    [/FANG|CHOMP|CRUNCH|_BITE$|^BITE/,                    'CHOMP'],
    [/CLAW|SLASH|SCISSOR|BLADE|CUTTER/,                   'SLASH'],
    [/METEOR|ICICLE|_SLIDE$|HAILSTORM/,                   'RAIN'],
    [/BREATH$|CANNON$|_PUMP$|SPOUT|GEYSER|FLAMETHROWER/,  'STREAM'],
    [/THUNDER|^ZAP|LIGHTNING|_SHOCK$/,                    'BOLT'],
    [/QUAKE|TREMOR|MAGNITUDE|BULLDOZE|FISSURE|_STOMP$/,   'QUAKE'],
    [/_SPIN$|WHIRL|TWISTER|TORNADO|CYCLONE|^GUST/,        'TWISTER'],
    [/_BALL$|SPHERE$|_BOMB$|_ORB$/,                       'ORB'],
  ];
  for (const id in DG.MOVES) {
    const mv = DG.MOVES[id];
    if (!mv) continue;
    if (mv.category === 'STATUS') { if (explicit[id] === 'PULSE') mv.animStyle = 'PULSE'; continue; }
    if (mv.effect && mv.effect.type === 'MULTI') continue; // multi-hits houden hun eigen stijl
    if (explicit[id]) { mv.animStyle = explicit[id]; continue; }
    for (const [re, style] of patterns) {
      if (re.test(id)) { mv.animStyle = style; break; }
    }
  }
})();

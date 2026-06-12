/**
 * add_moves_p1b2.js — Phase 1 Batch 2 (~210 new moves, target: ~500 total)
 * Adds 12 moves per type with varied animStyles, proper effects, and no duplicates.
 */
const fs = require('fs');
const filePath = './js/data/moves.js';

// Load existing IDs
const DG = {};
eval(fs.readFileSync(filePath,'utf8').replace(/window\.DG\s*=\s*window\.DG\s*\|\|\s*\{\};/g,'').replace(/\bwindow\.DG\b/g,'DG'));
const EXISTING = new Set(Object.keys(DG.MOVES || {}));

const NEW_MOVES = `

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
    description:'An attack move that cuts down the opposing DinoMon\'s HP to equal the user\'s HP.'
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
    description:'The user attacks with torchlight that it controls. This also raises the user\'s Sp. Atk.'
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
    description:'The user saps the target\'s power and heals itself by the amount of Attack the target has.'
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
    description:'The user drains the target\'s energy using its horns, restoring HP by half the damage dealt.'
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
    description:'The user restores the target\'s HP using the power of flowers, healing up to half max HP.'
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
    description:'The user attacks suddenly, leaving a trail of grass. Always raises the user\'s Speed.'
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

  CHARGE_BEAM: {
    id:'CHARGE_BEAM', name:'Charge Beam', type:'ELECTRIC', category:'SPECIAL',
    power:50, accuracy:90, pp:10, priority:0, animStyle:'BEAM',
    effect:{type:'STAT_RAISE', stat:'spAtk', stages:1, chance:70, target:'self'},
    description:'The user attacks with an electric charge. 70% chance to raise the user\'s Sp. Atk.'
  },
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
    description:'The user makes a swift attack on the target\'s legs. This always lowers the target\'s Speed.'
  },
  ROCK_SMASH: {
    id:'ROCK_SMASH', name:'Rock Smash', type:'FIGHTING', category:'PHYSICAL',
    power:40, accuracy:100, pp:15, priority:0, animStyle:'SLAM',
    effect:{type:'STAT_LOWER', stat:'def', stages:-1, chance:50, target:'opponent'},
    description:'The user attacks with a punch that can shatter rocks. It may lower the target\'s Defense stat.'
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
    description:'The target is thrown using gravity. It inflicts damage equal to the user\'s level.'
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
    description:'The user attacks by slicing with a long horn. The user\'s stat changes don\'t affect this attack\'s damage.'
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
  VENOM_DRENCH: {
    id:'VENOM_DRENCH', name:'Venom Drench', type:'POISON', category:'STATUS',
    power:null, accuracy:100, pp:20, priority:0, animStyle:'FIELD',
    effect:{type:'STAT_LOWER', stats:['atk','spAtk'], stages:-1, chance:100, target:'opponent'},
    description:'Opposing DinoMon are drenched in venom that lowers Attack and Sp. Atk.'
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
  SLUDGE_WAVE: {
    id:'SLUDGE_WAVE', name:'Sludge Wave', type:'POISON', category:'SPECIAL',
    power:95, accuracy:100, pp:10, priority:0, animStyle:'WAVE',
    effect:{type:'STATUS_CHANCE', status:'POISON', chance:10},
    description:'The user strikes everything around it by swamping the area with a giant sludge wave.'
  },
  POISON_FANG: {
    id:'POISON_FANG', name:'Poison Fang', type:'POISON', category:'PHYSICAL',
    power:50, accuracy:100, pp:15, priority:0, animStyle:'MELEE',
    effect:{type:'STATUS_CHANCE', status:'BADPOISON', chance:50},
    description:'The user bites the target with toxic fangs. May badly poison the target.'
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
    description:'Driven by frustration, the user attacks the target. Power doubles if the user\'s last move failed.'
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
    description:'The user tills the soil, boosting the power of the user and allies\' Grass-type moves.'
  },
  LAND_WRATH: {
    id:'LAND_WRATH', name:'Land\'s Wrath', type:'GROUND', category:'PHYSICAL',
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
    description:'The user absorbs its target\'s HP with a powerful beam. Restores most of the damage dealt.'
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

  PSYSTRIKE: {
    id:'PSYSTRIKE', name:'Psystrike', type:'PSYCHIC', category:'SPECIAL',
    power:100, accuracy:100, pp:10, priority:0, animStyle:'PULSE',
    effect:{type:'NONE'},
    description:'The user materialises an odd psychic wave to attack the target using its physical Defense.'
  },
  STORED_POWER: {
    id:'STORED_POWER', name:'Stored Power', type:'PSYCHIC', category:'SPECIAL',
    power:20, accuracy:100, pp:10, priority:0, animStyle:'AURA',
    effect:{type:'NONE'},
    description:'The user attacks the target with stored power. Power rises with the user\'s boosted stats.'
  },
  HEAL_PULSE: {
    id:'HEAL_PULSE', name:'Heal Pulse', type:'PSYCHIC', category:'STATUS',
    power:null, accuracy:999, pp:10, priority:0, animStyle:'SELF',
    effect:{type:'HEAL', fraction:0.5},
    description:'The user emits a healing pulse that restores the target\'s HP by up to half of its max HP.'
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
    description:'The user attacks with an abnormal light that harshly lowers the target\'s Sp. Def.'
  },
  MYSTICAL_POWER: {
    id:'MYSTICAL_POWER', name:'Mystical Power', type:'PSYCHIC', category:'SPECIAL',
    power:70, accuracy:90, pp:10, priority:0, animStyle:'AURA',
    effect:{type:'STAT_RAISE', stat:'spAtk', stages:1, chance:100, target:'self'},
    description:'The user attacks using a mysterious power. This also raises the user\'s Sp. Atk stat.'
  },
  PSYCHIC_FANGS: {
    id:'PSYCHIC_FANGS', name:'Psychic Fangs', type:'PSYCHIC', category:'PHYSICAL',
    power:85, accuracy:100, pp:10, priority:0, animStyle:'MELEE',
    effect:{type:'STAT_LOWER', stat:'spDef', stages:-1, chance:50, target:'opponent'},
    description:'The user bites the target with psychic fangs. This may lower the target\'s Sp. Def.'
  },
  OVERDRIVE_PSY: {
    id:'OVERDRIVE_PSY', name:'Overdrive Psy', type:'PSYCHIC', category:'SPECIAL',
    power:110, accuracy:90, pp:5, priority:0, animStyle:'BURST',
    effect:{type:'NONE'},
    description:'The user overloads the target\'s mind with psychic energy, causing massive mental damage.'
  },
  ANCIENT_PSY: {
    id:'ANCIENT_PSY', name:'Ancient Power Psy', type:'PSYCHIC', category:'SPECIAL',
    power:60, accuracy:100, pp:5, priority:0, animStyle:'AURA',
    effect:{type:'OMNI_RAISE', chance:10},
    description:'The user attacks with psychic power from ancient times. May raise all the user\'s stats.'
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
    description:'While resisting, the user attacks the opposing DinoMon. This lowers the target\'s Sp. Atk.'
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
    description:'The user skitters behind the target to attack. This also lowers the target\'s Sp. Atk.'
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
    description:'The target is infested and attacked for four to five turns. The target can\'t flee during this time.'
  },
  BUG_BITE: {
    id:'BUG_BITE', name:'Bug Bite', type:'BUG', category:'PHYSICAL',
    power:60, accuracy:100, pp:20, priority:0, animStyle:'MELEE',
    effect:{type:'NONE'},
    description:'The user bites the target. If the target is holding a Berry, the user eats it and gains its effect.'
  },
  X_SCISSOR: {
    id:'X_SCISSOR', name:'X-Scissor', type:'BUG', category:'PHYSICAL',
    power:80, accuracy:100, pp:15, priority:0, animStyle:'MELEE',
    effect:{type:'NONE'},
    description:'The user slashes at the target by crossing its scythes or claws as if making an X.'
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
    description:'The user whips up a storm of diamonds to damage all opponents. May raise the user\'s Defense.'
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
    description:'The user gathers energy from meteorites to attack. This raises the user\'s Sp. Atk on the first turn.'
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
    description:'The user swings a stone axe and launches fragments. Splinters become Stealth Rock on the foe\'s side.'
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

  NIGHT_SHADE: {
    id:'NIGHT_SHADE', name:'Night Shade', type:'GHOST', category:'SPECIAL',
    power:60, accuracy:100, pp:15, priority:0, animStyle:'VORTEX',
    effect:{type:'NONE'},
    description:'The user makes the target see a frightening illusion equal in damage to the user\'s level.'
  },
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
    description:'The user hides in the target\'s shadow, then strikes while stealing the target\'s stat boosts.'
  },
  MOONGEIST_BEAM: {
    id:'MOONGEIST_BEAM', name:'Moongeist Beam', type:'GHOST', category:'SPECIAL',
    power:100, accuracy:100, pp:5, priority:0, animStyle:'BEAM',
    effect:{type:'NONE'},
    description:'The user emits a sinister ray to attack the target. This move ignores the target\'s ability.'
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
    description:'The user attacks while simultaneously stitching the target\'s shadow to the ground. Target cannot flee.'
  },
  SHADOW_FORCE: {
    id:'SHADOW_FORCE', name:'Shadow Force', type:'GHOST', category:'PHYSICAL',
    power:120, accuracy:100, pp:5, priority:0, animStyle:'VORTEX',
    effect:{type:'TWO_TURN', chargeMsg:'vanished into the shadows!'},
    description:'The user disappears, then strikes the target on the next turn. This attack hits through Protect.'
  },
  SHADOW_CLAW: {
    id:'SHADOW_CLAW', name:'Shadow Claw', type:'GHOST', category:'PHYSICAL',
    power:70, accuracy:100, pp:15, priority:0, animStyle:'MELEE',
    effect:{type:'NONE'},
    description:'The user slashes with a sharp claw made from shadows. High critical-hit ratio.'
  },
  EERIE_SPELL: {
    id:'EERIE_SPELL', name:'Eerie Spell', type:'GHOST', category:'SPECIAL',
    power:80, accuracy:100, pp:5, priority:0, animStyle:'PULSE',
    effect:{type:'STAT_LOWER', stat:'spDef', stages:-1, chance:100, target:'opponent'},
    description:'The user attacks with its tremendous ghostly power. This also lowers the target\'s Sp. Def.'
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
    description:'The user raises all its stats by using some of its HP. Costs 1/3 of the user\'s max HP.'
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
    description:'Converting life-force into power, the user attacks. Power decreases as the user\'s HP decreases.'
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
    description:'The user sings an ancient draconic song. May raise all the user\'s stats with primordial power.'
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
    description:'The user slaps away the target\'s held item, and that item can\'t be used in that battle.'
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
    description:'The user summons a ruinous disaster that cuts the target\'s HP in half.'
  },
  HYPERSPACE_FURY: {
    id:'HYPERSPACE_FURY', name:'Hyperspace Fury', type:'DARK', category:'PHYSICAL',
    power:100, accuracy:999, pp:5, priority:0, animStyle:'VORTEX',
    effect:{type:'STAT_LOWER', stat:'def', stages:-1, chance:100, target:'self'},
    description:'The user attacks the target by using its arms to seize through an unknown dimension. Lowers user\'s Defense.'
  },
  DARKEST_LARIAT: {
    id:'DARKEST_LARIAT', name:'Darkest Lariat', type:'DARK', category:'PHYSICAL',
    power:85, accuracy:100, pp:10, priority:0, animStyle:'SLAM',
    effect:{type:'NONE'},
    description:'The user swings both its arms and hits the target. The user\'s stat changes don\'t affect this attack.'
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
    description:'The user ambushes with overwhelming shadow energy. May lower the target\'s Defense.'
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
    description:'The user attacks by throwing a mass of coins. This lowers the user\'s Sp. Atk stat.'
  },
  KING_SHIELD: {
    id:'KING_SHIELD', name:'King\'s Shield', type:'STEEL', category:'STATUS',
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
    description:'The user fires a meteor-like punch at the target. It may also raise the user\'s Attack.'
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
    description:'The user attacks the target with so much force that it could break the target\'s spirit. Lowers Sp. Atk.'
  },
  MOONFORCE: {
    id:'MOONFORCE', name:'Moon Force', type:'FAIRY', category:'SPECIAL',
    power:95, accuracy:100, pp:10, priority:0, animStyle:'PULSE',
    effect:{type:'STAT_LOWER', stat:'spAtk', stages:-1, chance:30, target:'opponent'},
    description:'A powerful lunar force blasts the target. It may lower the target\'s Sp. Atk.'
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
  FAIRY_WIND: {
    id:'FAIRY_WIND', name:'Fairy Wind', type:'FAIRY', category:'SPECIAL',
    power:40, accuracy:100, pp:30, priority:0, animStyle:'WAVE',
    effect:{type:'NONE'},
    description:'The user stirs up a fairy wind and strikes the target with it.'
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

`;

// Inject into moves.js
let content = fs.readFileSync(filePath, 'utf8');
const lastBrace = content.lastIndexOf('};');

// Filter out existing IDs
const blocks = NEW_MOVES.split(/(?=\n  [A-Z_]+:\s*\{)/);
const kept = blocks.filter(b => {
  const m = b.match(/\n  ([A-Z_]+):\s*\{/);
  return !m || !EXISTING.has(m[1]);
});

const filteredNew = kept.join('');
const addedCount = (filteredNew.match(/^\s{2}[A-Z_]+:\s*\{/gm) || []).length;

const newContent = content.substring(0, lastBrace) + filteredNew + '\n};\n';
fs.writeFileSync(filePath, newContent, 'utf8');
console.log(`Added ${addedCount} new moves.`);

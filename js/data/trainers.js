// DinoMon: Fossil Frontier — Trainer Data  v18
// Global namespace: window.DG
'use strict';

window.DG = window.DG || {};

DG.TRAINERS = {};

// ============================================================
// GYM LEADERS (8) — Thematic Dinosaur Order (Option B)
// ============================================================

DG.TRAINERS.GYM_REX = {
  id:                 'GYM_REX',
  name:               'Normal Normi',
  class:              'Gym Leader',
  isGymLeader:        true,
  isStoryBoss:        false,
  gymId:              'GYM_SHELLCREEK',
  badge:              'Herd Badge',
  preBattleDialogue:  'GYM_REX_PRE',
  postBattleDialogue: 'GYM_REX_POST',
  winDialogue:        "Ha! You're brave to challenge me. My herd has trampled a thousand challengers!",
  loseDialogue:       "Impressive! You've earned the Herd Badge. My DinoMons respect your strength.",
  reward:             1000,
  party: [
    {
      speciesId: 'NORMLET',
      level:     10,
      moves:     ['TACKLE', 'GROWL', 'QUICK_ATTACK', 'TAIL_WHIP'],
    },
    {
      speciesId: 'HERDSAUR',
      level:     14,
      moves:     ['HEADBUTT', 'BODY_SLAM', 'TACKLE', 'GROWL'],
    },
  ],
  aiTier:   1,
  location: 'SHELLCREEK',
};

DG.TRAINERS.GYM_RIDLEY = {
  id:                 'GYM_RIDLEY',
  name:               'Jam Sennings',
  class:              'Gym Leader',
  isGymLeader:        true,
  isStoryBoss:        false,
  gymId:              'GYM_DUSTWALL',
  badge:              'Fossil Badge',
  preBattleDialogue:  'GYM_RIDLEY_PRE',
  postBattleDialogue: 'GYM_RIDLEY_POST',
  winDialogue:        "These fossils remember the first age. Can you overcome their ancient strength?",
  loseDialogue:       "The Fossil Badge is yours. With it, your DinoMons can use Rock Smash outside battle.",
  reward:             1600,
  party: [
    {
      speciesId: 'BONEBACK',
      level:     16,
      moves:     ['ROCK_THROW', 'TACKLE', 'HARDEN', 'HEADBUTT'],
    },
    {
      speciesId: 'STONESKULL',
      level:     22,
      moves:     ['ROCK_SLIDE', 'SKULL_SLAM', 'STEALTH_ROCK', 'EARTHQUAKE'],
    },
  ],
  aiTier:   2,
  location: 'DUSTWALL',
};

DG.TRAINERS.GYM_IGNIS = {
  id:                 'GYM_IGNIS',
  name:               'Asset Toverdijk',
  class:              'Gym Leader',
  isGymLeader:        true,
  isStoryBoss:        false,
  gymId:              'GYM_PYRESIDE',
  badge:              'Magma Badge',
  preBattleDialogue:  'GYM_IGNIS_PRE',
  postBattleDialogue: 'GYM_IGNIS_POST',
  winDialogue:        "Fire is the beginning and the end of everything. Can you withstand the inferno?",
  loseDialogue:       "You've doused my flames! The Magma Badge is yours. Flash can now be used in dark caves.",
  reward:             2600,
  party: [
    {
      speciesId: 'EMBRIX',
      level:     26,
      moves:     ['EMBER', 'FLAME_CHARGE', 'SMOKESCREEN', 'FIRE_SPIN'],
    },
    {
      speciesId: 'FIRECOAL',
      level:     28,
      moves:     ['FIRE_SPIN', 'FLAME_CHARGE', 'EMBER', 'SCRATCH'],
    },
    {
      speciesId: 'SCORCHBACK',
      level:     32,
      moves:     ['FLAMETHROWER', 'ROCK_SLIDE', 'FIRE_BLAST', 'SAIL_BLAST'],
    },
  ],
  aiTier:   2,
  location: 'PYRESIDE',
};

DG.TRAINERS.GYM_SYLVA = {
  id:                 'GYM_SYLVA',
  name:               'PuKing Maarten',
  class:              'Gym Leader',
  isGymLeader:        true,
  isStoryBoss:        false,
  gymId:              'GYM_FERNGROVE',
  badge:              'Canopy Badge',
  preBattleDialogue:  'GYM_SYLVA_PRE',
  postBattleDialogue: 'GYM_SYLVA_POST',
  winDialogue:        "Plants were here before dinosaurs. They will remain after us. Can you best the eternal forest?",
  loseDialogue:       "You've felled the ancient canopy. The Canopy Badge is yours. Cut can now be used outside battle.",
  reward:             2800,
  party: [
    {
      speciesId: 'FRONDLET',
      level:     32,
      moves:     ['VINE_WHIP', 'RAZOR_LEAF', 'SYNTHESIS', 'STUN_SPORE'],
    },
    {
      speciesId: 'LEAFAWN',
      level:     34,
      moves:     ['RAZOR_LEAF', 'ENERGY_BALL', 'SYNTHESIS', 'PLATE_SLAM'],
    },
    {
      speciesId: 'VERDANTHORN',
      level:     38,
      moves:     ['JADE_PLATE_SLAM', 'SOLAR_BEAM', 'STONE_EDGE', 'SYNTHESIS'],
    },
  ],
  aiTier:   2,
  location: 'FERNGROVE',
};

DG.TRAINERS.GYM_TERRA = {
  id:                 'GYM_TERRA',
  name:               'Rock Hard Toonen',
  class:              'Gym Leader',
  isGymLeader:        true,
  isStoryBoss:        false,
  gymId:              'GYM_STONEHAVEN',
  badge:              'Bedrock Badge',
  preBattleDialogue:  'GYM_TERRA_PRE',
  postBattleDialogue: 'GYM_TERRA_POST',
  winDialogue:        "The ground remembers every footstep. Every tremor. Every fall. Yours will be no different.",
  loseDialogue:       "The earth bows to you! Take the Bedrock Badge. Strength can now be used to move boulders.",
  reward:             3600,
  party: [
    {
      speciesId: 'QUAKELING',
      level:     38,
      moves:     ['BULLDOZE', 'CLUB_SMASH', 'SAND_ATTACK', 'EARTHQUAKE'],
    },
    {
      speciesId: 'DESERTFANG',
      level:     40,
      moves:     ['EARTHQUAKE', 'CRUNCH', 'BULLDOZE', 'SANDSTORM'],
    },
    {
      speciesId: 'MIDDODON',
      level:     42,
      moves:     ['BULLDOZE', 'CLUB_SMASH', 'EARTHQUAKE', 'SAND_ATTACK'],
    },
    {
      speciesId: 'TERRADON',
      level:     44,
      moves:     ['EARTHQUAKE', 'STONE_EDGE', 'CLUB_SMASH', 'STEALTH_ROCK'],
    },
  ],
  aiTier:   3,
  location: 'CRESTFALL',
};

DG.TRAINERS.GYM_VOLT = {
  id:                 'GYM_VOLT',
  name:               'Beyblade Luuk',
  class:              'Gym Leader',
  isGymLeader:        true,
  isStoryBoss:        false,
  gymId:              'GYM_CRESTFALL',
  badge:              'Static Badge',
  preBattleDialogue:  'GYM_VOLT_PRE',
  postBattleDialogue: 'GYM_VOLT_POST',
  winDialogue:        "Stand still and you lose. Move — always keep moving! Can you match my lightning speed?",
  loseDialogue:       "Crackling! The Static Badge is yours. Your DinoMons can now Fly between visited cities!",
  reward:             4200,
  party: [
    {
      speciesId: 'SPARKHORN',
      level:     44,
      moves:     ['THUNDERBOLT', 'THUNDER_WAVE', 'SPARK', 'QUICK_ATTACK'],
    },
    {
      speciesId: 'STORMWING',
      level:     46,
      moves:     ['THUNDERBOLT', 'WING_ATTACK', 'SPARK', 'THUNDER_WAVE'],
    },
    {
      speciesId: 'VOLTHORN',
      level:     47,
      moves:     ['THUNDERBOLT', 'SPARK', 'THUNDER_WAVE', 'QUICK_ATTACK'],
    },
    {
      speciesId: 'TEMPESTFANG',
      level:     48,
      moves:     ['THUNDERBOLT', 'WING_ATTACK', 'SPARK', 'AIR_SLASH'],
    },
    {
      speciesId: 'THUNDERSAUR',
      level:     50,
      moves:     ['THUNDER', 'THUNDERBOLT', 'DRAGON_BREATH', 'RAIN_DANCE'],
    },
  ],
  aiTier:   3,
  location: 'CRESTFALL',
};

DG.TRAINERS.GYM_MARINA = {
  id:                 'GYM_MARINA',
  name:               'Surfing Peter',
  class:              'Gym Leader',
  isGymLeader:        true,
  isStoryBoss:        false,
  gymId:              'GYM_BOGMIRE',
  badge:              'Tide Badge',
  preBattleDialogue:  'GYM_MARINA_PRE',
  postBattleDialogue: 'GYM_MARINA_POST',
  winDialogue:        "The water remembers everything. It never forgets. Let's see what it remembers of you...",
  loseDialogue:       "You've calmed the tide. The Tide Badge is yours. Surf can now be used to cross water!",
  reward:             5200,
  party: [
    {
      speciesId: 'MUDFIN',
      level:     52,
      moves:     ['SURF', 'BULLDOZE', 'MUD_SLAP', 'WATER_GUN'],
    },
    {
      speciesId: 'SWAMPJAW',
      level:     54,
      moves:     ['HYDRO_PUMP', 'EARTHQUAKE', 'SURF', 'TOXIC'],
    },
    {
      speciesId: 'MARSHFIN',
      level:     53,
      moves:     ['SURF', 'WATER_GUN', 'MUD_SLAP', 'TOXIC'],
    },
    {
      speciesId: 'SEAFANG',
      level:     56,
      moves:     ['HYDRO_PUMP', 'SURF', 'CRUNCH', 'TOXIC'],
    },
    {
      speciesId: 'TIDANOSAURUS',
      level:     58,
      moves:     ['HYDRO_PUMP', 'DRAGON_PULSE', 'SURF', 'ANCIENT_TORRENT'],
    },
  ],
  aiTier:   3,
  location: 'BOGMIRE',
};

DG.TRAINERS.GYM_VALDEZ = {
  id:                 'GYM_VALDEZ',
  name:               'Bipolar Fieke',
  class:              'Gym Leader',
  isGymLeader:        true,
  isStoryBoss:        false,
  gymId:              'GYM_APEXSUMMIT',
  badge:              'Scale Badge',
  preBattleDialogue:  'GYM_VALDEZ_PRE',
  postBattleDialogue: 'GYM_VALDEZ_POST',
  winDialogue:        "Dragons ruled before mankind came. After you fall, they will still rule. Come then — prove yourself.",
  loseDialogue:       "Astonishing. The Scale Badge is yours, and with it, Dive can take you to the deepest waters.",
  reward:             6400,
  party: [
    {
      speciesId: 'SWOOPTER',
      level:     60,
      moves:     ['DRAGON_CLAW', 'AIR_SLASH', 'DIVE_BOMB', 'DRAGON_DANCE'],
    },
    {
      speciesId: 'GLIDEREX',
      level:     64,
      moves:     ['DRAGON_CLAW', 'DIVE_BOMB', 'AERIAL_ACE', 'DRAGON_BREATH'],
    },
    {
      speciesId: 'SKYMASTER',
      level:     65,
      moves:     ['AIR_SLASH', 'DRAGON_CLAW', 'AERIAL_ACE', 'DRAGON_BREATH'],
    },
    {
      speciesId: 'RAMPASAUR',
      level:     66,
      moves:     ['STONE_EDGE', 'EARTHQUAKE', 'DRAGON_CLAW', 'CLUB_SMASH'],
    },
    {
      speciesId: 'TEMPESTFANG',
      level:     67,
      moves:     ['THUNDERBOLT', 'AIR_SLASH', 'WING_ATTACK', 'SPARK'],
    },
    {
      speciesId: 'SKYFANG',
      level:     68,
      moves:     ['DRACO_METEOR', 'MIND_DIVE', 'DRAGON_CLAW', 'PSYCHIC_MOVE'],
    },
  ],
  aiTier:   3,
  location: 'APEXSUMMIT',
};

// ============================================================
// FAIRY GYM (inserted between gym 4 and 5) — AFK Jorn
// ============================================================

DG.TRAINERS.GYM_AFKJORN = {
  id:'GYM_AFKJORN', name:'AFK Jorn', class:'Gym Leader', isGymLeader:true, isStoryBoss:false,
  gymId:'GYM_FAIRYDELL', badge:'Charm Badge',
  preBattleDialogue:'GYM_AFKJORN_PRE', postBattleDialogue:'GYM_AFKJORN_POST',
  winDialogue:"Brb, just one sec... okay I'm back! Let's see if your DinoMons can handle a little charm.",
  loseDialogue:"GG! You earned the Charm Badge. My fairies are no match for your focus.",
  reward:3000,
  party:[
    { speciesId:'GEMHORN',    level:39, moves:['FAIRY_WIND','DAZZLING_GLEAM','DRAINING_KISS','CHARM'] },
    { speciesId:'FLUTTERHORN',level:40, moves:['DAZZLING_GLEAM','AIR_SLASH','DRAINING_KISS','PIXIE_STRIKE'] },
    { speciesId:'BLOOMSAUR',  level:41, moves:['DAZZLING_GLEAM','PLAY_ROUGH','DRAINING_KISS','PIXIE_STRIKE'] },
    { speciesId:'FLOROSAUR',  level:42, moves:['MOONBLAST','PLAY_ROUGH','DAZZLING_GLEAM','PIXIE_STRIKE'] },
  ],
  aiTier:3, location:'FAIRYDELL',
};

DG.TRAINERS.AFKJORN_T1 = {
  id:'AFKJORN_T1', name:'Pixie Pim', class:'Fairy Acolyte', isGymLeader:false,
  badge:null, winDialogue:"Sparkles incoming!", loseDialogue:"Aw, out of magic.",
  reward:600, party:[{ speciesId:'GEMLET', level:36, moves:['FAIRY_WIND','DISARMING_VOICE','DRAINING_KISS','CHARM'] }],
  aiTier:2, location:'FAIRYDELL',
};
DG.TRAINERS.AFKJORN_T2 = {
  id:'AFKJORN_T2', name:'Wisp Wendy', class:'Fairy Acolyte', isGymLeader:false,
  badge:null, winDialogue:"Catch me if you can!", loseDialogue:"So fast...",
  reward:600, party:[{ speciesId:'WISPLET', level:36, moves:['FAIRY_WIND','DISARMING_VOICE','QUICK_ATTACK','DRAINING_KISS'] }],
  aiTier:2, location:'FAIRYDELL',
};

// Compound City — Daytrader Niels' interns (pay well — it's a finance town)
DG.TRAINERS.NIELS_INTERN1 = {
  id:'NIELS_INTERN1', name:'Intern Bull', class:'Analyst', isGymLeader:false,
  badge:null, winDialogue:"Buy low, battle high!", loseDialogue:"Bearish outcome...",
  reward:1500, party:[
    { speciesId:'NORMLET', level:13, moves:['TACKLE','QUICK_ATTACK','HEADBUTT','GROWL'] },
    { speciesId:'BUGLING', level:14, moves:['TACKLE','BUG_BITE','HARDEN','QUICK_ATTACK'] },
  ], aiTier:2, location:'COMPOUND_CITY',
};
DG.TRAINERS.NIELS_INTERN2 = {
  id:'NIELS_INTERN2', name:'Intern Bear', class:'Analyst', isGymLeader:false,
  badge:null, winDialogue:"Short the competition!", loseDialogue:"Market correction...",
  reward:1500, party:[
    { speciesId:'ROCKLETT', level:14, moves:['ROCK_THROW','TACKLE','HARDEN','HEADBUTT'] },
    { speciesId:'QUAKELING', level:15, moves:['BULLDOZE','SAND_ATTACK','HEADBUTT','TACKLE'] },
  ], aiTier:2, location:'COMPOUND_CITY',
};
DG.TRAINERS.NIELS_BOSS = {
  id:'NIELS_BOSS', name:'Daytrader Niels', class:'Daytrader', isGymLeader:false, isStoryBoss:true,
  badge:null,
  winDialogue:"A dip in your portfolio. Come back when you've diversified.",
  loseDialogue:"Outperformed! You've got the instincts of a blue-chip trainer.",
  reward:6000, party:[
    { speciesId:'NORMLET',   level:17, moves:['TACKLE','QUICK_ATTACK','HEADBUTT','GROWL'] },
    { speciesId:'BUGLING',   level:18, moves:['TACKLE','BUG_BITE','HARDEN','QUICK_ATTACK'] },
    { speciesId:'EMBRIX',    level:18, moves:['EMBER','TACKLE','SMOKESCREEN','FLAME_CHARGE'] },
    { speciesId:'SHADOWLET', level:20, moves:['SHADOW_BALL','NIGHT_SHADE','LICK','CONFUSE_RAY'] },
  ], aiTier:3, location:'COMPOUND_CITY',
};

// ============================================================
// STORY BOSSES (5)
// ============================================================

DG.TRAINERS.CMD_TRIASSIC_1 = {
  id:                 'CMD_TRIASSIC_1',
  name:               'Commander Triassic',
  class:              'Team Extinction Commander',
  isGymLeader:        false,
  isStoryBoss:        true,
  badge:              null,
  preBattleDialogue:  'CMD_TRIASSIC_1',
  postBattleDialogue: 'CMD_TRIASSIC_2',
  winDialogue:        "Pathetic. Team Extinction will not be stopped by a child.",
  loseDialogue:       "Hmph! Don't celebrate yet — this isn't over by a long shot!",
  reward:             800,
  party: [
    {
      speciesId: 'EMBRIX',
      level:     15,
      moves:     ['EMBER', 'TACKLE', 'SMOKESCREEN', 'FLAME_CHARGE'],
    },
    {
      speciesId: 'SHADOWLET',
      level:     16,
      moves:     ['SHADOW_BALL', 'NIGHT_SHADE', 'LICK', 'CONFUSE_RAY'],
    },
    {
      speciesId: 'NORMLET',
      level:     15,
      moves:     ['TACKLE', 'GROWL', 'QUICK_ATTACK', 'HEADBUTT'],
    },
  ],
  aiTier:   2,
  location: 'ROUTE_3',
};

DG.TRAINERS.CMD_TRIASSIC_2 = {
  id:                 'CMD_TRIASSIC_2',
  name:               'Commander Triassic',
  class:              'Team Extinction Commander',
  isGymLeader:        false,
  isStoryBoss:        true,
  badge:              null,
  preBattleDialogue:  'CMD_TRIASSIC_3',
  postBattleDialogue: 'CMD_TRIASSIC_2',
  winDialogue:        "You've grown weaker — or I've grown stronger. Either way, Team Extinction wins!",
  loseDialogue:       "Again?! Director Clade will hear nothing of this. Nothing!",
  reward:             2400,
  party: [
    {
      speciesId: 'SOLARIX',
      level:     32,
      moves:     ['FIRE_BLAST', 'SOLAR_BEAM', 'FLAME_CHARGE', 'SUNNY_DAY'],
    },
    {
      speciesId: 'DUSKFANG',
      level:     33,
      moves:     ['CRUNCH', 'SHADOW_CLAW', 'NIGHT_SLASH', 'SCARY_FACE'],
    },
    {
      speciesId: 'PACKDINO',
      level:     32,
      moves:     ['BITE', 'HOWL', 'TAKE_DOWN', 'WORK_UP'],
    },
  ],
  aiTier:   2,
  location: 'ROUTE_8',
};

DG.TRAINERS.CMD_JURASSIC = {
  id:                 'CMD_JURASSIC',
  name:               'Commander Jurassic',
  class:              'Team Extinction Commander',
  isGymLeader:        false,
  isStoryBoss:        true,
  badge:              null,
  preBattleDialogue:  'CMD_JURASSIC_1',
  postBattleDialogue: 'CMD_JURASSIC_2',
  winDialogue:        "History is mine to curate — and you are a footnote.",
  loseDialogue:       "These exhibits... these fossils... Director Clade still has what he needs. Don't think you've won.",
  reward:             3600,
  party: [
    {
      speciesId: 'VINOSAUR',
      level:     38,
      moves:     ['VINE_WHIP', 'POWER_WHIP', 'SLUDGE_BOMB', 'GROWTH'],
    },
    {
      speciesId: 'CANOPYREX',
      level:     40,
      moves:     ['LEAF_STORM', 'CRUNCH', 'BODY_SLAM', 'SOLAR_BEAM'],
    },
    {
      speciesId: 'TERRADON',
      level:     38,
      moves:     ['EARTHQUAKE', 'STONE_EDGE', 'IRON_TAIL', 'SANDSTORM'],
    },
  ],
  aiTier:   3,
  location: 'STONEHAVEN',
};

DG.TRAINERS.CMD_CRETACEOUS = {
  id:                 'CMD_CRETACEOUS',
  name:               'Commander Cretaceous',
  class:              'Team Extinction Commander',
  isGymLeader:        false,
  isStoryBoss:        true,
  badge:              null,
  preBattleDialogue:  'CMD_CRETACEOUS_1',
  postBattleDialogue: 'CMD_CRETACEOUS_2',
  winDialogue:        "The bog has claimed another. Wander these mists forever.",
  loseDialogue:       "The fog... failed me. Director Clade is already at the Core. Hurry if you dare.",
  reward:             4400,
  party: [
    {
      speciesId: 'OBSIDIUDON',
      level:     48,
      moves:     ['SHADOW_BALL', 'DARK_PULSE', 'ANCIENT_POWER', 'IRON_DEFENSE'],
    },
    {
      speciesId: 'SCORCHBACK',
      level:     49,
      moves:     ['FLAMETHROWER', 'IRON_TAIL', 'FIRE_SPIN', 'DRAGON_RAGE'],
    },
    {
      speciesId: 'PHANTOSAUR',
      level:     48,
      moves:     ['SHADOW_CLAW', 'HEX', 'WILL_O_WISP', 'CONFUSE_RAY'],
    },
  ],
  aiTier:   3,
  location: 'BOGMIRE',
};

DG.TRAINERS.DIRECTOR_CLADE = {
  id:                 'DIRECTOR_CLADE',
  name:               'Director Clade',
  class:              'Team Extinction Director',
  isGymLeader:        false,
  isStoryBoss:        true,
  badge:              null,
  preBattleDialogue:  'DIRECTOR_CLADE_1',
  postBattleDialogue: 'DIRECTOR_CLADE_DEFEAT',
  winDialogue:        "The timeline is corrected. Sixty-six million years of error, undone.",
  loseDialogue:       "You... you cannot stop evolution itself. But perhaps... you ARE evolution.",
  reward:             10000,
  party: [
    {
      speciesId: 'VERDANTHORN',
      level:     70,
      moves:     ['JADE_PLATE_SLAM', 'SOLAR_BEAM', 'STONE_EDGE', 'SYNTHESIS'],
    },
    {
      speciesId: 'TOXICARNO',
      level:     72,
      moves:     ['SLUDGE_WAVE', 'PSYCHIC_MOVE', 'VENOM_EARTH', 'EARTHQUAKE'],
    },
    {
      speciesId: 'SKYFANG',
      level:     74,
      moves:     ['DRACO_METEOR', 'MIND_DIVE', 'DRAGON_CLAW', 'PSYCHIC_MOVE'],
    },
    {
      speciesId: 'OBSIDIUDON',
      level:     75,
      moves:     ['OUTRAGE', 'DARK_PULSE', 'DRAGON_DANCE', 'SHADOW_BALL'],
    },
    {
      speciesId: 'CRATERON',
      level:     76,
      moves:     ['ERUPTION_HORN', 'EXTINCTION_BEAM', 'DRAGON_PULSE', 'OVERHEAT'],
    },
  ],
  aiTier:   3,
  location: 'MT_CRETACEOUS',
};

// ============================================================
// TEAM EXTINCTION HIDEOUT (grunts + admin) — under Crestfall
// ============================================================
DG.TRAINERS.TE_GRUNT_1 = {
  id:'TE_GRUNT_1', name:'Grunt', class:'Team Extinction Grunt',
  isGymLeader:false, isStoryBoss:false, badge:null,
  winDialogue:"Team Extinction doesn't lose to kids!",
  loseDialogue:"Tch! You got past me, but the others won't go so easy.",
  reward:1480,
  party:[
    { speciesId:'SHADOWLET', level:36, moves:['SHADOW_BALL','NIGHT_SHADE','LICK','CONFUSE_RAY'] },
    { speciesId:'DUSKFANG',  level:37, moves:['CRUNCH','SHADOW_CLAW','NIGHT_SLASH','SCARY_FACE'] },
  ],
  aiTier:2, location:'TE_HIDEOUT_1',
};
DG.TRAINERS.TE_GRUNT_2 = {
  id:'TE_GRUNT_2', name:'Grunt', class:'Team Extinction Grunt',
  isGymLeader:false, isStoryBoss:false, badge:null,
  winDialogue:"Stay out of our excavation!",
  loseDialogue:"You think a fossil dig is your business? Get lost!",
  reward:1520,
  party:[
    { speciesId:'EMBRIX',   level:37, moves:['EMBER','TACKLE','SMOKESCREEN','FLAME_CHARGE'] },
    { speciesId:'PACKDINO', level:37, moves:['BITE','HOWL','TAKE_DOWN','WORK_UP'] },
  ],
  aiTier:2, location:'TE_HIDEOUT_1',
};
DG.TRAINERS.TE_GRUNT_3 = {
  id:'TE_GRUNT_3', name:'Grunt', class:'Team Extinction Grunt',
  isGymLeader:false, isStoryBoss:false, badge:null,
  winDialogue:"The Permian Core will end you all anyway!",
  loseDialogue:"How are you this strong?! Director Clade should hear of you.",
  reward:1560,
  party:[
    { speciesId:'SHADOWLET', level:37, moves:['SHADOW_BALL','NIGHT_SHADE','LICK','CONFUSE_RAY'] },
    { speciesId:'PACKDINO',  level:38, moves:['BITE','HOWL','TAKE_DOWN','WORK_UP'] },
    { speciesId:'DUSKFANG',  level:38, moves:['CRUNCH','SHADOW_CLAW','NIGHT_SLASH','SCARY_FACE'] },
  ],
  aiTier:2, location:'TE_HIDEOUT_2',
};
DG.TRAINERS.TE_GRUNT_4 = {
  id:'TE_GRUNT_4', name:'Grunt', class:'Team Extinction Grunt',
  isGymLeader:false, isStoryBoss:false, badge:null,
  winDialogue:"The specimen stays in its cage. Forever.",
  loseDialogue:"No! The cage... don't you dare free it!",
  reward:1600,
  party:[
    { speciesId:'SOLARIX',  level:38, moves:['FIRE_BLAST','SOLAR_BEAM','FLAME_CHARGE','SUNNY_DAY'] },
    { speciesId:'DUSKFANG', level:39, moves:['CRUNCH','SHADOW_CLAW','NIGHT_SLASH','SCARY_FACE'] },
  ],
  aiTier:2, location:'TE_HIDEOUT_2',
};
DG.TRAINERS.CMD_DEVONIAN = {
  id:'CMD_DEVONIAN', name:'Commander Devonian', class:'Team Extinction Commander',
  isGymLeader:false, isStoryBoss:true, badge:null,
  preBattleDialogue:'CMD_DEVONIAN_1', postBattleDialogue:'CMD_DEVONIAN_2',
  winDialogue:"This dig site is ours. Crawl back to the surface, child.",
  loseDialogue:"Impossible... the deepest fossils answered to ME. Take the beast, then — it's already too late for the world.",
  reward:5200,
  party:[
    { speciesId:'SOLARIX',    level:40, moves:['FIRE_BLAST','SOLAR_BEAM','FLAME_CHARGE','SUNNY_DAY'] },
    { speciesId:'PACKDINO',   level:40, moves:['BITE','HOWL','TAKE_DOWN','WORK_UP'] },
    { speciesId:'DUSKFANG',   level:41, moves:['CRUNCH','SHADOW_CLAW','NIGHT_SLASH','SCARY_FACE'] },
    { speciesId:'OBSIDIUDON', level:42, moves:['SHADOW_BALL','DARK_PULSE','ANCIENT_POWER','IRON_DEFENSE'] },
  ],
  aiTier:3, location:'TE_HIDEOUT_2',
};

// ============================================================
// ROUTE TRAINERS (20)
// ============================================================

DG.TRAINERS.YOUNGSTER_JAKE = {
  id:                 'YOUNGSTER_JAKE',
  name:               'Jake',
  class:              'Youngster',
  isGymLeader:        false,
  isStoryBoss:        false,
  badge:              null,
  preBattleDialogue:  null,
  postBattleDialogue: null,
  winDialogue:        "Haha, my DinoMons are the strongest on Route 1!",
  loseDialogue:       "Aw man... I need to train more. Way more.",
  reward:             100,
  party: [
    {
      speciesId: 'NORMLET',
      level:     5,
      moves:     ['TACKLE', 'GROWL', 'QUICK_ATTACK', 'TAIL_WHIP'],
    },
    {
      speciesId: 'QUAKELING',
      level:     6,
      moves:     ['MUD_SLAP', 'TACKLE', 'GROWL', 'MAGNITUDE'],
    },
  ],
  aiTier:   1,
  location: 'ROUTE_1',
};

DG.TRAINERS.LASS_MINA = {
  id:                 'LASS_MINA',
  name:               'Mina',
  class:              'Lass',
  isGymLeader:        false,
  isStoryBoss:        false,
  badge:              null,
  preBattleDialogue:  null,
  postBattleDialogue: null,
  winDialogue:        "Don't underestimate cute DinoMons — they bite!",
  loseDialogue:       "Oh, you're really good! My DinoMons need more love, I think.",
  reward:             100,
  party: [
    {
      speciesId: 'LEAFCUB',
      level:     5,
      moves:     ['VINE_WHIP', 'GROWL', 'RAZOR_LEAF', 'SYNTHESIS'],
    },
    {
      // FASE 8: was een lv 6 FAIRYWING — een soort die in het wild pas rond
      // lv 23-26 voorkomt. Vervangen door een Route 1-soort.
      speciesId: 'SPARKLET',
      level:     6,
      moves:     ['THUNDER_SHOCK', 'GROWL', 'QUICK_ATTACK', 'CHARM'],
    },
  ],
  aiTier:   1,
  location: 'ROUTE_1',
};


DG.TRAINERS.HIKER_STONE = {
  id:                 'HIKER_STONE',
  name:               'Stone',
  class:              'Hiker',
  isGymLeader:        false,
  isStoryBoss:        false,
  badge:              null,
  preBattleDialogue:  null,
  postBattleDialogue: null,
  winDialogue:        "These mountains are my home. My DinoMons are as tough as the rock!",
  loseDialogue:       "Solid battling, kid. Solid as granite.",
  reward:             200,
  party: [
    {
      speciesId: 'BONEBACK',
      level:     10,
      moves:     ['ROCK_THROW', 'TACKLE', 'HARDEN', 'BONE_RUSH'],
    },
    {
      speciesId: 'ROCKLETT',
      level:     10,
      moves:     ['ROCK_THROW', 'HARDEN', 'SMACK_DOWN', 'ROLLOUT'],
    },
  ],
  aiTier:   1,
  location: 'ROUTE_2',
};












DG.TRAINERS.RANGER_DEX = {
  id:                 'RANGER_DEX',
  name:               'Dex',
  class:              'Ranger',
  isGymLeader:        false,
  isStoryBoss:        false,
  badge:              null,
  preBattleDialogue:  null,
  postBattleDialogue: null,
  winDialogue:        "The glacial wilds are unforgiving. So am I.",
  loseDialogue:       "The ice didn't stop you. Respect that kind of toughness.",
  reward:             1400,
  party: [
    {
      speciesId: 'FROSTLING',
      level:     44,
      moves:     ['ICY_WIND', 'ICE_SHARD', 'AURORA_BEAM', 'POWDER_SNOW'],
    },
    {
      speciesId: 'BLIZZHORN',
      level:     45,
      moves:     ['BLIZZARD', 'ICE_BEAM', 'HORN_ATTACK', 'SNOWSCAPE'],
    },
    {
      speciesId: 'ICECAP',
      level:     44,
      moves:     ['ICE_BEAM', 'AURORA_VEIL', 'HAIL', 'FREEZE_DRY'],
    },
  ],
  aiTier:   3,
  location: 'ROUTE_9',
};

DG.TRAINERS.PSYCHIC_VEIL = {
  id:                 'PSYCHIC_VEIL',
  name:               'Veil',
  class:              'Psychic',
  isGymLeader:        false,
  isStoryBoss:        false,
  badge:              null,
  preBattleDialogue:  null,
  postBattleDialogue: null,
  winDialogue:        "The veil between worlds is thin here. My DinoMons walk both sides.",
  loseDialogue:       "You see through the veil too. Extraordinary.",
  reward:             1500,
  party: [
    {
      speciesId: 'SPIRITHORN',
      level:     46,
      moves:     ['PSYCHIC', 'SHADOW_BALL', 'CALM_MIND', 'MOONBLAST'],
    },
    {
      speciesId: 'MIASMARK',
      level:     47,
      moves:     ['SLUDGE_BOMB', 'PSYCHIC', 'HEX', 'TOXIC'],
    },
  ],
  aiTier:   3,
  location: 'ROUTE_9',
};

DG.TRAINERS.SNOWBOARDER_KAI = {
  id:                 'SNOWBOARDER_KAI',
  name:               'Kai',
  class:              'Snowboarder',
  isGymLeader:        false,
  isStoryBoss:        false,
  badge:              null,
  preBattleDialogue:  null,
  postBattleDialogue: null,
  winDialogue:        "Shredding the slopes AND the competition — that's the Kai way!",
  loseDialogue:       "Okay okay, you're better than me. Just... don't tell anyone on the mountain.",
  reward:             1700,
  party: [
    {
      speciesId: 'BLIZZFANG',
      level:     50,
      moves:     ['BLIZZARD', 'ICE_FANG', 'ICE_BEAM', 'AGILITY'],
    },
    {
      speciesId: 'GLACIOKING',
      level:     52,
      moves:     ['BLIZZARD', 'GLACIER_CRASH', 'ICY_WIND', 'IRON_DEFENSE'],
    },
  ],
  aiTier:   3,
  location: 'ROUTE_10',
};

DG.TRAINERS.MOUNTAINEER_ZOLA = {
  id:                 'MOUNTAINEER_ZOLA',
  name:               'Zola',
  class:              'Mountaineer',
  isGymLeader:        false,
  isStoryBoss:        false,
  badge:              null,
  preBattleDialogue:  null,
  postBattleDialogue: null,
  winDialogue:        "Every peak I climb has tested me. You're no different.",
  loseDialogue:       "You climbed higher than I expected. The summit is within your reach.",
  reward:             1800,
  party: [
    {
      speciesId: 'TITANOSAUR',
      level:     52,
      moves:     ['EARTHQUAKE', 'HEAVY_SLAM', 'ROCK_SLIDE', 'SUPERPOWER'],
    },
    {
      speciesId: 'MEGASTONE',
      level:     53,
      moves:     ['STONE_EDGE', 'ROCK_POLISH', 'IRON_DEFENSE', 'ANCIENT_POWER'],
    },
  ],
  aiTier:   3,
  location: 'ROUTE_10',
};

DG.TRAINERS.ELITE_RIVAL = {
  id:                 'ELITE_RIVAL',
  name:               'Rex',
  class:              'Rival',
  isGymLeader:        false,
  isStoryBoss:        true,
  badge:              null,
  preBattleDialogue:  'RIVAL_INTRO',
  postBattleDialogue: null,
  winDialogue:        "I knew it! I'm still one step ahead of you. Train harder!",
  loseDialogue:       "You beat me! I'm not mad — I'm fired up. Let's both see this through to the end!",
  reward:             2000,
  party: [
    {
      speciesId:  'PYROCERATH',
      level:      55,
      moves:      ['FLAMETHROWER', 'DRAGON_CLAW', 'BODY_SLAM', 'ANCIENT_POWER'],
    },
    {
      speciesId: 'SKYFANG',
      level:     52,
      moves:     ['DRAGON_CLAW', 'AIR_SLASH', 'AERIAL_ACE', 'AGILITY'],
    },
    {
      speciesId: 'TERRADON',
      level:     53,
      moves:     ['EARTHQUAKE', 'STONE_EDGE', 'IRON_TAIL', 'BULLDOZE'],
    },
    {
      speciesId: 'SOLARIX',
      level:     54,
      moves:     ['FIRE_BLAST', 'SOLAR_BEAM', 'FLAME_CHARGE', 'SUNNY_DAY'],
    },
  ],
  aiTier:   3,
  location: 'ROUTE_10',
};

// ============================================================
// THEMED ROUTE TRAINERS — matching upcoming gym type
// ============================================================

// ── Route 2 → Gym 2 Ridley (Rock) ──────────────────────────
DG.TRAINERS.HIKER_BRETT = {
  id:                 'HIKER_BRETT',
  name:               'Brett',
  class:              'Hiker',
  isGymLeader:        false,
  isStoryBoss:        false,
  badge:              null,
  preBattleDialogue:  null,
  postBattleDialogue: null,
  winDialogue:        "Rocky terrain is MY terrain. Nobody gets past these cliffs!",
  loseDialogue:       "You're solid as stone yourself. Fair enough.",
  reward:             200,
  party: [
    { speciesId:'BONEBACK',  level:10, moves:['ROCK_THROW','TACKLE','HARDEN','BONE_RUSH'] },
    { speciesId:'ROCKFLIP',  level:11, moves:['ROCK_THROW','HARDEN','ROLLOUT','SMACK_DOWN'] },
  ],
  aiTier:   1,
  location: 'ROUTE_2',
};

// ── Route 3 → Gym 3 Ignis (Fire) ──────────────────────────
DG.TRAINERS.FIREBREATHER_BLAZE = {
  id:                 'FIREBREATHER_BLAZE',
  name:               'Blaze',
  class:              'Firebreather',
  isGymLeader:        false,
  isStoryBoss:        false,
  badge:              null,
  preBattleDialogue:  null,
  postBattleDialogue: null,
  winDialogue:        "FIRE! That's all there is on Route 3. You'll get burned!",
  loseDialogue:       "You doused my flames. Don't get too comfortable — the gym is still ahead.",
  reward:             380,
  party: [
    { speciesId:'EMBRIX',   level:13, moves:['EMBER','FLAME_CHARGE','SMOKESCREEN','SCRATCH'] },
    { speciesId:'FIRECOAL', level:14, moves:['EMBER','FLAME_CHARGE','SCRATCH','GROWL'] },
  ],
  aiTier:   1,
  location: 'ROUTE_3',
};

DG.TRAINERS.HIKER_THORN = {
  id:                 'HIKER_THORN',
  name:               'Thorn',
  class:              'Hiker',
  isGymLeader:        false,
  isStoryBoss:        false,
  badge:              null,
  preBattleDialogue:  null,
  postBattleDialogue: null,
  winDialogue:        "These volcanic ridges breed tough DinoMons. Try mine on for size!",
  loseDialogue:       "You've got heat in you too, kid. Ignis won't go easy though.",
  reward:             400,
  party: [
    { speciesId:'FIRECOAL', level:13, moves:['EMBER','SCRATCH','FLAME_CHARGE','GROWL'] },
    { speciesId:'SANDCLAW', level:14, moves:['SCRATCH','SAND_ATTACK','SLASH','MUD_SLAP'] },
  ],
  aiTier:   2,
  location: 'ROUTE_3',
};

// ── Route 4 → Gym 4 Sylva (Grass) ─────────────────────────
DG.TRAINERS.RANGER_SYLVAN = {
  id:                 'RANGER_SYLVAN',
  name:               'Sylvan',
  class:              'Ranger',
  isGymLeader:        false,
  isStoryBoss:        false,
  badge:              null,
  preBattleDialogue:  null,
  postBattleDialogue: null,
  winDialogue:        "The forest speaks to me — and right now it says YOU lose!",
  loseDialogue:       "The trees are pleased with you. Don't trample Sylva's garden though.",
  reward:             520,
  party: [
    { speciesId:'FRONDLET', level:19, moves:['VINE_WHIP','RAZOR_LEAF','STUN_SPORE','SYNTHESIS'] },
    { speciesId:'LEAFCUB',  level:20, moves:['VINE_WHIP','RAZOR_LEAF','GROWTH','GROWL'] },
  ],
  aiTier:   2,
  location: 'ROUTE_4',
};

DG.TRAINERS.CAMPER_IVY = {
  id:                 'CAMPER_IVY',
  name:               'Ivy',
  class:              'Camper',
  isGymLeader:        false,
  isStoryBoss:        false,
  badge:              null,
  preBattleDialogue:  null,
  postBattleDialogue: null,
  winDialogue:        "I've been living in these woods for weeks — my DinoMons know every leaf!",
  loseDialogue:       "Okay, okay. The canopy crown goes to you today.",
  reward:             480,
  party: [
    { speciesId:'BUGLING',  level:19, moves:['BUG_BITE','FURY_CUTTER','AGILITY','STRING_SHOT'] },
    { speciesId:'LEAFAWN',  level:20, moves:['RAZOR_LEAF','VINE_WHIP','SYNTHESIS','GROWL'] },
  ],
  aiTier:   2,
  location: 'ROUTE_4',
};

// ── Route 5 → Gym 5 Terra (Ground) ────────────────────────
DG.TRAINERS.HIKER_DUSTY = {
  id:                 'HIKER_DUSTY',
  name:               'Dusty',
  class:              'Hiker',
  isGymLeader:        false,
  isStoryBoss:        false,
  badge:              null,
  preBattleDialogue:  null,
  postBattleDialogue: null,
  winDialogue:        "You can't cross these badlands without going through me and my ground-types!",
  loseDialogue:       "You shook me up like an earthquake. Terra's going to love you.",
  reward:             680,
  party: [
    { speciesId:'QUAKELING', level:26, moves:['BULLDOZE','MAGNITUDE','MUD_SLAP','GROWL'] },
    { speciesId:'SANDCLAW',  level:27, moves:['SCRATCH','SAND_ATTACK','DIG','MUD_SLAP'] },
  ],
  aiTier:   2,
  location: 'ROUTE_5',
};

DG.TRAINERS.ROUGHNECK_STONE = {
  id:                 'ROUGHNECK_STONE',
  name:               'Stone',
  class:              'Roughneck',
  isGymLeader:        false,
  isStoryBoss:        false,
  badge:              null,
  preBattleDialogue:  null,
  postBattleDialogue: null,
  winDialogue:        "Ground types hit HARD. You're going nowhere fast.",
  loseDialogue:       "The earth shook under your feet — and mine. Not bad at all.",
  reward:             720,
  party: [
    { speciesId:'DIGCLAW',  level:27, moves:['DIG','SLASH','MUD_SLAP','EARTHQUAKE'] },
    { speciesId:'TERRADON', level:29, moves:['BULLDOZE','STONE_EDGE','SAND_ATTACK','MAGNITUDE'] },
  ],
  aiTier:   2,
  location: 'ROUTE_5',
};

// ── Route 6 → Gym 6 Volt (Electric) ───────────────────────
DG.TRAINERS.ELECTRICIAN_SPARK = {
  id:                 'ELECTRICIAN_SPARK',
  name:               'Spark',
  class:              'Electrician',
  isGymLeader:        false,
  isStoryBoss:        false,
  badge:              null,
  preBattleDialogue:  null,
  postBattleDialogue: null,
  winDialogue:        "My DinoMons are fully charged. You don't stand a volt of a chance!",
  loseDialogue:       "You short-circuited my whole strategy. Volt's not going to be easier.",
  reward:             980,
  party: [
    { speciesId:'SPARKHORN',  level:36, moves:['THUNDER_SHOCK','SPARK','CHARGE','QUICK_ATTACK'] },
    { speciesId:'VOLTSCALE',  level:37, moves:['THUNDERBOLT','SPARK','AGILITY','DRAGON_RAGE'] },
  ],
  aiTier:   2,
  location: 'ROUTE_6',
};

DG.TRAINERS.ROCKER_BOLT = {
  id:                 'ROCKER_BOLT',
  name:               'Bolt',
  class:              'Rocker',
  isGymLeader:        false,
  isStoryBoss:        false,
  badge:              null,
  preBattleDialogue:  null,
  postBattleDialogue: null,
  winDialogue:        "LIGHTNING doesn't ask permission! Neither do I!",
  loseDialogue:       "Struck out. Keep the energy going into the gym.",
  reward:             1020,
  party: [
    { speciesId:'STORMWING',  level:36, moves:['THUNDERBOLT','WING_ATTACK','SPARK','THUNDER_WAVE'] },
    { speciesId:'SPARKHORN',  level:37, moves:['THUNDERBOLT','THUNDER_WAVE','CHARGE','QUICK_ATTACK'] },
  ],
  aiTier:   3,
  location: 'ROUTE_6',
};

// ── Route 7 → Gym 7 Marina (Water) ────────────────────────
DG.TRAINERS.SWIMMER_WAVE = {
  id:                 'SWIMMER_WAVE',
  name:               'Wave',
  class:              'Swimmer',
  isGymLeader:        false,
  isStoryBoss:        false,
  badge:              null,
  preBattleDialogue:  null,
  postBattleDialogue: null,
  winDialogue:        "The current's with me today. You're swimming upstream, trainer!",
  loseDialogue:       "You ride the wave better than me. Marina's even stronger though.",
  reward:             1100,
  party: [
    { speciesId:'AQUAFLIP', level:39, moves:['WATER_GUN','AQUA_JET','BUBBLE_BEAM','AGILITY'] },
    { speciesId:'SEAFANG',  level:40, moves:['SURF','BITE','AQUA_JET','WATER_PULSE'] },
  ],
  aiTier:   2,
  location: 'ROUTE_7',
};

DG.TRAINERS.FISHERMAN_TIDE = {
  id:                 'FISHERMAN_TIDE',
  name:               'Tide',
  class:              'Fisherman',
  isGymLeader:        false,
  isStoryBoss:        false,
  badge:              null,
  preBattleDialogue:  null,
  postBattleDialogue: null,
  winDialogue:        "Every DinoMon I've got came from these murky waters. They're hungrier than they look.",
  loseDialogue:       "Reel it in — you win. But the tide always turns.",
  reward:             1150,
  party: [
    { speciesId:'MUDFIN',   level:40, moves:['MUDDY_WATER','WATER_GUN','MUD_SHOT','BUBBLE_BEAM'] },
    { speciesId:'MARSHFIN', level:41, moves:['WATER_PULSE','MUDDY_WATER','POISON_JAB','WATER_GUN'] },
  ],
  aiTier:   3,
  location: 'ROUTE_7',
};

// ── Route 10 → Gym 8 Valdez (Dragon) ──────────────────────
DG.TRAINERS.DRAGONTAMER_ROOK = {
  id:                 'DRAGONTAMER_ROOK',
  name:               'Rook',
  class:              'Dragon Tamer',
  isGymLeader:        false,
  isStoryBoss:        false,
  badge:              null,
  preBattleDialogue:  null,
  postBattleDialogue: null,
  winDialogue:        "Only the worthy stand before dragons. Let's see if that's you.",
  loseDialogue:       "A true dragon soul. Valdez awaits — do not disappoint the ancient ones.",
  reward:             1800,
  party: [
    { speciesId:'SWOOPTER',  level:55, moves:['DRAGON_CLAW','AIR_SLASH','DRAGON_DANCE','ROOST'] },
    { speciesId:'DARKSCALE', level:56, moves:['DRAGON_RAGE','BITE','NIGHT_SLASH','AGILITY'] },
  ],
  aiTier:   3,
  location: 'ROUTE_10',
};

DG.TRAINERS.EXPLORER_VANCE = {
  id:                 'EXPLORER_VANCE',
  name:               'Vance',
  class:              'Explorer',
  isGymLeader:        false,
  isStoryBoss:        false,
  badge:              null,
  preBattleDialogue:  null,
  postBattleDialogue: null,
  winDialogue:        "I've crossed every mountain range on this archipelago. You're just another peak.",
  loseDialogue:       "Extraordinary. The Summit Gym holds the final challenge — claim it.",
  reward:             1900,
  party: [
    { speciesId:'GLIDEREX',  level:56, moves:['DRAGON_CLAW','AERIAL_ACE','DIVE_BOMB','AGILITY'] },
    { speciesId:'SOARWING',  level:57, moves:['WING_ATTACK','DRAGON_RAGE','GUST','AERIAL_ACE'] },
  ],
  aiTier:   3,
  location: 'ROUTE_10',
};

// ============================================================
// GYM TRAINERS (generated gyms 3-8)
// ============================================================


// ============================================================
// GYM TRAINERS (Shellcreek & Dustwall hand-coded gyms)
// ============================================================













// ============================================================
// ELITE FOUR (4 trainers before Champion)
// ============================================================

DG.TRAINERS.ELITE_AURORA = {
  id:                 'ELITE_AURORA',
  name:               'Aurora',
  title:              'Elite Four',
  class:              'Elite Four',
  isGymLeader:        false,
  isStoryBoss:        false,
  badge:              null,
  preBattleDialogue:  ['The waters of time run deep... and cold. Can you survive their current?'],
  postBattleDialogue: ['Remarkable. The currents bend for you. Proceed.'],
  winDialogue:        'The tides swallowed you. Return when you are truly ready.',
  loseDialogue:       'The current bends to your will. I yield.',
  reward:             5000,
  party: [
    { speciesId: 'CRYOPHIN',    level: 60, moves: ['SURF', 'ICE_SHARD', 'AQUA_JET', 'CONFUSION'] },
    { speciesId: 'GLACIOHORN',  level: 62, moves: ['ICE_BEAM', 'SURF', 'PSYCHIC_MOVE', 'CRYSTAL_BEAM'] },
    { speciesId: 'PERMAFROST',  level: 64, moves: ['BLIZZARD', 'HYDRO_PUMP', 'PSYCHIC_MOVE', 'GLACIAL_MIND'] },
  ],
  aiTier: 3,
  location: 'FOSSIL_CITADEL',
};

DG.TRAINERS.ELITE_EMBER = {
  id:                 'ELITE_EMBER',
  name:               'Ember',
  title:              'Elite Four',
  class:              'Elite Four',
  isGymLeader:        false,
  isStoryBoss:        false,
  badge:              null,
  preBattleDialogue:  ['You carry the heat of determination. But my flames burn hotter!'],
  postBattleDialogue: ['The inferno bows to you. Forge onward.'],
  winDialogue:        'Your fire flickered out. Reignite it and return.',
  loseDialogue:       'Your flame surpassed mine. A rare day indeed.',
  reward:             6000,
  party: [
    { speciesId: 'SCORCHBACK',  level: 62, moves: ['FLAMETHROWER', 'ROCK_SLIDE', 'FIRE_BLAST', 'SAIL_BLAST'] },
    { speciesId: 'PYROCERATH',  level: 64, moves: ['FLAMETHROWER', 'DRAGON_CLAW', 'ERUPTION_HORN', 'OVERHEAT'] },
    { speciesId: 'LAVACLAW',    level: 66, moves: ['FIRE_BLAST', 'EARTHQUAKE', 'FLAMETHROWER', 'SUNNY_DAY'] },
  ],
  aiTier: 3,
  location: 'FOSSIL_CITADEL',
};

DG.TRAINERS.ELITE_GARNET = {
  id:                 'ELITE_GARNET',
  name:               'Garnet',
  title:              'Elite Four',
  class:              'Elite Four',
  isGymLeader:        false,
  isStoryBoss:        false,
  badge:              null,
  preBattleDialogue:  ['The earth has stood for eons. Your strength must prove worthy of its weight.'],
  postBattleDialogue: ['The bedrock yields. Something worth admiring. Move on.'],
  winDialogue:        'The ground held firm against you. Dig deeper.',
  loseDialogue:       'Even stone must yield to the right force. Impressive.',
  reward:             7000,
  party: [
    { speciesId: 'TERRADON',    level: 64, moves: ['EARTHQUAKE', 'STONE_EDGE', 'CLUB_SMASH', 'STEALTH_ROCK'] },
    { speciesId: 'OSSIFANG',    level: 66, moves: ['SKULL_SLAM', 'EARTHQUAKE', 'STONE_EDGE', 'IRON_DEFENSE'] },
    { speciesId: 'MEGASTONE',   level: 68, moves: ['STONE_EDGE', 'EARTHQUAKE', 'ROCK_SLIDE', 'ANCIENT_POWER'] },
  ],
  aiTier: 3,
  location: 'FOSSIL_CITADEL',
};

DG.TRAINERS.ELITE_PHANTOM = {
  id:                 'ELITE_PHANTOM',
  name:               'Phantom',
  title:              'Elite Four',
  class:              'Elite Four',
  isGymLeader:        false,
  isStoryBoss:        false,
  badge:              null,
  preBattleDialogue:  ['Beyond this veil lies the Champion. But first... face your shadow.'],
  postBattleDialogue: ['You see through illusion. The Champion awaits — if you dare.'],
  winDialogue:        'The shadow consumed you. Come back when you can face the dark.',
  loseDialogue:       'The veil parts for you alone. Go. Face the Champion.',
  reward:             8000,
  party: [
    { speciesId: 'NIGHTREX',    level: 66, moves: ['CRUNCH', 'DARK_PULSE', 'NIGHT_SLASH', 'CLOSE_COMBAT'] },
    { speciesId: 'PHANTOSAUR',  level: 68, moves: ['SHADOW_CLAW', 'DRAGON_PULSE', 'PHANTOM_FORCE', 'HEX'] },
    { speciesId: 'OBSIDIUDON',  level: 70, moves: ['SHADOW_BALL', 'DARK_PULSE', 'DRAGON_DANCE', 'OUTRAGE'] },
  ],
  aiTier: 3,
  location: 'FOSSIL_CITADEL',
};

// ============================================================
// WORLD CHAMPION — Grand Archon Corvus
// ============================================================

DG.TRAINERS.GRAND_ARCHON_CORVUS = {
  id:                 'GRAND_ARCHON_CORVUS',
  name:               'Grand Archon Corvus',
  class:              'Champion',
  isGymLeader:        false,
  isChampion:         true,
  badge:              null,
  preBattleDialogue:  'GRAND_ARCHON_PRE',
  postBattleDialogue: 'GRAND_ARCHON_POST',
  winDialogue:        'GRAND_ARCHON_WIN',
  prize:              10000,
  spriteKey:          'NPC_LEADER',
  party: [
    { speciesId: 'SKYFANG',      level: 62, moves: ['DRAGON_PULSE','AERIAL_ACE','DRAGON_CLAW','PSYCHIC'] },
    { speciesId: 'TITANOSAUR',   level: 64, moves: ['IRON_HEAD','BODY_SLAM','EARTHQUAKE','IRON_DEFENSE'] },
    { speciesId: 'OBSIDIUDON',   level: 64, moves: ['SHADOW_BALL','CRUNCH','DRAGON_PULSE','DARK_PULSE'] },
    { speciesId: 'PYROCERATH',   level: 66, moves: ['FLAMETHROWER','DRAGON_CLAW','FLARE_BLITZ','CRUNCH'] },
    { speciesId: 'GLACIODON',    level: 66, moves: ['SURF','PSYCHIC','ICE_BEAM','BLIZZARD'] },
    { speciesId: 'CRATERON',     level: 70, moves: ['FLAMETHROWER','DRAGON_CLAW','CRUNCH','FIRE_BLAST'] },
  ],
  aiTier:   3,
  location: 'FOSSIL_CITADEL',
};

// ============================================================
// ROUTE 1A TRAINERS (Normal/Ground, lv 5–8)
// ============================================================



// ============================================================
// ROUTE 1B TRAINERS (lv 7–10)
// ============================================================



// ============================================================
// ROUTE 2A TRAINERS (lv 11–14)
// ============================================================



// ============================================================
// ROUTE 2B TRAINERS (lv 13–17)
// ============================================================



// ============================================================
// TEAM EXTINCTION COMMANDERS (cutscene bosses)
// ============================================================

DG.TRAINERS.COMMANDER_TRIASSIC = {
  id: 'COMMANDER_TRIASSIC', name: 'Cmd. Triassic', sprite: 'NPC_GRUNT',
  isGymLeader: false, gymId: null,
  greeting: 'Team Extinction will prevail!',
  loseDialogue: "You have potential... but this isn't over.",
  party: [
    { speciesId:'BONEBACK', level:18, moves:['ROCK_THROW','TACKLE','STONE_EDGE','ANCIENT_POWER'] },
    { speciesId:'SANDCLAW', level:20, moves:['EARTHQUAKE','TACKLE','DIG','SANDSTORM'] },
  ]
};

DG.TRAINERS.COMMANDER_JURASSIC = {
  id: 'COMMANDER_JURASSIC', name: 'Cmd. Jurassic', sprite: 'NPC_GRUNT',
  isGymLeader: false, gymId: null,
  greeting: 'The Permian Core grows ever stronger!',
  loseDialogue: 'Impossible! Defeated by a child!',
  party: [
    { speciesId:'FRONDLET',  level:36, moves:['SOLAR_BEAM','VINE_WHIP','GIGA_DRAIN','STUN_SPORE'] },
    { speciesId:'SWOOPTER',  level:38, moves:['AIR_SLASH','DRAGON_CLAW','TACKLE','WING_ATTACK'] },
    { speciesId:'IRONSCALE', level:40, moves:['IRON_HEAD','FLASH_CANNON','IRON_DEFENSE','TACKLE'] },
  ]
};

DG.TRAINERS.COMMANDER_CRETACEOUS = {
  id: 'COMMANDER_CRETACEOUS', name: 'Cmd. Cretaceous', sprite: 'NPC_GRUNT',
  isGymLeader: false, gymId: null,
  greeting: 'Halt! None shall pass to Mt. Cretaceous!',
  loseDialogue: 'The Director... will hear of this!',
  party: [
    { speciesId:'TOXICARNO',  level:50, moves:['SLUDGE_BOMB','VENOM_EARTH','TOXIC','PSYCHIC_MOVE'] },
    { speciesId:'OBSIDIUDON', level:52, moves:['DARK_PULSE','NIGHT_SLASH','CRUNCH','DRAGON_RAGE'] },
    { speciesId:'BLIZZHORN',  level:54, moves:['BLIZZARD','ICE_BEAM','FREEZE_DRY','ANCIENT_POWER'] },
  ]
};

// ============================================================
// FLINT — RIVAL (5 encounters × 3 starter variants)
// ============================================================

// ── Encounter 1 (Lv 5 — just a starter) ──────────────────────

DG.TRAINERS.RIVAL_1_FIRE = {
  id: 'RIVAL_1_FIRE', name: 'Flint', class: 'Rival',
  isGymLeader: false, isStoryBoss: true, badge: null,
  preMon: 'FLINT',
  preBattleDialogue:  'RIVAL_PRE_1',
  postBattleDialogue: 'RIVAL_POST_1_WIN',
  winDialogue:  "FLINT: 'See? That\\'s the difference between us. Remember that.'",
  loseDialogue: "FLINT: '...Beginner\\'s luck. Enjoy it while it lasts.'",
  reward: 200, aiTier: 1,
  party: [{ speciesId:'LEAFAWN', level:5 }],
};

DG.TRAINERS.RIVAL_1_GRASS = {
  id: 'RIVAL_1_GRASS', name: 'Flint', class: 'Rival',
  isGymLeader: false, isStoryBoss: true, badge: null,
  preMon: 'FLINT',
  preBattleDialogue:  'RIVAL_PRE_1',
  postBattleDialogue: 'RIVAL_POST_1_WIN',
  winDialogue:  "FLINT: 'See? That\\'s the difference between us. Remember that.'",
  loseDialogue: "FLINT: '...Beginner\\'s luck. Enjoy it while it lasts.'",
  reward: 200, aiTier: 1,
  party: [{ speciesId:'AQUEEL', level:5 }],
};

DG.TRAINERS.RIVAL_1_WATER = {
  id: 'RIVAL_1_WATER', name: 'Flint', class: 'Rival',
  isGymLeader: false, isStoryBoss: true, badge: null,
  preMon: 'FLINT',
  preBattleDialogue:  'RIVAL_PRE_1',
  postBattleDialogue: 'RIVAL_POST_1_WIN',
  winDialogue:  "FLINT: 'See? That\\'s the difference between us. Remember that.'",
  loseDialogue: "FLINT: '...Beginner\\'s luck. Enjoy it while it lasts.'",
  reward: 200, aiTier: 1,
  party: [{ speciesId:'TINDREL', level:5 }],
};

// ── Encounter 2 (Lv 22 — 3 DinoMons) ────────────────────────

DG.TRAINERS.RIVAL_2_FIRE = {
  id: 'RIVAL_2_FIRE', name: 'Flint', class: 'Rival',
  isGymLeader: false, isStoryBoss: true, badge: null,
  preMon: 'FLINT',
  preBattleDialogue:  'RIVAL_PRE_2',
  postBattleDialogue: 'RIVAL_POST_2_WIN',
  winDialogue:  "FLINT: 'Keep pushing. I need you to actually be worth beating someday.'",
  loseDialogue: "FLINT: '...You\\'ve gotten stronger. I\\'ll admit that much. Don\\'t let it go to your head.'",
  reward: 800, aiTier: 2,
  party: [
    { speciesId:'LEAFAWN',  level:22 },
    { speciesId:'SANDCLAW', level:19 },
    { speciesId:'PTRYX',    level:18 },
  ],
};

DG.TRAINERS.RIVAL_2_GRASS = {
  id: 'RIVAL_2_GRASS', name: 'Flint', class: 'Rival',
  isGymLeader: false, isStoryBoss: true, badge: null,
  preMon: 'FLINT',
  preBattleDialogue:  'RIVAL_PRE_2',
  postBattleDialogue: 'RIVAL_POST_2_WIN',
  winDialogue:  "FLINT: 'Keep pushing. I need you to actually be worth beating someday.'",
  loseDialogue: "FLINT: '...You\\'ve gotten stronger. I\\'ll admit that much. Don\\'t let it go to your head.'",
  reward: 800, aiTier: 2,
  party: [
    { speciesId:'AQUEEL',   level:22 },
    { speciesId:'SANDCLAW', level:19 },
    { speciesId:'PTRYX',    level:18 },
  ],
};

DG.TRAINERS.RIVAL_2_WATER = {
  id: 'RIVAL_2_WATER', name: 'Flint', class: 'Rival',
  isGymLeader: false, isStoryBoss: true, badge: null,
  preMon: 'FLINT',
  preBattleDialogue:  'RIVAL_PRE_2',
  postBattleDialogue: 'RIVAL_POST_2_WIN',
  winDialogue:  "FLINT: 'Keep pushing. I need you to actually be worth beating someday.'",
  loseDialogue: "FLINT: '...You\\'ve gotten stronger. I\\'ll admit that much. Don\\'t let it go to your head.'",
  reward: 800, aiTier: 2,
  party: [
    { speciesId:'TINDREL',  level:22 },
    { speciesId:'SANDCLAW', level:19 },
    { speciesId:'PTRYX',    level:18 },
  ],
};

// ── Encounter 3 (Lv 30 — 4 DinoMons, starter evolved) ────────

DG.TRAINERS.RIVAL_3_FIRE = {
  id: 'RIVAL_3_FIRE', name: 'Flint', class: 'Rival',
  isGymLeader: false, isStoryBoss: true, badge: null,
  preMon: 'FLINT',
  preBattleDialogue:  'RIVAL_PRE_3',
  postBattleDialogue: 'RIVAL_POST_3_WIN',
  winDialogue:  "FLINT: 'Good. Stay strong. We\\'ve both got bigger problems than each other right now.'",
  loseDialogue: "FLINT: 'Fine. You win. But I\\'m not done — not by a long shot.'",
  reward: 1400, aiTier: 2,
  party: [
    { speciesId:'FERNASAUR', level:30 },
    { speciesId:'BONEBACK',  level:27 },
    { speciesId:'PTRYX',     level:26 },
    { speciesId:'NORMLET',   level:25 },
  ],
};

DG.TRAINERS.RIVAL_3_GRASS = {
  id: 'RIVAL_3_GRASS', name: 'Flint', class: 'Rival',
  isGymLeader: false, isStoryBoss: true, badge: null,
  preMon: 'FLINT',
  preBattleDialogue:  'RIVAL_PRE_3',
  postBattleDialogue: 'RIVAL_POST_3_WIN',
  winDialogue:  "FLINT: 'Good. Stay strong. We\\'ve both got bigger problems than each other right now.'",
  loseDialogue: "FLINT: 'Fine. You win. But I\\'m not done — not by a long shot.'",
  reward: 1400, aiTier: 2,
  party: [
    { speciesId:'PLESIWAVE', level:30 },
    { speciesId:'BONEBACK',  level:27 },
    { speciesId:'PTRYX',     level:26 },
    { speciesId:'NORMLET',   level:25 },
  ],
};

DG.TRAINERS.RIVAL_3_WATER = {
  id: 'RIVAL_3_WATER', name: 'Flint', class: 'Rival',
  isGymLeader: false, isStoryBoss: true, badge: null,
  preMon: 'FLINT',
  preBattleDialogue:  'RIVAL_PRE_3',
  postBattleDialogue: 'RIVAL_POST_3_WIN',
  winDialogue:  "FLINT: 'Good. Stay strong. We\\'ve both got bigger problems than each other right now.'",
  loseDialogue: "FLINT: 'Fine. You win. But I\\'m not done — not by a long shot.'",
  reward: 1400, aiTier: 2,
  party: [
    { speciesId:'TINDRAK',   level:30 },
    { speciesId:'BONEBACK',  level:27 },
    { speciesId:'PTRYX',     level:26 },
    { speciesId:'NORMLET',   level:25 },
  ],
};

// ── Encounter 4 (Lv 42 — 5 DinoMons, starter fully evolved) ──

DG.TRAINERS.RIVAL_4_FIRE = {
  id: 'RIVAL_4_FIRE', name: 'Flint', class: 'Rival',
  isGymLeader: false, isStoryBoss: true, badge: null,
  preMon: 'FLINT',
  preBattleDialogue:  'RIVAL_PRE_4',
  postBattleDialogue: 'RIVAL_POST_4_WIN',
  winDialogue:  "FLINT: 'Good. You\\'re going to need every bit of that.'",
  loseDialogue: "FLINT: '...Go. Stop them. I\\'ll catch up.'",
  reward: 2400, aiTier: 3,
  party: [
    { speciesId:'VERDANTHORN', level:42 },
    { speciesId:'OSSIFANG',    level:40 },
    { speciesId:'SWOOPTER',    level:39 },
    { speciesId:'MIDDODON',    level:38 },
    { speciesId:'SPARKHORN',   level:37 },
  ],
};

DG.TRAINERS.RIVAL_4_GRASS = {
  id: 'RIVAL_4_GRASS', name: 'Flint', class: 'Rival',
  isGymLeader: false, isStoryBoss: true, badge: null,
  preMon: 'FLINT',
  preBattleDialogue:  'RIVAL_PRE_4',
  postBattleDialogue: 'RIVAL_POST_4_WIN',
  winDialogue:  "FLINT: 'Good. You\\'re going to need every bit of that.'",
  loseDialogue: "FLINT: '...Go. Stop them. I\\'ll catch up.'",
  reward: 2400, aiTier: 3,
  party: [
    { speciesId:'TIDANOSAURUS', level:42 },
    { speciesId:'OSSIFANG',     level:40 },
    { speciesId:'SWOOPTER',     level:39 },
    { speciesId:'MIDDODON',     level:38 },
    { speciesId:'SPARKHORN',    level:37 },
  ],
};

DG.TRAINERS.RIVAL_4_WATER = {
  id: 'RIVAL_4_WATER', name: 'Flint', class: 'Rival',
  isGymLeader: false, isStoryBoss: true, badge: null,
  preMon: 'FLINT',
  preBattleDialogue:  'RIVAL_PRE_4',
  postBattleDialogue: 'RIVAL_POST_4_WIN',
  winDialogue:  "FLINT: 'Good. You\\'re going to need every bit of that.'",
  loseDialogue: "FLINT: '...Go. Stop them. I\\'ll catch up.'",
  reward: 2400, aiTier: 3,
  party: [
    { speciesId:'PYROCERATH', level:42 },
    { speciesId:'OSSIFANG',   level:40 },
    { speciesId:'SWOOPTER',   level:39 },
    { speciesId:'MIDDODON',   level:38 },
    { speciesId:'SPARKHORN',  level:37 },
  ],
};

// ── Encounter 5 (Lv 55 — full team of 6) ─────────────────────

DG.TRAINERS.RIVAL_5_FIRE = {
  id: 'RIVAL_5_FIRE', name: 'Flint', class: 'Rival',
  isGymLeader: false, isStoryBoss: true, badge: null,
  preMon: 'FLINT',
  preBattleDialogue:  'RIVAL_PRE_5',
  postBattleDialogue: 'RIVAL_POST_5_WIN',
  winDialogue:  "FLINT: 'Get up. Get stronger. And go end this.'",
  loseDialogue: "FLINT: '...Go finish this. I\\'ll be right behind you.'",
  reward: 3600, aiTier: 3,
  party: [
    { speciesId:'VERDANTHORN', level:55 },
    { speciesId:'SKYFANG',     level:53 },
    { speciesId:'TERRADON',    level:52 },
    { speciesId:'OSSIFANG',    level:51 },
    { speciesId:'THUNDERSAUR', level:50 },
    { speciesId:'SHADOWLET',   level:49 },
  ],
};

DG.TRAINERS.RIVAL_5_GRASS = {
  id: 'RIVAL_5_GRASS', name: 'Flint', class: 'Rival',
  isGymLeader: false, isStoryBoss: true, badge: null,
  preMon: 'FLINT',
  preBattleDialogue:  'RIVAL_PRE_5',
  postBattleDialogue: 'RIVAL_POST_5_WIN',
  winDialogue:  "FLINT: 'Get up. Get stronger. And go end this.'",
  loseDialogue: "FLINT: '...Go finish this. I\\'ll be right behind you.'",
  reward: 3600, aiTier: 3,
  party: [
    { speciesId:'TIDANOSAURUS', level:55 },
    { speciesId:'SKYFANG',      level:53 },
    { speciesId:'TERRADON',     level:52 },
    { speciesId:'OSSIFANG',     level:51 },
    { speciesId:'THUNDERSAUR',  level:50 },
    { speciesId:'SHADOWLET',    level:49 },
  ],
};

DG.TRAINERS.RIVAL_5_WATER = {
  id: 'RIVAL_5_WATER', name: 'Flint', class: 'Rival',
  isGymLeader: false, isStoryBoss: true, badge: null,
  preMon: 'FLINT',
  preBattleDialogue:  'RIVAL_PRE_5',
  postBattleDialogue: 'RIVAL_POST_5_WIN',
  winDialogue:  "FLINT: 'Get up. Get stronger. And go end this.'",
  loseDialogue: "FLINT: '...Go finish this. I\\'ll be right behind you.'",
  reward: 3600, aiTier: 3,
  party: [
    { speciesId:'PYROCERATH',  level:55 },
    { speciesId:'SKYFANG',     level:53 },
    { speciesId:'TERRADON',    level:52 },
    { speciesId:'OSSIFANG',    level:51 },
    { speciesId:'THUNDERSAUR', level:50 },
    { speciesId:'SHADOWLET',   level:49 },
  ],
};

// ── Double Battle: Flint + Commander Cretaceous ──────────────
// Flint brings 2 mons (lead + Swoopter), Cretaceous brings 2 mons
DG.TRAINERS.RIVAL_4_DOUBLE_FIRE = {
  id:'RIVAL_4_DOUBLE_FIRE', name:'Flint', class:'Team Extinction',
  isStoryBoss:true, aiTier:2,
  party:[
    { speciesId:'VERDANTHORN', level:38 },
    { speciesId:'SWOOPTER',    level:36 },
  ],
};
DG.TRAINERS.RIVAL_4_DOUBLE_GRASS = {
  id:'RIVAL_4_DOUBLE_GRASS', name:'Flint', class:'Team Extinction',
  isStoryBoss:true, aiTier:2,
  party:[
    { speciesId:'TIDANOSAURUS', level:38 },
    { speciesId:'SWOOPTER',     level:36 },
  ],
};
DG.TRAINERS.RIVAL_4_DOUBLE_WATER = {
  id:'RIVAL_4_DOUBLE_WATER', name:'Flint', class:'Team Extinction',
  isStoryBoss:true, aiTier:2,
  party:[
    { speciesId:'PYROCERATH', level:38 },
    { speciesId:'SWOOPTER',   level:36 },
  ],
};
DG.TRAINERS.CMD_CRETACEOUS_DOUBLE = {
  id:'CMD_CRETACEOUS_DOUBLE', name:'Cretaceous', class:'Team Extinction',
  isStoryBoss:true, aiTier:3,
  party:[
    { speciesId:'DARKSCALE',  level:40 },
    { speciesId:'TOXICARNO',  level:38 },
  ],
};
DG.TRAINERS.MORAX_ALLY = {
  id:'MORAX_ALLY', name:'Morax', class:'Gym Leader',
  aiTier:2,
  party:[
    { speciesId:'TOXICARNO',  level:44 },
    { speciesId:'GLACIOHORN', level:42 },
  ],
};

// ============================================================
// GYM WRONG-PATH TRAINERS (puzzle mechanic - 2 per gym)
// ============================================================

















// ══════════════════════════════════════════════════════════════════════
// GYM QUIZ-PATH TRAINERS  (72 total — 9 per gym × 8 gyms)
// Naming: [GID]_S[N]_TC = correct-path trainer; TW1/TW2 = wrong-path
// ══════════════════════════════════════════════════════════════════════

// ── GYM 1 · REX · Normal-type · Shellcreek ───────────────────────────
DG.TRAINERS.REX_S1_TC = {
  id:'REX_S1_TC', name:'Youngster Cole', class:'Youngster', isGymLeader:false, badge:null,
  loseDialogue:"You really know your Normal-types!", reward:128,
  party:[{ speciesId:'NORMLET', level:8, moves:['TACKLE','GROWL','BODY_SLAM'] }],
  aiTier:1, location:'SHELLCREEK_GYM',
};
DG.TRAINERS.REX_S1_TW1 = {
  id:'REX_S1_TW1', name:'Lass Pippa', class:'Lass', isGymLeader:false, badge:null,
  loseDialogue:"I knew the wrong path was risky!", reward:128,
  party:[{ speciesId:'NORMLET', level:8, moves:['TACKLE','GROWL'] }],
  aiTier:1, location:'SHELLCREEK_GYM',
};
DG.TRAINERS.REX_S1_TW2 = {
  id:'REX_S1_TW2', name:'Breeder Nat', class:'Breeder', isGymLeader:false, badge:null,
  loseDialogue:"You chose wrong but battled right!", reward:144,
  party:[{ speciesId:'PACKDINO', level:9, moves:['TACKLE','GROWL','HEADBUTT'] }],
  aiTier:1, location:'SHELLCREEK_GYM',
};

DG.TRAINERS.REX_S2_TC = {
  id:'REX_S2_TC', name:'Youngster Drew', class:'Youngster', isGymLeader:false, badge:null,
  loseDialogue:"The shortcut wasn't so short after all!", reward:160,
  party:[{ speciesId:'PACKDINO', level:10, moves:['TACKLE','HEADBUTT','GROWL'] }],
  aiTier:1, location:'SHELLCREEK_GYM',
};
DG.TRAINERS.REX_S2_TW1 = {
  id:'REX_S2_TW1', name:'Lass Bonnie', class:'Lass', isGymLeader:false, badge:null,
  loseDialogue:"Two trainers for one mistake — fair enough!", reward:160,
  party:[{ speciesId:'NORMLET', level:10, moves:['TACKLE','GROWL','BODY_SLAM'] }],
  aiTier:1, location:'SHELLCREEK_GYM',
};
DG.TRAINERS.REX_S2_TW2 = {
  id:'REX_S2_TW2', name:'Breeder Lola', class:'Breeder', isGymLeader:false, badge:null,
  loseDialogue:"The long road builds character!", reward:176,
  party:[{ speciesId:'PACKDINO', level:11, moves:['TACKLE','HEADBUTT','BODY_SLAM'] }],
  aiTier:1, location:'SHELLCREEK_GYM',
};

DG.TRAINERS.REX_S3_TC = {
  id:'REX_S3_TC', name:'Ace Trainer Kira', class:'Ace Trainer', isGymLeader:false, badge:null,
  loseDialogue:"The leader is even tougher. Good luck!", reward:240,
  party:[
    { speciesId:'PACKDINO', level:12, moves:['TACKLE','HEADBUTT','BODY_SLAM'] },
    { speciesId:'NORMLET',  level:12, moves:['TACKLE','GROWL','BODY_SLAM'] },
  ],
  aiTier:2, location:'SHELLCREEK_GYM',
};
DG.TRAINERS.REX_S3_TW1 = {
  id:'REX_S3_TW1', name:'Roughneck Gil', class:'Roughneck', isGymLeader:false, badge:null,
  loseDialogue:"Wrong answer, tough battle — respect.", reward:192,
  party:[{ speciesId:'PACKDINO', level:12, moves:['TACKLE','HEADBUTT','GROWL'] }],
  aiTier:1, location:'SHELLCREEK_GYM',
};
DG.TRAINERS.REX_S3_TW2 = {
  id:'REX_S3_TW2', name:'Youngster Max', class:'Youngster', isGymLeader:false, badge:null,
  loseDialogue:"Next time pick the right answer!", reward:208,
  party:[{ speciesId:'HERDSAUR', level:13, moves:['BODY_SLAM','HEADBUTT','TACKLE','GROWL'] }],
  aiTier:1, location:'SHELLCREEK_GYM',
};

// ── GYM 2 · RIDLEY · Rock-type · Dustwall ────────────────────────────
DG.TRAINERS.RIDLEY_S1_TC = {
  id:'RIDLEY_S1_TC', name:'Hiker Nate', class:'Hiker', isGymLeader:false, badge:null,
  loseDialogue:"Solid knowledge, solid trainer!", reward:240,
  party:[{ speciesId:'BONEBACK', level:15, moves:['TACKLE','ROCK_THROW','GROWL'] }],
  aiTier:1, location:'DUSTWALL_GYM',
};
DG.TRAINERS.RIDLEY_S1_TW1 = {
  id:'RIDLEY_S1_TW1', name:'Geologist Fred', class:'Geologist', isGymLeader:false, badge:null,
  loseDialogue:"Wrong path, right attitude!", reward:240,
  party:[{ speciesId:'BONEBACK', level:15, moves:['TACKLE','ROCK_THROW'] }],
  aiTier:1, location:'DUSTWALL_GYM',
};
DG.TRAINERS.RIDLEY_S1_TW2 = {
  id:'RIDLEY_S1_TW2', name:'Hiker Crag', class:'Hiker', isGymLeader:false, badge:null,
  loseDialogue:"The rocks weren't your friend today either!", reward:256,
  party:[{ speciesId:'BONEBACK', level:16, moves:['ROCK_THROW','TACKLE','ANCIENT_POWER'] }],
  aiTier:1, location:'DUSTWALL_GYM',
};

DG.TRAINERS.RIDLEY_S2_TC = {
  id:'RIDLEY_S2_TC', name:'Rock Climber Tess', class:'Rock Climber', isGymLeader:false, badge:null,
  loseDialogue:"Impressive! You've got real rock knowledge.", reward:272,
  party:[
    { speciesId:'BONEBACK',   level:17, moves:['ROCK_THROW','TACKLE','GROWL'] },
    { speciesId:'STONESKULL', level:17, moves:['ROCK_THROW','ANCIENT_POWER','TACKLE'] },
  ],
  aiTier:2, location:'DUSTWALL_GYM',
};
DG.TRAINERS.RIDLEY_S2_TW1 = {
  id:'RIDLEY_S2_TW1', name:'Hiker Bern', class:'Hiker', isGymLeader:false, badge:null,
  loseDialogue:"Two trainers on the hard road — you earned this.", reward:272,
  party:[{ speciesId:'STONESKULL', level:17, moves:['ROCK_THROW','TACKLE','ANCIENT_POWER'] }],
  aiTier:1, location:'DUSTWALL_GYM',
};
DG.TRAINERS.RIDLEY_S2_TW2 = {
  id:'RIDLEY_S2_TW2', name:'Geologist Petra', class:'Geologist', isGymLeader:false, badge:null,
  loseDialogue:"This detour made you stronger!", reward:288,
  party:[
    { speciesId:'BONEBACK', level:18, moves:['ROCK_THROW','ANCIENT_POWER','TACKLE'] },
    { speciesId:'BONEBACK', level:18, moves:['ROCK_THROW','TACKLE','GROWL'] },
  ],
  aiTier:1, location:'DUSTWALL_GYM',
};

DG.TRAINERS.RIDLEY_S3_TC = {
  id:'RIDLEY_S3_TC', name:'Ace Trainer Gareth', class:'Ace Trainer', isGymLeader:false, badge:null,
  loseDialogue:"The leader uses Ossifang — be ready!", reward:380,
  party:[
    { speciesId:'STONESKULL', level:19, moves:['ROCK_THROW','ROCK_SLIDE','ANCIENT_POWER'] },
    { speciesId:'BONEBACK',   level:19, moves:['ROCK_THROW','TACKLE','ANCIENT_POWER'] },
  ],
  aiTier:2, location:'DUSTWALL_GYM',
};
DG.TRAINERS.RIDLEY_S3_TW1 = {
  id:'RIDLEY_S3_TW1', name:'Rock Climber Vince', class:'Rock Climber', isGymLeader:false, badge:null,
  loseDialogue:"You battled through, hard path or not!", reward:304,
  party:[{ speciesId:'STONESKULL', level:19, moves:['ROCK_THROW','ROCK_SLIDE','TACKLE'] }],
  aiTier:1, location:'DUSTWALL_GYM',
};
DG.TRAINERS.RIDLEY_S3_TW2 = {
  id:'RIDLEY_S3_TW2', name:'Hiker Clint', class:'Hiker', isGymLeader:false, badge:null,
  loseDialogue:"The wrong road still leads forward!", reward:320,
  party:[{ speciesId:'OSSIFANG', level:20, moves:['ROCK_SLIDE','ANCIENT_POWER','TACKLE','GROWL'] }],
  aiTier:2, location:'DUSTWALL_GYM',
};

// ── GYM 3 · IGNIS · Fire-type · Pyreside ─────────────────────────────
DG.TRAINERS.IGNIS_S1_TC = {
  id:'IGNIS_S1_TC', name:'Firebreather Blix', class:'Firebreather', isGymLeader:false, badge:null,
  loseDialogue:"Hot answer, hotter battle!", reward:368,
  party:[{ speciesId:'EMBRIX', level:23, moves:['EMBER','TACKLE','FIRE_SPIN'] }],
  aiTier:1, location:'PYRESIDE_GYM',
};
DG.TRAINERS.IGNIS_S1_TW1 = {
  id:'IGNIS_S1_TW1', name:'Firebreather Ashe', class:'Firebreather', isGymLeader:false, badge:null,
  loseDialogue:"Scorched on the wrong path!", reward:368,
  party:[{ speciesId:'EMBRIX', level:23, moves:['EMBER','TACKLE'] }],
  aiTier:1, location:'PYRESIDE_GYM',
};
DG.TRAINERS.IGNIS_S1_TW2 = {
  id:'IGNIS_S1_TW2', name:'Cyclist Rex', class:'Cyclist', isGymLeader:false, badge:null,
  loseDialogue:"Two trainers, twice the heat!", reward:384,
  party:[{ speciesId:'EMBRIX', level:24, moves:['EMBER','FIRE_SPIN','TACKLE'] }],
  aiTier:1, location:'PYRESIDE_GYM',
};

DG.TRAINERS.IGNIS_S2_TC = {
  id:'IGNIS_S2_TC', name:'Ace Trainer Flare', class:'Ace Trainer', isGymLeader:false, badge:null,
  loseDialogue:"Knowledge and power — you've got both!", reward:400,
  party:[
    { speciesId:'EMBRIX',  level:25, moves:['EMBER','FIRE_SPIN','TACKLE'] },
    { speciesId:'SOLARIX', level:25, moves:['EMBER','FLAMETHROWER','ANCIENT_POWER'] },
  ],
  aiTier:2, location:'PYRESIDE_GYM',
};
DG.TRAINERS.IGNIS_S2_TW1 = {
  id:'IGNIS_S2_TW1', name:'Firebreather Char', class:'Firebreather', isGymLeader:false, badge:null,
  loseDialogue:"The wrong path burned you, but you pushed through!", reward:400,
  party:[{ speciesId:'SOLARIX', level:25, moves:['EMBER','FLAMETHROWER','ANCIENT_POWER'] }],
  aiTier:1, location:'PYRESIDE_GYM',
};
DG.TRAINERS.IGNIS_S2_TW2 = {
  id:'IGNIS_S2_TW2', name:'Firebreather Sear', class:'Firebreather', isGymLeader:false, badge:null,
  loseDialogue:"Twice the fire — still not enough!", reward:416,
  party:[
    { speciesId:'EMBRIX', level:26, moves:['EMBER','FIRE_SPIN','FLAMETHROWER'] },
    { speciesId:'EMBRIX', level:26, moves:['EMBER','TACKLE','FIRE_SPIN'] },
  ],
  aiTier:1, location:'PYRESIDE_GYM',
};

DG.TRAINERS.IGNIS_S3_TC = {
  id:'IGNIS_S3_TC', name:'Ace Trainer Vesta', class:'Ace Trainer', isGymLeader:false, badge:null,
  loseDialogue:"Ignis uses Scorchback — keep your cool!", reward:560,
  party:[
    { speciesId:'SOLARIX', level:27, moves:['FLAMETHROWER','ANCIENT_POWER','EMBER'] },
    { speciesId:'EMBRIX',  level:27, moves:['EMBER','FIRE_SPIN','FLAMETHROWER'] },
  ],
  aiTier:2, location:'PYRESIDE_GYM',
};
DG.TRAINERS.IGNIS_S3_TW1 = {
  id:'IGNIS_S3_TW1', name:'Cyclist Blaze', class:'Cyclist', isGymLeader:false, badge:null,
  loseDialogue:"You're hotter than the wrong path!", reward:448,
  party:[{ speciesId:'SOLARIX', level:27, moves:['FLAMETHROWER','EMBER','ANCIENT_POWER'] }],
  aiTier:1, location:'PYRESIDE_GYM',
};
DG.TRAINERS.IGNIS_S3_TW2 = {
  id:'IGNIS_S3_TW2', name:'Firebreather Magma', class:'Firebreather', isGymLeader:false, badge:null,
  loseDialogue:"Scorchback up ahead — you'll need that win!", reward:464,
  party:[{ speciesId:'SCORCHBACK', level:28, moves:['FLAMETHROWER','FIRE_SPIN','ANCIENT_POWER','TACKLE'] }],
  aiTier:2, location:'PYRESIDE_GYM',
};

// ── GYM 4 · SYLVA · Grass-type · Ferngrove ───────────────────────────
DG.TRAINERS.SYLVA_S1_TC = {
  id:'SYLVA_S1_TC', name:'Ranger Fern', class:'Ranger', isGymLeader:false, badge:null,
  loseDialogue:"Knew your Grass-types — well played!", reward:448,
  party:[{ speciesId:'FRONDLET', level:28, moves:['VINE_WHIP','TACKLE','GROWL'] }],
  aiTier:1, location:'FERNGROVE_GYM',
};
DG.TRAINERS.SYLVA_S1_TW1 = {
  id:'SYLVA_S1_TW1', name:'Camper Ivy', class:'Camper', isGymLeader:false, badge:null,
  loseDialogue:"The thorny path caught you out!", reward:448,
  party:[{ speciesId:'LEAFAWN', level:28, moves:['VINE_WHIP','TACKLE'] }],
  aiTier:1, location:'FERNGROVE_GYM',
};
DG.TRAINERS.SYLVA_S1_TW2 = {
  id:'SYLVA_S1_TW2', name:'Ranger Bud', class:'Ranger', isGymLeader:false, badge:null,
  loseDialogue:"Two trainers on the vine side — ouch!", reward:464,
  party:[{ speciesId:'FRONDLET', level:29, moves:['VINE_WHIP','TACKLE','PETAL_DANCE'] }],
  aiTier:1, location:'FERNGROVE_GYM',
};

DG.TRAINERS.SYLVA_S2_TC = {
  id:'SYLVA_S2_TC', name:'Ace Trainer Flora', class:'Ace Trainer', isGymLeader:false, badge:null,
  loseDialogue:"Nature favoured you today!", reward:480,
  party:[{ speciesId:'VINOSAUR', level:30, moves:['VINE_WHIP','EARTHQUAKE','TACKLE'] }],
  aiTier:2, location:'FERNGROVE_GYM',
};
DG.TRAINERS.SYLVA_S2_TW1 = {
  id:'SYLVA_S2_TW1', name:'Camper Blossom', class:'Camper', isGymLeader:false, badge:null,
  loseDialogue:"Overgrown path, under-prepared challenger!", reward:480,
  party:[
    { speciesId:'FRONDLET', level:30, moves:['VINE_WHIP','TACKLE','GROWL'] },
    { speciesId:'LEAFAWN',  level:30, moves:['VINE_WHIP','TACKLE','GROWL'] },
  ],
  aiTier:1, location:'FERNGROVE_GYM',
};
DG.TRAINERS.SYLVA_S2_TW2 = {
  id:'SYLVA_S2_TW2', name:'Ranger Thistle', class:'Ranger', isGymLeader:false, badge:null,
  loseDialogue:"The forest tests all who wander wrong!", reward:496,
  party:[
    { speciesId:'LEAFCUB', level:31, moves:['VINE_WHIP','TACKLE','PETAL_DANCE'] },
    { speciesId:'FRONDLET',level:31, moves:['VINE_WHIP','TACKLE','GROWL'] },
  ],
  aiTier:1, location:'FERNGROVE_GYM',
};

DG.TRAINERS.SYLVA_S3_TC = {
  id:'SYLVA_S3_TC', name:'Ace Trainer Sprout', class:'Ace Trainer', isGymLeader:false, badge:null,
  loseDialogue:"Sylva favours strategic Grass-types — stay sharp!", reward:640,
  party:[
    { speciesId:'VINOSAUR',  level:32, moves:['VINE_WHIP','EARTHQUAKE','SOLAR_BEAM'] },
    { speciesId:'FERNASAUR', level:32, moves:['VINE_WHIP','SOLAR_BEAM','TACKLE'] },
  ],
  aiTier:2, location:'FERNGROVE_GYM',
};
DG.TRAINERS.SYLVA_S3_TW1 = {
  id:'SYLVA_S3_TW1', name:'Camper Petal', class:'Camper', isGymLeader:false, badge:null,
  loseDialogue:"The thorny route made you tougher!", reward:512,
  party:[{ speciesId:'SPRIGDON', level:32, moves:['VINE_WHIP','TACKLE','LOW_KICK','PETAL_DANCE'] }],
  aiTier:2, location:'FERNGROVE_GYM',
};
DG.TRAINERS.SYLVA_S3_TW2 = {
  id:'SYLVA_S3_TW2', name:'Ranger Canopy', class:'Ranger', isGymLeader:false, badge:null,
  loseDialogue:"Sprigdon packs a punch — Sylva even more!", reward:528,
  party:[
    { speciesId:'LEAFCUB',  level:33, moves:['VINE_WHIP','TACKLE','PETAL_DANCE'] },
    { speciesId:'SPRIGDON', level:33, moves:['VINE_WHIP','LOW_KICK','TACKLE'] },
  ],
  aiTier:2, location:'FERNGROVE_GYM',
};

// ── GYM 5 · TERRA · Ground-type · Stonehaven ─────────────────────────
DG.TRAINERS.TERRA_S1_TC = {
  id:'TERRA_S1_TC', name:'Hiker Dustin', class:'Hiker', isGymLeader:false, badge:null,
  loseDialogue:"You know your Ground-types cold!", reward:560,
  party:[{ speciesId:'QUAKELING', level:35, moves:['BULLDOZE','TACKLE','MUD_SHOT'] }],
  aiTier:1, location:'STONEHAVEN_GYM',
};
DG.TRAINERS.TERRA_S1_TW1 = {
  id:'TERRA_S1_TW1', name:'Excavator Dax', class:'Excavator', isGymLeader:false, badge:null,
  loseDialogue:"Dug the wrong tunnel — story of my life!", reward:560,
  party:[{ speciesId:'DIGCLAW', level:35, moves:['BULLDOZE','SCRATCH','MUD_SHOT'] }],
  aiTier:1, location:'STONEHAVEN_GYM',
};
DG.TRAINERS.TERRA_S1_TW2 = {
  id:'TERRA_S1_TW2', name:'Hiker Gravel', class:'Hiker', isGymLeader:false, badge:null,
  loseDialogue:"The hard road has two sentinels!", reward:576,
  party:[{ speciesId:'SANDCLAW', level:36, moves:['BULLDOZE','TACKLE','MUD_SHOT'] }],
  aiTier:1, location:'STONEHAVEN_GYM',
};

DG.TRAINERS.TERRA_S2_TC = {
  id:'TERRA_S2_TC', name:'Ace Trainer Terra', class:'Ace Trainer', isGymLeader:false, badge:null,
  loseDialogue:"The earth shook — and you stood firm!", reward:592,
  party:[{ speciesId:'MIDDODON', level:37, moves:['BULLDOZE','EARTHQUAKE','MUD_SHOT','ANCIENT_POWER'] }],
  aiTier:2, location:'STONEHAVEN_GYM',
};
DG.TRAINERS.TERRA_S2_TW1 = {
  id:'TERRA_S2_TW1', name:'Excavator Burrow', class:'Excavator', isGymLeader:false, badge:null,
  loseDialogue:"Twice the digging, twice the defeat!", reward:592,
  party:[
    { speciesId:'QUAKELING', level:37, moves:['BULLDOZE','TACKLE','MUD_SHOT'] },
    { speciesId:'SANDCLAW',  level:37, moves:['BULLDOZE','TACKLE','MUD_SHOT'] },
  ],
  aiTier:1, location:'STONEHAVEN_GYM',
};
DG.TRAINERS.TERRA_S2_TW2 = {
  id:'TERRA_S2_TW2', name:'Hiker Cleft', class:'Hiker', isGymLeader:false, badge:null,
  loseDialogue:"Even detours end eventually!", reward:608,
  party:[
    { speciesId:'DESERTFANG', level:38, moves:['BULLDOZE','BITE','MUD_SHOT'] },
    { speciesId:'DIGCLAW',    level:38, moves:['BULLDOZE','SCRATCH','MUD_SHOT'] },
  ],
  aiTier:1, location:'STONEHAVEN_GYM',
};

DG.TRAINERS.TERRA_S3_TC = {
  id:'TERRA_S3_TC', name:'Ace Trainer Strata', class:'Ace Trainer', isGymLeader:false, badge:null,
  loseDialogue:"Terra's Terradon hits like a rockslide!", reward:800,
  party:[
    { speciesId:'MIDDODON', level:40, moves:['EARTHQUAKE','MUD_SHOT','BULLDOZE','ANCIENT_POWER'] },
    { speciesId:'TERRADON', level:40, moves:['EARTHQUAKE','ROCK_SLIDE','MUD_SHOT','BULLDOZE'] },
  ],
  aiTier:2, location:'STONEHAVEN_GYM',
};
DG.TRAINERS.TERRA_S3_TW1 = {
  id:'TERRA_S3_TW1', name:'Excavator Vein', class:'Excavator', isGymLeader:false, badge:null,
  loseDialogue:"You burrowed through the hard path!", reward:640,
  party:[{ speciesId:'TERRADON', level:40, moves:['EARTHQUAKE','MUD_SHOT','ROCK_SLIDE','BULLDOZE'] }],
  aiTier:2, location:'STONEHAVEN_GYM',
};
DG.TRAINERS.TERRA_S3_TW2 = {
  id:'TERRA_S3_TW2', name:'Hiker Rockwall', class:'Hiker', isGymLeader:false, badge:null,
  loseDialogue:"The long route toughened you up!", reward:656,
  party:[
    { speciesId:'DESERTFANG', level:41, moves:['BULLDOZE','CRUNCH','BITE','MUD_SHOT'] },
    { speciesId:'MIDDODON',   level:41, moves:['EARTHQUAKE','MUD_SHOT','BULLDOZE'] },
  ],
  aiTier:2, location:'STONEHAVEN_GYM',
};

// ── GYM 6 · VOLT · Electric-type · Crestfall ─────────────────────────
DG.TRAINERS.VOLT_S1_TC = {
  id:'VOLT_S1_TC', name:'Electrician Zap', class:'Electrician', isGymLeader:false, badge:null,
  loseDialogue:"Shocking knowledge you've got!", reward:608,
  party:[{ speciesId:'SPARKHORN', level:38, moves:['THUNDERBOLT','TACKLE','GROWL'] }],
  aiTier:1, location:'CRESTFALL_GYM',
};
DG.TRAINERS.VOLT_S1_TW1 = {
  id:'VOLT_S1_TW1', name:'Rocker Bolt', class:'Rocker', isGymLeader:false, badge:null,
  loseDialogue:"Wrong wire, right fighter!", reward:608,
  party:[{ speciesId:'SPARKLET', level:38, moves:['THUNDERBOLT','TACKLE'] }],
  aiTier:1, location:'CRESTFALL_GYM',
};
DG.TRAINERS.VOLT_S1_TW2 = {
  id:'VOLT_S1_TW2', name:'Electrician Surge', class:'Electrician', isGymLeader:false, badge:null,
  loseDialogue:"Two sparks for one wrong answer!", reward:624,
  party:[{ speciesId:'SPARKHORN', level:39, moves:['THUNDERBOLT','THUNDER','TACKLE'] }],
  aiTier:1, location:'CRESTFALL_GYM',
};

DG.TRAINERS.VOLT_S2_TC = {
  id:'VOLT_S2_TC', name:'Ace Trainer Volta', class:'Ace Trainer', isGymLeader:false, badge:null,
  loseDialogue:"Charged ahead on the right path!", reward:640,
  party:[{ speciesId:'VOLTSCALE', level:40, moves:['THUNDERBOLT','THUNDER','VOLT_TACKLE'] }],
  aiTier:2, location:'CRESTFALL_GYM',
};
DG.TRAINERS.VOLT_S2_TW1 = {
  id:'VOLT_S2_TW1', name:'Rocker Arc', class:'Rocker', isGymLeader:false, badge:null,
  loseDialogue:"The wrong circuit still leads to the leader!", reward:640,
  party:[
    { speciesId:'SPARKHORN', level:40, moves:['THUNDERBOLT','TACKLE','GROWL'] },
    { speciesId:'SPARKLET',  level:40, moves:['THUNDERBOLT','THUNDER','TACKLE'] },
  ],
  aiTier:1, location:'CRESTFALL_GYM',
};
DG.TRAINERS.VOLT_S2_TW2 = {
  id:'VOLT_S2_TW2', name:'Electrician Grid', class:'Electrician', isGymLeader:false, badge:null,
  loseDialogue:"High voltage on the long path!", reward:656,
  party:[
    { speciesId:'VOLTHORN',  level:41, moves:['THUNDER','THUNDERBOLT','TACKLE'] },
    { speciesId:'SPARKHORN', level:41, moves:['THUNDERBOLT','TACKLE','GROWL'] },
  ],
  aiTier:1, location:'CRESTFALL_GYM',
};

DG.TRAINERS.VOLT_S3_TC = {
  id:'VOLT_S3_TC', name:'Ace Trainer Kiloton', class:'Ace Trainer', isGymLeader:false, badge:null,
  loseDialogue:"Volt's Thundersaur hits like a lightning storm!", reward:860,
  party:[
    { speciesId:'VOLTSCALE', level:43, moves:['THUNDERBOLT','THUNDER','VOLT_TACKLE'] },
    { speciesId:'VOLTHORN',  level:43, moves:['THUNDER','THUNDERBOLT','TACKLE'] },
  ],
  aiTier:2, location:'CRESTFALL_GYM',
};
DG.TRAINERS.VOLT_S3_TW1 = {
  id:'VOLT_S3_TW1', name:'Rocker Static', class:'Rocker', isGymLeader:false, badge:null,
  loseDialogue:"Static on the wrong path — still shocking!", reward:688,
  party:[{ speciesId:'VOLTHORN', level:43, moves:['THUNDER','THUNDERBOLT','TACKLE'] }],
  aiTier:2, location:'CRESTFALL_GYM',
};
DG.TRAINERS.VOLT_S3_TW2 = {
  id:'VOLT_S3_TW2', name:'Electrician Ohm', class:'Electrician', isGymLeader:false, badge:null,
  loseDialogue:"You conducted yourself well on the hard road!", reward:704,
  party:[
    { speciesId:'VOLTSCALE', level:44, moves:['THUNDERBOLT','VOLT_TACKLE','THUNDER'] },
    { speciesId:'VOLTHORN',  level:44, moves:['THUNDER','THUNDERBOLT','TACKLE'] },
  ],
  aiTier:2, location:'CRESTFALL_GYM',
};

// ── GYM 7 · MARINA · Water-type · Bogmire ────────────────────────────
DG.TRAINERS.MARINA_S1_TC = {
  id:'MARINA_S1_TC', name:'Swimmer Wave', class:'Swimmer', isGymLeader:false, badge:null,
  loseDialogue:"You navigated these tides perfectly!", reward:672,
  party:[{ speciesId:'AQUEEL', level:42, moves:['WATER_GUN','TACKLE','GROWL'] }],
  aiTier:1, location:'BOGMIRE_GYM',
};
DG.TRAINERS.MARINA_S1_TW1 = {
  id:'MARINA_S1_TW1', name:'Fisherman Tide', class:'Fisherman', isGymLeader:false, badge:null,
  loseDialogue:"The wrong current swept you in!", reward:672,
  party:[{ speciesId:'MUDFIN', level:42, moves:['WATER_GUN','TACKLE','MUD_SHOT'] }],
  aiTier:1, location:'BOGMIRE_GYM',
};
DG.TRAINERS.MARINA_S1_TW2 = {
  id:'MARINA_S1_TW2', name:'Swimmer Brine', class:'Swimmer', isGymLeader:false, badge:null,
  loseDialogue:"Two waves crash on the wrong path!", reward:688,
  party:[{ speciesId:'AQUAFLIP', level:43, moves:['WATER_GUN','SURF','TACKLE'] }],
  aiTier:1, location:'BOGMIRE_GYM',
};

DG.TRAINERS.MARINA_S2_TC = {
  id:'MARINA_S2_TC', name:'Ace Trainer Coral', class:'Ace Trainer', isGymLeader:false, badge:null,
  loseDialogue:"Deep knowledge — like the ocean floor!", reward:704,
  party:[{ speciesId:'PLESIWAVE', level:44, moves:['SURF','WATER_GUN','WATER_PULSE','TACKLE'] }],
  aiTier:2, location:'BOGMIRE_GYM',
};
DG.TRAINERS.MARINA_S2_TW1 = {
  id:'MARINA_S2_TW1', name:'Fisherman Reef', class:'Fisherman', isGymLeader:false, badge:null,
  loseDialogue:"Got caught in the wrong current!", reward:704,
  party:[
    { speciesId:'AQUEEL',  level:44, moves:['WATER_GUN','TACKLE','SURF'] },
    { speciesId:'MUDFIN',  level:44, moves:['WATER_GUN','BULLDOZE','TACKLE'] },
  ],
  aiTier:1, location:'BOGMIRE_GYM',
};
DG.TRAINERS.MARINA_S2_TW2 = {
  id:'MARINA_S2_TW2', name:'Sailor Swell', class:'Sailor', isGymLeader:false, badge:null,
  loseDialogue:"Stormy waters — but you sailed through!", reward:720,
  party:[
    { speciesId:'SWAMPJAW', level:45, moves:['SURF','BULLDOZE','WATER_GUN'] },
    { speciesId:'AQUAFLIP', level:45, moves:['SURF','WATER_GUN','BITE'] },
  ],
  aiTier:1, location:'BOGMIRE_GYM',
};

DG.TRAINERS.MARINA_S3_TC = {
  id:'MARINA_S3_TC', name:'Ace Trainer Abyssia', class:'Ace Trainer', isGymLeader:false, badge:null,
  loseDialogue:"Marina's Plesiwave hits hard — brace yourself!", reward:940,
  party:[
    { speciesId:'PLESIWAVE', level:47, moves:['SURF','WATER_PULSE','WATER_GUN','HEADBUTT'] },
    { speciesId:'SEAFANG',   level:47, moves:['SURF','CRUNCH','BITE','WATER_GUN'] },
  ],
  aiTier:2, location:'BOGMIRE_GYM',
};
DG.TRAINERS.MARINA_S3_TW1 = {
  id:'MARINA_S3_TW1', name:'Swimmer Eddy', class:'Swimmer', isGymLeader:false, badge:null,
  loseDialogue:"The deep end of the gym — you swam through!", reward:752,
  party:[{ speciesId:'SEAFANG', level:47, moves:['SURF','CRUNCH','WATER_GUN','BITE'] }],
  aiTier:2, location:'BOGMIRE_GYM',
};
DG.TRAINERS.MARINA_S3_TW2 = {
  id:'MARINA_S3_TW2', name:'Sailor Riptide', class:'Sailor', isGymLeader:false, badge:null,
  loseDialogue:"Wrong answer, right battler — now face Marina!", reward:768,
  party:[
    { speciesId:'SWAMPJAW', level:48, moves:['SURF','BULLDOZE','CRUNCH','WATER_GUN'] },
    { speciesId:'PLESIWAVE',level:48, moves:['SURF','WATER_PULSE','HEADBUTT','WATER_GUN'] },
  ],
  aiTier:2, location:'BOGMIRE_GYM',
};

// ── GYM 8 · VALDEZ · Dragon/Mixed-type · ApexSummit ──────────────────
DG.TRAINERS.VALDEZ_S1_TC = {
  id:'VALDEZ_S1_TC', name:'Dragon Tamer Drake', class:'Dragon Tamer', isGymLeader:false, badge:null,
  loseDialogue:"You tamed this stage — the peak awaits!", reward:800,
  party:[{ speciesId:'PTRYX', level:50, moves:['DRAGON_RAGE','TACKLE','BITE'] }],
  aiTier:2, location:'APEXSUMMIT_GYM',
};
DG.TRAINERS.VALDEZ_S1_TW1 = {
  id:'VALDEZ_S1_TW1', name:'Explorer Vance', class:'Explorer', isGymLeader:false, badge:null,
  loseDialogue:"Even the wrong path leads to glory!", reward:800,
  party:[{ speciesId:'DARKSCALE', level:50, moves:['DRAGON_RAGE','BITE','CRUNCH'] }],
  aiTier:2, location:'APEXSUMMIT_GYM',
};
DG.TRAINERS.VALDEZ_S1_TW2 = {
  id:'VALDEZ_S1_TW2', name:'Dragon Tamer Rook', class:'Dragon Tamer', isGymLeader:false, badge:null,
  loseDialogue:"Two dragon masters on the hard road!", reward:816,
  party:[{ speciesId:'PTRYX', level:51, moves:['DRAGON_RAGE','DRAGON_CLAW','TACKLE','BITE'] }],
  aiTier:2, location:'APEXSUMMIT_GYM',
};

DG.TRAINERS.VALDEZ_S2_TC = {
  id:'VALDEZ_S2_TC', name:'Ace Trainer Summit', class:'Ace Trainer', isGymLeader:false, badge:null,
  loseDialogue:"The summit draws near — dragon knowledge is power!", reward:832,
  party:[{ speciesId:'SWOOPTER', level:52, moves:['DRAGON_CLAW','DRAGON_RAGE','BITE','TACKLE'] }],
  aiTier:2, location:'APEXSUMMIT_GYM',
};
DG.TRAINERS.VALDEZ_S2_TW1 = {
  id:'VALDEZ_S2_TW1', name:'Explorer Vex', class:'Explorer', isGymLeader:false, badge:null,
  loseDialogue:"The cavern path is not for the faint-hearted!", reward:832,
  party:[
    { speciesId:'PTRYX',     level:52, moves:['DRAGON_RAGE','DRAGON_CLAW','BITE'] },
    { speciesId:'DARKSCALE', level:52, moves:['DRAGON_RAGE','CRUNCH','BITE'] },
  ],
  aiTier:2, location:'APEXSUMMIT_GYM',
};
DG.TRAINERS.VALDEZ_S2_TW2 = {
  id:'VALDEZ_S2_TW2', name:'Dragon Tamer Obsid', class:'Dragon Tamer', isGymLeader:false, badge:null,
  loseDialogue:"Two dragons block the wrong gate — you broke through!", reward:848,
  party:[
    { speciesId:'SHADOWCLAW', level:53, moves:['DRAGON_CLAW','CRUNCH','BITE','DRAGON_RAGE'] },
    { speciesId:'PTRYX',      level:53, moves:['DRAGON_RAGE','DRAGON_CLAW','BITE'] },
  ],
  aiTier:2, location:'APEXSUMMIT_GYM',
};

DG.TRAINERS.VALDEZ_S3_TC = {
  id:'VALDEZ_S3_TC', name:'Ace Trainer Pinnacle', class:'Ace Trainer', isGymLeader:false, badge:null,
  loseDialogue:"Valdez uses Skyfang — ice moves are key!", reward:1100,
  party:[
    { speciesId:'SWOOPTER', level:55, moves:['DRAGON_CLAW','DRAGON_RAGE','DRAGON_PULSE','BITE'] },
    { speciesId:'SKYFANG',  level:55, moves:['DRAGON_PULSE','DRAGON_CLAW','DRAGON_RAGE','CRUNCH'] },
  ],
  aiTier:3, location:'APEXSUMMIT_GYM',
};
DG.TRAINERS.VALDEZ_S3_TW1 = {
  id:'VALDEZ_S3_TW1', name:'Dragon Tamer Abyss', class:'Dragon Tamer', isGymLeader:false, badge:null,
  loseDialogue:"You braved the dragon gauntlet's hard path!", reward:880,
  party:[{ speciesId:'SHADOWCLAW', level:55, moves:['DRAGON_CLAW','CRUNCH','DRAGON_RAGE','BITE'] }],
  aiTier:2, location:'APEXSUMMIT_GYM',
};
DG.TRAINERS.VALDEZ_S3_TW2 = {
  id:'VALDEZ_S3_TW2', name:'Explorer Crimson', class:'Explorer', isGymLeader:false, badge:null,
  loseDialogue:"Wrong answer, dragon might — you conquered both!", reward:896,
  party:[
    { speciesId:'SHADOWCLAW', level:56, moves:['DRAGON_CLAW','CRUNCH','BITE','DRAGON_RAGE'] },
    { speciesId:'SWOOPTER',   level:56, moves:['DRAGON_CLAW','DRAGON_RAGE','DRAGON_PULSE','BITE'] },
  ],
  aiTier:2, location:'APEXSUMMIT_GYM',
};

console.log('[DinoMon] Trainers loaded: ' + Object.keys(DG.TRAINERS).length);

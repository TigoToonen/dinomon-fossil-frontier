// DinoMon: Fossil Frontier — data/dinomons.js v10
// All 40 species lines (105 individual forms)

window.DG = window.DG || {};

// Helper to build a species entry
function _sp(id, name, types, bs, learnset, evolvesTo, evolvesAt, prevForm, ability, abilityDesc, catchRate, expYield, curve, legendary, mega, desc, color, color2) {
  return { id, name, types, baseStats: bs, learnset, evolvesTo, evolvesAt, prevForm,
           ability, abilityDesc, catchRate, expYield, expCurve: curve || 'MEDIUM',
           isLegendary: !!legendary, isMega: !!mega, description: desc, color, color2 };
}

function _ls(...pairs) { // pairs: [level, moveId]
  const out = [];
  for (let i = 0; i < pairs.length; i += 2) out.push({ level: pairs[i], move: pairs[i+1] });
  return out;
}

DG.SPECIES = {

// ═══════════════════════════════════════════════════════
// STARTERS
// ═══════════════════════════════════════════════════════

// Chain 1 — Fire starter (Ceratopsian/Triceratops)
TINDREL: _sp('TINDREL','Tindrel',['FIRE'],
  {hp:45,atk:52,def:43,spAtk:60,spDef:50,spd:45},
  _ls(
    1,'TACKLE',1,'EMBER',5,'FIRE_SPIN',9,'ERUPTION_HORN',
    10,['FLAME_CHARGE','FLAMETHROWER','LAVA_PLUME','FRILL_FLARE'],14,'FIREWORKS',20,'IMMOLATION',28,'FIRECRACKER',
    36,'LEER'
  ),
  'TINDRAK',16,null,'Ember Scales','Burns foes that make contact (10%)',
  45,64,'MEDIUM',false,false,
  'A small ceratopsian whose glowing frill sparks when it senses danger.',
  '#E8612C','#FFA040'),

TINDRAK: _sp('TINDRAK','Tindrak',['FIRE'],
  {hp:60,atk:70,def:58,spAtk:78,spDef:65,spd:62},
  _ls(
    1,'TACKLE',1,'EMBER',5,'ERUPTION_HORN',6,'SMOKESCREEN',
    10,'FIRE_SPIN',16,'FIREWORKS',22,'IMMOLATION',24,['FLAME_CHARGE','FLAMETHROWER','LAVA_PLUME','FRILL_FLARE'],
    28,'FIRECRACKER',34,'LEER',40,'GROWL',48,'TAIL_WHIP'
  ),
  'PYROCERATH',32,'TINDREL','Ember Scales','Burns foes that make contact (10%)',
  45,142,'MEDIUM',false,false,
  'Its three horns can reach temperatures of 800°C in battle.',
  '#CF4520','#FF8040'),

PYROCERATH: _sp('PYROCERATH','Pyrocerath',['FIRE','DRAGON'],
  {hp:80,atk:100,def:80,spAtk:115,spDef:85,spd:80},
  _ls(
    1,'TACKLE',1,'EMBER',5,'LEER',7,'FIRE_SPIN',
    10,'GROWL',16,'ERUPTION_HORN',22,'FIREWORKS',28,'IMMOLATION',
    34,'FIRECRACKER',40,'SMOKESCREEN',41,['FLAME_CHARGE','FLAMETHROWER','LAVA_PLUME','FRILL_FLARE'],46,'TAIL_WHIP',
    52,'WORK_UP',54,['FIRE_BLAST','OVERHEAT','ERUPTION','EXTINCTION_BEAM'],58,'SWORDS_DANCE',64,'DRAGON_DANCE'
  ),
  null,null,'TINDRAK','Volcanic Presence','All Fire moves gain +20% power',
  10,265,'SLOW',false,false,
  'A towering volcanic ceratopsian. Its erupting horns can level a city block.',
  '#C0392B','#FF6B35'),

// Chain 2 — Grass starter (Stegosaurus)
LEAFAWN: _sp('LEAFAWN','Leafawn',['GRASS'],
  {hp:50,atk:48,def:55,spAtk:55,spDef:65,spd:27},
  _ls(
    1,'TACKLE',1,'VINE_WHIP',5,'RAZOR_LEAF',9,'MEGA_DRAIN',
    10,['GIGA_DRAIN','ENERGY_BALL','SPORE_BURST','FOREST_CANOPY'],14,'BULLET_SEED',20,'SNAP_TRAP',28,'TRAILBLAZE',
    36,'TANGLE_SHOT'
  ),
  'FERNASAUR',16,null,'Overgrow','Grass moves +50% when HP below 33%',
  45,64,'MEDIUM',false,false,
  'Leaf-shaped plates along its back absorb sunlight and glow at dusk.',
  '#5DBB63','#2E8B57'),

FERNASAUR: _sp('FERNASAUR','Fernasaur',['GRASS'],
  {hp:67,atk:62,def:72,spAtk:70,spDef:85,spd:37},
  _ls(
    1,'TACKLE',1,'VINE_WHIP',5,'MEGA_DRAIN',7,'LEECH_SEED',
    10,'RAZOR_LEAF',16,'BULLET_SEED',22,'SNAP_TRAP',24,['GIGA_DRAIN','ENERGY_BALL','SPORE_BURST','FOREST_CANOPY'],
    28,'TRAILBLAZE',34,'TANGLE_SHOT',40,'LEER',48,'GROWL'
  ),
  'VERDANTHORN',32,'LEAFAWN','Overgrow','Grass moves +50% when HP below 33%',
  45,142,'MEDIUM',false,false,
  'Its plates have grown into broad jade fans that can deflect weaker attacks.',
  '#3D9B45','#1A6B32'),

VERDANTHORN: _sp('VERDANTHORN','Verdanthorn',['GRASS','ROCK'],
  {hp:90,atk:80,def:110,spAtk:90,spDef:105,spd:45},
  _ls(
    1,'VINE_WHIP',1,'RAZOR_LEAF',5,'TRAILBLAZE',7,'MEGA_DRAIN',
    10,'LEER',16,'BULLET_SEED',22,'SNAP_TRAP',28,'TANGLE_SHOT',
    34,'GROWL',40,'SMOKESCREEN',41,['GIGA_DRAIN','ENERGY_BALL','SPORE_BURST','FOREST_CANOPY'],46,'TAIL_WHIP',
    52,'WORK_UP',54,['SOLAR_BEAM','JADE_PLATE_SLAM','LEAF_STORM','PETAL_DANCE'],58,'SWORDS_DANCE',64,'DRAGON_DANCE'
  ),
  null,null,'FERNASAUR','Stone Garden','Rock and Grass moves each gain +15% power',
  10,265,'SLOW',false,false,
  'A massive stegosaur whose crystallised jade plates are harder than diamond.',
  '#228B22','#8B6914'),

// Chain 3 — Water starter (Plesiosaur)
AQUEEL: _sp('AQUEEL','Aqueel',['WATER'],
  {hp:44,atk:48,def:43,spAtk:65,spDef:50,spd:55},
  _ls(
    1,'TACKLE',1,'WATER_GUN',5,'AQUA_JET',9,'BUBBLE',
    10,['WATERFALL','SURF','AQUA_TAIL','SONIC_PULSE'],14,'WHIRLPOOL',20,'CLAMP',28,'WATER_SHURIKEN',
    36,'LEER'
  ),
  'PLESIWAVE',16,null,'Torrent','Water moves +50% when HP below 33%',
  45,64,'MEDIUM',false,false,
  'A plesiosaur hatchling whose long neck creates tiny whirlpools when it plays.',
  '#4FC3F7','#0277BD'),

PLESIWAVE: _sp('PLESIWAVE','Plesiwave',['WATER'],
  {hp:59,atk:62,def:57,spAtk:83,spDef:67,spd:65},
  _ls(
    1,'TACKLE',1,'WATER_GUN',5,'AQUA_JET',6,'BUBBLE',
    10,'WHIRLPOOL',16,'CLAMP',22,'WATER_SHURIKEN',24,['WATERFALL','SURF','AQUA_TAIL','SONIC_PULSE'],
    28,'LEER',34,'GROWL',40,'SMOKESCREEN',48,'TAIL_WHIP'
  ),
  'TIDANOSAURUS',32,'AQUEEL','Torrent','Water moves +50% when HP below 33%',
  45,142,'MEDIUM',false,false,
  'Uses sonar pulses from its crest to navigate and disorient prey.',
  '#1E88E5','#0D47A1'),

TIDANOSAURUS: _sp('TIDANOSAURUS','Tidanosaurus',['WATER','DRAGON'],
  {hp:95,atk:85,def:80,spAtk:115,spDef:90,spd:75},
  _ls(
    1,'WATER_GUN',1,'AQUA_JET',5,'CLAMP',7,'BUBBLE',
    10,'WATER_SHURIKEN',16,'WHIRLPOOL',22,'LEER',28,'GROWL',
    34,'SMOKESCREEN',40,'TAIL_WHIP',41,['WATERFALL','SURF','AQUA_TAIL','SONIC_PULSE'],46,'WORK_UP',
    52,'SWORDS_DANCE',54,['HYDRO_PUMP','ANCIENT_TORRENT','GLACIAL_MIND','CRABHAMMER'],58,'DRAGON_DANCE',64,'BULK_UP'
  ),
  null,null,'PLESIWAVE','Tidal Surge','Water moves deal an extra splash hit at 30% power',
  10,265,'SLOW',false,false,
  'A colossal plesiosaur. When it raises its neck, it triggers tidal waves for kilometres.',
  '#006994','#48CAE4'),

// ═══════════════════════════════════════════════════════
// 3-STAGE CATCHABLE CHAINS
// ═══════════════════════════════════════════════════════

// Chain 4 — Ground/Rock (Ankylosaur)
QUAKELING: _sp('QUAKELING','Quakeling',['GROUND'],
  {hp:60,atk:70,def:75,spAtk:30,spDef:55,spd:30},
  _ls(
    1,'TACKLE',4,'SAND_ATTACK',5,'BONE_RUSH',9,'MUD_SLAP',
    10,['BULLDOZE','DIG','MAGNITUDE','CLUB_SMASH'],14,'FISSURE',20,'MUDSLAP',28,'BONEMERANG',
    36,'SAND_TOMB'
  ),
  'MIDDODON',20,null,'Rock Head','No recoil damage from recoil moves',
  90,56,'MEDIUM',false,false,
  'A stubby ankylosaur that causes mini-tremors with every step.',
  '#C8A96E','#8B6914'),

MIDDODON: _sp('MIDDODON','Middodon',['GROUND','ROCK'],
  {hp:75,atk:88,def:92,spAtk:35,spDef:65,spd:38},
  _ls(
    1,'TACKLE',4,'SAND_ATTACK',5,'BONE_RUSH',7,'MUD_SLAP',
    10,'FISSURE',16,'MUDSLAP',22,'BONEMERANG',24,['BULLDOZE','DIG','MAGNITUDE','CLUB_SMASH'],
    28,'SAND_TOMB',34,'LEER',40,'GROWL',48,'SMOKESCREEN'
  ),
  'TERRADON',38,'QUAKELING','Rock Head','No recoil damage from recoil moves',
  60,120,'MEDIUM',false,false,
  'Its armoured plating has thickened to rival tank armour.',
  '#A0785A','#6B4C2A'),

TERRADON: _sp('TERRADON','Terradon',['GROUND','ROCK'],
  {hp:90,atk:110,def:110,spAtk:45,spDef:80,spd:40},
  _ls(
    1,'BULLDOZE',1,'CLUB_SMASH',5,'MUDSLAP',7,'MUD_SLAP',
    10,'BONEMERANG',16,'BONE_RUSH',22,'FISSURE',28,'SAND_TOMB',
    34,'LEER',40,'GROWL',41,['DIG','MAGNITUDE','MUD_SHOT','MUD_BOMB'],46,'SMOKESCREEN',
    52,'TAIL_WHIP',54,['EARTHQUAKE','HIGH_HORSEPOWER','PRECIPICE_BLADES','TECTONIC_RAGE'],58,'WORK_UP',64,'SWORDS_DANCE'
  ),
  null,null,'MIDDODON','Immovable','Cannot be flinched; incoming Rock damage reduced 25%',
  30,230,'SLOW',false,false,
  'A living fortress. Nothing has ever sent it flying.',
  '#808080','#B0A080'),

// Chain 5 — Dragon/Psychic (Pterosaur)
PTRYX: _sp('PTRYX','Ptryx',['DRAGON'],
  {hp:40,atk:55,def:35,spAtk:50,spDef:40,spd:70},
  _ls(
    1,'GUST',5,'LEER',7,'DRAGON_DARTS',9,'DRAGON_RAGE',
    10,['DRAGON_BREATH','DRAGON_CLAW','DRAGON_PULSE','BREAKING_SWIPE'],14,'SCALE_SHOT',20,'TWISTER',28,'DUAL_WINGBEAT',
    36,'SCALE_SHOT_PLUS'
  ),
  'SWOOPTER',20,null,'Keen Eye','Accuracy cannot be lowered',
  120,60,'MEDIUM',false,false,
  'A tiny pterosaur that screams to disorient prey before diving.',
  '#9B59B6','#D7BDE2'),

SWOOPTER: _sp('SWOOPTER','Swoopter',['DRAGON'],
  {hp:55,atk:80,def:50,spAtk:70,spDef:55,spd:95},
  _ls(
    1,'GUST',5,'LEER',7,'DRAGON_RAGE',10,'DRAGON_DARTS',
    16,'SCALE_SHOT',22,'TWISTER',24,['DRAGON_BREATH','DRAGON_CLAW','DRAGON_PULSE','BREAKING_SWIPE'],28,'DUAL_WINGBEAT',
    34,'SCALE_SHOT_PLUS',40,'CLAW_STORM',48,'GROWL',56,'SMOKESCREEN'
  ),
  'SKYFANG',40,'PTRYX','Keen Eye','Accuracy cannot be lowered',
  60,130,'MEDIUM',false,false,
  'Dives at 150 mph. Its bony crest guides it through tight canyon passes.',
  '#7B2FBE','#B57BDE'),

SKYFANG: _sp('SKYFANG','Skyfang',['DRAGON','PSYCHIC'],
  {hp:75,atk:110,def:70,spAtk:100,spDef:75,spd:115},
  _ls(
    1,'GUST',5,'TWISTER',7,'DRAGON_RAGE',10,'DUAL_WINGBEAT',
    13,'DRAGON_DARTS',16,'SCALE_SHOT',22,'SCALE_SHOT_PLUS',28,'CLAW_STORM',
    34,'LEER',40,'GROWL',41,['DRAGON_BREATH','DRAGON_CLAW','DRAGON_PULSE','BREAKING_SWIPE'],46,'SMOKESCREEN',
    52,'TAIL_WHIP',54,['OUTRAGE','DRACO_METEOR','MIND_DIVE','DIVE_BOMB'],58,'WORK_UP',64,'SWORDS_DANCE'
  ),
  null,null,'SWOOPTER','Predator\'s Mind','Moves never miss; +10% critical hit rate',
  20,250,'SLOW',false,false,
  'Its wingspan blots out the sun. Psychic crest reads the movements of any foe.',
  '#5B0FA0','#E0AAFF'),

// Chain 6 — Fire/Rock (Spinosaurus)
EMBRIX: _sp('EMBRIX','Embrix',['FIRE'],
  {hp:45,atk:65,def:40,spAtk:55,spDef:35,spd:62},
  _ls(
    1,'SCRATCH',5,'EMBER',7,'FIRE_SPIN',9,'ERUPTION_HORN',
    10,['FLAME_CHARGE','FLAMETHROWER','LAVA_PLUME','FRILL_FLARE'],14,'FIREWORKS',20,'IMMOLATION',28,'FIRECRACKER',
    36,'LEER'
  ),
  'SOLARIX',22,null,'Flash Fire','Absorbs Fire moves to boost own Fire power',
  100,58,'MEDIUM',false,false,
  'Heat-absorbing black scales store energy in its dorsal sail.',
  '#E74C3C','#1A1A2E'),

SOLARIX: _sp('SOLARIX','Solarix',['FIRE','ROCK'],
  {hp:60,atk:83,def:62,spAtk:72,spDef:50,spd:78},
  _ls(
    1,'SCRATCH',5,'EMBER',7,'FIRE_SPIN',10,'ERUPTION_HORN',
    16,'FIREWORKS',22,'IMMOLATION',24,['FLAME_CHARGE','FLAMETHROWER','LAVA_PLUME','FRILL_FLARE'],28,'FIRECRACKER',
    34,'LEER',40,'GROWL',48,'SMOKESCREEN',56,'TAIL_WHIP'
  ),
  'SCORCHBACK',38,'EMBRIX','Flash Fire','Absorbs Fire moves to boost own Fire power',
  60,128,'MEDIUM',false,false,
  'Its crystallising sail glows orange as magma hardens into stone.',
  '#C0392B','#FF7043'),

SCORCHBACK: _sp('SCORCHBACK','Scorchback',['FIRE','ROCK'],
  {hp:75,atk:105,def:85,spAtk:90,spDef:60,spd:70},
  _ls(
    1,'SCRATCH',5,'LEER',7,'EMBER',10,'GROWL',
    13,'FIRE_SPIN',16,'ERUPTION_HORN',22,'FIREWORKS',28,'IMMOLATION',
    34,'FIRECRACKER',40,'SMOKESCREEN',41,['FLAME_CHARGE','FLAMETHROWER','LAVA_PLUME','FRILL_FLARE'],46,'TAIL_WHIP',
    52,'WORK_UP',54,['FIRE_BLAST','OVERHEAT','ERUPTION','EXTINCTION_BEAM'],58,'SWORDS_DANCE',64,'DRAGON_DANCE'
  ),
  null,null,'SOLARIX','Magma Armor','Immune to burn; Fire attacks raise Defense',
  25,245,'SLOW',false,false,
  'Half lava, half stone. Its crystallised magma sail reaches 1,200°C.',
  '#B71C1C','#FF7043'),

// Chain 7 — Grass/Ground (Brachiosaurus)
FRONDLET: _sp('FRONDLET','Frondlet',['GRASS'],
  {hp:55,atk:45,def:50,spAtk:60,spDef:55,spd:40},
  _ls(
    1,'POUND',5,'RAZOR_LEAF',6,'MEGA_DRAIN',9,'VINE_WHIP',
    10,['GIGA_DRAIN','ENERGY_BALL','SPORE_BURST','FOREST_CANOPY'],14,'BULLET_SEED',20,'SNAP_TRAP',28,'TRAILBLAZE',
    36,'TANGLE_SHOT'
  ),
  'VINOSAUR',22,null,'Chlorophyll','Speed doubles in sunlight',
  100,55,'MEDIUM',false,false,
  'Moss grows on its back and blooms into flowers under sunlight.',
  '#7CB342','#33691E'),

VINOSAUR: _sp('VINOSAUR','Vinosaur',['GRASS','GROUND'],
  {hp:72,atk:60,def:68,spAtk:78,spDef:72,spd:52},
  _ls(
    1,'POUND',5,'VINE_WHIP',6,'MEGA_DRAIN',7,'RAZOR_LEAF',
    10,'BULLET_SEED',16,'SNAP_TRAP',22,'TRAILBLAZE',24,['GIGA_DRAIN','ENERGY_BALL','SPORE_BURST','FOREST_CANOPY'],
    28,'TANGLE_SHOT',34,'LEER',40,'GROWL',48,'SMOKESCREEN'
  ),
  'CANOPYREX',38,'FRONDLET','Chlorophyll','Speed doubles in sunlight',
  60,125,'MEDIUM',false,false,
  'Vines trail from its neck, taking root wherever it walks.',
  '#558B2F','#8D6E63'),

CANOPYREX: _sp('CANOPYREX','CanopyRex',['GRASS','GROUND'],
  {hp:95,atk:70,def:90,spAtk:95,spDef:90,spd:50},
  _ls(
    1,'VINE_WHIP',5,'SNAP_TRAP',7,'RAZOR_LEAF',10,'TRAILBLAZE',
    13,'MEGA_DRAIN',16,'BULLET_SEED',22,'TANGLE_SHOT',28,'LEER',
    34,'GROWL',40,'SMOKESCREEN',41,['GIGA_DRAIN','ENERGY_BALL','SPORE_BURST','FOREST_CANOPY'],46,'TAIL_WHIP',
    52,'WORK_UP',54,['SOLAR_BEAM','JADE_PLATE_SLAM','LEAF_STORM','PETAL_DANCE'],58,'SWORDS_DANCE',64,'DRAGON_DANCE'
  ),
  null,null,'VINOSAUR','Living Forest','Heals 1/16 HP each turn; Grass moves +10%',
  20,240,'SLOW',false,false,
  'A colossal sauropod whose spine is a living forest ecosystem.',
  '#2E7D32','#8D6E63'),

// Chain 8 — Rock/Ground (Pachycephalosaurus)
BONEBACK: _sp('BONEBACK','Boneback',['ROCK'],
  {hp:65,atk:85,def:90,spAtk:30,spDef:50,spd:35},
  _ls(
    1,'HEADBUTT',5,'ROCK_BLAST',6,'ROCK_THROW',9,'ROLLOUT',
    10,['ROCK_SLIDE','ANCIENT_POWER','SMASH_DOWN','POWER_GEM'],14,'ACCELEROCK',20,'MINERAL_BURST',28,'LEER',
    36,'GROWL'
  ),
  'STONESKULL',22,null,'Tremor Sense','Priority attacks deal only half damage to it',
  100,58,'MEDIUM',false,false,
  'A pachycephalosaur with a reinforced mineral dome. Headbutts everything.',
  '#9E9E9E','#F5F5DC'),

STONESKULL: _sp('STONESKULL','Stoneskull',['ROCK','GROUND'],
  {hp:80,atk:100,def:105,spAtk:38,spDef:65,spd:42},
  _ls(
    1,'HEADBUTT',5,'ACCELEROCK',6,'ROCK_THROW',7,'ROCK_BLAST',
    10,'ROLLOUT',16,'MINERAL_BURST',22,'LEER',24,['ROCK_SLIDE','ANCIENT_POWER','SMASH_DOWN','POWER_GEM'],
    28,'GROWL',34,'SMOKESCREEN',40,'TAIL_WHIP',48,'WORK_UP'
  ),
  'OSSIFANG',38,'BONEBACK','Ancient Guard','Completely blocks priority attacks',
  60,128,'MEDIUM',false,false,
  'Fossilised spikes have emerged across its body like a living geological formation.',
  '#757575','#D4D4B4'),

OSSIFANG: _sp('OSSIFANG','Ossifang',['ROCK','GROUND'],
  {hp:95,atk:115,def:120,spAtk:45,spDef:75,spd:45},
  _ls(
    1,'HEADBUTT',5,'ACCELEROCK',7,'ROCK_THROW',10,'LEER',
    13,'ROCK_BLAST',16,'ROLLOUT',22,'MINERAL_BURST',28,'GROWL',
    34,'SMOKESCREEN',40,'TAIL_WHIP',41,['ROCK_SLIDE','ANCIENT_POWER','SMASH_DOWN','POWER_GEM'],46,'WORK_UP',
    52,'SWORDS_DANCE',54,['STONE_EDGE','SKULL_SLAM','HEAD_SMASH','DIAMOND_STORM'],58,'DRAGON_DANCE',64,'BULK_UP'
  ),
  null,null,'STONESKULL','Diamond Dome','Critical hits deal 50% less damage; Rock moves +20%',
  20,250,'SLOW',false,false,
  'An enormous dome-skull dinosaur. Scientists have never managed to crack its skull.',
  '#616161','#FAFAFA'),

// Chain 9 — Psychic/Ground (Dilophosaurus)
VENOMJAW: _sp('VENOMJAW','Venomjaw',['PSYCHIC'],
  {hp:50,atk:60,def:45,spAtk:75,spDef:50,spd:65},
  _ls(
    1,'PSYBEAM',5,'CONFUSION',7,'STORED_POWER',9,'LEER',
    10,['PSYCHIC_MOVE','CRYSTAL_BEAM','PSYSHOCK','EXTRASENSORY'],14,'GROWL',20,'SMOKESCREEN',28,'TAIL_WHIP',
    36,'WORK_UP'
  ),
  'MIASMARK',22,null,'Intimidate','Lowers foe\'s Attack on switch-in',
  100,60,'MEDIUM',false,false,
  'A Dilophosaurus with psychic-disrupting venom that fires from neck frills.',
  '#8E44AD','#F39C12'),

MIASMARK: _sp('MIASMARK','Miasmark',['PSYCHIC','POISON'],
  {hp:65,atk:75,def:58,spAtk:92,spDef:65,spd:78},
  _ls(
    1,'PSYBEAM',5,'CONFUSION',7,'STORED_POWER',8,'POISON_STING',
    10,'LEER',16,'GROWL',22,'SMOKESCREEN',24,['PSYCHIC_MOVE','CRYSTAL_BEAM','PSYSHOCK','EXTRASENSORY'],
    28,'TAIL_WHIP',34,'WORK_UP',40,'SWORDS_DANCE',48,'DRAGON_DANCE'
  ),
  'TOXICARNO',38,'VENOMJAW','Intimidate','Lowers foe\'s Attack on switch-in',
  60,132,'MEDIUM',false,false,
  'Multiple frills spray a venom that corrodes both body and mind.',
  '#7B1FA2','#FFA000'),

TOXICARNO: _sp('TOXICARNO','Toxicarno',['PSYCHIC','GROUND'],
  {hp:75,atk:85,def:65,spAtk:110,spDef:75,spd:85},
  _ls(
    1,'PSYBEAM',5,'SMOKESCREEN',7,'STORED_POWER',10,'TAIL_WHIP',
    13,'LEER',16,'CONFUSION',22,'GROWL',28,'WORK_UP',
    34,'SWORDS_DANCE',40,'DRAGON_DANCE',41,['PSYCHIC_MOVE','CRYSTAL_BEAM','PSYSHOCK','EXTRASENSORY'],46,'BULK_UP',
    52,'CALM_MIND',54,['PSYSTRIKE','FUTURE_SIGHT','VENOM_EARTH','FOSSIL_MEMORY'],58,'NASTY_PLOT',64,'IRON_DEFENSE'
  ),
  null,null,'MIASMARK','Corrosive Ground','Ground moves always lower target\'s Defense by 1',
  25,248,'SLOW',false,false,
  'Venom seeps from its feet, creating pools that melt stone on contact.',
  '#6C3483','#A9CCE3'),

// Chain 10 — Water/Psychic (Mosasaur)
CRYOPHIN: _sp('CRYOPHIN','Cryophin',['WATER'],
  {hp:50,atk:45,def:40,spAtk:70,spDef:55,spd:65},
  _ls(
    1,'WATER_GUN',5,'BUBBLE',7,'CONFUSION',9,'AQUA_JET',
    10,['WATERFALL','SURF','AQUA_TAIL','SONIC_PULSE'],14,'WHIRLPOOL',20,'CLAMP',28,'WATER_SHURIKEN',
    36,'LEER'
  ),
  'GLACIOHORN',28,null,'Swift Swim','Speed doubles in rain',
  100,58,'MEDIUM',false,false,
  'A dolphin-like mosasaur that breathes ice crystals in frozen seas.',
  '#B3E5FC','#0288D1'),

GLACIOHORN: _sp('GLACIOHORN','Glaciohorn',['WATER','PSYCHIC'],
  {hp:70,atk:65,def:60,spAtk:100,spDef:80,spd:80},
  _ls(
    1,'WATER_GUN',5,'AQUA_JET',7,'CONFUSION',10,'WHIRLPOOL',
    16,'BUBBLE',22,'CLAMP',24,['WATERFALL','SURF','AQUA_TAIL','SONIC_PULSE'],28,'WATER_SHURIKEN',
    34,'LEER',40,'GROWL',48,'SMOKESCREEN',56,'TAIL_WHIP'
  ),
  'PERMAFROST',45,'CRYOPHIN','Ice Body','Heals in Hail; immune to freeze',
  50,140,'MEDIUM',false,false,
  'Its crystalline horn fires psychic blasts that instantly freeze the air.',
  '#7ECFF0','#01579B'),

PERMAFROST: _sp('PERMAFROST','Permafrost',['WATER','PSYCHIC'],
  {hp:100,atk:80,def:95,spAtk:125,spDef:100,spd:75},
  _ls(
    1,'WATER_GUN',5,'CLAMP',7,'BUBBLE',10,'WATER_SHURIKEN',
    13,'AQUA_JET',16,'WHIRLPOOL',22,'LEER',28,'GROWL',
    34,'SMOKESCREEN',40,'TAIL_WHIP',41,['WATERFALL','SURF','AQUA_TAIL','SONIC_PULSE'],46,'WORK_UP',
    52,'SWORDS_DANCE',54,['HYDRO_PUMP','ANCIENT_TORRENT','GLACIAL_MIND','CRABHAMMER'],58,'DRAGON_DANCE',64,'BULK_UP'
  ),
  null,null,'GLACIOHORN','Absolute Zero','20% chance to freeze attackers on contact',
  10,280,'SLOW',false,false,
  'A colossal mosasaur encased in living ice. Body temperature: −40°C.',
  '#E1F5FE','#01579B'),

// Chain 11 — Electric (Parasaurolophus)
SPARKHORN: _sp('SPARKHORN','Sparkhorn',['ELECTRIC'],
  {hp:52,atk:48,def:42,spAtk:65,spDef:50,spd:68},
  _ls(
    1,'THUNDER_SHOCK',5,'NUZZLE',6,'TAIL_WHIP',9,'CHARGE_BEAM',
    10,['SPARK','THUNDERBOLT','DISCHARGE','WILD_CHARGE'],14,'ZAP_BURST',20,'LEER',28,'GROWL',
    36,'SMOKESCREEN'
  ),
  'VOLTSCALE',20,null,'Static','30% chance to paralyse on contact',
  120,56,'MEDIUM',false,false,
  'A Parasaurolophus whose crest crackles with static electricity.',
  '#FFF176','#F9A825'),

VOLTSCALE: _sp('VOLTSCALE','Voltscale',['ELECTRIC'],
  {hp:65,atk:60,def:55,spAtk:82,spDef:62,spd:85},
  _ls(
    1,'THUNDER_SHOCK',5,'NUZZLE',6,'TAIL_WHIP',7,'CHARGE_BEAM',
    10,'ZAP_BURST',16,'LEER',22,'GROWL',24,['SPARK','THUNDERBOLT','DISCHARGE','WILD_CHARGE'],
    28,'SMOKESCREEN',34,'WORK_UP',40,'SWORDS_DANCE',48,'DRAGON_DANCE'
  ),
  'THUNDERSAUR',38,'SPARKHORN','Static','30% chance to paralyse on contact',
  70,122,'MEDIUM',false,false,
  'Its crest has grown into a fully developed lightning rod that attracts storms.',
  '#FFD600','#E65100'),

THUNDERSAUR: _sp('THUNDERSAUR','Thundersaur',['ELECTRIC','DRAGON'],
  {hp:85,atk:80,def:72,spAtk:110,spDef:82,spd:100},
  _ls(
    1,'THUNDER_SHOCK',5,'LEER',7,'CHARGE_BEAM',10,'GROWL',
    13,'NUZZLE',16,'ZAP_BURST',22,'SMOKESCREEN',28,'TAIL_WHIP',
    34,'WORK_UP',40,'SWORDS_DANCE',41,['SPARK','THUNDERBOLT','DISCHARGE','WILD_CHARGE'],46,'DRAGON_DANCE',
    52,'BULK_UP',54,['THUNDER','VOLT_TACKLE','ZAP_CANNON','PLASMA_FISTS'],58,'CALM_MIND',64,'NASTY_PLOT'
  ),
  null,null,'VOLTSCALE','Lightning Rod','Draws Electric attacks; Special Attack rises',
  25,248,'SLOW',false,false,
  'A storm-riding titan. Thunderclouds form naturally above its crest.',
  '#FFD600','#1A237E'),

// Chain 12 — Dark (Deinonychus raptor)
SHADOWLET: _sp('SHADOWLET','Shadowlet',['DARK'],
  {hp:42,atk:60,def:38,spAtk:45,spDef:40,spd:72},
  _ls(
    1,'SCRATCH',5,'SNARL',7,'BEAT_UP',9,'LEER',
    10,['BITE','CRUNCH','DARK_PULSE','NIGHT_SLASH'],14,'GROWL',20,'SMOKESCREEN',28,'TAIL_WHIP',
    36,'WORK_UP'
  ),
  'DUSKFANG',18,null,'Hustle','Attack +50%; accuracy −20%',
  130,52,'MEDIUM',false,false,
  'A feathered raptor that hunts in pitch darkness using infrared vision.',
  '#424242','#B71C1C'),

DUSKFANG: _sp('DUSKFANG','Duskfang',['DARK'],
  {hp:56,atk:80,def:52,spAtk:58,spDef:54,spd:90},
  _ls(
    1,'SCRATCH',5,'SNARL',7,'BEAT_UP',10,'BITE',
    16,'LEER',22,'GROWL',24,['CRUNCH','DARK_PULSE','NIGHT_SLASH','ASSURANCE'],28,'SMOKESCREEN',
    34,'TAIL_WHIP',40,'WORK_UP',48,'SWORDS_DANCE',56,'DRAGON_DANCE'
  ),
  'NIGHTREX',36,'SHADOWLET','Hustle','Attack +50%; accuracy −20%',
  70,118,'MEDIUM',false,false,
  'A pack hunter. It coordinates ambushes with low-frequency growls inaudible to humans.',
  '#1A1A2E','#C0392B'),

NIGHTREX: _sp('NIGHTREX','Nightrex',['DARK','FIGHTING'],
  {hp:75,atk:115,def:70,spAtk:75,spDef:70,spd:110},
  _ls(
    1,'BITE',5,'SMOKESCREEN',7,'BEAT_UP',10,'TAIL_WHIP',
    13,'LEER',16,'GROWL',22,'WORK_UP',28,'SWORDS_DANCE',
    34,'DRAGON_DANCE',40,'BULK_UP',41,['SNARL','CRUNCH','DARK_PULSE','NIGHT_SLASH'],46,'CALM_MIND',
    52,'NASTY_PLOT',54,['FOUL_PLAY','HYPERSPACE_FURY','SHADOW_RAID','VOID_BLAST'],58,'IRON_DEFENSE',64,'ROCK_POLISH'
  ),
  null,null,'DUSKFANG','Moxie','Attack rises by 1 stage each time it KOs a foe',
  20,252,'SLOW',false,false,
  'The apex nocturnal predator. Its claws can pierce reinforced steel.',
  '#0D0D1A','#C0392B'),

// Chain 13 — Normal (small herbivore)
NORMLET: _sp('NORMLET','Normlet',['NORMAL'],
  {hp:50,atk:45,def:40,spAtk:40,spDef:45,spd:55},
  _ls(
    1,'TACKLE',5,'GROWL',7,'SCRATCH',9,'POUND',
    10,['HEADBUTT','BODY_SLAM','SLAM_DOWN','HYPER_VOICE'],14,'QUICK_STRIKE',20,'QUICK_ATTACK',28,'RAPID_SPIN',
    36,'ECHOED_VOICE'
  ),
  'PACKDINO',18,null,'Run Away','Always escapes wild battles successfully',
  200,45,'FAST',false,false,
  'A tiny herbivore that travels in large herds for protection.',
  '#D4A96A','#F5DEB3'),

PACKDINO: _sp('PACKDINO','Packdino',['NORMAL'],
  {hp:65,atk:60,def:55,spAtk:52,spDef:58,spd:72},
  _ls(
    1,'TACKLE',5,'GROWL',7,'SCRATCH',10,'QUICK_ATTACK',
    16,'POUND',22,'QUICK_STRIKE',24,['HEADBUTT','BODY_SLAM','SLAM_DOWN','HYPER_VOICE'],28,'RAPID_SPIN',
    34,'ECHOED_VOICE',40,'BIDE',48,'SNORE',56,'ENDEAVOR'
  ),
  'HERDSAUR',34,'NORMLET','Herd Leader','Boosts own Attack when entering battle alone',
  120,100,'MEDIUM',false,false,
  'Travels in packs of hundreds. Any lone individual is restless and anxious.',
  '#C8A96E','#8D6E63'),

HERDSAUR: _sp('HERDSAUR','Herdsaur',['NORMAL','GROUND'],
  {hp:85,atk:82,def:78,spAtk:65,spDef:78,spd:88},
  _ls(
    1,'TACKLE',5,'QUICK_ATTACK',7,'SCRATCH',10,'RAPID_SPIN',
    13,'POUND',16,'QUICK_STRIKE',22,'ECHOED_VOICE',28,'BIDE',
    34,'SNORE',40,'ENDEAVOR',41,['HEADBUTT','BODY_SLAM','SLAM_DOWN','HYPER_VOICE'],46,'HORN_THRUST',
    52,'FURY_SWIPES',54,['HYPER_BEAM','DOUBLE_EDGE','LAST_RESORT','EXPLOSION'],58,'LEER',64,'GROWL'
  ),
  null,null,'HERDSAUR','Herd Leader','Boosts own Attack when entering battle alone',
  60,195,'MEDIUM',false,false,
  'The leader of vast dinosaur migrations. Its thundering footsteps reshape valleys.',
  '#C8A96E','#6D4C41'),

// Chain 14 — Ice (Shunosaurus ice variant)
FROSTLING: _sp('FROSTLING','Frostling',['ICE'],
  {hp:52,atk:50,def:55,spAtk:58,spDef:60,spd:38},
  _ls(
    1,'POUND',5,'TRIPLE_AXEL',6,'ICE_SHARD',9,'POWDER_SNOW',
    10,['ICE_BEAM','FREEZE_DRY','ICICLE_CRASH','FROST_BREATH'],14,'ICICLE_SPEAR',20,'SHEER_COLD',28,'ICE_SPIKE',
    36,'ABSOLUTE_ZERO'
  ),
  'BLIZZHORN',22,null,'Ice Body','Heals in Hail; immune to freeze',
  120,55,'MEDIUM',false,false,
  'A stocky sauropod whose breath crystallises into ice shards.',
  '#E3F2FD','#90CAF9'),

BLIZZHORN: _sp('BLIZZHORN','Blizzhorn',['ICE','ROCK'],
  {hp:68,atk:68,def:72,spAtk:75,spDef:75,spd:50},
  _ls(
    1,'POUND',5,'TRIPLE_AXEL',6,'ICE_SHARD',7,'POWDER_SNOW',
    10,'ICICLE_SPEAR',16,'SHEER_COLD',22,'ICE_SPIKE',24,['ICE_BEAM','FREEZE_DRY','ICICLE_CRASH','FROST_BREATH'],
    28,'ABSOLUTE_ZERO',34,'LEER',40,'GROWL',48,'SMOKESCREEN'
  ),
  'GLACIOKING',38,'FROSTLING','Ice Body','Heals in Hail; immune to freeze',
  70,125,'MEDIUM',false,false,
  'Rocky plates coat its sides, frozen solid by its own icy breath.',
  '#B3E5FC','#9E9E9E'),

GLACIOKING: _sp('GLACIOKING','Glacioking',['ICE','ROCK'],
  {hp:95,atk:90,def:100,spAtk:95,spDef:100,spd:55},
  _ls(
    1,'ICE_SHARD',5,'SHEER_COLD',7,'POWDER_SNOW',10,'LEER',
    12,'HAIL',16,'TRIPLE_AXEL',22,'ICICLE_SPEAR',28,'ICE_SPIKE',
    34,'ABSOLUTE_ZERO',40,'GROWL',41,['ICE_BEAM','FREEZE_DRY','ICICLE_CRASH','FROST_BREATH'],46,'SMOKESCREEN',
    52,'TAIL_WHIP',54,['BLIZZARD','ICE_HAMMER','MOUNTAIN_GALE','BLIZZARD_LANCE'],58,'WORK_UP',64,'SWORDS_DANCE'
  ),
  null,null,'BLIZZHORN','Snow Warning','Summons Hail when entering battle',
  20,245,'SLOW',false,false,
  'A glacial titan. Where it walks, blizzards follow.',
  '#B2EBF2','#546E7A'),

// Chain 15 — Steel (Ankylosaurus steel variant)
STEELBACK: _sp('STEELBACK','Steelback',['STEEL'],
  {hp:58,atk:62,def:75,spAtk:30,spDef:58,spd:30},
  _ls(
    1,'METAL_CLAW',5,'BULLET_PUNCH',6,'IRON_DEFENSE',9,'METAL_BURST',
    10,['IRON_HEAD','FLASH_CANNON','STEEL_WING','GYRO_BALL'],14,'METAL_BURST_STEEL',20,'IRON_FRENZY',28,'LEER',
    36,'GROWL'
  ),
  'IRONSCALE',22,null,'Sturdy','Survives one-hit KO moves with 1 HP',
  100,56,'MEDIUM',false,false,
  'Its natural scales are laced with iron ore from mineral-rich rock beds.',
  '#90A4AE','#CFD8DC'),

IRONSCALE: _sp('IRONSCALE','Ironscale',['STEEL','ROCK'],
  {hp:72,atk:80,def:95,spAtk:42,spDef:72,spd:42},
  _ls(
    1,'METAL_CLAW',5,'LEER',6,'IRON_DEFENSE',7,'BULLET_PUNCH',
    10,'METAL_BURST',16,'METAL_BURST_STEEL',22,'IRON_FRENZY',24,['IRON_HEAD','FLASH_CANNON','STEEL_WING','GYRO_BALL'],
    28,'GROWL',34,'SMOKESCREEN',40,'TAIL_WHIP',48,'WORK_UP'
  ),
  'TITANOSAUR',40,'STEELBACK','Sturdy','Survives one-hit KO moves with 1 HP',
  60,128,'MEDIUM',false,false,
  'Molten iron flows through channels in its armour, hardening on its surface.',
  '#78909C','#B0BEC5'),

TITANOSAUR: _sp('TITANOSAUR','Titanosaur',['STEEL','ROCK'],
  {hp:100,atk:105,def:130,spAtk:55,spDef:90,spd:45},
  _ls(
    1,'METAL_CLAW',5,'GROWL',7,'BULLET_PUNCH',10,'SMOKESCREEN',
    13,'METAL_BURST',16,'METAL_BURST_STEEL',22,'IRON_FRENZY',28,'LEER',
    34,'TAIL_WHIP',40,'WORK_UP',41,['IRON_HEAD','FLASH_CANNON','STEEL_WING','GYRO_BALL'],46,'SWORDS_DANCE',
    52,'DRAGON_DANCE',54,['STEEL_BEAM','IRON_TAIL','STEEL_ROLLER','HEAVY_SLAM'],58,'BULK_UP',64,'CALM_MIND'
  ),
  null,null,'TITANOSAUR','Filter','Reduces super-effective damage by 25%',
  15,260,'SLOW',false,false,
  'A walking fortress. Scientists estimate its armour could deflect artillery shells.',
  '#546E7A','#B0BEC5'),

// Chain 16 — Water/Ground (Iguanodon amphibious)
MUDFIN: _sp('MUDFIN','Mudfin',['WATER'],
  {hp:58,atk:55,def:58,spAtk:60,spDef:52,spd:42},
  _ls(
    1,'WATER_GUN',5,'AQUA_JET',6,'MUD_SLAP',9,'BUBBLE',
    10,['WATERFALL','SURF','AQUA_TAIL','SONIC_PULSE'],14,'WHIRLPOOL',20,'CLAMP',28,'WATER_SHURIKEN',
    36,'LEER'
  ),
  'SWAMPJAW',22,null,'Torrent','Water moves +50% when HP below 33%',
  110,56,'MEDIUM',false,false,
  'An amphibious iguanodont equally at home in rivers and swamps.',
  '#78909C','#4DB6AC'),

SWAMPJAW: _sp('SWAMPJAW','Swampjaw',['WATER','GROUND'],
  {hp:72,atk:70,def:72,spAtk:76,spDef:65,spd:55},
  _ls(
    1,'WATER_GUN',5,'WHIRLPOOL',6,'MUD_SLAP',7,'BUBBLE',
    10,'AQUA_JET',16,'CLAMP',22,'WATER_SHURIKEN',24,['WATERFALL','SURF','AQUA_TAIL','SONIC_PULSE'],
    28,'LEER',34,'GROWL',40,'SMOKESCREEN',48,'TAIL_WHIP'
  ),
  'SWAMPZILLA',38,'MUDFIN','Torrent','Water moves +50% when HP below 33%',
  65,128,'MEDIUM',false,false,
  'Lurks below murky water, ambushing prey with powerful jaw snaps.',
  '#546E7A','#26A69A'),

SWAMPZILLA: _sp('SWAMPZILLA','Swampzilla',['WATER','GROUND'],
  {hp:100,atk:90,def:95,spAtk:95,spDef:82,spd:62},
  _ls(
    1,'SURF',5,'WHIRLPOOL',7,'WATER_GUN',10,'CLAMP',
    13,'BUBBLE',16,'AQUA_JET',22,'WATER_SHURIKEN',28,'LEER',
    34,'GROWL',40,'SMOKESCREEN',41,['WATERFALL','AQUA_TAIL','SONIC_PULSE','NECK_LASSO'],46,'TAIL_WHIP',
    52,'WORK_UP',54,['HYDRO_PUMP','ANCIENT_TORRENT','GLACIAL_MIND','CRABHAMMER'],58,'SWORDS_DANCE',64,'DRAGON_DANCE'
  ),
  null,null,'SWAMPZILLA','Swamp King','Water and Ground moves each gain +15% power',
  20,245,'SLOW',false,false,
  'The undisputed ruler of the wetlands. Its roar silences entire marshes.',
  '#37474F','#26A69A'),

// Chain 17 — Flying/Dragon (Quetzalcoatlus)
SOARWING: _sp('SOARWING','Soarwing',['FLYING'],
  {hp:42,atk:58,def:38,spAtk:48,spDef:42,spd:78},
  _ls(
    1,'GUST',5,'LEER',6,'WING_ATTACK',9,'PECK',
    10,['AERIAL_ACE','AIR_SLASH','FLY','OBLIVION_WING'],14,'AERIAL_VOLLEY',20,'GROWL',28,'SMOKESCREEN',
    36,'TAIL_WHIP'
  ),
  'GLIDEREX',20,null,'Keen Eye','Accuracy cannot be lowered',
  130,52,'MEDIUM',false,false,
  'A small pterosaur that rides thermals high above mountain ranges.',
  '#CE93D8','#AB47BC'),

GLIDEREX: _sp('GLIDEREX','Gliderex',['FLYING','DRAGON'],
  {hp:58,atk:78,def:52,spAtk:68,spDef:58,spd:95},
  _ls(
    1,'GUST',5,'LEER',6,'WING_ATTACK',7,'PECK',
    10,'AERIAL_VOLLEY',16,'GROWL',22,'SMOKESCREEN',24,['AERIAL_ACE','AIR_SLASH','FLY','OBLIVION_WING'],
    28,'TAIL_WHIP',34,'WORK_UP',40,'SWORDS_DANCE',48,'DRAGON_DANCE'
  ),
  'SKYMASTER',38,'SOARWING','Keen Eye','Accuracy cannot be lowered',
  70,125,'MEDIUM',false,false,
  'Wingspan reaches 4 metres. Glides silently for hundreds of kilometres.',
  '#9C27B0','#F8BBD9'),

SKYMASTER: _sp('SKYMASTER','Skymaster',['FLYING','DRAGON'],
  {hp:82,atk:108,def:75,spAtk:95,spDef:75,spd:118},
  _ls(
    1,'GUST',5,'GROWL',7,'PECK',10,'SMOKESCREEN',
    13,'LEER',16,'AERIAL_VOLLEY',22,'TAIL_WHIP',28,'WORK_UP',
    34,'SWORDS_DANCE',40,'DRAGON_DANCE',41,['AERIAL_ACE','WING_ATTACK','AIR_SLASH','FLY'],46,'BULK_UP',
    52,'CALM_MIND',54,['BRAVE_BIRD','HURRICANE','SKY_ATTACK','AERIAL_SLAM'],58,'NASTY_PLOT',64,'IRON_DEFENSE'
  ),
  null,null,'SKYMASTER','Speed Boost','Speed increases by 1 stage each turn',
  20,255,'SLOW',false,false,
  'The largest flying creature ever to exist. Its shadow covers entire towns.',
  '#6A0080','#F48FB1'),

// Chain 18 — Fighting (Carnotaurus)
FIGHTCLAW: _sp('FIGHTCLAW','Fightclaw',['FIGHTING'],
  {hp:50,atk:70,def:45,spAtk:35,spDef:40,spd:65},
  _ls(
    1,'SCRATCH',5,'KARATE_CHOP',7,'MACH_PUNCH',9,'VACUUM_WAVE',
    10,['SUBMISSION','DRAIN_PUNCH','AURA_SPHERE','LOW_SWEEP'],14,'LOW_KICK',20,'ROCK_SMASH',28,'ARM_THRUST',
    36,'JAB_FLURRY'
  ),
  'POWERDON',20,null,'Guts','Attack +50% when afflicted with a status condition',
  120,56,'MEDIUM',false,false,
  'A fierce Carnotaurus with powerful forearms. Born to brawl.',
  '#EF5350','#B71C1C'),

POWERDON: _sp('POWERDON','Powerdon',['FIGHTING','ROCK'],
  {hp:65,atk:92,def:60,spAtk:45,spDef:55,spd:80},
  _ls(
    1,'SCRATCH',5,'KARATE_CHOP',7,'VACUUM_WAVE',10,'MACH_PUNCH',
    16,'LOW_KICK',22,'ROCK_SMASH',24,['SUBMISSION','DRAIN_PUNCH','AURA_SPHERE','LOW_SWEEP'],28,'ARM_THRUST',
    34,'JAB_FLURRY',40,'POWER_TRIP',48,'TWIN_KICK',56,'LEER'
  ),
  'RAMPASAUR',36,'FIGHTCLAW','Guts','Attack +50% when afflicted with a status condition',
  70,125,'MEDIUM',false,false,
  'Trains by headbutting boulders. Each fight leaves it stronger.',
  '#C62828','#FF8F00'),

RAMPASAUR: _sp('RAMPASAUR','Rampasaur',['FIGHTING','ROCK'],
  {hp:85,atk:125,def:82,spAtk:60,spDef:72,spd:95},
  _ls(
    1,'MACH_PUNCH',5,'LOW_KICK',7,'KARATE_CHOP',10,'ROCK_SMASH',
    13,'VACUUM_WAVE',16,'ARM_THRUST',22,'JAB_FLURRY',28,'POWER_TRIP',
    34,'TWIN_KICK',40,'LEER',41,['SUBMISSION','DRAIN_PUNCH','AURA_SPHERE','LOW_SWEEP'],46,'GROWL',
    52,'SMOKESCREEN',54,['DYNAMIC_PUNCH','CLOSE_COMBAT','CROSS_CHOP','SUPERPOWER'],58,'TAIL_WHIP',64,'WORK_UP'
  ),
  null,null,'RAMPASAUR','No Guard','All moves hit regardless of accuracy checks',
  20,252,'SLOW',false,false,
  'When it charges, nothing can stand in its path. Mountains crack.',
  '#B71C1C','#F57F17'),

// Chain 19 — Ghost (fossil-ghost Ankylosaurus)
GHOSTBONE: _sp('GHOSTBONE','Ghostbone',['GHOST'],
  {hp:42,atk:45,def:52,spAtk:62,spDef:55,spd:48},
  _ls(
    1,'NIGHT_SHADE',5,'SHADOW_SNEAK',6,'CONFUSE_RAY',9,'BONE_RUSH_GHOST',
    10,['SHADOW_BALL','SHADOW_CLAW','PHANTOM_FORCE','HEX'],14,'LEER',20,'GROWL',28,'SMOKESCREEN',
    36,'TAIL_WHIP'
  ),
  'SPIRITHORN',22,null,'Levitate','Immune to Ground-type moves',
  130,52,'MEDIUM',false,false,
  'The ghost of an ancient ankylosaur. Appears near fossil excavation sites.',
  '#4A148C','#E1BEE7'),

SPIRITHORN: _sp('SPIRITHORN','Spirithorn',['GHOST','ROCK'],
  {hp:58,atk:60,def:70,spAtk:80,spDef:68,spd:58},
  _ls(
    1,'NIGHT_SHADE',5,'LEER',6,'CONFUSE_RAY',7,'SHADOW_SNEAK',
    10,'BONE_RUSH_GHOST',16,'GROWL',22,'SMOKESCREEN',24,['SHADOW_BALL','SHADOW_CLAW','PHANTOM_FORCE','HEX'],
    28,'TAIL_WHIP',34,'WORK_UP',40,'SWORDS_DANCE',48,'DRAGON_DANCE'
  ),
  'PHANTOSAUR',38,'GHOSTBONE','Levitate','Immune to Ground-type moves',
  70,120,'MEDIUM',false,false,
  'Spectral spines erupt from its fossil shell. Phases through solid rock.',
  '#311B92','#D1C4E9'),

PHANTOSAUR: _sp('PHANTOSAUR','Phantosaur',['GHOST','DRAGON'],
  {hp:80,atk:85,def:90,spAtk:105,spDef:90,spd:68},
  _ls(
    1,'NIGHT_SHADE',5,'SMOKESCREEN',7,'SHADOW_SNEAK',10,'TAIL_WHIP',
    13,'LEER',16,'BONE_RUSH_GHOST',22,'GROWL',28,'WORK_UP',
    34,'SWORDS_DANCE',40,'DRAGON_DANCE',41,['SHADOW_BALL','SHADOW_CLAW','PHANTOM_FORCE','HEX'],46,'BULK_UP',
    52,'CALM_MIND',54,['POLTERGEIST','DREAM_EATER','MOONGEIST_BEAM','ASTRAL_BARRAGE'],58,'NASTY_PLOT',64,'IRON_DEFENSE'
  ),
  null,null,'PHANTOSAUR','Shadow Shield','Takes half damage at full HP',
  15,258,'SLOW',false,false,
  'An ancient dragon reborn as pure spectral energy. Exists between life and fossil.',
  '#1A0050','#9575CD'),

// Chain 20 — Poison (Dilophosaurus venom)
VIPERFANG: _sp('VIPERFANG','Viperfang',['POISON'],
  {hp:48,atk:58,def:42,spAtk:68,spDef:48,spd:68},
  _ls(
    1,'POISON_STING',5,'POISON_FANG',7,'POISON_GAS',9,'ACID',
    10,['SLUDGE_BOMB','SLUDGE','VENOSHOCK','CROSS_POISON'],14,'ACID_SPRAY',20,'MORTAL_SPIN',28,'CLEAR_SMOG',
    36,'VENOM_DRIP'
  ),
  'TOXIDRAW',20,null,'Poison Point','30% chance to poison on contact',
  120,56,'MEDIUM',false,false,
  'A Dilophosaurus whose frills spray a venom potent enough to melt stone.',
  '#AB47BC','#7B1FA2'),

TOXIDRAW: _sp('TOXIDRAW','Toxidraw',['POISON','DARK'],
  {hp:62,atk:72,def:55,spAtk:85,spDef:62,spd:80},
  _ls(
    1,'POISON_STING',5,'ACID_SPRAY',7,'POISON_GAS',10,'MORTAL_SPIN',
    16,'POISON_FANG',22,'ACID',24,['SLUDGE_BOMB','SLUDGE','VENOSHOCK','CROSS_POISON'],28,'CLEAR_SMOG',
    34,'VENOM_DRIP',40,'LEER',48,'GROWL',56,'SMOKESCREEN'
  ),
  'VENOMSAUR',36,'VIPERFANG','Poison Point','30% chance to poison on contact',
  70,125,'MEDIUM',false,false,
  'Its dark scales absorb venom from its own bites, growing ever more toxic.',
  '#6A1B9A','#4A148C'),

VENOMSAUR: _sp('VENOMSAUR','Venomsaur',['POISON','DARK'],
  {hp:82,atk:92,def:72,spAtk:108,spDef:82,spd:92},
  _ls(
    1,'POISON_FANG',5,'ACID_SPRAY',7,'POISON_STING',10,'MORTAL_SPIN',
    13,'SLUDGE_BOMB',16,'ACID',22,'CLEAR_SMOG',28,'VENOM_DRIP',
    34,'LEER',40,'GROWL',41,['SLUDGE','VENOSHOCK','CROSS_POISON','POISON_JAB'],46,'SMOKESCREEN',
    52,'TAIL_WHIP',54,['SLUDGE_WAVE','GUNK_SHOT','BELCH','NOXIOUS_TORQUE'],58,'WORK_UP',64,'SWORDS_DANCE'
  ),
  null,null,'VENOMSAUR','Corrosion','Can inflict poison on any type, including Steel and Poison',
  20,248,'SLOW',false,false,
  'The most venomous DinoMon known. A single drop of its venom can dissolve metal.',
  '#4A0072','#212121'),

// Chain 21 — Bug (tiny ceratopsian insectivore)
BUGLING: _sp('BUGLING','Bugling',['BUG'],
  {hp:42,atk:48,def:45,spAtk:52,spDef:42,spd:65},
  _ls(
    1,'STRING_SHOT',5,'BUG_BITE',7,'PIN_MISSILE',9,'FURY_CUTTER',
    10,['SIGNAL_BEAM','X_SCISSOR','LEECH_LIFE','SILVER_WIND'],14,'STRUGGLE_BUG',20,'INFESTATION',28,'MULTIBITE',
    36,'LEER'
  ),
  'BUGCLAW',18,null,'Compound Eyes','Accuracy increased by 30%',
  150,48,'FAST',false,false,
  'A tiny feathered dinosaur that hunts insects with pinpoint precision.',
  '#8BC34A','#558B2F'),

BUGCLAW: _sp('BUGCLAW','Bugclaw',['BUG','GRASS'],
  {hp:56,atk:65,def:58,spAtk:68,spDef:58,spd:78},
  _ls(
    1,'STRING_SHOT',5,'BUG_BITE',7,'FURY_CUTTER',10,'PIN_MISSILE',
    16,'STRUGGLE_BUG',22,'INFESTATION',24,['SIGNAL_BEAM','X_SCISSOR','LEECH_LIFE','SILVER_WIND'],28,'MULTIBITE',
    34,'LEER',40,'GROWL',48,'SMOKESCREEN',56,'TAIL_WHIP'
  ),
  'INSECTADON',34,'BUGLING','Compound Eyes','Accuracy increased by 30%',
  90,110,'MEDIUM',false,false,
  'Its wing-like feathers are strong enough to carry large prey off the ground.',
  '#558B2F','#33691E'),

INSECTADON: _sp('INSECTADON','Insectadon',['BUG','GRASS'],
  {hp:78,atk:88,def:78,spAtk:90,spDef:82,spd:92},
  _ls(
    1,'BUG_BITE',5,'INFESTATION',7,'FURY_CUTTER',10,'LEER',
    13,'PIN_MISSILE',16,'STRUGGLE_BUG',22,'MULTIBITE',28,'GROWL',
    34,'SMOKESCREEN',40,'TAIL_WHIP',41,['SIGNAL_BEAM','X_SCISSOR','LEECH_LIFE','SILVER_WIND'],46,'WORK_UP',
    52,'SWORDS_DANCE',54,['MEGAHORN','SWARM_STRIKE','CARAPACE_CRASH','COLONY_STRIKE'],58,'DRAGON_DANCE',64,'BULK_UP'
  ),
  null,null,'INSECTADON','Swarm','Bug moves +50% when HP below 33%',
  30,225,'MEDIUM',false,false,
  'Can consume an entire forest\'s insect population in a single day. Keeps forests in balance.',
  '#33691E','#76FF03'),

// Chain 22 — Fairy (flower Protoceratops)
FAIRYWING: _sp('FAIRYWING','Fairywing',['FAIRY'],
  {hp:46,atk:44,def:50,spAtk:62,spDef:58,spd:52},
  _ls(
    1,'FAIRY_WIND',5,'DISARMING_VOICE',6,'CHARM',9,'DRAINING_KISS',
    10,['DAZZLING_GLEAM','PLAY_ROUGH','SPIRIT_BREAK','STRANGE_STEAM'],14,'PIXIE_STRIKE',20,'LEER',28,'GROWL',
    36,'SMOKESCREEN'
  ),
  'BLOOMSAUR',20,null,'Cute Charm','30% chance to infatuate foes that make contact',
  130,50,'FAST',false,false,
  'Flowers bloom wherever it walks. Local farmers consider it a good omen.',
  '#F8BBD9','#F48FB1'),

BLOOMSAUR: _sp('BLOOMSAUR','Bloomsaur',['FAIRY','GRASS'],
  {hp:60,atk:56,def:64,spAtk:80,spDef:75,spd:65},
  _ls(
    1,'FAIRY_WIND',5,'DRAINING_KISS',6,'CHARM',7,'DISARMING_VOICE',
    10,'PIXIE_STRIKE',16,'LEER',22,'GROWL',24,['DAZZLING_GLEAM','PLAY_ROUGH','SPIRIT_BREAK','STRANGE_STEAM'],
    28,'SMOKESCREEN',34,'TAIL_WHIP',40,'WORK_UP',48,'SWORDS_DANCE'
  ),
  'FLOROSAUR',36,'FAIRYWING','Cute Charm','30% chance to infatuate foes that make contact',
  75,118,'MEDIUM',false,false,
  'Its frill has bloomed into a crown of glowing flowers that pulse with fairy light.',
  '#E91E63','#FF80AB'),

FLOROSAUR: _sp('FLOROSAUR','Florosaur',['FAIRY','GRASS'],
  {hp:82,atk:72,def:85,spAtk:105,spDef:98,spd:72},
  _ls(
    1,'FAIRY_WIND',5,'LEER',7,'DISARMING_VOICE',10,'GROWL',
    12,'DAZZLING_GLEAM',16,'DRAINING_KISS',22,'PIXIE_STRIKE',28,'SMOKESCREEN',
    34,'TAIL_WHIP',40,'WORK_UP',41,['PLAY_ROUGH','SPIRIT_BREAK','STRANGE_STEAM','FAIRY_BURST'],46,'SWORDS_DANCE',
    52,'DRAGON_DANCE',54,['MOONBLAST','LIGHT_OF_RUIN','FLEUR_CANNON','MOONFORCE'],58,'BULK_UP',64,'CALM_MIND'
  ),
  null,null,'FLOROSAUR','Pixilate','Normal-type moves become Fairy-type and gain 20% power',
  25,240,'SLOW',false,false,
  'A living garden. Poets say its song can make flowers bloom in winter.',
  '#C2185B','#FF80AB'),

// Chain 22b — Fairy (crystal/gem Protoceratops) — Fairy-gym line
GEMLET: _sp('GEMLET','Gemlet',['FAIRY'],
  {hp:48,atk:46,def:55,spAtk:58,spDef:60,spd:50},
  _ls(
    1,'FAIRY_WIND',1,'TACKLE',5,'DISARMING_VOICE',9,'DRAINING_KISS',
    13,'CHARM',17,'DAZZLING_GLEAM',22,'PIXIE_STRIKE',28,'PLAY_ROUGH'
  ),
  'GEMHORN',18,null,'Synchronize','Passes burns, poison and paralysis back to the attacker',
  130,52,'MEDIUM',false,false,
  'Its frill is studded with raw gemstones that chime softly when it is happy.',
  '#9FE7F5','#5AC8E0'),

GEMHORN: _sp('GEMHORN','Gemhorn',['FAIRY'],
  {hp:62,atk:58,def:72,spAtk:78,spDef:80,spd:62},
  _ls(
    1,'FAIRY_WIND',1,'DISARMING_VOICE',9,'DRAINING_KISS',13,'CHARM',
    18,'DAZZLING_GLEAM',24,'PIXIE_STRIKE',30,'PLAY_ROUGH',38,'SPIRIT_BREAK'
  ),
  'PRISMACERA',36,'GEMLET','Synchronize','Passes burns, poison and paralysis back to the attacker',
  75,120,'MEDIUM',false,false,
  'The gems on its crown refract light into dazzling rainbows that mesmerise prey.',
  '#7FD8EE','#3FB0D8'),

PRISMACERA: _sp('PRISMACERA','Prismacera',['FAIRY'],
  {hp:80,atk:74,def:95,spAtk:108,spDef:100,spd:70},
  _ls(
    1,'FAIRY_WIND',1,'DAZZLING_GLEAM',18,'PIXIE_STRIKE',24,'PLAY_ROUGH',
    30,'SPIRIT_BREAK',40,['MOONBLAST','FLEUR_CANNON','LIGHT_OF_RUIN','MOONFORCE'],48,'CALM_MIND',54,'DRAGON_DANCE'
  ),
  null,null,'GEMHORN','Pixilate','Normal-type moves become Fairy-type and gain 20% power',
  25,238,'MEDIUM',false,false,
  'A crystalline titan whose prismatic frill can focus moonlight into a devastating beam.',
  '#56C6E6','#2E8FC0'),

// Chain 22c — Fairy/Flying (pixie-moth Pterosaur) — Fairy-gym line
WISPLET: _sp('WISPLET','Wisplet',['FAIRY'],
  {hp:44,atk:42,def:46,spAtk:60,spDef:54,spd:62},
  _ls(
    1,'FAIRY_WIND',1,'GROWL',5,'DISARMING_VOICE',9,'DRAINING_KISS',
    13,'QUICK_ATTACK',17,'DAZZLING_GLEAM',22,'AIR_SLASH',28,'PIXIE_STRIKE'
  ),
  'FLUTTERHORN',18,null,'Cute Charm','30% chance to infatuate foes that make contact',
  130,54,'FAST',false,false,
  'A tiny winged sprite that drifts on the breeze like a glowing wisp at dusk.',
  '#F3C7FF','#D79CFF'),

FLUTTERHORN: _sp('FLUTTERHORN','Flutterhorn',['FAIRY','FLYING'],
  {hp:58,atk:54,def:58,spAtk:80,spDef:70,spd:84},
  _ls(
    1,'FAIRY_WIND',1,'AIR_SLASH',13,'QUICK_ATTACK',18,'DAZZLING_GLEAM',
    24,'WING_ATTACK',30,'PIXIE_STRIKE',36,'AERIAL_ACE',42,'PLAY_ROUGH'
  ),
  'SERAPHWING',36,'WISPLET','Cute Charm','30% chance to infatuate foes that make contact',
  75,122,'FAST',false,false,
  'Its luminous wings scatter fairy dust that lulls would-be predators to sleep.',
  '#E6A8FF','#C77DFF'),

SERAPHWING: _sp('SERAPHWING','Seraphwing',['FAIRY','FLYING'],
  {hp:76,atk:70,def:74,spAtk:106,spDef:92,spd:104},
  _ls(
    1,'FAIRY_WIND',1,'AIR_SLASH',18,'DAZZLING_GLEAM',24,'WING_ATTACK',
    30,'AERIAL_ACE',38,'PIXIE_STRIKE',44,['MOONBLAST','FLEUR_CANNON','MOONFORCE','DAZZLING_GLEAM'],52,'CALM_MIND',58,'HURRICANE'
  ),
  null,null,'FLUTTERHORN','Pixilate','Normal-type moves become Fairy-type and gain 20% power',
  25,242,'FAST',false,false,
  'Six radiant wings carry it above the clouds; sailors call it the dawn-herald.',
  '#D98CFF','#B45CF5'),

// Chain 23 — Rock (heavy Sauropod)
ROCKLETT: _sp('ROCKLETT','Rocklett',['ROCK'],
  {hp:55,atk:65,def:72,spAtk:28,spDef:52,spd:30},
  _ls(
    1,'ROCK_THROW',5,'ROCK_BLAST',6,'HEADBUTT',9,'ROLLOUT',
    10,['ROCK_SLIDE','ANCIENT_POWER','SMASH_DOWN','POWER_GEM'],14,'ACCELEROCK',20,'MINERAL_BURST',28,'LEER',
    36,'GROWL'
  ),
  'BOULDERFANG',22,null,'Sand Stream','Summons Sandstorm when entering battle',
  120,55,'MEDIUM',false,false,
  'A small sauropod whose body is coated in mineral deposits from its habitat.',
  '#A1887F','#D7CCC8'),

BOULDERFANG: _sp('BOULDERFANG','Boulderfang',['ROCK','GROUND'],
  {hp:70,atk:82,def:90,spAtk:35,spDef:68,spd:40},
  _ls(
    1,'ROCK_THROW',5,'ROCK_BLAST',6,'HEADBUTT',7,'ROLLOUT',
    10,'ACCELEROCK',16,'MINERAL_BURST',22,'LEER',24,['ROCK_SLIDE','ANCIENT_POWER','SMASH_DOWN','POWER_GEM'],
    28,'GROWL',34,'SMOKESCREEN',40,'TAIL_WHIP',48,'WORK_UP'
  ),
  'MEGASTONE',38,'ROCKLETT','Sand Stream','Summons Sandstorm when entering battle',
  65,128,'MEDIUM',false,false,
  'Boulder-sized deposits now cover its body. Moves slowly but hits like an avalanche.',
  '#795548','#BCAAA4'),

MEGASTONE: _sp('MEGASTONE','Megastone',['ROCK','GROUND'],
  {hp:100,atk:108,def:125,spAtk:50,spDef:85,spd:38},
  _ls(
    1,'ROCK_THROW',5,'GROWL',7,'ROLLOUT',10,'SMOKESCREEN',
    13,'ACCELEROCK',16,'ROCK_BLAST',22,'MINERAL_BURST',28,'LEER',
    34,'TAIL_WHIP',40,'WORK_UP',41,['ROCK_SLIDE','ANCIENT_POWER','SMASH_DOWN','POWER_GEM'],46,'SWORDS_DANCE',
    52,'DRAGON_DANCE',54,['STONE_EDGE','SKULL_SLAM','HEAD_SMASH','DIAMOND_STORM'],58,'BULK_UP',64,'CALM_MIND'
  ),
  null,null,'MEGASTONE','Sand Force','Rock, Ground and Steel moves +30% in Sandstorm',
  15,262,'SLOW',false,false,
  'A living mountain range. Geologists frequently mistake it for a new rock formation.',
  '#6D4C41','#BCAAA4'),

// Chain 24 — Ground (Desert Carnotaurus variant)
SANDCLAW: _sp('SANDCLAW','Sandclaw',['GROUND'],
  {hp:46,atk:62,def:42,spAtk:38,spDef:42,spd:70},
  _ls(
    1,'SCRATCH',5,'SAND_ATTACK',7,'MUD_SLAP',9,'BONE_RUSH',
    10,['BULLDOZE','DIG','MAGNITUDE','CLUB_SMASH'],14,'FISSURE',20,'MUDSLAP',28,'BONEMERANG',
    36,'SAND_TOMB'
  ),
  'DESERTFANG',20,null,'Sand Rush','Speed doubles in Sandstorm',
  130,54,'MEDIUM',false,false,
  'A desert theropod that stirs up sandstorms as it runs to obscure its trail.',
  '#FFCC80','#FF8F00'),

DESERTFANG: _sp('DESERTFANG','Desertfang',['GROUND','DARK'],
  {hp:60,atk:82,def:55,spAtk:50,spDef:55,spd:88},
  _ls(
    1,'SCRATCH',5,'SAND_ATTACK',7,'MUD_SLAP',10,'BONE_RUSH',
    16,'FISSURE',22,'MUDSLAP',24,['BULLDOZE','DIG','MAGNITUDE','CLUB_SMASH'],28,'BONEMERANG',
    34,'SAND_TOMB',40,'LEER',48,'GROWL',56,'SMOKESCREEN'
  ),
  'DUNECROWN',36,'SANDCLAW','Sand Rush','Speed doubles in Sandstorm',
  70,122,'MEDIUM',false,false,
  'Hunts by burying itself in sand and erupting beneath unsuspecting prey.',
  '#F57F17','#3E2723'),

DUNECROWN: _sp('DUNECROWN','Dunecrown',['GROUND','DARK'],
  {hp:80,atk:108,def:75,spAtk:65,spDef:72,spd:105},
  _ls(
    1,'SCRATCH',5,'FISSURE',7,'MUD_SLAP',10,'MUDSLAP',
    13,'BONE_RUSH',16,'BONEMERANG',22,'SAND_TOMB',28,'LEER',
    34,'GROWL',40,'SMOKESCREEN',41,['BULLDOZE','DIG','MAGNITUDE','CLUB_SMASH'],46,'TAIL_WHIP',
    52,'WORK_UP',54,['EARTHQUAKE','HIGH_HORSEPOWER','PRECIPICE_BLADES','TECTONIC_RAGE'],58,'SWORDS_DANCE',64,'DRAGON_DANCE'
  ),
  null,null,'DUNECROWN','Sand Veil','Evasion +20% during Sandstorm',
  20,248,'SLOW',false,false,
  'The apex predator of the desert. Its crown of sand perpetually swirls around it.',
  '#E65100','#1A0A00'),

// Chain 25 — Grass/Fighting (Jungle Edmontosaurus)
LEAFCUB: _sp('LEAFCUB','Leafcub',['GRASS'],
  {hp:50,atk:46,def:48,spAtk:58,spDef:55,spd:50},
  _ls(
    1,'VINE_WHIP',5,'RAZOR_LEAF',6,'GROWL',9,'MEGA_DRAIN',
    10,['GIGA_DRAIN','ENERGY_BALL','SPORE_BURST','FOREST_CANOPY'],14,'BULLET_SEED',20,'SNAP_TRAP',28,'TRAILBLAZE',
    36,'TANGLE_SHOT'
  ),
  'SPRIGDON',20,null,'Overgrow','Grass moves +50% when HP below 33%',
  130,52,'MEDIUM',false,false,
  'A young jungle herbivore that punches through undergrowth with leafy fists.',
  '#66BB6A','#1B5E20'),

SPRIGDON: _sp('SPRIGDON','Sprigdon',['GRASS','FIGHTING'],
  {hp:64,atk:65,def:62,spAtk:72,spDef:68,spd:65},
  _ls(
    1,'VINE_WHIP',5,'BULLET_SEED',6,'GROWL',7,'MEGA_DRAIN',
    10,'RAZOR_LEAF',16,'SNAP_TRAP',22,'TRAILBLAZE',24,['GIGA_DRAIN','ENERGY_BALL','SPORE_BURST','FOREST_CANOPY'],
    28,'TANGLE_SHOT',34,'LEER',40,'SMOKESCREEN',48,'TAIL_WHIP'
  ),
  'JUNGLESAUR',36,'LEAFCUB','Overgrow','Grass moves +50% when HP below 33%',
  70,122,'MEDIUM',false,false,
  'A herbivore but an excellent fighter. Defends its jungle territory ferociously.',
  '#388E3C','#FF5722'),

JUNGLESAUR: _sp('JUNGLESAUR','Junglesaur',['GRASS','FIGHTING'],
  {hp:88,atk:95,def:85,spAtk:92,spDef:88,spd:78},
  _ls(
    1,'VINE_WHIP',5,'BULLET_SEED',7,'RAZOR_LEAF',10,'SNAP_TRAP',
    13,'MEGA_DRAIN',16,'TRAILBLAZE',22,'TANGLE_SHOT',28,'LEER',
    34,'GROWL',40,'SMOKESCREEN',41,['GIGA_DRAIN','ENERGY_BALL','SPORE_BURST','FOREST_CANOPY'],46,'TAIL_WHIP',
    52,'WORK_UP',54,['SOLAR_BEAM','JADE_PLATE_SLAM','LEAF_STORM','PETAL_DANCE'],58,'SWORDS_DANCE',64,'DRAGON_DANCE'
  ),
  null,null,'JUNGLESAUR','Jungle King','Grass and Fighting moves each gain +15% power',
  20,248,'SLOW',false,false,
  'The undisputed ruler of the rainforest. Its battle cry travels for 50 kilometres.',
  '#1B5E20','#BF360C'),

// Chain 26 — Fire/Ground (Lava Allosaurus)
FIRECOAL: _sp('FIRECOAL','Firecoal',['FIRE'],
  {hp:46,atk:60,def:42,spAtk:58,spDef:40,spd:60},
  _ls(
    1,'EMBER',5,'FIRE_SPIN',6,'SCRATCH',9,'ERUPTION_HORN',
    10,['FLAME_CHARGE','FLAMETHROWER','LAVA_PLUME','FRILL_FLARE'],14,'FIREWORKS',20,'IMMOLATION',28,'FIRECRACKER',
    36,'LEER'
  ),
  'LAVACLAW',20,null,'Blaze','Fire moves +50% when HP below 33%',
  130,54,'MEDIUM',false,false,
  'A young Allosaurus that has adapted to live near active volcanic vents.',
  '#FF7043','#BF360C'),

LAVACLAW: _sp('LAVACLAW','Lavaclaw',['FIRE','GROUND'],
  {hp:62,atk:80,def:56,spAtk:75,spDef:55,spd:78},
  _ls(
    1,'EMBER',5,'GROWL',7,'ERUPTION_HORN',10,'SMOKESCREEN',
    16,'FIRE_SPIN',22,'FIREWORKS',24,['FLAME_CHARGE','FLAMETHROWER','LAVA_PLUME','FRILL_FLARE'],28,'IMMOLATION',
    34,'FIRECRACKER',40,'LEER',48,'TAIL_WHIP',56,'WORK_UP'
  ),
  'MAGMADON',36,'FIRECOAL','Flame Body','10% chance to burn foes that make contact',
  70,124,'MEDIUM',false,false,
  'Bathes in lava pools to shed old scales and emerge stronger. Burns through solid rock.',
  '#E64A19','#4E342E'),

MAGMADON: _sp('MAGMADON','Magmadon',['FIRE','GROUND'],
  {hp:85,atk:108,def:78,spAtk:100,spDef:75,spd:88},
  _ls(
    1,'EMBER',5,'LEER',7,'FIRE_SPIN',10,'GROWL',
    13,'ERUPTION_HORN',16,'FIREWORKS',22,'IMMOLATION',28,'FIRECRACKER',
    34,'SMOKESCREEN',40,'TAIL_WHIP',41,['FLAME_CHARGE','FLAMETHROWER','LAVA_PLUME','FRILL_FLARE'],46,'WORK_UP',
    52,'SWORDS_DANCE',54,['FIRE_BLAST','OVERHEAT','ERUPTION','EXTINCTION_BEAM'],58,'DRAGON_DANCE',64,'BULK_UP'
  ),
  null,null,'MAGMADON','Drought','Summons intense sunlight when entering battle',
  20,252,'SLOW',false,false,
  'Formed from solidified magma. Every step leaves a trail of melted stone.',
  '#BF360C','#212121'),

// Chain 27 — Water/Dark (Deep sea Mosasaur)
AQUAFLIP: _sp('AQUAFLIP','Aquaflip',['WATER'],
  {hp:44,atk:50,def:44,spAtk:66,spDef:50,spd:62},
  _ls(
    1,'WATER_GUN',5,'AQUA_JET',6,'BUBBLE',9,'WHIRLPOOL',
    10,['WATERFALL','SURF','AQUA_TAIL','SONIC_PULSE'],14,'CLAMP',20,'WATER_SHURIKEN',28,'LEER',
    36,'GROWL'
  ),
  'SEAFANG',20,null,'Swift Swim','Speed doubles in rain',
  130,52,'MEDIUM',false,false,
  'An agile mosasaur that cartwheels through the water to build speed.',
  '#29B6F6','#01579B'),

SEAFANG: _sp('SEAFANG','Seafang',['WATER','DARK'],
  {hp:60,atk:72,def:58,spAtk:82,spDef:62,spd:80},
  _ls(
    1,'WATER_GUN',5,'CLAMP',7,'BUBBLE',10,'WATER_SHURIKEN',
    16,'AQUA_JET',22,'WHIRLPOOL',24,['WATERFALL','SURF','AQUA_TAIL','SONIC_PULSE'],28,'LEER',
    34,'GROWL',40,'SMOKESCREEN',48,'TAIL_WHIP',56,'WORK_UP'
  ),
  'ABYSSAUR',36,'AQUAFLIP','Swift Swim','Speed doubles in rain',
  70,122,'MEDIUM',false,false,
  'Hunts in total darkness using echolocation and predatory instinct.',
  '#0277BD','#1A1A2E'),

ABYSSAUR: _sp('ABYSSAUR','Abyssaur',['WATER','DARK'],
  {hp:88,atk:95,def:80,spAtk:108,spDef:82,spd:90},
  _ls(
    1,'WATER_GUN',5,'WHIRLPOOL',7,'BUBBLE',10,'CLAMP',
    13,'AQUA_JET',16,'WATER_SHURIKEN',22,'LEER',28,'GROWL',
    34,'SMOKESCREEN',40,'TAIL_WHIP',41,['WATERFALL','SURF','AQUA_TAIL','SONIC_PULSE'],46,'WORK_UP',
    52,'SWORDS_DANCE',54,['HYDRO_PUMP','ANCIENT_TORRENT','GLACIAL_MIND','CRABHAMMER'],58,'DRAGON_DANCE',64,'BULK_UP'
  ),
  null,null,'ABYSSAUR','Drizzle','Summons rain when entering battle',
  20,248,'SLOW',false,false,
  'From the deepest ocean trenches. Bioluminescent patterns lure prey into the dark.',
  '#01579B','#0D0D1A'),

// Chain 28 — Ice/Water (Arctic Elasmosaurus)
ICECAP: _sp('ICECAP','Icecap',['ICE'],
  {hp:52,atk:48,def:52,spAtk:62,spDef:58,spd:48},
  _ls(
    1,'ICE_SHARD',5,'TRIPLE_AXEL',6,'WATER_GUN',9,'POWDER_SNOW',
    10,['ICE_BEAM','FREEZE_DRY','ICICLE_CRASH','FROST_BREATH'],14,'ICICLE_SPEAR',20,'SHEER_COLD',28,'ICE_SPIKE',
    36,'ABSOLUTE_ZERO'
  ),
  'BLIZZFANG',22,null,'Ice Body','Heals in Hail',
  120,56,'MEDIUM',false,false,
  'An arctic swimmer with a cap of natural ice growing from its skull.',
  '#B2EBF2','#006064'),

BLIZZFANG: _sp('BLIZZFANG','Blizzfang',['ICE','WATER'],
  {hp:68,atk:65,def:68,spAtk:82,spDef:75,spd:62},
  _ls(
    1,'ICE_SHARD',5,'TRIPLE_AXEL',6,'WATER_GUN',7,'POWDER_SNOW',
    10,'ICICLE_SPEAR',16,'SHEER_COLD',22,'ICE_SPIKE',24,['ICE_BEAM','FREEZE_DRY','ICICLE_CRASH','FROST_BREATH'],
    28,'ABSOLUTE_ZERO',34,'LEER',40,'GROWL',48,'SMOKESCREEN'
  ),
  'POLARCROWN',38,'ICECAP','Ice Body','Heals in Hail',
  65,128,'MEDIUM',false,false,
  'Navigates arctic seas by cracking ice flows with its reinforced skull.',
  '#B2EBF2','#004D40'),

POLARCROWN: _sp('POLARCROWN','Polarcrown',['ICE','WATER'],
  {hp:95,atk:82,def:92,spAtk:108,spDef:95,spd:72},
  _ls(
    1,'ICE_SHARD',5,'SHEER_COLD',7,'POWDER_SNOW',10,'LEER',
    12,'HAIL',16,'TRIPLE_AXEL',22,'ICICLE_SPEAR',28,'ICE_SPIKE',
    34,'ABSOLUTE_ZERO',40,'GROWL',41,['ICE_BEAM','FREEZE_DRY','ICICLE_CRASH','FROST_BREATH'],46,'SMOKESCREEN',
    52,'TAIL_WHIP',54,['BLIZZARD','ICE_HAMMER','MOUNTAIN_GALE','BLIZZARD_LANCE'],58,'WORK_UP',64,'SWORDS_DANCE'
  ),
  null,null,'POLARCROWN','Slush Rush','Speed doubles in Hail',
  18,258,'SLOW',false,false,
  'Commands the polar seas. Its crown of ancient ice has never melted.',
  '#E0F7FA','#006064'),

// Chain 29 — Electric/Flying (Storm Pterosaur)
STORMWING: _sp('STORMWING','Stormwing',['ELECTRIC'],
  {hp:42,atk:50,def:38,spAtk:62,spDef:45,spd:75},
  _ls(
    1,'THUNDER_SHOCK',5,'NUZZLE',6,'GUST',9,'CHARGE_BEAM',
    10,['SPARK','THUNDERBOLT','DISCHARGE','WILD_CHARGE'],14,'ZAP_BURST',20,'LEER',28,'GROWL',
    36,'SMOKESCREEN'
  ),
  'TEMPESTFANG',20,null,'Static','30% chance to paralyse on contact',
  130,52,'MEDIUM',false,false,
  'A small pterosaur that generates static electricity by flapping its wings rapidly.',
  '#FFF9C4','#F57F17'),

TEMPESTFANG: _sp('TEMPESTFANG','Tempestfang',['ELECTRIC','FLYING'],
  {hp:56,atk:68,def:52,spAtk:82,spDef:60,spd:95},
  _ls(
    1,'THUNDER_SHOCK',5,'NUZZLE',6,'GUST',7,'CHARGE_BEAM',
    10,'ZAP_BURST',16,'LEER',22,'GROWL',24,['SPARK','THUNDERBOLT','DISCHARGE','WILD_CHARGE'],
    28,'SMOKESCREEN',34,'TAIL_WHIP',40,'WORK_UP',48,'SWORDS_DANCE'
  ),
  'CYCLOSAUR',38,'STORMWING','Static','30% chance to paralyse on contact',
  70,122,'MEDIUM',false,false,
  'Creates electrical storms wherever it flies. Towns go dark when it passes overhead.',
  '#FFF176','#37474F'),

CYCLOSAUR: _sp('CYCLOSAUR','Cyclosaur',['ELECTRIC','FLYING'],
  {hp:78,atk:88,def:72,spAtk:115,spDef:80,spd:118},
  _ls(
    1,'THUNDER_SHOCK',5,'LEER',7,'CHARGE_BEAM',10,'GROWL',
    13,'NUZZLE',16,'ZAP_BURST',22,'SMOKESCREEN',28,'TAIL_WHIP',
    34,'WORK_UP',40,'SWORDS_DANCE',41,['SPARK','THUNDERBOLT','DISCHARGE','WILD_CHARGE'],46,'DRAGON_DANCE',
    52,'BULK_UP',54,['THUNDER','VOLT_TACKLE','ZAP_CANNON','PLASMA_FISTS'],58,'CALM_MIND',64,'NASTY_PLOT'
  ),
  null,null,'CYCLOSAUR','Volt Absorb','Absorbs Electric moves to restore HP',
  18,258,'SLOW',false,false,
  'A living storm. Entire weather systems orbit around its massive wingspan.',
  '#FFD600','#263238'),

// Chain 30 — Dark/Dragon (Shadow Spinosaurus)
DARKSCALE: _sp('DARKSCALE','Darkscale',['DARK'],
  {hp:46,atk:58,def:44,spAtk:55,spDef:46,spd:68},
  _ls(
    1,'BITE',5,'GROWL',6,'LEER',9,'BEAT_UP',
    10,['SNARL','CRUNCH','DARK_PULSE','NIGHT_SLASH'],14,'SMOKESCREEN',20,'TAIL_WHIP',28,'WORK_UP',
    36,'SWORDS_DANCE'
  ),
  'SHADOWCLAW',22,null,'Intimidate','Lowers foe\'s Attack on switch-in',
  130,54,'MEDIUM',false,false,
  'A shadow-coloured Spinosaurus that lurks in river fog banks.',
  '#212121','#7B1FA2'),

SHADOWCLAW: _sp('SHADOWCLAW','Shadowclaw',['DARK','DRAGON'],
  {hp:62,atk:80,def:58,spAtk:72,spDef:60,spd:85},
  _ls(
    1,'BITE',5,'GROWL',6,'LEER',7,'BEAT_UP',
    10,'SMOKESCREEN',16,'TAIL_WHIP',22,'WORK_UP',24,['SNARL','CRUNCH','DARK_PULSE','NIGHT_SLASH'],
    28,'SWORDS_DANCE',34,'DRAGON_DANCE',40,'BULK_UP',48,'CALM_MIND'
  ),
  'OBSIDIUDON',38,'DARKSCALE','Intimidate','Lowers foe\'s Attack on switch-in',
  70,125,'MEDIUM',false,false,
  'Its sail is made of living shadow. Light bends around it unnaturally.',
  '#1A1A2E','#4A148C'),

OBSIDIUDON: _sp('OBSIDIUDON','Obsidiudon',['DARK','DRAGON'],
  {hp:88,atk:115,def:82,spAtk:98,spDef:82,spd:100},
  _ls(
    1,'BITE',5,'SMOKESCREEN',7,'BEAT_UP',10,'TAIL_WHIP',
    13,'LEER',16,'GROWL',22,'WORK_UP',28,'SWORDS_DANCE',
    34,'DRAGON_DANCE',40,'BULK_UP',41,['SNARL','CRUNCH','DARK_PULSE','NIGHT_SLASH'],46,'CALM_MIND',
    52,'NASTY_PLOT',54,['FOUL_PLAY','HYPERSPACE_FURY','SHADOW_RAID','VOID_BLAST'],58,'IRON_DEFENSE',64,'ROCK_POLISH'
  ),
  null,null,'OBSIDIUDON','Rough Skin','Attackers take 1/8 HP damage on contact',
  15,265,'SLOW',false,false,
  'An obsidian-black apex predator. Ancient texts called it the Shadow of Extinction.',
  '#0D0D0D','#311B92'),

// ═══════════════════════════════════════════════════════
// 2-STAGE CHAINS
// ═══════════════════════════════════════════════════════

// Chain 31 — Normal/Fighting (Compsognathus speed runner)
QUICKFEET: _sp('QUICKFEET','Quickfeet',['NORMAL'],
  {hp:44,atk:55,def:38,spAtk:38,spDef:40,spd:88},
  _ls(
    1,'QUICK_ATTACK',5,'SCRATCH',7,'TACKLE',9,'POUND',
    10,['HEADBUTT','BODY_SLAM','SLAM_DOWN','HYPER_VOICE'],14,'QUICK_STRIKE',20,'RAPID_SPIN',28,'ECHOED_VOICE',
    36,'BIDE'
  ),
  'SWIFTCLAW',24,null,'Speed Boost','Speed rises by 1 stage each turn',
  150,48,'FAST',false,false,
  'The fastest DinoMon known. Blinks can\'t catch it at full speed.',
  '#FFCC80','#FF6F00'),

SWIFTCLAW: _sp('SWIFTCLAW','Swiftclaw',['NORMAL','FIGHTING'],
  {hp:68,atk:88,def:58,spAtk:55,spDef:58,spd:118},
  _ls(
    1,'QUICK_ATTACK',5,'POUND',7,'TACKLE',10,'MACH_PUNCH',
    13,'SCRATCH',16,'QUICK_STRIKE',22,'RAPID_SPIN',28,'ECHOED_VOICE',
    34,'BIDE',40,'SNORE',41,['HEADBUTT','BODY_SLAM','SLAM_DOWN','HYPER_VOICE'],46,'ENDEAVOR',
    52,'HORN_THRUST',54,['HYPER_BEAM','DOUBLE_EDGE','LAST_RESORT','EXPLOSION'],58,'FURY_SWIPES',64,'LEER'
  ),
  null,null,'SWIFTCLAW','Technician','Moves with 60 or less base power gain 50% more',
  70,155,'MEDIUM',false,false,
  'Outruns every DinoMon ever recorded. Leaves sonic booms as footprints.',
  '#FFA726','#BF360C'),

// Chain 32 — Ground (burrowing Heterodontosaurus)
DIGCLAW: _sp('DIGCLAW','Digclaw',['GROUND'],
  {hp:56,atk:68,def:60,spAtk:28,spDef:48,spd:50},
  _ls(
    1,'SCRATCH',5,'DIG',7,'FISSURE',9,'MUD_SLAP',
    10,['BULLDOZE','MAGNITUDE','CLUB_SMASH','MUD_SHOT'],14,'BONE_RUSH',20,'MUDSLAP',28,'BONEMERANG',
    36,'SAND_TOMB'
  ),
  'TUNNELDON',28,null,'Arena Trap','Prevents non-flying opponents from fleeing',
  120,58,'MEDIUM',false,false,
  'A burrowing dinosaur that tunnels through solid rock in minutes.',
  '#A1887F','#6D4C41'),

TUNNELDON: _sp('TUNNELDON','Tunneldon',['GROUND','ROCK'],
  {hp:85,atk:95,def:90,spAtk:40,spDef:70,spd:55},
  _ls(
    1,'SCRATCH',5,'DIG',7,'BONE_RUSH',10,'MUDSLAP',
    12,'MUD_SLAP',16,'FISSURE',22,'BONEMERANG',28,'SAND_TOMB',
    34,'LEER',40,'GROWL',41,['BULLDOZE','MAGNITUDE','CLUB_SMASH','MUD_SHOT'],46,'SMOKESCREEN',
    52,'TAIL_WHIP',54,['EARTHQUAKE','HIGH_HORSEPOWER','PRECIPICE_BLADES','TECTONIC_RAGE'],58,'WORK_UP',64,'SWORDS_DANCE'
  ),
  null,null,'TUNNELDON','Mold Breaker','Moves ignore the target\'s ability',
  60,175,'MEDIUM',false,false,
  'Its tunnels network under entire mountain ranges. Cities have been built over them.',
  '#6D4C41','#BCAAA4'),

// Chain 33 — Rock/Steel (turtle-like Ankylosaur)
ROCKFLIP: _sp('ROCKFLIP','Rockflip',['ROCK'],
  {hp:62,atk:60,def:80,spAtk:28,spDef:65,spd:22},
  _ls(
    1,'ROCK_THROW',5,'HEADBUTT',7,'ROCK_BLAST',9,'ROLLOUT',
    10,['ROCK_SLIDE','ANCIENT_POWER','SMASH_DOWN','POWER_GEM'],14,'ACCELEROCK',20,'MINERAL_BURST',28,'LEER',
    36,'GROWL'
  ),
  'BOULDERDON',26,null,'Tremor Sense','Priority attacks deal only half damage to it',
  120,56,'SLOW',false,false,
  'A turtle-shaped ankylosaur that retracts into its shell when threatened.',
  '#9E9E9E','#616161'),

BOULDERDON: _sp('BOULDERDON','Boulderdon',['ROCK','STEEL'],
  {hp:92,atk:82,def:118,spAtk:38,spDef:88,spd:28},
  _ls(
    1,'ROCK_THROW',5,'ROCK_BLAST',7,'ROLLOUT',10,'GROWL',
    12,'IRON_DEFENSE',16,'ACCELEROCK',22,'MINERAL_BURST',28,'LEER',
    34,'SMOKESCREEN',40,'TAIL_WHIP',41,['ROCK_SLIDE','ANCIENT_POWER','SMASH_DOWN','POWER_GEM'],46,'WORK_UP',
    52,'SWORDS_DANCE',54,['STONE_EDGE','SKULL_SLAM','HEAD_SMASH','DIAMOND_STORM'],58,'DRAGON_DANCE',64,'BULK_UP'
  ),
  null,null,'BOULDERDON','Battle Armor','Moves cannot land critical hits on this DinoMon',
  55,180,'SLOW',false,false,
  'The most defensive DinoMon in existence. Trainers use it as a living shield.',
  '#546E7A','#B0BEC5'),

// Chain 34 — Electric (Microraptor)
SPARKLET: _sp('SPARKLET','Sparklet',['ELECTRIC'],
  {hp:40,atk:45,def:38,spAtk:60,spDef:45,spd:75},
  _ls(
    1,'THUNDER_SHOCK',5,'QUICK_ATTACK',7,'CHARGE_BEAM',9,'NUZZLE',
    10,['SPARK','THUNDERBOLT','DISCHARGE','WILD_CHARGE'],14,'ZAP_BURST',20,'LEER',28,'GROWL',
    36,'SMOKESCREEN'
  ),
  'VOLTHORN',22,null,'Limber','Cannot be paralysed',
  150,46,'FAST',false,false,
  'A feathered microraptor that discharges electricity when excited.',
  '#FFF9C4','#FFD600'),

VOLTHORN: _sp('VOLTHORN','Volthorn',['ELECTRIC','FLYING'],
  {hp:65,atk:68,def:55,spAtk:88,spDef:62,spd:100},
  _ls(
    1,'THUNDER_SHOCK',5,'LEER',7,'CHARGE_BEAM',10,'GROWL',
    11,'SPARK',16,'NUZZLE',22,'ZAP_BURST',28,'SMOKESCREEN',
    34,'TAIL_WHIP',40,'WORK_UP',41,['THUNDERBOLT','DISCHARGE','WILD_CHARGE','ELECTROWEB'],46,'SWORDS_DANCE',
    52,'DRAGON_DANCE',54,['THUNDER','VOLT_TACKLE','ZAP_CANNON','PLASMA_FISTS'],58,'BULK_UP',64,'CALM_MIND'
  ),
  null,null,'VOLTHORN','Lightning Rod','Draws Electric attacks; Special Attack rises',
  65,160,'MEDIUM',false,false,
  'Glides on electromagnetic fields. Its feathers act as superconductors.',
  '#FFEE58','#0288D1'),

// Chain 35 — Water/Poison (bog Scelidosaurus)
MARSHFIN: _sp('MARSHFIN','Marshfin',['WATER'],
  {hp:55,atk:50,def:55,spAtk:62,spDef:52,spd:42},
  _ls(
    1,'WATER_GUN',5,'BUBBLE',7,'POISON_STING',9,'AQUA_JET',
    10,['WATERFALL','SURF','AQUA_TAIL','SONIC_PULSE'],14,'WHIRLPOOL',20,'CLAMP',28,'WATER_SHURIKEN',
    36,'LEER'
  ),
  'BOGZILLA',28,null,'Poison Point','30% chance to poison on contact',
  120,58,'MEDIUM',false,false,
  'A slow-moving bog-dweller with a naturally toxic hide.',
  '#4CAF50','#1B5E20'),

BOGZILLA: _sp('BOGZILLA','Bogzilla',['WATER','POISON'],
  {hp:88,atk:82,def:88,spAtk:92,spDef:80,spd:52},
  _ls(
    1,'WATER_GUN',5,'AQUA_JET',7,'POISON_STING',10,'WHIRLPOOL',
    13,'SURF',16,'BUBBLE',22,'CLAMP',28,'WATER_SHURIKEN',
    34,'LEER',40,'GROWL',41,['WATERFALL','AQUA_TAIL','SONIC_PULSE','NECK_LASSO'],46,'SMOKESCREEN',
    52,'TAIL_WHIP',54,['HYDRO_PUMP','ANCIENT_TORRENT','GLACIAL_MIND','CRABHAMMER'],58,'WORK_UP',64,'SWORDS_DANCE'
  ),
  null,null,'BOGZILLA','Poison Touch','Contact moves have 30% chance to poison the target',
  55,182,'SLOW',false,false,
  'The king of the swamp. Everything it touches becomes mildly toxic within hours.',
  '#2E7D32','#4A0080'),

// ═══════════════════════════════════════════════════════
// FOSSIL DINOMON — revived from carried fossils (exclusive)
// ═══════════════════════════════════════════════════════

// Amber Fossil — Bug/Rock
AMBERLITE: _sp('AMBERLITE','Amberlite',['BUG','ROCK'],
  {hp:45,atk:50,def:60,spAtk:40,spDef:50,spd:38},
  _ls(1,'TACKLE',1,'HARDEN',6,'ROCK_THROW',10,'BUG_BITE',16,'ANCIENT_POWER',24,'ROCK_SLIDE'),
  'AMBERWING',32,null,'Shed Skin','30% chance each turn to shed any status condition',
  45,62,'MEDIUM',false,false,
  'Trapped in amber for eons. Its shell still hums with prehistoric energy.',
  '#d9a441','#8a5a18'),
AMBERWING: _sp('AMBERWING','Amberwing',['BUG','ROCK'],
  {hp:70,atk:82,def:90,spAtk:55,spDef:70,spd:58},
  _ls(1,'TACKLE',1,'ROCK_THROW',16,'BUG_BITE',24,'ANCIENT_POWER',34,'X_SCISSOR',40,'ROCK_SLIDE',48,'STONE_EDGE'),
  null,null,'AMBERLITE','Shed Skin','30% chance each turn to shed any status condition',
  45,168,'MEDIUM',false,false,
  'Its amber wings glint like stained glass. A living relic of the first age.',
  '#e8b84a','#7a4e14'),

// Tar Fossil — Dark/Rock
TARCLAW: _sp('TARCLAW','Tarclaw',['DARK','ROCK'],
  {hp:50,atk:58,def:52,spAtk:42,spDef:45,spd:48},
  _ls(1,'TACKLE',1,'SAND_ATTACK',6,'BITE',10,'ROCK_THROW',16,'ANCIENT_POWER',24,'ROCK_SLIDE'),
  'TARRASAUR',34,null,'Poison Heal','Poison heals it: +1/8 HP per turn instead of damage',
  45,64,'MEDIUM',false,false,
  'Hauled from a tar pit. Black ooze still drips from its claws.',
  '#2a2620','#1a140a'),
TARRASAUR: _sp('TARRASAUR','Tarrasaur',['DARK','ROCK'],
  {hp:78,atk:95,def:80,spAtk:55,spDef:68,spd:62},
  _ls(1,'BITE',1,'ROCK_THROW',16,'ANCIENT_POWER',24,'CRUNCH',34,'ROCK_SLIDE',40,'EARTHQUAKE',48,'STONE_EDGE'),
  null,null,'TARCLAW','Poison Heal','Poison heals it: +1/8 HP per turn instead of damage',
  45,172,'MEDIUM',false,false,
  'A tar-soaked predator. The ooze hardens into armor when it hunts.',
  '#1a1814','#3a2a10'),

// Ice Fossil — Ice/Rock
CRYOSHELL: _sp('CRYOSHELL','Cryoshell',['ICE','ROCK'],
  {hp:55,atk:45,def:65,spAtk:48,spDef:55,spd:30},
  _ls(1,'TACKLE',1,'HARDEN',6,'ICE_SHARD',10,'ROCK_THROW',16,'ANCIENT_POWER',24,'ROCK_SLIDE'),
  'CRYOSAUR',34,null,'Sturdy','Survives a KO with 1 HP when at full health.',
  45,64,'MEDIUM',false,false,
  'Frozen in a glacier core. Frost crystals grow along its stone hide.',
  '#bfe6f0','#5a8aa0'),
CRYOSAUR: _sp('CRYOSAUR','Cryosaur',['ICE','ROCK'],
  {hp:85,atk:70,def:100,spAtk:65,spDef:80,spd:42},
  _ls(1,'ICE_SHARD',1,'ROCK_THROW',16,'ANCIENT_POWER',24,'ICE_FANG',34,'ROCK_SLIDE',40,'ICE_BEAM',48,'STONE_EDGE'),
  null,null,'CRYOSHELL','Ancient Guard','Completely blocks priority attacks',
  45,172,'MEDIUM',false,false,
  'An ice-age titan. Its breath drops the temperature for metres around.',
  '#9fd8ee','#3f7090'),

// Sea Fossil — Water/Rock
NAUTILON: _sp('NAUTILON','Nautilon',['WATER','ROCK'],
  {hp:55,atk:48,def:58,spAtk:55,spDef:55,spd:40},
  _ls(1,'TACKLE',1,'HARDEN',6,'WATER_GUN',10,'ROCK_THROW',16,'ANCIENT_POWER',24,'ROCK_SLIDE'),
  'ABYSSHELL',34,null,'Sturdy','Survives a KO with 1 HP when at full health.',
  45,64,'MEDIUM',false,false,
  'A spiral-shelled fossil from the deep. Its shell rings like a bell.',
  '#5aa0c8','#2a5a78'),
ABYSSHELL: _sp('ABYSSHELL','Abysshell',['WATER','ROCK'],
  {hp:80,atk:68,def:92,spAtk:80,spDef:78,spd:50},
  _ls(1,'WATER_GUN',1,'ROCK_THROW',16,'ANCIENT_POWER',24,'AQUA_TAIL',34,'ROCK_SLIDE',40,'SURF',48,'STONE_EDGE'),
  null,null,'NAUTILON','Sturdy','Survives a KO with 1 HP when at full health.',
  45,172,'MEDIUM',false,false,
  'An ancient ammonite-beast. Pressure from the abyss made its shell unbreakable.',
  '#3f86b4','#1a4060'),

// Sky Fossil — Flying/Rock
AEROLITH: _sp('AEROLITH','Aerolith',['FLYING','ROCK'],
  {hp:48,atk:55,def:50,spAtk:45,spDef:45,spd:62},
  _ls(1,'TACKLE',1,'QUICK_ATTACK',6,'ROCK_THROW',10,'WING_ATTACK',16,'ANCIENT_POWER',24,'ROCK_SLIDE'),
  'AERODON',34,null,'Quick Feet','Status conditions boost its Speed ×1.5 (no paralysis slowdown)',
  45,64,'MEDIUM',false,false,
  'A stone-winged flyer. Somehow these heavy wings once caught the wind.',
  '#b8a890','#6a5a40'),
AERODON: _sp('AERODON','Aerodon',['FLYING','ROCK'],
  {hp:75,atk:88,def:72,spAtk:60,spDef:65,spd:95},
  _ls(1,'WING_ATTACK',1,'ROCK_THROW',16,'ANCIENT_POWER',24,'AIR_SLASH',34,'AERIAL_ACE',40,'ROCK_SLIDE',48,'STONE_EDGE'),
  null,null,'AEROLITH','Quick Feet','Status conditions boost its Speed ×1.5 (no paralysis slowdown)',
  45,174,'MEDIUM',false,false,
  'The apex of the ancient skies, reborn. Its stone wings shatter the sound barrier.',
  '#c8b89a','#5a4a30'),

// ═══════════════════════════════════════════════════════
// LEGENDARIES
// ═══════════════════════════════════════════════════════

CRATERON: _sp('CRATERON','Crateron',['FIRE','DRAGON'],
  {hp:110,atk:120,def:90,spAtk:130,spDef:90,spd:90},
  _ls(
    1,'EMBER',1,'DRAGON_RAGE',5,'LEER',7,'FIRE_SPIN',
    10,['LAVA_PLUME','INCINERATE','BLAZE_KICK','FIERY_DANCE'],15,'ERUPTION_HORN',22,'FIREWORKS',30,'IMMOLATION',
    38,'FIRECRACKER',40,['FLAME_CHARGE','FLAMETHROWER','FRILL_FLARE','SAIL_BLAST'],46,'GROWL',54,'SMOKESCREEN',
    55,['FIRE_BLAST','OVERHEAT','ERUPTION','EXTINCTION_BEAM'],62,'TAIL_WHIP',70,'WORK_UP',78,'SWORDS_DANCE',
    86,'DRAGON_DANCE',
    // Signature default moveset (appended last → these are the 4 a caught Crateron starts with)
    50,'PHOENIX_CATACLYSM',50,'DRACO_METEOR',50,'FIRE_BLAST',50,'WORK_UP'
  ),
  null,null,null,'Immortal Flame','Survives one lethal hit per battle at 1 HP, then deals a fire burst',
  3,340,'SLOW',true,false,
  'The Undying Flame. Survived the Chicxulub impact by burrowing into the Earth\'s mantle 66 million years ago.',
  '#FF1744','#FF6D00'),

GLACIODON: _sp('GLACIODON','Glaciodon',['WATER','PSYCHIC'],
  {hp:100,atk:90,def:110,spAtk:130,spDef:110,spd:80},
  _ls(
    1,'WATER_GUN',1,'CONFUSION',5,'WHIRLPOOL',7,'BUBBLE',
    10,['SURF','SCALD','BRINE','LIQUIDATION'],15,'AQUA_JET',22,'CLAMP',30,'WATER_SHURIKEN',
    38,'LEER',40,['WATERFALL','AQUA_TAIL','SONIC_PULSE','NECK_LASSO'],46,'GROWL',54,'SMOKESCREEN',
    55,['HYDRO_PUMP','ANCIENT_TORRENT','GLACIAL_MIND','CRABHAMMER'],62,'TAIL_WHIP',70,'WORK_UP',78,'SWORDS_DANCE',
    86,'DRAGON_DANCE',
    // Signature default moveset (appended last → these are the 4 a caught Glaciodon starts with)
    50,'TIME_FREEZE_TORRENT',50,'ANCIENT_TORRENT',50,'PSYCHIC',50,'ICE_BEAM'
  ),
  null,null,null,'Time Lock','Once per battle, returns at half HP after being KO\'d',
  5,330,'SLOW',true,false,
  'The Frozen Prophet. Preserved in a glacier for 66 million years. Its thoughts span geological time.',
  '#B3E5FC','#7C4DFF'),

PRIMORDIA: _sp('PRIMORDIA','Primordia',['DRAGON'],
  {hp:120,atk:130,def:100,spAtk:130,spDef:100,spd:90},
  _ls(
    1,'DRAGON_RAGE',1,'DRAGON_BREATH',5,'DRAGON_DARTS',7,'TWISTER',
    10,['SCALE_SHOT','CLANGING_SCALES','BREAKING_SWIPE'],15,'DUAL_WINGBEAT',22,'SCALE_SHOT_PLUS',30,'CLAW_STORM',
    38,'LEER',40,['DRAGON_CLAW','DRAGON_PULSE','DRAGON_HAMMER','DRAGON_TAIL'],46,'GROWL',54,'SMOKESCREEN',
    55,['OUTRAGE','DRACO_METEOR','MIND_DIVE','DIVE_BOMB'],62,'TAIL_WHIP',70,'WORK_UP',78,'SWORDS_DANCE',
    86,'DRAGON_DANCE',
    // Signature default moveset (appended last → these are the 4 a caught Primordia starts with)
    50,'GENESIS_ROAR',50,'DRAGON_DANCE',50,'OUTRAGE',50,'EARTHQUAKE'
  ),
  null,null,null,'Ancient Power','All moves gain +15% power; immune to stat drops from foes',
  3,350,'SLOW',true,false,
  'The First DinoMon. Before evolution, before extinction — Primordia was there.',
  '#FFD600','#FF6D00'),

// ═══════════════════════════════════════════════════════
// MEGA DinoMons (DinoMaster Ball only)
// ═══════════════════════════════════════════════════════

MEGAVORE: _sp('MEGAVORE','Megavore',['DRAGON','DARK'],
  {hp:130,atk:145,def:100,spAtk:120,spDef:100,spd:115},
  _ls(
    1,'OUTRAGE',1,'DARK_PULSE',1,'DRAGON_DANCE',1,'CRUNCH',
    5,'DRAGON_DARTS',10,'DRAGON_RAGE',15,'SCALE_SHOT',22,'TWISTER',
    30,'DUAL_WINGBEAT',38,'SCALE_SHOT_PLUS',40,['DRAGON_BREATH','DRAGON_CLAW','DRAGON_PULSE','BREAKING_SWIPE'],46,'CLAW_STORM',
    54,'LEER',55,['DRACO_METEOR','MIND_DIVE','DIVE_BOMB','SPACIAL_REND'],62,'GROWL',70,'SMOKESCREEN',
    78,'TAIL_WHIP',
    // Signature default moveset (appended last → these are the 4 a caught Megavore starts with)
    50,'ENDLESS_DEVOUR',50,'OUTRAGE',50,'DRAGON_DANCE',50,'CRUNCH'
  ),
  null,null,null,'Apex Predator','At battle start, lowers all opponent\'s stats by 1 stage (once)',
  1,400,'SLOW',true,true,
  'An enormous predator pre-dating the dinosaurs themselves. Scientists do not understand its biology.',
  '#0D0D0D','#6A1B9A'),

TITANREX: _sp('TITANREX','Titanrex',['ROCK','FIRE'],
  {hp:140,atk:130,def:140,spAtk:110,spDef:130,spd:60},
  _ls(
    1,'STONE_EDGE',1,'ERUPTION',1,'SKULL_SLAM',1,'IRON_DEFENSE',
    5,'ROCK_BLAST',10,'ROCK_THROW',15,'ROLLOUT',22,'ACCELEROCK',
    30,'MINERAL_BURST',38,'LEER',40,['ROCK_SLIDE','ANCIENT_POWER','SMASH_DOWN','POWER_GEM'],46,'GROWL',
    54,'SMOKESCREEN',55,['HEAD_SMASH','DIAMOND_STORM','METEOR_BEAM','ROCK_WRECKER'],62,'TAIL_WHIP',70,'WORK_UP',
    78,'SWORDS_DANCE',
    // Signature default moveset (appended last → these are the 4 a caught Titanrex starts with)
    50,'MAGMA_THRONE',50,'HEAD_SMASH',50,'SWORDS_DANCE',50,'EARTHQUAKE'
  ),
  null,null,null,'Primordial Fortress','All incoming damage halved; immune to critical hits',
  1,400,'SLOW',true,true,
  'A volcanic colossus. Its body is living magma hardened into unbreakable stone. Nothing has ever toppled it.',
  '#B71C1C','#424242'),

};

// ── Dex descriptions & habitats ──────────────────────────────────────────────
// Added separately so the _sp() helper stays compact.
(function() {
  const _dex = {
    // Starters
    TINDREL:      { desc: 'A young ceratopsian whose frill radiates heat when excited. Its Primordial Aura smolders like a coal waiting to ignite.', habitat: 'Given by Dokter Timo (starter)' },
    TINDRAK:      { desc: 'As it matures, Tindrak\'s frill blazes with dragonfire. Rivals flee from its battle cry.', habitat: 'Evolves from Tindrel at Lv.16' },
    PYROCERATH:   { desc: 'The mightiest fire-ceratopsian, Pyrocerath scorches the earth with every charge. Volcanic mountains are its home.', habitat: 'Evolves from Tindrak at Lv.32' },
    LEAFAWN:      { desc: 'A gentle stegosaur whose back-plates photosynthesize sunlight. It calms wild DinoMons with its soothing aura.', habitat: 'Given by Dokter Timo (starter)' },
    FERNASAUR:    { desc: 'Fernasaur\'s plates grow mossy and broad, storing enough solar energy to fuel days of travel through dense forest.', habitat: 'Evolves from Leafawn at Lv.16' },
    VERDANTHORN:  { desc: 'Its enormous back-plates can channel storms. Verdanthorn is said to call the rains in times of drought.', habitat: 'Evolves from Fernasaur at Lv.32' },
    AQUEEL:       { desc: 'A nimble young plesiosaur that skims the surface of calm bays. Its paddling speed is startling for its small size.', habitat: 'Given by Dokter Timo (starter)' },
    PLESIWAVE:    { desc: 'Plesiwave\'s long neck lets it scout above the waves while its body stays submerged. Sailors consider it a good omen.', habitat: 'Evolves from Aqueel at Lv.16' },
    TIDANOSAURUS: { desc: 'Ancient sailors worshipped Tidanosaurus as a sea deity. It commands ocean currents with a sweep of its massive flippers.', habitat: 'Evolves from Plesiwave at Lv.32' },
    // Early route
    NORMLET:      { desc: 'A common herd dinosaur that travels in packs. Harmless and curious — often the first DinoMon a new trainer meets.', habitat: 'Route 1 (common)' },
    PACKDINO:     { desc: 'Pack loyalty is everything to Packdino. In a group it is fearless; alone it becomes cautious and alert.', habitat: 'Evolves from Normlet at Lv.18' },
    HERDSAUR:     { desc: 'Herdsaur leads vast dinosaur migrations across the Pangaea Archipelago every season.', habitat: 'Evolves from Packdino at Lv.34' },
    QUAKELING:    { desc: 'Tiny but heavy, Quakeling creates mini-tremors with every step. Even large dinosaurs step aside.', habitat: 'Route 1, Route 2' },
    MIDDODON:     { desc: 'A grumbling bruiser that guards its territory with low-frequency vibrations that can shatter stone.', habitat: 'Evolves from Quakeling at Lv.20' },
    TERRADON:     { desc: 'Terradon stamps its feet and splits the earth itself. Its hide is as tough as ancient bedrock.', habitat: 'Evolves from Middodon at Lv.36' },
    SPARKLET:     { desc: 'A small bipedal dinosaur with a resonating crest that crackles with static electricity.', habitat: 'Route 1 (uncommon)' },
    VOLTHORN:     { desc: 'Volthorn\'s crest stores charge in thunderstorms. It can release this energy in a single devastating bolt.', habitat: 'Evolves from Sparklet at Lv.22' },
    LEAFCUB:      { desc: 'A plant-covered cub-dinosaur that lives in dense jungles. Its leaf coating regrows after battles.', habitat: 'Route 1, Route 3' },
    SPRIGDON:     { desc: 'Sprigdon has grown a full canopy on its back. Smaller creatures make homes in its leafy coat.', habitat: 'Evolves from Leafcub at Lv.17' },
    JUNGLESAUR:   { desc: 'The jungle itself moves when Junglesaur walks. Its roar shakes leaves from a kilometre away.', habitat: 'Evolves from Sprigdon at Lv.36' },
    // Mid-game
    PTRYX:        { desc: 'A soaring pterosaur with razor-edged wings that hum with draconic energy. Perches on cliffs.', habitat: 'Early routes (uncommon)' },
    SWOOPTER:     { desc: 'Swoopter dives at incredible speed, guided by a sixth sense for magical energy.', habitat: 'Evolves from Ptryx at Lv.20' },
    SKYFANG:      { desc: 'A supreme aerial hunter combining dragon power with psychic vision. It sees through cloud and storm.', habitat: 'Evolves from Swoopter at Lv.36' },
    BONEBACK:     { desc: 'Rows of bone spines protect Boneback\'s back. It uses them to pin prey against rocky terrain.', habitat: 'Route 2, caves' },
    STONESKULL:   { desc: 'Stoneskull headbutts boulders for exercise. Its skull is harder than granite.', habitat: 'Evolves from Boneback at Lv.22' },
    OSSIFANG:     { desc: 'Its fangs are calcified into bone-hard spears. Ossifang has ruled cave ecosystems for millennia.', habitat: 'Evolves from Stoneskull at Lv.38' },
    EMBRIX:       { desc: 'A compact fire-raptor that hunts in desert heat. Its body temperature rises when it senses danger.', habitat: 'Desert routes' },
    SOLARIX:      { desc: 'Solarix absorbs sunlight through heat-conducting scales. On sunny days its power doubles.', habitat: 'Evolves from Embrix at Lv.23' },
    SCORCHBACK:   { desc: 'Scorchback\'s rock-hard carapace stores heat for months. In winter it glows like embers.', habitat: 'Evolves from Solarix at Lv.38' },
    // Water/Ice
    CRYOPHIN:     { desc: 'An icy marine dinosaur that uses sonar to navigate icebergs. It communicates through haunting calls.', habitat: 'Shellcreek City waters' },
    GLACIOHORN:   { desc: 'Glaciohorn\'s twisted ice-horn can flash-freeze sea water. It carves sculptures in glacial walls.', habitat: 'Evolves from Cryophin at Lv.24' },
    PERMAFROST:   { desc: 'A legendary frozen titan. Its breath alone can encase a mountain in ice for centuries.', habitat: 'Evolves from Glaciohorn at Lv.40' },
    MUDFIN:       { desc: 'A bottom-dwelling swamp creature that uses its wide fin to stir up mud and ambush prey.', habitat: 'Swamp areas, Shellcreek waters' },
    SWAMPJAW:     { desc: 'Swampjaw can hold its breath for hours, lurking just below the surface with only its eyes visible.', habitat: 'Evolves from Mudfin at Lv.24' },
    SWAMPZILLA:   { desc: 'The undisputed ruler of the bog, Swampzilla shakes entire wetlands when it surfaces.', habitat: 'Evolves from Swampjaw at Lv.40' },
    // Electric
    SPARKHORN:    { desc: 'A Parasaurolophus whose resonating crest crackles with static electricity during storms.', habitat: 'Route 2, Route 3' },
    VOLTSCALE:    { desc: 'Its crest has grown into a fully developed lightning rod that attracts storm clouds.', habitat: 'Evolves from Sparkhorn at Lv.20' },
    THUNDERSAUR:  { desc: 'A storm-riding titan. Thunderclouds form naturally above its crest wherever it travels.', habitat: 'Evolves from Voltscale at Lv.38' },
    // Dark raptor
    SHADOWLET:    { desc: 'A feathered raptor that hunts in pitch darkness using infrared vision.', habitat: 'Route 2, caves' },
    DUSKFANG:     { desc: 'A pack hunter that coordinates ambushes with low growls inaudible to humans.', habitat: 'Evolves from Shadowlet at Lv.18' },
    NIGHTREX:     { desc: 'The apex nocturnal predator. Its claws can pierce reinforced steel.', habitat: 'Evolves from Duskfang at Lv.36' },
    // Grass/Ground
    FRONDLET:     { desc: 'Moss grows on its back and blooms into flowers under sunlight. Found near ancient forest ruins.', habitat: 'Route 3, Route 4' },
    VINOSAUR:     { desc: 'Vines trail from its neck, taking root wherever it walks and transforming barren ground.', habitat: 'Evolves from Frondlet at Lv.22' },
    CANOPYREX:    { desc: 'A colossal sauropod whose spine is a living forest ecosystem sheltering many smaller creatures.', habitat: 'Evolves from Vinosaur at Lv.38' },
    // Rock/Ground chain
    ROCKLETT:     { desc: 'A small sauropod whose body is coated in mineral deposits absorbed from its rocky habitat.', habitat: 'Route 2, Route 5' },
    BOULDERFANG:  { desc: 'Boulder-sized deposits now cover its body. Moves slowly but hits with the force of an avalanche.', habitat: 'Evolves from Rocklett at Lv.22' },
    MEGASTONE:    { desc: 'A living mountain range. Geologists frequently mistake it for a newly formed rock formation.', habitat: 'Evolves from Boulderfang at Lv.38' },
    // Desert
    SANDCLAW:     { desc: 'A desert theropod that stirs up sandstorms as it runs to obscure its trail from predators.', habitat: 'Route 5, desert areas' },
    DESERTFANG:   { desc: 'Hunts by burying itself in sand and erupting beneath unsuspecting prey at full speed.', habitat: 'Evolves from Sandclaw at Lv.20' },
    DUNECROWN:    { desc: 'The apex predator of the desert. Its crown of sand perpetually swirls around its head.', habitat: 'Evolves from Desertfang at Lv.36' },
    // Ice chains
    FROSTLING:    { desc: 'A stocky sauropod whose breath crystallises into razor-sharp ice shards on cold mornings.', habitat: 'Route 6, icy areas' },
    BLIZZHORN:    { desc: 'Rocky plates coat its sides, frozen solid by its own icy breath over many winters.', habitat: 'Evolves from Frostling at Lv.22' },
    GLACIOKING:   { desc: 'A glacial titan. Where it walks, blizzards follow and valleys are carved from solid rock.', habitat: 'Evolves from Blizzhorn at Lv.38' },
    ICECAP:       { desc: 'An arctic swimmer with a cap of natural ice growing from its skull like a crown.', habitat: 'Route 9, icy waters' },
    BLIZZFANG:    { desc: 'Navigates arctic seas by cracking ice flows with its reinforced, frost-hardened skull.', habitat: 'Evolves from Icecap at Lv.22' },
    POLARCROWN:   { desc: 'Commands the polar seas. Its crown of ancient ice has never melted in recorded history.', habitat: 'Evolves from Blizzfang at Lv.38' },
    // Steel
    STEELBACK:    { desc: 'Its natural scales are laced with iron ore absorbed from mineral-rich rock beds over years.', habitat: 'Route 5, caves' },
    IRONSCALE:    { desc: 'Molten iron flows through channels in its armour, hardening on its surface like natural plate.', habitat: 'Evolves from Steelback at Lv.22' },
    TITANOSAUR:   { desc: 'A walking fortress. Scientists estimate its armour could deflect artillery shells.', habitat: 'Evolves from Ironscale at Lv.40' },
    // Flying/Dragon
    SOARWING:     { desc: 'A small pterosaur that rides thermals high above mountain ranges, rarely landing.', habitat: 'Route 4, mountainous areas' },
    GLIDEREX:     { desc: 'Wingspan reaches 4 metres. Glides silently for hundreds of kilometres without effort.', habitat: 'Evolves from Soarwing at Lv.20' },
    SKYMASTER:    { desc: 'The largest flying creature ever to exist. Its shadow covers entire towns as it passes.', habitat: 'Evolves from Gliderex at Lv.38' },
    // Fighting
    FIGHTCLAW:    { desc: 'A fierce Carnotaurus with powerful forearms. Born to brawl and never backs down.', habitat: 'Route 3, Route 6' },
    POWERDON:     { desc: 'Trains by headbutting boulders. Each fight leaves it measurably stronger than before.', habitat: 'Evolves from Fightclaw at Lv.20' },
    RAMPASAUR:    { desc: 'When it charges, nothing can stand in its path. Mountains crack under the impact.', habitat: 'Evolves from Powerdon at Lv.36' },
    // Ghost
    GHOSTBONE:    { desc: 'The ghost of an ancient ankylosaur. Appears near fossil excavation sites at night.', habitat: 'Old ruins, Mt. Cretaceous' },
    SPIRITHORN:   { desc: 'Spectral spines erupt from its fossil shell. Phases through solid rock effortlessly.', habitat: 'Evolves from Ghostbone at Lv.22' },
    PHANTOSAUR:   { desc: 'An ancient dragon reborn as pure spectral energy. Exists between life and fossil.', habitat: 'Evolves from Spirithorn at Lv.38' },
    // Poison
    VIPERFANG:    { desc: 'A Dilophosaurus whose frills spray a venom potent enough to melt stone on contact.', habitat: 'Route 7, Bogmire' },
    TOXIDRAW:     { desc: 'Its dark scales absorb venom from its own bites, growing ever more toxic with age.', habitat: 'Evolves from Viperfang at Lv.20' },
    VENOMSAUR:    { desc: 'The most venomous DinoMon known. A single drop of its venom can dissolve solid metal.', habitat: 'Evolves from Toxidraw at Lv.36' },
    // Bug
    BUGLING:      { desc: 'A tiny feathered dinosaur that hunts insects with pinpoint precision and remarkable speed.', habitat: 'Route 1, Route 3' },
    BUGCLAW:      { desc: 'Its wing-like feathers are strong enough to carry large prey off the ground in flight.', habitat: 'Evolves from Bugling at Lv.18' },
    INSECTADON:   { desc: 'Can consume an entire forest\'s insect population in a single day, keeping forests in balance.', habitat: 'Evolves from Bugclaw at Lv.34' },
    // Fairy
    FAIRYWING:    { desc: 'Flowers bloom wherever it walks. Local farmers consider it a good omen for the harvest.', habitat: 'Route 1, meadows' },
    BLOOMSAUR:    { desc: 'Its frill has bloomed into a crown of glowing flowers that pulse with soft fairy light.', habitat: 'Evolves from Fairywing at Lv.20' },
    FLOROSAUR:    { desc: 'A living garden. Poets say its song can make flowers bloom even in the depths of winter.', habitat: 'Evolves from Bloomsaur at Lv.36' },
    // Water/Dark
    AQUAFLIP:     { desc: 'An agile mosasaur that cartwheels through the water to build remarkable speed.', habitat: 'Route 4, coastal waters' },
    SEAFANG:      { desc: 'Hunts in total darkness using echolocation and finely tuned predatory instinct.', habitat: 'Evolves from Aquaflip at Lv.20' },
    ABYSSAUR:     { desc: 'From the deepest ocean trenches. Bioluminescent patterns lure prey into the dark.', habitat: 'Evolves from Seafang at Lv.36' },
    // Electric/Flying
    STORMWING:    { desc: 'A small pterosaur that generates static electricity by flapping its wings rapidly.', habitat: 'Route 8, stormy peaks' },
    TEMPESTFANG:  { desc: 'Creates electrical storms wherever it flies. Towns go dark when it passes overhead.', habitat: 'Evolves from Stormwing at Lv.20' },
    CYCLOSAUR:    { desc: 'A living storm. Entire weather systems orbit around its massive wingspan.', habitat: 'Evolves from Tempestfang at Lv.38' },
    // Dark/Dragon
    DARKSCALE:    { desc: 'A shadow-coloured Spinosaurus that lurks in river fog banks, patient and deadly.', habitat: 'Route 7, Route 8' },
    SHADOWCLAW:   { desc: 'Its sail is made of living shadow. Light bends around it in unsettling ways.', habitat: 'Evolves from Darkscale at Lv.22' },
    OBSIDIUDON:   { desc: 'An obsidian-black apex predator. Ancient texts called it the Shadow of Extinction.', habitat: 'Evolves from Shadowclaw at Lv.38' },
    // 2-stage chains
    QUICKFEET:    { desc: 'The fastest DinoMon known on open ground. Blinks cannot catch it at full speed.', habitat: 'Route 1, Route 2' },
    SWIFTCLAW:    { desc: 'Outruns every DinoMon ever recorded. Leaves sonic booms as footprints in soft earth.', habitat: 'Evolves from Quickfeet at Lv.24' },
    DIGCLAW:      { desc: 'A burrowing dinosaur that tunnels through solid rock in mere minutes.', habitat: 'Route 5, underground areas' },
    TUNNELDON:    { desc: 'Its tunnels network under entire mountain ranges. Cities have been built unknowingly over them.', habitat: 'Evolves from Digclaw at Lv.28' },
    ROCKFLIP:     { desc: 'A turtle-shaped ankylosaur that retracts entirely into its shell when threatened.', habitat: 'Route 6, rocky areas' },
    BOULDERDON:   { desc: 'The most defensive DinoMon in existence. Trainers use it as a living shield in battle.', habitat: 'Evolves from Rockflip at Lv.26' },
    MARSHFIN:     { desc: 'A slow-moving bog-dweller with a naturally toxic hide that poisons everything it touches.', habitat: 'Bogmire, swamp areas' },
    BOGZILLA:     { desc: 'The king of the swamp. Everything it touches becomes mildly toxic within hours.', habitat: 'Evolves from Marshfin at Lv.28' },
    VENOMJAW:     { desc: 'A Dilophosaurus with psychic-disrupting venom that fires from its expandable neck frills.', habitat: 'Route 7, Bogmire' },
    MIASMARK:     { desc: 'Multiple frills spray a venom that corrodes both body and mind simultaneously.', habitat: 'Evolves from Venomjaw at Lv.22' },
    TOXICARNO:    { desc: 'Venom seeps from its feet, creating pools that melt stone on contact wherever it walks.', habitat: 'Evolves from Miasmark at Lv.38' },
    FIRECOAL:     { desc: 'A young Allosaurus that has adapted to live near active volcanic vents for warmth.', habitat: 'Route 5, volcanic areas' },
    LAVACLAW:     { desc: 'Bathes in lava pools to shed old scales and emerge stronger. Burns through solid rock.', habitat: 'Evolves from Firecoal at Lv.20' },
    MAGMADON:     { desc: 'Formed from solidified magma. Every step leaves a trail of melted stone behind it.', habitat: 'Evolves from Lavaclaw at Lv.36' },
    // Legendaries
    CRATERON:     { desc: 'The Undying Flame. Survived the Chicxulub impact by burrowing into the Earth\'s mantle 66 million years ago.', habitat: 'Mt. Cretaceous (post-game)' },
    GLACIODON:    { desc: 'The Frozen Prophet. Preserved in a glacier for 66 million years. Its thoughts span geological time.', habitat: 'Glacial Cave (post-game)' },
    PRIMORDIA:    { desc: 'The First DinoMon. Before evolution, before extinction — Primordia was there at the dawn of time.', habitat: 'Apex Summit (post-game)' },
    MEGAVORE:     { desc: 'An enormous predator pre-dating the dinosaurs themselves. Scientists do not understand its biology.', habitat: 'DinoMaster Ball required' },
    TITANREX:     { desc: 'A volcanic colossus. Its body is living magma hardened into unbreakable stone.', habitat: 'DinoMaster Ball required' },
  };
  for (const id in _dex) {
    if (DG.SPECIES[id]) {
      if (!DG.SPECIES[id].desc)    DG.SPECIES[id].desc    = _dex[id].desc;
      if (!DG.SPECIES[id].habitat) DG.SPECIES[id].habitat = _dex[id].habitat;
    }
  }
})();

// Build reverse-lookup for prevForm
(function() {
  for (const id in DG.SPECIES) {
    const s = DG.SPECIES[id];
    if (s.evolvesTo && DG.SPECIES[s.evolvesTo]) {
      DG.SPECIES[s.evolvesTo].prevForm = id;
    }
  }
})();

// ── BATTLE-STRATEGY Fase 2d: vanguard-learnset-injectie ─────────
// Elke soort leert rond Lv.24 de vanguard (priority-aanval) van zijn
// primaire type — zo heeft élke speler het gereedschap om een snellere
// tegenstander vóór te zijn. Runtime-injectie: één plek, geen 121
// handmatige learnset-edits; wordt overgeslagen als de soort de move
// al kent of er al een eigen priority-aanval in de learnset heeft.
DG.VANGUARDS = {
  NORMAL:'QUICK_ATTACK', FIRE:'FIRECRACKER',  WATER:'AQUA_JET',
  GRASS:'LEAF_DART',     ELECTRIC:'STATIC_JAB', ICE:'ICE_SHARD',
  FIGHTING:'MACH_PUNCH', POISON:'VENOM_DART', GROUND:'MUD_DART',
  FLYING:'SWIFT_WING',   PSYCHIC:'MIND_FLICK', BUG:'SKITTER',
  ROCK:'ACCELEROCK',     GHOST:'SHADOW_SNEAK', DRAGON:'TAIL_FEINT',
  DARK:'SUCKER_PUNCH',   STEEL:'BULLET_PUNCH', FAIRY:'PIXIE_STRIKE',
};
(function() {
  const VANGUARD_IDS = new Set(Object.values(DG.VANGUARDS));
  for (const id in DG.SPECIES) {
    const s = DG.SPECIES[id];
    const t = s.types && s.types[0];
    const vg = t && DG.VANGUARDS[t];
    if (!vg) continue;
    if (!Array.isArray(s.learnset)) s.learnset = [];
    const hasVanguard = s.learnset.some(e => {
      const mv = Array.isArray(e.move) ? e.move : [e.move];
      return mv.some(m => VANGUARD_IDS.has(m));
    });
    if (!hasVanguard) s.learnset.push({ level: 24, move: vg });
  }
})();

DG.SPECIES_LIST = Object.keys(DG.SPECIES);
console.log('[DinoMon] Species loaded: ' + DG.SPECIES_LIST.length);

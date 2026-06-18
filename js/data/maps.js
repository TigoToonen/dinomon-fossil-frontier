// DinoMon: Fossil Frontier — data/maps.js  v56
// All game maps with tile arrays, NPCs, warps and encounter tables

window.DG = window.DG || {};

// Tile ID quick references (matching constants.js)
// 0=floor/path 1=grass 2=tall_grass 3=water 4=sand 5=dirt
// 6=ice 7=lava 8=swamp 9=flower
// 64=tree 65=wall 66=mountain 67=sign 68=door 69=rock 70=fence
// 71=water_edge 72=cave_wall 73=statue 74=counter 75=pc 76=heal_pad

DG.MAPS = {

// ─────────────────────────────────────────────────────────────
// TOWNS & CITIES
// ─────────────────────────────────────────────────────────────

AMBERTOWN: {
  id: 'AMBERTOWN', name: 'Ambertown', width: 20, height: 15,
  music: 'TOWN_CALM', isIndoor: false, isCave: false,
  tiles: [
    // Row 0: North border — route exit at cols 9-10
    [64,64,64,64,64,64,64,64,64, 0, 0,64,64,64,64,64,64,64,64,64],
    // Row 1: Grass flanks, wide open center path
    [64, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1,64],
    // Row 2-4: Lab building (left cols 2-6), Center building (right cols 13-17)
    [64, 1,65,65,65,65,65, 0, 0, 0, 0, 0, 0,65,65,65,65,65, 1,64],
    [64, 1,65,65,65,65,65, 0, 0, 0, 0, 0, 0,65,65,65,65,65, 1,64],
    [64, 1,65,65,65,65,65, 0, 0, 0, 0, 0, 0,65,65,65,65,65, 1,64],
    // Row 5: Lab door at col 4, Center door at col 15
    [64, 1,65,65,68,65,65, 0, 0, 0, 0, 0, 0,65,65,68,65,65, 1,64],
    // Row 6: Open grassy street
    [64, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1,64],
    // Row 7: Open plaza with sign
    [64, 0, 0, 0, 0, 0, 0, 0, 0, 0,67, 0, 0, 0, 0, 0, 0, 0, 0,64],
    // Row 8: Open street
    [64, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,64],
    // Row 9-10: House (left cols 0-4), Shop (right cols 15-19)
    [64,65,65,65,65, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,65,65,65,65,64],
    [64,65,65,65,65, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,65,65,65,65,64],
    // Row 11: House door at col 2, Shop door at col 16
    [64,65,68,65,65, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,65,68,65,65,64],
    // Row 12: Open south street — player spawns here
    [64, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,64],
    // Row 13: Grass south border
    [64, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,64],
    // Row 14: Tree border
    [64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64],
  ],
  warps: [
    { x:9,  y:0,  targetMap:'ROUTE_1A',         targetX:10, targetY:16 },
    { x:10, y:0,  targetMap:'ROUTE_1A',         targetX:11, targetY:16 },
    { x:4,  y:5,  targetMap:'AMBERTOWN_LAB',    targetX:9,  targetY:10  },
    { x:15, y:5,  targetMap:'AMBERTOWN_CENTER', targetX:7,  targetY:8  },
    { x:2,  y:11, targetMap:'AMBERTOWN_HOUSE',  targetX:3,  targetY:8  },
    { x:16, y:11, targetMap:'AMBERTOWN_SHOP',   targetX:5,  targetY:7  },
  ],
  npcs: [
    { id:'AMBERTOWN_NPC1', name:'Old Sam', x:3, y:8, facing:'RIGHT', spriteKey:'NPC_MAN',
      movementType:'STATIONARY', dialogue:['NPC_AMBERTOWN_1'], onInteract:null },
    { id:'AMBERTOWN_NPC2', name:'Girl', x:16, y:8, facing:'LEFT', spriteKey:'NPC_KID',
      movementType:'STATIONARY', dialogue:['NPC_AMBERTOWN_2'], onInteract:null },
    { id:'AMBERTOWN_NPC3', name:'Ranger', x:9, y:12, facing:'UP', spriteKey:'NPC_MAN',
      movementType:'STATIONARY', dialogue:['NPC_AMBERTOWN_3'], onInteract:null },
  ],
  encounterTable: { grass:[], water:[] },
  events: [
    { id:'EVT_INTRO', triggerType:'AUTO', x:null, y:null, flagRequired:null, flagSet:'GAME_STARTED', scriptId:'INTRO_CUTSCENE' },
  ],
},

AMBERTOWN_LAB: {
  id:'AMBERTOWN_LAB', name:'Professor Stratum\'s Lab', width:20, height:12,
  music:'LAB_THEME', isIndoor:true, isCave:false,
  tiles: [
    [65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65],
    // Row 1: bookshelves along north wall
    [65,81,81,81,81,81, 5, 5, 5, 5, 5, 5, 5,81,81,81,81,81,81,65],
    // Row 2: counters (lab benches) flanking center gap
    [65, 5,74,74,74,74,74, 5, 5, 5, 5, 5, 5,74,74,74,74,74, 5,65],
    // Row 3: Professor's zone
    [65, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,65],
    // Row 4: fossil display (statues), research table in center
    [65, 5, 5,73, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,73, 5, 5, 5,65],
    // Row 5: open
    [65, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,65],
    // Row 6: three display cases (pokedex stations)
    [65, 5, 5, 5, 5, 5, 5,73, 5, 5, 5,73, 5, 5, 5,73, 5, 5, 5,65],
    // Row 7: open walkway
    [65, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,65],
    // Row 8: PC station left, plant right
    [65,75, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,82,65],
    // Row 9: open
    [65, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,65],
    // Row 10: open — player enters here
    [65, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,65],
    // Row 11: south wall with door
    [65,65,65,65,65,65,65,65,68,68,65,65,65,65,65,65,65,65,65,65],
  ],
  warps: [
    { x:8,  y:11, targetMap:'AMBERTOWN', targetX:4, targetY:6 },
    { x:9,  y:11, targetMap:'AMBERTOWN', targetX:4, targetY:6 },
  ],
  npcs: [
    { id:'PROF_STRATUM', name:'Prof. Stratum', x:9, y:4, facing:'DOWN', spriteKey:'NPC_PROF',
      movementType:'STATIONARY', dialogue:['PROF_INTRO_1','PROF_INTRO_2'],
      onInteract:'TRIGGER_STARTER', shopItems:null, trainerRef:null },
    { id:'LAB_ASSISTANT', name:'Assistant', x:3, y:3, facing:'RIGHT', spriteKey:'NPC_WOMAN',
      movementType:'STATIONARY', dialogue:['NPC_AMBERTOWN_2'], onInteract:null },
    // Lore NPCs — Feature 5
    { id:'LAB_BOOKSHELF', name:'Bookshelf', x:3, y:1, facing:'DOWN', spriteKey:'NPC_MAN',
      movementType:'STATIONARY',
      dialogue:["The DinoMon Encyclopedia... Vol 1-47.", "Each volume covers a different era of prehistoric life."],
      onInteract:null },
    { id:'LAB_FOSSIL_PRINT', name:'Fossil Print', x:3, y:4, facing:'RIGHT', spriteKey:'NPC_PROF',
      movementType:'STATIONARY',
      dialogue:["Those fossil prints on the wall are from the Triassic era...", "Over 250 million years old. The very first DinoMons roamed this land."],
      onInteract:null },
    { id:'LAB_RESEARCH_TABLE', name:'Research Notes', x:7, y:6, facing:'DOWN', spriteKey:'NPC_PROF',
      movementType:'STATIONARY',
      dialogue:["Prof. Stratum's notes: 'Primordial Aura may be the key to everything...'", "'If the Permian Core activates, no DinoMon will be safe.'"],
      onInteract:null },
    { id:'LAB_SECOND_RESEARCHER', name:'Researcher', x:16, y:3, facing:'LEFT', spriteKey:'NPC_MAN',
      movementType:'STATIONARY',
      dialogue:["I've catalogued 87 species so far.", "The Professor believes there are at least 120 undiscovered forms out there!"],
      onInteract:null },
    { id:'FLINT_LAB', name:'Flint', x:12, y:7, facing:'LEFT', spriteKey:'NPC_RIVAL',
      movementType:'STATIONARY', dialogue:['FLINT_INTRO'], onInteract:'TRIGGER_RIVAL',
      trainerRef:'RIVAL_1_FIRE', flagToHide:'RIVAL_BATTLE_1_DONE' },
  ],
  encounterTable:{ grass:[], water:[] },
  events:[
    { id:'EVT_STARTER', triggerType:'INTERACT', x:null, y:null, flagRequired:null, flagSet:'STARTER_CHOSEN', scriptId:'STARTER_SELECTION' },
  ],
},

AMBERTOWN_HOUSE: {
  id:'AMBERTOWN_HOUSE', name:'Your House', width:12, height:10,
  music:'HOUSE_THEME', isIndoor:true, isCave:false,
  tiles: [
    // Row 0: walls
    [65,65,65,65,65,65,65,65,65,65,65,65],
    // Row 1: bookshelf top-left, plant top-right, calendar on wall
    [65, 5,81, 5, 5, 5, 5, 5,82, 5,81,65],
    // Row 2: TV left, wardrobe, bed top-right (2 tiles wide)
    [65,79, 5, 5, 5, 5, 5, 5,80,80, 5,65],
    // Row 3: rug area (5 tiles)
    [65, 5, 5,77, 5, 5, 5, 5, 5, 5, 5,65],
    // Row 4: table (2 wide), PC on right side
    [65, 5, 5,78,78, 5, 5,75, 5, 5, 5,65],
    // Row 5: chair south of table, potted plant
    [65, 5, 5,77, 5, 5, 5, 5, 5,82, 5,65],
    // Row 6: open floor
    [65, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,65],
    // Row 7: doormat area
    [65, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,65],
    // Row 8: open — player spawns here from door
    [65, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,65],
    // Row 9: south wall with door at col 3
    [65,65,65,68,65,65,65,65,65,65,65,65],
  ],
  warps:[{ x:3, y:9, targetMap:'AMBERTOWN', targetX:2, targetY:12 }],
  npcs:[
    { id:'MOM', name:'Mom', x:6, y:4, facing:'LEFT', spriteKey:'NPC_WOMAN',
      movementType:'STATIONARY', dialogue:['MOM_GOODBYE'], onInteract:null },
    { id:'HOUSE_KID_NOTE', name:'Note', x:9, y:2, facing:'DOWN', spriteKey:'NPC_MAN',
      movementType:'STATIONARY',
      dialogue:["(Your old DinoMon encyclopedia sits on the shelf... You've been dreaming of becoming a trainer for years.)"],
      onInteract:null },
    { id:'HOUSE_PC', name:'PC', x:7, y:4, facing:'DOWN', spriteKey:'NPC_MAN',
      movementType:'STATIONARY',
      dialogue:["MOM: Don't forget to save your progress, dear!"],
      onInteract:'OPEN_PC' },
  ],
  encounterTable:{ grass:[], water:[] }, events:[],
},

AMBERTOWN_CENTER: {
  id:'AMBERTOWN_CENTER', name:'DinoCenter — Ambertown', width:16, height:12,
  music:'CENTER_THEME', isIndoor:true, isCave:false,
  tiles: [
    [65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65],
    [65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65],
    [65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65],
    [65,74,74,74,74,74,74,76,76,74,74,74,74,74,74,65],
    [65, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,65],
    [65, 5,77, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,77, 5,65],
    [65, 5,78,78, 5, 5, 5, 5, 5, 5, 5,78,78, 5, 5,65],
    [65, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,65],
    [65,75, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,82, 5,65],
    [65, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,65],
    [65, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,65],
    [65,65,65,65,65,65,65,68,68,65,65,65,65,65,65,65],
  ],
  warps:[
    { x:7, y:11, targetMap:'AMBERTOWN', targetX:15, targetY:6 },
    { x:8, y:11, targetMap:'AMBERTOWN', targetX:15, targetY:6 },
  ],
  npcs:[
    { id:'HEALER_AMBER', name:'Nurse Rosa', x:7, y:2, facing:'DOWN',
      spriteKey:'NPC_HEALER', movementType:'STATIONARY',
      dialogue:['HEALER_GREET'], onInteract:'HEAL_PARTY' },
    { id:'HEALER_AMBER2', name:'Nurse Rosa', x:8, y:2, facing:'DOWN',
      spriteKey:'NPC_HEALER', movementType:'STATIONARY',
      dialogue:['HEALER_GREET'], onInteract:'HEAL_PARTY' },
    { id:'CENTER_NPC1', name:'Trainer', x:5, y:5, facing:'RIGHT',
      spriteKey:'NPC_KID', movementType:'STATIONARY',
      dialogue:['CENTER_TIP_1'], onInteract:null },
    { id:'CENTER_NPC2', name:'Visitor', x:10, y:5, facing:'LEFT',
      spriteKey:'NPC_WOMAN', movementType:'STATIONARY',
      dialogue:['CENTER_TIP_2'], onInteract:null },
  ],
  encounterTable:{ grass:[], water:[] }, events:[],
},

SHELLCREEK_CITY: {
  id:'SHELLCREEK_CITY', name:'Shellcreek City', width:20, height:15,
  music:'TOWN_UPBEAT', isIndoor:false, isCave:false,
  tiles: [
    [71,71,71,71, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,71,71,71,71],
    [71,71,71,71, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,71,71,71,71],
    [64, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,64],
    [64, 0,65,65,65,65, 0, 0, 0, 0, 0, 0,65,65,65,65,65,65, 0,64],
    [64, 0,65,65,65,65, 0, 0, 0, 0, 0, 0,65,75,65,76,65,65, 0,64],
    [64, 0,65,68,65,65, 0, 0, 0, 0, 0, 0,65,65,65,68,65,65, 0,64],
    [64, 0, 0, 0, 0, 0, 0, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,64],
    [64, 0,65,65,65,65,65,65, 0, 0, 0, 0, 0, 0, 0,65,65,65, 0,64],
    [64, 0,65,65,65,65,65,65, 0, 0, 0, 0, 0, 0, 0,65,65,65, 0,64],
    [64, 0,65,65,68,65,65,65, 0, 0, 0, 0, 0, 0, 0,65,68,65, 0,64],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,67, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [64,72, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1,72, 0],
    [64, 2, 2, 2, 2, 2, 2, 1, 1, 0, 0, 0, 1, 1, 2, 2, 2, 2, 2, 0],
    [64,64, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,64,64],
    [64,64,64,64,64,64,64,64,64, 0, 0,64,64,64,64,64,64,64,64,64],
  ],
  warps:[
    { x:9,  y:14, targetMap:'ROUTE_1B', targetX:10, targetY:1  },
    { x:10, y:14, targetMap:'ROUTE_1B', targetX:11, targetY:1  },
    { x:0,  y:10, targetMap:'ROUTE_2A', targetX:9, targetY:1, requiresFlag:'BADGE_1' },
    { x:3,  y:5,  targetMap:'SHELLCREEK_GYM', targetX:14, targetY:16 },
    // FASE 8: deuren verplaatst naar de straatkant (onderrij van het gebouw) —
    // de center-warp zat aan de zijkant en de shop-deur was ingemetseld
    { x:16, y:9,  targetMap:'SHELLCREEK_CENTER', targetX:7, targetY:8 },
    { x:15, y:5,  targetMap:'SHELLCREEK_SHOP', targetX:5, targetY:7  },
    { x:4,  y:9,  targetMap:'SHELLCREEK_HOUSE1', targetX:3, targetY:8 },
    { x:19, y:11, targetMap:'SHELLCREEK_WILD', targetX:1, targetY:7  },
    { x:19, y:12, targetMap:'SHELLCREEK_WILD', targetX:1, targetY:8  },
  ],
  npcs:[
    { id:'SC_NPC1', name:'Sailor', x:6, y:6, facing:'DOWN', spriteKey:'NPC_MAN',
      movementType:'WANDER', dialogue:['NPC_SHELLCREEK_1'], onInteract:null },
    { id:'SC_NPC2', name:'Fisher', x:11, y:10, facing:'RIGHT', spriteKey:'NPC_MAN',
      movementType:'STATIONARY', dialogue:['NPC_SHELLCREEK_2'], onInteract:null },
    { id:'SC_NPC3', name:'Lady', x:14, y:6, facing:'LEFT', spriteKey:'NPC_WOMAN',
      movementType:'WANDER', dialogue:['NPC_SHELLCREEK_3'], onInteract:null },
    // Guard blocks western exit until Herd Badge (BADGE_1) earned from Rex
    { id:'SC_GUARD', name:'Officer', x:1, y:10, facing:'RIGHT', spriteKey:'NPC_MAN',
      movementType:'STATIONARY',
      dialogue:["The route ahead is blocked. Defeat Rex at the Shellcreek Gym first!"],
      flagToHide:'BADGE_1',
      onInteract: null },
    // Guard stepped aside (one tile north) after badge earned — no longer blocks the path
    { id:'SC_GUARD_DONE', name:'Officer', x:1, y:9, facing:'RIGHT', spriteKey:'NPC_MAN',
      movementType:'STATIONARY',
      dialogue:["The Herd Badge — Rex's mark. The path to Route 2 is open! Head west!"],
      requiresFlag:'BADGE_1',
      onInteract: null },
    { id:'SC_WILD_SIGN', name:'Sign', x:18, y:10, facing:'DOWN', spriteKey:'NPC_MAN',
      movementType:'STATIONARY',
      dialogue:["Wild DinoMons can be found in the area to the east."],
      onInteract:null },
  ],
  encounterTable:{ grass:[], water:[
    { speciesId:'MUDFIN',   minLv:7, maxLv:10, rate:55 },
    { speciesId:'MARSHFIN', minLv:7, maxLv:10, rate:45 },
  ]},
  events:[],
},


DUSTWALL_TOWN: {
  id:'DUSTWALL_TOWN', name:'Dustwall Town', width:20, height:15,
  music:'TOWN_DESERT', isIndoor:false, isCave:false,
  tiles: [
    [66,66,66,66,66,66,66,66,66, 4, 4,66,66,66,66,66,66,66,66,66],
    [66, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,66],
    [66, 4, 4, 4,65,65,65,65, 4, 4, 4, 4,65,65,65,65,65,65, 4,66],
    [66, 4, 4, 4,65,65,65,65, 4, 4, 4, 4,65,75,65,76,65,68, 4,66],
    [66, 4, 4, 4,65,68,65,65, 4, 4, 4, 4,65,65,65,65,65,65, 4,66],
    [66, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,66],
    [66, 4, 4, 4,65,65,65,65,65,65, 4, 4, 4, 4, 4,65,65,65, 4,66],
    [66, 4, 4, 4,65,65,65,65,65,65, 4, 4, 4, 4, 4,65,68,65, 4,66],
    [66, 4, 4, 4,65,68,65,65,65,65, 4, 4, 4, 4, 4,65,65,65, 4,66],
    [66, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,67, 4, 4, 4, 4, 4, 4, 4,66],
    [66, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,66],
    [66, 2, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 2, 2, 2, 2, 4],
    [66, 2, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 2, 2, 2, 2, 4],
    [66,66, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,66,66],
    [66,66,66,66,66,66,66,66,66, 4, 4,66,66,66,66,66,66,66,66,66],
  ],
  warps:[
    { x:9,  y:0, targetMap:'ROUTE_2B', targetX:9,  targetY:16 },
    { x:10, y:0, targetMap:'ROUTE_2B', targetX:10, targetY:16 },
    { x:9, y:14, targetMap:'ROUTE_3A', targetX:9,  targetY:1  },
    { x:10,y:14, targetMap:'ROUTE_3A', targetX:10, targetY:1  },
    { x:5,  y:4, targetMap:'DUSTWALL_GYM', targetX:14, targetY:16 },
    { x:17, y:3, targetMap:'DUSTWALL_CENTER', targetX:7, targetY:8 },
    { x:16, y:7, targetMap:'DUSTWALL_SHOP', targetX:5, targetY:7  },
    { x:5,  y:8, targetMap:'DUSTWALL_HOUSE1', targetX:3, targetY:8 },
    { x:19, y:11, targetMap:'DUSTWALL_WILD', targetX:1, targetY:7  },
    { x:19, y:12, targetMap:'DUSTWALL_WILD', targetX:1, targetY:8  },
  ],
  npcs:[
    { id:'DW_NPC1', name:'Geologist', x:6, y:9, facing:'DOWN', spriteKey:'NPC_MAN',
      movementType:'WANDER', dialogue:['NPC_DUSTWALL_1'], onInteract:null },
    { id:'DW_NPC2', name:'Child', x:12, y:5, facing:'LEFT', spriteKey:'NPC_KID',
      movementType:'WANDER', dialogue:['NPC_DUSTWALL_2'], onInteract:null },
    { id:'DW_NPC3', name:'Elder', x:10, y:10, facing:'DOWN', spriteKey:'NPC_MAN',
      movementType:'STATIONARY', dialogue:['NPC_DUSTWALL_3'], onInteract:null },
    { id:'DW_WILD_SIGN', name:'Sign', x:18, y:10, facing:'DOWN', spriteKey:'NPC_MAN',
      movementType:'STATIONARY',
      dialogue:["Wild DinoMons can be found in the area to the east."],
      onInteract:null },
    { id:'DW_GUARD', name:'Officer', x:9, y:13, facing:'DOWN', spriteKey:'NPC_MAN',
      movementType:'STATIONARY',
      dialogue:["The southern route is blocked. Defeat Ridley at the Dustwall Gym first — you need the Fossil Badge!"],
      flagToHide:'BADGE_2',
      onInteract: null },
    // Guard stepped aside (one tile right) after badge earned — no longer blocks the path
    { id:'DW_GUARD_DONE', name:'Officer', x:10, y:13, facing:'DOWN', spriteKey:'NPC_MAN',
      movementType:'STATIONARY',
      dialogue:["The Fossil Badge — Ridley's mark. Route 3 lies to the south — good luck!"],
      requiresFlag:'BADGE_2',
      onInteract: null },
  ],
  encounterTable:{ grass:[
    { speciesId:'SANDCLAW', minLv:12, maxLv:15, rate:35 },
    { speciesId:'ROCKLETT', minLv:12, maxLv:15, rate:35 },
    { speciesId:'NORMLET',  minLv:10, maxLv:14, rate:30 },
  ], water:[]},
  events:[],
},


PYRESIDE_CITY: {
  id:'PYRESIDE_CITY', name:'Pyreside City', width:20, height:15,
  music:'TOWN_INDUSTRIAL', isIndoor:false, isCave:false,
  tiles: [
    [66,66,66,66,66,66,66,66,66, 0, 0,66,66,66,66,66,66,66,66,66],
    [66, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,66],
    [66, 5,65,65,65,65, 5, 5, 5, 5, 5, 5,65,65,65,65,65,65, 5,66],
    [66, 5,65,65,65,65, 5, 5, 5, 5, 5, 5,65,75,65,76,65,68, 5,66],
    [66, 5,65,68,65,65, 5, 5, 5, 5, 5, 5,65,65,65,65,65,65, 5,66],
    [66, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,66],
    [66, 5,65,65,65,65,65,65, 5, 5, 5,65,65,65,65, 5,65,65, 5,66],
    [66, 5,65,65,65,65,65,65, 5, 5, 5,65,65,65,65, 5,65,68, 5,66],
    [66, 5,65,68,65,65,65,65, 5, 5, 5,65,65,65,65, 5,65,65, 5,66],
    [66, 5, 5, 5, 5, 5, 5, 5, 5, 5,67, 5, 5, 5, 5, 5, 5, 5, 5,66],
    [66, 7, 7, 7, 7, 5, 5, 5, 5, 5, 5, 5, 5, 7, 7, 7, 7, 7, 5,66],
    [66, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0],
    [66, 1, 1, 1, 1, 1, 5, 5, 5, 5, 5, 5, 5, 5, 1, 1, 1, 1, 1, 0],
    [66,66, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,66,66],
    [66,66,66,66,66,66,66,66,66, 0, 0,66,66,66,66,66,66,66,66,66],
  ],
  warps:[
    { x:9, y:0,  targetMap:'ROUTE_3B', targetX:9, targetY:18 },
    { x:10,y:0,  targetMap:'ROUTE_3B', targetX:10,targetY:18 },
    { x:9, y:14, targetMap:'ROUTE_4A', targetX:9, targetY:1  },
    { x:10,y:14, targetMap:'ROUTE_4A', targetX:10,targetY:1  },
    { x:3, y:4,  targetMap:'PYRESIDE_GYM',    targetX:14, targetY:16 },
    { x:17,y:3,  targetMap:'PYRESIDE_CENTER', targetX:7, targetY:8  },
    { x:17,y:7,  targetMap:'PYRESIDE_SHOP',   targetX:5, targetY:7  },
    { x:19, y:11, targetMap:'PYRESIDE_WILD', targetX:1, targetY:7  },
    { x:19, y:12, targetMap:'PYRESIDE_WILD', targetX:1, targetY:8  },
  ],
  npcs:[
    { id:'PY_NPC1', name:'Worker', x:7, y:9, facing:'RIGHT', spriteKey:'NPC_MAN',
      movementType:'WANDER', dialogue:['NPC_PYRESIDE_1'], onInteract:null },
    { id:'PY_NPC2', name:'Engineer', x:13, y:5, facing:'LEFT', spriteKey:'NPC_MAN',
      movementType:'STATIONARY', dialogue:['NPC_PYRESIDE_2'], onInteract:null },
    { id:'PY_WILD_SIGN', name:'Sign', x:18, y:10, facing:'DOWN', spriteKey:'NPC_MAN',
      movementType:'STATIONARY',
      dialogue:["Wild DinoMons can be found in the area to the east."],
      onInteract:null },
    { id:'PY_GUARD', name:'Officer', x:9, y:13, facing:'DOWN', spriteKey:'NPC_MAN',
      movementType:'STATIONARY',
      dialogue:["The southern route is blocked. Defeat Ignis at the Pyreside Gym first — you need the Magma Badge!"],
      flagToHide:'BADGE_3',
      onInteract: null },
    // Second guard blocks x:10 (player could slip past on that column without badge)
    { id:'PY_GUARD_2', name:'Officer', x:10, y:13, facing:'DOWN', spriteKey:'NPC_MAN',
      movementType:'STATIONARY',
      dialogue:["The southern route is blocked. Defeat Ignis at the Pyreside Gym first — you need the Magma Badge!"],
      flagToHide:'BADGE_3',
      onInteract: null },
    // Guard stepped aside (one tile right) after badge earned — no longer blocks the path
    { id:'PY_GUARD_DONE', name:'Officer', x:10, y:13, facing:'DOWN', spriteKey:'NPC_MAN',
      movementType:'STATIONARY',
      dialogue:["The Magma Badge — Ignis's mark. Route 4 lies to the south — good luck!"],
      requiresFlag:'BADGE_3',
      onInteract: null },
    { id:'FLINT_PYRE', name:'Flint', x:8, y:8, facing:'RIGHT', spriteKey:'NPC_RIVAL',
      movementType:'STATIONARY', dialogue:['RIVAL_PRE_3'], onInteract:'TRIGGER_RIVAL',
      trainerRef:'RIVAL_3_FIRE', requiresFlag:'BADGE_2', flagToHide:'RIVAL_BATTLE_3_DONE' },
  ],
  encounterTable:{ grass:[
    { speciesId:'EMBRIX',    minLv:20, maxLv:24, rate:45 },
    { speciesId:'ROCKLETT',  minLv:18, maxLv:22, rate:35 },
    { speciesId:'BONEBACK',  minLv:19, maxLv:23, rate:20 },
  ], water:[]},
  events:[],
},

STONEHAVEN_CITY: {
  id:'STONEHAVEN_CITY', name:'Stonehaven City', width:20, height:15,
  music:'TOWN_GRAND', isIndoor:false, isCave:false,
  tiles: [
    [66,66,66,66,66,66,66,66,66, 4, 4,66,66,66,66,66,66,66,66,66],
    [66, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,66],
    [66, 4,65,65,65,65,65,65, 4, 4, 4, 4,65,65,65,65,65,65, 4,66],
    [66, 4,65,65,65,65,65,65, 4, 4, 4, 4,65,75,65,76,65,68, 4,66],
    [66, 4,65,68,65,65,65,65, 4, 4, 4, 4,65,65,65,65,65,65, 4,66],
    [66, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,66],
    [66, 4,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65, 4,66],
    [66, 4,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65, 4,66],
    [66, 4,65,68,65,65,65,65,65,65,65,65,65,65,65,65,68,65, 4,66],
    [66, 4, 4, 4, 4, 4, 4, 4, 4, 4,67, 4, 4, 4, 4, 4, 4, 4, 4,66],
    [ 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0],
    [66, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0],
    [66, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1, 1, 1, 0],
    [66,66, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,66,66],
    [66,66,66,66,66,66,66,66,66,66,66,66,66,66,66,66,66,66,66,66],
  ],
  warps:[
    { x:9,  y:0,  targetMap:'ROUTE_5C',  targetX:9,  targetY:23 },
    { x:10, y:0,  targetMap:'ROUTE_5C',  targetX:10, targetY:23 },
    { x:0,  y:10, targetMap:'ROUTE_6A',  targetX:9,  targetY:1  },
    { x:19, y:10, targetMap:'ROUTE_7A',  targetX:9,  targetY:1  },
    { x:3,  y:4,  targetMap:'STONEHAVEN_GYM',    targetX:14, targetY:16 },
    { x:17, y:3,  targetMap:'STONEHAVEN_CENTER',  targetX:7, targetY:8  },
    { x:16, y:8,  targetMap:'STONEHAVEN_MUSEUM',  targetX:7, targetY:8  },
    { x:3,  y:8,  targetMap:'STONEHAVEN_SHOP',    targetX:5, targetY:7  },
    { x:19, y:11, targetMap:'STONEHAVEN_WILD', targetX:1, targetY:7  },
    { x:19, y:12, targetMap:'STONEHAVEN_WILD', targetX:1, targetY:8  },
  ],
  npcs:[
    { id:'SH_NPC1', name:'Professor', x:7, y:9, facing:'DOWN', spriteKey:'NPC_PROF',
      movementType:'STATIONARY', dialogue:['NPC_STONEHAVEN_1'], onInteract:null },
    { id:'SH_NPC2', name:'Trainer', x:13, y:5, facing:'LEFT', spriteKey:'NPC_MAN',
      movementType:'WANDER', dialogue:['NPC_STONEHAVEN_2'], onInteract:null },
    { id:'SH_NPC3', name:'Artist', x:10, y:11, facing:'UP', spriteKey:'NPC_WOMAN',
      movementType:'WANDER', dialogue:['NPC_STONEHAVEN_3'], onInteract:null },
    { id:'SH_CMD_JURASSIC', name:'Commander Jurassic', x:5, y:5, facing:'RIGHT', spriteKey:'NPC_GRUNT',
      movementType:'STATIONARY', dialogue:['CMD_JURASSIC_1'],
      trainerRef:'CMD_JURASSIC', requiresFlag:'BADGE_5', flagToHide:'TRAINER_CMD_JURASSIC_DEFEATED' },
    { id:'SH_WILD_SIGN', name:'Sign', x:18, y:10, facing:'DOWN', spriteKey:'NPC_MAN',
      movementType:'STATIONARY',
      dialogue:["Wild DinoMons can be found in the area to the east."],
      onInteract:null },
    { id:'FLINT_STONE', name:'Flint', x:10, y:8, facing:'DOWN', spriteKey:'NPC_RIVAL',
      movementType:'STATIONARY', dialogue:['RIVAL_PRE_4'], onInteract:'TRIGGER_RIVAL',
      trainerRef:'RIVAL_4_FIRE', requiresFlag:'BADGE_4', flagToHide:'RIVAL_BATTLE_4_DONE' },
  ],
  encounterTable:{ grass:[], water:[] }, events:[],
},

APEXSUMMIT: {
  id:'APEXSUMMIT', name:'Apex Summit', width:20, height:15,
  music:'TOWN_PEAK', isIndoor:false, isCave:false,
  tiles: [
    [66,66,66,66,66,66,66,66,66, 6, 6,66,66,66,66,66,66,66,66,66],
    [66, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,66],
    [66, 6,65,65,65,65, 6, 6, 6, 6, 6, 6,65,65,65,65,65,65, 6,66],
    [66, 6,65,65,65,65, 6, 6, 6, 6, 6, 6,65,75,65,76,65,68, 6,66],
    [66, 6,65,68,65,65, 6, 6, 6, 6, 6, 6,65,65,65,65,65,65, 6,66],
    [66, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,66],
    [66, 6,65,65,65,65,65,65, 6, 6, 6, 6, 6,65,65,65,65,65, 6,66],
    [66, 6,65,65,65,65,65,65, 6, 6, 6, 6, 6,65,65,65,65,65, 6,66],
    [66, 6,65,68,65,65,65,65, 6, 6, 6, 6, 6,65,68,65,65,65, 6,66],
    [66, 6, 6, 6, 6, 6, 6, 6, 6, 6,67, 6, 6, 6, 6, 6, 6, 6, 6,66],
    [66, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,66],
    [66, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,66],
    [66, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,66],
    [66,66, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,66,66],
    [66,66,66,66,66,66,66,66,66, 6, 6,66,66,66,66,66,66,66,66,66],
  ],
  warps:[
    { x:9, y:0, targetMap:'MT_CRETACEOUS', targetX:9, targetY:13, requiresFlag:'BADGE_8' },
    { x:9,  y:1, targetMap:'FOSSIL_GATEWAY', targetX:9,  targetY:8, requiresFlag:'BADGE_8' },
    { x:10, y:1, targetMap:'FOSSIL_GATEWAY', targetX:10, targetY:8, requiresFlag:'BADGE_8' },
    { x:9, y:14, targetMap:'ROUTE_10E', targetX:9,  targetY:36 },
    { x:10,y:14, targetMap:'ROUTE_10E', targetX:10, targetY:36 },
    { x:3, y:4, targetMap:'APEXSUMMIT_GYM',    targetX:14, targetY:16 },
    { x:17,y:3, targetMap:'APEXSUMMIT_CENTER',  targetX:7, targetY:8 },
    { x:14,y:8, targetMap:'APEXSUMMIT_SHOP',    targetX:5, targetY:7 },
    { x:3, y:8, targetMap:'APEXSUMMIT_GYM',     targetX:14, targetY:16 },
    { x:12, y:5, targetMap:'APEXSUMMIT_WILD', targetX:1, targetY:6 },
    { x:12, y:6, targetMap:'APEXSUMMIT_WILD', targetX:1, targetY:7 },
  ],
  npcs:[
    { id:'AS_NPC1', name:'Champion', x:7, y:9, facing:'DOWN', spriteKey:'NPC_MAN',
      movementType:'STATIONARY', dialogue:['NPC_APEXSUMMIT_1'], onInteract:null },
    { id:'AS_NPC2', name:'Ranger', x:13, y:5, facing:'LEFT', spriteKey:'NPC_MAN',
      movementType:'WANDER', dialogue:['NPC_APEXSUMMIT_2'], onInteract:null },
    // Post-game: Champion rewards DinoMaster Ball after Clade is defeated
    { id:'AS_CHAMPION_REWARD', name:'Grand Champion', x:10, y:5, facing:'DOWN', spriteKey:'NPC_PROF',
      movementType:'STATIONARY', dialogue:['CHAMPION_REWARD'],
      onInteract:'GIVE_MASTERBALL', requiresFlag:'DIRECTOR_CLADE_DEFEATED',
      flagToHide:'MASTERBALL_GIVEN' },
    // Post-game: Fossil Sage triggers PRIMORDIA encounter
    { id:'AS_PRIMORDIA_SAGE', name:'Fossil Sage', x:5, y:5, facing:'RIGHT', spriteKey:'NPC_PROF',
      movementType:'STATIONARY', dialogue:['PRIMORDIA_LEGEND'],
      onInteract:'TRIGGER_PRIMORDIA', requiresFlag:'DIRECTOR_CLADE_DEFEATED',
      flagToHide:'PRIMORDIA_ENCOUNTERED' },
  ],
  encounterTable:{ grass:[], water:[] }, events:[],
},

// ─────────────────────────────────────────────────────────────
// ROUTES
// ─────────────────────────────────────────────────────────────

// Route 1 has been split into ROUTE_1A and ROUTE_1B below
// AMBERTOWN → ROUTE_1A → ROUTE_1B → SHELLCREEK_CITY

ROUTE_1A: {
  id:'ROUTE_1A', name:'Route 1 — Amber Path', width:22, height:18,
  music:'ROUTE_CALM', isIndoor:false, isCave:false,
  tiles: [
    [64,64,64,64,64,64,64,64,64,64, 0, 0,64,64,64,64,64,64,64,64,64,64],
    [64, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2,64],
    [64, 2, 2, 2, 2, 2, 2, 9, 9, 2, 0, 0, 2, 9, 9, 2, 2, 2, 2, 2, 2,64],
    [64, 2, 2, 2, 2, 2, 9, 9, 9, 2, 0, 0, 2, 9, 9, 9, 2, 2, 2, 2, 2,64],
    [64, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2,64],
    [64, 2, 1, 1, 1, 1, 1,64,64, 0, 0, 0,64,64, 1, 1, 1, 1, 2, 2, 2,64],
    [64, 2, 1, 1, 1, 1,64,64,64, 0, 0, 0,64,64,64, 1, 1, 1, 1, 2, 2,64],
    [64, 1, 1, 1,67, 1, 1,64,64, 0, 0, 0,64,64, 1, 1, 1, 1, 1, 1, 2,64],
    [64, 1, 1, 1, 1, 1, 1, 1,64, 0, 0, 0,64, 1, 1, 1, 1, 1, 1, 1, 1,64],
    [64, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2,64],
    [64, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2, 2,64],
    [64, 2, 2, 2, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2,64],
    [64, 2, 2, 2, 2, 2, 1, 1, 1, 0, 0, 0, 1, 1, 1, 2, 2, 2, 2, 2, 2,64],
    [64, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2,64],
    [64, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2,64],
    [64, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2,64],
    [64, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2,64],
    [64,64,64,64,64,64,64,64,64,64, 0, 0,64,64,64,64,64,64,64,64,64,64],
  ],
  warps:[
    { x:10, y:0,  targetMap:'ROUTE_1B',  targetX:10, targetY:16 },
    { x:11, y:0,  targetMap:'ROUTE_1B',  targetX:11, targetY:16 },
    { x:10, y:17, targetMap:'AMBERTOWN', targetX:9,  targetY:1  },
    { x:11, y:17, targetMap:'AMBERTOWN', targetX:10, targetY:1  },
  ],
  npcs:[
    { id:'R1A_TRAINER1', name:'Jake', x:5, y:8, facing:'RIGHT', spriteKey:'NPC_KID',
      movementType:'STATIONARY', dialogue:['GRUNT_1'], trainerRef:'YOUNGSTER_JAKE',
      flagToHide:'TRAINER_YOUNGSTER_JAKE_DEFEATED' },
    { id:'R1A_SIGN', name:'Sign', x:3, y:7, facing:'DOWN', spriteKey:'NPC_MAN',
      movementType:'STATIONARY', dialogue:['SIGN_ROUTE1'], onInteract:null },
    { id:'R1A_WANDERER', name:'Passerby', x:14, y:12, facing:'LEFT', spriteKey:'NPC_WOMAN',
      movementType:'WANDER', dialogue:["This path leads to Shellcreek City — the ocean town!", "Watch out for tall grass, there's all kinds of DinoMons!"], onInteract:null },
  ],
  encounterTable:{ grass:[
    { speciesId:'NORMLET',   minLv:3, maxLv:5, rate:35 },
    { speciesId:'QUAKELING', minLv:3, maxLv:5, rate:25 },
    { speciesId:'BUGLING',   minLv:4, maxLv:6, rate:25 },
    { speciesId:'LEAFCUB',   minLv:4, maxLv:6, rate:15 },
  ], water:[]},
  events:[],
},

ROUTE_1B: {
  id:'ROUTE_1B', name:'Route 1 — Shellcreek Shore', width:22, height:18,
  music:'ROUTE_CALM', isIndoor:false, isCave:false,
  tiles: [
    [64,64,64,64,64,64,64,64,64,64, 0, 0,64,64,64,64,64,64,64,64,64,64],
    [64, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2,64],
    [64, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2,64],
    [64, 2, 2, 9, 9, 2, 1, 1, 1, 1, 0, 0, 1, 1, 1, 2, 9, 9, 2, 2, 2,64],
    [64, 2, 9, 9, 9, 1, 1, 1,64,64, 0, 0,64,64, 1, 1, 9, 9, 9, 2, 2,64],
    [64, 2, 2, 9, 1, 1, 1,64,64,64, 0, 0,64,64,64, 1, 1, 9, 2, 2, 2,64],
    [64, 2, 2, 1, 1, 1,64,64,64,64, 0, 0,64,64,64,64, 1, 1, 2, 2, 2,64],
    [64, 1, 1, 1, 1, 1, 1, 1,64,64, 0, 0,64,64, 1, 1, 1, 1, 1, 1, 1,64],
    // Row 8: open path — coastal grass with flanking trees
    [64, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1,64],
    [64, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2,64],
    [64, 2, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 2, 2,64],
    [64, 2, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2,64],
    [64, 2, 2, 2, 2, 2, 2, 1, 1, 1, 0, 0, 1, 1, 2, 2, 2, 2, 2, 2, 2,64],
    [64, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2,64],
    [64,67, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2,64],
    [64, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2,64],
    [64, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2,64],
    [64,64,64,64,64,64,64,64,64,64, 0, 0,64,64,64,64,64,64,64,64,64,64],
  ],
  warps:[
    { x:10, y:0,  targetMap:'SHELLCREEK_CITY', targetX:9,  targetY:13 },
    { x:11, y:0,  targetMap:'SHELLCREEK_CITY', targetX:10, targetY:13 },
    { x:10, y:17, targetMap:'ROUTE_1A',         targetX:10, targetY:1  },
    { x:11, y:17, targetMap:'ROUTE_1A',         targetX:11, targetY:1  },
  ],
  npcs:[
    { id:'R1B_TRAINER1', name:'Mina', x:15, y:4, facing:'LEFT', spriteKey:'NPC_KID',
      movementType:'STATIONARY', dialogue:['GRUNT_1'], trainerRef:'LASS_MINA',
      flagToHide:'TRAINER_LASS_MINA_DEFEATED' },
    { id:'R1B_SIGN', name:'Sign', x:1, y:14, facing:'DOWN', spriteKey:'NPC_MAN',
      movementType:'STATIONARY', dialogue:["Route 1B — Shellcreek Shore", "The sound of the ocean grows louder ahead."], onInteract:null },
    { id:'R1B_WANDERER', name:'Bird Watcher', x:6, y:12, facing:'RIGHT', spriteKey:'NPC_MAN',
      movementType:'WANDER', dialogue:["A Ptryx flew overhead this morning!", "Shellcreek City is just beyond the northern trees."], onInteract:null },
    { id:'R1B_SURF_SIGN', name:'Sign', x:4, y:7, facing:'DOWN', spriteKey:'NPC_MAN',
      movementType:'STATIONARY',
      dialogue:["A vast ocean stretches out. You'll need Surf to explore it fully someday."],
      onInteract:null },
  ],
  encounterTable:{ grass:[
    // Route 1B — coastal shore. No Dragon or Fairy here (wrong biome/too rare).
    { speciesId:'NORMLET',   minLv:5, maxLv:8, rate:30 },
    { speciesId:'SANDCLAW',  minLv:5, maxLv:7, rate:30 },
    { speciesId:'SOARWING',  minLv:5, maxLv:8, rate:25 },
    { speciesId:'BUGLING',   minLv:5, maxLv:7, rate:15 },
  ], water:[
    { speciesId:'MUDFIN',    minLv:5, maxLv:8, rate:55 },
    { speciesId:'MARSHFIN',  minLv:6, maxLv:9, rate:45 },
  ]},
  events:[],
},

// Legacy alias so old saves don't break — ROUTE_1 redirects to ROUTE_1A
ROUTE_1: {
  id:'ROUTE_1', name:'Route 1', width:20, height:15,
  music:'ROUTE_CALM', isIndoor:false, isCave:false,
  tiles: [
    [64,64,64,64,64,64,64,64,64, 0, 0,64,64,64,64,64,64,64,64,64],
    [64, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2,64],
    [64, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2,64],
    [64, 2, 2, 2, 2, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2,64],
    [64, 2, 1, 1, 1, 1, 1,64,64, 0, 0,64,64, 1, 1, 1, 1, 1, 2,64],
    [64, 2, 1, 1, 1, 1,64,64,64, 0, 0,64,64,64, 1, 1, 1, 1, 2,64],
    [64, 1, 1, 1, 1,64,64,64,64, 0, 0,64,64,64,64, 1, 1, 1, 1,64],
    [64, 1, 1,67, 1, 1, 1,64,64, 0, 0,64,64, 1, 1, 1, 1, 1, 1,64],
    [64, 1, 1, 1, 1, 1, 1, 1,64, 0, 0,64, 1, 1, 1, 1, 1, 1, 1,64],
    [64, 2, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 2,64],
    [64, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2,64],
    [64, 2, 2, 2, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2,64],
    [64, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2,64],
    [64, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2,64],
    [64,64,64,64,64,64,64,64,64, 0, 0,64,64,64,64,64,64,64,64,64],
  ],
  warps:[
    { x:9,  y:0,  targetMap:'SHELLCREEK_CITY', targetX:9,  targetY:13 },
    { x:10, y:0,  targetMap:'SHELLCREEK_CITY', targetX:10, targetY:13 },
    { x:9,  y:14, targetMap:'AMBERTOWN',        targetX:9,  targetY:1  },
    { x:10, y:14, targetMap:'AMBERTOWN',        targetX:10, targetY:1  },
  ],
  npcs:[
    { id:'R1_TRAINER1', name:'Jake', x:5, y:7, facing:'RIGHT', spriteKey:'NPC_KID',
      movementType:'STATIONARY', dialogue:['GRUNT_1'], trainerRef:'YOUNGSTER_JAKE',
      flagToHide:'TRAINER_YOUNGSTER_JAKE_DEFEATED' },
    { id:'R1_TRAINER2', name:'Mina', x:14, y:4, facing:'LEFT', spriteKey:'NPC_KID',
      movementType:'STATIONARY', dialogue:['GRUNT_1'], trainerRef:'LASS_MINA',
      flagToHide:'TRAINER_LASS_MINA_DEFEATED' },
    { id:'R1_SIGN', name:'Sign', x:3, y:7, facing:'DOWN', spriteKey:'NPC_MAN',
      movementType:'STATIONARY', dialogue:['SIGN_ROUTE1'], onInteract:null },
  ],
  encounterTable:{ grass:[
    { speciesId:'NORMLET',   minLv:2, maxLv:5, rate:30 },
    { speciesId:'QUAKELING', minLv:3, maxLv:5, rate:25 },
    { speciesId:'LEAFCUB',   minLv:3, maxLv:5, rate:25 },
    { speciesId:'SPARKLET',  minLv:2, maxLv:4, rate:20 },
  ], water:[]},
  events:[],
},

// ── Route 2 — two bladen (each 18 rows) ──────────────────────
ROUTE_2A: {
  id:'ROUTE_2A', name:'Route 2 — Area 1', width:20, height:18,
  music:'ROUTE_ROCKY', isIndoor:false, isCave:false,
  tiles: [
    [66,66,66,66,66,66,66,66,66, 0, 0,66,66,66,66,66,66,66,66,66], // 0 top border
    [66, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,66], // 1 arrival
    [66, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2,66], // 2 light grass sides
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 3 CHOKE 1
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 4 CHOKE 1
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 5 CHOKE 1
    [66, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2,66], // 6 open after choke
    [66, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,66], // 7 TRAINER 1 row
    [66, 2, 1, 1, 1,69, 1, 1, 1, 0, 0, 1, 1, 1,69, 1, 1, 1, 2,66], // 8 rocks + grass
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 9 CHOKE 2
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 10 CHOKE 2
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 11 CHOKE 2
    [66, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2,66], // 12 open
    [66, 1, 1, 1, 1,67, 1, 1, 1, 0, 0, 1, 1, 1, 1,67, 1, 1, 1,66], // 13 sign
    [66, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,66], // 14 TRAINER 2 row
    [66, 2, 2, 2, 2, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2,66], // 15 dense grass
    [66, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2,66], // 16 dense grass
    [66,66,66,66,66,66,66,66,66, 0, 0,66,66,66,66,66,66,66,66,66], // 17 bottom border
  ],
  warps:[
    { x:9,  y:0,  targetMap:'SHELLCREEK_CITY', targetX:2, targetY:10 },
    { x:10, y:0,  targetMap:'SHELLCREEK_CITY', targetX:2, targetY:10 },
    { x:9,  y:17, targetMap:'ROUTE_2B', targetX:9,  targetY:1  },
    { x:10, y:17, targetMap:'ROUTE_2B', targetX:10, targetY:1  },
  ],
  npcs:[
    { id:'R2A_TRAINER1', name:'Brett', x:5, y:7, facing:'RIGHT', spriteKey:'NPC_MAN',
      movementType:'STATIONARY', dialogue:['GRUNT_1'], trainerRef:'HIKER_BRETT' },
    { id:'R2A_TRAINER2', name:'Stone', x:14, y:14, facing:'LEFT', spriteKey:'NPC_MAN',
      movementType:'STATIONARY', dialogue:['GRUNT_1'], trainerRef:'HIKER_STONE' },
    { id:'R2A_TIP1', name:'Fossil Hunter', x:3, y:13, facing:'RIGHT', spriteKey:'NPC_MAN',
      movementType:'WANDER', dialogue:["I found a Boneback fossil near these rocks!", "Rock-type DinoMons like Boneback are tough — bring Water or Grass moves to deal with them."], onInteract:null },
    { id:'R2A_TIP2', name:'Youngster', x:16, y:8, facing:'LEFT', spriteKey:'NPC_KID',
      movementType:'STATIONARY', dialogue:["Sandclaw burrow under the sandy ground!", "They evolve into Desertfang — a total powerhouse in the desert!"], onInteract:null },
  ],
  encounterTable:{ grass:[
    { speciesId:'SANDCLAW',  minLv:10, maxLv:13, rate:30 },
    { speciesId:'QUAKELING', minLv:11, maxLv:14, rate:25 },
    { speciesId:'BONEBACK',  minLv:10, maxLv:13, rate:25 },
    { speciesId:'DIGCLAW',   minLv:10, maxLv:12, rate:20 },
  ], water:[]},
  events:[],
},

ROUTE_2B: {
  id:'ROUTE_2B', name:'Route 2 — Area 2', width:20, height:18,
  music:'ROUTE_ROCKY', isIndoor:false, isCave:false,
  tiles: [
    [66,66,66,66,66,66,66,66,66, 0, 0,66,66,66,66,66,66,66,66,66], // 0 top border
    [66, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,66], // 1 arrival
    [66, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2,66], // 2 grass sides
    [66, 2, 2, 2, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2,66], // 3 denser grass
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 4 CHOKE 1
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 5 CHOKE 1
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 6 CHOKE 1
    [66, 2, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 2,66], // 7 TRAINER 1 row
    [66, 2, 1, 1, 1,69, 1, 1, 1, 0, 0, 1, 1, 1,69, 1, 1, 1, 2,66], // 8 rocks
    [66, 2, 2, 2, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2,66], // 9 grass
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 10 CHOKE 2
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 11 CHOKE 2
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 12 CHOKE 2
    [66, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2,66], // 13 open
    [66, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,66], // 14 TRAINER 2 row
    [66, 2, 2, 2, 2, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2,66], // 15 dense grass
    [66, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2,66], // 16 dense grass
    [66,66,66,66,66,66,66,66,66, 0, 0,66,66,66,66,66,66,66,66,66], // 17 bottom border
  ],
  warps:[
    { x:9,  y:0,  targetMap:'ROUTE_2A', targetX:9,  targetY:16 },
    { x:10, y:0,  targetMap:'ROUTE_2A', targetX:10, targetY:16 },
    { x:9,  y:17, targetMap:'DUSTWALL_TOWN', targetX:9,  targetY:1  },
    { x:10, y:17, targetMap:'DUSTWALL_TOWN', targetX:10, targetY:1  },
  ],
  npcs:[
    { id:'R2B_TRAINER1', name:'Brett', x:5, y:7, facing:'RIGHT', spriteKey:'NPC_MAN',
      movementType:'STATIONARY', dialogue:['GRUNT_1'], trainerRef:'HIKER_BRETT' },
    { id:'R2B_TRAINER2', name:'Stone', x:14, y:14, facing:'LEFT', spriteKey:'NPC_MAN',
      movementType:'STATIONARY', dialogue:['GRUNT_1'], trainerRef:'HIKER_STONE' },
    { id:'R2B_TIP1', name:'Worried Hiker', x:16, y:7, facing:'DOWN', spriteKey:'NPC_MAN',
      movementType:'STATIONARY', dialogue:["I've seen people in black uniforms near Dustwall...", "They call themselves Team Extinction. Be careful on this route."], onInteract:null },
    { id:'R2B_TIP2', name:'Geologist', x:3, y:13, facing:'RIGHT', spriteKey:'NPC_WOMAN',
      movementType:'WANDER', dialogue:["Digclaw can teach you Cut once they learn it!", "Ground-type DinoMons are immune to Electric moves — useful to know!"], onInteract:null },
  ],
  encounterTable:{ grass:[
    { speciesId:'SANDCLAW',  minLv:10, maxLv:13, rate:30 },
    { speciesId:'QUAKELING', minLv:11, maxLv:14, rate:25 },
    { speciesId:'BONEBACK',  minLv:10, maxLv:13, rate:25 },
    { speciesId:'DIGCLAW',   minLv:10, maxLv:12, rate:20 },
  ], water:[]},
  events:[],
},

// ── Route 3 — two bladen (each 20 rows, desert/mountain) ─────
ROUTE_3A: {
  id:'ROUTE_3A', name:'Route 3 — Sand Wastes 1', width:20, height:20,
  music:'ROUTE_DESERT', isIndoor:false, isCave:false,
  tiles: [
    [66,66,66,66,66,66,66,66,66, 4, 4,66,66,66,66,66,66,66,66,66], // 0 top border
    [66, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,66], // 1 arrival
    [66, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 2, 2, 2,66], // 2 sand+grass sides
    [66, 2, 2, 4, 4, 4,69, 4, 4, 4, 4, 4,69, 4, 4, 4, 2, 2, 2,66], // 3 rocks
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 4 CHOKE 1
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 5 CHOKE 1
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 6 CHOKE 1
    [66, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,66], // 7 TRAINER 1 row
    [66, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 2,66], // 8 open+grass edge
    [66, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 2, 2, 4,66], // 9 grass sides
    // Boss Commander Triassic patrols this area (x:10,y:10)
    [66, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,66], // 10 boss row
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 11 CHOKE 2
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 12 CHOKE 2
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 13 CHOKE 2
    [66, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,66], // 14 open
    [66, 4, 4, 4, 4,67, 4, 4, 4, 4, 4, 4, 4, 4, 4,67, 4, 4, 4,66], // 15 signs
    [66, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,66], // 16 TRAINER 2 row
    [66, 2, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 2, 2, 2, 2,66], // 17 dense grass
    [66, 2, 2, 2, 2, 2, 2, 2, 4, 4, 4, 4, 2, 2, 2, 2, 2, 2, 2,66], // 18 dense grass
    [66,66,66,66,66,66,66,66,66, 4, 4,66,66,66,66,66,66,66,66,66], // 19 bottom border
  ],
  warps:[
    { x:9,  y:0,  targetMap:'DUSTWALL_TOWN', targetX:9,  targetY:13 },
    { x:10, y:0,  targetMap:'DUSTWALL_TOWN', targetX:10, targetY:13 },
    { x:9,  y:19, targetMap:'ROUTE_3B', targetX:9,  targetY:1  },
    { x:10, y:19, targetMap:'ROUTE_3B', targetX:10, targetY:1  },
  ],
  npcs:[
    { id:'R3A_TRAINER1', name:'Blaze', x:5, y:7, facing:'RIGHT', spriteKey:'NPC_MAN',
      movementType:'STATIONARY', dialogue:['GRUNT_2'], trainerRef:'FIREBREATHER_BLAZE' },
    { id:'R3A_BOSS1', name:'Commander Triassic', x:10, y:10, facing:'DOWN', spriteKey:'NPC_GRUNT',
      movementType:'STATIONARY', dialogue:['CMD_TRIASSIC_1'],
      trainerRef:'CMD_TRIASSIC_1', flagToHide:'TRAINER_CMD_TRIASSIC_1_DEFEATED' },
    { id:'R3A_TRAINER2', name:'Thorn', x:14, y:16, facing:'LEFT', spriteKey:'NPC_MAN',
      movementType:'STATIONARY', dialogue:['GRUNT_2'], trainerRef:'HIKER_THORN' },
    { id:'FLINT_R3A', name:'Flint', x:9, y:10, facing:'DOWN', spriteKey:'NPC_RIVAL',
      movementType:'STATIONARY', dialogue:['RIVAL_PRE_2'], onInteract:'TRIGGER_RIVAL',
      trainerRef:'RIVAL_2_FIRE', requiresFlag:'BADGE_2', flagToHide:'RIVAL_BATTLE_2_DONE' },
    { id:'R3A_TIP1', name:'Desert Researcher', x:3, y:2, facing:'DOWN', spriteKey:'NPC_WOMAN',
      movementType:'WANDER', dialogue:["The desert heat draws Fire-types like Embrix!", "Water moves are super effective against Fire — stock up on Water-type DinoMons for Pyreside Gym!"], onInteract:null },
    { id:'R3A_TIP2', name:'Traveler', x:17, y:17, facing:'LEFT', spriteKey:'NPC_MAN',
      movementType:'STATIONARY', dialogue:["Heard Team Extinction is digging near Pyreside...", "Whatever they're after in the volcano is nothing good. Be on guard."], onInteract:null },
  ],
  encounterTable:{ grass:[
    { speciesId:'EMBRIX',    minLv:18, maxLv:24, rate:30 },
    { speciesId:'BONEBACK',  minLv:18, maxLv:21, rate:25 },
    { speciesId:'QUAKELING', minLv:18, maxLv:22, rate:25 },
    { speciesId:'VIPERFANG', minLv:17, maxLv:23, rate:20 },
  ], water:[]},
  events:[],
},

ROUTE_3B: {
  id:'ROUTE_3B', name:'Route 3 — Sand Wastes 2', width:20, height:20,
  music:'ROUTE_DESERT', isIndoor:false, isCave:false,
  tiles: [
    [66,66,66,66,66,66,66,66,66, 4, 4,66,66,66,66,66,66,66,66,66], // 0 top border
    [66, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,66], // 1 arrival
    [66, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 2, 2, 2,66], // 2 grass sides
    [66, 2, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 2, 2, 2, 2, 4,66], // 3 more grass
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 4 CHOKE 1
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 5 CHOKE 1
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 6 CHOKE 1
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 7 CHOKE 1 (4 rows)
    [66, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,66], // 8 TRAINER 1 row
    [66, 2, 4, 4, 4,69, 4, 4, 4, 4, 4, 4, 4,69, 4, 4, 4, 4, 2,66], // 9 rocks
    [66, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 2, 2, 4,66], // 10 grass
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 11 CHOKE 2
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 12 CHOKE 2
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 13 CHOKE 2
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 14 CHOKE 2 (4 rows)
    [66, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,66], // 15 open
    [66, 4, 4, 4, 4,67, 4, 4, 4, 4, 4, 4, 4, 4, 4,67, 4, 4, 4,66], // 16 TRAINER 2 row
    [66, 2, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 2, 2, 2, 4,66], // 17 dense grass
    [66, 2, 2, 2, 2, 2, 2, 2, 4, 4, 4, 4, 2, 2, 2, 2, 2, 2, 2,66], // 18 dense grass
    [66,66,66,66,66,66,66,66,66, 4, 4,66,66,66,66,66,66,66,66,66], // 19 bottom border
  ],
  warps:[
    { x:9,  y:0,  targetMap:'ROUTE_3A', targetX:9,  targetY:18 },
    { x:10, y:0,  targetMap:'ROUTE_3A', targetX:10, targetY:18 },
    { x:9,  y:19, targetMap:'PYRESIDE_CITY', targetX:9,  targetY:1  },
    { x:10, y:19, targetMap:'PYRESIDE_CITY', targetX:10, targetY:1  },
  ],
  npcs:[
    { id:'R3B_TRAINER1', name:'Blaze', x:5, y:8, facing:'RIGHT', spriteKey:'NPC_MAN',
      movementType:'STATIONARY', dialogue:['GRUNT_2'], trainerRef:'FIREBREATHER_BLAZE' },
    { id:'R3B_TRAINER2', name:'Thorn', x:14, y:16, facing:'LEFT', spriteKey:'NPC_MAN',
      movementType:'STATIONARY', dialogue:['GRUNT_2'], trainerRef:'HIKER_THORN' },
    { id:'R3B_TIP1', name:'Pyro Expert', x:3, y:1, facing:'DOWN', spriteKey:'NPC_MAN',
      movementType:'STATIONARY', dialogue:["Pyreside's gym leader Ignis specialises in Fire types!", "Make sure you have Water or Ground moves — Rock also works against Fire!"], onInteract:null },
    { id:'R3B_TIP2', name:'Hiker', x:16, y:18, facing:'LEFT', spriteKey:'NPC_MAN',
      movementType:'WANDER', dialogue:["Viperfang is rare out here but worth catching — it evolves into Miasmark!", "Poison types can be tricky, but they're great at inflicting status effects."], onInteract:null },
  ],
  encounterTable:{ grass:[
    { speciesId:'EMBRIX',    minLv:18, maxLv:24, rate:30 },
    { speciesId:'BONEBACK',  minLv:18, maxLv:21, rate:25 },
    { speciesId:'QUAKELING', minLv:18, maxLv:22, rate:25 },
    { speciesId:'VIPERFANG', minLv:17, maxLv:23, rate:20 },
  ], water:[]},
  events:[],
},

// ── Route 4 — three bladen (each 22 rows, forest/tree) ───────
ROUTE_4A: {
  id:'ROUTE_4A', name:'Route 4 — Fernwood 1', width:20, height:22,
  music:'ROUTE_FOREST', isIndoor:false, isCave:false,
  tiles: [
    [64,64,64,64,64,64,64,64,64, 0, 0,64,64,64,64,64,64,64,64,64], // 0 top border
    [64, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,64], // 1 arrival
    [64, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2,64], // 2 grass sides
    [64, 2, 2, 2, 1, 1, 9, 1, 1, 0, 0, 1, 1, 9, 1, 2, 2, 2, 2,64], // 3 flowers+grass
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 4 CHOKE 1
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 5 CHOKE 1
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 6 CHOKE 1
    [64, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2,64], // 7 TRAINER 1 row
    [64, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,64], // 8 open
    [64, 2, 1, 1, 9, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 9, 1, 1, 2,64], // 9 flower+grass
    [64, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2,64], // 10 grass
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 11 CHOKE 2
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 12 CHOKE 2
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 13 CHOKE 2
    [64, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2,64], // 14 open
    [64, 1, 1, 1, 1,67, 1, 1, 1, 0, 0, 1, 1, 1, 1,67, 1, 1, 1,64], // 15 sign
    [64, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,64], // 16 TRAINER 2 row
    [64, 2, 2, 2, 2, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2,64], // 17 dense grass
    [64, 2, 2, 2, 2, 2, 1, 1, 1, 0, 0, 1, 1, 1, 2, 2, 2, 2, 2,64], // 18 dense grass
    [64, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2,64], // 19 max grass
    [64, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2,64], // 20 max grass
    [64,64,64,64,64,64,64,64,64, 0, 0,64,64,64,64,64,64,64,64,64], // 21 bottom border
  ],
  warps:[
    { x:9,  y:0,  targetMap:'PYRESIDE_CITY', targetX:9,  targetY:13 },
    { x:10, y:0,  targetMap:'PYRESIDE_CITY', targetX:10, targetY:13 },
    { x:9,  y:21, targetMap:'ROUTE_4B', targetX:9,  targetY:1  },
    { x:10, y:21, targetMap:'ROUTE_4B', targetX:10, targetY:1  },
  ],
  npcs:[
    { id:'R4A_TRAINER1', name:'Sylvan', x:5, y:7, facing:'RIGHT', spriteKey:'NPC_MAN',
      movementType:'STATIONARY', dialogue:['GRUNT_2'], trainerRef:'RANGER_SYLVAN' },
    { id:'R4A_TRAINER2', name:'Ivy', x:14, y:16, facing:'LEFT', spriteKey:'NPC_WOMAN',
      movementType:'STATIONARY', dialogue:['GRUNT_2'], trainerRef:'CAMPER_IVY' },
  ],
  encounterTable:{ grass:[
    { speciesId:'FRONDLET',  minLv:24, maxLv:27, rate:40 },
    { speciesId:'BUGLING',   minLv:23, maxLv:26, rate:25 },
    { speciesId:'SOARWING',  minLv:24, maxLv:27, rate:20 },
    { speciesId:'FAIRYWING', minLv:23, maxLv:26, rate:15 },
  ], water:[]},
  events:[],
},

ROUTE_4B: {
  id:'ROUTE_4B', name:'Route 4 — Fernwood 2', width:20, height:22,
  music:'ROUTE_FOREST', isIndoor:false, isCave:false,
  tiles: [
    [64,64,64,64,64,64,64,64,64, 0, 0,64,64,64,64,64,64,64,64,64], // 0 top border
    [64, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,64], // 1 arrival
    [64, 2, 2, 1, 1, 9, 1, 1, 1, 0, 0, 1, 1, 1, 9, 1, 2, 2, 2,64], // 2 flower+grass
    [64, 2, 2, 2, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2,64], // 3 more grass
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 4 CHOKE 1
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 5 CHOKE 1
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 6 CHOKE 1
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 7 CHOKE 1 (4 rows)
    [64, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,64], // 8 TRAINER 1 row
    [64, 2, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 2,64], // 9 grass edge
    [64, 2, 2, 1, 9, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 9, 2, 2, 2,64], // 10 flowers
    [64, 2, 2, 2, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2,64], // 11 more grass
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 12 CHOKE 2
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 13 CHOKE 2
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 14 CHOKE 2
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 15 CHOKE 2 (4 rows)
    [64, 2, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 2,64], // 16 TRAINER 2 row
    [64, 2, 2, 2, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2,64], // 17 dense
    [64, 2, 2, 2, 2, 1, 1, 1, 1, 0, 0, 1, 1, 1, 2, 2, 2, 2, 2,64], // 18 denser
    [64, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2,64], // 19 max grass
    [64, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2,64], // 20 max grass
    [64,64,64,64,64,64,64,64,64, 0, 0,64,64,64,64,64,64,64,64,64], // 21 bottom border
  ],
  warps:[
    { x:9,  y:0,  targetMap:'ROUTE_4A', targetX:9,  targetY:20 },
    { x:10, y:0,  targetMap:'ROUTE_4A', targetX:10, targetY:20 },
    { x:9,  y:21, targetMap:'ROUTE_4C', targetX:9,  targetY:1  },
    { x:10, y:21, targetMap:'ROUTE_4C', targetX:10, targetY:1  },
  ],
  npcs:[
    { id:'R4B_TRAINER1', name:'Sylvan', x:5, y:8, facing:'RIGHT', spriteKey:'NPC_MAN',
      movementType:'STATIONARY', dialogue:['GRUNT_2'], trainerRef:'RANGER_SYLVAN' },
    { id:'R4B_TRAINER2', name:'Ivy', x:14, y:16, facing:'LEFT', spriteKey:'NPC_WOMAN',
      movementType:'STATIONARY', dialogue:['GRUNT_2'], trainerRef:'CAMPER_IVY' },
    { id:'R4B_TIP1', name:'Nature Guide', x:16, y:9, facing:'LEFT', spriteKey:'NPC_WOMAN',
      movementType:'WANDER', dialogue:["Frondlet and its evolutions are the stars of this forest!", "Fire is their weakness — but they can learn Vine Whip and Leaf Blade which shred Water types!"], onInteract:null },
    { id:'R4B_TIP2', name:'Bug Catcher', x:3, y:17, facing:'RIGHT', spriteKey:'NPC_KID',
      movementType:'STATIONARY', dialogue:["Bugling evolves into Bugclaw and then Insectadon!", "Bug types are weak to Fire and Flying, but they can deal with Psychic types easily!"], onInteract:null },
  ],
  encounterTable:{ grass:[
    { speciesId:'FRONDLET',  minLv:24, maxLv:27, rate:40 },
    { speciesId:'BUGLING',   minLv:23, maxLv:26, rate:25 },
    { speciesId:'SOARWING',  minLv:24, maxLv:27, rate:20 },
    { speciesId:'FAIRYWING', minLv:23, maxLv:26, rate:15 },
  ], water:[]},
  events:[],
},

ROUTE_4C: {
  id:'ROUTE_4C', name:'Route 4 — Fernwood 3', width:20, height:22,
  music:'ROUTE_FOREST', isIndoor:false, isCave:false,
  tiles: [
    [64,64,64,64,64,64,64,64,64, 0, 0,64,64,64,64,64,64,64,64,64], // 0 top border
    [64, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,64], // 1 arrival
    [64, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2,64], // 2 grass
    [64, 2, 2, 2, 1, 9, 1, 1, 1, 0, 0, 1, 1, 1, 9, 2, 2, 2, 2,64], // 3 flower
    [64, 2, 2, 2, 2, 1, 1, 1, 1, 0, 0, 1, 1, 1, 2, 2, 2, 2, 2,64], // 4 dense
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 5 CHOKE 1
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 6 CHOKE 1
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 7 CHOKE 1
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 8 CHOKE 1 (4 rows)
    [64, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,64], // 9 TRAINER 1 row
    [64, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2,64], // 10 grass
    [64, 2, 2, 2, 1, 9, 1, 1, 1, 0, 0, 1, 1, 1, 9, 2, 2, 2, 2,64], // 11 flowers
    [64, 2, 2, 2, 2, 1, 1, 1, 1, 0, 0, 1, 1, 1, 2, 2, 2, 2, 2,64], // 12 dense
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 13 CHOKE 2
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 14 CHOKE 2
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 15 CHOKE 2
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 16 CHOKE 2 (4 rows)
    [64, 1, 1, 1, 1,67, 1, 1, 1, 0, 0, 1, 1, 1, 1,67, 1, 1, 1,64], // 17 TRAINER 2 row
    [64, 2, 2, 2, 2, 2, 1, 1, 1, 0, 0, 1, 1, 1, 2, 2, 2, 2, 2,64], // 18 dense
    [64, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2,64], // 19 max
    [64, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2,64], // 20 max
    [64,64,64,64,64,64,64,64,64, 0, 0,64,64,64,64,64,64,64,64,64], // 21 bottom border
  ],
  warps:[
    { x:9,  y:0,  targetMap:'ROUTE_4B', targetX:9,  targetY:20 },
    { x:10, y:0,  targetMap:'ROUTE_4B', targetX:10, targetY:20 },
    { x:9,  y:21, targetMap:'FERNGROVE_TOWN', targetX:7, targetY:7 },
    { x:10, y:21, targetMap:'FERNGROVE_TOWN', targetX:7, targetY:7 },
  ],
  npcs:[
    { id:'R4C_TRAINER1', name:'Sylvan', x:5, y:9, facing:'RIGHT', spriteKey:'NPC_MAN',
      movementType:'STATIONARY', dialogue:['GRUNT_2'], trainerRef:'RANGER_SYLVAN' },
    { id:'R4C_TRAINER2', name:'Ivy', x:14, y:17, facing:'LEFT', spriteKey:'NPC_WOMAN',
      movementType:'STATIONARY', dialogue:['GRUNT_2'], trainerRef:'CAMPER_IVY' },
  ],
  encounterTable:{ grass:[
    { speciesId:'FRONDLET',  minLv:24, maxLv:27, rate:40 },
    { speciesId:'BUGLING',   minLv:23, maxLv:26, rate:25 },
    { speciesId:'SOARWING',  minLv:24, maxLv:27, rate:20 },
    { speciesId:'FAIRYWING', minLv:23, maxLv:26, rate:15 },
  ], water:[]},
  events:[],
},

// ── Route 5 — three bladen (each 25 rows, plains/tree) ───────
ROUTE_5A: {
  id:'ROUTE_5A', name:'Route 5 — Plains 1', width:20, height:25,
  music:'ROUTE_PLAINS', isIndoor:false, isCave:false,
  tiles: [
    [64,64,64,64,64,64,64,64,64, 0, 0,64,64,64,64,64,64,64,64,64], // 0 top border
    [64, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,64], // 1 arrival
    [64, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2,64], // 2 grass
    [64, 2, 2, 2, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2,64], // 3 more grass
    [64, 2, 2, 2, 2, 1, 1, 1, 1, 0, 0, 1, 1, 1, 2, 2, 2, 2, 2,64], // 4 dense
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 5 CHOKE 1
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 6 CHOKE 1
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 7 CHOKE 1
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 8 CHOKE 1 (4 rows)
    [64, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,64], // 9 TRAINER 1 row
    [64, 2, 1, 1, 1,69, 1, 1, 1, 0, 0, 1, 1, 1,69, 1, 1, 1, 2,64], // 10 rocks
    [64, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2,64], // 11 grass
    [64, 2, 2, 2, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2,64], // 12 more grass
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 13 CHOKE 2
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 14 CHOKE 2
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 15 CHOKE 2
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 16 CHOKE 2 (4 rows)
    [64, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2,64], // 17 open
    [64, 1, 1, 1, 1,67, 1, 1, 1, 0, 0, 1, 1, 1, 1,67, 1, 1, 1,64], // 18 sign
    [64, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,64], // 19 TRAINER 2 row
    [64, 2, 2, 2, 2, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2,64], // 20 dense
    [64, 2, 2, 2, 2, 2, 1, 1, 1, 0, 0, 1, 1, 1, 2, 2, 2, 2, 2,64], // 21 denser
    [64, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2,64], // 22 max
    [64, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2,64], // 23 max
    [64,64,64,64,64,64,64,64,64, 0, 0,64,64,64,64,64,64,64,64,64], // 24 bottom border
  ],
  warps:[
    { x:9,  y:0,  targetMap:'STONEHAVEN_CITY', targetX:9,  targetY:13 },
    { x:10, y:0,  targetMap:'STONEHAVEN_CITY', targetX:10, targetY:13 },
    { x:9,  y:24, targetMap:'ROUTE_5B', targetX:9,  targetY:1  },
    { x:10, y:24, targetMap:'ROUTE_5B', targetX:10, targetY:1  },
  ],
  npcs:[
    { id:'R5A_TRAINER1', name:'Dusty', x:5, y:9, facing:'RIGHT', spriteKey:'NPC_MAN',
      movementType:'STATIONARY', dialogue:['GRUNT_3'], trainerRef:'HIKER_DUSTY' },
    { id:'R5A_TRAINER2', name:'Stone', x:14, y:19, facing:'LEFT', spriteKey:'NPC_MAN',
      movementType:'STATIONARY', dialogue:['GRUNT_3'], trainerRef:'ROUGHNECK_STONE' },
  ],
  encounterTable:{ grass:[
    { speciesId:'DIGCLAW',   minLv:30, maxLv:33, rate:25 },
    { speciesId:'SANDCLAW',  minLv:30, maxLv:34, rate:25 },
    { speciesId:'STEELBACK', minLv:30, maxLv:33, rate:22 },
    { speciesId:'FIGHTCLAW', minLv:30, maxLv:33, rate:20 },
    { speciesId:'SOARWING',  minLv:30, maxLv:34, rate:8  },
  ], water:[]},
  events:[],
},

ROUTE_5B: {
  id:'ROUTE_5B', name:'Route 5 — Plains 2', width:20, height:25,
  music:'ROUTE_PLAINS', isIndoor:false, isCave:false,
  tiles: [
    [64,64,64,64,64,64,64,64,64, 0, 0,64,64,64,64,64,64,64,64,64], // 0 top border
    [64, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,64], // 1 arrival
    [64, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2,64], // 2 grass
    [64, 2, 2, 2, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2,64], // 3
    [64, 2, 2, 2, 2, 1, 1, 1, 1, 0, 0, 1, 1, 1, 2, 2, 2, 2, 2,64], // 4
    [64, 2, 2, 2, 2, 2, 1, 1, 1, 0, 0, 1, 1, 2, 2, 2, 2, 2, 2,64], // 5 denser
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 6 CHOKE 1
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 7 CHOKE 1
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 8 CHOKE 1
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 9 CHOKE 1 (4 rows)
    [64, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,64], // 10 TRAINER 1 row
    [64, 2, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 2,64], // 11 grass
    [64, 2, 2, 1, 1,69, 1, 1, 1, 0, 0, 1, 1, 1,69, 2, 2, 2, 2,64], // 12 rocks
    [64, 2, 2, 2, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 2, 2, 2, 2, 2,64], // 13 grass
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 14 CHOKE 2
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 15 CHOKE 2
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 16 CHOKE 2
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 17 CHOKE 2
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 18 CHOKE 2 (5 rows)
    [64, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,64], // 19 TRAINER 2 row
    [64, 2, 2, 2, 2, 2, 1, 1, 1, 0, 0, 1, 1, 1, 2, 2, 2, 2, 2,64], // 20 dense
    [64, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2,64], // 21 max
    [64, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2,64], // 22 max
    [64, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2,64], // 23 max
    [64,64,64,64,64,64,64,64,64, 0, 0,64,64,64,64,64,64,64,64,64], // 24 bottom border
  ],
  warps:[
    { x:9,  y:0,  targetMap:'ROUTE_5A', targetX:9,  targetY:23 },
    { x:10, y:0,  targetMap:'ROUTE_5A', targetX:10, targetY:23 },
    { x:9,  y:24, targetMap:'ROUTE_5C', targetX:9,  targetY:1  },
    { x:10, y:24, targetMap:'ROUTE_5C', targetX:10, targetY:1  },
  ],
  npcs:[
    { id:'R5B_TRAINER1', name:'Dusty', x:5, y:10, facing:'RIGHT', spriteKey:'NPC_MAN',
      movementType:'STATIONARY', dialogue:['GRUNT_3'], trainerRef:'HIKER_DUSTY' },
    { id:'R5B_TRAINER2', name:'Stone', x:14, y:19, facing:'LEFT', spriteKey:'NPC_MAN',
      movementType:'STATIONARY', dialogue:['GRUNT_3'], trainerRef:'ROUGHNECK_STONE' },
    { id:'R5B_TIP1', name:'Steel Trainer', x:3, y:2, facing:'RIGHT', spriteKey:'NPC_MAN',
      movementType:'STATIONARY', dialogue:["Steelback is tough to find but worth every step!", "Steel types resist nearly everything — only Fire, Fighting and Ground break through."], onInteract:null },
    { id:'R5B_TIP2', name:'Lost Hiker', x:16, y:20, facing:'DOWN', spriteKey:'NPC_WOMAN',
      movementType:'WANDER', dialogue:["Stonehaven Gym's Drago uses Dragon types!", "Dragon moves are only resisted by Steel — and Fairy is flat-out immune!"], onInteract:null },
  ],
  encounterTable:{ grass:[
    { speciesId:'DIGCLAW',   minLv:30, maxLv:33, rate:25 },
    { speciesId:'SANDCLAW',  minLv:30, maxLv:34, rate:25 },
    { speciesId:'STEELBACK', minLv:30, maxLv:33, rate:22 },
    { speciesId:'FIGHTCLAW', minLv:30, maxLv:33, rate:20 },
    { speciesId:'SOARWING',  minLv:30, maxLv:34, rate:8  },
  ], water:[]},
  events:[],
},

ROUTE_5C: {
  id:'ROUTE_5C', name:'Route 5 — Plains 3', width:20, height:25,
  music:'ROUTE_PLAINS', isIndoor:false, isCave:false,
  tiles: [
    [64,64,64,64,64,64,64,64,64, 0, 0,64,64,64,64,64,64,64,64,64], // 0 top border
    [64, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,64], // 1 arrival
    [64, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2,64], // 2
    [64, 2, 2, 2, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2,64], // 3
    [64, 2, 2, 2, 2, 2, 1, 1, 1, 0, 0, 1, 1, 1, 2, 2, 2, 2, 2,64], // 4
    [64, 2, 2, 2, 2, 2, 2, 1, 1, 0, 0, 1, 1, 2, 2, 2, 2, 2, 2,64], // 5
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 6 CHOKE 1
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 7 CHOKE 1
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 8 CHOKE 1
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 9 CHOKE 1
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 10 CHOKE 1 (5 rows)
    [64, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,64], // 11 TRAINER 1 row
    [64, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2,64], // 12
    [64, 2, 2, 2, 1, 1,69, 1, 1, 0, 0, 1, 1,69, 2, 2, 2, 2, 2,64], // 13 rocks
    [64, 2, 2, 2, 2, 2, 2, 1, 1, 0, 0, 1, 1, 2, 2, 2, 2, 2, 2,64], // 14
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 15 CHOKE 2
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 16 CHOKE 2
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 17 CHOKE 2
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 18 CHOKE 2
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 19 CHOKE 2 (5 rows)
    [64, 1, 1, 1, 1,67, 1, 1, 1, 0, 0, 1, 1, 1, 1,67, 1, 1, 1,64], // 20 TRAINER 2 row
    [64, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2,64], // 21 max
    [64, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2,64], // 22 max
    [64, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2,64], // 23 max
    [64,64,64,64,64,64,64,64,64, 0, 0,64,64,64,64,64,64,64,64,64], // 24 bottom border
  ],
  warps:[
    { x:9,  y:0,  targetMap:'ROUTE_5B', targetX:9,  targetY:23 },
    { x:10, y:0,  targetMap:'ROUTE_5B', targetX:10, targetY:23 },
    { x:9,  y:24, targetMap:'FERNGROVE_TOWN', targetX:7, targetY:7 },
    { x:10, y:24, targetMap:'FERNGROVE_TOWN', targetX:7, targetY:7 },
  ],
  npcs:[
    { id:'R5C_TRAINER1', name:'Dusty', x:5, y:11, facing:'RIGHT', spriteKey:'NPC_MAN',
      movementType:'STATIONARY', dialogue:['GRUNT_3'], trainerRef:'HIKER_DUSTY' },
    { id:'R5C_TRAINER2', name:'Stone', x:14, y:20, facing:'LEFT', spriteKey:'NPC_MAN',
      movementType:'STATIONARY', dialogue:['GRUNT_3'], trainerRef:'ROUGHNECK_STONE' },
  ],
  encounterTable:{ grass:[
    { speciesId:'DIGCLAW',   minLv:30, maxLv:33, rate:25 },
    { speciesId:'SANDCLAW',  minLv:30, maxLv:34, rate:25 },
    { speciesId:'STEELBACK', minLv:30, maxLv:33, rate:22 },
    { speciesId:'FIGHTCLAW', minLv:30, maxLv:33, rate:20 },
    { speciesId:'SOARWING',  minLv:30, maxLv:34, rate:8  },
  ], water:[]},
  events:[],
},


// ── Route 6 — four bladen (each 28 rows, tree/mystical) ──────
ROUTE_6A: {
  id:'ROUTE_6A', name:'Route 6 — Mystic Vale 1', width:20, height:28,
  music:'ROUTE_MYSTICAL', isIndoor:false, isCave:false,
  tiles: [
    [64,64,64,64,64,64,64,64,64, 0, 0,64,64,64,64,64,64,64,64,64], // 0  top border
    [64, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,64], // 1  arrival
    [64, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2,64], // 2  grass
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 3  CHOKE
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 4  CHOKE
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 5  CHOKE
    [64, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2,64], // 6  open
    [64, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,64], // 7  TRAINER 1 (Hank x:5)
    [64, 2, 1, 1, 1,69, 1, 1, 1, 0, 0, 1, 1, 1,69, 1, 1, 1, 2,64], // 8  rocks
    [64, 3, 3, 3, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 3, 3, 3,64], // 9  water
    [64, 3, 3, 3, 3, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 3, 3, 3, 3,64], // 10 water
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 11 CHOKE
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 12 CHOKE
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 13 CHOKE
    [64, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2,64], // 14 open
    [64, 1, 1, 1, 1,67, 1, 1, 1, 0, 0, 1, 1, 1, 1,67, 1, 1, 1,64], // 15 signs
    [64, 2, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 2,64], // 16 open
    [64, 3, 3, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 3, 3, 3,64], // 17 water
    [64, 3, 3, 3, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 3, 3, 3, 3,64], // 18 water
    [64, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,64], // 19 TRAINER 2 (Rod x:14)
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 20 CHOKE
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 21 CHOKE
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 22 CHOKE
    [64, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2,64], // 23 open
    [64, 2, 2, 2, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2,64], // 24 dense grass
    [64, 2, 2, 2, 2, 2, 1, 1, 1, 0, 0, 1, 1, 1, 2, 2, 2, 2, 2,64], // 25 denser
    [64, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2,64], // 26 densest
    [64,64,64,64,64,64,64,64,64, 0, 0,64,64,64,64,64,64,64,64,64], // 27 bottom border
  ],
  warps:[
    { x:9,  y:0,  targetMap:'STONEHAVEN_CITY', targetX:1,  targetY:10 },
    { x:10, y:0,  targetMap:'STONEHAVEN_CITY', targetX:1,  targetY:10 },
    { x:9,  y:27, targetMap:'ROUTE_6B',        targetX:9,  targetY:1  },
    { x:10, y:27, targetMap:'ROUTE_6B',        targetX:10, targetY:1  },
  ],
  npcs:[
    { id:'R6A_TRAINER1', name:'Hank', x:5, y:7, facing:'RIGHT', spriteKey:'NPC_MAN',
      movementType:'STATIONARY', dialogue:['GRUNT_3'], trainerRef:'ELECTRICIAN_SPARK' },
    { id:'R6A_TRAINER2', name:'Rod', x:14, y:19, facing:'LEFT', spriteKey:'NPC_MAN',
      movementType:'STATIONARY', dialogue:['GRUNT_3'], trainerRef:'ROCKER_BOLT' },
    { id:'R6A_TIP1', name:'Lightning Fan', x:3, y:2, facing:'RIGHT', spriteKey:'NPC_KID',
      movementType:'WANDER', dialogue:["Sparkhorn crackles with electricity in the tall grass here!", "Electric moves don't work on Ground types — watch out for that!"], onInteract:null },
    { id:'R6A_TIP2', name:'Mystic Traveler', x:16, y:25, facing:'LEFT', spriteKey:'NPC_WOMAN',
      movementType:'STATIONARY', dialogue:["The route splits near Stonehaven — west leads to Crestfall Gym!", "East path winds down to the Bogmire swamps. Both are treacherous."], onInteract:null },
  ],
  encounterTable:{ grass:[
    { speciesId:'SPARKHORN', minLv:36, maxLv:40, rate:30 },
    { speciesId:'STORMWING', minLv:36, maxLv:40, rate:25 },
    { speciesId:'SOARWING',  minLv:36, maxLv:40, rate:25 },
    { speciesId:'SHADOWLET', minLv:35, maxLv:39, rate:20 },
  ], water:[]},
  events:[],
},

ROUTE_6B: {
  id:'ROUTE_6B', name:'Route 6 — Mystic Vale 2', width:20, height:28,
  music:'ROUTE_MYSTICAL', isIndoor:false, isCave:false,
  tiles: [
    [64,64,64,64,64,64,64,64,64, 0, 0,64,64,64,64,64,64,64,64,64], // 0  top border
    [64, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,64], // 1  arrival
    [64, 2, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 2,64], // 2  grass
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 3  CHOKE
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 4  CHOKE
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 5  CHOKE
    [64, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2,64], // 6  open
    [64, 3, 3, 3, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 3, 3, 3,64], // 7  water
    [64, 3, 3, 3, 3, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 3, 3, 3, 3,64], // 8  water
    [64, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,64], // 9  TRAINER 1 (Rod x:5)
    [64, 2, 1, 1, 1,69, 1, 1, 1, 0, 0, 1, 1, 1,69, 1, 1, 1, 2,64], // 10 rocks
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 11 CHOKE
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 12 CHOKE
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 13 CHOKE
    [64, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2,64], // 14 open
    [64, 3, 3, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 3, 3, 3,64], // 15 water
    [64, 3, 3, 3, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 3, 3, 3, 3,64], // 16 water
    [64, 2, 1, 1, 1,67, 1, 1, 1, 0, 0, 1, 1, 1, 1,67, 1, 1, 2,64], // 17 signs
    [64, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2,64], // 18 open
    [64, 2, 2, 2, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2,64], // 19 dense grass
    [64, 2, 2, 2, 2, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2,64], // 20 denser
    [64, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,64], // 21 TRAINER 2 (Kira x:14)
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 22 CHOKE
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 23 CHOKE
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 24 CHOKE
    [64, 2, 2, 2, 2, 2, 1, 1, 1, 0, 0, 1, 1, 1, 2, 2, 2, 2, 2,64], // 25 dense
    [64, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2,64], // 26 densest
    [64,64,64,64,64,64,64,64,64, 0, 0,64,64,64,64,64,64,64,64,64], // 27 bottom border
  ],
  warps:[
    { x:9,  y:0,  targetMap:'ROUTE_6A', targetX:9,  targetY:26 },
    { x:10, y:0,  targetMap:'ROUTE_6A', targetX:10, targetY:26 },
    { x:9,  y:27, targetMap:'ROUTE_6C', targetX:9,  targetY:1  },
    { x:10, y:27, targetMap:'ROUTE_6C', targetX:10, targetY:1  },
  ],
  npcs:[
    { id:'R6B_TRAINER1', name:'Rod', x:5, y:9, facing:'RIGHT', spriteKey:'NPC_MAN',
      movementType:'STATIONARY', dialogue:['GRUNT_3'], trainerRef:'ROCKER_BOLT' },
    { id:'R6B_TRAINER2', name:'Kira', x:14, y:21, facing:'LEFT', spriteKey:'NPC_WOMAN',
      movementType:'STATIONARY', dialogue:['GRUNT_3'], trainerRef:'ROCKER_BOLT' },
  ],
  encounterTable:{ grass:[
    { speciesId:'SPARKHORN', minLv:37, maxLv:41, rate:30 },
    { speciesId:'STORMWING', minLv:37, maxLv:41, rate:25 },
    { speciesId:'SOARWING',  minLv:37, maxLv:41, rate:25 },
    { speciesId:'SHADOWLET', minLv:36, maxLv:40, rate:20 },
  ], water:[]},
  events:[],
},

ROUTE_6C: {
  id:'ROUTE_6C', name:'Route 6 — Mystic Vale 3', width:20, height:28,
  music:'ROUTE_MYSTICAL', isIndoor:false, isCave:false,
  tiles: [
    [64,64,64,64,64,64,64,64,64, 0, 0,64,64,64,64,64,64,64,64,64], // 0  top border
    [64, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,64], // 1  arrival
    [64, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2,64], // 2  grass
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 3  CHOKE
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 4  CHOKE
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 5  CHOKE
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 6  CHOKE (4-row)
    [64, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2,64], // 7  open
    [64, 3, 3, 3, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 3, 3, 3,64], // 8  water
    [64, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,64], // 9  TRAINER 1 (Kira x:5)
    [64, 2, 1, 1, 1,69, 1, 1, 1, 0, 0, 1, 1, 1,69, 1, 1, 1, 2,64], // 10 rocks
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 11 CHOKE
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 12 CHOKE
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 13 CHOKE
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 14 CHOKE (4-row)
    [64, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2,64], // 15 open
    [64, 3, 3, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 3, 3, 3,64], // 16 water
    [64, 2, 1, 1, 1,67, 1, 1, 1, 0, 0, 1, 1, 1, 1,67, 1, 1, 2,64], // 17 signs
    [64, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2,64], // 18 open
    [64, 2, 2, 2, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2,64], // 19 dense
    [64, 2, 2, 2, 2, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2,64], // 20 denser
    [64, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,64], // 21 TRAINER 2 (Hank x:14)
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 22 CHOKE
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 23 CHOKE
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 24 CHOKE
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 25 CHOKE (4-row)
    [64, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2,64], // 26 densest
    [64,64,64,64,64,64,64,64,64, 0, 0,64,64,64,64,64,64,64,64,64], // 27 bottom border
  ],
  warps:[
    { x:9,  y:0,  targetMap:'ROUTE_6B', targetX:9,  targetY:26 },
    { x:10, y:0,  targetMap:'ROUTE_6B', targetX:10, targetY:26 },
    { x:9,  y:27, targetMap:'ROUTE_6D', targetX:9,  targetY:1  },
    { x:10, y:27, targetMap:'ROUTE_6D', targetX:10, targetY:1  },
  ],
  npcs:[
    { id:'R6C_TRAINER1', name:'Kira', x:5, y:9, facing:'RIGHT', spriteKey:'NPC_WOMAN',
      movementType:'STATIONARY', dialogue:['GRUNT_4'], trainerRef:'ROCKER_BOLT' },
    { id:'R6C_TRAINER2', name:'Hank', x:14, y:21, facing:'LEFT', spriteKey:'NPC_MAN',
      movementType:'STATIONARY', dialogue:['GRUNT_4'], trainerRef:'ELECTRICIAN_SPARK' },
  ],
  encounterTable:{ grass:[
    { speciesId:'SPARKHORN', minLv:38, maxLv:42, rate:30 },
    { speciesId:'STORMWING', minLv:38, maxLv:42, rate:25 },
    { speciesId:'SOARWING',  minLv:38, maxLv:42, rate:25 },
    { speciesId:'SHADOWLET', minLv:37, maxLv:41, rate:20 },
  ], water:[]},
  events:[],
},

ROUTE_6D: {
  id:'ROUTE_6D', name:'Route 6 — Mystic Vale 4', width:20, height:28,
  music:'ROUTE_MYSTICAL', isIndoor:false, isCave:false,
  tiles: [
    [64,64,64,64,64,64,64,64,64, 0, 0,64,64,64,64,64,64,64,64,64], // 0  top border
    [64, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,64], // 1  arrival
    [64, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2,64], // 2  grass
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 3  CHOKE
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 4  CHOKE
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 5  CHOKE
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 6  CHOKE (4-row)
    [64, 3, 3, 3, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 3, 3, 3,64], // 7  water
    [64, 3, 3, 3, 3, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 3, 3, 3, 3,64], // 8  water
    [64, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,64], // 9  TRAINER 1 (Hank x:5)
    [64, 2, 1, 1, 1,69, 1, 1, 1, 0, 0, 1, 1, 1,69, 1, 1, 1, 2,64], // 10 rocks
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 11 CHOKE
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 12 CHOKE
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 13 CHOKE
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 14 CHOKE (4-row)
    [64, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2,64], // 15 open
    [64, 2, 2, 2, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2,64], // 16 dense
    [64, 3, 3, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 3, 3, 3,64], // 17 water
    [64, 3, 3, 3, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 3, 3, 3, 3,64], // 18 water
    [64, 2, 1, 1, 1,67, 1, 1, 1, 0, 0, 1, 1, 1, 1,67, 1, 1, 2,64], // 19 signs
    [64, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2,64], // 20 open
    [64, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,64], // 21 TRAINER 2 (Rod x:14)
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 22 CHOKE
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 23 CHOKE
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 24 CHOKE
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 25 CHOKE (4-row)
    [64, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2,64], // 26 densest
    [64,64,64,64,64,64,64,64,64, 0, 0,64,64,64,64,64,64,64,64,64], // 27 bottom border
  ],
  warps:[
    { x:9,  y:0,  targetMap:'ROUTE_6C',       targetX:9,  targetY:26 },
    { x:10, y:0,  targetMap:'ROUTE_6C',       targetX:10, targetY:26 },
    { x:9,  y:27, targetMap:'CRESTFALL_TOWN', targetX:7,  targetY:7  },
    { x:10, y:27, targetMap:'CRESTFALL_TOWN', targetX:7,  targetY:7  },
  ],
  npcs:[
    { id:'R6D_TRAINER1', name:'Hank', x:5, y:9, facing:'RIGHT', spriteKey:'NPC_MAN',
      movementType:'STATIONARY', dialogue:['GRUNT_4'], trainerRef:'ELECTRICIAN_SPARK' },
    { id:'R6D_TRAINER2', name:'Rod', x:14, y:21, facing:'LEFT', spriteKey:'NPC_MAN',
      movementType:'STATIONARY', dialogue:['GRUNT_4'], trainerRef:'ROCKER_BOLT' },
  ],
  encounterTable:{ grass:[
    { speciesId:'SPARKHORN', minLv:39, maxLv:43, rate:30 },
    { speciesId:'STORMWING', minLv:39, maxLv:43, rate:25 },
    { speciesId:'SOARWING',  minLv:39, maxLv:43, rate:25 },
    { speciesId:'SHADOWLET', minLv:38, maxLv:42, rate:20 },
  ], water:[]},
  events:[],
},

// ── Route 7 — four bladen (each 28 rows, mountain/cliffs) ────
ROUTE_7A: {
  id:'ROUTE_7A', name:'Route 7 — Eastern Cliffs 1', width:20, height:28,
  music:'ROUTE_ROCKY', isIndoor:false, isCave:false,
  tiles: [
    [66,66,66,66,66,66,66,66,66, 0, 0,66,66,66,66,66,66,66,66,66], // 0  top border
    [66, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,66], // 1  arrival
    [66, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2,66], // 2  grass
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 3  CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 4  CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 5  CHOKE
    [66, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2,66], // 6  open
    [66, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,66], // 7  TRAINER 1 (Gram x:5)
    [66, 2, 1, 1, 1,69, 1, 1, 1, 0, 0, 1, 1, 1,69, 1, 1, 1, 2,66], // 8  rocks
    [66, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2,66], // 9  open
    [66, 2, 2, 2, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2,66], // 10 dense
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 11 CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 12 CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 13 CHOKE
    [66, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2,66], // 14 open
    [66, 1, 1, 1, 1,67, 1, 1, 1, 0, 0, 1, 1, 1, 1,67, 1, 1, 1,66], // 15 signs
    [66, 2, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 2,66], // 16 open
    [66, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2,66], // 17 grass
    [66, 2, 2, 2, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2,66], // 18 dense
    [66, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,66], // 19 TRAINER 2 (Dex x:14)
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 20 CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 21 CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 22 CHOKE
    [66, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2,66], // 23 open
    [66, 2, 2, 2, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2,66], // 24 dense
    [66, 2, 2, 2, 2, 2, 1, 1, 1, 0, 0, 1, 1, 1, 2, 2, 2, 2, 2,66], // 25 denser
    [66, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2,66], // 26 densest
    [66,66,66,66,66,66,66,66,66, 0, 0,66,66,66,66,66,66,66,66,66], // 27 bottom border
  ],
  warps:[
    { x:9,  y:0,  targetMap:'STONEHAVEN_CITY', targetX:18, targetY:10 },
    { x:10, y:0,  targetMap:'STONEHAVEN_CITY', targetX:18, targetY:10 },
    { x:9,  y:27, targetMap:'ROUTE_7B',        targetX:9,  targetY:1  },
    { x:10, y:27, targetMap:'ROUTE_7B',        targetX:10, targetY:1  },
  ],
  npcs:[
    { id:'R7A_TRAINER1', name:'Wave', x:5, y:7, facing:'RIGHT', spriteKey:'NPC_MAN',
      movementType:'STATIONARY', dialogue:['GRUNT_4'], trainerRef:'SWIMMER_WAVE' },
    { id:'R7A_TRAINER2', name:'Tide', x:14, y:19, facing:'LEFT', spriteKey:'NPC_MAN',
      movementType:'STATIONARY', dialogue:['GRUNT_4'], trainerRef:'FISHERMAN_TIDE' },
    { id:'R7A_TIP1', name:'Swamp Guide', x:3, y:2, facing:'RIGHT', spriteKey:'NPC_MAN',
      movementType:'STATIONARY', dialogue:["Mudfin and Swampjaw love these murky waters!", "Water/Ground types are tricky — Electric won't touch them, but Grass hits hard!"], onInteract:null },
    { id:'R7A_TIP2', name:'Wandering Trainer', x:16, y:25, facing:'DOWN', spriteKey:'NPC_WOMAN',
      movementType:'WANDER', dialogue:["Bogmire Gym is deep in the swamps — Morax uses Psychic types!", "Dark moves crush Psychic — and they have no effect on Dark types themselves."], onInteract:null },
  ],
  encounterTable:{ grass:[
    { speciesId:'MUDFIN',    minLv:38, maxLv:42, rate:35 },
    { speciesId:'MARSHFIN',  minLv:38, maxLv:42, rate:30 },
    { speciesId:'SWAMPJAW',  minLv:37, maxLv:41, rate:25 },
    { speciesId:'DUSKFANG',  minLv:38, maxLv:42, rate:10 },
  ], water:[]},
  events:[],
},

ROUTE_7B: {
  id:'ROUTE_7B', name:'Route 7 — Eastern Cliffs 2', width:20, height:28,
  music:'ROUTE_ROCKY', isIndoor:false, isCave:false,
  tiles: [
    [66,66,66,66,66,66,66,66,66, 0, 0,66,66,66,66,66,66,66,66,66], // 0  top border
    [66, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,66], // 1  arrival
    [66, 2, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 2,66], // 2  grass
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 3  CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 4  CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 5  CHOKE
    [66, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2,66], // 6  open
    [66, 2, 2, 2, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2,66], // 7  dense
    [66, 2, 1, 1, 1,69, 1, 1, 1, 0, 0, 1, 1, 1,69, 1, 1, 1, 2,66], // 8  rocks
    [66, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,66], // 9  TRAINER 1 (Dex x:5)
    [66, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2,66], // 10 open
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 11 CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 12 CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 13 CHOKE
    [66, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2,66], // 14 open
    [66, 2, 1, 1, 1,67, 1, 1, 1, 0, 0, 1, 1, 1, 1,67, 1, 1, 2,66], // 15 signs
    [66, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2,66], // 16 open
    [66, 2, 2, 2, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2,66], // 17 dense
    [66, 2, 2, 2, 2, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2,66], // 18 denser
    [66, 2, 1, 1, 1,69, 1, 1, 1, 0, 0, 1, 1, 1,69, 1, 1, 1, 2,66], // 19 rocks
    [66, 2, 2, 2, 2, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2,66], // 20 denser
    [66, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,66], // 21 TRAINER 2 (Veil x:14)
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 22 CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 23 CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 24 CHOKE
    [66, 2, 2, 2, 2, 2, 1, 1, 1, 0, 0, 1, 1, 1, 2, 2, 2, 2, 2,66], // 25 dense
    [66, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2,66], // 26 densest
    [66,66,66,66,66,66,66,66,66, 0, 0,66,66,66,66,66,66,66,66,66], // 27 bottom border
  ],
  warps:[
    { x:9,  y:0,  targetMap:'ROUTE_7A', targetX:9,  targetY:26 },
    { x:10, y:0,  targetMap:'ROUTE_7A', targetX:10, targetY:26 },
    { x:9,  y:27, targetMap:'ROUTE_7C', targetX:9,  targetY:1  },
    { x:10, y:27, targetMap:'ROUTE_7C', targetX:10, targetY:1  },
  ],
  npcs:[
    { id:'R7B_TRAINER1', name:'Wave', x:5, y:9, facing:'RIGHT', spriteKey:'NPC_MAN',
      movementType:'STATIONARY', dialogue:['GRUNT_4'], trainerRef:'SWIMMER_WAVE' },
    { id:'R7B_TRAINER2', name:'Tide', x:14, y:21, facing:'LEFT', spriteKey:'NPC_MAN',
      movementType:'STATIONARY', dialogue:['GRUNT_4'], trainerRef:'FISHERMAN_TIDE' },
  ],
  encounterTable:{ grass:[
    { speciesId:'MUDFIN',    minLv:39, maxLv:43, rate:35 },
    { speciesId:'MARSHFIN',  minLv:39, maxLv:43, rate:30 },
    { speciesId:'SWAMPJAW',  minLv:38, maxLv:42, rate:25 },
    { speciesId:'DUSKFANG',  minLv:39, maxLv:43, rate:10 },
  ], water:[]},
  events:[],
},

ROUTE_7C: {
  id:'ROUTE_7C', name:'Route 7 — Eastern Cliffs 3', width:20, height:28,
  music:'ROUTE_ROCKY', isIndoor:false, isCave:false,
  tiles: [
    [66,66,66,66,66,66,66,66,66, 0, 0,66,66,66,66,66,66,66,66,66], // 0  top border
    [66, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,66], // 1  arrival
    [66, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2,66], // 2  grass
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 3  CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 4  CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 5  CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 6  CHOKE (4-row)
    [66, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2,66], // 7  open
    [66, 2, 2, 2, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2,66], // 8  dense
    [66, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,66], // 9  TRAINER 1 (Veil x:5)
    [66, 2, 1, 1, 1,69, 1, 1, 1, 0, 0, 1, 1, 1,69, 1, 1, 1, 2,66], // 10 rocks
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 11 CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 12 CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 13 CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 14 CHOKE (4-row)
    [66, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2,66], // 15 open
    [66, 2, 1, 1, 1,67, 1, 1, 1, 0, 0, 1, 1, 1, 1,67, 1, 1, 2,66], // 16 signs
    [66, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2,66], // 17 open
    [66, 2, 2, 2, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2,66], // 18 dense
    [66, 2, 2, 2, 2, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2,66], // 19 denser
    [66, 2, 1, 1, 1,69, 1, 1, 1, 0, 0, 1, 1, 1,69, 1, 1, 1, 2,66], // 20 rocks
    [66, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,66], // 21 TRAINER 2 (Gram x:14)
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 22 CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 23 CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 24 CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 25 CHOKE (4-row)
    [66, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2,66], // 26 densest
    [66,66,66,66,66,66,66,66,66, 0, 0,66,66,66,66,66,66,66,66,66], // 27 bottom border
  ],
  warps:[
    { x:9,  y:0,  targetMap:'ROUTE_7B', targetX:9,  targetY:26 },
    { x:10, y:0,  targetMap:'ROUTE_7B', targetX:10, targetY:26 },
    { x:9,  y:27, targetMap:'ROUTE_7D', targetX:9,  targetY:1  },
    { x:10, y:27, targetMap:'ROUTE_7D', targetX:10, targetY:1  },
  ],
  npcs:[
    { id:'R7C_TRAINER1', name:'Wave', x:5, y:9, facing:'RIGHT', spriteKey:'NPC_MAN',
      movementType:'STATIONARY', dialogue:['GRUNT_4'], trainerRef:'SWIMMER_WAVE' },
    { id:'R7C_TRAINER2', name:'Tide', x:14, y:21, facing:'LEFT', spriteKey:'NPC_MAN',
      movementType:'STATIONARY', dialogue:['GRUNT_4'], trainerRef:'FISHERMAN_TIDE' },
  ],
  encounterTable:{ grass:[
    { speciesId:'MUDFIN',    minLv:40, maxLv:44, rate:35 },
    { speciesId:'MARSHFIN',  minLv:40, maxLv:44, rate:30 },
    { speciesId:'SWAMPJAW',  minLv:39, maxLv:43, rate:25 },
    { speciesId:'DUSKFANG',  minLv:40, maxLv:44, rate:10 },
  ], water:[]},
  events:[],
},

ROUTE_7D: {
  id:'ROUTE_7D', name:'Route 7 — Eastern Cliffs 4', width:20, height:28,
  music:'ROUTE_ROCKY', isIndoor:false, isCave:false,
  tiles: [
    [66,66,66,66,66,66,66,66,66, 0, 0,66,66,66,66,66,66,66,66,66], // 0  top border
    [66, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,66], // 1  arrival
    [66, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2,66], // 2  grass
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 3  CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 4  CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 5  CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 6  CHOKE (4-row)
    [66, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2,66], // 7  open
    [66, 2, 2, 2, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2,66], // 8  dense
    [66, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,66], // 9  TRAINER 1 (Gram x:5)
    [66, 2, 1, 1, 1,69, 1, 1, 1, 0, 0, 1, 1, 1,69, 1, 1, 1, 2,66], // 10 rocks
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 11 CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 12 CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 13 CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 14 CHOKE (4-row)
    [66, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2,66], // 15 open
    [66, 2, 2, 2, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2,66], // 16 dense
    [66, 2, 1, 1, 1,67, 1, 1, 1, 0, 0, 1, 1, 1, 1,67, 1, 1, 2,66], // 17 signs
    [66, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2,66], // 18 open
    [66, 2, 2, 2, 2, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2,66], // 19 denser
    [66, 2, 1, 1, 1,69, 1, 1, 1, 0, 0, 1, 1, 1,69, 1, 1, 1, 2,66], // 20 rocks
    [66, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,66], // 21 TRAINER 2 (Dex x:14)
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 22 CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 23 CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 24 CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 25 CHOKE (4-row)
    [66, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2,66], // 26 densest
    [66,66,66,66,66,66,66,66,66, 0, 0,66,66,66,66,66,66,66,66,66], // 27 bottom border
  ],
  warps:[
    { x:9,  y:0,  targetMap:'ROUTE_7C',    targetX:9,  targetY:26 },
    { x:10, y:0,  targetMap:'ROUTE_7C',    targetX:10, targetY:26 },
    { x:9,  y:27, targetMap:'BOGMIRE_CITY', targetX:7,  targetY:7  },
    { x:10, y:27, targetMap:'BOGMIRE_CITY', targetX:7,  targetY:7  },
  ],
  npcs:[
    { id:'R7D_TRAINER1', name:'Wave', x:5, y:9, facing:'RIGHT', spriteKey:'NPC_MAN',
      movementType:'STATIONARY', dialogue:['GRUNT_4'], trainerRef:'SWIMMER_WAVE' },
    { id:'R7D_TRAINER2', name:'Tide', x:14, y:21, facing:'LEFT', spriteKey:'NPC_MAN',
      movementType:'STATIONARY', dialogue:['GRUNT_4'], trainerRef:'FISHERMAN_TIDE' },
  ],
  encounterTable:{ grass:[
    { speciesId:'MUDFIN',    minLv:41, maxLv:45, rate:35 },
    { speciesId:'MARSHFIN',  minLv:41, maxLv:45, rate:30 },
    { speciesId:'SWAMPJAW',  minLv:40, maxLv:44, rate:25 },
    { speciesId:'DUSKFANG',  minLv:41, maxLv:45, rate:10 },
  ], water:[]},
  events:[],
},

// ── Route 8 — four bladen (each 32 rows, mountain/storm) ─────
ROUTE_8A: {
  id:'ROUTE_8A', name:'Route 8 — Storm Cliff 1', width:20, height:32,
  music:'ROUTE_WIND', isIndoor:false, isCave:false,
  tiles: [
    [66,66,66,66,66,66,66,66,66, 0, 0,66,66,66,66,66,66,66,66,66], // 0  top border
    [66, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,66], // 1  arrival
    [66, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2,66], // 2  grass
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 3  CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 4  CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 5  CHOKE
    [66, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2,66], // 6  open
    [66, 2, 2, 2, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2,66], // 7  dense
    [66, 2, 1, 1, 1,69, 1, 1, 1, 0, 0, 1, 1, 1,69, 1, 1, 1, 2,66], // 8  rocks
    [66, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,66], // 9  TRAINER 1 (Kai x:5)
    [66, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2,66], // 10 open
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 11 CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 12 CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 13 CHOKE
    [66, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2,66], // 14 open
    [66, 1, 1, 1, 1,67, 1, 1, 1, 0, 0, 1, 1, 1, 1,67, 1, 1, 1,66], // 15 signs
    [66, 2, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 2,66], // 16 open
    [66, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2,66], // 17 grass
    [66, 2, 2, 2, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2,66], // 18 dense
    [66, 2, 2, 2, 2, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2,66], // 19 denser
    [66, 2, 1, 1, 1,69, 1, 1, 1, 0, 0, 1, 1, 1,69, 1, 1, 1, 2,66], // 20 rocks
    [66, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,66], // 21 TRAINER 2 (Zola x:14)
    [66, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2,66], // 22 open
    [66, 2, 2, 2, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2,66], // 23 dense
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 24 CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 25 CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 26 CHOKE
    [66, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2,66], // 27 open
    [66, 2, 2, 2, 2, 2, 1, 1, 1, 0, 0, 1, 1, 1, 2, 2, 2, 2, 2,66], // 28 dense
    [66, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2,66], // 29 densest
    [66, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2,66], // 30 densest
    [66,66,66,66,66,66,66,66,66, 0, 0,66,66,66,66,66,66,66,66,66], // 31 bottom border
  ],
  warps:[
    { x:9,  y:0,  targetMap:'CRESTFALL_TOWN', targetX:7,  targetY:7  },
    { x:10, y:0,  targetMap:'CRESTFALL_TOWN', targetX:7,  targetY:7  },
    { x:9,  y:31, targetMap:'ROUTE_8B',       targetX:9,  targetY:1  },
    { x:10, y:31, targetMap:'ROUTE_8B',       targetX:10, targetY:1  },
  ],
  npcs:[
    { id:'R8A_TRAINER1', name:'Kai', x:5, y:9, facing:'RIGHT', spriteKey:'NPC_MAN',
      movementType:'STATIONARY', dialogue:['GRUNT_4'], trainerRef:'SNOWBOARDER_KAI' },
    { id:'R8A_TRAINER2', name:'Zola', x:14, y:21, facing:'LEFT', spriteKey:'NPC_WOMAN',
      movementType:'STATIONARY', dialogue:['GRUNT_4'], trainerRef:'MOUNTAINEER_ZOLA' },
    { id:'R8A_TIP1', name:'Dragon Scout', x:3, y:2, facing:'DOWN', spriteKey:'NPC_MAN',
      movementType:'STATIONARY', dialogue:["Ptryx and its evolutions soar on these storm cliffs!", "Dragon types hit almost everything neutrally — very few resistances."], onInteract:null },
    { id:'R8A_TIP2', name:'Summit Climber', x:16, y:29, facing:'LEFT', spriteKey:'NPC_WOMAN',
      movementType:'WANDER', dialogue:["Apex Summit is near — Gym 8 is the final test!", "Valdez uses a mixed team. Bring your strongest and most versatile DinoMons!"], onInteract:null },
  ],
  encounterTable:{ grass:[
    { speciesId:'PTRYX',     minLv:44, maxLv:48, rate:35 },
    { speciesId:'SWOOPTER',  minLv:44, maxLv:48, rate:30 },
    { speciesId:'GLIDEREX',  minLv:43, maxLv:47, rate:25 },
    { speciesId:'STEELBACK', minLv:44, maxLv:48, rate:10 },
  ], water:[]},
  events:[],
},

ROUTE_8B: {
  id:'ROUTE_8B', name:'Route 8 — Storm Cliff 2', width:20, height:32,
  music:'ROUTE_WIND', isIndoor:false, isCave:false,
  tiles: [
    [66,66,66,66,66,66,66,66,66, 0, 0,66,66,66,66,66,66,66,66,66], // 0  top border
    [66, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,66], // 1  arrival
    [66, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2,66], // 2  grass
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 3  CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 4  CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 5  CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 6  CHOKE (4-row)
    [66, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2,66], // 7  open
    [66, 2, 1, 1, 1,69, 1, 1, 1, 0, 0, 1, 1, 1,69, 1, 1, 1, 2,66], // 8  rocks
    [66, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,66], // 9  TRAINER 1 (Zola x:5)
    [66, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2,66], // 10 open
    [66, 2, 2, 2, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2,66], // 11 dense
    [66, 2, 2, 2, 2, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2,66], // 12 denser
    [66, 2, 1, 1, 1,67, 1, 1, 1, 0, 0, 1, 1, 1, 1,67, 1, 1, 2,66], // 13 signs
    [66, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2,66], // 14 open
    [66, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,66], // 15 BOSS (x:10)
    [66, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2,66], // 16 open
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 17 CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 18 CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 19 CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 20 CHOKE (4-row)
    [66, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2,66], // 21 open
    [66, 2, 2, 2, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2,66], // 22 dense
    [66, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,66], // 23 TRAINER 2 (Kai x:14)
    [66, 2, 1, 1, 1,69, 1, 1, 1, 0, 0, 1, 1, 1,69, 1, 1, 1, 2,66], // 24 rocks
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 25 CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 26 CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 27 CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 28 CHOKE (4-row)
    [66, 2, 2, 2, 2, 2, 1, 1, 1, 0, 0, 1, 1, 1, 2, 2, 2, 2, 2,66], // 29 dense
    [66, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2,66], // 30 densest
    [66,66,66,66,66,66,66,66,66, 0, 0,66,66,66,66,66,66,66,66,66], // 31 bottom border
  ],
  warps:[
    { x:9,  y:0,  targetMap:'ROUTE_8A', targetX:9,  targetY:30 },
    { x:10, y:0,  targetMap:'ROUTE_8A', targetX:10, targetY:30 },
    { x:9,  y:31, targetMap:'ROUTE_8C', targetX:9,  targetY:1  },
    { x:10, y:31, targetMap:'ROUTE_8C', targetX:10, targetY:1  },
  ],
  npcs:[
    { id:'R8B_TRAINER1', name:'Zola', x:5, y:9, facing:'RIGHT', spriteKey:'NPC_WOMAN',
      movementType:'STATIONARY', dialogue:['GRUNT_4'], trainerRef:'MOUNTAINEER_ZOLA' },
    { id:'R8B_BOSS', name:'Commander Triassic', x:10, y:15, facing:'DOWN', spriteKey:'NPC_GRUNT',
      movementType:'STATIONARY', dialogue:['CMD_TRIASSIC_3'], trainerRef:'CMD_TRIASSIC_2',
      requiresFlag:null, flagToHide:'TRAINER_CMD_TRIASSIC_2_DEFEATED' },
    { id:'R8B_TRAINER2', name:'Kai', x:14, y:23, facing:'LEFT', spriteKey:'NPC_MAN',
      movementType:'STATIONARY', dialogue:['GRUNT_4'], trainerRef:'SNOWBOARDER_KAI' },
  ],
  encounterTable:{ grass:[
    { speciesId:'PTRYX',     minLv:45, maxLv:49, rate:35 },
    { speciesId:'SWOOPTER',  minLv:45, maxLv:49, rate:30 },
    { speciesId:'GLIDEREX',  minLv:44, maxLv:48, rate:25 },
    { speciesId:'STEELBACK', minLv:45, maxLv:49, rate:10 },
  ], water:[]},
  events:[],
},

ROUTE_8C: {
  id:'ROUTE_8C', name:'Route 8 — Storm Cliff 3', width:20, height:32,
  music:'ROUTE_WIND', isIndoor:false, isCave:false,
  tiles: [
    [66,66,66,66,66,66,66,66,66, 0, 0,66,66,66,66,66,66,66,66,66], // 0  top border
    [66, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,66], // 1  arrival
    [66, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2,66], // 2  grass
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 3  CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 4  CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 5  CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 6  CHOKE (4-row)
    [66, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2,66], // 7  open
    [66, 2, 2, 2, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2,66], // 8  dense
    [66, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,66], // 9  TRAINER 1 (Kai x:5)
    [66, 2, 1, 1, 1,69, 1, 1, 1, 0, 0, 1, 1, 1,69, 1, 1, 1, 2,66], // 10 rocks
    [66, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2,66], // 11 open
    [66, 1, 1, 1, 1,67, 1, 1, 1, 0, 0, 1, 1, 1, 1,67, 1, 1, 1,66], // 12 signs
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 13 CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 14 CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 15 CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 16 CHOKE (4-row)
    [66, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2,66], // 17 open
    [66, 2, 2, 2, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2,66], // 18 dense
    [66, 2, 2, 2, 2, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2,66], // 19 denser
    [66, 2, 1, 1, 1,69, 1, 1, 1, 0, 0, 1, 1, 1,69, 1, 1, 1, 2,66], // 20 rocks
    [66, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2,66], // 21 open
    [66, 2, 2, 2, 2, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2,66], // 22 denser
    [66, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,66], // 23 TRAINER 2 (Zola x:14)
    [66, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2,66], // 24 open
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 25 CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 26 CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 27 CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 28 CHOKE (4-row)
    [66, 2, 2, 2, 2, 2, 1, 1, 1, 0, 0, 1, 1, 1, 2, 2, 2, 2, 2,66], // 29 dense
    [66, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2,66], // 30 densest
    [66,66,66,66,66,66,66,66,66, 0, 0,66,66,66,66,66,66,66,66,66], // 31 bottom border
  ],
  warps:[
    { x:9,  y:0,  targetMap:'ROUTE_8B', targetX:9,  targetY:30 },
    { x:10, y:0,  targetMap:'ROUTE_8B', targetX:10, targetY:30 },
    { x:9,  y:31, targetMap:'ROUTE_8D', targetX:9,  targetY:1  },
    { x:10, y:31, targetMap:'ROUTE_8D', targetX:10, targetY:1  },
  ],
  npcs:[
    { id:'R8C_TRAINER1', name:'Kai', x:5, y:9, facing:'RIGHT', spriteKey:'NPC_MAN',
      movementType:'STATIONARY', dialogue:['GRUNT_5'], trainerRef:'SNOWBOARDER_KAI' },
    { id:'R8C_TRAINER2', name:'Zola', x:14, y:23, facing:'LEFT', spriteKey:'NPC_WOMAN',
      movementType:'STATIONARY', dialogue:['GRUNT_5'], trainerRef:'MOUNTAINEER_ZOLA' },
  ],
  encounterTable:{ grass:[
    { speciesId:'PTRYX',     minLv:46, maxLv:50, rate:35 },
    { speciesId:'SWOOPTER',  minLv:46, maxLv:50, rate:30 },
    { speciesId:'GLIDEREX',  minLv:45, maxLv:49, rate:25 },
    { speciesId:'STEELBACK', minLv:46, maxLv:50, rate:10 },
  ], water:[]},
  events:[],
},

ROUTE_8D: {
  id:'ROUTE_8D', name:'Route 8 — Storm Cliff 4', width:20, height:32,
  music:'ROUTE_WIND', isIndoor:false, isCave:false,
  tiles: [
    [66,66,66,66,66,66,66,66,66, 0, 0,66,66,66,66,66,66,66,66,66], // 0  top border
    [66, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,66], // 1  arrival
    [66, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2,66], // 2  grass
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 3  CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 4  CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 5  CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 6  CHOKE (4-row)
    [66, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2,66], // 7  open
    [66, 2, 2, 2, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2,66], // 8  dense
    [66, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,66], // 9  TRAINER 1 (Zola x:5)
    [66, 2, 1, 1, 1,69, 1, 1, 1, 0, 0, 1, 1, 1,69, 1, 1, 1, 2,66], // 10 rocks
    [66, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2,66], // 11 open
    [66, 2, 2, 2, 2, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2,66], // 12 denser
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 13 CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 14 CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 15 CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 16 CHOKE (4-row)
    [66, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2,66], // 17 open
    [66, 1, 1, 1, 1,67, 1, 1, 1, 0, 0, 1, 1, 1, 1,67, 1, 1, 1,66], // 18 signs
    [66, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2,66], // 19 open
    [66, 2, 2, 2, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2,66], // 20 dense
    [66, 2, 2, 2, 2, 2, 1, 1, 1, 0, 0, 1, 1, 1, 2, 2, 2, 2, 2,66], // 21 denser
    [66, 2, 1, 1, 1,69, 1, 1, 1, 0, 0, 1, 1, 1,69, 1, 1, 1, 2,66], // 22 rocks
    [66, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,66], // 23 TRAINER 2 (Kai x:14)
    [66, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2,66], // 24 dense
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 25 CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 26 CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 27 CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 28 CHOKE (4-row)
    [66, 2, 2, 2, 2, 2, 1, 1, 1, 0, 0, 1, 1, 1, 2, 2, 2, 2, 2,66], // 29 dense
    [66, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2,66], // 30 densest
    [66,66,66,66,66,66,66,66,66, 0, 0,66,66,66,66,66,66,66,66,66], // 31 bottom border
  ],
  warps:[
    { x:9,  y:0,  targetMap:'ROUTE_8C',   targetX:9,  targetY:30 },
    { x:10, y:0,  targetMap:'ROUTE_8C',   targetX:10, targetY:30 },
    { x:9,  y:31, targetMap:'ROUTE_10A',  targetX:9,  targetY:1  },
    { x:10, y:31, targetMap:'ROUTE_10A',  targetX:10, targetY:1  },
  ],
  npcs:[
    { id:'R8D_TRAINER1', name:'Zola', x:5, y:9, facing:'RIGHT', spriteKey:'NPC_WOMAN',
      movementType:'STATIONARY', dialogue:['GRUNT_5'], trainerRef:'MOUNTAINEER_ZOLA' },
    { id:'R8D_TRAINER2', name:'Kai', x:14, y:23, facing:'LEFT', spriteKey:'NPC_MAN',
      movementType:'STATIONARY', dialogue:['GRUNT_5'], trainerRef:'SNOWBOARDER_KAI' },
  ],
  encounterTable:{ grass:[
    { speciesId:'PTRYX',     minLv:47, maxLv:51, rate:35 },
    { speciesId:'SWOOPTER',  minLv:47, maxLv:51, rate:30 },
    { speciesId:'GLIDEREX',  minLv:46, maxLv:50, rate:25 },
    { speciesId:'STEELBACK', minLv:47, maxLv:51, rate:10 },
  ], water:[]},
  events:[],
},

// ── Route 9 — five bladen (each 35 rows, swamp/dark) ─────────
ROUTE_9A: {
  id:'ROUTE_9A', name:'Route 9 — Bogmire Approach 1', width:20, height:35,
  music:'ROUTE_SWAMP', isIndoor:false, isCave:false,
  tiles: [
    [64,64,64,64,64,64,64,64,64, 0, 0,64,64,64,64,64,64,64,64,64], // 0  top border
    [64, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,64], // 1  arrival
    [64, 8, 8, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 8, 8, 8,64], // 2  swamp
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 3  CHOKE
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 4  CHOKE
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 5  CHOKE
    [64, 8, 8, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 8, 8, 8,64], // 6  open
    [64, 8, 8, 8, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 8, 8, 8, 8,64], // 7  swamp
    [64, 8, 1, 1, 1,69, 1, 1, 1, 0, 0, 1, 1, 1,69, 1, 1, 1, 8,64], // 8  rocks
    [64, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,64], // 9  TRAINER 1 (Veil x:5)
    [64, 8, 8, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 8, 8, 8,64], // 10 swamp
    [64, 8, 8, 8, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 8, 8, 8, 8,64], // 11 swamp
    [64, 8, 8, 8, 8, 1, 1, 1, 1, 0, 0, 1, 1, 1, 8, 8, 8, 8, 8,64], // 12 dense
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 13 CHOKE
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 14 CHOKE
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 15 CHOKE
    [64, 8, 8, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 8, 8, 8,64], // 16 open
    [64, 8, 1, 1, 1,67, 1, 1, 1, 0, 0, 1, 1, 1, 1,67, 1, 1, 8,64], // 17 signs
    [64, 8, 8, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 8, 8, 8,64], // 18 swamp
    [64, 8, 8, 8, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 8, 8, 8, 8,64], // 19 dense
    [64, 8, 8, 8, 8, 1, 1, 1, 1, 0, 0, 1, 1, 1, 8, 8, 8, 8, 8,64], // 20 denser
    [64, 8, 8, 8, 8, 8, 1, 1, 1, 0, 0, 1, 1, 8, 8, 8, 8, 8, 8,64], // 21 densest
    [64, 8, 1, 1, 1,69, 1, 1, 1, 0, 0, 1, 1, 1,69, 1, 1, 1, 8,64], // 22 rocks
    [64, 8, 8, 8, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 8, 8, 8, 8,64], // 23 dense
    [64, 8, 8, 8, 8, 8, 1, 1, 1, 0, 0, 1, 1, 1, 8, 8, 8, 8, 8,64], // 24 denser
    [64, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,64], // 25 TRAINER 2 (Dex x:14)
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 26 CHOKE
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 27 CHOKE
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 28 CHOKE
    [64, 8, 8, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 8, 8, 8,64], // 29 swamp
    [64, 8, 8, 8, 8, 1, 1, 1, 1, 0, 0, 1, 1, 1, 8, 8, 8, 8, 8,64], // 30 dense
    [64, 8, 8, 8, 8, 8, 8, 8, 8, 0, 0, 8, 8, 8, 8, 8, 8, 8, 8,64], // 31 densest
    [64, 8, 8, 8, 8, 8, 8, 8, 8, 0, 0, 8, 8, 8, 8, 8, 8, 8, 8,64], // 32 densest
    [64, 8, 8, 8, 8, 8, 8, 8, 8, 0, 0, 8, 8, 8, 8, 8, 8, 8, 8,64], // 33 densest
    [64,64,64,64,64,64,64,64,64, 0, 0,64,64,64,64,64,64,64,64,64], // 34 bottom border
  ],
  warps:[
    { x:9,  y:0,  targetMap:'BOGMIRE_CITY', targetX:7,  targetY:7  },
    { x:10, y:0,  targetMap:'BOGMIRE_CITY', targetX:7,  targetY:7  },
    { x:9,  y:34, targetMap:'ROUTE_9B',    targetX:9,  targetY:1  },
    { x:10, y:34, targetMap:'ROUTE_9B',    targetX:10, targetY:1  },
  ],
  npcs:[
    { id:'R9A_TRAINER1', name:'Veil', x:5, y:9, facing:'RIGHT', spriteKey:'NPC_WOMAN',
      movementType:'STATIONARY', dialogue:['GRUNT_4'], trainerRef:'PSYCHIC_VEIL' },
    { id:'R9A_TRAINER2', name:'Dex', x:14, y:25, facing:'LEFT', spriteKey:'NPC_MAN',
      movementType:'STATIONARY', dialogue:['GRUNT_4'], trainerRef:'RANGER_DEX' },
  ],
  encounterTable:{ grass:[
    { speciesId:'MIASMARK', minLv:50, maxLv:54, rate:30 },
    { speciesId:'SWAMPJAW', minLv:50, maxLv:54, rate:25 },
    { speciesId:'NIGHTREX', minLv:49, maxLv:53, rate:25 },
    { speciesId:'DUSKFANG', minLv:50, maxLv:55, rate:20 },
  ], water:[]},
  events:[],
},

ROUTE_9B: {
  id:'ROUTE_9B', name:'Route 9 — Bogmire Approach 2', width:20, height:35,
  music:'ROUTE_SWAMP', isIndoor:false, isCave:false,
  tiles: [
    [64,64,64,64,64,64,64,64,64, 0, 0,64,64,64,64,64,64,64,64,64], // 0  top border
    [64, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,64], // 1  arrival
    [64, 8, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 8,64], // 2  swamp
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 3  CHOKE
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 4  CHOKE
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 5  CHOKE
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 6  CHOKE (4-row)
    [64, 8, 8, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 8, 8, 8,64], // 7  open
    [64, 8, 8, 8, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 8, 8, 8, 8,64], // 8  dense
    [64, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,64], // 9  TRAINER 1 (Dex x:5)
    [64, 8, 1, 1, 1,69, 1, 1, 1, 0, 0, 1, 1, 1,69, 1, 1, 1, 8,64], // 10 rocks
    [64, 8, 8, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 8, 8, 8,64], // 11 swamp
    [64, 8, 8, 8, 8, 1, 1, 1, 1, 0, 0, 1, 1, 1, 8, 8, 8, 8, 8,64], // 12 dense
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 13 CHOKE
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 14 CHOKE
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 15 CHOKE
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 16 CHOKE (4-row)
    [64, 8, 8, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 8, 8, 8,64], // 17 open
    [64, 8, 1, 1, 1,67, 1, 1, 1, 0, 0, 1, 1, 1, 1,67, 1, 1, 8,64], // 18 signs
    [64, 8, 8, 8, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 8, 8, 8, 8,64], // 19 dense
    [64, 8, 8, 8, 8, 1, 1, 1, 1, 0, 0, 1, 1, 1, 8, 8, 8, 8, 8,64], // 20 denser
    [64, 8, 8, 8, 8, 8, 1, 1, 1, 0, 0, 1, 1, 8, 8, 8, 8, 8, 8,64], // 21 densest
    [64, 8, 1, 1, 1,69, 1, 1, 1, 0, 0, 1, 1, 1,69, 1, 1, 1, 8,64], // 22 rocks
    [64, 8, 8, 8, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 8, 8, 8, 8,64], // 23 dense
    [64, 8, 8, 8, 8, 8, 1, 1, 1, 0, 0, 1, 1, 1, 8, 8, 8, 8, 8,64], // 24 denser
    [64, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,64], // 25 TRAINER 2 (Veil x:14)
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 26 CHOKE
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 27 CHOKE
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 28 CHOKE
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 29 CHOKE (4-row)
    [64, 8, 8, 8, 8, 1, 1, 1, 1, 0, 0, 1, 1, 1, 8, 8, 8, 8, 8,64], // 30 dense
    [64, 8, 8, 8, 8, 8, 8, 8, 8, 0, 0, 8, 8, 8, 8, 8, 8, 8, 8,64], // 31 densest
    [64, 8, 8, 8, 8, 8, 8, 8, 8, 0, 0, 8, 8, 8, 8, 8, 8, 8, 8,64], // 32 densest
    [64, 8, 8, 8, 8, 8, 8, 8, 8, 0, 0, 8, 8, 8, 8, 8, 8, 8, 8,64], // 33 densest
    [64,64,64,64,64,64,64,64,64, 0, 0,64,64,64,64,64,64,64,64,64], // 34 bottom border
  ],
  warps:[
    { x:9,  y:0,  targetMap:'ROUTE_9A', targetX:9,  targetY:33 },
    { x:10, y:0,  targetMap:'ROUTE_9A', targetX:10, targetY:33 },
    { x:9,  y:34, targetMap:'ROUTE_9C', targetX:9,  targetY:1  },
    { x:10, y:34, targetMap:'ROUTE_9C', targetX:10, targetY:1  },
  ],
  npcs:[
    { id:'R9B_TRAINER1', name:'Dex', x:5, y:9, facing:'RIGHT', spriteKey:'NPC_MAN',
      movementType:'STATIONARY', dialogue:['GRUNT_4'], trainerRef:'RANGER_DEX' },
    { id:'R9B_TRAINER2', name:'Veil', x:14, y:25, facing:'LEFT', spriteKey:'NPC_WOMAN',
      movementType:'STATIONARY', dialogue:['GRUNT_4'], trainerRef:'PSYCHIC_VEIL' },
  ],
  encounterTable:{ grass:[
    { speciesId:'MIASMARK', minLv:51, maxLv:55, rate:30 },
    { speciesId:'SWAMPJAW', minLv:51, maxLv:55, rate:25 },
    { speciesId:'NIGHTREX', minLv:50, maxLv:54, rate:25 },
    { speciesId:'DUSKFANG', minLv:51, maxLv:56, rate:20 },
  ], water:[]},
  events:[],
},

ROUTE_9C: {
  id:'ROUTE_9C', name:'Route 9 — Bogmire Approach 3', width:20, height:35,
  music:'ROUTE_SWAMP', isIndoor:false, isCave:false,
  tiles: [
    [64,64,64,64,64,64,64,64,64, 0, 0,64,64,64,64,64,64,64,64,64], // 0  top border
    [64, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,64], // 1  arrival
    [64, 8, 8, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 8, 8, 8,64], // 2  swamp
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 3  CHOKE
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 4  CHOKE
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 5  CHOKE
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 6  CHOKE (4-row)
    [64, 8, 8, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 8, 8, 8,64], // 7  open
    [64, 8, 8, 8, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 8, 8, 8, 8,64], // 8  dense
    [64, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,64], // 9  TRAINER 1 (Veil x:5)
    [64, 8, 1, 1, 1,69, 1, 1, 1, 0, 0, 1, 1, 1,69, 1, 1, 1, 8,64], // 10 rocks
    [64, 8, 8, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 8, 8, 8,64], // 11 swamp
    [64, 8, 8, 8, 8, 1, 1, 1, 1, 0, 0, 1, 1, 1, 8, 8, 8, 8, 8,64], // 12 dense
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 13 CHOKE
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 14 CHOKE
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 15 CHOKE
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 16 CHOKE (4-row)
    [64, 8, 8, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 8, 8, 8,64], // 17 open
    [64,68, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1,67, 1, 1, 8,64], // 18 DOOR to Glacial Pass at x:1
    [64, 8, 8, 8, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 8, 8, 8, 8,64], // 19 dense
    [64, 8, 8, 8, 8, 1, 1, 1, 1, 0, 0, 1, 1, 1, 8, 8, 8, 8, 8,64], // 20 denser
    [64, 8, 8, 8, 8, 8, 1, 1, 1, 0, 0, 1, 1, 8, 8, 8, 8, 8, 8,64], // 21 densest
    [64, 8, 1, 1, 1,69, 1, 1, 1, 0, 0, 1, 1, 1,69, 1, 1, 1, 8,64], // 22 rocks
    [64, 8, 8, 8, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 8, 8, 8, 8,64], // 23 dense
    [64, 8, 8, 8, 8, 8, 1, 1, 1, 0, 0, 1, 1, 1, 8, 8, 8, 8, 8,64], // 24 denser
    [64, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,64], // 25 TRAINER 2 (Dex x:14)
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 26 CHOKE
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 27 CHOKE
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 28 CHOKE
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 29 CHOKE (4-row)
    [64, 8, 8, 8, 8, 1, 1, 1, 1, 0, 0, 1, 1, 1, 8, 8, 8, 8, 8,64], // 30 dense
    [64, 8, 8, 8, 8, 8, 8, 8, 8, 0, 0, 8, 8, 8, 8, 8, 8, 8, 8,64], // 31 densest
    [64, 8, 8, 8, 8, 8, 8, 8, 8, 0, 0, 8, 8, 8, 8, 8, 8, 8, 8,64], // 32 densest
    [64, 8, 8, 8, 8, 8, 8, 8, 8, 0, 0, 8, 8, 8, 8, 8, 8, 8, 8,64], // 33 densest
    [64,64,64,64,64,64,64,64,64, 0, 0,64,64,64,64,64,64,64,64,64], // 34 bottom border
  ],
  warps:[
    { x:9,  y:0,  targetMap:'ROUTE_9B',    targetX:9,  targetY:33 },
    { x:10, y:0,  targetMap:'ROUTE_9B',    targetX:10, targetY:33 },
    { x:1,  y:18, targetMap:'GLACIAL_PASS', targetX:9,  targetY:1  },
    { x:9,  y:34, targetMap:'ROUTE_9D',    targetX:9,  targetY:1  },
    { x:10, y:34, targetMap:'ROUTE_9D',    targetX:10, targetY:1  },
  ],
  npcs:[
    { id:'R9C_TRAINER1', name:'Veil', x:5, y:9, facing:'RIGHT', spriteKey:'NPC_WOMAN',
      movementType:'STATIONARY', dialogue:['GRUNT_5'], trainerRef:'PSYCHIC_VEIL' },
    { id:'R9C_TRAINER2', name:'Dex', x:14, y:25, facing:'LEFT', spriteKey:'NPC_MAN',
      movementType:'STATIONARY', dialogue:['GRUNT_5'], trainerRef:'RANGER_DEX' },
  ],
  encounterTable:{ grass:[
    { speciesId:'MIASMARK', minLv:52, maxLv:56, rate:30 },
    { speciesId:'SWAMPJAW', minLv:52, maxLv:56, rate:25 },
    { speciesId:'NIGHTREX', minLv:51, maxLv:55, rate:25 },
    { speciesId:'DUSKFANG', minLv:52, maxLv:57, rate:20 },
  ], water:[]},
  events:[],
},

ROUTE_9D: {
  id:'ROUTE_9D', name:'Route 9 — Bogmire Approach 4', width:20, height:35,
  music:'ROUTE_SWAMP', isIndoor:false, isCave:false,
  tiles: [
    [64,64,64,64,64,64,64,64,64, 0, 0,64,64,64,64,64,64,64,64,64], // 0  top border
    [64, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,64], // 1  arrival
    [64, 8, 8, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 8, 8, 8,64], // 2  swamp
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 3  CHOKE
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 4  CHOKE
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 5  CHOKE
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 6  CHOKE
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 7  CHOKE (5-row)
    [64, 8, 8, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 8, 8, 8,64], // 8  open
    [64, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,64], // 9  TRAINER 1 (Dex x:5)
    [64, 8, 1, 1, 1,69, 1, 1, 1, 0, 0, 1, 1, 1,69, 1, 1, 1, 8,64], // 10 rocks
    [64, 8, 8, 8, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 8, 8, 8, 8,64], // 11 dense
    [64, 8, 8, 8, 8, 8, 1, 1, 1, 0, 0, 1, 1, 1, 8, 8, 8, 8, 8,64], // 12 denser
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 13 CHOKE
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 14 CHOKE
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 15 CHOKE
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 16 CHOKE
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 17 CHOKE (5-row)
    [64, 8, 8, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 8, 8, 8,64], // 18 open
    [64, 8, 1, 1, 1,67, 1, 1, 1, 0, 0, 1, 1, 1, 1,67, 1, 1, 8,64], // 19 signs
    [64, 8, 8, 8, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 8, 8, 8, 8,64], // 20 dense
    [64, 8, 8, 8, 8, 1, 1, 1, 1, 0, 0, 1, 1, 1, 8, 8, 8, 8, 8,64], // 21 denser
    [64, 8, 8, 8, 8, 8, 1, 1, 1, 0, 0, 1, 1, 8, 8, 8, 8, 8, 8,64], // 22 densest
    [64, 8, 1, 1, 1,69, 1, 1, 1, 0, 0, 1, 1, 1,69, 1, 1, 1, 8,64], // 23 rocks
    [64, 8, 8, 8, 8, 8, 1, 1, 1, 0, 0, 1, 1, 1, 8, 8, 8, 8, 8,64], // 24 denser
    [64, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,64], // 25 TRAINER 2 (Veil x:14)
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 26 CHOKE
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 27 CHOKE
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 28 CHOKE
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 29 CHOKE
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 30 CHOKE (5-row)
    [64, 8, 8, 8, 8, 8, 8, 8, 8, 0, 0, 8, 8, 8, 8, 8, 8, 8, 8,64], // 31 densest
    [64, 8, 8, 8, 8, 8, 8, 8, 8, 0, 0, 8, 8, 8, 8, 8, 8, 8, 8,64], // 32 densest
    [64, 8, 8, 8, 8, 8, 8, 8, 8, 0, 0, 8, 8, 8, 8, 8, 8, 8, 8,64], // 33 densest
    [64,64,64,64,64,64,64,64,64, 0, 0,64,64,64,64,64,64,64,64,64], // 34 bottom border
  ],
  warps:[
    { x:9,  y:0,  targetMap:'ROUTE_9C', targetX:9,  targetY:33 },
    { x:10, y:0,  targetMap:'ROUTE_9C', targetX:10, targetY:33 },
    { x:9,  y:34, targetMap:'ROUTE_9E', targetX:9,  targetY:1  },
    { x:10, y:34, targetMap:'ROUTE_9E', targetX:10, targetY:1  },
  ],
  npcs:[
    { id:'R9D_TRAINER1', name:'Dex', x:5, y:9, facing:'RIGHT', spriteKey:'NPC_MAN',
      movementType:'STATIONARY', dialogue:['GRUNT_5'], trainerRef:'RANGER_DEX' },
    { id:'R9D_TRAINER2', name:'Veil', x:14, y:25, facing:'LEFT', spriteKey:'NPC_WOMAN',
      movementType:'STATIONARY', dialogue:['GRUNT_5'], trainerRef:'PSYCHIC_VEIL' },
  ],
  encounterTable:{ grass:[
    { speciesId:'MIASMARK', minLv:53, maxLv:57, rate:30 },
    { speciesId:'SWAMPJAW', minLv:53, maxLv:57, rate:25 },
    { speciesId:'NIGHTREX', minLv:52, maxLv:56, rate:25 },
    { speciesId:'DUSKFANG', minLv:53, maxLv:58, rate:20 },
  ], water:[]},
  events:[],
},

ROUTE_9E: {
  id:'ROUTE_9E', name:'Route 9 — Bogmire Approach 5', width:20, height:35,
  music:'ROUTE_SWAMP', isIndoor:false, isCave:false,
  tiles: [
    [64,64,64,64,64,64,64,64,64, 0, 0,64,64,64,64,64,64,64,64,64], // 0  top border
    [64, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,64], // 1  arrival
    [64, 8, 8, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 8, 8, 8,64], // 2  swamp
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 3  CHOKE
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 4  CHOKE
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 5  CHOKE
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 6  CHOKE
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 7  CHOKE (5-row)
    [64, 8, 8, 8, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 8, 8, 8, 8,64], // 8  open
    [64, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,64], // 9  TRAINER 1 (Veil x:5)
    [64, 8, 1, 1, 1,69, 1, 1, 1, 0, 0, 1, 1, 1,69, 1, 1, 1, 8,64], // 10 rocks
    [64, 8, 8, 8, 8, 1, 1, 1, 1, 0, 0, 1, 1, 1, 8, 8, 8, 8, 8,64], // 11 dense
    [64, 8, 8, 8, 8, 8, 8, 8, 8, 0, 0, 8, 8, 8, 8, 8, 8, 8, 8,64], // 12 densest
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 13 CHOKE
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 14 CHOKE
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 15 CHOKE
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 16 CHOKE
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 17 CHOKE (5-row)
    [64, 8, 8, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 8, 8, 8,64], // 18 open
    [64, 8, 1, 1, 1,67, 1, 1, 1, 0, 0, 1, 1, 1, 1,67, 1, 1, 8,64], // 19 signs
    [64, 8, 8, 8, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 8, 8, 8, 8,64], // 20 dense
    [64, 8, 8, 8, 8, 1, 1, 1, 1, 0, 0, 1, 1, 1, 8, 8, 8, 8, 8,64], // 21 denser
    [64, 8, 8, 8, 8, 8, 1, 1, 1, 0, 0, 1, 1, 8, 8, 8, 8, 8, 8,64], // 22 densest
    [64, 8, 1, 1, 1,69, 1, 1, 1, 0, 0, 1, 1, 1,69, 1, 1, 1, 8,64], // 23 rocks
    [64, 8, 8, 8, 8, 8, 8, 1, 1, 0, 0, 1, 1, 8, 8, 8, 8, 8, 8,64], // 24 densest
    [64, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,64], // 25 TRAINER 2 (Dex x:14)
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 26 CHOKE
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 27 CHOKE
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 28 CHOKE
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 29 CHOKE
    [64,64,64,64,64,64,64,64,64, 2, 2,64,64,64,64,64,64,64,64,64], // 30 CHOKE (5-row)
    [64, 8, 8, 8, 8, 8, 8, 8, 8, 0, 0, 8, 8, 8, 8, 8, 8, 8, 8,64], // 31 densest
    [64, 8, 8, 8, 8, 8, 8, 8, 8, 0, 0, 8, 8, 8, 8, 8, 8, 8, 8,64], // 32 densest
    [64, 8, 8, 8, 8, 8, 8, 8, 8, 0, 0, 8, 8, 8, 8, 8, 8, 8, 8,64], // 33 densest
    [64,64,64,64,64,64,64,64,64, 0, 0,64,64,64,64,64,64,64,64,64], // 34 bottom border
  ],
  warps:[
    { x:9,  y:0,  targetMap:'ROUTE_9D',  targetX:9,  targetY:33 },
    { x:10, y:0,  targetMap:'ROUTE_9D',  targetX:10, targetY:33 },
    { x:9,  y:34, targetMap:'ROUTE_10A', targetX:9,  targetY:1  },
    { x:10, y:34, targetMap:'ROUTE_10A', targetX:10, targetY:1  },
  ],
  npcs:[
    { id:'R9E_TRAINER1', name:'Veil', x:5, y:9, facing:'RIGHT', spriteKey:'NPC_WOMAN',
      movementType:'STATIONARY', dialogue:['GRUNT_5'], trainerRef:'PSYCHIC_VEIL' },
    { id:'R9E_TRAINER2', name:'Dex', x:14, y:25, facing:'LEFT', spriteKey:'NPC_MAN',
      movementType:'STATIONARY', dialogue:['GRUNT_5'], trainerRef:'RANGER_DEX' },
  ],
  encounterTable:{ grass:[
    { speciesId:'MIASMARK', minLv:54, maxLv:58, rate:30 },
    { speciesId:'SWAMPJAW', minLv:54, maxLv:58, rate:25 },
    { speciesId:'NIGHTREX', minLv:53, maxLv:57, rate:25 },
    { speciesId:'DUSKFANG', minLv:54, maxLv:59, rate:20 },
  ], water:[]},
  events:[],
},

// ── Route 10 — five bladen (each 38 rows, mountain/ice) ──────
ROUTE_10A: {
  id:'ROUTE_10A', name:'Route 10 — Frost Ascent 1', width:20, height:38,
  music:'ROUTE_ICE', isIndoor:false, isCave:false,
  tiles: [
    [66,66,66,66,66,66,66,66,66, 0, 0,66,66,66,66,66,66,66,66,66], // 0  top border
    [66, 6, 6, 6, 6, 6, 6, 6, 6, 0, 0, 6, 6, 6, 6, 6, 6, 6, 6,66], // 1  arrival (ice)
    [66, 2, 2, 6, 6, 6, 6, 6, 6, 0, 0, 6, 6, 6, 6, 6, 2, 2, 2,66], // 2  grass+ice
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 3  CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 4  CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 5  CHOKE
    [66, 2, 2, 6, 6, 6, 6, 6, 6, 0, 0, 6, 6, 6, 6, 6, 2, 2, 2,66], // 6  open
    [66, 6, 6, 6, 6, 6, 6, 6, 6, 0, 0, 6, 6, 6, 6, 6, 6, 6, 6,66], // 7  ice
    [66, 2, 6, 6, 6,69, 6, 6, 6, 0, 0, 6, 6, 6,69, 6, 6, 6, 2,66], // 8  rocks
    [66, 6, 6, 6, 6, 6, 6, 6, 6, 0, 0, 6, 6, 6, 6, 6, 6, 6, 6,66], // 9  TRAINER 1 (Kai x:5)
    [66, 2, 2, 6, 6, 6, 6, 6, 6, 0, 0, 6, 6, 6, 6, 6, 2, 2, 2,66], // 10 grass+ice
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 11 CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 12 CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 13 CHOKE
    [66, 2, 2, 6, 6, 6, 6, 6, 6, 0, 0, 6, 6, 6, 6, 6, 2, 2, 2,66], // 14 open
    [66, 6, 6, 6, 6,67, 6, 6, 6, 0, 0, 6, 6, 6, 6,67, 6, 6, 6,66], // 15 signs
    [66, 2, 6, 6, 6, 6, 6, 6, 6, 0, 0, 6, 6, 6, 6, 6, 6, 6, 2,66], // 16 grass+ice
    [66, 6, 6, 6, 6, 6, 6, 6, 6, 0, 0, 6, 6, 6, 6, 6, 6, 6, 6,66], // 17 ice
    [66, 2, 2, 6, 6, 6, 6, 6, 6, 0, 0, 6, 6, 6, 6, 6, 2, 2, 2,66], // 18 grass+ice
    [66, 2, 2, 2, 6, 6, 6, 6, 6, 0, 0, 6, 6, 6, 6, 2, 2, 2, 2,66], // 19 dense grass
    [66, 2, 6, 6, 6,69, 6, 6, 6, 0, 0, 6, 6, 6,69, 6, 6, 6, 2,66], // 20 rocks
    [66, 6, 6, 6, 6, 6, 6, 6, 6, 0, 0, 6, 6, 6, 6, 6, 6, 6, 6,66], // 21 ice
    [66, 2, 2, 6, 6, 6, 6, 6, 6, 0, 0, 6, 6, 6, 6, 6, 2, 2, 2,66], // 22 grass+ice
    [66, 2, 2, 2, 2, 6, 6, 6, 6, 0, 0, 6, 6, 6, 2, 2, 2, 2, 2,66], // 23 dense
    [66, 2, 2, 2, 2, 2, 6, 6, 6, 0, 0, 6, 6, 2, 2, 2, 2, 2, 2,66], // 24 denser
    [66, 6, 6, 6, 6, 6, 6, 6, 6, 0, 0, 6, 6, 6, 6, 6, 6, 6, 6,66], // 25 ice
    [66, 6, 6, 6, 6, 6, 6, 6, 6, 0, 0, 6, 6, 6, 6, 6, 6, 6, 6,66], // 26 ice
    [66, 6, 6, 6, 6, 6, 6, 6, 6, 0, 0, 6, 6, 6, 6, 6, 6, 6, 6,66], // 27 TRAINER 2 (Zola x:14)
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 28 CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 29 CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 30 CHOKE
    [66, 2, 2, 2, 6, 6, 6, 6, 6, 0, 0, 6, 6, 6, 6, 2, 2, 2, 2,66], // 31 grass+ice
    [66, 2, 2, 2, 2, 2, 6, 6, 6, 0, 0, 6, 6, 2, 2, 2, 2, 2, 2,66], // 32 denser
    [66, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2,66], // 33 densest
    [66, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2,66], // 34 densest
    [66, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2,66], // 35 densest
    [66, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2,66], // 36 densest
    [66,66,66,66,66,66,66,66,66, 0, 0,66,66,66,66,66,66,66,66,66], // 37 bottom border
  ],
  warps:[
    { x:9,  y:0,  targetMap:'ROUTE_8D',  targetX:9,  targetY:30 },
    { x:10, y:0,  targetMap:'ROUTE_8D',  targetX:10, targetY:30 },
    { x:9,  y:37, targetMap:'ROUTE_10B', targetX:9,  targetY:1  },
    { x:10, y:37, targetMap:'ROUTE_10B', targetX:10, targetY:1  },
  ],
  npcs:[
    { id:'R10A_TRAINER1', name:'Rook', x:5, y:9, facing:'RIGHT', spriteKey:'NPC_MAN',
      movementType:'STATIONARY', dialogue:['GRUNT_5'], trainerRef:'DRAGONTAMER_ROOK' },
    { id:'R10A_TRAINER2', name:'Vance', x:14, y:27, facing:'LEFT', spriteKey:'NPC_MAN',
      movementType:'STATIONARY', dialogue:['GRUNT_5'], trainerRef:'EXPLORER_VANCE' },
  ],
  encounterTable:{ grass:[
    { speciesId:'SWOOPTER',  minLv:54, maxLv:58, rate:20 },
    { speciesId:'BLIZZHORN', minLv:52, maxLv:57, rate:20 },
    { speciesId:'IRONSCALE', minLv:52, maxLv:56, rate:20 },
    { speciesId:'LAVACLAW',  minLv:53, maxLv:57, rate:20 },
    { speciesId:'FIRECOAL',  minLv:51, maxLv:55, rate:20 },
  ], water:[]},
  events:[],
},

ROUTE_10B: {
  id:'ROUTE_10B', name:'Route 10 — Frost Ascent 2', width:20, height:38,
  music:'ROUTE_ICE', isIndoor:false, isCave:false,
  tiles: [
    [66,66,66,66,66,66,66,66,66, 0, 0,66,66,66,66,66,66,66,66,66], // 0  top border
    [66, 6, 6, 6, 6, 6, 6, 6, 6, 0, 0, 6, 6, 6, 6, 6, 6, 6, 6,66], // 1  arrival
    [66, 2, 2, 6, 6, 6, 6, 6, 6, 0, 0, 6, 6, 6, 6, 6, 2, 2, 2,66], // 2  grass+ice
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 3  CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 4  CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 5  CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 6  CHOKE (4-row)
    [66, 2, 2, 6, 6, 6, 6, 6, 6, 0, 0, 6, 6, 6, 6, 6, 2, 2, 2,66], // 7  open
    [66, 6, 6, 6, 6, 6, 6, 6, 6, 0, 0, 6, 6, 6, 6, 6, 6, 6, 6,66], // 8  ice
    [66, 6, 6, 6, 6, 6, 6, 6, 6, 0, 0, 6, 6, 6, 6, 6, 6, 6, 6,66], // 9  TRAINER 1 (Zola x:5)
    [66, 2, 6, 6, 6,69, 6, 6, 6, 0, 0, 6, 6, 6,69, 6, 6, 6, 2,66], // 10 rocks
    [66, 2, 2, 6, 6, 6, 6, 6, 6, 0, 0, 6, 6, 6, 6, 6, 2, 2, 2,66], // 11 grass+ice
    [66, 2, 2, 2, 6, 6, 6, 6, 6, 0, 0, 6, 6, 6, 6, 2, 2, 2, 2,66], // 12 dense
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 13 CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 14 CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 15 CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 16 CHOKE (4-row)
    [66, 2, 2, 6, 6, 6, 6, 6, 6, 0, 0, 6, 6, 6, 6, 6, 2, 2, 2,66], // 17 open
    [66, 6, 6, 6, 6,67, 6, 6, 6, 0, 0, 6, 6, 6, 6,67, 6, 6, 6,66], // 18 signs
    [66, 2, 2, 6, 6, 6, 6, 6, 6, 0, 0, 6, 6, 6, 6, 6, 2, 2, 2,66], // 19 grass+ice
    [66, 2, 2, 2, 6, 6, 6, 6, 6, 0, 0, 6, 6, 6, 6, 2, 2, 2, 2,66], // 20 dense
    [66, 2, 2, 2, 2, 6, 6, 6, 6, 0, 0, 6, 6, 6, 2, 2, 2, 2, 2,66], // 21 denser
    [66, 2, 6, 6, 6,69, 6, 6, 6, 0, 0, 6, 6, 6,69, 6, 6, 6, 2,66], // 22 rocks
    [66, 2, 2, 2, 2, 6, 6, 6, 6, 0, 0, 6, 6, 6, 2, 2, 2, 2, 2,66], // 23 denser
    [66, 6, 6, 6, 6, 6, 6, 6, 6, 0, 0, 6, 6, 6, 6, 6, 6, 6, 6,66], // 24 ice
    [66, 6, 6, 6, 6, 6, 6, 6, 6, 0, 0, 6, 6, 6, 6, 6, 6, 6, 6,66], // 25 ice
    [66, 6, 6, 6, 6, 6, 6, 6, 6, 0, 0, 6, 6, 6, 6, 6, 6, 6, 6,66], // 26 ice
    [66, 6, 6, 6, 6, 6, 6, 6, 6, 0, 0, 6, 6, 6, 6, 6, 6, 6, 6,66], // 27 TRAINER 2 (Kai x:14)
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 28 CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 29 CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 30 CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 31 CHOKE (4-row)
    [66, 2, 2, 2, 6, 6, 6, 6, 6, 0, 0, 6, 6, 6, 6, 2, 2, 2, 2,66], // 32 dense
    [66, 2, 2, 2, 2, 2, 6, 6, 6, 0, 0, 6, 6, 2, 2, 2, 2, 2, 2,66], // 33 denser
    [66, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2,66], // 34 densest
    [66, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2,66], // 35 densest
    [66, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2,66], // 36 densest
    [66,66,66,66,66,66,66,66,66, 0, 0,66,66,66,66,66,66,66,66,66], // 37 bottom border
  ],
  warps:[
    { x:9,  y:0,  targetMap:'ROUTE_10A', targetX:9,  targetY:36 },
    { x:10, y:0,  targetMap:'ROUTE_10A', targetX:10, targetY:36 },
    { x:9,  y:37, targetMap:'ROUTE_10C', targetX:9,  targetY:1  },
    { x:10, y:37, targetMap:'ROUTE_10C', targetX:10, targetY:1  },
  ],
  npcs:[
    { id:'R10B_TRAINER1', name:'Vance', x:5, y:9, facing:'RIGHT', spriteKey:'NPC_MAN',
      movementType:'STATIONARY', dialogue:['GRUNT_5'], trainerRef:'EXPLORER_VANCE' },
    { id:'R10B_TRAINER2', name:'Rook', x:14, y:27, facing:'LEFT', spriteKey:'NPC_MAN',
      movementType:'STATIONARY', dialogue:['GRUNT_5'], trainerRef:'DRAGONTAMER_ROOK' },
  ],
  encounterTable:{ grass:[
    { speciesId:'SWOOPTER',  minLv:55, maxLv:59, rate:20 },
    { speciesId:'BLIZZHORN', minLv:53, maxLv:58, rate:20 },
    { speciesId:'IRONSCALE', minLv:53, maxLv:57, rate:20 },
    { speciesId:'LAVACLAW',  minLv:54, maxLv:58, rate:20 },
    { speciesId:'FIRECOAL',  minLv:52, maxLv:56, rate:20 },
  ], water:[]},
  events:[],
},

ROUTE_10C: {
  id:'ROUTE_10C', name:'Route 10 — Frost Ascent 3', width:20, height:38,
  music:'ROUTE_ICE', isIndoor:false, isCave:false,
  tiles: [
    [66,66,66,66,66,66,66,66,66, 0, 0,66,66,66,66,66,66,66,66,66], // 0  top border
    [66, 6, 6, 6, 6, 6, 6, 6, 6, 0, 0, 6, 6, 6, 6, 6, 6, 6, 6,66], // 1  arrival
    [66, 2, 2, 6, 6, 6, 6, 6, 6, 0, 0, 6, 6, 6, 6, 6, 2, 2, 2,66], // 2  grass+ice
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 3  CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 4  CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 5  CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 6  CHOKE (4-row)
    [66, 2, 2, 6, 6, 6, 6, 6, 6, 0, 0, 6, 6, 6, 6, 6, 2, 2, 2,66], // 7  open
    [66, 6, 6, 6, 6, 6, 6, 6, 6, 0, 0, 6, 6, 6, 6, 6, 6, 6, 6,66], // 8  ice
    [66, 6, 6, 6, 6, 6, 6, 6, 6, 0, 0, 6, 6, 6, 6, 6, 6, 6, 6,66], // 9  TRAINER 1 (Kai x:5)
    [66, 2, 6, 6, 6,69, 6, 6, 6, 0, 0, 6, 6, 6,69, 6, 6, 6, 2,66], // 10 rocks
    [66, 2, 2, 6, 6, 6, 6, 6, 6, 0, 0, 6, 6, 6, 6, 6, 2, 2, 2,66], // 11 grass+ice
    [66, 2, 2, 2, 6, 6, 6, 6, 6, 0, 0, 6, 6, 6, 6, 2, 2, 2, 2,66], // 12 dense
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 13 CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 14 CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 15 CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 16 CHOKE (4-row)
    [66, 2, 2, 6, 6, 6, 6, 6, 6, 0, 0, 6, 6, 6, 6, 6, 2, 2, 2,66], // 17 open
    [66, 6, 6, 6, 6,67, 6, 6, 6, 0, 0, 6, 6, 6, 6,67, 6, 6, 6,66], // 18 signs
    [66, 6, 6, 6, 6, 6, 6, 6, 6, 0, 0, 6, 6, 6, 6, 6, 6, 6, 6,66], // 19 RIVAL (x:10)
    [66, 2, 2, 6, 6, 6, 6, 6, 6, 0, 0, 6, 6, 6, 6, 6, 2, 2, 2,66], // 20 grass+ice
    [66, 2, 2, 2, 6, 6, 6, 6, 6, 0, 0, 6, 6, 6, 6, 2, 2, 2, 2,66], // 21 dense
    [66, 2, 2, 2, 2, 6, 6, 6, 6, 0, 0, 6, 6, 6, 2, 2, 2, 2, 2,66], // 22 denser
    [66, 2, 6, 6, 6,69, 6, 6, 6, 0, 0, 6, 6, 6,69, 6, 6, 6, 2,66], // 23 rocks
    [66, 2, 2, 2, 2, 6, 6, 6, 6, 0, 0, 6, 6, 6, 2, 2, 2, 2, 2,66], // 24 denser
    [66, 6, 6, 6, 6, 6, 6, 6, 6, 0, 0, 6, 6, 6, 6, 6, 6, 6, 6,66], // 25 ice
    [66, 6, 6, 6, 6, 6, 6, 6, 6, 0, 0, 6, 6, 6, 6, 6, 6, 6, 6,66], // 26 ice
    [66, 6, 6, 6, 6, 6, 6, 6, 6, 0, 0, 6, 6, 6, 6, 6, 6, 6, 6,66], // 27 TRAINER 2 (Zola x:14)
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 28 CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 29 CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 30 CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 31 CHOKE (4-row)
    [66, 2, 2, 2, 6, 6, 6, 6, 6, 0, 0, 6, 6, 6, 6, 2, 2, 2, 2,66], // 32 dense
    [66, 2, 2, 2, 2, 2, 6, 6, 6, 0, 0, 6, 6, 2, 2, 2, 2, 2, 2,66], // 33 denser
    [66, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2,66], // 34 densest
    [66, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2,66], // 35 densest
    [66, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2,66], // 36 densest
    [66,66,66,66,66,66,66,66,66, 0, 0,66,66,66,66,66,66,66,66,66], // 37 bottom border
  ],
  warps:[
    { x:9,  y:0,  targetMap:'ROUTE_10B', targetX:9,  targetY:36 },
    { x:10, y:0,  targetMap:'ROUTE_10B', targetX:10, targetY:36 },
    { x:9,  y:37, targetMap:'ROUTE_10D', targetX:9,  targetY:1  },
    { x:10, y:37, targetMap:'ROUTE_10D', targetX:10, targetY:1  },
  ],
  npcs:[
    { id:'R10C_TRAINER1', name:'Rook', x:5, y:9, facing:'RIGHT', spriteKey:'NPC_MAN',
      movementType:'STATIONARY', dialogue:['GRUNT_5'], trainerRef:'DRAGONTAMER_ROOK' },
    { id:'R10C_RIVAL', name:'Rival', x:10, y:19, facing:'DOWN', spriteKey:'NPC_RIVAL',
      movementType:'STATIONARY', dialogue:['RIVAL_INTRO'], trainerRef:'ELITE_RIVAL',
      requiresFlag:'BADGE_7', flagToHide:'TRAINER_ELITE_RIVAL_DEFEATED' },
    { id:'R10C_TRAINER2', name:'Vance', x:14, y:27, facing:'LEFT', spriteKey:'NPC_MAN',
      movementType:'STATIONARY', dialogue:['GRUNT_5'], trainerRef:'EXPLORER_VANCE' },
  ],
  encounterTable:{ grass:[
    { speciesId:'SWOOPTER',  minLv:56, maxLv:60, rate:20 },
    { speciesId:'BLIZZHORN', minLv:54, maxLv:59, rate:20 },
    { speciesId:'IRONSCALE', minLv:54, maxLv:58, rate:20 },
    { speciesId:'LAVACLAW',  minLv:55, maxLv:59, rate:20 },
    { speciesId:'FIRECOAL',  minLv:53, maxLv:57, rate:20 },
  ], water:[]},
  events:[],
},

ROUTE_10D: {
  id:'ROUTE_10D', name:'Route 10 — Frost Ascent 4', width:20, height:38,
  music:'ROUTE_ICE', isIndoor:false, isCave:false,
  tiles: [
    [66,66,66,66,66,66,66,66,66, 0, 0,66,66,66,66,66,66,66,66,66], // 0  top border
    [66, 6, 6, 6, 6, 6, 6, 6, 6, 0, 0, 6, 6, 6, 6, 6, 6, 6, 6,66], // 1  arrival
    [66, 2, 2, 6, 6, 6, 6, 6, 6, 0, 0, 6, 6, 6, 6, 6, 2, 2, 2,66], // 2  grass+ice
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 3  CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 4  CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 5  CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 6  CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 7  CHOKE (5-row)
    [66, 2, 2, 6, 6, 6, 6, 6, 6, 0, 0, 6, 6, 6, 6, 6, 2, 2, 2,66], // 8  open
    [66, 6, 6, 6, 6, 6, 6, 6, 6, 0, 0, 6, 6, 6, 6, 6, 6, 6, 6,66], // 9  TRAINER 1 (Zola x:5)
    [66, 2, 6, 6, 6,69, 6, 6, 6, 0, 0, 6, 6, 6,69, 6, 6, 6, 2,66], // 10 rocks
    [66, 2, 2, 6, 6, 6, 6, 6, 6, 0, 0, 6, 6, 6, 6, 6, 2, 2, 2,66], // 11 grass+ice
    [66, 2, 2, 2, 2, 6, 6, 6, 6, 0, 0, 6, 6, 6, 2, 2, 2, 2, 2,66], // 12 denser
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 13 CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 14 CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 15 CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 16 CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 17 CHOKE (5-row)
    [66, 2, 2, 6, 6, 6, 6, 6, 6, 0, 0, 6, 6, 6, 6, 6, 2, 2, 2,66], // 18 open
    [66, 6, 6, 6, 6,67, 6, 6, 6, 0, 0, 6, 6, 6, 6,67, 6, 6, 6,66], // 19 signs
    [66, 2, 2, 6, 6, 6, 6, 6, 6, 0, 0, 6, 6, 6, 6, 6, 2, 2, 2,66], // 20 grass+ice
    [66, 2, 2, 2, 6, 6, 6, 6, 6, 0, 0, 6, 6, 6, 6, 2, 2, 2, 2,66], // 21 dense
    [66, 2, 2, 2, 2, 6, 6, 6, 6, 0, 0, 6, 6, 6, 2, 2, 2, 2, 2,66], // 22 denser
    [66, 2, 6, 6, 6,69, 6, 6, 6, 0, 0, 6, 6, 6,69, 6, 6, 6, 2,66], // 23 rocks
    [66, 2, 2, 2, 2, 2, 6, 6, 6, 0, 0, 6, 6, 2, 2, 2, 2, 2, 2,66], // 24 densest
    [66, 6, 6, 6, 6, 6, 6, 6, 6, 0, 0, 6, 6, 6, 6, 6, 6, 6, 6,66], // 25 ice
    [66, 6, 6, 6, 6, 6, 6, 6, 6, 0, 0, 6, 6, 6, 6, 6, 6, 6, 6,66], // 26 ice
    [66, 6, 6, 6, 6, 6, 6, 6, 6, 0, 0, 6, 6, 6, 6, 6, 6, 6, 6,66], // 27 TRAINER 2 (Kai x:14)
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 28 CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 29 CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 30 CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 31 CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 32 CHOKE (5-row)
    [66, 2, 2, 2, 2, 2, 6, 6, 6, 0, 0, 6, 6, 2, 2, 2, 2, 2, 2,66], // 33 denser
    [66, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2,66], // 34 densest
    [66, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2,66], // 35 densest
    [66, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2,66], // 36 densest
    [66,66,66,66,66,66,66,66,66, 0, 0,66,66,66,66,66,66,66,66,66], // 37 bottom border
  ],
  warps:[
    { x:9,  y:0,  targetMap:'ROUTE_10C', targetX:9,  targetY:36 },
    { x:10, y:0,  targetMap:'ROUTE_10C', targetX:10, targetY:36 },
    { x:9,  y:37, targetMap:'ROUTE_10E', targetX:9,  targetY:1  },
    { x:10, y:37, targetMap:'ROUTE_10E', targetX:10, targetY:1  },
  ],
  npcs:[
    { id:'R10D_TRAINER1', name:'Vance', x:5, y:9, facing:'RIGHT', spriteKey:'NPC_MAN',
      movementType:'STATIONARY', dialogue:['GRUNT_5'], trainerRef:'EXPLORER_VANCE' },
    { id:'R10D_TRAINER2', name:'Rook', x:14, y:27, facing:'LEFT', spriteKey:'NPC_MAN',
      movementType:'STATIONARY', dialogue:['GRUNT_5'], trainerRef:'DRAGONTAMER_ROOK' },
  ],
  encounterTable:{ grass:[
    { speciesId:'SWOOPTER',  minLv:57, maxLv:61, rate:20 },
    { speciesId:'BLIZZHORN', minLv:55, maxLv:60, rate:20 },
    { speciesId:'IRONSCALE', minLv:55, maxLv:59, rate:20 },
    { speciesId:'LAVACLAW',  minLv:56, maxLv:60, rate:20 },
    { speciesId:'FIRECOAL',  minLv:54, maxLv:58, rate:20 },
  ], water:[]},
  events:[],
},

ROUTE_10E: {
  id:'ROUTE_10E', name:'Route 10 — Frost Ascent 5', width:20, height:38,
  music:'ROUTE_ICE', isIndoor:false, isCave:false,
  tiles: [
    [66,66,66,66,66,66,66,66,66, 0, 0,66,66,66,66,66,66,66,66,66], // 0  top border
    [66, 6, 6, 6, 6, 6, 6, 6, 6, 0, 0, 6, 6, 6, 6, 6, 6, 6, 6,66], // 1  arrival
    [66, 2, 2, 6, 6, 6, 6, 6, 6, 0, 0, 6, 6, 6, 6, 6, 2, 2, 2,66], // 2  grass+ice
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 3  CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 4  CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 5  CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 6  CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 7  CHOKE (5-row)
    [66, 2, 2, 6, 6, 6, 6, 6, 6, 0, 0, 6, 6, 6, 6, 6, 2, 2, 2,66], // 8  open
    [66, 6, 6, 6, 6, 6, 6, 6, 6, 0, 0, 6, 6, 6, 6, 6, 6, 6, 6,66], // 9  TRAINER 1 (Kai x:5)
    [66, 2, 6, 6, 6,69, 6, 6, 6, 0, 0, 6, 6, 6,69, 6, 6, 6, 2,66], // 10 rocks
    [66, 2, 2, 6, 6, 6, 6, 6, 6, 0, 0, 6, 6, 6, 6, 6, 2, 2, 2,66], // 11 grass+ice
    [66, 2, 2, 2, 2, 6, 6, 6, 6, 0, 0, 6, 6, 6, 2, 2, 2, 2, 2,66], // 12 denser
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 13 CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 14 CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 15 CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 16 CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 17 CHOKE (5-row)
    [66, 2, 2, 6, 6, 6, 6, 6, 6, 0, 0, 6, 6, 6, 6, 6, 2, 2, 2,66], // 18 open
    [66, 6, 6, 6, 6,67, 6, 6, 6, 0, 0, 6, 6, 6, 6,67, 6, 6, 6,66], // 19 signs
    [66, 2, 2, 6, 6, 6, 6, 6, 6, 0, 0, 6, 6, 6, 6, 6, 2, 2, 2,66], // 20 grass+ice
    [66, 2, 2, 2, 6, 6, 6, 6, 6, 0, 0, 6, 6, 6, 6, 2, 2, 2, 2,66], // 21 dense
    [66, 2, 2, 2, 2, 6, 6, 6, 6, 0, 0, 6, 6, 6, 2, 2, 2, 2, 2,66], // 22 denser
    [66, 2, 6, 6, 6,69, 6, 6, 6, 0, 0, 6, 6, 6,69, 6, 6, 6, 2,66], // 23 rocks
    [66, 2, 2, 2, 2, 2, 6, 6, 6, 0, 0, 6, 6, 2, 2, 2, 2, 2, 2,66], // 24 densest
    [66, 6, 6, 6, 6, 6, 6, 6, 6, 0, 0, 6, 6, 6, 6, 6, 6, 6, 6,66], // 25 ice
    [66, 6, 6, 6, 6, 6, 6, 6, 6, 0, 0, 6, 6, 6, 6, 6, 6, 6, 6,66], // 26 ice
    [66, 6, 6, 6, 6, 6, 6, 6, 6, 0, 0, 6, 6, 6, 6, 6, 6, 6, 6,66], // 27 TRAINER 2 (Zola x:14)
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 28 CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 29 CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 30 CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 31 CHOKE
    [66,66,66,66,66,66,66,66,66, 2, 2,66,66,66,66,66,66,66,66,66], // 32 CHOKE (5-row)
    [66, 2, 2, 2, 2, 2, 6, 6, 6, 0, 0, 6, 6, 2, 2, 2, 2, 2, 2,66], // 33 denser
    [66, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2,66], // 34 densest
    [66, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2,66], // 35 densest
    [66, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2,66], // 36 densest
    [66,66,66,66,66,66,66,66,66, 0, 0,66,66,66,66,66,66,66,66,66], // 37 bottom border
  ],
  warps:[
    { x:9,  y:0,  targetMap:'ROUTE_10D', targetX:9,  targetY:36 },
    { x:10, y:0,  targetMap:'ROUTE_10D', targetX:10, targetY:36 },
    { x:9,  y:37, targetMap:'APEXSUMMIT', targetX:9,  targetY:13 },
    { x:10, y:37, targetMap:'APEXSUMMIT', targetX:10, targetY:13 },
  ],
  npcs:[
    { id:'R10E_TRAINER1', name:'Rook', x:5, y:9, facing:'RIGHT', spriteKey:'NPC_MAN',
      movementType:'STATIONARY', dialogue:['GRUNT_5'], trainerRef:'DRAGONTAMER_ROOK' },
    { id:'R10E_TRAINER2', name:'Vance', x:14, y:27, facing:'LEFT', spriteKey:'NPC_MAN',
      movementType:'STATIONARY', dialogue:['GRUNT_5'], trainerRef:'EXPLORER_VANCE' },
  ],
  encounterTable:{ grass:[
    { speciesId:'SWOOPTER',  minLv:58, maxLv:62, rate:20 },
    { speciesId:'BLIZZHORN', minLv:56, maxLv:61, rate:20 },
    { speciesId:'IRONSCALE', minLv:56, maxLv:60, rate:20 },
    { speciesId:'LAVACLAW',  minLv:57, maxLv:61, rate:20 },
    { speciesId:'FIRECOAL',  minLv:55, maxLv:59, rate:20 },
  ], water:[]},
  events:[],
},

// ─────────────────────────────────────────────────────────────
// SPECIAL AREAS
// ─────────────────────────────────────────────────────────────

GLACIAL_PASS: {
  id:'GLACIAL_PASS', name:'Glacial Pass', width:20, height:15,
  music:'CAVE_ICE', isIndoor:false, isCave:true,
  tiles: [
    [72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72],
    [72, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,72],
    [72, 6, 6, 6, 6, 6, 6,72,72, 6, 6,72,72, 6, 6, 6, 6, 6, 6,72],
    [72, 6, 6, 6, 6, 6,72,72,72, 6, 6,72,72,72, 6, 6, 6, 6, 6,72],
    [72, 6, 6, 6, 6,72,72,72,72, 6, 6,72,72,72,72, 6, 6, 6, 6,72],
    [72, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,72],
    [72, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,72],
    [72, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,72],
    [72, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,72],
    [72, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,72],
    [72, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,72],
    [72, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,72],
    [72, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,72],
    [72, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,72],
    [72,72,72,72,72,72,72,72,72,68,68,72,72,72,72,72,72,72,72,72],
  ],
  warps:[
    { x:9,  y:14, targetMap:'ROUTE_9C', targetX:2, targetY:18 },
    { x:10, y:14, targetMap:'ROUTE_9C', targetX:2, targetY:18 },
  ],
  npcs:[
    { id:'GLACIAL_TRAINER', name:'Ice Sage', x:5, y:7, facing:'RIGHT', spriteKey:'NPC_MAN',
      movementType:'STATIONARY', dialogue:['GRUNT_5'], trainerRef:'RANGER_DEX' },
  ],
  encounterTable:{ grass:[
    { speciesId:'ICECAP',      minLv:40, maxLv:45, rate:35 },
    { speciesId:'POLARCROWN',  minLv:42, maxLv:47, rate:30 },
    { speciesId:'CRYOPHIN',    minLv:38, maxLv:42, rate:35 },
  ], water:[
    { speciesId:'GLACIODON',   minLv:50, maxLv:50, rate:1 },
    { speciesId:'POLARCROWN',  minLv:44, maxLv:48, rate:99 },
  ]},
  events:[
    { id:'EVT_GLACIODON', triggerType:'TILE', x:10, y:7, flagRequired:null, flagSet:'GLACIODON_AVAILABLE', scriptId:'GLACIODON_ENCOUNTER' },
  ],
},

MT_CRETACEOUS: {
  id:'MT_CRETACEOUS', name:'Mt. Cretaceous', width:20, height:15,
  music:'CAVE_DRAMATIC', isIndoor:false, isCave:true,
  tiles: [
    [72,72,72,72,72,72,72,72,72, 0, 0,72,72,72,72,72,72,72,72,72],
    [72, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,72],
    [72, 5, 5, 5, 5, 5, 5,72,72, 5, 5,72,72, 5, 5, 5, 5, 5, 5,72],
    [72, 5, 5, 7, 5, 5,72,72,72, 5, 5,72,72,72, 5, 5, 7, 5, 5,72],
    [72, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,72],
    [72, 5, 5, 5, 5, 5, 5,72,72, 5, 5,72,72, 5, 5, 5, 5, 5, 5,72],
    [72, 5, 7, 7, 5, 5,72,72,72, 5, 5,72,72,72, 5, 5, 7, 7, 5,72],
    [72, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,72],
    [72, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,72],
    [72, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,72],
    [72, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,72],
    [72, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,72],
    [72, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,72],
    [72, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,72],
    [72,72,72,72,72,72,72,72,72,68,68,72,72,72,72,72,72,72,72,72],
  ],
  warps:[
    { x:9,  y:14, targetMap:'ROUTE_9C', targetX:2, targetY:18 },
    { x:10, y:14, targetMap:'ROUTE_9C', targetX:2, targetY:18 },
    { x:9,  y:0,  targetMap:'DIRECTOR_CLADE_CHAMBER', targetX:9, targetY:13, requiresFlag:'TRAINER_CMD_CRETACEOUS_DEFEATED' },
  ],
  npcs:[
    { id:'MT_BOSS_CMD_C', name:'Commander Cretaceous', x:10, y:5, facing:'DOWN', spriteKey:'NPC_GRUNT',
      movementType:'STATIONARY', dialogue:['CMD_CRETACEOUS_1'], trainerRef:'CMD_CRETACEOUS',
      flagToHide:'TRAINER_CMD_CRETACEOUS_DEFEATED' },
    { id:'FLINT_MT', name:'Flint', x:10, y:10, facing:'UP', spriteKey:'NPC_RIVAL',
      movementType:'STATIONARY', dialogue:['RIVAL_PRE_5'], onInteract:'TRIGGER_RIVAL',
      trainerRef:'RIVAL_5_FIRE', flagToHide:'RIVAL_BATTLE_5_DONE' },
  ],
  encounterTable:{ grass:[
    // Mt. Cretaceous — active volcano. Fire types dominant; dark/rock in caves.
    { speciesId:'LAVACLAW',  minLv:56, maxLv:61, rate:30 },
    { speciesId:'MAGMADON',  minLv:57, maxLv:62, rate:25 },
    { speciesId:'MEGASTONE', minLv:55, maxLv:60, rate:25 },
    { speciesId:'DARKSCALE', minLv:55, maxLv:58, rate:20 },
  ], water:[]},
  events:[],
},

DIRECTOR_CLADE_CHAMBER: {
  id:'DIRECTOR_CLADE_CHAMBER', name:'Permian Core Chamber', width:20, height:12,
  music:'BOSS_THEME', isIndoor:true, isCave:true,
  tiles: [
    [72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72],
    [72, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,72],
    [72, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,72],
    [72, 5, 5,73, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,73, 5, 5,72],
    [72, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,72],
    [72, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,72],
    [72, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,72],
    [72, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,72],
    [72, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,72],
    [72, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,72],
    [72, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,72],
    [72,72,72,72,72,72,72,72,72,68,68,72,72,72,72,72,72,72,72,72],
  ],
  warps:[{ x:9, y:11, targetMap:'MT_CRETACEOUS', targetX:9, targetY:1 }],
  npcs:[
    { id:'DIRECTOR_CLADE', name:'Director Clade', x:10, y:3, facing:'DOWN', spriteKey:'NPC_LEADER',
      movementType:'STATIONARY', dialogue:['DIRECTOR_CLADE_1'], onInteract:'TRIGGER_FINAL_BOSS',
      trainerRef:'DIRECTOR_CLADE', flagToHide:'DIRECTOR_CLADE_DEFEATED' },
    { id:'MT_CRATERON_SAGE', name:'Fossil Warden', x:10, y:7, facing:'UP', spriteKey:'NPC_PROF',
      movementType:'STATIONARY', dialogue:['CRATERON_LEGEND'],
      onInteract:'TRIGGER_CRATERON', requiresFlag:'DIRECTOR_CLADE_DEFEATED',
      flagToHide:'CRATERON_CAUGHT' },
  ],
  encounterTable:{ grass:[], water:[] },
  events:[
    { id:'EVT_CLADE', triggerType:'AUTO', x:null, y:null, flagRequired:null, flagSet:null, scriptId:'CLADE_INTRO_CUTSCENE' },
  ],
},

FOSSIL_GATEWAY: {
  id:'FOSSIL_GATEWAY', name:'Fossil Citadel — Gateway', width:20, height:10,
  music:'GYM_THEME', isIndoor:false, isCave:false,
  tiles:[
    [66,66,66,66,66,66,66,66,66,68,68,66,66,66,66,66,66,66,66,66],
    [66, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,66],
    [66, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,66],
    [66, 0, 0,73, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,73, 0, 0, 0,66],
    [66, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,66],
    [66, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,66],
    [66, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,66],
    [66, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,66],
    [66, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,66],
    [66,66,66,66,66,66,66,66,66, 0, 0,66,66,66,66,66,66,66,66,66],
  ],
  warps:[
    { x:9,  y:0, targetMap:'FOSSIL_CITADEL', targetX:9, targetY:13 },
    { x:10, y:0, targetMap:'FOSSIL_CITADEL', targetX:10,targetY:13 },
    { x:9,  y:9, targetMap:'APEXSUMMIT',     targetX:9, targetY:2  },
    { x:10, y:9, targetMap:'APEXSUMMIT',     targetX:10,targetY:2  },
  ],
  npcs:[
    { id:'GATE_WARDEN', name:'Gate Warden', x:9, y:3, facing:'DOWN', spriteKey:'NPC_MAN',
      movementType:'STATIONARY',
      dialogue:['FOSSIL_GATE_BLOCKED'], onInteract:'TRIGGER_STORY',
      requiresFlag:null, flagToHide:'BADGE_8' },
    { id:'GATE_WARDEN_OPEN', name:'Gate Warden', x:9, y:3, facing:'DOWN', spriteKey:'NPC_MAN',
      movementType:'STATIONARY',
      dialogue:['FOSSIL_GATE_OPEN'], onInteract:'TRIGGER_STORY',
      requiresFlag:'BADGE_8' },
  ],
  encounterTable:{ grass:[], water:[] }, events:[],
},

FOSSIL_CITADEL: {
  id:'FOSSIL_CITADEL', name:'Fossil Citadel', width:20, height:20,
  music:'GYM_THEME', isIndoor:true, isCave:false,
  tiles:[
    // y=0: Top wall
    [65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65],
    // y=1: Champion hall — Elite statues flanking (Aurora left, Ember right)
    [65, 9, 9,77, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9,77, 9, 9,65],
    // y=2: Champion floor — Corvus stands at x=10 (gold medallion floor, fully open)
    [65, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9,65],
    // y=3: Champion approach — Garnet/Phantom statues + gate keeper at x=5
    [65, 9,77, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9,77, 9, 9,65],
    // y=4: Divider wall (gap at x=9,10)
    [65,65,65,65,65,65,65,65,65, 9, 9,65,65,65,65,65,65,65,65,65],
    // y=5: Phantom's chamber — swamp floor, Phantom at x=10
    [65, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,65],
    // y=6: Phantom's chamber — shadow statues at corners
    [65, 8,77, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,77, 8, 8,65],
    // y=7: Divider wall (gap at x=9,10)
    [65,65,65,65,65,65,65,65,65, 8, 8,65,65,65,65,65,65,65,65,65],
    // y=8: Garnet's chamber — earth floor, Garnet at x=10
    [65, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,65],
    // y=9: Garnet's chamber — fossil statues, layered earth
    [65, 5,77, 5, 4, 5, 4, 5, 4, 5, 4, 5, 4, 5, 4, 5,77, 5, 5,65],
    // y=10: Divider wall (gap at x=9,10)
    [65,65,65,65,65,65,65,65,65, 4, 4,65,65,65,65,65,65,65,65,65],
    // y=11: Ember's chamber — safe floor path, Ember at x=10
    [65, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,65],
    // y=12: Ember's chamber — lava floor with fire statues at corners
    [65, 7,77, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,77, 7, 7,65],
    // y=13: Healer antechamber — cave wall balie, open center
    [65, 0,74,74,74,74,74,74,74, 0, 0,74,74,74,74,74,74,74, 0,65],
    // y=14: Aurora's chamber — ice floor, Aurora at x=10
    [65, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,65],
    // y=15: Aurora's chamber — ice+water mix, ice statues at corners
    [65, 6,77, 6, 3, 6, 6, 6, 6, 6, 6, 6, 6, 6, 3, 6,77, 6, 6,65],
    // y=16: Grand pillar row — 4 trophy pillars
    [65, 0,77, 0, 0,77, 0, 0, 0, 0, 0, 0, 0,77, 0, 0,77, 0, 0,65],
    // y=17: Entry hall — grand marble floor
    [65, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,65],
    // y=18: Entry hall — entrance trophies at flanks
    [65, 0,77, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,77, 0,65],
    // y=19: South door
    [65,65,65,65,65,65,65,65,65,68,68,65,65,65,65,65,65,65,65,65],
  ],
  warps:[
    { x:9,  y:19, targetMap:'FOSSIL_GATEWAY', targetX:9,  targetY:8 },
    { x:10, y:19, targetMap:'FOSSIL_GATEWAY', targetX:10, targetY:8 },
  ],
  npcs:[
    // ── Champion (requires all 4 Elite Four defeated) ──
    { id:'GRAND_ARCHON', name:'Grand Archon Corvus', x:10, y:2, facing:'DOWN',
      spriteKey:'NPC_LEADER', movementType:'STATIONARY',
      dialogue:['GRAND_ARCHON_PRE'], onInteract:'TRIGGER_CHAMPION',
      trainerRef:'GRAND_ARCHON_CORVUS',
      requiresFlag:'ELITE_4_DONE',
      flagToHide:'TRAINER_GRAND_ARCHON_CORVUS_DEFEATED' },
    { id:'GRAND_ARCHON_DONE', name:'Grand Archon Corvus', x:10, y:2, facing:'DOWN',
      spriteKey:'NPC_LEADER', movementType:'STATIONARY',
      dialogue:['GRAND_ARCHON_WIN'], onInteract:'TRIGGER_CHAMPION',
      trainerRef:'GRAND_ARCHON_CORVUS',
      requiresFlag:'TRAINER_GRAND_ARCHON_CORVUS_DEFEATED' },
    { id:'CHAMPION_GATE_NPC', name:'Gate Keeper', x:5, y:3, facing:'RIGHT',
      spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:["The Champion awaits beyond. Defeat all four Elite Four first!"],
      flagToHide:'ELITE_4_DONE', onInteract:null },
    // ── Elite Four: Phantom (4th) — requires Elite 3 done ──
    { id:'ELITE_PHANTOM_NPC', name:'Phantom', x:10, y:5, facing:'DOWN',
      spriteKey:'NPC_LEADER', movementType:'STATIONARY',
      dialogue:['Beyond this veil lies the Champion. But first... face your shadow.'],
      trainerRef:'ELITE_PHANTOM',
      requiresFlag:'ELITE_3_DONE',
      flagToHide:'TRAINER_ELITE_PHANTOM_DEFEATED' },
    { id:'ELITE_PHANTOM_DONE', name:'Phantom', x:10, y:5, facing:'DOWN',
      spriteKey:'NPC_LEADER', movementType:'STATIONARY',
      dialogue:["You walk in the light of the Champion's hall now. Go."],
      requiresFlag:'TRAINER_ELITE_PHANTOM_DEFEATED' },
    // ── Elite Four: Garnet (3rd) — requires Elite 2 done ──
    { id:'ELITE_GARNET_NPC', name:'Garnet', x:10, y:8, facing:'DOWN',
      spriteKey:'NPC_LEADER', movementType:'STATIONARY',
      dialogue:['Deep beneath stone and time, I wait. Prove you are worthy of the Summit.'],
      trainerRef:'ELITE_GARNET',
      requiresFlag:'ELITE_2_DONE',
      flagToHide:'TRAINER_ELITE_GARNET_DEFEATED' },
    { id:'ELITE_GARNET_DONE', name:'Garnet', x:10, y:8, facing:'DOWN',
      spriteKey:'NPC_LEADER', movementType:'STATIONARY',
      dialogue:["The deep earth bows to you. Phantom awaits beyond the next divide."],
      requiresFlag:'TRAINER_ELITE_GARNET_DEFEATED' },
    // ── Elite Four: Ember (2nd) — requires Elite 1 done ──
    { id:'ELITE_EMBER_NPC', name:'Ember', x:10, y:11, facing:'DOWN',
      spriteKey:'NPC_LEADER', movementType:'STATIONARY',
      dialogue:['You carry the heat of determination. But my flames burn hotter!'],
      trainerRef:'ELITE_EMBER',
      requiresFlag:'ELITE_1_DONE',
      flagToHide:'TRAINER_ELITE_EMBER_DEFEATED' },
    { id:'ELITE_EMBER_DONE', name:'Ember', x:10, y:11, facing:'DOWN',
      spriteKey:'NPC_LEADER', movementType:'STATIONARY',
      dialogue:["Your flame surpassed mine. Terra, the earth-shaker, is next."],
      requiresFlag:'TRAINER_ELITE_EMBER_DEFEATED' },
    // ── Citadel Healer (row 13) ──
    { id:'CITADEL_HEALER', name:'Citadel Nurse', x:10, y:13, facing:'DOWN',
      spriteKey:'NPC_HEALER', movementType:'STATIONARY',
      dialogue:['HEALER_FOSSIL'], onInteract:'HEAL_PARTY' },
    // ── Elite Four: Aurora (1st) — always accessible ──
    { id:'ELITE_AURORA_NPC', name:'Aurora', x:10, y:14, facing:'DOWN',
      spriteKey:'NPC_LEADER', movementType:'STATIONARY',
      dialogue:['The waters of time run deep... and cold. Can you survive their current?'],
      trainerRef:'ELITE_AURORA',
      flagToHide:'TRAINER_ELITE_AURORA_DEFEATED' },
    { id:'ELITE_AURORA_DONE', name:'Aurora', x:10, y:14, facing:'DOWN',
      spriteKey:'NPC_LEADER', movementType:'STATIONARY',
      dialogue:["The current bends to your will. Ember, the flame-master, awaits above."],
      requiresFlag:'TRAINER_ELITE_AURORA_DEFEATED' },
    // ── Ambient NPCs ──
    { id:'CITADEL_NPC1', name:'Veteran Trainer', x:3, y:17, facing:'RIGHT',
      spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:['FOSSIL_CITADEL_AMBIENCE'], onInteract:null },
    { id:'CITADEL_NPC2', name:'Scholar', x:16, y:17, facing:'LEFT',
      spriteKey:'NPC_PROF', movementType:'STATIONARY',
      dialogue:['FOSSIL_CITADEL_AMBIENCE'], onInteract:null },
  ],
  encounterTable:{ grass:[], water:[] },
  events:[],
},

// ─────────────────────────────────────────────────────────────
// WILD TRAINING ZONES (Feature 1)
// ─────────────────────────────────────────────────────────────

SHELLCREEK_WILD: {
  id:'SHELLCREEK_WILD', name:'Shellcreek Coastal Area', width:16, height:14,
  music:'ROUTE_CALM', isIndoor:false, isCave:false,
  tiles: [
    [71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71],
    [71, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,71],
    [71, 3, 3, 3, 2, 2, 2, 3, 3, 2, 2, 2, 3, 3, 3,71],
    [71, 3, 2, 2, 2, 2, 2, 2, 3, 2, 2, 2, 2, 2, 3,71],
    [71, 3, 2, 1, 1, 1, 2, 2, 3, 2, 1, 1, 2, 2, 3,71],
    [71, 3, 2, 1, 0, 0, 1, 2, 3, 2, 1, 0, 1, 2, 3,71],
    [ 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 3,71],
    [ 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 3,71],
    [71, 3, 2, 1, 0, 0, 1, 2, 2, 2, 1, 0, 1, 2, 3,71],
    [71, 3, 2, 1, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 3,71],
    [71, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3,71],
    [71, 3, 3, 2, 2, 2, 3, 3, 3, 3, 2, 2, 2, 3, 3,71],
    [71, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,71],
    [71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71],
  ],
  warps:[
    { x:0, y:6, targetMap:'SHELLCREEK_CITY', targetX:18, targetY:11 },
    { x:0, y:7, targetMap:'SHELLCREEK_CITY', targetX:18, targetY:12 },
  ],
  npcs:[
    { id:'SCW_SIGN', name:'Sign', x:3, y:5, facing:'DOWN', spriteKey:'NPC_MAN',
      movementType:'STATIONARY',
      dialogue:["Shellcreek Coastal Area", "Normal and Ground-type DinoMons roam these fields!"],
      onInteract:null },
  ],
  encounterTable:{ grass:[
    { speciesId:'NORMLET',  minLv:7,  maxLv:10, rate:35 },
    { speciesId:'SANDCLAW', minLv:7,  maxLv:10, rate:30 },
    { speciesId:'SOARWING', minLv:7,  maxLv:10, rate:25 },
    { speciesId:'BUGLING',  minLv:7,  maxLv:10, rate:10 },
  ], water:[
    { speciesId:'MUDFIN',   minLv:7,  maxLv:10, rate:55 },
    { speciesId:'MARSHFIN', minLv:7,  maxLv:10, rate:45 },
  ]},
  events:[],
},

DUSTWALL_WILD: {
  id:'DUSTWALL_WILD', name:'Dustwall Rocky Scrubland', width:16, height:14,
  music:'ROUTE_DESERT', isIndoor:false, isCave:false,
  tiles: [
    [66,66,66,66,66,66,66,66,66,66,66,66,66,66,66,66],
    [66, 7, 7, 4, 4, 4, 4, 7, 7, 4, 4, 4, 4, 7, 7,66],
    [66, 7, 4, 4, 2, 2, 4, 4, 7, 4, 2, 2, 4, 4, 7,66],
    [66, 4, 4, 2, 2, 2, 2, 4, 4, 2, 2, 2, 2, 4, 4,66],
    [66, 4, 2, 2, 4, 4, 2, 2, 2, 2, 4, 4, 2, 2, 4,66],
    [66, 4, 2, 4, 0, 0, 4, 2, 2, 4, 0, 0, 4, 2, 4,66],
    [ 0, 0, 0, 0, 0, 0, 4, 2, 4, 4, 0, 0, 4, 2, 4,66],
    [ 0, 0, 0, 0, 0, 0, 4, 2, 4, 4, 0, 0, 4, 2, 4,66],
    [66, 4, 2, 4, 0, 0, 4, 2, 2, 4, 0, 0, 4, 2, 4,66],
    [66, 4, 2, 2, 4, 4, 2, 2, 2, 2, 4, 4, 2, 2, 4,66],
    [66, 4, 4, 2, 2, 2, 2, 4, 4, 2, 2, 2, 2, 4, 4,66],
    [66, 7, 4, 4, 2, 2, 4, 4, 7, 4, 2, 2, 4, 4, 7,66],
    [66, 7, 7, 4, 4, 4, 4, 7, 7, 4, 4, 4, 4, 7, 7,66],
    [66,66,66,66,66,66,66,66,66,66,66,66,66,66,66,66],
  ],
  warps:[
    { x:0, y:6, targetMap:'DUSTWALL_TOWN', targetX:18, targetY:11 },
    { x:0, y:7, targetMap:'DUSTWALL_TOWN', targetX:18, targetY:12 },
  ],
  npcs:[
    { id:'DWW_SIGN', name:'Sign', x:4, y:5, facing:'DOWN', spriteKey:'NPC_MAN',
      movementType:'STATIONARY',
      dialogue:["Dustwall Rocky Scrubland", "Rock and Ground DinoMons roam these badlands."],
      onInteract:null },
  ],
  encounterTable:{ grass:[
    { speciesId:'SANDCLAW',   minLv:14, maxLv:18, rate:30 },
    { speciesId:'TUNNELDON',  minLv:15, maxLv:19, rate:25 },
    { speciesId:'DESERTFANG', minLv:14, maxLv:18, rate:25 },
    { speciesId:'BONEBACK',   minLv:15, maxLv:18, rate:20 },
  ], water:[]},
  events:[],
},

PYRESIDE_WILD: {
  id:'PYRESIDE_WILD', name:'Pyreside Volcanic Field', width:16, height:14,
  music:'TOWN_INDUSTRIAL', isIndoor:false, isCave:false,
  tiles: [
    [66,66,66,66,66,66,66,66,66,66,66,66,66,66,66,66],
    [66, 7, 7, 0, 0, 7, 7, 0, 0, 7, 7, 0, 0, 7, 7,66],
    [66, 7, 0, 0, 2, 2, 0, 0, 0, 0, 2, 2, 0, 0, 7,66],
    [66, 0, 0, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 0, 0,66],
    [66, 0, 2, 2, 0, 0, 2, 2, 2, 2, 0, 0, 2, 2, 0,66],
    [66, 0, 2, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 2, 0,66],
    [ 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0,66],
    [ 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0,66],
    [66, 0, 2, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 2, 0,66],
    [66, 0, 2, 2, 0, 0, 2, 2, 2, 2, 0, 0, 2, 2, 0,66],
    [66, 0, 0, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 0, 0,66],
    [66, 7, 0, 0, 2, 2, 0, 0, 0, 0, 2, 2, 0, 0, 7,66],
    [66, 7, 7, 0, 0, 7, 7, 0, 0, 7, 7, 0, 0, 7, 7,66],
    [66,66,66,66,66,66,66,66,66,66,66,66,66,66,66,66],
  ],
  warps:[
    { x:0, y:6, targetMap:'PYRESIDE_CITY', targetX:18, targetY:11 },
    { x:0, y:7, targetMap:'PYRESIDE_CITY', targetX:18, targetY:12 },
  ],
  npcs:[
    { id:'PYW_SIGN', name:'Sign', x:4, y:5, facing:'DOWN', spriteKey:'NPC_MAN',
      movementType:'STATIONARY',
      dialogue:["Pyreside Volcanic Field", "Fire and Rock types thrive in the volcanic heat here."],
      onInteract:null },
  ],
  encounterTable:{ grass:[
    { speciesId:'EMBRIX',   minLv:22, maxLv:26, rate:35 },
    { speciesId:'FIRECOAL', minLv:22, maxLv:26, rate:35 },
    { speciesId:'ROCKLETT', minLv:21, maxLv:25, rate:30 },
  ], water:[]},
  events:[],
},

STONEHAVEN_WILD: {
  id:'STONEHAVEN_WILD', name:'Stonehaven Mountain Footpath', width:16, height:14,
  music:'ROUTE_ROCKY', isIndoor:false, isCave:true,
  tiles: [
    [72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72],
    [72, 7, 7, 0, 0, 0, 7, 7, 7, 0, 0, 0, 7, 7, 7,72],
    [72, 7, 0, 0, 2, 0, 0, 7, 7, 0, 2, 0, 0, 7, 7,72],
    [72, 0, 0, 2, 2, 2, 0, 0, 0, 2, 2, 2, 0, 0, 7,72],
    [72, 0, 2, 2, 0, 2, 2, 0, 2, 2, 0, 2, 2, 0, 0,72],
    [72, 0, 2, 0, 0, 0, 2, 0, 2, 0, 0, 0, 2, 0, 0,72],
    [ 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0,72],
    [ 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0,72],
    [72, 0, 2, 0, 0, 0, 2, 0, 2, 0, 0, 0, 2, 0, 0,72],
    [72, 0, 2, 2, 0, 2, 2, 0, 2, 2, 0, 2, 2, 0, 0,72],
    [72, 0, 0, 2, 2, 2, 0, 0, 0, 2, 2, 2, 0, 0, 7,72],
    [72, 7, 0, 0, 2, 0, 0, 7, 7, 0, 2, 0, 0, 7, 7,72],
    [72, 7, 7, 0, 0, 0, 7, 7, 7, 0, 0, 0, 7, 7, 7,72],
    [72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72],
  ],
  warps:[
    { x:0, y:6, targetMap:'STONEHAVEN_CITY', targetX:18, targetY:11 },
    { x:0, y:7, targetMap:'STONEHAVEN_CITY', targetX:18, targetY:12 },
  ],
  npcs:[
    { id:'SHW_SIGN', name:'Sign', x:4, y:5, facing:'DOWN', spriteKey:'NPC_MAN',
      movementType:'STATIONARY',
      dialogue:["Stonehaven Mountain Footpath", "Rock, Fighting and Ground types hide in these crags."],
      onInteract:null },
  ],
  encounterTable:{ cave:[
    { speciesId:'FIGHTCLAW', minLv:34, maxLv:38, rate:30 },
    { speciesId:'TUNNELDON', minLv:33, maxLv:37, rate:35 },
    { speciesId:'STEELBACK', minLv:33, maxLv:37, rate:35 },
  ], grass:[], water:[]},
  events:[],
},

};

// ── Wild training zones for mid-to-late game cities ──────────
DG.MAPS.FERNGROVE_WILD = {
  id:'FERNGROVE_WILD', name:'Ferngrove Forest Clearing', width:16, height:14,
  music:'ROUTE_FOREST', isIndoor:false, isCave:false,
  tiles: [
    [64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64],
    [64, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,64],
    [64, 2, 2, 2, 1, 1, 1, 2, 2, 1, 1, 1, 2, 2, 2,64],
    [64, 2, 2, 1, 1, 9, 1, 1, 1, 1, 9, 1, 1, 2, 2,64],
    [64, 2, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 2,64],
    [64, 2, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 2,64],
    [ 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0,64],
    [ 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0,64],
    [64, 2, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 2,64],
    [64, 2, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 2,64],
    [64, 2, 2, 1, 1, 9, 1, 1, 1, 1, 9, 1, 1, 2, 2,64],
    [64, 2, 2, 2, 1, 1, 1, 2, 2, 1, 1, 1, 2, 2, 2,64],
    [64, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,64],
    [64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64],
  ],
  warps:[
    { x:0, y:6, targetMap:'FERNGROVE_TOWN', targetX:12, targetY:5 },
    { x:0, y:7, targetMap:'FERNGROVE_TOWN', targetX:12, targetY:6 },
  ],
  npcs:[
    { id:'FNW_SIGN', name:'Sign', x:4, y:5, facing:'DOWN', spriteKey:'NPC_MAN',
      movementType:'STATIONARY',
      dialogue:["Ferngrove Forest Clearing", "Grass types flourish in this sunlit glade."],
      onInteract:null },
  ],
  encounterTable:{ grass:[
    { speciesId:'FRONDLET', minLv:27, maxLv:30, rate:40 },
    { speciesId:'BUGLING',  minLv:26, maxLv:29, rate:35 },
    { speciesId:'SOARWING', minLv:27, maxLv:30, rate:25 },
  ], water:[]},
  events:[],
};

DG.MAPS.CRESTFALL_WILD = {
  id:'CRESTFALL_WILD', name:'Crestfall Highland', width:16, height:14,
  music:'ROUTE_MYSTICAL', isIndoor:false, isCave:false,
  tiles: [
    [64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64],
    [64, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,64],
    [64, 2, 2, 2, 1, 1, 1, 2, 2, 1, 1, 1, 2, 2, 2,64],
    [64, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2,64],
    [64, 2, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 2,64],
    [64, 2, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 2,64],
    [ 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0,64],
    [ 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0,64],
    [64, 2, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 2,64],
    [64, 2, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 2,64],
    [64, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2,64],
    [64, 2, 2, 2, 1, 1, 1, 2, 2, 1, 1, 1, 2, 2, 2,64],
    [64, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,64],
    [64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64],
  ],
  warps:[
    { x:0, y:6, targetMap:'CRESTFALL_TOWN', targetX:12, targetY:5 },
    { x:0, y:7, targetMap:'CRESTFALL_TOWN', targetX:12, targetY:6 },
  ],
  npcs:[
    { id:'CFW_SIGN', name:'Sign', x:4, y:5, facing:'DOWN', spriteKey:'NPC_MAN',
      movementType:'STATIONARY',
      dialogue:["Crestfall Highland", "Electric and Flying types thrive in these windy highlands."],
      onInteract:null },
  ],
  encounterTable:{ grass:[
    { speciesId:'SPARKHORN', minLv:38, maxLv:42, rate:35 },
    { speciesId:'STORMWING', minLv:38, maxLv:43, rate:35 },
    { speciesId:'GLIDEREX',  minLv:40, maxLv:44, rate:30 },
  ], water:[]},
  events:[],
};

DG.MAPS.BOGMIRE_WILD = {
  id:'BOGMIRE_WILD', name:'Bogmire Swamp', width:16, height:14,
  music:'ROUTE_SWAMP', isIndoor:false, isCave:false,
  tiles: [
    [64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64],
    [64, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,64],
    [64, 8, 8, 8, 2, 2, 2, 8, 8, 2, 2, 2, 8, 8, 8,64],
    [64, 8, 8, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 8, 8,64],
    [64, 8, 2, 2, 0, 0, 2, 2, 2, 2, 0, 0, 2, 2, 8,64],
    [64, 8, 2, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 2, 8,64],
    [ 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0,64],
    [ 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0,64],
    [64, 8, 2, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 2, 8,64],
    [64, 8, 2, 2, 0, 0, 2, 2, 2, 2, 0, 0, 2, 2, 8,64],
    [64, 8, 8, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 8, 8,64],
    [64, 8, 8, 8, 2, 2, 2, 8, 8, 2, 2, 2, 8, 8, 8,64],
    [64, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,64],
    [64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64],
  ],
  warps:[
    { x:0, y:6, targetMap:'BOGMIRE_CITY', targetX:12, targetY:5 },
    { x:0, y:7, targetMap:'BOGMIRE_CITY', targetX:12, targetY:6 },
  ],
  npcs:[
    { id:'BGW_SIGN', name:'Sign', x:4, y:5, facing:'DOWN', spriteKey:'NPC_MAN',
      movementType:'STATIONARY',
      dialogue:["Bogmire Swamp", "Water and Poison types lurk in the murky depths."],
      onInteract:null },
  ],
  encounterTable:{ grass:[
    { speciesId:'MUDFIN',   minLv:45, maxLv:49, rate:35 },
    { speciesId:'MARSHFIN', minLv:44, maxLv:48, rate:35 },
    { speciesId:'BOGZILLA', minLv:47, maxLv:51, rate:30 },
  ], water:[]},
  events:[],
};

DG.MAPS.APEXSUMMIT_WILD = {
  id:'APEXSUMMIT_WILD', name:'Apex Summit Cavern', width:16, height:14,
  music:'CAVE_DRAMATIC', isIndoor:false, isCave:true,
  tiles: [
    [72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72],
    [72, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,72],
    [72, 6, 6, 6, 0, 0, 0, 6, 6, 0, 0, 0, 6, 6, 6,72],
    [72, 6, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6,72],
    [72, 6, 0, 0, 0, 0, 0, 6, 6, 0, 0, 0, 0, 0, 6,72],
    [72, 6, 0, 0, 0, 0, 0, 6, 6, 0, 0, 0, 0, 0, 6,72],
    [ 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0,72],
    [ 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0,72],
    [72, 6, 0, 0, 0, 0, 0, 6, 6, 0, 0, 0, 0, 0, 6,72],
    [72, 6, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6,72],
    [72, 6, 6, 6, 0, 0, 0, 6, 6, 0, 0, 0, 6, 6, 6,72],
    [72, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,72],
    [72, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,72],
    [72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72],
  ],
  warps:[
    { x:0, y:6, targetMap:'APEXSUMMIT', targetX:12, targetY:5 },
    { x:0, y:7, targetMap:'APEXSUMMIT', targetX:12, targetY:6 },
  ],
  npcs:[
    { id:'ASW_SIGN', name:'Sign', x:4, y:5, facing:'DOWN', spriteKey:'NPC_MAN',
      movementType:'STATIONARY',
      dialogue:["Apex Summit Cavern", "Ancient Ice and Dragon types hide in these frozen heights."],
      onInteract:null },
  ],
  encounterTable:{ cave:[
    { speciesId:'PTRYX',     minLv:54, maxLv:58, rate:35 },
    { speciesId:'FROSTLING', minLv:52, maxLv:56, rate:35 },
    { speciesId:'ICECAP',    minLv:52, maxLv:56, rate:30 },
  ], grass:[], water:[]},
  events:[],
};

// ── GYM MAPS v2 — 30×18 quiz-labyrinth format ─────────────────────────────
// Player enters south (y=17), exits north (y=0) to leader.
// y=16 lobby | y=15/10/5 quiz walls (opening x=14-15) | y=14/9/4 fork rows
// (opening x=5 left gate, x=24 right gate) | y=13/8/3 corridors
// (left x=1-9, right x=20-28) | y=12/7/2 merge rows (openings x=4-5, x=24-25)
// y=11/6 wide areas | y=1 leader area | y=0 north wall
// Correct answer → left gate opens (1 trainer). Wrong → right gate (2 trainers).

DG.MAPS.SHELLCREEK_GYM = {
  id:'SHELLCREEK_GYM', name:'Shellcreek City Gym', width:30, height:18,
  music:'GYM_THEME', isIndoor:true, isCave:false,
  tiles:[
    [65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65],
    [65, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,65],
    [65,65,65,65, 0, 0,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65, 0, 0,65,65,65,65],
    [65, 0, 0, 0, 0, 0, 0, 0, 0, 0,65,65,65,65,65,65,65,65,65,65, 0, 0, 0, 0, 0, 0, 0, 0, 0,65],
    [65,65,65,65,65, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,65,65,65,65,65],
    [65,65,65,65,65,65,65,65,65,65,65,65,65,65, 0, 0,65,65,65,65,65,65,65,65,65,65,65,65,65,65],
    [65, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,65],
    [65,65,65,65, 0, 0,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65, 0, 0,65,65,65,65],
    [65, 0, 0, 0, 0, 0, 0, 0, 0, 0,65,65,65,65,65,65,65,65,65,65, 0, 0, 0, 0, 0, 0, 0, 0, 0,65],
    [65,65,65,65,65, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,65,65,65,65,65],
    [65,65,65,65,65,65,65,65,65,65,65,65,65,65, 0, 0,65,65,65,65,65,65,65,65,65,65,65,65,65,65],
    [65, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,65],
    [65,65,65,65, 0, 0,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65, 0, 0,65,65,65,65],
    [65, 0, 0, 0, 0, 0, 0, 0, 0, 0,65,65,65,65,65,65,65,65,65,65, 0, 0, 0, 0, 0, 0, 0, 0, 0,65],
    [65,65,65,65,65, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,65,65,65,65,65],
    [65,65,65,65,65,65,65,65,65,65,65,65,65,65, 0, 0,65,65,65,65,65,65,65,65,65,65,65,65,65,65],
    [65, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,65],
    [65,65,65,65,65,65,65,65,65,65,65,65,65,65,68,68,65,65,65,65,65,65,65,65,65,65,65,65,65,65],
  ],
  warps:[
    { x:14, y:17, targetMap:'SHELLCREEK_CITY', targetX:3, targetY:6, gymLock:'TRAINER_GYM_REX_DEFEATED' },
    { x:15, y:17, targetMap:'SHELLCREEK_CITY', targetX:3, targetY:6, gymLock:'TRAINER_GYM_REX_DEFEATED' },
  ],
  npcs:[
    { id:'GYM_REX_HINT', name:'Fossil Scholar', x:7, y:16, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:["Welcome to Rex's Normal-type Gym! Answer quiz questions to find your path.",
        "Correct: take the SHORT left path (1 trainer). Wrong: take the LONG right path (2 trainers)!",
        "Tip: Normal-type is immune to Ghost-type moves!"], onInteract:null },
    { id:'GYM_REX_S1_QUIZ', name:'Dino Expert', x:14, y:15, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      onInteract:'TRIGGER_GYM_QUIZ', dialogue:["You've already answered. Move along!"],
      quizIntroKey:null, quizQuestion:"Rex's Gym specialises in which type?",
      quizOptionA:'A) Normal', quizOptionB:'B) Fighting',
      quizCorrectFlag:'GYM_REX_S1_CORRECT', quizWrongFlag:'GYM_REX_S1_WRONG', quizDoneFlag:'GYM_REX_S1_DONE',
      correctResponse:'GYM_QUIZ_CORRECT', wrongResponse:'GYM_QUIZ_WRONG', flagToHide:'GYM_REX_S1_DONE' },
    { id:'GYM_REX_S1_GL', name:'Energy Gate', x:5, y:14, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:["Answer correctly to open the left path!"], onInteract:null, flagToHide:'GYM_REX_S1_CORRECT' },
    { id:'GYM_REX_S1_GR', name:'Energy Gate', x:24, y:14, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:["Answer wrong and you'll come through here!"], onInteract:null, flagToHide:'GYM_REX_S1_WRONG' },
    { id:'GYM_REX_S1_TC', name:'Breeder Nat', x:5, y:13, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:['GRUNT_1'], trainerRef:'REX_S1_TC', flagToHide:'TRAINER_REX_S1_TC_DEFEATED' },
    { id:'GYM_REX_S1_TW1', name:'Rancher Jo', x:24, y:13, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:['GRUNT_2'], trainerRef:'REX_S1_TW1', flagToHide:'TRAINER_REX_S1_TW1_DEFEATED' },
    { id:'GYM_REX_S1_TW2', name:'Herder Finn', x:26, y:13, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:['GRUNT_2'], trainerRef:'REX_S1_TW2', flagToHide:'TRAINER_REX_S1_TW2_DEFEATED' },
    { id:'GYM_REX_S2_QUIZ', name:'Dino Expert', x:14, y:10, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      onInteract:'TRIGGER_GYM_QUIZ', dialogue:["You've already answered. Move along!"],
      quizIntroKey:null, quizQuestion:"Which type is Normal-type immune to?",
      quizOptionA:'A) Ghost', quizOptionB:'B) Psychic',
      quizCorrectFlag:'GYM_REX_S2_CORRECT', quizWrongFlag:'GYM_REX_S2_WRONG', quizDoneFlag:'GYM_REX_S2_DONE',
      correctResponse:'GYM_QUIZ_CORRECT', wrongResponse:'GYM_QUIZ_WRONG', flagToHide:'GYM_REX_S2_DONE' },
    { id:'GYM_REX_S2_GL', name:'Energy Gate', x:5, y:9, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:["Answer correctly to open the left path!"], onInteract:null, flagToHide:'GYM_REX_S2_CORRECT' },
    { id:'GYM_REX_S2_GR', name:'Energy Gate', x:24, y:9, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:["Answer wrong and you'll come through here!"], onInteract:null, flagToHide:'GYM_REX_S2_WRONG' },
    { id:'GYM_REX_S2_TC', name:'Breeder Sam', x:5, y:8, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:['GRUNT_1'], trainerRef:'REX_S2_TC', flagToHide:'TRAINER_REX_S2_TC_DEFEATED' },
    { id:'GYM_REX_S2_TW1', name:'Scout Dale', x:24, y:8, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:['GRUNT_2'], trainerRef:'REX_S2_TW1', flagToHide:'TRAINER_REX_S2_TW1_DEFEATED' },
    { id:'GYM_REX_S2_TW2', name:'Herder Nell', x:26, y:8, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:['GRUNT_2'], trainerRef:'REX_S2_TW2', flagToHide:'TRAINER_REX_S2_TW2_DEFEATED' },
    { id:'GYM_REX_S3_QUIZ', name:'Dino Expert', x:14, y:5, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      onInteract:'TRIGGER_GYM_QUIZ', dialogue:["You've already answered. Move along!"],
      quizIntroKey:null, quizQuestion:"What is Rex's strongest DinoMon?",
      quizOptionA:'A) Herdsaur', quizOptionB:'B) Packdino',
      quizCorrectFlag:'GYM_REX_S3_CORRECT', quizWrongFlag:'GYM_REX_S3_WRONG', quizDoneFlag:'GYM_REX_S3_DONE',
      correctResponse:'GYM_QUIZ_CORRECT', wrongResponse:'GYM_QUIZ_WRONG', flagToHide:'GYM_REX_S3_DONE' },
    { id:'GYM_REX_S3_GL', name:'Energy Gate', x:5, y:4, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:["Answer correctly to open the left path!"], onInteract:null, flagToHide:'GYM_REX_S3_CORRECT' },
    { id:'GYM_REX_S3_GR', name:'Energy Gate', x:24, y:4, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:["Answer wrong and you'll come through here!"], onInteract:null, flagToHide:'GYM_REX_S3_WRONG' },
    { id:'GYM_REX_S3_TC', name:'Tracker Ben', x:5, y:3, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:['GRUNT_1'], trainerRef:'REX_S3_TC', flagToHide:'TRAINER_REX_S3_TC_DEFEATED' },
    { id:'GYM_REX_S3_TW1', name:'Rancher Gus', x:24, y:3, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:['GRUNT_2'], trainerRef:'REX_S3_TW1', flagToHide:'TRAINER_REX_S3_TW1_DEFEATED' },
    { id:'GYM_REX_S3_TW2', name:'Scout Mira', x:26, y:3, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:['GRUNT_2'], trainerRef:'REX_S3_TW2', flagToHide:'TRAINER_REX_S3_TW2_DEFEATED' },
    { id:'GYM_LEADER_REX', name:'Rex', x:14, y:1, facing:'DOWN', spriteKey:'NPC_LEADER', movementType:'STATIONARY',
      dialogue:['GYM_REX_PRE'], onInteract:'TRIGGER_GYM', trainerRef:'GYM_REX', flagToHide:'TRAINER_GYM_REX_DEFEATED' },
    { id:'GYM_LEADER_REX_DONE', name:'Rex', x:14, y:1, facing:'DOWN', spriteKey:'NPC_LEADER', movementType:'STATIONARY',
      dialogue:['GYM_REX_POST'], onInteract:null, requiresFlag:'TRAINER_GYM_REX_DEFEATED' },
  ],
  encounterTable:{grass:[],water:[]}, events:[],
};

DG.MAPS.DUSTWALL_GYM = {
  id:'DUSTWALL_GYM', name:'Dustwall City Gym', width:30, height:18,
  music:'GYM_THEME', isIndoor:true, isCave:false,
  tiles:[
    [65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65],
    [65, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,65],
    [65,65,65,65, 4, 4,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65, 4, 4,65,65,65,65],
    [65, 4, 4, 4, 4, 4, 4, 4, 4, 4,65,65,65,65,65,65,65,65,65,65, 4, 4, 4, 4, 4, 4, 4, 4, 4,65],
    [65,65,65,65,65, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,65,65,65,65,65],
    [65,65,65,65,65,65,65,65,65,65,65,65,65,65, 4, 4,65,65,65,65,65,65,65,65,65,65,65,65,65,65],
    [65, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,65],
    [65,65,65,65, 4, 4,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65, 4, 4,65,65,65,65],
    [65, 4, 4, 4, 4, 4, 4, 4, 4, 4,65,65,65,65,65,65,65,65,65,65, 4, 4, 4, 4, 4, 4, 4, 4, 4,65],
    [65,65,65,65,65, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,65,65,65,65,65],
    [65,65,65,65,65,65,65,65,65,65,65,65,65,65, 4, 4,65,65,65,65,65,65,65,65,65,65,65,65,65,65],
    [65, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,65],
    [65,65,65,65, 4, 4,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65, 4, 4,65,65,65,65],
    [65, 4, 4, 4, 4, 4, 4, 4, 4, 4,65,65,65,65,65,65,65,65,65,65, 4, 4, 4, 4, 4, 4, 4, 4, 4,65],
    [65,65,65,65,65, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,65,65,65,65,65],
    [65,65,65,65,65,65,65,65,65,65,65,65,65,65, 4, 4,65,65,65,65,65,65,65,65,65,65,65,65,65,65],
    [65, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,65],
    [65,65,65,65,65,65,65,65,65,65,65,65,65,65,68,68,65,65,65,65,65,65,65,65,65,65,65,65,65,65],
  ],
  warps:[
    { x:14, y:17, targetMap:'DUSTWALL_TOWN', targetX:3, targetY:6, gymLock:'TRAINER_GYM_RIDLEY_DEFEATED' },
    { x:15, y:17, targetMap:'DUSTWALL_TOWN', targetX:3, targetY:6, gymLock:'TRAINER_GYM_RIDLEY_DEFEATED' },
  ],
  npcs:[
    { id:'GYM_RIDLEY_HINT', name:'Fossil Scholar', x:7, y:16, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:["Welcome to Ridley's Rock-type Gym! Answer quiz questions to choose your path.",
        "Correct: SHORT left path (1 trainer). Wrong: LONG right path (2 trainers)!",
        "Tip: Rock-type is super effective against Flying-types!"], onInteract:null },
    { id:'GYM_RIDLEY_S1_QUIZ', name:'Fossil Expert', x:14, y:15, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      onInteract:'TRIGGER_GYM_QUIZ', dialogue:["You've already answered. Move along!"],
      quizIntroKey:null, quizQuestion:"Rock-type is super effective vs...?",
      quizOptionA:'A) Flying', quizOptionB:'B) Water',
      quizCorrectFlag:'GYM_RIDLEY_S1_CORRECT', quizWrongFlag:'GYM_RIDLEY_S1_WRONG', quizDoneFlag:'GYM_RIDLEY_S1_DONE',
      correctResponse:'GYM_QUIZ_CORRECT', wrongResponse:'GYM_QUIZ_WRONG', flagToHide:'GYM_RIDLEY_S1_DONE' },
    { id:'GYM_RIDLEY_S1_GL', name:'Stone Gate', x:5, y:14, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:["Answer correctly to open the left path!"], onInteract:null, flagToHide:'GYM_RIDLEY_S1_CORRECT' },
    { id:'GYM_RIDLEY_S1_GR', name:'Stone Gate', x:24, y:14, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:["Answer wrong and you'll come through here!"], onInteract:null, flagToHide:'GYM_RIDLEY_S1_WRONG' },
    { id:'GYM_RIDLEY_S1_TC', name:'Miner Bud', x:5, y:13, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:['GRUNT_1'], trainerRef:'RIDLEY_S1_TC', flagToHide:'TRAINER_RIDLEY_S1_TC_DEFEATED' },
    { id:'GYM_RIDLEY_S1_TW1', name:'Hiker Roc', x:24, y:13, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:['GRUNT_2'], trainerRef:'RIDLEY_S1_TW1', flagToHide:'TRAINER_RIDLEY_S1_TW1_DEFEATED' },
    { id:'GYM_RIDLEY_S1_TW2', name:'Granite Gal', x:26, y:13, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:['GRUNT_2'], trainerRef:'RIDLEY_S1_TW2', flagToHide:'TRAINER_RIDLEY_S1_TW2_DEFEATED' },
    { id:'GYM_RIDLEY_S2_QUIZ', name:'Fossil Expert', x:14, y:10, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      onInteract:'TRIGGER_GYM_QUIZ', dialogue:["You've already answered. Move along!"],
      quizIntroKey:null, quizQuestion:"Boneback evolves into...?",
      quizOptionA:'A) Stoneskull', quizOptionB:'B) Ossifang',
      quizCorrectFlag:'GYM_RIDLEY_S2_CORRECT', quizWrongFlag:'GYM_RIDLEY_S2_WRONG', quizDoneFlag:'GYM_RIDLEY_S2_DONE',
      correctResponse:'GYM_QUIZ_CORRECT', wrongResponse:'GYM_QUIZ_WRONG', flagToHide:'GYM_RIDLEY_S2_DONE' },
    { id:'GYM_RIDLEY_S2_GL', name:'Stone Gate', x:5, y:9, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:["Answer correctly to open the left path!"], onInteract:null, flagToHide:'GYM_RIDLEY_S2_CORRECT' },
    { id:'GYM_RIDLEY_S2_GR', name:'Stone Gate', x:24, y:9, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:["Answer wrong and you'll come through here!"], onInteract:null, flagToHide:'GYM_RIDLEY_S2_WRONG' },
    { id:'GYM_RIDLEY_S2_TC', name:'Excavator Ed', x:5, y:8, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:['GRUNT_1'], trainerRef:'RIDLEY_S2_TC', flagToHide:'TRAINER_RIDLEY_S2_TC_DEFEATED' },
    { id:'GYM_RIDLEY_S2_TW1', name:'Geologist May', x:24, y:8, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:['GRUNT_2'], trainerRef:'RIDLEY_S2_TW1', flagToHide:'TRAINER_RIDLEY_S2_TW1_DEFEATED' },
    { id:'GYM_RIDLEY_S2_TW2', name:'Fossil Fan Al', x:26, y:8, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:['GRUNT_2'], trainerRef:'RIDLEY_S2_TW2', flagToHide:'TRAINER_RIDLEY_S2_TW2_DEFEATED' },
    { id:'GYM_RIDLEY_S3_QUIZ', name:'Fossil Expert', x:14, y:5, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      onInteract:'TRIGGER_GYM_QUIZ', dialogue:["You've already answered. Move along!"],
      quizIntroKey:null, quizQuestion:"What is the final evolution of Boneback?",
      quizOptionA:'A) Ossifang', quizOptionB:'B) Terradon',
      quizCorrectFlag:'GYM_RIDLEY_S3_CORRECT', quizWrongFlag:'GYM_RIDLEY_S3_WRONG', quizDoneFlag:'GYM_RIDLEY_S3_DONE',
      correctResponse:'GYM_QUIZ_CORRECT', wrongResponse:'GYM_QUIZ_WRONG', flagToHide:'GYM_RIDLEY_S3_DONE' },
    { id:'GYM_RIDLEY_S3_GL', name:'Stone Gate', x:5, y:4, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:["Answer correctly to open the left path!"], onInteract:null, flagToHide:'GYM_RIDLEY_S3_CORRECT' },
    { id:'GYM_RIDLEY_S3_GR', name:'Stone Gate', x:24, y:4, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:["Answer wrong and you'll come through here!"], onInteract:null, flagToHide:'GYM_RIDLEY_S3_WRONG' },
    { id:'GYM_RIDLEY_S3_TC', name:'Hiker Bjorn', x:5, y:3, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:['GRUNT_1'], trainerRef:'RIDLEY_S3_TC', flagToHide:'TRAINER_RIDLEY_S3_TC_DEFEATED' },
    { id:'GYM_RIDLEY_S3_TW1', name:'Miner Fen', x:24, y:3, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:['GRUNT_2'], trainerRef:'RIDLEY_S3_TW1', flagToHide:'TRAINER_RIDLEY_S3_TW1_DEFEATED' },
    { id:'GYM_RIDLEY_S3_TW2', name:'Prospector Clay', x:26, y:3, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:['GRUNT_2'], trainerRef:'RIDLEY_S3_TW2', flagToHide:'TRAINER_RIDLEY_S3_TW2_DEFEATED' },
    { id:'GYM_LEADER_RIDLEY', name:'Ridley', x:14, y:1, facing:'DOWN', spriteKey:'NPC_LEADER', movementType:'STATIONARY',
      dialogue:['GYM_RIDLEY_PRE'], onInteract:'TRIGGER_GYM', trainerRef:'GYM_RIDLEY', flagToHide:'TRAINER_GYM_RIDLEY_DEFEATED' },
    { id:'GYM_LEADER_RIDLEY_DONE', name:'Ridley', x:14, y:1, facing:'DOWN', spriteKey:'NPC_LEADER', movementType:'STATIONARY',
      dialogue:['GYM_RIDLEY_POST'], onInteract:null, requiresFlag:'TRAINER_GYM_RIDLEY_DEFEATED' },
  ],
  encounterTable:{grass:[],water:[]}, events:[],
};

DG.MAPS.PYRESIDE_GYM = {
  id:'PYRESIDE_GYM', name:'Pyreside City Gym', width:30, height:18,
  music:'GYM_THEME', isIndoor:true, isCave:false,
  tiles:[
    [65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65],
    [65, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,65],
    [65,65,65,65, 5, 5,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65, 5, 5,65,65,65,65],
    [65, 5, 5, 5, 5, 5, 5, 5, 5, 5,65,65,65,65,65,65,65,65,65,65, 5, 5, 5, 5, 5, 5, 5, 5, 5,65],
    [65,65,65,65,65, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,65,65,65,65,65],
    [65,65,65,65,65,65,65,65,65,65,65,65,65,65, 5, 5,65,65,65,65,65,65,65,65,65,65,65,65,65,65],
    [65, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,65],
    [65,65,65,65, 5, 5,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65, 5, 5,65,65,65,65],
    [65, 5, 5, 5, 5, 5, 5, 5, 5, 5,65,65,65,65,65,65,65,65,65,65, 5, 5, 5, 5, 5, 5, 5, 5, 5,65],
    [65,65,65,65,65, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,65,65,65,65,65],
    [65,65,65,65,65,65,65,65,65,65,65,65,65,65, 5, 5,65,65,65,65,65,65,65,65,65,65,65,65,65,65],
    [65, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,65],
    [65,65,65,65, 5, 5,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65, 5, 5,65,65,65,65],
    [65, 5, 5, 5, 5, 5, 5, 5, 5, 5,65,65,65,65,65,65,65,65,65,65, 5, 5, 5, 5, 5, 5, 5, 5, 5,65],
    [65,65,65,65,65, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,65,65,65,65,65],
    [65,65,65,65,65,65,65,65,65,65,65,65,65,65, 5, 5,65,65,65,65,65,65,65,65,65,65,65,65,65,65],
    [65, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,65],
    [65,65,65,65,65,65,65,65,65,65,65,65,65,65,68,68,65,65,65,65,65,65,65,65,65,65,65,65,65,65],
  ],
  warps:[
    { x:14, y:17, targetMap:'PYRESIDE_CITY', targetX:9, targetY:12, gymLock:'TRAINER_GYM_IGNIS_DEFEATED' },
    { x:15, y:17, targetMap:'PYRESIDE_CITY', targetX:9, targetY:12, gymLock:'TRAINER_GYM_IGNIS_DEFEATED' },
  ],
  npcs:[
    { id:'GYM_IGNIS_HINT', name:'Fossil Scholar', x:7, y:16, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:["Welcome to Ignis's Fire-type Gym! Answer correctly: SHORT left path (1 trainer).",
        "Answer wrong: LONG right path (2 trainers)!",
        "Tip: Scorchback is a Fire/Rock-type DinoMon!"], onInteract:null },
    { id:'GYM_IGNIS_S1_QUIZ', name:'Lava Sage', x:14, y:15, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      onInteract:'TRIGGER_GYM_QUIZ', dialogue:["You've already answered. Move along!"],
      quizIntroKey:null, quizQuestion:"Fire is super effective vs...?",
      quizOptionA:'A) Grass, Ice and Bug', quizOptionB:'B) Grass, Water and Ice',
      quizCorrectFlag:'GYM_IGNIS_S1_CORRECT', quizWrongFlag:'GYM_IGNIS_S1_WRONG', quizDoneFlag:'GYM_IGNIS_S1_DONE',
      correctResponse:'GYM_QUIZ_CORRECT', wrongResponse:'GYM_QUIZ_WRONG', flagToHide:'GYM_IGNIS_S1_DONE' },
    { id:'GYM_IGNIS_S1_GL', name:'Flame Gate', x:5, y:14, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:["Answer correctly to open the left path!"], onInteract:null, flagToHide:'GYM_IGNIS_S1_CORRECT' },
    { id:'GYM_IGNIS_S1_GR', name:'Flame Gate', x:24, y:14, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:["Answer wrong and you'll come through here!"], onInteract:null, flagToHide:'GYM_IGNIS_S1_WRONG' },
    { id:'GYM_IGNIS_S1_TC', name:'Pyro Ace', x:5, y:13, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:['GRUNT_1'], trainerRef:'IGNIS_S1_TC', flagToHide:'TRAINER_IGNIS_S1_TC_DEFEATED' },
    { id:'GYM_IGNIS_S1_TW1', name:'Fire Scout Cal', x:24, y:13, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:['GRUNT_2'], trainerRef:'IGNIS_S1_TW1', flagToHide:'TRAINER_IGNIS_S1_TW1_DEFEATED' },
    { id:'GYM_IGNIS_S1_TW2', name:'Blaze Jr', x:26, y:13, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:['GRUNT_2'], trainerRef:'IGNIS_S1_TW2', flagToHide:'TRAINER_IGNIS_S1_TW2_DEFEATED' },
    { id:'GYM_IGNIS_S2_QUIZ', name:'Lava Sage', x:14, y:10, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      onInteract:'TRIGGER_GYM_QUIZ', dialogue:["You've already answered. Move along!"],
      quizIntroKey:null, quizQuestion:"Scorchback's secondary type?",
      quizOptionA:'A) Rock', quizOptionB:'B) Dragon',
      quizCorrectFlag:'GYM_IGNIS_S2_CORRECT', quizWrongFlag:'GYM_IGNIS_S2_WRONG', quizDoneFlag:'GYM_IGNIS_S2_DONE',
      correctResponse:'GYM_QUIZ_CORRECT', wrongResponse:'GYM_QUIZ_WRONG', flagToHide:'GYM_IGNIS_S2_DONE' },
    { id:'GYM_IGNIS_S2_GL', name:'Flame Gate', x:5, y:9, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:["Answer correctly to open the left path!"], onInteract:null, flagToHide:'GYM_IGNIS_S2_CORRECT' },
    { id:'GYM_IGNIS_S2_GR', name:'Flame Gate', x:24, y:9, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:["Answer wrong and you'll come through here!"], onInteract:null, flagToHide:'GYM_IGNIS_S2_WRONG' },
    { id:'GYM_IGNIS_S2_TC', name:'Lava Walker Mia', x:5, y:8, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:['GRUNT_1'], trainerRef:'IGNIS_S2_TC', flagToHide:'TRAINER_IGNIS_S2_TC_DEFEATED' },
    { id:'GYM_IGNIS_S2_TW1', name:'Pyro Blaze', x:24, y:8, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:['GRUNT_2'], trainerRef:'IGNIS_S2_TW1', flagToHide:'TRAINER_IGNIS_S2_TW1_DEFEATED' },
    { id:'GYM_IGNIS_S2_TW2', name:'Cinder Roy', x:26, y:8, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:['GRUNT_2'], trainerRef:'IGNIS_S2_TW2', flagToHide:'TRAINER_IGNIS_S2_TW2_DEFEATED' },
    { id:'GYM_IGNIS_S3_QUIZ', name:'Lava Sage', x:14, y:5, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      onInteract:'TRIGGER_GYM_QUIZ', dialogue:["You've already answered. Move along!"],
      quizIntroKey:null, quizQuestion:"Fire-type is weak to...?",
      quizOptionA:'A) Water, Rock and Ground', quizOptionB:'B) Water, Ice and Ground',
      quizCorrectFlag:'GYM_IGNIS_S3_CORRECT', quizWrongFlag:'GYM_IGNIS_S3_WRONG', quizDoneFlag:'GYM_IGNIS_S3_DONE',
      correctResponse:'GYM_QUIZ_CORRECT', wrongResponse:'GYM_QUIZ_WRONG', flagToHide:'GYM_IGNIS_S3_DONE' },
    { id:'GYM_IGNIS_S3_GL', name:'Flame Gate', x:5, y:4, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:["Answer correctly to open the left path!"], onInteract:null, flagToHide:'GYM_IGNIS_S3_CORRECT' },
    { id:'GYM_IGNIS_S3_GR', name:'Flame Gate', x:24, y:4, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:["Answer wrong and you'll come through here!"], onInteract:null, flagToHide:'GYM_IGNIS_S3_WRONG' },
    { id:'GYM_IGNIS_S3_TC', name:'Fire Master Les', x:5, y:3, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:['GRUNT_1'], trainerRef:'IGNIS_S3_TC', flagToHide:'TRAINER_IGNIS_S3_TC_DEFEATED' },
    { id:'GYM_IGNIS_S3_TW1', name:'Magma Kin', x:24, y:3, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:['GRUNT_2'], trainerRef:'IGNIS_S3_TW1', flagToHide:'TRAINER_IGNIS_S3_TW1_DEFEATED' },
    { id:'GYM_IGNIS_S3_TW2', name:'Lava Cinder', x:26, y:3, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:['GRUNT_2'], trainerRef:'IGNIS_S3_TW2', flagToHide:'TRAINER_IGNIS_S3_TW2_DEFEATED' },
    { id:'GYM_LEADER_IGNIS', name:'Ignis', x:14, y:1, facing:'DOWN', spriteKey:'NPC_LEADER', movementType:'STATIONARY',
      dialogue:['GYM_IGNIS_PRE'], onInteract:'TRIGGER_GYM', trainerRef:'GYM_IGNIS', flagToHide:'TRAINER_GYM_IGNIS_DEFEATED' },
    { id:'GYM_LEADER_IGNIS_DONE', name:'Ignis', x:14, y:1, facing:'DOWN', spriteKey:'NPC_LEADER', movementType:'STATIONARY',
      dialogue:['GYM_IGNIS_POST'], onInteract:null, requiresFlag:'TRAINER_GYM_IGNIS_DEFEATED' },
  ],
  encounterTable:{grass:[],water:[]}, events:[],
};

DG.MAPS.FERNGROVE_GYM = {
  id:'FERNGROVE_GYM', name:'Ferngrove Gym', width:30, height:18,
  music:'GYM_THEME', isIndoor:true, isCave:false,
  tiles:[
    [64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64],
    [64, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9,64],
    [64,64,64,64, 9, 9,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64, 9, 9,64,64,64,64],
    [64, 9, 9, 9, 9, 9, 9, 9, 9, 9,64,64,64,64,64,64,64,64,64,64, 9, 9, 9, 9, 9, 9, 9, 9, 9,64],
    [64,64,64,64,64, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9,64,64,64,64,64],
    [64,64,64,64,64,64,64,64,64,64,64,64,64,64, 9, 9,64,64,64,64,64,64,64,64,64,64,64,64,64,64],
    [64, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9,64],
    [64,64,64,64, 9, 9,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64, 9, 9,64,64,64,64],
    [64, 9, 9, 9, 9, 9, 9, 9, 9, 9,64,64,64,64,64,64,64,64,64,64, 9, 9, 9, 9, 9, 9, 9, 9, 9,64],
    [64,64,64,64,64, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9,64,64,64,64,64],
    [64,64,64,64,64,64,64,64,64,64,64,64,64,64, 9, 9,64,64,64,64,64,64,64,64,64,64,64,64,64,64],
    [64, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9,64],
    [64,64,64,64, 9, 9,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64, 9, 9,64,64,64,64],
    [64, 9, 9, 9, 9, 9, 9, 9, 9, 9,64,64,64,64,64,64,64,64,64,64, 9, 9, 9, 9, 9, 9, 9, 9, 9,64],
    [64,64,64,64,64, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9,64,64,64,64,64],
    [64,64,64,64,64,64,64,64,64,64,64,64,64,64, 9, 9,64,64,64,64,64,64,64,64,64,64,64,64,64,64],
    [64, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9,64],
    [64,64,64,64,64,64,64,64,64,64,64,64,64,64,68,68,64,64,64,64,64,64,64,64,64,64,64,64,64,64],
  ],
  warps:[
    { x:14, y:17, targetMap:'FERNGROVE_TOWN', targetX:3, targetY:5, gymLock:'TRAINER_GYM_SYLVA_DEFEATED' },
    { x:15, y:17, targetMap:'FERNGROVE_TOWN', targetX:3, targetY:5, gymLock:'TRAINER_GYM_SYLVA_DEFEATED' },
  ],
  npcs:[
    { id:'GYM_SYLVA_HINT', name:'Fossil Scholar', x:7, y:16, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:["Welcome to Sylva's Grass-type Gym! Answer correctly: SHORT left path (1 trainer).",
        "Answer wrong: LONG right path (2 trainers)!",
        "Tip: Frondlet can be found in Route 2's tall grass!"], onInteract:null },
    { id:'GYM_SYLVA_S1_QUIZ', name:'Botanist', x:14, y:15, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      onInteract:'TRIGGER_GYM_QUIZ', dialogue:["You've already answered. Move along!"],
      quizIntroKey:null, quizQuestion:"Which DinoMon is wild in Route 2 grass?",
      quizOptionA:'A) Frondlet', quizOptionB:'B) Leafawn',
      quizCorrectFlag:'GYM_SYLVA_S1_CORRECT', quizWrongFlag:'GYM_SYLVA_S1_WRONG', quizDoneFlag:'GYM_SYLVA_S1_DONE',
      correctResponse:'GYM_QUIZ_CORRECT', wrongResponse:'GYM_QUIZ_WRONG', flagToHide:'GYM_SYLVA_S1_DONE' },
    { id:'GYM_SYLVA_S1_GL', name:'Vine Gate', x:5, y:14, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:["Answer correctly to open the left path!"], onInteract:null, flagToHide:'GYM_SYLVA_S1_CORRECT' },
    { id:'GYM_SYLVA_S1_GR', name:'Vine Gate', x:24, y:14, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:["Answer wrong and you'll come through here!"], onInteract:null, flagToHide:'GYM_SYLVA_S1_WRONG' },
    { id:'GYM_SYLVA_S1_TC', name:'Ranger Fern', x:5, y:13, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:['GRUNT_1'], trainerRef:'SYLVA_S1_TC', flagToHide:'TRAINER_SYLVA_S1_TC_DEFEATED' },
    { id:'GYM_SYLVA_S1_TW1', name:'Botanist Ivy', x:24, y:13, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:['GRUNT_2'], trainerRef:'SYLVA_S1_TW1', flagToHide:'TRAINER_SYLVA_S1_TW1_DEFEATED' },
    { id:'GYM_SYLVA_S1_TW2', name:'Leaf Scout', x:26, y:13, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:['GRUNT_2'], trainerRef:'SYLVA_S1_TW2', flagToHide:'TRAINER_SYLVA_S1_TW2_DEFEATED' },
    { id:'GYM_SYLVA_S2_QUIZ', name:'Botanist', x:14, y:10, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      onInteract:'TRIGGER_GYM_QUIZ', dialogue:["You've already answered. Move along!"],
      quizIntroKey:null, quizQuestion:"Grass-type moves are resisted by...?",
      quizOptionA:'A) Bug', quizOptionB:'B) Ice',
      quizCorrectFlag:'GYM_SYLVA_S2_CORRECT', quizWrongFlag:'GYM_SYLVA_S2_WRONG', quizDoneFlag:'GYM_SYLVA_S2_DONE',
      correctResponse:'GYM_QUIZ_CORRECT', wrongResponse:'GYM_QUIZ_WRONG', flagToHide:'GYM_SYLVA_S2_DONE' },
    { id:'GYM_SYLVA_S2_GL', name:'Vine Gate', x:5, y:9, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:["Answer correctly to open the left path!"], onInteract:null, flagToHide:'GYM_SYLVA_S2_CORRECT' },
    { id:'GYM_SYLVA_S2_GR', name:'Vine Gate', x:24, y:9, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:["Answer wrong and you'll come through here!"], onInteract:null, flagToHide:'GYM_SYLVA_S2_WRONG' },
    { id:'GYM_SYLVA_S2_TC', name:'Vine Ranger', x:5, y:8, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:['GRUNT_1'], trainerRef:'SYLVA_S2_TC', flagToHide:'TRAINER_SYLVA_S2_TC_DEFEATED' },
    { id:'GYM_SYLVA_S2_TW1', name:'Botanist Fern', x:24, y:8, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:['GRUNT_2'], trainerRef:'SYLVA_S2_TW1', flagToHide:'TRAINER_SYLVA_S2_TW1_DEFEATED' },
    { id:'GYM_SYLVA_S2_TW2', name:'Bramble Jr', x:26, y:8, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:['GRUNT_2'], trainerRef:'SYLVA_S2_TW2', flagToHide:'TRAINER_SYLVA_S2_TW2_DEFEATED' },
    { id:'GYM_SYLVA_S3_QUIZ', name:'Botanist', x:14, y:5, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      onInteract:'TRIGGER_GYM_QUIZ', dialogue:["You've already answered. Move along!"],
      quizIntroKey:null, quizQuestion:"Verdanthorn's secondary type?",
      quizOptionA:'A) Rock', quizOptionB:'B) Ground',
      quizCorrectFlag:'GYM_SYLVA_S3_CORRECT', quizWrongFlag:'GYM_SYLVA_S3_WRONG', quizDoneFlag:'GYM_SYLVA_S3_DONE',
      correctResponse:'GYM_QUIZ_CORRECT', wrongResponse:'GYM_QUIZ_WRONG', flagToHide:'GYM_SYLVA_S3_DONE' },
    { id:'GYM_SYLVA_S3_GL', name:'Vine Gate', x:5, y:4, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:["Answer correctly to open the left path!"], onInteract:null, flagToHide:'GYM_SYLVA_S3_CORRECT' },
    { id:'GYM_SYLVA_S3_GR', name:'Vine Gate', x:24, y:4, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:["Answer wrong and you'll come through here!"], onInteract:null, flagToHide:'GYM_SYLVA_S3_WRONG' },
    { id:'GYM_SYLVA_S3_TC', name:'Grove Master', x:5, y:3, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:['GRUNT_1'], trainerRef:'SYLVA_S3_TC', flagToHide:'TRAINER_SYLVA_S3_TC_DEFEATED' },
    { id:'GYM_SYLVA_S3_TW1', name:'Vine Bramble', x:24, y:3, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:['GRUNT_2'], trainerRef:'SYLVA_S3_TW1', flagToHide:'TRAINER_SYLVA_S3_TW1_DEFEATED' },
    { id:'GYM_SYLVA_S3_TW2', name:'Canopy Scout', x:26, y:3, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:['GRUNT_2'], trainerRef:'SYLVA_S3_TW2', flagToHide:'TRAINER_SYLVA_S3_TW2_DEFEATED' },
    { id:'GYM_LEADER_SYLVA', name:'Sylva', x:14, y:1, facing:'DOWN', spriteKey:'NPC_LEADER', movementType:'STATIONARY',
      dialogue:['GYM_SYLVA_PRE'], onInteract:'TRIGGER_GYM', trainerRef:'GYM_SYLVA', flagToHide:'TRAINER_GYM_SYLVA_DEFEATED' },
    { id:'GYM_LEADER_SYLVA_DONE', name:'Sylva', x:14, y:1, facing:'DOWN', spriteKey:'NPC_LEADER', movementType:'STATIONARY',
      dialogue:['GYM_SYLVA_POST'], onInteract:null, requiresFlag:'TRAINER_GYM_SYLVA_DEFEATED' },
  ],
  encounterTable:{grass:[],water:[]}, events:[],
};

DG.MAPS.STONEHAVEN_GYM = {
  id:'STONEHAVEN_GYM', name:'Stonehaven City Gym', width:30, height:18,
  music:'GYM_THEME', isIndoor:true, isCave:false,
  tiles:[
    [66,66,66,66,66,66,66,66,66,66,66,66,66,66,66,66,66,66,66,66,66,66,66,66,66,66,66,66,66,66],
    [66, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,66],
    [66,66,66,66, 4, 4,66,66,66,66,66,66,66,66,66,66,66,66,66,66,66,66,66,66, 4, 4,66,66,66,66],
    [66, 4, 4, 4, 4, 4, 4, 4, 4, 4,66,66,66,66,66,66,66,66,66,66, 4, 4, 4, 4, 4, 4, 4, 4, 4,66],
    [66,66,66,66,66, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,66,66,66,66,66],
    [66,66,66,66,66,66,66,66,66,66,66,66,66,66, 4, 4,66,66,66,66,66,66,66,66,66,66,66,66,66,66],
    [66, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,66],
    [66,66,66,66, 4, 4,66,66,66,66,66,66,66,66,66,66,66,66,66,66,66,66,66,66, 4, 4,66,66,66,66],
    [66, 4, 4, 4, 4, 4, 4, 4, 4, 4,66,66,66,66,66,66,66,66,66,66, 4, 4, 4, 4, 4, 4, 4, 4, 4,66],
    [66,66,66,66,66, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,66,66,66,66,66],
    [66,66,66,66,66,66,66,66,66,66,66,66,66,66, 4, 4,66,66,66,66,66,66,66,66,66,66,66,66,66,66],
    [66, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,66],
    [66,66,66,66, 4, 4,66,66,66,66,66,66,66,66,66,66,66,66,66,66,66,66,66,66, 4, 4,66,66,66,66],
    [66, 4, 4, 4, 4, 4, 4, 4, 4, 4,66,66,66,66,66,66,66,66,66,66, 4, 4, 4, 4, 4, 4, 4, 4, 4,66],
    [66,66,66,66,66, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,66,66,66,66,66],
    [66,66,66,66,66,66,66,66,66,66,66,66,66,66, 4, 4,66,66,66,66,66,66,66,66,66,66,66,66,66,66],
    [66, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,66],
    [66,66,66,66,66,66,66,66,66,66,66,66,66,66,68,68,66,66,66,66,66,66,66,66,66,66,66,66,66,66],
  ],
  warps:[
    { x:14, y:17, targetMap:'STONEHAVEN_CITY', targetX:9, targetY:12, gymLock:'TRAINER_GYM_TERRA_DEFEATED' },
    { x:15, y:17, targetMap:'STONEHAVEN_CITY', targetX:9, targetY:12, gymLock:'TRAINER_GYM_TERRA_DEFEATED' },
  ],
  npcs:[
    { id:'GYM_TERRA_HINT', name:'Fossil Scholar', x:7, y:16, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:["Welcome to Terra's Ground-type Gym! Answer correctly: SHORT left path (1 trainer).",
        "Answer wrong: LONG right path (2 trainers)!",
        "Tip: Ground-type moves don't affect Flying-types at all!"], onInteract:null },
    { id:'GYM_TERRA_S1_QUIZ', name:'Canyon Guide', x:14, y:15, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      onInteract:'TRIGGER_GYM_QUIZ', dialogue:["You've already answered. Move along!"],
      quizIntroKey:null, quizQuestion:"Ground-type does NOT affect which type?",
      quizOptionA:'A) Flying', quizOptionB:'B) Rock',
      quizCorrectFlag:'GYM_TERRA_S1_CORRECT', quizWrongFlag:'GYM_TERRA_S1_WRONG', quizDoneFlag:'GYM_TERRA_S1_DONE',
      correctResponse:'GYM_QUIZ_CORRECT', wrongResponse:'GYM_QUIZ_WRONG', flagToHide:'GYM_TERRA_S1_DONE' },
    { id:'GYM_TERRA_S1_GL', name:'Rock Gate', x:5, y:14, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:["Answer correctly to open the left path!"], onInteract:null, flagToHide:'GYM_TERRA_S1_CORRECT' },
    { id:'GYM_TERRA_S1_GR', name:'Rock Gate', x:24, y:14, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:["Answer wrong and you'll come through here!"], onInteract:null, flagToHide:'GYM_TERRA_S1_WRONG' },
    { id:'GYM_TERRA_S1_TC', name:'Hiker Dustin', x:5, y:13, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:['GRUNT_1'], trainerRef:'TERRA_S1_TC', flagToHide:'TRAINER_TERRA_S1_TC_DEFEATED' },
    { id:'GYM_TERRA_S1_TW1', name:'Canyon Scout', x:24, y:13, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:['GRUNT_2'], trainerRef:'TERRA_S1_TW1', flagToHide:'TRAINER_TERRA_S1_TW1_DEFEATED' },
    { id:'GYM_TERRA_S1_TW2', name:'Digger Drake', x:26, y:13, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:['GRUNT_2'], trainerRef:'TERRA_S1_TW2', flagToHide:'TRAINER_TERRA_S1_TW2_DEFEATED' },
    { id:'GYM_TERRA_S2_QUIZ', name:'Canyon Guide', x:14, y:10, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      onInteract:'TRIGGER_GYM_QUIZ', dialogue:["You've already answered. Move along!"],
      quizIntroKey:null, quizQuestion:"Which Ground DinoMon is found on Route 3?",
      quizOptionA:'A) Sandclaw', quizOptionB:'B) Desertfang',
      quizCorrectFlag:'GYM_TERRA_S2_CORRECT', quizWrongFlag:'GYM_TERRA_S2_WRONG', quizDoneFlag:'GYM_TERRA_S2_DONE',
      correctResponse:'GYM_QUIZ_CORRECT', wrongResponse:'GYM_QUIZ_WRONG', flagToHide:'GYM_TERRA_S2_DONE' },
    { id:'GYM_TERRA_S2_GL', name:'Rock Gate', x:5, y:9, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:["Answer correctly to open the left path!"], onInteract:null, flagToHide:'GYM_TERRA_S2_CORRECT' },
    { id:'GYM_TERRA_S2_GR', name:'Rock Gate', x:24, y:9, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:["Answer wrong and you'll come through here!"], onInteract:null, flagToHide:'GYM_TERRA_S2_WRONG' },
    { id:'GYM_TERRA_S2_TC', name:'Hiker Gravel', x:5, y:8, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:['GRUNT_1'], trainerRef:'TERRA_S2_TC', flagToHide:'TRAINER_TERRA_S2_TC_DEFEATED' },
    { id:'GYM_TERRA_S2_TW1', name:'Desert Hiker', x:24, y:8, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:['GRUNT_2'], trainerRef:'TERRA_S2_TW1', flagToHide:'TRAINER_TERRA_S2_TW1_DEFEATED' },
    { id:'GYM_TERRA_S2_TW2', name:'Geo Scout', x:26, y:8, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:['GRUNT_2'], trainerRef:'TERRA_S2_TW2', flagToHide:'TRAINER_TERRA_S2_TW2_DEFEATED' },
    { id:'GYM_TERRA_S3_QUIZ', name:'Canyon Guide', x:14, y:5, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      onInteract:'TRIGGER_GYM_QUIZ', dialogue:["You've already answered. Move along!"],
      quizIntroKey:null, quizQuestion:"Terradon's secondary type?",
      quizOptionA:'A) Rock', quizOptionB:'B) Fighting',
      quizCorrectFlag:'GYM_TERRA_S3_CORRECT', quizWrongFlag:'GYM_TERRA_S3_WRONG', quizDoneFlag:'GYM_TERRA_S3_DONE',
      correctResponse:'GYM_QUIZ_CORRECT', wrongResponse:'GYM_QUIZ_WRONG', flagToHide:'GYM_TERRA_S3_DONE' },
    { id:'GYM_TERRA_S3_GL', name:'Rock Gate', x:5, y:4, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:["Answer correctly to open the left path!"], onInteract:null, flagToHide:'GYM_TERRA_S3_CORRECT' },
    { id:'GYM_TERRA_S3_GR', name:'Rock Gate', x:24, y:4, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:["Answer wrong and you'll come through here!"], onInteract:null, flagToHide:'GYM_TERRA_S3_WRONG' },
    { id:'GYM_TERRA_S3_TC', name:'Canyon Warden', x:5, y:3, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:['GRUNT_1'], trainerRef:'TERRA_S3_TC', flagToHide:'TRAINER_TERRA_S3_TC_DEFEATED' },
    { id:'GYM_TERRA_S3_TW1', name:'Elder Drake', x:24, y:3, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:['GRUNT_2'], trainerRef:'TERRA_S3_TW1', flagToHide:'TRAINER_TERRA_S3_TW1_DEFEATED' },
    { id:'GYM_TERRA_S3_TW2', name:'Ground Scout', x:26, y:3, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:['GRUNT_2'], trainerRef:'TERRA_S3_TW2', flagToHide:'TRAINER_TERRA_S3_TW2_DEFEATED' },
    { id:'GYM_LEADER_TERRA', name:'Terra', x:14, y:1, facing:'DOWN', spriteKey:'NPC_LEADER', movementType:'STATIONARY',
      dialogue:['GYM_TERRA_PRE'], onInteract:'TRIGGER_GYM', trainerRef:'GYM_TERRA', flagToHide:'TRAINER_GYM_TERRA_DEFEATED' },
    { id:'GYM_LEADER_TERRA_DONE', name:'Terra', x:14, y:1, facing:'DOWN', spriteKey:'NPC_LEADER', movementType:'STATIONARY',
      dialogue:['GYM_TERRA_POST'], onInteract:null, requiresFlag:'TRAINER_GYM_TERRA_DEFEATED' },
  ],
  encounterTable:{grass:[],water:[]}, events:[],
};

DG.MAPS.CRESTFALL_GYM = {
  id:'CRESTFALL_GYM', name:'Crestfall Town Gym', width:30, height:18,
  music:'GYM_THEME', isIndoor:true, isCave:false,
  tiles:[
    [65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65],
    [65, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,65],
    [65,65,65,65, 5, 5,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65, 5, 5,65,65,65,65],
    [65, 5, 5, 5, 5, 5, 5, 5, 5, 5,65,65,65,65,65,65,65,65,65,65, 5, 5, 5, 5, 5, 5, 5, 5, 5,65],
    [65,65,65,65,65, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,65,65,65,65,65],
    [65,65,65,65,65,65,65,65,65,65,65,65,65,65, 5, 5,65,65,65,65,65,65,65,65,65,65,65,65,65,65],
    [65, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,65],
    [65,65,65,65, 5, 5,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65, 5, 5,65,65,65,65],
    [65, 5, 5, 5, 5, 5, 5, 5, 5, 5,65,65,65,65,65,65,65,65,65,65, 5, 5, 5, 5, 5, 5, 5, 5, 5,65],
    [65,65,65,65,65, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,65,65,65,65,65],
    [65,65,65,65,65,65,65,65,65,65,65,65,65,65, 5, 5,65,65,65,65,65,65,65,65,65,65,65,65,65,65],
    [65, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,65],
    [65,65,65,65, 5, 5,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65, 5, 5,65,65,65,65],
    [65, 5, 5, 5, 5, 5, 5, 5, 5, 5,65,65,65,65,65,65,65,65,65,65, 5, 5, 5, 5, 5, 5, 5, 5, 5,65],
    [65,65,65,65,65, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,65,65,65,65,65],
    [65,65,65,65,65,65,65,65,65,65,65,65,65,65, 5, 5,65,65,65,65,65,65,65,65,65,65,65,65,65,65],
    [65, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,65],
    [65,65,65,65,65,65,65,65,65,65,65,65,65,65,68,68,65,65,65,65,65,65,65,65,65,65,65,65,65,65],
  ],
  warps:[
    { x:14, y:17, targetMap:'CRESTFALL_TOWN', targetX:3, targetY:5, gymLock:'TRAINER_GYM_VOLT_DEFEATED' },
    { x:15, y:17, targetMap:'CRESTFALL_TOWN', targetX:3, targetY:5, gymLock:'TRAINER_GYM_VOLT_DEFEATED' },
  ],
  npcs:[
    { id:'GYM_VOLT_HINT', name:'Fossil Scholar', x:7, y:16, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:["Welcome to Volt's Electric-type Gym! Answer correctly: SHORT left path (1 trainer).",
        "Answer wrong: LONG right path (2 trainers)!",
        "Tip: Ground-type DinoMons are completely immune to Electric-type moves!"], onInteract:null },
    { id:'GYM_VOLT_S1_QUIZ', name:'Electrician', x:14, y:15, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      onInteract:'TRIGGER_GYM_QUIZ', dialogue:["You've already answered. Move along!"],
      quizIntroKey:null, quizQuestion:"Which type is immune to Electric?",
      quizOptionA:'A) Ground', quizOptionB:'B) Rock',
      quizCorrectFlag:'GYM_VOLT_S1_CORRECT', quizWrongFlag:'GYM_VOLT_S1_WRONG', quizDoneFlag:'GYM_VOLT_S1_DONE',
      correctResponse:'GYM_QUIZ_CORRECT', wrongResponse:'GYM_QUIZ_WRONG', flagToHide:'GYM_VOLT_S1_DONE' },
    { id:'GYM_VOLT_S1_GL', name:'Volt Gate', x:5, y:14, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:["Answer correctly to open the left path!"], onInteract:null, flagToHide:'GYM_VOLT_S1_CORRECT' },
    { id:'GYM_VOLT_S1_GR', name:'Volt Gate', x:24, y:14, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:["Answer wrong and you'll come through here!"], onInteract:null, flagToHide:'GYM_VOLT_S1_WRONG' },
    { id:'GYM_VOLT_S1_TC', name:'Electrician Zap', x:5, y:13, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:['GRUNT_1'], trainerRef:'VOLT_S1_TC', flagToHide:'TRAINER_VOLT_S1_TC_DEFEATED' },
    { id:'GYM_VOLT_S1_TW1', name:'Sparky Jr', x:24, y:13, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:['GRUNT_2'], trainerRef:'VOLT_S1_TW1', flagToHide:'TRAINER_VOLT_S1_TW1_DEFEATED' },
    { id:'GYM_VOLT_S1_TW2', name:'Static Wren', x:26, y:13, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:['GRUNT_2'], trainerRef:'VOLT_S1_TW2', flagToHide:'TRAINER_VOLT_S1_TW2_DEFEATED' },
    { id:'GYM_VOLT_S2_QUIZ', name:'Electrician', x:14, y:10, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      onInteract:'TRIGGER_GYM_QUIZ', dialogue:["You've already answered. Move along!"],
      quizIntroKey:null, quizQuestion:"Final evolution of Sparkhorn?",
      quizOptionA:'A) Thundersaur', quizOptionB:'B) Cyclosaur',
      quizCorrectFlag:'GYM_VOLT_S2_CORRECT', quizWrongFlag:'GYM_VOLT_S2_WRONG', quizDoneFlag:'GYM_VOLT_S2_DONE',
      correctResponse:'GYM_QUIZ_CORRECT', wrongResponse:'GYM_QUIZ_WRONG', flagToHide:'GYM_VOLT_S2_DONE' },
    { id:'GYM_VOLT_S2_GL', name:'Volt Gate', x:5, y:9, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:["Answer correctly to open the left path!"], onInteract:null, flagToHide:'GYM_VOLT_S2_CORRECT' },
    { id:'GYM_VOLT_S2_GR', name:'Volt Gate', x:24, y:9, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:["Answer wrong and you'll come through here!"], onInteract:null, flagToHide:'GYM_VOLT_S2_WRONG' },
    { id:'GYM_VOLT_S2_TC', name:'Volt Engineer', x:5, y:8, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:['GRUNT_1'], trainerRef:'VOLT_S2_TC', flagToHide:'TRAINER_VOLT_S2_TC_DEFEATED' },
    { id:'GYM_VOLT_S2_TW1', name:'Sparky Fen', x:24, y:8, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:['GRUNT_2'], trainerRef:'VOLT_S2_TW1', flagToHide:'TRAINER_VOLT_S2_TW1_DEFEATED' },
    { id:'GYM_VOLT_S2_TW2', name:'Amp Scout', x:26, y:8, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:['GRUNT_2'], trainerRef:'VOLT_S2_TW2', flagToHide:'TRAINER_VOLT_S2_TW2_DEFEATED' },
    { id:'GYM_VOLT_S3_QUIZ', name:'Electrician', x:14, y:5, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      onInteract:'TRIGGER_GYM_QUIZ', dialogue:["You've already answered. Move along!"],
      quizIntroKey:null, quizQuestion:"The Static Badge unlocks which HM?",
      quizOptionA:'A) Fly', quizOptionB:'B) Surf',
      quizCorrectFlag:'GYM_VOLT_S3_CORRECT', quizWrongFlag:'GYM_VOLT_S3_WRONG', quizDoneFlag:'GYM_VOLT_S3_DONE',
      correctResponse:'GYM_QUIZ_CORRECT', wrongResponse:'GYM_QUIZ_WRONG', flagToHide:'GYM_VOLT_S3_DONE' },
    { id:'GYM_VOLT_S3_GL', name:'Volt Gate', x:5, y:4, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:["Answer correctly to open the left path!"], onInteract:null, flagToHide:'GYM_VOLT_S3_CORRECT' },
    { id:'GYM_VOLT_S3_GR', name:'Volt Gate', x:24, y:4, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:["Answer wrong and you'll come through here!"], onInteract:null, flagToHide:'GYM_VOLT_S3_WRONG' },
    { id:'GYM_VOLT_S3_TC', name:'Lightning Chief', x:5, y:3, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:['GRUNT_1'], trainerRef:'VOLT_S3_TC', flagToHide:'TRAINER_VOLT_S3_TC_DEFEATED' },
    { id:'GYM_VOLT_S3_TW1', name:'Storm Walker', x:24, y:3, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:['GRUNT_2'], trainerRef:'VOLT_S3_TW1', flagToHide:'TRAINER_VOLT_S3_TW1_DEFEATED' },
    { id:'GYM_VOLT_S3_TW2', name:'Volt Scout', x:26, y:3, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:['GRUNT_2'], trainerRef:'VOLT_S3_TW2', flagToHide:'TRAINER_VOLT_S3_TW2_DEFEATED' },
    { id:'GYM_LEADER_VOLT', name:'Volt', x:14, y:1, facing:'DOWN', spriteKey:'NPC_LEADER', movementType:'STATIONARY',
      dialogue:['GYM_VOLT_PRE'], onInteract:'TRIGGER_GYM', trainerRef:'GYM_VOLT', flagToHide:'TRAINER_GYM_VOLT_DEFEATED' },
    { id:'GYM_LEADER_VOLT_DONE', name:'Volt', x:14, y:1, facing:'DOWN', spriteKey:'NPC_LEADER', movementType:'STATIONARY',
      dialogue:['GYM_VOLT_POST'], onInteract:null, requiresFlag:'TRAINER_GYM_VOLT_DEFEATED' },
  ],
  encounterTable:{grass:[],water:[]}, events:[],
};

DG.MAPS.BOGMIRE_GYM = {
  id:'BOGMIRE_GYM', name:'Bogmire City Gym', width:30, height:18,
  music:'GYM_THEME', isIndoor:true, isCave:false,
  tiles:[
    [65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65],
    [65, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,65],
    [65,65,65,65, 8, 8,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65, 8, 8,65,65,65,65],
    [65, 8, 8, 8, 8, 8, 8, 8, 8, 8,65,65,65,65,65,65,65,65,65,65, 8, 8, 8, 8, 8, 8, 8, 8, 8,65],
    [65,65,65,65,65, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,65,65,65,65,65],
    [65,65,65,65,65,65,65,65,65,65,65,65,65,65, 8, 8,65,65,65,65,65,65,65,65,65,65,65,65,65,65],
    [65, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,65],
    [65,65,65,65, 8, 8,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65, 8, 8,65,65,65,65],
    [65, 8, 8, 8, 8, 8, 8, 8, 8, 8,65,65,65,65,65,65,65,65,65,65, 8, 8, 8, 8, 8, 8, 8, 8, 8,65],
    [65,65,65,65,65, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,65,65,65,65,65],
    [65,65,65,65,65,65,65,65,65,65,65,65,65,65, 8, 8,65,65,65,65,65,65,65,65,65,65,65,65,65,65],
    [65, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,65],
    [65,65,65,65, 8, 8,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65, 8, 8,65,65,65,65],
    [65, 8, 8, 8, 8, 8, 8, 8, 8, 8,65,65,65,65,65,65,65,65,65,65, 8, 8, 8, 8, 8, 8, 8, 8, 8,65],
    [65,65,65,65,65, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,65,65,65,65,65],
    [65,65,65,65,65,65,65,65,65,65,65,65,65,65, 8, 8,65,65,65,65,65,65,65,65,65,65,65,65,65,65],
    [65, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,65],
    [65,65,65,65,65,65,65,65,65,65,65,65,65,65,68,68,65,65,65,65,65,65,65,65,65,65,65,65,65,65],
  ],
  warps:[
    { x:14, y:17, targetMap:'BOGMIRE_CITY', targetX:3, targetY:5, gymLock:'TRAINER_GYM_MARINA_DEFEATED' },
    { x:15, y:17, targetMap:'BOGMIRE_CITY', targetX:3, targetY:5, gymLock:'TRAINER_GYM_MARINA_DEFEATED' },
  ],
  npcs:[
    { id:'GYM_MARINA_HINT', name:'Fossil Scholar', x:7, y:16, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:["Welcome to Marina's Water-type Gym! Answer correctly: SHORT left path (1 trainer).",
        "Answer wrong: LONG right path (2 trainers)!",
        "Tip: Mudfin evolves into Swampjaw, NOT Marshfin!"], onInteract:null },
    { id:'GYM_MARINA_S1_QUIZ', name:'Tide Sage', x:14, y:15, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      onInteract:'TRIGGER_GYM_QUIZ', dialogue:["You've already answered. Move along!"],
      quizIntroKey:null, quizQuestion:"Mudfin evolves into...?",
      quizOptionA:'A) Swampjaw', quizOptionB:'B) Marshfin',
      quizCorrectFlag:'GYM_MARINA_S1_CORRECT', quizWrongFlag:'GYM_MARINA_S1_WRONG', quizDoneFlag:'GYM_MARINA_S1_DONE',
      correctResponse:'GYM_QUIZ_CORRECT', wrongResponse:'GYM_QUIZ_WRONG', flagToHide:'GYM_MARINA_S1_DONE' },
    { id:'GYM_MARINA_S1_GL', name:'Tide Gate', x:5, y:14, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:["Answer correctly to open the left path!"], onInteract:null, flagToHide:'GYM_MARINA_S1_CORRECT' },
    { id:'GYM_MARINA_S1_GR', name:'Tide Gate', x:24, y:14, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:["Answer wrong and you'll come through here!"], onInteract:null, flagToHide:'GYM_MARINA_S1_WRONG' },
    { id:'GYM_MARINA_S1_TC', name:'Swamp Diver', x:5, y:13, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:['GRUNT_1'], trainerRef:'MARINA_S1_TC', flagToHide:'TRAINER_MARINA_S1_TC_DEFEATED' },
    { id:'GYM_MARINA_S1_TW1', name:'Coral Scout', x:24, y:13, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:['GRUNT_2'], trainerRef:'MARINA_S1_TW1', flagToHide:'TRAINER_MARINA_S1_TW1_DEFEATED' },
    { id:'GYM_MARINA_S1_TW2', name:'Temple Diver', x:26, y:13, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:['GRUNT_2'], trainerRef:'MARINA_S1_TW2', flagToHide:'TRAINER_MARINA_S1_TW2_DEFEATED' },
    { id:'GYM_MARINA_S2_QUIZ', name:'Tide Sage', x:14, y:10, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      onInteract:'TRIGGER_GYM_QUIZ', dialogue:["You've already answered. Move along!"],
      quizIntroKey:null, quizQuestion:"Water is super effective vs...?",
      quizOptionA:'A) Fire, Ground and Rock', quizOptionB:'B) Fire, Rock and Grass',
      quizCorrectFlag:'GYM_MARINA_S2_CORRECT', quizWrongFlag:'GYM_MARINA_S2_WRONG', quizDoneFlag:'GYM_MARINA_S2_DONE',
      correctResponse:'GYM_QUIZ_CORRECT', wrongResponse:'GYM_QUIZ_WRONG', flagToHide:'GYM_MARINA_S2_DONE' },
    { id:'GYM_MARINA_S2_GL', name:'Tide Gate', x:5, y:9, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:["Answer correctly to open the left path!"], onInteract:null, flagToHide:'GYM_MARINA_S2_CORRECT' },
    { id:'GYM_MARINA_S2_GR', name:'Tide Gate', x:24, y:9, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:["Answer wrong and you'll come through here!"], onInteract:null, flagToHide:'GYM_MARINA_S2_WRONG' },
    { id:'GYM_MARINA_S2_TC', name:'Bog Walker', x:5, y:8, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:['GRUNT_1'], trainerRef:'MARINA_S2_TC', flagToHide:'TRAINER_MARINA_S2_TC_DEFEATED' },
    { id:'GYM_MARINA_S2_TW1', name:'Temple Coral', x:24, y:8, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:['GRUNT_2'], trainerRef:'MARINA_S2_TW1', flagToHide:'TRAINER_MARINA_S2_TW1_DEFEATED' },
    { id:'GYM_MARINA_S2_TW2', name:'Oracle Tide', x:26, y:8, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:['GRUNT_2'], trainerRef:'MARINA_S2_TW2', flagToHide:'TRAINER_MARINA_S2_TW2_DEFEATED' },
    { id:'GYM_MARINA_S3_QUIZ', name:'Tide Sage', x:14, y:5, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      onInteract:'TRIGGER_GYM_QUIZ', dialogue:["You've already answered. Move along!"],
      quizIntroKey:null, quizQuestion:"The Tide Badge unlocks which HM?",
      quizOptionA:'A) Surf', quizOptionB:'B) Dive',
      quizCorrectFlag:'GYM_MARINA_S3_CORRECT', quizWrongFlag:'GYM_MARINA_S3_WRONG', quizDoneFlag:'GYM_MARINA_S3_DONE',
      correctResponse:'GYM_QUIZ_CORRECT', wrongResponse:'GYM_QUIZ_WRONG', flagToHide:'GYM_MARINA_S3_DONE' },
    { id:'GYM_MARINA_S3_GL', name:'Tide Gate', x:5, y:4, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:["Answer correctly to open the left path!"], onInteract:null, flagToHide:'GYM_MARINA_S3_CORRECT' },
    { id:'GYM_MARINA_S3_GR', name:'Tide Gate', x:24, y:4, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:["Answer wrong and you'll come through here!"], onInteract:null, flagToHide:'GYM_MARINA_S3_WRONG' },
    { id:'GYM_MARINA_S3_TC', name:'Tide Master', x:5, y:3, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:['GRUNT_1'], trainerRef:'MARINA_S3_TC', flagToHide:'TRAINER_MARINA_S3_TC_DEFEATED' },
    { id:'GYM_MARINA_S3_TW1', name:'Deep Diver', x:24, y:3, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:['GRUNT_2'], trainerRef:'MARINA_S3_TW1', flagToHide:'TRAINER_MARINA_S3_TW1_DEFEATED' },
    { id:'GYM_MARINA_S3_TW2', name:'Bog Scout', x:26, y:3, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:['GRUNT_2'], trainerRef:'MARINA_S3_TW2', flagToHide:'TRAINER_MARINA_S3_TW2_DEFEATED' },
    { id:'GYM_LEADER_MARINA', name:'Marina', x:14, y:1, facing:'DOWN', spriteKey:'NPC_LEADER', movementType:'STATIONARY',
      dialogue:['GYM_MARINA_PRE'], onInteract:'TRIGGER_GYM', trainerRef:'GYM_MARINA', flagToHide:'TRAINER_GYM_MARINA_DEFEATED' },
    { id:'GYM_LEADER_MARINA_DONE', name:'Marina', x:14, y:1, facing:'DOWN', spriteKey:'NPC_LEADER', movementType:'STATIONARY',
      dialogue:['GYM_MARINA_POST'], onInteract:null, requiresFlag:'TRAINER_GYM_MARINA_DEFEATED' },
  ],
  encounterTable:{grass:[],water:[]}, events:[],
};

// NOTE: Wild zone warps and guard NPCs for FERNGROVE_TOWN, CRESTFALL_TOWN, BOGMIRE_CITY
// are defined directly in those maps' detailed definitions (below), not via push.

// ── STONEHAVEN_CITY guard NPCs (Dragon Gym / Drago / Bedrock Badge) ──
// Note: guard blocks Route 6 (west exit at x:0, y:10) and Route 7 (east exit at x:19, y:10)
(function() {
  const sh = DG.MAPS.STONEHAVEN_CITY;
  sh.npcs.push(
    { id:'SH_GUARD_W', name:'Officer', x:1, y:10, facing:'RIGHT', spriteKey:'NPC_MAN',
      movementType:'STATIONARY',
      dialogue:["The western route is blocked. Defeat Terra at the Stonehaven Gym first — you need the Bedrock Badge!"],
      flagToHide:'BADGE_5',
      onInteract: null },
    // Guard stepped aside (one tile north) after badge earned — no longer blocks the path
    { id:'SH_GUARD_W_DONE', name:'Officer', x:1, y:9, facing:'RIGHT', spriteKey:'NPC_MAN',
      movementType:'STATIONARY',
      dialogue:["The Bedrock Badge — Terra's mark. Routes 6 and 7 are now open!"],
      requiresFlag:'BADGE_5',
      onInteract: null }
  );
})();

// NOTE: Guard NPCs for CRESTFALL_TOWN and BOGMIRE_CITY are included
// directly in those maps' detailed definitions (below).

DG.MAPS.APEXSUMMIT_GYM = {
  id:'APEXSUMMIT_GYM', name:'Apex Summit Gym', width:30, height:18,
  music:'GYM_THEME', isIndoor:true, isCave:false,
  tiles:[
    [65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65],
    [65, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,65],
    [65,65,65,65, 6, 6,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65, 6, 6,65,65,65,65],
    [65, 6, 6, 6, 6, 6, 6, 6, 6, 6,65,65,65,65,65,65,65,65,65,65, 6, 6, 6, 6, 6, 6, 6, 6, 6,65],
    [65,65,65,65,65, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,65,65,65,65,65],
    [65,65,65,65,65,65,65,65,65,65,65,65,65,65, 6, 6,65,65,65,65,65,65,65,65,65,65,65,65,65,65],
    [65, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,65],
    [65,65,65,65, 6, 6,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65, 6, 6,65,65,65,65],
    [65, 6, 6, 6, 6, 6, 6, 6, 6, 6,65,65,65,65,65,65,65,65,65,65, 6, 6, 6, 6, 6, 6, 6, 6, 6,65],
    [65,65,65,65,65, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,65,65,65,65,65],
    [65,65,65,65,65,65,65,65,65,65,65,65,65,65, 6, 6,65,65,65,65,65,65,65,65,65,65,65,65,65,65],
    [65, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,65],
    [65,65,65,65, 6, 6,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65, 6, 6,65,65,65,65],
    [65, 6, 6, 6, 6, 6, 6, 6, 6, 6,65,65,65,65,65,65,65,65,65,65, 6, 6, 6, 6, 6, 6, 6, 6, 6,65],
    [65,65,65,65,65, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,65,65,65,65,65],
    [65,65,65,65,65,65,65,65,65,65,65,65,65,65, 6, 6,65,65,65,65,65,65,65,65,65,65,65,65,65,65],
    [65, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,65],
    [65,65,65,65,65,65,65,65,65,65,65,65,65,65,68,68,65,65,65,65,65,65,65,65,65,65,65,65,65,65],
  ],
  warps:[
    { x:14, y:17, targetMap:'APEXSUMMIT', targetX:9, targetY:12, gymLock:'TRAINER_GYM_VALDEZ_DEFEATED' },
    { x:15, y:17, targetMap:'APEXSUMMIT', targetX:9, targetY:12, gymLock:'TRAINER_GYM_VALDEZ_DEFEATED' },
  ],
  npcs:[
    { id:'GYM_VALDEZ_HINT', name:'Fossil Scholar', x:7, y:16, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:["Welcome to Valdez's Dragon-type Gym! Answer correctly: SHORT left path (1 trainer).",
        "Answer wrong: LONG right path (2 trainers)!",
        "Tip: Steel-type resists Dragon-type moves!"], onInteract:null },
    { id:'GYM_VALDEZ_S1_QUIZ', name:'Dragon Sage', x:14, y:15, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      onInteract:'TRIGGER_GYM_QUIZ', dialogue:["You've already answered. Move along!"],
      quizIntroKey:null, quizQuestion:"Dragon-type is resisted by...?",
      quizOptionA:'A) Steel', quizOptionB:'B) Water',
      quizCorrectFlag:'GYM_VALDEZ_S1_CORRECT', quizWrongFlag:'GYM_VALDEZ_S1_WRONG', quizDoneFlag:'GYM_VALDEZ_S1_DONE',
      correctResponse:'GYM_QUIZ_CORRECT', wrongResponse:'GYM_QUIZ_WRONG', flagToHide:'GYM_VALDEZ_S1_DONE' },
    { id:'GYM_VALDEZ_S1_GL', name:'Dragon Gate', x:5, y:14, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:["Answer correctly to open the left path!"], onInteract:null, flagToHide:'GYM_VALDEZ_S1_CORRECT' },
    { id:'GYM_VALDEZ_S1_GR', name:'Dragon Gate', x:24, y:14, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:["Answer wrong and you'll come through here!"], onInteract:null, flagToHide:'GYM_VALDEZ_S1_WRONG' },
    { id:'GYM_VALDEZ_S1_TC', name:'Dragon Scout', x:5, y:13, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:['GRUNT_1'], trainerRef:'VALDEZ_S1_TC', flagToHide:'TRAINER_VALDEZ_S1_TC_DEFEATED' },
    { id:'GYM_VALDEZ_S1_TW1', name:'Peak Warden', x:24, y:13, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:['GRUNT_2'], trainerRef:'VALDEZ_S1_TW1', flagToHide:'TRAINER_VALDEZ_S1_TW1_DEFEATED' },
    { id:'GYM_VALDEZ_S1_TW2', name:'Storm Knight', x:26, y:13, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:['GRUNT_2'], trainerRef:'VALDEZ_S1_TW2', flagToHide:'TRAINER_VALDEZ_S1_TW2_DEFEATED' },
    { id:'GYM_VALDEZ_S2_QUIZ', name:'Dragon Sage', x:14, y:10, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      onInteract:'TRIGGER_GYM_QUIZ', dialogue:["You've already answered. Move along!"],
      quizIntroKey:null, quizQuestion:"Skyfang's secondary type?",
      quizOptionA:'A) Psychic', quizOptionB:'B) Dark',
      quizCorrectFlag:'GYM_VALDEZ_S2_CORRECT', quizWrongFlag:'GYM_VALDEZ_S2_WRONG', quizDoneFlag:'GYM_VALDEZ_S2_DONE',
      correctResponse:'GYM_QUIZ_CORRECT', wrongResponse:'GYM_QUIZ_WRONG', flagToHide:'GYM_VALDEZ_S2_DONE' },
    { id:'GYM_VALDEZ_S2_GL', name:'Dragon Gate', x:5, y:9, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:["Answer correctly to open the left path!"], onInteract:null, flagToHide:'GYM_VALDEZ_S2_CORRECT' },
    { id:'GYM_VALDEZ_S2_GR', name:'Dragon Gate', x:24, y:9, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:["Answer wrong and you'll come through here!"], onInteract:null, flagToHide:'GYM_VALDEZ_S2_WRONG' },
    { id:'GYM_VALDEZ_S2_TC', name:'Ice Warden', x:5, y:8, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:['GRUNT_1'], trainerRef:'VALDEZ_S2_TC', flagToHide:'TRAINER_VALDEZ_S2_TC_DEFEATED' },
    { id:'GYM_VALDEZ_S2_TW1', name:'Dragon Knight', x:24, y:8, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:['GRUNT_2'], trainerRef:'VALDEZ_S2_TW1', flagToHide:'TRAINER_VALDEZ_S2_TW1_DEFEATED' },
    { id:'GYM_VALDEZ_S2_TW2', name:'Sky Scout', x:26, y:8, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:['GRUNT_2'], trainerRef:'VALDEZ_S2_TW2', flagToHide:'TRAINER_VALDEZ_S2_TW2_DEFEATED' },
    { id:'GYM_VALDEZ_S3_QUIZ', name:'Dragon Sage', x:14, y:5, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      onInteract:'TRIGGER_GYM_QUIZ', dialogue:["You've already answered. Move along!"],
      quizIntroKey:null, quizQuestion:"Dragon-type is weak to...?",
      quizOptionA:'A) Dragon and Ice', quizOptionB:'B) Dragon and Fire',
      quizCorrectFlag:'GYM_VALDEZ_S3_CORRECT', quizWrongFlag:'GYM_VALDEZ_S3_WRONG', quizDoneFlag:'GYM_VALDEZ_S3_DONE',
      correctResponse:'GYM_QUIZ_CORRECT', wrongResponse:'GYM_QUIZ_WRONG', flagToHide:'GYM_VALDEZ_S3_DONE' },
    { id:'GYM_VALDEZ_S3_GL', name:'Dragon Gate', x:5, y:4, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:["Answer correctly to open the left path!"], onInteract:null, flagToHide:'GYM_VALDEZ_S3_CORRECT' },
    { id:'GYM_VALDEZ_S3_GR', name:'Dragon Gate', x:24, y:4, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:["Answer wrong and you'll come through here!"], onInteract:null, flagToHide:'GYM_VALDEZ_S3_WRONG' },
    { id:'GYM_VALDEZ_S3_TC', name:'Dragon Master', x:5, y:3, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:['GRUNT_1'], trainerRef:'VALDEZ_S3_TC', flagToHide:'TRAINER_VALDEZ_S3_TC_DEFEATED' },
    { id:'GYM_VALDEZ_S3_TW1', name:'Storm Rider', x:24, y:3, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:['GRUNT_2'], trainerRef:'VALDEZ_S3_TW1', flagToHide:'TRAINER_VALDEZ_S3_TW1_DEFEATED' },
    { id:'GYM_VALDEZ_S3_TW2', name:'Peak Scout', x:26, y:3, facing:'DOWN', spriteKey:'NPC_MAN', movementType:'STATIONARY',
      dialogue:['GRUNT_2'], trainerRef:'VALDEZ_S3_TW2', flagToHide:'TRAINER_VALDEZ_S3_TW2_DEFEATED' },
    { id:'GYM_LEADER_VALDEZ', name:'Valdez', x:14, y:1, facing:'DOWN', spriteKey:'NPC_LEADER', movementType:'STATIONARY',
      dialogue:['GYM_VALDEZ_PRE'], onInteract:'TRIGGER_GYM', trainerRef:'GYM_VALDEZ', flagToHide:'TRAINER_GYM_VALDEZ_DEFEATED' },
    { id:'GYM_LEADER_VALDEZ_DONE', name:'Valdez', x:14, y:1, facing:'DOWN', spriteKey:'NPC_LEADER', movementType:'STATIONARY',
      dialogue:['GYM_VALDEZ_POST'], onInteract:null, requiresFlag:'TRAINER_GYM_VALDEZ_DEFEATED' },
  ],
  encounterTable:{grass:[],water:[]}, events:[],
};

// Simple centers and shops (minimal indoor)
['SHELLCREEK_CENTER','DUSTWALL_CENTER','PYRESIDE_CENTER','STONEHAVEN_CENTER',
 'CRESTFALL_CENTER','BOGMIRE_CENTER','APEXSUMMIT_CENTER','FERNGROVE_CENTER',
 'AMBERTOWN_SHOP','SHELLCREEK_SHOP','DUSTWALL_SHOP','PYRESIDE_SHOP',
 'STONEHAVEN_SHOP','APEXSUMMIT_SHOP',
 'FERNGROVE_TOWN','CRESTFALL_TOWN','BOGMIRE_CITY',
 'STONEHAVEN_MUSEUM'].forEach(function(id) {
  const isCenter = id.includes('CENTER');
  const isShop   = id.includes('SHOP');
  const _W2 = 16, _H2 = 12;
  DG.MAPS[id] = {
    id, name: id.replace(/_/g,' '), width: isCenter||isShop ? _W2 : 14, height: isCenter||isShop ? _H2 : 10,
    music: isCenter ? 'CENTER_THEME' : isShop ? 'SHOP_THEME' : 'TOWN_CALM',
    isIndoor: isCenter||isShop, isCave:false,
    tiles:(function(){
      const rows=[];
      if (isCenter) {
        const W2=_W2, H2=_H2;
        for(let r=0;r<H2;r++){
          const row=[];
          for(let c=0;c<W2;c++){
            if(r===0||r===1||r===2) row.push(65);
            else if(r===H2-1) row.push((c===7||c===8)?68:65);
            else if(c===0||c===W2-1) row.push(65);
            else if(r===3) row.push((c===7||c===8)?76:74);
            else if(r===8&&c===1) row.push(75);
            else if(r===8&&c===14) row.push(82);
            else if(r===5&&(c===2||c===13)) row.push(77);
            else if(r===6&&(c===2||c===3||c===12||c===13)) row.push(78);
            else row.push(5);
          }
          rows.push(row);
        }
      } else if (isShop) {
        const W2=_W2, H2=_H2;
        for(let r=0;r<H2;r++){
          const row=[];
          for(let c=0;c<W2;c++){
            if(r===0||c===0||c===W2-1) row.push(65);
            else if(r===H2-1) row.push((c===7||c===8)?68:65);
            else if(r===3&&c>=4&&c<=11) row.push(c===7||c===8?76:74);
            else row.push(5);
          }
          rows.push(row);
        }
      } else {
        for(let r=0;r<10;r++){
          const row=[];
          for(let c=0;c<14;c++){
            if(r===0||c===0||c===13) row.push(65);
            else if(r===9) row.push((c===6||c===7)?68:65);
            else row.push(1);
          }
          rows.push(row);
        }
      }
      return rows;
    })(),
    warps:(function(){
      const _P = {
        'SHELLCREEK_CENTER':'SHELLCREEK_CITY', 'SHELLCREEK_SHOP':'SHELLCREEK_CITY',
        'DUSTWALL_CENTER':'DUSTWALL_TOWN',     'DUSTWALL_SHOP':'DUSTWALL_TOWN',
        'PYRESIDE_CENTER':'PYRESIDE_CITY',     'PYRESIDE_SHOP':'PYRESIDE_CITY',
        'STONEHAVEN_CENTER':'STONEHAVEN_CITY', 'STONEHAVEN_SHOP':'STONEHAVEN_CITY',
        'STONEHAVEN_MUSEUM':'STONEHAVEN_CITY',
        'CRESTFALL_CENTER':'CRESTFALL_TOWN',
        'BOGMIRE_CENTER':'BOGMIRE_CITY',
        'FERNGROVE_CENTER':'FERNGROVE_TOWN',
        'APEXSUMMIT_CENTER':'APEXSUMMIT',      'APEXSUMMIT_SHOP':'APEXSUMMIT',
        'AMBERTOWN_SHOP':'AMBERTOWN',
        'FERNGROVE_TOWN':'ROUTE_4C',
        'CRESTFALL_TOWN':'ROUTE_6D',
        'BOGMIRE_CITY':'ROUTE_7D',
      };
      const t = _P[id] || id.replace(/_(CENTER|SHOP|MUSEUM)$/,'');
      // Override exit positions for specific maps to land in sensible spots
      const _EXIT_OVERRIDE = {
        'CRESTFALL_CENTER': { tx:10, ty:5 },
        'BOGMIRE_CENTER':   { tx:10, ty:5 },
        'FERNGROVE_TOWN':   { tx:9,  ty:1  },  // south exit → top of ROUTE_4
        'CRESTFALL_TOWN':   { tx:9,  ty:1  },  // south exit → top of ROUTE_6
        'BOGMIRE_CITY':     { tx:9,  ty:1  },  // south exit → top of ROUTE_7
      };
      const eo = _EXIT_OVERRIDE[id] || { tx:9, ty:12 };
      // Centers and shops use the wider 16x12 layout, others use 14x10
      const exitY  = isCenter||isShop ? 11 : 9;
      const exitX1 = isCenter||isShop ? 7  : 6;
      const exitX2 = isCenter||isShop ? 8  : 7;
      const exits = [{x:exitX1,y:exitY,targetMap:t,targetX:eo.tx,targetY:eo.ty},
                     {x:exitX2,y:exitY,targetMap:t,targetX:eo.tx,targetY:eo.ty}];
      // Add gym entrance for town maps
      const _GYM_LINK = {
        'FERNGROVE_TOWN':'FERNGROVE_GYM',
        'CRESTFALL_TOWN':'CRESTFALL_GYM',
        'BOGMIRE_CITY':'BOGMIRE_GYM',
      };
      if (_GYM_LINK[id]) {
        exits.push({x:3,y:4,targetMap:_GYM_LINK[id],targetX:10,targetY:13});
      }
      // Add center entrance for town maps
      const _CENTER_LINK = {
        'FERNGROVE_TOWN':'FERNGROVE_CENTER',
        'CRESTFALL_TOWN':'CRESTFALL_CENTER',
        'BOGMIRE_CITY':'BOGMIRE_CENTER',
      };
      if (_CENTER_LINK[id]) {
        exits.push({x:10,y:4,targetMap:_CENTER_LINK[id],targetX:7,targetY:8});
      }
      // Add north exit for mini towns that sit between two routes
      const _NORTH_LINK = {
        'FERNGROVE_TOWN': { map:'ROUTE_5', tx:9, ty:13 },  // PYRESIDE ↔ FERNGROVE ↔ STONEHAVEN
        'CRESTFALL_TOWN': { map:'ROUTE_8', tx:9, ty:13 },  // STONEHAVEN ↔ CRESTFALL ↔ ROUTE_10
        'BOGMIRE_CITY':   { map:'ROUTE_9', tx:9, ty:13 },  // STONEHAVEN ↔ BOGMIRE ↔ ROUTE_10
      };
      if (_NORTH_LINK[id]) {
        const nl = _NORTH_LINK[id];
        exits.push({x:6,y:1,targetMap:nl.map,targetX:nl.tx,targetY:nl.ty});
        exits.push({x:7,y:1,targetMap:nl.map,targetX:nl.tx,targetY:nl.ty});
      }
      return exits;
    })(),
    npcs: isCenter ? [
      { id:'HEALER_'+id, name:'Nurse Joy', x:7, y:2, facing:'DOWN', spriteKey:'NPC_HEALER',
        movementType:'STATIONARY', dialogue:['HEALER_GREET'], onInteract:'HEAL_PARTY' },
      { id:'HEALER_'+id+'_2', name:'Nurse Joy', x:8, y:2, facing:'DOWN', spriteKey:'NPC_HEALER',
        movementType:'STATIONARY', dialogue:['HEALER_GREET'], onInteract:'HEAL_PARTY' },
    ] : isShop ? [{
      id:'SHOP_'+id, name:'Shopkeeper', x:7, y:1, facing:'DOWN', spriteKey:'NPC_SHOPKEEPER',
      movementType:'STATIONARY', dialogue:['SHOP_GREET'], onInteract:'OPEN_SHOP',
      shopItems:['POTION','SUPERPOTION','DINOBALL','SUPERBALL','ANTIDOTE','REVIVE'],
    }] : [],
    encounterTable:{grass:[],water:[]}, events:[],
  };
});

// ═══════════════════════════════════════════════════════════════
// FEATURE 5: House interior upgrades — additional house maps
// ═══════════════════════════════════════════════════════════════

DG.MAPS.SHELLCREEK_HOUSE1 = {
  id:'SHELLCREEK_HOUSE1', name:'Sailor\'s Home', width:12, height:10,
  music:'HOUSE_THEME', isIndoor:true, isCave:false,
  tiles:[
    [65,65,65,65,65,65,65,65,65,65,65,65],
    [65,81,81, 5, 5, 5, 5, 5, 5,82, 5,65],
    [65, 5, 5, 5, 5, 5, 5, 5,80,80, 5,65],
    [65, 5, 5,77, 5, 5, 5, 5, 5, 5, 5,65],
    [65, 5, 5,78,78, 5, 5, 5, 5, 5, 5,65],
    [65, 5, 5,77, 5, 5, 5, 5, 5, 5, 5,65],
    [65,79, 5, 5, 5, 5, 5, 5, 5, 5, 5,65],
    [65, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,65],
    [65, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,65],
    [65,65,65,68,65,65,65,65,65,65,65,65],
  ],
  warps:[{ x:3, y:9, targetMap:'SHELLCREEK_CITY', targetX:4, targetY:10 }],
  npcs:[
    { id:'SAILOR_ELDER', name:'Old Sailor', x:6, y:4, facing:'LEFT', spriteKey:'NPC_MAN',
      movementType:'STATIONARY',
      dialogue:["In my day, DinoMons were wild and untameable...", "The seas were ruled by great Tidanosaurus packs.", "You youngsters have no idea how dangerous it used to be!"],
      onInteract:null },
    { id:'SAILOR_KID', name:'Kid', x:4, y:7, facing:'UP', spriteKey:'NPC_KID',
      movementType:'WANDER',
      dialogue:["I want to be the greatest DinoMon trainer ever!", "Grandpa says the ocean hides a hundred species we've never seen!"],
      onInteract:null },
    { id:'SAILOR_SHELF', name:'Shelf', x:1, y:1, facing:'DOWN', spriteKey:'NPC_MAN',
      movementType:'STATIONARY',
      dialogue:["(A collection of old maritime maps lines the shelf — some marked with curious symbols.)"],
      onInteract:null },
  ],
  encounterTable:{grass:[],water:[]}, events:[],
};

DG.MAPS.DUSTWALL_HOUSE1 = {
  id:'DUSTWALL_HOUSE1', name:'Desert Hermit\'s Hut', width:12, height:10,
  music:'HOUSE_THEME', isIndoor:true, isCave:false,
  tiles:[
    [65,65,65,65,65,65,65,65,65,65,65,65],
    [65,81, 5, 5, 5, 5, 5, 5,82, 5,81,65],
    [65, 5, 5, 5, 5, 5, 5,80,80, 5, 5,65],
    [65, 5,73, 5, 5, 5, 5, 5, 5, 5, 5,65],
    [65, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,65],
    [65, 5, 5,77, 5, 5, 5, 5, 5, 5, 5,65],
    [65, 5, 5,78,78, 5, 5, 5, 5, 5, 5,65],
    [65,79, 5, 5, 5, 5, 5, 5, 5, 5, 5,65],
    [65, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,65],
    [65,65,65,68,65,65,65,65,65,65,65,65],
  ],
  warps:[{ x:3, y:9, targetMap:'DUSTWALL_TOWN', targetX:5, targetY:9 }],
  npcs:[
    { id:'HERMIT', name:'Desert Hermit', x:6, y:5, facing:'DOWN', spriteKey:'NPC_MAN',
      movementType:'STATIONARY',
      dialogue:["Legend says there's a secret cave deep in the mountains...", "The ancient DinoMons carved it themselves, long before humans arrived.", "Some say the legendary CRATERON still sleeps there."],
      onInteract:null },
    { id:'HERMIT_FOSSIL', name:'Fossil Display', x:2, y:3, facing:'DOWN', spriteKey:'NPC_MAN',
      movementType:'STATIONARY',
      dialogue:["(A cracked fossil casing sits on the pedestal — something powerful hatched from it long ago.)"],
      onInteract:null },
  ],
  encounterTable:{grass:[],water:[]}, events:[],
};

// STONEHAVEN_HOUSE1 retired — it was unreachable (no door in town) and duplicated the
// empty, already-reachable STONEHAVEN_MUSEUM. Its historian exhibits now live in the museum.
DG.MAPS.STONEHAVEN_MUSEUM.npcs = [
    { id:'HISTORIAN', name:'Historian', x:7, y:3, facing:'DOWN', spriteKey:'NPC_PROF',
      movementType:'STATIONARY',
      dialogue:["The Fossil Citadel was built 800 years ago by the first Grand Archon.", "It is said the four Elite Four were chosen by the DinoMons themselves.", "Each one embodies a force of nature — water, fire, earth, shadow."],
      onInteract:null },
    { id:'HIST_SHELF_L', name:'Archive Left', x:2, y:1, facing:'DOWN', spriteKey:'NPC_MAN',
      movementType:'STATIONARY',
      dialogue:["(Rows of ancient scrolls. One reads: 'The Permian Core — a relic of mass extinction.')", "'Those who wield it command the end of all things.'"],
      onInteract:null },
    { id:'HIST_SHELF_R', name:'Archive Right', x:11, y:1, facing:'DOWN', spriteKey:'NPC_MAN',
      movementType:'STATIONARY',
      dialogue:["(A journal entry from 300 years ago.)", "'Saw a Primordia today. It looked at me and I felt nothing but awe.'"],
      onInteract:null },
    { id:'HIST_STATUE_L', name:'Fossil Statue', x:2, y:5, facing:'RIGHT', spriteKey:'NPC_MAN',
      movementType:'STATIONARY',
      dialogue:["(A perfectly preserved Ossifang skeleton. The placard reads: 'Found in Crestfall, 42 years ago.')"],
      onInteract:null },
    { id:'HIST_STATUE_R', name:'Dragon Fossil', x:10, y:5, facing:'LEFT', spriteKey:'NPC_MAN',
      movementType:'STATIONARY',
      dialogue:["(A carved dragon skull. Inscription: 'Skyfang — apex of the ancient sky hunters.')"],
      onInteract:null },
];

// ═══════════════════════════════════════════════════════════════
// PROPER CENTER MAPS (override forEach stubs) — v31
// ═══════════════════════════════════════════════════════════════

DG.MAPS.SHELLCREEK_CENTER = {
  id:'SHELLCREEK_CENTER', name:'DinoCenter — Shellcreek City', width:16, height:12,
  music:'CENTER_THEME', isIndoor:true, isCave:false,
  tiles: [
    [65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65],
    [65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65],
    [65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65],
    [65,74,74,74,74,74,74,76,76,74,74,74,74,74,74,65],
    [65, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,65],
    [65, 5,77, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,77, 5,65],
    [65, 5,78,78, 5, 5, 5, 5, 5, 5, 5,78,78, 5, 5,65],
    [65, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,65],
    [65,75, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,82, 5,65],
    [65, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,65],
    [65, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,65],
    [65,65,65,65,65,65,65,68,68,65,65,65,65,65,65,65],
  ],
  warps:[
    { x:7, y:11, targetMap:'SHELLCREEK_CITY', targetX:16, targetY:10 },
    { x:8, y:11, targetMap:'SHELLCREEK_CITY', targetX:16, targetY:10 },
  ],
  npcs:[
    { id:'HEALER_SC', name:'Nurse Rosa', x:7, y:2, facing:'DOWN',
      spriteKey:'NPC_HEALER', movementType:'STATIONARY',
      dialogue:['HEALER_GREET'], onInteract:'HEAL_PARTY' },
    { id:'HEALER_SC2', name:'Nurse Rosa', x:8, y:2, facing:'DOWN',
      spriteKey:'NPC_HEALER', movementType:'STATIONARY',
      dialogue:['HEALER_GREET'], onInteract:'HEAL_PARTY' },
    { id:'SC_CENTER_NPC1', name:'Trainer', x:5, y:5, facing:'RIGHT',
      spriteKey:'NPC_KID', movementType:'STATIONARY',
      dialogue:['CENTER_TIP_1'], onInteract:null },
    { id:'SC_CENTER_NPC2', name:'Visitor', x:10, y:5, facing:'LEFT',
      spriteKey:'NPC_WOMAN', movementType:'STATIONARY',
      dialogue:['CENTER_TIP_2'], onInteract:null },
  ],
  encounterTable:{ grass:[], water:[] }, events:[],
};

DG.MAPS.DUSTWALL_CENTER = {
  id:'DUSTWALL_CENTER', name:'DinoCenter — Dustwall Town', width:16, height:12,
  music:'CENTER_THEME', isIndoor:true, isCave:false,
  tiles: [
    [65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65],
    [65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65],
    [65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65],
    [65,74,74,74,74,74,74,76,76,74,74,74,74,74,74,65],
    [65, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,65],
    [65, 5,77, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,77, 5,65],
    [65, 5,78,78, 5, 5, 5, 5, 5, 5, 5,78,78, 5, 5,65],
    [65, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,65],
    [65,75, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,82, 5,65],
    [65, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,65],
    [65, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,65],
    [65,65,65,65,65,65,65,68,68,65,65,65,65,65,65,65],
  ],
  warps:[
    { x:7, y:11, targetMap:'DUSTWALL_TOWN', targetX:17, targetY:5 },
    { x:8, y:11, targetMap:'DUSTWALL_TOWN', targetX:17, targetY:5 },
  ],
  npcs:[
    { id:'HEALER_DW', name:'Nurse Rosa', x:7, y:2, facing:'DOWN',
      spriteKey:'NPC_HEALER', movementType:'STATIONARY',
      dialogue:['HEALER_GREET'], onInteract:'HEAL_PARTY' },
    { id:'HEALER_DW2', name:'Nurse Rosa', x:8, y:2, facing:'DOWN',
      spriteKey:'NPC_HEALER', movementType:'STATIONARY',
      dialogue:['HEALER_GREET'], onInteract:'HEAL_PARTY' },
    { id:'DW_CENTER_NPC1', name:'Trainer', x:5, y:5, facing:'RIGHT',
      spriteKey:'NPC_KID', movementType:'STATIONARY',
      dialogue:['CENTER_TIP_1'], onInteract:null },
    { id:'DW_CENTER_NPC2', name:'Visitor', x:10, y:5, facing:'LEFT',
      spriteKey:'NPC_WOMAN', movementType:'STATIONARY',
      dialogue:['CENTER_TIP_2'], onInteract:null },
  ],
  encounterTable:{ grass:[], water:[] }, events:[],
};

DG.MAPS.PYRESIDE_CENTER = {
  id:'PYRESIDE_CENTER', name:'DinoCenter — Pyreside City', width:16, height:12,
  music:'CENTER_THEME', isIndoor:true, isCave:false,
  tiles: [
    [65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65],
    [65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65],
    [65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65],
    [65,74,74,74,74,74,74,76,76,74,74,74,74,74,74,65],
    [65, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,65],
    [65, 5,77, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,77, 5,65],
    [65, 5,78,78, 5, 5, 5, 5, 5, 5, 5,78,78, 5, 5,65],
    [65, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,65],
    [65,75, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,82, 5,65],
    [65, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,65],
    [65, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,65],
    [65,65,65,65,65,65,65,68,68,65,65,65,65,65,65,65],
  ],
  warps:[
    { x:7, y:11, targetMap:'PYRESIDE_CITY', targetX:17, targetY:5 },
    { x:8, y:11, targetMap:'PYRESIDE_CITY', targetX:17, targetY:5 },
  ],
  npcs:[
    { id:'HEALER_PY', name:'Nurse Rosa', x:7, y:2, facing:'DOWN',
      spriteKey:'NPC_HEALER', movementType:'STATIONARY',
      dialogue:['HEALER_GREET'], onInteract:'HEAL_PARTY' },
    { id:'HEALER_PY2', name:'Nurse Rosa', x:8, y:2, facing:'DOWN',
      spriteKey:'NPC_HEALER', movementType:'STATIONARY',
      dialogue:['HEALER_GREET'], onInteract:'HEAL_PARTY' },
    { id:'PY_CENTER_NPC1', name:'Trainer', x:5, y:5, facing:'RIGHT',
      spriteKey:'NPC_KID', movementType:'STATIONARY',
      dialogue:['CENTER_TIP_1'], onInteract:null },
    { id:'PY_CENTER_NPC2', name:'Visitor', x:10, y:5, facing:'LEFT',
      spriteKey:'NPC_WOMAN', movementType:'STATIONARY',
      dialogue:['CENTER_TIP_2'], onInteract:null },
  ],
  encounterTable:{ grass:[], water:[] }, events:[],
};

DG.MAPS.STONEHAVEN_CENTER = {
  id:'STONEHAVEN_CENTER', name:'DinoCenter — Stonehaven City', width:16, height:12,
  music:'CENTER_THEME', isIndoor:true, isCave:false,
  tiles: [
    [65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65],
    [65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65],
    [65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65],
    [65,74,74,74,74,74,74,76,76,74,74,74,74,74,74,65],
    [65, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,65],
    [65, 5,77, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,77, 5,65],
    [65, 5,78,78, 5, 5, 5, 5, 5, 5, 5,78,78, 5, 5,65],
    [65, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,65],
    [65,75, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,82, 5,65],
    [65, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,65],
    [65, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,65],
    [65,65,65,65,65,65,65,68,68,65,65,65,65,65,65,65],
  ],
  warps:[
    { x:7, y:11, targetMap:'STONEHAVEN_CITY', targetX:17, targetY:5 },
    { x:8, y:11, targetMap:'STONEHAVEN_CITY', targetX:17, targetY:5 },
  ],
  npcs:[
    { id:'HEALER_SH', name:'Nurse Rosa', x:7, y:2, facing:'DOWN',
      spriteKey:'NPC_HEALER', movementType:'STATIONARY',
      dialogue:['HEALER_GREET'], onInteract:'HEAL_PARTY' },
    { id:'HEALER_SH2', name:'Nurse Rosa', x:8, y:2, facing:'DOWN',
      spriteKey:'NPC_HEALER', movementType:'STATIONARY',
      dialogue:['HEALER_GREET'], onInteract:'HEAL_PARTY' },
    { id:'SH_CENTER_NPC1', name:'Trainer', x:5, y:5, facing:'RIGHT',
      spriteKey:'NPC_KID', movementType:'STATIONARY',
      dialogue:['CENTER_TIP_1'], onInteract:null },
    { id:'SH_CENTER_NPC2', name:'Visitor', x:10, y:5, facing:'LEFT',
      spriteKey:'NPC_WOMAN', movementType:'STATIONARY',
      dialogue:['CENTER_TIP_2'], onInteract:null },
  ],
  encounterTable:{ grass:[], water:[] }, events:[],
};

DG.MAPS.APEXSUMMIT_CENTER = {
  id:'APEXSUMMIT_CENTER', name:'DinoCenter — Apex Summit', width:16, height:12,
  music:'CENTER_THEME', isIndoor:true, isCave:false,
  tiles: [
    [65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65],
    [65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65],
    [65,65,65,65,65,65,65,65,65,65,65,65,65,65,65,65],
    [65,74,74,74,74,74,74,76,76,74,74,74,74,74,74,65],
    [65, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,65],
    [65, 5,77, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,77, 5,65],
    [65, 5,78,78, 5, 5, 5, 5, 5, 5, 5,78,78, 5, 5,65],
    [65, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,65],
    [65,75, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,82, 5,65],
    [65, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,65],
    [65, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,65],
    [65,65,65,65,65,65,65,68,68,65,65,65,65,65,65,65],
  ],
  warps:[
    { x:7, y:11, targetMap:'APEXSUMMIT', targetX:17, targetY:5 },
    { x:8, y:11, targetMap:'APEXSUMMIT', targetX:17, targetY:5 },
  ],
  npcs:[
    { id:'HEALER_AS', name:'Nurse Rosa', x:7, y:2, facing:'DOWN',
      spriteKey:'NPC_HEALER', movementType:'STATIONARY',
      dialogue:['HEALER_GREET'], onInteract:'HEAL_PARTY' },
    { id:'HEALER_AS2', name:'Nurse Rosa', x:8, y:2, facing:'DOWN',
      spriteKey:'NPC_HEALER', movementType:'STATIONARY',
      dialogue:['HEALER_GREET'], onInteract:'HEAL_PARTY' },
    { id:'AS_CENTER_NPC1', name:'Trainer', x:5, y:5, facing:'RIGHT',
      spriteKey:'NPC_KID', movementType:'STATIONARY',
      dialogue:['CENTER_TIP_1'], onInteract:null },
    { id:'AS_CENTER_NPC2', name:'Visitor', x:10, y:5, facing:'LEFT',
      spriteKey:'NPC_WOMAN', movementType:'STATIONARY',
      dialogue:['CENTER_TIP_2'], onInteract:null },
  ],
  encounterTable:{ grass:[], water:[] }, events:[],
};

// ═══════════════════════════════════════════════════════════════
// PROPER SHOP MAPS (override forEach stubs) — v31
// ═══════════════════════════════════════════════════════════════

DG.MAPS.AMBERTOWN_SHOP = {
  id:'AMBERTOWN_SHOP', name:'PokéMart — Ambertown', width:12, height:10,
  music:'SHOP_THEME', isIndoor:true, isCave:false,
  tiles: [
    [65,65,65,65,65,65,65,65,65,65,65,65],
    [65,81,81,81,81,81,81,81,81,81,81,65],
    [65,74,74,74,74,74,74,74,74,74,74,65],
    [65, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,65],
    [65, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,65],
    [65, 5,77, 5, 5, 5, 5, 5, 5,79, 5,65],
    [65, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,65],
    [65, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,65],
    [65, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,65],
    [65,65,65,65,65,68,68,65,65,65,65,65],
  ],
  warps:[
    { x:5, y:9, targetMap:'AMBERTOWN', targetX:16, targetY:12 },
    { x:6, y:9, targetMap:'AMBERTOWN', targetX:16, targetY:12 },
  ],
  npcs:[
    { id:'SHOP_AMBER', name:'Shopkeeper', x:5, y:1, facing:'DOWN',
      spriteKey:'NPC_SHOPKEEPER', movementType:'STATIONARY',
      dialogue:['SHOP_GREET'], onInteract:'OPEN_SHOP',
      shopItems:['DINOBALL','POTION','ANTIDOTE'] },
  ],
  encounterTable:{ grass:[], water:[] }, events:[],
};

DG.MAPS.SHELLCREEK_SHOP = {
  id:'SHELLCREEK_SHOP', name:'PokéMart — Shellcreek City', width:12, height:10,
  music:'SHOP_THEME', isIndoor:true, isCave:false,
  tiles: [
    [65,65,65,65,65,65,65,65,65,65,65,65],
    [65,81,81,81,81,81,81,81,81,81,81,65],
    [65,74,74,74,74,74,74,74,74,74,74,65],
    [65, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,65],
    [65, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,65],
    [65, 5,77, 5, 5, 5, 5, 5, 5,79, 5,65],
    [65, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,65],
    [65, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,65],
    [65, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,65],
    [65,65,65,65,65,68,68,65,65,65,65,65],
  ],
  warps:[
    // FASE 9: uitgang wijst weer naar vóór de (in fase 8 verplaatste) deur
    { x:5, y:9, targetMap:'SHELLCREEK_CITY', targetX:15, targetY:6 },
    { x:6, y:9, targetMap:'SHELLCREEK_CITY', targetX:15, targetY:6 },
  ],
  npcs:[
    { id:'SHOP_SC', name:'Shopkeeper', x:5, y:1, facing:'DOWN',
      spriteKey:'NPC_SHOPKEEPER', movementType:'STATIONARY',
      dialogue:['SHOP_GREET'], onInteract:'OPEN_SHOP',
      // FASE 9: REVIVE al in stad 1 te koop; SUPERPOTION pas vanaf de volgende stad
      shopItems:['DINOBALL','SUPERBALL','POTION','REVIVE','ANTIDOTE','PARALYHEAL'] },
  ],
  encounterTable:{ grass:[], water:[] }, events:[],
};

DG.MAPS.DUSTWALL_SHOP = {
  id:'DUSTWALL_SHOP', name:'PokéMart — Dustwall Town', width:12, height:10,
  music:'SHOP_THEME', isIndoor:true, isCave:false,
  tiles: [
    [65,65,65,65,65,65,65,65,65,65,65,65],
    [65,81,81,81,81,81,81,81,81,81,81,65],
    [65,74,74,74,74,74,74,74,74,74,74,65],
    [65, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,65],
    [65, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,65],
    [65, 5,77, 5, 5, 5, 5, 5, 5,79, 5,65],
    [65, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,65],
    [65, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,65],
    [65, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,65],
    [65,65,65,65,65,68,68,65,65,65,65,65],
  ],
  warps:[
    { x:5, y:9, targetMap:'DUSTWALL_TOWN', targetX:16, targetY:9 },
    { x:6, y:9, targetMap:'DUSTWALL_TOWN', targetX:16, targetY:9 },
  ],
  npcs:[
    { id:'SHOP_DW', name:'Shopkeeper', x:5, y:1, facing:'DOWN',
      spriteKey:'NPC_SHOPKEEPER', movementType:'STATIONARY',
      dialogue:['SHOP_GREET'], onInteract:'OPEN_SHOP',
      shopItems:['SUPERBALL','SUPERPOTION','REVIVE','ANTIDOTE','PARALYHEAL','BURNHEAL','AWAKENING'] },
  ],
  encounterTable:{ grass:[], water:[] }, events:[],
};

DG.MAPS.PYRESIDE_SHOP = {
  id:'PYRESIDE_SHOP', name:'PokéMart — Pyreside City', width:12, height:10,
  music:'SHOP_THEME', isIndoor:true, isCave:false,
  tiles: [
    [65,65,65,65,65,65,65,65,65,65,65,65],
    [65,81,81,81,81,81,81,81,81,81,81,65],
    [65,74,74,74,74,74,74,74,74,74,74,65],
    [65, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,65],
    [65, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,65],
    [65, 5,77, 5, 5, 5, 5, 5, 5,79, 5,65],
    [65, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,65],
    [65, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,65],
    [65, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,65],
    [65,65,65,65,65,68,68,65,65,65,65,65],
  ],
  warps:[
    { x:5, y:9, targetMap:'PYRESIDE_CITY', targetX:17, targetY:9 },
    { x:6, y:9, targetMap:'PYRESIDE_CITY', targetX:17, targetY:9 },
  ],
  npcs:[
    { id:'SHOP_PY', name:'Shopkeeper', x:5, y:1, facing:'DOWN',
      spriteKey:'NPC_SHOPKEEPER', movementType:'STATIONARY',
      dialogue:['SHOP_GREET'], onInteract:'OPEN_SHOP',
      shopItems:['SUPERBALL','ULTRABALL','SUPERPOTION','REVIVE','HYPERPOTION','FULLHEAL'] },
  ],
  encounterTable:{ grass:[], water:[] }, events:[],
};

DG.MAPS.STONEHAVEN_SHOP = {
  id:'STONEHAVEN_SHOP', name:'PokéMart — Stonehaven City', width:12, height:10,
  music:'SHOP_THEME', isIndoor:true, isCave:false,
  tiles: [
    [65,65,65,65,65,65,65,65,65,65,65,65],
    [65,81,81,81,81,81,81,81,81,81,81,65],
    [65,74,74,74,74,74,74,74,74,74,74,65],
    [65, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,65],
    [65, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,65],
    [65, 5,77, 5, 5, 5, 5, 5, 5,79, 5,65],
    [65, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,65],
    [65, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,65],
    [65, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,65],
    [65,65,65,65,65,68,68,65,65,65,65,65],
  ],
  warps:[
    { x:5, y:9, targetMap:'STONEHAVEN_CITY', targetX:4, targetY:9 },
    { x:6, y:9, targetMap:'STONEHAVEN_CITY', targetX:4, targetY:9 },
  ],
  npcs:[
    { id:'SHOP_SH', name:'Shopkeeper', x:5, y:1, facing:'DOWN',
      spriteKey:'NPC_SHOPKEEPER', movementType:'STATIONARY',
      dialogue:['SHOP_GREET'], onInteract:'OPEN_SHOP',
      shopItems:['ULTRABALL','HYPERPOTION','FULLHEAL','MAXPOTION','REVIVE'] },
  ],
  encounterTable:{ grass:[], water:[] }, events:[],
};

DG.MAPS.APEXSUMMIT_SHOP = {
  id:'APEXSUMMIT_SHOP', name:'PokéMart — Apex Summit', width:12, height:10,
  music:'SHOP_THEME', isIndoor:true, isCave:false,
  tiles: [
    [65,65,65,65,65,65,65,65,65,65,65,65],
    [65,81,81,81,81,81,81,81,81,81,81,65],
    [65,74,74,74,74,74,74,74,74,74,74,65],
    [65, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,65],
    [65, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,65],
    [65, 5,77, 5, 5, 5, 5, 5, 5,79, 5,65],
    [65, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,65],
    [65, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,65],
    [65, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,65],
    [65,65,65,65,65,68,68,65,65,65,65,65],
  ],
  warps:[
    { x:5, y:9, targetMap:'APEXSUMMIT', targetX:15, targetY:9 },
    { x:6, y:9, targetMap:'APEXSUMMIT', targetX:15, targetY:9 },
  ],
  npcs:[
    { id:'SHOP_AS', name:'Shopkeeper', x:5, y:1, facing:'DOWN',
      spriteKey:'NPC_SHOPKEEPER', movementType:'STATIONARY',
      dialogue:['SHOP_GREET'], onInteract:'OPEN_SHOP',
      shopItems:['ULTRABALL','AMBERBALL','MAXPOTION','FULLRESTORE','FULLHEAL','REVIVE'] },
  ],
  encounterTable:{ grass:[], water:[] }, events:[],
};

// ═══════════════════════════════════════════════════════════════
// PROPER TOWN MAPS — FERNGROVE_TOWN, CRESTFALL_TOWN, BOGMIRE_CITY
// (override forEach stubs with real outdoor maps)
// ═══════════════════════════════════════════════════════════════

DG.MAPS.FERNGROVE_TOWN = {
  id:'FERNGROVE_TOWN', name:'Ferngrove Town', width:20, height:15,
  music:'TOWN_CALM', isIndoor:false, isCave:false,
  tiles: [
    [64,64,64,64,64,64,64,64,64, 1, 1,64,64,64,64,64,64,64,64,64],
    [64, 1, 1, 9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9, 1,64],
    [64, 1,65,65,65,65, 1, 1, 1, 1, 1, 1, 1,65,65,65,65,65, 1,64],
    [64, 1,65,65,65,65, 1, 1, 1, 1, 1, 1, 1,65,75,65,76,68, 1,64],
    [64, 1,65,68,65,65, 1, 1, 1, 1, 1, 1, 1,65,65,65,65,65, 1,64],
    [64, 1, 1, 1, 1, 9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,64],
    [64, 1,65,65,65,65,65,65, 1, 1, 1, 1,65,65,65,65, 1, 1, 1,64],
    [64, 1,65,65,65,65,65,65, 1, 1, 1, 1,65,65,65,65, 1, 9, 1,64],
    [64, 1,65,68,65,65,65,65, 1, 1, 1, 1,65,68,65,65, 1, 1, 1,64],
    [64, 1, 1, 1, 1, 1, 1, 1, 1, 1,67, 1, 1, 1, 1, 1, 1, 1, 1,64],
    [64, 9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9,64],
    [64, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2,64],
    [64, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2,64],
    [64,64, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,64,64],
    [64,64,64,64,64,64,64,64,64, 1, 1,64,64,64,64,64,64,64,64,64],
  ],
  warps:[
    { x:9,  y:0,  targetMap:'ROUTE_5A',       targetX:9,  targetY:1  },
    { x:10, y:0,  targetMap:'ROUTE_5A',       targetX:10, targetY:1  },
    { x:9,  y:14, targetMap:'ROUTE_4C',       targetX:9,  targetY:20 },
    { x:10, y:14, targetMap:'ROUTE_4C',       targetX:10, targetY:20 },
    { x:3,  y:4,  targetMap:'FERNGROVE_GYM', targetX:14, targetY:16 },
    { x:17, y:3,  targetMap:'FERNGROVE_CENTER', targetX:7, targetY:8 },
    { x:13, y:8,  targetMap:'FERNGROVE_CENTER', targetX:7, targetY:8 },
    { x:12, y:5,  targetMap:'FERNGROVE_WILD', targetX:1, targetY:6 },
    { x:12, y:6,  targetMap:'FERNGROVE_WILD', targetX:1, targetY:7 },
  ],
  npcs:[
    { id:'FN_NPC1', name:'Botanist', x:7, y:9, facing:'DOWN', spriteKey:'NPC_MAN',
      movementType:'WANDER', dialogue:['NPC_FERNGROVE_1'], onInteract:null },
    { id:'FN_NPC2', name:'Herbalist', x:13, y:5, facing:'LEFT', spriteKey:'NPC_WOMAN',
      movementType:'STATIONARY', dialogue:['NPC_FERNGROVE_2'], onInteract:null },
    { id:'FN_GUARD', name:'Officer', x:6, y:1, facing:'DOWN', spriteKey:'NPC_MAN',
      movementType:'STATIONARY',
      dialogue:["The road to Stonehaven is blocked. Defeat Sylva at the Ferngrove Gym first — you need the Canopy Badge!"],
      flagToHide:'BADGE_4', onInteract:null },
    // Guard stepped aside (one tile right) after badge earned — no longer blocks the path
    { id:'FN_GUARD_DONE', name:'Officer', x:7, y:1, facing:'DOWN', spriteKey:'NPC_MAN',
      movementType:'STATIONARY',
      dialogue:["The Canopy Badge — Sylva's mark. Route 5 to Stonehaven lies ahead — good luck!"],
      requiresFlag:'BADGE_4', onInteract:null },
  ],
  encounterTable:{ grass:[
    { speciesId:'FRONDLET',  minLv:24, maxLv:28, rate:35 },
    { speciesId:'BUGLING',   minLv:24, maxLv:28, rate:35 },
    { speciesId:'SOARWING',  minLv:24, maxLv:27, rate:30 },
  ], water:[]},
  events:[],
};

DG.MAPS.CRESTFALL_TOWN = {
  id:'CRESTFALL_TOWN', name:'Crestfall Town', width:20, height:15,
  music:'TOWN_CALM', isIndoor:false, isCave:false,
  tiles: [
    [66,66,66,66,66,66,66,66,66, 5, 5,66,66,66,66,66,66,66,66,66],
    [66, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,66],
    [66, 5,65,65,65,65, 5, 5, 5, 5, 5, 5,65,65,65,65,65,65, 5,66],
    [66, 5,65,65,65,65, 5, 5, 5, 5, 5, 5,65,75,65,76,65,68, 5,66],
    [66, 5,65,68,65,65, 5, 5, 5, 5, 5, 5,65,65,65,65,65,65, 5,66],
    [66, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,66],
    [66, 5,65,65,65,65,65,65, 5, 5, 5, 5, 5,65,65,65,65,65, 5,66],
    [66, 5,65,65,65,65,65,65, 5, 5, 5, 5, 5,65,65,65,65,65, 5,66],
    [66, 5,65,68,65,65,65,65, 5, 5, 5, 5, 5,65,68,65,65,65, 5,66],
    [66, 5, 5, 5, 5, 5, 5, 5, 5, 5,67, 5, 5, 5, 5, 5, 5, 5, 5,66],
    [66, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,66],
    [66, 1, 1, 1, 1, 1, 1, 1, 5, 5, 5, 5, 1, 1, 1, 1, 1, 1, 1,66],
    [66, 2, 2, 2, 2, 2, 2, 1, 5, 5, 5, 5, 1, 2, 2, 2, 2, 2, 2,66],
    [66,66, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,66,66],
    [66,66,66,66,66,66,66,66,66, 5, 5,66,66,66,66,66,66,66,66,66],
  ],
  warps:[
    { x:9,  y:0,  targetMap:'ROUTE_8A',       targetX:9,  targetY:1  },
    { x:10, y:0,  targetMap:'ROUTE_8A',       targetX:10, targetY:1  },
    { x:9,  y:14, targetMap:'ROUTE_6D',       targetX:9,  targetY:26 },
    { x:10, y:14, targetMap:'ROUTE_6D',       targetX:10, targetY:26 },
    { x:3,  y:4,  targetMap:'CRESTFALL_GYM', targetX:14, targetY:16 },
    { x:17, y:3,  targetMap:'CRESTFALL_CENTER', targetX:7, targetY:8 },
    { x:14, y:8,  targetMap:'CRESTFALL_CENTER', targetX:7, targetY:8 },
    { x:12, y:5,  targetMap:'CRESTFALL_WILD', targetX:1, targetY:6 },
    { x:12, y:6,  targetMap:'CRESTFALL_WILD', targetX:1, targetY:7 },
  ],
  npcs:[
    { id:'CF_NPC1', name:'Climber', x:7, y:9, facing:'DOWN', spriteKey:'NPC_MAN',
      movementType:'WANDER', dialogue:['NPC_CRESTFALL_1'], onInteract:null },
    { id:'CF_NPC2', name:'Ranger', x:13, y:5, facing:'LEFT', spriteKey:'NPC_MAN',
      movementType:'STATIONARY', dialogue:['NPC_CRESTFALL_2'], onInteract:null },
    { id:'CF_GUARD', name:'Officer', x:6, y:1, facing:'DOWN', spriteKey:'NPC_MAN',
      movementType:'STATIONARY',
      dialogue:["The road ahead is blocked. Defeat Volt at the Crestfall Gym first — you need the Static Badge!"],
      flagToHide:'BADGE_6', onInteract:null },
    // Guard stepped aside (one tile right) after badge earned — no longer blocks the path
    { id:'CF_GUARD_DONE', name:'Officer', x:7, y:1, facing:'DOWN', spriteKey:'NPC_MAN',
      movementType:'STATIONARY',
      dialogue:["The Static Badge — Volt's mark. Route 8 toward Bogmire lies ahead — good luck!"],
      requiresFlag:'BADGE_6', onInteract:null },
  ],
  encounterTable:{ grass:[
    { speciesId:'SPARKHORN', minLv:36, maxLv:40, rate:35 },
    { speciesId:'STORMWING', minLv:36, maxLv:40, rate:35 },
    { speciesId:'SHADOWLET', minLv:35, maxLv:39, rate:30 },
  ], water:[]},
  events:[],
};

DG.MAPS.BOGMIRE_CITY = {
  id:'BOGMIRE_CITY', name:'Bogmire City', width:20, height:15,
  music:'TOWN_CALM', isIndoor:false, isCave:false,
  tiles: [
    [64,64,64,64,64,64,64,64,64, 8, 8,64,64,64,64,64,64,64,64,64],
    [64, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,64],
    [64, 8,65,65,65,65, 8, 8, 8, 8, 8, 8, 8,65,65,65,65,65, 8,64],
    [64, 8,65,65,65,65, 8, 8, 8, 8, 8, 8, 8,65,75,65,76,68, 8,64],
    [64, 8,65,68,65,65, 8, 8, 8, 8, 8, 8, 8,65,65,65,65,65, 8,64],
    [64, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,64],
    [64, 8,65,65,65,65,65,65, 8, 8, 8, 8,65,65,65,65, 8, 8, 8,64],
    [64, 8,65,65,65,65,65,65, 8, 8, 8, 8,65,65,65,65, 8, 8, 8,64],
    [64, 8,65,68,65,65,65,65, 8, 8, 8, 8,65,68,65,65, 8, 8, 8,64],
    [64, 8, 8, 8, 8, 8, 8, 8, 8, 0,67, 8, 8, 8, 8, 8, 8, 8, 8,64],
    [64, 8, 8, 8, 8, 8, 8, 8, 8, 0, 0, 8, 8, 8, 8, 8, 8, 8, 8,64],
    [64, 8, 8, 8, 8, 8, 8, 8, 0, 0, 0, 0, 8, 8, 8, 8, 8, 8, 8,64],
    [64, 3, 3, 3, 3, 3, 3, 8, 0, 0, 0, 0, 8, 3, 3, 3, 3, 3, 3,64],
    [64,64, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,64,64],
    [64,64,64,64,64,64,64,64,64, 8, 8,64,64,64,64,64,64,64,64,64],
  ],
  warps:[
    { x:9,  y:0,  targetMap:'ROUTE_9A',    targetX:9,  targetY:1  },
    { x:10, y:0,  targetMap:'ROUTE_9A',    targetX:10, targetY:1  },
    { x:9,  y:14, targetMap:'ROUTE_7D',    targetX:9,  targetY:26 },
    { x:10, y:14, targetMap:'ROUTE_7D',    targetX:10, targetY:26 },
    { x:3,  y:4,  targetMap:'BOGMIRE_GYM',    targetX:14, targetY:16 },
    { x:17, y:3,  targetMap:'BOGMIRE_CENTER',  targetX:7,  targetY:8 },
    { x:13, y:8,  targetMap:'BOGMIRE_CENTER',  targetX:7,  targetY:8 },
    { x:12, y:5,  targetMap:'BOGMIRE_WILD', targetX:1, targetY:6 },
    { x:12, y:6,  targetMap:'BOGMIRE_WILD', targetX:1, targetY:7 },
  ],
  npcs:[
    { id:'BG_NPC1', name:'Fisherman', x:7, y:9, facing:'DOWN', spriteKey:'NPC_MAN',
      movementType:'WANDER', dialogue:['NPC_BOGMIRE_1'], onInteract:null },
    { id:'BG_NPC2', name:'Swamp Guide', x:13, y:5, facing:'LEFT', spriteKey:'NPC_MAN',
      movementType:'STATIONARY', dialogue:['NPC_BOGMIRE_2'], onInteract:null },
    { id:'BG_GUARD', name:'Officer', x:6, y:1, facing:'DOWN', spriteKey:'NPC_MAN',
      movementType:'STATIONARY',
      dialogue:["The road to Apex Summit is blocked. Defeat Marina at the Bogmire Gym first — you'll need the Tide Badge!"],
      flagToHide:'BADGE_7', onInteract:null },
    // Guard stepped aside (one tile right) after badge earned — no longer blocks the path
    { id:'BG_GUARD_DONE', name:'Officer', x:7, y:1, facing:'DOWN', spriteKey:'NPC_MAN',
      movementType:'STATIONARY',
      dialogue:["The Tide Badge — Marina's mark. The path to Apex Summit is open. And with Surf, the waterways are yours!"],
      requiresFlag:'BADGE_7', onInteract:null },
    { id:'BG_GYM_SIGN', name:'Sign', x:5, y:5, facing:'DOWN', spriteKey:'NPC_MAN',
      movementType:'STATIONARY',
      dialogue:["Bogmire City Gym — Marina, Water-type specialist.", "Defeat her to earn the Tide Badge and unlock Surf on the open sea!"],
      onInteract:null },
    { id:'FLINT_BOGMIRE', name:'Flint', x:9, y:6, facing:'DOWN', spriteKey:'NPC_RIVAL',
      movementType:'STATIONARY', dialogue:['DOUBLE_BATTLE_PRE'], onInteract:'TRIGGER_DOUBLE_BATTLE',
      requiresFlag:'BADGE_6', flagToHide:'DOUBLE_BATTLE_DONE' },
  ],
  encounterTable:{ grass:[
    { speciesId:'MUDFIN',   minLv:42, maxLv:47, rate:35 },
    { speciesId:'MARSHFIN', minLv:42, maxLv:47, rate:35 },
    { speciesId:'SHADOWLET',minLv:40, maxLv:45, rate:30 },
  ], water:[
    { speciesId:'MUDFIN',   minLv:44, maxLv:49, rate:50 },
    { speciesId:'MARSHFIN', minLv:44, maxLv:49, rate:50 },
  ]},
  events:[],
};

// ═══════════════════════════════════════════════════════════════
// AMBERTOWN_HOUSE2 — additional resident house in Ambertown
// (the original AMBERTOWN_HOUSE is your home; this is a neighbor)
// ═══════════════════════════════════════════════════════════════


// ── FASE 8: gym-labyrint dichtmetselen ────────────────────────────────────
// De quiz-muren hadden een opening van 2 tegels waarvan de quizmaster er maar
// 1 blokkeert, en de zijpaden waren 4-5 tegels breed met maar 1 Energy Gate.
// Deze patch sluit alle lekken voor álle 30×18-quiz-gyms in één keer:
//  - quiz-opening wordt 1 tegel (x14) — de quizmaster staat erop en verdwijnt
//    pas als je zijn vraag beantwoordt (bestaand vlag-systeem)
//  - doorgangen naar de zijpaden alleen nog via de gate-tegels (x5 en x24);
//    het pad van jouw antwoord gaat open: goed = kort (1 trainer),
//    fout = lang (2 trainers)
(function _patchGymLabyrinths() {
  for (const key in DG.MAPS) {
    const m = DG.MAPS[key];
    if (!m || m.music !== 'GYM_THEME' || m.width !== 30 || m.height !== 18 || !m.tiles) continue;
    [15, 10, 5].forEach((y) => { if (m.tiles[y]) m.tiles[y][15] = 65; });       // quiz-muren
    [13, 8, 3].forEach((y) => {                                                  // zijpad-rijen
      if (!m.tiles[y]) return;
      for (let x = 6;  x <= 9;  x++) m.tiles[y][x] = 65;
      for (let x = 20; x <= 23; x++) m.tiles[y][x] = 65;
    });
    // FASE 9: de tweede foute-pad-trainer kijkt de gang in (LEFT) — zo spot
    // hij je via line-of-sight zodra je binnenkomt en valt hij vanzelf aan,
    // in plaats van dat je hem moet aanspreken (of kunt negeren)
    (m.npcs || []).forEach((n) => {
      if (n && /_TW2$/.test(n.id || '')) n.facing = 'LEFT';
    });
  }
})();

// ── FASE 12: hekken langs de weg ────────────────────────────────────────────
// Op Route 1 worden boom-blokken (64) die direct naast het pad (0) staan
// vervangen door hek-tegels (70). Beide zijn solide → loopbaarheid identiek.
(function _placeFences() {
  ['ROUTE_1', 'ROUTE_1A', 'ROUTE_1B'].forEach((id) => {
    const m = DG.MAPS[id];
    if (!m || !m.tiles) return;
    for (let y = 1; y < m.tiles.length - 1; y++) {
      const row = m.tiles[y];
      if (!row) continue;
      for (let x = 1; x < row.length - 1; x++) {
        if (row[x] !== 64) continue;
        if (row[x - 1] === 0 || row[x + 1] === 0) row[x] = 70;
      }
    }
  });
})();

DG.MAP_LIST = Object.keys(DG.MAPS);
console.log('[DinoMon] Maps loaded: ' + DG.MAP_LIST.length);

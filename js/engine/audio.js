// DinoMon: Fossil Frontier — engine/audio.js  v12
// Multi-voice procedural music with Web Audio lookahead scheduler + SFX

window.DG = window.DG || {};

DG.Audio = (function () {

  let _ctx, _masterGain, _musicGain, _sfxGain;
  let _currentMusic = null;

  // ── FASE 3: effects-bussen & adaptieve staat ──────────────
  let _comp = null;        // master-compressor (glue)
  let _reverb = null;      // convolver met procedurele impulse-response
  let _reverbGain = null;  // return-niveau van de reverb
  let _revSendMusic = null, _revSendSfx = null;
  let _delaySend = null, _delayGain = null;  // echo-bus voor jingles/signatures
  let _uiGain = null;      // droge bus voor UI-blips (geen reverb)
  let _analyser = null;    // meetpunt voor verificatie
  let _musicVol = 0.5;     // door de speler ingestelde muziekvolume
  let _intensity = 0;      // 0 = normaal, 1 = lage-HP battle-laag

  // ── Lookahead scheduler ───────────────────────────────────
  // FASE 8: ruimer vooruitplannen — 0,15s/50ms was te krap: één druk frame
  // (render + GC) en het ingeplande geluid was op → haperen
  const LOOKAHEAD  = 0.40; // seconds to schedule ahead
  const SCHED_MS   = 100;  // scheduler poll interval
  let _schedHandle = null;
  let _trackData   = null;
  let _nextBeat    = 0;
  let _beatIdx     = 0;

  // ── Frequency helper ──────────────────────────────────────
  const _f = (root, semi) => root * Math.pow(2, semi / 12);

  // ── Track definitions ─────────────────────────────────────
  // Each track drives 4 simultaneous voices:
  //   melody  — triangle wave, every beat, played 1 octave up from root
  //   bass    — square wave,   every 2 beats, 1 octave below root
  //   harmony — sine wave,     every 4 beats, at root (+ auto fifth)
  //   drums   — per beat: 'K'=kick  'S'=snare  'H'=hihat  '-'=rest
  // null in any pattern = rest that slot.

  const T = {
    // ── Towns ────────────────────────────────────────────────
    // FASE 13: hergecomponeerd — warm thuisdorp-thema (Pallet-gevoel), I-IV-I-V
    AMBERTOWN: {
      bpm:104, root:261.63,
      melody:  [4,null,7,4, 9,7,5,4, 2,null,5,2, 7,5,4,2],
      melodyB: [4,7,9,12, 11,9,7,9, 12,null,9,7, 4,null,2,null],
      counter: [0,null,null,null, 5,null,null,null, 0,null,4,null, 7,null,4,null],
      chords:  [[0,4,7],[5,9,12],[0,4,7],[7,11,14]],
      bass:    [0,0,5,5, 0,0,7,7],
      harmony: [7,9, 7,7],
      drums:   ['K','-','H','-','K','H','-','H','K','-','H','S','K','H','H','-'],
    },
    TOWN_CALM: {
      bpm:100, root:261.63,
      melody:  [0,4,7,9,7,4,0,2, 4,7,9,12,9,7,5,4],
      bass:    [0,0,5,5, 7,7,5,0],
      harmony: [7,9, 7,7],
      drums:   ['K','-','-','H','-','-','H','-','K','-','-','H','-','H','-','-'],
    },
    TOWN_UPBEAT: {
      bpm:132, root:349.23,
      melody:  [0,2,4,5,7,9,7,5, 4,2,0,2,4,7,5,4],
      bass:    [0,0,5,5, 7,5,0,7],
      harmony: [4,5, 7,4],
      drums:   ['K','H','-','H','K','H','S','H','K','H','-','H','K','H','S','H'],
    },
    TOWN_DESERT: {
      bpm:108, root:246.94,
      melody:  [0,2,3,7,10,7,5,3, 5,7,8,10,8,7,5,3],
      bass:    [-12,-12,-7,-7, -5,-5,-7,-12],
      harmony: [7,5, 7,8],
      drums:   ['K','-','H','H','K','H','S','-','K','H','H','-','K','-','S','H'],
    },
    TOWN_INDUSTRIAL: {
      bpm:120, root:220,
      melody:  [0,3,5,7,10,7,5,3, 5,7,10,12,10,7,5,0],
      bass:    [-12,-12,-7,-7, -5,-5,-7,-12],
      harmony: [7,10, 7,5],
      drums:   ['K','H','S','H','K','H','S','H','K','H','S','H','K','H','S','H'],
    },
    TOWN_GRAND: {
      bpm:116, root:329.63,
      melody:  [0,4,7,11,12,11,9,7, 9,11,12,16,14,12,9,7],
      bass:    [-12,-12,-7,-5, -3,-5,-7,-12],
      harmony: [7,11, 9,7],
      drums:   ['K','-','H','H','K','H','S','H','K','-','H','H','S','H','H','-'],
    },
    TOWN_PEAK: {
      bpm:124, root:349.23,
      melody:  [0,4,7,9,12,14,12,9, 11,12,14,16,14,12,9,7],
      bass:    [-12,-5,-3,-7, -5,-3,-7,-12],
      harmony: [7,9, 12,9],
      drums:   ['K','H','H','-','K','H','S','H','K','H','-','H','S','H','K','H'],
    },
    // ── Routes ───────────────────────────────────────────────
    // FASE 13: hergecomponeerd — avontuurlijk routethema (I-V-vi-IV)
    ROUTE_1: {
      bpm:118, root:293.66,
      melody:  [0,2,4,7, 9,null,7,4, 5,7,9,11, 12,null,9,7],
      melodyB: [12,null,11,9, 7,9,11,12, 14,12,11,9, 7,null,4,2],
      counter: [0,null,7,null, 4,null,2,null, 5,null,9,null, 7,null,5,4],
      chords:  [[0,4,7],[7,11,14],[9,12,16],[5,9,12]],
      bass:    [-12,-12,-5,-5, -3,-3,-7,-7],
      harmony: [7,9, 12,9],
      drums:   ['K','-','H','H','K','H','S','H','K','-','H','H','K','H','S','-'],
    },
    // FASE 13: hergecomponeerd — zelfde avontuurlijke hook, rustiger tempo
    ROUTE_CALM: {
      bpm:106, root:261.63,
      melody:  [0,2,4,7, 9,null,7,4, 5,7,9,11, 12,null,9,7],
      melodyB: [12,null,11,9, 7,9,11,12, 9,7,5,4, 2,null,4,null],
      counter: [0,null,null,4, null,null,2,null, 5,null,null,9, null,7,null,4],
      chords:  [[0,4,7],[7,11,14],[9,12,16],[5,9,12]],
      bass:    [0,0,7,7, 9,9,5,5],
      harmony: [7,7, 9,7],
      drums:   ['K','-','-','H','-','-','H','-','K','-','-','H','-','H','-','-'],
    },
    ROUTE_ROCKY: {
      bpm:116, root:246.94,
      melody:  [0,3,5,7,10,7,5,3, 5,7,10,12,10,7,5,3],
      bass:    [-12,-12,-5,-5, -7,-7,-5,-12],
      harmony: [7,10, 7,5],
      drums:   ['K','H','-','H','K','-','S','H','K','H','-','H','S','-','H','H'],
    },
    ROUTE_DESERT: {
      bpm:110, root:277.18,
      melody:  [0,2,3,7,5,3,2,0, 3,5,7,10,7,5,3,0],
      bass:    [-12,-12,-7,-7, -5,-5,-7,-12],
      harmony: [7,7, 5,7],
      drums:   ['K','-','H','H','K','-','S','H','K','H','H','-','K','-','S','-'],
    },
    ROUTE_FOREST: {
      bpm:100, root:293.66,
      melody:  [0,4,7,12,9,7,4,2, 5,9,12,14,12,9,7,5],
      bass:    [0,0,5,7, 7,5,0,-5],
      harmony: [7,7, 9,7],
      drums:   ['K','-','H','-','-','H','-','-','K','-','H','-','-','H','-','-'],
    },
    ROUTE_PLAINS: {
      bpm:112, root:293.66,
      melody:  [0,2,4,7,9,7,5,4, 5,7,9,12,9,7,5,4],
      bass:    [-12,-12,-5,-7, -3,-5,-7,-12],
      harmony: [7,9, 7,5],
      drums:   ['K','H','-','H','S','-','H','H','K','H','-','H','S','H','-','H'],
    },
    ROUTE_MYSTICAL: {
      bpm:104, root:277.18,
      melody:  [0,4,6,11,9,6,4,0, 4,6,9,11,9,6,4,1],
      bass:    [0,0,6,6, 9,9,6,0],
      harmony: [6,9, 6,4],
      drums:   ['K','-','-','H','-','H','-','-','K','-','-','H','-','H','-','-'],
    },
    ROUTE_WIND: {
      bpm:112, root:329.63,
      melody:  [0,4,7,9,12,9,7,5, 4,7,9,12,11,9,7,4],
      bass:    [-12,-12,-7,-5, -5,-7,-12,-12],
      harmony: [7,9, 7,7],
      drums:   ['K','H','-','H','K','-','H','H','S','H','-','H','K','H','S','-'],
    },
    ROUTE_SWAMP: {
      bpm:92, root:233.08,
      melody:  [0,3,5,7,5,3,0,-2, 3,5,7,8,7,5,3,0],
      bass:    [-12,-12,-7,-7, -5,-7,-12,-12],
      harmony: [7,5, 7,8],
      drums:   ['K','-','H','-','-','H','-','-','K','-','H','-','S','-','-','H'],
    },
    ROUTE_ICE: {
      bpm:96, root:261.63,
      melody:  [0,3,7,10,7,3,0,-2, 2,5,7,10,8,7,5,3],
      bass:    [0,0,5,5, 3,3,0,-5],
      harmony: [7,10, 7,5],
      drums:   ['K','-','-','H','-','-','-','H','K','-','-','H','-','-','H','-'],
    },
    // ── Indoors ───────────────────────────────────────────────
    LAB_THEME: {
      bpm:96, root:349.23,
      melody:  [0,4,7,9,7,5,4,2, 4,5,7,9,12,9,7,5],
      bass:    [0,0,7,5, 5,7,0,0],
      harmony: [7,9, 7,5],
      drums:   ['-','-','H','-','-','-','H','-','-','-','H','-','-','-','H','-'],
    },
    HOUSE_THEME: {
      bpm:88, root:261.63,
      melody:  [0,4,7,9,7,4,2,0, 5,7,9,12,9,7,5,4],
      bass:    [0,0,5,5, 7,7,5,0],
      harmony: [7,9, 12,9],
      drums:   ['-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-'],
    },
    // FASE 13: hergecomponeerd — zacht helend wiegelied (I-IV-V-I)
    CENTER_THEME: {
      bpm:98, root:392,
      melody:  [4,2,0,2, 4,5,7,null, 9,7,5,4, 2,null,0,null],
      melodyB: [7,9,12,9, 7,5,4,5, 7,null,5,2, 0,null,null,null],
      counter: [0,null,null,null, 5,null,null,null, 7,null,null,null, 0,null,null,null],
      chords:  [[0,4,7],[5,9,12],[7,11,14],[0,4,7]],
      bass:    [0,0,5,5, 7,7,0,0],
      harmony: [7,9, 7,4],
      drums:   ['-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-'],
    },
    SHOP_THEME: {
      bpm:116, root:440,
      melody:  [0,3,5,7,10,7,5,3, 2,3,5,7,9,7,5,3],
      bass:    [-12,-12,-7,-7, -5,-7,-10,-12],
      harmony: [7,10, 7,5],
      drums:   ['-','-','H','-','-','H','-','-','-','-','H','-','-','H','-','-'],
    },
    // FASE 13: hergecomponeerd — vastberaden gym-mars in mineur
    GYM_THEME: {
      bpm:132, root:261.63,
      melody:  [0,null,0,3, 5,null,3,0, 7,null,5,3, 5,3,2,0],
      melodyB: [7,8,10,12, 10,8,7,5, 3,5,7,8, 10,null,7,null],
      counter: [0,null,-5,null, 0,null,-5,null, -2,null,-4,null, -5,null,0,null],
      chords:  [[0,3,7],[5,8,12],[10,14,17],[0,3,7]],
      bass:    [-12,-12,-7,-7, -2,-2,-12,-12],
      harmony: [7,10, 7,5],
      drums:   ['K','H','H','-','K','H','S','H','K','H','H','-','K','S','H','H'],
    },
    // ── Caves ────────────────────────────────────────────────
    CAVE: {
      bpm:96, root:220,
      melody:  [0,3,5,7,5,3,0,-2, 3,5,7,10,7,5,3,0],
      bass:    [-12,-12,-7,-5, -7,-12,-7,-12],
      harmony: [7,5, 7,7],
      drums:   ['K','-','-','H','-','-','-','H','K','-','-','H','S','-','-','H'],
    },
    CAVE_ICE: {
      bpm:88, root:196,
      melody:  [0,3,7,10,7,3,0,-2, 2,5,7,10,8,7,5,3],
      bass:    [-12,-12,-7,-5, -5,-7,-12,-12],
      harmony: [7,10, 8,5],
      drums:   ['K','-','-','-','-','-','H','-','K','-','-','-','-','-','H','-'],
    },
    CAVE_DRAMATIC: {
      bpm:116, root:185,
      melody:  [0,1,3,7,10,7,3,1, 5,7,10,12,10,7,5,1],
      bass:    [-12,-12,-5,-5, -7,-7,-5,-12],
      harmony: [7,10, 5,7],
      drums:   ['K','-','H','-','K','S','-','H','K','-','H','-','S','K','-','H'],
    },
    BOSS_THEME: {
      bpm:140, root:246.94,
      melody:  [0,1,3,5,7,5,3,1, 7,8,10,12,10,8,7,5],
      bass:    [-12,-12,-5,-5, -7,-7,-5,-12],
      harmony: [7,8, 7,5],
      drums:   ['K','H','S','H','K','H','S','H','K','K','S','H','K','H','S','K'],
    },
    // ── Battles ───────────────────────────────────────────────
    // FASE 13: hergecomponeerd — opjagend mineur-riff met call-and-response
    BATTLE_WILD: {
      bpm:172, root:220,
      melody:  [0,0,3,5, 7,null,5,3, 8,7,5,3, 2,3,5,7],
      melodyB: [12,null,10,8, 7,8,10,12, 15,null,14,12, 10,8,7,5],
      counter: [0,null,0,null, -2,null,-2,null, -4,null,-4,null, -2,null,3,null],
      chords:  [[0,3,7],[8,12,15],[10,14,17],[0,3,7]],
      bass:    [-12,-12,-4,-4, -2,-2,-12,-12],
      harmony: [7,5, 10,7],
      drums:   ['K','K','S','K','K','H','S','H','K','K','S','K','K','K','S','H'],
    },
    // FASE 13: hergecomponeerd — vastberaden trainersduel, klimmende B-sectie
    BATTLE_TRAINER: {
      bpm:168, root:246.94,
      melody:  [0,3,7,12, 10,null,8,7, 5,7,8,10, 12,null,7,3],
      melodyB: [15,14,12,10, 12,null,8,5, 7,8,10,12, 14,15,17,19],
      counter: [0,null,null,7, null,null,5,null, 0,null,null,8, null,7,null,5],
      chords:  [[0,3,7],[5,8,12],[7,10,14],[0,3,7]],
      bass:    [-12,-12,-7,-7, -5,-5,-12,-12],
      harmony: [7,10, 7,7],
      drums:   ['K','H','S','H','K','H','S','H','K','H','S','K','K','H','S','H'],
    },
    BATTLE_GYM: {
      bpm:184, root:349.23,
      melody:  [0,4,7,10,12,10,7,4, 7,10,12,14,12,10,7,4],
      bass:    [-12,-12,-5,-7, -5,-5,-7,-12],
      harmony: [7,10, 12,7],
      drums:   ['K','K','S','H','K','H','S','K','K','H','S','H','K','K','S','H'],
    },
    BATTLE_BOSS: {
      bpm:192, root:261.63,
      melody:  [0,1,5,7,10,7,5,1, 7,10,12,14,12,10,7,5],
      bass:    [-12,-12,-7,-7, -5,-7,-10,-12],
      harmony: [7,10, 7,5],
      drums:   ['K','K','S','K','K','H','S','H','K','K','S','K','K','H','S','K'],
    },
    VICTORY: {
      bpm:140, root:523.25,
      melody:  [0,4,7,12,16,12,11,9, 7,9,11,12,16,19,16,12],
      bass:    [-12,-5,-3,-7, -8,-7,-5,-12],
      harmony: [7,9, 11,7],
      drums:   ['K','H','H','H','S','H','K','H','K','H','H','H','S','H','K','H'],
    },
    // ── Title / misc ──────────────────────────────────────────
    // FASE 13: hergecomponeerd — statige fanfare met A/B-secties en I-vi-IV-V
    TITLE: {
      bpm:96, root:329.63,
      melody:  [0,null,4,7, 12,null,11,9, 7,null,4,5, 7,null,null,null],
      melodyB: [12,null,14,16, 14,12,11,9, 7,9,11,12, 14,null,12,null],
      counter: [null,0,null,4, null,5,null,4, null,2,null,0, -5,null,2,null],
      chords:  [[0,4,7],[9,12,16],[5,9,12],[7,11,14]],
      bass:    [-12,-12,-3,-3, -7,-7,-5,-5],
      harmony: [7,9, 7,5],
      drums:   ['K','-','H','-','K','H','S','H','K','-','H','-','K','H','S','-'],
    },
    SHELLCREEK: {
      bpm:128, root:349.23,
      melody:  [0,4,5,7,9,7,5,4, 5,7,9,12,9,7,5,4],
      bass:    [-12,-12,-7,-5, -5,-7,-12,-12],
      harmony: [7,9, 7,5],
      drums:   ['K','H','-','H','K','H','S','H','K','H','-','H','S','H','K','H'],
    },
    HEAL: {
      bpm:120, root:523.25,
      melody:  [0,4,7,12,9,7,4,7, 5,9,12,14,12,9,7,5],
      bass:    [-12,-12,-7,-5, -5,-7,-12,-12],
      harmony: [7,9, 7,5],
      drums:   ['-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-'],
    },

    // ═══════════════════════════════════════════════════════════
    // NEW TRACKS v11 — 20 unique themes
    // Melody/bass/harmony are semitone offsets from root.
    // Melody plays +12 semitones (1 oct up), bass plays -12 (1 oct down).
    // loop:false → scheduler stops after one full pass.
    // ═══════════════════════════════════════════════════════════

    // ── AMBERTOWN — warm home town, major, 120 bpm ────────────
    // Root C4=261.63. Melody: C4 E4 G4 E4 D4 F4 A4 F4 E4 G4 C5 G4 (offsets from C4)
    // C4=0,D4=2,E4=4,F4=5,G4=7,A4=9,C5=12
    AMBERTOWN_NEW: {
      bpm:120, root:261.63,
      melody:  [0,4,7,4,2,5,9,5, 4,7,12,7,5,9,12,7],
      bass:    [0,0,7,7, 0,0,5,5],
      harmony: [7,4, 9,7],
      drums:   ['K','-','H','-','K','-','H','-','K','-','H','S','K','-','H','-'],
    },

    // ── ROUTE_CALM — upbeat pentatonic, 130 bpm ───────────────
    // Root G4=392. G4=0,A4=2,C5=5,E4=-3,D4=-5
    ROUTE_CALM_NEW: {
      bpm:130, root:392,
      melody:  [0,2,5,2,0,-3,-5,-3, 0,2,0,-3,-7,-3,0,null],
      bass:    [-12,-12,-7,-7, -5,-7,-12,-12],
      harmony: [7,5, 7,0],
      drums:   ['K','-','H','-','K','H','-','H','K','-','H','-','K','H','-','H'],
    },

    // ── ROUTE_MID — minor touches, 140 bpm ────────────────────
    // Root A4=440. A4=0,G4=-2,E4=-5,F4=-4,Bb4=1
    ROUTE_MID_NEW: {
      bpm:140, root:440,
      melody:  [0,-2,-5,-4,-2,0,1,0, -2,-4,-5,-7,-5,-4,-2,null],
      bass:    [-12,-12,-7,-5, -5,-7,-12,-12],
      harmony: [7,5, 8,7],
      drums:   ['K','H','-','H','K','H','S','H','K','H','-','H','K','S','H','-'],
    },

    // ── ROUTE_LATE — dramatic minor, 150 bpm ─────────────────
    // Root A4=440. A4=0,C5=3,B4=2,G4=-2,F4=-4,E4=-5,D4=-7,C4=-9
    ROUTE_LATE_NEW: {
      bpm:150, root:440,
      melody:  [0,3,2,0,-2,-4,-5,-4, -2,0,-5,-7,-9,-7,-5,null],
      bass:    [-12,-12,-9,-9, -7,-7,-9,-12],
      harmony: [7,3, 5,7],
      drums:   ['K','H','S','H','K','K','S','H','K','H','S','H','K','H','S','K'],
    },

    // ── TOWN — bustling lively major, 125 bpm ─────────────────
    // Root C4=261.63. C4=0,E4=4,G4=7,C5=12,B4=11,A4=9,F4=5,D5=14,E5=16
    TOWN_NEW: {
      bpm:125, root:261.63,
      melody:  [0,4,7,12,11,7,9,5, 4,7,12,16,14,11,12,null],
      bass:    [-12,-12,-5,-5, -7,-7,-5,-12],
      harmony: [7,9, 12,7],
      drums:   ['K','H','H','-','K','H','S','H','K','H','H','-','S','H','K','H'],
    },

    // ── PYRESIDE — hot intense town, chromatic, 145 bpm ──────
    // Root E4=329.63. E4=0,F4=1,Gb4=2,G4=3,Ab4=4,Eb4=-1,Bb4=6,A4=5
    PYRESIDE_NEW: {
      bpm:145, root:329.63,
      melody:  [0,1,2,3,4,3,1,0, -1,0,1,3,4,5,6,null],
      bass:    [-12,-12,-7,-5, -3,-5,-7,-12],
      harmony: [7,4, 6,7],
      drums:   ['K','K','S','H','K','H','S','K','K','H','S','H','K','K','S','H'],
    },

    // ── STONEHAVEN — stately march, 110 bpm ──────────────────
    // Root C4=261.63. C4=0,G4=7,A4=9,F4=5,E4=4,D4=2
    STONEHAVEN_NEW: {
      bpm:110, root:261.63,
      melody:  [0,0,7,7,9,9,7,null, 5,5,4,4,2,2,0,null],
      bass:    [-12,-12,-5,-5, -7,-7,-12,-12],
      harmony: [7,9, 7,4],
      drums:   ['K','-','H','-','S','-','H','-','K','-','H','-','S','-','H','-'],
    },

    // ── BOGMIRE — mysterious swamp, minor eerie, 100 bpm ─────
    // Root A3=220. A3=0,C4=3,Eb4=6,G3=-2,Bb3=1,F4=8,E4=7,D4=5,B3=2
    BOGMIRE_NEW: {
      bpm:100, root:220,
      melody:  [0,3,6,0,-2,1,6,-2, 0,8,7,5,3,2,0,null],
      bass:    [-12,-12,-9,-9, -7,-9,-12,-12],
      harmony: [7,6, 8,7],
      drums:   ['K','-','-','H','-','-','H','-','K','-','-','H','-','H','-','-'],
    },

    // ── APEX — high altitude epic, slow, 105 bpm ─────────────
    // Root C4=261.63. C4=0,E4=4,G4=7,C5=12,E5=16,D5=14,B4=11,A4=9,F4=5,G3=-5
    APEX_NEW: {
      bpm:105, root:261.63,
      melody:  [0,4,7,12,16,14,12,11, 9,7,5,4,2,0,-5,null],
      bass:    [-12,-12,-5,-5, -7,-5,-12,-12],
      harmony: [7,12, 9,7],
      drums:   ['K','-','-','H','-','-','H','-','K','-','H','-','S','-','-','H'],
    },

    // ── GYM — tense competitive minor, 150 bpm ───────────────
    // Root A4=440. A4=0,G4=-2,C5=3,B4=2,F4=-4,E4=-5
    GYM_NEW: {
      bpm:150, root:440,
      melody:  [0,0,-2,0,3,2,0,-2, -4,-5,-4,-2,0,null,0,null],
      bass:    [-12,-12,-9,-7, -5,-7,-12,-12],
      harmony: [7,3, 5,7],
      drums:   ['K','K','S','H','K','H','S','K','K','H','S','H','K','K','S','H'],
    },

    // ── CAVE_NEW — dark chromatic, very slow 90 bpm ──────────
    // Root A3=220. A3=0,Bb3=1,G3=-2,Ab3=-1,F3=-4,Gb3=-3,E3=-5
    CAVE_NEW: {
      bpm:90, root:220,
      melody:  [0,1,0,-2,-1,-2,-4,-3, -4,-5,-4,-2,-1,0,1,null],
      bass:    [-12,-12,-11,-11, -13,-12,-11,-12],
      harmony: [7,1, 5,7],
      drums:   ['K','-','-','-','-','H','-','-','K','-','-','H','-','-','H','-'],
    },

    // ── MT_CRETACEOUS — final dungeon ominous, 85 bpm ────────
    // Root D4=293.66. D4=0,C4=-2,B3=-3,Bb3=-4,A3=-5,Ab3=-6,G3=-7,Gb3=-8,F3=-9,E3=-10,Eb3=-11,D3=-12
    MT_CRETACEOUS_NEW: {
      bpm:85, root:293.66,
      melody:  [0,-2,-3,-4,-5,-6,-7,-8, -9,-10,-11,-12,-10,-9,-7,null],
      bass:    [-12,-12,-14,-14, -17,-17,-14,-12],
      harmony: [7,6, 5,7],
      drums:   ['K','-','H','-','K','-','S','-','K','-','H','-','K','S','-','H'],
    },

    // ── BATTLE_WILD_NEW — urgent exciting, 160 bpm ───────────
    // Root E5=659.26. E5=0,D5=-2,C5=-4,G5=3,REST=null
    BATTLE_WILD_NEW: {
      bpm:160, root:659.26,
      melody:  [0,-2,-4,-2,0,0,0,null, -2,-2,-2,null,0,3,3,null],
      bass:    [-12,-12,-7,-5, -5,-7,-12,-12],
      harmony: [7,5, 7,10],
      drums:   ['K','K','S','K','K','H','S','H','K','K','S','K','K','H','S','H'],
    },

    // ── BATTLE_TRAINER_NEW — intense driving, 170 bpm ────────
    // Root G5=784. G5=0,F5=-2,E5=-3,A5=2,Bb5=3,D5=-5
    BATTLE_TRAINER_NEW: {
      bpm:170, root:784,
      melody:  [0,-2,-3,-2,0,0,2,3, 2,0,-2,-3,-5,-3,-2,null],
      bass:    [-12,-12,-5,-7, -5,-7,-12,-12],
      harmony: [7,5, 10,7],
      drums:   ['K','H','S','H','K','H','S','K','K','H','S','H','K','K','S','H'],
    },

    // ── BATTLE_GYM_NEW — epic gym battle, 180 bpm ────────────
    // Root C5=523.25. C5=0,Eb5=3,G5=7,C6=12,Bb5=10,Ab5=8,F5=5,Eb5=3
    BATTLE_GYM_NEW: {
      bpm:180, root:523.25,
      melody:  [0,3,7,12,10,8,7,5, 3,5,7,8,10,7,3,0],
      bass:    [-12,-12,-5,-5, -7,-7,-5,-12],
      harmony: [7,10, 8,7],
      drums:   ['K','K','S','H','K','H','S','K','K','K','S','H','K','H','S','K'],
    },

    // ── BATTLE_ELITE_NEW — Elite Four very intense, 190 bpm ──
    // Root A5=880. A5=0,G5=-2,F5=-4,Eb5=-6,D5=-7,C5=-9,Bb4=-11,G4=-14,Eb4=-18
    BATTLE_ELITE_NEW: {
      bpm:190, root:880,
      melody:  [0,-2,-4,-6,-7,-9,-11,-12, -14,-16,-18,-16,-14,-12,-11,-9],
      bass:    [-12,-12,-7,-9, -11,-9,-7,-12],
      harmony: [7,5, 6,7],
      drums:   ['K','K','S','K','K','H','S','K','K','K','S','H','K','H','S','K'],
    },

    // ── BATTLE_CHAMPION_NEW — Director Clade, 200 bpm ────────
    // Root D5=587.33. D5=0,A4=-5,F4=-9,D4=-12,C4=-14,A3=-17,F3=-21,D3=-24
    BATTLE_CHAMPION_NEW: {
      bpm:200, root:587.33,
      melody:  [0,-5,-9,-12,-14,-17,-21,-24, -21,-17,-14,-12,-9,-5,-2,0],
      bass:    [-12,-12,-17,-17, -21,-17,-12,-12],
      harmony: [7,5, 3,7],
      drums:   ['K','K','S','K','K','K','S','K','K','H','S','K','K','K','S','K'],
    },

    // ── Per-member Elite Four themes — each their own iconic tune ──
    // Aurora (ice): crystalline, shimmering, high & airy descents
    BATTLE_ELITE_AURORA: {
      bpm:182, root:880,
      melody:  [0,3,7,3,0,-2,-5,-2, 0,5,8,5,3,0,-4,0],
      bass:    [-12,-12,-9,-7, -5,-7,-9,-12],
      harmony: [7,3, 8,7],
      drums:   ['K','H','S','H','K','H','S','H','K','H','S','H','K','H','S','H'],
    },
    // Ember (fire): rapid, blazing, relentless ascending runs
    BATTLE_ELITE_EMBER: {
      bpm:196, root:440,
      melody:  [0,2,3,5,7,9,11,12, 10,7,5,3,5,7,10,12],
      bass:    [-12,-12,-5,-5, -7,-5,-12,-12],
      harmony: [7,5, 9,7],
      drums:   ['K','K','S','K','K','K','S','H','K','K','S','K','K','H','S','K'],
    },
    // Garnet (earth): heavy, grounded, weighty low stomps
    BATTLE_ELITE_GARNET: {
      bpm:176, root:587.33,
      melody:  [0,0,-2,-4,-5,-4,-2,0, -5,-5,-7,-5,0,-2,-4,-5],
      bass:    [-12,-12,-12,-12, -17,-12,-7,-12],
      harmony: [7,3, 5,7],
      drums:   ['K','K','S','K','K','-','S','K','K','K','S','-','K','K','S','K'],
    },
    // Phantom (dark): eerie, chromatic, wandering & dissonant
    BATTLE_ELITE_PHANTOM: {
      bpm:188, root:466.16,
      melody:  [0,-1,-3,-4,-6,-7,-9,-10, -9,-7,-6,-4,-3,-1,0,2],
      bass:    [-12,-13,-9,-10, -14,-12,-8,-12],
      harmony: [6,3, 5,6],
      drums:   ['K','H','S','K','K','H','S','K','K','H','S','K','H','H','S','K'],
    },

    // ── VICTORY_NEW — win fanfare, loop:false, 180 bpm ───────
    // Root C5=523.25. C5=0,E5=4,G5=7,C6=12,G5=7,E6=16,D6=14
    VICTORY_NEW: {
      bpm:180, root:523.25, loop:false,
      melody:  [0,4,7,12,7,4,7,12, 16,14,12,null,7,4,0,null],
      bass:    [-12,-12,-5,-5, -7,-5,-12,-12],
      harmony: [7,12, 16,7],
      drums:   ['K','-','H','-','K','H','S','H','K','H','H','H','S','H','K','-'],
    },

    // ── GYM_VICTORY_NEW — gym win fanfare, loop:false ────────
    // Root C5=523.25. C5=0,E5=4,G5=7,C6=12,B5=11,A5=9,F5=5
    GYM_VICTORY_NEW: {
      bpm:160, root:523.25, loop:false,
      melody:  [0,0,0,0,4,7,12,null, 11,9,7,5,4,5,7,12],
      bass:    [-12,-12,-5,-5, -7,-5,-12,-12],
      harmony: [7,9, 12,7],
      drums:   ['K','-','H','-','K','H','S','H','K','H','H','H','S','-','K','-'],
    },

    // ── HEAL_NEW — heal jingle, short, loop:false ─────────────
    // Root C5=523.25. C5=0,E5=4,G5=7,G4=-5
    HEAL_NEW: {
      bpm:160, root:523.25, loop:false,
      melody:  [0,4,7,4,0,-5,0,null],
      bass:    [-12,-12,-5,-12],
      harmony: [7,4],
      drums:   ['-','-','-','-','-','-','-','-'],
    },
  };

  // ── Aliases (legacy) ──────────────────────────────────────
  T.GYM            = T.GYM_THEME;
  T.TITLE_FANFARE  = T.TITLE;
  T.ROUTE_2        = T.ROUTE_CALM;
  T.ROUTE_3        = T.ROUTE_ROCKY;
  T.ROUTE_4        = T.ROUTE_FOREST;
  T.ROUTE_5        = T.ROUTE_DESERT;
  T.ROUTE_6        = T.ROUTE_PLAINS;
  T.ROUTE_7        = T.ROUTE_SWAMP;
  T.ROUTE_8        = T.ROUTE_WIND;
  T.ROUTE_9        = T.ROUTE_MYSTICAL;
  T.ROUTE_10       = T.ROUTE_ICE;
  T.SHELLCREEK_CITY = T.SHELLCREEK;
  T.AMBERTOWN_THEME = T.AMBERTOWN;

  // ── Map-music key aliases (v11) ───────────────────────────
  // Canonical keys used by map music fields → track objects
  T.AMBERTOWN      = T.AMBERTOWN_NEW;   // overwrite old stub
  T.ROUTE_CALM     = T.ROUTE_CALM_NEW;  // overwrite old stub
  T.ROUTE_MID      = T.ROUTE_MID_NEW;
  T.ROUTE_LATE     = T.ROUTE_LATE_NEW;
  T.TOWN           = T.TOWN_NEW;
  T.PYRESIDE       = T.PYRESIDE_NEW;
  T.STONEHAVEN     = T.STONEHAVEN_NEW;
  T.BOGMIRE        = T.BOGMIRE_NEW;
  T.APEX           = T.APEX_NEW;
  T.GYM            = T.GYM_NEW;
  T.CAVE           = T.CAVE_NEW;
  T.MT_CRETACEOUS  = T.MT_CRETACEOUS_NEW;
  T.BATTLE_WILD    = T.BATTLE_WILD_NEW;
  T.BATTLE_TRAINER = T.BATTLE_TRAINER_NEW;
  T.BATTLE_GYM     = T.BATTLE_GYM_NEW;
  T.BATTLE_ELITE   = T.BATTLE_ELITE_NEW;
  T.BATTLE_CHAMPION = T.BATTLE_CHAMPION_NEW;
  T.VICTORY        = T.VICTORY_NEW;
  T.GYM_VICTORY    = T.GYM_VICTORY_NEW;
  T.HEAL           = T.HEAL_NEW;

  // ── Init ──────────────────────────────────────────────────
  // ── FASE 8: herbruikbare ruis-buffers ───────────────────────
  // Voorheen genereerden snare/hihat/voetstappen/vangst bij ELKE afspeel-actie
  // een verse buffer (duizenden samples + GC-druk op de hoofdthread → haperen).
  // Nu één keer genereren per lengte en hergebruiken.
  const _noiseCache = {};
  function _noise(seconds) {
    const key = Math.round(seconds * 1000);
    if (!_noiseCache[key]) {
      const sr = _ctx.sampleRate;
      const buf = _ctx.createBuffer(1, Math.max(1, Math.floor(sr * seconds)), sr);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      _noiseCache[key] = buf;
    }
    return _noiseCache[key];
  }

  // FASE 3: procedurele impulse-response voor de reverb (ruis met exponentieel verval)
  function _buildIR(seconds, decay) {
    const sr  = _ctx.sampleRate;
    const len = Math.max(1, Math.floor(sr * seconds));
    const buf = _ctx.createBuffer(2, len, sr);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      for (let i = 0; i < len; i++) {
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
      }
    }
    return buf;
  }

  function init() {
    if (_ctx) return;
    try {
      _ctx = new (window.AudioContext || window.webkitAudioContext)();
      _masterGain = _ctx.createGain(); _masterGain.gain.value = 1.0;
      _musicGain  = _ctx.createGain(); _musicGain.gain.value  = 0.5;
      _sfxGain    = _ctx.createGain(); _sfxGain.gain.value    = 0.8;
      _uiGain     = _ctx.createGain(); _uiGain.gain.value     = 0.8;
      _musicGain.connect(_masterGain);
      _sfxGain.connect(_masterGain);
      _uiGain.connect(_masterGain);

      // ── FASE 3: master-compressor als glue (geen clipping in drukke battles)
      _comp = _ctx.createDynamicsCompressor();
      _comp.threshold.value = -16;
      _comp.knee.value      = 24;
      _comp.ratio.value     = 5;
      _comp.attack.value    = 0.004;
      _comp.release.value   = 0.22;
      _masterGain.connect(_comp);
      _comp.connect(_ctx.destination);

      // ── FASE 3: reverb als send-bus (muziek subtiel, SFX ruimer)
      _reverb = _ctx.createConvolver();
      _reverb.buffer = _buildIR(1.7, 3.2);
      _reverbGain = _ctx.createGain(); _reverbGain.gain.value = 0.5;
      _revSendMusic = _ctx.createGain(); _revSendMusic.gain.value = 0.14;
      _revSendSfx   = _ctx.createGain(); _revSendSfx.gain.value   = 0.22;
      _musicGain.connect(_revSendMusic); _revSendMusic.connect(_reverb);
      _sfxGain.connect(_revSendSfx);     _revSendSfx.connect(_reverb);
      _reverb.connect(_reverbGain);
      _reverbGain.connect(_comp); // reverb-return niet nóg eens de sends in

      // ── FASE 3: echo/delay-bus (jingles & signature moves)
      const dly = _ctx.createDelay(1.0);
      dly.delayTime.value = 0.27;
      const fb = _ctx.createGain(); fb.gain.value = 0.34;
      dly.connect(fb); fb.connect(dly);
      _delaySend = _ctx.createGain(); _delaySend.gain.value = 1.0;
      _delayGain = _ctx.createGain(); _delayGain.gain.value = 0.4;
      _delaySend.connect(dly);
      dly.connect(_delayGain);
      _delayGain.connect(_comp);

      // ── FASE 3: meetpunt voor verificatie (RMS op de master)
      _analyser = _ctx.createAnalyser();
      _analyser.fftSize = 2048;
      _comp.connect(_analyser);
    } catch(e) {
      console.warn('[Audio] Web Audio not available:', e);
    }
  }

  function _ensureInit() {
    if (!_ctx) init();
    if (_ctx && _ctx.state === 'suspended') _ctx.resume();
  }

  // ── Volume setters ────────────────────────────────────────
  function setMusicVolume(v) {
    _musicVol = Math.max(0, Math.min(1, v));
    if (_musicGain && _ctx) {
      _musicGain.gain.cancelScheduledValues(_ctx.currentTime);
      _musicGain.gain.setValueAtTime(_musicVol, _ctx.currentTime);
    }
  }
  function setSfxVolume(v) {
    const sv = Math.max(0, Math.min(1, v));
    if (_sfxGain) _sfxGain.gain.value = sv;
    if (_uiGain)  _uiGain.gain.value  = sv;
  }

  // ── FASE 3: ducking — muziek dimt tijdens jingles en veert terug ──
  function _duck(holdSec, depth) {
    if (!_ctx || !_musicGain) return;
    try {
      const now = _ctx.currentTime;
      const g = _musicGain.gain;
      const low = _musicVol * (1 - depth);
      g.cancelScheduledValues(now);
      g.setValueAtTime(g.value, now);
      g.linearRampToValueAtTime(low, now + 0.07);
      g.setValueAtTime(low, now + holdSec);
      g.linearRampToValueAtTime(_musicVol, now + holdSec + 0.55);
    } catch(e) {}
  }

  // ── FASE 3: battle-intensiteit (0 = normaal, 1 = lage-HP-laag) ──
  function setIntensity(level) {
    _intensity = level ? 1 : 0;
  }

  // ── Music ────────────────────────────────────────────────
  function playMusic(trackId) {
    if (!_ctx) _ensureInit();
    if (!_ctx) return;
    if (_currentMusic === trackId) return;
    const wasPlaying = !!_currentMusic;
    stopMusic();
    _currentMusic = trackId;
    _trackData = T[trackId] || T.AMBERTOWN;
    _beatIdx   = 0;
    // FASE 3: crossfade i.p.v. harde knip — oude (al ingeplande) noten faden uit,
    // de nieuwe track start zacht en fadet in
    const now = _ctx.currentTime;
    try {
      const g = _musicGain.gain;
      g.cancelScheduledValues(now);
      if (wasPlaying) {
        g.setValueAtTime(g.value, now);
        g.linearRampToValueAtTime(0.0001, now + 0.30);
        g.setValueAtTime(0.0001, now + 0.34);
        g.linearRampToValueAtTime(_musicVol, now + 0.95);
      } else {
        g.setValueAtTime(_musicVol, now);
      }
    } catch(e) {}
    _nextBeat = now + (wasPlaying ? 0.36 : 0.05);
    _runScheduler();
  }

  function stopMusic() {
    if (_schedHandle) { clearTimeout(_schedHandle); _schedHandle = null; }
    _currentMusic = null;
    _trackData    = null;
  }

  function _runScheduler() {
    if (!_ctx || !_trackData) return;
    const td = _trackData;
    const spb = 60 / td.bpm; // seconds per beat
    const loopLen = td.melody.length;

    while (_nextBeat < _ctx.currentTime + LOOKAHEAD) {
      // loop:false → stop when we've exhausted one full melody pass
      if (td.loop === false && _beatIdx >= loopLen) {
        _currentMusic = null;
        _trackData    = null;
        return;
      }

      const t  = _nextBeat;
      const bi = _beatIdx;

      // FASE 3: humanize (subtiele velocity-variatie) + dag/nacht-mix
      const hum   = 0.86 + Math.random() * 0.26;
      const night = (typeof DG.getNightFactor === 'function') ? (DG.getNightFactor() || 0) : 0;

      // ── Melody (every beat, +1 octave) ────────────────────
      // FASE 13: A/B-secties — na elke volledige pass wisselt de melodie
      const _mel = (td.melodyB && Math.floor(bi / loopLen) % 2 === 1) ? td.melodyB : td.melody;
      const mSemi = _mel[bi % loopLen];
      if (mSemi != null) {
        // FASE 3: dubbele oscillator met detune (chorus) + zachtere top
        _osc(_f(td.root, mSemi + 12), 'triangle', 0.165 * hum * (1 - night * 0.3), spb * 0.78, t,
             { attack: 0.008, detune: 7, lp: 5200 - night * 1800 });
      }

      // ── FASE 13: tegenmelodie (square, root-octaaf, zachter) ──
      if (td.counter) {
        const cSemi = td.counter[bi % td.counter.length];
        if (cSemi != null) {
          _osc(_f(td.root, cSemi), 'square', 0.065 * (1 - night * 0.3), spb * 0.9, t,
               { attack: 0.01, lp: 1800, sustain: 0.7 });
        }
      }

      // ── Bass (every 2 beats, -1 octave) ───────────────────
      if (bi % 2 === 0) {
        const bSemi = td.bass[Math.floor(bi / 2) % td.bass.length];
        if (bSemi != null) {
          // FASE 3: lowpass haalt de scherpte van de square af
          _osc(_f(td.root, bSemi - 12), 'square', 0.15, spb * 1.85, t,
               { attack: 0.012, lp: 820, sustain: 0.8 });
        }
      }

      // ── Harmony — FASE 13: echte akkoordprogressies (triades) als het
      // track `chords` heeft, plus een doorlopend chiptune-arpeggio in achtsten;
      // anders het oude root+kwint-pad (backwards compatible)
      if (td.chords) {
        const _ch = td.chords[Math.floor(bi / 4) % td.chords.length];
        if (bi % 4 === 0) {
          const padO = { attack: spb * 0.5, release: spb * 1.2, sustain: 0.85, lp: 3000 };
          for (let ci = 0; ci < _ch.length; ci++) {
            _osc(_f(td.root, _ch[ci]), 'sine', ci === 0 ? 0.07 : 0.045, spb * 3.9, t, padO);
          }
        }
        const arpO = { attack: 0.004, lp: 4200, sustain: 0.5 };
        const arpV = 0.042 * (1 - night * 0.4);
        _osc(_f(td.root, _ch[bi % _ch.length] + 12),       'triangle', arpV,        spb * 0.4, t,               arpO);
        _osc(_f(td.root, _ch[(bi + 1) % _ch.length] + 12), 'triangle', arpV * 0.85, spb * 0.4, t + spb * 0.5,   arpO);
      } else if (bi % 4 === 0) {
        const hIdx  = Math.floor(bi / 4) % td.harmony.length;
        const hSemi = td.harmony[hIdx];
        if (hSemi != null) {
          // FASE 3: echte pad — trage attack, lange release
          const padO = { attack: spb * 0.5, release: spb * 1.2, sustain: 0.85, lp: 3200 };
          _osc(_f(td.root, hSemi),     'sine', 0.085, spb * 3.9, t, padO);
          _osc(_f(td.root, hSemi + 7), 'sine', 0.055, spb * 3.9, t, padO);
        }
      }

      // ── FASE 3: intensiteitslaag bij lage HP (arpeggio + extra hihats) ──
      if (_intensity > 0) {
        const chord = td.chords
          ? (td.chords[Math.floor(bi / 4) % td.chords.length][0] || 0)
          : (td.harmony[Math.floor(bi / 4) % td.harmony.length] || 0);
        const arp   = [0, 7, 12, 16];
        _osc(_f(td.root, chord + arp[bi % 4] + 12), 'square', 0.05, spb * 0.42, t,
             { attack: 0.004, lp: 4200 });
        _osc(_f(td.root, chord + arp[(bi + 2) % 4] + 12), 'square', 0.045, spb * 0.4, t + spb * 0.5,
             { attack: 0.004, lp: 4200 });
        _hihat(t + spb * 0.5, 0.6); // offbeat-tikken
      }

      // ── Drums ─────────────────────────────────────────────
      // FASE 3: accent op tel 1 van elke maat, 's nachts dunnere drums
      const db = td.drums[bi % td.drums.length];
      const dv = (bi % 8 === 0 ? 1.25 : 1.0) * (1 - night * 0.4);
      const skipNight = night > 0.5 && db === 'H' && bi % 2 === 1;
      if (!skipNight) {
        if (db === 'K') _kick(t, dv);
        else if (db === 'S') _snare(t, dv);
        else if (db === 'H') _hihat(t, dv);
      }

      _nextBeat += spb;
      _beatIdx++;
    }

    _schedHandle = setTimeout(_runScheduler, SCHED_MS);
  }

  // ── Oscillator with ADSR envelope ────────────────────────
  // FASE 3: volwaardige ADSR + opties per stem-rol:
  //   o.attack/decay/release (sec), o.sustain (fractie van vol),
  //   o.detune (cents → tweede oscillator, chorus-warmte),
  //   o.lp (lowpass-frequentie), o.dest (alternatieve uitgang)
  function _osc(frequency, type, vol, duration, t, o) {
    if (!_ctx) return;
    o = o || {};
    try {
      const atk = o.attack  != null ? o.attack  : 0.012;
      const dec = o.decay   != null ? o.decay   : duration * 0.18;
      const sus = o.sustain != null ? o.sustain : 0.78;
      const rel = o.release != null ? o.release : duration * 0.3;
      const peak = o.detune ? vol * 0.62 : vol; // 2 oscillators → samen even luid
      const env = _ctx.createGain();
      const susT = Math.max(t + atk + dec + 0.005, t + duration - rel * 0.4);
      env.gain.setValueAtTime(0.0001, t);
      env.gain.linearRampToValueAtTime(peak, t + atk);
      env.gain.linearRampToValueAtTime(peak * sus, t + atk + dec);
      env.gain.setValueAtTime(peak * sus, susT);
      env.gain.exponentialRampToValueAtTime(0.001, t + duration + rel);

      let out = env;
      if (o.lp) {
        const filt = _ctx.createBiquadFilter();
        filt.type = 'lowpass';
        filt.frequency.value = Math.max(120, o.lp);
        env.connect(filt);
        out = filt;
      }
      out.connect(o.dest || _musicGain);

      const stopT = t + duration + rel + 0.08;
      const mk = (cents) => {
        const osc = _ctx.createOscillator();
        osc.type = type;
        osc.frequency.setValueAtTime(frequency, t);
        if (cents) osc.detune.setValueAtTime(cents, t);
        osc.connect(env);
        osc.start(t);
        osc.stop(stopT);
      };
      mk(0);
      if (o.detune) mk(o.detune);
    } catch(e) {}
  }

  // ── Drum voices ───────────────────────────────────────────
  // FASE 3: volume-parameter (accenten/nacht) + vollere klank per drum
  function _kick(t, v) {
    if (!_ctx) return;
    v = v == null ? 1 : v;
    try {
      // Body: sweep omlaag
      const osc = _ctx.createOscillator();
      const env = _ctx.createGain();
      osc.frequency.setValueAtTime(115, t);
      osc.frequency.exponentialRampToValueAtTime(27, t + 0.17);
      env.gain.setValueAtTime(0.0001, t);
      env.gain.linearRampToValueAtTime(0.24 * v, t + 0.004);
      env.gain.exponentialRampToValueAtTime(0.001, t + 0.24);
      osc.connect(env); env.connect(_musicGain);
      osc.start(t); osc.stop(t + 0.28);
      // Click: korte hoge tik voor definitie
      const ck = _ctx.createOscillator();
      const ce = _ctx.createGain();
      ck.type = 'square'; ck.frequency.setValueAtTime(1450, t);
      ce.gain.setValueAtTime(0.05 * v, t);
      ce.gain.exponentialRampToValueAtTime(0.001, t + 0.012);
      ck.connect(ce); ce.connect(_musicGain);
      ck.start(t); ck.stop(t + 0.02);
    } catch(e) {}
  }

  function _snare(t, v) {
    if (!_ctx) return;
    v = v == null ? 1 : v;
    try {
      // Ruis-laag (FASE 8: herbruikbare buffer)
      const src  = _ctx.createBufferSource();
      src.buffer = _noise(0.14);
      const filt = _ctx.createBiquadFilter();
      filt.type  = 'bandpass'; filt.frequency.value = 2400; filt.Q.value = 0.7;
      const env  = _ctx.createGain();
      env.gain.setValueAtTime(0.0001, t);
      env.gain.linearRampToValueAtTime(0.17 * v, t + 0.003);
      env.gain.exponentialRampToValueAtTime(0.001, t + 0.13);
      src.connect(filt); filt.connect(env); env.connect(_musicGain);
      src.start(t); src.stop(t + 0.16);
      // Toon-body (180 Hz) maakt de snare vol i.p.v. alleen ruis
      const bd = _ctx.createOscillator();
      const be = _ctx.createGain();
      bd.type = 'triangle'; bd.frequency.setValueAtTime(185, t);
      be.gain.setValueAtTime(0.0001, t);
      be.gain.linearRampToValueAtTime(0.09 * v, t + 0.004);
      be.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
      bd.connect(be); be.connect(_musicGain);
      bd.start(t); bd.stop(t + 0.11);
    } catch(e) {}
  }

  function _hihat(t, v) {
    if (!_ctx) return;
    v = v == null ? 1 : v;
    try {
      const dur = 0.04 + Math.random() * 0.022; // FASE 3: decay-variatie
      const src  = _ctx.createBufferSource();
      src.buffer = _noise(0.08); // FASE 8: herbruikbaar; envelope bepaalt de decay
      const filt = _ctx.createBiquadFilter();
      filt.type  = 'highpass'; filt.frequency.value = 9000;
      const env  = _ctx.createGain();
      env.gain.setValueAtTime(0.0001, t);
      env.gain.linearRampToValueAtTime(0.065 * v, t + 0.002);
      env.gain.exponentialRampToValueAtTime(0.001, t + dur);
      src.connect(filt); filt.connect(env); env.connect(_musicGain);
      src.start(t); src.stop(t + dur + 0.02);
    } catch(e) {}
  }

  // ── SFX ──────────────────────────────────────────────────
  const SFX = {
    HIT:          [220, 0.10, 'square'],
    SUPER:        [440, 0.15, 'square'],
    MISS:         [160, 0.12, 'square'],
    FAINT:        [120, 0.40, 'sawtooth'],
    CATCH:        [523, 0.20, 'triangle'],
    FLEE:         [330, 0.15, 'square'],
    LEVEL_UP:     [659, 0.30, 'triangle'],
    EVOLVE:       [784, 0.40, 'triangle'],
    MENU:         [440, 0.05, 'square'],
    SELECT:       [523, 0.05, 'square'],
    WARP:         [880, 0.20, 'sine'],
    HEAL:         [659, 0.30, 'triangle'],
    ERROR:        [110, 0.20, 'square'],
    BATTLE_START:   [330, 0.30, 'square'],
    TRAINER_SPOT:   [880, 0.08, 'square'],
  };

  // FASE 3: UI-blips blijven droog (geen reverb-soep in menu's)
  const _UI_SFX = { MENU: 1, SELECT: 1, ERROR: 1, TRAINER_SPOT: 1 };

  function playSfx(sfxId) {
    if (!_ctx) _ensureInit();
    if (!_ctx) return;
    const def = SFX[sfxId];
    if (!def) return;
    const [freq, dur, type] = def;
    try {
      const t = _ctx.currentTime;
      const osc = _ctx.createOscillator();
      const env = _ctx.createGain();
      osc.type = type || 'square';
      osc.frequency.setValueAtTime(freq, t);
      // FASE 3: mini-attack voorkomt de klik van instant-op-volume
      env.gain.setValueAtTime(0.0001, t);
      env.gain.linearRampToValueAtTime(0.30, t + 0.005);
      env.gain.exponentialRampToValueAtTime(0.001, t + Math.max(dur, 0.02));
      osc.connect(env);
      env.connect(_UI_SFX[sfxId] && _uiGain ? _uiGain : _sfxGain);
      osc.start(t);
      osc.stop(t + dur + 0.05);
    } catch(e) {}
  }

  // ── Move SFX (one per move type) ──────────────────────────
  // FASE 3: heavy=true (signature moves) → extra sub-boom door de echo-bus
  function playMoveSfx(type, category, heavy) {
    _ensureInit();
    if (!_ctx) return;
    const t = _ctx.currentTime + 0.015;
    if (heavy && _delaySend) {
      try {
        const boom = _ctx.createOscillator();
        const be = _ctx.createGain();
        boom.type = 'sine';
        boom.frequency.setValueAtTime(72, t);
        boom.frequency.exponentialRampToValueAtTime(38, t + 0.5);
        be.gain.setValueAtTime(0.0001, t);
        be.gain.linearRampToValueAtTime(0.5, t + 0.02);
        be.gain.exponentialRampToValueAtTime(0.001, t + 0.65);
        boom.connect(be);
        be.connect(_sfxGain);
        be.connect(_delaySend); // echo-staart maakt het signature-groot
        boom.start(t); boom.stop(t + 0.7);
      } catch(e) {}
    }
    try {
      const tp = (type || 'NORMAL').toUpperCase();
      const cat = (category || '').toUpperCase();
      if (cat === 'STATUS') { _sfxStatus(t); return; }
      switch(tp) {
        case 'FIRE':     _sfxFire(t);     break;
        case 'WATER':    _sfxWater(t);    break;
        case 'GRASS':    _sfxGrass(t);    break;
        case 'ELECTRIC': _sfxElectric(t); break;
        case 'ICE':      _sfxIce(t);      break;
        case 'GROUND':   _sfxGround(t);   break;
        case 'PSYCHIC':  _sfxPsychic(t);  break;
        case 'ROCK':     _sfxRock(t);     break;
        case 'DARK':     _sfxDark(t);     break;
        case 'DRAGON':   _sfxDragon(t);   break;
        case 'POISON':   _sfxPoison(t);   break;
        case 'FLYING':   _sfxFlying(t);   break;
        case 'BUG':      _sfxBug(t);      break;
        case 'GHOST':    _sfxGhost(t);    break;
        case 'STEEL':    _sfxSteel(t);    break;
        case 'FAIRY':    _sfxFairy(t);    break;
        case 'FIGHTING':
        case 'NORMAL':
        default:         _sfxPhysical(t); break;
      }
    } catch(e) {}
  }

  // Physical hit — low thud
  function _sfxPhysical(t) {
    const osc = _ctx.createOscillator();
    const env = _ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.18);
    env.gain.setValueAtTime(0.35, t);
    env.gain.exponentialRampToValueAtTime(0.001, t + 0.20);
    osc.connect(env); env.connect(_sfxGain);
    osc.start(t); osc.stop(t + 0.22);
    // Crack layer
    const sr = _ctx.sampleRate;
    const buf = _ctx.createBuffer(1, Math.floor(sr * 0.06), sr);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
    const src = _ctx.createBufferSource(); src.buffer = buf;
    const filt = _ctx.createBiquadFilter(); filt.type = 'bandpass'; filt.frequency.value = 800; filt.Q.value = 0.5;
    const eg = _ctx.createGain(); eg.gain.setValueAtTime(0.25, t); eg.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
    src.connect(filt); filt.connect(eg); eg.connect(_sfxGain);
    src.start(t); src.stop(t + 0.07);
  }

  // Fire — rising crackling sweep
  function _sfxFire(t) {
    const osc = _ctx.createOscillator();
    const env = _ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, t);
    osc.frequency.exponentialRampToValueAtTime(800, t + 0.25);
    env.gain.setValueAtTime(0, t);
    env.gain.linearRampToValueAtTime(0.28, t + 0.04);
    env.gain.exponentialRampToValueAtTime(0.001, t + 0.30);
    osc.connect(env); env.connect(_sfxGain);
    osc.start(t); osc.stop(t + 0.32);
    // Noise crackle
    const sr = _ctx.sampleRate;
    const buf = _ctx.createBuffer(1, Math.floor(sr * 0.28), sr);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const src = _ctx.createBufferSource(); src.buffer = buf;
    const filt = _ctx.createBiquadFilter(); filt.type = 'bandpass'; filt.frequency.value = 1800; filt.Q.value = 1.5;
    const eg = _ctx.createGain(); eg.gain.setValueAtTime(0.15, t); eg.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
    src.connect(filt); filt.connect(eg); eg.connect(_sfxGain);
    src.start(t); src.stop(t + 0.30);
  }

  // Water — splash (lowpass filtered noise)
  function _sfxWater(t) {
    const sr = _ctx.sampleRate;
    const dur = 0.32;
    const buf = _ctx.createBuffer(1, Math.floor(sr * dur), sr);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const src = _ctx.createBufferSource(); src.buffer = buf;
    const filt = _ctx.createBiquadFilter(); filt.type = 'lowpass'; filt.frequency.value = 1200; filt.Q.value = 2;
    const eg = _ctx.createGain();
    eg.gain.setValueAtTime(0, t);
    eg.gain.linearRampToValueAtTime(0.30, t + 0.03);
    eg.gain.setValueAtTime(0.30, t + 0.10);
    eg.gain.exponentialRampToValueAtTime(0.001, t + dur);
    src.connect(filt); filt.connect(eg); eg.connect(_sfxGain);
    src.start(t); src.stop(t + dur + 0.05);
    // Bubble tone
    const osc = _ctx.createOscillator(); const env = _ctx.createGain();
    osc.type = 'sine'; osc.frequency.setValueAtTime(600, t); osc.frequency.linearRampToValueAtTime(300, t + 0.2);
    env.gain.setValueAtTime(0.12, t); env.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
    osc.connect(env); env.connect(_sfxGain); osc.start(t); osc.stop(t + 0.24);
  }

  // Grass — rustling mid noise
  function _sfxGrass(t) {
    const sr = _ctx.sampleRate;
    const buf = _ctx.createBuffer(1, Math.floor(sr * 0.25), sr);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const src = _ctx.createBufferSource(); src.buffer = buf;
    const filt = _ctx.createBiquadFilter(); filt.type = 'bandpass'; filt.frequency.value = 600; filt.Q.value = 2;
    const eg = _ctx.createGain(); eg.gain.setValueAtTime(0.22, t); eg.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
    src.connect(filt); filt.connect(eg); eg.connect(_sfxGain);
    src.start(t); src.stop(t + 0.27);
    // Whip crack
    const osc = _ctx.createOscillator(); const env = _ctx.createGain();
    osc.type = 'sawtooth'; osc.frequency.setValueAtTime(400, t); osc.frequency.exponentialRampToValueAtTime(80, t + 0.12);
    env.gain.setValueAtTime(0.18, t); env.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
    osc.connect(env); env.connect(_sfxGain); osc.start(t); osc.stop(t + 0.16);
  }

  // Electric — sharp zap
  function _sfxElectric(t) {
    for (let z = 0; z < 3; z++) {
      const zt = t + z * 0.07;
      const osc = _ctx.createOscillator(); const env = _ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(1200 - z * 200, zt);
      osc.frequency.exponentialRampToValueAtTime(200, zt + 0.06);
      env.gain.setValueAtTime(0.22, zt); env.gain.exponentialRampToValueAtTime(0.001, zt + 0.06);
      osc.connect(env); env.connect(_sfxGain); osc.start(zt); osc.stop(zt + 0.08);
    }
    const sr = _ctx.sampleRate;
    const buf = _ctx.createBuffer(1, Math.floor(sr * 0.22), sr);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const src = _ctx.createBufferSource(); src.buffer = buf;
    const filt = _ctx.createBiquadFilter(); filt.type = 'highpass'; filt.frequency.value = 5000;
    const eg = _ctx.createGain(); eg.gain.setValueAtTime(0.18, t); eg.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
    src.connect(filt); filt.connect(eg); eg.connect(_sfxGain);
    src.start(t); src.stop(t + 0.24);
  }

  // Ice — crystalline chime
  function _sfxIce(t) {
    [1047, 1319, 1568].forEach((f, i) => {
      const ot = t + i * 0.04;
      const osc = _ctx.createOscillator(); const env = _ctx.createGain();
      osc.type = 'triangle'; osc.frequency.value = f;
      env.gain.setValueAtTime(0.20, ot); env.gain.exponentialRampToValueAtTime(0.001, ot + 0.30);
      osc.connect(env); env.connect(_sfxGain); osc.start(ot); osc.stop(ot + 0.32);
    });
    const sr = _ctx.sampleRate;
    const buf = _ctx.createBuffer(1, Math.floor(sr * 0.18), sr);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const src = _ctx.createBufferSource(); src.buffer = buf;
    const filt = _ctx.createBiquadFilter(); filt.type = 'highpass'; filt.frequency.value = 6000;
    const eg = _ctx.createGain(); eg.gain.setValueAtTime(0.10, t); eg.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
    src.connect(filt); filt.connect(eg); eg.connect(_sfxGain);
    src.start(t); src.stop(t + 0.20);
  }

  // Ground — deep rumble + thud
  function _sfxGround(t) {
    const osc = _ctx.createOscillator(); const env = _ctx.createGain();
    osc.type = 'sine'; osc.frequency.setValueAtTime(80, t); osc.frequency.exponentialRampToValueAtTime(30, t + 0.35);
    env.gain.setValueAtTime(0.40, t); env.gain.exponentialRampToValueAtTime(0.001, t + 0.38);
    osc.connect(env); env.connect(_sfxGain); osc.start(t); osc.stop(t + 0.40);
    const osc2 = _ctx.createOscillator(); const env2 = _ctx.createGain();
    osc2.type = 'sawtooth'; osc2.frequency.setValueAtTime(150, t); osc2.frequency.exponentialRampToValueAtTime(50, t + 0.25);
    env2.gain.setValueAtTime(0.25, t); env2.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
    osc2.connect(env2); env2.connect(_sfxGain); osc2.start(t); osc2.stop(t + 0.30);
  }

  // Psychic — eerie sine sweep
  function _sfxPsychic(t) {
    const osc = _ctx.createOscillator(); const env = _ctx.createGain();
    osc.type = 'sine'; osc.frequency.setValueAtTime(400, t);
    osc.frequency.setValueAtTime(800, t + 0.10);
    osc.frequency.setValueAtTime(300, t + 0.22);
    osc.frequency.linearRampToValueAtTime(1200, t + 0.35);
    env.gain.setValueAtTime(0, t); env.gain.linearRampToValueAtTime(0.22, t + 0.05);
    env.gain.setValueAtTime(0.22, t + 0.28); env.gain.exponentialRampToValueAtTime(0.001, t + 0.38);
    osc.connect(env); env.connect(_sfxGain); osc.start(t); osc.stop(t + 0.40);
    const osc2 = _ctx.createOscillator(); const env2 = _ctx.createGain();
    osc2.type = 'sine'; osc2.frequency.setValueAtTime(600, t); osc2.frequency.linearRampToValueAtTime(200, t + 0.35);
    env2.gain.setValueAtTime(0.12, t); env2.gain.exponentialRampToValueAtTime(0.001, t + 0.38);
    osc2.connect(env2); env2.connect(_sfxGain); osc2.start(t); osc2.stop(t + 0.40);
  }

  // Rock — crunching impact
  function _sfxRock(t) {
    _sfxPhysical(t);
    const osc = _ctx.createOscillator(); const env = _ctx.createGain();
    osc.type = 'sawtooth'; osc.frequency.setValueAtTime(200, t); osc.frequency.exponentialRampToValueAtTime(60, t + 0.22);
    env.gain.setValueAtTime(0.28, t); env.gain.exponentialRampToValueAtTime(0.001, t + 0.24);
    osc.connect(env); env.connect(_sfxGain); osc.start(t); osc.stop(t + 0.26);
  }

  // Dark — low whoosh
  function _sfxDark(t) {
    const osc = _ctx.createOscillator(); const env = _ctx.createGain();
    osc.type = 'sine'; osc.frequency.setValueAtTime(300, t); osc.frequency.exponentialRampToValueAtTime(80, t + 0.30);
    env.gain.setValueAtTime(0, t); env.gain.linearRampToValueAtTime(0.24, t + 0.06);
    env.gain.exponentialRampToValueAtTime(0.001, t + 0.32);
    osc.connect(env); env.connect(_sfxGain); osc.start(t); osc.stop(t + 0.34);
    const sr = _ctx.sampleRate;
    const buf = _ctx.createBuffer(1, Math.floor(sr * 0.28), sr);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const src = _ctx.createBufferSource(); src.buffer = buf;
    const filt = _ctx.createBiquadFilter(); filt.type = 'lowpass'; filt.frequency.value = 400;
    const eg = _ctx.createGain(); eg.gain.setValueAtTime(0.14, t); eg.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
    src.connect(filt); filt.connect(eg); eg.connect(_sfxGain);
    src.start(t); src.stop(t + 0.30);
  }

  // Dragon — roar sweep
  function _sfxDragon(t) {
    const osc = _ctx.createOscillator(); const env = _ctx.createGain();
    osc.type = 'sawtooth'; osc.frequency.setValueAtTime(100, t);
    osc.frequency.exponentialRampToValueAtTime(400, t + 0.20);
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.45);
    env.gain.setValueAtTime(0, t); env.gain.linearRampToValueAtTime(0.32, t + 0.06);
    env.gain.setValueAtTime(0.32, t + 0.30); env.gain.exponentialRampToValueAtTime(0.001, t + 0.48);
    osc.connect(env); env.connect(_sfxGain); osc.start(t); osc.stop(t + 0.50);
    const osc2 = _ctx.createOscillator(); const env2 = _ctx.createGain();
    osc2.type = 'square'; osc2.frequency.setValueAtTime(50, t); osc2.frequency.exponentialRampToValueAtTime(200, t + 0.25);
    env2.gain.setValueAtTime(0.18, t); env2.gain.exponentialRampToValueAtTime(0.001, t + 0.40);
    osc2.connect(env2); env2.connect(_sfxGain); osc2.start(t); osc2.stop(t + 0.42);
  }

  // Poison — bubbling drip
  function _sfxPoison(t) {
    [0, 0.08, 0.17, 0.26].forEach((dt, i) => {
      const ot = t + dt;
      const osc = _ctx.createOscillator(); const env = _ctx.createGain();
      osc.type = 'sine'; osc.frequency.setValueAtTime(300 + i * 80, ot); osc.frequency.exponentialRampToValueAtTime(150, ot + 0.08);
      env.gain.setValueAtTime(0.18, ot); env.gain.exponentialRampToValueAtTime(0.001, ot + 0.09);
      osc.connect(env); env.connect(_sfxGain); osc.start(ot); osc.stop(ot + 0.10);
    });
  }

  // Flying — wind whoosh
  function _sfxFlying(t) {
    const sr = _ctx.sampleRate;
    const buf = _ctx.createBuffer(1, Math.floor(sr * 0.28), sr);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const src = _ctx.createBufferSource(); src.buffer = buf;
    const filt = _ctx.createBiquadFilter(); filt.type = 'bandpass'; filt.frequency.value = 2000; filt.Q.value = 3;
    const eg = _ctx.createGain();
    eg.gain.setValueAtTime(0, t); eg.gain.linearRampToValueAtTime(0.24, t + 0.06);
    eg.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
    src.connect(filt); filt.connect(eg); eg.connect(_sfxGain);
    src.start(t); src.stop(t + 0.30);
    const osc = _ctx.createOscillator(); const env = _ctx.createGain();
    osc.type = 'sine'; osc.frequency.setValueAtTime(800, t); osc.frequency.exponentialRampToValueAtTime(200, t + 0.25);
    env.gain.setValueAtTime(0.10, t); env.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
    osc.connect(env); env.connect(_sfxGain); osc.start(t); osc.stop(t + 0.27);
  }

  // Bug — buzzing
  function _sfxBug(t) {
    const osc = _ctx.createOscillator(); const env = _ctx.createGain();
    osc.type = 'square'; osc.frequency.setValueAtTime(280, t);
    env.gain.setValueAtTime(0, t); env.gain.linearRampToValueAtTime(0.20, t + 0.02);
    env.gain.setValueAtTime(0.20, t + 0.18); env.gain.exponentialRampToValueAtTime(0.001, t + 0.24);
    osc.connect(env); env.connect(_sfxGain); osc.start(t); osc.stop(t + 0.26);
    const osc2 = _ctx.createOscillator(); const env2 = _ctx.createGain();
    osc2.type = 'square'; osc2.frequency.setValueAtTime(420, t);
    env2.gain.setValueAtTime(0, t); env2.gain.linearRampToValueAtTime(0.10, t + 0.02);
    env2.gain.setValueAtTime(0.10, t + 0.18); env2.gain.exponentialRampToValueAtTime(0.001, t + 0.24);
    osc2.connect(env2); env2.connect(_sfxGain); osc2.start(t); osc2.stop(t + 0.26);
  }

  // Ghost — eerie wail
  function _sfxGhost(t) {
    const osc = _ctx.createOscillator(); const env = _ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, t); osc.frequency.linearRampToValueAtTime(600, t + 0.20);
    osc.frequency.linearRampToValueAtTime(150, t + 0.42);
    env.gain.setValueAtTime(0, t); env.gain.linearRampToValueAtTime(0.22, t + 0.08);
    env.gain.setValueAtTime(0.22, t + 0.32); env.gain.exponentialRampToValueAtTime(0.001, t + 0.44);
    osc.connect(env); env.connect(_sfxGain); osc.start(t); osc.stop(t + 0.46);
    const osc2 = _ctx.createOscillator(); const env2 = _ctx.createGain();
    osc2.type = 'sine'; osc2.frequency.setValueAtTime(300, t); osc2.frequency.linearRampToValueAtTime(800, t + 0.22);
    osc2.frequency.linearRampToValueAtTime(200, t + 0.44);
    env2.gain.setValueAtTime(0, t); env2.gain.linearRampToValueAtTime(0.12, t + 0.06);
    env2.gain.exponentialRampToValueAtTime(0.001, t + 0.44);
    osc2.connect(env2); env2.connect(_sfxGain); osc2.start(t); osc2.stop(t + 0.46);
  }

  // Steel — metallic clang
  function _sfxSteel(t) {
    [1480, 2220, 3000].forEach((f, i) => {
      const ot = t + i * 0.015;
      const osc = _ctx.createOscillator(); const env = _ctx.createGain();
      osc.type = 'triangle'; osc.frequency.value = f;
      env.gain.setValueAtTime(0.22 - i * 0.05, ot); env.gain.exponentialRampToValueAtTime(0.001, ot + 0.28 - i * 0.05);
      osc.connect(env); env.connect(_sfxGain); osc.start(ot); osc.stop(ot + 0.30);
    });
    _sfxPhysical(t);
  }

  // Fairy — sparkle chime
  function _sfxFairy(t) {
    [1047, 1319, 1568, 2093].forEach((f, i) => {
      const ot = t + i * 0.06;
      const osc = _ctx.createOscillator(); const env = _ctx.createGain();
      osc.type = 'triangle'; osc.frequency.value = f;
      env.gain.setValueAtTime(0.18, ot); env.gain.exponentialRampToValueAtTime(0.001, ot + 0.25);
      osc.connect(env); env.connect(_sfxGain); osc.start(ot); osc.stop(ot + 0.27);
    });
  }

  // Status — golden shimmer
  function _sfxStatus(t) {
    [523, 659, 784].forEach((f, i) => {
      const ot = t + i * 0.07;
      const osc = _ctx.createOscillator(); const env = _ctx.createGain();
      osc.type = 'sine'; osc.frequency.value = f;
      env.gain.setValueAtTime(0.16, ot); env.gain.exponentialRampToValueAtTime(0.001, ot + 0.22);
      osc.connect(env); env.connect(_sfxGain); osc.start(ot); osc.stop(ot + 0.24);
    });
  }

  // ── Victory jingle ────────────────────────────────────────
  function playVictoryJingle() {
    _ensureInit();
    if (!_ctx) return;
    _duck(1.4, 0.6); // FASE 3: muziek dimt voor de fanfare
    // Ascending 6-note fanfare — FASE 3: vooruit gepland (geen setTimeout) + echo op de slotnoot
    const notes = [523, 659, 784, 1047, 784, 1047];
    const timing = [0, 0.11, 0.22, 0.33, 0.46, 0.55];
    const base = _ctx.currentTime + 0.02;
    notes.forEach((n, i) => {
      try {
        const t = base + timing[i];
        const osc = _ctx.createOscillator();
        const env = _ctx.createGain();
        osc.type = 'triangle'; osc.frequency.value = n;
        const dur = i === notes.length - 1 ? 0.55 : 0.12;
        env.gain.setValueAtTime(0.0001, t);
        env.gain.linearRampToValueAtTime(0.30, t + 0.006);
        env.gain.exponentialRampToValueAtTime(0.001, t + dur + 0.02);
        osc.connect(env); env.connect(_sfxGain);
        if (i === notes.length - 1 && _delaySend) env.connect(_delaySend);
        osc.start(t); osc.stop(t + dur + 0.05);
      } catch(e) {}
    });
  }

  // ── Level-up jingle ───────────────────────────────────────
  function playLevelUp() {
    _ensureInit();
    if (!_ctx) return;
    _duck(0.7, 0.5); // FASE 3
    [523, 659, 784, 1047].forEach((n, i) => {
      setTimeout(() => {
        try {
          const osc = _ctx.createOscillator();
          const env = _ctx.createGain();
          osc.type = 'triangle'; osc.frequency.value = n;
          env.gain.setValueAtTime(0.30, _ctx.currentTime);
          env.gain.exponentialRampToValueAtTime(0.001, _ctx.currentTime + 0.18);
          osc.connect(env); env.connect(_sfxGain);
          osc.start(_ctx.currentTime); osc.stop(_ctx.currentTime + 0.20);
        } catch(e) {}
      }, i * 110);
    });
  }

  // ── Evolution fanfare ─────────────────────────────────────
  function playEvolution() {
    _ensureInit();
    if (!_ctx) return;
    _duck(1.0, 0.55); // FASE 3
    [523, 659, 784, 880, 1047, 880, 784, 1047].forEach((n, i) => {
      setTimeout(() => {
        try {
          const osc = _ctx.createOscillator();
          const env = _ctx.createGain();
          osc.type = 'triangle'; osc.frequency.value = n;
          env.gain.setValueAtTime(0.28, _ctx.currentTime);
          env.gain.exponentialRampToValueAtTime(0.001, _ctx.currentTime + 0.14);
          osc.connect(env); env.connect(_sfxGain);
          osc.start(_ctx.currentTime); osc.stop(_ctx.currentTime + 0.16);
        } catch(e) {}
      }, i * 85);
    });
  }

  // ── Critical hit SFX ─────────────────────────────────────
  function playCritHitSfx() {
    _ensureInit();
    if (!_ctx) return;
    _duck(0.35, 0.4); // FASE 3: korte dip laat de klap harder aankomen
    const t = _ctx.currentTime;
    try {
      // Deep impact punch: sine sweep 280→60 Hz
      const osc1 = _ctx.createOscillator();
      const env1 = _ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(280, t);
      osc1.frequency.exponentialRampToValueAtTime(60, t + 0.18);
      env1.gain.setValueAtTime(0, t);
      env1.gain.linearRampToValueAtTime(0.9, t + 0.01);
      env1.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
      osc1.connect(env1); env1.connect(_sfxGain);
      osc1.start(t); osc1.stop(t + 0.30);
    } catch(e) {}
    try {
      // Metallic high ring: triangle 1800 Hz sharp decay
      const osc2 = _ctx.createOscillator();
      const env2 = _ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.value = 1800;
      env2.gain.setValueAtTime(0.45, t + 0.01);
      env2.gain.exponentialRampToValueAtTime(0.001, t + 0.55);
      osc2.connect(env2); env2.connect(_sfxGain);
      osc2.start(t + 0.01); osc2.stop(t + 0.58);
    } catch(e) {}
    try {
      // Noise burst — white-noise crunch
      const bufLen   = Math.floor(_ctx.sampleRate * 0.06);
      const buffer   = _ctx.createBuffer(1, bufLen, _ctx.sampleRate);
      const data     = buffer.getChannelData(0);
      for (let i = 0; i < bufLen; i++) data[i] = (Math.random() * 2 - 1) * 0.8;
      const src = _ctx.createBufferSource();
      const filt = _ctx.createBiquadFilter();
      filt.type = 'bandpass'; filt.frequency.value = 600; filt.Q.value = 0.8;
      const eg = _ctx.createGain();
      eg.gain.setValueAtTime(0.55, t);
      eg.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
      src.buffer = buffer;
      src.connect(filt); filt.connect(eg); eg.connect(_sfxGain);
      src.start(t); src.stop(t + 0.09);
    } catch(e) {}
  }

  // ── Encounter jingle ─────────────────────────────────────
  function playEncounterJingle() {
    if (!_ctx) return;
    try {
      // Short dramatic "DUN DUN DUN" encounter sting
      const notes = [
        { freq: 440, t: 0,    dur: 0.08 },
        { freq: 523, t: 0.09, dur: 0.08 },
        { freq: 659, t: 0.18, dur: 0.12 },
        { freq: 784, t: 0.31, dur: 0.22 },
      ];
      const now = _ctx.currentTime;
      for (const n of notes) {
        const osc = _ctx.createOscillator();
        const g   = _ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(n.freq, now + n.t);
        g.gain.setValueAtTime(0, now + n.t);
        g.gain.linearRampToValueAtTime(0.4, now + n.t + 0.01);
        g.gain.exponentialRampToValueAtTime(0.001, now + n.t + n.dur);
        osc.connect(g);
        g.connect(_sfxGain);
        osc.start(now + n.t);
        osc.stop(now + n.t + n.dur + 0.01);
      }
    } catch(e) {}
  }

  // ── Battle music switcher (v11) ───────────────────────────
  // type: 'WILD' | 'TRAINER' | 'GYM' | 'ELITE' | 'CHAMPION'
  function playBattleMusic(type) {
    const map = {
      WILD:     'BATTLE_WILD',
      TRAINER:  'BATTLE_TRAINER',
      GYM:      'BATTLE_GYM',
      ELITE:    'BATTLE_ELITE',
      CHAMPION: 'BATTLE_CHAMPION',
    };
    const key = map[(type || 'WILD').toUpperCase()] || 'BATTLE_WILD';
    playMusic(key);
  }

  // ── Heal jingle ───────────────────────────────────────────
  function playHealJingle() {
    if (!_ctx) return;
    _duck(0.8, 0.5); // FASE 3
    try {
      const notes = [
        { freq: 523, t: 0,    dur: 0.10 },
        { freq: 659, t: 0.11, dur: 0.10 },
        { freq: 784, t: 0.22, dur: 0.10 },
        { freq: 1047, t: 0.33, dur: 0.22 },
      ];
      const now = _ctx.currentTime;
      for (const n of notes) {
        const osc = _ctx.createOscillator();
        const g   = _ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.freq, now + n.t);
        g.gain.setValueAtTime(0, now + n.t);
        g.gain.linearRampToValueAtTime(0.3, now + n.t + 0.01);
        g.gain.exponentialRampToValueAtTime(0.001, now + n.t + n.dur);
        osc.connect(g);
        g.connect(_sfxGain);
        if (n.freq === 1047 && _delaySend) g.connect(_delaySend); // staartje op de slotnoot
        osc.start(now + n.t);
        osc.stop(now + n.t + n.dur + 0.01);
      }
    } catch(e) {}
  }

  // ── Terrain footstep SFX ─────────────────────────────────────────────
  // Tile IDs 0-9 (all walkable): each gets a distinct procedural micro-sound.
  let _lastFootstepTile = -1;
  let _lastFootstepT = 0;
  function playFootstep(tileId) {
    if (!_ctx || !_sfxGain) return;
    // Only play every other step to avoid fatigue, and throttle by time
    const vol = _sfxGain.gain.value;
    if (vol < 0.01) return;
    const now = _ctx.currentTime;
    // FASE 8: harde throttle — max ~12 stappen/s aan geluid
    if (now - _lastFootstepT < 0.085) return;
    _lastFootstepT = now;
    const masterVol = vol * 0.18; // footsteps are subtle

    try {
      switch (tileId) {
        case 0: { // Indoor stone floor — short low thud
          const b = _ctx.createOscillator();
          const g = _ctx.createGain();
          b.connect(g); g.connect(_sfxGain);
          b.type = 'sine'; b.frequency.setValueAtTime(160, now);
          b.frequency.exponentialRampToValueAtTime(60, now + 0.06);
          g.gain.setValueAtTime(masterVol, now);
          g.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
          b.start(now); b.stop(now + 0.07);
          break;
        }
        case 1: { // Grass — soft high rustle
          const buf = _noise(0.08); // FASE 8: herbruikbaar
          const s = _ctx.createBufferSource();
          const f = _ctx.createBiquadFilter();
          const g = _ctx.createGain();
          s.buffer = buf; f.type = 'bandpass'; f.frequency.value = 3200; f.Q.value = 1.2;
          s.connect(f); f.connect(g); g.connect(_sfxGain);
          g.gain.setValueAtTime(masterVol * 0.7, now);
          g.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
          s.start(now);
          break;
        }
        case 2: { // Tall grass — louder rustle
          const buf = _noise(0.11); // FASE 8: herbruikbaar
          const s = _ctx.createBufferSource();
          const f = _ctx.createBiquadFilter();
          const g = _ctx.createGain();
          s.buffer = buf; f.type = 'bandpass'; f.frequency.value = 2800; f.Q.value = 0.9;
          s.connect(f); f.connect(g); g.connect(_sfxGain);
          g.gain.setValueAtTime(masterVol * 1.2, now);
          g.gain.exponentialRampToValueAtTime(0.001, now + 0.11);
          s.start(now);
          break;
        }
        case 3: { // Water — drip plop (sine drop)
          const b = _ctx.createOscillator();
          const g = _ctx.createGain();
          b.connect(g); g.connect(_sfxGain);
          b.type = 'sine'; b.frequency.setValueAtTime(520, now);
          b.frequency.exponentialRampToValueAtTime(180, now + 0.08);
          g.gain.setValueAtTime(masterVol * 0.9, now);
          g.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
          b.start(now); b.stop(now + 0.1);
          break;
        }
        case 4: { // Sand — dry crunch (filtered noise)
          const buf = _noise(0.09); // FASE 8: herbruikbaar
          const s = _ctx.createBufferSource();
          const f = _ctx.createBiquadFilter();
          const g = _ctx.createGain();
          s.buffer = buf; f.type = 'lowpass'; f.frequency.value = 900;
          s.connect(f); f.connect(g); g.connect(_sfxGain);
          g.gain.setValueAtTime(masterVol * 0.85, now);
          g.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
          s.start(now);
          break;
        }
        case 5: { // Stone/dirt path — sharp click
          const b = _ctx.createOscillator();
          const g = _ctx.createGain();
          b.connect(g); g.connect(_sfxGain);
          b.type = 'triangle'; b.frequency.setValueAtTime(620, now);
          b.frequency.exponentialRampToValueAtTime(200, now + 0.04);
          g.gain.setValueAtTime(masterVol * 0.8, now);
          g.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
          b.start(now); b.stop(now + 0.05);
          break;
        }
        case 6: { // Ice — crisp high tap + tiny echo
          const b  = _ctx.createOscillator();
          const b2 = _ctx.createOscillator();
          const g  = _ctx.createGain();
          const g2 = _ctx.createGain();
          b.connect(g);   g.connect(_sfxGain);
          b2.connect(g2); g2.connect(_sfxGain);
          b.type  = 'sine'; b.frequency.value  = 1100;
          b2.type = 'sine'; b2.frequency.value = 1100;
          g.gain.setValueAtTime(masterVol * 1.0, now);
          g.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
          g2.gain.setValueAtTime(masterVol * 0.3, now + 0.07);
          g2.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
          b.start(now);  b.stop(now + 0.05);
          b2.start(now + 0.07); b2.stop(now + 0.12);
          break;
        }
        case 7: { // Lava — low heavy thud + crackle
          const b = _ctx.createOscillator();
          const buf = _noise(0.06); // FASE 8: herbruikbaar
          const ns = _ctx.createBufferSource();
          const nf = _ctx.createBiquadFilter();
          const g  = _ctx.createGain();
          const gn = _ctx.createGain();
          b.connect(g);   g.connect(_sfxGain);
          ns.buffer = buf; nf.type = 'bandpass'; nf.frequency.value = 800; nf.Q.value = 0.5;
          ns.connect(nf); nf.connect(gn); gn.connect(_sfxGain);
          b.type = 'sine'; b.frequency.setValueAtTime(80, now);
          b.frequency.exponentialRampToValueAtTime(30, now + 0.08);
          g.gain.setValueAtTime(masterVol * 1.1, now);
          g.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
          gn.gain.setValueAtTime(masterVol * 0.5, now);
          gn.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
          b.start(now); b.stop(now + 0.09); ns.start(now);
          break;
        }
        case 8: { // Swamp — wet squelch (sine drop + noise blob)
          const b = _ctx.createOscillator();
          const g = _ctx.createGain();
          b.connect(g); g.connect(_sfxGain);
          b.type = 'sine'; b.frequency.setValueAtTime(280, now);
          b.frequency.exponentialRampToValueAtTime(70, now + 0.1);
          g.gain.setValueAtTime(masterVol * 0.95, now);
          g.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
          b.start(now); b.stop(now + 0.12);
          break;
        }
        case 9: { // Flowers — light airy swish
          const buf = _noise(0.07); // FASE 8: herbruikbaar
          const s = _ctx.createBufferSource();
          const f = _ctx.createBiquadFilter();
          const g = _ctx.createGain();
          s.buffer = buf; f.type = 'highpass'; f.frequency.value = 4500;
          s.connect(f); f.connect(g); g.connect(_sfxGain);
          g.gain.setValueAtTime(masterVol * 0.55, now);
          g.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
          s.start(now);
          break;
        }
        default: break;
      }
    } catch(e) {}
  }

  // ── FASE 7: vangst-geluiden ─────────────────────────────────
  // kind: 'THROW' (worp-whoosh) | 'IMPACT' (plok+zuig) | 'SHAKE' (tik-tak
  // per wiebel) | 'LOCK' (klik + succes-chime, met ducking) | 'BREAK' (barst)
  function playCatchSfx(kind) {
    _ensureInit();
    if (!_ctx) return;
    const t = _ctx.currentTime;
    try {
      if (kind === 'THROW') {
        const src = _ctx.createBufferSource();
        src.buffer = _noise(0.3); // FASE 8: herbruikbaar; gain-envelope doet het verval
        const f = _ctx.createBiquadFilter();
        f.type = 'bandpass'; f.Q.value = 1.2;
        f.frequency.setValueAtTime(500, t);
        f.frequency.exponentialRampToValueAtTime(2400, t + 0.28);
        const g = _ctx.createGain();
        g.gain.setValueAtTime(0.0001, t);
        g.gain.linearRampToValueAtTime(0.35, t + 0.04);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
        src.connect(f); f.connect(g); g.connect(_sfxGain);
        src.start(t); src.stop(t + 0.32);
      } else if (kind === 'IMPACT') {
        const o1 = _ctx.createOscillator(); const g1 = _ctx.createGain();
        o1.type = 'sine';
        o1.frequency.setValueAtTime(220, t);
        o1.frequency.exponentialRampToValueAtTime(70, t + 0.1);
        g1.gain.setValueAtTime(0.0001, t);
        g1.gain.linearRampToValueAtTime(0.5, t + 0.008);
        g1.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
        o1.connect(g1); g1.connect(_sfxGain);
        o1.start(t); o1.stop(t + 0.16);
        const o2 = _ctx.createOscillator(); const g2 = _ctx.createGain();
        o2.type = 'sawtooth';
        o2.frequency.setValueAtTime(900, t + 0.02);
        o2.frequency.exponentialRampToValueAtTime(160, t + 0.3);
        g2.gain.setValueAtTime(0.0001, t + 0.02);
        g2.gain.linearRampToValueAtTime(0.12, t + 0.05);
        g2.gain.exponentialRampToValueAtTime(0.001, t + 0.32);
        o2.connect(g2); g2.connect(_sfxGain);
        o2.start(t + 0.02); o2.stop(t + 0.34);
      } else if (kind === 'SHAKE') {
        [[0, 950], [0.09, 700]].forEach((tk) => {
          const o = _ctx.createOscillator(); const g = _ctx.createGain();
          o.type = 'square'; o.frequency.setValueAtTime(tk[1], t + tk[0]);
          g.gain.setValueAtTime(0.0001, t + tk[0]);
          g.gain.linearRampToValueAtTime(0.22, t + tk[0] + 0.004);
          g.gain.exponentialRampToValueAtTime(0.001, t + tk[0] + 0.045);
          o.connect(g); g.connect(_sfxGain);
          o.start(t + tk[0]); o.stop(t + tk[0] + 0.06);
        });
      } else if (kind === 'LOCK') {
        _duck(1.2, 0.55);
        const o = _ctx.createOscillator(); const g = _ctx.createGain();
        o.type = 'square'; o.frequency.setValueAtTime(1300, t);
        g.gain.setValueAtTime(0.0001, t);
        g.gain.linearRampToValueAtTime(0.3, t + 0.004);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
        o.connect(g); g.connect(_sfxGain);
        o.start(t); o.stop(t + 0.08);
        // succes-chime: 3 stijgende noten, slotnoot met echo-staart
        [[0.10, 784], [0.22, 988], [0.34, 1319]].forEach((nt, i) => {
          const oc = _ctx.createOscillator(); const gc = _ctx.createGain();
          oc.type = 'triangle'; oc.frequency.setValueAtTime(nt[1], t + nt[0]);
          gc.gain.setValueAtTime(0.0001, t + nt[0]);
          gc.gain.linearRampToValueAtTime(0.28, t + nt[0] + 0.008);
          gc.gain.exponentialRampToValueAtTime(0.001, t + nt[0] + (i === 2 ? 0.5 : 0.16));
          oc.connect(gc); gc.connect(_sfxGain);
          if (i === 2 && _delaySend) gc.connect(_delaySend);
          oc.start(t + nt[0]); oc.stop(t + nt[0] + 0.55);
        });
      } else if (kind === 'BREAK') {
        const src = _ctx.createBufferSource();
        src.buffer = _noise(0.12); // FASE 8: herbruikbaar
        const f = _ctx.createBiquadFilter();
        f.type = 'bandpass'; f.frequency.value = 1400; f.Q.value = 0.6;
        const g = _ctx.createGain();
        g.gain.setValueAtTime(0.45, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.13);
        src.connect(f); f.connect(g); g.connect(_sfxGain);
        src.start(t); src.stop(t + 0.14);
        const o = _ctx.createOscillator(); const g2 = _ctx.createGain();
        o.type = 'sawtooth';
        o.frequency.setValueAtTime(500, t + 0.02);
        o.frequency.exponentialRampToValueAtTime(140, t + 0.25);
        g2.gain.setValueAtTime(0.0001, t + 0.02);
        g2.gain.linearRampToValueAtTime(0.18, t + 0.04);
        g2.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
        o.connect(g2); g2.connect(_sfxGain);
        o.start(t + 0.02); o.stop(t + 0.3);
      }
    } catch(e) {}
  }

  // ── FASE 10: SFX-accent per move-stijl ──────────────────────
  // Aanvulling op playMoveSfx: het stijl-karakter wordt hoorbaar
  // (donderklap, aanhoudende jet, kaak-klap, rommel, zwiepen…)
  function playStyleAccent(style) {
    _ensureInit();
    if (!_ctx) return;
    const t = _ctx.currentTime + 0.02;
    try {
      if (style === 'BOLT') {
        const src = _ctx.createBufferSource(); src.buffer = _noise(0.4);
        const f = _ctx.createBiquadFilter();
        f.type = 'lowpass';
        f.frequency.setValueAtTime(3000, t);
        f.frequency.exponentialRampToValueAtTime(300, t + 0.4);
        const g = _ctx.createGain();
        g.gain.setValueAtTime(0.0001, t);
        g.gain.linearRampToValueAtTime(0.5, t + 0.01);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
        src.connect(f); f.connect(g); g.connect(_sfxGain);
        if (_delaySend) g.connect(_delaySend);
        src.start(t); src.stop(t + 0.45);
      } else if (style === 'STREAM') {
        const src = _ctx.createBufferSource(); src.buffer = _noise(0.6);
        const f = _ctx.createBiquadFilter();
        f.type = 'bandpass'; f.Q.value = 0.8;
        f.frequency.setValueAtTime(900, t);
        f.frequency.linearRampToValueAtTime(1500, t + 0.5);
        const g = _ctx.createGain();
        g.gain.setValueAtTime(0.0001, t);
        g.gain.linearRampToValueAtTime(0.22, t + 0.08);
        g.gain.setValueAtTime(0.22, t + 0.45);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.62);
        src.connect(f); f.connect(g); g.connect(_sfxGain);
        src.start(t); src.stop(t + 0.65);
      } else if (style === 'CHOMP') {
        [[0.16, 1100], [0.2, 500]].forEach((cfg) => {
          const o = _ctx.createOscillator(); const g = _ctx.createGain();
          o.type = 'square'; o.frequency.setValueAtTime(cfg[1], t + cfg[0]);
          g.gain.setValueAtTime(0.0001, t + cfg[0]);
          g.gain.linearRampToValueAtTime(0.3, t + cfg[0] + 0.005);
          g.gain.exponentialRampToValueAtTime(0.001, t + cfg[0] + 0.06);
          o.connect(g); g.connect(_sfxGain);
          o.start(t + cfg[0]); o.stop(t + cfg[0] + 0.08);
        });
      } else if (style === 'QUAKE') {
        const o = _ctx.createOscillator(); const g = _ctx.createGain();
        o.type = 'sine'; o.frequency.setValueAtTime(38, t);
        const lfo = _ctx.createOscillator(); const lg = _ctx.createGain();
        lfo.frequency.value = 7; lg.gain.value = 9;
        lfo.connect(lg); lg.connect(o.frequency);
        g.gain.setValueAtTime(0.0001, t);
        g.gain.linearRampToValueAtTime(0.5, t + 0.05);
        g.gain.setValueAtTime(0.5, t + 0.45);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.7);
        o.connect(g); g.connect(_sfxGain);
        o.start(t); o.stop(t + 0.72); lfo.start(t); lfo.stop(t + 0.72);
      } else if (style === 'SLASH') {
        [0, 0.11, 0.22].forEach((dt2) => {
          const src = _ctx.createBufferSource(); src.buffer = _noise(0.09);
          const f = _ctx.createBiquadFilter();
          f.type = 'highpass'; f.frequency.value = 2600;
          const g = _ctx.createGain();
          g.gain.setValueAtTime(0.0001, t + dt2);
          g.gain.linearRampToValueAtTime(0.25, t + dt2 + 0.01);
          g.gain.exponentialRampToValueAtTime(0.001, t + dt2 + 0.09);
          src.connect(f); f.connect(g); g.connect(_sfxGain);
          src.start(t + dt2); src.stop(t + dt2 + 0.1);
        });
      } else if (style === 'ORB') {
        const o = _ctx.createOscillator(); const g = _ctx.createGain();
        o.type = 'sine'; o.frequency.setValueAtTime(220, t);
        o.frequency.exponentialRampToValueAtTime(660, t + 0.35);
        g.gain.setValueAtTime(0.0001, t);
        g.gain.linearRampToValueAtTime(0.16, t + 0.06);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
        o.connect(g); g.connect(_sfxGain);
        o.start(t); o.stop(t + 0.42);
      } else if (style === 'TWISTER') {
        const src = _ctx.createBufferSource(); src.buffer = _noise(0.55);
        const f = _ctx.createBiquadFilter();
        f.type = 'bandpass'; f.Q.value = 1.4;
        f.frequency.setValueAtTime(500, t);
        f.frequency.linearRampToValueAtTime(1300, t + 0.25);
        f.frequency.linearRampToValueAtTime(600, t + 0.5);
        const g = _ctx.createGain();
        g.gain.setValueAtTime(0.0001, t);
        g.gain.linearRampToValueAtTime(0.2, t + 0.08);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.55);
        src.connect(f); f.connect(g); g.connect(_sfxGain);
        src.start(t); src.stop(t + 0.58);
      } else if (style === 'RAIN') {
        [0.05, 0.22, 0.38].forEach((dt2) => {
          const o = _ctx.createOscillator(); const g = _ctx.createGain();
          o.type = 'sine'; o.frequency.setValueAtTime(150, t + dt2);
          o.frequency.exponentialRampToValueAtTime(55, t + dt2 + 0.08);
          g.gain.setValueAtTime(0.0001, t + dt2);
          g.gain.linearRampToValueAtTime(0.3, t + dt2 + 0.008);
          g.gain.exponentialRampToValueAtTime(0.001, t + dt2 + 0.12);
          o.connect(g); g.connect(_sfxGain);
          o.start(t + dt2); o.stop(t + dt2 + 0.14);
        });
      }
    } catch(e) {}
  }

  // ── FASE 3: meet-API voor verificatie & debugging ──────────
  // getLevel() = RMS van de master-uitgang; getDebugState() = interne mix-staat
  function getLevel(loHz, hiHz) {
    if (!_analyser) return 0;
    try {
      if (loHz != null && hiHz != null) {
        // Frequentieband-energie (voor verificatie van specifieke lagen)
        const bins = new Uint8Array(_analyser.frequencyBinCount);
        _analyser.getByteFrequencyData(bins);
        const hzPerBin = (_ctx.sampleRate / 2) / bins.length;
        const lo = Math.max(0, Math.floor(loHz / hzPerBin));
        const hi = Math.min(bins.length - 1, Math.ceil(hiHz / hzPerBin));
        let sum = 0;
        for (let i = lo; i <= hi; i++) sum += bins[i];
        return sum / Math.max(1, hi - lo + 1) / 255;
      }
      const a = new Uint8Array(_analyser.fftSize);
      _analyser.getByteTimeDomainData(a);
      let s = 0;
      for (let i = 0; i < a.length; i++) { const v = (a[i] - 128) / 128; s += v * v; }
      return Math.sqrt(s / a.length);
    } catch(e) { return 0; }
  }
  function getDebugState() {
    return {
      ctxState:  _ctx ? _ctx.state : 'none',
      time:      _ctx ? _ctx.currentTime : 0,
      music:     _currentMusic,
      musicGain: _musicGain ? _musicGain.gain.value : 0,
      musicVol:  _musicVol,
      intensity: _intensity,
      level:     getLevel(),
    };
  }

  console.log('[DinoMon] Audio loaded — v13: reverb/delay-bus, ADSR, adaptieve muziek.');

  return {
    init, setMusicVolume, setSfxVolume,
    playMusic, stopMusic, playSfx,
    playBattleMusic,
    playLevelUp, playEvolution, playMoveSfx, playVictoryJingle, playCritHitSfx,
    playEncounterJingle, playHealJingle,
    playFootstep,
    // FASE 3: adaptieve muziek + meet-API
    setIntensity, getLevel, getDebugState,
    // FASE 7: vangst-geluiden
    playCatchSfx,
    // FASE 10: stijl-accenten
    playStyleAccent,
  };
})();

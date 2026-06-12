// DinoMon: Fossil Frontier — battle/battleAnim.js
// Layered visual move animations: 15 styles × 18 types × 5 intensities
// v22: effectiveness flash + money pop animation + trainer name slide-in intro

window.DG = window.DG || {};

DG.BattleAnim = (function () {

  // ── Position constants ─────────────────────────────────────
  const PPOS = { x: 65,  y: 130 };  // player mon
  const EPOS = { x: 290, y: 80  };  // enemy mon (FASE 12: op het platformcentrum)

  // ── Duration table per style ───────────────────────────────
  const BASE_DUR = {
    BEAM:40, PROJECTILE:35, BURST:30, WAVE:35, MELEE:25, FIELD:50,
    SELF:45, AURA:45, DRAIN:40, MULTI:20, ARC:40, CONE:30,
    SLAM:25, VORTEX:45, PULSE:35,
    // FASE 10: nieuwe getekende stijlen
    STREAM:46, BOLT:30, RAIN:46, SLASH:26, CHOMP:30, ORB:44, QUAKE:42, TWISTER:42,
  };

  // ── FASE 10: karakter-parameters per iconische move ─────────
  // (de stijl zelf komt uit moves.js; hier alleen breedte/snelheid/palet)
  const _MOVE_FX = {
    FLAMETHROWER:  { width: 1.35, pal: ['#ff6a00', '#ffd040', '#fff6c8'] },
    OVERHEAT:      { width: 1.6,  pal: ['#ff4400', '#ff9a30', '#ffe8b0'] },
    ERUPTION:      { width: 1.5,  pal: ['#ff5500', '#ffaa30', '#ffe8b0'] },
    HYDRO_PUMP:    { width: 0.75, speed: 1.6, pal: ['#1f7fe8', '#6fc4ff', '#eaf8ff'] },
    WATER_GUN:     { width: 0.5,  pal: ['#3a9ae8', '#9fd8ff', '#ffffff'] },
    WATER_SPOUT:   { width: 1.3,  pal: ['#1f7fe8', '#6fc4ff', '#eaf8ff'] },
    FROST_BREATH:  { width: 1.1,  pal: ['#7fd4ff', '#cfeeff', '#ffffff'] },
    DRAGON_BREATH: { width: 1.0,  pal: ['#7a4fe8', '#b08aff', '#f0e8ff'] },
    FLASH_CANNON:  { width: 0.85, speed: 1.4, pal: ['#aab8c8', '#dce8f5', '#ffffff'] },
    THUNDER:       { bolts: 3 },
    THUNDERBOLT:   { bolts: 2 },
    THUNDER_SHOCK: { bolts: 1 },
    DRACO_METEOR:  { size: 1.6 },
    BLIZZARD:      { size: 0.8 },
  };
  let _fx      = {};   // actieve parameters van de huidige move
  let _fxState = {};   // teken-staat van de nieuwe stijlen (bolt-segmenten enz.)

  // Intensity → duration scale
  const DUR_SCALE = [0.8, 1.0, 1.1, 1.2, 1.3, 1.5];

  // ── Per-type particle shape ────────────────────────────────
  // Overrides plain 'circle' rendering to give each type a unique particle look
  const _TYPE_SHAPE = {
    FIRE:     'flame',
    ELECTRIC: 'spark',
    ICE:      'crystal',
    WATER:    'drop',
    GRASS:    'leaf',
    ROCK:     'boulder',
    GROUND:   'boulder',
  };

  // ── Default style per type (legacy fallback) ───────────────
  const DEFAULT_STYLE = {
    FIRE:'BURST', WATER:'WAVE', GRASS:'CONE', ELECTRIC:'BEAM',
    ICE:'CONE', FIGHTING:'SLAM', POISON:'VORTEX', GROUND:'WAVE',
    FLYING:'ARC', PSYCHIC:'PULSE', BUG:'MULTI', ROCK:'ARC',
    GHOST:'VORTEX', DRAGON:'BEAM', DARK:'AURA', STEEL:'SLAM',
    FAIRY:'PULSE', NORMAL:'PROJECTILE'
  };

  // ── Type color helpers ─────────────────────────────────────
  function _typeColor(type) {
    if (window.DG && DG.TYPE_COLOR && DG.TYPE_COLOR[type]) return DG.TYPE_COLOR[type];
    return '#ffffff';
  }
  function _typeDark(type) {
    if (window.DG && DG.TYPE_DARK && DG.TYPE_DARK[type]) return DG.TYPE_DARK[type];
    return '#888888';
  }

  // ── Intensity calculation ──────────────────────────────────
  function _getIntensity(power, category) {
    if (!power || category === 'STATUS') return 0;
    if (power <= 45)  return 1;
    if (power <= 75)  return 2;
    if (power <= 100) return 3;
    if (power <= 130) return 4;
    return 5;
  }

  // ── Core animation state ───────────────────────────────────
  let _active     = false;
  let _frame      = 0;
  let _dur        = 0;
  let _isPlayer   = false;
  let _particles  = [];
  let _pOffset    = { x: 0, y: 0 };
  let _eOffset    = { x: 0, y: 0 };
  let _shake      = { x: 0, y: 0 };
  let _flash      = { alpha: 0, color: '#ffffff' };
  let _tickFn     = null;
  let _intensity  = 0;
  let _moveType   = 'NORMAL'; // current move type for particle shape selection
  let _col        = '#ffffff';
  let _hitRings   = [];       // expanding impact rings at defender position
  let _colDark    = '#888888';

  // ── Multi-hit queue ────────────────────────────────────────
  let _animQueue = [];  // [ { moveType, isPlayer, category, animStyle, power } ]
  let _gapTimer  = 0;

  // ── Special animation flags ────────────────────────────────
  let _specialAnim = null;  // 'FAINT'|'CATCH'|'SWITCH_IN'|'ENEMY_SWITCH'|'INTRO'|'ABILITY'|'SHINY'|'LEARN'
  let _specialFrame = 0;
  let _specialDur   = 0;
  let _specialData  = {};   // extra payload per special anim

  // ── Independent overlay animations (run alongside _specialAnim) ──
  let _effFlash   = { active: false, frame: 0, dur: 38, label: '', color: '#FFD700', side: 'enemy' };
  let _moneyPop   = { active: false, frame: 0, dur: 80, amount: 0 };

  // ── FASE 1: damage numbers, hit-stop & camera ──────────────
  let _dmgNumbers = [];   // { x, y, vx, vy, text, color, px, bold, life, maxLife }
  let _hitStop    = 0;    // freeze-frames bij impact
  let _camZoom    = 1;    // huidige camera-zoom
  let _camTarget  = 1;    // doel-zoom (decayt terug naar 1)
  let _camFocus   = { x: 240, y: 105 };

  // ── FASE 4: signature-move cinematics ──────────────────────
  let _sig      = null;   // { moveId, styleDur, styleTick, custom, beam }
  let _sigPhase = null;   // 'CHARGE' | 'UNLEASH'
  let _sigSlow  = 0;      // slow-motion teller (charge loopt op halve snelheid)
  let _cineBox  = 0;      // letterbox 0..1 (eased in update)
  let _cineBanner = { text: '', color: '#ffffff', alpha: 0 };

  // Alle 19 signature moves uit moves.js krijgen de cinematische behandeling
  const _SIG_SET = {
    FRILL_FLARE:1, ERUPTION_HORN:1, JADE_PLATE_SLAM:1, ANCIENT_TORRENT:1,
    SKULL_SLAM:1, VENOM_EARTH:1, EXTINCTION_BEAM:1, FOSSIL_MEMORY:1,
    GLACIAL_MIND:1, MIND_DIVE:1, FOREST_CANOPY:1, SAIL_BLAST:1,
    CLUB_SMASH:1, PLATE_SLAM:1, CRYSTAL_BEAM:1, DIVE_BOMB:1,
    INFERNO_CHARGE:1, SONIC_PULSE:1, NECK_LASSO:1,
  };

  // ── FASE 6: hit-reacties op de dino zelf ────────────────────
  const HIT_REACT_T = 12;
  let _hitReact = { side: null, t: 0 };  // wit-flits + terugdeins van de verdediger
  let _impactFrames = 0;                 // anime-stijl impact-frames (wit + invert)

  // ── FASE 7: na een succesvolle vangst blijft de dichte bal liggen
  // (en de gevangen dino verborgen) tot de battle volledig sluit
  let _caughtBall = null;                // ballId of null

  // ── FASE 9: charge-visual voor twee-beurten-moves ───────────
  // 'FLY' (uit beeld omhoog) | 'DIG' (ondergronds, zandhoop) |
  // 'PHANTOM_FORCE' (vervaagde schim) | null
  let _chargeVis = { player: null, enemy: null };
  function setChargeVisual(side, kind) {
    _chargeVis[side === 'player' ? 'player' : 'enemy'] = kind || null;
  }
  function getChargeVisual(side) {
    return _chargeVis[side === 'player' ? 'player' : 'enemy'];
  }

  const _DMG_KINDS = {
    normal: { color: '#ffffff', px: 13, bold: false, stop: 3 },
    weak:   { color: '#9ab4d4', px: 11, bold: false, stop: 2 },
    super:  { color: '#ffd75e', px: 16, bold: true,  stop: 6 },
    crit:   { color: '#ff6a3c', px: 16, bold: true,  stop: 7 },
    recoil: { color: '#c08aff', px: 11, bold: false, stop: 0 },
    heal:   { color: '#5ade7c', px: 13, bold: false, stop: 0 },
    // FASE 9: status-schade per beurt (brand/gif/overig) — geen hit-stop
    burn:   { color: '#ff9b4a', px: 12, bold: false, stop: 0 },
    poison: { color: '#c66bd9', px: 12, bold: false, stop: 0 },
    chip:   { color: '#9ab4d4', px: 11, bold: false, stop: 0 },
  };

  // Spawn een opspringend schadegetal boven het getroffen dier.
  // kind: 'normal' | 'weak' | 'super' | 'crit' | 'recoil' | 'heal'
  function popDamage(amount, targetIsPlayer, kind) {
    amount = Math.round(amount || 0);
    if (amount <= 0) return;
    const conf = _DMG_KINDS[kind] || _DMG_KINDS.normal;
    const pos  = targetIsPlayer ? PPOS : EPOS;
    _dmgNumbers.push({
      x: pos.x + (Math.random() * 18 - 9),
      y: pos.y - 30,
      vx: Math.random() * 0.8 - 0.4,
      vy: -1.7,
      text: (kind === 'heal' ? '+' : '-') + amount,
      color: conf.color, px: conf.px, bold: conf.bold,
      life: 55, maxLife: 55,
    });
    if (conf.stop) _hitStop = Math.max(_hitStop, conf.stop);
    if (kind === 'super') { _camTarget = Math.max(_camTarget, 1.06); _camFocus = { x: pos.x, y: pos.y }; }
    if (kind === 'crit')  { _camTarget = Math.max(_camTarget, 1.10); _camFocus = { x: pos.x, y: pos.y }; }
    // FASE 6: de geraakte dino flitst wit en deinst terug; zware klappen
    // krijgen anime-stijl impact-frames over het hele scherm
    if (kind !== 'heal' && kind !== 'recoil') {
      _hitReact = { side: targetIsPlayer ? 'player' : 'enemy', t: HIT_REACT_T };
      if (kind === 'super' || kind === 'crit') _impactFrames = 2;
    }
  }

  // FASE 6: door spriteRenderer uitgelezen — flits + terugdeins per kant
  function getHitReact() {
    if (_hitReact.t <= 0) return null;
    const t = _hitReact.t;
    return {
      side:   _hitReact.side,
      flash:  t > HIT_REACT_T - 5 && (_hitStop > 0 || t % 2 === 0),
      recoil: Math.max(0, t - 4) * 0.9,
    };
  }

  function getCamera() { return { zoom: _camZoom, x: _camFocus.x, y: _camFocus.y }; }

  // Wordt door de renderer ná draw() aangeroepen (binnen de shake-transform)
  function drawDamageNumbers(ctx) {
    if (_dmgNumbers.length === 0) return;
    const pa = ctx.textAlign, pb = ctx.textBaseline;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (const d of _dmgNumbers) {
      ctx.globalAlpha = d.life < 16 ? d.life / 16 : 1;
      ctx.font = (d.bold ? 'bold ' : '') + d.px + 'px monospace';
      ctx.fillStyle = 'rgba(0,0,30,0.8)';
      ctx.fillText(d.text, d.x + 1, d.y + 2);
      ctx.fillStyle = d.color;
      ctx.fillText(d.text, d.x, d.y);
    }
    ctx.globalAlpha = 1;
    ctx.textAlign = pa;
    ctx.textBaseline = pb;
  }

  // ── Canvas size helper ─────────────────────────────────────
  function _cw() { return (window.DG && DG.CANVAS) ? DG.CANVAS.W : 360; }
  function _ch() { return (window.DG && DG.CANVAS) ? DG.CANVAS.H : 200; }

  // ── Helpers ────────────────────────────────────────────────
  function _atkPos() { return _isPlayer ? { ...PPOS } : { ...EPOS }; }
  function _defPos() { return _isPlayer ? { ...EPOS } : { ...PPOS }; }

  // FASE 8: de échte sprite-centra op het canvas — de PPOS/EPOS-ankers liggen
  // ernaast, waardoor impact-ringen als losse halo's in de lucht zweefden
  const PCTR = { x: 69,  y: 152 };
  const ECTR = { x: 290, y: 78  }; // FASE 12: sprite-centrum na de uitlijnings-fix
  function _atkCtr() { return _isPlayer ? { ...PCTR } : { ...ECTR }; }
  function _defCtr() { return _isPlayer ? { ...ECTR } : { ...PCTR }; }

  function _spawn(x, y, vx, vy, r, color, life, shape, gravity) {
    _particles.push({
      x, y, vx, vy, r, color,
      life, maxLife: life,
      shape:   shape   || 'circle',
      gravity: gravity || 0,
    });
  }

  function _setShake(sx, sy) {
    _shake.x = sx * (Math.random() > 0.5 ? 1 : -1);
    _shake.y = sy * (Math.random() > 0.5 ? 1 : -1);
  }

  function _lerp(a, b, t) { return a + (b - a) * t; }

  // Hex color + alpha → rgba string
  function _rgba(hex, alpha) {
    const r = parseInt(hex.slice(1,3), 16);
    const g = parseInt(hex.slice(3,5), 16);
    const b = parseInt(hex.slice(5,7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  // ── Start a move animation ─────────────────────────────────
  function _startAnim(moveType, isPlayer, category, animStyle, power, moveId) {
    _active    = true;
    _frame     = 0;
    _isPlayer  = isPlayer;
    _particles = [];
    _pOffset   = { x: 0, y: 0 };
    _eOffset   = { x: 0, y: 0 };
    _shake     = { x: 0, y: 0 };
    _flash     = { alpha: 0, color: '#ffffff' };
    _sig       = null;
    _sigPhase  = null;
    _fx        = (moveId && _MOVE_FX[moveId]) || {};  // FASE 10
    _fxState   = {};                                   // FASE 10

    const type = (moveType  || 'NORMAL').toUpperCase();
    const cat  = (category  || 'PHYSICAL').toUpperCase();
    const style = ((animStyle || DEFAULT_STYLE[type] || 'PROJECTILE')).toUpperCase();

    _intensity = _getIntensity(power, cat);
    _moveType = type;
    _col       = _typeColor(type);
    _colDark   = _typeDark(type);

    const baseDur = BASE_DUR[style] || 35;
    _dur = Math.round(baseDur * DUR_SCALE[_intensity]);

    switch (style) {
      case 'BEAM':       _tickFn = _tick_BEAM;       break;
      case 'PROJECTILE': _tickFn = _tick_PROJECTILE; break;
      case 'BURST':      _tickFn = _tick_BURST;      break;
      case 'WAVE':       _tickFn = _tick_WAVE;       break;
      case 'MELEE':      _tickFn = _tick_MELEE;      break;
      case 'FIELD':      _tickFn = _tick_FIELD;      break;
      case 'SELF':       _tickFn = _tick_SELF;       break;
      case 'AURA':       _tickFn = _tick_AURA;       break;
      case 'DRAIN':      _tickFn = _tick_DRAIN;      break;
      case 'MULTI':      _tickFn = _tick_MULTI;      break;
      case 'ARC':        _tickFn = _tick_ARC;        break;
      case 'CONE':       _tickFn = _tick_CONE;       break;
      case 'SLAM':       _tickFn = _tick_SLAM;       break;
      case 'VORTEX':     _tickFn = _tick_VORTEX;     break;
      case 'PULSE':      _tickFn = _tick_PULSE;      break;
      // FASE 10: nieuwe getekende stijlen
      case 'STREAM':     _tickFn = _tick_STREAM;     break;
      case 'BOLT':       _tickFn = _tick_BOLT;       break;
      case 'RAIN':       _tickFn = _tick_RAIN;       break;
      case 'SLASH':      _tickFn = _tick_SLASH;      break;
      case 'CHOMP':      _tickFn = _tick_CHOMP;      break;
      case 'ORB':        _tickFn = _tick_ORB;        break;
      case 'QUAKE':      _tickFn = _tick_QUAKE;      break;
      case 'TWISTER':    _tickFn = _tick_TWISTER;    break;
      default:           _tickFn = _tick_PROJECTILE; break;
    }

    // ── FASE 4: signature move → cinematische charge-fase eerst ──
    if (moveId && _SIG_SET[moveId]) {
      const custom = _SIG_CUSTOM[moveId] || null;
      _sig = {
        moveId,
        styleDur:  custom ? custom.dur : _dur,
        styleTick: custom ? custom.tick : _tickFn,
        beam:      !!(custom && custom.beam) || _tickFn === _tick_BEAM,
      };
      _sigPhase  = 'CHARGE';
      _sigSlow   = 0;
      _intensity = Math.min(5, _intensity + 1);
      _dur       = 34;                 // charge-duur (op halve snelheid ≈ 1.1s)
      _tickFn    = _tick_SIG_CHARGE;
      const mv = (window.DG && DG.MOVES && DG.MOVES[moveId]) ? DG.MOVES[moveId] : null;
      _cineBanner = { text: mv ? mv.name : '', color: _col, alpha: 0 };
    } else if (_intensity >= 4 && cat !== 'STATUS') {
      // FASE 10: zware moves (power ≥ 100) krijgen een korte aanloop-spanning —
      // mini-charge zonder letterbox/banner/slow-motion (lite)
      _sig = { lite: true, styleDur: _dur, styleTick: _tickFn, beam: _tickFn === _tick_BEAM };
      _sigPhase = 'CHARGE';
      _sigSlow  = 0;
      _dur      = 16;
      _tickFn   = _tick_SIG_CHARGE;
    }

    if (typeof DG.Audio !== 'undefined') {
      // FASE 3: signature moves krijgen het zware SFX-profiel (sub-boom + echo)
      try { DG.Audio.playMoveSfx(moveType, cat, !!(_sig && !_sig.lite)); } catch(e) {}
      // FASE 10: stijl-eigen accent (donderklap, jet, kaak-klap…)
      try { if (DG.Audio.playStyleAccent) DG.Audio.playStyleAccent(style); } catch(e) {}
    }
  }

  // ════════════════════════════════════════════════════════════
  // 15 STYLE TICK FUNCTIONS
  // Each is called every frame while the animation is active.
  // They use _frame, _dur, _particles, _isPlayer, _shake, _flash,
  // _intensity, _col, _colDark, _pOffset, _eOffset.
  // ════════════════════════════════════════════════════════════

  // ── BEAM: glowing line from attacker to target ─────────────
  // Extra sparks along beam at intensity 3+
  function _tick_BEAM(ctx) {
    // (drawing happens in draw(); tick just spawns particles)
    const atk = _atkPos(), def = _defPos();
    const t = _frame / _dur;

    // Spark particles along the beam
    if (_intensity >= 3 && _frame % 2 === 0) {
      const p = Math.random();
      const bx = _lerp(atk.x, def.x, p);
      const by = _lerp(atk.y, def.y, p);
      _spawn(bx, by,
        (Math.random() - 0.5) * 1.5,
        (Math.random() - 0.5) * 1.5,
        1 + Math.random() * 1.5, _col, 6 + _intensity * 2);
    }

    // End flash on impact
    if (_frame === Math.floor(_dur * 0.85)) {
      _setShake(_intensity * 1.2, _intensity * 0.8);
      if (_intensity >= 3) _flash = { alpha: 0.3 + _intensity * 0.08, color: _col };
    }
  }

  // ── PROJECTILE: arcing balls from attacker to target ────────
  function _tick_PROJECTILE() {
    const atk = _atkPos(), def = _defPos();
    const count = 1 + _intensity;  // 1–6 balls
    const travel = Math.floor(_dur * 0.75);

    if (_frame < travel) {
      const t = _frame / travel;
      // Each ball has a staggered launch time
      for (let i = 0; i < count; i++) {
        const tOffset = i / (count * 2);
        const tNorm = Math.max(0, Math.min(1, (t - tOffset) / (1 - tOffset)));
        if (tNorm <= 0) continue;
        // Parabolic arc
        const bx = _lerp(atk.x, def.x, tNorm);
        const arc = Math.sin(tNorm * Math.PI) * (20 + _intensity * 8);
        const by = _lerp(atk.y, def.y, tNorm) - arc;
        if (_frame % 2 === 0) {
          _spawn(bx, by, 0, 0, 3 + _intensity, _col, 7, 'circle');
          _spawn(bx, by, 0, 0, 1.5 + _intensity * 0.5, _colDark, 5, 'circle');
        }
      }
    }

    if (_frame === travel) {
      _setShake(3 + _intensity, 2 + _intensity * 0.5);
      _flash = { alpha: 0.25 + _intensity * 0.07, color: _col };
      const burst = 6 + _intensity * 3;
      for (let i = 0; i < burst; i++) {
        const a = (i / burst) * Math.PI * 2;
        const sp = 1.5 + Math.random() * _intensity;
        _spawn(def.x, def.y, Math.cos(a) * sp, Math.sin(a) * sp,
               2 + Math.random() * 2, _col, 10 + _intensity * 2);
      }
    }
  }

  // ── BURST: expanding circle of particles centered on target ──
  function _tick_BURST() {
    const def = _defPos();
    const phase1 = Math.floor(_dur * 0.35);

    if (_frame === 1) {
      // Initial burst of particles
      const count = 8 + _intensity * 5;
      for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI * 2;
        const sp = 2 + Math.random() * (2 + _intensity * 1.5);
        _spawn(def.x, def.y, Math.cos(a) * sp, Math.sin(a) * sp,
               2 + Math.random() * 2 + _intensity, _col,
               12 + _intensity * 4, 'circle', 0.06);
      }
      // Core flash
      _flash = { alpha: 0.3 + _intensity * 0.1, color: _col };
      if (_intensity >= 4) _setShake(5 + _intensity, 4 + _intensity);
    }

    // Secondary particles at moderate intensity
    if (_intensity >= 2 && _frame < phase1 && _frame % 3 === 0) {
      for (let i = 0; i < _intensity; i++) {
        const a = Math.random() * Math.PI * 2;
        const r = Math.random() * 20 * (_frame / phase1);
        _spawn(def.x + Math.cos(a) * r, def.y + Math.sin(a) * r,
               (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2,
               1.5, _colDark, 8);
      }
    }

    // Screen shake on impact at high intensity
    if (_intensity >= 4 && _frame === Math.floor(_dur * 0.1)) {
      _setShake(6 + _intensity, 5 + _intensity);
      _flash = { alpha: 0.5, color: _col };
    }
  }

  // ── WAVE: expanding concentric arcs from attacker ─────────
  function _tick_WAVE() {
    const atk = _atkPos(), def = _defPos();
    const waveCount = 2 + Math.floor(_intensity * 0.7);
    const waveSpacing = _dur / waveCount;

    for (let w = 0; w < waveCount; w++) {
      const wStart = w * waveSpacing;
      const wAge   = _frame - wStart;
      if (wAge < 0 || wAge > waveSpacing) continue;

      const progress = wAge / waveSpacing;
      const radius   = progress * (60 + _intensity * 20);
      const amplitude = 10 + _intensity * 5;

      // Emit arc particles
      if (_frame % 2 === 0) {
        const arcs = 6 + _intensity * 3;
        for (let i = 0; i < arcs; i++) {
          const angle = (i / arcs) * Math.PI * 2;
          // Arc toward target direction
          const dirX = def.x - atk.x, dirY = def.y - atk.y;
          const d = Math.sqrt(dirX * dirX + dirY * dirY) || 1;
          const perpX = -dirY / d, perpY = dirX / d;
          const wave = Math.sin(angle * 3) * amplitude;
          const px = atk.x + (dirX / d) * radius + perpX * wave;
          const py = atk.y + (dirY / d) * radius + perpY * wave;
          _spawn(px, py, (Math.random() - 0.5) * 0.5, (Math.random() - 0.5) * 0.5,
                 2 + _intensity * 0.5, _col, 8);
        }
      }
    }

    if (_frame === Math.floor(_dur * 0.8)) {
      _flash = { alpha: 0.2 + _intensity * 0.06, color: _col };
      if (_intensity >= 3) _setShake(3 + _intensity, 2 + _intensity);
    }
  }

  // ── MELEE: attacker jolts toward target, impact flash ───────
  function _tick_MELEE() {
    const atk = _atkPos(), def = _defPos();
    const MID = Math.floor(_dur * 0.45);

    if (_frame < MID) {
      const p = (_frame / MID);
      const ease = p * p;
      const dx = (def.x - atk.x) * ease * (0.55 + _intensity * 0.06);
      const dy = (def.y - atk.y) * ease * (0.55 + _intensity * 0.06);
      if (_isPlayer) { _pOffset.x = dx; _pOffset.y = dy; }
      else           { _eOffset.x = dx; _eOffset.y = dy; }

      // Dust trail
      if (_frame % 2 === 0) {
        const tx = atk.x + (def.x - atk.x) * p * 0.55;
        const ty = atk.y + (def.y - atk.y) * p * 0.55;
        _spawn(tx, ty, (Math.random() - 0.5) * 1.5, -Math.random() * 0.6,
               3 + _intensity, '#ccb890', 8 + _intensity);
      }
    } else if (_frame === MID) {
      _setShake(5 + _intensity * 1.5, 4 + _intensity);
      _flash = { alpha: 0.4 + _intensity * 0.08, color: _col };
      const burst = 8 + _intensity * 4;
      for (let i = 0; i < burst; i++) {
        const a = (i / burst) * Math.PI * 2;
        const sp = 2 + Math.random() * (1.5 + _intensity);
        _spawn(def.x, def.y, Math.cos(a) * sp, Math.sin(a) * sp,
               2 + Math.random() * 2, _col, 10 + _intensity * 2, 'circle', 0.05);
      }
      // Impact sparks
      for (let i = 0; i < 5 + _intensity; i++) {
        _spawn(def.x + (Math.random() - 0.5) * 15,
               def.y + (Math.random() - 0.5) * 10,
               (Math.random() - 0.5) * 3, -Math.random() * 3,
               1.5, '#ffffff', 8, 'line');
      }
    } else {
      // Snap back
      const p = (_frame - MID) / (_dur - MID);
      const remain = 1 - p;
      const dx = (def.x - atk.x) * (0.55 + _intensity * 0.06) * remain;
      const dy = (def.y - atk.y) * (0.55 + _intensity * 0.06) * remain;
      if (_isPlayer) { _pOffset.x = dx; _pOffset.y = dy; }
      else           { _eOffset.x = dx; _eOffset.y = dy; }
    }
  }

  // ── FIELD: full-screen tint + falling particles ─────────────
  function _tick_FIELD() {
    // Particles across the whole canvas (weather effect)
    const W = _cw(), H = _ch();
    const rate = 2 + _intensity * 2;
    if (_frame % 2 === 0) {
      for (let i = 0; i < rate; i++) {
        const px = Math.random() * W;
        const py = Math.random() * H * 0.3;
        _spawn(px, py,
               (Math.random() - 0.5) * 0.8, 1.5 + Math.random() * 2,
               1 + Math.random() * 2, _col, 18 + Math.random() * 10, 'circle', 0.05);
      }
    }
    // Rising particles at higher intensity
    if (_intensity >= 3 && _frame % 3 === 0) {
      for (let i = 0; i < _intensity - 1; i++) {
        const px = Math.random() * W;
        const py = H - Math.random() * H * 0.3;
        _spawn(px, py, (Math.random() - 0.5) * 1, -1.5 - Math.random() * 2,
               1.5, _colDark, 16, 'circle');
      }
    }

    if (_frame === 5) {
      _flash = { alpha: 0.12 + _intensity * 0.04, color: _col };
    }
  }

  // ── SELF: pulsing ring on attacker, orbiting particles ───────
  function _tick_SELF() {
    const atk = _atkPos();
    const t   = _frame / _dur;
    const pulseR = 12 + _intensity * 5 + Math.sin(_frame * 0.3) * 4;

    // Emit ring particles
    if (_frame % 3 === 0) {
      const count = 4 + _intensity * 2;
      for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI * 2 + _frame * 0.05;
        const px = atk.x + Math.cos(a) * pulseR;
        const py = atk.y + Math.sin(a) * pulseR * 0.6;
        _spawn(px, py, (Math.random() - 0.5) * 0.8, (Math.random() - 0.5) * 0.8,
               2, _col, 8 + _intensity);
      }
    }

    // Orbiting particles at intensity 3+
    if (_intensity >= 3 && _frame % 4 === 0) {
      const orbitCount = _intensity - 1;
      for (let i = 0; i < orbitCount; i++) {
        const a = (i / orbitCount) * Math.PI * 2 + _frame * 0.12;
        const r = pulseR * 1.4;
        const px = atk.x + Math.cos(a) * r;
        const py = atk.y + Math.sin(a) * r * 0.6;
        _spawn(px, py, Math.cos(a + Math.PI * 0.5) * 1.5,
               Math.sin(a + Math.PI * 0.5) * 1.5,
               2.5, _colDark, 10, 'circle');
      }
    }

    if (_frame === 1) {
      _flash = { alpha: 0.15 + _intensity * 0.05, color: _col };
    }
  }

  // ── AURA: slow expanding rings from attacker ─────────────────
  function _tick_AURA() {
    const atk = _atkPos();
    const ringCount = 2 + Math.floor(_intensity * 0.8);
    const period    = _dur / ringCount;

    for (let ring = 0; ring < ringCount; ring++) {
      const startFrame = ring * period;
      const age = _frame - startFrame;
      if (age < 0 || age > period) continue;

      const progress = age / period;
      const r = progress * (50 + _intensity * 15);
      const alpha = 1 - progress;

      // Emit ring particles
      if (_frame % 3 === 0) {
        const pts = 8 + _intensity * 4;
        for (let i = 0; i < pts; i++) {
          const a = (i / pts) * Math.PI * 2;
          const px = atk.x + Math.cos(a) * r;
          const py = atk.y + Math.sin(a) * r * 0.6;
          _spawn(px, py, Math.cos(a) * 0.3, Math.sin(a) * 0.3,
                 2, _col, Math.floor(6 + alpha * 8));
        }
      }
    }

    if (_frame === 5) {
      _flash = { alpha: 0.1 + _intensity * 0.04, color: _col };
    }
  }

  // ── DRAIN: particles travel from target to attacker ──────────
  function _tick_DRAIN() {
    const atk = _atkPos(), def = _defPos();
    const drainPhase = Math.floor(_dur * 0.7);

    if (_frame < drainPhase) {
      // Spawn particles at target that drift toward attacker
      if (_frame % 3 === 0) {
        const count = 1 + Math.floor(_intensity * 0.8);
        for (let i = 0; i < count; i++) {
          const ox = (Math.random() - 0.5) * 20;
          const oy = (Math.random() - 0.5) * 12;
          const dist = Math.sqrt(
            (atk.x - def.x) * (atk.x - def.x) +
            (atk.y - def.y) * (atk.y - def.y)
          ) || 1;
          const speed = 1.5 + Math.random() * 1.5;
          const vx = ((atk.x - def.x) / dist) * speed;
          const vy = ((atk.y - def.y) / dist) * speed;
          _spawn(def.x + ox, def.y + oy, vx, vy, 2 + _intensity * 0.5, _col,
                 Math.floor(dist / speed) + 2, 'circle');
        }
      }
    } else if (_frame === drainPhase) {
      // Green tint glow on attacker
      _flash = { alpha: 0.25 + _intensity * 0.06, color: '#44ff88' };
      // Glow ring on attacker
      const pts = 8 + _intensity * 3;
      for (let i = 0; i < pts; i++) {
        const a = (i / pts) * Math.PI * 2;
        _spawn(atk.x + Math.cos(a) * 15, atk.y + Math.sin(a) * 10,
               Math.cos(a) * 0.5, Math.sin(a) * 0.5, 2.5, '#44ff88', 14);
      }
    }
  }

  // ── MULTI: small rapid burst at target, cycling colors ───────
  function _tick_MULTI() {
    const def = _defPos();

    if (_frame === 1) {
      _setShake(2 + _intensity, 2);
      const count = 5 + _intensity * 3;
      const hues = [_col, _colDark, '#ffffff'];
      for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI * 2;
        const sp = 2 + Math.random() * (1 + _intensity);
        _spawn(def.x, def.y, Math.cos(a) * sp, Math.sin(a) * sp,
               2 + Math.random() * 2, hues[i % hues.length], 8 + _intensity);
      }
      _flash = { alpha: 0.25 + _intensity * 0.07, color: _col };
    }

    // Cycling color flickers
    if (_frame % 4 === 0) {
      const hues = [_col, _colDark, '#ffffff'];
      _spawn(def.x + (Math.random() - 0.5) * 14,
             def.y + (Math.random() - 0.5) * 8,
             (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2,
             1.5, hues[Math.floor(_frame / 4) % hues.length], 6);
    }
  }

  // ── ARC: single large orb on high parabolic arc ──────────────
  function _tick_ARC() {
    const atk = _atkPos(), def = _defPos();
    const travel = Math.floor(_dur * 0.78);

    if (_frame < travel) {
      const t = _frame / travel;
      const bx = _lerp(atk.x, def.x, t);
      const arc = Math.sin(t * Math.PI) * (35 + _intensity * 12);
      const by  = _lerp(atk.y, def.y, t) - arc;
      const size = 4 + _intensity * 1.5;

      // Orb
      _spawn(bx, by, 0, 0, size, _col, 6 + _intensity, 'circle');
      _spawn(bx, by, 0, 0, size * 0.6, '#ffffff', 4, 'circle');

      // Trail
      const trailLen = 2 + _intensity;
      for (let i = 1; i <= trailLen; i++) {
        const tt  = Math.max(0, t - i * 0.04);
        const tbx = _lerp(atk.x, def.x, tt);
        const tby = _lerp(atk.y, def.y, tt) - Math.sin(tt * Math.PI) * (35 + _intensity * 12);
        _spawn(tbx, tby, 0, 0, size * (1 - i / (trailLen + 1)),
               _colDark, 4, 'circle');
      }
    }

    if (_frame === travel) {
      _setShake(4 + _intensity, 3 + _intensity);
      _flash = { alpha: 0.3 + _intensity * 0.08, color: _col };
      const burst = 8 + _intensity * 4;
      for (let i = 0; i < burst; i++) {
        const a = (i / burst) * Math.PI * 2;
        const sp = 2 + Math.random() * (2 + _intensity);
        _spawn(def.x, def.y, Math.cos(a) * sp, Math.sin(a) * sp,
               2 + _intensity, _col, 12 + _intensity * 2, 'circle', 0.05);
      }
    }
  }

  // ── CONE: fan of particles from attacker toward target ───────
  function _tick_CONE() {
    const atk = _atkPos(), def = _defPos();
    const travel = Math.floor(_dur * 0.8);

    if (_frame < travel && _frame % 2 === 0) {
      const dirX = def.x - atk.x, dirY = def.y - atk.y;
      const dist = Math.sqrt(dirX * dirX + dirY * dirY) || 1;
      const baseAngle = Math.atan2(dirY, dirX);
      const fanWidth  = Math.PI / 3; // 60 degrees

      const count = 2 + _intensity * 2;
      for (let i = 0; i < count; i++) {
        const spread = (Math.random() - 0.5) * fanWidth;
        const angle  = baseAngle + spread;
        const speed  = 3 + Math.random() * (1.5 + _intensity);
        _spawn(atk.x, atk.y,
               Math.cos(angle) * speed,
               Math.sin(angle) * speed,
               2 + Math.random() * _intensity, _col,
               8 + _intensity * 2, 'circle', 0.02);
      }
    }

    if (_frame === travel) {
      _flash = { alpha: 0.2 + _intensity * 0.07, color: _col };
      if (_intensity >= 3) _setShake(3 + _intensity, 2 + _intensity);
    }
  }

  // ── SLAM: rapid lunge to target, heavy shake, dust cloud ─────
  function _tick_SLAM() {
    const atk = _atkPos(), def = _defPos();
    const MID  = Math.floor(_dur * 0.38);

    if (_frame < MID) {
      const p  = _frame / MID;
      const dx = (def.x - atk.x) * p;
      const dy = (def.y - atk.y) * p;
      if (_isPlayer) { _pOffset.x = dx; _pOffset.y = dy; }
      else           { _eOffset.x = dx; _eOffset.y = dy; }
    } else if (_frame === MID) {
      // Heavy impact
      _setShake(7 + _intensity * 2, 5 + _intensity * 1.5);
      _flash = { alpha: 0.5 + _intensity * 0.08, color: _col };

      // Dust cloud
      for (let i = 0; i < 12 + _intensity * 5; i++) {
        const a = (Math.random() - 0.5) * Math.PI;
        const sp = 2 + Math.random() * (2 + _intensity);
        _spawn(def.x + (Math.random() - 0.5) * 10,
               def.y + (Math.random() - 0.5) * 6,
               Math.cos(a) * sp, Math.sin(a) * sp - 1,
               3 + Math.random() * 3, '#ccb890', 14 + _intensity * 2, 'circle', 0.04);
      }
      // Impact sparks
      for (let i = 0; i < 6 + _intensity * 2; i++) {
        const a = (i / (6 + _intensity * 2)) * Math.PI * 2;
        _spawn(def.x, def.y, Math.cos(a) * 3, Math.sin(a) * 3,
               1.5, _col, 8, 'line');
      }
    } else {
      const p = (_frame - MID) / (_dur - MID);
      const dx = (def.x - atk.x) * (1 - p);
      const dy = (def.y - atk.y) * (1 - p);
      if (_isPlayer) { _pOffset.x = dx; _pOffset.y = dy; }
      else           { _eOffset.x = dx; _eOffset.y = dy; }
    }
  }

  // ── VORTEX: rotating spiral centered on target ───────────────
  function _tick_VORTEX() {
    const def = _defPos();
    const speed = 0.08 + _intensity * 0.03;
    const count = 2 + _intensity * 2;

    if (_frame % 2 === 0) {
      for (let i = 0; i < count; i++) {
        const angle  = (_frame * speed) + (i / count) * Math.PI * 2;
        const radius = 10 + _intensity * 8 + Math.sin(_frame * 0.1 + i) * 5;
        const px = def.x + Math.cos(angle) * radius;
        const py = def.y + Math.sin(angle) * radius * 0.55;
        const vx = -Math.sin(angle) * speed * radius * 0.3;
        const vy = -Math.cos(angle) * speed * radius * 0.3;
        _spawn(px, py, vx, vy, 2 + _intensity * 0.5, _col, 10 + _intensity);
        if (_intensity >= 2) {
          _spawn(px * 0.5 + def.x * 0.5, py * 0.5 + def.y * 0.5,
                 vx * 0.5, vy * 0.5, 1.5, _colDark, 8);
        }
      }
    }

    if (_frame === 1) {
      _flash = { alpha: 0.1 + _intensity * 0.05, color: _col };
    }
    if (_frame === Math.floor(_dur * 0.9)) {
      if (_intensity >= 3) _setShake(2 + _intensity, 2 + _intensity);
    }
  }

  // ── PULSE: concentric rings pulse outward from attacker ───────
  function _tick_PULSE() {
    const atk    = _atkPos();
    const rings  = _intensity + 1;
    const period = _dur / rings;

    for (let ring = 0; ring < rings; ring++) {
      const startFrame = ring * (period * 0.6);
      const age = _frame - startFrame;
      if (age < 0 || age > period) continue;

      const progress = age / period;
      const r = progress * (45 + _intensity * 12);

      if (_frame % 3 === 0) {
        const pts = 6 + _intensity * 4;
        for (let i = 0; i < pts; i++) {
          const a = (i / pts) * Math.PI * 2;
          const px = atk.x + Math.cos(a) * r;
          const py = atk.y + Math.sin(a) * r * 0.6;
          _spawn(px, py, Math.cos(a) * 0.4, Math.sin(a) * 0.4,
                 1.5 + _intensity * 0.3, _col, 8, 'circle');
        }
      }
    }

    if (_frame === 1) {
      _flash = { alpha: 0.1 + _intensity * 0.05, color: _col };
    }
    if (_frame === Math.floor(_dur * 0.85)) {
      if (_intensity >= 3) _setShake(2 + _intensity, 1.5 + _intensity);
    }
  }

  // ════════════════════════════════════════════════════════════
  // SPECIAL ANIMATIONS
  // ════════════════════════════════════════════════════════════

  // ── Faint ──────────────────────────────────────────────────
  // ════════════════════════════════════════════════════════════
  // FASE 10 — 8 NIEUWE GETEKENDE STIJLEN
  // ════════════════════════════════════════════════════════════

  // ── STREAM: continue straal uit de bek van de aanvaller ─────
  function _tick_STREAM() {
    const atk = _atkCtr(), def = _defCtr();
    if (_frame === 1) { _camTarget = Math.max(_camTarget, 1.05); _camFocus = { x: def.x, y: def.y }; }
    if (_frame > 4 && _frame < _dur - 6) {
      const dir = def.x > atk.x ? 1 : -1;
      const sx = atk.x + dir * 16, sy = atk.y - 6;
      for (let i = 0; i < 2; i++) {
        const t = Math.random();
        _spawn(sx + (def.x - sx) * t,
               sy + (def.y - sy) * t + Math.sin(_frame * 0.5 + t * 6) * 7,
               dir * (1.5 + Math.random()), (Math.random() - 0.5) * 0.8,
               1.5 + Math.random() * 2,
               Math.random() < 0.35 ? (_fx.pal ? _fx.pal[2] : '#ffffff') : _col, 10, 'circle');
      }
      if (_frame % 2 === 0) {
        const a = Math.random() * Math.PI * 2;
        _spawn(def.x, def.y, Math.cos(a) * 1.8, Math.sin(a) * 1.2 - 0.6,
               2 + Math.random() * 2, _fx.pal ? _fx.pal[1] : _col, 12, 'circle', 0.05);
        _setShake(1.5, 1);
      }
    }
    if (_frame === 5) _flash = { alpha: 0.18, color: _col };
  }

  function _drawStreamJet(ctx) {
    const env = Math.min(1, _frame / 7) * Math.min(1, Math.max(0, (_dur - _frame) / 8));
    if (env <= 0.02) return;
    const atk = _atkCtr(), def = _defCtr();
    const dir = def.x > atk.x ? 1 : -1;
    const sx = atk.x + dir * 16, sy = atk.y - 6;
    const pal = _fx.pal || [_colDark, _col, '#ffffff'];
    const wMul = (_fx.width || 1) * (0.8 + _intensity * 0.15);
    const spd = _fx.speed || 1;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round';
    for (let i = 0; i < 3; i++) {
      const wob = Math.sin(_frame * (0.55 + i * 0.12) * spd + i * 2.1) * (8 - i * 2.5);
      ctx.strokeStyle = pal[i] || _col;
      ctx.globalAlpha = env * (0.75 - i * 0.1);
      ctx.lineWidth = Math.max(1, (13 - i * 4.4) * wMul * env);
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.quadraticCurveTo((sx + def.x) / 2, (sy + def.y) / 2 + wob, def.x, def.y);
      ctx.stroke();
    }
    ctx.restore();
  }

  // ── BOLT: vertakte bliksem die van boven inslaat ─────────────
  function _tick_BOLT() {
    const def = _defCtr();
    if (!_fxState.strikeFrames) {
      const strikes = _fx.bolts || (1 + Math.min(2, Math.floor(_intensity / 2)));
      _fxState.strikeFrames = [];
      for (let i = 0; i < strikes; i++) _fxState.strikeFrames.push(4 + i * 9);
    }
    if (_fxState.strikeFrames.indexOf(_frame) !== -1) {
      const segs = [];
      let x = def.x + (Math.random() - 0.5) * 14, y = -8;
      segs.push({ x, y });
      while (y < def.y - 8) {
        y += 9 + Math.random() * 9;
        x += (Math.random() - 0.5) * 16 + (def.x - x) * 0.25;
        segs.push({ x, y });
      }
      segs.push({ x: def.x, y: def.y });
      _fxState.segs = segs;
      _fxState.segAge = 0;
      _flash = { alpha: 0.55, color: '#ffffff' };
      _setShake(4, 2);
      _camTarget = Math.max(_camTarget, 1.07);
      _camFocus = { x: def.x, y: def.y };
      for (let i = 0; i < 7; i++) {
        const a = Math.random() * Math.PI * 2;
        _spawn(def.x, def.y, Math.cos(a) * 2.2, Math.sin(a) * 1.4 - 0.5,
               1.6 + Math.random() * 1.6, i % 2 ? '#ffee55' : '#ffffff', 12, 'spark');
      }
    }
    if (_fxState.segAge != null) _fxState.segAge++;
  }

  function _drawBolt(ctx) {
    const segs = _fxState.segs;
    if (!segs || _fxState.segAge > 10) return;
    const alpha = Math.max(0, 1 - _fxState.segAge / 10);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round';
    const passes = [['#ffee55', 6, 0.45], ['#ffffff', 2.2, 1]];
    for (const pass of passes) {
      ctx.strokeStyle = pass[0];
      ctx.globalAlpha = alpha * pass[2];
      ctx.lineWidth = pass[1];
      ctx.beginPath();
      ctx.moveTo(segs[0].x, segs[0].y);
      for (let i = 1; i < segs.length; i++) ctx.lineTo(segs[i].x, segs[i].y);
      ctx.stroke();
      if (segs.length > 3) {
        const b = segs[Math.floor(segs.length / 2)];
        ctx.beginPath();
        ctx.moveTo(b.x, b.y);
        ctx.lineTo(b.x + 14, b.y + 10);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  // ── RAIN: bombardement uit de lucht ──────────────────────────
  function _tick_RAIN() {
    const def = _defCtr();
    const shape = _TYPE_SHAPE[_moveType] || 'boulder';
    const size = _fx.size || 1;
    if (_frame < _dur * 0.7 && _frame % 2 === 1) {
      const px = def.x + (Math.random() - 0.5) * 80;
      _spawn(px, -8 - Math.random() * 16, (def.x - px) * 0.012, 4 + Math.random() * 2,
             (4.5 + Math.random() * 3) * size,
             Math.random() < 0.3 ? _colDark : _col, 30, shape, 0.12);
    }
    if (_frame > 8 && _frame % 5 === 0) {
      const ix = def.x + (Math.random() - 0.5) * 56;
      for (let i = 0; i < 3; i++) {
        _spawn(ix, def.y + 12, (Math.random() - 0.5) * 1.6, -(0.5 + Math.random()),
               2 + Math.random() * 2, '#cbb89c', 12, 'circle', 0.04);
      }
      _setShake(2.5, 1.6);
    }
    if (_frame === 10) { _camTarget = Math.max(_camTarget, 1.06); _camFocus = { x: def.x, y: def.y }; }
  }

  // ── SLASH: klauw-halvemanen over het doelwit ─────────────────
  function _tick_SLASH() {
    const def = _defCtr();
    if (!_fxState.marks) _fxState.marks = [];
    if ((_frame === 5 || _frame === 12 || _frame === 19) && _fxState.marks.length < 3) {
      _fxState.marks.push({ born: _frame, ang: -0.7 + _fxState.marks.length * 0.65, flip: _fxState.marks.length % 2 });
      _flash = { alpha: 0.18, color: '#ffffff' };
      _setShake(3, 1.5);
      for (let i = 0; i < 5; i++) {
        const a = Math.random() * Math.PI * 2;
        _spawn(def.x, def.y, Math.cos(a) * 2, Math.sin(a) * 1.4, 1.6, '#ffffff', 9, 'line');
      }
    }
  }

  function _drawSlashes(ctx) {
    const def = _defCtr();
    const marks = _fxState.marks || [];
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round';
    for (const m of marks) {
      const age = _frame - m.born;
      if (age < 0 || age > 9) continue;
      const a = Math.max(0, 1 - age / 9);
      const grow = Math.min(1, (age + 1) / 3);
      ctx.save();
      ctx.translate(def.x, def.y);
      ctx.rotate(m.ang);
      if (m.flip) ctx.scale(-1, 1);
      for (let c2 = 0; c2 < 3; c2++) {
        ctx.strokeStyle = c2 === 1 ? '#ffffff' : _col;
        ctx.globalAlpha = a * (c2 === 1 ? 0.9 : 0.5);
        ctx.lineWidth = 2.4 - c2 * 0.5;
        ctx.beginPath();
        ctx.arc(0, 26 - c2 * 5, 30 * grow, -Math.PI * 0.78, -Math.PI * 0.22);
        ctx.stroke();
      }
      ctx.restore();
    }
    ctx.restore();
  }

  // ── CHOMP: kaken klappen dicht op het doelwit ────────────────
  function _tick_CHOMP() {
    const def = _defCtr();
    if (_frame === 12) {
      _flash = { alpha: 0.3, color: _col };
      _setShake(4, 2.5);
      _camTarget = Math.max(_camTarget, 1.07);
      _camFocus = { x: def.x, y: def.y };
      for (let i = 0; i < 8; i++) {
        const a = Math.random() * Math.PI * 2;
        _spawn(def.x, def.y, Math.cos(a) * 2, Math.sin(a) * 1.5,
               2 + Math.random() * 1.5, _col, 12, 'circle');
      }
    }
  }

  function _drawChomp(ctx) {
    const def = _defCtr();
    const CLOSE = 12, HOLD = 6;
    let gap;
    if (_frame <= CLOSE) {
      const t = _frame / CLOSE;
      gap = 34 * (1 - t * t);            // dichtklappen met versnelling
    } else if (_frame <= CLOSE + HOLD) {
      gap = 0;
    } else {
      gap = 20 * Math.min(1, (_frame - CLOSE - HOLD) / 8);
    }
    const fade = _frame > CLOSE + HOLD ? Math.max(0, 1 - (_frame - CLOSE - HOLD) / 8) : 1;
    if (fade <= 0.02) return;
    ctx.save();
    ctx.globalAlpha = fade;
    const teeth = 4, tw = 11, span = teeth * tw;
    const sides = [-1, 1]; // -1 = bovenkaak, 1 = onderkaak
    for (const side of sides) {
      const baseY = def.y + side * (gap + 8);
      ctx.fillStyle = '#f1ead2';
      ctx.strokeStyle = 'rgba(40,30,20,0.8)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i < teeth; i++) {
        const x0 = def.x - span / 2 + i * tw;
        ctx.moveTo(x0, baseY);
        ctx.lineTo(x0 + tw / 2, baseY - side * 13); // punten wijzen naar het doelwit
        ctx.lineTo(x0 + tw, baseY);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();
  }

  // ── ORB: energiebol laadt op, vliegt en explodeert ───────────
  function _tick_ORB() {
    const atk = _atkCtr(), def = _defCtr();
    const GROW = 16, FLY = 28;
    const dir = def.x > atk.x ? 1 : -1;
    const ox = atk.x + dir * 14, oy = atk.y - 8;
    if (_frame <= GROW) {
      if (_frame % 2 === 0) {
        const a = Math.random() * Math.PI * 2, r = 22;
        _spawn(ox + Math.cos(a) * r, oy + Math.sin(a) * r,
               -Math.cos(a) * 1.6, -Math.sin(a) * 1.6, 1.5, _col, 11, 'circle');
      }
    } else if (_frame === FLY) {
      _flash = { alpha: 0.45, color: _col };
      _setShake(4, 2.5);
      _camTarget = Math.max(_camTarget, 1.08);
      _camFocus = { x: def.x, y: def.y };
      for (let i = 0; i < 14; i++) {
        const a = (i / 14) * Math.PI * 2;
        _spawn(def.x, def.y, Math.cos(a) * (1.5 + Math.random() * 1.5),
               Math.sin(a) * (1.2 + Math.random()),
               2.2 + Math.random() * 2, i % 3 === 0 ? '#ffffff' : _col, 16, 'circle');
      }
      _hitRings.push({ x: def.x, y: def.y, r: 2, maxR: 34, life: 14, color: _col, delay: 0 });
    }
  }

  function _drawOrb(ctx) {
    const atk = _atkCtr(), def = _defCtr();
    const GROW = 16, FLY = 28;
    if (_frame > FLY) return;
    const dir = def.x > atk.x ? 1 : -1;
    const ox = atk.x + dir * 14, oy = atk.y - 8;
    let x, y, r;
    if (_frame <= GROW) {
      x = ox; y = oy;
      r = 2 + (_frame / GROW) * (7 + _intensity);
    } else {
      const t = (_frame - GROW) / (FLY - GROW);
      x = ox + (def.x - ox) * t;
      y = oy + (def.y - oy) * t - Math.sin(t * Math.PI) * 14;
      r = 7 + _intensity;
    }
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const g = ctx.createRadialGradient(x, y, 0, x, y, r * 1.8);
    g.addColorStop(0, '#ffffff');
    g.addColorStop(0.45, _col);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(x - r * 2, y - r * 2, r * 4, r * 4);
    ctx.restore();
  }

  // ── QUAKE: grond-scheuren + puin + zware dreun ───────────────
  function _tick_QUAKE() {
    const def = _defCtr();
    if (_frame === 3) {
      _fxState.cracks = [];
      for (let i = 0; i < 5; i++) {
        const dir = i % 2 ? 1 : -1;
        const pts = [];
        let px = def.x + (Math.random() - 0.5) * 10, py = def.y + 14;
        pts.push({ x: px, y: py });
        for (let s = 0; s < 4; s++) {
          px += dir * (8 + Math.random() * 10);
          py += (Math.random() - 0.5) * 7 + 2;
          pts.push({ x: px, y: py });
        }
        _fxState.cracks.push(pts);
      }
      _camTarget = Math.max(_camTarget, 1.08);
      _camFocus = { x: def.x, y: def.y };
      _flash = { alpha: 0.2, color: '#b89868' };
    }
    if (_frame < _dur - 8) {
      _setShake(3.5, 3);
      if (_frame % 3 === 0) {
        _spawn(def.x + (Math.random() - 0.5) * 50, def.y + 12,
               (Math.random() - 0.5) * 1.4, -(1.5 + Math.random() * 2),
               (2 + Math.random() * 2.5) * (_fx.size || 1), '#9a8568', 16, 'boulder', 0.14);
      }
      if (_frame % 4 === 0) {
        _spawn(def.x + (Math.random() - 0.5) * 60, def.y + 14,
               (Math.random() - 0.5) * 0.8, -0.4, 2.5, '#cbb89c', 14, 'circle', 0.01);
      }
    }
  }

  function _drawQuakeCracks(ctx) {
    const cracks = _fxState.cracks;
    if (!cracks) return;
    const a = Math.min(1, (_frame - 3) / 4) * Math.max(0, Math.min(1, (_dur - _frame) / 8));
    if (a <= 0.02) return;
    ctx.save();
    ctx.globalAlpha = a * 0.85;
    ctx.strokeStyle = '#2a1c10';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    for (const pts of cracks) {
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.stroke();
    }
    ctx.restore();
  }

  // ── TWISTER: draaiende kolom om het doelwit ──────────────────
  function _tick_TWISTER() {
    const def = _defCtr();
    if (_frame === 2) { _camTarget = Math.max(_camTarget, 1.05); _camFocus = { x: def.x, y: def.y }; }
    if (_frame < _dur - 8) {
      for (let i = 0; i < 2; i++) {
        const a = _frame * 0.5 + i * Math.PI;
        const r = 20 + Math.sin(_frame * 0.3 + i) * 6;
        _spawn(def.x + Math.cos(a) * r, def.y + 18,
               Math.cos(a + Math.PI / 2) * 1.4, -(1.8 + Math.random()),
               1.8 + Math.random() * 1.5, Math.random() < 0.3 ? '#ffffff' : _col, 16, 'circle');
      }
      if (_frame % 6 === 0) _setShake(1.5, 1);
    }
  }

  function _drawTwisterSwirl(ctx) {
    const def = _defCtr();
    const env = Math.min(1, _frame / 8) * Math.max(0, Math.min(1, (_dur - _frame) / 8));
    if (env <= 0.02) return;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = _col;
    ctx.lineCap = 'round';
    for (let band = 0; band < 4; band++) {
      const y = def.y + 16 - band * 12;
      const r = 12 + band * 7;
      const phase = _frame * 0.4 + band * 1.1;
      ctx.globalAlpha = env * (0.55 - band * 0.08);
      ctx.lineWidth = 3 - band * 0.4;
      ctx.beginPath();
      ctx.ellipse(def.x, y, r, r * 0.32, 0, phase, phase + Math.PI * 1.4);
      ctx.stroke();
    }
    ctx.restore();
  }

  // ── FASE 10: type-eigen element-impact op de verdediger ──────
  function _spawnElementImpact(type, p) {
    const burst = (n, fn) => { for (let i = 0; i < n; i++) fn(i, (i / n) * Math.PI * 2); };
    switch (type) {
      case 'FIRE':
        burst(8, (i, a) => _spawn(p.x, p.y, Math.cos(a) * 1.8, Math.sin(a) * 1.2 - 0.8,
          2 + Math.random() * 2, ['#ff5500', '#ffaa00', '#ffe080'][i % 3], 16, 'flame', 0.06));
        _spawn(p.x, p.y + 10, 0, -0.3, 5, 'rgba(60,40,30,0.5)', 20, 'circle');
        break;
      case 'WATER':
        burst(9, (i, a) => _spawn(p.x, p.y, Math.cos(a) * 2.2, -Math.abs(Math.sin(a)) * 2.4,
          2 + Math.random() * 1.5, i % 3 ? '#5db8ff' : '#ffffff', 16, 'drop', 0.14));
        break;
      case 'ELECTRIC':
        burst(7, (i, a) => _spawn(p.x + Math.cos(a) * 10, p.y + Math.sin(a) * 8,
          Math.cos(a) * 1.4, Math.sin(a), 1.6, i % 2 ? '#ffee55' : '#ffffff', 10, 'spark'));
        break;
      case 'ICE':
        burst(8, (i, a) => _spawn(p.x, p.y, Math.cos(a) * 1.6, Math.sin(a) * 1.1,
          2 + Math.random() * 1.5, i % 3 ? '#bfeaff' : '#ffffff', 16, 'crystal', 0.04));
        break;
      case 'GRASS':
        burst(8, (i, a) => _spawn(p.x, p.y, Math.cos(a) * 1.7, Math.sin(a) * 1.2 - 0.5,
          2.2, i % 2 ? '#6fd96f' : '#b8f0a0', 18, 'leaf', 0.05));
        break;
      case 'ROCK': case 'GROUND':
        burst(8, (i, a) => _spawn(p.x, p.y + 4, Math.cos(a) * 2, -Math.abs(Math.sin(a)) * 2.2,
          2.2 + Math.random() * 1.6, '#9a8568', 16, 'boulder', 0.16));
        _spawn(p.x, p.y + 10, 0, -0.4, 4.5, '#cbb89c', 14, 'circle', 0.01);
        break;
      case 'GHOST': case 'DARK':
        burst(9, (i, a) => {
          const r = 26;
          _spawn(p.x + Math.cos(a) * r, p.y + Math.sin(a) * r * 0.7,
                 -Math.cos(a) * 2, -Math.sin(a) * 1.4, 2.2,
                 i % 3 ? '#7a5dc8' : '#2a1a44', 13, 'circle');
        });
        break;
      case 'FAIRY':
        burst(8, (i, a) => _spawn(p.x, p.y, Math.cos(a) * 1.5, Math.sin(a) - 0.8,
          i % 4 === 0 ? 3.5 : 1.8, i % 2 ? '#ffb8e0' : '#fff0b8', 18,
          i % 4 === 0 ? 'star' : 'circle', 0.03));
        break;
      case 'PSYCHIC':
        _hitRings.push({ x: p.x, y: p.y, r: 26, maxR: 4, life: 12, color: '#e070d0', delay: 0 });
        burst(6, (i, a) => _spawn(p.x + Math.cos(a) * 14, p.y + Math.sin(a) * 10,
          0, -0.5, 1.8, '#e8a0e0', 12, 'circle'));
        break;
      case 'POISON':
        burst(7, (i, a) => _spawn(p.x, p.y, Math.cos(a) * 1.2, -1 - Math.random(),
          2.4, i % 2 ? '#b35fd1' : '#7a3f9e', 18, 'circle', -0.02));
        break;
      case 'BUG':
        burst(8, (i, a) => _spawn(p.x, p.y, Math.cos(a) * 2.4, Math.sin(a) * 1.4,
          1.5, i % 2 ? '#b8d94a' : '#7a9e2a', 11, 'line'));
        break;
      case 'STEEL':
        burst(7, (i, a) => _spawn(p.x, p.y, Math.cos(a) * 2.6, Math.sin(a) * 1.6,
          1.5, i % 2 ? '#ffffff' : '#c8d4e0', 9, 'spark'));
        break;
      case 'FIGHTING':
        burst(5, (i, a) => _spawn(p.x, p.y, Math.cos(a) * 2, Math.sin(a) * 1.4 - 0.4,
          3, '#ff8855', 12, 'star', 0.05));
        break;
      case 'FLYING':
        burst(6, (i, a) => _spawn(p.x, p.y, Math.cos(a) * 2.2, Math.sin(a) - 0.3,
          2, '#dce8f5', 14, 'line'));
        break;
      case 'DRAGON':
        burst(8, (i, a) => _spawn(p.x, p.y, Math.cos(a) * 1.9, Math.sin(a) * 1.3,
          2.2, i % 2 ? '#9a6df0' : '#5fd4e8', 15, 'flame', 0.04));
        break;
      default:
        burst(6, (i, a) => _spawn(p.x, p.y, Math.cos(a) * 1.8, Math.sin(a) * 1.2,
          2, i % 2 ? '#ffffff' : '#e8e0c8', 12, 'circle', 0.05));
    }
  }

  // ════════════════════════════════════════════════════════════
  // FASE 4 — SIGNATURE CINEMATICS
  // ════════════════════════════════════════════════════════════

  // Generieke charge-fase: energie convergeert op de aanvaller, camera zoomt in
  function _tick_SIG_CHARGE() {
    const atk = _atkPos();
    if (_frame === 1) {
      _camTarget = Math.max(_camTarget, 1.07);
      _camFocus  = { x: atk.x, y: atk.y };
    }
    if (_frame % 2 === 0) {
      for (let i = 0; i < 2 + _intensity; i++) {
        const a = Math.random() * Math.PI * 2;
        const r = 42 + Math.random() * 28;
        const px = atk.x + Math.cos(a) * r;
        const py = atk.y + Math.sin(a) * r * 0.7;
        _spawn(px, py, (atk.x - px) * 0.085, (atk.y - py) * 0.085,
               1.5 + Math.random() * 2, Math.random() < 0.3 ? '#ffffff' : _col, 13, 'circle');
      }
    }
    // krimpende aura-ringen in de tweede helft van de charge
    // FASE 8: op het échte sprite-centrum
    if (_frame > _dur * 0.5 && _frame % 4 === 0) {
      const ac = _atkCtr();
      _hitRings.push({ x: ac.x, y: ac.y, r: 34, maxR: 6, life: 12, color: _col, delay: 0 });
    }
    // aanvaller komt licht omhoog en trilt vlak voor de ontlading
    const off = _isPlayer ? _pOffset : _eOffset;
    off.y = -Math.sin((_frame / _dur) * Math.PI) * 4;
    if (_frame > _dur - 6) _setShake(2, 1);
    if (_frame === _dur - 2) _flash = { alpha: 0.3, color: _col };
  }

  // EXTINCTION_BEAM: megabeam (via beam-draw) + vuurspatten + as-regen
  function _tick_SIG_EXTINCTION() {
    const def = _defPos();
    if (_frame === 2) {
      _flash = { alpha: 0.8, color: '#ffffff' };
      _setShake(6, 3);
      _camTarget = Math.max(_camTarget, 1.12);
      _camFocus  = { x: def.x, y: def.y };
    }
    if (_frame % 2 === 0 && _frame < _dur - 12) {
      for (let i = 0; i < 3; i++) {
        const a = Math.random() * Math.PI * 2;
        _spawn(def.x, def.y, Math.cos(a) * (1 + Math.random() * 2.5),
               Math.sin(a) * (1 + Math.random() * 2) - 1,
               2 + Math.random() * 2.5, ['#ff5500', '#ffaa00', '#ffffff'][i % 3], 18, 'flame', 0.05);
      }
      _setShake(3, 2);
    }
    // as dwarrelt over het hele veld neer
    if (_frame % 3 === 0) {
      _spawn(Math.random() * _cw(), -4, (Math.random() - 0.5) * 0.4, 0.8 + Math.random() * 0.7,
             1 + Math.random() * 1.5, Math.random() < 0.5 ? '#777777' : '#aaaaaa', 50, 'circle');
    }
    if (_frame === Math.floor(_dur * 0.7)) _flash = { alpha: 0.4, color: '#ff6600' };
  }

  // ANCIENT_TORRENT: waterzuil onder het doelwit + golfmuur vanaf de aanvaller
  function _tick_SIG_TORRENT() {
    const atk = _atkPos(), def = _defPos();
    if (_frame < _dur * 0.7) {
      for (let i = 0; i < 4; i++) {
        _spawn(def.x + (Math.random() - 0.5) * 22, def.y + 28,
               (Math.random() - 0.5) * 0.8, -(3 + Math.random() * 3),
               2 + Math.random() * 2.5, ['#3399ff', '#66ccff', '#ffffff'][i % 3], 22, 'drop', 0.12);
      }
    }
    if (_frame === 4)  { _flash = { alpha: 0.5, color: '#66ccff' }; _setShake(4, 3); }
    if (_frame === 18) { _camTarget = Math.max(_camTarget, 1.1); _camFocus = { x: def.x, y: def.y }; }
    if (_frame % 2 === 0 && _frame < _dur * 0.6) {
      const t = _frame / (_dur * 0.6);
      const wx = _lerp(atk.x, def.x, t);
      for (let i = 0; i < 2; i++) {
        _spawn(wx + (Math.random() - 0.5) * 14, _lerp(atk.y, def.y, t) + 12 - Math.random() * 8,
               (def.x - atk.x) * 0.012, -1 - Math.random(),
               2.5 + Math.random() * 2, '#4db8ff', 16, 'drop', 0.08);
      }
    }
  }

  // FRILL_FLARE: vlammenring waaiert uit vanaf de frill, vuurbal slaat in
  function _tick_SIG_FRILL() {
    const atk = _atkPos(), def = _defPos();
    if (_frame < 16 && _frame % 2 === 0) {
      const n = 10;
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + _frame * 0.1;
        _spawn(atk.x + Math.cos(a) * 10, atk.y + Math.sin(a) * 8,
               Math.cos(a) * 2.2, Math.sin(a) * 1.6, 2.5,
               i % 3 === 0 ? '#ffdd55' : '#ff6600', 14, 'flame');
      }
    }
    if (_frame === 2) _flash = { alpha: 0.45, color: '#ff8800' };
    if (_frame >= 18 && _frame < 34 && _frame % 2 === 0) {
      for (let i = 0; i < 4; i++) {
        const a = Math.random() * Math.PI * 2;
        _spawn(def.x, def.y - 6, Math.cos(a) * 2, Math.sin(a) * 1.5 - 0.8,
               2 + Math.random() * 3, ['#ff5500', '#ffaa00', '#ffe080'][i % 3], 16, 'flame', 0.06);
      }
    }
    if (_frame === 18) {
      _flash = { alpha: 0.5, color: '#ffaa00' };
      _setShake(4, 2);
      _camTarget = Math.max(_camTarget, 1.08);
      _camFocus  = { x: def.x, y: def.y };
    }
  }

  // FOSSIL_MEMORY: roterende runencirkel + convergerende psychische scherven
  function _tick_SIG_FOSSIL() {
    const def = _defPos();
    if (_frame % 2 === 0) {
      for (let i = 0; i < 3; i++) {
        const a = (_frame * 0.18) + (i / 3) * Math.PI * 2;
        _spawn(def.x + Math.cos(a) * 30, def.y + Math.sin(a) * 18,
               0, 0, 2.2, i === 0 ? '#ffffff' : '#cc66ff', 8, 'rect');
      }
    }
    if (_frame > 10 && _frame % 2 === 0) {
      const a = Math.random() * Math.PI * 2;
      const r = 55 + Math.random() * 20;
      const px = def.x + Math.cos(a) * r, py = def.y + Math.sin(a) * r * 0.6;
      _spawn(px, py, (def.x - px) * 0.09, (def.y - py) * 0.09, 2, '#aa88ff', 12, 'line');
    }
    if (_frame === 6)  _flash = { alpha: 0.35, color: '#9955ff' };
    if (_frame === 30) {
      _flash = { alpha: 0.55, color: '#ddbbff' };
      _setShake(4, 3);
      _hitRings.push({ x: def.x, y: def.y, r: 50, maxR: 4, life: 14, color: '#cc66ff', delay: 0 });
    }
  }

  // SKULL_SLAM: komeet-boogsprong met staart, schokgolf + puin bij de landing
  function _tick_SIG_SKULL() {
    const atk = _atkPos(), def = _defPos();
    const off = _isPlayer ? _pOffset : _eOffset;
    const LAND = 26;
    if (_frame <= LAND) {
      const t = _frame / LAND;
      off.x = (def.x - atk.x) * t * 0.82;
      off.y = -Math.sin(t * Math.PI) * 55;
      if (_frame % 2 === 0) {
        _spawn(atk.x + off.x, atk.y + off.y, -(def.x - atk.x) * 0.01, 0.5,
               2.5 + Math.random() * 2, Math.random() < 0.4 ? '#ffffff' : '#ccaa77', 12, 'circle');
      }
    } else if (_frame === LAND + 1) {
      off.x = (def.x - atk.x) * 0.82; off.y = 0;
      _flash = { alpha: 0.6, color: '#ffffff' };
      _setShake(7, 5);
      _camTarget = Math.max(_camTarget, 1.12);
      _camFocus  = { x: def.x, y: def.y };
      _hitRings.push({ x: def.x, y: def.y + 14, r: 2, maxR: 55, life: 16, color: '#ccaa77', delay: 0 });
      for (let i = 0; i < 12; i++) {
        const a = Math.random() * Math.PI;
        _spawn(def.x, def.y + 10, Math.cos(a) * 3 * (Math.random() < 0.5 ? -1 : 1), -Math.sin(a) * 3,
               2 + Math.random() * 2.5, '#998866', 20, 'boulder', 0.15);
      }
    } else {
      const t2 = Math.min(1, (_frame - LAND - 1) / Math.max(1, _dur - LAND - 1));
      off.x = (def.x - atk.x) * 0.82 * (1 - t2);
      off.y = 0;
    }
  }

  // GLACIAL_MIND: vorst kruipt vanaf de schermranden naar het doelwit + bevriezings-puls
  function _tick_SIG_GLACIAL() {
    const def = _defPos();
    const W = _cw(), H = _ch();
    if (_frame < _dur * 0.6 && _frame % 2 === 0) {
      for (let i = 0; i < 3; i++) {
        const edge = Math.floor(Math.random() * 4);
        const px = edge === 0 ? 0 : edge === 1 ? W : Math.random() * W;
        const py = edge === 2 ? 0 : edge === 3 ? H : Math.random() * H;
        _spawn(px, py, (def.x - px) * 0.035, (def.y - py) * 0.035,
               1.8 + Math.random() * 1.8, Math.random() < 0.5 ? '#bfeaff' : '#ffffff', 24, 'crystal');
      }
    }
    if (_frame === 4) _flash = { alpha: 0.35, color: '#bfeaff' };
    if (_frame === Math.floor(_dur * 0.65)) {
      _flash = { alpha: 0.55, color: '#e8f8ff' };
      _setShake(3, 2);
      _camTarget = Math.max(_camTarget, 1.09);
      _camFocus  = { x: def.x, y: def.y };
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * Math.PI * 2;
        _spawn(def.x, def.y, Math.cos(a) * 1.8, Math.sin(a) * 1.2, 2.5, '#bfeaff', 18, 'crystal');
      }
      _hitRings.push({ x: def.x, y: def.y, r: 2, maxR: 44, life: 16, color: '#bfeaff', delay: 0 });
    }
  }

  // Volledig unieke unleash-scripts; de overige signatures gebruiken hun
  // bestaande animStyle (op intensiteit+1) na de generieke charge-fase.
  const _SIG_CUSTOM = {
    EXTINCTION_BEAM: { dur: 60, beam: true, tick: _tick_SIG_EXTINCTION },
    ANCIENT_TORRENT: { dur: 55, tick: _tick_SIG_TORRENT },
    FRILL_FLARE:     { dur: 45, tick: _tick_SIG_FRILL },
    FOSSIL_MEMORY:   { dur: 55, tick: _tick_SIG_FOSSIL },
    SKULL_SLAM:      { dur: 50, tick: _tick_SIG_SKULL },
    GLACIAL_MIND:    { dur: 55, tick: _tick_SIG_GLACIAL },
  };

  function triggerFaint(side) {
    // FASE 9: een vallende dino is per definitie niet meer aan het opladen
    _chargeVis[String(side).toLowerCase() === 'player' ? 'player' : 'enemy'] = null;
    _specialAnim  = 'FAINT';
    _specialFrame = 0;
    _specialDur   = 45;
    _specialData  = { side };
    // Dramatische langzame zoom op de KO + korte freeze
    const pos = (side === 'player') ? PPOS : EPOS;
    _camTarget = Math.max(_camTarget, 1.12);
    _camFocus  = { x: pos.x, y: pos.y };
    _hitStop   = Math.max(_hitStop, 4);
  }

  // ── Catch ──────────────────────────────────────────────────
  // shakes: 1–4, caught: true/false, ballId: item key string
  function triggerCatch(shakes, caught, ballId) {
    _specialAnim  = 'CATCH';
    _specialFrame = 0;
    _specialDur   = 30 + shakes * 28 + (caught ? 30 : 20);
    _specialData  = { shakes: Math.min(4, Math.max(1, shakes)), caught, phase: 0, ballId: ballId || 'DINOBALL' };
  }

  // ── Switch-in (player) ─────────────────────────────────────
  function triggerSwitchIn(side) {
    _chargeVis.player = null; // FASE 9: wissel = charge-visual weg
    _specialAnim  = 'SWITCH_IN';
    _specialFrame = 0;
    _specialDur   = 40;
    _specialData  = { side };
  }

  // ── Switch-in (enemy) ─────────────────────────────────────
  function triggerEnemySwitchIn() {
    _chargeVis.enemy = null; // FASE 9
    _specialAnim  = 'ENEMY_SWITCH';
    _specialFrame = 0;
    _specialDur   = 40;
    _specialData  = {};
  }

  // ── Battle intro ───────────────────────────────────────────
  function triggerBattleIntro(isTrainer, trainerName) {
    _specialAnim  = 'INTRO';
    _specialFrame = 0;
    // FASE 4: langere cinematische intro's (wild: silhouet-reveal, trainer: ball-throw)
    _specialDur   = isTrainer ? 100 : 75;
    _specialData  = { isTrainer, trainerName: trainerName || '' };
  }

  // FASE 4: battle.js wacht hiermee tot de intro-cinematic klaar is
  // (deze hook bestond al in battle.js maar wees nergens naartoe)
  function isBattleIntro() { return _specialAnim === 'INTRO'; }

  // FASE 4: intro-status voor spriteRenderer — wild verschijnt als silhouet
  // tot de reveal (f34); de trainer-dino materialiseert pas als de bal opent (f30).
  function getBattleIntroState() {
    if (_specialAnim !== 'INTRO') return { active: false, monScale: 1, frame: 0, silhouette: false };
    const f = _specialFrame, d = _specialData || {};
    if (d.isTrainer) {
      const monScale = f < 30 ? 0 : Math.min(1, (f - 30) / 12);
      return { active: true, monScale, frame: f, silhouette: false };
    }
    return { active: true, monScale: 1, frame: f, silhouette: f < 34 };
  }

  // ── Effectiveness flash (runs independently of _specialAnim) ──
  function triggerEffFlash(effectiveness, side) {
    let label = '', color = '#ffffff';
    if (effectiveness >= 2)       { label = 'SUPER EFFECTIVE!'; color = '#FFD700'; }
    else if (effectiveness > 1)   { label = 'Effective!';       color = '#88ffaa'; }
    else if (effectiveness < 1 && effectiveness > 0) { label = 'not very effective...'; color = '#aaaaaa'; }
    else return; // 0 = immune handled via dialogue only; effectiveness===1 = no label
    _effFlash.active = true;
    _effFlash.frame  = 0;
    _effFlash.label  = label;
    _effFlash.color  = color;
    _effFlash.side   = side || 'enemy';
  }

  // ── Money pop (runs independently of _specialAnim) ────────
  function triggerMoneyPop(amount) {
    _moneyPop.active = true;
    _moneyPop.frame  = 0;
    _moneyPop.amount = amount || 0;
  }

  // ── Ability flash ──────────────────────────────────────────
  // effectType: 'entry'|'burn'|'paralysis'|'poison'|'contact_damage'|'charm'|
  //             'absorb_fire'|'absorb_electric'|'power_boost'|'speed_boost'|
  //             'moxie'|'intimidate'|'sturdy'|'levitate'
  function triggerAbilityFlash(abilityName, side, effectType, extra) {
    _specialAnim  = 'ABILITY';
    _specialFrame = 0;
    _specialDur   = 50;
    _specialData  = { abilityName, side, effectType: effectType || 'entry', ...(extra || {}) };
  }

  // ── Shiny sparkle ─────────────────────────────────────────
  function triggerShiny(side) {
    _specialAnim  = 'SHINY';
    _specialFrame = 0;
    _specialDur   = 55;
    _specialData  = { side };
  }

  // ── Status tick (burn/poison/paralysis/freeze visual) ────────
  // status: 'BURN'|'POISON'|'BADPOISON'|'PARALYSIS'|'FREEZE'
  // side:   'player'|'enemy'
  function triggerStatusTick(status, side) {
    _specialAnim  = 'STATUS_TICK';
    _specialFrame = 0;
    _specialDur   = 28;
    _specialData  = { status, side };
  }

  // ── Critical hit ceremony ─────────────────────────────────
  function triggerCritHit(side) {
    _specialAnim  = 'CRIT_HIT';
    _specialFrame = 0;
    _specialDur   = 52;
    _specialData  = { side: side || 'enemy' };
    // Heavy shake immediately
    _shake.x = 9 * (Math.random() > 0.5 ? 1 : -1);
    _shake.y = 6 * (Math.random() > 0.5 ? 1 : -1);
    _flash = { alpha: 0.72, color: '#FFD700' };
    if (typeof DG.Audio !== 'undefined') {
      try { DG.Audio.playCritHitSfx(); } catch(e) {}
    }
  }

  // ── Level-up ceremony ─────────────────────────────────────
  function triggerLevelUp(newLevel) {
    _specialAnim  = 'LEVEL_UP';
    _specialFrame = 0;
    _specialDur   = 60;
    _specialData  = { level: newLevel || 1 };
  }

  // ── Move learn ────────────────────────────────────────────
  function triggerMoveLearn() {
    _specialAnim  = 'LEARN';
    _specialFrame = 0;
    _specialDur   = 50;
    _specialData  = {};
  }

  // ════════════════════════════════════════════════════════════
  // UPDATE & DRAW
  // ════════════════════════════════════════════════════════════

  function update() {
    // ── Hit-stop: bevries alle battle-visuals een paar frames ──
    if (_hitStop > 0) { _hitStop--; return; }

    // ── FASE 6: hit-reactie loopt af ná de freeze (flits houdt vast tijdens hit-stop)
    if (_hitReact.t > 0) _hitReact.t--;

    // ── FASE 8: scherm-flits ALTIJD laten uitdoven — voorheen gebeurde dat
    // alleen tijdens move-animaties, waardoor de intro-flits als melkwaas
    // over de battle bleef hangen tot de eerste aanval ("de mist")
    if (_flash.alpha > 0) _flash.alpha = Math.max(0, _flash.alpha - 0.055);

    // ── Camera-easing (zoom-punch bij crit/super/KO) ────────
    if (_camZoom !== _camTarget) {
      _camZoom += (_camTarget - _camZoom) * 0.35;
      if (Math.abs(_camZoom - _camTarget) < 0.002) _camZoom = _camTarget;
    }
    if (_camTarget > 1) {
      _camTarget += (1 - _camTarget) * 0.06; // langzame release terug naar 1
      if (_camTarget < 1.005) _camTarget = 1;
    }

    // ── Damage numbers tick ─────────────────────────────────
    for (let di = _dmgNumbers.length - 1; di >= 0; di--) {
      const d = _dmgNumbers[di];
      d.x += d.vx;
      d.y += d.vy;
      d.vy += 0.055; // lichte zwaartekracht → boogje
      d.life--;
      if (d.life <= 0) _dmgNumbers.splice(di, 1);
    }

    // ── Special animation tick ─────────────────────────────
    if (_specialAnim) {
      _specialFrame++;
      _updateSpecial();
      if (_specialFrame >= _specialDur) {
        _specialAnim = null;
        _particles   = [];
      }
    }

    // ── Independent overlay ticks ──────────────────────────
    if (_effFlash.active)  { _effFlash.frame++;  if (_effFlash.frame  >= _effFlash.dur)  _effFlash.active  = false; }
    if (_moneyPop.active)  { _moneyPop.frame++;  if (_moneyPop.frame  >= _moneyPop.dur)  _moneyPop.active  = false; }

    // ── Gap timer between queued anims ─────────────────────
    if (!_active && _gapTimer > 0) {
      _gapTimer--;
      if (_gapTimer === 0 && _animQueue.length > 0) {
        const next = _animQueue.shift();
        _startAnim(next.moveType, next.isPlayer, next.category, next.animStyle, next.power, next.moveId);
      }
    }

    if (!_active && _particles.length === 0 && _gapTimer === 0 && !_specialAnim) return;

    // ── FASE 4: letterbox + banner easing ──────────────────
    // (FASE 10: lite-windups van zware moves krijgen géén cinematics)
    {
      const cine = _active && _sig && !_sig.lite;
      const boxTarget = cine ? 1 : 0;
      _cineBox += (boxTarget - _cineBox) * 0.18;
      if (_cineBox < 0.005) _cineBox = 0;
      const bnTarget = cine ? 1 : 0;
      _cineBanner.alpha += (bnTarget - _cineBanner.alpha) * 0.16;
      if (_cineBanner.alpha < 0.005) _cineBanner.alpha = 0;
    }

    // ── Move animation tick ────────────────────────────────
    if (_active) {
      // FASE 4: charge-fase loopt op halve snelheid (slow-motion)
      // FASE 10: behalve bij de lite-windup van zware moves
      let advance = true;
      if (_sig && !_sig.lite && _sigPhase === 'CHARGE') {
        _sigSlow++;
        if (_sigSlow % 2 === 1) advance = false;
      }
      if (advance) {
        _frame++;
        if (_tickFn) _tickFn();
      }

      // Decay shake
      _shake.x *= 0.72;
      _shake.y *= 0.72;
      if (Math.abs(_shake.x) < 0.3) _shake.x = 0;
      if (Math.abs(_shake.y) < 0.3) _shake.y = 0;

      // (flash-decay verhuisd naar boven — FASE 8: loopt nu altijd)

      if (_frame >= _dur) {
        if (_sig && _sigPhase === 'CHARGE') {
          // FASE 4: overgang charge → unleash (FASE 10: lite = kleinere flits)
          _sigPhase = 'UNLEASH';
          _frame    = 0;
          _dur      = _sig.styleDur;
          _tickFn   = _sig.styleTick;
          _flash    = { alpha: _sig.lite ? 0.35 : 0.7, color: '#ffffff' };
          _pOffset  = { x: 0, y: 0 };
          _eOffset  = { x: 0, y: 0 };
        } else {
          // Spawn type-colored hit rings at defender on move completion
          // FASE 8: op het échte sprite-centrum, subtieler en zonder felwitte ring
          // FASE 10: + type-eigen element-impact (alleen bij schade-moves)
          if (_col && _col !== '#ffffff') {
            const def2 = _defCtr();
            _hitRings.push({ x: def2.x, y: def2.y, r: 2, maxR: 26 + _intensity * 5, life: 16, color: _col, delay: 0 });
            if (_intensity > 0) {
              try { _spawnElementImpact(_moveType, def2); } catch(e) {}
            }
          }
          _active  = false;
          _sig     = null;
          _sigPhase = null;
          _pOffset = { x: 0, y: 0 };
          _eOffset = { x: 0, y: 0 };
          _shake   = { x: 0, y: 0 };
          if (_animQueue.length > 0) _gapTimer = 12;
        }
      }
    }

    // ── Advance hit rings ──────────────────────────────────
    for (let ri = _hitRings.length - 1; ri >= 0; ri--) {
      const ring = _hitRings[ri];
      if (ring.delay > 0) { ring.delay--; continue; }
      ring.r += (ring.maxR - ring.r) * 0.28;
      ring.life--;
      if (ring.life <= 0) _hitRings.splice(ri, 1);
    }

    // ── Advance particles ──────────────────────────────────
    for (let i = _particles.length - 1; i >= 0; i--) {
      const p = _particles[i];
      p.x  += p.vx;
      p.y  += p.vy;
      if (p.gravity) p.vy += p.gravity;
      p.life--;
      if (p.life <= 0) _particles.splice(i, 1);
    }
  }

  // ── Special animation update logic ────────────────────────
  function _updateSpecial() {
    const f = _specialFrame;
    const d = _specialData;

    switch (_specialAnim) {
      case 'FAINT': {
        // Spawn drifting upward particles from the fainted mon
        const pos = d.side === 'PLAYER' ? PPOS : EPOS;
        if (f % 4 === 0) {
          for (let i = 0; i < 3; i++) {
            _spawn(pos.x + (Math.random() - 0.5) * 20,
                   pos.y + (Math.random() - 0.5) * 10,
                   (Math.random() - 0.5) * 1.5, -1.2 - Math.random() * 1.5,
                   2 + Math.random() * 2, '#ffffff', 20, 'circle');
          }
        }
        break;
      }
      case 'CATCH': {
        // Phases: throw arc (0-10), shake×N (28 frames each), result
        const shakeStart = 10;
        const shakeDur   = 28;
        const shakeEnd   = shakeStart + d.shakes * shakeDur;

        if (f < shakeStart) {
          // FASE 7: worp-whoosh bij vertrek
          if (f === 1) { try { DG.Audio.playCatchSfx('THROW'); } catch(e) {} }
          // Trail particles following the ball arc
          if (f % 2 === 0) {
            const t = f / shakeStart;
            const u = 1 - t;
            const trailX = u*u*35  + 2*u*t*155 + t*t*EPOS.x;
            const trailY = u*u*195 + 2*u*t*10  + t*t*(EPOS.y - 10);
            _spawn(trailX, trailY,
                   (Math.random() - 0.5) * 0.8, -0.5,
                   2.5, '#ff6644', 10, 'circle');
          }
          // At impact: absorption ring burst
          if (f === shakeStart - 1) {
            try { DG.Audio.playCatchSfx('IMPACT'); } catch(e) {} // FASE 7
            for (let i = 0; i < 12; i++) {
              const a = (i / 12) * Math.PI * 2;
              _spawn(EPOS.x, EPOS.y - 10,
                     Math.cos(a) * 2.5, Math.sin(a) * 2.5,
                     2, '#ffffff', 12, 'circle', 0.04);
            }
            _flash = { alpha: 0.4, color: '#ffffff' };
          }
        } else if (f < shakeEnd) {
          // Rattle particles at each shake peak
          const shakePhase = (f - shakeStart) % shakeDur;
          // FASE 7: hoorbaar tik-tak per wiebel (1× per wiebel-cyclus)
          if (shakePhase === 4) { try { DG.Audio.playCatchSfx('SHAKE'); } catch(e) {} }
          if (shakePhase === 4 || shakePhase === shakeDur - 4) {
            for (let i = 0; i < 3; i++) {
              const a = Math.random() * Math.PI * 2;
              _spawn(EPOS.x, EPOS.y,
                     Math.cos(a) * 1.2, Math.sin(a) * 1.2 - 0.5,
                     2, '#ff8844', 10, 'circle');
            }
          }
        } else {
          const resultFrame = f - shakeEnd;
          if (d.caught) {
            // Success: golden sparkle burst
            if (resultFrame === 1) {
              // FASE 7: lock-klik + succes-chime, bal blijft liggen tot battle-einde,
              // en drie gouden sterren poppen boven de bal
              try { DG.Audio.playCatchSfx('LOCK'); } catch(e) {}
              _caughtBall = d.ballId || 'DINOBALL';
              for (let i = 0; i < 3; i++) {
                _spawn(EPOS.x + (i - 1) * 11, EPOS.y - 16,
                       (i - 1) * 0.5, -1.7 - (i === 1 ? 0.6 : 0),
                       4.5, '#ffd75e', 27, 'star', 0.055);
              }
              for (let i = 0; i < 16; i++) {
                const a = (i / 16) * Math.PI * 2;
                _spawn(EPOS.x + Math.cos(a) * 8,
                       EPOS.y + Math.sin(a) * 8,
                       Math.cos(a) * 2.5, Math.sin(a) * 2.5 - 0.8,
                       2.5, '#ffdd00', 20, 'circle');
              }
              _flash = { alpha: 0.5, color: '#ffcc44' };
            } else if (resultFrame % 6 === 0 && resultFrame < 25) {
              for (let i = 0; i < 4; i++) {
                const a = Math.random() * Math.PI * 2;
                _spawn(EPOS.x + Math.cos(a) * 18,
                       EPOS.y + Math.sin(a) * 12,
                       Math.cos(a) * 1.5, Math.sin(a) * 1.5 - 0.5,
                       2.5, '#ffdd00', 16, 'circle');
              }
            }
          } else {
            // Failure: ball cracks open, mon re-emerges
            if (resultFrame === 1) {
              try { DG.Audio.playCatchSfx('BREAK'); } catch(e) {} // FASE 7
              for (let i = 0; i < 14; i++) {
                const a = (i / 14) * Math.PI * 2;
                _spawn(EPOS.x, EPOS.y,
                       Math.cos(a) * 3.5, Math.sin(a) * 3.5,
                       3, '#ff4444', 12, 'circle', 0.05);
              }
              _flash = { alpha: 0.4, color: '#ff2200' };
            }
          }
        }
        break;
      }
      case 'SWITCH_IN': {
        const pos = d.side === 'PLAYER' ? PPOS : EPOS;
        if (f < 20) {
          const count = 3 + Math.floor(f * 0.4);
          if (f % 2 === 0) {
            for (let i = 0; i < count; i++) {
              const a = Math.random() * Math.PI * 2;
              _spawn(pos.x + Math.cos(a) * 15,
                     pos.y + Math.sin(a) * 10,
                     Math.cos(a) * 1.5, Math.sin(a) * 1.5,
                     2 + Math.random() * 2, '#88ddff', 12, 'circle');
            }
          }
        }
        if (f === 5) _flash = { alpha: 0.35, color: '#88ddff' };
        break;
      }
      case 'ENEMY_SWITCH': {
        if (f < 20 && f % 2 === 0) {
          for (let i = 0; i < 4; i++) {
            const a = Math.random() * Math.PI * 2;
            _spawn(EPOS.x + Math.cos(a) * 18,
                   EPOS.y + Math.sin(a) * 12,
                   Math.cos(a) * 1.8, Math.sin(a) * 1.8,
                   2 + Math.random() * 2, '#ffcc44', 12, 'circle');
          }
        }
        if (f === 5) _flash = { alpha: 0.3, color: '#ffcc44' };
        break;
      }
      case 'INTRO': {
        const W = _cw(), H = _ch();
        if (f < 40 && f % 3 === 0) {
          const count = d.isTrainer ? 6 : 3;
          for (let i = 0; i < count; i++) {
            _spawn(Math.random() * W, Math.random() * H,
                   (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2,
                   2 + Math.random() * 3, '#ffffff', 18, 'circle');
          }
        }
        if (f === 1)  _flash = { alpha: 0.7, color: '#ffffff' };
        if (f === 15) _flash = { alpha: 0.4, color: '#ffffff' };
        // FASE 4: wild — silhouet-reveal met flits + radiale burst + camera-punch
        if (!d.isTrainer && f === 34) {
          _flash = { alpha: 0.85, color: '#ffffff' };
          _camTarget = Math.max(_camTarget, 1.08);
          _camFocus  = { x: EPOS.x, y: EPOS.y };
          for (let i = 0; i < 14; i++) {
            const a = (i / 14) * Math.PI * 2;
            _spawn(EPOS.x, EPOS.y, Math.cos(a) * 2.6, Math.sin(a) * 1.8,
                   2.5, i % 3 === 0 ? '#ffffff' : '#ffe9a0', 16, 'circle');
          }
        }
        // FASE 4: trainer — bal opent op f30: flits + ring-burst, dino groeit erin
        if (d.isTrainer && f === 30) {
          _flash = { alpha: 0.7, color: '#ffffff' };
          for (let i = 0; i < 12; i++) {
            const a = (i / 12) * Math.PI * 2;
            _spawn(EPOS.x, EPOS.y - 6, Math.cos(a) * 2.2, Math.sin(a) * 1.6,
                   2, '#ffffff', 14, 'circle');
          }
        }
        // NB: de trainer-banner wordt getekend in _drawIntroBanner (draw-fase) —
        // stond eerst hier in de update-fase waar geen ctx bestaat (bug).
        break;
      }
      case 'ABILITY': {
        const pos = d.side === 'player' ? PPOS : (d.side === 'enemy' ? EPOS : (d.side === 'PLAYER' ? PPOS : EPOS));
        const et  = d.effectType || 'entry';

        // ── BURN (Ember Scales): orange fire licks upward ──────────────
        if (et === 'burn') {
          if (f < 35 && f % 2 === 0) {
            for (let i = 0; i < 3; i++) {
              _spawn(pos.x + (Math.random()-0.5)*20, pos.y + (Math.random()-0.5)*10,
                     (Math.random()-0.5)*0.8, -1.2 - Math.random()*1.5,
                     2+Math.random()*2, ['#FF6600','#FF4400','#FFAA00'][i], 14, 'circle');
            }
          }
          if (f === 1)  _flash = { alpha: 0.45, color: '#FF6600' };
          if (f === 14) _flash = { alpha: 0.20, color: '#FF9900' };

        // ── PARALYSIS (Static): yellow sparks radiate outward ──────────
        } else if (et === 'paralysis') {
          if (f < 30 && f % 3 === 0) {
            for (let i = 0; i < 5; i++) {
              const a = Math.random() * Math.PI * 2;
              const spd = 1.5 + Math.random() * 2;
              _spawn(pos.x, pos.y, Math.cos(a)*spd, Math.sin(a)*spd*0.5,
                     1.5, '#F8D030', 10, 'circle');
            }
          }
          if (f === 1)  _flash = { alpha: 0.55, color: '#F8D030' };
          if (f === 10) _flash = { alpha: 0.25, color: '#FFE866' };

        // ── POISON (Poison Point / Poison Touch): purple bubbles ───────
        } else if (et === 'poison') {
          if (f < 35 && f % 3 === 0) {
            for (let i = 0; i < 4; i++) {
              const a = Math.random() * Math.PI * 2;
              const r = 8 + Math.random() * 16;
              _spawn(pos.x + Math.cos(a)*r, pos.y + Math.sin(a)*r*0.55,
                     Math.cos(a)*0.6, Math.sin(a)*0.6 - 0.4,
                     2.5, ['#A040A0','#CC44CC','#7700AA'][i%3], 16, 'circle');
            }
          }
          if (f === 1)  _flash = { alpha: 0.50, color: '#A040A0' };
          if (f === 16) _flash = { alpha: 0.20, color: '#CC44CC' };

        // ── CONTACT DAMAGE (Rough Skin): red spikes jab inward ─────────
        } else if (et === 'contact_damage') {
          if (f < 20 && f % 2 === 0) {
            for (let i = 0; i < 6; i++) {
              const a = (i/6)*Math.PI*2;
              _spawn(pos.x + Math.cos(a)*22, pos.y + Math.sin(a)*13,
                     -Math.cos(a)*2.5, -Math.sin(a)*2.5,
                     2, '#FF3333', 8, 'circle');
            }
          }
          if (f === 1)  _flash = { alpha: 0.55, color: '#FF3333' };
          if (f === 10) _flash = { alpha: 0.20, color: '#FF6666' };

        // ── CHARM (Cute Charm): pink hearts float up ────────────────────
        } else if (et === 'charm') {
          if (f < 40 && f % 4 === 0) {
            for (let i = 0; i < 3; i++) {
              _spawn(pos.x + (Math.random()-0.5)*30, pos.y,
                     (Math.random()-0.5)*0.5, -1.0 - Math.random(),
                     3+Math.random()*2, ['#FF88CC','#FF44AA','#FFAADD'][i], 20, 'circle');
            }
          }
          if (f === 1)  _flash = { alpha: 0.40, color: '#FF88CC' };
          if (f === 20) _flash = { alpha: 0.15, color: '#FFAADE' };

        // ── ABSORB FIRE (Flash Fire): red vortex swallowed inward ───────
        } else if (et === 'absorb_fire') {
          if (f < 40 && f % 2 === 0) {
            for (let i = 0; i < 5; i++) {
              const a = (i/5)*Math.PI*2 + f*0.2;
              const r = Math.max(2, 24 - f*0.5);
              _spawn(pos.x + Math.cos(a)*r, pos.y + Math.sin(a)*r*0.55,
                     -Math.cos(a)*1.2, -Math.sin(a)*1.2,
                     2, ['#FF6600','#FF9900','#FFDD00'][i%3], 12, 'circle');
            }
          }
          if (f === 1)  _flash = { alpha: 0.60, color: '#FF6600' };
          if (f === 15) _flash = { alpha: 0.25, color: '#FFAA00' };

        // ── ABSORB ELECTRIC (Volt Absorb / Lightning Rod): yellow surge ─
        } else if (et === 'absorb_electric') {
          if (f < 35 && f % 2 === 0) {
            for (let i = 0; i < 4; i++) {
              const a = (i/4)*Math.PI*2 + f*0.3;
              const r = Math.max(2, 20 - f*0.4);
              _spawn(pos.x + Math.cos(a)*r, pos.y + Math.sin(a)*r*0.55,
                     -Math.cos(a)*1.8, -Math.sin(a)*1.8,
                     1.5, ['#FFE000','#FFFF66','#FFD700'][i%3], 10, 'circle');
            }
          }
          if (f === 1)  _flash = { alpha: 0.60, color: '#FFE000' };
          if (f === 12) _flash = { alpha: 0.25, color: '#FFFFAA' };

        // ── POWER BOOST (Blaze / Overgrow / Torrent / Swarm): type aura ─
        } else if (et === 'power_boost') {
          const boostCol = d.typeColor || '#FF8800';
          if (f < 40 && f % 3 === 0) {
            for (let i = 0; i < 6; i++) {
              const a = (i/6)*Math.PI*2 + f*0.08;
              const r = 10 + f*0.4;
              _spawn(pos.x + Math.cos(a)*r, pos.y + Math.sin(a)*r*0.55,
                     Math.cos(a)*0.5, Math.sin(a)*0.5,
                     2.5, boostCol, 18, 'circle');
            }
          }
          if (f === 1)  _flash = { alpha: 0.55, color: boostCol };
          if (f === 18) _flash = { alpha: 0.25, color: boostCol };

        // ── SPEED BOOST (Speed Boost ability): cyan speed lines ─────────
        } else if (et === 'speed_boost') {
          if (f < 25 && f % 2 === 0) {
            for (let i = 0; i < 4; i++) {
              _spawn(pos.x - 20 + i*5, pos.y + (Math.random()-0.5)*14,
                     3 + Math.random()*2, 0,
                     1.5, ['#44FFEE','#88FFFF','#00DDCC'][i%3], 8, 'circle');
            }
          }
          if (f === 1)  _flash = { alpha: 0.35, color: '#44FFEE' };

        // ── MOXIE (after KO): red rising surge ──────────────────────────
        } else if (et === 'moxie') {
          if (f < 40 && f % 3 === 0) {
            for (let i = 0; i < 5; i++) {
              _spawn(pos.x + (Math.random()-0.5)*24, pos.y + 10,
                     (Math.random()-0.5)*0.6, -2.0 - Math.random()*1.5,
                     2.5+Math.random()*2, ['#FF2200','#FF6600','#FF0044'][i%3], 16, 'circle');
            }
          }
          if (f === 1)  _flash = { alpha: 0.60, color: '#FF2200' };
          if (f === 15) _flash = { alpha: 0.20, color: '#FF6600' };

        // ── INTIMIDATE (improved): cold blue-white roar lines ───────────
        } else if (et === 'intimidate') {
          const oppPos = d.side === 'player' ? EPOS : PPOS;
          if (f < 35 && f % 3 === 0) {
            for (let i = 0; i < 4; i++) {
              const yOff = (i-2)*7;
              const dx = (oppPos.x - pos.x) > 0 ? 2.5 : -2.5;
              _spawn(pos.x, pos.y + yOff, dx + (Math.random()-0.5),
                     (Math.random()-0.5)*0.4,
                     2, ['#AACCFF','#88AAFF','#FFFFFF'][i%3], 12, 'circle');
            }
          }
          if (f === 1)  _flash = { alpha: 0.45, color: '#AACCFF' };
          if (f === 14) _flash = { alpha: 0.15, color: '#DDEEFF' };

        // ── STURDY (survived OHKO): grey/silver shield burst ────────────
        } else if (et === 'sturdy') {
          if (f < 25 && f % 2 === 0) {
            for (let i = 0; i < 8; i++) {
              const a = (i/8)*Math.PI*2;
              _spawn(pos.x + Math.cos(a)*18, pos.y + Math.sin(a)*10,
                     Math.cos(a)*1.5, Math.sin(a)*1.5,
                     2, ['#CCCCCC','#FFFFFF','#AAAAAA'][i%3], 12, 'circle');
            }
          }
          if (f === 1) _flash = { alpha: 0.50, color: '#CCCCCC' };

        // ── LEVITATE (immune to Ground): floating blue rings ─────────────
        } else if (et === 'levitate') {
          if (f < 30 && f % 3 === 0) {
            for (let i = 0; i < 4; i++) {
              const a = (i/4)*Math.PI*2 + f*0.1;
              const r = 18 + i*4;
              _spawn(pos.x + Math.cos(a)*r, pos.y + Math.sin(a)*r*0.4,
                     Math.cos(a)*0.3, -0.8 - i*0.2,
                     1.5, ['#88CCFF','#AAEEFF','#66AAFF'][i%3], 14, 'circle');
            }
          }
          if (f === 1) _flash = { alpha: 0.35, color: '#88CCFF' };

        // ── DEFAULT / ENTRY (weather, generic): golden orbit ────────────
        } else {
          if (f < 30 && f % 2 === 0) {
            for (let i = 0; i < 4; i++) {
              const a = (i/4)*Math.PI*2 + f*0.15;
              const r = 14 + f*0.5;
              _spawn(pos.x + Math.cos(a)*r, pos.y + Math.sin(a)*r*0.6,
                     Math.cos(a)*0.8, Math.sin(a)*0.8,
                     2, '#ffee44', 10, 'circle');
            }
          }
          if (f === 1)  _flash = { alpha: 0.5, color: '#ffee44' };
          if (f === 18) _flash = { alpha: 0.25, color: '#ffee44' };
        }
        break;
      }
      case 'SHINY': {
        const pos = d.side === 'PLAYER' ? PPOS : EPOS;
        if (f < 45 && f % 4 === 0) {
          for (let i = 0; i < 7; i++) {
            const a = Math.random() * Math.PI * 2;
            const r = 10 + Math.random() * 25;
            _spawn(pos.x + Math.cos(a) * r, pos.y + Math.sin(a) * r * 0.6,
                   Math.cos(a) * 0.5, Math.sin(a) * 0.5 - 0.5,
                   1.5 + Math.random() * 2, '#ffff88', 18, 'circle');
          }
        }
        if (f === 1)  _flash = { alpha: 0.6, color: '#ffffcc' };
        if (f === 20) _flash = { alpha: 0.35, color: '#ffff88' };
        break;
      }
      case 'LEARN': {
        const W = _cw(), H = _ch();
        if (f < 40 && f % 5 === 0) {
          const hues = ['#88ffcc', '#ffee44', '#88aaff', '#ff88cc'];
          for (let i = 0; i < 5; i++) {
            _spawn(PPOS.x + (Math.random() - 0.5) * 50,
                   PPOS.y + (Math.random() - 0.5) * 30,
                   (Math.random() - 0.5) * 2, -1.5 - Math.random() * 2,
                   2 + Math.random() * 2, hues[i % hues.length], 18, 'circle');
          }
        }
        if (f === 1)  _flash = { alpha: 0.6, color: '#88ffcc' };
        if (f === 15) _flash = { alpha: 0.4, color: '#ffee44' };
        if (f === 30) _flash = { alpha: 0.3, color: '#88aaff' };
        break;
      }

      case 'CRIT_HIT': {
        const targetPos = (d.side === 'enemy' || d.side === 'ENEMY') ? EPOS : PPOS;
        // Gold shockwave rings expanding outward from target
        if (f % 7 === 0 && f < 35) {
          const rings = 2 + Math.floor(f / 7);
          for (let ri = 0; ri < rings; ri++) {
            const a = (ri / rings) * Math.PI * 2;
            _spawn(targetPos.x + Math.cos(a) * 4, targetPos.y + Math.sin(a) * 3,
                   Math.cos(a) * 2.5, Math.sin(a) * 1.8,
                   2.5, '#FFD700', 18, 'star', 0.03);
          }
        }
        // Sustained gold particle rain from target
        if (f % 2 === 0 && f < 40) {
          for (let i = 0; i < 3; i++) {
            _spawn(targetPos.x + (Math.random() - 0.5) * 36,
                   targetPos.y + (Math.random() - 0.5) * 22,
                   (Math.random() - 0.5) * 2.5, -1.5 - Math.random() * 2,
                   2 + Math.random() * 2, i % 2 === 0 ? '#FFD700' : '#FFEE88', 20, 'star', 0.03);
          }
        }
        // Extended shake
        if (f < 12) {
          _shake.x = (8 - f) * (Math.random() > 0.5 ? 1 : -1);
          _shake.y = (5 - f * 0.4) * (Math.random() > 0.5 ? 1 : -1);
        }
        break;
      }

      case 'LEVEL_UP': {
        // Gold transformation flash sequence on player mon
        if (f < 10 && f % 3 === 0) _flash = { alpha: 0.55, color: '#FFD700' };
        if (f === 12)               _flash = { alpha: 0.38, color: '#FFEE88' };
        if (f === 24)               _flash = { alpha: 0.28, color: '#FFD700' };
        // Gold particles spiraling upward from player mon
        if (f % 2 === 0 && f < 50) {
          for (let i = 0; i < 4; i++) {
            const a = (f * 0.4 + i * Math.PI / 2);
            const dist = 12 + f * 0.3;
            _spawn(PPOS.x + Math.cos(a) * dist, PPOS.y + Math.sin(a) * dist * 0.55,
                   Math.cos(a) * 0.6, Math.sin(a) * 0.6 - 2.0,
                   2 + Math.random(), '#FFD700', 22, 'star', 0.02);
          }
          _spawn(PPOS.x + (Math.random() - 0.5) * 30, PPOS.y + (Math.random() - 0.5) * 18,
                 (Math.random() - 0.5) * 1.5, -2.5 - Math.random() * 1.5,
                 1.5 + Math.random(), '#FFFFAA', 18, 'star', 0.03);
        }
        break;
      }

      case 'STATUS_TICK': {
        // Quick per-turn visual for each status condition
        const pos = (d.side === 'player') ? PPOS : EPOS;
        const px = pos.x, py = pos.y;

        if (d.status === 'BURN') {
          // Orange-red flames rising from the mon
          if (f === 0) _flash = { alpha: 0.28, color: '#FF4400' };
          if (f % 3 === 0) {
            for (let i = 0; i < 3; i++) {
              _spawn(px + (Math.random() - 0.5) * 24,
                     py + (Math.random() - 0.5) * 10,
                     (Math.random() - 0.5) * 1.2, -1.8 - Math.random() * 1.5,
                     2.5 + Math.random(), '#FF6600', 16, 'circle', 0.07);
            }
            _spawn(px + (Math.random() - 0.5) * 14, py - 5,
                   (Math.random() - 0.5) * 0.8, -2.5,
                   3, '#FFCC44', 12, 'circle', 0.09);
          }

        } else if (d.status === 'POISON' || d.status === 'BADPOISON') {
          // Purple toxic bubbles
          if (f === 0) _flash = { alpha: 0.22, color: '#7B00AA' };
          if (f % 4 === 0) {
            for (let i = 0; i < 4; i++) {
              const a = Math.random() * Math.PI * 2;
              _spawn(px + Math.cos(a) * 14, py + Math.sin(a) * 9,
                     Math.cos(a) * 0.9, Math.sin(a) * 0.9 - 0.8,
                     2 + Math.random(), '#A040A0', 18, 'circle', 0.04);
            }
          }
          if (d.status === 'BADPOISON' && f === 0) {
            // Extra burst for bad poison
            for (let i = 0; i < 8; i++) {
              const a = (i / 8) * Math.PI * 2;
              _spawn(px + Math.cos(a) * 10, py + Math.sin(a) * 7,
                     Math.cos(a) * 1.5, Math.sin(a) * 1.5 - 0.3,
                     2.5, '#6B006B', 14, 'circle', 0.05);
            }
          }

        } else if (d.status === 'PARALYSIS') {
          // Yellow electric sparks crackling across the mon
          if (f === 0) _flash = { alpha: 0.30, color: '#F8D030' };
          if (f % 2 === 0 && f < 18) {
            for (let i = 0; i < 3; i++) {
              _spawn(px + (Math.random() - 0.5) * 28,
                     py + (Math.random() - 0.5) * 18,
                     (Math.random() - 0.5) * 2.5, (Math.random() - 0.5) * 2.5,
                     1.5 + Math.random(), '#F8D030', 8, 'circle', 0.12);
            }
          }
          if (f === 8) _flash = { alpha: 0.15, color: '#FFE860' };

        } else if (d.status === 'FREEZE') {
          // Icy blue crystals expanding from the mon
          if (f === 0) _flash = { alpha: 0.28, color: '#88CCEE' };
          if (f % 5 === 0) {
            for (let i = 0; i < 5; i++) {
              const a = (i / 5) * Math.PI * 2 + f * 0.3;
              _spawn(px + Math.cos(a) * 16, py + Math.sin(a) * 10,
                     Math.cos(a) * 0.6, Math.sin(a) * 0.6,
                     2, '#B0E8FF', 20, 'circle', 0.03);
            }
          }
        }
        break;
      }
    }
  }

  // ── DRAW ──────────────────────────────────────────────────
  // ── Trainer name slide-in banner (draw-fase) ───────────────
  // FASE 4: trainer gooit de bal in een boog naar de plek van zijn dino
  function _drawIntroBall(ctx) {
    if (_specialAnim !== 'INTRO') return;
    const d = _specialData || {};
    const f = _specialFrame;
    if (!d.isTrainer || f < 10 || f >= 30) return;
    const W = _cw();
    const t = (f - 10) / 20;
    const u = 1 - t;
    const sx = W + 16, sy = _ch() * 0.30;       // start: buiten beeld rechts
    const cx = (sx + EPOS.x) / 2, cy = -20;     // controlepunt hoog boven het veld
    const bx = u * u * sx + 2 * u * t * cx + t * t * EPOS.x;
    const by = u * u * sy + 2 * u * t * cy + t * t * (EPOS.y - 6);
    _drawBall(ctx, bx, by, 7, f * 0.45, 'DINOBALL');
    // staartje van vonkjes achter de bal
    if (f % 2 === 0) {
      _spawn(bx, by, (Math.random() - 0.5) * 0.6, -0.4, 2, '#ffffff', 9, 'circle');
    }
  }

  function _drawIntroBanner(ctx) {
    if (_specialAnim !== 'INTRO') return;
    const d = _specialData || {};
    const f = _specialFrame;
    if (!d.isTrainer || !d.trainerName || f < 8 || f >= 60) return;
    const W = _cw(), H = _ch();
    const textAge = f - 8;
    const SLIDE_DUR = 12;
    const slideIn = Math.min(1, textAge / SLIDE_DUR);
    const fadeOut = textAge > 42 ? 1 - (textAge - 42) / 10 : 1;
    const alpha   = Math.min(slideIn, fadeOut);
    ctx.save();
    ctx.globalAlpha = Math.max(0, alpha);
    const bH = 28, bY = H * 0.12;
    const bW = W * 0.72;
    const bX = W - bW * slideIn;
    // FASE 4: diagonale band met accent-rand i.p.v. kale balk
    const SKEW = 10;
    ctx.beginPath();
    ctx.moveTo(bX + SKEW, bY);
    ctx.lineTo(W, bY);
    ctx.lineTo(W, bY + bH);
    ctx.lineTo(bX, bY + bH);
    ctx.closePath();
    ctx.fillStyle = 'rgba(8,6,16,0.82)';
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(bX + SKEW, bY);
    ctx.lineTo(bX + SKEW + 5, bY);
    ctx.lineTo(bX + 5, bY + bH);
    ctx.lineTo(bX, bY + bH);
    ctx.closePath();
    ctx.fillStyle = '#e94560';
    ctx.fill();
    ctx.font = 'bold 9px monospace';
    ctx.fillStyle = '#ffaaaa';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    const textX = bX + 10;
    if (textX + 20 < W) ctx.fillText('TRAINER', textX, bY + 3);
    ctx.font = 'bold 14px monospace';
    ctx.fillStyle = '#ffffff';
    if (textX + 20 < W) ctx.fillText(d.trainerName, textX, bY + 12);
    ctx.font = '9px monospace';
    ctx.fillStyle = '#ffdd88';
    ctx.textAlign = 'right';
    const rightEdge = Math.min(W - 4, bX + bW * slideIn - 4);
    if (rightEdge > textX + 60) ctx.fillText('wants to battle!', rightEdge, bY + 14);
    ctx.textAlign = 'left';
    ctx.restore();
  }

  function draw(ctx) {
    const W = _cw(), H = _ch();

    // BEAM: draw the glowing line directly (not via particles)
    // FASE 4: ook voor signature-unleashes met beam-vlag (Extinction Beam)
    // FASE 6: additive blending — de beam gloeit i.p.v. dat hij "getekend" is
    if (_active && (_tickFn === _tick_BEAM || (_sig && _sigPhase === 'UNLEASH' && _sig.beam))) {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      _drawBeamLine(ctx);
      ctx.restore();
    }

    // FASE 10: getekende vormen van de nieuwe stijlen
    if (_active) {
      if (_tickFn === _tick_STREAM)       _drawStreamJet(ctx);
      else if (_tickFn === _tick_BOLT)    _drawBolt(ctx);
      else if (_tickFn === _tick_SLASH)   _drawSlashes(ctx);
      else if (_tickFn === _tick_CHOMP)   _drawChomp(ctx);
      else if (_tickFn === _tick_ORB)     _drawOrb(ctx);
      else if (_tickFn === _tick_QUAKE)   _drawQuakeCracks(ctx);
      else if (_tickFn === _tick_TWISTER) _drawTwisterSwirl(ctx);
    }

    // FIELD: full-screen tint overlay
    if (_active && _tickFn === _tick_FIELD) {
      ctx.save();
      ctx.globalAlpha = 0.15 + _intensity * 0.04;
      ctx.fillStyle   = _col;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
    }

    // Flash overlay
    if (_flash.alpha > 0.01) {
      ctx.save();
      ctx.globalAlpha = Math.min(1, _flash.alpha);
      ctx.fillStyle   = _flash.color;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
    }

    // ── Hit rings — type-colored expanding rings at defender ──
    // FASE 6: additive blending → ringen zijn lichtringen
    for (const ring of _hitRings) {
      if (ring.delay > 0) continue;
      // FASE 8: gedimd (0.8 → 0.45) — met de additive glow was wit te fel
      const rAlpha = Math.max(0, ring.life / 20) * 0.45;
      const rWidth = Math.max(0.5, 2.2 * (ring.life / 20));
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = rAlpha;
      ctx.strokeStyle = ring.color;
      ctx.lineWidth   = rWidth;
      ctx.shadowColor = ring.color;
      ctx.shadowBlur  = 6;
      ctx.beginPath();
      ctx.ellipse(ring.x, ring.y, ring.r, ring.r * 0.58, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // ── Particles — with type-specific shapes ─────────────────
    // Active move type determines shape override for 'circle' particles
    // FASE 6: energie-vormen (vlam/vonk/kristal/druppel/lijn) renderen additief
    // zodat ze gloeien; as/puin/rots blijven bewust mat
    const _GLOW_SHAPES = { flame: 1, spark: 1, crystal: 1, drop: 1, line: 1, star: 1 };
    const _shapeOverride = _active ? (_TYPE_SHAPE[_moveType] || null) : null;
    for (const p of _particles) {
      const alpha = Math.max(0, p.life / p.maxLife);
      ctx.globalAlpha = alpha;
      const shape = (p.shape && p.shape !== 'circle') ? p.shape : (_shapeOverride || 'circle');
      ctx.globalCompositeOperation = _GLOW_SHAPES[shape] ? 'lighter' : 'source-over';

      if (shape === 'rect' || shape === 'boulder') {
        ctx.save();
        ctx.translate(p.x, p.y);
        if (shape === 'boulder') {
          // Irregular rock chunk: hexagon approximation
          ctx.rotate((p.x + p.y) * 0.08);
          ctx.fillStyle = p.color;
          ctx.beginPath();
          const sides = 5 + Math.floor((p.r + p.x * 0.01) % 3);
          for (let s = 0; s < sides; s++) {
            const a = (s / sides) * Math.PI * 2;
            const rr = p.r * (0.7 + 0.3 * ((s * 13 + 7) % 5) / 5);
            s === 0 ? ctx.moveTo(Math.cos(a)*rr, Math.sin(a)*rr)
                    : ctx.lineTo(Math.cos(a)*rr, Math.sin(a)*rr);
          }
          ctx.closePath(); ctx.fill();
        } else {
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.r, -p.r, p.r * 2, p.r * 2);
        }
        ctx.restore();
      } else if (shape === 'line') {
        ctx.strokeStyle = p.color;
        ctx.lineWidth   = p.r;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.vx * 3, p.y - p.vy * 3);
        ctx.stroke();
      } else if (shape === 'star') {
        // FASE 7: vijfpuntige ster (Gotcha-moment bij een vangst)
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.maxLife - p.life) * 0.09);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        for (let s5 = 0; s5 < 10; s5++) {
          const rr = s5 % 2 === 0 ? p.r : p.r * 0.45;
          const aa = (s5 / 10) * Math.PI * 2 - Math.PI / 2;
          if (s5 === 0) ctx.moveTo(Math.cos(aa) * rr, Math.sin(aa) * rr);
          else ctx.lineTo(Math.cos(aa) * rr, Math.sin(aa) * rr);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      } else if (shape === 'flame') {
        // Teardrop pointing upward (flame lick)
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(-Math.PI * 0.5 + Math.atan2(p.vy || -1, p.vx || 0));
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.moveTo(0, -p.r * 1.6);
        ctx.bezierCurveTo( p.r * 0.7, -p.r * 0.4,  p.r * 0.5, p.r * 0.6, 0, p.r * 0.7);
        ctx.bezierCurveTo(-p.r * 0.5, p.r * 0.6, -p.r * 0.7, -p.r * 0.4, 0, -p.r * 1.6);
        ctx.fill();
        ctx.restore();
      } else if (shape === 'spark') {
        // 4-pointed star / lightning spark
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.life * 0.3) % (Math.PI * 2));
        ctx.fillStyle = p.color;
        ctx.beginPath();
        for (let s = 0; s < 4; s++) {
          const a = (s / 4) * Math.PI * 2;
          const b = a + Math.PI / 4;
          if (s === 0) ctx.moveTo(Math.cos(a) * p.r * 1.8, Math.sin(a) * p.r * 1.8);
          else         ctx.lineTo(Math.cos(a) * p.r * 1.8, Math.sin(a) * p.r * 1.8);
          ctx.lineTo(Math.cos(b) * p.r * 0.5, Math.sin(b) * p.r * 0.5);
        }
        ctx.closePath(); ctx.fill();
        ctx.restore();
      } else if (shape === 'crystal') {
        // 6-pointed snowflake / ice crystal
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.strokeStyle = p.color;
        ctx.lineWidth = Math.max(0.5, p.r * 0.35);
        for (let s = 0; s < 3; s++) {
          const a = (s / 3) * Math.PI;
          ctx.beginPath();
          ctx.moveTo(Math.cos(a) * p.r * 1.4, Math.sin(a) * p.r * 1.4);
          ctx.lineTo(Math.cos(a + Math.PI) * p.r * 1.4, Math.sin(a + Math.PI) * p.r * 1.4);
          ctx.stroke();
          // Branch tips
          [0.6, -0.6].forEach(sign => {
            const bx = Math.cos(a) * p.r * 0.8;
            const by = Math.sin(a) * p.r * 0.8;
            ctx.beginPath();
            ctx.moveTo(bx, by);
            ctx.lineTo(bx + Math.cos(a + sign * Math.PI/3) * p.r * 0.4,
                       by + Math.sin(a + sign * Math.PI/3) * p.r * 0.4);
            ctx.stroke();
          });
        }
        ctx.restore();
      } else if (shape === 'drop') {
        // Water droplet (teardrop pointing down)
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.moveTo(0, p.r * 1.5);
        ctx.bezierCurveTo( p.r * 0.6,  p.r * 0.4,  p.r * 0.7, -p.r * 0.3, 0, -p.r * 0.8);
        ctx.bezierCurveTo(-p.r * 0.7, -p.r * 0.3, -p.r * 0.6,  p.r * 0.4, 0, p.r * 1.5);
        ctx.fill();
        ctx.restore();
      } else if (shape === 'leaf') {
        // Pointed oval leaf
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(Math.atan2(p.vy || -1, p.vx || 1) + Math.PI * 0.25);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.r * 0.6, p.r * 1.4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else if (shape === 'star') {
        // 5-pointed star
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.life * 0.1);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        for (let s = 0; s < 5; s++) {
          const a = (s / 5) * Math.PI * 2 - Math.PI / 2;
          const b = a + Math.PI / 5;
          if (s === 0) ctx.moveTo(Math.cos(a) * p.r * 1.6, Math.sin(a) * p.r * 1.6);
          else         ctx.lineTo(Math.cos(a) * p.r * 1.6, Math.sin(a) * p.r * 1.6);
          ctx.lineTo(Math.cos(b) * p.r * 0.6, Math.sin(b) * p.r * 0.6);
        }
        ctx.closePath(); ctx.fill();
        ctx.restore();
      } else {
        // Default circle
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.5, p.r), 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over'; // FASE 6: glow-modus resetten

    // ── FASE 7: gevangen! — de dichte bal blijft met een zachte gloed
    // op het veld liggen tot de battle sluit
    if (_caughtBall && _specialAnim !== 'CATCH') {
      const pulse = 0.55 + 0.35 * Math.sin(Date.now() / 320);
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      const gg = ctx.createRadialGradient(EPOS.x, EPOS.y - 10, 1, EPOS.x, EPOS.y - 10, 17);
      gg.addColorStop(0, `rgba(255,230,140,${0.38 * pulse})`);
      gg.addColorStop(1, 'rgba(255,200,80,0)');
      ctx.fillStyle = gg;
      ctx.fillRect(EPOS.x - 19, EPOS.y - 29, 38, 38);
      ctx.restore();
      _drawBall(ctx, EPOS.x, EPOS.y - 10, 6, 0, _caughtBall);
    }

    // Special anim draw-on-top overlays
    _drawSpecialOverlay(ctx);

    // NB: intro-bal en trainer-banner verhuisd naar drawCinematics(),
    // zodat ze bóven de HUD renderen (fase 4).

    // ── Effectiveness flash overlay ────────────────────────
    if (_effFlash.active) {
      const ef = _effFlash.frame, ed = _effFlash.dur;
      const W2 = _cw(), H2 = _ch();
      // Fade in quickly (frames 0-6), hold (7-24), fade out (25-end)
      const fa = ef < 6 ? ef / 6 : (ef > ed - 12 ? 1 - (ef - (ed - 12)) / 12 : 1);
      if (fa > 0.01) {
        ctx.save();
        ctx.globalAlpha = fa;
        // Position: near HP bar of defender side
        const isEnemy = _effFlash.side === 'enemy';
        const ty = isEnemy ? H2 * 0.16 : H2 * 0.62;
        const tx = W2 * (isEnemy ? 0.58 : 0.22);
        // Scale zoom in from 0.5 on first 6 frames
        const sc = ef < 6 ? 0.5 + 0.5 * (ef / 6) : 1.0;
        ctx.translate(tx, ty);
        ctx.scale(sc, sc);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.55)';
        ctx.font = `bold 15px monospace`;
        ctx.fillText(_effFlash.label, 2, 2);
        // Coloured text
        ctx.fillStyle = _effFlash.color;
        ctx.fillText(_effFlash.label, 0, 0);
        ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
        ctx.restore();
      }
    }

    // ── Money pop overlay ──────────────────────────────────
    if (_moneyPop.active) {
      const mf = _moneyPop.frame, md = _moneyPop.dur;
      const W3 = _cw(), H3 = _ch();
      // Slide upward from center, fade in then out
      const fa2 = mf < 10 ? mf / 10 : (mf > md - 20 ? 1 - (mf - (md - 20)) / 20 : 1);
      const rise = mf * 1.4; // pixels upward
      if (fa2 > 0.01) {
        ctx.save();
        ctx.globalAlpha = fa2;
        const cx = W3 / 2, cy = H3 * 0.44 - rise;
        // Sparkle particles (3 gold dots orbiting)
        for (let si = 0; si < 6; si++) {
          const sa = (si / 6) * Math.PI * 2 + mf * 0.18;
          const sr = 28 + 6 * Math.sin(mf * 0.2 + si);
          ctx.beginPath();
          ctx.arc(cx + Math.cos(sa) * sr, cy + Math.sin(sa) * sr * 0.5, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = si % 2 === 0 ? '#FFD700' : '#FFEE88';
          ctx.fill();
        }
        // Amount text
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        const amtStr = `¥ +${_moneyPop.amount}`;
        // Glow shadow
        ctx.font = 'bold 18px monospace';
        ctx.shadowColor = '#FFD700'; ctx.shadowBlur = 8;
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillText(amtStr, cx + 2, cy + 2);
        // Gold gradient text
        const mg = ctx.createLinearGradient(cx - 50, cy - 10, cx + 50, cy + 10);
        mg.addColorStop(0, '#FFD700'); mg.addColorStop(0.4, '#FFEE88');
        mg.addColorStop(0.7, '#FFD700'); mg.addColorStop(1, '#FF9900');
        ctx.fillStyle = mg; ctx.shadowBlur = 0;
        ctx.fillText(amtStr, cx, cy);
        ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
        ctx.restore();
      }
    }

  }

  // ── FASE 4: cinematische letterbox + signature-banner ────────
  // Wordt door de renderer ALS LAATSTE getekend (over HUD en dialoog heen).
  function drawCinematics(ctx) {
    const W = _cw(), H = _ch();
    // Intro-bal en trainer-banner horen ook boven de HUD
    _drawIntroBall(ctx);
    _drawIntroBanner(ctx);

    // ── FASE 6: impact-frames — 1 frame wit, 1 frame geïnverteerd (anime-stijl)
    if (_impactFrames > 0) {
      ctx.save();
      if (_impactFrames === 2) {
        ctx.globalAlpha = 0.92;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, W, H);
      } else {
        ctx.globalCompositeOperation = 'difference';
        ctx.fillStyle = '#e0e0e0';
        ctx.fillRect(0, 0, W, H);
      }
      ctx.restore();
      _impactFrames--; // telt per gerenderd frame, ook tijdens hit-stop
    }
    if (_cineBox > 0.01) {
      const bh = Math.round(24 * _cineBox);
      ctx.save();
      ctx.fillStyle = 'rgba(4,6,14,0.93)';
      ctx.fillRect(0, 0, W, bh);
      ctx.fillRect(0, H - bh, W, bh);
      // dunne accentlijn in de move-kleur langs de balken
      if (_cineBanner.alpha > 0.05) {
        ctx.globalAlpha = _cineBanner.alpha * 0.9;
        ctx.fillStyle = _cineBanner.color;
        ctx.fillRect(0, bh - 1, W, 1);
        ctx.fillRect(0, H - bh, W, 1);
      }
      ctx.restore();
    }
    if (_cineBanner.alpha > 0.02 && _cineBanner.text) {
      ctx.save();
      ctx.globalAlpha = Math.min(1, _cineBanner.alpha);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const by = Math.max(12, 24 * _cineBox * 0.5);
      ctx.font = 'bold 16px monospace';
      ctx.fillStyle = 'rgba(0,0,20,0.9)';
      ctx.fillText('★ ' + _cineBanner.text + ' ★', W / 2 + 1, by + 2);
      ctx.fillStyle = _cineBanner.color;
      ctx.fillText('★ ' + _cineBanner.text + ' ★', W / 2, by);
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';
      ctx.restore();
    }
  }

  // ── Draw BEAM line ─────────────────────────────────────────
  function _drawBeamLine(ctx) {
    const atk = _atkPos(), def = _defPos();
    const t   = _frame / _dur;
    const endT = Math.min(1, t * 1.5); // beam extends to target by 67% through
    const endX = _lerp(atk.x, def.x, endT);
    const endY = _lerp(atk.y, def.y, endT);
    const width = (2 + _intensity * 1.5) * (1 - t * 0.5);
    const alpha = Math.max(0, 1 - t * 1.1);

    ctx.save();
    ctx.globalAlpha = alpha;

    // Outer glow
    ctx.strokeStyle = _colDark;
    ctx.lineWidth   = width * 2.5;
    ctx.lineCap     = 'round';
    ctx.shadowColor = _col;
    ctx.shadowBlur  = 8 + _intensity * 3;
    ctx.beginPath();
    ctx.moveTo(atk.x, atk.y);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    // Core beam
    ctx.strokeStyle = _col;
    ctx.lineWidth   = width;
    ctx.shadowBlur  = 4;
    ctx.beginPath();
    ctx.moveTo(atk.x, atk.y);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    // White hot center
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth   = Math.max(0.5, width * 0.35);
    ctx.shadowBlur  = 0;
    ctx.beginPath();
    ctx.moveTo(atk.x, atk.y);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    ctx.restore();
  }

  // ── Draw special overlays ─────────────────────────────────
  function _drawSpecialOverlay(ctx) {
    if (!_specialAnim) return;
    const f = _specialFrame;
    const d = _specialData;

    switch (_specialAnim) {
      case 'CATCH': {
        const shakeStart = 10;
        const shakeDur   = 28;
        const shakeEnd   = shakeStart + d.shakes * shakeDur;

        // Throw arc: from bottom-left (player) to enemy position
        const throwSX = 35,     throwSY = 195;   // throw origin (near player)
        const throwCX = 155,    throwCY = 10;    // arc control point (peak)
        const throwEX = EPOS.x, throwEY = EPOS.y - 10; // landing spot

        const restX = throwEX, restY = throwEY;
        let ballX = restX, ballY = restY;
        let angle = 0;

        if (f < shakeStart) {
          // ── Phase 1: ball flying in along a bezier arc ──────
          const t = f / shakeStart;
          const u = 1 - t;
          ballX = u*u*throwSX + 2*u*t*throwCX + t*t*throwEX;
          ballY = u*u*throwSY + 2*u*t*throwCY + t*t*throwEY;
          angle = t * Math.PI * 2.5; // gentle spin during flight
          _drawBall(ctx, ballX, ballY, 5 + t, angle, d.ballId); // ball grows slightly as it nears

          // Impact flash in the last 2 frames
          if (f >= shakeStart - 2) {
            const fp = (f - (shakeStart - 2)) / 2;
            ctx.save();
            ctx.globalAlpha = (1 - fp) * 0.75;
            ctx.beginPath();
            ctx.arc(throwEX, throwEY, 6 + fp * 14, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.fill();
            ctx.restore();
          }
        } else if (f < shakeEnd) {
          // ── Phase 2: ball wobbling on the ground ────────────
          const shakePhase = (f - shakeStart) % shakeDur;
          angle = Math.sin((shakePhase / shakeDur) * Math.PI * 2) * 0.35;
          _drawBall(ctx, restX, restY, 6, angle, d.ballId);
        } else {
          // ── Phase 3: result ──────────────────────────────────
          const resultFrame = f - shakeEnd;
          if (d.caught) {
            // FASE 7: de bal fadet NIET meer weg — hij blijft liggen
            // (de blijvende bal + gloed wordt na de animatie in draw() getekend)
            _drawBall(ctx, restX, restY, 6, 0, d.ballId);
            // Klik-flits op het lock-moment
            if (resultFrame < 5) {
              ctx.save();
              ctx.globalCompositeOperation = 'lighter';
              ctx.globalAlpha = (1 - resultFrame / 5) * 0.85;
              ctx.beginPath();
              ctx.arc(restX, restY, 7 + resultFrame * 3, 0, Math.PI * 2);
              ctx.strokeStyle = '#ffe9a0';
              ctx.lineWidth = 2.5;
              ctx.stroke();
              ctx.restore();
            }
          } else {
            // Failure: ball stays briefly then disappears as mon pops out
            if (resultFrame < 6) {
              _drawBall(ctx, restX, restY, 6, 0, d.ballId);
            }
          }
        }
        break;
      }
      case 'CRIT_HIT': {
        const f2 = _specialFrame;
        if (f2 < 45) {
          const W = _cw(), H = _ch();
          // "CRITICAL!" text zoom-in then hold
          const textAge = f2 - 2;
          if (textAge >= 0 && textAge < 40) {
            const scale  = textAge < 8 ? 0.4 + 0.6 * (textAge / 8) : 1.0;
            const tAlpha = textAge < 8 ? textAge / 8 : (textAge > 30 ? 1 - (textAge - 30) / 10 : 1.0);
            ctx.save();
            ctx.globalAlpha = tAlpha;
            ctx.translate(W / 2, H * 0.38);
            ctx.scale(scale, scale);
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            // Shadow
            ctx.fillStyle = 'rgba(0,0,0,0.6)';
            ctx.font = 'bold 22px monospace';
            ctx.fillText('CRITICAL!', 2, 2);
            // Gold gradient text
            const tg = ctx.createLinearGradient(-60, -12, 60, 12);
            tg.addColorStop(0, '#FFD700');
            tg.addColorStop(0.5, '#FFEE88');
            tg.addColorStop(1, '#FF9900');
            ctx.fillStyle = tg;
            ctx.fillText('CRITICAL!', 0, 0);
            ctx.restore();
          }
        }
        break;
      }

      case 'LEVEL_UP': {
        const f3 = _specialFrame;
        const W2 = _cw(), H2 = _ch();
        // "LEVEL UP!" text + level number (appears at frame 5, fades at 45)
        if (f3 >= 5 && f3 < 55) {
          const textAge2 = f3 - 5;
          const tAlpha2  = textAge2 < 8 ? textAge2 / 8 : (textAge2 > 42 ? 1 - (textAge2 - 42) / 8 : 1.0);
          ctx.save();
          ctx.globalAlpha = tAlpha2;
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          // Shadow
          ctx.fillStyle = 'rgba(0,0,0,0.55)';
          ctx.font = 'bold 20px monospace';
          ctx.fillText('LEVEL UP!', W2 / 2 + 2, H2 * 0.38 + 2);
          // Gold gradient
          const lg2 = ctx.createLinearGradient(W2/2 - 50, H2*0.38 - 10, W2/2 + 50, H2*0.38 + 10);
          lg2.addColorStop(0, '#FFD700');
          lg2.addColorStop(0.5, '#FFFFFF');
          lg2.addColorStop(1, '#FFD700');
          ctx.fillStyle = lg2;
          ctx.fillText('LEVEL UP!', W2 / 2, H2 * 0.38);
          // Level number below
          ctx.font = 'bold 14px monospace';
          ctx.fillStyle = '#FFEE88';
          ctx.fillText(`Lv. ${d.level}`, W2 / 2, H2 * 0.38 + 20);
          ctx.textAlign = 'left';
          ctx.restore();
        }
        break;
      }

      case 'FAINT': {
        // Fade-out white overlay tied to the fainted mon position
        const pos   = d.side === 'PLAYER' ? PPOS : EPOS;
        const alpha = Math.max(0, 0.5 * (_specialFrame / _specialDur));
        ctx.save();
        ctx.globalAlpha = alpha;
        // Gradient over the mon
        const grad = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 35);
        grad.addColorStop(0, 'rgba(255,255,255,0.8)');
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(pos.x - 40, pos.y - 40, 80, 80);
        ctx.restore();
        break;
      }

      case 'STATUS_TICK': {
        // Draw a small colored aura ring around the affected mon
        const sPos  = (d.side === 'player') ? PPOS : EPOS;
        const pct   = _specialFrame / _specialDur; // 0→1
        const alpha = Math.max(0, 0.55 * (1 - pct));
        const colMap = {
          BURN:      '#FF5500',
          POISON:    '#AA44BB',
          BADPOISON: '#770099',
          PARALYSIS: '#DDCC00',
          FREEZE:    '#88CCFF',
        };
        const col = colMap[d.status] || '#FFFFFF';
        const r = 22 + pct * 12; // ring expands outward
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = col;
        ctx.lineWidth   = 3 - pct * 1.5;
        ctx.beginPath();
        ctx.ellipse(sPos.x, sPos.y, r, r * 0.65, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
        break;
      }
    }
  }

  // ── Ball colour palette ───────────────────────────────────
  // topColor = upper half, bottomColor = lower half, bandColor = centre band, btnColor = centre button
  const BALL_COLORS = {
    DINOBALL:     { top: '#dd2222', bottom: '#ffffff', band: '#222222', btn: '#ffffff' }, // classic red/white
    SUPERBALL:    { top: '#1155dd', bottom: '#ccddff', band: '#001133', btn: '#aaccff' }, // blue
    ULTRABALL:    { top: '#ddaa00', bottom: '#1a1a1a', band: '#000000', btn: '#ffdd44' }, // gold/black
    AMBERBALL:    { top: '#cc6600', bottom: '#ffe0a0', band: '#5c2a00', btn: '#ffcc55' }, // amber orange
    MASTERBALL:   { top: '#8800cc', bottom: '#ddc8ff', band: '#330055', btn: '#ff99ff' }, // purple
    DINOMASTERBALL:{ top: '#111111', bottom: '#222222', band: '#00ffcc', btn: '#00ffcc' }, // black/teal
  };

  // ── Draw a ball with per-type colours ────────────────────
  function _drawBall(ctx, x, y, r, angle, ballId) {
    const pal = BALL_COLORS[ballId] || BALL_COLORS.DINOBALL;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    // Top half
    ctx.beginPath();
    ctx.arc(0, 0, r, Math.PI, 0);
    ctx.fillStyle = pal.top;
    ctx.fill();

    // Bottom half
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI);
    ctx.fillStyle = pal.bottom;
    ctx.fill();

    // Outer border
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.strokeStyle = pal.band;
    ctx.lineWidth   = Math.max(0.6, r * 0.12);
    ctx.stroke();

    // Center band
    ctx.beginPath();
    ctx.moveTo(-r, 0);
    ctx.lineTo(r, 0);
    ctx.strokeStyle = pal.band;
    ctx.lineWidth   = Math.max(0.6, r * 0.15);
    ctx.stroke();

    // Center button (outer ring)
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.3, 0, Math.PI * 2);
    ctx.fillStyle   = pal.band;
    ctx.fill();

    // Center button (inner shine)
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.18, 0, Math.PI * 2);
    ctx.fillStyle = pal.btn;
    ctx.fill();

    ctx.restore();
  }

  // ════════════════════════════════════════════════════════════
  // PUBLIC API
  // ════════════════════════════════════════════════════════════

  function trigger(moveType, isPlayer, category, animStyle, power, moveId) {
    if (_active || _gapTimer > 0) {
      _animQueue.push({ moveType, isPlayer, category, animStyle, power, moveId });
    } else {
      _startAnim(moveType, isPlayer, category, animStyle, power, moveId);
    }
  }

  function clearQueue() {
    _animQueue  = [];
    _gapTimer   = 0;
    _active     = false;
    _particles  = [];
    _pOffset    = { x: 0, y: 0 };
    _eOffset    = { x: 0, y: 0 };
    _shake      = { x: 0, y: 0 };
    _flash      = { alpha: 0, color: '#ffffff' };
    _hitRings   = [];
    _specialAnim = null;
    _sig        = null;
    _sigPhase   = null;
    _cineBox    = 0;
    _cineBanner = { text: '', color: '#ffffff', alpha: 0 };
    _caughtBall = null; // FASE 7: verse battle = geen liggende bal
    _chargeVis = { player: null, enemy: null }; // FASE 9
    _fx = {}; _fxState = {}; // FASE 10
  }

  function isActive() {
    return _active || _gapTimer > 0 || _animQueue.length > 0 || !!_specialAnim || _hitRings.length > 0;
  }

  // Expose offsets/shake for spriteRenderer to use
  function getMonOffset(side) { return side === 'PLAYER' ? { ..._pOffset } : { ..._eOffset }; }
  function getShake()         { return { ..._shake }; }

  // ── Catch: mon shrinks into ball, pops back out on failure ───
  function isCatching() { return _specialAnim === 'CATCH'; }

  function getCatchMonScale() {
    // FASE 7: gevangen blijft gevangen — geen pop-out na de animatie
    if (_caughtBall) return 0;
    if (_specialAnim !== 'CATCH') return 1;
    const f  = _specialFrame;
    const d  = _specialData || {};
    const shakeStart = 10;
    const shakeEnd   = shakeStart + (d.shakes || 1) * 28;

    // Shrink: last 3 frames of throw phase (f 7→10 → scale 1→0)
    const shrinkFrom = shakeStart - 3;
    if (f < shrinkFrom)   return 1;
    if (f < shakeStart)   return Math.max(0, 1 - (f - shrinkFrom) / 3);

    // Inside ball during all shake frames
    if (f < shakeEnd)     return 0;

    // Failed catch: mon pops back out over 10 frames
    if (!d.caught) {
      const rf = f - shakeEnd;
      if (rf < 10) return rf / 10;
      return 1;
    }

    // Caught: stays invisible
    return 0;
  }

  return {
    trigger,
    triggerFaint,
    triggerCatch,
    triggerSwitchIn,
    triggerEnemySwitchIn,
    triggerBattleIntro,
    triggerAbilityFlash,
    triggerShiny,
    triggerMoveLearn,
    triggerCritHit,
    triggerLevelUp,
    triggerEffFlash,
    triggerMoneyPop,
    clearQueue,
    isActive,
    draw,
    update,
    // FASE 1: battle juice
    popDamage,
    getCamera,
    drawDamageNumbers,
    // Expose for spriteRenderer compatibility
    getMonOffset,
    getShake,
    isCatching,
    getCatchMonScale,
    triggerStatusTick,
    // FASE 4: intro-cinematics + signature-overlay
    getBattleIntroState,
    isBattleIntro,
    drawCinematics,
    // FASE 6: hit-reacties
    getHitReact,
    // FASE 9: charge-visual (Fly/Dig/Phantom Force)
    setChargeVisual,
    getChargeVisual,
  };

})();

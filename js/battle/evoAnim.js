// DinoMon: Fossil Frontier — evoAnim.js v2 "Fossil Awakening 2.0"
// Full-screen evolutie-cinematic (zie EVO-CINEMATIC-PLAN.md):
// evolutiekamer met platform + spotlight, versnellende oud↔nieuw-morph,
// stilte-beat + god-rays, wipe-reveal, stat-diff kaart en B-annulering.

window.DG = window.DG || {};

DG.EvoAnim = (function () {

  // ── Phase constants ───────────────────────────────────────
  const PH = {
    DARKEN : 0,   // kamer licht op: void, platform, spotlight, oude mon
    GLOW   : 1,   // amberen gloed pulseert, eerste witte flikkering
    PETRIFY: 2,   // mon versteent (grayscale kruipt erin)
    RUMBLE : 3,   // stenen vorm trilt, dramatische pauze
    MORPH  : 4,   // silhouet wisselt oud↔nieuw, versnellend; barsten groeien mee
    FLASH  : 5,   // stilte-beat → witte explosie + god-rays
    EMERGE : 6,   // nieuwe vorm van onder naar boven onthuld
    PULSE  : 7,   // energie-ringen + naam + cry + fanfare
    STATS  : 8,   // stat-diff kaart met optellende getallen
    FADE   : 9,   // alles vervaagt, spel hervat
    CANCEL : 10,  // B ingedrukt: evolutie sputtert uit
  };

  // Duration of each phase in frames (≈60fps); STATS heeft een lange failsafe
  // maar wordt normaal met Z afgesloten.
  const DUR = [40, 40, 55, 30, 150, 34, 65, 60, 300, 30, 50];

  const W = 480, H = 320;
  const CX = W / 2, CY = H / 2 - 10;   // sprite-anker (lokaal y=0 → voeten op CY+36*scale)
  const MON_SCALE = 3.0;
  const FEET_Y = CY + 36 * MON_SCALE;  // voetlijn van de sprite
  const PLAT_Y = FEET_Y + 8;           // platform-ellips net onder de voeten
  const ZOOM_CY = CY + 54;             // zoom-focuspunt (romp van de mon)

  // ── State ─────────────────────────────────────────────────
  let _active     = false;
  let _phase      = 0;
  let _frame      = 0;    // frame binnen huidige fase
  let _elapsed    = 0;    // frames sinds start (voor zoom/motes)
  let _oldId      = '';
  let _newId      = '';
  let _newName    = '';
  let _isShiny    = false;
  let _onComplete = null;
  let _opts       = {};
  let _cancelled  = false;
  let _lastCancelled = false; // resultaat van de vorige run (voor polling door battle.js)

  let _cracks = [];
  let _particles = [];
  let _rings = [];
  let _motes = [];
  let _shakeX = 0, _shakeY = 0;
  let _pulseShake = 0;      // korte shake-puls per morph-tik

  // Morph-fase state
  let _morphShowNew  = false;
  let _morphNextSwap = 0;
  let _morphBounce   = 0;   // 10 → 0 na elke swap (squash & stretch)
  let _flashFired    = false;

  // ── Easing ────────────────────────────────────────────────
  function _ease(t) { return t < 0.5 ? 2*t*t : -1+(4-2*t)*t; }
  function _easeOut(t) { return 1 - (1-t)*(1-t); }
  function _clamp(v,a,b) { return v < a ? a : v > b ? b : v; }

  // ── Type-kleuren (ringen + platform in PULSE) ─────────────
  const TYPE_RGBA = {
    FIRE:'rgba(255,100,30,', WATER:'rgba(60,160,255,',
    GRASS:'rgba(80,220,80,', ROCK:'rgba(180,140,80,',
    DRAGON:'rgba(100,60,220,', GROUND:'rgba(200,160,60,',
    PSYCHIC:'rgba(220,80,180,', ELECTRIC:'rgba(255,230,30,',
    ICE:'rgba(160,230,255,', DARK:'rgba(80,60,120,',
    STEEL:'rgba(160,180,200,', FIGHTING:'rgba(200,60,60,',
    GHOST:'rgba(120,80,180,', FAIRY:'rgba(255,140,200,',
    POISON:'rgba(160,60,200,', BUG:'rgba(140,200,60,',
    FLYING:'rgba(120,180,255,', NORMAL:'rgba(200,200,160,',
  };
  function _newTypeCol(alpha) {
    const sp = DG.SPECIES && DG.SPECIES[_newId];
    const type = sp && sp.types && sp.types[0];
    return (TYPE_RGBA[type] || 'rgba(200,220,255,') + alpha + ')';
  }

  // ── Generatie-helpers ─────────────────────────────────────
  function _genCrack() {
    const baseAngle = Math.random() * Math.PI * 2;
    const length    = 35 + Math.random() * 55;
    const steps     = 3 + Math.floor(Math.random() * 4);
    const pts       = [{ x: CX, y: CY + 50 }];
    let px = CX, py = CY + 50;
    for (let s = 0; s < steps; s++) {
      const a = baseAngle + (Math.random() - 0.5) * 0.55;
      const d = length / steps;
      px += Math.cos(a) * d;
      py += Math.sin(a) * d;
      pts.push({ x: px, y: py });
    }
    _cracks.push(pts);
  }

  function _genParticles() {
    _particles = [];
    for (let i = 0; i < 38; i++) {
      const angle  = Math.random() * Math.PI * 2;
      const speed  = 1.5 + Math.random() * 6;
      const size   = 4 + Math.random() * 10;
      const grey   = Math.floor(80 + Math.random() * 120);
      _particles.push({
        x: CX + (Math.random() - 0.5) * 30,
        y: CY + 50 + (Math.random() - 0.5) * 20,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        w: size, h: size * (0.5 + Math.random() * 0.8),
        rot: Math.random() * Math.PI * 2,
        rotV: (Math.random() - 0.5) * 0.25,
        color: `rgb(${grey},${grey},${grey})`,
        alpha: 1.0,
      });
    }
  }

  function _genMotes() {
    _motes = [];
    for (let i = 0; i < 26; i++) {
      _motes.push({
        x: Math.random() * W,
        y: 40 + Math.random() * (H - 60),
        vy: -(0.12 + Math.random() * 0.3),
        r: 0.8 + Math.random() * 1.6,
        tw: Math.random() * Math.PI * 2,       // twinkle-fase
        twV: 0.03 + Math.random() * 0.05,
      });
    }
  }

  // ── Draw-helpers ──────────────────────────────────────────
  function _drawMonEx(ctx, speciesId, filter, alpha, sx, sy) {
    if (!DG.SpriteRenderer || !DG.SpriteRenderer.drawMon) return;
    ctx.save();
    ctx.globalAlpha = _clamp(alpha, 0, 1);
    const shinyF = _isShiny ? 'hue-rotate(180deg) saturate(2)' : '';
    const f = (shinyF && filter) ? (shinyF + ' ' + filter) : (shinyF || filter);
    if (f) ctx.filter = f;
    if (sx !== undefined && (sx !== 1 || sy !== 1)) {
      // Squash & stretch rond de voetlijn zodat de mon "op het platform" blijft
      ctx.translate(CX, FEET_Y);
      ctx.scale(sx, sy);
      ctx.translate(-CX, -FEET_Y);
    }
    DG.SpriteRenderer.drawMon(ctx, speciesId, CX, CY, MON_SCALE);
    ctx.filter = 'none';
    ctx.restore();
  }
  function _drawMon(ctx, speciesId, filter, alpha) {
    _drawMonEx(ctx, speciesId, filter, alpha, 1, 1);
  }

  // Fase B: void-achtergrond — donkerblauwe gradient i.p.v. plat zwart
  function _drawVoid(ctx, alpha) {
    ctx.save();
    ctx.globalAlpha = _clamp(alpha, 0, 1);
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0.0, '#04060f');
    g.addColorStop(0.55, '#0a1226');
    g.addColorStop(1.0, '#050810');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }

  // Fase B: platform-ellips + spotlight-kegel. colMix 0..1 mengt amber → typekleur.
  function _drawChamber(ctx, alpha, glowPulse, colMix) {
    ctx.save();
    ctx.globalAlpha = _clamp(alpha, 0, 1);

    // Spotlight-kegel van boven
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const cone = ctx.createLinearGradient(0, -10, 0, PLAT_Y);
    cone.addColorStop(0, 'rgba(255,240,200,0.10)');
    cone.addColorStop(1, 'rgba(255,200,90,0.03)');
    ctx.fillStyle = cone;
    ctx.beginPath();
    ctx.moveTo(CX - 34, -10);
    ctx.lineTo(CX + 34, -10);
    ctx.lineTo(CX + 105, PLAT_Y);
    ctx.lineTo(CX - 105, PLAT_Y);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Gloeiende pool op het platform
    const pr = 85 + (glowPulse || 0) * 10;
    const amber = { r: 255, g: 170, b: 60 };
    let col = amber;
    if (colMix > 0) {
      // Meng amber met de eerste typekleur van de nieuwe vorm
      const m = _newTypeCol('1').match(/rgba\((\d+),(\d+),(\d+)/);
      if (m) {
        col = {
          r: Math.round(amber.r + (parseInt(m[1]) - amber.r) * colMix),
          g: Math.round(amber.g + (parseInt(m[2]) - amber.g) * colMix),
          b: Math.round(amber.b + (parseInt(m[3]) - amber.b) * colMix),
        };
      }
    }
    ctx.save();
    ctx.translate(CX, PLAT_Y);
    ctx.scale(1, 0.26);
    const pool = ctx.createRadialGradient(0, 0, 6, 0, 0, pr);
    pool.addColorStop(0.0, `rgba(${col.r},${col.g},${col.b},0.55)`);
    pool.addColorStop(0.55, `rgba(${col.r},${col.g},${col.b},0.22)`);
    pool.addColorStop(1.0, `rgba(${col.r},${col.g},${col.b},0)`);
    ctx.fillStyle = pool;
    ctx.beginPath();
    ctx.arc(0, 0, pr, 0, Math.PI * 2);
    ctx.fill();
    // Heldere rand-ring van het platform
    ctx.strokeStyle = `rgba(${col.r},${col.g},${col.b},${0.5 + (glowPulse || 0) * 0.3})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, 72, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    ctx.restore();
  }

  // Fase B: zwevende stofdeeltjes (richting omkeerbaar voor CANCEL)
  function _drawMotes(ctx, alpha, falling) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (const m of _motes) {
      m.y += falling ? -m.vy * 2 : m.vy;
      m.tw += m.twV;
      if (m.y < 20) { m.y = H - 30; m.x = Math.random() * W; }
      if (m.y > H - 10) { m.y = 40; m.x = Math.random() * W; }
      const a = _clamp(alpha, 0, 1) * (0.35 + 0.35 * Math.sin(m.tw));
      if (a <= 0) continue;
      ctx.globalAlpha = a;
      ctx.fillStyle = 'rgba(255,220,140,1)';
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function _drawAmberGlow(ctx, radius, alpha) {
    ctx.save();
    ctx.globalAlpha = _clamp(alpha, 0, 1);
    const g = ctx.createRadialGradient(CX, CY + 50, 8, CX, CY + 50, radius);
    g.addColorStop(0.0, 'rgba(255,200,80,0.85)');
    g.addColorStop(0.5, 'rgba(255,140,30,0.35)');
    g.addColorStop(1.0, 'rgba(255,100,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }

  function _drawWhiteFlash(ctx, alpha) {
    ctx.save();
    ctx.globalAlpha = _clamp(alpha, 0, 1);
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }

  // Fase C: god-rays — roterende lichtstralen vanuit het centrum
  function _drawGodRays(ctx, alpha, rot) {
    if (alpha <= 0) return;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = _clamp(alpha, 0, 1);
    ctx.translate(CX, CY + 40);
    ctx.rotate(rot);
    const RAYS = 12, LEN = 340;
    for (let i = 0; i < RAYS; i++) {
      const a = (Math.PI * 2 / RAYS) * i;
      const halfW = 0.06 + (i % 3) * 0.02; // wisselende straalbreedtes
      const g = ctx.createLinearGradient(0, 0, Math.cos(a) * LEN, Math.sin(a) * LEN);
      g.addColorStop(0, 'rgba(255,245,200,0.55)');
      g.addColorStop(1, 'rgba(255,220,120,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, LEN, a - halfW, a + halfW);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  function _drawCracksCount(ctx, shown) {
    ctx.save();
    ctx.lineCap = 'round';
    for (let ci = 0; ci < Math.min(shown, _cracks.length); ci++) {
      const pts = _cracks[ci];
      ctx.strokeStyle = 'rgba(255,230,100,0.35)';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let pi = 1; pi < pts.length; pi++) ctx.lineTo(pts[pi].x, pts[pi].y);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(255,255,200,0.95)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let pi = 1; pi < pts.length; pi++) ctx.lineTo(pts[pi].x, pts[pi].y);
      ctx.stroke();
    }
    ctx.restore();
  }

  function _updateParticles() {
    for (const p of _particles) {
      p.x   += p.vx;
      p.y   += p.vy;
      p.vy  += 0.18;
      p.vx  *= 0.97;
      p.rot += p.rotV;
      p.alpha = Math.max(0, p.alpha - 0.018);
    }
  }

  function _drawParticles(ctx) {
    ctx.save();
    for (const p of _particles) {
      if (p.alpha <= 0) continue;
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle   = p.color;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
      ctx.restore();
    }
    ctx.restore();
  }

  function _drawRings(ctx) {
    ctx.save();
    for (const r of _rings) {
      ctx.globalAlpha = _clamp(r.alpha, 0, 1);
      ctx.strokeStyle = r.color;
      ctx.lineWidth   = r.width;
      ctx.beginPath();
      ctx.arc(CX, CY + 40, r.radius, 0, Math.PI * 2);
      ctx.stroke();
      r.radius += r.speed;
      r.alpha  -= 0.025;
      r.width  *= 0.96;
    }
    _rings = _rings.filter(r => r.alpha > 0);
    ctx.restore();
  }

  function _addRing(color, speed, width) {
    _rings.push({ radius: 30, alpha: 0.9, color, speed: speed || 4, width: width || 3 });
  }

  function _drawNameText(ctx, alpha) {
    if (!_newName) return;
    ctx.save();
    ctx.globalAlpha = _clamp(alpha, 0, 1);
    const text = `${_newName}!`;
    ctx.font = 'bold 22px monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillText(text, CX + 2, H - 44 + 2);
    ctx.fillStyle = '#fff';
    ctx.fillText(text, CX, H - 44);
    ctx.restore();
  }

  // Fase A: stat-diff kaart — optellende getallen in twee kolommen
  function _drawStatCard(ctx, countT, promptOn) {
    const d = _opts.statDiff;
    if (!d) return;
    const rows = [
      ['HP',   d.hp],   ['ATK',  d.atk],  ['DEF',  d.def],
      ['SP.A', d.spAtk],['SP.D', d.spDef],['SPD',  d.spd],
    ];
    const PX = 90, PY = 34, PW = 300, PHh = 112;
    ctx.save();
    // Paneel
    ctx.globalAlpha = 0.92;
    ctx.fillStyle = 'rgba(6,10,22,0.88)';
    ctx.strokeStyle = 'rgba(255,200,90,0.8)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(PX, PY, PW, PHh, 8);
    else ctx.rect(PX, PY, PW, PHh);
    ctx.fill();
    ctx.stroke();
    // Titel
    ctx.globalAlpha = 1;
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255,220,120,0.95)';
    ctx.fillText('— POWER GAINED —', CX, PY + 18);
    // EVO-STAGE: bereikte stage in de lijn (bv. STAGE 2/3)
    if (DG.EvoChain) {
      const ei = DG.EvoChain.get(_newId);
      if (ei && ei.total > 1) {
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'right';
        ctx.fillStyle = 'rgba(240,192,96,0.9)';
        ctx.fillText(`STAGE ${ei.stage}/${ei.total}`, PX + PW - 10, PY + 8);
        if (DG.UIKit && DG.UIKit.drawStagePips) {
          DG.UIKit.drawStagePips(ctx, PX + 10, PY + 7, _newId, { size: 6, gap: 3 });
        }
        ctx.textAlign = 'center';
      }
    }
    // Twee kolommen van drie stats
    ctx.font = 'bold 13px monospace';
    const e = _easeOut(_clamp(countT, 0, 1));
    for (let i = 0; i < rows.length; i++) {
      const col = i < 3 ? 0 : 1;
      const row = i % 3;
      const x = PX + 26 + col * 150;
      const y = PY + 44 + row * 22;
      const val = Math.round((rows[i][1] || 0) * e);
      ctx.textAlign = 'left';
      ctx.fillStyle = '#cfd8ea';
      ctx.fillText(rows[i][0], x, y);
      ctx.textAlign = 'right';
      ctx.fillStyle = val >= 0 ? '#7dff9a' : '#ff8a7d';
      ctx.fillText((val >= 0 ? '+' : '') + val, x + 118, y);
    }
    // Doorgaan-prompt
    if (promptOn && Math.floor(_elapsed / 18) % 2 === 0) {
      ctx.font = '11px monospace';
      ctx.textAlign = 'right';
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      ctx.fillText('Z ▶', PX + PW - 10, PY + PHh - 8);
    }
    ctx.restore();
  }

  // Fase E: "B = stop" hint tijdens het annuleerbare venster
  function _drawCancelHint(ctx) {
    if (_opts.cancellable === false) return;
    // Zichtbaar tijdens DARKEN+GLOW, daarna uitgefade
    const t = _elapsed;
    let a = 0;
    if (t < 30)       a = t / 30;
    else if (t < 110) a = 1;
    else if (t < 140) a = 1 - (t - 110) / 30;
    if (a <= 0) return;
    ctx.save();
    ctx.globalAlpha = a * 0.75;
    ctx.font = '10px monospace';
    ctx.textAlign = 'right';
    ctx.fillStyle = '#fff';
    ctx.fillText('B: stop', W - 8, H - 32);
    ctx.restore();
  }

  // ── Zoom (Fase B): langzame camera-beweging over de sequence ──
  function _zoomFactor() {
    if (_phase <= PH.FLASH) {
      // Traag inzoomen richting de climax
      const total = DUR[0] + DUR[1] + DUR[2] + DUR[3] + DUR[4] + DUR[5];
      return 1 + 0.12 * _clamp(_elapsed / total, 0, 1);
    }
    if (_phase === PH.EMERGE) {
      // Terugtrekken bij de reveal
      const t = _frame / DUR[PH.EMERGE];
      return 1.12 - 0.12 * _easeOut(t);
    }
    return 1.0;
  }

  // ── Audio-koppeling (Fase D) — alles optioneel/try-catch ──
  function _audio(fn, ...args) {
    try { if (DG.Audio && DG.Audio[fn]) DG.Audio[fn](...args); } catch(e) {}
  }

  // ── Fase-overgangen ───────────────────────────────────────
  function _enterPhase(p) {
    _phase = p;
    _frame = 0;
    if (p === PH.MORPH) {
      _cracks = [];
      _morphShowNew  = false;
      _morphNextSwap = 0;
      _morphBounce   = 0;
    }
    if (p === PH.FLASH) {
      _flashFired = false;
      _audio('stopEvoTension');   // stilte-beat vóór de klap
    }
    if (p === PH.EMERGE) { _rings = []; }
    if (p === PH.PULSE) {
      _rings = [];
      _addRing('rgba(255,255,255,0.9)', 7, 5);
      _addRing('rgba(255,255,255,0.6)', 5, 3);
      _audio('playEvolution');
      _audio('playCry', _newId);
    }
    if (p === PH.CANCEL) {
      _cancelled = true;
      _audio('stopEvoTension');
      _audio('playEvoCancel');
    }
  }

  function _finish() {
    _active = false;
    _lastCancelled = _cancelled;
    _audio('stopEvoTension'); // failsafe: nooit een lopende tension-loop achterlaten
    if (_onComplete) {
      const cb = _onComplete;
      _onComplete = null;
      try { cb(_cancelled); } catch(e) {}
    }
  }

  function _advanceFrame() {
    _frame++;
    _elapsed++;
    if (_frame < DUR[_phase]) return;
    // Fase voorbij → volgende
    if (_phase === PH.FADE || _phase === PH.CANCEL) { _finish(); return; }
    let next = _phase + 1;
    // STATS overslaan als er geen stat-diff is meegegeven
    if (next === PH.STATS && !_opts.statDiff) next = PH.FADE;
    _enterPhase(next);
  }

  // ── Main draw — called every frame from renderer ──────────
  function draw(ctx) {
    if (!_active) return;

    // Fase E: B annuleert zolang de oude vorm nog bestaat (t/m MORPH)
    if (_opts.cancellable !== false && _phase <= PH.MORPH &&
        DG.Input && DG.Input.isPressed && DG.Input.isPressed('B')) {
      _enterPhase(PH.CANCEL);
    }

    const t  = _frame / DUR[_phase];
    const et = _ease(t);

    ctx.save();

    // ── Achtergrond (ongezoomd, dekt alles af) ─────────────
    let bgA = 1;
    if (_phase === PH.DARKEN) bgA = et;
    ctx.save();
    ctx.globalAlpha = _phase === PH.DARKEN ? et : 1;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
    _drawVoid(ctx, bgA);

    // ── Gezoomde kamer-laag ────────────────────────────────
    const z = _zoomFactor();
    ctx.save();
    ctx.translate(CX + _shakeX, ZOOM_CY + _shakeY);
    ctx.scale(z, z);
    ctx.translate(-CX, -ZOOM_CY);

    // ── Phase 0: DARKEN — de kamer licht op ────────────────
    if (_phase === PH.DARKEN) {
      _drawChamber(ctx, et, 0, 0);
      _drawMotes(ctx, et * 0.7, false);
      _drawAmberGlow(ctx, 60 + et * 40, et * 0.35);
      _drawMon(ctx, _oldId, null, et);
      _audio('setEvoTensionRate', 0.08);
    }

    // ── Phase 1: GLOW ──────────────────────────────────────
    else if (_phase === PH.GLOW) {
      const pulse = Math.sin(_frame * 0.22) * 0.15;
      _drawChamber(ctx, 1, pulse, 0);
      _drawMotes(ctx, 0.8, false);
      _drawAmberGlow(ctx, 95 + pulse * 30, 0.5 + pulse);
      _drawMon(ctx, _oldId, null, 1.0);
      // Eerste witte flikkering — nog traag, alleen de oude vorm
      const flick = Math.max(0, Math.sin(_frame * (0.14 + t * 0.2)));
      if (flick > 0.5) {
        _drawMon(ctx, _oldId, 'brightness(10) saturate(0)', flick * 0.35);
      }
      // Gouden lichtspiraal die naar binnen draait
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (let s = 0; s < 6; s++) {
        const a = _frame * 0.16 + (s / 6) * Math.PI * 2;
        const r = 95 - t * 55 - s * 4;
        if (r < 12) continue;
        const sx2 = CX + Math.cos(a) * r;
        const sy2 = CY + 50 + Math.sin(a) * r * 0.7;
        const g2 = ctx.createRadialGradient(sx2, sy2, 0, sx2, sy2, 7);
        g2.addColorStop(0, 'rgba(255,235,150,0.9)');
        g2.addColorStop(1, 'rgba(255,200,60,0)');
        ctx.fillStyle = g2;
        ctx.fillRect(sx2 - 8, sy2 - 8, 16, 16);
      }
      ctx.restore();
      _audio('setEvoTensionRate', 0.15 + t * 0.1);
    }

    // ── Phase 2: PETRIFY ───────────────────────────────────
    else if (_phase === PH.PETRIFY) {
      _drawChamber(ctx, 1, 0, 0);
      _drawMotes(ctx, 0.7, false);
      const glowFade = 1 - et;
      _drawAmberGlow(ctx, 95, glowFade * 0.45);
      _drawMon(ctx, _oldId, null, 1 - et * 0.7);
      const grey = Math.floor(60 + (1 - et) * 40);
      _drawMon(
        ctx, _oldId,
        `grayscale(1) brightness(${0.4 + 0.3 * (1-et)}) contrast(1.3) sepia(0.4)`,
        et
      );
      ctx.save();
      ctx.globalAlpha = et * 0.12;
      ctx.fillStyle = `rgb(${grey},${grey},${grey})`;
      ctx.fillRect(CX - 85, CY - 35, 170, 170);
      ctx.restore();
      _audio('setEvoTensionRate', 0.28 + t * 0.1);
    }

    // ── Phase 3: RUMBLE ────────────────────────────────────
    else if (_phase === PH.RUMBLE) {
      _shakeX = (Math.random() - 0.5) * 6 * (1 - et);
      _shakeY = (Math.random() - 0.5) * 4 * (1 - et);
      _drawChamber(ctx, 1, 0.1, 0);
      _drawMotes(ctx, 0.7, false);
      _drawMon(ctx, _oldId, 'grayscale(1) brightness(0.45) contrast(1.4)', 1.0);
      ctx.save();
      ctx.globalAlpha = 0.10 + Math.random() * 0.06;
      ctx.fillStyle = '#aaa';
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
      _audio('setEvoTensionRate', 0.42);
    }

    // ── Phase 4: MORPH — het kern-shot ─────────────────────
    else if (_phase === PH.MORPH) {
      // Versnellend swap-ritme: interval 26 → 6 frames
      if (_frame >= _morphNextSwap) {
        _morphShowNew = !_morphShowNew;
        _morphBounce  = 10;
        _pulseShake   = 6;
        if (_cracks.length < 20) _genCrack();
        _audio('playEvoMorphTick', t);
        const interval = Math.max(6, Math.round(26 - 22 * t));
        _morphNextSwap = _frame + interval;
      }
      if (_pulseShake > 0) {
        _shakeX = (Math.random() - 0.5) * _pulseShake * 0.9;
        _shakeY = (Math.random() - 0.5) * _pulseShake * 0.6;
        _pulseShake--;
      } else { _shakeX = 0; _shakeY = 0; }
      if (_morphBounce > 0) _morphBounce--;

      _drawChamber(ctx, 1, 0.2 + t * 0.4, 0);
      _drawMotes(ctx, 0.8, false);
      _drawAmberGlow(ctx, 90 + t * 40, 0.35 + t * 0.5);

      // Stenen basis van de oude vorm blijft zichtbaar onder het silhouet
      _drawMon(ctx, _oldId, 'grayscale(1) brightness(0.45) contrast(1.4)', 0.9 - t * 0.5);

      // Wit silhouet, wisselend tussen oud en nieuw, met squash & stretch
      const bounceT = 1 - _morphBounce / 10;
      const pop = 1.12 - 0.12 * _easeOut(bounceT);
      const squash = 0.92 + 0.08 * _easeOut(bounceT);
      // De nieuwe vorm "groeit" over de fase heen naar volle grootte
      const grow = _morphShowNew ? (0.84 + 0.16 * t) : 1.0;
      _drawMonEx(
        ctx, _morphShowNew ? _newId : _oldId,
        'brightness(10) saturate(0)', 0.92,
        pop * grow, squash * grow
      );

      _drawCracksCount(ctx, _cracks.length);
      // Gloed uit de barsten
      ctx.save();
      ctx.globalAlpha = t * 0.30;
      const cg = ctx.createRadialGradient(CX, CY + 50, 0, CX, CY + 50, 100);
      cg.addColorStop(0, 'rgba(255,240,150,1)');
      cg.addColorStop(1, 'rgba(255,200,50,0)');
      ctx.fillStyle = cg;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();

      _audio('setEvoTensionRate', 0.45 + 0.55 * t);
    }

    // ── Phase 5: FLASH — stilte-beat, dan de klap ──────────
    else if (_phase === PH.FLASH) {
      _shakeX = 0; _shakeY = 0;
      const FREEZE = 6; // frames bevroren stilte vóór de explosie
      _drawChamber(ctx, 1, 0.6, 0);
      if (_frame < FREEZE) {
        // Bevroren beeld, iets gedimd — de adem-inhoud-pauze
        _drawMon(ctx, _oldId, 'grayscale(1) brightness(0.4) contrast(1.4)', 0.8);
        _drawMonEx(ctx, _newId, 'brightness(10) saturate(0)', 0.92, 1, 1);
        _drawCracksCount(ctx, _cracks.length);
      } else {
        if (!_flashFired) {
          _flashFired = true;
          _genParticles();
          _audio('playEvoFlash');
          _addRing('rgba(255,240,160,0.9)', 6, 4);
          _addRing('rgba(255,200,80,0.6)',  4, 6);
        }
        _drawParticles(ctx);
        _updateParticles();
        const ft = (_frame - FREEZE) / (DUR[PH.FLASH] - FREEZE);
        const flashA = ft < 0.35 ? ft / 0.35 : 1;
        _drawGodRays(ctx, (1 - flashA) * 0.4 + 0.2, _elapsed * 0.01);
        _drawWhiteFlash(ctx, _ease(flashA));
        if (_frame === FREEZE + 3 || _frame === FREEZE + 7) {
          _addRing('rgba(255,240,160,0.9)', 6, 4);
        }
        _drawRings(ctx);
      }
    }

    // ── Phase 6: EMERGE — wipe-reveal van onder naar boven ─
    else if (_phase === PH.EMERGE) {
      _drawChamber(ctx, 1, 0.4 * (1 - t) + 0.15, t * 0.5);
      _drawMotes(ctx, 0.8, false);
      _updateParticles();
      _drawParticles(ctx);
      _drawGodRays(ctx, (1 - t) * 0.5, _elapsed * 0.008);

      // Silhouet dat van onder naar boven inkleurt
      const wipeT = _clamp((t - 0.12) / 0.72, 0, 1);
      _drawMonEx(ctx, _newId, 'brightness(10) saturate(0)', 1 - wipeT * wipeT, 1, 1);
      if (wipeT > 0) {
        const monTop = CY - 10, monBot = FEET_Y + 6;
        const hgt = (monBot - monTop) * _easeOut(wipeT);
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, monBot - hgt, W, hgt + 4);
        ctx.clip();
        _drawMon(ctx, _newId, wipeT < 0.9 ? `brightness(${1 + (1 - wipeT) * 2})` : null, 1);
        ctx.restore();
        // Glinsterlijn op de wipe-rand
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = 0.7 * (1 - wipeT * 0.5);
        ctx.fillStyle = 'rgba(255,250,220,1)';
        ctx.fillRect(CX - 70, monBot - hgt - 1, 140, 2);
        ctx.restore();
      }
      if (_frame === 20 || _frame === 35 || _frame === 50) {
        _addRing('rgba(200,240,255,0.7)', 5, 3);
      }
      _drawRings(ctx);
      // Witte na-flits ebt weg
      if (t < 0.4) _drawWhiteFlash(ctx, 1 - t / 0.4);
    }

    // ── Phase 7: PULSE — de reveal viert zichzelf ──────────
    else if (_phase === PH.PULSE) {
      _drawChamber(ctx, 1, 0.3 + Math.sin(_frame * 0.15) * 0.15, 1);
      _drawMotes(ctx, 0.9, false);
      _drawMon(ctx, _newId, null, 1.0);
      _drawRings(ctx);
      if (_frame % 18 === 0) {
        _addRing(_newTypeCol('0.7'), 4 + Math.random() * 3, 2 + Math.random() * 3);
      }
    }

    // ── Phase 8: STATS — de winst in cijfers ───────────────
    else if (_phase === PH.STATS) {
      _drawChamber(ctx, 1, 0.2, 1);
      _drawMotes(ctx, 0.6, false);
      _drawMon(ctx, _newId, 'brightness(0.85)', 1.0);
      _drawRings(ctx);
      if (_frame % 30 === 0) _addRing(_newTypeCol('0.4'), 3, 2);
      // Z sluit de kaart (na een minimum zodat hij niet per ongeluk wegklikt)
      if (_frame >= 40 && DG.Input && DG.Input.isPressed && DG.Input.isPressed('A')) {
        _enterPhase(PH.FADE);
      }
    }

    // ── Phase 9: FADE ──────────────────────────────────────
    else if (_phase === PH.FADE) {
      ctx.globalAlpha = 1 - et;
      _drawChamber(ctx, 1, 0.15, 1);
      _drawMon(ctx, _newId, null, 1);
      _drawRings(ctx);
      ctx.globalAlpha = 1;
    }

    // ── Phase 10: CANCEL — de evolutie sputtert uit ────────
    else if (_phase === PH.CANCEL) {
      _shakeX = 0; _shakeY = 0;
      _drawChamber(ctx, 1 - et * 0.7, 0, 0);
      _drawMotes(ctx, (1 - et) * 0.6, true); // stof dwarrelt omlaag
      _drawAmberGlow(ctx, 90 * (1 - et) + 15, (1 - et) * 0.4);
      // Steen/silhouet lost op, de gewone oude vorm keert terug
      _drawMon(ctx, _oldId, 'grayscale(1) brightness(0.45) contrast(1.4)', 1 - et);
      _drawMon(ctx, _oldId, null, et);
      _drawCracksCount(ctx, Math.floor(_cracks.length * (1 - et)));
    }

    ctx.restore(); // einde zoom-laag

    // ── Ongezoomde overlays ────────────────────────────────
    if (_phase === PH.PULSE || _phase === PH.STATS) {
      const textAlpha = _phase === PH.STATS ? 1 : _clamp((t - 0.25) / 0.4, 0, 1);
      _drawNameText(ctx, textAlpha);
    }
    if (_phase === PH.STATS) {
      _drawStatCard(ctx, _frame / 40, _frame >= 50);
    }
    _drawCancelHint(ctx);

    // Cinematische letterbox om de hele sequence (in/uit met easing)
    {
      let lb = 1;
      if (_phase === PH.DARKEN) lb = et;
      else if (_phase === PH.FADE) lb = 1 - et;
      const bh = Math.round(26 * lb);
      if (bh > 0) {
        ctx.fillStyle = 'rgba(2,4,10,0.95)';
        ctx.fillRect(0, 0, W, bh);
        ctx.fillRect(0, H - bh, W, bh);
      }
    }

    ctx.restore();

    // Frame vooruit; Z (vasthouden) verdubbelt de snelheid t/m PULSE
    _advanceFrame();
    if (_active && _phase < PH.STATS &&
        DG.Input && DG.Input.isHeld && DG.Input.isHeld('A')) {
      _advanceFrame();
    }
  }

  // ── Public API ────────────────────────────────────────────
  // opts: { statDiff: {hp,atk,def,spAtk,spDef,spd} | null, cancellable: bool }
  function start(oldSpeciesId, newSpeciesId, onComplete, isShiny, opts) {
    const sp    = DG.SPECIES && DG.SPECIES[newSpeciesId];
    _oldId      = oldSpeciesId;
    _newId      = newSpeciesId;
    _newName    = sp ? sp.name : newSpeciesId;
    _isShiny    = !!isShiny;
    _onComplete = onComplete || null;
    _opts       = opts || {};
    _cancelled  = false;
    _frame      = 0;
    _elapsed    = 0;
    _phase      = PH.DARKEN;
    _cracks     = [];
    _particles  = [];
    _rings      = [];
    _shakeX     = 0; _shakeY = 0;
    _pulseShake = 0;
    _morphShowNew = false;
    _morphNextSwap = 0;
    _morphBounce = 0;
    _flashFired = false;
    _genMotes();
    _active     = true;
    _audio('playEvoTension');
  }

  function isActive() { return _active; }
  // Resultaat van de laatst afgeronde run — battle.js pollt dit na isActive()
  function wasCancelled() { return _lastCancelled; }

  return { start, draw, isActive, wasCancelled };

})();

// DinoMon: Fossil Frontier — evoAnim.js v1
// Full-screen "Fossil Awakening" evolution animation

window.DG = window.DG || {};

DG.EvoAnim = (function () {

  // ── Phase constants ───────────────────────────────────────
  const PH = {
    DARKEN  : 0,   // screen goes dark, old mon appears large + amber glow
    GLOW    : 1,   // glow pulses, old mon brightens
    PETRIFY : 2,   // mon turns to stone (grayscale creeps in)
    RUMBLE  : 3,   // stone form shakes, dramatic pause
    CRACK   : 4,   // crack lines appear
    FLASH   : 5,   // white explosion across entire screen
    EMERGE  : 6,   // new form rises from light
    PULSE   : 7,   // energy rings + name text
    FADE    : 8,   // everything fades, game resumes
  };

  // Duration of each phase in frames (≈60fps)
  const DUR = [35, 40, 55, 30, 35, 22, 65, 55, 30];

  const W = 480, H = 320;
  const CX = W / 2, CY = H / 2 - 10;  // sprite center
  const MON_SCALE = 3.0;               // how large the mon appears

  // ── State ─────────────────────────────────────────────────
  let _active    = false;
  let _phase     = 0;
  let _frame     = 0;   // frame within current phase
  let _oldId     = '';
  let _newId     = '';
  let _newName   = '';
  let _isShiny   = false;
  let _onComplete= null;

  // Procedural crack lines
  let _cracks = [];
  // Stone chunk particles
  let _particles = [];
  // Pulse rings
  let _rings = [];
  // Rumble offset
  let _shakeX = 0, _shakeY = 0;

  // ── Easing ────────────────────────────────────────────────
  function _ease(t) { return t < 0.5 ? 2*t*t : -1+(4-2*t)*t; }
  function _easeOut(t) { return 1 - (1-t)*(1-t); }
  function _clamp(v,a,b) { return v < a ? a : v > b ? b : v; }

  // ── Generate cracks ───────────────────────────────────────
  function _genCracks() {
    _cracks = [];
    const NUM = 14;
    for (let i = 0; i < NUM; i++) {
      const baseAngle = (Math.PI * 2 / NUM) * i + (Math.random() - 0.5) * 0.25;
      const length    = 35 + Math.random() * 55;
      const steps     = 3 + Math.floor(Math.random() * 4);
      const pts       = [{ x: CX, y: CY }];
      let px = CX, py = CY;
      for (let s = 0; s < steps; s++) {
        const a = baseAngle + (Math.random() - 0.5) * 0.55;
        const d = length / steps;
        px += Math.cos(a) * d;
        py += Math.sin(a) * d;
        pts.push({ x: px, y: py });
      }
      _cracks.push(pts);
    }
  }

  // ── Generate particles ────────────────────────────────────
  function _genParticles() {
    _particles = [];
    for (let i = 0; i < 38; i++) {
      const angle  = Math.random() * Math.PI * 2;
      const speed  = 1.5 + Math.random() * 6;
      const size   = 4 + Math.random() * 10;
      const grey   = Math.floor(80 + Math.random() * 120);
      _particles.push({
        x: CX + (Math.random() - 0.5) * 30,
        y: CY + (Math.random() - 0.5) * 20,
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

  // ── Draw helpers ──────────────────────────────────────────
  function _drawMon(ctx, speciesId, filter, alpha) {
    if (!DG.SpriteRenderer || !DG.SpriteRenderer.drawMon) return;
    ctx.save();
    ctx.globalAlpha = _clamp(alpha, 0, 1);
    // Shiny mons keep their hue-shifted palette through the whole animation.
    // Prepended so grayscale/flash phases still override the colour as before.
    const shinyF = _isShiny ? 'hue-rotate(180deg) saturate(2)' : '';
    const f = (shinyF && filter) ? (shinyF + ' ' + filter) : (shinyF || filter);
    if (f) ctx.filter = f;
    DG.SpriteRenderer.drawMon(ctx, speciesId, CX, CY, MON_SCALE);
    ctx.filter = 'none';
    ctx.restore();
  }

  function _drawBackground(ctx, alpha) {
    ctx.save();
    ctx.globalAlpha = _clamp(alpha, 0, 1);
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }

  function _drawAmberGlow(ctx, radius, alpha) {
    ctx.save();
    ctx.globalAlpha = _clamp(alpha, 0, 1);
    const g = ctx.createRadialGradient(CX, CY, 8, CX, CY, radius);
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

  function _drawCracks(ctx, progress) {
    // Reveal crack lines progressively
    const total = _cracks.length;
    const shown = Math.floor(progress * total);
    ctx.save();
    ctx.lineWidth = 1.5;
    ctx.lineCap   = 'round';
    for (let ci = 0; ci < shown; ci++) {
      const pts = _cracks[ci];
      // Outer glow
      ctx.strokeStyle = 'rgba(255,230,100,0.35)';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let pi = 1; pi < pts.length; pi++) ctx.lineTo(pts[pi].x, pts[pi].y);
      ctx.stroke();
      // Bright core
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
      p.vy  += 0.18;   // gravity
      p.vx  *= 0.97;   // air resistance
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
      ctx.arc(CX, CY, r.radius, 0, Math.PI * 2);
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
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillText(text, CX + 2, H - 38 + 2);
    // Main text
    ctx.fillStyle = '#fff';
    ctx.fillText(text, CX, H - 38);
    // Sub-label
    ctx.font = '13px monospace';
    ctx.fillStyle = 'rgba(255,220,100,0.9)';
    ctx.fillText('evolved!', CX, H - 18);
    ctx.restore();
  }

  // ── Main draw — called every frame from renderer ──────────
  function draw(ctx) {
    if (!_active) return;

    const t  = _frame / DUR[_phase];   // 0..1 within phase
    const et = _ease(t);

    ctx.save();

    // ── Phase 0: DARKEN ───────────────────────────────────
    if (_phase === PH.DARKEN) {
      _drawBackground(ctx, et * 0.88);
      _drawAmberGlow(ctx, 60 + et * 40, et * 0.5);
      _drawMon(ctx, _oldId, null, et);
    }

    // ── Phase 1: GLOW ─────────────────────────────────────
    else if (_phase === PH.GLOW) {
      _drawBackground(ctx, 0.88);
      const pulse = Math.sin(_frame * 0.22) * 0.15;
      _drawAmberGlow(ctx, 95 + pulse * 30, 0.6 + pulse);
      _drawMon(ctx, _oldId, null, 1.0);
      // FASE 6: versnellend wit-silhouet-knipperen — het klassieke evolutie-flikkeren
      const freq  = 0.18 + t * 0.6;
      const flick = Math.max(0, Math.sin(_frame * freq));
      if (flick > 0.3) {
        _drawMon(ctx, _oldId, 'brightness(10) saturate(0)', flick * (0.45 + t * 0.55));
      }
      // FASE 6: gouden lichtspiraal die naar binnen draait
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (let s = 0; s < 6; s++) {
        const a = _frame * 0.16 + (s / 6) * Math.PI * 2;
        const r = 95 - t * 55 - s * 4;
        if (r < 12) continue;
        const sx2 = CX + Math.cos(a) * r;
        const sy2 = CY + Math.sin(a) * r * 0.7;
        const g2 = ctx.createRadialGradient(sx2, sy2, 0, sx2, sy2, 7);
        g2.addColorStop(0, 'rgba(255,235,150,0.9)');
        g2.addColorStop(1, 'rgba(255,200,60,0)');
        ctx.fillStyle = g2;
        ctx.fillRect(sx2 - 8, sy2 - 8, 16, 16);
      }
      ctx.restore();
    }

    // ── Phase 2: PETRIFY ──────────────────────────────────
    else if (_phase === PH.PETRIFY) {
      _drawBackground(ctx, 0.88);
      const glowFade = 1 - et;
      _drawAmberGlow(ctx, 95, glowFade * 0.55);
      // Original underneath
      _drawMon(ctx, _oldId, null, 1 - et * 0.7);
      // Stone version on top, increasing
      const grey = Math.floor(60 + (1 - et) * 40);
      _drawMon(
        ctx, _oldId,
        `grayscale(1) brightness(${0.4 + 0.3 * (1-et)}) contrast(1.3) sepia(0.4)`,
        et
      );
      // Subtle stone grain overlay
      ctx.save();
      ctx.globalAlpha = et * 0.12;
      ctx.fillStyle = `rgb(${grey},${grey},${grey})`;
      ctx.fillRect(CX - 85, CY - 85, 170, 170);
      ctx.restore();
    }

    // ── Phase 3: RUMBLE ───────────────────────────────────
    else if (_phase === PH.RUMBLE) {
      _shakeX = (Math.random() - 0.5) * 6 * (1 - et);
      _shakeY = (Math.random() - 0.5) * 4 * (1 - et);
      _drawBackground(ctx, 0.88);
      ctx.save();
      ctx.translate(_shakeX, _shakeY);
      _drawMon(ctx, _oldId, 'grayscale(1) brightness(0.45) contrast(1.4)', 1.0);
      ctx.restore();
      // Stone dust vignette
      ctx.save();
      ctx.globalAlpha = 0.15 + Math.random() * 0.08;
      ctx.fillStyle = '#aaa';
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
    }

    // ── Phase 4: CRACK ────────────────────────────────────
    else if (_phase === PH.CRACK) {
      _shakeX = (Math.random() - 0.5) * 4;
      _shakeY = (Math.random() - 0.5) * 3;
      _drawBackground(ctx, 0.9);
      ctx.save();
      ctx.translate(_shakeX, _shakeY);
      _drawMon(ctx, _oldId, 'grayscale(1) brightness(0.45) contrast(1.4)', 1.0);
      ctx.restore();
      _drawCracks(ctx, et);
      // Glow from cracks
      ctx.save();
      ctx.globalAlpha = et * 0.3;
      const cg = ctx.createRadialGradient(CX, CY, 0, CX, CY, 100);
      cg.addColorStop(0, 'rgba(255,240,150,1)');
      cg.addColorStop(1, 'rgba(255,200,50,0)');
      ctx.fillStyle = cg;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
    }

    // ── Phase 5: FLASH ────────────────────────────────────
    else if (_phase === PH.FLASH) {
      _drawBackground(ctx, 0.9);
      _drawParticles(ctx);
      _updateParticles();
      // White shockwave
      const flashT = t < 0.3 ? t / 0.3 : 1 - (t - 0.3) / 0.7;
      _drawWhiteFlash(ctx, _ease(flashT));
      // Ring burst at the moment of flash
      if (_frame === 2 || _frame === 5 || _frame === 9) {
        _addRing('rgba(255,240,160,0.9)', 6, 4);
        _addRing('rgba(255,200,80,0.6)',  4, 6);
      }
      _drawRings(ctx);
    }

    // ── Phase 6: EMERGE ───────────────────────────────────
    else if (_phase === PH.EMERGE) {
      _drawBackground(ctx, 1.0);
      // White fade out first half
      if (t < 0.4) {
        _drawWhiteFlash(ctx, 1 - t / 0.4);
      }
      // Particles still flying
      _updateParticles();
      _drawParticles(ctx);
      _drawRings(ctx);
      // New mon rises from light — silhouette first, then color
      const monProgress = t < 0.3 ? 0 : (t - 0.3) / 0.7;
      if (monProgress > 0) {
        // Start as white silhouette, transition to full color
        const silhouetteT = _clamp(1 - monProgress * 2, 0, 1);
        // Full color with increasing brightness
        _drawMon(
          ctx, _newId,
          silhouetteT > 0.05
            ? `brightness(${1 + silhouetteT * 6})`
            : null,
          _easeOut(monProgress)
        );
        // Add pulse rings as it emerges
        if (_frame === 20 || _frame === 30 || _frame === 40) {
          _addRing('rgba(200,240,255,0.7)', 5, 3);
        }
      }
    }

    // ── Phase 7: PULSE ────────────────────────────────────
    else if (_phase === PH.PULSE) {
      _drawBackground(ctx, 1.0);
      _drawMon(ctx, _newId, null, 1.0);
      _drawRings(ctx);
      // Spawn rings periodically
      if (_frame % 18 === 0) {
        const sp = DG.SPECIES && DG.SPECIES[_newId];
        const type = sp && sp.types && sp.types[0];
        const typeColors = {
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
        const col = (typeColors[type] || 'rgba(200,220,255,') + '0.7)';
        _addRing(col, 4 + Math.random() * 3, 2 + Math.random() * 3);
      }
      // Name text fades in
      const textAlpha = _clamp((t - 0.3) / 0.4, 0, 1);
      _drawNameText(ctx, textAlpha);
    }

    // ── Phase 8: FADE ─────────────────────────────────────
    else if (_phase === PH.FADE) {
      _drawBackground(ctx, 1.0);
      _drawMon(ctx, _newId, null, 1 - et);
      _drawRings(ctx);
      _drawNameText(ctx, 1 - et);
      // Fade to black
      _drawBackground(ctx, et * 0.95);
    }

    // FASE 6: cinematische letterbox om de hele sequence (in/uit met easing)
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

    // Advance frame
    _frame++;
    if (_frame >= DUR[_phase]) {
      _frame = 0;
      _phase++;

      // Phase transition side-effects
      if (_phase === PH.CRACK)   _genCracks();
      if (_phase === PH.FLASH)   _genParticles();
      if (_phase === PH.EMERGE)  _rings = [];
      if (_phase === PH.PULSE)   {
        _rings = [];
        _addRing('rgba(255,255,255,0.9)', 7, 5);
        _addRing('rgba(255,255,255,0.6)', 5, 3);
      }

      if (_phase >= DUR.length) {
        _active = false;
        if (_onComplete) _onComplete();
      }
    }
  }

  // ── Public API ────────────────────────────────────────────
  function start(oldSpeciesId, newSpeciesId, onComplete, isShiny) {
    const sp   = DG.SPECIES && DG.SPECIES[newSpeciesId];
    _oldId     = oldSpeciesId;
    _newId     = newSpeciesId;
    _newName   = sp ? sp.name : newSpeciesId;
    _isShiny   = !!isShiny;
    _onComplete= onComplete || null;
    _phase     = PH.DARKEN;
    _frame     = 0;
    _cracks    = [];
    _particles = [];
    _rings     = [];
    _shakeX    = 0; _shakeY = 0;
    _active    = true;
    try { DG.Audio.playEvolution && DG.Audio.playEvolution(); } catch(e) {}
  }

  function isActive() { return _active; }

  return { start, draw, isActive };

})();

// DinoMon: Fossil Frontier — ui/tmReward.js
// Prominent full-screen "HM/TM obtained" showcase. Mirrors EvoAnim's pattern:
// self-advancing in draw(), drawn by the renderer when isActive(), and calls
// onComplete() when finished so the badge-ceremony dialogue chain can continue.

window.DG = window.DG || {};

DG.TmReward = (function () {

  let _active     = false;
  let _frame      = 0;
  let _onComplete = null;
  let _moveName   = '';
  let _moveId     = '';
  let _hint       = '';

  const RISE = 26, HOLD = 120, FADE = 26;
  const TOTAL = RISE + HOLD + FADE;

  // Per-move accent colour + one-line "what it unlocks" hint.
  const MOVE_INFO = {
    ROCK_SMASH: { col:'#c9893f', hint:'Smash cracked rocks blocking the path!' },
    CUT:        { col:'#5bbf4a', hint:'Cut down trees that block the way!' },
    SURF:       { col:'#3a8fe0', hint:'Surf across deep water to new routes!' },
    STRENGTH:   { col:'#d2603a', hint:'Push heavy boulders out of the way!' },
    FLASH:      { col:'#e8c84a', hint:'Light up pitch-black caves!' },
    FLY:        { col:'#7ec2ef', hint:'Fly between cities you have visited!' },
    DIVE:       { col:'#2f7fb0', hint:'Dive into deep-water caverns!' },
    WATERFALL:  { col:'#4aa8e0', hint:'Climb roaring waterfalls!' },
  };

  function start(hmId, moveId, onComplete) {
    _moveId   = moveId || '';
    const mv  = DG.MOVES && DG.MOVES[_moveId];
    _moveName = mv ? mv.name : (_moveId || hmId || 'Field Move');
    _hint     = (MOVE_INFO[_moveId] && MOVE_INFO[_moveId].hint) || 'A new field ability!';
    _onComplete = onComplete || null;
    _frame    = 0;
    _active   = true;
    try { DG.Audio.playSfx && DG.Audio.playSfx('SELECT'); } catch (e) {}
  }

  function isActive() { return _active; }

  function _accent() {
    return (MOVE_INFO[_moveId] && MOVE_INFO[_moveId].col) || '#e8c84a';
  }

  function draw(ctx) {
    if (!_active) return;
    const W = DG.CANVAS.W, H = DG.CANVAS.H;
    const CX = W / 2, CY = H / 2;
    const accent = _accent();

    // Phase alpha: rise in, hold, fade out
    let appear = 1;
    if (_frame < RISE)            appear = _frame / RISE;
    else if (_frame > RISE + HOLD) appear = Math.max(0, 1 - (_frame - RISE - HOLD) / FADE);

    ctx.save();

    // Dim backdrop
    ctx.fillStyle = `rgba(8,6,18,${0.82 * appear})`;
    ctx.fillRect(0, 0, W, H);

    // Rotating glow rays behind the disc
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = 0.5 * appear;
    for (let i = 0; i < 10; i++) {
      const a = _frame * 0.04 + (i / 10) * Math.PI * 2;
      const len = 120 + Math.sin(_frame * 0.12 + i) * 10;
      ctx.strokeStyle = accent;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(CX, CY - 14);
      ctx.lineTo(CX + Math.cos(a) * len, CY - 14 + Math.sin(a) * len * 0.7);
      ctx.stroke();
    }
    ctx.restore();

    // Pop scale (overshoot) for the disc
    const pop = _frame < RISE
      ? 1.15 * (_frame / RISE)
      : 1 + Math.max(0, 1 - (_frame - RISE) / 8) * 0.15;
    const r = 42 * Math.min(1.15, pop) * appear;

    // TM/HM disc
    ctx.globalAlpha = appear;
    const g = ctx.createRadialGradient(CX, CY - 14, 4, CX, CY - 14, r);
    g.addColorStop(0, '#ffffff');
    g.addColorStop(0.45, accent);
    g.addColorStop(1, '#1a1430');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(CX, CY - 14, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();

    // "HM" label on the disc
    ctx.fillStyle = '#1a1430';
    ctx.font = 'bold 20px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('HM', CX, CY - 14);

    // Banner text
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#ffe98a';
    ctx.font = 'bold 18px monospace';
    ctx.fillText('FIELD MOVE LEARNED!', CX, CY + 52);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px monospace';
    ctx.fillText(_moveName, CX, CY + 80);

    ctx.fillStyle = '#cfe3ff';
    ctx.font = '11px monospace';
    ctx.fillText(_hint, CX, CY + 102);

    ctx.restore();

    // Advance
    _frame++;
    if (_frame >= TOTAL) {
      _active = false;
      const cb = _onComplete; _onComplete = null;
      if (cb) cb();
    }
  }

  console.log('[DinoMon] TmReward loaded.');
  return { start, draw, isActive };

})();

// DinoMon: Fossil Frontier — world/flyAnim.js
// Full "HM Fly" travel cutscene: take off → soar over the region map along an
// arc → descend onto the destination → reveal the overworld in front of its
// DinoCenter. Driven by Overworld (update) and drawn over the overworld scene.

window.DG = window.DG || {};

DG.FlyAnim = (function () {

  // Region positions (mirror the menu region map so the arc feels consistent)
  const NODES = {
    AMBERTOWN:       [54, 280], SHELLCREEK_CITY: [50, 236], DUSTWALL_TOWN: [46, 188],
    PYRESIDE_CITY:   [78, 140], FERNGROVE_TOWN: [148, 170], FAIRYDELL_CITY: [132, 112],
    STONEHAVEN_CITY: [206, 144], CRESTFALL_TOWN: [244, 72], BOGMIRE_CITY: [330, 170],
    APEXSUMMIT:      [388, 92],
    COMPOUND_CITY:   [92, 210],  BEACON_HAMLET: [300, 118],  SAFARI_GATE: [262, 132],
  };
  // A soft landmass silhouette (same shape language as the region map)
  const LAND = [
    [34,78],[120,46],[226,40],[300,50],[360,58],[414,52],[452,86],
    [456,128],[420,156],[392,184],[376,210],[372,238],[300,250],[250,286],
    [150,296],[64,282],[26,214],[20,138],[30,98],
  ];

  const TAKEOFF = 16, CRUISE = 84, DESCEND = 104, WARP_AT = 104, REVEAL = 124;

  let _a = null; // { f, originId, destId, onDone, warped, op:[x,y], dp:[x,y], destName }

  function _pos(id) { return NODES[id] || [240, 160]; }

  function isActive() { return !!_a; }

  function start(originId, destId, destName, onDone) {
    _a = {
      f: 0, originId, destId, onDone, warped: false,
      op: _pos(originId), dp: _pos(destId),
      destName: destName || 'the city',
    };
  }

  function update() {
    if (!_a) return;
    _a.f++;
    if (!_a.warped && _a.f >= WARP_AT) {
      _a.warped = true;
      try { if (typeof _a.onDone === 'function') _a.onDone(); } catch (e) { console.error('[FlyAnim] onDone', e); }
    }
    if (_a.f >= REVEAL) _a = null;
  }

  function _smoothPoly(ctx, pts) {
    const n = pts.length;
    ctx.beginPath();
    ctx.moveTo((pts[0][0] + pts[n - 1][0]) / 2, (pts[0][1] + pts[n - 1][1]) / 2);
    for (let i = 0; i < n; i++) {
      const c = pts[i], nx = pts[(i + 1) % n];
      ctx.quadraticCurveTo(c[0], c[1], (c[0] + nx[0]) / 2, (c[1] + nx[1]) / 2);
    }
    ctx.closePath();
  }

  // A simple winged flying-dino silhouette centred at (x,y), wings flapping by `fl`.
  function _drawFlyer(ctx, x, y, s, fl, col) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s, s);
    const wy = -3 - fl * 5; // wing tip rises/falls
    ctx.fillStyle = col;
    // wings
    for (const dir of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(0, -1);
      ctx.quadraticCurveTo(dir * 9, wy, dir * 16, wy + 1);
      ctx.quadraticCurveTo(dir * 9, 2, 0, 3);
      ctx.closePath(); ctx.fill();
    }
    // body + neck/head
    ctx.beginPath(); ctx.ellipse(0, 1, 3.2, 5.5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(1.5, -5, 2, 2.4, 0, 0, Math.PI * 2); ctx.fill();
    // tail
    ctx.beginPath(); ctx.moveTo(0, 5); ctx.lineTo(-1.5, 11); ctx.lineTo(1.5, 11); ctx.closePath(); ctx.fill();
    ctx.restore();
  }

  function _cityDot(ctx, p, col, r) {
    ctx.fillStyle = col; ctx.strokeStyle = '#fff'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(p[0], p[1], r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  }

  // Bezier arc point between origin & dest, bowed upward
  function _arcPt(op, dp, t) {
    const mx = (op[0] + dp[0]) / 2, my = (op[1] + dp[1]) / 2;
    const dist = Math.hypot(dp[0] - op[0], dp[1] - op[1]);
    const cx = mx, cy = my - Math.max(40, dist * 0.45);
    const u = 1 - t;
    return [
      u * u * op[0] + 2 * u * t * cx + t * t * dp[0],
      u * u * op[1] + 2 * u * t * cy + t * t * dp[1],
    ];
  }

  function draw(ctx) {
    if (!_a) return;
    const W = DG.CANVAS.W, H = DG.CANVAS.H, f = _a.f;

    // ── Post-warp reveal: white veil fading over the destination overworld ──
    if (f >= WARP_AT) {
      const k = 1 - (f - WARP_AT) / (REVEAL - WARP_AT); // 1 → 0
      ctx.save();
      ctx.fillStyle = 'rgba(255,255,255,' + (k * k).toFixed(3) + ')';
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
      return;
    }

    // map-view opacity (fades in during take-off)
    const mapA = Math.min(1, f / TAKEOFF);

    ctx.save();
    ctx.globalAlpha = mapA;

    // zoom toward destination during the descend phase
    if (f > CRUISE) {
      const z = 1 + ((f - CRUISE) / (DESCEND - CRUISE)) * 1.4; // 1 → 2.4
      ctx.translate(_a.dp[0], _a.dp[1]); ctx.scale(z, z); ctx.translate(-_a.dp[0], -_a.dp[1]);
    }

    // sea
    const sea = ctx.createLinearGradient(0, 0, 0, H);
    sea.addColorStop(0, '#1b4a78'); sea.addColorStop(1, '#123a63');
    ctx.fillStyle = sea; ctx.fillRect(-200, -200, W + 400, H + 400);
    // landmass
    _smoothPoly(ctx, LAND);
    const lg = ctx.createLinearGradient(0, 0, 0, H);
    lg.addColorStop(0, '#5fa24a'); lg.addColorStop(1, '#4e8c3e');
    ctx.fillStyle = lg; ctx.fill();
    ctx.strokeStyle = 'rgba(240,228,180,0.85)'; ctx.lineWidth = 2; ctx.stroke();

    // all city dots (faint)
    for (const id in NODES) _cityDot(ctx, NODES[id], 'rgba(220,230,245,0.5)', 2);
    // origin (yellow) + destination (pulsing)
    _cityDot(ctx, _a.op, '#ffe050', 3.2);
    const pulse = 0.5 + 0.5 * Math.sin(f * 0.3);
    ctx.save(); ctx.globalAlpha = mapA * (0.4 + 0.5 * pulse);
    ctx.strokeStyle = '#ffd23a'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(_a.dp[0], _a.dp[1], 8, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
    _cityDot(ctx, _a.dp, '#ff5a4a', 3.4);

    // flight progress along the arc
    const tt = Math.max(0, Math.min(1, (f - TAKEOFF) / (CRUISE - TAKEOFF)));
    // dashed travelled trail
    ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 1.5; ctx.setLineDash([4, 4]);
    ctx.beginPath();
    for (let s = 0; s <= tt; s += 0.04) { const q = _arcPt(_a.op, _a.dp, s); s === 0 ? ctx.moveTo(q[0], q[1]) : ctx.lineTo(q[0], q[1]); }
    ctx.stroke(); ctx.setLineDash([]);

    // flyer position + shadow
    const fp = _arcPt(_a.op, _a.dp, tt);
    const groundY = fp[1] + 14;
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.beginPath(); ctx.ellipse(fp[0], groundY, 6, 2, 0, 0, Math.PI * 2); ctx.fill();
    const fl = Math.sin(f * 0.5) * 0.5 + 0.5;
    _drawFlyer(ctx, fp[0], fp[1], 1.5, fl, '#23304a');
    ctx.restore();

    // ── Foreground HUD (no zoom): banner + clouds ──
    // drifting clouds for a sense of altitude
    ctx.save();
    ctx.globalAlpha = mapA * 0.5; ctx.fillStyle = '#ffffff';
    for (let c = 0; c < 4; c++) {
      const cw = (f * (1.4 + c * 0.5) + c * 160) % (W + 120) - 60;
      const cy = 30 + c * 14;
      ctx.beginPath();
      ctx.ellipse(cw, cy, 22, 7, 0, 0, Math.PI * 2);
      ctx.ellipse(cw + 16, cy + 3, 16, 6, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // destination banner
    ctx.save();
    ctx.globalAlpha = mapA;
    const by = 16;
    ctx.fillStyle = 'rgba(8,16,40,0.85)'; ctx.strokeStyle = '#8ed8f8'; ctx.lineWidth = 1.5;
    const bw = 240, bx = (W - bw) / 2;
    ctx.beginPath(); ctx.rect(bx, by, bw, 22); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#8ed8f8'; ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('✈  Flying to ' + _a.destName, W / 2, by + 11);
    ctx.restore();
  }

  console.log('[DinoMon] FlyAnim loaded.');
  return { start, update, draw, isActive };
})();

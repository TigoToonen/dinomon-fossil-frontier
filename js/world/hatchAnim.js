// DinoMon: Fossil Frontier — world/hatchAnim.js v2
// Full-screen "Primordial Awakening" — the cinematic that plays when a fossil
// hatches at the Compound City Fossil Lab. An amber shell resonates, cracks,
// shatters in a burst of golden shards, and the revived DinoMon rises from
// primordial light with a type-coloured roar and a pristine-specimen reveal.
//
// Drawn every frame from the renderer overlay; advances its own frame counter.
// Self-contained. Supports shiny revivals (prismatic shimmer + rainbow rings)
// and shows rarity stars for the specimen's perfect IVs.

window.DG = window.DG || {};

DG.HatchAnim = (function () {

  // ── Phase constants ───────────────────────────────────────
  const PH = {
    DARKEN   : 0,  // screen darkens; amber-encased fossil descends into view
    RESONATE : 1,  // amber pulses, light spirals inward, the shell hums
    CRACK    : 2,  // glowing cracks spread across the amber shell
    SHATTER  : 3,  // white flash + amber shards + sparkle burst
    EMERGE   : 4,  // the revived DinoMon rises from primordial light
    ROAR     : 5,  // type-coloured shockwave + screen shake + specimen card
    HOLD     : 6,  // beauty beat — the specimen poses with its card
    FADE     : 7,  // everything fades, overworld resumes
  };
  const DUR = [38, 52, 46, 24, 70, 46, 60, 32];

  const W = 480, H = 320;
  const CX = W / 2, CY = H / 2 - 14;
  const MON_SCALE = 3.0;

  // ── State ─────────────────────────────────────────────────
  let _active     = false;
  let _phase      = 0;
  let _frame      = 0;
  let _newId      = '';
  let _newName    = '';
  let _type       = 'ROCK';
  let _typeCol    = 'rgba(255,200,90,';
  let _isShiny    = false;
  let _perfectIVs = 3;
  let _onComplete = null;

  let _cracks   = [];
  let _shards   = [];   // amber shell shards
  let _rings    = [];
  let _motes    = [];   // floating golden light motes (ambient)
  let _sparkles = [];   // four-point twinkles
  let _shakeX = 0, _shakeY = 0;

  const TYPE_RGB = {
    FIRE:'255,100,30', WATER:'60,160,255', GRASS:'80,220,80', ROCK:'180,140,80',
    DRAGON:'120,80,240', GROUND:'200,160,60', PSYCHIC:'220,80,180', ELECTRIC:'255,230,30',
    ICE:'160,230,255', DARK:'120,90,160', STEEL:'160,180,200', FIGHTING:'200,60,60',
    GHOST:'140,90,200', FAIRY:'255,140,200', POISON:'170,70,210', BUG:'140,200,60',
    FLYING:'140,190,255', NORMAL:'210,200,170',
  };

  // ── Easing ────────────────────────────────────────────────
  function _ease(t)    { return t < 0.5 ? 2*t*t : -1+(4-2*t)*t; }
  function _easeOut(t) { return 1 - (1-t)*(1-t); }
  function _clamp(v,a,b){ return v<a?a:v>b?b:v; }

  // Prismatic rainbow colour for shiny flourishes.
  function _rainbow(off, alpha) {
    const h = (off % 360 + 360) % 360;
    return 'hsla(' + h + ',95%,65%,' + alpha + ')';
  }

  // ── Generators ────────────────────────────────────────────
  function _genCracks() {
    _cracks = [];
    const NUM = 16;
    for (let i = 0; i < NUM; i++) {
      const baseAngle = (Math.PI*2/NUM)*i + (Math.random()-0.5)*0.3;
      const length    = 30 + Math.random()*50;
      const steps     = 3 + Math.floor(Math.random()*4);
      const pts = [{ x: CX, y: CY }];
      let px = CX, py = CY;
      for (let s = 0; s < steps; s++) {
        const ang = baseAngle + (Math.random()-0.5)*0.6;
        const d = length/steps;
        px += Math.cos(ang)*d; py += Math.sin(ang)*d;
        pts.push({ x: px, y: py });
      }
      _cracks.push(pts);
    }
  }

  function _genShards() {
    _shards = [];
    for (let i = 0; i < 40; i++) {
      const ang = Math.random()*Math.PI*2;
      const spd = 2 + Math.random()*7.5;
      const sz  = 4 + Math.random()*12;
      const lit = Math.random() < 0.5;
      _shards.push({
        x: CX + Math.cos(ang)*16, y: CY + Math.sin(ang)*16,
        vx: Math.cos(ang)*spd, vy: Math.sin(ang)*spd - 1.5,
        w: sz, h: sz*(0.5+Math.random()*0.7),
        rot: Math.random()*Math.PI*2, rotV: (Math.random()-0.5)*0.3,
        color: lit ? '#ffd87a' : '#d2922f',
        alpha: 1.0,
      });
    }
  }

  function _genMotes() {
    _motes = [];
    for (let i = 0; i < 28; i++) {
      _motes.push({
        x: Math.random()*W, y: Math.random()*H,
        r: 0.6 + Math.random()*1.8,
        drift: 0.2 + Math.random()*0.5,
        ph: Math.random()*Math.PI*2,
      });
    }
  }

  function _spawnSparkles(n, spread) {
    for (let i = 0; i < n; i++) {
      const ang = Math.random()*Math.PI*2;
      const d   = Math.random()*spread;
      _sparkles.push({
        x: CX + Math.cos(ang)*d, y: CY + Math.sin(ang)*d - 6,
        size: 3 + Math.random()*5,
        life: 18 + Math.random()*20, maxLife: 38,
        twinkle: Math.random()*Math.PI*2,
        hue: Math.random()*360,
      });
    }
  }

  // ── Draw helpers ──────────────────────────────────────────
  function _bg(ctx, alpha) {
    ctx.save(); ctx.globalAlpha = _clamp(alpha,0,1);
    ctx.fillStyle = '#0a0604'; ctx.fillRect(0,0,W,H); ctx.restore();
  }

  function _amberGlow(ctx, radius, alpha) {
    ctx.save(); ctx.globalAlpha = _clamp(alpha,0,1);
    const g = ctx.createRadialGradient(CX,CY,6,CX,CY,radius);
    g.addColorStop(0.0,'rgba(255,205,90,0.9)');
    g.addColorStop(0.45,'rgba(255,150,40,0.4)');
    g.addColorStop(1.0,'rgba(255,110,0,0)');
    ctx.fillStyle = g; ctx.fillRect(0,0,W,H); ctx.restore();
  }

  function _motesDraw(ctx, alpha) {
    ctx.save(); ctx.globalCompositeOperation='lighter';
    for (const m of _motes) {
      m.y -= m.drift; m.ph += 0.05;
      if (m.y < -4) m.y = H + 4;
      const fl = 0.5 + 0.5*Math.sin(m.ph);
      ctx.globalAlpha = _clamp(alpha,0,1) * (0.35 + fl*0.5);
      ctx.fillStyle = _isShiny ? _rainbow(m.x*2 + _frame*3, 1) : 'rgba(255,225,150,1)';
      ctx.beginPath(); ctx.arc(m.x + Math.sin(m.ph)*3, m.y, m.r, 0, Math.PI*2); ctx.fill();
    }
    ctx.restore();
  }

  function _whiteFlash(ctx, alpha) {
    ctx.save(); ctx.globalAlpha = _clamp(alpha,0,1);
    ctx.fillStyle = '#fff'; ctx.fillRect(0,0,W,H); ctx.restore();
  }

  // Four-point twinkle star.
  function _star(ctx, x, y, s, color) {
    ctx.save(); ctx.translate(x,y); ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0,-s); ctx.lineTo(s*0.18,-s*0.18); ctx.lineTo(s,0);
    ctx.lineTo(s*0.18,s*0.18); ctx.lineTo(0,s); ctx.lineTo(-s*0.18,s*0.18);
    ctx.lineTo(-s,0); ctx.lineTo(-s*0.18,-s*0.18); ctx.closePath(); ctx.fill();
    ctx.restore();
  }

  function _updateSparkles() {
    for (const sp of _sparkles) { sp.life--; sp.twinkle += 0.3; }
    _sparkles = _sparkles.filter(s => s.life > 0);
  }
  function _drawSparkles(ctx) {
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (const sp of _sparkles) {
      const a = (sp.life / sp.maxLife) * (0.6 + 0.4*Math.sin(sp.twinkle));
      const sz = sp.size * (0.6 + 0.4*Math.sin(sp.twinkle*1.3));
      ctx.globalAlpha = _clamp(a,0,1);
      _star(ctx, sp.x, sp.y, sz, _isShiny ? _rainbow(sp.hue + _frame*4, 1) : 'rgba(255,240,180,1)');
    }
    ctx.restore();
  }

  // Filter applied to the live creature (matches the in-battle shiny look).
  function _monFilter(extra) {
    const shiny = _isShiny ? 'hue-rotate(' + ((_frame*4) % 360) + 'deg) saturate(2.2)' : '';
    if (shiny && extra) return shiny + ' ' + extra;
    return shiny || extra || '';
  }

  function _drawMon(ctx, extraFilter, alpha, scaleMul, cx, cy) {
    if (!DG.SpriteRenderer || !DG.SpriteRenderer.drawMon || !_newId) return;
    ctx.save();
    ctx.globalAlpha = _clamp(alpha,0,1);
    const f = _monFilter(extraFilter);
    if (f) ctx.filter = f;
    DG.SpriteRenderer.drawMon(ctx, _newId, cx==null?CX:cx, cy==null?CY:cy, MON_SCALE*(scaleMul||1));
    ctx.filter = 'none';
    ctx.restore();
  }

  // Amber fossil shell with the creature frozen inside.
  function _drawAmberShell(ctx, alpha) {
    ctx.save();
    ctx.globalAlpha = _clamp(alpha,0,1);
    const rx = 70, ry = 92;
    const g = ctx.createRadialGradient(CX-18, CY-22, 8, CX, CY, ry);
    g.addColorStop(0.0,'rgba(255,225,150,0.95)');
    g.addColorStop(0.55,'rgba(225,150,55,0.92)');
    g.addColorStop(1.0,'rgba(120,70,22,0.95)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.ellipse(CX, CY, rx, ry, 0, 0, Math.PI*2); ctx.fill();
    // frozen silhouette inside
    ctx.save();
    ctx.beginPath(); ctx.ellipse(CX, CY, rx-6, ry-6, 0, 0, Math.PI*2); ctx.clip();
    if (DG.SpriteRenderer && DG.SpriteRenderer.drawMon && _newId) {
      ctx.globalAlpha = 0.8*alpha; ctx.filter = 'brightness(0.35) sepia(0.8) saturate(1.4)';
      DG.SpriteRenderer.drawMon(ctx, _newId, CX, CY, MON_SCALE*0.86);
      ctx.filter = 'none';
    }
    ctx.restore();
    // glossy highlight + rim
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.beginPath(); ctx.ellipse(CX-24, CY-34, 14, 26, -0.5, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = 'rgba(90,55,18,0.8)'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.ellipse(CX, CY, rx, ry, 0, 0, Math.PI*2); ctx.stroke();
    ctx.restore();
  }

  function _drawCracks(ctx, progress) {
    const shown = Math.floor(progress * _cracks.length);
    ctx.save(); ctx.lineCap = 'round';
    for (let ci = 0; ci < shown; ci++) {
      const pts = _cracks[ci];
      ctx.strokeStyle = 'rgba(255,235,120,0.4)'; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.moveTo(pts[0].x,pts[0].y);
      for (let i=1;i<pts.length;i++) ctx.lineTo(pts[i].x,pts[i].y); ctx.stroke();
      ctx.strokeStyle = 'rgba(255,255,210,0.95)'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(pts[0].x,pts[0].y);
      for (let i=1;i<pts.length;i++) ctx.lineTo(pts[i].x,pts[i].y); ctx.stroke();
    }
    ctx.restore();
  }

  function _updateShards() {
    for (const s of _shards) {
      s.x += s.vx; s.y += s.vy; s.vy += 0.2; s.vx *= 0.98;
      s.rot += s.rotV; s.alpha = Math.max(0, s.alpha - 0.016);
    }
  }
  function _drawShards(ctx) {
    ctx.save();
    for (const s of _shards) {
      if (s.alpha <= 0) continue;
      ctx.globalAlpha = s.alpha; ctx.fillStyle = s.color;
      ctx.save(); ctx.translate(s.x,s.y); ctx.rotate(s.rot);
      ctx.beginPath(); ctx.moveTo(-s.w/2,-s.h/2); ctx.lineTo(s.w/2,-s.h/3);
      ctx.lineTo(s.w/3,s.h/2); ctx.lineTo(-s.w/2,s.h/3); ctx.closePath(); ctx.fill();
      ctx.restore();
    }
    ctx.restore();
  }

  function _drawRings(ctx) {
    ctx.save();
    for (const r of _rings) {
      ctx.globalAlpha = _clamp(r.alpha,0,1);
      ctx.strokeStyle = r.color; ctx.lineWidth = r.width;
      ctx.beginPath(); ctx.arc(CX,CY,r.radius,0,Math.PI*2); ctx.stroke();
      r.radius += r.speed; r.alpha -= 0.025; r.width *= 0.96;
    }
    _rings = _rings.filter(r => r.alpha > 0);
    ctx.restore();
  }
  function _addRing(color, speed, width) {
    _rings.push({ radius: 26, alpha: 0.9, color, speed: speed||4, width: width||3 });
  }

  function _spiral(ctx, t) {
    ctx.save(); ctx.globalCompositeOperation='lighter';
    for (let s = 0; s < 7; s++) {
      const ang = _frame*0.15 + (s/7)*Math.PI*2;
      const r = 110 - t*65 - s*4;
      if (r < 10) continue;
      const sx = CX + Math.cos(ang)*r, sy = CY + Math.sin(ang)*r*0.85;
      const g = ctx.createRadialGradient(sx,sy,0,sx,sy,8);
      g.addColorStop(0,'rgba(255,235,160,0.9)'); g.addColorStop(1,'rgba(255,200,60,0)');
      ctx.fillStyle = g; ctx.fillRect(sx-9,sy-9,18,18);
    }
    ctx.restore();
  }

  function _godRays(ctx, alpha) {
    ctx.save(); ctx.globalCompositeOperation='lighter'; ctx.globalAlpha = _clamp(alpha,0,1);
    for (let r=0;r<12;r++){ const ang=_frame*0.015+r*(Math.PI/6);
      ctx.fillStyle = _isShiny ? _rainbow(r*30 + _frame*3, 0.10) : 'rgba(255,225,140,0.09)';
      ctx.save(); ctx.translate(CX,CY); ctx.rotate(ang);
      ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(300,-14); ctx.lineTo(300,14); ctx.closePath(); ctx.fill();
      ctx.restore();
    }
    ctx.restore();
  }

  // The pristine-specimen reveal card (name, rarity stars, shiny badge).
  function _specimenCard(ctx, alpha) {
    if (!_newName) return;
    ctx.save();
    ctx.globalAlpha = _clamp(alpha,0,1);
    ctx.textAlign = 'center';

    // SHINY badge above the name
    if (_isShiny) {
      ctx.font = 'bold 13px monospace';
      ctx.fillStyle = _rainbow(_frame*5, 1);
      ctx.fillText('✨ SHINY SPECIMEN ✨', CX, H - 96);
    }

    // Name with a gleam sweep
    const text = _newName + '!';
    ctx.font = 'bold 24px monospace';
    ctx.fillStyle = 'rgba(0,0,0,0.65)'; ctx.fillText(text, CX+2, H-68+2);
    ctx.fillStyle = _isShiny ? _rainbow(_frame*5 + 40, 1) : '#fff4d8';
    ctx.fillText(text, CX, H-68);
    // gleam highlight sweeping across the name
    const gx = CX - 90 + ((_frame*6) % 200);
    const gg = ctx.createLinearGradient(gx-24,0,gx+24,0);
    gg.addColorStop(0,'rgba(255,255,255,0)'); gg.addColorStop(0.5,'rgba(255,255,255,0.55)'); gg.addColorStop(1,'rgba(255,255,255,0)');
    ctx.save(); ctx.globalCompositeOperation='lighter'; ctx.globalAlpha = _clamp(alpha,0,1)*0.8;
    ctx.fillStyle = gg; ctx.font='bold 24px monospace';
    ctx.fillText(text, CX, H-68); ctx.restore();

    // Sub-line + rarity stars (kept clear of the bottom letterbox bar)
    ctx.font = '12px monospace';
    ctx.fillStyle = 'rgba(255,215,120,0.95)';
    ctx.fillText('PRISTINE SPECIMEN · revived from a fossil', CX, H-48);
    let stars = ''; for (let i=0;i<6;i++) stars += (i < _perfectIVs ? '✦' : '✧');
    ctx.font = 'bold 13px monospace';
    ctx.fillStyle = '#ffe08a';
    ctx.fillText(stars, CX, H-34);
    ctx.restore();
  }

  // ── Main draw ─────────────────────────────────────────────
  function draw(ctx) {
    if (!_active) return;
    const t  = _frame / DUR[_phase];
    const et = _ease(t);
    ctx.save();

    if (_phase === PH.DARKEN) {
      _bg(ctx, et*0.94);
      _motesDraw(ctx, et*0.7);
      _amberGlow(ctx, 70 + et*30, et*0.5);
      const drop = (1-_easeOut(t)) * -60;
      ctx.save(); ctx.translate(0, drop);
      _drawAmberShell(ctx, et);
      ctx.restore();
    }

    else if (_phase === PH.RESONATE) {
      _bg(ctx, 0.94);
      _motesDraw(ctx, 0.7);
      const pulse = Math.sin(_frame*0.25)*0.15;
      _amberGlow(ctx, 95 + pulse*30, 0.55 + pulse);
      _drawAmberShell(ctx, 1.0);
      _spiral(ctx, t);
      if (t > 0.55) {
        _shakeX = (Math.random()-0.5)*3.5*(t-0.55)/0.45;
        _shakeY = (Math.random()-0.5)*2.5*(t-0.55)/0.45;
        if (_frame % 6 === 0) _spawnSparkles(2, 80);
      }
      _updateSparkles(); _drawSparkles(ctx);
    }

    else if (_phase === PH.CRACK) {
      _shakeX = (Math.random()-0.5)*4; _shakeY = (Math.random()-0.5)*3;
      _bg(ctx, 0.94);
      ctx.save(); ctx.translate(_shakeX,_shakeY);
      _drawAmberShell(ctx, 1.0);
      _drawCracks(ctx, et);
      ctx.restore();
      ctx.save(); ctx.globalAlpha = et*0.4;
      const cg = ctx.createRadialGradient(CX,CY,0,CX,CY,110);
      cg.addColorStop(0,'rgba(255,245,160,1)'); cg.addColorStop(1,'rgba(255,200,50,0)');
      ctx.fillStyle = cg; ctx.fillRect(0,0,W,H); ctx.restore();
      if (_frame % 5 === 0) _spawnSparkles(2, 70);
      _updateSparkles(); _drawSparkles(ctx);
    }

    else if (_phase === PH.SHATTER) {
      _bg(ctx, 0.94);
      _updateShards(); _drawShards(ctx);
      const flashT = t < 0.3 ? t/0.3 : 1-(t-0.3)/0.7;
      _whiteFlash(ctx, _ease(flashT));
      if (_frame === 1 || _frame === 4 || _frame === 8) {
        _addRing(_isShiny ? _rainbow(_frame*20,0.9) : 'rgba(255,240,160,0.9)', 7, 4);
        _addRing('rgba(255,200,80,0.6)', 5, 6);
      }
      _drawRings(ctx);
      _updateSparkles(); _drawSparkles(ctx);
    }

    else if (_phase === PH.EMERGE) {
      _bg(ctx, 1.0);
      _motesDraw(ctx, 0.85);
      if (t < 0.35) _whiteFlash(ctx, 1 - t/0.35);
      _updateShards(); _drawShards(ctx);
      _drawRings(ctx);
      _godRays(ctx, 0.55 - t*0.4);
      const mp = t < 0.25 ? 0 : (t-0.25)/0.75;
      if (mp > 0) {
        const sil = _clamp(1 - mp*2, 0, 1);
        const rise = (1-_easeOut(mp)) * 20;
        _drawMon(ctx, sil > 0.05 ? `brightness(${1 + sil*6})` : null, _easeOut(mp), 1.0, CX, CY + rise);
        if (_frame === 22 || _frame === 36 || _frame === 50) {
          _addRing(_isShiny ? _rainbow(_frame*15,0.7) : 'rgba(255,235,170,0.7)', 5, 3);
          _spawnSparkles(_isShiny ? 6 : 3, 70);
        }
      }
      _updateSparkles(); _drawSparkles(ctx);
    }

    else if (_phase === PH.ROAR) {
      if (t < 0.3) { _shakeX = (Math.random()-0.5)*6*(1-t/0.3); _shakeY = (Math.random()-0.5)*5*(1-t/0.3); }
      else { _shakeX = 0; _shakeY = 0; }
      _bg(ctx, 1.0);
      _motesDraw(ctx, 0.85);
      ctx.save(); ctx.translate(_shakeX,_shakeY);
      _drawMon(ctx, null, 1.0, 1.0, CX, CY);
      ctx.restore();
      _drawRings(ctx);
      if (_frame % 14 === 0) _addRing((_isShiny ? _rainbow(_frame*10,0.7) : _typeCol + '0.7)'), 4 + Math.random()*3, 2 + Math.random()*3);
      if (_isShiny && _frame % 7 === 0) _spawnSparkles(3, 90);
      _updateSparkles(); _drawSparkles(ctx);
      _specimenCard(ctx, _clamp((t-0.15)/0.4, 0, 1));
    }

    else if (_phase === PH.HOLD) {
      _bg(ctx, 1.0);
      _motesDraw(ctx, 0.85);
      const bob = Math.sin(_frame*0.12) * 3;
      _drawMon(ctx, null, 1.0, 1.0, CX, CY + bob);
      _drawRings(ctx);
      if (_frame % 18 === 0) _addRing((_isShiny ? _rainbow(_frame*10,0.6) : _typeCol + '0.55)'), 4, 2.5);
      if (_isShiny && _frame % 9 === 0) _spawnSparkles(2, 95);
      _updateSparkles(); _drawSparkles(ctx);
      _specimenCard(ctx, 1.0);
    }

    else if (_phase === PH.FADE) {
      _bg(ctx, 1.0);
      const bob = Math.sin(_frame*0.12) * 3;
      _drawMon(ctx, null, 1-et, 1.0, CX, CY + bob);
      _drawRings(ctx);
      _specimenCard(ctx, 1-et);
      _bg(ctx, et*0.95);
    }

    // cinematic letterbox
    {
      let lb = 1;
      if (_phase === PH.DARKEN) lb = et;
      else if (_phase === PH.FADE) lb = 1 - et;
      const bh = Math.round(28 * lb);
      if (bh > 0) {
        ctx.fillStyle = 'rgba(2,2,6,0.96)';
        ctx.fillRect(0,0,W,bh); ctx.fillRect(0,H-bh,W,bh);
      }
    }

    ctx.restore();

    _frame++;
    if (_frame >= DUR[_phase]) {
      _frame = 0; _phase++;
      if (_phase === PH.CRACK)   _genCracks();
      if (_phase === PH.SHATTER) { _genShards(); _spawnSparkles(14, 60); try { DG.Audio.playEvolution && DG.Audio.playEvolution(); } catch(e){} }
      if (_phase === PH.EMERGE)  _rings = [];
      if (_phase === PH.ROAR)    {
        _rings = [];
        _addRing('rgba(255,255,255,0.9)', 8, 5);
        _addRing((_isShiny ? _rainbow(0,0.7) : _typeCol + '0.7)'), 6, 4);
        try { DG.Audio.playVictoryJingle && DG.Audio.playVictoryJingle(); } catch(e){}
      }
      if (_phase >= DUR.length) {
        _active = false;
        if (_onComplete) { const cb = _onComplete; _onComplete = null; cb(); }
      }
    }
  }

  // ── Public API ────────────────────────────────────────────
  function start(speciesId, onComplete, opts) {
    opts = opts || {};
    const sp = DG.SPECIES && DG.SPECIES[speciesId];
    _newId      = speciesId;
    _newName    = sp ? sp.name : speciesId;
    _type       = (sp && sp.types && sp.types[0]) || 'ROCK';
    _typeCol    = 'rgba(' + (TYPE_RGB[_type] || '255,200,90') + ',';
    _isShiny    = !!opts.isShiny;
    _perfectIVs = (typeof opts.perfectIVs === 'number') ? opts.perfectIVs : 3;
    _onComplete = onComplete || null;
    _phase = PH.DARKEN; _frame = 0;
    _cracks = []; _shards = []; _rings = []; _sparkles = []; _shakeX = 0; _shakeY = 0;
    _genMotes();
    _active = true;
    try { DG.Audio.playEvolution && DG.Audio.playEvolution(); } catch(e) {}
  }

  function isActive() { return _active; }

  return { start, draw, isActive, PH };

})();

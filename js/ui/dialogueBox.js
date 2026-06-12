// DinoMon: Fossil Frontier — ui/dialogueBox.js
// Typewriter dialogue renderer on canvas

window.DG = window.DG || {};

DG.DialogueBox = (function () {

  const BOX_H   = 64;
  const BOX_PAD = 10;
  const FONT    = '16px monospace'; // 16px → pixelfont scale 2 (groot, GBA-stijl)
  const LINE_H  = 20;
  const CHARS_PER_TICK_FAST   = 4;
  const CHARS_PER_TICK_NORMAL = 2;
  const CHARS_PER_TICK_SLOW   = 1;

  let _visible   = false;
  let _lines     = [];      // full text lines
  let _page      = 0;       // current page index (2 lines per page)
  let _charIdx   = 0;       // characters revealed on current page
  let _totalChars = 0;      // total chars on this page
  let _timer     = 0;
  let _speed     = CHARS_PER_TICK_NORMAL;
  let _onDone    = null;
  let _waitInput = false;   // waiting for A press to advance
  let _arrow     = 0;       // animated arrow blink
  let _openT     = 1;       // pop-in animatie (0 → 1)

  // ── Word-wrap helper ──────────────────────────────────────
  // Max 37 chars per line bij pixelfont scale 2 (12px advance) in de boxbreedte
  const MAX_LINE_CHARS = 37;

  function _wrapLine(text) {
    const words = text.split(' ');
    const out = [];
    let cur = '';
    for (const word of words) {
      const candidate = cur ? cur + ' ' + word : word;
      if (candidate.length <= MAX_LINE_CHARS) {
        cur = candidate;
      } else {
        if (cur) out.push(cur);
        // If single word exceeds limit, hard-cut it
        if (word.length > MAX_LINE_CHARS) {
          for (let i = 0; i < word.length; i += MAX_LINE_CHARS) {
            out.push(word.slice(i, i + MAX_LINE_CHARS));
          }
          cur = '';
        } else {
          cur = word;
        }
      }
    }
    if (cur) out.push(cur);
    return out;
  }

  // ── Public: show dialogue ─────────────────────────────────
  // lines: string | string[]
  // onDone: callback when all lines displayed and dismissed
  function show(lines, onDone) {
    if (typeof lines === 'string') lines = [lines];
    if (!lines || lines.length === 0) {
      if (typeof onDone === 'function') onDone();
      return;
    }
    // Substitute rival name: replace 'Flint' / 'FLINT' with the player-chosen name
    const _rival = (typeof DG !== 'undefined' && DG.getRivalName) ? DG.getRivalName() : 'Flint';
    if (_rival !== 'Flint') {
      const _rivalUpper = _rival.toUpperCase();
      lines = lines.map(l =>
        l.replace(/\bFLINT\b/g, _rivalUpper)
         .replace(/\bFlint\b/g, _rival)
      );
    }
    // Word-wrap any line that's too long to fit the box
    const wrapped = [];
    for (const line of lines) {
      if (line.length <= MAX_LINE_CHARS) {
        wrapped.push(line);
      } else {
        wrapped.push(..._wrapLine(line));
      }
    }
    _visible   = true;
    _lines     = wrapped;
    _page      = 0;
    _charIdx   = 0;
    _onDone    = onDone || null;
    _waitInput = false;
    _openT     = 0; // start pop-in
    _setPage(0);
  }

  function _setPage(p) {
    _page = p;
    _charIdx = 0;
    const start = p * 2;
    const end   = Math.min(_lines.length, start + 2);
    const pageLines = _lines.slice(start, end);
    _totalChars = pageLines.reduce((s, l) => s + l.length, 0);
    _waitInput = false;
  }

  // ── Public: update (called every frame) ──────────────────
  function update(dt, settings) {
    if (!_visible) return;

    const spd = settings ? settings.textSpeed : 'NORMAL';
    _speed = spd === 'FAST' ? CHARS_PER_TICK_FAST
           : spd === 'SLOW' ? CHARS_PER_TICK_SLOW
           : CHARS_PER_TICK_NORMAL;

    _arrow = (_arrow + 1) % 60;
    if (_openT < 1) _openT = Math.min(1, _openT + 0.18);

    if (_waitInput) {
      if (DG.Input.isPressed('A') || DG.Input.isPressed('B')) {
        _advance();
      }
      return;
    }

    // Advance text
    _timer++;
    if (_timer >= 1) {
      _timer = 0;
      _charIdx = Math.min(_charIdx + _speed, _totalChars);
      if (_charIdx >= _totalChars) {
        _waitInput = true;
      }
    }

    // A or B while typing: skip to end of page instantly
    if (DG.Input.isPressed('A') || DG.Input.isPressed('B')) {
      _charIdx = _totalChars;
      _waitInput = true;
    }
  }

  function _advance() {
    const lastPage = Math.ceil(_lines.length / 2) - 1;
    if (_page < lastPage) {
      _setPage(_page + 1);
    } else {
      // Done
      _visible = false;
      const cb = _onDone;
      _onDone = null;
      if (typeof cb === 'function') cb();
    }
  }

  // ── Public: draw (called by renderer) ────────────────────
  function draw(ctx) {
    if (!_visible) return;

    const W = DG.CANVAS.W;
    const H = DG.CANVAS.H;
    const bw = W - 8;

    // Pop-in: box schuift van onder het scherm omhoog + fade
    const ease  = (DG.UIKit && DG.UIKit.easeOutCubic) ? DG.UIKit.easeOutCubic(_openT) : 1;
    const boxY  = H - BOX_H - 4 + Math.round((1 - ease) * 14);
    ctx.save();
    ctx.globalAlpha = Math.min(1, 0.25 + ease * 0.75);

    // Paneel in design-systeem stijl (pixel-borders)
    if (DG.UIKit) {
      DG.UIKit.panel(ctx, 4, boxY, bw, BOX_H);
    } else {
      ctx.fillStyle = 'rgba(10,16,38,0.94)';
      ctx.fillRect(4, boxY, bw, BOX_H);
    }

    // Text shadow then text
    const start = _page * 2;
    const end   = Math.min(_lines.length, start + 2);
    const pageLines = _lines.slice(start, end);

    ctx.textAlign = 'left'; // expliciet — bescherm tegen gelekte align-state
    let charsLeft = _charIdx;
    for (let i = 0; i < pageLines.length; i++) {
      const line    = pageLines[i];
      const visible = line.substring(0, charsLeft);
      charsLeft     = Math.max(0, charsLeft - line.length);
      // Shadow
      ctx.fillStyle = 'rgba(0,0,60,0.7)';
      ctx.font      = FONT;
      ctx.textBaseline = 'top';
      ctx.fillText(visible, 5 + BOX_PAD + 1, boxY + BOX_PAD + i * LINE_H + 1);
      // Text
      ctx.fillStyle = '#f0f8ff';
      ctx.fillText(visible, 5 + BOX_PAD, boxY + BOX_PAD + i * LINE_H);
    }

    // Advance hint (blinking) — show "[Enter]" so the player knows what to press
    if (_waitInput && _arrow < 40) {
      const pulse = Math.sin(_arrow * 0.15) * 0.3 + 0.7;
      // Float up/down slightly using sine of _arrow
      const floatY = Math.sin(_arrow * 0.25) * 2;
      const hintText = '[Enter] ▼';
      const hintX = W - 8;
      const hintY = boxY + BOX_H - 12 + floatY;
      ctx.font = '11px monospace';
      // Measure text for background pill
      const tw = ctx.measureText(hintText).width;
      const padX = 4, padY = 2;
      // Background pill
      ctx.fillStyle = `rgba(0,0,40,0.6)`;
      ctx.beginPath();
      const pillX = hintX - tw - padX;
      const pillY = hintY - padY;
      const pillW = tw + padX * 2;
      const pillH = 13;
      const pillR = 3;
      ctx.moveTo(pillX + pillR, pillY);
      ctx.lineTo(pillX + pillW - pillR, pillY);
      ctx.quadraticCurveTo(pillX + pillW, pillY, pillX + pillW, pillY + pillR);
      ctx.lineTo(pillX + pillW, pillY + pillH - pillR);
      ctx.quadraticCurveTo(pillX + pillW, pillY + pillH, pillX + pillW - pillR, pillY + pillH);
      ctx.lineTo(pillX + pillR, pillY + pillH);
      ctx.quadraticCurveTo(pillX, pillY + pillH, pillX, pillY + pillH - pillR);
      ctx.lineTo(pillX, pillY + pillR);
      ctx.quadraticCurveTo(pillX, pillY, pillX + pillR, pillY);
      ctx.closePath();
      ctx.fill();
      // Hint text
      ctx.fillStyle = `rgba(136,221,255,${pulse})`;
      ctx.textAlign = 'right';
      ctx.fillText(hintText, hintX, hintY);
      ctx.textAlign = 'left';
    }

    ctx.restore();
  }

  // ── Helpers ───────────────────────────────────────────────
  function _roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  function isVisible() { return _visible; }

  console.log('[DinoMon] DialogueBox v9 loaded.');

  return { show, update, draw, isVisible };
})();

// DinoMon: Fossil Frontier — ui/uiKit.js
// FASE 1 "Juice & Feel" — design system fundament:
//  • Procedurele bitmap-pixelfont (5x7) met globale fillText/measureText-hook
//  • Kleurtokens + paneel-helper (pixel-borders, 9-slice look)
//  • String-cache zodat tekst-rendering goedkoper wordt dan native fillText

window.DG = window.DG || {};

DG.UIKit = (function () {

  // ── Kleurtokens ────────────────────────────────────────────
  const COLORS = {
    PANEL_BG:     'rgba(10,16,38,0.94)',
    PANEL_BG_LT:  'rgba(22,34,66,0.94)',
    BORDER_HI:    '#9fd0f5',
    BORDER:       '#3e74b0',
    BORDER_DK:    '#13233f',
    TEXT:         '#ffffff',
    TEXT_DIM:     '#9ab4d4',
    ACCENT:       '#e94560',
    GOLD:         '#ffd75e',
    GREEN:        '#5ade7c',
  };

  // ── Pixelfont glyphs ───────────────────────────────────────
  // 5 breed × 7 hoog. Elke glyph = 7 rijen, elk een 5-bit getal (MSB = links).
  const G = {
    'A':[0b01110,0b10001,0b10001,0b11111,0b10001,0b10001,0b10001],
    'B':[0b11110,0b10001,0b10001,0b11110,0b10001,0b10001,0b11110],
    'C':[0b01110,0b10001,0b10000,0b10000,0b10000,0b10001,0b01110],
    'D':[0b11110,0b10001,0b10001,0b10001,0b10001,0b10001,0b11110],
    'E':[0b11111,0b10000,0b10000,0b11110,0b10000,0b10000,0b11111],
    'F':[0b11111,0b10000,0b10000,0b11110,0b10000,0b10000,0b10000],
    'G':[0b01110,0b10001,0b10000,0b10111,0b10001,0b10001,0b01111],
    'H':[0b10001,0b10001,0b10001,0b11111,0b10001,0b10001,0b10001],
    'I':[0b01110,0b00100,0b00100,0b00100,0b00100,0b00100,0b01110],
    'J':[0b00111,0b00010,0b00010,0b00010,0b00010,0b10010,0b01100],
    'K':[0b10001,0b10010,0b10100,0b11000,0b10100,0b10010,0b10001],
    'L':[0b10000,0b10000,0b10000,0b10000,0b10000,0b10000,0b11111],
    'M':[0b10001,0b11011,0b10101,0b10101,0b10001,0b10001,0b10001],
    'N':[0b10001,0b11001,0b10101,0b10011,0b10001,0b10001,0b10001],
    'O':[0b01110,0b10001,0b10001,0b10001,0b10001,0b10001,0b01110],
    'P':[0b11110,0b10001,0b10001,0b11110,0b10000,0b10000,0b10000],
    'Q':[0b01110,0b10001,0b10001,0b10001,0b10101,0b10010,0b01101],
    'R':[0b11110,0b10001,0b10001,0b11110,0b10100,0b10010,0b10001],
    'S':[0b01111,0b10000,0b10000,0b01110,0b00001,0b00001,0b11110],
    'T':[0b11111,0b00100,0b00100,0b00100,0b00100,0b00100,0b00100],
    'U':[0b10001,0b10001,0b10001,0b10001,0b10001,0b10001,0b01110],
    'V':[0b10001,0b10001,0b10001,0b10001,0b10001,0b01010,0b00100],
    'W':[0b10001,0b10001,0b10001,0b10101,0b10101,0b11011,0b10001],
    'X':[0b10001,0b10001,0b01010,0b00100,0b01010,0b10001,0b10001],
    'Y':[0b10001,0b10001,0b01010,0b00100,0b00100,0b00100,0b00100],
    'Z':[0b11111,0b00001,0b00010,0b00100,0b01000,0b10000,0b11111],
    'a':[0b00000,0b00000,0b01110,0b00001,0b01111,0b10001,0b01111],
    'b':[0b10000,0b10000,0b11110,0b10001,0b10001,0b10001,0b11110],
    'c':[0b00000,0b00000,0b01110,0b10001,0b10000,0b10001,0b01110],
    'd':[0b00001,0b00001,0b01111,0b10001,0b10001,0b10001,0b01111],
    'e':[0b00000,0b00000,0b01110,0b10001,0b11111,0b10000,0b01110],
    'f':[0b00110,0b01001,0b01000,0b11100,0b01000,0b01000,0b01000],
    'g':[0b00000,0b00000,0b01111,0b10001,0b10001,0b01111,0b00001,0b01110],
    'h':[0b10000,0b10000,0b11110,0b10001,0b10001,0b10001,0b10001],
    'i':[0b00100,0b00000,0b01100,0b00100,0b00100,0b00100,0b01110],
    'j':[0b00010,0b00000,0b00110,0b00010,0b00010,0b00010,0b10010,0b01100],
    'k':[0b10000,0b10000,0b10010,0b10100,0b11000,0b10100,0b10010],
    'l':[0b01100,0b00100,0b00100,0b00100,0b00100,0b00100,0b01110],
    'm':[0b00000,0b00000,0b11010,0b10101,0b10101,0b10101,0b10101],
    'n':[0b00000,0b00000,0b11110,0b10001,0b10001,0b10001,0b10001],
    'o':[0b00000,0b00000,0b01110,0b10001,0b10001,0b10001,0b01110],
    'p':[0b00000,0b00000,0b11110,0b10001,0b10001,0b11110,0b10000,0b10000],
    'q':[0b00000,0b00000,0b01111,0b10001,0b10001,0b01111,0b00001,0b00001],
    'r':[0b00000,0b00000,0b10110,0b11001,0b10000,0b10000,0b10000],
    's':[0b00000,0b00000,0b01111,0b10000,0b01110,0b00001,0b11110],
    't':[0b01000,0b01000,0b11100,0b01000,0b01000,0b01001,0b00110],
    'u':[0b00000,0b00000,0b10001,0b10001,0b10001,0b10011,0b01101],
    'v':[0b00000,0b00000,0b10001,0b10001,0b10001,0b01010,0b00100],
    'w':[0b00000,0b00000,0b10001,0b10101,0b10101,0b10101,0b01010],
    'x':[0b00000,0b00000,0b10001,0b01010,0b00100,0b01010,0b10001],
    'y':[0b00000,0b00000,0b10001,0b10001,0b10001,0b01111,0b00001,0b01110],
    'z':[0b00000,0b00000,0b11111,0b00010,0b00100,0b01000,0b11111],
    '0':[0b01110,0b10001,0b10011,0b10101,0b11001,0b10001,0b01110],
    '1':[0b00100,0b01100,0b00100,0b00100,0b00100,0b00100,0b01110],
    '2':[0b01110,0b10001,0b00001,0b00010,0b00100,0b01000,0b11111],
    '3':[0b11111,0b00010,0b00100,0b00010,0b00001,0b10001,0b01110],
    '4':[0b00010,0b00110,0b01010,0b10010,0b11111,0b00010,0b00010],
    '5':[0b11111,0b10000,0b11110,0b00001,0b00001,0b10001,0b01110],
    '6':[0b00110,0b01000,0b10000,0b11110,0b10001,0b10001,0b01110],
    '7':[0b11111,0b00001,0b00010,0b00100,0b01000,0b01000,0b01000],
    '8':[0b01110,0b10001,0b10001,0b01110,0b10001,0b10001,0b01110],
    '9':[0b01110,0b10001,0b10001,0b01111,0b00001,0b00010,0b01100],
    ' ':[0,0,0,0,0,0,0],
    '.':[0,0,0,0,0,0b01100,0b01100],
    ',':[0,0,0,0,0,0b01100,0b00100,0b01000],
    '!':[0b00100,0b00100,0b00100,0b00100,0b00100,0b00000,0b00100],
    '?':[0b01110,0b10001,0b00001,0b00010,0b00100,0b00000,0b00100],
    ':':[0,0b01100,0b01100,0,0b01100,0b01100,0],
    ';':[0,0b01100,0b01100,0,0b01100,0b00100,0b01000],
    "'":[0b00100,0b00100,0b01000,0,0,0,0],
    '"':[0b01010,0b01010,0b10100,0,0,0,0],
    '(':[0b00010,0b00100,0b01000,0b01000,0b01000,0b00100,0b00010],
    ')':[0b01000,0b00100,0b00010,0b00010,0b00010,0b00100,0b01000],
    '[':[0b01110,0b01000,0b01000,0b01000,0b01000,0b01000,0b01110],
    ']':[0b01110,0b00010,0b00010,0b00010,0b00010,0b00010,0b01110],
    '/':[0b00001,0b00001,0b00010,0b00100,0b01000,0b10000,0b10000],
    '\\':[0b10000,0b10000,0b01000,0b00100,0b00010,0b00001,0b00001],
    '-':[0,0,0,0b01110,0,0,0],
    '—':[0,0,0,0b11111,0,0,0], // em-dash
    '–':[0,0,0,0b11110,0,0,0], // en-dash
    '+':[0,0b00100,0b00100,0b11111,0b00100,0b00100,0],
    '=':[0,0,0b11111,0,0b11111,0,0],
    '_':[0,0,0,0,0,0,0b11111],
    '*':[0,0b10101,0b01110,0b11111,0b01110,0b10101,0],
    '%':[0b11001,0b11010,0b00010,0b00100,0b01000,0b01011,0b10011],
    '$':[0b00100,0b01111,0b10100,0b01110,0b00101,0b11110,0b00100],
    '#':[0b01010,0b01010,0b11111,0b01010,0b11111,0b01010,0b01010],
    '&':[0b01100,0b10010,0b10100,0b01000,0b10101,0b10010,0b01101],
    '@':[0b01110,0b10001,0b10111,0b10101,0b10111,0b10000,0b01110],
    '<':[0b00010,0b00100,0b01000,0b10000,0b01000,0b00100,0b00010],
    '>':[0b01000,0b00100,0b00010,0b00001,0b00010,0b00100,0b01000],
    '|':[0b00100,0b00100,0b00100,0b00100,0b00100,0b00100,0b00100],
    '~':[0,0,0b01000,0b10101,0b00010,0,0],
    '^':[0b00100,0b01010,0b10001,0,0,0,0],
    '{':[0b00110,0b00100,0b00100,0b01000,0b00100,0b00100,0b00110],
    '}':[0b01100,0b00100,0b00100,0b00010,0b00100,0b00100,0b01100],
    '…':[0,0,0,0,0,0b10101,0b10101], // …
    '→':[0,0b00100,0b00010,0b11111,0b00010,0b00100,0],   // →
    '←':[0,0b00100,0b01000,0b11111,0b01000,0b00100,0],   // ←
    '↑':[0b00100,0b01110,0b10101,0b00100,0b00100,0b00100,0b00100], // ↑
    '↓':[0b00100,0b00100,0b00100,0b00100,0b10101,0b01110,0b00100], // ↓
    '▶':[0b01000,0b01100,0b01110,0b01111,0b01110,0b01100,0b01000], // ▶
    '◀':[0b00010,0b00110,0b01110,0b11110,0b01110,0b00110,0b00010], // ◀
    '▸':[0b01000,0b01100,0b01110,0b01111,0b01110,0b01100,0b01000], // ▸
    '★':[0b00100,0b00100,0b11111,0b01110,0b01110,0b11011,0b00000], // ★
    '×':[0,0b10001,0b01010,0b00100,0b01010,0b10001,0],   // ×
    'é':[0b00010,0b00100,0b01110,0b10001,0b11111,0b10000,0b01110], // é
    'è':[0b01000,0b00100,0b01110,0b10001,0b11111,0b10000,0b01110], // è
  };

  const GLYPH_W = 5, GLYPH_H = 7, ADV = 6; // advance per teken (5 + 1 spatie)

  // ── Font-grootte → integer pixelschaal ─────────────────────
  // Klein UI-werk blijft scale 1 (past altijd binnen bestaande layouts);
  // koppen/grote tekst krijgt scale 2/3.
  function _scaleFor(px) {
    if (px >= 26) return 3;
    if (px >= 15) return 2;
    return 1;
  }

  function _parseFont(fontStr) {
    // bv. "bold 13px monospace"
    const m = /(\d+(?:\.\d+)?)px/.exec(fontStr || '');
    const px = m ? parseFloat(m[1]) : 12;
    const bold = /bold|900|800|700/.test(fontStr || '');
    return { px, bold, scale: _scaleFor(px) };
  }

  // ── String-cache (gerenderde runs als offscreen canvas) ────
  const _cache = new Map();
  const CACHE_MAX = 600;

  function _renderRun(text, color, scale, bold) {
    const key = text + '|' + color + '|' + scale + '|' + (bold ? 1 : 0);
    let cv = _cache.get(key);
    if (cv) return cv;
    if (_cache.size > CACHE_MAX) _cache.clear(); // simpele reset, herbouwt vanzelf
    const w = Math.max(1, text.length * ADV * scale + (bold ? scale : 0));
    const h = (GLYPH_H + 1) * scale; // +1 rij voor komma/descender-uitloop
    cv = document.createElement('canvas');
    cv.width = w; cv.height = h;
    const c = cv.getContext('2d');
    c.fillStyle = color;
    let x = 0;
    for (const ch of text) {
      const rows = G[ch];
      if (rows) {
        for (let pass = 0; pass <= (bold ? 1 : 0); pass++) {
          for (let r = 0; r < rows.length; r++) {
            const bits = rows[r];
            if (!bits) continue;
            for (let col = 0; col < GLYPH_W; col++) {
              if (bits & (1 << (GLYPH_W - 1 - col))) {
                c.fillRect(x + col * scale + pass, r * scale, scale, scale);
              }
            }
          }
        }
      }
      x += ADV * scale;
    }
    _cache.set(key, cv);
    return cv;
  }

  // ── Globale fillText/measureText hook ─────────────────────
  const _proto = (typeof CanvasRenderingContext2D !== 'undefined') ? CanvasRenderingContext2D.prototype : null;
  const _origFill    = _proto ? _proto.fillText : null;
  const _origMeasure = _proto ? _proto.measureText : null;
  let _enabled = true;

  function _splitRuns(text) {
    // Splits in runs van [pixelfont-tekens] en [onbekende tekens → native fallback]
    const runs = [];
    let cur = '', curKnown = null;
    for (const ch of String(text)) {
      const known = !!G[ch];
      if (curKnown === null || known === curKnown) { cur += ch; curKnown = known; }
      else { runs.push({ t: cur, known: curKnown }); cur = ch; curKnown = known; }
    }
    if (cur) runs.push({ t: cur, known: curKnown });
    return runs;
  }

  function _runWidth(ctx, run, scale) {
    if (run.known) return run.t.length * ADV * scale;
    return _origMeasure.call(ctx, run.t).width;
  }

  function _pixelFillText(text, x, y, maxWidth) {
    const ctx = this;
    if (!_enabled || typeof ctx.fillStyle !== 'string') {
      return _origFill.call(ctx, text, x, y, maxWidth);
    }
    const f = _parseFont(ctx.font);
    const runs = _splitRuns(text);
    let total = 0;
    for (const r of runs) total += _runWidth(ctx, r, f.scale);

    // textAlign
    let sx = x;
    const align = ctx.textAlign;
    if (align === 'center') sx = x - total / 2;
    else if (align === 'right' || align === 'end') sx = x - total;

    // textBaseline → top-positie van glyphblok
    let sy = y;
    const bl = ctx.textBaseline;
    const gh = GLYPH_H * f.scale;
    if (bl === 'middle') sy = y - gh / 2;
    else if (bl === 'alphabetic' || bl === 'ideographic') sy = y - gh;
    else if (bl === 'bottom') sy = y - (GLYPH_H + 1) * f.scale;
    // 'top' / 'hanging' → y blijft y

    sx = Math.round(sx); sy = Math.round(sy);

    for (const r of runs) {
      if (r.known) {
        const cv = _renderRun(r.t, ctx.fillStyle, f.scale, f.bold);
        ctx.drawImage(cv, sx, sy);
        sx += r.t.length * ADV * f.scale;
      } else {
        // native fallback (emoji e.d.) — teken op de tekst-baseline
        const pa = ctx.textAlign;
        ctx.textAlign = 'left';
        _origFill.call(ctx, r.t, sx, sy + gh, maxWidth);
        ctx.textAlign = pa;
        sx += _origMeasure.call(ctx, r.t).width;
      }
    }
  }

  function _pixelMeasureText(text) {
    const ctx = this;
    if (!_enabled) return _origMeasure.call(ctx, text);
    const f = _parseFont(ctx.font);
    const runs = _splitRuns(text);
    let total = 0;
    for (const r of runs) total += _runWidth(ctx, r, f.scale);
    return { width: total };
  }

  if (_proto && _origFill && !_proto.__DG_PIXELFONT__) {
    _proto.fillText    = _pixelFillText;
    _proto.measureText = _pixelMeasureText;
    _proto.__DG_PIXELFONT__ = true;
  }

  // ── Paneel-helper: 9-slice-stijl pixel-border ──────────────
  // opts: { bg, borderHi, border, borderDk, accent (bool), notch (px hoekje) }
  function panel(ctx, x, y, w, h, opts) {
    opts = opts || {};
    const bg  = opts.bg  || COLORS.PANEL_BG;
    const bHi = opts.borderHi || COLORS.BORDER_HI;
    const bMd = opts.border   || COLORS.BORDER;
    const bDk = opts.borderDk || COLORS.BORDER_DK;
    x = Math.round(x); y = Math.round(y); w = Math.round(w); h = Math.round(h);

    // Achtergrond
    ctx.fillStyle = bg;
    ctx.fillRect(x + 2, y + 2, w - 4, h - 4);

    // Buitenrand (donker)
    ctx.fillStyle = bDk;
    ctx.fillRect(x + 2, y,     w - 4, 1); // top
    ctx.fillRect(x + 2, y + h - 1, w - 4, 1); // bottom
    ctx.fillRect(x,     y + 2, 1, h - 4); // left
    ctx.fillRect(x + w - 1, y + 2, 1, h - 4); // right

    // Middenrand
    ctx.fillStyle = bMd;
    ctx.fillRect(x + 2, y + 1, w - 4, 1);
    ctx.fillRect(x + 2, y + h - 2, w - 4, 1);
    ctx.fillRect(x + 1, y + 2, 1, h - 4);
    ctx.fillRect(x + w - 2, y + 2, 1, h - 4);

    // Hoek-pixels (afgeronde pixel-look)
    ctx.fillRect(x + 1, y + 1, 1, 1);
    ctx.fillRect(x + w - 2, y + 1, 1, 1);
    ctx.fillRect(x + 1, y + h - 2, 1, 1);
    ctx.fillRect(x + w - 2, y + h - 2, 1, 1);

    // Binnenrand-highlight (boven + links, geeft diepte)
    ctx.fillStyle = bHi;
    ctx.globalAlpha *= 0.35;
    ctx.fillRect(x + 2, y + 2, w - 4, 1);
    ctx.fillRect(x + 2, y + 2, 1, h - 4);
    ctx.globalAlpha /= 0.35;

    // Optioneel accentlijntje linksboven (titel-indicator)
    if (opts.accent) {
      ctx.fillStyle = opts.accentColor || COLORS.ACCENT;
      ctx.fillRect(x + 4, y + 4, 3, 3);
    }
  }

  // ── Battle-wipe: retro blinds + flits, aangestuurd door progress 0→1 ──
  function battleWipe(ctx, a, W, H) {
    if (a <= 0) return;
    // Fase 1 (0–0.35): twee witte schermflitsen
    if (a < 0.35) {
      const fl = Math.abs(Math.sin(a * Math.PI * 2 / 0.35));
      ctx.fillStyle = 'rgba(255,255,255,' + (fl * 0.85).toFixed(3) + ')';
      ctx.fillRect(0, 0, W, H);
    }
    // Fase 2 (0.2–1): venetiaanse blinds die om-en-om dichtschuiven
    if (a > 0.2) {
      const t = easeOutCubic((a - 0.2) / 0.8);
      const BARS = 8;
      const bh = Math.ceil(H / BARS);
      ctx.fillStyle = '#000000';
      for (let i = 0; i < BARS; i++) {
        const bw = Math.ceil(t * W);
        if (i % 2 === 0) ctx.fillRect(0, i * bh, bw, bh);          // van links
        else             ctx.fillRect(W - bw, i * bh, bw, bh);     // van rechts
      }
    }
  }

  // ── Easing helpers (voor transities/juice elders) ──────────
  function easeOutCubic(t) { t = Math.max(0, Math.min(1, t)); return 1 - Math.pow(1 - t, 3); }
  function easeOutBack(t)  {
    t = Math.max(0, Math.min(1, t));
    const c1 = 1.70158, c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  }

  return {
    COLORS,
    panel,
    battleWipe,
    easeOutCubic,
    easeOutBack,
    setPixelFont: function (on) { _enabled = !!on; },
    isPixelFont:  function () { return _enabled; },
  };

})();

// DinoMon: Fossil Frontier — ui/dexMenu.js
// DinoMon Dex screen  (v10 — styled filter tabs with counts and navigation hints)

window.DG = window.DG || {};

DG.DexMenu = (function () {

  let _gs      = null;
  let _onClose = null;
  let _cursor  = 0;
  let _scroll  = 0;
  let _detail  = false; // showing detail view
  const VISIBLE = 8; // reduced by 1 to make room for tab bar

  // Tab state: 0=ALL, 1=SEEN, 2=CAUGHT
  const TABS = ['ALL', 'SEEN', 'CAUGHT'];
  let _tab = 0;

  // Ordered species list (all species IDs in order)
  let _allSpecies = [];
  let _speciesList = []; // filtered by tab

  function _buildList(gs) {
    const dex = gs ? gs.player.dex : {};
    if (_tab === 0) {
      _speciesList = _allSpecies.slice();
    } else if (_tab === 1) {
      _speciesList = _allSpecies.filter(id => dex[id] && dex[id].seen);
    } else {
      _speciesList = _allSpecies.filter(id => dex[id] && dex[id].caught);
    }
  }

  function open(gameState, onClose) {
    _gs      = gameState;
    _onClose = onClose;
    _cursor  = 0;
    _scroll  = 0;
    _detail  = false;
    _tab     = 0;
    _allSpecies = Object.keys(DG.SPECIES);
    _buildList(_gs);
  }

  function update(dt) {
    if (!_gs) return;

    if (_detail) {
      if (DG.Input.isPressed('B') || DG.Input.isPressed('A')) {
        _detail = false;
      }
      return;
    }

    // LEFT/RIGHT: cycle tabs
    if (DG.Input.isPressed('LEFT')) {
      _tab = (_tab + TABS.length - 1) % TABS.length;
      _cursor = 0; _scroll = 0;
      _buildList(_gs);
    }
    if (DG.Input.isPressed('RIGHT')) {
      _tab = (_tab + 1) % TABS.length;
      _cursor = 0; _scroll = 0;
      _buildList(_gs);
    }

    const len = _speciesList.length;
    if (DG.Input.isPressed('UP')) {
      _cursor = Math.max(0, _cursor - 1);
      if (_cursor < _scroll) _scroll = _cursor;
    }
    if (DG.Input.isPressed('DOWN')) {
      _cursor = Math.min(Math.max(0, len - 1), _cursor + 1);
      if (_cursor >= _scroll + VISIBLE) _scroll = _cursor - VISIBLE + 1;
    }
    if (DG.Input.isPressed('A')) {
      const id = _speciesList[_cursor];
      if (id && _gs.player.dex[id]) _detail = true;
    }
    if (DG.Input.isPressed('B') || DG.Input.isPressed('START')) {
      const cb = _onClose; _onClose = null;
      if (typeof cb === 'function') cb();
    }
  }

  // ── Tab color palette ────────────────────────────────────────
  const TAB_ACTIVE_BG   = { ALL:'#2a3a6a', SEEN:'#2a4a3a', CAUGHT:'#1a3a1a' };
  const TAB_ACTIVE_TEXT = { ALL:'#8ed8f8', SEEN:'#88ffaa', CAUGHT:'#44ff44' };

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

  function draw(ctx) {
    const W = DG.CANVAS.W, H = DG.CANVAS.H;

    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = '#8ed8f8';
    ctx.lineWidth = 2;
    ctx.strokeRect(2, 2, W - 4, H - 4);

    if (_detail) {
      _drawDetail(ctx);
      return;
    }

    const dex = _gs ? _gs.player.dex : {};
    const totalSpecies = _allSpecies.length;
    const seenCount   = Object.values(dex).filter(e => e.seen).length;
    const caughtCount = Object.values(dex).filter(e => e.caught).length;
    const pct = totalSpecies > 0 ? Math.floor((caughtCount / totalSpecies) * 100) : 0;

    // Header: completion stats (compact, single line)
    ctx.fillStyle = '#8ed8f8';
    ctx.font = 'bold 9px monospace';
    ctx.textBaseline = 'top';
    ctx.fillText(`Seen:${seenCount}  Caught:${caughtCount}/${totalSpecies}  (${pct}%)`, 8, 5);

    // ── Styled tab bar ───────────────────────────────────────
    // Counts per tab
    const tabCounts = [totalSpecies, seenCount, caughtCount];
    const tabLabels = ['ALL', 'SEEN', 'CAUGHT'];

    // Available width for tabs, leaving room for ◄ ► hint arrows
    const arrowW   = 14;
    const tabAreaX = 8 + arrowW;
    const tabAreaW = W - 16 - arrowW * 2;
    const tabH     = 15;
    const tabY     = 16;
    const tabW     = Math.floor(tabAreaW / TABS.length);

    // Left arrow hint
    ctx.fillStyle = '#556688';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('◄', 8 + arrowW / 2, tabY + tabH / 2);

    TABS.forEach((label, idx) => {
      const tx     = tabAreaX + idx * tabW;
      const active = idx === _tab;
      const count  = tabCounts[idx];
      const tabText = `${label}(${count})`;

      // Background fill
      ctx.fillStyle = active ? (TAB_ACTIVE_BG[label] || '#2a3a6a') : '#1a1a2a';
      _roundRect(ctx, tx + 1, tabY, tabW - 2, tabH, 4);
      ctx.fill();

      // Border
      ctx.strokeStyle = active ? '#ffffff' : '#333355';
      ctx.lineWidth   = active ? 1.5 : 1;
      _roundRect(ctx, tx + 1, tabY, tabW - 2, tabH, 4);
      ctx.stroke();

      // Label text
      ctx.fillStyle   = active ? (TAB_ACTIVE_TEXT[label] || '#ffffff') : '#777799';
      ctx.font        = (active ? 'bold ' : '') + '8px monospace';
      ctx.textAlign   = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(tabText, tx + tabW / 2, tabY + tabH / 2);
    });

    // Right arrow hint
    ctx.fillStyle = '#556688';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('►', W - 8 - arrowW / 2, tabY + tabH / 2);

    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    // ── List ─────────────────────────────────────────────────
    const listStartY = 34;
    const rowH = 26;
    if (_speciesList.length === 0) {
      ctx.fillStyle = '#556677';
      ctx.font = '11px monospace';
      ctx.fillText('No entries in this tab.', 20, listStartY + 20);
    }
    const slice = _speciesList.slice(_scroll, _scroll + VISIBLE);
    slice.forEach((id, i) => {
      const realIdx = i + _scroll;
      const globalIdx = _allSpecies.indexOf(id);
      const entry   = dex[id];
      const sp      = DG.SPECIES[id];
      const y       = listStartY + i * rowH;
      const isCaught = entry && entry.caught;
      const isSeen   = entry && entry.seen;

      ctx.fillStyle = realIdx === _cursor ? '#2a2a50' : '#16213e';
      ctx.fillRect(6, y, W - 12, rowH - 2);
      ctx.strokeStyle = realIdx === _cursor ? '#FFE050' : '#4a6fa5';
      ctx.lineWidth = 1;
      ctx.strokeRect(6, y, W - 12, rowH - 2);

      // Number
      ctx.fillStyle = '#666';
      ctx.font = '11px monospace';
      ctx.fillText(`#${String(globalIdx + 1).padStart(3,'0')}`, 10, y + 5);

      // Name: grey if seen-not-caught, white if caught, dark if unknown
      if (isCaught) {
        ctx.fillStyle = realIdx === _cursor ? '#FFE050' : '#ffffff';
      } else if (isSeen) {
        ctx.fillStyle = realIdx === _cursor ? '#cccc88' : '#999977';
      } else {
        ctx.fillStyle = '#444455';
      }
      ctx.font = '12px monospace';
      ctx.fillText(isSeen ? (sp ? sp.name : id) : '???', 56, y + 5);

      // Secondary info: type or "?? / ??"
      if (isCaught && sp && sp.types) {
        ctx.fillStyle = '#778899';
        ctx.font = '9px monospace';
        ctx.fillText(sp.types.join('/'), 56, y + 16);
      } else if (isSeen && !isCaught) {
        ctx.fillStyle = '#555566';
        ctx.font = '9px monospace';
        ctx.fillText('?? / ??', 56, y + 16);
      }

      // Caught/seen icon
      if (isCaught) {
        ctx.fillStyle = '#40c040';
        ctx.font = '10px monospace';
        ctx.fillText('●', W - 22, y + 5);
        // EVO-STAGE: fossiel-pips rechts in de rij (alleen bij caught)
        if (DG.UIKit && DG.UIKit.drawStagePips) {
          DG.UIKit.drawStagePips(ctx, W - 66, y + 9, id, { size: 6, gap: 3 });
        }
      } else if (isSeen) {
        ctx.fillStyle = '#888';
        ctx.font = '10px monospace';
        ctx.fillText('○', W - 22, y + 5);
      }

      // Tiny sprite or silhouette
      if (typeof DG.SpriteRenderer !== 'undefined') {
        if (isSeen) {
          DG.SpriteRenderer.drawMon(ctx, id, 36, y + 2, 0.6);
          // Darken if seen but not caught
          if (!isCaught) {
            ctx.fillStyle = 'rgba(10,10,30,0.65)';
            ctx.fillRect(28, y + 2, 20, 20);
          }
        } else {
          ctx.fillStyle = '#1a1a2e';
          ctx.fillRect(28, y + 2, 20, 20);
          ctx.strokeStyle = '#334455';
          ctx.lineWidth = 1;
          ctx.strokeRect(28, y + 2, 20, 20);
          ctx.fillStyle = '#334466';
          ctx.font = '12px monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('?', 38, y + 12);
          ctx.textAlign = 'left';
          ctx.textBaseline = 'top';
        }
      }
    });

    // Scroll indicators
    if (_scroll > 0) { ctx.fillStyle = '#8ed8f8'; ctx.font = '11px monospace'; ctx.fillText('▲', W - 14, listStartY); }
    if (_scroll + VISIBLE < _speciesList.length) { ctx.fillStyle = '#8ed8f8'; ctx.font = '11px monospace'; ctx.fillText('▼', W - 14, H - 20); }

    ctx.fillStyle = '#555566';
    ctx.font = '9px monospace';
    ctx.fillText('[◄►] Tab  [ENTER] Details  [ESC] Back', 8, H - 10);
  }

  function _drawDetail(ctx) {
    const W = DG.CANVAS.W, H = DG.CANVAS.H;
    const id    = _speciesList[_cursor];
    const sp    = DG.SPECIES[id];
    const entry = _gs.player.dex[id];
    if (!sp || !entry) return;

    const isCaught = !!(entry && entry.caught);
    const isSeen   = !!(entry && entry.seen);

    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = '#5a9fd4';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(2, 2, W - 4, H - 4);

    // ── Sprite area (left side) ───────────────────────────────
    if (typeof DG.SpriteRenderer !== 'undefined') {
      DG.SpriteRenderer.drawMon(ctx, id, 16, 16, 2.5);
      if (!isCaught) {
        // Darken to silhouette for seen-but-not-caught
        ctx.fillStyle = 'rgba(5,5,20,0.78)';
        ctx.fillRect(12, 12, 94, 94);
      }
    }

    // ── Name header ───────────────────────────────────────────
    ctx.textBaseline = 'top';
    if (isCaught) {
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px monospace';
      ctx.fillText(sp.name, 120, 16);
    } else {
      // seen but not caught: show name in grey
      ctx.fillStyle = '#778899';
      ctx.font = 'bold 16px monospace';
      ctx.fillText(sp.name, 120, 16);
      ctx.fillStyle = '#556677';
      ctx.font = '11px monospace';
      ctx.fillText('Not yet caught', 120, 36);
    }

    // ── Types (color-coded badges) ────────────────────────────
    const TYPE_COLORS = {
      FIRE:'#ff5533', WATER:'#3377ff', GRASS:'#33aa33', ROCK:'#aa8833',
      GROUND:'#cc8833', PSYCHIC:'#ee33bb', DRAGON:'#6644cc', NORMAL:'#888888',
      ELECTRIC:'#ddbb00', ICE:'#44ccdd', POISON:'#aa44aa', FLYING:'#5588cc',
      BUG:'#88aa33', GHOST:'#554488', STEEL:'#8899aa', DARK:'#443355',
      FAIRY:'#dd77aa',
    };
    const ty = isCaught ? 36 : 52;
    if (isCaught && sp.types) {
      let tx = 120;
      for (const t of sp.types) {
        const tw = 56;
        ctx.fillStyle = TYPE_COLORS[t] || '#556677';
        _roundRect(ctx, tx, ty, tw, 16, 4);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(t, tx + tw / 2, ty + 8);
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        tx += tw + 6;
      }
      // ── Tier badge: MEGA (Megavore/Titanrex) or LEGENDARY (the other three) ──
      if (sp.isMega || sp.isLegendary) {
        const _isM = !!sp.isMega;
        const _lbl = _isM ? 'MEGA' : 'LEGENDARY';
        ctx.font = 'bold 10px monospace';
        const _bw = Math.ceil(ctx.measureText(_lbl).width) + 14;
        ctx.save();
        ctx.shadowColor = _isM ? '#ff3b5c' : '#b58cff';
        ctx.shadowBlur = 8;
        ctx.fillStyle = _isM ? '#ff2d55' : '#7a4fd6';
        _roundRect(ctx, tx, ty, _bw, 16, 4);
        ctx.fill();
        ctx.restore();
        ctx.strokeStyle = _isM ? '#ffd24a' : '#e6d8ff';
        ctx.lineWidth = 1;
        _roundRect(ctx, tx, ty, _bw, 16, 4);
        ctx.stroke();
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(_lbl, tx + _bw / 2, ty + 8);
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
      }
    } else if (isSeen) {
      // Seen but not caught: show ?? placeholders
      ctx.fillStyle = '#445566';
      _roundRect(ctx, 120, ty, 56, 16, 4);
      ctx.fill();
      ctx.fillStyle = '#889aaa';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('??', 148, ty + 8);
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
    }

    // ── Stats (only if caught) ────────────────────────────────
    if (isCaught) {
      ctx.fillStyle = '#aaffaa';
      ctx.font = '10px monospace';
      ctx.textBaseline = 'top';
      ctx.fillText(`HP:${sp.baseStats.hp}  ATK:${sp.baseStats.atk}  DEF:${sp.baseStats.def}`, 120, 58);
      ctx.fillText(`SpA:${sp.baseStats.spAtk}  SpD:${sp.baseStats.spDef}  SPD:${sp.baseStats.spd}`, 120, 72);
      ctx.fillStyle = '#8ed8f8';
      ctx.fillText(`Ability: ${sp.ability || '—'}`, 120, 86);
    }

    // ── Description ───────────────────────────────────────────
    const descY = 118;
    ctx.fillStyle = '#888';
    ctx.font = '10px monospace';
    ctx.fillText('DEX ENTRY', 12, descY - 12);
    ctx.strokeStyle = '#334455';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(12, descY - 2); ctx.lineTo(W - 12, descY - 2); ctx.stroke();
    ctx.fillStyle = '#cccccc';
    ctx.font = '11px monospace';
    if (isCaught) {
      const desc = sp.desc || sp.description || 'A DinoMon awakened from ancient fossils by Primordial Aura.';
      _wrapText(ctx, desc, 12, descY, W - 24, 14);
    } else if (isSeen) {
      ctx.fillStyle = '#778899';
      _wrapText(ctx, 'This DinoMon has been spotted in the wild.', 12, descY, W - 24, 14);
    } else {
      ctx.fillStyle = '#334455';
      ctx.fillText('Encounter this DinoMon to unlock its entry.', 12, descY);
    }

    // ── Habitat (where to find) ───────────────────────────────
    if (isSeen && sp.habitat) {
      ctx.fillStyle = '#8ed8f8';
      ctx.font = '10px monospace';
      ctx.fillText(`Found: ${sp.habitat}`, 12, H - 40);
    }

    // ── Evolution chain ───────────────────────────────────────
    // EVO-STAGE: volledige lijn met mini-sprites + voorwaarde per stap.
    // Dekt ook steen/happiness/ruil/item-lijnen (de oude regel kende alleen
    // level-evoluties); niet-geziene vormen blijven silhouet met "?".
    if (isCaught && DG.UIKit && DG.UIKit.drawEvoChainStrip) {
      const _evoInfo = DG.EvoChain ? DG.EvoChain.get(id) : null;
      if (_evoInfo && _evoInfo.total > 1) {
        ctx.fillStyle = '#ffcc44';
        ctx.font = 'bold 9px monospace';
        ctx.fillText(`EVOLUTION LINE — STAGE ${_evoInfo.stage}/${_evoInfo.total}`, 12, H - 112);
        DG.UIKit.drawEvoChainStrip(ctx, 12, H - 100, W - 24, id, _gs,
          { nodeSize: 36, showHows: true });
      }
    }

    ctx.fillStyle = '#556677';
    ctx.font = '10px monospace';
    ctx.fillText('[ESC] Back', 12, H - 12);
  }

  // Helper: rounded rect path (no fill/stroke — caller decides)
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

  function _wrapText(ctx, text, x, y, maxW, lineH) {
    const words = text.split(' ');
    let line = '';
    let cy = y;
    for (const word of words) {
      const test = line + (line ? ' ' : '') + word;
      if (ctx.measureText(test).width > maxW && line) {
        ctx.fillText(line, x, cy);
        line = word;
        cy += lineH;
      } else {
        line = test;
      }
    }
    if (line) ctx.fillText(line, x, cy);
  }

  console.log('[DinoMon] DexMenu loaded (v10 — styled filter tabs with counts).');
  return { open, update, draw };
})();

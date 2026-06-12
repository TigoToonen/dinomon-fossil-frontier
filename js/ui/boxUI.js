// DinoMon: Fossil Frontier — ui/boxUI.js
// PC storage box — deposit, withdraw, and swap DinoMons  (v3 — swap fix when party full)

window.DG = window.DG || {};

DG.BoxUI = (function () {

  let _gs        = null;
  let _onClose   = null;
  let _panel     = 'BOX';  // 'PARTY' | 'BOX'
  let _cursor    = 0;      // index within current panel
  let _held      = null;   // { source:'BOX'|'PARTY', index:number, mon } — picked-up mon
  let _message   = '';     // status message at bottom
  let _msgTimer  = 0;

  const BOX_COLS   = 6;
  const BOX_ROWS   = 5;
  const BOX_CAP    = BOX_COLS * BOX_ROWS; // 30 per box page

  // ── Public API ────────────────────────────────────────────
  function open(gs, onClose) {
    _gs      = gs;
    _onClose = onClose;
    _panel   = 'BOX';
    _cursor  = 0;
    _held    = null;
    _message = 'A=Pick up  B=Close/Cancel';
    _msgTimer = 0;
    // Ensure box exists
    _gs.player.box = _gs.player.box || [];
  }

  function update(dt) {
    if (!_gs) return;
    if (_msgTimer > 0) _msgTimer--;

    const box   = _gs.player.box || [];
    const party = _gs.player.party;

    if (_panel === 'BOX') {
      const maxCursor = Math.max(0, Math.min(BOX_CAP - 1, box.length)); // can point to one empty slot
      if (DG.Input.isPressed('UP'))    _cursor = Math.max(0, _cursor - BOX_COLS);
      if (DG.Input.isPressed('DOWN'))  _cursor = Math.min(maxCursor, _cursor + BOX_COLS);
      if (DG.Input.isPressed('LEFT'))  {
        if (_cursor % BOX_COLS === 0) { _panel = 'PARTY'; _cursor = 0; }
        else _cursor = Math.max(0, _cursor - 1);
      }
      if (DG.Input.isPressed('RIGHT')) _cursor = Math.min(maxCursor, _cursor + 1);

      if (DG.Input.isPressed('A')) {
        if (_held) {
          _placeMon(box, party);
        } else {
          _pickUpMon(box, party);
        }
      }
    } else { // PARTY panel
      const maxP = Math.max(0, party.length - 1);
      if (DG.Input.isPressed('UP'))    _cursor = Math.max(0, _cursor - 1);
      if (DG.Input.isPressed('DOWN'))  _cursor = Math.min(maxP, _cursor + 1);
      if (DG.Input.isPressed('RIGHT')) { _panel = 'BOX'; _cursor = 0; }

      if (DG.Input.isPressed('A')) {
        if (_held) {
          _placeMonParty(box, party);
        } else {
          _pickUpMonParty(box, party);
        }
      }
    }

    if (DG.Input.isPressed('B')) {
      if (_held) {
        // Put held mon back where it came from
        _returnHeld(box, party);
      } else {
        const cb = _onClose; _onClose = null; _gs = null;
        if (typeof cb === 'function') cb();
      }
    }
  }

  // ── Pick up a mon from the box ────────────────────────────
  function _pickUpMon(box, party) {
    if (_cursor >= box.length) { _setMsg('Empty slot!'); return; }
    const mon = box[_cursor];
    if (!mon) { _setMsg('Empty slot!'); return; }
    _held = { source: 'BOX', index: _cursor, mon };
    box[_cursor] = null; // leave null placeholder
    _setMsg('Picked up! Choose where to place it.');
  }

  // ── Pick up a mon from party ──────────────────────────────
  function _pickUpMonParty(box, party) {
    if (party.length <= 1) { _setMsg('Can\'t remove last party member!'); return; }
    const mon = party[_cursor];
    if (!mon) return;
    if (mon.isEgg) { _setMsg('Eggs stay in the party until they hatch!'); return; }
    _held = { source: 'PARTY', index: _cursor, mon };
    party.splice(_cursor, 1);
    _cursor = Math.min(_cursor, party.length - 1);
    _setMsg('Picked up! Choose where to place it.');
  }

  // ── Place held mon into the box ───────────────────────────
  function _placeMon(box, party) {
    if (!_held) return;
    const mon = _held.mon;
    // Place at cursor
    if (_cursor < box.length && box[_cursor] !== null && box[_cursor] !== undefined) {
      // Swap
      const other = box[_cursor];
      box[_cursor] = mon;
      // Put swapped mon where the held came from
      if (_held.source === 'BOX') {
        box[_held.index] = other;
      } else {
        // Put back into party
        if (party.length < 6) {
          party.splice(_held.index, 0, other);
        } else {
          box.push(other);
        }
      }
      _setMsg(`Swapped ${_monName(mon)} and ${_monName(other)}!`);
    } else {
      // Place into empty slot
      while (box.length <= _cursor) box.push(null);
      box[_cursor] = mon;
      // Clean up nulls from original slot if source was BOX
      _setMsg(`${_monName(mon)} placed in box.`);
    }
    // Clean up null placeholders in box
    while (box.length > 0 && box[box.length - 1] === null) box.pop();
    _held = null;
    DG.SaveLoad.save(_gs);
  }

  // ── Place held mon into the party ─────────────────────────
  function _placeMonParty(box, party) {
    if (!_held) return;
    const mon = _held.mon;

    if (party.length >= 6) {
      // Party is full — swap held mon with the party slot at cursor
      const displaced = party[_cursor];
      if (!displaced) { _setMsg('Party is full!'); return; }
      party[_cursor] = mon;
      // Send displaced mon back to the box
      if (_held.source === 'BOX') {
        // Original slot already has a null placeholder; just clean and push
        while (box.length > 0 && box[box.length - 1] === null) box.pop();
        box.push(displaced);
      } else {
        box.push(displaced);
        while (box.length > 0 && box[box.length - 1] === null) box.pop();
      }
      _setMsg(`Swapped ${_monName(mon)} ↔ ${_monName(displaced)}!`);
    } else {
      party.splice(_cursor, 0, mon);
      // If came from box, clean null placeholder
      if (_held.source === 'BOX') {
        while (box.length > 0 && box[box.length - 1] === null) box.pop();
      }
      _setMsg(`${_monName(mon)} moved to party!`);
    }
    _held = null;
    DG.SaveLoad.save(_gs);
  }

  // ── Return held mon to its origin ────────────────────────
  function _returnHeld(box, party) {
    if (!_held) return;
    if (_held.source === 'BOX') {
      while (box.length <= _held.index) box.push(null);
      box[_held.index] = _held.mon;
      while (box.length > 0 && box[box.length - 1] === null) box.pop();
    } else {
      party.splice(Math.min(_held.index, party.length), 0, _held.mon);
    }
    _setMsg('Cancelled.');
    _held = null;
  }

  function _setMsg(msg) { _message = msg; _msgTimer = 90; }
  function _monName(mon) {
    if (!mon) return '??';
    return mon.nickname || (DG.SPECIES[mon.speciesId]?.name) || mon.speciesId;
  }

  // ── Draw ─────────────────────────────────────────────────
  function draw(ctx) {
    if (!_gs) return;
    const W = DG.CANVAS.W, H = DG.CANVAS.H;
    const box   = _gs.player.box || [];
    const party = _gs.player.party;

    // Background
    ctx.fillStyle = '#0d1b2a';
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = '#4a90d9';
    ctx.lineWidth = 2;
    ctx.strokeRect(2, 2, W - 4, H - 4);

    // Title bar
    ctx.fillStyle = '#1a3a5c';
    ctx.fillRect(2, 2, W - 4, 20);
    ctx.fillStyle = '#8ed8f8';
    ctx.font = 'bold 12px monospace';
    ctx.textBaseline = 'top';
    ctx.fillText('DINOBOX', 10, 5);
    ctx.fillStyle = '#aaa';
    ctx.font = '10px monospace';
    const boxCount = box.filter(Boolean).length;
    ctx.fillText(`${boxCount}/30 stored  |  Party: ${party.length}/6`, 90, 6);

    // ── PARTY panel (left, 150px) ─────────────────────────
    const PAX = 4, PAY = 26, PAW = 148, SLOT_H = 43;
    ctx.fillStyle = '#0e2233';
    ctx.fillRect(PAX, PAY, PAW, 6 * SLOT_H + 4);
    ctx.strokeStyle = '#2a5a8a';
    ctx.lineWidth = 1;
    ctx.strokeRect(PAX, PAY, PAW, 6 * SLOT_H + 4);
    ctx.fillStyle = _panel === 'PARTY' ? '#FFE050' : '#8ed8f8';
    ctx.font = 'bold 10px monospace';
    ctx.fillText('PARTY', PAX + 4, PAY + 2);

    for (let i = 0; i < 6; i++) {
      const mon = party[i];
      const sy = PAY + 13 + i * SLOT_H;
      const isSelected = _panel === 'PARTY' && i === _cursor;
      const isHeld = _held && _held.source === 'PARTY' && _held.index === i;

      ctx.fillStyle = isSelected ? '#1e4a70' : '#0d1b2a';
      ctx.fillRect(PAX + 2, sy, PAW - 4, SLOT_H - 2);
      ctx.strokeStyle = isSelected ? '#FFE050' : (isHeld ? '#ff9900' : '#2a5a8a');
      ctx.lineWidth = isSelected ? 1.5 : 1;
      ctx.strokeRect(PAX + 2, sy, PAW - 4, SLOT_H - 2);

      if (mon) {
        const sp = DG.SPECIES[mon.speciesId];
        const nm = mon.nickname || sp?.name || mon.speciesId;
        ctx.fillStyle = mon.hp.current <= 0 ? '#666' : '#ddd';
        ctx.font = '10px monospace';
        ctx.fillText(nm.substring(0, 11), PAX + 6, sy + 3);
        ctx.fillStyle = '#8888cc';
        ctx.font = '9px monospace';
        ctx.fillText(`Lv.${mon.level}`, PAX + 6, sy + 16);
        // HP bar
        const hpPct = mon.hp.current / mon.hp.max;
        ctx.fillStyle = '#333';
        ctx.fillRect(PAX + 6, sy + 28, PAW - 14, 6);
        ctx.fillStyle = hpPct > 0.5 ? '#44cc44' : hpPct > 0.25 ? '#ddcc00' : '#cc3333';
        ctx.fillRect(PAX + 6, sy + 28, Math.floor((PAW - 14) * hpPct), 6);
        // Ball indicator
        if (mon.caughtBall) {
          ctx.fillStyle = _ballColor(mon.caughtBall);
          ctx.beginPath();
          ctx.arc(PAX + PAW - 8, sy + 6, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        ctx.fillStyle = '#444';
        ctx.font = '9px monospace';
        ctx.fillText('---', PAX + 6, sy + 18);
      }
    }

    // Held mon overlay on party
    if (_held && _panel === 'PARTY') {
      ctx.fillStyle = 'rgba(255,153,0,0.25)';
      ctx.fillRect(PAX + 2, PAY + 13 + _cursor * SLOT_H, PAW - 4, SLOT_H - 2);
    }

    // ── BOX grid (right, 322px) ────────────────────────────
    const BX = 158, BY = 26, BW = W - BX - 4;
    const CELL_W = Math.floor(BW / BOX_COLS);
    const CELL_H = Math.floor((H - BY - 30) / BOX_ROWS);

    ctx.fillStyle = '#0e2233';
    ctx.fillRect(BX, BY, BW, BOX_ROWS * CELL_H + 14);
    ctx.strokeStyle = '#2a5a8a';
    ctx.lineWidth = 1;
    ctx.strokeRect(BX, BY, BW, BOX_ROWS * CELL_H + 14);
    ctx.fillStyle = _panel === 'BOX' ? '#FFE050' : '#8ed8f8';
    ctx.font = 'bold 10px monospace';
    ctx.fillText('BOX  (←switch to Party)', BX + 4, BY + 2);

    for (let row = 0; row < BOX_ROWS; row++) {
      for (let col = 0; col < BOX_COLS; col++) {
        const idx  = row * BOX_COLS + col;
        const mon  = box[idx] || null;
        const cx   = BX + col * CELL_W + 2;
        const cy   = BY + 14 + row * CELL_H;
        const isSelected = _panel === 'BOX' && idx === _cursor;
        const isHeld = _held && _held.source === 'BOX' && _held.index === idx;

        ctx.fillStyle = isSelected ? '#1e4a70' : '#0d1b2a';
        ctx.fillRect(cx, cy, CELL_W - 3, CELL_H - 2);
        ctx.strokeStyle = isSelected ? '#FFE050' : (isHeld ? '#ff9900' : '#1a3a5c');
        ctx.lineWidth = isSelected ? 1.5 : 0.5;
        ctx.strokeRect(cx, cy, CELL_W - 3, CELL_H - 2);

        if (mon) {
          const sp = DG.SPECIES[mon.speciesId];
          // Subtle sprite area highlight so sprites pop against the dark cell
          ctx.fillStyle = 'rgba(255,255,255,0.04)';
          ctx.fillRect(cx + 1, cy + 1, CELL_W - 5, CELL_H - 14);
          // DinoMon sprite — scale 0.80 centered in upper portion of cell
          if (typeof DG.SpriteRenderer !== 'undefined') {
            DG.SpriteRenderer.drawMon(ctx, mon.speciesId, cx + 11, cy + 2, 0.80);
          } else {
            // Fallback: type-colored circle
            ctx.fillStyle = (sp && sp.types && sp.types[0]) ? '#888' : '#888';
            ctx.beginPath();
            ctx.arc(cx + CELL_W / 2, cy + CELL_H / 2 - 6, 9, 0, Math.PI * 2);
            ctx.fill();
          }
          // Ball dot (top-right)
          if (mon.caughtBall) {
            ctx.fillStyle = _ballColor(mon.caughtBall);
            ctx.beginPath();
            ctx.arc(cx + CELL_W - 6, cy + 5, 3, 0, Math.PI * 2);
            ctx.fill();
          }
          // Name at bottom-left
          ctx.fillStyle = mon.hp.current <= 0 ? '#555' : '#ccc';
          ctx.font = '7px monospace';
          ctx.textBaseline = 'bottom';
          const nm = (mon.nickname || sp?.name || mon.speciesId).substring(0, 7);
          ctx.fillText(nm, cx + 2, cy + CELL_H - 2);
          // Level at bottom-right (bright so it's easy to scan)
          ctx.fillStyle = '#FFE050';
          ctx.font = '6px monospace';
          ctx.textAlign = 'right';
          ctx.fillText(`Lv${mon.level}`, cx + CELL_W - 4, cy + CELL_H - 2);
          ctx.textAlign = 'left';
          ctx.textBaseline = 'alphabetic';
        }
      }
    }

    // Held mon floating indicator
    if (_held) {
      const nm = _monName(_held.mon);
      ctx.fillStyle = 'rgba(255,153,0,0.9)';
      ctx.fillRect(W / 2 - 70, H - 52, 140, 18);
      ctx.fillStyle = '#000';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`Holding: ${nm}`, W / 2, H - 40);
      ctx.textAlign = 'left';
    }

    // Status / help message
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(4, H - 20, W - 8, 16);
    ctx.fillStyle = _msgTimer > 0 ? '#FFE050' : '#667788';
    ctx.font = '9px monospace';
    ctx.textBaseline = 'top';
    ctx.fillText(_message || '[ENTER] Pick up  [ESC] Close', 8, H - 18);
  }

  function _ballColor(ballId) {
    const cols = {
      DINOBALL: '#e04040', SUPERBALL: '#4080e0', ULTRABALL: '#202060',
      AMBERBALL: '#c08020', MASTERBALL: '#8020c0', DINOMASTERBALL: '#8020c0',
    };
    return cols[ballId] || '#888';
  }

  function isOpen() { return !!_gs; }

  console.log('[DinoMon] BoxUI loaded.');

  return { open, update, draw, isOpen };
})();

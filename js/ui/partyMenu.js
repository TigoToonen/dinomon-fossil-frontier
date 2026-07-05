// DinoMon: Fossil Frontier — ui/partyMenu.js
// Party management screen  (v17 — Effect text in move detail screen)

window.DG = window.DG || {};

DG.PartyMenu = (function () {

  let _gs             = null;
  let _cursor         = 0;
  let _onClose        = null;
  let _selected       = null;   // index of first selected mon for swap
  let _mode           = 'SELECT'; // 'SELECT' | 'ACTION' | 'SWAP' | 'SUMMARY' | 'RENAME'
  let _battleOnSwitch = null;
  let _battleActiveMon = null;

  const ACTIONS = ['SUMMARY', 'ITEM', 'SWAP', 'RENAME', 'CANCEL'];
  let _actionCursor = 0;

  // Item-use state
  let _itemList    = [];  // filtered list of usable items from bag
  let _itemCursor  = 0;
  let _summaryMoveCursor = 0;   // which move is selected in SUMMARY
  let _moveDetailIndex   = 0;   // which move to show in MOVE_DETAIL

  // ── Rename state ─────────────────────────────────────────────
  let _renameBuffer       = '';
  let _renameKeyListener  = null;
  // Set true by the keydown listener when it handles a key that would also
  // fire DG.Input 'B' (Backspace, or the literal 'b'/'B' character).
  // This prevents the game-pad B handler from also cancelling rename.
  let _renameBlockedGamepad = false;

  // ── Type palette ─────────────────────────────────────────────
  const TYPE_COLORS = {
    FIRE:'#ff6633', WATER:'#3399ff', GRASS:'#44cc44', ROCK:'#aa8855',
    GROUND:'#cc9933', ELECTRIC:'#ffdd00', PSYCHIC:'#cc44ff', DRAGON:'#4444ff',
    DARK:'#554466', GHOST:'#6644aa', ICE:'#88ddff', FIGHTING:'#cc6622',
    NORMAL:'#aaaaaa', BUG:'#88aa22', FAIRY:'#ff88cc', POISON:'#aa44aa',
    STEEL:'#9999bb', FLYING:'#88aadd',
  };

  const TYPE_ABBR = {
    FIRE:'FI', WATER:'WA', GRASS:'GR', ROCK:'RK', GROUND:'GD',
    ELECTRIC:'EL', PSYCHIC:'PS', DRAGON:'DR', DARK:'DA', GHOST:'GH',
    ICE:'IC', FIGHTING:'FT', NORMAL:'NO', BUG:'BG', FAIRY:'FA',
    POISON:'PO', STEEL:'ST', FLYING:'FL',
  };

  // ── Effect text helpers ───────────────────────────────────────
  // BATTLE-STRATEGY Fase 1c: delegeert naar de canonieke generator in uiKit —
  // één bron van waarheid, inclusief de status-regels (schade/beurt, malus).
  function _effectText(eff, move) {
    return (DG.UIKit && DG.UIKit.moveEffectLabel) ? DG.UIKit.moveEffectLabel(eff, move) : null;
  }

  function _effectColor(eff, move) {
    return (DG.UIKit && DG.UIKit.moveEffectColor) ? DG.UIKit.moveEffectColor(eff, move) : '#aaaaaa';
  }

  // ── Helpers ───────────────────────────────────────────────────
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

  function _typeBadge(ctx, type, x, y) {
    const col = TYPE_COLORS[type] || '#888';
    ctx.fillStyle = col;
    _roundRect(ctx, x, y, 22, 10, 3);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = '7px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(TYPE_ABBR[type] || type.slice(0, 2), x + 11, y + 7);
    ctx.textAlign = 'left';
  }

  // ── Open ─────────────────────────────────────────────────────
  function open(gameState, onClose) {
    _gs              = gameState;
    _onClose         = onClose;
    _battleOnSwitch  = null;
    _battleActiveMon = null;
    _cursor          = 0;
    _selected        = null;
    _mode            = 'SELECT';
  }

  function openBattle(gameState, activeMon, onSwitch, onClose) {
    _gs              = gameState;
    _onClose         = onClose;
    _battleOnSwitch  = onSwitch;
    _battleActiveMon = activeMon;
    _cursor          = 0;
    _selected        = null;
    _mode            = 'SELECT';
  }

  // ── Update ───────────────────────────────────────────────────
  function update(dt) {
    if (!_gs) return;
    const party = _gs.player.party;

    // Battle mode: direct selection
    if (_battleOnSwitch) {
      if (DG.Input.isPressed('UP'))   _cursor = Math.max(0, _cursor - 1);
      if (DG.Input.isPressed('DOWN')) _cursor = Math.min(party.length - 1, _cursor + 1);
      if (DG.Input.isPressed('A')) {
        const mon = party[_cursor];
        if (!mon) return;
        if (mon === _battleActiveMon) {
          DG.DialogueBox.show(["That DinoMon is already in battle!"], () => {});
        } else if (mon.hp.current <= 0) {
          DG.DialogueBox.show(["That DinoMon has no energy left!"], () => {});
        } else if (mon.isEgg) {
          DG.DialogueBox.show(["Eggs can't battle!"], () => {});
        } else {
          const cb = _battleOnSwitch; _battleOnSwitch = null;
          _onClose = null;
          cb(_cursor);
        }
      }
      if (DG.Input.isPressed('B') || DG.Input.isPressed('START')) {
        _battleOnSwitch = null;
        const cb = _onClose; _onClose = null;
        if (typeof cb === 'function') cb();
      }
      return;
    }

    if (_mode === 'SELECT') {
      if (DG.Input.isPressed('UP'))   _cursor = Math.max(0, _cursor - 1);
      if (DG.Input.isPressed('DOWN')) _cursor = Math.min(party.length - 1, _cursor + 1);
      if (DG.Input.isPressed('A')) {
        _mode = 'ACTION';
        _actionCursor = 0;
      }
      if (DG.Input.isPressed('B') || DG.Input.isPressed('START')) {
        const cb = _onClose; _onClose = null;
        if (typeof cb === 'function') cb();
      }
    } else if (_mode === 'ACTION') {
      if (DG.Input.isPressed('UP'))   _actionCursor = Math.max(0, _actionCursor - 1);
      if (DG.Input.isPressed('DOWN')) _actionCursor = Math.min(ACTIONS.length - 1, _actionCursor + 1);
      if (DG.Input.isPressed('A')) {
        switch (ACTIONS[_actionCursor]) {
          case 'SUMMARY': _mode = 'SUMMARY'; break;
          case 'ITEM':    _openItemSelect(); break;
          case 'SWAP':
            _selected = _cursor;
            _mode = 'SWAP';
            break;
          case 'RENAME': _startRename(); break;
          case 'CANCEL': _mode = 'SELECT'; break;
        }
      }
      if (DG.Input.isPressed('B')) _mode = 'SELECT';
    } else if (_mode === 'SWAP') {
      if (DG.Input.isPressed('UP'))   _cursor = Math.max(0, _cursor - 1);
      if (DG.Input.isPressed('DOWN')) _cursor = Math.min(party.length - 1, _cursor + 1);
      if (DG.Input.isPressed('A')) {
        if (_cursor !== _selected) {
          const tmp = party[_selected];
          party[_selected] = party[_cursor];
          party[_cursor]   = tmp;
        }
        _selected = null;
        _mode = 'SELECT';
      }
      if (DG.Input.isPressed('B')) { _selected = null; _mode = 'SELECT'; }
    } else if (_mode === 'SUMMARY') {
      const mon = party[_cursor];
      const moveCount = mon ? mon.moves.length : 0;
      if (DG.Input.isPressed('UP'))   _summaryMoveCursor = Math.max(0, _summaryMoveCursor - 1);
      if (DG.Input.isPressed('DOWN')) _summaryMoveCursor = Math.min(Math.max(0, moveCount - 1), _summaryMoveCursor + 1);
      if (DG.Input.isPressed('A') && moveCount > 0) {
        _moveDetailIndex = _summaryMoveCursor;
        _mode = 'MOVE_DETAIL';
      }
      if (DG.Input.isPressed('B') || DG.Input.isPressed('START')) {
        _summaryMoveCursor = 0;
        _mode = 'SELECT';
      }
    } else if (_mode === 'MOVE_DETAIL') {
      if (DG.Input.isPressed('B') || DG.Input.isPressed('START')) {
        _mode = 'SUMMARY';
      }
    } else if (_mode === 'ITEM_SELECT') {
      if (_itemList.length === 0) {
        DG.DialogueBox.show(['No usable items in your bag!'], () => { _mode = 'SELECT'; });
        return;
      }
      if (DG.Input.isPressed('UP'))   _itemCursor = Math.max(0, _itemCursor - 1);
      if (DG.Input.isPressed('DOWN')) _itemCursor = Math.min(_itemList.length - 1, _itemCursor + 1);
      if (DG.Input.isPressed('A')) {
        _useSelectedItem();
      }
      if (DG.Input.isPressed('B') || DG.Input.isPressed('START')) {
        _mode = 'SELECT';
      }
    } else if (_mode === 'RENAME') {
      // Text input is handled by _renameKeyListener (keydown).
      // Only cancel via DG.Input 'B' when the keydown listener did NOT already
      // consume that key press (e.g. Backspace deletes text, not cancels rename).
      if (DG.Input.isPressed('B') && !_renameBlockedGamepad) _cancelRename();
      _renameBlockedGamepad = false; // reset each frame
    }
  }

  // ── Item use helpers ─────────────────────────────────────────
  // Items usable on DinoMons from the party screen (healing + status)
  const USABLE_ITEM_TYPES = ['POTION','SUPERPOTION','HYPERPOTION','MAXPOTION','FULLRESTORE',
    'ANTIDOTE','PARALYHEAL','BURNHEAL','ICEHEAL','AWAKENING','FULLHEAL','REVIVE','MAXREVIVE'];

  function _openItemSelect() {
    const bag = _gs && _gs.player && _gs.player.bag;
    if (!bag) { _mode = 'SELECT'; return; }
    // Build list of items with quantity > 0 that are usable on party mons
    _itemList = [];
    for (const itemId of USABLE_ITEM_TYPES) {
      const qty = bag[itemId] || 0;
      if (qty > 0) {
        const def = DG.ITEMS && DG.ITEMS[itemId];
        _itemList.push({ id: itemId, name: def ? def.name : itemId, qty });
      }
    }
    _itemCursor = 0;
    _mode = 'ITEM_SELECT';
  }

  function _useSelectedItem() {
    const entry = _itemList[_itemCursor];
    if (!entry) return;
    const mon = _gs.player.party[_cursor];
    if (!mon) return;
    const bag = _gs.player.bag;
    const itemId = entry.id;

    // Check if item is applicable
    const isRevive = itemId === 'REVIVE' || itemId === 'MAXREVIVE';
    if (!isRevive && mon.hp.current <= 0) {
      DG.DialogueBox.show([`${mon.nickname || DG.SPECIES[mon.speciesId]?.name} has fainted! Use a Revive instead.`], () => {});
      return;
    }
    if (isRevive && mon.hp.current > 0) {
      DG.DialogueBox.show([`${mon.nickname || DG.SPECIES[mon.speciesId]?.name} doesn't need a Revive!`], () => {});
      return;
    }
    if (itemId === 'POTION' && mon.hp.current >= mon.hp.max) {
      DG.DialogueBox.show([`${mon.nickname || DG.SPECIES[mon.speciesId]?.name}'s HP is already full!`], () => {});
      return;
    }

    // Apply item
    let resultMsg = '';
    const monName = mon.nickname || DG.SPECIES[mon.speciesId]?.name || mon.speciesId;
    if (itemId === 'POTION')        { mon.hp.current = Math.min(mon.hp.max, mon.hp.current + 20); resultMsg = `${monName} recovered 20 HP!`; }
    else if (itemId === 'SUPERPOTION') { mon.hp.current = Math.min(mon.hp.max, mon.hp.current + 50); resultMsg = `${monName} recovered 50 HP!`; }
    else if (itemId === 'HYPERPOTION') { mon.hp.current = Math.min(mon.hp.max, mon.hp.current + 200); resultMsg = `${monName} recovered 200 HP!`; }
    else if (itemId === 'MAXPOTION' || itemId === 'FULLRESTORE') { mon.hp.current = mon.hp.max; resultMsg = `${monName}'s HP was fully restored!`; }
    else if (itemId === 'ANTIDOTE')  { if (mon.statusEffect === 'POISON' || mon.statusEffect === 'TOXIC') { if (typeof DG.StatusEffects !== 'undefined') DG.StatusEffects.cure(mon, 'POISON'); mon.statusEffect = null; resultMsg = `${monName} was cured of poison!`; } else { DG.DialogueBox.show([`${monName} isn't poisoned!`], () => {}); return; } }
    else if (itemId === 'PARALYHEAL') { if (mon.statusEffect === 'PARALYSIS') { mon.statusEffect = null; resultMsg = `${monName} was cured of paralysis!`; } else { DG.DialogueBox.show([`${monName} isn't paralyzed!`], () => {}); return; } }
    else if (itemId === 'BURNHEAL')  { if (mon.statusEffect === 'BURN') { mon.statusEffect = null; resultMsg = `${monName} was cured of its burn!`; } else { DG.DialogueBox.show([`${monName} doesn't have a burn!`], () => {}); return; } }
    else if (itemId === 'ICEHEAL')   { if (mon.statusEffect === 'FREEZE') { mon.statusEffect = null; resultMsg = `${monName} was thawed out!`; } else { DG.DialogueBox.show([`${monName} isn't frozen!`], () => {}); return; } }
    else if (itemId === 'AWAKENING') { if (mon.statusEffect === 'SLEEP') { mon.statusEffect = null; resultMsg = `${monName} woke up!`; } else { DG.DialogueBox.show([`${monName} isn't asleep!`], () => {}); return; } }
    else if (itemId === 'FULLHEAL')  { mon.statusEffect = null; mon.statusTurns = 0; resultMsg = `${monName}'s status was cured!`; }
    else if (itemId === 'REVIVE')    { mon.hp.current = Math.floor(mon.hp.max / 2); resultMsg = `${monName} was revived with half HP!`; }
    else if (itemId === 'MAXREVIVE') { mon.hp.current = mon.hp.max; resultMsg = `${monName} was fully revived!`; }

    // Consume item
    bag[itemId] = Math.max(0, (bag[itemId] || 0) - 1);
    DG.SaveLoad.save(_gs);

    // Refresh item list after use
    _openItemSelect();
    // Brief confirm message
    DG.DialogueBox.show([resultMsg], () => {});
  }

  // ── Rename helpers ───────────────────────────────────────────
  function _startRename() {
    const mon = _gs && _gs.player.party[_cursor];
    if (!mon || mon.isEgg) { _mode = 'SELECT'; return; }
    const sp = DG.SPECIES[mon.speciesId];
    _renameBuffer = mon.nickname || sp?.name || mon.speciesId;
    _mode = 'RENAME';
    // Remove any stale listener
    if (_renameKeyListener) document.removeEventListener('keydown', _renameKeyListener);
    _renameKeyListener = function (e) {
      if (_mode !== 'RENAME') {
        document.removeEventListener('keydown', _renameKeyListener);
        _renameKeyListener = null;
        return;
      }
      // Let arrow keys pass through so the game still responds to D-pad
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) return;
      e.preventDefault();
      if (e.key === 'Enter') {
        _confirmRename();
      } else if (e.key === 'Escape') {
        _cancelRename();
      } else if (e.key === 'Backspace') {
        // Block DG.Input 'B' this frame so rename doesn't get cancelled
        _renameBlockedGamepad = true;
        _renameBuffer = _renameBuffer.slice(0, -1);
      } else if (e.key.length === 1 && _renameBuffer.length < 12) {
        // 'b'/'B' characters also trigger DG.Input 'B' — block the cancel
        _renameBlockedGamepad = true;
        _renameBuffer += e.key;
      }
    };
    document.addEventListener('keydown', _renameKeyListener);
  }

  function _confirmRename() {
    const mon = _gs && _gs.player.party[_cursor];
    const trimmed = _renameBuffer.trim();
    if (mon && !mon.isEgg && trimmed.length > 0) {
      mon.nickname = trimmed;
      if (typeof DG.SaveLoad !== 'undefined') DG.SaveLoad.save(_gs);
    }
    _cancelRename();
  }

  function _cancelRename() {
    if (_renameKeyListener) {
      document.removeEventListener('keydown', _renameKeyListener);
      _renameKeyListener = null;
    }
    _renameBuffer = '';
    _mode = 'SELECT';
  }

  // ── Draw ─────────────────────────────────────────────────────
  function draw(ctx) {
    const W = DG.CANVAS.W, H = DG.CANVAS.H;
    const party = _gs ? _gs.player.party : [];

    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = '#8ed8f8';
    ctx.lineWidth = 2;
    ctx.strokeRect(2, 2, W - 4, H - 4);

    ctx.fillStyle = '#8ed8f8';
    ctx.font = 'bold 14px monospace';
    ctx.textBaseline = 'top';

    if (_mode === 'SUMMARY' && party[_cursor]) {
      _drawSummary(ctx, W, H, party[_cursor]);
      return;
    }
    if (_mode === 'MOVE_DETAIL' && party[_cursor]) {
      _drawMoveDetail(ctx, W, H, party[_cursor], _moveDetailIndex);
      return;
    }

    ctx.fillText(_battleOnSwitch ? 'SWITCH TO?' : 'PARTY', 10, 8);

    // ── RENAME overlay (drawn over party list, early return) ────
    if (_mode === 'RENAME') {
      // Dim the background
      ctx.fillStyle = 'rgba(0,0,20,0.88)';
      ctx.fillRect(4, 28, W - 8, H - 32);

      // Dialog box
      const dlgX = W / 2 - 115, dlgY = H / 2 - 40;
      ctx.fillStyle = '#0a0a2a';
      ctx.fillRect(dlgX, dlgY, 230, 80);
      ctx.strokeStyle = '#FFE050';
      ctx.lineWidth = 2;
      ctx.strokeRect(dlgX, dlgY, 230, 80);

      // Title
      ctx.fillStyle = '#8ed8f8';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('RENAME DINOBOT', W / 2, dlgY + 13);

      // Input field
      ctx.fillStyle = '#060618';
      ctx.fillRect(dlgX + 10, dlgY + 24, 210, 22);
      ctx.strokeStyle = '#4a90d9';
      ctx.lineWidth = 1;
      ctx.strokeRect(dlgX + 10, dlgY + 24, 210, 22);

      // Text + blinking cursor
      const showCaret = Math.floor(Date.now() / 500) % 2 === 0;
      ctx.fillStyle = '#ffffff';
      ctx.font = '11px monospace';
      ctx.fillText(_renameBuffer + (showCaret ? '|' : ' '), W / 2, dlgY + 39);

      // Char counter
      ctx.fillStyle = '#556';
      ctx.font = '9px monospace';
      ctx.fillText(`${_renameBuffer.length}/12`, W / 2 + 88, dlgY + 38);

      // Instructions
      ctx.fillStyle = '#888888';
      ctx.font = '9px monospace';
      ctx.fillText('[Enter] Confirm   [Esc / B] Cancel', W / 2, dlgY + 66);
      ctx.textAlign = 'left';
      return;
    }

    // Slot height scales so 6 slots fit
    const SLOT_H = Math.floor((H - 36) / 6);

    party.forEach((mon, i) => {
      if (!mon) return;
      const sp    = DG.SPECIES[mon.speciesId];
      const name  = mon.isEgg ? 'EGG' : (mon.nickname || (sp ? sp.name : mon.speciesId));
      const y     = 28 + i * SLOT_H;
      const x     = 6;
      const slotW = W - 12;
      const isSelected    = i === _cursor;
      const isSwapSrc     = i === _selected;
      const isBattleUnavail = !!_battleActiveMon && (mon === _battleActiveMon || mon.hp.current <= 0 || mon.isEgg);

      // ── Slot background gradient based on HP status ──────────
      if (mon.isEgg) {
        const grad = ctx.createLinearGradient(x, y, x, y + SLOT_H - 2);
        grad.addColorStop(0, '#1a1a3a');
        grad.addColorStop(1, '#0f0f25');
        ctx.fillStyle = isSwapSrc ? '#3a3a60' : isBattleUnavail ? '#0e0e1a' : grad;
      } else if (mon.hp.current <= 0) {
        const grad = ctx.createLinearGradient(x, y, x, y + SLOT_H - 2);
        grad.addColorStop(0, '#1a1a1a');
        grad.addColorStop(1, '#0f0f0f');
        ctx.fillStyle = isSwapSrc ? '#3a3a60' : isBattleUnavail ? '#0e0e1a' : grad;
      } else {
        const hpPct = mon.hp.current / mon.hp.max;
        const grad = ctx.createLinearGradient(x, y, x, y + SLOT_H - 2);
        if (hpPct > 0.5) {
          grad.addColorStop(0, '#1a3a1a');
          grad.addColorStop(1, '#0f2010');
        } else if (hpPct > 0.2) {
          grad.addColorStop(0, '#3a2a0a');
          grad.addColorStop(1, '#251800');
        } else {
          grad.addColorStop(0, '#3a0f0f');
          grad.addColorStop(1, '#200808');
        }
        ctx.fillStyle = isSwapSrc ? '#3a3a60' : isBattleUnavail ? '#0e0e1a' : grad;
      }
      ctx.fillRect(x, y, slotW, SLOT_H - 2);

      // ── Border ──────────────────────────────────────────────
      ctx.strokeStyle = isSelected ? '#FFE050' : '#4a6fa5';
      ctx.lineWidth   = 1.5;
      ctx.strokeRect(x, y, slotW, SLOT_H - 2);

      // ── Type color strip (4px left edge) ────────────────────
      if (!mon.isEgg && sp && sp.types && sp.types[0]) {
        const typeCol = TYPE_COLORS[sp.types[0]] || '#888';
        ctx.fillStyle = typeCol;
        ctx.fillRect(x, y, 4, SLOT_H - 2);
      }

      if (mon.isEgg) {
        ctx.fillStyle = '#88aacc';
        ctx.font = '12px monospace';
        ctx.fillText('🥚 EGG', 14, y + 6);
        ctx.fillStyle = '#7788aa';
        ctx.font = '9px monospace';
        const stepsLeft = Math.max(0, (mon.hatchSteps || 0) - (mon.eggSteps || 0));
        ctx.fillText(`~${stepsLeft} steps to hatch`, 14, y + 20);
        return;
      }

      // Sprite (shiny mons get the hue-shifted palette, same as battle)
      if (typeof DG.SpriteRenderer !== 'undefined') {
        if (mon.isShiny) ctx.filter = 'hue-rotate(180deg) saturate(2)';
        DG.SpriteRenderer.drawMon(ctx, mon.speciesId, 14, y + 2, 0.85);
        if (mon.isShiny) ctx.filter = 'none';
      } else {
        ctx.fillStyle = sp ? (sp.color || '#888') : '#888';
        ctx.fillRect(14, y + 4, 26, 26);
      }

      // Name (shiny mons get a gold ✦ in front)
      ctx.font = '11px monospace';
      let nameX = 48;
      if (mon.isShiny) {
        ctx.fillStyle = '#ffd700';
        ctx.fillText('✦', nameX, y + 3);
        nameX += 12;
      }
      ctx.fillStyle = mon.hp.current <= 0 ? '#888' : '#ffffff';
      ctx.fillText(name, nameX, y + 3);

      // Type badge(s) next to name — show both for dual-types
      if (sp && sp.types && sp.types[0]) {
        const nameW = ctx.measureText(name).width;
        let bx = nameX + nameW + 4;
        for (const t of sp.types) { _typeBadge(ctx, t, bx, y + 2); bx += 25; }
      }

      // Level
      ctx.fillStyle = '#aaaaff';
      ctx.font = '9px monospace';
      ctx.fillText(`Lv.${mon.level}`, 48, y + 16);

      // EVO-STAGE: fossiel-pips achter het level
      if (DG.UIKit && DG.UIKit.drawStagePips) {
        DG.UIKit.drawStagePips(ctx, 82, y + 17, mon.speciesId, { size: 6, gap: 3 });
      }

      // ── HP bar with gradient ─────────────────────────────────
      const hpPct = mon.hp.current / mon.hp.max;
      const barW  = 90;
      const barX  = W - barW - 50;
      const barY  = y + 8;
      // Background track
      ctx.fillStyle = '#333';
      ctx.fillRect(barX, barY, barW, 6);
      // Gradient fill
      const fillW = Math.max(0, Math.floor(barW * hpPct));
      if (fillW > 0) {
        const hpGrad = ctx.createLinearGradient(barX, barY, barX + fillW, barY);
        if (hpPct > 0.5) {
          hpGrad.addColorStop(0, '#44ff44');
          hpGrad.addColorStop(1, '#22aa22');
        } else if (hpPct > 0.2) {
          hpGrad.addColorStop(0, '#ffcc00');
          hpGrad.addColorStop(1, '#aa8800');
        } else {
          hpGrad.addColorStop(0, '#ff4444');
          hpGrad.addColorStop(1, '#aa1111');
        }
        ctx.fillStyle = hpGrad;
        ctx.fillRect(barX, barY, fillW, 6);
        // White shine on top
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.fillRect(barX, barY, fillW, 1);
      }
      // HP numbers
      ctx.fillStyle = '#aaa';
      ctx.font = '9px monospace';
      ctx.fillText(`${mon.hp.current}/${mon.hp.max}`, barX, y + 20);

      // Status badge — Fase 1c: mét teller (SLP = resterende beurten, TOX = ×n)
      if (mon.statusEffect) {
        const _bTxt = DG.StatusEffects.badgeText ? DG.StatusEffects.badgeText(mon)
                     : DG.StatusEffects.displayName(mon.statusEffect);
        const _bW = Math.max(28, _bTxt.length * 6 + 6);
        ctx.fillStyle = DG.StatusEffects.displayColor(mon.statusEffect);
        ctx.fillRect(W - 14 - _bW, y + 3, _bW, 11);
        ctx.fillStyle = '#000';
        ctx.font = '8px monospace';
        ctx.fillText(_bTxt, W - 12 - _bW, y + 4);
      }

      // Ball indicator (top-right corner)
      if (mon.caughtBall) {
        ctx.fillStyle = _ballColor(mon.caughtBall);
        ctx.beginPath();
        ctx.arc(W - 14, y + 7, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Held item indicator
      if (mon.heldItem) {
        ctx.fillStyle = '#c0a030';
        ctx.font = '9px monospace';
        ctx.fillText('◆', W - 10, y + SLOT_H - 10);
      }
    });

    // Action sub-menu
    if (_mode === 'ACTION') {
      const SLOT_H2 = Math.floor((H - 36) / 6);
      const ax = W - 90, ay = 28 + _cursor * SLOT_H2;
      ctx.fillStyle = 'rgba(10,10,30,0.97)';
      ctx.fillRect(ax, ay, 86, ACTIONS.length * 22 + 8);
      ctx.strokeStyle = '#8ed8f8';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(ax, ay, 86, ACTIONS.length * 22 + 8);
      ACTIONS.forEach((a, i) => {
        ctx.fillStyle = i === _actionCursor ? '#FFE050' : '#ffffff';
        ctx.font = '12px monospace';
        ctx.fillText((i === _actionCursor ? '▶ ' : '  ') + a, ax + 6, ay + 6 + i * 22);
      });
    }

    // ── Item selector overlay ─────────────────────────────────
    if (_mode === 'ITEM_SELECT') {
      const ovX = 20, ovY = 20, ovW = W - 40, ovH = H - 40;
      ctx.fillStyle = 'rgba(5,10,30,0.97)';
      ctx.fillRect(ovX, ovY, ovW, ovH);
      ctx.strokeStyle = '#8ed8f8';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(ovX, ovY, ovW, ovH);
      ctx.fillStyle = '#8ed8f8';
      ctx.font = 'bold 12px monospace';
      ctx.textBaseline = 'top';
      ctx.fillText('USE ITEM', ovX + 8, ovY + 8);
      if (_itemList.length === 0) {
        ctx.fillStyle = '#888';
        ctx.font = '11px monospace';
        ctx.fillText('No usable items.', ovX + 8, ovY + 30);
      } else {
        const maxVisible = Math.floor((ovH - 36) / 22);
        const startIdx   = Math.max(0, _itemCursor - Math.floor(maxVisible / 2));
        _itemList.slice(startIdx, startIdx + maxVisible).forEach((item, vi) => {
          const realIdx = startIdx + vi;
          const iy = ovY + 26 + vi * 22;
          const isSel = realIdx === _itemCursor;
          if (isSel) {
            ctx.fillStyle = 'rgba(30,60,120,0.8)';
            ctx.fillRect(ovX + 4, iy - 2, ovW - 8, 20);
          }
          ctx.fillStyle = isSel ? '#FFE050' : '#ffffff';
          ctx.font = `${isSel ? 'bold ' : ''}11px monospace`;
          ctx.fillText(`${isSel ? '▶ ' : '  '}${item.name}`, ovX + 8, iy);
          ctx.fillStyle = '#aaaaaa';
          ctx.font = '10px monospace';
          ctx.textAlign = 'right';
          ctx.fillText(`×${item.qty}`, ovX + ovW - 8, iy);
          ctx.textAlign = 'left';
        });
      }
      ctx.fillStyle = '#555';
      ctx.font = '9px monospace';
      ctx.fillText('[A] Use   [B] Back', ovX + 8, ovY + ovH - 14);
    }

    ctx.fillStyle = '#888';
    ctx.font = '10px monospace';
    ctx.fillText('[ESC] Back', 10, H - 10);
    if (_mode === 'SWAP') {
      ctx.fillStyle = '#FFE050';
      ctx.fillText('Select swap target', 80, H - 10);
    }
  }

  // ── Full Summary screen ──────────────────────────────────────
  function _drawSummary(ctx, W, H, mon) {
    const sp      = DG.SPECIES[mon.speciesId];
    const name    = mon.nickname || sp?.name || mon.speciesId;
    const nature  = mon.nature   || 'HARDY';
    const natDef  = (typeof DG.NATURES !== 'undefined') ? DG.NATURES[nature] : null;

    // Header
    ctx.fillStyle = '#0a1a2e';
    ctx.fillRect(2, 2, W - 4, 30);
    ctx.font = 'bold 13px monospace';
    let hx = 10;
    if (mon.isShiny) {
      ctx.fillStyle = '#ffd700';
      ctx.fillText('✦', hx, 8);
      hx += 14;
    }
    ctx.fillStyle = '#8ed8f8';
    ctx.fillText(`${name}  Lv.${mon.level}`, hx, 8);
    // EVO-STAGE: fossiel-pips naast naam+level in de header
    if (DG.UIKit && DG.UIKit.drawStagePips) {
      const _hw = ctx.measureText(`${name}  Lv.${mon.level}`).width;
      DG.UIKit.drawStagePips(ctx, hx + _hw + 10, 11, mon.speciesId, { size: 7, gap: 3 });
    }
    // Type badges in header
    if (sp && sp.types) {
      let bx = W - 80;
      for (const t of sp.types) {
        _typeBadge(ctx, t, bx, 6);
        bx += 26;
      }
    }

    // Sprite (large) — shiny mons get the hue-shifted palette
    if (typeof DG.SpriteRenderer !== 'undefined') {
      if (mon.isShiny) ctx.filter = 'hue-rotate(180deg) saturate(2)';
      DG.SpriteRenderer.drawMon(ctx, mon.speciesId, 20, 38, 2.2);
      if (mon.isShiny) ctx.filter = 'none';
    } else {
      ctx.fillStyle = sp?.color || '#555';
      ctx.fillRect(20, 38, 70, 70);
    }

    // EVO-STAGE: compacte evolutielijn onder de sprite (silhouet voor ongezien)
    if (DG.UIKit && DG.UIKit.drawEvoChainStrip) {
      const _evoInfo = DG.EvoChain ? DG.EvoChain.get(mon.speciesId) : null;
      if (_evoInfo && _evoInfo.total > 1) {
        ctx.fillStyle = '#8ed8f8';
        ctx.font = 'bold 9px monospace';
        ctx.fillText(`STAGE ${_evoInfo.stage}/${_evoInfo.total}`, 10, 124);
        DG.UIKit.drawEvoChainStrip(ctx, 4, 136, 102, mon.speciesId, _gs,
          { nodeSize: 24, showHows: false, showNames: false });
      }
    }

    // Nature (color-coded)
    ctx.font = '10px monospace';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Nature:', 110, 38);
    ctx.fillStyle = '#FFE050';
    ctx.fillText(natDef ? natDef.name : nature, 170, 38);

    // Nature stat modifiers
    if (natDef) {
      if (natDef.boosts) {
        ctx.fillStyle = '#ff7777';
        ctx.fillText(`↑ ${_statLabel(natDef.boosts)}`, 220, 38);
      }
      if (natDef.reduces) {
        ctx.fillStyle = '#7799ff';
        ctx.fillText(`↓ ${_statLabel(natDef.reduces)}`, 265, 38);
      }
    }

    // Happiness display
    const happiness = mon.happiness || 0;
    const hearts    = Math.floor(happiness / 51); // 0-5 hearts
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Friendship:', 110, 52);
    ctx.fillStyle = '#ff88aa';
    ctx.fillText('♥'.repeat(hearts) + '♡'.repeat(5 - hearts), 190, 52);
    ctx.fillStyle = '#888';
    ctx.font = '9px monospace';
    ctx.fillText(`(${happiness}/255)`, 240, 53);

    // Caught ball
    if (mon.caughtBall) {
      ctx.font = '10px monospace';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('Ball:', 110, 66);
      ctx.fillStyle = _ballColor(mon.caughtBall);
      ctx.beginPath();
      ctx.arc(153, 70, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ccc';
      ctx.fillText(_ballName(mon.caughtBall), 163, 66);
    }

    // Held item
    ctx.font = '10px monospace';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Held:', 110, 80);
    ctx.fillStyle = mon.heldItem ? '#c0a030' : '#555';
    const heldName = mon.heldItem
      ? (DG.ITEMS && DG.ITEMS[mon.heldItem] ? DG.ITEMS[mon.heldItem].name : mon.heldItem)
      : '—';
    ctx.fillText(heldName, 150, 80);

    // Stats block
    const STATS = [
      { key:'hp',    label:'HP' },
      { key:'atk',   label:'Attack' },
      { key:'def',   label:'Defense' },
      { key:'spAtk', label:'Sp.Atk' },
      { key:'spDef', label:'Sp.Def' },
      { key:'spd',   label:'Speed' },
    ];
    ctx.font = '10px monospace';
    STATS.forEach((s, i) => {
      const col = i < 3 ? 0 : 1;
      const row = i < 3 ? i : i - 3;
      const bx = 110 + col * 180;
      const by = 96 + row * 18;

      // Color code boosted/reduced stat
      let statColor = '#cce8ff';
      if (natDef) {
        if (natDef.boosts === s.key)  statColor = '#ff8888';
        if (natDef.reduces === s.key) statColor = '#8899ff';
      }
      ctx.fillStyle = '#888';
      ctx.fillText(s.label + ':', bx, by);
      ctx.fillStyle = statColor;
      ctx.fillText(String(mon.stats[s.key] || 0), bx + 65, by);
      // IV / EV small
      const iv = (mon.ivs && mon.ivs[s.key]) || 0;
      const ev = (mon.evs && mon.evs[s.key]) || 0;
      ctx.fillStyle = '#556';
      ctx.font = '8px monospace';
      ctx.fillText(`IV:${iv} EV:${ev}`, bx + 85, by);
      ctx.font = '10px monospace';
    });

    // HP bar
    const hpPct = mon.hp.current / mon.hp.max;
    ctx.fillStyle = '#333';
    ctx.fillRect(110, 156, 120, 8);
    const summHPfill = Math.floor(120 * hpPct);
    if (summHPfill > 0) {
      const sg = ctx.createLinearGradient(110, 156, 110 + summHPfill, 156);
      if (hpPct > 0.5)       { sg.addColorStop(0,'#44ff44'); sg.addColorStop(1,'#22aa22'); }
      else if (hpPct > 0.2)  { sg.addColorStop(0,'#ffcc00'); sg.addColorStop(1,'#aa8800'); }
      else                   { sg.addColorStop(0,'#ff4444'); sg.addColorStop(1,'#aa1111'); }
      ctx.fillStyle = sg;
      ctx.fillRect(110, 156, summHPfill, 8);
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.fillRect(110, 156, summHPfill, 1);
    }
    ctx.fillStyle = '#aaa';
    ctx.font = '9px monospace';
    ctx.fillText(`HP: ${mon.hp.current} / ${mon.hp.max}`, 110, 170);

    // EXP bar
    const expCurve = sp ? sp.expCurve : 'MEDIUM_FAST';
    const expFn    = DG.EXP_CURVE && DG.EXP_CURVE[expCurve];
    const expThis  = expFn ? expFn(mon.level) : 0;
    const expNext  = expFn ? expFn(mon.level + 1) : 1;
    const expSpan  = Math.max(1, expNext - expThis);
    const expPct   = Math.min(1, (mon.exp - expThis) / expSpan);
    ctx.fillStyle = '#333';
    ctx.fillRect(110, 180, 120, 6);
    ctx.fillStyle = '#4488ff';
    ctx.fillRect(110, 180, Math.floor(120 * expPct), 6);
    ctx.fillStyle = '#aaa';
    ctx.font = '9px monospace';
    ctx.fillText(`EXP: ${mon.exp}  Next: ${Math.max(0, expNext - mon.exp)}`, 110, 192);

    // Moves — with cursor, type badge and category icon
    ctx.fillStyle = '#8ed8f8';
    ctx.font = 'bold 10px monospace';
    ctx.fillText('Moves:', 10, 195);
    mon.moves.forEach((mv, i) => {
      const mvDef   = DG.MOVES[mv.moveId];
      const my      = 208 + i * 22;
      const isSelMv = (i === _summaryMoveCursor);

      // Highlight row for selected move
      if (isSelMv) {
        ctx.fillStyle = 'rgba(255,224,80,0.18)';
        ctx.fillRect(6, my - 11, W - 12, 18);
        ctx.strokeStyle = '#FFE050';
        ctx.lineWidth = 1;
        ctx.strokeRect(6, my - 11, W - 12, 18);
      }

      // Cursor arrow
      ctx.fillStyle = isSelMv ? '#FFE050' : '#333';
      ctx.font = '10px monospace';
      ctx.fillText('▶', 8 - (isSelMv ? 0 : 1), my);

      // Move name
      ctx.fillStyle = isSelMv ? '#FFE050' : '#fff';
      ctx.font = '10px monospace';
      ctx.fillText(mvDef ? mvDef.name : mv.moveId, 18, my);

      if (mvDef) {
        // Type badge
        const nameW = ctx.measureText(mvDef ? mvDef.name : mv.moveId).width;
        _typeBadge(ctx, mvDef.type, 18 + nameW + 4, my - 1);

        // Category icon: ⚔ physical, ✦ special, ● status
        const catIcon = mvDef.category === 'PHYSICAL' ? '⚔'
                      : mvDef.category === 'SPECIAL'  ? '✦'
                      : '●';
        ctx.fillStyle = mvDef.category === 'PHYSICAL' ? '#ff8844'
                      : mvDef.category === 'SPECIAL'  ? '#88aaff'
                      : '#aaaaaa';
        ctx.font = '10px monospace';
        ctx.fillText(catIcon, 18 + nameW + 30, my);

        // BATTLE-STRATEGY Fase 2: priority-indicator (▲ eerst / ▼ laatst)
        if ((mvDef.priority || 0) !== 0) {
          ctx.fillStyle = mvDef.priority > 0 ? '#ffd75e' : '#8899bb';
          ctx.fillText(mvDef.priority > 0 ? '▲' : '▼', 18 + nameW + 42, my);
        }

        // PP
        ctx.fillStyle = '#666';
        ctx.fillText(`PP:${mv.ppCurrent}/${mv.ppMax}`, 138, my);
      }
    });

    ctx.fillStyle = '#888';
    ctx.font = '9px monospace';
    ctx.fillText('[↑↓] Select  [ENTER] Details  [ESC] Back', 10, H - 10);
  }

  // ── Word-wrap helper ─────────────────────────────────────────
  function _wrapText(ctx, text, maxWidth) {
    const words = (text || '').split(' ');
    const lines = [];
    let line = '';
    for (const w of words) {
      const test = line ? line + ' ' + w : w;
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = w;
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);
    return lines;
  }

  // ── Move Detail Screen ────────────────────────────────────────
  function _drawMoveDetail(ctx, W, H, mon, moveIdx) {
    const mv    = mon.moves[moveIdx];
    const mvDef = mv ? DG.MOVES[mv.moveId] : null;

    // Full dark background
    ctx.fillStyle = '#0a0f1e';
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = '#8ed8f8';
    ctx.lineWidth = 2;
    ctx.strokeRect(2, 2, W - 4, H - 4);

    if (!mvDef) {
      ctx.fillStyle = '#aaa';
      ctx.font = '11px monospace';
      ctx.fillText('No move data.', 10, 20);
      ctx.fillStyle = '#888';
      ctx.font = '10px monospace';
      ctx.fillText('[ESC] Back', 10, H - 10);
      return;
    }

    // ── Header bar ──────────────────────────────────────────────
    const typeCol = TYPE_COLORS[mvDef.type] || '#555';
    const hdrGrad = ctx.createLinearGradient(2, 2, W - 2, 2);
    hdrGrad.addColorStop(0, typeCol);
    hdrGrad.addColorStop(1, '#0a0f1e');
    ctx.fillStyle = hdrGrad;
    ctx.fillRect(2, 2, W - 4, 28);

    // Move name
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px monospace';
    ctx.textBaseline = 'top';
    ctx.fillText(mvDef.name, 10, 8);

    // Type badge
    _typeBadge(ctx, mvDef.type, W - 90, 8);

    // Category icon
    const catIcon  = mvDef.category === 'PHYSICAL' ? '⚔ Physical'
                   : mvDef.category === 'SPECIAL'  ? '✦ Special'
                   : '● Status';
    const catColor = mvDef.category === 'PHYSICAL' ? '#ff8844'
                   : mvDef.category === 'SPECIAL'  ? '#88aaff'
                   : '#aaaaaa';
    ctx.fillStyle = catColor;
    ctx.font = '9px monospace';
    ctx.fillText(catIcon, W - 62, 20);

    // ── Stat boxes (PWR / ACC / PP) ──────────────────────────────
    const boxY = 36, boxH = 26;
    const boxes = [
      { label:'PWR', value: mvDef.power > 0 ? String(mvDef.power) : '—' },
      { label:'ACC', value: mvDef.accuracy > 0 ? mvDef.accuracy + '%' : '—' },
      { label:'PP',  value: mv ? `${mv.ppCurrent}/${mv.ppMax}` : `${mvDef.pp}` },
    ];
    const boxW = 80;
    const boxGap = 8;
    const totalBoxW = boxes.length * boxW + (boxes.length - 1) * boxGap;
    const boxStartX = Math.floor((W - totalBoxW) / 2);

    boxes.forEach((b, i) => {
      const bx = boxStartX + i * (boxW + boxGap);
      // Box background
      ctx.fillStyle = '#151f35';
      _roundRect(ctx, bx, boxY, boxW, boxH, 4);
      ctx.fill();
      ctx.strokeStyle = '#3a5080';
      ctx.lineWidth = 1;
      ctx.stroke();
      // Label
      ctx.fillStyle = '#8ed8f8';
      ctx.font = '8px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(b.label, bx + boxW / 2, boxY + 5);
      // Value
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px monospace';
      ctx.fillText(b.value, bx + boxW / 2, boxY + 16);
      ctx.textAlign = 'left';
    });

    // ── Description ──────────────────────────────────────────────
    const descY = 70;
    ctx.fillStyle = '#8ed8f8';
    ctx.font = 'bold 9px monospace';
    ctx.fillText('Description:', 10, descY);

    ctx.fillStyle = '#ccddee';
    ctx.font = '9px monospace';
    const descLines = _wrapText(ctx, mvDef.description || 'No description.', W - 20);
    descLines.forEach((line, i) => {
      ctx.fillText(line, 10, descY + 12 + i * 12);
    });

    // ── Divider ──────────────────────────────────────────────────
    const divY = descY + 12 + descLines.length * 12 + 6;
    ctx.strokeStyle = '#2a3a5a';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(8, divY);
    ctx.lineTo(W - 8, divY);
    ctx.stroke();

    // ── Effect ───────────────────────────────────────────────────
    const effTxt = _effectText(mvDef.effect, mvDef);
    let effectSectionH = 0;
    if (effTxt) {
      const effRowY = divY + 10;
      ctx.fillStyle = '#8ed8f8';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'left';
      ctx.fillText('Effect:', 10, effRowY);
      ctx.fillStyle = _effectColor(mvDef.effect, mvDef);
      ctx.font = 'bold 9px monospace';
      ctx.fillText(effTxt, 68, effRowY);
      effectSectionH = 20;

      // Divider after effect
      ctx.strokeStyle = '#2a3a5a';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(8, divY + effectSectionH);
      ctx.lineTo(W - 8, divY + effectSectionH);
      ctx.stroke();
    }

    // ── Type Effectiveness ───────────────────────────────────────
    const ALL_TYPES = ['NORMAL','FIRE','WATER','GRASS','ELECTRIC','ICE','FIGHTING',
                       'POISON','GROUND','FLYING','PSYCHIC','BUG','ROCK','GHOST',
                       'DRAGON','DARK','STEEL','FAIRY'];

    const superVs  = [];
    const weakVs   = [];
    const noEffect = [];

    if (typeof DG.TypeChart !== 'undefined') {
      ALL_TYPES.forEach(defType => {
        const mult = DG.TypeChart.getEffectiveness(mvDef.type, [defType]);
        if (mult >= 2)        superVs.push(defType);
        else if (mult <= 0)   noEffect.push(defType);
        else if (mult < 1)    weakVs.push(defType);
      });
    }

    let effY = divY + effectSectionH + 10;
    const ROW_H = 18;

    function _drawEffRow(label, types, labelColor) {
      ctx.fillStyle = labelColor;
      ctx.font = 'bold 9px monospace';
      ctx.fillText(label, 10, effY);
      if (types.length === 0) {
        ctx.fillStyle = '#555';
        ctx.font = '9px monospace';
        ctx.fillText('none', 90, effY);
      } else {
        let bx = 90;
        types.forEach(t => {
          if (bx + 26 > W - 6) { effY += 14; bx = 90; }
          _typeBadge(ctx, t, bx, effY - 8);
          bx += 28;
        });
      }
      effY += ROW_H;
    }

    _drawEffRow('Strong vs:', superVs,  '#66ff66');
    _drawEffRow('Weak vs:',   weakVs,   '#ffaa44');
    _drawEffRow('No effect:', noEffect, '#888888');

    // ── Footer ───────────────────────────────────────────────────
    ctx.fillStyle = '#888';
    ctx.font = '9px monospace';
    ctx.fillText('[ESC] Back', 10, H - 10);
  }

  function _statLabel(key) {
    const MAP = { atk:'Atk', def:'Def', spAtk:'Sp.Atk', spDef:'Sp.Def', spd:'Speed', hp:'HP' };
    return MAP[key] || key;
  }

  function _ballColor(ballId) {
    const c = {
      DINOBALL:'#e04040', SUPERBALL:'#4080e0', ULTRABALL:'#202060',
      AMBERBALL:'#c08020', MASTERBALL:'#8020c0', DINOMASTERBALL:'#8020c0',
    };
    return c[ballId] || '#888';
  }

  function _ballName(ballId) {
    const n = {
      DINOBALL:'DinoBall', SUPERBALL:'SuperBall', ULTRABALL:'UltraBall',
      AMBERBALL:'AmberBall', MASTERBALL:'MasterBall', DINOMASTERBALL:'DinoMasterBall',
    };
    return n[ballId] || ballId;
  }

  console.log('[DinoMon] PartyMenu loaded (v15 — Move detail panel in Summary).');
  return { open, openBattle, update, draw };
})();

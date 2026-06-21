// DinoMon: Fossil Frontier — ui/menu.js
// Main/pause menu + choice menus + shop + options/settings

window.DG = window.DG || {};

DG.Menu = (function () {

  // ── State ─────────────────────────────────────────────────
  const SCREEN = {
    CLOSED:0, MAIN:1, PARTY:2, BAG:3, DEX:4,
    OPTIONS:5, CHOICE:6, SHOP:7, CONFIRM_RESTART:8, MAP:9, BADGES:10,
  };
  let _screen  = SCREEN.CLOSED;
  let _cursor  = 0;
  let _gs      = null;
  let _onClose = null;
  let _dirty   = true;

  // Choice menu
  let _choicePrompt  = '';
  let _choiceOptions = [];
  let _choiceCallback = null;

  // Shop
  let _shopItems    = [];
  let _shopCursor   = 0;
  let _shopMode     = 'BUY';
  let _shopSubMode  = 'BROWSE'; // 'BROWSE' | 'QTY'
  let _shopQty      = 1;

  // Options / settings
  const OPTIONS_LIST = ['Text Speed', 'Music Volume', 'SFX Volume', 'RESTART GAME', 'BACK'];
  let _optCursor      = 0;
  let _confirmCursor  = 0; // 0 = NO, 1 = YES

  const MAIN_OPTIONS = ['PARTY', 'BAG', 'DEX', 'MAP', 'BADGES', 'SAVE', 'OPTIONS', 'CLOSE'];

  // ── Public: open pause menu ───────────────────────────────
  function open(gameState, onClose) {
    _gs      = gameState;
    _onClose = onClose || null;
    _screen  = SCREEN.MAIN;
    _cursor  = 0;
    _dirty   = true;
  }

  function close() {
    _screen = SCREEN.CLOSED;
    const cb = _onClose;
    _onClose = null;
    if (typeof cb === 'function') cb();
  }

  // ── Public: show choice menu ──────────────────────────────
  function showChoiceMenu(prompt, options, callback) {
    _choicePrompt   = prompt;
    _choiceOptions  = options;
    _choiceCallback = callback;
    _cursor         = 0;
    _screen         = SCREEN.CHOICE;
    _dirty          = true;
  }

  // ── Public: show shop ─────────────────────────────────────
  function showShop(shopItems, gameState, onClose) {
    _gs      = gameState;
    _onClose = onClose;
    _shopItems = (shopItems || []).map(function(item) {
      if (typeof item === 'string') {
        const def = DG.ITEMS[item] || { name: item, price: 0 };
        return Object.assign({ id: item }, def);
      }
      return item;
    });
    _shopCursor  = 0;
    _shopMode    = 'BUY';
    _shopSubMode = 'BROWSE';
    _shopQty     = 1;
    _screen      = SCREEN.SHOP;
    _cursor      = 0;
    _dirty       = true;
  }

  // ── Public: update ────────────────────────────────────────
  function update(dt) {
    if (_screen === SCREEN.CLOSED) return;
    if (_screen === SCREEN.PARTY)           { DG.PartyMenu.update(dt); return; }
    if (_screen === SCREEN.BAG)             { DG.BagMenu.update(dt);   return; }
    if (_screen === SCREEN.DEX)             { DG.DexMenu.update(dt);   return; }
    if (_screen === SCREEN.MAP)             { _updateMap();            return; }
    if (_screen === SCREEN.BADGES)          { _updateBadges();         return; }
    if (_screen === SCREEN.CHOICE)          { _updateChoice();         return; }
    if (_screen === SCREEN.SHOP)            { _updateShop();           return; }
    if (_screen === SCREEN.OPTIONS)         { _updateOptions();        return; }
    if (_screen === SCREEN.CONFIRM_RESTART) { _updateConfirmRestart(); return; }
    _updateMain();
  }

  function _updateMain() {
    if (typeof DG.DialogueBox !== 'undefined' && DG.DialogueBox.isVisible && DG.DialogueBox.isVisible()) return;
    const len = MAIN_OPTIONS.length;
    if (DG.Input.isPressed('UP'))   { _cursor = (_cursor - 1 + len) % len; _dirty = true; }
    if (DG.Input.isPressed('DOWN')) { _cursor = (_cursor + 1) % len;       _dirty = true; }
    if (DG.Input.isPressed('A'))    { _selectMain(MAIN_OPTIONS[_cursor]); }
    if (DG.Input.isPressed('B') || DG.Input.isPressed('START')) { close(); }
  }

  function _selectMain(option) {
    switch (option) {
      case 'PARTY':
        DG.PartyMenu.open(_gs, () => { _screen = SCREEN.MAIN; _dirty = true; });
        _screen = SCREEN.PARTY;
        break;
      case 'BAG':
        DG.BagMenu.open(_gs, () => { _screen = SCREEN.MAIN; _dirty = true; });
        _screen = SCREEN.BAG;
        break;
      case 'DEX':
        DG.DexMenu.open(_gs, () => { _screen = SCREEN.MAIN; _dirty = true; });
        _screen = SCREEN.DEX;
        break;
      case 'MAP':
        _screen = SCREEN.MAP;
        _dirty = true;
        break;
      case 'BADGES':
        _screen = SCREEN.BADGES;
        _dirty  = true;
        break;
      case 'SAVE':
        DG.SaveLoad.save(_gs);
        // Store last save metadata for display in the menu
        try {
          localStorage.setItem('dinomon_last_save_info', JSON.stringify({
            map: _gs.player.currentMap,
            time: new Date().toLocaleTimeString()
          }));
        } catch(e) {}
        DG.DialogueBox.show(['Game saved!'], () => { _dirty = true; });
        break;
      case 'OPTIONS':
        _screen    = SCREEN.OPTIONS;
        _optCursor = 0;
        _dirty     = true;
        break;
      case 'CLOSE':
        close();
        break;
    }
  }

  // ── Options screen ────────────────────────────────────────
  function _updateOptions() {
    const len = OPTIONS_LIST.length;
    if (DG.Input.isPressed('UP'))   { _optCursor = (_optCursor - 1 + len) % len; _dirty = true; }
    if (DG.Input.isPressed('DOWN')) { _optCursor = (_optCursor + 1) % len;        _dirty = true; }

    const opt = OPTIONS_LIST[_optCursor];

    if (opt === 'Text Speed') {
      if (DG.Input.isPressed('LEFT') || DG.Input.isPressed('RIGHT') || DG.Input.isPressed('A')) {
        const speeds = ['SLOW', 'NORMAL', 'FAST'];
        const cur = speeds.indexOf(_gs.settings.textSpeed || 'NORMAL');
        _gs.settings.textSpeed = speeds[(cur + 1) % speeds.length];
        _dirty = true;
      }
    } else if (opt === 'Music Volume') {
      if (DG.Input.isPressed('LEFT')) {
        _gs.settings.musicVolume = Math.round(Math.max(0, (_gs.settings.musicVolume || 0.6) - 0.1) * 10) / 10;
        DG.Audio.setMusicVolume(_gs.settings.musicVolume);
        _dirty = true;
      }
      if (DG.Input.isPressed('RIGHT')) {
        _gs.settings.musicVolume = Math.round(Math.min(1, (_gs.settings.musicVolume || 0.6) + 0.1) * 10) / 10;
        DG.Audio.setMusicVolume(_gs.settings.musicVolume);
        _dirty = true;
      }
    } else if (opt === 'SFX Volume') {
      if (DG.Input.isPressed('LEFT')) {
        _gs.settings.sfxVolume = Math.round(Math.max(0, (_gs.settings.sfxVolume || 0.8) - 0.1) * 10) / 10;
        DG.Audio.setSfxVolume(_gs.settings.sfxVolume);
        _dirty = true;
      }
      if (DG.Input.isPressed('RIGHT')) {
        _gs.settings.sfxVolume = Math.round(Math.min(1, (_gs.settings.sfxVolume || 0.8) + 0.1) * 10) / 10;
        DG.Audio.setSfxVolume(_gs.settings.sfxVolume);
        _dirty = true;
      }
    } else if (opt === 'RESTART GAME') {
      if (DG.Input.isPressed('A')) {
        _screen        = SCREEN.CONFIRM_RESTART;
        _confirmCursor = 0; // default: NO
        _dirty         = true;
      }
    } else if (opt === 'BACK') {
      if (DG.Input.isPressed('A')) {
        _screen = SCREEN.MAIN; _cursor = 0; _dirty = true;
      }
    }

    if (DG.Input.isPressed('B')) {
      _screen = SCREEN.MAIN; _cursor = 0; _dirty = true;
    }
  }

  function _updateConfirmRestart() {
    if (DG.Input.isPressed('UP') || DG.Input.isPressed('DOWN')) {
      _confirmCursor = 1 - _confirmCursor; _dirty = true;
    }
    if (DG.Input.isPressed('A')) {
      if (_confirmCursor === 1) {
        // YES — delete save and restart
        DG.SaveLoad.deleteSave();
        location.reload();
      } else {
        // NO — go back to options
        _screen = SCREEN.OPTIONS; _dirty = true;
      }
    }
    if (DG.Input.isPressed('B')) {
      _screen = SCREEN.OPTIONS; _dirty = true;
    }
  }

  // ── Choice menu ───────────────────────────────────────────
  function _updateChoice() {
    if (typeof DG.DialogueBox !== 'undefined' && DG.DialogueBox.isVisible && DG.DialogueBox.isVisible()) return;
    const len = _choiceOptions.length;
    if (DG.Input.isPressed('UP'))   { _cursor = (_cursor - 1 + len) % len; _dirty = true; }
    if (DG.Input.isPressed('DOWN')) { _cursor = (_cursor + 1) % len;        _dirty = true; }
    if (DG.Input.isPressed('A')) {
      const idx = _cursor;
      _screen = SCREEN.CLOSED;
      const cb = _choiceCallback; _choiceCallback = null;
      if (typeof cb === 'function') cb(idx);
    }
    if (DG.Input.isPressed('B')) {
      // B = select last option (typically NO / Cancel)
      const idx = len - 1;
      _screen = SCREEN.CLOSED;
      const cb = _choiceCallback; _choiceCallback = null;
      if (typeof cb === 'function') cb(idx);
    }
  }

  // ── Shop ──────────────────────────────────────────────────
  function _getSellList() {
    if (!_gs || !_gs.player || !_gs.player.bag) return [];
    return Object.entries(_gs.player.bag)
      .filter(([, qty]) => qty > 0)
      .map(([id, qty]) => {
        const def = DG.ITEMS[id] || { name: id, price: 0, type: 'MISC' };
        return { id, name: def.name, qty, sellPrice: Math.floor((def.price || 0) / 2), type: def.type };
      })
      .filter(item => item.type !== 'KEY' && item.sellPrice > 0);
  }

  function _closeShop() {
    _screen = SCREEN.CLOSED;
    const cb = _onClose; _onClose = null;
    if (typeof cb === 'function') cb();
  }

  function _updateShop() {
    // While a dialogue is visible, don't process shop input — avoid double-B closing shop
    if (typeof DG.DialogueBox !== 'undefined' && DG.DialogueBox.isVisible && DG.DialogueBox.isVisible()) return;

    // ── QTY sub-mode: quantity selector overlay ───────────────
    if (_shopSubMode === 'QTY') {
      if (DG.Input.isPressed('LEFT'))  { _shopQty = Math.max(1, _shopQty - 1); _dirty = true; }
      if (DG.Input.isPressed('RIGHT')) { _shopQty = Math.min(99, _shopQty + 1); _dirty = true; }
      if (DG.Input.isPressed('A')) {
        const item = _shopItems[_shopCursor];
        if (item) {
          const total = item.price * _shopQty;
          if (_gs.player.money >= total) {
            _gs.player.money -= total;
            DG.SaveLoad.addItem(_gs, item.id, _shopQty);
            const qtyStr = _shopQty > 1 ? `${_shopQty}× ` : '';
            DG.DialogueBox.show([`Bought ${qtyStr}${item.name}!`], () => { _dirty = true; });
          } else {
            DG.DialogueBox.show([`Not enough money!`], () => { _dirty = true; });
          }
        }
        _shopSubMode = 'BROWSE';
        _shopQty     = 1;
        _dirty       = true;
      }
      if (DG.Input.isPressed('B')) {
        _shopSubMode = 'BROWSE';
        _shopQty     = 1;
        _dirty       = true;
      }
      return;
    }

    // ── BROWSE mode ───────────────────────────────────────────
    if (DG.Input.isPressed('LEFT') || DG.Input.isPressed('RIGHT')) {
      _shopMode    = _shopMode === 'BUY' ? 'SELL' : 'BUY';
      _shopSubMode = 'BROWSE';
      _shopCursor  = 0;
      _dirty       = true;
    }
    if (_shopMode === 'BUY') {
      // +1 for the BACK entry at the end
      const listLen = _shopItems.length + 1;
      if (DG.Input.isPressed('UP'))   { _shopCursor = Math.max(0, _shopCursor - 1); _dirty = true; }
      if (DG.Input.isPressed('DOWN')) { _shopCursor = Math.min(listLen - 1, _shopCursor + 1); _dirty = true; }
      if (DG.Input.isPressed('A')) {
        if (_shopCursor === _shopItems.length) {
          _closeShop(); return;
        }
        // Enter QTY mode for a valid item
        const item = _shopItems[_shopCursor];
        if (item) {
          _shopSubMode = 'QTY';
          _shopQty     = 1;
          _dirty       = true;
        }
      }
    } else {
      const sellList = _getSellList();
      // +1 for the BACK entry at the end
      const listLen = sellList.length + 1;
      if (DG.Input.isPressed('UP'))   { _shopCursor = Math.max(0, _shopCursor - 1); _dirty = true; }
      if (DG.Input.isPressed('DOWN')) { _shopCursor = Math.min(listLen - 1, _shopCursor + 1); _dirty = true; }
      if (DG.Input.isPressed('A')) {
        if (_shopCursor === sellList.length) {
          _closeShop(); return;
        }
        const item = sellList[_shopCursor];
        if (item) {
          _gs.player.money = (_gs.player.money || 0) + item.sellPrice;
          DG.SaveLoad.removeItem(_gs, item.id, 1);
          _shopCursor = Math.min(_shopCursor, _getSellList().length); // clamp, allow BACK pos
          DG.DialogueBox.show([`Sold ${item.name} for ¥${item.sellPrice}!`], () => { _dirty = true; });
        } else {
          DG.DialogueBox.show([`Nothing to sell!`], () => { _dirty = true; });
        }
      }
    }
    if (DG.Input.isPressed('B')) {
      _closeShop();
    }
  }

  // ── Map screen ────────────────────────────────────────────
  function _updateMap() {
    if (DG.Input.isPressed('B') || DG.Input.isPressed('START') || DG.Input.isPressed('A')) {
      _screen = SCREEN.MAIN; _cursor = 0; _dirty = true;
    }
  }

  function _updateBadges() {
    if (DG.Input.isPressed('B') || DG.Input.isPressed('START')) {
      _screen = SCREEN.MAIN; _cursor = 0; _dirty = true;
    }
  }

  // ── Draw ──────────────────────────────────────────────────
  function draw(ctx) {
    if (_screen === SCREEN.CLOSED) return;
    if (_screen === SCREEN.PARTY)           { DG.PartyMenu.draw(ctx);       return; }
    if (_screen === SCREEN.BAG)             { DG.BagMenu.draw(ctx);         return; }
    if (_screen === SCREEN.DEX)             { DG.DexMenu.draw(ctx);         return; }
    if (_screen === SCREEN.CHOICE)          { _drawChoice(ctx);             return; }
    if (_screen === SCREEN.SHOP)            { _drawShop(ctx);               return; }
    if (_screen === SCREEN.OPTIONS)         { _drawOptions(ctx);            return; }
    if (_screen === SCREEN.CONFIRM_RESTART) { _drawConfirmRestart(ctx);     return; }
    if (_screen === SCREEN.MAP)             { _drawMap(ctx);                return; }
    if (_screen === SCREEN.BADGES)          { _drawBadges(ctx);             return; }
    _drawMain(ctx);
  }

  function _drawMain(ctx) {
    const W = DG.CANVAS.W;
    const boxW = 140, boxH = MAIN_OPTIONS.length * 22 + 16;
    const bx = W - boxW - 4, by = 4;
    _drawWindow(ctx, bx, by, boxW, boxH);
    ctx.font = '13px monospace';
    ctx.textBaseline = 'top';
    MAIN_OPTIONS.forEach((opt, i) => {
      ctx.fillStyle = i === _cursor ? '#FFE050' : '#FFFFFF';
      ctx.fillText((i === _cursor ? '▶ ' : '  ') + opt, bx + 12, by + 8 + i * 22);
      // Show last save info as subtitle under SAVE
      if (opt === 'SAVE') {
        let saveInfo = null;
        try {
          const raw = localStorage.getItem('dinomon_last_save_info');
          if (raw) saveInfo = JSON.parse(raw);
        } catch(e) {}
        if (saveInfo && saveInfo.map && saveInfo.time) {
          // Pretty-print the map name
          const mapLabel = (saveInfo.map || '').replace(/_/g, ' ').replace(/CITY|TOWN/g, '').trim();
          ctx.fillStyle = '#666677';
          ctx.font = '8px monospace';
          ctx.fillText(`  ${mapLabel} · ${saveInfo.time}`, bx + 12, by + 8 + i * 22 + 12);
          ctx.font = '13px monospace';
        }
      }
    });
    ctx.fillStyle = '#aaffaa';
    ctx.font = '12px monospace';
    ctx.fillText(`¥${_gs.player.money}`, bx + 12, by + boxH + 6);
  }

  // Clean schematic world map: labelled nodes + numbered route lines + you-are-here + goal.
  function _drawMap(ctx) {
    const W = DG.CANVAS.W, H = DG.CANVAS.H;
    const TITLE_H = 24, MAP_Y = TITLE_H;
    _drawMap._t = (_drawMap._t || 0) + 1;
    const pulse = 0.5 + 0.5 * Math.sin(_drawMap._t * 0.12);

    function rr(x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath();
    }

    // Background — dark schematic
    const bg = ctx.createLinearGradient(0, MAP_Y, 0, H);
    bg.addColorStop(0, '#0b1228'); bg.addColorStop(1, '#0e1832');
    ctx.fillStyle = bg; ctx.fillRect(0, MAP_Y, W, H - MAP_Y);
    ctx.strokeStyle = 'rgba(80,120,180,0.06)'; ctx.lineWidth = 1;
    for (let gx = 0; gx < W; gx += 24) { ctx.beginPath(); ctx.moveTo(gx, MAP_Y); ctx.lineTo(gx, H); ctx.stroke(); }
    for (let gy = MAP_Y; gy < H; gy += 24) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke(); }

    // Node table: id -> [name, x, y, gymNum(0=none), type]
    const N = {
      AMBERTOWN:       ['Ambertown',     52, 286, 0, 'start'],
      SHELLCREEK_CITY: ['Shellcreek',    52, 245, 1, 'gym'],
      DUSTWALL_TOWN:   ['Dustwall',      52, 204, 2, 'gym'],
      PYRESIDE_CITY:   ['Pyreside',      52, 163, 3, 'gym'],
      FERNGROVE_TOWN:  ['Ferngrove',    158, 170, 4, 'gym'],
      FAIRYDELL_CITY:  ['Fairydell',    100, 150, 5, 'gym'],
      STONEHAVEN_CITY: ['Stonehaven',   116, 110, 6, 'gym'],
      CRESTFALL_TOWN:  ['Crestfall',    214,  78, 7, 'gym'],
      BOGMIRE_CITY:    ['Bogmire',      332, 120, 8, 'gym'],
      APEXSUMMIT:      ['Apex Summit',  322,  56, 9, 'gym'],
      MT_CRETACEOUS:   ['Mt Cretaceous',422,  56, 0, 'peak'],
      FOSSIL_CITADEL:  ['Fossil Citadel',426,110, 0, 'citadel'],
    };
    const E = [
      ['AMBERTOWN','SHELLCREEK_CITY','1'], ['SHELLCREEK_CITY','DUSTWALL_TOWN','2'],
      ['DUSTWALL_TOWN','PYRESIDE_CITY','3'], ['PYRESIDE_CITY','FERNGROVE_TOWN','4'],
      ['FERNGROVE_TOWN','FAIRYDELL_CITY','5'], ['FAIRYDELL_CITY','STONEHAVEN_CITY','5'],
      ['STONEHAVEN_CITY','CRESTFALL_TOWN','6'],
      ['STONEHAVEN_CITY','BOGMIRE_CITY','7'], ['CRESTFALL_TOWN','BOGMIRE_CITY','8'],
      ['BOGMIRE_CITY','APEXSUMMIT','9'], ['APEXSUMMIT','MT_CRETACEOUS','10'],
      ['APEXSUMMIT','FOSSIL_CITADEL','C'],
    ];

    const flags  = (_gs && _gs.player && _gs.player.flags) || {};
    const badges = (_gs && _gs.player && _gs.player.badges) || [];
    const curMap = (_gs && _gs.player && _gs.player.currentMap) || '';
    const citadelUnlocked = badges.length >= 9 || flags['BADGE_9'] || flags['FOSSIL_CITADEL_OPEN'];

    function isHere(id) { return curMap === id || curMap.indexOf(id) === 0; }
    function visited(id) {
      if (isHere(id)) return true;
      if (flags['VISITED_' + id]) return true;
      for (const k in flags) { if (flags[k] && k.indexOf('VISITED_' + id) === 0) return true; }
      // fall back: nodes up to the highest earned badge are considered known
      return false;
    }
    function goalId() {
      if (flags['ELITE_4_DONE'] || flags['DIRECTOR_CLADE_DEFEATED']) return null;
      if (flags['BADGE_9']) return 'FOSSIL_CITADEL';
      if (flags['BADGE_8']) return 'APEXSUMMIT';
      if (flags['BADGE_7']) return 'BOGMIRE_CITY';
      if (flags['BADGE_6']) return 'CRESTFALL_TOWN';
      if (flags['BADGE_5']) return 'STONEHAVEN_CITY';
      if (flags['BADGE_4']) return 'FAIRYDELL_CITY';
      if (flags['BADGE_3']) return 'FERNGROVE_TOWN';
      if (flags['BADGE_2']) return 'PYRESIDE_CITY';
      if (flags['BADGE_1']) return 'DUSTWALL_TOWN';
      return 'SHELLCREEK_CITY';
    }
    const goal = goalId();

    // ── Route edges ──
    for (const e of E) {
      const a = N[e[0]], b = N[e[1]];
      if (!a || !b) continue;
      const isCitadel = (e[2] === 'C');
      const locked = isCitadel && !citadelUnlocked;
      const known = visited(e[0]) || visited(e[1]);
      ctx.save();
      ctx.lineWidth = 3;
      ctx.strokeStyle = locked ? 'rgba(120,120,140,0.30)' : (known ? '#5a86c0' : 'rgba(90,134,192,0.40)');
      if (locked) ctx.setLineDash([3, 4]);
      ctx.beginPath(); ctx.moveTo(a[1], a[2]); ctx.lineTo(b[1], b[2]); ctx.stroke();
      ctx.restore();
      const mx = (a[1] + b[1]) / 2, my = (a[2] + b[2]) / 2;
      const lbl = isCitadel ? '★' : ('R' + e[2]);
      ctx.font = 'bold 8px monospace';
      const lw = ctx.measureText(lbl).width + 6;
      ctx.fillStyle = locked ? 'rgba(40,44,60,0.92)' : 'rgba(12,24,52,0.95)';
      ctx.strokeStyle = locked ? '#666' : '#5a86c0'; ctx.lineWidth = 1;
      rr(mx - lw / 2, my - 7, lw, 14, 4); ctx.fill(); ctx.stroke();
      ctx.fillStyle = locked ? '#888' : '#bfe0ff';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(lbl, mx, my + 0.5);
    }

    // ── Nodes ──
    for (const id in N) {
      const nd = N[id], name = nd[0], x = nd[1], y = nd[2], gym = nd[3], type = nd[4];
      const here = isHere(id), vis = visited(id), isGoal = (id === goal);

      if (id === 'FOSSIL_CITADEL' && !citadelUnlocked) {
        ctx.fillStyle = 'rgba(60,66,90,0.92)';
        ctx.beginPath(); ctx.arc(x, y, 7, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#888'; ctx.lineWidth = 1; ctx.setLineDash([2, 2]); ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle = '#aab'; ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('?', x, y + 0.5);
        continue;
      }

      if (isGoal && !here) {
        ctx.save(); ctx.globalAlpha = 0.35 + 0.45 * pulse;
        ctx.strokeStyle = '#ffd23a'; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.arc(x, y, 14, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
      }
      if (here) {
        const g = ctx.createRadialGradient(x, y, 2, x, y, 17);
        g.addColorStop(0, 'rgba(255,220,0,' + (0.45 + 0.3 * pulse) + ')');
        g.addColorStop(1, 'rgba(255,220,0,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 17, 0, Math.PI * 2); ctx.fill();
      }

      let col = here ? '#ffe050' : isGoal ? '#ffd23a' : vis ? '#7fb0e6' : '#3a4763';
      if (type === 'peak')    col = vis ? '#e07050' : '#3a4763';
      if (type === 'citadel') col = '#ffd700';
      if (type === 'start')   col = vis ? '#6ad06a' : '#5a86c0';
      ctx.fillStyle = col; ctx.strokeStyle = here ? '#ffffff' : 'rgba(0,0,0,0.5)'; ctx.lineWidth = here ? 2 : 1;
      if (type === 'peak') {
        ctx.beginPath(); ctx.moveTo(x, y - 8); ctx.lineTo(x - 7, y + 6); ctx.lineTo(x + 7, y + 6); ctx.closePath(); ctx.fill(); ctx.stroke();
      } else {
        ctx.beginPath(); ctx.arc(x, y, 7, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      }

      if (gym > 0) {
        const beaten = badges.length >= gym || flags['BADGE_' + gym];
        ctx.fillStyle = beaten ? '#ffcf33' : '#55607a';
        ctx.beginPath(); ctx.arc(x + 6, y - 6, 4.5, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 0.8; ctx.stroke();
        ctx.fillStyle = beaten ? '#5a3a00' : '#cdd6e6'; ctx.font = 'bold 7px monospace';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(String(gym), x + 6, y - 5.5);
      }

      // Name label below the node (always shown so you can plan ahead)
      ctx.save(); ctx.shadowColor = 'rgba(0,0,0,0.95)'; ctx.shadowBlur = 3;
      ctx.fillStyle = here ? '#ffe87a' : isGoal ? '#ffd23a' : vis ? '#cdd6e6' : 'rgba(150,165,195,0.6)';
      ctx.font = here ? 'bold 9px monospace' : '9px monospace';
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText(name, x, y + 9);
      ctx.restore();

      // YOU / GOAL tags above the node
      ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
      ctx.font = 'bold 8px monospace';
      if (here)       { ctx.fillStyle = '#ffe050'; ctx.fillText('YOU ▾', x, y - 12); }
      else if (isGoal){ ctx.fillStyle = '#ffd23a'; ctx.fillText('GOAL ▾', x, y - 12); }
    }

    // ── "You are here" on a ROUTE (not a town node): mark the matching edge ──
    const onTownNode = (function () { for (const id in N) if (isHere(id)) return true; return false; })();
    if (!onTownNode && /^ROUTE_(\d+)/.test(curMap)) {
      const rn = curMap.match(/^ROUTE_(\d+)/)[1];
      const edge = E.find(function (e) { return e[2] === rn; });
      if (edge) {
        const a = N[edge[0]], b = N[edge[1]];
        const mx = (a[1] + b[1]) / 2, my = (a[2] + b[2]) / 2;
        const g = ctx.createRadialGradient(mx, my, 2, mx, my, 14);
        g.addColorStop(0, 'rgba(255,220,0,' + (0.5 + 0.3 * pulse) + ')'); g.addColorStop(1, 'rgba(255,220,0,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(mx, my, 14, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffe050'; ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(mx, my, 5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#ffe050'; ctx.font = 'bold 8px monospace';
        ctx.textAlign = 'center'; ctx.textBaseline = 'bottom'; ctx.fillText('YOU ▾', mx, my - 8);
      }
    }

    // ── Title bar ──
    const tg = ctx.createLinearGradient(0, 0, 0, TITLE_H);
    tg.addColorStop(0, 'rgba(8,16,48,0.97)'); tg.addColorStop(1, 'rgba(10,22,58,0.95)');
    ctx.fillStyle = tg; ctx.fillRect(0, 0, W, TITLE_H);
    ctx.strokeStyle = '#3a6a9a'; ctx.lineWidth = 1; ctx.strokeRect(0, 0, W, TITLE_H);
    ctx.fillStyle = '#8ed8f8'; ctx.font = 'bold 12px monospace'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillText('WORLD MAP', 10, TITLE_H / 2);
    const curNode = N[curMap] || (function () { for (const id in N) if (isHere(id)) return N[id]; return null; })();
    if (curNode) {
      ctx.fillStyle = '#ffe050'; ctx.font = 'bold 9px monospace'; ctx.textAlign = 'right';
      ctx.fillText('★ ' + curNode[0], W - 8, TITLE_H / 2);
    }

    // ── Legend (bottom-left) ──
    const LX = 4, LY = H - 56, LW = 150, LH = 52;
    ctx.fillStyle = 'rgba(6,14,40,0.9)'; ctx.strokeStyle = '#3a6a9a'; ctx.lineWidth = 1;
    rr(LX, LY, LW, LH, 3); ctx.fill(); ctx.stroke();
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillStyle = '#8ed8f8'; ctx.font = 'bold 8px monospace'; ctx.fillText('LEGEND', LX + 5, LY + 8);
    const leg = [
      ['#ffe050', 'You are here'],
      ['#ffd23a', 'Your next goal'],
      ['#ffcf33', 'Gym (gold = beaten)'],
      ['#bfe0ff', 'R# = route (wild grass)'],
    ];
    ctx.font = '8px monospace';
    leg.forEach(function (it, i) {
      const ly = LY + 20 + i * 9;
      ctx.fillStyle = it[0]; ctx.beginPath(); ctx.arc(LX + 9, ly, 3, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#aabbcc'; ctx.fillText(it[1], LX + 17, ly);
    });

    // ── Close hint (bottom-right) ──
    ctx.fillStyle = 'rgba(6,14,40,0.8)'; rr(W - 96, H - 16, 92, 13, 3); ctx.fill();
    ctx.fillStyle = '#7088aa'; ctx.font = '9px monospace'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillText('[B/ESC] Close', W - 90, H - 9);
  }

  function _drawBadges(ctx) {
    const W = DG.CANVAS.W, H = DG.CANVAS.H;
    _drawWindow(ctx, 2, 2, W - 4, H - 4);

    // Title
    ctx.font = 'bold 14px monospace';
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#FFD700';
    ctx.fillText('GYM BADGES', 12, 10);

    const earned  = (_gs && _gs.player && _gs.player.badges) ? _gs.player.badges : [];
    const earnedN = earned.length;

    ctx.font = '11px monospace';
    ctx.fillStyle = '#aaaaaa';
    ctx.textAlign = 'right';
    ctx.fillText(`${earnedN} / 9 earned`, W - 10, 10);
    ctx.textAlign = 'left';

    const ALL_BADGES = [
      { name:'Herd Badge',    gym:'Normal Normi · Shellcreek',     type:'NORMAL',   col:'#aaaaaa' },
      { name:'Fossil Badge',  gym:'Jam Sennings · Dustwall',    type:'ROCK',     col:'#aa8833' },
      { name:'Magma Badge',   gym:'Asset Toverdijk · Pyreside',     type:'FIRE',     col:'#ff4411' },
      { name:'Canopy Badge',  gym:'PuKing Maarten · Ferngrove',    type:'GRASS',    col:'#33aa33' },
      { name:'Charm Badge',   gym:'AFK Jorn · Fairydell',        type:'FAIRY',    col:'#dd77aa' },
      { name:'Bedrock Badge', gym:'Rock Hard Toonen · Stonehaven',   type:'GROUND',   col:'#cc8833' },
      { name:'Static Badge',  gym:'Beyblade Luuk · Crestfall',     type:'ELECTRIC', col:'#ffcc00' },
      { name:'Tide Badge',    gym:'Surfing Peter · Bogmire',     type:'WATER',    col:'#3377ff' },
      { name:'Scale Badge',   gym:'Bipolar Fieke · Apex Summit', type:'DRAGON',   col:'#6644cc' },
    ];

    ALL_BADGES.forEach(function(b, i) {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const bx  = 10 + col * (Math.floor(W / 2) - 6);
      const by  = 32 + row * 54;
      const got = earned.includes(b.name);

      // Badge hexagon
      const cx = bx + 20, cy = by + 20, r = 17;
      ctx.beginPath();
      for (let a = 0; a < 6; a++) {
        const ang = (Math.PI / 3) * a - Math.PI / 6;
        const px  = cx + r * Math.cos(ang);
        const py  = cy + r * Math.sin(ang);
        if (a === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fillStyle   = got ? b.col : '#1a1a2e';
      ctx.fill();
      ctx.strokeStyle = got ? '#ffffff' : '#334466';
      ctx.lineWidth   = got ? 2 : 1;
      ctx.stroke();

      // Type initial inside hex
      ctx.fillStyle    = got ? '#ffffff' : '#334466';
      ctx.font         = `bold ${got ? 10 : 9}px monospace`;
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(b.type[0], cx, cy);

      // Badge name + gym info
      ctx.textAlign    = 'left';
      ctx.textBaseline = 'top';
      ctx.fillStyle    = got ? '#ffffff' : '#445566';
      ctx.font         = `${got ? 'bold ' : ''}11px monospace`;
      ctx.fillText(b.name, bx + 42, by + 4);
      ctx.fillStyle = got ? '#aaaaaa' : '#334455';
      ctx.font      = '10px monospace';
      ctx.fillText(b.gym, bx + 42, by + 18);
      if (got) {
        ctx.fillStyle = '#aaffaa';
        ctx.fillText('✓ EARNED', bx + 42, by + 30);
      }
    });

    // Footer: Fossil Citadel status
    const hasAll = earnedN >= 8;
    const fby    = H - 38;
    ctx.fillStyle   = hasAll ? 'rgba(80,60,0,0.8)' : 'rgba(10,10,25,0.8)';
    ctx.fillRect(10, fby, W - 20, 26);
    ctx.strokeStyle = hasAll ? '#FFD700' : '#334466';
    ctx.lineWidth   = 1;
    ctx.strokeRect(10, fby, W - 20, 26);
    ctx.fillStyle    = hasAll ? '#FFD700' : '#445577';
    ctx.font         = `${hasAll ? 'bold ' : ''}10px monospace`;
    ctx.textBaseline = 'top';
    ctx.fillText(
      hasAll
        ? '★ All badges collected! Fossil Citadel is now open!'
        : `[ Collect all 8 badges to reach the Fossil Citadel ]`,
      16, fby + 8
    );

    // Back hint
    ctx.fillStyle = '#445566';
    ctx.font      = '10px monospace';
    ctx.fillText('[B/ESC] Back', 12, H - 12);
  }

  function _drawOptions(ctx) {
    const W = DG.CANVAS.W, H = DG.CANVAS.H;
    const boxW = 290, boxH = OPTIONS_LIST.length * 28 + 46 + 42; // +42 for stats block
    const bx = Math.floor((W - boxW) / 2);
    const by = Math.floor((H - boxH) / 2);
    _drawWindow(ctx, bx, by, boxW, boxH);

    ctx.font = '13px monospace';
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#8ed8f8';
    ctx.fillText('OPTIONS', bx + 12, by + 10);

    OPTIONS_LIST.forEach((opt, i) => {
      const y = by + 36 + i * 28;
      const sel = i === _optCursor;
      ctx.fillStyle = sel ? '#FFE050' : '#FFFFFF';
      ctx.fillText((sel ? '▶ ' : '  ') + opt, bx + 12, y);

      // Value display (right-aligned)
      let value = '';
      if (opt === 'Text Speed') {
        value = _gs.settings.textSpeed || 'NORMAL';
      } else if (opt === 'Music Volume') {
        const v = Math.round((_gs.settings.musicVolume || 0.6) * 10);
        value = '▓'.repeat(v) + '░'.repeat(10 - v);
      } else if (opt === 'SFX Volume') {
        const v = Math.round((_gs.settings.sfxVolume || 0.8) * 10);
        value = '▓'.repeat(v) + '░'.repeat(10 - v);
      }
      if (value) {
        ctx.fillStyle = sel ? '#FFE050' : '#88ddff';
        ctx.textAlign = 'right';
        ctx.fillText(value, bx + boxW - 12, y);
        ctx.textAlign = 'left';
      }
    });

    // ── Lifetime stats (blackouts + money lost) ──
    const stats = (_gs && _gs.player && _gs.player.stats) || {};
    const sy = by + 36 + OPTIONS_LIST.length * 28 + 4;
    ctx.strokeStyle = '#2a4a6a'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(bx + 12, sy); ctx.lineTo(bx + boxW - 12, sy); ctx.stroke();
    ctx.font = '11px monospace'; ctx.textBaseline = 'top';
    ctx.fillStyle = '#cc8888';
    ctx.fillText('Black-outs:', bx + 12, sy + 6);
    ctx.fillStyle = '#ffbbbb'; ctx.textAlign = 'right';
    ctx.fillText(String(stats.blackouts || 0), bx + boxW - 12, sy + 6);
    ctx.textAlign = 'left';
    ctx.fillStyle = '#cc8888';
    ctx.fillText('Money lost:', bx + 12, sy + 20);
    ctx.fillStyle = '#ffbbbb'; ctx.textAlign = 'right';
    ctx.fillText('¥' + (stats.moneyLost || 0), bx + boxW - 12, sy + 20);
    ctx.textAlign = 'left';

    // Hint
    ctx.fillStyle = '#555577';
    ctx.font = '11px monospace';
    ctx.fillText('[◄►] adjust  [ESC] back', bx + 12, by + boxH - 14);
  }

  function _drawConfirmRestart(ctx) {
    const W = DG.CANVAS.W, H = DG.CANVAS.H;
    const boxW = 240, boxH = 120;
    const bx = Math.floor((W - boxW) / 2);
    const by = Math.floor((H - boxH) / 2);
    _drawWindow(ctx, bx, by, boxW, boxH);

    ctx.font = '13px monospace';
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#ff8888';
    ctx.fillText('RESTART GAME?', bx + 14, by + 12);
    ctx.fillStyle = '#ffffff';
    ctx.fillText('All progress will be', bx + 14, by + 32);
    ctx.fillText('permanently lost!', bx + 14, by + 48);

    const opts = ['NO  (keep playing)', 'YES (restart now)'];
    opts.forEach((opt, i) => {
      const y = by + 76 + i * 22;
      ctx.fillStyle = i === _confirmCursor ? '#FFE050' : '#cccccc';
      ctx.fillText((i === _confirmCursor ? '▶ ' : '  ') + opt, bx + 14, y);
    });
  }

  function _drawChoice(ctx) {
    const W = DG.CANVAS.W, H = DG.CANVAS.H;
    const lines = _choicePrompt.split('\n');
    const boxW  = Math.min(W - 20, 300);
    const boxH  = lines.length * 16 + _choiceOptions.length * 22 + 24;
    const bx = Math.floor((W - boxW) / 2);
    const by = Math.floor((H - boxH) / 2);
    _drawWindow(ctx, bx, by, boxW, boxH);
    ctx.font = '13px monospace';
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#ffffff';
    lines.forEach((l, i) => ctx.fillText(l, bx + 10, by + 8 + i * 16));
    const optY = by + 8 + lines.length * 16 + 4;
    _choiceOptions.forEach((opt, i) => {
      ctx.fillStyle = i === _cursor ? '#FFE050' : '#FFFFFF';
      ctx.fillText((i === _cursor ? '▶ ' : '  ') + opt, bx + 12, optY + i * 22);
    });
  }

  function _drawShop(ctx) {
    const W = DG.CANVAS.W, H = DG.CANVAS.H;

    // Grey-out main shop when QTY overlay is active
    const dimmed = _shopSubMode === 'QTY';
    _drawWindow(ctx, 4, 4, W - 8, H - 8);

    ctx.save();
    if (dimmed) ctx.globalAlpha = 0.35;

    ctx.font = '13px monospace';
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#8ed8f8';
    ctx.fillText('SHOP', 16, 12);
    // Mode tabs with arrows to hint switching
    ctx.fillStyle = _shopMode === 'BUY'  ? '#FFE050' : '#aaaaaa';
    ctx.fillText('◄ BUY',  72, 12);
    ctx.fillStyle = _shopMode === 'SELL' ? '#FFE050' : '#aaaaaa';
    ctx.fillText('SELL ►', 125, 12);
    ctx.fillStyle = '#aaffaa';
    ctx.fillText(`¥${_gs.player.money}`, W - 90, 12);

    if (_shopMode === 'BUY') {
      _shopItems.forEach((item, i) => {
        const y = 36 + i * 22;
        ctx.fillStyle = i === _shopCursor ? '#FFE050' : '#ffffff';
        ctx.fillText((i === _shopCursor ? '▶ ' : '  ') + item.name, 14, y);
        ctx.fillStyle = '#aaffaa';
        ctx.fillText(`¥${item.price}`, W - 80, y);
      });
      // BACK entry
      const backY = 36 + _shopItems.length * 22;
      const backSel = _shopCursor === _shopItems.length;
      ctx.fillStyle = backSel ? '#FFE050' : '#aaaaaa';
      ctx.fillText((backSel ? '▶ ' : '  ') + 'BACK', 14, backY);
    } else {
      const sellList = _getSellList();
      if (sellList.length === 0) {
        ctx.fillStyle = '#777';
        ctx.fillText('  Nothing to sell.', 14, 36);
      } else {
        sellList.forEach((item, i) => {
          const y = 36 + i * 22;
          ctx.fillStyle = i === _shopCursor ? '#FFE050' : '#ffffff';
          ctx.fillText((i === _shopCursor ? '▶ ' : '  ') + item.name + ' x' + item.qty, 14, y);
          ctx.fillStyle = '#ffdd88';
          ctx.fillText(`¥${item.sellPrice}`, W - 80, y);
        });
      }
      // BACK entry
      const backIdx = sellList.length;
      const backY   = 36 + backIdx * 22;
      const backSel = _shopCursor === backIdx;
      ctx.fillStyle = backSel ? '#FFE050' : '#aaaaaa';
      ctx.fillText((backSel ? '▶ ' : '  ') + 'BACK', 14, backY);
    }

    // Footer hint
    ctx.fillStyle = '#666';
    ctx.font = '11px monospace';
    ctx.fillText('[◄►] BUY/SELL   [ESC] Back', 16, H - 20);
    ctx.restore();

    // ── QTY Overlay ──────────────────────────────────────────
    if (_shopSubMode === 'QTY') {
      const item  = _shopItems[_shopCursor];
      if (!item) return;
      const total = item.price * _shopQty;

      // Overlay box dimensions
      const bw = 180, bh = 100;
      const bx = Math.floor((W - bw) / 2);
      const by = Math.floor((H - bh) / 2) - 10;

      _drawWindow(ctx, bx, by, bw, bh);

      ctx.font = '12px monospace';
      ctx.textBaseline = 'top';
      ctx.textAlign    = 'center';
      const cx = bx + bw / 2;

      // Title
      ctx.fillStyle = '#8ed8f8';
      ctx.fillText('How many?', cx, by + 8);

      // Item name
      ctx.fillStyle = '#ffffff';
      ctx.fillText(item.name, cx, by + 24);

      // Qty selector with arrows
      ctx.fillStyle = '#FFE050';
      ctx.font = '14px monospace';
      ctx.fillText(`\u25C4 ${_shopQty} \u25BA`, cx, by + 42);

      // Total price
      ctx.font = '11px monospace';
      const canAfford = _gs.player.money >= total;
      ctx.fillStyle = canAfford ? '#aaffaa' : '#ff8888';
      ctx.fillText(`Total: \u00A5${total}`, cx, by + 62);

      // Controls hint
      ctx.fillStyle = '#888';
      ctx.font = '10px monospace';
      ctx.fillText('[ENTER] Buy  [ESC] Cancel', cx, by + 80);

      ctx.textAlign = 'left';
    }
  }

  // ── Shared window helper ──────────────────────────────────
  function _drawWindow(ctx, x, y, w, h) {
    const r = 6;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x + r, y);          ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);          ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    const grad = ctx.createLinearGradient(x, y, x, y + h);
    grad.addColorStop(0, 'rgba(14,20,54,0.97)');
    grad.addColorStop(1, 'rgba(6,10,30,0.97)');
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = '#5a9fd4';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + r, y + 1); ctx.lineTo(x + w - r, y + 1);
    ctx.strokeStyle = 'rgba(150,210,255,0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
  }

  function isOpen() { return _screen !== SCREEN.CLOSED; }

  console.log('[DinoMon] Menu v16 loaded.');

  return { open, close, update, draw, isOpen, showChoiceMenu, showShop };
})();

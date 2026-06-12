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

  function _drawMap(ctx) {
    const W = DG.CANVAS.W, H = DG.CANVAS.H;
    const TITLE_H = 24;   // title bar height
    const MAP_Y   = TITLE_H; // map area starts here
    const MAP_H   = H - TITLE_H;

    // ── helpers ──────────────────────────────────────────────
    function shadow(fn) {
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.85)';
      ctx.shadowBlur  = 3;
      ctx.shadowOffsetX = 1; ctx.shadowOffsetY = 1;
      fn();
      ctx.restore();
    }

    function drawTree(x, y, col) {
      ctx.fillStyle = col || '#2a7a2a';
      ctx.beginPath(); ctx.moveTo(x, y - 7); ctx.lineTo(x - 4, y + 1); ctx.lineTo(x + 4, y + 1); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(x, y - 10); ctx.lineTo(x - 3, y - 4); ctx.lineTo(x + 3, y - 4); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#5a3a1a';
      ctx.fillRect(x - 1, y + 1, 2, 3);
    }

    function drawMtn(x, y, col) {
      ctx.fillStyle = col || '#888888';
      ctx.beginPath(); ctx.moveTo(x, y - 9); ctx.lineTo(x - 7, y + 2); ctx.lineTo(x + 7, y + 2); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#ccddee';
      ctx.beginPath(); ctx.moveTo(x, y - 9); ctx.lineTo(x - 2, y - 5); ctx.lineTo(x + 2, y - 5); ctx.closePath(); ctx.fill();
    }

    function drawWave(x, y, col) {
      ctx.strokeStyle = col || '#4488ff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let i = 0; i < 3; i++) {
        const wx = x + i * 5;
        ctx.moveTo(wx, y); ctx.quadraticCurveTo(wx + 1.5, y - 2, wx + 2.5, y); ctx.quadraticCurveTo(wx + 3.5, y + 2, wx + 5, y);
      }
      ctx.stroke();
    }

    function drawBuilding(cx, cy, col, outline) {
      // 3-4 tiny rectangles of different heights
      const buildings = [[-6,0,4,8],[-2,0,4,11],[2,0,4,7],[6,0,4,9]];
      buildings.forEach(function(b) {
        ctx.fillStyle = col;
        ctx.fillRect(cx + b[0], cy - b[3], b[2], b[3]);
        ctx.strokeStyle = outline || 'rgba(0,0,0,0.5)';
        ctx.lineWidth = 0.5;
        ctx.strokeRect(cx + b[0], cy - b[3], b[2], b[3]);
        // tiny window
        ctx.fillStyle = 'rgba(255,255,180,0.7)';
        ctx.fillRect(cx + b[0] + 1, cy - b[3] + 2, 1, 1);
        ctx.fillRect(cx + b[0] + b[2] - 2, cy - b[3] + 2, 1, 1);
      });
    }

    function drawStar(cx, cy, r, col) {
      ctx.fillStyle = col || '#FFE050';
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const angle = (Math.PI / 5) * i - Math.PI / 2;
        const rad   = i % 2 === 0 ? r : r * 0.45;
        const px    = cx + rad * Math.cos(angle);
        const py    = cy + rad * Math.sin(angle);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth   = 0.8;
      ctx.stroke();
    }

    function drawTunnel(x, y) {
      ctx.strokeStyle = '#333333';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(x,     y, 4, Math.PI, 0); ctx.stroke();
      ctx.beginPath(); ctx.arc(x + 9, y, 4, Math.PI, 0); ctx.stroke();
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(x - 4, y, 18, 3);
    }

    // ── Ocean background ─────────────────────────────────────
    const oceanGrad = ctx.createLinearGradient(0, MAP_Y, 0, H);
    oceanGrad.addColorStop(0, '#0a2a5e');
    oceanGrad.addColorStop(1, '#1a4a8e');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, MAP_Y, W, MAP_H);

    // Subtle ocean waves pattern
    ctx.strokeStyle = 'rgba(100,160,255,0.12)';
    ctx.lineWidth = 1;
    for (let wy = MAP_Y + 8; wy < H - 8; wy += 10) {
      for (let wx = 0; wx < W; wx += 30) {
        ctx.beginPath();
        ctx.moveTo(wx, wy);
        ctx.quadraticCurveTo(wx + 7, wy - 3, wx + 15, wy);
        ctx.quadraticCurveTo(wx + 22, wy + 3, wx + 30, wy);
        ctx.stroke();
      }
    }

    // ── Continent / island landmass ───────────────────────────
    // Main landmass outline using bezier curves — occupies the left-centre
    ctx.save();
    ctx.beginPath();
    // Start bottom-left coast (near Ambertown) and wind around
    ctx.moveTo(55, H - 12);       // south coast start
    ctx.bezierCurveTo(80, H - 8, 110, H - 14, 140, H - 22);  // south coast east
    ctx.bezierCurveTo(180, H - 30, 230, H - 50, 290, H - 70); // curving east south
    ctx.bezierCurveTo(340, H - 90, 390, H - 100, 440, H - 80); // far east coast
    ctx.bezierCurveTo(462, H - 70, 472, MAP_Y + 60, 450, MAP_Y + 40); // ne tip
    ctx.bezierCurveTo(430, MAP_Y + 24, 410, MAP_Y + 20, 390, MAP_Y + 22); // volcano area
    ctx.bezierCurveTo(360, MAP_Y + 20, 330, MAP_Y + 18, 300, MAP_Y + 20); // citadel ridge
    ctx.bezierCurveTo(270, MAP_Y + 20, 250, MAP_Y + 24, 240, MAP_Y + 26); // apex area
    ctx.bezierCurveTo(210, MAP_Y + 28, 170, MAP_Y + 30, 145, MAP_Y + 40); // crestfall ridge
    ctx.bezierCurveTo(120, MAP_Y + 44, 95, MAP_Y + 48, 70, MAP_Y + 44);  // stonehaven area
    ctx.bezierCurveTo(42, MAP_Y + 46, 28, MAP_Y + 60, 22, MAP_Y + 80);   // nw coast
    ctx.bezierCurveTo(16, MAP_Y + 110, 20, MAP_Y + 150, 22, MAP_Y + 190); // west coast pyreside
    ctx.bezierCurveTo(22, MAP_Y + 210, 20, MAP_Y + 230, 22, MAP_Y + 250); // west coast dustwall
    ctx.bezierCurveTo(24, MAP_Y + 265, 30, MAP_Y + 270, 40, MAP_Y + 272); // shellcreek
    ctx.bezierCurveTo(48, MAP_Y + 278, 52, H - 14, 55, H - 12);           // ambertown south
    ctx.closePath();

    // Base land fill — base green
    ctx.fillStyle = '#4a9a4a';
    ctx.fill();

    // Biome overlays — painted in order (back-to-front by region)
    ctx.restore();

    // Swamp region — Bogmire (right side, mid-upper)
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(310, MAP_Y + 50);
    ctx.bezierCurveTo(340, MAP_Y + 40, 390, MAP_Y + 45, 420, MAP_Y + 55);
    ctx.bezierCurveTo(445, MAP_Y + 65, 455, MAP_Y + 85, 440, MAP_Y + 110);
    ctx.bezierCurveTo(420, MAP_Y + 140, 370, MAP_Y + 150, 320, MAP_Y + 130);
    ctx.bezierCurveTo(295, MAP_Y + 115, 295, MAP_Y + 75, 310, MAP_Y + 50);
    ctx.closePath();
    ctx.fillStyle = 'rgba(58,90,42,0.82)';
    ctx.fill();
    ctx.restore();

    // Forest region — Ferngrove (centre-right)
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(175, MAP_Y + 90);
    ctx.bezierCurveTo(210, MAP_Y + 80, 270, MAP_Y + 85, 300, MAP_Y + 100);
    ctx.bezierCurveTo(325, MAP_Y + 118, 315, MAP_Y + 155, 280, MAP_Y + 165);
    ctx.bezierCurveTo(245, MAP_Y + 175, 195, MAP_Y + 165, 170, MAP_Y + 145);
    ctx.bezierCurveTo(148, MAP_Y + 125, 152, MAP_Y + 104, 175, MAP_Y + 90);
    ctx.closePath();
    ctx.fillStyle = 'rgba(42,122,42,0.80)';
    ctx.fill();
    ctx.restore();

    // Sandy/rocky region — Dustwall (left mid)
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(20, MAP_Y + 148);
    ctx.bezierCurveTo(45, MAP_Y + 140, 95, MAP_Y + 142, 130, MAP_Y + 148);
    ctx.bezierCurveTo(155, MAP_Y + 154, 155, MAP_Y + 188, 128, MAP_Y + 200);
    ctx.bezierCurveTo(95, MAP_Y + 212, 45, MAP_Y + 210, 22, MAP_Y + 200);
    ctx.bezierCurveTo(16, MAP_Y + 188, 16, MAP_Y + 162, 20, MAP_Y + 148);
    ctx.closePath();
    ctx.fillStyle = 'rgba(200,164,74,0.78)';
    ctx.fill();
    ctx.restore();

    // Volcanic region — Pyreside (left upper-mid)
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(20, MAP_Y + 84);
    ctx.bezierCurveTo(40, MAP_Y + 75, 90, MAP_Y + 80, 115, MAP_Y + 90);
    ctx.bezierCurveTo(138, MAP_Y + 100, 140, MAP_Y + 130, 118, MAP_Y + 142);
    ctx.bezierCurveTo(88, MAP_Y + 152, 40, MAP_Y + 148, 22, MAP_Y + 140);
    ctx.bezierCurveTo(16, MAP_Y + 125, 16, MAP_Y + 98, 20, MAP_Y + 84);
    ctx.closePath();
    ctx.fillStyle = 'rgba(180,60,16,0.72)';
    ctx.fill();
    ctx.restore();

    // Mountain region — Stonehaven (top-left)
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(26, MAP_Y + 42);
    ctx.bezierCurveTo(50, MAP_Y + 36, 100, MAP_Y + 38, 128, MAP_Y + 46);
    ctx.bezierCurveTo(148, MAP_Y + 54, 150, MAP_Y + 80, 126, MAP_Y + 88);
    ctx.bezierCurveTo(95, MAP_Y + 96, 44, MAP_Y + 90, 24, MAP_Y + 80);
    ctx.bezierCurveTo(16, MAP_Y + 68, 16, MAP_Y + 54, 26, MAP_Y + 42);
    ctx.closePath();
    ctx.fillStyle = 'rgba(136,136,136,0.80)';
    ctx.fill();
    ctx.restore();

    // Ice peak — Apex Summit
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(230, MAP_Y + 24);
    ctx.bezierCurveTo(248, MAP_Y + 16, 278, MAP_Y + 18, 290, MAP_Y + 26);
    ctx.bezierCurveTo(296, MAP_Y + 32, 288, MAP_Y + 48, 268, MAP_Y + 50);
    ctx.bezierCurveTo(248, MAP_Y + 52, 228, MAP_Y + 44, 228, MAP_Y + 34);
    ctx.bezierCurveTo(226, MAP_Y + 28, 228, MAP_Y + 26, 230, MAP_Y + 24);
    ctx.closePath();
    ctx.fillStyle = 'rgba(170,204,238,0.88)';
    ctx.fill();
    ctx.restore();

    // Volcano peak — Mt Cretaceous
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(378, MAP_Y + 22);
    ctx.bezierCurveTo(392, MAP_Y + 14, 415, MAP_Y + 16, 424, MAP_Y + 26);
    ctx.bezierCurveTo(430, MAP_Y + 34, 422, MAP_Y + 50, 406, MAP_Y + 52);
    ctx.bezierCurveTo(388, MAP_Y + 54, 372, MAP_Y + 42, 374, MAP_Y + 30);
    ctx.closePath();
    ctx.fillStyle = 'rgba(180,30,0,0.85)';
    ctx.fill();
    ctx.restore();

    // Volcano smoke
    ctx.save();
    ctx.globalAlpha = 0.35;
    for (let si = 0; si < 4; si++) {
      const sr = 3 + si * 2;
      ctx.beginPath();
      ctx.arc(400 + si * 2, MAP_Y + 10 - si * 4, sr, 0, Math.PI * 2);
      ctx.fillStyle = '#aaaaaa';
      ctx.fill();
    }
    ctx.restore();

    // ── Terrain decoration icons ──────────────────────────────
    // Forest trees — Ferngrove cluster
    const fTrees = [[205,MAP_Y+110],[215,MAP_Y+122],[225,MAP_Y+108],[240,MAP_Y+118],[255,MAP_Y+108],[265,MAP_Y+122],[275,MAP_Y+112],[210,MAP_Y+135],[240,MAP_Y+140],[260,MAP_Y+135]];
    fTrees.forEach(function(t){ drawTree(t[0], t[1], '#2a7a2a'); });

    // Light forest — coastal south
    [[55,MAP_Y+220],[65,MAP_Y+235],[80,MAP_Y+228],[95,MAP_Y+245],[70,MAP_Y+250]].forEach(function(t){ drawTree(t[0], t[1], '#3a8a3a'); });

    // Mountain icons — Stonehaven area
    [[55,MAP_Y+70],[72,MAP_Y+65],[88,MAP_Y+70]].forEach(function(t){ drawMtn(t[0], t[1], '#777777'); });
    // Mountain icons — Crestfall ridge
    [[165,MAP_Y+48],[180,MAP_Y+42],[195,MAP_Y+48]].forEach(function(t){ drawMtn(t[0], t[1], '#887766'); });

    // Swamp icons — Bogmire
    [[340,MAP_Y+80],[355,MAP_Y+68],[368,MAP_Y+82],[345,MAP_Y+96]].forEach(function(t){ drawTree(t[0], t[1], '#2a4a1a'); });

    // Ocean waves near coasts
    [[15, MAP_Y+170],[15,MAP_Y+230]].forEach(function(w){ drawWave(w[0], w[1], '#4488ff'); });
    [[460, MAP_Y+120],[462,MAP_Y+140]].forEach(function(w){ drawWave(w[0], w[1], '#4488ff'); });

    // ── Routes ────────────────────────────────────────────────
    ctx.save();
    ctx.setLineDash([4, 3]);
    ctx.lineWidth = 2;

    // Helper: dashed path between two points
    function route(x1, y1, x2, y2, color) {
      ctx.strokeStyle = color || '#d4b86a';
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    }

    // AMBERTOWN → SHELLCREEK (y:289 → y:242) left-side vertical
    route(90, MAP_Y+265, 90, MAP_Y+218, '#d4b86a');
    // SHELLCREEK → DUSTWALL (y:242 → y:196)
    route(90, MAP_Y+218, 90, MAP_Y+172, '#d4b86a');
    // DUSTWALL → PYRESIDE (y:196 → y:150)
    route(90, MAP_Y+172, 90, MAP_Y+126, '#c4a050');
    // PYRESIDE → FERNGROVE (horizontal, through forest)
    route(90, MAP_Y+126, 210, MAP_Y+126, '#d4b86a');
    // PYRESIDE → STONEHAVEN (vertical up left)
    route(90, MAP_Y+126, 90, MAP_Y+80, '#aaaaaa');
    // STONEHAVEN → CRESTFALL (diagonal)
    route(90, MAP_Y+80, 190, MAP_Y+58, '#aaaaaa');
    // STONEHAVEN → BOGMIRE (long horizontal)
    route(90, MAP_Y+80, 330, MAP_Y+72, '#3a5a2a');
    // CRESTFALL → APEXSUMMIT (diagonal ice)
    route(190, MAP_Y+58, 260, MAP_Y+38, '#aaccee');
    // BOGMIRE → APEXSUMMIT (diagonal)
    route(330, MAP_Y+72, 260, MAP_Y+38, '#aaaaaa');
    // APEXSUMMIT → MT_CRETACEOUS (short horizontal volcano)
    route(260, MAP_Y+38, 400, MAP_Y+38, '#cc4400');

    ctx.restore();

    // Fossil Citadel route — dashed with ? unless badge 8 earned
    const flags    = _gs && _gs.player && _gs.player.flags ? _gs.player.flags : {};
    const hasAll8  = _gs && _gs.player && _gs.player.badges && _gs.player.badges.length >= 8;
    const citadelUnlocked = hasAll8 || flags['BADGE_8'] || flags['FOSSIL_CITADEL_OPEN'];
    ctx.save();
    ctx.lineWidth = 2;
    if (citadelUnlocked) {
      ctx.setLineDash([4, 3]);
      ctx.strokeStyle = '#FFD700';
    } else {
      ctx.setLineDash([3, 5]);
      ctx.strokeStyle = '#445566';
    }
    ctx.beginPath();
    ctx.moveTo(260, MAP_Y+38);
    ctx.lineTo(310, MAP_Y+30);
    ctx.stroke();
    ctx.restore();

    // ── Water route (SHELLCREEK coastal) ─────────────────────
    ctx.save();
    ctx.setLineDash([2, 4]);
    ctx.strokeStyle = '#4488ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(70, MAP_Y+218);
    ctx.quadraticCurveTo(40, MAP_Y+218, 30, MAP_Y+218);
    ctx.stroke();
    ctx.restore();

    // Small tunnel icon at halfway on Dustwall→Pyreside route
    drawTunnel(82, MAP_Y + 152);

    // ── Node definitions ─────────────────────────────────────
    // [id, label, mapX, mapY, biomeColor, buildingColor, labelRight]
    const nodes = [
      ['AMBERTOWN',        'Ambertown',     90,  MAP_Y+265, '#4a9a4a',  '#5aaa5a', true ],
      ['SHELLCREEK_CITY',  'Shellcreek',    90,  MAP_Y+218, '#5599ff',  '#6699dd', true ],
      ['DUSTWALL_TOWN',    'Dustwall',      90,  MAP_Y+172, '#c8a44a',  '#d4b85a', true ],
      ['PYRESIDE_CITY',    'Pyreside',      90,  MAP_Y+126, '#cc4411',  '#dd5522', true ],
      ['FERNGROVE_TOWN',   'Ferngrove',    210,  MAP_Y+126, '#2a7a2a',  '#3a8a3a', true ],
      ['STONEHAVEN_CITY',  'Stonehaven',   90,  MAP_Y+80,  '#888888',  '#999999', true ],
      ['CRESTFALL_TOWN',   'Crestfall',   190,  MAP_Y+58,  '#aa6644',  '#bb7755', false],
      ['BOGMIRE_CITY',     'Bogmire',     330,  MAP_Y+72,  '#3a5a2a',  '#4a6a3a', false],
      ['APEXSUMMIT',       'Apex Summit', 260,  MAP_Y+38,  '#aaccee',  '#bbddff', false],
      ['MT_CRETACEOUS',    'Mt Cretac.',  400,  MAP_Y+38,  '#cc2200',  '#dd3311', false],
      ['FOSSIL_CITADEL',   'Fossil Cit.', 310,  MAP_Y+30,  '#FFD700',  '#EEC900', false],
    ];

    const curMap = _gs && _gs.player ? (_gs.player.currentMap || '') : '';
    const visitedFlags = (_gs && _gs.player && _gs.player.flags) ? _gs.player.flags : {};

    function isHere(id) {
      return curMap === id || curMap.startsWith(id);
    }

    function isVisited(id) {
      // Current location counts as visited
      if (isHere(id)) return true;
      // Check VISITED_ flag set on map entry
      if (visitedFlags['VISITED_' + id]) return true;
      // Also treat sub-maps (e.g. SHELLCREEK_CITY_GYM) as visited if main map visited
      for (const k of Object.keys(visitedFlags)) {
        if (visitedFlags[k] && k.startsWith('VISITED_' + id)) return true;
      }
      return false;
    }

    // Draw each node
    for (let ni = 0; ni < nodes.length; ni++) {
      const nd = nodes[ni];
      const id = nd[0], label = nd[1], px = nd[2], py = nd[3];
      const biomeCol = nd[4], buildCol = nd[5], lblRight = nd[6];
      const here = isHere(id);
      const visited = isVisited(id);

      // Skip Fossil Citadel rendering if locked
      if (id === 'FOSSIL_CITADEL' && !citadelUnlocked) {
        // Draw locked ? marker instead
        ctx.save();
        ctx.globalAlpha = 0.55;
        ctx.fillStyle = '#aaaaaa';
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('?', px, py);
        ctx.restore();
        continue;
      }

      // Unvisited nodes are drawn very dark/faded
      if (!visited && !here) {
        ctx.save();
        ctx.globalAlpha = 0.30;
        drawBuilding(px, py, '#334455', null);
        ctx.globalAlpha = 0.25;
        ctx.fillStyle = '#334455';
        ctx.font = '8px monospace';
        ctx.textBaseline = 'middle';
        if (lblRight) {
          ctx.textAlign = 'left';
          ctx.fillText(label, px + 13, py - 4);
        } else {
          ctx.textAlign = 'right';
          ctx.fillText(label, px - 13, py - 4);
        }
        ctx.restore();
        continue;
      }

      if (here) {
        // Pulsing glow ring
        ctx.save();
        const glowGrad = ctx.createRadialGradient(px, py, 4, px, py, 16);
        glowGrad.addColorStop(0,   'rgba(255,220,0,0.55)');
        glowGrad.addColorStop(1,   'rgba(255,220,0,0)');
        ctx.fillStyle = glowGrad;
        ctx.beginPath(); ctx.arc(px, py, 16, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }

      // Building cluster icon — visited but not current uses light-blue tint
      const nodeBuildCol = here ? '#FFE878' : '#88aacc';
      const nodeBuildOutline = here ? '#ffffff' : null;
      shadow(function(){
        drawBuilding(px, py, nodeBuildCol, nodeBuildOutline);
      });

      // Star for current location, on top of building
      if (here) {
        shadow(function(){ drawStar(px, py - 14, 5, '#FFE050'); });
      }

      // Label
      shadow(function(){
        ctx.fillStyle = here ? '#FFE050' : (id === 'FOSSIL_CITADEL' ? '#FFD700' : '#88aacc');
        ctx.font = here ? 'bold 9px monospace' : '9px monospace';
        ctx.textBaseline = 'middle';
        if (lblRight) {
          ctx.textAlign = 'left';
          ctx.fillText(label, px + 13, py - 4);
        } else {
          ctx.textAlign = 'right';
          ctx.fillText(label, px - 13, py - 4);
        }
      });
    }

    // ── Title bar ─────────────────────────────────────────────
    const titleGrad = ctx.createLinearGradient(0, 0, 0, TITLE_H);
    titleGrad.addColorStop(0, 'rgba(8,16,48,0.97)');
    titleGrad.addColorStop(1, 'rgba(10,22,58,0.95)');
    ctx.fillStyle = titleGrad;
    ctx.fillRect(0, 0, W, TITLE_H);
    ctx.strokeStyle = '#3a6a9a';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, W, TITLE_H);

    shadow(function(){
      ctx.font = 'bold 12px monospace';
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'left';
      ctx.fillStyle = '#8ed8f8';
      ctx.fillText('WORLD MAP', 10, TITLE_H / 2);
      ctx.fillStyle = '#6699bb';
      ctx.font = '10px monospace';
      ctx.fillText('Pangaea Archipelago', 98, TITLE_H / 2);
    });

    // Current location label in title
    if (curMap) {
      const curNode = nodes.find(function(n){ return isHere(n[0]); });
      if (curNode) {
        shadow(function(){
          ctx.fillStyle = '#FFE050';
          ctx.font = 'bold 9px monospace';
          ctx.textAlign = 'right';
          ctx.textBaseline = 'middle';
          ctx.fillText('★ ' + curNode[1], W - 8, TITLE_H / 2);
        });
      }
    }

    // ── Legend box (bottom-right) ─────────────────────────────
    const LX = W - 92, LY = H - 68, LW = 88, LH = 62;
    ctx.save();
    ctx.fillStyle = 'rgba(6,14,40,0.88)';
    ctx.strokeStyle = '#3a6a9a';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(LX, LY, LW, LH, 3) : ctx.rect(LX, LY, LW, LH);
    ctx.fill(); ctx.stroke();
    ctx.restore();

    ctx.font = 'bold 8px monospace';
    ctx.fillStyle = '#8ed8f8';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('LEGEND', LX + 4, LY + 3);

    const legendItems = [
      { draw: function(x,y){ drawBuilding(x+6,y+7,'#9999bb'); }, label: 'City/Town' },
      { draw: function(x,y){ drawMtn(x+6,y+6,'#888888'); },      label: 'Mountains' },
      { draw: function(x,y){ drawTree(x+6,y+7,'#2a7a2a'); },     label: 'Forest' },
      { draw: function(x,y){ drawWave(x,y+6,'#4488ff'); },        label: 'Water route' },
    ];
    legendItems.forEach(function(item, i) {
      const iy = LY + 14 + i * 12;
      item.draw(LX + 4, iy);
      ctx.fillStyle = '#aabbcc';
      ctx.font = '8px monospace';
      ctx.textBaseline = 'top';
      ctx.fillText(item.label, LX + 20, iy + 1);
    });

    // ── Nav hint ──────────────────────────────────────────────
    ctx.fillStyle = 'rgba(6,14,40,0.78)';
    ctx.fillRect(4, H - 14, 90, 12);
    ctx.fillStyle = '#556688';
    ctx.font = '9px monospace';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    ctx.fillText('[B/ESC] Close', 8, H - 13);
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
    ctx.fillText(`${earnedN} / 8 earned`, W - 10, 10);
    ctx.textAlign = 'left';

    const ALL_BADGES = [
      { name:'Herd Badge',    gym:'Rex · Shellcreek',     type:'NORMAL',   col:'#aaaaaa' },
      { name:'Fossil Badge',  gym:'Ridley · Dustwall',    type:'ROCK',     col:'#aa8833' },
      { name:'Magma Badge',   gym:'Ignis · Pyreside',     type:'FIRE',     col:'#ff4411' },
      { name:'Canopy Badge',  gym:'Sylva · Ferngrove',    type:'GRASS',    col:'#33aa33' },
      { name:'Bedrock Badge', gym:'Terra · Stonehaven',   type:'GROUND',   col:'#cc8833' },
      { name:'Static Badge',  gym:'Volt · Crestfall',     type:'ELECTRIC', col:'#ffcc00' },
      { name:'Tide Badge',    gym:'Marina · Bogmire',     type:'WATER',    col:'#3377ff' },
      { name:'Scale Badge',   gym:'Valdez · Apex Summit', type:'DRAGON',   col:'#6644cc' },
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
    const boxW = 290, boxH = OPTIONS_LIST.length * 28 + 46;
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

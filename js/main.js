// DinoMon: Fossil Frontier — main.js v22
// Game loop, state machine, wires all modules together

window.DG = window.DG || {};

(function () {

  // ── Game state (top-level) ─────────────────────────────────
  let _state = DG.STATE.TITLE;
  let _gs    = null;       // loaded/created game state object
  let _lastTime = 0;
  let _playtimeAccum = 0;

  // Slot selection state (global so renderer can access)
  window._SLOT_CURSOR   = 0;     // which slot is highlighted (0-2)
  window._SLOT_LIST     = [];    // cached slot metadata from listSlots()

  // Name entry buffer (global so renderer can access)
  window._GAME_NAME_BUFFER = '';

  // Rival name entry buffer (global so renderer can access)
  window._RIVAL_NAME_BUFFER = '';

  // Slot delete confirmation (null = not confirming, N = confirming slot N)
  window._SLOT_DELETE_CONFIRM = null;

  // Nickname entry buffer (global so renderer can access)
  window._NICKNAME_BUFFER = '';
  window._NICKNAME_MON    = null;

  // Knockout fade (global so renderer can access)
  window._KNOCKOUT_FADE = 0; // 0-60 frames, drawn as black overlay

  // Persists LOSE result across fade frames (getLastResult() clears after first read)
  let _pendingBlackout = false;

  // ── Canvas setup ──────────────────────────────────────────
  let _canvas = null;

  function _getCanvas() {
    if (!_canvas) _canvas = document.getElementById('game-canvas');
    return _canvas;
  }

  function resizeCanvas() {
    const canvas = _getCanvas();
    if (!canvas) return;
    const W = DG.CANVAS.W, H = DG.CANVAS.H;
    const scale = Math.min(window.innerWidth / W, window.innerHeight / H);
    canvas.style.width  = Math.floor(W * scale) + 'px';
    canvas.style.height = Math.floor(H * scale) + 'px';
  }
  window.addEventListener('resize', resizeCanvas);

  // ── Boot sequence ─────────────────────────────────────────
  function boot() {
    const canvas = _getCanvas();
    if (!canvas) { console.error('[Main] Canvas not found!'); return; }
    resizeCanvas();
    DG.Input.init(canvas);
    DG.Renderer.init(canvas, null);

    // Always start at TITLE — slot selection follows from there
    _state = DG.STATE.TITLE;
    try { DG.Audio.playMusic('TITLE'); } catch(e) {}
    requestAnimationFrame(_loop);
  }

  // ── Main game loop ─────────────────────────────────────────
  function _loop(timestamp) {
    // Always reschedule first — ensures loop survives any error
    requestAnimationFrame(_loop);

    const dt = Math.min(50, timestamp - _lastTime); // cap delta at 50ms
    _lastTime = timestamp;

    try {
      _update(dt);
    } catch(e) {
      console.error('[Main] _update error:', e);
    }

    try {
      DG.Renderer.draw(_gs, _state);
    } catch(e) {
      console.error('[Main] Renderer.draw error:', e);
    }

    DG.Input.flush(); // clear pressed/released at end of frame
  }

  // ── Update dispatcher ─────────────────────────────────────
  function _update(dt) {
    switch (_state) {
      case DG.STATE.TITLE:          _updateTitle(dt);       break;
      case DG.STATE.SLOT_SELECT:    _updateSlotSelect(dt);  break;
      case DG.STATE.NAME_ENTRY:          _updateNameEntry(dt);        break;
      case DG.STATE.RIVAL_NAME_ENTRY:    _updateRivalNameEntry(dt);   break;
      case DG.STATE.DIFFICULTY_SELECT:   _updateDifficultySelect(dt); break;
      case DG.STATE.NICKNAME_ENTRY: _updateNicknameEntry(dt); break;
      case DG.STATE.OVERWORLD:      _updateOverworld(dt);   break;
      case DG.STATE.BATTLE:         _updateBattle(dt);      break;
      case DG.STATE.MENU:           _updateMenu(dt);        break;
      case DG.STATE.BOX_UI:         _updateBoxUI(dt);       break;
      case DG.STATE.CUTSCENE:  /* handled by DialogueBox */ break;
    }

    // Update dialogue box always
    DG.DialogueBox.update(dt, _gs ? _gs.settings : null);

    // Advance battle animations
    if (typeof DG.BattleAnim !== 'undefined') DG.BattleAnim.update();

    // Playtime counter (only in overworld)
    if (_state === DG.STATE.OVERWORLD && _gs) {
      _playtimeAccum += dt;
      if (_playtimeAccum >= 1000) {
        _gs.player.playtime = (_gs.player.playtime || 0) + 1;
        _playtimeAccum -= 1000;
      }
    }
  }

  // ── TITLE ─────────────────────────────────────────────────
  function _updateTitle(dt) {
    if (DG.Input.isPressed('A') || DG.Input.isPressed('START')) {
      try { DG.Audio.init(); DG.Audio.playSfx('SELECT'); } catch(e) {}
      // Always go to slot selection — even if no saves exist (shows 3 empty slots)
      window._SLOT_LIST   = DG.SaveLoad.listSlots();
      window._SLOT_CURSOR = 0;
      _state = DG.STATE.SLOT_SELECT;
    }
  }

  // ── SLOT SELECT ───────────────────────────────────────────
  function _updateSlotSelect(dt) {
    const slots = window._SLOT_LIST || [];
    const numSlots = slots.length;

    // ── Delete confirmation mode ───────────────────────────
    if (window._SLOT_DELETE_CONFIRM !== null) {
      if (DG.Input.isPressed('A')) {
        const delIdx = window._SLOT_DELETE_CONFIRM;
        try { DG.SaveLoad.deleteSlot(delIdx); } catch(e) {}
        window._SLOT_LIST = DG.SaveLoad.listSlots();
        window._SLOT_DELETE_CONFIRM = null;
        try { DG.Audio.playSfx('CANCEL'); } catch(e) {}
      } else if (DG.Input.isPressed('B') || DG.Input.isPressed('START')) {
        window._SLOT_DELETE_CONFIRM = null;
        try { DG.Audio.playSfx('CANCEL'); } catch(e) {}
      }
      return; // block all other input while confirming
    }

    if (DG.Input.isPressed('UP')) {
      window._SLOT_CURSOR = (window._SLOT_CURSOR - 1 + numSlots) % numSlots;
      try { DG.Audio.playSfx('CURSOR'); } catch(e) {}
    }
    if (DG.Input.isPressed('DOWN')) {
      window._SLOT_CURSOR = (window._SLOT_CURSOR + 1) % numSlots;
      try { DG.Audio.playSfx('CURSOR'); } catch(e) {}
    }

    // SELECT / Q / Tab on a filled slot → ask for delete confirmation
    if (DG.Input.isPressed('SELECT')) {
      const slot = slots[window._SLOT_CURSOR];
      if (slot && !slot.empty) {
        window._SLOT_DELETE_CONFIRM = window._SLOT_CURSOR;
        try { DG.Audio.playSfx('CURSOR'); } catch(e) {}
      }
      return;
    }

    if (DG.Input.isPressed('B')) {
      // Back to title
      _state = DG.STATE.TITLE;
      try { DG.Audio.playSfx('CANCEL'); } catch(e) {}
      return;
    }

    if (DG.Input.isPressed('A') || DG.Input.isPressed('START')) {
      const slot = slots[window._SLOT_CURSOR];
      try { DG.Audio.playSfx('SELECT'); } catch(e) {}

      if (!slot || slot.empty) {
        // Start new game in this slot
        DG.SaveLoad.setActiveSlot(window._SLOT_CURSOR);
        window._GAME_NAME_BUFFER = '';
        _state = DG.STATE.NAME_ENTRY;
      } else {
        // Load existing save from this slot
        DG.SaveLoad.setActiveSlot(slot.id);
        let saved = null;
        try { saved = DG.SaveLoad.loadSlot(slot.id); } catch(e) {
          console.error('[Main] loadSlot threw:', e);
        }
        if (saved) {
          _gs = saved;
          try { _startGame(); } catch(e) {
            console.error('[Main] _startGame failed:', e);
            // Don't delete the save on startup failure — show error instead
            try { DG.DialogueBox.show(`Save load error: ${e.message || e}. Try Ctrl+F5 to hard-refresh.`, null, null); } catch(_) {}
            window._SLOT_LIST = DG.SaveLoad.listSlots();
          }
        } else {
          const errDetail = (DG.SaveLoad.getLastLoadError && DG.SaveLoad.getLastLoadError()) || '(no detail)';
          console.warn('[Main] loadSlot returned null for slot', slot.id, '|', errDetail);
          try { DG.DialogueBox.show('Load failed: ' + errDetail, null); } catch(_) {}
        }
      }
    }
  }

  // ── DIFFICULTY SELECT ─────────────────────────────────────
  window._DIFFICULTY_CURSOR = 0; // 0=Normal, 1=Hard
  const _DIFFICULTIES = ['NORMAL', 'HARD'];

  function _updateDifficultySelect(dt) {
    if (DG.Input.isPressed('UP') || DG.Input.isPressed('LEFT'))  {
      window._DIFFICULTY_CURSOR = Math.max(0, window._DIFFICULTY_CURSOR - 1);
      try { DG.Audio.playSfx('CURSOR'); } catch(e) {}
    }
    if (DG.Input.isPressed('DOWN') || DG.Input.isPressed('RIGHT')) {
      window._DIFFICULTY_CURSOR = Math.min(_DIFFICULTIES.length - 1, window._DIFFICULTY_CURSOR + 1);
      try { DG.Audio.playSfx('CURSOR'); } catch(e) {}
    }
    if (DG.Input.isPressed('A') || DG.Input.isPressed('START')) {
      window._CHOSEN_DIFFICULTY = _DIFFICULTIES[window._DIFFICULTY_CURSOR];
      try { DG.Audio.playSfx('SELECT'); } catch(e) {}
      const name = (window._GAME_NAME_BUFFER || '').trim() || 'Trainer';
      // FASE 7: de rivalnaam wordt niet meer vooraf gevraagd — de professor
      // vraagt hem in het verhaal (vlak voor de eerste rival-battle)
      _newGame(name, 'Flint');
    }
    if (DG.Input.isPressed('B')) {
      _state = DG.STATE.NAME_ENTRY;
    }
  }

  // ── NAME ENTRY ────────────────────────────────────────────
  function _updateNameEntry(dt) {
    // Keyboard input handled via _onKeyDown registered below
    if (DG.Input.isPressed('START')) {
      _state = DG.STATE.DIFFICULTY_SELECT;
      window._DIFFICULTY_CURSOR = 0;
    }
  }

  // ── RIVAL NAME ENTRY ──────────────────────────────────────
  // FASE 7: dit scherm verschijnt nu midden in het spel (de professor vraagt
  // de naam). Alle input loopt via de keydown-listener — GEEN DG.Input.isPressed
  // hier: 'b' en 'z' zijn ook gamepad-knoppen en zouden het scherm wegsturen
  // terwijl je een naam typt (de 'b'-bug).
  function _updateRivalNameEntry(dt) {}

  // FASE 7: door overworld.js aangeroepen op het professor-moment.
  // Opent het invoerscherm; cb(naam) wordt aangeroepen na bevestigen.
  window.DG_ASK_RIVAL_NAME = function(cb) {
    window._RIVAL_NAME_BUFFER = '';
    window._RIVAL_ASK_CB = cb || null;
    _state = DG.STATE.RIVAL_NAME_ENTRY;
  };

  function _finishRivalAsk(raw) {
    const name = (raw || '').trim().slice(0, 12) || 'Flint';
    if (_gs && _gs.player) _gs.player.rivalName = name;
    window._RIVAL_NAME = name;
    try { if (_gs) DG.SaveLoad.setFlag(_gs, 'RIVAL_NAMED'); } catch(e) {}
    _state = DG.STATE.OVERWORLD;
    const cb = window._RIVAL_ASK_CB;
    window._RIVAL_ASK_CB = null;
    if (cb) { try { cb(name); } catch(e) { console.error('[Main] rival-ask cb:', e); } }
  }

  document.addEventListener('keydown', function(e) {
    if (_state === DG.STATE.NAME_ENTRY) {
      const buf = window._GAME_NAME_BUFFER || '';
      if (e.key === 'Enter') {
        // FASE 7: rivalnaam-scherm overgeslagen — direct naar moeilijkheid
        _state = DG.STATE.DIFFICULTY_SELECT;
        window._DIFFICULTY_CURSOR = 0;
      } else if (e.key === 'Backspace') {
        window._GAME_NAME_BUFFER = buf.slice(0, -1);
      } else if (e.key.length === 1 && buf.length < 12) {
        window._GAME_NAME_BUFFER = buf + e.key;
      }
    } else if (_state === DG.STATE.RIVAL_NAME_ENTRY) {
      const buf = window._RIVAL_NAME_BUFFER || '';
      if (e.key === 'Enter') {
        _finishRivalAsk(buf);            // FASE 7: bevestig → verhaal gaat door
      } else if (e.key === 'Escape') {
        _finishRivalAsk('');             // FASE 7: overslaan → default 'Flint'
      } else if (e.key === 'Backspace') {
        window._RIVAL_NAME_BUFFER = buf.slice(0, -1);
      } else if (e.key.length === 1 && buf.length < 12) {
        window._RIVAL_NAME_BUFFER = buf + e.key;
      }
    } else if (_state === DG.STATE.NICKNAME_ENTRY) {
      const buf = window._NICKNAME_BUFFER || '';
      if (e.key === 'Enter') {
        _finishNickname(buf.trim() || null);
      } else if (e.key === 'Escape') {
        _finishNickname(null);
      } else if (e.key === 'Backspace') {
        window._NICKNAME_BUFFER = buf.slice(0, -1);
      } else if (e.key.length === 1 && buf.length < 12) {
        window._NICKNAME_BUFFER = buf + e.key;
      }
    }
  });

  // ── FASE 14: naam-invoer op mobiel ─────────────────────────
  // Tik op het scherm tijdens een invoerscherm → verborgen input krijgt
  // focus → virtueel toetsenbord opent; de waarde sync't naar de buffer.
  (function _setupMobileTextInput() {
    const field = document.getElementById('mobile-text-input');
    if (!field) return;
    const inEntry = () => _state === DG.STATE.NAME_ENTRY ||
                          _state === DG.STATE.RIVAL_NAME_ENTRY ||
                          _state === DG.STATE.NICKNAME_ENTRY;
    document.addEventListener('touchend', () => {
      if (!inEntry()) return;
      field.value = _state === DG.STATE.NAME_ENTRY ? (window._GAME_NAME_BUFFER || '')
                  : _state === DG.STATE.RIVAL_NAME_ENTRY ? (window._RIVAL_NAME_BUFFER || '')
                  : (window._NICKNAME_BUFFER || '');
      field.focus();
    });
    field.addEventListener('input', () => {
      const v = field.value.slice(0, 12);
      if (_state === DG.STATE.NAME_ENTRY) window._GAME_NAME_BUFFER = v;
      else if (_state === DG.STATE.RIVAL_NAME_ENTRY) window._RIVAL_NAME_BUFFER = v;
      else if (_state === DG.STATE.NICKNAME_ENTRY) window._NICKNAME_BUFFER = v;
    });
    field.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') field.blur(); // bevestiging loopt via de document-handler
    });
  })();

  function _newGame(name, rivalName) {
    _gs = DG.SaveLoad.createNewGame(name, rivalName);
    // Expose rival name globally for dialogue substitution
    window._RIVAL_NAME = (rivalName || 'Flint').trim() || 'Flint';
    // Store chosen difficulty
    const diff = window._CHOSEN_DIFFICULTY || 'NORMAL';
    _gs.settings = _gs.settings || {};
    _gs.settings.difficulty = diff;
    window._CURRENT_DIFFICULTY = diff;
    DG.SaveLoad.save(_gs); // saves to active slot
    _startGame();
  }

  // ── START GAME ────────────────────────────────────────────
  function _startGame() {
    // Validate save structure
    if (!_gs || !_gs.player || !_gs.player.flags) {
      throw new Error('Invalid save structure');
    }

    // Restore rival name from save (so loaded games also get substitution)
    window._RIVAL_NAME = (_gs.player.rivalName && _gs.player.rivalName.trim()) ? _gs.player.rivalName.trim() : 'Flint';

    // Restore difficulty from save
    window._CURRENT_DIFFICULTY = (_gs.settings && _gs.settings.difficulty) || 'NORMAL';

    // Repair any party DinoMons with broken HP/stats
    DG.SaveLoad.sanitizeParty(_gs);

    // Rescue player if save has them on a map that no longer exists
    if (!DG.MAPS || !DG.MAPS[_gs.player.currentMap]) {
      console.warn('[Main] Player currentMap not found — resetting to AMBERTOWN');
      _gs.player.currentMap = 'AMBERTOWN';
      _gs.player.x = 10; _gs.player.y = 12;
    }

    // Rescue player if save has them stuck inside a solid tile
    (function() {
      const mapData = DG.MAPS && DG.MAPS[_gs.player.currentMap];
      if (!mapData || !mapData.tiles) return;
      const px = _gs.player.x, py = _gs.player.y;
      const tile = (mapData.tiles[py] && mapData.tiles[py][px] !== undefined)
        ? mapData.tiles[py][px] : 64;
      const solid = tile >= 64 && tile !== 68; // 68 = DOOR (walkable)
      if (!solid) return;
      const dirs = [
        {dx:0,dy:1},{dx:0,dy:-1},{dx:1,dy:0},{dx:-1,dy:0},
        {dx:0,dy:2},{dx:0,dy:-2},{dx:2,dy:0},{dx:-2,dy:0},
        {dx:1,dy:1},{dx:-1,dy:1},{dx:1,dy:-1},{dx:-1,dy:-1},
      ];
      let rescued = false;
      for (const d of dirs) {
        const nx = px + d.dx, ny = py + d.dy;
        if (nx < 0 || ny < 0 || ny >= mapData.height || nx >= mapData.width) continue;
        const nt = (mapData.tiles[ny] && mapData.tiles[ny][nx] !== undefined)
          ? mapData.tiles[ny][nx] : 64;
        if (nt < 64 || nt === 68) {
          _gs.player.x = nx; _gs.player.y = ny;
          rescued = true; break;
        }
      }
      if (!rescued) {
        // Last resort: reset to AMBERTOWN default spawn
        _gs.player.currentMap = 'AMBERTOWN';
        _gs.player.x = 10; _gs.player.y = 12;
      }
      DG.SaveLoad.save(_gs);
      console.warn('[Main] Player position rescued from solid tile.');
    })();

    DG.Overworld.init(_gs);
    DG.Renderer.init(_getCanvas(), _gs);

    _state = DG.STATE.OVERWORLD;

    // Check if starter was chosen
    const STARTER_FLAG = (DG.STORY && DG.STORY.FLAGS && DG.STORY.FLAGS.STARTER_CHOSEN) || 'STARTER_CHOSEN';
    if (!DG.SaveLoad.getFlag(_gs, STARTER_FLAG)) {
      // New game: play lab music, show professor intro, then let player choose starter
      try { DG.Audio.playMusic('LAB_THEME'); } catch(e) {}
      DG.Events.professorIntro(_gs, function() {
        DG.Events.starterSelection(_gs, function() {
          DG.SaveLoad.save(_gs);
        });
      });
    } else {
      try { DG.Audio.playMusic(_getMapMusic()); } catch(e) {}
    }
    // NOTE: do NOT call requestAnimationFrame(_loop) here.
    // The loop is already running from boot() — adding another one
    // creates a second parallel loop that doubles update/render speed
    // and causes intermittent crashes when loading a saved game.
  }

  function _getMapMusic() {
    if (!_gs) return 'AMBERTOWN';
    const mapData = DG.MAPS[_gs.player.currentMap];
    return (mapData && mapData.music) ? mapData.music : 'AMBERTOWN';
  }

  // ── OVERWORLD ─────────────────────────────────────────────
  function _updateOverworld(dt) {
    if (DG.Battle.isActive()) {
      _state = DG.STATE.BATTLE;
      try { DG.Audio.playMusic('BATTLE_WILD'); } catch(e) {}
      DG.Renderer.resetBattleUI();
      return;
    }

    // Starter nickname: transition to NICKNAME_ENTRY before anything else
    if (window._PENDING_STARTER_NICK) {
      const mon = window._PENDING_STARTER_NICK;
      window._PENDING_STARTER_NICK = null;
      window._NICKNAME_MON    = mon;
      window._NICKNAME_BUFFER = '';
      window._NICKNAME_THEN_RIVAL = true;
      _state = DG.STATE.NICKNAME_ENTRY;
      return;
    }

    // After nickname finished, auto-trigger rival battle
    if (window._TRIGGER_STARTER_RIVAL) {
      window._TRIGGER_STARTER_RIVAL = false;
      if (typeof DG.Overworld.triggerStarterRival === 'function') {
        DG.Overworld.triggerStarterRival();
      }
      return;
    }

    // Always advance the overworld during active transitions so the fade
    // can complete even if a dialogue box is simultaneously visible
    // (e.g. an auto-event triggered right as the new map loads).
    if (DG.Overworld.isTransitioning()) {
      DG.Overworld.update(dt);
      return;
    }

    if (DG.DialogueBox.isVisible()) return;
    if (DG.Menu.isOpen()) {
      _state = DG.STATE.MENU;
      return;
    }

    // Check if PC Box was opened from NPC interaction
    if (DG.Overworld._pendingBoxUI && typeof DG.BoxUI !== 'undefined') {
      DG.Overworld._pendingBoxUI = false;
      _state = DG.STATE.BOX_UI;
      return;
    }

    DG.Overworld.update(dt);
  }

  // ── BOX UI ────────────────────────────────────────────────
  function _updateBoxUI(dt) {
    if (typeof DG.BoxUI === 'undefined') {
      _state = DG.STATE.OVERWORLD;
      return;
    }
    // BoxUI closes itself by calling onClose callback; detect that it's no longer open
    // by checking if internal _gs is still set (we poll via a helper flag)
    DG.BoxUI.update(dt);
    if (!DG.BoxUI.isOpen()) {
      _state = DG.STATE.OVERWORLD;
    }
  }

  // ── BATTLE ────────────────────────────────────────────────
  function _updateBattle(dt) {
    if (!DG.Battle.isActive()) {
      // Check if we just caught a mon — offer nickname entry
      const caughtMon = (typeof DG.Battle.getCaughtMon === 'function') ? DG.Battle.getCaughtMon() : null;
      if (caughtMon) {
        window._NICKNAME_MON    = caughtMon;
        window._NICKNAME_BUFFER = '';
        _state = DG.STATE.NICKNAME_ENTRY;
        try { DG.Audio.playMusic(_getMapMusic()); } catch(e) {}
        return;
      }
      // Black-out: if all DinoMons fainted, respawn at last DinoCenter.
      // getLastResult() clears the value after first read, so we latch it into _pendingBlackout
      // to persist it across the 60-frame fade.
      const lastResult = (typeof DG.Battle.getLastResult === 'function') ? DG.Battle.getLastResult() : null;
      if (lastResult === 'LOSE') _pendingBlackout = true;

      if (_pendingBlackout && _gs) {
        if (window._KNOCKOUT_FADE === 0) {
          // First frame: immediately reposition player and reinitialise overworld
          // (battle.js _tickBattleEnd already set currentMap/x/y via blackOut())
          _gs.player.facing = 'DOWN';
          try { DG.Overworld.init(_gs); } catch(e) { console.error('Overworld init failed:', e); }
          try { DG.Renderer.init(_getCanvas(), _gs); } catch(e) {}
        }
        // FASE 9: langere zwarte hold (150 frames) met gefaseerde tekst —
        // de renderer tekent "You have no DinoMons left..." / "You blacked out!"
        if (window._KNOCKOUT_FADE < 150) {
          window._KNOCKOUT_FADE++;
          return; // keep drawing fade overlay while still in BATTLE state
        }
        // Fade complete
        window._KNOCKOUT_FADE = 0;
        _pendingBlackout = false;
        _state = DG.STATE.OVERWORLD;
        try { DG.Audio.playMusic('CENTER_THEME'); } catch(e) {}
        DG.SaveLoad.save(_gs);
        // FASE 9: geldstraf expliciet melden
        const _wakeLines = [
          'All your DinoMons fainted!',
          'You woke up at the DinoCenter...',
        ];
        if (window._BLACKOUT_LOST > 0) {
          _wakeLines.push(`You dropped ${window._BLACKOUT_LOST} in your panic... (half your money)`);
        }
        _wakeLines.push('Your DinoMons have been fully healed!');
        window._BLACKOUT_LOST = 0;
        DG.DialogueBox.show(_wakeLines, () => {});
        return;
      }

      _state = DG.STATE.OVERWORLD;
      try { DG.Audio.playMusic(_getMapMusic()); } catch(e) {}
      DG.SaveLoad.save(_gs);
      return;
    }

    DG.Battle.update(dt);
    DG.Renderer.handleBattleInput();
  }

  // ── NICKNAME ENTRY ────────────────────────────────────────
  function _updateNicknameEntry(dt) {
    // All input is handled by the keydown listener (see document.addEventListener below).
    // Do NOT use DG.Input.isPressed() here — 'Z' is mapped to action 'A', so pressing
    // Shift+Z (for a capital letter) would instantly confirm and close the nickname screen.
  }

  function _finishNickname(name) {
    const mon = window._NICKNAME_MON;
    if (mon && name) mon.nickname = name;
    window._NICKNAME_MON    = null;
    window._NICKNAME_BUFFER = '';
    _state = DG.STATE.OVERWORLD;
    DG.SaveLoad.save(_gs);
    // If this nickname was for the starter, queue the rival battle
    if (window._NICKNAME_THEN_RIVAL) {
      window._NICKNAME_THEN_RIVAL = false;
      window._TRIGGER_STARTER_RIVAL = true;
    }
  }

  // ── MENU ──────────────────────────────────────────────────
  function _updateMenu(dt) {
    if (!DG.Menu.isOpen()) {
      _state = DG.STATE.OVERWORLD;
      return;
    }
    DG.Menu.update(dt);
  }

  // ── Expose BattleUI notification hook ────────────────────
  // Battle module calls DG.BattleUI.notify() for events
  DG.BattleUI = {
    notify: function(data) {
      if (!data) return;
      if (data.event === 'EVOLUTION') {
        // Full-screen Fossil Awakening animation
        if (typeof DG.EvoAnim !== 'undefined' && data.oldSpeciesId && data.mon) {
          DG.EvoAnim.start(data.oldSpeciesId, data.mon.speciesId, null);
        } else {
          try { DG.Audio.playEvolution(); } catch(e) {}
        }
      } else if (data.event === 'BATTLE_END') {
        // Handled in _updateBattle via isActive() check
      } else if (data.event === 'FORCE_SWITCH') {
        // Force player to pick another mon
        DG.Renderer.resetBattleUI();
      }
    }
  };

  // ── Touch controls (mobile) ──────────────────────────────
  function _bindTouchControls() {
    const ids = {
      'btn-up': 'UP', 'btn-down': 'DOWN', 'btn-left': 'LEFT', 'btn-right': 'RIGHT',
      'btn-a': 'A', 'btn-b': 'B', 'btn-start': 'START', 'btn-select': 'SELECT',
    };
    for (const [id, action] of Object.entries(ids)) {
      const el = document.getElementById(id);
      if (el) DG.Input.bindTouchButton(el, action);
    }
  }

  // ── Start ─────────────────────────────────────────────────
  // ── Debug helpers (call from browser console) ─────────────────
  // DG_BOOST_PARTY()  — evolves all party DinoMons to final form at Lv.80 with max IVs
  // DG_ALL_BADGES()   — grants all 8 badges and unlocks all route gates
  window.DG_BOOST_PARTY = function() {
    if (!_gs || !_gs.player || !_gs.player.party || !_gs.player.party.length) {
      console.warn('[DG_BOOST] No active game state. Load a save first.');
      return;
    }
    // Walk the evolution chain to find the final form
    function _finalEvo(speciesId) {
      let id = speciesId, depth = 0;
      while (depth++ < 10) {
        const sp = DG.SPECIES[id];
        if (!sp || !sp.evolvesTo) break;
        id = sp.evolvesTo;
      }
      return id;
    }
    const party = _gs.player.party;
    for (let i = 0; i < party.length; i++) {
      const mon = party[i];
      if (!mon) continue;
      const finalId = _finalEvo(mon.speciesId);
      const nick    = mon.nickname;
      const newMon  = DG.SaveLoad.createDinoMon(finalId, 80, nick);
      if (!newMon) continue;
      // Perfect 31 IVs in everything
      newMon.ivs = { hp:31, atk:31, def:31, spAtk:31, spDef:31, spd:31 };
      DG.SaveLoad.recalcStats(newMon);
      newMon.hp.current = newMon.hp.max;
      party[i] = newMon;
      console.log(`[DG_BOOST] ${mon.speciesId} → ${finalId} Lv.80 (31 IVs, full HP)`);
    }
    // Stock up the bag for testing
    Object.assign(_gs.player.bag, {
      POTION:99, SUPERBALL:50, ULTRABALL:50, AMBERBALL:20,
      MASTERBALL:3, FULLHEAL:50, MAXREVIVE:20, REVIVE:30,
      ANTIDOTE:20, BURNHEAL:20, PARALYHEAL:20, AWAKENING:20,
      REPEL:30, SUPER_REPEL:20,
    });
    _gs.player.money = 999999;
    DG.SaveLoad.save(_gs);
    try { DG.DialogueBox.show(['⚡ DEBUG: Party boosted to Lv.80!', 'Call DG_ALL_BADGES() to unlock all routes.'], ()=>{}); } catch(e) {}
    console.log('[DG_BOOST] Done! Call DG_ALL_BADGES() to also unlock all gates.');
  };

  // DG_GET_GS() — geeft de actieve game-state terug (voor debug/tests)
  window.DG_GET_GS = function() { return _gs; };

  window.DG_ALL_BADGES = function() {
    if (!_gs || !_gs.player) { console.warn('[DG_BOOST] No active game state.'); return; }
    const badges = ['BADGE_1','BADGE_2','BADGE_3','BADGE_4','BADGE_5','BADGE_6','BADGE_7','BADGE_8'];
    badges.forEach(b => {
      DG.SaveLoad.setFlag(_gs, b);
      if (!_gs.player.badges.includes(b)) _gs.player.badges.push(b);
    });
    _gs.player.badgeCount = 8;
    _gs.player.flags['SURF_UNLOCKED'] = true;
    _gs.player.flags['CUT_UNLOCKED']  = true;
    DG.SaveLoad.save(_gs);
    try { DG.DialogueBox.show(['⚡ DEBUG: All 8 badges granted!', 'All route gates are now open.'], ()=>{}); } catch(e) {}
    console.log('[DG_BOOST] All badges + field moves unlocked.');
  };

  // main.js is the last <script> in <body>, so the DOM is fully parsed here.
  // All prior script tags have already executed in order.
  _bindTouchControls();
  boot();

})();

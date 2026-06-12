// DinoMon: Fossil Frontier — engine/input.js
// Keyboard and touch input handler

window.DG = window.DG || {};

DG.Input = (function () {
  const _held = {};    // keys currently held down
  const _pressed = {}; // keys just pressed this frame
  const _released = {};// keys just released this frame

  // Map raw key values to action names
  function _actionFor(key) {
    for (const [action, keys] of Object.entries(DG.KEY)) {
      if (keys.includes(key)) return action;
    }
    return null;
  }

  function _onKeyDown(e) {
    const action = _actionFor(e.key);
    if (!action) return;
    // Prevent browser scrolling with arrow keys
    if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key)) {
      e.preventDefault();
    }
    if (!_held[action]) {
      _pressed[action] = true;
    }
    _held[action] = true;
  }

  function _onKeyUp(e) {
    const action = _actionFor(e.key);
    if (!action) return;
    _held[action] = false;
    _released[action] = true;
  }

  // ── Public API ────────────────────────────────────────────
  function isHeld(action) {
    return !!_held[action];
  }

  function isPressed(action) {
    return !!_pressed[action];
  }

  function isReleased(action) {
    return !!_released[action];
  }

  // Call once per frame AFTER all input has been processed
  function flush() {
    for (const k in _pressed)  delete _pressed[k];
    for (const k in _released) delete _released[k];
  }

  // ── Touch / virtual D-pad ────────────────────────────────
  const _touchActive = {};

  function bindTouchButton(element, action) {
    element.addEventListener('touchstart', (e) => {
      e.preventDefault();
      if (!_held[action]) _pressed[action] = true;
      _held[action] = true;
      _touchActive[element.dataset.action] = true;
    }, { passive: false });

    element.addEventListener('touchend', (e) => {
      e.preventDefault();
      _held[action] = false;
      _released[action] = true;
      delete _touchActive[element.dataset.action];
    }, { passive: false });
  }

  // FASE 14: gerepareerd — zocht op verkeerde class-selectors ('.btn-a' bestaat
  // niet; de knoppen hebben IDs) en werd bovendien nooit aangeroepen vanuit init()
  function setupTouchControls() {
    const map = {
      'btn-up':     'UP',
      'btn-down':   'DOWN',
      'btn-left':   'LEFT',
      'btn-right':  'RIGHT',
      'btn-a':      'A',
      'btn-b':      'B',
      'btn-start':  'START',
      'btn-select': 'SELECT',
    };
    for (const [id, action] of Object.entries(map)) {
      const el = document.getElementById(id);
      if (el) {
        el.dataset.action = action;
        bindTouchButton(el, action);
      }
    }
    // FASE 14: audio-unlock — mobiele browsers starten de AudioContext pas
    // na een echt touch-gebaar
    document.addEventListener('touchstart', function _unlock() {
      try { if (window.DG && DG.Audio) { DG.Audio.init(); DG.Audio.playSfx('SELECT'); } } catch(e) {}
      document.removeEventListener('touchstart', _unlock);
    }, { passive: true });
  }

  function init() {
    window.addEventListener('keydown', _onKeyDown);
    window.addEventListener('keyup',   _onKeyUp);
    setupTouchControls(); // FASE 14
    console.log('[DinoMon] Input initialized.');
  }

  return { init, isHeld, isPressed, isReleased, flush, bindTouchButton };
})();

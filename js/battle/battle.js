// DinoMon: Fossil Frontier — battle/battle.js
// Full battle state machine — v48

window.DG = window.DG || {};

DG.Battle = (function () {

  // ── HARDCODED GAME RULES ──────────────────────────────────────────────────
  // XP is split equally among all mons that were actually sent out this battle.
  // 1 participant = 100%, 2 participants = 50% each, 3 = 33% each, etc.
  // Bench mons that were never sent out receive nothing.

  // ── Battle State ──────────────────────────────────────────
  const BS = {
    IDLE:          'IDLE',
    INTRO:         'INTRO',
    PLAYER_INPUT:  'PLAYER_INPUT',
    ENEMY_INPUT:   'ENEMY_INPUT',
    EXECUTE:       'EXECUTE',
    FAINT_CHECK:   'FAINT_CHECK',
    FAINT_ANIM:    'FAINT_ANIM',
    FAINT_HANDLER: 'FAINT_HANDLER',
    SWITCH_IN:     'SWITCH_IN',
    LEVEL_UP:      'LEVEL_UP',
    EVOLUTION:     'EVOLUTION',
    CATCH_ATTEMPT: 'CATCH_ATTEMPT',
    RUN_ATTEMPT:   'RUN_ATTEMPT',
    BATTLE_END:    'BATTLE_END',
    PLAYER_SWITCH: 'PLAYER_SWITCH',
    ITEM_USE:      'ITEM_USE',
    LEARN_MOVE:    'LEARN_MOVE',
    FLEE_CONFIRM:  'FLEE_CONFIRM',
  };

  let _state = BS.IDLE;
  let _battle = null; // current battle data
  let _justCaughtMon = null; // set when a mon is caught; cleared by getCaughtMon()
  let _pendingCatch  = null; // stores {target,ballId,caught,shakes} while animation plays
  let _lastResult = null; // last battle result, cleared by getLastResult()

  // ── HP bar smooth animation (lerped display values) ──────
  let _playerHPDisplay = null; // displayed HP for player mon (null = snap immediately)
  let _enemyHPDisplay  = null; // displayed HP for enemy mon
  let _allyHPDisplay   = null; // displayed HP for ally mon in double battle
  let _enemy2HPDisplay = null; // displayed HP for enemy2 mon in double battle

  // ── EXP bar smooth animation ─────────────────────────────
  let _playerExpDisplay     = null; // animated EXP value (null = snap)
  let _playerExpDisplayLevel = null; // level when display was last set (detect level-ups)

  // ── Flee confirmation state ──────────────────────────────
  let _awaitingFleeConfirm = false; // true while waiting for Yes/No on RUN

  // ── Public: start a battle ────────────────────────────────
  // battleConfig: { type:'WILD'|'TRAINER', enemy, trainerData, gameState, onEnd }
  // ── Helper: trainer team strength score (for weakest→strongest sort) ─
  function _monStrengthScore(mon) {
    const sp = DG.SPECIES && DG.SPECIES[mon.speciesId];
    const bst = sp ? Object.values(sp.baseStats || {}).reduce((a, b) => a + b, 0) : 300;
    return mon.level * 10 + bst / 100;  // level dominates; BST breaks ties
  }

  function start(battleConfig) {
    const gs = battleConfig.gameState;
    // Sync the Battle FX setting (Options) so it also applies right after load.
    window._BATTLE_FX_OFF = !!(gs.settings && gs.settings.battleFx === 'OFF');
    const playerParty = gs.player.party;

    // ── Build trainer party sorted weakest→strongest ──────────
    let enemyParty, enemyMon;
    if (battleConfig.type === 'TRAINER' && battleConfig.trainerData) {
      const _allShiny = !!battleConfig.trainerData.allShiny;
      enemyParty = battleConfig.trainerData.party.map(p => {
        const _m = DG.SaveLoad.createDinoMon(p.speciesId, p.level, null, p.moves);
        if (_m && (_allShiny || p.shiny)) _m.isShiny = true;   // trainer-flagged shiny team
        return _m;
      });
      // Sort ascending: weakest first, strongest last
      enemyParty.sort((a, b) => _monStrengthScore(a) - _monStrengthScore(b));
      enemyMon = enemyParty[0];
    } else {
      enemyParty = [battleConfig.enemy];
      enemyMon   = battleConfig.enemy;
    }

    // ── Use first ALIVE player mon as lead ─────────────────────
    const firstAliveIdx = playerParty.findIndex(m => m && !m.isEgg && m.hp.current > 0);
    const leadIdx = firstAliveIdx >= 0 ? firstAliveIdx : 0;

    // FASE 7: rivalnaam-substitutie op een KOPIE van de trainerdata, zodat
    // het VS-scherm, battle-berichten en de beloningsregel overal de gekozen
    // naam tonen (het globale DG.TRAINERS-object blijft onaangeroerd)
    let _td = battleConfig.trainerData || null;
    if (_td && _td.name && typeof DG.getRivalName === 'function' && /\bFlint\b/i.test(_td.name)) {
      _td = Object.assign({}, _td, { name: _td.name.replace(/\bFlint\b/gi, DG.getRivalName()) });
    }

    _battle = {
      type:          battleConfig.type,
      trainerData:   _td,
      gameState:     gs,
      onEnd:         battleConfig.onEnd || function(){},

      // Combatants
      playerMon:     playerParty[leadIdx],
      enemyMon:      enemyMon,
      playerParty:   playerParty,
      enemyParty:    enemyParty,
      enemyPartyIndex: 0,   // tracks which trainer mon is currently active (sequential order)

      // Stat stages
      playerStages:  { atk:0, def:0, spAtk:0, spDef:0, spd:0, acc:0, eva:0 },
      enemyStages:   { atk:0, def:0, spAtk:0, spDef:0, spd:0, acc:0, eva:0 },

      // Turn data
      playerAction:  null,
      enemyAction:   null,
      turnQueue:     [],
      messages:         [],
      pendingMessage:   null,
      _msgDamageQueue:  [],   // parallel queue: deferred per-hit damage for MULTI moves

      // Participation tracking for XP distribution
      participants:  new Set([leadIdx]),

      // Weather — inherit map ambient weather (permanent, turns=0) or none
      weather:       window.DG_MAP_WEATHER || null,
      weatherTurns:  0,  // 0 = permanent (map weather never expires)

      // Entry hazards (set by Stealth Rock etc.)
      playerHazards: [],
      enemyHazards:  [],

      // Flags
      fled:           false,
      caught:         false,
      expGained:      0,
      runAttempts:    0,
      isForcedSwitch: false,   // true when player must switch (no enemy turn consumed)

      // Animation timer
      animTimer:     0,
      introTimer:    0,
      displayedExpPct: -1,
    };

    // Update Dex: mark enemy seen
    DG.SaveLoad.markSeen(gs, _battle.enemyMon.speciesId);

    // Trigger entry abilities (weather setters, Intimidate, etc.)
    _abilityOnEntry(_battle.playerMon, true);
    _abilityOnEntry(_battle.enemyMon, false);

    // Snap HP display to actual values at battle start
    _playerHPDisplay = null;
    _enemyHPDisplay  = null;
    _playerExpDisplay = null;
    _playerExpDisplayLevel = null;
    _awaitingFleeConfirm = false;

    _state = BS.INTRO;
    _pushMessage(_introMessage());
    _battle.introTimer = 120; // ~2 seconds at 60fps
    _battle.introPhase = (battleConfig.type === 'TRAINER') ? 'TRAINER_INTRO' : 'BATTLE';

    // Clear any stale queued animations from previous battle
    try { if (typeof DG.BattleAnim !== 'undefined') DG.BattleAnim.clearQueue(); } catch(e) {}

    // Battle start sound
    try { if (typeof DG.Audio !== 'undefined') DG.Audio.playSfx('BATTLE_START'); } catch(e) {}

    // Shiny sparkle for shiny mons
    if (typeof DG.BattleAnim !== 'undefined' && DG.BattleAnim.triggerShiny) {
      try {
        if (_battle.playerMon && _battle.playerMon.isShiny) DG.BattleAnim.triggerShiny('player');
        if (_battle.enemyMon  && _battle.enemyMon.isShiny)  DG.BattleAnim.triggerShiny('enemy');
      } catch(e) {}
    }

    // Trainer throw intro animation
    if (typeof DG.BattleAnim !== 'undefined' && DG.BattleAnim.triggerBattleIntro) {
      let _tName = (_battle.type === 'TRAINER' && _battle.trainerData) ? (_battle.trainerData.name || '') : '';
      // Substitute rival name (Flint → chosen name)
      if (typeof DG.getRivalName === 'function') {
        _tName = _tName.replace(/\bFlint\b/gi, DG.getRivalName());
      }
      if (_battle.introPhase === 'TRAINER_INTRO') {
        // FASE 4: ball-throw pas afspelen NA het VS-scherm — anders tikt de
        // animatie onzichtbaar weg achter de versus-overlay
        _battle._pendingIntro = { isTrainer: true, name: _tName };
      } else {
        try { DG.BattleAnim.triggerBattleIntro(false, ''); } catch(e) {}
      }
    }

    // Ability flash for entry abilities (Intimidate etc.)
    try {
      if (typeof DG.BattleAnim !== 'undefined' && DG.BattleAnim.triggerAbilityFlash) {
        const _entryAbilityEffect = (ab) => {
          const lc = (ab || '').toLowerCase();
          if (/intimidate|alpha roar/.test(lc))                   return 'intimidate';
          if (/sand stream|sand veil/.test(lc))                   return 'entry';
          if (/drizzle|rain call/.test(lc))                       return 'entry';
          if (/drought|sun summon/.test(lc))                      return 'entry';
          if (/snow warning|ice coat/.test(lc))                   return 'entry';
          if (/speed boost|turbo sprint/.test(lc))                return 'speed_boost';
          if (/levitate|hover|air body/.test(lc))                 return 'levitate';
          if (/flash fire|inferno shield/.test(lc))               return 'absorb_fire';
          if (/volt absorb|lightning rod|conductor|electric sponge/.test(lc)) return 'absorb_electric';
          return null; // no entry flash for this ability
        };
        const pSp = DG.SPECIES && DG.SPECIES[_battle.playerMon.speciesId];
        const eSp = DG.SPECIES && DG.SPECIES[_battle.enemyMon.speciesId];
        const pEff = pSp && _entryAbilityEffect(pSp.ability);
        const eEff = eSp && _entryAbilityEffect(eSp.ability);
        if (pEff) DG.BattleAnim.triggerAbilityFlash(pSp.ability, 'player', pEff);
        if (eEff) DG.BattleAnim.triggerAbilityFlash(eSp.ability, 'enemy',  eEff);
      }
    } catch(e) {}
  }

  // ── Public: start a 2v2 double battle ────────────────────────
  // config: { enemy1Trainer, enemy2Trainer, allyTrainer, gameState, onEnd }
  function startDouble(config) {
    const gs = config.gameState;
    const playerParty = gs.player.party;

    // Build enemy parties (sorted weakest→strongest)
    const enemy1Party = config.enemy1Trainer.party.map(p => DG.SaveLoad.createDinoMon(p.speciesId, p.level, null, p.moves));
    enemy1Party.sort((a,b) => _monStrengthScore(a) - _monStrengthScore(b));
    const enemy2Party = config.enemy2Trainer.party.map(p => DG.SaveLoad.createDinoMon(p.speciesId, p.level, null, p.moves));
    enemy2Party.sort((a,b) => _monStrengthScore(a) - _monStrengthScore(b));

    // Build ally party
    const allyParty = config.allyTrainer.party.map(p => DG.SaveLoad.createDinoMon(p.speciesId, p.level, null, p.moves));

    // Player's first alive mon
    const playerAlive = playerParty.filter(m => m && !m.isEgg && m.hp.current > 0);
    const playerMon  = playerAlive[0] || playerParty[0];

    _allyHPDisplay   = null;
    _enemy2HPDisplay = null;
    _playerHPDisplay = null;
    _enemyHPDisplay  = null;
    _awaitingFleeConfirm = false;

    _battle = {
      type:          'DOUBLE',
      isDouble:      true,
      gameState:     gs,
      onEnd:         config.onEnd || function(){},

      // Player side
      playerMon:      playerMon,
      playerParty:    playerParty,
      playerStages:   { atk:0, def:0, spAtk:0, spDef:0, spd:0, acc:0, eva:0 },
      participants:   new Set([playerParty.indexOf(playerMon)]),

      // Ally side (Morax — AI controlled)
      allyMon:        allyParty[0],
      allyParty:      allyParty,
      allyPartyIndex: 0,
      allyTrainer:    config.allyTrainer,
      allyStages:     { atk:0, def:0, spAtk:0, spDef:0, spd:0, acc:0, eva:0 },

      // Enemy 1 (Flint)
      enemyMon:         enemy1Party[0],
      enemyParty:       enemy1Party,
      enemyPartyIndex:  0,
      trainerData:      config.enemy1Trainer,
      enemyStages:      { atk:0, def:0, spAtk:0, spDef:0, spd:0, acc:0, eva:0 },

      // Enemy 2 (Cretaceous)
      enemy2Mon:         enemy2Party[0],
      enemy2Party:       enemy2Party,
      enemy2PartyIndex:  0,
      enemy2Trainer:     config.enemy2Trainer,
      enemy2Stages:      { atk:0, def:0, spAtk:0, spDef:0, spd:0, acc:0, eva:0 },

      // Target player is aiming at (ENEMY1 or ENEMY2)
      doubleTarget:   'ENEMY1',

      // Shared battle state
      playerAction:   null,
      enemyAction:    null,
      turnQueue:      [],
      messages:       [],
      pendingMessage: null,
      _msgDamageQueue:[],
      weather:        null,
      weatherTurns:   0,
      playerHazards:  [],
      enemyHazards:   [],
      fled:           false,
      caught:         false,
      expGained:      0,
      runAttempts:    0,
      isForcedSwitch: false,
      animTimer:      0,
      introTimer:     0,
      displayedExpPct:-1,
      introPhase:     'TRAINER_INTRO',
    };

    _state = BS.INTRO;
    _pushMessage(`Flint and Commander Cretaceous want to battle!`);
    _battle.introTimer = 120;

    try { if (typeof DG.BattleAnim !== 'undefined') DG.BattleAnim.clearQueue(); } catch(e) {}
    try { if (typeof DG.Audio !== 'undefined') DG.Audio.playSfx('BATTLE_START'); } catch(e) {}
    _battle._pendingIntro = { isTrainer: true, name: 'Commander Cretaceous' }; // FASE 4: na het VS-scherm
  }

  // ── Public: main update tick (called every frame) ─────────
  function update(dt) {
    if (_state === BS.IDLE || !_battle) {
      // FASE 3: buiten battle geen intensiteitslaag
      try { if (typeof DG.Audio !== 'undefined' && DG.Audio.setIntensity) DG.Audio.setIntensity(0); } catch(e) {}
      return;
    }

    // FASE 3: adaptieve battle-muziek — lage HP (<25%) schakelt de spanningslaag bij
    try {
      if (typeof DG.Audio !== 'undefined' && DG.Audio.setIntensity) {
        const lowP = _battle.playerMon && _battle.playerMon.hp.max > 0 &&
                     (_battle.playerMon.hp.current / _battle.playerMon.hp.max) < 0.25 &&
                     _battle.playerMon.hp.current > 0;
        const lowE = _battle.enemyMon && _battle.enemyMon.hp.max > 0 &&
                     (_battle.enemyMon.hp.current / _battle.enemyMon.hp.max) < 0.25 &&
                     _battle.enemyMon.hp.current > 0;
        DG.Audio.setIntensity((lowP || lowE) ? 1 : 0);
      }
    } catch(e) {}

    // ── HP bar lerp — runs EVERY frame so the bar animates during message display too ──
    if (_battle) {
      // Rate = 4% of max HP per frame (min 4 HP), so a full bar drains in ~25 frames.
      const HP_LERP_RATE = Math.max(4, Math.ceil(
        Math.max(
          (_battle.playerMon ? _battle.playerMon.hp.max : 0),
          (_battle.enemyMon  ? _battle.enemyMon.hp.max  : 0)
        ) * 0.04
      ));
      if (_battle.playerMon) {
        const realP = _battle.playerMon.hp.current;
        if (_playerHPDisplay === null) {
          _playerHPDisplay = realP;
        } else {
          const diff = realP - _playerHPDisplay;
          if (Math.abs(diff) < 1) {
            _playerHPDisplay = realP;
          } else {
            _playerHPDisplay += Math.sign(diff) * Math.min(HP_LERP_RATE, Math.abs(diff));
          }
        }
      }
      if (_battle.enemyMon) {
        const realE = _battle.enemyMon.hp.current;
        if (_enemyHPDisplay === null) {
          _enemyHPDisplay = realE;
        } else {
          const diff = realE - _enemyHPDisplay;
          if (Math.abs(diff) < 1) {
            _enemyHPDisplay = realE;
          } else {
            _enemyHPDisplay += Math.sign(diff) * Math.min(HP_LERP_RATE, Math.abs(diff));
          }
        }
      }
      // Double battle HP lerps
      if (_battle.isDouble) {
        const HP_LERP = Math.max(4, Math.ceil(Math.max(
          _battle.allyMon ? _battle.allyMon.hp.max : 0,
          _battle.enemy2Mon ? _battle.enemy2Mon.hp.max : 0
        ) * 0.04));
        if (_battle.allyMon) {
          const realA = _battle.allyMon.hp.current;
          if (_allyHPDisplay === null) { _allyHPDisplay = realA; }
          else { const d = realA - _allyHPDisplay; _allyHPDisplay += Math.sign(d)*Math.min(HP_LERP,Math.abs(d)); if(Math.abs(d)<1) _allyHPDisplay=realA; }
        }
        if (_battle.enemy2Mon) {
          const realE2 = _battle.enemy2Mon.hp.current;
          if (_enemy2HPDisplay === null) { _enemy2HPDisplay = realE2; }
          else { const d = realE2 - _enemy2HPDisplay; _enemy2HPDisplay += Math.sign(d)*Math.min(HP_LERP,Math.abs(d)); if(Math.abs(d)<1) _enemy2HPDisplay=realE2; }
        }
      }

      // EXP bar animation: lerp displayed EXP toward real EXP
      if (_battle.playerMon) {
        const pm = _battle.playerMon;
        // If level changed, snap display to start-of-new-level EXP
        if (_playerExpDisplayLevel !== null && _playerExpDisplayLevel !== pm.level) {
          const sp2 = DG.SPECIES && DG.SPECIES[pm.speciesId];
          const expFn2 = sp2 && DG.EXP_CURVE && DG.EXP_CURVE[sp2.expCurve || 'MEDIUM_FAST'];
          _playerExpDisplay = expFn2 ? expFn2(pm.level) : pm.exp;
        }
        _playerExpDisplayLevel = pm.level;
        const realExp = pm.exp;
        if (_playerExpDisplay === null) {
          _playerExpDisplay = realExp;
        } else {
          const expDiff = realExp - _playerExpDisplay;
          if (Math.abs(expDiff) < 1) {
            _playerExpDisplay = realExp;
          } else {
            // Fill bar in ~30 frames for up to 300 EXP; faster for larger gains
            const EXP_LERP_RATE = Math.max(2, Math.ceil(Math.abs(expDiff) / 30));
            _playerExpDisplay += Math.sign(expDiff) * Math.min(EXP_LERP_RATE, Math.abs(expDiff));
          }
        }
      }
    } else {
      _playerHPDisplay = null;
      _enemyHPDisplay  = null;
      _playerExpDisplay = null;
      _playerExpDisplayLevel = null;
    }

    // Drain pending messages one at a time
    if (_battle.pendingMessage !== null) {
      _battle.animTimer -= 1;
      if (_battle.animTimer <= 0) {
        _battle.pendingMessage = null;
        _advanceState();
      }
      return;
    }

    // Pop next queued message if any
    if (_battle.messages.length > 0) {
      _battle.pendingMessage = _battle.messages.shift();
      // Apply any deferred action paired with this message (MULTI-hit damage / status animations)
      const dmgAct = (_battle._msgDamageQueue && _battle._msgDamageQueue.length > 0)
                     ? _battle._msgDamageQueue.shift() : null;
      if (dmgAct) {
        // Per-hit HP damage (MULTI moves)
        if (dmgAct.target && typeof dmgAct.damage === 'number') {
          dmgAct.target.hp.current = Math.max(0, dmgAct.target.hp.current - dmgAct.damage);
          // FASE 1: schadegetal per hit
          if (typeof DG.BattleAnim !== 'undefined' && DG.BattleAnim.popDamage) {
            const tIsPlayer = _battle && dmgAct.target === _battle.playerMon;
            try { DG.BattleAnim.popDamage(dmgAct.damage, tIsPlayer, 'normal'); } catch(e) {}
          }
        }
        // onShow callback (e.g. status tick animations)
        if (typeof dmgAct.onShow === 'function') dmgAct.onShow();
      }
      const chars = _battle.pendingMessage.length;
      const speed = _battle.gameState.settings.textSpeed;
      _battle.animTimer = speed === 'FAST' ? 30 : speed === 'SLOW' ? 90 : 50;
      return;
    }

    _tickState();

    // Smoothly animate XP bar toward real value
    if (_battle && _battle.playerMon) {
      const mon = _battle.playerMon;
      const sp = DG.SPECIES ? DG.SPECIES[mon.speciesId] : null;
      const curve = sp && DG.EXP_CURVE ? DG.EXP_CURVE[sp.expCurve || 'MEDIUM'] : null;
      if (curve) {
        const expAtLevel = curve(mon.level);
        const expAtNext  = curve(mon.level + 1);
        const range = expAtNext - expAtLevel;
        const realPct = range > 0 ? Math.max(0, Math.min(1, (mon.exp - expAtLevel) / range)) : 0;
        if (_battle.displayedExpPct < 0) _battle.displayedExpPct = realPct;
        else if (_battle.displayedExpPct < realPct) {
          _battle.displayedExpPct = Math.min(realPct, _battle.displayedExpPct + 0.008);
        }
      }
    }
  }

  // ── State machine dispatcher ──────────────────────────────
  function _tickState() {
    switch (_state) {
      case BS.INTRO:         _tickIntro();        break;
      case BS.PLAYER_INPUT:  /* driven by UI */   break;
      case BS.EXECUTE:       _tickExecute();      break;
      case BS.FAINT_CHECK:   _tickFaintCheck();   break;
      case BS.FAINT_ANIM:    _tickFaintAnim();    break;
      case BS.FAINT_HANDLER: _tickFaintHandler(); break;
      case BS.LEVEL_UP:      _tickLevelUp();      break;
      case BS.EVOLUTION:     _tickEvolution();    break;
      case BS.CATCH_ATTEMPT: _tickCatchAttempt(); break;
      case BS.RUN_ATTEMPT:   _tickRunAttempt();   break;
      case BS.SWITCH_IN:     _tickSwitchIn();     break;
      case BS.BATTLE_END:    _tickBattleEnd();    break;
      case BS.LEARN_MOVE:    _tickLearnMove();    break;
      case BS.FLEE_CONFIRM:  /* UI-driven; input handled via confirmFlee() */ break;
    }
  }

  function _tickLearnMove() {
    // UI-driven; input handled by renderer via confirmLearnMove()
  }

  function _advanceState() {
    // Only advance the state machine when the message queue is fully drained.
    // If messages are still queued they must all be shown first — otherwise states
    // like BATTLE_END run prematurely and null out _battle, losing XP/level-up messages.
    if (_battle && _battle.messages.length > 0) return;
    _tickState();
  }

  // ── INTRO ─────────────────────────────────────────────────
  function _tickIntro() {
    if (_battle.introPhase === 'TRAINER_INTRO') {
      _battle.introTimer = Math.max(0, (_battle.introTimer || 0) - 1);
      if (_battle.introTimer > 0) return; // keep showing VS screen
      _battle.introPhase = 'BATTLE';
      // FASE 4: nu pas de ball-throw intro starten (zichtbaar ná het VS-scherm)
      if (_battle._pendingIntro && typeof DG.BattleAnim !== 'undefined' && DG.BattleAnim.triggerBattleIntro) {
        try { DG.BattleAnim.triggerBattleIntro(_battle._pendingIntro.isTrainer, _battle._pendingIntro.name); } catch(e) {}
        _battle._pendingIntro = null;
        return;
      }
    }
    // Wait for the battle intro animation (trainer ball throw) to finish
    if (typeof DG.BattleAnim !== 'undefined' && DG.BattleAnim.isBattleIntro) {
      try { if (DG.BattleAnim.isBattleIntro()) return; } catch(e) {}
    }
    _state = BS.PLAYER_INPUT;
  }

  // ── PLAYER_INPUT (driven by UI callbacks) ─────────────────
  // Called by UI when player selects an action
  function submitPlayerAction(action) {
    if (_state !== BS.PLAYER_INPUT) return;

    // ── Forced switch after faint: free swap, no enemy turn ──
    if (action.type === 'SWITCH' && _battle.isForcedSwitch) {
      _battle.isForcedSwitch = false;
      _doForcedSwitch(action);
      return;
    }

    // ── RUN: execute immediately (no confirmation — confirmation caused stuck state) ──
    if (action.type === 'RUN') {
      _awaitingFleeConfirm = false;
      _battle.playerAction = { type: 'RUN' };
      _state = BS.ENEMY_INPUT;
      _chooseEnemyAction();
      _state = BS.EXECUTE;
      _battle.turnQueue = [{ actor: 'PLAYER', action: { type: 'RUN' } }];
      return;
    }

    if (action.type === 'MOVE') {
      action.doubleTarget = _battle.doubleTarget || 'ENEMY1';
    }
    _battle.playerAction = action;
    _state = BS.ENEMY_INPUT;
    _chooseEnemyAction();
    _state = BS.EXECUTE;
    _buildTurnQueue();
    // Do NOT call _tickExecute here — let the update() loop drive it next frame
  }

  // ── Free switch-in after faint (no enemy turn consumed) ──────
  function _doForcedSwitch(act) {
    const newMon = _battle.playerParty[act.targetIndex];
    if (!newMon || newMon.hp.current <= 0 || newMon.isEgg) {
      // Should not happen (party menu filters fainted mons), but guard anyway
      _battle.isForcedSwitch = true;
      _state = BS.PLAYER_INPUT;
      _notifyUI({ event: 'FORCE_SWITCH' });
      return;
    }
    _clearLocks(_battle.playerMon);  // outgoing mon drops any multi-turn lock
    _battle.playerMon = newMon;
    _clearLocks(newMon);
    newMon._seeded = false; // seed clears on switch-in
    _battle.participants.add(act.targetIndex);
    _battle.playerStages = { atk:0, def:0, spAtk:0, spDef:0, spd:0, acc:0, eva:0 };
    _applyEntryHazards(newMon, true);
    _pushMessage(`Go, ${_monName(newMon)}!`);
    // Ball throw animation for new mon coming in
    if (typeof DG.BattleAnim !== 'undefined') {
      try { DG.BattleAnim.triggerSwitchIn(); } catch(e) {}
    }
    _abilityOnEntry(newMon, true);
    _state = BS.PLAYER_INPUT;
  }

  function _chooseEnemyAction() {
    const trainer = _battle.trainerData;
    const activeMon = _battle.enemyMon;
    const playerMon = _battle.playerMon;

    // Tier 3 AI: consider mid-battle switch at type disadvantage
    if (_battle.type === 'TRAINER' && trainer && (trainer.aiTier || 1) >= 3) {
      const sp  = DG.SPECIES[activeMon.speciesId];
      if (sp && Math.random() < 0.35) {
        // Find worst effectiveness any player move has against us
        let worstEff = 1;
        for (const mv of playerMon.moves) {
          const m = DG.MOVES[mv.moveId];
          if (m && m.category !== 'STATUS') {
            const eff = DG.TypeChart.getEffectiveness(m.type, sp.types);
            if (eff > worstEff) worstEff = eff;
          }
        }
        // Switch if facing super-effective threat at <60% HP and we have a better option
        if (worstEff >= 2 && activeMon.hp.current < activeMon.hp.max * 0.6) {
          const alternatives = _battle.enemyParty.filter(m => m !== activeMon && m.hp.current > 0);
          if (alternatives.length > 0) {
            const switchTarget = DG.BattleAI.chooseSwitchIn(alternatives, playerMon);
            if (switchTarget) {
              const idx = _battle.enemyParty.indexOf(switchTarget);
              _battle.enemyAction = { type: 'ENEMY_SWITCH', targetIndex: idx };
              return;
            }
          }
        }
      }
    }

    if (_battle.type === 'WILD') {
      _battle.enemyAction = DG.BattleAI.chooseAction(null, activeMon, playerMon, {});
    } else {
      _battle.enemyAction = DG.BattleAI.chooseAction(trainer, activeMon, playerMon, {});
    }
  }

  // ── DOUBLE: choose all AI actions ────────────────────────
  function _chooseDoubleActions() {
    // Ally (Morax) chooses: attack the OTHER enemy from player's target
    const allyTargetEnemy = (_battle.doubleTarget === 'ENEMY1') ? 'ENEMY2' : 'ENEMY1';
    const allyTargetMon   = (allyTargetEnemy === 'ENEMY1') ? _battle.enemyMon : _battle.enemy2Mon;
    _battle.allyAction    = allyTargetMon && allyTargetMon.hp.current > 0
      ? DG.BattleAI.chooseAction(_battle.allyTrainer, _battle.allyMon, allyTargetMon, {})
      : DG.BattleAI.chooseAction(_battle.allyTrainer, _battle.allyMon, _battle.enemyMon, {});
    _battle.allyAction.doubleTarget = allyTargetEnemy;

    // Enemy1 (Flint) targets a player-side mon (prefer lower HP)
    const e1targets = [
      { mon: _battle.playerMon,  key: 'PLAYER' },
      { mon: _battle.allyMon,    key: 'ALLY'   },
    ].filter(t => t.mon && t.mon.hp.current > 0);
    const e1t = e1targets.length > 0 ? e1targets.reduce((a,b) =>
      (a.mon.hp.current/a.mon.hp.max < b.mon.hp.current/b.mon.hp.max) ? a : b) : null;
    _battle.enemyAction = DG.BattleAI.chooseAction(_battle.trainerData, _battle.enemyMon,
      e1t ? e1t.mon : _battle.playerMon, {});
    _battle.enemyAction.doubleTarget = e1t ? e1t.key : 'PLAYER';

    // Enemy2 (Cretaceous) targets the other player-side mon
    const e2t = e1targets.length > 1
      ? e1targets.find(t => t.key !== (e1t ? e1t.key : 'PLAYER')) || e1targets[0]
      : (e1targets[0] || { mon: _battle.playerMon, key: 'PLAYER' });
    _battle.enemy2Action = DG.BattleAI.chooseAction(_battle.enemy2Trainer, _battle.enemy2Mon,
      e2t.mon, {});
    _battle.enemy2Action.doubleTarget = e2t.key;
  }

  // ── BUILD TURN QUEUE ──────────────────────────────────────
  function _buildTurnQueue() {
    if (_battle.isDouble) {
      _chooseDoubleActions();
      return _buildDoubleTurnQueue();
    }

    const pAct = _battle.playerAction;
    const eAct = _battle.enemyAction;

    // SWITCH / ITEM always go first
    const queue = [];

    if (pAct.type === 'RUN') {
      queue.push({ actor: 'PLAYER', action: pAct });
      _battle.turnQueue = queue;
      return;
    }
    if (pAct.type === 'ITEM') {
      queue.push({ actor: 'PLAYER', action: pAct });
      queue.push({ actor: 'ENEMY',  action: eAct });
      _battle.turnQueue = queue;
      return;
    }
    if (pAct.type === 'SWITCH') {
      queue.push({ actor: 'PLAYER', action: pAct });
      queue.push({ actor: 'ENEMY',  action: eAct });
      _battle.turnQueue = queue;
      return;
    }
    if (eAct.type === 'ENEMY_SWITCH') {
      // Enemy switch happens before player move
      queue.push({ actor: 'ENEMY',  action: eAct });
      queue.push({ actor: 'PLAYER', action: pAct });
      _battle.turnQueue = queue;
      return;
    }

    // Determine priority
    const pMove = pAct.moveIndex >= 0 ? DG.MOVES[_battle.playerMon.moves[pAct.moveIndex]?.moveId] : null;
    const eMove = eAct.moveIndex >= 0 ? DG.MOVES[_battle.enemyMon.moves[eAct.moveIndex]?.moveId] : null;
    const pPrio = pMove ? (pMove.priority || 0) : 0;
    const ePrio = eMove ? (eMove.priority || 0) : 0;

    let playerFirst;
    if (pPrio !== ePrio) {
      playerFirst = pPrio > ePrio;
    } else {
      const pSpd = _battle.playerMon.stats.spd * DG.StatusEffects.speedMult(_battle.playerMon)
                   * DG.stageMultiplier(_battle.playerStages.spd || 0) * _abilitySpeedMult(_battle.playerMon);
      const eSpd = _battle.enemyMon.stats.spd  * DG.StatusEffects.speedMult(_battle.enemyMon)
                   * DG.stageMultiplier(_battle.enemyStages.spd  || 0) * _abilitySpeedMult(_battle.enemyMon);
      playerFirst = pSpd >= eSpd ? (pSpd > eSpd ? true : Math.random() < 0.5) : false;
    }

    if (playerFirst) {
      queue.push({ actor: 'PLAYER', action: pAct });
      queue.push({ actor: 'ENEMY',  action: eAct });
    } else {
      queue.push({ actor: 'ENEMY',  action: eAct });
      queue.push({ actor: 'PLAYER', action: pAct });
    }
    _battle.turnQueue = queue;
  }

  function _buildDoubleTurnQueue() {
    const queue = [];
    const actors = [
      { id:'PLAYER', mon: _battle.playerMon,  act: _battle.playerAction,  stages: _battle.playerStages  },
      { id:'ALLY',   mon: _battle.allyMon,    act: _battle.allyAction,    stages: _battle.allyStages    },
      { id:'ENEMY1', mon: _battle.enemyMon,   act: _battle.enemyAction,   stages: _battle.enemyStages   },
      { id:'ENEMY2', mon: _battle.enemy2Mon,  act: _battle.enemy2Action,  stages: _battle.enemy2Stages  },
    ].filter(a => a.mon && a.mon.hp.current > 0 && a.act);

    // Sort by priority then speed
    actors.sort((a, b) => {
      const aMove = (a.act.type === 'MOVE' && a.act.moveIndex >= 0) ? DG.MOVES[a.mon.moves[a.act.moveIndex]?.moveId] : null;
      const bMove = (b.act.type === 'MOVE' && b.act.moveIndex >= 0) ? DG.MOVES[b.mon.moves[b.act.moveIndex]?.moveId] : null;
      const aPrio = aMove ? (aMove.priority || 0) : 0;
      const bPrio = bMove ? (bMove.priority || 0) : 0;
      if (aPrio !== bPrio) return bPrio - aPrio;
      const aSpd = a.mon.stats.spd * DG.StatusEffects.speedMult(a.mon) * DG.stageMultiplier(a.stages.spd||0) * _abilitySpeedMult(a.mon);
      const bSpd = b.mon.stats.spd * DG.StatusEffects.speedMult(b.mon) * DG.stageMultiplier(b.stages.spd||0) * _abilitySpeedMult(b.mon);
      return bSpd - aSpd + (Math.random() - 0.5) * 0.1;
    });

    actors.forEach(a => queue.push({ actor: a.id, action: a.act }));
    _battle.turnQueue = queue;
  }

  // ── EXECUTE ───────────────────────────────────────────────
  function _tickExecute() {
    if (_battle.turnQueue.length === 0) {
      // Transition to end-of-turn without direct recursion
      _state = BS.FAINT_CHECK; // skip straight to faint check after queue drains
      _doEndOfTurnEffects();   // apply status damage etc. (no state transition)

      // Check low-HP passive abilities at end of turn queue (Blaze/Torrent/Overgrow/Swarm)
      try {
        if (typeof DG.BattleAnim !== 'undefined' && DG.BattleAnim.triggerAbilityFlash) {
          const _lowHpTypeColor = (ab) => {
            const lc = (ab || '').toLowerCase();
            if (/blaze|ember scales|volcanic presence|primordial flame/.test(lc)) return '#FF6600';
            if (/torrent|tidal force|deep current/.test(lc))                       return '#4488FF';
            if (/overgrow|frond guard|ancient growth/.test(lc))                    return '#44CC44';
            if (/swarm|hive mind|insect shell/.test(lc))                           return '#88CC00';
            return '#FFD700'; // Guts / default
          };
          const _checkLowHpAbility = (mon, side) => {
            if (!mon || mon.hp.current <= 0) return;
            const sp = DG.SPECIES && DG.SPECIES[mon.speciesId];
            if (!sp || !sp.ability) return;
            const ab = sp.ability;
            const hpPct = mon.hp.current / mon.hp.max;
            if (hpPct <= 0.333) {
              const lowHpAbs = ['Blaze','Ember Scales','Volcanic Presence','Primordial Flame',
                                'Torrent','Tidal Force','Deep Current','Overgrow',
                                'Frond Guard','Ancient Growth','Swarm','Hive Mind','Insect Shell',
                                'Guts'];
              if (lowHpAbs.includes(ab)) {
                DG.BattleAnim.triggerAbilityFlash(ab, side, 'power_boost', { typeColor: _lowHpTypeColor(ab) });
              }
            }
          };
          _checkLowHpAbility(_battle.playerMon, 'player');
          _checkLowHpAbility(_battle.enemyMon, 'enemy');
        }
      } catch(e) {}

      return;
    }

    const turn = _battle.turnQueue.shift();
    const isPlayer = turn.actor === 'PLAYER';
    let actor, target, actorStages, targetStages;
    if (_battle.isDouble) {
      const dt = turn.action.doubleTarget;
      if (turn.actor === 'PLAYER') {
        actor = _battle.playerMon;
        actorStages = _battle.playerStages;
        target = (dt === 'ENEMY2') ? _battle.enemy2Mon : _battle.enemyMon;
        targetStages = (dt === 'ENEMY2') ? _battle.enemy2Stages : _battle.enemyStages;
      } else if (turn.actor === 'ALLY') {
        actor = _battle.allyMon;
        actorStages = _battle.allyStages;
        target = (dt === 'ENEMY2') ? _battle.enemy2Mon : _battle.enemyMon;
        targetStages = (dt === 'ENEMY2') ? _battle.enemy2Stages : _battle.enemyStages;
      } else if (turn.actor === 'ENEMY1') {
        actor = _battle.enemyMon;
        actorStages = _battle.enemyStages;
        target = (dt === 'ALLY') ? _battle.allyMon : _battle.playerMon;
        targetStages = (dt === 'ALLY') ? _battle.allyStages : _battle.playerStages;
      } else { // ENEMY2
        actor = _battle.enemy2Mon;
        actorStages = _battle.enemy2Stages;
        target = (dt === 'ALLY') ? _battle.allyMon : _battle.playerMon;
        targetStages = (dt === 'ALLY') ? _battle.allyStages : _battle.playerStages;
      }
    } else {
      actor  = isPlayer ? _battle.playerMon : _battle.enemyMon;
      target = isPlayer ? _battle.enemyMon  : _battle.playerMon;
      actorStages  = isPlayer ? _battle.playerStages : _battle.enemyStages;
      targetStages = isPlayer ? _battle.enemyStages  : _battle.playerStages;
    }

    // Skip if actor already fainted (or null) — just leave state as EXECUTE, next frame handles it
    if (!actor || actor.hp.current <= 0) {
      return;
    }

    const act = turn.action;

    if (act.type === 'RUN') {
      _doRun();
      return;
    }

    if (act.type === 'ITEM' && isPlayer) {
      _doItem(act);
      return;
    }

    if (act.type === 'SWITCH' && isPlayer) {
      _doSwitch(act);
      return;
    }

    if (act.type === 'ENEMY_SWITCH' && !isPlayer) {
      _doEnemySwitch(act);
      return;
    }

    if (act.type === 'MOVE') {
      // Guard: target may be null/fainted in double battle
      if (!target || target.hp.current <= 0) { _continueExecution(); return; }
      _doMove(isPlayer, actor, target, act, actorStages, targetStages);
      return;
    }

    // Fallback: state stays EXECUTE, next frame will re-tick
  }

  // Moves that lock the user into a multi-turn rampage, then cause confusion.
  const _RAMPAGE_MOVES = { THRASH: 1, OUTRAGE: 1, PETAL_DANCE: 1 };

  // Status effect.type aliases: many moves encode the status in the TYPE name
  // (e.g. effect.type:'BURN_CHANCE') instead of using STATUS_CHANCE + status.
  // Map them so both damage-secondary and status-move paths actually apply them.
  const _STATUS_ALIAS = { BURN_CHANCE:'BURN', FREEZE_CHANCE:'FREEZE', POISON_CHANCE:'POISON', PARALYSIS:'PARALYSIS', SLEEP:'SLEEP' };

  // Index of the move the actor is locked into this turn (-1 if free to choose).
  function lockedMoveIndex(mon) {
    if (!mon || !mon._lock) return -1;
    return mon.moves.findIndex(m => m && m.moveId === mon._lock.moveId);
  }

  // Clear all multi-turn lock state (called on switch / faint so a returning
  // DinoMon is never stuck mid-Rollout or mid-charge).
  function _clearLocks(mon) {
    if (!mon) return;
    mon._lock = null;
    mon._charging = false;
    mon._chargingMoveId = null;
    mon._rolloutMult = 1;
    mon._rampageEnded = false;
    mon._infatuated = false;   // infatuation is a volatile — ends on switch out
  }

  // ── MOVE EXECUTION ────────────────────────────────────────
  function _doMove(isPlayer, actor, target, act, actorStages, targetStages) {
    const actorName  = _monName(actor);
    const targetName = _monName(target);

    // Flinch check (from previous turn's flinch effect)
    if (actor._flinched) {
      actor._flinched = false;
      _pushMessage(`${actorName} flinched and couldn't move!`);
      _continueExecution();
      return;
    }

    // Recharge check (e.g. after Hyper Beam)
    if (actor._rechargeNext) {
      actor._rechargeNext = false;
      _pushMessage(`${actorName} must recharge!`);
      _continueExecution();
      return;
    }

    // Check pre-move status conditions
    // Sleep
    const sleepRes = DG.StatusEffects.sleepCheck(actor);
    if (!sleepRes.canMove) {
      _pushMessage(sleepRes.message);
      _continueExecution();
      return;
    }
    if (sleepRes.message) _pushMessage(sleepRes.message);

    // Freeze
    const freezeRes = DG.StatusEffects.freezeCheck(actor);
    if (!freezeRes.canMove) {
      _pushMessage(freezeRes.message);
      _continueExecution();
      return;
    }
    if (freezeRes.message) _pushMessage(freezeRes.message);

    // Paralysis
    const paraRes = DG.StatusEffects.paralysisCheck(actor);
    if (!paraRes.canMove) {
      _pushMessage(paraRes.message);
      _continueExecution();
      return;
    }

    // Confusion
    const confRes = DG.StatusEffects.confusionCheck(actor);
    if (confRes.selfHit) {
      _pushMessage(confRes.message);
      _checkFaints();
      return;
    }
    if (confRes.message) _pushMessage(confRes.message);

    // Infatuation (Cute Charm): 50% chance to skip move
    if (actor._infatuated) {
      _pushMessage(`${actorName} is infatuated!`);
      if (Math.random() < 0.50) {
        _pushMessage(`${actorName} is in love and can't move!`);
        _continueExecution();
        return;
      }
      _pushMessage(`${actorName} overcame infatuation!`);
    }

    // Multi-turn lock: if committed to a move (Rollout / charging two-turn /
    // Thrash family), force that move regardless of what was chosen, and treat
    // this as a continuation turn (no extra PP spent).
    let _lockContinue = false;
    if (actor._lock) {
      const li = actor.moves.findIndex(m => m && m.moveId === actor._lock.moveId);
      if (li >= 0) { act = Object.assign({}, act, { moveIndex: li }); _lockContinue = true; }
      else actor._lock = null;
    }

    // Determine move (Struggle if no PP or no valid move)
    let moveSlot = act.moveIndex >= 0 ? actor.moves[act.moveIndex] : null;
    let move = moveSlot ? DG.MOVES[moveSlot.moveId] : null;
    let isStruggle = false;

    // Check if all moves have 0 PP → force Struggle
    const allOut = actor.moves.every(m => (m.ppCurrent || 0) <= 0);
    if (!_lockContinue && (allOut || !move || (moveSlot && moveSlot.ppCurrent <= 0))) {
      move = { id:'STRUGGLE', name:'Struggle', type:'NORMAL', category:'PHYSICAL', power:50,
               accuracy:999, pp:1, priority:0, effect:{ type:'RECOIL', fraction:0.25 }, description:'Desperation move.' };
      isStruggle = true;
    } else if (!_lockContinue) {
      // Only spend PP on the FIRST turn of a multi-turn sequence.
      moveSlot.ppCurrent = Math.max(0, (moveSlot.ppCurrent || 0) - 1);
    }

    // Two-turn move: charge phase
    const effType = move.effect?.type || 'NONE';
    if (effType === 'TWO_TURN' && !actor._charging) {
      actor._charging = true;
      actor._chargingMoveId = move.id;
      actor._lock = { moveId: move.id, kind: 'CHARGE' };  // force the release turn
      // FASE 9: visuele charge-status (Fly = omhoog, Dig = ondergronds, vervaagd)
      try { if (DG.BattleAnim.setChargeVisual) DG.BattleAnim.setChargeVisual(isPlayer ? 'player' : 'enemy', move.id); } catch(e) {}
      _pushMessage(`${actorName} ${move.effect.chargeMsg || 'is charging!'}`);
      _continueExecution();
      return;
    }
    if (actor._charging) {
      actor._charging = false;
      actor._chargingMoveId = null;
      actor._lock = null;   // two-turn sequence complete after the release
      // FASE 9: dino komt terug in beeld voor de aanval
      try { if (DG.BattleAnim.setChargeVisual) DG.BattleAnim.setChargeVisual(isPlayer ? 'player' : 'enemy', null); } catch(e) {}
    }

    // ── Rollout / Rampage (Thrash, Outrage, Petal Dance) lock ──────────
    // Rollout: locks for up to 5 turns, power doubles each turn.
    // Rampage: locks for 2-3 turns, then the user becomes confused.
    actor._rolloutMult = 1;
    if (move.id === 'ROLLOUT') {
      if (!actor._lock) actor._lock = { moveId: 'ROLLOUT', kind: 'ROLLOUT', turnsLeft: 5, count: 0 };
      actor._rolloutMult = Math.pow(2, actor._lock.count || 0);
      actor._lock.count = (actor._lock.count || 0) + 1;
      actor._lock.turnsLeft--;
      if (actor._lock.turnsLeft <= 0) actor._lock = null;
    } else if (_RAMPAGE_MOVES[move.id]) {
      if (!actor._lock) actor._lock = { moveId: move.id, kind: 'RAMPAGE', turnsLeft: (Math.random() < 0.5 ? 2 : 3) };
      actor._lock.turnsLeft--;
      if (actor._lock.turnsLeft <= 0) {
        actor._lock = null;
        actor._rampageEnded = true;   // become confused after this hit resolves
      }
    }

    _pushMessage(`${actorName} used ${move.name}!`);

    // Trigger visual animation (skip for MULTI — each hit triggers its own)
    const _isMultiMove = (move.effect?.type === 'MULTI');
    if (typeof DG.BattleAnim !== 'undefined' && !_isMultiMove) {
      DG.BattleAnim.trigger(move.type, isPlayer, move.category, move.animStyle, move.power, move.id);
    }

    _resolveMoveEffect(isPlayer, actor, target, move, actorStages, targetStages, isStruggle);

    // Rampage finished (Thrash/Outrage/Petal Dance) — user tires and gets confused.
    if (actor._rampageEnded) {
      actor._rampageEnded = false;
      const cr = DG.StatusEffects.applyConfusion(actor);
      if (cr.applied) _pushMessage(`${actorName} became confused due to fatigue!`);
    }
  }

  // Common path: accuracy check + apply effect
  function _resolveMoveEffect(isPlayer, actor, target, move, actorStages, targetStages, isStruggle) {
    const actorName  = _monName(actor);

    // FASE 9: semi-onraakbaar — het doelwit zit in de oplaadbeurt van Fly
    // (in de lucht), Dig (ondergronds) of Phantom Force (verdwenen): mis.
    const _SEMI_INVULN = { FLY: 1, DIG: 1, PHANTOM_FORCE: 1, DIVE: 1, SKY_DROP: 1, UMBRAL_DIVE: 1, SHADOW_FORCE: 1 };
    if (move.category !== 'STATUS' && target && target._charging &&
        _SEMI_INVULN[target._chargingMoveId]) {
      _pushMessage(`${_monName(target)} avoided the attack!`);
      _continueExecution();
      return;
    }

    // ── Accuracy-modifying abilities ─────────────────────────
    const _accAtkAb = ((DG.SPECIES[actor.speciesId] || {}).ability) || '';
    const _accDefAb = (target && ((DG.SPECIES[target.speciesId] || {}).ability)) || '';
    // No Guard (either side) / Predator's Mind (attacker): moves never miss.
    const _skipAcc = (_accAtkAb === 'No Guard' || _accDefAb === 'No Guard' || _accAtkAb === "Predator's Mind");
    let _accMove = move;
    if (!_skipAcc && move.accuracy && move.accuracy < 999) {
      let _accMult = 1;
      if (_accAtkAb === 'Compound Eyes') _accMult *= 1.3;                                   // +30% accuracy
      if (_accAtkAb === 'Hustle' && move.category === 'PHYSICAL') _accMult *= 0.8;          // -20% on physical
      if (_accMult !== 1) _accMove = Object.assign({}, move, { accuracy: Math.min(100, move.accuracy * _accMult) });
    }

    // Accuracy check
    if (!_skipAcc && !DG.TypeChart.accuracyCheck(_accMove, actorStages.acc || 0, targetStages.eva || 0)) {
      _pushMessage(`${actorName}'s attack missed!`);
      // Rollout breaks on a miss: drop the lock and reset its escalating power.
      if (move.id === 'ROLLOUT' && actor._lock && actor._lock.kind === 'ROLLOUT') {
        actor._lock = null;
        actor._rolloutMult = 1;
      }
      _continueExecution();
      return;
    }

    // Apply move effect
    if (move.category === 'STATUS') {
      _applyStatusMove(isPlayer, actor, target, move, actorStages, targetStages);
    } else {
      _applyDamageMove(isPlayer, actor, target, move, actorStages, targetStages, isStruggle);
    }
  }

  function _applyDamageMove(isPlayer, actor, target, move, actorStages, targetStages, isStruggle) {
    const actorName  = _monName(actor);
    const targetName = _monName(target);
    const statStages = { attacker: actorStages, defender: targetStages };

    const eff = move.effect || {};
    const effType = eff.type || 'NONE';

    // Compute ability and held-item bonuses for damage
    const atkSp  = DG.SPECIES[actor.speciesId];
    const defSp  = DG.SPECIES[target.speciesId];
    const atkAb  = atkSp?.ability || '';
    const defAb  = defSp?.ability || '';
    // Pixilate: Normal-type moves become Fairy-type and gain 20% power (local clone).
    if (atkAb === 'Pixilate' && move.type === 'NORMAL' && move.category !== 'STATUS' && (move.power || 0) > 0) {
      move = Object.assign({}, move, { type: 'FAIRY', power: Math.floor(move.power * 1.2) });
    }
    const hpPct  = actor.hp.current / actor.hp.max;
    const defSide = isPlayer ? 'enemy' : 'player';
    const actSide = isPlayer ? 'player' : 'enemy';

    // ── Priority B: Absorb / Immunity abilities ─────────────────────────────
    // Levitate / Hover: immune to all GROUND-type moves
    if (move.type === 'GROUND' && atkAb !== 'Mold Breaker' &&
        (defAb === 'Levitate' || defAb === 'Hover' || defAb === 'Air Body' || defAb === 'Balloon')) {
      _pushMessage(`${targetName} is floating — ${defAb} made it immune!`);
      _triggerAbilityAnim(defAb, defSide, 'levitate');
      _continueExecution();
      return;
    }
    // Flash Fire / Inferno Shield: absorb FIRE, boost own FIRE power
    if (move.type === 'FIRE' &&
        (defAb === 'Flash Fire' || defAb === 'Inferno Shield')) {
      target._flashFireActive = true;
      _pushMessage(`${targetName}'s ${defAb} powered up its Fire moves!`);
      _triggerAbilityAnim(defAb, defSide, 'absorb_fire');
      _continueExecution();
      return;
    }
    // Volt Absorb / Electric Sponge: absorb ELECTRIC, restore ¼ HP
    if (move.type === 'ELECTRIC' &&
        (defAb === 'Volt Absorb' || defAb === 'Electric Sponge')) {
      const vaHeal = Math.max(1, Math.floor(target.hp.max / 4));
      target.hp.current = Math.min(target.hp.max, target.hp.current + vaHeal);
      _pushMessage(`${targetName}'s ${defAb} restored its HP!`);
      _triggerAbilityAnim(defAb, defSide, 'absorb_electric');
      _continueExecution();
      return;
    }
    // Lightning Rod / Conductor: absorb ELECTRIC, raise SpAtk +1
    if (move.type === 'ELECTRIC' &&
        (defAb === 'Lightning Rod' || defAb === 'Conductor')) {
      const lrStages = isPlayer ? _battle.enemyStages : _battle.playerStages;
      _applyStageDelta(lrStages, 'spAtk', 1, targetName);
      _pushMessage(`${targetName}'s ${defAb} absorbed the electricity!`);
      _triggerAbilityAnim(defAb, defSide, 'absorb_electric');
      _continueExecution();
      return;
    }
    // Water Absorb / Hydration: absorb WATER, restore ¼ HP
    if (move.type === 'WATER' &&
        (defAb === 'Water Absorb' || defAb === 'Hydration')) {
      const waHeal = Math.max(1, Math.floor(target.hp.max / 4));
      target.hp.current = Math.min(target.hp.max, target.hp.current + waHeal);
      _pushMessage(`${targetName}'s ${defAb} restored its HP!`);
      _triggerAbilityAnim(defAb, defSide, 'absorb_electric'); // blue absorb visual
      _continueExecution();
      return;
    }

    let abilityMult = 1.0;
    // Blaze-family: boost same type when HP ≤ 1/3
    if (hpPct <= 0.333) {
      const blazeAbilities = ['Blaze','Ember Scales','Volcanic Presence','Primordial Flame'];
      const overgrowAbilities = ['Overgrow','Frond Guard','Ancient Growth'];
      const torrentAbilities = ['Torrent','Tidal Force','Deep Current'];
      const swarmAbilities = ['Swarm','Hive Mind','Insect Shell'];
      if (blazeAbilities.includes(atkAb)   && move.type === 'FIRE')     abilityMult = 1.5;
      if (overgrowAbilities.includes(atkAb) && move.type === 'GRASS')   abilityMult = 1.5;
      if (torrentAbilities.includes(atkAb)  && move.type === 'WATER')   abilityMult = 1.5;
      if (swarmAbilities.includes(atkAb)    && move.type === 'BUG')     abilityMult = 1.5;
    }
    // Guts: 1.5× ATK on physical moves when statused
    if (atkAb === 'Guts' && actor.statusEffect && move.category === 'PHYSICAL') abilityMult *= 1.5;
    // Flash Fire active: 1.5× FIRE power after absorbing a FIRE move
    if (actor._flashFireActive && move.type === 'FIRE') abilityMult *= 1.5;
    // ── Attacker ability damage modifiers (A1-batch, per abilityDesc) ──
    if (atkAb === 'Hustle' && move.category === 'PHYSICAL') abilityMult *= 1.5;              // acc penalty in _resolveMoveEffect
    if (atkAb === 'Technician' && (move.power || 0) > 0 && move.power <= 60) abilityMult *= 1.5;
    if (atkAb === 'Ancient Power') abilityMult *= 1.15;                                       // all moves +15%
    if (atkAb === 'Jungle King' && (move.type === 'GRASS' || move.type === 'FIGHTING')) abilityMult *= 1.15;
    if (atkAb === 'Stone Garden' && (move.type === 'ROCK'  || move.type === 'GRASS'))    abilityMult *= 1.15;
    if (atkAb === 'Swamp King'  && (move.type === 'WATER' || move.type === 'GROUND'))    abilityMult *= 1.15;
    if (atkAb === 'Sand Force' && _battle.weather === 'SANDSTORM' &&
        (move.type === 'ROCK' || move.type === 'GROUND' || move.type === 'STEEL')) abilityMult *= 1.3;
    if (atkAb === 'Diamond Dome' && move.type === 'ROCK') abilityMult *= 1.2;                 // own Rock moves +20%
    if (atkAb === 'Pixilate' && move.type === 'FAIRY') { /* power already boosted in the clone above */ }

    // Defender ability modifiers
    let defAbilityMult = 1.0;
    const thickFatAbilities = ['Thick Fat','Insulated','Thermal Shell'];
    if (thickFatAbilities.includes(defAb) && (move.type === 'FIRE' || move.type === 'ICE')) defAbilityMult = 0.5;
    if (defAb === 'Immovable' && move.type === 'ROCK') defAbilityMult *= 0.75;   // incoming Rock -25%
    if (atkAb === 'Mold Breaker') defAbilityMult = 1.0;                          // ignore defender ability mods

    // Held item bonuses
    let heldMult = 1.0;
    if (actor.heldItem === 'LIFE_ORB') heldMult *= 1.3;
    if (actor.heldItem === 'CHOICE_BAND' && move.category === 'PHYSICAL') heldMult *= 1.5;
    if (actor.heldItem === 'CHOICE_SPECS' && move.category === 'SPECIAL')  heldMult *= 1.5;

    const totalAtkerMult = abilityMult * heldMult * (actor._rolloutMult || 1);

    // ONE_HIT_KO: bypasses damage formula entirely
    if (effType === 'ONE_HIT_KO') {
      if (actor.level < target.level) {
        _pushMessage(`But it failed!`);
        _continueExecution();
        return;
      }
      target.hp.current = 0;
      _pushMessage(`It's a one-hit KO!`);
      _checkFaints();
      return;
    }

    // Multi-hit: pre-calculate per-hit damages, then queue each as a deferred damage action
    // so the HP bar drops one step per hit rather than all at once at the end.
    let actualDamage = 0;
    let totalHits = 1;
    let effectiveness = 1;
    let crit = false;
    let dmgDeferred = false;  // true when damage has been placed in _msgDamageQueue

    if (effType === 'MULTI') {
      // Accept both data conventions: eff.hits:[min,max] OR eff.min/eff.max.
      const hitsRange = eff.hits || [eff.min || 2, eff.max || 5];
      const r = Math.random();
      // Distribution: 2×=35%, 3×=35%, 4×=15%, 5×=15%
      if      (r < 0.35)  totalHits = hitsRange[0];
      else if (r < 0.70)  totalHits = Math.min(hitsRange[1], hitsRange[0] + 1);
      else if (r < 0.85)  totalHits = Math.min(hitsRange[1], hitsRange[0] + 2);
      else                totalHits = hitsRange[1];

      const targetHpBefore   = target.hp.current;
      const targetWasFullHP  = (targetHpBefore === target.hp.max);

      // ── Phase 1: calculate all hit damages upfront ──────────
      const hitDamages = [];
      let landedHits   = 0;
      let cumulDamage  = 0;

      for (let h = 0; h < totalHits; h++) {
        const res = DG.TypeChart.calcDamage(actor, target, move, statStages, {
          weather: _battle.weather,
          abilityMult: totalAtkerMult,
          defAbilityMult,
          critStage: (atkAb === "Predator's Mind") ? 1 : 0,
        });
        _abilityDefPost(res, target, defAb, atkAb);
        if (res.effectiveness === 0) break;       // immune — stop immediately
        effectiveness = res.effectiveness;
        if (res.crit) crit = true;
        hitDamages.push(res.damage);
        cumulDamage += res.damage;
        landedHits++;
        if (cumulDamage >= targetHpBefore) break; // would faint — no further hits
      }
      totalHits    = landedHits;
      actualDamage = cumulDamage;

      // ── Phase 2: Sturdy / Focus Sash — adjust last hit so total leaves 1 HP ──
      if (hitDamages.length > 0 && actualDamage >= targetHpBefore) {
        if ((defAb === 'Sturdy' || defAb === 'Shell Armor' || defAb === 'Endure Body') && targetWasFullHP) {
          const excess = actualDamage - (targetHpBefore - 1);
          hitDamages[hitDamages.length - 1] = Math.max(0, hitDamages[hitDamages.length - 1] - excess);
          actualDamage = targetHpBefore - 1;
          // Sturdy message queued after the hit messages below
          _triggerAbilityAnim(defAb, defSide, 'sturdy');
          // store for post-queue push
          hitDamages._sturdyMsg = `${targetName} held on with ${defAb}!`;
        } else if (target.heldItem === 'FOCUS_SASH' && targetWasFullHP && !target._sashUsed) {
          const excess = actualDamage - (targetHpBefore - 1);
          hitDamages[hitDamages.length - 1] = Math.max(0, hitDamages[hitDamages.length - 1] - excess);
          actualDamage = targetHpBefore - 1;
          target._sashUsed = true;
          hitDamages._sturdyMsg = `${targetName}s Focus Sash let it survive!`;
        } else if (defAb === 'Immortal Flame' && !target._immortalUsed) {
          // Survive one lethal hit per battle at 1 HP, then scorch the attacker.
          const excess = actualDamage - (targetHpBefore - 1);
          hitDamages[hitDamages.length - 1] = Math.max(0, hitDamages[hitDamages.length - 1] - excess);
          actualDamage = targetHpBefore - 1;
          target._immortalUsed = true;
          hitDamages._sturdyMsg = `${targetName}'s Immortal Flame refused to go out!`;
          const ifBurst = Math.max(1, Math.floor(actor.hp.max / 8));
          actor.hp.current = Math.max(0, actor.hp.current - ifBurst);
          _pushMessage(`${actorName} was scorched by the fire burst!`);
        } else if (defAb === 'Time Lock' && !target._timeLockUsed) {
          // Once per battle: instead of fainting, time rewinds to half HP.
          const half = Math.max(1, Math.floor(target.hp.max / 2));
          const excess = actualDamage - (targetHpBefore - half);
          hitDamages[hitDamages.length - 1] = Math.max(0, hitDamages[hitDamages.length - 1] - excess);
          actualDamage = Math.max(0, targetHpBefore - half);
          target._timeLockUsed = true;
          hitDamages._sturdyMsg = `${targetName}'s Time Lock turned back time — it returned at half HP!`;
        }
      }

      // ── Phase 3: Queue each hit — animation + message paired with deferred damage ──
      hitDamages.forEach((dmg, i) => {
        if (typeof DG.BattleAnim !== 'undefined') {
          DG.BattleAnim.trigger(move.type, isPlayer, move.category, move.animStyle, move.power, move.id);
        }
        _pushMessage(`Hit ${i + 1}!`, { target, damage: dmg });
      });
      if (hitDamages._sturdyMsg) _pushMessage(hitDamages._sturdyMsg);

      dmgDeferred = true; // damage already staged in _msgDamageQueue — skip generic apply
    } else {
      const res = DG.TypeChart.calcDamage(actor, target, move, statStages, {
        weather: _battle.weather,
        abilityMult: totalAtkerMult,
        defAbilityMult,
        critStage: (atkAb === "Predator's Mind") ? 1 : 0,
      });
      _abilityDefPost(res, target, defAb, atkAb);
      effectiveness = res.effectiveness;
      crit = res.crit;
      actualDamage = res.damage;
    }

    if (effectiveness === 0) {
      _pushMessage(`It had no effect!`);
      _continueExecution();
      return;
    }

    // Battle Armor / Shell Helm / Carapace: no critical hits
    if (crit && (defAb === 'Battle Armor' || defAb === 'Shell Helm' || defAb === 'Carapace')) {
      crit = false;
    }

    if (crit) {
      _pushMessage(`A critical hit!`);
      if (typeof DG.BattleAnim !== 'undefined' && DG.BattleAnim.triggerCritHit) {
        try { DG.BattleAnim.triggerCritHit(isPlayer ? 'enemy' : 'player'); } catch(e) {}
      }
    }
    const effLabel = DG.TypeChart.effectivenessLabel(effectiveness);
    if (effLabel && effLabel !== 'It had no effect!') {
      _pushMessage(effLabel);
      // Visual effectiveness flash on defender's side
      if (typeof DG.BattleAnim !== 'undefined' && DG.BattleAnim.triggerEffFlash) {
        try { DG.BattleAnim.triggerEffFlash(effectiveness, isPlayer ? 'enemy' : 'player'); } catch(e) {}
      }
    }
    if (totalHits > 1) _pushMessage(`Hit ${totalHits} times!`);

    if (!dmgDeferred) {
      // Sturdy / Focus Sash: survive a OHKO from full HP (single-hit moves only)
      const targetFullHP = target.hp.current === target.hp.max;
      if (actualDamage >= target.hp.current) {
        if ((defAb === 'Sturdy' || defAb === 'Shell Armor' || defAb === 'Endure Body') && targetFullHP) {
          actualDamage = target.hp.current - 1;
          _pushMessage(`${targetName} held on with ${defAb}!`);
          _triggerAbilityAnim(defAb, defSide, 'sturdy');
        } else if (target.heldItem === 'FOCUS_SASH' && targetFullHP && !target._sashUsed) {
          actualDamage = target.hp.current - 1;
          target._sashUsed = true;
          _pushMessage(`${targetName}'s Focus Sash let it survive!`);
        } else if (defAb === 'Immortal Flame' && !target._immortalUsed) {
          actualDamage = target.hp.current - 1;
          target._immortalUsed = true;
          _pushMessage(`${targetName}'s Immortal Flame refused to go out!`);
          const ifBurst = Math.max(1, Math.floor(actor.hp.max / 8));
          actor.hp.current = Math.max(0, actor.hp.current - ifBurst);
          _pushMessage(`${actorName} was scorched by the fire burst!`);
        } else if (defAb === 'Time Lock' && !target._timeLockUsed) {
          const half = Math.max(1, Math.floor(target.hp.max / 2));
          actualDamage = Math.max(0, target.hp.current - half);
          target._timeLockUsed = true;
          _pushMessage(`${targetName}'s Time Lock turned back time — it returned at half HP!`);
        }
      }
      target.hp.current = Math.max(0, target.hp.current - actualDamage);
      // FASE 1: opspringend schadegetal boven het doelwit
      if (typeof DG.BattleAnim !== 'undefined' && DG.BattleAnim.popDamage) {
        const dmgKind = crit ? 'crit'
                      : effectiveness > 1 ? 'super'
                      : effectiveness < 1 ? 'weak' : 'normal';
        try { DG.BattleAnim.popDamage(actualDamage, !isPlayer, dmgKind); } catch(e) {}
      }
    }

    // Recoil
    if ((effType === 'RECOIL' || isStruggle) && atkAb !== 'Rock Head' && atkAb !== 'Reckless Shield') {
      const fraction = eff.fraction || 0.25;
      const recoil = Math.max(1, Math.floor(actualDamage * fraction));
      actor.hp.current = Math.max(0, actor.hp.current - recoil);
      if (typeof DG.BattleAnim !== 'undefined' && DG.BattleAnim.popDamage) {
        try { DG.BattleAnim.popDamage(recoil, isPlayer, 'recoil'); } catch(e) {}
      }
      _pushMessage(`${actorName} was hurt by recoil!`);
    }

    // Life Orb recoil (10% max HP)
    if (actor.heldItem === 'LIFE_ORB' && !isStruggle) {
      const lorRecoil = Math.max(1, Math.floor(actor.hp.max / 10));
      actor.hp.current = Math.max(0, actor.hp.current - lorRecoil);
    }

    // Drain
    if (effType === 'DRAIN') {
      const fraction = eff.fraction || 0.5;
      const heal = Math.max(1, Math.floor(actualDamage * fraction));
      actor.hp.current = Math.min(actor.hp.max, actor.hp.current + heal);
      if (typeof DG.BattleAnim !== 'undefined' && DG.BattleAnim.popDamage) {
        try { DG.BattleAnim.popDamage(heal, isPlayer, 'heal'); } catch(e) {}
      }
      _pushMessage(`${actorName} drained energy!`);
    }

    // Shell Bell: heal 1/8 of damage dealt
    if (actor.heldItem === 'SHELL_BELL' && actualDamage > 0) {
      const heal = Math.max(1, Math.floor(actualDamage / 8));
      actor.hp.current = Math.min(actor.hp.max, actor.hp.current + heal);
    }

    // Rocky Helmet: attacker takes 1/6 HP damage on contact
    if (target.heldItem === 'ROCKY_HELMET' && move.category === 'PHYSICAL' && actor.hp.current > 0) {
      const helmDmg = Math.max(1, Math.floor(target.hp.max / 6));
      actor.hp.current = Math.max(0, actor.hp.current - helmDmg);
      _pushMessage(`${actorName} was hurt by Rocky Helmet!`);
    }

    // Lum Berry: auto-cure status on holder
    if (target.heldItem === 'LUM_BERRY' && target.statusEffect && target.hp.current > 0) {
      DG.StatusEffects.cure(target, 'ALL');
      target.heldItem = null;
      _pushMessage(`${targetName}'s Lum Berry cured its status!`);
    }

    // Secondary: Status chance (Corrosion may poison even Steel/Poison types)
    const _corr = (atkAb === 'Corrosion');
    if (effType === 'STATUS_CHANCE' && Math.random() * 100 < (eff.chance || 30)) {
      const _st = eff.status || 'BURN';
      _tryApplyStatus(target, _st, _corr && (_st === 'POISON' || _st === 'BADPOISON'));
    }
    // Secondary: status via alias type names (BURN_CHANCE/FREEZE_CHANCE/POISON_CHANCE/PARALYSIS/SLEEP)
    if (_STATUS_ALIAS[effType] && Math.random() * 100 < (eff.chance || 30)) {
      const _st2 = _STATUS_ALIAS[effType];
      _tryApplyStatus(target, _st2, _corr && _st2 === 'POISON');
    }

    // Secondary: Flinch (only if target hasn't moved yet this turn; Immovable is immune)
    if (effType === 'FLINCH' && Math.random() * 100 < (eff.chance || 30)) {
      if (defAb === 'Immovable') _pushMessage(`${targetName} is Immovable — it can't flinch!`);
      else target._flinched = true;
    }

    // Corrosive Ground: Ground moves always lower the target's Defense by 1.
    if (atkAb === 'Corrosive Ground' && move.type === 'GROUND' && target.hp.current > 0) {
      const cgStages = isPlayer ? _battle.enemyStages : _battle.playerStages;
      _applyStageDelta(cgStages, 'def', -1, targetName, target);
    }
    // Tidal Surge: Water moves deal an extra splash hit at 30% power.
    if (atkAb === 'Tidal Surge' && move.type === 'WATER' && actualDamage > 0 && target.hp.current > 0) {
      const splash = Math.max(1, Math.floor(actualDamage * 0.3));
      target.hp.current = Math.max(0, target.hp.current - splash);
      _pushMessage(`A tidal splash hit ${targetName} again!`);
    }
    // Magma Armor: being hit by a Fire move raises Defense.
    if (defAb === 'Magma Armor' && move.type === 'FIRE' && target.hp.current > 0) {
      const maStages = isPlayer ? _battle.enemyStages : _battle.playerStages;
      _applyStageDelta(maStages, 'def', 1, targetName);
    }

    // Secondary: Stat lower on target or self
    if (effType === 'STAT_LOWER' && Math.random() * 100 < (eff.chance || 100)) {
      if (eff.target === 'self') {
        const selfStages = isPlayer ? _battle.playerStages : _battle.enemyStages;
        _applyStageDelta(selfStages, eff.stat || 'def', eff.stages || -1, actorName);
      } else {
        const tgtStages = isPlayer ? _battle.enemyStages : _battle.playerStages;
        _applyStageDelta(tgtStages, eff.stat || 'def', eff.stages || -1, targetName, target);
      }
    }

    // Secondary: Stat raise on self
    if (effType === 'STAT_RAISE' && eff.target === 'self' && Math.random() * 100 < (eff.chance || 100)) {
      const selfStages = isPlayer ? _battle.playerStages : _battle.enemyStages;
      _applyMultiStatRaise(selfStages, eff, actorName);
    }

    // Secondary: Confuse (target 'self' for moves like Outrage; otherwise target opponent)
    if (effType === 'CONFUSE' && Math.random() * 100 < (eff.chance || 30)) {
      const confTarget = (eff.target === 'self') ? actor : target;
      const confRes = DG.StatusEffects.applyConfusion(confTarget);
      if (confRes.applied) _pushMessage(confRes.message);
    }

    // Recharge next turn (Hyper Beam)
    if (effType === 'RECHARGE') {
      actor._rechargeNext = true;
    }

    // OMNI_RAISE: chance to raise all stats at once (Ancient Power)
    if (effType === 'OMNI_RAISE' && Math.random() * 100 < (eff.chance || 10)) {
      const selfStages = isPlayer ? _battle.playerStages : _battle.enemyStages;
      for (const s of ['atk','def','spAtk','spDef','spd']) {
        _applyStageDelta(selfStages, s, 1, actorName);
      }
    }

    // ── Priority A: Contact-triggered defender abilities ─────────────────
    if (move.category === 'PHYSICAL' && !isStruggle && actor.hp.current > 0 && target.hp.current > 0) {
      // Ember Scales / Flame Body: 10% burn attacker
      if ((defAb === 'Ember Scales' || defAb === 'Flame Body') && !actor.statusEffect) {
        if (Math.random() < 0.10) {
          _tryApplyStatus(actor, 'BURN');
          _triggerAbilityAnim(defAb, defSide, 'burn');
        }
      }
      // Static / Charge Body: 30% paralyze attacker
      if ((defAb === 'Static' || defAb === 'Charge Body') && !actor.statusEffect) {
        if (Math.random() < 0.30) {
          _tryApplyStatus(actor, 'PARALYSIS');
          _triggerAbilityAnim(defAb, defSide, 'paralysis');
        }
      }
      // Poison Point / Toxic Spines: 30% poison attacker
      if ((defAb === 'Poison Point' || defAb === 'Toxic Spines' || defAb === 'Venom Coat') && !actor.statusEffect) {
        if (Math.random() < 0.30) {
          _tryApplyStatus(actor, 'POISON');
          _triggerAbilityAnim(defAb, defSide, 'poison');
        }
      }
      // Rough Skin / Iron Barbs / Spiny Hide: attacker takes 1/8 HP
      if (defAb === 'Rough Skin' || defAb === 'Iron Barbs' || defAb === 'Spiny Hide') {
        const rsDmg = Math.max(1, Math.floor(actor.hp.max / 8));
        actor.hp.current = Math.max(0, actor.hp.current - rsDmg);
        _pushMessage(`${actorName} was hurt by ${defAb}!`);
        _triggerAbilityAnim(defAb, defSide, 'contact_damage');
      }
      // Absolute Zero: 20% chance to freeze attackers on contact
      if (defAb === 'Absolute Zero' && !actor.statusEffect) {
        if (Math.random() < 0.20) {
          _tryApplyStatus(actor, 'FREEZE');
          _triggerAbilityAnim(defAb, defSide, 'freeze');
        }
      }
      // Cute Charm / Allure: 30% infatuate attacker
      if ((defAb === 'Cute Charm' || defAb === 'Allure') && !actor._infatuated) {
        if (Math.random() < 0.30) {
          actor._infatuated = true;
          _pushMessage(`${actorName} fell for ${targetName}'s ${defAb}!`);
          _triggerAbilityAnim(defAb, defSide, 'charm');
        }
      }
    }

    // Poison Touch / Venom Grip (attacker): 30% poison target on physical contact
    if (move.category === 'PHYSICAL' && !isStruggle && target.hp.current > 0 && !target.statusEffect) {
      if (atkAb === 'Poison Touch' || atkAb === 'Venom Grip') {
        if (Math.random() < 0.30) {
          _tryApplyStatus(target, 'POISON');
          _triggerAbilityAnim(atkAb, actSide, 'poison');
        }
      }
    }

    // ── Priority C: Moxie / Beast Boost — +1 Atk after KO ──────────────
    if (target.hp.current <= 0 && actor.hp.current > 0) {
      if (atkAb === 'Moxie' || atkAb === 'Dominate' || atkAb === 'Kill Drive') {
        const moxStages = isPlayer ? _battle.playerStages : _battle.enemyStages;
        _applyStageDelta(moxStages, 'atk', 1, actorName);
        _triggerAbilityAnim(atkAb, actSide, 'moxie');
      }
    }

    _checkFaints();
  }

  function _applyStatusMove(isPlayer, actor, target, move, actorStages, targetStages) {
    const actorName  = _monName(actor);
    const targetName = _monName(target);

    const eff = move.effect || {};
    const effType = eff.type || 'NONE';
    const tgt = eff.target || 'opponent'; // 'self' or 'opponent'

    if (effType === 'STAT_RAISE') {
      // target can be 'self' or 'opponent'
      const stages = (tgt === 'self')
        ? (isPlayer ? _battle.playerStages : _battle.enemyStages)
        : (isPlayer ? _battle.enemyStages  : _battle.playerStages);
      const monName = (tgt === 'self') ? actorName : targetName;
      _applyMultiStatRaise(stages, eff, monName);
    } else if (effType === 'STAT_LOWER') {
      const stages = isPlayer ? _battle.enemyStages : _battle.playerStages;
      _applyStageDelta(stages, eff.stat || 'def', eff.stages || -1, targetName, target);
    } else if (effType === 'STATUS_CHANCE') {
      _tryApplyStatus(target, eff.status || 'BURN');
    } else if (effType === 'HEAL') {
      const fraction = eff.fraction || 0.5;
      const heal = Math.max(1, Math.floor(actor.hp.max * fraction));
      actor.hp.current = Math.min(actor.hp.max, actor.hp.current + heal);
      _pushMessage(`${actorName} restored HP!`);
    } else if (effType === 'CONFUSE') {
      const confRes = DG.StatusEffects.applyConfusion(target);
      if (confRes.applied) _pushMessage(confRes.message);
      else _pushMessage(`But it failed!`);
    } else if (effType === 'SET_WEATHER') {
      _setWeather(eff.weather);
    } else if (effType === 'LEECH_SEED') {
      // Grass-types are immune
      const defSp = DG.SPECIES[target.speciesId];
      if (defSp && defSp.types && defSp.types.includes('GRASS')) {
        _pushMessage(`It doesn't affect ${_monName(target)}!`);
      } else if (target._seeded) {
        _pushMessage(`But it failed!`);
      } else {
        target._seeded = true;
        _pushMessage(`${_monName(target)} was seeded!`);
      }
    } else if (effType === 'STEALTH_ROCK') {
      // Place rocks on the opponent's side
      const hazards = isPlayer
        ? (_battle.enemyHazards  = _battle.enemyHazards  || [])
        : (_battle.playerHazards = _battle.playerHazards || []);
      if (hazards.includes('STEALTH_ROCK')) {
        _pushMessage(`But it failed!`);
      } else {
        hazards.push('STEALTH_ROCK');
        const side = isPlayer ? `the foe's` : `your`;
        _pushMessage(`Pointed stones float around ${side} team!`);
      }
    } else if (effType === 'OMNI_RAISE') {
      // Status-move variant (Clangorous Soul-achtig): alle stats van de gebruiker +1
      const omniStages = isPlayer ? _battle.playerStages : _battle.enemyStages;
      for (const s of ['atk','def','spAtk','spDef','spd']) _applyStageDelta(omniStages, s, eff.stages || 1, actorName);
    } else if (_STATUS_ALIAS[effType]) {
      // Status-category move that inflicts a status (e.g. Spore→SLEEP, Stun Spore→PARALYSIS)
      if (Math.random() * 100 < (eff.chance || 100)) _tryApplyStatus(target, _STATUS_ALIAS[effType]);
      else _pushMessage(`But it failed!`);
    } else if (effType === 'STAT') {
      // Lower/raise a target stat incl. accuracy/evasion (e.g. Flash → -accuracy)
      const stStages = (tgt === 'self')
        ? (isPlayer ? _battle.playerStages : _battle.enemyStages)
        : (isPlayer ? _battle.enemyStages  : _battle.playerStages);
      const statKey = ({ accuracy:'acc', evasion:'eva' })[eff.stat] || eff.stat || 'acc';
      _applyStageDelta(stStages, statKey, (eff.stages !== undefined ? eff.stages : -1), (tgt === 'self') ? actorName : targetName, (tgt === 'self') ? actor : target);
    } else if (effType === 'NONE') {
      _pushMessage(`But it failed!`);
    } else {
      _pushMessage(`But it failed!`);
    }

    _continueExecution();
  }

  // ── WEATHER ───────────────────────────────────────────────
  function _setWeather(weatherType, turns) {
    if (!weatherType) return;
    _battle.weather = weatherType;
    _battle.weatherTurns = (turns !== undefined) ? turns : 5;
    const msgs = {
      RAIN:      `It started to rain!`,
      SUN:       `The sunlight turned harsh!`,
      SANDSTORM: `A sandstorm kicked up!`,
      HAIL:      `It started to hail!`,
    };
    _pushMessage(msgs[weatherType] || `Weather changed!`);
  }

  // ── ABILITY ON ENTRY ──────────────────────────────────────
  function _abilityOnEntry(mon, monIsPlayer) {
    if (!_battle) return;
    const sp = DG.SPECIES[mon.speciesId];
    if (!sp || !sp.ability) return;
    const ab = sp.ability;

    // Weather-setting abilities (permanent — turns=0)
    if (ab === 'Sand Stream' || ab === 'Sand Veil')  _setWeather('SANDSTORM', 0);
    if (ab === 'Drizzle'     || ab === 'Rain Call')  _setWeather('RAIN', 0);
    if (ab === 'Drought'     || ab === 'Sun Summon') _setWeather('SUN', 0);
    if (ab === 'Snow Warning'|| ab === 'Ice Coat' || ab === 'Summons Hail when entering battle') _setWeather('HAIL', 0);

    // Intimidate: lower opponent's ATK by 1 stage
    if (ab === 'Intimidate' || ab === 'Alpha Roar') {
      const oppStages = monIsPlayer ? _battle.enemyStages  : _battle.playerStages;
      const opponent  = monIsPlayer ? _battle.enemyMon     : _battle.playerMon;
      const side = monIsPlayer ? 'player' : 'enemy';
      if (opponent && opponent.hp.current > 0) {
        _applyStageDelta(oppStages, 'atk', -1, _monName(opponent), opponent);
        _pushMessage(`${_monName(mon)}'s ${ab} lowered ${_monName(opponent)}'s attack!`);
        _triggerAbilityAnim(ab, side, 'intimidate');
      }
    }

    // Apex Predator: at battle start, lowers ALL of the opponent's stats by 1 (once).
    if (ab === 'Apex Predator') {
      const apKey = monIsPlayer ? '_apexDonePlayer' : '_apexDoneEnemy';
      if (!_battle[apKey]) {
        _battle[apKey] = true;
        const oppStages = monIsPlayer ? _battle.enemyStages : _battle.playerStages;
        const opponent  = monIsPlayer ? _battle.enemyMon    : _battle.playerMon;
        if (opponent && opponent.hp.current > 0) {
          _pushMessage(`${_monName(mon)}'s Apex Predator radiates dominance!`);
          ['atk','def','spAtk','spDef','spd'].forEach(s => _applyStageDelta(oppStages, s, -1, _monName(opponent), opponent));
          _triggerAbilityAnim(ab, monIsPlayer ? 'player' : 'enemy', 'intimidate');
        }
      }
    }

    // Herd Leader: boosts own Attack when entering battle as the last one standing.
    if (ab === 'Herd Leader') {
      const party = monIsPlayer ? _battle.playerParty : _battle.enemyParty;
      const aliveOthers = (party || []).filter(m => m && m !== mon && m.hp.current > 0).length;
      if (aliveOthers === 0) {
        const ownStages = monIsPlayer ? _battle.playerStages : _battle.enemyStages;
        _pushMessage(`${_monName(mon)} leads the herd alone — its Attack rose!`);
        _applyStageDelta(ownStages, 'atk', 1, _monName(mon));
      }
    }
  }

  // Weather-speed abilities double Speed in their matching weather (turn order).
  function _abilitySpeedMult(mon) {
    if (!_battle || !_battle.weather || !mon) return 1;
    const ab = (DG.SPECIES[mon.speciesId] || {}).ability, w = _battle.weather;
    if (ab === 'Chlorophyll' && w === 'SUN')                      return 2;
    if (ab === 'Swift Swim'  && w === 'RAIN')                     return 2;
    if (ab === 'Sand Rush'   && w === 'SANDSTORM')                return 2;
    if (ab === 'Slush Rush'  && (w === 'HAIL' || w === 'SNOW'))   return 2;
    return 1;
  }

  // ── ENEMY SWITCH (mid-battle AI switch) ──────────────────
  function _doEnemySwitch(act) {
    const newMon = _battle.enemyParty[act.targetIndex];
    if (!newMon || newMon.hp.current <= 0) {
      _continueExecution();
      return;
    }
    const oldName = _monName(_battle.enemyMon);
    _clearLocks(_battle.enemyMon);
    _battle.enemyMon = newMon;
    _battle.enemyPartyIndex = act.targetIndex;   // houd index in sync met de actieve mon
    _clearLocks(newMon);
    DG.SaveLoad.markSeen(_battle.gameState, newMon.speciesId);
    _battle.enemyStages = { atk:0, def:0, spAtk:0, spDef:0, spd:0, acc:0, eva:0 };
    _applyEntryHazards(newMon, false);
    const tName = _battle.trainerData?.name || 'Trainer';
    _pushMessage(`${tName} withdrew ${oldName}!`);
    _pushMessage(`${tName} sent out ${_monName(newMon)}!`);
    // Enemy ball throw animation
    if (typeof DG.BattleAnim !== 'undefined') {
      try { DG.BattleAnim.triggerEnemySwitchIn(); } catch(e) {}
    }
    _abilityOnEntry(newMon, false);
    _continueExecution();
  }

  // Result-dependent defender ability modifiers, applied to a calcDamage result
  // in place (crit-, effectiveness- and HP-conditional — can't go into defAbilityMult).
  function _abilityDefPost(res, target, defAb, atkAb) {
    if (!res || res.damage <= 0 || atkAb === 'Mold Breaker') return;
    let d = res.damage;
    if (defAb === 'Filter' && res.effectiveness > 1) d = Math.floor(d * 0.75);        // super-effective -25%
    if (defAb === 'Shadow Shield' && target.hp.current === target.hp.max) d = Math.floor(d * 0.5); // half at full HP
    if (defAb === 'Primordial Fortress') {                                            // all damage halved, no crits
      d = Math.floor(d * 0.5);
      if (res.crit) { d = Math.floor(d / 1.5); res.crit = false; }
    }
    if (defAb === 'Diamond Dome' && res.crit) d = Math.floor(d * 0.5);                // crits -50%
    res.damage = Math.max(1, d);
  }

  function _tryApplyStatus(mon, status, force) {
    if (!status) return;
    // Ability-based status immunities (bypassed by Corrosion's force flag for poison)
    const _ab = (DG.SPECIES[mon.speciesId] || {}).ability;
    if (status === 'PARALYSIS' && _ab === 'Limber') {
      _pushMessage(`${_monName(mon)}'s Limber prevents paralysis!`); return;
    }
    if (status === 'BURN' && _ab === 'Magma Armor') {
      _pushMessage(`${_monName(mon)}'s Magma Armor prevents burns!`); return;
    }
    const res = DG.StatusEffects.apply(mon, DG.STATUS[status] || status, force);
    if (res.message) _pushMessage(res.message);
  }

  // ── ABILITY ANIM HELPER ───────────────────────────────────
  // Fires triggerAbilityFlash safely with an optional extra payload (e.g. typeColor).
  function _triggerAbilityAnim(abilityName, side, effectType, extra) {
    try {
      if (typeof DG.BattleAnim !== 'undefined' && DG.BattleAnim.triggerAbilityFlash) {
        DG.BattleAnim.triggerAbilityFlash(abilityName, side, effectType || 'entry', extra);
      }
    } catch(e) {}
  }

  function _applyStageDelta(stages, statName, delta, monName, mon) {
    const stat = statName || 'atk';
    // Keen Eye: accuracy can't be lowered by the opponent
    if (mon && stat === 'acc' && delta < 0 && ((DG.SPECIES[mon.speciesId] || {}).ability) === 'Keen Eye') {
      _pushMessage(`${monName}'s Keen Eye prevents accuracy loss!`); return;
    }
    // Ancient Power: immune to stat drops from foes (mon is only passed on foe-directed calls)
    if (mon && delta < 0 && ((DG.SPECIES[mon.speciesId] || {}).ability) === 'Ancient Power') {
      _pushMessage(`${monName}'s Ancient Power shrugged off the stat drop!`); return;
    }
    const cur = stages[stat] || 0;
    const newVal = Math.max(-6, Math.min(6, cur + delta));
    stages[stat] = newVal;
    const diff = newVal - cur;
    if (diff === 0) {
      _pushMessage(`${monName}'s ${stat} won't go any further!`);
    } else if (diff > 0) {
      _pushMessage(`${monName}'s ${stat} rose!`);
    } else {
      _pushMessage(`${monName}'s ${stat} fell!`);
    }
  }

  // Raise one or many stats at once (handles both eff.stat and eff.stats array)
  function _applyMultiStatRaise(stages, eff, monName) {
    const statsToRaise = eff.stats || (eff.stat ? [eff.stat] : ['atk']);
    for (const s of statsToRaise) {
      _applyStageDelta(stages, s, eff.stages || 1, monName);
    }
  }

  // Apply entry hazard damage (Stealth Rock etc.) to a mon switching in
  function _applyEntryHazards(mon, monIsPlayer) {
    if (!_battle || !mon || mon.hp.current <= 0) return;
    const hazards = monIsPlayer ? (_battle.playerHazards || []) : (_battle.enemyHazards || []);
    if (hazards.includes('STEALTH_ROCK')) {
      const sp = DG.SPECIES && DG.SPECIES[mon.speciesId];
      const types = sp ? (sp.types || []) : [];
      const eff = (typeof DG.TypeChart !== 'undefined') ? DG.TypeChart.getEffectiveness('ROCK', types) : 1;
      const dmg = Math.max(1, Math.floor(mon.hp.max * eff / 8));
      mon.hp.current = Math.max(0, mon.hp.current - dmg);
      _pushMessage(`${_monName(mon)} was hurt by the stealth rocks!`);
    }
  }

  function _continueExecution() {
    _state = BS.EXECUTE;
    // Next tick will call _tickExecute again via message drain
  }

  function _checkFaints() {
    _state = BS.FAINT_CHECK;
  }

  // ── FAINT CHECK ───────────────────────────────────────────
  function _tickFaintCheck() {
    if (_battle.isDouble) { return _tickDoubleFaintCheck(); }
    const playerFainted = _battle.playerMon.hp.current <= 0;
    const enemyFainted  = _battle.enemyMon.hp.current  <= 0;

    if (!playerFainted && !enemyFainted) {
      // If turn queue still has items, continue processing; otherwise wait for next player input
      _state = (_battle.turnQueue && _battle.turnQueue.length > 0) ? BS.EXECUTE : BS.PLAYER_INPUT;
      return;
    }

    // Trigger faint animation before showing dialogue
    if (typeof DG.BattleAnim !== 'undefined' && DG.BattleAnim.triggerFaint) {
      try {
        if (enemyFainted)  DG.BattleAnim.triggerFaint('enemy');
        if (playerFainted) DG.BattleAnim.triggerFaint('player');
      } catch(e) {}
    }

    _state = BS.FAINT_ANIM;
  }

  // Wait for faint animation to finish, then push messages and proceed
  function _tickFaintAnim() {
    const BA = (typeof DG.BattleAnim !== 'undefined') ? DG.BattleAnim : null;
    if (BA && BA.isFainting && BA.isFainting()) return; // still animating

    const playerFainted = _battle.playerMon.hp.current <= 0;
    const enemyFainted  = _battle.enemyMon.hp.current  <= 0;

    _state = BS.FAINT_HANDLER;

    if (enemyFainted) {
      _pushMessage(`${_monName(_battle.enemyMon)} fainted!`);
      _grantExp();
    }
    if (playerFainted) {
      _pushMessage(`${_monName(_battle.playerMon)} fainted!`);
    }
  }

  // ── FAINT HANDLER ─────────────────────────────────────────
  function _tickFaintHandler() {
    // NB: een EI telt niet als levende mon — anders geen blackout terwijl je ook
    // niet kunt wisselen (eeuwig vast in het switch-scherm; fuzz-vondst it.8).
    const playerAlive = _battle.playerParty.some(m => m && !m.isEgg && m.hp.current > 0);
    const enemyAlive  = _battle.enemyParty.some(m  => m.hp.current > 0);

    // ── All player mons down → black out ─────────────────────
    if (!playerAlive) {
      for (const mon of _battle.playerParty) {
        if (mon && mon.hp.current <= 0 && mon.happiness !== undefined) {
          mon.happiness = Math.max(0, (mon.happiness || 0) - 5);
        }
      }
      _pushMessage(`You blacked out!`);
      _endBattle('LOSE');
      return;
    }

    // ── All enemy mons down → victory ────────────────────────
    if (!enemyAlive) {
      if (_battle.type === 'TRAINER') {
        // Prize money is paid once, in _endBattle (covers single AND double battles).
        _pushMessage(`You defeated ${_battle.trainerData.name}!`);
      }
      _endBattle('WIN');
      return;
    }

    // ── Enemy needs new mon (sequential order: weakest → strongest) ──
    if (_battle.enemyMon.hp.current <= 0 && enemyAlive) {
      if (_battle.type === 'TRAINER') {
        // Send out the FIRST alive party member. Never rely on index+1 alone:
        // an AI mid-battle switch (_doEnemySwitch) desyncs enemyPartyIndex, and
        // index+1 would then skip an alive mon earlier in the array — causing an
        // infinite faint-loop with repeated EXP awards (livelock bug, testloop it.3).
        const aliveIdx = _battle.enemyParty.findIndex(m => m && m.hp.current > 0);
        _battle.enemyPartyIndex = aliveIdx;
        const next = aliveIdx >= 0 ? _battle.enemyParty[aliveIdx] : null;
        if (next && next.hp.current > 0) {
          _battle.enemyMon = next;
          DG.SaveLoad.markSeen(_battle.gameState, next.speciesId);
          _battle.enemyStages = { atk:0, def:0, spAtk:0, spDef:0, spd:0, acc:0, eva:0 };
          _applyEntryHazards(next, false);
          _pushMessage(`${_battle.trainerData.name} sent out ${_monName(next)}!`);
          // Enemy ball throw animation
          if (typeof DG.BattleAnim !== 'undefined') {
            try { DG.BattleAnim.triggerEnemySwitchIn(); } catch(e) {}
          }
          _abilityOnEntry(next, false);
        }
        // Fall through — don't early-return; also handle player if needed
      }
    }

    // ── Player needs to switch (forced, costs no enemy turn) ─
    if (_battle.playerMon.hp.current <= 0) {
      _battle.isForcedSwitch = true;
      _state = BS.PLAYER_INPUT;
      _notifyUI({ event: 'FORCE_SWITCH' });
      return;
    }

    // ── Both resolved — back to player input ─────────────────
    _state = BS.PLAYER_INPUT;
  }

  // ── DOUBLE BATTLE FAINT CHECK ────────────────────────────
  function _tickDoubleFaintCheck() {
    const e1Fainted = !_battle.enemyMon   || _battle.enemyMon.hp.current   <= 0;
    const e2Fainted = !_battle.enemy2Mon  || _battle.enemy2Mon.hp.current  <= 0;
    const pFainted  = !_battle.playerMon  || _battle.playerMon.hp.current  <= 0;
    const aFainted  = !_battle.allyMon    || _battle.allyMon.hp.current    <= 0;

    // Win: both enemy parties exhausted
    if (e1Fainted && e2Fainted) {
      const e1More = _battle.enemyParty.some(m => m && m !== _battle.enemyMon && m.hp.current > 0);
      const e2More = _battle.enemy2Party.some(m => m && m !== _battle.enemy2Mon && m.hp.current > 0);
      if (!e1More && !e2More) {
        _grantExpDouble();
        _endBattle('WIN');
        return;
      }
      // Replace fainted enemy mons
      if (e1Fainted && e1More) {
        const oldMon = _battle.enemyMon;
        const next = _battle.enemyParty.find(m => m && m !== oldMon && m.hp.current > 0);
        if (next) {
          if (oldMon) _pushMessage(`${_monName(oldMon)} fainted!`);
          _pushMessage(`${_battle.trainerData.name} sent out ${_monName(next)}!`);
          _battle.enemyMon = next;
          _battle.enemyStages = { atk:0, def:0, spAtk:0, spDef:0, spd:0, acc:0, eva:0 };
        }
      }
      if (e2Fainted && e2More) {
        const oldMon = _battle.enemy2Mon;
        const next = _battle.enemy2Party.find(m => m && m !== oldMon && m.hp.current > 0);
        if (next) {
          if (oldMon) _pushMessage(`${_monName(oldMon)} fainted!`);
          _pushMessage(`${_battle.enemy2Trainer.name} sent out ${_monName(next)}!`);
          _battle.enemy2Mon = next;
          _battle.enemy2Stages = { atk:0, def:0, spAtk:0, spDef:0, spd:0, acc:0, eva:0 };
        }
      }
    } else {
      // Individual enemy faint messages
      if (e1Fainted && _battle.enemyMon && _battle.enemyMon.hp.current <= 0) {
        const e1More = _battle.enemyParty.some(m => m && m !== _battle.enemyMon && m.hp.current > 0);
        if (e1More) {
          const next = _battle.enemyParty.find(m => m && m !== _battle.enemyMon && m.hp.current > 0);
          if (next) {
            _pushMessage(`${_monName(_battle.enemyMon)} fainted!`);
            _pushMessage(`${_battle.trainerData.name} sent out ${_monName(next)}!`);
            _battle.enemyMon = next;
            _battle.enemyStages = { atk:0, def:0, spAtk:0, spDef:0, spd:0, acc:0, eva:0 };
          }
        }
      }
      if (e2Fainted && _battle.enemy2Mon && _battle.enemy2Mon.hp.current <= 0) {
        const e2More = _battle.enemy2Party.some(m => m && m !== _battle.enemy2Mon && m.hp.current > 0);
        if (e2More) {
          const next = _battle.enemy2Party.find(m => m && m !== _battle.enemy2Mon && m.hp.current > 0);
          if (next) {
            _pushMessage(`${_monName(_battle.enemy2Mon)} fainted!`);
            _pushMessage(`${_battle.enemy2Trainer.name} sent out ${_monName(next)}!`);
            _battle.enemy2Mon = next;
            _battle.enemy2Stages = { atk:0, def:0, spAtk:0, spDef:0, spd:0, acc:0, eva:0 };
          }
        }
      }
    }

    // Auto-replace fainted ally
    if (aFainted) {
      const nextAlly = _battle.allyParty.find(m => m && m !== _battle.allyMon && m.hp.current > 0);
      if (nextAlly) {
        _pushMessage(`${_monName(_battle.allyMon)} fainted!`);
        _pushMessage(`${_battle.allyTrainer.name} sent out ${_monName(nextAlly)}!`);
        _battle.allyMon = nextAlly;
        _allyHPDisplay = null;
        _battle.allyStages = { atk:0, def:0, spAtk:0, spDef:0, spd:0, acc:0, eva:0 };
      }
    }

    // Player fainted — force switch or lose (eggs tellen niet als levend)
    if (pFainted) {
      const hasAlive = _battle.playerParty.some(m => m && !m.isEgg && m.hp.current > 0);
      if (!hasAlive) {
        _pushMessage(`You blacked out!`);
        _endBattle('LOSE');
        return;
      } else {
        _battle.isForcedSwitch = true;
        _state = BS.PLAYER_INPUT;
        _notifyUI({ event: 'FORCE_SWITCH' });
        return;
      }
    }

    // Continue
    if (_battle.turnQueue && _battle.turnQueue.length > 0) {
      _state = BS.EXECUTE;
    } else {
      _state = BS.PLAYER_INPUT;
    }
  }

  function _grantExpDouble() {
    // Give XP to player's mon for all defeated enemies
    const allDefeated = [...(_battle.enemyParty || []), ...(_battle.enemy2Party || [])];
    allDefeated.forEach(enemy => {
      if (!enemy) return;
      const sp = DG.SPECIES && DG.SPECIES[enemy.speciesId];
      if (!sp) return;
      const baseExp = sp.baseExp || 64;
      const xp = Math.floor(baseExp * enemy.level / 7);
      const mon = _battle.playerMon;
      if (mon) {
        mon.exp = (mon.exp || 0) + Math.floor(xp * 0.5);
        _awardEVs(mon, enemy.speciesId);
      }
    });
  }

  // ── END OF TURN (effects only — no state change) ─────────
  // Called by _tickExecute after the turn queue drains.
  // State is set to FAINT_CHECK by _tickExecute BEFORE calling this,
  // so we never touch _state here.
  function _doEndOfTurnEffects() {
    const weather = _battle.weather;

    // Weather progress message
    const _wLabels = {
      SUNNY:'The sunlight is harsh!', SEA_SPRAY:'Salt spray lashes the field!',
      SANDSTORM:'The sandstorm rages!', ASH_FALL:'Volcanic ash rains down!',
      LEAVES:'Spores drift through the air!', WIND_DUST:'Dust-laden winds howl!',
      BLIZZARD:'The blizzard bites!', FOG:'Thick fog clouds vision!',
      THUNDERSTORM:'Lightning crackles through the sky!',
      // legacy
      RAIN:'Rain continues to pour!', SUN:'The sunlight is harsh!', HAIL:'Hail continues to fall!',
    };
    if (weather && _wLabels[weather]) _pushMessage(_wLabels[weather]);

    // Tick weather duration (0 = permanent/indefinite = map weather)
    if (weather && _battle.weatherTurns > 0) {
      _battle.weatherTurns--;
      if (_battle.weatherTurns <= 0) {
        _pushMessage(`The weather returned to normal!`);
        // Restore map ambient weather
        _battle.weather = window.DG_MAP_WEATHER || null;
        _battle.weatherTurns = 0;
      }
    }

    // ── Weather battle effects (damage / heal / status) ────────
    const _wfx = DG.WEATHER_EFFECTS && weather ? DG.WEATHER_EFFECTS[weather] : null;
    if (_wfx) {
      [
        { mon: _battle.playerMon, side: 'player' },
        { mon: _battle.enemyMon,  side: 'enemy'  },
      ].forEach(({ mon, side }) => {
        if (!mon || mon.hp.current <= 0) return;
        // FASE 9 bugfix: heette DG.DINOMONS (bestaat niet) — elke beurt met
        // schade-weer gooide hierdoor een error en brak de end-of-turn af
        const types = ((DG.SPECIES && DG.SPECIES[mon.speciesId]) || {}).types || [];
        const isImmune = types.some(t => (_wfx.immune || []).includes(t));
        const isDamaged = !isImmune && types.some(t => (_wfx.damage || []).includes(t));
        const isHealed  = (_wfx.healTypes || []).length > 0 && types.some(t => (_wfx.healTypes).includes(t));
        if (isDamaged) {
          const dmg = Math.max(1, Math.floor(mon.hp.max / 16));
          mon.hp.current = Math.max(0, mon.hp.current - dmg);
          const wDmgMsgs = {
            BLIZZARD:`The blizzard bites into ${_monName(mon)}!`,
            SANDSTORM:`Sand scours ${_monName(mon)}'s body!`,
            ASH_FALL:`Volcanic ash chokes ${_monName(mon)}!`,
            SEA_SPRAY:`Salt spray stings ${_monName(mon)}!`,
            THUNDERSTORM:`Lightning strikes ${_monName(mon)}!`,
            WIND_DUST:`The howling wind batters ${_monName(mon)}!`,
          };
          _pushMessage(wDmgMsgs[weather] || `${_monName(mon)} is hurt by the weather!`);
        } else if (isHealed && mon.hp.current < mon.hp.max) {
          const heal = Math.max(1, Math.floor(mon.hp.max / 16));
          mon.hp.current = Math.min(mon.hp.max, mon.hp.current + heal);
          const wHealMsgs = {
            SUNNY:`${_monName(mon)} soaks up the warm sunlight!`,
            LEAVES:`${_monName(mon)} absorbs forest energy!`,
          };
          _pushMessage(wHealMsgs[weather] || `${_monName(mon)} recovered a little HP!`);
        }
        // Status chance (e.g. ASH_FALL → 5% poison, THUNDERSTORM → 8% paralysis)
        if (_wfx.statusChance && !mon.statusEffect) {
          for (const [status, prob] of Object.entries(_wfx.statusChance)) {
            if (Math.random() < prob) {
              mon.statusEffect = status;
              const sCauses = {
                POISON:`${_monName(mon)} was poisoned by the toxic ash!`,
                SLEEP:`${_monName(mon)} fell asleep from the spores!`,
                PARALYSIS:`${_monName(mon)} was paralyzed by the lightning!`,
              };
              _pushMessage(sCauses[status] || `${_monName(mon)} was afflicted!`);
              break;
            }
          }
        }
      });
    }

    // Ice Body: heal 1/16 max HP each turn while it's hailing/snowing.
    if (weather === 'HAIL' || weather === 'SNOW') {
      [_battle.playerMon, _battle.enemyMon].forEach(m => {
        if (!m || m.hp.current <= 0) return;
        if (((DG.SPECIES[m.speciesId] || {}).ability) === 'Ice Body' && m.hp.current < m.hp.max) {
          const heal = Math.max(1, Math.floor(m.hp.max / 16));
          m.hp.current = Math.min(m.hp.max, m.hp.current + heal);
          _pushMessage(`${_monName(m)} restored a little HP with Ice Body!`);
        }
      });
    }

    // Status + weather damage — push each message with its matching status animation
    const _triggerStatusAnim = (statusAnim, side) => {
      if (statusAnim && typeof DG.BattleAnim !== 'undefined' && DG.BattleAnim.triggerStatusTick) {
        DG.BattleAnim.triggerStatusTick(statusAnim, side);
      }
    };
    const pMsgs = DG.StatusEffects.endOfTurnTick(_battle.playerMon, weather);
    const eMsgs = DG.StatusEffects.endOfTurnTick(_battle.enemyMon, weather);
    // FASE 9: status-schade ook als opspringend schadegetal (oranje brand,
    // paars gif, grijsblauw overig) — getimed met het bericht via onShow
    const _statusDmgKind = (anim) => anim === 'BURN' ? 'burn'
      : (anim === 'POISON' || anim === 'BADPOISON') ? 'poison' : 'chip';
    pMsgs.forEach(m => {
      if (!m.message) return;
      _pushMessage(m.message, (m.statusAnim || m.damage > 0)
        ? { onShow: () => {
            _triggerStatusAnim(m.statusAnim, 'player');
            if (m.damage > 0 && typeof DG.BattleAnim !== 'undefined' && DG.BattleAnim.popDamage) {
              try { DG.BattleAnim.popDamage(m.damage, true, _statusDmgKind(m.statusAnim)); } catch(e) {}
            }
          } }
        : null);
    });
    eMsgs.forEach(m => {
      if (!m.message) return;
      _pushMessage(m.message, (m.statusAnim || m.damage > 0)
        ? { onShow: () => {
            _triggerStatusAnim(m.statusAnim, 'enemy');
            if (m.damage > 0 && typeof DG.BattleAnim !== 'undefined' && DG.BattleAnim.popDamage) {
              try { DG.BattleAnim.popDamage(m.damage, false, _statusDmgKind(m.statusAnim)); } catch(e) {}
            }
          } }
        : null);
    });

    // Held item: Leftovers (heal 1/16 per turn)
    [{ mon: _battle.playerMon }, { mon: _battle.enemyMon }].forEach(({ mon }) => {
      if (!mon || mon.hp.current <= 0) return;
      if (mon.heldItem === 'LEFTOVERS' && mon.hp.current < mon.hp.max) {
        const heal = Math.max(1, Math.floor(mon.hp.max / 16));
        mon.hp.current = Math.min(mon.hp.max, mon.hp.current + heal);
        _pushMessage(`${_monName(mon)} restored a little HP with Leftovers!`);
      }
    });

    // Leech Seed drain (1/8 max HP per turn)
    const _lsSeeded  = _battle.enemyMon._seeded  ? _battle.enemyMon  : null;
    const _lsDrainer = _battle.enemyMon._seeded  ? _battle.playerMon : null;
    const _lsSeeded2 = _battle.playerMon._seeded ? _battle.playerMon : null;
    const _lsDrainer2= _battle.playerMon._seeded ? _battle.enemyMon  : null;
    [{ seeded: _lsSeeded, drainer: _lsDrainer }, { seeded: _lsSeeded2, drainer: _lsDrainer2 }]
      .forEach(({ seeded, drainer }) => {
        if (!seeded || seeded.hp.current <= 0) return;
        const drain = Math.max(1, Math.floor(seeded.hp.max / 8));
        seeded.hp.current = Math.max(0, seeded.hp.current - drain);
        _pushMessage(`${_monName(seeded)}'s HP was sapped by Leech Seed!`);
        if (drainer && drainer.hp.current > 0 && drainer.hp.current < drainer.hp.max) {
          drainer.hp.current = Math.min(drainer.hp.max, drainer.hp.current + drain);
          _pushMessage(`${_monName(drainer)} absorbed the sapped energy!`);
        }
      });

    // Ability: Speed Boost (+1 spd each turn)
    [{ mon: _battle.playerMon, stages: _battle.playerStages, side: 'player' },
     { mon: _battle.enemyMon,  stages: _battle.enemyStages,  side: 'enemy'  }].forEach(({ mon, stages, side }) => {
      if (!mon || mon.hp.current <= 0) return;
      const sp = DG.SPECIES[mon.speciesId];
      if (sp && (sp.ability === 'Speed Boost' || sp.ability === 'Turbo Sprint')) {
        _applyStageDelta(stages, 'spd', 1, _monName(mon));
        _triggerAbilityAnim(sp.ability, side, 'speed_boost');
      }
    });
  }

  // Kept for backward-compat with any direct callers — delegates cleanly
  function _doEndOfTurn() {
    _state = BS.FAINT_CHECK;
    _doEndOfTurnEffects();
  }

  // ── GRANT EXP ─────────────────────────────────────────────
  // XP is split equally among all mons that actually participated (were sent out).
  // 1 participant  → 100% each
  // 2 participants → 50%  each
  // 3 participants → 33%  each   ...etc.
  // Bench mons that were never sent out receive nothing.
  // Message order: active mon first, then other participants in party-slot order.
  function _grantExp() {
    const enemy = _battle.enemyMon;
    const sp = DG.SPECIES[enemy.speciesId];
    if (!sp) return;

    const base = sp.expYield || 50;
    const isTrainer = _battle.type === 'TRAINER' ? 1.5 : 1.0;
    const totalExp = Math.max(1, Math.floor(base * enemy.level * isTrainer / 7));

    // Only mons that were actually sent out share the XP
    const participantCount = _battle.participants ? _battle.participants.size : 1;
    const shareExp = Math.max(1, Math.floor(totalExp / Math.max(1, participantCount)));

    // Award EVs to the active mon (the one that landed the finishing blow)
    _awardEVs(_battle.playerMon, enemy.speciesId);

    // Build ordered list: active mon first, then other participants in party-slot order
    const activeIdx = _battle.playerParty.indexOf(_battle.playerMon);
    const orderedIndices = [];
    if (activeIdx >= 0 && _battle.participants && _battle.participants.has(activeIdx)) {
      orderedIndices.push(activeIdx);
    }
    _battle.playerParty.forEach((mon, idx) => {
      if (idx !== activeIdx && _battle.participants && _battle.participants.has(idx)) {
        orderedIndices.push(idx);
      }
    });

    orderedIndices.forEach(idx => {
      const mon = _battle.playerParty[idx];
      if (!mon || mon.isEgg) return;

      mon.exp += shareExp;
      _pushMessage(`${_monName(mon)} gained ${shareExp} EXP!`);

      // Show EXP needed for next level
      const monSp = DG.SPECIES ? DG.SPECIES[mon.speciesId] : null;
      const expCurve = monSp && DG.EXP_CURVE ? DG.EXP_CURVE[monSp.expCurve || 'MEDIUM'] : null;
      if (expCurve) {
        const expToNextLv = expCurve(mon.level + 1) - mon.exp;
        if (expToNextLv > 0) _pushMessage(`${expToNextLv} EXP to next level!`);
      }

      // Happiness boost for winning (+3)
      if (mon.happiness !== undefined) mon.happiness = Math.min(255, (mon.happiness || 0) + 3);

      // Guard: ensure expToNext is set before level-up loop
      if (!mon.expToNext) {
        const mSp = DG.SPECIES ? DG.SPECIES[mon.speciesId] : null;
        const curve = mSp && DG.EXP_CURVE ? DG.EXP_CURVE[mSp.expCurve || 'MEDIUM_FAST'] : null;
        mon.expToNext = curve ? curve(mon.level + 1) : 9999999;
      }

      while (mon.exp >= mon.expToNext) {
        _levelUp(mon);
      }

      // Catch-up evolution: if the mon is already at or above its evolution
      // level but hasn't evolved/queued yet (e.g. caught above the threshold,
      // or evolved via Rare Candy elsewhere), queue it now.
      if (!mon._evoQueued) {
        const cSp = DG.SPECIES ? DG.SPECIES[mon.speciesId] : null;
        if (cSp && cSp.evolvesTo && cSp.evolvesAt && mon.level >= cSp.evolvesAt &&
            DG.SPECIES[cSp.evolvesTo] && !_isStoneOnly(mon.speciesId, cSp.evolvesTo)) {
          _queueEvolution(mon, cSp.evolvesTo);
        }
      }
    });

    // If any party mon queued an evolution this XP pass, enter the EVOLUTION
    // state so _tickEvolution can play each one in sequence (was: only the
    // FIRST mon ever evolved per battle — the cross-mon EVO guard blocked the rest).
    if (_battle.evoQueue && _battle.evoQueue.length) _state = BS.EVOLUTION;
  }

  // ── EV AWARD ─────────────────────────────────────────────
  function _awardEVs(playerMon, enemySpeciesId) {
    if (!playerMon || !enemySpeciesId) return;
    const evYield = DG.EV_YIELD && DG.EV_YIELD[enemySpeciesId];
    if (!evYield) return;
    playerMon.evs = playerMon.evs || { hp:0, atk:0, def:0, spAtk:0, spDef:0, spd:0 };
    let totalEVs = Object.values(playerMon.evs).reduce((a, b) => a + b, 0);
    let changed = false;
    for (const [stat, amt] of Object.entries(evYield)) {
      if (totalEVs >= 510) break;
      const cur = playerMon.evs[stat] || 0;
      if (cur >= 252) continue;
      const toAdd = Math.min(amt, 510 - totalEVs, 252 - cur);
      if (toAdd <= 0) continue;
      playerMon.evs[stat] = cur + toAdd;
      totalEVs += toAdd;
      changed = true;
    }
    if (changed) DG.SaveLoad.recalcStats(playerMon);
  }

  function _levelUp(mon) {
    mon.level++;
    const sp = DG.SPECIES[mon.speciesId];
    mon.expToNext = DG.EXP_CURVE[sp.expCurve](mon.level + 1);
    DG.SaveLoad.recalcStats(mon);

    _pushMessage(`${_monName(mon)} grew to level ${mon.level}!`);
    try { if (typeof DG.Audio !== 'undefined') DG.Audio.playLevelUp(); } catch(e) {}
    // Signal level-up visual
    if (typeof DG.BattleAnim !== 'undefined' && DG.BattleAnim.triggerLevelUp) {
      try { DG.BattleAnim.triggerLevelUp(mon.level); } catch(e) {}
    }

    // Happiness boost for leveling (+5)
    if (mon.happiness !== undefined) mon.happiness = Math.min(255, (mon.happiness || 0) + 5);

    // Learn new moves
    // entry.move can be a string (fixed move) or an array (randomizer pool).
    // For array entries we pick one random move from the pool — the choice is
    // stored back into the entry so it is stable for the rest of the session.
    const toLearn = sp.learnset.filter(e => e.level === mon.level);
    for (const entry of toLearn) {
      let moveId = entry.move;
      if (Array.isArray(moveId)) {
        // Randomizer slot: pick a random move from the pool and lock it in.
        const pool = moveId.filter(id => DG.MOVES && DG.MOVES[id]);
        if (pool.length === 0) continue;
        moveId = pool[Math.floor(Math.random() * pool.length)];
        entry.move = moveId; // lock choice for this session
      }
      _learnMove(mon, moveId);
    }

    // ── Evolution: pick the first matching trigger and QUEUE it ──
    // (priority: happiness > held item > level). Queuing instead of evolving
    // inline lets EVERY party mon that qualifies evolve this battle, in turn.
    if (!mon._evoQueued) {
      let evoTarget = null;
      // 1. Happiness
      if (typeof DG.HAPPINESS_EVOLUTIONS !== 'undefined') {
        const happyEvo = DG.HAPPINESS_EVOLUTIONS[mon.speciesId];
        if (happyEvo && (mon.happiness || 0) >= happyEvo.minHappiness && DG.SPECIES[happyEvo.evolves]) evoTarget = happyEvo.evolves;
      }
      // 2. Held item
      if (!evoTarget && mon.heldItem && typeof DG.HELD_ITEM_EVOLUTIONS !== 'undefined') {
        const heldEvo = DG.HELD_ITEM_EVOLUTIONS[mon.speciesId];
        if (heldEvo && heldEvo.item === mon.heldItem && DG.SPECIES[heldEvo.evolves]) evoTarget = heldEvo.evolves;
      }
      // 3. Standard level-based (skip stone-only lines — those need a stone)
      if (!evoTarget && sp.evolvesTo && sp.evolvesAt && mon.level >= sp.evolvesAt &&
          DG.SPECIES[sp.evolvesTo] && !_isStoneOnly(mon.speciesId, sp.evolvesTo)) {
        evoTarget = sp.evolvesTo;
      }
      if (evoTarget) _queueEvolution(mon, evoTarget);
    }
  }

  // ── Evolution helpers ─────────────────────────────────────
  function _isStoneOnly(speciesId, target) {
    if (typeof DG.STONE_EVOLUTIONS === 'undefined') return false;
    for (const stoneMap of Object.values(DG.STONE_EVOLUTIONS)) {
      if (stoneMap[speciesId] === target) return true;
    }
    return false;
  }
  function _queueEvolution(mon, target) {
    if (!mon || !target || !DG.SPECIES[target]) return;
    _battle.evoQueue = _battle.evoQueue || [];
    mon._evoQueued = true;
    _battle.evoQueue.push({ mon, target });
  }

  // ── Helper: evolve a mon into a new species (legacy, retained) ──
  function _evolveInto(mon, targetSpeciesId) {
    const oldName = _monName(mon);
    mon.speciesId = targetSpeciesId;
    const newSp = DG.SPECIES[targetSpeciesId];
    DG.SaveLoad.recalcStats(mon);
    DG.SaveLoad.markCaught(_battle.gameState, targetSpeciesId);
    _pushMessage(`${oldName} is evolving!`);
    _pushMessage(`Congratulations! ${oldName} evolved into ${newSp ? newSp.name : targetSpeciesId}!`);
    _notifyUI({ event: 'EVOLUTION', mon });
    _state = BS.EVOLUTION;
  }

  // ── Helper: format move stats as a compact string ─────────
  function _moveStatStr(mv) {
    if (!mv) return '—';
    const pwr = (mv.power && mv.power > 0) ? `PWR:${mv.power}` : 'PWR:—';
    const acc = (mv.accuracy && mv.accuracy < 999) ? `ACC:${mv.accuracy}%` : 'ACC:—';
    return `${mv.type}, ${pwr}, ${acc}`;
  }

  function _learnMove(mon, moveId) {
    const move = DG.MOVES[moveId];
    if (!move) return;
    // Skip silently if the mon already knows this move
    if (mon.moves.some(m => m && m.moveId === moveId)) return;
    // Always show PREVIEW popup first — user sees move details before anything is changed.
    // pendingLearnHasSlot = true  → free slot available (< 4 moves); A will auto-add
    // pendingLearnHasSlot = false → party full (= 4 moves); A advances to REPLACE screen
    _battle.pendingLearnMon     = mon;
    _battle.pendingLearnMove    = moveId;
    _battle.pendingLearnHasSlot = (mon.moves.length < 4);
    _battle.pendingLearnPhase   = 'PREVIEW';
    _state = BS.LEARN_MOVE;
    // No messages pushed here — the visual popup handles the information display
  }

  // ── Called by renderer when player answers the PREVIEW popup ─────────────
  // confirmed = true  → player wants to learn the move
  // confirmed = false → player skips (don't learn)
  function confirmLearnPreview(confirmed) {
    if (!_battle) return;
    const mon     = _battle.pendingLearnMon;
    const moveId  = _battle.pendingLearnMove;
    const hasSlot = _battle.pendingLearnHasSlot;

    if (!confirmed || !mon || !moveId) {
      // Skip — clear and resume battle
      _battle.pendingLearnMon     = null;
      _battle.pendingLearnMove    = null;
      _battle.pendingLearnHasSlot = false;
      _battle.pendingLearnPhase   = null;
      const monName = mon ? _monName(mon) : 'DinoMon';
      const move    = DG.MOVES[moveId] || {};
      _pushMessage(`${monName} did not learn ${move.name || moveId}.`);
      // Return to FAINT_HANDLER (not EXECUTE) so we don't re-trigger the faint
      // check loop and call _grantExp a second time.
      _state = BS.FAINT_HANDLER;
      return;
    }

    if (hasSlot) {
      // Free slot — add immediately and show success
      const move = DG.MOVES[moveId];
      if (move) {
        mon.moves.push({ moveId, ppCurrent: move.pp, ppMax: move.pp });
        if (typeof DG.BattleAnim !== 'undefined' && DG.BattleAnim.triggerMoveLearn) {
          try { DG.BattleAnim.triggerMoveLearn(); } catch(e) {}
        }
        _pushMessage(`${_monName(mon)} learned ${move.name}!`);
      }
      _battle.pendingLearnMon     = null;
      _battle.pendingLearnMove    = null;
      _battle.pendingLearnHasSlot = false;
      _battle.pendingLearnPhase   = null;
      // Return to FAINT_HANDLER (not EXECUTE) — avoids double _grantExp loop.
      _state = BS.FAINT_HANDLER;
    } else {
      // Full party — advance to REPLACE screen (pick which move to forget)
      _battle.pendingLearnPhase = 'REPLACE';
      // State stays LEARN_MOVE; renderer will switch to replace panel
    }
  }

  // ── EVOLUTION ─────────────────────────────────────────────
  function _doEvolution(mon, target) {
    const oldName = _monName(mon);
    const oldId   = mon.speciesId;
    const sp      = DG.SPECIES[oldId];
    const newId   = target || (sp && sp.evolvesTo);
    if (!newId || !DG.SPECIES[newId]) { mon._evoQueued = false; return; }

    mon.speciesId = newId;
    mon._evoQueued = false;
    const newSp = DG.SPECIES[newId];
    DG.SaveLoad.recalcStats(mon);
    DG.SaveLoad.markCaught(_battle.gameState, newId);

    _pushMessage(`${oldName} is evolving!`);
    _pushMessage(`Congratulations! ${oldName} evolved into ${newSp ? newSp.name : newId}!`);
    _notifyUI({ event: 'EVOLUTION', mon, oldSpeciesId: oldId });
  }

  function _tickEvolution() {
    // Drain the evolution queue one mon at a time, waiting for each evolution's
    // full-screen animation to finish before starting the next.
    if (typeof DG.EvoAnim !== 'undefined' && DG.EvoAnim.isActive && DG.EvoAnim.isActive()) return;
    const q = _battle.evoQueue;
    if (q && q.length) {
      const item = q.shift();
      if (item && item.mon) _doEvolution(item.mon, item.target);
      return; // stay in EVOLUTION; next tick waits for this animation
    }
    // Queue drained → FAINT_HANDLER (not EXECUTE) to avoid re-running _grantExp.
    _state = BS.FAINT_HANDLER;
  }

  function _tickLevelUp() {
    _state = BS.EXECUTE;
  }

  // ── CATCH ─────────────────────────────────────────────────
  // Called from player action type 'ITEM' with itemId being a ball
  function _doCatch(ballId) {
    const target = _battle.enemyMon;
    const sp = DG.SPECIES[target.speciesId];
    if (!sp) return;

    // Can't catch trainer mons
    if (_battle.type === 'TRAINER') {
      _pushMessage(`You can't catch a trainer's DinoMon!`);
      _continueExecution();
      return;
    }

    const ballMod = DG.BATTLE.CATCH_BALL[ballId] || 1;
    let caught, shakes;

    if (ballMod >= 255) {
      // DinoMaster Ball always catches
      caught = true;
      shakes = 4;
    } else {
      const catchRate = sp.catchRate || 45;
      const hpFactor  = (3 * target.hp.max - 2 * target.hp.current) / (3 * target.hp.max);
      let statusBonus = 1;
      if (target.statusEffect === DG.STATUS.SLEEP || target.statusEffect === DG.STATUS.FREEZE) statusBonus = 2;
      else if (target.statusEffect) statusBonus = 1.5;
      // FASE 8: Pokémon-achtige balans (deler 45 → 255, cap 94% → 90%).
      // Common (rate ~190) volle HP ≈ 25%, verzwakt ≈ 75%; zeldzaam (rate 45)
      // volle HP ≈ 6%, op 1 HP ≈ 18%; slaap/freeze ×2. Vangen = eerst verzwakken.
      const catchChance = Math.min(0.90, catchRate * ballMod * hpFactor * statusBonus / 255);
      caught = Math.random() < catchChance;
      shakes = caught ? 4 : Math.floor(Math.random() * 3) + 1;
    }

    // Start animation — result processed in _tickCatchAttempt once animation finishes
    if (typeof DG.BattleAnim !== 'undefined') {
      try { DG.BattleAnim.triggerCatch(shakes, caught, ballId); } catch(e) {}
    }
    _pendingCatch = { target, ballId, caught, shakes };
  }

  function _shakeCount(threshold) {
    let shakes = 0;
    for (let i = 0; i < 4; i++) {
      if (Math.random() < threshold) shakes++;
      else break;
    }
    return shakes;
  }

  function _shakeMessage(shakes) {
    if (shakes === 0) return `Oh no! The DinoMon escaped immediately!`;
    if (shakes === 1) return `Darn! It broke out after one shake!`;
    if (shakes === 2) return `So close! Two shakes!`;
    if (shakes === 3) return `Almost! Three shakes!`;
    return `Gotcha! DinoMon was caught!`;
  }

  function _catchSuccess(mon, ballId) {
    _battle.caught = true;
    mon.caughtAt      = _battle.gameState.player.currentMap;
    mon.caughtAtLevel = mon.level;
    mon.caughtBall    = ballId || 'DINOBALL';
    mon.happiness     = (mon.happiness !== undefined) ? mon.happiness : 70;
    DG.SaveLoad.markCaught(_battle.gameState, mon.speciesId);
    _justCaughtMon = mon;   // always set — fires nickname prompt for both party & box catches
    const gs = _battle.gameState;
    if (DG.SaveLoad.partyHasSpace(gs)) {
      gs.player.party.push(mon);
      _pushMessage(`${_monName(mon)} was added to your party!`);
    } else {
      // Party full — send to PC Box
      const sent = DG.SaveLoad.addToBox(gs, mon);
      if (sent) {
        _pushMessage(`Your party is full!`);
        _pushMessage(`${_monName(mon)} was sent to the PC Box!`);
      } else {
        _pushMessage(`Box is also full! ${_monName(mon)} was released...`);
      }
    }
    _endBattle('CAUGHT');
  }

  function _tickCatchAttempt() {
    // Wait for the ball-throw / shake / sparkle animation to finish
    if (typeof DG.BattleAnim !== 'undefined' &&
        DG.BattleAnim.isCatching && DG.BattleAnim.isCatching()) {
      return; // still animating
    }
    // Animation done — process catch result
    if (_pendingCatch) {
      const { target, ballId, caught, shakes } = _pendingCatch;
      _pendingCatch = null;
      _pushMessage(_shakeMessage(shakes));
      if (caught) {
        _catchSuccess(target, ballId);
      } else {
        _pushMessage(`${_monName(target)} broke free!`);
        _continueExecution();
      }
    } else {
      _state = BS.EXECUTE; // safety fallback
    }
  }

  // ── ITEM USE ──────────────────────────────────────────────
  function _doItem(act) {
    const gs = _battle.gameState;
    const itemId = act.itemId;
    const BALLS = ['DINOBALL','SUPERBALL','ULTRABALL','AMBERBALL','MASTERBALL','DINOMASTERBALL'];

    // Hard mode: only balls are allowed in battle — no healing items
    if (window._CURRENT_DIFFICULTY === 'HARD' && !BALLS.includes(itemId)) {
      _pushMessage(`Items are banned in Hard Mode!`);
      _continueExecution();
      return;
    }

    if (BALLS.includes(itemId)) {
      DG.SaveLoad.removeItem(gs, itemId, 1);
      const ballName = (DG.ITEMS && DG.ITEMS[itemId]) ? DG.ITEMS[itemId].name : itemId;
      _pushMessage(`You threw a ${ballName}!`);
      _state = BS.CATCH_ATTEMPT;
      _doCatch(itemId);
      return;
    }

    // Healing items
    const target = act.targetIndex !== undefined ? _battle.playerParty[act.targetIndex] : _battle.playerMon;
    const used = _useHealItem(gs, target, itemId);
    if (used) {
      DG.SaveLoad.removeItem(gs, itemId, 1);
      _pushMessage(`You used ${itemId} on ${_monName(target)}!`);
    } else {
      _pushMessage(`It had no effect!`);
    }
    _continueExecution();
  }

  function _useHealItem(gs, mon, itemId) {
    if (mon.hp.current <= 0 && itemId !== 'REVIVE' && itemId !== 'MAXREVIVE') return false;
    switch (itemId) {
      case 'POTION':      mon.hp.current = Math.min(mon.hp.max, mon.hp.current + 20);  return true;
      case 'SUPERPOTION': mon.hp.current = Math.min(mon.hp.max, mon.hp.current + 50);  return true;
      case 'HYPERPOTION': mon.hp.current = Math.min(mon.hp.max, mon.hp.current + 120); return true;
      case 'MAXPOTION':   mon.hp.current = mon.hp.max;                                  return true;
      case 'FULLRESTORE': mon.hp.current = mon.hp.max; DG.StatusEffects.cure(mon,'ALL'); return true;
      case 'REVIVE':      if (mon.hp.current <= 0) { mon.hp.current = Math.floor(mon.hp.max/2); return true; } return false;
      case 'MAXREVIVE':   if (mon.hp.current <= 0) { mon.hp.current = mon.hp.max; return true; } return false;
      case 'ANTIDOTE':    return !!DG.StatusEffects.cure(mon, [DG.STATUS.POISON, DG.STATUS.BADPOISON]);
      case 'BURNHEAL':    return !!DG.StatusEffects.cure(mon, [DG.STATUS.BURN]);
      case 'PARALYHEAL':  return !!DG.StatusEffects.cure(mon, [DG.STATUS.PARALYSIS]);
      case 'AWAKENING':   return !!DG.StatusEffects.cure(mon, [DG.STATUS.SLEEP]);
      case 'FULLHEAL':    DG.StatusEffects.cure(mon, 'ALL'); return true;
      default: return false;
    }
  }

  // ── SWITCH ────────────────────────────────────────────────
  function _doSwitch(act) {
    const newMon = _battle.playerParty[act.targetIndex];
    if (!newMon || newMon.hp.current <= 0 || newMon.isEgg) {
      _pushMessage(`That DinoMon can't battle!`);
      _continueExecution();
      return;
    }
    const oldName = _monName(_battle.playerMon);
    _clearLocks(_battle.playerMon);  // outgoing mon drops any multi-turn lock
    _battle.playerMon = newMon;
    _clearLocks(newMon);
    newMon._seeded = false; // seed clears on switch-in
    _battle.participants.add(act.targetIndex); // track XP participation
    _battle.playerStages = { atk:0, def:0, spAtk:0, spDef:0, spd:0, acc:0, eva:0 };
    _applyEntryHazards(newMon, true);
    _pushMessage(`Come back, ${oldName}!`);
    _pushMessage(`Go, ${_monName(newMon)}!`);
    // Trigger switch-in ball animation
    if (typeof DG.BattleAnim !== 'undefined') {
      try { DG.BattleAnim.triggerSwitchIn(); } catch(e) {}
    }
    // Trigger entry ability
    _abilityOnEntry(newMon, true);
    _continueExecution();
  }

  function _tickSwitchIn() {
    _state = BS.PLAYER_INPUT; // switch-in complete, wait for player's next action
  }

  // ── RUN ───────────────────────────────────────────────────
  function _doRun() {
    if (_battle.type === 'TRAINER') {
      _pushMessage(`You can't run from a trainer battle!`);
      _continueExecution();
      return;
    }
    // Run Away: always escapes wild battles successfully.
    const _runAb = ((DG.SPECIES[_battle.playerMon.speciesId] || {}).ability) || '';
    if (_runAb === 'Run Away') {
      _battle.fled = true;
      _pushMessage(`${_monName(_battle.playerMon)} ran away with Run Away!`);
      _endBattle('RUN');
      return;
    }
    // Arena Trap (wild foe): non-Flying DinoMons cannot flee.
    const _trapAb = ((DG.SPECIES[_battle.enemyMon.speciesId] || {}).ability) || '';
    const _pTypes = ((DG.SPECIES[_battle.playerMon.speciesId] || {}).types) || [];
    if (_trapAb === 'Arena Trap' && !_pTypes.includes('FLYING')) {
      _pushMessage(`${_monName(_battle.enemyMon)}'s Arena Trap prevents escape!`);
      _continueExecution();
      return;
    }
    _battle.runAttempts++;
    const pSpd = _battle.playerMon.stats.spd;
    const eSpd = _battle.enemyMon.stats.spd;
    const escapeOdds = Math.floor(pSpd * 128 / (eSpd || 1)) + 30 * _battle.runAttempts;
    if (escapeOdds >= 255 || Math.floor(Math.random() * 256) < escapeOdds) {
      _battle.fled = true;
      _pushMessage(`Got away safely!`);
      _endBattle('RUN');
    } else {
      _pushMessage(`Can't escape!`);
      _continueExecution();
    }
  }

  function _tickRunAttempt() {
    _state = BS.PLAYER_INPUT;
  }

  // ── BATTLE END ────────────────────────────────────────────
  function _endBattle(result) {
    _state = BS.BATTLE_END;
    _battle.result = result;
    _lastResult = result;
    // Award prize money for trainer battles
    if (result === 'WIN' && _battle.type === 'TRAINER' && _battle.trainerData) {
      const highestLv = _battle.enemyParty.reduce((mx, m) => Math.max(mx, m ? m.level : 0), 0);
      const _ccM2 = (_battle.gameState.player.bag && _battle.gameState.player.bag.COMPOUND_CARD > 0) ? 1.5 : 1;
      // Single source of truth for prize money: use trainerData.reward (all 136 trainers
      // define it), with a level-based fallback for any trainer that doesn't.
      const prize = Math.round((_battle.trainerData.reward || (highestLv * 50)) * _ccM2);
      _battle.gameState.player.money = (_battle.gameState.player.money || 0) + prize;
      _pushMessage(`${_battle.trainerData.name || 'Trainer'} paid ¥${prize}!`);
      // Money pop animation
      if (typeof DG.BattleAnim !== 'undefined' && DG.BattleAnim.triggerMoneyPop) {
        try { DG.BattleAnim.triggerMoneyPop(prize); } catch(e) {}
      }
    }
    _pushMessage(_endMessage(result));
    _notifyUI({ event: 'BATTLE_END', result });
    if (result === 'WIN') {
      try { if (typeof DG.Audio !== 'undefined') DG.Audio.playVictoryJingle(); } catch(e) {}
    }
    if (result === 'CAUGHT') {
      try { if (typeof DG.Audio !== 'undefined') DG.Audio.playSfx('CATCH'); } catch(e) {}
    }
  }

  function _tickBattleEnd() {
    const gs  = _battle.gameState;
    const res = _battle.result;

    if (res === 'WIN' && _battle.type === 'TRAINER') {
      if (_battle.trainerData.defeatFlag) {
        DG.SaveLoad.setFlag(gs, _battle.trainerData.defeatFlag);
      }
    }

    if (res === 'LOSE') {
      // FASE 9: 50% geldstraf (was een stille 10%) — bedrag onthouden voor de melding
      const _lost = Math.floor((gs.player.money || 0) / 2);
      gs.player.money = Math.max(0, (gs.player.money || 0) - _lost);
      window._BLACKOUT_LOST = _lost;
      // Lifetime stats (shown in Options): blackout count + total money lost
      gs.player.stats = gs.player.stats || {};
      gs.player.stats.blackouts = (gs.player.stats.blackouts || 0) + 1;
      gs.player.stats.moneyLost = (gs.player.stats.moneyLost || 0) + _lost;

      // FASE 9: gym-reset — verlies je in een gym (trainer óf leider), dan gaan
      // de quiz-vlaggen en gym-trainer-vlaggen van díe gym terug naar af.
      // Badge-/leider-vlaggen blijven staan. currentMap is hier nog de gym.
      try {
        const _gymMap = DG.MAPS && DG.MAPS[gs.player.currentMap];
        if (_gymMap && _gymMap.music === 'GYM_THEME' && _gymMap.npcs && gs.player.flags) {
          for (const _n of _gymMap.npcs) {
            if (_n.quizCorrectFlag) delete gs.player.flags[_n.quizCorrectFlag];
            if (_n.quizWrongFlag)   delete gs.player.flags[_n.quizWrongFlag];
            if (_n.quizDoneFlag)    delete gs.player.flags[_n.quizDoneFlag];
            if (_n.trainerRef) {
              const _t = DG.TRAINERS && DG.TRAINERS[_n.trainerRef];
              if (!(_t && _t.isGymLeader)) delete gs.player.flags[`TRAINER_${_n.trainerRef}_DEFEATED`];
            }
          }
        }
      } catch(e) {}

      // fix: use blackOut() so player returns to last recorded DinoCenter, not hardcoded AMBERTOWN
      const _center = DG.SaveLoad.blackOut(gs);
      gs.player.currentMap = _center.map;
      gs.player.x = _center.x;
      gs.player.y = _center.y;
      // blackOut() already heals party to half HP + clears status; top up any still at 0
      for (const mon of gs.player.party) {
        if (mon && mon.hp.current <= 0) mon.hp.current = 1;
      }
    }

    // Strip battle-only volatile flags off the whole party so nothing (least of
    // all infatuation) leaks into the saved game and sticks forever.
    try {
      for (const mon of gs.player.party) {
        if (!mon) continue;
        mon._infatuated = false; mon._lock = null; mon._charging = false;
        mon._chargingMoveId = null; mon._rolloutMult = 1; mon._rampageEnded = false;
        mon._flinched = false; mon._rechargeNext = false; mon._evoQueued = false;
        mon._sashUsed = false; mon._immortalUsed = false; mon._timeLockUsed = false;
        mon._flashFireActive = false; mon._seeded = false;
      }
    } catch(e) {}

    const onEnd = _battle.onEnd;
    _battle = null;
    _state  = BS.IDLE;
    DG.SaveLoad.save(gs);
    if (typeof onEnd === 'function') onEnd(res);
  }

  // ── HELPERS ───────────────────────────────────────────────
  function _introMessage() {
    if (!_battle) return '';
    if (_battle.type === 'WILD') {
      return `A wild ${_monName(_battle.enemyMon)} appeared!`;
    }
    const td = _battle.trainerData;
    return `${td.name} wants to battle! ${td.name} sent out ${_monName(_battle.enemyMon)}!`;
  }

  function _endMessage(result) {
    switch (result) {
      case 'WIN':    return `You win!`;
      case 'LOSE':   return `You blacked out!`;
      case 'RUN':    return `Escaped from battle.`;
      case 'CAUGHT': return `DinoMon caught!`;
      default:       return `Battle over.`;
    }
  }

  function _monName(mon) {
    if (!mon) return '?';
    const sp = DG.SPECIES[mon.speciesId];
    return mon.nickname || (sp ? sp.name : mon.speciesId);
  }

  // dmgAction (optional): { target, damage } — applied when the message is displayed,
  // so MULTI-hit moves can sync each HP-bar drop with its corresponding "Hit N!" text.
  function _pushMessage(msg, dmgAction) {
    if (msg) {
      _battle.messages.push(msg);
      if (_battle._msgDamageQueue) _battle._msgDamageQueue.push(dmgAction || null);
    }
  }

  function _notifyUI(data) {
    if (typeof DG.BattleUI !== 'undefined' && DG.BattleUI.notify) {
      DG.BattleUI.notify(data);
    }
  }

  // ── Public getters for UI ─────────────────────────────────
  function getState()       { return _state; }
  function getBattle()      { return _battle; }
  function isActive()       { return _state !== BS.IDLE && !!_battle; }
  function currentMessage() { return _battle ? _battle.pendingMessage : null; }

  function getCaughtMon() {
    const mon = _justCaughtMon;
    _justCaughtMon = null;
    return mon;
  }

  function getLastResult() {
    const r = _lastResult;
    _lastResult = null;
    return r;
  }

  // ── LEARN MOVE UI helpers ─────────────────────────────────
  function getPendingLearn() {
    if (!_battle || !_battle.pendingLearnMon) return null;
    return {
      mon:     _battle.pendingLearnMon,
      moveId:  _battle.pendingLearnMove,
      hasSlot: _battle.pendingLearnHasSlot,
      phase:   _battle.pendingLearnPhase || 'REPLACE',
    };
  }

  // ── FLEE CONFIRMATION ─────────────────────────────────────
  // Called by renderer after player answers "Yes, run!" or "No, stay".
  // confirmed=true  → execute the flee attempt
  // confirmed=false → return to move selection
  function confirmFlee(confirmed) {
    if (!_battle || !_awaitingFleeConfirm) return;
    _awaitingFleeConfirm = false;
    if (confirmed) {
      // Wire in the RUN action and run through the normal execute path
      _battle.playerAction = { type: 'RUN' };
      _state = BS.ENEMY_INPUT;
      _chooseEnemyAction();
      _state = BS.EXECUTE;
      _battle.turnQueue = [{ actor: 'PLAYER', action: { type: 'RUN' } }];
      // _tickExecute will pick it up on next frame
    } else {
      // Player chose to stay — back to move selection
      _state = BS.PLAYER_INPUT;
    }
  }

  function confirmLearnMove(replaceIdx) {
    if (!_battle) return;
    const mon    = _battle.pendingLearnMon;
    const moveId = _battle.pendingLearnMove;
    _battle.pendingLearnMon     = null;
    _battle.pendingLearnMove    = null;
    _battle.pendingLearnHasSlot = false;
    _battle.pendingLearnPhase   = null;

    if (replaceIdx !== -1 && mon && moveId) {
      const move = DG.MOVES[moveId];
      if (move) {
        const forgotten = mon.moves[replaceIdx];
        const forgotName = (forgotten && DG.MOVES[forgotten.moveId]) ? DG.MOVES[forgotten.moveId].name : '???';
        mon.moves[replaceIdx] = { moveId, ppCurrent: move.pp, ppMax: move.pp };
        if (typeof DG.BattleAnim !== 'undefined' && DG.BattleAnim.triggerMoveLearn) {
          try { DG.BattleAnim.triggerMoveLearn(); } catch(e) {}
        }
        _pushMessage(`${_monName(mon)} forgot ${forgotName} and learned ${move.name}!`);
      }
    } else if (mon && moveId) {
      const move = DG.MOVES[moveId] || {};
      _pushMessage(`${_monName(mon)} did not learn ${move.name || moveId}.`);
    }
    // Return to FAINT_HANDLER (not EXECUTE) — avoids re-triggering the faint
    // check loop and calling _grantExp a second time.
    _state = BS.FAINT_HANDLER;
  }

  // ── Public: switch target in double battle (L/R input) ───
  function switchDoubleTarget() {
    if (!_battle || !_battle.isDouble) return;
    if (_battle.doubleTarget === 'ENEMY1') {
      if (_battle.enemy2Mon && _battle.enemy2Mon.hp.current > 0) {
        _battle.doubleTarget = 'ENEMY2';
      }
    } else {
      if (_battle.enemyMon && _battle.enemyMon.hp.current > 0) {
        _battle.doubleTarget = 'ENEMY1';
      }
    }
  }

  // ── Public: HP display getters for renderer ──────────────
  function getPlayerHPDisplay() {
    if (!_battle || !_battle.playerMon) return null;
    return (_playerHPDisplay !== null) ? _playerHPDisplay : _battle.playerMon.hp.current;
  }

  function getEnemyHPDisplay() {
    if (!_battle || !_battle.enemyMon) return null;
    return (_enemyHPDisplay !== null) ? _enemyHPDisplay : _battle.enemyMon.hp.current;
  }

  // ── Public: EXP display getter for renderer ──────────────
  function getPlayerExpDisplay() {
    if (!_battle || !_battle.playerMon) return null;
    return (_playerExpDisplay !== null) ? _playerExpDisplay : _battle.playerMon.exp;
  }

  // ── Public: flee confirmation state getter ───────────────
  function isAwaitingFleeConfirm() { return _awaitingFleeConfirm; }

  console.log('[DinoMon] Battle v45 loaded.');

  return {
    BS,
    start,
    startDouble,
    update,
    submitPlayerAction,
    lockedMoveIndex,
    switchDoubleTarget,
    getState,
    getBattle,
    isActive,
    currentMessage,
    getCaughtMon,
    getLastResult,
    getPendingLearn,
    confirmLearnMove,
    confirmLearnPreview,
    confirmFlee,
    isAwaitingFleeConfirm,
    getPlayerHPDisplay,
    getEnemyHPDisplay,
    getPlayerExpDisplay,
    getDoubleHPDisplays: () => ({ ally: _allyHPDisplay, enemy2: _enemy2HPDisplay }),
    getHPDisplays: () => ({ player: _playerHPDisplay, enemy: _enemyHPDisplay }),
  };
})();

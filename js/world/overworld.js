// DinoMon: Fossil Frontier — world/overworld.js  v40
// Player movement, collision, NPC interaction, warp transitions
// v32: gym lock mechanic — exit doors blocked until leader defeated

window.DG = window.DG || {};

DG.Overworld = (function () {

  // ── State ─────────────────────────────────────────────────
  let _gs       = null;   // game state ref
  let _mapData  = null;   // current map definition
  let _blocked  = false;  // block movement during dialogue/battle/menu
  let _moveTimer = 0;     // movement cooldown (frames)
  const MOVE_DELAY_NORMAL = 8;  // frames between steps (walking)
  const MOVE_DELAY_RUN    = 4;  // frames between steps (running shoes)
  const MOVE_DELAY_BIKE   = 2;  // frames between steps (bicycle)
  let _surfing  = false;  // true when surfing on water

  // Camera offset (pixel)
  let _camX = 0, _camY = 0;

  // NPC walk timers
  let _npcTimers = {};

  // Transition state
  let _transitioning  = false;
  let _transAlpha     = 0;
  let _transDir       = 0; // 1 = fade out, -1 = fade in
  let _transTarget    = null; // { mapId, x, y }
  let _transFrames    = 0;   // anti-freeze: counts frames since transition started

  // Trainer alert state (exclamation mark + freeze)
  let _trainerAlert  = null;  // { npc, timer, phase } when a trainer spots the player
  const TRAINER_SIGHT = 4;    // tiles of line-of-sight range

  // Encounter fade-to-black transition
  let _encounterPending = null; // { config: battleConfig }
  let _encounterFade    = 0;    // 0 = no fade, >0 = fading
  const ENCOUNTER_FADE_DURATION = 50; // frames

  // ── Public: initialize ───────────────────────────────────
  function init(gameState) {
    _gs = gameState;
    // Always reset transition/encounter state on init — prevents black-screen
    // if init is called while a previous transition was in progress (e.g. blackout).
    _transitioning   = false;
    _transAlpha      = 0;
    _transDir        = 0;
    _transTarget     = null;
    _blocked         = false;
    _transFrames     = 0;
    _encounterFade   = 0;
    _encounterPending = null;
    _trainerAlert    = null;
    _loadMap(gameState.player.currentMap);
  }

  // ── Public: update (called every frame) ──────────────────
  function update(dt) {
    if (!_gs) return;

    // HM Fly cutscene — runs to completion, blocks all overworld input
    if (typeof DG.FlyAnim !== 'undefined' && DG.FlyAnim.isActive()) {
      DG.FlyAnim.update(dt);
      return;
    }

    // Transition fade — MUST run even if _mapData is null (e.g. loading new map)
    // Previously, the !_mapData guard above would prevent this from running,
    // leaving the transition permanently stuck at black screen.
    if (_transitioning) {
      _updateTransition();
      return;
    }

    if (!_mapData) return; // safe to guard after transition check

    // Encounter fade-to-black transition
    if (_encounterFade > 0) {
      _encounterFade--;
      if (_encounterFade === 0 && _encounterPending) {
        const cfg = _encounterPending;
        _encounterPending = null;
        DG.Battle.start(cfg);
      }
      return; // Block all other updates during fade
    }

    // Update trainer alert (runs even when blocked — manages the block state itself)
    _updateTrainerAlert();

    if (_blocked) return;

    _moveTimer = Math.max(0, _moveTimer - 1);

    // Movement speed: bike > running shoes > walk
    const _curDelay = _gs.player.bikeMode
      ? MOVE_DELAY_BIKE
      : (DG.Input.isHeld('B') && (_gs.player.bag.RUNNING_SHOES > 0))
        ? MOVE_DELAY_RUN
        : MOVE_DELAY_NORMAL;

    // Movement input
    if (_moveTimer === 0) {
      let dx = 0, dy = 0;
      if      (DG.Input.isHeld('UP'))    { dy = -1; _gs.player.facing = 'UP'; }
      else if (DG.Input.isHeld('DOWN'))  { dy =  1; _gs.player.facing = 'DOWN'; }
      else if (DG.Input.isHeld('LEFT'))  { dx = -1; _gs.player.facing = 'LEFT'; }
      else if (DG.Input.isHeld('RIGHT')) { dx =  1; _gs.player.facing = 'RIGHT'; }

      if (dx !== 0 || dy !== 0) {
        _moveTimer = _curDelay;
        _tryMove(dx, dy);
      }
    }

    // B button: toggle bike (if not held for running shoes)
    if (DG.Input.isPressed('B') && !DG.Input.isHeld('UP') && !DG.Input.isHeld('DOWN') &&
        !DG.Input.isHeld('LEFT') && !DG.Input.isHeld('RIGHT')) {
      if (_gs.player.bag.BIKE > 0) {
        _gs.player.bikeMode = !_gs.player.bikeMode;
        if (_surfing) { _surfing = false; } // dismount surf on bike toggle
        const msg = _gs.player.bikeMode ? ['You got on your Bicycle! Zoom!'] : ['You got off your Bicycle.'];
        DG.DialogueBox.show(msg, () => {});
      }
    }

    // A button: interact
    if (DG.Input.isPressed('A')) {
      _interact();
    }

    // Start: open menu
    if (DG.Input.isPressed('START')) {
      if (typeof DG.Menu !== 'undefined') {
        _blocked = true;
        DG.Menu.open(_gs, () => { _blocked = false; });
      }
    }

    // Update NPC wander
    _updateNPCs(dt);

    // Update camera
    _updateCamera();
  }

  // ── Movement ─────────────────────────────────────────────
  function _tryMove(dx, dy) {
    const nx = _gs.player.x + dx;
    const ny = _gs.player.y + dy;

    // Bounds check
    if (nx < 0 || nx >= _mapData.width || ny < 0 || ny >= _mapData.height) {
      return;
    }

    const tile = _getTile(nx, ny);

    // Water tiles need Surf to cross
    if (tile === DG.TILE.WATER || tile === DG.TILE.DEEP_WATER_TILE) {
      if (!_surfing) {
        // Only show the "need surf" message if the player actually walks into water
        const surfUnlocked = _gs.player.flags && _gs.player.flags['SURF_UNLOCKED'];
        if (!surfUnlocked) {
          DG.DialogueBox.show(["The water is too deep to cross.", "You'll need a DinoMon that knows Surf!"], () => {});
        }
        return; // blocked without actively surfing regardless
      }
    }

    // Collision
    if (_isSolid(tile)) return;

    // Check for NPC occupying the tile
    if (_npcAt(nx, ny)) return;

    // Auto-dismount surfing when stepping onto land
    if (_surfing && tile !== DG.TILE.WATER && tile !== DG.TILE.DEEP_WATER_TILE) {
      _surfing = false;
      DG.DialogueBox.show([`You stepped off the water!`], () => {});
    }

    // Move player
    _gs.player.x = nx;
    _gs.player.y = ny;
    _gs.player.steps = (_gs.player.steps || 0) + 1;

    // Fossil incubation: carried fossils awaken after enough steps
    try { _incubateFossils(); } catch(e) {}

    // (The old risk-free step-compounding DinoFund was removed — Compound City now
    //  runs on Daytrader Niels' volatile Beachcoin, see _beachcoin/_rollBeachcoin.)

    // Terrain footstep SFX — play every step (audio.js throttles volume)
    try {
      if (typeof DG.Audio !== 'undefined' && DG.Audio.playFootstep) {
        DG.Audio.playFootstep(_getTile(nx, ny));
      }
    } catch(e) {}

    // Happiness: +1 every 128 steps (walking builds friendship)
    if (_gs.player.steps % 128 === 0) {
      for (const mon of _gs.player.party) {
        if (mon && !mon.isEgg && mon.happiness !== undefined) {
          mon.happiness = Math.min(255, (mon.happiness || 0) + 1);
        }
      }
    }

    // Egg hatching: increment egg step counters
    for (const mon of _gs.player.party) {
      if (!mon || !mon.isEgg) continue;
      mon.eggSteps = (mon.eggSteps || 0) + 1;
      if (mon.eggSteps >= mon.hatchSteps) {
        _hatchEgg(mon);
      }
    }

    // Daycare: every 256 steps with 2 mons, chance to generate an egg
    if (_gs.player.steps % 256 === 0) {
      _checkDaycareEgg();
    }

    // Repel countdown
    if ((_gs.player.repelSteps || 0) > 0) {
      _gs.player.repelSteps--;
      if (_gs.player.repelSteps === 0) {
        DG.DialogueBox.show(['The Repel wore off...'], () => {});
      }
    }

    // Poison/Burn damage outside battle (every 4 steps, min 1 HP — can't faint)
    if (_gs.player.steps % 4 === 0) {
      for (const mon of _gs.player.party) {
        if (!mon || mon.hp.current <= 0) continue;
        if (mon.statusEffect === 'POISON' || mon.statusEffect === 'BADPOISON') {
          mon.hp.current = Math.max(1, mon.hp.current - Math.max(1, Math.floor(mon.hp.max / 16)));
        }
        if (mon.statusEffect === 'BURN') {
          mon.hp.current = Math.max(1, mon.hp.current - Math.max(1, Math.floor(mon.hp.max / 16)));
        }
      }
    }

    // Warp check
    const warp = _getWarp(nx, ny);
    if (warp) {
      const mapId = warp.mapId || warp.targetMap;
      const destX = warp.destX !== undefined ? warp.destX : warp.targetX;
      const destY = warp.destY !== undefined ? warp.destY : warp.targetY;
      _startTransition(mapId, destX, destY, warp.facing);
      return;
    }

    // Ground item pickup (dinoball / hidden item)
    if (_checkItemPickup(nx, ny)) return;

    // Tile event check
    DG.Events.checkTile(_mapData, nx, ny, _gs, () => {});

    // Wild encounter check
    if (!DG.Battle.isActive()) {
      const mon = DG.Encounter.check(_mapData, tile, _gs.player.party[0]?.level || 1, _gs);
      if (mon) {
        _blocked = true;
        _encounterPending = {
          type: 'WILD', enemy: mon, gameState: _gs,
          onEnd: function() { _blocked = false; DG.SaveLoad.save(_gs); }
        };
        _encounterFade = ENCOUNTER_FADE_DURATION;
        try { DG.Audio.stopMusic(); } catch(e) {}
        try { DG.Audio.playEncounterJingle(); } catch(e) {}
        return;
      }
    }

    // Trainer line-of-sight check
    if (!DG.Battle.isActive() && !_trainerAlert) {
      _checkTrainerSight();
    }
  }

  // ── Interaction ───────────────────────────────────────────
  function _interact() {
    const p = _gs.player;
    let fx = p.x, fy = p.y;
    if (p.facing === 'UP')    fy--;
    if (p.facing === 'DOWN')  fy++;
    if (p.facing === 'LEFT')  fx--;
    if (p.facing === 'RIGHT') fx++;

    // Check NPC
    const npc = _npcAt(fx, fy);
    if (npc) {
      _talkToNPC(npc);
      return;
    }

    // Check through counter/heal-pad tiles (nurse behind counter)
    const fwdTile = _getTile(fx, fy);
    if (fwdTile === DG.TILE.COUNTER || fwdTile === DG.TILE.HEAL_PAD) {
      const ddx = fx - p.x, ddy = fy - p.y;
      const npcBehind = _npcAt(fx + ddx, fy + ddy);
      if (npcBehind) { _talkToNPC(npcBehind); return; }
    }

    // Check interact events
    DG.Events.checkInteract(_mapData, fx, fy, _gs, () => {});

    // Check tile object (signs, PC, HM tiles, etc.)
    const tile = _getTile(fx, fy);
    if (tile === DG.TILE.SIGN) {
      const sign = _mapData.signs && _mapData.signs.find(s => s.x === fx && s.y === fy);
      if (sign) DG.DialogueBox.show(Array.isArray(sign.text) ? sign.text : [sign.text], () => {});
      return;
    }

    // PC (DinoMon Box) — tile 75 in any DinoCenter map
    if (tile === DG.TILE.PC) {
      if (typeof DG.BoxUI !== 'undefined') {
        _blocked = true;
        DG.DialogueBox.show(['DINO-CENTER PC', 'Access your DinoMon storage?'], () => {
          DG.BoxUI.open(_gs, () => {
            _blocked = false;
            DG.SaveLoad.save(_gs);
          });
          DG.Overworld._pendingBoxUI = true;
        });
      } else {
        DG.DialogueBox.show(['The PC is currently offline.'], () => {});
      }
      return;
    }

    // HM: Cut (tile 64=TREE or 85=CUT_TREE)
    if (tile === DG.TILE.TREE || tile === DG.TILE.CUT_TREE) {
      if (typeof DG.FieldMoves !== 'undefined') {
        DG.FieldMoves.tryCut(_gs, () => {
          // Remove the tree tile (replace with FLOOR)
          if (_mapData.tiles[fy]) _mapData.tiles[fy][fx] = DG.TILE.FLOOR;
          _blocked = false;
        }, () => { _blocked = false; });
      }
      return;
    }

    // HM: Rock Smash (tile 84=BREAKABLE_ROCK)
    if (tile === DG.TILE.BREAKABLE_ROCK) {
      if (typeof DG.FieldMoves !== 'undefined') {
        DG.FieldMoves.tryRockSmash(_gs, () => {
          // Remove the rock tile
          if (_mapData.tiles[fy]) _mapData.tiles[fy][fx] = DG.TILE.FLOOR;
          _blocked = false;
        }, () => { _blocked = false; });
      }
      return;
    }

    // HM: Strength (tile 86=STRENGTH_BOULDER)
    if (tile === DG.TILE.STRENGTH_BOULDER) {
      if (typeof DG.FieldMoves !== 'undefined') {
        DG.FieldMoves.tryStrength(_gs, () => {
          // Push the boulder aside (replace with FLOOR)
          if (_mapData.tiles[fy]) _mapData.tiles[fy][fx] = DG.TILE.FLOOR;
          _blocked = false;
        }, () => { _blocked = false; });
      }
      return;
    }

    // HM: Waterfall (tile 83=WATERFALL)
    if (tile === DG.TILE.WATERFALL) {
      if (typeof DG.FieldMoves !== 'undefined') {
        DG.FieldMoves.tryWaterfall(_gs, () => { _blocked = false; }, () => { _blocked = false; });
      }
      return;
    }

    // HM: Surf — interact with adjacent water tile while on land
    if ((tile === DG.TILE.WATER || tile === DG.TILE.DEEP_WATER_TILE) && !_surfing) {
      if (typeof DG.FieldMoves !== 'undefined') {
        const surfUnlocked = _gs.player.flags && _gs.player.flags['SURF_UNLOCKED'];
        if (!surfUnlocked) {
          DG.DialogueBox.show(["The water is too deep to cross.", "You'll need a DinoMon that knows Surf!"], () => { _blocked = false; });
          return;
        }
        DG.FieldMoves.trySurf(_gs, () => {
          _surfing = true;
          // Step player onto the water tile
          _gs.player.x = fx;
          _gs.player.y = fy;
          _blocked = false;
        }, () => { _blocked = false; });
      }
      return;
    }

    // Fishing — interact with water or fishing-spot tile while surfing (or standing at water edge)
    if (tile === DG.TILE.WATER || tile === DG.TILE.FISHING_SPOT ||
        tile === DG.TILE.DEEP_WATER_TILE ||
        (_surfing && (tile === DG.TILE.WATER || tile === DG.TILE.DEEP_WATER_TILE))) {
      // Only fish if player has a rod
      if (typeof DG.FieldMoves !== 'undefined') {
        const rod = DG.FieldMoves.getBestRod(_gs.player.bag || {});
        if (rod) {
          _blocked = true;
          DG.FieldMoves.tryFish(_gs, _mapData,
            (wildMon) => {
              _encounterPending = {
                type: 'WILD', enemy: wildMon, gameState: _gs,
                onEnd: function() { _blocked = false; DG.SaveLoad.save(_gs); }
              };
              _encounterFade = ENCOUNTER_FADE_DURATION;
            },
            () => { _blocked = false; }
          );
          return;
        }
      }
    }
  }

  function _talkToNPC(npc) {
    _blocked = true;
    // Face player toward NPC
    const p = _gs.player;
    const dx = npc.x - p.x, dy = npc.y - p.y;
    if      (Math.abs(dx) >= Math.abs(dy)) { p.facing = dx > 0 ? 'RIGHT' : 'LEFT'; }
    else                                    { p.facing = dy > 0 ? 'DOWN'  : 'UP'; }

    // onInteract: HEAL_PARTY
    if (npc.onInteract === 'HEAL_PARTY') {
      DG.Events.healParty(_gs, () => { _blocked = false; DG.SaveLoad.save(_gs); });
      return;
    }

    // onInteract: REVIVE_FOSSIL (Fossil Lab scientist)
    if (npc.onInteract === 'REVIVE_FOSSIL') {
      _reviveFossils();
      return;
    }

    // onInteract: BEACHCOIN (Daytrader Niels — his volatile cryptocoin)
    if (npc.onInteract === 'BEACHCOIN') {
      _beachcoin();
      return;
    }

    // onInteract: MOVE_RELEARNER — relearn a forgotten learnset move for a fee.
    if (npc.onInteract === 'MOVE_RELEARNER') {
      const FEE = 3000;
      const party = (_gs.player.party || []).filter(m => m && !m.isEgg);
      if (!party.length) { DG.DialogueBox.show(['Bring me a DinoMon and I can reteach it moves it once knew.'], () => { _blocked = false; }); return; }
      DG.DialogueBox.show([
        "Move Tutor: I can make a DinoMon remember any move from its learnset — even ones it never picked up.",
        `My fee is ¥${FEE} per move. Who shall we teach?`], () => {
        const monOpts = party.map(m => (m.nickname || (DG.SPECIES[m.speciesId] || {}).name || m.speciesId) + ' Lv.' + m.level).concat(['Cancel']);
        DG.Menu.showChoiceMenu('Teach which DinoMon?', monOpts, (idx) => {
          if (idx >= party.length) { _blocked = false; return; }
          const mon = party[idx];
          const sp = DG.SPECIES[mon.speciesId] || {};
          const known = new Set((mon.moves || []).map(s => s.moveId));
          // Candidates: learnset moves at/below current level that it doesn't know.
          const seen = new Set(); const cand = [];
          const ls = (sp.learnset || []).filter(L => L.level <= mon.level && !known.has(L.move) && DG.MOVES[L.move]);
          for (let i = ls.length - 1; i >= 0; i--) {           // newest first
            if (!seen.has(ls[i].move)) { seen.add(ls[i].move); cand.push(ls[i]); }
          }
          const top = cand.slice(0, 8);
          if (!top.length) { DG.DialogueBox.show([`${monOpts[idx].split(' Lv.')[0]} already knows everything I can teach it.`], () => { _blocked = false; }); return; }
          if ((_gs.player.money || 0) < FEE) { DG.DialogueBox.show([`You need ¥${FEE}. Come back with more funds.`], () => { _blocked = false; }); return; }
          const mvOpts = top.map(L => DG.MOVES[L.move].name + '  (Lv.' + L.level + ')').concat(['Cancel']);
          DG.Menu.showChoiceMenu('Remember which move?\n(fee ¥' + FEE + ')', mvOpts, (mi) => {
            if (mi >= top.length) { _blocked = false; return; }
            const moveId = top[mi].move, mv = DG.MOVES[moveId];
            const learn = (slot) => {
              _gs.player.money = Math.max(0, (_gs.player.money || 0) - FEE);
              const entry = { moveId, ppCurrent: mv.pp || 10, ppMax: mv.pp || 10 };
              if (slot === -1) mon.moves.push(entry); else mon.moves[slot] = entry;
              DG.SaveLoad.save(_gs);
              DG.DialogueBox.show([`It remembered ${mv.name}!`, 'Pleasure doing business.'], () => { _blocked = false; });
            };
            if ((mon.moves || []).length < 4) { learn(-1); return; }
            const fOpts = mon.moves.map(s => (DG.MOVES[s.moveId] || {}).name || s.moveId).concat(['Cancel']);
            DG.Menu.showChoiceMenu('Forget which move?', fOpts, (fi) => {
              if (fi >= mon.moves.length) { _blocked = false; return; }
              learn(fi);
            });
          });
        });
      });
      return;
    }

    // onInteract: NAME_RATER — rename a party DinoMon (reuses the nickname screen).
    if (npc.onInteract === 'NAME_RATER') {
      const party = (_gs.player.party || []).filter(m => m && !m.isEgg);
      if (!party.length) { DG.DialogueBox.show(['A name shapes a soul! Bring me a DinoMon to rename.'], () => { _blocked = false; }); return; }
      DG.DialogueBox.show(['Name Rater: Every legend deserves a fitting name.', 'Whose name shall we reconsider — free of charge?'], () => {
        const opts = party.map(m => (m.nickname || (DG.SPECIES[m.speciesId] || {}).name || m.speciesId) + ' Lv.' + m.level).concat(['Cancel']);
        DG.Menu.showChoiceMenu('Rename which DinoMon?', opts, (idx) => {
          if (idx >= party.length) { _blocked = false; return; }
          window._NICKNAME_MON    = party[idx];
          window._NICKNAME_BUFFER = '';
          window._PENDING_RENAME  = true;   // polled by main.js → opens the nickname screen
          _blocked = false;
        });
      });
      return;
    }

    // onInteract: NIELS_CHALLENGE — beat the interns, then battle Niels for the
    // Compound Card (+50% prize money). After he's beaten he runs the Beachcoin exchange.
    if (npc.onInteract === 'NIELS_CHALLENGE') {
      const f = _gs.player.flags || {};
      const internsDone = f['TRAINER_NIELS_INTERN1_DEFEATED'] && f['TRAINER_NIELS_INTERN2_DEFEATED'];

      // Start the (all-shiny) Niels battle. isRematch=false the first time (awards the
      // Compound Card); true on every later rematch.
      const _startNielsBattle = (isRematch) => {
        const trainer = (isRematch && DG.TRAINERS.NIELS_REMATCH) ? DG.TRAINERS.NIELS_REMATCH : DG.TRAINERS.NIELS_BOSS;
        const firstEnemy = DG.SaveLoad.createDinoMon(trainer.party[0].speciesId, trainer.party[0].level);
        DG.Battle.start({
          type: 'TRAINER', enemy: firstEnemy, trainerData: trainer, gameState: _gs,
          onEnd: (result) => {
            if (result === 'WIN' && !isRematch) {
              DG.SaveLoad.setFlag(_gs, 'TRAINER_NIELS_BOSS_DEFEATED');
              _gs.player.bag = _gs.player.bag || {};
              _gs.player.bag.COMPOUND_CARD = (_gs.player.bag.COMPOUND_CARD || 0) + 1;
              DG.DialogueBox.show([
                "Daytrader Niels: Outstanding return! You've earned a seat at the big table.",
                "You received the COMPOUND CARD!",
                "Battle prize money is now boosted by 50%. Talk to me again to trade Beachcoin — or for a rematch!"],
                () => { _blocked = false; DG.SaveLoad.save(_gs); });
            } else if (result === 'WIN') {
              DG.DialogueBox.show([
                "Daytrader Niels: Beat my shinies AGAIN? Diamond hands, kid.",
                "The market's always open for a rematch."],
                () => { _blocked = false; DG.SaveLoad.save(_gs); });
            } else {
              DG.DialogueBox.show([trainer.winDialogue || "A dip in your portfolio. Come back when you've diversified."],
                () => { _blocked = false; });
            }
          }
        });
      };

      // Already beaten once → menu: rematch his shiny team, trade Beachcoin, or leave.
      if (f['TRAINER_NIELS_BOSS_DEFEATED']) {
        DG.DialogueBox.show(["Daytrader Niels: Back at the big table, I see. What'll it be?"], () => {
          if (typeof DG.Menu !== 'undefined' && DG.Menu.showChoiceMenu) {
            DG.Menu.showChoiceMenu('Daytrader Niels', ['Rematch (his shiny team!)', 'Trade Beachcoin', 'Leave'], (idx) => {
              if (idx === 0) {
                DG.DialogueBox.show(["Daytrader Niels: Think you can beat my shinies twice? Let's make a market!"],
                  () => { _startNielsBattle(true); });
              } else if (idx === 1) { _beachcoin(); }
              else { _blocked = false; }
            });
          } else { _beachcoin(); }
        });
        return;
      }

      if (!internsDone) {
        DG.DialogueBox.show([
          "Daytrader Niels: Ambitious, I like it!",
          "But first prove your worth — beat my interns, Bull and Bear.",
          "Then I'll invest a real battle in you."], () => { _blocked = false; });
        return;
      }
      // First challenge
      DG.DialogueBox.show([
        "Daytrader Niels: You cleared my portfolio. Impressive yield!",
        "Now face the fund manager himself — and feast your eyes on my all-shiny portfolio.",
        "Win, and the Compound Card is yours: prize money compounds +50%!"], () => {
        _startNielsBattle(false);
      });
      return;
    }

    // onInteract: OPEN_SHOP
    if (npc.onInteract === 'OPEN_SHOP' && npc.shopItems) {
      DG.Events.shopMenu(npc.shopItems, _gs, () => { _blocked = false; DG.SaveLoad.save(_gs); });
      return;
    }

    // onInteract: TRIGGER_STARTER (Dokter Timo gives starter DinoMon)
    if (npc.onInteract === 'TRIGGER_STARTER') {
      const dialogue = _getDialogue(npc);
      DG.DialogueBox.show(dialogue, () => {
        DG.Events.starterSelection(_gs, () => { _blocked = false; DG.SaveLoad.save(_gs); });
      });
      return;
    }

    // onInteract: TRIGGER_CHAMPION (Grand Archon — champion of trainer circuit, gives masterball)
    if (npc.onInteract === 'TRIGGER_CHAMPION') {
      const dialogue = _getDialogue(npc);
      DG.DialogueBox.show(dialogue, () => {
        const trainerId = npc.trainerRef || 'GRAND_ARCHON_CORVUS';
        const trainer = DG.TRAINERS && DG.TRAINERS[trainerId];
        if (trainer && !DG.SaveLoad.getFlag(_gs, `TRAINER_${trainerId}_DEFEATED`)) {
          const firstEnemy = DG.SaveLoad.createDinoMon(trainer.party[0].speciesId, trainer.party[0].level);
          DG.Battle.start({
            type: 'TRAINER', enemy: firstEnemy, trainerData: trainer, gameState: _gs,
            onEnd: (result) => {
              if (result === 'WIN') {
                DG.SaveLoad.setFlag(_gs, `TRAINER_${trainerId}_DEFEATED`);
                DG.SaveLoad.setFlag(_gs, 'CHAMPION_DEFEATED');
                // Give DinoMasterBall reward
                _gs.player.bag = _gs.player.bag || {};
                _gs.player.bag.DINOMASTERBALL = (_gs.player.bag.DINOMASTERBALL || 0) + 1;
                DG.SaveLoad.setFlag(_gs, 'MASTERBALL_GIVEN');
                DG.SaveLoad.setFlag(_gs, 'MEGA_AVAILABLE');
                const postLines = DG.STORY.DIALOGUES['GRAND_ARCHON_POST'] ||
                  ['You are the true Fossil Frontier Champion!', 'The Pangaea Archipelago shall never forget you.'];
                DG.DialogueBox.show([...postLines,
                  'Grand Archon Corvus gave you a DinoMaster Ball!',
                  'With it, you can catch any DinoMon — even the MEGA ones.',
                  'Now face Team Extinction\'s Director Clade at Mt. Cretaceous!'], () => {
                  _blocked = false;
                  DG.SaveLoad.save(_gs);
                });
              } else {
                // LOSE to the Champion — the entire Elite Four gauntlet resets.
                _resetEliteFour(_gs);
              }
            }
          });
        } else {
          // Already beaten — rematch or chat
          const postLines = DG.STORY.DIALOGUES['GRAND_ARCHON_WIN'] || ['The Fossil Citadel is yours, Champion.'];
          DG.DialogueBox.show(postLines, () => { _blocked = false; });
        }
      });
      return;
    }

    // onInteract: TRIGGER_FINAL_BOSS (Director Clade)
    if (npc.onInteract === 'TRIGGER_FINAL_BOSS') {
      const dialogue = _getDialogue(npc);
      DG.DialogueBox.show(dialogue, () => {
        const trainerId = npc.trainerRef || 'DIRECTOR_CLADE';
        const trainer = DG.TRAINERS && DG.TRAINERS[trainerId];
        if (trainer && !DG.SaveLoad.getFlag(_gs, `TRAINER_${trainerId}_DEFEATED`)) {
          const firstEnemy = DG.SaveLoad.createDinoMon(trainer.party[0].speciesId, trainer.party[0].level);
          DG.Battle.start({
            type: 'TRAINER', enemy: firstEnemy, trainerData: trainer, gameState: _gs,
            onEnd: (result) => {
              if (result === 'WIN') {
                DG.SaveLoad.setFlag(_gs, `TRAINER_${trainerId}_DEFEATED`);
                DG.SaveLoad.setFlag(_gs, 'DIRECTOR_CLADE_DEFEATED');
                const endLines = DG.STORY.DIALOGUES['DIRECTOR_CLADE_DEFEAT'] || DG.STORY.DIALOGUES['DIRECTOR_CLADE_DEFEATED'] || ['Team Extinction is defeated! The Pangaea Archipelago is saved!'];
                DG.DialogueBox.show(endLines, () => { _showCredits(); });
              } else {
                _blocked = false;
              }
            }
          });
        } else {
          _blocked = false;
        }
      });
      return;
    }

    // onInteract: TRIGGER_STORY (generic story triggers)
    if (npc.onInteract === 'TRIGGER_STORY') {
      const dialogue = _getDialogue(npc);
      DG.DialogueBox.show(dialogue, () => { _blocked = false; });
      return;
    }

    // onInteract: TRIGGER_DOUBLE_BATTLE — 2v2 story battle (Flint + Cretaceous vs Player + Morax)
    if (npc.onInteract === 'TRIGGER_DOUBLE_BATTLE') {
      const flags = _gs.player.flags || {};
      if (DG.SaveLoad.getFlag(_gs, 'DOUBLE_BATTLE_DONE')) {
        DG.DialogueBox.show(["Flint is gone. He left to stop Team Extinction from the inside."], () => { _blocked = false; });
        return;
      }
      // Determine Flint's starter variant
      const starterType = (typeof flags['STARTER_CHOSEN'] === 'string') ? flags['STARTER_CHOSEN'] : 'FIRE';
      const flintTrainer = DG.TRAINERS[`RIVAL_4_DOUBLE_${starterType}`] || DG.TRAINERS['RIVAL_4_DOUBLE_FIRE'];
      const cretaceousTrainer = DG.TRAINERS['CMD_CRETACEOUS_DOUBLE'];
      const moraxAlly = DG.TRAINERS['MORAX_ALLY'];
      if (!flintTrainer || !cretaceousTrainer || !moraxAlly) {
        DG.DialogueBox.show(["[Double battle data missing]"], () => { _blocked = false; });
        return;
      }
      const preLines = DG.STORY.DIALOGUES['DOUBLE_BATTLE_PRE'] || ["2v2 battle!"];
      DG.DialogueBox.show(preLines, () => {
        DG.Battle.startDouble({
          enemy1Trainer: flintTrainer,
          enemy2Trainer: cretaceousTrainer,
          allyTrainer:   moraxAlly,
          gameState:     _gs,
          onEnd: (result) => {
            if (result === 'WIN') {
              DG.SaveLoad.setFlag(_gs, 'DOUBLE_BATTLE_DONE');
              DG.SaveLoad.setFlag(_gs, 'FLINT_TURNED');
              const winLines = DG.STORY.DIALOGUES['DOUBLE_BATTLE_WIN'] || ['You won the double battle!'];
              _gs.player.money = (_gs.player.money || 0) + 1600;
              DG.DialogueBox.show(winLines, () => { _blocked = false; DG.SaveLoad.save(_gs); });
            } else {
              const loseLines = DG.STORY.DIALOGUES['DOUBLE_BATTLE_LOSE'] || ['You lost...'];
              DG.DialogueBox.show(loseLines, () => { _blocked = false; });
            }
          }
        });
      });
      return;
    }

    // onInteract: TRIGGER_RIVAL (Flint rival battle system)
    if (npc.onInteract === 'TRIGGER_RIVAL') {
      // Determine which encounter number based on flags set
      const flags = _gs.player.flags || {};
      let encounterNum = 1;
      if (flags['RIVAL_BATTLE_4_DONE'])      { encounterNum = 5; }
      else if (flags['RIVAL_BATTLE_3_DONE']) { encounterNum = 4; }
      else if (flags['RIVAL_BATTLE_2_DONE']) { encounterNum = 3; }
      else if (flags['RIVAL_BATTLE_1_DONE']) { encounterNum = 2; }

      // Safety floor: the NPC's own trainerRef encodes the minimum encounter number.
      // e.g. 'RIVAL_2_FIRE' → minimum 2.  Prevents showing a Lv5 solo battle at a
      // post-Gym-2 map position just because an earlier flag was never set.
      if (npc.trainerRef) {
        const m = npc.trainerRef.match(/RIVAL_(\d+)_/);
        if (m) encounterNum = Math.max(encounterNum, parseInt(m[1], 10));
      }

      // Determine starter variant — value stored as 'FIRE', 'GRASS', or 'WATER'
      const starterType = (typeof flags['STARTER_CHOSEN'] === 'string')
        ? flags['STARTER_CHOSEN']
        : 'FIRE';
      const trainerId = `RIVAL_${encounterNum}_${starterType}`;
      const trainer = DG.TRAINERS && DG.TRAINERS[trainerId];
      if (!trainer) {
        // Fallback: just show dialogue
        const dialogue = _getDialogue(npc);
        DG.DialogueBox.show(dialogue, () => { _blocked = false; });
        return;
      }

      // Show intro dialogue before battle
      const _lookupDialogue = (d) => {
        if (!d) return null;
        if (typeof d === 'string') return DG.STORY.DIALOGUES[d] || [d];
        return d;
      };
      const preLines = _lookupDialogue(trainer.preBattleDialogue) || [`Flint wants to battle!`];
      // FASE 7: bij de állereerste ontmoeting vraagt de professor eerst de naam
      const _maybeAskName = (encounterNum === 1) ? _ensureRivalNamed : (cb) => cb();
      _maybeAskName(() => {
      DG.DialogueBox.show(preLines, () => {
        const firstEnemy = DG.SaveLoad.createDinoMon(trainer.party[0].speciesId, trainer.party[0].level);
        DG.Battle.start({
          type: 'TRAINER', enemy: firstEnemy, trainerData: trainer, gameState: _gs,
          onEnd: (result) => {
            const doneFlag = `RIVAL_BATTLE_${encounterNum}_DONE`;
            if (result === 'WIN') {
              DG.SaveLoad.setFlag(_gs, doneFlag);
              DG.SaveLoad.setFlag(_gs, `TRAINER_${trainerId}_DEFEATED`);
              const postKey = `RIVAL_POST_${encounterNum}_WIN`;
              const postLines = DG.STORY.DIALOGUES[postKey] || [trainer.loseDialogue || 'Well battled!'];
              DG.DialogueBox.show(postLines, () => {
                _blocked = false;
                DG.SaveLoad.save(_gs);
              });
            } else {
              // Player lost
              const loseKey = `RIVAL_POST_${encounterNum}_LOSE`;
              const loseLines = DG.STORY.DIALOGUES[loseKey] || [trainer.winDialogue || 'Train harder!'];
              DG.DialogueBox.show(loseLines, () => { _blocked = false; });
            }
          }
        });
      });
      }); // einde _maybeAskName (FASE 7)
      return;
    }

    // onInteract: GIFT_MON — NPC gives a specific DinoMon (once)
    if (npc.onInteract === 'GIFT_MON') {
      const flagKey = npc.giftFlag || `GIFT_${npc.giftSpecies || 'MON'}_GIVEN`;
      if (DG.SaveLoad.getFlag(_gs, flagKey)) {
        const dialogue = npc.alreadyGivenDialogue || ["You've already received that DinoMon!"];
        const lines = typeof dialogue === 'string' ? [dialogue] : dialogue;
        DG.DialogueBox.show(lines, () => { _blocked = false; });
        return;
      }
      const dialogue = _getDialogue(npc);
      DG.DialogueBox.show(dialogue, () => {
        const speciesId = npc.giftSpecies || 'NORMLET';
        const level     = npc.giftLevel   || 5;
        const nickname  = npc.giftNickname || null;
        if (_gs.player.party.length >= 6) {
          DG.DialogueBox.show(["Your party is full! Come back when you have room."], () => { _blocked = false; });
          return;
        }
        const mon = DG.SaveLoad.createDinoMon(speciesId, level, nickname);
        if (mon) {
          _gs.player.party.push(mon);
          DG.SaveLoad.markCaught(_gs, speciesId);
          DG.SaveLoad.setFlag(_gs, flagKey);
          const name = mon.nickname || DG.SPECIES[speciesId]?.name || speciesId;
          DG.DialogueBox.show([`You received ${name}!`, `Take good care of it!`], () => {
            _blocked = false;
            DG.SaveLoad.save(_gs);
          });
        } else {
          _blocked = false;
        }
      });
      return;
    }

    // onInteract: NPC_TRADE — trade a specific DinoMon to get a different one (once)
    if (npc.onInteract === 'NPC_TRADE') {
      const flagKey = npc.tradeFlag || `TRADE_${npc.tradeWant}_DONE`;
      if (DG.SaveLoad.getFlag(_gs, flagKey)) {
        DG.DialogueBox.show(npc.alreadyTradedDialogue || ["We've already made our trade!"], () => { _blocked = false; });
        return;
      }
      const want    = npc.tradeWant;   // speciesId player must offer
      const offer   = npc.tradeOffer;  // speciesId NPC gives in return
      const offerLv = npc.tradeLevel   || 15;
      // Check if player has the required mon
      const partyIdx = _gs.player.party.findIndex(m => m && m.hp.current > 0 && m.speciesId === want);
      const wantName  = DG.SPECIES[want]?.name  || want;
      const offerName = DG.SPECIES[offer]?.name || offer;
      if (partyIdx < 0) {
        DG.DialogueBox.show(npc.dialogue || [`I want to trade for a ${wantName}. Do you have one?`], () => { _blocked = false; });
        return;
      }
      // Confirm trade via choice menu
      const dialogue = _getDialogue(npc);
      DG.DialogueBox.show([...dialogue, `Trade your ${wantName} for my ${offerName}?`], () => {
        if (typeof DG.Menu !== 'undefined' && DG.Menu.showChoiceMenu) {
          DG.Menu.showChoiceMenu('Make the trade?', ['Yes! Trade!', 'No thanks'], (idx) => {
            if (idx !== 0) { _blocked = false; return; }
            // Remove player mon, give NPC mon
            _gs.player.party.splice(partyIdx, 1);
            const newMon = DG.SaveLoad.createDinoMon(offer, offerLv, npc.tradeNickname || null);
            if (newMon && _gs.player.party.length < 6) {
              _gs.player.party.push(newMon);
              DG.SaveLoad.markCaught(_gs, offer);
            }
            DG.SaveLoad.setFlag(_gs, flagKey);
            // Check for trade evolution on the received mon
            const tradeEvoTarget = DG.TRADE_EVOLUTIONS && DG.TRADE_EVOLUTIONS[offer];
            const heldEvoTable   = DG.HELD_ITEM_EVOLUTIONS && DG.HELD_ITEM_EVOLUTIONS[offer];
            const heldEvoTarget  = (heldEvoTable && newMon && newMon.heldItem === heldEvoTable.item)
              ? heldEvoTable.evolves : null;
            const evoTarget      = heldEvoTarget || tradeEvoTarget;
            if (evoTarget && newMon && DG.SPECIES[evoTarget]) {
              const prevName  = offerName;
              const afterName = DG.SPECIES[evoTarget].name || evoTarget;
              newMon.speciesId = evoTarget;
              DG.SaveLoad.recalcStats(newMon);
              DG.SaveLoad.markCaught(_gs, evoTarget);
              DG.DialogueBox.show([
                `${wantName} was traded away!`,
                `You received ${prevName}!`,
                `${prevName} is evolving!`,
                `${prevName} evolved into ${afterName}!`,
              ], () => {
                _blocked = false;
                DG.SaveLoad.save(_gs);
              });
            } else {
              DG.DialogueBox.show([`${wantName} was traded away!`, `You received ${offerName}!`], () => {
                _blocked = false;
                DG.SaveLoad.save(_gs);
              });
            }
          });
        } else {
          _blocked = false;
        }
      });
      return;
    }

    // onInteract: MOVE_TUTOR — teach a specific move for free/money/item
    if (npc.onInteract === 'MOVE_TUTOR') {
      const moveId   = npc.tutorMove;
      const moveDef  = moveId && DG.MOVES[moveId];
      if (!moveDef) {
        DG.DialogueBox.show(["I've already taught everything I know."], () => { _blocked = false; });
        return;
      }
      const cost     = npc.tutorCost     || 0;
      const costItem = npc.tutorCostItem || null; // itemId or null for money
      const moveName = moveDef.name || moveId;

      // Check what the tutor wants
      let canAfford = true;
      if (costItem) {
        canAfford = (_gs.player.bag[costItem] || 0) >= 1;
      } else if (cost > 0) {
        canAfford = (_gs.player.money || 0) >= cost;
      }

      const priceStr = costItem
        ? `1 ${DG.ITEMS[costItem]?.name || costItem}`
        : (cost > 0 ? `$${cost}` : 'free');

      DG.DialogueBox.show(
        npc.dialogue
          ? _getDialogue(npc)
          : [`I can teach ${moveName} to one of your DinoMons for ${priceStr}!`],
        () => {
          if (!canAfford) {
            DG.DialogueBox.show([`You can't afford ${moveName} right now.`], () => { _blocked = false; });
            return;
          }
          // Pick a party mon to teach via choice menu
          const party = _gs.player.party.filter(m => m && m.hp.current > 0);
          if (!party.length) { _blocked = false; return; }
          const monNames = party.map(m => m.nickname || DG.SPECIES[m.speciesId]?.name || m.speciesId);
          monNames.push('Cancel');
          if (typeof DG.Menu !== 'undefined' && DG.Menu.showChoiceMenu) {
            DG.Menu.showChoiceMenu(`Teach ${moveName} to:`, monNames, (idx) => {
              if (idx >= party.length) { _blocked = false; return; } // Cancel
              const selectedMon = party[idx];
              // Deduct cost
              if (costItem) {
                DG.SaveLoad.removeItem(_gs, costItem, 1);
              } else if (cost > 0) {
                _gs.player.money = Math.max(0, (_gs.player.money || 0) - cost);
              }
              // Teach the move
              _teachMove(selectedMon, moveId, moveDef, () => { _blocked = false; DG.SaveLoad.save(_gs); });
            });
          } else {
            _blocked = false;
          }
        }
      );
      return;
    }

    // onInteract: GIVE_MASTERBALL (post-game champion reward)
    if (npc.onInteract === 'GIVE_MASTERBALL') {
      const dialogue = _getDialogue(npc);
      DG.DialogueBox.show(dialogue, () => {
        _gs.player.bag = _gs.player.bag || {};
        _gs.player.bag.DINOMASTERBALL = (_gs.player.bag.DINOMASTERBALL || 0) + 1;
        DG.SaveLoad.setFlag(_gs, 'MASTERBALL_GIVEN');
        DG.SaveLoad.setFlag(_gs, 'MEGA_AVAILABLE');
        DG.DialogueBox.show(['You received the DinoMaster Ball!', 'It never fails to catch any DinoMon — even the MEGA ones.'], () => {
          _blocked = false;
          DG.SaveLoad.save(_gs);
        });
      });
      return;
    }

    // onInteract: SIDE_QUEST — lightweight repeatable quest framework.
    // NPC fields: questFlag, questDoneFlag, questIntro[], questReminder[],
    // questSuccess[], questThanks[], questCheck{type,value}, reward{item,qty,money}.
    if (npc.onInteract === 'SIDE_QUEST') {
      if (npc.questDoneFlag && DG.SaveLoad.getFlag(_gs, npc.questDoneFlag)) {
        DG.DialogueBox.show(npc.questThanks || ["Thanks again for your help!"], () => { _blocked = false; });
        return;
      }
      const started = npc.questFlag && DG.SaveLoad.getFlag(_gs, npc.questFlag);
      if (!started) {
        if (npc.questFlag) DG.SaveLoad.setFlag(_gs, npc.questFlag);
        DG.DialogueBox.show(npc.questIntro || ["Could you help me with something?"], () => { _blocked = false; DG.SaveLoad.save(_gs); });
        return;
      }
      if (!_checkQuest(npc.questCheck)) {
        DG.DialogueBox.show(npc.questReminder || ["Come back once you've managed it!"], () => { _blocked = false; });
        return;
      }
      if (npc.questDoneFlag) DG.SaveLoad.setFlag(_gs, npc.questDoneFlag);
      _giveQuestReward(npc.reward);
      DG.DialogueBox.show((npc.questSuccess || ["Thank you so much!"]).concat(_rewardText(npc.reward)), () => { _blocked = false; DG.SaveLoad.save(_gs); });
      return;
    }

    // onInteract: LEGEND_CLUE — a lore NPC that records one clue toward a legendary.
    // After the lore, shows clear progress: "<Legend>: 2/3 clues gathered".
    if (npc.onInteract === 'LEGEND_CLUE') {
      const lines = _getDialogue(npc);
      const group = npc.clueGroup || (npc.clueFlag ? [npc.clueFlag] : []);
      const already = npc.clueFlag && DG.SaveLoad.getFlag(_gs, npc.clueFlag);
      DG.DialogueBox.show(lines, () => {
        if (npc.clueFlag && !already) {
          DG.SaveLoad.setFlag(_gs, npc.clueFlag);
          try { DG.SaveLoad.save(_gs); } catch (e) {}
        }
        const have = group.filter((f) => DG.SaveLoad.getFlag(_gs, f)).length;
        const total = group.length || 1;
        const nm = npc.legendName || 'a legendary';
        const tail = [];
        tail.push('★ ' + nm + ' — clue ' + have + ' of ' + total + ' gathered.' + (already ? ' (already known)' : ''));
        if (have >= total) tail.push('All clues found! ' + (npc.shrineHint || 'Seek its shrine.'));
        else tail.push('Find the other clues in nearby towns.');
        DG.DialogueBox.show(tail, () => { _blocked = false; });
      });
      return;
    }

    // onInteract: LEGEND_SHRINE — wakes a legendary once all its clues are gathered.
    // Fields: legendSpecies, legendLevel, clueFlags[], caughtFlag, *Dialogue lines.
    if (npc.onInteract === 'LEGEND_SHRINE') {
      const f = _gs.player.flags || {};
      if (npc.caughtFlag && f[npc.caughtFlag]) {
        DG.DialogueBox.show(npc.restDialogue || ['The shrine is silent. Its guardian already walks beside you.'], () => { _blocked = false; });
        return;
      }
      const clues = npc.clueFlags || [];
      const have = clues.filter((c) => f[c]).length;
      if (have < clues.length) {
        DG.DialogueBox.show([
          npc.dormantLine || 'Ancient carvings cover the shrine, but it lies dormant.',
          'Legends gathered: ' + have + ' of ' + clues.length + '. Seek the rest across the cities.'
        ], () => { _blocked = false; });
        return;
      }
      DG.DialogueBox.show(npc.awakenDialogue || ['The shrine blazes to life — its guardian answers your call!'], () => {
        const sid = npc.legendSpecies;
        const mon = DG.SaveLoad.createDinoMon(sid, npc.legendLevel || 55);
        if (!mon) { _blocked = false; return; }
        try { DG.SaveLoad.markSeen(_gs, sid); } catch (e) {}
        DG.Battle.start({
          type: 'WILD', enemy: mon, gameState: _gs,
          onEnd: (result) => {
            if (result === 'CAUGHT') {
              if (npc.caughtFlag) DG.SaveLoad.setFlag(_gs, npc.caughtFlag);
              const nm = (DG.SPECIES[sid] && DG.SPECIES[sid].name) || 'The legend';
              DG.DialogueBox.show([nm + ' has joined you!', 'A legend now answers to your bond.'], () => { _blocked = false; DG.SaveLoad.save(_gs); });
            } else {
              DG.DialogueBox.show(['It slipped away into legend once more...', 'The shrine still hums — it will return.'], () => { _blocked = false; });
            }
          }
        });
      });
      return;
    }

    // onInteract: TRIGGER_PRIMORDIA (post-game legendary encounter)
    if (npc.onInteract === 'TRIGGER_PRIMORDIA') {
      const dialogue = _getDialogue(npc);
      DG.DialogueBox.show(dialogue, () => {
        DG.SaveLoad.setFlag(_gs, 'PRIMORDIA_ENCOUNTERED');
        const primordia = DG.SaveLoad.createDinoMon('PRIMORDIA', 70);
        DG.Battle.start({
          type: 'WILD', enemy: primordia, gameState: _gs,
          onEnd: (result) => {
            if (result === 'CAUGHT') {
              DG.DialogueBox.show(['PRIMORDIA has joined your team!', 'One of the three Legendary DinoMon now walks with you.'], () => { _blocked = false; DG.SaveLoad.save(_gs); });
            } else {
              DG.DialogueBox.show(['PRIMORDIA vanished back into the fossil vault...', 'Perhaps it will return someday.'], () => { _blocked = false; });
            }
          }
        });
      });
      return;
    }

    // onInteract: TRIGGER_CRATERON (post-game legendary encounter)
    if (npc.onInteract === 'TRIGGER_CRATERON') {
      const dialogue = _getDialogue(npc);
      DG.DialogueBox.show(dialogue, () => {
        DG.SaveLoad.setFlag(_gs, 'CRATERON_AVAILABLE');
        const crateron = DG.SaveLoad.createDinoMon('CRATERON', 70);
        DG.Battle.start({
          type: 'WILD', enemy: crateron, gameState: _gs,
          onEnd: (result) => {
            if (result === 'CAUGHT') {
              DG.SaveLoad.setFlag(_gs, 'CRATERON_CAUGHT');
              DG.DialogueBox.show(['CRATERON has joined your team!', 'The Primordial Flame burns for you now.', 'One of the three Legendary DinoMon now fights at your side.'], () => { _blocked = false; DG.SaveLoad.save(_gs); });
            } else {
              DG.DialogueBox.show(['CRATERON retreated into the magma depths...', 'The Warden says it may return when you are stronger.'], () => { _blocked = false; });
            }
          }
        });
      });
      return;
    }

    // onInteract: OPEN_PC — opens the DinoBox storage PC
    if (npc.onInteract === 'OPEN_PC') {
      if (typeof DG.BoxUI !== 'undefined') {
        DG.DialogueBox.show(['Welcome to the DinoMon Storage System!'], () => {
          DG.BoxUI.open(_gs, () => {
            _blocked = false;
            DG.SaveLoad.save(_gs);
          });
          // Signal main.js to switch to BOX_UI state
          DG.Overworld._pendingBoxUI = true;
        });
      } else {
        DG.DialogueBox.show(['PC Box storage is not available.'], () => { _blocked = false; });
      }
      return;
    }

    // onInteract: IV_JUDGE — NPC rates your lead DinoMon's IVs
    if (npc.onInteract === 'IV_JUDGE') {
      const lead = _gs.player.party[0];
      if (!lead || lead.isEgg) {
        DG.DialogueBox.show(["Bring me a DinoMon to assess!"], () => { _blocked = false; });
        return;
      }
      const ivs = lead.ivs || {};
      const total = Object.values(ivs).reduce((a, b) => a + b, 0);
      const best  = Object.entries(ivs).sort(([,a],[,b]) => b - a).slice(0, 2);
      const name  = lead.nickname || DG.SPECIES[lead.speciesId]?.name || lead.speciesId;
      const rateTotal = total >= 151 ? 'Outstanding potential!' : total >= 121 ? 'Very high potential.' : total >= 91 ? 'Above-average potential.' : 'Decent potential.';
      const statNames = { hp:'HP', atk:'Attack', def:'Defense', spAtk:'Sp.Attack', spDef:'Sp.Defense', spd:'Speed' };
      const rateIV = iv => iv === 31 ? 'Best!' : iv >= 26 ? 'Fantastic' : iv >= 21 ? 'Very Good' : iv >= 11 ? 'Pretty Good' : iv >= 1 ? 'Decent' : 'No Good';
      const lines = [
        `Let me assess ${name}...`,
        rateTotal,
        `${statNames[best[0][0]] || best[0][0]}: ${rateIV(best[0][1])}`,
        `${statNames[best[1][0]] || best[1][0]}: ${rateIV(best[1][1])}`,
        `Overall IVs: ${total}/186`,
      ];
      DG.DialogueBox.show(lines, () => { _blocked = false; });
      return;
    }

    // onInteract: DAYCARE — deposit/withdraw DinoMons at the Day Care
    if (npc.onInteract === 'DAYCARE') {
      _daycareTalk();
      return;
    }

    // onInteract: TRIGGER_GYM_QUIZ — quiz NPC opens A/B choice, sets answer flags
    if (npc.onInteract === 'TRIGGER_GYM_QUIZ') {
      const correctFlag = npc.quizCorrectFlag;
      const wrongFlag   = npc.quizWrongFlag;
      const doneFlag    = npc.quizDoneFlag;

      // Already answered — show recap
      if (doneFlag && DG.SaveLoad.getFlag(_gs, doneFlag)) {
        const alreadyLines = (npc.dialogue && npc.dialogue.length)
          ? _getDialogue(npc)
          : ["You've already answered this question! Move along."];
        DG.DialogueBox.show(alreadyLines, () => { _blocked = false; });
        return;
      }

      // Intro + choice menu
      const introKey = npc.quizIntroKey;
      const introLines = (introKey && DG.STORY.DIALOGUES[introKey])
        ? DG.STORY.DIALOGUES[introKey]
        : ["A question stands between you and the next challenge!"];
      const question = npc.quizQuestion || 'Choose your answer:';

      // Build the answer pool. The correct answer is always stored in quizOptionA;
      // distractors come from quizWrong[] (fallback: the legacy quizOptionB).
      // Letter prefixes ("A) ") are stripped and re-applied per shuffled position,
      // so the correct answer lands in a random slot each time.
      const _strip = (s) => String(s == null ? '' : s).replace(/^[A-E]\)\s*/, '').trim();
      const correctText = _strip(npc.quizOptionA) || 'Correct';
      let wrongs = Array.isArray(npc.quizWrong) ? npc.quizWrong.slice()
                 : (npc.quizOptionB ? [npc.quizOptionB] : []);
      wrongs = wrongs.map(_strip).filter(w => w && w.toLowerCase() !== correctText.toLowerCase());
      // De-dupe distractors
      wrongs = wrongs.filter((w, i) => wrongs.findIndex(x => x.toLowerCase() === w.toLowerCase()) === i);
      const pool = [correctText, ...wrongs];
      // Fisher–Yates shuffle (Math.random is fine in the browser)
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const t = pool[i]; pool[i] = pool[j]; pool[j] = t;
      }
      const correctIdx = pool.indexOf(correctText);
      const LETTERS = ['A', 'B', 'C', 'D', 'E'];
      const labels = pool.map((t, i) => `${LETTERS[i]}) ${t}`);

      DG.DialogueBox.show(introLines, () => {
        if (typeof DG.Menu !== 'undefined' && DG.Menu.showChoiceMenu) {
          DG.Menu.showChoiceMenu(question, labels, (idx) => {
            const isCorrect = (idx === correctIdx);
            if (isCorrect) {
              if (correctFlag) DG.SaveLoad.setFlag(_gs, correctFlag);
              if (doneFlag)    DG.SaveLoad.setFlag(_gs, doneFlag);
              const respKey = npc.correctResponse;
              const respLines = (respKey && DG.STORY.DIALOGUES[respKey])
                ? DG.STORY.DIALOGUES[respKey]
                : ["Correct! The shorter path opens for you."];
              DG.DialogueBox.show(respLines, () => { _blocked = false; DG.SaveLoad.save(_gs); });
            } else {
              if (wrongFlag) DG.SaveLoad.setFlag(_gs, wrongFlag);
              if (doneFlag)  DG.SaveLoad.setFlag(_gs, doneFlag);
              const respKey = npc.wrongResponse;
              const respLines = (respKey && DG.STORY.DIALOGUES[respKey])
                ? DG.STORY.DIALOGUES[respKey]
                : ["Wrong! The longer path awaits you..."];
              DG.DialogueBox.show(respLines, () => { _blocked = false; DG.SaveLoad.save(_gs); });
            }
          });
        } else {
          _blocked = false;
        }
      });
      return;
    }

    // onInteract: REMATCH_TRAINER — Training Grounds sparring partner. Battles every
    // time you talk to them (defeat flag is ignored and never set), so players can
    // grind EXP/money to bridge the gap up to the Elite Four.
    if (npc.onInteract === 'REMATCH_TRAINER' && npc.trainerRef) {
      const rTrainer = DG.TRAINERS[npc.trainerRef];
      if (!rTrainer) { _blocked = false; return; }
      const _rl = (d) => !d ? null : (typeof d === 'string' ? (DG.STORY.DIALOGUES[d] || [d]) : d);
      DG.DialogueBox.show(_rl(rTrainer.preBattleDialogue) || [`${rTrainer.name} wants to battle!`], () => {
        const firstEnemy = DG.SaveLoad.createDinoMon(rTrainer.party[0].speciesId, rTrainer.party[0].level, null, rTrainer.party[0].moves);
        DG.Battle.start({
          type: 'TRAINER', enemy: firstEnemy, trainerData: rTrainer, gameState: _gs,
          onEnd: (result) => {
            const post = (result === 'WIN')
              ? (_rl(rTrainer.postBattleDialogue) || ['Good bout! Talk to me whenever you want another round.'])
              : (_rl(rTrainer.winDialogue) || ['Rest up at the attendant and try me again!']);
            DG.DialogueBox.show(post, () => { _blocked = false; DG.SaveLoad.save(_gs); });
          }
        });
      });
      return;
    }

    // Trainer / Gym leader battle (support both trainerId and trainerRef)
    const trainerId = npc.trainerRef || npc.trainerId;
    if (trainerId && !DG.SaveLoad.getFlag(_gs, `TRAINER_${trainerId}_DEFEATED`)) {
      const trainer = DG.TRAINERS[trainerId];
      if (trainer) {
        const isGymLeader = !!trainer.isGymLeader;  // fix: was badge!=null, inconsistent with _updateTrainerAlert which uses isGymLeader
        const _lookupDialogue = (d) => {
          if (!d) return null;
          if (typeof d === 'string') return DG.STORY.DIALOGUES[d] || [d];
          return d;
        };
        const lines = _lookupDialogue(trainer.preBattleDialogue) || [`${trainer.name} wants to battle!`];
        // Store gymId for reset on loss (Feature 1)
        if (trainer.gymId) {
          _gs.player._lastGymId = trainer.gymId;
        } else {
          _gs.player._lastGymId = null;
        }
        DG.DialogueBox.show(lines, () => {
          const firstEnemy = DG.SaveLoad.createDinoMon(trainer.party[0].speciesId, trainer.party[0].level);
          DG.Battle.start({
            type: 'TRAINER', enemy: firstEnemy, trainerData: trainer, gameState: _gs,
            onEnd: (result) => {
              if (result === 'WIN') {
                DG.SaveLoad.setFlag(_gs, `TRAINER_${trainerId}_DEFEATED`);
                // Award gym badge
                if (isGymLeader && trainer.badge) {
                  DG.SaveLoad.awardBadge(_gs, trainer.badge);
                  const badgeCount = (_gs.player.badges || []).length;
                  DG.SaveLoad.setFlag(_gs, 'BADGE_' + badgeCount);
                  _awardGymFieldMove(_gs, badgeCount);
                }
                // Elite Four chain flags
                if (trainerId === 'ELITE_AURORA')  { DG.SaveLoad.setFlag(_gs, 'ELITE_1_DONE'); }
                if (trainerId === 'ELITE_EMBER')   { DG.SaveLoad.setFlag(_gs, 'ELITE_2_DONE'); }
                if (trainerId === 'ELITE_GARNET')  { DG.SaveLoad.setFlag(_gs, 'ELITE_3_DONE'); }
                if (trainerId === 'ELITE_PHANTOM') {
                  DG.SaveLoad.setFlag(_gs, 'ELITE_4_DONE');
                  DG.DialogueBox.show(
                    ['You have defeated ALL FOUR Elite Four!', 'Grand Archon Corvus, the Champion, now awaits you!'],
                    () => {}
                  );
                }
                const postLines = _lookupDialogue(trainer.postBattleDialogue) || [trainer.loseDialogue || 'Well battled!'];
                if (isGymLeader) {
                  const bc = (_gs.player.badges || []).length;
                  _badgeCeremony(bc, () => {
                    DG.DialogueBox.show(postLines, () => { _blocked = false; DG.SaveLoad.save(_gs); });
                  });
                } else {
                  DG.DialogueBox.show(postLines, () => { _blocked = false; DG.SaveLoad.save(_gs); });
                }
              } else {
                // LOSE — Elite Four / Champion wipe resets the whole gauntlet;
                // otherwise a gym loss resets that gym's trainers.
                if (trainer.class === 'Elite Four' || trainer.class === 'Champion') {
                  _resetEliteFour(_gs);
                } else {
                  const lostGymId = _gs.player._lastGymId;
                  if (lostGymId) {
                    _resetGymTrainers(_gs, lostGymId);
                    _gs.player._lastGymId = null;
                  } else {
                    _blocked = false;
                  }
                }
              }
            }
          });
        });
        return;
      }
    }

    // Already defeated trainer/gym leader — show post-battle or generic dialogue
    if (trainerId && DG.SaveLoad.getFlag(_gs, `TRAINER_${trainerId}_DEFEATED`)) {
      const trainer = DG.TRAINERS[trainerId];
      if (trainer) {
        const _ld = (d) => { if (!d) return null; if (typeof d === 'string') return DG.STORY.DIALOGUES[d] || [d]; return d; };
        // Sensible, varied fallback for a DEFEATED trainer (picked deterministically
        // per trainer so the same one always says the same thing).
        const _DEFEATED_LINES = [
          ["That was a great battle. Well fought!"],
          ["You and your DinoMon are tough. I'll train harder!"],
          ["I still can't believe I lost... You're strong!"],
          ["Come back anytime for a rematch!"],
          ["Your bond with your DinoMon is impressive."],
          ["You beat me fair and square. Nice work!"],
        ];
        let _h = 0;
        for (let _i = 0; _i < trainerId.length; _i++) _h = (_h * 31 + trainerId.charCodeAt(_i)) | 0;
        const _fallback = _DEFEATED_LINES[Math.abs(_h) % _DEFEATED_LINES.length];
        const lines = _ld(trainer.postBattleDialogue) || _fallback;
        DG.DialogueBox.show(lines, () => { _blocked = false; });
        return;
      }
    }

    // Regular dialogue
    const dialogue = _getDialogue(npc);
    DG.DialogueBox.show(dialogue, () => { _blocked = false; });
  }

  // ── Trainer line-of-sight ─────────────────────────────────
  function _checkTrainerSight() {
    if (!_mapData || !_mapData.npcs) return;
    const px = _gs.player.x, py = _gs.player.y;
    for (const npc of _mapData.npcs) {
      // Only trainers with a trainerRef that haven't been defeated
      if (!npc.trainerRef) continue;
      // Rematch sparring partners never auto-engage — interaction only.
      if (npc.onInteract === 'REMATCH_TRAINER') continue;
      const flagKey = `TRAINER_${npc.trainerRef}_DEFEATED`;
      if (DG.SaveLoad.getFlag(_gs, flagKey)) continue;

      // Check if player is in trainer's line of sight
      const dx = px - npc.x, dy = py - npc.y;
      let inSight = false;
      if (npc.facing === 'UP'    && dx === 0 && dy < 0 && dy >= -TRAINER_SIGHT) inSight = true;
      if (npc.facing === 'DOWN'  && dx === 0 && dy > 0 && dy <= TRAINER_SIGHT)  inSight = true;
      if (npc.facing === 'LEFT'  && dy === 0 && dx < 0 && dx >= -TRAINER_SIGHT) inSight = true;
      if (npc.facing === 'RIGHT' && dy === 0 && dx > 0 && dx <= TRAINER_SIGHT)  inSight = true;

      if (!inSight) continue;

      // Check line of sight isn't blocked by solid tiles
      let blocked = false;
      const steps = Math.max(Math.abs(dx), Math.abs(dy));
      const stepX = dx === 0 ? 0 : (dx > 0 ? 1 : -1);
      const stepY = dy === 0 ? 0 : (dy > 0 ? 1 : -1);
      for (let s = 1; s < steps; s++) {
        const tx = npc.x + stepX * s, ty = npc.y + stepY * s;
        if (_isSolid(_getTile(tx, ty))) { blocked = true; break; }
      }
      if (blocked) continue;

      // Trainer spots player!
      _trainerAlert = { npc, timer: 50, phase: 'ALERT', walkSteps: 0, walkTimer: 0 };
      _blocked = true;
      // Make trainer face player
      if      (dy < 0) npc.facing = 'UP';
      else if (dy > 0) npc.facing = 'DOWN';
      else if (dx < 0) npc.facing = 'LEFT';
      else             npc.facing = 'RIGHT';
      try { if (typeof DG.Audio !== 'undefined') DG.Audio.playSfx('TRAINER_SPOT'); } catch(e) {}
      return; // only spot one trainer per step
    }
  }

  function _updateTrainerAlert() {
    if (!_trainerAlert) return;

    const npc = _trainerAlert.npc;

    // ── Phase: ALERT (show exclamation mark, wait ~50 frames) ──
    if (_trainerAlert.phase === 'ALERT') {
      _trainerAlert.timer--;
      if (_trainerAlert.timer <= 0) {
        // Transition to WALK phase
        _trainerAlert.phase = 'WALK';
        _trainerAlert.walkSteps = 0;
        _trainerAlert.walkTimer = 0;
      }
      return;
    }

    // ── Phase: WALK (trainer steps toward player, up to 3 steps, 1 per 12 frames) ──
    if (_trainerAlert.phase === 'WALK') {
      _trainerAlert.walkTimer++;
      if (_trainerAlert.walkTimer >= 12) {
        _trainerAlert.walkTimer = 0;
        const px = _gs.player.x, py = _gs.player.y;
        const dx = px - npc.x, dy = py - npc.y;
        // Stop walking when adjacent (1 tile away)
        const dist = Math.abs(dx) + Math.abs(dy);
        if (dist <= 1 || _trainerAlert.walkSteps >= 3) {
          // Done walking — go to TALK phase
          _trainerAlert.phase = 'TALK';
        } else {
          // Move one tile toward player
          let stepX = 0, stepY = 0;
          if (Math.abs(dx) >= Math.abs(dy)) {
            stepX = dx > 0 ? 1 : -1;
          } else {
            stepY = dy > 0 ? 1 : -1;
          }
          const nx = npc.x + stepX, ny = npc.y + stepY;
          // Only step if not blocked
          if (!_isSolid(_getTile(nx, ny)) && !_npcAt(nx, ny)) {
            npc.x = nx; npc.y = ny;
          }
          _trainerAlert.walkSteps++;
        }
      }
      return;
    }

    // ── Phase: TALK (show dialogue, then start battle) ──
    if (_trainerAlert.phase === 'TALK') {
      _trainerAlert.phase = 'BATTLE'; // prevent re-entry
      const trainerId = npc.trainerRef;
      const trainer = DG.TRAINERS && DG.TRAINERS[trainerId];
      if (!trainer) { _trainerAlert = null; _blocked = false; return; }

      const lines = (typeof trainer.preBattleDialogue === 'string'
        ? DG.STORY.DIALOGUES[trainer.preBattleDialogue] || [trainer.preBattleDialogue]
        : trainer.preBattleDialogue) || [`${trainer.name} wants to battle!`];

      // Store gymId for reset on loss (Feature 1)
      if (trainer.gymId) {
        _gs.player._lastGymId = trainer.gymId;
      } else {
        _gs.player._lastGymId = null;
      }

      DG.DialogueBox.show(lines, () => {
        const firstEnemy = DG.SaveLoad.createDinoMon(trainer.party[0].speciesId, trainer.party[0].level);
        DG.Battle.start({
          type: 'TRAINER', enemy: firstEnemy, trainerData: trainer, gameState: _gs,
          onEnd: (result) => {
            if (result === 'WIN') {
              DG.SaveLoad.setFlag(_gs, `TRAINER_${trainerId}_DEFEATED`);
              if (trainer.isGymLeader && trainer.badge) {
                DG.SaveLoad.awardBadge(_gs, trainer.badge);
                const badgeCount = (_gs.player.badges || []).length;
                DG.SaveLoad.setFlag(_gs, 'BADGE_' + badgeCount);
                _awardGymFieldMove(_gs, badgeCount);
              }
              // Elite Four chain flags
              if (trainerId === 'ELITE_AURORA')  { DG.SaveLoad.setFlag(_gs, 'ELITE_1_DONE'); }
              if (trainerId === 'ELITE_EMBER')   { DG.SaveLoad.setFlag(_gs, 'ELITE_2_DONE'); }
              if (trainerId === 'ELITE_GARNET')  { DG.SaveLoad.setFlag(_gs, 'ELITE_3_DONE'); }
              if (trainerId === 'ELITE_PHANTOM') { DG.SaveLoad.setFlag(_gs, 'ELITE_4_DONE'); }
              const postLines = (typeof trainer.postBattleDialogue === 'string'
                ? DG.STORY.DIALOGUES[trainer.postBattleDialogue] || [trainer.postBattleDialogue]
                : trainer.postBattleDialogue) || ['Well battled!'];
              if (trainer.isGymLeader) {
                const bc = (_gs.player.badges || []).length;
                _badgeCeremony(bc, () => {
                  DG.DialogueBox.show(postLines, () => { _blocked = false; DG.SaveLoad.save(_gs); });
                });
              } else {
                DG.DialogueBox.show(postLines, () => { _blocked = false; DG.SaveLoad.save(_gs); });
              }
            } else {
              // LOSE — Elite Four / Champion wipe resets the whole gauntlet;
              // otherwise a gym loss resets that gym's trainers.
              if (trainer.class === 'Elite Four' || trainer.class === 'Champion') {
                _resetEliteFour(_gs);
              } else {
                const lostGymId = _gs.player._lastGymId;
                if (lostGymId) {
                  _resetGymTrainers(_gs, lostGymId);
                  _gs.player._lastGymId = null;
                } else {
                  _blocked = false;
                }
              }
            }
            _trainerAlert = null;
          }
        });
      });
    }
  }

  // ── Badge ceremony ────────────────────────────────────────────
  // Shows a congratulatory dialogue sequence after earning a gym badge,
  // then chains the field-move unlock dialogue (if any) before calling onDone.
  function _badgeCeremony(badgeCount, onDone) {
    // Trigger full-screen badge celebration in renderer
    const badgeNames = {
      1:'Herd Badge',2:'Fossil Badge',3:'Magma Badge',4:'Canopy Badge',
      5:'Charm Badge',6:'Bedrock Badge',7:'Static Badge',8:'Tide Badge',9:'Scale Badge'
    };
    window._BADGE_SCREEN = {
      frames: 240,       // ~4 seconds at 60fps
      count: badgeCount,
      name: badgeNames[badgeCount] || 'Badge'
    };
    const ceremonies = {
      1: [
        '★ Herd Badge obtained! ★',
        "Normal Normi's badge proves your DinoMons have mastered raw power.",
        "The Officer blocking Route 2 has stepped aside!",
        "Head WEST through Shellcreek City to reach Route 2 → Dustwall Town.",
      ],
      2: [
        '★ Fossil Badge obtained! ★',
        "Jam Sennings' mark — proof you can crack any formation.",
        "Head SOUTH from Dustwall Town via Route 3 → Pyreside City.",
      ],
      3: [
        '★ Magma Badge obtained! ★',
        "The volcanic spirit of Asset Toverdijk fuels your DinoMons' fire.",
        "Head SOUTH via Route 4 → Ferngrove Town.",
      ],
      4: [
        '★ Canopy Badge obtained! ★',
        "The ancient forest recognises your bond with nature.",
        "Head NORTH via Route 5 → Fairydell.",
      ],
      5: [
        '★ Charm Badge obtained! ★',
        "AFK Jorn's fairies adore you — the Charm Badge sparkles in your hand!",
        "Head NORTH from Fairydell → Stonehaven City.",
      ],
      6: [
        '★ Bedrock Badge obtained! ★',
        "Rock Hard Toonen's ancient power runs as deep as the earth itself.",
        "Routes 6 and 7 are now open!",
        "Head WEST on Route 6 for Crestfall Town, or EAST on Route 7 for Bogmire City.",
      ],
      7: [
        '★ Static Badge obtained! ★',
        "Beyblade Luuk's electric fury could not stop you — the Static Badge is yours!",
        "Head SOUTH via Route 8 → Bogmire City.",
      ],
      8: [
        '★ Tide Badge obtained! ★',
        "You've calmed the tide. The waterways of the Archipelago are open!",
        "Head NORTH via Route 9 → Apex Summit City.",
      ],
      9: [
        '★ Scale Badge obtained! ★',
        "All 9 badges shine! You are ready for the ultimate challenge.",
        "Head to the FOSSIL GATEWAY → Elite Four → Grand Archon Corvus awaits!",
      ],
    };
    // Field-move unlock dialogue shown after the badge ceremony
    const fieldMoveLines = {
      2: ["HM Rock Smash received! Teach it to a DinoMon to smash boulders outside battle."],
      3: ["HM Flash received! Teach it to a DinoMon to illuminate dark caves."],
      4: ["HM Cut received! Teach it to a DinoMon to clear overgrown paths."],
      6: ["HM Strength received! Teach it to a DinoMon to move heavy boulders."],
      7: ["HM Fly received! Teach it to a DinoMon to soar between visited cities."],
      8: ["HM Surf received! Teach it to a DinoMon to ride across open water.",
          "The sea routes of the Pangaea Archipelago are now open to you!"],
      9: ["HM Dive received! Teach it to a DinoMon to plunge into deep-water caverns."],
    };
    const lines = ceremonies[badgeCount] || ['\u2605 Badge obtained! \u2605'];
    const fmLines = fieldMoveLines[badgeCount] || null;
    // Chain: ceremony → field-move lines (if any) → onDone
    DG.DialogueBox.show(lines, () => {
      // HM/field-move per badge → drives the prominent TmReward showcase
      const GYM_HM = {
        2:{hmId:'HM_ROCK_SMASH',moveId:'ROCK_SMASH'}, 3:{hmId:'HM_FLASH',moveId:'FLASH'},
        4:{hmId:'HM_CUT',moveId:'CUT'},               6:{hmId:'HM_STRENGTH',moveId:'STRENGTH'},
        7:{hmId:'HM_FLY',moveId:'FLY'},               8:{hmId:'HM_SURF',moveId:'SURF'},
        9:{hmId:'HM_DIVE',moveId:'DIVE'},
      };
      const hmMove = GYM_HM[badgeCount] || null;
      const afterReward = () => {
        if (fmLines) {
          DG.DialogueBox.show(fmLines, () => { if (typeof onDone === 'function') onDone(); });
        } else {
          if (typeof onDone === 'function') onDone();
        }
      };
      if (hmMove && typeof DG.TmReward !== 'undefined') {
        DG.TmReward.start(hmMove.hmId, hmMove.moveId, afterReward);
      } else {
        afterReward();
      }
    });
  }

  // ── Gym field move award ──────────────────────────────────────
  // Called immediately after a gym badge is awarded. Gives the HM item,
  // sets the unlock flag, and queues the field-move unlock dialogue.
  function _awardGymFieldMove(gs, badgeNumber) {
    const GYM_FIELD_MOVES = {
      // badgeNumber: { hmId, flagKey, dialogue }
      1: null, // Herd Badge — no field move
      2: { hmId: 'HM_ROCK_SMASH', flagKey: 'ROCK_SMASH_UNLOCKED',
           dialogue: "With the Fossil Badge, your DinoMons can use Rock Smash to break boulders!" },
      3: { hmId: 'HM_FLASH',      flagKey: 'FLASH_UNLOCKED',
           dialogue: "With the Magma Badge, your DinoMons can use Flash to light dark caves!" },
      4: { hmId: 'HM_CUT',        flagKey: 'CUT_UNLOCKED',
           dialogue: "With the Canopy Badge, your DinoMons can use Cut to clear overgrown paths!" },
      5: null, // Charm Badge (Fairy) — no field move
      6: { hmId: 'HM_STRENGTH',   flagKey: 'STRENGTH_UNLOCKED',
           dialogue: "With the Bedrock Badge, your DinoMons can use Strength to move boulders!" },
      7: { hmId: 'HM_FLY',        flagKey: 'FLY_UNLOCKED',
           dialogue: "With the Static Badge, your DinoMons can Fly between cities you've visited!" },
      8: { hmId: 'HM_SURF',       flagKey: 'SURF_UNLOCKED',
           dialogue: ["With the Tide Badge, your DinoMons can Surf across water! New routes are now open!",
                      "The waterways of the Pangaea Archipelago are now open to you!"] },
      9: { hmId: 'HM_DIVE',       flagKey: 'DIVE_UNLOCKED',
           dialogue: "With the Scale Badge, your DinoMons can Dive into the deep! Seek out hidden underwater caves..." },
    };

    const entry = GYM_FIELD_MOVES[badgeNumber];
    if (!entry) return; // badge 1 — no field move

    // Give the HM item and set the unlock flag.
    // Dialogue is handled by _badgeCeremony so there is no race condition.
    DG.SaveLoad.addItem(gs, entry.hmId, 1);
    DG.SaveLoad.setFlag(gs, entry.flagKey);
  }

  // ── Gym trainer reset (Feature 1) ────────────────────────────
  function _resetGymTrainers(gs, gymId) {
    let resetCount = 0;
    for (const tid of Object.keys(DG.TRAINERS)) {
      const t = DG.TRAINERS[tid];
      if (t.gymId === gymId) {
        const flagKey = `TRAINER_${tid}_DEFEATED`;
        if (gs.player.flags && gs.player.flags[flagKey]) {
          delete gs.player.flags[flagKey];
          resetCount++;
        }
      }
    }
    if (resetCount > 0) {
      DG.DialogueBox.show(
        ['You blacked out!', 'The gym trainers have returned to their posts!'],
        () => { _blocked = false; DG.SaveLoad.save(gs); }
      );
    } else {
      _blocked = false;
    }
  }

  // Lose anywhere in the Elite Four / Champion gauntlet → the whole run resets.
  // Clears every Elite progress + defeated flag so you must start again at Aurora.
  function _resetEliteFour(gs) {
    const flags = [
      'ELITE_1_DONE', 'ELITE_2_DONE', 'ELITE_3_DONE', 'ELITE_4_DONE',
      'TRAINER_ELITE_AURORA_DEFEATED', 'TRAINER_ELITE_EMBER_DEFEATED',
      'TRAINER_ELITE_GARNET_DEFEATED', 'TRAINER_ELITE_PHANTOM_DEFEATED',
      'TRAINER_GRAND_ARCHON_CORVUS_DEFEATED',
    ];
    if (gs.player.flags) {
      for (const f of flags) delete gs.player.flags[f];
    }
    DG.DialogueBox.show(
      ['The Elite Four challenge resets!',
       'There is no healing and no second chance here — you must defeat all of them again, starting from Aurora.'],
      () => { _blocked = false; DG.SaveLoad.save(gs); }
    );
  }

  // ── Day Care ──────────────────────────────────────────────
  function _daycareTalk() {
    const daycare = (_gs.player.daycare = _gs.player.daycare || []);
    const party   = _gs.player.party;

    // Build options based on current daycare state
    const opts = [];
    if (daycare.length < 2) opts.push('Deposit a DinoMon');
    if (daycare.length > 0) opts.push('Withdraw a DinoMon');
    opts.push('Check on DinoMons');
    opts.push('Cancel');

    const dcNames = daycare.map(m => m ? (m.nickname || DG.SPECIES[m.speciesId]?.name || m.speciesId) : '?');
    const infoLine = daycare.length > 0
      ? `Currently holding: ${dcNames.join(', ')}`
      : 'No DinoMons left here right now.';

    DG.DialogueBox.show([`Welcome to the Day Care!`, infoLine, `What would you like to do?`], () => {
      if (typeof DG.Menu !== 'undefined' && DG.Menu.showChoiceMenu) {
        DG.Menu.showChoiceMenu('Day Care', opts, (idx) => {
          const choice = opts[idx];
          if (choice === 'Cancel') { _blocked = false; return; }

          if (choice === 'Deposit a DinoMon') {
            // Show party, pick one to deposit (can't deposit eggs or last mon)
            const eligible = party.filter(m => m && !m.isEgg);
            if (eligible.length <= 1) {
              DG.DialogueBox.show(['You need at least one DinoMon with you!'], () => { _blocked = false; });
              return;
            }
            const eligibleNames = eligible.map(m => m.nickname || DG.SPECIES[m.speciesId]?.name || m.speciesId);
            eligibleNames.push('Cancel');
            DG.Menu.showChoiceMenu('Deposit which?', eligibleNames, (pidx) => {
              if (pidx >= eligible.length) { _blocked = false; return; }
              const mon = eligible[pidx];
              const partyIdx = party.indexOf(mon);
              if (partyIdx >= 0) party.splice(partyIdx, 1);
              daycare.push(mon);
              DG.DialogueBox.show([`Left ${mon.nickname || DG.SPECIES[mon.speciesId]?.name} at the Day Care!`], () => {
                _blocked = false; DG.SaveLoad.save(_gs);
              });
            });
            return;
          }

          if (choice === 'Withdraw a DinoMon') {
            if (daycare.length === 0) { DG.DialogueBox.show(['No DinoMons to withdraw!'], () => { _blocked = false; }); return; }
            const dcOpts = daycare.map(m => m.nickname || DG.SPECIES[m.speciesId]?.name || m.speciesId);
            dcOpts.push('Cancel');
            DG.Menu.showChoiceMenu('Withdraw which?', dcOpts, (didx) => {
              if (didx >= daycare.length) { _blocked = false; return; }
              if (party.length >= 6) {
                DG.DialogueBox.show(['Your party is full!'], () => { _blocked = false; }); return;
              }
              const mon = daycare.splice(didx, 1)[0];
              party.push(mon);
              DG.DialogueBox.show([`${mon.nickname || DG.SPECIES[mon.speciesId]?.name} was taken back!`], () => {
                _blocked = false; DG.SaveLoad.save(_gs);
              });
            });
            return;
          }

          if (choice === 'Check on DinoMons') {
            if (daycare.length === 0) {
              DG.DialogueBox.show(["No DinoMons are here right now."], () => { _blocked = false; }); return;
            }
            const status = daycare.map(m => {
              const n = m.nickname || DG.SPECIES[m.speciesId]?.name || m.speciesId;
              return `${n} — Lv.${m.level}`;
            });
            DG.DialogueBox.show(['Your DinoMons are doing well!', ...status], () => { _blocked = false; });
            return;
          }
          _blocked = false;
        });
      } else {
        _blocked = false;
      }
    });
  }

  // ── Egg hatching ─────────────────────────────────────────
  function _hatchEgg(egg) {
    const idx = _gs.player.party.indexOf(egg);
    if (idx < 0) return;
    const speciesId = egg.parentSpecies || 'NORMLET';
    const hatchedMon = DG.SaveLoad.createDinoMon(speciesId, 1);
    if (!hatchedMon) return;
    hatchedMon.caughtAt    = _gs.player.currentMap;
    hatchedMon.caughtBall  = 'DINOBALL';
    _gs.player.party[idx] = hatchedMon;
    DG.SaveLoad.markCaught(_gs, speciesId);
    const name = DG.SPECIES[speciesId]?.name || speciesId;
    DG.DialogueBox.show([`Oh! The Egg is hatching!`, `...${name} hatched from the Egg!`], () => {
      DG.SaveLoad.save(_gs);
    });
  }

  // ── Daycare egg generation ───────────────────────────────
  function _checkDaycareEgg() {
    const daycare = _gs.player.daycare || [];
    if (daycare.length < 2 || !daycare[0] || !daycare[1]) return;
    // Check egg group compatibility
    const g1 = typeof DG.getEggGroup !== 'undefined' ? DG.getEggGroup(daycare[0].speciesId) : null;
    const g2 = typeof DG.getEggGroup !== 'undefined' ? DG.getEggGroup(daycare[1].speciesId) : null;
    const compatible = g1 && g2 && g1 === g2;
    if (!compatible) return;
    // 20% chance per 256 steps to produce an egg
    if (Math.random() > 0.20) return;
    // Only generate if player has room in party and no existing eggs
    if (_gs.player.party.length >= 6) return;
    if (_gs.player.party.some(m => m && m.isEgg)) return;
    const baseSpecies = daycare[0].speciesId;
    const sp = DG.SPECIES[baseSpecies];
    const hatchSteps = (DG.HATCH_STEPS && (DG.HATCH_STEPS[baseSpecies] || DG.HATCH_STEPS.default)) || 2560;
    const egg = {
      isEgg: true, speciesId: 'EGG', parentSpecies: baseSpecies,
      eggSteps: 0, hatchSteps,
      uid: Date.now().toString(36) + Math.random().toString(36).slice(2),
      nickname: 'Egg', level: 1,
      hp: { current: 1, max: 1 }, stats: { hp:1, atk:1, def:1, spAtk:1, spDef:1, spd:1 },
      ivs: { hp:0, atk:0, def:0, spAtk:0, spDef:0, spd:0 },
      evs: { hp:0, atk:0, def:0, spAtk:0, spDef:0, spd:0 },
      moves: [], exp: 0, expToNext: 1000, nature: 'HARDY', happiness: 70,
      heldItem: null, caughtBall: null, statusEffect: null, statusTurns: 0, confusionTurns: 0,
    };
    _gs.player.party.push(egg);
    DG.DialogueBox.show([`The Day Care Couple found an Egg!`, `It's a ${sp?.name || baseSpecies} Egg!`], () => {
      DG.SaveLoad.save(_gs);
    });
  }

  // ── Move teaching helper ─────────────────────────────────
  function _teachMove(mon, moveId, moveDef, onDone) {
    if (!mon || !moveId || !moveDef) { if (onDone) onDone(); return; }
    const alreadyHas = mon.moves && mon.moves.some(m => m.moveId === moveId);
    if (alreadyHas) {
      DG.DialogueBox.show([`${mon.nickname || DG.SPECIES[mon.speciesId]?.name} already knows ${moveDef.name}!`], onDone);
      return;
    }
    if (mon.moves && mon.moves.length < 4) {
      mon.moves.push({ moveId, ppCurrent: moveDef.pp, ppMax: moveDef.pp });
      DG.DialogueBox.show([`${mon.nickname || DG.SPECIES[mon.speciesId]?.name} learned ${moveDef.name}!`], onDone);
    } else {
      // Party is full on moves — ask to replace (simplified: replace last move)
      const lastName = mon.moves[3] ? (DG.MOVES[mon.moves[3].moveId]?.name || mon.moves[3].moveId) : '?';
      DG.DialogueBox.show([
        `${mon.nickname || DG.SPECIES[mon.speciesId]?.name} already knows 4 moves!`,
        `Replaced ${lastName} with ${moveDef.name}!`
      ], () => {
        mon.moves[3] = { moveId, ppCurrent: moveDef.pp, ppMax: moveDef.pp };
        if (onDone) onDone();
      });
    }
  }

  function _getDialogue(npc) {
    if (!npc.dialogue) return ['...'];
    if (typeof npc.dialogue === 'string') {
      return DG.STORY.DIALOGUES[npc.dialogue] || [npc.dialogue];
    }
    if (Array.isArray(npc.dialogue)) {
      // If first element is a story key, expand each element
      if (npc.dialogue.length > 0 && DG.STORY.DIALOGUES[npc.dialogue[0]]) {
        return npc.dialogue.flatMap(key => DG.STORY.DIALOGUES[key] || [key]);
      }
      return npc.dialogue;
    }
    return ['...'];
  }

  // ── NPC Update ────────────────────────────────────────────
  const NPC_WANDER_RADIUS = 3; // max Manhattan distance from spawn

  function _updateNPCs(dt) {
    if (!_mapData.npcs) return;
    for (const npc of _mapData.npcs) {
      if (npc.movementType !== 'WANDER') continue;
      const key = npc.id || npc.x + '_' + npc.y;
      _npcTimers[key] = (_npcTimers[key] || 0) + 1;
      if (_npcTimers[key] < 90) continue; // wander every ~1.5s
      _npcTimers[key] = 0;
      if (Math.random() > 0.4) continue;
      const dirs = [{dx:0,dy:-1},{dx:0,dy:1},{dx:-1,dy:0},{dx:1,dy:0}];
      const d = dirs[Math.floor(Math.random() * dirs.length)];
      const nx = npc.x + d.dx, ny = npc.y + d.dy;
      if (nx < 0 || nx >= _mapData.width || ny < 0 || ny >= _mapData.height) continue;
      const tile = _getTile(nx, ny);
      if (_isSolid(tile)) continue;
      // Don't wander onto door tiles — they must stay clear for the player
      if (tile === DG.TILE.DOOR) continue;
      // Don't wander onto warp tiles — keep exits clear
      if (_mapData.warps && _mapData.warps.some(w => w.x === nx && w.y === ny)) continue;
      // Don't wander into 1-tile-wide corridors (solid on both sides east-west or north-south)
      const _sol = t => _isSolid(t) || t === DG.TILE.DOOR;
      const tL = _getTile(nx - 1, ny), tR = _getTile(nx + 1, ny);
      const tU = _getTile(nx, ny - 1), tD = _getTile(nx, ny + 1);
      if ((_sol(tL) && _sol(tR)) || (_sol(tU) && _sol(tD))) continue;
      if (_npcAt(nx, ny)) continue;
      if (nx === _gs.player.x && ny === _gs.player.y) continue;
      // Enforce wander radius from spawn point
      const spawnX = npc._spawnX !== undefined ? npc._spawnX : npc.x;
      const spawnY = npc._spawnY !== undefined ? npc._spawnY : npc.y;
      if (Math.abs(nx - spawnX) + Math.abs(ny - spawnY) > NPC_WANDER_RADIUS) continue;
      npc.x = nx; npc.y = ny;
      if      (d.dy < 0) npc.facing = 'UP';
      else if (d.dy > 0) npc.facing = 'DOWN';
      else if (d.dx < 0) npc.facing = 'LEFT';
      else               npc.facing = 'RIGHT';
    }
  }

  // ── Camera ────────────────────────────────────────────────
  function _updateCamera() {
    const T = DG.CANVAS.TILE_SIZE;
    const targetX = _gs.player.x * T - Math.floor(DG.CANVAS.TILES_X / 2) * T;
    const targetY = _gs.player.y * T - Math.floor(DG.CANVAS.TILES_Y / 2) * T;
    const maxX = Math.max(0, _mapData.width  * T - DG.CANVAS.W);
    const maxY = Math.max(0, _mapData.height * T - DG.CANVAS.H);
    _camX = Math.max(0, Math.min(maxX, targetX));
    _camY = Math.max(0, Math.min(maxY, targetY));
  }

  // ── Warp / Transition ─────────────────────────────────────
  // ── Warp: instant teleport (no multi-frame fade animation) ──────
  // All previous fade-transition code caused persistent black screens due to
  // race conditions between the state machine and the animation counter.
  // Solution: just teleport the player immediately. Clean, simple, reliable.
  // Face the player INTO the destination map based on which edge they land on.
  // Fixes the "fell in from above" feeling: when a warp lands you on an edge
  // tile, you should look inward (away from the border), not keep your pre-warp
  // facing (which often pointed off-map). Interior landings keep current facing
  // (e.g. exiting a building you keep looking down into the town). An explicit
  // warp.facing always wins.
  function _resolveFacing(m, x, y) {
    if (!m) return _gs.player.facing;
    const W = m.width, H = m.height;
    const dTop = y, dBot = H - 1 - y, dLeft = x, dRight = W - 1 - x;
    const min = Math.min(dTop, dBot, dLeft, dRight);
    if (min > 2) return _gs.player.facing;   // interior — keep facing
    if (min === dTop)  return 'DOWN';
    if (min === dBot)  return 'UP';
    if (min === dLeft) return 'RIGHT';
    return 'LEFT';
  }

  function _startTransition(mapId, x, y, facing) {
    // Ensure we're never left in a blocked state if something goes wrong
    _blocked       = false;
    _transitioning = false;
    _transAlpha    = 0;
    _transDir      = 0;
    _transFrames   = 0;
    _transTarget   = null;

    // Record DinoCenter for black-out respawn
    if (mapId && mapId.endsWith('_CENTER') && typeof DG.SaveLoad !== 'undefined') {
      try { DG.SaveLoad.recordCenter(_gs, mapId, x, y); } catch(e) {}
    }
    try { DG.Audio.playSfx('WARP'); } catch(e) {}

    // Load destination map immediately
    _loadMap(mapId);
    if (!_mapData) {
      console.error('[Overworld] Warp failed — map not found:', mapId);
      return;
    }

    _gs.player.x          = x;
    _gs.player.y          = y;
    _gs.player.currentMap = mapId;
    // Spawn safety: some legacy warps target a wall/water tile or a guard's
    // spot. Never strand the player — nudge to the nearest walkable, free tile.
    try {
      const safe = _nudgeToWalkable(x, y);
      _gs.player.x = safe.x;
      _gs.player.y = safe.y;
    } catch(e) {}
    // Orient the player to face into the new map (or honour an explicit facing).
    try { _gs.player.facing = facing || _resolveFacing(_mapData, _gs.player.x, _gs.player.y); } catch(e) {}
    try { _updateCamera(); } catch(e) {}
    try { DG.SaveLoad.save(_gs); } catch(e) {}
  }

  // Find the nearest tile to (sx,sy) that is walkable and not occupied by a
  // visible NPC. BFS outward (nearest-first) through blocked cells. Used as a
  // safety net after warps so a bad target coordinate can't trap the player.
  function _nudgeToWalkable(sx, sy) {
    const okTile = (x, y) => {
      const t = _getTile(x, y);
      if (_isSolid(t)) return false;
      if (t === DG.TILE.WATER || t === DG.TILE.DEEP_WATER_TILE) return false;
      if (_npcAt(x, y)) return false;
      return true;
    };
    const W = _mapData.width, H = _mapData.height;
    // Clamp an out-of-bounds target back onto the map first
    sx = Math.max(0, Math.min(W - 1, sx));
    sy = Math.max(0, Math.min(H - 1, sy));
    if (okTile(sx, sy)) return { x: sx, y: sy };
    const seen = new Set([sx + ',' + sy]);
    const q = [[sx, sy]];
    let guard = 0;
    while (q.length && guard++ < 4096) {
      const [x, y] = q.shift();
      for (const [dx, dy] of [[0,1],[0,-1],[1,0],[-1,0]]) {
        const nx = x + dx, ny = y + dy, k = nx + ',' + ny;
        if (nx < 0 || ny < 0 || nx >= W || ny >= H || seen.has(k)) continue;
        seen.add(k);
        if (okTile(nx, ny)) return { x: nx, y: ny };
        q.push([nx, ny]);
      }
    }
    return { x: sx, y: sy };
  }

  // Auto-place a wooden signpost at a route's city-facing entrance, with text
  // derived from the warp graph (which city each direction leads to). Runs once
  // per map so every numbered route gets a readable "this way to X / Y" sign.
  function _injectRouteSign(m) {
    if (!m || !m.id || m.id.indexOf('ROUTE_') !== 0) return;
    if (m._signed || !m.tiles || !m.warps) return;
    m._signed = true;
    const isRoute = id => !!id && id.indexOf('ROUTE_') === 0;
    const nameOf  = id => { const mm = DG.MAPS[id]; return mm ? (mm.name || id) : id; };
    const edgeWarp = (mm, edge) => {
      let best = null;
      for (const w of (mm.warps || [])) {
        if (best === null) { best = w; continue; }
        if (edge === 'top' && w.y < best.y) best = w;
        if (edge === 'bot' && w.y > best.y) best = w;
      }
      return best;
    };
    const traceCity = (edge) => {          // follow segments to the terminal city
      let id = m.id, depth = 0;
      while (isRoute(id) && depth++ < 20) {
        const w = edgeWarp(DG.MAPS[id], edge);
        if (!w) return null;
        id = w.targetMap;
        if (!isRoute(id)) return id;
      }
      return null;
    };
    const openCol = (y) => {
      const row = m.tiles[y] || [];
      for (let x = 0; x < m.width; x++) if (!_isSolid(row[x])) return x;
      return -1;
    };
    const topW = edgeWarp(m, 'top'), botW = edgeWarp(m, 'bot');
    const topCity = topW && !isRoute(topW.targetMap) && DG.MAPS[topW.targetMap];
    const botCity = botW && !isRoute(botW.targetMap) && DG.MAPS[botW.targetMap];
    let signY, openRow;
    if (topCity)      { signY = 1; openRow = 0; }
    else if (botCity) { signY = m.height - 2; openRow = m.height - 1; }
    else              { signY = 1; openRow = 0; } // mid-segment: sign near the top opening
    const oc = openCol(openRow);
    if (oc < 1) return;
    const rowTiles = m.tiles[signY] || [];
    let sx = oc - 1;                         // tile just beside the opening
    if (_isSolid(rowTiles[sx])) sx = oc + 2;
    if (sx < 1 || sx >= m.width - 1 || _isSolid(rowTiles[sx])) return;
    const north = isRoute(topW && topW.targetMap) ? nameOf(traceCity('top')) : (topW ? nameOf(topW.targetMap) : null);
    const south = isRoute(botW && botW.targetMap) ? nameOf(traceCity('bot')) : (botW ? nameOf(botW.targetMap) : null);
    const label = (m.name || m.id).split('—')[0].trim();
    m.tiles[signY][sx] = DG.TILE.SIGN;
    if (!m.signs) m.signs = [];
    m.signs.push({ x: sx, y: signY, text: [
      label,
      north ? '▲ ' + north : null,
      south ? '▼ ' + south : null,
    ].filter(Boolean) });
  }

  // Drop a fountain (tile 89) on a central, walkable, connectivity-safe tile in
  // each town. Positions were pre-verified (8 walkable neighbours + the town
  // stays fully connected with the tile made solid). Runs once per map.
  var _FOUNTAIN_POS = {
    AMBERTOWN:[8,5], SHELLCREEK_CITY:[10,7], DUSTWALL_TOWN:[11,6], PYRESIDE_CITY:[9,6],
    STONEHAVEN_CITY:[9,4], FERNGROVE_TOWN:[10,7], CRESTFALL_TOWN:[10,7], BOGMIRE_CITY:[10,7],
    APEXSUMMIT:[9,11],
  };
  // ── Side-quest helpers ────────────────────────────────────
  function _checkQuest(c) {
    if (!c) return true;
    const p = _gs.player;
    const party = (p.party || []).filter(function(m){ return m && !m.isEgg; });
    switch (c.type) {
      case 'HAS_ITEM':   return !!(p.bag && p.bag[c.value] > 0);
      case 'PARTY_FULL': return party.length >= (c.value || 6);
      case 'BADGES':     return (p.badges || []).length >= (c.value || 0);
      case 'MONEY':      return (p.money || 0) >= (c.value || 0);
      case 'SHINY':      return party.some(function(m){ return m.isShiny; });
      case 'HAS_TYPE':   return party.some(function(m){
        var sp = DG.SPECIES[m.speciesId]; return sp && sp.types && sp.types.indexOf(c.value) >= 0; });
      case 'LEVEL':      return party.some(function(m){ return (m.level || 0) >= (c.value || 0); });
      default:           return true;
    }
  }
  function _giveQuestReward(r) {
    if (!r) return;
    if (r.item) { _gs.player.bag = _gs.player.bag || {}; _gs.player.bag[r.item] = (_gs.player.bag[r.item] || 0) + (r.qty || 1); }
    if (r.money) { _gs.player.money = (_gs.player.money || 0) + r.money; }
  }
  function _rewardText(r) {
    if (!r) return [];
    var out = [];
    if (r.item)  out.push('Received ' + (r.qty || 1) + 'x ' + ((DG.ITEMS && DG.ITEMS[r.item]) ? DG.ITEMS[r.item].name : r.item) + '!');
    if (r.money) out.push('Received ¥' + r.money + '!');
    return out;
  }

  // ── Ground items per map (dinoball pickups; hidden:true = invisible) ──
  var _GROUND_ITEMS = {
    ROUTE_1A: [{x:2,y:7,id:'POTION'},      {x:19,y:9,id:'DINOBALL',qty:3}],
    ROUTE_1B: [{x:3,y:9,id:'SUPERPOTION'}, {x:17,y:11,id:'ANTIDOTE',hidden:true}],
    ROUTE_2A: [{x:2,y:2,id:'SUPERBALL',qty:2}, {x:17,y:17,id:'RARE_CANDY',hidden:true}],
    ROUTE_3A: [{x:2,y:2,id:'REVIVE'},      {x:17,y:8,id:'SUPERBALL'}],
    ROUTE_4A: [{x:2,y:2,id:'HYPERPOTION'}, {x:16,y:8,id:'RARE_CANDY',hidden:true}],
    ROUTE_5A: [{x:2,y:2,id:'ULTRABALL'},   {x:16,y:17,id:'FIRE_STONE',hidden:true}],
    ROUTE_6A: [{x:2,y:2,id:'RARE_CANDY'},  {x:17,y:8,id:'ULTRABALL'},     {x:3,y:8,id:'AMBER_FOSSIL'}],
    ROUTE_7A: [{x:2,y:2,id:'HYPERPOTION'}, {x:9,y:8,id:'THUNDER_STONE',hidden:true}, {x:16,y:3,id:'SEA_FOSSIL'}],
    ROUTE_8A: [{x:3,y:3,id:'TAR_FOSSIL'},  {x:16,y:16,id:'ULTRABALL',hidden:true}],
    ROUTE_9A: [{x:3,y:3,id:'ICE_FOSSIL'},  {x:16,y:16,id:'RARE_CANDY',hidden:true}],
    ROUTE_10E:[{x:3,y:3,id:'SKY_FOSSIL'}],
  };
  // Loot pools by route progression tier (parsed from ROUTE_<n>)
  var _LOOT_TIERS = {
    early: ['POTION','POTION','DINOBALL','SUPERPOTION','ANTIDOTE','DINOBALL'],
    mid:   ['SUPERPOTION','SUPERBALL','HYPERPOTION','REVIVE','SUPERBALL','RARE_CANDY'],
    late:  ['HYPERPOTION','ULTRABALL','HYPERPOTION','MAXREVIVE','ULTRABALL','RARE_CANDY','FULLHEAL'],
  };
  function _routeTier(id) {
    var m = id.match(/ROUTE_(\d+)/); var n = m ? parseInt(m[1], 10) : 1;
    return n <= 3 ? 'early' : n <= 6 ? 'mid' : 'late';
  }
  function _tileSolidOrWater(m, x, y) {
    var row = m.tiles[y]; if (!row) return true;
    var t = row[x];
    if (t === undefined) return true;
    if (t === DG.TILE.WATER || t === DG.TILE.DEEP_WATER_TILE) return true;
    return _isSolid(t);
  }
  // BFS from (x,y) on map m to the nearest walkable, non-water tile.
  function _nudgeItemOnMap(m, sx, sy) {
    var W = m.width || (m.tiles[0] ? m.tiles[0].length : 0), H = m.height || m.tiles.length;
    sx = Math.max(0, Math.min(W - 1, sx)); sy = Math.max(0, Math.min(H - 1, sy));
    if (!_tileSolidOrWater(m, sx, sy)) return { x: sx, y: sy };
    var seen = {}; seen[sx + ',' + sy] = 1; var q = [[sx, sy]], guard = 0;
    while (q.length && guard++ < 2000) {
      var c = q.shift();
      var nb = [[c[0],c[1]-1],[c[0],c[1]+1],[c[0]-1,c[1]],[c[0]+1,c[1]]];
      for (var i = 0; i < 4; i++) {
        var nx = nb[i][0], ny = nb[i][1];
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
        var k = nx + ',' + ny; if (seen[k]) continue; seen[k] = 1;
        if (!_tileSolidOrWater(m, nx, ny)) return { x: nx, y: ny };
        q.push([nx, ny]);
      }
    }
    return { x: sx, y: sy };
  }
  function _hashCoord(id, x, y) {
    var v = 0, s = id + ':' + x + ',' + y;
    for (var i = 0; i < s.length; i++) v = (v * 31 + s.charCodeAt(i)) | 0;
    return Math.abs(v);
  }
  // Scatter a few reachable items on a route's PATH tiles (not on warps/borders).
  function _routeScatter(m, existing) {
    var tier = _LOOT_TIERS[_routeTier(m.id)];
    var H = m.tiles.length;
    var warpSet = {};
    (m.warps || []).forEach(function (w) { warpSet[w.x + ',' + w.y] = 1; });
    var taken = {};
    (existing || []).forEach(function (it) { taken[it.x + ',' + it.y] = 1; });
    var spots = [];
    for (var y = 2; y < H - 2; y++) {
      var row = m.tiles[y]; if (!row) continue;
      for (var x = 1; x < row.length - 1; x++) {
        var tv = row[x];
        // connected walkway materials: floor(0), sand(4), swamp/cave-floor(8)
        if (tv !== 0 && tv !== 4 && tv !== 8) continue;
        var key = x + ',' + y;
        if (warpSet[key] || taken[key]) continue;
        spots.push([x, y]);
      }
    }
    // ~25% of the old density: most routes get 0-1 scattered item (deterministic)
    var out = [], want = (spots.length >= 6 && (_hashCoord(m.id, 3, 3) % 100) < 35) ? 1 : 0;
    var stride = Math.max(1, Math.floor(spots.length / want));
    for (var s = 0; s < want; s++) {
      var idx = (s * stride + (_hashCoord(m.id, s, 0) % Math.max(1, stride))) % spots.length;
      var sp = spots[idx]; if (!sp) continue;
      var h = _hashCoord(m.id, sp[0], sp[1]);
      var item = tier[h % tier.length];
      var hidden = (h % 5 === 0);          // ~20% hidden
      out.push({ x: sp[0], y: sp[1], id: item, hidden: hidden });
    }
    return out;
  }
  function _injectGroundItems(m) {
    if (!m || !m.id || m._grounded) return;
    m._grounded = true;
    var items = [];
    if (_GROUND_ITEMS[m.id]) items = _GROUND_ITEMS[m.id].map(function (it) { return Object.assign({}, it); });
    if (m.id.indexOf('ROUTE_') === 0 && m.tiles) {
      try { items = items.concat(_routeScatter(m, items)); } catch (e) {}
    }
    // Safety: never leave an item on a solid/water tile — nudge to nearest walkable.
    for (var i = 0; i < items.length; i++) {
      if (_tileSolidOrWater(m, items[i].x, items[i].y)) {
        var nu = _nudgeItemOnMap(m, items[i].x, items[i].y);
        items[i].x = nu.x; items[i].y = nu.y;
      }
    }
    if (items.length && !m.items) m.items = items;
  }

  function _injectFountain(m) {
    if (!m || !m.id || !m.tiles || m._fountain) return;
    var p = _FOUNTAIN_POS[m.id];
    if (!p) return;
    m._fountain = true;
    var row = m.tiles[p[1]];
    if (row && row[p[0]] !== undefined && !_isSolid(row[p[0]])) row[p[0]] = 89;
  }

  // _updateTransition kept as no-op for safety (isTransitioning always returns false now)
  function _updateTransition() {
    _transitioning = false;
    _blocked       = false;
    _transAlpha    = 0;
  }

  // Public warp (called from events)
  function warp(mapId, x, y, facing) {
    _startTransition(mapId, x, y, facing);
  }

  // ── HM Fly: fast-travel to a visited city, landing in front of its DinoCenter ──
  // The landing tile is data-driven: it's exactly where exiting that city's
  // DinoCenter drops you (the CENTER map's return-warp target).
  function _flyArrival(cityId) {
    const city = DG.MAPS[cityId];
    if (!city || !city.warps) return null;
    const doorWarp = city.warps.find(w => w.targetMap && w.targetMap.endsWith('_CENTER'));
    if (!doorWarp) return null;
    const center = DG.MAPS[doorWarp.targetMap];
    if (center && center.warps) {
      const back = center.warps.find(w => w.targetMap === cityId);
      if (back && back.targetX !== undefined) return { x: back.targetX, y: back.targetY };
    }
    return { x: doorWarp.x, y: doorWarp.y + 1 }; // fallback: just below the door
  }

  // Can the player Fly right now? (outdoors, not in a cave/building, not mid-action)
  function canFlyNow() {
    if (!_gs || !_mapData) return false;
    if (_mapData.isIndoor || _mapData.isCave) return false;
    // NB: _blocked is intentionally NOT checked — the world map is opened from
    // the menu, which sets _blocked=true; gating on it would hide Fly entirely.
    if (_transitioning) return false;
    return (typeof DG.FieldMoves !== 'undefined') && DG.FieldMoves.canFly(_gs);
  }

  // List of visited cities (maps with a DinoCenter) you can fly to, minus the
  // one you're standing in. Returns [{id, name}].
  function flyDestinations() {
    const out = [];
    if (!_gs) return out;
    for (const id in DG.MAPS) {
      const m = DG.MAPS[id];
      if (!m.warps) continue;
      if (id === (_gs.player.currentMap || '')) continue;
      if (!m.warps.some(w => w.targetMap && w.targetMap.endsWith('_CENTER'))) continue;
      if (!DG.SaveLoad.getFlag(_gs, 'VISITED_' + id)) continue;
      if (!_flyArrival(id)) continue;
      out.push({ id, name: m.name || id });
    }
    return out;
  }

  function flyTo(cityId) {
    const arr = _flyArrival(cityId);
    if (!arr) return false;
    const destName = (DG.MAPS[cityId] && DG.MAPS[cityId].name) || cityId;
    const originId = _gs.player.currentMap || '';
    _blocked = true;
    if (typeof DG.FlyAnim !== 'undefined') {
      DG.FlyAnim.start(originId, cityId, destName, function () {
        _startTransition(cityId, arr.x, arr.y, 'DOWN');
        try { DG.SaveLoad.setFlag(_gs, 'VISITED_' + cityId); } catch (e) {}
        _blocked = false;
      });
    } else {
      _startTransition(cityId, arr.x, arr.y, 'DOWN');
      _blocked = false;
    }
    return true;
  }

  // ── Ground item pickup (dinoball / hidden items in the wild) ──
  function _checkItemPickup(x, y) {
    if (!_mapData || !_mapData.items) return false;
    const it = _mapData.items.find(o => o.x === x && o.y === y);
    if (!it) return false;
    const flag = 'ITEM_' + _mapData.id + '_' + x + '_' + y;
    if (_gs.player.flags && _gs.player.flags[flag]) return false; // already collected
    const qty = it.qty || 1;
    DG.SaveLoad.addItem(_gs, it.id, qty);
    DG.SaveLoad.setFlag(_gs, flag);
    const nm = (DG.ITEMS && DG.ITEMS[it.id]) ? DG.ITEMS[it.id].name : it.id;
    _blocked = true;
    try { DG.Audio.playSfx && DG.Audio.playSfx('SELECT'); } catch (e) {}
    const intro = it.hidden ? 'You found a hidden item!' : 'You found an item!';
    DG.DialogueBox.show([intro, (qty > 1 ? (qty + 'x ') : '') + nm + '!'],
      () => { _blocked = false; DG.SaveLoad.save(_gs); });
    return true;
  }

  // ── Fossils: carry → incubate by steps → revive at a Fossil Lab ──
  var _FOSSIL_THRESHOLD = 300;
  var _FOSSIL_SPECIES = {
    AMBER_FOSSIL:'AMBERLITE', TAR_FOSSIL:'TARCLAW', ICE_FOSSIL:'CRYOSHELL',
    SEA_FOSSIL:'NAUTILON',    SKY_FOSSIL:'AEROLITH',
  };
  var _FOSSIL_NAMES = {
    AMBER_FOSSIL:'Amber Fossil', TAR_FOSSIL:'Tar Fossil', ICE_FOSSIL:'Ice Fossil',
    SEA_FOSSIL:'Sea Fossil',     SKY_FOSSIL:'Sky Fossil',
  };
  function _incubateFossils() {
    const bag = _gs.player.bag || {};
    _gs.player.fossilSteps = _gs.player.fossilSteps || {};
    for (const fid in _FOSSIL_SPECIES) {
      if (!(bag[fid] > 0)) continue;
      if (_gs.player.flags && _gs.player.flags['FOSSIL_READY_' + fid]) continue;
      _gs.player.fossilSteps[fid] = (_gs.player.fossilSteps[fid] || 0) + 1;
      if (_gs.player.fossilSteps[fid] >= _FOSSIL_THRESHOLD) {
        DG.SaveLoad.setFlag(_gs, 'FOSSIL_READY_' + fid);
        _blocked = true;
        DG.DialogueBox.show(
          ['Your ' + (_FOSSIL_NAMES[fid] || 'fossil') + ' is trembling with ancient life!',
           'Take it to a Fossil Lab to revive it.'],
          () => { _blocked = false; DG.SaveLoad.save(_gs); });
        return; // one notification at a time
      }
    }
  }
  function _reviveFossils() {
    const bag = _gs.player.bag || {};
    const ready = Object.keys(_FOSSIL_SPECIES).filter(
      fid => bag[fid] > 0 && _gs.player.flags && _gs.player.flags['FOSSIL_READY_' + fid]);
    if (ready.length === 0) {
      const carrying = Object.keys(_FOSSIL_SPECIES).some(fid => bag[fid] > 0);
      DG.DialogueBox.show(carrying
        ? ["Your fossil isn't ready yet.", "Keep walking with it — it awakens with every step you take."]
        : ["Bring me a fossil and walk with it a while.", "Once it stirs with life, I can revive it into a DinoMon!"],
        () => { _blocked = false; });
      return;
    }
    const fid = ready[0];
    const species = _FOSSIL_SPECIES[fid];
    const spName = (DG.SPECIES[species] && DG.SPECIES[species].name) || species;

    // ── Build the revived DinoMon up front as a PRISTINE SPECIMEN ──
    // Fossils are once-in-an-age finds, so what hatches is genuinely special:
    //   • three guaranteed perfect (31) IVs — a flawless ancient bloodline
    //   • a vastly boosted shiny rate (≈1 in 12, vs the usual 1 in 4096)
    //   • brimming with vigour (high happiness), tagged as Fossil-revived
    const mon = DG.SaveLoad.createDinoMon(species, 20);
    if (mon) {
      // Three distinct stats locked to a perfect 31.
      const statKeys = ['hp','atk','def','spAtk','spDef','spd'];
      for (let i = statKeys.length - 1; i > 0; i--) { // shuffle
        const j = Math.floor(Math.random() * (i + 1));
        const t = statKeys[i]; statKeys[i] = statKeys[j]; statKeys[j] = t;
      }
      mon.ivs = mon.ivs || {};
      for (let k = 0; k < 3; k++) mon.ivs[statKeys[k]] = 31;
      try { DG.SaveLoad.recalcStats(mon); mon.hp.current = mon.hp.max; } catch (e) {}
      // Boosted shiny chance for the awakening.
      if (!mon.isShiny && Math.random() < (1 / 12)) mon.isShiny = true;
      mon.happiness    = 140;
      mon.fossilRevived = true;
      mon.caughtAt     = 'Fossil Museum';
      mon.caughtAtLevel = 20;
    }
    // Safety net: if the species data were ever missing, bail gracefully instead
    // of pushing a null DinoMon into the party.
    if (!mon) {
      DG.DialogueBox.show(
        ["The fossil flickers... but the revival fails to take hold.",
         "Director Vance: Strange — bring it back another time."],
        () => { _blocked = false; });
      return;
    }
    const perfectIVs = statKeys30(mon.ivs);
    const isShiny = !!mon.isShiny;

    // The actual revival, applied once the cinematic finishes.
    const _finishRevive = () => {
      let dest;
      if ((_gs.player.party || []).length < 6) { _gs.player.party.push(mon); dest = 'party'; }
      else { _gs.player.box = _gs.player.box || []; _gs.player.box.push(mon); dest = 'box'; }
      DG.SaveLoad.removeItem(_gs, fid, 1);
      if (_gs.player.flags) delete _gs.player.flags['FOSSIL_READY_' + fid];
      if (_gs.player.fossilSteps) _gs.player.fossilSteps[fid] = 0;
      try { DG.SaveLoad.markCaught(_gs, species); } catch(e) {}
      DG.SaveLoad.save(_gs);
      const lines = ['The ancient spark takes hold...'];
      if (isShiny) lines.push('Incredible — a SHINY ' + spName + ' emerged from the amber!!');
      else         lines.push('A ' + spName + ' was revived from its fossil!');
      lines.push('Director Vance: A pristine specimen — flawless ancient bloodline.');
      lines.push(dest === 'box' ? (spName + ' was sent to the PC box.') : (spName + ' joined your party!'));
      DG.DialogueBox.show(lines, () => { _blocked = false; });
    };

    // Epic "Primordial Awakening" cinematic, then complete the revival.
    if (typeof DG.HatchAnim !== 'undefined' && DG.HatchAnim.start) {
      _blocked = true;
      DG.DialogueBox.show(
        ['Director Vance sets the fossil into the incubation pod...',
         'The chamber floods with primordial amber light!'],
        () => { DG.HatchAnim.start(species, _finishRevive, { isShiny: isShiny, perfectIVs: perfectIVs }); });
    } else {
      _finishRevive();
    }
  }

  // Count perfect (31) IVs — used for the specimen's rarity stars.
  function statKeys30(ivs) {
    if (!ivs) return 0;
    let n = 0;
    ['hp','atk','def','spAtk','spDef','spd'].forEach(k => { if (ivs[k] === 31) n++; });
    return n;
  }

  // ── Compound City: Daytrader Niels' Beachcoin (volatile cryptocoin) ──
  // The coin re-rolls its value every time you enter the DinoExchange (see
  // _rollBeachcoin, fired from _loadMap). You can cash out at most +50% over what
  // you put in, but a roll can wipe you to ¥0 — and that money is gone for good.
  const _BC_CAP        = 1.5;   // max sell value = 1.5× what you invested (+50%)
  const _BC_RUG_CHANCE = 0.08;  // chance of a total crash to ¥0 per visit
  const _BC_MIN_FACTOR = 0.70;  // per-visit swing: ×0.70 ..
  const _BC_MAX_FACTOR = 1.45;  //                  .. ×1.45 (clamped to the cap)

  function _rollBeachcoin() {
    const p = _gs && _gs.player;
    if (!p || !p.beachcoin) return;
    const bc = p.beachcoin;
    if (!(bc.value > 0)) { bc.lastSwing = null; return; }
    const before = bc.value;
    // Rug pull — total loss, principal gone for good.
    if (Math.random() < _BC_RUG_CHANCE) {
      bc.value = 0; bc.basis = 0;
      bc.lastSwing = { type: 'rug', amount: before };
      return;
    }
    const factor = _BC_MIN_FACTOR + Math.random() * (_BC_MAX_FACTOR - _BC_MIN_FACTOR);
    const cap    = Math.round(bc.basis * _BC_CAP);
    bc.value = Math.max(0, Math.min(cap, Math.round(before * factor)));
    if (bc.value <= 0) bc.basis = 0;
    const d = bc.value - before;
    bc.lastSwing = { type: d > 0 ? 'surge' : (d < 0 ? 'dip' : 'flat'), amount: Math.abs(d) };
  }

  function _beachcoin() {
    const p = _gs.player;
    p.beachcoin = p.beachcoin || { value: 0, basis: 0, lastSwing: null };
    const bc = p.beachcoin;
    // One-time migration: refund any old DinoFund balance as cash.
    if (p.fund && p.fund.balance > 0) { p.money = (p.money || 0) + p.fund.balance; }
    if (p.fund) delete p.fund;
    const cash = p.money || 0;

    const lines = [];
    // Report the price swing since the last time the exchange re-rolled.
    if (bc.lastSwing) {
      const s = bc.lastSwing;
      if (s.type === 'rug')        lines.push("Daytrader Niels: ...oof. RUG PULL.", "Beachcoin crashed to zero overnight. Your ¥" + s.amount + " is gone — for good.");
      else if (s.type === 'surge') lines.push("Daytrader Niels: TO THE MOON! 🚀", "Beachcoin pumped +¥" + s.amount + " since you last left!");
      else if (s.type === 'dip')   lines.push("Daytrader Niels: Brutal session — Beachcoin shed ¥" + s.amount + " since you left.");
      else                          lines.push("Daytrader Niels: Beachcoin held flat since you left. Calm before the moon?");
      bc.lastSwing = null;
    } else {
      lines.push("Daytrader Niels: Welcome to the DinoExchange — home of Beachcoin!", "My own coin. To the moon and back, kid — or to zero. The market decides!");
    }
    lines.push(
      "Your Beachcoin: ¥" + bc.value + (bc.basis > 0 ? " (you put in ¥" + bc.basis + ")" : ""),
      "Cash on hand: ¥" + cash + "."
    );

    DG.DialogueBox.show(lines, () => {
      const opts = [];
      if (cash >= 500)   opts.push('Buy ¥500');
      if (cash >= 2000)  opts.push('Buy ¥2000');
      if (cash >= 10000) opts.push('Buy ¥10000');
      if (cash > 0)      opts.push('Buy ALL (¥' + cash + ')');
      if (bc.value > 0)  opts.push('Sell all (¥' + bc.value + ')');
      opts.push('Leave');
      if (typeof DG.Menu !== 'undefined' && DG.Menu.showChoiceMenu) {
        DG.Menu.showChoiceMenu('Beachcoin', opts, (idx) => {
          const choice = opts[idx];
          if (choice && choice.indexOf('Buy') === 0) {
            let amt = (choice.indexOf('ALL') >= 0) ? (p.money || 0)
                                                   : (parseInt(choice.replace(/[^0-9]/g, ''), 10) || 0);
            amt = Math.min(amt, p.money || 0);
            if (amt <= 0) { _blocked = false; return; }
            p.money   = Math.max(0, (p.money || 0) - amt);
            bc.value += amt;
            bc.basis += amt;
            DG.SaveLoad.save(_gs);
            DG.DialogueBox.show([
              'You bought ¥' + amt + ' of Beachcoin!',
              "Niels: Diamond hands! The price moves every time you visit — sell high if you can."
            ], () => { _blocked = false; });
          } else if (choice && choice.indexOf('Sell') === 0) {
            const w = bc.value; p.money = (p.money || 0) + w; bc.value = 0; bc.basis = 0;
            DG.SaveLoad.save(_gs);
            DG.DialogueBox.show([
              w > 0 ? ('You sold all your Beachcoin for ¥' + w + '!') : 'There was nothing to sell.',
              w > 0 ? "Niels: Pleasure doing business. The moon misses you already." : "Niels: Come back when you're feeling brave."
            ], () => { _blocked = false; });
          } else { _blocked = false; }
        });
      } else { _blocked = false; }
    });
  }

  // ── Navigation HUD state ──────────────────────────────────
  var _navCache   = null;   // cached BFS first-step { fromId, toId, warp }

  // ── Map Loading ───────────────────────────────────────────
  function _loadMap(mapId) {
    const newData = DG.MAPS[mapId];
    if (!newData) {
      console.error('[Overworld] Map not found:', mapId);
      return;  // _mapData is preserved — old map stays visible
    }
    const _prevId  = _mapData ? _mapData.id : null;
    const _changed = (_prevId !== newData.id);
    _mapData = newData;

    // Force navigation recompute for the new map
    if (_changed) { _navCache = null; }

    // Beachcoin re-rolls its price every time you ARRIVE in Compound City from
    // outside the town (Route 2A) — not when you step out of its bank/center.
    // This keeps "the price changes every visit" while preventing re-roll spam.
    if (newData.id === 'COMPOUND_CITY' &&
        _prevId !== 'COMPOUND_CITY' && _prevId !== 'COMPOUND_BANK' && _prevId !== 'COMPOUND_CENTER') {
      try { _rollBeachcoin(); } catch(e) {}
    }

    // Auto-place a route signpost at the city-facing entrance (once per map)
    try { _injectRouteSign(newData); } catch(e) {}
    // Auto-place a fountain centrepiece in each town (once per map)
    try { _injectFountain(newData); } catch(e) {}
    // Auto-place ground-item pickups (once per map)
    try { _injectGroundItems(newData); } catch(e) {}

    // Set map theme for themed tile drawing
    const _GYM_THEMES = {
      // ── Gyms ────────────────────────────────────────────────
      'SHELLCREEK_GYM': 'NORMAL',    'DUSTWALL_GYM':    'ROCK',
      'PYRESIDE_GYM':   'FIRE',      'FERNGROVE_GYM':   'GRASS',
      'STONEHAVEN_GYM': 'GROUND',    'CRESTFALL_GYM':   'ELECTRIC',
      'BOGMIRE_GYM':    'WATER',     'APEXSUMMIT_GYM':  'DRAGON',
      'FOSSIL_CITADEL': 'CHAMPION',
      // ── Exterior towns & cities ──────────────────────────────
      'AMBERTOWN':       'AMBER',    'SHELLCREEK_CITY': 'COASTAL',
      'DUSTWALL_TOWN':   'DESERT',   'PYRESIDE_CITY':   'VOLCANIC',
      'FERNGROVE_TOWN':  'FOREST',   'STONEHAVEN_CITY': 'GRANITE',
      'CRESTFALL_TOWN':  'MOUNTAIN', 'BOGMIRE_CITY':    'SWAMP',
      'APEXSUMMIT_CITY': 'SUMMIT',
      'COMPOUND_CITY':   'GOLD',     // the golden crypto metropolis
      // ── Interior maps ────────────────────────────────────────
      'AMBERTOWN_LAB':      'LAB',     'AMBERTOWN_CENTER':    'CENTER',
      'AMBERTOWN_HOUSE':    'HOUSE',   'AMBERTOWN_SHOP':      'SHOP',
      'SHELLCREEK_CENTER':  'CENTER',  'DUSTWALL_CENTER':     'CENTER',
      'PYRESIDE_CENTER':    'CENTER',  'PYRESIDE_SHOP':       'SHOP',
      'FERNGROVE_CENTER':   'CENTER',  'STONEHAVEN_CENTER':   'CENTER',
      'CRESTFALL_CENTER':   'CENTER',  'BOGMIRE_CENTER':      'CENTER',
      'APEXSUMMIT_CENTER':  'CENTER',
      'COMPOUND_BANK':      'GOLD',     'COMPOUND_CENTER':     'GOLD',  // gilded interiors
      // ── Special areas ────────────────────────────────────────
      'PYRESIDE_WILD':   'VOLCANIC',  'MT_CRETACEOUS':   'VOLCANIC',
      'GLACIAL_PASS_1':  'TUNDRA',    'GLACIAL_PASS_2':  'TUNDRA',
      'GLACIAL_PASS_3':  'TUNDRA',
    };
    window.DG_MAP_THEME  = _GYM_THEMES[mapId] || 'DEFAULT';
    window.DG_CURRENT_MAP_ID = mapId;
    // Set ambient weather from theme (used by renderer + battle)
    window.DG_MAP_WEATHER = (DG.THEME_TO_WEATHER && DG.THEME_TO_WEATHER[window.DG_MAP_THEME] !== undefined)
      ? DG.THEME_TO_WEATHER[window.DG_MAP_THEME]
      : null;

    _npcTimers = {};
    _surfing = false; // reset surfing on map change

    // Mark location as visited for world map display
    if (_gs && mapId && typeof DG.SaveLoad !== 'undefined' && DG.SaveLoad.setFlag) {
      DG.SaveLoad.setFlag(_gs, 'VISITED_' + mapId);
    }

    // Update roaming legendary's daily route
    if (typeof DG.FieldMoves !== 'undefined') {
      DG.FieldMoves.updateRoamingMon(_gs);
    }

    // Store spawn positions for wander radius enforcement
    if (_mapData.npcs) {
      for (const npc of _mapData.npcs) {
        npc._spawnX = npc.x;
        npc._spawnY = npc.y;
      }
    }
    try { _updateCamera(); } catch(e) {}
    try { if (_mapData.music) DG.Audio.playMusic(_mapData.music); } catch(e) {}

    // Run AUTO events
    if (_mapData.events) {
      for (const ev of _mapData.events) {
        if (ev.triggerType === 'AUTO') {
          DG.Events.checkTile(_mapData, ev.x, ev.y, _gs, () => {});
        }
      }
    }
  }

  // ── Tile Helpers ──────────────────────────────────────────
  function _getTile(x, y) {
    if (!_mapData || !_mapData.tiles) return DG.TILE.WALL;
    return (_mapData.tiles[y] && _mapData.tiles[y][x]) !== undefined
      ? _mapData.tiles[y][x] : DG.TILE.WALL;
  }

  function _isSolid(tile) {
    // Tiles 0-9 are walkable (FLOOR, GRASS, TALL_GRASS, WATER, SAND, DIRT, ICE, LAVA, SWAMP, FLOWER)
    // Tiles 64+ are solid (TREE, WALL, MOUNTAIN, SIGN, DOOR, ROCK, FENCE, etc.)
    // DOOR (68) is walkable — it triggers a warp
    // Gold-metropolis dressing (Compound City) lives in the 12-19 band: the
    // lamppost/coin/ticker/planter/skyline are SOLID, but gold plaza (14) is walkable.
    if (tile === 14) return false;             // gold plaza pavement (walkable boulevard)
    if (tile >= 12 && tile <= 19) return true; // gold-city solid dressing + skyline backdrop
    if (tile < 64) return false;
    if (tile === DG.TILE.DOOR) return false; // doors are passable
    return true;
  }

  function _getWarp(x, y) {
    if (!_mapData || !_mapData.warps) return null;
    const w = _mapData.warps.find(w => w.x === x && w.y === y);
    if (!w) return null;
    // Check requiresFlag gate
    if (w.requiresFlag && _gs && !_gs.player.flags[w.requiresFlag]) {
      const _msg = String(w.requiresFlag).indexOf('BADGE_') === 0
        ? ["The way ahead is blocked.", "Defeat this city's Gym Leader to earn the badge that opens this route!"]
        : ["The path is blocked."];
      DG.DialogueBox.show(_msg);
      return null;
    }
    // Check Dive gate — deep-water dive points need HM Dive to descend
    if (w.dive && _gs && (typeof DG.FieldMoves === 'undefined' || !DG.FieldMoves.canDive(_gs))) {
      _blocked = true;
      DG.DialogueBox.show([
        "The water here plunges down into darkness.",
        "A DinoMon that knows Dive could take you beneath the surface!"
      ], () => { _blocked = false; });
      return null;
    }
    // Check gym lock — exit is blocked until the leader is defeated
    if (w.gymLock && _gs && !_gs.player.flags[w.gymLock]) {
      _blocked = true;
      DG.DialogueBox.show([
        "The doors are locked!",
        "Defeat the Gym Leader to open them."
      ], () => { _blocked = false; });
      return null;
    }
    return w;
  }

  function _npcAt(x, y) {
    if (!_mapData || !_mapData.npcs) return null;
    return _mapData.npcs.find(n => {
      if (n.x !== x || n.y !== y) return false;
      // Hide NPC if flagToHide is set
      if (n.flagToHide && _gs && DG.SaveLoad.getFlag(_gs, n.flagToHide)) return false;
      // Hide NPC if requiresFlag is not met
      if (n.requiresFlag && _gs && !DG.SaveLoad.getFlag(_gs, n.requiresFlag)) return false;
      return true;
    }) || null;
  }

  // ── Getters for Renderer ──────────────────────────────────
  function getMapData()     { return _mapData; }
  function getCamX()        { return _camX; }
  function getCamY()        { return _camY; }
  function isTransitioning(){ return _transitioning; }
  function transAlpha()     { return _transAlpha; }
  function isBlocked()      { return _blocked; }
  function setBlocked(v)    { _blocked = v; }
  function isSurfing()      { return _surfing; }

  // ── Credits sequence ─────────────────────────────────────
  function _showCredits() {
    DG.SaveLoad.setFlag(_gs, 'GAME_COMPLETE');
    DG.SaveLoad.save(_gs);

    const creditLines = [
      '~ The End ~',
      '',
      'The Permian Core has fallen silent.',
      'Peace returns to the Pangaea Archipelago.',
      '',
      'Team Extinction disbanded.',
      'Director Clade was last seen walking alone',
      'into the fossil plains, unarmed.',
      '',
      '~ DinoMon: Fossil Frontier ~',
      '',
      'Thank you for playing!',
      '',
      '── STAFF ──',
      'Design & Programming: Claude Code',
      '',
      '── SPECIAL THANKS ──',
      'Tigo — for bringing this world to life',
      '',
      'Your adventure continues...',
      'Explore the post-game, catch PRIMORDIA,',
      'and find the legendary MEGA DinoMons!',
    ].filter(l => l !== '');

    DG.DialogueBox.show(creditLines, () => {
      _blocked = false;
    });
  }

  // ══ NAVIGATION HUD ════════════════════════════════════════
  // Everything that tells the player WHERE THEY ARE and WHERE TO GO.
  var _navTick = 0;

  // Which town is the current main objective (drives goal pill + compass).
  function _navTargetMap(gs) {
    const f = gs.player.flags || {};
    if (f['ELITE_4_DONE'] || f['DIRECTOR_CLADE_DEFEATED']) return null;
    if (f['BADGE_9']) return null;               // Elite Four — handled as text
    if (f['BADGE_8']) return 'APEXSUMMIT';
    if (f['BADGE_7']) return 'BOGMIRE_CITY';
    if (f['BADGE_6']) return 'CRESTFALL_TOWN';
    if (f['BADGE_5']) return 'STONEHAVEN_CITY';
    if (f['BADGE_4']) return 'FAIRYDELL_CITY';
    if (f['BADGE_3']) return 'FERNGROVE_TOWN';
    if (f['BADGE_2']) return 'PYRESIDE_CITY';
    if (f['BADGE_1']) return 'DUSTWALL_TOWN';
    return 'SHELLCREEK_CITY';
  }

  // BFS over the warp graph: first warp on the CURRENT map on the shortest path
  // to `toId`. Data-driven, so it auto-adapts to new towns/routes.
  function _bfsFirstStep(fromId, toId) {
    if (!fromId || !toId || fromId === toId) return null;
    const MAPS = DG.MAPS, start = MAPS[fromId];
    if (!start || !start.warps) return null;
    const visited = new Set([fromId]);
    let frontier = [];
    for (const w of start.warps) { if (w.targetMap) frontier.push({ map: w.targetMap, first: w }); }
    let guard = 0;
    while (frontier.length && guard++ < 4000) {
      const next = [];
      for (const nd of frontier) {
        if (nd.map === toId) return nd.first;
        if (visited.has(nd.map)) continue;
        visited.add(nd.map);
        const m = MAPS[nd.map];
        if (!m || !m.warps) continue;
        for (const w of m.warps) { if (w.targetMap && !visited.has(w.targetMap)) next.push({ map: w.targetMap, first: nd.first }); }
      }
      frontier = next;
    }
    return null;
  }

  function _navStep(gs) {
    if (!_mapData) return null;
    const toId = _navTargetMap(gs);
    if (!toId) return { toId: null };
    if (!_navCache || _navCache.fromId !== _mapData.id || _navCache.toId !== toId) {
      _navCache = { fromId: _mapData.id, toId, warp: _bfsFirstStep(_mapData.id, toId) };
    }
    return _navCache;
  }

  function _edgeDir(m, x, y) {
    const dT = y, dB = m.height - 1 - y, dL = x, dR = m.width - 1 - x;
    const mn = Math.min(dT, dB, dL, dR);
    if (mn === dT) return 'N';
    if (mn === dB) return 'S';
    if (mn === dL) return 'W';
    return 'E';
  }
  const _DIR_ARROW = { N:'▲', S:'▼', W:'◄', E:'►' };
  const _DIR_WORD  = { N:'North', S:'South', W:'West', E:'East' };

  // Concise label for what a warp leads to (building doors -> role; else map name).
  function _exitLabel(targetId) {
    if (!targetId) return '';
    if (/_GYM$/.test(targetId))    return 'GYM';
    if (/_CENTER$/.test(targetId)) return 'DinoCenter';
    if (/_SHOP$/.test(targetId))   return 'Mart';
    if (/_WILD$/.test(targetId))   return 'Wild Area';
    if (/FOSSIL_LAB$/.test(targetId)) return 'Museum';
    if (/_LAB$/.test(targetId))    return 'Lab';
    if (/HOUSE|HOME/.test(targetId)) return 'House';
    const m = DG.MAPS[targetId];
    return m ? (m.name || targetId) : targetId;
  }

  function _navRoundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  // ── Master nav-HUD draw (called every overworld frame) ─────
  function drawObjectiveHint(ctx, gs) {
    if (!gs || !gs.player) return;
    if (typeof DG.FlyAnim !== 'undefined' && DG.FlyAnim.isActive()) return; // hidden during Fly cutscene
    if (typeof DG.HatchAnim !== 'undefined' && DG.HatchAnim.isActive()) return; // hidden during fossil hatch cinematic
    if (typeof DG.DialogueBox !== 'undefined' && DG.DialogueBox.isVisible()) return;
    _navTick++;
    const W = DG.CANVAS.W, H = DG.CANVAS.H, T = DG.CANVAS.TILE_SIZE;
    _drawExitLabels(ctx, gs, W, H, T);
    _drawGoalPill(ctx, gs, W);
    _drawCompass(ctx, gs, W, H, T);
    // Area-name banner is already handled by the renderer's "NOW ENTERING" takeover.
  }

  // 1) Labels above every on-screen exit/door: what each opening is.
  function _drawExitLabels(ctx, gs, W, H, T) {
    if (!_mapData || !_mapData.warps) return;
    const step = _navStep(gs);
    const goalWarp = step && step.warp;
    const drawn = [];
    ctx.save();
    ctx.font = 'bold 8px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (const w of _mapData.warps) {
      const sx = w.x * T - _camX + T / 2;
      const sy = w.y * T - _camY;
      if (sx < -20 || sx > W + 20 || sy < -10 || sy > H + 20) continue;
      if (drawn.some(d => Math.abs(d.x - sx) < 34 && d.t === w.targetMap)) continue;
      drawn.push({ x: sx, t: w.targetMap });

      const isEdge = (w.x <= 1 || w.y <= 1 || w.x >= _mapData.width - 2 || w.y >= _mapData.height - 2);
      let label = _exitLabel(w.targetMap);
      let arrow = '';
      if (isEdge) { arrow = _DIR_ARROW[_edgeDir(_mapData, w.x, w.y)] + ' '; }
      const isGoal = goalWarp && goalWarp.x === w.x && goalWarp.y === w.y;
      const txt = arrow + label + (isGoal ? '  ★' : '');

      const tw = ctx.measureText(txt).width;
      const lx = sx, ly = Math.max(14, sy - 6);
      ctx.fillStyle = isGoal ? 'rgba(120,90,0,0.92)' : 'rgba(0,0,25,0.82)';
      _navRoundRect(ctx, lx - tw / 2 - 4, ly - 7, tw + 8, 13, 3);
      ctx.fill();
      if (isGoal) { ctx.strokeStyle = '#ffe050'; ctx.lineWidth = 1; ctx.stroke(); }
      ctx.fillStyle = isGoal ? '#fff4b0' : '#cfe3ff';
      ctx.fillText(txt, lx, ly);
    }
    ctx.restore();
  }

  // 2) Always-visible destination tracker (top-right): NEXT town + direction.
  function _drawGoalPill(ctx, gs, W) {
    const f = gs.player.flags || {};
    const step = _navStep(gs);
    let line1, line2 = '';
    if (f['ELITE_4_DONE'] || f['DIRECTOR_CLADE_DEFEATED']) {
      line1 = '🏆 Champion!'; line2 = 'Explore the post-game';
    } else if (f['BADGE_9']) {
      line1 = '🎯 Goal: Elite Four'; line2 = 'Enter the Fossil Gateway';
    } else if (step && step.toId) {
      const dest = DG.MAPS[step.toId];
      const destName = dest ? (dest.name || step.toId) : step.toId;
      const here = (_mapData && _mapData.id === step.toId);
      line1 = '🎯 Next: ' + destName;
      if (here) {
        line2 = 'You are here!';
      } else if (step.warp) {
        const d = _edgeDir(_mapData, step.warp.x, step.warp.y);
        line2 = 'Go ' + _DIR_ARROW[d] + ' ' + _DIR_WORD[d];
      } else {
        line2 = 'Find the way there';
      }
    } else {
      return;
    }
    ctx.save();
    ctx.font = 'bold 9px monospace';
    const w1 = ctx.measureText(line1).width;
    ctx.font = '8px monospace';
    const w2 = ctx.measureText(line2).width;
    const pillW = Math.min(Math.max(w1, w2) + 14, 210);
    const pillH = line2 ? 28 : 16;
    const pillX = W - pillW - 4, pillY = 4;
    ctx.fillStyle = 'rgba(0,0,20,0.80)';
    _navRoundRect(ctx, pillX, pillY, pillW, pillH, 4); ctx.fill();
    ctx.strokeStyle = 'rgba(255,224,80,0.55)'; ctx.lineWidth = 1;
    _navRoundRect(ctx, pillX, pillY, pillW, pillH, 4); ctx.stroke();
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffe9a0'; ctx.font = 'bold 9px monospace';
    ctx.fillText(line1, pillX + 6, pillY + (line2 ? 9 : pillH / 2));
    if (line2) { ctx.fillStyle = '#bfe0ff'; ctx.font = '8px monospace'; ctx.fillText(line2, pillX + 6, pillY + 20); }
    ctx.restore();
  }

  // 3) Bouncing compass arrow pointing to the exit that leads to the goal.
  function _drawCompass(ctx, gs, W, H, T) {
    const step = _navStep(gs);
    if (!step || !step.warp || (_mapData && _mapData.id === step.toId)) return;
    const w = step.warp;
    const tx = w.x * T - _camX + T / 2;
    const ty = w.y * T - _camY + T / 2;
    const m = 18;
    const onScreen = (tx > m && tx < W - m && ty > m && ty < H - m);
    const ang = Math.atan2(ty - H / 2, tx - W / 2);
    let ax = tx, ay = ty;
    if (!onScreen) { ax = Math.max(m, Math.min(W - m, tx)); ay = Math.max(m, Math.min(H - m, ty)); }
    const bob = Math.sin(_navTick * 0.15) * 2;
    ctx.save();
    ctx.translate(ax, ay + bob);
    ctx.rotate(ang);
    ctx.fillStyle = 'rgba(255,210,40,0.95)';
    ctx.strokeStyle = '#7a5500'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(11, 0); ctx.lineTo(-6, -7); ctx.lineTo(-2, 0); ctx.lineTo(-6, 7); ctx.closePath();
    ctx.fill(); ctx.stroke();
    ctx.restore();
  }

  console.log('[DinoMon] Overworld v35 loaded.');

  function getTrainerAlert() { return _trainerAlert; }

  function getEncounterFade() { return _encounterFade; }
  function getEncounterFadeAlpha() {
    if (_encounterFade <= 0 && !_encounterPending) return 0;
    return 1 - (_encounterFade / ENCOUNTER_FADE_DURATION);
  }

  // ── Starter rival battle (triggered automatically after choosing + naming starter) ──
  // FASE 7: het Oak-moment — de professor is de naam van zijn collega's
  // kleinzoon "vergeten" en vraagt hem aan de speler, vlak voor de eerste
  // rival-ontmoeting. Eenmalig (vlag RIVAL_NAMED); bestaande saves met een
  // eigen rivalnaam slaan dit over.
  function _ensureRivalNamed(done) {
    const alreadyNamed = DG.SaveLoad.getFlag(_gs, 'RIVAL_NAMED') ||
      (_gs.player.rivalName && _gs.player.rivalName.trim() &&
       _gs.player.rivalName.trim().toLowerCase() !== 'flint');
    if (alreadyNamed || typeof window.DG_ASK_RIVAL_NAME !== 'function') { done(); return; }
    const askLines = (DG.STORY && DG.STORY.DIALOGUES && DG.STORY.DIALOGUES['RIVAL_NAME_ASK'])
      || ["DOKTER TIMO: 'What was his name again?'"];
    DG.DialogueBox.show(askLines, function() {
      window.DG_ASK_RIVAL_NAME(function() {
        DG.SaveLoad.save(_gs); // naam direct persistent
        const confirmLines = (DG.STORY && DG.STORY.DIALOGUES && DG.STORY.DIALOGUES['RIVAL_NAME_CONFIRM']) || [];
        if (confirmLines.length) DG.DialogueBox.show(confirmLines, done);
        else done();
      });
    });
  }

  function triggerStarterRival() {
    if (!_gs) return;
    const flags = _gs.player.flags || {};
    // Only trigger once
    if (flags['RIVAL_BATTLE_1_DONE']) return;
    const starterType = (typeof flags['STARTER_CHOSEN'] === 'string')
      ? flags['STARTER_CHOSEN'] : 'FIRE';
    const trainerId = `RIVAL_1_${starterType}`;
    const trainer = DG.TRAINERS && DG.TRAINERS[trainerId];
    if (!trainer) return;

    _blocked = true;
    const preLines = DG.STORY && DG.STORY.DIALOGUES && DG.STORY.DIALOGUES['RIVAL_PRE_1']
      ? DG.STORY.DIALOGUES['RIVAL_PRE_1']
      : [`FLINT: So you picked a starter? Don't get comfortable — I'll show you how it's done!`];

    // FASE 7: eerst het naam-vraagmoment, dan de bestaande pre-battle dialoog
    _ensureRivalNamed(function() {
    DG.DialogueBox.show(preLines, function() {
      const firstEnemy = DG.SaveLoad.createDinoMon(trainer.party[0].speciesId, trainer.party[0].level);
      DG.Battle.start({
        type: 'TRAINER', enemy: firstEnemy, trainerData: trainer, gameState: _gs,
        onEnd: function(result) {
          if (result === 'WIN') {
            DG.SaveLoad.setFlag(_gs, 'RIVAL_BATTLE_1_DONE');
            DG.SaveLoad.setFlag(_gs, `TRAINER_${trainerId}_DEFEATED`);
            const postLines = (DG.STORY && DG.STORY.DIALOGUES && DG.STORY.DIALOGUES['RIVAL_POST_1_WIN'])
              || [`FLINT: Hmph! Beginner's luck. Enjoy it while it lasts!`];
            DG.DialogueBox.show(postLines, function() {
              _blocked = false;
              DG.SaveLoad.save(_gs);
            });
          } else {
            const loseLines = (DG.STORY && DG.STORY.DIALOGUES && DG.STORY.DIALOGUES['RIVAL_POST_1_LOSE'])
              || [`FLINT: Haha! That's more like it. Train harder, rookie!`];
            DG.DialogueBox.show(loseLines, function() {
              _blocked = false;
            });
          }
        }
      });
    });
    }); // einde _ensureRivalNamed (FASE 7)
  }

  return {
    init, update, warp,
    getMapData, getCamX, getCamY,
    isTransitioning, transAlpha,
    isBlocked, setBlocked, getTrainerAlert,
    getEncounterFade, getEncounterFadeAlpha,
    isSurfing, drawObjectiveHint, triggerStarterRival,
    flyTo, flyDestinations, canFlyNow,
  };
})();

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
      _startTransition(mapId, destX, destY);
      return;
    }

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
      if (sign) DG.DialogueBox.show([sign.text], () => {});
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

    // onInteract: OPEN_SHOP
    if (npc.onInteract === 'OPEN_SHOP' && npc.shopItems) {
      DG.Events.shopMenu(npc.shopItems, _gs, () => { _blocked = false; DG.SaveLoad.save(_gs); });
      return;
    }

    // onInteract: TRIGGER_STARTER (Professor Stratum gives starter DinoMon)
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
                _blocked = false;
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
              DG.DialogueBox.show(['PRIMORDIA has joined your team!'], () => { _blocked = false; DG.SaveLoad.save(_gs); });
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
              DG.DialogueBox.show(['CRATERON has joined your team!', 'The Primordial Flame burns for you now.'], () => { _blocked = false; DG.SaveLoad.save(_gs); });
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
                // LOSE — reset gym trainers if this was a gym battle (Feature 1)
                const lostGymId = _gs.player._lastGymId;
                if (lostGymId) {
                  _resetGymTrainers(_gs, lostGymId);
                  _gs.player._lastGymId = null;
                } else {
                  _blocked = false;
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
        const lines = _ld(trainer.postBattleDialogue) || ['You were amazing!'];
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
              // LOSE — reset gym trainers if this was a gym battle (Feature 1)
              const lostGymId = _gs.player._lastGymId;
              if (lostGymId) {
                _resetGymTrainers(_gs, lostGymId);
                _gs.player._lastGymId = null;
              } else {
                _blocked = false;
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
      5:'Bedrock Badge',6:'Static Badge',7:'Tide Badge',8:'Scale Badge'
    };
    window._BADGE_SCREEN = {
      frames: 240,       // ~4 seconds at 60fps
      count: badgeCount,
      name: badgeNames[badgeCount] || 'Badge'
    };
    const ceremonies = {
      1: [
        '\u2605 Herd Badge obtained! \u2605',
        "Rex's badge proves your DinoMons have mastered raw power.",
        "The Officer blocking Route 2 has stepped aside!",
        "Head WEST through Shellcreek City to reach Route 2 \u2192 Dustwall Town.",
      ],
      2: [
        '\u2605 Fossil Badge obtained! \u2605',
        "Ridley's mark — proof you can crack any formation.",
        "The Officer on Route 3 has stepped aside!",
        "Head SOUTH from Dustwall Town via Route 3 \u2192 Pyreside City.",
      ],
      3: [
        '\u2605 Magma Badge obtained! \u2605',
        "The volcanic spirit of Ignis fuels your DinoMons' fire.",
        "The Officer on Route 4 has stepped aside!",
        "Head SOUTH via Route 4 \u2192 Ferngrove Town.",
      ],
      4: [
        '\u2605 Canopy Badge obtained! \u2605',
        "The ancient forest recognises your bond with nature.",
        "The Officer on Route 5 has stepped aside!",
        "Head NORTH via Route 5 \u2192 Stonehaven City.",
      ],
      5: [
        '\u2605 Bedrock Badge obtained! \u2605',
        "Terra's ancient power runs as deep as the earth itself.",
        "Routes 6 and 7 are now open!",
        "Head WEST on Route 6 for Crestfall Town, or EAST on Route 7 for Bogmire City.",
      ],
      6: [
        '\u2605 Static Badge obtained! \u2605',
        "Volt's electric fury could not stop you — the Static Badge is yours!",
        "The Officer on Route 8 has stepped aside!",
        "Head SOUTH via Route 8 \u2192 Bogmire City.",
      ],
      7: [
        '\u2605 Tide Badge obtained! \u2605',
        "You've calmed the tide. The waterways of the Archipelago are open!",
        "The Officer on Route 9 has stepped aside!",
        "Head NORTH via Route 9 \u2192 Apex Summit City.",
      ],
      8: [
        '\u2605 Scale Badge obtained! \u2605',
        "All 8 badges shine! You are ready for the ultimate challenge.",
        "The Fossil Gateway is now open!",
        "Head to the FOSSIL GATEWAY \u2192 Elite Four \u2192 Grand Archon Corvus awaits!",
      ],
    };
    // Field-move unlock dialogue shown after the badge ceremony
    const fieldMoveLines = {
      2: ["HM Rock Smash received! Teach it to a DinoMon to smash boulders outside battle."],
      3: ["HM Flash received! Teach it to a DinoMon to illuminate dark caves."],
      4: ["HM Cut received! Teach it to a DinoMon to clear overgrown paths."],
      5: ["HM Strength received! Teach it to a DinoMon to move heavy boulders."],
      6: ["HM Fly received! Teach it to a DinoMon to soar between visited cities."],
      7: ["HM Surf received! Teach it to a DinoMon to ride across open water.",
          "The sea routes of the Pangaea Archipelago are now open to you!"],
      8: ["HM Dive received! Teach it to a DinoMon to plunge into deep-water caverns."],
    };
    const lines = ceremonies[badgeCount] || ['\u2605 Badge obtained! \u2605'];
    const fmLines = fieldMoveLines[badgeCount] || null;
    // Chain: ceremony → field-move lines (if any) → onDone
    DG.DialogueBox.show(lines, () => {
      if (fmLines) {
        DG.DialogueBox.show(fmLines, () => { if (typeof onDone === 'function') onDone(); });
      } else {
        if (typeof onDone === 'function') onDone();
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
      5: { hmId: 'HM_STRENGTH',   flagKey: 'STRENGTH_UNLOCKED',
           dialogue: "With the Bedrock Badge, your DinoMons can use Strength to move boulders!" },
      6: { hmId: 'HM_FLY',        flagKey: 'FLY_UNLOCKED',
           dialogue: "With the Static Badge, your DinoMons can Fly between cities you've visited!" },
      7: { hmId: 'HM_SURF',       flagKey: 'SURF_UNLOCKED',
           dialogue: ["With the Tide Badge, your DinoMons can Surf across water! New routes are now open!",
                      "The waterways of the Pangaea Archipelago are now open to you!"] },
      8: { hmId: 'HM_DIVE',       flagKey: 'DIVE_UNLOCKED',
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
  function _startTransition(mapId, x, y) {
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
    try { _updateCamera(); } catch(e) {}
    try { DG.SaveLoad.save(_gs); } catch(e) {}
  }

  // _updateTransition kept as no-op for safety (isTransitioning always returns false now)
  function _updateTransition() {
    _transitioning = false;
    _blocked       = false;
    _transAlpha    = 0;
  }

  // Public warp (called from events)
  function warp(mapId, x, y) {
    _startTransition(mapId, x, y);
  }

  // ── Map Loading ───────────────────────────────────────────
  function _loadMap(mapId) {
    const newData = DG.MAPS[mapId];
    if (!newData) {
      console.error('[Overworld] Map not found:', mapId);
      return;  // _mapData is preserved — old map stays visible
    }
    _mapData = newData;

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
      // ── Interior maps ────────────────────────────────────────
      'AMBERTOWN_LAB':      'LAB',     'AMBERTOWN_CENTER':    'CENTER',
      'AMBERTOWN_HOUSE':    'HOUSE',   'AMBERTOWN_SHOP':      'SHOP',
      'SHELLCREEK_CENTER':  'CENTER',  'DUSTWALL_CENTER':     'CENTER',
      'PYRESIDE_CENTER':    'CENTER',  'PYRESIDE_SHOP':       'SHOP',
      'FERNGROVE_CENTER':   'CENTER',  'STONEHAVEN_CENTER':   'CENTER',
      'CRESTFALL_CENTER':   'CENTER',  'BOGMIRE_CENTER':      'CENTER',
      'APEXSUMMIT_CENTER':  'CENTER',
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
      DG.DialogueBox.show(["The path is blocked."]);
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

  // ── Objective HUD ─────────────────────────────────────────
  function drawObjectiveHint(ctx, gs) {
    if (!gs || !gs.player) return;
    // Don't show if dialogue is open
    if (typeof DG.DialogueBox !== 'undefined' && DG.DialogueBox.isVisible()) return;

    const flags = gs.player.flags || {};
    let text = '';
    if (flags['ELITE_4_DONE'] || flags['DIRECTOR_CLADE_DEFEATED']) {
      text = '\uD83C\uDFAF Champion! Explore the post-game';
    } else if (flags['BADGE_8']) {
      text = '\uD83C\uDFAF Goal: Challenge the Elite Four!';
    } else if (flags['BADGE_7']) {
      text = '\uD83C\uDFAF Goal: Reach Apex Summit \u2192 Gym 8: Valdez';
    } else if (flags['BADGE_6']) {
      text = '\uD83C\uDFAF Goal: Reach Bogmire \u2192 Gym 7: Marina';
    } else if (flags['BADGE_5']) {
      text = '\uD83C\uDFAF Goal: Reach Crestfall \u2192 Gym 6: Volt';
    } else if (flags['BADGE_4']) {
      text = '\uD83C\uDFAF Goal: Reach Stonehaven \u2192 Gym 5: Terra';
    } else if (flags['BADGE_3']) {
      text = '\uD83C\uDFAF Goal: Reach Ferngrove \u2192 Gym 4: Sylva';
    } else if (flags['BADGE_2']) {
      text = '\uD83C\uDFAF Goal: Reach Pyreside \u2192 Gym 3: Ignis';
    } else if (flags['BADGE_1']) {
      text = '\uD83C\uDFAF Goal: Reach Dustwall \u2192 Gym 2: Ridley';
    } else {
      text = '\uD83C\uDFAF Goal: Defeat Rex at Shellcreek Gym';
    }

    if (!text) return;

    const W = DG.CANVAS.W;
    ctx.save();

    // Measure text first
    ctx.font = '9px monospace';
    const tw = ctx.measureText(text).width;

    // Badge pill dimensions
    const pillW  = Math.min(tw + 12, 230);
    const pillH  = 16;
    const pillX  = W - pillW - 4;
    const pillY  = 4;
    const pillR  = 4;

    // Background rounded rect
    ctx.fillStyle = 'rgba(0,0,20,0.7)';
    ctx.beginPath();
    ctx.moveTo(pillX + pillR, pillY);
    ctx.lineTo(pillX + pillW - pillR, pillY);
    ctx.quadraticCurveTo(pillX + pillW, pillY, pillX + pillW, pillY + pillR);
    ctx.lineTo(pillX + pillW, pillY + pillH - pillR);
    ctx.quadraticCurveTo(pillX + pillW, pillY + pillH, pillX + pillW - pillR, pillY + pillH);
    ctx.lineTo(pillX + pillR, pillY + pillH);
    ctx.quadraticCurveTo(pillX, pillY + pillH, pillX, pillY + pillH - pillR);
    ctx.lineTo(pillX, pillY + pillR);
    ctx.quadraticCurveTo(pillX, pillY, pillX + pillR, pillY);
    ctx.closePath();
    ctx.fill();

    // Text shadow
    ctx.fillStyle = 'rgba(0,0,60,0.7)';
    ctx.textBaseline = 'middle';
    ctx.textAlign    = 'left';
    ctx.fillText(text, pillX + 6 + 1, pillY + pillH / 2 + 1);

    // Text
    ctx.fillStyle = '#ccddff';
    ctx.fillText(text, pillX + 6, pillY + pillH / 2);

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
      || ["PROF. STRATUM: 'What was his name again?'"];
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
  };
})();

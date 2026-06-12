// DinoMon: Fossil Frontier — world/events.js  v14
// Story flag checks and cutscene scripting engine

window.DG = window.DG || {};

DG.Events = (function () {

  // ── Event queue ───────────────────────────────────────────
  let _queue = [];
  let _running = false;
  let _current = null;
  let _onDone = null;

  // ── Public: trigger a map event by ID ────────────────────
  function trigger(eventId, gameState, onDone) {
    const def = DG.STORY.EVENTS[eventId];
    if (!def) {
      if (typeof onDone === 'function') onDone();
      return;
    }
    _queue.push({ def, gameState, onDone });
    if (!_running) _next();
  }

  // ── Check tile events for a position ─────────────────────
  function checkTile(mapData, x, y, gameState, onDone) {
    if (!mapData || !mapData.events) { if (onDone) onDone(); return; }
    const ev = mapData.events.find(e => e.x === x && e.y === y &&
      (e.triggerType === 'TILE' || e.triggerType === 'AUTO'));
    if (!ev) { if (onDone) onDone(); return; }
    _triggerMapEvent(ev, gameState, onDone);
  }

  // ── Check interact events facing a tile ──────────────────
  function checkInteract(mapData, x, y, gameState, onDone) {
    if (!mapData || !mapData.events) { if (onDone) onDone(); return; }
    const ev = mapData.events.find(e => e.x === x && e.y === y &&
      e.triggerType === 'INTERACT');
    if (!ev) { if (onDone) onDone(); return; }
    _triggerMapEvent(ev, gameState, onDone);
  }

  function _triggerMapEvent(ev, gameState, onDone) {
    // Check flag requirements
    if (ev.flagRequired && !DG.SaveLoad.getFlag(gameState, ev.flagRequired)) {
      if (onDone) onDone();
      return;
    }
    if (ev.flagBlockedBy && DG.SaveLoad.getFlag(gameState, ev.flagBlockedBy)) {
      if (onDone) onDone();
      return;
    }

    // Set flag if specified
    if (ev.flagSet) {
      DG.SaveLoad.setFlag(gameState, ev.flagSet);
    }

    // Execute action
    if (ev.action === 'DIALOGUE' && ev.dialogue) {
      DG.DialogueBox.show(ev.dialogue, onDone);
    } else if (ev.action === 'BATTLE' && ev.trainerId) {
      if (!DG.SaveLoad.getFlag(gameState, `TRAINER_${ev.trainerId}_DEFEATED`)) {
        _startTrainerBattle(ev.trainerId, gameState, onDone);
      } else {
        if (onDone) onDone();
      }
    } else if (ev.action === 'GIVE_MON') {
      // Check one-time flag
      const giftFlag = ev.giftFlag || `GIFT_${ev.speciesId}_GIVEN`;
      if (ev.giftFlag && DG.SaveLoad.getFlag(gameState, giftFlag)) {
        if (onDone) onDone(); return;
      }
      const mon = DG.SaveLoad.createDinoMon(ev.speciesId, ev.level || 5, ev.nickname || null);
      if (mon && gameState.player.party.length < 6) {
        gameState.player.party.push(mon);
        DG.SaveLoad.markCaught(gameState, ev.speciesId);
        if (ev.giftFlag) DG.SaveLoad.setFlag(gameState, giftFlag);
        const monName = mon.nickname || DG.SPECIES[ev.speciesId]?.name || ev.speciesId;
        DG.DialogueBox.show([`You received ${monName}!`, `Take good care of it!`], onDone);
      } else {
        DG.DialogueBox.show(['Your party is full!'], onDone);
      }
    } else if (ev.action === 'GIVE_ITEM') {
      DG.SaveLoad.addItem(gameState, ev.itemId, ev.qty || 1);
      const itemName = (DG.ITEMS && DG.ITEMS[ev.itemId]?.name) || ev.itemId;
      // Trigger item pickup sparkle animation (shows at player screen position)
      (function() {
        const T   = (DG.CANVAS && DG.CANVAS.TILE_SIZE) || 32;
        const px2 = gameState.player.x;
        const py2 = gameState.player.y;
        const camX = (typeof DG.Overworld !== 'undefined' && DG.Overworld.getCamX) ? DG.Overworld.getCamX() : 0;
        const camY = (typeof DG.Overworld !== 'undefined' && DG.Overworld.getCamY) ? DG.Overworld.getCamY() : 0;
        window._ITEM_PICKUP_ANIM = {
          frames:  55,
          name:    itemName,
          screenX: px2 * T - camX + T / 2,
          screenY: py2 * T - camY + T / 2 - 12,
        };
      })();
      DG.DialogueBox.show([`You received ${itemName}!`], onDone);
    } else if (ev.action === 'STORY_BATTLE') {
      _startStoryBattle(ev, gameState, onDone);
    } else if (ev.action === 'WARP') {
      if (typeof DG.Overworld !== 'undefined') {
        DG.Overworld.warp(ev.mapId, ev.destX, ev.destY);
      }
      if (onDone) onDone();
    } else {
      if (onDone) onDone();
    }
  }

  function _startTrainerBattle(trainerId, gameState, onDone) {
    const trainer = DG.TRAINERS[trainerId];
    if (!trainer) { if (onDone) onDone(); return; }

    const pre = trainer.preBattleDialogue;
    if (pre && pre.length) {
      DG.DialogueBox.show(pre, () => _executeBattle(trainer, trainerId, gameState, onDone));
    } else {
      _executeBattle(trainer, trainerId, gameState, onDone);
    }
  }

  function _executeBattle(trainer, trainerId, gameState, onDone) {
    const firstEnemy = DG.SaveLoad.createDinoMon(trainer.party[0].speciesId, trainer.party[0].level);
    DG.Battle.start({
      type: 'TRAINER',
      enemy: firstEnemy,
      trainerData: trainer,
      gameState,
      onEnd: function(result) {
        if (result === 'WIN') {
          DG.SaveLoad.setFlag(gameState, `TRAINER_${trainerId}_DEFEATED`);
          const post = trainer.postBattleDialogue;
          if (post && post.length) {
            DG.DialogueBox.show(post, onDone);
          } else {
            if (onDone) onDone();
          }
        } else {
          if (onDone) onDone();
        }
      }
    });
  }

  function _startStoryBattle(ev, gameState, onDone) {
    const trainerId = ev.trainerId;
    const trainer   = DG.TRAINERS[trainerId];
    // fix: use TRAINER_ prefix to match the standard flag format used everywhere else
    if (!trainer || DG.SaveLoad.getFlag(gameState, `TRAINER_${trainerId}_DEFEATED`)) {
      if (onDone) onDone();
      return;
    }
    DG.DialogueBox.show(trainer.preBattleDialogue || [`${trainer.name} challenges you!`], () => {
      const firstEnemy = DG.SaveLoad.createDinoMon(trainer.party[0].speciesId, trainer.party[0].level);
      DG.Battle.start({
        type: 'TRAINER',
        enemy: firstEnemy,
        trainerData: trainer,
        gameState,
        onEnd: function(result) {
          if (result === 'WIN') {
            DG.SaveLoad.setFlag(gameState, `TRAINER_${trainerId}_DEFEATED`);  // fix: was missing TRAINER_ prefix
            const post = trainer.postBattleDialogue || [];
            DG.DialogueBox.show(post, onDone);
          } else {
            if (onDone) onDone();
          }
        }
      });
    });
  }

  // ── Internal queue processing ─────────────────────────────
  function _next() {
    if (_queue.length === 0) { _running = false; return; }
    _running = true;
    const item = _queue.shift();
    // story events from DG.STORY.EVENTS are arrays of dialogue lines currently
    DG.DialogueBox.show(item.def.lines || [JSON.stringify(item.def)], () => {
      if (typeof item.onDone === 'function') item.onDone();
      _next();
    });
  }

  // ── Starter selection ─────────────────────────────────────
  // Called once at new game start; shows choice of 3 starters
  function starterSelection(gameState, onDone) {
    const STARTER_FLAG = (DG.STORY && DG.STORY.FLAGS && DG.STORY.FLAGS.STARTER_CHOSEN) || 'STARTER_CHOSEN';
    if (DG.SaveLoad.getFlag(gameState, STARTER_FLAG)) {
      if (onDone) onDone();
      return;
    }

    const starters = [
      { id: 'TINDREL',  label: 'Tindrel  (Fire)',  type: 'FIRE'  },
      { id: 'LEAFAWN',  label: 'Leafawn  (Grass)', type: 'GRASS' },
      { id: 'AQUEEL',   label: 'Aqueel   (Water)', type: 'WATER' },
    ];

    if (typeof DG.Menu !== 'undefined') {
      DG.Menu.showChoiceMenu(
        "Professor Stratum:\nChoose your partner DinoMon!",
        starters.map(s => s.label),
        function(choiceIdx) {
          const chosen = starters[choiceIdx];
          const mon = DG.SaveLoad.createDinoMon(chosen.id, 5);
          gameState.player.party.push(mon);
          DG.SaveLoad.markCaught(gameState, chosen.id);
          DG.SaveLoad.setFlag(gameState, STARTER_FLAG);
          // Track starter type for rival battle variant selection
          gameState.player.flags['STARTER_CHOSEN'] = chosen.type;
          DG.DialogueBox.show([
            `You chose ${DG.SPECIES[chosen.id].name}!`,
            `Take good care of your DinoMon!`,
          ], function() {
            // Trigger nickname entry for the starter before calling onDone
            window._PENDING_STARTER_NICK = mon;
            if (typeof onDone === 'function') onDone();
          });
        }
      );
    } else {
      // Fallback: pick first starter automatically (FIRE)
      const mon = DG.SaveLoad.createDinoMon('TINDREL', 5);
      gameState.player.party.push(mon);
      DG.SaveLoad.setFlag(gameState, STARTER_FLAG);
      gameState.player.flags['STARTER_CHOSEN'] = 'FIRE';
      if (onDone) onDone();
    }
  }

  // ── Professor introduction cutscene ───────────────────────────
  function professorIntro(gameState, onDone) {
    // Chain all three intro dialogue blocks together
    const part1 = DG.STORY.DIALOGUES['PROF_INTRO_1'] || ['Welcome to the world of DinoMons!'];
    const part2 = DG.STORY.DIALOGUES['PROF_INTRO_2'] || ['A shadowy group threatens the peace.'];
    const part3 = DG.STORY.DIALOGUES['PROF_INTRO_3'] || ['Now — choose your partner DinoMon!'];
    const allLines = [...part1, ...part2, ...part3];

    DG.DialogueBox.show(allLines, function () {
      if (typeof onDone === 'function') onDone();
    });
  }

  // ── Heal at Pokémon Center ────────────────────────────────
  function healParty(gameState, onDone) {
    for (const mon of gameState.player.party) {
      if (!mon) continue;  // fix: guard against null slots
      mon.hp.current = mon.hp.max;
      mon.statusEffect = null;
      mon.statusTurns  = 0;
      mon.confusionTurns = 0;
      for (const mv of (mon.moves || [])) {  // fix: guard against undefined moves array
        if (mv) mv.ppCurrent = mv.ppMax;
      }
    }
    DG.DialogueBox.show([
      'Welcome to the DinoMon Center!',
      'We will restore your DinoMons to full health!',
      '...',
      'Your DinoMons are fully healed!',
      'Have a nice day!',
    ], onDone);
  }

  // ── Shop ──────────────────────────────────────────────────
  function shopMenu(shopItems, gameState, onDone) {
    if (typeof DG.Menu !== 'undefined') {
      DG.Menu.showShop(shopItems, gameState, onDone);
    } else {
      if (onDone) onDone();
    }
  }

  // ── Cutscene system ──────────────────────────────────────────
  let _cutscene = null; // { steps, stepIndex, gs, onDone, waitingBattle }

  function _runCutscene(steps, gs, onDone) {
    _cutscene = { steps, stepIndex: 0, gs, onDone, waitingBattle: false };
    _advanceCutscene();
  }

  function _advanceCutscene() {
    if (!_cutscene) return;
    const step = _cutscene.steps[_cutscene.stepIndex];
    if (!step) {
      // All done
      const cb = _cutscene.onDone;
      _cutscene = null;
      if (typeof cb === 'function') cb();
      return;
    }

    if (step.type === 'dialogue') {
      DG.DialogueBox.show(step.lines, function() {
        _cutscene.stepIndex++;
        _advanceCutscene();
      });
    } else if (step.type === 'flag') {
      DG.SaveLoad.setFlag(_cutscene.gs, step.key);
      _cutscene.stepIndex++;
      _advanceCutscene();
    } else if (step.type === 'battle') {
      _cutscene.waitingBattle = true;
      const trainer = DG.TRAINERS[step.trainerId];
      if (!trainer) { _cutscene.stepIndex++; _advanceCutscene(); return; }
      DG.Battle.start({ type:'TRAINER', trainer, gameState:_cutscene.gs,
        onEnd: function() {
          _cutscene.waitingBattle = false;
          _cutscene.stepIndex++;
          _advanceCutscene();
        }
      });
    } else if (step.type === 'wait') {
      let frames = step.frames || 60;
      const tick = setInterval(function() {
        frames--;
        if (frames <= 0) {
          clearInterval(tick);
          _cutscene.stepIndex++;
          _advanceCutscene();
        }
      }, 16);
    } else {
      // Unknown step type — skip
      _cutscene.stepIndex++;
      _advanceCutscene();
    }
  }

  function isCutscenePlaying() {
    return !!_cutscene;
  }

  // ── Cutscene definitions ─────────────────────────────────────

  function _startCutsceneTriassic(gs, onDone) {
    _runCutscene([
      { type:'dialogue', lines:['A figure in black armor steps from the shadows!'] },
      { type:'dialogue', lines:['TRIASSIC: "A new trainer? With DinoMons?"', '"Team Extinction will restore the prehistoric order!"', '"Prove yourself worthy — face me!"'] },
      { type:'battle',   trainerId:'COMMANDER_TRIASSIC' },
      { type:'dialogue', lines:['TRIASSIC: "Impressive... you have potential, trainer."', '"But Team Extinction\'s plans are already in motion."', '"Enjoy your freedom while it lasts!"'] },
      { type:'dialogue', lines:['Commander Triassic retreats into the shadows...', 'The path forward is clear!'] },
      { type:'flag',     key:'EVENT_TRIASSIC_DONE' },
    ], gs, onDone);
  }

  function _startCutsceneJurassic(gs, onDone) {
    _runCutscene([
      { type:'dialogue', lines:['A tall armored figure blocks your path!'] },
      { type:'dialogue', lines:['JURASSIC: "So you\'ve made it this far, little trainer."', '"The Permian Core grows stronger each day!"', '"I, Commander Jurassic, will end your journey here!"'] },
      { type:'battle',   trainerId:'COMMANDER_JURASSIC' },
      { type:'dialogue', lines:['JURASSIC: "Defeated... by a child?! Unbelievable!"', '"No matter — Director Clade awaits at Mt. Cretaceous."', '"You\'ll never stop what has already begun!"'] },
      { type:'flag',     key:'EVENT_JURASSIC_DONE' },
    ], gs, onDone);
  }

  function _startCutsceneCretaceous(gs, onDone) {
    _runCutscene([
      { type:'dialogue', lines:['The path is blocked by a massive armored warrior!'] },
      { type:'dialogue', lines:['CRETACEOUS: "HALT! None shall approach Mt. Cretaceous!"', '"The Permian Core awakens within hours!"', '"I am Commander Cretaceous — your final obstacle!"'] },
      { type:'battle',   trainerId:'COMMANDER_CRETACEOUS' },
      { type:'dialogue', lines:['CRETACEOUS: "Impossible! My DinoMons... defeated!"', '"You\'re too late — the Director has begun the ritual!"'] },
      { type:'dialogue', lines:['The path to Apex Summit is now clear!', 'Hurry — Director Clade must be stopped!'] },
      { type:'flag',     key:'EVENT_CRETACEOUS_DONE' },
    ], gs, onDone);
  }

  function _startCutsceneClade(gs, onDone) {
    _runCutscene([
      { type:'dialogue', lines:['The volcanic air crackles with ancient energy...', "A massive glowing crystal pulses at the mountain's heart!"] },
      { type:'dialogue', lines:['DIRECTOR CLADE: "You\'ve come far, young trainer."', '"But you are too late. The Permian Core is nearly awakened!"'] },
      { type:'dialogue', lines:['CLADE: "With its power, all DinoMons return to their feral state."', '"Humanity swept aside — as nature intended!"', '"You want to stop me? Then face me in battle!"'] },
      { type:'battle',   trainerId:'DIRECTOR_CLADE' },
      { type:'dialogue', lines:['The Permian Core shudders... and goes dark!', 'CLADE: "No... my life\'s work... undone by a child..."'] },
      { type:'dialogue', lines:['CLADE: "Perhaps... perhaps I was wrong."', '"The ancient world is gone. We must protect what remains."'] },
      { type:'dialogue', lines:['The volcanic energy dissipates peacefully...', 'The Pangaea Archipelago is safe!', 'You are the Champion of the Fossil Frontier!'] },
      { type:'flag',     key:'EVENT_CLADE_DONE' },
      { type:'flag',     key:'CHAMPION_DONE' },
    ], gs, onDone);
  }

  // ── Cutscene trigger checks ───────────────────────────────────
  function _checkCutsceneTriggers(gs, mapId, playerX, playerY) {
    if (!gs || !gs.player) return;
    const flags = gs.player.flags || {};

    // Triassic: Route 2, near center, needs Badge 1, not yet done
    if (mapId === 'ROUTE_2' && playerX >= 8 && playerX <= 12 && playerY >= 7 && playerY <= 9) {
      if (flags['BADGE_1'] && !flags['EVENT_TRIASSIC_DONE'] && !_cutscene) {
        _startCutsceneTriassic(gs, function() {});
      }
    }
    // Jurassic: Route 6, needs Badge 5
    if (mapId === 'ROUTE_6' && playerX >= 8 && playerX <= 14 && playerY >= 5 && playerY <= 8) {
      if (flags['BADGE_5'] && !flags['EVENT_JURASSIC_DONE'] && !_cutscene) {
        _startCutsceneJurassic(gs, function() {});
      }
    }
    // Cretaceous: Route 9, needs Badge 7
    if (mapId === 'ROUTE_9' && playerX >= 8 && playerX <= 14 && playerY >= 5 && playerY <= 8) {
      if (flags['BADGE_7'] && !flags['EVENT_CRETACEOUS_DONE'] && !_cutscene) {
        _startCutsceneCretaceous(gs, function() {});
      }
    }
    // Clade: MT_CRETACEOUS, needs Elite Four done
    if (mapId === 'MT_CRETACEOUS' && playerX >= 8 && playerX <= 14 && playerY >= 3 && playerY <= 7) {
      if (flags['ELITE_4_DONE'] && !flags['EVENT_CLADE_DONE'] && !_cutscene) {
        _startCutsceneClade(gs, function() {});
      }
    }
  }

  console.log('[DinoMon] Events loaded.');

  return {
    trigger,
    checkTile,
    checkInteract,
    professorIntro,
    starterSelection,
    healParty,
    shopMenu,
    checkCutsceneTriggers: _checkCutsceneTriggers,
    isCutscenePlaying,
  };
})();

// DinoMon: Fossil Frontier — world/fieldMoves.js
// HM field moves, fishing, repels, and key item use in the overworld

window.DG = window.DG || {};

DG.FieldMoves = (function () {

  // ── Routes where the roaming Legendary can appear ─────────
  const ROAMING_ROUTES = [
    'ROUTE_1','ROUTE_2','ROUTE_3','ROUTE_4','ROUTE_5',
    'ROUTE_6','ROUTE_7','ROUTE_8','ROUTE_9','ROUTE_10',
  ];

  // ── Check if party has a mon that knows a given move ───────
  function partyHasMove(party, moveId) {
    if (!party) return null;
    for (const mon of party) {
      if (!mon || mon.hp.current <= 0) continue;
      if (mon.moves && mon.moves.some(mv => mv.moveId === moveId)) return mon;
    }
    return null;
  }

  // ── Convenience: boolean HM checks (for gating logic) ──────
  // Each check requires BOTH: a party mon that knows the move AND the unlock flag from the badge.

  function _hasFlag(gameState, flagKey) {
    return !!(gameState && gameState.player && gameState.player.flags && gameState.player.flags[flagKey]);
  }

  function canSurf(gameState) {
    if (!gameState || !gameState.player) return false;
    return _hasFlag(gameState, 'SURF_UNLOCKED') && !!(partyHasMove(gameState.player.party, 'SURF'));
  }

  function canCut(gameState) {
    if (!gameState || !gameState.player) return false;
    return _hasFlag(gameState, 'CUT_UNLOCKED') && !!(partyHasMove(gameState.player.party, 'CUT'));
  }

  function canRockSmash(gameState) {
    if (!gameState || !gameState.player) return false;
    return _hasFlag(gameState, 'ROCK_SMASH_UNLOCKED') && !!(partyHasMove(gameState.player.party, 'ROCK_SMASH'));
  }

  function canStrength(gameState) {
    if (!gameState || !gameState.player) return false;
    return _hasFlag(gameState, 'STRENGTH_UNLOCKED') && !!(partyHasMove(gameState.player.party, 'STRENGTH'));
  }

  function canFlash(gameState) {
    if (!gameState || !gameState.player) return false;
    return _hasFlag(gameState, 'FLASH_UNLOCKED') && !!(partyHasMove(gameState.player.party, 'FLASH'));
  }

  function canFly(gameState) {
    if (!gameState || !gameState.player) return false;
    return _hasFlag(gameState, 'FLY_UNLOCKED') && !!(partyHasMove(gameState.player.party, 'FLY'));
  }

  function canDive(gameState) {
    if (!gameState || !gameState.player) return false;
    return _hasFlag(gameState, 'DIVE_UNLOCKED') && !!(partyHasMove(gameState.player.party, 'DIVE'));
  }

  // ── Best rod in the bag ────────────────────────────────────
  function getBestRod(bag) {
    if (!bag) return null;
    if (bag.SUPER_ROD > 0) return 'SUPER_ROD';
    if (bag.GOOD_ROD  > 0) return 'GOOD_ROD';
    if (bag.OLD_ROD   > 0) return 'OLD_ROD';
    return null;
  }

  // ── SURF ──────────────────────────────────────────────────
  // onSuccess called if surf is allowed; shows dialogue first
  function trySurf(gs, onSuccess, onFail) {
    if (!_hasFlag(gs, 'SURF_UNLOCKED')) {
      DG.DialogueBox.show(["The water is too deep to cross.", "You'll need a DinoMon that knows Surf!"], onFail || (() => {}));
      return false;
    }
    const mon = partyHasMove(gs.player.party, 'SURF');
    if (!mon) {
      DG.DialogueBox.show(["You need a DinoMon that knows Surf!", "Teach Surf to a Water-type partner."], onFail || (() => {}));
      return false;
    }
    const name = DG.SPECIES[mon.speciesId]?.name || 'DinoMon';
    DG.DialogueBox.show([`${name} used Surf!`, "Riding the waves..."], onSuccess || (() => {}));
    return true;
  }

  // ── CUT ───────────────────────────────────────────────────
  function tryCut(gs, onSuccess, onFail) {
    if (!_hasFlag(gs, 'CUT_UNLOCKED')) {
      DG.DialogueBox.show(["There's a tree in the way.", "Earn the Canopy Badge to use Cut outside of battle!"], onFail || (() => {}));
      return false;
    }
    const mon = partyHasMove(gs.player.party, 'CUT');
    if (!mon) {
      DG.DialogueBox.show(["There's a tree in the way.", "A DinoMon that knows Cut could slice it down!"], onFail || (() => {}));
      return false;
    }
    const name = DG.SPECIES[mon.speciesId]?.name || 'DinoMon';
    DG.DialogueBox.show([`${name} used Cut!`, "The tree was sliced down!"], onSuccess || (() => {}));
    return true;
  }

  // ── ROCK SMASH ────────────────────────────────────────────
  function tryRockSmash(gs, onSuccess, onFail) {
    if (!_hasFlag(gs, 'ROCK_SMASH_UNLOCKED')) {
      DG.DialogueBox.show(["A cracked rock blocks the way.", "Earn the Fossil Badge to use Rock Smash outside of battle!"], onFail || (() => {}));
      return false;
    }
    const mon = partyHasMove(gs.player.party, 'ROCK_SMASH');
    if (!mon) {
      DG.DialogueBox.show(["A cracked rock blocks the way.", "A DinoMon with Rock Smash could break it!"], onFail || (() => {}));
      return false;
    }
    const name = DG.SPECIES[mon.speciesId]?.name || 'DinoMon';
    DG.DialogueBox.show([`${name} used Rock Smash!`, "The rock crumbled away!"], onSuccess || (() => {}));
    return true;
  }

  // ── STRENGTH ──────────────────────────────────────────────
  function tryStrength(gs, onSuccess, onFail) {
    if (!_hasFlag(gs, 'STRENGTH_UNLOCKED')) {
      DG.DialogueBox.show(["A heavy boulder blocks the path.", "Earn the Bedrock Badge to use Strength outside of battle!"], onFail || (() => {}));
      return false;
    }
    const mon = partyHasMove(gs.player.party, 'STRENGTH');
    if (!mon) {
      DG.DialogueBox.show(["A heavy boulder blocks the path.", "A DinoMon with Strength could push it aside!"], onFail || (() => {}));
      return false;
    }
    const name = DG.SPECIES[mon.speciesId]?.name || 'DinoMon';
    DG.DialogueBox.show([`${name} used Strength!`, "The boulder was pushed aside!"], onSuccess || (() => {}));
    return true;
  }

  // ── WATERFALL ─────────────────────────────────────────────
  function tryWaterfall(gs, onSuccess, onFail) {
    // Waterfall gated by Surf unlock (requires surfing ability first)
    if (!_hasFlag(gs, 'SURF_UNLOCKED')) {
      DG.DialogueBox.show(["The waterfall is too powerful to climb.", "You need the Tide Badge and Surf first!"], onFail || (() => {}));
      return false;
    }
    const mon = partyHasMove(gs.player.party, 'WATERFALL');
    if (!mon) {
      DG.DialogueBox.show(["The waterfall is too powerful to climb.", "A DinoMon with Waterfall could carry you up!"], onFail || (() => {}));
      return false;
    }
    const name = DG.SPECIES[mon.speciesId]?.name || 'DinoMon';
    DG.DialogueBox.show([`${name} used Waterfall!`, "Climbing the falls..."], onSuccess || (() => {}));
    return true;
  }

  // ── DIVE ──────────────────────────────────────────────────
  function tryDive(gs, onSuccess, onFail) {
    if (!_hasFlag(gs, 'DIVE_UNLOCKED')) {
      DG.DialogueBox.show(["The water is too dark and deep to enter.", "Earn the Scale Badge to use Dive outside of battle!"], onFail || (() => {}));
      return false;
    }
    const mon = partyHasMove(gs.player.party, 'DIVE');
    if (!mon) {
      DG.DialogueBox.show(["The water is too dark and deep to enter.", "A DinoMon with Dive could take you below!"], onFail || (() => {}));
      return false;
    }
    const name = DG.SPECIES[mon.speciesId]?.name || 'DinoMon';
    DG.DialogueBox.show([`${name} used Dive!`, "Diving into the deep..."], onSuccess || (() => {}));
    return true;
  }

  // ── FISHING ───────────────────────────────────────────────
  // onEncounter(mon) — called with a wild DinoMon if bite
  // onNoBite — called if nothing bites
  function tryFish(gs, mapData, onEncounter, onNoBite) {
    const rod = getBestRod(gs.player.bag || {});
    if (!rod) {
      DG.DialogueBox.show([
        "You'd need a fishing rod!",
        "Talk to the fisherman near Shellcreek City to get one.",
      ], onNoBite || (() => {}));
      return;
    }
    const rodNames = { OLD_ROD: 'Old Rod', GOOD_ROD: 'Good Rod', SUPER_ROD: 'Super Rod' };
    DG.DialogueBox.show([`Used the ${rodNames[rod]}...`, "...waiting for a bite..."], () => {
      const mon = DG.Encounter.fish(mapData, gs, rod);
      if (mon) {
        const mname = DG.SPECIES[mon.speciesId]?.name || mon.speciesId;
        DG.DialogueBox.show([`Oh! It's biting!`, `A wild ${mname} appeared!`], () => {
          if (typeof onEncounter === 'function') onEncounter(mon);
        });
      } else {
        DG.DialogueBox.show(["...No bite.", "The fish weren't biting today."], onNoBite || (() => {}));
      }
    });
  }

  // ── REPEL ─────────────────────────────────────────────────
  // Called from bag menu; returns true if repel was applied
  function useRepel(gs, itemId) {
    const repelSteps = { REPEL: 100, SUPER_REPEL: 200, MAX_REPEL: 250 };
    const steps = repelSteps[itemId];
    if (!steps) return false;
    if ((gs.player.repelSteps || 0) > 0) {
      DG.DialogueBox.show(["A Repel's effect is still lingering!"], () => {});
      return false;
    }
    gs.player.repelSteps = steps;
    DG.SaveLoad.removeItem(gs, itemId, 1);
    const names = { REPEL: 'Repel', SUPER_REPEL: 'Super Repel', MAX_REPEL: 'Max Repel' };
    DG.DialogueBox.show([`Used the ${names[itemId]}!`, "Wild DinoMons will stay away for a while."], () => {});
    return true;
  }

  // ── ROAMING LEGENDARY ─────────────────────────────────────
  // Call on map load — moves roaming mon to a new route if it's a new day
  function updateRoamingMon(gs) {
    if (!gs || !gs.player || !gs.player.roamingMon) return;
    const rm = gs.player.roamingMon;
    if (rm.caught) return;

    // Day-of-year calculation
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const dayOfYear = Math.floor((now - start) / 86400000);

    if (rm.lastMoveDay !== dayOfYear) {
      rm.lastMoveDay = dayOfYear;
      // Pick a new random route (different from current)
      const choices = ROAMING_ROUTES.filter(r => r !== rm.currentMap);
      rm.currentMap = choices[Math.floor(Math.random() * choices.length)];
    }
  }

  // Check for roaming encounter on current map — returns mon or null
  function checkRoamingEncounter(gs, currentMap) {
    if (!gs || !gs.player || !gs.player.roamingMon) return null;
    const rm = gs.player.roamingMon;
    if (rm.caught) return null;
    if (rm.currentMap !== currentMap) return null;

    // 3% chance per step on the same map
    if (Math.random() > 0.03) return null;

    const mon = DG.SaveLoad.createDinoMon(rm.speciesId, rm.level);
    if (!mon) return null;
    DG.SaveLoad.markSeen(gs, rm.speciesId);

    // After being fought, roaming mon flees to new route
    rm.currentMap = ROAMING_ROUTES[Math.floor(Math.random() * ROAMING_ROUTES.length)];
    return mon;
  }

  // Mark roaming mon as caught
  function markRoamingCaught(gs, speciesId) {
    if (!gs || !gs.player || !gs.player.roamingMon) return;
    if (gs.player.roamingMon.speciesId === speciesId) {
      gs.player.roamingMon.caught = true;
    }
  }

  console.log('[DinoMon] FieldMoves loaded.');

  return {
    partyHasMove,
    getBestRod,
    canSurf,
    canCut,
    canRockSmash,
    canStrength,
    canFlash,
    canFly,
    canDive,
    trySurf,
    tryCut,
    tryRockSmash,
    tryStrength,
    tryWaterfall,
    tryDive,
    tryFish,
    useRepel,
    updateRoamingMon,
    checkRoamingEncounter,
    markRoamingCaught,
  };

})();

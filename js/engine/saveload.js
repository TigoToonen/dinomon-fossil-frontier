// DinoMon: Fossil Frontier — engine/saveload.js
// localStorage save / load system
// v17: player starts directly in front of professor

window.DG = window.DG || {};

DG.SaveLoad = (function () {
  const SAVE_KEY    = 'dinomonFossilFrontier_save'; // legacy single-save key (still used for migration)
  const META_KEY    = 'DG_SAVE_META';
  const SLOT_PREFIX = 'DG_SAVE_SLOT_';
  const NUM_SLOTS   = 3;
  const VERSION     = '1.0.0';

  // ── Slot helpers ──────────────────────────────────────────
  function _slotKey(id) { return SLOT_PREFIX + id; }

  // Returns metadata array for all slots: [{ id, name, date, playtime, empty }]
  function listSlots() {
    const slots = [];
    for (let i = 0; i < NUM_SLOTS; i++) {
      const raw = localStorage.getItem(_slotKey(i));
      if (!raw) {
        slots.push({ id: i, empty: true });
        continue;
      }
      try {
        const data = JSON.parse(raw);
        slots.push({
          id:       i,
          empty:    false,
          name:     (data.player && data.player.name) || 'Trainer',
          playtime: (data.player && data.player.playtime) || 0,
          badges:   (data.player && data.player.badges && data.player.badges.length) || 0,
          date:     data._savedAt || '',
        });
      } catch(e) {
        slots.push({ id: i, empty: true });
      }
    }
    return slots;
  }

  // Last load error — readable by callers for diagnostics
  let _lastLoadError = null;
  function getLastLoadError() { return _lastLoadError; }

  function loadSlot(id) {
    _lastLoadError = null;
    try {
      const raw = localStorage.getItem(_slotKey(id));
      if (!raw) { _lastLoadError = 'No data in localStorage for slot ' + id; return null; }
      const data = JSON.parse(raw);
      sanitizeParty(data);
      _migrateLumBerry(data);
      return data;
    } catch(e) {
      _lastLoadError = (e && e.message) ? e.message : String(e);
      console.error('[SaveLoad] loadSlot failed:', e);
      return null;
    }
  }

  // BATTLE-STRATEGY Fase 1½: Lum Berry → Golden Resin — dezelfde werking,
  // nieuw thema. Migreert de tas én alle gedragen exemplaren (party, box,
  // daycare) zodat niemand zijn item kwijtraakt.
  function _migrateLumBerry(gs) {
    if (!gs || !gs.player) return;
    const bag = gs.player.bag;
    if (bag && bag.LUM_BERRY > 0) {
      bag.GOLDEN_RESIN = (bag.GOLDEN_RESIN || 0) + bag.LUM_BERRY;
      bag.LUM_BERRY = 0;
    }
    const migrate = (mon) => {
      if (mon && mon.heldItem === 'LUM_BERRY') mon.heldItem = 'GOLDEN_RESIN';
    };
    (gs.player.party || []).forEach(migrate);
    (gs.player.box || []).forEach(migrate);
    (gs.player.daycare || []).forEach(migrate);
  }

  function saveToSlot(gameState, id) {
    try {
      gameState._savedAt = new Date().toLocaleDateString();
      const json = JSON.stringify(gameState);
      localStorage.setItem(_slotKey(id), json);
      // Trigger save indicator flash in renderer
      window._SAVE_FLASH = 180; // frames (~3 seconds at 60fps)
      return true;
    } catch(e) {
      console.error('[SaveLoad] saveToSlot failed:', e);
      return false;
    }
  }

  function deleteSlot(id) {
    localStorage.removeItem(_slotKey(id));
  }

  function hasAnySave() {
    for (let i = 0; i < NUM_SLOTS; i++) {
      if (localStorage.getItem(_slotKey(i))) return true;
    }
    // Also check legacy key for migration
    if (localStorage.getItem(SAVE_KEY)) return true;
    return false;
  }

  // Migrate a legacy single-save into slot 0 (run once on first launch with new system)
  function _migrateLegacy() {
    const legacyRaw = localStorage.getItem(SAVE_KEY);
    if (!legacyRaw) return;
    // Only migrate if slot 0 is empty
    if (localStorage.getItem(_slotKey(0))) return;
    try {
      localStorage.setItem(_slotKey(0), legacyRaw);
      console.log('[SaveLoad] Migrated legacy save to slot 0.');
    } catch(e) {}
    // Don't remove legacy key yet in case migration is partial
  }

  // ── Default Game State ────────────────────────────────────
  function createNewGame(playerName, rivalName) {
    return {
      version: VERSION,
      player: {
        name: playerName || 'Trainer',
        rivalName: rivalName || 'Flint',
        money: 1000,
        currentMap: 'AMBERTOWN_LAB',
        x: 9, y: 5,
        facing: 'UP',
        badges: [],
        badgeCount: 0,
        party: [],          // live DinoMon instances (max 6)
        box: [],            // stored DinoMon instances (3 boxes × 30 slots = 90 max)
        boxName: ['Box 1', 'Box 2', 'Box 3'], // user-editable box labels
        bag: {
          POTION: 3,
          DINOBALL: 5,
          SUPERBALL: 0,
          ULTRABALL: 0,
          AMBERBALL: 0,
          MASTERBALL: 0,
          ANTIDOTE: 2,
          BURNHEAL: 0,
          PARALYHEAL: 0,
          AWAKENING: 0,
          FULLHEAL: 0,
          REVIVE: 1,
          MAXREVIVE: 0,
          AMBERF: 0,        // Amber Fragments for crafting
          REPEL: 0,
          SUPER_REPEL: 0,
          MAX_REPEL: 0,
          OLD_ROD: 0,
          GOOD_ROD: 0,
          SUPER_ROD: 0,
          RUNNING_SHOES: 0,
          BIKE: 0,
          // Evolution stones
          FIRE_STONE: 0, WATER_STONE: 0, THUNDER_STONE: 0,
          LEAF_STONE: 0, ICE_STONE: 0,  DAWN_STONE: 0,
          // Held items (player acquires these in-world)
          DEEP_SEA_TOOTH: 0, DEEP_SEA_SCALE: 0, METAL_COAT: 0,
          KINGS_ROCK: 0, LIFE_ORB: 0, LEFTOVERS: 0,
          CHOICE_BAND: 0, CHOICE_SPECS: 0, LUM_BERRY: 0,
          FOCUS_SASH: 0, ROCKY_HELMET: 0, SHELL_BELL: 0,
        },
        flags: {},
        defeatedTrainers: [],
        dex: {},            // { TINDREL: { seen: true, caught: false }, ... }
        seen: [],           // array of seen speciesIds
        caught: [],         // array of caught speciesIds
        playtime: 0,        // seconds
        steps: 0,
        repelSteps: 0,      // remaining repel steps
        bikeMode: false,    // currently on bicycle
        daycare: [],        // up to 2 DinoMon instances deposited at day care
        lastCenter: { map: 'AMBERTOWN_CENTER', x: 7, y: 8 },
        // Roaming Legendary (GLACIODON roams the wild routes)
        roamingMon: {
          speciesId: 'GLACIODON',
          level: 50,
          currentMap: 'ROUTE_5',
          lastMoveDay: -1,  // day-of-year when last moved
          caught: false,
        },
      },
      settings: {
        textSpeed: 'NORMAL', // 'SLOW'|'NORMAL'|'FAST'
        battleAnims: true,
        musicVolume: 0.6,
        sfxVolume: 0.8,
      },
    };
  }

  // ── Live DinoMon Factory ──────────────────────────────────
  function createDinoMon(speciesId, level, nickname, movesOverride) {
    const species = DG.SPECIES[speciesId];
    if (!species) { console.error('Unknown species:', speciesId); return null; }

    // Random IVs 0-31
    const ivs = {
      hp: Math.floor(Math.random() * 32),
      atk: Math.floor(Math.random() * 32),
      def: Math.floor(Math.random() * 32),
      spAtk: Math.floor(Math.random() * 32),
      spDef: Math.floor(Math.random() * 32),
      spd: Math.floor(Math.random() * 32),
    };

    const stats = calcStats(species.baseStats, ivs, {}, level);

    // Pick a random nature and apply it to non-HP stats
    const natureName = (typeof DG.NATURE_NAMES !== 'undefined' && DG.NATURE_NAMES.length)
      ? DG.NATURE_NAMES[Math.floor(Math.random() * DG.NATURE_NAMES.length)]
      : 'HARDY';
    if (typeof DG.NATURES !== 'undefined') {
      const nat = DG.NATURES[natureName];
      if (nat && nat.boosts)  stats[nat.boosts]  = Math.floor(stats[nat.boosts]  * 1.1);
      if (nat && nat.reduces) stats[nat.reduces] = Math.floor(stats[nat.reduces] * 0.9);
    }

    const maxHP = stats.hp;

    // Build moveset. Trainer parties may pass an explicit set (movesOverride); otherwise
    // derive from the learnset (last 4 moves learned at or before this level). Unknown move
    // IDs are skipped and the set is topped up from the learnset, so a mon never ends up with
    // fewer than 4 usable moves when its learnset allows.
    // NB: een learnset-entry kan een ARRAY zijn ("leert één van deze"-pool, bv.
    // [PSYCHIC_MOVE, PSYSHOCK, ...]). De level-up-code kiest er dan één; hier
    // pakken we de eerste geldige pool-move als representant. Zonder dit werd
    // DG.MOVES[array] = undefined en verdwenen de sterke signature-moves, waardoor
    // wild/gegenereerde mons met pool-moves veel te zwak spawnden (bv. TOXICARNO).
    const learnedAll = species.learnset
      .filter(e => e.level <= level)
      .map(e => Array.isArray(e.move) ? e.move.find(id => DG.MOVES[id]) : e.move)
      .filter(id => DG.MOVES[id]);
    let chosen;
    if (Array.isArray(movesOverride) && movesOverride.length) {
      chosen = movesOverride.filter(id => DG.MOVES[id]);
      for (let i = learnedAll.length - 1; i >= 0 && chosen.length < 4; i--) {
        if (chosen.indexOf(learnedAll[i]) < 0) chosen.push(learnedAll[i]);
      }
      if (!chosen.length) chosen = learnedAll.slice(-4);
    } else {
      // Auto-derive from the learnset. Naïef "laatste 4" laat ~de helft van de
      // soorten zonder aanval achter: hun hoogste learnset-moves zijn allemaal
      // setup (Swords Dance, Bulk Up, Work Up...). Zulke mons staan wild eeuwig
      // te buffen en zijn gevangen nutteloos. Daarom: begin met de recentste 4,
      // maar garandeer tot 2 damage-moves door de oudste status-slots te ruilen.
      const isDmg = id => { const m = DG.MOVES[id]; return m && m.category !== 'STATUS' && (m.power || 0) > 0; };
      chosen = learnedAll.slice(-4);
      const dmgAll = learnedAll.filter(isDmg);
      let have = chosen.filter(isDmg).length;
      const target = Math.min(2, dmgAll.length);
      for (let d = dmgAll.length - 1; d >= 0 && have < target; d--) {
        const cand = dmgAll[d];
        if (chosen.indexOf(cand) >= 0) continue;
        const swapIdx = chosen.findIndex(id => !isDmg(id));  // ruil een oudste niet-damage-slot
        if (swapIdx < 0) break;
        chosen[swapIdx] = cand;
        have++;
      }
    }
    const moves = chosen.slice(0, 4).map(moveId => {
      const mv = DG.MOVES[moveId];
      return mv ? { moveId, ppCurrent: mv.pp, ppMax: mv.pp } : null;
    }).filter(Boolean);

    return {
      uid: Date.now().toString(36) + Math.random().toString(36).slice(2),
      speciesId,
      nickname: nickname || null,
      level,
      exp: DG.EXP_CURVE[species.expCurve](level),
      expToNext: DG.EXP_CURVE[species.expCurve](level + 1),
      hp: { current: maxHP, max: maxHP },
      stats,
      ivs,
      evs: { hp:0, atk:0, def:0, spAtk:0, spDef:0, spd:0 },
      moves,
      statusEffect: null,
      statusTurns: 0,
      confusionTurns: 0,
      nature: natureName,
      happiness: 70,
      heldItem: null,
      caughtBall: null,       // set to ballId when caught in battle
      caughtAt: null,
      caughtAtLevel: level,
      isShiny: Math.random() < (1/4096), // 1/4096
    };
  }

  // ── Stat Calculation ──────────────────────────────────────
  function calcStats(base, ivs, evs, level) {
    // Guard: default any missing field to 0 to prevent NaN propagation
    const b_ = k => (base && base[k]) || 0;
    const iv_ = k => (ivs  && ivs[k])  || 0;
    const ev_ = k => (evs  && evs[k])  || 0;
    function statFormula(k) {
      return Math.floor((2*b_(k) + iv_(k) + Math.floor(ev_(k)/4)) * level / 100) + 5;
    }
    function hpFormula() {
      return Math.floor((2*b_('hp') + iv_('hp') + Math.floor(ev_('hp')/4)) * level / 100) + level + 10;
    }
    return {
      hp:    hpFormula(),
      atk:   statFormula('atk'),
      def:   statFormula('def'),
      spAtk: statFormula('spAtk'),
      spDef: statFormula('spDef'),
      spd:   statFormula('spd'),
    };
  }

  // Recalculate and update stats (called on level up / EV change)
  function recalcStats(mon) {
    const species = DG.SPECIES[mon.speciesId];
    if (!species) return;
    const oldMaxHP = mon.hp.max;
    const newStats = calcStats(species.baseStats, mon.ivs, mon.evs, mon.level);
    // Apply nature modifier to non-HP stats
    if (typeof DG.NATURES !== 'undefined' && mon.nature) {
      const nat = DG.NATURES[mon.nature];
      if (nat && nat.boosts)  newStats[nat.boosts]  = Math.floor(newStats[nat.boosts]  * 1.1);
      if (nat && nat.reduces) newStats[nat.reduces] = Math.floor(newStats[nat.reduces] * 0.9);
    }
    const hpDiff = newStats.hp - oldMaxHP;
    mon.stats = newStats;
    mon.hp.max = newStats.hp;
    mon.hp.current = Math.min(mon.hp.current + Math.max(0, hpDiff), newStats.hp);
  }

  // ── Save Sanitizer ────────────────────────────────────────
  // Repairs party DinoMons that have null/undefined HP (from old or broken saves)
  // Repareer een mon die door de oude createDinoMon-moveset-bugs GEEN enkele
  // damage-move heeft (alle slots setup/status). Puur additief: alleen als de
  // learnset er een biedt, vervangen we de laatste slot door de sterkste
  // (STAB-gewogen) damage-move die de mon zou kennen. Laat werkende mons met rust.
  function _repairBrokenMoveset(mon) {
    const species = DG.SPECIES[mon && mon.speciesId];
    if (!species || !Array.isArray(mon.moves) || !mon.moves.length) return false;
    const isDmg = id => { const m = DG.MOVES[id]; return m && m.category !== 'STATUS' && (m.power||0) > 0; };
    if (mon.moves.some(mv => mv && isDmg(mv.moveId))) return false;   // heeft al een aanval
    const types = species.types || [];
    const dmgLearn = (species.learnset || [])
      .filter(e => e.level <= (mon.level || 100))
      .map(e => Array.isArray(e.move) ? e.move.find(id => DG.MOVES[id]) : e.move)
      .filter(isDmg);
    if (!dmgLearn.length) return false;
    dmgLearn.sort((a, b) => {
      const ma = DG.MOVES[a], mb = DG.MOVES[b];
      return (mb.power * (types.includes(mb.type) ? 1.5 : 1)) - (ma.power * (types.includes(ma.type) ? 1.5 : 1));
    });
    const best = dmgLearn[0], md = DG.MOVES[best];
    mon.moves[mon.moves.length - 1] = { moveId: best, ppCurrent: md.pp, ppMax: md.pp };
    return true;
  }

  function sanitizeParty(gameState) {
    if (!gameState || !gameState.player || !gameState.player.party) return;
    // Herstel ook box-mons die niet konden aanvallen (oude moveset-bug).
    if (Array.isArray(gameState.player.box)) {
      for (const bm of gameState.player.box) { if (bm) _repairBrokenMoveset(bm); }
    }
    for (let i = 0; i < gameState.player.party.length; i++) {
      const mon = gameState.player.party[i];
      if (!mon) continue;
      const species = DG.SPECIES[mon.speciesId];
      if (!species) continue;
      // Ensure ivs and evs exist
      if (!mon.ivs) mon.ivs = { hp:0, atk:0, def:0, spAtk:0, spDef:0, spd:0 };
      if (!mon.evs) mon.evs = { hp:0, atk:0, def:0, spAtk:0, spDef:0, spd:0 };
      // Ensure new fields from progression update exist
      if (mon.nature   === undefined) mon.nature   = 'HARDY';
      if (mon.happiness=== undefined) mon.happiness= 70;
      if (mon.heldItem === undefined) mon.heldItem = null;
      if (mon.caughtBall===undefined) mon.caughtBall = null;
      // Recalculate stats if missing or broken
      const stats = calcStats(species.baseStats, mon.ivs, mon.evs, mon.level || 5);
      if (!mon.stats || typeof mon.stats.hp !== 'number') mon.stats = stats;
      // Fix HP if null/undefined/NaN
      if (!mon.hp || typeof mon.hp.max !== 'number' || isNaN(mon.hp.max) || mon.hp.max <= 0) {
        mon.hp = { current: stats.hp, max: stats.hp };
      } else if (typeof mon.hp.current !== 'number' || isNaN(mon.hp.current) || mon.hp.current < 0) {
        mon.hp.current = mon.hp.max;
      }
      // Ensure moves array exists and each move has PP fields (but do NOT reset ppCurrent=0, which is legitimately depleted)
      if (!mon.moves) mon.moves = [];
      for (const mv of mon.moves) {
        if (mv) {
          const moveDef = DG.MOVES[mv.moveId];
          if (moveDef) {
            if (!mv.ppMax) mv.ppMax = moveDef.pp;
            // Only repair ppCurrent if it is truly missing (undefined/null), not if it is 0 (legitimately depleted)
            if (mv.ppCurrent === undefined || mv.ppCurrent === null) {
              mv.ppCurrent = mv.ppMax;
            }
          }
        }
      }
      // Herstel party-mons die door de oude moveset-bug niet konden aanvallen.
      _repairBrokenMoveset(mon);
    }
  }

  // ── Serialization (slot-aware) ────────────────────────────
  // _activeSlot is set by main.js when a slot is chosen.
  // save() / load() / hasSave() still work but now route through the active slot.
  let _activeSlotId = 0;

  function setActiveSlot(id) { _activeSlotId = id; }
  function getActiveSlot()   { return _activeSlotId; }

  function save(gameState) {
    return saveToSlot(gameState, _activeSlotId);
  }

  function load() {
    // Try active slot, then fall back to legacy key
    const fromSlot = loadSlot(_activeSlotId);
    if (fromSlot) return fromSlot;
    // Legacy fallback
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      sanitizeParty(data);
      _migrateLumBerry(data);
      return data;
    } catch(e) { return null; }
  }

  function hasSave() {
    return !!localStorage.getItem(_slotKey(_activeSlotId)) || !!localStorage.getItem(SAVE_KEY);
  }

  function deleteSave() {
    deleteSlot(_activeSlotId);
    localStorage.removeItem(SAVE_KEY);
  }

  // Run migration once at module load
  _migrateLegacy();

  // ── Dex Helpers ───────────────────────────────────────────
  function markSeen(gameState, speciesId) {
    if (!gameState.player.dex[speciesId]) {
      gameState.player.dex[speciesId] = { seen: true, caught: false };
    }
    // Also track in flat arrays (for new save format)
    if (!gameState.player.seen) gameState.player.seen = [];
    if (!gameState.player.seen.includes(speciesId)) {
      gameState.player.seen.push(speciesId);
    }
  }

  function markCaught(gameState, speciesId) {
    gameState.player.dex[speciesId] = { seen: true, caught: true };
    // Also track in flat arrays (for new save format)
    if (!gameState.player.seen) gameState.player.seen = [];
    if (!gameState.player.caught) gameState.player.caught = [];
    if (!gameState.player.seen.includes(speciesId)) {
      gameState.player.seen.push(speciesId);
    }
    if (!gameState.player.caught.includes(speciesId)) {
      gameState.player.caught.push(speciesId);
    }
  }

  // ── Badge Helpers ─────────────────────────────────────────
  function awardBadge(gameState, badgeId) {
    if (!gameState.player.badges.includes(badgeId)) {
      gameState.player.badges.push(badgeId);
      gameState.player.badgeCount = gameState.player.badges.length;
    }
  }

  function hasBadge(gameState, badgeId) {
    return gameState.player.badges.includes(badgeId);
  }

  // ── Flag Helpers ──────────────────────────────────────────
  function setFlag(gameState, flag) {
    gameState.player.flags[flag] = true;
  }

  function getFlag(gameState, flag) {
    return !!gameState.player.flags[flag];
  }

  // ── Bag Helpers ───────────────────────────────────────────
  function addItem(gameState, itemId, qty) {
    qty = qty || 1;
    gameState.player.bag[itemId] = (gameState.player.bag[itemId] || 0) + qty;
  }

  function removeItem(gameState, itemId, qty) {
    qty = qty || 1;
    const cur = gameState.player.bag[itemId] || 0;
    gameState.player.bag[itemId] = Math.max(0, cur - qty);
    return cur >= qty;
  }

  function hasItem(gameState, itemId) {
    return (gameState.player.bag[itemId] || 0) > 0;
  }

  // ── Playtime Tracker ──────────────────────────────────────
  function formatPlaytime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  }

  function recordCenter(gs, mapId, x, y) {
    if (!gs || !gs.player) return;
    gs.player.lastCenter = { map: mapId, x: x, y: y };
  }

  function blackOut(gs) {
    if (!gs || !gs.player) return { map: 'AMBERTOWN', x: 10, y: 12 };
    // Fully heal all party DinoMons and cure status (DinoCenter treatment)
    const party = gs.player.party || [];
    for (const mon of party) {
      if (mon) {
        mon.hp.current = mon.hp.max;
        mon.statusEffect = null;
        mon.statusTurns = 0;
        mon.confusionTurns = 0;
        for (const mv of (mon.moves || [])) {
          if (mv) mv.ppCurrent = mv.ppMax;
        }
      }
    }
    // Return last DinoCenter location (or AMBERTOWN as fallback)
    return gs.player.lastCenter || { map: 'AMBERTOWN', x: 10, y: 12 };
  }

  // ── Box Helpers ───────────────────────────────────────────
  // Add a DinoMon to the box (first empty slot, max 90 total)
  function addToBox(gs, mon) {
    if (!gs.player.box) gs.player.box = [];
    if (gs.player.box.length < 90) {
      gs.player.box.push(mon);
      return true;
    }
    return false; // box full
  }

  // Check if party has space for another DinoMon
  function partyHasSpace(gs) {
    return gs.player.party.filter(m => m != null).length < 6;
  }

  console.log('[DinoMon] SaveLoad v14 initialized.');

  return {
    createNewGame,
    createDinoMon,
    calcStats,
    recalcStats,
    sanitizeParty,
    // Slot system
    listSlots,
    loadSlot,
    getLastLoadError,
    saveToSlot,
    deleteSlot,
    hasAnySave,
    setActiveSlot,
    getActiveSlot,
    // Legacy wrappers (route through active slot)
    save,
    load,
    hasSave,
    deleteSave,
    markSeen,
    markCaught,
    awardBadge,
    hasBadge,
    setFlag,
    getFlag,
    addItem,
    removeItem,
    hasItem,
    formatPlaytime,
    recordCenter,
    blackOut,
    addToBox,
    partyHasSpace,
  };
})();

// DinoMon: Fossil Frontier — world/encounter.js
// Wild encounter rate calculation and table lookup
// v9 — _normalizeTime() maps MORNING→DAY and EVENING→NIGHT for timeCondition filtering

window.DG = window.DG || {};

DG.Encounter = (function () {

  // Steps between encounter checks (rolled each step in tall grass)
  const ENCOUNTER_RATE = 0.10; // 10% per step in tall grass

  // Map tile types that trigger encounters (tile IDs: TALL_GRASS=2, WATER=3, SWAMP/CAVE=8)
  const ENCOUNTER_TILE_IDS = new Set([2, 3, 8]);

  // ── Check if a step triggers an encounter ────────────────
  // Returns DinoMon instance or null
  function check(mapData, tileId, playerLevel, gameState) {
    if (!ENCOUNTER_TILE_IDS.has(tileId)) return null;

    const table = _getTable(mapData, tileId);
    if (!table || table.length === 0) return null;

    // Repel check — skip encounter if lead alive mon level >= wild mon level
    if (gameState && (gameState.player.repelSteps || 0) > 0) {
      // Use first alive (non-egg) mon as repel lead
      const leadMon = gameState.player.party.find(m => m && !m.isEgg && m.hp.current > 0)
                   || gameState.player.party[0];
      const leadLevel = leadMon ? leadMon.level : 1;
      // Pick a tentative entry to check its level
      const testEntry = _pickFromTable(_filterByTime(table));
      if (!testEntry) return null;
      const testLvl = testEntry.levelMin || testEntry.minLv || testEntry.level || 3;
      if (testLvl <= leadLevel) return null;
    }

    if (Math.random() >= ENCOUNTER_RATE) return null;

    // Check for roaming encounter first
    if (gameState && typeof DG.FieldMoves !== 'undefined') {
      const roamer = DG.FieldMoves.checkRoamingEncounter(gameState, gameState.player.currentMap);
      if (roamer) return roamer;
    }

    // Filter table by time of day if entries have timeCondition
    const filteredTable = _filterByTime(table);
    const entry = _pickFromTable(filteredTable);
    if (!entry) return null;

    // Level variation — support both field name conventions (maps.js uses minLv/maxLv)
    const lvlMin = Math.max(2, entry.levelMin || entry.minLv || entry.level || 3);
    const lvlMax = entry.levelMax || entry.maxLv || entry.level || lvlMin;
    const level  = lvlMin + Math.floor(Math.random() * (lvlMax - lvlMin + 1));

    const mon = DG.SaveLoad.createDinoMon(entry.speciesId, level);
    if (!mon) return null;

    DG.SaveLoad.markSeen(gameState, entry.speciesId);
    return mon;
  }

  // ── Normalize time-of-day for encounter table matching ───
  // constants.js uses MORNING/DAY/EVENING/NIGHT. Encounter tables may use
  // only the coarser 'DAY'/'NIGHT' split. This normalizer maps both:
  //   MORNING → 'DAY',  DAY → 'DAY'
  //   EVENING → 'NIGHT', NIGHT → 'NIGHT'
  // Entries with a 2-way timeCondition ('DAY'/'NIGHT') therefore correctly
  // match the 4-way time values from getTimeOfDay().
  function _normalizeTime(tod) {
    if (tod === 'MORNING' || tod === 'DAY')     return 'DAY';
    if (tod === 'EVENING' || tod === 'NIGHT')   return 'NIGHT';
    return tod;
  }

  // ── Filter table by current time of day ──────────────────
  // Entries without timeCondition always appear; entries with it only appear at that time.
  // A timeCondition of 'DAY' matches both MORNING and DAY; 'NIGHT' matches EVENING and NIGHT.
  // If the filtered result is empty (e.g. time-specific mon not available), fall back to full table.
  function _filterByTime(table) {
    if (!table || !table.length) return table;
    const tod = DG.getTimeOfDay ? DG.getTimeOfDay() : null;
    const normalizedTod = tod ? _normalizeTime(tod) : null;
    const filtered = table.filter(e => {
      if (!e.timeCondition) return true;          // no restriction — always included
      if (!normalizedTod)   return true;          // no clock — include all
      // Match against both the raw tod and the normalized (2-way) tod
      return e.timeCondition === tod || e.timeCondition === normalizedTod;
    });
    return filtered.length > 0 ? filtered : table; // fall back to full table if no match
  }

  // ── Get encounter table for tile type ────────────────────
  function _getTable(mapData, tileId) {
    if (!mapData || !mapData.encounterTable) return null;
    if (tileId === 2) return mapData.encounterTable.grass || [];           // TALL_GRASS
    if (tileId === 3) return mapData.encounterTable.water || [];           // WATER
    if (tileId === 8) return mapData.encounterTable.cave  || mapData.encounterTable.grass || []; // SWAMP/CAVE
    return [];
  }

  // ── Weighted random pick from encounter table ─────────────
  // Each entry: { speciesId, level/levelMin/levelMax, weight }
  function _pickFromTable(table) {
    if (!table || !table.length) return null;
    const total = table.reduce((s, e) => s + (e.weight || e.rate || 10), 0);
    let roll = Math.random() * total;
    for (const entry of table) {
      roll -= (entry.weight || entry.rate || 10);
      if (roll <= 0) return entry;
    }
    return table[table.length - 1];
  }

  // ── Fishing encounters ────────────────────────────────────
  // rod: 'OLD_ROD' | 'GOOD_ROD' | 'SUPER_ROD'
  function fish(mapData, gameState, rod) {
    const table = mapData && mapData.encounterTable ? (mapData.encounterTable.fish || []) : [];
    if (!table.length) return null;

    // Bite rates differ by rod tier
    const biteRates = { OLD_ROD: 0.4, GOOD_ROD: 0.65, SUPER_ROD: 0.85 };
    const biteRate  = biteRates[rod] || 0.5;
    if (Math.random() > biteRate) return null;

    // Filter by rod tier if entries specify one
    const rodTiers = { OLD_ROD: 1, GOOD_ROD: 2, SUPER_ROD: 3 };
    const tier = rodTiers[rod] || 1;
    const filtered = table.filter(e => !e.rodTier || e.rodTier <= tier);
    if (!filtered.length) return null;

    const entry = _pickFromTable(filtered);
    if (!entry) return null;
    const level = (entry.levelMin || entry.minLv || entry.level || 5)
                + Math.floor(Math.random() * ((entry.levelMax || entry.maxLv || entry.level || 5)
                                              - (entry.levelMin || entry.minLv || entry.level || 5) + 1));
    const mon = DG.SaveLoad.createDinoMon(entry.speciesId, level);
    if (mon) DG.SaveLoad.markSeen(gameState, entry.speciesId);
    return mon;
  }

  // ── Repel check (used externally if needed) ───────────────
  function isRepelled(gameState, monLevel) {
    if (!gameState || !(gameState.player.repelSteps > 0)) return false;
    const leadLevel = gameState.player.party[0]
      ? gameState.player.party[0].level : 1;
    return monLevel <= leadLevel;
  }

  console.log('[DinoMon] Encounter loaded.');

  return { check, fish, isRepelled };
})();

// DinoMon: Fossil Frontier — ui/bagMenu.js
// Bag / items screen  (v12 — category tabs: Heal / Battle / Balls / Key)

window.DG = window.DG || {};

DG.BagMenu = (function () {

  let _gs           = null;
  let _onClose      = null;
  let _cursor       = 0;
  let _scroll       = 0;
  let _battleOnUsed = null; // set when opened from battle

  // Sub-modes for item use
  let _mode         = 'ITEMS';     // 'ITEMS' | 'SELECT_MON' | 'SELECT_REPLACE'
  let _pendingItem  = null;        // itemId being used
  let _monCursor    = 0;           // party cursor in SELECT_MON
  let _movCursor    = 0;           // move cursor in SELECT_REPLACE
  let _pendingMon   = null;        // party mon reference for move replace
  let _pendingMove  = null;        // new moveId to learn

  // ── Category tab state ───────────────────────────────────────
  // 'ALL' | 'HEAL' | 'BATTLE' | 'BALLS' | 'KEY'
  const BAG_TABS   = ['ALL', 'HEAL', 'BATTLE', 'BALLS', 'KEY'];
  const TAB_LABELS = { ALL:'All', HEAL:'⚕ Heal', BATTLE:'⚔ Battle', BALLS:'● Balls', KEY:'🔑 Key' };
  let _bagTab = 'ALL';

  function _getItemCategory(itemId) {
    const id = itemId.toUpperCase();
    if (id.includes('BALL')) return 'BALLS';
    if (id.includes('POTION') || id.includes('REVIVE') || id.includes('ANTIDOTE') ||
        id.includes('HEAL') || id.includes('ELIXIR') || id.includes('ETHER') ||
        id.includes('BURNHEAL') || id.includes('PARALYHEAL') || id.includes('AWAKENING') ||
        id.includes('FULLRESTORE') || id.includes('FULLHEAL')) return 'HEAL';
    if (id.includes('TM') || id.includes('HM') || id.includes('BERRY') ||
        id.includes('X_ATK') || id.includes('X_DEF') || id.includes('REPEL') ||
        id.startsWith('FIRE_STONE') || id.startsWith('WATER_STONE') ||
        id.startsWith('THUNDER_STONE') || id.startsWith('LEAF_STONE') ||
        id.startsWith('ICE_STONE') || id.startsWith('DAWN_STONE')) return 'BATTLE';
    return 'KEY'; // fossils, badges, key items, held items
  }

  function _roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  const VISIBLE = 7; // reduced by 1 for tab bar
  const BALLS   = ['DINOBALL','SUPERBALL','ULTRABALL','AMBERBALL','MASTERBALL','DINOMASTERBALL'];
  const STONES  = ['FIRE_STONE','WATER_STONE','THUNDER_STONE','LEAF_STONE','ICE_STONE','DAWN_STONE'];
  const HELD_ITEMS = [
    'DEEP_SEA_TOOTH','DEEP_SEA_SCALE','METAL_COAT','KINGS_ROCK',
    'LIFE_ORB','LEFTOVERS','CHOICE_BAND','CHOICE_SPECS',
    'LUM_BERRY','FOCUS_SASH','ROCKY_HELMET','SHELL_BELL',
  ];
  const REPELS    = ['REPEL','SUPER_REPEL','MAX_REPEL'];
  const KEY_ITEMS = ['OLD_ROD','GOOD_ROD','SUPER_ROD','RUNNING_SHOES','BIKE',
    'AMBER_FOSSIL','TAR_FOSSIL','ICE_FOSSIL','SEA_FOSSIL','SKY_FOSSIL','GOLD_TEETH','COMPOUND_CARD'];

  // ── Item display metadata ────────────────────────────────────
  const ITEM_DEFS = {
    POTION:      { name:'Potion',       desc:'Restores 20 HP.' },
    SUPERPOTION: { name:'Super Potion', desc:'Restores 50 HP.' },
    HYPERPOTION: { name:'Hyper Potion', desc:'Restores 120 HP.' },
    MAXPOTION:   { name:'Max Potion',   desc:'Fully restores HP.' },
    FULLRESTORE: { name:'Full Restore', desc:'Restores HP & cures status.' },
    REVIVE:      { name:'Revive',       desc:'Revives with half HP.' },
    MAXREVIVE:   { name:'Max Revive',   desc:'Revives with full HP.' },
    ANTIDOTE:    { name:'Antidote',     desc:'Cures poison.' },
    BURNHEAL:    { name:'Burn Heal',    desc:'Cures burn.' },
    PARALYHEAL:  { name:'Parlyz Heal',  desc:'Cures paralysis.' },
    AWAKENING:   { name:'Awakening',    desc:'Wakes sleeping DinoMon.' },
    FULLHEAL:    { name:'Full Heal',    desc:'Cures all conditions.' },
    DINOBALL:    { name:'DinoBall',     desc:'Catches wild DinoMons.' },
    SUPERBALL:   { name:'SuperBall',    desc:'Higher catch rate.' },
    ULTRABALL:   { name:'UltraBall',    desc:'Even higher catch rate.' },
    AMBERBALL:   { name:'AmberBall',    desc:'Powerful ancient ball.' },
    MASTERBALL:       { name:'MasterBall',      desc:'Always catches.' },
    DINOMASTERBALL:   { name:'DinoMasterBall',  desc:'Never fails — catches any DinoMon!' },
    AMBERF:           { name:'Amber Frag.',     desc:'Rare crafting material.' },
    RARE_CANDY:       { name:'Rare Candy',      desc:'Raises a DinoMon’s level by 1.' },
    AMBER_FOSSIL:     { name:'Amber Fossil',    desc:'A Bug/Rock fossil. Carry it, then revive it at a Fossil Lab.' },
    TAR_FOSSIL:       { name:'Tar Fossil',      desc:'A Dark/Rock fossil. Carry it, then revive it at a Fossil Lab.' },
    ICE_FOSSIL:       { name:'Ice Fossil',      desc:'An Ice/Rock fossil. Carry it, then revive it at a Fossil Lab.' },
    SEA_FOSSIL:       { name:'Sea Fossil',      desc:'A Water/Rock fossil. Carry it, then revive it at a Fossil Lab.' },
    SKY_FOSSIL:       { name:'Sky Fossil',      desc:'A Flying/Rock fossil. Carry it, then revive it at a Fossil Lab.' },
    GOLD_TEETH:       { name:'Gold Teeth',      desc:"The Safari Warden's lost dentures. Return them to him at the Safari Gate." },
    COMPOUND_CARD:    { name:'Compound Card',   desc:"Daytrader Niels' platinum card. Battle prize money is boosted by 50%." },
    // Repels
    REPEL:       { name:'Repel',        desc:'Repels weak wild DinoMons for 100 steps.' },
    SUPER_REPEL: { name:'Super Repel',  desc:'Repels weak wild DinoMons for 200 steps.' },
    MAX_REPEL:   { name:'Max Repel',    desc:'Repels weak wild DinoMons for 250 steps.' },
    // Key items
    OLD_ROD:       { name:'Old Rod',      desc:'A basic fishing rod. Catches common water DinoMons.' },
    GOOD_ROD:      { name:'Good Rod',     desc:'A better rod. Catches stronger water DinoMons.' },
    SUPER_ROD:     { name:'Super Rod',    desc:'The best rod. Catches rare water DinoMons.' },
    RUNNING_SHOES: { name:'Running Shoes',desc:'Hold B to run faster through the routes.' },
    BIKE:          { name:'Bicycle',      desc:'Press B to ride — the fastest overworld travel!' },
    // Evolution stones
    FIRE_STONE:    { name:'Fire Stone',    desc:'Triggers Fire-type evolutions.' },
    WATER_STONE:   { name:'Water Stone',   desc:'Triggers Water-type evolutions.' },
    THUNDER_STONE: { name:'Thunder Stone', desc:'Triggers Electric-type evolutions.' },
    LEAF_STONE:    { name:'Leaf Stone',    desc:'Triggers Grass-type evolutions.' },
    ICE_STONE:     { name:'Ice Stone',     desc:'Triggers Ice-type evolutions.' },
    DAWN_STONE:    { name:'Dawn Stone',    desc:'Triggers Ghost/Fairy evolutions.' },
    // Held items
    DEEP_SEA_TOOTH: { name:'DeepSea Tooth', desc:'Hold item — some DinoMons evolve while holding this.' },
    DEEP_SEA_SCALE: { name:'DeepSea Scale', desc:'Hold item — some DinoMons evolve while holding this.' },
    METAL_COAT:     { name:'Metal Coat',    desc:'Hold item — some DinoMons evolve while holding this.' },
    KINGS_ROCK:     { name:'King\'s Rock',  desc:'Hold item — may cause flinching when held.' },
    LIFE_ORB:       { name:'Life Orb',      desc:'Hold item — boosts moves but costs HP.' },
    LEFTOVERS:      { name:'Leftovers',     desc:'Hold item — restores a little HP each turn.' },
    CHOICE_BAND:    { name:'Choice Band',   desc:'Hold item — boosts Attack but locks to one move.' },
    CHOICE_SPECS:   { name:'Choice Specs',  desc:'Hold item — boosts Sp.Atk but locks to one move.' },
    LUM_BERRY:      { name:'Lum Berry',     desc:'Hold item — cures any status effect once.' },
    FOCUS_SASH:     { name:'Focus Sash',    desc:'Hold item — survives one hit from full HP.' },
    ROCKY_HELMET:   { name:'Rocky Helmet',  desc:'Hold item — damages attacker on contact.' },
    SHELL_BELL:     { name:'Shell Bell',    desc:'Hold item — restores HP when dealing damage.' },
  };

  // ── Heal item logic ──────────────────────────────────────────
  function _applyHealItem(mon, itemId) {
    if (mon.hp.current <= 0 && itemId !== 'REVIVE' && itemId !== 'MAXREVIVE') return false;
    switch (itemId) {
      case 'POTION':     if (mon.hp.current < mon.hp.max) { mon.hp.current = Math.min(mon.hp.max, mon.hp.current + 20); return true; } return false;
      case 'SUPERPOTION':if (mon.hp.current < mon.hp.max) { mon.hp.current = Math.min(mon.hp.max, mon.hp.current + 50); return true; } return false;
      case 'HYPERPOTION':if (mon.hp.current < mon.hp.max) { mon.hp.current = Math.min(mon.hp.max, mon.hp.current + 120); return true; } return false;
      case 'MAXPOTION':  if (mon.hp.current < mon.hp.max) { mon.hp.current = mon.hp.max; return true; } return false;
      case 'FULLRESTORE':mon.hp.current = mon.hp.max; DG.StatusEffects.cure(mon, 'ALL'); return true;
      case 'REVIVE':     if (mon.hp.current <= 0) { mon.hp.current = Math.floor(mon.hp.max/2); return true; } return false;
      case 'MAXREVIVE':  if (mon.hp.current <= 0) { mon.hp.current = mon.hp.max; return true; } return false;
      case 'ANTIDOTE':   return !!(mon.statusEffect === 'POISON' || mon.statusEffect === 'BADPOISON') && (DG.StatusEffects.cure(mon, [DG.STATUS.POISON, DG.STATUS.BADPOISON]), true);
      case 'BURNHEAL':   return !!(mon.statusEffect === 'BURN') && (DG.StatusEffects.cure(mon, [DG.STATUS.BURN]), true);
      case 'PARALYHEAL': return !!(mon.statusEffect === 'PARALYSIS') && (DG.StatusEffects.cure(mon, [DG.STATUS.PARALYSIS]), true);
      case 'AWAKENING':  return !!(mon.statusEffect === 'SLEEP') && (DG.StatusEffects.cure(mon, [DG.STATUS.SLEEP]), true);
      case 'FULLHEAL':   if (mon.statusEffect) { DG.StatusEffects.cure(mon, 'ALL'); return true; } return false;
      default: return false;
    }
  }

  // ── Open ─────────────────────────────────────────────────────
  function open(gameState, onClose) {
    _gs           = gameState;
    _onClose      = onClose;
    _battleOnUsed = null;
    _cursor       = 0;
    _scroll       = 0;
    _mode         = 'ITEMS';
    _pendingItem  = null;
    _bagTab       = 'ALL';
  }

  function openBattle(gameState, onUsed, onClose) {
    _gs           = gameState;
    _onClose      = onClose;
    _battleOnUsed = onUsed;
    _cursor       = 0;
    _scroll       = 0;
    _mode         = 'ITEMS';
    _pendingItem  = null;
    _bagTab       = 'ALL';
  }

  function _getAllItems() {
    const bag = _gs.player.bag;
    return Object.entries(bag).filter(([, qty]) => qty > 0);
  }

  function _getItems() {
    const all = _getAllItems();
    if (_bagTab === 'ALL') return all;
    return all.filter(([id]) => _getItemCategory(id) === _bagTab);
  }

  // ── Update ───────────────────────────────────────────────────
  function update(dt) {
    if (!_gs) return;

    if (_mode === 'SELECT_MON') { _updateSelectMon(); return; }
    if (_mode === 'SELECT_REPLACE') { _updateSelectReplace(); return; }

    const items = _getItems();

    // LEFT/RIGHT: cycle category tabs (always available in ITEMS mode)
    if (DG.Input.isPressed('LEFT')) {
      const idx = BAG_TABS.indexOf(_bagTab);
      _bagTab = BAG_TABS[(idx + BAG_TABS.length - 1) % BAG_TABS.length];
      _cursor = 0; _scroll = 0;
    }
    if (DG.Input.isPressed('RIGHT')) {
      const idx = BAG_TABS.indexOf(_bagTab);
      _bagTab = BAG_TABS[(idx + 1) % BAG_TABS.length];
      _cursor = 0; _scroll = 0;
    }

    if (DG.Input.isPressed('UP')) {
      _cursor = Math.max(0, _cursor - 1);
      if (_cursor < _scroll) _scroll = _cursor;
    }
    if (DG.Input.isPressed('DOWN')) {
      _cursor = Math.min(Math.max(0, items.length - 1), _cursor + 1);
      if (_cursor >= _scroll + VISIBLE) _scroll = _cursor - VISIBLE + 1;
    }
    if (DG.Input.isPressed('A') && items[_cursor]) {
      const itemId = items[_cursor][0];
      if (_battleOnUsed) {
        if (BALLS.includes(itemId)) {
          const cb = _battleOnUsed; _battleOnUsed = null;
          const closeCb = _onClose; _onClose = null;
          if (typeof closeCb === 'function') closeCb();
          cb(itemId);
        } else if (_isBattleUsable(itemId)) {
          // Heal/revive in battle: pick WHICH party mon to use it on first.
          _pendingItem = itemId;
          _monCursor   = 0;
          _mode        = 'SELECT_MON';
        } else {
          DG.DialogueBox.show(["Can't use that here!"], () => {});
        }
      } else {
        _useItemMenu(itemId);
      }
    }
    if (DG.Input.isPressed('B') || DG.Input.isPressed('START')) {
      _battleOnUsed = null;
      const cb = _onClose; _onClose = null;
      if (typeof cb === 'function') cb();
    }
  }

  function _isBattleUsable(itemId) {
    const HEAL = ['POTION','SUPERPOTION','HYPERPOTION','MAXPOTION','FULLRESTORE',
                  'REVIVE','MAXREVIVE','ANTIDOTE','BURNHEAL','PARALYHEAL','AWAKENING','FULLHEAL'];
    return HEAL.includes(itemId);
  }

  // ── SELECT_MON sub-mode ──────────────────────────────────────
  function _updateSelectMon() {
    const party = _gs.player.party;
    if (DG.Input.isPressed('UP'))   _monCursor = Math.max(0, _monCursor - 1);
    if (DG.Input.isPressed('DOWN')) _monCursor = Math.min(party.length - 1, _monCursor + 1);
    if (DG.Input.isPressed('A')) {
      const mon = party[_monCursor];
      if (!mon || mon.isEgg) {
        DG.DialogueBox.show(["Choose a DinoMon!"], () => {});
        return;
      }
      _confirmItemOnMon(_pendingItem, mon);
    }
    if (DG.Input.isPressed('B')) {
      _mode = 'ITEMS';
      _pendingItem = null;
    }
  }

  // ── SELECT_REPLACE sub-mode (move replacement) ──────────────
  function _updateSelectReplace() {
    const moves = _pendingMon ? _pendingMon.moves : [];
    if (DG.Input.isPressed('UP'))   _movCursor = Math.max(0, _movCursor - 1);
    if (DG.Input.isPressed('DOWN')) _movCursor = Math.min(moves.length, _movCursor + 1); // +1 for Cancel
    if (DG.Input.isPressed('A')) {
      if (_movCursor >= moves.length) {
        // Cancel
        _mode = 'ITEMS';
        _pendingItem = null;
        _pendingMon  = null;
        _pendingMove = null;
        return;
      }
      // Replace move at _movCursor
      const moveDef = DG.MOVES[_pendingMove];
      _pendingMon.moves[_movCursor] = {
        moveId: _pendingMove,
        ppCurrent: moveDef ? moveDef.pp : 10,
        ppMax: moveDef ? moveDef.pp : 10,
      };
      const monName  = _pendingMon.nickname || DG.SPECIES[_pendingMon.speciesId]?.name || _pendingMon.speciesId;
      const moveName = moveDef ? moveDef.name : _pendingMove;
      // Consume TM (single-use) — HMs are not consumed
      const tmDef = DG.TM_DATA && DG.TM_DATA[_pendingItem];
      if (!tmDef || tmDef.singleUse !== false) {
        DG.SaveLoad.removeItem(_gs, _pendingItem, 1);
      }
      DG.SaveLoad.save(_gs);
      _mode = 'ITEMS';
      _pendingItem = null;
      _pendingMon  = null;
      _pendingMove = null;
      DG.DialogueBox.show([`${monName} learned ${moveName}!`], () => {});
    }
    if (DG.Input.isPressed('B')) {
      _mode = 'ITEMS';
      _pendingItem = null;
      _pendingMon  = null;
      _pendingMove = null;
    }
  }

  // ── Item use dispatcher ──────────────────────────────────────
  function _useItemMenu(itemId) {
    // Balls — only in battle
    if (BALLS.includes(itemId)) {
      DG.DialogueBox.show(['Use balls in battle!'], () => {});
      return;
    }
    // Amber fragments
    if (itemId === 'AMBERF') {
      DG.DialogueBox.show(['Amber Fragments are used for crafting!'], () => {});
      return;
    }
    // Repels
    if (REPELS.includes(itemId)) {
      if (typeof DG.FieldMoves !== 'undefined') {
        DG.FieldMoves.useRepel(_gs, itemId);
      } else {
        DG.DialogueBox.show(['Used the Repel!'], () => {});
      }
      return;
    }
    // Key items — informational
    if (KEY_ITEMS.includes(itemId)) {
      const def = ITEM_DEFS[itemId];
      DG.DialogueBox.show([def ? def.desc : `${itemId} is a key item.`], () => {});
      return;
    }
    // TMs / HMs — require party mon selection
    if (_isTM(itemId)) {
      _pendingItem = itemId;
      _monCursor   = 0;
      _mode        = 'SELECT_MON';
      return;
    }
    // Rare Candy — pick a DinoMon to level up
    if (itemId === 'RARE_CANDY') {
      _pendingItem = itemId;
      _monCursor   = 0;
      _mode        = 'SELECT_MON';
      return;
    }
    // Evolution stones
    if (STONES.includes(itemId)) {
      _pendingItem = itemId;
      _monCursor   = 0;
      _mode        = 'SELECT_MON';
      return;
    }
    // Held items — equip to a party mon
    if (HELD_ITEMS.includes(itemId)) {
      _pendingItem = itemId;
      _monCursor   = 0;
      _mode        = 'SELECT_MON';
      return;
    }
    // Healing items — apply to first party member that needs it
    const party = _gs.player.party;
    let used = false;
    for (const mon of party) {
      if (_applyHealItem(mon, itemId)) {
        DG.SaveLoad.removeItem(_gs, itemId, 1);
        DG.DialogueBox.show([`Used ${ITEM_DEFS[itemId]?.name || itemId} on ${mon.nickname || DG.SPECIES[mon.speciesId]?.name}!`], () => {});
        used = true;
        break;
      }
    }
    if (!used) DG.DialogueBox.show(['It had no effect!'], () => {});
  }

  function _isTM(itemId) {
    return !!(DG.TM_DATA && DG.TM_DATA[itemId]);
  }

  // ── Confirm use of pending item on a party mon ───────────────
  function _confirmItemOnMon(itemId, mon) {
    const monName = mon.nickname || DG.SPECIES[mon.speciesId]?.name || mon.speciesId;

    // Battle context: don't apply/consume here — hand the chosen target back to
    // the battle engine, which applies the heal and removes the item exactly once.
    if (_battleOnUsed) {
      const idx     = _gs.player.party.indexOf(mon);
      const cb      = _battleOnUsed; _battleOnUsed = null;
      const closeCb = _onClose;      _onClose      = null;
      _mode = 'ITEMS'; _pendingItem = null;
      if (typeof closeCb === 'function') closeCb();
      cb(itemId, idx);
      return;
    }

    // ── Rare Candy: raise level by 1 ──
    if (itemId === 'RARE_CANDY') {
      if (mon.isEgg) { DG.DialogueBox.show(["An egg can't use that!"], () => {}); return; }
      if ((mon.level || 1) >= 100) {
        DG.DialogueBox.show([`${monName} is already at Lv.100!`], () => {});
        return;
      }
      mon.level = (mon.level || 1) + 1;
      DG.SaveLoad.recalcStats(mon);
      DG.SaveLoad.removeItem(_gs, itemId, 1);
      DG.SaveLoad.save(_gs);
      _mode = 'ITEMS'; _pendingItem = null;
      DG.DialogueBox.show([`${monName} grew to Lv.${mon.level}!`], () => {});
      return;
    }

    // ── TM / HM ──
    if (_isTM(itemId)) {
      const tmDef  = DG.TM_DATA[itemId];
      const moveId = tmDef.moveId;
      const moveDef = DG.MOVES[moveId];
      const moveName = moveDef ? moveDef.name : moveId;

      // Already knows this move?
      if (mon.moves.some(m => m.moveId === moveId)) {
        DG.DialogueBox.show([`${monName} already knows ${moveName}!`], () => {});
        return;
      }

      // ── HM type compatibility check ──────────────────────────
      // HMs (singleUse === false) with a canLearnTypes list may only be taught
      // to DinoMons that share at least one of the listed types.
      if (tmDef.singleUse === false && Array.isArray(tmDef.canLearnTypes)) {
        const sp      = DG.SPECIES && DG.SPECIES[mon.speciesId];
        const monTypes = sp ? (sp.types || []) : [];
        const canLearn = monTypes.some(t => tmDef.canLearnTypes.includes(t));
        if (!canLearn) {
          const allowed = tmDef.canLearnTypes.join(', ');
          DG.DialogueBox.show([
            `${monName} can't learn ${moveName}!`,
            `Only ${allowed}-type DinoMons can use this HM.`,
          ], () => {});
          return;
        }
      }
      // Room for another move?
      if (mon.moves.length < 4) {
        mon.moves.push({ moveId, ppCurrent: moveDef ? moveDef.pp : 10, ppMax: moveDef ? moveDef.pp : 10 });
        const isHM = tmDef.singleUse === false;
        if (!isHM) DG.SaveLoad.removeItem(_gs, itemId, 1);
        DG.SaveLoad.save(_gs);
        _mode = 'ITEMS'; _pendingItem = null;
        DG.DialogueBox.show([`${monName} learned ${moveName}!`], () => {});
        return;
      }
      // Must replace a move
      _pendingMon  = mon;
      _pendingMove = moveId;
      _movCursor   = 0;
      _mode        = 'SELECT_REPLACE';
      return;
    }

    // ── Evolution Stone ──
    if (STONES.includes(itemId)) {
      const table = DG.STONE_EVOLUTIONS && DG.STONE_EVOLUTIONS[itemId];
      const targetSpecies = table && table[mon.speciesId];
      if (!targetSpecies) {
        DG.DialogueBox.show([`It had no effect on ${monName}!`], () => {});
        return;
      }
      const targetName = DG.SPECIES[targetSpecies]?.name || targetSpecies;
      DG.SaveLoad.removeItem(_gs, itemId, 1);
      _mode = 'ITEMS'; _pendingItem = null;
      // Perform evolution
      mon.speciesId = targetSpecies;
      mon.nickname  = mon.nickname; // keep nickname
      DG.SaveLoad.recalcStats(mon);
      DG.SaveLoad.markCaught(_gs, targetSpecies);
      DG.SaveLoad.save(_gs);
      DG.DialogueBox.show([
        `${monName} is evolving!`,
        `${monName} evolved into ${targetName}!`,
      ], () => {
        if (typeof DG.BattleUI !== 'undefined') DG.BattleUI.notify({ event: 'EVOLUTION' });
      });
      return;
    }

    // ── Held item equip ──
    if (HELD_ITEMS.includes(itemId)) {
      const def      = ITEM_DEFS[itemId];
      const itemName = def ? def.name : itemId;
      const old      = mon.heldItem;
      if (old === itemId) {
        // Already holding this — take it back
        mon.heldItem = null;
        DG.SaveLoad.addItem(_gs, itemId, 1);
        DG.SaveLoad.save(_gs);
        _mode = 'ITEMS'; _pendingItem = null;
        DG.DialogueBox.show([`Took back ${itemName} from ${monName}.`], () => {});
        return;
      }
      if (old) {
        // Swap: return old item to bag
        DG.SaveLoad.addItem(_gs, old, 1);
      }
      DG.SaveLoad.removeItem(_gs, itemId, 1);
      mon.heldItem = itemId;
      DG.SaveLoad.save(_gs);
      _mode = 'ITEMS'; _pendingItem = null;
      const oldName = old ? (ITEM_DEFS[old]?.name || old) : null;
      const msg = old
        ? `Took ${oldName} and gave ${itemName} to ${monName}.`
        : `Gave ${itemName} to ${monName} to hold.`;
      DG.DialogueBox.show([msg], () => {});
      return;
    }

    // Fallback healing
    if (_applyHealItem(mon, itemId)) {
      DG.SaveLoad.removeItem(_gs, itemId, 1);
      DG.DialogueBox.show([`Used ${ITEM_DEFS[itemId]?.name || itemId} on ${monName}!`], () => {});
    } else {
      DG.DialogueBox.show(['It had no effect!'], () => {});
    }
    _mode = 'ITEMS'; _pendingItem = null;
  }

  // ── Draw helpers ─────────────────────────────────────────────
  function _drawTabs(ctx, W) {
    const tabCount = BAG_TABS.length;
    const totalW   = W - 16;
    const tabW     = Math.floor(totalW / tabCount);
    const tabY     = 4;
    const tabH     = 16;

    BAG_TABS.forEach((tab, idx) => {
      const tx     = 8 + idx * tabW;
      const active = tab === _bagTab;

      // Background
      ctx.fillStyle = active ? '#1e3a5a' : '#111122';
      _roundRect(ctx, tx, tabY, tabW - 2, tabH, 3);
      ctx.fill();

      // Border
      ctx.strokeStyle = active ? '#ffffff' : '#2a3a5a';
      ctx.lineWidth = active ? 1.5 : 1;
      _roundRect(ctx, tx, tabY, tabW - 2, tabH, 3);
      ctx.stroke();

      // Label
      ctx.fillStyle = active ? '#ffffff' : '#556688';
      ctx.font = (active ? 'bold ' : '') + '8px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(TAB_LABELS[tab], tx + (tabW - 2) / 2, tabY + tabH / 2);
    });

    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
  }

  // ── Draw ─────────────────────────────────────────────────────
  function draw(ctx) {
    const W = DG.CANVAS.W, H = DG.CANVAS.H;

    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = '#8ed8f8';
    ctx.lineWidth = 2;
    ctx.strokeRect(2, 2, W - 4, H - 4);
    ctx.fillStyle = '#8ed8f8';
    ctx.font = 'bold 14px monospace';
    ctx.textBaseline = 'top';

    if (_mode === 'SELECT_MON') {
      _drawSelectMon(ctx, W, H);
      return;
    }
    if (_mode === 'SELECT_REPLACE') {
      _drawSelectReplace(ctx, W, H);
      return;
    }

    // ── Normal bag view ──
    // Category tabs
    _drawTabs(ctx, W);

    // BAG header (right side of tab row area)
    ctx.fillStyle = '#8ed8f8';
    ctx.font = 'bold 10px monospace';
    ctx.fillText('BAG', W - 34, 7);

    const LIST_TOP = 24; // below tabs
    const items = _gs ? _getItems() : [];

    if (items.length === 0) {
      ctx.fillStyle = '#888';
      ctx.font = '13px monospace';
      ctx.fillText('No items here.', 20, LIST_TOP + 20);
    } else {
      const slice = items.slice(_scroll, _scroll + VISIBLE);
      slice.forEach(([id, qty], i) => {
        const realIdx = i + _scroll;
        const y = LIST_TOP + i * 26;
        ctx.fillStyle = realIdx === _cursor ? '#2a2a50' : '#16213e';
        ctx.fillRect(6, y, W - 12, 24);
        ctx.strokeStyle = realIdx === _cursor ? '#FFE050' : '#4a6fa5';
        ctx.lineWidth = 1;
        ctx.strokeRect(6, y, W - 12, 24);
        ctx.fillStyle = realIdx === _cursor ? '#FFE050' : '#ffffff';
        ctx.font = '12px monospace';
        // Pull name from ITEM_DEFS, then DG.ITEMS (for TMs/HMs), then raw id
        const tmDef  = DG.TM_DATA && DG.TM_DATA[id];
        const dgItem = DG.ITEMS && DG.ITEMS[id];
        const def    = ITEM_DEFS[id];
        const name   = def?.name || dgItem?.name || (tmDef ? `${id.replace('_',' ')} ${DG.MOVES[tmDef.moveId]?.name || ''}` : id);

        // Mini ball icon for BALL items
        const BALL_PAL = {
          DINOBALL:      { top:'#dd2222', bot:'#ffffff', band:'#222222', btn:'#ffffff' },
          SUPERBALL:     { top:'#1155dd', bot:'#ccddff', band:'#001133', btn:'#aaccff' },
          ULTRABALL:     { top:'#ddaa00', bot:'#1a1a1a', band:'#000000', btn:'#ffdd44' },
          AMBERBALL:     { top:'#cc6600', bot:'#ffe0a0', band:'#5c2a00', btn:'#ffcc55' },
          MASTERBALL:    { top:'#8800cc', bot:'#ddc8ff', band:'#330055', btn:'#ff99ff' },
          DINOMASTERBALL:{ top:'#111111', bot:'#222222', band:'#00ffcc', btn:'#00ffcc' },
        };
        const ballPal = BALL_PAL[id];
        let textX = 10;
        if (ballPal) {
          // Draw mini ball (radius 6) in the row
          const bx = 20, by = y + 12;
          ctx.save();
          ctx.translate(bx, by);
          ctx.beginPath(); ctx.arc(0, 0, 6, Math.PI, 0); ctx.fillStyle = ballPal.top;  ctx.fill();
          ctx.beginPath(); ctx.arc(0, 0, 6, 0, Math.PI); ctx.fillStyle = ballPal.bot;  ctx.fill();
          ctx.beginPath(); ctx.arc(0, 0, 6, 0, Math.PI * 2); ctx.strokeStyle = ballPal.band; ctx.lineWidth = 0.8; ctx.stroke();
          ctx.beginPath(); ctx.moveTo(-6, 0); ctx.lineTo(6, 0); ctx.strokeStyle = ballPal.band; ctx.lineWidth = 1; ctx.stroke();
          ctx.beginPath(); ctx.arc(0, 0, 2, 0, Math.PI * 2); ctx.fillStyle = ballPal.band; ctx.fill();
          ctx.beginPath(); ctx.arc(0, 0, 1.1, 0, Math.PI * 2); ctx.fillStyle = ballPal.btn; ctx.fill();
          ctx.restore();
          textX = 30;
        }

        ctx.fillStyle = realIdx === _cursor ? '#FFE050' : '#ffffff';
        ctx.fillText((realIdx === _cursor ? '▶ ' : '  ') + name, textX, y + 5);
        ctx.fillStyle = '#aaaaff';
        ctx.fillText(`x${qty}`, W - 40, y + 5);
      });

      // Description bar
      if (items[_cursor]) {
        const id   = items[_cursor][0];
        const tmDef = DG.TM_DATA && DG.TM_DATA[id];
        const def  = ITEM_DEFS[id];
        let descText = def?.desc;
        if (!descText && tmDef) {
          const mv = DG.MOVES[tmDef.moveId];
          descText = mv ? `Teaches ${mv.name} (${mv.type}, ${mv.category}, PWR ${mv.power || '—'})` : `Teaches ${tmDef.moveId}`;
          // Append compatible-types hint for HMs
          if (tmDef.singleUse === false && Array.isArray(tmDef.canLearnTypes)) {
            descText += ` — ${tmDef.canLearnTypes.join('/')} types only`;
          }
        }
        if (descText) {
          ctx.fillStyle = '#aaaaaa';
          ctx.font = '11px monospace';
          ctx.fillText(descText, 10, H - 22);
        }
      }

      if (_scroll > 0)                       { ctx.fillStyle = '#8ed8f8'; ctx.fillText('▲', W - 14, LIST_TOP); }
      if (_scroll + VISIBLE < items.length)  { ctx.fillStyle = '#8ed8f8'; ctx.fillText('▼', W - 14, H - 30); }
    }

    ctx.fillStyle = '#888';
    ctx.font = '10px monospace';
    ctx.fillText('[ESC] Back  [<>] Tab', 10, H - 10);
  }

  // ── Sub-screen: party mon selector ──────────────────────────
  function _drawSelectMon(ctx, W, H) {
    const party   = _gs.player.party;
    const def     = ITEM_DEFS[_pendingItem];
    const tmDef   = DG.TM_DATA && DG.TM_DATA[_pendingItem];
    const itemName = def?.name || (tmDef ? _pendingItem : _pendingItem);

    // Pre-compute HM type restriction for this item (null if no restriction)
    const isHM          = tmDef && tmDef.singleUse === false;
    const hmMoveId      = tmDef ? tmDef.moveId : null;
    const hmAllowTypes  = (isHM && Array.isArray(tmDef.canLearnTypes)) ? tmDef.canLearnTypes : null;

    ctx.fillStyle = '#FFE050';
    ctx.fillText(`Use ${itemName} on:`, 10, 8);

    // Legend when teaching an HM with type restrictions
    if (hmAllowTypes) {
      ctx.fillStyle = '#888';
      ctx.font = '9px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`${hmAllowTypes.join('/')} types only`, W - 8, 8);
      ctx.textAlign = 'left';
    }

    party.forEach((mon, i) => {
      if (!mon) return;
      const sp     = DG.SPECIES[mon.speciesId];
      const name   = mon.nickname || sp?.name || mon.speciesId;
      const y      = 30 + i * 44;
      const isSel  = i === _monCursor;

      // ── Compatibility check ────────────────────────────────
      // null = no restriction (TM or non-HM item) → always compatible
      let compat = null; // null | true | false | 'KNOWN'
      if (hmMoveId && mon.moves && mon.moves.some(m => m.moveId === hmMoveId)) {
        compat = 'KNOWN';
      } else if (hmAllowTypes && sp) {
        const monTypes = sp.types || [];
        compat = monTypes.some(t => hmAllowTypes.includes(t));
      }

      // Slot background — tint red for incompatible mons
      if (compat === false) {
        ctx.fillStyle = isSel ? '#3a1a1a' : '#1e0e0e';
      } else if (compat === true) {
        ctx.fillStyle = isSel ? '#1a3a1a' : '#0e1e0e';
      } else {
        ctx.fillStyle = isSel ? '#2a2a50' : '#16213e';
      }
      ctx.fillRect(6, y, W - 12, 40);

      // Border — gold if selected, dim if incompatible, normal otherwise
      ctx.strokeStyle = isSel ? '#FFE050'
        : compat === false ? '#663333'
        : compat === true  ? '#336633'
        : '#4a6fa5';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(6, y, W - 12, 40);

      if (mon.isEgg) {
        ctx.fillStyle = '#aaa';
        ctx.font = '12px monospace';
        ctx.fillText((isSel ? '▶ ' : '  ') + 'EGG', 10, y + 14);
        return;
      }

      ctx.fillStyle = isSel ? '#FFE050' : '#fff';
      ctx.font = '12px monospace';
      ctx.fillText((isSel ? '▶ ' : '  ') + name, 10, y + 6);
      ctx.fillStyle = '#aaaaff';
      ctx.font = '10px monospace';
      ctx.fillText(`Lv.${mon.level}  ${sp?.types?.join('/') || ''}`, 10, y + 20);

      // HP bar
      const hpPct = mon.hp.current / mon.hp.max;
      ctx.fillStyle = '#333';
      ctx.fillRect(W - 110, y + 10, 100, 7);
      ctx.fillStyle = hpPct > 0.5 ? '#44cc44' : hpPct > 0.25 ? '#ddcc00' : '#cc3333';
      ctx.fillRect(W - 110, y + 10, Math.floor(100 * hpPct), 7);

      // ── Compatibility badge (top-right corner of slot) ──────
      if (compat !== null) {
        const bx = W - 14, by = y + 2;
        const bw = 8, bh = 36;
        if (compat === true) {
          // Green bar + checkmark
          ctx.fillStyle = '#22aa44';
          ctx.fillRect(bx, by, bw, bh);
          ctx.fillStyle = '#fff';
          ctx.font = 'bold 9px monospace';
          ctx.textAlign = 'center';
          ctx.fillText('✓', bx + bw / 2, by + bh / 2 + 3);
          ctx.textAlign = 'left';
        } else if (compat === false) {
          // Red bar + cross
          ctx.fillStyle = '#aa2222';
          ctx.fillRect(bx, by, bw, bh);
          ctx.fillStyle = '#fff';
          ctx.font = 'bold 9px monospace';
          ctx.textAlign = 'center';
          ctx.fillText('✗', bx + bw / 2, by + bh / 2 + 3);
          ctx.textAlign = 'left';
        } else if (compat === 'KNOWN') {
          // Grey bar + dot (already knows the move)
          ctx.fillStyle = '#555577';
          ctx.fillRect(bx, by, bw, bh);
          ctx.fillStyle = '#aaa';
          ctx.font = 'bold 9px monospace';
          ctx.textAlign = 'center';
          ctx.fillText('•', bx + bw / 2, by + bh / 2 + 3);
          ctx.textAlign = 'left';
        }
      }

      // Held item indicator (shift left to avoid overlap with compat badge)
      if (mon.heldItem) {
        ctx.fillStyle = '#c0a030';
        ctx.font = '9px monospace';
        ctx.fillText('◆', W - 26, y + 6);
      }
    });

    // Legend: colour meaning
    if (hmAllowTypes) {
      const legends = [
        { col: '#22aa44', label: '✓ Can learn' },
        { col: '#aa2222', label: '✗ Wrong type' },
        { col: '#555577', label: '• Already knows' },
      ];
      let lx = 8;
      legends.forEach(({ col, label }) => {
        ctx.fillStyle = col;
        ctx.font = 'bold 9px monospace';
        ctx.fillText(label, lx, H - 10);
        lx += ctx.measureText(label).width + 12;
      });
    } else {
      ctx.fillStyle = '#888';
      ctx.font = '10px monospace';
      ctx.fillText('[ESC] Cancel', 10, H - 10);
    }
  }

  // ── Sub-screen: move replace selector ───────────────────────
  function _drawSelectReplace(ctx, W, H) {
    const mon       = _pendingMon;
    const moveDef   = DG.MOVES[_pendingMove];
    const moveName  = moveDef ? moveDef.name : _pendingMove;
    const monName   = mon ? (mon.nickname || DG.SPECIES[mon.speciesId]?.name || mon.speciesId) : '?';

    ctx.fillStyle = '#FFE050';
    ctx.fillText(`${monName} can't learn more!`, 10, 8);
    ctx.fillStyle = '#aaa';
    ctx.font = '10px monospace';
    ctx.fillText(`Replace a move with ${moveName}?`, 10, 22);

    const moves = mon ? mon.moves : [];
    moves.forEach((mv, i) => {
      const mvDef = DG.MOVES[mv.moveId];
      const y     = 36 + i * 38;
      const isSel = i === _movCursor;

      ctx.fillStyle = isSel ? '#2a2a50' : '#16213e';
      ctx.fillRect(6, y, W - 12, 34);
      ctx.strokeStyle = isSel ? '#FFE050' : '#4a6fa5';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(6, y, W - 12, 34);

      ctx.fillStyle = isSel ? '#FFE050' : '#fff';
      ctx.font = '12px monospace';
      ctx.fillText((isSel ? '▶ ' : '  ') + (mvDef ? mvDef.name : mv.moveId), 10, y + 4);
      if (mvDef) {
        ctx.fillStyle = '#888';
        ctx.font = '9px monospace';
        ctx.fillText(`${mvDef.type}  PP:${mv.ppCurrent}/${mv.ppMax}`, 14, y + 20);
      }
    });

    // Cancel row
    const cancelY = 36 + moves.length * 38;
    const cancelSel = _movCursor >= moves.length;
    ctx.fillStyle = cancelSel ? '#2a2a50' : '#16213e';
    ctx.fillRect(6, cancelY, W - 12, 28);
    ctx.strokeStyle = cancelSel ? '#FFE050' : '#4a6fa5';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(6, cancelY, W - 12, 28);
    ctx.fillStyle = cancelSel ? '#FFE050' : '#888';
    ctx.font = '12px monospace';
    ctx.fillText((cancelSel ? '▶ ' : '  ') + 'Cancel', 10, cancelY + 6);

    ctx.fillStyle = '#888';
    ctx.font = '10px monospace';
    ctx.fillText('[ESC] Cancel', 10, H - 10);
  }

  console.log('[DinoMon] BagMenu loaded (v12 — category tabs: Heal / Battle / Balls / Key).');
  return { open, openBattle, update, draw, applyHeal: _applyHealItem };
})();

// DinoMon: Fossil Frontier — data/tmData.js
// TM and HM definitions. singleUse=true means the TM is consumed on use (Gen 1-4 style).
// HMs (singleUse=false) are reusable but usually tied to field moves.

window.DG = window.DG || {};

DG.TM_DATA = {
  // ── HMs — reusable, awarded by gyms (IDs match what _awardGymFieldMove gives) ──
  // canLearnTypes: only DinoMons with at least one matching type may learn this HM.
  // null/absent = any DinoMon can learn it.
  HM_ROCK_SMASH: { name: 'HM Rock Smash', moveId: 'ROCK_SMASH', singleUse: false, price: 0,
    canLearnTypes: ['ROCK','GROUND','FIGHTING'],
    desc: 'Smashes cracked boulders in the overworld. Fossil Badge required.' },
  HM_FLASH:      { name: 'HM Flash',      moveId: 'FLASH',      singleUse: false, price: 0,
    canLearnTypes: ['ELECTRIC','PSYCHIC','FIRE','FAIRY'],
    desc: 'Illuminates dark caves. Magma Badge required.' },
  HM_CUT:        { name: 'HM Cut',        moveId: 'CUT',        singleUse: false, price: 0,
    canLearnTypes: ['GRASS','BUG','NORMAL','FLYING','DARK'],
    desc: 'Cuts down small trees in the overworld. Canopy Badge required.' },
  HM_STRENGTH:   { name: 'HM Strength',   moveId: 'STRENGTH',   singleUse: false, price: 0,
    canLearnTypes: ['FIGHTING','NORMAL','ROCK','GROUND','STEEL'],
    desc: 'Pushes heavy boulders aside. Bedrock Badge required.' },
  HM_FLY:        { name: 'HM Fly',        moveId: 'FLY',        singleUse: false, price: 0,
    canLearnTypes: ['FLYING','DRAGON'],
    desc: 'Fly to any visited city. Static Badge required.' },
  HM_SURF:       { name: 'HM Surf',       moveId: 'SURF',       singleUse: false, price: 0,
    canLearnTypes: ['WATER'],
    desc: 'Ride across water tiles. Tide Badge required.' },
  HM_DIVE:       { name: 'HM Dive',       moveId: 'DIVE',       singleUse: false, price: 0,
    canLearnTypes: ['WATER'],
    desc: 'Dive into deep water caverns. Scale Badge required.' },
  // Legacy HM01-04 keys (kept for compatibility) — same canLearnTypes as their named equivalents
  HM01: { name: 'HM01 Cut',       moveId: 'CUT',          singleUse: false, price: 0,
    canLearnTypes: ['GRASS','BUG','NORMAL','FLYING','DARK'],
    desc: 'Cuts down small trees in the overworld.' },
  HM02: { name: 'HM02 Surf',      moveId: 'SURF',         singleUse: false, price: 0,
    canLearnTypes: ['WATER'],
    desc: 'Ride across water tiles.' },
  HM03: { name: 'HM03 Rock Smash',moveId: 'ROCK_SMASH',   singleUse: false, price: 0,
    canLearnTypes: ['ROCK','GROUND','FIGHTING'],
    desc: 'Smashes cracked rocks in the overworld.' },
  HM04: { name: 'HM04 Waterfall', moveId: 'WATERFALL',    singleUse: false, price: 0,
    canLearnTypes: ['WATER'],
    desc: 'Climb waterfalls with 6 badges.' },

  // ── TMs (single-use by default) ────────────────────────────
  TM01: { name: 'TM01 Flamethrower',moveId: 'FLAMETHROWER', singleUse: true, price: 3000,  desc: 'A scorching Fire attack with 10% burn chance.' },
  TM02: { name: 'TM02 Fire Blast',  moveId: 'FIRE_BLAST',   singleUse: true, price: 5500,  desc: 'A powerful Fire move with 10% burn chance.' },
  TM03: { name: 'TM03 Flame Charge',moveId: 'FLAME_CHARGE', singleUse: true, price: 2000,  desc: 'Fire charge that raises Speed by 1 stage.' },
  TM04: { name: 'TM04 Solar Beam',  moveId: 'SOLAR_BEAM',   singleUse: true, price: 5000,  desc: '2-turn Grass attack. Skips charge in sunlight.' },
  TM05: { name: 'TM05 Energy Ball', moveId: 'ENERGY_BALL',  singleUse: true, price: 3000,  desc: 'Grass energy blast. May lower Sp.Def.' },
  TM06: { name: 'TM06 Razor Leaf', moveId: 'RAZOR_LEAF',   singleUse: true, price: 2000,  desc: 'Sharp leaves slice the foe. High crit ratio.' },
  TM07: { name: 'TM07 Hydro Pump', moveId: 'HYDRO_PUMP',   singleUse: true, price: 5500,  desc: 'Powerful Water torrent.' },
  TM08: { name: 'TM08 Aqua Jet',   moveId: 'AQUA_JET',     singleUse: true, price: 2000,  desc: 'Water attack that always goes first (+1 priority).' },
  TM09: { name: 'TM09 Dragon Pulse',moveId: 'DRAGON_PULSE', singleUse: true, price: 4000,  desc: 'Dragon energy pulse. Reliable mid-power move.' },
  TM10: { name: 'TM10 Outrage',    moveId: 'OUTRAGE',       singleUse: true, price: 6000,  desc: 'Dragon rampage for 2-3 turns, then confusion.' },
  TM11: { name: 'TM11 Stone Edge', moveId: 'STONE_EDGE',    singleUse: true, price: 4000,  desc: 'Sharp rocks strike. High crit ratio.' },
  TM12: { name: 'TM12 Overheat',   moveId: 'OVERHEAT',      singleUse: true, price: 5000,  desc: 'Max-power Fire, but Sp.Atk drops 2 stages.' },
  TM13: { name: 'TM13 Leech Seed', moveId: 'LEECH_SEED',    singleUse: true, price: 1500,  desc: 'Drains HP from foe each turn.' },
  TM14: { name: 'TM14 Synthesis',  moveId: 'SYNTHESIS',     singleUse: true, price: 2000,  desc: 'Restores HP. Restores more in sunlight.' },
  TM15: { name: 'TM15 Aqua Ring',  moveId: 'AQUA_RING',     singleUse: true, price: 2000,  desc: 'Surrounds user with water to heal 1/16 HP/turn.' },
  TM16: { name: 'TM16 Tidal Force',moveId: 'TIDAL_FORCE',   singleUse: true, price: 6500,  desc: 'Massive Water surge. Strongest Water TM.' },
  TM17: { name: 'TM17 Plate Slam', moveId: 'PLATE_SLAM',    singleUse: true, price: 2500,  desc: 'Body slam with bony plates. May cause flinch.' },
  TM18: { name: 'TM18 Smokescreen',moveId: 'SMOKESCREEN',   singleUse: true, price: 1000,  desc: 'Lowers foe\'s Accuracy by 1 stage.' },
  TM19: { name: 'TM19 Frill Flare',moveId: 'FRILL_FLARE',   singleUse: true, price: 2000,  desc: 'Fire frill spreads. May cause flinch.' },
  TM20: { name: 'TM20 Earth Shake',moveId: 'EARTH_SHAKE',   singleUse: true, price: 4000,  desc: 'Ground shockwave. Hits all grounded foes.' },
};

// Build item definitions for bag display (injected into DG.ITEMS at load time)
(function() {
  if (!window.DG) return;
  DG.ITEMS = DG.ITEMS || {};
  for (const [id, tm] of Object.entries(DG.TM_DATA)) {
    DG.ITEMS[id] = {
      name:  tm.name,
      price: tm.price,
      type:  id.startsWith('HM') ? 'HM' : 'TM',
      moveId: tm.moveId,
      singleUse: tm.singleUse,
    };
  }
})();

console.log('[DinoMon] TM/HM data loaded.');

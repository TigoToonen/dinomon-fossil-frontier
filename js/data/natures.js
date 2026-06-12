// DinoMon: Fossil Frontier — data/natures.js
// 25 natures — each boosts one battle stat +10%, reduces another -10%
// HP is never modified by nature.

window.DG = window.DG || {};

DG.NATURES = {
  HARDY:   { name: 'Hardy',   boosts: null,    reduces: null    },
  LONELY:  { name: 'Lonely',  boosts: 'atk',   reduces: 'def'   },
  BRAVE:   { name: 'Brave',   boosts: 'atk',   reduces: 'spd'   },
  ADAMANT: { name: 'Adamant', boosts: 'atk',   reduces: 'spAtk' },
  NAUGHTY: { name: 'Naughty', boosts: 'atk',   reduces: 'spDef' },
  BOLD:    { name: 'Bold',    boosts: 'def',   reduces: 'atk'   },
  DOCILE:  { name: 'Docile',  boosts: null,    reduces: null    },
  RELAXED: { name: 'Relaxed', boosts: 'def',   reduces: 'spd'   },
  IMPISH:  { name: 'Impish',  boosts: 'def',   reduces: 'spAtk' },
  LAX:     { name: 'Lax',     boosts: 'def',   reduces: 'spDef' },
  TIMID:   { name: 'Timid',   boosts: 'spd',   reduces: 'atk'   },
  HASTY:   { name: 'Hasty',   boosts: 'spd',   reduces: 'def'   },
  SERIOUS: { name: 'Serious', boosts: null,    reduces: null    },
  JOLLY:   { name: 'Jolly',   boosts: 'spd',   reduces: 'spAtk' },
  NAIVE:   { name: 'Naive',   boosts: 'spd',   reduces: 'spDef' },
  MODEST:  { name: 'Modest',  boosts: 'spAtk', reduces: 'atk'   },
  MILD:    { name: 'Mild',    boosts: 'spAtk', reduces: 'def'   },
  QUIET:   { name: 'Quiet',   boosts: 'spAtk', reduces: 'spd'   },
  BASHFUL: { name: 'Bashful', boosts: null,    reduces: null    },
  RASH:    { name: 'Rash',    boosts: 'spAtk', reduces: 'spDef' },
  CALM:    { name: 'Calm',    boosts: 'spDef', reduces: 'atk'   },
  GENTLE:  { name: 'Gentle',  boosts: 'spDef', reduces: 'def'   },
  SASSY:   { name: 'Sassy',   boosts: 'spDef', reduces: 'spd'   },
  CAREFUL: { name: 'Careful', boosts: 'spDef', reduces: 'spAtk' },
  QUIRKY:  { name: 'Quirky',  boosts: null,    reduces: null    },
};

DG.NATURE_NAMES = Object.keys(DG.NATURES);

// Stat display names for nature coloring in UI
DG.STAT_DISPLAY = {
  atk: 'Atk', def: 'Def', spAtk: 'Sp.Atk', spDef: 'Sp.Def', spd: 'Speed', hp: 'HP',
};

// Nature color: boosted = red, reduced = blue, neutral = white
DG.getNatureColor = function(natureName, stat) {
  if (!natureName || !DG.NATURES[natureName]) return '#ffffff';
  const nat = DG.NATURES[natureName];
  if (nat.boosts  === stat) return '#ff6666';
  if (nat.reduces === stat) return '#6699ff';
  return '#ffffff';
};

console.log('[DinoMon] Natures loaded.');

// DinoMon: Fossil Frontier — battle/statusEffects.js
// Status effect application and end-of-turn tick logic

window.DG = window.DG || {};

DG.StatusEffects = (function () {

  // Apply a status condition to a DinoMon. Returns {applied:bool, message:string}
  function apply(mon, status) {
    if (!mon || mon.hp.current <= 0) return { applied: false, message: '' };
    if (mon.statusEffect) return { applied: false, message: `${_name(mon)} already has a condition!` };

    // Type immunities
    const types = DG.SPECIES[mon.speciesId] ? DG.SPECIES[mon.speciesId].types : [];
    if (status === DG.STATUS.BURN    && types.includes('FIRE'))     return { applied: false, message: `${_name(mon)} can't be burned!` };
    if (status === DG.STATUS.POISON  && (types.includes('POISON') || types.includes('STEEL'))) return { applied: false, message: `${_name(mon)} can't be poisoned!` };
    if (status === DG.STATUS.PARALYSIS && types.includes('ELECTRIC')) return { applied: false, message: `${_name(mon)} can't be paralysed!` };
    if (status === DG.STATUS.FREEZE  && types.includes('ICE'))      return { applied: false, message: `${_name(mon)} can't be frozen!` };
    if ((status === DG.STATUS.POISON || status === DG.STATUS.BADPOISON) && types.includes('STEEL')) {
      return { applied: false, message: `${_name(mon)} can't be poisoned!` };
    }

    mon.statusEffect = status;
    mon.statusTurns = 0;

    // All time-limited statuses last 1–3 turns (random at application time)
    if (status === DG.STATUS.SLEEP     ||
        status === DG.STATUS.BURN      ||
        status === DG.STATUS.POISON    ||
        status === DG.STATUS.PARALYSIS ||
        status === DG.STATUS.FREEZE) {
      mon.statusTurns = 1 + Math.floor(Math.random() * 3);
    }
    // BADPOISON: statusTurns is used as an escalating counter (starts at 0, grows each turn)

    const msgs = {
      [DG.STATUS.BURN]:      `${_name(mon)} was burned!`,
      [DG.STATUS.PARALYSIS]: `${_name(mon)} is paralysed! It may be unable to move!`,
      [DG.STATUS.POISON]:    `${_name(mon)} was poisoned!`,
      [DG.STATUS.BADPOISON]: `${_name(mon)} was badly poisoned!`,
      [DG.STATUS.SLEEP]:     `${_name(mon)} fell asleep!`,
      [DG.STATUS.FREEZE]:    `${_name(mon)} was frozen solid!`,
    };
    return { applied: true, message: msgs[status] || `${_name(mon)} was afflicted!` };
  }

  // Apply confusion separately (tracked via confusionTurns)
  function applyConfusion(mon) {
    if (!mon || mon.confusionTurns > 0) return { applied: false, message: '' };
    mon.confusionTurns = 2 + Math.floor(Math.random() * 4); // 2-5 turns
    return { applied: true, message: `${_name(mon)} became confused!` };
  }

  // Check if a confused DinoMon hits itself. Returns {selfHit:bool, message:string}
  function confusionCheck(mon) {
    if (!mon || mon.confusionTurns <= 0) return { selfHit: false, message: '' };
    mon.confusionTurns--;
    if (mon.confusionTurns <= 0) {
      return { selfHit: false, message: `${_name(mon)} snapped out of confusion!` };
    }
    if (Math.random() < 0.5) {
      // Self-inflicted: 40 power typeless physical
      const dmg = Math.max(1, Math.floor((2 * mon.level / 5 + 2) * 40 * mon.stats.atk / mon.stats.def / 50 + 2));
      mon.hp.current = Math.max(0, mon.hp.current - dmg);
      return { selfHit: true, message: `${_name(mon)} is confused! It hurt itself in its confusion! (${dmg} dmg)` };
    }
    return { selfHit: false, message: `${_name(mon)} is confused!` };
  }

  // Check if a paralysed DinoMon can move. Returns {canMove:bool, message:string}
  function paralysisCheck(mon) {
    if (!mon || mon.statusEffect !== DG.STATUS.PARALYSIS) return { canMove: true, message: '' };
    if (Math.random() < 0.25) {
      return { canMove: false, message: `${_name(mon)} is paralysed! It can't move!` };
    }
    return { canMove: true, message: '' };
  }

  // Check if a sleeping DinoMon wakes up. Returns {canMove:bool, message:string}
  function sleepCheck(mon) {
    if (!mon || mon.statusEffect !== DG.STATUS.SLEEP) return { canMove: true, message: '' };
    mon.statusTurns--;
    if (mon.statusTurns <= 0) {
      mon.statusEffect = null;
      return { canMove: true, message: `${_name(mon)} woke up!` };
    }
    return { canMove: false, message: `${_name(mon)} is fast asleep!` };
  }

  // Check if a frozen DinoMon thaws. Returns {canMove:bool, message:string}
  function freezeCheck(mon) {
    if (!mon || mon.statusEffect !== DG.STATUS.FREEZE) return { canMove: true, message: '' };
    if (Math.random() < 0.2) {
      mon.statusEffect = null;
      return { canMove: true, message: `${_name(mon)} thawed out!` };
    }
    return { canMove: false, message: `${_name(mon)} is frozen solid!` };
  }

  // End-of-turn status damage/tick.
  // Returns array of { message, damage, statusAnim } — statusAnim is used by battle.js
  // to trigger the matching visual effect when the message is displayed.
  // weather: optional weather state string ('SANDSTORM'|'HAIL'|'RAIN'|'SUN'|null)
  function endOfTurnTick(mon, weather) {
    if (!mon || mon.hp.current <= 0) return [];
    const msgs = [];
    const maxHP = mon.hp.max;
    const name  = _name(mon);

    // ── Burn (1-3 turn duration, 1/16 HP per turn) ────────────
    if (mon.statusEffect === DG.STATUS.BURN) {
      const dmg = Math.max(1, Math.floor(maxHP / 16));
      mon.hp.current = Math.max(0, mon.hp.current - dmg);
      msgs.push({ message: `${name} is hurt by its burn! (-${dmg} HP)`, damage: dmg, statusAnim: 'BURN' });
      if (mon.statusTurns > 0) {
        mon.statusTurns--;
        if (mon.statusTurns <= 0) {
          mon.statusEffect = null;
          msgs.push({ message: `${name}'s burn faded away!`, damage: 0 });
        }
      }

    // ── Poison (1-3 turn duration, 1/8 HP per turn) ───────────
    } else if (mon.statusEffect === DG.STATUS.POISON) {
      const dmg = Math.max(1, Math.floor(maxHP / 8));
      mon.hp.current = Math.max(0, mon.hp.current - dmg);
      msgs.push({ message: `${name} is hurt by poison! (-${dmg} HP)`, damage: dmg, statusAnim: 'POISON' });
      if (mon.statusTurns > 0) {
        mon.statusTurns--;
        if (mon.statusTurns <= 0) {
          mon.statusEffect = null;
          msgs.push({ message: `${name} recovered from poison!`, damage: 0 });
        }
      }

    // ── Bad Poison (escalating, indefinite) ───────────────────
    } else if (mon.statusEffect === DG.STATUS.BADPOISON) {
      mon.statusTurns = (mon.statusTurns || 0) + 1;
      const dmg = Math.max(1, Math.floor(maxHP * mon.statusTurns / 16));
      mon.hp.current = Math.max(0, mon.hp.current - dmg);
      msgs.push({ message: `${name} is badly poisoned! (-${dmg} HP)`, damage: dmg, statusAnim: 'BADPOISON' });
    }

    // ── Paralysis: tick duration, auto-cure when expired ──────
    if (mon.statusEffect === DG.STATUS.PARALYSIS && mon.statusTurns > 0) {
      mon.statusTurns--;
      if (mon.statusTurns <= 0) {
        mon.statusEffect = null;
        msgs.push({ message: `${name} recovered from paralysis!`, damage: 0 });
      }
    }

    // ── Freeze: tick duration, auto-thaw when expired ─────────
    if (mon.statusEffect === DG.STATUS.FREEZE && mon.statusTurns > 0) {
      mon.statusTurns--;
      if (mon.statusTurns <= 0) {
        mon.statusEffect = null;
        msgs.push({ message: `${name} thawed out!`, damage: 0 });
      }
    }

    // ── Weather damage ─────────────────────────────────────────
    const species = DG.SPECIES[mon.speciesId];
    const types = species ? species.types : [];
    if (weather === 'SANDSTORM') {
      if (!types.includes('ROCK') && !types.includes('STEEL') && !types.includes('GROUND')) {
        const dmg = Math.max(1, Math.floor(maxHP / 16));
        mon.hp.current = Math.max(0, mon.hp.current - dmg);
        msgs.push({ message: `${name} is battered by the sandstorm! (-${dmg} HP)`, damage: dmg });
      }
    } else if (weather === 'HAIL') {
      if (!types.includes('ICE')) {
        const dmg = Math.max(1, Math.floor(maxHP / 16));
        mon.hp.current = Math.max(0, mon.hp.current - dmg);
        msgs.push({ message: `${name} is pelted by hail! (-${dmg} HP)`, damage: dmg });
      }
    }

    // ── Passive healing abilities (1/16 per turn) ─────────────
    const healAbilities = ['Living Forest', 'Regenerate', 'Natural Cure Passive'];
    if (species && healAbilities.includes(species.ability) && mon.hp.current < mon.hp.max && mon.hp.current > 0) {
      const heal = Math.max(1, Math.floor(mon.hp.max / 16));
      mon.hp.current = Math.min(mon.hp.max, mon.hp.current + heal);
      msgs.push({ message: `${name} restored HP with ${species.ability}!`, damage: -heal });
    }

    return msgs;
  }

  // Cure a status condition
  function cure(mon, status) {
    if (!status || status === 'ALL') {
      mon.statusEffect = null;
      mon.statusTurns = 0;
      mon.confusionTurns = 0;
      return `${_name(mon)} was fully healed of all conditions!`;
    }
    const cures = Array.isArray(status) ? status : [status];
    if (cures.includes(mon.statusEffect)) {
      mon.statusEffect = null;
      mon.statusTurns = 0;
      return `${_name(mon)} was cured of its condition!`;
    }
    return '';
  }

  // Get Speed multiplier from status
  function speedMult(mon) {
    if (mon.statusEffect === DG.STATUS.PARALYSIS) return 0.5;
    return 1.0;
  }

  // Get Attack multiplier from status (for physical)
  function attackMult(mon) {
    if (mon.statusEffect === DG.STATUS.BURN) return 0.5;
    return 1.0;
  }

  function _name(mon) {
    if (!mon) return '?';
    const species = DG.SPECIES[mon.speciesId];
    return mon.nickname || (species ? species.name : mon.speciesId);
  }

  // Status display name for UI
  function displayName(status) {
    const names = {
      BURN: 'BRN', PARALYSIS: 'PAR', POISON: 'PSN',
      BADPOISON: 'TOX', SLEEP: 'SLP', FREEZE: 'FRZ',
    };
    return names[status] || '';
  }

  // Status colour for UI badge
  function displayColor(status) {
    const cols = {
      BURN: '#F08030', PARALYSIS: '#F8D030', POISON: '#A040A0',
      BADPOISON: '#6B006B', SLEEP: '#7038F8', FREEZE: '#98D8D8',
    };
    return cols[status] || '#888';
  }

  console.log('[DinoMon] StatusEffects loaded.');

  return {
    apply, applyConfusion, confusionCheck, paralysisCheck,
    sleepCheck, freezeCheck, endOfTurnTick, cure,
    speedMult, attackMult, displayName, displayColor,
  };
})();

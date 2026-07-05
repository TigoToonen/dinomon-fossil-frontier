// DinoMon: Fossil Frontier — battle/statusEffects.js
// Status effect application and end-of-turn tick logic

window.DG = window.DG || {};

DG.StatusEffects = (function () {

  // Apply a status condition to a DinoMon. Returns {applied:bool, message:string}
  function apply(mon, status, force) {
    if (!mon || mon.hp.current <= 0) return { applied: false, message: '' };
    if (mon.statusEffect) return { applied: false, message: `${_name(mon)} already has a condition!` };

    // Type immunities (`force` = Corrosion-style bypass: can poison any type)
    const types = DG.SPECIES[mon.speciesId] ? DG.SPECIES[mon.speciesId].types : [];
    if (!force) {
      if (status === DG.STATUS.BURN    && types.includes('FIRE'))     return { applied: false, message: `${_name(mon)} can't be burned!` };
      if (status === DG.STATUS.POISON  && (types.includes('POISON') || types.includes('STEEL'))) return { applied: false, message: `${_name(mon)} can't be poisoned!` };
      if (status === DG.STATUS.PARALYSIS && types.includes('ELECTRIC')) return { applied: false, message: `${_name(mon)} can't be paralysed!` };
      if (status === DG.STATUS.FREEZE  && types.includes('ICE'))      return { applied: false, message: `${_name(mon)} can't be frozen!` };
      if ((status === DG.STATUS.POISON || status === DG.STATUS.BADPOISON) && types.includes('STEEL')) {
        return { applied: false, message: `${_name(mon)} can't be poisoned!` };
      }
    }

    mon.statusEffect = status;
    mon.statusTurns = 0;

    // BATTLE-STRATEGY Fase 1b — het 20%-herstelmodel:
    // • SLEEP: statusTurns = resterende beurten (1–3), ZICHTBAAR in de HUD.
    // • BADPOISON: statusTurns = escalatie-teller (start 0, +1 per beurt).
    // • BURN/POISON/PARALYSIS: statusTurns telt verstreken end-of-turns;
    //   de status blijft tot genezen, maar herstelt vanaf de 2e beurt met
    //   20% kans per beurt (TOX 10%). De eerste beurt is dus gegarandeerd.
    // • FREEZE: geen duur — alleen de 20% ontdooikans per beweegpoging
    //   (freezeCheck) of een fire-hit.
    if (status === DG.STATUS.SLEEP) {
      mon.statusTurns = 1 + Math.floor(Math.random() * 3);
    }

    // Meldingen mét getallen — de speler moet de regels kunnen leren
    const msgs = {
      [DG.STATUS.BURN]:      `${_name(mon)} was burned! (1/16 HP/turn, ATK halved — 20%/turn recovery)`,
      [DG.STATUS.PARALYSIS]: `${_name(mon)} is paralysed! (SPD halved, 25% skip — 20%/turn recovery)`,
      [DG.STATUS.POISON]:    `${_name(mon)} was poisoned! (1/8 HP/turn — 20%/turn recovery)`,
      [DG.STATUS.BADPOISON]: `${_name(mon)} was badly poisoned! (rising damage — only 10%/turn recovery)`,
      [DG.STATUS.SLEEP]:     `${_name(mon)} fell asleep! (${mon.statusTurns} turn${mon.statusTurns > 1 ? 's' : ''})`,
      [DG.STATUS.FREEZE]:    `${_name(mon)} was frozen solid! (20%/turn thaw — fire hits thaw instantly)`,
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
    const _ab   = (DG.SPECIES[mon.speciesId] || {}).ability;

    // BATTLE-STRATEGY Fase 3c: Shed Skin — 30% kans per beurt om élke status
    // af te werpen (vervelt vóór de schade-tik van deze beurt)
    if (_ab === 'Shed Skin' && mon.statusEffect && Math.random() < 0.30) {
      mon.statusEffect = null;
      mon.statusTurns = 0;
      msgs.push({ message: `${name} shed its skin and its condition!`, damage: 0 });
    }

    // BATTLE-STRATEGY Fase 1b — 20%-herstelmodel.
    // Herstelkans geldt pas vanaf de 2e end-of-turn (eerste beurt gegarandeerd);
    // rolt NA de schade van deze beurt, zodat herstellen nooit een tik scheelt.
    const RECOVER = 0.20, RECOVER_TOX = 0.10;
    const _tryRecover = (chance, msg) => {
      if (mon.statusTurns >= 1 && Math.random() < chance) {
        mon.statusEffect = null;
        mon.statusTurns = 0;
        msgs.push({ message: msg, damage: 0 });
        return true;
      }
      mon.statusTurns++;
      return false;
    };

    // ── Burn (1/16 HP per beurt, ATK ×0,5 — tot genezen/herstel) ──
    if (mon.statusEffect === DG.STATUS.BURN) {
      const dmg = Math.max(1, Math.floor(maxHP / 16));
      mon.hp.current = Math.max(0, mon.hp.current - dmg);
      msgs.push({ message: `${name} is hurt by its burn! (-${dmg} HP)`, damage: dmg, statusAnim: 'BURN' });
      _tryRecover(RECOVER, `${name}'s burn faded away!`);

    // ── Poison (1/8 HP per beurt — tot genezen/herstel) ───────
    } else if (mon.statusEffect === DG.STATUS.POISON || mon.statusEffect === DG.STATUS.BADPOISON) {
      // Fase 3c: Poison Heal — gif voedt in plaats van schaadt (+1/8 HP/beurt);
      // geen zelfherstel-roll: deze mon WIL vergiftigd blijven.
      if (_ab === 'Poison Heal') {
        if (mon.hp.current < maxHP) {
          const heal = Math.max(1, Math.floor(maxHP / 8));
          mon.hp.current = Math.min(maxHP, mon.hp.current + heal);
          msgs.push({ message: `${name}'s Poison Heal restored ${heal} HP!`, damage: -heal });
        }
      } else if (mon.statusEffect === DG.STATUS.POISON) {
        const dmg = Math.max(1, Math.floor(maxHP / 8));
        mon.hp.current = Math.max(0, mon.hp.current - dmg);
        msgs.push({ message: `${name} is hurt by poison! (-${dmg} HP)`, damage: dmg, statusAnim: 'POISON' });
        _tryRecover(RECOVER, `${name} recovered from poison!`);

      // ── Bad Poison (escalerend n/16; slechts 10% herstel) ───
      } else {
        mon.statusTurns = (mon.statusTurns || 0) + 1;
        const dmg = Math.max(1, Math.floor(maxHP * mon.statusTurns / 16));
        mon.hp.current = Math.max(0, mon.hp.current - dmg);
        msgs.push({ message: `${name} is badly poisoned! (-${dmg} HP)`, damage: dmg, statusAnim: 'BADPOISON' });
        // teller is al ≥1 na de eerste tik; herstelkans dus vanaf de 2e beurt
        if (mon.statusTurns >= 2 && Math.random() < RECOVER_TOX) {
          mon.statusEffect = null;
          mon.statusTurns = 0;
          msgs.push({ message: `${name} shook off the toxic poison!`, damage: 0 });
        }
      }

    // ── Paralysis (SPD ×0,5 + 25% skip — tot genezen/herstel) ─
    } else if (mon.statusEffect === DG.STATUS.PARALYSIS) {
      _tryRecover(RECOVER, `${name} recovered from paralysis!`);
    }
    // FREEZE heeft hier bewust géén pad meer: ontdooien gebeurt via de 20%
    // kans per beweegpoging (freezeCheck) of een fire-hit (battle.js).

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
    // Fase 3c: Quick Feet — een status maakt hem juist SNELLER (×1,5),
    // en de paralysis-vertraging vervalt volledig
    const _ab = mon && (DG.SPECIES[mon.speciesId] || {}).ability;
    if (_ab === 'Quick Feet' && mon.statusEffect) return 1.5;
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

  // BATTLE-STRATEGY Fase 1c: badge-tekst mét teller — SLP toont de resterende
  // beurten (zichtbare aftelklok), TOX de escalatie-stand (×n).
  function badgeText(mon) {
    if (!mon || !mon.statusEffect) return '';
    const base = displayName(mon.statusEffect);
    if (mon.statusEffect === DG.STATUS.SLEEP && mon.statusTurns > 0) return base + ' ' + mon.statusTurns;
    if (mon.statusEffect === DG.STATUS.BADPOISON && mon.statusTurns > 0) return base + '×' + mon.statusTurns;
    return base;
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
    speedMult, attackMult, displayName, displayColor, badgeText,
  };
})();

// DinoMon: Fossil Frontier — battle/typeChart.js
// Type effectiveness matrix and damage formula

window.DG = window.DG || {};

DG.TypeChart = (function () {
  // Effectiveness multipliers: chart[attackType][defenseType]
  // 2 = super effective, 0.5 = not very effective, 0 = immune, 1 = normal
  const chart = {
    NORMAL:   { NORMAL:1, FIRE:1, WATER:1, GRASS:1, ELECTRIC:1, ICE:1, FIGHTING:1, POISON:1, GROUND:1, FLYING:1, PSYCHIC:1, BUG:1, ROCK:0.5, GHOST:0, DRAGON:1, DARK:1, STEEL:0.5, FAIRY:1 },
    FIRE:     { NORMAL:1, FIRE:0.5, WATER:0.5, GRASS:2, ELECTRIC:1, ICE:2, FIGHTING:1, POISON:1, GROUND:1, FLYING:1, PSYCHIC:1, BUG:2, ROCK:0.5, GHOST:1, DRAGON:0.5, DARK:1, STEEL:2, FAIRY:1 },
    WATER:    { NORMAL:1, FIRE:2, WATER:0.5, GRASS:0.5, ELECTRIC:1, ICE:1, FIGHTING:1, POISON:1, GROUND:2, FLYING:1, PSYCHIC:1, BUG:1, ROCK:2, GHOST:1, DRAGON:0.5, DARK:1, STEEL:1, FAIRY:1 },
    GRASS:    { NORMAL:1, FIRE:0.5, WATER:2, GRASS:0.5, ELECTRIC:1, ICE:1, FIGHTING:1, POISON:0.5, GROUND:2, FLYING:0.5, PSYCHIC:1, BUG:0.5, ROCK:2, GHOST:1, DRAGON:0.5, DARK:1, STEEL:0.5, FAIRY:1 },
    ELECTRIC: { NORMAL:1, FIRE:1, WATER:2, GRASS:0.5, ELECTRIC:0.5, ICE:1, FIGHTING:1, POISON:1, GROUND:0, FLYING:2, PSYCHIC:1, BUG:1, ROCK:1, GHOST:1, DRAGON:0.5, DARK:1, STEEL:1, FAIRY:1 },
    ICE:      { NORMAL:1, FIRE:0.5, WATER:0.5, GRASS:2, ELECTRIC:1, ICE:0.5, FIGHTING:1, POISON:1, GROUND:2, FLYING:2, PSYCHIC:1, BUG:1, ROCK:1, GHOST:1, DRAGON:2, DARK:1, STEEL:0.5, FAIRY:1 },
    FIGHTING: { NORMAL:2, FIRE:1, WATER:1, GRASS:1, ELECTRIC:1, ICE:2, FIGHTING:1, POISON:0.5, GROUND:1, FLYING:0.5, PSYCHIC:0.5, BUG:0.5, ROCK:2, GHOST:0, DRAGON:1, DARK:2, STEEL:2, FAIRY:0.5 },
    POISON:   { NORMAL:1, FIRE:1, WATER:1, GRASS:2, ELECTRIC:1, ICE:1, FIGHTING:1, POISON:0.5, GROUND:0.5, FLYING:1, PSYCHIC:1, BUG:1, ROCK:0.5, GHOST:0.5, DRAGON:1, DARK:1, STEEL:0, FAIRY:2 },
    GROUND:   { NORMAL:1, FIRE:2, WATER:1, GRASS:0.5, ELECTRIC:2, ICE:1, FIGHTING:1, POISON:2, GROUND:1, FLYING:0, PSYCHIC:1, BUG:0.5, ROCK:2, GHOST:1, DRAGON:1, DARK:1, STEEL:2, FAIRY:1 },
    FLYING:   { NORMAL:1, FIRE:1, WATER:1, GRASS:2, ELECTRIC:0.5, ICE:1, FIGHTING:2, POISON:1, GROUND:1, FLYING:1, PSYCHIC:1, BUG:2, ROCK:0.5, GHOST:1, DRAGON:1, DARK:1, STEEL:0.5, FAIRY:1 },
    PSYCHIC:  { NORMAL:1, FIRE:1, WATER:1, GRASS:1, ELECTRIC:1, ICE:1, FIGHTING:2, POISON:2, GROUND:1, FLYING:1, PSYCHIC:0.5, BUG:1, ROCK:1, GHOST:1, DRAGON:1, DARK:0, STEEL:0.5, FAIRY:1 },
    BUG:      { NORMAL:1, FIRE:0.5, WATER:1, GRASS:2, ELECTRIC:1, ICE:1, FIGHTING:0.5, POISON:0.5, GROUND:1, FLYING:0.5, PSYCHIC:2, BUG:1, ROCK:1, GHOST:0.5, DRAGON:1, DARK:2, STEEL:0.5, FAIRY:0.5 },
    ROCK:     { NORMAL:1, FIRE:2, WATER:1, GRASS:1, ELECTRIC:1, ICE:2, FIGHTING:0.5, POISON:1, GROUND:0.5, FLYING:2, PSYCHIC:1, BUG:2, ROCK:1, GHOST:1, DRAGON:1, DARK:1, STEEL:0.5, FAIRY:1 },
    GHOST:    { NORMAL:0, FIRE:1, WATER:1, GRASS:1, ELECTRIC:1, ICE:1, FIGHTING:1, POISON:1, GROUND:1, FLYING:1, PSYCHIC:2, BUG:1, ROCK:1, GHOST:2, DRAGON:1, DARK:0.5, STEEL:1, FAIRY:1 },
    DRAGON:   { NORMAL:1, FIRE:1, WATER:1, GRASS:1, ELECTRIC:1, ICE:1, FIGHTING:1, POISON:1, GROUND:1, FLYING:1, PSYCHIC:1, BUG:1, ROCK:1, GHOST:1, DRAGON:2, DARK:1, STEEL:0.5, FAIRY:0 },
    DARK:     { NORMAL:1, FIRE:1, WATER:1, GRASS:1, ELECTRIC:1, ICE:1, FIGHTING:0.5, POISON:1, GROUND:1, FLYING:1, PSYCHIC:2, BUG:1, ROCK:1, GHOST:2, DRAGON:1, DARK:0.5, STEEL:0.5, FAIRY:0.5 },
    STEEL:    { NORMAL:1, FIRE:0.5, WATER:0.5, GRASS:1, ELECTRIC:0.5, ICE:2, FIGHTING:1, POISON:1, GROUND:1, FLYING:1, PSYCHIC:1, BUG:1, ROCK:2, GHOST:1, DRAGON:1, DARK:1, STEEL:0.5, FAIRY:2 },
    FAIRY:    { NORMAL:1, FIRE:0.5, WATER:1, GRASS:1, ELECTRIC:1, ICE:1, FIGHTING:2, POISON:0.5, GROUND:1, FLYING:1, PSYCHIC:1, BUG:1, ROCK:1, GHOST:1, DRAGON:2, DARK:2, STEEL:0.5, FAIRY:1 },
  };

  // Get combined effectiveness multiplier for an attack type against defender's types array
  function getEffectiveness(attackType, defenderTypes) {
    let mult = 1;
    for (const defType of defenderTypes) {
      const row = chart[attackType];
      if (row && defType in row) {
        mult *= row[defType];
      }
    }
    return mult;
  }

  // Returns string label for effectiveness multiplier
  function effectivenessLabel(mult) {
    if (mult === 0)   return "It had no effect!";
    if (mult < 1)     return "It's not very effective...";
    if (mult > 1)     return "It's super effective!";
    return "";
  }

  // Check STAB (Same Type Attack Bonus)
  function hasSTAB(moveType, attackerTypes) {
    return attackerTypes.includes(moveType);
  }

  // ── Damage Formula (Gen IV-based) ────────────────────────
  // Returns { damage, effectiveness, crit }
  // opts: { weather, abilityMult, defAbilityMult, critStage }
  function calcDamage(attacker, defender, move, statStages, opts) {
    opts = opts || {};
    if (!move || move.category === 'STATUS' || move.power === 0) return { damage: 0, effectiveness: 1, crit: false };

    const attackerSpecies = DG.SPECIES[attacker.speciesId];
    const defenderSpecies = DG.SPECIES[defender.speciesId];
    if (!attackerSpecies || !defenderSpecies) return { damage: 1, effectiveness: 1, crit: false };

    // Stat selection
    const isPhysical = move.category === 'PHYSICAL';
    const atkStat = isPhysical ? 'atk' : 'spAtk';
    const defStat = isPhysical ? 'def' : 'spDef';

    // Apply stat stages (crits ignore negative atk and positive def stages)
    const atkStages = statStages.attacker[atkStat] || 0;
    const defStages = statStages.defender[defStat] || 0;
    const A = Math.floor(attacker.stats[atkStat] * DG.stageMultiplier(atkStages));
    const D = Math.floor(defender.stats[defStat]  * DG.stageMultiplier(defStages));

    const level = attacker.level;
    const power = move.power;

    // Critical hit (base 1/16 ~6.25%, highCrit = 1/8, critStage boost)
    const critRoll = Math.random();
    const critStage = opts.critStage || 0;
    let critChance = critStage >= 2 ? 0.5 : critStage >= 1 ? 0.125 : 0.0625;
    if (move.highCrit) critChance = Math.min(0.5, critChance * 2);
    const crit = critRoll < critChance;
    const critMult = crit ? 1.5 : 1.0;

    // Type effectiveness
    const effectiveness = getEffectiveness(move.type, defenderSpecies.types);
    if (effectiveness === 0) return { damage: 0, effectiveness: 0, crit: false };

    // STAB
    const stab = hasSTAB(move.type, attackerSpecies.types) ? DG.BATTLE.STAB_BONUS : 1.0;

    // Random factor [0.85, 1.00]
    const random = DG.BATTLE.RANDOM_MIN + Math.random() * (1.0 - DG.BATTLE.RANDOM_MIN);

    // Base damage
    let damage = Math.floor(Math.floor(Math.floor(2 * level / 5 + 2) * power * A / D / 50) + 2);
    damage = Math.floor(damage * critMult * stab * effectiveness * random);

    // Burn: halves physical damage (unless Guts ability)
    const atkAbility = attackerSpecies.ability || '';
    if (isPhysical && attacker.statusEffect === 'BURN' && atkAbility !== 'Guts' && atkAbility !== 'Battle Armor') {
      damage = Math.floor(damage * 0.5);
    }

    // Ability bonus (attacker) — Blaze/Overgrow/Torrent/Guts etc.
    if (opts.abilityMult && opts.abilityMult !== 1) {
      damage = Math.floor(damage * opts.abilityMult);
    }

    // Ability modifier (defender) — Thick Fat etc.
    if (opts.defAbilityMult && opts.defAbilityMult !== 1) {
      damage = Math.floor(damage * opts.defAbilityMult);
    }

    // Weather modifiers — use WEATHER_EFFECTS table when available, else legacy fallback
    const weather = opts.weather;
    if (weather) {
      const wfxMv = DG.WEATHER_EFFECTS && DG.WEATHER_EFFECTS[weather];
      if (wfxMv) {
        const moveType = move.type;
        const bonus   = (wfxMv.moveBonus   || {})[moveType];
        const penalty = (wfxMv.movePenalty || {})[moveType];
        if (bonus)   damage = Math.floor(damage * bonus);
        if (penalty) damage = Math.floor(damage * penalty);
      } else {
        // Legacy fallback for moves that set old-style weather strings
        if (weather === 'RAIN') {
          if (move.type === 'WATER') damage = Math.floor(damage * 1.5);
          if (move.type === 'FIRE')  damage = Math.floor(damage * 0.5);
        } else if (weather === 'SUN') {
          if (move.type === 'FIRE')  damage = Math.floor(damage * 1.5);
          if (move.type === 'WATER') damage = Math.floor(damage * 0.5);
        }
      }
    }

    return { damage: Math.max(1, damage), effectiveness, crit };
  }

  // ── Accuracy Check ────────────────────────────────────────
  // Accuracy/evasion stages use the 3/3-based table (×0.33..×3.0), NOT the stat
  // stage table (×0.25..×4.0) — buffs/debuffs were slightly too extreme before.
  function _accStageMult(stage) {
    const s = Math.max(-6, Math.min(6, stage || 0));
    return s >= 0 ? (3 + s) / 3 : 3 / (3 - s);
  }

  function accuracyCheck(move, attackerAccStage, defenderEvaStage) {
    if (!move.accuracy || move.accuracy >= 999) return true; // always hits
    const accMult = _accStageMult(attackerAccStage || 0);
    const evaMult = _accStageMult(defenderEvaStage || 0);
    const finalAcc = Math.floor(move.accuracy * accMult / evaMult);
    return Math.floor(Math.random() * 100) < finalAcc;
  }

  console.log('[DinoMon] TypeChart loaded.');

  return { getEffectiveness, effectivenessLabel, hasSTAB, calcDamage, accuracyCheck };
})();

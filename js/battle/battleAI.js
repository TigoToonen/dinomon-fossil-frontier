// DinoMon: Fossil Frontier — battle/battleAI.js
// Enemy AI move selection (3 tiers)

window.DG = window.DG || {};

DG.BattleAI = (function () {

  // ── Tier 1: Random (wild DinoMons, weak trainers) ────────
  function tier1(activeMon) {
    const usable = activeMon.moves.filter(m => m.ppCurrent > 0);
    if (!usable.length) return { type: 'MOVE', moveIndex: -1 }; // struggle
    const idx = Math.floor(Math.random() * usable.length);
    return { type: 'MOVE', moveIndex: activeMon.moves.indexOf(usable[idx]) };
  }

  // Effective multiplier vs the target, including ability-based immunities/absorbs
  // (Levitate vs Ground, Flash Fire vs Fire, Volt Absorb/Lightning Rod vs Electric,
  // Water Absorb vs Water) so the AI never wastes a turn on a fully-absorbed move.
  function _effAgainst(move, targetMon) {
    const sp = DG.SPECIES[targetMon.speciesId];
    const defTypes = sp ? sp.types : ['NORMAL'];
    const eff = DG.TypeChart.getEffectiveness(move.type, defTypes);
    if (eff === 0) return 0;
    const ab = sp ? (sp.ability || '') : '';
    if (move.type === 'GROUND'   && ['Levitate','Hover','Air Body','Balloon'].includes(ab)) return 0;
    if (move.type === 'FIRE'     && ['Flash Fire','Inferno Shield'].includes(ab))            return 0;
    if (move.type === 'ELECTRIC' && ['Volt Absorb','Electric Sponge','Lightning Rod','Conductor'].includes(ab)) return 0;
    if (move.type === 'WATER'    && ['Water Absorb','Hydration'].includes(ab))               return 0;
    return eff;
  }

  // ── Tier 2: Effectiveness-weighted (mid trainers) ────────
  function tier2(activeMon, targetMon) {
    const usable = activeMon.moves.filter(m => m.ppCurrent > 0);
    if (!usable.length) return { type: 'MOVE', moveIndex: -1 };

    const scored = usable.map(slot => {
      const move = DG.MOVES[slot.moveId];
      if (!move) return { slot, score: 1 };
      let score = 1;
      if (move.category !== 'STATUS') {
        const eff = _effAgainst(move, targetMon);
        score = eff === 0 ? 0.05 : eff * (move.power || 40) / 80;
        // prefer super effective
        if (eff >= 2) score *= 2;
      } else {
        score = 0.6; // status moves get neutral weight
      }
      return { slot, score };
    });

    // weighted random pick
    const total = scored.reduce((s, x) => s + x.score, 0);
    let roll = Math.random() * total;
    for (const { slot, score } of scored) {
      roll -= score;
      if (roll <= 0) {
        return { type: 'MOVE', moveIndex: activeMon.moves.indexOf(slot) };
      }
    }
    // fallback
    return { type: 'MOVE', moveIndex: activeMon.moves.indexOf(scored[0].slot) };
  }

  // Ruwe schadeschatting van één move (zelfde formule als de oude tier3-check)
  function _roughDmg(attacker, defender, move) {
    if (!move || move.category === 'STATUS' || !(move.power > 0)) return 0;
    const eff = _effAgainst(move, defender);
    if (eff === 0) return 0;
    const atkTypes = (DG.SPECIES[attacker.speciesId] || {}).types || ['NORMAL'];
    const stab = atkTypes.includes(move.type) ? DG.BATTLE.STAB_BONUS : 1.0;
    return Math.floor((2 * attacker.level / 5 + 2) * move.power *
      (attacker.stats[move.category === 'PHYSICAL' ? 'atk' : 'spAtk'] || 50) /
      ((defender.stats[move.category === 'PHYSICAL' ? 'def' : 'spDef'] || 50) * 50) + 2) * eff * stab;
  }

  // ── Gedeelde move-scoring (basis voor tier 3 en 4) ───────
  // Geeft [{slot, score, roughDmg, move}] terug, ongesorteerd.
  function _scoreMoves(activeMon, targetMon, aiState) {
    const usable = activeMon.moves.filter(m => m.ppCurrent > 0);
    return usable.map(slot => {
      const move = DG.MOVES[slot.moveId];
      if (!move) return { slot, score: 0, roughDmg: 0, move: null };

      let score = 0, roughDmg = 0;
      // NOTE: move.effect is an OBJECT — read its .type (the old string compare never matched).
      const effType = (move.effect && move.effect.type) || 'NONE';

      if (move.category === 'STATUS') {
        const inflictsStatus = (effType === 'STATUS_CHANCE' || effType === 'PARALYSIS' ||
                                effType === 'SLEEP' || effType === 'BURN_CHANCE' || effType === 'POISON_CHANCE');
        if (inflictsStatus)      score = targetMon.statusEffect ? 2 : 55;   // don't re-status
        else if (effType === 'STAT_RAISE') score = (aiState && aiState.selfBoosted) ? 8 : 35;
        else if (effType === 'STAT_LOWER' || effType === 'STAT') score = 25;
        else if (effType === 'HEAL') score = (activeMon.hp.current < activeMon.hp.max * 0.45) ? 90 : 4;
        else score = 10;
      } else {
        const eff = _effAgainst(move, targetMon);
        if (eff === 0) return { slot, score: 0, roughDmg: 0, move };

        const atkTypes = (DG.SPECIES[activeMon.speciesId] || {}).types || ['NORMAL'];
        const stab = atkTypes.includes(move.type) ? DG.BATTLE.STAB_BONUS : 1.0;
        const power = move.power || 40;
        score = power * eff * stab;

        // Rough KO check: prefer a guaranteed finisher over overkill setup.
        roughDmg = _roughDmg(activeMon, targetMon, move);
        if (roughDmg >= targetMon.hp.current) score *= 1.5;

        // BATTLE-STRATEGY Fase 2e: vanguard-finish — als een priority-aanval
        // de KO haalt, gaat hij vóór alles (de snellere speler slaat dan nooit
        // meer terug). Ook zonder KO-garantie licht bonus tegen lage HP.
        if ((move.priority || 0) > 0) {
          if (roughDmg >= targetMon.hp.current) score *= 4;
          else if (targetMon.hp.current < targetMon.hp.max * 0.25) score *= 1.4;
        }

        // bonus for secondary effects
        if (effType === 'FLINCH')  score *= 1.1;
        if (effType === 'CONFUSE') score *= 1.1;
        if (effType === 'DRAIN')   score *= 1.15;
        // Avoid two-turn/recharge inefficiency unless it likely KOs
        if ((effType === 'TWO_TURN' || effType === 'RECHARGE') && roughDmg < targetMon.hp.current) score *= 0.7;
        // Avoid moves with recoil at low HP
        if (effType === 'RECOIL' && activeMon.hp.current < activeMon.hp.max * 0.3) {
          score *= 0.6;
        }
      }

      return { slot, score, roughDmg, move };
    });
  }

  // ── Tier 3: Scored optimal (gym leaders, late trainers) ──
  function tier3(activeMon, targetMon, aiState) {
    const scored = _scoreMoves(activeMon, targetMon, aiState);
    if (!scored.length) return { type: 'MOVE', moveIndex: -1 };

    scored.sort((a, b) => b.score - a.score);

    // Never pick zero-score (immune/absorbed) moves unless nothing else exists.
    const viable = scored.filter(x => x.score > 0);
    const pool   = viable.length ? viable : scored;

    // Tier 3 picks best 70% of the time, random from top 3 viable otherwise
    if (Math.random() < 0.7) {
      return { type: 'MOVE', moveIndex: activeMon.moves.indexOf(pool[0].slot) };
    }
    const top = pool.slice(0, Math.min(3, pool.length));
    const pick = top[Math.floor(Math.random() * top.length)];
    return { type: 'MOVE', moveIndex: activeMon.moves.indexOf(pick.slot) };
  }

  // ── BATTLE-STRATEGY Fase 4: Tier 4 — één beurt vooruitdenken ──
  // (E4/Champion/eindbazen.) Schat de sterkste klap van de tegenstander in en
  // weegt beurtvolgorde (snelheid + priority) mee: een dodelijke klap die éérst
  // landt wint altijd; setup terwijl de tegenstander jou deze beurt KO't is
  // zelfmoord; ruime HP-marge maakt status/setup juist aantrekkelijker.
  // Deterministisch beste keuze — geen 70%-dobbelsteen.
  function tier4(activeMon, targetMon, aiState) {
    const scored = _scoreMoves(activeMon, targetMon, aiState);
    if (!scored.length) return { type: 'MOVE', moveIndex: -1 };

    // Sterkste verwachte klap van de tegenstander (met diens priority)
    let theirBest = 0, theirBestPrio = 0;
    for (const mv of (targetMon.moves || [])) {
      if (!mv || mv.ppCurrent <= 0) continue;
      const m = DG.MOVES[mv.moveId];
      const dmg = _roughDmg(targetMon, activeMon, m);
      if (dmg > theirBest) { theirBest = dmg; theirBestPrio = m.priority || 0; }
    }
    const spdMult = (mon) => (DG.StatusEffects && DG.StatusEffects.speedMult) ? DG.StatusEffects.speedMult(mon) : 1;
    const theyOutspeed = (targetMon.stats.spd * spdMult(targetMon)) > (activeMon.stats.spd * spdMult(activeMon));
    const theyCanKO = theirBest >= activeMon.hp.current;

    for (const s of scored) {
      if (!s.move) continue;
      const prio = s.move.priority || 0;
      const actsFirst = prio > theirBestPrio || (prio === theirBestPrio && !theyOutspeed);
      // Dodelijke klap die vóór hun beurt landt → altijd doen
      if (s.roughDmg >= targetMon.hp.current && actsFirst) s.score *= 10;
      if (theyCanKO && theyOutspeed) {
        // Zij KO'en ons eerst: alleen wat vóór hen landt telt nog
        if (!actsFirst) s.score *= 0.1;
        if (s.move.category === 'STATUS') s.score *= 0.05;
      } else if (theirBest > 0 && activeMon.hp.current / theirBest >= 3 && s.move.category === 'STATUS') {
        // Ruime marge (3+ beurten overleven): investeren in status/setup loont
        s.score *= 1.4;
      }
    }

    scored.sort((a, b) => b.score - a.score);
    const viable = scored.filter(x => x.score > 0);
    const pool   = viable.length ? viable : scored;
    return { type: 'MOVE', moveIndex: activeMon.moves.indexOf(pool[0].slot) };
  }

  // ── Public: choose action for an AI trainer ─────────────
  // Returns { type:'MOVE', moveIndex:N }
  // aiState.badges (Fase 4): trainers schalen mee met de voortgang van de
  // speler — moeilijker wordt slímmer, niet alleen hoger van level.
  function chooseAction(trainer, activeMon, targetMon, aiState) {
    let tier = trainer ? (trainer.aiTier || 1) : 1;
    if (trainer) {
      const badges = (aiState && aiState.badges) || 0;
      if (badges >= 6)      tier = Math.max(tier, 3);
      else if (badges >= 3) tier = Math.max(tier, 2);
      // E4 en de Champion denken altijd één beurt vooruit
      if (trainer.class === 'Elite Four' || trainer.class === 'Champion') tier = 4;
    }
    // Hard mode: all enemies get +1 AI tier (capped at 4)
    if (window._CURRENT_DIFFICULTY === 'HARD') tier = Math.min(4, tier + 1);
    if (tier >= 4) return tier4(activeMon, targetMon, aiState);
    if (tier >= 3) return tier3(activeMon, targetMon, aiState);
    if (tier >= 2) return tier2(activeMon, targetMon);
    return tier1(activeMon);
  }

  // ── Choose best switch-in after a faint ─────────────────
  function chooseSwitchIn(trainerParty, targetMon) {
    const targetSpecies = DG.SPECIES[targetMon.speciesId];
    const defTypes = targetSpecies ? targetSpecies.types : ['NORMAL'];

    const alive = trainerParty.filter(m => m.hp.current > 0);
    if (!alive.length) return null;

    // score each available mon
    const scored = alive.map(mon => {
      const sp = DG.SPECIES[mon.speciesId];
      if (!sp) return { mon, score: 1 };
      // how effective can this mon be vs target?
      let best = 1;
      for (const mv of mon.moves) {
        const move = DG.MOVES[mv.moveId];
        if (!move || move.category === 'STATUS') continue;
        const eff = _effAgainst(move, targetMon);   // includes ability immunities
        if (eff > best) best = eff;
      }
      // also consider own defensive typing vs target moves
      let resist = 1;
      return { mon, score: best * (mon.hp.current / mon.hp.max) };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored[0].mon;
  }

  console.log('[DinoMon] BattleAI loaded.');

  return { chooseAction, chooseSwitchIn };
})();

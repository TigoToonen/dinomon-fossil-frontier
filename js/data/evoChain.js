// DinoMon: Fossil Frontier — data/evoChain.js
// EVO-STAGE (zie EVO-STAGE-PLAN.md): één waarheid voor "stage X van Y".
// Bouwt bij eerste gebruik een evolutie-graaf uit ALLE vijf bronnen:
// level (evolvesTo/evolvesAt), stenen, happiness, ruil en draag-items.

window.DG = window.DG || {};

DG.EvoChain = (function () {

  let _cache = null; // speciesId → { stage, total, chain, hows }

  function _pretty(id) {
    return String(id).toLowerCase().split('_')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }

  function _build() {
    _cache = {};
    const S = DG.SPECIES || {};

    // edges: from → Map(to → how-label). Insertie-volgorde = weergaveprioriteit.
    // Stenen gaan VÓÓR level: een level-edge naar hetzelfde doel als een steen
    // is in de game geblokkeerd (steen-only regel in battle.js/bagMenu.js),
    // dus dan is de steen het echte pad. Meerdere routes naar hetzelfde doel
    // (bv. MUDFIN → SWAMPJAW via steen/ruil/item) dedupliceren op target.
    const edges = {};
    const addEdge = (from, to, how) => {
      if (!S[from] || !S[to] || from === to) return;
      (edges[from] = edges[from] || new Map());
      if (!edges[from].has(to)) edges[from].set(to, how);
    };
    if (DG.STONE_EVOLUTIONS) for (const stone in DG.STONE_EVOLUTIONS) {
      const tbl = DG.STONE_EVOLUTIONS[stone];
      for (const from in tbl) addEdge(from, tbl[from], _pretty(stone));
    }
    for (const id in S) {
      const sp = S[id];
      if (sp.evolvesTo) addEdge(id, sp.evolvesTo, sp.evolvesAt ? ('Lv.' + sp.evolvesAt) : 'Level');
    }
    if (DG.HAPPINESS_EVOLUTIONS) for (const from in DG.HAPPINESS_EVOLUTIONS) {
      addEdge(from, DG.HAPPINESS_EVOLUTIONS[from].evolves, 'Friendship');
    }
    if (DG.TRADE_EVOLUTIONS) for (const from in DG.TRADE_EVOLUTIONS) {
      addEdge(from, DG.TRADE_EVOLUTIONS[from], 'Trade');
    }
    if (DG.HELD_ITEM_EVOLUTIONS) for (const from in DG.HELD_ITEM_EVOLUTIONS) {
      const e = DG.HELD_ITEM_EVOLUTIONS[from];
      addEdge(from, e.evolves, _pretty(e.item));
    }

    // parents: to → from (guard: eerste parent wint bij dubbele ouders)
    const parent = {};
    for (const from in edges) {
      for (const to of edges[from].keys()) {
        if (parent[to] === undefined) parent[to] = from;
      }
    }

    // Langste voorwaartse pad per node (memoized, met cyclus-guard)
    const fwd = {};
    function longestFwd(id, seen) {
      if (fwd[id] !== undefined) return fwd[id];
      seen = seen || new Set();
      if (seen.has(id)) return { len: 0, path: [], hows: [] };
      seen.add(id);
      let best = { len: 0, path: [], hows: [] };
      const m = edges[id];
      if (m) {
        for (const [to, how] of m) {
          const sub = longestFwd(to, seen);
          if (sub.len + 1 > best.len) {
            best = { len: sub.len + 1, path: [to].concat(sub.path), hows: [how].concat(sub.hows) };
          }
        }
      }
      seen.delete(id);
      fwd[id] = best;
      return best;
    }

    for (const id in S) {
      // Pad terug naar de wortel van de lijn
      const back = [id];
      const backHows = [];
      let cur = id, hops = 0;
      while (parent[cur] !== undefined && hops++ < 10) {
        const p = parent[cur];
        back.unshift(p);
        backHows.unshift((edges[p] && edges[p].get(cur)) || '?');
        cur = p;
      }
      const f = longestFwd(id);
      _cache[id] = {
        stage: back.length,           // 1-based positie vanaf de wortel
        total: back.length + f.len,   // langste lijn door deze soort heen
        chain: back.concat(f.path),   // volledige lijn (wortel → eind)
        hows:  backHows.concat(f.hows), // voorwaarde per stap (chain.length - 1)
      };
    }
  }

  // { stage, total, chain, hows } — total 1 = geen evolutielijn
  function get(speciesId) {
    if (!_cache) _build();
    return _cache[speciesId] || { stage: 1, total: 1, chain: [speciesId], hows: [] };
  }

  function all() {
    if (!_cache) _build();
    return _cache;
  }

  console.log('[DinoMon] EvoChain loaded — stage X/Y uit 5 evolutiebronnen.');

  return { get, all };

})();

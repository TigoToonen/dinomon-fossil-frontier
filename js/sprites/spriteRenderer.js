// DinoMon: Fossil Frontier — sprites/spriteRenderer.js
// Procedural canvas drawing for all DinoMons and map tiles
// v34 — Status effect auras on DinoMons, NPC sprite diversity (seeded per-position),
//        low-HP warning pulse, item pickup sparkle animation

window.DG = window.DG || {};

DG.SpriteRenderer = (function () {

  // ── Tile palette ──────────────────────────────────────────────
  const TILE_COLORS = {
    [0]:  '#b0a898', // FLOOR / PATH
    [1]:  '#5a8a3c', // GRASS
    [2]:  '#2d5a1b', // TALL_GRASS
    [3]:  '#1565c0', // WATER
    [4]:  '#c8b89a', // SAND
    [5]:  '#8b7355', // DIRT
    [6]:  '#d6eeff', // ICE
    [7]:  '#cc5520', // LAVA
    [8]:  '#3a5e40', // SWAMP / CAVE_FLOOR
    [9]:  '#a5d6a7', // FLOWER
    [64]: '#2e7d32', // TREE
    [65]: '#a08060', // WALL (building brick)
    [66]: '#555555', // MOUNTAIN
    [67]: '#7e6348', // SIGN
    [68]: '#7e6348', // DOOR
    [69]: '#37474f', // ROCK
    [70]: '#9c7b6e', // FENCE
    [71]: '#0d47a1', // WATER_EDGE
    [72]: '#4a5f6a', // CAVE_WALL
    [73]: '#6e8090', // STATUE
    [74]: '#e8d06a', // COUNTER
    [75]: '#4db6ac', // PC
    [76]: '#4caf50', // HEAL_PAD
    [77]: '#8B5E3C', // CHAIR
    [78]: '#6D4C2A', // TABLE
    [79]: '#1a1a2e', // TV screen
    [80]: '#c8a882', // BED frame
    [81]: '#5D3A1A', // BOOKSHELF
    [82]: '#2E7D32', // PLANT pot
  };

  // Seeded pseudo-random per tile position (deterministic, no flicker)
  function _tileRand(seed, n) {
    // Returns n values in [0,1) from a seed
    const out = [];
    let s = (seed * 9301 + 49297) % 233280;
    for (let i = 0; i < n; i++) {
      s = (s * 9301 + 49297) % 233280;
      out.push(s / 233280);
    }
    return out;
  }

  function drawTile(ctx, tileId, px, py, T, anim, edges) {
    const base = TILE_COLORS[tileId] || '#333';
    ctx.fillStyle = base;
    ctx.fillRect(px, py, T, T);

    // Tile pixel coords used as seed
    const tileX = Math.round(px / T), tileY = Math.round(py / T);
    const seed = tileX * 31 + tileY * 17;

    if (tileId === 67) {
      // ── Wooden signpost (route direction sign) ─────────────────
      // Neutral cleared-dirt base so it blends on both grass and sand routes.
      ctx.fillStyle = '#7a6a4a';
      ctx.fillRect(px, py, T, T);
      const scx = px + T / 2;
      // Ground shadow
      ctx.fillStyle = 'rgba(0,0,0,0.20)';
      ctx.beginPath(); ctx.ellipse(scx, py + T - 3, 7, 2.5, 0, 0, Math.PI * 2); ctx.fill();
      // Post
      ctx.fillStyle = '#6b4a24'; ctx.fillRect(scx - 2, py + 12, 4, T - 14);
      ctx.fillStyle = '#4f3518'; ctx.fillRect(scx + 1, py + 12, 1, T - 14);
      // Board
      ctx.fillStyle = '#b98a4e'; ctx.fillRect(px + 4, py + 5, T - 8, 11);
      ctx.fillStyle = '#d4a96a'; ctx.fillRect(px + 4, py + 5, T - 8, 2);
      ctx.strokeStyle = '#3a2a14'; ctx.lineWidth = 1; ctx.strokeRect(px + 4, py + 5, T - 8, 11);
      // Faux text lines on the board
      ctx.fillStyle = '#3a2a14';
      ctx.fillRect(px + 6, py + 8, T - 13, 1);
      ctx.fillRect(px + 6, py + 11, T - 16, 1);
      return;
    }

    if (tileId === 1) {
      // ── Regular grass — biome-aware ────────────────────────────
      const _thG1 = window.DG_MAP_THEME || 'DEFAULT';
      const rv = _tileRand(seed, 18);
      // Per-biome base, blade, highlight and accent colors + blade count/style
      const _GC1 = {
        AMBER:    { base:'#6a8c30', blade:'#3a6010', hi:'#8ab840', accent:'#d4a030', dots:true  },
        COASTAL:  { base:'#4f9a58', blade:'#2e7040', hi:'#78c478', accent:'#8ad08a', dots:false }, // FASE 12: van teal naar groen (las als water)
        DESERT:   { base:'#8a7838', blade:'#6a5820', hi:'#a89848', accent:'#c8b060', dots:false, sparse:true },
        VOLCANIC: { base:'#3a3828', blade:'#1a1c10', hi:'#4a4830', accent:'#706050', dots:false, scorched:true },
        FOREST:   { base:'#2a6020', blade:'#184010', hi:'#3a8030', accent:'#205818', dots:false, dense:true },
        SWAMP:    { base:'#3a5828', blade:'#2a4018', hi:'#4a7030', accent:'#8ab040', dots:false, algae:true },
        TUNDRA:   { base:'#7888a0', blade:'#5a6880', hi:'#9aaac0', accent:'#d0e8f8', dots:false, frost:true },
        SUMMIT:   { base:'#888090', blade:'#686070', hi:'#a8a0a8', accent:'#d8d0e0', dots:false, frost:true },
        MOUNTAIN: { base:'#5a7040', blade:'#3a5030', hi:'#6a8050', accent:'#8a9860', dots:false },
        GRANITE:  { base:'#4a6038', blade:'#303820', hi:'#5a7048', accent:'#708060', dots:false },
        DEFAULT:  { base:'#5a8a3c', blade:'#2d6e2d', hi:'#4aac4a', accent:'#4aac4a', dots:false },
      };
      const _gc1 = _GC1[_thG1] || _GC1.DEFAULT;
      // Override base color already drawn
      ctx.fillStyle = _gc1.base; ctx.fillRect(px, py, T, T);
      // Highlight stripe along top
      ctx.fillStyle = _gc1.hi; ctx.fillRect(px, py, T, 1);
      // Blade count: sparse in desert/frost, dense in forest
      const bladeCount = _gc1.sparse ? (2 + Math.floor(rv[0] * 2)) :
                         _gc1.dense  ? (6 + Math.floor(rv[0] * 4)) :
                         _gc1.frost  ? (3 + Math.floor(rv[0] * 2)) :
                                       (4 + Math.floor(rv[0] * 3));
      ctx.strokeStyle = _gc1.blade;
      for (let g = 0; g < bladeCount; g++) {
        const bx = px + rv[g * 2 + 1] * (T - 3) + 1;
        const bh = _gc1.frost ? (1 + rv[g * 2 + 2] * 2) : (3 + rv[g * 2 + 2] * 4);
        ctx.lineWidth = rv[g] > 0.5 ? 2 : 1;
        ctx.beginPath();
        ctx.moveTo(bx, py + T - 1);
        ctx.lineTo(bx + (rv[g] - 0.5) * 2, py + T - bh);
        ctx.stroke();
      }
      // Scorched: charred patch overlay for VOLCANIC
      if (_gc1.scorched && rv[16] > 0.5) {
        ctx.fillStyle = 'rgba(10,8,4,0.45)';
        ctx.beginPath();
        ctx.ellipse(px + rv[15]*(T-6)+3, py + rv[13]*(T-6)+3, 5, 3, 0, 0, Math.PI*2);
        ctx.fill();
      }
      // Frost crystals for TUNDRA/SUMMIT
      if (_gc1.frost) {
        ctx.fillStyle = 'rgba(220,240,255,0.7)';
        for (let f=0; f<3; f++) {
          const fx = px + rv[f*3+6]*(T-4)+2, fy = py + rv[f*3+7]*(T-4)+2;
          ctx.fillRect(fx, fy, 2, 2);
        }
      }
      // Algae patches for SWAMP
      if (_gc1.algae && rv[14] > 0.5) {
        ctx.fillStyle = 'rgba(120,180,20,0.4)';
        ctx.beginPath();
        ctx.ellipse(px + rv[15]*(T-6)+3, py + rv[13]*(T-6)+3, 5, 3, 0, 0, Math.PI*2);
        ctx.fill();
      }
      // Amber accent dots
      if (_gc1.dots && rv[14] > 0.55) {
        ctx.fillStyle = _gc1.accent;
        ctx.beginPath();
        ctx.arc(px + rv[15]*(T-4)+2, py + rv[13]*(T-4)+2, 1.5, 0, Math.PI*2);
        ctx.fill();
      }
      // Lighter patch for DEFAULT/non-special
      if (!_gc1.scorched && !_gc1.frost && !_gc1.algae && !_gc1.dots && rv[14] > 0.6) {
        ctx.fillStyle = _gc1.hi;
        ctx.beginPath();
        ctx.ellipse(px + rv[15]*(T-6)+3, py + rv[13]*(T-6)+3, 4, 2, 0, 0, Math.PI*2);
        ctx.fill();
      }

    } else if (tileId === 2) {
      // ── Tall grass — biome-aware animated blades ───────────────
      const _thTG2 = window.DG_MAP_THEME || 'DEFAULT';
      const _TGC2 = {
        AMBER:    { base:'#5a7c28', dark:'rgba(30,60,0,0.5)',   hi:'rgba(140,210,60,0.4)'  },
        COASTAL:  { base:'#3e8a4e', dark:'rgba(0,55,20,0.4)',   hi:'rgba(110,220,120,0.35)' }, // FASE 12
        DESERT:   { base:'#7a6828', dark:'rgba(60,40,0,0.5)',   hi:'rgba(160,140,50,0.3)'  },
        VOLCANIC: { base:'#282818', dark:'rgba(10,8,0,0.6)',    hi:'rgba(80,70,20,0.2)'    },
        FOREST:   { base:'#1a5018', dark:'rgba(0,30,0,0.55)',   hi:'rgba(80,180,40,0.4)'   },
        SWAMP:    { base:'#2a4818', dark:'rgba(0,25,0,0.5)',    hi:'rgba(100,160,20,0.4)'  },
        TUNDRA:   { base:'#6070A8', dark:'rgba(20,30,80,0.4)',  hi:'rgba(200,220,255,0.5)' },
        SUMMIT:   { base:'#707080', dark:'rgba(30,30,50,0.4)',  hi:'rgba(210,210,230,0.5)' },
        MOUNTAIN: { base:'#405030', dark:'rgba(10,20,0,0.45)',  hi:'rgba(100,140,60,0.35)' },
        GRANITE:  { base:'#384028', dark:'rgba(10,15,0,0.45)',  hi:'rgba(80,120,40,0.3)'   },
        DEFAULT:  { base:'#2d5a1b', dark:'rgba(0,0,0,0.3)',     hi:'rgba(100,200,50,0.4)'  },
      };
      const _tgc2 = _TGC2[_thTG2] || _TGC2.DEFAULT;
      ctx.fillStyle = _tgc2.base; ctx.fillRect(px, py, T, T);
      ctx.strokeStyle = _tgc2.dark;
      ctx.lineWidth = 1.2;
      for (let g = 0; g < 3; g++) {
        const sway = Math.sin(anim * 0.04 + g * 1.2) * 1.2;
        const gx = px + 5 + g * 8;
        ctx.beginPath();
        ctx.moveTo(gx, py + T);
        ctx.bezierCurveTo(gx + sway - 1, py + T - 9, gx + sway + 3, py + T - 16, gx + sway, py + 3);
        ctx.stroke();
      }
      ctx.strokeStyle = _tgc2.hi;
      ctx.lineWidth = 1;
      for (let g = 0; g < 2; g++) {
        const sway = Math.sin(anim * 0.04 + g * 2.1 + 0.5) * 1;
        const gx = px + 10 + g * 9;
        ctx.beginPath();
        ctx.moveTo(gx, py + T - 2);
        ctx.lineTo(gx + sway, py + 6);
        ctx.stroke();
      }
      // Top-edge highlight using hi color
      ctx.fillStyle = _tgc2.hi.replace('0.4','0.7').replace('0.5','0.7').replace('0.35','0.6');
      ctx.fillRect(px, py, T, 1);

    } else if (tileId === 0) {
      // ── Path / Floor — themed cobblestone (outdoor) or polished tile (indoor) ──
      const _th0 = window.DG_MAP_THEME || 'DEFAULT';
      const _rv0 = _tileRand(seed, 18);
      const _indoor0 = { LAB:1, CENTER:1, HOUSE:1, SHOP:1 }[_th0];
      if (_indoor0) {
        // Polished 2×2 tile grid with 1px grout lines
        const _tb0 = _th0==='CENTER'?'#c8d0e8':_th0==='LAB'?'#d0dce8':'#c8b890';
        const _tg0 = _th0==='CENTER'?'#8890b8':_th0==='LAB'?'#909aaa':'#a09070';
        ctx.fillStyle = _tg0; ctx.fillRect(px, py, T, T);
        for (let _tr0=0; _tr0<2; _tr0++) for (let _tc0=0; _tc0<2; _tc0++) {
          const _tx0=px+_tc0*16+1, _ty0=py+_tr0*16+1;
          ctx.fillStyle=_tb0; ctx.fillRect(_tx0,_ty0,14,14);
          ctx.fillStyle='rgba(255,255,255,0.18)';
          ctx.fillRect(_tx0,_ty0,14,2); ctx.fillRect(_tx0,_ty0,2,14);
          ctx.fillStyle='rgba(0,0,0,0.12)';
          ctx.fillRect(_tx0,_ty0+12,14,2); ctx.fillRect(_tx0+12,_ty0,2,14);
        }
      } else {
        // Outdoor paving — flat slabs with recessed seams so the ground reads as
        // GROUND (not a wall). Lighter, warmer per-biome palette than before.
        const _cbB0={AMBER:'#b89a64',COASTAL:'#9fa49a',DESERT:'#caa862',VOLCANIC:'#5c4c44',
          FOREST:'#8c7048',GRANITE:'#8a8a8c',MOUNTAIN:'#8c8478',SWAMP:'#5e6c4a',
          TUNDRA:'#aeb8c4',SUMMIT:'#d4d0c6',DEFAULT:'#9c968c'};   // seam/base colour
        const _cbS0={AMBER:'#cdb084',COASTAL:'#c2c6bc',DESERT:'#e2c684',VOLCANIC:'#705e54',
          FOREST:'#a4825a',GRANITE:'#a6a6a8',MOUNTAIN:'#a29888',SWAMP:'#76845a',
          TUNDRA:'#cad6e0',SUMMIT:'#ece8de',DEFAULT:'#b6b0a4'};   // slab face
        const _base0=_cbB0[_th0]||_cbB0.DEFAULT;
        const _slab0=_cbS0[_th0]||_cbS0.DEFAULT;
        ctx.fillStyle=_base0; ctx.fillRect(px,py,T,T);
        // 2×2 flat slabs inset by 1px; the base shows through as a thin seam
        for (let _r=0;_r<2;_r++) for (let _c=0;_c<2;_c++){
          const _sx=px+_c*16+1, _sy=py+_r*16+1, _sv0=_rv0[((_r*2+_c)*5+3)%18];
          ctx.fillStyle=_slab0; ctx.fillRect(_sx,_sy,14,14);
          // subtle per-slab brightness variation breaks the repeating look
          ctx.fillStyle=_sv0>0.5?'rgba(255,255,255,'+((_sv0-0.5)*0.16)+')':'rgba(0,0,0,'+((0.5-_sv0)*0.16)+')';
          ctx.fillRect(_sx,_sy,14,14);
          // flat top sheen (no big bevel — keeps it reading as flat ground)
          ctx.fillStyle='rgba(255,255,255,0.08)'; ctx.fillRect(_sx,_sy,14,1);
        }
        // darker recessed seam cross
        ctx.fillStyle='rgba(0,0,0,0.16)';
        ctx.fillRect(px+15,py,2,T); ctx.fillRect(px,py+15,T,2);
        // Occasional surface detail (moss / crack) so the ground isn't uniform
        const _dv0 = _rv0[15];
        if (_dv0 > 0.86) {
          ctx.fillStyle = _th0==='COASTAL' ? 'rgba(120,160,140,0.40)' : _th0==='DESERT' ? 'rgba(170,140,80,0.38)' : 'rgba(90,120,55,0.40)';
          ctx.fillRect(px + 4 + _rv0[14]*20, py + 5 + _rv0[13]*20, 3, 2);
          ctx.fillRect(px + 6 + _rv0[12]*18, py + 7 + _rv0[11]*18, 2, 2);
        } else if (_dv0 < 0.10) {
          ctx.strokeStyle = 'rgba(0,0,0,0.16)'; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(px + 5 + _rv0[10]*16, py + 5); ctx.lineTo(px + 7 + _rv0[9]*14, py + T - 5); ctx.stroke();
        }
        // FASE 12: padrand waar gras grenst — routes lezen als routes
        if (edges) {
          ctx.fillStyle = 'rgba(18,30,8,0.32)';
          if (edges & 1) ctx.fillRect(px, py, T, 2);
          if (edges & 4) ctx.fillRect(px, py + T - 2, T, 2);
          if (edges & 8) ctx.fillRect(px, py, 2, T);
          if (edges & 2) ctx.fillRect(px + T - 2, py, 2, T);
        }
      }

    } else if (tileId === 3) {
      // ── Water — gradient + animated sine ripples + foam dots ───
      const t = Date.now() / 1000;
      // Gradient base
      const grad = ctx.createLinearGradient(px, py, px, py + T);
      grad.addColorStop(0, '#2068c8'); // FASE 12: dieper/verzadigder blauw
      grad.addColorStop(1, '#0a3a78');
      ctx.fillStyle = grad;
      ctx.fillRect(px, py, T, T);
      // Light shimmer at top
      ctx.fillStyle = 'rgba(100,180,255,0.18)';
      ctx.fillRect(px, py, T, T * 0.28);
      // 2-3 horizontal sine-wave ripple lines
      const freq = 0.32, amp = 1.8;
      ctx.strokeStyle = 'rgba(100,180,255,0.3)';
      ctx.lineWidth = 1;
      for (let w = 0; w < 3; w++) {
        const baseY = py + T * (0.25 + w * 0.25);
        const phase = t * (0.9 + w * 0.3) + px * 0.03;
        ctx.beginPath();
        for (let rx = 0; rx <= T; rx += 2) {
          const wy = baseY + Math.sin(rx * freq + phase) * amp;
          rx === 0 ? ctx.moveTo(px + rx, wy) : ctx.lineTo(px + rx, wy);
        }
        ctx.stroke();
        // Foam dot at wave peak
        const peakX = px + (((w * 7 + Math.floor(t * 0.7)) % T));
        const peakY = baseY + Math.sin(peakX * freq + phase) * amp - 1;
        if (Math.sin(peakX * freq + phase) > 0.6) {
          ctx.fillStyle = 'rgba(255,255,255,0.4)';
          ctx.beginPath();
          ctx.arc(peakX, peakY, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      // FASE 11: zonneglinster die periodiek over het water oplicht
      {
        const gph = (t * 0.45 + ((tileX * 7 + tileY * 13) % 10)) % 10;
        if (gph < 0.7) {
          ctx.fillStyle = 'rgba(255,255,255,' + (0.55 * (1 - gph / 0.7)).toFixed(2) + ')';
          ctx.fillRect(px + ((seed * 5) % (T - 8)) + 3, py + ((seed * 3) % (T - 9)) + 4, 5, 2);
        }
      }
      // FASE 12: oever-randen — donkere waterlijn + geanimeerde schuimrand
      // aan elke kant waar land grenst → water leest direct als water
      if (edges) {
        const fph = Math.floor(t * 3) % 3;
        ctx.fillStyle = 'rgba(5,28,58,0.65)';
        if (edges & 1) ctx.fillRect(px, py, T, 2);
        if (edges & 4) ctx.fillRect(px, py + T - 2, T, 2);
        if (edges & 8) ctx.fillRect(px, py, 2, T);
        if (edges & 2) ctx.fillRect(px + T - 2, py, 2, T);
        ctx.fillStyle = 'rgba(228,244,255,0.8)';
        if (edges & 1) { ctx.fillRect(px, py + 2, T, 2);
          for (let fd = 0; fd < 3; fd++) ctx.fillRect(px + ((fd * 11 + fph * 4) % (T - 4)) + 1, py + 4, 3, 1); }
        if (edges & 4) { ctx.fillRect(px, py + T - 4, T, 2);
          for (let fd = 0; fd < 3; fd++) ctx.fillRect(px + ((fd * 11 + fph * 4) % (T - 4)) + 1, py + T - 5, 3, 1); }
        if (edges & 8) { ctx.fillRect(px + 2, py, 2, T);
          for (let fd = 0; fd < 2; fd++) ctx.fillRect(px + 4, py + ((fd * 13 + fph * 5) % (T - 3)) + 1, 1, 3); }
        if (edges & 2) { ctx.fillRect(px + T - 4, py, 2, T);
          for (let fd = 0; fd < 2; fd++) ctx.fillRect(px + T - 5, py + ((fd * 13 + fph * 5) % (T - 3)) + 1, 1, 3); }
      }

    } else if (tileId === 70) {
      // ── FASE 12: houten hek — gras-basis + paaltjes en latten ──
      ctx.fillStyle = '#5a8a3c'; ctx.fillRect(px, py, T, T);
      ctx.fillStyle = '#4a7430'; ctx.fillRect(px, py + T - 4, T, 4);
      // latten (doorlopend zodat aangrenzende hekken visueel koppelen)
      ctx.fillStyle = '#9a6f3f';
      ctx.fillRect(px, py + 9, T, 4);
      ctx.fillRect(px, py + 18, T, 4);
      ctx.fillStyle = 'rgba(60,35,12,0.5)';
      ctx.fillRect(px, py + 11, T, 2);
      ctx.fillRect(px, py + 20, T, 2);
      // paaltjes met lichtkant en punt
      for (let fp = 0; fp < 2; fp++) {
        const fxp = px + 4 + fp * 16;
        ctx.fillStyle = '#7a5226'; ctx.fillRect(fxp, py + 4, 6, 23);
        ctx.fillStyle = '#a87c4a'; ctx.fillRect(fxp, py + 4, 2, 23);
        ctx.fillStyle = '#4a3014'; ctx.fillRect(fxp, py + 25, 6, 2);
        ctx.fillStyle = '#7a5226'; ctx.fillRect(fxp + 1, py + 2, 4, 3);
      }

    } else if (tileId === 4) {
      // ── Sand — biome-aware: desert ripples, coastal wet sand ───
      const _thS4 = window.DG_MAP_THEME || 'DEFAULT';
      const rv = _tileRand(seed, 14);
      if (_thS4 === 'DESERT') {
        // Desert: wind-ribbed sand with darker ripple troughs
        ctx.fillStyle = '#c8a840'; ctx.fillRect(px, py, T, T);
        // Ripple ridges (sine-based horizontal bands)
        for (let _r4=0; _r4<4; _r4++) {
          const _ry4 = py + 4 + _r4*8 + Math.floor(rv[_r4]*3)-1;
          ctx.fillStyle = 'rgba(160,120,20,0.35)'; ctx.fillRect(px, _ry4, T, 2);
          ctx.fillStyle = 'rgba(240,200,80,0.3)';  ctx.fillRect(px, _ry4-1, T, 1);
        }
        // Scattered grains
        ctx.fillStyle = 'rgba(100,80,10,0.4)';
        for (let s=0; s<5; s++) {
          ctx.beginPath();
          ctx.arc(px+rv[s*2+4]*T, py+rv[s*2+5]*T, 0.7, 0, Math.PI*2); ctx.fill();
        }
      } else if (_thS4 === 'COASTAL') {
        // Coastal: darker wet sand with damp sheen
        ctx.fillStyle = '#a09070'; ctx.fillRect(px, py, T, T);
        ctx.fillStyle = 'rgba(60,80,90,0.2)'; ctx.fillRect(px, py, T, T);
        // Wet sheen highlight
        if (rv[0] > 0.5) {
          ctx.fillStyle = 'rgba(140,180,200,0.25)';
          ctx.beginPath(); ctx.ellipse(px+rv[1]*(T-8)+4, py+rv[2]*(T-8)+4, 6, 3, rv[3]*1.5, 0, Math.PI*2); ctx.fill();
        }
        // Tiny shell fragments
        ctx.fillStyle = 'rgba(230,220,200,0.6)';
        for (let s=0; s<3; s++) { ctx.fillRect(px+Math.floor(rv[s*2+4]*T), py+Math.floor(rv[s*2+5]*T), 2, 1); }
      } else {
        // Default sand speckle
        ctx.fillStyle = '#b8a060'; ctx.fillRect(px, py, T, T);
        const sc = 2 + Math.floor(rv[0] * 3);
        ctx.fillStyle = 'rgba(90,70,10,0.4)';
        for (let s = 0; s < sc; s++) {
          ctx.beginPath();
          ctx.arc(px + rv[s * 2 + 1] * T, py + rv[s * 2 + 2] * T, 0.7, 0, Math.PI * 2); ctx.fill();
        }
      }

    } else if (tileId === 5) {
      // ── Dirt / Floor — wooden planks (indoor) or earthy dirt/stone (outdoor) ──
      const _th5 = window.DG_MAP_THEME || 'DEFAULT';
      const _rv5 = _tileRand(seed, 14);
      const _isIn5 = { LAB:1, CENTER:1, HOUSE:1, SHOP:1 }[_th5];
      if (_isIn5) {
        // Horizontal wooden plank floor, colour-coded per room type
        const _wpB5=_th5==='CENTER'?'#5a6888':_th5==='LAB'?'#6878a0':'#7a5530';
        const _wpP5=_th5==='CENTER'?'#8898c0':_th5==='LAB'?'#90a4c0':'#b07848';
        const _wpG5=_th5==='CENTER'?'#48587a':_th5==='LAB'?'#586088':'#5a3820';
        ctx.fillStyle=_wpB5; ctx.fillRect(px,py,T,T);
        for (let _pl5=0; _pl5<4; _pl5++) {
          const _py5=py+_pl5*8;
          ctx.fillStyle=_wpP5; ctx.fillRect(px,_py5,T,7);
          ctx.fillStyle='rgba(0,0,0,0.07)';
          ctx.fillRect(px,_py5+2,T,1); ctx.fillRect(px,_py5+5,T,1);
          ctx.fillStyle=_wpG5; ctx.fillRect(px,_py5+7,T,1);
          ctx.fillStyle='rgba(255,255,255,0.1)'; ctx.fillRect(px,_py5,T,1);
        }
        // Staggered vertical joints every other plank
        ctx.fillStyle=_wpG5;
        for (let _pl5=0;_pl5<4;_pl5++) {
          if (_pl5%2===1) ctx.fillRect(px+8+Math.floor(_rv5[_pl5]*8), py+_pl5*8, 1, 7);
        }
      } else {
        // Outdoor stone/dirt floor with scattered texture
        const _dB5={VOLCANIC:'#1e0c0c',DESERT:'#b08840',FOREST:'#483420',SWAMP:'#283818',
          GRANITE:'#484848',MOUNTAIN:'#504840',AMBER:'#9a7848',COASTAL:'#5a7080',
          TUNDRA:'#7888a0',SUMMIT:'#c4bca8',DEFAULT:'#8b7355'}[_th5]||'#8b7355';
        const _dS5={VOLCANIC:'#341418',DESERT:'#c8a050',FOREST:'#604028',SWAMP:'#384428',
          GRANITE:'#686868',MOUNTAIN:'#706060',AMBER:'#b09060',COASTAL:'#6a8898',
          TUNDRA:'#9aaab8',SUMMIT:'#dcd8cc',DEFAULT:'#a0886a'}[_th5]||'#a0886a';
        ctx.fillStyle=_dB5; ctx.fillRect(px,py,T,T);
        ctx.fillStyle=_dS5;
        for (let _s5=0; _s5<4; _s5++) {
          ctx.beginPath();
          ctx.arc(px+2+_rv5[_s5*3]*(T-4), py+2+_rv5[_s5*3+1]*(T-4),
                  0.8+_rv5[_s5*3+2]*1.5, 0, Math.PI*2);
          ctx.fill();
        }
      }

    } else if (tileId === 6) {
      // ── Ice — hexagonal crystals, barst-lijnen, sneeuwlaag ─────
      const _rv6 = _tileRand(seed, 18);
      // Gradient blue-white base
      const _ig6 = ctx.createLinearGradient(px, py, px+T, py+T);
      _ig6.addColorStop(0, '#c0d8f8'); _ig6.addColorStop(1, '#88b8e8');
      ctx.fillStyle = _ig6; ctx.fillRect(px, py, T, T);
      // Crystal facets: 3 seeded polygons
      for (let _c6=0; _c6<3; _c6++) {
        const _cx6 = px + 4 + Math.floor(_rv6[_c6*4]*22);
        const _cy6 = py + 4 + Math.floor(_rv6[_c6*4+1]*22);
        const _cr6 = 3 + Math.floor(_rv6[_c6*4+2]*4);
        ctx.strokeStyle = 'rgba(180,220,255,0.7)'; ctx.lineWidth = 0.8;
        ctx.beginPath();
        for (let _s6=0; _s6<6; _s6++) {
          const _a6 = _s6*Math.PI/3 + _rv6[_c6*4+3]*0.5;
          const _fx6 = _cx6 + Math.cos(_a6)*_cr6, _fy6 = _cy6 + Math.sin(_a6)*_cr6;
          _s6===0 ? ctx.moveTo(_fx6,_fy6) : ctx.lineTo(_fx6,_fy6);
        }
        ctx.closePath(); ctx.stroke();
        // Crystal highlight
        ctx.fillStyle = 'rgba(230,248,255,0.45)';
        ctx.beginPath(); ctx.arc(_cx6-1,_cy6-1,_cr6*0.4,0,Math.PI*2); ctx.fill();
      }
      // Hairline cracks
      ctx.strokeStyle = 'rgba(120,180,230,0.5)'; ctx.lineWidth = 0.6;
      for (let _k6=0; _k6<2; _k6++) {
        const _kx6=px+Math.floor(_rv6[12+_k6*2]*(T-4))+2;
        ctx.beginPath(); ctx.moveTo(_kx6,py);
        ctx.lineTo(_kx6+Math.floor(_rv6[13+_k6*2]*6)-3, py+T); ctx.stroke();
      }
      // Snow flurry specks on top
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      for (let _sp6=0; _sp6<5; _sp6++) {
        ctx.fillRect(px+Math.floor(_rv6[_sp6]*T), py+Math.floor(_rv6[_sp6+5]*T), 1, 1);
      }
      // Top-left specular glint
      ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.fillRect(px+1,py+1,4,1); ctx.fillRect(px+1,py+1,1,4);

    } else if (tileId === 8) {
      // ── Swamp / Cave floor — modder, algen, luchtbellen ─────────
      const _rv8 = _tileRand(seed, 16);
      const _thSW8 = window.DG_MAP_THEME || 'DEFAULT';
      const _swB8 = _thSW8==='VOLCANIC'?'#1a0c08':'#283818';
      const _swM8 = _thSW8==='VOLCANIC'?'#3a1808':'#3a5028';
      ctx.fillStyle = _swB8; ctx.fillRect(px, py, T, T);
      // Mud pools: 2 seeded ellipses
      for (let _mp8=0; _mp8<2; _mp8++) {
        const _mpx8=px+3+Math.floor(_rv8[_mp8*4]*18);
        const _mpy8=py+3+Math.floor(_rv8[_mp8*4+1]*18);
        ctx.fillStyle = _thSW8==='VOLCANIC'?'rgba(80,20,0,0.5)':'rgba(40,60,20,0.55)';
        ctx.beginPath(); ctx.ellipse(_mpx8,_mpy8,5+_rv8[_mp8*4+2]*4,3+_rv8[_mp8*4+3]*2,
          _rv8[_mp8]*1.2,0,Math.PI*2); ctx.fill();
      }
      // Algae/slick streaks
      ctx.strokeStyle = _thSW8==='VOLCANIC'?'rgba(180,60,0,0.3)':'rgba(80,180,20,0.35)';
      ctx.lineWidth = 1;
      for (let _al8=0; _al8<3; _al8++) {
        ctx.beginPath();
        ctx.moveTo(px+_rv8[8+_al8]*T, py+_rv8[9+_al8]*T);
        ctx.lineTo(px+_rv8[10+_al8]*(T-4)+2, py+_rv8[11+_al8]*(T-4)+2); ctx.stroke();
      }
      // Animated air bubbles
      const _bph8 = (anim*0.05 + seed*0.3) % (Math.PI*2);
      for (let _b8=0; _b8<2; _b8++) {
        const _bx8 = px+4+Math.floor(_rv8[_b8*2]*22);
        const _by8 = py+4+Math.floor(((Math.sin(_bph8+_b8*1.5)*0.5+0.5))*(T-8));
        ctx.strokeStyle = _thSW8==='VOLCANIC'?'rgba(255,120,0,0.5)':'rgba(120,220,80,0.5)';
        ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.arc(_bx8, _by8, 2, 0, Math.PI*2); ctx.stroke();
      }
      // Lily pad (non-volcanic only)
      if (_thSW8 !== 'VOLCANIC' && _rv8[15] > 0.55) {
        const _lpx8=px+Math.floor(_rv8[14]*14)+3, _lpy8=py+Math.floor(_rv8[13]*14)+3;
        ctx.fillStyle='rgba(50,130,30,0.75)';
        ctx.beginPath(); ctx.arc(_lpx8,_lpy8,5,0,Math.PI*2); ctx.fill();
        ctx.fillStyle='rgba(0,0,0,0.2)';
        ctx.beginPath(); ctx.moveTo(_lpx8,_lpy8); ctx.lineTo(_lpx8+3,_lpy8-5); ctx.stroke();
      }

    } else if (tileId === 7) {
      // Lava — animated glow
      const pulse = 0.6 + 0.4 * Math.sin(anim * 0.07 + px * 0.1);
      ctx.fillStyle = `rgba(255,${Math.floor(120 * pulse)},0,0.4)`;
      ctx.fillRect(px, py, T, T);
      ctx.fillStyle = `rgba(255,200,0,${0.2 * pulse})`;
      ctx.fillRect(px + 4, py + 6, T - 8, T - 12);
    } else if (tileId === 64) {
      // ── Tree — 6 biome-specific types ──────────────────────────
      const _thT64 = window.DG_MAP_THEME || 'DEFAULT';
      const _cx64 = px + T/2, _cy64 = py + T/2;
      // Ground shadow for all types
      ctx.fillStyle = 'rgba(0,0,0,0.18)';
      ctx.beginPath(); ctx.ellipse(_cx64+2, py+T-2, T/2-2, 4, 0, 0, Math.PI*2); ctx.fill();

      if (_thT64 === 'COASTAL') {
        // 🌴 Palm tree — slender curved trunk, fan of fronds
        ctx.fillStyle = '#7a5c2a';
        ctx.fillRect(_cx64-2, py+T-14, 4, 14);
        ctx.fillStyle = '#6a4c1e'; ctx.fillRect(_cx64-1, py+T-13, 2, 12);
        // Coconuts
        ctx.fillStyle = '#5a3810';
        ctx.beginPath(); ctx.arc(_cx64-1, py+10, 3, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(_cx64+3, py+8, 2.5, 0, Math.PI*2); ctx.fill();
        // Fronds radiating outward
        ctx.strokeStyle = '#2a7a18'; ctx.lineWidth = 1.5;
        const _fronds64 = [[0,-9],[-9,-6],[9,-5],[-8,0],[8,1],[-5,4],[5,5]];
        for (const [_fx,_fy] of _fronds64) {
          ctx.beginPath();
          ctx.moveTo(_cx64, py+8);
          ctx.quadraticCurveTo(_cx64+_fx*0.5, py+8+_fy*0.5, _cx64+_fx, py+8+_fy);
          ctx.stroke();
        }
        ctx.strokeStyle = '#3a9020'; ctx.lineWidth = 0.8;
        for (const [_fx,_fy] of _fronds64) {
          ctx.beginPath(); ctx.moveTo(_cx64+_fx*0.4, py+8+_fy*0.4);
          ctx.lineTo(_cx64+_fx+(_fy>0?2:-2), py+8+_fy+1); ctx.stroke();
        }

      } else if (_thT64 === 'DESERT') {
        // 🌵 Cactus — thick green body with arms and spines
        // Main body
        ctx.fillStyle = '#2a7a30';
        ctx.fillRect(_cx64-5, py+4, 10, T-6);
        ctx.fillStyle = '#1e6024';
        ctx.fillRect(_cx64-5, py+5, 2, T-8); ctx.fillRect(_cx64+3, py+5, 2, T-8);
        // Ribbed texture
        ctx.strokeStyle = 'rgba(30,80,30,0.4)'; ctx.lineWidth = 0.7;
        for (let _rb=0;_rb<4;_rb++) { ctx.beginPath(); ctx.moveTo(_cx64,py+6+_rb*6); ctx.lineTo(_cx64,py+9+_rb*6); ctx.stroke(); }
        // Left arm
        ctx.fillStyle = '#2a7a30';
        ctx.fillRect(_cx64-10, py+12, 6, 7);
        ctx.fillRect(_cx64-10, py+8, 4, 5);
        // Right arm
        ctx.fillRect(_cx64+4, py+10, 6, 7);
        ctx.fillRect(_cx64+6, py+6, 4, 5);
        // Spines
        ctx.strokeStyle = '#e8d880'; ctx.lineWidth = 0.7;
        const _spines64 = [[-5,8],[-5,14],[-5,20],[5,8],[5,14],[5,20],[-10,14],[10,14]];
        for (const [_sx,_sy] of _spines64) {
          ctx.beginPath(); ctx.moveTo(_cx64+_sx, py+_sy);
          ctx.lineTo(_cx64+_sx+(_sx<0?-3:3), py+_sy-2); ctx.stroke();
        }
        // Top flower
        ctx.fillStyle = '#ff6090';
        ctx.beginPath(); ctx.arc(_cx64, py+3, 3, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#ffe040';
        ctx.beginPath(); ctx.arc(_cx64, py+3, 1.5, 0, Math.PI*2); ctx.fill();

      } else if (_thT64 === 'VOLCANIC') {
        // 🌑 Dead tree — charred bare trunk + forked branches, no leaves
        ctx.fillStyle = '#1c1408';
        ctx.fillRect(_cx64-3, py+8, 6, T-8); // trunk
        ctx.fillStyle = '#0e0c06'; ctx.fillRect(_cx64-1, py+9, 2, T-10);
        // Main branch left
        ctx.strokeStyle = '#201808'; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.moveTo(_cx64, py+10);
        ctx.lineTo(_cx64-8, py+4); ctx.lineTo(_cx64-12, py+2); ctx.stroke();
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(_cx64-8, py+4);
        ctx.lineTo(_cx64-6, py+1); ctx.stroke();
        // Main branch right
        ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.moveTo(_cx64, py+12);
        ctx.lineTo(_cx64+7, py+5); ctx.lineTo(_cx64+11, py+2); ctx.stroke();
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(_cx64+7, py+5);
        ctx.lineTo(_cx64+5, py+2); ctx.stroke();
        // Ash particles (tiny flecks)
        ctx.fillStyle = 'rgba(160,140,100,0.5)';
        const _rv64v = _tileRand(seed, 8);
        for (let _a=0;_a<3;_a++) { ctx.fillRect(px+Math.floor(_rv64v[_a]*T), py+Math.floor(_rv64v[_a+3]*(T-4))+2, 1, 1); }
        // Ember glow at trunk base
        const _ep64 = 0.3+0.25*Math.sin((anim||0)*0.09+seed*0.2);
        ctx.fillStyle=`rgba(255,80,0,${_ep64})`;
        ctx.beginPath(); ctx.ellipse(_cx64, py+T-4, 4, 2, 0, 0, Math.PI*2); ctx.fill();

      } else if (_thT64 === 'FOREST') {
        // 🌳 Ancient forest tree — massive wide canopy, ivy on trunk
        ctx.fillStyle = 'rgba(0,0,0,0.22)';
        ctx.beginPath(); ctx.ellipse(_cx64+3, py+T-1, T/2, 5, 0, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#3d2208';
        ctx.fillRect(_cx64-4, py+T-14, 8, 14);
        // Ivy stripes on trunk
        ctx.strokeStyle = '#2a6018'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(_cx64-3, py+T-14); ctx.bezierCurveTo(_cx64-2,py+T-10,_cx64+2,py+T-7,_cx64-1,py+T-2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(_cx64+2, py+T-13); ctx.bezierCurveTo(_cx64+3,py+T-9,_cx64,py+T-6,_cx64+2,py+T-2); ctx.stroke();
        // Wide outer canopy shadow
        ctx.fillStyle = '#0d3c0a';
        ctx.beginPath(); ctx.ellipse(_cx64, _cy64-3, T/2+1, T/2, 0, 0, Math.PI*2); ctx.fill();
        // Main dark canopy
        ctx.fillStyle = '#1d5c1a';
        ctx.beginPath(); ctx.ellipse(_cx64, _cy64-4, T/2-1, T/2-2, 0, 0, Math.PI*2); ctx.fill();
        // Mid canopy lighter
        ctx.fillStyle = '#2d7828';
        ctx.beginPath(); ctx.ellipse(_cx64-2, _cy64-7, T/2-4, T/2-5, 0, 0, Math.PI*2); ctx.fill();
        // Highlight blob
        ctx.fillStyle = 'rgba(80,180,50,0.3)';
        ctx.beginPath(); ctx.ellipse(_cx64-6, _cy64-11, 7, 4, -0.4, 0, Math.PI*2); ctx.fill();
        // Hanging moss tendrils
        ctx.strokeStyle = 'rgba(40,100,20,0.5)'; ctx.lineWidth = 0.8;
        for (let _m=0;_m<4;_m++) {
          const _mx=_cx64+(_m-2)*7;
          ctx.beginPath(); ctx.moveTo(_mx, _cy64+1); ctx.lineTo(_mx+1, _cy64+6); ctx.stroke();
        }

      } else if (_thT64 === 'SWAMP') {
        // 🌿 Willow tree — draping leaf curtains, wading roots
        ctx.fillStyle = '#3a2810';
        ctx.fillRect(_cx64-3, py+4, 6, T-4);
        ctx.fillStyle = '#2a1c08'; ctx.fillRect(_cx64-1, py+5, 2, T-6);
        // Drooping branch curtains
        ctx.strokeStyle = '#4a7820'; ctx.lineWidth = 1;
        for (let _w=0;_w<5;_w++) {
          const _wx=_cx64+(_w-2)*8;
          const _wlen = 10 + ((_w+seed)%3)*4;
          ctx.beginPath();
          ctx.moveTo(_wx, py+6);
          ctx.bezierCurveTo(_wx-2, py+6+_wlen*0.4, _wx+3, py+6+_wlen*0.7, _wx-1, py+6+_wlen);
          ctx.stroke();
          // Leaf clusters on drape
          ctx.fillStyle = '#5a9828';
          for (let _lc=0;_lc<3;_lc++) {
            ctx.beginPath(); ctx.ellipse(_wx+(_lc-1)*2, py+8+_lc*(_wlen/3), 3, 2, 0.3, 0, Math.PI*2); ctx.fill();
          }
        }
        // Gnarled canopy base
        ctx.fillStyle = '#1a4c10';
        ctx.beginPath(); ctx.ellipse(_cx64, py+8, 13, 7, 0, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#2a6818';
        ctx.beginPath(); ctx.ellipse(_cx64-1, py+7, 11, 5, 0, 0, Math.PI*2); ctx.fill();
        // Swamp root bumps at base
        ctx.fillStyle = '#4a3010';
        for (let _r=0;_r<3;_r++) { ctx.beginPath(); ctx.ellipse(_cx64+(_r-1)*7, py+T-1, 4, 3, 0, 0, Math.PI*2); ctx.fill(); }

      } else if (_thT64 === 'TUNDRA' || _thT64 === 'SUMMIT' || _thT64 === 'MOUNTAIN') {
        // 🌲 Spruce / Pine — triangular pyramid, snow on branches
        ctx.fillStyle = '#4a3018';
        ctx.fillRect(_cx64-2, py+T-8, 4, 8);
        // 3-tier pyramid canopy (bottom widest)
        const _tiers64 = [[T*0.48, T-10, 8],[T*0.38, T-16, 7],[T*0.26, T-22, 6]];
        for (const [_tw,_ty,_th] of _tiers64) {
          ctx.fillStyle = '#1a4c20';
          ctx.beginPath(); ctx.moveTo(_cx64-_tw, py+_ty+_th); ctx.lineTo(_cx64, py+_ty-2); ctx.lineTo(_cx64+_tw, py+_ty+_th); ctx.closePath(); ctx.fill();
          ctx.fillStyle = '#24622a';
          ctx.beginPath(); ctx.moveTo(_cx64-_tw+2, py+_ty+_th); ctx.lineTo(_cx64, py+_ty); ctx.lineTo(_cx64+_tw-2, py+_ty+_th); ctx.closePath(); ctx.fill();
          // Snow on branches
          ctx.fillStyle = 'rgba(230,245,255,0.85)';
          ctx.beginPath(); ctx.moveTo(_cx64-_tw+2, py+_ty+_th-1); ctx.lineTo(_cx64-4, py+_ty+2); ctx.lineTo(_cx64+4, py+_ty+2); ctx.lineTo(_cx64+_tw-2, py+_ty+_th-1); ctx.closePath(); ctx.fill();
        }
        // Top snow tip
        ctx.fillStyle = 'rgba(240,250,255,0.9)';
        ctx.beginPath(); ctx.arc(_cx64, py+2, 2.5, 0, Math.PI*2); ctx.fill();

      } else {
        // 🌳 DEFAULT — original oak-style tree
        ctx.fillStyle = '#5c3d1e'; ctx.fillRect(_cx64-3, py+T-11, 6, 11);
        ctx.fillStyle = '#4a2e10'; ctx.fillRect(_cx64-1, py+T-10, 1, 8);
        ctx.fillStyle = '#1a5220';
        ctx.beginPath(); ctx.ellipse(_cx64, _cy64-2, T/2, T/2-1, 0, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#2d6b2d';
        ctx.beginPath(); ctx.ellipse(_cx64, _cy64-3, T/2-2, T/2-3, 0, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#3d8b3d';
        ctx.beginPath(); ctx.ellipse(_cx64-1, _cy64-6, T/2-5, T/2-7, 0, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = 'rgba(130,220,100,0.28)';
        ctx.beginPath(); ctx.ellipse(_cx64-5, _cy64-9, 6, 4, -0.4, 0, Math.PI*2); ctx.fill();
      }

    } else if (tileId === 69) {
      // ── Rock / Boulder — rounded grey with highlight & shadow ───
      const rw = T * 0.75, rh = T * 0.6;
      const rx = px + T/2, ry = py + T * 0.6;
      // Ground shadow
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.beginPath(); ctx.ellipse(rx + 1, ry + 2, rw/2 - 1, 4, 0, 0, Math.PI*2); ctx.fill();
      // Dark outline
      ctx.fillStyle = '#666666';
      ctx.beginPath(); ctx.ellipse(rx, ry, rw/2 + 1, rh/2 + 1, 0, 0, Math.PI*2); ctx.fill();
      // Main body
      ctx.fillStyle = '#888888';
      ctx.beginPath(); ctx.ellipse(rx, ry, rw/2, rh/2, 0, 0, Math.PI*2); ctx.fill();
      // Shadow area bottom-right
      ctx.fillStyle = 'rgba(80,80,80,0.4)';
      ctx.beginPath(); ctx.ellipse(rx + 3, ry + 3, rw/2 - 3, rh/2 - 2, 0.3, 0, Math.PI*2); ctx.fill();
      // Highlight top-left
      ctx.fillStyle = '#aaaaaa';
      ctx.beginPath(); ctx.ellipse(rx - 4, ry - 4, rw/4, rh/4, -0.3, 0, Math.PI*2); ctx.fill();
      // Bright specular dot
      ctx.fillStyle = 'rgba(255,255,255,0.35)';
      ctx.beginPath(); ctx.arc(rx - 5, ry - 5, 2, 0, Math.PI*2); ctx.fill();

    } else if (tileId === 68) {
      // ── Door — themed with panels, depth shadow, handle ────────────
      const _th68 = window.DG_MAP_THEME || 'DEFAULT';
      // [frame, doorBody, panelLight, panelShadow, handle, trimStrip]
      const _DT68 = {
        VOLCANIC: ['#0c0404','#2a100a','#4a1a10','#180606','#909090','#ff5020'],
        COASTAL:  ['#243040','#3a5870','#5878a0','#2a4058','#d0a820','#4ab0e0'],
        DESERT:   ['#5a3810','#b07828','#d09040','#886020','#d09020','#e8c060'],
        FOREST:   ['#1a1008','#4a2c10','#6a4420','#2a1c08','#c8a030','#60a030'],
        GRANITE:  ['#101010','#404040','#606060','#202020','#b0b0b0','#808080'],
        MOUNTAIN: ['#181210','#504840','#706860','#302820','#c0b040','#a0a0b0'],
        SWAMP:    ['#0c1008','#20300a','#304018','#141e08','#80a040','#305020'],
        TUNDRA:   ['#3858a0','#7090c0','#90aad8','#506888','#e8e8f8','#a0c8f8'],
        SUMMIT:   ['#907860','#dfd0a8','#f0e4c0','#c0b080','#ffc040','#f8f0d0'],
        AMBER:    ['#5a3010','#9a5820','#ba7838','#783810','#e8b040','#d07820'],
        LAB:      ['#384050','#5070a0','#7090c0','#405878','#d0d8f0','#90b8e0'],
        CENTER:   ['#302848','#5858a8','#7878c8','#404080','#ffa0b8','#9090d0'],
        DEFAULT:  ['#3a2818','#a06030','#c08040','#7a4820','#ffd080','#c0a060'],
      };
      const _dc68 = _DT68[_th68] || _DT68.DEFAULT;
      const [_df68,_dd68,_dl68,_ds68,_dh68,_dt68] = _dc68;
      // Wall frame
      ctx.fillStyle=_df68; ctx.fillRect(px,py,T,T);
      // Door body (inset)
      ctx.fillStyle=_dd68; ctx.fillRect(px+3,py+3,T-6,T-4);
      // Coloured trim strip across top of door
      ctx.fillStyle=_dt68; ctx.fillRect(px+3,py+3,T-6,3);
      // Upper panel
      ctx.fillStyle=_dl68; ctx.fillRect(px+5,py+7,T-10,8);
      ctx.fillStyle=_ds68; ctx.fillRect(px+5,py+13,T-10,2); ctx.fillRect(px+T-7,py+7,2,8);
      // Mid horizontal divider
      ctx.fillStyle=_df68; ctx.fillRect(px+5,py+15,T-10,2);
      // Lower panel
      ctx.fillStyle=_dl68; ctx.fillRect(px+5,py+17,T-10,T-20);
      ctx.fillStyle=_ds68; ctx.fillRect(px+5,py+T-5,T-10,2); ctx.fillRect(px+T-7,py+17,2,T-20);
      // Door handle + shine
      ctx.fillStyle=_dh68;
      ctx.beginPath(); ctx.arc(px+T-8,py+T/2+3,2.5,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='rgba(255,255,255,0.55)';
      ctx.beginPath(); ctx.arc(px+T-9,py+T/2+2,1,0,Math.PI*2); ctx.fill();
      // Left+right inset depth
      ctx.fillStyle='rgba(0,0,0,0.28)';
      ctx.fillRect(px+3,py+3,2,T-4); ctx.fillRect(px+T-5,py+3,2,T-4);
      // Top highlight
      ctx.fillStyle='rgba(255,255,255,0.14)'; ctx.fillRect(px+3,py+3,T-6,2);
    } else if (tileId === 9) {
      // ── Flowers — biome-specific species ──────────────────────
      const _thFL9 = window.DG_MAP_THEME || 'DEFAULT';
      const _fxc9 = px + T/2, _fyc9 = py + T/2;
      if (_thFL9 === 'COASTAL') {
        // Sea anemone — white petals, pink center
        ctx.fillStyle = 'rgba(60,100,120,0.3)'; ctx.fillRect(px, py, T, T); // tinted base
        for (let p=0;p<6;p++) {
          const fa=p*Math.PI/3+anim*0.015, fx=_fxc9+Math.cos(fa)*5, fy=_fyc9+Math.sin(fa)*5;
          ctx.fillStyle='rgba(220,240,255,0.9)';
          ctx.beginPath(); ctx.ellipse(fx,fy,3,1.5,fa,0,Math.PI*2); ctx.fill();
        }
        ctx.fillStyle='#ff80aa'; ctx.beginPath(); ctx.arc(_fxc9,_fyc9,2.5,0,Math.PI*2); ctx.fill();
        ctx.fillStyle='rgba(255,255,255,0.7)'; ctx.beginPath(); ctx.arc(_fxc9-0.8,_fyc9-0.8,1,0,Math.PI*2); ctx.fill();
      } else if (_thFL9 === 'FOREST') {
        // Purple violets — 3 small clustered flowers
        const _vpos9 = [[_fxc9-5,_fyc9+2],[_fxc9+4,_fyc9+3],[_fxc9,_fyc9-4]];
        for (const [_vx,_vy] of _vpos9) {
          for (let p=0;p<5;p++) {
            const fa=p*Math.PI*2/5+anim*0.01;
            ctx.fillStyle='#8040c0';
            ctx.beginPath(); ctx.ellipse(_vx+Math.cos(fa)*3.5,_vy+Math.sin(fa)*3.5,2.5,1.5,fa,0,Math.PI*2); ctx.fill();
          }
          ctx.fillStyle='#ffee60'; ctx.beginPath(); ctx.arc(_vx,_vy,1.5,0,Math.PI*2); ctx.fill();
        }
        // Green stem/leaves
        ctx.strokeStyle='#2a6020'; ctx.lineWidth=0.8;
        for (const [_vx,_vy] of _vpos9) { ctx.beginPath(); ctx.moveTo(_vx,_vy+4); ctx.lineTo(_vx+1,_vy+7); ctx.stroke(); }
      } else if (_thFL9 === 'SWAMP') {
        // Mushroom cluster — round caps with spots
        const _mpos9=[[_fxc9-5,_fyc9+3],[_fxc9+4,_fyc9+4],[_fxc9,_fyc9-2]];
        const _mcols9=['#c82020','#e05020','#a03880'];
        for (let _mi=0;_mi<3;_mi++) {
          const [_mx,_my]=_mpos9[_mi];
          ctx.fillStyle='#b8a870'; ctx.fillRect(_mx-1,_my,2,5); // stem
          ctx.fillStyle=_mcols9[_mi];
          ctx.beginPath(); ctx.ellipse(_mx,_my,4,3,0,0,Math.PI*2); ctx.fill();
          ctx.fillStyle='rgba(255,255,220,0.7)';
          ctx.beginPath(); ctx.arc(_mx-1,_my-1,1,0,Math.PI*2); ctx.fill();
          ctx.beginPath(); ctx.arc(_mx+2,_my,0.8,0,Math.PI*2); ctx.fill();
        }
      } else if (_thFL9 === 'TUNDRA' || _thFL9 === 'SUMMIT') {
        // Snow blossom — tiny white flowers with blue tinge, frost petals
        for (let p=0;p<6;p++) {
          const fa=p*Math.PI/3+anim*0.008, fx=_fxc9+Math.cos(fa)*5, fy=_fyc9+Math.sin(fa)*4;
          ctx.fillStyle='rgba(230,245,255,0.95)';
          ctx.beginPath(); ctx.arc(fx,fy,2,0,Math.PI*2); ctx.fill();
        }
        ctx.fillStyle='#a0c0e8'; ctx.beginPath(); ctx.arc(_fxc9,_fyc9,2,0,Math.PI*2); ctx.fill();
        ctx.fillStyle='rgba(255,255,255,0.9)'; ctx.beginPath(); ctx.arc(_fxc9-0.5,_fyc9-0.5,0.8,0,Math.PI*2); ctx.fill();
      } else if (_thFL9 === 'VOLCANIC') {
        // Ember weed — smoldering dark plant, orange glow
        ctx.strokeStyle='#301808'; ctx.lineWidth=1.2;
        for (let _ew=0;_ew<4;_ew++) {
          ctx.beginPath(); ctx.moveTo(_fxc9+(_ew-2)*5,_fyc9+5);
          ctx.quadraticCurveTo(_fxc9+(_ew-2)*4+Math.sin(_ew)*3,_fyc9-2,_fxc9+(_ew-2)*5+1,_fyc9-6); ctx.stroke();
        }
        const _ep9=0.5+0.4*Math.sin(anim*0.1+seed*0.3);
        ctx.fillStyle=`rgba(255,100,0,${_ep9})`;
        ctx.beginPath(); ctx.arc(_fxc9,_fyc9-7,3,0,Math.PI*2); ctx.fill();
        ctx.fillStyle=`rgba(255,220,0,${_ep9*0.7})`;
        ctx.beginPath(); ctx.arc(_fxc9,_fyc9-8,1.5,0,Math.PI*2); ctx.fill();
      } else {
        // DEFAULT — original yellow/red sunflower style
        ctx.fillStyle = '#ffe066';
        for (let p = 0; p < 5; p++) {
          const fx = _fxc9 + Math.cos(p * Math.PI*2/5 + anim*0.02) * 5;
          const fy = _fyc9 + Math.sin(p * Math.PI*2/5 + anim*0.02) * 5;
          ctx.beginPath(); ctx.arc(fx, fy, 2.5, 0, Math.PI*2); ctx.fill();
        }
        ctx.fillStyle = '#ff5252';
        ctx.beginPath(); ctx.arc(_fxc9, _fyc9, 3, 0, Math.PI*2); ctx.fill();
      }
    } else if (tileId === 70) {
      ctx.strokeStyle = '#6d4c41';
      ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(px, py + T/2); ctx.lineTo(px + T, py + T/2); ctx.stroke();
      ctx.fillStyle = '#8d6451';
      ctx.fillRect(px + T/4 - 2, py + T/4, 4, T/2);
      ctx.fillRect(px + 3*T/4 - 2, py + T/4, 4, T/2);
    } else if (tileId === 76) {
      // Heal pad — animated glow
      const pulse = 0.5 + 0.5 * Math.sin(anim * 0.1);
      ctx.fillStyle = `rgba(80,255,80,${0.25 + 0.2 * pulse})`;
      ctx.fillRect(px + T/2 - 3, py + 3, 6, T - 6);
      ctx.fillRect(px + 3, py + T/2 - 3, T - 6, 6);
      ctx.strokeStyle = `rgba(100,255,100,${0.5 * pulse})`;
      ctx.lineWidth = 1;
      ctx.strokeRect(px + 2, py + 2, T - 4, T - 4);

    } else if (tileId === 75) {
      // ── PC — monitor + keyboard on a desk ─────────────────────────
      // Desk surface (overpaint the plain teal base)
      ctx.fillStyle = '#4e342e';
      ctx.fillRect(px, py, T, T);
      ctx.fillStyle = '#5d4037';
      ctx.fillRect(px, py, T, 2); // desk top highlight

      // Monitor outer frame
      ctx.fillStyle = '#37474f';
      ctx.fillRect(px + 3, py + 2, 26, 17);
      // Monitor inner bevel
      ctx.fillStyle = '#263238';
      ctx.fillRect(px + 4, py + 3, 24, 15);

      // Screen background (dark navy)
      ctx.fillStyle = '#001428';
      ctx.fillRect(px + 5, py + 4, 22, 13);

      // Animated screen glow
      const pcPulse = 0.7 + 0.3 * Math.sin(anim * 0.07);
      ctx.fillStyle = `rgba(0,160,200,${0.12 + 0.06 * pcPulse})`;
      ctx.fillRect(px + 5, py + 4, 22, 13);

      // Fossil dino silhouette on screen (cyan)
      ctx.fillStyle = `rgba(0,210,255,${0.55 + 0.35 * pcPulse})`;
      // spine
      ctx.fillRect(px + 9,  py + 7, 11, 2);
      // ribs
      ctx.fillRect(px + 10, py + 9, 2, 3);
      ctx.fillRect(px + 14, py + 9, 2, 3);
      ctx.fillRect(px + 18, py + 9, 2, 3);
      // skull
      ctx.beginPath();
      ctx.arc(px + 22, py + 8, 2.2, 0, Math.PI * 2);
      ctx.fill();
      // tail
      ctx.fillRect(px + 6, py + 8, 4, 2);
      ctx.fillRect(px + 5, py + 10, 2, 1);

      // Screen corner shine
      ctx.fillStyle = 'rgba(255,255,255,0.07)';
      ctx.fillRect(px + 5, py + 4, 22, 3);

      // Monitor stand & base
      ctx.fillStyle = '#455a64';
      ctx.fillRect(px + 13, py + 19, 6, 3);
      ctx.fillStyle = '#546e7a';
      ctx.fillRect(px + 9,  py + 22, 14, 2);

      // Keyboard body
      ctx.fillStyle = '#455a64';
      ctx.fillRect(px + 4, py + 24, 24, 5);
      // Key rows
      ctx.fillStyle = '#37474f';
      for (let k = 0; k < 5; k++) {
        ctx.fillRect(px + 5 + k * 4, py + 25, 3, 1);
        ctx.fillRect(px + 7 + k * 4, py + 27, 3, 1);
      }

      // Green power LED (bottom-right of keyboard)
      ctx.fillStyle = `rgba(0,255,140,${0.6 + 0.4 * pcPulse})`;
      ctx.beginPath();
      ctx.arc(px + 26, py + 28, 1.5, 0, Math.PI * 2);
      ctx.fill();

    } else if (tileId === 65) {
      // ── Wall / Building — themed 3-D brick wall ────────────────────
      const _th65 = window.DG_MAP_THEME || 'DEFAULT';
      const _anim65 = anim || 0;
      if (_th65 === 'CHAMPION') {
        // Ornate arch wall — dark stone with gold trim (unchanged)
        ctx.fillStyle = '#1a1408'; ctx.fillRect(px, py, T, T);
        ctx.fillStyle = '#c8a020'; ctx.fillRect(px, py, T, 2);
        ctx.fillStyle = '#b8900c';
        ctx.fillRect(px, py, 3, T); ctx.fillRect(px + T - 3, py, 3, T);
        ctx.fillStyle = '#2a2010'; ctx.fillRect(px + 3, py + 3, T - 6, T - 5);
        ctx.fillStyle = '#8d6e4a';
        ctx.fillRect(px+8,py+6,2,6); ctx.fillRect(px+6,py+9,6,2);
        ctx.fillRect(px+7,py+7,1,1); ctx.fillRect(px+12,py+7,1,1);
      } else {
        // Theme table: [mortar, brickFace, brickLight, brickDark, windowGlass, windowFrame]
        const _WT65 = {
          AMBER:    ['#6a3c10','#c8702c','#e89040','#9a5020','#ffd070','#5a2c08'],
          COASTAL:  ['#354858','#607888','#80a0b0','#405870','#a0dff8','#243848'],
          DESERT:   ['#705820','#c09030','#d8a848','#9a7020','#ffe090','#5a4010'],
          VOLCANIC: ['#0c0404','#241010','#381a1a','#100808','#ff5020','#180808'],
          FOREST:   ['#20140a','#6a3c18','#8c5430','#4c2c10','#a0e888','#201008'],
          GRANITE:  ['#202020','#545454','#747474','#343434','#c0dcf8','#141414'],
          MOUNTAIN: ['#302820','#625850','#827870','#424038','#d0c8f8','#201810'],
          SWAMP:    ['#0c1408','#283818','#384828','#1c2c14','#58da58','#0c1008'],
          TUNDRA:   ['#788898','#b4c8d8','#d4e4f4','#9aacbc','#e8f4ff','#587090'],
          SUMMIT:   ['#a89870','#e8dcbc','#f8eccc','#c8c0a0','#fff8b0','#9a8858'],
          LAB:      ['#687888','#b4b8c8','#ccccd8','#9a9aaa','#c4e8f8','#485060'],
          CENTER:   ['#505880','#9090c0','#a8a0d0','#686090','#ff9ab8','#404070'],
          HOUSE:    ['#4c3018','#9a6840','#b08050','#6c4828','#ffd070','#3c2010'],
          SHOP:     ['#3c2420','#806050','#988070','#584040','#ffdc60','#2c1818'],
          FIRE:     ['#1a0606','#2e1008','#4a1810','#1c0808','#ff6020','#0e0404'],
          ROCK:     ['#2a2418','#6a6050','#8a8068','#484038','#e0d8c0','#1a1810'],
          GRASS:    ['#0c1c08','#2c4018','#3c5828','#1a2c10','#b0e880','#081408'],
          GROUND:   ['#3a2810','#8a7050','#a08868','#604830','#e8d8b0','#281808'],
          ELECTRIC: ['#0a0a1a','#1c2040','#2c3060','#100c28','#ffee60','#050510'],
          WATER:    ['#0a1828','#183a60','#2a5088','#0c2240','#60d8f8','#080c18'],
          DRAGON:   ['#050518','#101440','#181c60','#080830','#a0b8ff','#030310'],
          NORMAL:   ['#4a4030','#9a8868','#b8a880','#6a5848','#ffe8c0','#2a2018'],
          DEFAULT:  ['#b0a080','#ecdcb8','#fcecc8','#ccbca0','#fff0a8','#888060'],
        };
        const _wc65 = _WT65[_th65] || _WT65.DEFAULT;
        const [_m65,_b65,_bl65,_bd65,_wg65,_wf65] = _wc65;
        const _rv65 = _tileRand(seed, 20);
        // 1. Mortar background
        ctx.fillStyle = _m65; ctx.fillRect(px, py, T, T);
        // 2. Staggered 3-D bricks: 4 rows, BH=7, mortar=1
        for (let _r65=0; _r65<4; _r65++) {
          const _by65 = py + _r65 * 8 + 1;
          const _ox65 = (_r65 % 2 === 0) ? 0 : 8;
          for (let _c65=-1; _c65<=3; _c65++) {
            const _bx65 = px + _c65 * 16 - _ox65;
            const _cx65 = Math.max(px, _bx65);
            const _cw65 = Math.min(_bx65 + 15, px + T) - _cx65;
            if (_cw65 <= 0) continue;
            ctx.fillStyle=_b65;  ctx.fillRect(_cx65,_by65,_cw65,7);
            ctx.fillStyle=_bl65; ctx.fillRect(_cx65,_by65,_cw65,2); // top highlight
            ctx.fillStyle=_bl65; ctx.fillRect(_cx65,_by65,Math.min(2,_cw65),7); // left highlight
            ctx.fillStyle=_bd65; ctx.fillRect(_cx65,_by65+5,_cw65,2); // bottom shadow
            ctx.fillStyle=_bd65; ctx.fillRect(Math.min(_cx65+_cw65-2,px+T-2),_by65,Math.min(2,_cw65),7); // right shadow
          }
        }
        // 3. Window on outdoor tiles (~30% by seed hash)
        const _noWin65={LAB:1,CENTER:1,HOUSE:1,SHOP:1,FIRE:1,GRASS:1,ROCK:1,
          GROUND:1,ELECTRIC:1,WATER:1,DRAGON:1,NORMAL:1}[_th65];
        if (!_noWin65 && _rv65[0] > 0.70) {
          const _wx65=px+3+Math.floor(_rv65[1]*(T-18));
          const _wy65=py+3+Math.floor(_rv65[2]*(T-16));
          ctx.fillStyle=_wf65; ctx.fillRect(_wx65-1,_wy65-1,14,11);
          const _gw65=0.58+0.42*Math.sin(_anim65*0.04+seed*0.09);
          ctx.fillStyle=_wg65; ctx.globalAlpha=_gw65; ctx.fillRect(_wx65,_wy65,12,9); ctx.globalAlpha=1.0;
          ctx.fillStyle=_wf65; ctx.fillRect(_wx65,_wy65+4,12,1); ctx.fillRect(_wx65+5,_wy65,1,9);
          ctx.fillStyle='rgba(255,255,255,0.5)'; ctx.fillRect(_wx65,_wy65,4,2);
        }
        // 4. VOLCANIC / FIRE: hot glow bleeding through mortar cracks
        if (_th65==='VOLCANIC'||_th65==='FIRE') {
          const _lp65=0.15+0.18*Math.sin(_anim65*0.1+px*0.04);
          ctx.fillStyle=`rgba(255,70,0,${_lp65})`;
          for (let _vr65=0;_vr65<5;_vr65++) ctx.fillRect(px,py+_vr65*8,T,1);
        }
        // 5. TUNDRA: icy frost shimmer
        if (_th65==='TUNDRA') { ctx.fillStyle='rgba(200,240,255,0.14)'; ctx.fillRect(px,py,T,T); }
        // 6. Right + bottom depth shadow
        ctx.fillStyle='rgba(0,0,0,0.20)';
        ctx.fillRect(px+T-3,py,3,T); ctx.fillRect(px,py+T-3,T,3);
      }

    } else if (tileId === 66) {
      // ── Mountain / Cliff — layered rock strata with cracks ─────────
      const _rv66 = _tileRand(seed, 16);
      const _th66 = window.DG_MAP_THEME || 'DEFAULT';
      const _MC66 = _th66==='TUNDRA'   ? ['#7888a0','#8898b4','#a4b8cc','#c8dce8'] :
                    _th66==='VOLCANIC'  ? ['#180808','#281010','#381818','#4a2020'] :
                    _th66==='FOREST'    ? ['#2a2018','#3a3028','#4a4038','#5a5048'] :
                    _th66==='MOUNTAIN'  ? ['#302828','#484040','#605858','#787070'] :
                    _th66==='DESERT'    ? ['#7a6030','#988848','#b0a058','#c8b870'] :
                                          ['#383838','#4a4a4a','#606060','#767676'];
      ctx.fillStyle=_MC66[0]; ctx.fillRect(px,py,T,T);
      // Strata layers
      for (let _l66=0;_l66<3;_l66++) {
        const _lh66=8+Math.floor(_rv66[_l66]*4), _ly66=py+_l66*11;
        ctx.fillStyle=_MC66[_l66+1]; ctx.fillRect(px,_ly66,T,_lh66);
        ctx.fillStyle='rgba(255,255,255,0.10)'; ctx.fillRect(px,_ly66,T,2);
        ctx.fillStyle='rgba(0,0,0,0.22)'; ctx.fillRect(px,_ly66+_lh66-2,T,2);
      }
      // Crack lines
      ctx.lineWidth=1; ctx.strokeStyle=_MC66[0];
      for (let _cr66=0;_cr66<2;_cr66++) {
        const _crx66=px+4+Math.floor(_rv66[6+_cr66]*(T-8));
        ctx.beginPath();
        ctx.moveTo(_crx66,py);
        ctx.lineTo(_crx66+Math.floor(_rv66[8+_cr66]*4)-2,py+T*0.5);
        ctx.lineTo(_crx66+Math.floor(_rv66[10+_cr66]*4)-2,py+T);
        ctx.stroke();
      }
      // Snow/frost cap on top
      if (_th66==='TUNDRA'||_th66==='MOUNTAIN') {
        ctx.fillStyle='rgba(228,244,255,0.88)'; ctx.fillRect(px,py,T,3+Math.floor(_rv66[14]*3));
        ctx.fillStyle='rgba(255,255,255,0.6)'; ctx.fillRect(px,py,T,1);
      } else if (_th66==='FOREST') {
        ctx.fillStyle='rgba(50,110,30,0.55)'; ctx.fillRect(px,py,T,2+Math.floor(_rv66[14]*2));
      }
      // Volcanic glow at base
      if (_th66==='VOLCANIC') {
        const _vp66=0.18+0.18*Math.sin((anim||0)*0.09+px*0.05);
        ctx.fillStyle=`rgba(255,50,0,${_vp66})`; ctx.fillRect(px,py+T-4,T,4);
      }
      // Right-face shadow (cliff depth illusion)
      ctx.fillStyle='rgba(0,0,0,0.30)'; ctx.fillRect(px+T-4,py,4,T);

    } else if (tileId === 72) {
      // ── Cave Wall — rough rock face with stalactites ────────────────
      const _rv72 = _tileRand(seed, 16);
      const _th72 = window.DG_MAP_THEME || 'DEFAULT';
      const _cvB72=_th72==='VOLCANIC'?'#160808':'#252e36';
      const _cvR72=_th72==='VOLCANIC'?'#2e1010':'#374450';
      const _cvL72=_th72==='VOLCANIC'?'#4a2018':'#4a5c6a';
      ctx.fillStyle=_cvB72; ctx.fillRect(px,py,T,T);
      // Rock face panels
      for (let _rp72=0;_rp72<3;_rp72++) {
        const _rpx72=px+1+Math.floor(_rv72[_rp72*4]*3);
        const _rpy72=py+1+_rp72*10+Math.floor(_rv72[_rp72*4+1]*3);
        const _rpw72=Math.min(18+Math.floor(_rv72[_rp72*4+2]*8),px+T-_rpx72-1);
        const _rph72=7+Math.floor(_rv72[_rp72*4+3]*3);
        if (_rpw72<=0) continue;
        ctx.fillStyle=_cvR72; ctx.fillRect(_rpx72,_rpy72,_rpw72,_rph72);
        ctx.fillStyle=_cvL72;
        ctx.fillRect(_rpx72,_rpy72,_rpw72,1); ctx.fillRect(_rpx72,_rpy72,1,_rph72);
      }
      // Stalactite drips from ceiling
      ctx.fillStyle=_cvB72;
      for (let _sd72=0;_sd72<3;_sd72++) {
        const _sdx72=px+3+Math.floor(_rv72[12+_sd72]*(T-6));
        const _sdh72=3+Math.floor(_rv72[Math.min(13+_sd72,15)]*5);
        ctx.fillRect(_sdx72,py,3,_sdh72);
        ctx.beginPath();
        ctx.moveTo(_sdx72,py+_sdh72); ctx.lineTo(_sdx72+1,py+_sdh72+3);
        ctx.lineTo(_sdx72+3,py+_sdh72); ctx.fill();
      }
      // Volcanic lava crack glow
      if (_th72==='VOLCANIC') {
        const _lp72=0.12+0.15*Math.sin((anim||0)*0.08+px*0.05);
        ctx.fillStyle=`rgba(255,50,0,${_lp72})`;
        for (let _c72=0;_c72<3;_c72++) ctx.fillRect(px+Math.floor(_rv72[_c72]*T),py,1,T);
      }
      // Deep drip shadow at bottom
      ctx.fillStyle='rgba(0,0,0,0.40)'; ctx.fillRect(px,py+T-4,T,4);

    } else if (tileId === 77) {
      // Themed gym decoration — solid obstacle, draws per DG_MAP_THEME
      const _theme77 = window.DG_MAP_THEME || 'DEFAULT';
      const _anim77  = typeof anim !== 'undefined' ? anim : 0;
      if (_theme77 === 'NORMAL') {
        // Hay bale
        ctx.fillStyle = '#f9a825'; ctx.fillRect(px,py,T,T);
        ctx.fillStyle = '#f57f17';
        for(var _h=0;_h<5;_h++) ctx.fillRect(px+1,py+2+_h*6,T-2,3);
        ctx.fillStyle = '#ffca28';
        for(var _h=0;_h<4;_h++) ctx.fillRect(px+2,py+3+_h*6,T-4,1);
        ctx.fillStyle = '#e65100'; ctx.fillRect(px+8,py+1,4,T-2);
      } else if (_theme77 === 'ROCK') {
        // Fossil wall panel
        ctx.fillStyle = '#37474f'; ctx.fillRect(px,py,T,T);
        ctx.fillStyle = '#546e7a';
        ctx.fillRect(px+4,py+6,12,3);
        ctx.fillRect(px+7,py+3,3,10); ctx.fillRect(px+12,py+4,3,8);
        ctx.fillRect(px+5,py+11,4,2); ctx.fillRect(px+13,py+11,3,2);
        ctx.fillStyle = '#78909c';
        ctx.beginPath(); ctx.ellipse(px+7,py+4,3,3,0,0,Math.PI*2); ctx.fill();
        ctx.fillStyle = '#90a4ae'; ctx.fillRect(px+6,py+3,2,2);
      } else if (_theme77 === 'FIRE') {
        // Fire brazier
        ctx.fillStyle = '#212121'; ctx.fillRect(px,py,T,T);
        ctx.fillStyle = '#4e342e'; ctx.fillRect(px+6,py+10,8,5);
        ctx.fillStyle = '#37474f'; ctx.fillRect(px+4,py+8,12,4);
        const _bp = 0.5+0.5*Math.sin(_anim77*0.12);
        ctx.fillStyle = 'rgba(255,'+Math.floor(100+80*_bp)+',0,0.95)';
        ctx.beginPath(); ctx.ellipse(px+10,py+6,6,5,0,0,Math.PI*2); ctx.fill();
        ctx.fillStyle = 'rgba(255,220,0,0.8)';
        ctx.beginPath(); ctx.ellipse(px+10,py+5,3,3,0,0,Math.PI*2); ctx.fill();
      } else if (_theme77 === 'GRASS') {
        // Giant flower
        ctx.fillStyle = '#1b5e20'; ctx.fillRect(px,py,T,T);
        ctx.fillStyle = '#388e3c'; ctx.fillRect(px+9,py+8,2,7);
        ctx.fillStyle = '#ff4081';
        for(var _p=0;_p<6;_p++){
          var _pa=_p*Math.PI/3;
          ctx.beginPath(); ctx.ellipse(px+10+Math.cos(_pa)*6,py+7+Math.sin(_pa)*6,4,3,_pa,0,Math.PI*2); ctx.fill();
        }
        ctx.fillStyle = '#ffeb3b';
        ctx.beginPath(); ctx.ellipse(px+10,py+7,4,4,0,0,Math.PI*2); ctx.fill();
      } else if (_theme77 === 'GROUND') {
        // Broken stone column
        ctx.fillStyle = '#5d4037'; ctx.fillRect(px,py,T,T);
        ctx.fillStyle = '#a1887f'; ctx.fillRect(px+5,py+1,10,14);
        ctx.fillStyle = '#8d6e63'; ctx.fillRect(px+4,py+1,2,14); ctx.fillRect(px+14,py+1,2,14);
        ctx.fillStyle = '#6d4c41';
        ctx.fillRect(px+4,py+4,12,2); ctx.fillRect(px+4,py+8,12,2); ctx.fillRect(px+4,py+12,12,2);
        ctx.fillStyle = '#3e2723'; ctx.fillRect(px+9,py+1,1,5); ctx.fillRect(px+10,py+5,1,4);
      } else if (_theme77 === 'ELECTRIC') {
        // Electric coil tower
        ctx.fillStyle = '#1a1a2e'; ctx.fillRect(px,py,T,T);
        ctx.fillStyle = '#616161'; ctx.fillRect(px+8,py+4,4,11);
        ctx.fillStyle = '#ffd600';
        for(var _cr=0;_cr<4;_cr++) ctx.fillRect(px+5,py+4+_cr*3,10,1);
        const _cp = 0.5+0.5*Math.sin(_anim77*0.2+px);
        ctx.fillStyle = 'rgba(255,230,0,'+(0.6+0.4*_cp)+')';
        ctx.beginPath(); ctx.ellipse(px+10,py+3,5,3,0,0,Math.PI*2); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,100,0.5)';
        ctx.beginPath(); ctx.ellipse(px+10,py+3,3,2,0,0,Math.PI*2); ctx.fill();
      } else if (_theme77 === 'WATER') {
        // Coral cluster
        ctx.fillStyle = '#01579b'; ctx.fillRect(px,py,T,T);
        ctx.fillStyle = '#0277bd'; ctx.fillRect(px,py+10,T,5);
        ctx.fillStyle = '#ff7043';
        ctx.beginPath(); ctx.ellipse(px+7,py+9,4,6,0,0,Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(px+14,py+10,3,5,0,0,Math.PI*2); ctx.fill();
        ctx.fillStyle = '#26a69a';
        ctx.fillRect(px+10,py+5,2,9); ctx.fillRect(px+4,py+7,2,7);
        ctx.fillStyle = '#80cbc4';
        ctx.beginPath(); ctx.ellipse(px+11,py+5,3,2,0,0,Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(px+5,py+7,3,2,0,0,Math.PI*2); ctx.fill();
      } else if (_theme77 === 'DRAGON') {
        // Dragon rune stone
        ctx.fillStyle = '#0d1b4b'; ctx.fillRect(px,py,T,T);
        ctx.fillStyle = '#1a237e'; ctx.fillRect(px+3,py+2,14,12);
        ctx.fillStyle = '#7986cb';
        ctx.fillRect(px+9,py+3,2,10); ctx.fillRect(px+4,py+7,12,2);
        ctx.fillRect(px+5,py+4,2,2); ctx.fillRect(px+13,py+4,2,2);
        ctx.fillRect(px+5,py+10,2,2); ctx.fillRect(px+13,py+10,2,2);
        const _rp = 0.5+0.5*Math.sin(_anim77*0.08);
        ctx.fillStyle = 'rgba(120,150,255,'+(0.3+0.5*_rp)+')';
        ctx.fillRect(px+3,py+2,14,12);
      } else if (_theme77 === 'CHAMPION') {
        // Championship trophy / Elite statue — gleaming gold
        const _cp77 = 0.5 + 0.5 * Math.sin(_anim77 * 0.06);
        // Pedestal base
        ctx.fillStyle = '#5d4e37';
        ctx.fillRect(px + 3, py + 12, 14, 4);
        ctx.fillRect(px + 5, py + 10, 10, 3);
        // Trophy stem
        ctx.fillStyle = '#b8960c';
        ctx.fillRect(px + 8, py + 7, 4, 4);
        // Trophy cup body
        ctx.fillStyle = `rgba(${Math.floor(220 + 35 * _cp77)},${Math.floor(180 + 30 * _cp77)},20,1)`;
        ctx.beginPath();
        ctx.moveTo(px + 5, py + 2);
        ctx.lineTo(px + 15, py + 2);
        ctx.lineTo(px + 13, py + 7);
        ctx.lineTo(px + 7, py + 7);
        ctx.closePath();
        ctx.fill();
        // Cup handles
        ctx.strokeStyle = '#e8c020';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(px + 5, py + 4, 3, Math.PI * 0.5, Math.PI * 1.5); ctx.stroke();
        ctx.beginPath(); ctx.arc(px + 15, py + 4, 3, -Math.PI * 0.5, Math.PI * 0.5); ctx.stroke();
        // Fossil crown on top
        ctx.fillStyle = '#fff8e1';
        ctx.beginPath(); ctx.ellipse(px + 10, py + 2, 4, 3, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#8d6e63';
        ctx.fillRect(px + 8, py + 1, 4, 2);
        ctx.fillRect(px + 9, py, 2, 1);
        // Gold shimmer highlight
        ctx.fillStyle = `rgba(255,255,200,${0.15 + 0.25 * _cp77})`;
        ctx.fillRect(px + 5, py + 2, 10, 5);
      } else {
        // Chair — wooden seat + back rest (DEFAULT for non-gym maps)
        ctx.fillStyle = '#5a3a1a';
        ctx.fillRect(px + 6, py + 4, T - 12, 6);       // back rest
        ctx.fillStyle = '#8B5E3C';
        ctx.fillRect(px + 6, py + 10, T - 12, T - 18); // seat
        ctx.fillStyle = '#5a3a1a';
        ctx.fillRect(px + 6,      py + T - 8, 4, 8);   // leg left
        ctx.fillRect(px + T - 10, py + T - 8, 4, 8);   // leg right
        ctx.strokeStyle = 'rgba(0,0,0,0.3)';
        ctx.lineWidth = 1;
        ctx.strokeRect(px + 6, py + 4, T - 12, 6);
      }
    } else if (tileId === 78) {
      // Table — wooden top + two visible legs
      ctx.fillStyle = '#a0784a';
      ctx.fillRect(px + 2, py + 6, T - 4, 8);        // table top surface
      ctx.fillStyle = '#6D4C2A';
      ctx.fillRect(px + 2, py + 6, T - 4, 4);        // top face
      ctx.fillRect(px + 4,      py + 14, 4, T - 16); // left leg
      ctx.fillRect(px + T - 8,  py + 14, 4, T - 16); // right leg
      ctx.strokeStyle = 'rgba(0,0,0,0.25)';
      ctx.lineWidth = 1;
      ctx.strokeRect(px + 2, py + 6, T - 4, 8);
    } else if (tileId === 79) {
      // TV — screen + frame + stand
      ctx.fillStyle = '#2a2a3a';
      ctx.fillRect(px + 2, py + 2, T - 4, T - 10);  // outer frame
      const pulse = 0.75 + 0.25 * Math.sin(anim * 0.08);
      ctx.fillStyle = `rgba(50,150,${Math.floor(200 * pulse)},0.9)`;
      ctx.fillRect(px + 5, py + 5, T - 10, T - 18); // screen
      ctx.fillStyle = 'rgba(255,255,255,0.12)';
      ctx.fillRect(px + 5, py + 5, T - 10, 4);      // screen glare
      ctx.fillStyle = '#1a1a2a';
      ctx.fillRect(px + T/2 - 3, py + T - 8, 6, 4); // stand neck
      ctx.fillRect(px + 4, py + T - 5, T - 8, 4);   // stand base
    } else if (tileId === 80) {
      // Bed — pillow + covers + wooden frame
      ctx.fillStyle = '#8B6914';
      ctx.fillRect(px + 1, py + 1, T - 2, T - 2);   // wood frame
      ctx.fillStyle = '#dba857';
      ctx.fillRect(px + 3, py + 3, T - 6, 8);        // pillow
      ctx.fillStyle = '#e84040';
      ctx.fillRect(px + 3, py + 11, T - 6, T - 14); // blanket
      ctx.fillStyle = '#c03030';
      ctx.fillRect(px + 3, py + 11, T - 6, 3);       // blanket fold
      ctx.strokeStyle = 'rgba(0,0,0,0.2)';
      ctx.lineWidth = 1;
      ctx.strokeRect(px + 1, py + 1, T - 2, T - 2);
    } else if (tileId === 81) {
      // Bookshelf — dark frame + coloured book spines
      ctx.fillStyle = '#3D2508';
      ctx.fillRect(px + 1, py + 1, T - 2, T - 2);    // frame
      const colors = ['#e53935','#1e88e5','#43a047','#fb8c00','#8e24aa'];
      const bw = Math.floor((T - 6) / 5);
      for (let b = 0; b < 5; b++) {
        ctx.fillStyle = colors[b];
        ctx.fillRect(px + 3 + b * bw, py + 4, bw - 1, T - 10);
      }
      ctx.fillStyle = '#3D2508';
      ctx.fillRect(px + 1, py + 1, T - 2, 3);        // top shelf
      ctx.fillRect(px + 1, py + T - 4, T - 2, 3);    // bottom shelf
      ctx.fillRect(px + 1, py + T/2 - 1, T - 2, 2);  // middle shelf
    } else if (tileId === 73) {
      const _theme73 = window.DG_MAP_THEME || 'DEFAULT';
      const _anim73  = typeof anim !== 'undefined' ? anim : 0;
      if (_theme73 === 'NORMAL') {
        // Wooden fence post
        ctx.fillStyle = '#5d4037'; ctx.fillRect(px,py,T,T);
        ctx.fillStyle = '#8d6e63';
        ctx.fillRect(px+3,py,4,T); ctx.fillRect(px+13,py,4,T);
        ctx.fillStyle = '#a1887f';
        ctx.fillRect(px,py+4,T,3); ctx.fillRect(px,py+11,T,3);
        ctx.fillStyle = '#4e342e';
        ctx.fillRect(px+3,py+4,4,3); ctx.fillRect(px+13,py+4,4,3);
        ctx.fillRect(px+3,py+11,4,3); ctx.fillRect(px+13,py+11,4,3);
      } else if (_theme73 === 'ROCK') {
        // Boulder pile
        ctx.fillStyle = '#546e7a'; ctx.fillRect(px,py,T,T);
        ctx.fillStyle = '#78909c';
        ctx.beginPath(); ctx.ellipse(px+10,py+11,9,7,0,0,Math.PI*2); ctx.fill();
        ctx.fillStyle = '#90a4ae';
        ctx.beginPath(); ctx.ellipse(px+6,py+8,6,5,0,0,Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(px+15,py+9,5,4,0,0,Math.PI*2); ctx.fill();
        ctx.fillStyle = '#b0bec5';
        ctx.beginPath(); ctx.ellipse(px+10,py+6,5,4,-0.3,0,Math.PI*2); ctx.fill();
        ctx.fillStyle = '#455a64';
        ctx.fillRect(px+4,py+12,4,2); ctx.fillRect(px+13,py+13,5,2);
      } else if (_theme73 === 'FIRE') {
        // Flaming pillar
        ctx.fillStyle = '#37474f'; ctx.fillRect(px,py,T,T);
        ctx.fillStyle = '#bf360c'; ctx.fillRect(px+7,py,6,T);
        ctx.fillStyle = '#e64a19'; ctx.fillRect(px+8,py,4,T);
        const _fp = 0.5+0.5*Math.sin(_anim73*0.15);
        ctx.fillStyle = 'rgba(255,'+Math.floor(140+80*_fp)+',0,0.9)';
        ctx.beginPath(); ctx.ellipse(px+10,py+3,4,5,0,0,Math.PI*2); ctx.fill();
        ctx.fillStyle = 'rgba(255,220,0,0.8)';
        ctx.beginPath(); ctx.ellipse(px+10,py+2,2,3,0,0,Math.PI*2); ctx.fill();
      } else if (_theme73 === 'GRASS') {
        // Flowering hedge
        ctx.fillStyle = '#1b5e20'; ctx.fillRect(px,py,T,T);
        ctx.fillStyle = '#2e7d32';
        for(var _gx=0;_gx<3;_gx++) for(var _gy=0;_gy<3;_gy++){
          ctx.beginPath();
          ctx.ellipse(px+4+_gx*6,py+5+_gy*5,4,3,_gx*0.5,0,Math.PI*2);
          ctx.fill();
        }
        ctx.fillStyle = '#ff4081';
        ctx.beginPath(); ctx.ellipse(px+5,py+5,2,2,0,0,Math.PI*2); ctx.fill();
        ctx.fillStyle = '#ffeb3b';
        ctx.beginPath(); ctx.ellipse(px+15,py+10,2,2,0,0,Math.PI*2); ctx.fill();
        ctx.fillStyle = '#f06292';
        ctx.beginPath(); ctx.ellipse(px+10,py+7,2,2,0,0,Math.PI*2); ctx.fill();
      } else if (_theme73 === 'GROUND') {
        // Stone rubble / broken pillar
        ctx.fillStyle = '#795548'; ctx.fillRect(px,py,T,T);
        ctx.fillStyle = '#a1887f'; ctx.fillRect(px+4,py+1,12,6);
        ctx.fillStyle = '#8d6e63';
        ctx.fillRect(px+6,py+7,8,4); ctx.fillRect(px+5,py+11,10,3);
        ctx.fillStyle = '#6d4c41';
        ctx.fillRect(px+4,py+2,2,2); ctx.fillRect(px+14,py+3,2,2);
        ctx.fillRect(px+7,py+8,2,2); ctx.fillRect(px+13,py+9,2,2);
        ctx.fillStyle = '#4e342e';
        ctx.fillRect(px+4,py+7,2,1); ctx.fillRect(px+14,py+11,3,1);
      } else if (_theme73 === 'ELECTRIC') {
        // Electric fence post with spark
        ctx.fillStyle = '#212121'; ctx.fillRect(px,py,T,T);
        ctx.fillStyle = '#ffd600';
        ctx.fillRect(px+9,py,2,T);
        ctx.fillRect(px,py+4,T,2); ctx.fillRect(px,py+11,T,2);
        const _ep = 0.5+0.5*Math.sin(_anim73*0.25+px);
        ctx.fillStyle = 'rgba(255,'+Math.floor(200+55*_ep)+',0,'+(0.7+0.3*_ep)+')';
        ctx.beginPath(); ctx.ellipse(px+10,py+4,3,3,0,0,Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(px+10,py+13,3,3,0,0,Math.PI*2); ctx.fill();
        ctx.strokeStyle = 'rgba(255,230,0,'+(0.4+0.5*_ep)+')';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(px+10,py+6); ctx.lineTo(px+8,py+9); ctx.lineTo(px+12,py+9); ctx.lineTo(px+10,py+11); ctx.stroke();
      } else if (_theme73 === 'WATER') {
        // Stone pier post with water ring
        ctx.fillStyle = '#01579b'; ctx.fillRect(px,py,T,T);
        const _wp = Math.sin(_anim73*0.08+px*0.1);
        ctx.fillStyle = '#0277bd'; ctx.fillRect(px,py+8+Math.round(_wp),T,2);
        ctx.fillStyle = '#4e342e'; ctx.fillRect(px+8,py,4,T);
        ctx.fillStyle = '#6d4c41'; ctx.fillRect(px+7,py,6,3);
        ctx.fillStyle = '#81d4fa';
        ctx.beginPath(); ctx.ellipse(px+10,py+10+Math.round(_wp),6,2,0,0,Math.PI*2); ctx.fill();
      } else if (_theme73 === 'DRAGON') {
        // Dragon scale wall segment
        ctx.fillStyle = '#1a237e'; ctx.fillRect(px,py,T,T);
        var _scaleColors = ['#283593','#303f9f','#3949ab','#5c6bc0'];
        for(var _sr=0;_sr<3;_sr++) for(var _sc=0;_sc<2;_sc++){
          ctx.fillStyle = _scaleColors[(_sr+_sc)%4];
          ctx.beginPath();
          var _sx=px+2+_sc*10+(_sr%2)*5, _sy=py+2+_sr*5;
          ctx.moveTo(_sx+5,_sy); ctx.bezierCurveTo(_sx+9,_sy,_sx+10,_sy+3,_sx+5,_sy+6);
          ctx.bezierCurveTo(_sx,_sy+3,_sx+1,_sy,_sx+5,_sy); ctx.fill();
        }
        ctx.fillStyle = 'rgba(100,130,255,0.3)';
        ctx.fillRect(px,py,T,T);
      } else {
        // DEFAULT gym barrier
        ctx.fillStyle = '#e0c060'; ctx.fillRect(px,py,T,T);
        ctx.fillStyle = '#c8a030'; ctx.fillRect(px,py,T,3); ctx.fillRect(px,py,3,T);
        ctx.fillStyle = '#ffe080'; ctx.fillRect(px+2,py+2,T-4,T-4);
        ctx.fillStyle = '#e0c060'; ctx.fillRect(px+4,py+4,T-8,T-8);
      }
    } else if (tileId === 82) {
      // Plant — terracotta pot + green leaves
      ctx.fillStyle = '#b55830';
      ctx.fillRect(px + T/2 - 6, py + T - 12, 12, 10); // pot body
      ctx.fillRect(px + T/2 - 7, py + T - 13, 14, 3);  // pot rim
      ctx.fillStyle = '#1b5e20';
      ctx.beginPath(); ctx.ellipse(px + T/2, py + T - 18, 9, 7, -0.3, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#2e7d32';
      ctx.beginPath(); ctx.ellipse(px + T/2 + 5, py + T - 22, 7, 5, 0.4, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#388e3c';
      ctx.beginPath(); ctx.ellipse(px + T/2 - 5, py + T - 20, 6, 5, -0.5, 0, Math.PI*2); ctx.fill();
    }
  }

  // ── Player sprite ─────────────────────────────────────────────
  function drawPlayer(ctx, x, y, facing, frameTime) {
    const frame = Math.floor(frameTime / 7) % 4;
    const px = x - 8, py = y - 22;

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.beginPath(); ctx.ellipse(x, y, 7, 3, 0, 0, Math.PI*2); ctx.fill();

    // Legs (walk anim)
    ctx.fillStyle = '#1565C0';
    const legL = frame === 1 ? 3 : frame === 3 ? -2 : 0;
    const legR = frame === 1 ? -2 : frame === 3 ? 3 : 0;
    ctx.fillRect(px + 4, py + 22 + Math.abs(legL/2), 4, 5 + legL);
    ctx.fillRect(px + 8, py + 22 + Math.abs(legR/2), 4, 5 + legR);
    // Shoes
    ctx.fillStyle = '#0d0d0d';
    ctx.fillRect(px + 3, py + 27 + Math.abs(legL/2), 5, 2);
    ctx.fillRect(px + 7, py + 27 + Math.abs(legR/2), 5, 2);

    // Body
    ctx.fillStyle = '#1976D2';
    ctx.fillRect(px + 3, py + 12, 10, 10);
    // Bag (right side)
    ctx.fillStyle = '#8D6E63';
    ctx.fillRect(px + 12, py + 13, 5, 7);

    // Arms
    ctx.fillStyle = '#FFB74D';
    const armSwing = frame === 1 || frame === 3 ? 1 : 0;
    ctx.fillRect(px + 1, py + 13 + armSwing, 3, 6);
    ctx.fillRect(px + 12, py + 13 - armSwing, 3, 6);

    // Neck
    ctx.fillStyle = '#FFB74D';
    ctx.fillRect(px + 5, py + 8, 6, 5);

    // Head
    ctx.fillStyle = '#FFCC80';
    ctx.fillRect(px + 3, py + 0, 11, 10);

    // Hair
    ctx.fillStyle = '#4E342E';
    ctx.fillRect(px + 3, py - 2, 11, 5);
    ctx.fillRect(px + 2, py + 0, 3, 4); // side tuft

    // Eyes / face
    ctx.fillStyle = '#1a1a1a';
    if (facing === 'DOWN') {
      ctx.fillRect(px + 5, py + 5, 2, 2);
      ctx.fillRect(px + 9, py + 5, 2, 2);
      ctx.fillStyle = '#fff';
      ctx.fillRect(px + 5, py + 5, 1, 1);
      ctx.fillRect(px + 9, py + 5, 1, 1);
    } else if (facing === 'LEFT') {
      ctx.fillRect(px + 4, py + 5, 2, 2);
      ctx.fillStyle = '#fff'; ctx.fillRect(px + 4, py + 5, 1, 1);
    } else if (facing === 'RIGHT') {
      ctx.fillRect(px + 10, py + 5, 2, 2);
      ctx.fillStyle = '#fff'; ctx.fillRect(px + 10, py + 5, 1, 1);
    }
    // Cap brim
    ctx.fillStyle = '#FF5722';
    ctx.fillRect(px + 2, py + 2, 13, 3);
    ctx.fillRect(px + 1, py + 3, 15, 2); // wider brim
  }

  // ── NPC sprite ────────────────────────────────────────────────
  // Visual style per sprite key — arrays of variants, seeded by NPC position for diversity
  const _NPC_STYLE = {
    NPC_MAN: [
      { shirt:'#1565C0', pants:'#3E2723', hair:'#3E2723', skin:'#FFCC80', hatCol:null,     small:false },
      { shirt:'#2E7D32', pants:'#212121', hair:'#795548', skin:'#FFCC80', hatCol:null,     small:false },
      { shirt:'#6A1B9A', pants:'#1B5E20', hair:'#424242', skin:'#FFECB3', hatCol:null,     small:false },
      { shirt:'#F57F17', pants:'#37474F', hair:'#5D4037', skin:'#FFCC80', hatCol:'#37474F',small:false },
      { shirt:'#00695C', pants:'#4E342E', hair:'#212121', skin:'#D4A56A', hatCol:null,     small:false },
    ],
    NPC_WOMAN: [
      { shirt:'#AD1457', pants:'#6A1B9A', hair:'#8D6E63', skin:'#FFE0B2', hatCol:null,     small:false },
      { shirt:'#F06292', pants:'#CE93D8', hair:'#212121', skin:'#FFE0B2', hatCol:null,     small:false },
      { shirt:'#00897B', pants:'#4DB6AC', hair:'#795548', skin:'#FFCC80', hatCol:null,     small:false },
      { shirt:'#FFF176', pants:'#FF8A65', hair:'#D4E157', skin:'#FFE0B2', hatCol:null,     small:false },
      { shirt:'#1565C0', pants:'#1B5E20', hair:'#5D4037', skin:'#D4A56A', hatCol:null,     small:false },
    ],
    NPC_KID: [
      { shirt:'#2E7D32', pants:'#1565C0', hair:'#F9A825', skin:'#FFCC80', hatCol:null, small:true },
      { shirt:'#E91E63', pants:'#9C27B0', hair:'#FF8F00', skin:'#FFE0B2', hatCol:null, small:true },
      { shirt:'#FF5722', pants:'#607D8B', hair:'#6D4C41', skin:'#FFCC80', hatCol:null, small:true },
      { shirt:'#00BCD4', pants:'#FF7043', hair:'#212121', skin:'#FFECB3', hatCol:null, small:true },
    ],
    NPC_PROF:       [{ shirt:'#ECEFF1', pants:'#455A64', hair:'#9E9E9E', skin:'#FFE0B2', hatCol:null,      small:false }],
    NPC_LEADER:     [{ shirt:'#E65100', pants:'#1A237E', hair:'#212121', skin:'#FFCC80', hatCol:'#FFD700', small:false }],
    NPC_HEALER:     [{ shirt:'#F8BBD0', pants:'#F8BBD0', hair:'#FFF8E1', skin:'#FFE0B2', hatCol:'#ffffff', small:false }],
    NPC_GRUNT:      [{ shirt:'#212121', pants:'#212121', hair:'#212121', skin:'#FFCC80', hatCol:null,      small:false }],
    NPC_SHOPKEEPER: [
      { shirt:'#F57F17', pants:'#5D4037', hair:'#5D4037', skin:'#FFCC80', hatCol:null,     small:false },
      { shirt:'#E64A19', pants:'#4E342E', hair:'#212121', skin:'#FFECB3', hatCol:null,     small:false },
    ],
    NPC_RIVAL:      [{ shirt:'#B71C1C', pants:'#1B5E20', hair:'#5D4037', skin:'#FFCC80', hatCol:null,     small:false }],
  };

  function drawNPC(ctx, npc, camX, camY) {
    const T  = DG.CANVAS.TILE_SIZE;
    const cx = npc.x * T - camX + T/2;
    const by = npc.y * T - camY + T;  // foot baseline

    // Night darkening: reduce alpha slightly so NPCs look dimmer outdoors at night
    const nightFactor = DG.getNightFactor ? DG.getNightFactor() : 0;
    const prevAlpha = ctx.globalAlpha;
    if (nightFactor > 0.3) {
      ctx.globalAlpha *= (1 - nightFactor * 0.3);
    }

    const styleArr = _NPC_STYLE[npc.spriteKey] || [{ shirt:'#E91E63', pants:'#5D4037', hair:'#333', skin:'#FFCC80', hatCol:null, small:false }];
    const styleIdx = styleArr.length > 1 ? Math.abs(((npc.x|0) * 7 + (npc.y|0) * 13)) % styleArr.length : 0;
    const st  = styleArr[styleIdx];
    const sc  = st.small ? 0.82 : 1.0;  // scale factor for kids
    const ofs = st.small ? 3 : 0;       // vertical shift up for smaller chars

    // Helper: draw relative to (cx, by) with optional scale
    const r = (dx, dy, w, h, col) => {
      ctx.fillStyle = col;
      ctx.fillRect(Math.round(cx + dx * sc), Math.round(by + dy * sc - ofs), Math.round(w * sc), Math.round(h * sc));
    };

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath(); ctx.ellipse(cx, by, 6 * sc, 2, 0, 0, Math.PI*2); ctx.fill();

    // Legs
    r(-4, -9,  4, 9, st.pants);
    r( 1, -9,  4, 9, st.pants);
    // Shoes
    r(-5, -2,  5, 2, '#1a1a1a');
    r( 1, -2,  5, 2, '#1a1a1a');

    // Body / shirt
    r(-6, -19, 12, 10, st.shirt);

    // Arms
    r(-8, -18,  3, 7, st.skin);
    r( 5, -18,  3, 7, st.skin);

    // Neck + head
    r(-5, -30, 10, 12, st.skin);

    // Hair
    r(-5, -33, 10, 5, st.hair);
    // Side hair tuft (women/kids get longer side hair)
    if (npc.spriteKey === 'NPC_WOMAN') {
      r(-6, -30, 2, 6, st.hair);  // left side lock
      r( 5, -30, 2, 6, st.hair);  // right side lock
    }

    // Hat (leaders get a gold band, healers get a white cap)
    if (st.hatCol) {
      r(-5, -36, 10, 4, st.hatCol);
      r(-4, -33, 8,  2, '#ffffff');
    }

    // Grunt badge ("T" insignia on chest)
    if (npc.spriteKey === 'NPC_GRUNT') {
      r(-1, -17, 2, 6, '#cc0000');
      r(-3, -17, 6, 2, '#cc0000');
    }

    // Professor: glasses
    if (npc.spriteKey === 'NPC_PROF') {
      r(-4, -24, 3, 2, '#888');
      r( 1, -24, 3, 2, '#888');
      r(-1, -24, 2, 1, '#888');
    }

    // Rival (Flint): spiky reddish-brown hair — draw spikes over base hair
    if (npc.spriteKey === 'NPC_RIVAL') {
      const spikeCol = '#7B3A10'; // slightly darker reddish-brown tip
      // Three spikes pointing up from hair
      r(-4, -37, 3, 5, st.hair);  // left spike
      r(-1, -39, 3, 7, st.hair);  // centre spike (tallest)
      r( 3, -37, 3, 5, st.hair);  // right spike
      // Darker tips
      r(-3, -39, 2, 2, spikeCol);
      r( 0, -41, 2, 2, spikeCol);
      r( 3, -39, 2, 2, spikeCol);
      // Green jacket collar detail
      r(-5, -20, 2, 4, '#2E7D32');
      r( 4, -20, 2, 4, '#2E7D32');
    }

    // Eyes — direction-aware
    const facing = npc.facing || 'DOWN';
    ctx.fillStyle = '#1a1a1a';
    if (facing === 'DOWN') {
      r(-2, -25, 2, 2, '#1a1a1a');
      r( 2, -25, 2, 2, '#1a1a1a');
    } else if (facing === 'LEFT') {
      r(-3, -25, 2, 2, '#1a1a1a');
    } else if (facing === 'RIGHT') {
      r( 2, -25, 2, 2, '#1a1a1a');
    } else { // UP — no eyes visible (back of head)
      // small neck detail only
    }

    // Restore globalAlpha after night darkening
    ctx.globalAlpha = prevAlpha;
  }

  // ── Color utilities ───────────────────────────────────────────
  function _hex2rgb(hex) {
    const h = hex.replace('#','');
    return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)];
  }
  function _darken(hex, amt) {
    amt = amt || 40;
    try {
      const [r,g,b] = _hex2rgb(hex);
      return `rgb(${Math.max(0,r-amt)},${Math.max(0,g-amt)},${Math.max(0,b-amt)})`;
    } catch(e) { return '#444'; }
  }
  function _lighten(hex, amt) {
    amt = amt || 50;
    try {
      const [r,g,b] = _hex2rgb(hex);
      return `rgb(${Math.min(255,r+amt)},${Math.min(255,g+amt)},${Math.min(255,b+amt)})`;
    } catch(e) { return '#ccc'; }
  }

  // Type accent colors
  const _TYPE_ACCENT = {
    FIRE:'#FF6600',WATER:'#0099DD',GRASS:'#44BB00',GROUND:'#CC8833',
    ROCK:'#9A8070',DRAGON:'#6655CC',PSYCHIC:'#DD4488',DARK:'#443366',
    ELECTRIC:'#FFCC00',ICE:'#88DDFF',STEEL:'#99AABB',GHOST:'#664488',
    FIGHTING:'#CC2233',FLYING:'#88AACC',POISON:'#884499',BUG:'#7799AA',
    FAIRY:'#FF88BB',NORMAL:'#999988',
  };

  // ── Archetype draw functions ───────────────────────────────────
  // All draw in 0-32×0-36 coordinate space, origin at top-left
  // Parameters: ctx, col, col2, accent, stage (0=baby,1=mid,2=final), variant (chain index)
  // Stage-based scaling is applied in drawMon() before calling these functions.
  // Within the function, stage drives: head size ratio, feature count, detail level.
  // Variant drives: plate shape, horn config, crest, tail feature — distinct silhouette per chain.

  // Shared: nice eye — er slightly larger for babies (passed from caller)
  function _eye(ctx, ex, ey, er) {
    er = er || 2.5;
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(ex, ey, er, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#111';
    ctx.beginPath(); ctx.arc(ex + er*0.2, ey + er*0.1, er * 0.6, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.beginPath(); ctx.arc(ex - er*0.25, ey - er*0.3, er * 0.3, 0, Math.PI*2); ctx.fill();
  }

  // Shared: shadow
  function _shadow(ctx, cx, cy, rx, ry) {
    ctx.fillStyle = 'rgba(0,0,0,0.22)';
    ctx.beginPath(); ctx.ellipse(cx, cy, rx||10, ry||3, 0, 0, Math.PI*2); ctx.fill();
  }

  // Shared: outline (call before main body, draws 1px dark halo)
  function _outline(ctx, fn, col) {
    ctx.save();
    ctx.fillStyle = _darken(col, 60);
    ctx.strokeStyle = _darken(col, 70);
    ctx.lineWidth = 2.5;
    fn();
    ctx.restore();
  }

  // ── CERATOPSIAN ───────────────────────────────────────────────
  // Round body, forward head, prominent horns, neck frill
  // Variants: 0=Fire/Tindrel (3-horn+frill), 1=Ground/Quakeling (1 big horn),
  //           2=Rock/Rocklett (2 blunt+bumps), 3=Fighting/Fightclaw (no horn, big jaw),
  //           4=Legendary/Crateron (massive frill+many horns)
  function _drawCeratopsian(ctx, col, col2, accent, stage, variant) {
    stage = stage || 0; variant = variant || 0;
    // Stage-adaptive body params
    const bW = 11 + stage * 1.5;   // half-width: 11, 12.5, 14
    const bH = 9  + stage * 1.0;   // half-height:  9, 10, 11
    const bY = 23 - stage * 0.5;   // body center Y

    _shadow(ctx, 16, 36, bW + 1, 3.5);

    // Tail
    ctx.fillStyle = _darken(col, 20);
    ctx.beginPath();
    ctx.moveTo(6, 22); ctx.quadraticCurveTo(0, 14, 2, 6);
    ctx.quadraticCurveTo(4, 4, 6, 8); ctx.quadraticCurveTo(7, 16, 8, 22);
    ctx.fill();
    // Tail tip — variant
    if (variant === 3) { // Fighting: spiked tip
      ctx.fillStyle = _darken(col, 40);
      ctx.beginPath(); ctx.moveTo(2, 6); ctx.lineTo(-3, 1); ctx.lineTo(0, 8); ctx.closePath(); ctx.fill();
    }

    // Body outline
    ctx.fillStyle = _darken(col, 50);
    ctx.beginPath(); ctx.ellipse(17, bY, bW + 1.5, bH + 1.5, -0.1, 0, Math.PI*2); ctx.fill();
    // Body
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.ellipse(17, bY, bW, bH, -0.1, 0, Math.PI*2); ctx.fill();
    // Belly
    ctx.fillStyle = _lighten(col, 30);
    ctx.beginPath(); ctx.ellipse(17, bY + 4, bW * 0.62, bH * 0.52, -0.1, 0, Math.PI*2); ctx.fill();
    // Highlight
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.beginPath(); ctx.ellipse(13, bY - 5, 5, 3.5, -0.4, 0, Math.PI*2); ctx.fill();

    // Rocky variant: bumpy skin texture
    if (variant === 2) {
      ctx.fillStyle = _darken(col, 22);
      for (let b = 0; b < 4 + stage; b++) {
        ctx.beginPath(); ctx.arc(9 + b * 4, bY - 2, 1.5 + b * 0.2, 0, Math.PI*2); ctx.fill();
      }
    }
    // Fighting variant: muscle ridge on back
    if (variant === 3) {
      ctx.fillStyle = _darken(col, 18);
      ctx.beginPath(); ctx.ellipse(17, bY - bH * 0.5, bW * 0.5, 3, 0, 0, Math.PI); ctx.fill();
    }

    // Neck
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.moveTo(22, bY - 8); ctx.lineTo(26, bY - 15); ctx.lineTo(30, bY - 11); ctx.lineTo(26, bY - 5);
    ctx.closePath(); ctx.fill();

    // Frill — variant-specific
    if (variant === 0) { // Fire: colorful fanned frill
      const frillCount = 3 + stage;
      for (let f = 0; f < frillCount; f++) {
        ctx.fillStyle = (f % 2 === 0) ? accent : _lighten(accent, 30);
        ctx.beginPath();
        ctx.moveTo(23, bY - 10 - f * 1.8);
        ctx.lineTo(22 + f * 2.2, bY - 18 - f * 2.5);
        ctx.lineTo(27, bY - 11 - f * 1.8 + 1);
        ctx.closePath(); ctx.fill();
      }
    } else if (variant === 4) { // Legendary: enormous dragon frill
      ctx.fillStyle = `${accent}44`;
      ctx.beginPath(); ctx.ellipse(22, bY - 20, 7, 13, 0.2, 0, Math.PI*2); ctx.fill();
      for (let f = 0; f < 7; f++) {
        ctx.fillStyle = (f % 2 === 0) ? accent : _darken(accent, 20);
        ctx.beginPath();
        ctx.moveTo(22, bY - 10 - f * 1.5);
        ctx.lineTo(18 + f * 2, bY - 22 - f * 2);
        ctx.lineTo(27, bY - 11 - f * 1.5 + 1);
        ctx.closePath(); ctx.fill();
      }
    } else if (variant === 2) { // Rock: bone-ridge frill nubs
      ctx.fillStyle = _darken(col, 10);
      for (let f = 0; f < 3; f++) {
        ctx.beginPath(); ctx.arc(23 + f * 1.5, bY - 11 - f * 2, 1.8, 0, Math.PI*2); ctx.fill();
      }
    }
    // variant 1 (Ground) and 3 (Fighting): thick neck, no frill

    // Head
    const headX = 26, headY = bY - 12;
    const headRx = 7.5 + (2 - stage) * 0.5; // babies have relatively bigger heads
    const headRy = 6.5 + (2 - stage) * 0.5;
    ctx.fillStyle = _darken(col, 40);
    ctx.beginPath(); ctx.ellipse(headX, headY, headRx + 1, headRy + 1, 0.2, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.ellipse(headX, headY, headRx, headRy, 0.2, 0, Math.PI*2); ctx.fill();

    // Horns — variant-specific
    ctx.fillStyle = '#2a1a0a';
    if (variant === 0) { // Fire: 2 long brow horns + nose horn
      ctx.beginPath(); ctx.moveTo(headX + 1, headY - 4); ctx.lineTo(headX + 5, headY - 12 - stage); ctx.lineTo(headX + 8, headY - 4); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(headX - 3, headY - 3); ctx.lineTo(headX,     headY - 10 - stage); ctx.lineTo(headX + 3, headY - 3); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(headX + 5, headY + 1); ctx.lineTo(headX + 10, headY - 2); ctx.lineTo(headX + 8, headY + 3); ctx.closePath(); ctx.fill();
    } else if (variant === 1) { // Ground: single large central horn
      const hornH = 10 + stage * 2;
      ctx.beginPath(); ctx.moveTo(headX - 2, headY - 4); ctx.lineTo(headX + 1, headY - 4 - hornH); ctx.lineTo(headX + 5, headY - 4); ctx.closePath(); ctx.fill();
    } else if (variant === 2) { // Rock: 2 shorter blunt horns
      ctx.beginPath(); ctx.moveTo(headX, headY - 4); ctx.lineTo(headX + 3, headY - 9); ctx.lineTo(headX + 6, headY - 3); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(headX - 4, headY - 3); ctx.lineTo(headX - 1, headY - 8); ctx.lineTo(headX + 1, headY - 2); ctx.closePath(); ctx.fill();
    } else if (variant === 3) { // Fighting: no horn — massive lower jaw instead
      ctx.fillStyle = _darken(col, 20);
      ctx.beginPath(); ctx.ellipse(headX + 5, headY + 5, 5 + stage, 3, 0.1, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#eee';
      for (let t = 0; t < 3; t++) ctx.fillRect(headX + 1 + t * 3, headY + 6, 2, 3);
    } else if (variant === 4) { // Legendary: ring of 5+ horns
      const hornCount = 4 + stage;
      for (let h = 0; h < hornCount; h++) {
        const hx = headX - 5 + h * 3.5;
        const hy = headY - 4;
        const hLen = 7 + (h === Math.floor(hornCount / 2) ? 4 : 0) + stage;
        ctx.fillStyle = '#1a0a00';
        ctx.beginPath(); ctx.moveTo(hx - 1, hy); ctx.lineTo(hx + 1, hy - hLen); ctx.lineTo(hx + 3, hy); ctx.closePath(); ctx.fill();
      }
      // Dragon-style nose ridge
      ctx.fillStyle = '#2a1a00';
      ctx.beginPath(); ctx.moveTo(headX + 5, headY + 1); ctx.lineTo(headX + 11, headY - 3); ctx.lineTo(headX + 9, headY + 3); ctx.closePath(); ctx.fill();
    }

    // Snout (all variants)
    ctx.fillStyle = _darken(col, 20);
    ctx.beginPath(); ctx.ellipse(headX + 5, headY + 1, 4, 2.5, 0.2, 0, Math.PI*2); ctx.fill();
    // FASE 6: neusgat
    ctx.fillStyle = _darken(col, 55);
    ctx.beginPath(); ctx.arc(headX + 7, headY + 0.5, 0.8, 0, Math.PI*2); ctx.fill();

    // Legs
    const legW = 4 + stage;
    const legH = 7 + stage;
    ctx.fillStyle = _darken(col, 25);
    ctx.fillRect(9,  bY + bH - 2, legW, legH);
    ctx.fillRect(17, bY + bH - 2, legW, legH);
    ctx.fillRect(10, bY + bH - 4, legW, 3);
    ctx.fillRect(17, bY + bH - 4, legW, 3);
    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(9,  bY + bH + legH - 2, legW, 2);
    ctx.fillRect(17, bY + bH + legH - 2, legW, 2);
    // FASE 6: klauwtjes aan de voorzijde van elke voet
    ctx.fillStyle = '#ddd5bb';
    [9, 17].forEach((lx) => {
      ctx.beginPath();
      ctx.moveTo(lx + legW - 1, bY + bH + legH - 2.2);
      ctx.lineTo(lx + legW + 1.8, bY + bH + legH - 0.4);
      ctx.lineTo(lx + legW - 1, bY + bH + legH);
      ctx.closePath(); ctx.fill();
    });

    // FASE 6: wenkbrauwrichel boven het oog — geeft de blik karakter
    ctx.fillStyle = _darken(col, 35);
    ctx.beginPath(); ctx.ellipse(headX + 2, headY - 3.8, 3.1, 1.2, 0.15, 0, Math.PI*2); ctx.fill();

    _eye(ctx, headX + 2, headY - 1, 2.2 + (2 - stage) * 0.4);
  }

  // ── STEGOSAUR ─────────────────────────────────────────────────
  // Low wide body, distinctive dorsal feature, small head, 4 legs
  // Variants: 0=Grass/Leafawn (leaf oval plates), 1=Fire/Embrix (flame plates),
  //           2=Steel/Steelback (flat hex armor), 3=Ice/Frostling (crystal spines)
  function _drawStegosaur(ctx, col, col2, accent, stage, variant) {
    stage = stage || 0; variant = variant || 0;
    const bW = 10.5 + stage * 1.25; // body half-width: 10.5, 11.75, 13
    const bH = 8.5  + stage * 0.75; // body half-height:  8.5,  9.25, 10
    const bY = 25   - stage * 0.5;  // body Y: 25, 24.5, 24
    const nPlates = 3 + stage;      // plate count: 3, 4, 5

    _shadow(ctx, 16, 36, bW + 1, 3.5);

    // ── Tail ─────────────────────────────────────────────────────
    ctx.fillStyle = _darken(col, 20);
    ctx.beginPath();
    ctx.moveTo(5, bY); ctx.quadraticCurveTo(-2, bY - 6, 0, bY - 15);
    ctx.quadraticCurveTo(2, bY - 17, 5, bY - 13); ctx.quadraticCurveTo(6, bY - 7, 7, bY);
    ctx.fill();

    // Tail tip — variant-specific
    if (variant === 0) { // Grass: leaf tip
      ctx.fillStyle = accent;
      ctx.beginPath(); ctx.ellipse(-1, bY - 15, 3, 5, -0.3, 0, Math.PI*2); ctx.fill();
      ctx.strokeStyle = _darken(accent, 30); ctx.lineWidth = 0.6;
      ctx.beginPath(); ctx.moveTo(-1, bY - 10); ctx.lineTo(-1, bY - 19); ctx.stroke();
    } else if (variant === 1) { // Fire: flame tip
      ctx.fillStyle = '#FF4400';
      ctx.beginPath(); ctx.moveTo(-1, bY-15); ctx.lineTo(-5, bY-21); ctx.lineTo(-2, bY-14); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#FFDD00';
      ctx.beginPath(); ctx.arc(-2, bY - 19, 1.2, 0, Math.PI*2); ctx.fill();
    } else if (variant === 2) { // Steel: blunt spike
      ctx.fillStyle = _lighten(col, 20);
      ctx.beginPath(); ctx.moveTo(-1, bY-15); ctx.lineTo(-5, bY-18); ctx.lineTo(-3, bY-13); ctx.closePath(); ctx.fill();
    } else { // Ice: icicle
      ctx.fillStyle = accent;
      ctx.beginPath(); ctx.moveTo(-2, bY-14); ctx.lineTo(-6, bY-21); ctx.lineTo(-4, bY-13); ctx.closePath(); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.beginPath(); ctx.arc(-4, bY-19, 0.7, 0, Math.PI*2); ctx.fill();
    }

    // ── Body ─────────────────────────────────────────────────────
    ctx.fillStyle = _darken(col, 50);
    ctx.beginPath(); ctx.ellipse(17, bY, bW + 1.5, bH + 1, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.ellipse(17, bY, bW, bH, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = _lighten(col, 35);
    ctx.beginPath(); ctx.ellipse(17, bY + 4, bW * 0.67, bH * 0.52, 0, 0, Math.PI*2); ctx.fill();

    // Body texture — variant-specific
    if (variant === 2) { // Steel: hexagonal armor cell pattern
      ctx.strokeStyle = _darken(col, 28);
      ctx.lineWidth = 0.7;
      for (let hx = 0; hx < 3; hx++) {
        for (let hy = 0; hy < 2; hy++) {
          ctx.beginPath(); ctx.arc(9 + hx * 5.5, bY - 1 + hy * 5, 2.5, 0, Math.PI*2); ctx.stroke();
        }
      }
    } else if (variant === 3) { // Ice: frost crackle lines
      ctx.strokeStyle = 'rgba(180,240,255,0.4)';
      ctx.lineWidth = 0.6;
      ctx.beginPath(); ctx.moveTo(10, bY - 2); ctx.lineTo(14, bY + 3); ctx.lineTo(19, bY - 1); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(17, bY + 4); ctx.lineTo(22, bY); ctx.lineTo(25, bY + 3); ctx.stroke();
    }

    // ── Dorsal feature — the KEY variant-specific silhouette element ──
    const plateStart   = 8;
    const plateSpacing = bW * 1.8 / nPlates;
    for (let i = 0; i < nPlates; i++) {
      const bx = plateStart + i * plateSpacing;
      const byCtr = bY - bH + 1; // top of body
      const midI  = Math.floor(nPlates / 2);
      const dist  = Math.abs(i - midI);
      const ph    = (6 + stage * 1.5) - dist * 1.5; // tallest in middle

      if (variant === 0) { // ── Grass: wide leaf-oval plates
        ctx.fillStyle = _darken(accent, 12);
        ctx.beginPath(); ctx.ellipse(bx, byCtr - ph * 0.4, 3.5, ph * 0.6, 0.1, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = accent;
        ctx.beginPath(); ctx.ellipse(bx, byCtr - ph * 0.4, 2.5, ph * 0.5, 0.1, 0, Math.PI*2); ctx.fill();
        // Leaf midrib vein
        ctx.strokeStyle = _darken(accent, 30); ctx.lineWidth = 0.5;
        ctx.beginPath(); ctx.moveTo(bx, byCtr); ctx.lineTo(bx, byCtr - ph * 0.9); ctx.stroke();
        // Side veins (final stage only)
        if (stage >= 2) {
          ctx.beginPath(); ctx.moveTo(bx, byCtr - ph * 0.5); ctx.lineTo(bx - 2, byCtr - ph * 0.7); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(bx, byCtr - ph * 0.5); ctx.lineTo(bx + 2, byCtr - ph * 0.7); ctx.stroke();
        }

      } else if (variant === 1) { // ── Fire: narrow flame-pointed plates
        ctx.fillStyle = _darken(accent, 15);
        ctx.beginPath(); ctx.moveTo(bx - 2, byCtr + 2); ctx.lineTo(bx, byCtr - ph); ctx.lineTo(bx + 2, byCtr + 2); ctx.closePath(); ctx.fill();
        ctx.fillStyle = accent;
        ctx.beginPath(); ctx.moveTo(bx - 1.5, byCtr + 1); ctx.lineTo(bx, byCtr - ph + 1); ctx.lineTo(bx + 1.5, byCtr + 1); ctx.closePath(); ctx.fill();
        // Hot ember at tip
        ctx.fillStyle = '#FFEE00';
        ctx.beginPath(); ctx.arc(bx, byCtr - ph, 1, 0, Math.PI*2); ctx.fill();
        // Secondary flame wisp (mid+ stage)
        if (stage >= 1 && dist <= 1) {
          ctx.fillStyle = `${accent}88`;
          ctx.beginPath(); ctx.moveTo(bx + 2, byCtr + 1); ctx.lineTo(bx + 4, byCtr - ph * 0.6); ctx.lineTo(bx + 5, byCtr + 1); ctx.closePath(); ctx.fill();
        }

      } else if (variant === 2) { // ── Steel: flat wide rectangular armor plates
        const platW = 5 + stage * 0.5;
        const platH = ph * 0.7;
        ctx.fillStyle = _darken(accent, 20);
        ctx.fillRect(bx - platW / 2 - 0.5, byCtr - platH, platW + 1, platH + 2);
        ctx.fillStyle = accent;
        ctx.fillRect(bx - platW / 2, byCtr - platH, platW, platH + 1);
        // Metallic sheen highlight
        ctx.fillStyle = 'rgba(210,235,255,0.55)';
        ctx.fillRect(bx - platW / 2, byCtr - platH, platW, 1.5);
        // Bolt detail (final stage)
        if (stage >= 2) {
          ctx.fillStyle = _darken(accent, 35);
          ctx.beginPath(); ctx.arc(bx, byCtr - platH * 0.5, 1, 0, Math.PI*2); ctx.fill();
        }

      } else { // ── Ice: diamond-crystal spike plates
        ctx.fillStyle = _darken(accent, 8);
        ctx.beginPath(); ctx.moveTo(bx - 2, byCtr + 1); ctx.lineTo(bx, byCtr - ph); ctx.lineTo(bx + 2, byCtr + 1); ctx.lineTo(bx, byCtr + 3); ctx.closePath(); ctx.fill();
        ctx.fillStyle = accent;
        ctx.beginPath(); ctx.moveTo(bx - 1.5, byCtr + 0.5); ctx.lineTo(bx, byCtr - ph + 1); ctx.lineTo(bx + 1.5, byCtr + 0.5); ctx.closePath(); ctx.fill();
        // Ice gleam
        ctx.fillStyle = 'rgba(255,255,255,0.75)';
        ctx.beginPath(); ctx.arc(bx - 0.5, byCtr - ph + 2, 0.8, 0, Math.PI*2); ctx.fill();
        // Second offset shard (mid+ stage)
        if (stage >= 1 && i % 2 === 0) {
          ctx.fillStyle = `${accent}88`;
          ctx.beginPath(); ctx.moveTo(bx + 2, byCtr + 1); ctx.lineTo(bx + 3.5, byCtr - ph * 0.65); ctx.lineTo(bx + 5, byCtr + 1); ctx.closePath(); ctx.fill();
        }
      }
    }

    // ── Neck ─────────────────────────────────────────────────────
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.moveTo(24, bY - 7); ctx.lineTo(28, bY - 14); ctx.lineTo(32, bY - 10); ctx.lineTo(28, bY - 3);
    ctx.closePath(); ctx.fill();

    // ── Head ─────────────────────────────────────────────────────
    const headX = 28, headY = bY - 13;
    const headRx = 5.5 + (2 - stage) * 0.6; // babies: bigger head
    const headRy = 4.5 + (2 - stage) * 0.5;
    ctx.fillStyle = _darken(col, 40);
    ctx.beginPath(); ctx.ellipse(headX, headY, headRx + 1, headRy + 1, 0.3, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.ellipse(headX, headY, headRx, headRy, 0.3, 0, Math.PI*2); ctx.fill();

    // Head crest / decorative feature by variant
    if (variant === 0) { // Grass: small flower bud on top
      ctx.fillStyle = accent;
      ctx.beginPath(); ctx.arc(headX - 1, headY - headRy, 1.5 + stage * 0.3, 0, Math.PI*2); ctx.fill();
      if (stage >= 1) { ctx.fillStyle = _lighten(accent, 30); ctx.beginPath(); ctx.arc(headX - 1, headY - headRy, 0.7, 0, Math.PI*2); ctx.fill(); }
    } else if (variant === 1) { // Fire: tiny ember crest
      ctx.fillStyle = '#FF4400';
      ctx.beginPath(); ctx.moveTo(headX - 2, headY - headRy + 1); ctx.lineTo(headX, headY - headRy - 2 - stage); ctx.lineTo(headX + 2, headY - headRy + 1); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#FFDD00'; ctx.beginPath(); ctx.arc(headX, headY - headRy - 1 - stage, 0.8, 0, Math.PI*2); ctx.fill();
    } else if (variant === 2) { // Steel: flat metal horn stub
      ctx.fillStyle = _lighten(col, 30);
      ctx.fillRect(headX - 1, headY - headRy - 2, 3, 3 + stage);
    } else { // Ice: ice shard crown
      ctx.fillStyle = accent;
      ctx.beginPath(); ctx.moveTo(headX - 2, headY - headRy + 1); ctx.lineTo(headX, headY - headRy - 3 - stage); ctx.lineTo(headX + 2, headY - headRy + 1); ctx.closePath(); ctx.fill();
      if (stage >= 1) { // second shard
        ctx.fillStyle = `${accent}aa`;
        ctx.beginPath(); ctx.moveTo(headX + 1, headY - headRy + 1); ctx.lineTo(headX + 3, headY - headRy - 2 - stage * 0.5); ctx.lineTo(headX + 4, headY - headRy + 1); ctx.closePath(); ctx.fill();
      }
    }

    // Snout
    ctx.fillStyle = _darken(col, 20);
    ctx.beginPath(); ctx.ellipse(headX + 4, headY + 0.5, 4, 2.5, 0.2, 0, Math.PI*2); ctx.fill();

    // ── Legs (4 stubby) ──────────────────────────────────────────
    const legW = 4 + stage;
    const legH = 6 + stage;
    ctx.fillStyle = _darken(col, 30);
    ctx.fillRect(8,  bY + bH - 2, legW, legH);
    ctx.fillRect(14, bY + bH - 1, legW, legH - 1);
    ctx.fillRect(20, bY + bH - 1, legW, legH - 1);
    ctx.fillRect(26, bY + bH - 2, legW, legH);
    ctx.fillStyle = '#222';
    ctx.fillRect(8,  bY + bH + legH - 3, legW, 1.5);
    ctx.fillRect(14, bY + bH + legH - 3, legW, 1.5);
    ctx.fillRect(20, bY + bH + legH - 3, legW, 1.5);
    ctx.fillRect(26, bY + bH + legH - 3, legW, 1.5);
    // FASE 6: teenklauwtjes op alle vier de poten
    ctx.fillStyle = '#ddd5bb';
    [8, 14, 20, 26].forEach((lx) => {
      ctx.beginPath();
      ctx.moveTo(lx + legW - 0.5, bY + bH + legH - 3);
      ctx.lineTo(lx + legW + 1.4, bY + bH + legH - 2);
      ctx.lineTo(lx + legW - 0.5, bY + bH + legH - 1.5);
      ctx.closePath(); ctx.fill();
    });

    // FASE 6: wenkbrauwrichel + neusgat
    ctx.fillStyle = _darken(col, 35);
    ctx.beginPath(); ctx.ellipse(headX + 2, headY - 2.8, 2.6, 1.0, 0.15, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = _darken(col, 55);
    ctx.beginPath(); ctx.arc(headX + 6, headY + 0.3, 0.7, 0, Math.PI*2); ctx.fill();

    _eye(ctx, headX + 2, headY - 0.5, 1.8 + (2 - stage) * 0.4);
  }

  // ── PLESIOSAUR ────────────────────────────────────────────────
  // Oval body, long neck, 4 paddle flippers
  // Variants: 0=Water/Aqueel (classic), 1=Psychic/Cryophin (icy crystal features),
  //           2=Legendary/Glaciodon (psychic glow aura)
  function _drawPlesiosaur(ctx, col, col2, accent, stage, variant) {
    stage = stage || 0; variant = variant || 0;
    const bR = 10 + stage * 1.5; // body radius: 10, 11.5, 13

    _shadow(ctx, 16, 36, bR, 3.5);

    // Legendary variant: psychic glow halo
    if (variant === 2) {
      ctx.fillStyle = `${accent}22`;
      ctx.beginPath(); ctx.ellipse(16, 24, bR + 5, bR + 4, 0, 0, Math.PI*2); ctx.fill();
    }

    // Body outline
    ctx.fillStyle = _darken(col, 50);
    ctx.beginPath(); ctx.ellipse(16, 24, bR + 1.5, bR - 0.5, 0, 0, Math.PI*2); ctx.fill();

    // Body
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.ellipse(16, 24, bR, bR - 2, 0, 0, Math.PI*2); ctx.fill();

    // Belly
    ctx.fillStyle = _lighten(col2 || col, 30);
    ctx.beginPath(); ctx.ellipse(16, 27, bR * 0.67, bR * 0.52, 0, 0, Math.PI*2); ctx.fill();

    // Body highlight
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.beginPath(); ctx.ellipse(13, 19, 5, 3.5, -0.3, 0, Math.PI*2); ctx.fill();

    // Ice variant: crystal dorsal ridges on back
    if (variant === 1) {
      for (let c = 0; c < 3 + stage; c++) {
        ctx.fillStyle = accent;
        const cx = 10 + c * 4, cy = 24 - bR * 0.7;
        ctx.beginPath(); ctx.moveTo(cx - 1.5, cy + 3); ctx.lineTo(cx, cy - 4 - stage); ctx.lineTo(cx + 1.5, cy + 3); ctx.closePath(); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.beginPath(); ctx.arc(cx - 0.5, cy - 2 - stage, 0.6, 0, Math.PI*2); ctx.fill();
      }
    }

    // Front flippers
    ctx.fillStyle = _darken(col, 20);
    ctx.beginPath(); ctx.ellipse(9, 26, 7, 3.5, 0.5, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(23, 26, 7, 3.5, -0.5, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.ellipse(9, 26, 6, 2.5, 0.5, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(23, 26, 6, 2.5, -0.5, 0, Math.PI*2); ctx.fill();

    // Back flippers
    ctx.fillStyle = _darken(col, 20);
    ctx.beginPath(); ctx.ellipse(10, 32, 6, 2.5, 0.3, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(22, 32, 6, 2.5, -0.3, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.ellipse(10, 32, 5, 2, 0.3, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(22, 32, 5, 2, -0.3, 0, Math.PI*2); ctx.fill();

    // Neck (S-curve) — ice variant is slightly shorter and thicker
    const neckThick = (variant === 1) ? 1.5 : 1;
    ctx.fillStyle = _darken(col, 40);
    ctx.beginPath();
    ctx.moveTo(19, 16); ctx.bezierCurveTo(22, 10, 24, 4, 26, 2);
    ctx.bezierCurveTo(28, 0, 30, 4, 29, 8);
    ctx.bezierCurveTo(28, 12, 25, 8, 22, 12);
    ctx.bezierCurveTo(20, 15, 20, 18, 20, 18);
    ctx.fill();
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.moveTo(20, 16); ctx.bezierCurveTo(22, 11, 24, 5, 26, 3);
    ctx.bezierCurveTo(27, 1, 29, 4, 28, 8);
    ctx.bezierCurveTo(27, 11, 25, 9, 22, 13);
    ctx.bezierCurveTo(21, 15, 21, 17, 21, 17);
    ctx.fill();

    // Head
    const headRx = 4.5 + (2 - stage) * 0.4;
    const headRy = 3.5 + (2 - stage) * 0.4;
    ctx.fillStyle = _darken(col, 40);
    ctx.beginPath(); ctx.ellipse(26, 3, headRx + 1, headRy + 1, 0.3, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.ellipse(26, 3, headRx, headRy, 0.3, 0, Math.PI*2); ctx.fill();

    // Head feature — variant
    if (variant === 1) { // Ice: ice horn on forehead
      ctx.fillStyle = accent;
      ctx.beginPath(); ctx.moveTo(24, 1); ctx.lineTo(23, -4 - stage); ctx.lineTo(26, 0); ctx.closePath(); ctx.fill();
    } else if (variant === 2) { // Legendary: psychic crystal on brow
      ctx.fillStyle = accent;
      ctx.beginPath(); ctx.arc(24, 0, 2, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.beginPath(); ctx.arc(23.5, -0.5, 0.7, 0, Math.PI*2); ctx.fill();
      // Psychic rings around body (legend only)
      ctx.strokeStyle = `${accent}55`;
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.ellipse(16, 24, bR + 3, bR + 1, 0, 0, Math.PI*2); ctx.stroke();
    }

    // Snout
    ctx.fillStyle = _darken(col, 20);
    ctx.beginPath(); ctx.moveTo(29, 4); ctx.lineTo(35, 3); ctx.lineTo(30, 6); ctx.fill();

    _eye(ctx, 27, 1, 1.8 + (2 - stage) * 0.3);
  }

  // ── PTEROSAUR ─────────────────────────────────────────────────
  // Large spread wings, beak, head crest
  // Variants: 0=Dragon/Ptryx (long back-crest, dragon scales), 1=Flying/Soarwing (broad eagle wings, no crest),
  //           2=Electric/Stormwing (lightning crest, jagged wings), 3=Electric/Sparklet (chubby, tiny wings),
  //           4=Electric/Sparkhorn (thunder-hammer crest)
  function _drawPterosaur(ctx, col, col2, accent, stage, variant) {
    stage = stage || 0; variant = variant || 0;
    // Variant 3 (Sparklet) has smaller wings — more bird-like
    const wingSpread = (variant === 3) ? 18 : 22 + stage * 1.5;

    _shadow(ctx, 16, 36, wingSpread * 0.65, 3);

    // ── Wings ────────────────────────────────────────────────────
    const wingDark = _darken(col, 30);
    if (variant === 3) { // Sparklet: tiny round stubby wings
      ctx.fillStyle = wingDark;
      ctx.beginPath(); ctx.ellipse(10, 20, 8, 5, 0.4, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(24, 20, 8, 5, -0.4, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = col;
      ctx.beginPath(); ctx.ellipse(10, 20, 6.5, 4, 0.4, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(24, 20, 6.5, 4, -0.4, 0, Math.PI*2); ctx.fill();
    } else {
      // Left wing
      const lx = -6 - stage;
      ctx.fillStyle = wingDark;
      ctx.beginPath(); ctx.moveTo(16, 20); ctx.bezierCurveTo(8, 14, -2, 8, lx, 14); ctx.bezierCurveTo(lx + 2, 22, 4, 24, 12, 24); ctx.closePath(); ctx.fill();
      ctx.fillStyle = col;
      ctx.beginPath(); ctx.moveTo(16, 20); ctx.bezierCurveTo(8, 15, 0, 10, lx + 4, 15); ctx.bezierCurveTo(lx + 6, 22, 5, 23, 12, 23); ctx.closePath(); ctx.fill();
      // Right wing
      const rx = 40 + stage;
      ctx.fillStyle = wingDark;
      ctx.beginPath(); ctx.moveTo(18, 20); ctx.bezierCurveTo(26, 14, 36, 8, rx, 14); ctx.bezierCurveTo(rx - 2, 22, 30, 24, 22, 24); ctx.closePath(); ctx.fill();
      ctx.fillStyle = col;
      ctx.beginPath(); ctx.moveTo(18, 20); ctx.bezierCurveTo(26, 15, 34, 10, rx - 4, 15); ctx.bezierCurveTo(rx - 6, 22, 28, 23, 22, 23); ctx.closePath(); ctx.fill();

      // Wing bone
      ctx.strokeStyle = _darken(col, 50); ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(16, 20); ctx.lineTo(lx + 4, 15); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(18, 20); ctx.lineTo(rx - 4, 15); ctx.stroke();

      // Wing markings — variant-specific
      if (variant === 0) { // Dragon: scale pattern on wings
        ctx.fillStyle = `${accent}44`;
        for (let s = 0; s < 4; s++) {
          ctx.beginPath(); ctx.arc(5 + s * 3, 17 + s, 2, 0, Math.PI); ctx.fill();
          ctx.beginPath(); ctx.arc(28 + s * 3, 17 + s, 2, 0, Math.PI); ctx.fill();
        }
      } else if (variant === 1) { // Flying: feather detail lines
        ctx.strokeStyle = _darken(col, 25); ctx.lineWidth = 0.7;
        for (let f = 1; f < 4; f++) {
          ctx.beginPath(); ctx.moveTo(16, 20); ctx.lineTo(lx + 4 + f * 3, 15 + f * 2); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(18, 20); ctx.lineTo(rx - 4 - f * 3, 15 + f * 2); ctx.stroke();
        }
      } else if (variant === 2) { // Electric: lightning bolt on wings
        ctx.fillStyle = accent;
        ctx.beginPath(); ctx.moveTo(4, 14); ctx.lineTo(7, 18); ctx.lineTo(4, 18); ctx.lineTo(7, 22); ctx.lineTo(10, 18); ctx.lineTo(7, 18); ctx.lineTo(10, 14); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(24, 14); ctx.lineTo(27, 18); ctx.lineTo(24, 18); ctx.lineTo(27, 22); ctx.lineTo(30, 18); ctx.lineTo(27, 18); ctx.lineTo(30, 14); ctx.closePath(); ctx.fill();
      } else if (variant === 4) { // Sparkhorn: bold electric marks
        ctx.strokeStyle = `${accent}bb`; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(16, 20); ctx.lineTo(2, 13); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(16, 20); ctx.lineTo(6, 22); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(18, 20); ctx.lineTo(32, 13); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(18, 20); ctx.lineTo(28, 22); ctx.stroke();
      }
    }

    // ── Body ─────────────────────────────────────────────────────
    const bodyH = (variant === 3) ? 8.5 + stage : 7 + stage;
    ctx.fillStyle = _darken(col, 40);
    ctx.beginPath(); ctx.ellipse(17, 22, 7 + stage, bodyH, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.ellipse(17, 22, 6 + stage, bodyH - 1, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = _lighten(col2 || col, 25);
    ctx.beginPath(); ctx.ellipse(17, 25, 3.5 + stage * 0.5, 4.5, 0, 0, Math.PI*2); ctx.fill();

    // ── Neck + head ───────────────────────────────────────────────
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.moveTo(14, 14); ctx.lineTo(18, 8); ctx.lineTo(22, 12); ctx.lineTo(18, 16);
    ctx.closePath(); ctx.fill();

    // ── Head crest — variant-specific silhouette ──────────────────
    if (variant === 0) { // Dragon: long swept-back crest
      const crestLen = 8 + stage * 2;
      ctx.fillStyle = _darken(accent, 10);
      ctx.beginPath(); ctx.moveTo(15, 11); ctx.lineTo(12 - crestLen, 6); ctx.lineTo(14, 12); ctx.closePath(); ctx.fill();
      ctx.fillStyle = accent;
      ctx.beginPath(); ctx.moveTo(15, 11); ctx.lineTo(13 - crestLen, 7); ctx.lineTo(15, 12); ctx.closePath(); ctx.fill();
    } else if (variant === 1) { // Flying: no crest, small round tuft
      ctx.fillStyle = _darken(col, 20);
      ctx.beginPath(); ctx.arc(18, 8, 2.5 + stage * 0.3, 0, Math.PI*2); ctx.fill();
    } else if (variant === 2) { // Electric: lightning bolt crest pointing up
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.moveTo(17, 11); ctx.lineTo(15, 5); ctx.lineTo(18, 7); ctx.lineTo(16, 1); ctx.lineTo(21, 6); ctx.lineTo(19, 8); ctx.lineTo(22, 11);
      ctx.closePath(); ctx.fill();
    } else if (variant === 3) { // Sparklet: round small bump
      ctx.fillStyle = accent;
      ctx.beginPath(); ctx.arc(18, 9, 2 + stage * 0.5, 0, Math.PI*2); ctx.fill();
    } else if (variant === 4) { // Sparkhorn: thunder-hammer shaped crest
      const hammerW = 6 + stage;
      ctx.fillStyle = _darken(accent, 10);
      ctx.fillRect(16 - hammerW / 2 - 0.5, 3.5, hammerW + 1, 3);  // hammer head
      ctx.fillRect(17.5, 6, 3, 5);                                  // handle
      ctx.fillStyle = accent;
      ctx.fillRect(16 - hammerW / 2, 4, hammerW, 2.5);
      ctx.fillRect(18, 6, 2, 4);
    }

    // Head
    const headRx = 5 + (2 - stage) * 0.3;
    ctx.fillStyle = _darken(col, 30);
    ctx.beginPath(); ctx.ellipse(18, 12, headRx + 0.5, 4, -0.2, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.ellipse(18, 12, headRx, 3.5, -0.2, 0, Math.PI*2); ctx.fill();

    // Beak — longer for dragon/flying, shorter for electric
    const beakLen = (variant <= 1) ? 28 : (variant === 3) ? 24 : 26;
    ctx.fillStyle = (variant === 2 || variant === 4) ? accent : '#e8c060';
    ctx.beginPath(); ctx.moveTo(21, 11); ctx.lineTo(beakLen, 9); ctx.lineTo(23, 14); ctx.closePath(); ctx.fill();

    // Feet
    ctx.fillStyle = '#444';
    ctx.fillRect(14, 30, 3, 6); ctx.fillRect(18, 30, 3, 6);
    ctx.fillRect(13, 35, 4, 2); ctx.fillRect(17, 35, 4, 2);
    // FASE 6: grijpklauwtjes aan de pootjes
    ctx.fillStyle = '#ddd5bb';
    [17, 21].forEach((fx) => {
      ctx.beginPath();
      ctx.moveTo(fx, 35.4); ctx.lineTo(fx + 1.8, 36.8); ctx.lineTo(fx, 37);
      ctx.closePath(); ctx.fill();
    });
    // FASE 6: klauwtje op de vleugelknik (niet bij de stompvleugel-variant)
    if (variant !== 3) {
      ctx.fillStyle = '#e8e0c8';
      ctx.beginPath(); ctx.moveTo(16, 20); ctx.lineTo(13.5, 17.6); ctx.lineTo(15.4, 18.2); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(18, 20); ctx.lineTo(20.5, 17.6); ctx.lineTo(18.6, 18.2); ctx.closePath(); ctx.fill();
    }

    _eye(ctx, 20, 11, 2 + (2 - stage) * 0.3);
  }

  // ── RAPTOR ────────────────────────────────────────────────────
  // Bipedal, lean forward, sickle claw, long stiff tail
  // Variants: 0=Dark/Shadowlet (feather crest, dark stripes), 1=Ground/Sandclaw (wider, ridge bumps, no crest),
  //           2=Dark-Dragon/Darkscale (scales, snout horn), 3=Normal/Quickfeet (round head, speed stripes),
  //           4=Poison/Viperfang (neck frill, forked tongue), 5=Legendary/Primordia (wing-arm stubs, bigger)
  function _drawRaptor(ctx, col, col2, accent, stage, variant) {
    stage = stage || 0; variant = variant || 0;
    const bW = 8 + stage * 1.0;    // body half-width: 8, 9, 10
    const bH = 7 + stage * 0.75;   // body half-height

    _shadow(ctx, 16, 36, bW + 2, 3);

    // ── Tail ─────────────────────────────────────────────────────
    ctx.fillStyle = _darken(col, 20);
    ctx.beginPath();
    ctx.moveTo(10, 22); ctx.bezierCurveTo(4, 20, -2, 16, -4, 10);
    ctx.bezierCurveTo(-3, 8, 0, 9, 1, 11);
    ctx.bezierCurveTo(3, 15, 7, 18, 11, 22);
    ctx.fill();

    // Tail feature — variant
    if (variant === 0) { // Dark: feather tail fan
      ctx.fillStyle = _darken(accent, 10);
      for (let f = 0; f < 3 + stage; f++) {
        ctx.beginPath(); ctx.moveTo(-4 + f, 10 - f); ctx.lineTo(-7 + f, 5 - f); ctx.lineTo(-3 + f, 9 - f); ctx.closePath(); ctx.fill();
      }
    } else if (variant === 4) { // Poison: barbed tail tip
      ctx.fillStyle = accent;
      ctx.beginPath(); ctx.moveTo(-4, 10); ctx.lineTo(-8, 7); ctx.lineTo(-5, 12); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(-5, 9); ctx.lineTo(-9, 11); ctx.lineTo(-4, 12); ctx.closePath(); ctx.fill();
    } else if (variant === 5) { // Legendary: thick scaly tail, spine
      ctx.fillStyle = _darken(col, 35);
      ctx.beginPath(); ctx.moveTo(-4, 10); ctx.lineTo(-6, 6); ctx.lineTo(-2, 9); ctx.closePath(); ctx.fill();
    }

    // ── Body ─────────────────────────────────────────────────────
    // Variant 1 (Ground) is wider and heavier
    const bodyAngle = (variant === 1) ? -0.2 : -0.4;
    const extraW    = (variant === 1 || variant === 5) ? 2 : 0;
    ctx.fillStyle = _darken(col, 50);
    ctx.beginPath(); ctx.ellipse(18, 20, bW + extraW + 1, bH + 1, bodyAngle, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.ellipse(18, 20, bW + extraW, bH, bodyAngle, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = _lighten(col2 || col, 40);
    ctx.beginPath(); ctx.ellipse(18, 23, (bW + extraW) * 0.58, bH * 0.58, bodyAngle - 0.1, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.13)';
    ctx.beginPath(); ctx.ellipse(15, 16, 4, 2.8, -0.5, 0, Math.PI*2); ctx.fill();

    // Body detail — variant
    if (variant === 0) { // Dark: striped pattern
      ctx.fillStyle = _darken(col, 30);
      for (let s = 0; s < 3; s++) {
        ctx.fillRect(12 + s * 3, 18 + s, 2, 4 - s);
      }
    } else if (variant === 1) { // Ground: raised ridge bumps
      ctx.fillStyle = _darken(col, 22);
      for (let b = 0; b < 4; b++) {
        ctx.beginPath(); ctx.arc(11 + b * 4, 17, 2, 0, Math.PI*2); ctx.fill();
      }
    } else if (variant === 2) { // Dark-Dragon: overlapping scales
      ctx.fillStyle = _darken(col, 28);
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          ctx.beginPath(); ctx.arc(11 + r * 3.5, 17 + c * 2, 1.8, 0, Math.PI); ctx.fill();
        }
      }
    } else if (variant === 3) { // Normal: speed stripes
      ctx.fillStyle = accent;
      ctx.beginPath(); ctx.moveTo(11, 17); ctx.lineTo(20, 14); ctx.lineTo(21, 16); ctx.lineTo(12, 19); ctx.closePath(); ctx.fill();
      ctx.globalAlpha = 0.5;
      ctx.beginPath(); ctx.moveTo(11, 21); ctx.lineTo(18, 18); ctx.lineTo(19, 20); ctx.lineTo(12, 23); ctx.closePath(); ctx.fill();
      ctx.globalAlpha = 1;
    }

    // Dorsal stripe (accent) — skip for variant 3 already done
    if (variant !== 3) {
      ctx.fillStyle = accent;
      ctx.beginPath(); ctx.moveTo(12, 16); ctx.lineTo(20, 11); ctx.lineTo(21, 13); ctx.lineTo(13, 18); ctx.closePath(); ctx.fill();
    }

    // Arms — variant 5 (legendary) gets wing-arm stubs
    ctx.fillStyle = _darken(col, 20);
    if (variant === 5) {
      // Wing-arm stubs
      ctx.beginPath(); ctx.moveTo(22, 18); ctx.bezierCurveTo(28, 14, 32, 16, 30, 22); ctx.lineTo(25, 22); ctx.closePath(); ctx.fill();
      ctx.fillStyle = `${accent}88`;
      ctx.beginPath(); ctx.moveTo(22, 18); ctx.bezierCurveTo(28, 14, 31, 16, 29, 22); ctx.lineTo(25, 22); ctx.closePath(); ctx.fill();
    } else {
      ctx.fillRect(21, 18, 4, 5); ctx.fillRect(23, 22, 5, 2);
      ctx.fillStyle = '#111';
      ctx.fillRect(24, 22, 2, 3); ctx.fillRect(26, 23, 2, 2);
    }

    // Poison variant: neck frill/hood
    if (variant === 4) {
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.moveTo(21, 15); ctx.bezierCurveTo(26, 10, 30, 8, 28, 14);
      ctx.bezierCurveTo(26, 17, 23, 17, 22, 16);
      ctx.closePath(); ctx.fill();
      ctx.globalAlpha = 0.55;
      ctx.fillStyle = _lighten(accent, 30);
      ctx.beginPath(); ctx.ellipse(26, 11, 3, 4, 0.2, 0, Math.PI*2); ctx.fill();
      ctx.globalAlpha = 1;
    }

    // ── Neck ─────────────────────────────────────────────────────
    ctx.fillStyle = _darken(col, 40);
    ctx.beginPath(); ctx.moveTo(20, 14); ctx.lineTo(24, 8); ctx.lineTo(28, 12); ctx.lineTo(24, 16); ctx.closePath(); ctx.fill();
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.moveTo(21, 14); ctx.lineTo(24, 9); ctx.lineTo(27, 12); ctx.lineTo(24, 16); ctx.closePath(); ctx.fill();

    // ── Head ─────────────────────────────────────────────────────
    const headRx = 7 + (2 - stage) * 0.4 + (variant === 5 ? 1.5 : 0);
    const headRy = 5 + (2 - stage) * 0.3 + (variant === 5 ? 0.5 : 0);
    ctx.fillStyle = _darken(col, 40);
    ctx.beginPath(); ctx.ellipse(26, 9, headRx + 1, headRy + 1, 0.15, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.ellipse(26, 9, headRx, headRy, 0.15, 0, Math.PI*2); ctx.fill();

    // Head feature — variant
    if (variant === 0) { // Dark: feather crest on top
      const crestH = 4 + stage * 1.5;
      ctx.fillStyle = _darken(accent, 10);
      for (let f = 0; f < 3 + stage; f++) {
        ctx.beginPath(); ctx.moveTo(22 + f, 6); ctx.lineTo(21 + f, 6 - crestH + f * 0.5); ctx.lineTo(24 + f, 6); ctx.closePath(); ctx.fill();
      }
      ctx.fillStyle = accent;
      ctx.beginPath(); ctx.moveTo(23, 6); ctx.lineTo(22, 6 - crestH); ctx.lineTo(25, 6); ctx.closePath(); ctx.fill();
    } else if (variant === 2) { // Dark-Dragon: horn on snout
      ctx.fillStyle = _darken(col, 50);
      ctx.beginPath(); ctx.moveTo(31, 8); ctx.lineTo(35, 4); ctx.lineTo(33, 10); ctx.closePath(); ctx.fill();
    } else if (variant === 5) { // Legendary: large swept horn
      ctx.fillStyle = _darken(col, 50);
      ctx.beginPath(); ctx.moveTo(24, 4); ctx.lineTo(28, -3 - stage); ctx.lineTo(30, 4); ctx.closePath(); ctx.fill();
      ctx.fillStyle = accent;
      ctx.beginPath(); ctx.moveTo(25, 4); ctx.lineTo(28, -2 - stage); ctx.lineTo(29, 4); ctx.closePath(); ctx.fill();
    }

    // Snout/jaw
    ctx.fillStyle = _darken(col, 30);
    ctx.beginPath(); ctx.moveTo(30, 8); ctx.lineTo(36, 9); ctx.lineTo(36, 12); ctx.lineTo(30, 12); ctx.closePath(); ctx.fill();

    // Poison: forked tongue
    if (variant === 4) {
      ctx.strokeStyle = accent; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(36, 10); ctx.lineTo(40, 9); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(36, 10); ctx.lineTo(40, 11); ctx.stroke();
    }

    // Teeth
    ctx.fillStyle = '#fff';
    for (let i = 0; i < 3; i++) ctx.fillRect(31 + i * 2, 11, 1, 2);

    // Thighs
    ctx.fillStyle = _darken(col, 20);
    ctx.beginPath(); ctx.ellipse(15, 28, 4, 5.5, 0.2, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(20, 28, 4, 5.5, -0.2, 0, Math.PI*2); ctx.fill();

    // Lower legs
    ctx.fillStyle = _darken(col, 30);
    ctx.fillRect(12, 31, 4, 6); ctx.fillRect(18, 31, 4, 6);

    // Feet + sickle claw
    ctx.fillStyle = '#222';
    ctx.fillRect(10, 36, 6, 2); ctx.fillRect(16, 36, 6, 2);
    ctx.fillRect(10, 33, 2, 4); ctx.fillRect(17, 33, 2, 4);
    // FASE 6: echte sikkelklauw — het handelsmerk van de raptor
    ctx.fillStyle = '#e8e0c8';
    [12, 18].forEach((fx) => {
      ctx.beginPath();
      ctx.moveTo(fx, 35.5);
      ctx.quadraticCurveTo(fx + 2.5, 32.5, fx + 1.2, 31);
      ctx.quadraticCurveTo(fx + 2.8, 33, fx + 1.6, 36);
      ctx.closePath(); ctx.fill();
    });
    // FASE 6: teenklauwtjes aan de voorkant van de voeten
    [16, 22].forEach((fx) => {
      ctx.beginPath();
      ctx.moveTo(fx, 36); ctx.lineTo(fx + 2, 37.6); ctx.lineTo(fx, 38);
      ctx.closePath(); ctx.fill();
    });

    // FASE 6: wenkbrauwrichel — de roofdierblik
    ctx.fillStyle = _darken(col, 38);
    ctx.beginPath();
    ctx.moveTo(24.5, 4.6); ctx.lineTo(31.5, 5.4); ctx.lineTo(31, 7); ctx.lineTo(25, 6.4);
    ctx.closePath(); ctx.fill();

    _eye(ctx, 28, 7, 2.2 + (2 - stage) * 0.3);
  }

  // ── ANKYLOSAUR ────────────────────────────────────────────────
  // Very wide, low, armored, distinctive tail weapon
  // Variants: 0=Normal/Normlet (smooth round shell, small club), 1=Rock/Boneback (spiky shell, bone club),
  //           2=Ground/Digclaw (big digging claws, flat head), 3=Rock/Rockflip (boulder shell, rock-hammer club)
  function _drawAnkylosaur(ctx, col, col2, accent, stage, variant) {
    stage = stage || 0; variant = variant || 0;
    const bW = 13 + stage * 1.0;   // body half-width: 13, 14, 15
    const bH = 8.5 + stage * 0.75; // body half-height
    const bY = 25  - stage * 0.5;  // body center Y: 25, 24.5, 24

    _shadow(ctx, 16, 36, bW + 1, 4);

    // ── Tail ─────────────────────────────────────────────────────
    ctx.fillStyle = _darken(col, 30);
    ctx.beginPath();
    ctx.moveTo(5, 26); ctx.bezierCurveTo(0, 22, -2, 16, 0, 12);
    ctx.bezierCurveTo(1, 10, 3, 11, 4, 14);
    ctx.bezierCurveTo(5, 18, 6, 22, 7, 26);
    ctx.fill();

    // Tail weapon — variant-specific
    if (variant === 0) { // Normal: small round club
      ctx.fillStyle = _darken(col, 20);
      ctx.beginPath(); ctx.ellipse(0, 11, 4, 3, -0.3, 0, Math.PI*2); ctx.fill();
    } else if (variant === 1) { // Bone: spiky bone club
      ctx.fillStyle = _darken(accent, 10);
      ctx.beginPath(); ctx.ellipse(0, 11, 5, 4, -0.3, 0, Math.PI*2); ctx.fill();
      // Bone spikes
      ctx.fillStyle = '#eee';
      for (let s = 0; s < 4; s++) {
        const angle = (s / 4) * Math.PI * 2;
        ctx.beginPath(); ctx.moveTo(0, 11); ctx.lineTo(Math.cos(angle) * 6, 11 + Math.sin(angle) * 5); ctx.lineTo(Math.cos(angle + 0.4) * 3, 11 + Math.sin(angle + 0.4) * 3); ctx.closePath(); ctx.fill();
      }
    } else if (variant === 2) { // Ground: no tail club, just a blunt rounded tail
      ctx.fillStyle = _darken(col, 25);
      ctx.beginPath(); ctx.ellipse(0, 12, 3, 3, 0, 0, Math.PI*2); ctx.fill();
    } else { // Rock: flat rock-hammer style club
      ctx.fillStyle = _darken(accent, 10);
      ctx.fillRect(-5, 10, 9, 5); // flat wide rock club
      ctx.fillStyle = accent;
      ctx.fillRect(-4, 11, 7, 3);
      ctx.fillStyle = _darken(col, 20);
      ctx.fillRect(-2, 8, 3, 3); // handle neck
    }

    // ── Body ─────────────────────────────────────────────────────
    ctx.fillStyle = _darken(col, 55);
    ctx.beginPath(); ctx.ellipse(17, bY, bW + 1.5, bH + 1, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.ellipse(17, bY, bW, bH, 0, 0, Math.PI*2); ctx.fill();

    // Shell texture — variant-specific
    if (variant === 0) { // Normal: smooth rounded bumps (cute)
      ctx.fillStyle = _darken(col, 20);
      for (let r = 0; r < 2; r++) {
        for (let c = 0; c < 4 + stage; c++) {
          ctx.beginPath(); ctx.ellipse(7 + c * 4.5, 19 + r * 4, 2.5, 2, 0, 0, Math.PI*2); ctx.fill();
        }
      }
    } else if (variant === 1) { // Bone: bone-segment knobs + spines
      ctx.fillStyle = _darken(col, 30);
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 5; c++) {
          const sx = 6 + c * 4.5, sy = 18 + r * 4;
          ctx.beginPath(); ctx.ellipse(sx, sy, 2, 1.5, 0, 0, Math.PI*2); ctx.fill();
        }
      }
      // Bone-white dorsal spines
      ctx.fillStyle = '#ddd';
      for (let i = 0; i < 5 + stage; i++) {
        const sx = 8 + i * (bW * 1.6 / (5 + stage));
        const spBase = bY - bH + 1;
        ctx.beginPath(); ctx.moveTo(sx - 1.5, spBase); ctx.lineTo(sx, spBase - 6 - stage); ctx.lineTo(sx + 1.5, spBase); ctx.closePath(); ctx.fill();
      }
    } else if (variant === 2) { // Ground: ridged/furrowed earth texture
      ctx.strokeStyle = _darken(col, 25); ctx.lineWidth = 1;
      for (let r = 0; r < 3; r++) {
        ctx.beginPath(); ctx.ellipse(17, 20 + r * 4, bW * 0.7, 1.5, 0, 0, Math.PI); ctx.stroke();
      }
      // Big digging claws on front
      ctx.fillStyle = _darken(col, 35);
      for (let c = 0; c < 3; c++) {
        ctx.beginPath(); ctx.moveTo(27 + c, 24); ctx.lineTo(32 + c, 20 + c); ctx.lineTo(31 + c, 25); ctx.closePath(); ctx.fill();
      }
    } else { // Rock: smooth boulder look
      ctx.fillStyle = _darken(col, 15);
      ctx.beginPath(); ctx.ellipse(17, 22, bW * 0.7, bH * 0.5, 0, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = 'rgba(200,200,200,0.2)';
      ctx.beginPath(); ctx.ellipse(12, 19, 5, 3, -0.3, 0, Math.PI*2); ctx.fill(); // highlight
    }

    // Dorsal edge spikes (variants 0 and 1 only)
    if (variant < 2) {
      ctx.fillStyle = (variant === 1) ? '#ddd' : accent;
      const spikeCount = 4 + stage;
      const spikeBase = bY - bH + 1; // top edge of body
      for (let i = 0; i < spikeCount; i++) {
        const sx = 8 + i * (bW * 1.8 / spikeCount);
        const sh = (variant === 0) ? 4 : 6 + stage;
        ctx.beginPath(); ctx.moveTo(sx - 2, spikeBase); ctx.lineTo(sx, spikeBase - sh); ctx.lineTo(sx + 2, spikeBase); ctx.closePath(); ctx.fill();
      }
    }

    // Belly
    ctx.fillStyle = _lighten(col2 || col, 30);
    ctx.beginPath(); ctx.ellipse(17, bY + 5, bW * 0.63, 4, 0, 0, Math.PI*2); ctx.fill();

    // ── Neck + head ───────────────────────────────────────────────
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.moveTo(24, bY - 5); ctx.lineTo(28, bY - 11); ctx.lineTo(32, bY - 7); ctx.lineTo(28, bY - 2);
    ctx.closePath(); ctx.fill();

    // Variant 2 (Ground): neck/head armor ridge
    if (variant === 2) {
      ctx.fillStyle = _darken(col, 25);
      ctx.beginPath(); ctx.arc(28, bY - 9, 3, 0, Math.PI*2); ctx.fill();
    }

    // Head
    ctx.fillStyle = _darken(col, 40);
    const headRx = 5.5 + (2 - stage) * 0.4;
    const headRy = 4   + (2 - stage) * 0.3;
    const headY2 = bY - 10;
    ctx.beginPath(); ctx.ellipse(29, headY2, headRx + 1, headRy + 1, 0.2, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.ellipse(29, headY2, headRx, headRy, 0.2, 0, Math.PI*2); ctx.fill();

    // Snout/beak
    ctx.fillStyle = _darken(col, 20);
    ctx.beginPath(); ctx.moveTo(32, headY2 - 1); ctx.lineTo(37, headY2 - 1); ctx.lineTo(36, headY2 + 2); ctx.lineTo(31, headY2 + 2); ctx.fill();

    // Variant 0 (Normal): friendly round eyes + blush spot
    if (variant === 0 && stage === 0) {
      ctx.fillStyle = `${accent}88`;
      ctx.beginPath(); ctx.arc(27, headY2 + 2, 2, 0, Math.PI*2); ctx.fill(); // blush
    }

    // Short legs
    const legW = 4 + stage;
    const legH = 5 + stage;
    ctx.fillStyle = _darken(col, 35);
    ctx.fillRect(8,  bY + bH - 1, legW, legH); // using approximate positions
    ctx.fillRect(14, bY + bH,     legW, legH - 1);
    ctx.fillRect(20, bY + bH,     legW, legH - 1);
    ctx.fillRect(26, bY + bH - 1, legW, legH);
    ctx.fillStyle = '#222';
    ctx.fillRect(8,  bY + bH + legH - 2, legW, 1.5);
    ctx.fillRect(14, bY + bH + legH - 2, legW, 1.5);
    ctx.fillRect(20, bY + bH + legH - 2, legW, 1.5);
    ctx.fillRect(26, bY + bH + legH - 2, legW, 1.5);

    // Ground digging claws (visible on foot level)
    if (variant === 2) {
      ctx.fillStyle = _darken(col, 45);
      ctx.fillRect(8, bY + bH + legH - 2, 8, 2);
      ctx.fillRect(8, bY + bH + legH - 4, 2, 4); // big claw
    }

    _eye(ctx, 31, headY2 - 1, 1.8 + (2 - stage) * 0.3);
  }

  // ── SAUROPOD ─────────────────────────────────────────────────
  // Huge body, very long neck, long tail, pillar legs (single chain: Terradon)
  function _drawSauropod(ctx, col, col2, accent, stage, variant) {
    stage = stage || 0; variant = variant || 0;
    _shadow(ctx, 16, 36, 14 + stage, 4);

    // Long tail
    ctx.fillStyle = _darken(col, 20);
    ctx.beginPath();
    ctx.moveTo(8, 24); ctx.bezierCurveTo(2, 22, -4, 20, -6, 14);
    ctx.bezierCurveTo(-5, 10, -2, 10, 0, 13);
    ctx.bezierCurveTo(3, 18, 6, 20, 9, 24);
    ctx.fill();

    // Body
    ctx.fillStyle = _darken(col, 50);
    ctx.beginPath(); ctx.ellipse(17, 24, 14.5, 11.5, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.ellipse(17, 24, 13, 10, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = _lighten(col2 || col, 25);
    ctx.beginPath(); ctx.ellipse(17, 28, 8, 5.5, 0, 0, Math.PI*2); ctx.fill();

    // Highlight
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.beginPath(); ctx.ellipse(12, 18, 5, 3.5, -0.3, 0, Math.PI*2); ctx.fill();

    // Dorsal crest (accent)
    for (let i = 0; i < 4; i++) {
      const dx = 10 + i * 4;
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.moveTo(dx - 2, 16); ctx.lineTo(dx, 10 - i); ctx.lineTo(dx + 2, 16);
      ctx.closePath(); ctx.fill();
    }

    // Neck (very long, S-shaped)
    ctx.fillStyle = _darken(col, 40);
    ctx.beginPath();
    ctx.moveTo(22, 16); ctx.bezierCurveTo(26, 10, 28, 4, 26, 0);
    ctx.bezierCurveTo(22, -4, 20, 0, 22, 6);
    ctx.bezierCurveTo(24, 10, 24, 14, 24, 16);
    ctx.fill();
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.moveTo(23, 16); ctx.bezierCurveTo(27, 11, 29, 5, 27, 1);
    ctx.bezierCurveTo(24, -2, 22, 1, 23, 7);
    ctx.bezierCurveTo(25, 11, 25, 15, 25, 16);
    ctx.fill();
    ctx.fillStyle = _lighten(col2 || col, 20);
    ctx.beginPath();
    ctx.moveTo(23.5, 15); ctx.bezierCurveTo(26, 11, 27, 6, 26, 2);
    ctx.bezierCurveTo(25, 0, 24, 2, 24, 7);
    ctx.bezierCurveTo(25, 11, 25.5, 14, 25.5, 15);
    ctx.fill();

    // Small head
    ctx.fillStyle = _darken(col, 40);
    ctx.beginPath(); ctx.ellipse(25, 0, 4.5, 3.5, 0.1, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.ellipse(25, 0, 3.5, 2.5, 0.1, 0, Math.PI*2); ctx.fill();
    // Snout
    ctx.fillStyle = _darken(col, 20);
    ctx.beginPath(); ctx.ellipse(28, 0, 3, 2, 0, 0, Math.PI*2); ctx.fill();

    // Pillar legs
    ctx.fillStyle = _darken(col, 30);
    ctx.fillRect(7, 30, 6, 8);
    ctx.fillRect(14, 31, 5, 7);
    ctx.fillRect(20, 31, 5, 7);
    ctx.fillRect(26, 30, 6, 8);
    ctx.fillStyle = '#222';
    ctx.fillRect(7, 37, 6, 1.5);
    ctx.fillRect(14, 37, 5, 1.5);
    ctx.fillRect(20, 37, 5, 1.5);
    ctx.fillRect(26, 37, 6, 1.5);

    _eye(ctx, 27, -1, 1.8);
  }

  // ── AQUATIC ───────────────────────────────────────────────────
  // Fish/crocodilian hybrid, streamlined, dorsal fin
  // Variants: 0=Water-Ground/Mudfin (wide croc snout, mud texture), 1=Water-Poison/Marshfin (elongated, trailing fin),
  //           2=Water/Aquaflip (sleek dolphin), 3=Ice-Water/Icecap (crystal dorsal), 4=Psychic-Ground/Venomjaw (wide jaw, psychic ring)
  function _drawAquatic(ctx, col, col2, accent, stage, variant) {
    stage = stage || 0; variant = variant || 0;
    _shadow(ctx, 16, 36, 14 + stage, 3);

    // Tail fin — variant affects shape
    ctx.fillStyle = _darken(col, 20);
    ctx.beginPath();
    ctx.moveTo(6, 22);
    ctx.bezierCurveTo(-2, 18, -4, 12, -2, 8);
    ctx.bezierCurveTo(0, 6, 3, 9, 4, 14);
    ctx.lineTo(7, 22); ctx.fill();

    if (variant === 1) { // Poison: long trailing toxic fin
      ctx.fillStyle = accent;
      ctx.beginPath(); ctx.moveTo(-2, 8); ctx.lineTo(-8, 2); ctx.lineTo(-4, 6); ctx.lineTo(-6, 14); ctx.lineTo(-3, 12); ctx.lineTo(-4, 18); ctx.lineTo(0, 12); ctx.closePath(); ctx.fill();
    } else if (variant === 3) { // Ice: forked icicle tail
      ctx.fillStyle = accent;
      ctx.beginPath(); ctx.moveTo(-2, 8); ctx.lineTo(-7, 1); ctx.lineTo(-5, 9); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(-2, 8); ctx.lineTo(-6, 15); ctx.lineTo(-4, 9); ctx.closePath(); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.beginPath(); ctx.arc(-6, 2, 0.8, 0, Math.PI*2); ctx.fill();
    } else {
      ctx.fillStyle = accent;
      ctx.beginPath(); ctx.moveTo(-2, 8); ctx.lineTo(-6, 2); ctx.lineTo(0, 10); ctx.fill();
      ctx.beginPath(); ctx.moveTo(-2, 8); ctx.lineTo(-6, 14); ctx.lineTo(1, 10); ctx.fill();
    }

    // Psychic: energy ring (drawn behind body)
    if (variant === 4) {
      ctx.strokeStyle = `${accent}55`; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.ellipse(17, 22, 16, 11, -0.15, 0, Math.PI*2); ctx.stroke();
    }

    // Body outline
    ctx.fillStyle = _darken(col, 55);
    ctx.beginPath(); ctx.ellipse(17, 22, 13.5 + stage * 0.5, 9.5 + stage * 0.25, -0.15, 0, Math.PI*2); ctx.fill();
    // Body
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.ellipse(17, 22, 12 + stage * 0.5, 8.5 + stage * 0.25, -0.15, 0, Math.PI*2); ctx.fill();
    // Belly
    ctx.fillStyle = _lighten(col2 || col, 35);
    ctx.beginPath(); ctx.ellipse(17, 26, 8, 5, -0.1, 0, Math.PI*2); ctx.fill();

    // Body texture — variant
    if (variant === 0) { // Mudfin: mud splotch texture
      ctx.fillStyle = _darken(col, 25);
      ctx.beginPath(); ctx.ellipse(12, 21, 4, 2.5, 0.3, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(20, 19, 3, 2, -0.2, 0, Math.PI*2); ctx.fill();
    } else if (variant === 3) { // Ice: frost belly pattern
      ctx.strokeStyle = 'rgba(200,240,255,0.45)'; ctx.lineWidth = 0.7;
      ctx.beginPath(); ctx.moveTo(10, 22); ctx.lineTo(14, 26); ctx.lineTo(19, 22); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(16, 24); ctx.lineTo(20, 28); ctx.lineTo(24, 24); ctx.stroke();
    }

    // Scale detail (all variants get some)
    ctx.fillStyle = _darken(col, 20);
    for (let i = 0; i < 4; i++) {
      ctx.beginPath(); ctx.arc(10 + i * 4, 20, 3, 0, Math.PI); ctx.fill();
    }

    // ── Dorsal feature — variant-specific silhouette ──────────────
    if (variant === 0) { // Mudfin: standard dorsal fin + two bumps
      ctx.fillStyle = _darken(accent, 10);
      ctx.beginPath(); ctx.moveTo(10, 14); ctx.lineTo(14, 6); ctx.lineTo(22, 12); ctx.lineTo(18, 14); ctx.closePath(); ctx.fill();
      ctx.fillStyle = accent;
      ctx.beginPath(); ctx.moveTo(11, 14); ctx.lineTo(14, 7); ctx.lineTo(21, 13); ctx.lineTo(17, 14); ctx.closePath(); ctx.fill();
    } else if (variant === 1) { // Marshfin: tall sweeping poison fin
      ctx.fillStyle = _darken(accent, 10);
      ctx.beginPath(); ctx.moveTo(8, 15); ctx.lineTo(12, 2 - stage); ctx.lineTo(24, 13); ctx.lineTo(18, 15); ctx.closePath(); ctx.fill();
      ctx.fillStyle = accent;
      ctx.beginPath(); ctx.moveTo(9, 15); ctx.lineTo(12, 3 - stage); ctx.lineTo(23, 13); ctx.lineTo(17, 15); ctx.closePath(); ctx.fill();
      // Drip detail
      ctx.fillStyle = `${accent}88`;
      ctx.beginPath(); ctx.arc(14, 5 - stage, 1.5, 0, Math.PI*2); ctx.fill();
    } else if (variant === 2) { // Aquaflip: smooth curved sleek dorsal
      ctx.fillStyle = _darken(accent, 5);
      ctx.beginPath(); ctx.moveTo(12, 14); ctx.bezierCurveTo(14, 8, 18, 8, 21, 13); ctx.lineTo(18, 14); ctx.closePath(); ctx.fill();
      ctx.fillStyle = accent;
      ctx.beginPath(); ctx.moveTo(13, 14); ctx.bezierCurveTo(15, 9, 18, 9, 20, 13); ctx.lineTo(17, 14); ctx.closePath(); ctx.fill();
    } else if (variant === 3) { // Icecap: multiple crystal ice spines
      for (let c = 0; c < 3 + stage; c++) {
        const cx = 10 + c * 4;
        ctx.fillStyle = _darken(accent, 10);
        ctx.beginPath(); ctx.moveTo(cx - 1.5, 14); ctx.lineTo(cx, 5 - stage + c); ctx.lineTo(cx + 1.5, 14); ctx.closePath(); ctx.fill();
        ctx.fillStyle = accent;
        ctx.beginPath(); ctx.moveTo(cx - 1, 14); ctx.lineTo(cx, 6 - stage + c); ctx.lineTo(cx + 1, 14); ctx.closePath(); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.65)';
        ctx.beginPath(); ctx.arc(cx - 0.3, 7 - stage + c, 0.7, 0, Math.PI*2); ctx.fill();
      }
    } else { // Venomjaw (4): low fin + psychic crest
      ctx.fillStyle = accent;
      ctx.beginPath(); ctx.moveTo(12, 14); ctx.lineTo(14, 9); ctx.lineTo(20, 13); ctx.lineTo(17, 14); ctx.closePath(); ctx.fill();
      // Psychic glow orbs
      ctx.fillStyle = `${accent}cc`;
      ctx.beginPath(); ctx.arc(14, 8, 2 + stage * 0.3, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.beginPath(); ctx.arc(13.5, 7.5, 0.7, 0, Math.PI*2); ctx.fill();
    }

    // Side fins
    ctx.fillStyle = _darken(col, 20);
    ctx.beginPath(); ctx.ellipse(9, 26, 6, 2.5, 0.4, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(23, 26, 6, 2.5, -0.4, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.ellipse(9, 26, 5, 2, 0.4, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(23, 26, 5, 2, -0.4, 0, Math.PI*2); ctx.fill();

    // ── Head ─────────────────────────────────────────────────────
    const headRx = 7 + (variant === 4 ? 1 : 0) + (2 - stage) * 0.3;
    const headRy = 5.5 + (2 - stage) * 0.25;
    ctx.fillStyle = _darken(col, 40);
    ctx.beginPath(); ctx.ellipse(27, 19, headRx + 1, headRy + 1, 0.1, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.ellipse(27, 19, headRx, headRy, 0.1, 0, Math.PI*2); ctx.fill();

    // ── Jaws/snout — variant-specific ────────────────────────────
    if (variant === 0) { // Mudfin: very wide flat croc snout
      ctx.fillStyle = _darken(col, 25);
      ctx.beginPath(); ctx.moveTo(27, 15); ctx.lineTo(38, 15); ctx.lineTo(38, 18); ctx.lineTo(36, 25); ctx.lineTo(23, 23); ctx.lineTo(25, 15); ctx.fill();
      ctx.fillStyle = _lighten(col2 || col, 20);
      ctx.beginPath(); ctx.moveTo(27, 16); ctx.lineTo(37, 16); ctx.lineTo(36, 23); ctx.lineTo(24, 22); ctx.lineTo(26, 16); ctx.fill();
    } else if (variant === 4) { // Venomjaw: extra-wide jaw with psychic glow inside
      ctx.fillStyle = _darken(col, 25);
      ctx.beginPath(); ctx.moveTo(27, 15); ctx.lineTo(38, 14); ctx.lineTo(38, 19); ctx.lineTo(35, 26); ctx.lineTo(22, 24); ctx.lineTo(24, 15); ctx.fill();
      ctx.fillStyle = `${accent}66`;
      ctx.beginPath(); ctx.moveTo(27, 16); ctx.lineTo(37, 15); ctx.lineTo(36, 23); ctx.lineTo(24, 22); ctx.lineTo(26, 16); ctx.fill();
    } else { // Standard snout (variants 1, 2, 3)
      ctx.fillStyle = _darken(col, 25);
      ctx.beginPath(); ctx.moveTo(28, 16); ctx.lineTo(36, 16); ctx.lineTo(36, 18); ctx.lineTo(34, 24); ctx.lineTo(24, 22); ctx.lineTo(26, 16); ctx.fill();
      ctx.fillStyle = _lighten(col2 || col, 20);
      ctx.beginPath(); ctx.moveTo(28, 17); ctx.lineTo(35, 17); ctx.lineTo(34, 22); ctx.lineTo(25, 21); ctx.lineTo(27, 17); ctx.fill();
    }
    // Teeth
    ctx.fillStyle = '#fff';
    for (let i = 0; i < 4; i++) ctx.fillRect(29 + i * 2, 21, 1.5, 2);

    // Nostril bumps
    ctx.fillStyle = _darken(col, 30);
    ctx.beginPath(); ctx.arc(32, 16, 1.5, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(34, 16, 1.5, 0, Math.PI*2); ctx.fill();

    // FASE 6: vin-membraan-lijnen op de zijvinnen
    ctx.strokeStyle = _darken(col, 35); ctx.lineWidth = 0.7;
    for (let fl = 0; fl < 3; fl++) {
      ctx.beginPath(); ctx.moveTo(11, 25); ctx.lineTo(5.5 + fl * 2.2, 27.5 + fl * 0.4); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(21, 25); ctx.lineTo(26.5 - fl * 2.2 + 4.4, 27.5 + fl * 0.4); ctx.stroke();
    }
    // FASE 6: kieuwspleten achter de kop
    ctx.strokeStyle = _darken(col, 40); ctx.lineWidth = 1;
    for (let gl = 0; gl < 2 + (stage > 0 ? 1 : 0); gl++) {
      ctx.beginPath();
      ctx.arc(21.5 - gl * 2, 19.5, 2.6, -0.9, 0.9);
      ctx.stroke();
    }
    // FASE 6: wenkbrauwrichel
    ctx.fillStyle = _darken(col, 35);
    ctx.beginPath(); ctx.ellipse(29, 15.4, 3, 1.1, 0.1, 0, Math.PI*2); ctx.fill();

    _eye(ctx, 29, 18, 2.2 + (2 - stage) * 0.3);
  }

  // ── GHOST ─────────────────────────────────────────────────────
  // Ethereal floating form, skull/bone features, wispy tendrils
  function _drawGhost(ctx, col, col2, accent, stage, variant) {
    stage = stage || 0; variant = variant || 0;
    // No ground shadow (floating)

    // Wispy tendrils (bottom) — more tendrils at higher stages
    const wisp = col2 || '#8866aa';
    const tendrilCount = 3 + stage;
    for (let i = 0; i < tendrilCount; i++) {
      ctx.fillStyle = `${accent}55`;
      ctx.beginPath();
      const tx = 6 + i * (20 / tendrilCount);
      ctx.moveTo(tx, 28);
      ctx.bezierCurveTo(tx - 3, 32, tx + 2, 36, tx - 1, 38);
      ctx.bezierCurveTo(tx - 2, 36, tx - 4, 32, tx, 28);
      ctx.fill();
    }

    // Glow aura
    ctx.fillStyle = `${accent}22`;
    ctx.beginPath(); ctx.ellipse(16, 18, 16, 16, 0, 0, Math.PI*2); ctx.fill();

    // Body (wispy)
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.moveTo(4, 28);
    ctx.bezierCurveTo(2, 22, 2, 14, 8, 8);
    ctx.bezierCurveTo(10, 4, 22, 4, 24, 8);
    ctx.bezierCurveTo(30, 14, 30, 22, 28, 28);
    ctx.bezierCurveTo(26, 26, 24, 30, 22, 28);
    ctx.bezierCurveTo(20, 26, 18, 30, 16, 28);
    ctx.bezierCurveTo(14, 26, 12, 30, 10, 28);
    ctx.bezierCurveTo(8, 26, 6, 30, 4, 28);
    ctx.closePath(); ctx.fill();

    // Skull pattern overlay
    ctx.fillStyle = _lighten(col, 40);
    ctx.beginPath(); ctx.ellipse(16, 15, 8, 9, 0, 0, Math.PI*2); ctx.fill();

    // Dark eye sockets
    ctx.fillStyle = _darken(accent, 30);
    ctx.beginPath(); ctx.ellipse(12, 14, 3, 3.5, 0, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(20, 14, 3, 3.5, 0, 0, Math.PI*2); ctx.fill();

    // Glowing eyes
    ctx.fillStyle = accent;
    ctx.beginPath(); ctx.ellipse(12, 14, 2, 2.5, 0, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(20, 14, 2, 2.5, 0, 0, Math.PI*2); ctx.fill();

    // Eye glow
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(11.5, 13.5, 0.8, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(19.5, 13.5, 0.8, 0, Math.PI*2); ctx.fill();

    // Jagged mouth
    ctx.strokeStyle = _darken(accent, 20);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(10, 22); ctx.lineTo(12, 24); ctx.lineTo(14, 21);
    ctx.lineTo(16, 24); ctx.lineTo(18, 21); ctx.lineTo(20, 24); ctx.lineTo(22, 22);
    ctx.stroke();
  }

  // ── BUG ───────────────────────────────────────────────────────
  // Insect: 6 legs, segmented body, mandibles, antennae
  function _drawBug(ctx, col, col2, accent, stage, variant) {
    stage = stage || 0; variant = variant || 0;
    _shadow(ctx, 16, 36, 11 + stage, 3);

    // Wings (folded, behind body)
    ctx.fillStyle = `${accent}66`;
    ctx.beginPath();
    ctx.moveTo(16, 18); ctx.bezierCurveTo(6, 12, 2, 6, 4, 2);
    ctx.bezierCurveTo(8, -2, 14, 4, 14, 10);
    ctx.closePath(); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(18, 18); ctx.bezierCurveTo(26, 12, 32, 6, 30, 2);
    ctx.bezierCurveTo(26, -2, 20, 4, 20, 10);
    ctx.closePath(); ctx.fill();

    // Abdomen (rear segment)
    ctx.fillStyle = _darken(col, 45);
    ctx.beginPath(); ctx.ellipse(12, 26, 8.5, 7.5, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.ellipse(12, 26, 7.5, 6.5, 0, 0, Math.PI*2); ctx.fill();
    // Stripes
    ctx.fillStyle = _darken(accent, 10);
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(12, 22 + i * 4, 7, 0, Math.PI);
      ctx.stroke();
    }

    // Thorax (middle segment)
    ctx.fillStyle = _darken(col, 40);
    ctx.beginPath(); ctx.ellipse(19, 19, 6.5, 7, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.ellipse(19, 19, 5.5, 6, 0, 0, Math.PI*2); ctx.fill();

    // 6 legs (3 pairs)
    ctx.strokeStyle = _darken(col, 40);
    ctx.lineWidth = 1.5;
    const legY = [18, 22, 26];
    for (let i = 0; i < 3; i++) {
      ctx.beginPath(); ctx.moveTo(14, legY[i]); ctx.lineTo(4, legY[i] + 6); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(24, legY[i]); ctx.lineTo(34, legY[i] + 6); ctx.stroke();
    }

    // Head
    ctx.fillStyle = _darken(col, 40);
    ctx.beginPath(); ctx.ellipse(22, 11, 6.5, 5.5, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.ellipse(22, 11, 5.5, 4.5, 0, 0, Math.PI*2); ctx.fill();

    // Mandibles
    ctx.fillStyle = '#222';
    ctx.beginPath(); ctx.moveTo(26, 12); ctx.lineTo(31, 10); ctx.lineTo(30, 14); ctx.fill();
    ctx.beginPath(); ctx.moveTo(26, 13); ctx.lineTo(31, 15); ctx.lineTo(30, 12); ctx.fill();

    // Antennae
    ctx.strokeStyle = _darken(col, 30);
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(20, 7); ctx.bezierCurveTo(18, 2, 14, -2, 12, -4); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(24, 7); ctx.bezierCurveTo(26, 2, 28, -2, 30, -4); ctx.stroke();
    ctx.fillStyle = _darken(accent, 10);
    ctx.beginPath(); ctx.arc(12, -4, 2, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(30, -4, 2, 0, Math.PI*2); ctx.fill();

    _eye(ctx, 24, 10, 2);
    _eye(ctx, 20, 10, 2);
  }

  // ── FAIRY ─────────────────────────────────────────────────────
  // Winged, floral, graceful bipedal
  function _drawFairy(ctx, col, col2, accent, stage, variant) {
    stage = stage || 0; variant = variant || 0;
    _shadow(ctx, 16, 36, 9 + stage, 2.5);

    // Fairy wings (4, delicate)
    const wingCol = accent + '80';
    ctx.fillStyle = wingCol;
    // Upper left
    ctx.beginPath();
    ctx.moveTo(14, 16); ctx.bezierCurveTo(4, 8, 0, 2, 4, 0);
    ctx.bezierCurveTo(10, -2, 14, 6, 14, 12);
    ctx.closePath(); ctx.fill();
    // Upper right
    ctx.beginPath();
    ctx.moveTo(20, 16); ctx.bezierCurveTo(28, 8, 34, 2, 30, 0);
    ctx.bezierCurveTo(24, -2, 20, 6, 20, 12);
    ctx.closePath(); ctx.fill();
    // Lower left
    ctx.beginPath();
    ctx.moveTo(14, 20); ctx.bezierCurveTo(6, 18, 2, 24, 6, 28);
    ctx.bezierCurveTo(10, 30, 14, 24, 14, 20);
    ctx.closePath(); ctx.fill();
    // Lower right
    ctx.beginPath();
    ctx.moveTo(20, 20); ctx.bezierCurveTo(28, 18, 32, 24, 28, 28);
    ctx.bezierCurveTo(24, 30, 20, 24, 20, 20);
    ctx.closePath(); ctx.fill();

    // Wing veins
    ctx.strokeStyle = `${accent}aa`;
    ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.moveTo(14, 16); ctx.lineTo(4, 0); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(20, 16); ctx.lineTo(30, 0); ctx.stroke();

    // Body
    ctx.fillStyle = _darken(col, 45);
    ctx.beginPath(); ctx.ellipse(17, 22, 7.5, 9.5, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.ellipse(17, 22, 6.5, 8.5, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = _lighten(col, 30);
    ctx.beginPath(); ctx.ellipse(17, 25, 4, 5.5, 0, 0, Math.PI*2); ctx.fill();

    // Floral collar (accent)
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      const fx = 17 + Math.cos(angle) * 6;
      const fy = 14 + Math.sin(angle) * 4;
      ctx.fillStyle = accent;
      ctx.beginPath(); ctx.arc(fx, fy, 2.5, 0, Math.PI*2); ctx.fill();
    }
    ctx.fillStyle = _lighten(accent, 40);
    ctx.beginPath(); ctx.arc(17, 14, 2.5, 0, Math.PI*2); ctx.fill();

    // Head
    ctx.fillStyle = _darken(col, 40);
    ctx.beginPath(); ctx.ellipse(17, 9, 5.5, 5.5, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.ellipse(17, 9, 4.5, 4.5, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = _lighten(col, 20);
    ctx.beginPath(); ctx.ellipse(16, 8, 2.5, 2, -0.2, 0, Math.PI*2); ctx.fill();

    // Horn/flower crown
    ctx.fillStyle = accent;
    ctx.beginPath(); ctx.moveTo(15, 5); ctx.lineTo(17, 1); ctx.lineTo(19, 5); ctx.fill();
    ctx.beginPath(); ctx.arc(17, 1, 2, 0, Math.PI*2); ctx.fill();

    // Legs
    ctx.fillStyle = _darken(col, 25);
    ctx.fillRect(14, 29, 3, 8);
    ctx.fillRect(18, 29, 3, 8);

    _eye(ctx, 15, 9, 2);
    _eye(ctx, 20, 9, 2);
  }

  // ── T-REX (large bipedal) ────────────────────────────────────
  // Variants: 0=Grass/Frondlet (vine decorations, leaf tail), 1=Grass/Leafcub (jungle markings, crest),
  //           2=Fire/Firecoal (ember crest, scorch marks)
  function _drawTrex(ctx, col, col2, accent, stage, variant) {
    stage = stage || 0; variant = variant || 0;
    _shadow(ctx, 16, 36, 12 + stage, 3.5);

    // Tail (thick, heavy)
    ctx.fillStyle = _darken(col, 20);
    ctx.beginPath();
    ctx.moveTo(8, 24); ctx.bezierCurveTo(2, 22, -2, 18, -2, 12);
    ctx.bezierCurveTo(-1, 8, 2, 9, 4, 13);
    ctx.bezierCurveTo(5, 18, 7, 21, 9, 24);
    ctx.fill();

    // Body (massive)
    ctx.fillStyle = _darken(col, 50);
    ctx.beginPath(); ctx.ellipse(18, 22, 12.5, 10.5, -0.3, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.ellipse(18, 22, 11, 9.5, -0.3, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = _lighten(col2 || col, 35);
    ctx.beginPath(); ctx.ellipse(18, 26, 7, 5.5, -0.2, 0, Math.PI*2); ctx.fill();

    // Dorsal ridge
    ctx.fillStyle = accent;
    for (let i = 0; i < 4; i++) {
      const dx = 10 + i * 4;
      ctx.beginPath();
      ctx.moveTo(dx - 2, 14); ctx.lineTo(dx, 9 - i); ctx.lineTo(dx + 2, 14);
      ctx.closePath(); ctx.fill();
    }

    // Tiny arms
    ctx.fillStyle = _darken(col, 30);
    ctx.fillRect(22, 16, 5, 4);
    ctx.fillRect(25, 19, 5, 2);
    ctx.fillStyle = '#222';
    ctx.fillRect(27, 19, 2, 3);
    ctx.fillRect(29, 20, 2, 2);

    // Variant body markings
    if (variant === 0) { // Frondlet: vine stripe down body
      ctx.strokeStyle = accent; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(10, 18); ctx.bezierCurveTo(13, 14, 17, 16, 14, 22); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(14, 20); ctx.bezierCurveTo(17, 16, 20, 18, 17, 24); ctx.stroke();
    } else if (variant === 1) { // Leafcub: dappled jungle spots
      ctx.fillStyle = _darken(col, 25);
      for (let d = 0; d < 4; d++) {
        ctx.beginPath(); ctx.ellipse(11 + d * 4, 19 + d % 2 * 3, 2, 1.5, d * 0.5, 0, Math.PI*2); ctx.fill();
      }
    } else if (variant === 2) { // Firecoal: scorch marks on body
      ctx.fillStyle = _darken(col, 40);
      ctx.beginPath(); ctx.ellipse(13, 18, 3, 2, 0.3, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(19, 21, 2.5, 1.8, -0.2, 0, Math.PI*2); ctx.fill();
      // ember glow
      ctx.fillStyle = `${accent}77`;
      ctx.beginPath(); ctx.arc(14, 17, 1.5, 0, Math.PI*2); ctx.fill();
    }

    // Neck (thick)
    ctx.fillStyle = _darken(col, 40);
    ctx.beginPath();
    ctx.moveTo(20, 13); ctx.lineTo(26, 6); ctx.lineTo(31, 10); ctx.lineTo(25, 17);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.moveTo(21, 13); ctx.lineTo(26, 7); ctx.lineTo(30, 10); ctx.lineTo(25, 17);
    ctx.closePath(); ctx.fill();

    // Massive head
    ctx.fillStyle = _darken(col, 50);
    ctx.beginPath(); ctx.ellipse(28, 8, 9.5 + stage * 0.5, 7.5 + stage * 0.25, 0.1, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.ellipse(28, 8, 8.5 + stage * 0.5, 6.5 + stage * 0.25, 0.1, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = _lighten(col, 15);
    ctx.beginPath(); ctx.ellipse(25, 6, 4, 3, -0.3, 0, Math.PI*2); ctx.fill();

    // Head feature — variant
    if (variant === 0) { // Frondlet: leaf crest on head
      ctx.fillStyle = accent;
      ctx.beginPath(); ctx.moveTo(25, 1); ctx.bezierCurveTo(22, -3, 26, -4, 28, 1); ctx.closePath(); ctx.fill();
    } else if (variant === 1) { // Leafcub: small spiky crest
      ctx.fillStyle = _darken(accent, 10);
      for (let c = 0; c < 3; c++) {
        ctx.beginPath(); ctx.moveTo(24 + c * 2, 1); ctx.lineTo(25 + c * 2, -3 - c); ctx.lineTo(26 + c * 2, 1); ctx.closePath(); ctx.fill();
      }
    } else if (variant === 2) { // Firecoal: ember crest
      ctx.fillStyle = '#FF4400';
      ctx.beginPath(); ctx.moveTo(24, 2); ctx.lineTo(26, -5 - stage); ctx.lineTo(28, 2); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#FFEE00';
      ctx.beginPath(); ctx.arc(26, -4 - stage, 1.2, 0, Math.PI*2); ctx.fill();
    }

    // Huge jaw (lower)
    ctx.fillStyle = _darken(col, 30);
    ctx.beginPath();
    ctx.moveTo(22, 10); ctx.lineTo(37, 10); ctx.lineTo(37, 14); ctx.lineTo(24, 14);
    ctx.closePath(); ctx.fill();
    // Teeth
    ctx.fillStyle = '#fff';
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(24 + i*2.5, 10);
      ctx.lineTo(24 + i*2.5 + 1, 6);
      ctx.lineTo(24 + i*2.5 + 2, 10);
      ctx.closePath(); ctx.fill();
      ctx.fillRect(24 + i*2.5, 10, 2, 2); // lower teeth
    }

    // Massive thighs
    ctx.fillStyle = _darken(col, 25);
    ctx.beginPath(); ctx.ellipse(13, 29, 5, 7, 0.2, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(20, 29, 5, 7, -0.2, 0, Math.PI*2); ctx.fill();

    // Lower legs
    ctx.fillStyle = _darken(col, 35);
    ctx.fillRect(10, 32, 5, 7);
    ctx.fillRect(17, 32, 5, 7);

    // Feet + claws
    ctx.fillStyle = '#222';
    ctx.fillRect(9, 38, 7, 2);
    ctx.fillRect(16, 38, 7, 2);
    ctx.fillRect(9, 34, 2, 5);
    ctx.fillRect(17, 34, 2, 5);
    // FASE 6: witte teenklauwen — zware roofdierpoten
    ctx.fillStyle = '#e8e0c8';
    [16, 23].forEach((fx) => {
      for (let cidx = 0; cidx < 2; cidx++) {
        ctx.beginPath();
        ctx.moveTo(fx - cidx * 2.4, 38.2);
        ctx.lineTo(fx + 2 - cidx * 2.4, 39.6);
        ctx.lineTo(fx - cidx * 2.4, 40);
        ctx.closePath(); ctx.fill();
      }
    });

    // FASE 6: zware wenkbrauwrichel + neusgat — de apex-predator-blik
    ctx.fillStyle = _darken(col, 42);
    ctx.beginPath();
    ctx.moveTo(26, 2.6); ctx.lineTo(34, 3.6); ctx.lineTo(33.4, 5.6); ctx.lineTo(26.6, 4.8);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = _darken(col, 55);
    ctx.beginPath(); ctx.arc(35.5, 7, 0.9, 0, Math.PI*2); ctx.fill();

    _eye(ctx, 30, 6, 2.8);
  }

  // ── GENERIC (fallback) ────────────────────────────────────────
  function _drawGeneric(ctx, col, col2, accent, stage, variant) {
    stage = stage || 0; variant = variant || 0;
    _shadow(ctx, 16, 36, 11 + stage, 3);

    ctx.fillStyle = _darken(col, 50);
    ctx.beginPath(); ctx.ellipse(16, 20, 13.5, 10.5, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.ellipse(16, 20, 12, 9.5, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = _lighten(col2 || col, 30);
    ctx.beginPath(); ctx.ellipse(16, 24, 7, 5, 0, 0, Math.PI*2); ctx.fill();

    ctx.fillStyle = _darken(col, 20);
    ctx.beginPath();
    ctx.moveTo(4, 18); ctx.quadraticCurveTo(0, 10, 2, 4);
    ctx.quadraticCurveTo(4, 2, 6, 8); ctx.quadraticCurveTo(7, 14, 8, 18);
    ctx.fill();

    ctx.fillStyle = _darken(col, 40);
    ctx.beginPath(); ctx.ellipse(24, 9, 8.5, 7.5, 0.3, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.ellipse(24, 9, 7.5, 6.5, 0.3, 0, Math.PI*2); ctx.fill();

    // Accent strip
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.moveTo(12, 16); ctx.lineTo(20, 12); ctx.lineTo(21, 14); ctx.lineTo(13, 18);
    ctx.closePath(); ctx.fill();

    ctx.fillStyle = _darken(col, 25);
    ctx.fillRect(9, 28, 5, 7);
    ctx.fillRect(17, 28, 5, 7);
    ctx.fillStyle = '#222';
    ctx.fillRect(9, 34, 5, 2);
    ctx.fillRect(17, 34, 5, 2);

    _eye(ctx, 26, 8, 2.5);
  }

  // ── Type-based ambient effects ────────────────────────────────
  // Drawn AFTER the archetype sprite — adds particles, glows, auras
  // All coordinates are in the sprite's 0-32 × 0-36 local space
  function _drawTypeAmbient(ctx, type, accent, stage) {
    const t = Date.now() / 1000;
    const inten = [0.45, 0.70, 1.0][stage] || 1.0;

    if (type === 'FIRE') {
      // Rising ember particles with animated flicker
      const emberCount = 3 + stage * 2;
      for (let e = 0; e < emberCount; e++) {
        const phase = (t * 1.8 + e * 1.1) % 1;
        const ex = 5 + (e * 9 + Math.sin(t + e) * 3) % 24;
        const ey = 34 - phase * 30;
        const er = (1.0 - phase) * (0.8 + e * 0.2);
        if (er < 0.1) continue;
        ctx.fillStyle = `rgba(255,${70 + e * 25},0,${(1 - phase) * 0.75 * inten})`;
        ctx.beginPath(); ctx.arc(ex, ey, er, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = `rgba(255,220,60,${(1 - phase) * 0.4 * inten})`;
        ctx.beginPath(); ctx.arc(ex, ey - er, er * 0.4, 0, Math.PI * 2); ctx.fill();
      }
      if (stage >= 2) { // Final: heat shimmer lines
        ctx.strokeStyle = `rgba(255,100,0,0.18)`;
        ctx.lineWidth = 0.7;
        for (let h = 0; h < 3; h++) {
          const hx = 8 + h * 8;
          ctx.beginPath(); ctx.moveTo(hx, 14); ctx.bezierCurveTo(hx + 2, 10, hx - 1, 6, hx + 1, 2); ctx.stroke();
        }
      }

    } else if (type === 'ELECTRIC') {
      // Lightning bolt sparks
      ctx.strokeStyle = `rgba(255,230,0,${0.65 * inten})`;
      ctx.lineWidth = 0.9;
      for (let s = 0; s < 2 + stage; s++) {
        const sx = 7 + s * 9;
        const flick = Math.sin(t * 8 + s * 2) > 0 ? 1 : 0;
        if (flick || stage >= 2) {
          ctx.beginPath(); ctx.moveTo(sx, 34); ctx.lineTo(sx + 2, 29); ctx.lineTo(sx - 1, 26); ctx.lineTo(sx + 2, 21); ctx.stroke();
        }
      }
      ctx.fillStyle = `rgba(255,255,120,${0.5 * inten})`;
      ctx.beginPath(); ctx.arc(4, 26, 1.8 * inten, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(29, 22, 1.5 * inten, 0, Math.PI * 2); ctx.fill();
      if (stage >= 2) { // Electric aura
        ctx.strokeStyle = `rgba(255,220,0,${0.15 * inten})`;
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.ellipse(16, 20, 15, 13, 0, 0, Math.PI * 2); ctx.stroke();
      }

    } else if (type === 'ICE') {
      // Drifting snowflake crystals
      for (let f = 0; f < 4 + stage; f++) {
        const phase = (t * 0.4 + f * 0.7) % 1;
        const fx = 3 + (f * 8 + Math.sin(t * 0.5 + f) * 3) % 27;
        const fy = 2 + phase * 32;
        const alpha = Math.min(phase * 4, 1 - phase * 0.5) * 0.6 * inten;
        ctx.fillStyle = `rgba(200,240,255,${alpha})`;
        ctx.beginPath(); ctx.arc(fx, fy, 1.2, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = `rgba(200,240,255,${alpha * 0.7})`; ctx.lineWidth = 0.5;
        ctx.beginPath(); ctx.moveTo(fx - 2, fy); ctx.lineTo(fx + 2, fy); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(fx, fy - 2); ctx.lineTo(fx, fy + 2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(fx - 1.4, fy - 1.4); ctx.lineTo(fx + 1.4, fy + 1.4); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(fx + 1.4, fy - 1.4); ctx.lineTo(fx - 1.4, fy + 1.4); ctx.stroke();
      }
      if (stage >= 2) { // Frost aura
        ctx.fillStyle = `rgba(180,235,255,0.08)`;
        ctx.beginPath(); ctx.ellipse(16, 18, 15, 13, 0, 0, Math.PI * 2); ctx.fill();
      }

    } else if (type === 'DARK') {
      // Shadow tendrils curling up from ground
      ctx.strokeStyle = `rgba(50,0,70,${0.5 * inten})`; ctx.lineWidth = 1.2;
      for (let d = 0; d < 3 + stage; d++) {
        const sway = Math.sin(t * 1.2 + d * 2) * 2;
        const dx = 6 + d * 7;
        ctx.beginPath(); ctx.moveTo(dx, 36);
        ctx.bezierCurveTo(dx + sway - 1, 30, dx - sway + 1, 24, dx + sway, 18 - d * 2);
        ctx.stroke();
      }
      ctx.fillStyle = `rgba(30,0,50,${0.22 * inten})`;
      ctx.beginPath(); ctx.ellipse(16, 20, 15, 12, 0, 0, Math.PI * 2); ctx.fill();
      if (stage >= 2) { // Dark aura pulse
        const pulse = 0.5 + 0.5 * Math.sin(t * 2);
        ctx.fillStyle = `rgba(80,0,100,${0.12 * pulse * inten})`;
        ctx.beginPath(); ctx.ellipse(16, 18, 18, 16, 0, 0, Math.PI * 2); ctx.fill();
      }

    } else if (type === 'DRAGON') {
      // Dragon power aura — layered overlapping glows
      const pulse = 0.6 + 0.4 * Math.sin(t * 1.5);
      ctx.fillStyle = `rgba(80,50,220,${0.10 * pulse * inten})`;
      ctx.beginPath(); ctx.ellipse(16, 18, 17, 14, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = `rgba(120,80,255,${0.08 * pulse * inten})`;
      ctx.beginPath(); ctx.ellipse(16, 18, 13, 10, 0, 0, Math.PI * 2); ctx.fill();
      // Scale shimmer
      ctx.strokeStyle = `rgba(150,100,255,${0.25 * inten})`; ctx.lineWidth = 0.7;
      for (let sc = 0; sc < 4 + stage; sc++) {
        ctx.beginPath(); ctx.arc(7 + sc * 5, 21, 3, 0, Math.PI); ctx.stroke();
      }
      if (stage >= 2) { // Ground energy cracks
        ctx.strokeStyle = `rgba(100,60,255,${0.35 * inten})`; ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.moveTo(4, 36); ctx.lineTo(10, 32); ctx.lineTo(7, 28); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(28, 36); ctx.lineTo(22, 32); ctx.lineTo(25, 28); ctx.stroke();
      }

    } else if (type === 'PSYCHIC') {
      // Orbiting psychic orbs + concentric rings
      for (let r = 0; r < 1 + stage; r++) {
        ctx.strokeStyle = `rgba(220,80,220,${(0.25 - r * 0.05) * inten})`; ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.ellipse(16, 18, 7 + r * 5, 5 + r * 3.5, t * 0.3 + r * 0.5, 0, Math.PI * 2); ctx.stroke();
      }
      // Orbiting dots
      for (let o = 0; o < 2 + stage; o++) {
        const angle = t * 1.5 + (o / (2 + stage)) * Math.PI * 2;
        const ox = 16 + Math.cos(angle) * (9 + stage * 2);
        const oy = 18 + Math.sin(angle) * (7 + stage * 1.5);
        ctx.fillStyle = `rgba(255,120,255,${0.55 * inten})`;
        ctx.beginPath(); ctx.arc(ox, oy, 1.5 + stage * 0.3, 0, Math.PI * 2); ctx.fill();
      }

    } else if (type === 'GHOST') {
      // Translucent ghost smoke
      const smoke = 0.5 + 0.5 * Math.sin(t * 0.8);
      ctx.fillStyle = `rgba(80,0,120,${0.18 * smoke * inten})`;
      ctx.beginPath(); ctx.ellipse(16, 16, 14, 12, 0, 0, Math.PI * 2); ctx.fill();

    } else if (type === 'POISON') {
      // Poison bubble drips
      for (let b = 0; b < 3 + stage; b++) {
        const phase = (t * 0.6 + b * 0.4) % 1;
        const bx = 7 + b * 7;
        const by = 26 + phase * 12;
        const br = (1 - phase * 0.5) * 1.4;
        ctx.fillStyle = `rgba(130,0,170,${(1 - phase) * 0.5 * inten})`;
        ctx.beginPath(); ctx.arc(bx, by, br, 0, Math.PI * 2); ctx.fill();
      }
      ctx.fillStyle = `rgba(100,0,140,${0.12 * inten})`;
      ctx.beginPath(); ctx.ellipse(16, 22, 13, 10, 0, 0, Math.PI * 2); ctx.fill();

    } else if (type === 'STEEL') {
      // Metallic sheen ring
      if (stage >= 1) {
        ctx.strokeStyle = `rgba(180,210,230,${0.25 * inten})`; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.ellipse(16, 20, 14, 11, 0, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.ellipse(16, 20, 10, 7, 0.2, 0, Math.PI * 2); ctx.stroke();
      }
    } else if (type === 'WATER') {
      // Water droplet ripple
      if (stage >= 1) {
        ctx.strokeStyle = `rgba(80,180,255,${0.2 * inten})`; ctx.lineWidth = 0.8;
        const ripple = (t * 0.8) % 1;
        ctx.beginPath(); ctx.ellipse(16, 34, 6 + ripple * 8, 2, 0, 0, Math.PI * 2); ctx.stroke();
      }
    } else if (type === 'GRASS') {
      // Floating leaf particles
      for (let l = 0; l < 2 + stage; l++) {
        const phase = (t * 0.5 + l * 0.8) % 1;
        const lx = 4 + l * 10 + Math.sin(t + l) * 3;
        const ly = 30 - phase * 28;
        const alpha = Math.min(phase * 3, 1 - phase) * 0.5 * inten;
        ctx.fillStyle = `rgba(80,200,60,${alpha})`;
        ctx.beginPath(); ctx.ellipse(lx, ly, 2, 1, phase * 3, 0, Math.PI * 2); ctx.fill();
      }
    }
  }

  // ══════════════════════════════════════════════════════════════
  // ── LEGENDARY DinoMon draw functions ─────────────────────────
  // Each legendary gets a bespoke, over-the-top design.
  // Coordinate space: 0-32 wide, 0-36 tall (local, before scale).
  // ══════════════════════════════════════════════════════════════

  // ── CRATERON (Fire/Dragon) ────────────────────────────────────
  // Volcanic ceratopsian king. Enormous frill of fire, crown of
  // 7 swept-back horns, lava cracks on body, dragon-scale texture,
  // ember breath, molten belly glow.
  function _drawCrateron(ctx, col, col2, accent, stage, variant) {
    const t = Date.now() / 1000;
    _shadow(ctx, 16, 36, 16, 5);

    // ── Lava ground cracks beneath feet ──
    ctx.strokeStyle = 'rgba(255,120,0,0.55)';
    ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(2, 35); ctx.lineTo(8, 32); ctx.lineTo(5, 29); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(30, 35); ctx.lineTo(24, 32); ctx.lineTo(27, 29); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(12, 36); ctx.lineTo(16, 33); ctx.lineTo(20, 36); ctx.stroke();

    // ── Tail — thick, dragon-scaled ──
    ctx.fillStyle = _darken(col, 25);
    ctx.beginPath();
    ctx.moveTo(5, 22); ctx.quadraticCurveTo(-2, 14, 1, 5);
    ctx.quadraticCurveTo(3, 2, 6, 7); ctx.quadraticCurveTo(7, 15, 8, 22);
    ctx.fill();
    // Tail spikes
    ctx.fillStyle = '#1a0800';
    for (let s = 0; s < 3; s++) {
      const sx = 1 + s * 2.5, sy = 12 - s * 3;
      ctx.beginPath(); ctx.moveTo(sx, sy+2); ctx.lineTo(sx-4, sy-3); ctx.lineTo(sx+1, sy+1); ctx.closePath(); ctx.fill();
    }

    // ── Enormous frill (main spectacle) ──
    // Frill base membrane
    const frillPulse = 0.85 + 0.15 * Math.sin(t * 2.1);
    ctx.fillStyle = `rgba(180,30,0,${0.35 * frillPulse})`;
    ctx.beginPath();
    ctx.moveTo(22, 10); ctx.bezierCurveTo(18, -2, 10, -6, 14, 2);
    ctx.bezierCurveTo(16, 6, 20, 8, 22, 10);
    ctx.fill();
    // Frill spines — 7 swept-back horns fanning from neck
    const frillAngles = [-1.1, -0.85, -0.6, -0.38, -0.18, 0.05, 0.25];
    const frillLens   = [9, 11, 13, 14, 13, 11, 9];
    for (let f = 0; f < 7; f++) {
      const ang  = frillAngles[f];
      const len  = frillLens[f];
      const fx   = 22, fy = 10;
      const ex   = fx + Math.cos(ang) * len;
      const ey   = fy + Math.sin(ang) * len;
      const grd  = ctx.createLinearGradient(fx, fy, ex, ey);
      grd.addColorStop(0, '#cc2200');
      grd.addColorStop(0.6, accent);
      grd.addColorStop(1, '#ffee00');
      ctx.strokeStyle = grd;
      ctx.lineWidth   = 2.5 - f * 0.15;
      ctx.beginPath(); ctx.moveTo(fx, fy); ctx.lineTo(ex, ey); ctx.stroke();
      // Ember tip glow
      const glowAlpha = 0.6 + 0.4 * Math.sin(t * 3 + f);
      ctx.fillStyle = `rgba(255,210,0,${glowAlpha})`;
      ctx.beginPath(); ctx.arc(ex, ey, 1.8, 0, Math.PI*2); ctx.fill();
    }
    // Frill webbing between spines
    ctx.fillStyle = `rgba(200,50,0,0.22)`;
    ctx.beginPath();
    ctx.moveTo(22, 10);
    for (let f = 0; f < 7; f++) {
      const ang = frillAngles[f], len = frillLens[f];
      ctx.lineTo(22 + Math.cos(ang) * len, 10 + Math.sin(ang) * len);
    }
    ctx.closePath(); ctx.fill();

    // ── Body — massive, forward-leaning ──
    ctx.fillStyle = _darken(col, 55);
    ctx.beginPath(); ctx.ellipse(17, 23, 15.5, 11.5, -0.08, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.ellipse(17, 23, 14, 10.5, -0.08, 0, Math.PI*2); ctx.fill();

    // Dragon-scale texture
    ctx.strokeStyle = _darken(col, 30);
    ctx.lineWidth = 0.6;
    for (let row = 0; row < 3; row++) {
      for (let col2 = 0; col2 < 4; col2++) {
        const sx = 7 + col2 * 5 + (row % 2) * 2.5, sy = 18 + row * 3.5;
        ctx.beginPath(); ctx.arc(sx, sy, 2, 0, Math.PI); ctx.stroke();
      }
    }

    // Lava belly glow — orange molten underside
    const bellyGlow = ctx.createRadialGradient(17, 26, 2, 17, 26, 10);
    bellyGlow.addColorStop(0, 'rgba(255,150,0,0.55)');
    bellyGlow.addColorStop(0.6, 'rgba(255,80,0,0.25)');
    bellyGlow.addColorStop(1, 'rgba(255,0,0,0)');
    ctx.fillStyle = bellyGlow;
    ctx.beginPath(); ctx.ellipse(17, 26, 10, 6, 0, 0, Math.PI*2); ctx.fill();

    // Lava cracks on body
    ctx.strokeStyle = 'rgba(255,140,0,0.7)';
    ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.moveTo(10, 22); ctx.lineTo(14, 25); ctx.lineTo(11, 28); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(20, 20); ctx.lineTo(24, 23); ctx.lineTo(21, 27); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(15, 28); ctx.lineTo(19, 30); ctx.stroke();

    // ── Neck ──
    ctx.fillStyle = _darken(col, 20);
    ctx.beginPath();
    ctx.moveTo(21, 15); ctx.lineTo(26, 6); ctx.lineTo(31, 11); ctx.lineTo(26, 17);
    ctx.closePath(); ctx.fill();

    // ── Head — imposing, forward-thrust ──
    const hX = 27, hY = 11;
    ctx.fillStyle = _darken(col, 55);
    ctx.beginPath(); ctx.ellipse(hX, hY, 9, 7, 0.25, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.ellipse(hX, hY, 8, 6.5, 0.25, 0, Math.PI*2); ctx.fill();

    // ── Crown horns — 3 massive forward horns ──
    ctx.fillStyle = '#1a0500';
    // Central massive horn
    ctx.beginPath(); ctx.moveTo(hX-1, hY-5); ctx.lineTo(hX+1, hY-17); ctx.lineTo(hX+4, hY-5); ctx.closePath(); ctx.fill();
    // Left brow horn
    ctx.beginPath(); ctx.moveTo(hX-5, hY-4); ctx.lineTo(hX-2, hY-13); ctx.lineTo(hX+0, hY-4); ctx.closePath(); ctx.fill();
    // Right brow horn
    ctx.beginPath(); ctx.moveTo(hX+3, hY-4); ctx.lineTo(hX+5, hY-12); ctx.lineTo(hX+8, hY-4); ctx.closePath(); ctx.fill();
    // Horn glow tips
    ctx.fillStyle = 'rgba(255,160,0,0.7)';
    ctx.beginPath(); ctx.arc(hX+1, hY-17, 1.5, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(hX-2, hY-13, 1.2, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(hX+5, hY-12, 1.2, 0, Math.PI*2); ctx.fill();

    // Nose horn (forward-jutting)
    ctx.fillStyle = '#2a0a00';
    ctx.beginPath(); ctx.moveTo(hX+5, hY+1); ctx.lineTo(hX+14, hY-2); ctx.lineTo(hX+7, hY+4); ctx.closePath(); ctx.fill();

    // Snout + jaw
    ctx.fillStyle = _darken(col, 25);
    ctx.beginPath(); ctx.ellipse(hX+6, hY+2, 5, 3, 0.2, 0, Math.PI*2); ctx.fill();
    // Teeth showing
    ctx.fillStyle = '#fff8e0';
    ctx.fillRect(hX+4, hY+3, 2, 2.5);
    ctx.fillRect(hX+7, hY+3, 2, 2.5);

    // Fire breath wisps from mouth
    for (let e = 0; e < 3; e++) {
      const phase = (t * 1.5 + e * 0.6) % 1;
      const ex2 = hX + 11 + phase * 5;
      const ey2 = hY + 1 - phase * 4;
      ctx.fillStyle = `rgba(255,${80 + e*40},0,${(1-phase)*0.6})`;
      ctx.beginPath(); ctx.arc(ex2, ey2, (1-phase)*2, 0, Math.PI*2); ctx.fill();
    }

    // ── Legs — thick, powerful ──
    ctx.fillStyle = _darken(col, 30);
    ctx.fillRect(8,  32, 6, 5); ctx.fillRect(19, 32, 6, 5);
    ctx.fillRect(9,  29, 5, 5); ctx.fillRect(20, 29, 5, 5);
    ctx.fillStyle = '#1a0800';
    ctx.fillRect(8,  36, 6, 2); ctx.fillRect(19, 36, 6, 2);

    // ── Eyes — twin glowing red ──
    _eye(ctx, hX+1, hY-1, 2.4);
    // Red glow overlay on eye
    ctx.fillStyle = 'rgba(255,50,0,0.45)';
    ctx.beginPath(); ctx.arc(hX+1, hY-1, 2.4, 0, Math.PI*2); ctx.fill();
  }

  // ── GLACIODON (Water/Psychic) ─────────────────────────────────
  // Ethereal crystal plesiosaur. Long glowing neck, psychic orbit
  // rings, translucent diamond-crystal armor, ice-prism dorsal fin,
  // serene & otherworldly.
  function _drawGlaciodon(ctx, col, col2, accent, stage, variant) {
    const t = Date.now() / 1000;
    _shadow(ctx, 16, 36, 14, 4);

    // ── Body — diamond-shaped, crystalline ──
    // Outer glow aura
    const aura = ctx.createRadialGradient(16, 22, 4, 16, 22, 16);
    aura.addColorStop(0, 'rgba(180,240,255,0.18)');
    aura.addColorStop(0.6, 'rgba(100,160,255,0.10)');
    aura.addColorStop(1, 'rgba(80,120,255,0)');
    ctx.fillStyle = aura;
    ctx.beginPath(); ctx.ellipse(16, 22, 17, 14, 0, 0, Math.PI*2); ctx.fill();

    // Body outline
    ctx.fillStyle = _darken(col, 50);
    ctx.beginPath(); ctx.ellipse(16, 23, 13.5, 9.5, 0, 0, Math.PI*2); ctx.fill();
    // Body
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.ellipse(16, 23, 12, 8.5, 0, 0, Math.PI*2); ctx.fill();

    // Crystal armor plates on body
    ctx.fillStyle = 'rgba(200,240,255,0.55)';
    // Left crystal plate
    ctx.beginPath();
    ctx.moveTo(7, 21); ctx.lineTo(5, 17); ctx.lineTo(9, 14); ctx.lineTo(12, 18); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(150,210,255,0.8)'; ctx.lineWidth = 0.7;
    ctx.beginPath();
    ctx.moveTo(7, 21); ctx.lineTo(5, 17); ctx.lineTo(9, 14); ctx.lineTo(12, 18); ctx.closePath(); ctx.stroke();
    // Right crystal plate
    ctx.fillStyle = 'rgba(180,230,255,0.50)';
    ctx.beginPath();
    ctx.moveTo(25, 22); ctx.lineTo(27, 18); ctx.lineTo(24, 14); ctx.lineTo(21, 18); ctx.closePath(); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(25, 22); ctx.lineTo(27, 18); ctx.lineTo(24, 14); ctx.lineTo(21, 18); ctx.closePath(); ctx.stroke();

    // Inner translucent glow
    const innerGlow = ctx.createRadialGradient(14, 20, 1, 14, 20, 8);
    innerGlow.addColorStop(0, 'rgba(220,255,255,0.45)');
    innerGlow.addColorStop(1, 'rgba(100,200,255,0)');
    ctx.fillStyle = innerGlow;
    ctx.beginPath(); ctx.ellipse(14, 20, 8, 5.5, -0.2, 0, Math.PI*2); ctx.fill();

    // ── Dorsal crystal fin — prism spine ──
    ctx.fillStyle = 'rgba(180,240,255,0.7)';
    ctx.beginPath();
    ctx.moveTo(12, 14); ctx.lineTo(9, 5); ctx.lineTo(16, 9); ctx.lineTo(20, 4); ctx.lineTo(22, 13);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(120,200,255,0.9)'; ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(12, 14); ctx.lineTo(9, 5); ctx.lineTo(16, 9); ctx.lineTo(20, 4); ctx.lineTo(22, 13);
    ctx.closePath(); ctx.stroke();
    // Prismatic shimmer on fin
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.beginPath(); ctx.moveTo(14, 11); ctx.lineTo(12, 7); ctx.lineTo(16, 9); ctx.closePath(); ctx.fill();

    // ── Long elegant neck ──
    ctx.fillStyle = _lighten(col, 15);
    ctx.beginPath();
    ctx.moveTo(20, 14); ctx.bezierCurveTo(24, 8, 26, 2, 24, -2);
    ctx.bezierCurveTo(25, -2, 27, -1, 27, 2);
    ctx.bezierCurveTo(29, 6, 27, 12, 24, 16);
    ctx.closePath(); ctx.fill();
    // Neck crystal sheen
    ctx.strokeStyle = 'rgba(180,240,255,0.4)'; ctx.lineWidth = 0.6;
    ctx.beginPath(); ctx.moveTo(22, 12); ctx.bezierCurveTo(25, 6, 26, 2, 25, 0); ctx.stroke();

    // ── Head — small, elegant, psychic crest ──
    const hX = 25, hY = 0;
    ctx.fillStyle = _darken(col, 45);
    ctx.beginPath(); ctx.ellipse(hX, hY, 6, 4.5, -0.3, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = _lighten(col, 10);
    ctx.beginPath(); ctx.ellipse(hX, hY, 5.5, 4, -0.3, 0, Math.PI*2); ctx.fill();

    // Psychic crown crest — 3 crystal prongs
    ctx.fillStyle = 'rgba(220,120,255,0.85)';
    ctx.beginPath(); ctx.moveTo(hX-2, hY-3); ctx.lineTo(hX-1, hY-10); ctx.lineTo(hX+1, hY-3); ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(180,100,255,0.75)';
    ctx.beginPath(); ctx.moveTo(hX+1, hY-3); ctx.lineTo(hX+3, hY-9); ctx.lineTo(hX+4, hY-3); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(hX-5, hY-2); ctx.lineTo(hX-4, hY-8); ctx.lineTo(hX-2, hY-2); ctx.closePath(); ctx.fill();
    // Crest tips glow
    const cPulse = 0.6 + 0.4 * Math.sin(t * 2.5);
    ctx.fillStyle = `rgba(255,180,255,${cPulse})`;
    ctx.beginPath(); ctx.arc(hX-1, hY-10, 1.3, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(hX+3, hY-9, 1.1, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(hX-4, hY-8, 1.1, 0, Math.PI*2); ctx.fill();

    // Snout (delicate)
    ctx.fillStyle = _lighten(col, 20);
    ctx.beginPath(); ctx.ellipse(hX+4, hY+1, 3, 1.8, 0.1, 0, Math.PI*2); ctx.fill();

    // ── Psychic orbit rings ──
    for (let r = 0; r < 3; r++) {
      const angle = t * (1.2 - r * 0.3) + r * 1.3;
      const rx2 = 16 + Math.cos(angle) * (11 + r * 2);
      const ry2 = 22 + Math.sin(angle) * (6 + r);
      const alpha2 = 0.4 + 0.3 * Math.sin(t * 2 + r);
      ctx.fillStyle = `rgba(200,100,255,${alpha2})`;
      ctx.beginPath(); ctx.arc(rx2, ry2, 1.8 - r * 0.3, 0, Math.PI*2); ctx.fill();
    }
    // Elliptic ring traces
    ctx.strokeStyle = 'rgba(180,100,255,0.2)'; ctx.lineWidth = 0.6;
    ctx.beginPath(); ctx.ellipse(16, 22, 13, 7, t * 0.2, 0, Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(16, 22, 10, 5, -t * 0.25 + 1, 0, Math.PI*2); ctx.stroke();

    // ── Flippers ──
    ctx.fillStyle = _lighten(col, 8);
    ctx.beginPath(); ctx.ellipse(5, 26, 5, 2.5, 0.4, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(28, 26, 5, 2.5, -0.4, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = _darken(col, 30); ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.ellipse(5, 26, 5, 2.5, 0.4, 0, Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(28, 26, 5, 2.5, -0.4, 0, Math.PI*2); ctx.stroke();

    // ── Tail ──
    ctx.fillStyle = _lighten(col, 5);
    ctx.beginPath();
    ctx.moveTo(6, 22); ctx.quadraticCurveTo(-2, 25, -3, 30);
    ctx.quadraticCurveTo(-2, 33, 3, 31); ctx.quadraticCurveTo(5, 28, 7, 24);
    ctx.fill();
    // Tail fin
    ctx.fillStyle = 'rgba(180,240,255,0.65)';
    ctx.beginPath(); ctx.moveTo(-3, 30); ctx.lineTo(-8, 28); ctx.lineTo(-6, 34); ctx.lineTo(-2, 33); ctx.closePath(); ctx.fill();

    _eye(ctx, hX-1, hY-1, 2.0);
    // Psychic eye glow
    ctx.fillStyle = 'rgba(200,100,255,0.5)';
    ctx.beginPath(); ctx.arc(hX-1, hY-1, 2.0, 0, Math.PI*2); ctx.fill();
  }

  // ── PRIMORDIA (Dragon — all-type aura) ───────────────────────
  // The primordial dragon. Ancient towering upright beast, crowned
  // with twisting multi-type energy horns, rune markings, radiating
  // every elemental type in its aura. The first DinoMon.
  function _drawPrimordia(ctx, col, col2, accent, stage, variant) {
    const t = Date.now() / 1000;
    _shadow(ctx, 16, 36, 15, 5);

    // ── Massive multi-color aura rings ──
    const auraColors = ['rgba(255,100,0,', 'rgba(0,150,255,', 'rgba(80,200,80,',
                         'rgba(180,80,255,', 'rgba(255,220,0,', 'rgba(0,220,200,'];
    for (let a = 0; a < 3; a++) {
      const angle = t * 0.4 + a * 1.2;
      const rad = 15 + a * 2;
      const col3 = auraColors[a % auraColors.length];
      ctx.strokeStyle = `${col3}${0.18 - a * 0.03})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.ellipse(15, 18, rad, rad * 0.65, angle, 0, Math.PI*2); ctx.stroke();
    }

    // ── Ancient rune glyphs on ground ──
    ctx.strokeStyle = 'rgba(200,160,50,0.35)'; ctx.lineWidth = 0.8;
    for (let r = 0; r < 6; r++) {
      const ang = (r / 6) * Math.PI * 2 + t * 0.15;
      const rx = 16 + Math.cos(ang) * 13;
      const ry = 34 + Math.sin(ang) * 3;
      ctx.beginPath(); ctx.arc(rx, ry, 1.2, 0, Math.PI*2); ctx.stroke();
    }

    // ── Tail — massive, swept back ──
    ctx.fillStyle = _darken(col, 22);
    ctx.beginPath();
    ctx.moveTo(7, 28); ctx.bezierCurveTo(-2, 22, -4, 14, 0, 8);
    ctx.bezierCurveTo(2, 5, 5, 7, 5, 12); ctx.bezierCurveTo(6, 18, 8, 24, 9, 28);
    ctx.fill();
    // Tail tip spines
    ctx.fillStyle = '#0a0520';
    for (let s = 0; s < 4; s++) {
      ctx.beginPath(); ctx.moveTo(s*1.2, 10-s*1.5); ctx.lineTo(-4+s, 4-s*2); ctx.lineTo(s*1.2+2, 10-s); ctx.closePath(); ctx.fill();
    }

    // ── Wings (half-unfurled dragon wings, rising from back) ──
    // Left wing membrane
    ctx.fillStyle = 'rgba(60,20,120,0.35)';
    ctx.beginPath();
    ctx.moveTo(14, 12); ctx.bezierCurveTo(6, 4, -2, 6, 0, 14);
    ctx.bezierCurveTo(2, 18, 8, 16, 14, 16);
    ctx.closePath(); ctx.fill();
    // Wing bone
    ctx.strokeStyle = _darken(col, 40); ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(14, 13); ctx.lineTo(2, 8); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(2, 8); ctx.lineTo(0, 14); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(2, 8); ctx.lineTo(-1, 7); ctx.stroke();

    // Right wing (mirrored)
    ctx.fillStyle = 'rgba(60,20,120,0.30)';
    ctx.beginPath();
    ctx.moveTo(18, 12); ctx.bezierCurveTo(26, 4, 34, 6, 32, 14);
    ctx.bezierCurveTo(30, 18, 24, 16, 18, 16);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = _darken(col, 40); ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(18, 13); ctx.lineTo(30, 8); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(30, 8); ctx.lineTo(32, 14); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(30, 8); ctx.lineTo(33, 7); ctx.stroke();

    // ── Body — upright, powerful ──
    ctx.fillStyle = _darken(col, 55);
    ctx.beginPath(); ctx.ellipse(16, 22, 12.5, 10.5, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.ellipse(16, 22, 11, 9.5, 0, 0, Math.PI*2); ctx.fill();

    // Ancient rune markings on body
    ctx.strokeStyle = 'rgba(200,160,50,0.55)'; ctx.lineWidth = 0.7;
    ctx.beginPath(); ctx.moveTo(11, 19); ctx.lineTo(14, 16); ctx.lineTo(17, 19); ctx.lineTo(14, 22); ctx.closePath(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(19, 22); ctx.lineTo(22, 19); ctx.lineTo(24, 22); ctx.stroke();
    // Body sheen (scales)
    ctx.strokeStyle = _darken(col, 28); ctx.lineWidth = 0.5;
    for (let r2 = 0; r2 < 3; r2++) {
      for (let c2 = 0; c2 < 4; c2++) {
        ctx.beginPath(); ctx.arc(8 + c2*5, 18 + r2*4, 2, 0, Math.PI); ctx.stroke();
      }
    }

    // Belly / chest lighter
    ctx.fillStyle = _lighten(col, 25);
    ctx.beginPath(); ctx.ellipse(16, 25, 7, 5.5, 0, 0, Math.PI*2); ctx.fill();

    // Multi-element energy crackling on body
    const elemColors2 = ['#ff6600','#4488ff','#66ee44','#cc44ff'];
    for (let e2 = 0; e2 < 4; e2++) {
      const phase2 = (t * 1.8 + e2 * 0.7) % 1;
      if (phase2 < 0.5) {
        ctx.strokeStyle = elemColors2[e2]; ctx.lineWidth = 0.8;
        const ex3 = 9 + e2 * 5, ey3 = 17 + e2 * 2;
        ctx.beginPath(); ctx.moveTo(ex3, ey3); ctx.lineTo(ex3+2, ey3-3); ctx.lineTo(ex3-1, ey3-5); ctx.stroke();
      }
    }

    // ── Neck ──
    ctx.fillStyle = _darken(col, 18);
    ctx.beginPath();
    ctx.moveTo(12, 13); ctx.lineTo(14, 4); ctx.lineTo(20, 4); ctx.lineTo(20, 13);
    ctx.closePath(); ctx.fill();

    // ── Head — massive, crowned with multi-element horns ──
    const hX = 16, hY = 3;
    ctx.fillStyle = _darken(col, 55);
    ctx.beginPath(); ctx.ellipse(hX, hY, 9.5, 7.5, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.ellipse(hX, hY, 8.5, 6.8, 0, 0, Math.PI*2); ctx.fill();

    // Crest markings on head
    ctx.strokeStyle = 'rgba(200,160,50,0.5)'; ctx.lineWidth = 0.6;
    ctx.beginPath(); ctx.arc(hX, hY, 5, -Math.PI*0.8, -Math.PI*0.1); ctx.stroke();

    // ── Crown of 6 element-typed horns ──
    const hornData = [
      { ang: -Math.PI*0.5,  len: 12, col: '#ff4400' },  // center fire
      { ang: -Math.PI*0.65, len: 9,  col: '#4488ff' },  // water
      { ang: -Math.PI*0.35, len: 9,  col: '#66ee44' },  // grass
      { ang: -Math.PI*0.8,  len: 7,  col: '#cc44ff' },  // psychic
      { ang: -Math.PI*0.2,  len: 7,  col: '#ffdd00' },  // electric
      { ang: -Math.PI*0.95, len: 5,  col: '#aaccff' },  // ice
    ];
    hornData.forEach(({ ang, len, col: hCol }) => {
      const hx2 = hX + Math.cos(ang) * 7;
      const hy2 = hY + Math.sin(ang) * 5;
      const ex4 = hX + Math.cos(ang) * (7 + len);
      const ey4 = hY + Math.sin(ang) * (4 + len * 0.6);
      const grd2 = ctx.createLinearGradient(hx2, hy2, ex4, ey4);
      grd2.addColorStop(0, _darken(col, 30));
      grd2.addColorStop(1, hCol);
      ctx.strokeStyle = grd2; ctx.lineWidth = 2.2;
      ctx.beginPath(); ctx.moveTo(hx2, hy2); ctx.lineTo(ex4, ey4); ctx.stroke();
      // Tip glow
      const gPulse = 0.5 + 0.5 * Math.sin(t * 2.5 + ang);
      ctx.fillStyle = hCol.replace('#', 'rgba(').replace(/(..)(..)(..)/, (m,r,g,b) =>
        `${parseInt(r,16)},${parseInt(g,16)},${parseInt(b,16)},${gPulse})`);
      ctx.fillStyle = `${hCol}${Math.floor(gPulse*255).toString(16).padStart(2,'0')}`;
      ctx.beginPath(); ctx.arc(ex4, ey4, 2, 0, Math.PI*2); ctx.fill();
    });

    // Snout + jaw
    ctx.fillStyle = _darken(col, 25);
    ctx.beginPath(); ctx.ellipse(hX+7, hY+2, 4.5, 3, 0.15, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#fff8dd';
    for (let t2 = 0; t2 < 4; t2++) ctx.fillRect(hX+4+t2*2.5, hY+3.5, 1.5, 2.5);

    // ── Legs — upright stance ──
    ctx.fillStyle = _darken(col, 32);
    ctx.fillRect(10, 31, 5, 6); ctx.fillRect(19, 31, 5, 6);
    ctx.fillRect(11, 28, 4, 5); ctx.fillRect(20, 28, 4, 5);
    ctx.fillStyle = '#0a0520';
    ctx.fillRect(10, 36, 5, 2); ctx.fillRect(19, 36, 5, 2);
    // Claws
    ctx.fillStyle = '#1a0a2a';
    for (let c = 0; c < 3; c++) { ctx.fillRect(10+c*1.5, 37, 1.5, 3); ctx.fillRect(19+c*1.5, 37, 1.5, 3); }

    _eye(ctx, hX-2, hY, 2.5);
    // Eyes glow all element colors cycling
    const eyeCol2 = elemColors2[Math.floor(t * 0.8) % elemColors2.length];
    ctx.fillStyle = `${eyeCol2}88`;
    ctx.beginPath(); ctx.arc(hX-2, hY, 2.5, 0, Math.PI*2); ctx.fill();
  }

  // ── MEGAVORE (Dragon/Dark) ────────────────────────────────────
  // Terror incarnate. Shadow raptor, nightmarish void-jawed beast.
  // Shadow tendrils grown INTO the silhouette, bone spikes,
  // void-black body with purple abyss glow, massive gaping maw.
  function _drawMegavore(ctx, col, col2, accent, stage, variant) {
    const t = Date.now() / 1000;
    _shadow(ctx, 16, 36, 14, 4);

    // ── Shadow void ground distortion ──
    const voidGlow = ctx.createRadialGradient(16, 34, 0, 16, 34, 14);
    voidGlow.addColorStop(0, 'rgba(60,0,80,0.55)');
    voidGlow.addColorStop(0.6, 'rgba(30,0,50,0.25)');
    voidGlow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = voidGlow;
    ctx.beginPath(); ctx.ellipse(16, 34, 15, 5, 0, 0, Math.PI*2); ctx.fill();

    // ── Living shadow tendrils (part of body) ──
    ctx.strokeStyle = `rgba(80,0,120,0.6)`; ctx.lineWidth = 1.8;
    for (let d = 0; d < 5; d++) {
      const sway = Math.sin(t * 1.5 + d * 1.4) * 3;
      const sx = 5 + d * 5.5, sy = 32;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.bezierCurveTo(sx+sway-2, sy-8, sx-sway+1, sy-16, sx+sway, sy-22-d*0.5);
      ctx.stroke();
    }

    // ── Tail — spiked dark tail ──
    ctx.fillStyle = _darken(col, 10);
    ctx.beginPath();
    ctx.moveTo(7, 26); ctx.bezierCurveTo(-2, 20, -5, 12, -1, 6);
    ctx.bezierCurveTo(1, 3, 4, 5, 4, 9); ctx.bezierCurveTo(5, 15, 6, 21, 8, 26);
    ctx.fill();
    // Bone spikes on tail
    ctx.fillStyle = '#d0c0b0';
    for (let s = 0; s < 4; s++) {
      const sx = -1+s*1.5, sy = 8+s*3;
      ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx-5, sy-6); ctx.lineTo(sx+1, sy+1); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = '#807060'; ctx.lineWidth = 0.5;
      ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx-5, sy-6); ctx.lineTo(sx+1, sy+1); ctx.closePath(); ctx.stroke();
    }

    // ── Shadow wings — spread menacingly ──
    const wFlap = Math.sin(t * 1.2) * 0.08;
    // Left wing
    ctx.fillStyle = 'rgba(20,0,35,0.7)';
    ctx.beginPath();
    ctx.moveTo(12, 14);
    ctx.bezierCurveTo(4, 8+wFlap*20, -4, 12, -2, 20);
    ctx.bezierCurveTo(0, 24, 6, 20, 12, 18);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(100,0,150,0.5)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(12, 14); ctx.lineTo(-2, 11); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-2, 11); ctx.lineTo(-3, 20); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-2, 11); ctx.lineTo(-5, 9); ctx.stroke();
    // Right wing
    ctx.fillStyle = 'rgba(20,0,35,0.65)';
    ctx.beginPath();
    ctx.moveTo(20, 14);
    ctx.bezierCurveTo(28, 8-wFlap*20, 36, 12, 34, 20);
    ctx.bezierCurveTo(32, 24, 26, 20, 20, 18);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(100,0,150,0.5)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(20, 14); ctx.lineTo(34, 11); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(34, 11); ctx.lineTo(35, 20); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(34, 11); ctx.lineTo(37, 9); ctx.stroke();

    // ── Body — sleek, predatory ──
    ctx.fillStyle = _darken(col, 60);
    ctx.beginPath(); ctx.ellipse(17, 22, 11.5, 8.5, -0.15, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.ellipse(17, 22, 10, 7.5, -0.15, 0, Math.PI*2); ctx.fill();

    // Bone spine ridge on back
    ctx.fillStyle = '#b0a090';
    for (let s = 0; s < 5; s++) {
      const sx = 10 + s * 3.5, sy = 15 - s * 0.3;
      ctx.beginPath(); ctx.moveTo(sx, sy+2); ctx.lineTo(sx, sy-4); ctx.lineTo(sx+2, sy+2); ctx.closePath(); ctx.fill();
    }

    // Void aura core glow
    const coreGlow = ctx.createRadialGradient(16, 20, 0, 16, 20, 9);
    coreGlow.addColorStop(0, 'rgba(120,0,180,0.35)');
    coreGlow.addColorStop(1, 'rgba(40,0,60,0)');
    ctx.fillStyle = coreGlow;
    ctx.beginPath(); ctx.ellipse(16, 20, 9, 7, 0, 0, Math.PI*2); ctx.fill();

    // ── Neck — powerful forward thrust ──
    ctx.fillStyle = _darken(col, 18);
    ctx.beginPath();
    ctx.moveTo(20, 14); ctx.lineTo(24, 6); ctx.lineTo(30, 10); ctx.lineTo(26, 16);
    ctx.closePath(); ctx.fill();

    // ── Head — massive nightmare maw ──
    const hX = 27, hY = 9;
    ctx.fillStyle = _darken(col, 60);
    ctx.beginPath(); ctx.ellipse(hX, hY, 8.5, 6, 0.2, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.ellipse(hX, hY, 7.5, 5.5, 0.2, 0, Math.PI*2); ctx.fill();

    // ── Skull-bone forehead spikes ──
    ctx.fillStyle = '#c0b0a0';
    for (let s = 0; s < 3; s++) {
      const sx = hX - 4 + s * 3.5, sy = hY - 4;
      ctx.beginPath(); ctx.moveTo(sx, sy+1); ctx.lineTo(sx+1, sy-5+s); ctx.lineTo(sx+2, sy+1); ctx.closePath(); ctx.fill();
    }

    // ── Jaw — massive, split open to reveal void interior ──
    ctx.fillStyle = _darken(col, 25);
    ctx.beginPath(); ctx.ellipse(hX+5, hY+5, 6, 3.5, 0.15, 0, Math.PI*2); ctx.fill();
    // Void interior
    ctx.fillStyle = '#0a0010';
    ctx.beginPath(); ctx.ellipse(hX+5, hY+5.5, 5, 2.8, 0.15, 0, Math.PI*2); ctx.fill();
    // Purple glow from void maw
    const mawGlow = ctx.createRadialGradient(hX+5, hY+5, 0, hX+5, hY+5, 5);
    mawGlow.addColorStop(0, 'rgba(150,0,200,0.7)');
    mawGlow.addColorStop(1, 'rgba(80,0,120,0)');
    ctx.fillStyle = mawGlow;
    ctx.beginPath(); ctx.ellipse(hX+5, hY+5, 5, 2.8, 0.15, 0, Math.PI*2); ctx.fill();
    // Fangs — upper and lower
    ctx.fillStyle = '#e0d0c0';
    for (let f = 0; f < 4; f++) {
      ctx.beginPath(); ctx.moveTo(hX+1+f*2.2, hY+3); ctx.lineTo(hX+2+f*2.2, hY+6.5); ctx.lineTo(hX+3+f*2.2, hY+3); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(hX+1.5+f*2.2, hY+8); ctx.lineTo(hX+2.5+f*2.2, hY+4.5); ctx.lineTo(hX+3.5+f*2.2, hY+8); ctx.closePath(); ctx.fill();
    }

    // ── Legs — crouched predator ──
    ctx.fillStyle = _darken(col, 28);
    ctx.fillRect(11, 29, 5, 7); ctx.fillRect(19, 29, 5, 7);
    ctx.fillRect(12, 26, 4, 5); ctx.fillRect(20, 26, 4, 5);
    ctx.fillStyle = '#0a0010'; ctx.fillRect(11, 35, 5, 3); ctx.fillRect(19, 35, 5, 3);
    // Long dark claws
    ctx.fillStyle = '#150025';
    for (let c = 0; c < 3; c++) {
      ctx.beginPath(); ctx.moveTo(11+c*1.5, 37); ctx.lineTo(9+c*1.5, 41); ctx.lineTo(12+c*1.5, 37); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(19+c*1.5, 37); ctx.lineTo(17+c*1.5, 41); ctx.lineTo(20+c*1.5, 37); ctx.closePath(); ctx.fill();
    }

    // ── Eyes — twin purple void glare ──
    _eye(ctx, hX, hY-1, 2.3);
    ctx.fillStyle = 'rgba(150,0,220,0.65)';
    ctx.beginPath(); ctx.arc(hX, hY-1, 2.3, 0, Math.PI*2); ctx.fill();
    // Eye glow pulse
    const ePulse = 0.4 + 0.6 * Math.sin(t * 2.2);
    ctx.fillStyle = `rgba(200,50,255,${ePulse * 0.5})`;
    ctx.beginPath(); ctx.arc(hX, hY-1, 4, 0, Math.PI*2); ctx.fill();
  }

  // ── TITANREX (Rock/Fire) ──────────────────────────────────────
  // Volcanic fortress — a rock-armored ceratopsian of titanic scale.
  // Layered volcanic rock plates, lava vent cracks glowing orange,
  // massive eruption-cone horns, smoke rising, primordial terror.
  function _drawTitanrex(ctx, col, col2, accent, stage, variant) {
    const t = Date.now() / 1000;
    _shadow(ctx, 16, 36, 17, 5.5);

    // ── Volcanic ground glow ──
    ctx.fillStyle = 'rgba(255,80,0,0.2)';
    ctx.beginPath(); ctx.ellipse(16, 35, 17, 4, 0, 0, Math.PI*2); ctx.fill();
    // Ground cracks
    ctx.strokeStyle = 'rgba(255,140,0,0.6)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(3, 36); ctx.lineTo(9, 33); ctx.lineTo(7, 30); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(29, 36); ctx.lineTo(23, 33); ctx.lineTo(25, 30); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(14, 36); ctx.lineTo(16, 33); ctx.lineTo(18, 36); ctx.stroke();

    // ── Tail — rock-plated thick tail ──
    ctx.fillStyle = _darken(col, 15);
    ctx.beginPath();
    ctx.moveTo(5, 24); ctx.quadraticCurveTo(-3, 16, 0, 8);
    ctx.quadraticCurveTo(2, 5, 6, 9); ctx.quadraticCurveTo(7, 17, 8, 24);
    ctx.fill();
    // Rock plates on tail
    ctx.fillStyle = _darken(col, 30);
    for (let p = 0; p < 3; p++) {
      ctx.beginPath(); ctx.arc(1+p*2, 18-p*4, 3, 0, Math.PI*2); ctx.fill();
      ctx.strokeStyle = _darken(col, 50); ctx.lineWidth = 0.5;
      ctx.beginPath(); ctx.arc(1+p*2, 18-p*4, 3, 0, Math.PI*2); ctx.stroke();
    }

    // ── Enormous body — the largest of all legendaries ──
    ctx.fillStyle = _darken(col, 55);
    ctx.beginPath(); ctx.ellipse(17, 23, 16.5, 12, -0.05, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.ellipse(17, 23, 15, 11, -0.05, 0, Math.PI*2); ctx.fill();

    // Rock armor segments — tiled stone plates
    ctx.fillStyle = _darken(col, 22);
    const plateCenters = [
      [8,19],[13,16],[18,15],[23,16],[27,19],
      [9,24],[14,22],[19,21],[24,22],[28,24],
      [11,29],[16,28],[21,28],[26,29],
    ];
    plateCenters.forEach(([px, py]) => {
      ctx.beginPath(); ctx.arc(px, py, 3.5, 0, Math.PI*2); ctx.fill();
      ctx.strokeStyle = _darken(col, 40); ctx.lineWidth = 0.7;
      ctx.beginPath(); ctx.arc(px, py, 3.5, 0, Math.PI*2); ctx.stroke();
    });

    // Lava vent cracks — glowing fissures through the armor
    const lavaAlpha = 0.6 + 0.4 * Math.sin(t * 1.8);
    ctx.strokeStyle = `rgba(255,120,0,${lavaAlpha})`; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(10, 21); ctx.lineTo(13, 24); ctx.lineTo(10, 27); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(17, 19); ctx.lineTo(20, 22); ctx.lineTo(17, 26); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(24, 20); ctx.lineTo(27, 23); ctx.lineTo(24, 27); ctx.stroke();
    // Lava glow in cracks
    ctx.strokeStyle = `rgba(255,220,0,${lavaAlpha * 0.5})`; ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.moveTo(10, 21); ctx.lineTo(13, 24); ctx.lineTo(10, 27); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(17, 19); ctx.lineTo(20, 22); ctx.lineTo(17, 26); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(24, 20); ctx.lineTo(27, 23); ctx.lineTo(24, 27); ctx.stroke();

    // ── Neck — massive volcanic pillar ──
    ctx.fillStyle = _darken(col, 20);
    ctx.beginPath();
    ctx.moveTo(22, 14); ctx.lineTo(26, 5); ctx.lineTo(32, 9); ctx.lineTo(28, 16);
    ctx.closePath(); ctx.fill();
    // Neck rock plates
    ctx.fillStyle = _darken(col, 35);
    ctx.beginPath(); ctx.arc(27, 10, 3, 0, Math.PI*2); ctx.fill();

    // ── Head — massive, forward ──
    const hX = 28, hY = 8;
    ctx.fillStyle = _darken(col, 55);
    ctx.beginPath(); ctx.ellipse(hX, hY, 10, 7.5, 0.2, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.ellipse(hX, hY, 9, 7, 0.2, 0, Math.PI*2); ctx.fill();
    // Rock armored head surface
    ctx.fillStyle = _darken(col, 25);
    ctx.beginPath(); ctx.arc(hX-2, hY-2, 3.5, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(hX+3, hY-3, 2.5, 0, Math.PI*2); ctx.fill();

    // ── Crown of volcanic eruption horns ──
    // 3 massive cone-shaped horns like mini volcanoes
    const hornPositions = [
      { x: hX-4, y: hY-4, w: 4, h: 14 },  // left
      { x: hX,   y: hY-5, w: 5, h: 17 },  // center (tallest)
      { x: hX+4, y: hY-3, w: 3.5, h: 11 }, // right
    ];
    hornPositions.forEach(({ x, y, w, h }) => {
      // Rock horn body
      ctx.fillStyle = _darken(col, 45);
      ctx.beginPath(); ctx.moveTo(x-w, y+h*0.1); ctx.lineTo(x, y-h); ctx.lineTo(x+w, y+h*0.1); ctx.closePath(); ctx.fill();
      ctx.fillStyle = _darken(col, 25);
      ctx.beginPath(); ctx.moveTo(x-w*0.6, y+h*0.05); ctx.lineTo(x, y-h); ctx.lineTo(x+w*0.4, y+h*0.05); ctx.closePath(); ctx.fill();
      // Lava glow at tip
      const tipPulse = 0.5 + 0.5 * Math.sin(t * 2.3 + x);
      ctx.fillStyle = `rgba(255,${100+Math.floor(tipPulse*80)},0,${0.7*tipPulse})`;
      ctx.beginPath(); ctx.arc(x, y-h, 2.5, 0, Math.PI*2); ctx.fill();
      // Smoke wisps rising from tip
      for (let s = 0; s < 2; s++) {
        const phase = (t * 0.7 + s * 0.5 + x*0.05) % 1;
        const sx2 = x + Math.sin(t + s) * 2;
        const sy2 = y - h - phase * 8;
        ctx.fillStyle = `rgba(60,50,50,${(1-phase)*0.25})`;
        ctx.beginPath(); ctx.arc(sx2, sy2, (1-phase)*2, 0, Math.PI*2); ctx.fill();
      }
    });

    // Nose plate (forward-jutting rock beak)
    ctx.fillStyle = _darken(col, 30);
    ctx.beginPath(); ctx.moveTo(hX+6, hY+1); ctx.lineTo(hX+15, hY-1); ctx.lineTo(hX+8, hY+5); ctx.closePath(); ctx.fill();
    // Nose lava vent
    ctx.fillStyle = `rgba(255,100,0,${0.5 + 0.5*Math.sin(t*2.5)})`;
    ctx.beginPath(); ctx.arc(hX+12, hY+1, 1.8, 0, Math.PI*2); ctx.fill();

    // Snout + jaw
    ctx.fillStyle = _darken(col, 22);
    ctx.beginPath(); ctx.ellipse(hX+6, hY+3, 5.5, 3.5, 0.15, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#444';
    for (let t2 = 0; t2 < 3; t2++) ctx.fillRect(hX+3+t2*2.8, hY+4.5, 2.2, 2.5);

    // ── Legs — rock-pillar legs ──
    ctx.fillStyle = _darken(col, 28);
    ctx.fillRect(7, 31, 7, 6); ctx.fillRect(19, 31, 7, 6);
    ctx.fillRect(8, 27, 6, 6); ctx.fillRect(20, 27, 6, 6);
    // Rock texture on legs
    ctx.fillStyle = _darken(col, 40);
    ctx.beginPath(); ctx.arc(10, 33, 2.5, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(22, 33, 2.5, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#1a0a00';
    ctx.fillRect(7, 36, 7, 2); ctx.fillRect(19, 36, 7, 2);

    _eye(ctx, hX+1, hY-2, 2.4);
    // Glowing orange eye
    ctx.fillStyle = 'rgba(255,100,0,0.4)';
    ctx.beginPath(); ctx.arc(hX+1, hY-2, 2.4, 0, Math.PI*2); ctx.fill();
  }

  // ── Archetype mapping ─────────────────────────────────────────
  const _ARCHETYPES = {
    CERAT:      _drawCeratopsian,
    STEGO:      _drawStegosaur,
    PLESI:      _drawPlesiosaur,
    PTERO:      _drawPterosaur,
    RAPTOR:     _drawRaptor,
    ANKYLO:     _drawAnkylosaur,
    SAURO:      _drawSauropod,
    AQUA:       _drawAquatic,
    GHOST:      _drawGhost,
    BUG:        _drawBug,
    FAIRY:      _drawFairy,
    TREX:       _drawTrex,
    GENERIC:    _drawGeneric,
    // Legendary bespoke functions
    CRATERON:   _drawCrateron,
    GLACIODON:  _drawGlaciodon,
    PRIMORDIA:  _drawPrimordia,
    MEGAVORE:   _drawMegavore,
    TITANREX:   _drawTitanrex,
  };

  const _ARCHETYPE_MAP = {
    // Ceratopsians
    TINDREL:'CERAT',TINDRAK:'CERAT',PYROCERATH:'CERAT',
    QUAKELING:'CERAT',MIDDODON:'CERAT',
    ROCKLETT:'CERAT',BOULDERFANG:'CERAT',MEGASTONE:'CERAT',
    FIGHTCLAW:'CERAT',POWERDON:'CERAT',RAMPASAUR:'CERAT',
    // Legendaries now use dedicated archetypes:
    CRATERON:'CRATERON',TITANREX:'TITANREX',

    // Stegosaurs
    LEAFAWN:'STEGO',FERNASAUR:'STEGO',VERDANTHORN:'STEGO',
    EMBRIX:'STEGO',SOLARIX:'STEGO',SCORCHBACK:'STEGO',
    STEELBACK:'STEGO',IRONSCALE:'STEGO',TITANOSAUR:'STEGO',
    FROSTLING:'STEGO',BLIZZHORN:'STEGO',GLACIOKING:'STEGO',

    // Plesiosaurs
    AQUEEL:'PLESI',PLESIWAVE:'PLESI',TIDANOSAURUS:'PLESI',
    CRYOPHIN:'PLESI',GLACIOHORN:'PLESI',PERMAFROST:'PLESI',
    GLACIODON:'GLACIODON',

    // Pterosaurs
    PTRYX:'PTERO',SWOOPTER:'PTERO',SKYFANG:'PTERO',
    SOARWING:'PTERO',GLIDEREX:'PTERO',SKYMASTER:'PTERO',
    STORMWING:'PTERO',TEMPESTFANG:'PTERO',CYCLOSAUR:'PTERO',
    SPARKLET:'PTERO',VOLTHORN:'PTERO',SPARKHORN:'PTERO',
    VOLTSCALE:'PTERO',THUNDERSAUR:'PTERO',

    // Raptors
    SHADOWLET:'RAPTOR',DUSKFANG:'RAPTOR',NIGHTREX:'RAPTOR',
    SANDCLAW:'RAPTOR',DESERTFANG:'RAPTOR',DUNECROWN:'RAPTOR',
    DARKSCALE:'RAPTOR',SHADOWCLAW:'RAPTOR',OBSIDIUDON:'RAPTOR',
    QUICKFEET:'RAPTOR',SWIFTCLAW:'RAPTOR',
    VIPERFANG:'RAPTOR',TOXIDRAW:'RAPTOR',VENOMSAUR:'RAPTOR',
    PRIMORDIA:'PRIMORDIA',MEGAVORE:'MEGAVORE',

    // Ankylosaurs
    NORMLET:'ANKYLO',PACKDINO:'ANKYLO',HERDSAUR:'ANKYLO',
    BONEBACK:'ANKYLO',STONESKULL:'ANKYLO',OSSIFANG:'ANKYLO',
    DIGCLAW:'ANKYLO',TUNNELDON:'ANKYLO',
    ROCKFLIP:'ANKYLO',BOULDERDON:'ANKYLO',

    // Sauropods
    TERRADON:'SAURO',

    // Aquatic
    MUDFIN:'AQUA',SWAMPJAW:'AQUA',SWAMPZILLA:'AQUA',
    MARSHFIN:'AQUA',BOGZILLA:'AQUA',
    AQUAFLIP:'AQUA',SEAFANG:'AQUA',ABYSSAUR:'AQUA',
    ICECAP:'AQUA',BLIZZFANG:'AQUA',POLARCROWN:'AQUA',
    VENOMJAW:'AQUA',MIASMARK:'AQUA',TOXICARNO:'AQUA',

    // Ghosts
    GHOSTBONE:'GHOST',SPIRITHORN:'GHOST',PHANTOSAUR:'GHOST',

    // Bugs
    BUGLING:'BUG',BUGCLAW:'BUG',INSECTADON:'BUG',

    // Fairies
    FAIRYWING:'FAIRY',BLOOMSAUR:'FAIRY',FLOROSAUR:'FAIRY',

    // T-Rex
    FRONDLET:'TREX',VINOSAUR:'TREX',CANOPYREX:'TREX',
    LEAFCUB:'TREX',SPRIGDON:'TREX',JUNGLESAUR:'TREX',
    FIRECOAL:'TREX',LAVACLAW:'TREX',MAGMADON:'TREX',
  };

  // ── Stage map: 0=baby, 1=mid, 2=final ─────────────────────────
  // Determines overall sprite scale (baby=75%, mid=88%, final=100%)
  // and feature complexity (fewer plates/horns when baby)
  const _STAGE_MAP = {
    // Stage 0 — first/base forms
    TINDREL:0,LEAFAWN:0,AQUEEL:0,PTRYX:0,CRYOPHIN:0,QUAKELING:0,
    EMBRIX:0,FRONDLET:0,BONEBACK:0,VENOMJAW:0,SPARKHORN:0,
    SHADOWLET:0,NORMLET:0,FROSTLING:0,STEELBACK:0,MUDFIN:0,
    SOARWING:0,FIGHTCLAW:0,GHOSTBONE:0,VIPERFANG:0,BUGLING:0,
    FAIRYWING:0,ROCKLETT:0,SANDCLAW:0,LEAFCUB:0,FIRECOAL:0,
    AQUAFLIP:0,ICECAP:0,STORMWING:0,DARKSCALE:0,QUICKFEET:0,
    DIGCLAW:0,ROCKFLIP:0,SPARKLET:0,MARSHFIN:0,TERRADON:0,
    // Stage 1 — middle evolution
    TINDRAK:1,FERNASAUR:1,PLESIWAVE:1,SWOOPTER:1,GLACIOHORN:1,
    MIDDODON:1,SOLARIX:1,VINOSAUR:1,STONESKULL:1,MIASMARK:1,
    VOLTSCALE:1,DUSKFANG:1,PACKDINO:1,BLIZZHORN:1,IRONSCALE:1,
    SWAMPJAW:1,GLIDEREX:1,POWERDON:1,SPIRITHORN:1,TOXIDRAW:1,
    BUGCLAW:1,BLOOMSAUR:1,BOULDERFANG:1,DESERTFANG:1,SPRIGDON:1,
    LAVACLAW:1,SEAFANG:1,BLIZZFANG:1,TEMPESTFANG:1,SHADOWCLAW:1,
    SWIFTCLAW:1,TUNNELDON:1,BOULDERDON:1,VOLTHORN:1,BOGZILLA:1,
    // Stage 2 — final/legendary forms
    PYROCERATH:2,VERDANTHORN:2,TIDANOSAURUS:2,SKYFANG:2,PERMAFROST:2,
    SCORCHBACK:2,CANOPYREX:2,OSSIFANG:2,TOXICARNO:2,THUNDERSAUR:2,
    NIGHTREX:2,HERDSAUR:2,GLACIOKING:2,TITANOSAUR:2,SWAMPZILLA:2,
    SKYMASTER:2,RAMPASAUR:2,PHANTOSAUR:2,VENOMSAUR:2,INSECTADON:2,
    FLOROSAUR:2,MEGASTONE:2,DUNECROWN:2,JUNGLESAUR:2,MAGMADON:2,
    ABYSSAUR:2,POLARCROWN:2,CYCLOSAUR:2,OBSIDIUDON:2,
    // Legendaries are always final stage
    PRIMORDIA:2,CRATERON:2,GLACIODON:2,MEGAVORE:2,TITANREX:2,
  };

  // ── Variant map: which chain within an archetype ───────────────
  // Different variants within same archetype get distinct silhouettes
  const _VARIANT_MAP = {
    // CERAT: 0=Fire/Tindrel, 1=Ground/Quakeling, 2=Rock/Rocklett, 3=Fight/Fightclaw, 4=Legend
    TINDREL:0,TINDRAK:0,PYROCERATH:0,
    QUAKELING:1,MIDDODON:1,
    ROCKLETT:2,BOULDERFANG:2,MEGASTONE:2,
    FIGHTCLAW:3,POWERDON:3,RAMPASAUR:3,
    CRATERON:4,TITANREX:4,

    // STEGO: 0=Grass/Leafawn, 1=Fire/Embrix, 2=Steel/Steelback, 3=Ice/Frostling
    LEAFAWN:0,FERNASAUR:0,VERDANTHORN:0,
    EMBRIX:1,SOLARIX:1,SCORCHBACK:1,
    STEELBACK:2,IRONSCALE:2,TITANOSAUR:2,
    FROSTLING:3,BLIZZHORN:3,GLACIOKING:3,

    // PLESI: 0=Water/Aqueel, 1=Ice-Psychic/Cryophin, 2=Legendary/Glaciodon
    AQUEEL:0,PLESIWAVE:0,TIDANOSAURUS:0,
    CRYOPHIN:1,GLACIOHORN:1,PERMAFROST:1,
    GLACIODON:2,

    // PTERO: 0=Dragon/Ptryx, 1=Flying/Soarwing, 2=Electric/Stormwing, 3=Sparklet(2stage), 4=Sparkhorn
    PTRYX:0,SWOOPTER:0,SKYFANG:0,
    SOARWING:1,GLIDEREX:1,SKYMASTER:1,
    STORMWING:2,TEMPESTFANG:2,CYCLOSAUR:2,
    SPARKLET:3,VOLTHORN:3,
    SPARKHORN:4,VOLTSCALE:4,THUNDERSAUR:4,

    // RAPTOR: 0=Dark/Shadow, 1=Ground/Sand, 2=DarkDragon/Darkscale, 3=Normal/Quickfeet, 4=Poison/Viper, 5=Legend
    SHADOWLET:0,DUSKFANG:0,NIGHTREX:0,
    SANDCLAW:1,DESERTFANG:1,DUNECROWN:1,
    DARKSCALE:2,SHADOWCLAW:2,OBSIDIUDON:2,
    QUICKFEET:3,SWIFTCLAW:3,
    VIPERFANG:4,TOXIDRAW:4,VENOMSAUR:4,
    PRIMORDIA:5,MEGAVORE:5,

    // ANKYLO: 0=Normal/Normlet, 1=Rock/Boneback, 2=Ground/Digclaw, 3=Rock/Rockflip
    NORMLET:0,PACKDINO:0,HERDSAUR:0,
    BONEBACK:1,STONESKULL:1,OSSIFANG:1,
    DIGCLAW:2,TUNNELDON:2,
    ROCKFLIP:3,BOULDERDON:3,

    // SAURO: all variant 0 (single chain)
    TERRADON:0,

    // AQUA: 0=Water-Ground/Mudfin, 1=Water-Poison/Marshfin, 2=Water/Aquaflip, 3=Ice/Icecap, 4=Psychic/Venomjaw
    MUDFIN:0,SWAMPJAW:0,SWAMPZILLA:0,
    MARSHFIN:1,BOGZILLA:1,
    AQUAFLIP:2,SEAFANG:2,ABYSSAUR:2,
    ICECAP:3,BLIZZFANG:3,POLARCROWN:3,
    VENOMJAW:4,MIASMARK:4,TOXICARNO:4,

    // GHOST, BUG, FAIRY: single chains
    GHOSTBONE:0,SPIRITHORN:0,PHANTOSAUR:0,
    BUGLING:0,BUGCLAW:0,INSECTADON:0,
    FAIRYWING:0,BLOOMSAUR:0,FLOROSAUR:0,

    // TREX: 0=Grass-Vine/Frondlet, 1=Grass-Jungle/Leafcub, 2=Fire/Firecoal
    FRONDLET:0,VINOSAUR:0,CANOPYREX:0,
    LEAFCUB:1,SPRIGDON:1,JUNGLESAUR:1,
    FIRECOAL:2,LAVACLAW:2,MAGMADON:2,
  };

  // ── DinoMon draw dispatcher ───────────────────────────────────
  // Stage-aware: baby(0)=75% scale, mid(1)=88%, final(2)=100%
  // Ground-anchored: smaller mons shift down so feet stay at same y
  // ── FASE 2: pixel-art bake pipeline ───────────────────────────
  // Archetypes draw in a local ~0..36 space; wings/beaks/auras extend beyond.
  // The bake region covers local x:[-26..62], y:[-26..46] so nothing clips.
  const _PIX = { PAD_X: 26, PAD_T: 26, W: 88, H: 72, canvas: null, ctx: null };

  function _bakeCtx(w, h) {
    if (!_PIX.canvas) {
      _PIX.canvas = document.createElement('canvas');
      _PIX.ctx = _PIX.canvas.getContext('2d', { willReadFrequently: true });
    }
    if (_PIX.canvas.width !== w)  _PIX.canvas.width = w;
    if (_PIX.canvas.height !== h) _PIX.canvas.height = h;
    return _PIX.ctx;
  }

  // ── FASE 12: patroon-config per soort (type-gestuurd, seed-gevarieerd) ──
  const _TYPE_PATTERN = {
    FIRE: 'stripes', DRAGON: 'stripes', ELECTRIC: 'stripes', BUG: 'stripes', DARK: 'stripes',
    WATER: 'spots', ICE: 'spots', POISON: 'spots', FAIRY: 'spots', GRASS: 'spots', PSYCHIC: 'spots',
    ROCK: 'scales', STEEL: 'scales', GROUND: 'counter', NORMAL: 'counter',
    FIGHTING: 'counter', FLYING: 'counter', GHOST: 'none',
  };
  let _patCfg = null; // { kind, r,g,b, period, seed }

  // GBA-afwerking op de gebakte sprite — FASE 12 (v3): posterize, patroon-
  // overlay + counter-shading, cel-shading met dither-tweede-ring, en
  // gekleurde outlines (donkere versie van de lokale kleur).
  function _gbaFinish(ictx, w, h) {
    const img = ictx.getImageData(0, 0, w, h);
    const d = img.data;
    const n = w * h;
    const solid = new Uint8Array(n);
    let minY = h, maxY = 0;
    for (let p = 0, i = 0; p < n; p++, i += 4) {
      const a = d[i + 3];
      if (a < 24) { d[i + 3] = 0; continue; }
      d[i + 3] = a >= 140 ? 255 : a >= 90 ? 150 : a >= 50 ? 95 : 45;
      if (d[i + 3] === 255) {
        solid[p] = 1;
        const yy = (p / w) | 0;
        if (yy < minY) minY = yy;
        if (yy > maxY) maxY = yy;
      }
      d[i]     = Math.min(255, Math.round(d[i]     / 36) * 36);
      d[i + 1] = Math.min(255, Math.round(d[i + 1] / 36) * 36);
      d[i + 2] = Math.min(255, Math.round(d[i + 2] / 36) * 36);
    }

    // FASE 12: counter-shading (rug donker → buik licht) + patroon-overlay
    if (_patCfg && maxY > minY + 4) {
      const span = maxY - minY;
      const per = Math.max(3, _patCfg.period);
      const kind = _patCfg.kind;
      for (let p = 0, i = 0; p < n; p++, i += 4) {
        if (!solid[p]) continue;
        const x = p % w, y = (p / w) | 0;
        const rel = (y - minY) / span;
        const csf = (rel - 0.45) * 0.18; // -0.08 (rug) .. +0.10 (buik)
        d[i]     = Math.max(0, Math.min(255, d[i]     + d[i]     * csf));
        d[i + 1] = Math.max(0, Math.min(255, d[i + 1] + d[i + 1] * csf));
        d[i + 2] = Math.max(0, Math.min(255, d[i + 2] + d[i + 2] * csf));
        let on = false;
        if (kind === 'stripes') {
          // diagonale rugstrepen, alleen op de bovenste 60% van het lijf
          on = rel < 0.62 && ((x * 0.7 + y * 1.3 + _patCfg.seed) % (per * 2)) < per * 0.72;
        } else if (kind === 'spots') {
          const cx2 = (x / per) | 0, cy2 = (y / per) | 0;
          const hsh = ((cx2 * 73856093) ^ (cy2 * 19349663) ^ _patCfg.seed) >>> 0;
          if ((hsh % 100) < 42) {
            const lx = x % per - per / 2, ly = y % per - per / 2;
            on = lx * lx + ly * ly < (per * 0.42) * (per * 0.42);
          }
        } else if (kind === 'scales') {
          on = (y % 3) === 0 && ((x + (((y / 3) | 0) % 2) * 2) % 4) < 1;
        }
        if (on) {
          d[i]     = (d[i]     * 0.58 + _patCfg.r * 0.42) | 0;
          d[i + 1] = (d[i + 1] * 0.58 + _patCfg.g * 0.42) | 0;
          d[i + 2] = (d[i + 2] * 0.58 + _patCfg.b * 0.42) | 0;
        }
      }
    }

    // FASE 6/12: cel-shading met dither-tweede-ring (dambord-pixels)
    for (let p = 0, i = 0; p < n; p++, i += 4) {
      if (!solid[p]) continue;
      const px = p % w, py2 = (p / w) | 0;
      const openUp     = p < w         || !solid[p - w];
      const openLeft   = px === 0      || !solid[p - 1];
      const openDown   = p >= n - w    || !solid[p + w];
      const openRight  = px === w - 1  || !solid[p + 1];
      const openUp2    = p < 2 * w     || !solid[p - 2 * w];
      const openLeft2  = px <= 1       || !solid[p - 2];
      const openDown2  = p >= n - 2*w  || !solid[p + 2 * w];
      const openRight2 = px >= w - 2   || !solid[p + 2];
      const checker = (px + py2) % 2 === 0;
      if (openUp || openLeft) {
        d[i]     = Math.min(255, d[i]     + (255 - d[i])     * 0.34);
        d[i + 1] = Math.min(255, d[i + 1] + (255 - d[i + 1]) * 0.34);
        d[i + 2] = Math.min(255, d[i + 2] + (255 - d[i + 2]) * 0.32);
      } else if ((openUp2 || openLeft2) && checker) {
        d[i]     = Math.min(255, d[i]     + (255 - d[i])     * 0.16);
        d[i + 1] = Math.min(255, d[i + 1] + (255 - d[i + 1]) * 0.16);
        d[i + 2] = Math.min(255, d[i + 2] + (255 - d[i + 2]) * 0.15);
      } else if (openDown || openRight) {
        d[i] = d[i] * 0.62; d[i + 1] = d[i + 1] * 0.62; d[i + 2] = d[i + 2] * 0.68;
      } else if ((openDown2 || openRight2) && !checker) {
        d[i] = d[i] * 0.8; d[i + 1] = d[i + 1] * 0.8; d[i + 2] = d[i + 2] * 0.85;
      }
    }

    // FASE 12: gekleurde outline — donkere versie van de aangrenzende kleur
    for (let p = 0, i = 0; p < n; p++, i += 4) {
      if (d[i + 3] !== 0) continue;
      const px = p % w;
      let q = -1;
      if (px > 0 && solid[p - 1]) q = p - 1;
      else if (px < w - 1 && solid[p + 1]) q = p + 1;
      else if (p >= w && solid[p - w]) q = p - w;
      else if (p < n - w && solid[p + w]) q = p + w;
      if (q >= 0) {
        const qi = q * 4;
        d[i]     = (d[qi]     * 0.32 + 8)  | 0;
        d[i + 1] = (d[qi + 1] * 0.32 + 7)  | 0;
        d[i + 2] = (d[qi + 2] * 0.34 + 12) | 0;
        d[i + 3] = 255;
      }
    }
    ictx.putImageData(img, 0, 0);
  }

  // FASE 2: idle-ademhaling — discrete 4-staps cyclus (0→half→vol→half),
  // verankerd aan de voeten (lokaal y=36). Fase verschilt per species zodat
  // speler en vijand niet synchroon ademen.
  function _idlePhase(speciesId) {
    let h = 0;
    for (let i = 0; i < speciesId.length; i++) h = (h * 31 + speciesId.charCodeAt(i)) | 0;
    const step = (Math.floor(Date.now() / 260) + (h & 7)) % 4;
    return step === 0 ? 0 : step === 2 ? 1 : 0.5;
  }

  function drawMon(ctx, speciesId, x, y, scale) {
    const sp      = (window.DG && DG.SPECIES) ? DG.SPECIES[speciesId] : null;
    const col     = sp ? (sp.color  || '#FF6600') : '#FF6600';
    const col2    = sp ? (sp.color2 || col)       : col;
    const type    = (sp && sp.types && sp.types[0]) ? sp.types[0] : 'NORMAL';
    const accent  = _TYPE_ACCENT[type] || '#999988';
    const stage   = _STAGE_MAP[speciesId] !== undefined ? _STAGE_MAP[speciesId] : 2;
    const variant = _VARIANT_MAP[speciesId] || 0;

    // Stage-based scale multiplier: babies look noticeably smaller
    const stageMul   = [0.75, 0.88, 1.0][stage] || 1.0;
    // Ground anchor: shift down so the bottom of sprite stays at same y position
    // Sprites draw 0-36 in local y; ground is at y=36. At stageMul<1, sprite is shorter,
    // so we shift origin down by the missing height to keep feet grounded.
    const stageOffY  = 36 * (1.0 - stageMul) * scale;

    const archKey = _ARCHETYPE_MAP[speciesId] || 'GENERIC';
    const fn = _ARCHETYPES[archKey] || _drawGeneric;

    // Effectieve schaal lokale-unit → canvas-pixel, inclusief externe transforms
    // (drawBattleScene tekent de vijand binnen een ctx.scale(-1.9, 1.9)).
    const eff = scale * stageMul;
    let tfScale = 1;
    try {
      const m = ctx.getTransform();
      tfScale = Math.sqrt(Math.abs(m.a * m.d - m.b * m.c)) || 1;
    } catch (e) {}
    const screenEff = eff * tfScale;

    // Grote weergaves (battle, detail-views): ×2 pixelblokken + idle-animatie.
    // Kleine lijst-sprites: 1:1 rasterisatie (wel posterize+outline, geen chunks).
    const chunk   = screenEff >= 1.1 ? 2 : 1;
    const density = screenEff / chunk;
    const bw = Math.ceil(_PIX.W * density), bh = Math.ceil(_PIX.H * density);

    let baked = false;
    if (bw > 0 && bh > 0 && bw < 600 && bh < 600) {
      try {
        const bctx = _bakeCtx(bw, bh);
        bctx.setTransform(1, 0, 0, 1, 0, 0);
        bctx.clearRect(0, 0, bw, bh);
        bctx.setTransform(density, 0, 0, density, _PIX.PAD_X * density, _PIX.PAD_T * density);
        if (chunk === 2) {
          const br = _idlePhase(speciesId);
          if (br > 0) {
            bctx.translate(16, 36);
            bctx.scale(1 + br * 0.03, 1 - br * 0.045);
            bctx.translate(-16, -36);
          }
        }
        bctx.save();
        try {
          fn(bctx, col, col2, accent, stage, variant);
        } catch (e) {
          console.warn('[DinoMon] sprite error for', speciesId, e);
          _drawGeneric(bctx, col, col2, accent, stage, variant);
        }
        bctx.restore();
        bctx.save();
        try { _drawTypeAmbient(bctx, type, accent, stage); } catch (e) {}
        bctx.restore();
        bctx.setTransform(1, 0, 0, 1, 0, 0);
        // FASE 12: patroon-config — type bepaalt het soort, de species-hash
        // varieert periode/fase zodat elke dino zijn eigen tekening heeft
        let _h12 = 0;
        for (let ci = 0; ci < speciesId.length; ci++) _h12 = (_h12 * 31 + speciesId.charCodeAt(ci)) | 0;
        _h12 = Math.abs(_h12);
        const _pcHex = _darken(col2 !== col ? col2 : accent, 30);
        const _pcRgb = _hex2rgb(_pcHex);
        _patCfg = {
          kind: _TYPE_PATTERN[type] || 'counter',
          r: _pcRgb[0], g: _pcRgb[1], b: _pcRgb[2],
          period: Math.max(3, Math.round((5 + (_h12 % 4)) * density)),
          seed: _h12 % 97,
        };
        _gbaFinish(bctx, bw, bh);
        baked = true;
      } catch (e) { /* val terug op vector-pad */ }
    }

    ctx.save();
    if (baked) {
      // Blit met voet-anker: lokaal y=36 moet exact op y + stageOffY + 36*eff landen
      const unitPer = density * chunk / tfScale;            // caller-px per lokale unit
      const dw = bw * chunk / tfScale, dh = bh * chunk / tfScale;
      const dx = x - _PIX.PAD_X * unitPer;
      const dy = (y + stageOffY + 36 * eff) - (36 + _PIX.PAD_T) * unitPer;
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(_PIX.canvas, 0, 0, bw, bh,
        (tfScale === 1) ? Math.round(dx) : dx,
        (tfScale === 1) ? Math.round(dy) : dy, dw, dh);
    } else {
      // Fallback: het oude directe vector-pad
      ctx.translate(x, y + stageOffY);
      ctx.scale(eff, eff);
      try {
        fn(ctx, col, col2, accent, stage, variant);
      } catch (e) {
        _drawGeneric(ctx, col, col2, accent, stage, variant);
      }
      try { _drawTypeAmbient(ctx, type, accent, stage); } catch (e) {}
    }
    ctx.restore();
  }

  // ── Battle Scene ──────────────────────────────────────────────
  // ── FASE 11: pixel-pipeline + atmosfeer voor de battle-achtergrond ──
  const _BG = { canvas: null, ctx: null, W: 240, H: 160 };
  function _bgCtx() {
    if (!_BG.canvas) {
      _BG.canvas = document.createElement('canvas');
      _BG.canvas.width = _BG.W;
      _BG.canvas.height = _BG.H;
      _BG.ctx = _BG.canvas.getContext('2d', { willReadFrequently: true });
    }
    return _BG.ctx;
  }

  // Lichte posterize (14 niveaus per kanaal) — kleurbanden passend bij de sprites
  function _bgFinish(bctx) {
    try {
      const img = bctx.getImageData(0, 0, _BG.W, _BG.H);
      const d = img.data;
      for (let i = 0; i < d.length; i += 4) {
        d[i]     = Math.round(d[i]     / 18) * 18;
        d[i + 1] = Math.round(d[i + 1] / 18) * 18;
        d[i + 2] = Math.round(d[i + 2] / 18) * 18;
      }
      bctx.putImageData(img, 0, 0);
    } catch(e) {}
  }

  // Biome-deeltjes: kleur + bewegingsmodus per thema
  const _ATMO_CFG = {
    VOLCANIC: { col: '#ff7733', mode: 'rise'  },  // opstijgende sintels
    SWAMP:    { col: '#9fb86a', mode: 'rise'  },  // moerassporen
    COASTAL:  { col: '#bfe8ff', mode: 'rise'  },  // zeespray
    WATER:    { col: '#bfe8ff', mode: 'rise'  },
    FOREST:   { col: '#7fc46a', mode: 'drift' },  // dwarrelende bladeren
    AMBER:    { col: '#e8c878', mode: 'drift' },
    GRANITE:  { col: '#cfcfd8', mode: 'drift' },
    TUNDRA:   { col: '#eaf6ff', mode: 'fall'  },  // sneeuw
    SUMMIT:   { col: '#eaf6ff', mode: 'fall'  },
    MOUNTAIN: { col: '#d8e8f5', mode: 'fall'  },
    DESERT:   { col: '#e0c080', mode: 'wind'  },  // stuifzand
    DEFAULT:  { col: '#fff7d8', mode: 'drift' },  // stofjes/pollen
  };

  // Wolken + biome-deeltjes — getekend ín de half-res laag zodat ze meepixelen
  function _drawBattleAtmosphere(ctx, theme, anim, W, H) {
    const mapId = window.DG_CURRENT_MAP_ID;
    const indoor = !!(DG.MAPS && DG.MAPS[mapId] && (DG.MAPS[mapId].isIndoor || DG.MAPS[mapId].isCave));
    if (indoor) return;
    ctx.save();
    // drijvende pixelwolken in de bovenste schermhelft
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 3; i++) {
      const cx = ((anim * (0.12 + i * 0.05) + i * 210) % (W + 160)) - 80;
      const cy = 16 + i * 20;
      ctx.globalAlpha = 0.4 - i * 0.07;
      ctx.fillRect(cx - 18, cy, 36, 8);
      ctx.fillRect(cx - 10, cy - 6, 22, 8);
      ctx.fillRect(cx + 2, cy + 2, 20, 6);
    }
    // biome-deeltjes
    const cfg = _ATMO_CFG[theme] || _ATMO_CFG.DEFAULT;
    ctx.fillStyle = cfg.col;
    for (let i = 0; i < 12; i++) {
      const seed = i * 73.7;
      let px2, py2;
      if (cfg.mode === 'rise') {
        px2 = (seed * 13) % W + Math.sin(anim * 0.02 + i) * 8;
        py2 = H - ((anim * (0.5 + (i % 3) * 0.25) + seed) % H);
      } else if (cfg.mode === 'fall') {
        px2 = (seed * 13) % W + Math.sin(anim * 0.03 + i) * 10;
        py2 = (anim * (0.6 + (i % 3) * 0.3) + seed) % H;
      } else if (cfg.mode === 'wind') {
        px2 = ((anim * (1.2 + (i % 3) * 0.5) + seed) % (W + 40)) - 20;
        py2 = (seed * 7) % H;
      } else { // drift
        px2 = ((anim * (0.3 + (i % 3) * 0.15) + seed) % (W + 30)) - 15;
        py2 = ((seed * 7) % (H * 0.8)) + Math.sin(anim * 0.03 + i) * 12;
      }
      ctx.globalAlpha = 0.3 + (i % 3) * 0.15;
      ctx.fillRect(px2, py2, 3, 3);
    }
    ctx.restore();
  }

  function drawBattleScene(ctx, playerMon, enemyMon, animOffset, playerOffset, enemyOffset) {
    playerOffset = playerOffset || { x: 0, y: 0 };
    enemyOffset  = enemyOffset  || { x: 0, y: 0 };
    const W = DG.CANVAS.W, H = DG.CANVAS.H;
    const theme = window.DG_MAP_THEME || 'DEFAULT';
    const anim  = animOffset || 0;

    // ── FASE 11: de complete achtergrond rendert naar een half-res
    // offscreen canvas (alle bestaande biome-code blijft ongewijzigd),
    // krijgt een lichte posterize en wordt blokkig ×2 opgeschaald —
    // dezelfde pixel-stijl als de sprites, animaties pixelen mee.
    // Performance: de achtergrond ververst op 30 fps (om het frame); op
    // skip-frames gaat alle inline tekenwerk naar een wegwerp-canvasje
    // en blitten we de vorige (al geposterizede) achtergrond.
    const _realCtx = ctx;
    const _bgRedraw = _BG.lastStamp === undefined || _BG.lastTheme !== theme ||
                      anim - _BG.lastStamp >= 2 || anim < _BG.lastStamp;
    if (_bgRedraw) {
      _BG.lastStamp = anim;
      _BG.lastTheme = theme;
      ctx = _bgCtx();
      ctx.setTransform(0.5, 0, 0, 0.5, 0, 0);
      ctx.clearRect(0, 0, W, H);
    } else {
      if (!_BG.dummy) {
        _BG.dummy = document.createElement('canvas');
        _BG.dummy.width = 4; _BG.dummy.height = 4;
        _BG.dummyCtx = _BG.dummy.getContext('2d');
      }
      ctx = _BG.dummyCtx;
      ctx.setTransform(0.008, 0, 0, 0.008, 0, 0);
    }

    // ── Sky + Ground + Platforms per biome ────────────────────
    if (theme === 'COASTAL' || theme === 'WATER') {
      // Ocean beach scene
      const sky = ctx.createLinearGradient(0,0,0,H*0.55);
      sky.addColorStop(0,'#2a5a8a'); sky.addColorStop(1,'#5a9abc');
      ctx.fillStyle=sky; ctx.fillRect(0,0,W,H*0.55);
      // Ocean horizon strip
      ctx.fillStyle='#1a4a7a'; ctx.fillRect(0,H*0.40,W,H*0.15);
      ctx.fillStyle='#246090'; ctx.fillRect(0,H*0.38,W,3);
      // Animated waves
      for (let w=0;w<3;w++) {
        ctx.strokeStyle=`rgba(100,180,220,${0.3-w*0.08})`; ctx.lineWidth=1.5;
        const woff=(anim*0.4+w*40)%W;
        ctx.beginPath(); ctx.moveTo(-10,H*0.42+w*4);
        for (let x=0;x<W+20;x+=20) ctx.lineTo(x+woff,H*0.42+w*4+Math.sin((x+anim*2)*0.1)*3);
        ctx.stroke();
      }
      // Sandy beach ground
      const ground=ctx.createLinearGradient(0,H*0.55,0,H);
      ground.addColorStop(0,'#c8a860'); ground.addColorStop(0.4,'#b09050'); ground.addColorStop(1,'#8a7040');
      ctx.fillStyle=ground; ctx.fillRect(0,H*0.55,W,H*0.45);
      // Beach texture lines
      ctx.strokeStyle='rgba(0,0,0,0.08)'; ctx.lineWidth=1;
      for(let i=0;i<5;i++){const gy=H*0.58+i*(H*0.42/5);ctx.beginPath();ctx.moveTo(0,gy);ctx.lineTo(W,gy+1);ctx.stroke();}
      // Enemy platform: wet sand
      const epX=W*0.50,epY=H*0.22;
      ctx.fillStyle='rgba(0,0,0,0.2)'; ctx.beginPath(); ctx.ellipse(epX+50,epY+48,52,16,0,0,Math.PI*2); ctx.fill();
      const epg=ctx.createLinearGradient(epX,epY+30,epX,epY+56);
      epg.addColorStop(0,'#a08840'); epg.addColorStop(1,'#706030');
      ctx.fillStyle=epg; ctx.beginPath(); ctx.ellipse(epX+50,epY+44,52,14,0,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='rgba(100,160,200,0.3)'; ctx.beginPath(); ctx.ellipse(epX+50,epY+38,52,8,0,0,Math.PI*2); ctx.fill();
      // Player platform: sandy with wet sheen
      const ppX=W*0.04,ppY=H*0.52;
      ctx.fillStyle='rgba(0,0,0,0.2)'; ctx.beginPath(); ctx.ellipse(ppX+52,ppY+34,56,16,0,0,Math.PI*2); ctx.fill();
      const ppg=ctx.createLinearGradient(ppX,ppY+22,ppX,ppY+50);
      ppg.addColorStop(0,'#b09050'); ppg.addColorStop(1,'#806830');
      ctx.fillStyle=ppg; ctx.beginPath(); ctx.ellipse(ppX+52,ppY+30,56,14,0,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='rgba(100,160,200,0.25)'; ctx.beginPath(); ctx.ellipse(ppX+52,ppY+24,56,8,0,0,Math.PI*2); ctx.fill();

    } else if (theme === 'DESERT') {
      // Desert dunes
      const sky=ctx.createLinearGradient(0,0,0,H*0.55);
      sky.addColorStop(0,'#c87820'); sky.addColorStop(0.5,'#e8a840'); sky.addColorStop(1,'#f0c060');
      ctx.fillStyle=sky; ctx.fillRect(0,0,W,H*0.55);
      // Sun disc
      const sunG=ctx.createRadialGradient(W*0.75,H*0.08,2,W*0.75,H*0.08,28);
      sunG.addColorStop(0,'rgba(255,240,120,0.95)'); sunG.addColorStop(1,'rgba(255,200,50,0)');
      ctx.fillStyle=sunG; ctx.fillRect(0,0,W,H*0.4);
      // Far dunes
      ctx.fillStyle='#c09030';
      ctx.beginPath(); ctx.moveTo(0,H*0.55);
      ctx.bezierCurveTo(80,H*0.30,160,H*0.48,240,H*0.32);
      ctx.bezierCurveTo(320,H*0.18,400,H*0.40,W,H*0.28);
      ctx.lineTo(W,H*0.55); ctx.closePath(); ctx.fill();
      // Mid dunes
      ctx.fillStyle='#d8a840';
      ctx.beginPath(); ctx.moveTo(0,H*0.62); ctx.bezierCurveTo(80,H*0.44,160,H*0.56,240,H*0.48);
      ctx.bezierCurveTo(320,H*0.40,400,H*0.52,W,H*0.45); ctx.lineTo(W,H*0.62); ctx.lineTo(0,H*0.62); ctx.fill();
      // Ground
      const ground=ctx.createLinearGradient(0,H*0.58,0,H);
      ground.addColorStop(0,'#d8a830'); ground.addColorStop(0.5,'#c09020'); ground.addColorStop(1,'#a07810');
      ctx.fillStyle=ground; ctx.fillRect(0,H*0.58,W,H*0.42);
      // Sand ripples
      ctx.strokeStyle='rgba(0,0,0,0.07)'; ctx.lineWidth=1;
      for(let i=0;i<6;i++){const gy=H*0.62+i*(H*0.38/6);ctx.beginPath();ctx.moveTo(0,gy);ctx.bezierCurveTo(W/3,gy+2,2*W/3,gy-1,W,gy+1);ctx.stroke();}
      // Enemy platform: sand dune
      const epX=W*0.50,epY=H*0.22;
      ctx.fillStyle='rgba(0,0,0,0.2)'; ctx.beginPath(); ctx.ellipse(epX+50,epY+48,52,16,0,0,Math.PI*2); ctx.fill();
      const epg=ctx.createLinearGradient(epX,epY+30,epX,epY+56);
      epg.addColorStop(0,'#d8a830'); epg.addColorStop(1,'#a07818');
      ctx.fillStyle=epg; ctx.beginPath(); ctx.ellipse(epX+50,epY+44,52,14,0,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#e8c050'; ctx.beginPath(); ctx.ellipse(epX+50,epY+38,52,8,0,0,Math.PI*2); ctx.fill();
      // Player platform
      const ppX=W*0.04,ppY=H*0.52;
      ctx.fillStyle='rgba(0,0,0,0.2)'; ctx.beginPath(); ctx.ellipse(ppX+52,ppY+34,56,16,0,0,Math.PI*2); ctx.fill();
      const ppg=ctx.createLinearGradient(ppX,ppY+22,ppX,ppY+50);
      ppg.addColorStop(0,'#d0a030'); ppg.addColorStop(1,'#906818');
      ctx.fillStyle=ppg; ctx.beginPath(); ctx.ellipse(ppX+52,ppY+30,56,14,0,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#e0b840'; ctx.beginPath(); ctx.ellipse(ppX+52,ppY+24,56,8,0,0,Math.PI*2); ctx.fill();

    } else if (theme === 'VOLCANIC' || theme === 'FIRE') {
      // Volcanic hellscape
      const sky=ctx.createLinearGradient(0,0,0,H*0.55);
      sky.addColorStop(0,'#0c0202'); sky.addColorStop(0.4,'#2a0808'); sky.addColorStop(1,'#4a1010');
      ctx.fillStyle=sky; ctx.fillRect(0,0,W,H*0.55);
      // Lava glow at horizon
      const lavaPulse=0.5+0.5*Math.sin(anim*0.05);
      const horizG=ctx.createLinearGradient(0,H*0.38,0,H*0.55);
      horizG.addColorStop(0,'rgba(0,0,0,0)'); horizG.addColorStop(1,`rgba(220,${Math.floor(60+40*lavaPulse)},0,0.7)`);
      ctx.fillStyle=horizG; ctx.fillRect(0,H*0.38,W,H*0.2);
      // Jagged mountain silhouettes
      ctx.fillStyle='#180404';
      ctx.beginPath(); ctx.moveTo(0,H*0.55);
      ctx.lineTo(40,H*0.25); ctx.lineTo(80,H*0.42); ctx.lineTo(130,H*0.18);
      ctx.lineTo(180,H*0.38); ctx.lineTo(230,H*0.12); ctx.lineTo(280,H*0.32);
      ctx.lineTo(330,H*0.20); ctx.lineTo(380,H*0.38); ctx.lineTo(420,H*0.15);
      ctx.lineTo(W,H*0.35); ctx.lineTo(W,H*0.55); ctx.closePath(); ctx.fill();
      // Smoke wisps
      for(let s=0;s<3;s++){
        const sx=120+s*120, sy=H*0.18-s*10;
        const sOff=Math.sin(anim*0.02+s)*8;
        ctx.strokeStyle=`rgba(80,70,60,${0.25-s*0.05})`; ctx.lineWidth=4+s*2;
        ctx.beginPath(); ctx.moveTo(sx,sy); ctx.bezierCurveTo(sx+sOff,sy-20,sx-sOff,sy-40,sx+sOff*0.5,sy-60); ctx.stroke();
      }
      // Dark lava ground
      const ground=ctx.createLinearGradient(0,H*0.55,0,H);
      ground.addColorStop(0,'#1a0808'); ground.addColorStop(0.4,'#120404'); ground.addColorStop(1,'#080202');
      ctx.fillStyle=ground; ctx.fillRect(0,H*0.55,W,H*0.45);
      // Lava cracks in ground
      ctx.strokeStyle=`rgba(220,80,0,${0.3+0.2*lavaPulse})`; ctx.lineWidth=1.5;
      [[50,H*0.62,120,H*0.70],[200,H*0.65,280,H*0.58],[320,H*0.70,400,H*0.64]].forEach(([x1,y1,x2,y2])=>{
        ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
      });
      // Enemy platform: black obsidian
      const epX=W*0.50,epY=H*0.22;
      ctx.fillStyle='rgba(0,0,0,0.4)'; ctx.beginPath(); ctx.ellipse(epX+50,epY+48,52,16,0,0,Math.PI*2); ctx.fill();
      const epg=ctx.createLinearGradient(epX,epY+30,epX,epY+56);
      epg.addColorStop(0,'#1a0808'); epg.addColorStop(1,'#0c0404');
      ctx.fillStyle=epg; ctx.beginPath(); ctx.ellipse(epX+50,epY+44,52,14,0,0,Math.PI*2); ctx.fill();
      ctx.fillStyle=`rgba(220,80,0,${0.4+0.2*lavaPulse})`; ctx.beginPath(); ctx.ellipse(epX+50,epY+38,52,8,0,0,Math.PI*2); ctx.fill();
      // Player platform
      const ppX=W*0.04,ppY=H*0.52;
      ctx.fillStyle='rgba(0,0,0,0.4)'; ctx.beginPath(); ctx.ellipse(ppX+52,ppY+34,56,16,0,0,Math.PI*2); ctx.fill();
      const ppg=ctx.createLinearGradient(ppX,ppY+22,ppX,ppY+50);
      ppg.addColorStop(0,'#180606'); ppg.addColorStop(1,'#0a0202');
      ctx.fillStyle=ppg; ctx.beginPath(); ctx.ellipse(ppX+52,ppY+30,56,14,0,0,Math.PI*2); ctx.fill();
      ctx.fillStyle=`rgba(220,80,0,${0.35+0.2*lavaPulse})`; ctx.beginPath(); ctx.ellipse(ppX+52,ppY+24,56,8,0,0,Math.PI*2); ctx.fill();

    } else if (theme === 'FOREST' || theme === 'GRASS') {
      // Ancient forest
      const sky=ctx.createLinearGradient(0,0,0,H*0.55);
      sky.addColorStop(0,'#0d2808'); sky.addColorStop(0.5,'#1a4010'); sky.addColorStop(1,'#2a5818');
      ctx.fillStyle=sky; ctx.fillRect(0,0,W,H*0.55);
      // Light rays through canopy
      for(let r=0;r<4;r++){
        const rx=80+r*100, ra=0.04+0.03*Math.sin(anim*0.02+r);
        const rg=ctx.createLinearGradient(rx,0,rx+20,H*0.5);
        rg.addColorStop(0,`rgba(180,220,80,${ra})`); rg.addColorStop(1,'rgba(180,220,80,0)');
        ctx.fillStyle=rg; ctx.fillRect(rx,0,20,H*0.5);
      }
      // Canopy silhouette at top
      ctx.fillStyle='#082008';
      ctx.beginPath(); ctx.moveTo(0,0);
      for(let x=0;x<=W;x+=30) ctx.lineTo(x, 10+Math.abs(Math.sin(x*0.05+anim*0.01))*25);
      ctx.lineTo(W,0); ctx.closePath(); ctx.fill();
      // Mid-tree silhouettes
      ctx.fillStyle='#0c2c08';
      ctx.beginPath(); ctx.moveTo(0,H*0.55);
      ctx.bezierCurveTo(60,H*0.30,120,H*0.46,180,H*0.26);
      ctx.bezierCurveTo(240,H*0.15,300,H*0.38,360,H*0.22);
      ctx.bezierCurveTo(420,H*0.10,460,H*0.35,W,H*0.28);
      ctx.lineTo(W,H*0.55); ctx.closePath(); ctx.fill();
      // Dark forest floor
      const ground=ctx.createLinearGradient(0,H*0.55,0,H);
      ground.addColorStop(0,'#1a3010'); ground.addColorStop(0.4,'#142808'); ground.addColorStop(1,'#0c1c04');
      ctx.fillStyle=ground; ctx.fillRect(0,H*0.55,W,H*0.45);
      // Root lines
      ctx.strokeStyle='rgba(40,20,0,0.4)'; ctx.lineWidth=2;
      [[0,H*0.62,80,H*0.70],[W*0.5,H*0.68,W*0.7,H*0.62],[W*0.8,H*0.65,W,H*0.72]].forEach(([x1,y1,x2,y2])=>{ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();});
      // Enemy platform: mossy root
      const epX=W*0.50,epY=H*0.22;
      ctx.fillStyle='rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.ellipse(epX+50,epY+48,52,16,0,0,Math.PI*2); ctx.fill();
      const epg=ctx.createLinearGradient(epX,epY+30,epX,epY+56);
      epg.addColorStop(0,'#2a5010'); epg.addColorStop(1,'#1a3008');
      ctx.fillStyle=epg; ctx.beginPath(); ctx.ellipse(epX+50,epY+44,52,14,0,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#386818'; ctx.beginPath(); ctx.ellipse(epX+50,epY+38,52,8,0,0,Math.PI*2); ctx.fill();
      // Player platform
      const ppX=W*0.04,ppY=H*0.52;
      ctx.fillStyle='rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.ellipse(ppX+52,ppY+34,56,16,0,0,Math.PI*2); ctx.fill();
      const ppg=ctx.createLinearGradient(ppX,ppY+22,ppX,ppY+50);
      ppg.addColorStop(0,'#244010'); ppg.addColorStop(1,'#162808');
      ctx.fillStyle=ppg; ctx.beginPath(); ctx.ellipse(ppX+52,ppY+30,56,14,0,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#306018'; ctx.beginPath(); ctx.ellipse(ppX+52,ppY+24,56,8,0,0,Math.PI*2); ctx.fill();

    } else if (theme === 'TUNDRA' || theme === 'SUMMIT') {
      // Arctic snowscape
      const sky=ctx.createLinearGradient(0,0,0,H*0.55);
      sky.addColorStop(0,'#8ab0d0'); sky.addColorStop(0.5,'#aacce8'); sky.addColorStop(1,'#c8e4f8');
      ctx.fillStyle=sky; ctx.fillRect(0,0,W,H*0.55);
      // Blizzard clouds
      for(let c=0;c<5;c++){
        const cx=(((anim*0.2+c*90)%( W+100))-50);
        ctx.fillStyle=`rgba(200,220,240,${0.4+c*0.05})`;
        ctx.beginPath(); ctx.ellipse(cx,H*(0.06+c*0.05),50+c*15,15+c*5,0,0,Math.PI*2); ctx.fill();
      }
      // Snowy mountains
      ctx.fillStyle='#b8d0e8';
      ctx.beginPath(); ctx.moveTo(0,H*0.55); ctx.lineTo(60,H*0.22); ctx.lineTo(100,H*0.35);
      ctx.lineTo(160,H*0.12); ctx.lineTo(210,H*0.32); ctx.lineTo(280,H*0.08);
      ctx.lineTo(340,H*0.28); ctx.lineTo(400,H*0.15); ctx.lineTo(W,H*0.34); ctx.lineTo(W,H*0.55); ctx.closePath(); ctx.fill();
      // Snow caps
      ctx.fillStyle='rgba(240,250,255,0.9)';
      [[60,H*0.22,25],[160,H*0.12,32],[280,H*0.08,40],[400,H*0.15,28]].forEach(([mx,my,mw])=>{
        ctx.beginPath(); ctx.ellipse(mx,my,mw,10,0,0,Math.PI*2); ctx.fill();
      });
      // Snow ground
      const ground=ctx.createLinearGradient(0,H*0.55,0,H);
      ground.addColorStop(0,'#dceef8'); ground.addColorStop(0.4,'#c8e0f0'); ground.addColorStop(1,'#a8c8e0');
      ctx.fillStyle=ground; ctx.fillRect(0,H*0.55,W,H*0.45);
      // Snow texture dots
      ctx.fillStyle='rgba(200,220,240,0.5)';
      for(let i=0;i<20;i++) ctx.fillRect(20+i*22,H*0.65+Math.sin(i)*8,4,2);
      // Enemy platform: ice mound
      const epX=W*0.50,epY=H*0.22;
      ctx.fillStyle='rgba(0,0,0,0.15)'; ctx.beginPath(); ctx.ellipse(epX+50,epY+48,52,16,0,0,Math.PI*2); ctx.fill();
      const epg=ctx.createLinearGradient(epX,epY+30,epX,epY+56);
      epg.addColorStop(0,'#8ab0d0'); epg.addColorStop(1,'#6090b0');
      ctx.fillStyle=epg; ctx.beginPath(); ctx.ellipse(epX+50,epY+44,52,14,0,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='rgba(220,240,255,0.9)'; ctx.beginPath(); ctx.ellipse(epX+50,epY+38,52,8,0,0,Math.PI*2); ctx.fill();
      // Player platform
      const ppX=W*0.04,ppY=H*0.52;
      ctx.fillStyle='rgba(0,0,0,0.15)'; ctx.beginPath(); ctx.ellipse(ppX+52,ppY+34,56,16,0,0,Math.PI*2); ctx.fill();
      const ppg=ctx.createLinearGradient(ppX,ppY+22,ppX,ppY+50);
      ppg.addColorStop(0,'#80a8c8'); ppg.addColorStop(1,'#5888a8');
      ctx.fillStyle=ppg; ctx.beginPath(); ctx.ellipse(ppX+52,ppY+30,56,14,0,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='rgba(210,235,255,0.92)'; ctx.beginPath(); ctx.ellipse(ppX+52,ppY+24,56,8,0,0,Math.PI*2); ctx.fill();

    } else if (theme === 'SWAMP') {
      // Dark swamp
      const sky=ctx.createLinearGradient(0,0,0,H*0.55);
      sky.addColorStop(0,'#101810'); sky.addColorStop(0.5,'#182818'); sky.addColorStop(1,'#203020');
      ctx.fillStyle=sky; ctx.fillRect(0,0,W,H*0.55);
      // Sickly moon/light glow
      const moonG=ctx.createRadialGradient(W*0.2,H*0.12,2,W*0.2,H*0.12,40);
      moonG.addColorStop(0,'rgba(180,220,160,0.3)'); moonG.addColorStop(1,'rgba(100,160,80,0)');
      ctx.fillStyle=moonG; ctx.fillRect(0,0,W,H*0.4);
      // Dead tree silhouettes
      ctx.fillStyle='#0c1408'; ctx.strokeStyle='#0c1408'; ctx.lineWidth=3;
      [[50,H*0.5],[160,H*0.45],[320,H*0.48],[440,H*0.50]].forEach(([tx,ty])=>{
        ctx.beginPath(); ctx.moveTo(tx,ty); ctx.lineTo(tx-3,ty-35); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(tx-3,ty-25); ctx.lineTo(tx-15,ty-38); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(tx-3,ty-20); ctx.lineTo(tx+10,ty-32); ctx.stroke();
      });
      // Misty mid-ground
      ctx.fillStyle='rgba(50,80,40,0.5)';
      ctx.beginPath(); ctx.moveTo(0,H*0.55);
      ctx.bezierCurveTo(80,H*0.40,160,H*0.52,240,H*0.44);
      ctx.bezierCurveTo(320,H*0.36,400,H*0.48,W,H*0.42);
      ctx.lineTo(W,H*0.55); ctx.closePath(); ctx.fill();
      // Dark swamp water ground
      const ground=ctx.createLinearGradient(0,H*0.55,0,H);
      ground.addColorStop(0,'#182818'); ground.addColorStop(0.5,'#101c10'); ground.addColorStop(1,'#0c1408');
      ctx.fillStyle=ground; ctx.fillRect(0,H*0.55,W,H*0.45);
      // Water ripples
      ctx.strokeStyle='rgba(60,120,40,0.3)'; ctx.lineWidth=1;
      for(let i=0;i<4;i++){const gy=H*0.60+i*(H*0.35/4);ctx.beginPath();ctx.moveTo(0,gy);ctx.bezierCurveTo(W/3,gy+1,2*W/3,gy-1,W,gy);ctx.stroke();}
      // Fog wisps
      for(let f=0;f<3;f++){
        const fxa=((anim*0.15+f*120)%(W+100))-50;
        ctx.fillStyle=`rgba(80,140,60,0.12)`;
        ctx.beginPath(); ctx.ellipse(fxa,H*0.60+f*10,60,20,0,0,Math.PI*2); ctx.fill();
      }
      // Enemy platform: muddy mound
      const epX=W*0.50,epY=H*0.22;
      ctx.fillStyle='rgba(0,0,0,0.35)'; ctx.beginPath(); ctx.ellipse(epX+50,epY+48,52,16,0,0,Math.PI*2); ctx.fill();
      const epg=ctx.createLinearGradient(epX,epY+30,epX,epY+56);
      epg.addColorStop(0,'#243820'); epg.addColorStop(1,'#162410');
      ctx.fillStyle=epg; ctx.beginPath(); ctx.ellipse(epX+50,epY+44,52,14,0,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#304820'; ctx.beginPath(); ctx.ellipse(epX+50,epY+38,52,8,0,0,Math.PI*2); ctx.fill();
      // Player platform
      const ppX=W*0.04,ppY=H*0.52;
      ctx.fillStyle='rgba(0,0,0,0.35)'; ctx.beginPath(); ctx.ellipse(ppX+52,ppY+34,56,16,0,0,Math.PI*2); ctx.fill();
      const ppg=ctx.createLinearGradient(ppX,ppY+22,ppX,ppY+50);
      ppg.addColorStop(0,'#1c2c18'); ppg.addColorStop(1,'#101c0c');
      ctx.fillStyle=ppg; ctx.beginPath(); ctx.ellipse(ppX+52,ppY+30,56,14,0,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#284018'; ctx.beginPath(); ctx.ellipse(ppX+52,ppY+24,56,8,0,0,Math.PI*2); ctx.fill();

    } else if (theme === 'GRANITE' || theme === 'MOUNTAIN' || theme === 'ROCK' || theme === 'GROUND') {
      // Rocky canyon
      const sky=ctx.createLinearGradient(0,0,0,H*0.55);
      sky.addColorStop(0,'#5a6070'); sky.addColorStop(0.5,'#7a8090'); sky.addColorStop(1,'#9aa0a8');
      ctx.fillStyle=sky; ctx.fillRect(0,0,W,H*0.55);
      // Canyon walls (sides)
      ctx.fillStyle='#3a3830';
      ctx.fillRect(0,0,40,H*0.55); ctx.fillRect(W-40,0,40,H*0.55);
      // Rock strata on walls
      ['#504840','#605850','#483828'].forEach((c,i)=>{
        ctx.fillStyle=c; ctx.fillRect(0,H*(0.1+i*0.12),40,H*0.10);
        ctx.fillRect(W-40,H*(0.1+i*0.12),40,H*0.10);
      });
      // Rocky silhouettes
      ctx.fillStyle='#2a2820';
      ctx.beginPath(); ctx.moveTo(0,H*0.55); ctx.lineTo(40,H*0.28); ctx.lineTo(70,H*0.40);
      ctx.lineTo(100,H*0.20); ctx.lineTo(140,H*0.35); ctx.lineTo(170,H*0.18);
      ctx.lineTo(200,H*0.32); ctx.lineTo(230,H*0.22); ctx.lineTo(260,H*0.38);
      ctx.lineTo(290,H*0.15); ctx.lineTo(330,H*0.30); ctx.lineTo(360,H*0.20);
      ctx.lineTo(400,H*0.35); ctx.lineTo(440,H*0.22); ctx.lineTo(W,H*0.40); ctx.lineTo(W,H*0.55); ctx.closePath(); ctx.fill();
      // Grey stone ground
      const ground=ctx.createLinearGradient(0,H*0.55,0,H);
      ground.addColorStop(0,'#5a5550'); ground.addColorStop(0.4,'#484440'); ground.addColorStop(1,'#302c28');
      ctx.fillStyle=ground; ctx.fillRect(0,H*0.55,W,H*0.45);
      // Stone cracks
      ctx.strokeStyle='rgba(0,0,0,0.2)'; ctx.lineWidth=1;
      [[60,H*0.62,120,H*0.68],[200,H*0.70,260,H*0.65],[320,H*0.67,380,H*0.72]].forEach(([x1,y1,x2,y2])=>{ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();});
      // Enemy platform: stone slab
      const epX=W*0.50,epY=H*0.22;
      ctx.fillStyle='rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.ellipse(epX+50,epY+48,52,16,0,0,Math.PI*2); ctx.fill();
      const epg=ctx.createLinearGradient(epX,epY+30,epX,epY+56);
      epg.addColorStop(0,'#606058'); epg.addColorStop(1,'#404038');
      ctx.fillStyle=epg; ctx.beginPath(); ctx.ellipse(epX+50,epY+44,52,14,0,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#787070'; ctx.beginPath(); ctx.ellipse(epX+50,epY+38,52,8,0,0,Math.PI*2); ctx.fill();
      // Player platform
      const ppX=W*0.04,ppY=H*0.52;
      ctx.fillStyle='rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.ellipse(ppX+52,ppY+34,56,16,0,0,Math.PI*2); ctx.fill();
      const ppg=ctx.createLinearGradient(ppX,ppY+22,ppX,ppY+50);
      ppg.addColorStop(0,'#585050'); ppg.addColorStop(1,'#383030');
      ctx.fillStyle=ppg; ctx.beginPath(); ctx.ellipse(ppX+52,ppY+30,56,14,0,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#706868'; ctx.beginPath(); ctx.ellipse(ppX+52,ppY+24,56,8,0,0,Math.PI*2); ctx.fill();

    } else if (theme === 'ELECTRIC') {
      // Electric storm arena
      const sky=ctx.createLinearGradient(0,0,0,H*0.55);
      sky.addColorStop(0,'#040410'); sky.addColorStop(0.5,'#080820'); sky.addColorStop(1,'#0c0c30');
      ctx.fillStyle=sky; ctx.fillRect(0,0,W,H*0.55);
      // Storm clouds
      for(let c=0;c<4;c++){
        const cxc=((anim*0.3+c*120)%(W+120))-60;
        ctx.fillStyle=`rgba(30,30,60,${0.7+c*0.05})`;
        ctx.beginPath(); ctx.ellipse(cxc,H*(0.08+c*0.08),60+c*20,18+c*4,0,0,Math.PI*2); ctx.fill();
      }
      // Lightning bolt silhouette in bg
      const lp=0.2+0.15*Math.sin(anim*0.15);
      ctx.strokeStyle=`rgba(255,240,80,${lp})`; ctx.lineWidth=3;
      ctx.beginPath(); ctx.moveTo(W*0.7,0); ctx.lineTo(W*0.65,H*0.2); ctx.lineTo(W*0.72,H*0.2);
      ctx.lineTo(W*0.62,H*0.5); ctx.stroke();
      // Wet concrete ground
      const ground=ctx.createLinearGradient(0,H*0.55,0,H);
      ground.addColorStop(0,'#282830'); ground.addColorStop(0.4,'#1e1e28'); ground.addColorStop(1,'#141418');
      ctx.fillStyle=ground; ctx.fillRect(0,H*0.55,W,H*0.45);
      // Puddle reflections
      ctx.fillStyle='rgba(60,80,120,0.35)';
      [[80,H*0.68,40,8],[250,H*0.72,55,10],[380,H*0.67,35,7]].forEach(([ex,ey,ew,eh])=>{
        ctx.beginPath(); ctx.ellipse(ex,ey,ew,eh,0,0,Math.PI*2); ctx.fill();
      });
      // Enemy platform: metal
      const epX=W*0.50,epY=H*0.22;
      ctx.fillStyle='rgba(0,0,0,0.4)'; ctx.beginPath(); ctx.ellipse(epX+50,epY+48,52,16,0,0,Math.PI*2); ctx.fill();
      const epg=ctx.createLinearGradient(epX,epY+30,epX,epY+56);
      epg.addColorStop(0,'#2a2a40'); epg.addColorStop(1,'#181828');
      ctx.fillStyle=epg; ctx.beginPath(); ctx.ellipse(epX+50,epY+44,52,14,0,0,Math.PI*2); ctx.fill();
      ctx.fillStyle=`rgba(200,200,80,${0.3+0.2*Math.sin(anim*0.12)})`; ctx.beginPath(); ctx.ellipse(epX+50,epY+38,52,8,0,0,Math.PI*2); ctx.fill();
      // Player platform
      const ppX=W*0.04,ppY=H*0.52;
      ctx.fillStyle='rgba(0,0,0,0.4)'; ctx.beginPath(); ctx.ellipse(ppX+52,ppY+34,56,16,0,0,Math.PI*2); ctx.fill();
      const ppg=ctx.createLinearGradient(ppX,ppY+22,ppX,ppY+50);
      ppg.addColorStop(0,'#222238'); ppg.addColorStop(1,'#141420');
      ctx.fillStyle=ppg; ctx.beginPath(); ctx.ellipse(ppX+52,ppY+30,56,14,0,0,Math.PI*2); ctx.fill();
      ctx.fillStyle=`rgba(180,180,60,${0.25+0.2*Math.sin(anim*0.12)})`; ctx.beginPath(); ctx.ellipse(ppX+52,ppY+24,56,8,0,0,Math.PI*2); ctx.fill();

    } else if (theme === 'DRAGON') {
      // Dragon Citadel — void sky with arcane energy and floating crystal shards
      // Sky: deep void purple-black gradient
      const sky = ctx.createLinearGradient(0, 0, 0, H * 0.6);
      sky.addColorStop(0, '#0a0010'); sky.addColorStop(0.4, '#1a0535'); sky.addColorStop(1, '#2d0a55');
      ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H * 0.6);
      // Swirling arcane nebula clouds in background
      const nc = anim * 0.04;
      [[W*0.15,H*0.08,90,22,'rgba(80,0,180,0.18)'],[W*0.55,H*0.05,110,18,'rgba(120,0,200,0.15)'],
       [W*0.35,H*0.18,70,14,'rgba(60,0,150,0.20)'],[W*0.75,H*0.14,80,16,'rgba(100,20,180,0.14)']
      ].forEach(([nx,ny,nw,nh,nc2],i)=>{
        const pulse = Math.sin(nc + i * 1.2) * 0.06;
        ctx.fillStyle = nc2;
        ctx.beginPath(); ctx.ellipse(nx + Math.sin(nc*0.7+i)*8, ny, nw*(1+pulse), nh*(1+pulse), 0, 0, Math.PI*2); ctx.fill();
      });
      // Floating crystal shards in the distance
      const shards = [[W*0.08,H*0.25,8,28],[W*0.18,H*0.18,6,20],[W*0.82,H*0.22,7,24],
                      [W*0.90,H*0.30,5,18],[W*0.62,H*0.10,6,22],[W*0.42,H*0.08,5,16]];
      shards.forEach(([sx,sy,sw,sh],i) => {
        const floatY = sy + Math.sin(anim*0.06 + i*0.9) * 4;
        const glow = 0.4 + 0.3 * Math.sin(anim*0.09 + i*1.1);
        // Crystal shard shape
        ctx.fillStyle = `rgba(160,80,255,${glow*0.7})`;
        ctx.beginPath();
        ctx.moveTo(sx, floatY - sh); ctx.lineTo(sx + sw, floatY - sh*0.3);
        ctx.lineTo(sx + sw*0.8, floatY + sh*0.4); ctx.lineTo(sx, floatY + sh);
        ctx.lineTo(sx - sw*0.5, floatY + sh*0.2); ctx.lineTo(sx - sw*0.3, floatY - sh*0.5);
        ctx.closePath(); ctx.fill();
        // Crystal inner highlight
        ctx.fillStyle = `rgba(220,180,255,${glow*0.4})`;
        ctx.beginPath();
        ctx.moveTo(sx, floatY - sh*0.8); ctx.lineTo(sx + sw*0.4, floatY - sh*0.1);
        ctx.lineTo(sx, floatY + sh*0.3); ctx.lineTo(sx - sw*0.2, floatY - sh*0.1);
        ctx.closePath(); ctx.fill();
      });
      // Arcane energy wisps drifting across sky
      for (let w2=0; w2<4; w2++) {
        const wx = ((anim*1.2 + w2*110) % (W+60)) - 30;
        const wy = H*(0.12 + w2*0.07) + Math.sin(anim*0.07+w2)*8;
        const wa = 0.15 + 0.1*Math.sin(anim*0.11+w2*0.8);
        ctx.strokeStyle = `rgba(180,100,255,${wa})`; ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(wx, wy);
        ctx.bezierCurveTo(wx+20, wy-8+Math.sin(anim*0.08+w2)*5, wx+40, wy+6, wx+60, wy+2);
        ctx.stroke();
      }
      // Distant dragon-scale mountains silhouette
      ctx.fillStyle = '#150028';
      ctx.beginPath(); ctx.moveTo(0, H*0.55);
      ctx.lineTo(30, H*0.30); ctx.lineTo(55, H*0.42); ctx.lineTo(85, H*0.22);
      ctx.lineTo(115, H*0.38); ctx.lineTo(150, H*0.18); ctx.lineTo(185, H*0.34);
      ctx.lineTo(220, H*0.26); ctx.lineTo(260, H*0.40); ctx.lineTo(300, H*0.20);
      ctx.lineTo(340, H*0.35); ctx.lineTo(375, H*0.24); ctx.lineTo(410, H*0.38);
      ctx.lineTo(445, H*0.28); ctx.lineTo(W, H*0.42); ctx.lineTo(W, H*0.55);
      ctx.closePath(); ctx.fill();
      // Mountain scale-texture ridge highlights (purple sheen)
      ctx.strokeStyle='rgba(120,40,200,0.18)'; ctx.lineWidth=1;
      [[30,H*0.30,55,H*0.42],[85,H*0.22,115,H*0.38],[150,H*0.18,185,H*0.34]].forEach(([ax,ay,bx,by])=>{
        ctx.beginPath(); ctx.moveTo(ax,ay); ctx.lineTo((ax+bx)/2,ay+8); ctx.lineTo(bx,by); ctx.stroke();
      });
      // Obsidian void ground
      const ground = ctx.createLinearGradient(0, H*0.55, 0, H);
      ground.addColorStop(0, '#1a0030'); ground.addColorStop(0.3, '#0f0020'); ground.addColorStop(1, '#050010');
      ctx.fillStyle = ground; ctx.fillRect(0, H*0.55, W, H*0.45);
      // Arcane runes glowing on ground
      const runeAlpha = 0.12 + 0.08*Math.sin(anim*0.08);
      ctx.strokeStyle = `rgba(160,60,255,${runeAlpha})`; ctx.lineWidth = 1.5;
      [[60,H*0.75],[160,H*0.80],[290,H*0.73],[380,H*0.78],[440,H*0.72]].forEach(([rx,ry],i)=>{
        const r = 10 + (i%2)*5;
        ctx.beginPath(); ctx.arc(rx, ry, r, 0, Math.PI*2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(rx-r*0.7,ry); ctx.lineTo(rx+r*0.7,ry); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(rx,ry-r*0.7); ctx.lineTo(rx,ry+r*0.7); ctx.stroke();
      });
      // Purple energy seam crack on ground
      const crackAlpha = 0.3 + 0.2*Math.sin(anim*0.10);
      ctx.strokeStyle=`rgba(200,100,255,${crackAlpha})`; ctx.lineWidth=2;
      ctx.beginPath(); ctx.moveTo(W*0.2,H*0.58); ctx.lineTo(W*0.28,H*0.65); ctx.lineTo(W*0.22,H*0.72); ctx.lineTo(W*0.30,H*0.82); ctx.stroke();
      ctx.strokeStyle=`rgba(200,100,255,${crackAlpha*0.5})`; ctx.lineWidth=6;
      ctx.beginPath(); ctx.moveTo(W*0.2,H*0.58); ctx.lineTo(W*0.28,H*0.65); ctx.lineTo(W*0.22,H*0.72); ctx.lineTo(W*0.30,H*0.82); ctx.stroke();
      // Enemy platform: obsidian crystal slab
      const epX=W*0.50, epY=H*0.22;
      ctx.fillStyle='rgba(0,0,0,0.5)'; ctx.beginPath(); ctx.ellipse(epX+50,epY+48,52,16,0,0,Math.PI*2); ctx.fill();
      const epg=ctx.createLinearGradient(epX,epY+30,epX,epY+56);
      epg.addColorStop(0,'#2d0060'); epg.addColorStop(0.5,'#1a0040'); epg.addColorStop(1,'#0d0020');
      ctx.fillStyle=epg; ctx.beginPath(); ctx.ellipse(epX+50,epY+44,52,14,0,0,Math.PI*2); ctx.fill();
      const epGlow = 0.35+0.2*Math.sin(anim*0.10);
      ctx.fillStyle=`rgba(160,60,255,${epGlow})`; ctx.beginPath(); ctx.ellipse(epX+50,epY+38,52,8,0,0,Math.PI*2); ctx.fill();
      // Player platform
      const ppX=W*0.04, ppY=H*0.52;
      ctx.fillStyle='rgba(0,0,0,0.5)'; ctx.beginPath(); ctx.ellipse(ppX+52,ppY+34,56,16,0,0,Math.PI*2); ctx.fill();
      const ppg=ctx.createLinearGradient(ppX,ppY+22,ppX,ppY+50);
      ppg.addColorStop(0,'#250050'); ppg.addColorStop(0.5,'#150030'); ppg.addColorStop(1,'#08001a');
      ctx.fillStyle=ppg; ctx.beginPath(); ctx.ellipse(ppX+52,ppY+30,56,14,0,0,Math.PI*2); ctx.fill();
      const ppGlow = 0.3+0.2*Math.sin(anim*0.10);
      ctx.fillStyle=`rgba(140,50,230,${ppGlow})`; ctx.beginPath(); ctx.ellipse(ppX+52,ppY+24,56,8,0,0,Math.PI*2); ctx.fill();

    } else {
      // DEFAULT / AMBER / generic: warm sunny meadow (original)
      const sky = ctx.createLinearGradient(0, 0, 0, H * 0.65);
      sky.addColorStop(0, '#5baee8'); sky.addColorStop(0.4, '#8ecff5'); sky.addColorStop(1, '#c4e8f8');
      ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H * 0.65);
      ctx.fillStyle = '#b8ccd0';
      ctx.beginPath(); ctx.moveTo(0, H * 0.55); ctx.lineTo(60, H * 0.28); ctx.lineTo(110, H * 0.45);
      ctx.lineTo(170, H * 0.22); ctx.lineTo(230, H * 0.40); ctx.lineTo(300, H * 0.18);
      ctx.lineTo(360, H * 0.35); ctx.lineTo(420, H * 0.20); ctx.lineTo(W, H * 0.38);
      ctx.lineTo(W, H * 0.65); ctx.lineTo(0, H * 0.65); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#8aad7a';
      ctx.beginPath(); ctx.moveTo(0, H * 0.62);
      ctx.bezierCurveTo(80, H * 0.44, 160, H * 0.56, 240, H * 0.48);
      ctx.bezierCurveTo(320, H * 0.40, 400, H * 0.52, W, H * 0.50);
      ctx.lineTo(W, H * 0.65); ctx.lineTo(0, H * 0.65); ctx.fill();
      const cloudOff = (anim * 0.3) % W;
      _drawCloud(ctx, (cloudOff + 60) % W, H * 0.07, 40, 12);
      _drawCloud(ctx, (cloudOff + 200) % W, H * 0.04, 55, 16);
      _drawCloud(ctx, (cloudOff + 350) % W, H * 0.09, 35, 10);
      const ground = ctx.createLinearGradient(0, H * 0.62, 0, H);
      ground.addColorStop(0, '#5a9444'); ground.addColorStop(0.3, '#4a7f38'); ground.addColorStop(1, '#2a5020');
      ctx.fillStyle = ground; ctx.fillRect(0, H * 0.62, W, H * 0.38);
      ctx.strokeStyle = 'rgba(0,0,0,0.12)'; ctx.lineWidth = 1;
      for (let i = 0; i < 6; i++) {
        const gy = H * 0.65 + i * (H * 0.35 / 6);
        ctx.beginPath(); ctx.moveTo(0, gy); ctx.bezierCurveTo(W/3, gy+2, 2*W/3, gy-1, W, gy+1); ctx.stroke();
      }
      const epX = W * 0.50, epY = H * 0.22;
      ctx.fillStyle = 'rgba(0,0,0,0.2)'; ctx.beginPath(); ctx.ellipse(epX+50,epY+48,52,16,0,0,Math.PI*2); ctx.fill();
      const platGrad = ctx.createLinearGradient(epX,epY+30,epX,epY+56);
      platGrad.addColorStop(0,'#8B6914'); platGrad.addColorStop(1,'#5D4010');
      ctx.fillStyle=platGrad; ctx.beginPath(); ctx.ellipse(epX+50,epY+44,52,14,0,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#5a9444'; ctx.beginPath(); ctx.ellipse(epX+50,epY+38,52,8,0,0,Math.PI*2); ctx.fill();
      const ppX = W * 0.04, ppY = H * 0.52;
      ctx.fillStyle='rgba(0,0,0,0.2)'; ctx.beginPath(); ctx.ellipse(ppX+52,ppY+34,56,16,0,0,Math.PI*2); ctx.fill();
      const pplatGrad=ctx.createLinearGradient(ppX,ppY+22,ppX,ppY+50);
      pplatGrad.addColorStop(0,'#6D4C1A'); pplatGrad.addColorStop(1,'#3D2A08');
      ctx.fillStyle=pplatGrad; ctx.beginPath(); ctx.ellipse(ppX+52,ppY+30,56,14,0,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#5a9444'; ctx.beginPath(); ctx.ellipse(ppX+52,ppY+24,56,8,0,0,Math.PI*2); ctx.fill();
    }

    // ── Celestial body overlay (sun / moon / stars) ───────────
    {
      const nightFactor = DG.getNightFactor ? DG.getNightFactor() : 0;
      const skyY = H * 0.44; // vertical centre of the sky zone

      if (nightFactor < 0.55) {
        // ── Sun ── (fully visible in day, fades toward dusk)
        const sunAlpha = Math.max(0, 1 - nightFactor * 1.8);
        const sunX = W * 0.82, sunY = H * 0.10;
        ctx.save(); ctx.globalAlpha = sunAlpha;
        // Outer corona glow
        const sunG = ctx.createRadialGradient(sunX, sunY, 4, sunX, sunY, 26);
        sunG.addColorStop(0, 'rgba(255,240,120,0.55)');
        sunG.addColorStop(1, 'rgba(255,200,60,0)');
        ctx.fillStyle = sunG; ctx.fillRect(sunX-28,sunY-28,56,56);
        // Sun disc
        ctx.fillStyle = '#FFE050';
        ctx.beginPath(); ctx.arc(sunX, sunY, 11, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#FFF4A0';
        ctx.beginPath(); ctx.arc(sunX-2, sunY-3, 5, 0, Math.PI*2); ctx.fill();
        ctx.restore();
      }

      if (nightFactor > 0.35) {
        // ── Stars ── (twinkle using seeded positions + time)
        const starAlpha = Math.min(1, (nightFactor - 0.35) / 0.35);
        ctx.save(); ctx.globalAlpha = starAlpha;
        const tSeed = Math.floor(Date.now() / 800); // twinkle every ~0.8s
        for (let si = 0; si < 28; si++) {
          const sx = ((si * 137 + 53) % 100) / 100 * W;
          const sy = ((si * 89 + 17)  % 100) / 100 * skyY;
          const twinkle = 0.55 + 0.45 * Math.sin((tSeed + si) * 1.37);
          const sr      = 0.8 + (si % 3) * 0.5;
          ctx.globalAlpha = starAlpha * twinkle;
          ctx.fillStyle = si % 5 === 0 ? '#FFFACC' : '#FFFFFF';
          ctx.beginPath(); ctx.arc(sx, sy, sr, 0, Math.PI*2); ctx.fill();
        }
        ctx.restore();
      }

      if (nightFactor > 0.55) {
        // ── Moon ── (crescent, visible at night)
        const moonAlpha = Math.min(1, (nightFactor - 0.55) / 0.3);
        const moonX = W * 0.78, moonY = H * 0.12;
        ctx.save(); ctx.globalAlpha = moonAlpha;
        // Moon glow halo
        const moonG = ctx.createRadialGradient(moonX,moonY,3,moonX,moonY,22);
        moonG.addColorStop(0,'rgba(200,220,255,0.35)');
        moonG.addColorStop(1,'rgba(150,180,255,0)');
        ctx.fillStyle=moonG; ctx.fillRect(moonX-24,moonY-24,48,48);
        // Full moon disc
        ctx.fillStyle='#D8E8FF';
        ctx.beginPath(); ctx.arc(moonX, moonY, 10, 0, Math.PI*2); ctx.fill();
        // Crescent shadow (slightly offset circle cuts into it)
        ctx.globalCompositeOperation='destination-out';
        ctx.fillStyle='rgba(255,255,255,1)';
        ctx.beginPath(); ctx.arc(moonX+4, moonY-2, 8, 0, Math.PI*2); ctx.fill();
        ctx.globalCompositeOperation='source-over';
        // Moon crater details
        ctx.globalAlpha = moonAlpha * 0.35;
        ctx.fillStyle='#B0C8E8';
        ctx.beginPath(); ctx.arc(moonX-3, moonY+2, 2, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(moonX-5, moonY-3, 1.2, 0, Math.PI*2); ctx.fill();
        ctx.restore();
      }
    }

    // ── FASE 11: levende laag (wolken + biome-deeltjes) ín de pixel-laag,
    // dan posterize → blokkig opschalen → dag/nacht-tint, en terug naar
    // het echte canvas voor de dino's en alles daarna.
    if (_bgRedraw) {
      try { _drawBattleAtmosphere(ctx, theme, anim, W, H); } catch(e) {}
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      _bgFinish(ctx);
    }
    _realCtx.save();
    _realCtx.imageSmoothingEnabled = false;
    _realCtx.drawImage(_BG.canvas, 0, 0, _BG.W, _BG.H, 0, 0, W, H);
    const _nf11 = (typeof DG.getNightFactor === 'function') ? (DG.getNightFactor() || 0) : 0;
    if (_nf11 > 0.03) {
      _realCtx.globalCompositeOperation = 'multiply';
      const _warm11 = Math.sin(Math.min(1, _nf11 / 0.6) * Math.PI) * 0.16;
      if (_warm11 > 0.01) {
        _realCtx.fillStyle = 'rgba(255,172,112,' + _warm11.toFixed(3) + ')';
        _realCtx.fillRect(0, 0, W, H);
      }
      _realCtx.fillStyle = 'rgba(124,142,208,' + (_nf11 * 0.42).toFixed(3) + ')';
      _realCtx.fillRect(0, 0, W, H);
    }
    _realCtx.restore();
    ctx = _realCtx;

    // Draw enemy DinoMon (with animation offset + catch/switch-in scale + intro scale)
    const catchScale  = (typeof DG.BattleAnim !== 'undefined' && DG.BattleAnim.isCatching)
      ? DG.BattleAnim.getCatchMonScale() : 1;
    const eSwitchScale = (typeof DG.BattleAnim !== 'undefined' && DG.BattleAnim.getEnemySwitchMonScale)
      ? DG.BattleAnim.getEnemySwitchMonScale() : 1;
    const introState = (typeof DG.BattleAnim !== 'undefined' && DG.BattleAnim.getBattleIntroState)
      ? DG.BattleAnim.getBattleIntroState() : { active: false };
    const introScale  = introState.active ? introState.monScale : 1;
    const introAlpha  = introState.active ? Math.max(0.05, introState.monScale) : 1;
    const enemyScale = Math.min(catchScale, eSwitchScale, introScale);
    const epX2 = W * 0.50, epY2 = H * 0.22;
    const ppX2 = W * 0.04, ppY2 = H * 0.52;
    if (enemyMon && enemyScale > 0.01) {
      const eFaintState = (typeof DG.BattleAnim !== 'undefined' && DG.BattleAnim.getFaintState)
        ? DG.BattleAnim.getFaintState() : null;
      const eFaint = eFaintState && eFaintState.side === 'enemy' ? eFaintState : null;
      // FASE 1: drop-shadow onder de vijandelijke dino (krimpt bij sprong-offset)
      {
        // FASE 12: vijand-anker +49px → sprite-centrum valt op het platformcentrum
        const shX = epX2 + 84 + enemyOffset.x - 18 * 1.9;
        const shY = epY2 - 31 + 36 * 1.9 * enemyScale + 2;
        const jump = Math.max(0, -enemyOffset.y);
        const sq   = Math.max(0.45, 1 - jump / 50);
        ctx.save();
        ctx.globalAlpha = 0.28 * (eFaint ? Math.max(0, eFaint.alpha) : 1) * sq;
        ctx.fillStyle = '#001020';
        ctx.beginPath();
        ctx.ellipse(shX, shY, 26 * enemyScale * sq, 6 * enemyScale * sq, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      ctx.save();
      if (eFaint) { ctx.globalAlpha = Math.max(0, eFaint.alpha); ctx.translate(0, eFaint.offsetY); }
      if (introState.active && introState.frame >= 30) ctx.globalAlpha = (ctx.globalAlpha || 1) * introAlpha;
      if (enemyMon.isShiny) ctx.filter = 'hue-rotate(180deg) saturate(2)';
      // FASE 4: wilde dino verschijnt als zwart silhouet tot de reveal-flits
      if (introState.active && introState.silhouette) ctx.filter = 'brightness(0)';
      // FASE 6: hit-reactie — wit-flits + terugdeins op het inslagmoment
      const eHR = (typeof DG.BattleAnim !== 'undefined' && DG.BattleAnim.getHitReact)
        ? DG.BattleAnim.getHitReact() : null;
      const eRecoil = (eHR && eHR.side === 'enemy') ? eHR.recoil : 0;
      if (eHR && eHR.side === 'enemy' && eHR.flash) ctx.filter = 'brightness(2.8) saturate(0.2)';
      // FASE 9: charge-visual — Fly/Dig = dino uit beeld, Phantom Force = schim
      const eCharge = (typeof DG.BattleAnim !== 'undefined' && DG.BattleAnim.getChargeVisual)
        ? DG.BattleAnim.getChargeVisual('enemy') : null;
      if (eCharge === 'DIG') {
        _drawDigMound(ctx, epX2 + 84 + enemyOffset.x - 16 * 1.9, epY2 - 31 + 36 * 1.9);
      } else if (eCharge !== 'FLY') {
        if (eCharge === 'PHANTOM_FORCE') ctx.globalAlpha = (ctx.globalAlpha || 1) * 0.15;
        ctx.save();
        ctx.translate(epX2 + 84 + enemyOffset.x + eRecoil, epY2 - 31 + enemyOffset.y); // FASE 12: op het platform
        ctx.scale(-1.9 * enemyScale, 1.9 * enemyScale);
        drawMon(ctx, enemyMon.speciesId, 0, 0, 1);
        ctx.restore();
      }
      if (enemyMon.isShiny) ctx.filter = 'none';
      ctx.restore();
      // Status aura for enemy (drawn in screen space, outside save/restore)
      if (enemyMon.statusEffect) {
        const eCX = epX2 + 84 + enemyOffset.x - 18 * 1.9; // FASE 12
        const eCY = epY2 - 31 + enemyOffset.y + 18 * 1.9;
        _drawStatusAura(ctx, enemyMon.statusEffect, eCX, eCY, 34);
      }
    }
    const switchScale = (typeof DG.BattleAnim !== 'undefined' && DG.BattleAnim.getSwitchMonScale) ? DG.BattleAnim.getSwitchMonScale() : 1;
    if (playerMon && switchScale > 0.01) {
      const pFaintState = (typeof DG.BattleAnim !== 'undefined' && DG.BattleAnim.getFaintState)
        ? DG.BattleAnim.getFaintState() : null;
      const pFaint = pFaintState && pFaintState.side === 'player' ? pFaintState : null;
      // FASE 1: drop-shadow onder de eigen dino (krimpt bij sprong-offset)
      {
        const shX = ppX2 + 16 + playerOffset.x + 18 * 2.1;
        const shY = ppY2 - 52 + 36 * 2.1 * switchScale + 2;
        const jump = Math.max(0, -playerOffset.y);
        const sq   = Math.max(0.45, 1 - jump / 50);
        ctx.save();
        ctx.globalAlpha = 0.28 * (pFaint ? Math.max(0, pFaint.alpha) : 1) * sq;
        ctx.fillStyle = '#001020';
        ctx.beginPath();
        ctx.ellipse(shX, shY, 30 * switchScale * sq, 7 * switchScale * sq, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      ctx.save();
      if (pFaint) { ctx.globalAlpha = Math.max(0, pFaint.alpha); ctx.translate(0, pFaint.offsetY); }
      if (playerMon.isShiny) ctx.filter = 'hue-rotate(180deg) saturate(2)';
      // FASE 6: hit-reactie — wit-flits + terugdeins op het inslagmoment
      const pHR = (typeof DG.BattleAnim !== 'undefined' && DG.BattleAnim.getHitReact)
        ? DG.BattleAnim.getHitReact() : null;
      const pRecoil = (pHR && pHR.side === 'player') ? pHR.recoil : 0;
      if (pHR && pHR.side === 'player' && pHR.flash) ctx.filter = 'brightness(2.8) saturate(0.2)';
      // FASE 9: charge-visual — Fly/Dig = dino uit beeld, Phantom Force = schim
      const pCharge = (typeof DG.BattleAnim !== 'undefined' && DG.BattleAnim.getChargeVisual)
        ? DG.BattleAnim.getChargeVisual('player') : null;
      if (pCharge === 'DIG') {
        _drawDigMound(ctx, ppX2 + 16 + playerOffset.x + 16 * 2.1, ppY2 - 52 + 36 * 2.1);
      } else if (pCharge !== 'FLY') {
        if (pCharge === 'PHANTOM_FORCE') ctx.globalAlpha = (ctx.globalAlpha || 1) * 0.15;
        if (switchScale < 0.99) {
          ctx.save(); ctx.translate(ppX2+16+playerOffset.x-pRecoil, ppY2-52+playerOffset.y);
          ctx.scale(switchScale, switchScale); drawMon(ctx, playerMon.speciesId, 0, 0, 2.1); ctx.restore();
        } else {
          drawMon(ctx, playerMon.speciesId, ppX2+16+playerOffset.x-pRecoil, ppY2-52+playerOffset.y, 2.1);
        }
      }
      if (playerMon.isShiny) ctx.filter = 'none';
      ctx.restore();
      // Status aura for player (drawn in screen space)
      if (playerMon.statusEffect) {
        const pCX = ppX2 + 16 + playerOffset.x + 18 * 2.1;
        const pCY = ppY2 - 52 + playerOffset.y + 18 * 2.1;
        _drawStatusAura(ctx, playerMon.statusEffect, pCX, pCY, 38);
      }
    }
  }

  // ── FASE 9: zandhoop voor Dig — de dino zit ondergronds ───────
  function _drawDigMound(ctx, cx, gy) {
    ctx.save();
    ctx.fillStyle = '#5d4126';
    ctx.beginPath(); ctx.ellipse(cx, gy - 2, 17, 7, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#7d5a35';
    ctx.beginPath(); ctx.ellipse(cx, gy - 4, 12, 5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#9a7548';
    ctx.beginPath(); ctx.ellipse(cx - 2, gy - 6, 6, 3, 0, 0, Math.PI * 2); ctx.fill();
    // opstijgende stofjes
    const t = Date.now() / 90;
    for (let i = 0; i < 3; i++) {
      const ph = (t * 0.4 + i * 0.66) % 1.4;
      if (ph > 1) continue;
      ctx.globalAlpha = Math.max(0, 0.5 - ph * 0.45);
      ctx.fillStyle = '#cdb89a';
      ctx.beginPath();
      ctx.arc(cx - 11 + i * 11, gy - 9 - ph * 10, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // ── Status effect aura ────────────────────────────────────────
  // Draws animated visual aura around a DinoMon in battle.
  // cx/cy = screen-space centre of the mon; r = approximate sprite radius in px.
  function _drawStatusAura(ctx, status, cx, cy, r) {
    if (!status) return;
    const t = Date.now() / 1000;
    ctx.save();

    switch (status) {
      case 'BURN': {
        // Orange/red animated flames around lower body
        for (let i = 0; i < 8; i++) {
          const ang  = (i / 8) * Math.PI * 2 + t * 2.5;
          const dist = r * 0.65 + Math.sin(t * 4 + i * 1.3) * r * 0.18;
          const fx   = cx + Math.cos(ang) * dist;
          const fy   = cy + r * 0.38 + Math.sin(ang) * dist * 0.35;
          const fh   = 7 + Math.sin(t * 5 + i) * 3;
          const g    = ctx.createRadialGradient(fx, fy, 0, fx, fy - fh, fh + 2);
          g.addColorStop(0, 'rgba(255,90,10,0.75)');
          g.addColorStop(0.5,'rgba(255,170,0,0.4)');
          g.addColorStop(1, 'rgba(255,80,0,0)');
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.ellipse(fx, fy - fh / 2, 4, fh, 0, 0, Math.PI * 2);
          ctx.fill();
        }
        const burnGlow = ctx.createRadialGradient(cx, cy, r * 0.3, cx, cy, r * 1.3);
        burnGlow.addColorStop(0, 'rgba(255,60,0,0)');
        burnGlow.addColorStop(0.7,'rgba(255,60,0,0.12)');
        burnGlow.addColorStop(1, 'rgba(255,60,0,0)');
        ctx.fillStyle = burnGlow;
        ctx.fillRect(cx - r * 1.5, cy - r * 1.5, r * 3, r * 3);
        break;
      }

      case 'POISON':
      case 'BADPOISON': {
        const nbub = status === 'BADPOISON' ? 10 : 6;
        const col  = status === 'BADPOISON' ? [160, 0, 210] : [180, 60, 230];
        for (let i = 0; i < nbub; i++) {
          const phase = ((t * 0.75 + i / nbub) % 1 + 1) % 1;
          const bx    = cx + ((i % 2 === 0 ? -1 : 1) * (r * 0.3 + (i % 3) * r * 0.13)) * Math.sin(phase * Math.PI * 3 + i);
          const by    = cy + r * 0.5 - phase * r * 2.2;
          const bAlp  = phase < 0.75 ? (1 - phase / 0.75) * 0.85 : 0;
          const bRad  = 2.5 + (i % 3);
          ctx.strokeStyle = `rgba(${col[0]},${col[1]},${col[2]},${bAlp * 0.85})`;
          ctx.fillStyle   = `rgba(${col[0]},${col[1]},${col[2]},${bAlp * 0.25})`;
          ctx.lineWidth   = 1;
          ctx.beginPath(); ctx.arc(bx, by, bRad, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        }
        const poisonGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 1.15);
        poisonGlow.addColorStop(0, `rgba(${col[0]},${col[1]},${col[2]},0.18)`);
        poisonGlow.addColorStop(1, `rgba(${col[0]},${col[1]},${col[2]},0)`);
        ctx.fillStyle = poisonGlow;
        ctx.beginPath(); ctx.ellipse(cx, cy, r * 1.15, r * 1.15, 0, 0, Math.PI * 2); ctx.fill();
        break;
      }

      case 'PARALYSIS': {
        const paraAlp = 0.08 + 0.06 * Math.sin(t * 10);
        const paraGlow = ctx.createRadialGradient(cx, cy, r * 0.2, cx, cy, r * 1.25);
        paraGlow.addColorStop(0, `rgba(255,230,0,${paraAlp * 2})`);
        paraGlow.addColorStop(1, 'rgba(255,230,0,0)');
        ctx.fillStyle = paraGlow;
        ctx.beginPath(); ctx.ellipse(cx, cy, r * 1.25, r * 1.25, 0, 0, Math.PI * 2); ctx.fill();
        // Sparks
        for (let i = 0; i < 6; i++) {
          const ang  = (i / 6) * Math.PI * 2 + t * 7;
          const dist = r * 0.82 + Math.sin(t * 12 + i * 2) * r * 0.28;
          const sx   = cx + Math.cos(ang) * dist;
          const sy   = cy + Math.sin(ang) * dist * 0.55;
          const sAlp = 0.5 + 0.5 * Math.sin(t * 15 + i * 1.7);
          ctx.strokeStyle = `rgba(255,235,0,${sAlp})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(sx - 3, sy - 3); ctx.lineTo(sx + 1, sy);
          ctx.lineTo(sx - 2, sy + 2); ctx.lineTo(sx + 3, sy + 4);
          ctx.stroke();
        }
        break;
      }

      case 'SLEEP': {
        // Dim blue glow
        const sleepGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 1.1);
        sleepGlow.addColorStop(0, 'rgba(80,120,230,0.22)');
        sleepGlow.addColorStop(1, 'rgba(80,120,230,0)');
        ctx.fillStyle = sleepGlow;
        ctx.beginPath(); ctx.ellipse(cx, cy, r * 1.1, r * 1.1, 0, 0, Math.PI * 2); ctx.fill();
        // ZZZ bubbles
        ctx.textBaseline = 'middle'; ctx.textAlign = 'center';
        for (let i = 0; i < 3; i++) {
          const phase = ((t * 0.45 + i * 0.33) % 1 + 1) % 1;
          const sz    = (i + 1) * 3 + 5;
          const zx    = cx + r * 0.5 + phase * r * 0.45 + i * 5;
          const zy    = (cy - r * 0.5) - phase * r * 1.4;
          const zAlp  = phase < 0.72 ? (1 - phase / 0.72) * 0.9 : 0;
          ctx.globalAlpha = zAlp;
          ctx.fillStyle = '#99bbff';
          ctx.font = `bold ${sz + 5}px monospace`;
          ctx.fillText('Z', zx, zy);
        }
        ctx.globalAlpha = 1;
        break;
      }

      case 'FREEZE': {
        // Icy blue body tint
        const freezeGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 1.1);
        freezeGlow.addColorStop(0, 'rgba(140,210,255,0.32)');
        freezeGlow.addColorStop(0.6,'rgba(100,180,255,0.18)');
        freezeGlow.addColorStop(1, 'rgba(80,160,255,0)');
        ctx.fillStyle = freezeGlow;
        ctx.beginPath(); ctx.ellipse(cx, cy, r * 1.1, r * 1.1, 0, 0, Math.PI * 2); ctx.fill();
        // Crystal shards (static — freeze doesn't animate)
        ctx.strokeStyle = 'rgba(160,225,255,0.8)';
        ctx.fillStyle   = 'rgba(160,225,255,0.22)';
        ctx.lineWidth   = 1;
        for (let i = 0; i < 7; i++) {
          const ang  = (i / 7) * Math.PI * 2;
          const dist = r * 0.78;
          const ix   = cx + Math.cos(ang) * dist;
          const iy   = cy + Math.sin(ang) * dist * 0.65;
          const sh   = 7 + (i % 3) * 3;
          const sw   = 2.5 + (i % 2);
          ctx.save();
          ctx.translate(ix, iy); ctx.rotate(ang + Math.PI * 0.5);
          ctx.beginPath();
          ctx.moveTo(0, -sh); ctx.lineTo(sw, 0); ctx.lineTo(0, sh * 0.28); ctx.lineTo(-sw, 0);
          ctx.closePath(); ctx.fill(); ctx.stroke();
          ctx.restore();
        }
        break;
      }

      case 'CONFUSION': {
        // Spiraling stars above the head
        const orbitR = r * 0.62;
        const headY  = cy - r * 0.75;
        ctx.textBaseline = 'middle'; ctx.textAlign = 'center';
        for (let i = 0; i < 5; i++) {
          const ang  = (i / 5) * Math.PI * 2 + t * 3.2;
          const sx   = cx + Math.cos(ang) * orbitR;
          const sy   = headY + Math.sin(ang) * orbitR * 0.38;
          const sAlp = 0.55 + 0.45 * Math.sin(t * 5 + i);
          ctx.globalAlpha = sAlp;
          ctx.fillStyle = '#FFD740';
          ctx.font = '10px monospace';
          ctx.fillText('\u2605', sx, sy);
        }
        ctx.globalAlpha = 1;
        break;
      }
    }

    ctx.textAlign = 'left'; // restore default
    ctx.restore();
  }

  function _drawCloud(ctx, cx, cy, rx, ry) {
    ctx.fillStyle = 'rgba(255,255,255,0.82)';
    ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(cx - rx*0.4, cy + ry*0.2, rx*0.6, ry*0.8, 0, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(cx + rx*0.4, cy + ry*0.2, rx*0.65, ry*0.85, 0, 0, Math.PI*2); ctx.fill();
  }

  // ── Battle HUD ────────────────────────────────────────────────
  function drawBattleHUD(ctx, battle) {
    if (!battle) return;
    const W = DG.CANVAS.W, H = DG.CANVAS.H;
    const { playerMon, enemyMon } = battle;

    // Smooth HP display values (lerped by battle.js)
    const playerHPShown = (DG.Battle.getPlayerHPDisplay ? DG.Battle.getPlayerHPDisplay() : playerMon.hp.current) || playerMon.hp.current;
    const enemyHPShown  = (DG.Battle.getEnemyHPDisplay  ? DG.Battle.getEnemyHPDisplay()  : enemyMon.hp.current)  || enemyMon.hp.current;

    _drawMonHUD(ctx, enemyMon, 6, 6, false, enemyHPShown);
    _drawMonHUD(ctx, playerMon, W - 202, H * 0.56, true, playerHPShown);

    if (battle && DG.Battle.getState() === DG.Battle.BS.PLAYER_INPUT) {
      _drawMoveMenu(ctx, playerMon, battle);
    }
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

  // FASE 1: white-trail state per HUD-zijde — { ref: mon, val: pct }
  const _hpTrail = { P: { ref: null, val: 1 }, E: { ref: null, val: 1 } };

  function _drawMonHUD(ctx, mon, x, y, showExp, hpShown) {
    if (!mon) return;
    const sp   = DG.SPECIES[mon.speciesId];
    const name = mon.nickname || (sp ? sp.name : mon.speciesId);
    const h    = showExp ? 68 : 56;
    const barW = 122;
    // Use the smoothly-interpolated HP value when provided, fall back to real HP
    const hpDisplay = (hpShown != null) ? hpShown : mon.hp.current;

    // Panel background with gradient
    const bg = ctx.createLinearGradient(x, y, x, y + h);
    bg.addColorStop(0, 'rgba(10,14,42,0.93)');
    bg.addColorStop(1, 'rgba(5,8,28,0.93)');
    ctx.fillStyle = bg;
    _roundRect(ctx, x, y, 196, h, 6);
    ctx.fill();

    // Panel border (two-tone)
    ctx.strokeStyle = '#5a9fd4';
    ctx.lineWidth = 1.5;
    _roundRect(ctx, x, y, 196, h, 6);
    ctx.stroke();

    // Inner highlight at top
    ctx.strokeStyle = 'rgba(150,210,255,0.25)';
    ctx.lineWidth = 1;
    _roundRect(ctx, x + 1, y + 1, 194, h - 2, 5);
    ctx.stroke();

    // Low-HP warning: red pulsing border when HP < 20%
    const _hpPctEarly = Math.max(0, Math.min(1, hpDisplay / mon.hp.max));
    if (_hpPctEarly < 0.2 && _hpPctEarly > 0) {
      const _warnPulse = 0.5 + 0.5 * Math.sin(Date.now() / 180);
      ctx.strokeStyle = `rgba(255,50,50,${_warnPulse})`;
      ctx.lineWidth = 2.5;
      _roundRect(ctx, x, y, 196, h, 6);
      ctx.stroke();
    }

    // Type badge (first type of species)
    if (sp && sp.types && sp.types[0]) {
      const tc = _TYPE_ACCENT[sp.types[0]] || '#888';
      ctx.fillStyle = tc + 'cc';
      _roundRect(ctx, x + 4, y + 4, 30, 10, 3);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = '7px monospace';
      ctx.textBaseline = 'top';
      ctx.textAlign = 'center';
      ctx.fillText(sp.types[0].slice(0,4), x + 19, y + 5);
      ctx.textAlign = 'left';
    }

    // Name (with shiny indicator)
    ctx.font = 'bold 12px monospace';
    ctx.textBaseline = 'top';
    if (mon.isShiny) {
      ctx.fillStyle = '#ffd700';
      ctx.fillText('\u2726', x + 38, y + 6);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(name, x + 52, y + 6);
    } else {
      ctx.fillStyle = '#ffffff';
      ctx.fillText(name, x + 38, y + 6);
    }

    // Level
    ctx.fillStyle = '#aaccff';
    ctx.font = '11px monospace';
    ctx.fillText(`Lv.${mon.level}`, x + 148, y + 6);

    // HP bar label
    ctx.fillStyle = '#7ab8e8';
    ctx.font = '10px monospace';
    ctx.fillText('HP', x + 8, y + 22);

    // HP bar background
    ctx.fillStyle = '#1a2040';
    _roundRect(ctx, x + 28, y + 21, barW, 10, 3);
    ctx.fill();

    // HP bar fill — use smooth interpolated value
    const hpPct = Math.max(0, Math.min(1, hpDisplay / mon.hp.max));
    const HP_BAR_X = x + 28, HP_BAR_Y = y + 21, HP_BAR_H = 10;
    const hpFillW = Math.max(2, Math.floor(barW * hpPct));
    const hpGrad = ctx.createLinearGradient(HP_BAR_X, HP_BAR_Y, HP_BAR_X + hpFillW, HP_BAR_Y);
    if (hpPct > 0.5) {
      hpGrad.addColorStop(0, '#44ff44');
      hpGrad.addColorStop(1, '#22aa22');
    } else if (hpPct > 0.2) {
      hpGrad.addColorStop(0, '#ffcc00');
      hpGrad.addColorStop(1, '#aa8800');
    } else {
      hpGrad.addColorStop(0, '#ff4444');
      hpGrad.addColorStop(1, '#cc1111');
    }
    ctx.fillStyle = hpGrad;
    _roundRect(ctx, HP_BAR_X, HP_BAR_Y, hpFillW, HP_BAR_H, 3);
    ctx.fill();

    // FASE 1: white-trail — lichte balk die vertraagd "naloopt" bij schade
    const trail = _hpTrail[showExp ? 'P' : 'E'];
    if (trail.ref !== mon || trail.val < hpPct) { trail.ref = mon; trail.val = hpPct; }
    trail.val = Math.max(hpPct, trail.val - Math.max(0.002, (trail.val - hpPct) * 0.09));
    if (trail.val > hpPct + 0.004) {
      const trailW = Math.max(1, Math.floor(barW * trail.val) - hpFillW);
      ctx.fillStyle = 'rgba(255,244,200,0.85)';
      ctx.fillRect(HP_BAR_X + hpFillW, HP_BAR_Y + 1, trailW, HP_BAR_H - 2);
    }

    // 1px white shine on top of the filled bar
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.fillRect(HP_BAR_X + 3, HP_BAR_Y + 1, Math.max(1, hpFillW - 6), 1);

    // Critical HP flicker overlay on the bar itself
    if (hpPct < 0.2 && hpPct > 0) {
      const _barFlicker = 0.25 + 0.25 * Math.sin(Date.now() / 120);
      ctx.fillStyle = `rgba(255,80,80,${_barFlicker})`;
      _roundRect(ctx, HP_BAR_X, HP_BAR_Y, hpFillW, HP_BAR_H, 3);
      ctx.fill();
    }

    // HP numbers (player only) — show smoothed value rounded to integer
    if (showExp) {
      ctx.fillStyle = '#ddeeff';
      ctx.font = '11px monospace';
      ctx.fillText(`${Math.round(hpDisplay)} / ${mon.hp.max}`, x + 8, y + 36);
    }

    // EXP progress bar — thin bar below HP bar (player only)
    if (showExp) {
      const sp2 = DG.SPECIES[mon.speciesId];
      const expCurve2 = sp2 ? sp2.expCurve : 'MEDIUM_FAST';
      const expFn = DG.EXP_CURVE && DG.EXP_CURVE[expCurve2];
      const expThis = expFn ? expFn(mon.level) : 0;
      const expNext = expFn ? expFn(mon.level + 1) : 1;
      // Use animated display value when available (during battle EXP gain)
      const expAnim = (typeof DG.Battle !== 'undefined' && DG.Battle.getPlayerExpDisplay)
        ? DG.Battle.getPlayerExpDisplay() : null;
      const expForBar = (expAnim !== null) ? expAnim : mon.exp;
      const expPct2 = expFn ? Math.min(1, Math.max(0, (expForBar - expThis) / Math.max(1, expNext - expThis))) : 0;
      const EXP_BAR_Y = HP_BAR_Y + HP_BAR_H + 3;
      // Background track
      ctx.fillStyle = '#1a2040';
      _roundRect(ctx, HP_BAR_X, EXP_BAR_Y, barW, 3, 1);
      ctx.fill();
      // Filled portion
      const expFillW = Math.max(1, Math.floor(barW * expPct2));
      const expBarGrad = ctx.createLinearGradient(HP_BAR_X, EXP_BAR_Y, HP_BAR_X + expFillW, EXP_BAR_Y);
      expBarGrad.addColorStop(0, '#4488ff');
      expBarGrad.addColorStop(1, '#2255cc');
      ctx.fillStyle = expBarGrad;
      _roundRect(ctx, HP_BAR_X, EXP_BAR_Y, expFillW, 3, 1);
      ctx.fill();
    }

    // Status badge
    if (mon.statusEffect) {
      ctx.fillStyle = (typeof DG.StatusEffects !== 'undefined')
        ? DG.StatusEffects.displayColor(mon.statusEffect)
        : '#888';
      _roundRect(ctx, x + 148, y + 20, 40, 12, 3);
      ctx.fill();
      ctx.fillStyle = '#111';
      ctx.font = '8px monospace';
      ctx.fillText(
        (typeof DG.StatusEffects !== 'undefined')
          ? DG.StatusEffects.displayName(mon.statusEffect)
          : mon.statusEffect,
        x + 150, y + 22
      );
    }

  }

  // ── Effect text + colour helpers (shared across battle HUD and learn screens) ──
  function _effectText(eff) {
    if (!eff || eff.type === 'NONE') return null;
    const sn = { atk:'Atk', def:'Def', spAtk:'Sp.Atk', spDef:'Sp.Def', spd:'Speed', acc:'Accuracy' };
    const st = { BURN:'burn', POISON:'poison', PARALYSIS:'paralysis', SLEEP:'sleep', FREEZE:'freeze' };
    switch (eff.type) {
      case 'STATUS_CHANCE': {
        const s = st[eff.status] || eff.status.toLowerCase();
        return eff.chance >= 100 ? `Inflicts ${s}` : `${eff.chance}% chance: ${s}`;
      }
      case 'FLINCH':   return eff.chance >= 100 ? 'Causes flinch' : `${eff.chance}% flinch`;
      case 'CONFUSE':  return eff.chance >= 100 ? 'Causes confusion' : `${eff.chance}% confusion`;
      case 'STAT_RAISE': {
        const t = (!eff.target || eff.target === 'self') ? 'user' : 'foe';
        const stat = sn[eff.stat] || eff.stat;
        const stg = `+${eff.stages}`;
        const pct = (eff.chance && eff.chance < 100) ? ` (${eff.chance}%)` : '';
        return `Raises ${t}'s ${stat} ${stg}${pct}`;
      }
      case 'STAT_LOWER': {
        const t = (eff.target === 'opponent') ? "foe's" : "user's";
        const stat = sn[eff.stat] || eff.stat;
        const stg = eff.stages < 0 ? String(eff.stages) : `-${eff.stages}`;
        const pct = (eff.chance && eff.chance < 100) ? ` (${eff.chance}%)` : '';
        return `Lowers ${t} ${stat} ${stg}${pct}`;
      }
      case 'RECOIL':     return `User takes ${Math.round(eff.fraction * 100)}% recoil`;
      case 'DRAIN':      return `Drains ${Math.round(eff.fraction * 100)}% of damage dealt`;
      case 'HEAL':       return `Heals user for ${Math.round(eff.fraction * 100)}% HP`;
      case 'LEECH_SEED': return 'Seeds foe — drains HP each turn';
      case 'RECHARGE':   return 'User must recharge next turn';
      case 'TWO_TURN':   return '2-turn move (charge then strike)';
      case 'ONE_HIT_KO': return 'One-hit KO!';
      case 'SET_WEATHER': {
        const w = { SUN:'Sets harsh sunlight', RAIN:'Sets heavy rain', HAIL:'Sets hail', SANDSTORM:'Sets sandstorm' };
        return w[eff.weather] || ('Weather: ' + eff.weather);
      }
      case 'MULTI': return eff.hits ? `Hits ${eff.hits[0]}-${eff.hits[1]} times` : null;
      default: return null;
    }
  }

  function _effectColor(eff) {
    if (!eff || eff.type === 'NONE') return '#888';
    switch (eff.type) {
      case 'STATUS_CHANCE': {
        const c = { BURN:'#ff8833', POISON:'#cc55ff', PARALYSIS:'#ffdd22', SLEEP:'#6688ff', FREEZE:'#44ddff' };
        return c[eff.status] || '#ffaa44';
      }
      case 'FLINCH':     return '#ddddcc';
      case 'CONFUSE':    return '#ff88cc';
      case 'STAT_RAISE': return '#44ff88';
      case 'STAT_LOWER': return '#ff8844';
      case 'RECOIL':     return '#ff5544';
      case 'DRAIN':      return '#44ff88';
      case 'HEAL':       return '#44ffcc';
      case 'LEECH_SEED': return '#88ff44';
      case 'RECHARGE':   return '#aaaacc';
      case 'TWO_TURN':   return '#aaaacc';
      case 'ONE_HIT_KO': return '#ff4444';
      case 'SET_WEATHER': return '#88ccff';
      case 'MULTI':      return '#ffcc44';
      default: return '#aaaacc';
    }
  }

  function _drawMoveMenu(ctx, mon, battle) {
    if (!mon) return;
    const W = DG.CANVAS.W, H = DG.CANVAS.H;
    const bx = 0, by = H - 90;
    const panelH = 90;

    // Background
    const bg = ctx.createLinearGradient(0, by, 0, by + panelH);
    bg.addColorStop(0, 'rgba(8,12,36,0.96)');
    bg.addColorStop(1, 'rgba(4,6,20,0.96)');
    ctx.fillStyle = bg;
    ctx.fillRect(bx, by, W, panelH);

    // Top border
    ctx.strokeStyle = '#5a9fd4';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0, by); ctx.lineTo(W, by); ctx.stroke();

    const moves = mon.moves;
    const cols  = 2;
    const rowH  = 34;

    moves.forEach((slot, i) => {
      const mv = DG.MOVES[slot.moveId];
      if (!mv) return;
      const col = i % cols, row = Math.floor(i / cols);
      const mx  = bx + col * (W / 2) + 8;
      const my  = by + row * rowH + 6;
      const isSel = (battle._moveCursor === i);

      // Selected highlight
      if (isSel) {
        ctx.fillStyle = 'rgba(30,60,120,0.9)';
        _roundRect(ctx, mx - 4, my - 2, W/2 - 10, rowH - 4, 4);
        ctx.fill();
        ctx.strokeStyle = '#8abcff';
        ctx.lineWidth = 1;
        _roundRect(ctx, mx - 4, my - 2, W/2 - 10, rowH - 4, 4);
        ctx.stroke();
      }

      // Move name
      ctx.fillStyle = isSel ? '#FFE050' : '#e8e8e8';
      ctx.font = `${isSel ? 'bold ' : ''}12px monospace`;
      ctx.textBaseline = 'top';
      ctx.fillText((isSel ? '▶ ' : '  ') + mv.name, mx, my);

      // Category icon — small 8px glyph after the move name
      {
        const cat = DG.MOVES[slot.moveId]?.category;
        let catIcon = '\u25cf', catIconColor = '#aaaaaa'; // ● default STATUS
        if (cat === 'PHYSICAL') { catIcon = '\u2694'; catIconColor = '#ff8833'; }     // ⚔
        else if (cat === 'SPECIAL') { catIcon = '\u2736'; catIconColor = '#44ccff'; } // ✶
        ctx.font = '8px monospace';
        ctx.fillStyle = catIconColor;
        ctx.textBaseline = 'top';
        const nameWidth = ctx.measureText((isSel ? '▶ ' : '  ') + mv.name).width;
        ctx.fillText(catIcon, mx + nameWidth + 3, my + 1);
      }

      // Type badge
      const typeCol = _TYPE_ACCENT[mv.type] || '#888';
      ctx.fillStyle = typeCol + 'dd';
      _roundRect(ctx, mx, my + 15, 46, 11, 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = '7px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(mv.type, mx + 23, my + 16);
      ctx.textAlign = 'left';

      // Category badge
      const catColor = mv.category === 'PHYSICAL' ? '#CC3300' : mv.category === 'SPECIAL' ? '#0055CC' : '#666655';
      ctx.fillStyle = catColor + 'dd';
      _roundRect(ctx, mx + 50, my + 15, 46, 11, 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = '7px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(mv.category ? mv.category.slice(0,4) : 'STAT', mx + 73, my + 16);
      ctx.textAlign = 'left';

      // PP — right-aligned in the cell, color-coded
      const ppRatio = slot.ppMax > 0 ? slot.ppCurrent / slot.ppMax : 1;
      let ppColor = '#e8e8e8';
      if (ppRatio <= 0.25) ppColor = '#ff5555';
      else if (ppRatio <= 0.5) ppColor = '#ffdd44';
      const ppText = `${slot.ppCurrent}/${slot.ppMax}`;
      ctx.font = '10px monospace';
      ctx.fillStyle = ppColor;
      ctx.textAlign = 'right';
      const cellRight = mx + (W / 2) - 14;
      ctx.fillText(ppText, cellRight, my);
      ctx.textAlign = 'left';

      // ── Per-slot effectiveness badge vs enemy ─────────────────
      if (battle.enemyMon && typeof DG.TypeChart !== 'undefined' &&
          DG.SPECIES && DG.SPECIES[battle.enemyMon.speciesId]) {
        const defTypes = DG.SPECIES[battle.enemyMon.speciesId].types || [];
        const mult = DG.TypeChart.getEffectiveness(mv.type, defTypes);
        let effText = null, effColor = '#fff', effBg = null;
        if      (mult === 0)   { effText = '✕';   effColor = '#ff4444'; effBg = 'rgba(255,44,44,0.22)'; }
        else if (mult >= 4)    { effText = '4×';  effColor = '#00ffaa'; effBg = 'rgba(0,255,160,0.20)'; }
        else if (mult >= 2)    { effText = '2×';  effColor = '#44ff88'; effBg = 'rgba(44,255,100,0.18)'; }
        else if (mult <= 0.25) { effText = '¼×';  effColor = '#ff8822'; effBg = 'rgba(255,100,20,0.20)'; }
        else if (mult < 1)     { effText = '½×';  effColor = '#ffaa44'; effBg = 'rgba(255,160,44,0.18)'; }
        // neutral (1×) → no badge shown
        if (effText) {
          const bw = 20, bh = 12;
          const bx2 = cellRight - bw, by2 = my + 14;
          ctx.fillStyle = effBg;
          _roundRect(ctx, bx2, by2, bw, bh, 3);
          ctx.fill();
          ctx.fillStyle = effColor;
          ctx.font = 'bold 8px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(effText, bx2 + bw / 2, by2 + 3);
          ctx.textAlign = 'left';
        }
      }
    });

    // Expanded move info + type matchup hint below move list
    const selSlot = moves[battle._moveCursor];
    const selMv = selSlot ? DG.MOVES[selSlot.moveId] : null;
    if (selMv) {
      // Build stat parts
      const pwrStr  = selMv.power  != null ? 'PWR:' + selMv.power  : 'PWR:\u2014';
      const accStr  = (selMv.accuracy == null || selMv.accuracy >= 999)
                        ? 'ACC:\u2014' : 'ACC:' + selMv.accuracy + '%';
      let hitsStr = null;
      if (selMv.effect && selMv.effect.type === 'MULTI' && selMv.effect.hits) {
        const [mn, mx] = selMv.effect.hits;
        hitsStr = 'HITS:' + mn + '-' + mx + 'x';
      } else if (selMv.hits) {
        hitsStr = selMv.hits === 1 ? null : 'HITS:' + selMv.hits + 'x';
      }

      // Build type effectiveness hint (for selected move, shown at bottom)
      let hintText = null, hintColor = '#aaaaaa';
      if (battle.enemyMon && DG.SPECIES && DG.SPECIES[battle.enemyMon.speciesId]) {
        const defTypes = DG.SPECIES[battle.enemyMon.speciesId].types || [];
        const mult = DG.TypeChart.getEffectiveness(selMv.type, defTypes);
        if      (mult === 0)    { hintText = '\u2715 No effect (0\u00d7)';         hintColor = '#ff5555'; }
        else if (mult >= 4)     { hintText = '\u2605 Super effective! (4\u00d7)';  hintColor = '#00ffaa'; }
        else if (mult >= 2)     { hintText = '\u2605 Super effective! (2\u00d7)';  hintColor = '#44ff88'; }
        else if (mult <= 0.25)  { hintText = '\u25bc Not very effective (\u00bc\u00d7)'; hintColor = '#ff8822'; }
        else if (mult < 1)      { hintText = '\u25bc Not very effective (\u00bd\u00d7)'; hintColor = '#ffaa44'; }
        else                    { hintText = '\u25a0 Normal (1\u00d7)';            hintColor = '#aaaaaa'; }
      }

      // ── Effect text line (coloured, above stats) ──────────────
      const effText = _effectText(selMv.effect);
      const effColor = _effectColor(selMv.effect);
      const effLineY = by + panelH - 20;
      if (effText) {
        ctx.font = 'bold 9px monospace';
        ctx.textBaseline = 'bottom';
        const effW = ctx.measureText(effText).width;
        ctx.fillStyle = effColor;
        ctx.textAlign = 'left';
        ctx.fillText(effText, (W - effW) / 2, effLineY);
      }

      // ── Stats + type effectiveness (bottom line) ──────────────
      const lineY = by + panelH - 6;
      ctx.font = 'bold 9px monospace';
      ctx.textBaseline = 'bottom';

      const statPart = (hitsStr ? [pwrStr, accStr, hitsStr] : [pwrStr, accStr]).join('  ');
      const statW    = ctx.measureText(statPart).width;
      const sepW     = hintText ? ctx.measureText('  ').width : 0;
      const hintW    = hintText ? ctx.measureText(hintText).width : 0;
      const totalW   = statW + sepW + hintW;
      let cx = (W - totalW) / 2;

      ctx.fillStyle = '#ccddff';
      ctx.textAlign = 'left';
      ctx.fillText(statPart, cx, lineY);
      cx += statW;
      if (hintText) {
        ctx.fillText('  ', cx, lineY);
        cx += sepW;
        ctx.fillStyle = hintColor;
        ctx.fillText(hintText, cx, lineY);
      }
      ctx.textBaseline = 'top';
    }
  }

  // ── Title screen ──────────────────────────────────────────────
  function drawTitleScreen(ctx, animOffset) {
    const W = DG.CANVAS.W, H = DG.CANVAS.H;

    // Background — deep night sky
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, '#060918');
    bg.addColorStop(0.5, '#0d1535');
    bg.addColorStop(1, '#1a2240');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Stars (parallax layers)
    for (let i = 0; i < 60; i++) {
      const sx = (i * 19 + animOffset * (0.1 + (i % 3) * 0.06)) % W;
      const sy = (i * 29 + i * 7) % (H * 0.65);
      const alpha = 0.3 + 0.7 * Math.abs(Math.sin(animOffset * 0.04 + i * 0.7));
      const sz = (i % 4 === 0) ? 2 : 1;
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.fillRect(sx, sy, sz, sz);
    }

    // Glowing moon
    const moonX = W * 0.8, moonY = H * 0.12;
    ctx.fillStyle = 'rgba(255,240,180,0.1)';
    ctx.beginPath(); ctx.arc(moonX, moonY, 28, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = 'rgba(255,240,180,0.2)';
    ctx.beginPath(); ctx.arc(moonX, moonY, 20, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#fff8dc';
    ctx.beginPath(); ctx.arc(moonX, moonY, 15, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#f0e8b8';
    ctx.beginPath(); ctx.arc(moonX - 4, moonY - 4, 12, 0, Math.PI*2); ctx.fill();

    // Silhouette landscape
    ctx.fillStyle = '#0d1a0d';
    ctx.beginPath();
    ctx.moveTo(0, H);
    ctx.lineTo(0, H * 0.72);
    ctx.bezierCurveTo(60, H * 0.60, 130, H * 0.70, 200, H * 0.65);
    ctx.bezierCurveTo(270, H * 0.60, 340, H * 0.68, W, H * 0.62);
    ctx.lineTo(W, H);
    ctx.fill();

    // Silhouette trees
    for (let t = 0; t < 8; t++) {
      const tx = 20 + t * 58 + (t%3)*10;
      const ty = H * 0.62 + (t%2)*8;
      ctx.fillStyle = '#0a150a';
      ctx.beginPath(); ctx.arc(tx, ty - 18, 12, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(tx, ty - 28, 9, 0, Math.PI*2); ctx.fill();
      ctx.fillRect(tx - 2, ty - 10, 4, 12);
    }

    // Glowing title base
    const glow = 0.5 + 0.5 * Math.sin(animOffset * 0.05);
    ctx.fillStyle = `rgba(255,180,30,${0.08 + 0.06 * glow})`;
    ctx.beginPath(); ctx.ellipse(W/2, H * 0.28, 120, 30, 0, 0, Math.PI*2); ctx.fill();

    // "DINOMONS" title text with shadow
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    ctx.fillStyle = 'rgba(180,80,0,0.6)';
    ctx.font = 'bold 34px monospace';
    ctx.fillText('DinoMon', W/2 + 2, H * 0.14 + 2);

    ctx.fillStyle = '#FFD740';
    ctx.font = 'bold 34px monospace';
    ctx.fillText('DinoMon', W/2, H * 0.14);

    // Title shimmer
    ctx.fillStyle = `rgba(255,255,200,${0.6 * glow})`;
    ctx.font = 'bold 34px monospace';
    ctx.fillText('DinoMon', W/2, H * 0.14);

    // Subtitle
    ctx.fillStyle = '#8ecff5';
    ctx.font = 'bold 15px monospace';
    ctx.fillText('Fossil  Frontier', W/2, H * 0.27);

    // ── 3 Starters showcase ──────────────────────────────────
    const starters = [
      { id:'TINDREL', name:'Tindrel', color:'#FF6633', x: W * 0.18 },
      { id:'LEAFAWN', name:'Leafawn', color:'#55CC44', x: W * 0.50 },
      { id:'AQUEEL',  name:'Aqueel',  color:'#44AAFF', x: W * 0.82 },
    ];

    starters.forEach(function(s, i) {
      // Each starter bobs at a slightly different phase
      const bounce = Math.sin(animOffset * 0.055 + i * 1.2) * 5;
      const baseY  = H * 0.53;

      // Glow circle behind each starter
      const glowA = 0.18 + 0.10 * Math.sin(animOffset * 0.04 + i * 1.5);
      const glowG = ctx.createRadialGradient(s.x, baseY + bounce, 5, s.x, baseY + bounce, 42);
      glowG.addColorStop(0, s.color.replace(')', ',0.7)').replace('rgb', 'rgba') + '');
      // Simpler: just use rgba manually
      ctx.save();
      ctx.globalAlpha = glowA;
      ctx.fillStyle = s.color;
      ctx.beginPath();
      ctx.arc(s.x, baseY + bounce, 40, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Draw the starter sprite
      drawMon(ctx, s.id, s.x, baseY + bounce, 1.1);

      // Name label under each starter
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.font = 'bold 11px monospace';
      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.fillText(s.name, s.x + 1, baseY + bounce + 40 + 1);
      // Label
      ctx.fillStyle = s.color;
      ctx.fillText(s.name, s.x, baseY + bounce + 40);
      ctx.restore();
    });

    // Flashing prompt
    if (Math.sin(animOffset * 0.07) > 0) {
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px monospace';
      ctx.fillText('Press  ENTER  to  begin', W/2, H * 0.88);
    }

    ctx.textAlign = 'left';
  }

  // ── Name Entry screen ─────────────────────────────────────────
  function drawNameEntry(ctx, name, animOffset) {
    const W = DG.CANVAS.W, H = DG.CANVAS.H;

    // Background
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, '#0d1535');
    bg.addColorStop(1, '#1a2240');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Decorative dino silhouette
    ctx.globalAlpha = 0.15;
    drawMon(ctx, 'TINDREL', W * 0.75, H * 0.4, 2.5);
    ctx.globalAlpha = 1;

    // Panel
    ctx.fillStyle = 'rgba(10,14,42,0.90)';
    _roundRect(ctx, W/2 - 120, H * 0.25, 240, 130, 8);
    ctx.fill();
    ctx.strokeStyle = '#5a9fd4';
    ctx.lineWidth = 1.5;
    _roundRect(ctx, W/2 - 120, H * 0.25, 240, 130, 8);
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    ctx.fillStyle = '#aaccff';
    ctx.font = '11px monospace';
    ctx.fillText('Prof. Stratum asks:', W/2, H * 0.27);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px monospace';
    ctx.fillText('What is your name?', W/2, H * 0.33);

    // Name input box
    ctx.fillStyle = 'rgba(20,30,80,0.9)';
    _roundRect(ctx, W/2 - 90, H * 0.43, 180, 28, 5);
    ctx.fill();
    ctx.strokeStyle = '#7ab8e8';
    ctx.lineWidth = 1;
    _roundRect(ctx, W/2 - 90, H * 0.43, 180, 28, 5);
    ctx.stroke();

    // Typed name with cursor
    const cursor = Math.floor(animOffset / 30) % 2 ? '|' : '';
    ctx.fillStyle = '#FFE050';
    ctx.font = 'bold 16px monospace';
    ctx.fillText(name + cursor, W/2, H * 0.44);

    ctx.fillStyle = '#666688';
    ctx.font = '11px monospace';
    ctx.fillText('[ ENTER ] to confirm', W/2, H * 0.60);

    ctx.textAlign = 'left';
  }

  // ── Building color helper ──────────────────────────────────────
  function _bldAdjColor(hex, pct) {
    hex = hex.replace('#','');
    if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
    const r = Math.min(255,Math.max(0,parseInt(hex.slice(0,2),16)+pct));
    const g = Math.min(255,Math.max(0,parseInt(hex.slice(2,4),16)+pct));
    const b = Math.min(255,Math.max(0,parseInt(hex.slice(4,6),16)+pct));
    return '#'+[r,g,b].map(n=>n.toString(16).padStart(2,'0')).join('');
  }

  // Town dressing drawn around every building facade: potted bushes flanking the
  // entrance + a lamppost that glows warmly at night. Makes cities feel lived-in.
  function _facadeProps(ctx, fx, fy, fw, fh, T) {
    var baseY = fy + fh;
    function planter(cx) {
      ctx.fillStyle='#7a4f28'; ctx.fillRect(cx-3, baseY-5, 6, 5);
      ctx.fillStyle='#925f30'; ctx.fillRect(cx-3, baseY-5, 6, 1);
      ctx.fillStyle='#2f7d36'; ctx.beginPath(); ctx.arc(cx, baseY-7, 4.2, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle='#46a84a'; ctx.beginPath(); ctx.arc(cx-1.4, baseY-8.4, 2.1, 0, Math.PI*2); ctx.fill();
    }
    planter(fx + 5);
    planter(fx + fw - 5);
    var lx = fx - 7;                                   // lamppost just left of it
    ctx.fillStyle='#26262e';
    ctx.fillRect(lx-1, baseY-23, 2, 23);               // pole
    ctx.fillRect(lx-3, baseY-2, 6, 2);                 // base
    ctx.fillRect(lx-3, baseY-25, 6, 2);                // top arm
    var night = (window.DG && DG.getNightFactor) ? DG.getNightFactor() : 0;
    if (night > 0.12) {
      var gl = ctx.createRadialGradient(lx, baseY-26, 1, lx, baseY-26, 15);
      gl.addColorStop(0, 'rgba(255,221,140,'+(0.55*night).toFixed(2)+')');
      gl.addColorStop(1, 'rgba(255,221,140,0)');
      ctx.fillStyle = gl; ctx.fillRect(lx-15, baseY-41, 30, 30);
    }
    ctx.fillStyle = night > 0.12 ? '#ffe487' : '#c8cdd6';  // lantern
    ctx.fillRect(lx-2, baseY-27, 4, 5);
    ctx.strokeStyle='#15151b'; ctx.lineWidth=1; ctx.strokeRect(lx-2, baseY-27, 4, 5);
  }

  // ── Building signs — full facades per building type ───────────
  function drawBuildingSign(ctx, px, py, T, type, seed, townTheme, targetMap) {
    seed      = (seed      == null) ? 0      : seed;
    townTheme = (townTheme == null) ? 'AMBER' : townTheme;
    targetMap = (targetMap == null) ? ''      : targetMap;

    var isCenter = type === 'CENTER';
    var isGym    = type === 'GYM';
    var isHouse  = type === 'HOUSE';
    var isLab    = type === 'LAB';
    var isShop   = type === 'SHOP';
    if (!isCenter && !isGym && !isHouse && !isLab && !isShop) return;

    var THEMES = {
      AMBER:    { wall:'#ede0c4', roof:'#8b4513', acc:'#d4a04a', dark:'#5a2e0a' },
      COASTAL:  { wall:'#e8f0f8', roof:'#3a5a8a', acc:'#5599cc', dark:'#1a2a4a' },
      VOLCANIC: { wall:'#d8c8b0', roof:'#3a2010', acc:'#cc4400', dark:'#1a0a00' },
      GRASS:    { wall:'#eaf0e0', roof:'#3a6a20', acc:'#66aa44', dark:'#1a3a10' },
      GROUND:   { wall:'#e8dcc8', roof:'#5a3a18', acc:'#a07050', dark:'#2a1a08' },
      MOUNTAIN: { wall:'#d8d8e0', roof:'#3a4a5a', acc:'#7788aa', dark:'#1a2030' },
      SWAMP:    { wall:'#d0d8c0', roof:'#2a3a1a', acc:'#5a7a3a', dark:'#0a1a05' },
      SUMMIT:   { wall:'#eaeff8', roof:'#2a3a5a', acc:'#6688bb', dark:'#0a1020' },
      ELECTRIC: { wall:'#f0f0d8', roof:'#3a3a00', acc:'#aaaa00', dark:'#1a1a00' },
      NORMAL:   { wall:'#e8e0d0', roof:'#5a4a30', acc:'#a08860', dark:'#2a1a08' },
    };
    var th = THEMES[townTheme] || THEMES.NORMAL;

    var GYM_COLORS = {
      SHELLCREEK_GYM:'#2288ff', DUSTWALL_GYM:'#aa8833', PYRESIDE_GYM:'#ff4400',
      FERNGROVE_GYM:'#44aa22',  STONEHAVEN_GYM:'#aa7744', CRESTFALL_GYM:'#ddcc00',
      BOGMIRE_GYM:'#8844bb',    APEXSUMMIT_GYM:'#aa44ff',
    };
    var gymCol = GYM_COLORS[targetMap] || '#2266cc';

    function _shadow(fx,fy,fw,fh){ ctx.fillStyle='rgba(0,0,0,0.22)'; ctx.fillRect(fx+4,fy+4,fw,fh); }
    function _outline(fx,fy,fw,fh){ ctx.strokeStyle='rgba(255,255,255,0.8)'; ctx.lineWidth=2.5; ctx.strokeRect(fx-1.5,fy-1.5,fw+3,fh+3); }
    function _win(wx,wy,ww,wh,frame,glass){
      ctx.fillStyle=glass||'#b8ddf5'; ctx.fillRect(wx,wy,ww,wh);
      ctx.strokeStyle=frame||'#445566'; ctx.lineWidth=1.5; ctx.strokeRect(wx,wy,ww,wh);
      ctx.beginPath();
      ctx.moveTo(wx+ww/2,wy); ctx.lineTo(wx+ww/2,wy+wh);
      ctx.moveTo(wx,wy+wh/2); ctx.lineTo(wx+ww,wy+wh/2);
      ctx.stroke();
    }

    ctx.save();
    ctx.textAlign='center'; ctx.textBaseline='middle';

    // DINO CENTER (4T x 3T)
    if (isCenter) {
      var fw=T*4, fh=T*3, fx=px-T*1.5, fy=py-T*2;
      _shadow(fx,fy,fw,fh);
      var rh=fh*0.32;
      ctx.fillStyle='#cc2222'; ctx.fillRect(fx,fy,fw,rh);
      ctx.strokeStyle='rgba(100,0,0,0.3)'; ctx.lineWidth=1;
      for(var i=1;i<4;i++){ ctx.beginPath(); ctx.moveTo(fx+i*(fw/4),fy); ctx.lineTo(fx+i*(fw/4),fy+rh); ctx.stroke(); }
      ctx.fillStyle='#eeeeee'; ctx.fillRect(fx,fy+rh,fw,T*0.12);
      ctx.fillStyle='#f4f4f4'; ctx.fillRect(fx,fy+rh+T*0.12,fw,fh-rh-T*0.12);
      var spw=fw*0.72,sph=T*0.52,spx=fx+(fw-spw)/2,spy=fy+rh+T*0.2;
      ctx.fillStyle='#1a1a3a'; ctx.fillRect(spx,spy,spw,sph);
      ctx.strokeStyle='#cc2222'; ctx.lineWidth=1.5; ctx.strokeRect(spx,spy,spw,sph);
      ctx.fillStyle='#ffffff'; ctx.font='bold '+Math.max(7,T*0.22|0)+'px monospace';
      ctx.fillText('DINO CENTER',fx+fw/2,spy+sph/2);
      var lx=fx+fw/2,ly=fy+rh*0.5,lr=T*0.22;
      ctx.fillStyle='#ffffff'; ctx.beginPath(); ctx.arc(lx,ly,lr,0,Math.PI*2); ctx.fill();
      ctx.strokeStyle='#cc2222'; ctx.lineWidth=1.5; ctx.beginPath(); ctx.arc(lx,ly,lr,0,Math.PI*2); ctx.stroke();
      ctx.fillStyle='#cc2222';
      ctx.fillRect(lx-lr*0.22,ly-lr*0.65,lr*0.44,lr*1.3);
      ctx.fillRect(lx-lr*0.65,ly-lr*0.22,lr*1.3,lr*0.44);
      _win(fx+fw*0.06,fy+rh+T*0.82,fw*0.2,T*0.76,'#994444','#d0eeff');
      _win(fx+fw*0.74,fy+rh+T*0.82,fw*0.2,T*0.76,'#994444','#d0eeff');
      var dw=fw*0.3,dh=T*0.9,dx=fx+(fw-dw)/2,dy=fy+fh-dh;
      ctx.fillStyle='#3399dd'; ctx.fillRect(dx,dy,dw/2-1,dh); ctx.fillRect(dx+dw/2+1,dy,dw/2-1,dh);
      ctx.strokeStyle='#2277aa'; ctx.lineWidth=1; ctx.strokeRect(dx,dy,dw/2-1,dh); ctx.strokeRect(dx+dw/2+1,dy,dw/2-1,dh);
      ctx.strokeStyle='rgba(136,204,238,0.8)'; ctx.lineWidth=1;
      ctx.beginPath(); ctx.moveTo(dx+dw/4,dy+dh*0.15); ctx.lineTo(dx+dw/4,dy+dh*0.85); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(dx+dw*0.75,dy+dh*0.15); ctx.lineTo(dx+dw*0.75,dy+dh*0.85); ctx.stroke();
      ctx.fillStyle='#ddddee'; ctx.fillRect(dx-T*0.1,fy+fh-T*0.1,dw+T*0.2,T*0.1);
      _outline(fx,fy,fw,fh);
      ctx.strokeStyle='#882222'; ctx.lineWidth=2; ctx.strokeRect(fx,fy,fw,fh);
    }

    // GYM (4T x 3T)
    else if (isGym) {
      var fw=T*4,fh=T*3,fx=px-T*1.5,fy=py-T*2;
      _shadow(fx,fy,fw,fh);
      ctx.fillStyle='#252535'; ctx.fillRect(fx,fy,fw,fh);
      ctx.strokeStyle='rgba(255,255,255,0.07)'; ctx.lineWidth=0.8;
      for(var r=0;r<7;r++){
        var by2=fy+r*(fh/7),off2=(r%2)*(fw/5/2);
        ctx.beginPath(); ctx.moveTo(fx,by2); ctx.lineTo(fx+fw,by2); ctx.stroke();
        for(var c=0;c<=5;c++){ ctx.beginPath(); ctx.moveTo(fx+off2+c*(fw/5),by2); ctx.lineTo(fx+off2+c*(fw/5),by2+fh/7); ctx.stroke(); }
      }
      ctx.fillStyle=gymCol; ctx.fillRect(fx,fy,fw,T*0.25);
      var crW=fw/8,crH=T*0.32;
      for(var i=0;i<8;i++){
        if(i%2===0){
          ctx.fillStyle='#252535'; ctx.fillRect(fx+i*crW,fy-crH,crW,crH);
          ctx.strokeStyle=gymCol; ctx.lineWidth=1; ctx.strokeRect(fx+i*crW,fy-crH,crW,crH);
        }
      }
      var ex=fx+fw/2,ey=fy+fh*0.42,er=T*0.58;
      ctx.fillStyle='rgba(0,0,0,0.45)'; ctx.strokeStyle=gymCol; ctx.lineWidth=2.5;
      ctx.beginPath();
      ctx.moveTo(ex-er,ey-er*0.75); ctx.lineTo(ex+er,ey-er*0.75);
      ctx.lineTo(ex+er,ey+er*0.18); ctx.lineTo(ex,ey+er*0.92);
      ctx.lineTo(ex-er,ey+er*0.18); ctx.closePath(); ctx.fill(); ctx.stroke();
      var sr=T*0.26,sr2=T*0.13;
      ctx.fillStyle=gymCol; ctx.beginPath();
      for(var i=0;i<10;i++){
        var ang=(i*Math.PI/5)-Math.PI/2, rad=i%2===0?sr:sr2;
        var px2=ex+Math.cos(ang)*rad, py2=(ey-T*0.08)+Math.sin(ang)*rad;
        i===0?ctx.moveTo(px2,py2):ctx.lineTo(px2,py2);
      }
      ctx.closePath(); ctx.fill();
      ctx.fillStyle=gymCol; ctx.font='bold '+(T*0.28|0)+'px monospace';
      ctx.fillText('GYM',fx+fw/2,fy+fh*0.82);
      ctx.fillStyle=gymCol; ctx.globalAlpha=0.25;
      ctx.fillRect(fx+fw*0.07,fy+fh*0.2,T*0.2,T*0.55);
      ctx.fillRect(fx+fw*0.73,fy+fh*0.2,T*0.2,T*0.55);
      ctx.globalAlpha=1; ctx.strokeStyle=gymCol; ctx.lineWidth=1.5;
      ctx.strokeRect(fx+fw*0.07,fy+fh*0.2,T*0.2,T*0.55);
      ctx.strokeRect(fx+fw*0.73,fy+fh*0.2,T*0.2,T*0.55);
      var dw2=T*0.88,dh2=T*0.86,dx2=fx+(fw-dw2)/2,dy2=fy+fh-dh2;
      ctx.fillStyle='#12121e'; ctx.fillRect(dx2,dy2+dh2*0.2,dw2,dh2*0.8);
      ctx.beginPath(); ctx.ellipse(dx2+dw2/2,dy2+dh2*0.2,dw2/2,dh2*0.22,0,Math.PI,0); ctx.fill();
      ctx.strokeStyle=gymCol; ctx.lineWidth=2;
      ctx.strokeRect(dx2,dy2+dh2*0.2,dw2,dh2*0.8);
      ctx.beginPath(); ctx.ellipse(dx2+dw2/2,dy2+dh2*0.2,dw2/2,dh2*0.22,0,Math.PI,0); ctx.stroke();
      _outline(fx,fy-crH,fw,fh+crH);
      ctx.strokeStyle='#111122'; ctx.lineWidth=2.5; ctx.strokeRect(fx,fy,fw,fh);
    }

    // SHOP (3.5T x 2.8T)
    else if (isShop) {
      var fw=T*3.5,fh=T*2.8,fx=px-T*1.25,fy=py-T*1.8;
      _shadow(fx,fy,fw,fh);
      ctx.fillStyle='#fff8e1'; ctx.fillRect(fx,fy,fw,fh);
      ctx.fillStyle=th.acc;
      ctx.beginPath(); ctx.moveTo(fx-T*0.18,fy+fh*0.3); ctx.lineTo(fx+fw/2,fy-T*0.12); ctx.lineTo(fx+fw+T*0.18,fy+fh*0.3); ctx.closePath(); ctx.fill();
      ctx.strokeStyle=th.dark; ctx.lineWidth=1.5;
      ctx.beginPath(); ctx.moveTo(fx-T*0.18,fy+fh*0.3); ctx.lineTo(fx+fw/2,fy-T*0.12); ctx.lineTo(fx+fw+T*0.18,fy+fh*0.3); ctx.closePath(); ctx.stroke();
      var aw=fw*0.88,ah=T*0.22,ax2=fx+fw*0.06,ay2=fy+fh*0.27;
      for(var s=0;s<8;s++){ ctx.fillStyle=s%2===0?th.acc:'#ffffff'; ctx.fillRect(ax2+s*(aw/8),ay2,aw/8+0.5,ah); }
      ctx.strokeStyle=th.dark; ctx.lineWidth=1; ctx.strokeRect(ax2,ay2,aw,ah);
      var ww2=fw*0.76,wh2=T*0.7,wx2=fx+(fw-ww2)/2,wy2=ay2+ah+T*0.07;
      // Storefront display window: glass + a shelf with a few glossy goods
      ctx.fillStyle='#cdeefb'; ctx.fillRect(wx2,wy2,ww2,wh2);
      ctx.fillStyle='rgba(255,255,255,0.35)';                       // glass sheen
      ctx.beginPath(); ctx.moveTo(wx2+ww2*0.1,wy2); ctx.lineTo(wx2+ww2*0.32,wy2); ctx.lineTo(wx2+ww2*0.12,wy2+wh2); ctx.lineTo(wx2,wy2+wh2); ctx.closePath(); ctx.fill();
      ctx.fillStyle='#a9763f'; ctx.fillRect(wx2, wy2+wh2*0.64, ww2, wh2*0.12); // shelf
      var _itY=wy2+wh2*0.45, _itR=wh2*0.17;
      ['#e8504d','#4d8fe8','#e8c44d'].forEach(function(_col,_ii){
        var _itX=wx2+ww2*(0.24+_ii*0.26);
        ctx.fillStyle=_col; ctx.beginPath(); ctx.arc(_itX,_itY,_itR,0,Math.PI*2); ctx.fill();
        ctx.fillStyle='rgba(0,0,0,0.18)'; ctx.fillRect(_itX-_itR,_itY,_itR*2,1);    // ball band
        ctx.fillStyle='rgba(255,255,255,0.7)'; ctx.beginPath(); ctx.arc(_itX-_itR*0.32,_itY-_itR*0.32,_itR*0.3,0,Math.PI*2); ctx.fill();
      });
      ctx.strokeStyle=th.acc; ctx.lineWidth=2; ctx.strokeRect(wx2,wy2,ww2,wh2);
      var sw=fw*0.52,sh=T*0.38,sx=fx+(fw-sw)/2,sy=wy2+wh2+T*0.1;
      ctx.fillStyle=th.dark; ctx.fillRect(sx,sy,sw,sh);
      ctx.strokeStyle=th.acc; ctx.lineWidth=1.5; ctx.strokeRect(sx,sy,sw,sh);
      ctx.fillStyle='#ffffff'; ctx.font='bold '+(T*0.22|0)+'px monospace'; ctx.fillText('SHOP',fx+fw/2,sy+sh/2);
      var ddw=T*0.62,ddh=T*0.72,ddx=fx+(fw-ddw)/2,ddy=fy+fh-ddh;
      ctx.fillStyle=_bldAdjColor(th.acc,20); ctx.fillRect(ddx,ddy,ddw,ddh);
      ctx.strokeStyle=th.dark; ctx.lineWidth=1.5; ctx.strokeRect(ddx,ddy,ddw,ddh);
      _outline(fx,fy,fw,fh); ctx.strokeStyle=th.dark; ctx.lineWidth=1.5; ctx.strokeRect(fx,fy,fw,fh);
    }

    // LAB (3.5T x 2.8T)
    else if (isLab) {
      var fw=T*3.5,fh=T*2.8,fx=px-T*1.25,fy=py-T*1.8;
      _shadow(fx,fy,fw,fh);
      ctx.fillStyle='#eceff1'; ctx.fillRect(fx,fy,fw,fh);
      ctx.fillStyle='#455a64'; ctx.fillRect(fx-T*0.1,fy-T*0.12,fw+T*0.2,T*0.28);
      ctx.strokeStyle='#263238'; ctx.lineWidth=1; ctx.strokeRect(fx-T*0.1,fy-T*0.12,fw+T*0.2,T*0.28);
      var antX=fx+fw*0.78;
      ctx.strokeStyle='#37474f'; ctx.lineWidth=2;
      ctx.beginPath(); ctx.moveTo(antX,fy-T*0.12); ctx.lineTo(antX,fy-T*0.6); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(antX-T*0.18,fy-T*0.5); ctx.lineTo(antX+T*0.12,fy-T*0.38); ctx.stroke();
      ctx.fillStyle='#ff4444'; ctx.beginPath(); ctx.arc(antX,fy-T*0.62,T*0.06,0,Math.PI*2); ctx.fill();
      var sw2=fw*0.8,sh2=T*0.44,sx2=fx+(fw-sw2)/2,sy2=fy+T*0.22;
      ctx.fillStyle='#1a2a3a'; ctx.fillRect(sx2,sy2,sw2,sh2);
      ctx.strokeStyle='#546e7a'; ctx.lineWidth=1.5; ctx.strokeRect(sx2,sy2,sw2,sh2);
      ctx.fillStyle='#b3e5fc'; ctx.font='bold '+(T*0.2|0)+'px monospace'; ctx.fillText('PROF. LAB',fx+fw/2,sy2+sh2/2);
      var lwnW=fw*0.34,lwnH=T*0.78,lwnY=sy2+sh2+T*0.14;
      _win(fx+fw*0.06,lwnY,lwnW,lwnH,'#546e7a','#b3e5fc');
      _win(fx+fw*0.60,lwnY,lwnW,lwnH,'#546e7a','#b3e5fc');
      var ldw=T*0.54,ldh=T*0.72,ldx=fx+(fw-ldw)/2,ldy=fy+fh-ldh;
      ctx.fillStyle='#546e7a'; ctx.fillRect(ldx,ldy,ldw,ldh);
      ctx.strokeStyle='#263238'; ctx.lineWidth=1.5; ctx.strokeRect(ldx,ldy,ldw,ldh);
      ctx.fillStyle='#b3e5fc'; ctx.fillRect(ldx+ldw*0.2,ldy+ldh*0.08,ldw*0.6,ldh*0.32);
      _outline(fx,fy,fw,fh); ctx.strokeStyle='#37474f'; ctx.lineWidth=2; ctx.strokeRect(fx,fy,fw,fh);
    }

    // HOUSE (3T x 2.5T) - 6 seeded variants
    else if (isHouse) {
      var v=Math.abs(seed)%6, fw=T*3, fh=T*2.5, fx=px-T*1, fy=py-T*1.5;
      var wc=[th.wall,_bldAdjColor(th.wall,12),_bldAdjColor(th.wall,-8)][Math.abs(seed)%3];
      var rc=[th.roof,_bldAdjColor(th.roof,15),_bldAdjColor(th.roof,-10)][(Math.abs(seed)>>2)%3];
      _shadow(fx,fy,fw,fh);

      if (v===0) {
        ctx.fillStyle=rc;
        ctx.beginPath(); ctx.moveTo(fx-T*0.15,fy+fh*0.36); ctx.lineTo(fx+fw/2,fy+T*0.06); ctx.lineTo(fx+fw+T*0.15,fy+fh*0.36); ctx.closePath(); ctx.fill();
        ctx.strokeStyle=th.dark; ctx.lineWidth=1.5; ctx.stroke();
        ctx.fillStyle=wc; ctx.fillRect(fx,fy+fh*0.34,fw,fh*0.66);
        _win(fx+fw*0.07,fy+fh*0.44,fw*0.24,T*0.52,th.dark,'#d0eeff');
        _win(fx+fw*0.69,fy+fh*0.44,fw*0.24,T*0.52,th.dark,'#d0eeff');
        ctx.fillStyle=th.acc; ctx.fillRect(fx+fw*0.38,fy+fh*0.62,fw*0.24,fh*0.38);
        ctx.strokeStyle=th.dark; ctx.lineWidth=1.5; ctx.strokeRect(fx+fw*0.38,fy+fh*0.62,fw*0.24,fh*0.38); ctx.strokeRect(fx,fy+fh*0.34,fw,fh*0.66);
      }
      else if (v===1) {
        ctx.fillStyle=rc;
        ctx.beginPath(); ctx.moveTo(fx+T*0.1,fy+fh*0.44); ctx.lineTo(fx+fw/2,fy-T*0.12); ctx.lineTo(fx+fw-T*0.1,fy+fh*0.44); ctx.closePath(); ctx.fill();
        ctx.strokeStyle=th.dark; ctx.lineWidth=1.5; ctx.stroke();
        ctx.fillStyle=th.dark; ctx.fillRect(fx+fw*0.72,fy-T*0.22,T*0.22,T*0.4);
        ctx.fillStyle='#888'; ctx.fillRect(fx+fw*0.70,fy-T*0.25,T*0.26,T*0.09);
        ctx.fillStyle=_bldAdjColor(wc,-10); ctx.fillRect(fx,fy+fh*0.42,fw,fh*0.58);
        ctx.fillStyle='#b8ddf5'; ctx.beginPath(); ctx.arc(fx+fw/2,fy+fh*0.2,T*0.14,0,Math.PI*2); ctx.fill();
        ctx.strokeStyle=th.dark; ctx.lineWidth=1.2; ctx.beginPath(); ctx.arc(fx+fw/2,fy+fh*0.2,T*0.14,0,Math.PI*2); ctx.stroke();
        _win(fx+fw*0.08,fy+fh*0.53,fw*0.22,T*0.46,th.dark);
        _win(fx+fw*0.70,fy+fh*0.53,fw*0.22,T*0.46,th.dark);
        ctx.fillStyle=th.acc; ctx.fillRect(fx+fw*0.38,fy+fh*0.64,fw*0.24,fh*0.36);
        ctx.strokeStyle=th.dark; ctx.lineWidth=1.5; ctx.strokeRect(fx+fw*0.38,fy+fh*0.64,fw*0.24,fh*0.36); ctx.strokeRect(fx,fy+fh*0.42,fw,fh*0.58);
      }
      else if (v===2) {
        ctx.fillStyle='#546e7a'; ctx.fillRect(fx-T*0.08,fy-T*0.1,fw+T*0.16,T*0.22);
        ctx.strokeStyle='#263238'; ctx.lineWidth=1; ctx.strokeRect(fx-T*0.08,fy-T*0.1,fw+T*0.16,T*0.22);
        ctx.fillStyle=_bldAdjColor(wc,10); ctx.fillRect(fx,fy,fw,fh);
        ctx.fillStyle='#c8eeff'; ctx.fillRect(fx+fw*0.06,fy+fh*0.18,fw*0.88,T*0.44);
        ctx.strokeStyle='#546e7a'; ctx.lineWidth=1.5; ctx.strokeRect(fx+fw*0.06,fy+fh*0.18,fw*0.88,T*0.44);
        for(var d=1;d<3;d++){ ctx.beginPath(); ctx.moveTo(fx+fw*0.06+d*(fw*0.88/3),fy+fh*0.18); ctx.lineTo(fx+fw*0.06+d*(fw*0.88/3),fy+fh*0.18+T*0.44); ctx.stroke(); }
        ctx.fillStyle='#c8eeff'; ctx.fillRect(fx+fw*0.55,fy+fh*0.52,fw*0.34,T*0.38); ctx.strokeRect(fx+fw*0.55,fy+fh*0.52,fw*0.34,T*0.38);
        ctx.fillStyle='#37474f'; ctx.fillRect(fx+fw*0.1,fy+fh*0.68,fw*0.28,fh*0.32);
        ctx.strokeStyle='#263238'; ctx.lineWidth=1.5; ctx.strokeRect(fx+fw*0.1,fy+fh*0.68,fw*0.28,fh*0.32);
        ctx.strokeStyle='#546e7a'; ctx.strokeRect(fx,fy,fw,fh);
      }
      else if (v===3) {
        ctx.fillStyle=wc; ctx.fillRect(fx,fy+fh*0.28,fw,fh*0.72);
        ctx.fillStyle=rc; ctx.beginPath(); ctx.ellipse(fx+fw/2,fy+fh*0.28,fw/2+T*0.1,fh*0.3,0,Math.PI,0); ctx.fill();
        ctx.strokeStyle=th.dark; ctx.lineWidth=1.5; ctx.beginPath(); ctx.ellipse(fx+fw/2,fy+fh*0.28,fw/2+T*0.1,fh*0.3,0,Math.PI,0); ctx.stroke();
        ctx.fillStyle='#b8ddf5'; ctx.beginPath(); ctx.arc(fx+fw/2,fy+fh*0.16,T*0.17,0,Math.PI*2); ctx.fill();
        ctx.strokeStyle=th.dark; ctx.lineWidth=1.5; ctx.beginPath(); ctx.arc(fx+fw/2,fy+fh*0.16,T*0.17,0,Math.PI*2); ctx.stroke();
        _win(fx+fw*0.06,fy+fh*0.4,fw*0.22,T*0.44,th.dark);
        _win(fx+fw*0.72,fy+fh*0.4,fw*0.22,T*0.44,th.dark);
        var dax=fx+fw*0.38,day=fy+fh*0.64,daw=fw*0.24,dah=fh*0.36;
        ctx.fillStyle=_bldAdjColor(th.acc,20);
        ctx.beginPath(); ctx.moveTo(dax,day+dah); ctx.lineTo(dax,day+dah*0.32);
        ctx.arcTo(dax+daw/2,day,dax+daw,day+dah*0.32,daw*0.48);
        ctx.lineTo(dax+daw,day+dah); ctx.closePath(); ctx.fill();
        ctx.strokeStyle=th.dark; ctx.lineWidth=1.5; ctx.stroke(); ctx.strokeRect(fx,fy+fh*0.28,fw,fh*0.72);
      }
      else if (v===4) {
        var midY=fy+fh*0.48;
        ctx.fillStyle=_bldAdjColor(wc,-16); ctx.fillRect(fx,midY,fw,fh*0.52);
        ctx.fillStyle=wc; ctx.fillRect(fx,fy+fh*0.28,fw,midY-(fy+fh*0.28));
        ctx.fillStyle=rc; ctx.beginPath(); ctx.moveTo(fx-T*0.1,fy+fh*0.3); ctx.lineTo(fx+fw/2,fy+T*0.05); ctx.lineTo(fx+fw+T*0.1,fy+fh*0.3); ctx.closePath(); ctx.fill();
        ctx.strokeStyle=th.dark; ctx.lineWidth=1.5; ctx.stroke();
        ctx.fillStyle='#888'; ctx.fillRect(fx+fw*0.2,midY-T*0.06,fw*0.6,T*0.1);
        ctx.strokeStyle='#999'; ctx.lineWidth=1.5; ctx.beginPath(); ctx.moveTo(fx+fw*0.2,midY-T*0.28); ctx.lineTo(fx+fw*0.8,midY-T*0.28); ctx.stroke();
        for(var p=0;p<=5;p++){ ctx.fillStyle='#aaa'; ctx.fillRect(fx+fw*0.2+p*(fw*0.6/5)-1,midY-T*0.28,2,T*0.24); }
        _win(fx+fw*0.34,fy+fh*0.32,fw*0.32,T*0.38,th.dark);
        _win(fx+fw*0.07,midY+T*0.12,fw*0.22,T*0.42,th.dark);
        _win(fx+fw*0.71,midY+T*0.12,fw*0.22,T*0.42,th.dark);
        var dhh=Math.max(fh*0.38,T*0.3);
        ctx.fillStyle=th.acc; ctx.fillRect(fx+fw*0.38,midY+T*0.12,fw*0.24,dhh);
        ctx.strokeStyle=th.dark; ctx.lineWidth=1.5; ctx.strokeRect(fx+fw*0.38,midY+T*0.12,fw*0.24,dhh); ctx.strokeRect(fx,fy+fh*0.28,fw,fh*0.72);
      }
      else {
        ctx.fillStyle=rc; ctx.beginPath(); ctx.moveTo(fx-T*0.15,fy+fh*0.36); ctx.lineTo(fx+fw/2,fy+T*0.08); ctx.lineTo(fx+fw+T*0.15,fy+fh*0.36); ctx.closePath(); ctx.fill();
        ctx.strokeStyle=th.dark; ctx.lineWidth=1.5; ctx.stroke();
        var logH=T*0.2,logTop=fy+fh*0.34,logN=Math.ceil(fh*0.66/logH);
        var LOGS=['#8d6e63','#795548','#a1887f'];
        for(var l=0;l<logN;l++){ ctx.fillStyle=LOGS[l%3]; ctx.fillRect(fx,logTop+l*logH,fw,logH+0.5); }
        ctx.strokeStyle='#3e2723'; ctx.lineWidth=0.5;
        for(var l=0;l<logN;l++){ ctx.beginPath(); ctx.moveTo(fx,logTop+l*logH); ctx.lineTo(fx+fw,logTop+l*logH); ctx.stroke(); }
        ctx.fillStyle=_bldAdjColor(th.roof,-5); ctx.fillRect(fx+fw*0.25,fy+fh*0.58,fw*0.5,T*0.14);
        ctx.strokeStyle='#3e2723'; ctx.lineWidth=2;
        ctx.beginPath(); ctx.moveTo(fx+fw*0.30,fy+fh*0.58); ctx.lineTo(fx+fw*0.30,fy+fh*0.72); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(fx+fw*0.70,fy+fh*0.58); ctx.lineTo(fx+fw*0.70,fy+fh*0.72); ctx.stroke();
        _win(fx+fw*0.06,fy+fh*0.43,fw*0.24,T*0.42,'#3e2723','#d0eeff');
        _win(fx+fw*0.70,fy+fh*0.43,fw*0.24,T*0.42,'#3e2723','#d0eeff');
        ctx.fillStyle='#5d4037'; ctx.fillRect(fx+fw*0.37,fy+fh*0.64,fw*0.26,fh*0.36);
        ctx.strokeStyle='#3e2723'; ctx.lineWidth=1.5; ctx.strokeRect(fx+fw*0.37,fy+fh*0.64,fw*0.26,fh*0.36); ctx.strokeRect(fx,logTop,fw,fh*0.66);
      }
      _outline(fx,fy,fw,fh);
    }

    // Town dressing (planters + lamppost) around every building
    try { _facadeProps(ctx, fx, fy, fw, fh, T); } catch(e) {}

    ctx.restore();
  }

  console.log('[DinoMon] SpriteRenderer v31 loaded — full building facades, town themes, 6 house variants.');

  return {
    drawTile,
    drawPlayer,
    drawNPC,
    drawMon,
    drawBattleScene,
    drawBattleHUD,
    drawTitleScreen,
    drawNameEntry,
    drawBuildingSign,
  };
})();

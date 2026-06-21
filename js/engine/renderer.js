// DinoMon: Fossil Frontier — engine/renderer.js
// Main canvas draw loop
// v35 — Weather particles, biome battle backgrounds, item pickup sparkle animation

window.DG = window.DG || {};

DG.Renderer = (function () {

  let _canvas  = null;
  let _ctx     = null;
  let _animOff = 0; // global animation frame counter
  let _gs      = null;
  let _levelUpFlash = 0; // golden flash on level up
  let _lastMapId = null; // for location banner reset on map change
  let _locName   = null; // last displayed location name (takeover gating)
  let _locFrames = 9999; // frames since the location takeover started (starts "done")

  // ── FASE 1: transitie-state ────────────────────────────────
  let _menuT         = 0;    // menu slide-in progress (0→1)
  let _battleReveal  = 0;    // fade-from-black bij binnenkomst battle
  let _prevStateEnum = null; // vorige game-state (voor transitie-detectie)
  let _dust          = [];   // voetstap-stofwolkjes (wereldcoördinaten)
  let _lastPlayerTile = null;

  // ── Weather particle pool (overworld) ─────────────────────────
  let _wxParticles = []; // { x, y, vx, vy, r, alpha, type, life, maxLife, rot, shape }
  let _wxLastTheme = null;
  let _wxThunder   = 0;  // countdown for lightning flash in overworld

  // Battle UI cursor state (lives here, drawn by spriteRenderer)
  let _moveCursor    = 0;
  let _battleUIMode  = 'MAIN'; // 'MAIN' | 'MOVE' | 'BAG' | 'RUN'
  let _learnMoveCursor = 0;

  const BATTLE_MAIN_OPTIONS = ['FIGHT', 'BAG', 'DINOM', 'RUN'];
  let _battleMainCursor = 0;

  // ── Gym background color helper ───────────────────────────
  function _gymBgColor(mapId) {
    var _c = {
      'SHELLCREEK_GYM': '#f0ead0',
      'DUSTWALL_GYM':   '#1a1510',
      'PYRESIDE_GYM':   '#1a0500',
      'FERNGROVE_GYM':  '#0a1f08',
      'STONEHAVEN_GYM': '#1a1205',
      'CRESTFALL_GYM':  '#050d1a',
      'BOGMIRE_GYM':    '#001520',
      'APEXSUMMIT_GYM': '#05050f',
    };
    return _c[mapId] || '#1a1a2e';
  }

  // ── Fossil Citadel y-zone background color ────────────────
  function _citadelZoneBg(playerY) {
    if (playerY <= 3)  return '#1a1400'; // Champion hall — dark gold
    if (playerY <= 6)  return '#0a0010'; // Phantom — deep purple-black
    if (playerY <= 10) return '#0f0800'; // Garnet — dark earth-brown
    if (playerY <= 13) return '#150400'; // Ember — volcanic dark red
    if (playerY <= 16) return '#001520'; // Aurora — ice blue
    return '#05050f';                    // Entry hall — dark marble
  }

  // ── Init ─────────────────────────────────────────────────
  function init(canvas, gameState) {
    _canvas = canvas;
    _ctx    = canvas.getContext('2d');
    _gs     = gameState;

    // Crisp pixel rendering
    _ctx.imageSmoothingEnabled = false;
  }

  // ── Main draw (called every frame) ───────────────────────
  function draw(gameState, gameStateEnum) {
    if (!_ctx) return;
    _gs = gameState;
    _animOff++;

    const ctx = _ctx;
    const W   = DG.CANVAS.W;
    const H   = DG.CANVAS.H;

    ctx.clearRect(0, 0, W, H);

    // Frame-start reset: voorkomt dat een vorige draw-call zijn
    // text-uitlijning laat "lekken" naar het volgende frame
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    // ── Transitie-detectie (menu slide-in, battle reveal) ────
    if (gameStateEnum === DG.STATE.MENU) _menuT = Math.min(1, _menuT + 0.16);
    else _menuT = 0;
    if (gameStateEnum === DG.STATE.BATTLE && _prevStateEnum !== DG.STATE.BATTLE) {
      _battleReveal = 1;
    }
    _prevStateEnum = gameStateEnum;

    switch (gameStateEnum) {
      case DG.STATE.TITLE:          _drawTitle(ctx);         break;
      case DG.STATE.SLOT_SELECT:    _drawSlotSelect(ctx);    break;
      case DG.STATE.NAME_ENTRY:        _drawNameEntry(ctx);        break;
      case DG.STATE.RIVAL_NAME_ENTRY:  _drawRivalNameEntry(ctx);   break;
      case DG.STATE.DIFFICULTY_SELECT: _drawDifficultySelect(ctx); break;
      case DG.STATE.NICKNAME_ENTRY:    _drawNicknameEntry(ctx);    break;
      case DG.STATE.OVERWORLD:      _drawOverworld(ctx);     break;
      case DG.STATE.BATTLE:    _drawBattle(ctx); break;
      case DG.STATE.MENU: {
        _drawOverworld(ctx);
        // Menu schuift met easing in vanaf rechts
        const e = (DG.UIKit && DG.UIKit.easeOutCubic) ? DG.UIKit.easeOutCubic(_menuT) : 1;
        ctx.save();
        ctx.translate(Math.round((1 - e) * 40), 0);
        ctx.globalAlpha = e;
        _drawMenu(ctx);
        ctx.restore();
        break;
      }
      case DG.STATE.CUTSCENE:  _drawOverworld(ctx); break;
      case DG.STATE.BOX_UI:
        if (typeof DG.BoxUI !== 'undefined') DG.BoxUI.draw(ctx);
        else _drawOverworld(ctx);
        break;
      default:                 _drawTitle(ctx); break;
    }

    // Encounter-overlay: retro battle-wipe (blinds + flits) i.p.v. kale fade
    const encAlpha = (typeof DG.Overworld !== 'undefined' && DG.Overworld.getEncounterFadeAlpha)
      ? DG.Overworld.getEncounterFadeAlpha() : 0;
    if (encAlpha > 0.01) {
      if (DG.UIKit && DG.UIKit.battleWipe) {
        DG.UIKit.battleWipe(ctx, Math.min(1, encAlpha), W, H);
      } else {
        ctx.fillStyle = `rgba(0,0,0,${Math.min(1, encAlpha)})`;
        ctx.fillRect(0, 0, W, H);
      }
    }

    // Battle-reveal: vanuit zwart openvouwen zodra de battle begint
    if (gameStateEnum === DG.STATE.BATTLE && _battleReveal > 0.01) {
      ctx.fillStyle = `rgba(0,0,0,${_battleReveal.toFixed(3)})`;
      ctx.fillRect(0, 0, W, H);
      _battleReveal = Math.max(0, _battleReveal - 0.07);
    }

    // Evolution animation — full-screen overlay, drawn before dialogue
    _drawEvoOverlay(ctx);

    // Field-move (HM/TM) reward showcase — full-screen overlay
    if (typeof DG.TmReward !== 'undefined' && DG.TmReward.isActive()) {
      DG.TmReward.draw(ctx);
    }

    // ── Knockout fade-to-black overlay ───────────────────────
    // FASE 9: echt blackout-moment — volledig zwart met gefaseerde tekst
    if (window._KNOCKOUT_FADE > 0) {
      const kf = window._KNOCKOUT_FADE;
      const alpha = Math.min(1, kf / 40);
      ctx.fillStyle = `rgba(0,0,0,${alpha})`;
      ctx.fillRect(0, 0, W, H);
      if (alpha >= 1) {
        const l1 = Math.min(1, Math.max(0, (kf - 48) / 14));  // regel 1 fade-in
        const l2 = Math.min(1, Math.max(0, (kf - 85) / 14));  // regel 2 fade-in
        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = 'bold 14px monospace';
        ctx.fillStyle = `rgba(255,255,255,${l1})`;
        ctx.fillText('You have no DinoMons left to fight!', W / 2, H / 2 - 16);
        ctx.font = 'bold 18px monospace';
        ctx.fillStyle = `rgba(233,69,96,${l2})`;
        ctx.fillText('You blacked out!', W / 2, H / 2 + 16);
        ctx.restore();
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
      }
    }

    // Dialogue box always on top
    DG.DialogueBox.draw(ctx);

    // Transition fade overlay
    if (DG.Overworld.isTransitioning()) {
      ctx.fillStyle = `rgba(0,0,0,${DG.Overworld.transAlpha()})`;
      ctx.fillRect(0, 0, W, H);
    }

    // ── Badge ceremony full-screen overlay ──────────────────
    if (window._BADGE_SCREEN && window._BADGE_SCREEN.frames > 0) {
      const bs = window._BADGE_SCREEN;
      bs.frames--;
      const f = bs.frames;
      let alpha;
      if (f > 210)     alpha = (240 - f) / 30;  // fade in
      else if (f < 30) alpha = f / 30;           // fade out
      else             alpha = 1;
      ctx.save();
      ctx.globalAlpha = alpha;
      // Dark overlay
      ctx.fillStyle = 'rgba(0,0,20,0.92)';
      ctx.fillRect(0, 0, W, H);
      // Star burst glow
      const cx2 = W / 2, cy2 = H / 2 - 10;
      const pulse = 0.85 + 0.15 * Math.sin(Date.now() / 180);
      const grad = ctx.createRadialGradient(cx2, cy2, 0, cx2, cy2, 90 * pulse);
      grad.addColorStop(0, 'rgba(255,220,0,0.45)');
      grad.addColorStop(1, 'rgba(255,140,0,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
      // Badge star symbol
      ctx.fillStyle = '#FFE050';
      ctx.font = 'bold 44px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('\u2605', cx2, cy2);
      // Badge name
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px monospace';
      ctx.fillText(bs.name, cx2, cy2 + 38);
      // "obtained!" sub-line
      ctx.fillStyle = '#aaddff';
      ctx.font = '11px monospace';
      ctx.fillText('obtained!', cx2, cy2 + 56);
      // Badge count pip row
      const pipY = cy2 + 80, pipSpacing = 20;
      const startPipX = cx2 - ((bs.count - 1) * pipSpacing) / 2;
      for (let b = 0; b < 8; b++) {
        ctx.fillStyle = b < bs.count ? '#FFE050' : '#333355';
        ctx.beginPath();
        ctx.arc(startPipX + b * pipSpacing, pipY, 6, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.textAlign = 'left';
      ctx.restore();
    }

    // ── Save indicator (small "SAVED ✔" chip, top-right) ────
    if (window._SAVE_FLASH > 0) {
      window._SAVE_FLASH--;
      // Fade in for first 15 frames, stay solid, fade out last 30 frames
      const f = window._SAVE_FLASH;
      let alpha;
      if (f > 165)      alpha = (180 - f) / 15;   // fade in
      else if (f < 30)  alpha = f / 30;             // fade out
      else              alpha = 1;
      ctx.save();
      ctx.globalAlpha = alpha * 0.92;
      const lbl = 'SAVED \u2714';
      ctx.font = 'bold 10px monospace';
      const tw = ctx.measureText(lbl).width;
      const px = W - tw - 14, py = 5;
      // Background pill
      ctx.fillStyle = '#0a2a0a';
      ctx.beginPath();
      ctx.roundRect(px - 4, py, tw + 10, 15, 4);
      ctx.fill();
      ctx.strokeStyle = '#44cc44';
      ctx.lineWidth = 1;
      ctx.stroke();
      // Text
      ctx.fillStyle = '#44ff44';
      ctx.textBaseline = 'top';
      ctx.fillText(lbl, px, py + 2);
      ctx.restore();
    }

    // ── Item pickup sparkle ──────────────────────────────────────
    // Trigger: window._ITEM_PICKUP_ANIM = { frames:50, name:'Potion', screenX:N, screenY:N }
    if (window._ITEM_PICKUP_ANIM && window._ITEM_PICKUP_ANIM.frames > 0) {
      const ipa = window._ITEM_PICKUP_ANIM;
      ipa.frames--;
      const f   = ipa.frames;
      const age = 1 - f / 50;          // 0→1 over life
      const scx = ipa.screenX || W / 2;
      const scy = ipa.screenY || H / 2;
      ctx.save();
      // 8-particle burst outward then fade
      for (let i = 0; i < 8; i++) {
        const ang  = (i / 8) * Math.PI * 2;
        const dist = age * 28;
        const px2  = scx + Math.cos(ang) * dist;
        const py2  = scy + Math.sin(ang) * dist - age * 10;
        const pAlp = Math.max(0, 1 - age * 1.4);
        ctx.fillStyle = i % 2 === 0 ? `rgba(255,240,60,${pAlp})` : `rgba(255,160,60,${pAlp})`;
        ctx.beginPath(); ctx.arc(px2, py2, Math.max(0.5, 3 * (1 - age)), 0, Math.PI * 2); ctx.fill();
      }
      // Item name label rises and fades
      if (ipa.name) {
        const lAlp = Math.max(0, 1 - Math.max(0, age - 0.15) * 2.5);
        const ly   = scy - 14 - age * 22;
        ctx.globalAlpha = lAlp * 0.95;
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        const lw = ctx.measureText(ipa.name).width;
        ctx.fillStyle = 'rgba(10,10,30,0.72)';
        ctx.fillRect(scx - lw / 2 - 4, ly - 7, lw + 8, 14);
        ctx.fillStyle = '#FFEE88';
        ctx.fillText(ipa.name, scx, ly);
        ctx.textAlign = 'left';
      }
      ctx.globalAlpha = 1;
      ctx.restore();
    }
  }

  // ── Evo animation overlay (drawn on top of everything) ───
  function _drawEvoOverlay(ctx) {
    if (typeof DG.EvoAnim !== 'undefined' && DG.EvoAnim.isActive()) {
      DG.EvoAnim.draw(ctx);
    }
  }

  // ── Title screen ──────────────────────────────────────────
  function _drawTitle(ctx) {
    DG.SpriteRenderer.drawTitleScreen(ctx, _animOff);
  }

  // ── Slot select screen ───────────────────────────────────
  function _drawSlotSelect(ctx) {
    const W = DG.CANVAS.W, H = DG.CANVAS.H;
    const slots  = window._SLOT_LIST  || [];
    const cursor = window._SLOT_CURSOR || 0;

    // Starfield background (same as title)
    DG.SpriteRenderer.drawTitleScreen(ctx, _animOff);

    // Semi-transparent overlay panel
    const pw = 340, ph = 200, px = (W - pw) / 2, py = (H - ph) / 2;
    ctx.fillStyle = 'rgba(10,14,40,0.92)';
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(px, py, pw, ph, 10) : ctx.rect(px, py, pw, ph);
    ctx.fill();
    ctx.strokeStyle = '#e94560';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Title
    ctx.fillStyle = '#ffdd44';
    ctx.font = 'bold 13px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('SELECT SAVE FILE', W / 2, py + 12);

    // Divider
    ctx.strokeStyle = '#334';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(px + 12, py + 30); ctx.lineTo(px + pw - 12, py + 30);
    ctx.stroke();

    // Slot rows
    const rowH = 46, rowStartY = py + 38;
    for (let i = 0; i < slots.length; i++) {
      const slot  = slots[i];
      const ry    = rowStartY + i * rowH;
      const sel   = (i === cursor);

      // Row background
      if (sel) {
        ctx.fillStyle = 'rgba(233,69,96,0.25)';
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(px + 8, ry - 2, pw - 16, rowH - 6, 6) : ctx.rect(px + 8, ry - 2, pw - 16, rowH - 6);
        ctx.fill();
        ctx.strokeStyle = '#e94560';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Cursor arrow
      if (sel) {
        ctx.fillStyle = '#e94560';
        ctx.font = 'bold 14px monospace';
        ctx.textAlign = 'left';
        ctx.fillText('▶', px + 14, ry + 6);
      }

      const tx = px + 36;
      if (slot.empty) {
        ctx.fillStyle = sel ? '#aabbcc' : '#556677';
        ctx.font = '12px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`SLOT ${i + 1}  —  New Game`, tx, ry + 6);
        ctx.fillStyle = '#334455';
        ctx.font = '10px monospace';
        ctx.fillText('(empty)', tx, ry + 22);
      } else {
        // Trainer name
        ctx.fillStyle = sel ? '#ffffff' : '#ccddee';
        ctx.font = 'bold 13px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`SLOT ${i + 1}  —  ${slot.name || 'Trainer'}`, tx, ry + 6);

        // Badges + playtime
        const badgeText = `${slot.badges || 0} ${(slot.badges || 0) === 1 ? 'badge' : 'badges'}`;
        const pt = slot.playtime || 0;
        const ph2 = Math.floor(pt / 3600), pm = Math.floor((pt % 3600) / 60);
        const ptText = `${String(ph2).padStart(2,'0')}:${String(pm).padStart(2,'0')}`;
        ctx.fillStyle = sel ? '#aaccff' : '#667788';
        ctx.font = '10px monospace';
        ctx.fillText(`${badgeText}  ·  Time: ${ptText}`, tx, ry + 22);
        if (slot.date) {
          ctx.fillStyle = sel ? '#778899' : '#445566';
          ctx.textAlign = 'right';
          ctx.fillText(slot.date, px + pw - 16, ry + 22);
        }
      }
    }

    // Controls hint — show delete hint only when a filled slot is selected
    ctx.fillStyle = '#445566';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    const _selSlot = slots[cursor];
    if (_selSlot && !_selSlot.empty) {
      ctx.fillText('[↑↓] Select  [A] Load  [Q] Delete  [B] Back', W / 2, py + ph - 14);
    } else {
      ctx.fillText('[↑↓] Select  [A/Enter] New Game  [B] Back', W / 2, py + ph - 14);
    }

    // ── Delete confirmation overlay ───────────────────────
    if (window._SLOT_DELETE_CONFIRM !== null) {
      const dc = window._SLOT_DELETE_CONFIRM;
      const dcSlot = slots[dc];
      // Dim entire screen
      ctx.fillStyle = 'rgba(0,0,0,0.65)';
      ctx.fillRect(0, 0, W, H);
      // Confirmation panel
      const cpW = 300, cpH = 90, cpX = (W - cpW) / 2, cpY = (H - cpH) / 2;
      ctx.fillStyle = 'rgba(8,12,36,0.97)';
      if (ctx.roundRect) ctx.roundRect(cpX, cpY, cpW, cpH, 10); else ctx.rect(cpX, cpY, cpW, cpH);
      ctx.fill();
      ctx.strokeStyle = '#e94560';
      ctx.lineWidth = 2;
      if (ctx.roundRect) ctx.roundRect(cpX, cpY, cpW, cpH, 10); else ctx.rect(cpX, cpY, cpW, cpH);
      ctx.stroke();
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillStyle = '#ff6677';
      ctx.font = 'bold 13px monospace';
      ctx.fillText('DELETE SAVE FILE?', W / 2, cpY + 10);
      ctx.fillStyle = '#aabbcc';
      ctx.font = '11px monospace';
      const dcName = (dcSlot && dcSlot.name) ? dcSlot.name : `Slot ${dc + 1}`;
      ctx.fillText(`Slot ${dc + 1}: ${dcName}`, W / 2, cpY + 30);
      ctx.fillStyle = '#ff4444';
      ctx.font = 'bold 11px monospace';
      ctx.fillText('This cannot be undone!', W / 2, cpY + 46);
      ctx.fillStyle = '#667788';
      ctx.font = '10px monospace';
      ctx.fillText('[A/Enter] DELETE  ·  [B/Esc] Cancel', W / 2, cpY + 66);
      ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
    }
  }

  // ── Name entry screen ────────────────────────────────────
  function _drawNameEntry(ctx) {
    const name   = window._GAME_NAME_BUFFER || '';
    DG.SpriteRenderer.drawNameEntry(ctx, name, _animOff);
  }

  // ── Rival name entry screen ───────────────────────────────
  function _drawRivalNameEntry(ctx) {
    const W = DG.CANVAS.W, H = DG.CANVAS.H;
    const rivalBuf = window._RIVAL_NAME_BUFFER || '';
    const playerName = (window._GAME_NAME_BUFFER || '').trim() || 'Trainer';

    // Same dark background as name entry
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, '#0d1535');
    bg.addColorStop(1, '#1a2240');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Faint rival silhouette (NPC_RIVAL sprite or fallback shape)
    ctx.save();
    ctx.globalAlpha = 0.13;
    if (DG.SpriteRenderer && DG.SpriteRenderer.drawNPC) {
      DG.SpriteRenderer.drawNPC(ctx, 'NPC_RIVAL', W * 0.74, H * 0.42, 'DOWN', 2.8);
    } else {
      // Fallback: simple stick figure silhouette
      ctx.fillStyle = '#8888ff';
      ctx.beginPath(); ctx.arc(W * 0.74, H * 0.25, 18, 0, Math.PI * 2); ctx.fill();
      ctx.fillRect(W * 0.74 - 12, H * 0.32, 24, 36);
    }
    ctx.restore();

    // Prof. Stratum speech bubble at top
    const bubbleW = 300, bubbleH = 44, bubbleX = (W - bubbleW) / 2, bubbleY = H * 0.06;
    ctx.fillStyle = 'rgba(255,255,255,0.94)';
    if (ctx.roundRect) ctx.roundRect(bubbleX, bubbleY, bubbleW, bubbleH, 8);
    else ctx.rect(bubbleX, bubbleY, bubbleW, bubbleH);
    ctx.fill();
    ctx.strokeStyle = '#5a9fd4';
    ctx.lineWidth = 1.5;
    if (ctx.roundRect) ctx.roundRect(bubbleX, bubbleY, bubbleW, bubbleH, 8);
    else ctx.rect(bubbleX, bubbleY, bubbleW, bubbleH);
    ctx.stroke();
    // Bubble tail pointing down-left toward "professor"
    ctx.fillStyle = 'rgba(255,255,255,0.94)';
    ctx.beginPath();
    ctx.moveTo(bubbleX + 24, bubbleY + bubbleH);
    ctx.lineTo(bubbleX + 14, bubbleY + bubbleH + 10);
    ctx.lineTo(bubbleX + 40, bubbleY + bubbleH);
    ctx.closePath(); ctx.fill();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#1a2a4a';
    ctx.font = '10px monospace';
    ctx.fillText('Prof. Stratum:', W / 2, bubbleY + 5);
    ctx.fillStyle = '#0a1a3a';
    ctx.font = 'bold 12px monospace';
    ctx.fillText(`And your rival, ${playerName}?`, W / 2, bubbleY + 19);
    ctx.fillStyle = '#334466';
    ctx.font = '10px monospace';
    ctx.fillText("What is your best friend's name?", W / 2, bubbleY + 32);

    // Small professor portrait (left of bubble)
    const pfX = bubbleX - 2, pfY = bubbleY + bubbleH - 2;
    ctx.fillStyle = '#2a4a7a';
    ctx.beginPath(); ctx.arc(pfX, pfY, 11, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = '10px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('P', pfX, pfY);

    // Input panel
    ctx.fillStyle = 'rgba(10,14,42,0.90)';
    if (ctx.roundRect) ctx.roundRect(W/2 - 120, H * 0.44, 240, 110, 8);
    else ctx.rect(W/2 - 120, H * 0.44, 240, 110);
    ctx.fill();
    ctx.strokeStyle = '#e9b030';
    ctx.lineWidth = 1.5;
    if (ctx.roundRect) ctx.roundRect(W/2 - 120, H * 0.44, 240, 110, 8);
    else ctx.rect(W/2 - 120, H * 0.44, 240, 110);
    ctx.stroke();

    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    ctx.fillStyle = '#ffdd88';
    ctx.font = 'bold 13px monospace';
    ctx.fillText("Your rival's name:", W/2, H * 0.46);

    // Input box
    ctx.fillStyle = 'rgba(20,30,80,0.9)';
    if (ctx.roundRect) ctx.roundRect(W/2 - 90, H * 0.54, 180, 28, 5);
    else ctx.rect(W/2 - 90, H * 0.54, 180, 28);
    ctx.fill();
    ctx.strokeStyle = '#e9b030';
    ctx.lineWidth = 1;
    if (ctx.roundRect) ctx.roundRect(W/2 - 90, H * 0.54, 180, 28, 5);
    else ctx.rect(W/2 - 90, H * 0.54, 180, 28);
    ctx.stroke();

    // Typed name + blinking cursor
    const cursor = Math.floor(_animOff / 30) % 2 ? '|' : '';
    ctx.fillStyle = '#FFE050';
    ctx.font = 'bold 16px monospace';
    ctx.fillText(rivalBuf + cursor, W/2, H * 0.555);

    // Hint: leave blank for default
    ctx.fillStyle = '#556688';
    ctx.font = '9px monospace';
    ctx.fillText('Leave blank for default (Flint)', W/2, H * 0.655);

    ctx.fillStyle = '#445566';
    ctx.font = '10px monospace';
    ctx.fillText('[ ENTER ] confirm   [ ESC ] back', W/2, H * 0.695);

    ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  }

  // ── Difficulty select screen ─────────────────────────────
  function _drawDifficultySelect(ctx) {
    const W = DG.CANVAS.W, H = DG.CANVAS.H;
    const cursor = window._DIFFICULTY_CURSOR || 0;

    // Starfield background (reuse title screen)
    DG.SpriteRenderer.drawTitleScreen(ctx, _animOff);

    // Panel
    const pw = 360, ph = 200, px = (W - pw) / 2, py = (H - ph) / 2;
    ctx.fillStyle = 'rgba(8,12,36,0.94)';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(px, py, pw, ph, 10); else ctx.rect(px, py, pw, ph);
    ctx.fill();
    ctx.strokeStyle = '#e94560';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Title
    ctx.fillStyle = '#ffdd44';
    ctx.font = 'bold 13px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('SELECT DIFFICULTY', W / 2, py + 14);

    // Divider
    ctx.strokeStyle = '#334455';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(px + 12, py + 34); ctx.lineTo(px + pw - 12, py + 34);
    ctx.stroke();

    // Options
    const options = [
      {
        label: 'NORMAL',
        color: '#44aaff',
        desc1: 'Standard experience.',
        desc2: 'Items usable in battle.',
      },
      {
        label: 'HARD',
        color: '#ff4455',
        desc1: 'Enemy AI is smarter (+1 tier).',
        desc2: 'No healing items in battle!',
      },
    ];

    const rowH = 68, rowStartY = py + 44;
    options.forEach((opt, i) => {
      const ry  = rowStartY + i * rowH;
      const sel = (i === cursor);

      // Row background highlight
      if (sel) {
        ctx.fillStyle = 'rgba(233,69,96,0.18)';
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(px + 10, ry - 2, pw - 20, rowH - 8, 6);
        else ctx.rect(px + 10, ry - 2, pw - 20, rowH - 8);
        ctx.fill();
        ctx.strokeStyle = opt.color;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Cursor arrow
      ctx.fillStyle = opt.color;
      ctx.font = sel ? 'bold 14px monospace' : '14px monospace';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(sel ? '▶' : ' ', px + 18, ry + 6);

      // Label
      ctx.fillStyle = sel ? '#ffffff' : '#aabbcc';
      ctx.font = (sel ? 'bold ' : '') + '14px monospace';
      ctx.fillText(opt.label, px + 38, ry + 4);

      // Description lines
      ctx.fillStyle = sel ? '#ccddee' : '#556677';
      ctx.font = '10px monospace';
      ctx.fillText(opt.desc1, px + 38, ry + 22);
      ctx.fillStyle = sel ? (i === 1 ? '#ff8888' : '#aabbcc') : '#445566';
      ctx.fillText(opt.desc2, px + 38, ry + 36);
    });

    // Controls hint
    ctx.fillStyle = '#445566';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('[↑↓] Select  [A/Enter] Confirm  [B] Back', W / 2, py + ph - 14);

    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
  }

  // ── Nickname entry screen ────────────────────────────────
  function _drawNicknameEntry(ctx) {
    const W = DG.CANVAS.W, H = DG.CANVAS.H;
    const mon  = window._NICKNAME_MON;
    const name = window._NICKNAME_BUFFER || '';
    const sp   = mon && DG.SPECIES ? DG.SPECIES[mon.speciesId] : null;
    const monName = sp ? sp.name : (mon ? mon.speciesId : '???');

    // Background fade
    ctx.fillStyle = 'rgba(0,0,0,0.75)';
    ctx.fillRect(0, 0, W, H);

    // Panel
    const bx = 40, by = 60, bw = W - 80, bh = H - 120;
    const grad = ctx.createLinearGradient(bx, by, bx, by + bh);
    grad.addColorStop(0, '#0e1436');
    grad.addColorStop(1, '#060a1e');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(bx, by, bw, bh, 8) : ctx.rect(bx, by, bw, bh);
    ctx.fill();
    ctx.strokeStyle = '#5a9fd4';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Title
    ctx.fillStyle = '#ffdd44';
    ctx.font = 'bold 14px monospace';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'center';
    ctx.fillText(`${monName} was caught!`, W / 2, by + 16);

    ctx.fillStyle = '#aaccff';
    ctx.font = '12px monospace';
    ctx.fillText('Give a nickname?', W / 2, by + 38);

    // Name box
    const nbx = bx + 30, nby = by + 62, nbw = bw - 60, nbh = 30;
    ctx.fillStyle = '#111828';
    ctx.fillRect(nbx, nby, nbw, nbh);
    ctx.strokeStyle = '#5a9fd4';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(nbx, nby, nbw, nbh);

    // Typed name + cursor blink
    const cursor = Math.floor(_animOff / 15) % 2 === 0 ? '_' : '';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(name + cursor, nbx + 10, nby + 7);

    // Hint
    ctx.fillStyle = '#667788';
    ctx.font = '11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('[ENTER] Confirm  [ESC/B] Skip', W / 2, by + bh - 18);

    ctx.textAlign = 'left';
  }

  // Directional exit markers: for each edge warp that leads to another OUTDOOR
  // area, draw an arrow + destination name pinned to that edge, over the gap.
  // Gives an at-a-glance "this way to <place>" in every town and route.
  function _drawExitMarkers(ctx, mapData, camX, camY, T, W, H) {
    if (!mapData || mapData.isIndoor || !mapData.warps || !window.DG || !DG.MAPS) return;
    const groups = {};
    for (const w of mapData.warps) {
      const tm = DG.MAPS[w.targetMap];
      if (!tm || tm.isIndoor) continue;            // only outdoor travel exits
      let dir = null;
      if (w.y <= 0) dir = 'up';
      else if (w.y >= mapData.height - 1) dir = 'down';
      else if (w.x <= 0) dir = 'left';
      else if (w.x >= mapData.width - 1) dir = 'right';
      else continue;                                // interior warp, not an edge
      const _lockFlag = w.gymLock || w.requiresFlag;
      const locked = !!(_lockFlag && _gs && _gs.player && _gs.player.flags && !_gs.player.flags[_lockFlag]);
      const key = w.targetMap + '|' + dir;
      if (!groups[key]) groups[key] = { dir, name: tm.name || w.targetMap, xs: [], ys: [], locked: true };
      groups[key].xs.push(w.x); groups[key].ys.push(w.y);
      if (!locked) groups[key].locked = false;
    }
    const ARROW = { up: '▲', down: '▼', left: '◄', right: '►' };
    for (const key in groups) {
      const g = groups[key];
      const ax = g.xs.reduce((a, b) => a + b, 0) / g.xs.length;
      const ay = g.ys.reduce((a, b) => a + b, 0) / g.ys.length;
      let sx = ax * T - camX + T / 2;
      let sy = ay * T - camY + T / 2;
      const pad = 16;
      if (g.dir === 'up')         sy = pad;
      else if (g.dir === 'down')  sy = H - pad;
      else if (g.dir === 'left')  sx = pad + 12;
      else if (g.dir === 'right') sx = W - pad - 12;
      const label = (g.dir === 'left' ? ARROW[g.dir] + ' ' : '') + g.name +
                    (g.dir !== 'left' ? ' ' + ARROW[g.dir] : '') + (g.locked ? ' (locked)' : '');
      ctx.save();
      ctx.font = 'bold 9px monospace';
      const bw = ctx.measureText(label).width + 10, bh = 14;
      sx = Math.max(bw / 2 + 2, Math.min(W - bw / 2 - 2, sx));
      sy = Math.max(bh / 2 + 2, Math.min(H - bh / 2 - 2, sy));
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = g.locked ? 'rgba(40,24,24,0.9)' : 'rgba(8,14,40,0.9)';
      ctx.fillRect(sx - bw / 2, sy - bh / 2, bw, bh);
      ctx.strokeStyle = g.locked ? '#aa6666' : '#66ccff';
      ctx.lineWidth = 1;
      ctx.strokeRect(sx - bw / 2, sy - bh / 2, bw, bh);
      ctx.globalAlpha = 1;
      ctx.fillStyle = g.locked ? '#dd99aa' : '#ffe27a';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(label, sx, sy + 0.5);
      ctx.restore();
      ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
    }
  }

  // ── Overworld ─────────────────────────────────────────────
  function _drawOverworld(ctx) {
    if (!_gs) return;
    const mapData = DG.Overworld.getMapData();
    if (!mapData) return;

    // Reset global anim counter whenever the player changes maps
    const curMapId = _gs.player ? _gs.player.currentMap : null;
    if (curMapId && curMapId !== _lastMapId) {
      _lastMapId = curMapId;
      _animOff   = 0; // restart idle animations
    }
    // Full-screen location takeover counter — outdoor areas only (routes/cities/
    // caves), re-armed only when the DISPLAYED name changes. This keeps
    // multi-segment routes and building in/out trips from re-popping the banner.
    if (!mapData.isIndoor) {
      const _nm = mapData.name || '';
      if (_nm !== _locName) { _locName = _nm; _locFrames = 0; }
      else if (_locFrames < 9999) { _locFrames++; }
    }

    const T    = DG.CANVAS.TILE_SIZE;
    const camX = DG.Overworld.getCamX();
    const camY = DG.Overworld.getCamY();
    const W    = DG.CANVAS.W, H = DG.CANVAS.H;

    // Tile range visible
    const startX = Math.floor(camX / T);
    const startY = Math.floor(camY / T);
    const endX   = Math.min(mapData.width,  startX + Math.ceil(W / T) + 1);
    const endY   = Math.min(mapData.height, startY + Math.ceil(H / T) + 1);

    // Indoor/gym background fill (visible behind transparent tile gaps)
    if (mapData.isIndoor) {
      let _bgColor;
      if (window.DG_CURRENT_MAP_ID === 'FOSSIL_CITADEL' && _gs && _gs.player) {
        _bgColor = _citadelZoneBg(_gs.player.y);
      } else {
        _bgColor = _gymBgColor(window.DG_CURRENT_MAP_ID || '');
      }
      ctx.fillStyle = _bgColor;
      ctx.fillRect(0, 0, W, H);
    }

    // Draw tiles
    for (let ty = startY; ty < endY; ty++) {
      for (let tx = startX; tx < endX; tx++) {
        const tile = mapData.tiles[ty] ? mapData.tiles[ty][tx] : 0;
        const px   = tx * T - camX;
        const py   = ty * T - camY;
        // FASE 12: buur-info — water krijgt oever-randen waar het aan
        // niet-water grenst, pad krijgt een rand waar het aan gras grenst
        let edges = 0;
        if (tile === 3 || tile === 0) {
          const _nb = (xx, yy) => (mapData.tiles[yy] && mapData.tiles[yy][xx] !== undefined)
            ? mapData.tiles[yy][xx] : tile;
          const _match = tile === 3
            ? (v) => v !== 3 && v !== 71
            : (v) => v === 1 || v === 2 || v === 9;
          if (_match(_nb(tx, ty - 1))) edges |= 1;
          if (_match(_nb(tx + 1, ty))) edges |= 2;
          if (_match(_nb(tx, ty + 1))) edges |= 4;
          if (_match(_nb(tx - 1, ty))) edges |= 8;
        }
        DG.SpriteRenderer.drawTile(ctx, tile, px, py, T, _animOff, edges);
      }
    }

    // Draw NPCs
    if (mapData.npcs) {
      const flags = _gs && _gs.player && _gs.player.flags;
      for (const npc of mapData.npcs) {
        if (npc.x < startX - 1 || npc.x > endX || npc.y < startY - 1 || npc.y > endY) continue;
        if (flags && npc.flagToHide && flags[npc.flagToHide]) continue;
        if (flags && npc.requiresFlag && !flags[npc.requiresFlag]) continue;
        DG.SpriteRenderer.drawNPC(ctx, npc, camX, camY);
      }
    }

    // Draw ground items (dinoball pickups) not yet collected
    if (mapData.items) {
      const f = _gs && _gs.player && _gs.player.flags;
      for (const it of mapData.items) {
        if (it.x < startX - 1 || it.x > endX || it.y < startY - 1 || it.y > endY) continue;
        if (f && f['ITEM_' + mapData.id + '_' + it.x + '_' + it.y]) continue;
        const cx = it.x * T - camX + T / 2, cy = it.y * T - camY + T / 2;
        const bob = Math.sin(_animOff * 0.1 + it.x) * 1.5;
        const hidden = !!it.hidden;
        ctx.save();
        ctx.translate(cx, cy + bob);
        if (hidden) { ctx.restore(); continue; } // hidden items are invisible
        ctx.fillStyle = '#e23b3b'; ctx.beginPath(); ctx.arc(0, 0, 7, Math.PI, 0); ctx.fill();
        ctx.fillStyle = '#f5f5f5'; ctx.beginPath(); ctx.arc(0, 0, 7, 0, Math.PI); ctx.fill();
        ctx.strokeStyle = '#1a1a1a'; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.arc(0, 0, 7, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-7, 0); ctx.lineTo(7, 0); ctx.stroke();
        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0, 0, 2.4, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#1a1a1a'; ctx.beginPath(); ctx.arc(0, 0, 2.4, 0, Math.PI * 2); ctx.stroke();
        ctx.restore();
      }
    }

    // Draw exclamation mark if trainer has spotted player
    const alert = (typeof DG.Overworld.getTrainerAlert === 'function') ? DG.Overworld.getTrainerAlert() : null;
    if (alert && alert.phase === 'ALERT') {
      const npc = alert.npc;
      const nx  = npc.x * T - camX + T / 2;
      const ny  = npc.y * T - camY - 6;
      const bounce = Math.abs(Math.sin(_animOff * 0.18)) * 4;
      // Background bubble
      ctx.fillStyle = 'rgba(255,255,255,0.95)';
      ctx.beginPath();
      ctx.ellipse(nx, ny - 14 - bounce, 10, 13, 0, 0, Math.PI*2);
      ctx.fill();
      // Triangle tip of bubble
      ctx.beginPath();
      ctx.moveTo(nx - 4, ny - 4 - bounce);
      ctx.lineTo(nx + 4, ny - 4 - bounce);
      ctx.lineTo(nx, ny - bounce);
      ctx.fill();
      ctx.strokeStyle = '#cc2222';
      ctx.lineWidth = 1;
      ctx.stroke();
      // "!" text
      ctx.fillStyle = '#cc2222';
      ctx.font = 'bold 14px monospace';
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      ctx.fillText('!', nx, ny - 14 - bounce);
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
    }

    // Draw building signs over door warp tiles (one facade per unique target building)
    if (mapData.warps) {
      const _drawnFacades = new Set();
      for (const w of mapData.warps) {
        if (!w.targetMap) continue;
        if (_drawnFacades.has(w.targetMap)) continue;
        const wpx = w.x * T - camX;
        const wpy = w.y * T - camY;
        if (wpx < -T * 4 || wpx > W + T * 3 || wpy < -T * 4 || wpy > H + T) continue;
        let ftype = null;
        if      (w.targetMap.endsWith('_CENTER')) ftype = 'CENTER';
        else if (w.targetMap.endsWith('_GYM'))    ftype = 'GYM';
        else if (w.targetMap.endsWith('_HOUSE'))  ftype = 'HOUSE';
        else if (w.targetMap.endsWith('_LAB'))    ftype = 'LAB';
        else if (w.targetMap.endsWith('_SHOP'))   ftype = 'SHOP';
        if (ftype) {
          const _bldSeed = w.x * 7 + w.y * 13;
          DG.SpriteRenderer.drawBuildingSign(ctx, wpx, wpy, T, ftype, _bldSeed, window.DG_MAP_THEME || 'NORMAL', w.targetMap);
          _drawnFacades.add(w.targetMap);
        }
      }
    }

    // Draw player
    const p   = _gs.player;
    const ppX = p.x * T - camX + T / 2;
    const ppY = p.y * T - camY + T;

    // FASE 1: voetstap-stofwolkjes — spawn bij elke tegelstap
    if (_lastPlayerTile && p.currentMap === _lastPlayerTile.map &&
        (_lastPlayerTile.x !== p.x || _lastPlayerTile.y !== p.y)) {
      for (let di = 0; di < 3; di++) {
        _dust.push({
          wx: _lastPlayerTile.x * T + T / 2 + (Math.random() * 10 - 5),
          wy: _lastPlayerTile.y * T + T - 2 + (Math.random() * 3 - 1),
          r: 1.4 + Math.random() * 1.6,
          vx: Math.random() * 0.5 - 0.25,
          vy: -0.18 - Math.random() * 0.12,
          life: 16 + Math.random() * 8, maxLife: 24,
        });
      }
    }
    _lastPlayerTile = { x: p.x, y: p.y, map: p.currentMap };

    for (let di = _dust.length - 1; di >= 0; di--) {
      const d = _dust[di];
      d.wx += d.vx; d.wy += d.vy; d.life--;
      if (d.life <= 0) { _dust.splice(di, 1); continue; }
      ctx.globalAlpha = (d.life / d.maxLife) * 0.45;
      ctx.fillStyle = '#cfc4ae';
      ctx.beginPath();
      ctx.arc(d.wx - camX, d.wy - camY, d.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    DG.SpriteRenderer.drawPlayer(ctx, ppX, ppY, p.facing, _animOff);

    // Directional exit markers (which way to the next route/city)
    _drawExitMarkers(ctx, mapData, camX, camY, T, W, H);

    // ── Full-screen location takeover (outdoor areas only) ────
    // Dramatic centred overlay when entering a new named area (~1.8s, auto fade).
    const LOC_IN = 16, LOC_HOLD = 80, LOC_OUT = 106;
    if (!mapData.isIndoor && _locName && _locFrames < LOC_OUT) {
      const f = _locFrames;
      const a = f < LOC_IN  ? f / LOC_IN
              : f < LOC_HOLD ? 1
              : Math.max(0, (LOC_OUT - f) / (LOC_OUT - LOC_HOLD));
      const cx = W / 2, cy = H / 2;
      ctx.save();
      ctx.textBaseline = 'alphabetic';
      // Dim the world behind the title
      ctx.globalAlpha = a * 0.72;
      ctx.fillStyle = '#060a1e';
      ctx.fillRect(0, 0, W, H);
      // Central title band
      ctx.globalAlpha = a * 0.95;
      ctx.fillStyle = 'rgba(10,16,44,0.95)';
      ctx.fillRect(0, cy - 27, W, 54);
      ctx.strokeStyle = '#5a9fd4';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(0, cy - 27); ctx.lineTo(W, cy - 27); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, cy + 27); ctx.lineTo(W, cy + 27); ctx.stroke();
      // Label + location name
      ctx.globalAlpha = a;
      ctx.textAlign = 'center';
      ctx.fillStyle = '#8fd0ff';
      ctx.font = '10px monospace';
      ctx.fillText('NOW ENTERING', cx, cy - 8);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px monospace';
      ctx.fillText(_locName, cx, cy + 16);
      // Accent ticks flanking the name
      const nameW = ctx.measureText(_locName).width;
      ctx.fillStyle = '#5a9fd4';
      ctx.fillRect(cx - nameW / 2 - 16, cy + 8, 10, 2);
      ctx.fillRect(cx + nameW / 2 + 6,  cy + 8, 10, 2);
      ctx.restore();
      ctx.textAlign = 'left';
    }

    // Weather particles (outdoors only)
    if (!mapData.isIndoor) {
      _drawCloudShadows(ctx, W, H); // FASE 11: wolkschaduwen overdag
      _drawOverworldWeather(ctx, W, H);
    }

    // Day/Night overlay (outdoors only)
    if (!mapData.isIndoor) {
      _drawDayNightOverlay(ctx);
      _drawFireflies(ctx, W, H);    // FASE 11: vuurvliegjes bóven de nacht-dimming
    }

    // Step counter & playtime + time/season indicator (tiny, bottom-right, only outdoors)
    if (!mapData.isIndoor) {
      const tod    = DG.getTimeOfDay ? DG.getTimeOfDay() : '';
      const season = DG.getSeason    ? DG.getSeason()    : '';
      const todIcon = { MORNING: '🌅', DAY: '☀', EVENING: '🌆', NIGHT: '🌙' }[tod] || '';
      const seaIcon = { SPRING: '🌸', SUMMER: '🌿', AUTUMN: '🍂', WINTER: '❄' }[season] || '';
      ctx.fillStyle = 'rgba(0,0,0,0.55)';
      ctx.fillRect(DG.CANVAS.W - 140, 2, 138, 14);
      ctx.fillStyle = '#aaa';
      ctx.font = '9px monospace';
      ctx.textBaseline = 'top';
      const pt = DG.SaveLoad.formatPlaytime(_gs.player.playtime || 0);
      ctx.fillText(`${todIcon}${seaIcon} ${pt}  👣 ${_gs.player.steps||0}`, DG.CANVAS.W - 138, 4);
    }

    // Surfing indicator
    if (DG.Overworld.isSurfing && DG.Overworld.isSurfing()) {
      ctx.fillStyle = 'rgba(0,80,160,0.7)';
      ctx.fillRect(2, 2, 58, 14);
      ctx.fillStyle = '#6ef';
      ctx.font = 'bold 9px monospace';
      ctx.textBaseline = 'top';
      ctx.fillText('SURFING', 5, 4);
    }

    // Bike indicator
    if (_gs.player.bikeMode) {
      ctx.fillStyle = 'rgba(80,0,160,0.7)';
      ctx.fillRect(2, 2, 58, 14);
      ctx.fillStyle = '#c8f';
      ctx.font = 'bold 9px monospace';
      ctx.textBaseline = 'top';
      ctx.fillText('🚲 BIKE', 5, 4);
    }

    // Repel indicator
    if ((_gs.player.repelSteps || 0) > 0) {
      ctx.fillStyle = 'rgba(0,80,0,0.7)';
      ctx.fillRect(2, 17, 78, 13);
      ctx.fillStyle = '#6f6';
      ctx.font = '9px monospace';
      ctx.textBaseline = 'top';
      ctx.fillText(`REPEL ${_gs.player.repelSteps}`, 5, 18);
    }

    // START=MENU hint (bottom-left, always visible in overworld)
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.fillRect(0, DG.CANVAS.H - 14, 100, 14);
    ctx.fillStyle = '#667788';
    ctx.font = '9px monospace';
    ctx.textBaseline = 'top';
    ctx.fillText('ESC = MENU', 4, DG.CANVAS.H - 12);
  }

  // ── Overworld Weather System ──────────────────────────────────
  function _spawnWxParticle(weather, W, H) {
    const p = { type: weather, life: 1, maxLife: 1, rot: 0 };
    switch (weather) {
      case 'BLIZZARD':
        p.x=Math.random()*W; p.y=-4; p.vx=(Math.random()-0.3)*1.5-1; p.vy=1.2+Math.random()*2;
        p.r=1+Math.random()*2; p.alpha=0.6+Math.random()*0.35; p.shape='snowflake';
        p.maxLife=Math.ceil((H+10)/p.vy); break;
      case 'SANDSTORM':
        p.x=W+4; p.y=Math.random()*H; p.vx=-(3+Math.random()*4); p.vy=(Math.random()-0.5)*0.8;
        p.r=1+Math.random()*1.5; p.alpha=0.3+Math.random()*0.4; p.shape='circle';
        p.maxLife=Math.ceil((W+10)/Math.abs(p.vx)); break;
      case 'ASH_FALL':
        p.x=Math.random()*W; p.y=-3; p.vx=(Math.random()-0.5)*0.8; p.vy=0.6+Math.random()*1.2;
        p.r=1.5+Math.random()*2; p.alpha=0.4+Math.random()*0.3; p.shape='rect';
        p.maxLife=Math.ceil((H+10)/p.vy); break;
      case 'SEA_SPRAY':
        p.x=Math.random()*W; p.y=-2; p.vx=(Math.random()-0.5)*0.5-0.5; p.vy=1.5+Math.random()*2;
        p.r=0.8+Math.random()*1; p.alpha=0.3+Math.random()*0.3; p.shape='circle';
        p.maxLife=Math.ceil((H+4)/p.vy); break;
      case 'LEAVES':
        p.x=Math.random()*W; p.y=-6; p.vx=(Math.random()-0.5)*1.2; p.vy=0.5+Math.random()*1.5;
        p.r=2+Math.random()*2; p.alpha=0.55+Math.random()*0.3; p.rot=Math.random()*Math.PI*2;
        p.shape='leaf'; p.maxLife=Math.ceil((H+10)/p.vy); break;
      case 'WIND_DUST':
        p.x=W+2; p.y=Math.random()*H; p.vx=-(1.5+Math.random()*2.5); p.vy=(Math.random()-0.5)*0.4;
        p.r=0.8+Math.random()*1; p.alpha=0.15+Math.random()*0.25; p.shape='circle';
        p.maxLife=Math.ceil((W+6)/Math.abs(p.vx)); break;
      case 'THUNDERSTORM':
        p.x=Math.random()*W; p.y=-2; p.vx=(Math.random()-0.5)*0.4-0.8; p.vy=3+Math.random()*3;
        p.r=0.6+Math.random()*0.8; p.alpha=0.4+Math.random()*0.3; p.shape='circle';
        p.maxLife=Math.ceil((H+4)/p.vy); break;
      case 'FOG':
        p.x=Math.random()*W; p.y=H*0.3+Math.random()*H*0.7; p.vx=0.2+Math.random()*0.5; p.vy=0;
        p.r=20+Math.random()*40; p.alpha=0.04+Math.random()*0.06; p.shape='circle';
        p.maxLife=120+Math.floor(Math.random()*120); break;
      case 'SUNNY':
        p.x=-20; p.y=Math.random()*H*0.6; p.vx=0.4+Math.random()*0.4; p.vy=0;
        p.r=15+Math.random()*25; p.alpha=0.03+Math.random()*0.04; p.shape='circle';
        p.maxLife=Math.ceil((W+40)/p.vx); break;
      default: return null;
    }
    p.life = p.maxLife;
    return p;
  }

  function _drawWxParticle(ctx, p) {
    const alpha = p.alpha * (p.life / p.maxLife);
    if (alpha <= 0.01) return;
    ctx.save();
    ctx.globalAlpha = alpha;
    switch (p.type) {
      case 'BLIZZARD':
        if (p.shape === 'snowflake') {
          ctx.strokeStyle = '#d8f0ff'; ctx.lineWidth = 0.8;
          ctx.translate(p.x, p.y);
          for (let a=0;a<6;a++) {
            ctx.save(); ctx.rotate(a*Math.PI/3);
            ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(0,-p.r*3); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(0,-p.r*1.5); ctx.lineTo(p.r*0.7,-p.r*2.2); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(0,-p.r*1.5); ctx.lineTo(-p.r*0.7,-p.r*2.2); ctx.stroke();
            ctx.restore();
          }
        } else {
          ctx.fillStyle='#c8e8ff'; ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
        }
        break;
      case 'SANDSTORM': case 'WIND_DUST':
        ctx.fillStyle= p.type==='SANDSTORM' ? '#c8a040' : '#b09870';
        ctx.beginPath(); ctx.ellipse(p.x,p.y,p.r*2,p.r,0,0,Math.PI*2); ctx.fill(); break;
      case 'ASH_FALL':
        ctx.fillStyle='#908880';
        ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.rot || 0.3);
        ctx.fillRect(-p.r,-p.r*0.5,p.r*2,p.r); ctx.restore(); break;
      case 'SEA_SPRAY': case 'THUNDERSTORM':
        ctx.fillStyle= p.type==='SEA_SPRAY'?'rgba(120,180,220,0.7)':'rgba(160,180,220,0.7)';
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill(); break;
      case 'LEAVES':
        ctx.fillStyle='#4a8020';
        ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.rot);
        ctx.beginPath(); ctx.ellipse(0,0,p.r,p.r*0.5,0,0,Math.PI*2); ctx.fill(); ctx.restore(); break;
      case 'FOG': case 'SUNNY':
        ctx.fillStyle= p.type==='FOG'?'rgba(180,220,180,1)':'rgba(255,220,100,1)';
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill(); break;
    }
    ctx.restore();
  }

  // Max particles per weather type
  const _WX_MAX = { BLIZZARD:60, SANDSTORM:80, ASH_FALL:40, SEA_SPRAY:50,
    LEAVES:30, WIND_DUST:50, THUNDERSTORM:70, FOG:12, SUNNY:8 };
  // Spawn rate (particles per frame, approx)
  const _WX_RATE = { BLIZZARD:1.5, SANDSTORM:2, ASH_FALL:0.8, SEA_SPRAY:1.2,
    LEAVES:0.4, WIND_DUST:1, THUNDERSTORM:2, FOG:0.08, SUNNY:0.05 };

  // ── FASE 11: wolkschaduwen — grote zachte vlekken die overdag overdrijven ──
  function _drawCloudShadows(ctx, W, H) {
    const nf = (typeof DG.getNightFactor === 'function') ? (DG.getNightFactor() || 0) : 0;
    if (nf > 0.35) return; // alleen overdag/schemering
    const t = Date.now() / 16.7;
    ctx.save();
    ctx.fillStyle = 'rgba(8,16,36,0.07)';
    for (let i = 0; i < 2; i++) {
      const cx = ((t * (0.16 + i * 0.06) + i * 320) % (W + 280)) - 140;
      const cy = 50 + i * 140 + Math.sin(t * 0.003 + i * 2) * 24;
      ctx.beginPath();
      ctx.ellipse(cx, cy, 110, 58, 0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(cx + 60, cy + 26, 70, 40, -0.2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // ── FASE 11: vuurvliegjes — dwalende gloeipuntjes, alleen 's nachts ──
  function _drawFireflies(ctx, W, H) {
    const nf = (typeof DG.getNightFactor === 'function') ? (DG.getNightFactor() || 0) : 0;
    if (nf < 0.5) return;
    const vis = Math.min(1, (nf - 0.5) * 3);
    const t = Date.now() / 16.7;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 7; i++) {
      const fx = (Math.sin(t * 0.011 + i * 2.3) * 0.5 + 0.5) * W;
      const fy = (Math.sin(t * 0.008 + i * 4.1 + 1.3) * 0.5 + 0.5) * (H - 70) + 25;
      const pulse = Math.max(0, Math.sin(t * 0.045 + i * 1.7));
      if (pulse < 0.15) continue;
      ctx.globalAlpha = pulse * vis * 0.9;
      const g = ctx.createRadialGradient(fx, fy, 0, fx, fy, 5);
      g.addColorStop(0, 'rgba(255,248,160,0.9)');
      g.addColorStop(1, 'rgba(255,240,140,0)');
      ctx.fillStyle = g;
      ctx.fillRect(fx - 5, fy - 5, 10, 10);
      ctx.fillStyle = '#fffce0';
      ctx.fillRect(fx - 1, fy - 1, 2, 2);
    }
    ctx.restore();
  }

  function _drawOverworldWeather(ctx, W, H) {
    const weather = window.DG_MAP_WEATHER;
    if (!weather) { _wxParticles = []; return; }
    const mapData = DG.Overworld ? DG.Overworld.getMapData() : null;
    if (mapData && mapData.isIndoor) { _wxParticles = []; return; }

    // Reset particle pool when weather changes
    if (weather !== _wxLastTheme) { _wxParticles = []; _wxLastTheme = weather; }

    // Spawn new particles
    const maxP = _WX_MAX[weather] || 30;
    const rate  = _WX_RATE[weather] || 0.5;
    if (_wxParticles.length < maxP && Math.random() < rate) {
      const np = _spawnWxParticle(weather, W, H);
      if (np) _wxParticles.push(np);
    }

    // Update + draw
    for (let i = _wxParticles.length - 1; i >= 0; i--) {
      const p = _wxParticles[i];
      p.x += p.vx; p.y += p.vy;
      if (p.shape === 'leaf') p.rot += 0.04;
      p.life--;
      if (p.life <= 0) { _wxParticles.splice(i, 1); continue; }
      _drawWxParticle(ctx, p);
    }

    // THUNDERSTORM: random lightning flash
    if (weather === 'THUNDERSTORM') {
      if (_wxThunder > 0) {
        _wxThunder--;
        ctx.fillStyle = `rgba(255,255,200,${0.15 * (_wxThunder / 8)})`;
        ctx.fillRect(0, 0, W, H);
      } else if (Math.random() < 0.003) {
        _wxThunder = 8;
      }
    }

    // SANDSTORM: orange tint overlay
    if (weather === 'SANDSTORM') {
      ctx.fillStyle = 'rgba(160,100,20,0.12)';
      ctx.fillRect(0, 0, W, H);
    }
    // ASH_FALL: grey tint
    if (weather === 'ASH_FALL') {
      ctx.fillStyle = 'rgba(60,50,40,0.1)';
      ctx.fillRect(0, 0, W, H);
    }
    // FOG: band across lower screen
    if (weather === 'FOG') {
      ctx.fillStyle = 'rgba(160,200,160,0.15)';
      ctx.fillRect(0, H * 0.5, W, H * 0.5);
    }
    // BLIZZARD: blue tint
    if (weather === 'BLIZZARD') {
      ctx.fillStyle = 'rgba(100,140,200,0.08)';
      ctx.fillRect(0, 0, W, H);
    }
  }

  // ── Day/Night + Season overlay ────────────────────────────
  function _drawDayNightOverlay(ctx) {
    const tod    = DG.getTimeOfDay ? DG.getTimeOfDay() : null;
    const season = DG.getSeason    ? DG.getSeason()    : null;
    const W = DG.CANVAS.W, H = DG.CANVAS.H;

    // ── Smooth night overlay using getNightFactor ─────────────
    const nightFactor = DG.getNightFactor ? DG.getNightFactor() : 0;
    if (nightFactor > 0) {
      const nightAlpha = nightFactor * 0.42; // softer night so towns stay readable
      ctx.fillStyle = `rgba(22, 20, 52, ${nightAlpha})`; // a touch warmer/less icy-blue
      ctx.fillRect(0, 0, W, H);

      // ── Animated star field at night ─────────────────────────
      if (nightFactor > 0.45) {
        const starAlpha = Math.min(1, (nightFactor - 0.45) / 0.3);
        // 40 deterministic stars with per-star twinkling
        const tBase = Date.now() / 1000;
        for (let si = 0; si < 40; si++) {
          const sx       = ((si * 137 + 53) % 97) / 97 * W;
          const sy       = ((si * 89  + 17) % 97) / 97 * (H * 0.6); // top 60% only
          const twinkle  = 0.45 + 0.55 * Math.abs(Math.sin(tBase * (0.6 + (si % 5) * 0.22) + si));
          const sr       = 0.6 + (si % 4) * 0.35;
          const bright   = si % 7 === 0; // larger bright stars
          ctx.save();
          ctx.globalAlpha = starAlpha * twinkle * 0.92;
          // Occasional cross-sparkle on bright stars
          if (bright) {
            ctx.strokeStyle = `rgba(255,255,200,${starAlpha * twinkle * 0.6})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath(); ctx.moveTo(sx - sr*2.5, sy); ctx.lineTo(sx + sr*2.5, sy); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(sx, sy - sr*2.5); ctx.lineTo(sx, sy + sr*2.5); ctx.stroke();
          }
          ctx.fillStyle = si % 6 === 0 ? 'rgba(200,220,255,1)' : 'rgba(255,255,230,1)';
          ctx.beginPath(); ctx.arc(sx, sy, bright ? sr * 1.4 : sr, 0, Math.PI * 2); ctx.fill();
          ctx.restore();
        }
      }

      // ── Moon in top-right at night ────────────────────────────
      if (nightFactor > 0.6) {
        const moonAlpha = Math.min(1, (nightFactor - 0.6) / 0.25);
        const moonX = W - 30, moonY = 20;
        ctx.save(); ctx.globalAlpha = moonAlpha * 0.9;
        // Halo glow
        const mg = ctx.createRadialGradient(moonX,moonY,3,moonX,moonY,20);
        mg.addColorStop(0,'rgba(180,200,255,0.3)'); mg.addColorStop(1,'rgba(100,130,255,0)');
        ctx.fillStyle = mg; ctx.fillRect(moonX-22,moonY-22,44,44);
        // Moon disc
        ctx.fillStyle = '#C8D8F0';
        ctx.beginPath(); ctx.arc(moonX, moonY, 9, 0, Math.PI*2); ctx.fill();
        // Crescent (cut out)
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = 'rgba(255,255,255,1)';
        ctx.beginPath(); ctx.arc(moonX+3, moonY-2, 7, 0, Math.PI*2); ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
        ctx.restore();
      }

      // ── Sun in top-right during the day ──────────────────────
      if (nightFactor < 0.3) {
        const sunAlpha = Math.max(0, 1 - nightFactor * 3.0) * 0.85;
        const sunX = W - 28, sunY = 18;
        ctx.save(); ctx.globalAlpha = sunAlpha;
        const sg = ctx.createRadialGradient(sunX,sunY,3,sunX,sunY,20);
        sg.addColorStop(0,'rgba(255,235,80,0.45)'); sg.addColorStop(1,'rgba(255,180,0,0)');
        ctx.fillStyle = sg; ctx.fillRect(sunX-22,sunY-22,44,44);
        ctx.fillStyle = '#FFE040';
        ctx.beginPath(); ctx.arc(sunX, sunY, 9, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#FFF4A0';
        ctx.beginPath(); ctx.arc(sunX-2, sunY-2, 4, 0, Math.PI*2); ctx.fill();
        ctx.restore();
      }
    }

    // ── Discrete time-of-day warm tint (morning/evening) ─────
    // These layer on top of the smooth night overlay for color richness.
    // NIGHT already handled by nightFactor above; MORNING and EVENING add warm tone.
    let tintColor = null;
    let tintAlpha = 0;
    if (tod === 'EVENING') {
      tintColor = '255,100,20';  tintAlpha = 0.18;
    } else if (tod === 'MORNING') {
      tintColor = '255,150,50';  tintAlpha = 0.08;
    }

    if (tintColor && tintAlpha > 0) {
      ctx.fillStyle = `rgba(${tintColor},${tintAlpha})`;
      ctx.fillRect(0, 0, W, H);
    }

    // ── Season modifier on top ───────────────────────────────
    let seaTint = null, seaAlpha = 0;
    if (season === 'WINTER') {
      seaTint = '180,220,255'; seaAlpha = 0.08;
    } else if (season === 'AUTUMN') {
      seaTint = '200,100,20';  seaAlpha = 0.06;
    } else if (season === 'SPRING') {
      seaTint = '255,200,230'; seaAlpha = 0.04;
    }
    if (seaTint && seaAlpha > 0) {
      ctx.fillStyle = `rgba(${seaTint},${seaAlpha})`;
      ctx.fillRect(0, 0, W, H);
    }

    // ── Time-of-day indicator (top-left corner) ──────────────
    _drawTimeIndicator(ctx, tod, nightFactor);
  }

  // ── Small time-of-day circle indicator (top-left) ─────────
  function _drawTimeIndicator(ctx, tod, nightFactor) {
    // Circle color by time
    const circleColors = {
      MORNING: '#ff9900',
      DAY:     '#ffe066',
      EVENING: '#ff6622',
      NIGHT:   '#1a2860',
    };
    const abbrevs = {
      MORNING: 'MRN',
      DAY:     'DAY',
      EVENING: 'EVN',
      NIGHT:   'NGT',
    };
    const col    = (tod && circleColors[tod]) || '#ffe066';
    const abbrev = (tod && abbrevs[tod])      || 'DAY';

    const cx = 12, cy = 12, r = 8;

    // Background pill
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(2, 2, 44, 20, 4);
    else ctx.rect(2, 2, 44, 20);
    ctx.fill();

    // Circle
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    // Glow ring at night
    if (nightFactor > 0.3) {
      ctx.strokeStyle = `rgba(100,130,255,${nightFactor * 0.7})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, r + 1.5, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Abbreviation text
    ctx.fillStyle = nightFactor > 0.5 ? '#aaccff' : '#ffffff';
    ctx.font = 'bold 8px monospace';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    ctx.fillText(abbrev, cx + r + 3, cy);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
  }

  // ── Battle ────────────────────────────────────────────────
  function _drawBattle(ctx) {
    const battle = DG.Battle.getBattle();
    if (!battle) return;

    // ── 2v2 Double Battle ──────────────────────────────────────
    if (battle.isDouble) {
      _drawDoubleBattle(ctx);
      return;
    }

    // Trainer VS intro screen
    if (battle.introPhase === 'TRAINER_INTRO') {
      _drawTrainerIntro(ctx, battle);
      return;
    }

    // Gather animation offsets + screen shake
    const BA   = (typeof DG.BattleAnim !== 'undefined') ? DG.BattleAnim : null;
    const pOff = BA ? BA.getMonOffset('PLAYER') : { x: 0, y: 0 };
    const eOff = BA ? BA.getMonOffset('ENEMY')  : { x: 0, y: 0 };
    const sh   = BA ? BA.getShake()             : { x: 0, y: 0 };

    // Draw battle scene + animation effects (all shifted by screen shake)
    ctx.save();
    ctx.translate(sh.x, sh.y);
    // FASE 1: camera zoom-punch bij crits/super-effective/KO
    const cam = (BA && BA.getCamera) ? BA.getCamera() : null;
    if (cam && cam.zoom > 1.001) {
      ctx.translate(cam.x, cam.y);
      ctx.scale(cam.zoom, cam.zoom);
      ctx.translate(-cam.x, -cam.y);
    }
    DG.SpriteRenderer.drawBattleScene(ctx, battle.playerMon, battle.enemyMon, _animOff, pOff, eOff);
    if (BA) BA.draw(ctx);
    if (BA && BA.drawDamageNumbers) BA.drawDamageNumbers(ctx);

    // Level-up golden flash
    if (_levelUpFlash > 0) {
      ctx.globalAlpha = _levelUpFlash * 0.5;
      ctx.fillStyle = '#ffdd44';
      ctx.fillRect(0, 0, DG.CANVAS.W, DG.CANVAS.H);
      ctx.globalAlpha = 1;
      _levelUpFlash = Math.max(0, _levelUpFlash - 0.045);
    }
    ctx.restore();

    // Store cursor ref for spriteRenderer
    battle._moveCursor = _moveCursor;

    DG.SpriteRenderer.drawBattleHUD(ctx, battle);
    _drawPartyBalls(ctx, battle);
    _drawBattleWeather(ctx, battle);
    _drawStatStages(ctx, battle);

    // Message box for pending battle text
    const msg = DG.Battle.currentMessage();
    if (msg) {
      _drawBattleMessage(ctx, msg);
    }

    // FASE 4: cinematische letterbox + signature-banner over HUD & dialoog heen
    if (BA && BA.drawCinematics) BA.drawCinematics(ctx);

    // Bag overlay (full-screen)
    if (_battleUIMode === 'BAG') {
      DG.BagMenu.draw(ctx);
      return;
    }

    // Party switch overlay (full-screen)
    if (_battleUIMode === 'PARTY') {
      DG.PartyMenu.draw(ctx);
      return;
    }

    // Learn Move UI overlay
    if (DG.Battle.getState && DG.Battle.getState() === DG.Battle.BS.LEARN_MOVE) {
      _drawLearnMoveUI(ctx, DG.Battle.getBattle());
      return;
    }

    // Battle main action menu
    if (DG.Battle.getState() === DG.Battle.BS.PLAYER_INPUT && !msg) {
      if (_battleUIMode === 'MAIN') {
        _drawBattleMainMenu(ctx);
      }
    }
  }

  // ── 2v2 DOUBLE BATTLE DRAW ───────────────────────────────
  function _drawDoubleBattle(ctx) {
    const battle = DG.Battle.getBattle();
    if (!battle) return;
    const W = DG.CANVAS.W, H = DG.CANVAS.H;

    // Trainer VS intro screen reuse
    if (battle.introPhase === 'TRAINER_INTRO') {
      _drawTrainerIntro(ctx, battle);
      return;
    }

    // Sky gradient
    const sky = ctx.createLinearGradient(0, 0, 0, H * 0.55);
    sky.addColorStop(0, '#3a2a5e');
    sky.addColorStop(1, '#6a4a8e');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H * 0.55);
    // Ground (swampy)
    ctx.fillStyle = '#2a3a1a';
    ctx.fillRect(0, H * 0.55, W, H * 0.45);
    // Dividing line
    ctx.strokeStyle = '#5a4a2a';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, H * 0.55); ctx.lineTo(W, H * 0.55); ctx.stroke();
    // "DOUBLE BATTLE" banner
    ctx.fillStyle = 'rgba(200,50,50,0.85)';
    ctx.fillRect(W/2 - 55, 2, 110, 13);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    ctx.fillText('DOUBLE BATTLE', W/2, 4);
    ctx.textAlign = 'left';

    // Enemy 1 (Flint) — top-left
    const e1x = W * 0.18, e1y = H * 0.16;
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.beginPath(); ctx.ellipse(e1x + 16, e1y + 38, 20, 6, 0, 0, Math.PI*2); ctx.fill();
    if (battle.enemyMon && battle.enemyMon.hp.current > 0) {
      if (battle.enemyMon.isShiny) ctx.filter = 'hue-rotate(180deg) saturate(2)';
      DG.SpriteRenderer.drawMon(ctx, battle.enemyMon.speciesId, e1x, e1y, 1.6);
      if (battle.enemyMon.isShiny) ctx.filter = 'none';
    }

    // Enemy 2 (Cretaceous) — top-right
    const e2x = W * 0.56, e2y = H * 0.10;
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.beginPath(); ctx.ellipse(e2x + 16, e2y + 38, 20, 6, 0, 0, Math.PI*2); ctx.fill();
    if (battle.enemy2Mon && battle.enemy2Mon.hp.current > 0) {
      if (battle.enemy2Mon.isShiny) ctx.filter = 'hue-rotate(180deg) saturate(2)';
      DG.SpriteRenderer.drawMon(ctx, battle.enemy2Mon.speciesId, e2x, e2y, 1.6);
      if (battle.enemy2Mon.isShiny) ctx.filter = 'none';
    }

    // Player mon — bottom-left
    const ppx = W * 0.04, ppy = H * 0.40;
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.beginPath(); ctx.ellipse(ppx + 32, ppy + 58, 28, 8, 0, 0, Math.PI*2); ctx.fill();
    if (battle.playerMon && battle.playerMon.hp.current > 0) {
      if (battle.playerMon.isShiny) ctx.filter = 'hue-rotate(180deg) saturate(2)';
      DG.SpriteRenderer.drawMon(ctx, battle.playerMon.speciesId, ppx, ppy, 2.2);
      if (battle.playerMon.isShiny) ctx.filter = 'none';
    }

    // Ally mon (Morax) — bottom-right
    const apx = W * 0.50, apy = H * 0.44;
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.beginPath(); ctx.ellipse(apx + 32, apy + 58, 28, 8, 0, 0, Math.PI*2); ctx.fill();
    if (battle.allyMon && battle.allyMon.hp.current > 0) {
      if (battle.allyMon.isShiny) ctx.filter = 'hue-rotate(180deg) saturate(2)';
      DG.SpriteRenderer.drawMon(ctx, battle.allyMon.speciesId, apx, apy, 2.2);
      if (battle.allyMon.isShiny) ctx.filter = 'none';
    }

    // Target cursor (yellow triangle above target)
    if (DG.Battle.getState() === DG.Battle.BS.PLAYER_INPUT) {
      const tgt = battle.doubleTarget || 'ENEMY1';
      const tx = tgt === 'ENEMY1' ? e1x + 16 : e2x + 16;
      const ty = tgt === 'ENEMY1' ? e1y - 6   : e2y - 6;
      ctx.fillStyle = 'rgba(255,220,0,0.9)';
      ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(tx-7, ty-10); ctx.lineTo(tx+7, ty-10); ctx.closePath(); ctx.fill();
    }

    // 4-panel HUD
    const dHP = DG.Battle.getDoubleHPDisplays ? DG.Battle.getDoubleHPDisplays() : {};
    const sHP = DG.Battle.getHPDisplays ? DG.Battle.getHPDisplays() : {};
    _drawDoubleHUD(ctx, battle, sHP, dHP);

    // Party balls
    _drawPartyBalls(ctx, battle);

    // Message box
    const msg = DG.Battle.currentMessage();
    if (msg) { _drawBattleMessage(ctx, msg); return; }

    // Battle menu
    if (DG.Battle.getState() === DG.Battle.BS.PLAYER_INPUT) {
      _drawDoubleBattleMenu(ctx, battle);
    }
  }

  function _drawDoubleHUD(ctx, battle, sHP, dHP) {
    const W = DG.CANVAS.W, H = DG.CANVAS.H;
    const hudW = 112;

    function drawMiniHPBar(x, y, w, mon, hpDisplay, nameRight) {
      if (!mon) return;
      const boxH = 28;
      // Box background
      ctx.fillStyle = 'rgba(10,10,20,0.82)';
      ctx.beginPath();
      ctx.rect(x, y, w, boxH);
      ctx.fill();
      ctx.strokeStyle = '#4a3a5a';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, w, boxH);

      // Name
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 7px monospace';
      ctx.textBaseline = 'top';
      ctx.textAlign = nameRight ? 'right' : 'left';
      const dispName = (mon.nickname || mon.speciesId || '???').slice(0, 10);
      ctx.fillText(dispName, nameRight ? x+w-3 : x+3, y+2);
      ctx.textAlign = 'left';

      // Level
      ctx.fillStyle = '#aaa';
      ctx.font = '7px monospace';
      ctx.textAlign = nameRight ? 'left' : 'right';
      ctx.fillText(`Lv${mon.level}`, nameRight ? x+3 : x+w-3, y+2);
      ctx.textAlign = 'left';

      // HP bar
      const cur  = Math.max(0, Math.ceil(hpDisplay !== null && hpDisplay !== undefined ? hpDisplay : mon.hp.current));
      const pct  = Math.max(0, Math.min(1, cur / mon.hp.max));
      const barW = w - 6;
      const barX = x + 3, barY = y + 13;
      ctx.fillStyle = '#222';
      ctx.fillRect(barX, barY, barW, 5);
      ctx.fillStyle = pct > 0.5 ? '#44ee44' : pct > 0.25 ? '#eedd44' : '#ee4444';
      ctx.fillRect(barX, barY, Math.round(barW * pct), 5);
      ctx.strokeStyle = '#555'; ctx.lineWidth = 0.5;
      ctx.strokeRect(barX, barY, barW, 5);

      // HP text
      ctx.fillStyle = '#ccc';
      ctx.font = '6px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`${cur}/${mon.hp.max}`, x+w-3, y+21);
      ctx.textAlign = 'left';

      // Status badge
      if (mon.statusEffect && mon.statusEffect !== 'NONE') {
        const scol = { BURN:'#ff6622', POISON:'#aa44cc', PARALYSIS:'#ddcc00',
                       SLEEP:'#8899bb', FREEZE:'#44ccee', BADPOISON:'#883399' };
        ctx.fillStyle = scol[mon.statusEffect] || '#999';
        ctx.font = '6px monospace';
        ctx.fillText(mon.statusEffect.slice(0,3), x+3, y+21);
      }
    }

    // Top-left: Enemy 1 (Flint)
    drawMiniHPBar(2, 16, hudW, battle.enemyMon, sHP.enemy, false);
    // Top-right: Enemy 2 (Cretaceous)
    drawMiniHPBar(W - hudW - 2, 16, hudW, battle.enemy2Mon, dHP.enemy2, true);
    // Bottom-left: Player mon
    drawMiniHPBar(2, H - 52, hudW, battle.playerMon, sHP.player, false);
    // Bottom-right: Ally (Morax)
    drawMiniHPBar(W - hudW - 2, H - 52, hudW, battle.allyMon, dHP.ally, true);
  }

  function _drawDoubleBattleMenu(ctx, battle) {
    const W = DG.CANVAS.W, H = DG.CANVAS.H;
    const menuH = 44;
    const menuY = H - menuH;

    ctx.fillStyle = 'rgba(10,10,20,0.88)';
    ctx.fillRect(0, menuY, W, menuH);
    ctx.strokeStyle = '#4a3a5a'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, menuY); ctx.lineTo(W, menuY); ctx.stroke();

    if (_battleUIMode === 'MOVE') {
      // Move list
      const mon = battle.playerMon;
      if (!mon) return;
      const moves = mon.moves || [];
      ctx.font = '8px monospace';
      for (let i = 0; i < 4; i++) {
        const mv = moves[i];
        const mx = (i % 2) * (W/2) + 4;
        const my = menuY + 4 + Math.floor(i/2) * 18;
        const isSel = (i === _moveCursor);
        ctx.fillStyle = isSel ? '#ffe050' : (mv ? '#ddd' : '#555');
        if (mv) {
          const moveData = DG.MOVES[mv.moveId];
          const ppTxt = `${mv.ppCurrent}/${mv.ppMax}`;
          ctx.fillText(`${moveData ? moveData.name : mv.moveId} ${ppTxt}`, mx, my + 10);
          if (moveData) {
            ctx.fillStyle = isSel ? '#ffcc00' : '#888';
            ctx.font = '7px monospace';
            ctx.fillText(moveData.type, mx, my + 18);
            ctx.font = '8px monospace';
          }
        } else {
          ctx.fillText('---', mx, my + 10);
        }
        if (isSel) {
          ctx.strokeStyle = '#ffe050'; ctx.lineWidth = 1;
          ctx.strokeRect(mx - 2, my, W/2 - 6, 18);
        }
      }
      // Target indicator
      const tgt = battle.doubleTarget || 'ENEMY1';
      ctx.fillStyle = '#ffe050';
      ctx.font = 'bold 7px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`> ${tgt === 'ENEMY1' ? 'Flint' : 'Cretaceous'} [L/R]`, W - 3, menuY + 12);
      ctx.textAlign = 'left';
      // Back hint
      ctx.fillStyle = '#888';
      ctx.font = '7px monospace';
      ctx.fillText('[B] Back', 4, menuY + 38);
    } else {
      // Main menu: FIGHT / DINOM only (no BAG/RUN in story double)
      const opts = ['FIGHT', 'DINOM'];
      const btnW = W / opts.length;
      opts.forEach((opt, i) => {
        const bx = i * btnW;
        const isSel = (i === _battleMainCursor % opts.length);
        ctx.fillStyle = isSel ? 'rgba(255,220,0,0.2)' : 'rgba(255,255,255,0.05)';
        ctx.fillRect(bx + 2, menuY + 2, btnW - 4, menuH - 4);
        if (isSel) { ctx.strokeStyle = '#ffe050'; ctx.lineWidth = 1.5; ctx.strokeRect(bx+2, menuY+2, btnW-4, menuH-4); }
        ctx.fillStyle = isSel ? '#ffe050' : '#ccc';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(opt, bx + btnW/2, menuY + menuH/2);
        ctx.textAlign = 'left'; ctx.textBaseline = 'top';
      });
      // Ally indicator
      ctx.fillStyle = '#88cc88';
      ctx.font = '7px monospace';
      ctx.textBaseline = 'top';
      ctx.textAlign = 'right';
      ctx.fillText(`Ally: ${battle.allyTrainer ? battle.allyTrainer.name : 'Morax'}`, W-3, menuY+3);
      ctx.textAlign = 'left';
    }
  }

  // ── Weather Indicator + Battle Particles ─────────────────────
  // Battle weather particle pool (separate from overworld)
  let _bwParticles = [];
  let _bwLastWeather = null;
  let _bwThunder = 0;

  function _drawBattleWeather(ctx, battle) {
    const W = DG.CANVAS.W, H = DG.CANVAS.H;
    const weather = battle ? battle.weather : null;

    // Draw weather particle overlay behind HUD
    if (weather) {
      // Reset pool on weather change
      if (weather !== _bwLastWeather) { _bwParticles = []; _bwLastWeather = weather; }
      const maxP = Math.floor((_WX_MAX[weather] || 30) * 0.6);
      const rate  = (_WX_RATE[weather] || 0.5) * 0.7;
      if (_bwParticles.length < maxP && Math.random() < rate) {
        const np = _spawnWxParticle(weather, W, H);
        if (np) { np.y = Math.min(np.y, H * 0.6); _bwParticles.push(np); }
      }
      for (let i = _bwParticles.length - 1; i >= 0; i--) {
        const p = _bwParticles[i];
        p.x += p.vx * 0.8; p.y += p.vy * 0.8;
        if (p.shape === 'leaf') p.rot += 0.04;
        p.life--;
        if (p.life <= 0) { _bwParticles.splice(i, 1); continue; }
        _drawWxParticle(ctx, p);
      }
      // Full-screen tint for immersion
      const _btints = {
        SANDSTORM:'rgba(140,90,10,0.10)', ASH_FALL:'rgba(50,40,30,0.12)',
        BLIZZARD:'rgba(80,120,180,0.08)', THUNDERSTORM:'rgba(20,20,60,0.10)',
        FOG:'rgba(80,100,80,0.18)',
      };
      if (_btints[weather]) { ctx.fillStyle=_btints[weather]; ctx.fillRect(0,0,W,H); }
      // Thunder flash in battle
      if (weather==='THUNDERSTORM') {
        if (_bwThunder>0) { _bwThunder--; ctx.fillStyle=`rgba(255,255,200,${0.2*(_bwThunder/10)})`; ctx.fillRect(0,0,W,H); }
        else if (Math.random()<0.004) _bwThunder=10;
      }
    } else {
      _bwParticles = []; _bwLastWeather = null;
    }

    // Weather label banner (top-center)
    if (!weather) return;
    const wfx = DG.WEATHER_EFFECTS ? DG.WEATHER_EFFECTS[weather] : null;
    if (!wfx) return;
    const tw = 100, th = 14;
    const wx = W / 2 - tw / 2, wy = 2;
    ctx.fillStyle = wfx.bg || '#1a1a2e';
    ctx.fillRect(wx, wy, tw, th);
    ctx.strokeStyle = wfx.border || '#888888';
    ctx.lineWidth = 1;
    ctx.strokeRect(wx, wy, tw, th);
    ctx.fillStyle = wfx.border || '#cccccc';
    ctx.font = '9px monospace';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'center';
    ctx.fillText(wfx.label || weather, W / 2, wy + 2);
    ctx.textAlign = 'left';
  }

  // ── Stat Stage Boost Indicators ───────────────────────────
  function _drawStatStages(ctx, battle) {
    if (!battle) return;
    const W = DG.CANVAS.W, H = DG.CANVAS.H;

    function stageLabel(val) {
      if (val === 0) return null;
      const abs = Math.abs(val);
      const arrow = val > 0 ? '▲' : '▼';
      const col   = val > 0 ? '#88ff88' : '#ff8888';
      return { text: arrow.repeat(Math.min(abs, 3)), col };
    }

    // Draw stages for enemy (top area, right side)
    const eStages = battle.enemyStages || {};
    const eEntries = Object.entries(eStages).filter(([, v]) => v !== 0);
    if (eEntries.length > 0) {
      const ex = W - 2, ey = 20;
      ctx.font = '8px monospace';
      ctx.textBaseline = 'top';
      ctx.textAlign = 'right';
      eEntries.slice(0, 4).forEach(([stat, val], i) => {
        const lbl = stageLabel(val);
        if (!lbl) return;
        ctx.fillStyle = lbl.col;
        const shortStat = { atk:'ATK', def:'DEF', spAtk:'SPA', spDef:'SPD', spd:'SPE', acc:'ACC', eva:'EVA' }[stat] || stat;
        ctx.fillText(`${shortStat}${lbl.text}`, ex, ey + i * 10);
      });
      ctx.textAlign = 'left';
    }

    // Draw stages for player (HUD area, left side)
    const pStages = battle.playerStages || {};
    const pEntries = Object.entries(pStages).filter(([, v]) => v !== 0);
    if (pEntries.length > 0) {
      const px = W - 200, py = Math.floor(H * 0.56) + 2;
      ctx.font = '8px monospace';
      ctx.textBaseline = 'top';
      ctx.textAlign = 'left';
      pEntries.slice(0, 4).forEach(([stat, val], i) => {
        const lbl = stageLabel(val);
        if (!lbl) return;
        ctx.fillStyle = lbl.col;
        const shortStat = { atk:'ATK', def:'DEF', spAtk:'SPA', spDef:'SPD', spd:'SPE', acc:'ACC', eva:'EVA' }[stat] || stat;
        ctx.fillText(`${shortStat}${lbl.text}`, px, py + i * 10);
      });
    }
  }

  function _drawBattleMessage(ctx, msg) {
    const W = DG.CANVAS.W, H = DG.CANVAS.H;
    const by = H - 52;
    const grad = ctx.createLinearGradient(0, by, 0, H);
    grad.addColorStop(0, 'rgba(14,20,54,0.97)');
    grad.addColorStop(1, 'rgba(6,10,30,0.97)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, by, W, 52);
    ctx.strokeStyle = '#5a9fd4';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, by); ctx.lineTo(W, by);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(150,210,255,0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, by + 1); ctx.lineTo(W, by + 1);
    ctx.stroke();
    // Shadow
    ctx.fillStyle = 'rgba(0,0,60,0.6)';
    ctx.font = '13px monospace';
    ctx.textBaseline = 'top';
    ctx.fillText(msg, 11, by + 10 + 1);
    // Text
    ctx.fillStyle = '#f0f8ff';
    ctx.fillText(msg, 10, by + 10);
  }

  function _drawBattleMainMenu(ctx) {
    const W = DG.CANVAS.W, H = DG.CANVAS.H;
    const opts = BATTLE_MAIN_OPTIONS;
    const bx = W - 184, by = H - 76;
    const bw = 184, bh = 76;

    // Background
    const grad = ctx.createLinearGradient(bx, by, bx, by + bh);
    grad.addColorStop(0, 'rgba(14,20,54,0.97)');
    grad.addColorStop(1, 'rgba(6,10,30,0.97)');
    ctx.fillStyle = grad;
    _roundRectMenu(ctx, bx, by, bw, bh, 6);
    ctx.fill();
    ctx.strokeStyle = '#5a9fd4';
    ctx.lineWidth = 1.5;
    _roundRectMenu(ctx, bx, by, bw, bh, 6);
    ctx.stroke();

    // Left separator (between msg area and menu)
    ctx.strokeStyle = 'rgba(90,159,212,0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(bx, by); ctx.lineTo(bx, by + bh);
    ctx.stroke();

    opts.forEach((opt, i) => {
      const col = i % 2, row = Math.floor(i / 2);
      const x = bx + 10 + col * 88, y = by + 10 + row * 32;
      const isSel = (i === _battleMainCursor);

      if (isSel) {
        ctx.fillStyle = 'rgba(30,60,120,0.8)';
        _roundRectMenu(ctx, x - 6, y - 4, 84, 26, 4);
        ctx.fill();
        ctx.strokeStyle = '#8abcff';
        ctx.lineWidth = 1;
        _roundRectMenu(ctx, x - 6, y - 4, 84, 26, 4);
        ctx.stroke();
      }

      ctx.fillStyle = isSel ? '#FFE050' : '#ddeeff';
      ctx.font = `${isSel ? 'bold ' : ''}13px monospace`;
      ctx.textBaseline = 'top';
      ctx.fillText((isSel ? '▶' : ' ') + ' ' + opt, x, y);
    });
  }

  function _drawPartyBalls(ctx, battle) {
    if (!battle) return;
    const W = DG.CANVAS.W;
    const playerParty = battle.playerParty || [];
    const enemyParty  = battle.enemyParty  || [];

    // Enemy balls — top right (small, 6 slots)
    for (let i = 0; i < 6; i++) {
      const mon = enemyParty[i];
      const cx = W - 12 - (5 - i) * 13;
      const cy = 8;
      const r = 4;
      if (mon && mon.hp && mon.hp.current > 0) {
        ctx.fillStyle = '#dd3322';        // alive = red
      } else if (mon) {
        ctx.fillStyle = '#3a3a3a';        // fainted = dark
      } else {
        ctx.fillStyle = '#222222';        // empty slot
      }
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      // Outline
      ctx.strokeStyle = (mon && mon.hp && mon.hp.current > 0) ? '#ff6655' : '#444444';
      ctx.lineWidth = 1;
      ctx.stroke();
      // Shine on alive balls
      if (mon && mon.hp && mon.hp.current > 0) {
        ctx.fillStyle = 'rgba(255,255,255,0.45)';
        ctx.beginPath();
        ctx.arc(cx - 1, cy - 1, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Player balls — left of player HUD area, above message box
    const hudY = DG.CANVAS.H - 100; // just above the HUD
    for (let i = 0; i < 6; i++) {
      const mon = playerParty[i];
      const cx = 10 + i * 14;
      const cy = hudY;
      const r = 4;
      if (mon && mon.hp && mon.hp.current > 0) {
        ctx.fillStyle = '#2255dd';
      } else if (mon) {
        ctx.fillStyle = '#3a3a3a';
      } else {
        ctx.fillStyle = '#222222';
      }
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = (mon && mon.hp && mon.hp.current > 0) ? '#5577ff' : '#444444';
      ctx.lineWidth = 1;
      ctx.stroke();
      if (mon && mon.hp && mon.hp.current > 0) {
        ctx.fillStyle = 'rgba(255,255,255,0.45)';
        ctx.beginPath();
        ctx.arc(cx - 1, cy - 1, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  function _drawTrainerIntro(ctx, battle) {
    const W = DG.CANVAS.W, H = DG.CANVAS.H;
    const T = DG.CANVAS.TILE_SIZE || 32;
    // introTimer counts down from 90→0
    const timer = battle.introTimer || 0;
    const pct   = Math.max(0, Math.min(1, 1 - timer / 90)); // 0→1

    // Split background: blue left, crimson right
    ctx.fillStyle = '#0a1e4a';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#3a0808';
    ctx.fillRect(W / 2, 0, W / 2, H);

    // Diagonal slash
    ctx.fillStyle = '#000010';
    ctx.beginPath();
    ctx.moveTo(W / 2 - 18, 0);
    ctx.lineTo(W / 2 + 18, H);
    ctx.lineTo(W / 2 + 12, H);
    ctx.lineTo(W / 2 - 24, 0);
    ctx.closePath();
    ctx.fill();

    // Slide-in: trainer starts off-screen left/right, reaches position by pct=0.5
    const slide = Math.max(0, 1 - pct * 2);
    const playerCX = W * 0.2;
    const trainerCX = W * 0.78;

    // Draw player NPC at left
    const fakeP = {
      x: (playerCX - slide * (playerCX + 60)) / T,
      y: (H * 0.52 - T) / T,
      spriteKey: 'NPC_KID',
      facing: 'RIGHT',
    };
    try { DG.SpriteRenderer.drawNPC(ctx, fakeP, 0, 0); } catch(e) {}

    // Draw enemy trainer NPC at right
    const trKey = (battle.trainerData && battle.trainerData.spriteKey) || 'NPC_LEADER';
    const fakeE = {
      x: (trainerCX + slide * (W - trainerCX + 60)) / T,
      y: (H * 0.52 - T) / T,
      spriteKey: trKey,
      facing: 'LEFT',
    };
    try { DG.SpriteRenderer.drawNPC(ctx, fakeE, 0, 0); } catch(e) {}

    // Trainer name (bottom right)
    const tname = (battle.trainerData && battle.trainerData.name) || 'Trainer';
    ctx.fillStyle = '#ffaaaa';
    ctx.font = '11px monospace';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'center';
    ctx.fillText(tname, trainerCX, H * 0.65);

    // Player name (bottom left)
    const pname = (battle.gameState && battle.gameState.player && battle.gameState.player.name) || 'Trainer';
    ctx.fillStyle = '#aaccff';
    ctx.fillText(pname, playerCX, H * 0.65);
    ctx.textAlign = 'left';

    // VS text fades in after pct > 0.4
    if (pct > 0.4) {
      const vsAlpha = Math.min(1, (pct - 0.4) / 0.3);
      ctx.globalAlpha = vsAlpha;
      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 40px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('VS', W / 2, H / 2 - 10);
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.globalAlpha = 1;
    }
  }

  function _roundRectMenu(ctx, x, y, w, h, r) {
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

  // ── Menu overlay ──────────────────────────────────────────
  function _drawMenu(ctx) {
    DG.Menu.draw(ctx);
  }

  // ── Battle input handling (called from main.js) ──────────
  function handleBattleInput() {
    if (!DG.Battle.isActive()) return;
    if (DG.DialogueBox.isVisible()) return;

    // Learn Move UI — handled independently of PLAYER_INPUT state
    if (DG.Battle.getState && DG.Battle.getState() === DG.Battle.BS.LEARN_MOVE) {
      // Don't handle learn-move input while a battle message is still being displayed —
      // otherwise the player's A-press that dismisses "Gained EXP!" would also instantly
      // confirm the learn popup before they can see it.
      if (DG.Battle.currentMessage && DG.Battle.currentMessage()) return;
      _handleLearnMoveInput();
      return;
    }

    // Auto-force switch if player mon has fainted
    if (DG.Battle.getState() === DG.Battle.BS.PLAYER_INPUT && !DG.DialogueBox.isVisible()) {
      const battle = DG.Battle.getBattle();
      if (battle && battle.playerMon && battle.playerMon.hp.current <= 0 && _battleUIMode !== 'PARTY') {
        // Auto-open party switch
        _openBattleSwitch();
        return;
      }
    }

    if (DG.Battle.getState() !== DG.Battle.BS.PLAYER_INPUT) return;

    const _battle = DG.Battle.getBattle();
    const _isDouble = _battle && _battle.isDouble;

    // Locked into a multi-turn move (Rollout / charging two-turn / Thrash):
    // auto-submit it — the player gets no move choice this turn.
    if (_battle && _battle.playerMon && !_isDouble && DG.Battle.lockedMoveIndex) {
      const _li = DG.Battle.lockedMoveIndex(_battle.playerMon);
      if (_li >= 0) {
        DG.Battle.submitPlayerAction({ type:'MOVE', moveIndex: _li });
        _battleUIMode = 'MAIN';
        _moveCursor = 0;
        return;
      }
    }

    if (_battleUIMode === 'MAIN') {
      if (_isDouble) {
        // Double battle: only FIGHT and DINOM (2 options)
        if (DG.Input.isPressed('LEFT') || DG.Input.isPressed('RIGHT')) {
          _battleMainCursor = (_battleMainCursor + 1) % 2;
        }
        if (DG.Input.isPressed('A')) {
          const opts = ['FIGHT', 'DINOM'];
          const opt = opts[_battleMainCursor % 2];
          if (opt === 'FIGHT')  { _battleUIMode = 'MOVE'; _moveCursor = 0; }
          if (opt === 'DINOM')  { _openBattleSwitch(); }
        }
      } else {
        const len = BATTLE_MAIN_OPTIONS.length;
        if (DG.Input.isPressed('UP'))    _battleMainCursor = (_battleMainCursor - 2 + len) % len;
        if (DG.Input.isPressed('DOWN'))  _battleMainCursor = (_battleMainCursor + 2) % len;
        if (DG.Input.isPressed('LEFT'))  _battleMainCursor = (_battleMainCursor % 2 === 0) ? _battleMainCursor : _battleMainCursor - 1;
        if (DG.Input.isPressed('RIGHT')) _battleMainCursor = (_battleMainCursor % 2 === 1) ? _battleMainCursor : _battleMainCursor + 1;

        if (DG.Input.isPressed('A')) {
          const opt = BATTLE_MAIN_OPTIONS[_battleMainCursor];
          if (opt === 'FIGHT')  { _battleUIMode = 'MOVE'; _moveCursor = 0; }
          if (opt === 'BAG')    { _openBattleBag(); }
          if (opt === 'DINOM')  { _openBattleSwitch(); }
          if (opt === 'RUN')    { DG.Battle.submitPlayerAction({ type:'RUN' }); _battleMainCursor = 0; }
        }
      }
    } else if (_battleUIMode === 'BAG') {
      DG.BagMenu.update(0);
    } else if (_battleUIMode === 'PARTY') {
      DG.PartyMenu.update(0);
    } else if (_battleUIMode === 'MOVE') {
      const battle = DG.Battle.getBattle();
      const mon    = battle ? battle.playerMon : null;
      if (!mon) return;
      const moves  = mon.moves;
      const len    = moves.length;
      if (DG.Input.isPressed('UP'))    _moveCursor = (_moveCursor - 2 + len) % len;
      if (DG.Input.isPressed('DOWN'))  _moveCursor = (_moveCursor + 2) % len;
      if (_isDouble) {
        // In double battle, LEFT/RIGHT switches target instead of move cursor
        if (DG.Input.isPressed('LEFT') || DG.Input.isPressed('RIGHT')) {
          DG.Battle.switchDoubleTarget();
        }
      } else {
        if (DG.Input.isPressed('LEFT'))  _moveCursor = _moveCursor > 0 ? _moveCursor - 1 : _moveCursor;
        if (DG.Input.isPressed('RIGHT')) _moveCursor = _moveCursor < len - 1 ? _moveCursor + 1 : _moveCursor;
      }
      if (DG.Input.isPressed('A')) {
        DG.Battle.submitPlayerAction({ type:'MOVE', moveIndex: _moveCursor });
        _battleUIMode = 'MAIN';
        _moveCursor   = 0;
      }
      if (DG.Input.isPressed('B') || DG.Input.isPressed('START')) { _battleUIMode = 'MAIN'; }
    }
  }

  function _openBattleBag() {
    const battle = DG.Battle.getBattle();
    if (!battle) return;
    const gs = battle.gameState;
    const BALLS = ['DINOBALL','SUPERBALL','ULTRABALL','AMBERBALL','MASTERBALL','DINOMASTERBALL'];

    DG.BagMenu.openBattle(gs, function(itemId, targetIndex) {
      if (BALLS.includes(itemId)) {
        // Ball — only in wild battles
        if (battle.type !== 'WILD') {
          DG.DialogueBox.show(["You can't catch a trainer's DinoMon!"], () => { _battleUIMode = 'MAIN'; });
          return;
        }
        DG.Battle.submitPlayerAction({ type:'ITEM', itemId });
        _battleUIMode = 'MAIN';
      } else {
        // Healing item on the chosen party mon — the battle engine applies the
        // heal and consumes the item exactly once (costs a turn).
        DG.Battle.submitPlayerAction({ type:'ITEM', itemId, targetIndex });
        _battleUIMode = 'MAIN';
      }
    }, function() {
      // Closed without selecting
      _battleUIMode = 'MAIN';
    });
    _battleUIMode = 'BAG';
  }

  function _openBattleSwitch() {
    const battle = DG.Battle.getBattle();
    if (!battle) return;
    const gs     = battle.gameState;
    const active = battle.playerMon;
    const isForcedSwitch = active && active.hp.current <= 0;

    // Check if any other mon can fight
    const canSwitch = gs.player.party.some(m => m !== active && m.hp.current > 0);
    if (!canSwitch) {
      if (isForcedSwitch) {
        // All fainted — battle will end via FAINT_HANDLER
        _battleUIMode = 'MAIN';
        return;
      }
      DG.DialogueBox.show(["No other DinoMon can battle!"], () => { _battleUIMode = 'MAIN'; });
      return;
    }

    DG.PartyMenu.openBattle(gs, active, function(idx) {
      DG.Battle.submitPlayerAction({ type:'SWITCH', targetIndex: idx });
      _battleUIMode = 'MAIN';
    }, function() {
      // Cancel pressed
      if (isForcedSwitch) {
        // Can't cancel forced switch — re-open
        const stillCanSwitch = gs.player.party.some(m => m !== active && m.hp.current > 0);
        if (stillCanSwitch) {
          DG.DialogueBox.show(["Choose your next DinoMon!"], () => { _openBattleSwitch(); });
          return;
        }
      }
      _battleUIMode = 'MAIN';
    });
    _battleUIMode = 'PARTY';
  }

  function _handleLearnMoveInput() {
    const pending = DG.Battle.getPendingLearn ? DG.Battle.getPendingLearn() : null;
    if (!pending) return;

    // ── PREVIEW phase: A = confirm interest, B = skip entirely ──────────────
    if (pending.phase === 'PREVIEW') {
      if (DG.Input.isPressed('A')) {
        if (DG.Battle.confirmLearnPreview) DG.Battle.confirmLearnPreview(true);
        _learnMoveCursor = 0;
      }
      if (DG.Input.isPressed('B') || DG.Input.isPressed('START')) {
        if (DG.Battle.confirmLearnPreview) DG.Battle.confirmLearnPreview(false);
        _learnMoveCursor = 0;
      }
      return;
    }

    // ── REPLACE phase: pick which of the 4 moves to forget ──────────────────
    const totalOpts = 5; // 4 current moves + "Don't learn"
    if (DG.Input.isPressed('UP'))   _learnMoveCursor = (_learnMoveCursor - 1 + totalOpts) % totalOpts;
    if (DG.Input.isPressed('DOWN')) _learnMoveCursor = (_learnMoveCursor + 1) % totalOpts;
    if (DG.Input.isPressed('A')) {
      if (_learnMoveCursor === 4) {
        DG.Battle.confirmLearnMove(-1);
      } else {
        DG.Battle.confirmLearnMove(_learnMoveCursor);
      }
      _learnMoveCursor = 0;
    }
    if (DG.Input.isPressed('B') || DG.Input.isPressed('START')) {
      DG.Battle.confirmLearnMove(-1);
      _learnMoveCursor = 0;
    }
  }

  // ── Effect-text helpers (mirrors the copy in spriteRenderer) ──────────────
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
        const pct  = (eff.chance && eff.chance < 100) ? ` (${eff.chance}%)` : '';
        return `Raises ${t}'s ${stat} +${eff.stages}${pct}`;
      }
      case 'STAT_LOWER': {
        const t = (eff.target === 'opponent') ? "foe's" : "user's";
        const stat = sn[eff.stat] || eff.stat;
        const stg  = eff.stages < 0 ? String(eff.stages) : `-${eff.stages}`;
        const pct  = (eff.chance && eff.chance < 100) ? ` (${eff.chance}%)` : '';
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
    if (!eff || eff.type === 'NONE') return '#aaaacc';
    switch (eff.type) {
      case 'STATUS_CHANCE': {
        const c = { BURN:'#ff8833', POISON:'#cc55ff', PARALYSIS:'#ffdd22', SLEEP:'#6688ff', FREEZE:'#44ddff' };
        return c[eff.status] || '#ffaa44';
      }
      case 'FLINCH': return '#ddddcc'; case 'CONFUSE': return '#ff88cc';
      case 'STAT_RAISE': return '#44ff88'; case 'STAT_LOWER': return '#ff8844';
      case 'RECOIL': return '#ff5544'; case 'DRAIN': case 'HEAL': return '#44ffcc';
      case 'LEECH_SEED': return '#88ff44'; case 'ONE_HIT_KO': return '#ff4444';
      case 'SET_WEATHER': return '#88ccff'; case 'MULTI': return '#ffcc44';
      default: return '#aaaacc';
    }
  }

  // ── Move-learn UI dispatcher ──────────────────────────────
  function _drawLearnMoveUI(ctx, battle) {
    if (!battle) return;
    const pending = DG.Battle.getPendingLearn ? DG.Battle.getPendingLearn() : null;
    if (!pending) return;
    const newMove = DG.MOVES && DG.MOVES[pending.moveId];
    if (!newMove) return;

    if (pending.phase === 'PREVIEW') {
      _drawLearnMovePreview(ctx, pending, newMove);
    } else {
      _drawLearnMoveReplace(ctx, pending, newMove);
    }
  }

  // ── PREVIEW popup: new move details + full current moveset ──────────────
  function _drawLearnMovePreview(ctx, pending, move) {
    const W = DG.CANVAS.W, H = DG.CANVAS.H;
    const TYPE_COLOR = DG.TYPE_COLOR || {};
    const typeCol = TYPE_COLOR[move.type] || '#888888';
    const mon = pending.mon;
    const monName = mon.nickname || (DG.SPECIES && DG.SPECIES[mon.speciesId] ? DG.SPECIES[mon.speciesId].name : mon.speciesId);
    const pulse = 0.5 + 0.5 * Math.sin(_animOff * 0.12);
    const blink = Math.sin(_animOff * 0.18) > 0;

    // Dark overlay
    ctx.fillStyle = 'rgba(0,0,14,0.92)';
    ctx.fillRect(0, 0, W, H);

    // Outer panel
    const px = 14, py = 6, pw = W - 28, ph = H - 12;
    const panelGrad = ctx.createLinearGradient(px, py, px, py + ph);
    panelGrad.addColorStop(0.0, '#130d00');
    panelGrad.addColorStop(0.5, '#0b1030');
    panelGrad.addColorStop(1.0, '#070715');
    ctx.fillStyle = panelGrad;
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(px, py, pw, ph, 8); else ctx.rect(px, py, pw, ph);
    ctx.fill(); ctx.stroke();
    // Pulsing inner glow
    ctx.strokeStyle = `rgba(255,215,0,${0.08 + pulse * 0.14})`;
    ctx.lineWidth = 5;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(px + 3, py + 3, pw - 6, ph - 6, 6); else ctx.rect(px + 3, py + 3, pw - 6, ph - 6);
    ctx.stroke();
    ctx.lineWidth = 1;

    const hx = px + 8, hw = pw - 16;

    // ── HEADER BAR ───────────────────────────────────────────
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(hx, py + 7, hw, 16);
    ctx.fillStyle = '#1a1000';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('★  NEW MOVE AVAILABLE  ★', px + pw / 2, py + 15);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    // ── NEW MOVE BOX (animated gold border + pulsing background) ─────────
    const nmBy = py + 28, nmBh = 100;
    ctx.fillStyle = `rgba(255,200,0,${0.04 + pulse * 0.06})`;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(hx, nmBy, hw, nmBh, 5); else ctx.rect(hx, nmBy, hw, nmBh);
    ctx.fill();
    ctx.strokeStyle = blink ? '#FFE033' : `rgba(255,215,0,${0.45 + pulse * 0.45})`;
    ctx.lineWidth = blink ? 2 : 1.5;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(hx, nmBy, hw, nmBh, 5); else ctx.rect(hx, nmBy, hw, nmBh);
    ctx.stroke();
    ctx.lineWidth = 1;

    // Move name — blinking yellow/gold
    ctx.fillStyle = blink ? '#FFE033' : '#FFCC00';
    ctx.font = 'bold 14px monospace';
    ctx.textBaseline = 'top';
    ctx.fillText(move.name, hx + 6, nmBy + 6);

    // Type badge
    ctx.fillStyle = typeCol;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(hx + 6, nmBy + 24, 52, 13, 4); else ctx.rect(hx + 6, nmBy + 24, 52, 13);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 8px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(move.type, hx + 32, nmBy + 30.5);
    ctx.textAlign = 'left';

    // Category badge
    const cat = move.category || 'STATUS';
    const catCol = cat === 'PHYSICAL' ? '#cc5522' : cat === 'SPECIAL' ? '#3366cc' : '#558855';
    ctx.fillStyle = catCol;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(hx + 64, nmBy + 24, 66, 13, 4); else ctx.rect(hx + 64, nmBy + 24, 66, 13);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 8px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(cat, hx + 97, nmBy + 30.5);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    // Stats line
    const pwr = (cat !== 'STATUS' && move.power > 0) ? String(move.power) : '—';
    const acc = (move.accuracy && move.accuracy < 999) ? move.accuracy + '%' : '—';
    ctx.fillStyle = '#aaaacc';
    ctx.font = '9px monospace';
    ctx.fillText(`PWR: ${pwr}   ACC: ${acc}   PP: ${move.pp || '—'}`, hx + 6, nmBy + 42);

    // Description (2 lines)
    ctx.fillStyle = '#889aaa';
    ctx.font = '8px monospace';
    const descLines = _wrapText(move.description || '—', 72);
    descLines.slice(0, 2).forEach((line, i) => ctx.fillText(line, hx + 6, nmBy + 55 + i * 12));

    // Effect line
    const effTxt = _effectText(move.effect);
    if (effTxt) {
      ctx.fillStyle = _effectColor(move.effect);
      ctx.font = 'bold 9px monospace';
      ctx.fillText('⚡ ' + effTxt, hx + 6, nmBy + 80);
    }

    // ── DIVIDER + "CURRENT MOVESET" label ────────────────────
    const cmY = nmBy + nmBh + 5;
    ctx.strokeStyle = 'rgba(255,215,0,0.18)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(hx, cmY); ctx.lineTo(hx + hw, cmY); ctx.stroke();
    ctx.fillStyle = '#aaaacc';
    ctx.font = 'bold 8px monospace';
    ctx.textBaseline = 'top';
    ctx.fillText('CURRENT MOVESET:', hx, cmY + 3);

    // ── 4 current move rows (compact) ────────────────────────
    const moves = mon.moves || [];
    const rowH = 30;
    for (let i = 0; i < 4; i++) {
      const mi = moves[i];
      const mv = mi && DG.MOVES && DG.MOVES[mi.moveId];
      const ry = cmY + 14 + i * rowH;
      // Alternating row bg
      ctx.fillStyle = i % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.1)';
      ctx.fillRect(hx, ry, hw, rowH - 2);
      if (mv) {
        // Move name
        ctx.fillStyle = '#ddeeff';
        ctx.font = '10px monospace';
        ctx.textBaseline = 'top';
        ctx.fillText(mv.name, hx + 4, ry + 3);
        // Type badge
        const mtCol = TYPE_COLOR[mv.type] || '#888';
        const mtbx = hx + 112;
        ctx.fillStyle = mtCol;
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(mtbx, ry + 2, 36, 11, 3); else ctx.rect(mtbx, ry + 2, 36, 11);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 7px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(mv.type, mtbx + 18, ry + 7.5);
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        // Stats + PP
        const mCat = mv.category || 'STATUS';
        const mPwr = mCat !== 'STATUS' ? (mv.power || '—') : '—';
        const mAcc = mv.accuracy ? mv.accuracy + '%' : '—';
        ctx.fillStyle = '#778899';
        ctx.font = '8px monospace';
        ctx.fillText(`PWR:${mPwr}  ACC:${mAcc}  PP:${mi.ppCurrent}/${mi.ppMax}`, hx + 4, ry + 17);
      } else {
        ctx.fillStyle = '#3a3a4a';
        ctx.font = '9px monospace';
        ctx.textBaseline = 'top';
        ctx.fillText(`— empty slot —`, hx + 4, ry + 9);
      }
    }

    // ── BUTTONS ───────────────────────────────────────────────
    const btnY = py + ph - 26;
    ctx.strokeStyle = 'rgba(255,215,0,0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(hx, btnY - 4); ctx.lineTo(hx + hw, btnY - 4); ctx.stroke();
    const aLabel = pending.hasSlot ? '[ENTER] Add to moveset' : '[ENTER] Choose move to replace';
    ctx.fillStyle = '#22cc66';
    ctx.font = 'bold 9px monospace';
    ctx.textBaseline = 'top';
    ctx.fillText(aLabel, hx, btnY);
    ctx.fillStyle = '#cc4444';
    ctx.fillText(`[ESC] Don't learn ${move.name}`, hx, btnY + 13);
  }

  // ── Simple word-wrapper ───────────────────────────────────
  function _wrapText(text, maxChars) {
    const words = text.split(' ');
    const lines = [];
    let cur = '';
    words.forEach(w => {
      if ((cur + (cur ? ' ' : '') + w).length <= maxChars) {
        cur += (cur ? ' ' : '') + w;
      } else {
        if (cur) lines.push(cur);
        cur = w;
      }
    });
    if (cur) lines.push(cur);
    return lines;
  }

  // ── REPLACE panel: new move prominent + pick which of 4 to forget ───────
  function _drawLearnMoveReplace(ctx, pending, newMove) {
    const W = DG.CANVAS.W, H = DG.CANVAS.H;
    const TYPE_COLOR = DG.TYPE_COLOR || {};
    const mon = pending.mon;
    const monName = mon.nickname || (DG.SPECIES && DG.SPECIES[mon.speciesId] ? DG.SPECIES[mon.speciesId].name : mon.speciesId);
    const pulse = 0.5 + 0.5 * Math.sin(_animOff * 0.12);
    const blink = Math.sin(_animOff * 0.18) > 0;

    // Background overlay
    ctx.fillStyle = 'rgba(0,0,0,0.92)';
    ctx.fillRect(0, 0, W, H);

    // Panel
    const px = 14, py = 6, pw = W - 28, ph = H - 12;
    ctx.fillStyle = '#0e1030';
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(px, py, pw, ph, 6); else ctx.rect(px, py, pw, ph);
    ctx.fill(); ctx.stroke();
    ctx.strokeStyle = `rgba(255,215,0,${0.08 + pulse * 0.14})`;
    ctx.lineWidth = 5;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(px + 3, py + 3, pw - 6, ph - 6, 4); else ctx.rect(px + 3, py + 3, pw - 6, ph - 6);
    ctx.stroke();
    ctx.lineWidth = 1;

    const hx = px + 8, hw = pw - 16;

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 10px monospace';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    ctx.fillText(`${monName} wants to learn:`, hx, py + 8);

    // ── NEW MOVE BOX — large, animated, prominent ─────────────
    const nmBy = py + 22, nmBh = 80;
    // Pulsing golden fill
    ctx.fillStyle = `rgba(255,190,0,${0.06 + pulse * 0.09})`;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(hx, nmBy, hw, nmBh, 6); else ctx.rect(hx, nmBy, hw, nmBh);
    ctx.fill();
    // Blinking gold border
    ctx.strokeStyle = blink ? '#FFE033' : `rgba(255,215,0,${0.55 + pulse * 0.45})`;
    ctx.lineWidth = blink ? 2.5 : 1.5;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(hx, nmBy, hw, nmBh, 6); else ctx.rect(hx, nmBy, hw, nmBh);
    ctx.stroke();
    ctx.lineWidth = 1;

    // "★ NEW ★" badge inside box (top-right)
    const tagW = 54, tagH = 14;
    ctx.fillStyle = blink ? '#FFE033' : '#FFD700';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(hx + hw - tagW - 4, nmBy + 4, tagW, tagH, 3);
    else ctx.rect(hx + hw - tagW - 4, nmBy + 4, tagW, tagH);
    ctx.fill();
    ctx.fillStyle = '#1a1000';
    ctx.font = 'bold 8px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('★ NEW MOVE ★', hx + hw - tagW / 2 - 4, nmBy + 11);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    // Move name — large blinking yellow
    ctx.fillStyle = blink ? '#FFE033' : '#FFCC00';
    ctx.font = 'bold 14px monospace';
    ctx.fillText(newMove.name, hx + 6, nmBy + 6);

    // Type badge
    const typeCol = TYPE_COLOR[newMove.type] || '#888';
    ctx.fillStyle = typeCol;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(hx + 6, nmBy + 24, 52, 13, 4); else ctx.rect(hx + 6, nmBy + 24, 52, 13);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 8px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(newMove.type, hx + 32, nmBy + 30.5);

    // Category badge
    const cat = newMove.category || 'STATUS';
    const catCol = cat === 'PHYSICAL' ? '#cc5522' : cat === 'SPECIAL' ? '#3366cc' : '#558855';
    ctx.fillStyle = catCol;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(hx + 64, nmBy + 24, 66, 13, 4); else ctx.rect(hx + 64, nmBy + 24, 66, 13);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 8px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(cat, hx + 97, nmBy + 30.5);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    // Stats + 1-line description
    const pwr = (cat !== 'STATUS' && newMove.power > 0) ? String(newMove.power) : '—';
    const acc = (newMove.accuracy && newMove.accuracy < 999) ? newMove.accuracy + '%' : '—';
    ctx.fillStyle = '#aaaacc';
    ctx.font = '9px monospace';
    ctx.fillText(`PWR:${pwr}  ACC:${acc}  PP:${newMove.pp || '—'}`, hx + 6, nmBy + 42);
    ctx.fillStyle = '#778899';
    ctx.font = '8px monospace';
    const dLines = _wrapText(newMove.description || '', 70);
    if (dLines[0]) ctx.fillText(dLines[0], hx + 6, nmBy + 54);

    // ── "Choose a move to forget" divider ─────────────────────
    const divY = nmBy + nmBh + 4;
    ctx.strokeStyle = 'rgba(255,215,0,0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(hx, divY); ctx.lineTo(hx + hw, divY); ctx.stroke();
    ctx.fillStyle = '#aaaacc';
    ctx.font = 'bold 9px monospace';
    ctx.textBaseline = 'top';
    ctx.fillText('Choose a move to forget:', hx, divY + 4);

    // ── 4 current moves ───────────────────────────────────────
    const moves = mon.moves || [];
    const rowH = 40;
    for (let i = 0; i < 4; i++) {
      const mi = moves[i];
      const mv = mi && DG.MOVES && DG.MOVES[mi.moveId];
      const ry = divY + 17 + i * rowH;
      const isSelected = (_learnMoveCursor === i);
      if (isSelected) {
        ctx.fillStyle = '#e94560';
        ctx.globalAlpha = 0.22;
        ctx.fillRect(hx, ry - 2, hw, rowH - 4);
        ctx.globalAlpha = 1;
        ctx.strokeStyle = '#e94560';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(hx, ry - 2, hw, rowH - 4);
        ctx.lineWidth = 1;
      }
      if (mv) {
        ctx.fillStyle = isSelected ? '#ffffff' : '#ddeeff';
        ctx.font = (isSelected ? 'bold ' : '') + '10px monospace';
        ctx.textBaseline = 'top';
        ctx.fillText(mv.name, hx + 4, ry + 2);
        const mtCol = TYPE_COLOR[mv.type] || '#888';
        const mtbx = hx + 112;
        ctx.fillStyle = mtCol;
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(mtbx, ry + 1, 36, 12, 3); else ctx.rect(mtbx, ry + 1, 36, 12);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 7px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(mv.type, mtbx + 18, ry + 7);
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        const mCat = mv.category || 'STATUS';
        const mPwr = mCat !== 'STATUS' ? (mv.power || '—') : '—';
        const mAcc = mv.accuracy ? mv.accuracy + '%' : '—';
        ctx.fillStyle = isSelected ? '#ffaaaa' : '#778899';
        ctx.font = '8px monospace';
        ctx.fillText(`PWR:${mPwr}  ACC:${mAcc}  PP:${mi.ppCurrent}/${mi.ppMax}`, hx + 4, ry + 16);
        if (mv.description) {
          ctx.fillStyle = isSelected ? '#aa8888' : '#4d6070';
          const d = mv.description.length > 62 ? mv.description.slice(0, 59) + '...' : mv.description;
          ctx.fillText(d, hx + 4, ry + 27);
        }
      } else {
        ctx.fillStyle = '#3a3a4a';
        ctx.font = '9px monospace';
        ctx.textBaseline = 'top';
        ctx.fillText('— empty slot —', hx + 4, ry + 12);
      }
    }

    // "Don't learn" option
    const skipY = divY + 17 + 4 * rowH + 2;
    const isSkipSel = (_learnMoveCursor === 4);
    if (isSkipSel) {
      ctx.fillStyle = '#e94560';
      ctx.globalAlpha = 0.22;
      ctx.fillRect(hx, skipY - 2, hw, 20);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = '#e94560';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(hx, skipY - 2, hw, 20);
      ctx.lineWidth = 1;
    }
    ctx.fillStyle = isSkipSel ? '#FFE050' : '#777788';
    ctx.font = (isSkipSel ? 'bold ' : '') + '9px monospace';
    ctx.textBaseline = 'top';
    ctx.fillText(`${isSkipSel ? '\u25B6 ' : '  '}Don\u2019t learn ${newMove.name}`, hx + 4, skipY + 3);
    ctx.textAlign = 'left';
  }

  function _drawMoveRow(ctx, move, x, y, w, isSelected, liveMove, label) {
    const TYPE_COLOR = DG.TYPE_COLOR || {};
    const col = TYPE_COLOR[move.type] || '#888888';

    // Label override (for "NEW MOVE")
    if (label) {
      ctx.fillStyle = '#44ffaa';
      ctx.font = 'bold 9px monospace';
      ctx.textBaseline = 'top';
      ctx.textAlign = 'left';
      ctx.fillText(label, x, y);
      y += 11;
    }

    // Move name
    ctx.fillStyle = isSelected ? '#ffffff' : '#ddeeff';
    ctx.font = (isSelected ? 'bold ' : '') + '11px monospace';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    ctx.fillText(move.name, x, y);

    // Type badge
    const tbx = x + 100;
    ctx.fillStyle = col;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(tbx, y - 1, 38, 12, 3); else ctx.rect(tbx, y - 1, 38, 12);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 8px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(move.type, tbx + 19, y + 2);
    ctx.textAlign = 'left';

    // Stats row
    const cat = move.category || 'STATUS';
    const pwr = cat !== 'STATUS' ? (move.power || '\u2014') : '\u2014';
    const acc = move.accuracy ? move.accuracy + '%' : '\u2014';
    const pp  = liveMove ? `PP: ${liveMove.ppCurrent}/${liveMove.ppMax}` : `PP: ${move.pp}`;

    ctx.fillStyle = '#aaaaaa';
    ctx.font = '9px monospace';
    ctx.textBaseline = 'top';
    ctx.fillText(`PWR:${pwr}  ACC:${acc}  ${pp}`, x, y + 14);

    // Description (truncated to fit)
    if (move.description) {
      ctx.fillStyle = '#667788';
      ctx.font = '8px monospace';
      const desc = move.description.length > 58 ? move.description.slice(0, 55) + '...' : move.description;
      ctx.fillText(desc, x, y + 24);
    }
  }

  function resetBattleUI() {
    _battleUIMode     = 'MAIN';
    _battleMainCursor = 0;
    _moveCursor       = 0;
    // Clear any lingering battle bag state
    if (DG.BagMenu && DG.BagMenu.openBattle) {
      // no-op: BagMenu state resets on next openBattle call
    }
  }

  console.log('[DinoMon] Renderer v35 loaded.');

  function triggerLevelUpFlash() { _levelUpFlash = 1.0; }
  return { init, draw, handleBattleInput, resetBattleUI, triggerLevelUpFlash };
})();

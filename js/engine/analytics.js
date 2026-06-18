// ============================================================
// DinoMon: Fossil Frontier — analytics.js
// Lichte, privacy-vriendelijke event-tracking + dev-dashboard.
//
// WAT DIT DOET
//   • Legt belangrijke speelmomenten vast (sessie, nieuw spel, starter,
//     badges, blackout, uitspelen) in localStorage van de speler.
//   • Toont een verborgen dashboard met de resultaten.
//       → Openen:  Ctrl+Shift+S   of   ?stats=1 in de URL
//   • Is "plug-and-play" voor de cloud: zet je later een gratis
//     GoatCounter- of PostHog-sleutel, dan stromen DEZELFDE events ook
//     naar de cloud en zie je álle spelers (niet alleen dit toestel).
//
// PRIVACY: geen cookies, geen namen, geen IP-opslag aan onze kant.
//   Alleen geanonimiseerde gebeurtenissen. Lokaal tenzij jij cloud aanzet.
//
// CLOUD AANZETTEN (later, optioneel — geen redeploy nodig):
//   GoatCounter:  localStorage.dg_goatcounter = 'jouwcode'   (→ jouwcode.goatcounter.com)
//   PostHog:      localStorage.dg_posthog_key  = 'phc_xxx'
//                 localStorage.dg_posthog_host = 'https://eu.i.posthog.com'
//   Daarna pagina herladen. Uitzetten: die keys weer verwijderen.
// ============================================================

window.DG = window.DG || {};

(function () {
  'use strict';

  var LS_EVENTS = 'dg_an_events';
  var LS_META   = 'dg_an_meta';
  var MAX_EVENTS = 2000;            // ring-buffer: oudste vallen weg

  // ── opslag-helpers (alles in try/catch — nooit de game laten crashen) ──
  function _read(key, fallback) {
    try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
    catch (e) { return fallback; }
  }
  function _write(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
  }

  function _now() { return new Date().getTime(); }

  // ── cloud-config (uit localStorage zodat het zonder redeploy aan/uit kan) ──
  function _cfg() {
    var gc = null, phKey = null, phHost = null;
    try {
      gc     = localStorage.getItem('dg_goatcounter')  || null;
      phKey  = localStorage.getItem('dg_posthog_key')  || null;
      phHost = localStorage.getItem('dg_posthog_host') || 'https://eu.i.posthog.com';
    } catch (e) {}
    return { goatcounter: gc, posthogKey: phKey, posthogHost: phHost };
  }
  function _cloudOn() { var c = _cfg(); return !!(c.goatcounter || c.posthogKey); }

  // stabiele, anonieme bezoeker-id (alleen voor "terugkerende speler"-telling)
  function _visitorId() {
    var m = _read(LS_META, null) || {};
    if (!m.vid) {
      m.vid = 'v' + Math.random().toString(36).slice(2) + _now().toString(36);
      _write(LS_META, m);
    }
    return m.vid;
  }

  // ── cloud-forwarding (alleen als geconfigureerd) ──────────────
  function _sendCloud(eventName, props) {
    var c = _cfg();
    try {
      if (c.goatcounter) {
        // GoatCounter telt "paths" — we coderen het event als pad + props in de titel
        var path = '/dinomon/' + eventName;
        var q = Object.keys(props || {}).map(function (k) {
          return k + '=' + encodeURIComponent(props[k]);
        }).join('&');
        var img = new Image();
        img.src = 'https://' + c.goatcounter + '.goatcounter.com/count' +
                  '?p=' + encodeURIComponent(path) +
                  '&t=' + encodeURIComponent(eventName + (q ? ' ' + q : '')) +
                  '&r=' + encodeURIComponent(document.referrer || '') +
                  '&rnd=' + Math.random();
      }
      if (c.posthogKey) {
        var body = {
          api_key: c.posthogKey,
          event: 'dm_' + eventName,
          distinct_id: _visitorId(),
          properties: Object.assign({
            $current_url: location.href,
            $lib: 'dinomon-analytics'
          }, props || {})
        };
        fetch(c.posthogHost.replace(/\/+$/, '') + '/capture/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
          keepalive: true
        }).catch(function () {});
      }
    } catch (e) {}
  }

  // ── kern: track ───────────────────────────────────────────────
  function track(eventName, props) {
    if (!eventName) return;
    props = props || {};
    try {
      var events = _read(LS_EVENTS, []);
      events.push({ e: eventName, t: _now(), p: props });
      if (events.length > MAX_EVENTS) events = events.slice(events.length - MAX_EVENTS);
      _write(LS_EVENTS, events);

      var meta = _read(LS_META, null) || {};
      meta.lastSeen = _now();
      if (!meta.firstSeen) meta.firstSeen = _now();
      _write(LS_META, meta);
    } catch (e) {}
    _sendCloud(eventName, props);
    if (window.DG_AN_DEBUG) { try { console.log('[Analytics]', eventName, props); } catch (e) {} }
  }

  // ── sessie starten (één keer per page-load) ───────────────────
  function _startSession() {
    var meta = _read(LS_META, null) || {};
    meta.sessions = (meta.sessions || 0) + 1;
    if (!meta.firstSeen) meta.firstSeen = _now();
    meta.lastSeen = _now();
    _write(LS_META, meta);

    var isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    var device = (isTouch && Math.min(window.innerWidth, window.innerHeight) < 768) ? 'mobile' : 'desktop';
    var ref = '';
    try { ref = document.referrer ? new URL(document.referrer).hostname : 'direct'; } catch (e) { ref = 'direct'; }

    track('session_start', {
      device: device,
      lang: (navigator.language || '').slice(0, 5),
      ref: ref,
      tod: (DG.getTimeOfDay && DG.getTimeOfDay()) || '',
      returning: meta.sessions > 1
    });
  }

  // ── milestone-flags afvangen via een wrapper om SaveLoad.setFlag ──
  // Zo hoeven we overworld.js / battle.js niet aan te raken: elke badge,
  // champion-overwinning en game-complete loopt via setFlag.
  function _hookSaveLoad() {
    if (!window.DG || !DG.SaveLoad || !DG.SaveLoad.setFlag || DG.SaveLoad.__anHooked) {
      if (!(window.DG && DG.SaveLoad && DG.SaveLoad.__anHooked)) { setTimeout(_hookSaveLoad, 100); }
      return;
    }
    var _orig = DG.SaveLoad.setFlag.bind(DG.SaveLoad);
    DG.SaveLoad.setFlag = function (gs, flag) {
      // alleen tracken bij de EERSTE keer dat een milestone-flag wordt gezet
      var firstTime = !(gs && gs.player && gs.player.flags && gs.player.flags[flag]);
      var r = _orig(gs, flag);
      try {
        if (firstTime && typeof flag === 'string') {
          var bm = flag.match(/^BADGE_(\d+)$/);
          if (bm) track('badge', { n: Number(bm[1]) });
          else if (flag === 'CHAMPION_DEFEATED' || flag === 'CHAMPION_DONE') track('champion', {});
          else if (flag === 'GAME_COMPLETE') track('game_complete', {});
        }
      } catch (e) {}
      return r;
    };
    DG.SaveLoad.__anHooked = true;
  }

  // ── publieke API ──────────────────────────────────────────────
  DG.Analytics = {
    track: track,
    cloudOn: _cloudOn,
    config: _cfg,
    openDashboard: function () { _renderDashboard(true); },
    closeDashboard: function () { _renderDashboard(false); },
    reset: function () { try { localStorage.removeItem(LS_EVENTS); } catch (e) {} _renderDashboard(true); },
    _events: function () { return _read(LS_EVENTS, []); },
    _meta: function () { return _read(LS_META, {}); }
  };

  // ============================================================
  //  DASHBOARD  — verborgen overlay (Ctrl+Shift+S / ?stats=1)
  // ============================================================
  var _panel = null;

  function _fmtDate(ms) {
    if (!ms) return '—';
    try { var d = new Date(ms); return d.toLocaleDateString() + ' ' + d.toLocaleTimeString().slice(0, 5); }
    catch (e) { return '—'; }
  }

  function _count(events, name, filterFn) {
    var n = 0;
    for (var i = 0; i < events.length; i++) {
      if (events[i].e === name && (!filterFn || filterFn(events[i].p || {}))) n++;
    }
    return n;
  }
  function _byProp(events, name, prop) {
    var out = {};
    for (var i = 0; i < events.length; i++) {
      if (events[i].e === name) {
        var k = (events[i].p && events[i].p[prop] != null) ? String(events[i].p[prop]) : '?';
        out[k] = (out[k] || 0) + 1;
      }
    }
    return out;
  }

  function _renderDashboard(show) {
    if (!show) {
      if (_panel) { _panel.style.display = 'none'; }
      return;
    }
    if (!_panel) {
      _panel = document.createElement('div');
      _panel.id = 'dgan-panel';
      document.body.appendChild(_panel);
      _injectStyle();
    }
    _panel.style.display = 'block';

    var ev = _read(LS_EVENTS, []);
    var meta = _read(LS_META, {});
    var cloud = _cloudOn();

    // funnel-stappen
    var sessions   = meta.sessions || _count(ev, 'session_start');
    var newGames   = _count(ev, 'new_game');
    var starters   = _count(ev, 'starter_chosen');
    var badge1     = _count(ev, 'badge', function (p) { return p.n >= 1; });
    var badge4     = _count(ev, 'badge', function (p) { return p.n >= 4; });
    var badge8     = _count(ev, 'badge', function (p) { return p.n >= 8; });
    var champ      = _count(ev, 'champion');
    var blackouts  = _count(ev, 'blackout');

    var funnel = [
      ['Bezoek / sessie',     sessions],
      ['Nieuw spel gestart',  newGames],
      ['Starter gekozen',     starters],
      ['1e badge',            badge1],
      ['4e badge',            badge4],
      ['8e badge',            badge8],
      ['Kampioen verslagen',  champ]
    ];
    var fmax = funnel[0][1] || 1;

    var starterDist = _byProp(ev, 'starter_chosen', 'type');
    var diffDist    = _byProp(ev, 'new_game', 'difficulty');
    var devDist     = _byProp(ev, 'session_start', 'device');

    function dist(title, obj, palette) {
      var keys = Object.keys(obj);
      var max = 0; keys.forEach(function (k) { max = Math.max(max, obj[k]); });
      var rows = keys.length ? keys.map(function (k, i) {
        var pct = max ? Math.round(obj[k] / max * 100) : 0;
        var col = palette[i % palette.length];
        return '<div class="dgan-row"><span class="dgan-lbl">' + k + '</span>' +
               '<span class="dgan-track"><span class="dgan-fill" style="width:' + pct + '%;background:' + col + '"></span></span>' +
               '<span class="dgan-val">' + obj[k] + '</span></div>';
      }).join('') : '<div class="dgan-empty">— nog geen data —</div>';
      return '<div class="dgan-card"><h4>' + title + '</h4>' + rows + '</div>';
    }

    var funnelRows = funnel.map(function (f) {
      var pct = fmax ? Math.round(f[1] / fmax * 100) : 0;
      return '<div class="dgan-row"><span class="dgan-lbl">' + f[0] + '</span>' +
             '<span class="dgan-track"><span class="dgan-fill" style="width:' + pct + '%;background:#e94560"></span></span>' +
             '<span class="dgan-val">' + f[1] + '</span></div>';
    }).join('');

    // recente events
    var recent = ev.slice(-12).reverse().map(function (e) {
      var p = e.p || {};
      var extra = Object.keys(p).map(function (k) { return k + ':' + p[k]; }).join(' ');
      return '<div class="dgan-ev"><span>' + e.e + '</span><span class="dgan-ev-x">' + extra + '</span>' +
             '<span class="dgan-ev-t">' + _fmtDate(e.t) + '</span></div>';
    }).join('') || '<div class="dgan-empty">— nog geen events —</div>';

    _panel.innerHTML =
      '<div class="dgan-wrap">' +
        '<div class="dgan-head">' +
          '<div><span class="dgan-title">DinoMon — Resultaten</span>' +
          '<span class="dgan-badge ' + (cloud ? 'on' : 'off') + '">' + (cloud ? '● cloud aan (alle spelers)' : '○ lokaal — alleen dit toestel') + '</span></div>' +
          '<button class="dgan-close" id="dgan-close">✕</button>' +
        '</div>' +
        '<div class="dgan-stats">' +
          '<div class="dgan-kpi"><b>' + sessions + '</b><span>sessies</span></div>' +
          '<div class="dgan-kpi"><b>' + newGames + '</b><span>nieuwe spellen</span></div>' +
          '<div class="dgan-kpi"><b>' + champ + '</b><span>uitgespeeld</span></div>' +
          '<div class="dgan-kpi"><b>' + blackouts + '</b><span>blackouts</span></div>' +
        '</div>' +
        '<div class="dgan-grid">' +
          '<div class="dgan-card dgan-wide"><h4>Funnel — hoe ver komen spelers?</h4>' + funnelRows + '</div>' +
          dist('Gekozen starter', starterDist, ['#F08030', '#6890F0', '#78C850', '#F8D030']) +
          dist('Moeilijkheid', diffDist, ['#44dd44', '#dd4444']) +
          dist('Apparaat', devDist, ['#A890F0', '#4488ff']) +
        '</div>' +
        '<div class="dgan-card dgan-wide"><h4>Laatste events</h4>' + recent + '</div>' +
        '<div class="dgan-foot">' +
          '<span>Eerste keer: ' + _fmtDate(meta.firstSeen) + ' · Laatst: ' + _fmtDate(meta.lastSeen) + ' · ' + ev.length + ' events bewaard</span>' +
          '<span class="dgan-actions">' +
            '<button id="dgan-export">Exporteer JSON</button>' +
            '<button id="dgan-clear">Wis data</button>' +
          '</span>' +
        '</div>' +
        (cloud ? '' : '<div class="dgan-hint">💡 Tip: zet cloud aan voor wereldwijde cijfers — zie de instructies bovenin <code>analytics.js</code>.</div>') +
      '</div>';

    document.getElementById('dgan-close').onclick = function () { _renderDashboard(false); };
    document.getElementById('dgan-clear').onclick = function () {
      if (confirm('Alle lokaal opgeslagen analytics-events wissen?')) { DG.Analytics.reset(); }
    };
    document.getElementById('dgan-export').onclick = function () {
      try {
        var data = JSON.stringify({ meta: meta, events: ev }, null, 2);
        var blob = new Blob([data], { type: 'application/json' });
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'dinomon-analytics.json';
        a.click();
      } catch (e) { alert('Export mislukt: ' + e); }
    };
  }

  function _injectStyle() {
    if (document.getElementById('dgan-style')) return;
    var s = document.createElement('style');
    s.id = 'dgan-style';
    s.textContent = [
      '#dgan-panel{position:fixed;inset:0;z-index:99999;background:rgba(6,8,20,.86);',
      'font-family:system-ui,Segoe UI,Roboto,sans-serif;color:#e8ecff;overflow:auto;display:none;}',
      '.dgan-wrap{max-width:880px;margin:24px auto;background:#121730;border:1px solid #2a3358;',
      'border-radius:14px;padding:18px 20px;box-shadow:0 20px 60px rgba(0,0,0,.6);}',
      '.dgan-head{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:14px;}',
      '.dgan-title{font-size:18px;font-weight:700;letter-spacing:.3px;}',
      '.dgan-badge{display:inline-block;margin-left:10px;font-size:11px;padding:3px 8px;border-radius:20px;vertical-align:middle;}',
      '.dgan-badge.on{background:#13351f;color:#5fe39a;}',
      '.dgan-badge.off{background:#2a2030;color:#e0a0c0;}',
      '.dgan-close{background:none;border:none;color:#9aa3c8;font-size:20px;cursor:pointer;line-height:1;}',
      '.dgan-close:hover{color:#fff;}',
      '.dgan-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:14px;}',
      '.dgan-kpi{background:#0d1228;border:1px solid #232a4d;border-radius:10px;padding:12px;text-align:center;}',
      '.dgan-kpi b{display:block;font-size:26px;color:#fff;}',
      '.dgan-kpi span{font-size:11px;color:#8b94bd;text-transform:uppercase;letter-spacing:.5px;}',
      '.dgan-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;}',
      '.dgan-card{background:#0d1228;border:1px solid #232a4d;border-radius:10px;padding:12px 14px;margin-bottom:12px;}',
      '.dgan-wide{grid-column:1 / -1;}',
      '.dgan-card h4{margin:0 0 10px;font-size:13px;color:#aeb6e0;font-weight:600;}',
      '.dgan-row{display:flex;align-items:center;gap:8px;margin:5px 0;font-size:12px;}',
      '.dgan-lbl{flex:0 0 150px;color:#c2c8e8;}',
      '.dgan-track{flex:1;height:14px;background:#1b2142;border-radius:7px;overflow:hidden;}',
      '.dgan-fill{display:block;height:100%;border-radius:7px;transition:width .3s;}',
      '.dgan-val{flex:0 0 40px;text-align:right;font-variant-numeric:tabular-nums;color:#fff;}',
      '.dgan-empty{color:#6b73a0;font-size:12px;padding:4px 0;}',
      '.dgan-ev{display:flex;gap:10px;font-size:11px;padding:3px 0;border-bottom:1px solid #1a2042;}',
      '.dgan-ev>span:first-child{flex:0 0 120px;color:#9fd0ff;}',
      '.dgan-ev-x{flex:1;color:#8b94bd;}',
      '.dgan-ev-t{flex:0 0 120px;text-align:right;color:#6b73a0;}',
      '.dgan-foot{display:flex;justify-content:space-between;align-items:center;margin-top:6px;font-size:11px;color:#8b94bd;}',
      '.dgan-actions button{background:#1b2142;border:1px solid #2a3358;color:#cdd3f0;border-radius:7px;',
      'padding:6px 12px;margin-left:8px;cursor:pointer;font-size:12px;}',
      '.dgan-actions button:hover{background:#252c52;}',
      '.dgan-hint{margin-top:12px;background:#161b38;border:1px dashed #34406e;border-radius:8px;',
      'padding:10px 12px;font-size:12px;color:#aeb6e0;}',
      '.dgan-hint code{background:#0d1228;padding:1px 5px;border-radius:4px;color:#9fd0ff;}',
      '@media(max-width:640px){.dgan-grid{grid-template-columns:1fr;}.dgan-stats{grid-template-columns:repeat(2,1fr);}',
      '.dgan-lbl{flex:0 0 100px;}.dgan-wrap{margin:8px;}}'
    ].join('');
    document.head.appendChild(s);
  }

  // ── toggle: Ctrl+Shift+S, en ?stats=1 in de URL ───────────────
  document.addEventListener('keydown', function (e) {
    if (e.ctrlKey && e.shiftKey && (e.key === 'S' || e.key === 's')) {
      e.preventDefault();
      var open = _panel && _panel.style.display === 'block';
      _renderDashboard(!open);
    }
  });

  // ── boot ──────────────────────────────────────────────────────
  _hookSaveLoad();
  _startSession();
  try {
    if (location.search.indexOf('stats=1') !== -1) {
      if (document.readyState === 'complete' || document.readyState === 'interactive') _renderDashboard(true);
      else document.addEventListener('DOMContentLoaded', function () { _renderDashboard(true); });
    }
  } catch (e) {}

  console.log('[DinoMon] Analytics geladen.' + (_cloudOn() ? ' (cloud aan)' : ' (lokaal — Ctrl+Shift+S voor dashboard)'));

})();

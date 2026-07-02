// integrity_scan.js — statische integriteits-sweep (testloop fases A5/A6/E1/G4).
// Checkt: dialogue-keys, encounter-tabellen, flag-referenties, audio/music-keys.
// Run: node integrity_scan.js   (exit 1 bij FAIL-issues)
'use strict';
const fs = require('fs');
globalThis.window = globalThis;
function L(f){ (0,eval)(fs.readFileSync(f,'utf8')); }
L('js/constants.js'); L('js/data/moves.js'); L('js/data/dinomons.js');
L('js/data/trainers.js'); L('js/data/story.js'); L('js/data/maps.js');

const issues = [];
const add = (sev,area,msg) => issues.push({sev,area,msg});
const DIA = (DG.STORY && DG.STORY.DIALOGUES) || {};
const KEYRE = /^[A-Z][A-Z0-9_]{2,}$/;   // ziet eruit als een dialogue-key

// ── E1: dialogue-keys ────────────────────────────────────────
(function(){
  const checkKey = (k, where) => {
    if (typeof k !== 'string' || !KEYRE.test(k)) return;         // vrije tekst = ok
    if (!DIA[k]) add('FAIL','E1',`dialogue-key '${k}' ontbreekt (${where}) — speler ziet de rauwe key`);
  };
  for (const mid in DG.MAPS) {
    for (const n of (DG.MAPS[mid].npcs || [])) {
      const d = n.dialogue;
      if (Array.isArray(d)) { if (d.length === 1) checkKey(d[0], mid+'/'+n.id); }
      else if (typeof d === 'string') checkKey(d, mid+'/'+n.id);
    }
  }
  for (const tid in DG.TRAINERS) {
    const t = DG.TRAINERS[tid];
    ['preBattleDialogue','postBattleDialogue','winDialogue','loseDialogue'].forEach(f=>{
      if (typeof t[f] === 'string') checkKey(t[f], 'trainer '+tid+'.'+f);
    });
  }
})();

// ── A5: encounter-tabellen ───────────────────────────────────
(function(){
  const ENC_TILES = new Set([2, 8]);       // tall grass + swamp/cave-floor
  for (const mid in DG.MAPS) {
    const m = DG.MAPS[mid];
    const et = m.encounterTable || {};
    for (const k of Object.keys(et)) {
      const list = et[k] || [];
      if (!list.length) continue;
      const sum = list.reduce((s,e)=>s+(e.rate||0),0);
      if (sum !== 100) add('WARN','A5',`${mid}.${k}: rates sommeren tot ${sum} (verwacht 100)`);
      list.forEach(e=>{
        if (e.minLv > e.maxLv) add('FAIL','A5',`${mid}.${k}: ${e.speciesId} minLv ${e.minLv} > maxLv ${e.maxLv}`);
        if (!DG.SPECIES[e.speciesId]) add('FAIL','A5',`${mid}.${k}: soort '${e.speciesId}' bestaat niet`);
      });
    }
    // encounter-tegels aanwezig maar geen tabel (of andersom)
    // NB: tegel 2 leest de grass-tabel; tegel 8 leest cave||grass. Steden/dorpen
    // mogen deco-gras zonder encounters hebben.
    const CITYLIKE = /CITY|TOWN|HAMLET/.test(mid);
    const hasGrassTile = (m.tiles||[]).some(row=>row.some(t=>t===2));
    const hasCaveTile  = (m.tiles||[]).some(row=>row.some(t=>t===8));
    const grassEntries = (et.grass||[]).length > 0;
    const caveEntries  = (et.cave ||[]).length > 0;
    if (!CITYLIKE) {
      if (hasGrassTile && !grassEntries)
        add('WARN','A5',`${mid}: gras-tegels (2) maar lege grass-tabel — encounters vuren daar niet`);
      const anyTable = grassEntries || caveEntries || (et.water||[]).length > 0;
      if (hasCaveTile && !caveEntries && !grassEntries && anyTable)
        add('WARN','A5',`${mid}: cave-tegels (8) maar geen cave/grass-tabel`);
      // (tegel 8 als pure deco-vloer zonder enige tabel = bewust encounter-vrij)
      if (!hasGrassTile && !hasCaveTile && (grassEntries || caveEntries))
        add('WARN','A5',`${mid}: encounter-tabel maar geen encounter-tegels (2/8) — tabel is dood`);
    }
  }
})();

// ── A6: flag-referenties vs toekenbare flags ─────────────────
(function(){
  // verzamel alle GEREFEREERDE flags
  const referenced = new Map();   // flag -> waar
  const ref = (f, where) => { if (f) referenced.set(f, where); };
  for (const mid in DG.MAPS) {
    const m = DG.MAPS[mid];
    (m.npcs||[]).forEach(n=>{ ref(n.requiresFlag, mid+'/'+n.id); ref(n.flagToHide, mid+'/'+n.id); });
    (m.warps||[]).forEach(w=>ref(w.requiresFlag, mid+' warp->'+w.targetMap));
    (m.events||[]).forEach(e=>ref(e.flagRequired, mid+' event'));
  }
  // verzamel alle TOEKENBARE flags
  const grantable = new Set();
  for (const tid in DG.TRAINERS) grantable.add('TRAINER_'+tid+'_DEFEATED');
  for (let b=1;b<=9;b++) grantable.add('BADGE_'+b);
  ['ROCK_SMASH','FLASH','CUT','STRENGTH','FLY','SURF','DIVE'].forEach(h=>grantable.add(h+'_UNLOCKED'));
  ['ELITE_1_DONE','ELITE_2_DONE','ELITE_3_DONE','ELITE_4_DONE','CHAMPION_DEFEATED','MEGA_AVAILABLE',
   'DIRECTOR_CLADE_DEFEATED','MASTERBALL_GIVEN'].forEach(f=>grantable.add(f));
  for (const mid in DG.MAPS) {
    (DG.MAPS[mid].events||[]).forEach(e=>{ if(e.flagSet) grantable.add(e.flagSet); });
    (DG.MAPS[mid].npcs||[]).forEach(n=>{
      if (n.quizCorrectFlag) grantable.add(n.quizCorrectFlag);
      if (n.quizWrongFlag)   grantable.add(n.quizWrongFlag);
      if (n.quizDoneFlag)    grantable.add(n.quizDoneFlag);
      if (n.flagOnInteract)  grantable.add(n.flagOnInteract);
    });
  }
  // flags gezet in overworld.js/events.js broncode (setFlag met stringliteral)
  const src = ['js/world/overworld.js','js/world/events.js','js/main.js','js/battle/battle.js']
    .map(f=>fs.readFileSync(f,'utf8')).join('\n');
  for (const m of src.matchAll(/setFlag\([^,]+,\s*['"`]([A-Z0-9_]+)['"`]/g)) grantable.add(m[1]);
  // template-vormen: elke template-literal `PREFIX_${...}` in de broncode telt
  // als toekenbaar prefix (vangt ook `const f = \`RIVAL_BATTLE_${n}_DONE\`` op).
  const prefixes = [];
  for (const m of src.matchAll(/`([A-Z][A-Z0-9_]{2,})\$\{/g)) prefixes.push(m[1]);
  for (const m of src.matchAll(/['"]([A-Z][A-Z0-9_]{2,}_)['"]\s*\+/g)) prefixes.push(m[1]);

  for (const [f, where] of referenced) {
    if (grantable.has(f)) continue;
    // prefix-vormen (BADGE_+n, TRAINER_+x, RIVAL_BATTLE_${n}_DONE): afgedekt
    if (/^TRAINER_.+_DEFEATED$/.test(f) || /^BADGE_\d+$/.test(f)) continue;
    if (prefixes.some(p => f.startsWith(p))) continue;
    add('WARN','A6',`flag '${f}' wordt vereist (${where}) maar nergens aantoonbaar gezet`);
  }
})();

// ── G4: music-keys ───────────────────────────────────────────
(function(){
  const audioSrc = fs.readFileSync('js/engine/audio.js','utf8');
  const need = new Set();
  for (const mid in DG.MAPS) { const mu = DG.MAPS[mid].music; if (mu) need.add(mu); }
  // battle-tracks: alleen echte playMusic('...')-aanroepen tellen
  const mainSrc = fs.readFileSync('js/main.js','utf8') + fs.readFileSync('js/world/overworld.js','utf8');
  for (const m of mainSrc.matchAll(/playMusic\(\s*['"`]([A-Z0-9_]+)['"`]/g)) need.add(m[1]);
  for (const key of need) {
    // track-definitie of case-behandeling in audio.js?
    if (!new RegExp(`['"\`]?${key}['"\`]?\\s*:`).test(audioSrc) && !audioSrc.includes(`'${key}'`) && !audioSrc.includes('"'+key+'"'))
      add('WARN','G4',`music-key '${key}' niet gevonden in audio.js (map/battle valt terug op stilte of default)`);
  }
})();

// ── rapport ──────────────────────────────────────────────────
const fails = issues.filter(i=>i.sev==='FAIL');
const warns = issues.filter(i=>i.sev==='WARN');
console.log('═══ Integriteits-sweep (E1/A5/A6/G4) ═══');
console.log(`FAIL: ${fails.length} | WARN: ${warns.length}`);
fails.forEach(i=>console.log(`  [FAIL ${i.area}] ${i.msg}`));
warns.forEach(i=>console.log(`  [warn ${i.area}] ${i.msg}`));
process.exit(fails.length ? 1 : 0);

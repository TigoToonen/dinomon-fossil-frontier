// Validate warp edge-consistency across all maps.
// Rule: if you LEAVE via the top edge of map A, you should ARRIVE near the
// bottom edge of map B (and vice-versa); left<->right likewise. A mismatch
// (leave top / arrive top) is what makes the player feel they "fell in from
// above". Indoor destinations are skipped (doors land you inside, not on an edge).
const fs = require('fs');
const src = fs.readFileSync('./js/data/maps.js', 'utf8');
globalThis.window = globalThis;
(0, eval)(src);
const MAPS = globalThis.DG.MAPS;

function edge(m, x, y) {
  const W = m.width, H = m.height;
  const d = { top: y, bot: H - 1 - y, left: x, right: W - 1 - x };
  const min = Math.min(d.top, d.bot, d.left, d.right);
  if (min > 2) return 'interior';
  if (min === d.top) return 'top';
  if (min === d.bot) return 'bot';
  if (min === d.left) return 'left';
  return 'right';
}
const opposite = { top: 'bot', bot: 'top', left: 'right', right: 'left' };

let issues = 0, checked = 0;
for (const id in MAPS) {
  const m = MAPS[id];
  if (!m.warps) continue;
  for (const w of m.warps) {
    const dst = MAPS[w.targetMap];
    if (!dst) { console.log(`[MISSING] ${id} -> ${w.targetMap} (no such map)`); issues++; continue; }
    const tx = w.targetX !== undefined ? w.targetX : w.destX;
    const ty = w.targetY !== undefined ? w.targetY : w.destY;
    if (tx === undefined || ty === undefined) continue;
    const se = edge(m, w.x, w.y);
    const de = edge(dst, tx, ty);
    // Only meaningful for outdoor->outdoor edge transitions
    if (m.isIndoor || dst.isIndoor) continue;
    if (se === 'interior' || de === 'interior') continue;
    checked++;
    if (de !== opposite[se]) {
      console.log(`[EDGE] ${id}(${w.x},${w.y} ${se}) -> ${w.targetMap}(${tx},${ty} ${de})  expected dest edge=${opposite[se]}`);
      issues++;
    }
  }
}
console.log(`\nChecked ${checked} outdoor edge-warps. Issues: ${issues}`);

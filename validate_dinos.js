const fs = require('fs');
const moveSrc = fs.readFileSync('./js/data/moves.js', 'utf8');
const dinoSrc = fs.readFileSync('./js/data/dinomons.js', 'utf8');

// Extract all valid move IDs
const validMoves = new Set([...moveSrc.matchAll(/^\s{2}([A-Z_0-9]+):\s*\{/gm)].map(m=>m[1]).filter(id=>id!=='DG'));
console.log('Valid moves loaded:', validMoves.size);

// Extract all _ls() calls
const lsCalls = [...dinoSrc.matchAll(/_ls\(([^)]+)\)/g)];
let totalEntries = 0, invalidRefs = [], totalSpecies = 0;
const learnsetSizes = [];

// Extract species blocks
const spBlocks = [...dinoSrc.matchAll(/_sp\(\s*'([^']+)'[\s\S]*?_ls\(([^)]+)\)/g)];
console.log('Species blocks with learnsets:', spBlocks.length);

// Count learnset entries per _ls call
for (const [full, name, lsArgs] of spBlocks) {
  totalSpecies++;
  // Count move entries: alternating level,move pattern
  const parts = lsArgs.split(',').map(s=>s.trim());
  let moveCount = 0;
  for (let i = 1; i < parts.length; i += 2) {
    const part = parts[i];
    if (!part) continue;
    if (part.startsWith('[')) {
      // Array entry - extract IDs
      const arrMatches = [...part.matchAll(/([A-Z_][A-Z_0-9]+)/g)].map(m=>m[1]);
      arrMatches.forEach(id => { if(id && !validMoves.has(id)) invalidRefs.push({species:name, move:id}); });
      moveCount++;
    } else {
      const id = part.replace(/['"]/g,'');
      if (id && /^[A-Z_]/.test(id) && !validMoves.has(id)) invalidRefs.push({species:name, move:id});
      if (id && /^[A-Z_]/.test(id)) moveCount++;
    }
  }
  learnsetSizes.push({name, count: moveCount});
}

// Size distribution
const s1 = learnsetSizes.filter((v,i)=>i<35);
const s2 = learnsetSizes.filter((v,i)=>i>=35&&i<65);
const s3 = learnsetSizes.filter((v,i)=>i>=65);
const avg = arr => (arr.reduce((a,b)=>a+b.count,0)/arr.length).toFixed(1);
const min = arr => Math.min(...arr.map(v=>v.count));
const max = arr => Math.max(...arr.map(v=>v.count));

console.log('\n=== LEARNSET SIZES ===');
console.log(`Stage 1 (${s1.length}): avg=${avg(s1)}, min=${min(s1)}, max=${max(s1)}`);
console.log(`Stage 2 (${s2.length}): avg=${avg(s2)}, min=${min(s2)}, max=${max(s2)}`);
console.log(`Stage 3 (${s3.length}): avg=${avg(s3)}, min=${min(s3)}, max=${max(s3)}`);

// Smallest learnsets
const small = learnsetSizes.filter(v=>v.count<7).sort((a,b)=>a.count-b.count);
if (small.length) {
  console.log('\n=== UNDERSIZED LEARNSETS (<7 moves) ===');
  small.forEach(v => console.log(` ${v.name}: ${v.count}`));
} else console.log('\nAll learnsets meet minimum size!');

console.log('\n=== INVALID MOVE REFS ===');
if (invalidRefs.length) invalidRefs.slice(0,20).forEach(r => console.log(` ${r.species}: ${r.move}`));
else console.log(' None!');

// Randomizer slots
const arrSlots = [...dinoSrc.matchAll(/\[[A-Z_0-9',\s]+\]/g)].length;
console.log('\nRandomizer slots (arrays):', arrSlots);

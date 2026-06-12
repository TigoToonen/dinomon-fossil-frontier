const fs = require('fs');

const content = fs.readFileSync('./js/data/dinomons.js', 'utf8');
const results = [];

// Extract all learnsets
const learnsetPattern = /(\w+):\s*_sp\([^)]*?_ls\(([\s\S]*?)\s*\)\s*,/g;

let match;
let totalSpecies = 0;

while ((match = learnsetPattern.exec(content)) !== null) {
  totalSpecies++;
  const speciesId = match[1];
  const lsContent = match[2];
  
  const moves = {};
  const parts = lsContent.split(',');
  
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i].trim();
    
    if (/^\d+$/.test(part)) {
      const level = parseInt(part);
      const nextPart = parts[i + 1].trim();
      
      if (nextPart.startsWith('[')) {
        let arrayContent = nextPart;
        let j = i + 1;
        while (!arrayContent.includes(']') && j < parts.length - 1) {
          j++;
          arrayContent += ',' + parts[j].trim();
        }
        
        const moveMatches = arrayContent.matchAll(/'([A-Z_0-9]+)'/g);
        for (const m of moveMatches) {
          const moveId = m[1];
          if (!moves[moveId]) moves[moveId] = [];
          moves[moveId].push(level);
        }
      } else if (nextPart.startsWith("'") && nextPart.endsWith("'")) {
        const moveId = nextPart.slice(1, -1);
        if (!moves[moveId]) moves[moveId] = [];
        moves[moveId].push(level);
      }
    }
  }
  
  // Find duplicates
  const duplicates = [];
  for (const [move, levels] of Object.entries(moves)) {
    const unique = [...new Set(levels)];
    if (unique.length > 1) {
      duplicates.push({
        move,
        levels: unique.sort((a, b) => a - b),
        hasLevel1: unique.includes(1),
        otherLevels: unique.filter(l => l > 1)
      });
    }
  }
  
  if (duplicates.length > 0) {
    results.push({ species: speciesId, duplicates });
  }
}

results.sort((a, b) => a.species.localeCompare(b.species));

console.log('=== DUPLICATE MOVES IN LEARNSETS ===\n');
console.log(`Analyzed ${totalSpecies} species.\n`);

if (results.length === 0) {
  console.log('NO DUPLICATE MOVES FOUND in any species learnset.');
  console.log('\nEvery move appears at most once per species.');
  console.log('No moves appear at both level 1 and a higher level.');
} else {
  console.log(`Found ${results.length} species with duplicate moves:\n`);
  results.forEach(r => {
    console.log(`${r.species}:`);
    r.duplicates.forEach(d => {
      const level1Note = d.hasLevel1 ? ` [APPEARS AT LEVEL 1 AND level${d.otherLevels.length > 1 ? 's' : ''} ${d.otherLevels.join(', ')}]` : '';
      console.log(`  - ${d.move}: levels ${d.levels.join(', ')}${level1Note}`);
    });
    console.log();
  });
}

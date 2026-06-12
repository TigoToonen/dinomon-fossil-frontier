const fs = require('fs');

const content = fs.readFileSync('./js/data/dinomons.js', 'utf8');
const results = [];

// Extract all learnsets
const learnsetPattern = /(\w+):\s*_sp\([^)]*?_ls\(([\s\S]*?)\s*\)\s*,/g;

let match;
while ((match = learnsetPattern.exec(content)) !== null) {
  const speciesId = match[1];
  const lsContent = match[2];
  
  const moves = {};
  
  // Split by commas first
  const parts = lsContent.split(',');
  
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i].trim();
    
    // Check if this part is a level number
    if (/^\d+$/.test(part)) {
      const level = parseInt(part);
      const nextPart = parts[i + 1].trim();
      
      // If next part starts with [, it's an array - extract moves from [...]
      if (nextPart.startsWith('[')) {
        // Find the closing bracket
        let arrayContent = nextPart;
        let j = i + 1;
        while (!arrayContent.includes(']') && j < parts.length - 1) {
          j++;
          arrayContent += ',' + parts[j].trim();
        }
        
        // Extract move names from array
        const moveMatches = arrayContent.matchAll(/'([A-Z_0-9]+)'/g);
        for (const m of moveMatches) {
          const moveId = m[1];
          if (!moves[moveId]) moves[moveId] = [];
          moves[moveId].push(level);
        }
      } else if (nextPart.startsWith("'") && nextPart.endsWith("'")) {
        // Single move
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

if (results.length === 0) {
  console.log('No duplicate moves found.');
} else {
  results.forEach(r => {
    console.log(`${r.species}:`);
    r.duplicates.forEach(d => {
      const level1Note = d.hasLevel1 ? ` (appears at LEVEL 1 AND level${d.otherLevels.length > 1 ? 's' : ''} ${d.otherLevels.join(', ')})` : '';
      console.log(`  - ${d.move}: ${d.levels.join(', ')}${level1Note}`);
    });
    console.log();
  });
}

console.log(`\nTotal species with duplicates: ${results.length}`);

const level1Dupes = results.filter(r => r.duplicates.some(d => d.hasLevel1));
console.log(`\nSpecies with Level 1 + Higher Level Duplicates: ${level1Dupes.length}`);
level1Dupes.forEach(r => {
  r.duplicates.filter(d => d.hasLevel1).forEach(d => {
    console.log(`  ${r.species}: ${d.move} (level 1 and level${d.otherLevels.length > 1 ? 's' : ''} ${d.otherLevels.join(', ')})`);
  });
});

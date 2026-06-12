const fs = require('fs');

const content = fs.readFileSync('./js/data/dinomons.js', 'utf8');

// Test with TINDRELonly
const pattern = /TINDREL:\s*_sp\([^)]*?_ls\(([\s\S]*?)\s*\)\s*,/;
const match = content.match(pattern);

if (match) {
  const lsContent = match[1];
  console.log('Raw content:');
  console.log(lsContent);
  console.log('\n---\n');
  
  const moves = {};
  const parts = lsContent.split(',');
  
  console.log('First 15 parts:');
  parts.slice(0, 15).forEach((p, i) => console.log(`${i}: "${p.trim()}"`));
  
  console.log('\n---\n');
  console.log('Parsing...');
  
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i].trim();
    
    if (/^\d+$/.test(part)) {
      const level = parseInt(part);
      const nextPart = parts[i + 1].trim();
      
      console.log(`Level ${level}, next: ${nextPart.substring(0, 30)}`);
      
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
          console.log(`  -> Array move: ${moveId} at level ${level}`);
          if (!moves[moveId]) moves[moveId] = [];
          moves[moveId].push(level);
        }
      } else if (nextPart.startsWith("'") && nextPart.endsWith("'")) {
        const moveId = nextPart.slice(1, -1);
        console.log(`  -> Single move: ${moveId} at level ${level}`);
        if (!moves[moveId]) moves[moveId] = [];
        moves[moveId].push(level);
      }
    }
  }
  
  console.log('\nCollected moves:');
  console.log(moves);
}

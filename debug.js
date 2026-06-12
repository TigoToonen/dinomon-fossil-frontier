const fs = require('fs');
const content = fs.readFileSync('./js/data/dinomons.js', 'utf8');

// Try finding just one species
const pattern = /TINDREL:\s*_sp\([^)]*?_ls\(([\s\S]*?)\s*\)\s*,/;
const match = content.match(pattern);

if (match) {
  console.log('Found TINDREL learnset:');
  console.log(match[1]);
  console.log('===');
  
  // Try to parse it manually
  const content = match[1];
  const tokens = content.split(/[\s,\[\]]+/).filter(t => t && t !== '');
  console.log('Tokens:', tokens.slice(0, 20));
} else {
  console.log('No match found');
}

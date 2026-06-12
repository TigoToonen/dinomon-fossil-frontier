/**
 * fix_quotes.js — fixes unescaped apostrophes in description strings in moves.js
 */
const fs = require('fs');
const filePath = './js/data/moves.js';
let content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');
let fixed = 0;

const result = lines.map(line => {
  // Only process description lines
  if (!line.trim().startsWith('description:')) return line;

  // Extract indent + key + value
  const m = line.match(/^(\s+description:\s+')(.*)(')(\s*,?\s*)$/);
  if (!m) return line;

  const [, prefix, inner, , suffix] = m;
  // Replace any apostrophe in inner that is NOT already preceded by a backslash
  let fixedInner = '';
  for (let i = 0; i < inner.length; i++) {
    if (inner[i] === "'" && (i === 0 || inner[i-1] !== '\\')) {
      fixedInner += "\\'";
      fixed++;
    } else {
      fixedInner += inner[i];
    }
  }

  return `${prefix}${fixedInner}'${line.endsWith(',') ? ',' : ''}`;
});

fs.writeFileSync(filePath, result.join('\n'), 'utf8');
console.log(`Fixed ${fixed} unescaped apostrophes in descriptions.`);

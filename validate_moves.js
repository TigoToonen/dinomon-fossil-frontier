const fs = require('fs');
const src = fs.readFileSync('./js/data/moves.js', 'utf8');

// Parse via eval in sandbox
let DG = {};
try {
  const code = src.replace(/^window\.DG\s*=\s*window\.DG\s*\|\|\s*\{\};?/, 'DG = {};')
                   .replace(/^DG\.MOVES\s*=/m, 'const MOVES =')
                   .replace(/window\.DG/g, 'DG');
  // simpler: just extract the object literal
} catch(e) {}

// Text-based analysis
const moveBlocks = [...src.matchAll(/^\s{2}([A-Z_0-9]+):\s*\{([\s\S]*?)^\s{2}\}/gm)];
console.log('Move blocks found:', moveBlocks.length);

// Type distribution
const typeCounts = {};
const animCounts = {};
const catCounts = {};
const missingFields = [];

for (const [full, id, body] of moveBlocks) {
  if (id === 'DG') continue;
  const type = (body.match(/type:\s*'([^']+)'/) || [])[1];
  const anim = (body.match(/animStyle:\s*'([^']+)'/) || [])[1];
  const cat  = (body.match(/category:\s*'([^']+)'/) || [])[1];
  const eff  = (body.match(/effect:\s*\{[^}]*type:\s*'([^']+)'/) || [])[1];
  if (type)  typeCounts[type] = (typeCounts[type]||0)+1;
  if (anim)  animCounts[anim] = (animCounts[anim]||0)+1;
  if (cat)   catCounts[cat]   = (catCounts[cat]||0)+1;
  if (!type || !anim || !cat || !eff) missingFields.push({id, type, anim, cat, eff});
}

console.log('\n=== TYPE DISTRIBUTION ===');
for (const [t,c] of Object.entries(typeCounts).sort((a,b)=>b[1]-a[1])) console.log(` ${t}: ${c}`);

console.log('\n=== ANIM STYLE DISTRIBUTION ===');
for (const [a,c] of Object.entries(animCounts).sort((a,b)=>b[1]-a[1])) console.log(` ${a}: ${c}`);

console.log('\n=== CATEGORY DISTRIBUTION ===');
for (const [c,n] of Object.entries(catCounts)) console.log(` ${c}: ${n}`);

console.log('\n=== MISSING FIELDS ===');
if (missingFields.length) missingFields.forEach(m => console.log(JSON.stringify(m)));
else console.log(' None - all moves complete!');

// Check anim diversity per type
console.log('\n=== ANIM DIVERSITY PER TYPE (checking no type >60% same style) ===');
const typeAnimMap = {};
for (const [full, id, body] of moveBlocks) {
  if (id === 'DG') continue;
  const type = (body.match(/type:\s*'([^']+)'/) || [])[1];
  const anim = (body.match(/animStyle:\s*'([^']+)'/) || [])[1];
  if (!type || !anim) continue;
  if (!typeAnimMap[type]) typeAnimMap[type] = {};
  typeAnimMap[type][anim] = (typeAnimMap[type][anim]||0)+1;
}
let diversityOk = true;
for (const [type, anims] of Object.entries(typeAnimMap)) {
  const total = Object.values(anims).reduce((a,b)=>a+b,0);
  for (const [anim, cnt] of Object.entries(anims)) {
    if (cnt/total > 0.6) {
      console.log(` WARNING: ${type} has ${cnt}/${total} (${Math.round(cnt/total*100)}%) as ${anim}`);
      diversityOk = false;
    }
  }
}
if (diversityOk) console.log(' All types have diverse animStyles!');

console.log('\n=== VALID ANIM STYLES ===');
const VALID_STYLES = new Set(['BEAM','PROJECTILE','BURST','WAVE','MELEE','FIELD','SELF','AURA','DRAIN','MULTI','ARC','CONE','SLAM','VORTEX','PULSE']);
const invalidStyles = Object.keys(animCounts).filter(s => !VALID_STYLES.has(s));
if (invalidStyles.length) console.log(' INVALID:', invalidStyles);
else console.log(' All animStyles valid!');

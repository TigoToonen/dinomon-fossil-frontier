const fs=require('fs'); globalThis.window=globalThis;
const load=f=>(0,eval)(fs.readFileSync(f,'utf8'));
['js/constants.js','js/data/moves.js','js/data/dinomons.js','js/data/trainers.js','js/data/maps.js'].forEach(load);
const M=DG.MAPS.FERNGROVE_GYM;
console.log('LOADED FERNGROVE_GYM tiles ('+M.tiles.length+' rows):');
M.tiles.forEach((r,y)=>console.log(('y'+y).padStart(3)+': '+r.map(t=>String(t).padStart(2)).join(' ')));

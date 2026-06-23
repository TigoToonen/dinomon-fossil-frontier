const fs=require('fs'); globalThis.window=globalThis;
const load=f=>(0,eval)(fs.readFileSync(f,'utf8'));
['js/constants.js','js/data/moves.js','js/data/dinomons.js','js/data/trainers.js','js/data/maps.js'].forEach(load);
['ROUTE_2','ROUTE_2A','ROUTE_2B'].forEach(id=>{
  const m=DG.MAPS[id]; if(!m){console.log(id,'(none)');return;}
  const g=(m.encounterTable&&m.encounterTable.grass||[]).map(e=>e.speciesId);
  console.log(id,'grass:',g.join(', ')||'(empty)');
});
const f=DG.SPECIES.FRONDLET||{};
console.log('FRONDLET fields:', Object.keys(f).join(','));
console.log('FRONDLET dex habitat:', (DG.SPECIES.DEX_FLAVOR&&'')||'', f.habitat||f.dexHabitat||'(none on species obj)');
// search any map grass tables containing FRONDLET
const hits=[];
for(const id in DG.MAPS){const m=DG.MAPS[id];const et=m.encounterTable;if(!et)continue;for(const k in et){if((et[k]||[]).some(e=>e.speciesId==='FRONDLET'))hits.push(id+'.'+k);}}
console.log('FRONDLET appears in encounter tables:', hits.join(', ')||'(none)');

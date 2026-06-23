const fs=require('fs'); globalThis.window=globalThis;
const load=f=>(0,eval)(fs.readFileSync(f,'utf8'));
['js/constants.js','js/data/moves.js','js/data/dinomons.js','js/data/trainers.js','js/data/maps.js'].forEach(load);
['ROUTE_3A','ROUTE_3B','ROUTE_4A','ROUTE_4B','ROUTE_4C'].forEach(id=>{
  const m=DG.MAPS[id]; if(!m){console.log(id,'(none)');return;}
  const g=(m.encounterTable&&m.encounterTable.grass||[]).map(e=>e.speciesId);
  console.log(id,'grass:',g.join(', ')||'(empty)');
});
['LEAFAWN','SPRIGDON','LEAFCUB'].forEach(s=>{
  const hits=[];
  for(const id in DG.MAPS){const et=DG.MAPS[id].encounterTable;if(!et)continue;for(const k in et){if((et[k]||[]).some(e=>e.speciesId===s))hits.push(id+'.'+k);}}
  console.log(s,'->',hits.join(', ')||'(none)');
});

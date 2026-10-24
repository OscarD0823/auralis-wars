import fs from 'node:fs';
import {RACE_HERALDRY,FACTION_HERALDRY,emblemSvg} from '../dist/heraldry.js';
const root=new URL('../dist/auralis/',import.meta.url);
for(const[group,clan,folder]of[[RACE_HERALDRY,false,'icons'],[FACTION_HERALDRY,true,'factions']]){
 fs.mkdirSync(new URL(folder+'/',root),{recursive:true});
 for(const id of Object.keys(group))fs.writeFileSync(new URL(folder+'/'+id+'.svg',root),emblemSvg(id,clan));
}
console.log('Cuatro escudos de civilización y ocho emblemas de clan propios.');

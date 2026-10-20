import {BUILDINGS,UNITS} from './catalog.js';
import {PROGRESSION} from './progression-data.js';

export function experience(state){
 const xp=Math.max(0,state.xp||0),levels=PROGRESSION.levels;let level=1;
 while(level<levels.length&&xp>=levels[level])level++;
 const start=levels[level-1],next=levels[level]??null;
 return{level,xp,start,next,remaining:next===null?0:Math.max(0,next-xp),ratio:next===null?1:Math.min(1,(xp-start)/Math.max(1,next-start))};
}
// Archived XP thresholds, with unlocks fitted to Auralis' ten headquarters levels.
export function unlockLevel(type,unit=false){const spec=(unit?UNITS:BUILDINGS)[type];if(!spec)return Infinity;const archived=(unit?PROGRESSION.units:PROGRESSION.buildings)[type]||1;return Math.max(1,Math.min(archived,1+(spec.hq-1)*2));}
export function unlockMessage(state,type,unit=false){const required=unlockLevel(type,unit);return experience(state).level<required?'Necesitas nivel de comandante '+required+'.':'';}
export function futureUnlocks(state){const level=experience(state).level,hq=state.buildings.find(b=>b.type==='hq')?.level||1;return[...Object.values(BUILDINGS).filter(b=>b.id!=='hq').map(b=>({type:b.id,name:b.name,level:unlockLevel(b.id),hq:b.hq,unit:false})),...Object.values(UNITS).map(u=>({type:u.id,name:u.name,level:unlockLevel(u.id,true),hq:u.hq,unit:true}))].filter(x=>x.level>level||x.hq>hq).sort((a,b)=>a.hq-b.hq||a.level-b.level);}

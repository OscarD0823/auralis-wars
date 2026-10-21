import * as E from './engine.js';
import {surface} from './world.js';
// Isolated training scenario. No archived player's identity, account or inventory.
export function createAdvancedBase(){const s=E.createIslandState(341,'easy');s.tutorial=true;s.xp=110000;s.nextRaid=1e12;s.world.owned=[24,25,26,27,28,34,35,36,37,38,44,45,46,47,48,54,55,56,57,58,64,65,66,67,68];s.world.revision++;
 for(let y=20;y<70;y++)for(let x=30;x<80;x++)if(surface(s,x,y)==='grass')s.cleared.push(x+':'+y);
 s.buildings=s.buildings.filter(b=>b.type==='hq');for(const b of s.buildings){b.level=10;b.hp=E.buildingStats(b.type,10).hp;b.stored=0;}
 const points=[];for(let y=20;y<70;y++)for(let x=30;x<80;x++)points.push({x,y,d:Math.abs(x-51)+Math.abs(y-41)});points.sort((a,b)=>a.d-b.d);
 const types=[...Object.keys(E.BUILDINGS).filter(t=>t!=='hq'&&t!=='bridge'&&!E.BUILDINGS[t].archive),...Array(7).fill('house'),...Array(3).fill('storage'),...Array(6).fill('bunker'),...Array(5).fill('tower')];
 for(const type of types){const size=E.BUILDINGS[type].size,p=points.find(p=>!s.buildings.some(b=>p.x<b.x+E.BUILDINGS[b.type].size+1&&p.x+size+1>b.x&&p.y<b.y+E.BUILDINGS[b.type].size+1&&p.y+size+1>b.y)&&E.placement(s,type,p.x,p.y).ok);if(!p)continue;s.buildings.push({id:'b'+s.serial++,type,x:p.x,y:p.y,level:10,hp:E.buildingStats(type,10).hp,stored:0,job:null,...(E.isFactory(type)?{productionMode:'cycles'}:{})});}
 // Fortified districts leave regular gates for workers and vehicles.
 for(const p of points.filter(p=>(p.x===38||p.x===68||p.y===28||p.y===60)&&p.x>=38&&p.x<=68&&p.y>=28&&p.y<=60&&p.x%7!==0&&p.y%7!==0)){if(E.placement(s,'wall',p.x,p.y).ok)s.buildings.push({id:'b'+s.serial++,type:'wall',x:p.x,y:p.y,level:10,hp:E.buildingStats('wall',10).hp,stored:0,job:null});}
 s.army=Object.keys(E.UNITS).filter(t=>!E.UNITS[t].archive).map(t=>E.makeUnit(s,t,3));for(const k of E.RESOURCE_KEYS)s.resources[k]=Math.min(35000,E.storageCap(s));E.initGarrison(s);E.log(s,'Base de demostración: puedes probar todas las instalaciones sin modificar tu partida.');return s;}

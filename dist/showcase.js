import {contactFaction} from './diplomacy.js';
import * as E from './engine.js';
import {surface} from './world.js';
export const DEMO_DISTRICTS={industry:{name:'Distrito industrial',x:43,y:31},logistics:{name:'Reservas protegidas',x:55,y:42},housing:{name:'Barrio de viviendas',x:64,y:42},military:{name:'Academias y reunión',x:42,y:50},science:{name:'Investigación y prototipos',x:54,y:28},air:{name:'Aviación y puerto',x:64,y:54}};
const lane=(x,y)=>[46,50,56,62].includes(x)||[32,39,46,54,60].includes(y);
function district(type){if(type==='house')return'housing';if(['storage','market','embassy'].includes(type))return'logistics';if(['air','heliport','stealth','shipyard'].includes(type))return'air';if(E.BUILDINGS[type].kind==='science'||type==='fusion')return'science';if(E.BUILDINGS[type].resource||E.isWonder(type))return'industry';return'military';}
// Isolated scenario: deliberate districts and lanes, not a historical player's account.
export function createAdvancedBase(race='aurora'){
 const s=E.createIslandState(341,'easy');s.tutorial=true;s.xp=110000;s.nextRaid=1e12;
 s.world.owned=[24,25,26,27,28,34,35,36,37,38,44,45,46,47,48,54,55,56,57,58,64,65,66,67,68];s.world.revision++;
 for(const b of s.world.bridges)b.broken=false;
 for(let y=20;y<70;y++)for(let x=30;x<80;x++)if(surface(s,x,y)==='grass')s.cleared.push(x+':'+y);
 s.buildings=s.buildings.filter(b=>b.type==='hq');for(const b of s.buildings){b.level=10;b.hp=E.buildingStats(b.type,10).hp;b.stored=0;}
 s.showcase={districts:DEMO_DISTRICTS};
 const points=[];for(let y=20;y<70;y++)for(let x=30;x<80;x++)points.push({x,y});
 const types=[...Object.keys(E.BUILDINGS).filter(t=>t!=='hq'&&t!=='bridge'&&!E.BUILDINGS[t].archive),'swb139','swb70','swb176',...Array(7).fill('house'),...Array(3).fill('storage'),...Array(5).fill('bunker'),...Array(5).fill('tower')];
 let defenseIndex=0;
 const approaches=[{x:38,y:39},{x:50,y:25},{x:62,y:63},{x:68,y:46},{x:38,y:54},{x:56,y:25}];
 for(const type of types){
  const size=E.BUILDINGS[type].size,target=E.BUILDINGS[type].kind==='defense'?approaches[defenseIndex++%approaches.length]:DEMO_DISTRICTS[district(type)];
  const ordered=[...points].sort((a,b)=>Math.abs(a.x-target.x)+Math.abs(a.y-target.y)-Math.abs(b.x-target.x)-Math.abs(b.y-target.y));
  const p=ordered.find(p=>{for(let y=p.y;y<p.y+size;y++)for(let x=p.x;x<p.x+size;x++)if(lane(x,y))return false;return !s.buildings.some(b=>p.x<b.x+E.BUILDINGS[b.type].size+1&&p.x+size+1>b.x&&p.y<b.y+E.BUILDINGS[b.type].size+1&&p.y+size+1>b.y)&&E.placement(s,type,p.x,p.y).ok;});
  if(!p)continue;
  s.buildings.push({id:'b'+s.serial++,type,x:p.x,y:p.y,level:10,hp:E.buildingStats(type,10).hp,stored:0,job:null,...(E.isFactory(type)?{productionMode:'cycles'}:{})});
 }
 // Gates align with circulation lanes; walls enclose the reserves and headquarters.
 for(const p of points.filter(p=>(p.x===38||p.x===68||p.y===25||p.y===63)&&p.x>=38&&p.x<=68&&p.y>=25&&p.y<=63&&!lane(p.x,p.y)))if(E.placement(s,'wall',p.x,p.y).ok)s.buildings.push({id:'b'+s.serial++,type:'wall',x:p.x,y:p.y,level:10,hp:E.buildingStats('wall',10).hp,stored:0,job:null});
 s.army=Object.keys(E.UNITS).filter(t=>!E.UNITS[t].archive).map(t=>E.makeUnit(s,t,3));for(const k of E.RESOURCE_KEYS)s.resources[k]=Math.min(35000,E.storageCap(s));
 E.specialState(s).credits=20;E.initGarrison(s);
 // Finished examples let players try collection and cancellation in the isolated
 // demonstration, without waiting or advancing their real campaign.
 const camera=s.buildings.find(b=>b.type==='fusion'),parents=['rifle','jeep'].map(type=>E.makeUnit(s,type,3));s.army.push(...parents);
 const q=E.fusionQuote(s,camera.id,parents.map(u=>u.id));
 if(!q.ok)throw Error('Demostración de fusión: '+q.message);
 E.startFusion(s,camera.id,parents.map(u=>u.id));E.tickEconomy(s,q.duration,false);
 for(const type of ['robotics','swb139'])s.special.centers[type]={index:0,step:10,job:null};
 const wonder=s.buildings.find(b=>b.type==='swb70');wonder.stored=3600;wonder.wonder.remaining=1;wonder.wonder.legacy=false;
 for(const id of [2,4])for(const item of E.COLLECTIONS.find(c=>c.id===id).items)s.inventory.items[item]=1;
 for(const item of E.COLLECTIONS.find(c=>c.id===6).items.slice(0,3))s.inventory.items[item]=2;
 E.chooseRace(s,race);for(const f of E.FACTIONS){const r=contactFaction(s,f.id);r.reputation=26;}E.relation(s,'faro').status='ally';E.relation(s,'liga').status='ally';E.relation(s,'ceniza').status='war';E.civilization(s).morality=18;E.searchIsland(s,2,'forest');
 // Space the demonstration's unusually large garrison along open lanes.
 // Ground troops must not spawn inside workshops or on top of one another.
 const hq=s.buildings.find(b=>b.type==='hq'),used=[],land=[],water=[];
 for(let y=20;y<80;y++)for(let x=25;x<85;x++){
  const p={x:x+.5,y:y+.5},ground=E.groundAt(s,x,y);
  if(s.buildings.some(b=>{const n=E.BUILDINGS[b.type].size;return p.x>b.x-.35&&p.x<b.x+n+.35&&p.y>b.y-.35&&p.y<b.y+n+.35;}))continue;
  if(ground==='grass')land.push(p);else if(ground==='water')water.push(p);
 }
 const distance=p=>Math.hypot(p.x-hq.x,p.y-hq.y);
 land.sort((a,b)=>distance(a)-distance(b));water.sort((a,b)=>Math.hypot(a.x-62,a.y-72)-Math.hypot(b.x-62,b.y-72));
 for(const u of s.army){const naval=E.UNITS[u.type].waterborne,p=(naval?water:land).find(p=>used.every(q=>Math.hypot(p.x-q.x,p.y-q.y)>=2.1));if(!p)continue;Object.assign(u,{x:p.x,y:p.y,facing:1.1,moving:false,order:null});used.push(p);}
 E.log(s,'Demostración: prototipos y fusión listos, y una última recogida de Inca God para probar la restauración. Tu partida principal se conserva.');return s;
}

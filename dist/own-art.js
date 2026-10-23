import {BUILDINGS,UNITS} from './catalog.js';
import {RACES,factionById} from './diplomacy.js';
export const OWN_BUILDINGS={hq:0,house:1,goldmine:2,lumber:3,supply:4,metal:5,storage:6,infantry:7,range:7,vehicle:8,builders:8,armor:8,missileworks:8,air:9,heliport:9,stealth:9,research:10,robotics:10,fusion:10,tower:11,cannon:12,wall:13,hospital:14,embassy:15,market:15,bunker:12,fortress:0,shipyard:6};
export function ownFamily(type){const b=BUILDINGS[type];if(!b)return null;if(Object.hasOwn(OWN_BUILDINGS,type))return OWN_BUILDINGS[type];if(b.resource)return({gold:2,wood:3,supply:4,metal:5})[b.resource];return({command:0,economy:1,production:5,military:7,science:10,defense:b.size===1?11:12,support:15,infrastructure:6,decoration:15,scenario:6})[b.kind]??(b.attack?12:10);}
export const raceId=id=>Object.hasOwn(RACES,id)?id:'aurora';
// Captured settlements keep local architecture; unaffiliated enemies never
// accidentally inherit the player's selected appearance.
export function visualRace(state,entity={}){return factionById(entity.faction)?.race||raceId(entity.side==='enemy'?null:state.civilization?.race);}
export function ownActorFamily(type){
 if(type==='settler')return 0;
 const u=UNITS[type];if(!u||u.archive)return null;
 if(u.waterborne)return 9;
 if(u.heal||u.repair)return 3;
 if(type==='exosoldier')return 2;
 if(type==='rocketjeep')return 4;
 if(u.flying)return /plane|starship/.test(u.model)?8:/mecha/.test(u.model)?2:7;
 if(u.heavy)return /missile|bulwark/.test(u.model)?(/artillery|missile/.test(type)?6:5):4;
 return u.weapon==='rocket'||['grenadier','flame','exosoldier'].includes(type)?2:1;
}
export const ACTOR_SEQUENCES={idle:[0],walk:[1,0,2,0],gather:[3,4,3,0],carry:[5],attack:[3,4,5,3],death:[0]};
export function ownActorScale(type){const family=ownActorFamily(type);if(family===null)return null;if(family===2)return type==='titan'?1:.62;if(family===7)return ['scout','drone'].includes(type)?.85:1.5;if(family===9)return type==='frigate'?2.1:1.5;return ({0:.44,1:.44,3:.44,4:1.05,5:1.35,6:1.4,8:1.6})[family];}
let metadata,racialMetadata,sheet;
const thumbs=new Map(),variants=new Map(),ownImages=new Map(),requests=new Map(),listeners=new Set();
export const onOwnArtLoaded=fn=>{listeners.add(fn);return()=>listeners.delete(fn);};
export const ownImage=url=>ownImages.get(url);
export function loadOwnImage(url){
 if(ownImages.has(url))return Promise.resolve(ownImages.get(url));
 if(requests.has(url))return requests.get(url);
 const p=new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>{ownImages.set(url,i);requests.delete(url);for(const fn of listeners)fn();resolve(i);};i.onerror=()=>{requests.delete(url);reject(Error('No se pudo cargar el arte de esta civilización.'));};i.src=url;});requests.set(url,p);return p;
}
export const ownArtReady=typeof document==='undefined'?Promise.resolve():Promise.all([
 fetch(new URL('./auralis/buildings.json',import.meta.url)).then(r=>{if(!r.ok)throw Error('Catálogo Auralis no disponible');return r.json();}),
 loadOwnImage(new URL('./auralis/buildings.png',import.meta.url).href),
 fetch(new URL('./auralis/races/atlas.json',import.meta.url)).then(r=>{if(!r.ok)throw Error('Catálogo de civilizaciones no disponible');return r.json();})
]).then(([data,image,races])=>{metadata=data;sheet=image;racialMetadata=races;});
export function ownAsset(type,level=1,race='aurora'){
 const family=ownFamily(type);if(family===null||!metadata)return null;
 race=raceId(race);const data=race==='aurora'?metadata:racialMetadata?.[race]?.buildings;if(!data)return null;
 const frame=data.frames[family],key=race+':b:'+family+':'+level;
 if(!variants.has(key))variants.set(key,{file:new URL(race==='aurora'?'./auralis/buildings.png':'./auralis/races/'+race+'-buildings.png',import.meta.url).href,frames:[frame],states:{idle:[[0]]},displayWidth:frame[2],own:true,race,family,level});return variants.get(key);
}
export function ownActorAsset(type,level=1,race='aurora'){
 const family=ownActorFamily(type);race=raceId(race);const data=racialMetadata?.[race]?.actors;if(family===null||!data)return null;
 const key=race+':u:'+family+':'+level;if(variants.has(key))return variants.get(key);
 const vehicle=family>=4,indices=vehicle?[24+family-4]:Array.from({length:6},(_,i)=>family*6+i),frames=indices.map(i=>data.frames[i]),anchors=indices.map(i=>data.anchors[i]);
 const states=Object.fromEntries(Object.entries(ACTOR_SEQUENCES).map(([name,seq])=>[name,[vehicle?[0]:name==='attack'&&family===3?[3,4,3]:seq]]));
 const result={file:new URL('./auralis/races/'+race+'-actors.png',import.meta.url).href,frames,anchors,states,displayWidth:vehicle?frames[0][2]:data.scales[family],ownActor:true,vehicle,race,family,level};variants.set(key,result);return result;
}
export function ownThumbnail(type,level=1,race='aurora',unit=false){
 const a=unit?ownActorAsset(type,level,race):ownAsset(type,level,race);if(!a)return'';const key=a.race+':'+(unit?'u':'b')+a.family+':'+level;if(thumbs.has(key))return thumbs.get(key);
 const image=ownImage(a.file);if(!image){loadOwnImage(a.file).catch(()=>{});return'';}
 const c=document.createElement('canvas');c.width=180;c.height=170;const x=c.getContext('2d'),f=a.frames[0],scale=Math.min(166/f[2],151/f[3]);
 x.drawImage(image,...f,(180-f[2]*scale)/2,158-f[3]*scale,f[2]*scale,f[3]*scale);
 if(level>1&&!unit){x.fillStyle='#234655';x.fillRect(58,155,64,12);x.fillStyle='#e8c476';x.fillRect(60,157,60*Math.min(10,level)/10,8);}
 const url=c.toDataURL('image/png');thumbs.set(key,url);return url;
}
export const ownSheet=()=>sheet;

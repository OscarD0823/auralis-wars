import {HOME_MAP_DATA} from './home-map-data.js';
import{createHomePatrols}from'./home-patrols.js';
import{surface}from'./world.js';
import {SOURCE_MAP,BUILDINGS,UNITS,buildingStats,unitStats,DIFFICULTIES} from './catalog.js';
const fail=message=>({ok:false,message}),ok=message=>({ok:true,message});
export const HOME_RESPAWN_MS=3*60*60*1000;
export const isHome=s=>!!s.world&&!s.world.mission&&s.world.layout==='MAP_PLAYER_1'&&!s.world.procedural;
export const homeEnemies=s=>s.homeland?.units.filter(u=>u.hp>0)||[];
export const homeRoamers=s=>s.homeland?.roamers?.filter(u=>u.hp>0)||[];
export const homeDefenses=s=>s.homeland?.buildings.filter(b=>b.hp>0&&b.side==='enemy'&&b.attack>0)||[];
export const homeObject=(s,id)=>(s.battle?.kind==='homeland'?[...s.battle.units,...s.battle.buildings]:[...(s.homeland?.units||[]),...(s.homeland?.roamers||[]),...(s.homeland?.buildings||[])]).find(o=>o.id===id);
export const homeStructures=s=>s.homeland?.buildings||[];
export const homeCountdown=(s,now=Date.now())=>Math.max(0,Math.ceil(((s.homeland?.nextAt||0)-now)/1000));
export const homeCombatClear=b=>!b.units.some(u=>u.side==='enemy'&&u.hp>0&&!u.roamer)&&!b.buildings.some(v=>v.side==='enemy'&&v.attack>0&&v.hp>0);
const factories=new Set(Object.values(UNITS).map(u=>u.factory));
const mid=o=>({x:o.x+(o.width||o.size||0)/2,y:o.y+(o.height||o.size||0)/2});
const overlap=(a,b)=>a.x<b.x+(b.width||BUILDINGS[b.type].size)&&a.x+(a.width||BUILDINGS[a.type].size)>b.x&&a.y<b.y+(b.height||BUILDINGS[b.type].size)&&a.y+(a.height||BUILDINGS[a.type].size)>b.y;
export function homePurpose(o){
 if(o.landmark)return'landmark';if(o.scenery)return'resource';if(o.side==='neutral')return'objective';
 if(o.attack>0)return'defense';if(factories.has(o.type))return'barracks';
 if(BUILDINGS[o.type]?.resource||BUILDINGS[o.type]?.storage||o.sourceId===200||o.sourceId===202)return'logistics';
 if(o.sourceId===206||o.type==='wall')return'wall';return'infrastructure';
}
export function createHomeland({makeUnit,initGarrison,log,population,populationCap}){
 const retryAt=new WeakMap();
 function content(s,layout,wave=1){
  const objects=layout===1?HOME_MAP_DATA.objects:HOME_MAP_DATA.chapters.find(c=>c.number===layout)?.objects;
  if(!objects)throw Error('Plano del archipiélago desconocido.');
  const units=[],buildings=[],grade=Math.min(5,1+Math.floor((wave-1)/3));
  for(const o of [...HOME_MAP_DATA.landmarks.map(o=>({...o,landmark:true,neutral:true})),...objects]){
   const ref=SOURCE_MAP[o.id];if(!ref)throw Error('Falta una referencia del archipiélago: '+o.id);
   if(UNITS[ref.type]){
    const u=makeUnit({serial:1,research:{}},ref.type,grade);Object.assign(u,{id:'hmu-'+o.key,sourceId:o.id,side:'enemy',x:o.x+.5,y:o.y+.5,cooldown:0,guard:{x:o.x+.5,y:o.y+.5},order:{kind:'hold',x:o.x+.5,y:o.y+.5},damageScale:DIFFICULTIES[s.difficulty].damage});units.push(u);continue;
   }
   const level=Math.min(10,ref.level+Math.floor((wave-1)/3)),st=buildingStats(ref.type,level),neutral=o.neutral||o.landmark||['resource','decoration'].includes(ref.role)||o.tag==='key'||o.tag==='prison';
   const b={id:(o.landmark?'hml-':'hmb-')+o.key,sourceId:o.id,type:ref.type,level,x:o.x-ref.width+1,y:o.y-ref.height+1,width:ref.width,height:ref.height,size:Math.max(ref.width,ref.height),hp:st.hp,maxHp:st.hp,side:neutral?'neutral':'enemy',attack:neutral?0:st.attack||0,range:st.range||0,landmark:!!o.landmark,scenery:['resource','decoration'].includes(ref.role),tag:o.tag||'',cooldown:0};
   b.purpose=homePurpose(b);buildings.push(b);
  }
  const candidates=buildings.filter(b=>b.side==='enemy'&&!['wall','defense'].includes(b.purpose));
  const core=candidates.find(b=>b.purpose==='logistics')||candidates.find(b=>b.purpose==='barracks')||candidates[0];
  return{units,buildings,commandId:core?.id||null};
 }
 function init(s,now=Date.now()){
  if(!isHome(s))return null;
  if(!s.homeland){s.homeland={version:2,wave:1,layout:1,completed:false,rewarded:false,keyTaken:false,rescued:false,nextAt:0,pendingSoldiers:0,rescuedTotal:0,history:[],stock:{gold:400,wood:400,supply:400,metal:400},...content(s,1)};s.world.revision++;}
  const h=s.homeland;
  if(h.version===1){
   Object.assign(h,{version:2,wave:1,layout:1,keyTaken:h.completed,rescued:h.completed,nextAt:h.completed?now+HOME_RESPAWN_MS:0,pendingSoldiers:h.completed?4:0,rescuedTotal:h.completed?4:0,history:[],stock:{gold:400,wood:400,supply:400,metal:400},commandId:null});
   for(const b of h.buildings)b.purpose=homePurpose(b);
   const candidates=h.buildings.filter(b=>b.side==='enemy'&&!['wall','defense'].includes(b.purpose));h.commandId=(candidates.find(b=>b.purpose==='logistics')||candidates.find(b=>b.purpose==='barracks')||candidates[0])?.id||null;
   if(h.completed)log(s,'El rescate anterior se conserva: cuatro soldados esperan alojamiento. El siguiente asentamiento llegará dentro de tres horas.');
  }
  if(!h.roamers)h.roamers=createHomePatrols(s,h,makeUnit);
  if(s.battle?.kind==='homeland'&&!s.battle.homeState)s.battle.homeState={skirmish:h.completed,wave:h.wave,commandId:h.commandId,keyTaken:h.keyTaken,rescued:false,captured:false,stock:{...h.stock},reinforced:0,nextRecruit:s.battle.elapsed+45};
  return h;
 }
 function tick(s,now=Date.now()){
  const h=init(s,now);if(!h||!h.completed||!h.nextAt||now<h.nextAt||s.battle)return false;
  if((retryAt.get(s)||0)>now)return false;retryAt.set(s,now+10000);
  const order=[2,3,4],offset=(h.wave-1)%order.length;
  for(let i=0;i<order.length;i++){
   const layout=order[(offset+i)%order.length],next=content(s,layout,h.wave+1);
   if(next.buildings.some(b=>!b.landmark&&s.buildings.some(p=>overlap(b,p))))continue;
   // Never transplant a new camp onto the player's existing construction.
   Object.assign(h,next,{wave:h.wave+1,layout,completed:false,rewarded:false,keyTaken:false,rescued:false,nextAt:0,noSpace:false,stock:{gold:400+h.wave*120,wood:400+h.wave*120,supply:400+h.wave*120,metal:400+h.wave*120}});
   h.roamers=createHomePatrols(s,h,makeUnit);s.world.revision++;log(s,'Nueva base enemiga en el archipiélago: oleada '+h.wave+'. Reconoce su mando, defensas y logística antes de atacar.');return true;
  }
  h.noSpace=true;return false;
 }
 function clear(b){
  if(b.homeState?.skirmish)return !b.units.some(u=>u.side==='enemy'&&u.hp>0);
  if(!homeCombatClear(b))return false;
  if((b.homeState?.wave||1)===1)return !!b.homeState?.rescued;
  const command=b.buildings.find(v=>v.id===b.homeState?.commandId);
  return !command||command.hp<=0||b.homeState.captured;
 }
 function start(s){
  const h=init(s);if(!h)return fail('Este escenario no tiene un archipiélago principal.');if(s.battle)return fail('Termina la operación actual.');if(h.completed&&!homeRoamers(s).length)return fail('La siguiente base llegará cuando termine el contador.');if(!s.army.length)return fail('Entrena un ejército para explorar y asegurar la isla.');
  initGarrison(s);for(const u of s.army){u.homePosition={x:u.x,y:u.y};u.side='player';u.order={kind:'hold',x:u.x,y:u.y};u.cooldown=0;}
  const front=s.army[0];
  s.battle={kind:'homeland',name:h.completed?'Escaramuza contra patrullas':h.wave===1?'Rescate en territorio orco':'Base enemiga · Oleada '+h.wave,seed:s.seed,world:s.world,start:{x:front.x,y:front.y},elapsed:0,limit:1800,units:[...s.army,...[...(!h.completed?h.units:[]),...(h.roamers||[])].filter(u=>u.hp>0).map(u=>({...u,order:{kind:'hold',x:u.x,y:u.y},damageScale:DIFFICULTIES[s.difficulty].damage}))],buildings:[...s.buildings.map(v=>({...v,maxHp:buildingStats(v.type,v.level).hp,side:'player',attack:buildingStats(v.type,v.level).attack||0})),...h.buildings.map(v=>({...v}))],reserve:[],effects:[],serial:0,initialBuildings:h.buildings.filter(b=>b.side==='enemy').length,reward:{},homeState:{skirmish:h.completed,wave:h.wave,commandId:h.commandId,keyTaken:h.keyTaken,rescued:false,captured:false,stock:{...h.stock},reinforced:Math.max(0,...h.units.map(u=>Number(/^hmu-r(\d+)$/.exec(u.id)?.[1]||0))),nextRecruit:45}};
  s.army=[];s.lastBattle=null;log(s,'Operación en el archipiélago. La IA protege sus posiciones y las bajas propias son permanentes.');return ok('Dirige las tropas sobre el mismo mapa. Revisa los objetivos del archipiélago.');
 }
 function interact(s,id,now=Date.now()){
  const b=s.battle;if(b?.kind!=='homeland')return fail('Inicia la operación del archipiélago para interactuar con el objetivo.');
  const h=init(s),hs=b.homeState??={wave:h.wave,keyTaken:h.keyTaken,commandId:h.commandId},o=b.buildings.find(v=>v.id===id);if(!o)return fail('Objetivo no disponible.');
  const p=mid(o),near=b.units.some(u=>u.side==='player'&&u.hp>0&&!u.embarked&&Math.hypot(u.x-p.x,u.y-p.y)<6);
  if(!near)return fail('Acerca una tropa a menos de seis casillas del objetivo.');
  if(o.tag==='key'){
   if(hs.keyTaken)return fail('Tu ejército ya tiene la llave.');if(b.units.some(u=>u.side==='enemy'&&u.hp>0&&Math.hypot(u.x-p.x,u.y-p.y)<10))return fail('Derrota primero a los guardias de la llave.');
   hs.keyTaken=true;o.hp=0;log(s,'Llave recuperada. Neutraliza las defensas de la prisión y libera a los cautivos.');return ok('Llave recuperada.');
  }
  if(!homeCombatClear(b))return fail('Neutraliza las patrullas y las defensas armadas antes de ocupar el objetivo.');
  if(h.wave===1&&o.tag==='prison'){
   if(!hs.keyTaken)return fail('Recupera primero la llave de la prisión.');if(hs.rescued)return fail('Los soldados ya fueron liberados.');
   hs.rescued=true;hs.rescueAt=now;o.hp=0;return ok('Cuatro soldados liberados. Empieza el contador de tres horas.');
  }
  if(h.wave>1&&o.id===hs.commandId){hs.captured=true;hs.rescueAt=now;return ok('Puesto de mando ocupado.');}
  return fail('Este elemento no tiene una interacción pendiente.');
 }
 function finish(s,b){
  const h=init(s),hs=b.homeState||{},victory=clear(b);
  const defeated=b.units.filter(u=>u.side==='enemy'&&u.roamer&&u.hp<=0&&(h.roamers||[]).some(old=>old.id===u.id&&old.hp>0)).length;
  h.roamers=(h.roamers||[]).map(old=>{const u=b.units.find(v=>v.id===old.id);return u?{...u,hp:Math.max(0,u.hp)}:old;});
  if(!hs.skirmish)h.units=b.units.filter(u=>u.side==='enemy'&&!u.roamer).map(u=>({...u,hp:Math.max(0,u.hp),order:{kind:'hold',x:u.x,y:u.y}}));
  for(const v of h.buildings){const actor=b.buildings.find(o=>o.id===v.id);if(actor)v.hp=Math.max(0,actor.hp);}
  const cleared=new Set(s.cleared);for(const v of h.buildings.filter(v=>v.hp<=0))for(let y=v.y;y<v.y+v.height;y++)for(let x=v.x;x<v.x+v.width;x++)if(surface(s,x,y)==='grass')cleared.add(x+':'+y);s.cleared=[...cleared];
  for(const v of s.buildings){const actor=b.buildings.find(o=>o.id===v.id);if(actor)v.hp=Math.max(0,actor.hp);}
  if(hs.skirmish){if(defeated)s.xp+=defeated*10;return{victory,stars:victory?3:0,reward:defeated?{gold:defeated*30}: {}};}
  h.keyTaken=!!hs.keyTaken;if(hs.stock)h.stock={...hs.stock};let reward={};
  if(victory){
   h.completed=true;h.nextAt=(hs.rescueAt||Date.now())+HOME_RESPAWN_MS;
   if(!h.rewarded){h.rewarded=true;reward={gold:650+h.wave*100-100,wood:300,supply:250,metal:180};s.stats.wins++;s.xp+=300;if(h.wave===1&&!h.rescued){h.rescued=true;h.pendingSoldiers+=4;h.rescuedTotal+=4;}}
   h.history.unshift({wave:h.wave,layout:h.layout,ended:h.nextAt-HOME_RESPAWN_MS});h.history.length=Math.min(20,h.history.length);
   log(s,'Sector asegurado. La próxima base enemiga aparecerá dentro de tres horas reales.');
  }else log(s,'Retirada del archipiélago. Se conservan el daño y la llave recuperada.');
  return{victory,stars:victory?3:0,reward};
 }
 function claim(s){
  const h=init(s);if(!h?.pendingSoldiers)return fail('No hay rescatados pendientes.');if(s.battle)return fail('Termina la operación antes de alojar a los soldados.');
  const type=SOURCE_MAP[1059].type,pop=UNITS[type].pop;let n=0;
  while(h.pendingSoldiers>0&&population(s)+pop<=populationCap(s)){s.army.push(makeUnit(s,type,1));h.pendingSoldiers--;n++;}
  if(!n)return fail('Construye o mejora viviendas para alojar a los rescatados. Se conservan en espera.');log(s,n+' soldados rescatados se incorporaron a tu ejército.');return ok(n+' soldados incorporados.');
 }
 function contact(s){return !s.battle&&isHome(s)&&[...(!s.homeland?.completed?homeEnemies(s):[]),...homeRoamers(s)].some(e=>s.army.some(u=>u.hp>0&&Math.hypot(u.x-e.x,u.y-e.y)<6));}
 return{init,tick,start,finish,clear,contact,interact,claim};
}
export function validateHomeland(s){
 const h=s.homeland;if(h===undefined){if(s.battle?.kind==='homeland')throw Error('Falta el estado del archipiélago.');return;}
 if(!isHome(s)||!h||![1,2].includes(h.version)||typeof h.completed!=='boolean'||typeof h.rewarded!=='boolean'||!Array.isArray(h.units)||h.units.length>120||!Array.isArray(h.buildings)||h.buildings.length>220)throw Error('Escenario del archipiélago no válido.');
 if(h.version===1&&(h.units.length!==9||h.buildings.length!==45))throw Error('Escenario antiguo del archipiélago incompleto.');
 if(h.version===2&&(!Number.isInteger(h.wave)||h.wave<1||h.wave>1000000||![1,2,3,4].includes(h.layout)||typeof h.keyTaken!=='boolean'||typeof h.rescued!=='boolean'||!Number.isFinite(h.nextAt)||h.nextAt<0||h.nextAt>1e15||!Number.isInteger(h.pendingSoldiers)||h.pendingSoldiers<0||h.pendingSoldiers>4||!Number.isInteger(h.rescuedTotal)||h.rescuedTotal<0||!Array.isArray(h.history)||h.history.length>20||!h.stock))throw Error('Progreso del archipiélago no válido.');
 if(h.version===2)for(const k of['gold','wood','supply','metal'])if(!Number.isFinite(h.stock[k])||h.stock[k]<0||h.stock[k]>1e9)throw Error('Reservas enemigas no válidas.');
 if(h.roamers!==undefined&&(!Array.isArray(h.roamers)||h.roamers.length>50))throw Error('Patrullas de territorio no válidas.');
 const ids=new Set();for(const o of [...h.units,...h.buildings,...(h.roamers||[])]){
  if(typeof o.id!=='string'||!/^hm(?:[ubl]-(?:\d+|r\d+)|r-\d+_\d+)$/.test(o.id)||ids.has(o.id)||!Number.isFinite(o.hp)||o.hp<0||!Number.isFinite(o.maxHp)||o.maxHp<=0||o.hp>o.maxHp||!Number.isFinite(o.x)||!Number.isFinite(o.y)||o.x<0||o.y<0||o.x>100||o.y>100||!['enemy','neutral'].includes(o.side))throw Error('Objeto del archipiélago no válido.');ids.add(o.id);
  if(o.id.startsWith('hmu-')||o.id.startsWith('hmr-')){if(!Object.hasOwn(UNITS,o.type)||!Number.isInteger(o.level)||o.level<1||o.level>5||o.hp>unitStats(o.type,o.level).hp)throw Error('Patrulla del archipiélago no válida.');}
  else if(!Object.hasOwn(BUILDINGS,o.type)||!Number.isInteger(o.width)||!Number.isInteger(o.height)||o.width<1||o.height<1||o.width>12||o.height>12||o.x+o.width>100||o.y+o.height>100)throw Error('Estructura del archipiélago no válida.');
 }
 if(h.rewarded&&!h.completed)throw Error('Recompensa del archipiélago incoherente.');
 if(s.battle?.kind==='homeland'&&(s.battle.world.layout!=='MAP_PLAYER_1'||s.battle.seed!==s.seed||s.battle.units.filter(u=>u.side==='enemy').some(u=>!ids.has(u.id)&&!/^hmu-r\d+$/.test(u.id))))throw Error('Combate del archipiélago no válido.');
}

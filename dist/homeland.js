import{HOME_MAP_DATA}from'./home-map-data.js';
import{SOURCE_MAP,BUILDINGS,UNITS,buildingStats,unitStats,DIFFICULTIES}from'./catalog.js';
const fail=message=>({ok:false,message}),ok=message=>({ok:true,message});
export const isHome=s=>!!s.world&&!s.world.mission&&s.world.layout==='MAP_PLAYER_1'&&!s.world.procedural;
export const homeEnemies=s=>s.homeland?.units.filter(u=>u.hp>0)||[];
export const homeDefenses=s=>s.homeland?.buildings.filter(b=>b.hp>0&&b.side==='enemy'&&b.attack>0)||[];
export const homeObject=(s,id)=>[...(s.homeland?.units||[]),...(s.homeland?.buildings||[])].find(o=>o.id===id);
export const homeStructures=s=>s.homeland?.buildings||[];
export function createHomeland({makeUnit,initGarrison,log}){
 function init(s){
  if(!isHome(s))return null;if(s.homeland)return s.homeland;
  const h={version:1,completed:false,rewarded:false,units:[],buildings:[]};
  for(const o of [...HOME_MAP_DATA.landmarks.map(o=>({...o,landmark:true,neutral:true})),...HOME_MAP_DATA.objects]){
   const ref=SOURCE_MAP[o.id];if(!ref)continue;
   if(ref.role==='unit'){
    const u=makeUnit({serial:1,research:{}},ref.type,1);Object.assign(u,{id:'hmu-'+o.key,sourceId:o.id,side:'enemy',x:o.x+.5,y:o.y+.5,cooldown:0,order:{kind:'hold',x:o.x+.5,y:o.y+.5},damageScale:DIFFICULTIES[s.difficulty].damage});h.units.push(u);continue;
   }
   if(!BUILDINGS[ref.type])continue;
   const st=buildingStats(ref.type,ref.level),neutral=o.neutral||o.landmark||ref.role==='resource'||o.tag==='key';
   h.buildings.push({id:(o.landmark?'hml-':'hmb-')+o.key,sourceId:o.id,type:ref.type,level:ref.level,x:o.x-ref.width+1,y:o.y-ref.height+1,width:ref.width,height:ref.height,size:Math.max(ref.width,ref.height),hp:st.hp,maxHp:st.hp,side:neutral?'neutral':'enemy',attack:neutral?0:st.attack||0,range:st.range||0,landmark:!!o.landmark,scenery:ref.role==='resource',tag:o.tag||'',cooldown:0});
  }
  s.homeland=h;s.world.revision++;return h;
 }
 const clear=b=>!b.units.some(u=>u.side==='enemy'&&u.hp>0)&&!b.buildings.some(v=>v.side==='enemy'&&v.attack>0&&v.hp>0);
 function start(s){
  const h=init(s);if(!h)return fail('Este escenario no tiene un archipiélago principal.');if(s.battle)return fail('Termina la operación actual.');if(h.completed)return fail('Ya aseguraste este sector del archipiélago.');if(!s.army.length)return fail('Entrena un ejército para explorar y asegurar la isla.');
  initGarrison(s);for(const u of s.army){u.homePosition={x:u.x,y:u.y};u.side='player';u.order={kind:'hold',x:u.x,y:u.y};u.cooldown=0;}
  const front=[...s.army].sort((a,b)=>Math.min(...homeEnemies(s).map(v=>Math.hypot(a.x-v.x,a.y-v.y)))-Math.min(...homeEnemies(s).map(v=>Math.hypot(b.x-v.x,b.y-v.y))))[0];
  s.battle={kind:'homeland',name:'Asegurar el archipiélago · Rescate',seed:s.seed,world:s.world,start:{x:front.x,y:front.y},elapsed:0,limit:900,units:[...s.army,...h.units.filter(u=>u.hp>0).map(u=>({...u,order:{kind:'hold',x:u.x,y:u.y},damageScale:DIFFICULTIES[s.difficulty].damage}))],buildings:[...s.buildings.map(v=>({...v,maxHp:buildingStats(v.type,v.level).hp,side:'player',attack:buildingStats(v.type,v.level).attack||0})),...h.buildings.map(v=>({...v}))],reserve:[],effects:[],serial:0,initialBuildings:h.buildings.filter(b=>b.side==='enemy').length,reward:{}};
  s.army=[];s.lastBattle=null;log(s,'Combate en el archipiélago: nueve patrullas orcas y sus defensas protegen la prisión. Las bajas propias son permanentes.');return ok('Dirige las tropas sobre el mismo mapa. Neutraliza las patrullas y sus defensas.');
 }
 function finish(s,b){
  const h=s.homeland,victory=clear(b);for(const u of h.units){const actor=b.units.find(v=>v.id===u.id);if(actor){u.hp=Math.max(0,actor.hp);u.x=actor.x;u.y=actor.y;u.order={kind:'hold',x:u.x,y:u.y};}}
  for(const v of h.buildings){const actor=b.buildings.find(o=>o.id===v.id);if(actor)v.hp=Math.max(0,actor.hp);}
  for(const v of s.buildings){const actor=b.buildings.find(o=>o.id===v.id);if(actor)v.hp=Math.max(0,actor.hp);}
  let reward={};if(victory){h.completed=true;if(!h.rewarded){h.rewarded=true;reward={gold:650,wood:300,supply:250,metal:180};s.stats.wins++;s.xp+=300;}log(s,'Archipiélago asegurado. La prisión quedó liberada y los edificios neutrales siguen en su ubicación original.');}
  else log(s,'El ejército se retiró del archipiélago. El daño causado a las patrullas y defensas se conserva.');
  return{victory,stars:victory?3:0,reward};
 }
 function contact(s){return !s.battle&&isHome(s)&&!s.homeland?.completed&&homeEnemies(s).some(e=>s.army.some(u=>u.hp>0&&Math.hypot(u.x-e.x,u.y-e.y)<6));}
 return{init,start,finish,clear,contact};
}
export function validateHomeland(s){
 const h=s.homeland;if(h===undefined){if(s.battle?.kind==='homeland')throw Error('Falta el estado del archipiélago.');return;}
 if(!isHome(s)||!h||h.version!==1||typeof h.completed!=='boolean'||typeof h.rewarded!=='boolean'||!Array.isArray(h.units)||h.units.length!==9||!Array.isArray(h.buildings)||h.buildings.length!==45)throw Error('Escenario del archipiélago no válido.');
 const ids=new Set();for(const o of [...h.units,...h.buildings]){if(typeof o.id!=='string'||!/^hm[ubl]-\d+$/.test(o.id)||ids.has(o.id)||!Number.isFinite(o.hp)||o.hp<0||!Number.isFinite(o.maxHp)||o.maxHp<=0||o.hp>o.maxHp||!Number.isFinite(o.x)||!Number.isFinite(o.y)||o.x<0||o.y<0||o.x>100||o.y>100||!['enemy','neutral'].includes(o.side))throw Error('Objeto del archipiélago no válido.');ids.add(o.id);if(o.id.startsWith('hmu-')){if(!Object.hasOwn(UNITS,o.type)||o.level!==1||o.hp>unitStats(o.type,1).hp)throw Error('Patrulla del archipiélago no válida.');}else if(!Object.hasOwn(BUILDINGS,o.type)||!Number.isInteger(o.width)||!Number.isInteger(o.height)||o.width<1||o.height<1||o.width>12||o.height>12||o.x+o.width>100||o.y+o.height>100)throw Error('Estructura del archipiélago no válida.');}
 if(h.rewarded&&!h.completed)throw Error('Recompensa del archipiélago incoherente.');
 if(s.battle?.kind==='homeland'&&(s.battle.world.layout!=='MAP_PLAYER_1'||s.battle.seed!==s.seed||s.battle.units.filter(u=>u.side==='enemy').some(u=>!ids.has(u.id))))throw Error('Combate del archipiélago no válido.');
}

import {BIOMES,GENERATOR_VERSION,noise,expeditionWorld,validateProcedural}from'./procedural.js';
import {BUILDINGS,UNITS,RESOURCE_KEYS,buildingStats,unitStats,DIFFICULTIES}from'./catalog.js';
import {reveal}from'./fog.js';
export {BIOMES,seasonAt}from'./procedural.js';
const good=message=>({ok:true,message}),bad=message=>({ok:false,message}),inventory=()=>Object.fromEntries(RESOURCE_KEYS.map(k=>[k,0]));
export function frontier(s){return s.frontier??={version:1,index:0,target:null,colonies:[],shipments:[],reports:[]};}
export const colonyPopulation=s=>frontier(s).colonies.reduce((n,c)=>n+c.garrison.reduce((v,u)=>v+UNITS[u.type].pop,0),0);
export function targetDescription(s,level,biome='any'){
 const f=frontier(s),seed=(s.seed+Math.imul(f.index+1,2654435761))>>>0,keys=Object.keys(BIOMES),b=biome==='any'?keys[Math.floor(noise(9,8,seed)*keys.length)]:biome;
 return{id:'island-'+seed,seed,version:GENERATOR_VERSION,biome:b,level,distance:120+Math.floor(noise(5,4,seed)*880),name:BIOMES[b].name+' · '+String(seed%10000).padStart(4,'0')};
}
export const searchCost=level=>({gold:25+level*10});
export function colonyPower(c){return c.garrison.reduce((n,u)=>{const st=unitStats(u.type,u.level);return n+(st.damage*3+st.hp*.12)*(u.hp/u.maxHp);},0)+c.buildings.filter(b=>b.hp>0).reduce((n,b)=>n+(buildingStats(b.type,b.level).attack||0)*3,0);}
export const attackPower=c=>90+c.level*125;
export const extractionRate=(s,c)=> (60+c.level*40)*(s.difficulty==='easy'?10:s.difficulty==='hard'?3:1);
export const colonyCapacity=c=>1000*c.level;
export const routeQuote=(s,c,mode='sea')=>{
 const factory=mode==='sea'?'shipyard':mode==='air'?'air':null,port=s.buildings.find(b=>b.type===factory&&b.hp>0&&!b.job);
 return{ok:!!factory&&!!port&&!s.battle&&c?.owned&&!c.route&&!c.routeJob,cost:{gold:150,wood:180,supply:80},duration:90,message:!port?'Necesitas '+(mode==='air'?'un aeródromo':'un astillero')+' operativo en tu base.':'Estudio costero y construcción: 90 s.'};
};
export function createExpeditions({makeUnit,log,hqLevel,initGarrison,affordable,pay,storageCap}){
 const find=(s,id)=>frontier(s).colonies.find(c=>c.id===id);
 const report=(s,c,text)=>{const f=frontier(s);f.reports.unshift({time:s.time,name:c.name,text});f.reports.length=Math.min(20,f.reports.length);log(s,c.name+': '+text);};
 function search(s,level,biome='any'){
  if(s.battle)return bad('Termina la operación antes de reconocer otra isla.');
  if(!Number.isInteger(level)||level<1||level>10||!(biome==='any'||Object.hasOwn(BIOMES,biome)))return bad('Reconocimiento no válido.');
  const cost=searchCost(level);if(!affordable(s,cost))return bad('Reúne '+cost.gold+' de oro para explorar.');
  const f=frontier(s);pay(s,cost);f.target=targetDescription(s,level,biome);f.index++;return good('Isla localizada. Revisa sus defensas antes de desembarcar.');
 }
 function forces(s,t){
  const buildings=[],units=[],level=t.level,base=.28+level*.065;
  const add=(type,x,y)=>{const st=buildingStats(type,level);buildings.push({id:'eb'+buildings.length,type,x,y,level,hp:Math.round(st.hp*base),maxHp:Math.round(st.hp*base),side:'enemy',attack:Math.round((st.attack||0)*base),range:st.range});};
  add('hq',73,48);add('goldmine',79,39);add('storage',79,56);add('infantry',68,57);add('tower',64,45);
  if(level>=2)add('tower',65,55);if(level>=3)add('cannon',70,40);if(level>=5)add('bunker',76,63);if(level>=7){add('fortress',79,46);add('bunker',73,59);add('tower',64,62);}
  if(level>=9){add('tower',69,35);add('cannon',63,38);add('storage',79,64);}
  const types=Object.values(UNITS).filter(u=>!u.archive&&!u.waterborne&&!u.heal&&u.hq<=level);
  for(let i=0;i<2+level*2;i++){const type=types[Math.floor(noise(i,3,t.seed)*types.length)].id,u=makeUnit(s,type,Math.min(5,Math.ceil(level/2)));Object.assign(u,{side:'enemy',x:64+(i%5)*1.7,y:48+Math.floor(i/5)*1.7,order:{kind:'hold',x:64+(i%5)*1.7,y:48+Math.floor(i/5)*1.7},damageScale:DIFFICULTIES[s.difficulty].damage*base});units.push(u);}
  return{buildings,units};
 }
 function start(s,mode='conquer',colonyId=null){
  const f=frontier(s),old=colonyId&&find(s,colonyId),t=old&&!old.owned?old.target:f.target;
  if(colonyId&&(!old||old.owned))return bad('Ese puesto no está ocupado por la IA.');
  if(s.battle||!s.army.length)return bad('Necesitas un ejército disponible y ninguna operación activa.');
  if(!['raid','conquer'].includes(mode)||!t)return bad('Reconoce una isla primero.');
  if(mode==='conquer'&&f.colonies.filter(c=>c.owned).length>=3)return bad('Puedes mantener tres colonias. Abandona una o realiza un saqueo.');
  initGarrison(s);for(const u of s.army)u.homePosition={x:u.x,y:u.y};const enemy=forces(s,t);
  const land=[],water=[];for(let y=48;y<=53;y++)for(let x=20;x<=24;x++){land.push({x:x+.5,y:y+.5});water.push({x:x-10+.5,y:y+.5});}
  s.battle={kind:'expedition',name:t.name,seed:t.seed,world:expeditionWorld(t),start:{x:22,y:51},deployment:{land,water},fog:{explored:[],visible:[],revision:0},elapsed:0,limit:900,buildings:enemy.buildings,units:enemy.units,reserve:s.army,initialBuildings:enemy.buildings.length,reward:inventory(),effects:[],serial:0,expedition:{target:{...t},mode}};
  s.army=[];s.lastBattle=null;if(!colonyId)f.target=null;reveal(s.battle,true);return good('Desembarca en azul. Explora y destruye el mando y las defensas para '+(mode==='conquer'?'conquistar.':'saquear.'));
 }
 function deploy(s,type,x,y){
  const b=s.battle;if(b?.kind!=='expedition'||!Object.hasOwn(UNITS,type))return bad('No hay desembarco abierto.');
  const points=UNITS[type].waterborne?b.deployment.water:b.deployment.land;
  if(!Number.isFinite(x)||!Number.isFinite(y)||!points.some(p=>Math.floor(p.x)===Math.floor(x)&&Math.floor(p.y)===Math.floor(y)))return bad('Despliega en las casillas azules de tierra o mar.');
  const i=b.reserve.findIndex(u=>u.type===type);if(i<0)return bad('No quedan tropas de ese tipo.');const u=b.reserve.splice(i,1)[0];Object.assign(u,{side:'player',x,y,cooldown:0,order:{kind:'hold',x,y}});b.units.push(u);reveal(b,true);return good(UNITS[type].name+' desembarcado.');
 }
 function deployAll(s){let i=0;for(const u of [...s.battle.reserve]){const points=UNITS[u.type].waterborne?s.battle.deployment.water:s.battle.deployment.land,p=points[i++%points.length],r=deploy(s,u.type,p.x,p.y);if(!r.ok)return r;}return good('Ejército desembarcado. Avanza explorando bajo la niebla.');}
 const conquered=b=>b.buildings.find(v=>v.type==='hq')?.hp<=0&&!b.buildings.some(v=>v.hp>0&&v.attack>0);
 function finish(s,b){
  if(b.kind==='colony'){const c=find(s,b.colonyId);c.explored=[...b.fog.explored];return{view:true,colony:c,reward:{},victory:false,stars:0};}
  if(b.kind==='colony-defense'){
   const c=find(s,b.colonyId),victory=b.buildings.find(v=>v.type==='hq')?.hp>0&&!b.units.some(u=>u.side==='enemy'&&u.hp>0);
   c.explored=[...b.fog.explored];c.buildings=b.buildings.map(v=>({...v,hp:Math.max(0,v.hp)}));c.warning=null;c.nextAttack=s.time+threatDelay(s,c);c.owned=victory;
   if(!victory){c.stock=inventory();for(const u of b.units.filter(u=>u.side==='player'&&u.hp>0)){u.hp=0;s.stats.lost++;}}
   report(s,c,victory?'Defensa dirigida: la colonia resiste.':'La IA conquistó el puesto. Puedes recuperarlo.');return{colony:c,reward:{},victory,stars:victory?3:0};
  }
  const t=b.expedition.target,victory=conquered(b),reward=victory?{gold:250+t.level*300,wood:150+t.level*120,supply:100+t.level*100,metal:80+t.level*100}:{};
  if(victory){s.stats.wins++;s.xp+=150+t.level*45;
   if(b.expedition.mode==='conquer'){
    const f=frontier(s);let c=find(s,t.id);if(!c){if(f.colonies.length>=12)f.colonies.splice(f.colonies.findIndex(v=>!v.owned),1);c={id:t.id,target:{...t},name:t.name,level:1,owned:true,stock:inventory(),garrison:[],route:null,routeJob:null,job:null,warning:null,nextAttack:0};f.colonies.push(c);}
    c.owned=true;c.explored=[...b.fog.explored];c.buildings=b.buildings.map(v=>({...v,side:'player',hp:buildingStats(v.type,c.level).hp,maxHp:buildingStats(v.type,c.level).hp,cooldown:0,level:c.level,attack:buildingStats(v.type,c.level).attack||0}));c.warning=null;c.nextAttack=s.time+threatDelay(s,c);report(s,c,'Puesto conquistado. Asigna una guarnición y establece una ruta de suministros.');
   }else log(s,'Saqueo completado en '+t.name+'.');
  }return{reward,victory,stars:victory?3:0};
 }
 const threatDelay=(s,c)=>Math.round((1500-c.target.level*30)*DIFFICULTIES[s.difficulty].raid);
 function assign(s,id,type,count=1,recall=false){
  const c=find(s,id);if(s.battle||!c?.owned||!Object.hasOwn(UNITS,type)||!Number.isInteger(count)||count<1||count>32)return bad('Traslado de guarnición no disponible.');
  const from=recall?c.garrison:s.army,to=recall?s.army:c.garrison,list=from.filter(u=>u.type===type).slice(0,count);
  if(list.length!==count)return bad('No hay suficientes tropas disponibles.');if(!recall&&to.length+count>32)return bad('La guarnición admite 32 unidades.');
  const cost={supply:10*list.reduce((n,u)=>n+UNITS[u.type].pop,0)};if(!affordable(s,cost))return bad('Necesitas petróleo para el traslado de tropas.');pay(s,cost);
  for(const u of list){from.splice(from.indexOf(u),1);delete u.x;delete u.y;delete u.order;delete u.side;to.push(u);}return good((recall?'Regresan ':'Guarnición reforzada con ')+count+' tropas. Su población sigue contando en tu ejército.');
 }
 function upgrade(s,id){const c=find(s,id);if(s.battle||!c?.owned||c.job)return bad('La colonia no puede mejorar ahora.');if(c.level>=Math.min(10,hqLevel(s)))return bad('Mejora primero el mando principal. Máximo diez niveles.');const cost={gold:250*c.level,wood:150*c.level,metal:100*c.level};if(!affordable(s,cost))return bad('Faltan recursos para mejorar el puesto.');pay(s,cost);c.job={ends:s.time+120*c.level};return good('Mejora del puesto en marcha. Aumentará su depósito, producción y defensas.');}
 function route(s,id,mode){const c=find(s,id),q=routeQuote(s,c,mode);if(!q.ok)return bad(q.message||'Ya existe una ruta o una obra.');if(!affordable(s,q.cost))return bad('Faltan materiales para la ruta.');pay(s,q.cost);c.routeJob={mode,ends:s.time+q.duration};return good('Estudio de acceso y construcción de terminales iniciados.');}
 function ship(s,id){
  const c=find(s,id),f=frontier(s);if(s.battle||!c?.owned||!c.route||f.shipments.some(v=>v.colonyId===id))return bad('Necesitas una ruta operativa y ningún transporte pendiente en esta colonia.');
  const factory=c.route.mode==='sea'?'shipyard':'air';if(!s.buildings.some(b=>b.type===factory&&b.hp>0&&!b.job))return bad('Repara la terminal de la base para despachar.');
  const cargo=inventory();let room=c.route.mode==='sea'?1500:750;for(const k of RESOURCE_KEYS){cargo[k]=Math.min(Math.floor(c.stock[k]),room);room-=cargo[k];}if(Object.values(cargo).every(v=>v===0))return bad('No hay carga para despachar.');const cost={supply:c.route.mode==='sea'?25:65};if(!affordable(s,cost))return bad('Necesitas petróleo para el transporte.');pay(s,cost);for(const k of RESOURCE_KEYS)c.stock[k]-=cargo[k];const duration=Math.max(30,Math.round(c.target.distance/(c.route.mode==='sea'?2:8)));f.shipments.push({id:'cargo'+s.serial++,colonyId:id,name:c.name,mode:c.route.mode,cargo,started:s.time,ends:s.time+duration,arrived:false});return good('Transporte despachado. La carga llegará en '+duration+' segundos.');
 }
 function claim(s){let count=0;for(const shipment of frontier(s).shipments.filter(v=>v.arrived))for(const k of RESOURCE_KEYS){const n=Math.min(shipment.cargo[k],Math.max(0,storageCap(s)-s.resources[k]));s.resources[k]+=n;shipment.cargo[k]-=n;count+=n;}frontier(s).shipments=frontier(s).shipments.filter(v=>!v.arrived||Object.values(v.cargo).some(n=>n>0));s.stats.collected+=count;s.xp+=count/20;return count?good('Entregados '+Math.floor(count)+' materiales. El excedente permanece en el transporte.'):bad('No hay entregas o los almacenes están llenos.');}
 function abandon(s,id){const f=frontier(s),c=find(s,id);if(s.battle||!c)return bad('Puesto no disponible.');if(c.garrison.length||f.shipments.some(v=>v.colonyId===id))return bad('Retira las tropas y recoge el transporte antes de abandonar.');f.colonies.splice(f.colonies.indexOf(c),1);return good('Puesto abandonado. Su depósito local se pierde.');}
 function visit(s,id,defend=false){
  const c=find(s,id);if(s.battle||!c?.owned||defend&&!c.warning)return bad('Colonia no disponible.');
  const world=expeditionWorld(c.target),units=c.garrison;for(const[i,u]of units.entries())Object.assign(u,{side:'player',x:68+i%5,y:50+Math.floor(i/5),order:{kind:'hold',x:68+i%5,y:50+Math.floor(i/5)}});c.garrison=[];
  const b={kind:defend?'colony-defense':'colony',colonyId:id,name:c.name,world,seed:c.target.seed,start:{x:73,y:51},elapsed:0,limit:300,units,reserve:[],buildings:c.buildings.map(v=>({...v,side:'player'})),initialBuildings:c.buildings.length,reward:{},effects:[],serial:0,fog:{explored:[...(c.explored||[])],visible:[],revision:0}};
  if(defend){const enemy=forces(s,{...c.target,level:c.level});for(const[i,u]of enemy.units.entries())Object.assign(u,{x:40+i%5,y:48+Math.floor(i/5),order:{kind:'assault',x:73,y:50}});b.units.push(...enemy.units);}s.battle=b;s.lastBattle=null;reveal(b,true);return good(defend?'Defiende el mando del puesto. Las bajas de la guarnición son permanentes.':'Inspección del puesto. Puedes dirigir su guarnición y volver cuando quieras.');
 }
 function autoDefend(s,c){
  const power=colonyPower(c),enemy=attackPower(c),win=power>=enemy;
  if(win){const damage=Math.min(.85,enemy/Math.max(1,power)*.55);for(const u of c.garrison)u.hp=Math.max(1,u.hp*(1-damage));report(s,c,'La guarnición repelió el ataque de la IA; quedan heridos.');}
  else{for(const u of c.garrison)s.stats.lost++;c.garrison=[];c.owned=false;c.stock=inventory();report(s,c,'La IA tomó el puesto: guarnición perdida. Reconquista disponible.');}
  c.warning=null;c.nextAttack=s.time+threatDelay(s,c);
 }
 function tick(s,dt,online=true){
  const f=frontier(s);for(const c of f.colonies){if(!c.owned)continue;const oldLevel=c.level,oldDuration=c.job?Math.max(0,Math.min(dt,c.job.ends-(s.time-dt))):0;
   if(c.job&&c.job.ends<=s.time){c.job=null;c.level++;for(const b of c.buildings){b.level=c.level;const st=buildingStats(b.type,c.level);b.maxHp=st.hp;b.hp=st.hp;b.attack=st.attack||0;}report(s,c,'Puesto mejorado al nivel '+c.level+'.');}
   if(c.routeJob&&c.routeJob.ends<=s.time){c.route={mode:c.routeJob.mode};c.routeJob=null;report(s,c,'Ruta de suministros operativa.');}
   const primary=BIOMES[c.target.biome].resource,amount=(extractionRate(s,c)*(dt-oldDuration)+extractionRate(s,{level:oldLevel})*oldDuration)/3600;c.stock[primary]=Math.min(colonyCapacity(c),c.stock[primary]+amount);c.stock.gold=Math.min(colonyCapacity(c),c.stock.gold+(primary==='gold'?0:amount*.2));
   if(online&&!(s.battle?.kind==='colony-defense'&&s.battle.colonyId===c.id)){if(c.warning&&s.time>=c.warning.ends){if(s.battle?.kind==='colony'&&s.battle.colonyId===c.id){const b=s.battle,enemy=forces(s,{...c.target,level:c.level});for(const[i,u]of enemy.units.entries())Object.assign(u,{x:40+i%5,y:48+Math.floor(i/5),order:{kind:'assault',x:73,y:50}});b.units.push(...enemy.units);b.kind='colony-defense';b.elapsed=0;b.limit=300;report(s,c,'La incursión llegó durante tu visita. Defiende el mando.');}else autoDefend(s,c);}else if(!c.warning&&s.time>=c.nextAttack){c.warning={ends:s.time+120};report(s,c,'Reconocimiento enemigo: ataque dentro de dos minutos. Refuerza o dirige la defensa.');}}
  }for(const shipment of f.shipments)if(!shipment.arrived&&shipment.ends<=s.time){shipment.arrived=true;log(s,'Llegó un transporte desde '+shipment.name+'. Recógelo en Expediciones.');}
  if(s.battle&&['expedition','colony','colony-defense'].includes(s.battle.kind))reveal(s.battle);
 }
 function offline(s,dt){for(const c of frontier(s).colonies){c.nextAttack+=dt;if(c.warning)c.warning.ends+=dt;}}
 return{search,start,deploy,deployAll,finish,assign,upgrade,route,ship,claim,abandon,visit,tick,offline,conquered};
}
export function validateFrontier(s){
 if(s.frontier===undefined){if(['expedition','colony','colony-defense'].includes(s.battle?.kind))throw Error('Faltan las expediciones del guardado.');return;}const f=s.frontier,finite=(n,max=1e12)=>Number.isFinite(n)&&n>=0&&n<=max,id=v=>typeof v==='string'&&/^[A-Za-z][A-Za-z0-9_-]{0,70}$/.test(v);
 const target=t=>{if(!t||!id(t.id)||t.id!=='island-'+t.seed||!Number.isInteger(t.level)||t.level<1||t.level>10||!finite(t.distance,1000)||typeof t.name!=='string'||t.name.length>100)throw Error('Objetivo de expedición no válido.');validateProcedural(t);};
 const cargo=v=>{if(!v||RESOURCE_KEYS.some(k=>!finite(v[k],1e8)))throw Error('Carga colonial no válida.');};
 if(!f||f.version!==1||!Number.isInteger(f.index)||f.index<0||!Array.isArray(f.colonies)||f.colonies.length>12||f.colonies.filter(c=>c.owned).length>3||!Array.isArray(f.shipments)||f.shipments.length>12||!Array.isArray(f.reports)||f.reports.length>20)throw Error('Expediciones no válidas.');if(f.target)target(f.target);
 const ids=new Set(),deployed=[...s.army,...(s.battle?[...s.battle.units.filter(u=>u.side==='player'),...s.battle.reserve]:[])],unitIds=new Set(deployed.map(u=>u.id));if(unitIds.size!==deployed.length)throw Error('Tropas duplicadas en el guardado.');
 for(const c of f.colonies){target(c.target);if(!id(c.id)||c.id!==c.target.id||ids.has(c.id)||typeof c.name!=='string'||c.name.length>100||typeof c.owned!=='boolean'||!Number.isInteger(c.level)||c.level<1||c.level>10||!finite(c.nextAttack)||!Array.isArray(c.garrison)||c.garrison.length>32||!Array.isArray(c.buildings)||c.buildings.length>100||!c.buildings.some(b=>b.type==='hq')||c.warning&&!finite(c.warning.ends)||c.job&&!finite(c.job.ends)||c.route&&!['sea','air'].includes(c.route.mode)||c.routeJob&&(!['sea','air'].includes(c.routeJob.mode)||!finite(c.routeJob.ends)))throw Error('Colonia no válida.');ids.add(c.id);cargo(c.stock);if(c.explored&&(!Array.isArray(c.explored)||c.explored.length>400||c.explored.some(n=>!Number.isInteger(n)||n<0||n>399)))throw Error('Exploración colonial no válida.');
  for(const u of c.garrison){if(!id(u.id)||unitIds.has(u.id)||!Object.hasOwn(UNITS,u.type)||!Number.isInteger(u.level)||u.level<1||u.level>5||!finite(u.maxHp,1e9)||u.maxHp<=0||!finite(u.hp,u.maxHp)||u.hp<=0)throw Error('Guarnición no válida o duplicada.');unitIds.add(u.id);}
  for(const b of c.buildings)if(!Object.hasOwn(BUILDINGS,b.type)||!Number.isInteger(b.level)||b.level<1||b.level>10||!Number.isInteger(b.x)||!Number.isInteger(b.y)||b.x<0||b.y<0||b.x+BUILDINGS[b.type].size>100||b.y+BUILDINGS[b.type].size>100||!finite(b.hp,1e10))throw Error('Edificio colonial no válido.');
 }const cargos=new Set();for(const t of f.shipments){if(!id(t.id)||cargos.has(t.id)||!ids.has(t.colonyId)||!['sea','air'].includes(t.mode)||!finite(t.started)||!finite(t.ends)||t.ends<t.started||typeof t.arrived!=='boolean'||typeof t.name!=='string'||t.name.length>100)throw Error('Transporte no válido.');cargos.add(t.id);cargo(t.cargo);}
 for(const r of f.reports)if(!finite(r.time)||typeof r.name!=='string'||r.name.length>100||typeof r.text!=='string'||r.text.length>500)throw Error('Informe colonial no válido.');
 const b=s.battle;if(b&&['expedition','colony','colony-defense'].includes(b.kind)){
  if(!b.world?.procedural||!finite(b.limit,1800)||!finite(b.elapsed)||!Array.isArray(b.fog?.explored)||!Array.isArray(b.fog?.visible)||[...b.fog.explored,...b.fog.visible].some(n=>!Number.isInteger(n)||n<0||n>399)||b.fog.explored.length>400||b.fog.visible.length>400||!finite(b.start?.x,99)||!finite(b.start?.y,99))throw Error('Campo de expedición no válido.');
  const descriptor=b.kind==='expedition'?b.expedition?.target:f.colonies.find(c=>c.id===b.colonyId)?.target;if(!descriptor||b.seed!==descriptor.seed||b.world.procedural.seed!==descriptor.seed||b.world.procedural.biome!==descriptor.biome||!Number.isInteger(b.initialBuildings)||b.initialBuildings!==b.buildings.length)throw Error('Identidad del campo de expedición no válida.');
  if(b.kind==='expedition'){target(b.expedition?.target);if(!['conquer','raid'].includes(b.expedition.mode)||!Array.isArray(b.deployment?.land)||!Array.isArray(b.deployment?.water)||!b.deployment.land.length||b.deployment.land.length>150||b.deployment.water.length>60||[...b.deployment.land,...b.deployment.water].some(p=>!finite(p.x,99)||!finite(p.y,99)))throw Error('Desembarco no válido.');}
  else if(!ids.has(b.colonyId)||f.colonies.find(c=>c.id===b.colonyId).garrison.length)throw Error('Guarnición desplegada no válida.');
 }
}

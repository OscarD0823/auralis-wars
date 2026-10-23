import {COLLECTIONS} from './collections-data.js';
import {BUILDINGS,UNITS,unitStats,isRecruitable,isBuildable} from './catalog.js';
import {SPECIAL_DATA as DATA} from './special-data.js';
import {experience,unlockLevel,unlockMessage} from './progression.js';

const result=(ok,message)=>({ok,message});
const DAY=86400000,OFFSET=5*3600000;
const dayAt=now=>Math.floor((now-OFFSET)/DAY); // Calendar days in America/Bogota, including offline play.
const active=(s,type)=>s.buildings.filter(b=>b.type===type&&b.hp>0&&!b.job).sort((a,b)=>b.level-a.level)[0];
const speed=s=>s.difficulty==='easy'?10:s.difficulty==='hard'?3:1;
export const isWonder=type=>!!DATA.wonders[type];
export const prototypeTypes=Object.keys(DATA.centers);
export const isPrototypeCenter=type=>!!DATA.centers[type];
export const DAILY_REWARDS=[100,250,500,1000,0];

export function specialState(s){
 if(!s.special)s.special={version:1,credits:5,centers:{},fusions:[],discovered:[],pending:{gold:0,wood:0,supply:0,metal:0},units:[],daily:{lastDay:null,streak:0},entropy:0};
 return s.special;
}
export const fusionPopulation=s=>(s.special?.fusions||[]).reduce((n,j)=>n+UNITS[j.type].pop+j.inputs.reduce((m,u)=>m+UNITS[u.type].pop,0),0);
export function dailyStatus(s,now=Date.now()){
 const d=specialState(s).daily,today=dayAt(now),available=d.lastDay===null||today>d.lastDay;
 const next=available?(d.lastDay===today-1?d.streak%5+1:1):d.streak;
 return{available,day:next,streak:d.streak,lastDay:d.lastDay,nextAt:((d.lastDay===null?today:Math.max(today,d.lastDay))+1)*DAY+OFFSET,gold:DAILY_REWARDS[next-1]||0,hero:next===5?'captain':null,credits:next===5?2:0};
}

export function wonderQuote(s,b){
 const d=b&&DATA.wonders[b.type];if(!d)return{ok:false,message:'Esta instalación no es una maravilla productora.'};
 const w=b.wonder,amount=d.amount,remaining=w?.remaining??d.charges,legacy=!!w?.legacy;
 return{ok:b.hp>0&&!b.job,resource:legacy&&d.resource==='credits'?'gold':d.resource,amount,charges:d.charges,remaining,legacy,
  ready:legacy?Math.floor(b.stored)>0:remaining>0&&b.stored>=amount,
  ends:w?.ends??null,duration:d.seconds/speed(s),
  recharge:{gold:Math.max(600,d.amount*2),wood:400,metal:Math.max(200,d.amount)},
  message:b.hp<=0||b.job?'La maravilla debe estar operativa.':remaining===0?'Recogidas agotadas. Restaura la maravilla para reactivarla.':''};
}

// This Auralis power scale replaces breeding_order, absent from the pinned catalog.
export function fusionPower(type){const u=UNITS[type];return u?Math.min(220,Math.max(10,Math.round(u.hp/80+u.damage/5+u.range/2))):0;}
const fusionPool=[...new Set([...Object.values(DATA.centers).flat(),'swu1243','swu1263','rifle','scout','jeep','tank','helicopter','drone','titan'])].filter(t=>UNITS[t]);
export const fusionEligible=type=>fusionPool.includes(type);
export function acquisitionRoutes(s,type){
 const u=UNITS[type];if(!u)return[];const d=DATA.units[type],routes=[];
 if(isRecruitable(u))routes.push({kind:'training',building:u.factory,required:u.required,label:'Entrenamiento',cost:u.cost});
 for(const [building,types]of Object.entries(DATA.centers))if(types.includes(type))routes.push({kind:'prototype',building,required:Math.floor(types.indexOf(type)/2)+1,label:'Prototipo · diez etapas'});
 if(d?.cash>0&&d.race==='h')routes.push({kind:'cash',label:'Requisición con cash local',cost:{credits:d.cash}});
 if(fusionEligible(type)&&fusionPower(type)>10)routes.push({kind:'fusion',building:'fusion',required:1,label:'Fusión · resultado variable'});
 for(const c of COLLECTIONS.filter(c=>c.reward.unit&&c.reward.type===type))routes.push({kind:'collection',label:'Colección '+c.name,message:c.social?'Funciones sociales pausadas.':'Reúne cinco piezas; reclama el premio en Inventario y recíbelo desde Almacén.'});
 if(type==='captain')routes.push({kind:'daily',label:'Héroe del quinto día'});
 if(!routes.length)routes.push({kind:'mission',label:'Operación o rescate',message:'Unidad de escenario: no se compra ni se entrena en un cuartel normal.'});
 return routes.map(r=>({...r,commander:unlockLevel(type,true),hq:u.hq,originalLevel:d?.level??null,
  message:r.kind==='training'?(s.buildings.find(b=>b.type==='hq')?.level<u.hq?'Necesitas mando nivel '+u.hq+'.':unlockMessage(s,type,true)||(!s.buildings.some(b=>b.type===u.factory&&b.level>=u.required&&b.hp>0&&!b.job)?(!isBuildable(s,BUILDINGS[u.factory])&&!s.buildings.some(b=>b.type===u.factory)?'Recupera en campaña el plano de '+BUILDINGS[u.factory].name+'.':'Necesitas '+BUILDINGS[u.factory].name+' nivel '+u.required+' operativo.'):'')):r.kind==='cash'?unlockMessage(s,type,true):r.message||''}));
}

export function createSpecials({makeUnit,log,hqLevel,population,populationCap,storageCap,affordable,pay,initGarrison,onHarvest=()=>{}}){
 const remember=(s,type)=>{const x=specialState(s);if(!x.discovered.includes(type))x.discovered.push(type);};
 const putReward=(s,values)=>{const x=specialState(s);for(const k of Object.keys(x.pending))x.pending[k]+=values[k]||0;};
 function claimRewards(s){
  if(s.battle)return result(false,'Recoge las reservas al volver a la base.');const x=specialState(s);let count=0;
  for(const k of Object.keys(x.pending)){const n=Math.max(0,Math.min(x.pending[k],storageCap(s)-s.resources[k]));s.resources[k]+=n;x.pending[k]-=n;count+=n;}
  for(let i=0;i<x.units.length;){const u=x.units[i];if(population(s)+UNITS[u.type].pop>populationCap(s)){i++;continue;}s.army.push(makeUnit(s,u.type,Math.max(u.level,s.research[u.type]||1)));remember(s,u.type);x.units.splice(i,1);count++;}
  if(count)initGarrison(s);return result(count>0,count?'Recompensas entregadas. Los excedentes siguen en reserva.':'Amplía las reservas o las viviendas para recibir lo pendiente.');
 }
 function claimDaily(s,now=Date.now()){
  if(s.battle)return result(false,'Recoge el bono al regresar a la base.');if(!Number.isFinite(now))return result(false,'Fecha no válida.');
  const d=dailyStatus(s,now);if(!d.available)return result(false,'Ya recogiste el bono de este día.');const x=specialState(s);
  x.daily={lastDay:dayAt(now),streak:d.day};putReward(s,{gold:d.gold});x.credits+=d.credits;
  if(d.hero)x.units.push({type:d.hero,level:1});claimRewards(s);
  log(s,'Bono diario '+d.day+'/5: '+(d.hero?'General Mike y 2 cash locales':d.gold+' de oro')+'.');
  return result(true,'Bono del día '+d.day+' recogido. Lo que no quepa se conserva en reservas.');
 }
 function cashQuote(s,type){
  const route=acquisitionRoutes(s,type).find(r=>r.kind==='cash'),u=UNITS[type];let message='';
  if(!route)message='Esta tropa no tiene una vía de requisición.';
  else if(s.battle)message='Regresa a la base para recibir refuerzos.';
  else if(hqLevel(s)<u.hq)message='Necesitas mando nivel '+u.hq+'.';
  else if(route.message)message=route.message;
  else if(population(s)+u.pop>populationCap(s))message='Amplía las viviendas para recibir esta tropa.';
  else if(specialState(s).credits<route.cost.credits)message='Falta cash local. Se consigue con metas, el bono del quinto día y la maravilla Cash Wonder.';
  return{ok:!message,message,cost:route?.cost||{}};
 }
 function requisition(s,type){const q=cashQuote(s,type);if(!q.ok)return q;specialState(s).credits-=q.cost.credits;s.army.push(makeUnit(s,type));remember(s,type);initGarrison(s);return result(true,UNITS[type].name+' recibido.');}
 function centerState(s,type){const x=specialState(s);return x.centers[type]||(x.centers[type]={index:0,step:0,job:null});}
 function prototypeQuote(s,type){
  if(!isPrototypeCenter(type))return{ok:false,message:'Elige un centro de prototipos.'};const c=centerState(s,type),types=DATA.centers[type],unit=types[c.index],required=Math.floor(c.index/2)+1,b=active(s,type),ready=c.step===10;
  let message=s.battle?'Regresa a la base.':!b?'Necesitas '+BUILDINGS[type].name+' operativo.':b.level<required?'Mejora '+BUILDINGS[type].name+' al nivel '+required+'.':c.job?'Etapa en curso.':ready?'Prototipo terminado: recógelo antes de iniciar el siguiente.':'';
  const cost={gold:50*(c.index+1),metal:30*(c.index+1),supply:20*(c.index+1)};
  return{ok:!message,message,type:unit,index:c.index,step:c.step,required,ready,job:c.job,sequence:types,cost,duration:Math.ceil(21600/speed(s)/(1+Math.max(0,(b?.level||1)-1)*.04)),canClaim:ready&&!!b&&!s.battle&&population(s)+UNITS[unit].pop<=populationCap(s)};
 }
 function advancePrototype(s,type){const q=prototypeQuote(s,type);if(!q.ok)return q;if(!affordable(s,q.cost))return result(false,'Faltan materiales para la siguiente etapa.');const b=active(s,type);pay(s,q.cost);centerState(s,type).job={building:b.id,started:s.time,ends:s.time+q.duration};return result(true,'Etapa '+(q.step+1)+'/10 de '+UNITS[q.type].name+' iniciada.');}
 function claimPrototype(s,type){const q=prototypeQuote(s,type);if(!q.ready||!q.canClaim)return result(false,q.ready?'Repara el centro y amplía viviendas para recoger el prototipo.':'El prototipo todavía no está terminado.');s.army.push(makeUnit(s,q.type));remember(s,q.type);s.stats.trained++;s.xp+=80;const c=centerState(s,type);c.index=(c.index+1)%DATA.centers[type].length;c.step=0;initGarrison(s);log(s,UNITS[q.type].name+' obtenido en '+BUILDINGS[type].name+'.');return result(true,'Prototipo recibido. El siguiente proyecto está disponible.');}
 function initWonder(s,b,started=s.time){
  if(b.wonder)return b.wonder;const d=DATA.wonders[b.type],legacy=Math.floor(b.stored)>0;
  if(!legacy)b.stored=0;
  return b.wonder={remaining:d.charges,ends:started+d.seconds/speed(s),legacy};
 }
 function collectWonder(s,id){
  const b=s.buildings.find(b=>b.id===id);if(!b||!isWonder(b.type))return result(false,'Maravilla no válida.');
  const q=wonderQuote(s,b);if(!q.ok)return result(false,q.message);const w=initWonder(s,b),d=DATA.wonders[b.type],legacy=w.legacy;
  const resource=legacy&&d.resource==='credits'?'gold':d.resource;
  const amount=legacy?Math.floor(b.stored):d.amount,room=resource==='credits'?1e9-specialState(s).credits:Math.max(0,storageCap(s)-s.resources[resource]);
  if(!legacy&&(w.remaining===0||b.stored<amount))return result(false,w.remaining===0?'Esta maravilla agotó sus recogidas.':'Espera a que la recogida esté lista.');
  const take=legacy?Math.min(amount,room):amount;
  if(take<1||room<take)return result(false,'Amplía el almacén: la recogida completa permanece en la maravilla.');
  if(resource==='credits')specialState(s).credits+=take;else s.resources[resource]+=take;
  b.stored-=take;s.stats.collected+=take;s.xp+=d.xp;if(resource!=='credits')onHarvest(s,take);
  if(!legacy)w.remaining--;
  if(b.stored<1){b.stored=0;w.legacy=false;w.ends=s.time+d.seconds/speed(s);}
  return result(true,'Recogidos '+take+' '+({gold:'de oro',wood:'de madera',supply:'de petróleo',metal:'de acero',credits:'cash locales'}[resource])+'. Quedan '+w.remaining+' recogidas.');
 }
 function rechargeWonder(s,id){const b=s.buildings.find(b=>b.id===id),q=wonderQuote(s,b);if(s.battle||!q.ok)return result(false,q.message||'Regresa a la base.');const w=initWonder(s,b);if(w.remaining>0||b.stored>0)return result(false,'Restaura la maravilla cuando haya agotado todas las recogidas.');if(!affordable(s,q.recharge))return result(false,'Faltan materiales para restaurar la maravilla.');pay(s,q.recharge);w.remaining=q.charges;w.ends=s.time+q.duration;return result(true,'Maravilla restaurada. Se ha iniciado su siguiente ciclo.');}
 function fusionQuote(s,building,ids){
  const b=s.buildings.find(b=>b.id===building&&b.type==='fusion'),x=specialState(s),inputs=Array.isArray(ids)?ids.map(id=>s.army.find(u=>u.id===id)):[];
  let message=s.battle?'Regresa a la base para fusionar.':!b||b.hp<=0||b.job?'Necesitas una cámara de fusión operativa.':!active(s,'research')||active(s,'research').level<2?'Necesitas un laboratorio operativo de nivel 2.':experience(s).level<5?'Necesitas comandante nivel 5.':x.fusions.some(j=>j.building===building)?'Esta cámara tiene una fusión pendiente.':inputs.length!==2||new Set(ids).size!==2||inputs.some(u=>!u||!fusionEligible(u.type))?'Selecciona dos tropas compatibles diferentes de tu base.':'';
  const cost={gold:400,metal:200,supply:150},possible=[];
  if(!message){
   const powers=inputs.map(u=>fusionPower(u.type)),pool=fusionPool.filter(t=>!inputs.some(u=>u.type===t)&&hqLevel(s)>=UNITS[t].hq&&!unlockMessage(s,t,true)).sort((a,b)=>fusionPower(a)-fusionPower(b)||a.localeCompare(b));
   for(let roll=0;roll<12;roll++){let power=Math.max(10,Math.ceil(Math.min(...powers)*.3+Math.max(...powers)*.7))+roll;if(power===Math.max(...powers))power++;
    const type=pool.find(t=>fusionPower(t)>=power);if(type)possible.push(type);
   }
   if(possible.length!==12)message='No hay suficientes resultados compatibles para esta potencia. Prueba con otras tropas.';
   else if(population(s)+Math.max(...possible.map(t=>UNITS[t].pop))>populationCap(s))message='Amplía las viviendas para reservar espacio al resultado y conservar a ambas tropas.';
  }
  return{ok:!message,message,cost,possible,inputs:inputs.filter(Boolean),duration:Math.ceil(14400/speed(s)/(1+Math.max(0,(b?.level||1)-1)*.05))};
 }
 function startFusion(s,building,ids){
  const q=fusionQuote(s,building,ids);if(!q.ok)return q;if(!affordable(s,q.cost))return result(false,'Faltan materiales para la fusión.');
  const x=specialState(s);const hash=((s.seed^Math.imul(x.entropy+1,2654435761))>>>0),type=q.possible[hash%12];
  pay(s,q.cost);x.entropy++;s.army=s.army.filter(u=>!ids.includes(u.id));
  x.fusions.push({building,type,inputs:q.inputs,cost:q.cost,started:s.time,ends:s.time+q.duration,status:'working'});
  initGarrison(s);return result(true,'Fusión iniciada. Ambas tropas quedan protegidas dentro de la cámara.');
 }
 function claimFusion(s,building,cancel=false){
  const x=specialState(s),j=x.fusions.find(j=>j.building===building),b=s.buildings.find(b=>b.id===building);
  if(s.battle||!j)return result(false,'Regresa a la base y elige una fusión pendiente.');
  if(!cancel&&(j.status!=='ready'||!b||b.hp<=0||b.job))return result(false,'Espera a que termine y repara la cámara para recoger el resultado.');
  if(!cancel&&population(s)>populationCap(s))return result(false,'Amplía las viviendas antes de recoger el resultado. Las tropas se conservan.');
  x.fusions=x.fusions.filter(v=>v!==j);
  for(const u of j.inputs){const level=Math.max(u.level,s.research[u.type]||1);if(level>u.level){const ratio=u.hp/u.maxHp;u.level=level;u.maxHp=unitStats(u.type,level).hp;u.hp=Math.max(1,Math.ceil(ratio*u.maxHp));}s.army.push(u);}
  if(!cancel){s.army.push(makeUnit(s,j.type));remember(s,j.type);s.stats.trained++;s.xp+=80;log(s,'Fusión completada: '+UNITS[j.type].name+'. Las dos tropas participantes regresaron.');}
  initGarrison(s);return result(true,cancel?'Tropas recuperadas. Los materiales de la fusión no se devuelven.':'Resultado recogido y tropas participantes recuperadas.');
 }
 function tick(s,dt){
  const x=specialState(s);
  for(const [type,c]of Object.entries(x.centers))if(c.job){const b=s.buildings.find(b=>b.id===c.job.building);if(!b||b.hp<=0||b.job){c.job.ends+=dt;continue;}if(s.time>=c.job.ends){c.job=null;c.step++;log(s,BUILDINGS[type].name+': etapa '+c.step+'/10 terminada.');}}
  for(const j of x.fusions)if(j.status==='working'){const b=s.buildings.find(b=>b.id===j.building);if(!b||b.hp<=0||b.job){j.ends+=dt;continue;}if(s.time>=j.ends){j.status='ready';log(s,'Fusión lista para recoger.');}}
  for(const b of s.buildings.filter(b=>isWonder(b.type))){if(b.hp<=0||b.job){if(b.wonder)b.wonder.ends+=dt;continue;}const w=initWonder(s,b,s.time-dt),d=DATA.wonders[b.type];if(w.legacyAmount>0&&!w.legacy&&s.time>=w.ends){b.stored=w.legacyAmount;w.legacyAmount=0;w.legacy=true;}else if(!w.legacy&&w.remaining>0&&b.stored<d.amount&&s.time>=w.ends){b.stored=d.amount;log(s,BUILDINGS[b.type].name+': recogida lista.');}}
 }
 function migrate(s){for(const b of s.buildings.filter(b=>isWonder(b.type)&&b.production)){const p=b.production,w=initWonder(s,b);if(p.status==='working'){w.legacyAmount=p.amount;w.ends=p.ends;}delete b.production;delete b.productionMode;}}
 return{claimRewards,claimDaily,cashQuote,requisition,prototypeQuote,advancePrototype,claimPrototype,collectWonder,rechargeWonder,fusionQuote,startFusion,claimFusion,tick,migrate,prepareWonder:initWonder};
}

export function validateSpecials(s){
 if(s.special===undefined)specialState(s);
 const x=s.special,int=(v,min=0,max=1e9)=>Number.isInteger(v)&&v>=min&&v<=max,time=v=>Number.isFinite(v)&&v>=0&&v<=1e12;
 const bad=()=>{throw Error('Progresión especial no válida.');};
 if(!x||x.version!==1||!int(x.credits)||!int(x.entropy)||!x.centers||typeof x.centers!=='object'||Array.isArray(x.centers)||!Array.isArray(x.fusions)||x.fusions.length>20||!Array.isArray(x.discovered)||x.discovered.length>Object.keys(UNITS).length||x.discovered.some(t=>!Object.hasOwn(UNITS,t))||!x.pending||!Array.isArray(x.units)||x.units.length>1000||!x.daily||!int(x.daily.streak,0,5)||!(x.daily.lastDay===null||int(x.daily.lastDay,-100000,1000000)))bad();
 for(const k of ['gold','wood','supply','metal'])if(!Number.isFinite(x.pending[k])||x.pending[k]<0||x.pending[k]>1e9)bad();
 for(const u of x.units)if(!Object.hasOwn(UNITS,u.type)||!int(u.level,1,5))bad();
 const buildings=new Map(s.buildings.map(b=>[b.id,b])),occupied=new Set([...s.army,...(s.battle?.units||[]),...(s.battle?.reserve||[])].map(u=>u.id)),cameras=new Set();
 for(const [type,c]of Object.entries(x.centers)){if(!isPrototypeCenter(type)||!c||!int(c.index,0,5)||!int(c.step,0,10))bad();if(c.job&&(!buildings.has(c.job.building)||buildings.get(c.job.building).type!==type||!time(c.job.started)||!time(c.job.ends)||c.job.ends<c.job.started||c.step>=10))bad();}
 for(const j of x.fusions){if(!j||buildings.get(j.building)?.type!=='fusion'||cameras.has(j.building)||!fusionEligible(j.type)||!Array.isArray(j.inputs)||j.inputs.length!==2||!time(j.started)||!time(j.ends)||j.ends<j.started||!['working','ready'].includes(j.status))bad();cameras.add(j.building);
  for(const u of j.inputs){if(!u||!/^u[0-9]+$/.test(u.id)||occupied.has(u.id)||!fusionEligible(u.type)||!int(u.level,1,5)||!Number.isFinite(u.hp)||!Number.isFinite(u.maxHp)||u.hp<=0||u.maxHp<=0||u.hp>u.maxHp||!Number.isFinite(u.x??0)||!Number.isFinite(u.y??0))bad();occupied.add(u.id);}
 }
 for(const b of s.buildings)if(b.wonder!==undefined){const w=b.wonder,d=DATA.wonders[b.type];if(!d||!w||!int(w.remaining,0,d.charges)||!time(w.ends)||typeof w.legacy!=='boolean'||(!w.legacy&&b.stored>d.amount)||(w.legacyAmount!==undefined&&(!Number.isFinite(w.legacyAmount)||w.legacyAmount<0||w.legacyAmount>1000000)))bad();}
}

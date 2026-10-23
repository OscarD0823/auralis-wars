import {COLLECTIONS,COLLECTION_ITEMS} from './collections-data.js';
import {BUILDINGS,UNITS} from './catalog.js';
export {COLLECTIONS,COLLECTION_ITEMS} from './collections-data.js';
const result=(ok,message)=>({ok,message});
export function inventoryState(s){return s.inventory??={version:1,items:{},completed:[],storage:[],entropy:0,harvest:0,recent:[]};}
function random(s){const v=inventoryState(s);let n=(s.seed^Math.imul(++v.entropy,0x9e3779b9))>>>0;n^=n>>>16;n=Math.imul(n,0x21f0aaad);n^=n>>>15;n=Math.imul(n,0x735a2d97);n^=n>>>15;return(n>>>0)/4294967296;}
// Original Inventory.as: 8% combat, 20% harvest; rare/epic thresholds are nested.
export function rollCollectible(s,source){
 if(![0,1,4].includes(source))return null;
 const v=inventoryState(s),roll=random(s)*100,mult=source===4?5:2;
 if(roll>=4*mult)return null;
 const rarity=roll<.5*mult?2:roll<mult?1:0;
 const pool=Object.values(COLLECTION_ITEMS).filter(i=>i.source===source&&i.rarity===rarity),item=pool[Math.floor(random(s)*pool.length)];
 if(!item)return null;
 v.items[item.id]=Math.min(1000000,(v.items[item.id]||0)+1);v.recent.unshift({id:item.id,time:s.time});v.recent.length=Math.min(8,v.recent.length);
 return item;
}
export function recordCombatLoot(s,b,target,source){if(b.kind==='network'||source?.side!=='player'||target.side!=='enemy'||target.expires)return null;return rollCollectible(s,target.type in UNITS?0:1);}
// Auralis deliveries can be partial: only actual production/extraction delivered counts.
// Accumulating 100 resources gives one harvest roll, independent of clicking/splitting.
export function recordHarvest(s,amount){
 if(!Number.isFinite(amount)||amount<=0)return;
 const v=inventoryState(s),total=v.harvest+amount,count=Math.floor((total+1e-7)/100);v.harvest=Math.max(0,total-count*100);
 for(let i=0;i<Math.min(count,10000);i++)rollCollectible(s,4);
}
export function collectionQuote(s,id){
 const c=COLLECTIONS.find(c=>c.id===Number(id)),v=inventoryState(s);if(!c)return{ok:false,message:'Colección desconocida.'};
 const count=c.items.filter(id=>v.items[id]>0).length,done=v.completed.includes(c.id);
 const message=done?'Recompensa ya reclamada.':c.social?'Funciones sociales pausadas.':count<5?'Reúne una pieza de cada tipo.':'';
 return{...c,count,done,ok:!message,message};
}
export function createCollections({makeUnit,population,populationCap,placement,buildingStats,initGarrison,log}){
 function claim(s,id){
  const q=collectionQuote(s,id);if(!q.ok)return result(false,q.message);
  const v=inventoryState(s);for(const id of q.items){if(--v.items[id]===0)delete v.items[id];}
  v.completed.push(q.id);v.storage.push(q.id);log(s,'Colección '+q.name+' completada. Premio guardado en el almacén.');
  return result(true,'Colección completada. Tu recompensa está en el almacén.');
 }
 function deploy(s,id,x,y){
  const c=COLLECTIONS.find(c=>c.id===Number(id)),v=inventoryState(s);if(!c||!v.storage.includes(c.id))return result(false,'Esta recompensa no está en el almacén.');
  if(s.battle)return result(false,'Regresa a tu base para recibir la recompensa.');
  const r=c.reward;
  if(r.unit){
   if(s.army.length>=1000||population(s)+UNITS[r.type].pop>populationCap(s))return result(false,'Amplía las viviendas. La tropa se conserva en el almacén.');
   s.army.push(makeUnit(s,r.type));s.stats.trained++;
   if(!s.special.discovered.includes(r.type))s.special.discovered.push(r.type);
  }else{
   if(s.buildings.length>=1000||s.buildings.filter(b=>b.type===r.type).length>=BUILDINGS[r.type].limit)return result(false,'Límite de este edificio alcanzado. La recompensa se conserva.');
   const q=placement(s,r.type,x,y);if(!q.ok)return q;
   s.buildings.push({id:'b'+s.serial++,type:r.type,x,y,level:r.level,hp:buildingStats(r.type,r.level).hp,stored:0,job:null});s.stats.built++;
  }
  v.storage.splice(v.storage.indexOf(c.id),1);initGarrison(s);
  log(s,'Recompensa recibida: '+(r.unit?UNITS[r.type].name:BUILDINGS[r.type].name)+'.');return result(true,r.unit?'Tropa incorporada a la guarnición.':'Edificio colocado desde el almacén.');
 }
 return{claim,deploy};
}
export function validateInventory(s){
 if(s.inventory===undefined){inventoryState(s);return;}
 const v=s.inventory,plain=o=>o&&typeof o==='object'&&!Array.isArray(o),ids=a=>Array.isArray(a)&&a.length<=10&&new Set(a).size===a.length&&a.every(id=>COLLECTIONS.some(c=>c.id===id));
 if(!v||v.version!==1||!plain(v.items)||Object.keys(v.items).length>50||Object.entries(v.items).some(([id,n])=>!Object.hasOwn(COLLECTION_ITEMS,id)||!Number.isInteger(n)||n<1||n>1000000)||!ids(v.completed)||!ids(v.storage)||v.completed.some(id=>COLLECTIONS.find(c=>c.id===id).social)||v.storage.some(id=>!v.completed.includes(id))||!Number.isSafeInteger(v.entropy)||v.entropy<0||v.entropy>1e12||!Number.isFinite(v.harvest)||v.harvest<0||v.harvest>=100||!Array.isArray(v.recent)||v.recent.length>8||v.recent.some(r=>!r||!Object.hasOwn(COLLECTION_ITEMS,r.id)||!Number.isFinite(r.time)||r.time<0||r.time>s.time))throw Error('Colecciones o almacén no válidos.');
}

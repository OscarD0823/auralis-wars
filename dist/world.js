import {WORLD_DATA} from './world-data.js';
export const HOME_SIZE=100,SECTOR_SIZE=10,LEGACY_SIZE=32;
export const randomTile=(x,y,seed=1)=>{let n=Math.imul(x+seed,374761393)^Math.imul(y+17,668265263);n=Math.imul(n^(n>>>13),1274126177);return((n^(n>>>16))>>>0)/4294967296;};
export function legacyTerrain(x,y,seed){if(x<0||y<0||x>=32||y>=32)return'void';if(x>28||y>29)return'water';if((x<6||y<6||x>24||y>25)&&randomTile(x,y,seed)<.28)return randomTile(x+9,y,seed)<.8?'tree':'rock';return'grass';}
export const mapSize=s=>s?.world?HOME_SIZE:LEGACY_SIZE;
export const sectorId=(x,y)=>x<0||y<0||x>=100||y>=100?0:Math.floor(y/10)*10+Math.floor(x/10)+1;
export const sectorOrigin=id=>({x:(id-1)%10*10,y:Math.floor((id-1)/10)*10});
export const owns=(s,x,y)=>!s.world||s.world.owned.includes(sectorId(x,y));
export function tileCode(world,x,y){if(x<0||y<0||x>=100||y>=100)return 0;return WORLD_DATA.maps[world?.layout||'MAP_PLAYER_1']?.[Math.floor(y/5)]?.[Math.floor(x/5)]??0;}
export const readyBridge=b=>!b.broken&&!b.job;
export function onBridge(world,x,y){return world?.bridges?.some(b=>readyBridge(b)&&x>=b.x&&y>=b.y&&x<b.x+5&&y<b.y+5)||false;}
export function surface(s,x,y){if(!s.world)return legacyTerrain(x,y,s.seed)==='water'?'water':x<0||y<0||x>=32||y>=32?'void':'grass';if(x<0||y<0||x>=100||y>=100)return'void';const o=s.world.legacyOrigin;if(o&&x>=o.x&&y>=o.y&&x<o.x+32&&y<o.y+32)return legacyTerrain(x-o.x,y-o.y,s.seed)==='water'?'water':'grass';return tileCode(s.world,x,y)===0?'water':'grass';}
export function naturalTerrain(s,x,y){x=Math.floor(x);y=Math.floor(y);if(onBridge(s.world,x,y))return'grass';const base=surface(s,x,y);if(base!=='grass')return base;if(!s.world)return legacyTerrain(x,y,s.seed);const o=s.world.legacyOrigin;if(o&&x>=o.x&&y>=o.y&&x<o.x+32&&y<o.y+32)return legacyTerrain(x-o.x,y-o.y,s.seed);
 // A small starting clearing, with harvestable resources close to the workers.
 if(s.world.layout==='MAP_PLAYER_1'&&x>=40&&x<60&&y>=30&&y<50){if([[43,35],[55,38],[43,46],[57,47],[50,32]].some(p=>p[0]===x&&p[1]===y))return x===55?'rock':'tree';return'grass';}
 return randomTile(x,y,s.seed)<.085?(randomTile(x+9,y,s.seed)<.78?'tree':'rock'):'grass';
}
export function makeWorld(layout='MAP_PLAYER_1',home=true){return{version:1,layout,owned:home?[35,36,45,46]:[],bridges:home?WORLD_DATA.bridges.map((b,i)=>({...b,id:'br-native-'+i,fixed:true,job:null})):[],revision:0};}
export function migrateWorld(s,{legacy=true,sizeOf=b=>2}={}){
 if(s.world)return false;const dx=37,dy=28,shift=p=>{p.x+=dx;p.y+=dy;};s.world=makeWorld();if(legacy)s.world.legacyOrigin={x:dx,y:dy};
 for(const b of s.buildings)shift(b);s.cleared=s.cleared.map(k=>{const[x,y]=k.split(':').map(Number);return(x+dx)+':'+(y+dy);});
 if(s.workforce){const f=s.workforce;f.deposits=Object.fromEntries(Object.entries(f.deposits).map(([k,v])=>{const[x,y]=k.split(':').map(Number);return[(x+dx)+':'+(y+dy),v];}));for(const w of f.workers){shift(w);if(w.order)shift(w.order);for(const p of w.path)shift(p);}}
 // Every previously usable plot stays available, including customised bases.
 if(legacy){const owned=new Set(s.world.owned);for(let y=dy;y<dy+32;y++)for(let x=dx;x<dx+32;x++)if(legacyTerrain(x-dx,y-dy,s.seed)!=='water')owned.add(sectorId(x,y));for(const b of s.buildings)for(let y=b.y;y<b.y+sizeOf(b);y++)for(let x=b.x;x<b.x+sizeOf(b);x++)owned.add(sectorId(x,y));s.world.owned=[...owned].sort((a,b)=>a-b);}
 for(const u of s.army){delete u.x;delete u.y;delete u.homePosition;delete u.order;}return true;
}
export function expansionQuote(s,id){let message='';const owned=s.world?.owned||[],p=sectorOrigin(id),adjacent=owned.some(other=>{const q=sectorOrigin(other);return Math.abs(p.x-q.x)+Math.abs(p.y-q.y)===10;});
 if(!s.world)message='Actualiza esta base al archipiélago.';else if(!Number.isInteger(id)||id<1||id>72)message='Este sector está reservado a los escenarios enemigos.';else if(owned.includes(id))message='Este terreno ya pertenece a tu base.';else if(s.battle)message='Termina la batalla antes de ampliar.';else if(!adjacent)message='Elige un sector contiguo al territorio propio.';
 return{ok:!message,message,id,cost:{gold:WORLD_DATA.prices[owned.length]??100000},origin:p};
}
export function validateWorld(s){const w=s.world;if(w===undefined)return;if(!w||w.version!==1||!Object.hasOwn(WORLD_DATA.maps,w.layout)||!Array.isArray(w.owned)||w.owned.length>72||new Set(w.owned).size!==w.owned.length||w.owned.some(id=>!Number.isInteger(id)||id<1||id>72)||!Array.isArray(w.bridges)||w.bridges.length>150||!Number.isFinite(w.revision)||w.revision<0)throw Error('Archipiélago no válido.');if(w.legacyOrigin&&(!Number.isInteger(w.legacyOrigin.x)||!Number.isInteger(w.legacyOrigin.y)||w.legacyOrigin.x<0||w.legacyOrigin.y<0||w.legacyOrigin.x+32>100||w.legacyOrigin.y+32>100))throw Error('Terreno antiguo no válido.');if(w.market&&(!Number.isFinite(w.market.started)||w.market.started<0||!Number.isInteger(w.market.used)||w.market.used<0||w.market.used>20))throw Error('Mercado no válido.');const ids=new Set();for(const b of w.bridges){if(!b||typeof b.id!=='string'||!/^br[A-Za-z0-9_-]{1,60}$/.test(b.id)||ids.has(b.id)||!Number.isInteger(b.x)||!Number.isInteger(b.y)||b.x<0||b.y<0||b.x+5>100||b.y+5>100||![0,1].includes(b.orientation)||typeof b.broken!=='boolean'||(b.job&&(!Number.isFinite(b.job.started)||!Number.isFinite(b.job.ends)||b.job.ends<b.job.started)))throw Error('Puente no válido.');ids.add(b.id);}}
export const productionOptions=WORLD_DATA.cycles.minutes.map((minutes,i)=>({index:i,minutes,multiplier:WORLD_DATA.cycles.multipliers[i]}));
export const mapLayouts=Object.keys(WORLD_DATA.maps);
export const originalTiles=layout=>WORLD_DATA.maps[layout];

// The generator version is part of the save. A seed never changes its coastline.
const maps=new Map();
export const GENERATOR_VERSION=1;
export const BIOMES={
 forest:{name:'Bosque templado',resource:'wood',trees:.13,rocks:.025,tint:'#699b3821'},
 tropical:{name:'Archipiélago tropical',resource:'supply',trees:.17,rocks:.015,tint:'#53b29420'},
 desert:{name:'Desierto mineral',resource:'gold',trees:.012,rocks:.085,tint:'#dfad6855'},
 tundra:{name:'Tundra',resource:'metal',trees:.035,rocks:.09,tint:'#dce9f177'},
 volcanic:{name:'Isla volcánica',resource:'metal',trees:.015,rocks:.15,tint:'#6e536b40'},
 marsh:{name:'Humedales',resource:'supply',trees:.10,rocks:.025,tint:'#487e7440'}
};
export function noise(x,y,seed){let n=Math.imul(x+seed,374761393)^Math.imul(y+17,668265263);n=Math.imul(n^(n>>>13),1274126177);return((n^(n>>>16))>>>0)/4294967296;}
export function proceduralTiles(p){
 const key=p.version+':'+p.seed+':'+p.biome;if(maps.has(key))return maps.get(key);
 const matrix=Array.from({length:20},(_,y)=>Array.from({length:20},(_,x)=>{
  const dx=(x-10)/7.5,dy=(y-10)/7.6,coast=1+(noise(x>>1,y>>1,p.seed)-.5)*.33;
  let land=dx*dx+dy*dy<coast;
  // A continuous, fair landing corridor; the river has a real bridge crossing.
  if(x>=3&&x<=16&&y>=9&&y<=11)land=true;
  if(x<=2&&y>=9&&y<=11)land=false;
  if(x===11&&y>=3&&y<=16)land=false;
  if((x<3||x>16)&&y!==10&&noise(x,y,p.seed+73)>.87)land=true;
  if(x<1||y<1||x>18||y>18)land=false;
  return land?1:0;
 }));
 // Original beach tiles: N, E, S, W and the four convex corners.
 const coastCodes={1:2,2:5,4:3,8:4,9:6,3:7,12:8,6:9};
 const tiles=matrix.map((row,y)=>row.map((v,x)=>{if(!v)return 0;const water=(xx,yy)=>!matrix[yy]?.[xx];const edges=(water(x,y-1)?1:0)+(water(x+1,y)?2:0)+(water(x,y+1)?4:0)+(water(x-1,y)?8:0);return coastCodes[edges]||1;}));
 if(maps.size>=24)maps.delete(maps.keys().next().value);maps.set(key,tiles);return tiles;
}
export function proceduralNature(p,x,y){
 // Road, landing camp and enemy base stay traversable for every biome/seed.
 if((y>=47&&y<=53&&x>=15&&x<=84)||(x>=17&&x<27&&y>=43&&y<57)||(x>=62&&x<84&&y>=35&&y<68))return'grass';
 const biome=BIOMES[p.biome],v=noise(x,y,p.seed+19);return v<biome.trees?'tree':v<biome.trees+biome.rocks?'rock':'grass';
}
export function expeditionWorld(target){return{version:1,layout:'MAP_PLAYER_1',owned:[],mission:true,nature:'procedural',procedural:{version:GENERATOR_VERSION,seed:target.seed,biome:target.biome},revision:0,bridges:[{id:'br-expedition',x:55,y:50,orientation:0,broken:false,job:null}]};}
export function validateProcedural(p){if(!p||p.version!==GENERATOR_VERSION||!Number.isInteger(p.seed)||p.seed<0||p.seed>4294967295||!Object.hasOwn(BIOMES,p.biome))throw Error('Semilla o bioma de expedición no válidos.');}
export const SEASON_SECONDS=1800;
export function seasonAt(time){const day=Math.floor(Math.max(0,time)/60),index=Math.floor(Math.max(0,time)/SEASON_SECONDS)%4;return{index,name:['Primavera','Verano','Otoño','Invierno'][index],year:Math.floor(time/(SEASON_SECONDS*4))+1,day:day%30+1,remaining:SEASON_SECONDS-time%SEASON_SECONDS};}
export function terrainTint(world,time){const b=world?.procedural?.biome;if(!b)return null;const season=seasonAt(time).index;if(b==='tundra')return BIOMES[b].tint;if(b==='desert'||b==='volcanic'||b==='tropical')return BIOMES[b].tint;return season===3?'#dce6ec66':season===2?'#cf98533a':BIOMES[b].tint;}

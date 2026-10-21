import{SOURCE_MAP,BUILDINGS,UNITS,DIFFICULTIES}from'./catalog.js';
import{naturalTerrain,sectorOrigin,randomTile}from'./world.js';
import{experience}from'./progression.js';
import{HOME_MAP_DATA}from'./home-map-data.js';
// Original MapInitializer.spawnIdleEnemies sector groups. Counts scale with the
// commander; placement is seeded and validated against current ownership/terrain.
export const PATROL_CLUSTERS=[[41,51,61,31],[6,7,8,9,10,4,5],[94,95,96,97,98,92,93]];
export function createHomePatrols(s,h,makeUnit){
 const level=experience(s).level,count=Math.min(25,Math.round(level/5)+5),ids=level<7?[1122]:level<9?[1122,1123]:level<11?[1122,1123,1133]:level<15?[1107,1123,1133]:[1107,1132,1124,1106];
 const groups=[],blocks=[...s.buildings,...h.buildings.filter(b=>b.hp>0)],regions=(h.layout===1?HOME_MAP_DATA:HOME_MAP_DATA.chapters.find(c=>c.number===h.layout)).areas;
 const groupsBySeed=PATROL_CLUSTERS.map((clusters,i)=>({clusters,i,rank:randomTile(i,h.wave,s.seed)})).sort((a,b)=>a.rank-b.rank);
 for(const{clusters,i:group}of groupsBySeed){
  for(const id of clusters){
   const p=sectorOrigin(id),neighbors=s.world.owned.some(o=>{const q=sectorOrigin(o);return Math.abs(q.x-p.x)<=10&&Math.abs(q.y-p.y)<=10;});if(neighbors)continue;
   const cells=[];for(let y=p.y+1;y<p.y+9;y++)for(let x=p.x+1;x<p.x+9;x++){
    if(naturalTerrain(s,x,y)!=='grass'||regions.some(([rx,ry,rw,rh])=>x>=rx&&x<rx+rw&&y>=ry&&y<ry+rh)||blocks.some(b=>x>=b.x&&x<b.x+(b.width||BUILDINGS[b.type].size)&&y>=b.y&&y<b.y+(b.height||BUILDINGS[b.type].size)))continue;
    cells.push({x:x+.5,y:y+.5,rank:randomTile(x,y,s.seed+h.wave)});
   }
   cells.sort((a,b)=>a.rank-b.rank);if(cells.length<count)continue;
   const units=cells.slice(0,count).map((p,n)=>{const type=SOURCE_MAP[ids[n%ids.length]].type,u=makeUnit({serial:1,research:{}},type,Math.min(5,1+Math.floor(level/10)));return Object.assign(u,{id:'hmr-'+group+'_'+n,sourceId:UNITS[type].sourceId,side:'enemy',roamer:true,cluster:id,group,guard:{x:p.x,y:p.y},x:p.x,y:p.y,order:{kind:'hold',x:p.x,y:p.y},damageScale:DIFFICULTIES[s.difficulty].damage});});
   groups.push(units);break;
  }
  if(groups.length===2)break;
 }
 return groups.flat();
}

// Runtime-only grids and routes. They are deliberately absent from save files.
export function obstacleGrid(size,blocked){const cells=new Uint8Array(size*size);for(let y=0;y<size;y++)for(let x=0;x<size;x++)cells[y*size+x]=blocked(x,y)?1:0;return{size,cells};}
export function gridBlocked(grid,x,y){x=Math.floor(x);y=Math.floor(y);return x<0||y<0||x>=grid.size||y>=grid.size||!!grid.cells[y*grid.size+x];}
export function findGridPath(grid,from,goals){
 const n=grid.size,sx=Math.floor(from.x),sy=Math.floor(from.y);if(sx<0||sy<0||sx>=n||sy>=n)return null;
 const targets=new Uint8Array(n*n);let count=0;for(const p of goals){if(!gridBlocked(grid,p.x,p.y)){targets[Math.floor(p.y)*n+Math.floor(p.x)]=1;count++;}}if(!count)return null;
 const parents=new Int32Array(n*n);parents.fill(-2);const queue=new Int32Array(n*n),start=sy*n+sx;parents[start]=-1;queue[0]=start;let head=0,tail=1,end=-1;
 while(head<tail){const i=queue[head++];if(targets[i]){end=i;break;}const x=i%n,y=(i/n)|0;for(const j of[x+1<n?i+1:-1,y+1<n?i+n:-1,x>0?i-1:-1,y>0?i-n:-1]){if(j<0||parents[j]!==-2||grid.cells[j])continue;parents[j]=i;queue[tail++]=j;}}
 if(end<0)return null;const path=[];for(let i=end;i!==start;i=parents[i])path.push({x:i%n+.5,y:((i/n)|0)+.5});path.reverse();return path;
}
export function clearSegment(grid,a,b){const d=Math.hypot(b.x-a.x,b.y-a.y),steps=Math.max(1,Math.ceil(d*5));for(let i=1;i<=steps;i++)if(gridBlocked(grid,a.x+(b.x-a.x)*i/steps,a.y+(b.y-a.y)*i/steps))return false;return true;}
export function createCombatNavigation({size:configuredSize,terrain,water,buildings,units}){
 const fields=new WeakMap(),routes=new WeakMap();let revision=0;
 function prepare(b,cleared=[]){const size=typeof configuredSize==='function'?configuredSize(b):configuredSize,key=b.seed+'|'+(b.world?.revision||0)+'|'+(b.units?.length||0)+'|'+cleared.join(',')+'|'+b.buildings.map(v=>[v.id,v.x,v.y,v.hp>0].join(':')).join(',');let field=fields.get(b);if(field?.key===key)return field;
  const occupied=new Uint8Array(size*size);for(const v of b.buildings.filter(v=>v.hp>0)){const n=v.size||buildings[v.type].size;for(let y=v.y;y<v.y+(v.height||n);y++)for(let x=v.x;x<v.x+(v.width||n);x++)if(x>=0&&y>=0&&x<size&&y<size)occupied[y*size+x]=1;}
  const open=new Set(cleared);
  if(['home','homeland'].includes(b.kind))for(const v of b.buildings.filter(v=>v.sourceId&&v.hp<=0)){const n=v.size||buildings[v.type].size;for(let y=v.y;y<v.y+(v.height||n);y++)for(let x=v.x;x<v.x+(v.width||n);x++)if(!water||!water(x,y,b))open.add(x+':'+y);}
  const grid=obstacleGrid(size,(x,y)=>x<1||y<1||x>=size-1||y>=size-1||occupied[y*size+x]||(!(b.kind==='attack'&&!b.world&&x>=2&&x<=9&&y>=4&&y<=28)&&!open.has(x+':'+y)&&terrain(x,y,b.seed,b)!=='grass')),naval=obstacleGrid(size,(x,y)=>x<1||y<1||x>=size-1||y>=size-1||occupied[y*size+x]||(water?!water(x,y,b):terrain(x,y,b.seed,b)!=='water'));
  // Old saves and raid formations can start inside an obstacle. Resolve only
  // those invalid positions to the closest free cell when topology changes.
  const taken=new Set((b.units||[]).filter(u=>u.hp>0&&!units[u.type].flying).map(u=>Math.floor(u.y)*size+Math.floor(u.x)));
  for(const u of b.units||[]){const movementGrid=units[u.type].waterborne?naval:grid;if(u.hp<=0||units[u.type].flying||!gridBlocked(movementGrid,u.x,u.y))continue;let best=null,distance=Infinity;for(let y=1;y<size-1;y++)for(let x=1;x<size-1;x++){if(movementGrid.cells[y*size+x]||taken.has(y*size+x))continue;const d=(u.x-x-.5)**2+(u.y-y-.5)**2;if(d<distance){distance=d;best={x:x+.5,y:y+.5};}}if(best){u.x=best.x;u.y=best.y;taken.add(Math.floor(u.y)*size+Math.floor(u.x));routes.delete(u);}}
  field={key,grid,naval,revision:++revision};fields.set(b,field);return field;
 }
 function move(b,u,target,speed,dt){
  const dx=target.x-u.x,dy=target.y-u.y,d=Math.hypot(dx,dy);if(d<.06)return false;
  if(units[u.type].flying){const step=Math.min(d,speed*dt);u.x+=dx/d*step;u.y+=dy/d*step;u.facing=Math.atan2(dx,dy);return step>0;}
  const field=fields.get(b)||prepare(b),grid=units[u.type].waterborne?field.naval:field.grid,isDestination=u.order?.kind==='move'||(u.order?.kind==='attack'&&target===u.order);
  const radius=isDestination?0:Math.max(.75,(target.size||buildings[target.type]?.size||0)*.48+units[u.type].range-.15),tx=Math.floor(target.x),ty=Math.floor(target.y),key=field.revision+':'+tx+':'+ty+':'+radius+':'+isDestination;
  let route=routes.get(u);if(!route||route.key!==key){const goals=[];if(!radius){if(!gridBlocked(grid,tx,ty))goals.push({x:tx,y:ty});else for(let y=ty-1;y<=ty+1;y++)for(let x=tx-1;x<=tx+1;x++)goals.push({x,y});}else for(let y=Math.floor(target.y-radius);y<=Math.ceil(target.y+radius);y++)for(let x=Math.floor(target.x-radius);x<=Math.ceil(target.x+radius);x++)if(Math.hypot(x+.5-target.x,y+.5-target.y)<=radius)goals.push({x,y});const points=findGridPath(grid,u,goals);route={key,points};routes.set(u,route);}
  if(!route.points)return false;while(route.points.length&&Math.hypot(u.x-route.points[0].x,u.y-route.points[0].y)<.06)route.points.shift();
  // Smooth a valid grid route only across segments that remain unobstructed.
  while(route.points.length>1&&clearSegment(grid,u,route.points[1]))route.points.shift();
  const goal=route.points[0]||(!gridBlocked(grid,target.x,target.y)&&isDestination?target:null);if(!goal)return false;
  if(!clearSegment(grid,u,goal)){routes.delete(u);return false;}
  const gx=goal.x-u.x,gy=goal.y-u.y,length=Math.hypot(gx,gy),step=Math.min(length,speed*dt);if(length<1e-7)return false;u.x+=gx/length*step;u.y+=gy/length*step;u.facing=Math.atan2(gx,gy);return step>0;
 }
 return{prepare,move,blocked:(b,x,y,u)=>{const f=fields.get(b)||prepare(b);return gridBlocked(units[u?.type]?.waterborne?f.naval:f.grid,x,y);}};
}

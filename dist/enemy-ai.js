import {BUILDINGS,UNITS,unitStats} from './catalog.js';
import {mapSize} from './world.js';

const center=o=>({x:o.x+(o.width||o.size||BUILDINGS[o.type]?.size||0)/2,y:o.y+(o.height||o.size||BUILDINGS[o.type]?.size||0)/2});
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const strength=u=>u.hp*Math.max(1,unitStats(u.type,u.level).damage)/Math.max(.4,unitStats(u.type,u.level).interval);
const supportedKinds=new Set(['homeland','attack','raid','expedition','colony-defense']);
const factories=new Set(Object.values(UNITS).map(u=>u.factory));

// Decisions run once per second; movement still uses the authoritative land/sea grid.
// Scripted mission convoys, actors and triggers keep their campaign controller.
export function commandEnemies(s,b,{blocked,canHit,makeUnit},now=b.elapsed){
 if(!supportedKinds.has(b.kind))return;
 const command=b.command??={next:0,tactic:'guard',decisions:0};
 if(now<command.next)return;command.next=now+1;command.decisions++;
 const enemies=b.units.filter(u=>u.side==='enemy'&&u.hp>0&&!u.embarked),players=b.units.filter(u=>u.side==='player'&&u.hp>0&&!u.embarked&&!u.evacuated);
 const defenses=b.buildings.filter(v=>v.side==='enemy'&&v.hp>0&&(v.attack??BUILDINGS[v.type].attack)>0);
 const core=b.buildings.find(v=>v.id===b.homeState?.commandId)||b.buildings.find(v=>v.side==='enemy'&&v.type==='hq');
 const safePoint=(u,p)=>{
  const n=mapSize(b),q={x:Math.max(1.5,Math.min(n-1.5,p.x)),y:Math.max(1.5,Math.min(n-1.5,p.y))};
  if(UNITS[u.type].flying||!blocked(b,q.x,q.y,u))return q;
  for(let r=1;r<=4;r++)for(const[dx,dy]of[[r,0],[0,r],[-r,0],[0,-r],[r,r],[-r,-r]])if(q.x+dx>1&&q.y+dy>1&&q.x+dx<n-1&&q.y+dy<n-1&&!blocked(b,q.x+dx,q.y+dy,u))return{x:q.x+dx,y:q.y+dy};
  return{x:u.x,y:u.y};
 };
 let retreating=0,engaged=0,flanking=0;
 for(const [index,u] of enemies.entries()){
  u.guard??={x:u.x,y:u.y};u.aiTarget=null;
  const local=players.filter(p=>distance(u,p)<15&&canHit(u,p,b.elapsed));
  const nearestDefense=[...defenses].sort((a,c)=>distance(u,center(a))-distance(u,center(c)))[0];
  const anchor=nearestDefense&&distance(u,center(nearestDefense))<20?center(nearestDefense):u.guard;
  const allies=enemies.filter(e=>distance(u,e)<10),own=allies.reduce((n,e)=>n+strength(e),0),opposition=local.reduce((n,e)=>n+strength(e),0);
  if(local.length&&(u.hp/u.maxHp<.28||opposition>own*1.7)){
   const threat=[...local].sort((a,c)=>distance(u,a)-distance(u,c))[0],d=Math.max(.1,distance(u,threat)),safe=nearestDefense&&distance(u,center(nearestDefense))<20?{x:anchor.x+1.8,y:anchor.y+1.8}:{x:u.x+(u.x-threat.x)/d*4,y:u.y+(u.y-threat.y)/d*4};
   const p=safePoint(u,safe);u.order={kind:'move',...p};u.aiMode='retreat';retreating++;continue;
  }
  if(!local.length){
   if(b.kind==='raid'){
    const target=b.buildings.filter(v=>v.side==='player'&&v.hp>0).sort((a,c)=>((BUILDINGS[c.type].resource?8:0)+(c.type==='hq'?5:0))-((BUILDINGS[a.type].resource?8:0)+(a.type==='hq'?5:0))||distance(u,center(a))-distance(u,center(c)))[0];
    if(target){u.aiTarget=target.id;u.order={kind:'assault',...center(target)};u.aiMode='raid';continue;}
   }
   const phase=Math.floor(now/9)+index%4,waypoints=[[2,0],[0,2],[-2,0],[0,-2]],d=waypoints[phase%4];
   const p=safePoint(u,{x:u.guard.x+d[0],y:u.guard.y+d[1]});u.order={kind:'move',...p};u.aiMode='patrol';continue;
  }
  const score=p=>{const st=unitStats(p.type,p.level);return(st.heal?30:0)+(st.range>4?12:0)+(1-p.hp/p.maxHp)*18-distance(u,p)*1.4;};
  const target=[...local].sort((a,c)=>score(c)-score(a))[0];u.aiTarget=target.id;
  const st=unitStats(u.type,u.level),enemyCover=b.buildings.some(v=>v.side==='player'&&v.hp>0&&(v.attack??BUILDINGS[v.type].attack)>0&&distance(center(v),target)<8);
  if(index%3===2&&allies.length>=3&&enemyCover&&distance(u,target)>st.range+1){
   const sign=index%2?1:-1,p=safePoint(u,{x:target.x+sign*5,y:target.y-sign*4});
   u.order={kind:'move',...p};u.aiMode='flank';flanking++;
  }else{u.order={kind:'assault',x:target.x,y:target.y};u.aiMode='intercept';engaged++;}
 }
 command.tactic=retreating?'regroup':flanking?'flank':engaged?'focus':'guard';

 // Buildings have a causal role: no command/depot means no supplies; no surviving
 // academy means no reinforcements. Recruitment consumes the unit's real cost.
 const hs=b.homeState;if(!hs||hs.skirmish||!enemies.length||(!enemies.some(u=>!u.roamer)&&!defenses.length)||!core||core.hp<=0)return;
 hs.stock??={gold:0,wood:0,supply:0,metal:0};
 const depots=b.buildings.filter(v=>v.side==='enemy'&&v.hp>0&&v.purpose==='logistics');
 const threatened=players.some(p=>distance(p,center(core))<30);
 if(!threatened||!depots.length)return;
 const damaged=defenses.find(v=>v.hp<v.maxHp&&players.every(p=>distance(p,center(v))>8));
 if(damaged&&hs.stock.metal>=2){damaged.hp=Math.min(damaged.maxHp,damaged.hp+4);hs.stock.metal-=2;}
 if(now<(hs.nextRecruit||45)||(hs.reinforced||0)>=4||enemies.length>=50)return;
 hs.nextRecruit=now+45;
 const capacity=6+b.buildings.filter(v=>v.side==='enemy'&&v.hp>0&&v.sourceId===183).length*6,used=enemies.filter(u=>!u.roamer).reduce((n,u)=>n+UNITS[u.type].pop,0);
 let academy,spec;for(const candidate of b.buildings.filter(v=>v.side==='enemy'&&v.hp>0&&factories.has(v.type))){
  spec=Object.values(UNITS).find(u=>u.factory===candidate.type&&u.recruitable!==false&&!u.waterborne&&!u.heal&&Object.values(u.cost).some(v=>v>0)&&used+u.pop<=capacity&&Object.entries(u.cost).every(([k,v])=>(hs.stock[k]||0)>=v));
  if(spec){academy=candidate;break;}
 }if(!academy)return;
 const unit=makeUnit({serial:1,research:{}},spec.id,Math.min(5,1+Math.floor((hs.wave-1)/3))),origin=center(academy);Object.assign(unit,origin);const p=safePoint(unit,origin);
 if(!spec.flying&&blocked(b,p.x,p.y,unit))return;
 for(const[k,v]of Object.entries(spec.cost))hs.stock[k]-=v;
 hs.reinforced++;Object.assign(unit,{id:'hmu-r'+hs.reinforced,side:'enemy',...p,guard:{...p},order:{kind:'hold',...p},damageScale:enemies[0].damageScale||1});b.units.push(unit);
}

export function patrolHomeland(s,dt,{move,blocked}){
 const h=s.homeland;if(!h)return;
 for(const [i,u]of [...h.units,...(h.roamers||[])].entries()){
  if(u.hp<=0)continue;u.guard??={x:u.x,y:u.y};
  if(!u.patrolNext||s.time>=u.patrolNext){
   const phase=(Math.floor(s.time/9)+i)%4,[dx,dy]=[[2,0],[0,2],[-2,0],[0,-2]][phase],p={x:u.guard.x+dx,y:u.guard.y+dy};
   u.order=blocked(p.x,p.y,u)?{kind:'hold',x:u.x,y:u.y}:{kind:'move',...p};u.patrolNext=s.time+9;
  }
  u.moving=u.order?.kind==='move'&&move(u,u.order,UNITS[u.type].speed*.55,dt);
 }
}

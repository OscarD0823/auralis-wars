import test from'node:test';import assert from'node:assert/strict';
import * as E from'../dist/engine.js';import{HOME_MAP_DATA}from'../dist/home-map-data.js';import{SOURCE_MAP}from'../dist/catalog.js';import{commandEnemies}from'../dist/enemy-ai.js';
const NOW=2000000000000,delay=E.HOME_RESPAWN_MS;
function fresh(){const s=E.createIslandState(341);s.nextRaid=1e12;return s;}
function rescue(s,now=NOW){
 assert.ok(E.startHomeland(s).ok);for(const u of s.battle.units)if(u.side==='enemy')u.hp=0;for(const b of s.battle.buildings)if(b.side==='enemy')b.hp=0;
 const soldier=s.battle.units.find(u=>u.side==='player'),key=s.battle.buildings.find(b=>b.tag==='key'),prison=s.battle.buildings.find(b=>b.tag==='prison');
 Object.assign(soldier,{x:key.x,y:key.y});assert.ok(E.interactHomeland(s,key.id,now).ok);Object.assign(soldier,{x:prison.x,y:prison.y});assert.ok(E.interactHomeland(s,prison.id,now).ok);
 assert.equal(s.battle,null);return s;
}
test('El rescate requiere guardias, llave y proximidad; matar enemigos no sustituye liberar cautivos',()=>{
 const s=fresh();E.startHomeland(s);const b=s.battle,u=b.units.find(v=>v.side==='player'),key=b.buildings.find(v=>v.tag==='key'),prison=b.buildings.find(v=>v.tag==='prison');
 Object.assign(u,{x:key.x,y:key.y});assert.equal(E.interactHomeland(s,key.id).ok,false);
 for(const enemy of b.units)if(enemy.side==='enemy')enemy.hp=0;for(const target of b.buildings)if(target.side==='enemy')target.hp=0;
 E.step(s,.1);assert.equal(s.battle,b);Object.assign(u,{x:prison.x,y:prison.y});assert.equal(E.interactHomeland(s,prison.id).ok,false);
 Object.assign(u,{x:key.x,y:key.y});assert.ok(E.interactHomeland(s,key.id).ok);assert.equal(E.interactHomeland(s,key.id).ok,false);assert.equal(E.interactHomeland(s,prison.id).ok,false);
 Object.assign(u,{x:prison.x,y:prison.y});assert.ok(E.interactHomeland(s,prison.id,NOW).ok);assert.equal(s.homeland.nextAt,NOW+delay);assert.equal(s.homeland.rescuedTotal,4);
});
test('El plazo dura tres horas reales en todas las dificultades, sin generar ataques ausentes',()=>{
 for(const difficulty of['easy','hard','simulation']){const s=fresh();s.difficulty=difficulty;rescue(s);assert.equal(E.homeCountdown(s,NOW),10800);assert.equal(E.tickHomeland(s,NOW+delay-1),false);assert.equal(E.tickHomeland(s,NOW+delay),true);assert.equal(s.homeland.wave,2);assert.equal(s.homeland.layout,2);assert.equal(s.homeland.units.length,15);assert.equal(s.homeland.buildings.length,176);assert.equal(s.battle,null);assert.equal(s.homeland.nextAt,0);assert.ok(E.decode(E.encode(s),NOW+delay,false));}
});
test('Cerrar el juego no reinicia ni pausa el reloj del asentamiento',()=>{
 const s=rescue(fresh()),raw=E.encode(s,NOW),before=E.decode(raw,NOW+delay-1000,false);assert.equal(before.homeland.wave,1);assert.equal(before.homeland.nextAt,NOW+delay);
 const after=E.decode(raw,NOW+delay+1,true);assert.equal(after.homeland.wave,2);assert.equal(after.battle,null);assert.deepEqual(after.army.map(u=>u.id),s.army.map(u=>u.id));
});
test('La aparición se aplaza durante otra operación y respeta las construcciones existentes',()=>{
 const s=rescue(fresh());assert.ok(E.startAttack(s,0).ok);assert.equal(E.tickHomeland(s,NOW+delay),false);assert.equal(s.homeland.wave,1);E.finishBattle(s);
 const additions=[];for(const c of HOME_MAP_DATA.chapters){const o=c.objects.find(o=>SOURCE_MAP[o.id]?.role==='building'),r=SOURCE_MAP[o.id],b={id:'reserved'+c.number,type:'house',x:o.x-r.width+1,y:o.y-r.height+1,level:1,hp:100,stored:0};additions.push(b);s.buildings.push(b);}
 const inventory={...s.resources};assert.equal(E.tickHomeland(s,NOW+delay+1),false);assert.equal(s.homeland.noSpace,true);assert.deepEqual(s.resources,inventory);for(const b of additions)assert.ok(s.buildings.includes(b));
 s.buildings=s.buildings.filter(b=>!additions.includes(b));assert.equal(E.tickHomeland(s,NOW+delay+11000),true);
});
test('Los cuatro soldados reales esperan alojamiento y sólo se entregan una vez',()=>{
 const s=fresh();for(const b of s.buildings)if(b.type==='house')b.hp=0;while(E.population(s)<E.populationCap(s))s.army.push(E.makeUnit(s,'rifle'));
 const initial=s.army.length;rescue(s);assert.equal(s.homeland.pendingSoldiers,4);assert.equal(s.army.length,initial);assert.equal(E.claimRescued(s).ok,false);
 for(const b of s.buildings)if(b.type==='house')b.hp=E.buildingStats('house',1).hp;assert.ok(E.claimRescued(s).ok);assert.equal(s.homeland.pendingSoldiers,0);assert.equal(s.army.length,initial+4);assert.equal(E.claimRescued(s).ok,false);assert.equal(s.army.filter(u=>u.type===SOURCE_MAP[1059].type).length,4);
});
test('Una victoria posterior exige el mando, recompensa una sola vez y reinicia el intervalo',()=>{
 const s=rescue(fresh());E.tickHomeland(s,NOW+delay);assert.ok(E.startHomeland(s).ok);const b=s.battle;for(const u of b.units)if(u.side==='enemy')u.hp=0;for(const o of b.buildings)if(o.side==='enemy'&&o.attack>0)o.hp=0;
 E.step(s,.1);assert.equal(s.battle,b);const core=b.buildings.find(o=>o.id===b.homeState.commandId),u=b.units.find(u=>u.side==='player');Object.assign(u,{x:core.x,y:core.y});assert.ok(E.interactHomeland(s,core.id,NOW+delay+500).ok);assert.equal(s.homeland.nextAt,NOW+delay*2+500);assert.equal(s.stats.wins,2);assert.equal(E.startHomeland(s).ok,false);assert.equal(s.homeland.rescuedTotal,4);
});
test('Las partidas 0.7.1 completadas migran sin repetir su recompensa ni perder el rescate',()=>{
 const s=fresh(),h=s.homeland;for(const k of['wave','layout','keyTaken','rescued','nextAt','pendingSoldiers','rescuedTotal','history','stock','commandId'])delete h[k];h.version=1;h.completed=true;h.rewarded=true;for(const u of h.units)u.hp=0;for(const b of h.buildings)if(b.side==='enemy')b.hp=0;
 const resources={...s.resources},m=E.decode(E.encode(s),NOW,false);assert.equal(m.homeland.version,2);assert.equal(m.homeland.pendingSoldiers,4);assert.equal(m.homeland.nextAt,NOW+delay);assert.deepEqual(m.resources,resources);
});
test('Los guardias recorren el mapa sin una batalla activa',()=>{
 const s=fresh(),before=s.homeland.units.map(u=>({x:u.x,y:u.y}));for(let i=0;i<18;i++)E.step(s,1);assert.equal(s.battle,null);assert.ok(s.homeland.units.some((u,i)=>Math.hypot(u.x-before[i].x,u.y-before[i].y)>.3));
});
const api={blocked:()=>false,canHit:()=>true,makeUnit:E.makeUnit};
test('La IA concentra fuego sobre apoyo, se repliega herida y conserva misiones guionizadas',()=>{
 const s=fresh();E.startHomeland(s);const b=s.battle,enemy=b.units.find(u=>u.side==='enemy');for(const u of b.units)Object.assign(u,{x:u.side==='enemy'?50:90,y:50});
 enemy.x=50;enemy.y=50;const targets=b.units.filter(u=>u.side==='player');for(const [i,u]of targets.entries())Object.assign(u,{x:52,y:50,hp:i<2?u.maxHp:0});targets[0].type='medic';targets[0].hp=E.unitStats('medic',1).hp;targets[0].maxHp=targets[0].hp;
 commandEnemies(s,b,api,0);assert.equal(enemy.aiTarget,targets[0].id);assert.equal(enemy.aiMode,'intercept');enemy.hp=1;commandEnemies(s,b,api,2);assert.equal(enemy.aiMode,'retreat');assert.ok(enemy.order.x<enemy.x);
 const mission={kind:'mission',elapsed:0,units:[],buildings:[]};commandEnemies(s,mission,api);assert.equal(mission.command,undefined);
});
test('La logística, las academias, el alojamiento y los recursos limitan refuerzos reales',()=>{
 for(const disabled of['none','logistics','barracks','housing','stock']){
  const s=fresh();E.startHomeland(s);const b=s.battle,hs=b.homeState,core=b.buildings.find(o=>o.id===hs.commandId);hs.stock={gold:10000,wood:10000,supply:10000,metal:10000};
  for(const u of b.units)if(u.side==='player')Object.assign(u,{x:core.x-12,y:core.y});
  if(disabled==='logistics'||disabled==='barracks')for(const o of b.buildings)if(o.purpose===disabled)o.hp=0;
  if(disabled==='housing')for(const o of b.buildings)if(o.sourceId===183)o.hp=0;
  if(disabled==='stock')hs.stock={gold:0,wood:0,supply:0,metal:0};
  const count=b.units.length,stock={...hs.stock};commandEnemies(s,b,api,46);
  if(disabled==='none'){assert.equal(b.units.length,count+1);assert.equal(hs.reinforced,1);assert.ok(Object.keys(stock).some(k=>hs.stock[k]<stock[k]));E.finishBattle(s);assert.ok(E.decode(E.encode(s),Date.now(),false));E.startHomeland(s);assert.equal(s.battle.homeState.reinforced,1);}
  else assert.equal(b.units.length,count,disabled);
 }
});
test('La validación detecta plazos y reservas dañados',()=>{
 for(const mutate of[s=>s.homeland.nextAt=-1,s=>s.homeland.stock.metal=Infinity,s=>s.homeland.pendingSoldiers=999,s=>s.homeland.layout=888]){const s=fresh();mutate(s);assert.throws(()=>E.decode(E.encode(s),NOW,false));}
});
test('Las patrullas de mapa aparecen en dos grupos legales y no se confunden con los guardias del rescate',()=>{
 const a=fresh(),b=fresh();assert.equal(E.homeRoamers(a).length,10);assert.deepEqual(a.homeland.roamers,b.homeland.roamers);assert.equal(new Set(a.homeland.roamers.map(u=>u.group)).size,2);
 for(const u of a.homeland.roamers){assert.equal(E.owns(a,u.x,u.y),false);assert.equal(E.groundAt(a,u.x,u.y),'grass');assert.equal(u.roamer,true);}
 E.startHomeland(a);for(const u of a.battle.units)if(u.side==='enemy'&&!u.roamer)u.hp=0;for(const o of a.battle.buildings)if(o.side==='enemy'&&o.attack>0)o.hp=0;
 assert.equal(E.homeCombatClear(a.battle),true);assert.ok(a.battle.units.some(u=>u.roamer&&u.hp>0));
});
test('Los patrulleros se pueden combatir durante la espera sin reiniciar sus tres horas ni duplicar el rescate',()=>{
 const s=fresh();E.startHomeland(s);for(const u of s.battle.units)if(u.side==='enemy'&&!u.roamer)u.hp=0;for(const b of s.battle.buildings)if(b.side==='enemy')b.hp=0;
 const key=s.battle.buildings.find(b=>b.tag==='key'),prison=s.battle.buildings.find(b=>b.tag==='prison'),own=s.battle.units.find(u=>u.side==='player');Object.assign(own,{x:key.x,y:key.y});E.interactHomeland(s,key.id,NOW);Object.assign(own,{x:prison.x,y:prison.y});E.interactHomeland(s,prison.id,NOW);
 assert.equal(E.homeRoamers(s).length,10);const deadline=s.homeland.nextAt;assert.ok(E.startHomeland(s).ok);assert.equal(s.battle.homeState.skirmish,true);
 for(const u of s.battle.units)if(u.side==='enemy')u.hp=0;E.step(s,.1);assert.equal(s.battle,null);assert.equal(s.homeland.nextAt,deadline);assert.equal(s.homeland.rescuedTotal,4);assert.equal(E.homeRoamers(s).length,0);assert.equal(E.startHomeland(s).ok,false);assert.ok(E.decode(E.encode(s),NOW,false));
});
test('Una escuadra con superioridad busca un flanco frente a una posición cubierta',()=>{
 const s=fresh(),enemy=[1,2,3].map(i=>({...E.makeUnit({serial:i,research:{}},'tank',1),side:'enemy',x:10,y:10})),player={...E.makeUnit({serial:10,research:{}},'rifle'),side:'player',x:20,y:10};
 const b={kind:'expedition',world:s.world,elapsed:0,units:[...enemy,player],buildings:[{id:'cover',type:'tower',x:19,y:10,hp:500,attack:10,side:'player'}]};commandEnemies(s,b,api,0);
 assert.equal(enemy[2].aiMode,'flank');assert.equal(enemy[2].order.kind,'move');assert.notDeepEqual({x:enemy[2].order.x,y:enemy[2].order.y},{x:player.x,y:player.y});assert.equal(b.command.tactic,'flank');
});
test('Una batalla de 0.7.1 mantiene sus tropas y adquiere objetivos y logística al actualizar',()=>{
 const s=fresh();E.startHomeland(s);s.battle.units=s.battle.units.filter(u=>!u.roamer);delete s.battle.homeState;const count=s.battle.units.length,h=s.homeland;
 for(const k of['wave','layout','keyTaken','rescued','nextAt','pendingSoldiers','rescuedTotal','history','stock','commandId','roamers'])delete h[k];h.version=1;
 const migrated=E.decode(E.encode(s),NOW,false);assert.equal(migrated.battle.units.length,count);assert.equal(migrated.battle.homeState.wave,1);assert.ok(migrated.battle.homeState.commandId);assert.equal(migrated.battle.homeState.stock.metal,400);assert.ok(E.decode(E.encode(migrated),NOW,false));
});
test('Destruir una construcción del escenario abre su terreno también al regresar a casa',()=>{
 const s=fresh(),wall=s.homeland.buildings.find(b=>b.purpose==='wall'),resources={...s.resources};E.startHomeland(s);s.battle.buildings.find(b=>b.id===wall.id).hp=0;E.finishBattle(s);
 assert.equal(E.groundAt(s,wall.x,wall.y),'grass');assert.ok(s.cleared.includes(wall.x+':'+wall.y));assert.deepEqual(s.resources,resources);assert.ok(E.decode(E.encode(s),Date.now(),false));
});

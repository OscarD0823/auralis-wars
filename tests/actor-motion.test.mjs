import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {ActorMotion,facingView,actorShot,animationPose,SHOT_DURATION,shotRecoil} from '../dist/actor-motion.js';
import * as E from '../dist/engine.js';

test('Ocho rumbos isométricos muestran frente, espalda y perfiles correctos',()=>{
 for(const [facing,direction,mirror]of [[Math.PI*3/4,2,false],[Math.PI/2,3,false],[Math.PI/4,4,false],[0,3,true],[-Math.PI/4,2,true],[-Math.PI/2,1,true],[-Math.PI*3/4,0,false],[Math.PI,1,false]]){
  // World +X/+Y project diagonally; their sum points straight down the screen.
  const view=facingView(facing);assert.equal(view.direction,direction,String(facing));assert.equal(view.mirror,mirror,String(facing));
 }
});
test('Los pasos siguen la distancia, se detienen al bloquearse y no comparten reloj global',()=>{
 const tracker=new ActorMotion(),a={id:'u1',x:0,y:0,facing:0,moving:true};tracker.sample(a,0);
 a.x=.2;const step=tracker.sample(a,.1);assert.ok(step.moving);assert.equal(step.facing,Math.PI/2);
 const stop=tracker.sample(a,.2);assert.equal(stop.moving,false);assert.equal(stop.gait,step.gait);
 a.x=.4;const next=tracker.sample(a,.4);assert.ok(Math.abs(next.gait-step.gait-.2/1.1)<1e-6);
 a.x=50;assert.equal(tracker.sample(a,.5).moving,false,'Teleport is not a long footstep');
 tracker.retain([]);assert.equal(tracker.samples.size,0);
});
test('Cada disparo produce una sola pose; la recarga, el movimiento y los muertos no disparan',()=>{
 const u={id:'u1',hp:100,cooldown:10},b={elapsed:1,effects:[]};assert.equal(actorShot(b,u),null);
 b.effects.push({actorId:'u2',at:1});assert.equal(actorShot(b,u),null);
 b.effects.push({actorId:'u1',at:1});assert.equal(actorShot(b,u).progress,0);
 b.elapsed=1+SHOT_DURATION+.01;assert.equal(actorShot(b,u),null);
 b.elapsed=1.1;u.moving=true;assert.equal(actorShot(b,u),null);u.moving=false;u.hp=0;assert.equal(actorShot(b,u),null);
 assert.equal(shotRecoil(1),0);assert.ok(shotRecoil(.07)>0);
 const spec={states:{idle:[[0]],walk:[[1,2]],attack:[[3,4,5]]}};
 assert.equal(animationPose(spec,{attack:true,shot:{progress:.05},time:999}).n,3);
 assert.equal(animationPose(spec,{attack:true,shot:{progress:.9},time:0}).n,5);
});
function duel(player='rifle',enemy='rifle'){
 const s=E.createState(341),unit=(id,type,side,x,y)=>({...E.makeUnit(s,type),id,side,x,y,hp:1000,maxHp:1000,order:{kind:'hold',x,y},facing:0});
 s.battle={kind:'network',seed:341,elapsed:0,limit:999,buildings:[],units:[unit('u900',player,'player',14.5,15.5),unit('u901',enemy,'enemy',16.5,15.5)],reserve:[],effects:[],serial:1};return s;
}
test('El motor apunta al enemigo y vincula el fogonazo al soldado que realmente hizo daño',()=>{
 const s=duel(),[a,b]=s.battle.units;E.tickBattle(s,.01);
 assert.equal(a.facing,Math.PI/2);assert.ok(b.hp<1000);
 const shot=s.battle.effects.find(e=>e.actorId===a.id);assert.ok(shot);assert.equal(shot.tx,b.x);assert.equal(shot.ty,b.y);assert.equal(shot.kind,'shot');
 const count=s.battle.serial;E.tickBattle(s,.1);assert.equal(s.battle.serial,count,'Reload must not generate another shot');
});
test('Una orden de desplazamiento no combina un paso lateral con un disparo',()=>{
 const s=duel(),[a]=s.battle.units;a.order={kind:'move',x:14.5,y:20.5};E.tickBattle(s,.05);
 assert.ok(a.moving);assert.ok(!s.battle.effects.some(e=>e.actorId===a.id));assert.ok(Math.abs(a.facing)<.01);
});
test('El médico mira al paciente y emite un pulso de cura, con su recarga real',()=>{
 const s=duel('medic'),[medic,patient]=s.battle.units;patient.side='player';patient.hp=400;
 E.tickBattle(s,.01);assert.ok(patient.hp>400);assert.equal(medic.facing,Math.PI/2);assert.equal(s.battle.effects.find(e=>e.actorId===medic.id)?.kind,'heal');
});
test('Una batalla guardada conserva tiros nuevos y acepta efectos antiguos sin emisor',()=>{
 const s=E.createState(341);E.startAttack(s,0);E.deployAll(s);
 for(let i=0;i<100;i++)E.tickBattle(s,.05);
 assert.ok(s.battle.effects.some(e=>e.actorId));
 const copy=E.decode(E.encode(s,100000),100000,false);assert.deepEqual(copy.battle.effects,s.battle.effects);
 const old=structuredClone(s);for(const e of old.battle.effects){delete e.actorId;delete e.sourceType;delete e.kind;}
 assert.doesNotThrow(()=>E.decode(E.encode(old,100000),100000,false));
});
test('Los nuevos atlas contienen 60 recortes transparentes y cinco vistas por cada función',()=>{
 const data=JSON.parse(fs.readFileSync(new URL('../dist/auralis/races/directional.json',import.meta.url)));
 let memory=0;
 for(const race of ['aurora','kharun','nebari','arca']){
  const m=data[race],png=fs.readFileSync(new URL('../dist/auralis/races/'+race+'-directional.png',import.meta.url));
  assert.equal(png.readUInt32BE(16),m.width);assert.equal(png.readUInt32BE(20),m.height);assert.equal(png[25],6);memory+=m.width*m.height*4;
  assert.equal(m.frames.length,60);assert.equal(m.families.length,4);
  for(const [i,[x,y,w,h]]of m.frames.entries()){assert.ok(x>=0&&y>=0&&w>25&&h>40&&x+w<=m.width&&y+h<=m.height);assert.ok(m.anchors[i][0]>=0&&m.anchors[i][0]<=w);}
  for(const role of m.families){assert.equal(role.directions.length,5);assert.ok(role.directions.every(seq=>seq.length===3&&seq.every(i=>i>=0&&i<60)));}
 }
 assert.ok(memory<26*1024*1024);
 const sw=fs.readFileSync(new URL('../dist/sw.js',import.meta.url),'utf8'),core=JSON.parse(sw.match(/CORE=(\[.*?\]);/)[1]);
 assert.ok(core.includes('./auralis/races/directional.json'));
 assert.ok(!core.some(f=>f.endsWith('-directional.png')),'Directional images load only for visible races');
});

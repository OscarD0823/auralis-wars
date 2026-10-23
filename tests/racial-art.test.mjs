import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {RACES,UNITS,BUILDINGS,createIslandState,chooseRace,encode,decode,groundAt} from '../dist/engine.js';
import {visualRace,ownActorFamily,ownActorScale,ownFamily,ACTOR_SEQUENCES,raceId} from '../dist/own-art.js';
import {createAdvancedBase} from '../dist/showcase.js';
import {diplomacyPanel} from '../dist/diplomacy-ui.js';
const atlas=JSON.parse(fs.readFileSync(new URL('../dist/auralis/races/atlas.json',import.meta.url)));
const source=file=>fs.readFileSync(new URL('../dist/'+file,import.meta.url),'utf8');
test('La identidad visual respeta al propietario y al clan, incluso en asentamientos capturados',()=>{
 const s={civilization:{race:'nebari'}};
 assert.equal(visualRace(s), 'nebari');
 assert.equal(visualRace(s,{side:'player'}),'nebari');
 assert.equal(visualRace(s,{side:'enemy'}),'aurora');
 assert.equal(visualRace(s,{side:'enemy',faction:'ceniza'}),'kharun');
 assert.equal(visualRace(s,{side:'player',faction:'prisma'}),'arca');
 assert.equal(visualRace({},{}),'aurora');
 assert.equal(raceId('invalid'),'aurora');
});
test('Todo el ejército Auralis y sus obreros tienen familia gráfica; los especialistas conservan su función',()=>{
 assert.equal(ownActorFamily('settler'),0);
 for(const u of Object.values(UNITS).filter(u=>!u.archive))assert.ok(Number.isInteger(ownActorFamily(u.id)),u.id);
 for(const t of ['medic','engineer'])assert.equal(ownActorFamily(t),3);
 assert.equal(ownActorFamily('exosoldier'),2);
 assert.equal(ownActorFamily('tank'),5);
 assert.equal(ownActorFamily('artillery'),6);
 assert.equal(ownActorFamily('bomber'),8);
 assert.equal(ownActorFamily('frigate'),9);
 const archived=Object.values(UNITS).find(u=>u.archive);assert.equal(ownActorFamily(archived.id),null);
 assert.equal(ownFamily('armor'),8);
 assert.ok(ownActorScale('settler')<ownActorScale('tank'));
 assert.ok(ownActorScale('exosoldier')<ownActorScale('titan'));
 assert.ok(ownActorScale('zodiac')<ownActorScale('frigate'));
});
test('Cuatro atlas transparentes tienen 30 recortes válidos y anclas dentro de cada pose',()=>{
 let memory=0;
 for(const race of Object.keys(RACES)){
  const data=atlas[race];assert.ok(data,race);
  for(const[kind,m]of Object.entries(data)){
   const file=new URL('../dist/auralis/races/'+race+'-'+kind+'.png',import.meta.url),png=fs.readFileSync(file);
   assert.equal(png.readUInt32BE(16),m.width);assert.equal(png.readUInt32BE(20),m.height);
   assert.equal(png[25],6,'RGBA source required');memory+=m.width*m.height*4;
   assert.equal(m.frames.length,kind==='actors'?30:16);
   for(const[i,[x,y,w,h]]of m.frames.entries()){
    assert.ok(x>=0&&y>=0&&w>0&&h>0&&x+w<=m.width&&y+h<=m.height, race+':'+kind+':'+i);
    if(kind==='actors'){const[a,b]=m.anchors[i];assert.ok(a>=0&&a<=w&&b>0&&b<=h);}
   }
   if(kind==='actors')assert.ok(m.scales.slice(0,4).every(n=>n>60&&n<220));
  }
 }
 assert.ok(memory<50*1024*1024,'All racial sheets must fit within the 96 MiB renderer budget');
 assert.notDeepEqual(atlas.kharun.buildings.frames,atlas.nebari.buildings.frames);
});
test('Caminar, extraer y atacar usan poses diferentes; la carga no desaparece entre pasos',()=>{
 assert.ok(new Set(ACTOR_SEQUENCES.walk).size>=3);
 assert.ok(new Set(ACTOR_SEQUENCES.gather).size>=2);
 assert.ok(ACTOR_SEQUENCES.attack.includes(4));
 assert.deepEqual(ACTOR_SEQUENCES.carry,[5]);
 for(const seq of Object.values(ACTOR_SEQUENCES))assert.ok(seq.every(n=>n>=0&&n<6));
});
test('Las cuatro demostraciones tienen su raza, tropas separadas y barcos en el mar',()=>{
 for(const race of Object.keys(RACES)){
  const s=createAdvancedBase(race);assert.equal(s.civilization.race,race);
  for(const u of s.army){
   assert.ok(!s.buildings.some(b=>u.x>=b.x&&u.x<b.x+BUILDINGS[b.type].size&&u.y>=b.y&&u.y<b.y+BUILDINGS[b.type].size),u.type);
   assert.equal(groundAt(s,Math.floor(u.x),Math.floor(u.y)),UNITS[u.type].waterborne?'water':'grass');
   assert.equal(visualRace(s,u),race);
  }
  for(let i=0;i<s.army.length;i++)for(let j=0;j<i;j++)assert.ok(Math.hypot(s.army[i].x-s.army[j].x,s.army[i].y-s.army[j].y)>=2.1);
 }
});
test('La elección cambia la apariencia de una partida existente sin alterar sus bienes o estadísticas',()=>{
 const s=createIslandState(514),before=structuredClone({buildings:s.buildings,army:s.army,resources:s.resources});
 assert.ok(chooseRace(s,'arca').ok);assert.deepEqual({buildings:s.buildings,army:s.army,resources:s.resources},before);
 const loaded=decode(encode(s,100000),100000,false);assert.equal(visualRace(loaded,loaded.army[0]),'arca');
});
test('El selector ofrece cuatro vistas de prueba antes de la elección permanente',()=>{
 const calls=[],html=diplomacyPanel(createIslandState(341),{head:(_,t)=>t,esc:String,cost:JSON.stringify,clock:String,img:(type,level,unit,cls,race)=>{calls.push([type,race]);return '<img alt="prueba">';}});
 assert.equal((html.match(/data-action="race-preview"/g)||[]).length,4);
 for(const race of Object.keys(RACES))for(const type of['hq','settler','rifle','tank'])assert.ok(calls.some(([t,r])=>t===type&&r===race));
 assert.match(html,/base de prueba antes de decidir/);
 const sw=source('sw.js'),core=JSON.parse(sw.match(/CORE=(\[.*?\]);/)[1]);
 assert.ok(!core.some(f=>/auralis\/races\/.*\.png$/.test(f)),'Racial PNGs load on demand, not at service-worker install');
 assert.ok(sw.includes('./auralis/races/arca-actors.png'));
});

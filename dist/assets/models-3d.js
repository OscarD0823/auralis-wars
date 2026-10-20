import {physicalSurfaces} from './physical-surfaces.js';
import {animateImported} from './textured-actors.js';
import {characterShapes,animateCharacter} from './characters.js';
import {sculptedRoof,organicGeometry,pineGeometry,torsoGeometry,hullGeometry,surfaceNormal,clothRoof,cropGeometry,shoreGeometry} from './sculpted-geometry.js';
import {sculptUnit} from './sculpted-style.js';
import {hipRoof,softBlock,painterTexture,contactMaterial,decorateBuilding,decorateUnit} from './visual-style.js';
import {applyBuildingLevel} from './building-levels.js';
// Original, articulated geometry. No character or building in the world is a billboard.
import * as T from './vendor/three.module.js';
const P=Math.PI;
export const shapes={hiproof:hipRoof(),block:softBlock(),box:new T.BoxGeometry(1,1,1),ball:new T.IcosahedronGeometry(1,2),rock:new T.IcosahedronGeometry(1,0),cylinder:new T.CylinderGeometry(1,1,1,12),cone:new T.ConeGeometry(1,1,10),ring:new T.TorusGeometry(1,.12,5,20),limb:new T.CapsuleGeometry(.5,1,3,7)};
const roofShape=new T.Shape();roofShape.moveTo(-.5,0);roofShape.lineTo(0,.42);roofShape.lineTo(.5,0);roofShape.closePath();
shapes.roof=new T.ExtrudeGeometry(roofShape,{depth:1,bevelEnabled:true,bevelSize:.018,bevelThickness:.018,bevelSegments:1,curveSegments:1});shapes.roof.translate(0,0,-.5);shapes.roof.computeVertexNormals();
Object.assign(shapes,characterShapes());shapes.crystal=new T.OctahedronGeometry(1,0);shapes.shore=shoreGeometry();shapes.tent=clothRoof();shapes.crop=cropGeometry();shapes.hiproof=sculptedRoof(true);shapes.roof=sculptedRoof(false);shapes.crown=organicGeometry();shapes.boulder=organicGeometry('rock');shapes.pinetree=pineGeometry();shapes.torso=torsoGeometry();shapes.head=new T.SphereGeometry(1,16,12);shapes.sandbag=new T.SphereGeometry(1,12,8);shapes.hull=hullGeometry();shapes.chassis=softBlock();{const p=shapes.chassis.attributes.position;for(let i=0;i<p.count;i++)if(p.getY(i)>0){p.setX(i,p.getX(i)*.84);p.setZ(i,p.getZ(i)*.88);}shapes.chassis.computeVertexNormals();}shapes.dish=new T.SphereGeometry(1,14,8,0,Math.PI*2,0,Math.PI*.48);for(const[name,g]of Object.entries(shapes)){g.userData.shape=name;if(!g.attributes.color){const a=new Float32Array(g.attributes.position.count*3);a.fill(1);g.setAttribute('color',new T.BufferAttribute(a,3));}}
shapes.ground=new T.PlaneGeometry(1,1);shapes.ground.rotateX(-P/2);
export function materials(){const normals=new Map(),normal=kind=>{if(!normals.has(kind))normals.set(kind,surfaceNormal(kind));return normals.get(kind);};const make=(color,kind,extra={})=>new T.MeshStandardMaterial({color:kind?'#ffffff':color,map:kind?painterTexture(color,kind):null,roughness:.86,vertexColors:true,normalMap:kind?normal(kind):null,normalScale:new T.Vector2(kind==='stone'?.24:kind==='roof'?.07:.14,kind==='stone'?.24:kind==='roof'?.07:.14),envMapIntensity:.35,...extra});const all={
 shore:make('#ffffff','earth'),linen:make('#dbd1b2','cloth'),heroBlue:make('#367d89','cloth'),heroGreen:make('#496958','cloth'),heroTrousers:make('#655d4e','cloth'),leather:make('#79583b',null,{roughness:.67}),auburn:make('#754333'),skinShade:make('#a37457'),eyeWhite:make('#efe7d5',null,{roughness:.38}),iris:make('#49656a',null,{roughness:.28}),limestone:make('#b9b39d','stone'),roofridge:make('#647b78','roof'),lantern:make('#ffcf78',null,{emissive:'#ffac47',emissiveIntensity:.8}),army:make('#75825a','army'),canvas:make('#c5aa78','wood'),window:make('#d2ab5c',null,{emissive:'#845123',emissiveIntensity:.12,roughness:.38}),cutwood:make('#c99a62','wood'),rope:make('#b39462'),flower:make('#d8bc6f'),contact:contactMaterial(),smoke:new T.MeshBasicMaterial({color:'#9b9b88',transparent:true,opacity:.19,depthWrite:false}),dust:new T.MeshBasicMaterial({color:'#ccb78c',transparent:true,opacity:.48,depthWrite:false}),fire:new T.MeshBasicMaterial({color:'#ffc774'}),grass:make('#78a455','grass'),earth:make('#9b8058','earth'),sand:make('#c3b387','earth'),stone:make('#a5a38e','stone'),cliff:make('#7d8274','stone'),snow:make('#d5ddd0','grass'),path:make('#b6a07b','earth'),wood:make('#9a683c','wood'),darkwood:make('#554631','wood'),plaster:make('#f1d8a2','plaster'),roof:make('#b45a36','roof'),roofdark:make('#4d6d70','roof'),blue:make('#347f92'),cloth:make('#e3d5ad'),red:make('#a45642'),leaf:make('#39764c'),leaflight:make('#6a9852'),pine:make('#2e6248'),wheat:make('#c6a252'),berry:make('#a45251'),iron:make('#526469',null,{metalness:.55,roughness:.56}),metal:make('#a8b3ac',null,{metalness:.4,roughness:.48}),glass:make('#638e91',null,{metalness:.3,roughness:.22}),glow:make('#75d5c1',null,{emissive:'#318c83',emissiveIntensity:.8}),gold:make('#c4a467',null,{metalness:.5}),skin:make('#c39772'),hair:make('#4a3b2a'),boots:make('#493e32'),water:make('#487c85',null,{metalness:.15,roughness:.23}),foam:make('#b8d0b7'),black:make('#252e28'),fog:new T.MeshBasicMaterial({color:'#23383e'}),memory:make('#53665d'),selection:new T.MeshBasicMaterial({color:'#d4e4a1',transparent:true,opacity:.8,depthWrite:false}),danger:new T.MeshBasicMaterial({color:'#d88763',transparent:true,opacity:.6,depthWrite:false})};for(const[k,m]of Object.entries(all))m.name=k;all.wheat.side=T.DoubleSide;all.heroGreen.side=T.DoubleSide;physicalSurfaces(all);return all;}
export function part(g,shape,mat,x,y,z,sx,sy,sz,rx=0,ry=0,rz=0){const m=new T.Mesh(shapes[shape==='roof'&&['canvas','cloth'].includes(mat.name)?'tent':shape==='box'&&mat.name==='wheat'&&sy>.1?'crop':shape==='box'&&sx>.22&&sy>.18&&sz>.22?'block':shape],mat);m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.rotation.set(rx,ry,rz);m.castShadow=true;m.receiveShadow=true;g.add(m);return m;}
const box=(g,m,x,y,z,a,b,c,rx=0,ry=0,rz=0)=>part(g,'box',m,x,y,z,a,b,c,rx,ry,rz);
const cyl=(g,m,x,y,z,r,h,rz=0)=>part(g,'cylinder',m,x,y,z,r,h,r,0,0,rz);
function beam(g,m,a,b,width=.055){const v=new T.Vector3(...b).sub(new T.Vector3(...a)),o=box(g,m,(a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2,width,v.length(),width);o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),v.normalize());return o;}
function fence(g,M,x,z,w,axis=0){for(let i=0;i<4;i++)box(g,M.wood,x+(axis?0:i*w/3),.25,z+(axis?i*w/3:0),.055,.5,.055);for(const y of[.18,.37])box(g,M.wood,x+(axis?0:w/2),y,z+(axis?w/2:0),axis?.05:w,.04,axis?w:.05);}
function crate(g,M,x,z,scale=.25){box(g,M.wood,x,scale/2,z,scale,scale,scale);box(g,M.darkwood,x,scale*.5,z+scale*.51,scale*.95,.025,.018,0,0,.65);}
function barrel(g,M,x,z){cyl(g,M.wood,x,.17,z,.13,.33);for(const y of[.07,.27])cyl(g,M.iron,x,y,z,.138,.028);}
function flag(g,M,x,y,z,enemy=false){cyl(g,M.wood,x,y/2,z,.025,y);box(g,enemy?M.red:M.blue,x+.2,y-.15,z,.4,.26,.025);}
function home(g,M,{x=0,z=0,w=1.5,d=1.25,h=.85,roof=M.roof,modern=false}){
 box(g,M.stone,x,.13,z,w+.12,.26,d+.12);box(g,modern?M.metal:M.plaster,x,h/2+.23,z,w,h,d);
 if(modern){box(g,M.roofdark,x,h+.3,z,w+.16,.16,d+.16);box(g,M.glass,x,h*.65+.2,z+d*.505,w*.72,.25,.02);}else{part(g,'roof',roof,x,h+.23,z,w+.22,w*.75,d+.24);box(g,M.darkwood,x,h+.22,z+d/2+.01,w,.07,.04);box(g,M.wood,x,h+.24+w*.315,z,.065,.065,d+.3);for(const a of[-1,1]){for(const b of[-1,1])box(g,M.wood,x+a*(w/2-.05),h/2+.23,z+b*d/2,.075,h,.075);beam(g,M.darkwood,[x+a*w/2,h+.23,z+d/2+.13],[x,h+.23+w*.315,z+d/2+.13],.045);}for(const zz of[-1,1])for(const xx of[-1,1])beam(g,M.wood,[x+xx*w*.46,.3,z+zz*d*.505],[x+xx*w*.2,h+.2,z+zz*d*.505],.045);}
 box(g,M.darkwood,x,.51,z+d/2+.015,.27,.55,.035);box(g,M.gold,x+.085,.52,z+d/2+.04,.027,.03,.02);
 for(const a of[-1,1]){box(g,M.darkwood,x+a*w*.31,.76,z+d/2+.02,.23,.27,.045);box(g,M.glass,x+a*w*.31,.76,z+d/2+.048,.15,.19,.02);box(g,M.wood,x+a*w*.31,.75,z+d/2+.065,.02,.21,.02);}
 for(const a of[-1,1]){box(g,M.darkwood,x+w/2+.015,.7,z+a*d*.25,.035,.24,.22);box(g,M.glass,x+w/2+.04,.7,z+a*d*.25,.02,.16,.15);}
}
function turret(g,M,x,z,tall=1.6){cyl(g,M.stone,x,tall/2,z,.37,tall);cyl(g,M.stone,x,tall,z,.45,.18);for(let i=0;i<8;i++){const a=i*P/4;box(g,M.stone,x+Math.cos(a)*.38,tall+.2,z+Math.sin(a)*.38,.15,.28,.15,0,-a);}box(g,M.darkwood,x,tall*.7,z+.37,.09,.28,.02);}
export function buildingModel(type,tier=0,level=1,size=2,M){const g=new T.Group(),modern=tier>=12,future=tier>=23,roof=modern?M.roofdark:M.roof;
 // The foundation sits inside the footprint, with a dirt apron instead of a flat picture edge.
 cyl(g,M.earth,0,-.025,0,size*.5,.045);box(g,M.stone,0,.015,0,size*.78,.055,size*.78);
 if(type==='well'){cyl(g,M.stone,0,.23,0,.33,.44);cyl(g,M.black,0,.459,0,.24,.012);for(const x of[-.35,.35])box(g,M.wood,x,.75,0,.075,1.1,.075);part(g,'roof',roof,0,1.16,0,.95,.65,.85);cyl(g,M.wood,0,.93,0,.055,.75,P/2);beam(g,M.darkwood,[0,.92,0],[0,.46,0],.018);cyl(g,M.iron,.3,.93,0,.1,.04,P/2);}
 else if(type==='farm'||type==='greenhouse'){
  box(g,M.earth,0,.11,0,1.76,.14,1.76);for(let a=0;a<7;a++)for(let b=0;b<6;b++){const x=-.7+a*.23,z=-.65+b*.24;box(g,type==='farm'?M.wheat:M.leaf,x,.25,z,.1,.25+((a*3+b)%4)*.025,.08);}
  fence(g,M,-.87,-.87,1.7);fence(g,M,-.87,-.87,1.7,1);
  if(type==='greenhouse'){for(const x of[-.8,0,.8]){beam(g,M.metal,[x,.12,-.82],[x,1.2,0]);beam(g,M.metal,[x,1.2,0],[x,.12,.82]);}box(g,M.glass,0,1.02,0,1.6,.08,.8);}
  else{cyl(g,M.plaster,-.65,.67,-.63,.23,1.1);part(g,'cone',roof,-.65,1.4,-.63,.33,.4,.33);const rotor=new T.Group();rotor.position.set(-.65,1.05,-.32);for(let i=0;i<4;i++){const a=i*P/2;box(rotor,M.wood,Math.cos(a)*.23,Math.sin(a)*.23,0,.55,.035,.04,0,0,a);box(rotor,M.cloth,Math.cos(a)*.32,Math.sin(a)*.32,0,.29,.12,.025,0,0,a);}g.add(rotor);g.userData.rotor=rotor;}
 }
 else if(type==='cistern'||type==='waterworks'){cyl(g,modern?M.metal:M.stone,-.28,.4,0,.62,.75);cyl(g,M.water,-.28,.79,0,.51,.02);for(let i=0;i<8;i++){const a=i*P/4;box(g,M.stone,-.28+Math.cos(a)*.58,.85,Math.sin(a)*.58,.12,.17,.12,0,-a);}if(type==='waterworks'){cyl(g,M.metal,.62,.7,-.45,.3,1.3);beam(g,M.iron,[-.2,.9,-.4],[.6,1.2,-.4],.12);home(g,M,{x:.47,z:.45,w:.65,d:.7,h:.55,modern:true});}}
 else if(type==='tower'){turret(g,M,0,0,1.9);flag(g,M,.1,2.65,0);if(modern)box(g,M.iron,.05,2.14,.2,.1,.1,.85);}
 else if(type==='mine'){part(g,'rock',M.cliff,0,.32,-.45,.9,.6,.55);box(g,M.black,0,.38,.02,.7,.67,.08);for(const x of[-.43,.43])box(g,M.wood,x,.43,.18,.12,.8,.14);box(g,M.wood,0,.84,.18,1.05,.14,.19);for(const x of[-.23,.23])box(g,M.iron,x,.12,.53,.025,.025,.8);box(g,M.wood,.5,.24,.55,.48,.25,.4);for(const x of[.28,.72])part(g,'cylinder',M.iron,x,.12,.55,.09,.5,.09,P/2);crate(g,M,-.7,.6,.3);part(g,'ring',M.wood,.6,.8,-.45,.29,.29,.29,0,P/2);}
 else if(type==='market'){for(const x of[-.48,.48]){for(const z of[-.52,.52])box(g,M.wood,x,.6,z,.06,1.1,.06);box(g,M.wood,x,.35,0,.69,.5,.9);for(let i=0;i<4;i++)box(g,i%2?M.cloth:M.blue,x-.27+i*.18,1.12,0,.19,.045,1.25,0,0,-.1);for(let i=0;i<3;i++)cyl(g,i%2?M.wheat:M.berry,x-.2+i*.2,.65,.28,.08,.08);}crate(g,M,.6,.8);barrel(g,M,-.7,.7);}
 else if(type==='dock'){for(let i=0;i<13;i++)box(g,M.wood,-.85+i*.14,.22,0,.12,.12,2.05);for(const x of[-.85,.85])for(const z of[-.85,0,.85]){cyl(g,M.darkwood,x,.13,z,.055,.7);cyl(g,M.wood,x,.5,z,.07,.12);}home(g,M,{x:0,z:-.5,w:1.15,d:.8,h:.65,roof,modern});crate(g,M,-.48,.6,.3);barrel(g,M,.5,.6);}
 else if(type==='lab'||type==='fusion'||type==='starforge'){
  box(g,M.roofdark,0,.25,0,size*.8,.4,size*.8);const r=size*.28;part(g,'ball',M.metal,0,.6,0,r,r,r);cyl(g,M.glow,0,.35,0,r*1.08,.12);
  for(let i=0;i<4;i++){const a=i*P/2;box(g,M.metal,Math.cos(a)*r*1.3,.6,Math.sin(a)*r*1.3,.18,1.1,.18,0,-a);box(g,M.glow,Math.cos(a)*r*1.3,1.18,Math.sin(a)*r*1.3,.2,.09,.2);}
  const rotor=new T.Group();rotor.position.y=1.25;part(rotor,'ring',type==='fusion'?M.glow:M.gold,0,0,0,r*1.1,r*1.1,r*1.1,P/2,.2);g.add(rotor);g.userData.rotor=rotor;
  if(type==='starforge'){for(const x of[-.8,.8])box(g,M.iron,x,.45,.9,.3,.7,.7);part(g,'cone',M.glow,0,.95,0,.28,1.3,.28);}
 }
 else if(type==='refinery'||type==='reactor'||type==='garage'||type==='airfield'){
  home(g,M,{w:size*.75,d:size*.65,h:.85,modern:true});
  if(type==='reactor'||type==='refinery'){for(const x of[-.5,.3]){cyl(g,M.stone,x,1.15,-.38,.18,1.6);cyl(g,M.iron,x,1.96,-.38,.2,.12);}for(const z of[.25,.65])cyl(g,M.metal,.65,.55,z,.22,.65);beam(g,M.iron,[-.65,1.05,.6],[.65,1.05,.6],.12);}
  else if(type==='garage'){box(g,M.black,0,.58,.68,1.05,.7,.03);for(const z of[-.6,.5])barrel(g,M,.8,z);}
  else{box(g,M.roofdark,0,.13,1,2.3,.07,.65);for(let i=0;i<5;i++)box(g,M.cloth,-.9+i*.45,.18,1,.22,.012,.03);part(g,'cone',M.red,.98,1.1,-.9,.2,.6,.2,0,0,P/2);cyl(g,M.metal,.7,.65,-.9,.03,1.3);}
 }
 else{
  home(g,M,{w:type==='camp'?1.55:1.35,d:type==='barracks'?1.6:1.15,h:type==='camp'?1.1:.85,roof,modern});
  if(type==='camp'){home(g,M,{x:-.65,z:.35,w:.62,d:.8,h:.62,roof,modern});flag(g,M,.47,2.25,-.1);box(g,M.wood,0,.12,1,.75,.15,.35);}
  else if(type==='barracks'){turret(g,M,-.65,-.63,1.5);flag(g,M,.63,2.12,-.55);for(const x of[-.55,-.3,.0])beam(g,M.iron,[x,.15,.9],[x,.9,.9],.028);box(g,M.wood,-.27,.45,.9,.7,.045,.05);}
  else if(type==='embassy'||type==='school'){for(const x of[-.55,.55])cyl(g,M.plaster,x,.58,.76,.06,1);box(g,roof,0,1.13,.73,1.5,.12,.55);if(type==='school'){box(g,M.cloth,.4,.45,1,.25,.025,.17,.2);box(g,M.wood,.4,.25,1,.35,.4,.25);}else flag(g,M,-.7,1.7,-.7);}
  else if(type==='hospital'){box(g,M.cloth,0,1,.6,.5,.45,.025);box(g,M.red,0,1,.62,.32,.09,.02);box(g,M.red,0,1,.63,.09,.32,.02);}
  else if(type==='depot'){crate(g,M,-.65,.75,.37);crate(g,M,-.3,.8,.28);barrel(g,M,.65,.6);}
  else if(type==='house'){box(g,M.stone,.43,1.25,-.25,.23,.9,.23);barrel(g,M,-.73,.52);}
 }
 if(future&&!['lab','fusion','starforge'].includes(type)){box(g,M.glow,0,.17,size*.43,size*.75,.035,.025);for(const x of[-size*.4,size*.4])box(g,M.metal,x,.35,-size*.4,.12,.6,.12);}
 if(tier===0)g.traverse(o=>{if(o.isMesh){if(o.material===M.plaster)o.material=M.wood;else if(o.material===M.roof)o.material=M.cloth;}});
 else if(tier>=4&&tier<12)g.traverse(o=>{if(o.isMesh){if(o.material===M.roof)o.material=M.roofdark;if(tier<8&&o.material===M.plaster)o.material=M.stone;}});
 if(tier>=8&&tier<12){cyl(g,M.gold,size*.3,1.25,-size*.3,.045,.8);}
 if(tier>=15&&tier<23){box(g,M.glass,0,.6,-size*.38,size*.5,.28,.025);box(g,M.metal,-size*.3,.8,size*.2,.18,.6,.18);}
 if(tier>=30){for(const side of[-1,1])beam(g,M.metal,[side*size*.35,.2,-size*.32],[side*size*.18,2.15,-size*.32],.065);box(g,M.glow,0,2.12,-size*.32,size*.36,.06,.06);}
 decorateBuilding(g,type,tier,level,size,M,part);applyBuildingLevel(g,M,type,tier,level,size,part);
 return g;
}
export function natureModel(kind,seed,M,resource=null,biome=0){const g=new T.Group(),r=((seed*13)%97)/97;
 if(kind==='forest'||resource==='wood'){const pine=biome===2||biome===5;const h=1.8+r*.9;cyl(g,M.wood,0,h*.32,0,.09,h*.65);for(let i=0;i<3;i++){const a=i*2.4;beam(g,M.wood,[0,h*.25,0],[Math.cos(a)*.3,h*.58,Math.sin(a)*.3],.055);}if(pine){part(g,'pinetree',M.pine,0,h*.62,0,.77,h*.67,.77);}else{for(let i=0;i<4;i++){const a=i*2.4;part(g,'crown',i%2?M.leaf:M.leaflight,Math.cos(a)*.35,h*.7+(i%2)*.4,Math.sin(a)*.35,.7,.62,.63);}}}
 else if(resource==='food'){for(let i=0;i<3;i++){const a=i*2.3;part(g,'ball',M.leaf,Math.cos(a)*.17,.28,Math.sin(a)*.17,.28,.3,.28);for(let j=0;j<3;j++)part(g,'ball',M.berry,Math.cos(a+j)*.24,.43+j*.025,Math.sin(a+j)*.23,.055,.055,.055);}}
 else if(resource==='water'){cyl(g,M.stone,0,.04,0,.47,.09);cyl(g,M.water,0,.095,0,.37,.012);for(let i=0;i<4;i++)part(g,'rock',M.cliff,Math.cos(i*1.6)*.4,.1,Math.sin(i*1.6)*.4,.14,.15,.12);}
 else{const huge=kind==='mountain',s=huge?1.3:kind==='cliff'?.7:.4;for(let i=0;i<3;i++)part(g,'boulder',resource==='gold'?M.gold:M.cliff,Math.cos(i*2.3)*s*.3,s*(.3+i*.12),Math.sin(i*2.3)*s*.3,s*(.4+i*.12),s*(.4+i*.19),s*.45,.1,i,0);}
 return g;
}
export function unitModel(type,M,enemy=false,technology=0,species='human'){
 const g=new T.Group(),joints={},naval=['raft','galley','transport','gunboat','leviathan'].includes(type),vehicle=['jeep','bulwark','missile','train'].includes(type),air=['helicopter','wasp','starship','plane'].includes(type),color=enemy?M.red:species==='sylvan'?M.leaf:species==='astral'?M.glow:M.blue;
 if(naval){const metal=['transport','gunboat','leviathan'].includes(type),len=type==='leviathan'?3:2.3;box(g,metal?M.iron:M.darkwood,0,.22,0,.7,.35,len);part(g,'cone',metal?M.iron:M.wood,0,.24,len/2,.44,.7,.44,P/2);box(g,M.wood,0,.43,0,.65,.06,len*.9);if(metal){home(g,M,{z:-.2,w:.45,d:.65,h:.38,modern:true});box(g,color,0,.81,0,.49,.08,.6);box(g,M.iron,0,.7,.65,.12,.12,.7);}else if(type!=='raft'){cyl(g,M.wood,0,1.1,-.05,.032,1.4);box(g,M.cloth,0,1.18,.03,1.1,.85,.035,0,.15);box(g,color,0,1.55,.06,.15,.7,.025);}else for(const x of[-.15,.15])box(g,M.wood,x,.75,0,.035,.6,.035);joints.hull=g;}
 else if(vehicle){box(g,M.iron,0,.35,0,.78,.34,1.3);box(g,color,0,.55,-.1,.7,.28,.7);if(type==='jeep')box(g,M.glass,0,.8,-.05,.58,.3,.4);else{const turret=new T.Group();turret.position.y=.75;box(turret,color,0,0,0,.48,.23,.65);box(turret,M.iron,0,.05,.65,.1,.1,.95);g.add(turret);joints.turret=turret;if(type==='missile')for(const x of[-.17,.17]){cyl(turret,M.cloth,x,.12,.3,.075,.85,P/2);part(turret,'cone',M.red,x,.12,.77,.075,.17,.075,P/2);}}
  joints.wheels=[];for(const x of[-.43,.43])for(const z of[-.45,.45])joints.wheels.push(part(g,'cylinder',M.black,x,.23,z,.22,.15,.22,0,0,P/2));
 }
 else if(air){part(g,'ball',M.iron,0,.2,0,.45,.28,.7);box(g,M.glass,0,.28,.45,.3,.22,.4);if(type==='helicopter'){box(g,color,0,.25,-.9,.13,.12,1);const rotor=new T.Group();rotor.position.y=.68;box(rotor,M.iron,0,0,0,2.4,.025,.09);box(rotor,M.iron,0,.01,0,.09,.025,2.4);g.add(rotor);joints.rotor=rotor;for(const x of[-.4,.4])box(g,M.iron,x,-.23,0,.04,.04,1.2);}else{for(const x of[-.6,.6])box(g,color,x,.2,-.1,1,.09,.65,0,0,x*.16);for(const x of[-.3,.3])part(g,'cone',M.glow,x,.2,-.8,.13,.45,.13,-P/2);}}
 else{
  const cavalry=type==='cavalry',robot=['guardian','mecha'].includes(type),psion=type==='psion',skin=robot?M.metal:species==='stonekin'?M.stone:M.skin,body=technology>=23||robot?M.metal:color;
  const person=new T.Group();g.add(person);joints.body=person;person.position.y=cavalry?.75:0;
  box(person,body,0,.52,0,.25,.32,.17);box(person,M.darkwood,0,.37,0,.27,.055,.19);part(person,'ball',skin,0,.82,0,.115,.14,.11);part(person,'ball',type==='settler'?M.hair:M.iron,0,.9,-.015,.13,.07,.12);box(person,M.hair,0,.84,.1,.11,.025,.015);
  for(const side of[-1,1]){const arm=new T.Group();arm.position.set(side*.18,.65,0);part(arm,'limb',body,0,-.12,0,.085,.14,.095);part(arm,'ball',skin,0,-.25,0,.048,.055,.05);person.add(arm);joints[side===-1?'leftArm':'rightArm']=arm;const leg=new T.Group();leg.position.set(side*.075,.36,0);part(leg,'limb',M.darkwood,0,-.12,0,.095,.15,.1);box(leg,M.boots,0,-.25,.035,.11,.1,.17);person.add(leg);joints[side===-1?'leftLeg':'rightLeg']=leg;}
  if(type==='settler'){cyl(person,M.cloth,0,.91,0,.16,.025);part(person,'ball',M.cloth,0,.94,-.015,.115,.06,.1);const tool=new T.Group();box(tool,M.wood,0,-.18,.04,.028,.4,.028);box(tool,M.iron,0,-.02,.05,.18,.09,.04);joints.rightArm.add(tool);joints.tool=tool;const load=new T.Group();part(load,'ball',M.cloth,0,.55,-.18,.14,.18,.12);box(load,M.darkwood,0,.56,-.29,.26,.035,.025);person.add(load);joints.load=load;}
  else if(type==='spearman'||cavalry){box(joints.rightArm,M.wood,0,.1,.1,.025,1.25,.025);part(joints.rightArm,'cone',M.iron,0,.78,.1,.04,.18,.04);box(joints.leftArm,M.wood,0,-.1,.08,.24,.35,.05);box(joints.leftArm,color,0,-.1,.12,.18,.27,.02);}
  else if(type==='archer'){part(joints.leftArm,'ring',M.wood,0,-.13,.13,.13,.23,.13,0,P/2);box(joints.rightArm,M.wood,0,-.1,.12,.02,.02,.4);}
  else if(psion){part(person,'ball',M.glow,0,1.2,0,.12,.12,.12);box(joints.rightArm,M.gold,0,.05,0,.03,.85,.03);}
  else box(joints.rightArm,M.iron,0,-.14,.23,.08,.1,.45);
  if(robot){person.scale.setScalar(type==='mecha'?2:1.65);box(person,M.glow,0,.58,.11,.15,.09,.025);}
  if(cavalry){part(g,'ball',M.wood,0,.65,0,.28,.28,.53);part(g,'ball',M.wood,0,.95,.45,.14,.3,.17);part(g,'ball',M.darkwood,0,1.07,.6,.14,.13,.23);joints.horseLegs=[];for(const x of[-.18,.18])for(const z of[-.35,.35]){const leg=new T.Group();leg.position.set(x,.6,z);box(leg,M.wood,0,-.27,0,.08,.5,.1);box(leg,M.boots,0,-.51,.035,.1,.08,.16);g.add(leg);joints.horseLegs.push(leg);}box(g,M.darkwood,0,.7,-.6,.045,.5,.04,0,0,.2);}
 }
 g.userData={joints,type,technology,species,enemy};decorateUnit(g,type,M,part,technology);sculptUnit(g,type,M,part);return g;
}
export function animateUnit(g,u,time,moving,working,carrying){if(animateImported(g,u,time,moving,working,carrying))return;const j=g.userData.joints;if(j.hero){animateCharacter(j,u,time,moving,working,carrying);j.horseLegs?.forEach((v,i)=>v.rotation.x=Math.sin(time*7+(i%2?Math.PI:0))*(moving?.55:0));return;}const t=time*7,walk=moving?Math.sin(t)*.65:0,work=working?Math.sin(time*6)*.65:0;
 if(j.leftKnee){j.leftKnee.rotation.x=Math.max(0,-Math.sin(t))*(moving?.8:0);j.rightKnee.rotation.x=Math.max(0,Math.sin(t))*(moving?.8:0);j.leftElbow.rotation.x=-.2+(working?work*.3:Math.max(0,Math.sin(t))*(moving?.35:0));j.rightElbow.rotation.x=-.2+(working?-.45+work*.6:Math.max(0,-Math.sin(t))*(moving?.35:0));}if(j.leftLeg){j.leftLeg.rotation.x=walk;j.rightLeg.rotation.x=-walk;j.leftArm.rotation.x=-walk*.8+work*.4;j.rightArm.rotation.x=walk*.8+(working?-1.1+work:0);j.body.position.y=(u.type==='cavalry'?.75:0)+(moving?Math.abs(Math.sin(t))*.035:0);j.body.rotation.z=!moving&&!working?Math.sin(time*1.5)*.018:0;j.body.rotation.x=working&&['food','water'].includes(u.gatherResource)?.28+Math.sin(time*3)*.08:0;if(j.load)j.load.visible=carrying;if(j.tool)j.tool.visible=!working||!['food','water'].includes(u.gatherResource);}
 j.horseLegs?.forEach((v,i)=>v.rotation.x=Math.sin(t+(i%2?P:0))*(moving?.55:0));j.wheels?.forEach(v=>v.rotation.x=moving?time*9:0);if(j.rotor)j.rotor.rotation.y=time*28;if(j.turret)j.turret.rotation.y=Math.sin(time*.5)*.12;
}

import {sculptBuilding} from './sculpted-style.js';
import * as T from './vendor/three.module.js';
const PI=Math.PI;
// A hipped, overhanging roof reads as a solid volume from every camera angle.
export function hipRoof(){const a=[-.56,0,-.56],b=[.56,0,-.56],c=[.56,0,.56],d=[-.56,0,.56],e=[0,.5,-.28],f=[0,.5,.28],v=[],uv=[];for(const face of[[a,b,e],[b,c,f],[b,f,e],[c,d,f],[d,a,e],[d,e,f],[d,c,b],[d,b,a]])for(const i of[1,0,2]){v.push(...face[i]);uv.push((face[i][0]+.56)/1.12,(face[i][2]+.56)/1.12);}const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(v,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.computeVertexNormals();return g;}
// Shared bevelled masses. Fine struts retain the light box geometry.
export function softBlock(){const s=new T.Shape(),a=.455;s.moveTo(-a,-a);s.lineTo(a,-a);s.lineTo(a,a);s.lineTo(-a,a);s.closePath();const g=new T.ExtrudeGeometry(s,{depth:.91,steps:1,bevelEnabled:true,bevelThickness:.045,bevelSize:.045,bevelSegments:1,curveSegments:1});g.translate(0,0,-.455);g.computeVertexNormals();return g;}
export function painterTexture(base,kind){const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');x.fillStyle=base;x.fillRect(0,0,256,256);let seed=173;const rnd=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 for(let i=0;i<1400;i++){x.globalAlpha=.018+rnd()*.025;x.fillStyle=rnd()>.5?'#fff4c4':'#183225';x.fillRect(rnd()*256,rnd()*256,kind==='wood'?1:2+rnd()*5,kind==='wood'?12+rnd()*45:2+rnd()*5);}x.globalAlpha=1;
 if(kind==='roof'){for(let row=0;row<8;row++)for(let col=-1;col<8;col++){const a=col*38+(row%2)*19,b=row*32;x.fillStyle=`rgba(255,210,137,${.06+rnd()*.1})`;x.fillRect(a+2,b+1,34,5);x.fillStyle='rgba(53,28,23,.23)';x.fillRect(a,b+28,38,4);x.fillRect(a,b+6,2,24);}}
 if(kind==='stone'){for(let row=0;row<6;row++)for(let col=-1;col<6;col++){const a=col*52+(row%2)*26,b=row*44;x.fillStyle='rgba(42,41,33,.18)';x.fillRect(a,b,51,3);x.fillRect(a,b,3,43);x.fillStyle='rgba(255,240,196,.18)';x.fillRect(a+4,b+4,45,2);}}
 if(kind==='wood'){for(let a=0;a<256;a+=32){x.fillStyle='rgba(37,29,24,.25)';x.fillRect(a,0,2,256);x.fillStyle='rgba(255,232,172,.16)';x.fillRect(a+3,0,2,256);}for(let i=0;i<12;i++){x.strokeStyle='rgba(60,38,22,.18)';x.beginPath();x.ellipse(rnd()*256,rnd()*256,2,10,0,0,PI*2);x.stroke();}}
 if(kind==='army'){for(let i=0;i<23;i++){x.fillStyle=i%3?'#526249':'#929368';x.globalAlpha=.35;x.beginPath();x.ellipse(rnd()*256,rnd()*256,18+rnd()*30,9+rnd()*20,rnd()*PI,0,PI*2);x.fill();}}
 x.globalAlpha=1;const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;t.wrapS=t.wrapT=T.RepeatWrapping;t.anisotropy=4;return t;
}
export function contactMaterial(){const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d'),g=x.createRadialGradient(64,64,6,64,64,63);g.addColorStop(0,'rgba(28,37,19,.34)');g.addColorStop(.55,'rgba(39,40,20,.2)');g.addColorStop(1,'rgba(40,42,24,0)');x.fillStyle=g;x.fillRect(0,0,128,128);return new T.MeshBasicMaterial({map:new T.CanvasTexture(c),transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-1});}
export function decorateBuilding(g,id,era,level,size,M,part){const b=(m,x,y,z,w,h,d,ry=0)=>part(g,'box',m,x,y,z,w,h,d,0,ry),c=(m,x,y,z,r,h)=>part(g,'cylinder',m,x,y,z,r,h,r),stone=era>=12?M.metal:M.stone;
 const roof=era>=4?M.roofdark:M.roof,hip=(x,y,z,w,h,d,material=roof)=>part(g,'hiproof',material,x,y,z,w,h,d);
 if(era>0&&era<12&&['camp','house','depot','barracks'].includes(id)){
  g.clear();const wall=era<4?M.wood:M.plaster;
  if(id==='camp'){
   b(M.stone,0,.13,0,1.7,.25,1.5);b(wall,0,.73,0,1.5,1.1,1.25);hip(0,1.28,0,1.9,1.22,1.67);b(M.gold,0,1.89,0,.095,.07,.85);
   // Broad council hall, raised bell tower and an arched entrance apron.
   b(M.stone,-.57,.68,.48,.54,1.2,.6);b(wall,-.57,1.38,.48,.46,.65,.51);hip(-.57,1.72,.48,.77,.63,.78);b(M.darkwood,-.57,1.42,.755,.26,.28,.025);c(M.gold,-.57,1.41,.79,.07,.12);
   b(M.darkwood,0,.47,.645,.38,.68,.04);b(M.wood,0,.47,.67,.28,.6,.02);b(M.gold,.1,.48,.69,.035,.04,.02);for(const x of[-.27,.27])c(M.stone,x,.48,.73,.065,.85);b(M.stone,0,.92,.73,.66,.13,.23);hip(0,.99,.8,.85,.38,.65);
   c(M.wood,.68,1.28,-.5,.025,2.5);b(M.blue,.88,2.32,-.5,.4,.3,.03);b(M.gold,.67,2.53,-.5,.08,.08,.08);
  }else if(id==='house'){
   b(M.stone,0,.12,0,1.45,.22,1.3);b(wall,0,.62,0,1.32,.86,1.12);hip(0,1.05,0,1.68,1.12,1.5);b(M.stone,.42,1.3,-.28,.22,.88,.25);b(M.darkwood,.42,1.77,-.28,.28,.065,.31);
   for(const x of[-.58,.58])b(M.darkwood,x,.64,.575,.075,.88,.065);b(M.darkwood,0,.43,.585,.28,.58,.035);hip(0,.82,.77,.74,.44,.7);for(const x of[-.31,.31])c(M.wood,x,.42,.94,.04,.8);b(M.wood,.47,.19,.81,.32,.3,.3);part(g,'ball',M.leaf,.47,.43,.81,.22,.17,.22);
   // A dormer breaks the roof silhouette; it is geometry, including its window.
   b(wall,-.29,1.28,.32,.4,.32,.42);part(g,'roof',roof,-.29,1.43,.32,.52,.5,.5);b(M.darkwood,-.29,1.3,.54,.22,.22,.025);b(M.window,-.29,1.3,.56,.15,.15,.015);
  }else if(id==='depot'){
   b(M.stone,0,.12,0,1.76,.2,1.54);b(M.wood,0,.57,-.63,1.58,.85,.12);for(const x of[-.73,.73])for(const z of[-.61,.61])b(M.darkwood,x,.62,z,.13,1.12,.13);hip(0,1.16,0,1.98,.9,1.8);b(M.wood,0,.96,.64,1.62,.15,.12);
   for(let i=0;i<8;i++){const x=-.51+i%3*.36,y=.28+Math.floor(i/3)*.24,z=-.35+(i%2)*.38;b(i%3?M.wood:M.canvas,x,y,z,.3,.23,.3);b(M.darkwood,x,y,z+.155,.25,.026,.012);}for(let i=0;i<3;i++)c(M.canvas,.55,.23+i*.14,.39,.17,.24);
   b(M.blue,0,1,.72,.48,.25,.025);b(M.gold,0,1,.74,.12,.12,.015);
  }else{
   b(M.stone,0,.1,0,1.7,.18,1.6);b(wall,.18,.61,-.05,1.25,.96,1.45);hip(.18,1.09,-.05,1.6,1.1,1.9,M.blue);b(M.darkwood,.18,.44,.69,.5,.65,.045);b(M.canvas,.18,.47,.72,.4,.61,.025);
   c(M.stone,-.64,.67,-.55,.32,1.24);c(M.wood,-.64,1.33,-.55,.36,.14);hip(-.64,1.42,-.55,.83,.75,.83,M.blue);for(const x of[-.86,-.42])b(M.darkwood,x,1.15,-.28,.07,.28,.035);c(M.wood,.74,1.05,-.65,.025,2.05);b(M.blue,.91,1.87,-.65,.35,.27,.025);
  }
  g.userData.landmark=true;
 }
 if(id==='camp'&&era===0){g.clear();b(M.darkwood,0,.09,0,1.35,.16,1.1);part(g,'roof',M.canvas,0,.16,0,1.7,2.6,1.4);b(M.black,0,.48,.71,.44,.68,.02);for(const x of[-.8,.8]){c(M.wood,x,.5,.8,.035,.95);part(g,'box',M.wood,x*.5,.25,.75,.025,.6,.025,0,0,x>0?-.8:.8);}for(let i=0;i<3;i++)b(M.wood,-.65+i*.16,.19,.95,.14,.14,.5);c(M.iron,.62,.23,.85,.13,.25);b(M.cloth,.35,.2,-.65,.35,.22,.24);}
 // Contact dirt is feathered into the terrain; no universal concrete tile under every building.
 if(g.children[0]?.material===M.earth&&g.children[0].position.y<0)g.remove(g.children[0]);if(g.children[0]?.material===M.stone&&g.children[0].position.y<.06&&g.children[0].scale.x>size*.7)g.remove(g.children[0]);
 const contact=part(g,'ground',M.contact,0,.014,0,size*1.2,1,size*1.12);contact.castShadow=false;contact.receiveShadow=false;
 const military=['barracks','garage','munitions','bunker','cannon','coastal','antiair','maintenance','hangar','freightterminal'].includes(id);
 if(military&&era>=12&&era<23)g.traverse(o=>{if(o.isMesh&&(o.material===M.roofdark||o.material===M.blue))o.material=M.army;});
 if(era>0&&['camp','house','embassy','school','hospital','archive','refuge','clinic'].includes(id)){
  const z=size*.36;for(const x of[-.54,.54]){b(M.darkwood,x,.62,z+.02,.29,.32,.06);b(M.window,x,.64,z+.057,.2,.23,.025);b(M.wood,x,.63,z+.08,.025,.24,.025);b(M.wood,x,.63,z+.08,.22,.025,.025);b(M.wood,x,.43,z+.1,.36,.09,.18);for(let j=0;j<3;j++)part(g,'ball',j%2?M.flower:M.leaf,x-.1+j*.1,.51,z+.12,.07,.07,.07);}
  for(let i=0;i<3;i++)b(M.stone,0,.035+i*.035,z+.25-i*.09,.55,.07,.22);
  if(id==='camp'&&!g.userData.landmark){b(M.plaster,.25,1.63,-.2,.48,.58,.44);for(const x of[.1,.4])b(M.darkwood,x,1.78,.04,.06,.24,.04);part(g,'roof',era<12?M.roof:M.army,.25,1.95,-.2,.68,.5,.67);c(M.gold,.25,1.74,.045,.07,.13);}
 }
 if(military){for(const x of[-size*.39,size*.39]){b(stone,x,.35,size*.37,.17,.6,.18);b(M.blue,x,.57,size*.38,.12,.22,.04);}if(era>=12){for(let i=0;i<5;i++)b(i%2?M.darkwood:M.gold,-.4+i*.2,.16,size*.41,.17,.07,.08);b(M.iron,-size*.35,1.35,-size*.3,.025,.9,.025);b(M.gold,-size*.35,1.82,-size*.3,.07,.07,.07);}else{for(let i=0;i<3;i++){b(M.wood,-.45+i*.2,.42,size*.43,.03,.8,.03);part(g,'cone',M.iron,-.45+i*.2,.88,size*.43,.045,.16,.045);}b(M.darkwood,-.25,.36,size*.43,.65,.055,.07);}}
 if(['sawmill','carpenter','bridgeyard','workshop'].includes(id)){for(let i=0;i<5;i++){const x=-.56+(i%3)*.2,y=.14+Math.floor(i/3)*.17;part(g,'cylinder',M.wood,x,y,.7,.09,.74,.09,PI/2);part(g,'cylinder',M.cutwood,x,y,1.075,.073,.012,.073,PI/2);}b(M.iron,.5,.38,.7,.45,.1,.4);part(g,'ring',M.iron,.5,.57,.7,.18,.18,.18,0,PI/2);}
 if(['mine','quarry','geology','foundry'].includes(id)){for(let i=0;i<4;i++)part(g,'rock',i%2?M.iron:M.stone,-.7+(i%2)*.15,.14+Math.floor(i/2)*.15,.62,.13,.17,.12,.2,i);b(M.darkwood,.6,.3,.7,.4,.26,.4);for(const x of[.35,.82])part(g,'cylinder',M.iron,x,.16,.7,.09,.11,.09,0,0,PI/2);}
 if(['garage','maintenance','hangar','freightterminal'].includes(id)&&era>=12){b(M.army,0,.28,size*.39,.55,.26,.55);b(M.black,0,.51,size*.36,.34,.19,.18);for(const x of[-.31,.31])for(const z of[.2,.65])part(g,'cylinder',M.black,x,.16,z,.15,.12,.15,0,0,PI/2);for(const x of[-.17,.17])b(M.window,x,.29,size*.56,.09,.08,.03);}
 if(['dock','fishery','cargoharbor','shipwright','lighthouse'].includes(id)){for(const x of[-.65,.65]){c(M.wood,x,.2,.75,.06,.65);part(g,'ring',M.rope,x,.32,.75,.12,.12,.12,PI/2);}b(M.blue,0,.3,.8,.3,.025,.25);}
 if(['reactor','refinery','foundry','waterworks','fusion'].includes(id)){for(let i=0;i<3;i++)b(M.darkwood,.68,.75+i*.09,-.15,.14,.045,.45);for(const x of[-.5,.5])c(M.iron,x,.18,-.65,.12,.24);}
 // Bedrock, grass and supply props use a fixed per-type pattern, also visible in the catalogue.
 let seed=0;for(const ch of id)seed=(seed*31+ch.charCodeAt(0))>>>0;
 for(let i=0;i<5;i++){const a=(i*2.4+seed%17),x=Math.cos(a)*size*.45,z=Math.sin(a)*size*.44;if(z>size*.27&&Math.abs(x)<.34)continue;part(g,'rock',M.stone,x,.035,z,.08+(i%2)*.03,.06,.07,0,a);if(i%2===0){part(g,'ball',M.leaf,x,.09,z,.11,.12,.1);part(g,'ball',M.leaflight,x+.06,.14,z,.08,.08,.08);}}
 sculptBuilding(g,id,era,level,size,M,part);g.userData.visualRevision=11;
}
export function decorateUnit(g,type,M,part,era=0){const j=g.userData.joints;if(!j)return;const b=(parent,m,x,y,z,w,h,d,rz=0)=>part(parent,'box',m,x,y,z,w,h,d,0,0,rz);
 if(j.body){const p=j.body,robot=['guardian','mecha'].includes(type),civil=type==='settler',torso=p.children[0],belt=p.children[1],head=p.children[2],cap=p.children[3];if(torso?.isMesh)torso.scale.set(.32,.36,.23);if(belt?.isMesh)belt.scale.set(.34,.06,.25);if(head?.isMesh)head.scale.set(.145,.165,.135);if(cap?.isMesh)cap.scale.set(.155,.08,.14);
  for(const x of[-.047,.047])b(p,M.black,x,.855,.126,.027,.025,.017);b(p,robot?M.iron:M.skin,0,.818,.143,.055,.06,.05);b(p,civil?M.canvas:M.darkwood,.075,.53,.127,.035,.34,.025,-.25);b(p,civil?M.darkwood:M.iron,0,.43,.13,.08,.06,.025);
  for(const side of[-1,1]){const arm=j[side<0?'leftArm':'rightArm'];arm.position.x=side*.215;const sleeve=arm.children[0];if(sleeve?.isMesh)sleeve.scale.set(.12,.17,.12);if(arm.children[1]?.isMesh)arm.children[1].scale.set(.065,.068,.065);if(!civil)b(arm,era>=12?M.army:M.iron,0,.005,.015,.19,.12,.22);const leg=j[side<0?'leftLeg':'rightLeg'];if(leg){leg.position.x=side*.09;if(leg.children[0])leg.children[0].scale.set(.125,.16,.13);if(leg.children[1])leg.children[1].scale.set(.15,.115,.22);}}
  if(!civil&&!robot){part(p,'ball',era>=12?M.army:M.iron,0,.93,-.025,.17,.125,.15);b(p,era>=12?M.army:M.iron,0,.915,.075,.35,.045,.22);b(p,M.darkwood,0,.59,-.16,.23,.24,.12);}
  if(civil){b(p,M.wood,-.13,.54,-.14,.09,.32,.08);for(const o of p.children)if(o.isMesh&&o.material===M.cloth&&o.position.y>.9)o.material=M.canvas;}
 }
 if(j.horseLegs){part(g,'ball',M.wood,0,.71,.17,.33,.3,.43);for(const x of[-.105,.105])part(g,'ball',M.black,x,1.11,.68,.022,.025,.022);for(let i=0;i<5;i++)b(g,M.darkwood,0,1.2-i*.065,.4-i*.065,.11,.12,.1);b(g,M.blue,0,.92,-.1,.55,.045,.48);}
 if(['jeep','bulwark','missile','train'].includes(type)){const tracked=['bulwark','missile'].includes(type);for(const x of[-.47,.47]){if(tracked){b(g,M.black,x,.23,0,.25,.33,1.55);for(let i=0;i<8;i++)b(g,M.iron,x,.41,-.67+i*.19,.27,.045,.095);for(const z of[-.54,-.18,.18,.54])part(g,'cylinder',M.iron,x,.24,z,.135,.27,.135,0,0,PI/2);}else{b(g,M.army,x,.46,.45,.23,.07,.4);b(g,M.army,x,.46,-.45,.23,.07,.4);}}for(const x of[-.25,.25]){b(g,M.window,x,.41,.675,.12,.09,.035);b(g,M.red,x,.38,-.68,.1,.06,.025);}b(g,M.iron,0,.23,.75,.92,.09,.12);for(let i=0;i<5;i++)b(g,M.black,-.22+i*.11,.42,.673,.05,.15,.025);if(j.turret){part(j.turret,'cylinder',M.iron,0,.2,-.13,.19,.12,.19);b(j.turret,M.black,0,.07,1.13,.13,.13,.015);}}
 if(j.hull){for(const x of[-.35,.35])for(let i=0;i<5;i++)b(g,M.iron,x,.62,-.8+i*.4,.025,.33,.025);for(const x of[-.35,.35])b(g,M.iron,x,.79,0,.025,.025,1.7);part(g,'ring',M.red,.36,.64,-.4,.11,.11,.11,0,PI/2);}
 if(type==='wagon'){for(const x of[-.37,.37])b(g,M.darkwood,x,.8,-.1,.03,.4,1.24);for(const x of[-.55,.55])for(const z of[-.5,.5]){part(g,'cylinder',M.wood,x,.28,z,.23,.025,.23,0,0,PI/2);for(let i=0;i<4;i++)b(g,M.darkwood,x,.28,z,.026,.42,.026,i*PI/4);}b(g,M.wood,0,.68,-.12,.45,.24,.55);}
 if(type==='freighttrain'){b(g,M.iron,0,.21,1.4,.86,.09,.16);part(g,'ball',M.window,0,.84,1.17,.13,.13,.055);for(const x of[-.54,.54])b(g,M.iron,x,.28,0,.035,.06,2.08);part(g,'cylinder',M.iron,0,1.49,.8,.14,.06,.14);b(g,M.gold,.23,1.52,-.57,.055,.2,.055);}
 if(type==='submarine'){for(const x of[-.405,.405])for(const z of[-.6,-.25,.1,.45])part(g,'ball',M.glass,x,.42,z,.02,.06,.065);b(g,M.iron,0,1.28,-.1,.08,.08,.25);part(g,'ring',M.iron,0,.72,-.2,.19,.19,.19,PI/2);}
 g.userData.visualRevision=11;
}

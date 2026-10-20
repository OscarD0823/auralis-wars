// Geometry interpretations of Auralis' original sheets. All pieces occupy world space.
import * as T from './vendor/three.module.js';
export function referenceBuilding(g,id,era,level,size,M,part){
 const historic=era>=4&&era<12,modern=era>=12&&era<23;
 if(!(historic&&['camp','mine','reactor','refinery','tower','barracks','lab'].includes(id)||modern&&['camp','barracks','garage','airfield','hospital','lab','dock','cargoharbor','shipwright'].includes(id)))return false;
 g.clear();const b=(m,x,y,z,w,h,d,ry=0)=>part(g,'box',m,x,y,z,w,h,d,0,ry),c=(m,x,y,z,r,h)=>part(g,'cylinder',m,x,y,z,r,h,r),cone=(m,x,y,z,r,h)=>part(g,'cone',m,x,y,z,r,h,r),roof=(x,y,z,w,h,d,m=M.roof)=>part(g,'hiproof',m,x,y,z,w,h,d),stone=M.limestone;
 part(g,'ground',M.contact,0,.012,0,size*1.18,1,size*1.18);b(stone,0,.08,0,size*.86,.16,size*.82);
 const banner=(x,y,z,w=.24,h=.43)=>{b(M.blue,x,y,z,w,h,.025);b(M.gold,x,y,z+.018,.055,h*.6,.012);b(M.gold,x,y+.13,z+.02,w*.57,.045,.015);};
 const steps=(z=.95,width=.56)=>{for(let i=0;i<4;i++)b(stone,0,.04+i*.045,z-i*.1,width,.08+i*.09,.2);};
 const arch=(x,y,z,w=.4)=>{b(M.darkwood,x,y,z,w,w*1.4,.045);for(const side of[-1,1])b(stone,x+side*w*.57,y,z+.02,.12,w*1.5,.13);for(let i=0;i<7;i++){const a=i*Math.PI/6;part(g,'box',stone,x+Math.cos(a)*w*.56,y+w*.72+Math.sin(a)*w*.48,z+.02,.12,.14,.13,0,0,a-Math.PI/2);}};
 const brazier=(x,y,z)=>{c(M.gold,x,y,z,.1,.16);cone(M.lantern,x,y+.13,z,.075,.22);c(M.iron,x,y-.1,z,.055,.16);};
 const blocks=(x,y,z,w,h,d)=>{b(M.stone,x,y,z,w,h,d);for(let row=0;row<Math.ceil(h/.22);row++)for(let i=0;i<Math.ceil(w/.25);i++)b(stone,x-w/2+.125+i*.25+(row%2)*.04,y-h/2+.11+row*.22,z+d/2+.012,.23,.2,.035);};
 const tower=(x,z,h=1.15,r=.23)=>{c(stone,x,h/2+.13,z,r,h);c(M.gold,x,h+.14,z,r*1.07,.075);for(let i=0;i<8;i++){const a=i*Math.PI/4;b(M.stone,x+Math.cos(a)*r*.86,h+.25,z+Math.sin(a)*r*.86,.11,.17,.11,a);}b(M.darkwood,x,h*.7,z+r,.05,.22,.025);};
 if(historic&&id==='camp'){
  blocks(0,.63,-.13,1.08,1.02,1.02);roof(0,1.18,-.13,1.33,.92,1.32);c(M.gold,0,1.65,-.13,.2,.07);c(M.iron,0,1.88,-.13,.025,.43);banner(.15,1.98,-.13,.3,.2);arch(0,.43,.41,.36);steps();
  for(const side of[-1,1]){tower(side*.69,.43,1.05);tower(side*.61,-.56,1.36,.2);cone(M.roof,side*.61,1.77,-.56,.28,.52);c(M.gold,side*.61,2.05,-.56,.045,.08);blocks(side*.68,.44,-.06,.15,.62,.94);banner(side*.69,.65,.68,.21,.37);brazier(side*.42,.3,.86);}
  banner(0,1.02,.42,.34,.45);for(const side of[-1,1])for(let i=0;i<3;i++)b(M.stone,side*.33,.94,.42,.14,.16,.14);
 }else if(historic&&id==='mine'){
  for(let i=0;i<9;i++){const a=i*2.4;part(g,'rock',i%2?M.cliff:stone,Math.cos(a)*.56,.3+(i%3)*.19,-.2+Math.sin(a)*.32,.3,.42,.29,0,a);}
  b(M.black,0,.46,.23,.63,.66,.12);for(const side of[-1,1])b(M.darkwood,side*.37,.52,.3,.14,.95,.16);b(M.wood,0,.96,.3,.86,.15,.18);roof(0,1.03,.17,1.12,.55,1.1);for(const side of[-1,1])b(M.iron,side*.24,.16,.69,.035,.035,.9);
  const drill=new T.Group();drill.position.set(0,.55,.7);drill.rotation.x=Math.PI/2;g.add(drill);for(let i=0;i<5;i++){const r=.2-i*.032;part(drill,'cylinder',M.iron,0,-.1+i*.095,0,r,.09,r);part(drill,'ring',M.gold,0,-.1+i*.095,0,r*1.04,r*1.04,r*1.04,Math.PI/2);}g.userData.rotor=drill;
  b(M.wood,.62,.26,.6,.4,.25,.43);for(const x of[.41,.83])for(const z of[.43,.76])part(g,'cylinder',M.iron,x,.16,z,.1,.06,.1,0,0,Math.PI/2);for(let i=0;i<5;i++)part(g,'rock',M.gold,.5+i%2*.14,.44+Math.floor(i/2)*.06,.52+i%3*.09,.08,.07,.08);brazier(-.65,.44,.44);
 }else if(historic&&['reactor','lab'].includes(id)){
  c(stone,0,.28,0,.55,.4);c(M.gold,0,.51,0,.58,.1);const crystal=M.glow;part(g,'crystal',crystal,0,1.1,0,.28,.7,.28);for(const y of[.78,1.32])part(g,'ring',M.gold,0,y,0,.43,.43,.43,Math.PI/2);for(let i=0;i<4;i++){const a=i*Math.PI/2,x=Math.cos(a)*.62,z=Math.sin(a)*.62;c(stone,x,.5,z,.13,.8);c(M.gold,x,.93,z,.16,.1);part(g,'crystal',crystal,x,1.16,z,.12,.3,.12);}steps(.82,.65);
 }else if(historic&&id==='refinery'){
  blocks(0,.47,-.04,1.2,.76,1.03);roof(0,.88,-.04,1.45,.65,1.28);for(const x of[-.42,.42]){c(M.gold,x,1.24,-.32,.16,.77);c(M.iron,x,1.66,-.32,.19,.09);c(M.black,x,1.71,-.32,.12,.035);}arch(-.21,.35,.5,.34);b(M.lantern,-.21,.3,.54,.23,.24,.025);b(M.wood,.56,.38,.65,.46,.12,.37);for(let i=0;i<4;i++)b(M.gold,.42+i%2*.14,.48+Math.floor(i/2)*.08,.64,.12,.07,.16);brazier(-.67,.27,.75);
 }else if(historic&&id==='tower'){
  tower(0,0,1.15,.45);const turret=new T.Group();turret.position.set(0,1.45,0);g.add(turret);part(turret,'cylinder',M.iron,0,0,.28,.135,.95,.135,Math.PI/2);part(turret,'cylinder',M.gold,0,0,.78,.17,.12,.17,Math.PI/2);part(turret,'cylinder',M.black,0,0,.85,.11,.01,.11,Math.PI/2);for(const side of[-1,1])b(M.wood,side*.22,1.37,0,.12,.35,.36);banner(0,.68,.46,.3,.48);
 }else if(historic&&id==='barracks'){
  blocks(0,.61,-.1,1.36,.98,1.1);roof(0,1.14,-.1,1.68,1.1,1.45,M.blue);arch(0,.43,.47,.4);steps(.88,.68);for(const x of[-.65,.65]){b(M.darkwood,x,.79,.45,.1,1.25,.12);banner(x,.73,.54,.2,.37);c(M.wood,x,1.62,-.4,.02,1.3);}for(const x of[-.6,.58]){c(M.wood,x,.3,.9,.025,.6);part(g,'ring',M.canvas,x,.55,.9,.18,.18,.18);c(M.red,x,.55,.93,.08,.025);}for(let i=0;i<4;i++){b(M.wood,-.75+i*.11,.37,-.65,.025,.7,.025);cone(M.iron,-.75+i*.11,.77,-.65,.055,.14);}
 }else if(modern&&['dock','cargoharbor','shipwright'].includes(id)){
  b(stone,0,.14,.3,1.85,.28,1.9);b(M.plaster,-.24,.7,-.2,1.2,1.12,1.15);roof(-.24,1.28,-.2,1.42,.82,1.36,M.roofdark);b(M.black,-.24,.58,.39,.75,.8,.03);for(const x of[-.7,.22])b(M.stone,x,.6,.42,.12,.94,.12);for(let i=0;i<4;i++){b(M.wood,-.49+i*.17,.29,.45,.14,.22,.25);b(M.darkwood,-.49+i*.17,.4,.46,.16,.03,.27);}b(M.gold,-.23,1.12,.49,.35,.04,.035);part(g,'ring',M.gold,-.23,1.1,.52,.1,.1,.1);b(M.iron,.66,.96,.21,.13,1.55,.15);b(M.gold,.66,1.72,.52,.17,.18,1.05);c(M.iron,.66,1.3,.92,.015,.7);part(g,'ring',M.iron,.66,.95,.92,.09,.09,.09);for(const x of[-.78,.78])for(const z of[.65,1.05]){c(M.iron,x,.38,z,.065,.23);part(g,'ring',M.black,x,.22,z,.11,.11,.11,Math.PI/2);}b(M.army,-.58,.42,.99,.3,.38,.3);b(M.wood,-.16,.35,.98,.3,.24,.34);
 }else if(modern){
  const hangar=['garage','airfield'].includes(id),wall=M.plaster;b(wall,0,.62,-.13,1.4,1.06,1.32);b(M.iron,0,1.18,-.13,1.58,.1,1.47);b(M.army,0,1.25,-.13,1.32,.06,1.2);
  if(hangar){b(M.black,0,.52,.55,1.07,.8,.04);for(const side of[-1,1])b(M.iron,side*.6,.57,.59,.1,1,.12);for(let i=0;i<6;i++)b(M.iron,0,.92-i*.055,.585,1.08,.025,.02);b(M.roofdark,0,.12,.83,1.45,.055,.45);for(let i=0;i<6;i++)b(i%2?M.gold:M.black,-.5+i*.2,.16,.73,.16,.025,.08);}
  else{arch(0,.46,.57,.36);for(const x of[-.45,.45]){b(M.army,x,.7,.555,.3,.4,.04);b(M.glass,x,.73,.59,.24,.22,.025);}steps(.95,.6);banner(.56,.72,.6,.18,.4);}
  for(const side of[-1,1]){b(stone,side*.76,.39,.1,.15,.55,.85);for(let i=0;i<4;i++)part(g,'sandbag',M.canvas,side*.72,.19+Math.floor(i/2)*.13,.7+(i%2)*.14,.21,.08,.13);c(M.iron,side*.63,1.64,-.58,.018,.9);c(M.gold,side*.63,2.1,-.58,.045,.055);}
  if(id==='camp'||id==='lab'){b(M.iron,-.32,1.45,-.23,.28,.38,.28);part(g,'dish',M.metal,-.3,1.85,-.2,.34,.34,.34,.65);b(M.iron,.41,1.51,-.35,.025,.68,.025);}if(id==='hospital'){b(M.canvas,0,1.31,-.13,.7,.03,.7);b(M.leaf,0,1.34,-.13,.15,.025,.48);b(M.leaf,0,1.34,-.13,.48,.025,.15);}if(id==='barracks')for(let i=0;i<3;i++)b(M.army,-.5+i*.45,.19,.88,.25,.22,.22);
 }
 g.userData.referenceRevision=14;return true;
}

export function refineReferenceCharacter(g,type,M,part){
 const j=g.userData.joints;if(!j?.hero)return;const {headPivot,hero}=j;
 headPivot.scale.set(.78,.83,.8);headPivot.position.y=1.23;
 for(const eye of j.eyes)eye.scale.set(.75,.78,.8);
 // Remove loose scalp locks from above helmets; they previously pierced the metal.
 if(!hero.worker&&!hero.archer&&!hero.mystic){j.hairCap.visible=false;for(const o of [...headPivot.children])if(o.geometry?.userData.shape==='heroBrow'&&o.position.y>.2)o.visible=false;}
 if(hero.worker){j.body.traverse(o=>{if(o.isMesh&&o.material===M.heroBlue)o.material=M.linen;});part(headPivot,'cylinder',M.cutwood,0,.27,-.01,.34,.035,.31);part(headPivot,'cone',M.canvas,0,.36,-.01,.23,.22,.21);part(headPivot,'cylinder',M.leather,0,.285,-.01,.235,.055,.215);}
 else if(hero.archer){j.torso.material=M.linen;for(const side of['left','right']){const arm=j[side+'Arm'];for(const o of arm.children)if(o.isMesh&&o.material===M.skin)o.material=M.linen;const elbow=j[side+'Elbow'];for(const o of elbow.children)if(o.isMesh&&o.material===M.skin&&o!==j[side+'Hand'])o.material=M.linen;}}
 else if(!hero.mystic){const era=g.userData.technology||0;part(headPivot,'box',era>=12?M.glow:M.iron,0,.04,.205,era>=12?.29:.035,era>=12?.075:.22,.025);}
 for(const side of['left','right']){const knee=j[side+'Knee'];part(knee,'head',hero.worker?M.heroTrousers:hero.archer?M.leather:M.iron,0,0,.025,.075,.085,.08);const elbow=j[side+'Elbow'];part(elbow,'head',hero.worker||hero.archer?M.linen:M.leather,0,0,0,.07,.075,.07);}
 g.userData.referenceRevision=14;
}

export function refineReferenceVehicle(g,type,M,part){
 const j=g.userData.joints;if(!j)return;const box=(parent,m,x,y,z,w,h,d)=>part(parent,'chassis',m,x,y,z,w,h,d),c=(parent,m,x,y,z,r,h,rx=0,rz=0)=>part(parent,'cylinder',m,x,y,z,r,h,r,rx,0,rz);
 if(['jeep','missile','bulwark'].includes(type)){
  g.clear();j.wheels=[];box(g,M.iron,0,.29,0,.75,.18,1.55);box(g,M.army,0,.49,0,.78,.25,1.38);for(const side of[-1,1])for(const z of(type==='missile'?[-.59,0,.59]:[-.5,.5])){j.wheels.push(c(g,M.black,side*.46,.25,z,.235,.16,0,Math.PI/2));c(g,M.gold,side*.55,.25,z,.115,.035,0,Math.PI/2);box(g,M.army,side*.4,.48,z,.22,.07,.46);}for(const side of[-1,1]){box(g,M.iron,side*.24,.49,.79,.15,.11,.04);box(g,M.window,side*.24,.49,.815,.09,.07,.025);box(g,M.red,side*.24,.43,-.8,.1,.05,.03);}box(g,M.iron,0,.28,.86,.94,.09,.13);for(let i=0;i<7;i++)box(g,M.black,-.23+i*.077,.47,.79,.035,.17,.025);
  if(type==='jeep'){
   box(g,M.army,0,.66,.31,.68,.1,.63);box(g,M.black,0,.58,-.32,.6,.16,.49);box(g,M.glass,0,.92,.03,.6,.33,.035);for(const x of[-.33,.33])for(const z of[.02,-.58])box(g,M.iron,x,.91,z,.035,.64,.035);box(g,M.iron,0,1.22,-.25,.7,.04,.65);c(g,M.black,0,.64,-.84,.22,.12,Math.PI/2);box(g,M.army,.3,.68,-.6,.16,.33,.15);const turret=new T.Group();turret.position.set(0,1.03,-.25);g.add(turret);box(turret,M.iron,0,.13,.14,.1,.11,.61);c(turret,M.black,0,.14,.5,.025,.22,Math.PI/2);j.turret=turret;
  }else{
   const turret=new T.Group();turret.position.set(0,.77,-.1);g.add(turret);j.turret=turret;if(type==='missile'){box(g,M.glass,0,.69,.5,.6,.28,.035);box(turret,M.army,0,0,0,.66,.16,.8);const pod=new T.Group();pod.rotation.x=-.32;turret.add(pod);for(const x of[-.19,.19])for(const y of[.15,.37]){c(pod,M.army,x,y,0,.085,1.15,Math.PI/2);c(pod,M.canvas,x,y,.42,.087,.23,Math.PI/2);part(pod,'cone',M.canvas,x,y,.68,.085,.3,.085,Math.PI/2);}}else{box(turret,M.army,0,0,0,.65,.3,.78);box(turret,M.iron,0,.05,.72,.14,.14,1.18);c(turret,M.gold,0,.23,-.1,.16,.06);box(turret,M.glow,.25,.02,.27,.07,.09,.03);for(const side of[-1,1])box(g,M.black,side*.46,.3,0,.21,.34,1.45);}}
 }else if(type==='helicopter'){
  for(const side of[-1,1]){box(g,M.army,side*.48,.16,-.1,.43,.09,.65);for(const z of[-.27,.03])c(g,M.army,side*.52,.06,z,.095,.65,Math.PI/2);box(g,M.iron,side*.4,-.07,.21,.035,.31,.035);}box(g,M.army,0,.32,-.77,.18,.18,.87);box(g,M.blue,0,.43,-1.07,.045,.42,.3);
 }else if(['gunboat','transport'].includes(type)){
  for(const side of[-1,1]){for(const z of[-.8,-.25,.35,.8])part(g,'ring',M.black,side*.38,.32,z,.1,.1,.1,0,Math.PI/2);box(g,M.glass,side*.27,.8,.13,.04,.19,.29);}c(g,M.iron,0,1.16,-.45,.018,.75);box(g,M.blue,.13,1.4,-.45,.26,.2,.02);box(g,M.army,-.22,.58,-.7,.22,.24,.28);
 }else return;
 g.userData.referenceRevision=14;
}

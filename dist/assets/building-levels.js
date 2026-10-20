// Shared structural progression: same footprint, ten visibly different assemblies.
export function applyBuildingLevel(g,M,type,era,level,size,part){
 const box=(mat,x,y,z,a,b,c,rx=0,ry=0,rz=0)=>part(g,'box',mat,x,y,z,a,b,c,rx,ry,rz),cyl=(mat,x,y,z,r,h)=>part(g,'cylinder',mat,x,y,z,r,h,r),edge=size*.39,metal=era>=12?M.metal:M.wood,structural=era>=12?M.iron:M.stone;
 level=Math.max(1,Math.min(10,Math.floor(level)));const heightScale=.9+level*.025;g.userData.designLevel=level;g.userData.levelFeatures=['Núcleo'];
 if(level>=2){box(M.stone,0,.08,edge,.46,.1,.22);box(M.wood,-edge,.12,edge*.7,.22,.22,.22);g.userData.levelFeatures.push('Acceso');}
 if(level>=3){for(const x of[-edge,edge])for(const z of[-edge,edge]){box(structural,x,.23,z,.13,.42,.13);box(M.stone,x,.05,z,.22,.08,.22);}g.userData.levelFeatures.push('Cimiento');}
 if(level>=4){for(const x of[-.23,.23])box(metal,x,.52,edge,.045,.88,.045);box(era>=12?M.roofdark:M.wood,0,.98,edge-.06,.65,.07,.38);g.userData.levelFeatures.push('Pórtico');}
 const water=['well','cistern','waterworks','sewage'].includes(type),defense=['tower','barracks','bunker','ballista','cannon','antiair','coastal','shield'].includes(type),science=['school','lab','engineering','surveyor','geology','archive'].includes(type),farm=['farm','greenhouse','livestock','fishery','huntinglodge'].includes(type);
 function equipment(x,z,advanced=false){if(water){cyl(era>=12?M.metal:M.stone,x,.3,z,.18,.52);cyl(M.water,x,.57,z,.14,.02);box(metal,x,.25,z+.2,.06,.06,.3);}else if(defense){cyl(structural,x,.52,z,.13,.88);box(M.iron,x,.99,z+.09,.09,.1,advanced?.56:.36);box(M.blue,x,.69,z+.14,.2,.18,.04);}else if(science){box(metal,x,.36,z,.3,.58,.28);part(g,'ring',era>=23?M.glow:M.gold,x,.83,z,.2,.2,.2,Math.PI/2,.25);box(M.cloth,x,.68,z+.18,.24,.025,.22);}else if(farm){box(M.wood,x,.17,z,.33,.3,.33);for(let j=0;j<3;j++)cyl(M.wheat,x-.1+j*.1,.43,z,.03,.27);}else{box(metal,x,.27,z,.32,.48,.32);for(const y of[.17,.38])box(M.iron,x,y,z+.17,.34,.035,.025);if(advanced)cyl(era>=23?M.glow:M.metal,x,.62,z,.13,.14);}}
 if(level>=5){equipment(-edge*.85,edge*.65);g.userData.levelFeatures.push('Especialización');}
 if(level>=6){box(era>=12?M.metal:M.plaster,edge*.72,.5,edge*.18,.52,.88,.56);box(era>=12?M.roofdark:M.roof,edge*.72,.98,edge*.18,.6,.12,.64);box(M.darkwood,edge*.72,.45,edge*.47,.2,.42,.025);g.userData.levelFeatures.push('Servicio');}
 if(level>=7){for(const x of[-edge,edge]){box(structural,x,.47,-edge,.12,.9,.18);box(metal,x,.65,0,.06,.07,size*.72);}g.userData.levelFeatures.push('Refuerzo');}
 if(level>=8){equipment(edge*.75,-edge*.65,true);if(!water&&!farm&&!defense){box(era>=12?M.glass:M.plaster,0,1.55,-edge*.25,.34,.45,.38);box(era>=12?M.metal:M.roof,0,1.82,-edge*.25,.47,.1,.48);}g.userData.levelFeatures.push('Equipo avanzado');}
 if(level>=9){for(const x of[-edge,edge])for(let i=0;i<4;i++)box(metal,x,.34,-edge+i*size*.25,.045,.59,.045);for(const x of[-edge,edge])box(metal,x,.5,0,.04,.055,size*.78);g.userData.levelFeatures.push('Protección');}
 if(level>=10){if(!water&&!farm){cyl(era>=12?M.metal:M.stone,edge*.45,1.37,-edge*.5,.2,.9);box(era>=12?M.glow:M.blue,edge*.45,1.9,-edge*.5,.25,.2,.25);}for(const x of[-.25,.25])box(structural,x,.32,-edge,.16,.57,.18);box(metal,0,.66,-edge,.68,.08,.2);box(M.blue,0,.85,-edge,.25,.33,.035);box(M.gold,0,.85,-edge+.03,.09,.11,.025);g.userData.levelFeatures.push('Maestría');}
 for(const child of g.children){child.position.y*=heightScale;child.scale.y*=heightScale;}
 return g;
}

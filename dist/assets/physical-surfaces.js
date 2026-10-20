import * as T from './vendor/three.module.js';
const loader=new T.TextureLoader(),cache=new Map();
function texture(file,color=false){if(cache.has(file))return cache.get(file);const t=loader.load(new URL('./assets/models/surfaces/'+file,import.meta.url).href);t.userData.shared=true;t.wrapS=t.wrapT=T.RepeatWrapping;t.anisotropy=4;if(color)t.colorSpace=T.SRGBColorSpace;cache.set(file,t);return t;}
export function physicalSurfaces(M){
 for(const[names,kind,roughness]of [[['stone','limestone','cliff'],'UnevenBrick','Roughness'],[['wood','darkwood','cutwood'],'WoodTrim','Roughness'],[['plaster'],'Plaster','ORM'],[['roof','roofdark','roofridge'],'RoundTiles','Roughness']]){
  for(const name of names){const m=M[name];m.map=texture('T_'+kind+'_BaseColor.png',true);m.normalMap=texture('T_'+kind+'_Normal.png');m.normalScale.set(.5,.5);m.roughnessMap=texture('T_'+kind+'_'+roughness+'.png');m.roughness=1;if(name==='darkwood')m.color.set('#806d5b');else if(name==='roofdark'||name==='roofridge')m.color.set('#638e9d');else m.color.set('#ffffff');m.needsUpdate=true;}
 }
 for(const name of ['roofdark','roofridge']){const m=M[name];m.color.set('#ffffff');m.onBeforeCompile=shader=>{shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>','#include <map_fragment>\n float roofValue=dot(diffuseColor.rgb,vec3(.2126,.7152,.0722));diffuseColor.rgb=vec3(.20,.43,.55)*roofValue*1.8;');};m.customProgramCacheKey=()=> 'auralis-blue-tiles-14';}
}

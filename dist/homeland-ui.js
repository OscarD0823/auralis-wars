import * as E from './engine.js';
const titles={909:'Estación espacial',907:'Astillero civil',908:'Puerto avanzado'};
const time=n=>{n=Math.max(0,Math.ceil(n));return String(Math.floor(n/3600)).padStart(2,'0')+':'+String(Math.floor(n%3600/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0');};
const view=s=>{const h=s.homeland,b=s.battle?.kind==='homeland'?s.battle:null;return{h,b,objects:b?b.buildings.filter(v=>v.side!=='player'):E.homeStructures(s),enemies:b?b.units.filter(u=>u.side==='enemy'&&u.hp>0&&!u.roamer):E.homeEnemies(s),roamers:b?b.units.filter(u=>u.side==='enemy'&&u.hp>0&&u.roamer):E.homeRoamers(s),keyTaken:b?.homeState?.keyTaken??h?.keyTaken};};
const button=(action,id,label,disabled=false)=>'<button class="wide" data-action="'+action+'" data-id="'+id+'" '+(disabled?'disabled':'')+'>'+label+'</button>';
export function homelandNotice(s){
 const{h,b,keyTaken}=view(s);if(!h||(s.battle&&!b))return'';if(b?.homeState?.skirmish)return 'Escaramuza · Patrullas del mapa';
 if(h.completed)return h.noSpace?'Siguiente base: necesita un emplazamiento libre':'Próxima base enemiga · '+time(E.homeCountdown(s));
 return h.wave===1?'Rescate · '+(keyTaken?'Libera a los soldados':'Recupera la llave'):'Base enemiga · Oleada '+h.wave;
}
export function homelandPanel(s,hooks){
 const{fmt}=hooks,{h,enemies,objects,roamers}=view(s);if(!h)return'';const defenses=objects.filter(o=>o.hp>0&&o.side==='enemy'&&o.attack>0);
 return'<div class="section-label">ARCHIPIÉLAGO · OLEADA '+h.wave+'</div><p>'+(h.completed?(h.noSpace?'El contador terminó. Los planos disponibles coinciden con edificios tuyos; libera un emplazamiento para permitir la siguiente base.':'Sector asegurado. Próxima base enemiga en <b class="home-countdown">'+time(E.homeCountdown(s))+'</b>. El reloj continúa al cerrar el juego.') :enemies.length+' patrullas y '+defenses.length+' defensas armadas. Reconoce sus entradas, puestos de mando y depósitos antes de atacar.')+'</p><p>'+roamers.length+' enemigos en patrullas independientes recorren sectores desocupados. No cuentan como guardias del rescate.</p>'+button('home-briefing','',h.completed?'Consultar siguiente asentamiento':'Localizar enemigos y revisar objetivos')+(h.pendingSoldiers?'<p>'+h.pendingSoldiers+' soldados rescatados esperan alojamiento.</p>'+button('home-claim','','Incorporar rescatados'):'')+'<div class="home-landmarks">'+objects.filter(b=>b.landmark).map(b=>'<button data-action="home-object" data-id="'+b.id+'">'+titles[b.sourceId]+' <small>'+Math.floor(b.x)+', '+Math.floor(b.y)+'</small></button>').join('')+'</div><p class="tiny">'+fmt(objects.length)+' estructuras y elementos de planos originales. Las instalaciones neutrales se inspeccionan; las academias, depósitos, torres y muros enemigos cumplen funciones militares.</p>';
}
export function homelandBriefing(s,{head,esc}){
 const{h,b,objects,enemies,roamers,keyTaken}=view(s),defenses=objects.filter(o=>o.hp>0&&o.side==='enemy'&&o.attack>0),target=enemies[0]||defenses[0]||objects.find(v=>v.tag==='prison'),key=objects.find(v=>v.tag==='key'),prison=objects.find(v=>v.tag==='prison'),core=objects.find(v=>v.id===h.commandId);
 if(b?.homeState?.skirmish)return head('PATRULLAS DEL ARCHIPIÉLAGO','Escaramuza en territorio abierto')+'<p>Quedan '+roamers.length+' patrulleros. Puedes combatirlos o retirarte; las bajas y el daño persisten. Esta escaramuza no reinicia el contador de la siguiente base.</p>'+(roamers[0]?button('home-focus',esc(roamers[0].id),'Localizar patrulla'):'');
 let out=head('ARCHIPIÉLAGO · OLEADA '+h.wave,h.wave===1?'Libera a los soldados capturados':'Reconoce y ocupa la base enemiga');
 if(h.completed)out+='<p>Sector asegurado. '+(h.noSpace?'Los emplazamientos disponibles están ocupados por edificios tuyos. La siguiente base espera terreno libre.':'La siguiente base aparecerá en <b class="home-countdown">'+time(E.homeCountdown(s))+'</b>, aunque cierres el juego.')+'</p>';
 else{
  out+='<p>Quedan '+enemies.length+' patrullas y '+defenses.length+' defensas armadas. Las pérdidas son permanentes; el daño y la llave se conservan al retirarte.</p>';
  if(h.wave===1){
   out+='<ol><li>Derrota a los guardias de la llave y lleva una tropa hasta ella.</li><li>Recupera la llave. Neutraliza las patrullas y las torretas de la prisión.</li><li>Acerca una tropa a la prisión y libera a los cuatro soldados.</li></ol>';
   if(key&&!keyTaken)out+=button('home-focus',esc(key.id),'Localizar la llave')+button('home-interact',esc(key.id),'Recuperar la llave',!b);
   if(prison)out+=button('home-focus',esc(prison.id),'Localizar la prisión')+button('home-interact',esc(prison.id),'Liberar a los soldados',!b||!keyTaken||!E.homeCombatClear(b));
  }else{out+='<p>Neutraliza las tropas y defensas. Destruye el puesto de mando o acércate para ocuparlo cuando no queden defensores. La nueva oleada llegará tres horas después.</p>';if(core)out+=button('home-focus',esc(core.id),'Localizar el mando')+button('home-interact',esc(core.id),'Ocupar el mando',!b||!E.homeCombatClear(b));}
  if(target)out+=button('home-focus',esc(target.id),'Centrar primer objetivo');
  if(!b)out+='<button class="primary wide" data-action="home-battle" '+(!s.army.length?'disabled':'')+'>Iniciar operación en el archipiélago</button>';
  out+='<p class="tiny">La IA patrulla, concentra fuego, busca flancos y se repliega hacia sus defensas. Las academias sólo refuerzan con reservas y logística operativas. Cada victoria tiene un premio único.</p>';
 }
 if(!b&&h.completed&&roamers.length)out+='<p>'+roamers.length+' patrulleros siguen recorriendo otras zonas del mapa.</p><button class="wide" data-action="home-battle">Combatir patrullas del mapa</button>';
 if(h.pendingSoldiers)out+='<p>'+h.pendingSoldiers+' soldados esperan espacio en las viviendas; conservan su plaza de rescate hasta que puedas alojarlos.</p>'+button('home-claim','','Incorporar soldados rescatados');
 return out;
}
export function homelandObject(s,id,{head,esc,img,fmt}){
 const o=E.homeObject(s,id);if(!o)return head('ARCHIPIÉLAGO','Objeto no disponible.');const name=titles[o.sourceId]||E.BUILDINGS[o.type]?.name||E.UNITS[o.type]?.name;
 const purpose={defense:'Cubre los accesos con fuego. Los soldados pueden replegarse hacia su cobertura.',barracks:'Academia militar: puede entrenar refuerzos mientras haya mando, logística y reservas. Destruirla corta esa salida.',logistics:'Depósito o productor que sostiene las reservas de la base. Destruir la logística impide nuevos refuerzos.',wall:'Protege edificios y canaliza el avance hacia las entradas. Destruir un tramo abre una ruta.',resource:'Recurso del escenario preservado.',infrastructure:'Infraestructura del asentamiento preservado.'};
 let out=head(o.side==='enemy'?'PRESENCIA ENEMIGA':'ESTRUCTURA DEL ESCENARIO',esc(name))+img(o.type,o.level,!!E.UNITS[o.type],'hero-image')+'<p>Posición '+Math.floor(o.x)+', '+Math.floor(o.y)+' · integridad '+fmt(o.hp)+' / '+fmt(o.maxHp)+'.</p><p>'+(o.landmark?'Instalación neutral en su emplazamiento original. Conserva los apoyos costeros y no pertenece a la producción de tu base.':o.tag==='prison'&&s.homeland.wave===1?'Prisión: necesita la llave, defensores neutralizados y una tropa a menos de seis casillas para liberar a los soldados.':o.tag==='key'?'Llave de la prisión: neutraliza a sus guardias y acércate con una tropa.':purpose[o.purpose]||'Patrulla que protege su sector y responde a las incursiones.')+'</p>'+button('home-focus',esc(id),'Centrar en el mapa');
 if(s.battle?.kind==='homeland'&&((s.homeland.wave===1&&(o.tag==='key'||o.tag==='prison'))||o.id===s.homeland.commandId))out+=button('home-interact',esc(id),o.tag==='key'?'Recuperar la llave':o.tag==='prison'?'Liberar soldados':'Ocupar el mando');
 else if(o.side==='enemy'&&(!s.homeland.completed||o.roamer)&&!s.battle)out+='<button class="primary wide" data-action="home-battle" '+(!s.army.length?'disabled':'')+'>Iniciar operación en el archipiélago</button>';
 return out;
}

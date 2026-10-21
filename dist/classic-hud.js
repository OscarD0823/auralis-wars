import {UNITS,unitLevel} from './engine.js';

export const hudGraphic = (name, cls = '') => '<img class="hud-art '+cls+'" src="./interface/'+name+'.png" alt="" aria-hidden="true" draggable="false">';

// The original neighbour strip is reserved for a future multiplayer release.
// These portraits operate on the real, local garrison instead of simulated friends.
export function garrisonRoster(state, selected, {img,esc}) {
 const groups = new Map();
 for (const unit of state.army) if (unit.hp > 0) {
  if (!groups.has(unit.type)) groups.set(unit.type, []);
  groups.get(unit.type).push(unit);
 }
 return '<div class="roster-title"><strong>Guarnición</strong><button data-action="home-select-all">Seleccionar todas</button></div><div class="roster-cards">'+
  [...groups].map(([type,units]) => {
   const active=units.every(u=>selected.includes(u.id)),level=unitLevel(state,type);
   return '<button class="roster-card '+(active?'selected':'')+'" data-action="roster-select" data-type="'+type+'" aria-pressed="'+active+'" aria-label="Seleccionar '+units.length+' '+esc(UNITS[type].name)+'"><span class="roster-name">'+esc(UNITS[type].name)+'</span>'+img(type,level,true)+'<span class="roster-rank">'+hudGraphic('rank')+'<b>'+level+'</b></span><strong class="roster-count">×'+units.length+'</strong></button>';
  }).join('')+(groups.size?'':'<p class="roster-empty">Sin tropas en la base. Entrena unidades en Ejército.</p>')+'</div>';
}

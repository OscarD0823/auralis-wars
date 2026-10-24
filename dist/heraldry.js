// Native vector heraldry: legible silhouettes at HUD size and engraved detail
// at inspection size. Clan symbols are distinct within the same civilization.
export const RACE_HERALDRY={
 aurora:{name:'Humanos de Aurora',field:'#214e69',light:'#6098ad',metal:'#e8c36f',symbol:'compass'},
 kharun:{name:'Kharun',field:'#503c32',light:'#a46b42',metal:'#e4a75c',symbol:'mountain'},
 nebari:{name:'Nébari',field:'#115555',light:'#52b6a7',metal:'#dbce91',symbol:'tide'},
 arca:{name:'Autómatas de Arca',field:'#343047',light:'#8c78b7',metal:'#c7d6df',symbol:'core'}
};
export const FACTION_HERALDRY={
 faro:{name:'Cartógrafos del Faro',race:'aurora',symbol:'lighthouse',motto:'Exploración y orientación'},
 liga:{name:'Liga del Horizonte',race:'aurora',symbol:'sail',motto:'Rutas y comercio'},
 risco:{name:'Clan Risco Férreo',race:'kharun',symbol:'hammer',motto:'Piedra y defensa'},
 ceniza:{name:'Forja de Ceniza',race:'kharun',symbol:'forge',motto:'Fuego e industria'},
 coral:{name:'Pacto del Coral',race:'nebari',symbol:'coral',motto:'Diplomacia de la marea'},
 estuario:{name:'Guardia del Estuario',race:'nebari',symbol:'anchor',motto:'Puertos y protección'},
 prisma:{name:'Custodios del Prisma',race:'arca',symbol:'prism',motto:'Conocimiento y energía'},
 vector:{name:'Orden Vector',race:'arca',symbol:'vector',motto:'Precisión y estrategia'}
};
export function factionEmblem(id){return Object.hasOwn(FACTION_HERALDRY,id)?'./auralis/factions/'+id+'.svg':'./auralis/icons/diplomacy.svg';}
export function heraldryPanel({head,esc}){return head('OCHO CLANES · CUATRO CIVILIZACIONES','Emblemas de las facciones')+'<p>Cada clan tiene su propio escudo. El símbolo identifica su origen; la relación diplomática se muestra por separado como Neutral, Alianza o Guerra.</p><div class="heraldry-gallery">'+Object.entries(FACTION_HERALDRY).map(([id,f])=>'<article><img src="'+factionEmblem(id)+'" alt="Emblema de '+esc(f.name)+'" width="128" height="144"><small>'+esc(RACE_HERALDRY[f.race].name)+'</small><h3>'+esc(f.name)+'</h3><p>'+esc(f.motto)+'</p></article>').join('')+'</div><button class="wide" data-action="diplomacy">Volver a civilización y diplomacia</button>';}
const marks={
 compass:'<path d="m64 29 9 27 26 10-26 9-9 28-10-28-26-9 26-10Z"/><path d="m64 42-1 23 21 1-20 9-1 14-7-19-15-4 18-7Z" fill="#fff3bc"/><circle cx="64" cy="66" r="7" fill="url(#field)"/>',
 mountain:'<path d="m24 87 20-39 16 19 17-35 28 55Z"/><path d="m64 59 13-27 14 29-13-8-6 12Z" fill="#fff0c3"/><path d="m29 87 18-23 11 15 12-8 24 16Z" fill="#5b3e31"/><path d="M39 96h50" fill="none" stroke="url(#metal)" stroke-width="5"/>',
 tide:'<path d="M22 62q16-24 34 0t36 0l14-12v19q-18 27-37 1T34 74L22 83Z"/><path d="M28 91q16-16 33 0t35 0" fill="none" stroke="url(#metal)" stroke-width="6" stroke-linecap="round"/><path d="m64 28 11 16-11 13-11-13Z" fill="#b2ede0"/>',
 core:'<path d="m64 29 29 17v34L64 98 35 80V46Z"/><path d="m64 39 19 12v24L64 87 45 75V51Z" fill="#66528b"/><path d="m64 49 11 8v15l-11 7-11-7V57Z" fill="#98e9e8"/><path d="M22 52h9m-9 24h9m66-24h9m-9 24h9" fill="none" stroke="url(#metal)" stroke-width="4"/>',
 lighthouse:'<path d="m52 46-5 47h34l-5-47ZM48 38h32v10H48Zm7-12h18v12H55Z"/><path d="M64 53v13m0 12v13" fill="none" stroke="#355b6c" stroke-width="7"/><path d="m23 43 21-6m40 0 21 6M24 30l20 5m40 0 20-5" fill="none" stroke="url(#metal)" stroke-width="4"/><path d="M25 103q12-11 25 0t26 0t26 0" fill="none" stroke="#a0d5db" stroke-width="4"/>',
 sail:'<path d="M62 28v65M60 32 29 77h31Zm8 8 28 37H68ZM27 86h74l-16 20H45Z"/><path d="M38 94h51" fill="none" stroke="#314e60" stroke-width="4"/><circle cx="94" cy="34" r="8" fill="none" stroke="url(#metal)" stroke-width="3"/>',
 hammer:'<path d="m38 40 15-14 38 27-15 17Z"/><path d="m68 60 10 8-31 40-11-8Z"/><path d="m22 89 13-27 13 17 9-12 15 22Z" fill="#b48758"/><path d="m44 38 8-7 30 23-7 8Z" fill="#fff0b9"/>',
 forge:'<path d="M29 78h72L88 91H72v12H48V91H39ZM23 70h84v9H23Z"/><path d="M47 61c-10-16 16-24 11-43 23 17 13 27 23 31 8-7 5-13 5-13 20 19 7 35-10 35H59Z" fill="#efab4e"/><path d="M60 63c-6-9 9-14 8-24 13 11 0 14 8 22l-5 9H60Z" fill="#fff0af"/>',
 coral:'<path d="M59 107V63L42 52V33h8v14l11 8V25h8v39l15-13V36h8v20L70 76v31Z"/><path d="m41 55-15-8V31h7v12l15 7Zm46 8 16-11V37h-7v12l-14 9Z" fill="#c68d74"/><path d="M30 99q15-11 30 0t35 0" fill="none" stroke="#98ded0" stroke-width="4"/>',
 anchor:'<circle cx="64" cy="33" r="10" fill="none" stroke="url(#metal)" stroke-width="7"/><path d="M60 43h8v45c15-3 20-9 21-20l-12 4 9-17 18 9-10 2c0 22-14 32-30 37-17-5-31-15-31-37l-10-2 18-9 10 17-13-4c1 11 6 17 22 20ZM42 50h44v7H42Z"/>',
 prism:'<path d="m64 24 28 29-10 41-18 15-18-15-10-41Z"/><path d="m64 32-15 23 15 43 14-43Z" fill="#a8d7ed"/><path d="m49 55 15-23v66Z" fill="#a187cb"/><path d="M25 45h9m60 0h9M23 80h12m58 0h12" fill="none" stroke="url(#metal)" stroke-width="3"/>',
 vector:'<path d="m64 25 33 66-33-17-33 17Z"/><path d="m64 44 14 30-14-8-14 8Z" fill="#8c7ab2"/><path d="M64 82v24M24 53h12m56 0h12" fill="none" stroke="#a7e6e7" stroke-width="4"/><circle cx="64" cy="112" r="4" fill="#a7e6e7"/>'
};
export function emblemSvg(id,clan=false){
 const entry=(clan?FACTION_HERALDRY:RACE_HERALDRY)[id];if(!entry)throw Error('Emblema desconocido: '+id);
 const race=clan?RACE_HERALDRY[entry.race]:entry;
 return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 144" role="img" aria-labelledby="title desc"><title id="title">'+entry.name+'</title><desc id="desc">'+(entry.motto||'Emblema de civilización')+'</desc><defs><linearGradient id="rim" x2=".8" y2="1"><stop stop-color="#f9e8af"/><stop offset=".25" stop-color="'+race.metal+'"/><stop offset=".55" stop-color="#79552f"/><stop offset=".8" stop-color="'+race.metal+'"/><stop offset="1" stop-color="#554837"/></linearGradient><linearGradient id="field" x2=".7" y2="1"><stop stop-color="'+race.light+'"/><stop offset=".55" stop-color="'+race.field+'"/><stop offset="1" stop-color="#182d35"/></linearGradient><linearGradient id="metal" x2=".8" y2="1"><stop stop-color="#fff0bf"/><stop offset=".5" stop-color="'+race.metal+'"/><stop offset="1" stop-color="#af7a42"/></linearGradient></defs><path d="M64 8 115 25v52c0 28-28 47-51 58C41 124 13 105 13 77V25Z" fill="#101f29" opacity=".35" transform="translate(0 4)"/><path d="M64 6 116 23v53c0 29-29 49-52 60C41 125 12 105 12 76V23Z" fill="url(#rim)" stroke="#4b4535" stroke-width="2"/><path d="M64 15 108 30v45c0 24-24 42-44 52-20-10-44-28-44-52V30Z" fill="url(#field)" stroke="#d2ba79" stroke-width="1.5"/><path d="M24 34v40c0 12 7 26 20 36" fill="none" stroke="#ffffff" opacity=".18" stroke-width="2"/><path d="m31 29 33-11 33 11" fill="none" stroke="#fff4ca" opacity=".55"/><g fill="url(#metal)" stroke="#132c37" stroke-width="1.4" stroke-linejoin="round">'+marks[entry.symbol]+'</g><g fill="#f7ddb0" stroke="#6e593e" stroke-width="1"><circle cx="18" cy="28" r="2.4"/><circle cx="110" cy="28" r="2.4"/><circle cx="18" cy="73" r="2.4"/><circle cx="110" cy="73" r="2.4"/><path d="m64 120 4 4-4 5-4-5Z"/></g></svg>';
}

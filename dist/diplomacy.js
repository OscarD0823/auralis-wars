export const RACES={
 aurora:{name:'Humanos de Aurora',title:'La palabra y el comercio',description:'Colonias de exploradores, ingenieros y comerciantes.',bonus:'Los tratos con NPC entregan un 10% más de materiales.',color:'#237c97',symbol:'compass'},
 kharun:{name:'Kharun',title:'Los clanes de piedra',description:'Habitantes de riscos y forjas, organizados en linajes.',bonus:'Los obreros extraen roca y minerales un 20% más rápido.',color:'#bd813d',symbol:'mountain'},
 nebari:{name:'Nébari',title:'Navegantes de la marea',description:'Pueblos anfibios que enlazan islas y estuarios.',bonus:'Los transportes marítimos tardan un 20% menos.',color:'#36a99e',symbol:'wave'},
 arca:{name:'Autómatas de Arca',title:'Los custodios del núcleo',description:'Comunidades sintéticas con memoria y voluntad propias.',bonus:'El entrenamiento de tropas tarda un 10% menos.',color:'#897ac0',symbol:'core'}
};
export const FACTIONS=[
 {id:'faro',name:'Cartógrafos del Faro',race:'aurora',clan:'Hermandad del Faro',temper:'Exploradores',need:'wood',give:'gold'},
 {id:'liga',name:'Liga del Horizonte',race:'aurora',clan:'Gremio de los siete puertos',temper:'Mercantes',need:'metal',give:'supply'},
 {id:'risco',name:'Clan Risco Férreo',race:'kharun',clan:'Linaje de la montaña',temper:'Guardianes',need:'supply',give:'metal'},
 {id:'ceniza',name:'Forja de Ceniza',race:'kharun',clan:'Clan del crisol',temper:'Expansionistas',need:'wood',give:'metal'},
 {id:'coral',name:'Pacto del Coral',race:'nebari',clan:'Casas de la marea',temper:'Diplomáticos',need:'metal',give:'wood'},
 {id:'estuario',name:'Guardia del Estuario',race:'nebari',clan:'Flota del arrecife',temper:'Navales',need:'gold',give:'supply'},
 {id:'prisma',name:'Custodios del Prisma',race:'arca',clan:'Círculo del núcleo',temper:'Investigadores',need:'supply',give:'gold'},
 {id:'vector',name:'Orden Vector',race:'arca',clan:'Cohorte del vector',temper:'Militares',need:'gold',give:'metal'}
];
export const factionById=id=>FACTIONS.find(f=>f.id===id);
export const factionForSeed=seed=>FACTIONS[(((seed>>>0)^((seed>>>0)>>>16))>>>0)%FACTIONS.length];
export const civilization=s=>s.civilization??={version:1,race:null,morality:0,relations:{},decisions:[],judged:[],history:[]};
export const raceBonus=(s,kind)=>civilization(s).race===({mining:'kharun',sea:'nebari',training:'arca',trade:'aurora'}[kind])?({mining:1.2,sea:.8,training:.9,trade:1.1}[kind]):1;
export const relation=(s,id)=>civilization(s).relations[id]||null;
export const atWar=(s,id)=>!!id&&relation(s,id)?.status==='war';
export const allied=(s,id)=>!!id&&relation(s,id)?.status==='ally';
export const honorName=s=>civilization(s).morality>=25?'Cooperativo':civilization(s).morality<=-25?'Temido':'Pragmático';
export const warPressure=s=>1+Math.min(4,Object.values(civilization(s).relations).filter(r=>r.status==='war').length)*.12;
export function contactFaction(s,id){
 const c=civilization(s),f=factionById(id);if(!f)return null;
 return c.relations[id]??={status:'neutral',reputation:f.race===c.race?10:0,tradeAt:0,aidAt:0,truceUntil:0};
}
function history(s,message){const c=civilization(s);c.history.unshift({time:s.time,message});c.history.length=Math.min(20,c.history.length);}
export function changeHonor(s,amount,message){const c=civilization(s);if(!c.race)return;c.morality=Math.max(-100,Math.min(100,c.morality+amount));if(message)history(s,message);}
export function tradeQuote(s,id){
 const f=factionById(id),r=relation(s,id),amount=Math.round(150*raceBonus(s,'trade'));
 let message=!f||!r?'Explora una isla para conocer a este clan.':r.status==='war'?'No hay comercio durante la guerra.':s.battle?'Regresa a tu base para negociar.':s.time<r.tradeAt?'Espera a que vuelva la caravana.':'';
 return{ok:!message,message,cost:f?{[f.need]:100}:{},reward:f?{[f.give]:amount}:{},remaining:r?Math.max(0,r.tradeAt-s.time):0};
}
export function createDiplomacy({affordable,pay,storageCap,log}){
 const good=message=>({ok:true,message}),bad=message=>({ok:false,message});
 function choose(s,race){const c=civilization(s);if(c.race||!Object.hasOwn(RACES,race)||s.battle)return bad('Elige una raza una sola vez desde tu base.');c.race=race;for(const f of FACTIONS.filter(f=>f.race===race||f.id==='faro'))contactFaction(s,f.id);
  // Older discovered islands keep their exact coast and their existing military risk.
  if(s.frontier?.target){const t=s.frontier.target;t.faction??=factionForSeed(t.seed).id;contactFaction(s,t.faction);}
  for(const colony of s.frontier?.colonies||[]){const t=colony.target;if(!t.faction){t.faction=factionForSeed(t.seed).id;const r=contactFaction(s,t.faction);r.status='war';r.reputation=-20;}}
  history(s,'Fundación: '+RACES[race].name+'.');log(s,'Tu civilización: '+RACES[race].name+'. '+RACES[race].bonus);return good('Civilización elegida. Tus edificios y tropas se conservan.');}
 function act(s,id,action){
  const c=civilization(s),f=factionById(id),r=relation(s,id);if(!c.race||!f||!r||s.battle)return bad('Elige tu civilización, conoce al clan y regresa a tu base.');
  if(action==='trade'){
   const q=tradeQuote(s,id);if(!q.ok)return bad(q.message);if(!affordable(s,q.cost))return bad('Reúne los materiales del trato.');if(Object.entries(q.reward).some(([k,v])=>s.resources[k]+v>storageCap(s)))return bad('Haz espacio en el almacén antes de aceptar el trato.');pay(s,q.cost);for(const[k,v]of Object.entries(q.reward))s.resources[k]+=v;r.tradeAt=s.time+300;r.reputation=Math.min(100,r.reputation+6);history(s,'Trato cumplido con '+f.name+'.');return good('Trato cumplido. Reputación +6. La caravana vuelve en cinco minutos.');
  }
  if(action==='aid'){
   if(r.status==='war'||s.time<r.aidAt)return bad('La ayuda requiere paz y una caravana disponible.');const cost={wood:60,supply:40};if(!affordable(s,cost))return bad('Necesitas 60 madera y 40 petróleo para ayudar.');pay(s,cost);r.aidAt=s.time+600;r.reputation=Math.min(100,r.reputation+12);changeHonor(s,3,'Ayuda humanitaria a '+f.name+'.');return good('Ayuda entregada. Reputación +12 y moralidad +3.');
  }
  if(action==='ally'){
   if(r.status!=='neutral'||r.reputation<20||c.morality<-40)return bad('Una alianza necesita paz, reputación 20 y moralidad de al menos −40.');if(!s.buildings.some(b=>b.type==='embassy'&&b.hp>0&&!b.job))return bad('Construye un centro diplomático para firmar alianzas.');if(!affordable(s,{gold:100}))return bad('El tratado necesita 100 oro.');pay(s,{gold:100});r.status='ally';changeHonor(s,5,'Alianza firmada con '+f.name+'.');return good('Alianza firmada. Puedes establecer un puesto por acuerdo en sus islas.');
  }
  if(action==='war'){
   if(r.status==='war')return bad('Ya estáis en guerra.');if(s.time<r.truceUntil)return bad('Respeta la tregua antes de declarar otra guerra.');const betrayal=r.status==='ally';r.status='war';r.reputation=Math.max(-100,r.reputation-(betrayal?50:20));changeHonor(s,betrayal?-20:-6,(betrayal?'Alianza traicionada: ':'Guerra declarada a ')+f.name+'.');for(const other of Object.values(c.relations))if(other!==r&&betrayal)other.reputation=Math.max(-100,other.reputation-5);return good(betrayal?'La traición perjudicó tu reputación con todos los clanes conocidos.':'Guerra declarada. Sus territorios pueden atacarse; la presión enemiga aumenta.');
  }
  if(action==='peace'){
   if(r.status!=='war')return bad('No hay una guerra que detener.');const cost={gold:200,supply:100};if(!affordable(s,cost))return bad('La reparación de guerra necesita 200 oro y 100 petróleo.');pay(s,cost);r.status='neutral';r.reputation=Math.max(-10,r.reputation);r.truceUntil=s.time+600;changeHonor(s,2,'Tregua negociada con '+f.name+'.');return good('Tregua de diez minutos. Los tratos vuelven a estar disponibles.');
  }
  return bad('Acuerdo desconocido.');
 }
 function settleDecision(s,id,choice){
  const c=civilization(s),i=c.decisions.findIndex(d=>d.id===id),d=c.decisions[i];if(!d||s.battle||!['protect','plunder'].includes(choice))return bad('Esta decisión no está disponible.');
  const r=contactFaction(s,d.faction),f=factionById(d.faction),amount=100+d.level*50;
  if(choice==='plunder'&&s.resources.gold+amount>storageCap(s))return bad('El botín no cabe. La decisión se conserva.');
  c.decisions.splice(i,1);
  if(choice==='protect'){r.reputation=Math.min(100,r.reputation+10);changeHonor(s,6,'Protegiste a los civiles de '+f.name+'.');}
  else{s.resources.gold+=amount;r.reputation=Math.max(-100,r.reputation-15);changeHonor(s,-10,'Requisaste las reservas civiles de '+f.name+'.');}
  return good(choice==='protect'?'Civiles protegidos. Moralidad +6 y reputación +10.':'Reservas requisadas. Moralidad −10 y reputación −15.');
 }
 function actRace(s,race,action){
  const c=civilization(s),list=FACTIONS.filter(f=>f.race===race);if(!c.race||!Object.hasOwn(RACES,race)||s.battle||!['war','ally'].includes(action)||!list.some(f=>relation(s,f.id)))return bad('Conoce primero a un clan de esta raza y regresa a tu base.');
  if(action==='war'&&list.some(f=>(relation(s,f.id)?.truceUntil||0)>s.time))return bad('Hay una tregua vigente con uno de sus clanes.');
  if(action==='ally'&&(list.some(f=>!relation(s,f.id)||relation(s,f.id).status!=='neutral'||relation(s,f.id).reputation<20)||c.morality<-40||!s.buildings.some(b=>b.type==='embassy'&&b.hp>0&&!b.job)||!affordable(s,{gold:list.length*100})))return bad('Ambos clanes deben conocerte, estar en paz y tener reputación 20. Necesitas centro diplomático y 200 oro.');
  for(const f of list){contactFaction(s,f.id);if(action==='war'&&atWar(s,f.id))continue;const r=act(s,f.id,action);if(!r.ok)return r;}
  return good((action==='war'?'Guerra declarada a los dos clanes de ':'Alianza firmada con los dos clanes de ')+RACES[race].name+'.');
 }
 return{choose,act,actRace,settleDecision};
}
export function diplomacyBattleResult(s,b,victory){
 const c=civilization(s),t=b.expedition?.target;if(!c.race||!victory||!t?.faction||c.judged.includes(t.id)||c.judged.length>=4096)return;
 // At most eight unresolved dilemmas, never an unbounded reward queue.
 if(c.decisions.length>=8)return;
 c.decisions.push({id:t.id,faction:t.faction,level:t.level,name:t.name});c.judged.push(t.id);history(s,'Decisión de '+t.id);
}
export function validateCivilization(s){
 if(s.civilization===undefined){civilization(s);return;}
 const c=s.civilization,finite=n=>Number.isFinite(n)&&n>=0&&n<=1e12;
 if(!c||c.version!==1||(c.race!==null&&!Object.hasOwn(RACES,c.race))||!Number.isInteger(c.morality)||c.morality<-100||c.morality>100||!c.relations||typeof c.relations!=='object'||Array.isArray(c.relations)||Object.keys(c.relations).length>8||!Array.isArray(c.decisions)||c.decisions.length>8||!Array.isArray(c.judged)||c.judged.length>4096||new Set(c.judged).size!==c.judged.length||c.judged.some(id=>typeof id!=='string'||!/^island-\d{1,10}$/.test(id))||!Array.isArray(c.history)||c.history.length>20)throw Error('Civilización o diplomacia no válidas.');
 for(const[id,r]of Object.entries(c.relations))if(!factionById(id)||!r||!['neutral','ally','war'].includes(r.status)||!Number.isInteger(r.reputation)||r.reputation<-100||r.reputation>100||![r.tradeAt,r.aidAt,r.truceUntil].every(finite))throw Error('Relación diplomática no válida.');
 const ids=new Set();for(const d of c.decisions)if(!d||typeof d.id!=='string'||!/^island-\d{1,10}$/.test(d.id)||ids.has(d.id)||!c.judged.includes(d.id)||!factionById(d.faction)||!Number.isInteger(d.level)||d.level<1||d.level>10||typeof d.name!=='string'||d.name.length>100)throw Error('Decisión moral no válida.');else ids.add(d.id);
 for(const h of c.history)if(!h||!finite(h.time)||h.time>s.time||typeof h.message!=='string'||h.message.length>300)throw Error('Historia diplomática no válida.');
}

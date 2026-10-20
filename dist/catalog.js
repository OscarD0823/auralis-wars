import {GAME} from './config.js';
export const MODERN=GAME.theme==='wars';
export const MAX_LEVEL=10,SIZE=32,RESOURCE_KEYS=['gold','wood','supply','metal'];
const b=(id,names,kind,model,hq,cost,extra={})=>({id,name:names[MODERN?0:1],kind,model:MODERN?(Array.isArray(model)?model[0]:model):(Array.isArray(model)?model[1]:model),hq,cost,size:2,limit:3,hp:800,time:18,...extra});
export const BUILDINGS=Object.fromEntries([
 b('hq',['Centro de mando','Castillo real'],'command','camp',1,{gold:550,wood:400,metal:120},{size:3,limit:1,hp:2400,time:75,description:'Dirige la base. Cada nivel habilita edificios, mejoras y nuevas unidades.'}),
 b('house',['Residencia militar','Casa de colonos'],'economy','house',1,{gold:90,wood:75},{hp:420,time:12,resource:'gold',rate:.45,capacity:75,population:10,limit:8,description:'Genera impuestos y aumenta la capacidad del ejército.'}),
 b('goldmine',['Mina de oro','Mina de oro'],'production','mine',1,{gold:90,wood:100},{resource:'gold',rate:1.4,capacity:180,description:'Extrae oro. Recoge su producción antes de que se llene.'}),
 b('lumber',['Aserradero','Aserradero'],'production','refinery',1,{gold:100,wood:70},{resource:'wood',rate:1.25,capacity:160,description:'Procesa madera para construir y reforzar la base.'}),
 b('supply',['Pozo petrolero','Granja'],'production',['reactor','farm'],1,{gold:120,wood:100},{resource:'supply',rate:1.1,capacity:140,description:MODERN?'Extrae combustible para vehículos, aeronaves y entrenamiento.':'Produce alimentos para entrenar soldados y criaturas.'}),
 b('metal',['Fundición de acero','Cantera'],'production',['refinery','mine'],2,{gold:220,wood:140},{resource:'metal',rate:.75,capacity:120,description:MODERN?'Funde acero para blindados, defensas y mejoras.':'Extrae piedra para fortificaciones, armas de asedio y mejoras.'}),
 b('storage',['Almacén logístico','Gran almacén'],'economy','depot',1,{gold:180,wood:150},{hp:1000,storage:2600,limit:4,description:'Amplía la capacidad de tus cuatro recursos. La producción espera cuando está lleno.'}),
 b('infantry',['Cuartel','Cuartel'],'military','barracks',1,{gold:200,wood:150},{hp:1000,queue:true,description:'Entrena infantería. Sus niveles habilitan soldados más especializados.'}),
 b('range',['Academia táctica','Campo de arqueros'],'military',['barracks','barracks'],2,{gold:290,wood:220,supply:80},{hp:900,queue:true,description:'Forma tiradores y especialistas de apoyo a distancia.'}),
 b('vehicle',['Fábrica de vehículos','Establos reales'],'military',['garage','barracks'],3,{gold:480,wood:250,metal:160},{hp:1200,queue:true,time:30,description:MODERN?'Construye jeeps, blindados, artillería y plataformas de misiles.':'Cría monturas, entrena caballeros y prepara máquinas de asedio.'}),
 b('air',['Hangar','Santuario de criaturas'],'military',['airfield','lab'],5,{gold:800,wood:350,supply:300,metal:250},{hp:1300,queue:true,time:40,description:MODERN?'Ensambla helicópteros, drones y aeronaves avanzadas.':'Invoca criaturas voladoras, dragones y guardianes antiguos.'}),
 b('research',['Laboratorio','Torre de sabiduría'],'science','lab',3,{gold:400,wood:230,metal:120},{hp:1000,limit:1,time:30,description:'Investiga mejoras permanentes para cada tipo de tropa, hasta cinco grados.'}),
 b('tower',['Torre de vigilancia','Torre de arqueros'],'defense','tower',1,{gold:160,wood:120},{size:1,hp:750,attack:18,range:6,interval:1.25,air:true,limit:8,description:'Dispara automáticamente a enemigos terrestres y aéreos a su alcance.'}),
 b('cannon',['Batería de misiles','Torre de balistas'],'defense',['tower','tower'],3,{gold:350,wood:140,metal:160},{size:1,hp:1000,attack:42,range:7,interval:2.4,splash:1.2,limit:5,description:'Ataques pesados de área. Refuerza accesos y protege los edificios productores.'}),
 b('wall',['Muro de hormigón','Muralla de piedra'],'defense','wall',1,{gold:30,wood:10,metal:12},{size:1,hp:900,limit:80,time:5,description:'Bloquea el avance enemigo. Construye un perímetro dejando accesos para tus tropas.'}),
 b('hospital',['Hospital de campaña','Casa de sanadores'],'support',['hospital','house'],2,{gold:230,wood:150,supply:100},{hp:800,limit:2,description:'Recupera gradualmente la vida de los soldados que sobreviven y regresan a la base.'}),
 b('embassy',['Centro diplomático','Embajada'],'support','embassy',4,{gold:450,wood:270,metal:120},{limit:1,hp:1000,description:'Permite pactos con facciones de IA. Cumple sus encargos para recibir suministros.'}),
 b('builders',['Taller de ingenieros','Gremio de constructores'],'support',['garage','house'],2,{gold:320,wood:220},{limit:2,hp:700,description:'Añade un constructor a las dos cuadrillas iniciales para realizar obras en paralelo.'})
].map(x=>[x.id,x]));
const u=(id,name,factory,hq,model,cost,hp,damage,range,speed,pop,extra={})=>({id,name,factory,hq,model,cost,hp,damage,range,speed,pop,time:10+hq*3,interval:1.1,required:Math.ceil(hq/2),weapon:MODERN?'gun':'arrow',...extra});
const military=[
 u('rifle','Fusilero','infantry',1,'ranger',{gold:45,supply:25},160,20,4.5,1.5,1),
 u('assault','Soldado de asalto','infantry',2,'ranger',{gold:80,supply:50},240,27,3.8,1.7,2),
 u('grenadier','Granadero','infantry',3,'ranger',{gold:110,supply:70},220,42,4,1.35,2,{splash:1.15,interval:1.8}),
 u('engineer','Zapador','infantry',4,'engineer',{gold:130,supply:60,metal:30},210,32,2.1,1.5,2,{siege:2.6}),
 u('commando','Comando','infantry',6,'ranger',{gold:210,supply:140,metal:60},390,61,4.5,1.9,3),
 u('exosoldier','Soldado exoesqueleto','infantry',9,'guardian',{gold:420,supply:240,metal:200},1100,92,4,1.3,5,{heavy:true,armor:12}),
 u('scout','Explorador','range',2,'ranger',{gold:70,supply:40},140,20,5.5,2.4,1),
 u('sniper','Francotirador','range',3,'ranger',{gold:130,supply:80},160,95,8.5,1.2,2,{interval:2.6}),
 u('medic','Médico','range',3,'medic',{gold:120,supply:90},180,0,5,1.5,2,{heal:22}),
 u('rocket','Antitanques','range',5,'ranger',{gold:220,supply:130,metal:80},240,100,6,1.25,3,{vsHeavy:2,interval:2.2,weapon:'rocket'}),
 u('jeep','Jeep de ametralladora','vehicle',3,'jeep',{gold:200,supply:160,metal:75},650,38,5.5,2.25,3,{heavy:true}),
 u('rocketjeep','Jeep lanzacohetes','vehicle',4,'missile',{gold:300,supply:190,metal:120},700,105,6.5,2.05,4,{splash:1.2,interval:2.5,weapon:'rocket',heavy:true}),
 u('tank','Tanque de combate','vehicle',5,'bulwark',{gold:350,supply:230,metal:180},1500,130,5.5,1.05,5,{heavy:true,armor:10,interval:2}),
 u('artillery','Obús autopropulsado','vehicle',6,'bulwark',{gold:420,supply:260,metal:220},900,185,9, .85,5,{heavy:true,splash:1.8,interval:3.8,siege:1.5,weapon:'rocket'}),
 u('siegetank','Tanque de asedio','vehicle',7,'bulwark',{gold:600,supply:320,metal:330},2200,175,6, .8,7,{heavy:true,armor:20,interval:2.6,siege:2}),
 u('missile','Batería móvil','vehicle',8,'missile',{gold:700,supply:400,metal:400},1300,250,9,.9,7,{heavy:true,splash:2.2,interval:4,weapon:'rocket'}),
 u('titan','Titán mecanizado','vehicle',10,'mecha',{gold:1200,supply:700,metal:650},4000,240,6.5,.85,10,{heavy:true,armor:25,interval:2,splash:1.1}),
 u('helicopter','Helicóptero de ataque','air',5,'helicopter',{gold:500,supply:350,metal:210},850,85,6.5,2.3,5,{flying:true,interval:1.5,weapon:'rocket'}),
 u('drone','Dron de reconocimiento','air',6,'wasp',{gold:350,supply:250,metal:180},350,30,6,3.2,3,{flying:true}),
 u('gunship','Helicóptero pesado','air',7,'helicopter',{gold:750,supply:500,metal:350},1500,150,7,1.9,7,{flying:true,splash:1.4,interval:2,weapon:'rocket'}),
 u('bomber','Bombardero táctico','air',8,'plane',{gold:950,supply:650,metal:450},1300,220,5,2.6,8,{flying:true,splash:2.4,interval:3.5,siege:2,weapon:'rocket'}),
 u('interceptor','Interceptor','air',9,'plane',{gold:1000,supply:700,metal:500},1200,195,7,3.5,7,{flying:true,vsAir:2,interval:1.7}),
 u('orbital','Nave de asalto','air',10,'starship',{gold:1800,supply:1000,metal:1000},3500,310,8,1.6,12,{flying:true,splash:1.8,interval:2.5,weapon:'energy'}),
 u('captain','Capitán de la vanguardia','range',7,'ranger',{gold:650,supply:320,metal:220},900,110,6,1.7,5,{armor:8,hero:true})
];
const fantasy=[
 u('swordsman','Espadachín','infantry',1,'spearman',{gold:40,supply:25},200,26,1.1,1.55,1,{weapon:'sword'}),
 u('lancer','Lancero','infantry',2,'spearman',{gold:70,supply:45},290,34,1.6,1.45,2,{vsHeavy:1.6,weapon:'sword'}),
 u('berserker','Berserker','infantry',3,'spearman',{gold:100,supply:70},370,55,1.1,1.85,2,{weapon:'sword'}),
 u('dwarf','Guerrero enano','infantry',4,'spearman',{gold:150,supply:80,metal:30},650,58,1.1,1.1,3,{armor:10,race:'stonekin',weapon:'sword'}),
 u('orc','Orco de guerra','infantry',6,'guardian',{gold:250,supply:150,metal:80},1000,92,1.5,1.2,4,{race:'sylvan',weapon:'sword'}),
 u('paladin','Paladín','infantry',8,'spearman',{gold:450,supply:220,metal:180},1400,120,1.6,1.35,5,{armor:15,heal:0,weapon:'sword'}),
 u('archer','Arquera','range',2,'archer',{gold:65,supply:40},155,27,5.8,1.6,1),
 u('crossbow','Ballestero','range',3,'archer',{gold:120,supply:70,metal:25},220,68,6.2,1.2,2,{interval:1.9}),
 u('healer','Sanadora','range',3,'medic',{gold:120,supply:80},200,0,5,1.5,2,{heal:25,weapon:'energy'}),
 u('elf','Guardabosques elfo','range',5,'archer',{gold:230,supply:130,metal:50},320,65,7,1.85,3,{race:'sylvan'}),
 u('mage','Mago del fuego','range',6,'psion',{gold:300,supply:180,metal:80},300,115,6.5,1.3,3,{splash:1.5,interval:2.1,weapon:'energy'}),
 u('necromancer','Nigromante','range',9,'psion',{gold:600,supply:350,metal:220},620,175,7,1.2,5,{splash:1.5,interval:2,weapon:'energy',race:'astral'}),
 u('cavalry','Caballería','vehicle',3,'cavalry',{gold:190,supply:140,metal:50},650,62,1.6,2.5,3,{heavy:true,weapon:'sword'}),
 u('catapult','Catapulta','vehicle',4,'catapult',{gold:270,supply:100,wood:180},550,145,8,.8,4,{splash:1.5,interval:3.5,siege:2,heavy:true,weapon:'stone'}),
 u('knight','Caballero real','vehicle',5,'cavalry',{gold:350,supply:220,metal:160},1250,105,1.6,2.2,5,{armor:12,heavy:true,weapon:'sword'}),
 u('trebuchet','Trabuquete','vehicle',7,'catapult',{gold:550,supply:160,wood:350,metal:190},800,280,10,.6,6,{splash:2,interval:5,siege:2.3,heavy:true,weapon:'stone'}),
 u('golem','Gólem de piedra','air',5,'golem',{gold:400,supply:200,metal:250},2200,125,1.8,.7,6,{heavy:true,armor:20,weapon:'sword'}),
 u('griffin','Grifo','air',5,'griffin',{gold:450,supply:320,metal:150},850,85,2.2,2.6,5,{flying:true,weapon:'sword'}),
 u('wyvern','Guiverno','air',6,'dragon',{gold:600,supply:400,metal:200},1250,125,4,2.2,6,{flying:true,weapon:'energy'}),
 u('ent','Anciano del bosque','air',7,'golem',{gold:600,supply:400,wood:350},3000,180,2, .65,8,{heavy:true,armor:18,race:'sylvan',splash:1.1,weapon:'sword'}),
 u('dragon','Dragón de fuego','air',8,'dragon',{gold:950,supply:650,metal:380},2400,205,5.5,1.75,8,{flying:true,splash:1.6,interval:2,weapon:'energy'}),
 u('phoenix','Fénix solar','air',9,'griffin',{gold:1100,supply:700,metal:450},1700,195,5,2.9,7,{flying:true,splash:1.6,weapon:'energy',race:'astral'}),
 u('ancient','Dragón ancestral','air',10,'dragon',{gold:1800,supply:1100,metal:900},4500,310,6.5,1.5,12,{flying:true,armor:15,splash:2.2,interval:2.5,weapon:'energy'}),
 u('champion','Campeona del reino','infantry',7,'spearman',{gold:600,supply:300,metal:200},1000,135,1.6,1.8,5,{hero:true,armor:10,weapon:'sword'})
];
export const UNITS=Object.fromEntries((MODERN?military:fantasy).map(x=>[x.id,x]));
export const FIRST_UNIT=MODERN?'rifle':'swordsman';
export const DIFFICULTIES={easy:{name:'Fácil',damage:.65,reward:1,raid:1.6},hard:{name:'Difícil',damage:1,reward:1.3,raid:1},simulation:{name:'Simulación',damage:1.35,reward:1.7,raid:.8}};
export const CAMP_NAMES=MODERN?['Puesto de la frontera','Cantera ocupada','Estación del desierto','Fábrica abandonada','Fuerte de Acero','El paso blindado','Aeródromo enemigo','Costa de los Corsarios','La muralla de hierro','Distrito de artillería','El último búnker','Ciudadela del Eclipse']:['Campamento de los saqueadores','Bosque de los duendes','Cantera del ogro','Torre del hechicero','Fuerte de los orcos','El paso de los enanos','Nido de grifos','Puerto de los espectros','La muralla del norte','Santuario de los dragones','Trono del nigromante','Ciudadela del Eclipse'];
export const ALLIES=MODERN?[{id:'scouts',name:'Exploradores del Norte',need:'wood'},{id:'engineers',name:'Liga de Ingenieros',need:'metal'},{id:'traders',name:'Unión Mercante',need:'supply'}]:[{id:'scouts',name:'Corte del Bosque',need:'wood'},{id:'engineers',name:'Clanes de la Montaña',need:'metal'},{id:'traders',name:'Liga de los Puertos',need:'supply'}];
export function buildingStats(type,level){const s=BUILDINGS[type],f=1+(level-1)*.26;return{hp:Math.round(s.hp*f),attack:Math.round((s.attack||0)*(1+(level-1)*.22)),rate:(s.rate||0)*(1+(level-1)*.35),capacity:Math.round((s.capacity||0)*(1+(level-1)*.4)),range:(s.range||0)+Math.floor((level-1)/3)*.4};}
export function unitStats(type,level=1){const s=UNITS[type],f=1+(level-1)*.2;return{...s,hp:Math.round(s.hp*f),damage:Math.round(s.damage*f),heal:(s.heal||0)*f,armor:(s.armor||0)+(level-1)*2};}

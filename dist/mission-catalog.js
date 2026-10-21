import {MISSION_INDEX} from './mission-index.js';
const definitions={
 '100000001':['El comandante orco','boss','Derrota al comandante y abre el paso de la isla.'],
 '100000006':['Refuerzos aéreos','airstrike','Toma la radio, solicita apoyo aéreo y destruye el centro de mando.'],
 '100000003':['Protege el convoy','escort','Escolta tres camiones hasta la salida. No se permiten aeronaves.'],
 '100000004':['El supertanque','assembly','Destruye las dos piezas de armamento y después el supertanque.'],
 '100000005':['Intercepta el convoy','intercept','Destruye el camión enemigo antes de que escape.'],
 '100000002':['La central nuclear','reactor','Destruye la central para apagar las defensas y después el mando enemigo.'],
 '100000007':['Enemigo VIP','naval','Captura el barco, embarca tropas y alcanza la base enemiga por mar.'],
 '100000008':['Cuenta atrás','rocket','Impide el lanzamiento: destruye la plataforma antes de que termine la cuenta atrás.'],
 '100000009':['Los laboratorios','labs','Recupera la radio y utiliza apoyo aéreo contra los laboratorios.'],
 '100000010':['Operaciones especiales','infiltration','Elimina a los guardias, llega al búnker y recupera la información.'],
 '100000011':['Rescate por mar','rescue','Captura transportes, rescata tres grupos de aliados y evacúa antes del bombardeo.'],
 '100000012':['El jefe blindado','boss','Derrota al jefe blindado y a sus escoltas.'],
 '100000013':['Territorio T-Rex','hunt','Elimina a los tiranosaurios que controlan la zona.'],
 '100000014':['Operación sigilo','stealth','Infiltra a un único especialista, recupera la información y alcanza la extracción.'],
 '100000017':['La base vikinga','eradicate','Destruye a los defensores y sus instalaciones principales.'],
 '100000018':['Amenaza extraterrestre','eradicate','Rechaza a los alienígenas y destruye su centro de operaciones.'],
 '100000019':['La plaga arácnida','eradicate','Elimina a las arañas y sus nidos.'],
 '100000020':['El nido de dragones','hunt','Derrota a los dragones y asegura la isla.'],
 '100000021':['La rebelión robótica','eradicate','Destruye las máquinas hostiles y sus centros de fabricación.'],
 '100000022':['El ejército de Shock','eradicate','Derrota al doctor y a su ejército de monstruos.'],
 '100000026':['Los nébulares','eradicate','Destruye las fuerzas nébulares y su mando.'],
 '100000025':['El regreso de Shock','eradicate','Supera el asedio final y derrota al jefe.'],
 '100000049':['Asedio semanal','survive','Resiste cinco oleadas. La semilla y las recompensas cambian cada semana.']
};
export const MISSIONS=MISSION_INDEX.map((m,i)=>{const [name,mode,objective]=definitions[m.id];return{...m,name,mode,objective,storyIndex:m.id==='100000049'?-1:i-1,hq:m.id==='100000049'?2:Math.max(1,Math.min(10,Math.ceil(i/2.5))),noAir:['escort','naval','rocket','labs'].includes(mode),limit:mode==='intercept'?240:mode==='rocket'?360:mode==='rescue'?540:mode==='stealth'?720:1200};});
export const STORY_MISSIONS=MISSIONS.filter(m=>m.storyIndex>=0),WEEKLY_MISSION=MISSIONS.find(m=>m.storyIndex<0);
const loaded=new Map();
export function registerMission(data){const meta=MISSIONS.find(m=>m.id===data?.id);if(!meta||data.layout!==meta.layout||!Array.isArray(data.objects)||data.objects.length>2000)throw Error('Escenario de misión no válido.');for(const o of data.objects)if(!Number.isInteger(o.id)||!Number.isFinite(o.x)||!Number.isFinite(o.y)||o.x<0||o.y<0||o.x>100||o.y>100)throw Error('Objeto de misión no válido.');loaded.set(data.id,data);return data;}
export async function loadMission(id){if(loaded.has(id))return loaded.get(id);if(!MISSIONS.some(m=>m.id===id))throw Error('Misión desconocida.');const r=await fetch(new URL('./missions/'+id+'.json',import.meta.url));if(!r.ok)throw Error('No se pudo descargar el escenario. Abre esta misión con conexión o descarga el juego desde Ajustes.');return registerMission(await r.json());}
export const missionData=id=>loaded.get(id);
export function campaignProgress(s){return s.campaign||=( {version:1,stars:{},weekly:{},blueprints:[],rewards:[],attempts:0} );}
export function missionLock(s,id){const m=MISSIONS.find(m=>m.id===id);if(!m)return'Misión desconocida.';if(s.battle)return'Termina la operación actual.';const p=campaignProgress(s),previous=STORY_MISSIONS[m.storyIndex-1];if(previous&&!p.stars[previous.id])return'Completa '+previous.name+' primero.';const h=s.buildings.find(b=>b.type==='hq')?.level||1;if(h<m.hq)return'Centro de mando nivel '+m.hq+' necesario.';return'';}
export const weekKey=(now=Date.now())=>Math.floor(now/(7*24*3600000));

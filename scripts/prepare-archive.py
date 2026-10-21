"""Compile the complete pinned item catalog into playable, data-driven families."""
from pathlib import Path
import json,math,re
root=Path(__file__).resolve().parents[1];specpath=root/'source-data/classic-import.json';spec=json.loads(specpath.read_text(encoding='utf-8'));w=spec['wars'];items=json.loads((root/'source-data/social-wars/items.json').read_text(encoding='utf-8'))['items'];byid={i['id']:i for i in items}
def arr(value):
 if isinstance(value,list):return [int(x)for x in value if str(x).isdigit()]
 if isinstance(value,(int,float)):return [int(value)]if value>0 else []
 return [int(x)for x in re.findall(r'\d+',str(value))if int(x)>0]
def truth(p,k):return str(p.get(k,'0'))not in ('0','False','false','None','')
def cost(i):
 out={};keys={'g':'gold','w':'wood','o':'supply','s':'metal'}
 for k,v in (i.get('costs')or{}).items():
  if k in keys and isinstance(v,(int,float)) and v>0:out[keys[k]]=max(1,int(v))
 if not out:out={'gold':max(50,int(i.get('cost',0)or 0)*100)}
 return out
native_b={id:(kind,1+min(9,int(n*10/len(chain))))for kind,chain in w['buildings'].items() if not kind.startswith('swb')for n,id in enumerate(chain)};native_u={id:kind for kind,id in w['units'].items()if not kind.startswith('swu')}
mapping={};buildings={};units={}
for i in items:
 id=i['id'];p=i.get('properties')or{};hq=max(1,min(10,math.ceil(max(1,i.get('min_level',1))/5)))
 if i['type']=='b':
  kind,level=native_b.get(id,('swb'+str(id),1));role='bridge'if id in (928,929)else'resource'if truth(p,'resource')else'decoration'if truth(p,'decoration')else'building'
  mapping[id]={'type':kind,'level':level,'role':role,'width':i['width'],'height':i['height']}
  if id in native_b:continue
  w['buildings'][kind]=[id];train=arr(i.get('trains_ids'));produces=(i.get('collect',0)or 0)>0 and not truth(p,'resource')and not truth(p,'grants_population');resource={'g':'gold','w':'wood','o':'supply','s':'metal'}.get(i.get('collect_type'),'gold')
  category='production'if produces else'military'if train else'defense'if any(truth(p,k)for k in ['wall','tower','bunker'])else'economy'if any(truth(p,k)for k in ['silo','depot','grants_population'])else'decoration'if role=='decoration'or truth(p,'wonder')else'support'
  b={'id':kind,'sourceId':id,'name':i['name'],'kind':category,'model':'source','hq':hq,'cost':cost(i),'size':max(1,min(8,max(i['width'],i['height']))),'width':i['width'],'height':i['height'],'limit':max(1,i.get('building_limit_same_id',-1))if i.get('building_limit_same_id',-1)>0 else 8 if category=='defense'else 3,'hp':max(100,i.get('life',100)),'time':max(8,min(180,i.get('build_time',15)or 15)),'archive':True,'buyable':i.get('in_store')==1 and role not in ['resource','bridge'],'queue':bool(train),'sourceTrains':train,'description':i['name']+'. '+('Entrena unidades de su catálogo original.'if train else'Produce lotes de '+resource+'.'if produces else'Bloquea el paso y refuerza la defensa.'if category=='defense'else'Decora la base y aporta una bonificación industrial del 1%, hasta el 10% total.'if category=='decoration'else'Amplía la logística y la capacidad de la base.')}
  if produces:b.update(resource=resource,rate=max(.1,i['collect']/240),capacity=max(100,i['collect']*3))
  if truth(p,'silo')or truth(p,'depot'):b['storage']=1200
  if truth(p,'grants_population')or truth(p,'raisePopulationCap'):b['population']=max(5,i.get('unit_capacity',0)or 10)
  if category=='decoration':b['industrialBonus']=.01
  if category=='support'and not train and not produces:b['population']=5
  if any(truth(byid.get(t,{}).get('properties')or{},'waterborne')for t in train):b['coastal']=True
  if i.get('attack',0)>0:b.update(attack=i['attack'],range=max(1,i.get('attack_range',4)),interval=max(.6,(i.get('attack_interval',20)or 20)/10),air=True)
  if truth(p,'wall'):b['limit']=80
  buildings[kind]=b
 elif i['type']=='u':
  kind=native_u.get(id,'swu'+str(id));mapping[id]={'type':kind,'level':1,'role':'worker'if truth(p,'worker')else'unit','width':i['width'],'height':i['height']}
  if id in native_u:continue
  w['units'][kind]=id
  trainers=[x for x in items if id in arr(x.get('trains_ids')) and x['type']=='b']
  trainer=next((b for b in trainers if b['id']in native_b),next((b for b in trainers if b.get('in_store')==1),trainers[0]if trainers else None))
  factory=native_b[trainer['id']][0]if trainer and trainer['id']in native_b else'swb'+str(trainer['id'])if trainer else'robotics'
  flying=truth(p,'ft_flying');heavy=truth(p,'ft_armored')or truth(p,'mechanic');water=truth(p,'waterborne');name=i['name'].lower();worker=truth(p,'worker')
  u={'id':kind,'sourceId':id,'name':i['name'],'factory':factory,'hq':hq,'required':min(10,native_b.get(trainer['id'],('',1))[1])if trainer else 1,'cost':cost(i),'hp':max(40,i.get('life',100)),'damage':max(0,i.get('attack',5)),'range':max(1,i.get('attack_range',1)),'speed':max(.6,min(3.8,(i.get('velocity',10)or 10)/6)),'pop':max(1,i.get('population',1)),'time':max(10,min(180,i.get('training_time',15)or 15)),'interval':max(.6,min(5,(i.get('attack_interval',20)or 20)/10)),'model':'source','archive':True,'recruitable':bool(trainer)and not worker,'flying':flying,'heavy':heavy,'waterborne':water,'armor':max(0,i.get('defense',0)//3),'weapon':'energy'if any(k in name for k in ['laser','alien','nebular','drone'])else'rocket'if heavy or water else'gun','seeStealth':truth(p,'seeStealthUnits')}
  if truth(p,'healer')or truth(p,'mechanic')and 'mechanic' in name:u.update(heal=max(15,u['damage']),damage=0,repair=truth(p,'mechanic'))
  if any(k in name for k in ['poison','venom']):u['poison']=True
  if any(k in name for k in ['flame','fire','blazer']):u['burn']=True
  if 'kamikaze'in name or' xplosive'in name:u['selfDestruct']=True
  if 'regenerating'in p:u['regenerate']=True
  if any(k in name for k in ['spy','special ops']):u['stealth']=True
  if any(k in name for k in ['boss','messiah','t-rex','tyrannosaur']):u['hero']=True
  units[kind]=u
out={'buildings':buildings,'units':units,'mapping':mapping}
(root/'dist/archive-catalog.js').write_text('// All entries derive from the pinned preservation catalog; balance adapters are Auralis.\nexport const ARCHIVE_CATALOG='+json.dumps(out,ensure_ascii=False,separators=(',',':'))+';\n',encoding='utf-8');specpath.write_text(json.dumps(spec,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('Compiled',len(buildings),'additional building/object types,',len(units),'additional actors,',len(mapping),'source mappings.')

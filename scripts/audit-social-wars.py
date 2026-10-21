"""Index the pinned preservation archive and statically exported AS3 sources.

Usage: python scripts/audit-social-wars.py D:/PDF/Social-References
FFDec exports are analysis inputs, never executed or shipped as our engine.
"""
from pathlib import Path
import collections, csv, hashlib, json, re, sys

root=Path(sys.argv[1]); out=Path(__file__).resolve().parents[1]/'source-data/social-wars'
out.mkdir(parents=True,exist_ok=True)
commit='c3fceeb1f8e93734a293b9bc25ae6025656f6822'
base=f'https://raw.githubusercontent.com/AcidCaos/socialwarriors/{commit}/'
config=json.loads((root/'wars-config.json').read_text(encoding='utf-8'))
tree=json.loads((root/'wars-tree.json').read_text(encoding='utf-8'))['tree']
assets=[dict(path=e['path'],bytes=e.get('size',0),sha=e['sha'],url=base+e['path']) for e in tree if e['type']=='blob' and e['path'].startswith('assets/')]
paths={e['path'] for e in assets}
def decode(v):
 try:return json.loads(v) if isinstance(v,str) else v
 except (ValueError,TypeError):return v
items=[]
for item in config['items']:
 entry={k:decode(v) for k,v in item.items()};entry['sprite']=base+'assets/sprites/'+item['img_name']+'.swf'
 entry['hasSprite']='assets/sprites/'+item['img_name']+'.swf' in paths
 entry['hasThumbnail']='assets/thumbs/'+item['img_name']+'.jpg' in paths
 items.append(entry)
scripts=root/'wars-analysis/core/scripts'
classes=[]
for file in sorted(scripts.rglob('*.as')):
 s=file.read_text(encoding='utf-8-sig');functions=re.findall(r'(?:public|protected|private|internal)\s+(?:static\s+)?(?:override\s+)?function\s+((?:get\s+|set\s+)?[\w$]+)',s)
 classes.append({'path':str(file.relative_to(scripts)).replace('\\','/'),'functions':functions})
map_source=(scripts/'managers/MapManager.as').read_text(encoding='utf-8-sig')
maps=[]
for match in re.finditer(r'maps\[(?:MapManager\.)?(\w+)\]\s*=\s*\{\s*"map":(\[\[.*?\]\])',map_source):
 grid=json.loads(match[2]);maps.append({'name':match[1],'width':100,'height':100,'textureCellSize':5,'expansionSize':10,'tiles':grid})
command=(root/'wars-analysis/command.py').read_text(encoding='utf-8')
commands=re.findall(r'(?:if|elif) cmd == "([^"]+)"',command)
def save(name,value):(out/name).write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
save('items.json',{'source':base+'config/main.json','items':items,'categories':config['categories'],'expansionPrices':config['expansion_prices'],'globals':config['globals']})
save('assets.json',{'commit':commit,'assets':assets})
save('engine-index.json',{'source':base+'assets/flash/Basesec_1.5.4.swf','sha256':hashlib.sha256((root/'wars-analysis/Basesec_1.5.4.swf').read_bytes()).hexdigest(),'classes':classes,'backendCommands':commands})
save('maps.json',{'source':base+'assets/flash/Basesec_1.5.4.swf','maps':maps})
counts={'items':len(items),'itemTypes':dict(collections.Counter(str(i['type']) for i in items)),'assets':len(assets),'assetGroups':dict(collections.Counter(i['path'].split('/')[1] for i in assets)),'as3Classes':len(classes),'methods':sum(len(c['functions']) for c in classes),'commands':len(commands),'maps':len(maps)}
save('summary.json',counts)
with (out/'catalog.csv').open('w',newline='',encoding='utf-8-sig') as f:
 fields=['id','name','type','group_type','min_level','img_name','trains_ids','upgrades_to','life','attack','attack_range','population','collect','collect_type','hasSprite','hasThumbnail'];w=csv.DictWriter(f,fieldnames=fields,extrasaction='ignore');w.writeheader();w.writerows(items)
print(json.dumps(counts,indent=2))

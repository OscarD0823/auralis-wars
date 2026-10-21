"""Package original mission maps/objects and AS3 objectives, without account data."""
from pathlib import Path
import concurrent.futures as cf, json,re,sys,urllib.request
root=Path(__file__).resolve().parents[1];refs=Path(sys.argv[1]);cache=root/'.reference-cache/quests';cache.mkdir(parents=True,exist_ok=True)
commit='c3fceeb1f8e93734a293b9bc25ae6025656f6822';base=f'https://raw.githubusercontent.com/AcidCaos/socialwarriors/{commit}/'
tree=json.loads((refs/'wars-tree.json').read_text(encoding='utf-8'))['tree'];paths=[i['path'] for i in tree if re.fullmatch(r'villages/quest/\d+\.json',i['path'])]
def read(path):
 target=cache/Path(path).name
 if not target.exists():
  with urllib.request.urlopen(base+path,timeout=40) as response:target.write_bytes(response.read())
 return path,json.loads(target.read_text(encoding='utf-8'))
with cf.ThreadPoolExecutor(max_workers=4) as pool:data=dict(pool.map(read,paths))
src=refs/'wars-analysis/core/scripts';quest=(src/'quest/Quest.as').read_text(encoding='utf-8-sig');ids=dict(re.findall(r'public static const (QUEST_\w+):String = "(\d+)"',quest));maps={ids[k]:v for k,v in re.findall(r'questMaps\[(\w+)\] = MapManager\.(\w+);',quest) if k in ids};classes={ids[k]:v for k,v in re.findall(r'questFactory\[(\w+)\] = (\w+);',quest) if k in ids};order=re.search(r'questIds = \[(.*?)\]',quest)[1].split(',');order=[ids[k.strip()] for k in order if k.strip() in ids]
constants={k:int(v)for k,v in re.findall(r'public static const (ID_\w+):uint = (\d+);',(src/'core/Constants.as').read_text(encoding='utf-8-sig'))}
out=[]
for path,d in data.items():
 id=Path(path).stem
 if id not in maps:continue
 text=(src/'quest'/f'{classes[id]}.as').read_text(encoding='utf-8-sig');m=d['maps'][0]
 desc=re.search(r'description:String = Language.getLiteral\("((?:\\.|[^"\\])*)"\)',text)
 start=re.search(r'(?:_positionInit|positionInit|truckStart)\s*(?::Point\s*)?= new Point\((\d+),(\d+)\)',text)
 level=re.search(r'function get levelRequired\(\).*?return (\d+)',text,re.S)
 variables=dict(re.findall(r'(\w+):String = "([^"]+)"',text));tags={}
 for key,body in re.findall(r'importantIds\[Constants\.get(?:Enemy)?Id\(Constants\.(\w+)\)\]\s*=\s*\{(.*?)\};',text,re.S):
  tag=re.search(r'"chapterId":(?:"([^"]+)"|this\.(\w+))',body)
  if tag and key in constants:tags[constants[key]]=tag[1]or variables.get(tag[2],tag[2])
 entries=[]
 for key,arr in m['items'].items():
  entries.append({'id':int(arr[0]),'x':arr[1],'y':arr[2],'orientation':arr[4] if len(arr)>4 else 0,'key':str(key),'tag':tags.get(int(arr[0]),'')})
 out.append({'id':id,'layout':maps[id],'source':base+path,'class':classes[id],'order':order.index(id),'description':desc[1].replace("\\'", "'") if desc else '', 'start':[int(start[1]),int(start[2])] if start else None,'levelRequired':int(level[1]) if level else 1,'objects':entries})
out.sort(key=lambda m:m['order']);target=root/'source-data/social-wars/missions.json';target.write_text(json.dumps({'commit':commit,'missions':out},ensure_ascii=False,indent=2)+'\n',encoding='utf-8');print('Packaged',len(out),'missions;',sum(len(m['objects']) for m in out),'source objects.')
dest=root/'dist/missions';dest.mkdir(exist_ok=True)
for m in out:(dest/(m['id']+'.json')).write_text(json.dumps(m,ensure_ascii=False,separators=(',',':'))+'\n',encoding='utf-8')
index=[{k:v for k,v in m.items()if k!='objects'}for m in out]
(root/'dist/mission-index.js').write_text('// Mission order, layout and source AS3 metadata from the pinned archive.\nexport const MISSION_INDEX='+json.dumps(index,ensure_ascii=False,separators=(',',':'))+';\n',encoding='utf-8')

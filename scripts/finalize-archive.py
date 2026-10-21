"""Record genuinely absent source movies, without attributing invented artwork."""
from pathlib import Path
import json,urllib.parse
root=Path(__file__).resolve().parents[1];spec=json.loads((root/'source-data/classic-import.json').read_text(encoding='utf-8'))['wars'];path=root/'dist/classic/atlas.json';atlas=json.loads(path.read_text(encoding='utf-8'));items={i['id']:i for i in json.loads((root/'source-data/social-wars/items.json').read_text(encoding='utf-8'))['items']}
ids=set(sum(spec['buildings'].values(),[])+list(spec['units'].values())+list(spec['nature'].values()));missing=[]
inventory={a['path']for a in json.loads((root/'source-data/social-wars/assets.json').read_text(encoding='utf-8'))['assets']}
for id in sorted(ids):
 if str(id) in atlas['assets'] and not atlas['assets'][str(id)].get('unavailable'):continue
 i=items[id];name=i['img_name'].split(',')[0]
 if f"assets/{spec['folder']}/{name}.swf"in inventory:raise RuntimeError(f'Existing source {id} still needs successful conversion; do not mark it absent.')
 source=f"https://raw.githubusercontent.com/AcidCaos/{spec['repo']}/{spec['commit']}/assets/{spec['folder']}/{urllib.parse.quote(name)}.swf"
 record={'sourceId':id,'name':i['name'],'sourceName':name,'source':source,'reason':'The configured movie is absent from the pinned preservation tree (HTTP 404).'};missing.append(record)
 atlas['assets'][str(id)]={**record,'file':'./classic/missing-source.svg','thumb':'./classic/missing-source.svg','width':160,'height':160,'displayWidth':160,'frames':[[0,0,160,160]],'states':{'idle':[[0]]},'unavailable':True}
atlas['unavailable']=[r['sourceId']for r in missing];path.write_text(json.dumps(atlas,ensure_ascii=False,separators=(',',':')),encoding='utf-8');(root/'source-data/social-wars/graphics-missing.json').write_text(json.dumps({'commit':spec['commit'],'missing':missing},ensure_ascii=False,indent=2)+'\n',encoding='utf-8');print(f'{len(missing)} missing source movies explicitly marked; {len(atlas["assets"])} catalog records.')

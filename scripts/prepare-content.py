"""Regenerate runtime source metadata from the pinned audit and sprite mappings."""
from pathlib import Path
import json
root = Path(__file__).resolve().parent.parent
spec = json.loads((root/'source-data/classic-import.json').read_text(encoding='utf-8'))['wars']
items = {i['id']:i for i in json.loads((root/'source-data/social-wars/items.json').read_text(encoding='utf-8'))['items']}
fields = ['id','name','min_level','trains_ids','upgrades_to','width','height','collect','collect_type']
out = {'buildings':{},'units':{}}
for kind,chain in spec['buildings'].items():
    out['buildings'][kind] = [{k:items[id].get(k) for k in fields} for id in chain]
for kind,id in spec['units'].items():
    out['units'][kind] = {k:items[id].get(k) for k in ['id','name','min_level','properties']}
(root/'dist/content-data.js').write_text('// Original catalog metadata; Auralis stats remain balanced separately.\nexport const CONTENT_DATA='+json.dumps(out,ensure_ascii=False,separators=(',',':'))+';\n',encoding='utf-8')
print('Prepared',len(out['buildings']),'building families and',len(out['units']),'actors.')

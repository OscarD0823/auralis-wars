"""Prepare a compact, read-only reference explorer; it doesn't alter campaigns."""
from pathlib import Path
import json
root=Path(__file__).resolve().parents[1];src=root/'source-data/social-wars';out=root/'dist/reference-data';out.mkdir(parents=True,exist_ok=True)
c=json.loads((src/'items.json').read_text(encoding='utf-8'));fields=['id','name','type','group_type','min_level','img_name','costs','width','height','life','attack','defense','attack_range','attack_interval','velocity','population','collect','collect_type','collect_xp','activation','build_time','training_time','trains_ids','upgrades_to','properties','in_store','race']
(out/'catalog.json').write_text(json.dumps({'source':c['source'],'items':[{k:i.get(k) for k in fields} for i in c['items']]},ensure_ascii=False,separators=(',',':')),encoding='utf-8')
maps=json.loads((src/'maps.json').read_text(encoding='utf-8'));(out/'maps.json').write_text(json.dumps(maps,separators=(',',':')),encoding='utf-8')
print('Read-only reference catalog and 24 map layouts packaged.')

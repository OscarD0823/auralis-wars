"""Copy preserved UI bitmaps without changing their pixels or executing Flash."""
from pathlib import Path
import hashlib
import json
import shutil
import sys

root = Path(__file__).resolve().parents[1]
refs = Path(sys.argv[1]) / 'wars-analysis/core'
names = {
    'gold': '23', 'wood': '27', 'supply': '25', 'metal': '29',
    'rank': '33', 'population': '3101', 'select': '102', 'build': '110',
    'world': '123', 'army': '1015', 'worker': '1145', 'rescue': '187',
    'campaign': '2142', 'tasks': '335', 'settings': '303',
    'target': '181', 'all': '1027', 'production': '1025', 'military': '1015',
    'defense': '1012', 'economy': '1001', 'support': '1145', 'science': '3564',
    'infrastructure': '1018', 'decoration': '1009', 'storage': '118',
    'panel-texture': '1047', 'toolbar-texture': '248', 'blue-button': '284',
    'selection': '137', 'close': '1974',
}
out = root / 'dist/interface'
out.mkdir(exist_ok=True)
items = []
for name, symbol in names.items():
    source = refs / 'images' / (symbol + '.png')
    dest = out / (name + '.png')
    shutil.copyfile(source, dest)
    items.append({'name': name, 'file': './interface/' + dest.name,
                  'exportedBitmapId': int(symbol),
                  'sha256': hashlib.sha256(source.read_bytes()).hexdigest()})
manifest = {
    'source': 'https://github.com/AcidCaos/socialwarriors/tree/c3fceeb1f8e93734a293b9bc25ae6025656f6822',
    'movie': 'Basesec_1.5.4.swf',
    'movieSha256': hashlib.sha256((refs.parent / 'Basesec_1.5.4.swf').read_bytes()).hexdigest(),
    'conversion': 'JPEXS FFDec static PNG bitmap export; copied without pixel changes',
    'assets': items,
}
(root / 'source-data/social-wars/interface.json').write_text(
    json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f'{len(items)} preserved interface bitmaps copied.')

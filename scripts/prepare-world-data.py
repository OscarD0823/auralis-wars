"""Package original terrain layouts, expansion prices and bridge positions."""
from pathlib import Path
import json,sys
root=Path(__file__).resolve().parents[1];refs=Path(sys.argv[1])
maps=json.loads((root/'source-data/social-wars/maps.json').read_text(encoding='utf-8'))['maps']
config=json.loads((root/'source-data/social-wars/items.json').read_text(encoding='utf-8'))
initial=json.loads((refs/'wars-initial.json').read_text(encoding='utf-8'))
# Flash stores the south-east occupied tile; Auralis uses the north-west origin.
bridges=[{'x':i[1]-4,'y':i[2]-4,'orientation':i[4],'broken':i[0]==928} for i in initial['maps'][0]['items'].values() if i[0] in (928,929)]
data={'maps':{m['name']:m['tiles'] for m in maps},'prices':[i['coins'] for i in config['expansionPrices']],'bridges':bridges,'cycles':{'minutes':config['globals']['COLLECT_MINUTES'],'multipliers':config['globals']['COLLECT_MULTIPLIER']}}
target=root/'dist/world-data.js';target.write_text('// Terrain and prices: pinned Social Warriors archive; see ASSET-CREDITS.md.\nexport const WORLD_DATA='+json.dumps(data,ensure_ascii=False,separators=(',',':'))+';\n',encoding='utf-8')
print('24 map layouts, expansion prices,',len(bridges),'bridges and production cycles packaged.')

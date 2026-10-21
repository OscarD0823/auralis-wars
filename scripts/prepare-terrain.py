"""Convert FFDec's 30 TerrainTiles frames to transparent WebP; no art is invented.

Export first with FFDec -selectid 50 -export sprite OUTPUT terreno.swf.
Usage: python scripts/prepare-terrain.py OUTPUT/DefineSprite_50_TerrainTiles
"""
import json,sys
from pathlib import Path
from PIL import Image
out=Path(__file__).resolve().parents[1]/'dist/classic/terrain';out.mkdir(parents=True,exist_ok=True)
frames=[]
for i in range(1,31):
 im=Image.open(Path(sys.argv[1])/f'{i}.png').convert('RGBA');name=f'{i-1:02}.webp';im.save(out/name,'WEBP',quality=88,method=6)
 frames.append({'tileCode':i-1,'file':'./classic/terrain/'+name,'width':im.width,'height':im.height})
(out/'manifest.json').write_text(json.dumps({'source':'https://raw.githubusercontent.com/AcidCaos/socialwarriors/c3fceeb1f8e93734a293b9bc25ae6025656f6822/assets/sprites/terreno.swf','symbol':'TerrainTiles','characterId':50,'cellsPerTile':5,'frames':frames},indent=2)+'\n',encoding='utf-8')
print('30 original terrain frames converted.')

"""Resample animation cells, retaining original frame/state/footprint geometry.

Run after prepare-sprites.py has completed. Shared source movies are processed
once; this script never invents or retouches art.
"""
from pathlib import Path
import json,math
from PIL import Image

root=Path(__file__).resolve().parents[1]
manifest=root/'dist/classic/atlas.json'
atlas=json.loads(manifest.read_text(encoding='utf-8'))
unit_ids=set(map(str,atlas['units'].values()))
groups={}
for key,a in atlas['assets'].items():
 if key in unit_ids and not a.get('unavailable'):groups.setdefault(a['file'],[]).append(a)
count=0;before=after=0
for url,assets in groups.items():
 a=assets[0];path=root/'dist'/url.removeprefix('./')
 before+=path.stat().st_size
 states={k:v[:5] for k,v in a['states'].items()}
 used=sorted({n for directions in states.values()for seq in directions for n in seq})
 if max(a['width'],a['height'])>256 or len(used)<len(a['frames']):
  old_width=a['width']
  with Image.open(path) as source:
   scale=min(1,256/a['width'],256/a['height']);w=max(1,math.floor(a['width']*scale));h=max(1,math.floor(a['height']*scale));cols=min(8,len(used));rows=math.ceil(len(used)/cols);target=Image.new('RGBA',(cols*w,rows*h));frames=[]
   for i,n in enumerate(used):
    x,y,fw,fh=a['frames'][n]
    frame=source.crop((x,y,x+fw,y+fh)).resize((w,h),Image.Resampling.LANCZOS)
    nx=(i%cols)*w;ny=(i//cols)*h;target.alpha_composite(frame,(nx,ny));frames.append([nx,ny,w,h])
   target.save(path,'WEBP',quality=90,method=4)
  remap={n:i for i,n in enumerate(used)}
  states={k:[[remap[n]for n in seq]for seq in dirs]for k,dirs in states.items()}
  for asset in assets:asset.update(width=w,height=h,displayWidth=max(1,round(asset['displayWidth']*w/old_width)),frames=frames,states=states,optimizedCellLimit=256)
  count+=1
 after+=path.stat().st_size
manifest.write_text(json.dumps(atlas,ensure_ascii=False,separators=(',',':')),encoding='utf-8')
print(f'Optimized {count} shared animation sheets; {before/1048576:.2f} -> {after/1048576:.2f} MiB.')

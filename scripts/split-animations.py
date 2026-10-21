"""Build small directional clips so visible troops never retain whole movies."""
from pathlib import Path
import json,math,concurrent.futures as cf
from PIL import Image
root=Path(__file__).resolve().parents[1];path=root/'dist/classic/atlas.json';atlas=json.loads(path.read_text(encoding='utf-8'));actors=set(map(str,atlas['units'].values()));groups={};out=root/'dist/classic/clips';out.mkdir(exist_ok=True)
for id,a in atlas['assets'].items():
 if id in actors and not a.get('unavailable'):groups.setdefault(a['file'],[]).append(id)
def split(entry):
 url,ids=entry;a=atlas['assets'][ids[0]];clips={};stem=Path(url).stem
 with Image.open(root/'dist'/url.removeprefix('./')) as sheet:
  sheet.load()
  for state,dirs in a['states'].items():
   if state=='idle':continue
   clips[state]=[]
   for d,seq in enumerate(dirs):
    cols=min(4,len(seq));rows=math.ceil(len(seq)/cols);w=a['width'];h=a['height'];strip=Image.new('RGBA',(w*cols,h*rows));frames=[]
    for i,n in enumerate(seq):
     x,y,fw,fh=a['frames'][n];nx=i%cols*w;ny=i//cols*h;strip.alpha_composite(sheet.crop((x,y,x+fw,y+fh)),(nx,ny));frames.append([nx,ny,fw,fh])
    name=f'{stem}-{state}-{d}.webp';target=out/name;valid=False
    if target.exists():
     try:
      with Image.open(target)as existing:valid=existing.size==strip.size;existing.verify()
     except OSError:valid=False
    if not valid:strip.save(target,'WEBP',quality=90,method=1)
    clips[state].append({'file':'./classic/clips/'+name,'frames':frames})
  if 'walk'in clips:clips['idle']=[{'file':c['file'],'frames':[c['frames'][0]]}for c in clips['walk']]
 return ids,clips
with cf.ThreadPoolExecutor(max_workers=4)as pool:
 for n,(ids,clips)in enumerate(pool.map(split,groups.items()),1):
  for id in ids:atlas['assets'][id]['clips']=clips
  if n%25==0:print(f'Split {n}/{len(groups)} original actors',flush=True)
path.write_text(json.dumps(atlas,ensure_ascii=False,separators=(',',':')),encoding='utf-8');print(f'Complete: {len(groups)} shared movies, directional loading enabled.',flush=True)

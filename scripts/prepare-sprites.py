"""Reproducible SWF -> transparent animated WebP atlases (no game code copied)."""
from pathlib import Path
import concurrent.futures as cf
import json, subprocess, urllib.request, os, xml.etree.ElementTree as ET
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent/'.reference-cache'
ROOT.mkdir(exist_ok=True)
JAVA = os.environ.get('JAVA', 'java')
JAR = Path(os.environ['FFDEC_JAR'])
REPO = Path(__file__).resolve().parent.parent
SPECS = json.loads((REPO/'source-data/classic-import.json').read_text(encoding='utf8'))

def cli(*args):
 p=subprocess.run([JAVA,'-Djava.awt.headless=true','-Xmx512m','-jar',str(JAR),*map(str,args)],capture_output=True,text=True,encoding='utf8',errors='replace',timeout=150)
 if p.returncode: raise RuntimeError(p.stdout[-1000:]+p.stderr[-1000:])

def download(url,path):
 if not path.exists():
  path.parent.mkdir(parents=True,exist_ok=True)
  with urllib.request.urlopen(url,timeout=60) as r: path.write_bytes(r.read())

def extract(game, item):
 spec=SPECS[game]; tree={'sha':spec['commit']}
 name=item['img_name'].split(',')[0]; dest=ROOT/game/'swfs'/f'{name}.swf'
 base=f"https://raw.githubusercontent.com/AcidCaos/{spec['repo']}/{tree['sha']}"
 download(f"{base}/assets/{spec['folder']}/{name}.swf",dest)
 work=ROOT/game/'export'/name; xmlpath=work/'source.xml'; work.mkdir(parents=True,exist_ok=True)
 if not xmlpath.exists(): cli('-swf2xml',dest,xmlpath)
 xml=ET.parse(xmlpath).getroot(); tags=list(xml.find('tags')); symbols=next(t for t in tags if t.get('type')=='SymbolClassTag')
 # Symbol arrays are represented separately in FFDec's XML.
 ids=[int(x.text) for x in symbols.find('tags')]; names=[x.text for x in symbols.find('names')]
 character=next((i for i,n in zip(ids,names) if i and n==name),next(i for i in ids if i))
 sprite=next(t for t in tags if t.get('spriteId')==str(character)); states={}; state='idle'; frames=[]
 unit=item.get('type')=='u'
 if unit:
  depth={}; state='idle'
  for tag in sprite.find('subTags'):
   typ=tag.get('type')
   if typ=='FrameLabelTag': state={'QUIETO':'idle','ANDAR':'walk','ATAQUE':'attack','MUERTE':'death','PICAR':'gather'}.get(tag.get('name'),tag.get('name','').lower())
   if typ in ('PlaceObject2Tag','PlaceObject3Tag') and tag.get('placeFlagHasCharacter')=='true': depth[tag.get('depth')]=int(tag.get('characterId'))
   if typ=='RemoveObject2Tag': depth.pop(tag.get('depth'),None)
   if typ=='ShowFrameTag' and state in ('walk','attack'):
    states.setdefault(state,[]).append(depth[min(depth,key=int)] if depth else character)
  selected=set(sum(states.values(),[]))
  selected={i for i in selected if any(t.get('spriteId')==str(i) for t in tags)}
 else: selected={character}
 if not selected: selected={character}; states={'idle':[character]}
 render_source=dest
 # These instances are toggled by the original ActionScript at runtime. Static
 # export must not leave every damage/country overlay visible in a healthy base.
 if not unit and game=='wars':
  overlays=[]
  for parent in xml.iter():
   for child in list(parent):
    if child.get('type') in ('PlaceObject2Tag','PlaceObject3Tag') and child.get('name') in ('fuego','bandera'):
     overlays.append(child.get('name'));parent.remove(child)
  if overlays:
   clean_xml=work/'healthy.xml';clean_swf=work/'healthy.swf'
   ET.ElementTree(xml).write(clean_xml,encoding='utf-8',xml_declaration=True)
   if not clean_swf.exists():cli('-xml2swf',clean_xml,clean_swf)
   render_source=clean_swf
 exported=work/('healthy-images' if render_source!=dest else 'images'); stamp=exported/'done.txt'
 known={int(p.name.split('_')[1]) for p in exported.rglob('DefineSprite_*') if p.is_dir()} if exported.exists() else set()
 if not selected.issubset(known):
  cli('-ignorebackground','-selectid',','.join(map(str,sorted(selected))),'-export','sprite',exported,render_source)
  stamp.write_text('exported')
 # Root export may contain a sprites/ subfolder depending on the number of types.
 directories={int(p.name.split('_')[1]):p for p in exported.rglob('DefineSprite_*') if p.is_dir()}
 if not unit: states={'idle':[character]}
 sequences={}; images=[]
 for state, dirs in states.items():
  sequences[state]=[]
  for cid in dirs:
   directory=directories.get(cid)
   if directory is None: continue
   files=sorted(directory.glob('*.png'),key=lambda p:int(p.stem))
   if not files: continue
   if not unit: files=[files[0]]
   elif len(files)>8: files=[files[round(i*(len(files)-1)/7)] for i in range(8)]
   sequence=[]
   for f in files:
    im=Image.open(f).convert('RGBA'); sequence.append(len(images)); images.append(im)
   sequences[state].append(sequence)
 if not images: raise RuntimeError('No rendered frames for '+name)
 width=max(i.width for i in images); height=max(i.height for i in images)
 # Resampling oversized source vectors is format conversion, not invented art.
 scale=min(1,420/width,420/height); width=max(1,round(width*scale)); height=max(1,round(height*scale))
 cols=min(8,len(images)); rows=(len(images)+cols-1)//cols
 atlas=Image.new('RGBA',(width*cols,height*rows)); rects=[]
 for n,im in enumerate(images):
  if scale<1: im=im.resize((max(1,round(im.width*scale)),max(1,round(im.height*scale))),Image.Resampling.LANCZOS)
  x=(n%cols)*width+(width-im.width)//2; y=(n//cols)*height+(height-im.height)
  atlas.alpha_composite(im,(x,y)); rects.append([(n%cols)*width,(n//cols)*height,width,height])
 target=REPO/'dist/classic'; target.mkdir(parents=True,exist_ok=True)
 atlas.save(target/f'{item["id"]}.webp','WEBP',quality=90,method=4)
 if unit and 'idle' not in sequences:
  sequences['idle']=[[v[0]] for v in sequences.get('walk',sequences.get('attack',[[0]]))]
 thumbnail=images[0]
 thumb_url=f"{base}/assets/{'buildingthumbs' if game=='empires' else 'thumbs'}/{name}.jpg"
 try:
  thumb_path=ROOT/game/'thumbs'/f'{name}.jpg';download(thumb_url,thumb_path);thumbnail=Image.open(thumb_path).convert('RGB')
 except urllib.error.HTTPError as e:
  if e.code!=404: raise
 thumbnail.save(target/f'{item["id"]}-thumb.webp','WEBP',quality=92,method=4)
 return str(item['id']),{'file':f'./classic/{item["id"]}.webp','thumb':f'./classic/{item["id"]}-thumb.webp','width':width,'height':height,'frames':rects,'states':sequences,'source':f"{base}/assets/{spec['folder']}/{name}.swf",'sourceName':name,'name':item['name'],'sourceId':int(item['id'])}

def main():
 for game,spec in SPECS.items():
  download(f"https://raw.githubusercontent.com/AcidCaos/{spec['repo']}/{spec['commit']}/{spec['configSource']}",ROOT/spec['config'])
  cfg=json.loads((ROOT/spec['config']).read_text(encoding='utf-8-sig')); items={int(i['id']):i for i in cfg['items']}
  ids=set(sum(spec['buildings'].values(),[])+list(spec['units'].values())+list(spec['nature'].values()))
  out=REPO/'dist/classic'; out.mkdir(parents=True,exist_ok=True)
  cachepath=out/'atlas.json'; cache=json.loads(cachepath.read_text()) if cachepath.exists() else {'assets':{}}
  errors=[]
  with cf.ThreadPoolExecutor(max_workers=3) as pool:
   jobs={pool.submit(extract,game,items[i]):i for i in ids if str(i) not in cache['assets']}
   for job in cf.as_completed(jobs):
    try:
     key,asset=job.result(); cache['assets'][key]=asset; print(game,key,asset['sourceName'],flush=True)
    except Exception as e: errors.append((jobs[job],str(e))); print('ERROR',game,jobs[job],str(e)[:300],flush=True)
    cachepath.write_text(json.dumps(cache,ensure_ascii=False,separators=(',',':')),encoding='utf8')
  cache.update({'buildings':spec['buildings'],'units':spec['units'],'nature':spec['nature'],'repository':spec['repo']})
  cachepath.write_text(json.dumps(cache,ensure_ascii=False,separators=(',',':')),encoding='utf8')
  (ROOT/f'{game}-errors.json').write_text(json.dumps(errors,indent=2))
  print(game,'COMPLETE',len(cache['assets']),'errors',len(errors),flush=True)

if __name__=='__main__': main()

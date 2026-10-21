"""Extract the neutral home landmarks and first home chapter, never account data."""
from pathlib import Path
import hashlib,json,re,sys
root=Path(__file__).resolve().parents[1]
refs=Path(sys.argv[1])
chapter=refs/'wars-analysis/core/scripts/chapters/chapters/Chapter01Key.as'
text=chapter.read_text(encoding='utf-8-sig')
body=re.search(r'var _loc6_:Array = \[(.*?)\];',text[text.index('override public function setChapterMap'):],re.S)[1]
objects=[]
for i,m in enumerate(re.finditer(r'\{([^{}]*)\}',body)):
    item=m[1]
    values={k:int(v) for k,v in re.findall(r'"(tx|ty|id)":(\d+)',item)}
    if len(values)!=3:raise ValueError('Unresolved home chapter object')
    tag=re.search(r'"chapterId":"([^"]+)"',item)
    objects.append({'key':str(i),'id':values['id'],'x':values['tx'],'y':values['ty'],'tag':tag[1] if tag else '', 'neutral':'Constants.PLAYER_NEUTRAL' in item})
initial=json.loads((refs/'wars-initial.json').read_text(encoding='utf-8'))
landmarks=[{'key':str(k),'id':v[0],'x':v[1],'y':v[2]} for k,v in initial['maps'][0]['items'].items() if v[0] in (907,908,909)]
data={'version':1,'commit':'c3fceeb1f8e93734a293b9bc25ae6025656f6822','class':'chapters.chapters.Chapter01Key','classSha256':hashlib.sha256(chapter.read_bytes()).hexdigest(),'landmarks':landmarks,'objects':objects}
(root/'source-data/social-wars/home-map.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
(root/'dist/home-map-data.js').write_text('// Pinned home landmarks and Chapter01Key positions; see docs/HOME-MAP.md.\nexport const HOME_MAP_DATA='+json.dumps(data,ensure_ascii=False,separators=(',',':'))+';\n',encoding='utf-8')
print(f'{len(landmarks)} home landmarks; {len(objects)} chapter objects.')

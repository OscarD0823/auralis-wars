"""Read-only alpha inspection of generated directional PNGs; emit crop metadata.

Pixels are never edited. Reviewed frame substitutions exclude incorrect generated
walk poses rather than alternating a right-facing body with a left-facing one.
"""
from pathlib import Path
from PIL import Image
import json

ROOT = Path(__file__).resolve().parents[1] / 'dist' / 'auralis' / 'races'

def character_box(alpha):
    # A neighboring sprite can leave a few opaque edge pixels in an otherwise
    # clean gutter. Crop to the character's substantial connected components.
    w,h=alpha.size
    pixels=list(alpha.get_flattened_data())
    seen=bytearray(w*h)
    components=[]
    for start,p in enumerate(pixels):
        if p<=48 or seen[start]: continue
        stack=[start];seen[start]=1;count=0;l=w;t=h;rr=0;b=0
        while stack:
            at=stack.pop();x=at%w;y=at//w;count+=1
            l=min(l,x);t=min(t,y);rr=max(rr,x+1);b=max(b,y+1)
            for nx,ny in [(x-1,y),(x+1,y),(x,y-1),(x,y+1)]:
                if 0<=nx<w and 0<=ny<h:
                    n=ny*w+nx
                    if not seen[n] and pixels[n]>48: seen[n]=1;stack.append(n)
        components.append((count,(l,t,rr,b)))
    assert components
    biggest=max(c[0] for c in components)
    boxes=[box for count,box in components if count>=max(12,biggest*.02)]
    return min(b[0] for b in boxes),min(b[1] for b in boxes),max(b[2] for b in boxes),max(b[3] for b in boxes)

def edges(alpha, count, vertical=False):
    w,h = alpha.size
    length = w if vertical else h
    density = [sum(p > 48 for p in alpha.crop((n,0,n+1,h) if vertical else (0,n,w,n+1)).get_flattened_data()) for n in range(length)]
    result = [0]
    for i in range(1,count):
        ideal = round(length*i/count)
        radius = round(length/count*.12)
        result.append(min(range(ideal-radius,ideal+radius+1), key=lambda n:(density[n],abs(n-ideal))))
    return result+[length]

out = {}
for race in ['aurora','kharun','nebari','arca']:
    image = Image.open(ROOT / f'{race}-directional.png')
    assert image.mode == 'RGBA'
    alpha = image.getchannel('A')
    assert alpha.histogram()[0] > image.width*image.height*.25, f'{race}: real transparency required'
    ys = edges(alpha,6)
    frames, anchors = [], []
    for r in range(6):
        xs = edges(alpha.crop((0,ys[r],image.width,ys[r+1])),10,True)
        for c in range(10):
            region = alpha.crop((xs[c],ys[r],xs[c+1],ys[r+1]))
            box = character_box(region)
            assert box, (race,r,c)
            l,t,rr,b = box
            frames.append([xs[c]+l,ys[r]+t,rr-l,b-t])
            foot = region.crop((l,max(t,b-max(3,round((b-t)*.075))),rr,b))
            points = [i%foot.width for i,p in enumerate(foot.get_flattened_data()) if p>128]
            anchors.append([round(sum(points)/len(points),2) if points else (rr-l)/2,b-t])
    families=[]
    for family in range(4):
        col=(family%2)*5
        row=(family//2)*3
        directions=[[ (row+pose)*10+col+d for pose in range(3)] for d in range(5)]
        heights=[frames[seq[pose]][3] for seq in directions for pose in range(2)]
        families.append(dict(directions=directions,displayWidth=round(sorted(heights)[len(heights)//2]*.65,2)))
    # The alternate walk pose changed yaw in these generated cells. A stable
    # contact pose is preferable to flipping the torso on every other footfall.
    excluded={'aurora':[(1,4)],'kharun':[(0,1),(1,1)],'nebari':[],
              'arca':[(0,1),(0,2),(1,1),(1,2),(3,1),(3,2)]}[race]
    for family,direction in excluded:
        families[family]['directions'][direction][1]=families[family]['directions'][direction][0]
    # Aurora's front rifle walk cells lost their armor/rifle; keep its actual
    # front rifle stance instead of swapping the soldier into a civilian.
    if race=='aurora':
        seq=families[1]['directions'][4]
        seq[0]=seq[1]=seq[2]
    out[race]=dict(width=image.width,height=image.height,frames=frames,anchors=anchors,families=families)
(ROOT/'directional.json').write_text(json.dumps(out,separators=(',',':'))+'\n',encoding='utf-8')
print('240 directional crops inspected; generated source pixels unchanged.')

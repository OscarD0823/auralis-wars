"""Read original PNG alpha; emit crop/foot metadata without modifying any image."""
from pathlib import Path
from PIL import Image
import json

ROOT = Path(__file__).resolve().parents[1] / 'dist' / 'auralis' / 'races'

def separators(alpha, count, vertical=False):
    w, h = alpha.size
    length = w if vertical else h
    values = [sum(1 for p in alpha.crop((n, 0, n+1, h) if vertical else (0, n, w, n+1)).get_flattened_data() if p > 64) for n in range(length)]
    edges = [0]
    for i in range(1, count):
        ideal = round(i * length / count)
        radius = round(length / count * .17)
        # Prefer a clean gutter, then the closest pixel to the expected grid.
        edges.append(min(range(ideal-radius, ideal+radius+1), key=lambda n: (values[n], abs(n-ideal))))
    return edges + [length]

def extract(path, cols, rows, actors=False):
    image = Image.open(path)
    assert image.mode == 'RGBA', f'{path}: transparent RGBA required'
    alpha = image.getchannel('A')
    histogram = alpha.histogram()
    assert histogram[0] > image.width * image.height * .15, f'{path}: opaque background'
    frames, anchors, scales = [], [], []
    ys = separators(alpha, rows)
    for r in range(rows):
        xs = separators(alpha.crop((0, ys[r], image.width, ys[r+1])), cols, True)
        row = []
        for c in range(cols):
            region = alpha.crop((xs[c], ys[r], xs[c+1], ys[r+1]))
            box = region.point(lambda p: 255 if p > 32 else 0).getbbox()
            assert box, (path, r, c)
            l,t,rr,b = box
            frames.append([xs[c]+l, ys[r]+t, rr-l, b-t])
            row.append(b-t)
            # Feet, not weapon/tool extent, anchor all animation poses.
            foot = region.crop((l, max(t,b-max(3,round((b-t)*.08))), rr,b))
            positions = [i % foot.width for i,p in enumerate(foot.get_flattened_data()) if p > 96]
            anchors.append([round(sum(positions)/len(positions),2) if positions else (rr-l)/2, b-t])
        scales.append(round(max(row)*.65,2))
    return dict(width=image.width, height=image.height, frames=frames, **(dict(anchors=anchors,scales=scales) if actors else {}))

out = {}
for race in ['aurora','kharun','nebari','arca']:
    out[race] = {'actors':extract(ROOT / f'{race}-actors.png',6,5,True)}
    if race != 'aurora':
        out[race]['buildings'] = extract(ROOT / f'{race}-buildings.png',4,4)
(ROOT / 'atlas.json').write_text(json.dumps(out,ensure_ascii=False,separators=(',',':'))+'\n',encoding='utf-8')
print('Four civilizations: 120 actor poses and 48 new building crops; source pixels unchanged.')

import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
import {BUILDINGS,UNITS} from '../dist/catalog.js';
const root=path.resolve('dist'),atlas=JSON.parse(fs.readFileSync(path.join(root,'classic/atlas.json'),'utf8'));
const resolveLocal=url=>{const p=path.resolve(root,url);assert.ok(p.startsWith(root+path.sep),'Asset outside package');return p;};
const checked=new Set();
function webp(url){if(checked.has(url))return;const bytes=fs.readFileSync(resolveLocal(url));assert.equal(bytes.toString('ascii',0,4),'RIFF',url);assert.equal(bytes.toString('ascii',8,12),'WEBP',url);checked.add(url);}
function rectangles(frames){assert.ok(frames.length>0);for(const f of frames){assert.equal(f.length,4);assert.ok(f.every(Number.isFinite));assert.ok(f[0]>=0&&f[1]>=0&&f[2]>0&&f[3]>0);}}
const counted=new Set();let frames=0;
for(const[id,a]of Object.entries(atlas.assets)){
 assert.equal(String(a.sourceId),id);assert.match(a.source,/^https:\/\/raw\.githubusercontent\.com\/AcidCaos\/social(?:emperors|warriors)\/[0-9a-f]{40}\/assets\//);
 if(a.unavailable){assert.equal(a.file,'./classic/missing-source.svg');assert.match(fs.readFileSync(resolveLocal(a.file),'utf8'),/Gráfico no conservado/);assert.ok(atlas.unavailable.includes(+id));continue;}
 for(const url of[a.file,a.thumb])webp(url);rectangles(a.frames);
 for(const dirs of Object.values(a.states))for(const seq of dirs){assert.ok(seq.length>0);for(const n of seq)assert.ok(Number.isInteger(n)&&n>=0&&n<a.frames.length,'Bad animation frame');}
 if(a.clips)for(const[state,clips]of Object.entries(a.clips)){assert.equal(clips.length,a.states[state].length);for(const[d,clip]of clips.entries()){webp(clip.file);rectangles(clip.frames);assert.equal(clip.frames.length,a.states[state][d].length);}}
 if(!counted.has(a.file)){counted.add(a.file);frames+=a.frames.length;}
}
assert.deepEqual(Object.keys(atlas.buildings).sort(),Object.keys(BUILDINGS).sort());assert.deepEqual(Object.keys(atlas.units).sort(),[...Object.keys(UNITS),'settler'].sort());
for(const chain of Object.values(atlas.buildings))for(const id of chain)assert.ok(atlas.assets[id]);
for(const id of [...Object.values(atlas.units),...Object.values(atlas.nature)])assert.ok(atlas.assets[id]);
for(const id of Object.values(atlas.units)){const actor=atlas.assets[id];if(actor.unavailable)continue;assert.equal(actor.states.walk?.length,5,'Missing movement directions for '+actor.name);assert.ok(actor.clips?.walk,'Whole-movie loading still enabled for '+actor.name);assert.ok(Math.max(actor.width,actor.height)<=256);}
const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8'),files=new Set(JSON.parse(sw.match(/FILES=(\[.*?\]);/)[1]));
for(const a of Object.values(atlas.assets)){const required=[a.thumb,...(a.clips?Object.values(a.clips).flat().map(c=>c.file):[a.file])];for(const url of required)assert.ok(files.has(url),'Offline cache misses '+url);if(a.clips)assert.equal(files.has(a.file),false,'Whole animation movie must not duplicate directional download');}
const missing=JSON.parse(fs.readFileSync('source-data/social-wars/graphics-missing.json','utf8'));assert.deepEqual(atlas.unavailable,missing.missing.map(m=>m.sourceId));
console.log('PASS: source provenance, '+counted.size+' shared movies, '+frames+' frames, '+Object.keys(atlas.units).length+' actor mappings, directional clips, offline assets and '+atlas.unavailable.length+' explicitly absent source movies.');

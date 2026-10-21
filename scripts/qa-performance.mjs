import {createRequire} from 'node:module';
import fs from 'node:fs';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({headless:true,channel:process.env.PLAYWRIGHT_CHANNEL||'msedge'});
const page=await browser.newPage({viewport:{width:1440,height:960},serviceWorkers:'block'});
const errors=[],requests=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',async r=>{const bytes=(await r.body().catch(()=>Buffer.alloc(0))).length;requests.push({url:new URL(r.url()).pathname,bytes});});
try{
 await page.goto(process.argv[2]||'http://127.0.0.1:4191/');await page.waitForSelector('[data-action=begin]');
 await page.locator('[data-action=begin]').click();await page.waitForFunction(()=>Number(document.querySelector('#world').dataset.sprites)>20);
 const result=await page.evaluate(async()=>{
  const E=await import('./engine.js'),G=await import('./scene-classic.js');await G.ready;
  const canvas=document.createElement('canvas');canvas.style='position:fixed;left:0;top:0;width:1200px;height:800px;pointer-events:none';document.body.append(canvas);
  const scene=new G.Battlefield(canvas,()=>{});const s=E.createState(341);scene.draw(s);await new Promise(r=>setTimeout(r,1500));
  const samples=[];
  for(const [name,width,height,zoom,military]of[['base',1200,800,1.15,6],['zoom-out',1200,800,.5,6],['mobile',390,700,.9,6],['army-80',1200,800,1.15,80]]){
   canvas.style.width=width+'px';canvas.style.height=height+'px';scene.fit();scene.zoom=zoom;scene.updateCamera();s.army.length=0;for(let i=0;i<military;i++)s.army.push(E.makeUnit(s,'rifle'));
   for(let i=0;i<12;i++)scene.draw(s);
   const counters={};const originals={};for(const method of['fill','stroke','drawImage','getImageData']){originals[method]=scene.ctx[method];scene.ctx[method]=function(...args){counters[method]=(counters[method]||0)+1;return originals[method].apply(this,args);};}
   const durations=[];for(let i=0;i<150;i++){s.time=i/25;const t=performance.now();scene.draw(s);durations.push(performance.now()-t);}
   for(const [method,original]of Object.entries(originals))scene.ctx[method]=original;
   durations.sort((a,b)=>a-b);samples.push({name,p50:durations[75],p95:durations[142],mean:durations.reduce((a,b)=>a+b)/durations.length,callsPerFrame:Object.fromEntries(Object.entries(counters).map(([k,v])=>[k,v/150])),stats:scene.stats||null});
  }
  // Hit test a known opaque pixel; repeated tests should reuse its alpha mask.
  const hq=scene.pickSprites.find(p=>!p.actorId&&p.worldX===14.5&&p.worldY===13.5);let hitMs=null;if(hq){const x=hq.x+hq.w*.5,y=hq.y+hq.h*.65,t=performance.now();for(let i=0;i<100;i++)scene.hit(x,y);hitMs=(performance.now()-t)/100;}
  canvas.remove();scene.resize.disconnect();return{samples,hitMs,dpr:devicePixelRatio};
 });
 await page.waitForTimeout(1000);result.requests=requests;result.initialBytes=requests.reduce((n,r)=>n+r.bytes,0);result.errors=errors;
 const out=process.argv[3]||'artifacts/performance.json';fs.mkdirSync('artifacts',{recursive:true});fs.writeFileSync(out,JSON.stringify(result,null,2));console.log(JSON.stringify({samples:result.samples,hitMs:result.hitMs,initialBytes:result.initialBytes,errors},null,2));
 if(errors.length)process.exitCode=1;
}finally{await browser.close();}

import {createRequire} from 'node:module';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import * as E from '../dist/engine.js';
import {GAME} from '../dist/config.js';

const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE||'playwright');
const base=process.argv[2]||'http://127.0.0.1:4191/';
const browser=await chromium.launch({headless:true,channel:process.env.PLAYWRIGHT_CHANNEL||'msedge'});
const key=GAME.id+'-campaign-v1',errors=[];
try {
 const context=await browser.newContext({viewport:{width:1440,height:960}}),page=await context.newPage();
 page.on('pageerror',e=>errors.push(e.stack));
 page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});
 const state=E.createIslandState(341);state.tutorial=true;state.settings.sound=false;state.nextRaid=1e12;
 await page.addInitScript(async({key,raw})=>{if(!sessionStorage.getItem('hud-fixture')){localStorage.setItem(key,raw);sessionStorage.setItem('hud-fixture','1');await caches.open('auralis-wars-v0.8.0');}},{key,raw:E.encode(state)});
 await page.goto(base+'?v=0.8.0');
 await page.waitForURL(url=>url.searchParams.get('v')===GAME.version);
 await page.waitForSelector('#world[data-renderer=classic-isometric]');
 await page.waitForFunction(()=>[...document.querySelectorAll('.resource .hud-art')].every(i=>i.complete&&i.naturalWidth>0));
 const save=async()=>{await page.evaluate(()=>dispatchEvent(new Event('pagehide')));return page.evaluate(key=>JSON.parse(localStorage.getItem(key)),key);};
 let saved=await save();assert.equal(saved.seed,state.seed);assert.deepEqual(saved.army.map(u=>u.id),state.army.map(u=>u.id));
 assert.equal(await page.locator('#navigation button').count(),5);
 assert.equal(await page.locator('#mission-navigation button').count(),3);
 await page.evaluate(async()=>{const {Battlefield}=await import('./scene-classic.js'),draw=Battlefield.prototype.draw;Battlefield.prototype.draw=function(...args){if(this.canvas.id==='world')window.qaField=this;return draw.apply(this,args);};});
 await page.locator('.roster-card').first().click();
 await page.waitForSelector('.roster-card[aria-pressed=true]');
 await page.locator('[data-action=home-hold]').click();
 saved=await save();assert.ok(saved.army.every(u=>u.order.kind==='hold'));
 await page.locator('[data-action=deselect]').click();
 await page.locator('#zoom-slider').fill('15');await page.waitForTimeout(80);
 assert.ok(await page.evaluate(()=>window.qaField.zoom<.2));
 await page.locator('[data-action=center]').click();
 await page.waitForTimeout(250);await page.screenshot({path:'artifacts/v090-base-desktop.png'});
 await page.locator('#navigation [data-type=build]').click();
 await page.waitForTimeout(1300); // Includes the periodic HUD/portrait refresh.
 assert.equal(await page.locator('.shop-categories .hud-art').count(),9);
 assert.equal(await page.locator('#panel .card img').evaluateAll(images=>images.every(i=>i.complete&&i.naturalWidth>0)),true);
 await page.screenshot({path:'artifacts/v090-build-desktop.png'});
 await page.locator('[data-action=category][data-type=defense]').click();
 assert.ok(await page.locator('#panel .card').count()>0);
 await page.locator('[data-action=category][data-type=all]').click();
 await page.locator('[data-action=close-panel]').click();
 await page.locator('#mission-navigation [data-type=campaign]').click();
 assert.equal(await page.locator('.mission-card').count(),23);
 await page.locator('[data-action=close-panel]').click();
 await page.locator('#mission-navigation [data-type=tasks]').click();
 assert.ok(await page.locator('.quest-card').count()>0);
 await page.locator('[data-action=close-panel]').click();
 await page.locator('#home-notice').click();
 assert.match(await page.locator('#modal-content').textContent(),/cuatro soldados/);
 await page.locator('[data-action=close-modal]').first().click();
 const viewports=[{width:320,height:844},{width:390,height:844},{width:768,height:844},{width:844,height:390},{width:768,height:500}];
 for(const viewport of viewports){
  await page.setViewportSize(viewport);await page.waitForTimeout(150);
  const bounds=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,controls:[...document.querySelectorAll('#navigation button,#mission-navigation button,.population,#commander,[data-action=settings]')].map(el=>{const r=el.getBoundingClientRect();return{x:r.x,y:r.y,right:r.right,bottom:r.bottom};})}));
  assert.equal(bounds.overflow,false,'Page overflows '+viewport.width);
  assert.ok(bounds.controls.every(r=>r.x>=0&&r.y>=0&&r.right<=viewport.width+1&&r.bottom<=viewport.height+1),'Control outside viewport '+JSON.stringify({viewport,bounds}));
  if(viewport.width===390)await page.screenshot({path:'artifacts/v090-base-mobile.png'});
  for(const tab of ['build','army','workers','territory']){
   await page.locator('#navigation [data-type='+tab+']').click();
   const close=page.locator('[data-action=close-panel]');assert.equal(await close.isVisible(),true);
   const rect=await close.boundingBox();assert.ok(rect.y>=0&&rect.y+rect.height<=viewport.height);
   if(tab==='build')assert.equal(await page.locator('.card .cost .hud-art').evaluateAll(images=>images.every(i=>{const r=i.getBoundingClientRect();return r.width<=24&&r.height<=24;})),true,'Resource icons must not expand to building-preview size');
   if(viewport.width===390&&tab==='build')await page.screenshot({path:'artifacts/v090-build-mobile.png'});
   await close.click();
  }
  await page.locator('[data-action=settings]').click();assert.equal(await page.locator('[data-action=difficulty]').count(),3);
  await page.locator('[data-action=close-modal]').first().click();
 }
 await page.setViewportSize({width:390,height:844});
 await page.evaluate(()=>navigator.serviceWorker.ready);await context.setOffline(true);await page.reload();
 await page.waitForSelector('#world[data-renderer=classic-isometric]');
 await page.waitForFunction(()=>[...document.querySelectorAll('.resource .hud-art')].every(i=>i.complete&&i.naturalWidth>0));
 await page.locator('#navigation [data-type=build]').click();
 await page.waitForFunction(()=>[...document.querySelectorAll('.shop-categories .hud-art')].every(i=>i.complete&&i.naturalWidth>0));
 assert.equal((await save()).seed,state.seed);assert.deepEqual(errors,[]);
 fs.writeFileSync('artifacts/classic-hud-qa.json',JSON.stringify({version:GAME.version,originalBitmaps:31,staleCacheUpdated:true,savePreserved:true,rosterSelectAndHold:true,zoomSlider:true,menuPortraitsStable:true,campaignMissions:23,viewports,offlineInterface:true,errors},null,2));
 console.log('PASS: original HUD assets; v0.8 cache update; preserved save; garrison selection/orders; zoom; menus/portraits; 23 operations; 320/390/768px and landscape; offline interface.');
} finally {await browser.close();}

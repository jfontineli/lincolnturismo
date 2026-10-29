import { chromium } from '@playwright/test';
import {spawn} from 'node:child_process';
import fs from 'node:fs';
import assert from 'node:assert/strict';
fs.mkdirSync('test-results',{recursive:true});
const server=spawn(process.execPath,['tools/serve.mjs'],{env:{...process.env,PORT:'4175'},stdio:'pipe'});
let browser;
try {
 await new Promise((resolve,reject)=>{server.stdout.once('data',resolve);server.once('error',reject);setTimeout(()=>reject(new Error('Servidor não iniciou')),15000).unref();});
 browser=await chromium.launch({channel:'chrome',headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const response=await page.goto('http://127.0.0.1:4175',{waitUntil:'networkidle'});assert.equal(response.status(),200);
 await page.evaluate(async()=>{for(const img of document.images){img.loading='eager';}await Promise.all([...document.images].map(img=>img.decode().catch(()=>{})));});
 await page.screenshot({path:'test-results/desktop.png',fullPage:true});
 assert.equal(await page.locator('.gallery-item').count(),4);
 await page.locator('#intro-video').click();assert(await page.locator('#media-dialog').isVisible());assert((await page.locator('#media-dialog video').getAttribute('src')).endsWith('video-01.mp4'));await page.keyboard.press('Escape');
 assert.equal(await page.locator('.picture-label').count(),0);
 assert.equal(await page.locator('.credential').textContent(),'Guia de turismo credenciado');
 assert.equal(await page.locator('a[href="https://www.instagram.com/lincolnturismoalagoas/"]').count(),2);
 await page.locator('.gallery-item').first().click();assert(await page.locator('#media-dialog').isVisible());
 assert.equal(await page.locator('video').count(),1);await page.keyboard.press('Escape');assert(!(await page.locator('#media-dialog').isVisible()));
 await page.locator('#gallery-more').click();assert.equal(await page.locator('.gallery-item').count(),12);
 await page.locator('#gallery-more').click();await page.locator('#gallery-more').click();assert.equal(await page.locator('.gallery-item').count(),27);assert(!(await page.locator('#gallery-more').isVisible()));
 await page.locator('[data-gallery="photos"]').click();await page.locator('#gallery-more').click();assert.equal(await page.locator('.gallery-item').count(),8);
 await page.locator('[data-destination="Maragogi"]').click();assert.equal(await page.locator('#destination').inputValue(),'Maragogi');
 await page.locator('[data-service="Passeio de lancha"]').click();assert.equal(await page.locator('#service').inputValue(),'Passeio de lancha');
 await page.locator('[name="name"]').fill('Teste de navegação');
 await page.evaluate(()=>{window.open=(url)=>{window.__opened=url;return null;};});
 await page.locator('.form-submit').click();
 const target=await page.evaluate(()=>window.__opened);assert(target.startsWith('https://wa.me/5564996465656?text='));assert(decodeURIComponent(target).includes('Maragogi'));
 await page.locator('button[value="email"]').click({noWaitAfter:true});assert((await page.locator('#form-status a').getAttribute('href')).startsWith('mailto:lincolnturismo@gmail.com?'));
 await page.locator('#privacy-open').click();assert(await page.locator('#privacy-dialog').isVisible());await page.keyboard.press('Escape');
 for(const width of [390,320,768]){
  await page.setViewportSize({width,height:844});await page.goto('http://127.0.0.1:4175',{waitUntil:'networkidle'});
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),`Overflow em ${width}`);
  await page.locator('.menu-toggle').click();assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'true');await page.locator('#navigation a').first().click();assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false');
  if(width===390){await page.evaluate(async()=>{window.scrollTo(0,0);for(const img of document.images)img.loading='eager';await Promise.all([...document.images].map(img=>img.decode().catch(()=>{})));});await page.screenshot({path:'test-results/mobile.png',fullPage:true});}
 }
 assert.equal(errors.length,0,errors.join('\n'));
 const range=await page.request.get('http://127.0.0.1:4175/assets/videos/video-01.mp4',{headers:{Range:'bytes=0-99'}});assert.equal(range.status(),206);assert.equal((await range.body()).length,100);
 console.log('OK: desktop, celular 320/390/768px, menu, galeria completa, modal, WhatsApp, e-mail, privacidade e streaming. Sem erros JavaScript.');
} finally {await browser?.close();server.kill();}

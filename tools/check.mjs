import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import vm from 'node:vm';
const root=path.resolve('site');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
for(const match of html.matchAll(/(?:src|href)="([^"]+)"/g)){
 const ref=match[1]; if(/^(https?:|mailto:|#)/.test(ref))continue;
 assert(fs.existsSync(path.join(root,ref)),`Arquivo ausente: ${ref}`);
}
const ids=[...html.matchAll(/id="([^"]+)"/g)].map(m=>m[1]);
assert.equal(new Set(ids).size,ids.length,'IDs duplicados');
for(const m of html.matchAll(/href="#([^"]+)"/g))assert(ids.includes(m[1]),`Âncora ausente: ${m[1]}`);
assert.equal(fs.readdirSync(path.join(root,'assets/videos')).length,27);
assert.equal(fs.readdirSync(path.join(root,'assets/posters')).length,27);
const ctx={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'config.js'),'utf8'),ctx);
assert.equal(ctx.window.LINCOLN.whatsapp,'5564996465656');
assert.equal(ctx.window.LINCOLN.email,'lincolnturismoalagoas@gmail.com');
assert(!html.includes('Elias Damas'),'Endereço privado na página');
console.log('OK: arquivos, âncoras, contatos, 27 vídeos e 27 capas.');

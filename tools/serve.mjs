import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root = path.resolve(fileURLToPath(new URL('../site/',import.meta.url)));
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp','.jpg':'image/jpeg','.mp4':'video/mp4','.xml':'application/xml','.txt':'text/plain; charset=utf-8'};
const server = http.createServer((req,res) => {
  let pathname; try {pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname);} catch {res.writeHead(400).end(); return;}
  const file = path.resolve(root, `.${pathname === '/' ? '/index.html' : pathname}`);
  if (!file.startsWith(root + path.sep) && file !== path.join(root,'index.html')) { res.writeHead(403).end(); return; }
  fs.stat(file,(err,stat) => {
    if (err || !stat.isFile()) {res.writeHead(404).end('Não encontrado');return;}
    const headers = {'Content-Type':types[path.extname(file)] || 'application/octet-stream','Accept-Ranges':'bytes','Cache-Control':'no-cache'};
    const range = req.headers.range;
    if (range) {const match = /^bytes=(\d+)-(\d*)$/.exec(range); if (!match) {res.writeHead(416).end();return;} const start=Number(match[1]),end=match[2]?Math.min(Number(match[2]),stat.size-1):stat.size-1; if (start>end || start>=stat.size) {res.writeHead(416,{'Content-Range':`bytes */${stat.size}`}).end();return;} res.writeHead(206,{...headers,'Content-Length':end-start+1,'Content-Range':`bytes ${start}-${end}/${stat.size}`}); if(req.method==='HEAD')res.end();else fs.createReadStream(file,{start,end}).pipe(res);}
    else {res.writeHead(200,{...headers,'Content-Length':stat.size});if(req.method==='HEAD')res.end();else fs.createReadStream(file).pipe(res);}
  });
});
server.listen(Number(process.env.PORT || 4173),'127.0.0.1',()=>console.log(`Lincoln Turismo: http://localhost:${server.address().port}`));

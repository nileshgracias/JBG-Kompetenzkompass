import fs from 'node:fs';
const read=f=>fs.readFileSync(new URL(f,import.meta.url));
const files=Object.fromEntries(['index.html','app.js','config.json','logo.png','portraits.jpg'].map(f=>['/'+(f==='index.html'?'':f),{type:f.endsWith('.png')?'image/png':f.endsWith('.jpg')?'image/jpeg':f.endsWith('.js')?'text/javascript; charset=utf-8':f.endsWith('.json')?'application/json; charset=utf-8':'text/html; charset=utf-8',body:read(f).toString('base64')}]));
const defaults=JSON.parse(read('config.json'));const backend=read('backend.mjs').toString();
fs.mkdirSync('worker',{recursive:true});fs.mkdirSync('dist/server',{recursive:true});fs.mkdirSync('dist/.openai',{recursive:true});
const code=backend+'\nconst assets='+JSON.stringify(files)+';\nconst defaults='+JSON.stringify(defaults)+';\nexport default {async fetch(request,env){const path=new URL(request.url).pathname;if(path==="/api/config")return configAPI(request,env,defaults);const asset=assets[path];if(!asset)return new Response("Not found",{status:404});const bytes=Uint8Array.from(atob(asset.body),c=>c.charCodeAt(0));return new Response(bytes,{headers:{"Content-Type":asset.type,"Cache-Control":"no-cache","X-Content-Type-Options":"nosniff"}})}};';
fs.writeFileSync('worker/index.js',code);fs.writeFileSync('dist/server/index.js',code);fs.copyFileSync('.openai/hosting.json','dist/.openai/hosting.json');

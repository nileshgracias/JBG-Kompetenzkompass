import assert from 'node:assert/strict';import {readFile} from 'node:fs/promises';import {configAPI} from './backend.mjs';
const defaults=JSON.parse(await readFile(new URL('config.json',import.meta.url)));let stored=null,etag='';const env={BUCKET:{async get(){return stored?{json:async()=>stored,etag,httpEtag:'"'+etag+'"'}:null},async put(k,v,opts){if(stored&&opts.onlyIf.etagMatches!==etag)return null;stored=JSON.parse(v);etag='rev-'+Date.now();return {etag,httpEtag:'"'+etag+'"'}}}};
const req=(method,body,revision='"seed"',origin='https://demo.test')=>new Request('https://demo.test/api/config',{method,headers:{Origin:origin,'X-JBG-Request':'config','Content-Type':'application/json','If-Match':revision},...(body?{body:JSON.stringify(body)}:{})});
let r=await configAPI(req('GET'),env,defaults);assert.equal(r.status,200);assert.equal(r.headers.get('ETag'),'"seed"');
assert.equal((await configAPI(req('PUT',defaults,'"seed"','https://evil.test'),env,defaults)).status,403);
let bad=structuredClone(defaults);bad.catalogs.fach[0].phrases=['missing'];assert.equal((await configAPI(req('PUT',bad),env,defaults)).status,400);
let edited=structuredClone(defaults);edited.catalogs.fach[0].title='Persistenztest';r=await configAPI(req('PUT',edited),env,defaults);assert.equal(r.status,200);assert.equal((await (await configAPI(req('GET'),env,defaults)).json()).catalogs.fach[0].title,'Persistenztest');assert.equal((await configAPI(req('PUT',defaults),env,defaults)).status,409);
assert.equal((await configAPI(req('POST',defaults),env,defaults)).status,405);assert.equal((await configAPI(req('GET'),{},defaults)).status,503);
console.log('7 backend checks passed: seed, persistence, origin rejection, validation, revision conflict, method, unavailable storage.');

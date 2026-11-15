// Private Sites deployment: platform restricts this entire app to its owner.
// No credentials are stored in this file. GitHub Pages serves only the static UI.
export function validateConfig(c){
 if(!c||c.version!==2||typeof c.title!=='string'||!c.title.trim()||c.title.length>200||typeof c.school!=='string'||!c.school.trim()||c.school.length>300)throw Error('Invalid metadata');
 const ids=new Set();for(const a of ['fach','sozial']){if(!Array.isArray(c.catalogs?.[a])||c.catalogs[a].length>100)throw Error('Invalid catalog');for(const r of c.catalogs[a]){if(typeof r.id!=='string'||!/^[-a-zA-Z0-9]+$/.test(r.id)||r.id.length>100||ids.has(r.id))throw Error('Invalid ID');ids.add(r.id);if(!Array.isArray(r.phrases)||r.phrases.length!==4||![r.title,r.text,...r.phrases].every(t=>typeof t==='string'&&t.trim()&&t.length<=2000))throw Error('Invalid competency');}}
 if(!Array.isArray(c.profiles)||c.profiles.length!==6||c.profiles.some(p=>!['name','need','support','strengths'].every(k=>typeof p[k]==='string'&&p[k].length<=2000)))throw Error('Invalid profiles');return c;
}
const json=(v,status=200,headers={})=>new Response(JSON.stringify(v),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff',...headers}});
export async function configAPI(request,env,defaults){
 const url=new URL(request.url);
 if(!env.BUCKET)return json({error:'Persistent storage unavailable'},503);
 if(request.method==='GET'){
  const obj=await env.BUCKET.get('demo/config-v2.json');
  return json(obj?await obj.json():defaults,200,{ETag:obj?obj.httpEtag:'"seed"'});
 }
 if(request.method!=='PUT')return json({error:'Method not allowed'},405,{Allow:'GET, PUT'});
 // Private hosting is the authorization boundary; block cross-origin writes as well.
 if(request.headers.get('Origin')!==url.origin||request.headers.get('X-JBG-Request')!=='config')return json({error:'Forbidden origin'},403);
 if(!request.headers.get('Content-Type')?.startsWith('application/json'))return json({error:'JSON required'},415);
 if(Number(request.headers.get('Content-Length')||0)>250000)return json({error:'Too large'},413);
 let data;try{let body=await request.text();if(body.length>250000)return json({error:'Too large'},413);data=validateConfig(JSON.parse(body));}catch{return json({error:'Invalid configuration'},400)}
 const expected=request.headers.get('If-Match');if(!expected)return json({error:'Revision required'},428);
 const current=await env.BUCKET.get('demo/config-v2.json');const rev=current?current.httpEtag:'"seed"';
 if(expected!==rev)return json({error:'Configuration changed; reload before saving'},409);
 const options={httpMetadata:{contentType:'application/json'},onlyIf:current?{etagMatches:current.etag}:{etagDoesNotMatch:'*'}};
 const put=await env.BUCKET.put('demo/config-v2.json',JSON.stringify(data),options);
 if(!put)return json({error:'Concurrent update'},409);
 return json({saved:true},200,{ETag:put.httpEtag});
}

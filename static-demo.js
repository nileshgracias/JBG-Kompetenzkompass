// Public GitHub Pages cannot run a backend. This adapter is a clearly labelled
// browser-local simulation, never an authorization boundary for school data.
window.JBGTransportReady=(async()=>{
 const local=['127.0.0.1','localhost'].includes(location.hostname);
 const enabled=location.hostname.endsWith('.github.io')||(local&&new URLSearchParams(location.search).get('static-demo')==='1');
 if(!enabled)return;
 const nativeFetch=window.fetch.bind(window),[{recordAction,historyRecords}, {validateConfig}]=await Promise.all([import('./ledger.mjs'),import('./backend.mjs')]);
 const baseline=validateConfig(await (await nativeFetch(new URL('config.json',document.baseURI))).json());
 const LEDGER='jbg-public-ledger-v3',CONFIG='jbg-public-config-v3',ROLE='jbg-public-role-v3';
 function read(key,fallback){const raw=localStorage.getItem(key);return raw?JSON.parse(raw):structuredClone(fallback)}
 let chain=Promise.resolve();const serialized=fn=>{const run=()=>{const p=chain.then(fn);chain=p.catch(()=>{});return p};return navigator.locks?navigator.locks.request('jbg-public-demo-v3',run):run()};
 const store={transaction:fn=>serialized(async()=>{let data=read(LEDGER,{records:{}});const result=await fn(data);localStorage.setItem(LEDGER,JSON.stringify(data));return result})};
 const config=()=>read(CONFIG,{revision:1,data:baseline});
 const who=()=>{const role=sessionStorage.getItem(ROLE);return role?{id:role==='coordinator'?'demo-coordinator':'demo-teacher',name:role==='coordinator'?'Beauftragte/r · Demo':'Lehrkraft · Demo',role,demo:true,storage:'browser'}:{role:null,demo:true,storage:'browser'}};
 const reply=(data,status=200,headers={})=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store',...headers}});
 const raise=(message,status)=>{throw Object.assign(Error(message),{status})};
 // Freeze demo history from the shipped baseline before any template edits.
 for(const student of ['0','1','2','3','4','5'])await historyRecords(store,baseline,{id:'demo-seeder',name:'Demo-Import',role:'coordinator'},{course:'wp',student});
 window.fetch=async(input,init={})=>{
  const url=new URL(typeof input==='string'?input:input.url,location.href),p=url.pathname;
  if(url.origin!==location.origin||!['/api/session','/api/history','/api/record','/api/queue','/api/config'].includes(p))return nativeFetch(input,init);
  try{
   const method=(init.method||'GET').toUpperCase(),headers=new Headers(init.headers),body=init.body?JSON.parse(init.body):{};
   if(p==='/api/session'){
    if(method==='POST'){if(!['teacher','coordinator'].includes(body.role))raise('Unbekannte Demo-Rolle.',400);sessionStorage.setItem(ROLE,body.role)}
    else if(method!=='GET')raise('Methode nicht erlaubt.',405);return reply(who());
   }
   const actor=who();if(!actor.role)raise('Demo-Rolle auswählen.',401);
   if(method!=='GET'&&headers.get('X-JBG-Request')!=='preview')raise('Ungültige Anfrage.',403);
   if(p==='/api/config'){
    if(method==='GET'){const c=config();return reply(c.data,200,{ETag:'"'+c.revision+'"'})}
    if(method!=='PUT')raise('Methode nicht erlaubt.',405);if(actor.role!=='coordinator')raise('Nur der Beauftragte darf Vorlagen ändern.',403);
    return await serialized(async()=>{const current=config();if(headers.get('If-Match')!=='"'+current.revision+'"')raise('Konfiguration inzwischen geändert. Bitte neu laden.',409);const data=validateConfig(body),revision=current.revision+1;localStorage.setItem(CONFIG,JSON.stringify({data,revision}));return reply({saved:true},200,{ETag:'"'+revision+'"'})});
   }
   if(p==='/api/queue'&&method==='GET'){if(actor.role!=='coordinator')raise('Nur für den Beauftragten.',403);return reply(await store.transaction(d=>Object.values(d.records||{})))}
   if(p==='/api/history'&&method==='GET')return reply(await historyRecords(store,config().data,actor,Object.fromEntries(url.searchParams)));
   if(p==='/api/record'){
    const action=method==='GET'?'get':url.searchParams.get('action');if(!['GET','POST'].includes(method)||method==='POST'&&action==='get')raise('Methode nicht erlaubt.',405);
    return reply(await recordAction(store,config().data,actor,action,method==='GET'?Object.fromEntries(url.searchParams):body));
   }
   return reply({error:'Methode nicht erlaubt.'},405);
  }catch(e){return reply({error:e.status?e.message:'Die lokale Demo konnte nicht gespeichert werden.'},e.status||503)}
 };
})().catch(e=>{window.JBGTransportError=e;throw e});

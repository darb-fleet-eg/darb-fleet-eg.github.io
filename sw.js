const C='darb-v12',T='darb-tiles',MAXT=1500;
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(['./','index.html','data.js','leaflet.js','leaflet.css','icon.svg','manifest.json']).catch(()=>{})));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C&&x!==T).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
let puts=0;
async function trim(c){try{const k=await c.keys();if(k.length>MAXT)await Promise.all(k.slice(0,k.length-MAXT+100).map(x=>c.delete(x)))}catch(e){}}
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);
 if(e.request.method==='GET'&&u.hostname==='tile.openstreetmap.org'){e.respondWith(caches.open(T).then(async c=>{const hit=await c.match(e.request.url);if(hit)return hit;try{const r=await fetch(e.request.url,{mode:'cors',credentials:'omit'});if(r.ok){c.put(e.request.url,r.clone()).then(()=>{if(++puts%50===0)trim(c)}).catch(()=>{})}return r}catch(x){return fetch(e.request)}}));return}
 if(e.request.method!=='GET'||u.origin!==location.origin)return;e.respondWith(fetch(e.request).then(r=>{const k=r.clone();caches.open(C).then(c=>c.put(e.request,k)).catch(()=>{});return r}).catch(()=>caches.match(e.request)))});

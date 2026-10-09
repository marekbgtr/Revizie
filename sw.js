'use strict';
const PREFIX='revizie-sps:'+self.registration.scope+':';
const CACHE=PREFIX+'61991fc37510fd97';
const names=['index.html','manifest.webmanifest','icon-192.png','icon-512.png','apple-touch-icon.png'];
const urls=names.map(p=>new URL(p,self.registration.scope).href);
self.addEventListener('install',event=>{event.waitUntil((async()=>{
 const cache=await caches.open(CACHE);
 try{for(const url of urls){const r=await fetch(new Request(url,{cache:'reload'}));if(!r.ok||r.redirected)throw Error('Asset unavailable');if(url===urls[0]&&!(await r.clone().text()).includes('name="revizie-app"'))throw Error('Not the app shell');await cache.put(url,r);}}
 catch(e){await caches.delete(CACHE);throw e;}
 // No skipWaiting: an update must never interrupt an open XLSX session.
})());});
self.addEventListener('activate',event=>{event.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith(PREFIX)&&key!==CACHE)await caches.delete(key);await self.clients.claim();})());});
self.addEventListener('fetch',event=>{
 const request=event.request,url=new URL(request.url),base=new URL(self.registration.scope);
 if(request.method!=='GET'||url.origin!==base.origin)return;
 const shell=request.mode==='navigate'&&(url.pathname===base.pathname||url.pathname===new URL('index.html',base).pathname);
 const key=shell?urls[0]:url.href;if(!shell&&!urls.includes(key))return;
 event.respondWith((async()=>{const cache=await caches.open(CACHE);return (await cache.match(key))||fetch(request);})());
});

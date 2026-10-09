const CACHE='pialando-radio-v1';
const CORE=['/radio/','/radio/index.html','/radio/manifest.webmanifest','/shared.css','/radio/app.js','/config.js','/assets/logo-pialando.png','/assets/fondo-vertical.png','/assets/fondo-horizontal.png','/assets/facundo-pialando.png','/icons/radio-192.png','/icons/radio-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(u.origin!==location.origin) return;
  if(u.pathname.includes('/.netlify/functions/')||u.pathname.includes('/stream')||u.pathname.includes('/radio-config')) return;
  e.respondWith(caches.match(e.request).then(c=>c||fetch(e.request).then(r=>{if(e.request.method==='GET'&&r.ok){const copy=r.clone();caches.open(CACHE).then(x=>x.put(e.request,copy))}return r}).catch(()=>c)));
});

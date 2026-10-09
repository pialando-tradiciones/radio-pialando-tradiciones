const CACHE='pialando-admin-v1';
const CORE=['/admin/','/admin/index.html','/admin/manifest.webmanifest','/shared.css','/admin/app.js','/config.js','/assets/logo-pialando.png','/assets/fondo-vertical.png','/assets/fondo-horizontal.png','/assets/facundo-pialando.png','/icons/admin-192.png','/icons/admin-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(u.origin!==location.origin) return;
  if(u.pathname.includes('/.netlify/functions/')||u.pathname.includes('/stream')||u.pathname.includes('/radio-config')) return;
  e.respondWith(caches.match(e.request).then(c=>c||fetch(e.request).then(r=>{if(e.request.method==='GET'&&r.ok){const copy=r.clone();caches.open(CACHE).then(x=>x.put(e.request,copy))}return r}).catch(()=>c)));
});

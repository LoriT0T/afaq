/* Āfāq — offline shell. Bump CACHE on any asset change. */
const CACHE = 'afaq-v7';
const ASSETS = ['./','index.html','css/app.css','js/app.js','js/art.js','js/store.js','js/data.js','js/taste.js','js/engine.js','js/ladders.js',
  'manifest.webmanifest','icon-192.png','icon-512.png','icon-180.png','icon.svg'];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    // {cache:'reload'} — otherwise addAll refills a bumped cache from the HTTP cache
    // with the very files the bump exists to replace.
    await Promise.all(ASSETS.map(u => c.add(new Request(u, { cache:'reload' })).catch(()=>{})));
    self.skipWaiting();
  })());
});
self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for(const k of await caches.keys()) if(k !== CACHE) await caches.delete(k);
    await self.clients.claim();
  })());
});
/* Network-first, cache as fallback. Cache-first is the usual PWA default and it is wrong
 * here: a shipped fix keeps showing the old code until the cache version happens to be
 * bumped, and the failure is silent. Offline still works — every ok response is written
 * back on the way past. */
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if(e.request.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith((async () => {
    try{
      const res = await fetch(e.request, { cache:'no-store' });
      if(res && res.ok){ const cp = res.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); }
      return res;
    }catch{
      return (await caches.match(e.request)) || (await caches.match('index.html'));
    }
  })());
});

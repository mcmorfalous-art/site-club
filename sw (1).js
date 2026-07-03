/* MC Les Morfalous — Service Worker
   Stratégie NETWORK-FIRST : on prend toujours la version en ligne si dispo,
   le cache ne sert QUE de secours hors-ligne. Évite d'afficher une vieille version figée.
   Pense à changer CACHE_VERSION à chaque grosse mise à jour. */
const CACHE_VERSION = 'mcm-v1';
const CORE = ['./', './index.html', './icon-192.png', './icon-512.png', './manifest.json'];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE_VERSION).then((c) => c.addAll(CORE)).catch(()=>{}));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  // On ne gère que les GET du même site ; le reste (Supabase, etc.) passe direct au réseau.
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(
    fetch(req)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE_VERSION).then((c) => c.put(req, copy)).catch(()=>{});
        return res;
      })
      .catch(() => caches.match(req).then((r) => r || caches.match('./index.html')))
  );
});

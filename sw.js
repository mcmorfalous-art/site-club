/* MC Les Morfalous — Service Worker
   Stratégie NETWORK-FIRST. Le HTML (ouverture de l'app / des pages) est TOUJOURS
   pris au réseau en priorité : le cache ne sert QUE de secours hors-ligne, jamais
   pour afficher une version figée. Plus besoin de changer le numéro de version à
   chaque mise à jour — la page ne reste jamais bloquée sur une ancienne version. */
const CACHE_VERSION = 'mcm-v3';
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

  // Est-ce une navigation / une page HTML ? (ouverture de l'app, rechargement…)
  const isHTML = req.mode === 'navigate' ||
    (req.headers.get('accept') || '').includes('text/html');

  if (isHTML) {
    // HTML : réseau SANS cache navigateur, on garde une copie uniquement pour le hors-ligne.
    e.respondWith(
      fetch(req, { cache: 'no-store' })
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_VERSION).then((c) => c.put('./index.html', copy)).catch(()=>{});
          return res;
        })
        .catch(() => caches.match(req).then((r) => r || caches.match('./index.html')))
    );
    return;
  }

  // Autres fichiers (icônes, manifest, images…) : réseau d'abord, cache mis à jour, secours hors-ligne.
  e.respondWith(
    fetch(req)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE_VERSION).then((c) => c.put(req, copy)).catch(()=>{});
        return res;
      })
      .catch(() => caches.match(req))
  );
});

/* ===== NOTIFICATIONS PUSH ===== */
self.addEventListener('push', (e) => {
  let data = {};
  try { data = e.data ? e.data.json() : {}; } catch (_) { data = { title: 'MC Les Morfalous', body: e.data ? e.data.text() : '' }; }
  const title = data.title || 'MC Les Morfalous';
  const options = {
    body: data.body || '',
    icon: './icon-192.png',
    badge: './icon-192.png',
    tag: data.tag || 'mcm-notif',
    data: { url: data.url || './' },
    vibrate: [100, 50, 100],
  };
  e.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || './';
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const c of list) { if ('focus' in c) return c.focus(); }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});

const CACHE_NAME = 'dexicon-v11-pokedex';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './favicon.png',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Cache Pokémon sprites dynamically as they are encountered
  if (url.origin === 'https://raw.githubusercontent.com') {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) =>
        cache.match(event.request).then((cached) => {
          if (cached) return cached;
          return fetch(event.request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => new Response(''));
        })
      )
    );
    return;
  }

  // Bypass cache for external quote APIs
  if (!event.request.url.startsWith(self.location.origin)) {
    event.respondWith(fetch(event.request).catch(() => new Response('[]')));
    return;
  }

  // Default Stale-While-Revalidate for app core
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        fetch(event.request)
          .then((res) => {
            if (res && res.status === 200) {
              caches.open(CACHE_NAME).then((c) => c.put(event.request, res));
            }
          })
          .catch(() => {});
        return cached;
      }
      return fetch(event.request);
    })
  );
});

const CACHE_NAME = 'syncdex-v3-scanner';

// Core local assets required for full offline functionality
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './pokedex-scanner.css',
  './pokedex-scanner.js',
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
      Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME)
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1. Dynamic Caching for Pokémon Sprites (Normal & Shiny)
  if (url.origin === 'https://raw.githubusercontent.com') {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) =>
        cache.match(event.request).then((cached) => {
          if (cached) return cached;
          return fetch(event.request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                cache.put(event.request, networkResponse.clone());
              }
              return networkResponse;
            })
            .catch(() => new Response(''));
        })
      )
    );
    return;
  }

  // 2. Bypass cache for live third-party APIs (Quotes & PokeAPI species data)
  // These are handled by local runtime storage (localStorage) or fallback text
  if (!event.request.url.startsWith(self.location.origin)) {
    event.respondWith(fetch(event.request).catch(() => new Response('[]')));
    return;
  }

  // 3. Stale-While-Revalidate for local app shell & scanner files
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

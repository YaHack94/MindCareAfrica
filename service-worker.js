// service-worker.js

const STATIC_CACHE_NAME = 'mindcare-static-v2'; // Increment version on change
const DYNAMIC_CACHE_NAME = 'mindcare-dynamic-v2';
const CONTENT_CACHE_NAME = 'mindcare-content-v2';

const APP_SHELL_URLS = [
  '/',
  '/index.html',
  // Note: Modern build tools often hash filenames, making manual caching tricky.
  // Caching the main entry points is a robust strategy.
  // The fetch handler will cache other assets dynamically.
];

// INSTALL: Cache the application shell
self.addEventListener('install', event => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then(cache => {
      console.log('[SW] Caching App Shell');
      return cache.addAll(APP_SHELL_URLS);
    })
  );
});

// ACTIVATE: Clean up old caches
self.addEventListener('activate', event => {
  console.log('[SW] Activating...');
  const cacheWhitelist = [STATIC_CACHE_NAME, DYNAMIC_CACHE_NAME, CONTENT_CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log(`[SW] Deleting old cache: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// FETCH: Serve from cache or fetch and cache
self.addEventListener('fetch', event => {
  // Use a cache-first strategy
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        return response; // Serve from cache
      }
      // Not in cache, fetch from network
      return fetch(event.request).then(networkResponse => {
        // Don't cache chrome-extension requests or non-GET requests
        if (!networkResponse || networkResponse.status !== 200 || !['basic', 'cors'].includes(networkResponse.type) || event.request.method !== 'GET') {
          return networkResponse;
        }
        
        // Clone the response because it's a one-time use stream
        const responseToCache = networkResponse.clone();
        
        // Cache API calls or other dynamic assets
        caches.open(DYNAMIC_CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      });
    }).catch(error => {
        console.log('[SW] Fetch failed; returning offline page instead.', error);
        // Optionally, return a fallback offline page
        // return caches.match('/offline.html');
    })
  );
});

// MESSAGE: Handle commands from the client
self.addEventListener('message', event => {
  console.log(`[SW] Received message: ${event.data.type}`);
  if (event.data && event.data.type === 'CACHE_RESOURCE') {
    event.waitUntil(
      caches.open(CONTENT_CACHE_NAME).then(cache => {
        console.log(`[SW] Caching resource: ${event.data.url}`);
        return cache.add(event.data.url);
      })
    );
  } else if (event.data && event.data.type === 'DELETE_RESOURCE') {
     event.waitUntil(
      caches.open(CONTENT_CACHE_NAME).then(cache => {
        console.log(`[SW] Deleting resource: ${event.data.url}`);
        return cache.delete(event.data.url);
      })
    );
  }
});
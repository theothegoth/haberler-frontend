/* eslint-disable no-restricted-globals */

const CACHE_NAME = 'gaste-v1';
const OFFLINE_URL = '/offline.html';

// Assets to cache on install
const PRECACHE_ASSETS = [
  '/offline.html',
  '/manifest.json'
];

// Install event - cache essential assets
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Install');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Precaching offline page');
      // Add offline page first
      return cache.add(new Request(OFFLINE_URL, {cache: 'reload'}))
        .then(() => {
          console.log('[ServiceWorker] Offline page cached');
          // Try to add manifest, but don't fail if it doesn't work
          return cache.add('/manifest.json').catch(() => console.log('[ServiceWorker] Manifest cache skipped'));
        });
    })
    .then(() => {
      console.log('[ServiceWorker] Installation complete');
      return self.skipWaiting();
    })
    .catch((err) => {
      console.error('[ServiceWorker] Install failed:', err);
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activate');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[ServiceWorker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // Handle navigation requests (HTML pages)
  // In development (localhost), always fetch fresh to enable hot reload
  if (request.mode === 'navigate') {
    // Check if we're in development mode (localhost or webpack-dev-server)
    const isDevelopment = url.hostname === 'localhost' || url.hostname === '127.0.0.1';

    if (isDevelopment) {
      // In development: always fetch fresh, never cache
      event.respondWith(fetch(request));
      return;
    }

    // In production: cache for offline support
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone and cache successful responses
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // If network fails, try cache
          return caches.match(request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // If not in cache, return offline page
              return caches.match(OFFLINE_URL);
            });
        })
    );
    return;
  }

  // Handle API requests - Network first, fallback to cache
  if (url.pathname.startsWith('/api/') || url.port === '5000') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone and cache successful GET requests
          if (request.method === 'GET' && response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback to cache for GET requests
          if (request.method === 'GET') {
            return caches.match(request);
          }
          // Return error response for other methods
          return new Response(
            JSON.stringify({ error: 'Bağlantınız yok. Lütfen internet bağlantınızı kontrol edin.' }),
            {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'application/json'
              })
            }
          );
        })
    );
    return;
  }

  // Handle static assets - Cache first, fallback to network
  if (
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'image' ||
    request.destination === 'font' ||
    url.pathname.startsWith('/static/')
  ) {
    const isDevelopment = url.hostname === 'localhost' || url.hostname === '127.0.0.1';

    // Skip caching webpack hot-reload and dev files
    if (isDevelopment && (
      url.pathname.includes('hot-update') ||
      url.pathname.includes('bundle.js') ||
      url.pathname.includes('main.chunk.js')
    )) {
      // Always fetch fresh in development for HMR
      event.respondWith(fetch(request));
      return;
    }

    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse && !isDevelopment) {
            return cachedResponse;
          }
          // If not in cache or in development, fetch from network
          return fetch(request)
            .then((response) => {
              // Cache successful responses (only in production)
              if (response && response.status === 200 && !isDevelopment) {
                const responseClone = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                  cache.put(request, responseClone);
                });
              }
              return response;
            });
        })
    );
    return;
  }

  // For all other requests - Network first
  event.respondWith(
    fetch(request)
      .then((response) => {
        return response;
      })
      .catch(() => {
        return caches.match(request);
      })
  );
});

// Handle messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Background sync for failed requests (future enhancement)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-articles') {
    event.waitUntil(
      // Sync logic here
      console.log('[ServiceWorker] Background sync:', event.tag)
    );
  }
});

// Service Worker for إيرام 24 PWA
const CACHE_NAME = 'eram24-v1';
const STATIC_ASSETS = [
  '/iram-24/',
  '/iram-24/manifest.json',
  '/iram-24/favicon.ico',
];

// Install: cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch: network-first for API, cache-first for static
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // API requests (Supabase): network only
  if (url.hostname.includes('supabase.co')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Static assets: cache first, then network
  if (url.pathname.startsWith('/iram-24/') && !url.pathname.includes('.')) {
    event.respondWith(
      caches.match('/iram-24/').then((cached) => {
        return cached || fetch(event.request);
      })
    );
    return;
  }

  // Other requests: network first, cache fallback
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful responses
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});

// Push notifications
self.addEventListener('push', (event) => {
  if (!event.data) return;
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title || 'إيرام 24', {
      body: data.body || 'خبر جديد',
      icon: '/iram-24/favicon.ico',
      badge: '/iram-24/favicon.ico',
      data: data.url || '/iram-24/',
      dir: 'rtl',
      lang: 'ar',
    })
  );
});

// Notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data || '/iram-24/')
  );
});

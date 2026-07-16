// Service Worker for إيرام 24 PWA
const CACHE_NAME = 'eram24-v2';
const scopeUrl = new URL(self.registration.scope);
const basePath = scopeUrl.pathname.endsWith('/')
  ? scopeUrl.pathname.slice(0, -1)
  : scopeUrl.pathname;

function withBase(path = '/') {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const joined = `${basePath}${normalized}`.replace(/\/+/g, '/');
  return joined || '/';
}

const HOME_URL = withBase('/');
const STATIC_ASSETS = [HOME_URL, withBase('/manifest.json'), withBase('/favicon.ico')];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  if (url.hostname.includes('supabase.co')) {
    event.respondWith(fetch(event.request));
    return;
  }

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(HOME_URL, clone));
          return response;
        })
        .catch(() => caches.match(HOME_URL))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      });
    })
  );
});

self.addEventListener('push', (event) => {
  if (!event.data) return;
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title || 'إيرام 24', {
      body: data.body || 'خبر جديد',
      icon: withBase('/favicon.ico'),
      badge: withBase('/favicon.ico'),
      data: data.url || HOME_URL,
      dir: 'rtl',
      lang: 'ar',
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data || HOME_URL));
});

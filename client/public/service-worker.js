self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Installed');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activated');
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // For now, just log fetches. We'll intercept/sync later.
  // console.log('[ServiceWorker] Fetch:', event.request.url);
}); 
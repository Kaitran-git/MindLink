self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  self.clients.claim();
});

// Basic notification click behavior
self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
      for (const client of clientList) {
        if ('focus' in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow('./');
    })
  );
});



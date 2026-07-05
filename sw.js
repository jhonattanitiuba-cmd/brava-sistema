// Service worker mínimo da Brava — habilita a instalação como app (PWA).
// Passthrough: não faz cache, não altera o comportamento do app.
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', function () { /* deixa o navegador tratar normalmente */ });

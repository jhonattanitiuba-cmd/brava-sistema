// Bola de Neve · service worker de cache basico (demo, offline-friendly).
const CACHE = 'bolaneve-v4';
const ASSETS = [
  '/bolaneve/',
  '/bolaneve/index.html',
  '/bolaneve/tokens.css',
  '/bolaneve/screens.css',
  '/bolaneve/mock-data.js',
  '/bolaneve/sound.js',
  '/bolaneve/icons.jsx',
  '/bolaneve/shell.jsx',
  '/bolaneve/screens/hub.jsx',
  '/bolaneve/screens/painel.jsx',
  '/bolaneve/screens/acolhimento.jsx',
  '/bolaneve/screens/celulas.jsx',
  '/bolaneve/screens/biblia.jsx',
  '/bolaneve/screens/devocionais.jsx',
  '/bolaneve/screens/contribua.jsx',
  '/bolaneve/screens/captacao.jsx',
  '/bolaneve/assets/emblem-white.png',
  '/bolaneve/assets/wordmark-white.png',
  '/bolaneve/assets/app-icon-192.png',
  '/bolaneve/assets/app-icon-512.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  // network-first para navegacao (SPA), cache-first para o resto
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).catch(() => caches.match('/bolaneve/index.html')));
    return;
  }
  e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((res) => {
    const copy = res.clone();
    caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
    return res;
  }).catch(() => hit)));
});

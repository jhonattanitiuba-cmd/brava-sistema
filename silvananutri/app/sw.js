// Service worker do app da paciente (Silvana) — instalação + shell offline.
const CACHE = "silvana-app-v1";
const SHELL = ["/silvananutri/app/", "/silvananutri/app/index.html", "/silvananutri/app/icon.svg", "/silvananutri/app/manifest.webmanifest"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()).catch(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  if (req.mode === "navigate") {
    event.respondWith(fetch(req).catch(() => caches.match("/silvananutri/app/index.html")));
    return;
  }
  event.respondWith(caches.match(req).then((c) => c || fetch(req)));
});

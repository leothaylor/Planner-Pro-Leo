// sw.js — cache simples para GitHub Pages
const CACHE = "planner-pro-v1";
const ASSETS = [
  "/Planner-Pro-Leo/",
  "/Planner-Pro-Leo/index.html",
  "/Planner-Pro-Leo/404.html",
  "/Planner-Pro-Leo/manifest.webmanifest",
  "/Planner-Pro-Leo/icons/icon-192.png",
  "/Planner-Pro-Leo/icons/icon-512.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Network-first para navegação; cache-first para estáticos
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  const isHTML = e.request.mode === "navigate";
  if (isHTML) {
    e.respondWith(
      fetch(e.request).catch(() => caches.match("/Planner-Pro-Leo/index.html"))
    );
    return;
  }
  // cache-first para demais
  e.respondWith(
    caches.match(e.request).then((hit) => hit || fetch(e.request))
  );
});

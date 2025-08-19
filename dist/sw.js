// Simple SW: cache shell + last API success
const CACHE_NAME = "pw-cache-v2";
const CORE = [
  "%BASE_URL%",
  "%BASE_URL%index.html",
  "%BASE_URL%manifest.webmanifest",
  "%BASE_URL%favicon.svg"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((c) => c.addAll(CORE.map(fixBase)))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (url.pathname.includes("/v1/forecast")) {
    e.respondWith(
      fetch(e.request)
        .then((resp) => {
          const clone = resp.clone();
          caches.open(CACHE_NAME).then((c) => c.put(e.request, clone)).catch(() => {});
          return resp;
        })
        .catch(() => caches.match(e.request))
    );
  } else {
    e.respondWith(
      caches.match(e.request).then((cached) => cached || fetch(e.request))
    );
  }
});

function fixBase(p) {
  const base = self.registration.scope;
  return p.replace("%BASE_URL%", base);
}

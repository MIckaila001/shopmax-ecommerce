// Service Worker pour ShopMax PWA
const CACHE_NAME = "shopmax-v1";
const RUNTIME_CACHE = "shopmax-runtime-v1";

const PRECACHE_URLS = [
  "/",
  "/boutique",
  "/categories",
  "/panier",
  "/connexion",
  "/inscription",
  "/offline",
  "/manifest.json",
  "/images/hero/main.jpg",
];

// Installation : pré-cache les pages importantes
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

// Activation : nettoie les anciens caches
self.addEventListener("activate", (event) => {
  const currentCaches = [CACHE_NAME, RUNTIME_CACHE];
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => !currentCaches.includes(cacheName))
            .map((cacheName) => caches.delete(cacheName))
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch : network-first, fallback cache
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Ignore les requêtes non-GET
  if (request.method !== "GET") return;

  // Ignore les requêtes API (toujours réseau)
  const url = new URL(request.url);
  if (url.pathname.startsWith("/api/")) return;

  // Ignore les images externes (Unsplash, etc.)
  if (!url.origin.includes(self.location.origin)) return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        // Si la réponse est OK, on la met en cache
        if (response && response.status === 200 && response.type === "basic") {
          const responseToCache = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Réseau down, fallback cache
        return caches.match(request).then((response) => {
          if (response) return response;
          // Si pas en cache, page offline
          if (request.destination === "document") {
            return caches.match("/offline");
          }
        });
      })
  );
});

// Message handler : permet au frontend de vider le cache
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "CLEAR_CACHE") {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      })
    );
  }
});

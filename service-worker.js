const CACHE_NAME = "pwa-cache-v3";
const FILES_TO_CACHE = [
  "/payal/",                // root path
  "/payal/index.php",       // main page
  "/payal/offline.html",    // offline fallback
  "/payal/assets/css/main.css",
  "/payal/assets/img/logo.png"
];

// Install event - cache files
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    }).catch(err => console.log("Cache add error:", err))
  );
});

// Activate event - clear old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      );
    })
  );
});

// Fetch event - serve from cache or network
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // serve cached response if available
      if (response) {
        return response;
      }

      // handle root URL "/payal/"
      if (event.request.mode === "navigate") {
        return caches.match("/payal/index.php");
      }

      // otherwise fetch from network
      return fetch(event.request).catch(() => {
        // fallback to offline page if navigation
        if (event.request.mode === "navigate") {
          return caches.match("/payal/offline.html");
        }
      });
    })
  );
});

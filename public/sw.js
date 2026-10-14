// RIWAJ (Vindhya Events) Progressive Web App Service Worker
const CACHE_NAME = "riwaj-pwa-v2";
const RUNTIME_CACHE = "riwaj-runtime-v2";

const PRECACHE_URLS = [
  "/",
  "/services",
  "/contact",
  "/gallery",
  "/about",
  "/blog",
  "/offline",
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/icons/badge-96x96.png",
  "/icons/badge-72x72.png",
  "/icons/apple-touch-icon.png",
  "/girlsimg.webp",
  "/dercoration1.webp",
];

// Install: Cache essential shell & assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
      .catch((err) => console.warn("SW precache error:", err))
  );
});

// Activate: Prune stale caches and claim clients immediately
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME && key !== RUNTIME_CACHE)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

// Fetch: Strategy depending on request type
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Bypass non-GET requests (e.g. form POST, APIs)
  if (request.method !== "GET") return;

  // 1. Navigation requests (HTML pages): Network-first with Cache fallback -> /offline
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(async () => {
          const cachedResponse = await caches.match(request);
          if (cachedResponse) return cachedResponse;
          const offlineFallback = await caches.match("/offline");
          return offlineFallback || new Response("Offline", { status: 503 });
        })
    );
    return;
  }

  // 2. Static Assets (JS, CSS, Images, Fonts): Stale-While-Revalidate
  const isStaticAsset =
    url.origin === self.location.origin &&
    (url.pathname.startsWith("/_next/static/") ||
      url.pathname.startsWith("/icons/") ||
      url.pathname.match(/\.(png|jpg|jpeg|webp|svg|ico|woff2?)$/i));

  const isExternalImage =
    url.hostname.includes("images.unsplash.com") ||
    url.hostname.includes("res.cloudinary.com");

  if (isStaticAsset || isExternalImage) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              caches.open(RUNTIME_CACHE).then((cache) => {
                cache.put(request, responseClone);
              });
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // 3. All other requests: Network with fallback to cache
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});

// Push Notifications with Badge Icon support
self.addEventListener("push", (event) => {
  let payload = {
    title: "RIWAJ Events",
    body: "New updates on wedding decor & planning packages in Rewa!",
    url: "/",
  };

  try {
    if (event.data) {
      payload = event.data.json();
    }
  } catch {
    if (event.data) {
      payload.body = event.data.text();
    }
  }

  const options = {
    body: payload.body,
    icon: "/icons/icon-192x192.png",
    badge: "/icons/badge-96x96.png", // Dedicated PWA badge icon
    vibrate: [100, 50, 100],
    data: {
      url: payload.url || "/",
    },
    actions: [
      { action: "explore", title: "View Details" },
      { action: "close", title: "Dismiss" },
    ],
  };

  event.waitUntil(self.registration.showNotification(payload.title, options));
});

// Notification Click Handler
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || "/";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === targetUrl && "focus" in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});

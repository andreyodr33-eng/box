const CACHE_NAME = "box-pwa-v1";

const urlsToCache = [
  "./",
  "./index.html",
  "./manifest.json",

  "./icon-32.png",
  "./icon-180.png",
  "./icon-192.png",
  "./icon-512.png",
    "./images/open-shift-1.jpg",
    "./images/open-shift-2.jpg",
    "./images/open-shift-3.jpg",
    "./images/open-shift-4.jpg",
    "./images/open-shift-5.jpg",
    "./images/open-shift-6.jpg",
    "./images/open-shift-7.jpg",
     "./images/open-shift-8.jpg",
     "./images/open-shift-9.jpg",
     "./images/open-shift-10.jpg", 
     "./images/open-shift-11.jpg",
     "./images/open-shift-12.jpg",
     "./images/open-shift-13.jpg",
     "./images/open-shift-14.jpg",
     "./images/open-shift-15.jpg",
     "./images/open-shift-16.jpg",
     "./images/open-shift-17.jpg",
      "./images/open-shift-18.jpg",
      "./images/open-shift-19.jpg",
      "./images/open-shift-20.jpg",
      "./images/open-shift-21.jpg",
      "./images/open-shift-22.jpg",
      "./images/open-shift-23.jpg",
      "./images/open-shift-24.jpg",
      "./images/open-shift-25.jpg",
      "./images/open-shift-26.jpg"
];

// Установка и кэширование
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Активация: удаляем только старые кэши Box
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys =>
        Promise.all(
          keys
            .filter(key =>
              key.startsWith("box-pwa-") &&
              key !== CACHE_NAME
            )
            .map(key => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

// Сначала ищем файл в кэше Box, затем обращаемся к сети
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME)
      .then(cache =>
        cache.match(event.request)
          .then(response =>
            response || fetch(event.request)
          )
      )
  );
});

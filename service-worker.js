const CACHE_NAME = "box-pwa-v2";

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
      "./images/open-shift-26.jpg",
      "./images/open-shift-27.jpg",
      "./images/open-shift-28.jpg",
      "./images/open-shift-29.jpg",
      "./images/open-shift-30.jpg",
      "./images/open-shift-31.jpg",
      "./images/open-shift-32.jpg",
      "./images/open-shift-33.jpg",
      "./images/open-shift-34.jpg",
      "./images/open-shift-35.jpg",
      "./images/open-shift-36.jpg",
      "./images/open-shift-37.jpg",
      "./images/open-shift-38.jpg",
      "./images/open-shift-39.jpg",
      "./images/open-shift-40.jpg",
      "./images/open-shift-41.jpg"
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
    const request = event.request;
  if (request.method !== "GET") {
    return;
  }
 const url = new URL(request.url);
 if (url.origin !== self.location.origin) {
     return;
 }    
event.respondWith(

        fetch(request)

            .then(response => {

                if (response.ok && response.type === “basic”) {

                    const copy = response.clone();

                    event.waitUntil(

                        caches.open(CACHE_NAME)

                            .then(cache =>

                                cache.put(request, copy)

                            )

                    );

                }

                return response;

            })

            .catch(async () => {

                const cached = await caches.match(request);

                if (cached) {

                    return cached;

                }

                // Офлайн-запас для открытия приложения

                if (request.mode === “navigate”) {

                    return await caches.match(“./index.html”);

                }

                return Response.error();
          
            })
  );
});

const CACHE_NAME = "box-pwa-v5";

const APP_FILES = [
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
      "./images/open-shift-41.jpg",
      "./images/open-shift-42.jpg",
      "./images/open-shift-43.jpg",
      "./images/open-shift-44.jpg",
      "./images/open-shift-45.jpg",
      "./images/open-shift-46.jpg",
      "./images/open-shift-47.jpg",
      "./images/open-shift-48.jpg",
      "./images/open-shift-49.jpg",
      "./images/open-shift-50.jpg"
];


// =====================================
// УСТАНОВКА
// =====================================

self.addEventListener("install", event => {

event.waitUntil((async () => {

const cache = await caches.open(CACHE_NAME);

for (const file of APP_FILES) {

  try {
    await cache.add(file);
  } catch (error) {
    console.warn("Не удалось сохранить файл:", file, error);
  }

}

await self.skipWaiting();
})());

});

// =====================================
// АКТИВАЦИЯ
// =====================================

self.addEventListener("activate", event => {

event.waitUntil((async () => {

const names = await caches.keys();

await Promise.all(
  names
    .filter(name =>
      name.startsWith("bar-pwa-") &&
      name !== CACHE_NAME
    )
    .map(name => caches.delete(name))
);

await self.clients.claim();
})());

});

// =====================================
// ЗАПРОСЫ
// =====================================

self.addEventListener("fetch", event => {

const request = event.request;

if (request.method !== "GET") return;

event.respondWith((async () => {

const cache = await caches.open(CACHE_NAME);

// Проверяем наличие файла в кэше
const saved = await cache.match(request);

if (saved) {
  return saved;
}

// Если файл отсутствует в кэше,
// загружаем его из интернета
try {

  const response = await fetch(request);

  // Сохраняем успешный ответ
  if (response.ok || response.type === "opaque") {

    try {
      await cache.put(request, response.clone());
    } catch (error) {
      console.warn("Не удалось сохранить:", request.url, error);
    }

  }

  return response;

} catch (error) {

  // Если нет интернета,
  // возвращаем сохранённую главную страницу
  if (request.mode === "navigate") {

    const index = await cache.match("./index.html");

    if (index) return index;

  }

  // Остальные недоступные файлы
  return new Response("", {
    status: 503,
    statusText: "Файл недоступен офлайн"
  });

}
})());

});








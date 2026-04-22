const CACHE = “stockradar-v1”;
const ASSETS = [”/”, “/index.html”, “/manifest.json”];

self.addEventListener(“install”, e => {
e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
self.skipWaiting();
});

self.addEventListener(“activate”, e => {
e.waitUntil(caches.keys().then(keys =>
Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
));
self.clients.claim();
});

self.addEventListener(“fetch”, e => {
// רק cache עבור הקבצים הסטטיים
if (e.request.url.includes(“api.anthropic”) || e.request.url.includes(“finance.yahoo”)) return;
e.respondWith(
caches.match(e.request).then(cached => cached || fetch(e.request))
);
});

// Guarda la aplicación y los mapas ya vistos, para que abra aunque la señal sea mala.
const VERSION = "micros-camiri-v10";
const BASE = ["./", "index.html", "rutas_datos.js", "lugares.js", "manifest.webmanifest", "icono-192.png", "icono-512.png",
  "lib/leaflet.min.js"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(BASE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(claves => Promise.all(claves.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// Primero la red, para que las rutas actualizadas lleguen enseguida; si no hay señal, lo guardado.
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request).then(resp => {
      const copia = resp.clone();
      caches.open(VERSION).then(c => c.put(e.request, copia)).catch(() => {});
      return resp;
    }).catch(() => caches.match(e.request))
  );
});

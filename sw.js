// Plantilla de Service Worker


// 1. Nombre del caché y archivos a cachar
const CACHE_NAME = "mi-pwa-cache-v1";
const urlsToCache = [
    '/',
    'index.html',
    'offline.html',
    'icons/icon-192x192.png',
    'icons/icon-512x512.png',
];

// 2. Install -> el evento que se ejecuta al instalar el sw
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache =>cache.addAll(urlsToCache))
    )
})

// 3. ACTIVATE -> este evento se ejecuta al activarse y debe limpiar cachés viejas
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys()
            .then(keys => 
                Promise.all(
                    keys.filter(key => key !== CACHE_NAME)
                        .map(key => caches.delete(key))
                )
            )
    )
})

// 4. Fetch -> intercepta las peticiones de la pwa, intercambia cada petición de cadapágina de la pwa
// busca primero en el cache, si el recurso no está, va a la red. Si la red falla, muestra la página offline.
self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                // Si el recurso está en caché, lo devuelve.
                // Si no, intenta buscarlo en la red.
                return cachedResponse || fetch(event.request).catch(() => {
                    // Si la petición de red falla (ej. sin conexión), muestra la página offline.
                    return caches.match('offline.html');
                });
            })
    );
});

// 5. PUSH -> notificaciones en segundo plano (opcional)
// Esta parte parece correcta, no se necesitan cambios.
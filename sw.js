// plantilla de servie worker

// const { cache } = require("react");

// 1. el nombre del servicio y los archvios a cachear 

const CACHE_NAME=   "Mi-pwa-cache-v1"

const BASE_PATH="/PWA-Ejemplo2/"

const urlsToCache = [
    `${BASE_PATH}index.html`,
    `${BASE_PATH}style.css`,    
    `${BASE_PATH}app.js`,
    `${BASE_PATH}offline.html`,
    // corregir carpeta a 'icons' para que coincida con manifest.json
    `${BASE_PATH}icons/icon-192x192.png`,
    `${BASE_PATH}icons/icon-512x512.png`
]

// 2. install  -> el evento que se ejecuta al instalar el swe
// se diapara la oprimera vez que se registra el service worker 
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
    );

});

// 3. Activate ->  este evento se ejecuta al activarse 
// debe limpiar caches vieja
 // se dispara cuando el sw se activa ( esta en ejecucion)
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys => 
            Promise.all(
                keys.filter(key => key !== CACHE_NAME)
            .map(key=> caches.delete(key))
            )
        )
    );
}
)
// fetch -> intercepta las peticiones de la pwa,

// Intercepta cada peticino de cada pagina de la pwa
// busca primero el cache, y si el recurso no esta , va a la red 
// si todo falla , muestra offline.hmtl
self.addEventListener("fetch", event => {
    event.respondWith(
      caches.match(event.request).then(response=> {
        return response || fetch(event.request).catch(
            ()=> caches.match(`${BASE_PATH}offline.html`)); 
      })  
    );
});


// 5. PUSH ->  notificaciones en segundo plano (Opcional)

self.addEventListener("push", event => {
    const data = event.data ? event.data.text(): "Notificacion sin datos "
    event.waitUntil(
    self.registration.showNotification("MI PWA", {body: data})
    )
})


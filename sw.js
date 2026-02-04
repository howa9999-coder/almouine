/* ===============================
   CACHE NAME (change version to force update)
   =============================== */
const cacheName = 'almo3ine-v00';

/* ===============================
   FILES TO CACHE FOR OFFLINE USE
   Use RELATIVE paths for safety
   =============================== */
const assets = [
    './index.html',        // Main page
    './ahzab.htm',         // Ahzab page
    './tasbih.htm',        // Tasbih page
    './tikrar.htm',        // Tikrar page

    './css/ahzab.css',     // Styles for Ahzab
    './css/style.css',     // Global styles
    './css/tasbih.css',    // Tasbih styles
    './css/tikrar.css',    // Tikrar styles

    './js/ahzab.js',       // Ahzab logic
    './js/main.js',        // Main app logic
    './js/tasbih.js',      // Tasbih logic
    './js/tikrar.js',      // Tikrar logic

    './images/repeat.png',     // UI icon
    './images/repeat192.png',  // App icon

    './manifest.json'      // PWA manifest
];

/* ===============================
   INSTALL EVENT
   - Runs once when SW is installed
   - Caches all required assets
   =============================== */

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(cacheName).then(cache => {
            return cache.addAll(assets).catch(err => {
                console.error('Caching failed:', err);
            });
        })
    );
});

/* ===============================
   ACTIVATE EVENT
   - Runs when new SW activates
   - Cleans old cache versions
   =============================== */
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            // Delete all caches that are NOT the current one
            return Promise.all(
                keys.map(key => {
                    if (key !== cacheName) {
                        console.log('Deleting old cache:', key);
                        return caches.delete(key);
                    }
                })
            );
        })
    );
});

/* ===============================
   FETCH EVENT
   - Intercepts network requests
   - Serves cached files first
   =============================== */

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => response || fetch(event.request))
    );
});


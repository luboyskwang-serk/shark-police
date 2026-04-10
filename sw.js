/**
 * Shark Police v.0.0.4 - Service Worker
 * Ultra Fast Cache - Store everything in RAM
 * 
 * Caches:
 * - HTML, CSS, JS files
 * - Images, Sounds
 * - Fonts (with fallback)
 * 
 * Strategy: Cache First, then Network
 */

const CACHE_NAME = 'shark-police-v0.0.4';
const CACHE_VERSION = '2024-01-01';

// Files to cache immediately (stored in RAM)
const STATIC_ASSETS = [
    '/',
    '/shark-police/',
    '/shark-police/index.html',
    '/shark-police/assets/css/style.css?v=0.0.4',
    '/shark-police/assets/css/ultra-performance.css?v=0.0.4',
    '/shark-police/assets/js/performance.js?v=0.0.4',
    '/shark-police/assets/js/calculator-optimizer.js?v=0.0.4',
    '/shark-police/assets/js/app-simple.js?v=0.0.4',
    '/shark-police/assets/js/visual-effects.js?v=0.0.4',
    '/shark-police/assets/js/anti-copy.js?v=0.0.4',
    '/shark-police/assets/js/debug.js?v=0.0.4',
    '/shark-police/assets/images/LOGO.png',
    '/shark-police/wallpaper.webm'
];

// CDN resources to cache
const CDN_ASSETS = [
    'https://cdn.tailwindcss.com/',
    'https://cdn.jsdelivr.net/npm/alpinejs@3.13.3/dist/cdn.min.js',
    'https://cdn.jsdelivr.net/npm/sweetalert2@11.10.1/dist/sweetalert2.all.min.js',
    'https://cdn.jsdelivr.net/npm/sweetalert2@11.10.1/dist/sweetalert2.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700;800&display=swap'
];

// ===== Install Event - Cache Everything =====
self.addEventListener('install', (event) => {
    console.log('[SW] Installing Service Worker...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Caching static assets...');
                // Cache local files first
                return cache.addAll(STATIC_ASSETS).then(() => {
                    console.log('[SW] ✓ Static assets cached');
                    
                    // Cache CDN files (with timeout)
                    return Promise.all(
                        CDN_ASSETS.map(url => 
                            fetch(url, { mode: 'cors' })
                                .then(response => {
                                    if (response.ok) {
                                        return cache.put(url, response);
                                    }
                                })
                                .catch(err => {
                                    console.log('[SW] CDN cache failed:', url, err);
                                })
                        )
                    );
                });
            })
            .then(() => {
                console.log('[SW] ✓ All assets cached - Ready for ultra fast loading!');
                return self.skipWaiting();
            })
            .catch(err => {
                console.error('[SW] Cache failed:', err);
            })
    );
});

// ===== Activate Event - Clean Old Cache =====
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating Service Worker...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter((name) => name !== CACHE_NAME)
                        .map((name) => {
                            console.log('[SW] Deleting old cache:', name);
                            return caches.delete(name);
                        })
                );
            })
            .then(() => {
                console.log('[SW] ✓ Old cache cleaned');
                return self.clients.claim();
            })
    );
});

// ===== Fetch Event - Cache First Strategy =====
self.addEventListener('fetch', (event) => {
    const url = event.request.url;
    
    // Skip non-GET requests
    if (event.request.method !== 'GET') {
        return;
    }
    
    // Skip chrome-extension requests
    if (url.startsWith('chrome-extension://')) {
        return;
    }
    
    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    // Found in cache - return immediately (ULTRA FAST!)
                    console.log('[SW] ⚡ Cache HIT:', url);
                    
                    // Update cache in background (stale-while-revalidate)
                    fetch(event.request)
                        .then(response => {
                            if (response.ok) {
                                caches.open(CACHE_NAME)
                                    .then(cache => cache.put(event.request, response));
                            }
                        })
                        .catch(() => {});
                    
                    return cachedResponse;
                }
                
                // Not in cache - fetch from network
                console.log('[SW] 🌐 Network fetch:', url);
                return fetch(event.request)
                    .then((response) => {
                        // Don't cache non-success responses
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        // Clone response for cache
                        const responseToCache = response.clone();
                        
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });
                        
                        return response;
                    })
                    .catch((error) => {
                        console.error('[SW] Fetch failed:', error);
                        
                        // Show offline page if available
                        return caches.match('/shark-police/index.html')
                            .then(response => response);
                    });
            })
    );
});

// ===== Message Event - Manual Cache Control =====
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        caches.delete(CACHE_NAME);
        console.log('[SW] Cache cleared by user');
    }
    
    if (event.data && event.data.type === 'CACHE_STATUS') {
        caches.keys().then(names => {
            event.ports[0].postMessage({
                caches: names,
                version: CACHE_VERSION
            });
        });
    }
});

console.log('[SW] Service Worker loaded - Ready for ultra fast caching! 🚀');

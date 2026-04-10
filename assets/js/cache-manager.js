/**
 * Shark Police v.0.0.4 - Ultra Fast Cache Manager
 * Stores data in RAM (LocalStorage + Memory)
 * 
 * Features:
 * - Instant page load from cache
 * - Cache calculator state
 * - Preload critical resources
 * - Auto-save form data
 */

(function() {
    'use strict';

    // ===== Cache Configuration =====
    const CacheConfig = {
        version: 'v0.0.4',
        prefix: 'shark_police_',
        ttl: 7 * 24 * 60 * 60 * 1000, // 7 days
        maxCacheSize: 50 // MB
    };

    // ===== RAM Cache (Fastest) =====
    const RAMCache = {
        data: new Map(),
        
        set(key, value, ttl = CacheConfig.ttl) {
            this.data.set(key, {
                value,
                timestamp: Date.now(),
                ttl
            });
            console.log(`[RAMCache] ✓ Stored: ${key}`);
        },
        
        get(key) {
            const item = this.data.get(key);
            if (!item) return null;
            
            // Check if expired
            if (Date.now() - item.timestamp > item.ttl) {
                this.data.delete(key);
                return null;
            }
            
            console.log(`[RAMCache] ⚡ Hit: ${key}`);
            return item.value;
        },
        
        has(key) {
            return this.data.has(key);
        },
        
        delete(key) {
            return this.data.delete(key);
        },
        
        clear() {
            this.data.clear();
            console.log('[RAMCache] ✓ Cleared');
        },
        
        size() {
            return this.data.size;
        }
    };

    // ===== LocalStorage Cache (Persistent) =====
    const StorageCache = {
        prefix: CacheConfig.prefix + CacheConfig.version + '_',
        
        set(key, value, ttl = CacheConfig.ttl) {
            try {
                const item = {
                    value,
                    timestamp: Date.now(),
                    ttl
                };
                localStorage.setItem(this.prefix + key, JSON.stringify(item));
                console.log(`[StorageCache] ✓ Saved: ${key}`);
            } catch (e) {
                console.warn('[StorageCache] Save failed:', e);
            }
        },
        
        get(key) {
            try {
                const itemStr = localStorage.getItem(this.prefix + key);
                if (!itemStr) return null;
                
                const item = JSON.parse(itemStr);
                
                // Check if expired
                if (Date.now() - item.timestamp > item.ttl) {
                    this.delete(key);
                    return null;
                }
                
                console.log(`[StorageCache] ⚡ Hit: ${key}`);
                return item.value;
            } catch (e) {
                console.warn('[StorageCache] Load failed:', e);
                return null;
            }
        },
        
        has(key) {
            return localStorage.getItem(this.prefix + key) !== null;
        },
        
        delete(key) {
            localStorage.removeItem(this.prefix + key);
        },
        
        clear() {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(this.prefix)) {
                    localStorage.removeItem(key);
                }
            });
            console.log('[StorageCache] ✓ Cleared');
        },
        
        getSize() {
            let size = 0;
            for (let key in localStorage) {
                if (key.startsWith(this.prefix)) {
                    size += localStorage[key].length * 2; // bytes
                }
            }
            return size / 1024 / 1024; // MB
        }
    };

    // ===== Calculator State Cache =====
    const CalculatorCache = {
        save(state) {
            const cacheData = {
                selectedCharges: state.selectedCharges || [],
                useBail: state.useBail || false,
                currentSection: state.currentSection || 'calculator',
                timestamp: Date.now()
            };
            
            RAMCache.set('calculator_state', cacheData, 5 * 60 * 1000); // 5 min
            StorageCache.set('calculator_state', cacheData, 24 * 60 * 60 * 1000); // 24 hours
        },
        
        restore() {
            // Try RAM first (fastest)
            let data = RAMCache.get('calculator_state');
            if (data) {
                console.log('[CalculatorCache] ⚡ Restored from RAM');
                return data;
            }
            
            // Try LocalStorage
            data = StorageCache.get('calculator_state');
            if (data) {
                console.log('[CalculatorCache] 📦 Restored from Storage');
                // Put back in RAM for faster access
                RAMCache.set('calculator_state', data, 5 * 60 * 1000);
                return data;
            }
            
            console.log('[CalculatorCache] No cache found');
            return null;
        },
        
        clear() {
            RAMCache.delete('calculator_state');
            StorageCache.delete('calculator_state');
        }
    };

    // ===== Resource Preloader =====
    const Preloader = {
        preloadQueue: [],
        loading: false,
        
        add(url, type = 'fetch') {
            this.preloadQueue.push({ url, type });
        },
        
        async loadAll() {
            if (this.loading) return;
            this.loading = true;
            
            console.log(`[Preloader] Loading ${this.preloadQueue.length} resources...`);
            
            const promises = this.preloadQueue.map(item => {
                return this.loadResource(item.url, item.type)
                    .catch(err => console.warn('[Preloader] Failed:', item.url, err));
            });
            
            await Promise.all(promises);
            console.log('[Preloader] ✓ All resources preloaded');
            this.loading = false;
        },
        
        async loadResource(url, type) {
            if (type === 'image') {
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.onload = resolve;
                    img.onerror = reject;
                    img.src = url;
                });
            }
            
            if (type === 'audio') {
                return new Promise((resolve, reject) => {
                    const audio = new Audio();
                    audio.oncanplaythrough = resolve;
                    audio.onerror = reject;
                    audio.src = url;
                });
            }
            
            // Default: fetch
            const response = await fetch(url);
            return response;
        }
    };

    // ===== Service Worker Registration =====
    function registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('./sw.js')
                    .then(registration => {
                        console.log('[SW] Registered:', registration.scope);
                    })
                    .catch(error => {
                        // Silently fail if sw.js doesn't exist
                        console.log('[SW] Service Worker not available (optional feature)');
                    });
            });
        }
    }

    // ===== Auto-save Form Data =====
    function setupAutoSave() {
        // Save calculator state before unload
        window.addEventListener('beforeunload', () => {
            if (window.calculatorAppInstance) {
                CalculatorCache.save({
                    selectedCharges: window.calculatorAppInstance.selectedCharges,
                    useBail: window.calculatorAppInstance.useBail,
                    currentSection: window.calculatorAppInstance.currentSection
                });
            }
        });
    }

    // ===== Preload Critical Resources =====
    function setupPreloading() {
        window.addEventListener('load', () => {
            // Preload images
            document.querySelectorAll('.charge-image[data-src]').forEach(img => {
                Preloader.add(img.dataset.src, 'image');
            });
            
            // Preload sounds
            const sounds = [
                './assets/sounds/toggle.mp3',
                './assets/sounds/switch.mp3',
                './assets/sounds/beep1.mp3'
            ];
            sounds.forEach(sound => {
                Preloader.add(sound, 'audio');
            });
            
            // Load all
            Preloader.loadAll();
        });
    }

    // ===== Restore Calculator State =====
    function restoreCalculatorState() {
        window.addEventListener('load', () => {
            const cachedState = CalculatorCache.restore();
            
            if (cachedState && window.Alpine) {
                // Wait for Alpine to initialize
                setTimeout(() => {
                    if (window.calculatorAppInstance) {
                        console.log('[Cache] Restoring calculator state...');
                        
                        // Restore selected charges
                        if (cachedState.selectedCharges?.length > 0) {
                            window.calculatorAppInstance.selectedCharges = cachedState.selectedCharges;
                        }
                        
                        // Restore bail state
                        if (cachedState.useBail !== undefined) {
                            window.calculatorAppInstance.useBail = cachedState.useBail;
                        }
                        
                        // Recalculate
                        if (window.calculatorAppInstance.calculateTotal) {
                            window.calculatorAppInstance.calculateTotal();
                        }
                        
                        console.log('[Cache] ✓ State restored');
                    }
                }, 100);
            }
        });
    }

    // ===== Cache API Helper =====
    window.SharkCache = {
        // RAM (fastest)
        ram: RAMCache,
        
        // LocalStorage (persistent)
        storage: StorageCache,
        
        // Calculator specific
        calculator: CalculatorCache,
        
        // Clear all caches
        clearAll() {
            RAMCache.clear();
            StorageCache.clear();
            
            // Clear service worker cache
            if ('caches' in window) {
                caches.keys().then(names => {
                    names.forEach(name => caches.delete(name));
                });
            }
            
            console.log('[SharkCache] ✓ All caches cleared');
        },
        
        // Get cache stats
        getStats() {
            return {
                ramSize: RAMCache.size(),
                storageSize: StorageCache.getSize().toFixed(2) + ' MB',
                serviceWorker: 'serviceWorker' in navigator
            };
        }
    };

    // ===== Initialize =====
    function init() {
        console.log('[SharkCache] 🚀 Ultra Fast Cache initialized');
        
        registerServiceWorker();
        setupAutoSave();
        setupPreloading();
        restoreCalculatorState();
        
        // Log cache status
        setTimeout(() => {
            const stats = window.SharkCache.getStats();
            console.log('[SharkCache] Stats:', stats);
        }, 2000);
    }

    // Run initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();

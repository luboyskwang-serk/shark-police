/**
 * Shark Police - Stability Utilities
 * Created by Kaneji Nightfall
 * 
 * Basic stability features - no aggressive optimizations
 */

(function() {
    'use strict';

    // ===== Error Handler =====
    const ErrorHandler = {
        init() {
            window.addEventListener('error', (event) => {
                console.error('[Shark Police] Error:', event.error || event.message);
                event.preventDefault();
            });

            window.addEventListener('unhandledrejection', (event) => {
                console.error('[Shark Police] Unhandled rejection:', event.reason);
                event.preventDefault();
            });
        }
    };

    // ===== Page Visibility Handler =====
    const VisibilityHandler = {
        init() {
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    window.dispatchEvent(new CustomEvent('shark-police:hidden'));
                } else {
                    window.dispatchEvent(new CustomEvent('shark-police:visible'));
                }
            });
        }
    };

    // ===== Network Status Monitor =====
    const NetworkMonitor = {
        isOnline: navigator.onLine,

        init() {
            window.addEventListener('online', () => {
                this.isOnline = true;
                window.dispatchEvent(new CustomEvent('shark-police:online'));
            });

            window.addEventListener('offline', () => {
                this.isOnline = false;
                window.dispatchEvent(new CustomEvent('shark-police:offline'));
            });
        }
    };

    // ===== Initialize =====
    function init() {
        try {
            ErrorHandler.init();
            VisibilityHandler.init();
            NetworkMonitor.init();

            window.SharkPoliceUtils = {
                ErrorHandler,
                VisibilityHandler,
                NetworkMonitor
            };

            console.log('[Shark Police] Stability utilities initialized');
        } catch (error) {
            console.error('[Shark Police] Stability init error:', error);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();

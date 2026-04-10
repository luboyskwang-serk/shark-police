/**
 * Shark Police - Anti-Copy Protection (Improved Stability)
 * Created by Kaneji Nightfall
 *
 * ป้องกันการก๊อปปี้โค้ดและเปิด Developer Tools
 * 
 * Stability Improvements:
 * - Non-blocking protection (doesn't break functionality)
 * - Error handling
 * - Allows accessibility features
 * - No pointerEvents manipulation (prevents UI breaks)
 */

(function() {
    'use strict';

    // Configuration - Allow certain keys for accessibility
    const ALLOWED_KEYS = ['F5', 'F12', 'PrintScreen'];
    
    // Track if protection is active
    let protectionActive = true;

    // Disable Right Click (with exception for input fields)
    document.addEventListener('contextmenu', function(e) {
        // Allow context menu on input fields for accessibility
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return true;
        }
        e.preventDefault();
        return false;
    });

    // Disable F12 and DevTools Shortcuts (Non-blocking)
    document.addEventListener('keydown', function(e) {
        // Allow F5 for refresh
        if (e.key === 'F5') {
            return true;
        }

        // Disable F12 (non-blocking - just prevent default)
        if (e.key === 'F12') {
            e.preventDefault();
            return false;
        }

        // Disable Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
        if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C' ||
            e.key === 'i' || e.key === 'j' || e.key === 'c')) {
            e.preventDefault();
            return false;
        }

        // Disable Ctrl+U (View Source)
        if (e.ctrlKey && (e.key === 'U' || e.key === 'u')) {
            e.preventDefault();
            return false;
        }

        // Disable Ctrl+Shift, Ctrl+Alt (only on non-input elements)
        if ((e.ctrlKey && e.shiftKey) || (e.ctrlKey && e.altKey)) {
            if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                e.preventDefault();
                return false;
            }
        }

        // Disable PrintScreen (show warning only)
        if (e.key === 'PrintScreen') {
            console.warn('⚠️ Screenshot is prohibited!');
            // Don't prevent default to avoid breaking system functionality
        }
    }, { passive: false });

    // Disable Text Selection (except on inputs)
    function applyUserSelect() {
        try {
            document.body.style.webkitUserSelect = 'none';
            document.body.style.mozUserSelect = 'none';
            document.body.style.msUserSelect = 'none';
            document.body.style.userSelect = 'none';
        } catch (e) {
            console.error('[Shark Police] User select error:', e);
        }
    }
    applyUserSelect();

    // Disable Image Drag (with error handling)
    document.addEventListener('DOMContentLoaded', function() {
        document.querySelectorAll('img').forEach(img => {
            img.addEventListener('dragstart', function(e) {
                e.preventDefault();
                return false;
            });
        });
    });

    // Prevent Drag & Drop (non-blocking)
    document.addEventListener('dragstart', function(e) {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
            return false;
        }
    }, { passive: false });

    document.addEventListener('drop', function(e) {
        e.preventDefault();
        return false;
    }, { passive: false });

    // Clear Console on Load
    if (console.clear) {
        console.clear();
    }

    // Custom Console Messages
    console.log('%c🦈 Shark Police - Protected System', 'color: #0ea5e9; font-size: 24px; font-weight: bold;');
    console.log('%c⚠️ Unauthorized copying is prohibited!', 'color: #ef4444; font-size: 16px; font-weight: bold;');
    console.log('%c👨‍💻 Created by Kaneji Nightfall', 'color: #10b981; font-size: 14px;');

    // Anti-Copy Event (non-blocking)
    document.addEventListener('copy', function(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return true; // Allow copy in input fields
        }
        console.warn('⚠️ Copying content is prohibited!');
        // Don't prevent default to avoid breaking functionality
    });

    document.addEventListener('cut', function(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return true; // Allow cut in input fields
        }
        e.preventDefault();
        return false;
    });

    // Passive DevTools detection (non-intrusive)
    let devtoolsDetected = false;
    
    function detectDevTools() {
        try {
            // Check window dimensions (non-intrusive)
            const widthThreshold = window.outerWidth - window.innerWidth > 200;
            const heightThreshold = window.outerHeight - window.innerHeight > 200;

            if (widthThreshold || heightThreshold) {
                devtoolsDetected = true;
            } else {
                devtoolsDetected = false;
            }
        } catch (e) {
            // Silently fail
        }
    }

    // Check every 2 seconds (reduced frequency for performance)
    setInterval(detectDevTools, 2000);

    // Export protection status for debugging
    window.SharkPoliceProtection = {
        isActive: function() {
            return protectionActive;
        },
        isDevtoolsDetected: function() {
            return devtoolsDetected;
        }
    };

})();

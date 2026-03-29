/**
 * Shark Police - Anti-Copy Protection
 * Created by Kaneji Nightfall
 * 
 * ป้องกันการก๊อปปี้โค้ดและเปิด Developer Tools
 */

(function() {
    'use strict';

    // Disable Right Click
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });

    // Disable F12 and DevTools Shortcuts
    document.addEventListener('keydown', function(e) {
        // Disable F12
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
        
        // Disable Ctrl+Shift, Ctrl+Alt
        if ((e.ctrlKey && e.shiftKey) || (e.ctrlKey && e.altKey)) {
            e.preventDefault();
            return false;
        }
        
        // Disable PrintScreen
        if (e.key === 'PrintScreen') {
            e.preventDefault();
            alert('⚠️ การแคปหน้าจอถูกห้ามไว้!\n⚠️ Screenshot is prohibited!');
            return false;
        }
    });

    // Disable Text Selection
    document.body.style.webkitUserSelect = 'none';
    document.body.style.mozUserSelect = 'none';
    document.body.style.msUserSelect = 'none';
    document.body.style.userSelect = 'none';

    // Disable Image Drag
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('dragstart', function(e) {
            e.preventDefault();
            return false;
        });
    });

    // Prevent Drag & Drop
    document.addEventListener('dragstart', function(e) {
        e.preventDefault();
        return false;
    });

    document.addEventListener('drop', function(e) {
        e.preventDefault();
        return false;
    });

    // Detect DevTools Open (Advanced)
    (function() {
        var element = new Image();
        Object.defineProperty(element, 'id', {
            get: function() {
                console.log('%c🛑 DevTools detected!', 'color: #ef4444; font-size: 16px; font-weight: bold;');
                debugger;
            }
        });
        console.log(element);
    })();

    // Clear Console on Load
    console.clear();
    
    // Custom Console Messages
    console.log('%c🦈 Shark Police - Protected System', 'color: #0ea5e9; font-size: 24px; font-weight: bold; text-shadow: 0 0 10px rgba(14, 165, 233, 0.5);');
    console.log('%c⚠️ Unauthorized copying is prohibited!', 'color: #ef4444; font-size: 16px; font-weight: bold;');
    console.log('%c👨‍💻 Created by Kaneji Nightfall', 'color: #10b981; font-size: 14px;');

    // Anti-Copy Event
    document.addEventListener('copy', function(e) {
        e.preventDefault();
        alert('⚠️ การคัดลอกเนื้อหาถูกห้ามไว้!\n⚠️ Copying content is prohibited!');
        return false;
    });

    document.addEventListener('cut', function(e) {
        e.preventDefault();
        return false;
    });

    // Prevent Inspect Element via Element Context Menu
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    }, true);

    // Disable Pointer Events on Developer Tools Trigger
    let devtools = false;
    setInterval(function() {
        if (window.outerHeight - window.innerHeight > 200 || 
            window.outerWidth - window.innerWidth > 200) {
            devtools = true;
            document.body.style.pointerEvents = 'none';
            setTimeout(function() {
                document.body.style.pointerEvents = 'auto';
            }, 1000);
        }
    }, 1000);

})();

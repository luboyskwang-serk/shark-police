/**
 * Shark Police - Debug & Diagnostic Tool
 * Use this to check if all resources are loading correctly
 */

(function() {
    'use strict';

    console.log('='.repeat(50));
    console.log('🔍 SHARK POLICE - DEBUG CONSOLE');
    console.log('='.repeat(50));

    // Check DOM Ready
    console.log('[✓] DOM Ready State:', document.readyState);

    // Check CSS
    console.log('\n📄 CSS FILES LOADED:');
    document.styleSheets.forEach((sheet, index) => {
        try {
            const rules = sheet.cssRules || sheet.rules;
            console.log(`  [${index + 1}] ✓ ${sheet.href || 'Inline'}`);
            console.log(`      Rules: ${rules ? rules.length : 'Unknown'}`);
        } catch (e) {
            console.log(`  [${index + 1}] ⚠ ${sheet.href || 'Inline'} (CORS restriction)`);
        }
    });

    // Check Scripts
    console.log('\n📜 JAVASCRIPT FILES LOADED:');
    const scripts = document.getElementsByTagName('script');
    Array.from(scripts).forEach((script, index) => {
        const src = script.src || 'Inline';
        const status = script.src ? '✓ Loaded' : '✓ Executed';
        console.log(`  [${index + 1}] ${status} - ${src}`);
    });

    // Check Alpine.js
    console.log('\n🔧 ALPINE.JS STATUS:');
    if (window.Alpine) {
        console.log('  [✓] Alpine.js is loaded');
        console.log('  Version:', Alpine.version || 'Unknown');
    } else {
        console.log('  [❌] Alpine.js NOT FOUND!');
    }

    // Check TailwindCSS
    console.log('\n🎨 TAILWINDCSS STATUS:');
    if (window.tailwind) {
        console.log('  [✓] TailwindCSS is loaded');
    } else {
        console.log('  [⚠] TailwindCSS object not found (but may still work via CDN)');
    }

    // Check SweetAlert2
    console.log('\n📢 SWEETALERT2 STATUS:');
    if (window.Sweetalert2) {
        console.log('  [✓] SweetAlert2 is loaded');
    } else {
        console.log('  [❌] SweetAlert2 NOT FOUND!');
    }

    // Check SoundFX
    console.log('\n🔊 SOUND SYSTEM STATUS:');
    if (window.SoundFX) {
        console.log('  [✓] SoundFX system loaded');
        console.log('  Enabled:', SoundFX.enabled);
        console.log('  Sounds loaded:', Object.keys(SoundFX.sounds || {}).length);
        console.log('  Initialized:', SoundFX.initialized);
        
        if (SoundFX.sounds) {
            Object.keys(SoundFX.sounds).forEach(soundName => {
                const sound = SoundFX.sounds[soundName];
                if (sound) {
                    console.log(`    [✓] ${soundName}: ${sound.readyState >= 3 ? 'Ready' : 'Loading...'}`);
                } else {
                    console.log(`    [❌] ${soundName}: Failed to load`);
                }
            });
        }
    } else {
        console.log('  [❌] SoundFX NOT FOUND!');
    }

    // Check Calculator App
    console.log('\n🧮 CALCULATOR APP STATUS:');
    if (window.calculatorAppInstance) {
        console.log('  [✓] Calculator app is initialized');
        console.log('  Current Section:', window.calculatorAppInstance.currentSection);
        console.log('  Selected Charges:', window.calculatorAppInstance.selectedCharges?.length || 0);
    } else {
        console.log('  [⚠] Calculator app not found in global scope');
    }

    // Check Performance
    console.log('\n⚡ PERFORMANCE METRICS:');
    if (performance.getEntriesByType) {
        const navigation = performance.getEntriesByType('navigation')[0];
        if (navigation) {
            console.log('  DOM Load Time:', (navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart).toFixed(2), 'ms');
            console.log('  Full Load Time:', (navigation.loadEventEnd - navigation.loadEventStart).toFixed(2), 'ms');
        }
    }

    // Check File Paths
    console.log('\n📁 FILE PATH CHECK:');
    const filesToCheck = [
        './assets/css/style.css',
        './assets/js/app-simple.js',
        './assets/js/performance.js',
        './assets/sounds/toggle.mp3',
        './assets/sounds/switch.mp3',
        './assets/sounds/beep1.mp3'
    ];

    filesToCheck.forEach(file => {
        fetch(file, { method: 'HEAD' })
            .then(response => {
                if (response.ok) {
                    console.log(`  [✓] ${file} - ${response.status} OK`);
                } else {
                    console.log(`  [❌] ${file} - ${response.status} ${response.statusText}`);
                }
            })
            .catch(error => {
                console.log(`  [❌] ${file} - ERROR: ${error.message}`);
            });
    });

    // Check Browser Info
    console.log('\n🌐 BROWSER INFO:');
    console.log('  User Agent:', navigator.userAgent);
    console.log('  Language:', navigator.language);
    console.log('  Online:', navigator.onLine);
    console.log('  Cookie Enabled:', navigator.cookieEnabled);

    // Check LocalStorage
    console.log('\n💾 LOCALSTORAGE STATUS:');
    try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        console.log('  [✓] LocalStorage is working');
        console.log('  Sound Enabled:', localStorage.getItem('sharkPoliceSoundEnabled'));
    } catch (e) {
        console.log('  [❌] LocalStorage is blocked');
    }

    // Quick Test Functions
    console.log('\n🎮 QUICK TEST COMMANDS:');
    console.log('  - Debug.checkSounds() - Test all sounds');
    console.log('  - Debug.testApp() - Test calculator app');
    console.log('  - Debug.clearCache() - Clear cache and reload');

    // Expose debug functions
    window.Debug = {
        checkSounds() {
            console.log('\n🔊 TESTING SOUNDS:');
            if (window.SoundFX) {
                Object.keys(SoundFX.sounds).forEach(soundName => {
                    console.log(`  Playing: ${soundName}`);
                    SoundFX.play(soundName);
                });
            } else {
                console.log('  SoundFX not loaded!');
            }
        },

        testApp() {
            console.log('\n🧮 TESTING CALCULATOR:');
            if (window.calculatorAppInstance) {
                const app = window.calculatorAppInstance;
                console.log('  Resetting form...');
                app.resetForm();
                console.log('  Done!');
            } else {
                console.log('  Calculator app not found!');
            }
        },

        clearCache() {
            console.log('\n🗑️ CLEARING CACHE...');
            localStorage.clear();
            sessionStorage.clear();
            console.log('  Cache cleared!');
            console.log('  Reloading in 2 seconds...');
            setTimeout(() => {
                window.location.reload(true);
            }, 2000);
        }
    };

    console.log('\n' + '='.repeat(50));
    console.log('✅ DEBUG COMPLETE');
    console.log('='.repeat(50));

})();

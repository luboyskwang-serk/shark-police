/**
 * Shark Police v.0.0.4 - Calculator Performance Optimizer
 * Optimizes calculation performance for smooth user experience
 */

(function() {
    'use strict';

    // ===== Calculation Optimization =====
    const CalculatorOptimizer = {
        // Cache for calculated results
        resultCache: new Map(),

        // Throttle calculation updates
        throttle(func, delay) {
            let lastCall = 0;
            let lastResult = null;

            return function(...args) {
                const now = Date.now();
                const key = JSON.stringify(args);

                // Check cache first
                if (this.resultCache.has(key)) {
                    return this.resultCache.get(key);
                }

                // Throttle rapid calculations
                if (now - lastCall >= delay) {
                    lastCall = now;
                    lastResult = func.apply(this, args);
                    this.resultCache.set(key, lastResult);

                    // Limit cache size
                    if (this.resultCache.size > 100) {
                        const firstKey = this.resultCache.keys().next().value;
                        this.resultCache.delete(firstKey);
                    }
                }

                return lastResult;
            };
        },

        // Batch DOM updates for calculations
        batchDOMUpdates(callback) {
            requestAnimationFrame(() => {
                callback();
            });
        },

        // Debounce for search/filter
        debounce(func, delay) {
            let timeoutId;
            return function(...args) {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => func.apply(this, args), delay);
            };
        }
    };

    // ===== Initialize Calculator Optimizations =====
    function initCalculatorOptimization() {
        // Optimize charge item clicks
        document.addEventListener('click', function(e) {
            const chargeItem = e.target.closest('.charge-item');
            if (chargeItem) {
                // Add passive listener for better touch response
                chargeItem.style.touchAction = 'manipulation';
            }
        }, { passive: true });

        // Optimize result updates
        if (window.updateResult) {
            window.updateResult = CalculatorOptimizer.throttle(window.updateResult, 16);
        }

        // Optimize bail calculation
        if (window.calculateBail) {
            window.calculateBail = CalculatorOptimizer.throttle(window.calculateBail, 16);
        }

        console.log('[Shark Police] ⚡ Calculator optimizations initialized');
    }

    // ===== Touch Optimization for Mobile =====
    function setupTouchOptimization() {
        // Add touch-action for better mobile response
        const interactiveElements = document.querySelectorAll(
            '.charge-item, .btn, .bail-btn, .preset-btn, .filter-btn'
        );

        interactiveElements.forEach(el => {
            el.style.touchAction = 'manipulation';
            el.style.webkitTapHighlightColor = 'transparent';
        });
    }

    // ===== Memory Cleanup =====
    function setupMemoryCleanup() {
        // Clean up cache periodically
        setInterval(() => {
            if (CalculatorOptimizer.resultCache.size > 50) {
                const keysToDelete = Array.from(CalculatorOptimizer.resultCache.keys()).slice(0, 25);
                keysToDelete.forEach(key => CalculatorOptimizer.resultCache.delete(key));
            }
        }, 30000);
    }

    // ===== Initialize =====
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initCalculatorOptimization();
            setupTouchOptimization();
            setupMemoryCleanup();
        });
    } else {
        initCalculatorOptimization();
        setupTouchOptimization();
        setupMemoryCleanup();
    }

    // Expose globally
    window.CalculatorOptimizer = CalculatorOptimizer;

})();

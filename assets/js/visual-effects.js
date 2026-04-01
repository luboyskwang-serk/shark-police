/**
 * Shark Police - Visual Effects (Lite Version)
 * Created by Kaneji Nightfall
 * 
 * เพิ่มความสวยงามแบบเรียบง่าย ไม่ลายตา
 */

(function() {
    'use strict';

    // ===== Scroll Animations (Fade In) =====
    function setupScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe cards
        document.querySelectorAll('.card').forEach(el => {
            el.classList.add('animate-on-scroll');
            observer.observe(el);
        });
    }

    // ===== Add Minimal CSS =====
    function addMinimalStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Fade in animation */
            .animate-on-scroll {
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.5s ease, transform 0.5s ease;
            }

            .animate-on-scroll.animate-in {
                opacity: 1;
                transform: translateY(0);
            }

            /* Subtle hover for charge items */
            .charge-item {
                transition: all 0.2s ease;
            }

            .charge-item:hover {
                transform: translateY(-2px);
            }

            .charge-item.selected {
                background: rgba(14, 165, 233, 0.15);
                border-color: rgba(14, 165, 233, 0.3);
            }

            /* Smooth result panel */
            .result-panel {
                transition: box-shadow 0.3s ease;
            }

            .result-panel:hover {
                box-shadow: 0 10px 40px rgba(14, 165, 233, 0.15);
            }

            /* Toast notification */
            .toast {
                animation: toastFadeIn 0.3s ease;
            }

            @keyframes toastFadeIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // ===== Initialize =====
    function init() {
        addMinimalStyles();
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setupScrollAnimations);
        } else {
            setupScrollAnimations();
        }
    }

    init();

})();

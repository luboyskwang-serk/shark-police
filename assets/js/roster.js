/**
 * Shark Police v.0.0.3 - Police Roster (Search Only)
 * Clean, Simple, Beautiful Cards
 */

(function() {
    'use strict';

    // ===== Officer Data (126 officers) =====
    const officers = [
        "Taohuai Nomsod", "Kamkaew Crystalyn", "Athena Tier", "Khxwoatz Earaxs", "Dayrox Wraith",
        "Pakkard Chapeach", "Pukpik Badkidz", "Noah Jaroenkit", "Tengtwo Rxkkaimaipxn", "Kapom Muondaituay",
        "Natalie Winterfeii", "Seayu Lookkunnhu", "Bonus Caramel", "Pakkx Oooo", "Ren Forlorn",
        "Chawaelong Scappy", "Chayen Khonmanbuea", "Time Pmnnn", "Hyper Stone", "Peath Cxrwyn",
        "Kaneji Nightfall", "Jaycob Dekkarm", "Aki Raksudjai", "Cat Lookkunnhu", "Wang Crous",
        "Shiba Whitepolice", "Wxfile Luvpakk", "Kim Master", "Franky Wara", "Itim Chapeach",
        "Khaichiao Lhorlamet", "Phoom Crous", "Winner Vanishin", "Platwo Acaciaz", "Exvy Raxcrygorjeb",
        "Whale Hidensecret", "Yves Lookkunnhu", "Dino Milomee", "Kxr Kxr",
        "Carter Okane", "Namngern Chearavanon", "Euro Aprivate",
        "Poom Nakub", "Brown Lenyai", "Haru Loveroblox", "The Team", "K Lookkunnhu",
        "Limit Policehub", "Alex Song", "Phak Chi", "Emily Carter", "Pech Naitom",
        "Jub Asddsadadadsadasdasd", "Grimmie Mollyshine", "Oliver Alku", "Kai Palowwwww",
        "Non Suki", "Dada Lonuzer", "Hornet Hornet", "Pudding Badmedic", "Simon Rakkaimaipen",
        "Martin Alwayssad", "Suabai Bong", "Lucas Justwannabeyours", "Kitty Halston", "Jayden Carino",
        "Hamar Mi", "Nick Name", "Asuna Policehub", "Meetangnn Sdouble", "Grilchicken Rose",
        "Flow Lesbaron", "Rew Crous", "Kuma Jee", "Win Uk",
        "Soco Saka", "Jobjob Bansare", "Kirby Kaiwa", "Delta Nakamura", "Razer Realtime",
        "Itsme Luvpakk", "Gummybear Faded", "Nemo Bears", "Chilymn Snxw", "Rabbit Stone",
        "Mamoang Preawza", "Greytel Anthea", "John Weed", "Tonga God", "Kamin Soiyik",
        "Pungping Badmedic", "Boy Sapanpla", "Saengnuea Rakraepiak", "Kobee Hawk", "Zane Cross",
        "Loveyou Smith", "Pipo San", "Steve Harrington", "Boss Lookkunnhu",
        "Felix Kaiwa", "Talay Policehub", "Lamine Yamal", "Jaonua Lesoo", "Khaosoi Moosub",
        "Chalam Poonpoon", "Morphine Makubriansakol", "Sep Annilharrgh", "Jinny Nosleep", "Cipher Flashback",
        "Pakkaram Raktersamemma", "Shark Ssr", "Sosyo Kikkoman", "Pecco Ferminz", "Zax Whoneedluv",
        "Poom Naja", "Blue Constarquen", "Yuta Shawk", "Bento Lookkunnhu",
        "Bemb Blackpolice", "Jr Onenabe", "Ke Roro", "Sphinx Badmedic", "Zenteir Rakfan",
        "Takob Kompee", "Perty Sxler", "Nongbabe Poonpoon", "Home Lookkunnhu"
    ];

    // ===== Configuration =====
    const CONFIG = {
        DEBOUNCE_DELAY: 150
    };

    // ===== Cache =====
    const Cache = {
        initials: new Map()
    };

    // ===== Utility Functions =====
    const Utils = {
        debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    timeout = null;
                    func.apply(this, args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        getInitials(name) {
            if (Cache.initials.has(name)) {
                return Cache.initials.get(name);
            }
            const parts = name.trim().split(' ');
            const initials = parts.length >= 2 
                ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
                : name.slice(0, 2).toUpperCase();
            Cache.initials.set(name, initials);
            return initials;
        },

        highlightText(text, query) {
            if (!query) return text;
            const regex = new RegExp(`(${query})`, 'gi');
            return text.replace(regex, '<mark>$1</mark>');
        }
    };

    // ===== DOM Manager =====
    const DOM = {
        elements: {},
        
        get(id) {
            if (!this.elements[id]) {
                this.elements[id] = document.getElementById(id);
            }
            return this.elements[id];
        },

        setHTML(element, html) {
            if (element) element.innerHTML = html;
        }
    };

    // ===== Main Roster Controller =====
    const Roster = {
        allCards: [],

        async init() {
            if (document.readyState === 'loading') {
                await new Promise(resolve => {
                    document.addEventListener('DOMContentLoaded', resolve, { once: true });
                });
            }

            this.cacheDOM();
            this.bindEvents();
            this.showPlaceholder();
            this.updateCount();
            
            console.log('[Roster] Search-only mode initialized');
        },

        cacheDOM() {
            this.dom = {
                searchInput: DOM.get('rosterSearch'),
                searchClear: DOM.get('searchClear'),
                rosterGrid: DOM.get('rosterGrid'),
                noResults: DOM.get('noResults'),
                searchResults: DOM.get('searchResults'),
                rosterCount: DOM.get('rosterCount')
            };
        },

        bindEvents() {
            // Search with debounce
            if (this.dom.searchInput) {
                const debouncedSearch = Utils.debounce((e) => {
                    this.search(e.target.value);
                }, CONFIG.DEBOUNCE_DELAY);

                this.dom.searchInput.addEventListener('input', debouncedSearch, { passive: true });
            }

            // Clear button
            if (this.dom.searchClear) {
                this.dom.searchClear.addEventListener('click', () => {
                    this.dom.searchInput.value = '';
                    this.search('');
                    this.dom.searchInput.focus();
                    this.showPlaceholder();
                }, { passive: true });
            }

            // Keyboard shortcuts
            document.addEventListener('keydown', (e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                    e.preventDefault();
                    this.dom.searchInput.focus();
                    this.dom.searchInput.select();
                }
                if (e.key === 'Escape') {
                    this.dom.searchInput.blur();
                    this.dom.searchInput.value = '';
                    this.search('');
                    this.showPlaceholder();
                }
            }, { passive: false });
        },

        createCard(name, index, query = '') {
            const initials = Utils.getInitials(name);
            const highlightedName = Utils.highlightText(name, query);
            
            const card = document.createElement('div');
            card.className = 'officer-card';
            card.dataset.name = name;
            card.dataset.index = index;
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            card.setAttribute('aria-label', name);
            
            card.innerHTML = `
                <div class="officer-avatar">${initials}</div>
                <div class="officer-name">${highlightedName}</div>
                <div class="officer-badge">
                    <i class="fas fa-shield-alt"></i>
                    <span>ตำรวจ</span>
                </div>
            `;

            // Click handler
            card.addEventListener('click', () => {
                this.copyName(name);
            }, { passive: true });

            // Keyboard handler
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.copyName(name);
                }
            }, { passive: false });

            return card;
        },

        showPlaceholder() {
            if (!this.dom.rosterGrid) return;

            this.dom.rosterGrid.classList.remove('search-results-layout');
            
            const placeholder = document.createElement('div');
            placeholder.className = 'placeholder-message';
            placeholder.innerHTML = `
                <div class="placeholder-icon">
                    <i class="fas fa-search"></i>
                </div>
                <h3>ค้นหาชื่อตำรวจ</h3>
                <p>พิมพ์ชื่อเพื่อค้นหาและแสดงรายชื่อ</p>
                <div class="placeholder-hint">
                    <span class="hint-key">Ctrl+K</span>
                    <span class="hint-text">เพื่อค้นหา</span>
                </div>
            `;
            placeholder.style.cssText = `
                grid-column: 1/-1;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 4rem 2rem;
                text-align: center;
                color: var(--shark-gray);
            `;

            DOM.setHTML(this.dom.rosterGrid, '');
            this.dom.rosterGrid.appendChild(placeholder);
            this.allCards = [];
        },

        search: Utils.debounce(function(query) {
            query = query.trim().toLowerCase();

            // Clear button visibility
            if (this.dom.searchClear) {
                this.dom.searchClear.style.display = query ? 'flex' : 'none';
            }

            // Show placeholder when empty
            if (!query) {
                this.showPlaceholder();
                if (this.dom.searchResults) {
                    this.dom.searchResults.textContent = `แสดงทั้งหมด ${officers.length} อัตรา`;
                }
                if (this.dom.noResults) this.dom.noResults.style.display = 'none';
                return;
            }

            // Filter officers
            const results = officers.filter(name => name.toLowerCase().includes(query));

            // Update count
            if (this.dom.searchResults) {
                this.dom.searchResults.textContent = `พบ ${results.length} อัตรา`;
            }

            // Show/hide no results
            if (this.dom.noResults && this.dom.rosterGrid) {
                if (results.length === 0) {
                    this.dom.noResults.style.display = 'flex';
                    this.dom.rosterGrid.style.display = 'none';
                    return;
                } else {
                    this.dom.noResults.style.display = 'none';
                    this.dom.rosterGrid.style.display = 'grid';
                }
            }

            // Display all matching results
            const fragment = document.createDocumentFragment();
            
            // Set grid layout for search results
            this.dom.rosterGrid.classList.add('search-results-layout');
            
            for (let i = 0; i < results.length; i++) {
                const card = this.createCard(results[i], officers.indexOf(results[i]), query);
                fragment.appendChild(card);
            }

            DOM.setHTML(this.dom.rosterGrid, '');
            this.dom.rosterGrid.appendChild(fragment);
            this.allCards = Array.from(this.dom.rosterGrid.querySelectorAll('.officer-card'));

            // Animate cards entrance
            this.animateCardsEntrance();

        }, CONFIG.DEBOUNCE_DELAY),

        animateCardsEntrance() {
            const cards = this.dom.rosterGrid.querySelectorAll('.officer-card');
            cards.forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                card.style.transition = `all 0.3s ease ${index * 0.03}s`;
                
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 50);
            });
        },

        copyName(name) {
            navigator.clipboard.writeText(name).then(() => {
                this.showToast(`คัดลอก: ${name}`);
            }).catch(() => {
                const textarea = document.createElement('textarea');
                textarea.value = name;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                this.showToast(`คัดลอก: ${name}`);
            });
        },

        showToast(message) {
            const existingToast = document.querySelector('.roster-toast');
            if (existingToast) {
                existingToast.remove();
            }

            const toast = document.createElement('div');
            toast.className = 'roster-toast';
            toast.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <span>${message}</span>
            `;
            document.body.appendChild(toast);

            requestAnimationFrame(() => {
                toast.classList.add('active');
            });

            setTimeout(() => {
                toast.classList.remove('active');
                setTimeout(() => toast.remove(), 300);
            }, 2000);
        },

        updateCount() {
            if (this.dom.rosterCount) {
                this.dom.rosterCount.textContent = `${officers.length} อัตรา`;
            }
        },

        getTotalOfficers() {
            return officers.length;
        }
    };

    // ===== Initialize =====
    Roster.init();

    // Expose for debugging
    window.SharkRoster = Roster;

})();

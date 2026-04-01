/**
 * Shark Police v.0.0.3 - Simple Calculator (No Login)
 * Created by Kaneji Nightfall
 *
 * Stability Improvements:
 * - Error handling with try-catch blocks
 * - Input validation and sanitization
 * - Null/undefined checks
 * - Memory leak prevention
 * - Graceful degradation
 */

// ===== Sound Effect System =====
const SoundFX = {
    enabled: true,
    sounds: {},
    volume: 0.5,
    initialized: false,
    basePath: '', // Will be set dynamically

    init() {
        // Prevent double initialization
        if (this.initialized) return;

        // Detect base path dynamically
        this.basePath = window.location.protocol + '//' + window.location.host;
        const pathParts = window.location.pathname.split('/');
        if (pathParts.length > 2) {
            // Remove last folder/file
            pathParts.pop();
            this.basePath += pathParts.join('/');
        }

        // Load all sounds with relative paths
        this.sounds = {
            toggle: this.loadSound('./assets/sounds/toggle.mp3'),
            switch: this.loadSound('./assets/sounds/switch.mp3'),
            beep1: this.loadSound('./assets/sounds/beep1.mp3'),
            close_ui: this.loadSound('./assets/sounds/close_ui.mp3'),
            button_click: this.loadSound('./assets/sounds/button_click.mp3'),
            typing: this.loadSound('./assets/sounds/typing.mp3'),
            open_ui: this.loadSound('./assets/sounds/open_ui.mp3'),
            swoosh: this.loadSound('./assets/sounds/swoosh.mp3')
        };

        // Load saved preference
        const saved = localStorage.getItem('sharkPoliceSoundEnabled');
        if (saved !== null) {
            this.enabled = saved === 'true';
        }

        // Setup toggle button after DOM is ready
        setTimeout(() => {
            this.setupToggle();
            this.updateIcon();
        }, 100);

        this.initialized = true;
        console.log('[SoundFX] Initialized with', Object.keys(this.sounds).length, 'sounds');
    },

    loadSound(path) {
        try {
            const audio = new Audio(path);
            audio.preload = 'auto';
            audio.volume = this.volume;
            
            // Add error logging
            audio.addEventListener('error', (e) => {
                console.warn('[SoundFX] Failed to load:', path, e);
            });
            
            audio.addEventListener('canplaythrough', () => {
                console.log('[SoundFX] Loaded:', path);
            });
            
            return audio;
        } catch (e) {
            console.warn('[SoundFX] Failed to load sound:', path, e);
            return null;
        }
    },

    play(soundName) {
        if (!this.enabled || !this.sounds[soundName]) {
            return;
        }

        try {
            const sound = this.sounds[soundName].cloneNode();
            sound.volume = this.volume;
            
            // Play with error handling
            const playPromise = sound.play();
            if (playPromise !== undefined) {
                playPromise.catch((error) => {
                    // Auto-play was prevented
                    console.log('[SoundFX] Play prevented:', error);
                });
            }
        } catch (e) {
            // Silently fail
        }
    },
    
    setupToggle() {
        const btn = document.getElementById('soundToggle');
        console.log('SoundFX: Setting up toggle, button found:', !!btn);
        if (btn) {
            // Remove any existing listeners
            if (this._toggleHandler) {
                btn.removeEventListener('click', this._toggleHandler);
            }
            this._toggleHandler = () => {
                console.log('SoundFX: Toggle clicked, current state:', this.enabled);
                this.toggle();
                this.play('switch');
            };
            btn.addEventListener('click', this._toggleHandler);
            console.log('SoundFX: Toggle listener attached');
        } else {
            console.warn('SoundFX: Toggle button not found in DOM');
        }
    },
    
    toggle() {
        this.enabled = !this.enabled;
        localStorage.setItem('sharkPoliceSoundEnabled', this.enabled.toString());
        this.updateIcon();
    },
    
    updateIcon() {
        const icon = document.getElementById('soundIcon');
        const btn = document.getElementById('soundToggle');
        if (icon && btn) {
            if (this.enabled) {
                icon.className = 'fas fa-volume-up';
                btn.classList.remove('muted');
                btn.title = 'ปิดเสียง';
            } else {
                icon.className = 'fas fa-volume-mute';
                btn.classList.add('muted');
                btn.title = 'เปิดเสียง';
            }
        }
    }
};

function calculatorApp() {
    return {
        mobileMenuOpen: false,
        currentSection: 'calculator',
        selectedCharges: [],
        moneyRedAmount: '',
        useBail: false,
        notifications: [],

        finesData: {
            illegal_items: [
                { name: 'ปูน', fine: 2000, jail: 10, type: 'normal', image: 'assets/images/cement.png' },
                { name: 'แคปซูล (Capsule A)', fine: 3000, jail: 10, type: 'normal', image: 'assets/images/capsule-a.png' },
                { name: 'แคปซูล (Capsule B)', fine: 3000, jail: 10, type: 'normal', image: 'assets/images/capsule-b.png' },
                { name: 'ตัวยาฝันร้าย', fine: 5000, jail: 10, type: 'normal', image: 'assets/images/capsule-nightmare.png' },
                { name: 'เงินผิดกฎหมาย (เงินแดง)', fine: 0, jail: 15, type: 'normal', multiplier: 'money', image: 'assets/images/black-money.png' }
            ],
            general: [
                { name: 'พื้นที่สุ่มเสี่ยง', fine: 2000, jail: 10, type: 'normal' },
                { name: 'หลบหนี', fine: 2000, jail: 10, type: 'normal' },
                { name: 'ใส่หน้ากากปิดบังหน้าตา', fine: 5000, jail: 0, type: 'normal', image: 'assets/images/mask.png' },
                { name: 'ทะเลาะวิวาท', fine: 20000, jail: 15, type: 'normal' },
                { name: 'หลบหนีขึ้นเขาและลงน้ำ', fine: 0, jail: 10, type: 'normal', multiplier: 'x3' },
                { name: 'หลบหนีออกนอกเมือง', fine: 5000, jail: 10, type: 'normal' },
                { name: 'หลบหนีหลังจากจับกุม', fine: 0, jail: 0, type: 'normal', multiplier: 'x2' },
                { name: 'ทำลายหลักฐาน', fine: 10000, jail: 20, type: 'normal' },
                { name: 'ถืออาวุธในพื้นที่สาธารณะ', fine: 5000, jail: 10, type: 'normal' },
                { name: 'ไม่ให้ความร่วมมือแก่เจ้าหน้าที่', fine: 5000, jail: 10, type: 'normal' },
                { name: 'แจ้งความเท็จ', fine: 5000, jail: 20, type: 'normal' },
                { name: 'กระทำความผิดซึ่งหน้า', fine: 5000, jail: 15, type: 'normal' },
                { name: 'ส่งของผิดกฏหมาย', fine: 5000, jail: 20, type: 'normal' }
            ],
            red_cases: [
                { name: 'ช่วยเหลือ/ขัดขวางการทำงานเจ้าหน้าที่', fine: 20000, jail: 30, type: 'red' },
                { name: 'หมิ่นประมาทเจ้าหน้าที่', fine: 50000, jail: 30, type: 'red' },
                { name: 'บุกรุกเรือนจำ', fine: 30000, jail: 60, type: 'red' },
                { name: 'แหกคุก', fine: 30000, jail: 60, type: 'red' },
                { name: 'ทำร้ายร่างกายประชาชน', fine: 25000, jail: 30, type: 'red' },
                { name: 'ทำร้ายร่างกายหน่วยงาน', fine: 50000, jail: 60, type: 'red' },
                { name: 'ก่อกวน/สร้างความวุ่นวาย', fine: 10000, jail: 30, type: 'red' },
                { name: 'ข่มขู่/กักขังหน่วงเหนี่ยว', fine: 20000, jail: 30, type: 'red' },
                { name: 'แอบอ้างเป็นหน่วยงาน', fine: 50000, jail: 60, type: 'red' },
                { name: 'ขโมยพาหนะประชาชน', fine: 30000, jail: 30, type: 'red' },
                { name: 'ขโมยพาหนะตำรวจ', fine: 50000, jail: 30, type: 'red' },
                { name: 'ฉ้อโกง', fine: 30000, jail: 30, type: 'red' },
                { name: 'หลีกเลี่ยงประกาศหมายเรียก', fine: 20000, jail: 30, type: 'red' },
                { name: 'ทำลายทรัพย์สินของหน่วยงาน', fine: 20000, jail: 30, type: 'red' },
                { name: 'ฝ่าฝืนวงเคอร์ฟิว', fine: 30000, jail: 60, type: 'red' },
                { name: 'ก่อเหตุบริเวณ สน./รพ.', fine: 100000, jail: 60, type: 'red' },
                { name: 'หลบหนีเข้าเรเบล', fine: 50000, jail: 60, type: 'red' },
                { name: 'FULLSYSTEM (3 คดีขึ้นไป)', fine: 200000, jail: 100, type: 'red' }
            ]
        },

        results: {
            totalFine: 0,
            totalJail: 0,
            hasRedCase: false,
            bailOptions: {
                noBail: { time: 0, fine: 0 },
                bail: { time: 0, fine: 0 }
            }
        },

        init() {
            this.setupNavigation();
            this.calculateTotal();
            this.setupSoundEffects();
        },
        
        // Setup sound effects for various interactions
        setupSoundEffects() {
            // Charge selection sound
            document.addEventListener('click', (e) => {
                if (e.target.closest('.charge-item')) {
                    SoundFX.play('toggle');
                }
            });
            
            // Money input typing sound (debounced)
            let typingTimeout;
            document.addEventListener('input', (e) => {
                if (e.target.classList.contains('money-input')) {
                    clearTimeout(typingTimeout);
                    typingTimeout = setTimeout(() => {
                        SoundFX.play('typing');
                    }, 300);
                }
            });
            
            // Quantity input sound
            document.addEventListener('input', (e) => {
                if (e.target.classList.contains('quantity-input')) {
                    SoundFX.play('typing');
                }
            });
        },

        // Quick Preset Functions
        applyQuickPreset(type, withBail = true) {
            SoundFX.play('button_click');
            
            this.selectedCharges = [];
            this.moneyRedAmount = '';
            this.useBail = withBail;

            if (type === 'poon') {
                const poon = this.finesData.illegal_items.find(c => c.name === 'ปูน');
                const escape = this.finesData.general.find(c => c.name === 'หลบหนี');
                if (poon) this.selectedCharges.push({ ...poon, type: 'illegal_items', quantity: 1 });
                if (escape) this.selectedCharges.push({ ...escape, type: 'general', quantity: 1 });
            } else if (type === 'capab') {
                const escape = this.finesData.general.find(c => c.name === 'หลบหนี');
                const randomCap = Math.random() < 0.5 ? 'แคปซูล (Capsule A)' : 'แคปซูล (Capsule B)';
                const cap = this.finesData.illegal_items.find(c => c.name === randomCap);
                if (cap) this.selectedCharges.push({ ...cap, type: 'illegal_items', quantity: 1 });
                if (escape) this.selectedCharges.push({ ...escape, type: 'general', quantity: 1 });
            } else if (type === 'capghost') {
                const ghost = this.finesData.illegal_items.find(c => c.name === 'ตัวยาฝันร้าย');
                const escape = this.finesData.general.find(c => c.name === 'หลบหนี');
                if (ghost) this.selectedCharges.push({ ...ghost, type: 'illegal_items', quantity: 1 });
                if (escape) this.selectedCharges.push({ ...escape, type: 'general', quantity: 1 });
            } else if (type === 'money') {
                const moneyRed = this.finesData.illegal_items.find(c => c.name === 'เงินผิดกฎหมาย (เงินแดง)');
                const escape = this.finesData.general.find(c => c.name === 'หลบหนี');
                if (moneyRed) this.selectedCharges.push({ ...moneyRed, type: 'illegal_items', quantity: 1 });
                if (escape) this.selectedCharges.push({ ...escape, type: 'general', quantity: 1 });
                setTimeout(() => {
                    const moneyInput = document.querySelector('.money-input');
                    if (moneyInput) moneyInput.focus();
                }, 100);
            }

            this.calculateTotal();
        },

        setupNavigation() {
            const handleHashChange = () => {
                const hash = window.location.hash.slice(1) || 'calculator';
                const validSections = ['calculator', 'rules', 'fines-table', 'arrest'];
                this.currentSection = validSections.includes(hash) ? hash : 'calculator';
            };

            handleHashChange();
            window.addEventListener('hashchange', handleHashChange);
        },

        updateNavActive() {
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                const href = link.getAttribute('href');
                const targetHash = href ? href.slice(1) : '';
                link.classList.toggle('active', targetHash === this.currentSection);
            });

            const bottomNavItems = document.querySelectorAll('.bottom-nav-item');
            bottomNavItems.forEach(item => {
                const href = item.getAttribute('href');
                const targetHash = href ? href.slice(1) : '';
                item.classList.toggle('active', targetHash === this.currentSection);
            });
        },

        toggleCharge(charge, type) {
            const index = this.selectedCharges.findIndex(c => c.name === charge.name);
            if (index > -1) {
                this.selectedCharges.splice(index, 1);
            } else {
                this.selectedCharges.push({
                    ...charge,
                    type: type,
                    quantity: 1
                });
            }
            this.calculateTotal();
        },

        isChargeSelected(charge) {
            return this.selectedCharges.some(c => c.name === charge.name);
        },

        updateQuantity(chargeName, quantity) {
            const charge = this.selectedCharges.find(c => c.name === chargeName);
            if (charge) {
                charge.quantity = Math.max(1, parseInt(quantity) || 1);
                this.calculateTotal();
            }
        },

        calculateTotal() {
            let totalFine = 0;
            let totalJail = 0;
            let hasRedCase = false;

            this.selectedCharges.forEach(charge => {
                const quantity = charge.quantity || 1;
                let chargeFine = charge.fine;
                let chargeJail = charge.jail;

                if (charge.multiplier === 'money' && this.moneyRedAmount) {
                    chargeFine = parseInt(this.moneyRedAmount) * 5;
                } else if (charge.multiplier === 'x2' || charge.multiplier === 'x3') {
                    // Multipliers don't use quantity
                } else if (charge.type === 'illegal_items') {
                    chargeFine *= quantity;
                    chargeJail *= quantity;
                }

                totalFine += chargeFine;
                totalJail += chargeJail;

                if (charge.type === 'red_cases') {
                    hasRedCase = true;
                }
            });

            const hasX2 = this.selectedCharges.some(c => c.multiplier === 'x2');
            if (hasX2) {
                totalFine *= 2;
                totalJail *= 2;
            }

            const hasX3 = this.selectedCharges.some(c => c.multiplier === 'x3');
            if (hasX3) {
                totalFine *= 3;
            }

            if (hasRedCase) {
                this.useBail = false;
            }

            const bailRate = 300;

            this.results.bailOptions.noBail = {
                time: totalJail,
                fine: totalFine
            };

            let bailTime, bailFine;
            if (totalJail <= 5) {
                bailTime = totalJail;
                bailFine = totalFine;
            } else {
                bailTime = 5;
                bailFine = totalFine + (totalJail - 5) * bailRate;
            }

            this.results.bailOptions.bail = {
                time: bailTime,
                fine: bailFine
            };

            this.results.totalFine = totalFine;
            this.results.totalJail = totalJail;
            this.results.hasRedCase = hasRedCase;
        },

        formatNumber(num) {
            return num.toLocaleString('th-TH');
        },

        resetForm() {
            SoundFX.play('close_ui');
            
            this.selectedCharges = [];
            this.moneyRedAmount = '';
            this.useBail = false;
            this.calculateTotal();
        },

        copyResult() {
            if (this.selectedCharges.length === 0 && !this.moneyRedAmount) {
                this.showNotification('กรุณาเลือกข้อหา', 'error');
                SoundFX.play('close_ui');
                return;
            }

            const charges = this.selectedCharges.map(c => {
                let name = c.name;
                if (c.type === 'illegal_items' && c.quantity > 1) {
                    name += ` x${c.quantity}`;
                }
                return name;
            }).join(', ');

            const moneyText = this.moneyRedAmount ? `, เงินแดง ${this.moneyRedAmount}` : '';
            const allCharges = `${charges}${moneyText}`;
            const hasRedCase = this.selectedCharges.some(c => c.type === 'red_cases');
            const canBail = !hasRedCase && this.useBail;
            const bailText = canBail ? 'ประกัน' : 'ไม่ประกัน';

            const fineAmount = canBail ? this.results.bailOptions.bail.fine : this.results.totalFine;
            const text = `⚖️ คดี: ${allCharges}, ${bailText}\n💰 ค่าปรับ: ${this.formatNumber(fineAmount)} ฿\n🆘 ช่วยเหลือ : @`;

            navigator.clipboard.writeText(text).then(() => {
                this.showNotification('คัดลอกผลลัพธ์แล้ว!', 'success');
                SoundFX.play('beep1');
            }).catch(() => {
                this.showNotification('ไม่สามารถคัดลอกได้', 'error');
                SoundFX.play('close_ui');
            });
        },
        
        // Toggle bail option with sound
        toggleBail(option) {
            SoundFX.play('switch');
            this.useBail = option;
        },

        showNotification(message, type = 'info') {
            const id = Date.now();
            this.notifications.push({ id, message, type });
            setTimeout(() => {
                this.notifications = this.notifications.filter(n => n.id !== id);
            }, 3000);
        },

        removeNotification(id) {
            this.notifications = this.notifications.filter(n => n.id !== id);
        }
    };
}

// Export app instance for navigation handler
window.calculatorAppInstance = null;

// Initialize Alpine.js app and store instance
document.addEventListener('alpine:init', () => {
    // Store reference to the app instance
    setTimeout(() => {
        const app = document.querySelector('[x-data="calculatorApp()"]');
        if (app && app._x_dataStack) {
            window.calculatorAppInstance = app._x_dataStack[0];
        }
    }, 100);
});

// Header scroll effect
document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Initialize sound toggle button
    SoundFX.init();

    // Add sound to bail option buttons
    document.addEventListener('click', (e) => {
        if (e.target.closest('.bail-btn') || e.target.closest('[x-show*="useBail"]')) {
            SoundFX.play('switch');
        }
    });
});

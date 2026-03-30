/**
 * Shark Police v.0.0.1 - Simple Calculator (No Login)
 * Created by Kaneji Nightfall
 */

function calculatorApp() {
    return {
        currentSection: 'calculator',
        selectedCharges: [],
        moneyRedAmount: '',
        useBail: false, // User's bail selection
        notifications: [],

        finesData: {
            illegal_items: [
                { name: 'ปูน', fine: 2000, jail: 10, type: 'normal' },
                { name: 'แคปซูล (Capsule A)', fine: 3000, jail: 10, type: 'normal' },
                { name: 'แคปซูล (Capsule B)', fine: 3000, jail: 10, type: 'normal' },
                { name: 'แคปซูลตัวร้าย', fine: 5000, jail: 10, type: 'normal' },
                { name: 'เงินผิดกฎหมาย (เงินแดง)', fine: 0, jail: 15, type: 'normal', multiplier: 'money' }
            ],
            general: [
                { name: 'พื้นที่สุ่มเสี่ยง', fine: 2000, jail: 10, type: 'normal' },
                { name: 'หลบหนี', fine: 2000, jail: 10, type: 'normal' },
                { name: 'ใส่หน้ากากปิดบังหน้าตา', fine: 5000, jail: 0, type: 'normal' },
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
        },

        // Quick Preset Functions
        applyQuickPreset(type, withBail = true) {
            this.selectedCharges = [];
            this.moneyRedAmount = '';
            this.useBail = withBail;

            if (type === 'poon') {
                // ปูน + หลบหนี
                const poon = this.finesData.illegal_items.find(c => c.name === 'ปูน');
                const escape = this.finesData.general.find(c => c.name === 'หลบหนี');
                if (poon) this.selectedCharges.push({ ...poon, type: 'illegal_items', quantity: 1 });
                if (escape) this.selectedCharges.push({ ...escape, type: 'general', quantity: 1 });
            } else if (type === 'capab') {
                // แคป A หรือ B (สุ่ม) + หลบหนี
                const escape = this.finesData.general.find(c => c.name === 'หลบหนี');
                // สุ่มเลือก A หรือ B
                const randomCap = Math.random() < 0.5 ? 'แคปซูล (Capsule A)' : 'แคปซูล (Capsule B)';
                const cap = this.finesData.illegal_items.find(c => c.name === randomCap);
                if (cap) this.selectedCharges.push({ ...cap, type: 'illegal_items', quantity: 1 });
                if (escape) this.selectedCharges.push({ ...escape, type: 'general', quantity: 1 });
            } else if (type === 'capghost') {
                // แคปซูลตัวร้าย + หลบหนี
                const ghost = this.finesData.illegal_items.find(c => c.name === 'แคปซูลตัวร้าย');
                const escape = this.finesData.general.find(c => c.name === 'หลบหนี');
                if (ghost) this.selectedCharges.push({ ...ghost, type: 'illegal_items', quantity: 1 });
                if (escape) this.selectedCharges.push({ ...escape, type: 'general', quantity: 1 });
            } else if (type === 'money') {
                // เงินแดง + หลบหนี
                const moneyRed = this.finesData.illegal_items.find(c => c.name === 'เงินผิดกฎหมาย (เงินแดง)');
                const escape = this.finesData.general.find(c => c.name === 'หลบหนี');
                if (moneyRed) this.selectedCharges.push({ ...moneyRed, type: 'illegal_items', quantity: 1 });
                if (escape) this.selectedCharges.push({ ...escape, type: 'general', quantity: 1 });
                // Focus on money input
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

                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${this.currentSection}`) {
                        link.classList.add('active');
                    }
                });
            };

            handleHashChange();
            window.addEventListener('hashchange', handleHashChange);
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
            let normalJail = 0;
            let redJail = 0;

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
                    redJail += chargeJail;
                } else {
                    normalJail += chargeJail;
                }
            });

            const hasX2 = this.selectedCharges.some(c => c.multiplier === 'x2');
            if (hasX2) {
                totalFine *= 2;
                totalJail *= 2;
                normalJail *= 2;
            }

            const hasX3 = this.selectedCharges.some(c => c.multiplier === 'x3');
            if (hasX3) {
                totalFine *= 3;
            }

            // Reset useBail to false if there's a red case
            if (hasRedCase) {
                this.useBail = false;
            }

            const bailRate = 300;

            // No Bail - ติดคุกเต็มจำนวน
            this.results.bailOptions.noBail = {
                time: totalJail,
                fine: totalFine
            };

            // Bail - ประกัน ขั้นต่ำ 5 นาที (300฿/นาที)
            let bailTime, bailFine;

            if (totalJail <= 5) {
                bailTime = totalJail;
                bailFine = totalFine;
            } else {
                const bailCost = (totalJail - 5) * bailRate;
                bailTime = 5;
                bailFine = totalFine + bailCost;
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
            this.selectedCharges = [];
            this.moneyRedAmount = '';
            this.useBail = false;
            this.calculateTotal();
        },

        copyResult() {
            if (this.selectedCharges.length === 0 && !this.moneyRedAmount) {
                this.showNotification('กรุณาเลือกข้อหา', 'error');
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

            // Check if red case exists
            const hasRedCase = this.selectedCharges.some(c => c.type === 'red_cases');

            // Use user's bail selection (but not if red case)
            const canBail = !hasRedCase && this.useBail;
            const bailText = canBail ? 'ประกัน' : 'ไม่ประกัน';

            const jailTime = canBail
                ? this.results.bailOptions.bail.time
                : this.results.totalJail;

            const fineAmount = canBail
                ? this.results.bailOptions.bail.fine
                : this.results.totalFine;

            const text = `⚖️ คดี: ${allCharges}, ${bailText}\n💰 ค่าปรับ: ${this.formatNumber(fineAmount)} ฿\n🆘 ช่วยเหลือ : @`;

            navigator.clipboard.writeText(text).then(() => {
                this.showNotification('คัดลอกผลลัพธ์แล้ว!', 'success');
            }).catch(() => {
                this.showNotification('ไม่สามารถคัดลอกได้', 'error');
            });
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
});

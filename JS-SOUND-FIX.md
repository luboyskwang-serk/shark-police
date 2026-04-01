# 🔧 Shark Police - JavaScript & Sound Troubleshooting

## ปัญหา: JS และเสียงไม่ทำงานบน Hosting

---

## ✅ สิ่งที่แก้ไขแล้ว

### 1. **เพิ่ม Cache Buster**
```html
<script src="./assets/js/app-simple.js?v=0.0.3"></script>
```
- ใช้ `./` นำหน้า path
- เพิ่ม `?v=0.0.3` เพื่อบังคับให้ browser โหลดไฟล์ใหม่

### 2. **แก้ไข Sound Path**
```javascript
// เดิม
'assets/sounds/toggle.mp3'

// ใหม่
'./assets/sounds/toggle.mp3'
```

### 3. **เพิ่ม Error Logging**
- SoundFX จะแสดง log เมื่อโหลดเสียงสำเร็จหรือล้มเหลว
- ตรวจสอบ Console (F12) เพื่อดู error

---

## 🔍 วิธีตรวจสอบปัญหา

### 1. **เปิด Console (F12)**

#### Chrome/Edge:
- กด `F12` หรือ `Ctrl + Shift + I`
- เลือกแท็บ **Console**

#### Firefox:
- กด `F12` หรือ `Ctrl + Shift + K`
- เลือกแท็บ **Console**

### 2. **ดู Debug Output**

ถ้าทุกอย่างทำงานปกติ จะเห็น:
```
==================================================
🔍 SHARK POLICE - DEBUG CONSOLE
==================================================
[✓] DOM Ready State: complete

📄 CSS FILES LOADED:
  [1] ✓ .../assets/css/style.css
      Rules: 450

📜 JAVASCRIPT FILES LOADED:
  [1] ✓ Loaded - .../assets/js/performance.js
  [2] ✓ Loaded - .../assets/js/app-simple.js
  ...

🔧 ALPINE.JS STATUS:
  [✓] Alpine.js is loaded
  Version: 3.13.3

🔊 SOUND SYSTEM STATUS:
  [✓] SoundFX system loaded
  Enabled: true
  Sounds loaded: 8
  Initialized: true
    [✓] toggle: Ready
    [✓] switch: Ready
    [✓] beep1: Ready
    ...
```

### 3. **ทดสอบเสียง**

พิมพ์ใน Console:
```javascript
Debug.checkSounds()
```

จะเล่นเสียงทั้งหมดและแสดงสถานะ

---

## ❌ Error ที่พบบ่อย

### 1. **Failed to load resource: net::ERR_FILE_NOT_FOUND**

**สาเหตุ:** ไฟล์ JS หรือเสียงไม่มีใน hosting

**วิธีแก้:**
1. ตรวจสอบว่าอัปโหลดไฟล์ครบ:
   ```
   ✅ /assets/js/app-simple.js
   ✅ /assets/js/performance.js
   ✅ /assets/js/visual-effects.js
   ✅ /assets/js/anti-copy.js
   ✅ /assets/js/roster.js
   ✅ /assets/js/debug.js
   ✅ /assets/sounds/*.mp3 (ทุกไฟล์)
   ```

2. อัปโหลดใหม่ทั้งหมดแบบ Binary Mode

---

### 2. **Failed to load resource: net::ERR_ABORTED**

**สาเหตุ:** Browser block autoplay

**วิธีแก้:**
1. คลิกที่ใดก็ได้บนหน้าเว็บก่อน (user interaction)
2. กดปุ่มเปิดเสียง (ลำโพงมุมขวาบน)
3. ทดสอบอีกครั้ง

---

### 3. **Uncaught ReferenceError: SoundFX is not defined**

**สาเหตุ:** app-simple.js โหลดไม่สำเร็จ

**วิธีแก้:**
1. ตรวจสอบว่า app-simple.js โหลดก่อน debug.js
2. ดู Network tab ว่าไฟล์โหลดสำเร็จไหม

---

### 4. **Sound not playing**

**สาเหตุ:**
- Browser block autoplay
- ไฟล์เสียงเสียหาย
- Path ไม่ถูกต้อง

**วิธีแก้:**
```javascript
// พิมพ์ใน Console เพื่อทดสอบ
Debug.checkSounds()

// ถ้าไม่ได้ผล ให้เช็ค manual
console.log(SoundFX.sounds);
Object.keys(SoundFX.sounds).forEach(name => {
    const sound = SoundFX.sounds[name];
    console.log(name, sound?.readyState);
});
```

---

## 🎯 วิธีแก้ตาม Hosting

### **000webhost / InfinityFree:**

ปัญหา: ไฟล์ใหญ่โหลดไม่ได้

**แก้:**
1. บีบอัดไฟล์เสียงเป็น MP3 (128kbps)
2. อัปโหลดทีละไฟล์
3. ตรวจสอบ file size (ไม่ควรเกิน 1MB ต่อไฟล์)

---

### **GitHub Pages:**

ปัญหา: CORS block

**แก้:**
```javascript
// เพิ่มใน app-simple.js
audio.crossOrigin = 'anonymous';
```

---

### **Hostinger:**

ปัญหา: File permissions

**แก้:**
1. ไปที่ File Manager
2. คลิกขวาที่ไฟล์ JS > Change Permissions
3. ตั้งค่าเป็น `644`

---

### **Netlify / Vercel:**

ปัญหา: MIME type

**แก้:**
สร้างไฟล์ `public/_headers`:
```
/assets/js/*.js  Content-Type: application/javascript
/assets/sounds/*.mp3  Content-Type: audio/mpeg
```

---

## 🧪 Manual Test

### ทดสอบ JavaScript:
```javascript
// พิมพ์ใน Console
console.log('Alpine:', typeof window.Alpine);
console.log('SoundFX:', typeof window.SoundFX);
console.log('Calculator:', typeof window.calculatorAppInstance);

// ถ้าทั้งหมดเป็น 'object' = ผ่าน ✅
```

### ทดสอบเสียง:
```javascript
// พิมพ์ใน Console
const testSound = new Audio('./assets/sounds/toggle.mp3');
testSound.play()
    .then(() => console.log('✅ Sound works!'))
    .catch(err => console.log('❌ Sound failed:', err));
```

### ทดสอบ Path:
```javascript
// พิมพ์ใน Console
fetch('./assets/sounds/toggle.mp3')
    .then(r => console.log('✅ Path OK:', r.status))
    .catch(e => console.log('❌ Path failed:', e));
```

---

## 📋 Checklist

### JavaScript:
- [ ] ไฟล์ JS ครบทุกไฟล์
- [ ] Path ถูกต้อง (`./assets/js/...`)
- [ ] Cache buster (`?v=0.0.3`)
- [ ] ไฟล์ไม่เสียหาย (size > 0)
- [ ] File permissions ถูกต้อง (644)

### เสียง:
- [ ] ไฟล์เสียงครบทุกไฟล์
- [ ] Path ถูกต้อง (`./assets/sounds/...`)
- [ ] ไฟล์เป็น MP3 format
- [ ] ไฟล์ไม่เสียหาย
- [ ] User interaction ก่อนเล่นเสียง

### Browser:
- [ ] ไม่ได้ block autoplay
- [ ] JavaScript enabled
- [ ] Cache cleared
- [ ] ทดสอบใน Incognito

---

## 🚀 Quick Fix Commands

### Clear Cache & Reload:
```javascript
Debug.clearCache()
```

### Test All Sounds:
```javascript
Debug.checkSounds()
```

### Test Calculator:
```javascript
Debug.testApp()
```

### Check All Resources:
```javascript
// ดูว่าไฟล์ไหนโหลดบ้าง
performance.getEntriesByType('resource')
    .filter(r => r.name.includes('assets/'))
    .forEach(r => {
        console.log(r.name.split('/').pop(), r.duration.toFixed(2) + 'ms');
    });
```

---

## 📞 ยังไม่ได้?

ส่งข้อมูลนี้มา:

1. **Console Errors** (screenshot)
   - เปิด F12 > Console
   - ถ่ายรูป error ทั้งหมด

2. **Network Tab** (screenshot)
   - เปิด F12 > Network
   - กรอง: JS, CSS, Media
   - ถ่ายรูปไฟล์ที่ red/failed

3. **Hosting Info:**
   - ใช้ hosting อะไร
   - Domain/URL
   - Browser ที่ทดสอบ

4. **Debug Output:**
   ```javascript
   // พิมพ์ใน Console
   Debug.checkSounds()
   ```
   ส่งผลลัพธ์มา

---

## 🎯 การทำงานของ SoundFX

### โหลดเสียง:
```
1. หน้าเว็บโหลด
2. SoundFX.init() ทำงาน
3. โหลดทุกไฟล์เสียง
4. แสดง log: [SoundFX] Loaded: ./assets/sounds/toggle.mp3
```

### เล่นเสียง:
```
1. User คลิกปุ่ม
2. SoundFX.play('toggle')
3. Clone sound object
4. Play cloned sound
5. แสดง log ถ้ามี error
```

### User Interaction Required:
```
⚠️ Browser ต้องการ user interaction ก่อนเล่นเสียง
✅ แก้: User ต้องคลิกที่ใดก็ได้บนหน้าเว็บก่อน
```

---

**Created by:** Kaneji Nightfall  
**Version:** 0.0.3  
**Last Updated:** 2026-04-02

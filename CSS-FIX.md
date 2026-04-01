# 🔧 Shark Police - CSS Troubleshooting Guide

## ปัญหา: CSS ไม่ทำงานบน Hosting

### ✅ สาเหตุและวิธีแก้ไข

---

## 1. **CSS Path ไม่ถูกต้อง**

### ❌ ปัญหา:
```html
<link rel="stylesheet" href="assets/css/style.css">
```

### ✅ แก้ไข:
```html
<!-- ใช้หลายรูปแบบเพื่อรองรับทุก hosting -->
<link rel="stylesheet" href="./assets/css/style.css?v=0.0.3">
<link rel="stylesheet" href="assets/css/style.css?v=0.0.3">
```

**คำอธิบาย:**
- `./` นำหน้าช่วยให้ path ชัดเจนขึ้น
- `?v=0.0.3` เป็น cache buster บังคับให้ browser โหลด CSS ใหม่

---

## 2. **TailwindCSS CDN ทับ Custom CSS**

### ❌ ปัญหา:
TailwindCSS CDN มี CSS reset ที่ทับ CSS custom

### ✅ แก้ไข:
1. **โหลด Custom CSS AFTER TailwindCSS**
```html
<!-- TailwindCSS -->
<script src="https://cdn.tailwindcss.com"></script>

<!-- Custom CSS (โหลดทีหลังเพื่อ override) -->
<link rel="stylesheet" href="./assets/css/style.css?v=0.0.3">
```

2. **ใช้ `!important` ใน CSS**
```css
body {
    background: var(--shark-darker) !important;
    color: #e2e8f0 !important;
    font-family: 'Sarabun', sans-serif !important;
}
```

3. **ใช้ CSS Layers (ใหม่)**
```css
@layer reset {
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
}
```

---

## 3. **Hosting ไม่รองรับ MIME Type**

### ❌ ปัญหา:
Hosting บางที่ block CSS files

### ✅ แก้ไข:
เพิ่ม `.htaccess` (สำหรับ Apache hosting):

```apache
# Force CSS MIME type
<IfModule mod_mime.c>
    AddType text/css .css
</IfModule>

# Enable CORS for CSS
<IfModule mod_headers.c>
    <FilesMatch "\.css$">
        Header set Access-Control-Allow-Origin "*"
    </FilesMatch>
</IfModule>

# Cache CSS files
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 month"
</IfModule>
```

---

## 4. **CSS File ไม่ได้อัปโหลด**

### ✅ ตรวจสอบ:
```bash
# ตรวจสอบว่าไฟล์มีอยู่จริง
✅ /index.html
✅ /assets/css/style.css
✅ /assets/js/app.js
```

### ✅ วิธีแก้:
1. อัปโหลดไฟล์ `style.css` ใหม่ทั้งหมด
2. ตรวจสอบ file permissions (ควรเป็น 644)
3. ตรวจสอบ file size (ไม่ควรเป็น 0 bytes)

---

## 5. **Browser Cache เก่า**

### ✅ วิธีแก้:
1. **Hard Refresh:**
   - Windows: `Ctrl + Shift + R` หรือ `Ctrl + F5`
   - Mac: `Cmd + Shift + R`

2. **Clear Cache:**
   - Chrome: `Settings > Privacy > Clear browsing data`
   - Firefox: `Options > Privacy > Clear Data`

3. **Incognito Mode:**
   - ทดสอบในโหมดไม่ระบุตัวตน

---

## 6. **CDN ขัดแย้ง**

### ✅ แก้ไข:
เพิ่ม inline CSS สำคัญๆ ใน `<head>`:

```html
<style>
    /* Critical CSS - Load immediately */
    body {
        background: #020617 !important;
        color: #e2e8f0 !important;
    }
    
    .header {
        background: rgba(15, 23, 42, 0.95) !important;
    }
    
    /* Add more critical styles here */
</style>
```

---

## 🔍 การตรวจสอบปัญหา

### 1. **เปิด Developer Tools (F12)**

#### Console Tab:
```
❌ Failed to load resource: net::ERR_FILE_NOT_FOUND
✅ แก้: ตรวจสอบ path ของ CSS
```

#### Network Tab:
```
1. กรอง: CSS
2. ตรวจสอบ status code (ควรเป็น 200)
3. ตรวจสอบ size (ไม่ควรเป็น 0)
4. ตรวจสอบ MIME type (ควรเป็น text/css)
```

#### Elements Tab:
```
1. คลิกขวา > Inspect
2. ดู Computed styles
3. ดูว่า CSS ถูก override หรือไม่
```

---

## 🚀 วิธีแก้ด่วน (Emergency Fix)

### ใช้ Inline Styles:
```html
<body style="background: #020617; color: #e2e8f0; font-family: 'Sarabun', sans-serif;">
```

### ใช้ Critical CSS:
```html
<head>
    <style>
        /* ใส่ CSS สำคัญทั้งหมดที่นี่ */
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #020617; color: #e2e8f0; }
        /* ... เพิ่มทั้งหมด ... */
    </style>
</head>
```

---

## 📋 Checklist ก่อน Deploy

- [ ] ไฟล์ `style.css` มีอยู่จริง
- [ ] File permissions ถูกต้อง (644)
- [ ] CSS path ถูกต้อง
- [ ] Cache buster (`?v=0.0.3`) เพิ่มแล้ว
- [ ] Custom CSS โหลดหลัง TailwindCSS
- [ ] ไม่มี syntax error ใน CSS
- [ ] ทดสอบใน browser หลายตัว
- [ ] ทดสอบใน incognito mode
- [ ] ตรวจสอบ console errors

---

## 🎯 Hosting-Specific Solutions

### **000webhost:**
```apache
# เพิ่มใน .htaccess
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.html [QSA,L]
```

### **InfinityFree:**
- ใช้ absolute path: `/htdocs/assets/css/style.css`
- ปิด cache ใน control panel

### **GitHub Pages:**
```html
<!-- ใช้ absolute path จาก root -->
<link rel="stylesheet" href="/shark-police/assets/css/style.css">
```

### **Netlify/Vercel:**
```
# เพิ่ม netlify.toml หรือ vercel.json
{
  "headers": [{
    "source": "/assets/css/(.*)",
    "headers": [{
      "key": "Cache-Control",
      "value": "public, max-age=3600"
    }]
  }]
}
```

### **Hostinger:**
- ใช้ File Manager > เลือกไฟล์ CSS > Edit
- ตรวจสอบ encoding (UTF-8)
- Save เป็น binary mode

---

## 🛠️ Debug Commands

### ตรวจสอบ CSS ใน Console:
```javascript
// ตรวจสอบว่า CSS โหลดหรือไม่
console.log(document.styleSheets);

// ตรวจสอบ CSS rules
document.styleSheets[0].cssRules;

// ตรวจสอบ computed styles
getComputedStyle(document.body);

// ตรวจสอบ background color
getComputedStyle(document.body).backgroundColor;
```

### ตรวจสอบ Network:
```javascript
// ตรวจสอบว่าไฟล์ CSS โหลดสำเร็จหรือไม่
fetch('assets/css/style.css')
    .then(response => console.log('CSS loaded:', response.status))
    .catch(error => console.error('CSS failed:', error));
```

---

## 📞 ยังแก้ปัญหาไม่ได้?

### ส่งข้อมูลนี้มา:
1. **Hosting provider** ที่ใช้
2. **Screenshot** ของ Console errors
3. **Screenshot** ของ Network tab
4. **URL** ของเว็บไซต์
5. **Browser** ที่ใช้ทดสอบ

---

**Created by:** Kaneji Nightfall  
**Version:** 0.0.3  
**Last Updated:** 2026-04-02

# 🦈 Shark Police v.0.0.1

ระบบคำนวณค่าปรับตำรวจ - Police Fine Calculation System for Roleplay Community

![Version](https://img.shields.io/badge/version-0.0.1-blue.svg)
![License](https://img.shields.io/badge/license-All%20Rights%20Reserved-red.svg)

## 📋 เกี่ยวกับโปรเจค

เว็บไซต์ระบบคำนวณค่าปรับตำรวจ สำหรับชุมชน Roleplay (GTA V RP) พัฒนาด้วย HTML, TailwindCSS และ Alpine.js

### ✨ ฟีเจอร์หลัก

- **🧮 ระบบคำนวณค่าปรับ** - เลือกข้อหา คำนวณค่าปรับและจำอัตโนมัติ
- **📋 กฎระเบียบ** - ระเบียบการปฏิบัติหน้าที่สำหรับเจ้าหน้าที่
- **📢 ข้อความประกาศ** - เทมเพลตประกาศพร้อมใช้งาน
- **👕 เลขชุดเครื่องแบบ** - รหัสชุดเครื่องแบบตำรวจ
- **📖 แนวทางปฏิบัติ** - ขั้นตอนการดำเนินงานต่างๆ

## 🚀 การติดตั้งบน GitHub Pages

### วิธีที่ 1: ใช้ GitHub Pages (แนะนำ)

1. **Fork หรือ Upload repository นี้ไปยัง GitHub ของคุณ**

2. **ไปที่ Settings ของ repository**
   - คลิกแท็บ **Settings**
   - เลือกเมนู **Pages** (ด้านซ้าย)

3. **ตั้งค่า Source**
   - Branch: เลือก `main` หรือ `master`
   - Folder: เลือก `/ (root)`
   - คลิก **Save**

4. **รอ 1-2 นาที** เว็บไซต์จะพร้อมใช้งานที่:
   ```
   https://YOUR_USERNAME.github.io/shark-police/
   ```

### วิธีที่ 2: ใช้ GitHub Actions (อัตโนมัติ)

สร้างไฟล์ `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: '.'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## 📁 โครงสร้างไฟล์

```
shark-police/
├── index.html              # หน้าหลัก + ระบบคำนวณ
├── announcements.html      # ข้อความประกาศ
├── guides.html            # แนวทางปฏิบัติ
├── uniforms.html          # เลขชุดเครื่องแบบ
├── assets/
│   ├── css/
│   │   └── style.css      # Custom styles
│   └── js/
│       ├── app-simple.js   # ระบบคำนวณ
│       ├── visual-effects.js  # Effects
│       └── anti-copy.js    # ป้องกันคัดลอก
├── uploads/               # ไฟล์อัพโหลด
├── .gitignore            # Git ignore rules
└── README.md             # ไฟล์นี้
```

## 🛠️ เทคโนโลยีที่ใช้

| เทคโนโลยี | เวอร์ชัน | จุดประสงค์ |
|-----------|---------|-----------|
| **TailwindCSS** | CDN (v3.x) | Utility CSS Framework |
| **Alpine.js** | v3.13.3 | Reactive JavaScript |
| **SweetAlert2** | v11.10.1 | Alert Dialogs |
| **Font Awesome** | v6.5.1 | Icons |
| **Google Fonts** | - | Sarabun (Thai font) |

## 🎨 การปรับแต่ง

### เปลี่ยนสีธีม

แก้ไขที่ `assets/css/style.css`:

```css
:root {
    --shark-primary: #0ea5e9;      /* สีหลัก */
    --shark-secondary: #6366f1;    /* สีรอง */
    --shark-accent: #f59e0b;       /* สีเน้น */
    --shark-danger: #ef4444;       /* สีเตือน */
    --shark-success: #10b981;      /* สีสำเร็จ */
}
```

### เพิ่มข้อหาใหม่

แก้ไข `assets/js/app-simple.js` ในส่วน `finesData`:

```javascript
finesData: {
    general: [
        { name: 'ข้อหาใหม่', fine: 5000, jail: 10, type: 'normal' },
        // ...
    ]
}
```

## ⚠️ หมายเหตุสำคัญ

### GitHub Pages Limitations

1. **ไม่มี .htaccess** - GitHub Pages ไม่รองรับ Apache `.htaccess`
   - ไฟล์ `uploads/.htaccess` ไม่มีผลบน GitHub Pages
   - ใช้ JavaScript ตรวจสอบไฟล์แทนหากต้องการ

2. **Static Only** - รองรับเฉพาะไฟล์ Static (HTML, CSS, JS)
   - ไม่มี PHP, Node.js, หรือ Backend
   - ไม่สามารถเขียนไฟล์ได้

3. **Custom Domain** - หากต้องการใช้โดเมนเอง:
   - เพิ่มไฟล์ `CNAME` ที่มีชื่อโดเมน
   - ตั้งค่า DNS ที่ผู้ให้บริการโดเมน

### การป้องกันไฟล์

เนื่องจาก `.htaccess` ใช้ไม่ได้บน GitHub Pages:

- **ตัวเลือก 1:** ใช้ JavaScript ตรวจสอบไฟล์
- **ตัวเลือก 2:** ใช้ Cloudflare Rules
- **ตัวเลือก 3:** ย้ายไฟล์สำคัญไปไว้ Private repo

## 🔧 การพัฒนา

### รันบน Local

```bash
# ใช้ Live Server (VS Code Extension)
# หรือ
python -m http.server 8000

# เปิดเบราว์เซอร์ที่
http://localhost:8000
```

### Build (ถ้ามี)

โปรเจคนี้ใช้ CDN จึงไม่ต้อง Build:
- แก้ไขไฟล์แล้ว Refresh เบราว์เซอร์ได้เลย

## 📝 การอัปเดต

### อัปเดตเวอร์ชัน

1. แก้ไขเวอร์ชันที่ `index.html`:
   ```html
   <title>Shark Police v.0.0.2 - ระบบคำนวณค่าปรับ</title>
   ```

2. แก้ไข badge ที่ `README.md`:
   ```markdown
   ![Version](https://img.shields.io/badge/version-0.0.2-blue.svg)
   ```

3. Commit และ Push:
   ```bash
   git add .
   git commit -m "Update to v0.0.2"
   git push
   ```

## 🐛 การแก้ปัญหา

### เว็บไม่แสดงบน GitHub Pages

1. ตรวจสอบว่าตั้งชื่อ Branch เป็น `main` หรือ `master`
2. ตรวจสอบ Settings > Pages ว่าเลือก Branch ถูกต้อง
3. รอ 1-2 นาทีหลัง Push
4. ลอง Clear Cache (Ctrl+F5)

### CSS/JS ไม่โหลด

1. ตรวจสอบ Path ใน HTML ต้องเป็น Relative:
   ```html
   <!-- ✅ ถูกต้อง -->
   <link rel="stylesheet" href="assets/css/style.css">
   
   <!-- ❌ ผิด -->
   <link rel="stylesheet" href="/assets/css/style.css">
   ```

2. ตรวจสอบ Case Sensitivity (Linux แตกต่างจาก Windows)

### Logo ไม่แสดง

Logo ใช้ Discord CDN ซึ่งอาจหมดอายุ:
- แนะนำให้ Upload logo ไปที่ `assets/images/`
- แก้ไข path ใน HTML ทุกหน้า

## 📞 การติดต่อ

**Creator:** Kaneji Nightfall

## 📄 ลิขสิทธิ์

© Shark Police - All Rights Reserved

---

<div align="center">

**Made with ❤️ for Shark Community**

</div>

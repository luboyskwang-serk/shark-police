# 🚀 คู่มือการติดตั้งบน GitHub Pages

## วิธีทำทีละขั้นตอน

### ขั้นตอนที่ 1: เตรียมไฟล์

1. ตรวจสอบว่ามีไฟล์เหล่านี้ในโปรเจค:
   - ✅ `.gitignore`
   - ✅ `README.md`
   - ✅ `404.html`
   - ✅ `.github/workflows/deploy.yml`

### ขั้นตอนที่ 2: Upload ไป GitHub

**วิธีที่ 1: ใช้ Git Command Line**

```bash
# เปิด Command Prompt ที่โฟลเดอร์โปรเจค
cd C:\xampp\htdocs\shark-police

# Initialize Git (ถ้ายังไม่มี)
git init

# เพิ่มไฟล์ทั้งหมด
git add .

# Commit
git commit -m "Initial commit - Shark Police v.0.0.1"

# เปลี่ยนชื่อ branch เป็น main
git branch -M main

# เพิ่ม Remote (แทนที่ YOUR_USERNAME ด้วย username GitHub ของคุณ)
git remote add origin https://github.com/YOUR_USERNAME/shark-police.git

# Push ขึ้น GitHub
git push -u origin main
```

**วิธีที่ 2: ใช้ GitHub Desktop**

1. เปิด GitHub Desktop
2. File > Add Local Repository > เลือกโฟลเดอร์ `shark-police`
3. พิมพ์ Commit message: "Initial commit"
4. คลิก "Commit to main"
5. คลิก "Publish repository"
6. ตั้งชื่อ repository: `shark-police`
7. คลิก "Publish repository"

**วิธีที่ 3: ใช้ Web Upload (ไฟล์น้อย)**

1. ไปที่ https://github.com/new
2. ตั้งชื่อ repository: `shark-police`
3. คลิก "Create repository"
4. คลิก "uploading an existing file"
5. ลากไฟล์ทั้งหมดใส่
6. คลิก "Commit changes"

### ขั้นตอนที่ 3: เปิดใช้งาน GitHub Pages

1. ไปที่ repository ของคุณบน GitHub
2. คลิกแท็บ **Settings** (รูปเฟือง)
3. เมนูด้านซ้าย คลิก **Pages**
4. ส่วน "Build and deployment":
   - **Source**: Deploy from a branch
   - **Branch**: เลือก `main` และโฟลเดอร์ `/ (root)`
5. คลิก **Save**

### ขั้นตอนที่ 4: รอ Deployment

- รอ 1-3 นาที
- GitHub จะ Deploy เว็บให้อัตโนมัติ
- เมื่อเสร็จแล้วจะเห็นลิงก์แบบนี้:
  ```
  https://YOUR_USERNAME.github.io/shark-police/
  ```

### ขั้นตอนที่ 5: ตรวจสอบผลลัพธ์

1. เปิดลิงก์ GitHub Pages ในเบราว์เซอร์
2. ทดสอบทุกหน้า:
   - ✅ หน้าหลัก (index.html)
   - ✅ ข้อความประกาศ (announcements.html)
   - ✅ เลขชุด (uniforms.html)
   - ✅ แนวทางปฏิบัติ (guides.html)
3. ตรวจสอบว่า CSS และ JS โหลดถูกต้อง

---

## 🔧 การอัปเดตเว็บ

### แก้ไขไฟล์แล้ว Push อัปเดต

```bash
# แก้ไขไฟล์ที่ต้องการ
# แล้วรันคำสั่ง:

git add .
git commit -m "อัปเดต: [อธิบายสิ่งที่แก้]"
git push
```

GitHub จะ Deploy ใหม่อัตโนมัติภายใน 1-2 นาที

---

## ⚠️ ปัญหาที่พบบ่อย

### 1. เว็บไม่แสดง (404)

**สาเหตุ:** ยังไม่ได้เปิด GitHub Pages

**วิธีแก้:**
- ไปที่ Settings > Pages
- เปิดใช้งาน GitHub Pages
- รอ 1-3 นาที

### 2. CSS/JS ไม่โหลด

**สาเหตุ:** Path ไม่ถูกต้อง หรือ Cache

**วิธีแก้:**
- ตรวจสอบว่า path ใน HTML เป็น relative path
- กด Ctrl+F5 เพื่อ Hard Refresh

### 3. Logo ไม่แสดง

**สาเหตุ:** Discord CDN link หมดอายุ

**วิธีแก้:**
1. Download logo มาเก็บใน `assets/images/`
2. แก้ไข path ใน HTML ทุกหน้า:
   ```html
   <img src="assets/images/logo.png" alt="Shark Police Logo">
   ```

### 4. .htaccess ไม่ทำงาน

**สาเหตุ:** GitHub Pages ไม่รองรับ .htaccess

**วิธีแก้:**
- ยอมรับข้อจำกัดนี้ (ไม่มีผลกับเว็บ static)
- หรือใช้ Cloudflare Rules แทนหากต้องการความปลอดภัย

---

## 🌐 ใช้ Custom Domain (ถ้าต้องการ)

1. ซื้อโดเมน (เช่น shark-police.com)
2. ที่ GitHub Pages Settings:
   - ใส่ชื่อโดเมนใน "Custom domain"
   - คลิก Save
3. ตั้งค่า DNS ที่ผู้ให้บริการโดเมน:
   ```
   Type: CNAME
   Name: www
   Value: YOUR_USERNAME.github.io
   ```
4. สร้างไฟล์ `CNAME` ใน root folder:
   ```
   shark-police.com
   ```
5. Commit และ Push

---

## 📊 ดูสถานะ Deployment

1. ไปที่แท็บ **Actions**
2. ดู workflow "Deploy to GitHub Pages"
3. คลิกดูรายละเอียดหากมี Error

---

## 🎯 เคล็ดลับ

- ✅ **ตั้งชื่อ repository ให้ตรงกับ** `shark-police` เพื่อให้ URL สวยงาม
- ✅ **ใช้ Branch `main`** เป็น default branch
- ✅ **ตรวจสอบ Actions tab** หลังทุก Push
- ✅ **Clear Cache** หากเว็บไม่อัปเดต (Ctrl+F5)

---

## 📞 ต้องการความช่วยเหลือ?

- อ่าน [GitHub Pages Documentation](https://pages.github.com/)
- ดู [GitHub Actions Docs](https://docs.github.com/en/actions)

---

**สร้างโดย:** Kaneji Nightfall  
**อัปเดตล่าสุด:** มีนาคม 2026

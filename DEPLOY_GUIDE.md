# 🚀 Hướng dẫn Deploy lên Vercel

## Bước 1: Chuẩn bị Git Repository

### 1.1. Tạo repository trên GitHub
1. Vào https://github.com/new
2. Đặt tên: `cotuong-online`
3. Chọn Public
4. **KHÔNG** tích "Add a README file"
5. Click "Create repository"

### 1.2. Push code lên GitHub
```bash
# Trong terminal tại thư mục dự án:
git remote add origin https://github.com/YOUR_USERNAME/cotuong-online.git
git branch -M main
git push -u origin main
```

**Thay `YOUR_USERNAME` bằng username GitHub của bạn**

---

## Bước 2: Deploy lên Vercel

### Cách 1: Deploy qua Vercel Website (Dễ nhất)

1. **Đăng nhập Vercel:**
   - Vào https://vercel.com
   - Click "Sign Up" hoặc "Log In"
   - Chọn "Continue with GitHub"

2. **Import Project:**
   - Click "New Project"
   - Chọn repository `cotuong-online`
   - Click "Import"

3. **Configure Build:**
   - **Framework Preset:** Other
   - **Root Directory:** `./` (mặc định)
   - **Build Command:** `./mvnw clean package -DskipTests`
   - **Output Directory:** `target`
   - **Install Command:** để trống

4. **Environment Variables:**
   ```
   SPRING_PROFILES_ACTIVE=prod
   PORT=8080
   ```

5. **Deploy:**
   - Click "Deploy"
   - Đợi 3-5 phút
   - ✅ Xong!

### Cách 2: Deploy qua Vercel CLI

```bash
# Cài đặt Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

---

## Bước 3: Kiểm tra sau Deploy

### ✅ Dấu hiệu thành công:
- Build time: 3-5 phút
- Status: "Ready"
- URL: `https://cotuong-online-xxx.vercel.app`

### ✅ Test ứng dụng:
1. Mở URL Vercel
2. Tạo phòng → Nhận mã 6 số
3. Mở tab mới → Join phòng
4. Test chơi cờ và chat

### ❌ Nếu build fail:

**Java version error:**
```bash
# Trong vercel.json thêm:
"functions": {
  "src/main/java/com/cotuong/CoTuongOnlineApplication.java": {
    "runtime": "java17"
  }
}
```

**Memory issues:**
```bash
# Thêm vào application-prod.properties:
server.tomcat.max-threads=50
spring.jpa.hibernate.ddl-auto=create-drop
```

**WebSocket issues:**
- Vercel hỗ trợ WebSocket với domain custom
- Có thể cần upgrade plan

---

## Bước 4: Custom Domain (Tùy chọn)

1. Vào Vercel Dashboard
2. Chọn project `cotuong-online`
3. Tab "Domains"
4. Add domain: `cotuong.yourdomain.com`
5. Cấu hình DNS theo hướng dẫn

---

## 🐛 Troubleshooting

### Build timeout:
```bash
# Trong vercel.json:
"builds": [
  {
    "src": "pom.xml",
    "use": "@vercel/java",
    "config": {
      "maxLambdaSize": "50mb"
    }
  }
]
```

### Database issues:
```bash
# Vercel không hỗ trợ H2 persistent
# Cần dùng external DB:
# - Railway PostgreSQL
# - PlanetScale MySQL
# - Supabase PostgreSQL
```

### WebSocket không hoạt động:
```bash
# Alternative: Sử dụng polling
# Hoặc upgrade Vercel plan
# Hoặc deploy lên Railway/Render
```

---

## 📋 Checklist Deploy

- [ ] Code đã push lên GitHub
- [ ] Repository là public
- [ ] Vercel đã connect GitHub
- [ ] Build thành công
- [ ] URL accessible
- [ ] Tạo phòng hoạt động
- [ ] Join phòng hoạt động  
- [ ] WebSocket connect
- [ ] Game logic hoạt động
- [ ] Chat hoạt động

---

## 🎯 Alternative Platforms

Nếu Vercel gặp vấn đề với Java:

### Railway (Recommended for Java)
```bash
# Tạo railway.json:
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "java -jar target/cotuong-online-1.0.0.jar"
  }
}
```

### Render
```bash
# render.yaml:
services:
  - type: web
    name: cotuong-online
    env: java
    buildCommand: "./mvnw clean package -DskipTests"
    startCommand: "java -jar target/cotuong-online-1.0.0.jar"
```

### Heroku
```bash
# Procfile:
web: java -jar target/cotuong-online-1.0.0.jar --server.port=$PORT
```

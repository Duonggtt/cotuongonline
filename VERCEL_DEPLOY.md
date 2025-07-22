# 🚀 Deploy Guide - Cờ Tướng Online

## 📋 Overview
Dự án Cờ Tướng Online có 2 phiên bản:
1. **Frontend Demo** (Static) - Deploy trên Vercel
2. **Full Application** (Spring Boot) - Deploy trên Railway/Render

## 🌐 Option 1: Deploy Frontend Demo trên Vercel

### Bước 1: Push code lên GitHub
```bash
git add .
git commit -m "Add static frontend for Vercel deployment"
git push origin main
```

### Bước 2: Deploy trên Vercel
1. Truy cập [vercel.com](https://vercel.com)
2. Login và click "New Project"
3. Import repository `cotuongonline`
4. Cấu hình:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (để trống)
   - **Build Command**: `echo "Static deployment"`
   - **Output Directory**: `public`
   - **Install Command**: `echo "No install needed"`

### Bước 3: Deploy
- Click "Deploy"
- Vercel sẽ tự động deploy từ thư mục `public/`

### 🎯 Kết quả
- ✅ Giao diện đẹp mắt, responsive
- ✅ Demo tạo/tham gia phòng
- ❌ Không có tính năng multiplayer thực
- ❌ Không có WebSocket realtime

---

## 🚂 Option 2: Deploy Full Application trên Railway

### Bước 1: Tạo tài khoản Railway
1. Truy cập [railway.app](https://railway.app)
2. Đăng nhập bằng GitHub

### Bước 2: Deploy
1. Click "New Project"
2. Chọn "Deploy from GitHub repo"
3. Chọn repository `cotuongonline`
4. Railway tự động detect Spring Boot và deploy

### Bước 3: Cấu hình Environment
- Railway sẽ tự động set port
- Không cần thay đổi gì thêm

### 🎯 Kết quả
- ✅ Đầy đủ tính năng multiplayer
- ✅ WebSocket realtime
- ✅ Chat trong game
- ✅ Luật cờ tướng chuẩn

---

## 🌟 Option 3: Deploy trên Render

### Bước 1: Tạo tài khoản Render
1. Truy cập [render.com](https://render.com)
2. Đăng nhập bằng GitHub

### Bước 2: Deploy
1. Click "New +"
2. Chọn "Web Service"
3. Connect repository `cotuongonline`
4. Cấu hình:
   - **Environment**: Java
   - **Build Command**: `./mvnw clean package -DskipTests`
   - **Start Command**: `java -jar target/*.jar`

### 🎯 Kết quả
- ✅ Đầy đủ tính năng như Railway
- ✅ Free tier có sẵn

---

## 📊 So sánh các phương án

| Platform | Loại | Tính năng | Chi phí | Độ khó |
|----------|------|-----------|---------|--------|
| **Vercel** | Static | Demo frontend | Free | ⭐ |
| **Railway** | Full App | Hoàn chính | $5/tháng | ⭐⭐ |
| **Render** | Full App | Hoàn chính | Free/Paid | ⭐⭐ |

## 🎯 Khuyến nghị

### Cho demo nhanh:
```bash
# Deploy static trên Vercel
git add .
git commit -m "Static demo ready"
git push origin main
# Sau đó import vào Vercel
```

### Cho ứng dụng hoàn chỉnh:
```bash
# Deploy full app trên Railway
git add .
git commit -m "Full application ready"
git push origin main
# Sau đó import vào Railway
```

## 🔧 Troubleshooting

### Lỗi Vercel: "functions property conflict"
- ✅ Đã fix trong commit mới nhất
- Vercel.json đã được cập nhật cho static deployment

### Lỗi Railway: "Build failed"
- Kiểm tra Java version trong `system.properties`
- Đảm bảo `mvnw` có quyền execute

### Lỗi Render: "Port binding"
- Spring Boot tự động bind port từ `$PORT` environment variable
- Không cần config thêm

## 🎮 Test sau khi deploy

### Static Demo (Vercel):
- Truy cập URL được cung cấp
- Test tạo phòng (sẽ hiển thị demo message)
- Test tham gia phòng (validation input)

### Full App (Railway/Render):
- Truy cập URL được cung cấp
- Tạo phòng thật → Copy mã phòng
- Mở tab khác → Tham gia phòng
- Test di chuyển quân cờ
- Test chat realtime

---

*💡 Tip: Để trải nghiệm đầy đủ, khuyến nghị deploy phiên bản Full Application trên Railway hoặc Render.*

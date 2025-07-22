# 🚀 Hướng dẫn chạy Cờ Tướng Online Local

## Bước 1: Mở Command Prompt hoặc PowerShell
Nhấn `Win + R`, gõ `cmd` hoặc `powershell` và nhấn Enter

## Bước 2: Di chuyển đến thư mục project
```bash
cd /d "d:\github\cotuongonline"
```

## Bước 3: Thiết lập JAVA_HOME (nếu cần)
```bash
set JAVA_HOME=C:\Program Files\Java\jdk-17
```

Hoặc trong PowerShell:
```powershell
$env:JAVA_HOME="C:\Program Files\Java\jdk-17"
```

## Bước 4: Chạy ứng dụng
```bash
mvnw.cmd spring-boot:run
```

## Bước 5: Mở trình duyệt
Sau khi thấy message "Started CoTuongOnlineApplication", mở trình duyệt và vào:
```
http://localhost:8080
```

---

## 🎮 Cách test game:

### Test 1: Tạo phòng mới
1. Click "Tạo phòng"
2. Sẽ được mã phòng 6 số (ví dụ: 123456)
3. Chia sẻ mã này để bạn bè join

### Test 2: Join phòng (mở tab/cửa sổ mới)
1. Mở tab mới với `http://localhost:8080`
2. Nhập mã phòng
3. Nhập tên (hoặc để trống cho tên random)
4. Click "Tham gia"

### Test 3: Chơi cờ
1. Người chơi đầu tiên (Đỏ) đi trước
2. Click vào quân cờ → Thấy các ô xanh (nước đi hợp lệ)
3. Click vào ô đích để di chuyển
4. Lượt chuyển sang người chơi thứ 2 (Đen)

### Test 4: Chat
1. Gõ tin nhắn ở chat box
2. Click emoji 😊 để chọn emoji
3. Tin nhắn sẽ hiện real-time cho cả 2 người

---

## 🐛 Nếu gặp lỗi:

### "JAVA_HOME is set to an invalid directory"
```bash
# Kiểm tra Java đã cài chưa:
java -version

# Tìm đường dẫn Java:
where java

# Thiết lập lại JAVA_HOME với đường dẫn đúng
```

### "Port 8080 already in use"
```bash
# Đổi port khác (ví dụ 8081):
mvnw.cmd spring-boot:run -Dserver.port=8081
```

### "mvnw.cmd not found"
```bash
# Chạy trực tiếp (nếu đã cài Maven):
mvn spring-boot:run
```

---

## ✅ Dấu hiệu chạy thành công:

Bạn sẽ thấy log tương tự:
```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::               (v3.2.1)

...

Started CoTuongOnlineApplication in 3.456 seconds
```

Khi thấy "Started CoTuongOnlineApplication" → ✅ Thành công!

Mở browser: `http://localhost:8080` 🎮

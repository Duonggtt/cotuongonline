# Cờ Tướng Online

🏛️ **Game Cờ Tướng Việt Nam Online** - Chơi cờ tướng trực tuyến với bạn bè một cách dễ dàng và thú vị!

## ✨ Tính năng chính

### 🎮 Luật cờ tướng Việt Nam chuẩn
- ✅ Hiển thị tất cả nước đi hợp lệ khi chọn quân cờ
- ✅ Xử lý logic đầy đủ: chiếu tướng, chiếu bí, ăn quân
- ✅ Tuân thủ nghiêm ngặt luật chơi cờ tướng truyền thống

### 🎨 Giao diện hiện đại, đẹp mắt
- ✅ Bàn cờ thiết kế chuẩn với hiệu ứng visual thu hút
- ✅ Quân cờ sử dụng ký tự Hán truyền thống
- ✅ Hiệu ứng âm thanh khi di chuyển và ăn quân
- ✅ Responsive design, tương thích mọi thiết bị

### 🌐 Chơi online 1v1 theo mã phòng
- ✅ Tạo phòng và nhận mã 6 số để chia sẻ
- ✅ Tham gia phòng bằng cách nhập mã
- ✅ WebSocket real-time cho trải nghiệm mượt mà

### 💬 Tính năng giao tiếp
- ✅ Chat real-time với emoji
- ✅ Voice chat hỗ trợ micro (WebRTC)
- ✅ Lịch sử nước đi đầy đủ
- ✅ Chức năng đầu hàng, kết thúc game

### 👤 Quản lý người chơi
- ✅ Tự động tạo tên người chơi ngẫu nhiên
- ✅ Không cần đăng ký, chơi ngay lập tức
- ✅ Dễ dàng mở rộng hệ thống tài khoản sau này

## 🛠️ Công nghệ sử dụng

### Backend
- **Java 17** + **Spring Boot 3.2.1**
- **Spring WebSocket** cho real-time communication
- **Spring Data JPA** + **Hibernate** cho database
- **H2 Database** (có thể chuyển sang PostgreSQL)

### Frontend
- **Thymeleaf** template engine
- **HTML5** + **CSS3** + **Vanilla JavaScript**
- **SockJS** + **STOMP** cho WebSocket
- **Responsive CSS** với Flexbox và Grid

### Database
- **H2** embedded database (tự khởi tạo)
- **JPA/Hibernate** auto-create tables
- Không cần setup database thủ công

## 🚀 Hướng dẫn chạy dự án

### Yêu cầu hệ thống
- Java 17 hoặc cao hơn
- Maven 3.6 hoặc cao hơn
- Port 8080 trống

### Chạy local

#### Cách 1: Sử dụng script tự động (Windows)

1. **Clone project**
```bash
git clone https://github.com/your-username/cotuong-online.git
cd cotuong-online
```

2. **Chạy game ngay lập tức**
```bash
# Double-click file start.bat hoặc chạy:
start.bat
```

3. **Truy cập game**
Mở trình duyệt và vào: `http://localhost:8080`

#### Cách 2: Sử dụng Maven (nếu đã cài)

```bash
mvn spring-boot:run
```

#### Cách 3: Sử dụng Maven Wrapper

```bash
# Windows
mvnw.cmd spring-boot:run

# Linux/Mac
./mvnw spring-boot:run
```

### Build JAR file

#### Sử dụng script build
```bash
# Double-click build.bat hoặc chạy:
build.bat
```

#### Sử dụng Maven
```bash
mvn clean package
java -jar target/cotuong-online-1.0.0.jar
```

## 🌐 Deploy lên Vercel

### Tự động (Recommended)

1. **Tạo `vercel.json`**
```json
{
  "builds": [
    {
      "src": "pom.xml",
      "use": "@vercel/java"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/"
    }
  ]
}
```

2. **Deploy**
```bash
# Cài đặt Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Manual Deploy

1. Build JAR file: `mvn clean package`
2. Upload JAR lên Vercel với Java runtime
3. Set environment variables nếu cần

## 📁 Cấu trúc project

```
cotuong-online/
├── src/main/java/com/cotuong/
│   ├── CoTuongOnlineApplication.java     # Main class
│   ├── config/
│   │   └── WebSocketConfig.java          # WebSocket configuration
│   ├── controller/
│   │   ├── GameController.java           # REST endpoints
│   │   └── GameWebSocketController.java  # WebSocket handlers
│   ├── dto/
│   │   ├── GameMove.java                 # Move data transfer
│   │   ├── ChatMessage.java              # Chat message DTO
│   │   └── GameStateUpdate.java          # Game state DTO
│   ├── model/
│   │   ├── GameRoom.java                 # Game room entity
│   │   ├── Player.java                   # Player entity
│   │   ├── PlayerColor.java              # Color enum
│   │   └── GameStatus.java               # Status enum
│   ├── repository/
│   │   ├── GameRoomRepository.java       # Room repository
│   │   └── PlayerRepository.java         # Player repository
│   └── service/
│       ├── GameService.java              # Game logic service
│       └── ChessLogicService.java        # Chess rules engine
├── src/main/resources/
│   ├── templates/
│   │   ├── index.html                    # Trang chủ
│   │   └── game.html                     # Phòng chơi
│   ├── static/
│   │   ├── css/
│   │   │   ├── main.css                  # Global styles
│   │   │   └── game.css                  # Game-specific styles
│   │   ├── js/
│   │   │   ├── index.js                  # Trang chủ logic
│   │   │   ├── chess-pieces.js           # Quân cờ logic
│   │   │   ├── chess-board.js            # Bàn cờ logic
│   │   │   ├── game-websocket.js         # WebSocket communication
│   │   │   └── game.js                   # Game page logic
│   │   └── sounds/                       # Âm thanh hiệu ứng
│   └── application.properties            # Cấu hình app
├── pom.xml                               # Maven dependencies
├── README.md                             # Tài liệu này
└── vercel.json                          # Vercel config (optional)
```

## 🎮 Hướng dẫn chơi

### Tạo phòng mới
1. Vào trang chủ, click "Tạo phòng"
2. Chia sẻ mã phòng 6 số cho bạn bè
3. Đợi đối thủ tham gia để bắt đầu

### Tham gia phòng
1. Nhập mã phòng 6 số
2. Nhập tên (hoặc để trống cho tên ngẫu nhiên)
3. Click "Tham gia" để vào phòng

### Chơi cờ
1. **Chọn quân**: Click vào quân cờ của bạn
2. **Xem nước đi**: Các ô xanh là nước đi hợp lệ
3. **Di chuyển**: Click vào ô đích để di chuyển
4. **Ăn quân**: Ô đỏ cho biết có thể ăn quân địch

### Tính năng khác
- **Chat**: Gõ tin nhắn để trò chuyện
- **Emoji**: Click 😊 để chọn emoji
- **Voice**: Click 🎤 để bật/tắt micro
- **Đầu hàng**: Click "Đầu hàng" để kết thúc game

## 🔧 Cấu hình

### Database
Mặc định sử dụng H2 in-memory. Để chuyển sang PostgreSQL:

```properties
# application.properties
spring.datasource.url=jdbc:postgresql://localhost:5432/cotuong
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
```

### Port và cấu hình khác
```properties
server.port=8080
spring.h2.console.enabled=true
logging.level.com.cotuong=DEBUG
```

## 🐛 Troubleshooting

### Lỗi thường gặp

**Port 8080 đã được sử dụng**
```bash
# Thay đổi port
echo "server.port=8081" >> src/main/resources/application.properties
```

**WebSocket connection failed**
- Kiểm tra firewall và proxy
- Thử refresh trang
- Kiểm tra console browser để xem lỗi

**Game không cập nhật real-time**
- Kiểm tra kết nối mạng
- Refresh trang hoặc tạo phòng mới

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! 

1. Fork project
2. Tạo feature branch: `git checkout -b feature/AmazingFeature`
3. Commit changes: `git commit -m 'Add some AmazingFeature'`
4. Push to branch: `git push origin feature/AmazingFeature`
5. Tạo Pull Request

## 📋 TODO / Roadmap

- [ ] Hệ thống đăng nhập/đăng ký
- [ ] Ranking và điểm số
- [ ] Lưu lại game để xem lại
- [ ] Chế độ AI (chơi với máy)
- [ ] Tournament mode
- [ ] Mobile app (React Native)
- [ ] Spectator mode (người xem)
- [ ] Game statistics và analytics

## 📄 License

Dự án này được phân phối dưới MIT License. Xem file `LICENSE` để biết thêm chi tiết.

## 📞 Liên hệ

- **Author**: Cờ Tướng Online Team
- **Email**: contact@cotuong-online.com
- **Website**: https://cotuong-online.vercel.app

---

⭐ **Nếu project này hữu ích, hãy cho chúng tôi một star nhé!** ⭐

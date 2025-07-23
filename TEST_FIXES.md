# 🧪 Test Cases cho các Fix đã thực hiện

## 📝 Danh sách Fix:

### 1. ⏰ Fix Timer - Chỉ bắt đầu khi đủ 2 người chơi
**Vấn đề**: Timer bắt đầu ngay khi tạo game thay vì đợi đủ 2 người
**Fix**: 
- Thêm flag `playersReady` trong ChessBoard 
- Timer chỉ start khi `playersReady = true`
- WebSocket handler detect khi game status = 'IN_PROGRESS' và trigger start

**Test Steps**:
1. Tạo phòng mới
2. Kiểm tra timer không chạy khi chỉ có 1 người
3. Người thứ 2 join phòng
4. Kiểm tra timer bắt đầu chạy khi đủ 2 người

### 2. 🏳️ Fix Đầu hàng - Popup xác nhận + Popup kết quả
**Vấn đề**: Chỉ có confirm() đơn giản, không có popup kết quả
**Fix**:
- Thêm modal xác nhận đầu hàng (`surrenderModal`)
- Thêm modal kết quả game với 2 nút "Chơi lại" và "Ra màn hình chính"
- Cải thiện logic hiển thị thông báo thắng/thua

**Test Steps**:
1. Start game với 2 người chơi
2. Click nút "Đầu hàng"
3. Kiểm tra hiện popup xác nhận đầu hàng
4. Click "Đầu hàng" để xác nhận
5. Kiểm tra hiện popup kết quả "Bạn đã thua!" với 2 nút

## 🔧 Files đã sửa:

### Frontend Files:
- `src/main/resources/static/js/game.js`
- `src/main/resources/static/js/game-websocket.js` 
- `src/main/resources/templates/game.html`
- `public/js/chess-board.js`
- `public/js/game-ui.js`
- `public/game.html`

### Backend Files:
- Không cần sửa backend (logic surrender đã có sẵn)

## 🎯 Kết quả mong đợi:

### Timer Fix:
- ✅ Timer không chạy khi chỉ có 1 người trong phòng
- ✅ Timer bắt đầu chạy khi người thứ 2 join vào
- ✅ Thời gian được tính chính xác từ khi cả 2 người sẵn sàng

### Surrender Fix:
- ✅ Nhấn "Đầu hàng" → Hiện popup xác nhận
- ✅ Xác nhận đầu hàng → Hiện popup "Bạn đã thua!"
- ✅ Popup có 2 nút: "Chơi lại" và "Ra màn hình chính"
- ✅ Cả 2 nút đều redirect về trang chủ

## 🚀 Cách test:

1. **Build và chạy ứng dụng**:
   ```bash
   mvn clean compile
   mvn spring-boot:run
   ```

2. **Mở 2 tab browser**:
   - Tab 1: Tạo phòng
   - Tab 2: Join phòng bằng mã

3. **Test Timer**:
   - Kiểm tra timer ở tab 1 (chưa chạy)
   - Join phòng từ tab 2
   - Kiểm tra timer bắt đầu chạy ở cả 2 tab

4. **Test Surrender**:
   - Ở 1 trong 2 tab, click "Đầu hàng"
   - Kiểm tra popup xác nhận
   - Click "Đầu hàng" để confirm
   - Kiểm tra popup kết quả

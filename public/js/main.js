// Main JavaScript for Cờ Tướng Online Demo
document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const createRoomBtn = document.getElementById('createRoomBtn');
    const joinRoomBtn = document.getElementById('joinRoomBtn');
    const playDemoBtn = document.getElementById('playDemoBtn');
    const roomCodeInput = document.getElementById('roomCodeInput');
    const playerNameInput = document.getElementById('playerNameInput');
    const loadingModal = document.getElementById('loadingModal');
    const loadingMessage = document.getElementById('loadingMessage');

    // Create room functionality
    createRoomBtn.addEventListener('click', function() {
        showLoading('Đang tạo phòng...');
        
        // Simulate room creation
        setTimeout(() => {
            const roomCode = generateRoomCode();
            hideLoading();
            showMessage('Phòng đã được tạo!', `Mã phòng của bạn: <strong>${roomCode}</strong><br><br>Chia sẻ mã này với bạn bè để họ có thể tham gia!<br><br><em>Lưu ý: Đây là phiên bản demo. Để trải nghiệm đầy đủ tính năng multiplayer, vui lòng chạy ứng dụng Spring Boot.</em>`);
        }, 2000);
    });

    // Join room functionality
    joinRoomBtn.addEventListener('click', function() {
        const roomCode = roomCodeInput.value.trim();
        const playerName = playerNameInput.value.trim() || 'Người chơi';

        if (!roomCode) {
            showMessage('Lỗi', 'Vui lòng nhập mã phòng!');
            return;
        }

        if (roomCode.length !== 6 || !/^\d+$/.test(roomCode)) {
            showMessage('Lỗi', 'Mã phòng phải là 6 chữ số!');
            return;
        }

        showLoading(`Đang tham gia phòng ${roomCode}...`);
        
        // Simulate joining room
        setTimeout(() => {
            hideLoading();
            showMessage('Tham gia thành công!', `Chào mừng ${playerName} đến phòng ${roomCode}!<br><br><em>Lưu ý: Đây là phiên bản demo. Để trải nghiệm đầy đủ tính năng multiplayer, vui lòng chạy ứng dụng Spring Boot.</em>`);
            
            // Clear inputs
            roomCodeInput.value = '';
            playerNameInput.value = '';
        }, 2000);
    });

    // Play demo functionality
    playDemoBtn.addEventListener('click', function() {
        showLoading('Đang khởi tạo game demo...');
        
        setTimeout(() => {
            hideLoading();
            showMessage('Demo Game', `
                <div style="text-align: left;">
                    <h4>🎮 Hướng dẫn chơi demo:</h4>
                    <ul style="margin: 15px 0; padding-left: 20px;">
                        <li>Đây là phiên bản demo offline</li>
                        <li>Để chơi multiplayer, cần chạy Spring Boot server</li>
                        <li>Tính năng đầy đủ: chat realtime, đồng bộ trạng thái game</li>
                        <li>Hỗ trợ luật cờ tướng Việt Nam chuẩn</li>
                    </ul>
                    <h4>🚀 Để chạy ứng dụng đầy đủ:</h4>
                    <ul style="margin: 15px 0; padding-left: 20px;">
                        <li>Clone repository từ GitHub</li>
                        <li>Chạy <code>start.bat</code> hoặc <code>mvnw spring-boot:run</code></li>
                        <li>Truy cập <code>http://localhost:8080</code></li>
                    </ul>
                </div>
            `);
        }, 1500);
    });

    // Room code input formatting
    roomCodeInput.addEventListener('input', function() {
        // Only allow numbers
        this.value = this.value.replace(/[^0-9]/g, '');
    });

    // Generate random room code
    function generateRoomCode() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    // Show loading modal
    function showLoading(message) {
        loadingMessage.textContent = message;
        loadingModal.classList.add('show');
    }

    // Hide loading modal
    function hideLoading() {
        loadingModal.classList.remove('show');
    }

    // Show message modal
    function showMessage(title, message) {
        const modal = document.createElement('div');
        modal.className = 'modal show';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>${title}</h3>
                <div style="margin: 20px 0;">${message}</div>
                <button class="btn btn-primary" onclick="this.closest('.modal').remove()">Đóng</button>
            </div>
        `;
        document.body.appendChild(modal);

        // Close modal when clicking outside
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    // Add some animations
    function addAnimations() {
        const cards = document.querySelectorAll('.action-card, .feature-item');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        });

        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    }

    // Initialize animations
    addAnimations();

    // Add some interactive effects
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mousedown', function() {
            this.style.transform = 'scale(0.98)';
        });
        
        btn.addEventListener('mouseup', function() {
            this.style.transform = '';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
});

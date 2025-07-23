// Game UI and Room Management
class GameUI {
    constructor() {
        this.roomCode = null;
        this.playerName = null;
        this.isHost = false;
        this.gameStarted = false;
        this.gameTimer = 0;
        this.timerInterval = null;
        this.chessBoard = null;
        
        this.initializeUI();
        this.setupEventListeners();
        this.parseUrlParams();
    }

    initializeUI() {
        // Show loading initially
        this.showLoading('Đang khởi tạo game...');
        
        setTimeout(() => {
            this.hideLoading();
        }, 1500);
    }

    parseUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        this.roomCode = urlParams.get('room');
        this.playerName = urlParams.get('player') || 'Người chơi';
        this.isHost = urlParams.get('host') === 'true';
        
        if (this.roomCode) {
            this.joinRoom(this.roomCode, this.playerName);
        } else {
            // No room code, show error
            this.showMessage('Lỗi', 'Không tìm thấy mã phòng. Vui lòng tạo phòng hoặc tham gia phòng từ trang chủ.');
        }
    }

    setupEventListeners() {
        // Copy room code
        document.getElementById('copyRoomBtn').addEventListener('click', () => {
            this.copyRoomCode();
        });

        document.getElementById('copyInviteBtn').addEventListener('click', () => {
            this.copyRoomCode();
        });

        // Leave room
        document.getElementById('leaveRoomBtn').addEventListener('click', () => {
            this.leaveRoom();
        });

        // Chat
        document.getElementById('sendChatBtn').addEventListener('click', () => {
            this.sendChatMessage();
        });

        document.getElementById('chatInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendChatMessage();
            }
        });

        // Game actions
        document.getElementById('surrenderBtn').addEventListener('click', () => {
            this.surrender();
        });

        document.getElementById('offerDrawBtn').addEventListener('click', () => {
            this.offerDraw();
        });

        document.getElementById('newGameBtn').addEventListener('click', () => {
            this.startNewGame();
        });

        // Modal
        document.getElementById('modalOkBtn').addEventListener('click', () => {
            this.hideModal();
        });

        document.getElementById('modalCancelBtn').addEventListener('click', () => {
            this.hideModal();
        });

        // Close modal when clicking outside
        document.getElementById('gameModal').addEventListener('click', (e) => {
            if (e.target.id === 'gameModal') {
                this.hideModal();
            }
        });
    }

    joinRoom(roomCode, playerName) {
        this.roomCode = roomCode;
        this.playerName = playerName;
        
        // Update UI
        document.getElementById('roomCodeDisplay').textContent = roomCode;
        document.getElementById('inviteCode').textContent = roomCode;
        
        if (this.isHost) {
            // Host created the room
            document.getElementById('redPlayerName').textContent = playerName;
            document.getElementById('roomStatus').textContent = 'Đang chờ đối thủ tham gia...';
            
            // Simulate waiting for opponent (in real app, this would be WebSocket)
            setTimeout(() => {
                this.opponentJoined('Đối thủ');
            }, 3000);
        } else {
            // Joined existing room
            document.getElementById('blackPlayerName').textContent = playerName;
            document.getElementById('redPlayerName').textContent = 'Chủ phòng';
            document.getElementById('roomStatus').textContent = 'Đã tham gia phòng';
            
            // Start game immediately
            setTimeout(() => {
                this.startGame();
            }, 1000);
        }

        this.addSystemMessage(`${playerName} đã ${this.isHost ? 'tạo' : 'tham gia'} phòng ${roomCode}`);
    }

    opponentJoined(opponentName) {
        document.getElementById('blackPlayerName').textContent = opponentName;
        document.getElementById('roomStatus').textContent = 'Đủ người chơi - Bắt đầu game!';
        
        this.addSystemMessage(`${opponentName} đã tham gia phòng`);
        
        // Start game after short delay and start timer
        setTimeout(() => {
            this.startGame();
            // Make sure timer starts when both players joined
            if (this.chessBoard) {
                this.chessBoard.checkAndStartGame();
            }
        }, 2000);
    }

    startGame() {
        this.gameStarted = true;
        
        // Initialize chess board
        this.chessBoard = new ChessBoard();
        this.chessBoard.startGame();
        
        // Start timer
        this.startTimer();
        
        // Update UI
        document.getElementById('roomStatus').textContent = 'Đang chơi...';
        
        this.addSystemMessage('🎮 Game bắt đầu! Người chơi Đỏ đi trước.');
        
        // Show notification
        this.showMessage('Game bắt đầu!', '🎮 Chúc các bạn chơi vui vẻ!\n\nNgười chơi Đỏ đi trước.');
    }

    startTimer() {
        this.gameTimer = 0;
        this.timerInterval = setInterval(() => {
            this.gameTimer++;
            this.updateTimerDisplay();
        }, 1000);
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.gameTimer / 60);
        const seconds = this.gameTimer % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        document.getElementById('gameTimer').textContent = `⏱️ ${timeString}`;
        document.getElementById('timeDisplay').textContent = timeString;
    }

    copyRoomCode() {
        if (this.roomCode) {
            navigator.clipboard.writeText(this.roomCode).then(() => {
                this.showToast('✅ Đã copy mã phòng!');
            }).catch(() => {
                // Fallback for older browsers
                const tempInput = document.createElement('input');
                tempInput.value = this.roomCode;
                document.body.appendChild(tempInput);
                tempInput.select();
                document.execCommand('copy');
                document.body.removeChild(tempInput);
                this.showToast('✅ Đã copy mã phòng!');
            });
        }
    }

    leaveRoom() {
        this.showConfirm('Rời phòng', 'Bạn có chắc chắn muốn rời phòng?', () => {
            // Clear timer
            if (this.timerInterval) {
                clearInterval(this.timerInterval);
            }
            
            // Redirect to home
            window.location.href = './index.html';
        });
    }

    sendChatMessage() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();
        
        if (message) {
            this.addChatMessage(this.playerName, message);
            input.value = '';
        }
    }

    addChatMessage(sender, message) {
        const chatMessages = document.getElementById('chatMessages');
        const messageElement = document.createElement('div');
        messageElement.className = 'chat-message';
        
        const time = new Date().toLocaleTimeString('vi-VN', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        messageElement.innerHTML = `
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <strong>${sender}</strong>
                <small style="color: #718096;">${time}</small>
            </div>
            <div>${message}</div>
        `;
        
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    addSystemMessage(message) {
        const chatMessages = document.getElementById('chatMessages');
        const messageElement = document.createElement('div');
        messageElement.className = 'system-message';
        messageElement.textContent = `🤖 ${message}`;
        
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    surrender() {
        this.showSurrenderModal();
    }

    showSurrenderModal() {
        const modal = document.getElementById('surrenderModal');
        if (modal) {
            modal.classList.add('show');
            
            // Setup event handlers
            const confirmBtn = document.getElementById('confirmSurrenderBtn');
            const cancelBtn = document.getElementById('cancelSurrenderBtn');
            
            confirmBtn.onclick = () => {
                this.hideSurrenderModal();
                this.confirmSurrender();
            };
            
            cancelBtn.onclick = () => {
                this.hideSurrenderModal();
            };
        }
    }

    hideSurrenderModal() {
        const modal = document.getElementById('surrenderModal');
        if (modal) {
            modal.classList.remove('show');
        }
    }

    confirmSurrender() {
        if (this.chessBoard) {
            this.chessBoard.gameState = 'ended';
            this.addSystemMessage(`${this.playerName} đã đầu hàng`);
            
            // Show game over modal
            this.showGameOverModal('😔 Bạn đã thua!', 'Bạn đã đầu hàng. Chúc bạn may mắn lần sau!');
            
            if (this.timerInterval) {
                clearInterval(this.timerInterval);
            }
        }
    }

    showGameOverModal(title, message) {
        const modal = document.getElementById('gameOverModal');
        const titleEl = document.getElementById('gameOverTitle');
        const messageEl = document.getElementById('gameOverMessage');
        
        if (modal && titleEl && messageEl) {
            titleEl.textContent = title;
            messageEl.textContent = message;
            modal.classList.add('show');
            
            // Setup event handlers
            const newGameBtn = document.getElementById('newGameBtn');
            const backHomeBtn = document.getElementById('backHomeBtn');
            
            newGameBtn.onclick = () => {
                window.location.href = './index.html';
            };
            
            backHomeBtn.onclick = () => {
                window.location.href = './index.html';
            };
        }
    }

    offerDraw() {
        this.addSystemMessage(`${this.playerName} đề nghị hòa`);
        this.showMessage('Đề nghị hòa', 'Đã gửi đề nghị hòa cho đối thủ.');
    }

    startNewGame() {
        this.showConfirm('Ván mới', 'Bạn có muốn bắt đầu ván mới?', () => {
            // Reset game state
            this.gameTimer = 0;
            if (this.timerInterval) {
                clearInterval(this.timerInterval);
            }
            
            // Reinitialize chess board
            this.chessBoard = new ChessBoard();
            this.startGame();
            
            this.addSystemMessage('🔄 Bắt đầu ván mới');
        });
    }

    showLoading(message = 'Đang tải...') {
        const loading = document.getElementById('gameLoading');
        document.getElementById('loadingText').textContent = message;
        loading.classList.add('show');
    }

    hideLoading() {
        const loading = document.getElementById('gameLoading');
        loading.classList.remove('show');
    }

    showMessage(title, message) {
        const modal = document.getElementById('gameModal');
        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalMessage').innerHTML = message.replace(/\n/g, '<br>');
        document.getElementById('modalCancelBtn').style.display = 'none';
        modal.classList.add('show');
    }

    showConfirm(title, message, onConfirm) {
        const modal = document.getElementById('gameModal');
        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalMessage').innerHTML = message.replace(/\n/g, '<br>');
        document.getElementById('modalCancelBtn').style.display = 'inline-block';
        modal.classList.add('show');
        
        // Set up confirm handler
        const okBtn = document.getElementById('modalOkBtn');
        const cancelBtn = document.getElementById('modalCancelBtn');
        
        okBtn.onclick = () => {
            this.hideModal();
            onConfirm();
        };
        
        cancelBtn.onclick = () => {
            this.hideModal();
        };
    }

    hideModal() {
        const modal = document.getElementById('gameModal');
        modal.classList.remove('show');
    }

    showToast(message) {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #667eea;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 10px 20px rgba(0,0,0,0.2);
            z-index: 3000;
            animation: toastSlideIn 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'toastSlideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 2000);
    }
}

// CSS for toast animations
const toastCSS = `
@keyframes toastSlideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes toastSlideOut {
    from {
        transform: translateX(0);
        opacity: 1;
    }
    to {
        transform: translateX(100%);
        opacity: 0;
    }
}
`;

// Add toast CSS to document
const style = document.createElement('style');
style.textContent = toastCSS;
document.head.appendChild(style);

// Initialize game UI when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.gameUI = new GameUI();
});

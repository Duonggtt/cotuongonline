// Main Chess Game Logic
class ChessGame {
    constructor() {
        this.board = null;
        this.ui = null;
        this.websocket = null;
        this.isOnline = false;
        
        this.initializeGame();
    }

    initializeGame() {
        // Check if this is online or offline mode
        const urlParams = new URLSearchParams(window.location.search);
        const roomCode = urlParams.get('room');
        
        if (roomCode) {
            this.isOnline = true;
            this.initializeOnlineGame();
        } else {
            this.isOnline = false;
            this.initializeOfflineGame();
        }
    }

    initializeOnlineGame() {
        // Online game logic is handled by GameUI class
        console.log('Online game mode initialized');
    }

    initializeOfflineGame() {
        // Initialize offline demo
        this.board = new ChessBoard();
        
        // Add demo messages
        this.addSystemMessage('🎮 Chế độ demo offline');
        this.addSystemMessage('💡 Để chơi multiplayer, tạo phòng từ trang chủ');
        
        // Start game immediately in offline mode
        setTimeout(() => {
            this.board.startGame();
        }, 1000);
    }

    addSystemMessage(message) {
        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages) {
            const messageElement = document.createElement('div');
            messageElement.className = 'system-message';
            messageElement.textContent = `🤖 ${message}`;
            
            chatMessages.appendChild(messageElement);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

    // WebSocket connection for online play
    connectWebSocket(roomCode) {
        // In a real application, this would connect to the Spring Boot WebSocket
        const wsUrl = `ws://localhost:8080/ws/game?room=${roomCode}`;
        
        try {
            this.websocket = new WebSocket(wsUrl);
            
            this.websocket.onopen = () => {
                console.log('WebSocket connected');
                this.isOnline = true;
            };
            
            this.websocket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                this.handleWebSocketMessage(data);
            };
            
            this.websocket.onerror = (error) => {
                console.error('WebSocket error:', error);
                this.handleConnectionError();
            };
            
            this.websocket.onclose = () => {
                console.log('WebSocket disconnected');
                this.isOnline = false;
            };
        } catch (error) {
            console.error('Failed to connect WebSocket:', error);
            this.handleConnectionError();
        }
    }

    handleWebSocketMessage(data) {
        switch (data.type) {
            case 'PLAYER_JOINED':
                this.handlePlayerJoined(data);
                break;
            case 'GAME_STARTED':
                this.handleGameStarted(data);
                break;
            case 'MOVE':
                this.handleMove(data);
                break;
            case 'CHAT':
                this.handleChat(data);
                break;
            case 'GAME_ENDED':
                this.handleGameEnded(data);
                break;
            default:
                console.log('Unknown message type:', data.type);
        }
    }

    handlePlayerJoined(data) {
        this.addSystemMessage(`${data.playerName} đã tham gia phòng`);
        if (this.ui) {
            this.ui.opponentJoined(data.playerName);
        }
    }

    handleGameStarted(data) {
        this.addSystemMessage('🎮 Game bắt đầu!');
        if (this.board) {
            this.board.startGame();
        }
    }

    handleMove(data) {
        if (this.board) {
            // Apply move from other player
            this.board.makeMove(data.from.row, data.from.col, data.to.row, data.to.col);
        }
    }

    handleChat(data) {
        if (this.ui) {
            this.ui.addChatMessage(data.sender, data.message);
        }
    }

    handleGameEnded(data) {
        this.addSystemMessage(`🏁 Game kết thúc! ${data.winner} thắng`);
        if (this.board) {
            this.board.endGame();
        }
    }

    handleConnectionError() {
        // Fallback to offline mode
        this.isOnline = false;
        this.addSystemMessage('❌ Không thể kết nối server. Chuyển sang chế độ demo offline.');
        
        if (!this.board) {
            this.initializeOfflineGame();
        }
    }

    // Send move to server
    sendMove(from, to, piece, captured) {
        if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
            const moveData = {
                type: 'MOVE',
                from: from,
                to: to,
                piece: piece,
                captured: captured,
                timestamp: Date.now()
            };
            
            this.websocket.send(JSON.stringify(moveData));
        }
    }

    // Send chat message to server
    sendChatMessage(message) {
        if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
            const chatData = {
                type: 'CHAT',
                message: message,
                timestamp: Date.now()
            };
            
            this.websocket.send(JSON.stringify(chatData));
        }
    }

    // Disconnect from game
    disconnect() {
        if (this.websocket) {
            this.websocket.close();
        }
    }
}

// Utility functions
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function generateRoomCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function validateRoomCode(code) {
    return /^\d{6}$/.test(code);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize ChessGame if we're not in the main GameUI flow
    if (!window.gameUI) {
        window.chessGame = new ChessGame();
    }
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ChessGame, formatTime, generateRoomCode, validateRoomCode };
}

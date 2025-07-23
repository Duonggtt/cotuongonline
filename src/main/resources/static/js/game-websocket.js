// WebSocket Game Communication
class GameWebSocket {
    constructor(config) {
        this.config = config;
        this.stompClient = null;
        this.connected = false;
        this.subscriptions = [];
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 1000;
        
        this.connect();
    }

    connect() {
        console.log('Connecting to WebSocket...');
        
        const socket = new SockJS('/ws');
        this.stompClient = Stomp.over(socket);
        
        // Disable debug logging
        this.stompClient.debug = null;
        
        this.stompClient.connect({}, 
            (frame) => this.onConnected(frame),
            (error) => this.onError(error)
        );
    }

    onConnected(frame) {
        console.log('Connected to WebSocket:', frame);
        this.connected = true;
        this.reconnectAttempts = 0;
        
        // Subscribe to game room updates
        this.subscribeToRoom();
        
        // Subscribe to chat messages
        this.subscribeToChat();
        
        // Subscribe to personal messages (like valid moves)
        this.subscribeToPersonal();
        
        // Notify connection status
        this.updateConnectionStatus(true);
    }

    onError(error) {
        console.error('WebSocket connection error:', error);
        this.connected = false;
        this.updateConnectionStatus(false);
        
        // Attempt to reconnect
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
            
            setTimeout(() => {
                this.connect();
            }, this.reconnectDelay * this.reconnectAttempts);
        } else {
            this.showConnectionError();
        }
    }

    subscribeToRoom() {
        const subscription = this.stompClient.subscribe(
            `/topic/room/${this.config.roomCode}`,
            (message) => this.handleGameUpdate(JSON.parse(message.body))
        );
        this.subscriptions.push(subscription);
    }

    subscribeToChat() {
        const subscription = this.stompClient.subscribe(
            `/topic/chat/${this.config.roomCode}`,
            (message) => this.handleChatMessage(JSON.parse(message.body))
        );
        this.subscriptions.push(subscription);
    }

    subscribeToPersonal() {
        const subscription = this.stompClient.subscribe(
            `/queue/validMoves`,
            (message) => this.handleValidMoves(JSON.parse(message.body))
        );
        this.subscriptions.push(subscription);
    }

    // Game Actions
    makeMove(move) {
        if (!this.connected) {
            console.error('Not connected to WebSocket');
            return;
        }

        this.stompClient.send('/app/game/move', {}, JSON.stringify(move));
    }

    surrender() {
        if (!this.connected) {
            console.error('Not connected to WebSocket');
            return;
        }

        const surrenderRequest = {
            playerId: this.config.playerId,
            roomCode: this.config.roomCode
        };

        this.stompClient.send('/app/game/surrender', {}, JSON.stringify(surrenderRequest));
    }

    requestValidMoves(fromRow, fromCol) {
        if (!this.connected) {
            console.error('Not connected to WebSocket');
            return;
        }

        const request = {
            fromRow,
            fromCol,
            playerId: this.config.playerId,
            roomCode: this.config.roomCode
        };

        this.stompClient.send('/app/game/validMoves', {}, JSON.stringify(request));
    }

    sendChatMessage(message) {
        if (!this.connected) {
            console.error('Not connected to WebSocket');
            return;
        }

        const chatMessage = {
            playerId: this.config.playerId,
            playerName: this.config.playerName,
            message: message,
            roomCode: this.config.roomCode
        };

        this.stompClient.send('/app/chat/message', {}, JSON.stringify(chatMessage));
    }

    // Message Handlers
    handleGameUpdate(update) {
        console.log('Game update received:', update);
        
        // Check if game just started (both players joined)
        if (update.gameStatus === 'IN_PROGRESS' && window.chessBoard && window.chessBoard.gameState === 'waiting') {
            console.log('Game started - both players joined');
            window.chessBoard.playersReady = true;
            window.chessBoard.startGame();
            hideWaitingModal();
        }
        
        // Update board state
        if (window.chessBoard && update.boardState) {
            window.chessBoard.updateBoard(update.boardState);
        }
        
        // Update current turn
        if (update.currentTurn) {
            this.config.currentTurn = update.currentTurn;
            this.updateTurnDisplay(update.currentTurn);
            
            // Update player turn status
            const isPlayerTurn = update.currentTurn.toLowerCase() === this.config.playerColor?.toLowerCase();
            if (window.chessBoard) {
                window.chessBoard.setPlayerTurn(isPlayerTurn);
            }
        }
        
        // Update move history
        if (update.moveHistory !== undefined) {
            this.updateMoveHistory(update.moveHistory);
        }
        
        // Handle last move highlight
        if (update.lastMove) {
            this.highlightLastMove(update.lastMove);
        }
        
        // Handle check status
        if (update.inCheck) {
            this.handleCheckStatus(update.inCheck);
        }
        
        // Handle game over
        if (update.gameStatus && update.gameStatus !== 'IN_PROGRESS') {
            this.handleGameOver(update);
        }
        
        // Play sound effects
        this.playGameSounds(update);
    }

    handleChatMessage(message) {
        console.log('Chat message received:', message);
        this.displayChatMessage(message);
    }

    handleValidMoves(moves) {
        console.log('Valid moves received:', moves);
        if (window.chessBoard) {
            window.chessBoard.showValidMoves(moves);
        }
    }

    // UI Updates
    updateTurnDisplay(currentTurn) {
        const turnText = document.getElementById('currentTurnText');
        if (turnText) {
            const turnColor = currentTurn === 'RED' ? 'Đỏ' : 'Đen';
            const isMyTurn = currentTurn.toLowerCase() === this.config.playerColor?.toLowerCase();
            
            turnText.textContent = isMyTurn ? 'Lượt của bạn' : `Lượt của ${turnColor}`;
            turnText.style.color = isMyTurn ? '#48bb78' : '#e53e3e';
            turnText.style.fontWeight = isMyTurn ? 'bold' : 'normal';
        }
    }

    updateMoveHistory(moveHistory) {
        const historyElement = document.getElementById('moveHistory');
        if (historyElement) {
            if (moveHistory) {
                const moves = moveHistory.split('\n');
                historyElement.innerHTML = moves.map((move, index) => 
                    `<div class="move-item">${index + 1}. ${move}</div>`
                ).join('');
                
                // Scroll to bottom
                historyElement.scrollTop = historyElement.scrollHeight;
            } else {
                historyElement.innerHTML = '<div class="no-moves">Chưa có nước đi nào</div>';
            }
        }
    }

    highlightLastMove(lastMoveText) {
        // Parse move notation to extract coordinates
        // This is a simple implementation, could be enhanced
        const match = lastMoveText.match(/\((\d+),(\d+)\)->\((\d+),(\d+)\)/);
        if (match && window.chessBoard) {
            const [, fromRow, fromCol, toRow, toCol] = match.map(Number);
            window.chessBoard.highlightLastMove(fromRow, fromCol, toRow, toCol);
        }
    }

    handleCheckStatus(inCheck) {
        const statusText = document.getElementById('gameStatusText');
        if (statusText) {
            if (inCheck) {
                statusText.textContent = '⚠️ Chiếu tướng!';
                statusText.style.color = '#e53e3e';
                statusText.style.fontWeight = 'bold';
            } else {
                statusText.textContent = '';
            }
        }
    }

    handleGameOver(update) {
        const modal = document.getElementById('gameOverModal');
        const title = document.getElementById('gameOverTitle');
        const message = document.getElementById('gameOverMessage');
        
        if (modal && title && message) {
            let titleText = 'Kết thúc trận đấu';
            let messageText = '';
            
            switch (update.gameStatus) {
                case 'FINISHED_RED_WIN':
                    titleText = '🏆 Đỏ thắng!';
                    messageText = update.winner ? `${update.winner} đã thắng!` : 'Quân đỏ đã thắng!';
                    break;
                case 'FINISHED_BLACK_WIN':
                    titleText = '🏆 Đen thắng!';
                    messageText = update.winner ? `${update.winner} đã thắng!` : 'Quân đen đã thắng!';
                    break;
                case 'FINISHED_DRAW':
                    titleText = '🤝 Hòa cờ';
                    messageText = 'Trận đấu kết thúc với tỷ số hòa!';
                    break;
                case 'FINISHED_SURRENDER':
                    const isWinner = update.winner && update.winner.toLowerCase() === this.config.playerColor?.toLowerCase();
                    if (isWinner) {
                        titleText = '� Bạn đã thắng!';
                        messageText = `Đối thủ đã đầu hàng. Chúc mừng bạn!`;
                    } else {
                        titleText = '😔 Bạn đã thua!';
                        messageText = `Bạn đã đầu hàng. Chúc bạn may mắn lần sau!`;
                    }
                    break;
                default:
                    messageText = 'Trận đấu đã kết thúc!';
            }
            
            title.textContent = titleText;
            message.textContent = messageText;
            modal.classList.add('show');
            
            // Stop timer if exists
            if (window.chessBoard && window.chessBoard.timerInterval) {
                clearInterval(window.chessBoard.timerInterval);
                window.chessBoard.timerInterval = null;
            }
        }
    }

    playGameSounds(update) {
        // Play appropriate sound based on update
        if (update.lastMove) {
            const isCapture = update.lastMove.includes('[ăn');
            window.ChessPieces.playMoveSound(isCapture);
        }
    }

    displayChatMessage(message) {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;

        const messageElement = document.createElement('div');
        messageElement.className = 'chat-message';
        
        const isOwnMessage = message.playerId === this.config.playerId;
        messageElement.classList.add(isOwnMessage ? 'own' : 'other');

        const senderElement = document.createElement('div');
        senderElement.className = 'sender';
        senderElement.textContent = message.playerName;

        const contentElement = document.createElement('div');
        contentElement.className = 'content';
        contentElement.textContent = message.message;

        messageElement.appendChild(senderElement);
        messageElement.appendChild(contentElement);

        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Animate new message
        messageElement.style.opacity = '0';
        messageElement.style.transform = 'translateY(10px)';
        setTimeout(() => {
            messageElement.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            messageElement.style.opacity = '1';
            messageElement.style.transform = 'translateY(0)';
        }, 10);
    }

    updateConnectionStatus(connected) {
        const statusElements = document.querySelectorAll('.connection-status');
        statusElements.forEach(element => {
            element.textContent = connected ? '🟢 Đã kết nối' : '🔴 Mất kết nối';
            element.style.color = connected ? '#48bb78' : '#e53e3e';
        });
    }

    showConnectionError() {
        // Show connection error modal or notification
        console.error('Failed to connect to WebSocket after multiple attempts');
        
        const errorMsg = document.createElement('div');
        errorMsg.className = 'connection-error';
        errorMsg.innerHTML = `
            <div style="position: fixed; top: 20px; right: 20px; background: #fed7d7; color: #c53030; padding: 15px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 1000;">
                <strong>Lỗi kết nối</strong><br>
                Không thể kết nối đến server. Vui lòng tải lại trang.
                <button onclick="location.reload()" style="margin-left: 10px; padding: 5px 10px; background: #c53030; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    Tải lại
                </button>
            </div>
        `;
        document.body.appendChild(errorMsg);
    }

    // Cleanup
    disconnect() {
        if (this.stompClient && this.connected) {
            this.subscriptions.forEach(sub => sub.unsubscribe());
            this.stompClient.disconnect();
        }
        this.connected = false;
    }
}

// Export GameWebSocket class
window.GameWebSocket = GameWebSocket;

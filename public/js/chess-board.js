// Chess Board Logic for Vietnamese Chess (Cờ Tướng)
class ChessBoard {
    constructor() {
        this.board = [];
        this.currentPlayer = 'red';
        this.selectedPiece = null;
        this.gameState = 'waiting'; // waiting, playing, ended
        this.moveHistory = [];
        
        // Timer settings
        this.timePerPlayer = 10 * 60; // 10 minutes in seconds
        this.redTimeLeft = this.timePerPlayer;
        this.blackTimeLeft = this.timePerPlayer;
        this.timerInterval = null;
        this.lastMoveTime = Date.now();
        
        // Audio
        this.audioManager = window.audioManager;
        
        this.initializeBoard();
        this.renderBoard();
        this.updateTimerDisplay();
    }

    initializeBoard() {
        // Initialize empty 10x9 board
        this.board = Array(10).fill().map(() => Array(9).fill(null));
        
        // Red pieces (bottom)
        this.board[9] = ['r', 'h', 'e', 'a', 'k', 'a', 'e', 'h', 'r'];
        this.board[7] = [null, null, null, null, null, null, null, null, null];
        this.board[7][1] = 'c'; // Cannon
        this.board[7][7] = 'c';
        this.board[6] = ['p', null, 'p', null, 'p', null, 'p', null, 'p'];

        // Black pieces (top)
        this.board[0] = ['R', 'H', 'E', 'A', 'K', 'A', 'E', 'H', 'R'];
        this.board[2] = [null, null, null, null, null, null, null, null, null];
        this.board[2][1] = 'C'; // Cannon
        this.board[2][7] = 'C';
        this.board[3] = ['P', null, 'P', null, 'P', null, 'P', null, 'P'];
    }

    renderBoard() {
        const boardElement = document.getElementById('chessBoard');
        boardElement.innerHTML = '';

        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < 9; col++) {
                const cell = document.createElement('div');
                cell.className = 'chess-cell';
                cell.dataset.row = row;
                cell.dataset.col = col;

                // Add special area classes
                if (row === 4 || row === 5) {
                    cell.classList.add('river');
                }
                if ((row <= 2 && col >= 3 && col <= 5) || (row >= 7 && col >= 3 && col <= 5)) {
                    cell.classList.add('palace');
                }

                const piece = this.board[row][col];
                if (piece) {
                    const pieceElement = document.createElement('div');
                    pieceElement.className = `chess-piece ${this.isRedPiece(piece) ? 'red' : 'black'}`;
                    pieceElement.textContent = this.getPieceSymbol(piece);
                    cell.appendChild(pieceElement);
                }

                cell.addEventListener('click', () => this.handleCellClick(row, col));
                boardElement.appendChild(cell);
            }
        }
    }

    handleCellClick(row, col) {
        if (this.gameState !== 'playing') {
            this.showMessage('Game chưa bắt đầu!', 'Đang chờ đối thủ tham gia...');
            return;
        }

        const piece = this.board[row][col];
        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);

        // If no piece is selected
        if (!this.selectedPiece) {
            if (piece && this.isCurrentPlayerPiece(piece)) {
                this.selectPiece(row, col);
            }
            return;
        }

        // If clicking on the same piece
        if (this.selectedPiece.row === row && this.selectedPiece.col === col) {
            this.deselectPiece();
            return;
        }

        // If clicking on own piece
        if (piece && this.isCurrentPlayerPiece(piece)) {
            this.deselectPiece();
            this.selectPiece(row, col);
            return;
        }

        // Try to move piece
        if (this.isValidMove(this.selectedPiece.row, this.selectedPiece.col, row, col)) {
            this.makeMove(this.selectedPiece.row, this.selectedPiece.col, row, col);
        } else {
            this.showMessage('Nước đi không hợp lệ!', 'Vui lòng chọn nước đi khác.');
        }
    }

    selectPiece(row, col) {
        this.deselectPiece();
        this.selectedPiece = { row, col };
        
        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        cell.classList.add('selected');
        
        // Highlight possible moves
        this.highlightPossibleMoves(row, col);
    }

    deselectPiece() {
        if (this.selectedPiece) {
            const cell = document.querySelector(`[data-row="${this.selectedPiece.row}"][data-col="${this.selectedPiece.col}"]`);
            cell?.classList.remove('selected');
        }
        this.selectedPiece = null;
        this.clearHighlights();
    }

    highlightPossibleMoves(row, col) {
        for (let r = 0; r < 10; r++) {
            for (let c = 0; c < 9; c++) {
                if (this.isValidMove(row, col, r, c)) {
                    const cell = document.querySelector(`[data-row="${r}"][data-col="${c}"]`);
                    if (this.board[r][c] && !this.isCurrentPlayerPiece(this.board[r][c])) {
                        cell.classList.add('enemy-piece');
                    } else {
                        cell.classList.add('possible-move');
                    }
                }
            }
        }
    }

    clearHighlights() {
        document.querySelectorAll('.chess-cell').forEach(cell => {
            cell.classList.remove('possible-move', 'enemy-piece', 'last-move');
        });
    }

    makeMove(fromRow, fromCol, toRow, toCol) {
        const piece = this.board[fromRow][fromCol];
        const capturedPiece = this.board[toRow][toCol];
        
        // Make the move
        this.board[toRow][toCol] = piece;
        this.board[fromRow][fromCol] = null;
        
        // Play sound effects
        if (capturedPiece) {
            this.audioManager?.playCaptureSound();
        } else {
            this.audioManager?.playMoveSound();
        }
        
        // Add to move history
        this.moveHistory.push({
            from: { row: fromRow, col: fromCol },
            to: { row: toRow, col: toCol },
            piece: piece,
            captured: capturedPiece,
            player: this.currentPlayer,
            timeLeft: this.currentPlayer === 'red' ? this.redTimeLeft : this.blackTimeLeft
        });

        // Update move count
        document.getElementById('moveCount').textContent = this.moveHistory.length;
        
        // Switch players and reset timer
        this.currentPlayer = this.currentPlayer === 'red' ? 'black' : 'red';
        this.resetMoveTimer();
        this.updateTurnIndicator();
        
        // Render board
        this.deselectPiece();
        this.renderBoard();
        
        // Highlight last move
        const toCell = document.querySelector(`[data-row="${toRow}"][data-col="${toCol}"]`);
        toCell.classList.add('last-move');
        
        // Add move animation
        const pieceElement = toCell.querySelector('.chess-piece');
        if (pieceElement) {
            pieceElement.classList.add('moving');
            setTimeout(() => pieceElement.classList.remove('moving'), 300);
        }

        // Check for game end
        if (this.isGameOver()) {
            this.endGame();
        } else {
            // Check if near endgame (less than 2 minutes for either player)
            if (this.redTimeLeft < 120 || this.blackTimeLeft < 120) {
                this.audioManager?.startTenseMusic();
            }
        }

        // Add move to chat
        this.addMoveToChat(fromRow, fromCol, toRow, toCol, piece, capturedPiece);
    }

    isValidMove(fromRow, fromCol, toRow, toCol) {
        // Basic bounds check
        if (toRow < 0 || toRow >= 10 || toCol < 0 || toCol >= 9) return false;
        
        // Can't move to same position
        if (fromRow === toRow && fromCol === toCol) return false;
        
        // Can't capture own piece
        const targetPiece = this.board[toRow][toCol];
        if (targetPiece && this.isCurrentPlayerPiece(targetPiece)) return false;
        
        const piece = this.board[fromRow][fromCol];
        if (!piece) return false;
        
        // Piece-specific movement rules (simplified)
        const pieceType = piece.toLowerCase();
        
        switch (pieceType) {
            case 'p': // Pawn
                return this.isValidPawnMove(fromRow, fromCol, toRow, toCol, piece);
            case 'r': // Rook (Xe)
                return this.isValidRookMove(fromRow, fromCol, toRow, toCol);
            case 'h': // Horse (Mã)
                return this.isValidHorseMove(fromRow, fromCol, toRow, toCol);
            case 'e': // Elephant (Voi)
                return this.isValidElephantMove(fromRow, fromCol, toRow, toCol, piece);
            case 'a': // Advisor (Sĩ)
                return this.isValidAdvisorMove(fromRow, fromCol, toRow, toCol, piece);
            case 'k': // King (Tướng)
                return this.isValidKingMove(fromRow, fromCol, toRow, toCol, piece);
            case 'c': // Cannon (Pháo)
                return this.isValidCannonMove(fromRow, fromCol, toRow, toCol);
            default:
                return false;
        }
    }

    isValidPawnMove(fromRow, fromCol, toRow, toCol, piece) {
        const isRed = this.isRedPiece(piece);
        const direction = isRed ? -1 : 1; // Red moves up, Black moves down
        const hasPassedRiver = isRed ? fromRow <= 4 : fromRow >= 5;
        
        // Forward movement
        if (toCol === fromCol && toRow === fromRow + direction) return true;
        
        // Sideways movement (only after crossing river)
        if (hasPassedRiver && toRow === fromRow && Math.abs(toCol - fromCol) === 1) return true;
        
        return false;
    }

    isValidRookMove(fromRow, fromCol, toRow, toCol) {
        // Rook moves horizontally or vertically
        if (fromRow !== toRow && fromCol !== toCol) return false;
        
        // Check for obstacles in path
        return this.isPathClear(fromRow, fromCol, toRow, toCol);
    }

    isValidHorseMove(fromRow, fromCol, toRow, toCol) {
        const rowDiff = Math.abs(toRow - fromRow);
        const colDiff = Math.abs(toCol - fromCol);
        
        // Horse moves in L-shape: 2+1 or 1+2
        if (!((rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2))) return false;
        
        // Check blocking point
        let blockRow, blockCol;
        if (rowDiff === 2) {
            blockRow = fromRow + (toRow - fromRow) / 2;
            blockCol = fromCol;
        } else {
            blockRow = fromRow;
            blockCol = fromCol + (toCol - fromCol) / 2;
        }
        
        return !this.board[blockRow][blockCol]; // No piece blocking
    }

    isValidElephantMove(fromRow, fromCol, toRow, toCol, piece) {
        const isRed = this.isRedPiece(piece);
        
        // Elephant can't cross river
        if (isRed && toRow <= 4) return false;
        if (!isRed && toRow >= 5) return false;
        
        // Elephant moves diagonally 2 points
        const rowDiff = Math.abs(toRow - fromRow);
        const colDiff = Math.abs(toCol - fromCol);
        if (rowDiff !== 2 || colDiff !== 2) return false;
        
        // Check blocking point
        const blockRow = fromRow + (toRow - fromRow) / 2;
        const blockCol = fromCol + (toCol - fromCol) / 2;
        return !this.board[blockRow][blockCol];
    }

    isValidAdvisorMove(fromRow, fromCol, toRow, toCol, piece) {
        const isRed = this.isRedPiece(piece);
        
        // Advisor stays in palace
        if (isRed) {
            if (toRow < 7 || toCol < 3 || toCol > 5) return false;
        } else {
            if (toRow > 2 || toCol < 3 || toCol > 5) return false;
        }
        
        // Advisor moves diagonally one point
        const rowDiff = Math.abs(toRow - fromRow);
        const colDiff = Math.abs(toCol - fromCol);
        return rowDiff === 1 && colDiff === 1;
    }

    isValidKingMove(fromRow, fromCol, toRow, toCol, piece) {
        const isRed = this.isRedPiece(piece);
        
        // King stays in palace
        if (isRed) {
            if (toRow < 7 || toCol < 3 || toCol > 5) return false;
        } else {
            if (toRow > 2 || toCol < 3 || toCol > 5) return false;
        }
        
        // King moves one point horizontally or vertically
        const rowDiff = Math.abs(toRow - fromRow);
        const colDiff = Math.abs(toCol - fromCol);
        return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
    }

    isValidCannonMove(fromRow, fromCol, toRow, toCol) {
        // Cannon moves like rook but jumps over exactly one piece to capture
        if (fromRow !== toRow && fromCol !== toCol) return false;
        
        const targetPiece = this.board[toRow][toCol];
        const piecesInPath = this.countPiecesInPath(fromRow, fromCol, toRow, toCol);
        
        if (targetPiece) {
            // Capturing: need exactly one piece in between
            return piecesInPath === 1;
        } else {
            // Moving: path must be clear
            return piecesInPath === 0;
        }
    }

    isPathClear(fromRow, fromCol, toRow, toCol) {
        return this.countPiecesInPath(fromRow, fromCol, toRow, toCol) === 0;
    }

    countPiecesInPath(fromRow, fromCol, toRow, toCol) {
        let count = 0;
        const rowStep = toRow === fromRow ? 0 : (toRow - fromRow) / Math.abs(toRow - fromRow);
        const colStep = toCol === fromCol ? 0 : (toCol - fromCol) / Math.abs(toCol - fromCol);
        
        let currentRow = fromRow + rowStep;
        let currentCol = fromCol + colStep;
        
        while (currentRow !== toRow || currentCol !== toCol) {
            if (this.board[currentRow][currentCol]) count++;
            currentRow += rowStep;
            currentCol += colStep;
        }
        
        return count;
    }

    isRedPiece(piece) {
        return piece && piece === piece.toLowerCase();
    }

    isCurrentPlayerPiece(piece) {
        return (this.currentPlayer === 'red' && this.isRedPiece(piece)) ||
               (this.currentPlayer === 'black' && !this.isRedPiece(piece));
    }

    getPieceSymbol(piece) {
        const symbols = {
            'k': '帥', 'K': '將', // King
            'a': '仕', 'A': '士', // Advisor
            'e': '相', 'E': '象', // Elephant
            'h': '傌', 'H': '馬', // Horse
            'r': '俥', 'R': '車', // Rook
            'c': '炮', 'C': '砲', // Cannon
            'p': '兵', 'P': '卒'  // Pawn
        };
        return symbols[piece] || piece;
    }

    updateTurnIndicator() {
        const indicator = document.getElementById('turnIndicator');
        if (this.currentPlayer === 'red') {
            indicator.textContent = '🔴 Lượt của Đỏ';
            indicator.style.color = '#dc2626';
        } else {
            indicator.textContent = '⚫ Lượt của Đen';
            indicator.style.color = '#1f2937';
        }
        
        // Update active timer styling
        this.updateActiveTimer();
    }

    isGameOver() {
        // Simplified game over check - just check if king is captured
        let redKing = false, blackKing = false;
        
        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < 9; col++) {
                const piece = this.board[row][col];
                if (piece === 'k') redKing = true;
                if (piece === 'K') blackKing = true;
            }
        }
        
        return !redKing || !blackKing;
    }

    endGame() {
        this.gameState = 'ended';
        const winner = this.currentPlayer === 'red' ? 'Đen' : 'Đỏ';
        
        // Stop timer
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        // Stop tense music
        this.audioManager?.stopTenseMusic();
        
        // Play game over sound
        this.audioManager?.playGameOverSound();
        
        this.showMessage('Kết thúc game!', `🎉 Người chơi ${winner} thắng!`);
        
        document.getElementById('gameStatusInfo').textContent = `${winner} thắng`;
        document.getElementById('newGameBtn').style.display = 'inline-block';
        
        // Remove active timer styling
        const redTimer = document.getElementById('redTimer');
        const blackTimer = document.getElementById('blackTimer');
        if (redTimer && blackTimer) {
            redTimer.classList.remove('active', 'warning', 'danger');
            blackTimer.classList.remove('active', 'warning', 'danger');
        }
    }

    addMoveToChat(fromRow, fromCol, toRow, toCol, piece, captured) {
        const chatMessages = document.getElementById('chatMessages');
        const moveText = `${this.getPieceSymbol(piece)} ${this.getPositionName(fromRow, fromCol)} → ${this.getPositionName(toRow, toCol)}`;
        const captureText = captured ? ` (ăn ${this.getPieceSymbol(captured)})` : '';
        
        const moveMessage = document.createElement('div');
        moveMessage.className = 'system-message';
        moveMessage.textContent = `📝 ${moveText}${captureText}`;
        
        chatMessages.appendChild(moveMessage);
        chatMessages.scrollTop = chatMessages.scrollHeight;
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

    getPositionName(row, col) {
        const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
        return `${files[col]}${10 - row}`;
    }

    showMessage(title, message) {
        const modal = document.getElementById('gameModal');
        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalMessage').textContent = message;
        modal.classList.add('show');
    }

    startGame() {
        this.gameState = 'playing';
        this.currentPlayer = 'red';
        this.updateTurnIndicator();
        this.startTimer();
        
        document.getElementById('gameStatusInfo').textContent = 'Đang chơi';
        document.getElementById('surrenderBtn').style.display = 'inline-block';
        document.getElementById('offerDrawBtn').style.display = 'inline-block';
        
        // Add system message
        const chatMessages = document.getElementById('chatMessages');
        const startMessage = document.createElement('div');
        startMessage.className = 'system-message';
        startMessage.textContent = '🎮 Game đã bắt đầu! Chúc các bạn chơi vui vẻ!';
        chatMessages.appendChild(startMessage);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    startTimer() {
        this.lastMoveTime = Date.now();
        this.timerInterval = setInterval(() => {
            this.updateTimer();
        }, 1000);
        
        // Set active timer
        this.updateActiveTimer();
    }

    updateTimer() {
        if (this.gameState !== 'playing') return;
        
        // Decrease current player's time
        if (this.currentPlayer === 'red') {
            this.redTimeLeft = Math.max(0, this.redTimeLeft - 1);
        } else {
            this.blackTimeLeft = Math.max(0, this.blackTimeLeft - 1);
        }
        
        this.updateTimerDisplay();
        this.checkTimeWarnings();
        
        // Check if time is up
        if (this.redTimeLeft <= 0 || this.blackTimeLeft <= 0) {
            this.timeUp();
        }
    }

    resetMoveTimer() {
        this.lastMoveTime = Date.now();
        this.updateActiveTimer();
    }

    updateTimerDisplay() {
        const redDisplay = document.getElementById('redTimeDisplay');
        const blackDisplay = document.getElementById('blackTimeDisplay');
        
        if (redDisplay) {
            redDisplay.textContent = this.formatTime(this.redTimeLeft);
            redDisplay.className = 'timer-display';
            if (this.redTimeLeft <= 30) {
                redDisplay.classList.add('danger');
            } else if (this.redTimeLeft <= 60) {
                redDisplay.classList.add('warning');
            }
        }
        
        if (blackDisplay) {
            blackDisplay.textContent = this.formatTime(this.blackTimeLeft);
            blackDisplay.className = 'timer-display';
            if (this.blackTimeLeft <= 30) {
                blackDisplay.classList.add('danger');
            } else if (this.blackTimeLeft <= 60) {
                blackDisplay.classList.add('warning');
            }
        }
    }

    updateActiveTimer() {
        const redTimer = document.getElementById('redTimer');
        const blackTimer = document.getElementById('blackTimer');
        
        if (redTimer && blackTimer) {
            redTimer.classList.remove('active', 'warning', 'danger');
            blackTimer.classList.remove('active', 'warning', 'danger');
            
            const activeTimer = this.currentPlayer === 'red' ? redTimer : blackTimer;
            const activeTime = this.currentPlayer === 'red' ? this.redTimeLeft : this.blackTimeLeft;
            
            activeTimer.classList.add('active');
            
            if (activeTime <= 30) {
                activeTimer.classList.add('danger');
            } else if (activeTime <= 60) {
                activeTimer.classList.add('warning');
            }
        }
    }

    checkTimeWarnings() {
        const currentTime = this.currentPlayer === 'red' ? this.redTimeLeft : this.blackTimeLeft;
        
        // Play warning sounds
        if (currentTime === 60) {
            this.audioManager?.playTimerWarning();
        } else if (currentTime <= 30 && currentTime % 5 === 0) {
            this.audioManager?.playTimerDanger();
        } else if (currentTime <= 10) {
            this.audioManager?.playTimerDanger();
        }
    }

    timeUp() {
        this.gameState = 'ended';
        const loser = this.currentPlayer;
        const winner = loser === 'red' ? 'Đen' : 'Đỏ';
        
        // Stop timer
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        // Stop tense music
        this.audioManager?.stopTenseMusic();
        
        // Play game over sound
        this.audioManager?.playGameOverSound();
        
        this.showMessage('Hết giờ!', `⏰ Người chơi ${loser === 'red' ? 'Đỏ' : 'Đen'} đã hết thời gian!\n🎉 ${winner} thắng!`);
        
        document.getElementById('gameStatusInfo').textContent = `${winner} thắng (hết giờ)`;
        document.getElementById('newGameBtn').style.display = 'inline-block';
        
        // Add to chat
        this.addSystemMessage(`⏰ Hết giờ! ${winner} thắng!`);
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
}

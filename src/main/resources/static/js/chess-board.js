// Chess Board Management
class ChessBoard {
    constructor(containerId, config) {
        this.container = document.getElementById(containerId);
        this.config = config;
        this.board = [];
        this.selectedCell = null;
        this.validMoves = [];
        this.isPlayerTurn = false;
        this.onMoveCallback = null;
        this.onSelectCallback = null;
        
        this.init();
    }

    init() {
        if (!this.container) {
            console.error('Chess board container not found');
            return;
        }

        this.container.innerHTML = '';
        this.container.className = 'chess-board';
        
        // Create grid cells
        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < 9; col++) {
                const cell = this.createCell(row, col);
                this.container.appendChild(cell);
            }
        }

        // Add board decorations
        this.addBoardDecorations();
        
        // Parse and display initial board state
        if (this.config.initialBoardState) {
            this.updateBoard(this.config.initialBoardState);
        }
        
        this.updateTurnIndicator();
    }

    createCell(row, col) {
        const cell = document.createElement('div');
        cell.className = 'chess-cell';
        cell.dataset.row = row;
        cell.dataset.col = col;
        
        // Position the cell
        cell.style.left = `${col * 60}px`;
        cell.style.top = `${row * 60}px`;
        
        // Add click handler
        cell.addEventListener('click', (e) => this.handleCellClick(row, col, e));
        
        return cell;
    }

    addBoardDecorations() {
        // Add river decoration
        const river = document.createElement('div');
        river.className = 'board-river';
        river.style.position = 'absolute';
        river.style.top = '240px';
        river.style.left = '0';
        river.style.right = '0';
        river.style.height = '120px';
        river.style.background = 'linear-gradient(to bottom, transparent 0%, rgba(56, 178, 172, 0.2) 50%, transparent 100%)';
        river.style.pointerEvents = 'none';
        river.style.zIndex = '0';
        this.container.appendChild(river);

        // Add palace markings
        this.addPalaceLines();
        
        // Add coordinate labels
        this.addCoordinateLabels();
    }

    addPalaceLines() {
        // Red palace
        const redPalace = document.createElement('div');
        redPalace.className = 'palace-lines red-palace';
        redPalace.innerHTML = `
            <svg width="180" height="180" style="position: absolute; top: 420px; left: 180px; pointer-events: none; z-index: 1;">
                <line x1="0" y1="0" x2="180" y2="180" stroke="#8B4513" stroke-width="2"/>
                <line x1="180" y1="0" x2="0" y2="180" stroke="#8B4513" stroke-width="2"/>
            </svg>
        `;
        this.container.appendChild(redPalace);

        // Black palace  
        const blackPalace = document.createElement('div');
        blackPalace.className = 'palace-lines black-palace';
        blackPalace.innerHTML = `
            <svg width="180" height="180" style="position: absolute; top: 0px; left: 180px; pointer-events: none; z-index: 1;">
                <line x1="0" y1="0" x2="180" y2="180" stroke="#8B4513" stroke-width="2"/>
                <line x1="180" y1="0" x2="0" y2="180" stroke="#8B4513" stroke-width="2"/>
            </svg>
        `;
        this.container.appendChild(blackPalace);
    }

    addCoordinateLabels() {
        // Add row numbers (1-10)
        for (let row = 0; row < 10; row++) {
            const label = document.createElement('div');
            label.className = 'coordinate-label row-label';
            label.textContent = row + 1;
            label.style.position = 'absolute';
            label.style.left = '-25px';
            label.style.top = `${row * 60 + 20}px`;
            label.style.fontSize = '12px';
            label.style.color = '#8B4513';
            label.style.fontWeight = 'bold';
            this.container.appendChild(label);
        }

        // Add column letters (a-i)
        const columns = 'abcdefghi';
        for (let col = 0; col < 9; col++) {
            const label = document.createElement('div');
            label.className = 'coordinate-label col-label';
            label.textContent = columns[col];
            label.style.position = 'absolute';
            label.style.left = `${col * 60 + 25}px`;
            label.style.top = '-25px';
            label.style.fontSize = '12px';
            label.style.color = '#8B4513';
            label.style.fontWeight = 'bold';
            this.container.appendChild(label);
        }
    }

    updateBoard(boardState) {
        // Parse board state string
        this.board = this.parseBoardState(boardState);
        
        // Clear all pieces
        this.container.querySelectorAll('.chess-piece').forEach(piece => piece.remove());
        
        // Place pieces on board
        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < 9; col++) {
                const pieceType = this.board[row][col];
                if (pieceType && pieceType !== 'empty') {
                    this.placePiece(pieceType, row, col);
                }
            }
        }
        
        this.clearSelection();
    }

    parseBoardState(boardState) {
        const board = [];
        const rows = boardState.split(';');
        
        for (let i = 0; i < 10; i++) {
            board[i] = [];
            if (i < rows.length) {
                const cols = rows[i].split(',');
                for (let j = 0; j < 9; j++) {
                    board[i][j] = j < cols.length ? cols[j] : 'empty';
                }
            } else {
                for (let j = 0; j < 9; j++) {
                    board[i][j] = 'empty';
                }
            }
        }
        
        return board;
    }

    placePiece(pieceType, row, col) {
        const cell = this.getCell(row, col);
        if (!cell) return;

        const piece = window.ChessPieces.createPieceElement(pieceType, row, col);
        if (piece) {
            cell.appendChild(piece);
        }
    }

    getCell(row, col) {
        return this.container.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    }

    getPieceAt(row, col) {
        const cell = this.getCell(row, col);
        const piece = cell?.querySelector('.chess-piece');
        return piece?.dataset.piece || 'empty';
    }

    handleCellClick(row, col, event) {
        event.stopPropagation();
        
        if (!this.isPlayerTurn) {
            return;
        }

        const cell = this.getCell(row, col);
        const piece = this.getPieceAt(row, col);
        
        // If clicking on valid move destination
        if (this.selectedCell && this.isValidMoveDestination(row, col)) {
            this.makeMove(this.selectedCell.row, this.selectedCell.col, row, col);
            return;
        }
        
        // If clicking on own piece
        if (piece !== 'empty' && this.isOwnPiece(piece)) {
            this.selectCell(row, col);
            this.requestValidMoves(row, col);
            return;
        }
        
        // Clear selection if clicking elsewhere
        this.clearSelection();
    }

    selectCell(row, col) {
        this.clearSelection();
        
        const cell = this.getCell(row, col);
        if (cell) {
            cell.classList.add('selected');
            this.selectedCell = { row, col };
            
            const piece = cell.querySelector('.chess-piece');
            if (piece) {
                window.ChessPieces.highlightPiece(piece, true);
            }
        }

        if (this.onSelectCallback) {
            this.onSelectCallback(row, col);
        }
    }

    clearSelection() {
        // Remove selected class
        this.container.querySelectorAll('.selected').forEach(cell => {
            cell.classList.remove('selected');
        });
        
        // Remove piece highlights
        this.container.querySelectorAll('.chess-piece').forEach(piece => {
            window.ChessPieces.highlightPiece(piece, false);
        });
        
        // Clear valid moves
        this.clearValidMoves();
        
        this.selectedCell = null;
    }

    clearValidMoves() {
        this.container.querySelectorAll('.valid-move').forEach(cell => {
            cell.classList.remove('valid-move', 'capture');
        });
        this.validMoves = [];
    }

    showValidMoves(moves) {
        this.clearValidMoves();
        this.validMoves = moves;
        
        moves.forEach(([row, col]) => {
            const cell = this.getCell(row, col);
            if (cell) {
                cell.classList.add('valid-move');
                
                // Check if this is a capture move
                const targetPiece = this.getPieceAt(row, col);
                if (targetPiece !== 'empty') {
                    cell.classList.add('capture');
                }
            }
        });
    }

    isValidMoveDestination(row, col) {
        return this.validMoves.some(([r, c]) => r === row && c === col);
    }

    isOwnPiece(pieceType) {
        if (!pieceType || pieceType === 'empty') return false;
        
        const pieceColor = window.ChessPieces.getPieceColor(pieceType);
        const playerColor = this.config.playerColor?.toLowerCase();
        
        return pieceColor === playerColor;
    }

    makeMove(fromRow, fromCol, toRow, toCol) {
        if (!this.onMoveCallback) return;
        
        const move = {
            fromRow,
            fromCol,
            toRow,
            toCol,
            playerId: this.config.playerId,
            roomCode: this.config.roomCode
        };
        
        this.onMoveCallback(move);
    }

    requestValidMoves(row, col) {
        if (window.gameWebSocket && window.gameWebSocket.requestValidMoves) {
            window.gameWebSocket.requestValidMoves(row, col);
        }
    }

    highlightLastMove(fromRow, fromCol, toRow, toCol) {
        // Remove previous last-move highlights
        this.container.querySelectorAll('.last-move').forEach(cell => {
            cell.classList.remove('last-move');
        });
        
        // Add new highlights
        const fromCell = this.getCell(fromRow, fromCol);
        const toCell = this.getCell(toRow, toCol);
        
        if (fromCell) fromCell.classList.add('last-move');
        if (toCell) toCell.classList.add('last-move');
    }

    highlightCheck(kingRow, kingCol) {
        // Remove previous check highlights
        this.container.querySelectorAll('.in-check').forEach(cell => {
            cell.classList.remove('in-check');
        });
        
        // Add check highlight
        if (kingRow !== undefined && kingCol !== undefined) {
            const kingCell = this.getCell(kingRow, kingCol);
            if (kingCell) {
                kingCell.classList.add('in-check');
            }
        }
    }

    setPlayerTurn(isPlayerTurn) {
        this.isPlayerTurn = isPlayerTurn;
        
        if (!isPlayerTurn) {
            this.clearSelection();
        }
        
        // Visual feedback
        this.container.style.cursor = isPlayerTurn ? 'pointer' : 'not-allowed';
        this.container.style.opacity = isPlayerTurn ? '1' : '0.8';
    }

    updateTurnIndicator() {
        const turnText = document.getElementById('currentTurnText');
        if (turnText) {
            const currentTurn = this.config.currentTurn === 'RED' ? 'Đỏ' : 'Đen';
            const isMyTurn = this.config.currentTurn?.toLowerCase() === this.config.playerColor?.toLowerCase();
            
            turnText.textContent = isMyTurn ? 'Lượt của bạn' : `Lượt của ${currentTurn}`;
            turnText.style.color = isMyTurn ? '#48bb78' : '#e53e3e';
        }
    }

    // Event handlers
    onMove(callback) {
        this.onMoveCallback = callback;
    }

    onSelect(callback) {
        this.onSelectCallback = callback;
    }

    // Utility methods
    getCellPosition(row, col) {
        return {
            x: col * 60 + 30,
            y: row * 60 + 30
        };
    }

    getBoardState() {
        return this.board;
    }

    resize() {
        // Handle responsive resizing if needed
        const containerWidth = this.container.parentElement.clientWidth;
        const maxWidth = Math.min(containerWidth - 40, 540);
        
        if (maxWidth < 540) {
            const scale = maxWidth / 540;
            this.container.style.transform = `scale(${scale})`;
            this.container.style.transformOrigin = 'top left';
        } else {
            this.container.style.transform = '';
        }
    }
}

// Export ChessBoard class
window.ChessBoard = ChessBoard;

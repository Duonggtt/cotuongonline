// Chess Pieces Configuration
const PIECE_SYMBOLS = {
    // Red pieces (Đỏ)
    'king_r': '帥',
    'guard_r': '仕', 
    'elephant_r': '相',
    'horse_r': '馬',
    'rook_r': '車',
    'cannon_r': '炮',
    'pawn_r': '兵',
    
    // Black pieces (Đen)
    'king_b': '將',
    'guard_b': '士',
    'elephant_b': '象', 
    'horse_b': '馬',
    'rook_b': '車',
    'cannon_b': '砲',
    'pawn_b': '卒'
};

const PIECE_NAMES = {
    'king_r': 'Tướng Đỏ',
    'guard_r': 'Sĩ Đỏ',
    'elephant_r': 'Tượng Đỏ',
    'horse_r': 'Mã Đỏ', 
    'rook_r': 'Xe Đỏ',
    'cannon_r': 'Pháo Đỏ',
    'pawn_r': 'Tốt Đỏ',
    
    'king_b': 'Tướng Đen',
    'guard_b': 'Sĩ Đen',
    'elephant_b': 'Tượng Đen',
    'horse_b': 'Mã Đen',
    'rook_b': 'Xe Đen', 
    'cannon_b': 'Pháo Đen',
    'pawn_b': 'Tốt Đen'
};

function getPieceSymbol(pieceType) {
    return PIECE_SYMBOLS[pieceType] || '';
}

function getPieceName(pieceType) {
    return PIECE_NAMES[pieceType] || pieceType;
}

function getPieceColor(pieceType) {
    if (pieceType.endsWith('_r')) return 'red';
    if (pieceType.endsWith('_b')) return 'black';
    return null;
}

function getPieceType(pieceType) {
    if (pieceType.includes('_')) {
        return pieceType.substring(0, pieceType.lastIndexOf('_'));
    }
    return pieceType;
}

function createPieceElement(pieceType, row, col) {
    if (!pieceType || pieceType === 'empty') {
        return null;
    }

    const piece = document.createElement('div');
    piece.className = `chess-piece ${getPieceColor(pieceType)}`;
    piece.textContent = getPieceSymbol(pieceType);
    piece.title = getPieceName(pieceType);
    piece.dataset.piece = pieceType;
    piece.dataset.row = row;
    piece.dataset.col = col;

    // Add piece-specific classes for CSS styling
    const type = getPieceType(pieceType);
    piece.classList.add(`piece-${type}`);

    return piece;
}

// Sound effects for different piece actions
function playMoveSound(isCapture = false) {
    const soundId = isCapture ? 'captureSoundEffect' : 'moveSoundEffect';
    const audio = document.getElementById(soundId);
    
    if (audio) {
        audio.currentTime = 0;
        audio.play().catch(err => {
            console.log('Could not play sound:', err);
        });
    }
}

// Visual effects for pieces
function animatePieceMove(piece, fromRow, fromCol, toRow, toCol) {
    if (!piece) return;

    const fromCell = document.querySelector(`[data-row="${fromRow}"][data-col="${fromCol}"]`);
    const toCell = document.querySelector(`[data-row="${toRow}"][data-col="${toCol}"]`);
    
    if (!fromCell || !toCell) return;

    const fromRect = fromCell.getBoundingClientRect();
    const toRect = toCell.getBoundingClientRect();
    
    const deltaX = toRect.left - fromRect.left;
    const deltaY = toRect.top - fromRect.top;

    piece.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    piece.style.transition = 'transform 0.3s ease';
    
    setTimeout(() => {
        piece.style.transform = '';
        piece.style.transition = '';
    }, 300);
}

function highlightPiece(piece, highlight = true) {
    if (!piece) return;
    
    if (highlight) {
        piece.classList.add('highlighted');
        piece.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.8)';
        piece.style.transform = 'scale(1.1)';
    } else {
        piece.classList.remove('highlighted');
        piece.style.boxShadow = '';
        piece.style.transform = '';
    }
}

// Piece movement validation helpers
function canPieceMoveTo(pieceType, fromRow, fromCol, toRow, toCol, board) {
    const type = getPieceType(pieceType);
    const color = getPieceColor(pieceType);
    
    // Basic bounds checking
    if (toRow < 0 || toRow >= 10 || toCol < 0 || toCol >= 9) {
        return false;
    }
    
    // Can't capture own pieces
    const targetPiece = board[toRow][toCol];
    if (targetPiece && targetPiece !== 'empty' && getPieceColor(targetPiece) === color) {
        return false;
    }
    
    // Piece-specific movement rules would be validated server-side
    // This is just for basic client-side feedback
    return true;
}

// Get all possible moves for a piece (for highlighting)
function getPossibleMoves(pieceType, fromRow, fromCol, board) {
    const moves = [];
    
    // This would normally call the server for accurate move calculation
    // For now, we'll show basic movement possibilities
    for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 9; col++) {
            if (row === fromRow && col === fromCol) continue;
            if (canPieceMoveTo(pieceType, fromRow, fromCol, row, col, board)) {
                moves.push([row, col]);
            }
        }
    }
    
    return moves;
}

// Piece value for captured pieces display
function getPieceValue(pieceType) {
    const type = getPieceType(pieceType);
    const values = {
        'king': 1000,
        'guard': 20,
        'elephant': 20,
        'horse': 40,
        'rook': 90,
        'cannon': 45,
        'pawn': 10
    };
    return values[type] || 0;
}

// Check if piece is in enemy territory
function isInEnemyTerritory(pieceType, row) {
    const color = getPieceColor(pieceType);
    if (color === 'red') {
        return row <= 4; // Red pieces in black's half
    } else {
        return row >= 5; // Black pieces in red's half
    }
}

// Special position checks
function isInPalace(row, col, color) {
    if (color === 'red') {
        return row >= 7 && row <= 9 && col >= 3 && col <= 5;
    } else {
        return row >= 0 && row <= 2 && col >= 3 && col <= 5;
    }
}

function isOnRiver(row) {
    return row === 4 || row === 5;
}

// Export functions for use in other modules
window.ChessPieces = {
    getPieceSymbol,
    getPieceName,
    getPieceColor,
    getPieceType,
    createPieceElement,
    playMoveSound,
    animatePieceMove,
    highlightPiece,
    canPieceMoveTo,
    getPossibleMoves,
    getPieceValue,
    isInEnemyTerritory,
    isInPalace,
    isOnRiver,
    PIECE_SYMBOLS,
    PIECE_NAMES
};

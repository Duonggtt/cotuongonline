package com.cotuong.service;

import com.cotuong.model.PlayerColor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ChessLogicService {
    
    private static final int BOARD_ROWS = 10;
    private static final int BOARD_COLS = 9;

    public String[][] parseBoardState(String boardState) {
        String[][] board = new String[BOARD_ROWS][BOARD_COLS];
        String[] rows = boardState.split(";");
        
        for (int i = 0; i < BOARD_ROWS && i < rows.length; i++) {
            String[] cols = rows[i].split(",");
            for (int j = 0; j < BOARD_COLS && j < cols.length; j++) {
                board[i][j] = cols[j];
            }
        }
        return board;
    }

    public String boardToString(String[][] board) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < BOARD_ROWS; i++) {
            for (int j = 0; j < BOARD_COLS; j++) {
                if (j > 0) sb.append(",");
                sb.append(board[i][j] != null ? board[i][j] : "empty");
            }
            if (i < BOARD_ROWS - 1) sb.append(";");
        }
        return sb.toString();
    }

    public boolean isValidMove(String[][] board, int fromRow, int fromCol, int toRow, int toCol, PlayerColor playerColor) {
        // Kiểm tra ranh giới bàn cờ
        if (!isInBounds(fromRow, fromCol) || !isInBounds(toRow, toCol)) {
            return false;
        }

        String piece = board[fromRow][fromCol];
        if (piece == null || piece.equals("empty")) {
            return false;
        }

        // Kiểm tra quân cờ có thuộc về người chơi không
        PlayerColor pieceColor = getPieceColor(piece);
        if (pieceColor != playerColor) {
            return false;
        }

        // Kiểm tra không ăn quân cùng màu
        String targetPiece = board[toRow][toCol];
        if (targetPiece != null && !targetPiece.equals("empty")) {
            PlayerColor targetColor = getPieceColor(targetPiece);
            if (targetColor == pieceColor) {
                return false;
            }
        }

        // Kiểm tra nước đi hợp lệ theo từng loại quân
        String pieceType = getPieceType(piece);
        
        switch (pieceType) {
            case "king":
                return isValidKingMove(board, fromRow, fromCol, toRow, toCol, pieceColor);
            case "guard":
                return isValidGuardMove(board, fromRow, fromCol, toRow, toCol, pieceColor);
            case "elephant":
                return isValidElephantMove(board, fromRow, fromCol, toRow, toCol, pieceColor);
            case "horse":
                return isValidHorseMove(board, fromRow, fromCol, toRow, toCol);
            case "rook":
                return isValidRookMove(board, fromRow, fromCol, toRow, toCol);
            case "cannon":
                return isValidCannonMove(board, fromRow, fromCol, toRow, toCol);
            case "pawn":
                return isValidPawnMove(board, fromRow, fromCol, toRow, toCol, pieceColor);
            default:
                return false;
        }
    }

    private boolean isInBounds(int row, int col) {
        return row >= 0 && row < BOARD_ROWS && col >= 0 && col < BOARD_COLS;
    }

    private PlayerColor getPieceColor(String piece) {
        if (piece.endsWith("_r")) return PlayerColor.RED;
        if (piece.endsWith("_b")) return PlayerColor.BLACK;
        return null;
    }

    private String getPieceType(String piece) {
        if (piece.contains("_")) {
            return piece.substring(0, piece.lastIndexOf("_"));
        }
        return piece;
    }

    private boolean isValidKingMove(String[][] board, int fromRow, int fromCol, int toRow, int toCol, PlayerColor color) {
        // Tướng chỉ được di chuyển trong cung
        boolean inPalace = isInPalace(toRow, toCol, color);
        if (!inPalace) return false;

        // Chỉ được di chuyển 1 ô theo hướng ngang hoặc dọc
        int rowDiff = Math.abs(toRow - fromRow);
        int colDiff = Math.abs(toCol - fromCol);
        
        if ((rowDiff == 1 && colDiff == 0) || (rowDiff == 0 && colDiff == 1)) {
            return true;
        }

        // Kiểm tra tướng đối mặt (không có quân nào ở giữa)
        String targetPiece = board[toRow][toCol];
        if (targetPiece != null && getPieceType(targetPiece).equals("king")) {
            if (fromCol == toCol) {
                // Cùng cột, kiểm tra không có quân nào ở giữa
                int startRow = Math.min(fromRow, toRow) + 1;
                int endRow = Math.max(fromRow, toRow);
                for (int r = startRow; r < endRow; r++) {
                    if (!board[r][fromCol].equals("empty")) {
                        return false;
                    }
                }
                return true;
            }
        }

        return false;
    }

    private boolean isValidGuardMove(String[][] board, int fromRow, int fromCol, int toRow, int toCol, PlayerColor color) {
        // Sĩ chỉ được di chuyển trong cung theo đường chéo
        if (!isInPalace(toRow, toCol, color)) return false;

        int rowDiff = Math.abs(toRow - fromRow);
        int colDiff = Math.abs(toCol - fromCol);
        
        return rowDiff == 1 && colDiff == 1;
    }

    private boolean isValidElephantMove(String[][] board, int fromRow, int fromCol, int toRow, int toCol, PlayerColor color) {
        // Tượng không được qua sông
        if ((color == PlayerColor.RED && toRow > 4) || (color == PlayerColor.BLACK && toRow < 5)) {
            return false;
        }

        int rowDiff = toRow - fromRow;
        int colDiff = toCol - fromCol;
        
        // Di chuyển đúng hình tượng (2 ô chéo)
        if (Math.abs(rowDiff) == 2 && Math.abs(colDiff) == 2) {
            // Kiểm tra không bị chặn
            int blockRow = fromRow + rowDiff / 2;
            int blockCol = fromCol + colDiff / 2;
            return board[blockRow][blockCol].equals("empty");
        }
        
        return false;
    }

    private boolean isValidHorseMove(String[][] board, int fromRow, int fromCol, int toRow, int toCol) {
        int rowDiff = Math.abs(toRow - fromRow);
        int colDiff = Math.abs(toCol - fromCol);
        
        // Nước đi hình chữ L
        if ((rowDiff == 2 && colDiff == 1) || (rowDiff == 1 && colDiff == 2)) {
            // Kiểm tra bị chặn chân
            if (rowDiff == 2) {
                int blockRow = fromRow + (toRow > fromRow ? 1 : -1);
                return board[blockRow][fromCol].equals("empty");
            } else {
                int blockCol = fromCol + (toCol > fromCol ? 1 : -1);
                return board[fromRow][blockCol].equals("empty");
            }
        }
        
        return false;
    }

    private boolean isValidRookMove(String[][] board, int fromRow, int fromCol, int toRow, int toCol) {
        // Xe di chuyển theo đường thẳng
        if (fromRow != toRow && fromCol != toCol) return false;

        // Kiểm tra đường đi không bị chặn
        if (fromRow == toRow) {
            int start = Math.min(fromCol, toCol) + 1;
            int end = Math.max(fromCol, toCol);
            for (int c = start; c < end; c++) {
                if (!board[fromRow][c].equals("empty")) {
                    return false;
                }
            }
        } else {
            int start = Math.min(fromRow, toRow) + 1;
            int end = Math.max(fromRow, toRow);
            for (int r = start; r < end; r++) {
                if (!board[r][fromCol].equals("empty")) {
                    return false;
                }
            }
        }
        
        return true;
    }

    private boolean isValidCannonMove(String[][] board, int fromRow, int fromCol, int toRow, int toCol) {
        // Pháo di chuyển theo đường thẳng
        if (fromRow != toRow && fromCol != toCol) return false;

        String targetPiece = board[toRow][toCol];
        boolean isCapture = !targetPiece.equals("empty");

        int piecesBetween = 0;
        
        if (fromRow == toRow) {
            int start = Math.min(fromCol, toCol) + 1;
            int end = Math.max(fromCol, toCol);
            for (int c = start; c < end; c++) {
                if (!board[fromRow][c].equals("empty")) {
                    piecesBetween++;
                }
            }
        } else {
            int start = Math.min(fromRow, toRow) + 1;
            int end = Math.max(fromRow, toRow);
            for (int r = start; r < end; r++) {
                if (!board[r][fromCol].equals("empty")) {
                    piecesBetween++;
                }
            }
        }

        // Pháo cần có đúng 1 quân làm giá để ăn, hoặc 0 quân để di chuyển
        return (isCapture && piecesBetween == 1) || (!isCapture && piecesBetween == 0);
    }

    private boolean isValidPawnMove(String[][] board, int fromRow, int fromCol, int toRow, int toCol, PlayerColor color) {
        int rowDiff = toRow - fromRow;
        int colDiff = Math.abs(toCol - fromCol);
        
        // Tốt chỉ được đi thẳng về phía trước
        if (color == PlayerColor.RED) {
            if (fromRow <= 4) {
                // Chưa qua sông, chỉ đi thẳng
                return rowDiff == 1 && colDiff == 0;
            } else {
                // Đã qua sông, có thể đi ngang
                return (rowDiff == 1 && colDiff == 0) || (rowDiff == 0 && colDiff == 1);
            }
        } else {
            if (fromRow >= 5) {
                // Chưa qua sông, chỉ đi thẳng
                return rowDiff == -1 && colDiff == 0;
            } else {
                // Đã qua sông, có thể đi ngang
                return (rowDiff == -1 && colDiff == 0) || (rowDiff == 0 && colDiff == 1);
            }
        }
    }

    private boolean isInPalace(int row, int col, PlayerColor color) {
        if (color == PlayerColor.RED) {
            return row >= 7 && row <= 9 && col >= 3 && col <= 5;
        } else {
            return row >= 0 && row <= 2 && col >= 3 && col <= 5;
        }
    }

    public boolean isInCheck(String[][] board, PlayerColor kingColor) {
        // Tìm vị trí tướng
        int kingRow = -1, kingCol = -1;
        String kingPiece = "king_" + (kingColor == PlayerColor.RED ? "r" : "b");
        
        for (int r = 0; r < BOARD_ROWS; r++) {
            for (int c = 0; c < BOARD_COLS; c++) {
                if (kingPiece.equals(board[r][c])) {
                    kingRow = r;
                    kingCol = c;
                    break;
                }
            }
            if (kingRow != -1) break;
        }
        
        if (kingRow == -1) return false; // Không tìm thấy tướng
        
        // Kiểm tra tất cả quân địch có thể ăn tướng không
        PlayerColor opponentColor = kingColor == PlayerColor.RED ? PlayerColor.BLACK : PlayerColor.RED;
        
        for (int r = 0; r < BOARD_ROWS; r++) {
            for (int c = 0; c < BOARD_COLS; c++) {
                String piece = board[r][c];
                if (!piece.equals("empty") && getPieceColor(piece) == opponentColor) {
                    if (isValidMove(board, r, c, kingRow, kingCol, opponentColor)) {
                        return true;
                    }
                }
            }
        }
        
        return false;
    }

    public List<int[]> getValidMoves(String[][] board, int fromRow, int fromCol, PlayerColor playerColor) {
        List<int[]> validMoves = new ArrayList<>();
        
        for (int toRow = 0; toRow < BOARD_ROWS; toRow++) {
            for (int toCol = 0; toCol < BOARD_COLS; toCol++) {
                if (isValidMove(board, fromRow, fromCol, toRow, toCol, playerColor)) {
                    // Kiểm tra nước đi này có khiến mình bị chiếu không
                    String[][] tempBoard = copyBoard(board);
                    tempBoard[toRow][toCol] = tempBoard[fromRow][fromCol];
                    tempBoard[fromRow][fromCol] = "empty";
                    
                    if (!isInCheck(tempBoard, playerColor)) {
                        validMoves.add(new int[]{toRow, toCol});
                    }
                }
            }
        }
        
        return validMoves;
    }

    private String[][] copyBoard(String[][] board) {
        String[][] copy = new String[BOARD_ROWS][BOARD_COLS];
        for (int i = 0; i < BOARD_ROWS; i++) {
            System.arraycopy(board[i], 0, copy[i], 0, BOARD_COLS);
        }
        return copy;
    }

    public boolean isCheckmate(String[][] board, PlayerColor playerColor) {
        // Kiểm tra tất cả các nước đi có thể của người chơi
        for (int fromRow = 0; fromRow < BOARD_ROWS; fromRow++) {
            for (int fromCol = 0; fromCol < BOARD_COLS; fromCol++) {
                String piece = board[fromRow][fromCol];
                if (!piece.equals("empty") && getPieceColor(piece) == playerColor) {
                    List<int[]> validMoves = getValidMoves(board, fromRow, fromCol, playerColor);
                    if (!validMoves.isEmpty()) {
                        return false; // Còn nước đi hợp lệ
                    }
                }
            }
        }
        return true; // Không còn nước đi nào
    }
}

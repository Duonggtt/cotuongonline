package com.cotuong.service;

import com.cotuong.dto.GameMove;
import com.cotuong.dto.GameStateUpdate;
import com.cotuong.model.GameRoom;
import com.cotuong.model.GameStatus;
import com.cotuong.model.Player;
import com.cotuong.model.PlayerColor;
import com.cotuong.repository.GameRoomRepository;
import com.cotuong.repository.PlayerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
public class GameService {
    
    @Autowired
    private GameRoomRepository gameRoomRepository;
    
    @Autowired
    private PlayerRepository playerRepository;
    
    @Autowired
    private ChessLogicService chessLogicService;

    public GameRoom createRoom() {
        GameRoom room = new GameRoom();
        // Đảm bảo room code là duy nhất
        while (gameRoomRepository.existsByRoomCode(room.getRoomCode())) {
            room.setRoomCode(generateUniqueRoomCode());
        }
        return gameRoomRepository.save(room);
    }

    public Optional<GameRoom> joinRoom(String roomCode, String playerId, String playerName) {
        Optional<GameRoom> roomOpt = gameRoomRepository.findByRoomCode(roomCode);
        if (roomOpt.isEmpty()) {
            return Optional.empty();
        }

        GameRoom room = roomOpt.get();
        if (!room.canJoin()) {
            return Optional.empty();
        }

        // Tạo hoặc cập nhật player
        Player player = playerRepository.findById(playerId).orElse(new Player());
        player.setId(playerId);
        player.setDisplayName(playerName);
        playerRepository.save(player);

        // Gán người chơi vào phòng
        if (room.getPlayerRedId() == null) {
            room.setPlayerRedId(playerId);
        } else if (room.getPlayerBlackId() == null) {
            room.setPlayerBlackId(playerId);
        }

        // Nếu đủ 2 người chơi, bắt đầu game
        if (room.isFull()) {
            room.setGameStatus(GameStatus.IN_PROGRESS);
        }

        return Optional.of(gameRoomRepository.save(room));
    }

    public Optional<GameRoom> getRoomByCode(String roomCode) {
        return gameRoomRepository.findByRoomCode(roomCode);
    }

    public GameStateUpdate makeMove(GameMove move) {
        Optional<GameRoom> roomOpt = gameRoomRepository.findByRoomCode(move.getRoomCode());
        if (roomOpt.isEmpty()) {
            return null;
        }

        GameRoom room = roomOpt.get();
        
        // Kiểm tra trạng thái game
        if (room.getGameStatus() != GameStatus.IN_PROGRESS) {
            return null;
        }

        // Kiểm tra lượt chơi
        PlayerColor playerColor = room.getPlayerColor(move.getPlayerId());
        if (playerColor == null || playerColor != room.getCurrentTurn()) {
            return null;
        }

        // Parse board state
        String[][] board = chessLogicService.parseBoardState(room.getBoardState());

        // Kiểm tra nước đi hợp lệ
        if (!chessLogicService.isValidMove(board, move.getFromRow(), move.getFromCol(), 
                                          move.getToRow(), move.getToCol(), playerColor)) {
            return null;
        }

        // Thực hiện nước đi
        String capturedPiece = board[move.getToRow()][move.getToCol()];
        board[move.getToRow()][move.getToCol()] = board[move.getFromRow()][move.getFromCol()];
        board[move.getFromRow()][move.getFromCol()] = "empty";

        // Kiểm tra sau khi đi có bị chiếu không
        if (chessLogicService.isInCheck(board, playerColor)) {
            return null; // Nước đi không hợp lệ vì làm mình bị chiếu
        }

        // Cập nhật board state
        String newBoardState = chessLogicService.boardToString(board);
        room.setBoardState(newBoardState);

        // Cập nhật move history
        String moveNotation = String.format("%s: (%d,%d)->(%d,%d)", 
                playerColor == PlayerColor.RED ? "Đỏ" : "Đen",
                move.getFromRow(), move.getFromCol(), move.getToRow(), move.getToCol());
        
        if (!capturedPiece.equals("empty")) {
            moveNotation += " [ăn " + capturedPiece + "]";
        }

        String currentHistory = room.getMoveHistory();
        String newHistory = currentHistory.isEmpty() ? moveNotation : currentHistory + "\n" + moveNotation;
        room.setMoveHistory(newHistory);

        // Chuyển lượt
        PlayerColor nextTurn = playerColor == PlayerColor.RED ? PlayerColor.BLACK : PlayerColor.RED;
        room.setCurrentTurn(nextTurn);

        // Kiểm tra chiếu tướng và chiếu bí
        boolean inCheck = chessLogicService.isInCheck(board, nextTurn);
        boolean isCheckmate = false;
        
        if (inCheck) {
            isCheckmate = chessLogicService.isCheckmate(board, nextTurn);
            if (isCheckmate) {
                room.setGameStatus(playerColor == PlayerColor.RED ? 
                    GameStatus.FINISHED_RED_WIN : GameStatus.FINISHED_BLACK_WIN);
            }
        }

        // Lưu room
        gameRoomRepository.save(room);

        // Tạo update response
        GameStateUpdate update = new GameStateUpdate(room.getRoomCode(), newBoardState, 
                                                   room.getCurrentTurn(), room.getGameStatus(), 
                                                   room.getMoveHistory());
        update.setLastMove(moveNotation);
        update.setInCheck(inCheck);
        
        if (isCheckmate) {
            update.setWinner(playerColor == PlayerColor.RED ? "Đỏ" : "Đen");
        }

        return update;
    }

    public GameStateUpdate surrender(String roomCode, String playerId) {
        Optional<GameRoom> roomOpt = gameRoomRepository.findByRoomCode(roomCode);
        if (roomOpt.isEmpty()) {
            return null;
        }

        GameRoom room = roomOpt.get();
        PlayerColor playerColor = room.getPlayerColor(playerId);
        if (playerColor == null) {
            return null;
        }

        room.setGameStatus(GameStatus.FINISHED_SURRENDER);
        gameRoomRepository.save(room);

        GameStateUpdate update = new GameStateUpdate(room.getRoomCode(), room.getBoardState(), 
                                                   room.getCurrentTurn(), room.getGameStatus(), 
                                                   room.getMoveHistory());
        update.setWinner(playerColor == PlayerColor.RED ? "Đen" : "Đỏ");
        return update;
    }

    public List<int[]> getValidMoves(String roomCode, int fromRow, int fromCol, String playerId) {
        Optional<GameRoom> roomOpt = gameRoomRepository.findByRoomCode(roomCode);
        if (roomOpt.isEmpty()) {
            return List.of();
        }

        GameRoom room = roomOpt.get();
        PlayerColor playerColor = room.getPlayerColor(playerId);
        if (playerColor == null || playerColor != room.getCurrentTurn()) {
            return List.of();
        }

        String[][] board = chessLogicService.parseBoardState(room.getBoardState());
        return chessLogicService.getValidMoves(board, fromRow, fromCol, playerColor);
    }

    private String generateUniqueRoomCode() {
        Random random = new Random();
        return String.format("%06d", random.nextInt(1000000));
    }

    public String generatePlayerName() {
        String[] adjectives = {"Dũng", "Thông", "Minh", "Khôn", "Nhanh", "Mạnh", "Lanh", "Giỏi"};
        String[] nouns = {"Tướng", "Sĩ", "Tượng", "Mã", "Xe", "Pháo", "Tốt"};
        
        Random random = new Random();
        String adj = adjectives[random.nextInt(adjectives.length)];
        String noun = nouns[random.nextInt(nouns.length)];
        int number = random.nextInt(999) + 1;
        
        return adj + noun + number;
    }
}

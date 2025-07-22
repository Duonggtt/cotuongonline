package com.cotuong.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "game_rooms")
public class GameRoom {
    @Id
    private String id;
    
    @Column(name = "room_code", unique = true, nullable = false)
    private String roomCode;
    
    @Column(name = "player_red_id")
    private String playerRedId;
    
    @Column(name = "player_black_id")
    private String playerBlackId;
    
    @Column(name = "current_turn")
    @Enumerated(EnumType.STRING)
    private PlayerColor currentTurn;
    
    @Column(name = "game_status")
    @Enumerated(EnumType.STRING)
    private GameStatus gameStatus;
    
    @Column(name = "board_state", columnDefinition = "TEXT")
    private String boardState;
    
    @Column(name = "move_history", columnDefinition = "TEXT")
    private String moveHistory;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public GameRoom() {
        this.id = UUID.randomUUID().toString();
        this.roomCode = generateRoomCode();
        this.currentTurn = PlayerColor.RED;
        this.gameStatus = GameStatus.WAITING;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.boardState = initializeBoardState();
        this.moveHistory = "";
    }

    private String generateRoomCode() {
        return String.format("%06d", (int)(Math.random() * 1000000));
    }

    private String initializeBoardState() {
        // Khởi tạo bàn cờ ban đầu
        return "rook_r,horse_r,elephant_r,guard_r,king_r,guard_r,elephant_r,horse_r,rook_r;" +
               "empty,empty,empty,empty,empty,empty,empty,empty,empty;" +
               "empty,cannon_r,empty,empty,empty,empty,empty,cannon_r,empty;" +
               "pawn_r,empty,pawn_r,empty,pawn_r,empty,pawn_r,empty,pawn_r;" +
               "empty,empty,empty,empty,empty,empty,empty,empty,empty;" +
               "empty,empty,empty,empty,empty,empty,empty,empty,empty;" +
               "pawn_b,empty,pawn_b,empty,pawn_b,empty,pawn_b,empty,pawn_b;" +
               "empty,cannon_b,empty,empty,empty,empty,empty,cannon_b,empty;" +
               "empty,empty,empty,empty,empty,empty,empty,empty,empty;" +
               "rook_b,horse_b,elephant_b,guard_b,king_b,guard_b,elephant_b,horse_b,rook_b";
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getRoomCode() { return roomCode; }
    public void setRoomCode(String roomCode) { this.roomCode = roomCode; }
    
    public String getPlayerRedId() { return playerRedId; }
    public void setPlayerRedId(String playerRedId) { this.playerRedId = playerRedId; }
    
    public String getPlayerBlackId() { return playerBlackId; }
    public void setPlayerBlackId(String playerBlackId) { this.playerBlackId = playerBlackId; }
    
    public PlayerColor getCurrentTurn() { return currentTurn; }
    public void setCurrentTurn(PlayerColor currentTurn) { 
        this.currentTurn = currentTurn;
        this.updatedAt = LocalDateTime.now();
    }
    
    public GameStatus getGameStatus() { return gameStatus; }
    public void setGameStatus(GameStatus gameStatus) { 
        this.gameStatus = gameStatus;
        this.updatedAt = LocalDateTime.now();
    }
    
    public String getBoardState() { return boardState; }
    public void setBoardState(String boardState) { 
        this.boardState = boardState;
        this.updatedAt = LocalDateTime.now();
    }
    
    public String getMoveHistory() { return moveHistory; }
    public void setMoveHistory(String moveHistory) { 
        this.moveHistory = moveHistory;
        this.updatedAt = LocalDateTime.now();
    }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public boolean canJoin() {
        return gameStatus == GameStatus.WAITING && (playerRedId == null || playerBlackId == null);
    }

    public boolean isFull() {
        return playerRedId != null && playerBlackId != null;
    }

    public PlayerColor getPlayerColor(String playerId) {
        if (playerId.equals(playerRedId)) return PlayerColor.RED;
        if (playerId.equals(playerBlackId)) return PlayerColor.BLACK;
        return null;
    }
}

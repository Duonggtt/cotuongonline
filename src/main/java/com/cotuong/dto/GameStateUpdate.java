package com.cotuong.dto;

import com.cotuong.model.GameStatus;
import com.cotuong.model.PlayerColor;

public class GameStateUpdate {
    private String roomCode;
    private String boardState;
    private PlayerColor currentTurn;
    private GameStatus gameStatus;
    private String moveHistory;
    private String lastMove;
    private String winner;
    private boolean inCheck;

    public GameStateUpdate() {}

    public GameStateUpdate(String roomCode, String boardState, PlayerColor currentTurn, 
                          GameStatus gameStatus, String moveHistory) {
        this.roomCode = roomCode;
        this.boardState = boardState;
        this.currentTurn = currentTurn;
        this.gameStatus = gameStatus;
        this.moveHistory = moveHistory;
    }

    // Getters and Setters
    public String getRoomCode() { return roomCode; }
    public void setRoomCode(String roomCode) { this.roomCode = roomCode; }
    
    public String getBoardState() { return boardState; }
    public void setBoardState(String boardState) { this.boardState = boardState; }
    
    public PlayerColor getCurrentTurn() { return currentTurn; }
    public void setCurrentTurn(PlayerColor currentTurn) { this.currentTurn = currentTurn; }
    
    public GameStatus getGameStatus() { return gameStatus; }
    public void setGameStatus(GameStatus gameStatus) { this.gameStatus = gameStatus; }
    
    public String getMoveHistory() { return moveHistory; }
    public void setMoveHistory(String moveHistory) { this.moveHistory = moveHistory; }
    
    public String getLastMove() { return lastMove; }
    public void setLastMove(String lastMove) { this.lastMove = lastMove; }
    
    public String getWinner() { return winner; }
    public void setWinner(String winner) { this.winner = winner; }
    
    public boolean isInCheck() { return inCheck; }
    public void setInCheck(boolean inCheck) { this.inCheck = inCheck; }
}

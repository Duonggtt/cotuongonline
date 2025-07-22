package com.cotuong.dto;

public class GameMove {
    private int fromRow;
    private int fromCol;
    private int toRow;
    private int toCol;
    private String playerId;
    private String roomCode;

    public GameMove() {}

    public GameMove(int fromRow, int fromCol, int toRow, int toCol, String playerId, String roomCode) {
        this.fromRow = fromRow;
        this.fromCol = fromCol;
        this.toRow = toRow;
        this.toCol = toCol;
        this.playerId = playerId;
        this.roomCode = roomCode;
    }

    // Getters and Setters
    public int getFromRow() { return fromRow; }
    public void setFromRow(int fromRow) { this.fromRow = fromRow; }
    
    public int getFromCol() { return fromCol; }
    public void setFromCol(int fromCol) { this.fromCol = fromCol; }
    
    public int getToRow() { return toRow; }
    public void setToRow(int toRow) { this.toRow = toRow; }
    
    public int getToCol() { return toCol; }
    public void setToCol(int toCol) { this.toCol = toCol; }
    
    public String getPlayerId() { return playerId; }
    public void setPlayerId(String playerId) { this.playerId = playerId; }
    
    public String getRoomCode() { return roomCode; }
    public void setRoomCode(String roomCode) { this.roomCode = roomCode; }

    @Override
    public String toString() {
        return String.format("(%d,%d) -> (%d,%d)", fromRow, fromCol, toRow, toCol);
    }
}

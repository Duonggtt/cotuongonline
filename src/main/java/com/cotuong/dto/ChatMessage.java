package com.cotuong.dto;

public class ChatMessage {
    private String playerId;
    private String playerName;
    private String message;
    private String roomCode;
    private long timestamp;

    public ChatMessage() {
        this.timestamp = System.currentTimeMillis();
    }

    public ChatMessage(String playerId, String playerName, String message, String roomCode) {
        this();
        this.playerId = playerId;
        this.playerName = playerName;
        this.message = message;
        this.roomCode = roomCode;
    }

    // Getters and Setters
    public String getPlayerId() { return playerId; }
    public void setPlayerId(String playerId) { this.playerId = playerId; }
    
    public String getPlayerName() { return playerName; }
    public void setPlayerName(String playerName) { this.playerName = playerName; }
    
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    
    public String getRoomCode() { return roomCode; }
    public void setRoomCode(String roomCode) { this.roomCode = roomCode; }
    
    public long getTimestamp() { return timestamp; }
    public void setTimestamp(long timestamp) { this.timestamp = timestamp; }
}

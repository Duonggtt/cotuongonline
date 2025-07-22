package com.cotuong.controller;

import com.cotuong.dto.ChatMessage;
import com.cotuong.dto.GameMove;
import com.cotuong.dto.GameStateUpdate;
import com.cotuong.service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
public class GameWebSocketController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private GameService gameService;

    @MessageMapping("/game/move")
    public void makeMove(@Payload GameMove move) {
        GameStateUpdate update = gameService.makeMove(move);
        if (update != null) {
            messagingTemplate.convertAndSend("/topic/room/" + move.getRoomCode(), update);
        }
    }

    @MessageMapping("/game/surrender")
    public void surrender(@Payload GameMove surrenderRequest) {
        GameStateUpdate update = gameService.surrender(surrenderRequest.getRoomCode(), surrenderRequest.getPlayerId());
        if (update != null) {
            messagingTemplate.convertAndSend("/topic/room/" + surrenderRequest.getRoomCode(), update);
        }
    }

    @MessageMapping("/game/validMoves")
    public void getValidMoves(@Payload GameMove request) {
        List<int[]> validMoves = gameService.getValidMoves(request.getRoomCode(), 
                                                          request.getFromRow(), request.getFromCol(), 
                                                          request.getPlayerId());
        messagingTemplate.convertAndSendToUser(request.getPlayerId(), "/queue/validMoves", validMoves);
    }

    @MessageMapping("/chat/message")
    public void sendMessage(@Payload ChatMessage message) {
        messagingTemplate.convertAndSend("/topic/chat/" + message.getRoomCode(), message);
    }
}

package com.cotuong.controller;

import com.cotuong.model.GameRoom;
import com.cotuong.service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Controller
public class GameController {

    @Autowired
    private GameService gameService;

    @GetMapping("/")
    public String index() {
        return "index";
    }

    @GetMapping("/game/{roomCode}")
    public String gameRoom(@PathVariable String roomCode, 
                          @RequestParam(required = false) String playerId,
                          @RequestParam(required = false) String playerName,
                          Model model) {
        
        // Tạo playerId mới nếu chưa có
        if (playerId == null || playerId.isEmpty()) {
            playerId = UUID.randomUUID().toString();
        }
        
        // Tạo tên người chơi ngẫu nhiên nếu chưa có
        if (playerName == null || playerName.isEmpty()) {
            playerName = gameService.generatePlayerName();
        }

        Optional<GameRoom> roomOpt = gameService.joinRoom(roomCode, playerId, playerName);
        if (roomOpt.isEmpty()) {
            return "redirect:/?error=room_not_found";
        }

        GameRoom room = roomOpt.get();
        model.addAttribute("room", room);
        model.addAttribute("playerId", playerId);
        model.addAttribute("playerName", playerName);
        model.addAttribute("playerColor", room.getPlayerColor(playerId));
        
        return "game";
    }

    @PostMapping("/api/room/create")
    @ResponseBody
    public ResponseEntity<Map<String, String>> createRoom() {
        GameRoom room = gameService.createRoom();
        Map<String, String> response = new HashMap<>();
        response.put("roomCode", room.getRoomCode());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/api/room/{roomCode}")
    @ResponseBody
    public ResponseEntity<GameRoom> getRoomInfo(@PathVariable String roomCode) {
        Optional<GameRoom> room = gameService.getRoomByCode(roomCode);
        return room.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/api/player/name")
    @ResponseBody
    public ResponseEntity<Map<String, String>> generatePlayerName() {
        String name = gameService.generatePlayerName();
        Map<String, String> response = new HashMap<>();
        response.put("playerName", name);
        return ResponseEntity.ok(response);
    }
}

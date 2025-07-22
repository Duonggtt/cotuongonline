// Main Game Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize game components
    initializeGame();
    initializeChat();
    initializeGameControls();
    initializeModals();
    
    // Handle page visibility for optimization
    handlePageVisibility();
    
    // Handle window resize
    handleWindowResize();
});

let chessBoard;
let gameWebSocket;

function initializeGame() {
    console.log('Initializing game with config:', window.gameConfig);
    
    // Create chess board
    chessBoard = new ChessBoard('chessBoard', window.gameConfig);
    window.chessBoard = chessBoard; // Make globally accessible
    
    // Set up move handler
    chessBoard.onMove((move) => {
        console.log('Player making move:', move);
        if (gameWebSocket) {
            gameWebSocket.makeMove(move);
        }
    });
    
    // Initialize WebSocket connection
    gameWebSocket = new GameWebSocket(window.gameConfig);
    window.gameWebSocket = gameWebSocket; // Make globally accessible
    
    // Set initial turn status
    updatePlayerTurnStatus();
    
    // Show waiting modal if game hasn't started
    if (window.gameConfig.gameStatus === 'WAITING') {
        showWaitingModal();
    }
}

function initializeChat() {
    const chatInput = document.getElementById('chatInput');
    const sendChatBtn = document.getElementById('sendChatBtn');
    const emojiBtn = document.getElementById('emojiBtn');
    const emojiPanel = document.getElementById('emojiPanel');
    const voiceChatBtn = document.getElementById('voiceChatBtn');
    
    // Send chat message
    function sendChatMessage() {
        const message = chatInput.value.trim();
        if (message && gameWebSocket) {
            gameWebSocket.sendChatMessage(message);
            chatInput.value = '';
        }
    }
    
    sendChatBtn?.addEventListener('click', sendChatMessage);
    
    chatInput?.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendChatMessage();
        }
    });
    
    // Emoji panel
    emojiBtn?.addEventListener('click', function(e) {
        e.stopPropagation();
        emojiPanel?.classList.toggle('hidden');
    });
    
    // Close emoji panel when clicking outside
    document.addEventListener('click', function() {
        emojiPanel?.classList.add('hidden');
    });
    
    // Handle emoji selection
    emojiPanel?.addEventListener('click', function(e) {
        if (e.target.classList.contains('emoji-item')) {
            const emoji = e.target.textContent;
            if (gameWebSocket) {
                gameWebSocket.sendChatMessage(emoji);
            }
            emojiPanel.classList.add('hidden');
        }
    });
    
    // Voice chat (simplified implementation)
    voiceChatBtn?.addEventListener('click', function() {
        toggleVoiceChat();
    });
}

function initializeGameControls() {
    const surrenderBtn = document.getElementById('surrenderBtn');
    const leaveBtn = document.getElementById('leaveBtn');
    
    surrenderBtn?.addEventListener('click', function() {
        if (confirm('Bạn có chắc chắn muốn đầu hàng?')) {
            if (gameWebSocket) {
                gameWebSocket.surrender();
            }
        }
    });
    
    leaveBtn?.addEventListener('click', function() {
        if (confirm('Bạn có chắc chắn muốn rời phòng?')) {
            window.location.href = '/';
        }
    });
}

function initializeModals() {
    // Waiting modal
    const waitingModal = document.getElementById('waitingModal');
    const copyRoomCodeBtn = document.getElementById('copyRoomCodeBtn');
    const shareRoomCode = document.getElementById('shareRoomCode');
    
    // Copy room code
    copyRoomCodeBtn?.addEventListener('click', function() {
        if (shareRoomCode) {
            shareRoomCode.select();
            document.execCommand('copy');
            
            // Visual feedback
            const originalText = copyRoomCodeBtn.textContent;
            copyRoomCodeBtn.textContent = 'Đã sao chép!';
            copyRoomCodeBtn.style.background = '#48bb78';
            
            setTimeout(() => {
                copyRoomCodeBtn.textContent = originalText;
                copyRoomCodeBtn.style.background = '';
            }, 2000);
        }
    });
    
    // Update share link
    const shareLink = document.getElementById('shareLink');
    if (shareLink) {
        const currentUrl = window.location.href;
        shareLink.textContent = currentUrl;
        shareLink.style.cursor = 'pointer';
        shareLink.addEventListener('click', function() {
            navigator.clipboard.writeText(currentUrl).then(() => {
                shareLink.style.color = '#48bb78';
                shareLink.textContent = 'Đã sao chép link!';
                setTimeout(() => {
                    shareLink.style.color = '';
                    shareLink.textContent = currentUrl;
                }, 2000);
            });
        });
    }
    
    // Game over modal
    const newGameBtn = document.getElementById('newGameBtn');
    const backHomeBtn = document.getElementById('backHomeBtn');
    
    newGameBtn?.addEventListener('click', function() {
        window.location.href = '/';
    });
    
    backHomeBtn?.addEventListener('click', function() {
        window.location.href = '/';
    });
}

function updatePlayerTurnStatus() {
    const isPlayerTurn = window.gameConfig.currentTurn?.toLowerCase() === window.gameConfig.playerColor?.toLowerCase();
    
    if (chessBoard) {
        chessBoard.setPlayerTurn(isPlayerTurn);
        chessBoard.config.currentTurn = window.gameConfig.currentTurn;
    }
    
    // Update turn indicator
    const turnText = document.getElementById('currentTurnText');
    if (turnText) {
        const currentTurn = window.gameConfig.currentTurn === 'RED' ? 'Đỏ' : 'Đen';
        turnText.textContent = isPlayerTurn ? 'Lượt của bạn' : `Lượt của ${currentTurn}`;
        turnText.style.color = isPlayerTurn ? '#48bb78' : '#e53e3e';
    }
}

function showWaitingModal() {
    const waitingModal = document.getElementById('waitingModal');
    if (waitingModal) {
        waitingModal.classList.add('show');
    }
}

function hideWaitingModal() {
    const waitingModal = document.getElementById('waitingModal');
    if (waitingModal) {
        waitingModal.classList.remove('show');
    }
}

function toggleVoiceChat() {
    const voiceChatBtn = document.getElementById('voiceChatBtn');
    if (!voiceChatBtn) return;
    
    const isActive = voiceChatBtn.classList.contains('active');
    
    if (isActive) {
        // Stop voice chat
        stopVoiceChat();
        voiceChatBtn.classList.remove('active');
        voiceChatBtn.title = 'Bật micro';
    } else {
        // Start voice chat
        startVoiceChat();
        voiceChatBtn.classList.add('active');
        voiceChatBtn.title = 'Tắt micro';
    }
}

function startVoiceChat() {
    // Simplified voice chat implementation
    // In a real implementation, you would use WebRTC for peer-to-peer audio
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            console.log('Voice chat started');
            window.voiceStream = stream;
            
            // Here you would implement WebRTC connection
            // For now, just show that microphone is active
            showNotification('🎤 Micro đã được bật', 'success');
        })
        .catch(error => {
            console.error('Could not start voice chat:', error);
            showNotification('❌ Không thể bật micro', 'error');
        });
}

function stopVoiceChat() {
    if (window.voiceStream) {
        window.voiceStream.getTracks().forEach(track => track.stop());
        window.voiceStream = null;
        console.log('Voice chat stopped');
        showNotification('🔇 Micro đã được tắt', 'info');
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Styling
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.padding = '12px 20px';
    notification.style.borderRadius = '8px';
    notification.style.color = 'white';
    notification.style.fontWeight = '500';
    notification.style.zIndex = '1000';
    notification.style.transition = 'all 0.3s ease';
    notification.style.transform = 'translateX(100%)';
    
    // Type-specific styling
    switch (type) {
        case 'success':
            notification.style.background = '#48bb78';
            break;
        case 'error':
            notification.style.background = '#e53e3e';
            break;
        case 'warning':
            notification.style.background = '#ed8936';
            break;
        default:
            notification.style.background = '#4299e1';
    }
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Auto remove
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function handlePageVisibility() {
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            // Page is hidden, pause animations or reduce activity
            console.log('Page hidden, reducing activity');
        } else {
            // Page is visible, resume normal activity
            console.log('Page visible, resuming activity');
            
            // Refresh board state if needed
            if (chessBoard && gameWebSocket && gameWebSocket.connected) {
                // Could request latest game state here
            }
        }
    });
}

function handleWindowResize() {
    window.addEventListener('resize', function() {
        if (chessBoard && chessBoard.resize) {
            chessBoard.resize();
        }
    });
    
    // Initial resize
    setTimeout(() => {
        if (chessBoard && chessBoard.resize) {
            chessBoard.resize();
        }
    }, 100);
}

// Handle browser back/forward navigation
window.addEventListener('popstate', function(event) {
    // Cleanup WebSocket connection when leaving
    if (gameWebSocket) {
        gameWebSocket.disconnect();
    }
});

// Handle page unload
window.addEventListener('beforeunload', function(event) {
    // Cleanup WebSocket connection
    if (gameWebSocket) {
        gameWebSocket.disconnect();
    }
    
    // Stop voice chat
    if (window.voiceStream) {
        window.voiceStream.getTracks().forEach(track => track.stop());
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Escape key to clear selection
    if (event.key === 'Escape' && chessBoard) {
        chessBoard.clearSelection();
    }
    
    // Enter key in chat
    if (event.key === 'Enter' && event.target.id === 'chatInput') {
        const sendBtn = document.getElementById('sendChatBtn');
        if (sendBtn) {
            sendBtn.click();
        }
    }
});

// Export functions for global access
window.gameUtils = {
    showNotification,
    hideWaitingModal,
    updatePlayerTurnStatus,
    toggleVoiceChat
};

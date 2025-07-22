// Index Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const createRoomBtn = document.getElementById('createRoomBtn');
    const joinRoomBtn = document.getElementById('joinRoomBtn');
    const roomCodeInput = document.getElementById('roomCodeInput');
    const playerNameInput = document.getElementById('playerNameInput');
    const loadingModal = document.getElementById('loadingModal');
    const errorModal = document.getElementById('errorModal');
    const errorMessage = document.getElementById('errorMessage');
    const closeErrorBtn = document.getElementById('closeErrorBtn');

    // Check for error parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    if (error === 'room_not_found') {
        showError('Không tìm thấy phòng hoặc phòng đã đầy. Vui lòng kiểm tra lại mã phòng.');
    }

    // Create Room
    createRoomBtn.addEventListener('click', async function() {
        showLoading('Đang tạo phòng...');
        
        try {
            const response = await fetch('/api/room/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                const playerId = generatePlayerId();
                const playerName = await generatePlayerName();
                
                window.location.href = `/game/${data.roomCode}?playerId=${playerId}&playerName=${encodeURIComponent(playerName)}`;
            } else {
                throw new Error('Không thể tạo phòng');
            }
        } catch (error) {
            hideLoading();
            showError('Có lỗi xảy ra khi tạo phòng. Vui lòng thử lại.');
        }
    });

    // Join Room
    joinRoomBtn.addEventListener('click', function() {
        const roomCode = roomCodeInput.value.trim();
        
        if (!roomCode) {
            showError('Vui lòng nhập mã phòng');
            return;
        }

        if (roomCode.length !== 6 || !/^\d+$/.test(roomCode)) {
            showError('Mã phòng phải gồm 6 chữ số');
            return;
        }

        const playerId = generatePlayerId();
        let playerName = playerNameInput.value.trim();
        
        if (!playerName) {
            generatePlayerName().then(name => {
                playerName = name;
                joinRoom(roomCode, playerId, playerName);
            });
        } else {
            joinRoom(roomCode, playerId, playerName);
        }
    });

    // Handle Enter key in inputs
    roomCodeInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            joinRoomBtn.click();
        }
    });

    playerNameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            joinRoomBtn.click();
        }
    });

    // Format room code input
    roomCodeInput.addEventListener('input', function(e) {
        // Only allow numbers
        e.target.value = e.target.value.replace(/\D/g, '');
        
        // Limit to 6 digits
        if (e.target.value.length > 6) {
            e.target.value = e.target.value.slice(0, 6);
        }
    });

    // Close error modal
    closeErrorBtn.addEventListener('click', function() {
        hideError();
    });

    // Click outside modal to close
    errorModal.addEventListener('click', function(e) {
        if (e.target === errorModal) {
            hideError();
        }
    });

    // Utility Functions
    function generatePlayerId() {
        return 'player_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    async function generatePlayerName() {
        try {
            const response = await fetch('/api/player/name', {
                method: 'POST'
            });
            
            if (response.ok) {
                const data = await response.json();
                return data.playerName;
            }
        } catch (error) {
            console.warn('Could not generate player name:', error);
        }
        
        // Fallback names
        const adjectives = ['Dũng', 'Thông', 'Minh', 'Khôn', 'Nhanh', 'Mạnh'];
        const nouns = ['Tướng', 'Sĩ', 'Tượng', 'Mã', 'Xe', 'Pháo'];
        const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
        const noun = nouns[Math.floor(Math.random() * nouns.length)];
        const num = Math.floor(Math.random() * 999) + 1;
        return `${adj}${noun}${num}`;
    }

    function joinRoom(roomCode, playerId, playerName) {
        showLoading('Đang tham gia phòng...');
        window.location.href = `/game/${roomCode}?playerId=${playerId}&playerName=${encodeURIComponent(playerName)}`;
    }

    function showLoading(message) {
        const loadingText = loadingModal.querySelector('p');
        if (loadingText) {
            loadingText.textContent = message;
        }
        loadingModal.classList.add('show');
    }

    function hideLoading() {
        loadingModal.classList.remove('show');
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorModal.classList.add('show');
    }

    function hideError() {
        errorModal.classList.remove('show');
    }

    // Add some visual feedback
    document.querySelectorAll('.action-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add typing animation to welcome text
    const welcomeText = document.querySelector('.welcome-section h2');
    if (welcomeText) {
        const text = welcomeText.textContent;
        welcomeText.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                welcomeText.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        setTimeout(typeWriter, 500);
    }
});

// Audio Manager for Chess Game
class AudioManager {
    constructor() {
        this.audioContext = null;
        this.sounds = {};
        this.backgroundMusic = null;
        this.soundEnabled = true;
        this.musicEnabled = true;
        this.volume = 0.7;
        
        this.initializeAudio();
        this.createSounds();
    }

    async initializeAudio() {
        try {
            // Create AudioContext (modern browsers)
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Resume context if suspended (required by some browsers)
            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }
        } catch (error) {
            console.warn('Web Audio API not supported:', error);
            this.audioContext = null;
        }
    }

    createSounds() {
        if (!this.audioContext) return;

        // Create different types of sounds
        this.sounds = {
            move: this.createMoveSound(),
            capture: this.createCaptureSound(),
            check: this.createCheckSound(),
            gameOver: this.createGameOverSound(),
            timerWarning: this.createTimerWarningSound(),
            timerDanger: this.createTimerDangerSound()
        };

        // Create background music
        this.createBackgroundMusic();
    }

    createMoveSound() {
        return () => {
            if (!this.soundEnabled || !this.audioContext) return;
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            // Nice wood piece sound
            oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.volume * 0.3, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.15);
            
            oscillator.type = 'sawtooth';
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.15);
        };
    }

    createCaptureSound() {
        return () => {
            if (!this.soundEnabled || !this.audioContext) return;
            
            const oscillator1 = this.audioContext.createOscillator();
            const oscillator2 = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator1.connect(gainNode);
            oscillator2.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            // Dramatic capture sound
            oscillator1.frequency.setValueAtTime(600, this.audioContext.currentTime);
            oscillator1.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.2);
            
            oscillator2.frequency.setValueAtTime(300, this.audioContext.currentTime);
            oscillator2.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.2);
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.volume * 0.5, this.audioContext.currentTime + 0.02);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.25);
            
            oscillator1.type = 'square';
            oscillator2.type = 'triangle';
            
            oscillator1.start(this.audioContext.currentTime);
            oscillator2.start(this.audioContext.currentTime);
            oscillator1.stop(this.audioContext.currentTime + 0.25);
            oscillator2.stop(this.audioContext.currentTime + 0.25);
        };
    }

    createCheckSound() {
        return () => {
            if (!this.soundEnabled || !this.audioContext) return;
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            // Alert sound for check
            oscillator.frequency.setValueAtTime(1000, this.audioContext.currentTime);
            oscillator.frequency.setValueAtTime(1200, this.audioContext.currentTime + 0.1);
            oscillator.frequency.setValueAtTime(1000, this.audioContext.currentTime + 0.2);
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.volume * 0.4, this.audioContext.currentTime + 0.05);
            gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.3);
            
            oscillator.type = 'sine';
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.3);
        };
    }

    createGameOverSound() {
        return () => {
            if (!this.soundEnabled || !this.audioContext) return;
            
            // Victory fanfare
            const notes = [261.63, 329.63, 392.00, 523.25]; // C, E, G, C
            notes.forEach((frequency, index) => {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
                
                const startTime = this.audioContext.currentTime + index * 0.2;
                gainNode.gain.setValueAtTime(0, startTime);
                gainNode.gain.linearRampToValueAtTime(this.volume * 0.3, startTime + 0.05);
                gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);
                
                oscillator.type = 'triangle';
                oscillator.start(startTime);
                oscillator.stop(startTime + 0.4);
            });
        };
    }

    createTimerWarningSound() {
        return () => {
            if (!this.soundEnabled || !this.audioContext) return;
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.volume * 0.2, this.audioContext.currentTime + 0.1);
            gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.2);
            
            oscillator.type = 'square';
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.2);
        };
    }

    createTimerDangerSound() {
        return () => {
            if (!this.soundEnabled || !this.audioContext) return;
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            // Fast beeping
            oscillator.frequency.setValueAtTime(1200, this.audioContext.currentTime);
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.volume * 0.4, this.audioContext.currentTime + 0.05);
            gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.1);
            
            oscillator.type = 'square';
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.1);
        };
    }

    createBackgroundMusic() {
        if (!this.musicEnabled || !this.audioContext) return;
        
        // Create tense background music
        this.backgroundMusic = {
            isPlaying: false,
            oscillators: [],
            gainNodes: [],
            
            start: () => {
                if (this.backgroundMusic.isPlaying || !this.audioContext) return;
                
                this.backgroundMusic.isPlaying = true;
                
                // Create atmospheric tension with low frequencies
                const baseFreq = 55; // A1
                const harmonic1 = this.audioContext.createOscillator();
                const harmonic2 = this.audioContext.createOscillator();
                const harmonic3 = this.audioContext.createOscillator();
                
                const gain1 = this.audioContext.createGain();
                const gain2 = this.audioContext.createGain();
                const gain3 = this.audioContext.createGain();
                
                harmonic1.connect(gain1);
                harmonic2.connect(gain2);
                harmonic3.connect(gain3);
                
                gain1.connect(this.audioContext.destination);
                gain2.connect(this.audioContext.destination);
                gain3.connect(this.audioContext.destination);
                
                harmonic1.frequency.setValueAtTime(baseFreq, this.audioContext.currentTime);
                harmonic2.frequency.setValueAtTime(baseFreq * 1.5, this.audioContext.currentTime);
                harmonic3.frequency.setValueAtTime(baseFreq * 2, this.audioContext.currentTime);
                
                gain1.gain.setValueAtTime(this.volume * 0.1, this.audioContext.currentTime);
                gain2.gain.setValueAtTime(this.volume * 0.05, this.audioContext.currentTime);
                gain3.gain.setValueAtTime(this.volume * 0.03, this.audioContext.currentTime);
                
                harmonic1.type = 'sawtooth';
                harmonic2.type = 'triangle';
                harmonic3.type = 'sine';
                
                harmonic1.start();
                harmonic2.start();
                harmonic3.start();
                
                this.backgroundMusic.oscillators = [harmonic1, harmonic2, harmonic3];
                this.backgroundMusic.gainNodes = [gain1, gain2, gain3];
            },
            
            stop: () => {
                if (!this.backgroundMusic.isPlaying) return;
                
                this.backgroundMusic.oscillators.forEach(osc => {
                    try {
                        osc.stop();
                    } catch (e) {
                        // Oscillator might already be stopped
                    }
                });
                
                this.backgroundMusic.isPlaying = false;
                this.backgroundMusic.oscillators = [];
                this.backgroundMusic.gainNodes = [];
            }
        };
    }

    // Public methods
    playMoveSound() {
        if (this.sounds.move) {
            this.sounds.move();
        }
    }

    playCaptureSound() {
        if (this.sounds.capture) {
            this.sounds.capture();
        }
    }

    playCheckSound() {
        if (this.sounds.check) {
            this.sounds.check();
        }
    }

    playGameOverSound() {
        if (this.sounds.gameOver) {
            this.sounds.gameOver();
        }
    }

    playTimerWarning() {
        if (this.sounds.timerWarning) {
            this.sounds.timerWarning();
        }
    }

    playTimerDanger() {
        if (this.sounds.timerDanger) {
            this.sounds.timerDanger();
        }
    }

    startTenseMusic() {
        if (this.backgroundMusic) {
            this.backgroundMusic.start();
        }
    }

    stopTenseMusic() {
        if (this.backgroundMusic) {
            this.backgroundMusic.stop();
        }
    }

    setSoundEnabled(enabled) {
        this.soundEnabled = enabled;
    }

    setMusicEnabled(enabled) {
        this.musicEnabled = enabled;
        if (!enabled && this.backgroundMusic) {
            this.backgroundMusic.stop();
        }
    }

    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
    }

    // Initialize audio on user interaction (required by browsers)
    async enableAudio() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }
    }
}

// Create global audio manager instance
window.audioManager = new AudioManager();

// Enable audio on first user interaction
document.addEventListener('click', () => {
    window.audioManager.enableAudio();
}, { once: true });

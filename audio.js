/**
 * AUDIO SYSTEM - audio.js
 * Genereert synthetisch geluid zonder externe MP3 bestanden.
 */
const AudioSystem = {
    ctx: null,
    oscillator: null,
    gainNode: null,
    isLooping: false,

    init() {
        // Maakt de audio-omgeving aan bij de eerste klik
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    },

    playAlarm() {
        this.init();
        if (this.isLooping) return; 

        this.isLooping = true;
        this.createSiren();
    },

    createSiren() {
        if (!this.isLooping) return;

        // Maakt een nieuwe geluidsgolf aan (geen bestand nodig!)
        this.oscillator = this.ctx.createOscillator();
        this.gainNode = this.ctx.createGain();

        // 'sawtooth' geeft die typische scherpe alarm-klank
        this.oscillator.type = 'sawtooth'; 
        
        // Frequentie-verloop voor het sirene-effect (300Hz naar 600Hz)
        this.oscillator.frequency.setValueAtTime(300, this.ctx.currentTime);
        this.oscillator.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.8);

        // Volume controle (gain)
        this.gainNode.gain.setValueAtTime(0.05, this.ctx.currentTime);
        this.gainNode.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.9);

        this.oscillator.connect(this.gainNode);
        this.gainNode.connect(this.ctx.destination);

        this.oscillator.start();
        this.oscillator.stop(this.ctx.currentTime + 1);

        // Start de volgende puls na 1 seconde
        this.oscillator.onended = () => {
            if (this.isLooping) {
                this.createSiren();
            }
        };
    },

    stop() {
        this.isLooping = false;
        
        if (this.gainNode) {
            // Laat het huidige geluidje zachtjes uitsterven
            this.gainNode.gain.setTargetAtTime(0, this.ctx.currentTime, 0.05);
        }

        setTimeout(() => {
            if (this.oscillator) {
                try { this.oscillator.stop(); } catch(e) {}
                this.oscillator = null;
            }
        }, 150);
    }
};

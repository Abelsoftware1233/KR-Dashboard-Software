/**
 * AUDIO SYSTEM - audio.js
 * Beheert de alarmgeluiden voor de reactor simulator
 */
const AudioSystem = {
    ctx: null,
    oscillator: null,
    gainNode: null,
    isLooping: false,

    init() {
        // AudioContext kan alleen starten na een gebruikersinteractie (klik)
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    },

    playAlarm() {
        this.init();
        if (this.oscillator || this.isLooping) return;

        this.isLooping = true;
        this.createSiren();
    },

    createSiren() {
        if (!this.isLooping) return;

        this.oscillator = this.ctx.createOscillator();
        this.gainNode = this.ctx.createGain();

        // Type 'sawtooth' of 'triangle' werkt het best voor alarmen
        this.oscillator.type = 'sawtooth'; 
        
        // Startfrequentie
        this.oscillator.frequency.setValueAtTime(300, this.ctx.currentTime);
        // Glij naar hoge frequentie (sirene effect)
        this.oscillator.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.8);

        this.gainNode.gain.setValueAtTime(0.05, this.ctx.currentTime);
        // Fade out aan het einde van de puls
        this.gainNode.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.9);

        this.oscillator.connect(this.gainNode);
        this.gainNode.connect(this.ctx.destination);

        this.oscillator.start();
        this.oscillator.stop(this.ctx.currentTime + 1);

        // Herhaal de puls zolang het alarm aan staat
        this.oscillator.onended = () => {
            if (this.isLooping) {
                this.createSiren();
            }
        };
    },

    stopAlarm() {
        this.isLooping = false;
        if (this.gainNode) {
            // Laat het laatste geluidje netjes uitfaden
            this.gainNode.gain.setTargetAtTime(0, this.ctx.currentTime, 0.1);
        }
        setTimeout(() => {
            if (this.oscillator) {
                this.oscillator.stop();
                this.oscillator = null;
            }
        }, 200);
    }
};

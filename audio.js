const AudioSystem = {
    ctx: null,
    oscillator: null,
    gainNode: null,

    init() {
        if (this.ctx) return;
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    },

    playAlarm() {
        this.init();
        if (this.oscillator) return;

        this.oscillator = this.ctx.createOscillator();
        this.gainNode = this.ctx.createGain();
        this.oscillator.type = 'sawtooth';
        this.oscillator.frequency.setValueAtTime(300, this.ctx.currentTime);
        
        // Pulserend effect
        this.oscillator.frequency.linearRampToValueAtTime(600, this.ctx.currentTime + 0.5);
        this.oscillator.frequency.linearRampToValueAtTime(300, this.ctx.currentTime + 1.0);
        
        this.gainNode.gain.setValueAtTime(0.05, this.ctx.currentTime);
        this.oscillator.connect(this.gainNode);
        this.gainNode.connect(this.ctx.destination);
        this.oscillator.start();
        
        this.freqInterval = setInterval(() => {
            if (!this.oscillator) return;
            this.oscillator.frequency.linearRampToValueAtTime(600, this.ctx.currentTime + 0.5);
            this.oscillator.frequency.linearRampToValueAtTime(300, this.ctx.currentTime + 1.0);
        }, 1000);
    },

    stopAlarm() {
        if (this.oscillator) {
            clearInterval(this.freqInterval);
            this.oscillator.stop();
            this.oscillator = null;
        }
    }
};

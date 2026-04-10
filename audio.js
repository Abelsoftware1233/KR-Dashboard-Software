const AudioSystem = {
    ctx: null,
    oscillator: null,

    init() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    },

    playAlarm() {
        if (!this.ctx) this.init();
        if (this.oscillator) return;

        this.oscillator = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        this.oscillator.type = 'triangle';
        this.oscillator.frequency.setValueAtTime(440, this.ctx.currentTime);
        this.oscillator.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.5);
        this.oscillator.loop = true;

        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        
        this.oscillator.connect(gain);
        gain.connect(this.ctx.destination);

        this.oscillator.start();
        // Laat de frequentie op en neer gaan (sirene effect)
        this.oscillator.frequency.setTargetAtTime(440, this.ctx.currentTime, 0.5);
    },

    stopAlarm() {
        if (this.oscillator) {
            this.oscillator.stop();
            this.oscillator = null;
        }
    }
};

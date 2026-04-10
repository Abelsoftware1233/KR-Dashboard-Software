const AudioSystem = {
    ctx: null,
    oscillator: null,
    gain: null,

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    },

    play() {
        this.init();
        if (this.oscillator) return;
        
        this.oscillator = this.ctx.createOscillator();
        this.gain = this.ctx.createGain();
        
        this.oscillator.type = 'sawtooth';
        this.oscillator.frequency.setValueAtTime(400, this.ctx.currentTime);
        this.oscillator.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.5);
        
        this.gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
        this.oscillator.connect(this.gain);
        this.gain.connect(this.ctx.destination);
        this.oscillator.start();
        
        this.interval = setInterval(() => {
            if (!this.oscillator) return;
            this.oscillator.frequency.setValueAtTime(400, this.ctx.currentTime);
            this.oscillator.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.5);
        }, 600);
    },

    stop() {
        if (this.oscillator) {
            clearInterval(this.interval);
            this.oscillator.stop();
            this.oscillator = null;
        }
    }
};

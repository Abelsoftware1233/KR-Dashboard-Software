const AudioSystem = {
    ctx: null,
    oscillator: null,
    gainNode: null,
    isManualSilence: false,

    init() {
        if (this.ctx) return;
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    },

    playAlarm() {
        if (this.isManualSilence) return; // Alarm is handmatig uitgeschakeld
        this.init();
        if (this.oscillator) return;

        this.oscillator = this.ctx.createOscillator();
        this.gainNode = this.ctx.createGain();

        this.oscillator.type = 'sawtooth';
        this.oscillator.frequency.setValueAtTime(440, this.ctx.currentTime);
        this.gainNode.gain.setValueAtTime(0.06, this.ctx.currentTime);
        
        // Pulserend sirene effect (frequentie op en neer)
        this.oscillator.frequency.linearRampToValueAtTime(880, this.ctx.currentTime + 0.4);
        this.oscillator.frequency.linearRampToValueAtTime(440, this.ctx.currentTime + 0.8);
        
        this.oscillator.connect(this.gainNode);
        this.gainNode.connect(this.ctx.destination);
        
        this.oscillator.start();
        
        // Loop het sirene effect
        this.freqInterval = setInterval(() => {
            if (!this.oscillator) return;
            this.oscillator.frequency.linearRampToValueAtTime(880, this.ctx.currentTime + 0.4);
            this.oscillator.frequency.linearRampToValueAtTime(440, this.ctx.currentTime + 0.8);
        }, 800);
    },

    stopAlarm() {
        if (this.oscillator) {
            clearInterval(this.freqInterval);
            this.oscillator.stop();
            this.oscillator = null;
        }
    },

    toggleAlarmManual() {
        this.init(); // Browser audio unlock
        const btn = document.getElementById('alarm-btn');
        if (this.oscillator) {
            // Alarm staat aan, zet handmatig uit (silence)
            this.isManualSilence = true;
            this.stopAlarm();
            btn.innerText = "ALARM ACTIVATED";
            btn.className = "btn btn-alarm active-silence"; // Groen
        } else {
            // Silence opheffen, of handmatig alarm aanzetten
            this.isManualSilence = false;
            btn.innerText = "ALARM SILENCE";
            btn.className = "btn btn-alarm"; // Amber
            // Als de reactor nog steeds kritiek is, zal de main.js het direct weer starten
        }
    }
};

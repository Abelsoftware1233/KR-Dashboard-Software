class NuclearReactor {
    constructor(id) {
        this.id = id;
        this.temp = 285.0;
        this.rods = 0.0;
        this.isScram = false;
        this.adjustInterval = null;
    }

    calculatePhysics() {
        if (!this.isScram) {
            let targetTemp = 285 + (this.rods * 6.5);
            this.temp += (targetTemp - this.temp) * 0.02; // Traagheid
        } else {
            this.temp += (285 - this.temp) * 0.04; // Afkoeling
            if (this.temp < 290) {
                AudioSystem.stopAlarm();
                this.isScram = false; 
            }
        }
    }

    startAdjust(val) {
        if (this.isScram) return;
        AudioSystem.init(); // Browser audio unlock
        this.adjustInterval = setInterval(() => {
            this.rods = Math.min(Math.max(this.rods + val, 0), 100);
        }, 50);
    }

    stopAdjust() {
        clearInterval(this.adjustInterval);
    }

    scram() {
        this.isScram = true;
        this.rods = 0;
        AudioSystem.playAlarm();
        this.log("!!! EMERGENCY SHUTDOWN (SCRAM) !!!");
    }

    log(msg) {
        const log = document.getElementById('event-log');
        const timestamp = new Date().toLocaleTimeString();
        log.innerHTML = `<div>[${timestamp}] ${msg}</div>` + log.innerHTML;
    }
}

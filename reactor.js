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
            let targetTemp = 285 + (this.rods * 5.2);
            this.temp += (targetTemp - this.temp) * 0.05;
        } else {
            this.temp += (285 - this.temp) * 0.02;
            if (this.temp < 287) AudioSystem.stopAlarm();
        }
    }

    startAdjust(val) {
        if (this.isScram) return;
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
        this.log("!!! EMERGENCY SHUTDOWN !!!");
    }

    log(msg) {
        const log = document.getElementById('event-log');
        log.innerHTML = `> ${msg}<br>` + log.innerHTML;
    }
}

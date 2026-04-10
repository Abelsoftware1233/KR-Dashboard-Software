class NuclearReactor {
    constructor(id) {
        this.id = id;
        this.temp = 285.0;
        this.rods = 0.0;
        this.isScram = false;
        this.adjustInterval = null;
    }

    // De fysica achter de simulatie
    calculatePhysics() {
        if (!this.isScram) {
            // Target temperatuur stijgt naarmate de staven verder eruit zijn (rods up)
            let targetTemp = 285 + (this.rods * 6.5);
            // Traagheid: de temperatuur kruipt naar de target toe
            this.temp += (targetTemp - this.temp) * 0.02;
        } else {
            // Snelle afkoeling na noodstop
            this.temp += (285 - this.temp) * 0.04;
            if (this.temp < 290) {
                AudioSystem.stopAlarm();
                this.isScram = false; // Reset status als het veilig is
            }
        }
    }

    startAdjust(val) {
        if (this.isScram) return;
        AudioSystem.init(); // Activeer audio context door gebruikersinteractie
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
        this.log("!!! EMERGENCY SHUTDOWN (SCRAM) ACTIVATED !!!");
    }

    log(msg) {
        const log = document.getElementById('event-log');
        const timestamp = new Date().toLocaleTimeString();
        log.innerHTML = `<div>[${timestamp}] ${msg}</div>` + log.innerHTML;
    }
}

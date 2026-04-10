class NuclearReactor {
    constructor(id) {
        this.id = id;
        this.temp = 285.0;
        this.rods = 0.0;
        this.power = 0.0;
        this.isScram = false;
        this.isMeltdown = false;
        this.adjustInterval = null;
    }

    calculatePhysics() {
        if (!this.isScram) {
            // Natuurlijke hitte opbouw op basis van regelstaven
            let targetTemp = 285 + (this.rods * 5.2);
            // Geleidelijke verandering (traagheid)
            this.temp += (targetTemp - this.temp) * 0.05;
            this.power = this.rods * 15.2;
        } else {
            // Afkoelen na SCRAM
            this.temp += (285 - this.temp) * 0.02;
            this.power *= 0.5;
            
            // Auto-reset SCRAM status als de temperatuur veilig is
            if (this.temp < 290) {
                this.isScram = false;
                this.log("System stabilized. Ready for restart.");
            }
        }

        // Meltdown check
        if (this.temp > 800) {
            this.isMeltdown = true;
        }
    }

    startAdjust(val) {
        if (this.isScram || this.isMeltdown) return;
        this.adjustInterval = setInterval(() => {
            this.rods = Math.min(Math.max(this.rods + val, 0), 100);
            // Optioneel: log elke stap of elke 10%
        }, 50);
    }

    stopAdjust() {
        clearInterval(this.adjustInterval);
    }

    scram() {
        this.isScram = true;
        this.rods = 0;
        this.log("!!! EMERGENCY SHUTDOWN ACTIVATED !!!");
        // Visuele feedback (flits)
        document.body.style.backgroundColor = "#200";
        setTimeout(() => { document.body.style.backgroundColor = "#000"; }, 200);
    }

    log(msg) {
        const log = document.getElementById('event-log');
        if (log) {
            log.innerHTML = `> ${msg}<br>` + log.innerHTML;
            // Houd de log compact
            if (log.children.length > 20) log.removeChild(log.lastChild);
        }
    }
}

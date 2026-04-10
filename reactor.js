class NuclearReactor {
    constructor() {
        this.temp = 285.0;
        this.rods = 0.0;
        this.pumpsActive = false;
        this.isScram = false;
        this.isMeltdown = false;
        this.adjustInterval = null;
    }

    calculatePhysics() {
        if (this.isMeltdown) return;

        // Target temperatuur berekenen
        let targetTemp = 285 + (this.rods * 6.0);
        if (this.pumpsActive) {
            targetTemp -= (this.rods * 3.5); // Koeling vermindert de hitte
        }

        // Geleidelijke verandering (Inertia)
        let diff = targetTemp - this.temp;
        this.temp += diff * 0.03;

        // Meltdown grens
        if (this.temp > 620 && !this.isMeltdown) {
            this.isMeltdown = true;
            this.log("!!! CRITICAL FAILURE: REACTOR MELTDOWN !!!");
        }
    }

    startAdjust(val) {
        if (this.isScram || this.isMeltdown) return;
        if (this.adjustInterval) clearInterval(this.adjustInterval);
        this.adjustInterval = setInterval(() => {
            this.rods = Math.min(Math.max(this.rods + val, 0), 100);
        }, 50);
    }

    stopAdjust() {
        clearInterval(this.adjustInterval);
        this.adjustInterval = null;
    }

    togglePump(id) {
        if (this.isMeltdown) return;
        this.pumpsActive = !this.pumpsActive;
        const label = document.getElementById(`pump${id}-label`);
        const btn = document.getElementById(`pump${id}-btn`);
        
        if (this.pumpsActive) {
            btn.classList.add('active');
            label.innerText = "RUNNING";
            label.className = "pumps-label on";
            this.log("Secondary cooling pump engaged.");
        } else {
            btn.classList.remove('active');
            label.innerText = "OFF";
            label.className = "pumps-label off";
            this.log("Secondary cooling pump disengaged.");
        }
    }

    scram() {
        this.isScram = true;
        this.rods = 0;
        this.log("!!! EMERGENCY SHUTDOWN (SCRAM) INITIATED !!!");
        // AudioSystem wordt aangeroepen vanuit main.js voor betere sync
    }

    log(msg) {
        const log = document.getElementById('event-log');
        const time = new Date().toLocaleTimeString();
        log.innerHTML = `<div class="log-entry">[${time}] ${msg}</div>` + log.innerHTML;
    }
}

// Maak de instantie aan
const reactor = new NuclearReactor();

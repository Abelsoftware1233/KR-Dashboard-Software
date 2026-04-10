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

        // Basis hitte generatie
        let targetTemp = 285 + (this.rods * 5.5);
        
        // Koeling effect
        if (this.pumpsActive) {
            targetTemp -= (this.rods * 2.5); 
        }

        // Traagheid: de temperatuur beweegt richting de target
        let diff = targetTemp - this.temp;
        this.temp += diff * 0.05;

        // Meltdown check
        if (this.temp > 600 && !this.isMeltdown) {
            this.isMeltdown = true;
            this.log("CRITICAL FAILURE: MELTDOWN IN PROGRESS");
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
        this.pumpsActive = !this.pumpsActive;
        const btn = document.getElementById(`pump${id}-btn`);
        const label = document.getElementById(`pump${id}-label`);
        
        if (this.pumpsActive) {
            btn.classList.add('active');
            label.innerText = "RUNNING";
            label.style.color = "#00ff73";
        } else {
            btn.classList.remove('active');
            label.innerText = "OFF";
            label.style.color = "#444";
        }
    }

    scram() {
        this.isScram = true;
        this.rods = 0;
        this.log("!!! EMERGENCY SHUTDOWN (SCRAM) !!!");
        setTimeout(() => { this.isScram = false; }, 5000);
    }

    log(msg) {
        const log = document.getElementById('event-log');
        const time = new Date().toLocaleTimeString();
        log.innerHTML = `<div>[${time}] ${msg}</div>` + log.innerHTML;
    }
}

// Maak de reactor globaal beschikbaar voor de HTML knoppen
window.reactor = new NuclearReactor();

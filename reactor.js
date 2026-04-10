class ReactorUnit {
    constructor(prefix) {
        this.prefix = prefix; // Bijv. 'u4' of 'u5'
        this.temp = 285.0;    // Starttemperatuur
        this.rods = 0.0;
        this.pumpsActive = false; // Koeling staat start OFF
        this.isScram = false;
        this.isMeltdown = false;
        this.adjustInterval = null;
    }

    calculatePhysics() {
        if (this.isMeltdown) return;

        // Basis hitte generatie door regelstaven (rods up = meer hitte)
        let rawTarget = 285 + (this.rods * 7.5);
        
        // Hitte vermindering door koeling
        let coolingEffect = this.pumpsActive ? (this.rods * 4.0) : 0;
        
        // Final target temperatuur
        let finalTarget = Math.max(285, rawTarget - coolingEffect);
        
        // Traagheid: de temperatuur kruipt naar het doel (inertia)
        this.temp += (finalTarget - this.temp) * 0.04;

        // Meltdown grens
        if (this.temp > 630 && !this.isMeltdown) {
            this.isMeltdown = true;
        }
    }

    // UI UPDATES VOOR DEZE SPECIFIEKE UNIT
    updateDisplay() {
        // 1. Tekst parameters
        document.getElementById(`${this.prefix}-temp`).innerText = this.temp.toFixed(1);
        document.getElementById(`${this.prefix}-power`).innerText = (this.rods * 16.2).toFixed(0);
        document.getElementById(`${this.prefix}-rods`).innerText = this.rods.toFixed(0);
        document.getElementById(`${this.prefix}-flow`).innerText = this.pumpsActive ? "1250" : "0";

        // 2. Visuele balkjes (Gauges)
        const tempGauge = document.getElementById(`${this.prefix}-temp-gauge`);
        const powerGauge = document.getElementById(`${this.prefix}-power-gauge`);

        // Temp Gauge (schaal 200°C - 630°C)
        let tempPerc = Math.min(Math.max(((this.temp - 200) / 430) * 100, 5), 100);
        tempGauge.style.width = tempPerc + "%";

        // Kleurcode voor temp gauge
        tempGauge.className = "gauge-bar-fill"; // Reset classes
        if (this.isMeltdown) tempGauge.classList.add('crit');
        else if (this.temp > 500) tempGauge.classList.add('crit');
        else if (this.temp > 400) tempGauge.classList.add('warn');
        else tempGauge.classList.add('ok');

        // Power Gauge (schaal 0% - 100% rods)
        powerGauge.style.width = this.rods + "%";

        // 3. Status Display
        const status = document.getElementById(`${this.prefix}-status`);
        if (this.isMeltdown) {
            status.innerText = "MELTDOWN";
            status.className = "status-display crit";
        } else if (this.isScram) {
            status.innerText = "SCRAM ACTIVE";
            status.className = "status-display warn";
        } else if (this.temp > 500) {
            status.innerText = "OVERHEAT";
            status.className = "status-display crit";
        } else {
            status.innerText = "NOMINAL";
            status.className = "status-display";
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
        const btn = document.getElementById(`${this.prefix}-pump${id}-btn`);
        if (this.pumpsActive) {
            btn.classList.add('active');
            btn.innerText = "ACTIVE";
        } else {
            btn.classList.remove('active');
            btn.innerText = "OFF";
        }
    }

    scram() {
        this.isScram = true;
        this.rods = 0;
        setTimeout(() => { this.isScram = false; }, 3000); // SCRAM reset na 3 sec
    }
}

// Initialiseer de units globaal
window.u4 = new ReactorUnit('u4');
window.u5 = new ReactorUnit('u5');

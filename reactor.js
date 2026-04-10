class ReactorUnit {
    constructor(prefix) {
        this.prefix = prefix; // Bijv. 'u4' of 'u5'
        this.temp = 285.0;
        this.rods = 0.0;
        this.pumpsActive = false; // Koeling staat start OFF
        this.isScram = false;
        this.isMeltdown = false;
        this.adjustInterval = null;
    }

    calculatePhysics() {
        if (this.isMeltdown) return;

        // Target temperatuur berekenen (Rods up = meer hitte)
        let rawTarget = 285 + (this.rods * 7.5);
        
        // Hitte vermindering door koeling
        let coolingEffect = this.pumpsActive ? (this.rods * 4.0) : 0;
        
        // Final target temperatuur
        let finalTarget = Math.max(285, rawTarget - coolingEffect);
        
        // Traagheid: de temperatuur kruipt naar het doel (inertia)
        this.temp += (finalTarget - this.temp) * 0.04;

        // Meltdown grens
        if (this.temp > 610 && !this.isMeltdown) {
            this.isMeltdown = true;
            this.log("!!! CRITICAL FAILURE: REACTOR MELTDOWN !!!");
        }
    }

    // UI UPDATES VOOR DEZE SPECIFIEKE UNIT
    updateDisplay() {
        // 1. Tekst parameters
        document.getElementById(`${this.prefix}-temp`).innerText = this.temp.toFixed(1);
        document.getElementById(`${this.prefix}-power`).innerText = (this.rods * 15).toFixed(0);
        document.getElementById(`${this.prefix}-rods`).innerText = this.rods.toFixed(0);

        // 2. Visuele balkjes (Gauges)
        const gauge = document.getElementById(`${this.prefix}-gauge`);

        // Temp Gauge (schaal 200°C - 610°C)
        let tempPerc = Math.min(Math.max(((this.temp - 200) / 410) * 100, 5), 100);
        gauge.style.width = tempPerc + "%";

        // Kleurcode voor gauge
        gauge.className = "gauge-fill reset"; // Reset classes
        if (this.isMeltdown) gauge.classList.add('crit');
        else if (this.temp > 500) gauge.classList.add('crit');
        else if (this.temp > 400) gauge.classList.add('warn');
        else gauge.classList.add('ok');

        // 3. Status Display
        const status = document.getElementById(`${this.prefix}-status`);
        if (this.isMeltdown) {
            status.innerText = "MELTDOWN";
            status.className = "status-bar crit";
        } else if (this.isScram) {
            status.innerText = "SCRAM ACTIVE";
            status.className = "status-bar warn";
        } else if (this.temp > 500) {
            status.innerText = "OVERHEAT";
            status.className = "status-bar crit";
        } else {
            status.innerText = "NOMINAL";
            status.className = "status-bar";
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
        const label = document.getElementById(`${this.prefix}-pump${id}-label`);
        
        if (this.pumpsActive) {
            btn.classList.add('active');
            label.innerText = "RUNNING"; label.className = "pump-label on";
            this.log(`Cooling pump 1 ACTIVATED.`);
        } else {
            btn.classList.remove('active');
            label.innerText = "OFF"; label.className = "pump-label off";
            this.log(`Cooling pump 1 STOPPED.`);
        }
    }

    scram() {
        if (this.isMeltdown) return;
        this.isScram = true;
        this.rods = 0;
        this.log("!!! EMERGENCY SHUTDOWN (SCRAM) INITIATED !!!");
        // AudioSystem wordt aangeroepen vanuit main.js voor betere sync
    }

    log(msg) {
        const log = document.getElementById(`${this.prefix}-event-log`);
        const time = new Date().toLocaleTimeString('nl-NL'); // Nederlands tijdformaat
        
        let type = msg.includes("!!!") ? "log-entry crit-msg" : "log-entry";
        log.innerHTML = `<div class="${type}">[${time}] ${msg}</div>` + log.innerHTML;
        
        // Beperk het aantal logregels voor prestaties
        if (log.children.length > 50) {
            log.removeChild(log.lastChild);
        }
    }
}

// Initialiseer de units globaal
window.u4 = new ReactorUnit('u4');
window.u5 = new ReactorUnit('u5');

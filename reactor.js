class NuclearReactor {
    constructor() {
        this.temp = 285.0;
        this.rods = 0.0;
        this.power = 0.0;
        this.isScram = false;
        this.pumpActive = false;
        this.adjustInterval = null;
    }

    // Bereken de natuurkunde van de kern
    calculatePhysics() {
        if (!this.isScram) {
            // Target temperatuur stijgt door staven (rods)
            let targetTemp = 285 + (this.rods * 6.0);
            
            // Koeling effect van de pomp (haalt de target naar beneden)
            if (this.pumpActive) targetTemp -= 150;

            // Vloeiende overgang (traagheid van de hitte)
            this.temp += (targetTemp - this.temp) * 0.05;
            this.power = Math.max(0, this.rods * 15.5);
        } else {
            // Afkoelen na SCRAM (sneller als de pomp aan staat)
            let coolingRate = this.pumpActive ? 0.08 : 0.02;
            this.temp += (285 - this.temp) * coolingRate;
            this.power *= 0.5;
            
            // Auto-reset SCRAM als het afgekoeld is
            if (this.temp < 288) this.isScram = false;
        }
    }

    // Regelstaven bediening
    startAdjust(val) {
        if (this.isScram) return;
        if (this.adjustInterval) clearInterval(this.adjustInterval);
        this.adjustInterval = setInterval(() => {
            this.rods = Math.min(Math.max(this.rods + val, 0), 100);
        }, 50);
    }

    stopAdjust() {
        clearInterval(this.adjustInterval);
        this.adjustInterval = null;
    }

    // Koelpomp aan/uit
    togglePump(id) {
        this.pumpActive = !this.pumpActive;
        const label = document.getElementById(`pump${id}-label`);
        const btn = document.getElementById(`pump${id}-btn`);
        
        if (this.pumpActive) {
            label.innerText = "ON";
            label.className = "pumps-label on";
            btn.classList.add('active');
            this.log(`Cooling Pump ${id}: STARTED`);
        } else {
            label.innerText = "OFF";
            label.className = "pumps-label off";
            btn.classList.remove('active');
            this.log(`Cooling Pump ${id}: STOPPED`);
        }
    }

    scram() {
        this.isScram = true;
        this.rods = 0;
        this.log("!!! EMERGENCY SHUTDOWN ACTIVATED !!!");
        AudioSystem.playAlarm();
        
        // Visuele flits
        document.body.style.backgroundColor = "#300";
        setTimeout(() => document.body.style.backgroundColor = "#000", 200);
    }

    log(msg) {
        const log = document.getElementById('event-log');
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.innerHTML = `> [${new Date().toLocaleTimeString()}] ${msg}`;
        log.prepend(entry);
        if (log.children.length > 12) log.removeChild(log.lastChild);
    }
}

// Maak de reactor beschikbaar voor de andere scripts
const reactor = new NuclearReactor();

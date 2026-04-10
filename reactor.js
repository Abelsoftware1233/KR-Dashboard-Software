class NuclearReactor {
    constructor() {
        this.temp = 285.0;
        this.rods = 0.0;
        this.power = 0.0;
        this.isScram = false;
        this.pumpActive = false;
        this.adjustInterval = null;
    }

    calculatePhysics() {
        if (!this.isScram) {
            // Regelstaven genereren hitte
            let targetTemp = 285 + (this.rods * 5.5);
            
            // Pomp koelt de target temperatuur af
            if (this.pumpActive) targetTemp -= 120;

            // Vloeiende overgang van de temperatuur
            this.temp += (targetTemp - this.temp) * 0.05;
            this.power = Math.max(0, this.rods * 14.5);
        } else {
            // Afkoeling na SCRAM (sneller met pomp)
            let coolingFactor = this.pumpActive ? 0.07 : 0.02;
            this.temp += (285 - this.temp) * coolingFactor;
            this.power *= 0.6;
            
            if (this.temp < 290) this.isScram = false;
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

    togglePump(id) {
        this.pumpActive = !this.pumpActive;
        const btn = document.getElementById(`pump${id}-btn`);
        const label = document.getElementById(`pump${id}-label`);
        
        if (this.pumpActive) {
            btn.classList.add('active');
            label.innerText = "ON";
            label.style.color = "#00ff00";
            this.log(`Cooling Pump ${id}: ACTIVATED`);
        } else {
            btn.classList.remove('active');
            label.innerText = "OFF";
            label.style.color = "#ff4444";
            this.log(`Cooling Pump ${id}: DEACTIVATED`);
        }
    }

    scram() {
        this.isScram = true;
        this.rods = 0;
        this.log("!!! EMERGENCY SHUTDOWN: SCRAM INITIATED !!!");
        AudioSystem.playAlarm();
    }

    log(msg) {
        const log = document.getElementById('event-log');
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.innerHTML = `> [${new Date().toLocaleTimeString()}] ${msg}`;
        log.prepend(entry);
        if (log.children.length > 10) log.removeChild(log.lastChild);
    }
}

// Initialiseer de reactor globaal zodat de HTML erbij kan
const reactor = new NuclearReactor();

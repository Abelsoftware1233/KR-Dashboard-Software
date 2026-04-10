class NuclearReactor {
    constructor(id) {
        this.id = id;
        this.temp = 285.0; // Start Temp
        this.rods = 0.0;
        this.pumpsActive = false; // Koeling staat start OFF
        this.isScram = false;
        this.isMeltdown = false;
        this.adjustInterval = null;
    }

    calculatePhysics() {
        if (this.isMeltdown) return;

        let coolingFactor = this.pumpsActive ? 1.5 : 0.05;
        let pwrFactor = (this.rods / 100); // 0.0 tot 1.0

        if (!this.isScram) {
            // Hitteopbouw door staven - nu trager (factor 12 i.p.v. 6.5)
            let rawTarget = 285 + (this.rods * 12);
            
            // Koeling effect: hoe meer hitte, hoe meer koeling nodig is.
            let heatGeneration = rawTarget - 285;
            let effectiveCooling = coolingFactor * heatGeneration * 0.1;

            // Nieuwe target na koeling
            let finalTarget = Math.max(285, rawTarget - effectiveCooling);
            
            // Fysica-traagheid (nog trager omhoog: 0.01)
            this.temp += (finalTarget - this.temp) * 0.01;
            
        } else {
            // Afkoeling na SCRAM is sneller door regelstaven
            this.temp += (285 - this.temp) * (0.02 + coolingFactor * 0.02);
            if (this.temp < 288) {
                // Veilig genoeg, SCRAM opheffen
                this.isScram = false;
                this.log("System Nominal: Auto SCRAM override active.");
            }
        }

        // Meltdown Check
        if (this.temp > 650 && !this.pumpsActive && !this.isScram) {
            this.triggerMeltdown();
        }
    }

    triggerMeltdown() {
        if (this.isMeltdown) return;
        this.isMeltdown = true;
        AudioSystem.playAlarm(); // Altijd alarm
        this.rods = 100; // Meltdown forces rods open
        this.log("CRITICAL FAILURE: Meltdown confirmed.");
        this.log("Evacuate containment building immediately.");
        // Visueel effect
        document.body.style.backgroundColor = "#ff0000";
        setTimeout(() => { document.body.style.backgroundColor = "var(--danger-color)"; }, 300);
    }

    startAdjust(val) {
        if (this.isScram || this.isMeltdown) return;
        AudioSystem.init(); // Browser audio unlock
        this.adjustInterval = setInterval(() => {
            this.rods = Math.min(Math.max(this.rods + val, 0), 100);
        }, 50);
    }

    stopAdjust() {
        clearInterval(this.adjustInterval);
    }

    togglePump(id) {
        if (this.isMeltdown) return;
        this.pumpsActive = !this.pumpsActive;
        const btn = document.getElementById(`pump${id}-btn`);
        const label = document.getElementById(`pump${id}-label`);

        if (this.pumpsActive) {
            btn.className = "pump-switch active";
            label.innerText = "RUNNING"; label.className = "pumps-label on";
            this.log(`Pump ${id} ACTIVATED: Secondary cooling engaged.`);
        } else {
            btn.className = "pump-switch";
            label.innerText = "OFF"; label.className = "pumps-label off";
            this.log(`Pump ${id} STOPPED: Cooling capacity reduced.`);
        }
    }

    scram() {
        if (this.isMeltdown) return;
        this.isScram = true;
        this.rods = 0;
        AudioSystem.playAlarm();
        this.log("!!! EMERGENCY SHUTDOWN (SCRAM) ACTIVE !!!");
    }

    log(msg) {
        const log = document.getElementById('event-log');
        const timestamp = new Date().toLocaleTimeString('nl-NL'); // Nederlands tijdformaat
        
        let type = msg.includes("!!!") || msg.includes("FAILURE") ? "alarm-msg" : "";
        log.innerHTML = `<div class="${type}">[${timestamp}] ${msg}</div>` + log.innerHTML;
    }
}

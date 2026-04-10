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

        // Target temperatuur: hoe hoger de staven, hoe heter.
        let targetTemp = 285 + (this.rods * 8.0);
        
        // Koeling effect: haalt hitte weg als de pomp aan staat.
        if (this.pumpsActive) {
            targetTemp -= (this.rods * 4.0); 
        }

        // De temperatuur kruipt langzaam naar het doel (inertia).
        let diff = targetTemp - this.temp;
        this.temp += diff * 0.05;

        // Meltdown grens.
        if (this.temp > 610) {
            this.isMeltdown = true;
        }
    }

    startAdjust(val) {
        if (this.isScram || this.isMeltdown) return;
        // Zorg dat we niet meerdere intervallen tegelijk starten.
        if (this.adjustInterval) clearInterval(this.adjustInterval);
        
        this.adjustInterval = setInterval(() => {
            this.rods = Math.min(Math.max(this.rods + val, 0), 100);
            console.log("Rods position:", this.rods); // Debug check in console (F12)
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
            label.className = "pumps-label on";
        } else {
            btn.classList.remove('active');
            label.innerText = "OFF";
            label.className = "pumps-label off";
        }
    }

    scram() {
        this.isScram = true;
        this.rods = 0;
        setTimeout(() => { this.isScram = false; }, 3000);
    }
}

// DIT IS DE FIX: Maak de reactor overal beschikbaar.
window.reactor = new NuclearReactor();

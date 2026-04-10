class ReactorUnit {
    constructor(prefix) {
        this.prefix = prefix; // Bijv. 'u4' of 'u5'
        this.temp = 285.0;
        this.rods = 0.0;
        this.isScram = false;
        this.adjustInterval = null;
    }

    updatePhysics() {
        let target = 285 + (this.rods * 7);
        this.temp += (target - this.temp) * 0.05;

        // Update UI elementen voor DEZE specifieke unit
        document.getElementById(`${this.prefix}-temp`).innerText = this.temp.toFixed(1);
        document.getElementById(`${this.prefix}-power`).innerText = (this.rods * 15).toFixed(0);
        
        // Gauge update
        let perc = Math.min(Math.max(((this.temp - 285) / 400) * 100, 5), 100);
        document.getElementById(`${this.prefix}-gauge`).style.width = perc + "%";

        // Status update
        let status = document.getElementById(`${this.prefix}-status`);
        if (this.temp > 550) {
            status.innerText = "CRITICAL";
            status.className = "status-box crit";
        } else {
            status.innerText = "NOMINAL";
            status.className = "status-box";
        }
    }

    startAdjust(val) {
        if (this.adjustInterval) clearInterval(this.adjustInterval);
        this.adjustInterval = setInterval(() => {
            this.rods = Math.min(Math.max(this.rods + val, 0), 100);
        }, 50);
    }

    stopAdjust() {
        clearInterval(this.adjustInterval);
    }

    scram() {
        this.rods = 0;
        this.isScram = true;
        setTimeout(() => this.isScram = false, 2000);
    }
}

// Maak twee aparte reactors aan
window.u4 = new ReactorUnit('u4');
window.u5 = new ReactorUnit('u5');

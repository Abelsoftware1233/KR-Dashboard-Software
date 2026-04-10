/**
 * NPP Command Center Main Controller v4.0
 * Beheert de communicatie tussen de Reactor Units en de UI.
 */

const MainController = {
    startTime: Date.now(),
    lastLog: 0,
    logFrequency: 5000, // Elke 5 seconden een status log

    /**
     * Start de centrale simulatie loop
     */
    init() {
        console.log("NPP Systems Initialized...");
        this.addLogEntry("SYSTEM", "Central Command Hub online. Units 4 & 5 linked.", "green");
        this.startLoop();
    },

    /**
     * De hartslag van de applicatie (60fps)
     */
    startLoop() {
        const tick = () => {
            this.updateAllUnits();
            this.updateGlobalUI();
            this.checkSystemThresholds();
            this.handleAutomatedLogging();
            
            requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    },

    /**
     * Stuurt fysica-berekeningen en UI-updates aan voor beide reactors
     */
    updateAllUnits() {
        if (window.u4) {
            window.u4.calculatePhysics();
            window.u4.updateDisplay();
        }
        if (window.u5) {
            window.u5.calculatePhysics();
            window.u5.updateDisplay();
        }
    },

    /**
     * Algemene UI elementen buiten de units om (Klok, uptime, etc.)
     */
    updateGlobalUI() {
        // Update de klok
        const now = new Date();
        document.getElementById('system-clock').innerText = now.toLocaleTimeString('nl-NL');

        // Bereken uptime
        const uptimeSeconds = Math.floor((Date.now() - this.startTime) / 1000);
        const systemTag = document.getElementById('system-status');
        
        // Update algemene systeemstatus tag
        if (window.u4.isMeltdown || window.u5.isMeltdown) {
            systemTag.innerText = "CRITICAL FAILURE";
            systemTag.className = "status-tag warn"; // Rood knipperend via CSS
        } else if (window.u4.temp > 500 || window.u5.temp > 500) {
            systemTag.innerText = "THERMAL WARNING";
            systemTag.className = "status-tag warn";
        } else {
            systemTag.innerText = "SYSTEMS NOMINAL";
            systemTag.className = "status-tag ok";
        }
    },

    /**
     * Houdt drempelwaarden in de gaten voor automatische acties of waarschuwingen
     */
    checkSystemThresholds() {
        [window.u4, window.u5].forEach(unit => {
            if (unit.temp > 600 && !unit.warningSent) {
                this.addLogEntry(unit.prefix.toUpperCase(), "Core temperature exceeds safety limit!", "red");
                unit.warningSent = true; 
            }
            if (unit.temp < 500) unit.warningSent = false; // Reset warning
        });
    },

    /**
     * Voegt een regel toe aan de operational log (indien aanwezig in je HTML)
     */
    addLogEntry(source, message, color = "white") {
        const logBox = document.getElementById('event-log');
        if (!logBox) return; // Stop als er geen log-div is

        const time = new Date().toLocaleTimeString('nl-NL', { hour12: false });
        const entry = document.createElement('div');
        entry.style.color = color === "green" ? "#00ff73" : (color === "red" ? "#ff3c3c" : "#ffb400");
        entry.style.fontSize = "0.7rem";
        entry.style.marginBottom = "2px";
        entry.innerHTML = `[${time}] [${source}] ${message}`;

        logBox.prepend(entry); // Nieuwste bericht bovenaan
        
        // Beperk het aantal logregels voor prestaties
        if (logBox.children.length > 50) {
            logBox.removeChild(logBox.lastChild);
        }
    },

    /**
     * Genereert periodiek een statusrapport in de console/log
     */
    handleAutomatedLogging() {
        const now = Date.now();
        if (now - this.lastLog > this.logFrequency) {
            const avgTemp = (window.u4.temp + window.u5.temp) / 2;
            console.log(`Command Center Audit: Avg Temp ${avgTemp.toFixed(1)}°C`);
            this.lastLog = now;
        }
    }
};

/**
 * Event Listeners & Bootup
 */
window.onload = () => {
    MainController.init();
};

// Helper voor audio (optioneel, als je audio.js gebruikt)
function toggleGlobalAlarm(state) {
    if (typeof AudioSystem !== 'undefined') {
        state ? AudioSystem.play() : AudioSystem.stop();
    }
}

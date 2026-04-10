/**
 * NPP Command Center Controller v4.0
 * Beheert de communicatie tussen de Reactor Units en de UI.
 */

const MainController = {
    /**
     * Start de centrale simulatie loop
     */
    init() {
        console.log("NPP DUAL SYSTEMS ONLINE...");
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
            
            requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    },

    /**
     * Stuurt fysica-berekeningen en UI-updates aan voor beide reactors
     */
    updateAllUnits() {
        // We halen ze op uit het globale window object waar reactor.js ze heeft gezet
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

        // Update algemene systeemstatus tag
        const systemTag = document.getElementById('system-status');
        
        if (window.u4.isMeltdown || window.u5.isMeltdown) {
            systemTag.innerText = "CRITICAL FAILURE";
            systemTag.className = "status-tag warn"; // Rood knipperend via CSS
        } else if (window.u4.temp > 500 || window.u5.temp > 500) {
            systemTag.innerText = "WARNING";
            systemTag.className = "status-tag warn";
        } else {
            systemTag.innerText = "SYSTEMS NOMINAL";
            systemTag.className = "status-tag ok";
        }
    },
};

/**
 * Event Listeners & Bootup
 */
window.onload = () => {
    MainController.init();
};

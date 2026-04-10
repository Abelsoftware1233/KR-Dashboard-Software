/**
 * REACTOR CONTROL SYSTEM - script.js
 * Geoptimaliseerd voor de Echo AI Repository
 */

let state = {
    temp: 285.0,
    targetTemp: 285.0,
    power: 0.0,
    rods: 0.0,
    isScram: false
};

let adjustInterval = null;

// --- CORE SIMULATIE LOOP ---
// Draait elke 100ms voor een realistische physics-ervaring
setInterval(() => {
    if (!state.isScram) {
        // Bereken doeltemperatuur gebaseerd op regelstaven (rods)
        state.targetTemp = 285 + (state.rods * 4.5);
        
        // Geleidelijke temperatuurstijging (simuleert thermische traagheid)
        state.temp += (state.targetTemp - state.temp) * 0.1;
        state.power = state.rods * 15.2;
    } else {
        // Koelingsfase na noodstop (SCRAM)
        state.temp += (285 - state.temp) * 0.05;
        state.power *= 0.5;

        // Auto-reset: Als de kern is afgekoeld, mag de SCRAM eraf
        if (state.temp < 290 && state.isScram) {
            state.isScram = false;
            logEvent("System stabilized. Manual restart allowed.");
        }
    }
    
    updateDisplay();
}, 100);

// --- UI UPDATES ---
function updateDisplay() {
    // Waarden bijwerken
    document.getElementById('temp-val').innerText = state.temp.toFixed(1);
    document.getElementById('power-val').innerText = state.power.toFixed(0);
    document.getElementById('rod-val').innerText = state.rods.toFixed(0);
    
    // Status indicator logica
    const indicator = document.getElementById('status-indicator');
    const gauge = document.getElementById('temp-gauge');

    if (state.temp > 550) {
        indicator.innerText = "OVERHEAT CRITICAL";
        indicator.className = "status-crit";
        if (gauge) gauge.style.backgroundColor = "#ff4444";
    } else if (state.temp > 400) {
        indicator.innerText = "WARNING: HIGH TEMP";
        indicator.className = "status-warn";
        if (gauge) gauge.style.backgroundColor = "#ffb000";
    } else {
        indicator.innerText = state.isScram ? "SHUTDOWN" : "NOMINAL";
        indicator.className = "status-ok";
        if (gauge) gauge.style.backgroundColor = "#00ff00";
    }

    // Gauge bar breedte (visueel)
    if (gauge) {
        let perc = ((state.temp - 285) / (650 - 285)) * 100;
        gauge.style.width = Math.min(Math.max(perc, 2), 100) + "%";
    }

    // Klok update
    document.getElementById('system-clock').innerText = new Date().toLocaleTimeString();
}

// --- CONTROLS ---
function startAdjust(val) {
    if (state.isScram) return;
    
    // Voorkom dubbele intervallen
    if (adjustInterval) stopAdjust();

    adjustInterval = setInterval(() => {
        let oldRods = state.rods;
        state.rods = Math.min(Math.max(state.rods + val, 0), 100);
        
        // Alleen loggen bij significante verandering om spam te voorkomen
        if (Math.round(oldRods) !== Math.round(state.rods)) {
            logEvent(`Rods adjusted: ${state.rods.toFixed(0)}%`);
        }
    }, 50);
}

function stopAdjust() {
    clearInterval(adjustInterval);
    adjustInterval = null;
}

function scram() {
    state.isScram = true;
    state.rods = 0;
    logEvent("!!! EMERGENCY SHUTDOWN ACTIVATED !!!");
    
    // Visuele feedback op het scherm
    document.body.style.backgroundColor = "#200";
    setTimeout(() => { document.body.style.backgroundColor = "#000"; }, 200);
}

function logEvent(msg) {
    const log = document.getElementById('event-log');
    if (!log) return;
    
    log.innerHTML = `<div>> ${msg}</div>` + log.innerHTML;
    
    // Beperk het aantal log-regels voor performance
    if (log.children.length > 15) {
        log.removeChild(log.lastChild);
    }
}

// --- EVENT LISTENERS (Koppeling met HTML) ---
window.addEventListener('DOMContentLoaded', () => {
    const btnUp = document.getElementById('btn-up');
    const btnDown = document.getElementById('btn-down');
    const btnScram = document.getElementById('btn-scram');

    if (btnUp && btnDown && btnScram) {
        // Desktop Muis Events
        btnUp.addEventListener('mousedown', () => startAdjust(1.5));
        btnUp.addEventListener('mouseup', stopAdjust);
        btnUp.addEventListener('mouseleave', stopAdjust);

        btnDown.addEventListener('mousedown', () => startAdjust(-1.5));
        btnDown.addEventListener('mouseup', stopAdjust);
        btnDown.addEventListener('mouseleave', stopAdjust);

        // Mobiel Touch Events
        btnUp.addEventListener('touchstart', (e) => { e.preventDefault(); startAdjust(1.5); });
        btnUp.addEventListener('touchend', stopAdjust);
        
        btnDown.addEventListener('touchstart', (e) => { e.preventDefault(); startAdjust(-1.5); });
        btnDown.addEventListener('touchend', stopAdjust);

        // SCRAM actie
        btnScram.addEventListener('click', scram);
    }
});

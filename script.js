let state = {
    temp: 285.0,
    targetTemp: 285.0,
    power: 0.0,
    rods: 0.0,
    isScram: false
};

let adjustInterval = null;

// Real-time simulatie loop
setInterval(() => {
    if (!state.isScram) {
        // Natuurlijke hitte opbouw op basis van regelstaven
        state.targetTemp = 285 + (state.rods * 4.5);
        
        // Geleidelijke verandering (traagheid)
        state.temp += (state.targetTemp - state.temp) * 0.1;
        state.power = state.rods * 15.2;
    } else {
        // Afkoelen na SCRAM
        state.temp += (285 - state.temp) * 0.05;
        state.power *= 0.5;
    }
    
    updateDisplay();
}, 100);

function updateDisplay() {
    document.getElementById('temp-val').innerText = state.temp.toFixed(1);
    document.getElementById('power-val').innerText = state.power.toFixed(0);
    
    const indicator = document.getElementById('status-indicator');
    if (state.temp > 550) {
        indicator.innerText = "OVERHEAT CRITICAL";
        indicator.className = "status-crit";
    } else if (state.temp > 400) {
        indicator.innerText = "WARNING: HIGH TEMP";
        indicator.className = "status-warn";
    } else {
        indicator.innerText = state.isScram ? "SHUTDOWN" : "NOMINAL";
        indicator.className = "status-ok";
    }

    // Tijd update
    document.getElementById('system-clock').innerText = new Date().toLocaleTimeString();
}

function startAdjust(val) {
    if (state.isScram) return;
    adjustInterval = setInterval(() => {
        state.rods = Math.min(Math.max(state.rods + val, 0), 100);
        logEvent(`Rods adjusted to ${state.rods.toFixed(0)}%`);
    }, 50);
}

function stopAdjust() {
    clearInterval(adjustInterval);
}

function scram() {
    state.isScram = true;
    state.rods = 0;
    logEvent("!!! EMERGENCY SHUTDOWN ACTIVATED !!!");
    document.body.style.backgroundColor = "#200";
    setTimeout(() => { document.body.style.backgroundColor = "#000"; }, 200);
}

function logEvent(msg) {
    const log = document.getElementById('event-log');
    log.innerHTML = `> ${msg}<br>` + log.innerHTML;
}

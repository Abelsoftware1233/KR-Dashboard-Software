const reactor = new NuclearReactor("Unit 4");

function runSimulation() {
    // 1. Fysica berekenen
    reactor.calculatePhysics();

    // 2. Cijfers updaten in de interface
    document.getElementById('temp-val').innerText = reactor.temp.toFixed(1);
    document.getElementById('power-val').innerText = reactor.power.toFixed(0);
    document.getElementById('rod-val').innerText = reactor.rods.toFixed(0);

    // 3. Balk (Gauge) updaten
    const gauge = document.getElementById('temp-gauge');
    if (gauge) {
        let percentage = ((reactor.temp - 285) / (620 - 285)) * 100;
        gauge.style.width = Math.min(Math.max(percentage, 2), 100) + "%";
        
        // Kleur aanpassen op basis van hitte
        if (reactor.temp > 550) gauge.style.backgroundColor = "#ff4444";
        else if (reactor.temp > 400) gauge.style.backgroundColor = "#ffb000";
        else gauge.style.backgroundColor = "#00ff00";
    }

    // 4. Status & Alarm Logica
    const status = document.getElementById('status-indicator');
    if (status) {
        if (reactor.isMeltdown) {
            status.innerText = "MELTDOWN CRITICAL";
            status.className = "status-crit";
            if (typeof AudioSystem !== 'undefined') AudioSystem.playAlarm();
        } else if (reactor.isScram) {
            status.innerText = "SCRAM ACTIVE";
            status.className = "status-warn";
            if (typeof AudioSystem !== 'undefined') AudioSystem.playAlarm();
        } else if (reactor.temp > 500) {
            status.innerText = "WARNING: OVERHEAT";
            status.className = "status-warn";
            if (typeof AudioSystem !== 'undefined') AudioSystem.playAlarm();
        } else {
            status.innerText = "NOMINAL";
            status.className = "status-ok";
            if (typeof AudioSystem !== 'undefined') AudioSystem.stopAlarm();
        }
    }

    // Klok update
    document.getElementById('system-clock').innerText = new Date().toLocaleTimeString();

    requestAnimationFrame(runSimulation);
}

// Event Listeners koppelen
window.addEventListener('DOMContentLoaded', () => {
    const btnUp = document.getElementById('btn-up');
    const btnDown = document.getElementById('btn-down');
    const btnScram = document.getElementById('btn-scram');

    // Muis controls
    btnUp.addEventListener('mousedown', () => reactor.startAdjust(1));
    btnUp.addEventListener('mouseup', () => reactor.stopAdjust());
    btnUp.addEventListener('mouseleave', () => reactor.stopAdjust());

    btnDown.addEventListener('mousedown', () => reactor.startAdjust(-1));
    btnDown.addEventListener('mouseup', () => reactor.stopAdjust());
    btnDown.addEventListener('mouseleave', () => reactor.stopAdjust());

    btnScram.addEventListener('click', () => reactor.scram());

    // Touch controls voor mobiel
    btnUp.addEventListener('touchstart', (e) => { e.preventDefault(); reactor.startAdjust(1); });
    btnDown.addEventListener('touchstart', (e) => { e.preventDefault(); reactor.startAdjust(-1); });
    btnUp.addEventListener('touchend', () => reactor.stopAdjust());
    btnDown.addEventListener('touchend', () => reactor.stopAdjust());

    // Start de simulatie
    runSimulation();
});

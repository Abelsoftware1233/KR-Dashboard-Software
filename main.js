// Initialiseer de reactor
const reactor = new NuclearReactor("UNIT-4");

function updateLoop() {
    // 1. Bereken nieuwe waarden (fysica)
    reactor.calculatePhysics();
    
    // 2. Update de UI (Metrieken)
    document.getElementById('temp-val').innerText = reactor.temp.toFixed(1);
    
    // Analog Gauge update
    const gaugeBar = document.getElementById('temp-gauge');
    // Scale 200°C - 600°C (285 is start, 650 is meltdown)
    let gaugePercentage = Math.min(Math.max((reactor.temp - 200) / 400 * 100, 0), 100);
    gaugeBar.style.width = gaugePercentage + "%";
    
    // Gauge kleur verandering
    if (reactor.temp > 550) { gaugeBar.style.background = "var(--danger-color)"; }
    else if (reactor.temp > 450) { gaugeBar.style.background = "#ffff00"; }
    else { gaugeBar.style.background = "var(--ok-color)"; }

    document.getElementById('power-val').innerText = (reactor.rods * 18).toFixed(0);
    document.getElementById('rod-val').innerText = reactor.rods.toFixed(0);
    
    // Status logica
    const indicator = document.getElementById('status-indicator');
    
    if (reactor.isMeltdown) {
        indicator.innerText = "!!! MELTDOWN !!!";
        indicator.className = "status-crit Meltdown!!!";
        // Het alarm is geactiveerd door reactor.js
    } else if (reactor.temp > 600) {
        indicator.innerText = "MELTDOWN THREAT";
        indicator.className = "status-crit Meltdown imminent";
        if (!reactor.isScram) AudioSystem.playAlarm(); // Start alarm als het kritiek is
    } else if (reactor.temp > 480) {
        indicator.innerText = "TEMP WARNING";
        indicator.className = "status-warn Temp High";
    } else if (reactor.isScram) {
        indicator.innerText = "AUTO SCRAM";
        indicator.className = "status-crit Alarm (SCRAM)";
    } else {
        indicator.innerText = "NOMINAL";
        indicator.className = "status-ok";
        // Stop alarm als het weer veilig is (en niet handmatig gesilenced)
        if (!AudioSystem.isManualSilence) {
            AudioSystem.stopAlarm();
        }
    }

    // Systeemklok
    document.getElementById('system-clock').innerText = new Date().toLocaleTimeString('nl-NL');

    // Volgende frame aanvragen (60fps)
    requestAnimationFrame(updateLoop);
}

// Start de simulatie
updateLoop();

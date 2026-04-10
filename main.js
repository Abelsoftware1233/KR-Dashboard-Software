const reactor = new NuclearReactor("UNIT-4");

function updateLoop() {
    reactor.calculatePhysics();
    
    // UI Updates
    document.getElementById('temp-val').innerText = reactor.temp.toFixed(1);
    document.getElementById('power-val').innerText = (reactor.rods * 15).toFixed(0);
    document.getElementById('rod-val').innerText = reactor.rods.toFixed(0);
    
    const indicator = document.getElementById('status-indicator');
    
    if (reactor.temp > 550) {
        indicator.innerText = "MELTDOWN CRITICAL";
        indicator.className = "status-crit";
        AudioSystem.playAlarm();
    } else if (reactor.temp > 450) {
        indicator.innerText = "HIGH TEMP WARNING";
        indicator.className = "status-warn";
    } else if (reactor.isScram) {
        indicator.innerText = "SCRAM ACTIVE";
        indicator.className = "status-crit";
    } else {
        indicator.innerText = "NOMINAL";
        indicator.className = "status-ok";
    }

    document.getElementById('system-clock').innerText = new Date().toLocaleTimeString();
    requestAnimationFrame(updateLoop);
}

updateLoop();

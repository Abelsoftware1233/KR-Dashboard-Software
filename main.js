const reactor = new NuclearReactor("CORE-01");

function updateLoop() {
    reactor.calculatePhysics();
    
    // UI Updates
    document.getElementById('temp-val').innerText = reactor.temp.toFixed(1);
    document.getElementById('power-val').innerText = (reactor.rods * 12).toFixed(0);
    document.getElementById('rod-val').innerText = reactor.rods.toFixed(0);
    
    const indicator = document.getElementById('status-indicator');
    if (reactor.temp > 500) {
        indicator.innerText = "CRITICAL";
        indicator.className = "status-crit";
        if(!reactor.isScram) AudioSystem.playAlarm(); 
    } else {
        indicator.innerText = reactor.isScram ? "OFFLINE" : "NOMINAL";
        indicator.className = reactor.isScram ? "status-warn" : "status-ok";
    }

    document.getElementById('system-clock').innerText = new Date().toLocaleTimeString();
    requestAnimationFrame(updateLoop);
}

// Start de loop
updateLoop();

function runSimulation() {
    // 1. Fysica berekenen
    reactor.calculatePhysics();

    // 2. Cijfers updaten
    document.getElementById('temp-val').innerText = reactor.temp.toFixed(1);
    document.getElementById('power-val').innerText = (reactor.rods * 12.5).toFixed(0);
    document.getElementById('rod-val').innerText = reactor.rods.toFixed(0);

    // 3. Balk (Gauge) updaten
    const gauge = document.getElementById('temp-gauge');
    let percentage = ((reactor.temp - 285) / (620 - 285)) * 100;
    gauge.style.width = Math.min(Math.max(percentage, 2), 100) + "%";

    // 4. Status & Alarm Logica
    const status = document.getElementById('status-indicator');
    
    if (reactor.isMeltdown) {
        status.innerText = "MELTDOWN";
        status.className = "status-crit";
        AudioSystem.play();
    } else if (reactor.isScram) {
        status.innerText = "SCRAM ACTIVE";
        status.className = "status-crit";
        AudioSystem.play();
        if (reactor.temp < 290) reactor.isScram = false; // Reset na afkoeling
    } else if (reactor.temp > 500) {
        status.innerText = "OVERHEAT";
        status.className = "status-crit";
        AudioSystem.play();
    } else {
        status.innerText = "NOMINAL";
        status.className = "status-ok";
        AudioSystem.stop();
    }

    // Klok
    document.getElementById('system-clock').innerText = new Date().toLocaleTimeString();

    requestAnimationFrame(runSimulation);
}

// Start de loop
window.onload = () => {
    runSimulation();
};

function updateUI() {
    // 1. Bereken nieuwe waarden
    reactor.calculatePhysics();

    // 2. Update de teksten
    document.getElementById('temp-val').innerText = reactor.temp.toFixed(1);
    document.getElementById('power-val').innerText = reactor.power.toFixed(0);
    document.getElementById('rod-val').innerText = reactor.rods.toFixed(0);

    // 3. Update de visuele Gauge (Balk)
    const gauge = document.getElementById('temp-gauge');
    // We schalen de balk tussen 285 en 850 graden
    let perc = ((reactor.temp - 285) / (850 - 285)) * 100;
    gauge.style.width = Math.min(Math.max(perc, 5), 100) + "%";

    // Kleur van de balk aanpassen op basis van hitte
    if (reactor.temp > 600) gauge.style.backgroundColor = "#ff0000";
    else if (reactor.temp > 450) gauge.style.backgroundColor = "#ffaa00";
    else gauge.style.backgroundColor = "#00ff00";

    // 4. Status Indicator
    const status = document.getElementById('status-indicator');
    if (reactor.isScram) {
        status.innerText = "SCRAM ACTIVE";
        status.className = "status-crit";
    } else if (reactor.temp > 550) {
        status.innerText = "OVERHEAT";
        status.className = "status-crit";
        AudioSystem.playAlarm();
    } else {
        status.innerText = "NOMINAL";
        status.className = "status-ok";
    }

    // 5. Klok
    document.getElementById('system-clock').innerText = new Date().toLocaleTimeString();

    // Loop de animatie (vloeiende 60fps)
    requestAnimationFrame(updateUI);
}

// Start de loop zodra de pagina geladen is
window.onload = () => {
    updateUI();
};

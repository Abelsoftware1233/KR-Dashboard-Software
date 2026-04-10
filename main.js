function updateUI() {
    // 1. Berekening uitvoeren
    reactor.calculatePhysics();

    // 2. Tekst updaten
    document.getElementById('temp-val').innerText = reactor.temp.toFixed(1);
    document.getElementById('power-val').innerText = reactor.power.toFixed(0);
    document.getElementById('rod-val').innerText = reactor.rods.toFixed(0);

    // 3. De Gauge (Balk) animeren
    const gauge = document.getElementById('temp-gauge');
    // We schalen de balk tussen 285 en 800 graden
    let perc = ((reactor.temp - 285) / (800 - 285)) * 100;
    gauge.style.width = Math.min(Math.max(perc, 5), 100) + "%";

    // 4. Status Indicator kleuren
    const status = document.getElementById('status-indicator');
    if (reactor.isScram) {
        status.innerText = "SCRAM";
        status.className = "status-crit";
    } else if (reactor.temp > 550) {
        status.innerText = "OVERHEAT";
        status.className = "status-warn";
        AudioSystem.playAlarm(); // Automatisch alarm bij oververhitting
    } else {
        status.innerText = "NOMINAL";
        status.className = "status-ok";
    }

    // 5. Klok
    document.getElementById('system-clock').innerText = new Date().toLocaleTimeString();

    requestAnimationFrame(updateUI);
}

// Start de loop zodra alles geladen is
window.onload = updateUI;

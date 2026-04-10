function updateUI() {
    // Haal de reactor op uit het globale window object
    const r = window.reactor;

    // Update Tekst
    document.getElementById('temp-val').innerText = r.temp.toFixed(1);
    document.getElementById('power-val').innerText = (r.rods * 12).toFixed(0);
    document.getElementById('rod-val').innerText = r.rods.toFixed(0);

    // Update de Balk (Gauge)
    const gauge = document.getElementById('temp-gauge');
    let percentage = ((r.temp - 285) / (600 - 285)) * 100;
    gauge.style.width = Math.min(Math.max(percentage, 5), 100) + "%";

    // Kleur van de balk
    if (r.temp > 500) gauge.style.background = "#ff3c3c";
    else if (r.temp > 400) gauge.style.background = "#ffb400";
    else gauge.style.background = "#00ff73";

    // Status Indicator
    const status = document.getElementById('status-indicator');
    if (r.isMeltdown) {
        status.innerText = "MELTDOWN";
        status.className = "status-crit";
    } else if (r.isScram) {
        status.innerText = "SCRAM ACTIVE";
        status.className = "status-crit";
    } else if (r.temp > 450) {
        status.innerText = "WARNING";
        status.className = "status-warn";
    } else {
        status.innerText = "NOMINAL";
        status.className = "status-ok";
    }

    // Klok
    document.getElementById('system-clock').innerText = new Date().toLocaleTimeString();

    // Loop de fysica en UI
    r.calculatePhysics();
    requestAnimationFrame(updateUI);
}

// Start de loop zodra de pagina geladen is
window.onload = updateUI;

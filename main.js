function updateDashboard() {
    const r = window.reactor; // Pak de globale reactor

    if (!r) return;

    // Fysica berekenen
    r.calculatePhysics();

    // UI elementen vullen
    document.getElementById('temp-val').innerText = r.temp.toFixed(1);
    document.getElementById('power-val').innerText = (r.rods * 15).toFixed(0);
    document.getElementById('rod-val').innerText = r.rods.toFixed(0);

    // De visuele balk (gauge)
    const gauge = document.getElementById('temp-gauge');
    let percentage = ((r.temp - 200) / 400) * 100;
    gauge.style.width = Math.min(Math.max(percentage, 5), 100) + "%";

    // Status tekst
    const indicator = document.getElementById('status-indicator');
    if (r.isMeltdown) {
        indicator.innerText = "MELTDOWN";
        indicator.className = "status-crit";
    } else if (r.temp > 450) {
        indicator.innerText = "WARNING";
        indicator.className = "status-warn";
    } else {
        indicator.innerText = "NOMINAL";
        indicator.className = "status-ok";
    }

    // Klok
    document.getElementById('system-clock').innerText = new Date().toLocaleTimeString();

    // Volgende frame
    requestAnimationFrame(updateDashboard);
}

// Start de loop zodra de pagina klaar is
window.onload = updateDashboard;

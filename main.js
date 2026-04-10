function runCommandCenter() {
    // 1. Update Unit 4
    window.u4.calculatePhysics();
    window.u4.updateDisplay();

    // 2. Update Unit 5
    window.u5.calculatePhysics();
    window.u5.updateDisplay();

    // Systeemklok
    document.getElementById('system-clock').innerText = new Date().toLocaleTimeString('nl-NL');

    // Volgende frame aanvragen (60fps)
    requestAnimationFrame(runCommandCenter);
}

// Start de simulatie zodra de pagina geladen is
window.onload = runCommandCenter;

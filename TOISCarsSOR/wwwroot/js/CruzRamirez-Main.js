document.addEventListener('DOMContentLoaded', () => {

    // 1. Instancia y configuración del archivo de audio real
    const engineAudio = new Audio('assets/audio/CREngineF.mp3'); // Asegúrate de colocar la ruta correcta de tu archivo
    engineAudio.volume = 0.8; // Control de volumen (0.0 a 1.0)

const btnRev = document.getElementById('btn-engine-rev');

function playEngineSound() {
    try {
        // Reinicia la reproducción al segundo 0 para permitir aceleraciones rápidas consecutivas
        engineAudio.currentTime = 0;

        const playPromise = engineAudio.play();

        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.warn('La reproducción automática fue bloqueada o el archivo de audio no existe:', error);
            });
        }

        // Efecto visual en el botón HUD al acelerar
        if (btnRev) {
            btnRev.classList.add('scale-110', 'bg-brand-yellow');
            setTimeout(() => btnRev.classList.remove('scale-110', 'bg-brand-yellow'), 300);
        }
    } catch (e) {
        console.error('Error al intentar reproducir el archivo de audio:', e);
    }
}

if (btnRev) {
    btnRev.addEventListener('click', playEngineSound);
}
    // 2. Easter Egg de Teclado (Tecla 'K' para acelerar)
    window.addEventListener('keydown', (e) => {
        // Evitar que active el sonido si el usuario está escribiendo en un input o textarea
        if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

        if (e.key === 'k' || e.key === 'K') {
            playEngineSound();
        }
    });

    // 3. Botón "Volver al Inicio" con la instancia global de Lenis Smooth Scroll
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            if (window.lenis) {
                window.lenis.scrollTo(0, { duration: 1.5 });
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }
});

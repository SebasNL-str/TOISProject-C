document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. MOTOR AUDIO & EASTER EGG (TECLA 'K')
    // ----------------------------------------------------
    const engineAudio = new Audio('assets/audio/CREngineF.mp3');
    engineAudio.volume = 0.8;
    const btnRev = document.getElementById('btn-engine-rev');

    function playEngineSound() {
        try {
            engineAudio.currentTime = 0;
            const playPromise = engineAudio.play();

            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.warn('Reproducción automática bloqueada o archivo no encontrado:', error);
                });
            }

            if (btnRev) {
                btnRev.classList.add('scale-110', 'bg-brand-yellow');
                setTimeout(() => btnRev.classList.remove('scale-110', 'bg-brand-yellow'), 300);
            }
        } catch (e) {
            console.error('Error al reproducir audio:', e);
        }
    }

    if (btnRev) {
        btnRev.addEventListener('click', playEngineSound);
    }

    window.addEventListener('keydown', (e) => {
        if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
        if (e.key === 'k' || e.key === 'K') {
            playEngineSound();
        }
    });

    // ----------------------------------------------------
    // 2. BOTÓN "VOLVER AL INICIO" (LENIS / SMOOTH SCROLL)
    // ----------------------------------------------------
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

    // ----------------------------------------------------
    // 3. LÍNEA DE TIEMPO (TIMELINE STICKY: SCROLL + HOVER)
    // ----------------------------------------------------
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineImages = document.querySelectorAll('.timeline-img');
    const phaseLabel = document.getElementById('timeline-phase-label');

    const phasesText = [
        "01 // RUST-EZE",
        "02 // THUNDER HOLLOW",
        "03 // FLORIDA 500",
        "04 // DINOCO #51"
    ];

    function setActiveChapter(activeIndex) {
        // Validar que el índice sea válido
        if (activeIndex < 0 || activeIndex >= timelineImages.length) return;

        // Alternar imágenes activas con opacidad y escala fluida
        timelineImages.forEach((img, i) => {
            if (i === activeIndex) {
                img.classList.remove('opacity-0', 'scale-95');
                img.classList.add('opacity-100', 'scale-100');
            } else {
                img.classList.remove('opacity-100', 'scale-100');
                img.classList.add('opacity-0', 'scale-95');
            }
        });

        // Actualizar etiqueta HUD
        if (phaseLabel && phasesText[activeIndex]) {
            phaseLabel.textContent = phasesText[activeIndex];
        }
    }

    // Sincronización precisa mediante ScrollTrigger (onToggle)
    if (typeof ScrollTrigger !== 'undefined' && timelineItems.length > 0) {
        timelineItems.forEach((item, index) => {
            ScrollTrigger.create({
                trigger: item,
                start: 'top center+=100',
                end: 'bottom center-=100',
                onToggle: (self) => {
                    if (self.isActive) {
                        setActiveChapter(index);
                    }
                }
            });
        });
    }

    // Interacción instantánea por Hover del mouse
    timelineItems.forEach((item, index) => {
        item.addEventListener('mouseenter', () => {
            setActiveChapter(index);
        });
    });
});

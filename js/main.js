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

    const modelViewer = document.getElementById('cruz-3d-model');
    const btnRusteze = document.getElementById('btn-livery-rusteze');
    const btnDinoco = document.getElementById('btn-livery-dinoco');
    const glowBg = document.getElementById('hero-3d-glow');

    if (modelViewer && btnRusteze && btnDinoco) {
        // Cambiar a versión Rust-eze
        btnRusteze.addEventListener('click', () => {
            modelViewer.setAttribute('src', 'assets/models/cruz-rusteze.glb');

            // Actualizar clases de los botones
            btnRusteze.className = 'px-3 py-1 rounded-full bg-brand-yellow text-black font-bold shadow-lg transition-all focus:outline-none';
            btnDinoco.className = 'px-3 py-1 rounded-full text-neutral-400 hover:text-white transition-all font-bold focus:outline-none';

            // Cambiar brillo y color del glow de fondo
            if (glowBg) {
                glowBg.className = 'absolute inset-0 bg-gradient-to-t from-brand-yellow/30 via-neutral-800/20 to-transparent rounded-full blur-3xl opacity-70 pointer-events-none transition-all duration-700';
            }
        });

        // Cambiar a versión Dinoco #51
        btnDinoco.addEventListener('click', () => {
            modelViewer.setAttribute('src', 'assets/models/cruz-dinoco.glb');

            // Actualizar clases de los botones
            btnDinoco.className = 'px-3 py-1 rounded-full bg-brand-yellow text-black font-bold shadow-lg transition-all focus:outline-none';
            btnRusteze.className = 'px-3 py-1 rounded-full text-neutral-400 hover:text-white transition-all font-bold focus:outline-none';

            // Cambiar brillo y color del glow de fondo
            if (glowBg) {
                glowBg.className = 'absolute inset-0 bg-gradient-to-t from-brand-red/30 via-brand-yellow/10 to-transparent rounded-full blur-3xl opacity-70 pointer-events-none transition-all duration-700';
            }
        });
    }
});

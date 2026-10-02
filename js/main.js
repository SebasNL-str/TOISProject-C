    // Inicialización del Smooth Scroll (Lenis) y sincronización con GSAP
    document.addEventListener('DOMContentLoaded', () => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                                orientation: 'vertical',
                                smoothWheel: true,
        });

        // Conectar ScrollTrigger de GSAP con Lenis
        lenis.on('scroll', ScrollTrigger.update);

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);

        // 1. Web Audio API - Sintetizador del Rugido del Motor (Sin necesidad de archivos de audio externos)
        const btnRev = document.getElementById('btn-engine-rev');

        function playEngineSound() {
            try {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                const ctx = new AudioCtx();

                // Oscilador para la frecuencia baja del motor
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(60, ctx.currentTime);

                // Aceleración de frecuencia (Efecto REV)
                osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.3);
                osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.8);

                // Envolvente de volumen
                gain.gain.setValueAtTime(0.3, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.start();
                osc.stop(ctx.currentTime + 0.8);

                // Efecto visual en el botón HUD
                if (btnRev) {
                    btnRev.classList.add('scale-125', 'bg-brand-yellow');
                    setTimeout(() => btnRev.classList.remove('scale-125', 'bg-brand-yellow'), 300);
                }
            } catch (e) {
                console.log('Web Audio no soportado o bloqueado por interacción del navegador.');
            }
        }

        if (btnRev) {
            btnRev.addEventListener('click', playEngineSound);
        }

        // 2. Easter Egg de Teclado (Tecla 'K' para acelerar)
        window.addEventListener('keydown', (e) => {
            if (e.key === 'k' || e.key === 'K') {
                playEngineSound();
            }
        });

        // 3. Botón "Volver al Inicio" con Lenis Smooth Scroll
        const backToTopBtn = document.getElementById('back-to-top');
        if (backToTopBtn) {
            backToTopBtn.addEventListener('click', () => {
                lenis.scrollTo(0, { duration: 1.5 });
            });
        }
    });

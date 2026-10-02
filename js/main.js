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
    });

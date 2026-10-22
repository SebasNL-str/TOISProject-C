// Register GSAP Plugin
gsap.registerPlugin(ScrollTrigger);

// 1. Inicialización de Lenis Smooth Scroll
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                        smoothWheel: true,
});

window.lenis = lenis;

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Sincronizar Lenis con ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// Ejecutar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {

    // A) Revelado suave para elementos individuales (Excluye tarjetas de trofeos)
    gsap.utils.toArray('.reveal-on-scroll').forEach((el) => {
        gsap.fromTo(
            el,
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 0.9,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 88%',
                    toggleActions: 'play none none reverse',
                    preventOverlaps: true,
                    fastScrollEnd: true,
                },
            }
        );
    });

    // B) Revelado escalonado para grillas (.stagger-grid)
    gsap.utils.toArray('.stagger-grid').forEach((grid) => {
        gsap.fromTo(
            grid.children,
            { opacity: 0, y: 35 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.12,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: grid,
                    start: 'top 82%',
                    toggleActions: 'play none none reverse',
                    preventOverlaps: true,
                    fastScrollEnd: true,
                },
            }
        );
    });

    // C) Encabezados H2 de secciones (Entrada cinematográfica limpia)
    gsap.utils.toArray('section').forEach((section) => {
        const header = section.querySelector('h2');
        if (header) {
            gsap.fromTo(
                header,
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse',
                    },
                }
            );
        }
    });

    // D) FASE 3: PINNING HORIZONTAL DE LA SALA DE TROFEOS (DISTANCIA AJUSTADA)
    const trophySection = document.getElementById('trofeos') || document.getElementById('trofies-section');
    const trophyTrack = document.querySelector('.trophy-track');

    if (trophySection && trophyTrack) {
        // Asegurar visibilidad total e inmediata de las tarjetas
        gsap.set('.trophy-card', { opacity: 1, y: 0 });

        const getScrollAmount = () => -(trophyTrack.scrollWidth - window.innerWidth + 64);

        gsap.to(trophyTrack, {
            x: getScrollAmount,
            ease: 'none',
            scrollTrigger: {
                trigger: trophySection,
                start: 'top top',
                // Reducimos la distancia vertical de scroll para des-pinnear más rápido
                end: () => `+=${Math.min(trophyTrack.scrollWidth * 0.6, 800)}`,
                pin: true,
                scrub: 0.5, // Scrub más responsivo para evitar sensación de pesadez
                invalidateOnRefresh: true,
                anticipatePin: 1,
            },
        });
    }

    // E) ANIMACIÓN UNIFICADA DE TARJETAS GENERALES (Excluye estrictamente .trophy-card y #trofeos)
    const interactiveCards = gsap.utils.toArray('.card, .stat-card, .blueprint-card, .container-box, .timeline-item')
    .filter(card => !card.closest('#trofeos') && !card.closest('#trofies-section'));

    if (interactiveCards.length > 0) {
        const cardGroups = new Set(interactiveCards.map(card => card.parentElement));

        cardGroups.forEach(group => {
            const cardsInGroup = group.querySelectorAll('.card, .stat-card, .blueprint-card, .container-box, .timeline-item');

            gsap.fromTo(
                cardsInGroup,
                {
                    opacity: 0,
                    y: 35,
                    scale: 0.96
                },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.75,
                    stagger: 0.1,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: group,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse',
                        preventOverlaps: true,
                    },
                }
            );
        });
    }

    // Refrescar cálculo de posiciones de GSAP al terminar la carga de la página
    setTimeout(() => {
        ScrollTrigger.refresh();
    }, 200);
});

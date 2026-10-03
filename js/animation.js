// Register GSAP Plugin
gsap.registerPlugin(ScrollTrigger);

// 1. Inicialización de Lenis Smooth Scroll
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                        smoothWheel: true,
});

// Exportar globalmente para que main.js la utilice
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

// Executar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {

    // A) Revelado suave para elementos individuales
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

    // C) MACRO-TRANSICIONES FLUIDAS ENTRE SECCIONES (Sin Blur/Scale que rompa el PIN)
    const sections = gsap.utils.toArray('section');
    sections.forEach((section, i) => {
        // Atenuación suave de opacidad al salir (evitamos scale/blur para no romper GPU layers)
        if (i < sections.length - 1) {
            gsap.to(section, {
                opacity: 0.25,
                ease: 'none',
                scrollTrigger: {
                    trigger: section,
                    start: 'bottom 60%',
                    end: 'bottom top',
                    scrub: true,
                },
            });
        }

        // Encabezados h2: Entrada cinematográfica progresiva
        const header = section.querySelector('h2');
        if (header) {
            gsap.fromTo(
                header,
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 85%',
                        end: 'top 35%',
                        scrub: 0.5,
                    },
                }
            );
        }
    });

    // D) FASE 2: Línea de Tiempo
    const timelineItems = gsap.utils.toArray('.timeline-item');
    timelineItems.forEach((item) => {
        gsap.fromTo(
            item,
            { opacity: 0, x: 30 },
            {
                opacity: 1,
                x: 0,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: item,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse',
                    preventOverlaps: true,
                },
            }
        );
    });

    // E) FASE 3: Scroll Horizontal de Trofeos (Pin fluido)
    const trophyTrack = document.querySelector('.trophy-track');
    if (trophyTrack) {
        const getScrollAmount = () => -(trophyTrack.scrollWidth - window.innerWidth + 96);

        gsap.to(trophyTrack, {
            x: getScrollAmount,
            ease: 'none',
            scrollTrigger: {
                trigger: '#trofeos',
                start: 'top top',
                end: () => `+=${trophyTrack.scrollWidth}`,
                pin: true,
                scrub: 0.8, // Un toque de inercia para evitar tirones
                invalidateOnRefresh: true,
                anticipatePin: 1, // Previene parpadeos antes del pin
            },
        });
    }

    // F) FASE 4: Blueprint Grid
    const blueprintItems = document.querySelectorAll('#media-blueprint .grid > div');
    if (blueprintItems.length > 0) {
        gsap.fromTo(
            blueprintItems,
            { opacity: 0, y: 40 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '#media-blueprint',
                    start: 'top 75%',
                    toggleActions: 'play none none reverse',
                },
            }
        );
    }

    // G) Animación de entrada segura para Tarjetas y Contenedores
    const interactiveCards = gsap.utils.toArray('.card, .stat-card, .blueprint-card, .container-box');

    if (interactiveCards.length > 0) {
        // Agrupar tarjetas por contenedor padre para que el stagger funcione por secciones
        const cardGroups = new Set(interactiveCards.map(card => card.parentElement));

        cardGroups.forEach(group => {
            const cardsInGroup = group.querySelectorAll('.card, .stat-card, .blueprint-card, .container-box');

            gsap.fromTo(
                cardsInGroup,
                {
                    opacity: 0,
                    y: 35,
                    scale: 0.95
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

    // Recalcular posiciones de ScrollTrigger al cargar todo correctamente
    setTimeout(() => {
        ScrollTrigger.refresh();
    }, 100);
});

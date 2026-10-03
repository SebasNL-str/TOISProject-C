// Register GSAP Plugin
gsap.registerPlugin(ScrollTrigger);

// 1. Inicialización de Lenis Smooth Scroll
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                        smoothWheel: true,
});

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

// Animaciones de entrada y Scroll Parallax para la Fase 1
document.addEventListener('DOMContentLoaded', () => {
    // Revelado individual para títulos, textos o bloques
    gsap.utils.toArray('.reveal-on-scroll').forEach((el) => {
        gsap.fromTo(
            el,
            {
                opacity: 0,
                y: 35, // Desplazamiento inicial sutil
            },
            {
                opacity: 1,
                y: 0,
                duration: 1.1,
                ease: 'power2.out', // Curva suave para evitar sensación tosca
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%', // Se activa cuando el elemento entra al 85% del viewport
                    toggleActions: 'play none none reverse', // Vuelve a ocultar suavemente al subir
                },
            }
        );
    });

    // Revelado escalonado (Stagger) para Grillas de Tarjetas (Trofeos, Trivia, etc.)
    gsap.utils.toArray('.stagger-grid').forEach((grid) => {
        gsap.fromTo(
            grid.children,
            {
                opacity: 0,
                y: 45,
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.9,
                stagger: 0.15, // Intervalo entre cada tarjeta para fluidez visual
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: grid,
                    start: 'top 80%',
                },
            }
        );
    });

    // 1. Animación de Entrada (Page Load)
    const heroTl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.2 } });

    heroTl
    .from('.hero-meta', {
        y: -30,
        opacity: 0,
        delay: 0.2
    })
    .from('.hero-title', {
        y: 80,
        opacity: 0,
        scale: 0.95
    }, '-=0.8')
    .from('.hero-subtitle', {
        y: 60,
        opacity: 0
    }, '-=0.9')
    .from('.hero-image-wrapper', {
        scale: 0.8,
        opacity: 0,
        duration: 1.4,
        ease: 'back.out(1.2)'
    }, '-=1.0')
    .from('.hero-footer', {
        y: 30,
        opacity: 0
    }, '-=0.8');

    // 2. Animación Parallax al hacer Scroll
    gsap.to('.hero-title', {
        yPercent: -25,
        ease: 'none',
        scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        }
    });

    gsap.to('.hero-image-wrapper', {
        yPercent: -12,
        scale: 1.04,
        ease: 'none',
        scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        }
    });


    //MACRO-TRANSICIONES ENTRE SECCIONES
    const sections = gsap.utils.toArray('section');

    sections.forEach((section, i) => {
        // A) Efecto de Hundimiento y Escala al Salir (Scale-Down & Dim Out)
        if (i < sections.length - 1) {
            gsap.to(section, {
                scale: 0.94,
                opacity: 0.35,
                filter: 'blur(6px)',
                    ease: 'none',
                    scrollTrigger: {
                        trigger: section,
                        start: 'bottom bottom', // Comienza cuando la parte inferior toca el borde inferior
                        end: 'bottom top',    // Termina cuando la sección sale por completo
                        scrub: true,
                    },
            });
        }

        // B) Zoom Cinemático y Parallax en los Encabezados de Sección
        const header = section.querySelector('h2');
        const tag = section.querySelector('span');

        if (header) {
            gsap.fromTo(
                header,
                {
                    y: 80,
                    scale: 0.85,
                    letterSpacing: '0.05em',
                    opacity: 0
                },
                {
                    y: 0,
                    scale: 1,
                    letterSpacing: '-0.02em',
                    opacity: 1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 80%',
                        end: 'top 30%',
                        scrub: 0.6, // Scrub suave sincronizado con Lenis
                    },
                }
            );
        }

        // C) Iluminación de Bordes y Divisores de Sección al Entrar
        const borderDivider = section.querySelector('.border-b, .border-t');
        if (borderDivider) {
            gsap.fromTo(
                borderDivider,
                { borderColor: 'rgba(255, 255, 255, 0.05)' },
                        {
                            borderColor: i % 2 === 0 ? 'rgba(234, 179, 8, 0.6)' : 'rgba(239, 68, 68, 0.6)', // Alterna entre Amarillo Dinoco y Rojo Rust-eze
                        duration: 1,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: section,
                            start: 'top 70%',
                            toggleActions: 'play none none reverse',
                        },
                        }
            );
        }
    });
});

// 3. FASE 2: Animaciones de Scroll para la Línea de Tiempo y Sticky Card

// Revelado progresivo de los ítems de la línea de tiempo
const timelineItems = gsap.utils.toArray('.timeline-item');

timelineItems.forEach((item) => {
    gsap.from(item, {
        opacity: 0,
        x: 40,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: item,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    });
});

// Animación del indicador de línea vertical de progreso
gsap.from('.timeline-progress-line', {
    scaleY: 0,
    ease: 'none',
    scrollTrigger: {
        trigger: '#biografia',
        start: 'top 60%',
        end: 'bottom 80%',
        scrub: true
    }
});

// Efecto subtle pulse para la tarjeta Sticky en la columna izquierda
gsap.to('.sticky-card', {
    borderColor: 'rgba(229, 9, 20, 0.4)',
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
});

// 4. FASE 3: Scroll Horizontal (Pit Lane Slider)
const trophyTrack = document.querySelector('.trophy-track');

if (trophyTrack) {
    const getScrollAmount = () => {
        return -(trophyTrack.scrollWidth - window.innerWidth + 96);
    };

    gsap.to(trophyTrack, {
        x: getScrollAmount,
        ease: 'none',
        scrollTrigger: {
            trigger: '#trofies-section',
            start: 'top top',
            end: () => `+=${trophyTrack.scrollWidth}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
        }
    });
}

// 5. FASE 4: Animaciones para el Blueprint y la Galería
gsap.from('#media-blueprint .grid > div', {
    y: 50,
    opacity: 0,
    duration: 1,
    stagger: 0.2,
    ease: 'power3.out',
    scrollTrigger: {
        trigger: '#media-blueprint',
        start: 'top 70%',
        toggleActions: 'play none none reverse'
    }
});

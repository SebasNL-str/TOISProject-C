// Animaciones de entrada y Scroll Parallax para la Fase 1
document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);

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

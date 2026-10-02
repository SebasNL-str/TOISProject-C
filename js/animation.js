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

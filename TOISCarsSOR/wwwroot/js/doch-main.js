// Vibe-code mi pasion deosssss
import { gsap } from "./gsap-cdn.js";
import "./doch-mainV2.js"

const loader = document.querySelector(".loader");
const glow = document.querySelector(".loader-glow");
const beam = document.querySelector(".loader-beam");
const flash = document.querySelector(".loader-flash");
const car = document.querySelector(".loader-car");
const heroCar = document.querySelector(".hero-car");

if (loader && glow && beam && flash && car && heroCar) {
  document.documentElement.classList.add("is-loading");

const removeLoader = () => {
    loader.remove();
    document.documentElement.classList.remove("is-loading");
    
    if (typeof ScrollTrigger !== "undefined") {
      ScrollTrigger.refresh();
    }
  };

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (reducedMotion) {
    removeLoader();
  } else {
    let started = false;

    const startTransition = () => {
      if (started) return;
      started = true;

      if (!heroCar.naturalWidth || !heroCar.naturalHeight) {
        removeLoader();
        return;
      }

      // Obtener la posición del coche en el hero
      const target = heroCar.getBoundingClientRect();

      if (!target.width || !target.height) {
        removeLoader();
        return;
      }

      gsap.set(car, {
        x: 0,
        y: 0,
        xPercent: -50,
        yPercent: -50,
        scale: 0.97,
      });

      const carStart = car.getBoundingClientRect();

      const targetCenterX = target.left + target.width / 2;
      const targetCenterY = target.top + target.height / 2;

      const deltaX =
        targetCenterX - (carStart.left + carStart.width / 2);

      const deltaY =
        targetCenterY - (carStart.top + carStart.height / 2);

      gsap.set(heroCar, {
        filter: "none",
      });

      const timeline = gsap.timeline({
        onComplete: removeLoader,
      });

      // 1. Glow up
      timeline.to(
        glow,
        {
          opacity: 1,
          duration: 1.5,
          ease: "sine.out",
        },
        0
      );

      // 2. Aparicion del buga y su halo biru
      timeline.to(
        car,
        {
          opacity: 1,
          filter:
            "brightness(0.9) saturate(0.95) blur(0px) drop-shadow(0 0 42px rgb(66 109 255 / 40%))",
          duration: 2.8,
          ease: "power2.out",
        },
        0.1
      );

      // 3. Barrido deluz
      timeline.to(
        beam,
        {
          left: "120%",
          opacity: 0.9,
          duration: 1.7,
          ease: "sine.inOut",
        },
        0.25
      );

      timeline.to(
        flash,
        {
          left: "120%",
          opacity: 0.65,
          duration: 1.7,
          ease: "sine.inOut",
        },
        0.25
      );

      // 4. Doc viaja al centro del otro doc (?)
      timeline.to(
        car,
        {
          x: deltaX,
          y: deltaY,
          width: target.width,
          scale: 1,
          duration: 1.4,
          ease: "power3.inOut",
        },
        1.25
      );

      // 5. Feid out al otro doc
      timeline.to(
        car,
        {
          filter:
            "brightness(1) saturate(1) blur(0px) drop-shadow(0 0 0px rgb(66 109 255 / 0%))",
          duration: 0.8,
          ease: "sine.inOut",
        },
        2.65
      );

      // 6. Feid out del envayronmen
      timeline.to(
        [beam, flash],
        {
          opacity: 0,
          duration: 0.8,
          ease: "sine.inOut",
        },
        2.65
      );

      timeline.to(
        glow,
        {
          opacity: 0,
          duration: 1.0,
          ease: "sine.inOut",
        },
        2.65
      );

      timeline.to(
        loader,
        {
          backgroundColor: "rgba(5, 8, 18, 0)",
          duration: 0.8,
          ease: "sine.inOut",
        },
        2.65
      );

      // 7. Decirle ciao, bye, adios al doc de la animacion, ni con un plis regresa
      timeline.to(
        car,
        {
          opacity: 0,
          duration: 0.1,
        },
        3.45
      );
    };

    if (heroCar.complete) {
      if (heroCar.naturalWidth > 0) {
        startTransition();
      } else {
        removeLoader();
      }
    } else {
      heroCar.addEventListener("load", startTransition, {
        once: true,
      });

      heroCar.addEventListener(
        "error",
        removeLoader,
        { once: true }
      );
    }
  }
}
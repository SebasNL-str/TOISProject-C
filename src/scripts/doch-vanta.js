// BG sponsored by Sizophreni oh my lord
let vantaEffect = null;

function initVanta() {
  const background = document.querySelector("#vanta-bg");

  if (!background || typeof VANTA === "undefined") {
    console.error("No se pudo cargar Vanta.js");
    return;
  }

  vantaEffect = VANTA.FOG({
    el: background,

    mouseControls: true,
    touchControls: true,
    gyroControls: false,

    minHeight: 200,
    minWidth: 200,


    highlightColor: 0x1748B5,
    midtoneColor: 0x0B2865,
    lowlightColor: 0x061329,
    baseColor: 0x020610,



    blurFactor: 0.6,
    speed: 0.8,
    zoom: 0.8,
  });
}

initVanta();


import { gsap, ScrollTrigger } from "./gsap-cdn.js";

gsap.registerPlugin(ScrollTrigger);

function splitTextIntoLetters(element) {
    if (!element) return [];

    const processTextNode = (node) => {
        const text = node.textContent;
        if (!text) return;

        const fragment = document.createDocumentFragment();
        const parts = text.split(/(\s+)/);

        parts.forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) {
                fragment.appendChild(document.createTextNode(part));
            } else {
                const wordSpan = document.createElement("span");
                wordSpan.style.display = "inline-block";
                wordSpan.style.whiteSpace = "nowrap";

                part.split("").forEach(char => {
                    const charSpan = document.createElement("span");
                    charSpan.textContent = char;
                    charSpan.style.display = "inline-block";
                    charSpan.style.willChange = "transform, opacity";
                    charSpan.style.opacity = "1";
                    wordSpan.appendChild(charSpan);
                });
                fragment.appendChild(wordSpan);
            }
        });
        node.parentNode.replaceChild(fragment, node);
    };

    const walkNodes = (node) => {
        if (node.nodeType === Node.TEXT_NODE) {
            processTextNode(node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            Array.from(node.childNodes).forEach(walkNodes);
        }
    };

    Array.from(element.childNodes).forEach(walkNodes);
    return element.querySelectorAll("span span");
}

window.scrollTo(0, 0);

const media = gsap.matchMedia();

document.addEventListener("DOMContentLoaded", () => {

    media.add("(prefers-reduced-motion: no-preference)", () => {

        const overview = document.querySelector("#resumen");
        const overviewTitle = document.querySelector("#overview-title");
        const overviewDescList = document.querySelectorAll("#resumen .film-description");
        const overviewImg = document.querySelector("#resumen .overview-image img");

        if (overview && overviewTitle) {
            const letters = splitTextIntoLetters(overviewTitle);

            const wrappedParagraphs = [];
            overviewDescList.forEach(p => {
                const wrapper = document.createElement("div");
                wrapper.style.overflow = "visible"; 
                wrapper.style.padding = "4px 0";
                p.parentNode.insertBefore(wrapper, p);
                wrapper.appendChild(p);
                wrappedParagraphs.push(p);
            });

            const overviewTl = gsap.timeline({
                scrollTrigger: {
                    trigger: overview,
                    start: "top 75%",
                    end: "center center",
                    scrub: 2, 
                    invalidateOnRefresh: true,
                }
            });

            overviewTl
                .from(letters, {
                    y: 40,
                    opacity: 0,
                    rotationX: -80,
                    transformPerspective: 600,
                    stagger: 0.02,
                    ease: "power3.out",
                    force3D: true
                })
                .from(wrappedParagraphs, {
                    y: 35,
                    opacity: 0,
                    filter: "blur(12px)",
                    duration: 1.1,
                    stagger: 0.25,
                    ease: "power3.out",
                    clearProps: "filter"
                }, "-=0.6")
                .fromTo(overviewImg, 
                    { 
                        clipPath: "inset(35% 0 35% 0)", 
                        scale: 1.15, 
                        filter: "brightness(0.5) contrast(1.1)" 
                    }, 
                    { 
                        clipPath: "inset(0% 0% 0% 0)", 
                        scale: 1, 
                        filter: "brightness(1) contrast(1)",
                        ease: "none",
                        clearProps: "clipPath,filter"
                    }, 
                    0
                );
        }

        const historySection = document.querySelector("#historia");
        if (historySection) {
            ScrollTrigger.create({
                trigger: historySection,
                start: "top center",
                end: "bottom center",
                toggleClass: { targets: "body.site-body", className: "is-mono" },
            });
        }
        const historyTitle = document.querySelector("#history-title");
        const historyDesc = document.querySelector("#historia .silhouette-heading .film-description");
        const noteLeft = document.querySelector("#historia .silhouette-note-left");
        const noteRight = document.querySelector("#historia .silhouette-note-right");
        const historyBottomCopy = document.querySelector("#historia .history-bottom-copy");
        const historyImage = document.querySelector("#historia .silhouette-image img");

        if (historySection && historyTitle) {
            const historyLetters = splitTextIntoLetters(historyTitle);

            const historyTl = gsap.timeline({
                scrollTrigger: {
                    trigger: historySection,
                    start: "top 40%",
                    end: "center center",
                    scrub: 2,
                    invalidateOnRefresh: true,
                }
            });

            historyTl
                .from(historyLetters, {
                    y: 40,
                    opacity: 0,
                    rotationX: -80,
                    transformPerspective: 600,
                    stagger: 0.02,
                    ease: "power3.out",
                    force3D: true
                })
                .from(historyDesc, {
                    y: 30,
                    opacity: 0,
                    filter: "blur(10px)",
                    duration: 0.9,
                    ease: "power3.out",
                    clearProps: "filter"
                }, "-=0.6")
                .from(noteLeft, {
                    x: -50,
                    opacity: 0,
                    duration: 1,
                    ease: "power3.out"
                }, "-=0.4")
                .from(noteRight, {
                    x: 50,
                    opacity: 0,
                    duration: 1,
                    ease: "power3.out"
                }, "<")
                .from(historyBottomCopy, {
                    y: 25,
                    opacity: 0,
                    duration: 0.8,
                    ease: "power3.out"
                }, "-=0.5");
        }

        if (historyImage && historySection && historySection.offsetHeight > 0) {
            gsap.fromTo(
                historyImage,
                { 
                    clipPath: "inset(0 40% 0 40%)", 
                    scale: 1.15, 
                    filter: "brightness(0.5)" 
                },
                {
                    clipPath: "inset(0 0% 0 0%)",
                    scale: 1,
                    filter: "brightness(1)",
                    ease: "none",
                    clearProps: "clipPath,filter",
                    scrollTrigger: {
                        trigger: historySection,
                        start: "top bottom",
                        end: "center center",
                        scrub: 2,
                        invalidateOnRefresh: true,
                    },
                }
            );
        }

        const technicalSection = document.querySelector("#tecnica");
        const technicalTitle = document.querySelector("#technical-title");
        const technicalDescList = document.querySelectorAll("#tecnica .technical-copy > .film-description");
        const technicalSpecs = document.querySelectorAll("#tecnica .technical-spec");
        const technicalImg = document.querySelector("#tecnica .technical-image img");

        if (technicalSection && technicalTitle) {
            const techLetters = splitTextIntoLetters(technicalTitle);

            const wrappedTechDesc = [];
            technicalDescList.forEach(p => {
                const wrapper = document.createElement("div");
                wrapper.style.overflow = "visible"; 
                wrapper.style.padding = "4px 0";
                p.parentNode.insertBefore(wrapper, p);
                wrapper.appendChild(p);
                wrappedTechDesc.push(p);
            });

            const technicalTl = gsap.timeline({
                scrollTrigger: {
                    trigger: technicalSection,
                    start: "top 40%",
                    end: "center center",
                    scrub: 2,
                    invalidateOnRefresh: true,
                }
            });

            technicalTl
                .from(techLetters, {
                    x: 25,
                    opacity: 0,
                    filter: "blur(8px)",
                    stagger: 0.018,
                    ease: "power2.out",
                    force3D: true
                })
                .from(wrappedTechDesc, {
                    x: -40,
                    opacity: 0,
                    filter: "blur(12px)",
                    duration: 1.1,
                    stagger: 0.25,
                    ease: "power3.out",
                    clearProps: "filter"
                }, "-=0.4")
                .from(technicalSpecs, {
                    y: 35,
                    opacity: 0,
                    filter: "blur(6px)",
                    duration: 0.9,
                    stagger: 0.12,
                    ease: "power3.out",
                    clearProps: "filter"
                }, "-=0.6")
                .fromTo(technicalImg,
                    { 
                        clipPath: "inset(0 0 0 100%)", 
                        scale: 1.12,
                        filter: "brightness(0.5) contrast(1.1)" 
                    },
                    { 
                        clipPath: "inset(0 0 0 0%)", 
                        scale: 1,
                        filter: "brightness(1) contrast(1)",
                        ease: "power2.out",
                        clearProps: "clipPath,filter"
                    },
                    0
                );
        }

        const compSection = document.querySelector("#competicion");
        const compTitle = document.querySelector("#competition-title");
        const compImg = document.querySelector("#competicion .competition-vehicle img");
        const compDescList = document.querySelectorAll("#competicion .competition-copy .film-description");

        if (compSection && compTitle) {
            const compLetters = splitTextIntoLetters(compTitle);

            const wrappedCompDesc = [];
            compDescList.forEach(p => {
                const wrapper = document.createElement("div");
                wrapper.style.overflow = "visible"; 
                wrapper.style.padding = "4px 0";
                p.parentNode.insertBefore(wrapper, p);
                wrapper.appendChild(p);
                wrappedCompDesc.push(p);
            });

            const compTl = gsap.timeline({
                scrollTrigger: {
                    trigger: compSection,
                    start: "top 40%",
                    end: "center center",
                    scrub: 2,
                    invalidateOnRefresh: true,
                }
            });

            compTl
                .from(compLetters, {
                    y: -30,
                    x: -15,
                    opacity: 0,
                    filter: "blur(8px)",
                    stagger: 0.015,
                    ease: "power4.out",
                    force3D: true
                })
                .fromTo(compImg,
                    {
                        scale: 1.25,
                        y: 40,
                        filter: "brightness(0.4) blur(10px)",
                        transformPerspective: 1000,
                        rotateX: 12
                    },
                    {
                        scale: 1,
                        y: 0,
                        filter: "brightness(1) blur(0px)",
                        rotateX: 0,
                        ease: "power2.out",
                        clearProps: "clipPath,filter"
                    },
                    0
                )
                .from(wrappedCompDesc, {
                    y: 35,
                    opacity: 0,
                    filter: "blur(10px)",
                    duration: 1,
                    stagger: 0.2,
                    ease: "power3.out",
                    clearProps: "filter"
                }, "-=0.5");
        }

        const culturaSection = document.querySelector("#cultura");
        const culturaTitle = document.querySelector("#culture-title");
        const culturaDescList = document.querySelectorAll("#cultura .culture-copy .film-description");
        const culturaImg = document.querySelector("#cultura .culture-image img");

        if (culturaSection && culturaTitle) {
            const culturaLetters = splitTextIntoLetters(culturaTitle);

            const wrappedCulturaDesc = [];
            culturaDescList.forEach(p => {
                const wrapper = document.createElement("div");
                wrapper.style.overflow = "visible"; 
                wrapper.style.padding = "4px 0";
                p.parentNode.insertBefore(wrapper, p);
                wrapper.appendChild(p);
                wrappedCulturaDesc.push(p);
            });

            const culturaTl = gsap.timeline({
                scrollTrigger: {
                    trigger: culturaSection,
                    start: "top 40%",
                    end: "center center",
                    scrub: 2,
                    invalidateOnRefresh: true,
                }
            });

            culturaTl
                .from(culturaLetters, {
                    x: 30,
                    opacity: 0,
                    filter: "blur(8px)",
                    stagger: 0.02,
                    ease: "power3.out",
                    force3D: true
                })
                .from(wrappedCulturaDesc, {
                    x: 45, 
                    opacity: 0,
                    filter: "blur(12px)",
                    duration: 1.1,
                    stagger: 0.25,
                    ease: "power3.out",
                    clearProps: "filter"
                }, "-=0.5")
                .fromTo(culturaImg,
                    { 
                        clipPath: "inset(0 100% 0 0%)", 
                        scale: 1.12,
                        filter: "brightness(0.5) contrast(1.1)" 
                    },
                    { 
                        clipPath: "inset(0 0% 0 0%)", 
                        scale: 1,
                        filter: "brightness(1) contrast(1)",
                        ease: "power2.out",
                        clearProps: "clipPath,filter"
                    },
                    0
                );
        }

        const legadoSection = document.querySelector("#legado");
        const legadoTitle = document.querySelector("#legacy-title");
        const legadoDescList = document.querySelectorAll("#legado .legacy-copy .film-description");
        const legadoImg = document.querySelector("#legado .legacy-vehicle img");

        if (legadoSection && legadoTitle) {
            const legadoLetters = splitTextIntoLetters(legadoTitle);

            const wrappedLegadoDesc = [];
            legadoDescList.forEach(p => {
                const wrapper = document.createElement("div");
                wrapper.style.overflow = "visible"; 
                wrapper.style.padding = "4px 0";
                p.parentNode.insertBefore(wrapper, p);
                wrapper.appendChild(p);
                wrappedLegadoDesc.push(p);
            });

            const legadoTl = gsap.timeline({
                scrollTrigger: {
                    trigger: legadoSection,
                    start: "top 40%",
                    end: "center center",
                    scrub: 2,
                    invalidateOnRefresh: true,
                }
            });

            legadoTl
                .from(legadoLetters, {
                    y: -60,
                    opacity: 0,
                    filter: "blur(8px)",
                    stagger: 0.025,
                    ease: "back.out(1.7)",
                    force3D: true
                })
                .from(wrappedLegadoDesc, {
                    y: -35,
                    opacity: 0,
                    filter: "blur(12px)",
                    duration: 1.1,
                    stagger: 0.25,
                    ease: "power3.out",
                    clearProps: "filter"
                }, "-=0.5")
                .fromTo(legadoImg,
                    { 
                        clipPath: "inset(0 100% 0 0%)", 
                        scale: 1.12,
                        filter: "brightness(0.5) contrast(1.1)" 
                    },
                    { 
                        clipPath: "inset(0 0% 0 0%)", 
                        scale: 1,
                        filter: "brightness(1) contrast(1)",
                        ease: "power2.out",
                        clearProps: "clipPath,filter"
                    },
                    0
                );
        }

        const tributeSection = document.querySelector("#tributos");
        if (tributeSection) {
            ScrollTrigger.create({
                trigger: tributeSection,
                start: "top center",
                end: "bottom center",
                toggleClass: { targets: "body.site-body", className: "is-mono" },
            });
        }
        const tributeTitle = document.querySelector("#tribute-title");
        const tributeDescList = document.querySelectorAll("#tributos .tribute-copy .film-description");
        const tributeImg = document.querySelector("#tributos .tribute-image img");

        if (tributeSection && tributeTitle) {
            const tributeLetters = splitTextIntoLetters(tributeTitle);

            const wrappedTributeDesc = [];
            tributeDescList.forEach(p => {
                const wrapper = document.createElement("div");
                wrapper.style.overflow = "visible"; 
                wrapper.style.padding = "4px 0";
                p.parentNode.insertBefore(wrapper, p);
                wrapper.appendChild(p);
                wrappedTributeDesc.push(p);
            });

            const tributeTl = gsap.timeline({
                scrollTrigger: {
                    trigger: tributeSection,
                    start: "top 40%",
                    end: "bottom 85%", 
                    scrub: 1.5,        
                    invalidateOnRefresh: true,
                }
            });

            tributeTl
                .from(tributeLetters, {
                    scaleX: 1.6,
                    scaleY: 0.8,
                    opacity: 0,
                    filter: "blur(14px) brightness(1.8)",
                    stagger: 0.025,
                    ease: "power3.out",
                    force3D: true
                })
                .from(wrappedTributeDesc, {
                    x: -35,
                    opacity: 0,
                    filter: "blur(12px)",
                    duration: 1.1,
                    stagger: 0.25,
                    ease: "power3.out",
                    clearProps: "filter"
                }, "-=0.6")
                .fromTo(tributeImg,
                    { 
                        clipPath: "inset(25% 25% 25% 25%)", 
                        scale: 1.25,
                        filter: "brightness(0.4) contrast(1.2)" 
                    },
                    { 
                        clipPath: "inset(0% 0% 0% 0%)", 
                        scale: 1,
                        filter: "brightness(1) contrast(1)",
                        ease: "power2.out",
                        clearProps: "clipPath,filter"
                    },
                    0
                );
        }

    });

    if (typeof ScrollTrigger !== "undefined") {
        ScrollTrigger.refresh();
    }
});
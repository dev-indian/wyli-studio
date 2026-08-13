import Lenis from "lenis";
import { gsap, ScrollTrigger } from "./gsap";

export function initLenis() {
  const lenis = new Lenis({ lerp: 0.1, duration: 1.4 });

  // Connect Lenis scroll events to ScrollTrigger so pinning works correctly
  lenis.on("scroll", () => {
    ScrollTrigger.update();
  });

  // Proxy the scroller so ScrollTrigger reads Lenis's scroll position
  ScrollTrigger.scrollerProxy(document.documentElement, {
    scrollTop(value?: number) {
      if (arguments.length && value !== undefined) {
        lenis.scrollTo(value, { immediate: true });
      }
      return lenis.scroll;
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
    pinType:
      document.documentElement.style.transform ? "transform" : "fixed",
  });

  // Drive Lenis via GSAP ticker
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

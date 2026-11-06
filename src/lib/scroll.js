import Lenis from "lenis";
import { gsap, ScrollTrigger } from "./gsap.js";

let lenis = null;

const HEADER_OFFSET = 0; // the 5rem html scroll-padding-top already clears the floating nav

/** Smooth, inertial scrolling driven by GSAP's ticker so ScrollTrigger and Lenis share one clock. */
export function initSmoothScroll() {
  if (typeof window === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};
  // Phones and tablets already have native momentum scrolling; running Lenis on top of it
  // only adds per-frame JavaScript. Keep it for mouse / trackpad devices.
  if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) return () => {};

  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    anchors: { offset: HEADER_OFFSET, duration: 1.4 },
  });
  lenis.on("scroll", ScrollTrigger.update);
  const tick = (time) => lenis?.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(tick);
    lenis?.destroy();
    lenis = null;
  };
}

export function scrollToTop({ immediate = false } = {}) {
  if (lenis) lenis.scrollTo(0, { immediate, duration: 1.5 });
  else window.scrollTo({ top: 0, left: 0, behavior: immediate ? "auto" : "smooth" });
}

export function scrollToTarget(selector) {
  const el = document.querySelector(selector);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: HEADER_OFFSET, duration: 1.4 });
  else el.scrollIntoView({ behavior: "smooth", block: "start" });
}

// Without Lenis (touch devices) the page lock is plain CSS on <html>.
export function stopScroll() { if (lenis) lenis.stop(); else document.documentElement.classList.add("scroll-locked"); }
export function startScroll() { if (lenis) lenis.start(); else document.documentElement.classList.remove("scroll-locked"); }

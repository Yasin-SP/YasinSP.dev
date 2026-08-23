import { useEffect } from "react";
import Lenis from "lenis";
import { setLenisInstance } from "../lib/lenisInstance.js";

export function useSmoothScroll(enabled = true) {
  useEffect(() => {
    if (!enabled) {
      setLenisInstance(null);
      return undefined;
    }
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) {
      setLenisInstance(null);
      return undefined;
    }

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      smoothWheel: true,
      touchMultiplier: 1.05,
      syncTouch: false,
    });

    setLenisInstance(lenis);
    let frameId = requestAnimationFrame(function raf(time) {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    });

    return () => {
      cancelAnimationFrame(frameId);
      lenis.destroy();
      setLenisInstance(null);
    };
  }, [enabled]);
}

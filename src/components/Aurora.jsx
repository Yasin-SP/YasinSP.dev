import { useRef } from "react";
import { NO_PREFERENCE, gsap, useGSAP } from "../lib/gsap.js";

/**
 * Minimal, quiet backdrop: a fine dot grid that fades toward the edges, one
 * very soft overhead wash, and a trace of film grain. No moving light, nothing
 * that competes with content. The grid drifts a few pixels with scroll so the
 * canvas has depth without drawing attention.
 */
export default function Backdrop() {
  const root = useRef(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(NO_PREFERENCE, () => {
      gsap.to(".bd-grid", { backgroundPositionY: "-160px", ease: "none", scrollTrigger: { trigger: document.documentElement, start: 0, end: "max", scrub: 1 } });
    });
    return () => mm.revert();
  }, { scope: root });

  return (
    <div ref={root} aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div
        className="bd-grid absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, var(--grid-dot) 1px, transparent 1.4px)",
          backgroundSize: "32px 32px",
          WebkitMaskImage: "radial-gradient(ellipse 85% 70% at 50% 30%, #000 0%, transparent 100%)",
          maskImage: "radial-gradient(ellipse 85% 70% at 50% 30%, #000 0%, transparent 100%)",
        }}
      />
      <div className="absolute inset-x-0 top-0 h-[60vh]" style={{ background: "radial-gradient(ellipse 60% 100% at 50% 0%, var(--wash), transparent 75%)" }} />
      <div
        className="absolute inset-0"
        style={{
          opacity: "var(--grain-opacity)",
          mixBlendMode: "overlay",
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .9 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />
    </div>
  );
}

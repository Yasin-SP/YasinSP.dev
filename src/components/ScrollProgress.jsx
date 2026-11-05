import { useRef } from "react";
import { NO_PREFERENCE, gsap, useGSAP } from "../lib/gsap.js";

/**
 * The original left-edge progress beam: a hairline of purple light with a
 * glowing dot that rides it as the page is read. Large screens only.
 */
export default function ScrollProgress() {
  const root = useRef(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(NO_PREFERENCE, () => {
      const span = { trigger: document.documentElement, start: 0, end: "max", scrub: 0.5 };
      gsap.fromTo(".beam-dot", { top: "0%" }, { top: "100%", ease: "none", scrollTrigger: span });
      gsap.fromTo(".beam-line", { opacity: 0 }, { keyframes: [{ opacity: 0.55, duration: 0.05 }, { opacity: 0.55, duration: 0.9 }, { opacity: 0, duration: 0.05 }], ease: "none", scrollTrigger: span });
    });
    return () => mm.revert();
  }, { scope: root });

  return (
    <div ref={root} aria-hidden="true" className="pointer-events-none fixed inset-y-0 left-3 z-20 hidden w-px md:left-6 lg:block">
      <div className="beam-line absolute inset-0 w-full" style={{ background: "linear-gradient(to bottom, transparent, var(--c-purple), transparent)", opacity: 0.4 }} />
      <div className="beam-dot absolute -left-[3.5px] top-0 h-2 w-2 rounded-full" style={{ backgroundColor: "var(--c-purple)", boxShadow: "0 0 0 3px color-mix(in srgb, var(--c-purple) 25%, transparent)" }} />
    </div>
  );
}

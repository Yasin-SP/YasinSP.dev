import { useRef } from "react";
import { NO_PREFERENCE, ScrollTrigger, gsap, useGSAP } from "../lib/gsap.js";

/**
 * Endless ticker driven by GSAP. It idles at a calm speed and surges with the
 * page's scroll velocity, so the stack literally reacts to the reader.
 */
export default function Marquee({ children, duration = 40, reverse = false, className = "" }) {
  const root = useRef(null);
  const track = useRef(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(NO_PREFERENCE, () => {
      const tween = gsap.fromTo(track.current, { xPercent: reverse ? -50 : 0 }, { xPercent: reverse ? 0 : -50, duration, ease: "none", repeat: -1 });
      const trigger = ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => (self.isActive ? tween.resume() : tween.pause()),
        onUpdate: (self) => {
          const surge = Math.min(Math.abs(self.getVelocity()) / 320, 6);
          tween.timeScale(1 + surge);
          gsap.to(tween, { timeScale: 1, duration: 1.1, ease: "power3.out", overwrite: true });
        },
      });
      return () => { tween.kill(); trigger.kill(); };
    });
    return () => mm.revert();
  }, { scope: root });

  return (
    <div ref={root} dir="ltr" className={`marquee overflow-hidden ${className}`}>
      <div ref={track} className="marquee-track">
        <div className="flex shrink-0 items-center gap-3 pe-3">{children}</div>
        <div className="flex shrink-0 items-center gap-3 pe-3" aria-hidden="true">{children}</div>
      </div>
    </div>
  );
}

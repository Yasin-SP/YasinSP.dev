import { useRef } from "react";
import { MOTION, NO_PREFERENCE, gsap, useGSAP } from "../lib/gsap.js";

/**
 * The shared entrance: fade + rise + a hint of scale, once, as the element
 * crosses the reading line. Props are cleared afterwards so text stays
 * pixel-sharp and layout animations further down are never disturbed.
 */
export default function Reveal({ as: Tag = "div", delay = 0, y = MOTION.y, className = "", children, ...rest }) {
  const ref = useRef(null);
  useGSAP(() => {
    const el = ref.current;
    if (!el) return undefined;
    const mm = gsap.matchMedia();
    mm.add(NO_PREFERENCE, () => {
      gsap.fromTo(
        el,
        { autoAlpha: 0, y, scale: 0.985 },
        { autoAlpha: 1, y: 0, scale: 1, duration: MOTION.duration, ease: MOTION.ease, delay, clearProps: "transform,opacity,visibility", scrollTrigger: { trigger: el, start: MOTION.start, once: true } },
      );
    });
    return () => mm.revert();
  }, { scope: ref });

  return <Tag ref={ref} className={className} {...rest}>{children}</Tag>;
}

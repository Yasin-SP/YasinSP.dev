import { useRef } from "react";
import { MOTION, NO_PREFERENCE, gsap, useGSAP } from "../lib/gsap.js";

/**
 * "Lights up as you read": every word brightens in turn as the paragraph
 * travels through the viewport, scrubbed to the scroll position.
 */
export default function ScrollWords({ text, className = "" }) {
  const ref = useRef(null);
  const words = String(text).split(/\s+/).filter(Boolean);

  useGSAP(() => {
    const targets = ref.current?.querySelectorAll("[data-w]");
    if (!targets?.length) return undefined;
    const mm = gsap.matchMedia();
    mm.add(`(min-width: 768px) and ${NO_PREFERENCE}`, () => {
      gsap
        .timeline({ scrollTrigger: { trigger: ref.current, start: "top 85%", end: "bottom 55%", scrub: MOTION.scrub } })
        .fromTo(targets, { opacity: 0.16 }, { opacity: 1, ease: "none", duration: 1, stagger: 0.5 });
    });
    return () => mm.revert();
  }, { scope: ref, dependencies: [text] });

  return (
    <p ref={ref} className={className} aria-label={text}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`} aria-hidden="true">
          <span data-w className="inline-block">{word}</span>
          {index < words.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  );
}

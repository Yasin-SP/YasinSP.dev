import { useRef } from "react";
import { MOTION, NO_PREFERENCE, gsap, useGSAP } from "../lib/gsap.js";

/**
 * Splits text on spaces and brings each word in with a rise + blur-to-sharp.
 * Words (not letters) are the unit on purpose: Persian letters change shape
 * with their neighbours, so letter-level splitting would break the script.
 */
export default function WordReveal({ text, as: Tag = "span", className = "", delay = 0, stagger = 0.07, inView = true, wordClassName = "" }) {
  const ref = useRef(null);
  const words = String(text).split(/\s+/).filter(Boolean);

  useGSAP(() => {
    const targets = ref.current?.querySelectorAll("[data-w]");
    if (!targets?.length) return undefined;
    const mm = gsap.matchMedia();
    mm.add(NO_PREFERENCE, () => {
      // Animating blur() on dozens of words is costly on phones: only wide screens get it.
      const blur = window.matchMedia("(min-width: 1024px)").matches;
      gsap.fromTo(
        targets,
        blur ? { autoAlpha: 0, y: "0.55em", filter: "blur(10px)" } : { autoAlpha: 0, y: "0.4em" },
        {
          autoAlpha: 1, y: "0em", ...(blur ? { filter: "blur(0px)" } : {}), duration: MOTION.duration, ease: MOTION.ease, stagger, delay,
          clearProps: "transform,filter,opacity,visibility",
          scrollTrigger: inView ? { trigger: ref.current, start: "top 88%", once: true } : undefined,
        },
      );
    });
    return () => mm.revert();
  }, { scope: ref, dependencies: [text] });

  return (
    <Tag ref={ref} className={className}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`}>
          <span data-w className={`inline-block ${wordClassName}`}>{word}</span>
          {index < words.length - 1 ? " " : ""}
        </span>
      ))}
    </Tag>
  );
}

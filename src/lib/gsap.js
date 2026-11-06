import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);
ScrollTrigger.config({ ignoreMobileResize: true });

/**
 * One motion language for the whole site. Every entrance and scrubbed effect
 * pulls from these values so nothing feels faster or slower than its neighbour.
 */
export const MOTION = {
  ease: "power3.out",
  duration: 1.1,
  y: 40,
  start: "top 88%",
  stagger: 0.09,
  scrub: 0.6,
};

export const NO_PREFERENCE = "(prefers-reduced-motion: no-preference)";

export { gsap, ScrollTrigger, useGSAP };

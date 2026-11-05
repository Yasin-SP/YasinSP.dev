import { useEffect, useState } from "react";
import { ScrollTrigger } from "../lib/gsap.js";

const navLinks = [
  { href: "#about" },
  { href: "#services" },
  { href: "#skills" },
  { href: "#projects" },
  { href: "#approach" },
];

/**
 * Which section is under the reading line (40% down the viewport). Computed
 * from real geometry on every scroll frame rather than from observer events,
 * so it can never get stuck or skip a section, however fast the jump.
 */
export function useActiveSection(enabled) {
  const [active, setActive] = useState("");
  useEffect(() => {
    if (!enabled) { setActive(""); return undefined; }
    const ids = navLinks.map((link) => link.href.slice(1));
    let frame = 0;
    const compute = () => {
      frame = 0;
      const line = window.innerHeight * 0.4;
      let current = "";
      for (const id of ids) {
        const rect = document.getElementById(id)?.getBoundingClientRect();
        if (rect && rect.top <= line && rect.bottom > line) current = id;
      }
      setActive((previous) => (previous === current ? previous : current));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(compute); };
    compute();
    const settle = window.setTimeout(compute, 700); // the page body is lazy-loaded
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    ScrollTrigger.addEventListener("refresh", schedule);
    return () => {
      window.clearTimeout(settle);
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      ScrollTrigger.removeEventListener("refresh", schedule);
    };
  }, [enabled]);
  return active;
}


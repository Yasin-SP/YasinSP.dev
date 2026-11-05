import { Children, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { useLanguage } from "../context/LanguageContext.jsx";

/**
 * Phones: a native scroll-snap carousel with a peek of the next card and a
 * pill pager. From `md` up it is just a grid (pass the grid classes in `gridClassName`).
 * Works in both reading directions: scrollLeft is measured by its absolute value.
 */
export default function SnapRow({ children, gridClassName = "md:grid-cols-3", itemClassName = "w-[82%]", label, breakpoint = "md", hideDots = false }) {
  const { isRTL } = useLanguage();
  const ref = useRef(null);
  const [index, setIndex] = useState(0);
  const items = Children.toArray(children);
  const bp = breakpoint === "sm"
    ? { row: "sm:mx-0 sm:grid sm:overflow-visible sm:px-0", item: "sm:w-auto", dots: "sm:hidden" }
    : { row: "md:mx-0 md:grid md:overflow-visible md:px-0", item: "md:w-auto", dots: "md:hidden" };

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    let frame = 0;
    const compute = () => {
      frame = 0;
      const kids = Array.from(el.children);
      if (!kids.length) return;
      const center = el.getBoundingClientRect().left + el.clientWidth / 2;
      let best = 0;
      let bestDist = Infinity;
      kids.forEach((kid, i) => {
        const r = kid.getBoundingClientRect();
        const d = Math.abs(r.left + r.width / 2 - center);
        if (d < bestDist) { bestDist = d; best = i; }
      });
      setIndex(best);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(compute); };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => { el.removeEventListener("scroll", onScroll); cancelAnimationFrame(frame); };
  }, []);

  const goTo = (i) => {
    const kid = ref.current?.children[i];
    kid?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  };

  return (
    <div>
      <div
        ref={ref}
        role="group"
        aria-roledescription="carousel"
        aria-label={label}
        data-snap-row
        className={`snap-row -mx-6 flex snap-x snap-mandatory items-stretch gap-3.5 overflow-x-auto px-6 pb-3 ${bp.row} ${gridClassName} md:gap-5`}
        style={{ scrollPaddingInline: "1.5rem" }}
      >
        {items.map((child, i) => (
          <div key={child.key ?? i} className={`${itemClassName} ${bp.item} shrink-0 snap-center`} aria-label={`${i + 1} / ${items.length}`}>
            {child}
          </div>
        ))}
      </div>
      <div className={`mt-4 ${hideDots ? "hidden" : "flex"} items-center justify-center gap-1.5 ${bp.dots}`} dir={isRTL ? "rtl" : "ltr"} role="tablist" aria-label={label}>
        {items.map((_, i) => (
          <button key={i} type="button" role="tab" aria-selected={i === index} aria-label={`${i + 1} / ${items.length}`} onClick={() => goTo(i)} className="flex h-6 cursor-pointer items-center px-0.5">
            <motion.span
              layout
              animate={{ width: i === index ? 22 : 6, opacity: i === index ? 1 : 0.4 }}
              transition={{ type: "spring", stiffness: 500, damping: 34 }}
              className="block h-1.5 rounded-full"
              style={{ background: i === index ? "var(--tone, var(--accent-fill))" : "var(--color-text-muted)" }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

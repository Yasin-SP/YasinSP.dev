import { useEffect, useRef } from "react";
import { ChevronRight } from "lucide-react";
import { approachSteps } from "../data/approach.js";
import { getUI } from "../i18n.js";
import { localize, useLanguage } from "../context/LanguageContext.jsx";
import { MOTION, ScrollTrigger, gsap, useGSAP } from "../lib/gsap.js";
import GlassCard from "./GlassCard.jsx";
import Section from "./Section.jsx";
import SectionIntro from "./SectionIntro.jsx";

const tones = ["purple", "indigo", "pink", "blue"];

/**
 * Large screens: the section locks once everything fits the window, then the
 * steps are presented one at a time, always left to right (01-04 read left to
 * right in Persian too). The newest step is in focus, earlier ones settle back,
 * and a connector draws itself between neighbours as the next step arrives.
 * Smaller screens get plain stacked reveals.
 */
function ApproachSection() {
  const { language, isRTL } = useLanguage();
  const copy = getUI(language, "approach");
  const sectionRef = useRef(null);
  const pinRef = useRef(null);
  const gridRef = useRef(null);

  // Built once. Copy changes in place when the language switches, so nothing is torn down or re-hidden.
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const steps = gsap.utils.toArray("[data-step]", gridRef.current);
      const links = gsap.utils.toArray("[data-link]", gridRef.current);
      gsap.set(steps, { autoAlpha: 0, y: 48, scale: 0.96 });
      gsap.set(links, { autoAlpha: 0 });
      gsap.set("[data-fill]", { scaleX: 0 });

      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        scrollTrigger: {
          trigger: pinRef.current,
          // Lock only once the heading and all four cards are centred in the window; if they cannot fit, align under the nav instead.
          start: () => (pinRef.current.offsetHeight > window.innerHeight - 120 ? "top 96px" : "center center"),
          end: () => `+=${Math.round(window.innerHeight * 1.5)}`,
          pin: true,
          scrub: MOTION.scrub,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      steps.forEach((step, i) => {
        const at = i * 1.2;
        tl.to(step, { autoAlpha: 1, y: 0, scale: 1.02, duration: 1 }, at);
        if (i > 0) {
          tl.to(steps[i - 1], { opacity: 0.6, scale: 1, duration: 0.8 }, at);
          tl.to(links[i - 1], { autoAlpha: 1, duration: 0.2 }, at - 0.2);
          tl.to(links[i - 1].querySelector("[data-fill]"), { scaleX: 1, duration: 0.9, ease: "none" }, at - 0.2);
        }
      });
      // Final beat: everything returns to full strength so the whole process reads at once.
      tl.to(steps, { opacity: 1, scale: 1, duration: 0.8 }, steps.length * 1.2);
      tl.to({}, { duration: 0.3 });
      return undefined;
    });

    mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
      gsap.utils.toArray("[data-step]", gridRef.current).forEach((step, i) => {
        gsap.fromTo(step, { autoAlpha: 0, y: MOTION.y }, { autoAlpha: 1, y: 0, duration: MOTION.duration, ease: MOTION.ease, delay: (i % 2) * 0.08, clearProps: "transform,opacity,visibility", scrollTrigger: { trigger: step, start: MOTION.start, once: true } });
      });
    });

    return () => mm.revert();
  }, { scope: sectionRef });

  // Different copy can change heights; re-measure the pin after the new text has laid out.
  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [language]);

  return (
    <Section id="approach" tone="indigo" sectionRef={sectionRef}>
      <div ref={pinRef} className="w-full">
        <SectionIntro eyebrow={copy.eyebrow} title={copy.title} highlight={copy.highlight} />
        <div ref={gridRef} dir="ltr" className="relative mt-12 lg:mt-14">
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
            {approachSteps.map((step, index) => {
              const item = localize(step, language);
              const last = index === approachSteps.length - 1;
              return (
                <li key={step.number} data-step dir={isRTL ? "rtl" : "ltr"} className="relative">
                  <GlassCard reveal={false} tone={tones[index % tones.length]} tiltDeg={4} className="flex min-h-60 flex-col p-6 text-start md:p-7">
                    <span className="text-tone font-display text-[44px] font-bold leading-none" dir="ltr" style={{ textAlign: "start" }}>{step.number}</span>
                    <h3 className="mt-8 font-display text-xl font-bold leading-tight text-(--color-text-primary) md:text-2xl">{item.title}</h3>
                    <p className="mt-3 font-sans text-[15px] leading-relaxed text-(--color-text-secondary)">{item.description}</p>
                  </GlassCard>
                  {!last && (
                    <span data-link dir="ltr" aria-hidden="true" className="pointer-events-none absolute -right-12 top-1/2 hidden h-6 w-12 -translate-y-1/2 items-center lg:flex">
                      <span className="relative mx-2 h-px flex-1 overflow-hidden" style={{ background: "var(--color-border-strong)" }}>
                        <span data-fill className="absolute inset-0 origin-left" style={{ background: "var(--c-purple)" }} />
                      </span>
                      <ChevronRight size={14} strokeWidth={2.2} className="-ms-2.5 shrink-0 text-(--c-purple)" />
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </Section>
  );
}
export default ApproachSection;

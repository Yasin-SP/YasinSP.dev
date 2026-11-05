import { useRef } from "react";
import { MOTION, NO_PREFERENCE, gsap, useGSAP } from "../lib/gsap.js";
import { journeySteps } from "../data/journey.js";
import { getUI } from "../i18n.js";
import { localize, useLanguage } from "../context/LanguageContext.jsx";
import GlassCard from "./GlassCard.jsx";
import Reveal from "./Reveal.jsx";
import ScrollWords from "./ScrollWords.jsx";
import Section from "./Section.jsx";
import SectionIntro from "./SectionIntro.jsx";

const stepTones = ["blue", "purple", "pink", "orange", "teal", "indigo"];

function AboutSection() {
  const { language } = useLanguage();
  const copy = getUI(language, "about");
  const isFa = language === "fa";
  const listRef = useRef(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(NO_PREFERENCE, () => {
      gsap.fromTo(".tl-fill", { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: listRef.current, start: "top 65%", end: "bottom 55%", scrub: MOTION.scrub } });
      gsap.utils.toArray(".tl-dot").forEach((dot) => {
        gsap.fromTo(dot, { scale: 0.3, autoAlpha: 0.3 }, { scale: 1, autoAlpha: 1, duration: 0.8, ease: "back.out(2.4)", clearProps: "transform,opacity,visibility", scrollTrigger: { trigger: dot, start: "top 70%", once: true } });
      });
    });
    return () => mm.revert();
  }, { scope: listRef });

  return (
    <Section id="about" tone="blue">
      <SectionIntro eyebrow={copy.eyebrow} title={copy.title} highlight={copy.highlight} />
      {/* The introduction as an iMessage: the words still light up one by one as you scroll */}
      <div className="mt-10 max-w-3xl md:mt-14">
        <p className="text-center font-sans text-xs font-medium text-(--color-text-muted)">{isFa ? "امروز ۹:۴۱" : "Today 9:41 AM"}</p>
        <div className="mt-4 ms-3 flex items-end">
          <div className="imsg-bubble">
            <ScrollWords text={copy.description} className="font-sans text-[clamp(1.1rem,2.1vw,1.55rem)] leading-relaxed text-(--color-text-primary)" />
          </div>
        </div>
      </div>

      <div className="mt-20 grid items-start gap-14 lg:mt-28 lg:grid-cols-12 lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:col-span-5">
          <GlassCard tone="blue" tiltDeg={5} className="p-7 text-start md:p-8">
            <span className="pill text-(--color-text-primary)">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-(--c-green)" />
              {copy.currentLabel}
            </span>
            <p className="mt-5 font-display text-[20px] font-semibold leading-snug text-(--color-text-primary)">{copy.current}</p>
          </GlassCard>
        </div>

        <ol ref={listRef} className="relative lg:col-span-7">
          {/* Track + the coloured line that fills with scroll */}
          <span aria-hidden="true" className="absolute inset-y-2 start-[0.9rem] w-0.5 rounded-full" style={{ background: "var(--color-border)" }} />
          <span aria-hidden="true" className="tl-fill absolute inset-y-2 start-[0.9rem] w-0.5 origin-top rounded-full" style={{ background: "var(--c-purple)" }} />

          {journeySteps.map((step, i) => {
            const item = localize(step, language);
            const tone = stepTones[i % stepTones.length];
            return (
              <Reveal key={step.title} as="li" delay={0.05} y={22} className={`tone-${tone} relative ps-14 pb-12 text-start last:pb-0`}>
                <span
                  aria-hidden="true"
                  className="tl-dot absolute start-0 top-1 flex h-[1.9rem] w-[1.9rem] items-center justify-center rounded-full"
                  style={{ background: "var(--color-bg)", boxShadow: "0 0 0 2px var(--tone)" }}
                >
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--tone)" }} />
                </span>
                <span dir="ltr" className="text-tone inline-block font-display text-sm font-bold" style={{ textAlign: "start" }}>{item.year}</span>
                <h3 className="mt-1 font-display text-xl font-bold leading-snug text-(--color-text-primary) md:text-2xl">{item.title}</h3>
                <p className="mt-2 max-w-xl font-sans text-base leading-relaxed text-(--color-text-secondary)">{item.description}</p>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}
export default AboutSection;

import { motion } from "motion/react";
import { purpleGradient, smoothEase } from "../constants/theme.js";
import { journeySteps } from "../data/journey.js";
import { getUI } from "../i18n.js";
import { localize, useLanguage } from "../context/LanguageContext.jsx";
import SectionIntro from "./SectionIntro.jsx";

function AboutSection() {
  const { language } = useLanguage();
  const copy = getUI(language, "about");
  return (
    <section id="about" className="relative w-full py-28 md:py-36">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-14 lg:gap-24 items-start">
          <div className="lg:sticky lg:top-32">
            <SectionIntro eyebrow={copy.eyebrow} title={copy.title} highlight={copy.highlight} description={copy.description} />
            <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.35 }} transition={{ duration: 0.65, ease: smoothEase, delay: 0.12 }} className="mt-8 rounded-2xl border p-6" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
              <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-(--color-purple-1)">{copy.currentLabel}</span>
              <p className="font-display text-lg font-medium text-(--color-text-primary) mt-3 leading-snug">{copy.current}</p>
            </motion.div>
          </div>
          <div className="relative">
            <div className="absolute inset-s-1.75 top-2 bottom-2 w-px opacity-40" style={{ backgroundImage: purpleGradient }} />
            <div className="flex flex-col gap-12 md:gap-14">
              {journeySteps.map((step, i) => {
                const item = localize(step, language);
                return <motion.article key={step.title} initial={{ opacity: 0, x: language === "fa" ? -20 : 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.45 }} transition={{ duration: 0.6, ease: smoothEase, delay: i * 0.05 }} className="relative ps-8 md:ps-10">
                  <span className="absolute inset-s-0 top-1.5 w-4 h-4 rounded-full" style={{ backgroundImage: purpleGradient, border: "3px solid var(--color-bg)" }} />
                  <span className="font-display text-(--color-purple-1) opacity-80 text-sm tracking-wide">{item.year}</span>
                  <h3 className="font-display text-(--color-text-primary) text-xl md:text-2xl font-semibold mt-1 mb-2 tracking-tight">{item.title}</h3>
                  <p className="font-sans text-(--color-text-secondary) text-sm md:text-base leading-relaxed max-w-xl">{item.description}</p>
                </motion.article>;
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
export default AboutSection;

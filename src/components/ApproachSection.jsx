import { motion } from "motion/react";
import { smoothEase } from "../constants/theme.js";
import { approachSteps } from "../data/approach.js";
import { getUI } from "../i18n.js";
import { localize, useLanguage } from "../context/LanguageContext.jsx";
import SectionIntro from "./SectionIntro.jsx";

function ApproachSection() {
  const { language, isRTL } = useLanguage();
  const copy = getUI(language, "approach");
  return (
    <section id="approach" className="relative w-full py-28 md:py-36">
      <div dir={isRTL ? "rtl" : "ltr"} className="max-w-7xl mx-auto px-6 md:px-12">
        <SectionIntro eyebrow={copy.eyebrow} title={copy.title} highlight={copy.highlight} description={copy.description} />
        <div className="grid md:grid-cols-2 gap-px mt-14 md:mt-20 rounded-2xl overflow-hidden border" style={{ background: "var(--color-border)", borderColor: "var(--color-border)" }}>
          {approachSteps.map((step, index) => {
            const item = localize(step, language);
            return <motion.article key={step.number} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6, ease: smoothEase, delay: index * 0.06 }} className="group relative min-h-60 md:min-h-70 p-7 md:p-9 bg-(--color-bg)">
              <span className={`font-sans text-[10px] tracking-[0.2em] text-(--color-purple-1) block ${isRTL ? "text-right" : ""}`}>{step.number}</span>
              <h3 className="font-display text-2xl md:text-3xl font-semibold text-(--color-text-primary) mt-12 tracking-tight group-hover:translate-x-1 transition-transform duration-500">{item.title}</h3>
              <p className={`font-sans text-sm md:text-base leading-relaxed text-(--color-text-secondary) mt-3 max-w-sm ${isRTL ? "text-right" : ""}`}>{item.description}</p>
              <div className="absolute inset-e-7 bottom-7 w-10 h-px bg-(--color-border) group-hover:w-16 transition-all duration-500"><span className="absolute inset-e-0 -top-1 w-2 h-2 rounded-full bg-(--color-purple-1) opacity-0 group-hover:opacity-100 transition-opacity duration-500" /></div>
            </motion.article>;
          })}
        </div>
      </div>
    </section>
  );
}
export default ApproachSection;

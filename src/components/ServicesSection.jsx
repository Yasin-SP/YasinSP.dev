import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { smoothEase } from "../constants/theme.js";
import { services } from "../data/services.js";
import { getUI } from "../i18n.js";
import { localize, useLanguage } from "../context/LanguageContext.jsx";
import SectionIntro from "./SectionIntro.jsx";

function ServicesSection() {
  const { language, isRTL } = useLanguage();
  const copy = getUI(language, "services");
  return (
    <section id="services" className="relative w-full py-28 md:py-36">
      <div dir={isRTL ? "rtl" : "ltr"} className="max-w-7xl mx-auto px-6 md:px-12">
        <SectionIntro eyebrow={copy.eyebrow} title={copy.title} highlight={copy.highlight} description={copy.description} />
        <div className="mt-14 md:mt-20 border-t" style={{ borderColor: "var(--color-border)" }}>
          {services.map((service, index) => {
            const item = localize(service, language);
            return <motion.article key={service.number} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.65, ease: smoothEase, delay: index * 0.06 }} className="group grid grid-cols-[48px_1fr_auto] md:grid-cols-[80px_1.15fr_1fr_40px] gap-5 md:gap-10 py-8 md:py-10 border-b" style={{ borderColor: "var(--color-border)" }}>
              <span className={`font-sans text-xs tracking-[0.18em] text-[var(--color-purple-1)] pt-1 ${isRTL ? "text-right" : ""}`}>{service.number}</span>
              <div className={isRTL ? "text-right" : ""}>
                <h3 className="font-display text-xl md:text-2xl font-semibold text-[var(--color-text-primary)] tracking-tight group-hover:translate-x-1 transition-transform duration-500">{item.title}</h3>
                <div className="flex flex-wrap gap-2 mt-4 md:hidden">{item.tags.map((tag) => <span key={tag} className="text-[10px] px-2.5 py-1 rounded-full border text-[var(--color-text-secondary)]" style={{ borderColor: "var(--color-border)" }}>{tag}</span>)}</div>
              </div>
              <p className={`hidden md:block font-sans text-sm md:text-base leading-relaxed text-[var(--color-text-secondary)] max-w-md ${isRTL ? "text-right" : ""}`}>{item.description}</p>
              <ArrowUpRight size={18} className="text-[var(--color-text-muted)] group-hover:text-[var(--color-purple-1)] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-500 mt-1" />
              <p className={`col-start-2 col-span-2 md:hidden font-sans text-sm leading-relaxed text-[var(--color-text-secondary)] ${isRTL ? "text-right" : ""}`}>{item.description}</p>
            </motion.article>;
          })}
        </div>
      </div>
    </section>
  );
}
export default ServicesSection;

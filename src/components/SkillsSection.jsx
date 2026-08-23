import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { smoothEase } from "../constants/theme.js";
import { learningNow, learningNowFa, skillCategories } from "../data/skills.js";
import { getUI } from "../i18n.js";
import { localize, useLanguage } from "../context/LanguageContext.jsx";
import SectionIntro from "./SectionIntro.jsx";

function SkillsSection() {
  const { language, isRTL } = useLanguage();
  const copy = getUI(language, "skills");
  const learning = language === "fa" ? learningNowFa : learningNow;
  return (
    <section id="skills" className="relative w-full py-28 md:py-36">
      <div dir={isRTL ? "rtl" : "ltr"} className="max-w-7xl mx-auto px-6 md:px-12">
        <SectionIntro eyebrow={copy.eyebrow} title={copy.title} highlight={copy.highlight} description={copy.description} />
        <div className="grid lg:grid-cols-[1.5fr_0.8fr] gap-8 md:gap-10 mt-14 md:mt-20">
          <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
            {skillCategories.map((category, categoryIndex) => {
              const item = localize(category, language);
              return <motion.div key={category.name} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.6, ease: smoothEase, delay: categoryIndex * 0.06 }} className="p-6 md:p-8 border-b last:border-b-0" style={{ borderColor: "var(--color-border)" }}>
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div><h3 className="font-display text-xl md:text-2xl font-semibold text-(--color-text-primary) tracking-tight">{item.name}</h3><p className="font-sans text-sm text-(--color-text-secondary) mt-1">{item.description}</p></div>
                  <span className="font-sans text-[10px] tracking-[0.18em] uppercase text-(--color-text-muted)">{String(categoryIndex + 1).padStart(2, "0")}</span>
                </div>
                <div className="flex flex-wrap gap-2.5 mt-6">{item.skills.map((skill) => <span key={skill} className="group inline-flex items-center gap-2 rounded-full px-3.5 py-2 border text-xs md:text-sm text-(--color-text-secondary) hover:text-(--color-text-primary) transition-colors duration-300" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}><span className="w-1.5 h-1.5 rounded-full bg-(--color-purple-1) opacity-70 group-hover:opacity-100" />{skill}</span>)}</div>
              </motion.div>;
            })}
          </div>
          <motion.aside initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.65, ease: smoothEase, delay: 0.1 }} className="rounded-2xl border p-7 md:p-8 flex flex-col justify-between min-h-70" style={{ borderColor: "var(--color-border)", background: "linear-gradient(145deg, var(--color-surface-hover), var(--color-surface))" }}>
            <div><span className="font-sans text-[10px] tracking-[0.2em] uppercase text-(--color-purple-1)">{copy.exploring}</span><h3 className="font-display text-2xl md:text-3xl font-semibold text-(--color-text-primary) mt-4 tracking-tight">{copy.exploringTitle}</h3></div>
            <div className="flex flex-col gap-3 mt-10">{learning.map((item) => <div key={item} className="flex items-center justify-between py-3 border-b last:border-b-0" style={{ borderColor: "var(--color-border)" }}><span className="font-sans text-sm text-(--color-text-secondary)">{item}</span><ArrowUpRight size={14} className="text-(--color-text-muted)" /></div>)}</div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
export default SkillsSection;

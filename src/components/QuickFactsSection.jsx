import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { smoothEase } from "../constants/theme.js";
import { getUI } from "../i18n.js";
import { useLanguage } from "../context/LanguageContext.jsx";

const facts = [
  { value: "React", key: "stack" },
  { value: "Frontend", key: "focus" },
  { value: "UI / Motion", key: "craft" },
  { value: "Computer Engineering", key: "degree" },
];

function QuickFactsSection() {
  const { language } = useLanguage();
  const copy = getUI(language, "facts");
  return (
    <section className="relative w-full px-6 md:px-12 -mt-4 lg:-mt-12 z-20">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.8, ease: smoothEase }} className="grid grid-cols-2 lg:grid-cols-4 rounded-2xl border overflow-hidden" style={{ borderColor: "var(--color-border)", background: "linear-gradient(180deg, var(--color-surface-hover), var(--color-surface))" }}>
          {facts.map((fact, index) => (
            <div key={fact.key} className={`group relative min-h-29.5 md:min-h-34.5 p-5 md:p-7 flex flex-col justify-between ${index < facts.length - 1 ? "border-r border-b lg:border-b-0" : "border-b-0"} ${index === 1 ? "lg:border-r" : ""}`} style={{ borderColor: "var(--color-border)" }}>
              <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-(--color-text-muted)">{String(index + 1).padStart(2, "0")}</span>
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="font-display text-xl md:text-2xl font-semibold text-(--color-text-primary) tracking-tight">{fact.value}</p>
                  <p className="font-sans text-xs text-(--color-text-secondary) mt-1">{copy[fact.key]}</p>
                </div>
                <ArrowUpRight size={15} className="text-(--color-purple-1) opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
export default QuickFactsSection;

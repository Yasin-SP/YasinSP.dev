import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { purpleGradient, smoothEase } from "../constants/theme.js";
import { getUI } from "../i18n.js";
import { useLanguage } from "../context/LanguageContext.jsx";

function ClosingCTA() {
  const { language, isRTL } = useLanguage();
  const copy = getUI(language, "closing");
  return <section className="relative w-full py-28 md:py-40 overflow-hidden">
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true"><div className="absolute left-1/2 top-1/2 h-112 w-md -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/8 blur-[110px]" /></div>
    <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12">
      <motion.div dir={isRTL ? "rtl" : "ltr"} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.35 }} transition={{ duration: 0.8, ease: smoothEase }} className={`rounded-4xl border p-8 sm:p-12 md:p-16 ${isRTL ? "text-right" : "text-left"}`} style={{ borderColor: "var(--color-border)", background: "linear-gradient(145deg, var(--color-surface-hover), var(--color-surface))" }}>
        <span className="font-sans text-[10px] uppercase tracking-[0.24em] text-(--color-purple-1)">{copy.eyebrow}</span>
        <h2 className="font-display font-bold text-(--color-text-primary) text-4xl sm:text-5xl md:text-7xl leading-[0.98] tracking-tight mt-5">{copy.title} <span style={{ backgroundImage: purpleGradient, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>{copy.highlight}</span></h2>
        <p className="font-sans text-(--color-text-secondary) text-base md:text-lg leading-relaxed max-w-xl mt-7">{copy.description}</p>
        <Link to="/contact" className="mt-9 inline-flex min-h-12 items-center gap-2 rounded-full border border-purple-400/30 px-6 text-sm font-medium text-white transition-transform duration-300 hover:-translate-y-0.5" style={{ backgroundImage: purpleGradient }}>{copy.cta}<ArrowUpRight size={15} /></Link>
      </motion.div>
    </div>
  </section>;
}
export default ClosingCTA;

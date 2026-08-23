import { motion } from "motion/react";
import { purpleGradient, smoothEase } from "../constants/theme.js";
import { useLanguage } from "../context/LanguageContext.jsx";

function SectionIntro({ eyebrow, title, highlight, description, align = "left" }) {
  const centered = align === "center";
  const { isRTL } = useLanguage();
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.7, ease: smoothEase }}
      className={`${centered ? "mx-auto text-center" : isRTL ? "text-right" : "text-left"} max-w-2xl`}
    >
      <span className="font-sans text-xs tracking-[0.22em] uppercase text-(--color-purple-1) opacity-80">{eyebrow}</span>
      <h2 className="font-display text-(--color-text-primary) text-3xl sm:text-4xl md:text-5xl font-bold mt-4 leading-[1.08] tracking-tight">
        {title} {highlight && <span className="inline-block" style={{ backgroundImage: purpleGradient, backgroundSize: "300% 300%", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>{highlight}</span>}
      </h2>
      {description && <p className="font-sans text-(--color-text-secondary) text-base md:text-lg leading-relaxed mt-5">{description}</p>}
    </motion.div>
  );
}
export default SectionIntro;

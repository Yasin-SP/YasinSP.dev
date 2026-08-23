import { motion } from "motion/react";
import { useLanguage } from "../context/LanguageContext.jsx";

/** Visible first-screen selector + quiet editorial footer selector. */
export default function LanguageToggle({ variant = "footer" }) {
  const { language, setLanguage } = useLanguage();
  const isHero = variant === "hero";

  return (
    <div
      dir="ltr"
      className={isHero ? "inline-flex items-center gap-1 cursor-pointer rounded-full border p-1 backdrop-blur-xl" : "inline-flex items-center gap-2 font-sans text-[10px] tracking-[0.18em]"}
      style={isHero ? { borderColor: "var(--color-border-strong)", background: "var(--color-surface)" } : undefined}
      aria-label="Language"
    >
      {[{ code: "en", label: "EN" }, { code: "fa", label: "فا" }].map((item, index) => (
        <span key={item.code} className="inline-flex items-center">
          {index > 0 && !isHero ? <span className="mx-1 text-(--color-text-muted) opacity-50">/</span> : null}
          <motion.button
            type="button"
            onClick={() => setLanguage(item.code)}
            whileTap={{ scale: 0.96 }}
            aria-pressed={language === item.code}
            aria-label={item.code === "en" ? "Switch to English" : "Switch to Persian"}
            className={isHero ? "min-w-10 rounded-full cursor-pointer px-3 py-2 font-sans text-[10px] font-semibold transition-colors duration-300" : "relative px-0.5 py-1 font-sans font-medium transition-colors duration-300"}
            style={{
              color: language === item.code ? "var(--color-text-primary)" : "var(--color-text-muted)",
              ...(isHero && language === item.code ? { background: "var(--color-accent-surface)", boxShadow: "inset 0 0 0 1px var(--color-accent-border)" } : {}),
            }}
          >
            {item.label}
            {!isHero && language === item.code ? <span className="absolute -bottom-0.5 left-0 h-px w-full" style={{ background: "var(--color-purple-1)" }} aria-hidden="true" /> : null}
          </motion.button>
        </span>
      ))}
    </div>
  );
}

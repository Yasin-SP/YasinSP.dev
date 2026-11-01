import { useId } from "react";
import { motion } from "motion/react";
import { useLanguage } from "../context/LanguageContext.jsx";

const OPTIONS = [
  { code: "en", label: "EN", aria: "Switch to English" },
  { code: "fa", label: "فا", aria: "تغییر زبان به فارسی" },
];

/**
 * Language switch.
 * - variant "nav": compact segmented control with a sliding pill (header).
 * - variant "footer": quiet text switch.
 */
export default function LanguageToggle({ variant = "footer" }) {
  const { language, setLanguage } = useLanguage();
  const pillId = useId();
  const isNav = variant === "nav";

  if (!isNav) {
    return (
      <div dir="ltr" role="group" aria-label="Language" className="inline-flex items-center gap-2 font-sans text-xs">
        {OPTIONS.map((item, index) => (
          <span key={item.code} className="inline-flex items-center gap-2">
            {index > 0 ? <span aria-hidden="true" className="text-(--color-border-strong)">/</span> : null}
            <button
              type="button"
              onClick={() => setLanguage(item.code)}
              aria-pressed={language === item.code}
              aria-label={item.aria}
              className="cursor-pointer py-1 font-medium transition-colors duration-300"
              style={{ color: language === item.code ? "var(--color-text-primary)" : "var(--color-text-muted)", ...(item.code === "fa" ? { fontFamily: "var(--font-persian)" } : {}) }}
            >
              {item.label}
            </button>
          </span>
        ))}
      </div>
    );
  }

  return (
    <div dir="ltr" role="group" aria-label="Language" className="inline-flex h-8 items-center rounded-full p-0.5" style={{ background: "var(--color-surface)" }}>
      {OPTIONS.map((item) => {
        const active = language === item.code;
        return (
          <button
            key={item.code}
            type="button"
            onClick={() => setLanguage(item.code)}
            aria-pressed={active}
            aria-label={item.aria}
            className="relative h-7 min-w-9 cursor-pointer rounded-full px-2.5 font-sans text-xs font-semibold transition-colors duration-300"
            style={{ color: active ? "var(--color-text-primary)" : "var(--color-text-muted)", ...(item.code === "fa" ? { fontFamily: "var(--font-persian)" } : {}) }}
          >
            {active && (
              <motion.span
                layoutId={`lang-pill-${pillId}`}
                aria-hidden="true"
                className="absolute inset-0 rounded-full"
                style={{ background: "var(--color-bg-elevated)", boxShadow: "0 1px 3px rgba(0,0,0,0.25)" }}
                transition={{ type: "spring", stiffness: 420, damping: 36 }}
              />
            )}
            <span className="relative">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

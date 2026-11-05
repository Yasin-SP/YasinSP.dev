import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Briefcase, FolderKanban, Layers, Route, Send, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext.jsx";
import { scrollToTarget } from "../lib/scroll.js";
import { useActiveSection } from "../hooks/useActiveSection.js";

const ITEMS = [
  { key: "about", href: "#about", icon: User },
  { key: "services", href: "#services", icon: Briefcase },
  { key: "skills", href: "#skills", icon: Layers },
  { key: "work", href: "#projects", icon: FolderKanban },
  { key: "approach", href: "#approach", icon: Route },
];
const LABELS = {
  en: { about: "About", services: "Services", skills: "Skills", work: "Work", approach: "Process", contact: "Contact", nav: "Sections" },
  fa: { about: "درباره", services: "خدمات", skills: "مهارت", work: "پروژه", approach: "رویکرد", contact: "تماس", nav: "بخش‌های سایت" },
};
const spring = { type: "spring", stiffness: 420, damping: 32, mass: 0.8 };

/**
 * Phone-only bottom tab bar (iOS style). Floating glass capsule, one bubble
 * that glides to the active section, labels that collapse while you scroll
 * down and return as soon as you scroll up.
 */
export default function MobileDock() {
  const { language } = useLanguage();
  const reduce = useReducedMotion();
  const location = useLocation();
  const isHome = location.pathname === "/";
  const active = useActiveSection(isHome);
  const [compact, setCompact] = useState(false);
  const last = useRef(0);
  const labels = LABELS[language];

  useEffect(() => {
    last.current = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const dy = y - last.current;
      if (Math.abs(dy) < 6) return;
      setCompact(dy > 0 && y > 120);
      last.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const tap = () => { try { navigator.vibrate?.(6); } catch { /* optional haptic */ } };

  return (
    <motion.nav
      aria-label={labels.nav}
      dir="ltr"
      initial={{ y: 120, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={reduce ? { duration: 0 } : { ...spring, delay: 0.5 }}
      className="mobile-dock fixed inset-x-0 bottom-0 z-100 flex justify-center px-3 pb-[max(0.65rem,env(safe-area-inset-bottom))] lg:hidden"
    >
      <motion.div
        layout
        transition={spring}
        className="glass flex items-center gap-0.5 p-1.5"
        style={{ "--r": "999px", "--glass-blur": "34px", background: "var(--glass-sheen), var(--dock-bg)", boxShadow: "var(--glass-inner), var(--glass-shadow), 0 18px 40px -12px rgba(0,0,0,0.5)" }}
      >
        {ITEMS.map((item) => {
          const Icon = item.icon;
          const on = active === item.href.slice(1);
          return (
            <a
              key={item.key}
              href={isHome ? item.href : `/${item.href}`}
              aria-current={on ? "true" : undefined}
              aria-label={labels[item.key]}
              onClick={(e) => { tap(); if (isHome) { e.preventDefault(); scrollToTarget(item.href); } }}
              className="glass-press relative flex min-w-12 flex-col items-center justify-center gap-0.5 rounded-full px-2.5 py-2 font-sans"
              style={{ color: on ? "var(--accent-text)" : "var(--color-text-secondary)" }}
            >
              {on && (
                <motion.span
                  layoutId="dock-bubble"
                  transition={spring}
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full"
                  style={{ background: "color-mix(in srgb, var(--c-purple) 20%, transparent)", boxShadow: "0 0 0 1px color-mix(in srgb, var(--c-purple) 36%, transparent) inset, 0 1px 0 rgba(255,255,255,0.2) inset" }}
                />
              )}
              <motion.span className="relative flex" animate={{ y: on ? -1 : 0, scale: on ? 1.08 : 1 }} transition={spring}>
                <Icon size={20} strokeWidth={on ? 2.2 : 1.8} />
              </motion.span>
              <motion.span
                className="relative block overflow-hidden whitespace-nowrap text-[10px] font-semibold leading-none"
                animate={{ height: compact ? 0 : 12, opacity: compact ? 0 : 1 }}
                transition={spring}
              >
                {labels[item.key]}
              </motion.span>
            </a>
          );
        })}
        <Link
          to="/contact"
          onClick={tap}
          aria-label={labels.contact}
          className="glass-press ms-1 flex min-w-12 flex-col items-center justify-center gap-0.5 rounded-full px-2.5 py-2 font-sans text-white"
          style={{ background: "var(--btn-fill)", boxShadow: "0 1px 0 rgba(255,255,255,0.28) inset, 0 8px 18px -8px color-mix(in srgb, var(--c-purple) 80%, transparent)" }}
        >
          <Send size={19} strokeWidth={2} className="rtl:-scale-x-100" />
          <motion.span className="block overflow-hidden whitespace-nowrap text-[10px] font-semibold leading-none" animate={{ height: compact ? 0 : 12, opacity: compact ? 0 : 1 }} transition={spring}>
            {labels.contact}
          </motion.span>
        </Link>
      </motion.div>
    </motion.nav>
  );
}

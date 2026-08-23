import { useEffect, useRef, useState } from "react";
import { ArrowRight, Menu, Moon, Sun, X } from "lucide-react";
import logo from "../assets/Signature.svg";
import { useScroll, useMotionValueEvent, motion, AnimatePresence } from "motion/react";
import { Link, useLocation } from "react-router-dom";
import { purpleGradient } from "../constants/theme.js";
import { useTheme } from "../context/ThemeContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import { stopGlobalScroll, startGlobalScroll, scrollToTop } from "../lib/lenisInstance.js";

function ThemeToggle({ floating = false }) {
  const { theme, toggleThemeAtPoint } = useTheme();
  return (
    <motion.button
      type="button"
      onClick={(e) => toggleThemeAtPoint(e.clientX, e.clientY)}
      whileTap={{ scale: 0.92 }}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      className={`flex shrink-0 items-center justify-center cursor-pointer rounded-full border transition-colors duration-300 ${floating ? "h-12 w-12" : "h-9 w-9"}`}
      style={{ borderColor: "var(--color-border-strong)", color: "var(--color-text-primary)", backgroundColor: "var(--color-surface)", backdropFilter: floating ? "blur(12px)" : undefined }}
    >
      <motion.div key={theme} initial={{ rotate: -90, opacity: 0, scale: 0.6 }} animate={{ rotate: 0, opacity: 1, scale: 1 }} transition={{ duration: 0.35, ease: "easeOut" }}>
        {theme === "dark" ? <Moon size={floating ? 18 : 15} /> : <Sun size={floating ? 18 : 15} />}
      </motion.div>
    </motion.button>
  );
}

const navLinks = [
  { key: "about", href: "#about" },
  { key: "services", href: "#services" },
  { key: "skills", href: "#skills" },
  { key: "work", href: "#projects" },
  { key: "approach", href: "#approach" },
];

function Header() {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const closeButtonRef = useRef(null);
  const wasMobileOpenRef = useRef(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => setScrolled(latest > 50));
  const labels = {
    en: { about: "About", services: "Services", skills: "Skills", work: "Work", approach: "Approach", navigation: "Navigation", close: "Close navigation", open: "Open navigation", contact: "Contact me" },
    fa: { about: "درباره من", services: "خدمات", skills: "مهارت‌ها", work: "پروژه‌ها", approach: "رویکرد من", navigation: "منوی سایت", close: "بستن منو", open: "باز کردن منو", contact: "ارتباط با من" },
  }[language];
  const getAnchor = (href) => (location.pathname === "/" ? href : `/${href}`);

  useEffect(() => {
    if (!mobileOpen) {
      if (wasMobileOpenRef.current) menuButtonRef.current?.focus();
      wasMobileOpenRef.current = false;
      return undefined;
    }
    wasMobileOpenRef.current = true;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    stopGlobalScroll();
    closeButtonRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === "Escape") { setMobileOpen(false); return; }
      if (event.key !== "Tab") return;
      const dialog = document.getElementById("mobile-navigation");
      if (!dialog) return;
      const focusable = dialog.querySelectorAll("a[href], button:not([disabled])");
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      startGlobalScroll();
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`fixed left-1/2 top-0 z-100 flex -translate-x-1/2 items-center justify-between font-display transition-all duration-500 ease-in-out ${scrolled ? "mt-3 h-16 w-[calc(100%-1.5rem)] rounded-full border px-4 backdrop-blur-xl sm:w-[92%] md:w-[82%] md:px-5" : "mt-0 h-20 w-full rounded-none border-transparent bg-transparent px-5 md:h-25 md:px-0"}`}
        style={{ color: "var(--color-text-primary)", backgroundColor: scrolled ? "var(--color-pill-bg)" : "transparent", borderColor: scrolled ? "var(--color-border-strong)" : "transparent", boxShadow: scrolled ? "0 8px 32px rgba(0,0,0,0.25), 0 0 0 1px var(--color-border)" : "none" }}
      >
        <Link to="/" onClick={(event) => { if (location.pathname === "/") { event.preventDefault(); scrollToTop(); } }} aria-label="Yasin — Home" className={`${scrolled ? "h-8 w-24 md:h-8 md:w-28" : "h-10 w-28 md:h-14 md:w-48"} flex shrink-0 items-center justify-center transition-all duration-500`}>
          <img src={logo} alt="Yasin signature" className="h-full w-full object-contain" style={{ transform: "scale(1.45)", filter: theme === "light" ? "invert(1)" : "none" }} />
        </Link>

        <nav aria-label="Primary navigation" className="hidden items-center gap-7 font-sans lg:flex">
          {navLinks.map((item) => (
            <a key={item.key} href={getAnchor(item.href)} className="group relative py-2 text-sm text-(--color-text-secondary) transition-colors duration-300 hover:text-(--color-text-primary)">
              {labels[item.key]}
              <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" style={{ backgroundImage: purpleGradient }} />
            </a>
          ))}
          <ThemeToggle />
        </nav>

        <div className="flex items-center gap-2 mr-5">
          <Link to="/contact" className="group hidden min-h-10 items-center justify-center gap-2 rounded-full border border-purple-400/30 px-4 text-xs font-medium text-white shadow-[0_10px_30px_rgba(107,33,168,.2)] transition-all duration-300 hover:scale-x-103 hover:shadow-[0_14px_38px_rgba(107,33,168,.3)] sm:inline-flex md:min-h-11 md:px-5 md:text-sm" style={{ backgroundImage: purpleGradient, backgroundSize: "200% 200%" }}>
            {labels.contact} <ArrowRight className="group-hover:translate-x-0.5 transition-all duration-300" size={14} />
          </Link>
          <button ref={menuButtonRef} type="button" onClick={() => setMobileOpen(true)} aria-label={labels.open} aria-expanded={mobileOpen} aria-controls="mobile-navigation" className="flex h-11 w-11 items-center justify-center rounded-full border text-(--color-text-primary) transition-transform duration-300 active:scale-95 lg:hidden" style={{ borderColor: "var(--color-border-strong)", background: "var(--color-surface)", backdropFilter: "blur(12px)" }}>
            <Menu size={19} />
          </button>
        </div>
      </header>

      <div className="h-20 md:h-25" />
      <div className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-110 flex items-center gap-2 md:hidden"><ThemeToggle floating /></div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }} className="fixed inset-0 z-150 bg-black/70 backdrop-blur-md lg:hidden" onClick={() => setMobileOpen(false)}>
            <motion.aside id="mobile-navigation" role="dialog" aria-modal="true" aria-label={labels.navigation} initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }} onClick={(e) => e.stopPropagation()} className="mobile-menu-panel ml-auto flex h-dvh w-[min(88vw,390px)] min-h-0 flex-col overflow-hidden border-l bg-(--color-bg-elevated)" style={{ borderColor: "var(--color-border)" }}>
              <div className="flex shrink-0 items-center justify-between px-6 pb-5 pt-[max(1.25rem,env(safe-area-inset-top))]">
                <span className="font-sans text-[10px] uppercase tracking-[0.22em] text-(--color-text-muted)">{labels.navigation}</span>
                <button ref={closeButtonRef} type="button" onClick={() => setMobileOpen(false)} aria-label={labels.close} className="flex h-11 w-11 items-center justify-center rounded-full border text-(--color-text-primary)" style={{ borderColor: "var(--color-border)" }}><X size={18} /></button>
              </div>

              <nav aria-label={labels.navigation} className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pb-6">
                <div className="border-t" style={{ borderColor: "var(--color-border)" }}>
                  {navLinks.map((item, index) => (
                    <a key={item.key} href={getAnchor(item.href)} onClick={() => setMobileOpen(false)} className="flex min-h-16.5 items-center justify-between border-b font-display text-[clamp(1.35rem,6vw,1.8rem)] leading-none text-(--color-text-primary) transition-colors duration-200 hover:text-(--color-purple-1)" style={{ borderColor: "var(--color-border)" }}>
                      <span>{labels[item.key]}</span><span className="font-sans text-xs text-(--color-purple-1)">0{index + 1}</span>
                    </a>
                  ))}
                </div>
                <Link to="/contact" onClick={() => setMobileOpen(false)} className="mt-5 flex min-h-14 items-center justify-between rounded-2xl border border-purple-400/30 px-5 text-sm font-medium text-white shadow-[0_18px_50px_rgba(107,33,168,.22)] transition-transform duration-300 active:scale-[0.99]" style={{ backgroundImage: purpleGradient }}>
                  {labels.contact} <ArrowRight size={16} />
                </Link>
                <div className="mt-3 flex gap-2">
                  <ThemeToggle />
                </div>
              </nav>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Header;

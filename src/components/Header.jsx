import { useEffect, useRef, useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/Signature.svg";
import { smoothEase } from "../constants/theme.js";
import { useTheme } from "../context/ThemeContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import { scrollToTop } from "../lib/scroll.js";
import LanguageToggle from "./LanguageToggle.jsx";

const navLinks = [
  { key: "about", href: "#about" },
  { key: "services", href: "#services" },
  { key: "skills", href: "#skills" },
  { key: "work", href: "#projects" },
  { key: "approach", href: "#approach" },
];

const LABELS = {
  en: { about: "About", services: "Services", skills: "Skills", work: "Work", approach: "Approach", navigation: "Navigation", close: "Close navigation", open: "Open navigation", contact: "Contact me", themeLight: "Switch to light theme", themeDark: "Switch to dark theme" },
  fa: { about: "درباره من", services: "خدمات", skills: "مهارت‌ها", work: "پروژه‌ها", approach: "رویکرد من", navigation: "منوی سایت", close: "بستن منو", open: "باز کردن منو", contact: "ارتباط با من", themeLight: "تغییر به تم روشن", themeDark: "تغییر به تم تاریک" },
};

function ThemeToggle({ label }) {
  const { theme, toggleThemeAtPoint } = useTheme();
  return (
    <button
      type="button"
      onClick={(e) => toggleThemeAtPoint(e.clientX, e.clientY)}
      aria-label={label}
      className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-(--color-text-secondary) transition-colors duration-300 hover:bg-(--color-surface) hover:text-(--color-text-primary)"
    >
      <motion.span key={theme} className="flex" initial={{ rotate: -40, opacity: 0, scale: 0.7 }} animate={{ rotate: 0, opacity: 1, scale: 1 }} transition={{ duration: 0.35, ease: smoothEase }}>
        {theme === "dark" ? <Moon size={16} strokeWidth={1.8} /> : <Sun size={16} strokeWidth={1.8} />}
      </motion.span>
    </button>
  );
}

function Logo({ theme, onClick }) {
  return (
    <Link to="/" onClick={onClick} aria-label="Yasin — Home" className="flex h-8 w-24 shrink-0 items-center justify-center">
      <img src={logo} alt="" className="h-full w-full object-contain" style={{ transform: "scale(1.5)", filter: theme === "light" ? "invert(1)" : "none" }} />
    </Link>
  );
}

function Header() {
  const { theme } = useTheme();
  const { language, isRTL } = useLanguage();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const closeButtonRef = useRef(null);
  const wasMobileOpenRef = useRef(false);
  const labels = LABELS[language];
  const getAnchor = (href) => (location.pathname === "/" ? href : `/${href}`);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 8);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    if (!mobileOpen) {
      if (wasMobileOpenRef.current) menuButtonRef.current?.focus();
      wasMobileOpenRef.current = false;
      return undefined;
    }
    wasMobileOpenRef.current = true;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
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
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen]);

  // Close the sheet first, then scroll, so the page is scrollable again when the jump starts.
  function goTo(event, href) {
    if (location.pathname !== "/") { setMobileOpen(false); return; }
    event.preventDefault();
    setMobileOpen(false);
    requestAnimationFrame(() => document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  function handleLogoClick(event) {
    if (location.pathname === "/") { event.preventDefault(); setMobileOpen(false); scrollToTop(); }
  }

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-100 h-12 font-sans transition-[background-color,backdrop-filter] duration-300"
        style={{
          backgroundColor: scrolled ? "var(--nav-bg)" : "transparent",
          backdropFilter: scrolled ? "saturate(180%) blur(20px)" : "none",
          WebkitBackdropFilter: scrolled ? "saturate(180%) blur(20px)" : "none",
        }}
      >
        <div dir="ltr" className="relative mx-auto flex h-full max-w-6xl items-center justify-between px-5 md:px-10">
          <Logo theme={theme} onClick={handleLogoClick} />

          <nav aria-label="Primary navigation" className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 lg:flex">
            {navLinks.map((item) => (
              <a key={item.key} href={getAnchor(item.href)} className="text-[13px] text-(--color-text-secondary) transition-colors duration-300 hover:text-(--color-text-primary)">
                {labels[item.key]}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <LanguageToggle variant="nav" />
            <ThemeToggle label={theme === "dark" ? labels.themeLight : labels.themeDark} />
            <Link to="/contact" className="btn btn-primary btn-sm hidden sm:inline-flex">{labels.contact}</Link>
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label={labels.open}
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-(--color-text-primary) transition-colors duration-300 hover:bg-(--color-surface) lg:hidden"
            >
              <Menu size={18} strokeWidth={1.8} />
            </button>
          </div>
        </div>
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px transition-opacity duration-300" style={{ background: "var(--color-border)", opacity: scrolled ? 1 : 0 }} />
      </header>

      <div aria-hidden="true" className="h-12" />

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-label={labels.navigation}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: smoothEase }}
            className="mobile-menu-panel fixed inset-0 z-150 flex h-dvh flex-col lg:hidden"
            style={{ background: "var(--color-bg)" }}
          >
            <div dir="ltr" className="flex h-12 shrink-0 items-center justify-between px-5 md:px-10">
              <Logo theme={theme} onClick={handleLogoClick} />
              <div className="flex items-center gap-2">
                <LanguageToggle variant="nav" />
                <ThemeToggle label={theme === "dark" ? labels.themeLight : labels.themeDark} />
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  aria-label={labels.close}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-(--color-text-primary) transition-colors duration-300 hover:bg-(--color-surface)"
                >
                  <X size={18} strokeWidth={1.8} />
                </button>
              </div>
            </div>

            <nav dir={isRTL ? "rtl" : "ltr"} aria-label={labels.navigation} className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6 md:px-10">
              <ul className="flex flex-col">
                {navLinks.map((item, index) => (
                  <motion.li key={item.key} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: smoothEase, delay: 0.08 + index * 0.05 }}>
                    <a
                      href={getAnchor(item.href)}
                      onClick={(event) => goTo(event, item.href)}
                      className="block border-b py-4 font-display text-[clamp(1.6rem,7vw,2rem)] font-semibold leading-tight text-(--color-text-primary) transition-colors duration-200 hover:text-(--color-text-secondary)"
                      style={{ borderColor: "var(--color-border)" }}
                    >
                      {labels[item.key]}
                    </a>
                  </motion.li>
                ))}
              </ul>
              <motion.div className="mt-auto pt-8" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: smoothEase, delay: 0.38 }}>
                <Link to="/contact" onClick={() => setMobileOpen(false)} className="btn btn-primary w-full">{labels.contact}</Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Header;

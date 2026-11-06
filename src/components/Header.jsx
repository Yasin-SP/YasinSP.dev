import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { motion } from "motion/react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/Signature.svg";
import { smoothEase } from "../constants/theme.js";
import { useTheme } from "../context/ThemeContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import { useActiveSection } from "../hooks/useActiveSection.js";
import { scrollToTop } from "../lib/scroll.js";
import LanguageToggle from "./LanguageToggle.jsx";

const navLinks = [
  { key: "about", href: "#about", tone: "blue" },
  { key: "services", href: "#services", tone: "purple" },
  { key: "skills", href: "#skills", tone: "teal" },
  { key: "work", href: "#projects", tone: "pink" },
  { key: "approach", href: "#approach", tone: "indigo" },
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
      className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-(--color-text-secondary) transition-colors duration-300 hover:bg-(--color-surface-hover) hover:text-(--color-text-primary)"
    >
      <motion.span key={theme} className="flex" initial={{ rotate: -80, opacity: 0, scale: 0.6 }} animate={{ rotate: 0, opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: smoothEase }}>
        {theme === "dark" ? <Moon size={17} strokeWidth={1.8} /> : <Sun size={17} strokeWidth={1.8} />}
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
  const { language } = useLanguage();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [tucked, setTucked] = useState(false);
  const labels = LABELS[language];
  const isHome = location.pathname === "/";
  const active = useActiveSection(isHome);
  const navRef = useRef(null);
  const [bubble, setBubble] = useState({ x: 0, w: 0, show: false });

  // One bubble that glides between links; measured from the live DOM so it survives language/size changes.
  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav) return undefined;
    const measure = () => {
      const el = nav.querySelector('[aria-current="true"]');
      setBubble((previous) => {
        if (!el) return previous.show ? { ...previous, show: false } : previous;
        const next = { x: el.offsetLeft, w: el.offsetWidth, show: true };
        return previous.x === next.x && previous.w === next.w && previous.show ? previous : next;
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(nav);
    return () => observer.disconnect();
  }, [active, language]);
  const getAnchor = (href) => (isHome ? href : `/${href}`);

  useEffect(() => {
    let last = window.scrollY;
    const update = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      // On phones the top bar slides away while reading and returns on the first upward flick.
      if (Math.abs(y - last) > 6) { setTucked(window.innerWidth < 1024 && y > last && y > 160); last = y; }
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  function handleLogoClick(event) {
    if (isHome) { event.preventDefault(); scrollToTop(); }
  }

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: tucked ? -90 : 0, opacity: 1 }}
        transition={tucked !== undefined && scrolled ? { type: "spring", stiffness: 380, damping: 36 } : { duration: 1, ease: smoothEase, delay: 0.1 }}
        className="fixed inset-x-0 top-3 z-100 flex justify-center px-3 font-sans"
      >
        <div
          dir="ltr"
          className="glass glass-blur flex h-14 w-full max-w-5xl items-center justify-between ps-5 pe-2 transition-[background-color,box-shadow] duration-500"
          style={{ "--r": "999px", "--glass-blur": "32px", backgroundColor: scrolled ? "var(--nav-bg)" : "transparent" }}
        >
          <Logo theme={theme} onClick={handleLogoClick} />

          <nav ref={navRef} aria-label="Primary navigation" className="relative hidden items-center gap-0.5 lg:flex">
            <motion.span
              aria-hidden="true"
              initial={false}
              animate={{ x: bubble.x, width: bubble.w, opacity: bubble.show ? 1 : 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 34 }}
              className="pointer-events-none absolute inset-y-0 left-0 rounded-full"
              style={{ background: "color-mix(in srgb, var(--c-purple) 20%, transparent)", boxShadow: "0 0 0 1px color-mix(in srgb, var(--c-purple) 38%, transparent) inset, 0 1px 0 rgba(255,255,255,0.18) inset" }}
            />
            {navLinks.map((item) => {
              const isActive = active === item.href.slice(1);
              return (
                <a
                  key={item.key}
                  href={getAnchor(item.href)}
                  aria-current={isActive ? "true" : undefined}
                  className={`relative rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors duration-300 ${isActive ? "text-(--color-text-primary)" : "text-(--color-text-secondary) hover:text-(--color-text-primary)"}`}
                >
                  <span className="relative">{labels[item.key]}</span>
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-1.5">
            <LanguageToggle variant="nav" />
            <ThemeToggle label={theme === "dark" ? labels.themeLight : labels.themeDark} />
            <Link to="/contact" className="btn btn-primary btn-sm hidden md:inline-flex">{labels.contact}</Link>
          </div>
        </div>
      </motion.header>

      <div aria-hidden="true" className="h-[4.5rem]" />

    </>
  );
}

export default Header;

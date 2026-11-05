import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ScrollTrigger } from "../lib/gsap.js";
import { initSmoothScroll } from "../lib/scroll.js";
import { useLanguage } from "../context/LanguageContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

/** Mounts Lenis once and keeps ScrollTrigger measurements honest as content reflows. */
export default function SmoothScroll() {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const { pathname } = useLocation();

  useEffect(() => initSmoothScroll(), []);

  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);
    return () => window.removeEventListener("load", refresh);
  }, []);

  // Language / theme / route changes move things around: re-measure after they settle.
  useEffect(() => {
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 500);
    return () => window.clearTimeout(id);
  }, [language, theme, pathname]);

  return null;
}

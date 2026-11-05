import { motion } from "motion/react";
import { Home as HomeIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext.jsx";
import { getUI } from "../i18n.js";

function NotFound() {
  const { language } = useLanguage();
  const copy = getUI(language, "notFound");
  return <main id="main-content" className="standalone-page min-h-[100svh] px-6 py-8" style={{ color: "var(--color-text-primary)" }}>
    <section className="mx-auto flex min-h-[calc(100svh-4rem)] max-w-3xl flex-col items-center justify-center text-center">
      <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="font-sans text-[15px] font-medium text-(--color-text-muted)">{copy.label}</motion.p>
      <motion.h1 initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="mt-4 text-aurora font-display text-[clamp(6rem,22vw,12rem)] font-bold leading-none" dir="ltr">404</motion.h1>
      <p className="mx-auto mt-6 max-w-md font-sans text-[17px] leading-relaxed text-(--color-text-secondary)">{copy.text}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/" className="btn btn-primary"><HomeIcon size={16} /> {copy.home}</Link>
        <Link to="/contact" className="btn btn-secondary">{copy.contact}</Link>
      </div>
    </section>
  </main>;
}
export default NotFound;

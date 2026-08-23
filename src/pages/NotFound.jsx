import { motion } from "motion/react";
import { ArrowLeft, Home as HomeIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext.jsx";
import { getUI } from "../i18n.js";

function NotFound() {
  const { language } = useLanguage();
  const copy = getUI(language, "notFound");
  return <main id="main-content" className="standalone-page min-h-[100svh] px-6 py-8" style={{ background: "var(--color-bg)", color: "var(--color-text-primary)" }}>
    <section className="mx-auto flex min-h-[calc(100svh-4rem)] max-w-3xl flex-col items-center justify-center text-center">
      <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="font-sans text-[10px] uppercase tracking-[0.32em] text-(--color-text-muted)">{copy.label}</motion.p>
      <motion.h1 initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="mt-5 font-display text-[clamp(7rem,22vw,13rem)] font-bold leading-none tracking-[-0.08em]">404</motion.h1>
      <div className="mx-auto mt-7 h-px w-16 bg-(--color-border-strong)" aria-hidden="true" />
      <p className="mx-auto mt-6 max-w-md font-sans text-sm leading-relaxed text-(--color-text-secondary)">{copy.text}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-(--color-text-primary) px-5 text-sm font-medium text-(--color-bg) transition-transform duration-300 hover:-translate-y-0.5"><HomeIcon size={15} /> {copy.home}</Link>
        <Link to="/contact" className="inline-flex min-h-11 items-center gap-2 rounded-full border px-5 text-sm transition-colors duration-300 hover:text-(--color-text-primary)" style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}>{copy.contact} <ArrowLeft size={15} /></Link>
      </div>
    </section>
  </main>;
}
export default NotFound;

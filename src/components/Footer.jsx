import { motion } from "motion/react";
import { ArrowUpRight, Mail } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/Signature.svg";
import { purpleGradient, smoothEase } from "../constants/theme.js";
import GithubIcon from "./icons/GithubIcon.jsx";
import LinkedinIcon from "./icons/LinkedinIcon.jsx";
import TelegramIcon from "./icons/TelegramIcon.jsx";
import { socialLinks } from "../data/socials.js";
import { getUI } from "../i18n.js";
import { useLanguage } from "../context/LanguageContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import LanguageToggle from "./LanguageToggle.jsx";

const iconMap = { github: GithubIcon, linkedin: LinkedinIcon, telegram: TelegramIcon, email: Mail };
const navLinks = [
  { key: "about", href: "#about" },
  { key: "services", href: "#services" },
  { key: "skills", href: "#skills" },
  { key: "work", href: "#projects" },
  { key: "approach", href: "#approach" },
];

function Footer() {
  const { theme } = useTheme();
  const { language, isRTL } = useLanguage();
  const location = useLocation();
  const copy = getUI(language, "footer");
  const navCopy = getUI(language, "nav");
  const year = new Date().getFullYear();
  const getAnchor = (href) => location.pathname === "/" ? href : `/${href}`;
  return <footer className="relative w-full border-t py-16 md:py-20" style={{ borderColor: "var(--color-border)" }}>
    <div dir={isRTL ? "rtl" : "ltr"} className="max-w-7xl mx-auto px-6 md:px-12">
      <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: smoothEase }} className="grid md:grid-cols-[1.4fr_0.6fr_0.6fr] gap-12" style={{ borderColor: "var(--color-border)" }}>
        <div className="max-w-md">
          <img src={logo} alt="Yasin signature" className="h-9 w-auto object-contain mb-6" style={{ transform: "scale(1.55)", transformOrigin: language === "fa" ? "right center" : "left center", filter: theme === "light" ? "invert(1)" : "none" }} />
          <p className="font-display text-2xl md:text-3xl text-(--color-text-primary) leading-tight tracking-tight">{copy.statement}</p>
          <p className="font-sans text-sm text-(--color-text-secondary) leading-relaxed mt-5 max-w-sm">{copy.body}</p>
        </div>
        <div><h4 className="font-sans text-[10px] tracking-[0.2em] uppercase text-(--color-text-muted) mb-5">{copy.explore}</h4><ul className="flex flex-col gap-3">{navLinks.map((link) => <li key={link.key}><a href={getAnchor(link.href)} className="font-sans text-sm text-(--color-text-secondary) hover:text-(--color-text-primary) transition-colors">{navCopy[link.key]}</a></li>)}</ul></div>
        <div><h4 className="font-sans text-[10px] tracking-[0.2em] uppercase text-(--color-text-muted) mb-5">{copy.connect}</h4><ul className="flex flex-col gap-3">{socialLinks.map((social) => { const Icon = iconMap[social.type]; return <li key={social.label}><a href={social.href} target={social.type !== "email" ? "_blank" : undefined} rel={social.type !== "email" ? "noopener noreferrer" : undefined} className={`group inline-flex items-center gap-2 font-sans text-sm text-(--color-text-secondary) hover:text-(--color-text-primary) transition-colors ${isRTL ? "flex-row-reverse" : ""}`}><Icon size={15} className="shrink-0 text-(--color-purple-1) opacity-70 group-hover:opacity-100" />{social.label}<ArrowUpRight size={12} className={`shrink-0 opacity-0 group-hover:opacity-100 transition-all ${isRTL ? "translate-x-1 group-hover:translate-x-0" : "-translate-x-1 group-hover:translate-x-0"}`} /></a></li>; })}</ul></div>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: smoothEase }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-7 mt-7 border-t" style={{ borderColor: "var(--color-border)" }}>
        <div className="flex flex-wrap items-center gap-4"><p className="font-sans text-(--color-text-muted) text-xs">© {year} Yasin. {copy.rights}</p><Link to="/privacy" className="font-sans text-xs text-(--color-text-muted) transition-colors hover:text-(--color-text-primary)">{copy.privacy}</Link><LanguageToggle variant="footer" /></div>
        <p className="font-sans text-xs" style={{ backgroundImage: purpleGradient, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>{copy.built}</p>
      </motion.div>
    </div>
  </footer>;
}
export default Footer;

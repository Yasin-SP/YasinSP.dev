import { Link, useLocation } from "react-router-dom";
import { Mail } from "lucide-react";
import logo from "../assets/Signature.svg";
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

const linkClass = "font-sans text-sm text-(--color-text-secondary) transition-colors duration-300 hover:text-(--color-text-primary)";

function Footer() {
  const { theme } = useTheme();
  const { language, isRTL } = useLanguage();
  const location = useLocation();
  const copy = getUI(language, "footer");
  const navCopy = getUI(language, "nav");
  const year = new Date().getFullYear();
  const getAnchor = (href) => (location.pathname === "/" ? href : `/${href}`);

  return (
    <footer className="band-alt relative w-full pb-10 pt-16 md:pt-20">
      <div dir={isRTL ? "rtl" : "ltr"} className="mx-auto w-full max-w-6xl px-6 text-start md:px-10">
        <div className="grid gap-12 md:grid-cols-[1.6fr_0.7fr_0.7fr]">
          <div className="max-w-md">
            <div dir="ltr" className="mb-6 h-8 w-24">
              <img src={logo} alt="" className="h-full w-full object-contain" style={{ transform: "scale(1.5)", filter: theme === "light" ? "invert(1)" : "none" }} />
            </div>
            <p className="font-display text-2xl font-semibold leading-snug tracking-tight text-(--color-text-primary)">{copy.statement}</p>
            <p className="mt-4 font-sans text-sm leading-relaxed text-(--color-text-secondary)">{copy.body}</p>
          </div>

          <nav aria-label={copy.explore}>
            <h4 className="font-sans text-xs font-semibold text-(--color-text-primary)">{copy.explore}</h4>
            <ul className="mt-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <li key={link.key}><a href={getAnchor(link.href)} className={linkClass}>{navCopy[link.key]}</a></li>
              ))}
            </ul>
          </nav>

          <div>
            <h4 className="font-sans text-xs font-semibold text-(--color-text-primary)">{copy.connect}</h4>
            <ul className="mt-4 flex flex-col gap-3">
              {socialLinks.map((social) => {
                const Icon = iconMap[social.type];
                const external = social.type !== "email";
                return (
                  <li key={social.label}>
                    <a href={social.href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} className={`${linkClass} inline-flex items-center gap-2`}>
                      <Icon size={15} className="shrink-0" />
                      {social.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="hairline-t mt-14 flex flex-col items-start justify-between gap-4 pt-6 sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-sans text-xs text-(--color-text-muted)">
            <p>© {year} Yasin. {copy.rights}</p>
            <Link to="/privacy" className="transition-colors duration-300 hover:text-(--color-text-primary)">{copy.privacy}</Link>
          </div>
          <div className="flex items-center gap-5">
            <p className="font-sans text-xs text-(--color-text-muted)">{copy.built}</p>
            <LanguageToggle variant="footer" />
          </div>
        </div>
      </div>
    </footer>
  );
}
export default Footer;

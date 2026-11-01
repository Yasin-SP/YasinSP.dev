import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ChevronRight, GraduationCap, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { smoothEase } from "../constants/theme.js";
import photoDark from "../assets/yasin-dark.webp";
import photoLight from "../assets/yasin-light.webp";
import { useTheme } from "../context/ThemeContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import { getUI } from "../i18n.js";

// The portraits have a flat black / near-white backdrop, so a soft vignette is
// enough to let them melt into the page without a frame or a glow.
const PORTRAIT_MASK = "radial-gradient(ellipse 56% 78% at 50% 42%, #000 62%, transparent 100%), linear-gradient(to bottom, #000 68%, transparent 100%)";

function reveal(delay) {
  return {
    initial: { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, ease: smoothEase, delay },
  };
}

function Hero() {
  const { language, isRTL } = useLanguage();
  const { theme } = useTheme();
  const copy = getUI(language, "hero");
  const photo = theme === "light" ? photoLight : photoDark;
  const portraitAlt = isRTL ? "پرتره یاسین سلیمان پناه" : "Portrait of Yasin SoleymanPanah";
  const reduceMotion = useReducedMotion();

  const stageRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: stageRef, offset: ["start end", "end start"] });
  const drift = useTransform(scrollYProgress, [0, 1], [28, -28]);

  const name = [copy.name, copy.nameSuffix].filter(Boolean).join(" ");
  const roles = copy.eyebrow.split("·").map((part) => part.trim()).filter(Boolean);

  return (
    <section className="relative w-full overflow-hidden">
      <div
        dir={isRTL ? "rtl" : "ltr"}
        className="mx-auto grid w-full max-w-6xl items-center gap-12 px-6 pb-20 pt-10 md:px-10 lg:min-h-[calc(100svh-3rem)] lg:grid-cols-[1.05fr_0.95fr] lg:gap-6 lg:py-12"
      >
        <div className="text-center lg:text-start">
          <motion.div {...reveal(0)} className="mx-auto mb-7 h-28 w-28 overflow-hidden rounded-full ring-1 ring-(--color-border) lg:hidden">
            <img src={photo} alt={portraitAlt} className="h-full w-full scale-110 object-cover object-top" />
          </motion.div>

          <motion.ul {...reveal(0.05)} aria-label={roles.join(", ")} className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 font-sans text-[15px] font-medium text-(--color-text-secondary) md:text-[17px] lg:justify-start">
            {roles.map((role, index) => (
              <li key={role} className="inline-flex items-center gap-3">
                {index > 0 && <span aria-hidden="true" className="hidden text-(--color-text-muted) sm:inline">·</span>}
                {role}
              </li>
            ))}
          </motion.ul>

          <motion.h1 {...reveal(0.12)} className="display-type mt-4 text-[clamp(2.6rem,11.5vw,4.5rem)] lg:text-[clamp(3rem,5.2vw,4.75rem)]">
            <span className="block text-(--color-text-muted)">{copy.title}</span>
            <span className="block text-(--color-text-primary)">{name}</span>
          </motion.h1>

          <motion.p {...reveal(0.2)} className="mx-auto mt-7 max-w-xl font-sans text-[19px] leading-snug text-(--color-text-primary) md:text-[22px] lg:mx-0">
            {copy.lead}
          </motion.p>
          <motion.p {...reveal(0.26)} className="mx-auto mt-4 max-w-xl font-sans text-base leading-relaxed text-(--color-text-secondary) md:text-[17px] lg:mx-0">
            {copy.body}
          </motion.p>

          <motion.div {...reveal(0.32)} className="mt-9 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-7 lg:justify-start">
            <Link to="/contact" className="btn btn-primary w-full sm:w-auto">{copy.start}</Link>
            <a href="#projects" className="link-cta">
              {copy.work}
              <ChevronRight size={18} strokeWidth={2} className="rtl:rotate-180" aria-hidden="true" />
            </a>
          </motion.div>

          <motion.ul {...reveal(0.4)} className="mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-sans text-sm text-(--color-text-muted) lg:justify-start">
            <li className="inline-flex items-center gap-2"><MapPin size={14} strokeWidth={1.8} aria-hidden="true" />{copy.location}</li>
            <li className="inline-flex items-center gap-2"><GraduationCap size={15} strokeWidth={1.8} aria-hidden="true" />{copy.degree}</li>
          </motion.ul>
        </div>

        <div ref={stageRef} className="hidden lg:block">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, ease: smoothEase, delay: 0.15 }}
            style={{ y: reduceMotion ? 0 : drift }}
            className="mx-auto aspect-4/5 w-full max-w-125"
          >
            <img src={photo} alt={portraitAlt} className="h-full w-full object-cover object-top" style={{ WebkitMaskImage: PORTRAIT_MASK, maskImage: PORTRAIT_MASK, WebkitMaskComposite: "source-in", maskComposite: "intersect", mixBlendMode: theme === "light" ? "multiply" : "normal" }} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Hero;

import { motion } from "motion/react";
import { ArrowDown, ArrowUpRight, Code2, GraduationCap, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { purpleGradient, smoothEase } from "../constants/theme.js";
import photoDark from "../assets/yasin-dark.webp";
import photoLight from "../assets/yasin-light.webp";
import { useTheme } from "../context/ThemeContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import { getUI } from "../i18n.js";
import LanguageToggle from "./LanguageToggle.jsx";
import TypewriterTitle from "./TypewriterTitle.jsx";

function InfoRow({ infoItems }) {
  return <motion.div dir="ltr" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.35, ease: smoothEase }} className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 font-sans md:mt-7">
    {infoItems.map((item, i) => <div key={item.label} className="flex items-center gap-3"><span className="flex items-center gap-1.5"><item.icon size={13} strokeWidth={1.8} className="text-(--color-purple-1)" /><span className="text-[11px] text-(--color-text-secondary) md:text-sm">{item.label}</span></span>{i < infoItems.length - 1 && <span className="h-1 w-1 rounded-full bg-(--color-text-muted)" />}</div>)}
  </motion.div>;
}

function MobilePortrait() {
  const { theme } = useTheme();
  const photo = theme === "light" ? photoLight : photoDark;
  return <motion.div initial={{ opacity: 0, scale: 0.88, y: 14 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.75, ease: smoothEase, delay: 0.12 }} className="relative mx-auto mb-7 h-37 w-37 sm:h-43 sm:w-43" aria-hidden="true">
    <motion.div className="absolute -inset-5 rounded-full blur-2xl" style={{ background: "radial-gradient(circle, rgba(168,85,247,.32), transparent 68%)" }} animate={{ opacity: [0.45, 0.8, 0.45], scale: [0.92, 1.05, 0.92] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} />
    <motion.div className="absolute -inset-1 rounded-full p-1.25" style={{ backgroundImage: purpleGradient, backgroundSize: "240% 240%" }} animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
      <div className="h-full w-full overflow-hidden rounded-full border-2 border-black bg-black"><img src={photo} alt="" className="h-full w-full object-cover object-top" style={{ WebkitMaskImage: "radial-gradient(ellipse 82% 84% at 50% 42%, black 62%, transparent 100%)", maskImage: "radial-gradient(ellipse 82% 84% at 50% 42%, black 62%, transparent 100%)" }} /></div>
    </motion.div>
  </motion.div>;
}

function Hero() {
  const { language, isRTL } = useLanguage();
  const copy = getUI(language, "hero");
  const infoItems = [
    { icon: Code2, label: copy.frontend },
    { icon: GraduationCap, label: copy.degree },
    { icon: MapPin, label: copy.location },
  ];
  return <section className="relative w-full overflow-hidden lg:min-h-[calc(100vh-6.25rem)]">
    <div className="absolute left-6 top-4 z-30 sm:left-8 md:left-12 md:top-6" aria-label="Language selection">
      <LanguageToggle variant="hero" />
    </div>
    <div className="relative z-10 mx-auto flex min-h-[calc(100svh-5rem)] w-full max-w-7xl items-center px-6 pb-16 pt-28 sm:px-8 md:min-h-[calc(100vh-6.25rem)] md:px-12 md:py-16 lg:items-center">
      <div dir={isRTL ? "rtl" : "ltr"} className={`w-full max-w-5xl lg:max-w-[56%] ${isRTL ? "text-right" : "text-left"}`}>
        <div className="lg:hidden"><MobilePortrait /></div>
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: smoothEase }} className="font-sans text-[10px] uppercase tracking-[0.21em] text-(--color-text-muted) sm:text-xs md:text-sm md:tracking-[0.24em]">{copy.eyebrow}</motion.p>
        <TypewriterTitle
          title={copy.title}
          highlight={copy.name}
          suffix={copy.nameSuffix}
          isRTL={isRTL}
          className="mt-4 max-w-full font-display text-[clamp(3.2rem,10vw,7.5rem)] font-bold leading-[0.9] tracking-[-0.055em] text-(--color-text-primary) md:mt-5"
        />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, ease: smoothEase, delay: 0.2 }} className="mt-6 max-w-3xl md:mt-9">
          <p className="font-display text-[1.22rem] leading-tight text-(--color-text-primary) sm:text-2xl md:text-3xl md:leading-snug">{copy.lead.includes("modern interfaces") ? <>I build <span className="text-(--color-purple-1)">modern interfaces</span> where clean engineering meets thoughtful visual detail.</> : copy.lead}</p>
          <p className="mt-3 max-w-2xl font-sans text-[13px] leading-relaxed text-(--color-text-secondary) sm:text-sm md:mt-4 md:text-base">{copy.body}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: smoothEase, delay: 0.3 }} dir="ltr" className="mt-7 flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row sm:items-center sm:gap-3 md:mt-8">
          <Link to="/contact" className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-purple-400/30 px-5 py-3 text-sm font-medium text-white transition-transform duration-300 hover:-translate-y-0.5 sm:w-auto" style={{ backgroundImage: purpleGradient, backgroundSize: "200% 200%" }}>{copy.start}<ArrowUpRight className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform duration-300" size={15} /></Link>
          <a href="#projects" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border px-5 py-3 text-sm font-medium text-(--color-text-secondary) transition-colors duration-300 hover:text-(--color-text-primary) sm:w-auto" style={{ borderColor: "var(--color-border)" }}>{copy.work}</a>
        </motion.div>
        <InfoRow infoItems={infoItems} />
      </div>
    </div>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2, delay: 0.6 }} className="absolute bottom-8 right-6 hidden items-center gap-3 text-(--color-text-muted) md:flex md:right-12"><span className="font-sans text-[10px] uppercase tracking-[0.25em]">{copy.scroll}</span><ArrowDown size={14} className="animate-bounce" /></motion.div>
  </section>;
}
export default Hero;

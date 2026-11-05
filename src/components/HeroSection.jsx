import { useEffect, useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { Atom, ChevronRight, GraduationCap, Layers, MapPin, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import photoDark from "../assets/yasin-dark.webp";
import photoLight from "../assets/yasin-light.webp";
import avatarLight from "../assets/yasin-light-avatar.webp";
import { useTheme } from "../context/ThemeContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import { getUI } from "../i18n.js";
import { MOTION, NO_PREFERENCE, gsap, useGSAP } from "../lib/gsap.js";
import Magnetic from "./Magnetic.jsx";
import WordReveal from "./WordReveal.jsx";

/** A glass badge beside the portrait: the pointer moves it (motion), GSAP brings it in, CSS makes it float. */
function FloatingChip({ icon: Icon, label, tone, depth, mx, my, floatDuration, floatDelay, className }) {
  const x = useTransform(mx, (v) => v * depth);
  const y = useTransform(my, (v) => v * depth);
  return (
    <motion.div style={{ x, y }} className={`absolute z-30 ${className}`}>
      <div data-chip>
        <div className={`glass tone-${tone} float-y flex items-center gap-2.5 py-2 ps-2 pe-4`} style={{ "--r": "999px", "--float-duration": `${floatDuration}s`, "--float-delay": `${floatDelay}s` }}>
          <span className="tone-icon h-8 w-8 rounded-[0.65rem]"><Icon size={16} strokeWidth={2} /></span>
          <span className="font-sans text-[13px] font-semibold text-(--color-text-primary)">{label}</span>
        </div>
      </div>
    </motion.div>
  );
}

function Hero() {
  const { language, isRTL } = useLanguage();
  const { theme } = useTheme();
  const copy = getUI(language, "hero");
  const contactCopy = getUI(language, "contact");
  const isLight = theme === "light";
  const photo = isLight ? photoLight : photoDark;
  const avatar = avatarLight;
  const portraitAlt = isRTL ? "پرتره یاسین سلیمان پناه" : "Portrait of Yasin SoleymanPanah";
  const reduce = useReducedMotion();
  const roles = copy.eyebrow.split("·").map((part) => part.trim()).filter(Boolean);
  const sectionRef = useRef(null);

  // One timeline for the whole entrance, then scrubbed parallax as the hero leaves.
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(NO_PREFERENCE, () => {
      const tl = gsap.timeline({ defaults: { ease: MOTION.ease, duration: MOTION.duration } });
      tl.from("[data-hero]", { autoAlpha: 0, y: 30, filter: "blur(8px)", stagger: MOTION.stagger, clearProps: "transform,filter,opacity,visibility" }, 0.1)
        .from("[data-stage]", { autoAlpha: 0, y: 40, scale: 0.95, duration: 1.3, clearProps: "transform,opacity,visibility" }, 0.2)
        .from("[data-chip]", { autoAlpha: 0, scale: 0.6, ease: "back.out(1.7)", stagger: 0.14, clearProps: "transform,opacity,visibility" }, 1);

      const leave = { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: MOTION.scrub };
      gsap.to("[data-text]", { y: -70, ease: "none", scrollTrigger: leave });
      gsap.to("[data-parallax]", { y: 90, ease: "none", modifiers: { y: (v) => `${Math.round(parseFloat(v))}px` }, scrollTrigger: leave });
    });
    return () => mm.revert();
  }, { scope: sectionRef });

  // Pointer position in [-0.5, 0.5] across the hero, smoothed with a spring.
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mx = useSpring(rawX, { stiffness: 90, damping: 18, mass: 0.6 });
  const my = useSpring(rawY, { stiffness: 90, damping: 18, mass: 0.6 });
  const chipX = useTransform(mx, (v) => v * 90);
  const chipY = useTransform(my, (v) => v * 90);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || reduce || !window.matchMedia("(pointer: fine)").matches) return undefined;
    // Only react while the pointer is over the portrait or within a margin around it.
    const NEAR = 110;
    const move = (event) => {
      const stage = el.querySelector("[data-stage]");
      if (!stage) return;
      const r = stage.getBoundingClientRect();
      const inside = event.clientX > r.left - NEAR && event.clientX < r.right + NEAR && event.clientY > r.top - NEAR && event.clientY < r.bottom + NEAR;
      if (!inside) { rawX.set(0); rawY.set(0); return; }
      rawX.set((event.clientX - (r.left + r.width / 2)) / (r.width + NEAR * 2));
      rawY.set((event.clientY - (r.top + r.height / 2)) / (r.height + NEAR * 2));
    };
    const leave = () => { rawX.set(0); rawY.set(0); };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); };
  }, [reduce, rawX, rawY]);

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden">
      <div
        dir={isRTL ? "rtl" : "ltr"}
        className="mx-auto grid w-full max-w-6xl items-center gap-10 px-6 pb-24 pt-6 md:px-10 lg:min-h-[calc(100svh-4.5rem)] lg:grid-cols-[1.05fr_0.95fr] lg:gap-4 lg:pb-16 lg:pt-4"
      >
        <div data-text className="relative z-10 text-center lg:text-start">
          {/* Mobile portrait: avatar inside a spinning purple ring */}
          <div data-hero className="mx-auto mb-8 h-32 w-32 lg:hidden">
            <div className="ring-border h-full w-full" style={{ "--r": "999px" }}>
              <img src={avatar} alt={portraitAlt} className="h-full w-full scale-110 rounded-full object-cover object-top" />
            </div>
          </div>

          <div data-hero className="flex justify-center lg:justify-start">
            <span className="pill text-(--color-text-primary)">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inset-0 rounded-full bg-(--c-green)" style={{ animation: "ping-dot 1.8s cubic-bezier(0, 0, 0.2, 1) infinite" }} />
                <span className="relative h-2 w-2 rounded-full bg-(--c-green)" />
              </span>
              {contactCopy.open}
            </span>
          </div>

          <h1 className="display-type mt-7 text-[clamp(2.7rem,12vw,4.6rem)] text-(--color-text-primary) lg:text-[clamp(3.2rem,5.4vw,5.2rem)]">
            <WordReveal as="span" inView={false} text={copy.title} delay={0.3} className="block text-(--color-text-secondary)" />
            <span className="block">
              <WordReveal as="span" inView={false} text={copy.name} delay={0.6} wordClassName="text-aurora" />
              {copy.nameSuffix ? <>{" "}<WordReveal as="span" inView={false} text={copy.nameSuffix} delay={0.8} /></> : null}
            </span>
          </h1>

          <p data-hero className="mx-auto mt-7 max-w-xl font-sans text-[19px] leading-snug text-(--color-text-primary) md:text-[22px] lg:mx-0">{copy.lead}</p>
          <p data-hero className="mx-auto mt-4 max-w-xl font-sans text-base leading-relaxed text-(--color-text-secondary) md:text-[17px] lg:mx-0">{copy.body}</p>

          <div data-hero className="mt-9 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-6 lg:justify-start">
            <Magnetic className="w-full sm:w-auto">
              <Link to="/contact" className="btn btn-primary w-full sm:w-auto">{copy.start}</Link>
            </Magnetic>
            <a href="#projects" className="btn btn-secondary w-full sm:w-auto">
              {copy.work}
              <ChevronRight size={17} strokeWidth={2} className="rtl:rotate-180" aria-hidden="true" />
            </a>
          </div>

          <ul data-hero className="mt-9 flex flex-wrap items-center justify-center gap-2.5 lg:justify-start" aria-label={roles.join(", ")}>
            {roles.map((role) => <li key={role} className="pill text-(--color-text-secondary)">{role}</li>)}
          </ul>
        </div>

        {/* Desktop stage: a crisp framed portrait on a soft purple halo, chips orbiting in depth */}
        <div data-parallax className="relative hidden lg:block">
          <div data-stage className="relative mx-auto aspect-4/5 w-full max-w-100">
            <span aria-hidden="true" className="absolute inset-0 translate-x-4 translate-y-4 rounded-[2.25rem] border" style={{ borderColor: "color-mix(in srgb, var(--c-purple) 45%, transparent)" }} />
            <div className="relative h-full w-full overflow-hidden rounded-[2.25rem]" style={{ backgroundColor: "var(--color-bg)", boxShadow: "0 0 0 1px var(--color-border-strong), 0 40px 80px -40px rgba(0,0,0,0.6)" }}>
              <img src={photo} alt={portraitAlt} width={1124} height={1399} decoding="async" fetchPriority="high" className="h-full w-full object-cover object-top" />
                          </div>
            <FloatingChip icon={Atom} label="React" tone="blue" depth={1.0} mx={chipX} my={chipY} floatDuration={6} floatDelay={0} className="start-[-9%] top-[14%]" />
            <FloatingChip icon={Layers} label="Frontend" tone="purple" depth={-0.7} mx={chipX} my={chipY} floatDuration={7.5} floatDelay={0.8} className="end-[-10%] top-[34%]" />
            <FloatingChip icon={Sparkles} label="UI / Motion" tone="pink" depth={1.3} mx={chipX} my={chipY} floatDuration={6.8} floatDelay={1.6} className="start-[-12%] bottom-[24%]" />
            <FloatingChip icon={MapPin} label={copy.location} tone="teal" depth={-1.0} mx={chipX} my={chipY} floatDuration={8} floatDelay={0.4} className="end-[-4%] bottom-[8%]" />
          </div>
        </div>
      </div>

      {/* Mobile degree line */}
      <p data-hero className="mx-auto -mt-12 mb-14 flex items-center justify-center gap-2 px-6 font-sans text-sm text-(--color-text-muted) lg:hidden">
        <GraduationCap size={15} strokeWidth={1.8} aria-hidden="true" />{copy.degree}
        <span aria-hidden="true">·</span>
        <MapPin size={14} strokeWidth={1.8} aria-hidden="true" />{copy.location}
      </p>

      {/* Scroll cue */}
      <div data-hero className="pointer-events-none absolute inset-x-0 bottom-6 hidden justify-center lg:flex" aria-hidden="true">
        <div className="glass flex h-11 w-7 items-start justify-center pt-2" style={{ "--r": "999px" }}>
          <span className="block h-2 w-1 rounded-full bg-(--color-text-secondary)" style={{ animation: "scroll-nudge 2s ease-in-out infinite" }} />
        </div>
      </div>
    </section>
  );
}

export default Hero;

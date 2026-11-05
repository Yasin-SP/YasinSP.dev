import { useEffect, useRef } from "react";
import { motion, useDragControls } from "motion/react";
import { useMediaQuery } from "../hooks/useMediaQuery.js";
import { ExternalLink, X } from "lucide-react";
import { smoothEase } from "../constants/theme.js";
import ProjectImageCarousel from "./ProjectImageCarousel.jsx";
import GithubIcon from "./icons/GithubIcon.jsx";
import { getUI } from "../i18n.js";
import { startScroll, stopScroll } from "../lib/scroll.js";
import { localize, useLanguage } from "../context/LanguageContext.jsx";

function ProjectModal({ project, index, onClose }) {
  const closeButtonRef = useRef(null);
  const isPhone = useMediaQuery("(max-width: 639px)");
  const dragControls = useDragControls();
  const { language } = useLanguage();
  const copy = getUI(language, "projects");
  const item = localize(project, language);
  const cardLayoutId = "project-card-" + project.id;
  const imageLayoutId = "project-image-" + project.id;

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousActiveElement = document.activeElement;
    document.body.style.overflow = "hidden";
    stopScroll();

    const frame = requestAnimationFrame(() => closeButtonRef.current?.focus());

    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
      startScroll();
      if (previousActiveElement instanceof HTMLElement) previousActiveElement.focus();
    };
  }, []);

  useEffect(() => {
    function handleKey(event) {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const modal = document.querySelector("[data-project-modal]");
      if (!modal) return;
      const focusable = modal.querySelectorAll('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])');
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const hasFeatures = project.features?.length > 0;

  return (
    <div
      className="fixed inset-0 z-200 flex items-end justify-center sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
      dir="ltr"
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
        className="fixed inset-0"
        style={{ backgroundColor: "var(--scrim)", backdropFilter: "blur(18px) saturate(140%)", WebkitBackdropFilter: "blur(18px) saturate(140%)" }}
      />

      <motion.div
        layoutId={isPhone ? undefined : cardLayoutId}
        initial={isPhone ? { y: "100%" } : undefined}
        animate={isPhone ? { y: 0 } : undefined}
        exit={isPhone ? { y: "100%", transition: { duration: 0.32, ease: smoothEase } } : undefined}
        transition={isPhone ? { type: "spring", stiffness: 340, damping: 38, mass: 0.9 } : { type: "spring", stiffness: 210, damping: 28, mass: 0.9 }}
        drag={isPhone ? "y" : false}
        dragControls={dragControls}
        dragListener={false}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.6 }}
        onDragEnd={(_, info) => { if (info.offset.y > 120 || info.velocity.y > 520) onClose(); }}
        data-project-modal
        data-lenis-prevent
        className="modal-scroll glass tone-purple relative max-h-[92dvh] w-full overflow-hidden overflow-y-auto overscroll-contain sm:max-h-[88vh] sm:max-w-3xl"
        style={{ "--r": isPhone ? "1.9rem 1.9rem 0 0" : "2rem", "--glass-blur": "48px", backgroundColor: "var(--glass-solid)", boxShadow: "0 40px 100px rgba(0,0,0,0.45)" }}
      >
        {isPhone && (
          <div
            onPointerDown={(e) => dragControls.start(e)}
            className="absolute inset-x-0 top-0 z-20 flex h-9 cursor-grab touch-none items-start justify-center pt-2.5"
            aria-hidden="true"
          >
            <span className="h-1.5 w-10 rounded-full" style={{ background: "rgba(255,255,255,0.7)", boxShadow: "0 1px 4px rgba(0,0,0,0.4)" }} />
          </div>
        )}
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label={language === "fa" ? "بستن جزئیات پروژه" : "Close project details"}
          className="absolute right-3 top-3 z-30 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-white transition-colors duration-300 hover:bg-black/70"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}
        >
          <X size={16} strokeWidth={2} />
        </button>

        <motion.div layoutId={isPhone ? undefined : imageLayoutId} className="relative aspect-video w-full">
          <ProjectImageCarousel images={project.images} title={item.title} index={index} showControls interval={4000} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: smoothEase, delay: 0.16 }}
          className={`p-6 pb-10 sm:p-8 md:p-10 ${language === "fa" ? "text-right" : "text-left"}`}
        >
          <div className="flex flex-wrap items-center gap-3 font-sans text-sm text-(--color-text-muted)">
            <span>{item.category}</span>
            <span aria-hidden="true" className="h-1 w-1 rounded-full" style={{ background: "var(--tone)" }} />
            <span>{item.year}</span>
          </div>

          <h2 id="project-modal-title" className="mt-3 font-display text-3xl font-bold leading-tight text-(--color-text-primary) md:text-4xl">
            {item.title}
          </h2>

          <div className="mt-8 grid gap-8 md:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="font-sans text-sm font-medium text-(--color-text-muted)">{copy.projectBrief}</p>
              <p className="mt-3 font-sans text-base leading-relaxed text-(--color-text-secondary)">{item.fullDescription}</p>
            </div>
            <div>
              <p className="font-sans text-sm font-medium text-(--color-text-muted)">{copy.builtWith}</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <li key={tech} className="rounded-full px-3 py-1.5 font-sans text-[13px] text-(--color-text-primary)" style={{ background: "color-mix(in srgb, var(--tone) 16%, transparent)", boxShadow: "0 0 0 1px color-mix(in srgb, var(--tone) 32%, transparent) inset" }}>
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {hasFeatures && (
            <div className="hairline-t mt-9 pt-8">
              <h3 className="font-display text-lg font-semibold text-(--color-text-primary)">{copy.features}</h3>
              <ul className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                {item.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 font-sans text-[15px] leading-relaxed text-(--color-text-secondary)">
                    <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "var(--tone)" }} />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {project.challenges && (
            <div className="hairline-t mt-9 pt-8">
              <p className="font-sans text-sm font-medium text-(--color-text-muted)">{copy.notes}</p>
              <p className="mt-3 font-sans text-base leading-relaxed text-(--color-text-secondary)">{item.challenges}</p>
            </div>
          )}

          <div dir="ltr" className="hairline-t mt-9 flex flex-wrap gap-3 pt-8">
            {project.demo && (
              <a href={project.demo} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                <ExternalLink size={16} /> {copy.demo}
              </a>
            )}
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                <GithubIcon size={16} /> Code
              </a>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default ProjectModal;

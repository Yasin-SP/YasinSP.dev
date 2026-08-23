import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { ExternalLink, X } from "lucide-react";
import { purpleGradient, smoothEase } from "../constants/theme.js";
import ProjectImageCarousel from "./ProjectImageCarousel.jsx";
import GithubIcon from "./icons/GithubIcon.jsx";
import { stopGlobalScroll, startGlobalScroll } from "../lib/lenisInstance.js";
import { getUI } from "../i18n.js";
import { localize, useLanguage } from "../context/LanguageContext.jsx";

function ProjectModal({ project, index, onClose }) {
  const closeButtonRef = useRef(null);
  const { language } = useLanguage();
  const copy = getUI(language, "projects");
  const item = localize(project, language);
  const cardLayoutId = "project-card-" + project.id;
  const imageLayoutId = "project-image-" + project.id;

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousActiveElement = document.activeElement;
    document.body.style.overflow = "hidden";
    stopGlobalScroll();

    const frame = requestAnimationFrame(() => closeButtonRef.current?.focus());

    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
      startGlobalScroll();
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
      className="fixed inset-0 z-[200] flex items-center justify-center p-3 md:p-6"
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
        className="fixed inset-0 backdrop-blur-sm"
        style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
      />

      <motion.div
        layoutId={cardLayoutId}
        transition={{ duration: 0.5, ease: smoothEase }}
        data-project-modal
        className="modal-scroll relative w-full max-w-3xl rounded-2xl md:rounded-3xl overflow-hidden overflow-y-auto overscroll-contain max-h-[88vh]"
        style={{
          backgroundColor: "var(--color-bg-elevated)",
          border: "1px solid var(--color-border)",
        }}
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label={language === "fa" ? "بستن جزئیات پروژه" : "Close project details"}
          className="absolute top-3 right-3 z-20 flex items-center justify-center w-9 h-9 rounded-full backdrop-blur-md transition-colors duration-300"
          style={{
            backgroundColor: "var(--color-surface-hover)",
            border: "1px solid var(--color-border)",
            color: "var(--color-text-primary)",
          }}
        >
          <X size={16} />
        </button>

        <motion.div layoutId={imageLayoutId} className="relative w-full aspect-video">
          <ProjectImageCarousel
            images={project.images}
            title={item.title}
            index={index}
            showControls
            interval={4000}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent pointer-events-none" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: smoothEase, delay: 0.16 }}
          className={`p-5 sm:p-7 md:p-10 ${language === "fa" ? "text-right" : "text-left"}`}
        >
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-sans text-xs tracking-[0.16em] uppercase text-[var(--color-purple-1)]">{item.category}</span>
            <span className="w-1 h-1 rounded-full bg-[var(--color-text-muted)]" />
            <span className="font-sans text-xs text-[var(--color-text-muted)]">{item.year}</span>
          </div>

          <h2 id="project-modal-title" className="font-display text-[var(--color-text-primary)] text-3xl md:text-4xl font-bold mt-3 tracking-tight">
            {item.title}
          </h2>

          <div className="grid md:grid-cols-[1.2fr_0.8fr] gap-8 mt-8">
            <div>
              <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-[var(--color-text-muted)]">{copy.projectBrief}</span>
              <p className="font-sans text-[var(--color-text-secondary)] text-sm md:text-base leading-relaxed mt-3">{item.fullDescription}</p>
            </div>
            <div>
              <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-[var(--color-text-muted)]">{copy.builtWith}</span>
              <div className="flex flex-wrap gap-2 mt-3">
                {project.stack.map((tech) => (
                  <span
                    key={tech}
                    className="font-sans text-xs font-medium px-3 py-1.5 rounded-full"
                    style={{
                      backgroundColor: "var(--color-accent-surface)",
                      border: "1px solid var(--color-accent-border)",
                      color: "var(--color-purple-1)",
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {hasFeatures && (
            <div className="mt-9 pt-8 border-t" style={{ borderColor: "var(--color-border)" }}>
              <h3 className="font-display text-[var(--color-text-primary)] text-lg font-semibold">{copy.features}</h3>
              <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3 mt-4">
                {item.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 font-sans text-sm leading-relaxed text-[var(--color-text-secondary)]">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundImage: purpleGradient }} />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {project.challenges && (
            <div className="mt-9 pt-8 border-t" style={{ borderColor: "var(--color-border)" }}>
              <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-[var(--color-text-muted)]">{copy.notes}</span>
              <p className="font-sans text-[var(--color-text-secondary)] text-sm md:text-base leading-relaxed mt-3">{item.challenges}</p>
            </div>
          )}

          <div className="flex flex-wrap gap-3 mt-9 pt-8 border-t" style={{ borderColor: "var(--color-border)" }}>
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-colors duration-300" style={{ border: "1px solid var(--color-border-strong)", color: "var(--color-text-primary)" }}>
                <GithubIcon size={16} /> Code
              </a>
            )}
            {project.demo && (
              <a href={project.demo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-sm font-medium border border-purple-400/30" style={{ backgroundImage: purpleGradient }}>
                <ExternalLink size={16} /> {copy.demo}
              </a>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default ProjectModal;

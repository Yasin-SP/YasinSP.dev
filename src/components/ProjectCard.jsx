import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { usePointerGlow } from "../hooks/usePointerGlow.js";
import { localize, useLanguage } from "../context/LanguageContext.jsx";
import { getUI } from "../i18n.js";
import ProjectImageCarousel from "./ProjectImageCarousel.jsx";
import Reveal from "./Reveal.jsx";

const cardTones = ["blue", "purple", "pink", "orange", "teal", "indigo"];

/** Glass project tile: image zooms, a coloured sheen follows the pointer, an arrow button slides in. */
function ProjectCard({ project, index, onOpen }) {
  const { language } = useLanguage();
  const copy = getUI(language, "projects");
  const item = localize(project, language);
  const tone = cardTones[index % cardTones.length];
  const { ref, onPointerMove } = usePointerGlow();

  function handleKeyDown(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onOpen(project);
    }
  }

  return (
    <Reveal className="h-full" delay={(index % 3) * 0.09}>
    <motion.article
      ref={ref}
      layoutId={"project-card-" + project.id}
      onPointerMove={onPointerMove}
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.985 }}
      role="button"
      tabIndex={0}
      onClick={() => onOpen(project)}
      onKeyDown={handleKeyDown}
      aria-label={`${copy.open}: ${item.title}`}
      className={`glass tone-${tone} group h-full cursor-pointer overflow-hidden text-start outline-none focus-visible:ring-2 focus-visible:ring-accent-fill`}
      style={{ "--r": "1.75rem" }}
    >
      <motion.div layoutId={"project-image-" + project.id} className="relative aspect-16/10 overflow-hidden">
        <div className="h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.28,0.11,0.32,1)] group-hover:scale-[1.07]">
          <ProjectImageCarousel images={project.images} title={item.title} index={index} />
        </div>
        <span aria-hidden="true" className="absolute end-4 top-4 flex h-10 w-10 translate-y-1 scale-75 items-center justify-center rounded-full text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100" style={{ background: "var(--btn-fill)" }}>
          <ArrowUpRight size={18} strokeWidth={2.2} className="rtl:-scale-x-100" />
        </span>
      </motion.div>
      <div className="relative p-6 md:p-7">
        <div className="flex items-center justify-between gap-3 font-sans text-[13px]">
          <span className="rounded-full px-3 py-1 font-medium text-(--color-text-primary)" style={{ background: "color-mix(in srgb, var(--tone) 18%, transparent)", boxShadow: "0 0 0 1px color-mix(in srgb, var(--tone) 34%, transparent) inset" }}>{item.category}</span>
          <span dir="ltr" className="text-(--color-text-muted)">{item.year}</span>
        </div>
        <h3 className="mt-4 font-display text-2xl font-bold leading-tight text-(--color-text-primary)">{item.title}</h3>
        <p className="mt-3 line-clamp-2 font-sans text-[15px] leading-relaxed text-(--color-text-secondary)">{item.description}</p>
        <span className="text-tone mt-5 inline-flex items-center gap-1 font-sans text-[15px] font-semibold">{copy.open}</span>
      </div>
    </motion.article>
    </Reveal>
  );
}

export default ProjectCard;

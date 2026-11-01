import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";
import { smoothEase } from "../constants/theme.js";
import { localize, useLanguage } from "../context/LanguageContext.jsx";
import { getUI } from "../i18n.js";
import ProjectImageCarousel from "./ProjectImageCarousel.jsx";

function ProjectCard({ project, index, onOpen }) {
  const { language } = useLanguage();
  const copy = getUI(language, "projects");
  const item = localize(project, language);
  const cardLayoutId = "project-card-" + project.id;
  const imageLayoutId = "project-image-" + project.id;

  function handleKeyDown(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onOpen(project);
    }
  }

  return (
    <motion.article
      layoutId={cardLayoutId}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, ease: smoothEase, delay: (index % 3) * 0.08 }}
      role="button"
      tabIndex={0}
      onClick={() => onOpen(project)}
      onKeyDown={handleKeyDown}
      aria-label={`${copy.open}: ${item.title}`}
      className="tile group h-full cursor-pointer overflow-hidden text-start outline-none focus-visible:ring-2 focus-visible:ring-accent-fill"
    >
      <motion.div layoutId={imageLayoutId} className="relative aspect-16/10 overflow-hidden">
        <div className="h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.28,0.11,0.32,1)] group-hover:scale-[1.04]">
          <ProjectImageCarousel images={project.images} title={item.title} index={index} />
        </div>
      </motion.div>
      <div className="p-6 md:p-7">
        <div className="flex items-center justify-between gap-3 font-sans text-[13px] text-(--color-text-muted)">
          <span>{item.category}</span>
          <span dir="ltr">{item.year}</span>
        </div>
        <h3 className="mt-2 font-display text-2xl font-semibold leading-tight tracking-tight text-(--color-text-primary)">{item.title}</h3>
        <p className="mt-3 line-clamp-2 font-sans text-[15px] leading-relaxed text-(--color-text-secondary)">{item.description}</p>
        <span className="link-cta mt-5 text-[15px] group-hover:underline group-hover:underline-offset-3">
          {copy.open}
          <ChevronRight size={16} strokeWidth={2} className="rtl:rotate-180" aria-hidden="true" />
        </span>
      </div>
    </motion.article>
  );
}

export default ProjectCard;

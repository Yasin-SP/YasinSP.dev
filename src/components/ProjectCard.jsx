import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
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
      whileHover={{ y: -4 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, ease: smoothEase, delay: index * 0.06 }}
      role="button"
      tabIndex={0}
      onClick={() => onOpen(project)}
      onKeyDown={handleKeyDown}
      aria-label={`${copy.open}: ${item.title}`}
      className="group cursor-pointer overflow-hidden rounded-2xl border outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
      style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}
    >
      <motion.div
        layoutId={imageLayoutId}
        className="relative aspect-16/10 overflow-hidden"
      >
        <ProjectImageCarousel images={project.images} title={item.title} index={index} />
      </motion.div>
      <div className="p-5 md:p-6">
        <div className="flex items-center justify-between gap-3">
          <span className="font-sans text-[10px] tracking-[0.18em] uppercase text-(--color-purple-1)">{item.category}</span>
          <span className="font-sans text-[10px] text-(--color-text-muted)">{item.year}</span>
        </div>
        <h3 className="font-display text-(--color-text-primary) text-xl md:text-2xl font-semibold mt-2 tracking-tight">{item.title}</h3>
        <p className="font-sans text-(--color-text-secondary) text-sm mt-3 leading-relaxed line-clamp-2">{item.description}</p>
        <div dir="ltr" className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-(--color-text-secondary) group-hover:text-(--color-text-primary) transition-colors">
          {copy.open}
          <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </div>
      </div>
    </motion.article>
  );
}

export default ProjectCard;

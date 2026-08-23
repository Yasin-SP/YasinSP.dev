import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { smoothEase } from "../constants/theme.js";
import { projects } from "../data/projects.js";
import { getUI } from "../i18n.js";
import { useLanguage } from "../context/LanguageContext.jsx";
import ProjectCard from "./ProjectCard.jsx";
import ProjectModal from "./ProjectModal.jsx";
import SectionIntro from "./SectionIntro.jsx";

const INITIAL_VISIBLE_COUNT = 3;

function ProjectsSection() {
  const [selected, setSelected] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const selectedIndex = projects.findIndex((p) => p.id === selected?.id);
  const { language, isRTL } = useLanguage();
  const copy = getUI(language, "projects");
  const hasMore = projects.length > INITIAL_VISIBLE_COUNT;
  const visibleProjects = expanded ? projects : projects.slice(0, INITIAL_VISIBLE_COUNT);

  return <section id="projects" className="relative w-full py-28 md:py-36">
    <div dir={isRTL ? "rtl" : "ltr"} className="max-w-7xl mx-auto px-6 md:px-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <SectionIntro eyebrow={copy.eyebrow} title={copy.title} highlight={copy.highlight} description={copy.description} />
        <Link to="/contact" className="hidden md:inline-flex items-center gap-2 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">{copy.projectInMind}<ArrowUpRight size={15} /></Link>
      </div>
      <motion.div layout transition={{ type: "spring", stiffness: 260, damping: 30, mass: 0.9 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-14 md:mt-16">
        <AnimatePresence initial={false} mode="popLayout">
          {visibleProjects.map((project, index) => <motion.div
            key={project.id}
            layout
            initial={index >= INITIAL_VISIBLE_COUNT ? { opacity: 0, y: 28, scale: 0.94 } : false}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.25, ease: smoothEase } }}
            transition={{
              layout: { type: "spring", stiffness: 260, damping: 30, mass: 0.9 },
              opacity: { duration: 0.4, ease: smoothEase },
              scale: { type: "spring", stiffness: 260, damping: 24 },
              y: { type: "spring", stiffness: 260, damping: 24 },
              delay: index >= INITIAL_VISIBLE_COUNT ? (index - INITIAL_VISIBLE_COUNT) * 0.06 : 0,
            }}
          >
            <ProjectCard project={project} index={index} onOpen={setSelected} />
          </motion.div>)}
        </AnimatePresence>
      </motion.div>
      {hasMore && <div className="mt-10 md:mt-12 flex justify-center">
        <motion.button
          type="button"
          layout
          onClick={() => setExpanded((prev) => !prev)}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.3, ease: smoothEase }}
          aria-expanded={expanded}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border px-6 text-sm font-medium text-(--color-text-primary) transition-colors duration-300 hover:border-purple-400/50"
          style={{ borderColor: "var(--color-border-strong)", background: "var(--color-surface)" }}
        >
          {expanded ? copy.showLess : copy.showMore}
          <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.35, ease: smoothEase }} className="flex">
            <ChevronDown size={15} />
          </motion.span>
        </motion.button>
      </div>}
    </div>
    <AnimatePresence>{selected && <ProjectModal project={selected} index={selectedIndex} onClose={() => setSelected(null)} />}</AnimatePresence>
  </section>;
}
export default ProjectsSection;

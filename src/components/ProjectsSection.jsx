import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { smoothEase } from "../constants/theme.js";
import { projects } from "../data/projects.js";
import { getUI } from "../i18n.js";
import { useLanguage } from "../context/LanguageContext.jsx";
import ProjectCard from "./ProjectCard.jsx";
import ProjectModal from "./ProjectModal.jsx";
import Section from "./Section.jsx";
import SectionIntro from "./SectionIntro.jsx";

const INITIAL_VISIBLE_COUNT = 3;
const layoutSpring = { type: "spring", stiffness: 260, damping: 30, mass: 0.9 };

function ProjectsSection() {
  const [selected, setSelected] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const selectedIndex = projects.findIndex((p) => p.id === selected?.id);
  const { language } = useLanguage();
  const copy = getUI(language, "projects");
  const hasMore = projects.length > INITIAL_VISIBLE_COUNT;
  const visibleProjects = expanded ? projects : projects.slice(0, INITIAL_VISIBLE_COUNT);

  return (
    <Section id="projects">
      <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <SectionIntro eyebrow={copy.eyebrow} title={copy.title} highlight={copy.highlight} description={copy.description} />
        <Link to="/contact" className="link-cta hidden shrink-0 md:inline-flex">
          {copy.projectInMind}
          <ChevronRight size={18} strokeWidth={2} className="rtl:rotate-180" aria-hidden="true" />
        </Link>
      </div>

      <motion.div layout transition={layoutSpring} className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 md:mt-16 lg:grid-cols-3">
        <AnimatePresence initial={false} mode="popLayout">
          {visibleProjects.map((project, index) => (
            <motion.div
              key={project.id}
              layout
              initial={index >= INITIAL_VISIBLE_COUNT ? { opacity: 0, y: 28, scale: 0.96 } : false}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.25, ease: smoothEase } }}
              transition={{
                layout: layoutSpring,
                opacity: { duration: 0.4, ease: smoothEase },
                scale: { type: "spring", stiffness: 260, damping: 26 },
                y: { type: "spring", stiffness: 260, damping: 26 },
                delay: index >= INITIAL_VISIBLE_COUNT ? (index - INITIAL_VISIBLE_COUNT) * 0.06 : 0,
              }}
            >
              <ProjectCard project={project} index={index} onOpen={setSelected} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {hasMore && (
        <div className="mt-12 flex justify-center">
          <motion.button
            type="button"
            layout
            onClick={() => setExpanded((prev) => !prev)}
            aria-expanded={expanded}
            className="btn btn-secondary"
          >
            {expanded ? copy.showLess : copy.showMore}
            <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.35, ease: smoothEase }} className="flex">
              <ChevronDown size={16} strokeWidth={2} />
            </motion.span>
          </motion.button>
        </div>
      )}

      <AnimatePresence>{selected && <ProjectModal project={selected} index={selectedIndex} onClose={() => setSelected(null)} />}</AnimatePresence>
    </Section>
  );
}
export default ProjectsSection;

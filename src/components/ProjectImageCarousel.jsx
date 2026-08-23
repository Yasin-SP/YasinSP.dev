import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProjectImagePlaceholder from "./ProjectImagePlaceholder.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";

const slideVariants = {
  enter: (direction) => ({ x: direction > 0 ? "100%" : "-100%" }),
  center: { x: "0%" },
  exit: (direction) => ({ x: direction > 0 ? "-100%" : "100%" }),
};

function ProjectImageCarousel({ images, title, index = 0, showControls = false, interval = 4000 }) {
  const slides = images && images.length > 0 ? images : [null];
  const [[current, direction], setSlide] = useState([0, 1]);
  const [paused, setPaused] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const imageRef = useRef(null);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { amount: 0.15, once: false });
  const { isRTL } = useLanguage();

  useEffect(() => {
    setLoaded(false);
    setImageError(false);
  }, [current]);

  useEffect(() => {
    const image = imageRef.current;
    if (!image) return;
    if (image.complete) {
      if (image.naturalWidth > 0) setLoaded(true);
      else setImageError(true);
    }
  }, [current, slides.length, slides[current]]);
  useEffect(() => {
    if (slides.length <= 1 || paused || !isInView) return undefined;
    const id = window.setInterval(() => setSlide(([prev]) => [(prev + 1) % slides.length, 1]), interval);
    return () => window.clearInterval(id);
  }, [slides.length, paused, interval, isInView]);

  function goTo(i, e) { e?.stopPropagation(); setSlide([i, i > current ? 1 : -1]); setPaused(true); }
  function next(e) { e?.stopPropagation(); setSlide(([prev]) => [(prev + 1) % slides.length, 1]); setPaused(true); }
  function prev(e) { e?.stopPropagation(); setSlide(([prev]) => [(prev - 1 + slides.length) % slides.length, -1]); setPaused(true); }

  return <div ref={containerRef} className="relative w-full h-full overflow-hidden">
    <AnimatePresence initial={false} custom={direction} mode="popLayout">
      <motion.div key={current} custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ x: { type: "spring", stiffness: 320, damping: 32 } }} className="absolute inset-0">
        {slides[current] && !imageError ? (
          <>
            {!loaded && <div className="absolute inset-0 z-10 animate-pulse" style={{ background: "linear-gradient(120deg, var(--color-surface) 15%, var(--color-accent-surface) 42%, var(--color-surface-hover) 52%, var(--color-surface) 80%)", backgroundSize: "220% 100%" }} aria-hidden="true" />}
            <img ref={imageRef} src={slides[current]} alt={`${title} — project screenshot ${current + 1}`} loading={current === 0 && index === 0 ? "eager" : "lazy"} decoding="async" onLoad={() => setLoaded(true)} onError={() => { setImageError(true); setLoaded(false); }} className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`} />
          </>
        ) : <ProjectImagePlaceholder index={index} title={title} />}
      </motion.div>
    </AnimatePresence>

    {showControls && slides.length > 1 && <>
      <button type="button" onClick={prev} aria-label={isRTL ? "تصویر قبلی" : "Previous image"} className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-9 h-9 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-black/60 transition-colors duration-300"><ChevronLeft size={16} /></button>
      <button type="button" onClick={next} aria-label={isRTL ? "تصویر بعدی" : "Next image"} className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-9 h-9 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-black/60 transition-colors duration-300"><ChevronRight size={16} /></button>
      <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">{slides.map((_, i) => <button key={i} type="button" onClick={(e) => goTo(i, e)} aria-label={isRTL ? `تصویر ${i + 1}` : `Go to image ${i + 1}`} className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? "w-5 bg-purple-300" : "w-1.5 bg-white/40 hover:bg-white/60"}`} />)}</div>
    </>}
  </div>;
}
export default ProjectImageCarousel;

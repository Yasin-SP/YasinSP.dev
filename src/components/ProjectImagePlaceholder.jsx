import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";

function ProjectImagePlaceholder({ index = 0, title }) {
  const number = String(index + 1).padStart(2, "0");

  return (
    <div
      dir="ltr"
      className="relative flex h-full w-full items-center justify-center overflow-hidden"
      style={{
        background: "radial-gradient(circle at 72% 28%, rgba(168,85,247,.22), transparent 30%), linear-gradient(135deg, #0b0b0d 0%, #15121a 52%, #09090b 100%)",
      }}
      aria-label={`${title} preview`}
    >
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.06) 1px, transparent 1px)", backgroundSize: "44px 44px", maskImage: "radial-gradient(circle at center, black, transparent 72%)" }} />
      <motion.div
        aria-hidden="true"
        className="absolute h-40 w-40 rounded-full bg-purple-500/15 blur-3xl"
        animate={{ scale: [0.92, 1.08, 0.92], opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative z-10 flex flex-col items-center gap-3 px-6 text-center">
        <span className="font-sans text-[10px] tracking-[0.32em] text-purple-300/70">PROJECT {number}</span>
        <span className="font-display text-xl font-semibold text-white/90 sm:text-2xl">{title}</span>
        <span className="inline-flex items-center gap-2 font-sans text-[10px] uppercase tracking-[0.2em] text-white/40">
          Visual preview <ArrowUpRight size={12} />
        </span>
      </div>
    </div>
  );
}

export default ProjectImagePlaceholder;

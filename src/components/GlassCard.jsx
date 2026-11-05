import { useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { MOTION, NO_PREFERENCE, gsap, useGSAP } from "../lib/gsap.js";
import { usePointerGlow } from "../hooks/usePointerGlow.js";

/**
 * Liquid-glass surface. The outer element owns the scroll entrance (GSAP, the
 * same curve as every other reveal); the inner glass owns the hover: a tint
 * that follows the pointer and an optional 3D tilt.
 */
export default function GlassCard({ as: Tag = "div", tone, tilt = true, tiltDeg = 7, delay = 0, reveal = true, className = "", style, children, ...rest }) {
  const reduce = useReducedMotion();
  const wrapRef = useRef(null);
  const { ref, onPointerMove } = usePointerGlow();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spring = { stiffness: 220, damping: 22, mass: 0.5 };
  const rotateX = useSpring(useTransform(py, [0, 1], [tiltDeg, -tiltDeg]), spring);
  const rotateY = useSpring(useTransform(px, [0, 1], [-tiltDeg, tiltDeg]), spring);
  const canTilt = tilt && !reduce;

  useGSAP(() => {
    const el = wrapRef.current;
    if (!reveal) return undefined;
    const mm = gsap.matchMedia();
    mm.add(NO_PREFERENCE, () => {
      gsap.fromTo(
        el,
        { autoAlpha: 0, y: MOTION.y, scale: 0.97 },
        { autoAlpha: 1, y: 0, scale: 1, duration: MOTION.duration, ease: MOTION.ease, delay, clearProps: "transform,opacity,visibility", scrollTrigger: { trigger: el, start: MOTION.start, once: true } },
      );
    });
    return () => mm.revert();
  }, { scope: wrapRef });

  function handleMove(event) {
    onPointerMove(event);
    if (!canTilt || event.pointerType === "touch") return;
    const rect = event.currentTarget.getBoundingClientRect();
    px.set((event.clientX - rect.left) / rect.width);
    py.set((event.clientY - rect.top) / rect.height);
  }
  function handleLeave() { px.set(0.5); py.set(0.5); }

  return (
    <Tag ref={wrapRef} className="h-full" {...rest}>
      <motion.div
        ref={ref}
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
        className={`glass h-full ${tone ? `tone-${tone}` : ""} ${className}`}
        style={{ ...(canTilt ? { rotateX, rotateY, transformPerspective: 900 } : {}), ...style }}
      >
        {children}
      </motion.div>
    </Tag>
  );
}

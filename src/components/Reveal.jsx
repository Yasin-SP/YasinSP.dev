import { motion } from "motion/react";
import { smoothEase } from "../constants/theme.js";

/**
 * The one entrance animation used across the page: a short fade and a small
 * upward drift, once, when the element enters the viewport. Reduced-motion
 * users get the fade only (MotionConfig handles the transform).
 */
export default function Reveal({ as = "div", delay = 0, y = 24, amount = 0.2, className = "", children, ...rest }) {
  const Component = motion[as] ?? motion.div;
  return (
    <Component
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.9, ease: smoothEase, delay }}
      className={className}
      {...rest}
    >
      {children}
    </Component>
  );
}

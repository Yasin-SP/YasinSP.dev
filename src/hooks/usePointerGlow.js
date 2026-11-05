import { useCallback, useRef } from "react";

/**
 * Writes the pointer position into --mx / --my on the element (no React state,
 * so no re-render per mouse move). The `.glass` sheen reads those variables.
 */
export function usePointerGlow() {
  const ref = useRef(null);
  const onPointerMove = useCallback((event) => {
    const el = ref.current;
    if (!el || event.pointerType === "touch") return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    el.style.setProperty("--my", `${event.clientY - rect.top}px`);
  }, []);
  return { ref, onPointerMove };
}

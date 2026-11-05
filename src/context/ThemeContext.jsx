import { createContext, useContext, useEffect, useRef, useState } from "react";
import { safeStorageGet, safeStorageSet } from "../lib/safeStorage.js";
import { themeColors } from "../constants/theme.js";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "dark";
    const saved = safeStorageGet("theme");
    if (saved === "dark" || saved === "light") return saved;
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  });

  const themeRef = useRef(theme);
  const overlayRef = useRef(null);
  const animationRef = useRef(null);
  const isAnimatingRef = useRef(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    themeRef.current = theme;
    document.documentElement.setAttribute("data-theme", theme);
    safeStorageSet("theme", theme);
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "light" ? themeColors.light : themeColors.dark);
  }, [theme]);

  useEffect(() => {
    isMountedRef.current = true;
    const overlay = overlayRef.current;
    return () => {
      isMountedRef.current = false;
      animationRef.current?.cancel();
      animationRef.current = null;
      isAnimatingRef.current = false;

      if (overlay) {
        overlay.style.opacity = "0";
        overlay.style.clipPath = "circle(0px at 50% 50%)";
      }
    };
  }, []);

  function applyTheme(next) {
    themeRef.current = next;
    document.documentElement.setAttribute("data-theme", next);
    setTheme(next);
  }

  async function toggleThemeAtPoint(x, y) {
    if (isAnimatingRef.current) return;

    const overlay = overlayRef.current;
    const next = themeRef.current === "dark" ? "light" : "dark";
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!overlay || reducedMotion || typeof overlay.animate !== "function") {
      applyTheme(next);
      return;
    }

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );
    const isForward = next === "light";
    isAnimatingRef.current = true;

    try {
      overlay.style.pointerEvents = "none";
      overlay.style.opacity = "1";
      overlay.style.backgroundColor = themeColors.light;
      overlay.style.clipPath = isForward
        ? `circle(0px at ${x}px ${y}px)`
        : `circle(${endRadius}px at ${x}px ${y}px)`;

      if (!isForward) applyTheme(next);

      const animation = overlay.animate(
        {
          clipPath: isForward
            ? [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`]
            : [`circle(${endRadius}px at ${x}px ${y}px)`, `circle(0px at ${x}px ${y}px)`],
        },
        { duration: 500, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "forwards" }
      );

      animationRef.current = animation;
      await animation.finished;
      if (isForward) applyTheme(next);
    } catch {
      if (isMountedRef.current && themeRef.current !== next) applyTheme(next);
    } finally {
      animationRef.current = null;
      isAnimatingRef.current = false;
      if (isMountedRef.current) {
        overlay.style.opacity = "0";
        overlay.style.clipPath = `circle(0px at ${x}px ${y}px)`;
      }
    }
  }

  function toggleTheme() {
    void toggleThemeAtPoint(window.innerWidth / 2, window.innerHeight / 2);
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, toggleThemeAtPoint }}>
      <div
        ref={overlayRef}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          opacity: 0,
          pointerEvents: "none",
          clipPath: "circle(0px at 50% 50%)",
          willChange: "clip-path",
        }}
      />
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
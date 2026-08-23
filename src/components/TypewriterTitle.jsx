import { useEffect, useMemo, useRef, useState } from "react";
import { purpleGradient } from "../constants/theme.js";

/**
 * True character-by-character typewriter reveal.
 *
 * Key idea: the FULL text is always present in the DOM as one continuous
 * text run — only the not-yet-typed tail is made invisible (opacity: 0),
 * never removed. This keeps Persian/Arabic letter-joining correct (glyph
 * shaping only works within a single contiguous run, so splitting text into
 * many per-character <span> elements would visually break cursive joining),
 * and it reserves the final layout size from frame one, so there's no
 * line-wrap jump as the text grows.
 *
 * The caret is rendered INSIDE the content, right between the visible and
 * hidden text, so it always sits exactly at the live typing position
 * instead of parked at the end of the fully-reserved width.
 */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

// Fixed, deliberately typewriter-paced speed — NOT scaled down for longer
// text, otherwise short titles finish almost instantly and just look like
// they "appear" rather than get typed. Slightly slower than a first pass to
// avoid feeling rushed.
const CHAR_DURATION_MS = 62;
const START_DELAY_MS = 300;

// Grapheme-cluster split (not raw codepoints) so combining sequences like
// ZWNJ ("نیم‌فاصله") + the letter after it always move together instead of
// the ZWNJ appearing on its own for one frame.
function graphemesOf(text) {
  if (typeof Intl !== "undefined" && typeof Intl.Segmenter === "function") {
    const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });
    return Array.from(segmenter.segment(text), (s) => s.segment);
  }
  return Array.from(text);
}

// Persian/Arabic letters change shape when a neighboring letter is added
// (final form → medial form), so revealing exactly one letter at a time
// makes already-typed letters visibly "re-shape" on every frame, which
// reads as jittery/unstable. Revealing 2 letters per step at once roughly
// halves how often that reshaping is visible, without slowing down the
// overall duration (step duration scales with step size).
function useTypewriter(totalUnits, { unitDuration = CHAR_DURATION_MS, stepSize = 1, startDelay = START_DELAY_MS, enabled = true } = {}) {
  const [typedLength, setTypedLength] = useState(enabled ? 0 : totalUnits);
  const [done, setDone] = useState(!enabled);
  const frameRef = useRef(null);

  useEffect(() => {
    if (!enabled) {
      setTypedLength(totalUnits);
      setDone(true);
      return undefined;
    }

    setTypedLength(0);
    setDone(false);
    let startTime = null;
    let cancelled = false;
    const stepDuration = unitDuration * stepSize;

    function tick(now) {
      if (cancelled) return;
      if (startTime === null) startTime = now;
      const elapsed = now - startTime - startDelay;
      if (elapsed < 0) {
        frameRef.current = requestAnimationFrame(tick);
        return;
      }
      const next = Math.min(totalUnits, (Math.floor(elapsed / stepDuration) + 1) * stepSize);
      setTypedLength((prev) => (next !== prev ? next : prev));
      if (next >= totalUnits) {
        setDone(true);
        return;
      }
      frameRef.current = requestAnimationFrame(tick);
    }

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [totalUnits, unitDuration, stepSize, startDelay, enabled]);

  return { typedLength: Math.min(typedLength, totalUnits), done };
}

function TypewriterTitle({
  title,
  highlight,
  suffix = "",
  isRTL = false,
  className = "",
}) {
  const titleText = title.trim();
  const highlightText = (highlight || "").trim();
  const suffixText = suffix.trim();

  const fullText = [titleText, highlightText, suffixText].filter(Boolean).join(" ");
  const chars = useMemo(() => graphemesOf(fullText), [fullText]);
  const totalChars = chars.length;

  const highlightStart = highlightText
    ? graphemesOf(titleText ? `${titleText} ` : "").length
    : -1;
  const highlightEnd = highlightText ? highlightStart + graphemesOf(highlightText).length : -1;

  const reducedMotion = usePrefersReducedMotion();
  const { typedLength, done } = useTypewriter(totalChars, {
    enabled: !reducedMotion,
    stepSize: isRTL ? 2 : 1,
  });

  const slice = (start, end) => chars.slice(Math.max(start, 0), Math.max(end, 0)).join("");

  // Everything up to typedLength is "visible", split into up to 3 runs only
  // for coloring purposes (plain / gradient-highlight / plain). Everything
  // after typedLength is ONE single hidden run — this avoids any overlap
  // bugs and guarantees the caret sits exactly at the visible/hidden edge.
  const beforeEnd = highlightText ? Math.min(typedLength, highlightStart) : typedLength;
  const beforeVisible = slice(0, beforeEnd);

  const highlightVisibleEnd = highlightText ? Math.min(typedLength, highlightEnd) : -1;
  const highlightVisible = highlightText ? slice(highlightStart, highlightVisibleEnd) : "";

  const afterStart = highlightText ? highlightEnd : typedLength;
  const afterVisible = highlightText && typedLength > afterStart ? slice(afterStart, typedLength) : "";

  const hiddenText = slice(typedLength, totalChars);

  const highlightStyle = {
    backgroundImage: purpleGradient,
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
  };

  return (
    <h1
      dir={isRTL ? "rtl" : "ltr"}
      className={`typewriter-title ${isRTL ? "typewriter-title--rtl" : ""} ${className}`}
      aria-label={fullText}
    >
      <span className="typewriter-title__content" aria-hidden="true">
        {beforeVisible}
        {highlightText && <span style={highlightStyle}>{highlightVisible}</span>}
        {afterVisible}
        <span
          className={`typewriter-caret ${done ? "typewriter-caret--blink" : "typewriter-caret--solid"}`}
        />
        {hiddenText && <span className="typewriter-hidden">{hiddenText}</span>}
      </span>
    </h1>
  );
}

export default TypewriterTitle;

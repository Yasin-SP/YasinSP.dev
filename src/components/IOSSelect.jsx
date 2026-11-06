import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, ChevronsUpDown } from "lucide-react";
import { useLanguage } from "../context/LanguageContext.jsx";
import { startScroll, stopScroll } from "../lib/scroll.js";

const SHEET_QUERY = "(max-width: 767px)";
const spring = { type: "spring", stiffness: 520, damping: 38, mass: 0.7 };
const sheetSpring = { type: "spring", stiffness: 380, damping: 40, mass: 0.9 };

function useIsSheet() {
  const [sheet, setSheet] = useState(() => typeof window !== "undefined" && window.matchMedia(SHEET_QUERY).matches);
  useEffect(() => {
    const mq = window.matchMedia(SHEET_QUERY);
    const on = () => setSheet(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return sheet;
}

/** Shared option list: listbox semantics, arrow/Home/End/typeahead, iOS-style check. */
function OptionList({ options, value, onPick, activeIndex, setActiveIndex, listId, listRef, label, compact }) {
  return (
    <ul ref={listRef} id={listId} role="listbox" aria-label={label} tabIndex={-1} className={`flex flex-col ${compact ? "gap-0.5 p-1.5" : "gap-1 px-3 pb-3"}`}>
      {options.map((o, i) => {
        const selected = o.value === value;
        const active = i === activeIndex;
        return (
          <li
            key={o.value}
            id={`${listId}-${i}`}
            role="option"
            aria-selected={selected}
            data-active={active || undefined}
            onPointerEnter={() => setActiveIndex(i)}
            onClick={() => onPick(o.value)}
            className="ios-option flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-[0.85rem] px-3.5 py-2.5 font-sans text-[15px] text-(--color-text-primary)"
            style={{ background: active ? "var(--ios-row-active)" : "transparent" }}
          >
            <span className={selected ? "font-semibold" : ""}>{o.label}</span>
            <span className="flex h-5 w-5 shrink-0 items-center justify-center" style={{ color: "var(--accent-text)" }}>
              {selected ? (
                <motion.span initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 600, damping: 26 }} className="flex">
                  <Check size={18} strokeWidth={2.6} />
                </motion.span>
              ) : null}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * iOS-flavoured select. A glass popover on desktop that grows out of the
 * trigger (and flips up near the bottom edge); a draggable bottom sheet on phones.
 * `onChange` receives `{ target: { name, value } }` so it drops in for <select>.
 */
export default function IOSSelect({ id, name, value, onChange, options, placeholder, label, error, describedBy }) {
  const { isRTL } = useLanguage();
  const reduce = useReducedMotion();
  const isSheet = useIsSheet();
  const uid = useId();
  const listId = `${uid}-list`;
  const triggerRef = useRef(null);
  const listRef = useRef(null);
  const typeRef = useRef({ text: "", timer: 0 });
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [pos, setPos] = useState(null);
  const selected = options.find((o) => o.value === value);

  const close = useCallback((restore = true) => {
    setOpen(false);
    if (restore) requestAnimationFrame(() => triggerRef.current?.focus({ preventScroll: true }));
  }, []);

  const openMenu = () => {
    setActiveIndex(Math.max(0, options.findIndex((o) => o.value === value)));
    setOpen(true);
  };

  const pick = (next) => {
    onChange({ target: { name, value: next } });
    close();
  };

  // Anchor the popover to the trigger and flip upward when there's no room below.
  const place = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const menuH = Math.min(options.length * 46 + 14, 320);
    const below = window.innerHeight - rect.bottom;
    const up = below < menuH + 16 && rect.top > below;
    setPos({ left: rect.left, width: rect.width, top: up ? undefined : rect.bottom + 8, bottom: up ? window.innerHeight - rect.top + 8 : undefined, up, maxH: Math.max(180, (up ? rect.top : below) - 20) });
  }, [options.length]);

  useLayoutEffect(() => {
    if (!open || isSheet) return undefined;
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, { passive: true });
    return () => { window.removeEventListener("resize", place); window.removeEventListener("scroll", place); };
  }, [open, isSheet, place]);

  // Sheets lock page scroll; both modes close on outside press and on Escape.
  useEffect(() => {
    if (!open) return undefined;
    if (isSheet) stopScroll();
    const onKey = (e) => { if (e.key === "Escape") { e.stopPropagation(); close(); } };
    const onDown = (e) => {
      if (triggerRef.current?.contains(e.target) || listRef.current?.closest("[data-ios-panel]")?.contains(e.target)) return;
      close(false);
    };
    window.addEventListener("keydown", onKey, true);
    document.addEventListener("pointerdown", onDown);
    const focusTimer = window.setTimeout(() => listRef.current?.focus({ preventScroll: true }), 30);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", onKey, true);
      document.removeEventListener("pointerdown", onDown);
      if (isSheet) startScroll();
    };
  }, [open, isSheet, close]);

  useEffect(() => {
    if (open && activeIndex >= 0) document.getElementById(`${listId}-${activeIndex}`)?.scrollIntoView({ block: "nearest" });
  }, [open, activeIndex, listId]);

  const onListKey = (e) => {
    const last = options.length - 1;
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIndex((i) => Math.min(last, i + 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActiveIndex((i) => Math.max(0, i - 1)); }
    else if (e.key === "Home") { e.preventDefault(); setActiveIndex(0); }
    else if (e.key === "End") { e.preventDefault(); setActiveIndex(last); }
    else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); if (options[activeIndex]) pick(options[activeIndex].value); }
    else if (e.key === "Tab") close(false);
    else if (e.key.length === 1) {
      const t = typeRef.current;
      window.clearTimeout(t.timer);
      t.text += e.key.toLowerCase();
      t.timer = window.setTimeout(() => { t.text = ""; }, 600);
      const hit = options.findIndex((o) => o.label.toLowerCase().startsWith(t.text));
      if (hit >= 0) setActiveIndex(hit);
    }
  };

  const onTriggerKey = (e) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); openMenu(); }
  };

  const dir = isRTL ? "rtl" : "ltr";

  const panel = isSheet ? (
    <div key="sheet" className="fixed inset-0 z-300 flex items-end" dir={dir}>
      <motion.div aria-hidden="true" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.28 }} onClick={() => close()} className="absolute inset-0" style={{ background: "var(--scrim)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }} />
      <motion.div
        data-ios-panel
        data-lenis-prevent
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={reduce ? { duration: 0 } : sheetSpring}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.7 }}
        onDragEnd={(_, info) => { if (info.offset.y > 110 || info.velocity.y > 520) close(); }}
        className="glass glass-blur relative flex max-h-[78dvh] w-full flex-col overflow-hidden pb-[max(0.75rem,env(safe-area-inset-bottom))]"
        style={{ "--r": "1.9rem 1.9rem 0 0", "--glass-blur": "46px", background: "var(--ios-sheet-bg)", touchAction: "none" }}
      >
        <div className="flex shrink-0 flex-col items-center px-5 pt-2.5">
          <span aria-hidden="true" className="h-1.5 w-10 rounded-full" style={{ background: "var(--color-border-strong)" }} />
          <p className="mt-3.5 mb-2 w-full text-center font-sans text-[13px] font-semibold text-(--color-text-muted)">{label}</p>
        </div>
        <div className="min-h-0 overflow-y-auto overscroll-contain" style={{ touchAction: "pan-y" }}>
          <OptionList options={options} value={value} onPick={pick} activeIndex={activeIndex} setActiveIndex={setActiveIndex} listId={listId} listRef={listRef} label={label} />
        </div>
      </motion.div>
    </div>
  ) : pos ? (
    <motion.div
      key="pop"
      data-ios-panel
      data-lenis-prevent
      dir={dir}
      initial={reduce ? false : { opacity: 0, scale: 0.92, y: pos.up ? 8 : -8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: pos.up ? 4 : -4, transition: { duration: 0.14 } }}
      transition={spring}
      className="glass glass-blur fixed z-300 overflow-y-auto overscroll-contain"
      style={{ left: pos.left, width: pos.width, top: pos.top, bottom: pos.bottom, maxHeight: pos.maxH, transformOrigin: pos.up ? "50% 100%" : "50% 0%", "--r": "1.25rem", "--glass-blur": "40px", background: "var(--ios-sheet-bg)", boxShadow: "var(--glass-shadow), 0 30px 70px -20px rgba(0,0,0,0.55)" }}
    >
      <OptionList options={options} value={value} onPick={pick} activeIndex={activeIndex} setActiveIndex={setActiveIndex} listId={listId} listRef={listRef} label={label} compact />
    </motion.div>
  ) : null;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        id={id}
        data-field={name}
        data-ios-select
        dir={dir}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-activedescendant={open && activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        onClick={() => (open ? close() : openMenu())}
        onKeyDown={onTriggerKey}
        className="contact-input ios-trigger flex min-h-12 w-full cursor-pointer items-center justify-between gap-3 rounded-xl border px-4 py-3 text-start font-sans text-base outline-none transition-[border-color,box-shadow,background-color] duration-300 focus-visible:border-(--accent-fill) focus-visible:shadow-[0_0_0_4px_var(--accent-ring)]"
        style={{
          color: selected ? "var(--contact-text)" : "var(--contact-text-muted)",
          borderColor: open ? "var(--accent-fill)" : error ? "rgba(248,113,113,.65)" : "var(--contact-border)",
          background: "var(--contact-bg-elevated)",
          boxShadow: open ? "0 0 0 4px var(--accent-ring)" : undefined,
        }}
      >
        <span className="truncate">{selected ? selected.label : placeholder}</span>
        <motion.span animate={{ scale: open ? 1.12 : 1 }} transition={spring} className="flex shrink-0" style={{ color: open ? "var(--accent-text)" : "var(--contact-text-muted)" }}>
          <ChevronsUpDown size={17} strokeWidth={2} />
        </motion.span>
      </button>
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {open && (
            <div onKeyDown={onListKey} key="wrap">
              {panel}
            </div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}

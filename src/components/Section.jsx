import { useLanguage } from "../context/LanguageContext.jsx";

/**
 * Shared section frame: consistent vertical rhythm, an optional alternate
 * background band, and a content wrapper that carries the reading direction so
 * grids and text flip together in Persian.
 */
export default function Section({ id, band = false, className = "", innerClassName = "", children }) {
  const { isRTL } = useLanguage();
  return (
    <section id={id} className={`relative w-full py-24 md:py-32 ${band ? "band-alt" : ""} ${className}`}>
      <div dir={isRTL ? "rtl" : "ltr"} className={`mx-auto w-full max-w-6xl px-6 md:px-10 ${innerClassName}`}>
        {children}
      </div>
    </section>
  );
}

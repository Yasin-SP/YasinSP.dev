import { useLanguage } from "../context/LanguageContext.jsx";

/**
 * Shared section frame: consistent vertical rhythm and a content wrapper that
 * carries the reading direction so grids and text flip together in Persian.
 * `tone` sets the colour family every card and heading inside will use.
 */
export default function Section({ id, tone = "blue", className = "", innerClassName = "", sectionRef, children }) {
  const { isRTL } = useLanguage();
  return (
    <section ref={sectionRef} id={id} className={`relative w-full py-16 md:py-36 tone-${tone} ${className}`}>
      <div dir={isRTL ? "rtl" : "ltr"} className={`mx-auto w-full max-w-6xl px-6 md:px-10 ${innerClassName}`}>
        {children}
      </div>
    </section>
  );
}

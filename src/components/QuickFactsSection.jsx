import { getUI } from "../i18n.js";
import { useLanguage } from "../context/LanguageContext.jsx";
import Reveal from "./Reveal.jsx";

const facts = [
  { value: "React", key: "stack" },
  { value: "Frontend", key: "focus" },
  { value: "UI / Motion", key: "craft" },
  { value: "Computer Engineering", key: "degree" },
];

/** A quiet spec sheet: four facts on one tile, separated by hairlines. */
function QuickFactsSection() {
  const { language, isRTL } = useLanguage();
  const copy = getUI(language, "facts");
  return (
    <section className="relative w-full pb-8 md:pb-12">
      <div dir={isRTL ? "rtl" : "ltr"} className="mx-auto w-full max-w-6xl px-6 md:px-10">
        <Reveal className="tile grid grid-cols-2 gap-px overflow-hidden lg:grid-cols-4" style={{ background: "var(--color-border)" }}>
          {facts.map((fact) => (
            <div key={fact.key} className="flex min-h-32 flex-col justify-between bg-(--color-tile) p-6 text-start md:min-h-40 md:p-8">
              <p className="font-sans text-sm text-(--color-text-muted)">{copy[fact.key]}</p>
              <p className="font-display text-[22px] font-semibold leading-tight tracking-tight text-(--color-text-primary) md:text-[28px]">{fact.value}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
export default QuickFactsSection;

import { Atom, GraduationCap, Layers, Sparkles } from "lucide-react";
import { getUI } from "../i18n.js";
import { useLanguage } from "../context/LanguageContext.jsx";
import SnapRow from "./SnapRow.jsx";
import GlassCard from "./GlassCard.jsx";

const facts = [
  { value: "React", key: "stack", icon: Atom, tone: "blue" },
  { value: "Frontend", key: "focus", icon: Layers, tone: "teal" },
  { value: "UI / Motion", key: "craft", icon: Sparkles, tone: "pink" },
  { value: "Computer Engineering", key: "degree", icon: GraduationCap, tone: "orange" },
];

/** Four colour-coded glass tiles — a quick spec sheet that responds to the pointer. */
function QuickFactsSection() {
  const { language, isRTL } = useLanguage();
  const copy = getUI(language, "facts");
  return (
    <section className="relative w-full pb-10 md:pb-16">
      <div dir={isRTL ? "rtl" : "ltr"} className="mx-auto w-full max-w-6xl px-6 md:px-10">
        <SnapRow label={copy.stack} gridClassName="md:grid-cols-2 lg:grid-cols-4" itemClassName="w-[44%] min-w-36" hideDots>
          {facts.map((fact, index) => {
            const Icon = fact.icon;
            return (
              <GlassCard key={fact.key} tone={fact.tone} delay={index * 0.08} tiltDeg={6} className="flex min-h-36 flex-col justify-between p-5 text-start md:min-h-48 md:p-7" style={{ "--r": "1.6rem" }}>
                <span className="tone-icon h-11 w-11 rounded-[0.9rem]"><Icon size={21} strokeWidth={1.9} /></span>
                <div>
                  <p className="font-sans text-[13px] text-(--color-text-muted)">{copy[fact.key]}</p>
                  <p className="mt-1 font-display text-[19px] font-bold leading-tight text-(--color-text-primary) md:text-[26px]">{fact.value}</p>
                </div>
              </GlassCard>
            );
          })}
        </SnapRow>
      </div>
    </section>
  );
}
export default QuickFactsSection;

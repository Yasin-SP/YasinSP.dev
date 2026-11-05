import { Code2, Palette, Wand2 } from "lucide-react";
import { services } from "../data/services.js";
import { getUI } from "../i18n.js";
import { localize, useLanguage } from "../context/LanguageContext.jsx";
import GlassCard from "./GlassCard.jsx";
import SnapRow from "./SnapRow.jsx";
import Section from "./Section.jsx";
import SectionIntro from "./SectionIntro.jsx";

const icons = [Code2, Palette, Wand2];
const tones = ["blue", "purple", "pink"];

function ServicesSection() {
  const { language } = useLanguage();
  const copy = getUI(language, "services");
  return (
    <Section id="services" tone="purple">
      <SectionIntro eyebrow={copy.eyebrow} title={copy.title} highlight={copy.highlight} description={copy.description} />
      <div className="mt-10 md:mt-20">
        <SnapRow label={copy.eyebrow} gridClassName="md:grid-cols-3" itemClassName="w-[84%]">
        {services.map((service, index) => {
          const item = localize(service, language);
          const Icon = icons[index % icons.length];
          return (
            <GlassCard key={service.number} as="article" tone={tones[index % tones.length]} delay={index * 0.1} className="group flex min-h-80 flex-col overflow-hidden p-7 text-start md:min-h-96 md:p-9">
              <span aria-hidden="true" className="pointer-events-none absolute end-6 top-4 font-display text-[6.5rem] font-bold leading-none opacity-[0.07] text-(--color-text-primary)">{service.number}</span>
              <span className="tone-icon h-14 w-14 rounded-[1.1rem] transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110"><Icon size={26} strokeWidth={1.8} /></span>
              <h3 className="mt-8 font-display text-2xl md:mt-10 font-bold leading-tight text-(--color-text-primary)">{item.title}</h3>
              <p className="mt-3 font-sans text-base leading-relaxed text-(--color-text-secondary)">{item.description}</p>
              <ul className="mt-auto flex flex-wrap gap-2 pt-8">
                {item.tags.map((tag) => (
                  <li key={tag} className="rounded-full px-3 py-1 font-sans text-[13px] font-medium text-(--color-text-primary)" style={{ background: "color-mix(in srgb, var(--tone) 18%, transparent)", boxShadow: "0 0 0 1px color-mix(in srgb, var(--tone) 34%, transparent) inset" }}>{tag}</li>
                ))}
              </ul>
            </GlassCard>
          );
        })}
        </SnapRow>
      </div>
    </Section>
  );
}
export default ServicesSection;

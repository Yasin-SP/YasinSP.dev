import { Code2, Palette, Sparkles } from "lucide-react";
import { services } from "../data/services.js";
import { getUI } from "../i18n.js";
import { localize, useLanguage } from "../context/LanguageContext.jsx";
import Reveal from "./Reveal.jsx";
import Section from "./Section.jsx";
import SectionIntro from "./SectionIntro.jsx";

const icons = [Code2, Palette, Sparkles];

function ServicesSection() {
  const { language } = useLanguage();
  const copy = getUI(language, "services");
  return (
    <Section id="services" band>
      <SectionIntro eyebrow={copy.eyebrow} title={copy.title} highlight={copy.highlight} description={copy.description} />
      <div className="mt-14 grid gap-5 md:mt-20 md:grid-cols-3">
        {services.map((service, index) => {
          const item = localize(service, language);
          const Icon = icons[index % icons.length];
          return (
            <Reveal key={service.number} as="article" delay={index * 0.08} className="tile flex min-h-80 flex-col p-8 text-start md:p-9">
              <Icon size={30} strokeWidth={1.5} className="text-accent" aria-hidden="true" />
              <h3 className="mt-10 font-display text-2xl font-semibold leading-tight tracking-tight text-(--color-text-primary)">{item.title}</h3>
              <p className="mt-3 font-sans text-base leading-relaxed text-(--color-text-secondary)">{item.description}</p>
              <ul className="mt-auto flex flex-wrap gap-x-3 gap-y-1 pt-8 font-sans text-[13px] text-(--color-text-muted)">
                {item.tags.map((tag) => <li key={tag}>{tag}</li>)}
              </ul>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
export default ServicesSection;

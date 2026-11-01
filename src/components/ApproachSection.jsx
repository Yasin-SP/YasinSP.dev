import { approachSteps } from "../data/approach.js";
import { getUI } from "../i18n.js";
import { localize, useLanguage } from "../context/LanguageContext.jsx";
import Reveal from "./Reveal.jsx";
import Section from "./Section.jsx";
import SectionIntro from "./SectionIntro.jsx";

function ApproachSection() {
  const { language } = useLanguage();
  const copy = getUI(language, "approach");
  return (
    <Section id="approach" band>
      <SectionIntro eyebrow={copy.eyebrow} title={copy.title} highlight={copy.highlight} description={copy.description} />
      <ol className="mt-14 grid gap-5 md:mt-20 sm:grid-cols-2 lg:grid-cols-4">
        {approachSteps.map((step, index) => {
          const item = localize(step, language);
          return (
            <Reveal key={step.number} as="li" delay={index * 0.08} className="tile flex min-h-72 flex-col p-8 text-start">
              <span className="font-display text-[44px] font-semibold leading-none text-(--color-text-muted)" dir="ltr" style={{ textAlign: "start" }}>{step.number}</span>
              <h3 className="mt-12 font-display text-2xl font-semibold leading-tight tracking-tight text-(--color-text-primary)">{item.title}</h3>
              <p className="mt-3 font-sans text-[15px] leading-relaxed text-(--color-text-secondary)">{item.description}</p>
            </Reveal>
          );
        })}
      </ol>
    </Section>
  );
}
export default ApproachSection;

import { journeySteps } from "../data/journey.js";
import { getUI } from "../i18n.js";
import { localize, useLanguage } from "../context/LanguageContext.jsx";
import Reveal from "./Reveal.jsx";
import Section from "./Section.jsx";
import SectionIntro from "./SectionIntro.jsx";

function AboutSection() {
  const { language } = useLanguage();
  const copy = getUI(language, "about");
  return (
    <Section id="about">
      <div className="grid items-start gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:col-span-5">
          <SectionIntro eyebrow={copy.eyebrow} title={copy.title} highlight={copy.highlight} description={copy.description} />
          <Reveal delay={0.1} className="tile mt-10 p-7 text-start">
            <p className="font-sans text-sm font-medium text-(--color-text-muted)">{copy.currentLabel}</p>
            <p className="mt-3 font-display text-[19px] font-medium leading-snug text-(--color-text-primary)">{copy.current}</p>
          </Reveal>
        </div>

        <ol className="lg:col-span-7">
          {journeySteps.map((step, i) => {
            const item = localize(step, language);
            return (
              <Reveal key={step.title} as="li" delay={Math.min(i, 3) * 0.05} y={18} className="hairline-t grid grid-cols-[4.5rem_1fr] gap-4 py-8 text-start md:grid-cols-[6rem_1fr] md:gap-6">
                <span className="pt-1 font-sans text-sm font-medium text-(--color-text-muted)" dir="ltr" style={{ textAlign: "start" }}>{item.year}</span>
                <div>
                  <h3 className="font-display text-xl font-semibold leading-snug tracking-tight text-(--color-text-primary) md:text-2xl">{item.title}</h3>
                  <p className="mt-2 max-w-xl font-sans text-base leading-relaxed text-(--color-text-secondary)">{item.description}</p>
                </div>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}
export default AboutSection;

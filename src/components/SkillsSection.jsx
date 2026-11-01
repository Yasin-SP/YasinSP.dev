import { learningNow, learningNowFa, skillCategories } from "../data/skills.js";
import { getUI } from "../i18n.js";
import { localize, useLanguage } from "../context/LanguageContext.jsx";
import Reveal from "./Reveal.jsx";
import Section from "./Section.jsx";
import SectionIntro from "./SectionIntro.jsx";

function SkillsSection() {
  const { language } = useLanguage();
  const copy = getUI(language, "skills");
  const learning = language === "fa" ? learningNowFa : learningNow;
  return (
    <Section id="skills">
      <SectionIntro eyebrow={copy.eyebrow} title={copy.title} highlight={copy.highlight} description={copy.description} />
      <div className="mt-14 grid gap-5 md:mt-20 md:grid-cols-2">
        {skillCategories.map((category, index) => {
          const item = localize(category, language);
          return (
            <Reveal key={category.name} as="article" delay={(index % 2) * 0.08} className="tile p-8 text-start md:p-9">
              <h3 className="font-display text-2xl font-semibold leading-tight tracking-tight text-(--color-text-primary)">{item.name}</h3>
              <p className="mt-2 font-sans text-base leading-relaxed text-(--color-text-secondary)">{item.description}</p>
              <ul className="mt-7 flex flex-wrap gap-2">
                {item.skills.map((skill) => (
                  <li key={skill} className="rounded-full px-3.5 py-1.5 font-sans text-sm text-(--color-text-primary)" style={{ background: "var(--color-surface)" }}>{skill}</li>
                ))}
              </ul>
            </Reveal>
          );
        })}

        <Reveal as="aside" delay={0.08} className="tile flex flex-col p-8 text-start md:p-9">
          <p className="font-sans text-sm font-medium text-(--color-text-muted)">{copy.exploring}</p>
          <h3 className="mt-2 font-display text-2xl font-semibold leading-tight tracking-tight text-(--color-text-primary)">{copy.exploringTitle}</h3>
          <ul className="mt-7">
            {learning.map((entry) => (
              <li key={entry} className="hairline-t py-3 font-sans text-base text-(--color-text-secondary)">{entry}</li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
}
export default SkillsSection;

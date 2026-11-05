import { learningNow, learningNowFa, skillCategories } from "../data/skills.js";
import { getUI } from "../i18n.js";
import { localize, useLanguage } from "../context/LanguageContext.jsx";
import GlassCard from "./GlassCard.jsx";
import Marquee from "./Marquee.jsx";
import Reveal from "./Reveal.jsx";
import Section from "./Section.jsx";
import SectionIntro from "./SectionIntro.jsx";

const tones = ["blue", "purple", "teal", "orange"];
const dotColors = ["var(--c-purple)", "var(--c-indigo)", "var(--c-pink)", "var(--c-blue)", "var(--c-orange)", "var(--c-teal)"];

function SkillChip({ label, index }) {
  const color = dotColors[index % dotColors.length];
  return (
    <span className="pill whitespace-nowrap px-5 py-3 text-base text-(--color-text-primary)">
      <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}

function SkillsSection() {
  const { language } = useLanguage();
  const copy = getUI(language, "skills");
  const learning = language === "fa" ? learningNowFa : learningNow;
  const all = [...new Set(skillCategories.flatMap((category) => localize(category, language).skills))];
  const half = Math.ceil(all.length / 2);
  const rowA = all.slice(0, half);
  const rowB = all.slice(half);

  return (
    <Section id="skills" tone="teal">
      <SectionIntro eyebrow={copy.eyebrow} title={copy.title} highlight={copy.highlight} description={copy.description} />

      {/* Two endless rows moving in opposite directions: the stack, alive */}
      <Reveal className="-mx-6 mt-14 flex flex-col gap-3 md:-mx-10 md:mt-20">
        <Marquee duration={38}>{rowA.map((skill, i) => <SkillChip key={skill} label={skill} index={i} />)}</Marquee>
        <Marquee duration={44} reverse>{rowB.map((skill, i) => <SkillChip key={skill} label={skill} index={i + 3} />)}</Marquee>
      </Reveal>

      <div className="mt-10 grid gap-4 md:mt-14 md:grid-cols-2 md:gap-5">
        {skillCategories.map((category, index) => {
          const item = localize(category, language);
          return (
            <GlassCard key={category.name} as="article" tone={tones[index % tones.length]} delay={(index % 2) * 0.1} className="p-8 text-start md:p-9">
              <h3 className="font-display text-2xl font-bold leading-tight text-tone">{item.name}</h3>
              <p className="mt-2 font-sans text-base leading-relaxed text-(--color-text-secondary)">{item.description}</p>
              <ul className="mt-7 flex flex-wrap gap-2">
                {item.skills.map((skill) => (
                  <li key={skill} className="rounded-full px-3.5 py-1.5 font-sans text-sm text-(--color-text-primary)" style={{ background: "color-mix(in srgb, var(--tone) 16%, transparent)", boxShadow: "0 0 0 1px color-mix(in srgb, var(--tone) 30%, transparent) inset" }}>{skill}</li>
                ))}
              </ul>
            </GlassCard>
          );
        })}

        {/* "Currently learning" gets the rotating colour border */}
        <Reveal as="aside" delay={0.1} className="ring-border" style={{ "--r": "1.75rem" }}>
          <div className="relative flex h-full flex-col p-8 text-start md:p-9">
            <span className="pill w-fit text-(--color-text-primary)">
              <span aria-hidden="true" className="h-2 w-2 rounded-full" style={{ background: "var(--c-purple)" }} />
              {copy.exploring}
            </span>
            <h3 className="display-type mt-5 text-2xl text-(--color-text-primary)">{copy.exploringTitle}</h3>
            <ul className="mt-6">
              {learning.map((entry, i) => (
                <li key={entry} className="hairline-t flex items-center gap-3 py-3 font-sans text-base text-(--color-text-secondary)">
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full" style={{ background: dotColors[i % dotColors.length] }} />
                  {entry}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
export default SkillsSection;

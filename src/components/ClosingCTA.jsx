import { Link } from "react-router-dom";
import { getUI } from "../i18n.js";
import { useLanguage } from "../context/LanguageContext.jsx";
import Reveal from "./Reveal.jsx";
import Section from "./Section.jsx";

function ClosingCTA() {
  const { language } = useLanguage();
  const copy = getUI(language, "closing");
  return (
    <Section className="py-28 md:py-40">
      <Reveal className="mx-auto max-w-3xl text-center">
        <p className="font-sans text-[15px] font-semibold text-(--color-text-secondary) md:text-[17px]">{copy.eyebrow}</p>
        <h2 className="display-type mt-4 text-[clamp(2.25rem,6.5vw,4.5rem)] text-(--color-text-primary)">
          {copy.title} <span className="text-(--color-text-muted)">{copy.highlight}</span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl font-sans text-[17px] leading-relaxed text-(--color-text-secondary) md:text-[19px]">{copy.description}</p>
        <Link to="/contact" className="btn btn-primary mt-10">{copy.cta}</Link>
      </Reveal>
    </Section>
  );
}
export default ClosingCTA;

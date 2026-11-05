import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { getUI } from "../i18n.js";
import { useLanguage } from "../context/LanguageContext.jsx";
import Magnetic from "./Magnetic.jsx";
import Reveal from "./Reveal.jsx";
import Section from "./Section.jsx";
import WordReveal from "./WordReveal.jsx";

function ClosingCTA() {
  const { language } = useLanguage();
  const copy = getUI(language, "closing");
  return (
    <Section tone="purple" className="py-20 md:py-32">
      <Reveal className="ring-border" style={{ "--r": "2.5rem" }}>
        <div className="relative overflow-hidden px-6 py-20 text-center md:px-16 md:py-28" style={{ borderRadius: "2.5rem" }}>
          <div className="relative mx-auto max-w-3xl">
            <p className="pill mx-auto w-fit text-(--color-text-primary)">{copy.eyebrow}</p>
            <h2 className="display-type mt-6 text-[clamp(2.25rem,6.5vw,4.5rem)] text-(--color-text-primary)">
              <WordReveal text={copy.title} /> <WordReveal text={copy.highlight} wordClassName="text-aurora" delay={0.3} />
            </h2>
            <p className="mx-auto mt-6 max-w-xl font-sans text-[17px] leading-relaxed text-(--color-text-secondary) md:text-[19px]">{copy.description}</p>
            <Magnetic className="mt-10">
              <Link to="/contact" className="btn btn-primary">
                {copy.cta}
                <ArrowUpRight size={18} strokeWidth={2.2} aria-hidden="true" className="rtl:-scale-x-100" />
              </Link>
            </Magnetic>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
export default ClosingCTA;

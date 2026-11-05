import Reveal from "./Reveal.jsx";
import WordReveal from "./WordReveal.jsx";

/**
 * Section heading: a tinted eyebrow pill, a title that assembles word by
 * word, and a closing phrase in the section's own gradient.
 */
function SectionIntro({ eyebrow, title, highlight, description, align = "start", titleSize = "text-[clamp(2.1rem,5.4vw,3.75rem)]" }) {
  const centered = align === "center";
  return (
    <div className={`max-w-3xl ${centered ? "mx-auto text-center" : "text-start"}`}>
      {eyebrow && (
        <Reveal y={12}>
          <span className="pill text-(--color-text-primary)">
            <span aria-hidden="true" className="h-2 w-2 rounded-full" style={{ background: "var(--tone)" }} />
            {eyebrow}
          </span>
        </Reveal>
      )}
      <h2 className={`display-type mt-5 ${titleSize} text-(--color-text-primary)`}>
        <WordReveal text={title} />{" "}
        {highlight && <WordReveal text={highlight} wordClassName="text-tone" delay={0.25} />}
      </h2>
      {description && (
        <Reveal delay={0.2} y={16}>
          <p className={`mt-6 max-w-2xl font-sans text-[17px] leading-relaxed text-(--color-text-secondary) md:text-[19px] ${centered ? "mx-auto" : ""}`}>{description}</p>
        </Reveal>
      )}
    </div>
  );
}
export default SectionIntro;

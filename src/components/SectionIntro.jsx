import Reveal from "./Reveal.jsx";

/**
 * Section heading in a two-tone style: the lead phrase in the primary colour,
 * the closing phrase in a quieter grey. Alignment follows the surrounding
 * `dir`, so no per-language branching is needed.
 */
function SectionIntro({ eyebrow, title, highlight, description, align = "start" }) {
  const centered = align === "center";
  return (
    <Reveal className={`max-w-3xl ${centered ? "mx-auto text-center" : "text-start"}`}>
      {eyebrow && <p className="font-sans text-[15px] font-semibold text-(--color-text-secondary) md:text-[17px]">{eyebrow}</p>}
      <h2 className="display-type mt-3 text-[clamp(2rem,5.2vw,3.5rem)] text-(--color-text-primary)">
        {title} {highlight && <span className="text-(--color-text-muted)">{highlight}</span>}
      </h2>
      {description && <p className={`mt-5 font-sans text-[17px] leading-relaxed text-(--color-text-secondary) md:text-[19px] ${centered ? "mx-auto" : ""} max-w-2xl`}>{description}</p>}
    </Reveal>
  );
}
export default SectionIntro;

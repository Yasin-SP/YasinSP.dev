function ProjectImagePlaceholder({ index = 0, title }) {
  const number = String(index + 1).padStart(2, "0");

  return (
    <div
      dir="ltr"
      className="relative flex h-full w-full items-center justify-center overflow-hidden"
      style={{ background: "var(--color-surface)" }}
      aria-label={`${title} preview`}
    >
      <div className="flex flex-col items-center gap-2 px-6 text-center">
        <span className="font-sans text-xs text-(--color-text-muted)">{number}</span>
        <span className="font-display text-xl font-semibold text-(--color-text-primary) sm:text-2xl">{title}</span>
      </div>
    </div>
  );
}

export default ProjectImagePlaceholder;

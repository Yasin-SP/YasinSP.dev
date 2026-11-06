/**
 * Minimal, quiet backdrop: a fine dot grid that fades toward the edges and one
 * very soft overhead wash. Entirely static on purpose: no scroll-driven motion,
 * no blend modes, no film grain. A fixed layer that never changes is painted
 * once and then just composited, which is what keeps scrolling smooth on phones.
 */
export default function Backdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden" style={{ transform: "translateZ(0)", contain: "strict" }}>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, var(--grid-dot) 1px, transparent 1.4px)",
          backgroundSize: "32px 32px",
          WebkitMaskImage: "radial-gradient(ellipse 85% 70% at 50% 30%, #000 0%, transparent 100%)",
          maskImage: "radial-gradient(ellipse 85% 70% at 50% 30%, #000 0%, transparent 100%)",
        }}
      />
      <div className="absolute inset-x-0 top-0 h-[60vh]" style={{ background: "radial-gradient(ellipse 60% 100% at 50% 0%, var(--wash), transparent 75%)" }} />
    </div>
  );
}

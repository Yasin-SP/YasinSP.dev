function SkeletonBlock({ className = "" }) {
  return <div aria-hidden="true" className={`skeleton-block ${className}`} />;
}

export default function PageSkeleton({ variant = "page" }) {
  const isContact = variant === "contact";
  return (
    <main
      aria-label="Loading"
      aria-busy="true"
      className="min-h-[100svh] px-5 py-5 text-[var(--color-text-primary)] sm:px-8 md:px-10"
    >
      <div className="mx-auto w-full max-w-375">
        <div className="flex items-center justify-between">
          <SkeletonBlock className="h-10 w-24 rounded-full sm:h-12 sm:w-28" />
          <div className="flex items-center gap-2">
            <SkeletonBlock className="h-10 w-10 rounded-full sm:h-11 sm:w-11" />
            <SkeletonBlock className="h-10 w-24 rounded-full" />
          </div>
        </div>

        {isContact ? (
          <div className="grid min-h-[calc(100svh-7rem)] items-center gap-10 py-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(520px,0.9fr)] lg:gap-16">
            <section className="space-y-5">
              <SkeletonBlock className="h-3 w-36 rounded-full" />
              <SkeletonBlock className="h-28 w-[min(80vw,620px)] rounded-3xl" />
              <SkeletonBlock className="h-4 w-[min(70vw,520px)] rounded-full" />
              <SkeletonBlock className="h-10 w-48 rounded-full" />
            </section>
            <section className="rounded-[1.6rem] border p-5 sm:p-7" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
              <div className="mb-6 flex justify-between gap-5">
                <div className="flex-1 space-y-3"><SkeletonBlock className="h-2.5 w-20 rounded-full" /><SkeletonBlock className="h-8 w-64 rounded-xl" /></div>
                <SkeletonBlock className="h-10 w-10 rounded-full" />
              </div>
              <div className="mb-6 grid grid-cols-3 gap-2"><SkeletonBlock className="h-1 rounded-full" /><SkeletonBlock className="h-1 rounded-full" /><SkeletonBlock className="h-1 rounded-full" /></div>
              <div className="grid gap-3 sm:grid-cols-2">
                <SkeletonBlock className="h-16 rounded-xl sm:col-span-2" />
                <SkeletonBlock className="h-14 rounded-xl" /><SkeletonBlock className="h-14 rounded-xl" />
                <SkeletonBlock className="h-14 rounded-xl" /><SkeletonBlock className="h-14 rounded-xl" />
              </div>
              <div className="mt-6 flex justify-end"><SkeletonBlock className="h-12 w-36 rounded-full" /></div>
            </section>
          </div>
        ) : (
          <div className="pt-20 md:pt-24">
            <section className="grid min-h-[calc(100svh-9rem)] items-center gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.72fr)]">
              <div className="space-y-5">
                <SkeletonBlock className="h-3 w-64 rounded-full" />
                <SkeletonBlock className="h-36 w-[min(90vw,760px)] rounded-3xl" />
                <SkeletonBlock className="h-6 w-[min(80vw,620px)] rounded-full" />
                <SkeletonBlock className="h-4 w-[min(72vw,560px)] rounded-full" />
                <div className="flex gap-3"><SkeletonBlock className="h-12 w-44 rounded-full" /><SkeletonBlock className="h-12 w-40 rounded-full" /></div>
              </div>
              <SkeletonBlock className="mx-auto hidden aspect-square w-full max-w-md rounded-[2rem] lg:block" />
            </section>
            <div className="grid gap-5 md:grid-cols-3">
              <SkeletonBlock className="h-36 rounded-2xl" /><SkeletonBlock className="h-36 rounded-2xl" /><SkeletonBlock className="h-36 rounded-2xl" />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

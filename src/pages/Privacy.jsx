import { ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext.jsx";
import { getUI } from "../i18n.js";

function Privacy() {
  const { language } = useLanguage();
  const copy = getUI(language, "privacy");
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    if (location.state?.fromContact && window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate("/");
  };
  return (
    <main
      id="main-content"
      className="standalone-page min-h-svh px-6 py-8 sm:px-10 lg:px-16"
      style={{ color: "var(--color-text-primary)" }}
    >
      <div className="mx-auto max-w-3xl">
        <header className="flex items-center justify-end">
          <button
            type="button"
            onClick={handleBack}
            className="btn btn-secondary btn-sm"
          >
            <ArrowLeft size={14} /> {copy.back}
          </button>
        </header>
        <article
          dir={language === "fa" ? "rtl" : "ltr"}
          className={`py-20 ${language === "fa" ? "text-right" : "text-left"}`}
        >
          <p className="font-sans text-[15px] font-medium text-(--color-text-muted)">
            {copy.label}
          </p>
          <h1 className="display-type mt-4 text-4xl sm:text-6xl">
            {copy.title}
          </h1>
          <p className="mt-6 font-sans text-[17px] leading-8 text-(--color-text-secondary)">
            {copy.intro}
          </p>
          <div className="mt-12 space-y-10 font-sans text-base leading-8 text-(--color-text-secondary)">
            {[
              ["form", copy.formText],
              ["processing", copy.processingText],
              ["theme", copy.themeText],
              ["tracking", copy.trackingText],
            ].map(([key, text]) => (
              <section key={key}>
                <h2 className="font-display text-xl font-semibold text-(--color-text-primary)">
                  {copy[key]}
                </h2>
                <p className="mt-3">{text}</p>
              </section>
            ))}
            <p className="border-t pt-6 text-xs text-(--color-text-muted)" style={{ borderColor: "var(--color-border)" }}>
              {copy.disclaimer}
            </p>
          </div>
        </article>
      </div>
    </main>
  );
}
export default Privacy;

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { safeStorageGet, safeStorageSet } from "../lib/safeStorage.js";

const LanguageContext = createContext(null);
const languages = { en: { code: "en", dir: "ltr" }, fa: { code: "fa", dir: "rtl" } };

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    if (typeof window === "undefined") return "en";
    const saved = safeStorageGet("language");
    return saved === "fa" || saved === "en" ? saved : "en";
  });

  useEffect(() => {
    const lang = languages[language];
    document.documentElement.lang = lang.code;
    // Keep the site's structural canvas LTR. Persian copy opts into RTL locally.
    document.documentElement.dir = "ltr";
    document.documentElement.dataset.language = lang.code;
    document.body.dataset.language = lang.code;
    safeStorageSet("language", language);
  }, [language]);

  const value = useMemo(() => ({
    language,
    direction: languages[language].dir,
    isRTL: language === "fa",
    setLanguage,
    toggleLanguage: () => setLanguage((current) => current === "en" ? "fa" : "en"),
  }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function localize(item, language) {
  if (!item) return item;
  if (language === "fa" && item.fa) return { ...item, ...item.fa };
  return item;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}

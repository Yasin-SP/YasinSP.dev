(() => {
  const root = document.documentElement;
  const readPreference = (key) => {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  };

  const savedLanguage = readPreference("language");
  const language = savedLanguage === "en" || savedLanguage === "fa" ? savedLanguage : "fa";
  root.lang = language;
  root.dir = language === "fa" ? "rtl" : "ltr";
  root.dataset.language = language;

  const savedTheme = readPreference("theme");
  const theme = savedTheme === "dark" || savedTheme === "light"
    ? savedTheme
    : window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  root.dataset.theme = theme;
})();
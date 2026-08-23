import { lazy, Suspense, useEffect, useRef } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { MotionConfig } from "motion/react";
import "./App.css";
import Header from "./components/Header";
import Background from "./components/Background";
import PageSkeleton from "./components/PageSkeleton.jsx";
import { useSmoothScroll } from "./hooks/useSmoothScroll.js";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { LanguageProvider, useLanguage } from "./context/LanguageContext.jsx";

const Home = lazy(() => import("./pages/Home.jsx"));
const Contact = lazy(() => import("./pages/Contact.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));
const Privacy = lazy(() => import("./pages/Privacy.jsx"));

const routeMetadata = {
  "/": {
    en: {
      title: "Yasin — Front-End Developer",
      description: "Yasin builds modern React interfaces with responsive engineering, thoughtful visual detail, and purposeful motion.",
    },
    fa: {
      title: "یاسین — توسعه‌دهنده فرانت‌اند",
      description: "پورتفولیوی یاسین؛ توسعه رابط‌های مدرن React با مهندسی ریسپانسیو، جزئیات بصری و موشن هدفمند.",
    },
  },
  "/contact": {
    en: {
      title: "Contact Yasin — Projects & Collaboration",
      description: "Send Yasin a structured project, collaboration, or work request through the secure contact form.",
    },
    fa: {
      title: "ارتباط با یاسین — پروژه و همکاری",
      description: "درخواست پروژه، همکاری یا پیشنهاد کاری خود را از طریق فرم امن و دسته‌بندی‌شده برای یاسین ارسال کنید.",
    },
  },
  "/privacy": {
    en: {
      title: "Privacy — Yasin Portfolio",
      description: "How this portfolio handles contact details, local preferences, and visitor privacy.",
    },
    fa: {
      title: "حریم خصوصی — پورتفولیوی یاسین",
      description: "نحوه مدیریت اطلاعات تماس، تنظیمات محلی و حریم خصوصی بازدیدکنندگان در این پورتفولیو.",
    },
  },
};

function RouteMetadata() {
  const { pathname } = useLocation();
  const { language } = useLanguage();

  useEffect(() => {
    const normalizedPath = pathname.length > 1 ? pathname.replace(/\/+$/, "") : "/";
    const isKnownRoute = Boolean(routeMetadata[normalizedPath]);
    const metadata = isKnownRoute
      ? routeMetadata[normalizedPath][language]
      : language === "fa"
        ? { title: "صفحه پیدا نشد — یاسین", description: "صفحه‌ای که دنبالش بودید پیدا نشد." }
        : { title: "Page Not Found — Yasin", description: "The page you requested could not be found." };

    document.title = metadata.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", metadata.description);
    document.querySelector('meta[name="robots"]')?.setAttribute("content", isKnownRoute ? "index, follow" : "noindex, nofollow");
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", metadata.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", metadata.description);
    document.querySelector('meta[property="og:locale"]')?.setAttribute("content", language === "fa" ? "fa_IR" : "en_US");
    document.querySelector('meta[name="twitter:title"]')?.setAttribute("content", metadata.title);
    document.querySelector('meta[name="twitter:description"]')?.setAttribute("content", metadata.description);
  }, [language, pathname]);

  return null;
}

function RouteFocus() {
  const location = useLocation();
  const previousPath = useRef(location.pathname);

  useEffect(() => {
    if (previousPath.current === location.pathname) return undefined;
    previousPath.current = location.pathname;

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    const focusMain = () => {
      const main = document.querySelector("#main-content");
      if (!main) return false;
      main.setAttribute("tabindex", "-1");
      main.focus({ preventScroll: true });
      return true;
    };

    if (focusMain()) return undefined;
    const observer = new MutationObserver(() => {
      if (focusMain()) observer.disconnect();
    });
    observer.observe(document.getElementById("root"), { childList: true, subtree: true });
    const timeout = window.setTimeout(() => observer.disconnect(), 3000);
    return () => {
      observer.disconnect();
      window.clearTimeout(timeout);
    };
  }, [location.pathname]);

  return null;
}

function AppShell() {
  const location = useLocation();
  const isContact = location.pathname === "/contact";
  const isHome = location.pathname === "/";
  const isStandalone = !isHome;

  useSmoothScroll(!isStandalone);

  return (
    <div className="relative min-h-screen bg-background">
      {!isStandalone && <Background />}
      <div className="relative z-10">
        <a href="#main-content" className="skip-link">Skip to content</a>
        {!isStandalone && <Header />}
        <Suspense fallback={<PageSkeleton variant={isContact ? "contact" : "page"} />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <RouteFocus />
          <RouteMetadata />
        </Suspense>
      </div>
    </div>
  );
}

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <ThemeProvider>
        <LanguageProvider>
          <BrowserRouter>
            <AppShell />
          </BrowserRouter>
        </LanguageProvider>
      </ThemeProvider>
    </MotionConfig>
  );
}

export default App;

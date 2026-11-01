import { useEffect, useId, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  Check,
  CircleHelp,
  Code2,
  Handshake,
  LoaderCircle,
  Mail,
  MessageCircle,
  Moon,
  Phone,
  Send,
  Sun,
} from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../assets/Signature.svg";
import { smoothEase } from "../constants/theme.js";
import { useTheme } from "../context/ThemeContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import { getUI } from "../i18n.js";
import LanguageToggle from "../components/LanguageToggle.jsx";
import GithubIcon from "../components/icons/GithubIcon.jsx";
import LinkedinIcon from "../components/icons/LinkedinIcon.jsx";
import TelegramIcon from "../components/icons/TelegramIcon.jsx";
import { socialLinks } from "../data/socials.js";

const SOCIAL_ICONS = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  telegram: TelegramIcon,
  email: Mail,
};

const API_ENDPOINT = "/api/contact";
const MAX = { name: 80, contact: 160, message: 2000 };
const CATEGORY_ICONS = {
  website: Code2,
  collaboration: Handshake,
  employment: BriefcaseBusiness,
  consultation: MessageCircle,
  other: CircleHelp,
};
const CONTACT_ICONS = {
  email: Mail,
  phone: Phone,
  telegram: Send,
  whatsapp: MessageCircle,
  other: CircleHelp,
};

function ContactThemeToggle() {
  const { theme, toggleThemeAtPoint } = useTheme();
  return (
    <motion.button
      type="button"
      onClick={(event) => toggleThemeAtPoint(event.clientX, event.clientY)}
      whileTap={{ scale: 0.94 }}
      aria-label={
        theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
      }
      className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-colors duration-300 hover:bg-(--color-surface-hover)"
      style={{
        color: "var(--contact-text)",
        background: "var(--color-surface)",
      }}
    >
      <motion.span
        key={theme}
        initial={{ rotate: -70, opacity: 0, scale: 0.7 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: smoothEase }}
      >
        {theme === "dark" ? <Moon size={17} /> : <Sun size={17} />}
      </motion.span>
    </motion.button>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
  textarea = false,
  type = "text",
  autoComplete,
  inputMode,
  maxLength,
  forceLTR = false,
}) {
  const { isRTL } = useLanguage();
  const id = useId();
  const Tag = textarea ? "textarea" : "input";
  return (
    <label
      htmlFor={id}
      dir={isRTL ? "rtl" : "ltr"}
      className={`group block ${textarea ? "md:col-span-2" : ""}`}
    >
      <span
        className="mb-2 block font-sans text-xs font-medium"
        style={{ color: "var(--contact-text-muted)" }}
      >
        {label}
      </span>
      <Tag
        id={id}
        data-field={name}
        name={name}
        value={value}
        onChange={onChange}
        type={textarea ? undefined : type}
        rows={textarea ? 4 : undefined}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        maxLength={maxLength}
        dir={forceLTR ? "ltr" : undefined}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`contact-input w-full resize-none rounded-xl border px-4 py-3.5 font-sans text-base outline-none transition-all duration-300 focus:border-(--accent-fill) focus:shadow-[0_0_0_4px_var(--accent-ring)] ${forceLTR ? "contact-input-ltr" : ""}`}
        style={{
          color: "var(--contact-text)",
          borderColor: error
            ? "rgba(248,113,113,.55)"
            : "var(--contact-border)",
          background: "var(--contact-bg-elevated)",
        }}
      />
      {error ? (
        <span
          id={`${id}-error`}
          role="alert"
          className="mt-1.5 block font-sans text-xs text-red-400"
        >
          {error}
        </span>
      ) : null}
    </label>
  );
}

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  placeholder,
  error,
}) {
  const { isRTL } = useLanguage();
  const { theme } = useTheme();
  const id = useId();
  return (
    <label htmlFor={id} dir={isRTL ? "rtl" : "ltr"} className="block">
      <span
        className="mb-2 block font-sans text-xs font-medium"
        style={{ color: "var(--contact-text-muted)" }}
      >
        {label}
      </span>
      <select
        id={id}
        data-field={name}
        name={name}
        value={value}
        onChange={onChange}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className="contact-input min-h-12 w-full rounded-xl border px-4 py-3 font-sans text-base outline-none focus:border-(--accent-fill) focus:shadow-[0_0_0_4px_var(--accent-ring)]"
        style={{
          color: "var(--contact-text)",
          borderColor: error
            ? "rgba(248,113,113,.65)"
            : "var(--contact-border)",
          background: "var(--contact-bg-elevated)",
          colorScheme: theme === "dark" ? "dark" : "light",
        }}
      >
        <option value="" disabled hidden>
          {placeholder}
        </option>
        {options.map((o) => (
          <option
            key={o.value}
            value={o.value}
            style={{
              color: "var(--contact-popup-text)",
              backgroundColor: "var(--contact-popup-bg)",
            }}
          >
            {o.label}
          </option>
        ))}
      </select>
      {error ? (
        <span
          id={`${id}-error`}
          role="alert"
          className="mt-1.5 block font-sans text-xs text-red-400"
        >
          {error}
        </span>
      ) : null}
    </label>
  );
}

function ChoiceGrid({
  legend,
  name,
  value,
  onChange,
  options,
  icons,
  error,
  columns = "sm:grid-cols-2",
}) {
  const { isRTL } = useLanguage();
  return (
    <fieldset data-field={name} className="md:col-span-2">
      <legend
        dir={isRTL ? "rtl" : "ltr"}
        className="mb-3 w-full font-sans text-xs font-medium"
        style={{ color: "var(--contact-text-muted)" }}
      >
        {legend}
      </legend>
      <div className={`grid grid-cols-1 gap-2.5 ${columns}`}>
        {options.map((o) => {
          const Icon = icons?.[o.value];
          const active = value === o.value;
          return (
            <label key={o.value} className="relative cursor-pointer">
              <input
                type="radio"
                name={name}
                value={o.value}
                checked={active}
                onChange={onChange}
                className="peer sr-only"
              />
              <span
                className="flex min-h-14 items-center gap-3 rounded-xl border px-4 py-3 font-sans text-sm transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-(--accent-fill)"
                style={{
                  borderColor: active
                    ? "var(--accent-fill)"
                    : "var(--contact-border)",
                  background: active
                    ? "var(--accent-surface)"
                    : "var(--contact-bg-elevated)",
                  color: active
                    ? "var(--contact-text)"
                    : "var(--contact-text-soft)",
                }}
              >
                {Icon ? (
                  <Icon
                    size={17}
                    className={`shrink-0 ${active ? "text-(--accent-text)" : "opacity-60"}`}
                  />
                ) : null}
                <span
                  dir={isRTL ? "rtl" : "ltr"}
                  className="min-w-0 text-start"
                >
                  <span className="block font-medium">{o.label}</span>
                  {o.description ? (
                    <span className="mt-0.5 block text-xs leading-relaxed opacity-70">
                      {o.description}
                    </span>
                  ) : null}
                </span>
                {active ? (
                  <Check
                    size={15}
                    className="ms-auto shrink-0 text-(--accent-text)"
                  />
                ) : null}
              </span>
            </label>
          );
        })}
      </div>
      {error ? (
        <p
          role="alert"
          dir={isRTL ? "rtl" : "ltr"}
          className="mt-2 font-sans text-xs text-red-400"
        >
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}

function MultiChoiceGrid({
  legend,
  name,
  values,
  onChange,
  options,
  icons,
  error,
  columns = "grid-cols-2 sm:grid-cols-3",
}) {
  const { isRTL } = useLanguage();
  return (
    <fieldset data-field={name} className="md:col-span-2">
      <legend
        dir={isRTL ? "rtl" : "ltr"}
        className="mb-3 w-full font-sans text-xs font-medium"
        style={{ color: "var(--contact-text-muted)" }}
      >
        {legend}
      </legend>
      <div className={`grid grid-cols-1 gap-2.5 ${columns}`}>
        {options.map((o) => {
          const Icon = icons?.[o.value];
          const active = values.includes(o.value);
          return (
            <label key={o.value} className="relative cursor-pointer">
              <input
                type="checkbox"
                name={name}
                value={o.value}
                checked={active}
                onChange={() => onChange(o.value)}
                className="peer sr-only"
              />
              <span
                className="flex min-h-14 items-center gap-3 rounded-xl border px-4 py-3 font-sans text-sm transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-(--accent-fill)"
                style={{
                  borderColor: active
                    ? "var(--accent-fill)"
                    : "var(--contact-border)",
                  background: active
                    ? "var(--accent-surface)"
                    : "var(--contact-bg-elevated)",
                  color: active
                    ? "var(--contact-text)"
                    : "var(--contact-text-soft)",
                }}
              >
                {Icon ? (
                  <Icon
                    size={17}
                    className={`shrink-0 ${active ? "text-(--accent-text)" : "opacity-60"}`}
                  />
                ) : null}
                <span
                  dir={isRTL ? "rtl" : "ltr"}
                  className="min-w-0 text-start"
                >
                  <span className="block font-medium">{o.label}</span>
                </span>
                {active ? (
                  <Check
                    size={15}
                    className="ms-auto shrink-0 text-(--accent-text)"
                  />
                ) : null}
              </span>
            </label>
          );
        })}
      </div>
      {error ? (
        <p
          role="alert"
          dir={isRTL ? "rtl" : "ltr"}
          className="mt-2 font-sans text-xs text-red-400"
        >
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}

function Contact() {
  const { language, isRTL } = useLanguage();
  const copy = getUI(language, "contact");
  const reduceMotion = useReducedMotion();
  const emptyForm = {
    category: "",
    name: "",
    contactMethods: [],
    contactDetails: {},
    message: "",
    projectType: "",
    budget: "",
    timeline: "",
    company: "",
    role: "",
    website: "",
    honeypot: "",
  };
  const CONTACT_DRAFT_KEY = "yasin-contact-draft-v1";

  const [step, setStep] = useState(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(CONTACT_DRAFT_KEY) || "null");
      return saved?.step >= 1 && saved?.step <= 3 ? saved.step : 1;
    } catch {
      return 1;
    }
  });
  const [form, setForm] = useState(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(CONTACT_DRAFT_KEY) || "null");
      if (!saved?.form || typeof saved.form !== "object") return emptyForm;
      return {
        ...emptyForm,
        ...saved.form,
        contactMethods: Array.isArray(saved.form.contactMethods)
          ? saved.form.contactMethods
          : [],
        contactDetails:
          saved.form.contactDetails && typeof saved.form.contactDetails === "object"
            ? saved.form.contactDetails
            : {},
        honeypot: "",
      };
    } catch {
      return emptyForm;
    }
  });
  const restoredDraftRef = useRef(false);
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const formRef = useRef(null);
  const abortRef = useRef(null);
  const startedAtRef = useRef(Date.now());

  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(CONTACT_DRAFT_KEY) || "null");
      restoredDraftRef.current = Boolean(saved?.form && saved?.step === 3);
    } catch {
      restoredDraftRef.current = false;
    }
  }, []);

  useEffect(() => {
    if (status === "success") {
      sessionStorage.removeItem(CONTACT_DRAFT_KEY);
      return;
    }

    try {
      sessionStorage.setItem(
        CONTACT_DRAFT_KEY,
        JSON.stringify({
          step,
          form: { ...form, honeypot: "" },
          savedAt: Date.now(),
        }),
      );
    } catch {
      // Storage can be unavailable; the form still works normally.
    }
  }, [form, step, status]);

  useEffect(() => {
    if (!restoredDraftRef.current || step !== 3) return;

    const scrollToForm = () => {
      document.getElementById("contact-step-title")?.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "center",
      });
    };

    const firstFrame = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(scrollToForm);
    });

    return () => window.cancelAnimationFrame(firstFrame);
  }, [reduceMotion, step]);

  const categoryOptions = Object.entries(copy.categories).map(
    ([value, item]) => ({ value, ...item }),
  );
  const contactOptions = Object.entries(copy.contactMethods).map(
    ([value, item]) => ({
      value,
      label: item.label || item,
      description: item.description,
    }),
  );
  const options = (items) =>
    Object.entries(items).map(([value, label]) => ({ value, label }));

  const selectCategory = (event) => {
    const value = event.target.value;
    setStatus("idle");
    setErrorMessage("");
    setFieldErrors({});
    setForm((current) => ({
      ...current,
      category: value,
      projectType: "",
      budget: "",
      timeline: "",
      company: "",
      role: "",
      website: "",
    }));
    window.requestAnimationFrame(() => {
      setStep(2);
      window.requestAnimationFrame(() => document.getElementById("contact-step-title")?.focus());
    });
  };

  const update = (field) => (event) => {
    const value = event.target.value;
    setStatus("idle");
    setErrorMessage("");
    setFieldErrors((current) =>
      field === "category" ? {} : { ...current, [field]: "" },
    );
    setForm((current) =>
      field === "category"
        ? {
            ...current,
            category: value,
            projectType: "",
            budget: "",
            timeline: "",
            company: "",
            role: "",
            website: "",
          }
        : { ...current, [field]: value },
    );
  };
  const toggleContactMethod = (method) => {
    setStatus("idle");
    setErrorMessage("");
    setFieldErrors((current) => ({
      ...current,
      contactMethods: "",
      [`contact.${method}`]: "",
    }));
    setForm((current) => {
      const active = current.contactMethods.includes(method);
      const contactMethods = active
        ? current.contactMethods.filter((item) => item !== method)
        : [...current.contactMethods, method];
      const contactDetails = { ...current.contactDetails };
      if (active) delete contactDetails[method];
      return { ...current, contactMethods, contactDetails };
    });
  };
  const updateContactDetail = (method) => (event) => {
    const value = event.target.value;
    setStatus("idle");
    setErrorMessage("");
    setFieldErrors((current) => ({ ...current, [`contact.${method}`]: "" }));
    setForm((current) => ({
      ...current,
      contactDetails: { ...current.contactDetails, [method]: value },
    }));
  };
  const focusFirst = (errors) => {
    const first = Object.keys(errors)[0];
    window.requestAnimationFrame(() => {
      const field = formRef.current?.querySelector(`[data-field="${first}"]`);
      (field?.matches("fieldset")
        ? field.querySelector("input:not([disabled])")
        : field
      )?.focus();
    });
  };
  const validate = (targetStep) => {
    const errors = {};
    if (targetStep === 1 && !form.category)
      errors.category = copy.requiredChoice;
    if (targetStep === 2) {
      if (form.category === "website") {
        if (!form.projectType) errors.projectType = copy.requiredChoice;
        if (!form.timeline) errors.timeline = copy.requiredChoice;
      }
      if (
        ["collaboration", "employment"].includes(form.category) &&
        form.company.trim().length < 2
      )
        errors.company = copy.companyError;
      if (["collaboration", "employment"].includes(form.category) && !form.role)
        errors.role = copy.requiredChoice;
      if (form.category === "consultation" && !form.projectType)
        errors.projectType = copy.requiredChoice;
      if (form.website.trim()) {
        try {
          const url = new URL(form.website.trim());
          if (!["http:", "https:"].includes(url.protocol))
            errors.website = copy.websiteError;
        } catch {
          errors.website = copy.websiteError;
        }
      }
    }
    if (targetStep === 3) {
      if (form.name.trim().length < 2) errors.name = copy.nameError;
      if (!form.contactMethods.length)
        errors.contactMethods = copy.requiredContactMethod;
      for (const method of form.contactMethods) {
        const contact = String(form.contactDetails[method] || "").trim();
        const compact = contact.replace(/[\s().-]/g, "");
        if (
          method === "email" &&
          !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(contact)
        )
          errors[`contact.${method}`] = copy.emailError;
        else if (
          ["phone", "whatsapp"].includes(method) &&
          !/^\+?[0-9]{7,15}$/.test(compact)
        )
          errors[`contact.${method}`] = copy.phoneError;
        else if (
          method === "telegram" &&
          !/^@[A-Za-z0-9_]{5,32}$/.test(contact)
        )
          errors[`contact.${method}`] = copy.telegramError;
        else if (method === "other" && contact.length < 4)
          errors[`contact.${method}`] = copy.contactError;
      }
      if (form.message.trim().length < 10) errors.message = copy.messageError;
    }
    setFieldErrors(errors);
    if (Object.keys(errors).length) {
      setStatus("error");
      setErrorMessage(copy.invalidFields);
      focusFirst(errors);
      return false;
    }
    return true;
  };
  const nextStep = () => {
    if (!validate(step)) return;
    setStatus("idle");
    setStep((current) => Math.min(3, current + 1));
    window.requestAnimationFrame(() =>
      document.getElementById("contact-step-title")?.focus(),
    );
  };

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");
    if (!validate(3)) return;
    if (form.honeypot) {
      setStatus("success");
      return;
    }
    setStatus("submitting");
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const timeoutId = window.setTimeout(() => controller.abort(), 15000);
    const payload = {
      category: form.category,
      name: form.name.trim(),
      contactMethods: form.contactMethods,
      contactDetails: Object.fromEntries(
        form.contactMethods.map((method) => [
          method,
          String(form.contactDetails[method] || "").trim(),
        ]),
      ),
      message: form.message.trim(),
      projectType: form.projectType || undefined,
      budget: form.budget || undefined,
      timeline: form.timeline || undefined,
      company: form.company.trim() || undefined,
      role: form.role || undefined,
      locale: language,
      website: form.website.trim() || undefined,
      honeypot: "",
      formStartedAt: startedAtRef.current,
    };
    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
        credentials: "same-origin",
      });
      if (!response.ok) throw new Error("request_failed");
      setStatus("success");
      setFieldErrors({});
      setForm(emptyForm);
      setStep(1);
      sessionStorage.removeItem(CONTACT_DRAFT_KEY);
      startedAtRef.current = Date.now();
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error?.name === "AbortError" ? copy.timeout : copy.failed,
      );
    } finally {
      window.clearTimeout(timeoutId);
      if (abortRef.current === controller) abortRef.current = null;
    }
  }

  let detailFields;
  if (form.category === "website")
    detailFields = (
      <>
        <SelectField
          label={copy.projectType}
          name="projectType"
          value={form.projectType}
          onChange={update("projectType")}
          placeholder={copy.selectPlaceholder}
          options={options(copy.projectTypes)}
          error={fieldErrors.projectType}
        />
        <SelectField
          label={copy.budget}
          name="budget"
          value={form.budget}
          onChange={update("budget")}
          placeholder={copy.optional}
          options={options(copy.budgets)}
        />
        <SelectField
          label={copy.timeline}
          name="timeline"
          value={form.timeline}
          onChange={update("timeline")}
          placeholder={copy.selectPlaceholder}
          options={options(copy.timelines)}
          error={fieldErrors.timeline}
        />
        <Field
          label={copy.website}
          name="website"
          value={form.website}
          onChange={update("website")}
          placeholder={copy.websitePlaceholder}
          type="url"
          autoComplete="url"
          error={fieldErrors.website}
        />{" "}
      </>
    );
  else if (["collaboration", "employment"].includes(form.category))
    detailFields = (
      <>
        <Field
          label={copy.company}
          name="company"
          value={form.company}
          onChange={update("company")}
          placeholder={copy.companyPlaceholder}
          autoComplete="organization"
          error={fieldErrors.company}
        />
        <SelectField
          label={copy.role}
          name="role"
          value={form.role}
          onChange={update("role")}
          placeholder={copy.selectPlaceholder}
          options={options(
            form.category === "employment"
              ? copy.employmentModels
              : copy.collaborationModels,
          )}
          error={fieldErrors.role}
        />
        <SelectField
          label={copy.timeline}
          name="timeline"
          value={form.timeline}
          onChange={update("timeline")}
          placeholder={copy.optional}
          options={options(copy.timelines)}
        />
        <Field
          label={copy.website}
          name="website"
          value={form.website}
          onChange={update("website")}
          placeholder={copy.companyWebsitePlaceholder}
          type="url"
          autoComplete="url"
          error={fieldErrors.website}
        />{" "}
      </>
    );
  else if (form.category === "consultation")
    detailFields = (
      <>
        <SelectField
          label={copy.consultationTopic}
          name="projectType"
          value={form.projectType}
          onChange={update("projectType")}
          placeholder={copy.selectPlaceholder}
          options={options(copy.consultationTopics)}
          error={fieldErrors.projectType}
        />
        <SelectField
          label={copy.timeline}
          name="timeline"
          value={form.timeline}
          onChange={update("timeline")}
          placeholder={copy.optional}
          options={options(copy.timelines)}
        />
        <Field
          label={copy.website}
          name="website"
          value={form.website}
          onChange={update("website")}
          placeholder={copy.websitePlaceholder}
          type="url"
          autoComplete="url"
          error={fieldErrors.website}
        />{" "}
      </>
    );
  else
    detailFields = (
      <Field
        label={copy.website}
        name="website"
        value={form.website}
        onChange={update("website")}
        placeholder={copy.websitePlaceholder}
        type="url"
        autoComplete="url"
        error={fieldErrors.website}
      />
    );

  const isSubmitting = status === "submitting";
  const stepTitle = [copy.intentTitle, copy.detailsTitle, copy.contactTitle][
    step - 1
  ];
  return (
    <main
      id="main-content"
      className="contact-page relative min-h-svh overflow-hidden"
    >
      <div className="relative z-10 mx-auto flex min-h-svh w-full max-w-375 flex-col px-5 pb-6 pt-5 sm:px-8 md:px-10 lg:px-14">
        <header className="flex shrink-0 items-center justify-between gap-3">
          <Link
            to="/"
            aria-label={copy.homeLabel}
            className="flex h-10 w-24 items-center justify-center sm:h-12 sm:w-28"
          >
          </Link>
          <div className="flex items-center gap-2" dir="ltr">
            <ContactThemeToggle />
            <Link
              to="/"
              className="group inline-flex items-center gap-2 rounded-full px-4 py-2.5 font-sans text-[13px] transition-colors duration-300 hover:bg-(--color-surface-hover)"
              style={{
                color: "var(--contact-text-soft)",
                borderColor: "var(--contact-border)",
                background: "var(--contact-bg-elevated)",
              }}
            >
              <ArrowLeft
                size={14}
                className="transition-transform duration-300 group-hover:-translate-x-0.5"
              />{" "}
              {copy.back}
            </Link>
          </div>
        </header>
        <div className="flex flex-1 items-center py-8 sm:py-10 lg:py-8">
          <div className="grid w-full grid-cols-1 items-center gap-9 lg:grid-cols-[minmax(0,0.9fr)_minmax(520px,0.9fr)] lg:gap-16 xl:gap-24">
            <section
              dir={isRTL ? "rtl" : "ltr"}
              className={`max-w-2xl ${isRTL ? "text-right" : "text-left"}`}
            >
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, ease: smoothEase }}
              >
                <span className="inline-flex items-center gap-2 font-sans text-[15px] font-medium" style={{ color: "var(--contact-text-soft)" }}>
                  <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />{" "}
                  {copy.open}
                </span>
                <h1
                  className="display-type mt-5 max-w-[12ch] text-[clamp(2.6rem,6.2vw,5rem)]"
                >
                  {copy.title}{" "}
                  <span style={{ color: "var(--contact-text-muted)" }}>
                    {copy.highlight}
                  </span>
                </h1>
                <p
                  className="mt-5 max-w-xl font-sans text-base leading-relaxed md:text-[17px]"
                  style={{ color: "var(--contact-text-soft)" }}
                >
                  {copy.body}
                </p>
              </motion.div>
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, ease: smoothEase, delay: 0.12 }}
                className="mt-7 flex flex-wrap gap-2.5"
              >
                <span
                  className="inline-flex items-center rounded-full border px-4 py-2.5 font-sans text-[13px]"
                  style={{
                    color: "var(--contact-text-muted)",
                    borderColor: "var(--contact-border)",
                  }}
                >
                  {copy.response}
                </span>
              </motion.div>
              {socialLinks.length > 0 ? (
                <motion.div
                  initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.65, ease: smoothEase, delay: 0.2 }}
                  className="mt-6"
                >
                  <span
                    className="mb-3 block font-sans text-xs font-medium"
                    style={{ color: "var(--contact-text-muted)" }}
                  >
                    {copy.connectDirect}
                  </span>
                  <div className="flex flex-wrap gap-2.5" dir="ltr">
                    {socialLinks.map((social) => {
                      const Icon = SOCIAL_ICONS[social.type];
                      return (
                        <a
                          key={social.label}
                          href={social.href}
                          target={social.type !== "email" ? "_blank" : undefined}
                          rel={social.type !== "email" ? "noopener noreferrer" : undefined}
                          className="group inline-flex items-center gap-2 rounded-full px-4 py-2.5 font-sans text-[13px] transition-colors duration-300 hover:bg-(--color-surface-hover)"
                          style={{
                            color: "var(--contact-text-soft)",
                            borderColor: "var(--contact-border)",
                            background: "var(--contact-bg-elevated)",
                          }}
                        >
                          <Icon size={14} className="opacity-70 transition-opacity duration-300 group-hover:opacity-100" />
                          {social.label}
                        </a>
                      );
                    })}
                  </div>
                </motion.div>
              ) : null}
            </section>
            <motion.section
              initial={
                reduceMotion ? false : { opacity: 0, y: 28, scale: 0.985 }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, ease: smoothEase, delay: 0.18 }}
              className="relative"
              aria-labelledby="contact-step-title"
            >
              <div
                className="relative overflow-hidden rounded-[1.75rem] border p-5 sm:p-8"
                style={{
                  borderColor: "var(--contact-border)",
                  background: "var(--contact-bg-elevated)",
                  boxShadow: "0 20px 60px var(--contact-shadow)",
                }}
              >
                <div
                  className="mb-6 flex items-start justify-between gap-5"
                  dir="ltr"
                >
                  <div
                    dir={isRTL ? "rtl" : "ltr"}
                    className={`min-w-0 flex-1 ${isRTL ? "text-right" : "text-left"}`}
                  >
                    <span
                      className="block font-sans text-xs font-medium"
                      style={{ color: "var(--contact-text-muted)" }}
                    >
                      {copy.step} {step} / 3
                    </span>
                    <h2
                      id="contact-step-title"
                      tabIndex="-1"
                      className="mt-2 font-display text-2xl font-semibold leading-tight tracking-tight outline-none sm:text-3xl"
                    >
                      {stepTitle}
                    </h2>
                  </div>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-(--accent-surface) text-(--accent-text)">
                    <Send size={15} />
                  </div>
                </div>
                <div className="mb-6 grid grid-cols-3 gap-2" aria-hidden="true">
                  {[1, 2, 3].map((n) => (
                    <span
                      key={n}
                      className="h-1 rounded-full"
                      style={{
                        background:
                          n <= step
                            ? "var(--accent-fill)"
                            : "var(--contact-border)",
                      }}
                    />
                  ))}
                </div>
                <form ref={formRef} onSubmit={handleSubmit} noValidate>
                  {step === 1 ? (
                    <ChoiceGrid
                      legend={copy.intentLegend}
                      name="category"
                      value={form.category}
                      onChange={selectCategory}
                      options={categoryOptions}
                      icons={CATEGORY_ICONS}
                      error={fieldErrors.category}
                    />
                  ) : null}
                  {step === 2 ? (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {detailFields}
                    </div>
                  ) : null}
                  {step === 3 ? (
                    <div
                      dir={isRTL ? "rtl" : "ltr"}
                      className="grid grid-cols-1 gap-4 md:grid-cols-2"
                    >
                      <Field
                        label={copy.name}
                        name="name"
                        value={form.name}
                        onChange={update("name")}
                        placeholder={copy.namePlaceholder}
                        autoComplete="name"
                        maxLength={MAX.name}
                        error={fieldErrors.name}
                      />
                      <MultiChoiceGrid
                        legend={copy.contactMethod}
                        name="contactMethods"
                        values={form.contactMethods}
                        onChange={toggleContactMethod}
                        options={contactOptions}
                        icons={CONTACT_ICONS}
                        error={fieldErrors.contactMethods}
                      />
                      {form.contactMethods.map((method) => (
                        <Field
                          key={method}
                          label={copy.contactLabels[method]}
                          name={`contact.${method}`}
                          value={form.contactDetails[method] || ""}
                          onChange={updateContactDetail(method)}
                          placeholder={
                            copy.contactPlaceholders[method] ||
                            copy.contactPlaceholder
                          }
                          type={method === "email" ? "email" : "text"}
                          inputMode={
                            ["phone", "whatsapp"].includes(method)
                              ? "tel"
                              : method === "email"
                                ? "email"
                                : "text"
                          }
                          autoComplete={
                            method === "email"
                              ? "email"
                              : method === "phone"
                                ? "tel"
                                : "off"
                          }
                          maxLength={MAX.contact}
                          error={fieldErrors[`contact.${method}`]}
                          forceLTR={["phone", "whatsapp", "telegram", "email"].includes(method)}
                        />
                      ))}
                      <Field
                        label={copy.message}
                        name="message"
                        value={form.message}
                        onChange={update("message")}
                        placeholder={copy.messagePlaceholder}
                        textarea
                        maxLength={MAX.message}
                        error={fieldErrors.message}
                      />
                      <p
                        className="font-sans text-xs leading-relaxed md:col-span-2"
                        dir={isRTL ? "rtl" : "ltr"}
                        style={{ color: "var(--contact-text-muted)" }}
                      >
                        {copy.privacyNote}{" "}
                        <Link
                          to="/privacy"
                          state={{ fromContact: true }}
                          className="text-(--accent-text) underline underline-offset-4 hover:opacity-80"
                        >
                          {copy.privacyLink}
                        </Link>
                      </p>
                    </div>
                  ) : null}
                  <input
                    type="text"
                    name="website_confirm"
                    value={form.honeypot}
                    onChange={update("honeypot")}
                    tabIndex="-1"
                    autoComplete="off"
                    aria-hidden="true"
                    className="contact-honeypot"
                  />
                  <div
                    className={`mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center ${isRTL ? "sm:justify-end" : "sm:justify-between"}`}
                    dir="ltr"
                  >
                    {step > 1 ? (
                      <button
                        type="button"
                        onClick={() => {
                          setStep((s) => s - 1);
                          setFieldErrors({});
                          setStatus("idle");
                        }}
                        className="btn btn-secondary"
                      >
                        <ArrowLeft size={15} />
                        {copy.previous}
                      </button>
                    ) : (
                      <span />
                    )}
                    {step < 3 ? (
                      <button
                        type="button"
                        onClick={nextStep}
                        className="btn btn-primary"
                      >
                        {copy.continue}
                        <ArrowRight size={15} />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={isSubmitting || status === "success"}
                        className="btn btn-primary group"
                      >
                        {isSubmitting
                          ? copy.sending
                          : status === "success"
                            ? copy.sent
                            : copy.send}
                        {isSubmitting ? (
                          <LoaderCircle
                            size={15}
                            className="animate-spin motion-reduce:animate-none"
                          />
                        ) : status === "success" ? (
                          <Check size={15} />
                        ) : (
                          <ArrowUpRight className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" size={15} />
                        )}
                      </button>
                    )}
                  </div>
                  <div
                    className="mt-4 min-h-5"
                    aria-live="polite"
                    aria-atomic="true"
                  >
                    {status === "success" ? (
                      <div
                        className="flex items-start gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/6 px-3 py-2.5 text-emerald-300"
                        dir={isRTL ? "rtl" : "ltr"}
                      >
                        <Check size={15} className="mt-0.5 shrink-0" />
                        <p className="font-sans text-xs leading-relaxed">
                          {copy.success}
                        </p>
                      </div>
                    ) : null}
                    {status === "error" ? (
                      <div
                        className="flex items-start gap-2 rounded-xl border border-red-400/20 bg-red-400/6 px-3 py-2.5 text-red-300"
                        dir={isRTL ? "rtl" : "ltr"}
                      >
                        <AlertCircle size={15} className="mt-0.5 shrink-0" />
                        <p className="font-sans text-xs leading-relaxed">
                          {errorMessage}
                        </p>
                      </div>
                    ) : null}
                  </div>
                </form>
              </div>
            </motion.section>
          </div>
        </div>
        <footer
          className="flex shrink-0 items-center justify-between border-t pt-4 font-sans text-xs"
          style={{
            color: "var(--contact-text-muted)",
            borderColor: "var(--contact-border)",
          }}
        >
          <span>Yasin · Frontend Developer</span>
          <div className="flex items-center gap-3" dir="ltr">
            <span className="hidden sm:inline">{copy.footer}</span>
            <LanguageToggle variant="footer" />
          </div>
        </footer>
      </div>
    </main>
  );
}
export default Contact;

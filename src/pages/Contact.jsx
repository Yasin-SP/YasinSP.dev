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
  Clock,
  Code2,
  Copy,
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
import IOSSelect from "../components/IOSSelect.jsx";
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

const EXTRA = {
  en: {
    steps: ["Topic", "Details", "Contact"],
    stepOf: (n) => `Step ${n} of 3`,
    topic: "Topic",
    change: "Change",
    sentTitle: "Message sent",
    home: "Back to home",
    again: "Send another message",
    direct: "Prefer to reach out directly?",
    copy: "Copy email",
    copied: "Copied",
    required: "All fields are required unless marked optional.",
    nums: ["1", "2", "3"],
  },
  fa: {
    steps: ["موضوع", "جزئیات", "تماس"],
    stepOf: (n) => `مرحله ${["۱", "۲", "۳"][n - 1]} از ۳`,
    topic: "موضوع",
    change: "تغییر",
    sentTitle: "پیامت ارسال شد",
    home: "بازگشت به خانه",
    again: "ارسال پیام دیگر",
    direct: "ترجیح می‌دی مستقیم پیام بدی؟",
    copy: "کپی ایمیل",
    copied: "کپی شد",
    required: "همهٔ فیلدها اجباری‌اند مگر اینکه «اختیاری» نوشته شده باشد.",
    nums: ["۱", "۲", "۳"],
  },
};

const directValue = (social) => {
  if (social.type === "email") return social.href.replace("mailto:", "");
  const tail = social.href.split("/").filter(Boolean).pop() || social.label;
  return social.type === "telegram" ? `@${tail}` : tail;
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
  wide = false,
}) {
  const { isRTL } = useLanguage();
  const id = useId();
  const Tag = textarea ? "textarea" : "input";
  return (
    <label
      htmlFor={id}
      dir={isRTL ? "rtl" : "ltr"}
      className={`group block ${textarea || wide ? "md:col-span-2" : ""}`}
    >
      <span
        className="mb-2 block font-sans text-[13px] font-medium"
        style={{ color: "var(--contact-text-soft)" }}
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
        rows={textarea ? 5 : undefined}
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
      {textarea && maxLength ? (
        <span dir="ltr" className="mt-1.5 block text-end font-sans text-[11px] tabular-nums" style={{ color: "var(--contact-text-muted)" }}>
          {String(value).length} / {maxLength}
        </span>
      ) : null}
      {error ? (
        <span
          id={`${id}-error`}
          role="alert"
          className="mt-1.5 flex items-center gap-1.5 font-sans text-xs text-red-400"
        >
          <AlertCircle size={13} className="shrink-0" />
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
  const id = useId();
  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="block">
      <label
        htmlFor={id}
        className="mb-2 block font-sans text-[13px] font-medium"
        style={{ color: "var(--contact-text-soft)" }}
      >
        {label}
      </label>
      <IOSSelect
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        options={options}
        placeholder={placeholder}
        label={label}
        error={error}
        describedBy={error ? `${id}-error` : undefined}
      />
      {error ? (
        <span
          id={`${id}-error`}
          role="alert"
          className="mt-1.5 flex items-center gap-1.5 font-sans text-xs text-red-400"
        >
          <AlertCircle size={13} className="shrink-0" />
          {error}
        </span>
      ) : null}
    </div>
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
                className="flex min-h-16 items-center gap-3 rounded-xl border border-(--contact-border) px-4 py-3 font-sans text-sm transition-[border-color,background-color,box-shadow] duration-300 hover:border-(--accent-border) peer-focus-visible:ring-2 peer-focus-visible:ring-(--accent-fill)"
                style={{
                  borderColor: active
                    ? "var(--accent-fill)"
                    : undefined,
                  boxShadow: active ? "0 0 0 3px var(--accent-ring)" : undefined,
                  background: active
                    ? "var(--accent-surface)"
                    : "var(--contact-bg-elevated)",
                  color: active
                    ? "var(--contact-text)"
                    : "var(--contact-text-soft)",
                }}
              >
                {Icon ? (
                  <span
                    aria-hidden="true"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[0.7rem] transition-colors duration-300"
                    style={{
                      background: active ? "var(--btn-fill)" : "var(--accent-surface)",
                      color: active ? "#fff" : "var(--accent-text)",
                    }}
                  >
                    <Icon size={17} />
                  </span>
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
                  <span className="ms-auto flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white" style={{ background: "var(--btn-fill)" }}>
                    <Check size={12} strokeWidth={3} />
                  </span>
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
                className="flex min-h-16 items-center gap-3 rounded-xl border border-(--contact-border) px-4 py-3 font-sans text-sm transition-[border-color,background-color,box-shadow] duration-300 hover:border-(--accent-border) peer-focus-visible:ring-2 peer-focus-visible:ring-(--accent-fill)"
                style={{
                  borderColor: active
                    ? "var(--accent-fill)"
                    : undefined,
                  boxShadow: active ? "0 0 0 3px var(--accent-ring)" : undefined,
                  background: active
                    ? "var(--accent-surface)"
                    : "var(--contact-bg-elevated)",
                  color: active
                    ? "var(--contact-text)"
                    : "var(--contact-text-soft)",
                }}
              >
                {Icon ? (
                  <span
                    aria-hidden="true"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[0.7rem] transition-colors duration-300"
                    style={{
                      background: active ? "var(--btn-fill)" : "var(--accent-surface)",
                      color: active ? "#fff" : "var(--accent-text)",
                    }}
                  >
                    <Icon size={17} />
                  </span>
                ) : null}
                <span
                  dir={isRTL ? "rtl" : "ltr"}
                  className="min-w-0 text-start"
                >
                  <span className="block font-medium">{o.label}</span>
                </span>
                {active ? (
                  <span className="ms-auto flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white" style={{ background: "var(--btn-fill)" }}>
                    <Check size={12} strokeWidth={3} />
                  </span>
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
  const { theme } = useTheme();
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
  const [copied, setCopied] = useState(false);
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
    if (step < 3) {
      nextStep();
      return;
    }
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
  const x = EXTRA[language] || EXTRA.en;
  const selectedCategory = categoryOptions.find((item) => item.value === form.category);
  const emailLink = socialLinks.find((item) => item.type === "email");
  const copyEmail = async () => {
    if (!emailLink) return;
    try {
      await navigator.clipboard.writeText(directValue(emailLink));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = emailLink.href;
    }
  };
  const dirAttr = isRTL ? "rtl" : "ltr";
  const goToStep = (target) => {
    if (target >= step) return;
    setStep(target);
    setFieldErrors({});
    setStatus("idle");
    window.requestAnimationFrame(() => document.getElementById("contact-step-title")?.focus());
  };
  const enter = (delay = 0) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.65, ease: smoothEase, delay },
  });

  return (
    <main id="main-content" className="contact-page relative min-h-svh overflow-hidden">
      <div className="relative z-10 mx-auto flex min-h-svh w-full max-w-6xl flex-col px-5 pb-6 pt-5 sm:px-8 md:px-10">
        <header className="flex shrink-0 items-center justify-between gap-3" dir="ltr">
          <Link to="/" aria-label={copy.homeLabel} className="flex h-10 w-24 items-center justify-center sm:h-12 sm:w-28">
            <img src={logo} alt="" className="h-full w-full object-contain" style={{ transform: "scale(1.5)", filter: theme === "light" ? "invert(1)" : "none" }} />
          </Link>
          <div className="flex items-center gap-2">
            <LanguageToggle variant="nav" />
            <ContactThemeToggle />
            <Link to="/" className="btn btn-secondary btn-sm group">
              <ArrowLeft size={14} className="transition-transform duration-300 group-hover:-translate-x-0.5" />
              {copy.back}
            </Link>
          </div>
        </header>

        <div className="grid flex-1 items-start gap-10 py-10 sm:py-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 lg:py-16">
          {/* Left: who, how fast, and the quickest direct routes */}
          <section dir={dirAttr} className="text-start lg:sticky lg:top-10">
            <motion.div {...enter(0)}>
              <span className="pill text-(--color-text-primary)">
                <span className="relative flex h-2 w-2" aria-hidden="true">
                  <span className="absolute inset-0 rounded-full bg-(--c-green)" style={{ animation: "ping-dot 1.8s cubic-bezier(0, 0, 0.2, 1) infinite" }} />
                  <span className="relative h-2 w-2 rounded-full bg-(--c-green)" />
                </span>
                {copy.open}
              </span>
              <h1 className="display-type mt-6 max-w-[14ch] text-[clamp(2.1rem,4.2vw,3.4rem)]">
                {copy.title} <span style={{ color: "var(--accent-text)" }}>{copy.highlight}</span>
              </h1>
              <p className="mt-5 max-w-md font-sans text-base leading-relaxed md:text-[17px]" style={{ color: "var(--contact-text-soft)" }}>{copy.body}</p>
              <p className="mt-6 inline-flex items-center gap-2 font-sans text-sm" style={{ color: "var(--contact-text-soft)" }}>
                <Clock size={16} className="text-(--accent-text)" aria-hidden="true" />
                {copy.response}
              </p>
            </motion.div>

            {socialLinks.length > 0 ? (
              <motion.div {...enter(0.15)} className="mt-10">
                <h2 className="font-sans text-[13px] font-semibold" style={{ color: "var(--contact-text)" }}>{x.direct}</h2>
                <ul className="glass mt-4 divide-y divide-(--color-border) overflow-hidden" style={{ "--r": "1.5rem", "--glass-blur": "24px" }}>
                  {socialLinks.map((social) => {
                    const Icon = SOCIAL_ICONS[social.type];
                    const external = social.type !== "email";
                    return (
                      <li key={social.label} className="group flex items-center transition-colors duration-300 hover:bg-(--color-surface)">
                        <a
                          href={social.href}
                          target={external ? "_blank" : undefined}
                          rel={external ? "noopener noreferrer" : undefined}
                          className="flex min-w-0 flex-1 items-center gap-4 px-4 py-3.5"
                        >
                          <span className="tone-icon tone-purple h-10 w-10 shrink-0 rounded-[0.8rem]"><Icon size={18} /></span>
                          <span className="min-w-0 flex-1 text-start">
                            <span className="block font-sans text-sm font-semibold" style={{ color: "var(--contact-text)" }}>{social.label}</span>
                            <span dir="ltr" className="block truncate text-start font-sans text-[13px]" style={{ color: "var(--contact-text-muted)" }}>{directValue(social)}</span>
                          </span>
                          {external ? <ArrowUpRight size={16} className="shrink-0 opacity-50 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100 rtl:-scale-x-100" aria-hidden="true" /> : null}
                        </a>
                        {social.type === "email" ? (
                          <button
                            type="button"
                            onClick={copyEmail}
                            aria-label={x.copy}
                            className="me-3 inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 font-sans text-xs font-medium transition-colors duration-300 hover:bg-(--color-surface-hover)"
                            style={{ color: copied ? "var(--c-green)" : "var(--contact-text-soft)", background: "var(--color-surface)" }}
                          >
                            {copied ? <Check size={13} /> : <Copy size={13} />}
                            {copied ? x.copied : x.copy}
                          </button>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              </motion.div>
            ) : null}
          </section>

          {/* Right: the guided form */}
          <motion.section {...enter(0.1)} className="relative" aria-labelledby="contact-step-title">
            <div className="glass tone-purple p-5 sm:p-9" style={{ "--r": "2rem", "--glass-blur": "40px" }}>
              {status === "success" ? (
                <div dir={dirAttr} className="flex flex-col items-center py-8 text-center" role="status">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full text-white" style={{ background: "var(--btn-fill)" }}>
                    <Check size={30} strokeWidth={2.4} />
                  </span>
                  <h2 id="contact-step-title" tabIndex="-1" className="mt-6 font-display text-3xl font-bold outline-none">{x.sentTitle}</h2>
                  <p className="mt-3 max-w-sm font-sans text-base leading-relaxed" style={{ color: "var(--contact-text-soft)" }}>{copy.success}</p>
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <Link to="/" className="btn btn-primary">{x.home}</Link>
                    <button type="button" onClick={() => setStatus("idle")} className="btn btn-secondary">{x.again}</button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Stepper: numbered, labelled, completed steps can be revisited */}
                  <ol className="flex items-center" dir={dirAttr} aria-label={x.stepOf(step)}>
                    {x.steps.map((label, index) => {
                      const n = index + 1;
                      const done = n < step;
                      const current = n === step;
                      return (
                        <li key={label} className={`flex items-center ${n < 3 ? "flex-1" : ""}`}>
                          <button
                            type="button"
                            disabled={!done}
                            onClick={() => goToStep(n)}
                            aria-current={current ? "step" : undefined}
                            className={`group flex items-center gap-2.5 rounded-full ${done ? "cursor-pointer" : "cursor-default"}`}
                          >
                            <span
                              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-sans text-[13px] font-semibold transition-colors duration-300"
                              style={{
                                background: done || current ? "var(--btn-fill)" : "transparent",
                                color: done || current ? "#fff" : "var(--contact-text-muted)",
                                boxShadow: done || current ? "none" : "0 0 0 1px var(--contact-border-strong) inset",
                              }}
                            >
                              {done ? <Check size={15} strokeWidth={2.6} /> : x.nums[index]}
                            </span>
                            <span className="hidden font-sans text-[13px] font-medium sm:inline" style={{ color: current ? "var(--contact-text)" : "var(--contact-text-muted)" }}>{label}</span>
                          </button>
                          {n < 3 ? <span aria-hidden="true" className="mx-3 h-px flex-1 transition-colors duration-500" style={{ background: n < step ? "var(--c-purple)" : "var(--contact-border)" }} /> : null}
                        </li>
                      );
                    })}
                  </ol>

                  <div dir={dirAttr} className="mt-8 text-start">
                    <span className="block font-sans text-xs font-medium" style={{ color: "var(--contact-text-muted)" }}>{x.stepOf(step)}</span>
                    <h2 id="contact-step-title" tabIndex="-1" className="mt-1.5 font-display text-2xl font-bold leading-tight outline-none sm:text-[1.9rem]">{stepTitle}</h2>
                    {step > 1 && selectedCategory ? (
                      <p className="mt-4 inline-flex items-center gap-2 rounded-full py-1.5 ps-3.5 pe-1.5 font-sans text-[13px]" style={{ background: "var(--accent-surface)", color: "var(--contact-text)" }}>
                        <span style={{ color: "var(--contact-text-muted)" }}>{x.topic}:</span>
                        <span className="font-semibold">{selectedCategory.label}</span>
                        <button type="button" onClick={() => goToStep(1)} className="inline-flex cursor-pointer items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium text-(--accent-text) transition-colors duration-300 hover:bg-(--accent-surface)">
                          {x.change}
                        </button>
                      </p>
                    ) : null}
                  </div>

                  <form ref={formRef} onSubmit={handleSubmit} noValidate className="mt-7">
                    {step === 1 ? (
                      <ChoiceGrid legend={copy.intentLegend} name="category" value={form.category} onChange={selectCategory} options={categoryOptions} icons={CATEGORY_ICONS} error={fieldErrors.category} />
                    ) : null}
                    {step === 2 ? <div className="grid grid-cols-1 gap-5 md:grid-cols-2">{detailFields}</div> : null}
                    {step === 3 ? (
                      <div dir={dirAttr} className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <Field label={copy.name} name="name" value={form.name} onChange={update("name")} placeholder={copy.namePlaceholder} autoComplete="name" maxLength={MAX.name} error={fieldErrors.name} wide />
                        <MultiChoiceGrid legend={copy.contactMethod} name="contactMethods" values={form.contactMethods} onChange={toggleContactMethod} options={contactOptions} icons={CONTACT_ICONS} error={fieldErrors.contactMethods} />
                        {form.contactMethods.map((method) => (
                          <Field
                            key={method}
                            label={copy.contactLabels[method]}
                            name={`contact.${method}`}
                            value={form.contactDetails[method] || ""}
                            onChange={updateContactDetail(method)}
                            placeholder={copy.contactPlaceholders[method] || copy.contactPlaceholder}
                            type={method === "email" ? "email" : "text"}
                            inputMode={["phone", "whatsapp"].includes(method) ? "tel" : method === "email" ? "email" : "text"}
                            autoComplete={method === "email" ? "email" : method === "phone" ? "tel" : "off"}
                            maxLength={MAX.contact}
                            error={fieldErrors[`contact.${method}`]}
                            forceLTR={["phone", "whatsapp", "telegram", "email"].includes(method)}
                            wide
                          />
                        ))}
                        <Field label={copy.message} name="message" value={form.message} onChange={update("message")} placeholder={copy.messagePlaceholder} textarea maxLength={MAX.message} error={fieldErrors.message} />
                        <p className="font-sans text-xs leading-relaxed md:col-span-2" style={{ color: "var(--contact-text-muted)" }}>
                          {copy.privacyNote}{" "}
                          <Link to="/privacy" state={{ fromContact: true }} className="text-(--accent-text) underline underline-offset-4 hover:opacity-80">{copy.privacyLink}</Link>
                        </p>
                      </div>
                    ) : null}
                    <input type="text" name="website_confirm" value={form.honeypot} onChange={update("honeypot")} tabIndex="-1" autoComplete="off" aria-hidden="true" className="contact-honeypot" />

                    <div className="hairline-t mt-8 flex flex-col-reverse gap-3 pt-6 sm:flex-row sm:items-center sm:justify-between" dir={dirAttr}>
                      {step > 1 ? (
                        <button type="button" onClick={() => goToStep(step - 1)} className="btn btn-secondary">
                          <ArrowLeft size={15} className="rtl:-scale-x-100" />
                          {copy.previous}
                        </button>
                      ) : (
                        <span className="hidden font-sans text-xs sm:block" style={{ color: "var(--contact-text-muted)" }}>{x.required}</span>
                      )}
                      {step < 3 ? (
                        <button type="button" onClick={nextStep} className="btn btn-primary">
                          {copy.continue}
                          <ArrowRight size={15} className="rtl:-scale-x-100" />
                        </button>
                      ) : (
                        <button type="submit" disabled={isSubmitting} className="btn btn-primary group disabled:opacity-70">
                          {isSubmitting ? copy.sending : copy.send}
                          {isSubmitting ? <LoaderCircle size={15} className="animate-spin motion-reduce:animate-none" /> : <ArrowUpRight className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100" size={15} />}
                        </button>
                      )}
                    </div>

                    <div className="mt-4 min-h-5" aria-live="polite" aria-atomic="true">
                      {status === "error" ? (
                        <div className="flex items-start gap-2 rounded-xl border border-red-400/25 bg-red-400/8 px-3.5 py-3 text-red-400" dir={dirAttr}>
                          <AlertCircle size={16} className="mt-0.5 shrink-0" />
                          <p className="font-sans text-[13px] leading-relaxed">{errorMessage}</p>
                        </div>
                      ) : null}
                    </div>
                  </form>
                </>
              )}
            </div>
          </motion.section>
        </div>

        <footer className="flex shrink-0 items-center justify-between border-t pt-4 font-sans text-xs" style={{ color: "var(--contact-text-muted)", borderColor: "var(--contact-border)" }}>
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

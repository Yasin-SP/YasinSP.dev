export const MAX_BODY_BYTES = 16 * 1024;

export const CATEGORIES = new Set([
  "website",
  "collaboration",
  "employment",
  "consultation",
  "other",
]);

export const CONTACT_METHODS = new Set([
  "email",
  "phone",
  "telegram",
  "whatsapp",
  "other",
]);

const LIMITS = Object.freeze({
  name: 80,
  contact: 160,
  message: 2000,
  projectType: 80,
  budget: 80,
  timeline: 80,
  company: 120,
  role: 120,
  website: 240,
  locale: 5,
});

// oxlint-disable-next-line no-control-regex -- intentional sanitization of untrusted control characters.
const CONTROL_CHARACTERS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

export function normalizeText(value, maxLength, { multiline = false } = {}) {
  if (typeof value !== "string") return "";

  const normalized = value
    .normalize("NFKC")
    .replace(CONTROL_CHARACTERS, "")
    .replace(/\r\n?/g, "\n")
    .trim();

  const cleaned = multiline
    ? normalized.replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n")
    : normalized.replace(/\s+/g, " ");

  return [...cleaned].slice(0, maxLength).join("");
}

function isValidEmail(value) {
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/u.test(value);
}

function isValidPhone(value) {
  const compact = value.replace(/[\s().-]/g, "");
  return /^\+?[0-9]{7,15}$/.test(compact);
}

function isValidTelegram(value) {
  return /^@[a-zA-Z0-9_]{5,32}$/.test(value);
}

function isValidWebsite(value) {
  if (!value) return true;
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
}

function addError(errors, field, code) {
  errors[field] = code;
}

export function validateContactPayload(input, now = Date.now()) {
  const errors = {};
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { ok: false, errors: { form: "invalid" } };
  }

  const category = normalizeText(input.category, 32).toLowerCase();
  const rawMethods = Array.isArray(input.contactMethods) ? input.contactMethods : [];
  const contactMethods = [...new Set(rawMethods.map((method) => normalizeText(method, 20).toLowerCase()))];
  const rawDetails = input.contactDetails && typeof input.contactDetails === "object" && !Array.isArray(input.contactDetails) ? input.contactDetails : {};
  const contactDetails = Object.fromEntries(contactMethods.map((method) => [method, normalizeText(rawDetails[method], LIMITS.contact)]));
  const data = {
    category,
    name: normalizeText(input.name, LIMITS.name),
    contactMethods,
    contactDetails,
    message: normalizeText(input.message, LIMITS.message, { multiline: true }),
    projectType: normalizeText(input.projectType, LIMITS.projectType),
    budget: normalizeText(input.budget, LIMITS.budget),
    timeline: normalizeText(input.timeline, LIMITS.timeline),
    company: normalizeText(input.company, LIMITS.company),
    role: normalizeText(input.role, LIMITS.role),
    website: normalizeText(input.website, LIMITS.website),
    locale: normalizeText(input.locale, LIMITS.locale).toLowerCase(),
  };

  if (!CATEGORIES.has(category)) addError(errors, "category", "invalid");
  if (data.name.length < 2) addError(errors, "name", "too_short");
  if (rawMethods.length < 1 || rawMethods.length > CONTACT_METHODS.size || data.contactMethods.length !== rawMethods.length) addError(errors, "contactMethods", "invalid");
  if (data.contactMethods.some((method) => !CONTACT_METHODS.has(method))) addError(errors, "contactMethods", "invalid");
  if (Object.keys(rawDetails).some((method) => {
    const normalized = String(method).toLowerCase();
    return !CONTACT_METHODS.has(normalized) || !data.contactMethods.includes(normalized);
  })) addError(errors, "contactDetails", "invalid");
  if (data.message.length < 10) addError(errors, "message", "too_short");

  for (const method of data.contactMethods) {
    const contact = data.contactDetails[method] || "";
    if (contact.length < 3) addError(errors, `contact.${method}`, "too_short");
    if (method === "email" && !isValidEmail(contact)) addError(errors, `contact.${method}`, "invalid_email");
    else if (["phone", "whatsapp"].includes(method) && !isValidPhone(contact)) addError(errors, `contact.${method}`, "invalid_phone");
    else if (method === "telegram" && !isValidTelegram(contact)) addError(errors, `contact.${method}`, "invalid_telegram");
    else if (method === "other" && contact.length < 4) addError(errors, `contact.${method}`, "too_short");
  }
  if (!isValidWebsite(data.website)) addError(errors, "website", "invalid_url");

  if (category === "website") {
    if (!data.projectType) addError(errors, "projectType", "required");
    if (!data.timeline) addError(errors, "timeline", "required");
  } else if (category === "collaboration" || category === "employment") {
    if (data.company.length < 2) addError(errors, "company", "too_short");
    if (!data.role) addError(errors, "role", "required");
  } else if (category === "consultation" && !data.projectType) {
    addError(errors, "projectType", "required");
  }

  const startedAt = Number(input.formStartedAt);
  if (!Number.isFinite(startedAt) || startedAt <= 0 || startedAt > now + 5 * 60_000) {
    addError(errors, "form", "invalid_timing");
  } else if (now - startedAt < 1_200 || now - startedAt > 24 * 60 * 60_000) {
    addError(errors, "form", "invalid_timing");
  }

  return Object.keys(errors).length
    ? { ok: false, errors }
    : { ok: true, data };
}

export function escapeTelegramHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

const CATEGORY_LABELS = Object.freeze({
  website: "طراحی سایت",
  collaboration: "همکاری پروژه‌ای",
  employment: "پیشنهاد شغلی",
  consultation: "مشاوره",
  other: "سایر",
});

const CATEGORY_EMOJIS = Object.freeze({
  website: "🌐",
  collaboration: "🤝",
  employment: "💼",
  consultation: "💡",
  other: "📌",
});

const CATEGORY_HASHTAGS = Object.freeze({
  website: "#طراحی_سایت",
  collaboration: "#همکاری_پروژه‌ای",
  employment: "#پیشنهاد_شغلی",
  consultation: "#مشاوره",
  other: "#سایر",
});

const CONTACT_LABELS = Object.freeze({
  email: "ایمیل",
  phone: "تلفن",
  telegram: "تلگرام",
  whatsapp: "واتساپ",
  other: "راه ارتباطی دیگر",
});

const CONTACT_EMOJIS = Object.freeze({
  email: "📧",
  phone: "📞",
  telegram: "✈️",
  whatsapp: "💬",
  other: "🔗",
});

const PROJECT_TYPE_LABELS = Object.freeze({
  portfolio: "نمونه‌کار / پورتفولیو",
  "landing-page": "لندینگ پیج",
  "landing_page": "لندینگ پیج",
  landingpage: "لندینگ پیج",
  "company-website": "وب‌سایت شرکتی",
  "company_website": "وب‌سایت شرکتی",
  companywebsite: "وب‌سایت شرکتی",
  "business-website": "وب‌سایت شرکتی",
  corporate: "وب‌سایت شرکتی",
  ecommerce: "فروشگاه اینترنتی",
  "e-commerce": "فروشگاه اینترنتی",
  "e_commerce": "فروشگاه اینترنتی",
  "web-application": "وب‌اپلیکیشن",
  "web_application": "وب‌اپلیکیشن",
  webapplication: "وب‌اپلیکیشن",
  "web-app": "وب‌اپلیکیشن",
  webapp: "وب‌اپلیکیشن",
  "redesign-frontend-improvement": "بازطراحی / بهبود فرانت‌اند",
  "redesign_frontend_improvement": "بازطراحی / بهبود فرانت‌اند",
  "redesign-frontend": "بازطراحی / بهبود فرانت‌اند",
  redesignfrontend: "بازطراحی / بهبود فرانت‌اند",
  other: "سایر",
});

const BUDGET_LABELS = Object.freeze({
  "let's-discuss": "نیاز به گفتگو",
  letsdiscuss: "نیاز به گفتگو",
  discuss: "نیاز به گفتگو",
  "under-$500": "کمتر از ۵۰۰ دلار",
  "under-500": "کمتر از ۵۰۰ دلار",
  under500: "کمتر از ۵۰۰ دلار",
  "$500–$1,500": "۵۰۰ تا ۱۵۰۰ دلار",
  "$500-$1,500": "۵۰۰ تا ۱۵۰۰ دلار",
  "500–1500": "۵۰۰ تا ۱۵۰۰ دلار",
  "500-1500": "۵۰۰ تا ۱۵۰۰ دلار",
  "500_1500": "۵۰۰ تا ۱۵۰۰ دلار",
  "$1,500–$4,000": "۱۵۰۰ تا ۴۰۰۰ دلار",
  "$1,500-$4,000": "۱۵۰۰ تا ۴۰۰۰ دلار",
  "1500–4000": "۱۵۰۰ تا ۴۰۰۰ دلار",
  "1500-4000": "۱۵۰۰ تا ۴۰۰۰ دلار",
  "1500_4000": "۱۵۰۰ تا ۴۰۰۰ دلار",
  "$4,000+": "بیشتر از ۴۰۰۰ دلار",
  "4000+": "بیشتر از ۴۰۰۰ دلار",
  "4000-plus": "بیشتر از ۴۰۰۰ دلار",
  "4000_plus": "بیشتر از ۴۰۰۰ دلار",
  "4000plus": "بیشتر از ۴۰۰۰ دلار",
});

const TIMELINE_LABELS = Object.freeze({
  "as-soon-as-possible": "در اولین فرصت",
  assoonaspossible: "در اولین فرصت",
  asap: "در اولین فرصت",
  "within-one-month": "حداکثر تا یک ماه",
  "within_one_month": "حداکثر تا یک ماه",
  withinonemonth: "حداکثر تا یک ماه",
  "1-3-months": "۱ تا ۳ ماه",
  "1_3_months": "۱ تا ۳ ماه",
  "1–3-months": "۱ تا ۳ ماه",
  "1-3": "۱ تا ۳ ماه",
  flexible: "انعطاف‌پذیر / هنوز مشخص نیست",
  "flexible-not-decided": "انعطاف‌پذیر / هنوز مشخص نیست",
  "flexible-not-decided-yet": "انعطاف‌پذیر / هنوز مشخص نیست",
});

const COLLABORATION_LABELS = Object.freeze({
  "build-together": "ساخت مشترک",
  "build_together": "ساخت مشترک",
  buildtogether: "ساخت مشترک",
  "frontend-development": "توسعه فرانت‌اند",
  "frontend_development": "توسعه فرانت‌اند",
  frontenddevelopment: "توسعه فرانت‌اند",
  "ui/ux-collaboration": "همکاری UI/UX",
  "ui-ux-collaboration": "همکاری UI/UX",
  "ui_ux_collaboration": "همکاری UI/UX",
  uiuxcollaboration: "همکاری UI/UX",
  "subcontract-work": "همکاری پیمانکاری",
  "subcontract_work": "همکاری پیمانکاری",
  subcontractwork: "همکاری پیمانکاری",
  other: "سایر",
});

const EMPLOYMENT_LABELS = Object.freeze({
  "full-time-role": "همکاری تمام‌وقت",
  "full-time": "همکاری تمام‌وقت",
  "full_time": "همکاری تمام‌وقت",
  fulltime: "همکاری تمام‌وقت",
  "part-time-role": "همکاری پاره‌وقت",
  "part-time": "همکاری پاره‌وقت",
  "part_time": "همکاری پاره‌وقت",
  parttime: "همکاری پاره‌وقت",
  contract: "قراردادی",
  internship: "کارآموزی",
  "freelance-engagement": "همکاری فریلنسری",
  "freelance-engagements": "همکاری فریلنسری",
  freelance: "همکاری فریلنسری",
});

const CONSULTATION_LABELS = Object.freeze({
  "product-and-idea": "محصول و ایده",
  "product_and_idea": "محصول و ایده",
  productandidea: "محصول و ایده",
  "ui/ux-review": "بررسی UI/UX",
  "ui-ux-review": "بررسی UI/UX",
  "ui_ux_review": "بررسی UI/UX",
  uiuxreview: "بررسی UI/UX",
  "frontend-architecture": "معماری فرانت‌اند",
  "frontend_architecture": "معماری فرانت‌اند",
  frontendarchitecture: "معماری فرانت‌اند",
  "performance-and-accessibility": "عملکرد و دسترسی‌پذیری",
  "performance_accessibility": "عملکرد و دسترسی‌پذیری",
  performanceandaccessibility: "عملکرد و دسترسی‌پذیری",
  other: "سایر",
});

function normalizeOptionKey(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[–—]/g, "-")
    .replace(/\s+/g, "-");
}

function translateOption(value, labels) {
  const text = String(value || "").trim();
  if (!text) return "";
  const key = normalizeOptionKey(text);
  return labels[key] || labels[key.replace(/_/g, "-")] || text;
}

function translateProjectOption(category, value) {
  if (category === "collaboration") return translateOption(value, COLLABORATION_LABELS);
  if (category === "employment") return translateOption(value, EMPLOYMENT_LABELS);
  if (category === "consultation") return translateOption(value, CONSULTATION_LABELS);
  return translateOption(value, PROJECT_TYPE_LABELS);
}

export function formatTelegramMessage(data) {
  const e = escapeTelegramHtml;
  const categoryLabel = CATEGORY_LABELS[data.category] || "سایر";
  const categoryEmoji = CATEGORY_EMOJIS[data.category] || "📌";
  const categoryHashtag = CATEGORY_HASHTAGS[data.category] || "#سایر";
  const lines = [
    "📩 <b>پیام جدید از سایت</b>",
    "━━━━━━━━━━━━━━",
    `${categoryEmoji} <b>دسته‌بندی:</b> ${e(categoryLabel)}`,
    `🏷️ ${categoryHashtag}`,
    `👤 <b>نام:</b> ${e(data.name)}`,
    "",
    "📱 <b>راه‌های ارتباطی:</b>",
  ];

  for (const method of data.contactMethods || []) {
    const label = CONTACT_LABELS[method] || "راه ارتباطی دیگر";
    const emoji = CONTACT_EMOJIS[method] || "🔗";
    lines.push(`${emoji} <b>${e(label)}:</b> <code>${e(data.contactDetails?.[method] || "")}</code>`);
  }

  if (data.projectType) lines.push(`🧩 <b>${data.category === "website" ? "نوع پروژه" : data.category === "collaboration" ? "مدل همکاری" : data.category === "employment" ? "مدل همکاری برای استخدام" : data.category === "consultation" ? "موضوع مشاوره" : "نوع پروژه"}:</b> ${e(translateProjectOption(data.category, data.projectType))}`);
  if (data.budget) lines.push(`💰 <b>بودجه تقریبی:</b> ${e(translateOption(data.budget, BUDGET_LABELS))}`);
  if (data.timeline) lines.push(`⏱️ <b>زمان‌بندی ترجیحی:</b> ${e(translateOption(data.timeline, TIMELINE_LABELS))}`);
  if (data.company) lines.push(`🏢 <b>مجموعه:</b> ${e(data.company)}`);
  if (data.role) lines.push(`🎯 <b>نقش / موقعیت:</b> ${e(data.role)}`);
  if (data.website) lines.push(`🔗 <b>وب‌سایت:</b> ${e(data.website)}`);
  lines.push("", "📝 <b>متن پیام:</b>", e(data.message), "", "━━━━━━━━━━━━━━", "✅ <b>پیام با موفقیت از سایت دریافت شد.</b>");

  return lines.join("\n");
}

export function parseAllowedOrigins(value) {
  return new Set(
    String(value || "")
      .split(",")
      .map((origin) => origin.trim().replace(/\/$/, ""))
      .filter((origin) => /^https?:\/\/[^/]+$/i.test(origin)),
  );
}

export function isOriginAllowed(origin, requestUrl, configuredOrigins) {
  if (!origin) return false;
  let normalized;
  try {
    normalized = new URL(origin).origin;
  } catch {
    return false;
  }
  return normalized === new URL(requestUrl).origin || configuredOrigins.has(normalized);
}

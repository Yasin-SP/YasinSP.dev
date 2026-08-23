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

const CONTACT_LABELS = Object.freeze({
  email: "ایمیل",
  phone: "تلفن",
  telegram: "تلگرام",
  whatsapp: "واتساپ",
  other: "راه ارتباطی دیگر",
});

export function formatTelegramMessage(data) {
  const e = escapeTelegramHtml;
  const lines = [
    `<b>پیام جدید فرم تماس</b>  #${e(data.category)}`,
    "",
    `<b>دسته:</b> ${e(CATEGORY_LABELS[data.category] || data.category)}`,
    `<b>نام:</b> ${e(data.name)}`,
    `<b>راه‌های ارتباطی:</b>`,
  ];

  for (const method of data.contactMethods || []) {
    lines.push(`• <b>${e(CONTACT_LABELS[method] || method)}:</b> <code>${e(data.contactDetails?.[method] || "")}</code>`);
  }

  if (data.projectType) lines.push(`<b>نوع پروژه:</b> ${e(data.projectType)}`);
  if (data.budget) lines.push(`<b>بودجه:</b> ${e(data.budget)}`);
  if (data.timeline) lines.push(`<b>زمان‌بندی:</b> ${e(data.timeline)}`);
  if (data.company) lines.push(`<b>مجموعه:</b> ${e(data.company)}`);
  if (data.role) lines.push(`<b>نقش/موقعیت:</b> ${e(data.role)}`);
  if (data.website) lines.push(`<b>وب‌سایت/لینک:</b> ${e(data.website)}`);
  lines.push("", "<b>پیام:</b>", e(data.message));

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

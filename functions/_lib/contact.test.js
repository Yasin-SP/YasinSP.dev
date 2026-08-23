import test from "node:test";
import assert from "node:assert/strict";
import {
  escapeTelegramHtml,
  formatTelegramMessage,
  isOriginAllowed,
  normalizeText,
  parseAllowedOrigins,
  validateContactPayload,
  MAX_BODY_BYTES,
} from "./contact.js";
import { onRequestPost } from "../api/contact.js";

const NOW = 2_000_000;
const validPayload = {
  category: "website",
  name: "یاسین تستی",
  contactMethods: ["email"],
  contactDetails: { email: "person@example.com" },
  message: "برای طراحی یک سایت حرفه‌ای پیام می‌دهم.",
  website: " https://example.com/project ",
  projectType: "portfolio",
  timeline: "month",
  formStartedAt: NOW - 5000,
};

test("normalizes Unicode, whitespace and controls", () => {
  assert.equal(normalizeText("  A\u0000   B  ", 20), "A B");
});

test("accepts a valid categorized request", () => {
  const result = validateContactPayload(validPayload, NOW);
  assert.equal(result.ok, true);
  assert.equal(result.data.contactDetails.email, "person@example.com");
  assert.equal(result.data.website, "https://example.com/project");
});

test("validates each selected contact method", () => {
  const result = validateContactPayload({
    ...validPayload,
    contactMethods: ["telegram", "email"],
    contactDetails: { telegram: "not a telegram id", email: "person@example.com" },
  }, NOW);
  assert.equal(result.ok, false);
  assert.equal(result.errors["contact.telegram"], "invalid_telegram");
});

test("accepts multiple contact methods together", () => {
  const result = validateContactPayload({
    ...validPayload,
    contactMethods: ["telegram", "email", "whatsapp"],
    contactDetails: { telegram: "@example_user", email: "person@example.com", whatsapp: "+12345678901" },
  }, NOW);
  assert.equal(result.ok, true);
  assert.deepEqual(result.data.contactMethods, ["telegram", "email", "whatsapp"]);
});

test("requires a detail for every selected contact method", () => {
  const result = validateContactPayload({
    ...validPayload,
    contactMethods: ["email", "telegram"],
    contactDetails: { email: "person@example.com" },
  }, NOW);
  assert.equal(result.ok, false);
  assert.equal(result.errors["contact.telegram"], "invalid_telegram");
});

test("rejects unknown contact detail keys", () => {
  const result = validateContactPayload({
    ...validPayload,
    contactMethods: ["email"],
    contactDetails: { email: "person@example.com", secret: "unexpected" },
  }, NOW);
  assert.equal(result.ok, false);
  assert.equal(result.errors.contactDetails, "invalid");
});

test("rejects an empty contact method selection", () => {
  const result = validateContactPayload({ ...validPayload, contactMethods: [], contactDetails: {} }, NOW);
  assert.equal(result.ok, false);
  assert.equal(result.errors.contactMethods, "invalid");
});

test("formats multiple contact methods as separate escaped Telegram fields", () => {
  const result = validateContactPayload({
    ...validPayload,
    contactMethods: ["telegram", "email"],
    contactDetails: { telegram: "@example_user", email: "person@example.com" },
  }, NOW);
  const message = formatTelegramMessage(result.data);
  assert.match(message, /تلگرام/);
  assert.match(message, /ایمیل/);
  assert.match(message, /@example_user/);
  assert.match(message, /person@example.com/);
});

test("rejects unsafe website protocols", () => {
  const result = validateContactPayload({ ...validPayload, website: "javascript:alert(1)" }, NOW);
  assert.equal(result.ok, false);
  assert.equal(result.errors.website, "invalid_url");
});

test("enforces category-specific required details on the server", () => {
  const website = validateContactPayload({ ...validPayload, projectType: "", timeline: "" }, NOW);
  assert.equal(website.errors.projectType, "required");
  assert.equal(website.errors.timeline, "required");

  const collaboration = validateContactPayload({
    ...validPayload,
    category: "collaboration",
    projectType: "",
    timeline: "",
    company: "x",
    role: "",
  }, NOW);
  assert.equal(collaboration.errors.company, "too_short");
  assert.equal(collaboration.errors.role, "required");

  const consultation = validateContactPayload({
    ...validPayload,
    category: "consultation",
    projectType: "",
    timeline: "",
  }, NOW);
  assert.equal(consultation.errors.projectType, "required");
});

test("email and phone validation match the client contract", () => {
  assert.equal(validateContactPayload({ ...validPayload, contactDetails: { email: "a@b.c" } }, NOW).errors["contact.email"], "invalid_email");
  assert.equal(validateContactPayload({ ...validPayload, contactMethods: ["phone"], contactDetails: { phone: "+1 (234) 567-8901" } }, NOW).ok, true);
  assert.equal(validateContactPayload({ ...validPayload, contactMethods: ["phone"], contactDetails: { phone: "+12-34" } }, NOW).errors["contact.phone"], "invalid_phone");
  assert.equal(validateContactPayload({ ...validPayload, contactMethods: ["whatsapp"], contactDetails: { whatsapp: "+1234567890123456" } }, NOW).errors["contact.whatsapp"], "invalid_phone");
});

test("cuts off a streamed body over 16 KiB without Content-Length", async () => {
  let cancelled = false;
  const body = new ReadableStream({
    start(controller) {
      controller.enqueue(new Uint8Array(MAX_BODY_BYTES));
      controller.enqueue(new Uint8Array([1]));
    },
    cancel() {
      cancelled = true;
    },
  });
  const request = new Request("https://portfolio.example/api/contact", {
    method: "POST",
    headers: { Origin: "https://portfolio.example", "Content-Type": "application/json" },
    body,
    duplex: "half",
  });
  const response = await onRequestPost({ request, env: {} });
  assert.equal(response.status, 413);
  assert.equal(cancelled, true);
});

test("rejects implausibly fast form submissions", () => {
  const result = validateContactPayload({ ...validPayload, formStartedAt: NOW - 100 }, NOW);
  assert.equal(result.ok, false);
  assert.equal(result.errors.form, "invalid_timing");
});

test("escapes all Telegram HTML metacharacters", () => {
  assert.equal(escapeTelegramHtml('<a href="x">&'), "&lt;a href=&quot;x&quot;&gt;&amp;");
  const message = formatTelegramMessage({
    ...validateContactPayload(validPayload, NOW).data,
    name: "<b>attacker</b>",
  });
  assert.doesNotMatch(message, /<b>attacker<\/b>/);
  assert.ok(message.includes("https://example.com/project"));
});

test("origin policy supports same-origin and explicit allowlist only", () => {
  const configured = parseAllowedOrigins("https://portfolio.example, http://localhost:5173/");
  assert.equal(isOriginAllowed("https://portfolio.example", "https://worker.example/api/contact", configured), true);
  assert.equal(isOriginAllowed("https://worker.example", "https://worker.example/api/contact", configured), true);
  assert.equal(isOriginAllowed("https://evil.example", "https://worker.example/api/contact", configured), false);
});

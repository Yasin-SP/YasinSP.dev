import {
  MAX_BODY_BYTES,
  formatTelegramMessage,
  isOriginAllowed,
  parseAllowedOrigins,
  validateContactPayload,
} from "../_lib/contact.js";

const JSON_HEADERS = Object.freeze({
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "no-referrer",
});
const RATE_WINDOW_SECONDS = 10 * 60;
const RATE_LIMIT = 5;
const memoryRateLimit = new Map();

function json(status, body, origin) {
  const headers = new Headers(JSON_HEADERS);
  if (origin) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Vary", "Origin");
  }
  return new Response(JSON.stringify(body), { status, headers });
}

function requestOrigin(request, env) {
  const origin = request.headers.get("Origin");
  const allowed = parseAllowedOrigins(env.CONTACT_ALLOWED_ORIGINS);
  return isOriginAllowed(origin, request.url, allowed) ? new URL(origin).origin : null;
}

function browserContextIsSafe(request) {
  const fetchSite = request.headers.get("Sec-Fetch-Site");
  return !fetchSite || fetchSite === "same-origin" || fetchSite === "same-site";
}

async function hashKey(value) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function rateLimit(request, env) {
  const address = request.headers.get("CF-Connecting-IP") || "unknown";
  const key = `contact:${await hashKey(address)}`;

  if (env.CONTACT_RATE_LIMIT?.get && env.CONTACT_RATE_LIMIT?.put) {
    const current = Number(await env.CONTACT_RATE_LIMIT.get(key)) || 0;
    if (current >= RATE_LIMIT) return false;
    await env.CONTACT_RATE_LIMIT.put(key, String(current + 1), {
      expirationTtl: RATE_WINDOW_SECONDS,
    });
    return true;
  }

  const now = Date.now();
  if (memoryRateLimit.size > 1000) {
    for (const [candidate, entry] of memoryRateLimit) {
      if (entry.expiresAt <= now) memoryRateLimit.delete(candidate);
    }
    if (memoryRateLimit.size > 1000) memoryRateLimit.clear();
  }
  const entry = memoryRateLimit.get(key);
  if (!entry || entry.expiresAt <= now) {
    memoryRateLimit.set(key, { count: 1, expiresAt: now + RATE_WINDOW_SECONDS * 1000 });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count += 1;
  return true;
}

async function verifyTurnstile(token, request, secret) {
  if (!secret) return true;
  if (typeof token !== "string" || token.length < 10 || token.length > 2048) return false;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const body = new URLSearchParams({ secret, response: token });
    const address = request.headers.get("CF-Connecting-IP");
    if (address) body.set("remoteip", address);
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
      signal: controller.signal,
    });
    if (!response.ok) return false;
    const result = await response.json();
    return result.success === true;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

async function sendTelegram(data, env) {
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) return false;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 7000);
  try {
    const response = await fetch(
      `https://api.telegram.org/bot${encodeURIComponent(env.TELEGRAM_BOT_TOKEN)}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: env.TELEGRAM_CHAT_ID,
          text: formatTelegramMessage(data),
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
        signal: controller.signal,
      },
    );
    if (!response.ok) return false;
    const result = await response.json();
    return result.ok === true;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

async function readBodyWithLimit(request) {
  if (!request.body?.getReader) {
    const text = await request.text();
    return new TextEncoder().encode(text).byteLength > MAX_BODY_BYTES
      ? { tooLarge: true }
      : { text };
  }

  const reader = request.body.getReader();
  const decoder = new TextDecoder("utf-8", { fatal: true });
  let total = 0;
  let text = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > MAX_BODY_BYTES) {
        await reader.cancel();
        return { tooLarge: true };
      }
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
    return { text };
  } catch {
    try {
      await reader.cancel();
    } catch {
      // The stream may already be closed.
    }
    return { invalid: true };
  }
}

export async function onRequestOptions({ request, env }) {
  const origin = requestOrigin(request, env);
  if (!origin || !browserContextIsSafe(request)) return json(403, { ok: false, error: "forbidden" });
  const headers = new Headers({
    ...JSON_HEADERS,
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "600",
    Vary: "Origin",
  });
  return new Response(null, { status: 204, headers });
}

export function onRequestGet() {
  return json(405, { ok: false, error: "method_not_allowed" });
}

export async function onRequestPost({ request, env }) {
  const origin = requestOrigin(request, env);
  if (!origin || !browserContextIsSafe(request)) return json(403, { ok: false, error: "forbidden" });

  const contentType = request.headers.get("Content-Type") || "";
  if (!contentType.toLowerCase().startsWith("application/json")) {
    return json(415, { ok: false, error: "unsupported_media_type" }, origin);
  }

  const declaredSize = Number(request.headers.get("Content-Length"));
  if (Number.isFinite(declaredSize) && declaredSize > MAX_BODY_BYTES) {
    return json(413, { ok: false, error: "payload_too_large" }, origin);
  }

  let body;
  try {
    body = await readBodyWithLimit(request);
  } catch {
    return json(400, { ok: false, error: "invalid_request" }, origin);
  }
  if (body.tooLarge) {
    return json(413, { ok: false, error: "payload_too_large" }, origin);
  }
  if (body.invalid) {
    return json(400, { ok: false, error: "invalid_request" }, origin);
  }

  let payload;
  try {
    payload = JSON.parse(body.text);
  } catch {
    return json(400, { ok: false, error: "invalid_request" }, origin);
  }

  // Bots filling this hidden field receive a non-revealing success response.
  if (typeof payload.honeypot === "string" && payload.honeypot.trim()) {
    return json(200, { ok: true }, origin);
  }

  const validation = validateContactPayload(payload);
  if (!validation.ok) {
    return json(400, { ok: false, error: "invalid_request", fields: validation.errors }, origin);
  }

  if (!(await rateLimit(request, env))) {
    return json(429, { ok: false, error: "too_many_requests" }, origin);
  }

  if (!(await verifyTurnstile(payload.turnstileToken, request, env.TURNSTILE_SECRET_KEY))) {
    return json(400, { ok: false, error: "verification_failed" }, origin);
  }

  if (!(await sendTelegram(validation.data, env))) {
    return json(502, { ok: false, error: "delivery_unavailable" }, origin);
  }

  return json(200, { ok: true }, origin);
}

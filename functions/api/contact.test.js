import test from "node:test";
import assert from "node:assert/strict";
import { onRequestPost } from "./contact.js";

const endpoint = "https://portfolio.test/api/contact";
const env = {
  TELEGRAM_BOT_TOKEN: "123456:test_token",
  TELEGRAM_CHAT_ID: "123456",
  CONTACT_ALLOWED_ORIGINS: "https://portfolio.test",
};

function payload(overrides = {}) {
  return {
    category: "website",
    projectType: "portfolio",
    timeline: "month",
    name: "Test User",
    contactMethods: ["telegram"],
    contactDetails: { telegram: "@test_user" },
    message: "A legitimate project inquiry.",
    formStartedAt: Date.now() - 2_000,
    honeypot: "",
    ...overrides,
  };
}

function request(body, { origin = "https://portfolio.test", ip = crypto.randomUUID() } = {}) {
  return new Request(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: origin,
      "Sec-Fetch-Site": "same-origin",
      "CF-Connecting-IP": ip,
    },
    body: JSON.stringify(body),
  });
}

test("delivers a valid request and escapes Telegram HTML", async () => {
  const originalFetch = globalThis.fetch;
  let telegramBody;
  globalThis.fetch = async (_url, init) => {
    telegramBody = JSON.parse(init.body);
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  };

  try {
    const response = await onRequestPost({
      request: request(payload({ message: "Please review <script>alert(1)</script>." })),
      env,
    });
    assert.equal(response.status, 200);
    assert.equal((await response.json()).ok, true);
    assert.doesNotMatch(telegramBody.text, /<script>/u);
    assert.match(telegramBody.text, /&lt;script&gt;/u);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("rejects a forged Origin before delivery", async () => {
  const response = await onRequestPost({
    request: request(payload(), { origin: "https://evil.test" }),
    env,
  });
  assert.equal(response.status, 403);
});

test("silently discards honeypot submissions without contacting Telegram", async () => {
  const originalFetch = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async () => {
    calls += 1;
    return new Response(JSON.stringify({ ok: true }));
  };

  try {
    const response = await onRequestPost({
      request: request(payload({ honeypot: "spam" })),
      env,
    });
    assert.equal(response.status, 200);
    assert.equal(calls, 0);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("rejects payloads above 16 KiB", async () => {
  const response = await onRequestPost({
    request: request(payload({ message: "x".repeat(17 * 1024) })),
    env,
  });
  assert.equal(response.status, 413);
});

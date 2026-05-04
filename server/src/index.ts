import { Hono } from "hono";
import { cors } from "hono/cors";
import { sendToDiscord } from "./discord.js";

const app = new Hono();

const ALLOWED_ORIGINS = [
  "https://polskabezglutenu.pl",
  "http://localhost:4321",
];

app.use("*", cors({ origin: ALLOWED_ORIGINS }));

const MAX_BODY_SIZE = 10 * 1024;

const SUBMIT_PLACE_FIELDS = [
  "nazwa",
  "kategorie",
  "miejscowość",
  "adres",
  "tylko-bezglutenowe",
  "opis",
  "www",
  "lat",
  "lng",
  "komentarz",
] as const;

const SUBMIT_PLACE_REQUIRED = ["nazwa", "kategorie", "miejscowość", "adres", "tylko-bezglutenowe"];

const REPORT_PROBLEM_FIELDS = [
  "nazwa",
  "typ-problemu",
  "opis-problemu",
  "poprawne-dane",
  "źródło",
  "dodatkowe-informacje",
] as const;

const REPORT_PROBLEM_REQUIRED = ["nazwa", "typ-problemu", "opis-problemu"];

const MAX_FIELD_LENGTH: Record<string, number> = {
  nazwa: 256,
  kategorie: 256,
  miejscowość: 128,
  adres: 256,
  "tylko-bezglutenowe": 16,
  opis: 1024,
  www: 512,
  lat: 32,
  lng: 32,
  komentarz: 1024,
  "typ-problemu": 256,
  "opis-problemu": 1024,
  "poprawne-dane": 1024,
  źródło: 256,
  "dodatkowe-informacje": 1024,
};

function sanitizeValue(value: string): string {
  let sanitized = value
    .replace(/@everyone/gi, "")
    .replace(/@here/gi, "")
    .replace(/<@&?\d+>/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1");
  return sanitized;
}

function filterFields(
  body: Record<string, unknown>,
  allowed: readonly string[],
  required: string[],
): { ok: true; data: Record<string, string> } | { ok: false; error: string } {
  const data: Record<string, string> = {};

  for (const field of allowed) {
    const value = body[field];
    if (value !== undefined && value !== null) {
      if (typeof value !== "string") {
        return { ok: false, error: `Pole "${field}" ma niepoprawny format.` };
      }
      const maxLen = MAX_FIELD_LENGTH[field] ?? 256;
      data[field] = sanitizeValue(value).slice(0, maxLen);
    }
  }

  for (const field of required) {
    if (!data[field] || data[field].trim() === "") {
      return { ok: false, error: `Pole "${field}" jest wymagane.` };
    }
  }

  return { ok: true, data };
}

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
const RATE_WINDOW = 60_000;

function getIp(c: { req: { header: (n: string) => string | undefined } }): string {
  return c.req.header("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT;
}

setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap) {
    if (now > entry.resetAt) rateLimitMap.delete(ip);
  }
}, RATE_WINDOW);

const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

if (!WEBHOOK_URL) {
  console.error("DISCORD_WEBHOOK_URL env var is required");
  process.exit(1);
}

app.post("/api/submit-place", async (c) => {
  const ip = getIp(c);
  if (rateLimit(ip)) {
    return c.json({ ok: false, error: "Za dużo zgłoszeń. Spróbuj ponownie za chwilę." }, 429);
  }

  let body: Record<string, unknown>;
  try {
    const raw = await c.req.arrayBuffer();
    if (raw.byteLength > MAX_BODY_SIZE) {
      return c.json({ ok: false, error: "Zgłoszenie jest za duże." }, 413);
    }
    body = JSON.parse(Buffer.from(raw).toString()) as Record<string, unknown>;
  } catch {
    return c.json({ ok: false, error: "Niepoprawne dane." }, 400);
  }

  if (body._hp && typeof body._hp === "string" && body._hp.trim() !== "") {
    return c.json({ ok: true });
  }

  const result = filterFields(body, SUBMIT_PLACE_FIELDS, SUBMIT_PLACE_REQUIRED);
  if (!result.ok) {
    return c.json({ ok: false, error: result.error }, 400);
  }

  try {
    await sendToDiscord(WEBHOOK_URL, result.data, "new-place");
    return c.json({ ok: true });
  } catch (err) {
    console.error("Discord webhook error:", err);
    return c.json({ ok: false, error: "Wystąpił błąd. Spróbuj ponownie później." }, 500);
  }
});

app.post("/api/report-problem", async (c) => {
  const ip = getIp(c);
  if (rateLimit(ip)) {
    return c.json({ ok: false, error: "Za dużo zgłoszeń. Spróbuj ponownie za chwilę." }, 429);
  }

  let body: Record<string, unknown>;
  try {
    const raw = await c.req.arrayBuffer();
    if (raw.byteLength > MAX_BODY_SIZE) {
      return c.json({ ok: false, error: "Zgłoszenie jest za duże." }, 413);
    }
    body = JSON.parse(Buffer.from(raw).toString()) as Record<string, unknown>;
  } catch {
    return c.json({ ok: false, error: "Niepoprawne dane." }, 400);
  }

  if (body._hp && typeof body._hp === "string" && body._hp.trim() !== "") {
    return c.json({ ok: true });
  }

  const result = filterFields(body, REPORT_PROBLEM_FIELDS, REPORT_PROBLEM_REQUIRED);
  if (!result.ok) {
    return c.json({ ok: false, error: result.error }, 400);
  }

  try {
    await sendToDiscord(WEBHOOK_URL, result.data, "data-problem");
    return c.json({ ok: true });
  } catch (err) {
    console.error("Discord webhook error:", err);
    return c.json({ ok: false, error: "Wystąpił błąd. Spróbuj ponownie później." }, 500);
  }
});

import { serve } from "@hono/node-server";
const port = parseInt(process.env.PORT ?? "3001", 10);
serve({ fetch: app.fetch, port }, () => {
  console.log(`Server running on port ${port}`);
});
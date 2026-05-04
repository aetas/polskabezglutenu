import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { sendToDiscord } from "./discord.js";

const app = new Hono();

const ALLOWED_ORIGINS = [
  "https://polskabezglutenu.pl",
  "http://localhost:4321",
];

app.use("*", cors({ origin: ALLOWED_ORIGINS }));

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

  const body = await c.req.json<Record<string, string>>();

  if (body._hp) {
    return c.json({ ok: true });
  }

  const required = ["nazwa", "kategorie", "miejscowość", "adres", "tylko-bezglutenowe"];
  for (const field of required) {
    if (!body[field] || body[field].trim() === "") {
      return c.json({ ok: false, error: `Pole "${field}" jest wymagane.` }, 400);
    }
  }

  try {
    await sendToDiscord(WEBHOOK_URL, body, "new-place");
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

  const body = await c.req.json<Record<string, string>>();

  if (body._hp) {
    return c.json({ ok: true });
  }

  const required = ["nazwa", "typ-problemu", "opis-problemu"];
  for (const field of required) {
    if (!body[field] || body[field].trim() === "") {
      return c.json({ ok: false, error: `Pole "${field}" jest wymagane.` }, 400);
    }
  }

  try {
    await sendToDiscord(WEBHOOK_URL, body, "data-problem");
    return c.json({ ok: true });
  } catch (err) {
    console.error("Discord webhook error:", err);
    return c.json({ ok: false, error: "Wystąpił błąd. Spróbuj ponownie później." }, 500);
  }
});

const port = parseInt(process.env.PORT ?? "3001", 10);
serve({ fetch: app.fetch, port }, () => {
  console.log(`Server running on port ${port}`);
});
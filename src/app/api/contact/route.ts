import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { intents } from "@/content/site";
import { normalise, validate, type ContactInput, type ContactResponse } from "@/lib/contact";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 10_000;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

/**
 * Best-effort, per-instance rate limit. Good enough to blunt casual abuse on
 * a single server; put a shared store (e.g. Upstash/Redis) in front for
 * multi-region serverless deployments.
 */
const hits = new Map<string, number[]>();
function limited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
  }
  return recent.length > MAX_PER_WINDOW;
}

function json(body: ContactResponse, status: number) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

function clientKey(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  return (fwd?.split(",")[0] ?? req.headers.get("x-real-ip") ?? "unknown").trim();
}

function sameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true; // non-browser clients; still validated + rate limited
  try {
    const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function summary(input: ContactInput) {
  const intentLabel = intents.find((i) => i.value === input.intent)?.label ?? input.intent;
  return { intentLabel, subject: `The Last Page — ${intentLabel} — ${input.name}` };
}

type Channel = { name: string; send: (input: ContactInput) => Promise<void> };

function channels(): Channel[] {
  const list: Channel[] = [];
  const webhook = process.env.CONTACT_WEBHOOK_URL;
  if (webhook && webhook.startsWith("https://")) {
    list.push({
      name: "webhook",
      send: async (input) => {
        const { intentLabel, subject } = summary(input);
        const res = await fetch(webhook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: `${subject}\n${input.email}${input.organisation ? ` · ${input.organisation}` : ""}\n\n${input.message}`,
            intent: input.intent,
            intentLabel,
            name: input.name,
            email: input.email,
            organisation: input.organisation,
            message: input.message,
            submittedAt: new Date().toISOString(),
          }),
          signal: AbortSignal.timeout(8000),
        });
        if (!res.ok) throw new Error(`webhook ${res.status}`);
      },
    });
  }

  const resendKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (resendKey && to) {
    list.push({
      name: "resend",
      send: async (input) => {
        const { intentLabel, subject } = summary(input);
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            from: process.env.CONTACT_FROM_EMAIL || "The Last Page <onboarding@resend.dev>",
            to: [to],
            reply_to: input.email,
            subject,
            text: `${intentLabel}\n\nFrom: ${input.name} <${input.email}>\nOrganisation: ${input.organisation || "—"}\n\n${input.message}`,
            html: `<p><strong>${escapeHtml(intentLabel)}</strong></p><p>From: ${escapeHtml(input.name)} &lt;${escapeHtml(input.email)}&gt;<br/>Organisation: ${escapeHtml(input.organisation || "—")}</p><p style="white-space:pre-wrap">${escapeHtml(input.message)}</p>`,
          }),
          signal: AbortSignal.timeout(8000),
        });
        if (!res.ok) throw new Error(`resend ${res.status}`);
      },
    });
  }

  if (process.env.NODE_ENV === "development" || process.env.CONTACT_STORE === "file") {
    list.push({
      name: "file",
      send: async (input) => {
        const dir = path.join(process.cwd(), ".data");
        await mkdir(dir, { recursive: true });
        const record = { intent: input.intent, name: input.name, email: input.email, organisation: input.organisation, message: input.message };
        await appendFile(path.join(dir, "submissions.ndjson"), JSON.stringify({ ...record, submittedAt: new Date().toISOString() }) + "\n", "utf8");
      },
    });
  }
  return list;
}

export async function POST(req: Request) {
  if (!sameOrigin(req)) return json({ ok: false, code: "forbidden" }, 403);
  if (!(req.headers.get("content-type") ?? "").includes("application/json")) return json({ ok: false, code: "bad_request" }, 415);

  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) return json({ ok: false, code: "bad_request" }, 413);

  if (limited(clientKey(req))) return json({ ok: false, code: "rate_limited" }, 429);

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("shape");
    body = parsed as Record<string, unknown>;
  } catch {
    return json({ ok: false, code: "bad_request" }, 400);
  }

  const input = normalise(body);
  // Honeypot: bots fill every field. Accept silently, deliver nothing.
  if (input.website) return json({ ok: true }, 200);

  const errors = validate(input);
  if (Object.keys(errors).length) return json({ ok: false, code: "invalid", errors }, 422);

  const targets = channels();
  if (!targets.length) return json({ ok: false, code: "not_configured" }, 503);

  const results = await Promise.allSettled(targets.map((c) => c.send(input)));
  const delivered = results.some((r) => r.status === "fulfilled");
  results.forEach((r, i) => {
    if (r.status === "rejected") console.error(`[contact] ${targets[i]!.name} failed:`, r.reason instanceof Error ? r.reason.message : r.reason);
  });
  if (!delivered) return json({ ok: false, code: "delivery_failed" }, 502);
  return json({ ok: true }, 200);
}

export function GET() {
  return new Response("Method Not Allowed", { status: 405, headers: { Allow: "POST" } });
}

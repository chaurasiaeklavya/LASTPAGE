import { intents, type Intent } from "@/content/site";

export type ContactInput = {
  intent: Intent;
  name: string;
  email: string;
  organisation: string;
  message: string;
  /** honeypot — must stay empty */
  website?: string;
};

export type FieldErrors = Partial<Record<"intent" | "name" | "email" | "organisation" | "message", string>>;

export const LIMITS = {
  name: { min: 2, max: 80 },
  email: { max: 160 },
  organisation: { max: 120 },
  message: { min: 10, max: 2000 },
} as const;

const EMAIL = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]{2,}$/;
const intentValues = new Set<string>(intents.map((i) => i.value));

/** Strip control characters (keep newlines/tabs in the message) and trim. */
export function clean(value: unknown, multiline = false): string {
  if (typeof value !== "string") return "";
  const stripped = multiline ? value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "") : value.replace(/[\u0000-\u001F\u007F]/g, " ");
  return stripped.trim();
}

export function normalise(raw: Record<string, unknown>): ContactInput {
  return {
    intent: (clean(raw.intent) || "other") as Intent,
    name: clean(raw.name).replace(/\s+/g, " "),
    email: clean(raw.email).toLowerCase(),
    organisation: clean(raw.organisation).replace(/\s+/g, " "),
    message: clean(raw.message, true),
    website: clean(raw.website),
  };
}

export function validate(input: ContactInput): FieldErrors {
  const e: FieldErrors = {};
  if (!intentValues.has(input.intent)) e.intent = "Choose what you’d like to do.";
  if (input.name.length < LIMITS.name.min) e.name = "Tell us your name.";
  else if (input.name.length > LIMITS.name.max) e.name = `Keep it under ${LIMITS.name.max} characters.`;
  if (!input.email) e.email = "We need an email to reply to.";
  else if (input.email.length > LIMITS.email.max || !EMAIL.test(input.email)) e.email = "That email doesn’t look right.";
  if (input.organisation.length > LIMITS.organisation.max) e.organisation = `Keep it under ${LIMITS.organisation.max} characters.`;
  if (input.message.length < LIMITS.message.min) e.message = `A little more detail, please — at least ${LIMITS.message.min} characters.`;
  else if (input.message.length > LIMITS.message.max) e.message = `Keep it under ${LIMITS.message.max} characters.`;
  return e;
}

export type ContactResponse =
  | { ok: true }
  | { ok: false; code: "invalid"; errors: FieldErrors }
  | { ok: false; code: "rate_limited" | "not_configured" | "delivery_failed" | "bad_request" | "forbidden" };

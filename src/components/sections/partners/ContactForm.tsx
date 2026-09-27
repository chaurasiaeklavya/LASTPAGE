"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { intents, INSTAGRAM_URL, INSTAGRAM_HANDLE, type Intent } from "@/content/site";
import { LIMITS, normalise, validate, type ContactResponse, type FieldErrors } from "@/lib/contact";
import { ArrowRight, ArrowUpRight } from "@/components/ui/icons";
import styles from "./ContactForm.module.css";

type Status = "idle" | "submitting" | "success" | "error";

const messages: Record<string, string> = {
  rate_limited: "That’s a lot of messages in a short time. Give it a few minutes and try again.",
  not_configured: "This form isn’t connected to an inbox on this deployment yet, so nothing was sent.",
  delivery_failed: "We couldn’t deliver your message just now. Nothing was lost on your side — try again in a moment.",
  network: "You seem to be offline, or the connection dropped. Check it and try again.",
  default: "Something went wrong on our side. Try again in a moment.",
};

export function ContactForm() {
  const uid = useId();
  const [intent, setIntent] = useState<Intent>("host");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [errorCode, setErrorCode] = useState<string>("default");
  const [count, setCount] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  // Any link on the page with data-intent pre-selects the matching option.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-intent]");
      const value = a?.dataset.intent as Intent | undefined;
      if (value && intents.some((i) => i.value === value)) {
        setIntent(value);
        if (status === "success") setStatus("idle");
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [status]);

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
    if (status === "error") errorRef.current?.focus();
  }, [status]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "submitting") return;
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const input = normalise({ ...data, intent });
    const found = validate(input);
    setErrors(found);
    if (Object.keys(found).length) {
      const first = Object.keys(found)[0];
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...input, website: String(data.website ?? "") }),
      });
      const body = (await res.json().catch(() => ({ ok: false, code: "default" }))) as ContactResponse;
      if (body.ok) {
        setStatus("success");
        form.reset();
        setCount(0);
        return;
      }
      if (body.code === "invalid") {
        setErrors(body.errors);
        setStatus("idle");
        return;
      }
      setErrorCode(body.code);
      setStatus("error");
    } catch {
      setErrorCode("network");
      setStatus("error");
    }
  };

  const field = (name: keyof FieldErrors) => ({
    id: `${uid}-${name}`,
    name,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${uid}-${name}-error` : undefined,
    onInput: () => errors[name] && setErrors((prev) => ({ ...prev, [name]: undefined })),
  });

  if (status === "success") {
    return (
      <div className={styles.success} role="status">
        <span className={styles.check} aria-hidden="true" />
        <h3 ref={successRef} tabIndex={-1} className={styles.successTitle}>
          Received.
        </h3>
        <p className={styles.successText}>Your message has been sent to The Last Page team. Any reply will go to the email you gave us.</p>
        <button type="button" className={styles.again} onClick={() => setStatus("idle")}>
          Send another
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} className={styles.form} onSubmit={onSubmit} noValidate aria-busy={status === "submitting"}>
      <fieldset className={styles.intents}>
        <legend className={styles.legend}>I’d like to</legend>
        <div className={styles.chips}>
          {intents.map((i) => (
            <label key={i.value} className={styles.chip}>
              <input
                type="radio"
                name="intent"
                value={i.value}
                checked={intent === i.value}
                onChange={() => setIntent(i.value)}
                className={styles.radio}
              />
              <span>{i.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor={`${uid}-name`}>Your name</label>
          <input {...field("name")} type="text" autoComplete="name" maxLength={LIMITS.name.max} required />
          {errors.name ? <p id={`${uid}-name-error`} className={styles.error}>{errors.name}</p> : null}
        </div>
        <div className={styles.field}>
          <label htmlFor={`${uid}-email`}>Email</label>
          <input {...field("email")} type="email" autoComplete="email" inputMode="email" maxLength={LIMITS.email.max} required />
          {errors.email ? <p id={`${uid}-email-error`} className={styles.error}>{errors.email}</p> : null}
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor={`${uid}-organisation`}>
          Organisation, studio or campus <span className={styles.optional}>optional</span>
        </label>
        <input {...field("organisation")} type="text" autoComplete="organization" maxLength={LIMITS.organisation.max} />
        {errors.organisation ? <p id={`${uid}-organisation-error`} className={styles.error}>{errors.organisation}</p> : null}
      </div>

      <div className={styles.field}>
        <label htmlFor={`${uid}-message`}>What do you have in mind?</label>
        <textarea
          {...field("message")}
          rows={5}
          maxLength={LIMITS.message.max}
          required
          onChange={(e) => setCount(e.target.value.length)}
        />
        <div className={styles.meta}>
          {errors.message ? (
            <p id={`${uid}-message-error`} className={styles.error}>
              {errors.message}
            </p>
          ) : (
            <span />
          )}
          <span className={styles.count} aria-hidden="true">
            {count}/{LIMITS.message.max}
          </span>
        </div>
      </div>

      {/* Honeypot: invisible to people, irresistible to bots. */}
      <div className={styles.hp} aria-hidden="true">
        <label htmlFor={`${uid}-website`}>Website</label>
        <input id={`${uid}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {status === "error" ? (
        <div ref={errorRef} tabIndex={-1} className={styles.alert} role="alert">
          <p>{messages[errorCode] ?? messages.default}</p>
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
            Message {INSTAGRAM_HANDLE} instead <ArrowUpRight size={14} />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      ) : null}

      <div className={styles.submitRow}>
        <p className={styles.privacy}>We use these details only to reply.</p>
        <button type="submit" className={styles.submit} disabled={status === "submitting"}>
          {status === "submitting" ? (
            <>
              <span className={styles.spinner} aria-hidden="true" /> Sending…
            </>
          ) : (
            <>
              Send <ArrowRight size={18} />
            </>
          )}
        </button>
      </div>
    </form>
  );
}

# The Last Page

**From learning design to building a creative career.** A community built from Divergent Classes.

This repository is the website for THE LAST PAGE, designed as an issue of a publication: eleven numbered pages, from the cover to "the last page", where the reader's next chapter starts. How it was derived from the supplied deck and media kit, and why each decision was made, is in [`docs/STRATEGY.md`](docs/STRATEGY.md).

## Stack

- **Next.js 16** (App Router, Turbopack), **React 19**, **TypeScript** (strict)
- **CSS Modules** on a single token layer (`src/app/globals.css`)
- **GSAP + ScrollTrigger** and **Lenis**, loaded on idle and never on the critical path
- Self-hosted variable subsets of **Space Grotesk**, **Hanken Grotesk** and **Inter**
- **Playwright + axe-core** for end-to-end and accessibility tests

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm start
```

Checks:

```bash
npm run typecheck
npm run lint
npm run test:e2e     # builds, starts on :3100, runs desktop + mobile suites
```

## The "Build with us" form

`POST /api/contact` validates input (the same rules as the client), rejects cross-origin posts and oversized bodies, rate-limits by IP, and silently drops honeypot hits. It then delivers to every channel you configure (see `.env.example`):

| Variable | Channel |
| --- | --- |
| `CONTACT_WEBHOOK_URL` | Any HTTPS endpoint that accepts JSON (Slack, Discord, Zapier, Make, Apps Script…) |
| `RESEND_API_KEY` + `CONTACT_TO_EMAIL` (+ `CONTACT_FROM_EMAIL`) | Email via Resend |
| `CONTACT_STORE=file` | Appends to `.data/submissions.ndjson` (self-hosted servers only; always on in `next dev`) |

If no channel is configured, the API returns `503 not_configured`, and the form tells the visitor that nothing was sent and offers Instagram instead. It never fakes success.

Set `NEXT_PUBLIC_SITE_URL` to the production domain for canonical URLs, the sitemap and Open Graph.

## Structure

```
src/
  app/                 routes, metadata (OG image, sitemap, robots, manifest), /brand, 404, /api/contact
  content/site.ts      every string on the site, each traced to its source page
  components/
    layout/            Nav + contents dialog, Page (running head + sheet), Footer, cursor, smooth scroll
    sections/          one component per page of the issue
    motion/            small scroll primitives (reveals, sheets, drift, spin, parallax, draw, progress)
    ui/                Action (every CTA), Burst (exact brand geometry), Wordmark, icons
  lib/                 motion loader, contact validation, site URL
public/media/          assets extracted from the supplied PDFs (see docs/STRATEGY.md §1)
tests/e2e/             Playwright + axe
```

## Principles the code enforces

- **Content integrity.** Copy lives in `src/content/site.ts` with source references (`[D4]` = deck page 4, `[K2]` = kit page 2). Nothing there is invented: no testimonials, statistics, partners or outcomes. Required caveats (the ecosystem-figures note, the guest-session disclaimer) are covered by tests.
- **Works without motion.** Every entrance is gated on a pre-paint `prefers-reduced-motion` check. With reduced motion, pinning becomes a stepper and nothing starts hidden. If JavaScript fails, nothing is ever hidden.
- **Accessible by default.** Semantic landmarks and headings, visible focus, keyboard-operable tabs, dialogs and sliders, and contrast and target sizes checked against WCAG 2.2 AA in the test suite (primary controls are 44 px or larger).
- **Performance as design.** Static pages, ~90 KB of fonts, AVIF/WebP images, and motion code loaded after interactivity. The cover's hero render "develops" out of black (brightness, not opacity), so it counts as the first large paint.

## Open items

See `docs/STRATEGY.md` §9. In short: the reference site URL (the competitive teardown could not be run from this environment), the DICE / EIZO naming, the production domain, and a form delivery channel.

# The Last Page — source audit, strategy and decisions

This document records how the site was derived from the supplied material, what
could and could not be verified, and why the main design decisions were made.

## 1. Sources inspected

| Source | Pages | How it was read | What it contributed |
| --- | --- | --- | --- |
| `The-Last-Page-A4-Borderless.pdf` (the deck, author: Divergent Classes) | 14 | Text layer + every page rendered and inspected visually; embedded images extracted; vector geometry of the burst extracted from clip paths; link annotations read | All headlines and copy, the session with Amrita Bisht, roadmap, ecosystem figures and their caveat, partner roles, vision, Instagram link, hero and network imagery, poster |
| `TLP_MEDIA_KIT_WITH_CS.pdf` (media & brand kit) | 7 | **No text layer** — read entirely from rendered pages; images extracted with alpha masks | Brand description and mission, word mark (V1) and stacked V2, palette `#D0FF00 / #5200FF / #FFFFFF`, typography roles, folder and grid-background assets, the DICE character sheet, usage do/don't rules |
| QR code on deck p.14 | — | Decoded | Confirms `https://www.instagram.com/thelastpage.school/` (matches the link annotation) |

### Findings worth flagging

- **Character name conflict.** The kit's character sheet is titled **DICE** on the page, but the underlying artwork says **EIZO**, and the personality paragraph refers to "Eizo". The site uses **DICE** (the visible, most recent title). *Needs confirmation.*
- **Mentorship / portfolio reviews.** The kit's boilerplate lists "mentorship, portfolio reviews" among activities; the deck's roadmap places *portfolio critique* and *mentor-led projects* under **Next**, not Now. The site shows the roadmap status honestly and quotes the boilerplate verbatim only on `/brand` as the official press description. *Worth aligning.*
- **Audience line.** "UCEED, NID, NIFT design programmes and top private schools. Final-year and pre-placement cohorts." comes from the kit's sample card (whose title is placeholder text). Used as "Who's in the room". *Confirm it is intended.*
- **Ecosystem figures** (200K+, 10,000+, ₹2 Cr+) are Divergent Classes figures. They appear with the deck's own note: "Divergent Classes ecosystem figures. Revenue is not standalone The Last Page revenue."
- The session is marked in the deck as "Guest practitioner session, not a corporate partnership announcement." That sentence stays visible next to it.

## 2. Competitive baseline

The brief describes a reference website as the competitive baseline, but **no URL was supplied**, and this build environment's network policy blocks the candidate hosts (`divergentclasses.com`, `instagram.com`, `thelastpage.*`). A live teardown of structure, motion, performance and markup was therefore **not verifiable**. Nothing in this repository claims features of that site.

What was used instead as the bar to beat: the supplied deck itself (a static, card-based slide language), plus the common failure modes of the category: slogan heroes, stock imagery, three-card feature rows, fabricated testimonials, and one generic "Get started" button repeated everywhere.

**Action for the team:** share the reference URL (or allow the host in the environment's network settings) and the audit can be completed against it.

## 3. Concept — "an issue, not a landing page"

The name carries the idea: a publication whose *last page* is where a reader's own next chapter begins ("Your next chapter starts here", deck p.14). The site is built as that publication:

- **Eleven numbered pages**, cover to "the last page", each opening with a running head (publication · section · folio) and the deck's hairline rules.
- **Pages are sheets.** Every page after the cover slides over the previous one with rounded top corners that flatten as it arrives, which is where the colour changes (lime, white, violet) happen.
- **The desk.** The kit's retro computer, folders and grid backgrounds are the tools of making, so the work section is a desktop with files you open.
- **The crit.** Annotations, stamps and pins, used where decisions are being shown.

The core promise, "Show the decisions. Skip the generic advice.", is **demonstrated, not described**: p.04 holds a working, eight-step decision log of how this site's own cover was designed (brief → explore → compare → reject → decide → iterate → ship → reflect). Everything it describes is really on the page, so it is evidence, not decoration.

## 4. Narrative (and the source behind each page)

| p. | Page | Job in the story | Source |
| --- | --- | --- | --- |
| 00 | Cover | Attention + proposition in one poster | D1, K2 |
| 01 | The gap | The problem as three questions, each linking to its answer | D2 |
| 02 | The idea | Philosophy + what this is | D3, K1 |
| 03 | Session file | A real practitioner session, humanly presented | D4 |
| 04 | Show the decisions | The signature: formats + live decision log | D5 (+ this build) |
| 05 | On the desk | Real artifacts, annotated | D4 poster, K2, K5 |
| 06 | The loop | Keep learning after a session; honest status | D8 |
| 07 | The pathway | Learning → career on the actual Now/Next/Later roadmap; scale signals | D9, D12 |
| 08 | People | Growth through guest designers, campus clubs, alumni; ecosystem credibility | D7, D6, K4 |
| 09 | Build with us | Partner roles, proposed formats, a working form | D11, D10, D14 |
| 10 | The last page | Vision, then "Your next chapter starts here" | D13, D14 |

Contextual calls to action follow the deck's own verbs: *Join the community*, *Host a session*, *Co-host on campus*, *Bring a brief*, *Share a process*, *Support access*, *Build with us*. Links that pre-fill the form set its intent automatically.

## 5. Design system

- **Colour:** brand lime, violet, white on the kit's `#1D1D1D`; tints only (deep ink, raised ink, violet tint). Violet is never used for small text on dark.
- **Type:** Space Grotesk (display, word mark), Hanken Grotesk (reading), Inter (labels and figures), self-hosted variable subsets (~90 KB total, ₹ served from a 1 KB glyph file).
- **Scale:** fluid `clamp()` steps from label to a 22rem cover mark; display tracking is tight but opened enough that "TT" pairs don't seam.
- **Grid:** 12 columns, fluid gutters and margins, 1680 px max.
- **Shape:** 20 px cards (the deck's radius, scaled), pills for actions, sheet radius 20–44 px.
- **Burst:** drawn from the deck's actual polygon coordinates, not redrawn by eye.

## 6. Motion hierarchy

1. **Micro:** button fills, arrow swaps, magnetic primary CTAs, contextual cursor labels (fine pointers only; the native cursor is never hidden).
2. **Section:** line reveals as content reaches the viewport edge; sheet corners flattening; drifting headline lines; a scroll-drawn loop; a progress rail.
3. **Story:** the pinned decision log, which snaps once per move.
4. **Signature (once):** the cover. The CRT powers on at load (pure CSS, from the first paint), and on desktop, scrolling pushes the camera into the blank screen and through to p.01.

With reduced motion there is no pinning and no parallax; the decision log becomes a stepper, and every word is visible at first paint. Motion code (GSAP, ScrollTrigger, Lenis) loads on idle and is never on the critical path.

## 7. Deliberately not built

- **WebGL / Three.js:** the brand's 3D look already exists in its renders; a scene would cost performance and add no meaning.
- **Sound:** nothing in the story is improved by audio.
- **Testimonials, logos, student outcomes, founder bio, extra practitioners:** none were supplied, so none were invented. The session page points to Instagram for upcoming sessions rather than inventing dates.
- **A third pinned sequence** (for the pathway): a single legible timeline was clearer than another scroll-jacked moment.

## 8. Engineering notes

- Next.js 16 App Router; every page is statically prerendered except `/api/contact`.
- The form posts to `/api/contact`: shared validation, honeypot, same-origin check, 10 KB body limit, per-instance rate limit (5 per 10 min). It delivers via webhook, Resend, or an append-only file, and **returns `503 not_configured` rather than pretending to succeed** when no channel is set up. The UI says nothing was sent and offers Instagram.
- Security headers: CSP (no third-party origins), HSTS, `X-Frame-Options: DENY`, `nosniff`, a strict referrer policy, a locked-down permissions policy, and no `X-Powered-By`.
- Measured with Lighthouse on the production build: desktop 100/100/100/100; mobile (simulated slow 4G, 4× CPU) ~90–95 performance, 100 accessibility, best practices and SEO. CLS 0.
- Playwright + axe: 26 tests across desktop and mobile, including WCAG 2.2 AA.

## 9. Open questions for the client

1. Reference site URL, to complete the competitive teardown.
2. DICE or EIZO?
3. Production domain (sets canonical, sitemap and OG URLs via `NEXT_PUBLIC_SITE_URL`).
4. Where form submissions should go (webhook or Resend inbox).
5. Next session details and any practitioner or founder material that can be published.

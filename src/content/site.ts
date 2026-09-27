/**
 * Single source of truth for all copy and data on the site.
 *
 * Source key used in comments:
 *   [D#]  = "The Last Page | Borderless A4" deck, page #
 *   [K#]  = "TLP Media & Brand Kit", page #
 *   [SITE] = written for this website (framing copy only — no factual claims)
 *
 * Rules: never add statistics, people, partners, outcomes or quotes that are
 * not in the supplied sources. Status of every offering follows the deck's
 * Now / Next / Later roadmap [D9].
 */

export const INSTAGRAM_URL = "https://www.instagram.com/thelastpage.school/"; // [D14] link annotation + QR
export const INSTAGRAM_HANDLE = "@thelastpage.school"; // [D14]

export const site = {
  name: "The Last Page",
  tagline: "From learning design to building a creative career.", // [D1]
  origin: "A community built from Divergent Classes.", // [D1]
  description:
    "The Last Page is a community for the next generation of designers, creators and innovators, built from Divergent Classes. Practitioner-led sessions, real design decisions and a community to keep learning with.", // [K1] + [D3]
};

export type PageTheme = "dark" | "lime" | "violet" | "paper" | "black";

export const pages = [
  { id: "cover", num: "00", label: "Cover", theme: "black" },
  { id: "the-gap", num: "01", label: "The gap", theme: "dark" },
  { id: "the-idea", num: "02", label: "The idea", theme: "lime" },
  { id: "session-file", num: "03", label: "Session file", theme: "dark" },
  { id: "decisions", num: "04", label: "Show the decisions", theme: "paper" },
  { id: "on-the-desk", num: "05", label: "On the desk", theme: "dark" },
  { id: "the-loop", num: "06", label: "The loop", theme: "violet" },
  { id: "the-pathway", num: "07", label: "The pathway", theme: "dark" },
  { id: "people", num: "08", label: "People", theme: "dark" },
  { id: "build-with-us", num: "09", label: "Build with us", theme: "dark" },
  { id: "the-last-page", num: "10", label: "The last page", theme: "violet" },
] as const satisfies ReadonlyArray<{ id: string; num: string; label: string; theme: PageTheme }>;

export type PageId = (typeof pages)[number]["id"];

export const cover = {
  lines: ["The", "Last", "Page"],
  lead: "From learning design to building a creative career.", // [D1]
  origin: "A community built from Divergent Classes.", // [D1]
};

export const gap = {
  title: ["Getting in", "is not", "getting started."], // [D2]
  // [SITE] framing. Audience per [K4]: design-programme students.
  intro: "Getting into a design programme is a milestone. Building a creative career asks different questions.",
  questions: [
    // Questions verbatim [D2]; each links to the page that answers it.
    { q: "Who will review my work?", answer: "Share for feedback", page: "the-loop" as PageId },
    { q: "How do design teams make decisions?", answer: "Show the decisions", page: "decisions" as PageId },
    { q: "Where do I find my first opportunity?", answer: "The pathway", page: "the-pathway" as PageId },
  ],
};

export const idea = {
  title: ["Learn how", "working designers", "think."], // [D3]
  pillars: [
    // Titles verbatim [D3]; details paraphrase [D5], [D7], [D8].
    { title: "Practitioner-led sessions.", detail: "Working designers, sharing firsthand expertise." },
    { title: "Real design decisions.", detail: "Why that package. What changed in the brief. What was rejected." },
    { title: "A community to keep learning with.", detail: "Because a session ends, and the learning shouldn’t." },
  ],
  about:
    "The Last Page is a community for the next generation of designers, creators, and innovators. Built as an extension of Divergent Classes.", // [K1]
  mission: "Our mission is to help students transition from learning design to building impactful careers.", // [K1]
};

export const session = {
  held: "Held August 30, 2026", // [D4]
  dateISO: "2026-08-30",
  title: ["Inside Zepto’s", "brand design."], // [D4]
  name: "Amrita Bisht", // [D4]
  role: "Branding, packaging and visual designer on Zepto’s brand team", // [D4]
  topics: ["Private-label identities", "Packaging", "Campaigns", "Career exploration"], // [D4]
  disclaimer: "Guest practitioner session, not a corporate partnership announcement.", // [D4] — must stay visible
  poster: {
    src: "/media/session-amrita-bisht-poster.jpg",
    width: 1080,
    height: 1940,
    alt: "Session poster: The Last Page. 30 AUG, Sunday, free. Portrait of Amrita Bisht in a grey blazer on a violet grid, with her name on a lime highlight.",
  },
};

export const decisions = {
  title: ["Show the decisions.", "Skip the generic advice."], // [D5]
  intro: "We turn firsthand session insights into useful, shareable design stories.", // [D5] editorial direction
  formats: [
    // [D5] verbatim
    { title: "Design breakdowns", questions: ["Why that package?", "Why that campaign?"] },
    { title: "Practitioner conversations", questions: ["What changed in the brief?", "What was rejected?"] },
    { title: "Career stories", questions: ["What did the designer try?", "What changed their direction?"] },
  ],
  diceQuote: "Information is power—clarity is control.", // [K5] character sheet
};

/**
 * [SITE] The worked example is the real decision log for this website's
 * cover. Everything described here is implemented on the page.
 */
export const decisionStages = [
  {
    key: "brief",
    label: "Brief",
    title: "Start with the brief, not the moodboard.",
    body: "Design a cover for a community built from Divergent Classes. In one glance it must say design, learning and career — using only #D0FF00, #5200FF, white and black, set in Space Grotesk.",
  },
  {
    key: "explore",
    label: "Explore",
    title: "Go wide before going deep.",
    body: "Three directions, sketched fast. A: a centred slogan over a photo. B: type alone, poster-style. C: type beside an object from the brand kit.",
  },
  {
    key: "compare",
    label: "Compare",
    title: "Put them side by side.",
    body: "Each direction makes a different promise. Toggle between them and notice what each one says before you read a word.",
  },
  {
    key: "reject",
    label: "Reject",
    title: "Say out loud what doesn’t work.",
    body: "A is every course site: a slogan, a stock photo, a gradient button. It says nothing about design. B is striking, but cold — it lost the people.",
  },
  {
    key: "decide",
    label: "Decide",
    title: "Pick one, and write down why.",
    body: "C wins. The retro computer already lives in the brand kit, and it signals making, not studying.",
  },
  {
    key: "iterate",
    label: "Iterate",
    title: "The first good version isn’t the last.",
    body: "v1 set the wordmark on one line. v2 stacks it — the kit’s V2 lockup — so the name reads like a poster and the full stop lands in violet. Drag to compare.",
  },
  {
    key: "ship",
    label: "Ship",
    title: "Motion comes last.",
    body: "The screen powers on; the camera pushes into the blank page. Switch motion off and the cover still reads — that was the test.",
  },
  {
    key: "reflect",
    label: "Reflect",
    title: "Keep the decision open to evidence.",
    body: "Next test: does “Join the community” or “Host a session” earn the first click? A decision is only as good as what it learns.",
  },
] as const;

export type StageKey = (typeof decisionStages)[number]["key"];

export const files = {
  title: ["Open the", "files."], // [SITE]
  intro: "Three pieces of The Last Page’s own design work. Open one and read the decisions in it.", // [SITE]
  items: [
    {
      id: "poster",
      filename: "session-poster.jpg",
      title: "Session poster",
      subtitle: "Inside Zepto’s Brand Design · 30 Aug",
      // Observations of what is visible in the supplied poster [D4 image].
      notes: [
        { x: 60, y: 29, text: "The date is the headline: “30 AUG” set as display type." },
        { x: 16, y: 22, text: "“FREE.” sits inside a lime burst." },
        { x: 90, y: 64, text: "The portrait is framed on a violet grid, the kit’s background." },
        { x: 50, y: 81, text: "The name gets a lime highlight — the one thing to remember." },
      ],
    },
    {
      id: "dice",
      filename: "dice.character-sheet.jpg",
      title: "Character sheet",
      subtitle: "DICE · Rabbit (Lapin)",
      // Observations of [K5].
      notes: [
        { x: 7, y: 36, text: "Personality lives on the sheet, not just the look: calm, observant, thoughtful." },
        { x: 37, y: 5, text: "Four-view turnaround: front, 3/4, side, back." },
        { x: 84, y: 27, text: "Six expressions, from neutral to annoyed." },
        { x: 56, y: 86, text: "The palette carries the brand: green-tinted round lenses, a violet tie." },
      ],
    },
    {
      id: "identity",
      filename: "identity.system",
      title: "Identity",
      subtitle: "Wordmark · Palette · Burst",
      // Observations of [K2].
      notes: [
        { x: 50, y: 22, text: "The full stop is part of the name." },
        { x: 18, y: 58, text: "V2 stacks the wordmark for poster use." },
        { x: 50, y: 88, text: "Three colours, used often: #D0FF00, #5200FF, #FFFFFF." },
        { x: 82, y: 58, text: "The burst: three concentric eleven-point stars." },
      ],
    },
  ],
};

export const loop = {
  title: ["A session ends.", "The learning shouldn’t."], // [D8]
  steps: [
    // Titles [D8]; status per [D8] "Next phase" note. Details [SITE].
    { title: "Join a session", status: "Now", detail: "Hear a working designer walk through real decisions." },
    { title: "Try a brief", status: "Next phase", detail: "Take the thinking into a structured prompt." },
    { title: "Share for feedback", status: "Next phase", detail: "Put the work in front of people who will critique it." },
  ],
  note: "Next phase: structured prompts, replay resources and recurring critique sessions.", // [D8]
};

export const pathway = {
  title: ["Build depth", "before breadth."], // [D9]
  intro: "The route from learning design to a creative career — and exactly where we are on it today.", // [SITE]
  zones: [
    {
      status: "Now",
      steps: [
        { verb: "Learn", offering: "Practitioner sessions" }, // [D9]
        { verb: "Connect", offering: "Community conversations" }, // [D9]
      ],
    },
    {
      status: "Next",
      steps: [
        { verb: "Get feedback", offering: "Portfolio critique" }, // [D9]
        { verb: "Make real work", offering: "Mentor-led projects" }, // [D9]
      ],
    },
    {
      status: "Later",
      steps: [
        { verb: "Get discovered", offering: "Talent discovery" }, // [D9]
        { verb: "Solve real briefs", offering: "Industry briefs" }, // [D9]
      ],
    },
  ],
  destination: "A creative career", // [D1] "building a creative career"
  rule: "We expand when participation and delivery quality support the next step.", // [D9]
  signalsTitle: "Earn the right to scale.", // [D12]
  signals: [
    // [D12] verbatim
    { q: "Do people return?", measure: "Repeat participation" },
    { q: "Does the work improve?", measure: "Portfolio progress" },
    { q: "Can delivery repeat?", measure: "Mentor capacity and cost" },
    { q: "Will people pay?", measure: "Paid-program conversion" },
  ],
};

export const people = {
  title: ["Grow through", "people", "with trust."], // [D7]
  channels: [
    // [D7] verbatim titles + lines; CTAs [SITE] map to [D14] "Host a session. Build with us."
    { title: "Guest designers", line: "Reach people through firsthand expertise.", cta: "Host a session", intent: "host" },
    { title: "Campus clubs", line: "Co-host sessions for relevant student groups.", cta: "Co-host on campus", intent: "campus" },
    { title: "Alumni & creators", line: "Bring the conversation into existing networks.", cta: "Bring it to your network", intent: "network" },
  ],
  roomLabel: "Who’s in the room",
  room: "UCEED, NID, NIFT design programmes and top private schools. Final-year and pre-placement cohorts.", // [K4]
  headStart: {
    title: ["A head start.", "Not a cold start."], // [D6]
    figures: [
      // [D6] — Divergent Classes ecosystem figures, not The Last Page's own.
      { value: 200, prefix: "", suffix: "K+", display: "200K+", label: "Aspiring designers reached" },
      { value: 10000, prefix: "", suffix: "+", display: "10,000+", label: "Community members" },
      { value: 2, prefix: "₹", suffix: " Cr+", display: "₹2 Cr+", label: "Divergent Classes revenue" },
    ],
    note: "Divergent Classes ecosystem figures. Revenue is not standalone The Last Page revenue.", // [D6] — must stay visible
  },
};

export const partners = {
  title: ["Give partners", "a role in the learning."], // [D11]
  roles: [
    // [D11] verbatim
    { title: "Bring a brief", line: "Give students a real design problem.", intent: "brief" },
    { title: "Share a process", line: "Show how your team makes decisions.", intent: "process" },
    { title: "Support access", line: "Fund a workshop or learning resource.", intent: "access" },
  ],
  note: "Collaboration opportunities for brands, studios and institutions.", // [D11]
  proposedLabel: "Proposed formats", // [D10] "Proposed revenue model"
  proposed: ["Mentor-led cohorts", "Portfolio development programs", "Sponsored learning experiences", "Institutional workshops"], // [D10]
  formTitle: "Build with us.", // [D14]
};

export const intents = [
  { value: "host", label: "Host a session" },
  { value: "campus", label: "Co-host on campus" },
  { value: "network", label: "Bring it to my network" },
  { value: "brief", label: "Bring a brief" },
  { value: "process", label: "Share a process" },
  { value: "access", label: "Support access" },
  { value: "other", label: "Something else" },
] as const;

export type Intent = (typeof intents)[number]["value"];

export const lastPage = {
  vision: ["India’s next", "generation", "of creative", "professionals."], // [D13]
  visionLine: "Our vision: a connected network of mentors, campus communities and career opportunities.", // [D13]
  title: ["Your next", "chapter", "starts here."], // [D14]
  actions: "Join the community. Host a session. Build with us.", // [D14]
};

export const brandKit = {
  palette: [
    { name: "Lime", hex: "#D0FF00", role: "Primary accent" },
    { name: "Violet", hex: "#5200FF", role: "Secondary accent" },
    { name: "White", hex: "#FFFFFF", role: "Supporting" },
    { name: "Ink", hex: "#1D1D1D", role: "Background" },
  ], // [K2] + background colour sampled from [K2]/[D*]
  type: [
    { family: "Space Grotesk", role: "Primary font", use: "Display, headlines, wordmark" },
    { family: "Hanken Grotesk", role: "Secondary font", use: "Body copy, long reading" },
    { family: "Inter", role: "Additional font", use: "Labels, UI, figures" },
  ], // [K3]
  do: [
    ["Use assets as provided", " — all images, backgrounds, and folders are optimized for quality and brand alignment."],
    ["Credit THE LAST PAGE", " when appropriate, especially for editorial features or media coverage."],
    ["", "Link back to THE LAST PAGE official website or Insta page when using our assets online."],
    ["", "Respect aspect ratios — scale images proportionally to avoid distortion."],
    ["", "Reach out to the THE LAST PAGE PR team if you need custom assets or clarification."],
  ], // [K7] verbatim
  dont: [
    "Don’t alter the colors, proportions, or design of logos or illustrations.",
    "Don’t crop or overlay other elements on top of logos or Additional assets.",
    "Don’t use outdated or unofficial versions of the THE LAST PAGE brand or assets.",
    "Don’t combine THE LAST PAGE assets with unrelated graphics or logos in a way that misrepresents our brand.",
    "Don’t use assets in commercial products or ads without explicit permission from THE LAST PAGE.",
  ], // [K7] verbatim
  boilerplate:
    "The Last Page is a community for the next generation of designers, creators, and innovators. Built as an extension of Divergent Classes, it brings together aspiring creatives through industry events, workshops, mentorship, portfolio reviews, and meaningful collaborations. Our mission is to help students transition from learning design to building impactful careers.", // [K1] verbatim
};

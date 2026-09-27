import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const INSTAGRAM = "https://www.instagram.com/thelastpage.school/";

function trackErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  return errors;
}

test.describe("home", () => {
  test.use({ contextOptions: { reducedMotion: "reduce" } });

  test("renders every page of the issue without runtime errors", async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("The Last Page");
    for (const id of ["cover", "the-gap", "the-idea", "session-file", "decisions", "on-the-desk", "the-loop", "the-pathway", "people", "build-with-us", "the-last-page"]) {
      await expect(page.locator(`#${id}`)).toHaveCount(1);
    }
    expect(errors).toEqual([]);
  });

  test("keeps required source disclaimers visible", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Guest practitioner session, not a corporate partnership announcement.")).toBeVisible();
    await expect(page.getByText("Divergent Classes ecosystem figures. Revenue is not standalone The Last Page revenue.")).toBeVisible();
  });

  test("every in-page link has a target and external links are safe", async ({ page }) => {
    await page.goto("/");
    const hashes = await page.$$eval('a[href^="#"]', (as) => [...new Set(as.map((a) => a.getAttribute("href")!))]);
    for (const h of hashes) await expect(page.locator(h), `missing target for ${h}`).toHaveCount(1);
    const external = await page.$$eval('a[href^="http"]', (as) => (as as HTMLAnchorElement[]).map((a) => ({ href: a.getAttribute("href"), target: a.target, rel: a.rel })));
    expect(external.length).toBeGreaterThan(0);
    for (const a of external) {
      expect(a.href).toBe(INSTAGRAM);
      expect(a.target).toBe("_blank");
      expect(a.rel).toContain("noopener");
    }
  });

  test("no horizontal overflow", async ({ page }) => {
    await page.goto("/");
    const [inner, scroll] = await page.evaluate(() => [window.innerWidth, document.documentElement.scrollWidth]);
    expect(scroll).toBeLessThanOrEqual(inner);
  });

  test("contents dialog opens, navigates, and closes with Escape", async ({ page }) => {
    await page.goto("/");
    const trigger = page.getByRole("button", { name: /contents/i });
    await trigger.click();
    const dialog = page.getByRole("dialog", { name: "Contents" });
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
    await trigger.click();
    await dialog.getByRole("link", { name: /Build with us/ }).click();
    await expect(dialog).toBeHidden();
    await expect(page).toHaveURL(/#build-with-us$/);
  });

  test("decision log steps forward and back", async ({ page }) => {
    await page.goto("/#decisions");
    const log = page.locator("#decisions");
    await expect(log.getByRole("heading", { name: /start with the brief/i })).toBeVisible();
    await log.getByRole("button", { name: /^Next/ }).click();
    await expect(log.getByRole("heading", { name: /go wide before going deep/i })).toBeVisible();
    await log.getByRole("button", { name: /Iterate/ }).click();
    const slider = log.getByRole("slider", { name: /compare version 1 and version 2/i });
    await slider.focus();
    await page.keyboard.press("ArrowLeft");
    await expect(slider).toHaveValue("51");
  });

  test("files are keyboard-operable tabs", async ({ page }) => {
    await page.goto("/#on-the-desk");
    const first = page.getByRole("tab", { name: /session-poster|Session poster/ });
    await first.focus();
    await page.keyboard.press("ArrowDown");
    await expect(page.getByRole("tab", { name: /Character sheet/ })).toHaveAttribute("aria-selected", "true");
    await expect(page.getByRole("tabpanel")).toContainText("Four-view turnaround");
  });

  test("contact form validates, pre-selects intent, and submits", async ({ page }) => {
    await page.goto("/");
    const form = page.locator("#contact-form form");
    await form.getByRole("button", { name: /send/i }).click();
    await expect(form.getByText("Tell us your name.")).toBeVisible();
    await expect(form.getByLabel("Your name")).toBeFocused();

    await page.locator('a[data-intent="campus"]').first().click();
    await expect(form.getByRole("radio", { name: "Co-host on campus" })).toBeChecked();

    await form.getByLabel("Your name").fill("E2E Tester");
    await form.getByLabel("Email").fill("e2e@example.com");
    await form.getByLabel(/What do you have in mind/).fill("We run a design club and would like to co-host a session.");
    await form.getByRole("button", { name: /send/i }).click();
    await expect(page.getByRole("heading", { name: "Received." })).toBeVisible();
  });

  test("no serious accessibility violations", async ({ page }) => {
    await page.goto("/");
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
    const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).slice(0, 3).join(" | ")}`)).toEqual([]);
  });
});

test.describe("other routes", () => {
  test("brand kit renders and passes axe", async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto("/brand");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("in its own words");
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
    expect(results.violations.filter((v) => v.impact === "serious" || v.impact === "critical").map((v) => v.id)).toEqual([]);
    expect(errors).toEqual([]);
  });

  test("unknown routes return a designed 404", async ({ page }) => {
    const res = await page.goto("/not-a-page");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("isn’t written yet");
  });

  test("SEO endpoints respond", async ({ request }) => {
    expect((await request.get("/robots.txt")).status()).toBe(200);
    expect(await (await request.get("/sitemap.xml")).text()).toContain("/brand");
    expect((await request.get("/opengraph-image.jpg")).status()).toBe(200);
  });
});

test.describe("motion on", () => {
  test.use({ contextOptions: { reducedMotion: "no-preference" } });
  test("cover still communicates with motion enabled", async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto("/");
    await expect(page.getByText("From learning design to building a creative career.").first()).toBeVisible();
    await expect(page.getByRole("link", { name: /Join the community/ }).first()).toBeVisible();
    await page.mouse.wheel(0, 1600);
    await page.waitForTimeout(800);
    expect(errors).toEqual([]);
  });
});

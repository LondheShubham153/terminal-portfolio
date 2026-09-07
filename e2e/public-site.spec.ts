import { test, expect } from "@playwright/test";

test.describe("public site", () => {
  test("homepage renders hero and seeded skills", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /Shubham Londhe/i })).toBeVisible();
    await expect(page.getByText("TypeScript")).toBeVisible();
    await expect(page.getByText("React", { exact: true })).toBeVisible();
  });

  test("blog index loads with no posts", async ({ page }) => {
    await page.goto("/blog");
    await expect(page.getByText("no posts published yet")).toBeVisible();
  });

  test("resume route 404s when nothing uploaded", async ({ request }) => {
    const res = await request.get("/resume", { maxRedirects: 0 });
    expect(res.status()).toBe(404);
  });

  test("contact form submits successfully", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("name").fill("Test User");
    await page.getByLabel("email").fill("test@example.com");
    await page.getByLabel("message").fill("Hello, this is a test message.");
    await page.getByRole("button", { name: /send message/i }).click();
    await expect(page.getByText(/message sent/i)).toBeVisible();
  });

  test("contact form rejects a filled honeypot without visible error", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("name").fill("Bot");
    await page.getByLabel("email").fill("bot@example.com");
    await page.getByLabel("message").fill("spam message");
    // The honeypot field is present but hidden from real users
    await page.locator('input[name="company"]').fill("Acme Corp");
    await page.getByRole("button", { name: /send message/i }).click();
    // Bots get a fake success so they don't learn to adapt
    await expect(page.getByText(/message sent/i)).toBeVisible();
  });
});

import { test, expect, Page } from "@playwright/test";

const ADMIN_EMAIL = "admin@e2e.test";
const ADMIN_PASSWORD = "e2e-test-password";

async function login(page: Page) {
  await page.goto("/admin/login");
  await page.getByLabel("email").fill(ADMIN_EMAIL);
  await page.getByLabel("password").fill(ADMIN_PASSWORD);
  await page.getByRole("button", { name: /sign in/i }).click();
  await expect(page).toHaveURL(/\/admin$/);
}

test.describe("admin projects CRUD", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("creating a project makes it appear on the public homepage immediately", async ({ page }) => {
    await page.goto("/admin/projects/new");
    await page.getByLabel("slug").fill("e2e-project");
    await page.getByLabel("title").fill("E2E Test Project");
    await page.getByLabel("summary").fill("Created by an end-to-end test.");
    await page.getByLabel("description").fill("Full description of the E2E test project.");
    await page.getByLabel(/tags/i).fill("testing,e2e");
    await page.getByRole("button", { name: /save/i }).click();

    await expect(page).toHaveURL(/\/admin\/projects$/);
    await expect(page.getByText("E2E Test Project")).toBeVisible();

    // The core requirement: content changes show on the live site with no redeploy.
    await page.goto("/");
    await expect(page.getByText("E2E Test Project")).toBeVisible();
  });

  test("a live URL typed without http(s):// is auto-normalized, not silently rejected", async ({ page }) => {
    // Regression test: this exact input used to fail validation and redirect
    // to an error page with no visible message, making project creation
    // appear to silently do nothing.
    await page.goto("/admin/projects/new");
    await page.getByLabel("slug").fill("e2e-bare-url");
    await page.getByLabel("title").fill("Bare URL Project");
    await page.getByLabel("summary").fill("Testing a URL typed without a protocol.");
    await page.getByLabel("description").fill("Full description.");
    await page.getByLabel(/tags/i).fill("testing");
    await page.getByLabel(/live URL/i).fill("github.com/example/repo");
    await page.getByRole("button", { name: /save/i }).click();

    await expect(page).toHaveURL(/\/admin\/projects$/);
    await expect(page.getByText("Bare URL Project")).toBeVisible();

    await page.goto("/");
    const link = page.getByRole("link", { name: /Bare URL Project/i });
    await expect(link).toHaveAttribute("href", "https://github.com/example/repo");
  });

  test("an invalid submission shows a visible error instead of failing silently", async ({ page }) => {
    await page.goto("/admin/projects/new");
    // Slug violates the lowercase/hyphen-only rule.
    await page.getByLabel("slug").fill("Not A Valid Slug!");
    await page.getByLabel("title").fill("Invalid Project");
    await page.getByLabel("summary").fill("This should fail validation.");
    await page.getByLabel("description").fill("Full description.");
    await page.getByRole("button", { name: /save/i }).click();

    await expect(page).toHaveURL(/error=1/);
    await expect(page.getByText(/save failed/i)).toBeVisible();

    await page.goto("/");
    await expect(page.getByText("Invalid Project")).toHaveCount(0);
  });

  test("editing a project updates the public site", async ({ page }) => {
    await page.goto("/admin/projects/new");
    await page.getByLabel("slug").fill("e2e-editable");
    await page.getByLabel("title").fill("Original Title");
    await page.getByLabel("summary").fill("Original summary.");
    await page.getByLabel("description").fill("Original description.");
    await page.getByRole("button", { name: /save/i }).click();
    await expect(page).toHaveURL(/\/admin\/projects$/);

    await page.getByRole("link", { name: "edit" }).first().click();
    await page.getByLabel("title").fill("Updated Title");
    await page.getByRole("button", { name: /save/i }).click();
    await expect(page).toHaveURL(/\/admin\/projects$/);

    await page.goto("/");
    await expect(page.getByText("Updated Title")).toBeVisible();
  });

  test("deleting a project removes it from the public site", async ({ page }) => {
    await page.goto("/admin/projects/new");
    await page.getByLabel("slug").fill("e2e-deletable");
    await page.getByLabel("title").fill("Deletable Project");
    await page.getByLabel("summary").fill("This will be deleted.");
    await page.getByLabel("description").fill("Full description.");
    await page.getByRole("button", { name: /save/i }).click();
    await expect(page).toHaveURL(/\/admin\/projects$/);
    await expect(page.getByText("Deletable Project")).toBeVisible();

    page.once("dialog", (dialog) => dialog.accept());
    await page
      .locator("div.flex.items-center.justify-between", { hasText: "Deletable Project" })
      .getByRole("button", { name: "delete" })
      .click();
    await expect(page.getByText("Deletable Project")).toHaveCount(0);

    await page.goto("/");
    await expect(page.getByText("Deletable Project")).toHaveCount(0);
  });
});

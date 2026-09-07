import { test, expect } from "@playwright/test";

const ADMIN_EMAIL = "admin@e2e.test";
const ADMIN_PASSWORD = "e2e-test-password";

test.describe("admin auth", () => {
  test("unauthenticated visit to /admin redirects to login", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("wrong password is rejected", async ({ page }) => {
    await page.goto("/admin/login");
    await page.getByLabel("email").fill(ADMIN_EMAIL);
    await page.getByLabel("password").fill("wrong-password");
    await page.getByRole("button", { name: /sign in/i }).click();
    await expect(page.getByText(/invalid email or password/i)).toBeVisible();
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("correct credentials log in and reach the dashboard", async ({ page }) => {
    await page.goto("/admin/login");
    await page.getByLabel("email").fill(ADMIN_EMAIL);
    await page.getByLabel("password").fill(ADMIN_PASSWORD);
    await page.getByRole("button", { name: /sign in/i }).click();
    await expect(page).toHaveURL(/\/admin$/);
    await expect(page.getByText(/admin status/i)).toBeVisible();
  });

  test("logout clears the session", async ({ page }) => {
    await page.goto("/admin/login");
    await page.getByLabel("email").fill(ADMIN_EMAIL);
    await page.getByLabel("password").fill(ADMIN_PASSWORD);
    await page.getByRole("button", { name: /sign in/i }).click();
    await expect(page).toHaveURL(/\/admin$/);

    await page.getByRole("button", { name: /logout/i }).click();
    await expect(page).toHaveURL(/\/admin\/login/);

    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login/);
  });
});

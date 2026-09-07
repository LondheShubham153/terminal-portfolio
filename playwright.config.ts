import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  timeout: 30_000,
  use: {
    baseURL: "http://localhost:3100",
  },
  webServer: {
    // Migrate + seed a fresh test DB, then start dev server — chained so the
    // DB is guaranteed ready before the server (and Playwright's health
    // check against it) starts. globalSetup would race the server instead.
    command: "node e2e/setup-test-db.mjs && next dev --port 3100",
    url: "http://localhost:3100",
    reuseExistingServer: false,
    timeout: 60_000,
    env: {
      DATABASE_URL: "file:./e2e-test.db",
    },
  },
});

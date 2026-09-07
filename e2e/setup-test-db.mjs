import { execSync } from "node:child_process";
import { existsSync, rmSync } from "node:fs";
import path from "node:path";

const dbPath = path.join(process.cwd(), "prisma", "e2e-test.db");
if (existsSync(dbPath)) rmSync(dbPath);

const env = {
  ...process.env,
  DATABASE_URL: "file:./e2e-test.db",
  ADMIN_EMAIL: "admin@e2e.test",
  ADMIN_PASSWORD: "e2e-test-password",
};

execSync("npx prisma migrate deploy", { env, stdio: "inherit" });
execSync("npx tsx prisma/seed.ts", { env, stdio: "inherit" });

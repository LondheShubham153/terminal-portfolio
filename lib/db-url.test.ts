import { describe, it, expect } from "vitest";
import path from "node:path";
import { resolveDatabaseUrl } from "./db-url";

describe("resolveDatabaseUrl", () => {
  it("resolves a relative file: URL against <cwd>/prisma, not the raw cwd", () => {
    const result = resolveDatabaseUrl("file:./dev.db", "/project/root");
    expect(result).toBe(`file:${path.resolve("/project/root", "prisma", "./dev.db")}`);
    expect(result).toBe("file:/project/root/prisma/dev.db");
  });

  it("passes a remote libsql:// URL through unchanged (Turso production)", () => {
    const url = "libsql://my-db.turso.io?authToken=abc";
    expect(resolveDatabaseUrl(url, "/project/root")).toBe(url);
  });

  it("passes an http(s) URL through unchanged", () => {
    const url = "https://my-db.turso.io";
    expect(resolveDatabaseUrl(url, "/project/root")).toBe(url);
  });

  it("regression: matches Prisma CLI's schema-relative resolution when run from the project root", () => {
    // Prisma CLI (migrate/seed) resolves "file:./dev.db" relative to
    // prisma/schema.prisma, landing on <root>/prisma/dev.db. The app runs
    // `next dev`/`next start` from <root> too, so this must land on the same
    // file — before this fix, @libsql/client's raw cwd-relative resolution
    // pointed at <root>/dev.db instead, a different (empty) database.
    const projectRoot = "/project/root";
    expect(resolveDatabaseUrl("file:./dev.db", projectRoot)).toBe(
      `file:${path.resolve(projectRoot, "prisma", "dev.db")}`,
    );
  });
});

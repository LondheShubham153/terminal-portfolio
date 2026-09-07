import { describe, it, expect } from "vitest";
import { checkRateLimit, resetRateLimit } from "./rate-limit";

describe("checkRateLimit", () => {
  it("allows requests under the limit", () => {
    const id = `user-${Math.random()}`;
    for (let i = 0; i < 3; i++) {
      expect(checkRateLimit("test-bucket", id, { maxAttempts: 5, windowMs: 60_000 }).allowed).toBe(true);
    }
  });

  it("blocks requests once the limit is exceeded", () => {
    const id = `user-${Math.random()}`;
    const opts = { maxAttempts: 3, windowMs: 60_000 };
    for (let i = 0; i < 3; i++) {
      expect(checkRateLimit("test-bucket", id, opts).allowed).toBe(true);
    }
    const result = checkRateLimit("test-bucket", id, opts);
    expect(result.allowed).toBe(false);
    expect(result.retryAfterMs).toBeGreaterThan(0);
  });

  it("tracks separate identifiers independently", () => {
    const opts = { maxAttempts: 1, windowMs: 60_000 };
    const a = `a-${Math.random()}`;
    const b = `b-${Math.random()}`;
    expect(checkRateLimit("test-bucket", a, opts).allowed).toBe(true);
    expect(checkRateLimit("test-bucket", a, opts).allowed).toBe(false);
    expect(checkRateLimit("test-bucket", b, opts).allowed).toBe(true);
  });

  it("does not let one bucket's window evict another bucket's entry early (regression)", () => {
    const id = `shared-${Math.random()}`;
    // "login" bucket has a long window; "contact" bucket has a short one.
    checkRateLimit("login", id, { maxAttempts: 5, windowMs: 900_000 });
    // A call against a different, shorter-window bucket must not evict the
    // login bucket's entry for the same identifier.
    checkRateLimit("contact", id, { maxAttempts: 5, windowMs: 1 });
    const loginResult = checkRateLimit("login", id, { maxAttempts: 5, windowMs: 900_000 });
    expect(loginResult.allowed).toBe(true);
  });

  it("resetRateLimit clears the counter for that identifier", () => {
    const id = `reset-${Math.random()}`;
    const opts = { maxAttempts: 1, windowMs: 60_000 };
    expect(checkRateLimit("test-bucket", id, opts).allowed).toBe(true);
    expect(checkRateLimit("test-bucket", id, opts).allowed).toBe(false);
    resetRateLimit("test-bucket", id);
    expect(checkRateLimit("test-bucket", id, opts).allowed).toBe(true);
  });
});

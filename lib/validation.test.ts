import { describe, it, expect } from "vitest";
import { httpUrl } from "./validation";

describe("httpUrl", () => {
  it("accepts an empty string", () => {
    expect(httpUrl.parse("")).toBe("");
  });

  it("accepts a well-formed https URL unchanged", () => {
    expect(httpUrl.parse("https://example.com/path")).toBe("https://example.com/path");
  });

  it("accepts a well-formed http URL unchanged", () => {
    expect(httpUrl.parse("http://example.com")).toBe("http://example.com");
  });

  it("auto-prepends https:// to a bare domain (the reported bug)", () => {
    expect(httpUrl.parse("github.com/example/repo")).toBe("https://github.com/example/repo");
  });

  it("trims surrounding whitespace before normalizing", () => {
    expect(httpUrl.parse("  github.com/example/repo  ")).toBe("https://github.com/example/repo");
  });

  it("rejects a javascript: URI even after normalization", () => {
    expect(() => httpUrl.parse("javascript:alert(1)")).toThrow();
  });

  it("rejects garbage input with no dot", () => {
    expect(() => httpUrl.parse("not a url")).toThrow();
  });
});

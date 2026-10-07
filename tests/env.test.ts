import { describe, expect, it } from "vitest";
import { parseAppEnv, parseSiteUrl } from "../src/lib/env";

describe("env parsing", () => {
  it("defaults to development", () => {
    expect(parseAppEnv(undefined)).toBe("development");
  });
  it("accepts valid environments", () => {
    expect(parseAppEnv("preview")).toBe("preview");
    expect(parseAppEnv("production")).toBe("production");
  });
  it("rejects unknown environments", () => {
    expect(() => parseAppEnv("staging")).toThrow();
  });
  it("normalises site URL to an origin", () => {
    expect(parseSiteUrl("https://example.com/path/")).toBe("https://example.com");
  });
  it("rejects invalid site URL", () => {
    expect(() => parseSiteUrl("not a url")).toThrow();
  });
});

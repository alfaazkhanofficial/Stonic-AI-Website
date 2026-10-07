import { describe, expect, it } from "vitest";
import {
  RateLimiter,
  adminConfig,
  base32Decode,
  base32Encode,
  createSessionToken,
  hashPassword,
  totpAt,
  verifyPassword,
  verifySessionToken,
  verifyTotp,
} from "../src/lib/auth";

const SECRET = "x".repeat(40);

describe("password hashing", () => {
  it("verifies the right password and rejects wrong ones", async () => {
    const h = await hashPassword("correct horse battery staple");
    expect(await verifyPassword("correct horse battery staple", h)).toBe(true);
    expect(await verifyPassword("wrong", h)).toBe(false);
  });
  it("uses a unique salt per hash", async () => {
    expect(await hashPassword("a")).not.toBe(await hashPassword("a"));
  });
  it("rejects malformed stored hashes", async () => {
    expect(await verifyPassword("a", "garbage")).toBe(false);
    expect(await verifyPassword("a", "scrypt$1$2$3$4$5")).toBe(false);
  });
});

describe("session tokens", () => {
  const now = 1_800_000_000_000;
  it("round-trips a valid token", () => {
    const t = createSessionToken("admin", SECRET, "1", now);
    expect(verifySessionToken(t, SECRET, "1", now + 1000)?.sub).toBe("admin");
  });
  it("expires", () => {
    const t = createSessionToken("admin", SECRET, "1", now, 60);
    expect(verifySessionToken(t, SECRET, "1", now + 61_000)).toBeNull();
  });
  it("rejects tampering and wrong secret", () => {
    const t = createSessionToken("admin", SECRET, "1", now);
    const [p, s] = t.split(".") as [string, string];
    const forged = Buffer.from(
      JSON.stringify({ sub: "admin", iat: 0, exp: 9e9, sv: "1" }),
    ).toString("base64url");
    expect(verifySessionToken(`${forged}.${s}`, SECRET, "1", now)).toBeNull();
    expect(verifySessionToken(`${p}.${s.slice(0, -2)}aa`, SECRET, "1", now)).toBeNull();
    expect(verifySessionToken(t, "y".repeat(40), "1", now)).toBeNull();
  });
  it("is revoked by bumping the session version", () => {
    const t = createSessionToken("admin", SECRET, "1", now);
    expect(verifySessionToken(t, SECRET, "2", now)).toBeNull();
  });
  it("rejects empty and malformed input", () => {
    expect(verifySessionToken(undefined, SECRET)).toBeNull();
    expect(verifySessionToken("a.b.c", SECRET)).toBeNull();
    expect(verifySessionToken("nodot", SECRET)).toBeNull();
  });
});

describe("TOTP", () => {
  // RFC 6238 test vector: secret "12345678901234567890", T=59s → 94287082 (8 digits) → last 6 = 287082
  const secret = base32Encode(Buffer.from("12345678901234567890"));
  it("matches the RFC 6238 vector", () => {
    expect(totpAt(secret, 59_000)).toBe("287082");
  });
  it("accepts ±1 step and rejects others", () => {
    const now = 1_700_000_000_000;
    expect(verifyTotp(secret, totpAt(secret, now), now)).toBe(true);
    expect(verifyTotp(secret, totpAt(secret, now - 30_000), now)).toBe(true);
    expect(verifyTotp(secret, totpAt(secret, now - 120_000), now)).toBe(false);
    expect(verifyTotp(secret, "abc123", now)).toBe(false);
  });
  it("base32 round-trips", () => {
    const b = Buffer.from("hello world");
    expect(base32Decode(base32Encode(b)).toString()).toBe("hello world");
  });
});

describe("rate limiter", () => {
  it("locks after max failures and unlocks after the window", () => {
    const rl = new RateLimiter(3, 1000);
    for (let i = 0; i < 3; i++) {
      expect(rl.isLimited("ip", 0)).toBe(false);
      rl.recordFailure("ip", 0);
    }
    expect(rl.isLimited("ip", 500)).toBe(true);
    expect(rl.isLimited("other", 500)).toBe(false);
    expect(rl.isLimited("ip", 1001)).toBe(false);
  });
  it("reset clears the count", () => {
    const rl = new RateLimiter(1, 1000);
    rl.recordFailure("ip", 0);
    rl.reset("ip");
    expect(rl.isLimited("ip", 1)).toBe(false);
  });
});

describe("admin config", () => {
  it("is null unless everything is set and the secret is long enough", () => {
    expect(adminConfig({} as NodeJS.ProcessEnv)).toBeNull();
    expect(
      adminConfig({
        ADMIN_USERNAME: "a",
        ADMIN_PASSWORD_HASH: "h",
        SESSION_SECRET: "short",
      } as unknown as NodeJS.ProcessEnv),
    ).toBeNull();
    expect(
      adminConfig({
        ADMIN_USERNAME: "a",
        ADMIN_PASSWORD_HASH: "h",
        SESSION_SECRET: SECRET,
      } as unknown as NodeJS.ProcessEnv)?.sessionVersion,
    ).toBe("1");
  });
});

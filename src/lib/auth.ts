import { createHmac, randomBytes, scrypt as scryptCb, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCb) as (
  pw: string,
  salt: Buffer,
  len: number,
  opts: object,
) => Promise<Buffer>;

/* ---------- Password hashing (scrypt) ---------- */
// Format: scrypt$N$r$p$saltB64$hashB64
const N = 16384,
  R = 8,
  P = 1,
  KEYLEN = 32;

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const hash = await scrypt(password, salt, KEYLEN, { N, r: R, p: P });
  return `scrypt$${N}$${R}$${P}$${salt.toString("base64")}$${hash.toString("base64")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split("$");
  if (parts.length !== 6 || parts[0] !== "scrypt") return false;
  const [, n, r, p, saltB64, hashB64] = parts as [string, string, string, string, string, string];
  try {
    const expected = Buffer.from(hashB64, "base64");
    const actual = await scrypt(password, Buffer.from(saltB64, "base64"), expected.length, {
      N: Number(n),
      r: Number(r),
      p: Number(p),
    });
    return actual.length === expected.length && timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

/* ---------- Signed session tokens (stateless, HMAC-SHA256) ---------- */
export const SESSION_TTL_SECONDS = 8 * 60 * 60;

export type Session = { sub: string; iat: number; exp: number; sv: string };

const b64u = (b: Buffer | string) => Buffer.from(b).toString("base64url");
const sign = (data: string, secret: string) =>
  createHmac("sha256", secret).update(data).digest("base64url");

export function createSessionToken(
  sub: string,
  secret: string,
  sv = "1",
  now = Date.now(),
  ttl = SESSION_TTL_SECONDS,
): string {
  const iat = Math.floor(now / 1000);
  const payload = b64u(JSON.stringify({ sub, iat, exp: iat + ttl, sv } satisfies Session));
  return `${payload}.${sign(payload, secret)}`;
}

export function verifySessionToken(
  token: string | undefined,
  secret: string,
  sv = "1",
  now = Date.now(),
): Session | null {
  if (!token || !secret) return null;
  const [payload, sig, extra] = token.split(".");
  if (!payload || !sig || extra !== undefined) return null;
  const good = Buffer.from(sign(payload, secret));
  const got = Buffer.from(sig);
  if (good.length !== got.length || !timingSafeEqual(good, got)) return null;
  try {
    const s = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as Session;
    if (typeof s.exp !== "number" || s.exp <= Math.floor(now / 1000)) return null;
    if (s.sv !== sv) return null; // bump ADMIN_SESSION_VERSION to revoke every session
    return s;
  } catch {
    return null;
  }
}

/* ---------- Optional TOTP (RFC 6238) ---------- */
const B32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

export function base32Decode(input: string): Buffer {
  let bits = "";
  for (const c of input.replace(/=+$/, "").replace(/\s/g, "").toUpperCase()) {
    const i = B32.indexOf(c);
    if (i < 0) throw new Error("Invalid base32");
    bits += i.toString(2).padStart(5, "0");
  }
  const bytes: number[] = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) bytes.push(parseInt(bits.slice(i, i + 8), 2));
  return Buffer.from(bytes);
}

export function base32Encode(buf: Buffer): string {
  let bits = "";
  for (const b of buf) bits += b.toString(2).padStart(8, "0");
  let out = "";
  for (let i = 0; i < bits.length; i += 5)
    out += B32[parseInt(bits.slice(i, i + 5).padEnd(5, "0"), 2)];
  return out;
}

export function totpAt(secretB32: string, timeMs: number, step = 30, digits = 6): string {
  const counter = Buffer.alloc(8);
  counter.writeBigUInt64BE(BigInt(Math.floor(timeMs / 1000 / step)));
  const h = createHmac("sha1", base32Decode(secretB32)).update(counter).digest();
  const off = (h[h.length - 1] ?? 0) & 0xf;
  const code =
    (((h[off] ?? 0) & 0x7f) << 24) |
    ((h[off + 1] ?? 0) << 16) |
    ((h[off + 2] ?? 0) << 8) |
    (h[off + 3] ?? 0);
  return String(code % 10 ** digits).padStart(digits, "0");
}

export function verifyTotp(secretB32: string, code: string, now = Date.now()): boolean {
  if (!/^\d{6}$/.test(code)) return false;
  let ok = false;
  for (const drift of [-1, 0, 1]) {
    const expected = Buffer.from(totpAt(secretB32, now + drift * 30000));
    if (timingSafeEqual(expected, Buffer.from(code))) ok = true; // no early exit: constant work
  }
  return ok;
}

/* ---------- Brute-force protection (in-memory, per instance) ---------- */
type Bucket = { count: number; resetAt: number };

export class RateLimiter {
  private buckets = new Map<string, Bucket>();
  constructor(
    private max: number,
    private windowMs: number,
  ) {}

  isLimited(key: string, now = Date.now()): boolean {
    const b = this.buckets.get(key);
    if (!b || b.resetAt <= now) return false;
    return b.count >= this.max;
  }
  recordFailure(key: string, now = Date.now()): void {
    const b = this.buckets.get(key);
    if (!b || b.resetAt <= now) this.buckets.set(key, { count: 1, resetAt: now + this.windowMs });
    else b.count += 1;
    if (this.buckets.size > 5000)
      for (const [k, v] of this.buckets) if (v.resetAt <= now) this.buckets.delete(k);
  }
  reset(key: string): void {
    this.buckets.delete(key);
  }
}

/* ---------- Admin config (read from environment at call time; secrets never leave the server) ---------- */
export type AdminConfig = {
  username: string;
  passwordHash: string;
  sessionSecret: string;
  sessionVersion: string;
  totpSecret: string | null;
};

export function adminConfig(env: NodeJS.ProcessEnv = process.env): AdminConfig | null {
  const username = env.ADMIN_USERNAME?.trim();
  const passwordHash = env.ADMIN_PASSWORD_HASH?.trim();
  const sessionSecret = env.SESSION_SECRET?.trim();
  if (!username || !passwordHash || !sessionSecret || sessionSecret.length < 32) return null;
  return {
    username,
    passwordHash,
    sessionSecret,
    sessionVersion: env.ADMIN_SESSION_VERSION?.trim() || "1",
    totpSecret: env.ADMIN_TOTP_SECRET?.trim() || null,
  };
}

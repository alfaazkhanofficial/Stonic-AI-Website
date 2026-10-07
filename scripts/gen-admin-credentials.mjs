#!/usr/bin/env node
// Generates a strong admin credential set. Prints the plaintext password ONCE.
// Store the three values in your hosting provider's SECRET MANAGER. Never commit them.
import { randomBytes, scryptSync } from "node:crypto";

const B32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
const b32 = (buf) => {
  let bits = "",
    out = "";
  for (const b of buf) bits += b.toString(2).padStart(8, "0");
  for (let i = 0; i < bits.length; i += 5)
    out += B32[parseInt(bits.slice(i, i + 5).padEnd(5, "0"), 2)];
  return out;
};

const password = randomBytes(24).toString("base64url"); // 192 bits
const salt = randomBytes(16);
const N = 16384,
  r = 8,
  p = 1;
const hash = scryptSync(password, salt, 32, { N, r, p });
const totp = b32(randomBytes(20));
const withTotp = process.argv.includes("--totp");

console.log("=== STONIC admin credentials (shown once) ===\n");
console.log(`Password (give to the admin, store in a password manager):\n  ${password}\n`);
console.log("Set these as SECRETS in your host (e.g. `fly secrets set ...`):\n");
console.log(`ADMIN_USERNAME=<choose a non-obvious username>`);
console.log(
  `ADMIN_PASSWORD_HASH=scrypt$${N}$${r}$${p}$${salt.toString("base64")}$${hash.toString("base64")}`,
);
console.log(`SESSION_SECRET=${randomBytes(48).toString("base64url")}`);
if (withTotp) {
  console.log(`ADMIN_TOTP_SECRET=${totp}`);
  console.log(
    `\nAdd to an authenticator app:\n  otpauth://totp/STONIC%20Admin?secret=${totp}&issuer=STONIC&digits=6&period=30`,
  );
} else {
  console.log("\n(Run with --totp to also generate a two-factor secret.)");
}
console.log(
  "\nRotate: re-run, update the secrets, then bump ADMIN_SESSION_VERSION to sign out every session.",
);

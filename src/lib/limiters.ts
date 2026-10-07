import { RateLimiter } from "./auth";

// Singletons survive module re-evaluation in dev. Per-instance memory: run a single instance or add a shared store.
const g = globalThis as unknown as { __stonicLimiters?: { ip: RateLimiter; global: RateLimiter } };
g.__stonicLimiters ??= {
  ip: new RateLimiter(5, 15 * 60_000), // 5 failures / 15 min / IP
  global: new RateLimiter(25, 15 * 60_000), // 25 failures / 15 min overall (distributed guessing)
};
export const loginLimiters = g.__stonicLimiters;

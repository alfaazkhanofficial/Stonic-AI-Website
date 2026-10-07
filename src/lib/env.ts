export type AppEnv = "development" | "preview" | "production";

const APP_ENVS: readonly AppEnv[] = ["development", "preview", "production"];

export function parseAppEnv(value: string | undefined): AppEnv {
  if (!value) return "development";
  if ((APP_ENVS as readonly string[]).includes(value)) return value as AppEnv;
  throw new Error(`Invalid APP_ENV "${value}". Expected one of: ${APP_ENVS.join(", ")}.`);
}

export function parseSiteUrl(value: string | undefined): string {
  const raw = value ?? "http://localhost:3000";
  const url = new URL(raw); // throws on invalid input
  return url.origin;
}

export const appEnv: AppEnv = parseAppEnv(process.env.APP_ENV);
export const siteUrl: string = parseSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
export const isProduction = appEnv === "production";
/** True for the free static-hosting build (`npm run build:static`): no server, content comes from src/content/site.ts. */
export const isStaticTarget = process.env.DEPLOY_TARGET === "static";
export const isSecureOrigin = siteUrl.startsWith("https:");

/** Server-only. Directory for admin-managed content and uploads (mount a persistent volume here). */
export function dataDir(): string {
  return process.env.DATA_DIR ?? `${process.cwd()}/.data`;
}

import "server-only";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { adminConfig, createSessionToken, verifySessionToken, SESSION_TTL_SECONDS } from "./auth";
import { isSecureOrigin } from "./env";

// __Host- prefix (Secure, Path=/, no Domain) is enforced by browsers whenever served over HTTPS.
export const COOKIE_NAME = isSecureOrigin ? "__Host-stonic_admin" : "stonic_admin";

export async function getAdminSession() {
  const cfg = adminConfig();
  if (!cfg) return null;
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  return verifySessionToken(token, cfg.sessionSecret, cfg.sessionVersion);
}

/** Call at the top of every admin page and every admin server action. */
export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}

export async function startAdminSession(username: string) {
  const cfg = adminConfig();
  if (!cfg) throw new Error("Admin not configured");
  (await cookies()).set(
    COOKIE_NAME,
    createSessionToken(username, cfg.sessionSecret, cfg.sessionVersion),
    {
      httpOnly: true,
      secure: isSecureOrigin,
      sameSite: "strict",
      path: "/",
      maxAge: SESSION_TTL_SECONDS,
    },
  );
}

export async function endAdminSession() {
  (await cookies()).set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: isSecureOrigin,
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
}

export async function clientIp(): Promise<string> {
  const h = await headers();
  return (
    h.get("fly-client-ip") ??
    h.get("x-real-ip") ??
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

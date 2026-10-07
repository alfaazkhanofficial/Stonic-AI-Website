import { redirect } from "next/navigation";
import { AdminForm } from "@/components/admin-form";
import { getAdminSession } from "@/lib/admin-session";
import { adminConfig } from "@/lib/auth";
import { loginAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function Login() {
  if (await getAdminSession()) redirect("/admin/dashboard");
  const cfg = adminConfig();
  return (
    <div className="login-box">
      <p className="eyebrow">Admin</p>
      <h1 className="h2" style={{ fontSize: "2rem", margin: "0.75rem 0 1.75rem" }}>
        Sign in
      </h1>
      {!cfg ? (
        <p className="form-msg err">Admin sign-in is not configured on this server.</p>
      ) : (
        <AdminForm action={loginAction} submitLabel="Sign in">
          <div className="field">
            <label htmlFor="username">Username</label>
            <input
              className="input"
              id="username"
              name="username"
              autoComplete="username"
              required
              maxLength={200}
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              className="input"
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              maxLength={200}
            />
          </div>
          {cfg.totpSecret && (
            <div className="field">
              <label htmlFor="code">Authenticator code</label>
              <input
                className="input"
                id="code"
                name="code"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="\d{6}"
                maxLength={6}
                required
              />
            </div>
          )}
        </AdminForm>
      )}
    </div>
  );
}

"use client";
import { useActionState, type ReactNode } from "react";
import type { FormState } from "@/app/admin/actions";

export function AdminForm({
  action,
  children,
  submitLabel = "Save changes",
}: {
  action: (prev: FormState, fd: FormData) => Promise<FormState>;
  children: ReactNode;
  submitLabel?: string;
}) {
  const [state, formAction, pending] = useActionState(action, {} as FormState);
  return (
    <form action={formAction}>
      {state.ok && (
        <p className="form-msg ok" role="status">
          {state.ok}
        </p>
      )}
      {state.error && (
        <p className="form-msg err" role="alert">
          {state.error}
        </p>
      )}
      {children}
      <button className="btn primary" type="submit" disabled={pending}>
        {pending ? "Working…" : submitLabel}
      </button>
    </form>
  );
}

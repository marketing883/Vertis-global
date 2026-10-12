"use client";

import { useActionState } from "react";
import { signIn, type LoginState } from "@/app/admin/actions/auth";
import { buttonClass, inputClass } from "@/components/admin/ui";

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(signIn, {});
  return (
    <form action={action} className="mt-8 space-y-5">
      <input type="hidden" name="next" value={next} />
      {state.error ? (
        <p role="alert" className="rounded-md bg-[#fde8e8] px-4 py-3 text-sm text-[#9b1c1c]">
          {state.error}
        </p>
      ) : null}
      <label className="block text-sm font-semibold text-ink">
        Email
        <input
          name="email"
          type="email"
          autoComplete="username"
          required
          defaultValue={state.email ?? ""}
          className={`${inputClass} mt-1.5 h-11`}
        />
      </label>
      <label className="block text-sm font-semibold text-ink">
        Password
        <input name="password" type="password" autoComplete="current-password" required className={`${inputClass} mt-1.5 h-11`} />
      </label>
      <button type="submit" disabled={pending} className={`${buttonClass.primary} h-11 w-full justify-center`}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

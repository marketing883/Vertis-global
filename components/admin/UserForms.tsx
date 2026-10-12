"use client";

import { useActionState } from "react";
import { addUser, userAction, type UserActionState, type UserFormState } from "@/app/admin/actions/users";
import { changePassword, type PasswordState } from "@/app/admin/actions/auth";
import { buttonClass, inputClass } from "@/components/admin/ui";

function OneTime({ label, password }: { label: string; password: string }) {
  return (
    <div role="status" className="mt-4 rounded-md border border-[#b8e0c7] bg-[#eefaf2] px-4 py-3 text-sm text-[#1d6b3f]">
      <p className="font-semibold">{label}</p>
      <p className="mt-1">
        One-time password: <code className="rounded bg-white px-2 py-0.5 font-mono text-ink select-all">{password}</code>
      </p>
      <p className="mt-1 text-xs">Shown once. Send it to them privately; they should change it at My account.</p>
    </div>
  );
}

export function AddUserForm() {
  const [state, action, pending] = useActionState<UserFormState, FormData>(addUser, {});
  return (
    <form action={action} className="grid gap-3 sm:grid-cols-[1fr_1fr_160px_auto] sm:items-end">
      <label className="text-sm font-semibold">
        Name
        <input name="name" required className={`${inputClass} mt-1`} />
      </label>
      <label className="text-sm font-semibold">
        Email
        <input name="email" type="email" required className={`${inputClass} mt-1`} />
      </label>
      <label className="text-sm font-semibold">
        Role
        <select name="role" defaultValue="hr" className={`${inputClass} mt-1`}>
          <option value="hr">Recruiter (jobs and applications)</option>
          <option value="admin">Admin (everything)</option>
        </select>
      </label>
      <button type="submit" disabled={pending} className={buttonClass.primary}>
        {pending ? "Adding…" : "Add user"}
      </button>
      <div className="sm:col-span-4">
        {state.error ? <p role="alert" className="text-sm text-[#9b1c1c]">{state.error}</p> : null}
        {state.created ? <OneTime label={`Created ${state.created.email}`} password={state.created.password} /> : null}
      </div>
    </form>
  );
}

export function UserRowActions({ id, disabled, role, self }: { id: number; disabled: boolean; role: string; self: boolean }) {
  const [state, action, pending] = useActionState<UserActionState, FormData>(userAction, {});
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <form action={action}>
          <input type="hidden" name="recordId" value={id} />
          <input type="hidden" name="op" value="reset" />
          <button className={buttonClass.secondary} disabled={pending}>Reset password</button>
        </form>
        {!self ? (
          <>
            <form action={action}>
              <input type="hidden" name="recordId" value={id} />
              <input type="hidden" name="op" value="role" />
              <input type="hidden" name="role" value={role === "admin" ? "hr" : "admin"} />
              <button className={buttonClass.secondary} disabled={pending}>
                Make {role === "admin" ? "recruiter" : "admin"}
              </button>
            </form>
            <form action={action}>
              <input type="hidden" name="recordId" value={id} />
              <input type="hidden" name="op" value={disabled ? "enable" : "disable"} />
              <button className={disabled ? buttonClass.secondary : buttonClass.danger} disabled={pending}>
                {disabled ? "Enable" : "Disable"}
              </button>
            </form>
          </>
        ) : null}
      </div>
      {state.error ? <p role="alert" className="mt-2 text-sm text-[#9b1c1c]">{state.error}</p> : null}
      {state.password ? <OneTime label={state.done ?? ""} password={state.password} /> : state.done ? <p className="mt-2 text-sm text-[#1d6b3f]">{state.done}</p> : null}
    </div>
  );
}

export function ChangePasswordForm() {
  const [state, action, pending] = useActionState<PasswordState, FormData>(changePassword, {});
  return (
    <form action={action} className="max-w-md space-y-4">
      {state.error ? <p role="alert" className="rounded-md bg-[#fde8e8] px-4 py-3 text-sm text-[#9b1c1c]">{state.error}</p> : null}
      {state.ok ? <p role="status" className="rounded-md bg-[#eefaf2] px-4 py-3 text-sm text-[#1d6b3f]">Password changed. Other sessions were signed out.</p> : null}
      {[
        ["current", "Current password", "current-password"],
        ["next", "New password", "new-password"],
        ["confirm", "New password again", "new-password"],
      ].map(([name, label, ac]) => (
        <label key={name} className="block text-sm font-semibold">
          {label}
          <input name={name} type="password" autoComplete={ac} required className={`${inputClass} mt-1`} />
        </label>
      ))}
      <p className="text-xs text-n-500">At least 12 characters, with letters and a number.</p>
      <button type="submit" disabled={pending} className={buttonClass.primary}>
        {pending ? "Saving…" : "Change password"}
      </button>
    </form>
  );
}

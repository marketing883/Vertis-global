"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getDb } from "@/lib/db";
import {
  audit,
  clearFailures,
  currentUser,
  endSession,
  recordFailure,
  signInBlocked,
  startSession,
  type AdminUser,
} from "@/lib/admin/auth";
import { hashPassword, passwordProblem, verifyPassword } from "@/lib/admin/password.mjs";
import { clientAddress } from "@/lib/spam";

export type LoginState = { error?: string; email?: string };

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().max(254),
  password: z.string().min(1).max(200),
});

/* One message for every failure, so the form never reveals which
   emails have accounts. */
const FAILED = "That email and password don't match an admin account.";

export async function signIn(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse({ email: formData.get("email"), password: formData.get("password") });
  const email = typeof formData.get("email") === "string" ? String(formData.get("email")).trim() : "";
  if (!parsed.success) return { error: FAILED, email };

  const ip = clientAddress(await headers());
  const keys = [`email:${parsed.data.email}`, ...(ip ? [`ip:${ip}`] : [])];
  if (signInBlocked(keys)) {
    return { error: "Too many attempts. Wait fifteen minutes and try again.", email };
  }

  const row = getDb()
    .prepare("SELECT id, email, name, role, password_hash, disabled FROM admin_users WHERE email = ?")
    .get(parsed.data.email) as (AdminUser & { password_hash: string; disabled: number }) | undefined;
  /* Verify even when the user does not exist, so timing does not
     reveal whether an account exists either. */
  const ok = await verifyPassword(
    parsed.data.password,
    row?.password_hash ?? "scrypt$16384$8$1$AAAAAAAAAAAAAAAAAAAAAA==$AAAA",
  );
  if (!row || !ok || row.disabled) {
    recordFailure(keys);
    audit(null, "login.failed");
    return { error: FAILED, email };
  }

  clearFailures(keys);
  await startSession(row.id);
  audit(row, "login");
  const next = String(formData.get("next") ?? "");
  redirect(/^\/admin(\/|$)/.test(next) && !next.startsWith("//") ? next : "/admin");
}

export async function signOut() {
  const user = await currentUser();
  if (user) audit(user, "logout");
  await endSession();
  redirect("/admin/login");
}

export type PasswordState = { error?: string; ok?: boolean };

export async function changePassword(_prev: PasswordState, formData: FormData): Promise<PasswordState> {
  const user = await currentUser();
  if (!user) redirect("/admin/login");
  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  const row = getDb().prepare("SELECT password_hash FROM admin_users WHERE id = ?").get(user.id) as
    | { password_hash: string }
    | undefined;
  if (!row || !(await verifyPassword(current, row.password_hash))) return { error: "Your current password is not right." };
  const problem = passwordProblem(next);
  if (problem) return { error: problem };
  if (next !== confirm) return { error: "The new passwords don't match." };
  const db = getDb();
  db.prepare("UPDATE admin_users SET password_hash = ? WHERE id = ?").run(await hashPassword(next), user.id);
  /* Every other session for this user ends; this one is replaced. */
  db.prepare("DELETE FROM admin_sessions WHERE user_id = ?").run(user.id);
  await startSession(user.id);
  audit(user, "password.changed", "admin_user", user.id);
  return { ok: true };
}

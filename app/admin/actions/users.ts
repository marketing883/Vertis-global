"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { AdminAuthError, audit, requireUser } from "@/lib/admin/auth";
import { hashPassword, oneTimePassword } from "@/lib/admin/password.mjs";

export type UserFormState = { error?: string; created?: { email: string; password: string } };

const newUser = z.object({
  email: z.email("Enter a valid email.").max(254).transform((e) => e.trim().toLowerCase()),
  name: z.string().trim().min(2, "Enter their name.").max(100),
  role: z.enum(["admin", "hr"], { error: "Choose a role." }),
});

export async function addUser(_prev: UserFormState, formData: FormData): Promise<UserFormState> {
  let actor;
  try {
    actor = await requireUser("users");
  } catch (e) {
    return { error: e instanceof AdminAuthError ? "You can't manage users." : "Something went wrong." };
  }
  const parsed = newUser.safeParse({
    email: String(formData.get("email") ?? "").trim(),
    name: formData.get("name"),
    role: formData.get("role"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the form." };
  const db = getDb();
  if (db.prepare("SELECT 1 FROM admin_users WHERE email = ?").get(parsed.data.email)) {
    return { error: "There is already a user with that email." };
  }
  const password = oneTimePassword();
  const info = db
    .prepare("INSERT INTO admin_users (email, name, role, password_hash) VALUES (?, ?, ?, ?)")
    .run(parsed.data.email, parsed.data.name, parsed.data.role, await hashPassword(password));
  audit(actor, "user.created", "admin_user", Number(info.lastInsertRowid));
  revalidatePath("/admin/users");
  return { created: { email: parsed.data.email, password } };
}

export type UserActionState = { error?: string; password?: string; done?: string };

export async function userAction(_prev: UserActionState, formData: FormData): Promise<UserActionState> {
  let actor;
  try {
    actor = await requireUser("users");
  } catch {
    return { error: "You can't manage users." };
  }
  const id = Number(formData.get("recordId"));
  const op = String(formData.get("op"));
  const db = getDb();
  const target = db.prepare("SELECT id, email FROM admin_users WHERE id = ?").get(id) as { id: number; email: string } | undefined;
  if (!target) return { error: "That user no longer exists." };
  if (target.id === actor.id) {
    return { error: op === "reset" ? "Change your own password at My account." : "You can't change your own access here." };
  }

  if (op === "reset") {
    const password = oneTimePassword();
    db.prepare("UPDATE admin_users SET password_hash = ? WHERE id = ?").run(await hashPassword(password), id);
    db.prepare("DELETE FROM admin_sessions WHERE user_id = ?").run(id);
    audit(actor, "user.password_reset", "admin_user", id);
    revalidatePath("/admin/users");
    return { password, done: `New one-time password for ${target.email}` };
  }
  if (op === "disable" || op === "enable") {
    db.prepare("UPDATE admin_users SET disabled = ? WHERE id = ?").run(op === "disable" ? 1 : 0, id);
    if (op === "disable") db.prepare("DELETE FROM admin_sessions WHERE user_id = ?").run(id);
    audit(actor, `user.${op}d`, "admin_user", id);
    revalidatePath("/admin/users");
    return { done: `${target.email} ${op === "disable" ? "disabled and signed out" : "enabled"}.` };
  }
  if (op === "role") {
    const role = String(formData.get("role"));
    if (role !== "admin" && role !== "hr") return { error: "Unknown role." };
    db.prepare("UPDATE admin_users SET role = ? WHERE id = ?").run(role, id);
    audit(actor, "user.role_changed", "admin_user", id);
    revalidatePath("/admin/users");
    return { done: `${target.email} is now ${role === "hr" ? "a recruiter" : "an admin"}.` };
  }
  return { error: "Unknown action." };
}

import "server-only";
import { cache } from "react";
import { createHash, randomBytes } from "node:crypto";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { getDb, now } from "@/lib/db";

/* ============================================================
   ADMIN AUTHENTICATION

   The same shape as ACI's (a login page, a gate on /admin and
   /api/admin, two roles), built on Vertis's own database so its
   users and sessions are never shared with ACI or ArqAI.

   · Users: admin_users. Passwords are scrypt hashes
     (lib/admin/password.mjs). The first admin is created on the
     server with `node scripts/admin.mjs user:add`.
   · Sessions: a random 256-bit token in an httpOnly cookie; only its
     SHA-256 hash is stored, so a copy of the database cannot be used
     to log in. Twelve hours, then sign in again. Signing out, being
     disabled or a password reset ends every session for that user.
   · Roles, as at ACI: "admin" can do everything; "hr" (recruiters)
     sees Jobs and Applications only.
   · Every admin page, server action and API route calls one of the
     guards below. proxy.ts only turns away requests with no cookie
     at all; it is a convenience, not the protection.
   ============================================================ */

export const SESSION_COOKIE = "vg_admin";
const SESSION_HOURS = 12;

export type Role = "admin" | "hr";
export type AdminUser = { id: number; email: string; name: string; role: Role };

/** Admin URL sections each role may use. Shared with the sidebar so
    the menu never offers a page the server would refuse. */
const HR_SECTIONS = ["", "jobs", "job-applications", "account"];

export function canAccess(role: Role, section: string): boolean {
  return role === "admin" || HR_SECTIONS.includes(section);
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

/** Secure everywhere except a local run. Not x-forwarded-proto: Next
    fills that in as "http" when nginx does not send it, which would
    quietly drop the Secure flag on the live site. Both public hosts are
    HTTPS only. */
async function cookieIsSecure(): Promise<boolean> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "";
  return !/^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host);
}

export async function startSession(userId: number) {
  const token = randomBytes(32).toString("base64url");
  const expires = new Date(Date.now() + SESSION_HOURS * 3600_000);
  const db = getDb();
  db.prepare("DELETE FROM admin_sessions WHERE expires_at < ?").run(now());
  db.prepare("INSERT INTO admin_sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)").run(
    hashToken(token),
    userId,
    expires.toISOString(),
  );
  db.prepare("UPDATE admin_users SET last_login_at = ? WHERE id = ?").run(now(), userId);
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: await cookieIsSecure(),
    sameSite: "lax",
    path: "/",
    expires,
  });
}

export async function endSession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) getDb().prepare("DELETE FROM admin_sessions WHERE token_hash = ?").run(hashToken(token));
  jar.delete(SESSION_COOKIE);
}

/** The signed-in user for this request, or null. Cached per request. */
export const currentUser = cache(async (): Promise<AdminUser | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token || token.length > 100) return null;
  const row = getDb()
    .prepare(
      `SELECT u.id, u.email, u.name, u.role FROM admin_sessions s
       JOIN admin_users u ON u.id = s.user_id
       WHERE s.token_hash = ? AND s.expires_at > ? AND u.disabled = 0`,
    )
    .get(hashToken(token), now()) as AdminUser | undefined;
  return row ?? null;
});

/** For admin pages: signs the visitor in first if needed, and sends a
    user to the dashboard if their role cannot open this section. */
export async function requirePage(section: string): Promise<AdminUser> {
  const user = await currentUser();
  if (!user) redirect(`/admin/login?next=${encodeURIComponent(`/admin/${section}`.replace(/\/$/, ""))}`);
  if (!canAccess(user.role, section)) redirect("/admin");
  return user;
}

export class AdminAuthError extends Error {
  constructor(public status: 401 | 403) {
    super(status === 401 ? "Not signed in" : "Not allowed");
  }
}

/** For server actions and API routes: throws instead of redirecting. */
export async function requireUser(section: string): Promise<AdminUser> {
  const user = await currentUser();
  if (!user) throw new AdminAuthError(401);
  if (!canAccess(user.role, section)) throw new AdminAuthError(403);
  return user;
}

/** Records who did what. No candidate details, only ids. */
export function audit(user: AdminUser | null, action: string, entity?: string, entityId?: string | number) {
  getDb()
    .prepare("INSERT INTO admin_audit (user_id, action, entity, entity_id) VALUES (?, ?, ?, ?)")
    .run(user?.id ?? null, action, entity ?? null, entityId === undefined ? null : String(entityId));
}

/* ── Sign-in throttling ─────────────────────────────────────────
   Five failed attempts per email, or twenty per address, in fifteen
   minutes, then wait. In memory: the site is a single process. */
const WINDOW = 15 * 60_000;
const failures = new Map<string, number[]>();

export function signInBlocked(keys: string[]): boolean {
  const t = Date.now();
  return keys.some((k) => {
    const recent = (failures.get(k) ?? []).filter((x) => t - x < WINDOW);
    failures.set(k, recent);
    return recent.length >= (k.startsWith("ip:") ? 20 : 5);
  });
}

export function recordFailure(keys: string[]) {
  const t = Date.now();
  for (const k of keys) failures.set(k, [...(failures.get(k) ?? []), t]);
}

export function clearFailures(keys: string[]) {
  for (const k of keys) failures.delete(k);
}

import "server-only";
import { getDb } from "@/lib/db";

/* ============================================================
   NEWSLETTER SUBSCRIBERS

   Every newsletter signup is a row here, listed and exported at
   /admin/subscribers (admins only). Nobody is emailed about a
   signup; the subscriber gets their thank-you the first time only.
   ============================================================ */

export type Subscriber = { id: number; email: string; source: string; created_at: string };

/** Adds the address. Returns false when it was already on the list. */
export function addSubscriber(email: string, source: string): boolean {
  const clean = /^\/[a-z0-9/-]{0,100}$/i.test(source) ? source : "";
  const info = getDb()
    .prepare("INSERT OR IGNORE INTO newsletter_subscribers (email, source) VALUES (?, ?)")
    .run(email.trim().toLowerCase(), clean);
  return info.changes > 0;
}

export const SUBSCRIBER_PAGE_SIZE = 50;

function where(q: string | undefined) {
  if (!q) return { clause: "", args: [] as string[] };
  return { clause: "WHERE email LIKE ?", args: [`%${q.replace(/[%_]/g, "")}%`] };
}

export function listSubscribers(q: string | undefined, page: number) {
  const { clause, args } = where(q);
  const db = getDb();
  const total = (db.prepare(`SELECT COUNT(*) AS n FROM newsletter_subscribers ${clause}`).get(...args) as { n: number }).n;
  const pages = Math.max(1, Math.ceil(total / SUBSCRIBER_PAGE_SIZE));
  const p = Math.min(page, pages);
  const rows = db
    .prepare(`SELECT * FROM newsletter_subscribers ${clause} ORDER BY created_at DESC, id DESC LIMIT ? OFFSET ?`)
    .all(...args, SUBSCRIBER_PAGE_SIZE, (p - 1) * SUBSCRIBER_PAGE_SIZE) as Subscriber[];
  return { rows, total, pages, page: p };
}

export function exportSubscribers(q?: string): Subscriber[] {
  const { clause, args } = where(q);
  return getDb()
    .prepare(`SELECT * FROM newsletter_subscribers ${clause} ORDER BY created_at DESC, id DESC`)
    .all(...args) as Subscriber[];
}

export function removeSubscriber(id: number) {
  getDb().prepare("DELETE FROM newsletter_subscribers WHERE id = ?").run(id);
}

export function subscriberCounts() {
  const db = getDb();
  const weekAgo = new Date(Date.now() - 7 * 86400_000).toISOString();
  return {
    total: (db.prepare("SELECT COUNT(*) AS n FROM newsletter_subscribers").get() as { n: number }).n,
    lastWeek: (db.prepare("SELECT COUNT(*) AS n FROM newsletter_subscribers WHERE created_at >= ?").get(weekAgo) as { n: number }).n,
  };
}

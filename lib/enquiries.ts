import "server-only";
import { getDb, now } from "@/lib/db";

/* ============================================================
   EMPLOYER ENQUIRIES

   Every Hire Talent form submission is a row here, worked at
   /admin/enquiries (admins only). Nobody is emailed about a new
   enquiry: check the dashboard. The employer still gets a thank-you
   with their reference.
   ============================================================ */

export const ENQUIRY_STATUSES = [
  { id: "new", label: "New" },
  { id: "contacted", label: "Contacted" },
  { id: "closed", label: "Closed" },
] as const;
export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number]["id"];

export type Enquiry = {
  id: number;
  reference: string;
  need: string;
  service: string;
  industry: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  talent: string;
  location: string;
  positions: string;
  details: string;
  status: EnquiryStatus;
  internal_notes: string;
  created_at: string;
  updated_at: string;
};

export type NewEnquiry = Omit<Enquiry, "id" | "status" | "internal_notes" | "created_at" | "updated_at">;

export function saveEnquiry(e: NewEnquiry): number {
  const info = getDb()
    .prepare(
      `INSERT INTO enquiries (reference, need, service, industry, name, company, email, phone, talent, location, positions, details)
       VALUES (@reference, @need, @service, @industry, @name, @company, @email, @phone, @talent, @location, @positions, @details)`,
    )
    .run(e);
  return Number(info.lastInsertRowid);
}

export function enquiryReferenceTaken(reference: string): boolean {
  try {
    return Boolean(getDb().prepare("SELECT 1 FROM enquiries WHERE reference = ?").get(reference));
  } catch {
    return false;
  }
}

export type EnquiryFilters = { q?: string; status?: string };

function whereFor(f: EnquiryFilters) {
  const where: string[] = [];
  const args: string[] = [];
  if (f.q) {
    const like = `%${f.q.replace(/[%_]/g, "")}%`;
    where.push("(name LIKE ? OR company LIKE ? OR email LIKE ? OR phone LIKE ? OR talent LIKE ? OR location LIKE ? OR reference LIKE ?)");
    args.push(like, like, like, like, like, like, like);
  }
  if (f.status && ENQUIRY_STATUSES.some((s) => s.id === f.status)) {
    where.push("status = ?");
    args.push(f.status);
  }
  return { clause: where.length ? `WHERE ${where.join(" AND ")}` : "", args };
}

export const ENQUIRY_PAGE_SIZE = 25;

export function listEnquiries(f: EnquiryFilters, page: number) {
  const { clause, args } = whereFor(f);
  const db = getDb();
  const total = (db.prepare(`SELECT COUNT(*) AS n FROM enquiries ${clause}`).get(...args) as { n: number }).n;
  const pages = Math.max(1, Math.ceil(total / ENQUIRY_PAGE_SIZE));
  const p = Math.min(page, pages);
  const rows = db
    .prepare(`SELECT * FROM enquiries ${clause} ORDER BY created_at DESC, id DESC LIMIT ? OFFSET ?`)
    .all(...args, ENQUIRY_PAGE_SIZE, (p - 1) * ENQUIRY_PAGE_SIZE) as Enquiry[];
  return { rows, total, pages, page: p };
}

export function exportEnquiries(f: EnquiryFilters): Enquiry[] {
  const { clause, args } = whereFor(f);
  return getDb().prepare(`SELECT * FROM enquiries ${clause} ORDER BY created_at DESC, id DESC`).all(...args) as Enquiry[];
}

export function getEnquiry(id: number): Enquiry | null {
  return (getDb().prepare("SELECT * FROM enquiries WHERE id = ?").get(id) as Enquiry | undefined) ?? null;
}

export function updateEnquiry(id: number, status: EnquiryStatus, notes: string) {
  getDb().prepare("UPDATE enquiries SET status = ?, internal_notes = ?, updated_at = ? WHERE id = ?").run(status, notes, now(), id);
}

export function deleteEnquiry(id: number) {
  getDb().prepare("DELETE FROM enquiries WHERE id = ?").run(id);
}

export function enquiryCounts(): Record<EnquiryStatus | "all", number> {
  const counts = { all: 0, new: 0, contacted: 0, closed: 0 };
  for (const r of getDb().prepare("SELECT status, COUNT(*) AS n FROM enquiries GROUP BY status").all() as { status: EnquiryStatus; n: number }[]) {
    counts[r.status] = r.n;
    counts.all += r.n;
  }
  return counts;
}

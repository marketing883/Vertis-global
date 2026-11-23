import { AdminAuthError, audit, requireUser } from "@/lib/admin/auth";
import { ENQUIRY_STATUSES, exportEnquiries } from "@/lib/enquiries";

/* CSV of employer enquiries matching the list's filters, for admins. */
export const dynamic = "force-dynamic";

function cell(value: unknown): string {
  let s = value === null || value === undefined ? "" : String(value);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function GET(request: Request) {
  let user;
  try {
    user = await requireUser("enquiries");
  } catch (e) {
    const status = e instanceof AdminAuthError ? e.status : 401;
    return Response.json({ error: status === 403 ? "Not allowed" : "Sign in required" }, { status });
  }
  const sp = new URL(request.url).searchParams;
  const rows = exportEnquiries({ q: (sp.get("q") ?? "").slice(0, 100) || undefined, status: sp.get("status") ?? undefined });
  const head = ["Reference", "Received (UTC)", "Status", "Company", "Contact", "Email", "Phone", "Need", "Who they need", "How many", "Where", "Service", "Industry", "Details", "Internal Notes"];
  const lines = [head.map(cell).join(",")];
  for (const e of rows) {
    lines.push(
      [
        e.reference, e.created_at.replace("T", " ").slice(0, 19), ENQUIRY_STATUSES.find((s) => s.id === e.status)?.label ?? e.status,
        e.company, e.name, e.email, e.phone, e.need, e.talent, e.positions, e.location, e.service, e.industry, e.details, e.internal_notes,
      ].map(cell).join(","),
    );
  }
  audit(user, `enquiry.exported.${rows.length}`, "enquiry");
  return new Response(`﻿${lines.join("\r\n")}\r\n`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="vertis-enquiries-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

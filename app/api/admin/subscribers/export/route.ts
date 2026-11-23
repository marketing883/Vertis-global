import { AdminAuthError, audit, requireUser } from "@/lib/admin/auth";
import { exportSubscribers } from "@/lib/subscribers";

/* CSV of newsletter subscribers (all, or the current search), for
   admins. Ready to import into a mailing tool. */
export const dynamic = "force-dynamic";

function cell(value: string): string {
  const s = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function GET(request: Request) {
  let user;
  try {
    user = await requireUser("subscribers");
  } catch (e) {
    const status = e instanceof AdminAuthError ? e.status : 401;
    return Response.json({ error: status === 403 ? "Not allowed" : "Sign in required" }, { status });
  }
  const q = (new URL(request.url).searchParams.get("q") ?? "").slice(0, 100) || undefined;
  const rows = exportSubscribers(q);
  const lines = ["Email,Signed up on,Date (UTC)"];
  for (const s of rows) lines.push([s.email, s.source, s.created_at.replace("T", " ").slice(0, 19)].map(cell).join(","));
  audit(user, `subscriber.exported.${rows.length}`, "subscriber");
  return new Response(`﻿${lines.join("\r\n")}\r\n`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="vertis-newsletter-subscribers-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

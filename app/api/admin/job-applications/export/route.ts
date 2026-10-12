import { AdminAuthError, audit, requireUser } from "@/lib/admin/auth";
import { STATUSES, exportApplications, lookingForLabel, type ApplicationFilters } from "@/lib/applications";
import { SITE } from "@/config/site";

/* CSV of the applications matching the list's current filters, for
   signed-in admins and recruiters. Resumes are not included (only
   whether there is one, and a link that itself needs a sign-in).
   Every export is recorded with its row count. */
export const dynamic = "force-dynamic";

const DATE = /^\d{4}-\d{2}-\d{2}$/;

/** One CSV cell. Values a spreadsheet would run as a formula
    (=, +, -, @, tab, return) are prefixed with ' so they stay text. */
function cell(value: unknown): string {
  let s = value === null || value === undefined ? "" : String(value);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function GET(request: Request) {
  let user;
  try {
    user = await requireUser("job-applications");
  } catch (e) {
    const status = e instanceof AdminAuthError ? e.status : 401;
    return Response.json({ error: status === 403 ? "Not allowed" : "Sign in required" }, { status });
  }

  const sp = new URL(request.url).searchParams;
  const get = (k: string) => sp.get(k) ?? undefined;
  const filters: ApplicationFilters = {
    q: (get("q") ?? "").slice(0, 100),
    status: get("status"),
    job: get("job"),
    lookingFor: get("lookingFor"),
    from: DATE.test(get("from") ?? "") ? get("from") : undefined,
    to: DATE.test(get("to") ?? "") ? get("to") : undefined,
  };
  const rows = exportApplications(filters);
  /* Links point at the site the export came from (staging or live). */
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "";
  const local = /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host);
  const origin = /^[a-z0-9.-]+(:\d+)?$/i.test(host)
    ? `${local ? "http" : "https"}://${host}`
    : SITE.url.replace(/\/$/, "");

  const head = [
    "Reference", "Received (UTC)", "Status", "Name", "Email", "Phone", "Applied For", "Looking For",
    "Kind of Work", "Location", "Message", "Resume", "Resume Link (sign-in required)", "Internal Notes",
  ];
  const lines = [head.map(cell).join(",")];
  for (const a of rows) {
    lines.push(
      [
        a.reference,
        a.created_at.replace("T", " ").slice(0, 19),
        STATUSES.find((s) => s.id === a.status)?.label ?? a.status,
        a.name,
        a.email,
        a.phone,
        a.job_title || "General",
        lookingForLabel(a.looking_for),
        a.work,
        a.location,
        a.message,
        a.resume_filename ?? "None",
        a.resume_path ? `${origin}/api/admin/applications/${a.id}/resume?download=1` : "",
        a.internal_notes,
      ]
        .map(cell)
        .join(","),
    );
  }
  audit(user, `application.exported.${rows.length}`, "application");

  const stamp = new Date().toISOString().slice(0, 10);
  return new Response(`\uFEFF${lines.join("\r\n")}\r\n`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="vertis-applications-${stamp}.csv"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

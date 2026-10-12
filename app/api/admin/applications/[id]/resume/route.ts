import { promises as fs } from "node:fs";
import { AdminAuthError, audit, requireUser } from "@/lib/admin/auth";
import { getApplication, resumeFile } from "@/lib/applications";

/* A candidate's resume, for signed-in admins and recruiters only.
   PDFs open in the browser unless ?download=1; everything else is
   always a download. Never cached, never sniffed, every access is
   recorded (ids only). */
export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  let user;
  try {
    user = await requireUser("job-applications");
  } catch (e) {
    const status = e instanceof AdminAuthError ? e.status : 401;
    return Response.json({ error: status === 403 ? "Not allowed" : "Sign in required" }, { status });
  }

  const id = Number((await params).id);
  const row = Number.isInteger(id) ? getApplication(id) : null;
  const file = row ? resumeFile(row) : null;
  if (!row || !file) return Response.json({ error: "No resume" }, { status: 404 });

  let bytes: Buffer;
  try {
    bytes = await fs.readFile(file);
  } catch {
    return Response.json({ error: "No resume" }, { status: 404 });
  }

  const download = new URL(request.url).searchParams.has("download");
  const type = row.resume_type || "application/octet-stream";
  const inline = !download && type === "application/pdf";
  const name = row.resume_filename || `resume-${row.reference}`;
  const ascii = name.replace(/[^\x20-\x7e]/g, "_").replace(/["\\]/g, "_");
  audit(user, inline ? "application.resume.viewed" : "application.resume.downloaded", "application", id);

  return new Response(new Uint8Array(bytes), {
    headers: {
      "Content-Type": type,
      "Content-Length": String(bytes.length),
      "Content-Disposition": `${inline ? "inline" : "attachment"}; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(name)}`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; sandbox",
      "Referrer-Policy": "no-referrer",
    },
  });
}

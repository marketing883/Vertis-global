import { readResume } from "@/lib/resume-store";

/* The download link in the recruiter email: /resume/<token>.
   Serves the stored resume as a download under the candidate's own
   filename. Unknown or expired tokens get a plain 404, which says
   nothing about whether a token ever existed. Never cached, never
   indexed. See lib/resume-store.ts for storage and retention. */

export const dynamic = "force-dynamic";

const PRIVATE = {
  "Cache-Control": "private, no-store, max-age=0",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
  "Referrer-Policy": "no-referrer",
  "X-Content-Type-Options": "nosniff",
};

export async function GET(_req: Request, { params }: { params: Promise<{ token: string }> }) {
  const resume = await readResume((await params).token);
  if (!resume) {
    return new Response("This resume link has expired or does not exist.", {
      status: 404,
      headers: { ...PRIVATE, "Content-Type": "text/plain; charset=utf-8" },
    });
  }
  /* ASCII fallback plus the exact UTF-8 name, so accented filenames
     survive every browser. */
  const ascii = resume.filename.replace(/[^\x20-\x7E]/g, "_").replace(/["\\]/g, "");
  return new Response(new Uint8Array(resume.bytes), {
    headers: {
      ...PRIVATE,
      "Content-Type": resume.type,
      "Content-Length": String(resume.bytes.length),
      "Content-Disposition": `attachment; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(resume.filename)}`,
    },
  });
}

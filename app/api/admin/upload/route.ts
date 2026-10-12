import { AdminAuthError, audit, requireUser } from "@/lib/admin/auth";
import { CONTENT_TYPES } from "@/lib/content-types";
import { MediaError, saveImage, savePdf } from "@/lib/media";

/* Uploads from the content editors: a cover image or a whitepaper PDF.
   Signed-in admins only (the content sections are admin-only). */
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let user;
  try {
    /* Any content section will do: they share one permission. */
    user = await requireUser(CONTENT_TYPES[0]!.section);
  } catch (e) {
    const status = e instanceof AdminAuthError ? e.status : 401;
    return Response.json({ error: status === 403 ? "Not allowed" : "Sign in required" }, { status });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return Response.json({ error: "Upload a file." }, { status: 400 });
  }
  const file = form.get("file");
  const kind = form.get("kind");
  if (!(file instanceof File) || file.size === 0) return Response.json({ error: "Upload a file." }, { status: 400 });

  try {
    const bytes = Buffer.from(await file.arrayBuffer());
    const saved = kind === "pdf" ? await savePdf(bytes) : await saveImage(bytes);
    audit(user, kind === "pdf" ? "media.pdf_uploaded" : "media.image_uploaded", "media", saved.url);
    return Response.json(saved);
  } catch (e) {
    if (e instanceof MediaError) return Response.json({ error: e.message }, { status: 400 });
    console.error("[upload] failed:", e instanceof Error ? e.message : "unknown error");
    return Response.json({ error: "Upload failed. Try again." }, { status: 500 });
  }
}

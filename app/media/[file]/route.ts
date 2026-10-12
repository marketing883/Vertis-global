import { promises as fs } from "node:fs";
import { mediaFile } from "@/lib/media";

/* Public files uploaded in the admin (lib/media.ts). Names are random
   and never reused, so they can be cached for good. */
export const dynamic = "force-dynamic";

const TYPES: Record<string, string> = { jpg: "image/jpeg", png: "image/png", pdf: "application/pdf" };

export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const path = mediaFile(file);
  if (!path) return new Response("Not found", { status: 404 });
  let bytes: Buffer;
  try {
    bytes = await fs.readFile(path);
  } catch {
    return new Response("Not found", { status: 404 });
  }
  const ext = file.split(".").pop()!;
  return new Response(new Uint8Array(bytes), {
    headers: {
      "Content-Type": TYPES[ext]!,
      "Content-Length": String(bytes.length),
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
      ...(ext === "pdf" ? { "Content-Disposition": "inline" } : {}),
    },
  });
}

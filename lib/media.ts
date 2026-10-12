import "server-only";
import { randomBytes } from "node:crypto";
import { promises as fs } from "node:fs";
import sharp from "sharp";
import { dataPath } from "@/lib/db";

/* ============================================================
   MEDIA

   Images and PDFs uploaded in the admin (covers, whitepaper PDFs).
   Stored beside the database, outside the app checkout so a deploy
   never wipes them:

     <data>/media/<32 hex>.<jpg|png|pdf>

   and served publicly at /media/<name> (app/media/[file]/route.ts).

   Images are decoded and re-encoded, which proves they are images,
   strips camera metadata (GPS and the like), applies the orientation
   and caps the size. PDFs must start with the PDF signature.
   ============================================================ */

export const IMAGE_MAX_BYTES = 8 * 1024 * 1024;
/* Under the 10MB request body limit of proxy.ts, with room for the form. */
export const PDF_MAX_BYTES = 9 * 1024 * 1024;
const MAX_EDGE = 2400;

export const MEDIA_NAME = /^[0-9a-f]{32}\.(jpg|png|pdf)$/;

export class MediaError extends Error {}

function newName(ext: string) {
  return `${randomBytes(16).toString("hex")}.${ext}`;
}

export async function saveImage(bytes: Buffer): Promise<{ url: string; width: number; height: number }> {
  if (bytes.length > IMAGE_MAX_BYTES) throw new MediaError("Images must be under 8MB.");
  let meta;
  try {
    meta = await sharp(bytes, { limitInputPixels: 60_000_000 }).metadata();
  } catch {
    throw new MediaError("That file isn't an image we can read. Use JPG, PNG or WebP.");
  }
  if (!meta.format || !["jpeg", "png", "webp"].includes(meta.format)) {
    throw new MediaError("Use a JPG, PNG or WebP image.");
  }
  const pipeline = sharp(bytes, { limitInputPixels: 60_000_000 })
    .rotate()
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true });
  const out = meta.hasAlpha
    ? await pipeline.png({ compressionLevel: 9 }).toBuffer({ resolveWithObject: true })
    : await pipeline.jpeg({ quality: 86, mozjpeg: true }).toBuffer({ resolveWithObject: true });
  const name = newName(meta.hasAlpha ? "png" : "jpg");
  await fs.writeFile(dataPath("media", name), out.data, { mode: 0o644 });
  return { url: `/media/${name}`, width: out.info.width, height: out.info.height };
}

export async function savePdf(bytes: Buffer): Promise<{ url: string }> {
  if (bytes.length > PDF_MAX_BYTES) throw new MediaError("PDFs must be under 9MB.");
  if (bytes.subarray(0, 5).toString("latin1") !== "%PDF-") throw new MediaError("That file isn't a PDF.");
  const name = newName("pdf");
  await fs.writeFile(dataPath("media", name), bytes, { mode: 0o644 });
  return { url: `/media/${name}` };
}

export function mediaFile(name: string): string | null {
  return MEDIA_NAME.test(name) ? dataPath("media", name) : null;
}

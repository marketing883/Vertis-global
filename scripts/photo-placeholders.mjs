#!/usr/bin/env node
// Builds config/photo-placeholders.json: a tiny blurred preview of every
// photograph in public/photos, as a data URL, keyed by file name.
//
//   node scripts/photo-placeholders.mjs
//
// The hero shows this preview the moment the HTML arrives, then the real
// image replaces it. Each one is a 16px wide WebP of a few hundred bytes,
// so it costs nothing to inline. Only server components read the file
// (components/ui/PageHero.tsx), so it never reaches the browser bundle
// beyond the single preview a page actually uses.
//
// Rerun it after adding or replacing a photograph.
import { readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const DIR = "public/photos";
const OUT = "config/photo-placeholders.json";

const files = (await readdir(DIR)).filter((f) => /\.jpe?g$/i.test(f)).sort();
const out = {};
for (const file of files) {
  const buf = await sharp(path.join(DIR, file))
    .resize({ width: 16 })
    .webp({ quality: 50 })
    .toBuffer();
  out[file.replace(/\.jpe?g$/i, "")] = `data:image/webp;base64,${buf.toString("base64")}`;
}
await writeFile(OUT, JSON.stringify(out, null, 2) + "\n");
const avg = Math.round(Object.values(out).reduce((s, v) => s + v.length, 0) / files.length);
console.log(`${files.length} placeholders written to ${OUT}, ${avg} bytes each on average`);

#!/usr/bin/env node
// Pre-encodes every image the site's pages use, so no visitor waits on
// a first conversion. Run on the server after a deploy, against the
// local app port (not through nginx):
//
//   node scripts/warm-images.mjs http://127.0.0.1:3011
//
// next/image converts on first request (about 1.5s per AVIF width) and
// caches the result in .next/cache/images, which survives rebuilds. So
// the first run after a new image does the work and later runs are
// almost all cache hits. One request at a time: each encode holds a lot
// of memory, and two at once pushed the server past pm2's 600M restart
// limit in testing. Slower, but it runs in the background.
const base = (process.argv[2] || "http://127.0.0.1:3011").replace(/\/$/, "");
const CONCURRENCY = Number(process.env.WARM_CONCURRENCY) || 1;
const FORMATS = ["image/avif", "image/webp"];

// Next 16.1 never refreshes an expired entry: it serves it as STALE,
// with its old max-age, indefinitely. Delete expired entries (file name
// is <maxAge>.<expireAt>.<etag>...) so the crawl below re-encodes them.
// Run from the app checkout; a missing cache dir is fine.
import { readdir, rm } from "node:fs/promises";
const CACHE = ".next/cache/images";
let expired = 0;
for (const key of await readdir(CACHE).catch(() => [])) {
  for (const file of await readdir(`${CACHE}/${key}`).catch(() => [])) {
    if (Number(file.split(".")[1]) < Date.now()) {
      await rm(`${CACHE}/${key}`, { recursive: true, force: true });
      expired++;
    }
  }
}

async function text(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  return res.text();
}

// Sitemap URLs are absolute production URLs; keep the path, use the local port.
const sitemap = await text(`${base}/sitemap.xml`);
const pages = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
  (m) => base + new URL(m[1]).pathname,
);

const images = new Set();
for (const page of pages) {
  try {
    const html = await text(page);
    for (const m of html.matchAll(/\/_next\/image\?url=[^"\s,]+/g)) {
      images.add(m[0].replaceAll("&amp;", "&"));
    }
  } catch (err) {
    console.error(`skip ${page}: ${err.message}`);
  }
}

const jobs = [...images].flatMap((path) => FORMATS.map((accept) => ({ path, accept })));
let done = 0;
let failed = 0;
const started = Date.now();

async function worker() {
  for (let job = jobs.shift(); job; job = jobs.shift()) {
    try {
      const res = await fetch(base + job.path, { headers: { Accept: job.accept } });
      await res.arrayBuffer();
      if (!res.ok) failed++;
    } catch {
      failed++;
    }
    done++;
  }
}

const total = jobs.length;
await Promise.all(Array.from({ length: CONCURRENCY }, worker));
console.log(
  `warmed ${done - failed}/${total} image variants from ${pages.length} pages ` +
    `(${expired} expired entries cleared) ` +
    `in ${Math.round((Date.now() - started) / 1000)}s${failed ? ` (${failed} failed)` : ""}`,
);

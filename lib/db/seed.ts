import type Database from "better-sqlite3";
import { JOBS } from "@/config/jobs";
import { SEED_POSTS } from "@/config/insights";
import { WHITEPAPERS } from "@/config/resources";

/* One-time import of what the site published before the database
   existed, so the live pages look exactly the same after the switch:

     · config/jobs.ts        → jobs (published, marked as samples:
                               the site has always said these are
                               representative roles, not vacancies)
     · config/insights.ts    → content_items, type "blog"
     · config/resources.ts   → content_items, type "whitepaper"

   Runs once per database (flag in `meta`). After that the database
   is the source of truth and those config entries are only history. */

export function seedOnce(db: Database.Database) {
  const done = db.prepare("SELECT value FROM meta WHERE key = 'seeded'").get();
  if (done) return;

  /* Same guard as the migrations: take the write lock, then check again,
     so two processes starting together never seed twice. */
  db.transaction(() => {
    if (db.prepare("SELECT value FROM meta WHERE key = 'seeded'").get()) return;
    const job = db.prepare(`
      INSERT OR IGNORE INTO jobs
        (slug, title, summary, description, industry, location, employment_type, level,
         arrangement, schedule, status, is_sample, posted_at, created_at, updated_at)
      VALUES
        (@slug, @title, @summary, @summary, @industry, @location, @type, @level,
         @arrangement, @schedule, 'published', 1, @posted, @posted, @posted)`);
    for (const j of JOBS) {
      const [arr, ...rest] = j.arrangement.split(",").map((s) => s.trim());
      const arrangement = /remote/i.test(arr!) ? "remote" : /hybrid/i.test(arr!) ? "hybrid" : "onsite";
      job.run({
        slug: j.id,
        title: j.title,
        summary: j.summary,
        industry: j.industry,
        location: j.location,
        type: j.type,
        level: j.level,
        arrangement,
        schedule: rest.join(", "),
        posted: `${j.posted}T09:00:00.000Z`,
      });
    }

    const content = db.prepare(`
      INSERT OR IGNORE INTO content_items
        (type, slug, title, excerpt, body, category, cover_image, cover_alt, data,
         status, published_at, created_at, updated_at)
      VALUES
        (@type, @slug, @title, @excerpt, @body, @category, @cover, @alt, @data,
         'published', @at, @at, @at)`);
    for (const p of SEED_POSTS) {
      content.run({
        type: "blog",
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        body: p.body.join("\n\n"),
        category: p.category,
        cover: p.image.src,
        alt: p.image.alt,
        data: JSON.stringify({ readingMinutes: p.readingMinutes }),
        at: `${p.date}T09:00:00.000Z`,
      });
    }
    const seededAt = new Date().toISOString();
    for (const w of WHITEPAPERS) {
      content.run({
        type: "whitepaper",
        slug: w.slug,
        title: w.title,
        excerpt: w.summary,
        body: "",
        category: "",
        cover: "",
        alt: "",
        data: JSON.stringify({ audience: w.audience, pages: w.pages, file: w.file ?? "" }),
        at: seededAt,
      });
    }

    db.prepare("INSERT INTO meta (key, value) VALUES ('seeded', ?)").run(seededAt);
  }).immediate();
}

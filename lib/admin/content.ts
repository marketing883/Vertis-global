import "server-only";
import { getDb, now } from "@/lib/db";
import { cleanText } from "@/lib/validation/candidate";
import { slugify } from "@/lib/admin/slug";
import { centralToIso, isoToCentral } from "@/lib/admin/central-time";
import type { ContentType } from "@/lib/content-types";
import { parseRow, type ContentItem, type ContentRow } from "@/lib/data/content";

/* Admin reads and writes for case studies, blog posts, whitepapers,
   webinars and news. One validator for all five, driven by the type
   definitions in lib/content-types.ts. Values are cleaned of control
   and invisible characters, links must be http(s), images and PDFs
   must be files on this site, and everything renders as text. */

export type ContentFormValues = Record<string, string>;
export type ContentInput = {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  category: string;
  cover_image: string;
  cover_alt: string;
  author: string;
  published_on: string;
  data: Record<string, string>;
};

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const IMAGE_PATH = /^\/(?:photos|media)\/[A-Za-z0-9._-]+(?:\/[A-Za-z0-9._-]+)*\.(?:jpe?g|png|webp|avif)$/;
const PDF_PATH = /^\/(?:media|whitepapers)\/[A-Za-z0-9._-]+\.pdf$/;
const DAY = /^\d{4}-\d{2}-\d{2}$/;

function safeUrl(v: string): boolean {
  try {
    const u = new URL(v);
    return (u.protocol === "https:" || u.protocol === "http:") && Boolean(u.hostname) && !u.username && !u.password;
  } catch {
    return false;
  }
}

/** Reads and validates the editor form for one type. */
export function parseContentForm(type: ContentType, formData: FormData) {
  const get = (k: string, multi = false) => cleanText(formData.get(k), multi);
  const values: ContentFormValues = {
    title: get("title"),
    slug: get("slug").toLowerCase(),
    excerpt: get("excerpt", true).replace(/\n+/g, " "),
    body: get("body", true),
    category: get("category"),
    cover_image: get("cover_image"),
    cover_alt: get("cover_alt"),
    author: get("author"),
    published_on: get("published_on"),
  };
  for (const f of type.extra) values[`x_${f.name}`] = get(`x_${f.name}`, f.kind === "textarea");

  const errors: Record<string, string> = {};
  const v = values;
  if (v.title!.length < 3) errors.title = "Give it a title.";
  else if (v.title!.length > 160) errors.title = "Keep the title under 160 characters.";
  if (v.slug && (!SLUG.test(v.slug) || v.slug.length > 80)) errors.slug = "Lowercase letters, numbers and single hyphens only.";
  if (!v.excerpt) errors.excerpt = "Add a short summary. It appears in lists and search results.";
  else if (v.excerpt.length > 400) errors.excerpt = "Keep the summary under 400 characters.";
  if (type.hasBody) {
    if (v.body!.length > 60000) errors.body = "That is too long.";
    const external = type.id === "news" && v.x_externalUrl;
    if (!external && type.id !== "webinar" && v.body!.length < 40) errors.body = "Write the article (at least a few sentences).";
  }
  if (type.categories) {
    if (v.category && !type.categories.includes(v.category)) errors.category = "Choose from the list.";
    if (!v.category && type.id === "blog") errors.category = "Choose a category.";
  }
  if (type.hasCover) {
    if (v.cover_image && (!IMAGE_PATH.test(v.cover_image) || v.cover_image.includes(".."))) {
      errors.cover_image = "Upload an image, or use a path under /photos/ on this site.";
    }
    if (v.cover_image && !v.cover_alt) errors.cover_alt = "Describe the image for people who can't see it.";
    if (v.cover_alt!.length > 200) errors.cover_alt = "Keep this under 200 characters.";
  }
  if (v.author!.length > 100) errors.author = "Keep this under 100 characters.";
  if (v.published_on && !DAY.test(v.published_on)) errors.published_on = "Use a date.";

  const data: Record<string, string> = {};
  for (const f of type.extra) {
    const key = `x_${f.name}`;
    const val = v[key]!;
    if (!val) {
      if (f.required) errors[key] = `${f.label} is required.`;
      continue;
    }
    if (f.kind === "url" && (!safeUrl(val) || val.length > 500)) errors[key] = "Use a full link starting with https://";
    else if (f.kind === "number" && !(/^\d{1,5}$/.test(val) && Number(val) > 0)) errors[key] = "Use a whole number.";
    else if (f.kind === "pdf" && !PDF_PATH.test(val)) errors[key] = "Upload a PDF.";
    else if (f.kind === "text" && val.length > 200) errors[key] = "Keep this under 200 characters.";
    else if (f.kind === "textarea" && val.length > 3000) errors[key] = "Keep this under 3000 characters.";
    else if (f.kind === "datetime") {
      const iso = centralToIso(val);
      if (!iso) errors[key] = "Choose a date and time.";
      else data[f.name] = iso;
      continue;
    }
    data[f.name] = val;
  }

  if (Object.keys(errors).length) return { values, errors, input: null };
  const input: ContentInput = {
    title: v.title!,
    slug: v.slug!,
    excerpt: v.excerpt!,
    body: type.hasBody ? v.body! : "",
    category: type.categories ? v.category! : "",
    cover_image: type.hasCover ? v.cover_image! : "",
    cover_alt: type.hasCover ? v.cover_alt! : "",
    author: v.author!,
    published_on: v.published_on!,
    data,
  };
  return { values, errors, input };
}

export type ContentListFilters = { q?: string; status?: string; category?: string; page: number };
export const CONTENT_PAGE_SIZE = 20;

export function listContent(type: ContentType, f: ContentListFilters) {
  const where = ["type = ?"];
  const args: (string | number)[] = [type.id];
  if (f.q) {
    const like = `%${f.q.replace(/[%_]/g, "")}%`;
    where.push("(title LIKE ? OR excerpt LIKE ? OR slug LIKE ? OR author LIKE ?)");
    args.push(like, like, like, like);
  }
  if (f.status === "draft" || f.status === "published") {
    where.push("status = ?");
    args.push(f.status);
  }
  if (f.category && type.categories?.includes(f.category)) {
    where.push("category = ?");
    args.push(f.category);
  }
  const clause = `WHERE ${where.join(" AND ")}`;
  const db = getDb();
  const total = (db.prepare(`SELECT COUNT(*) AS n FROM content_items ${clause}`).get(...args) as { n: number }).n;
  const pages = Math.max(1, Math.ceil(total / CONTENT_PAGE_SIZE));
  const page = Math.min(f.page, pages);
  const rows = db
    .prepare(`SELECT * FROM content_items ${clause} ORDER BY updated_at DESC, id DESC LIMIT ? OFFSET ?`)
    .all(...args, CONTENT_PAGE_SIZE, (page - 1) * CONTENT_PAGE_SIZE) as ContentRow[];
  return { rows: rows.map(parseRow), total, pages, page };
}

export function getContent(type: ContentType, id: number): ContentItem | null {
  const row = getDb().prepare("SELECT * FROM content_items WHERE id = ? AND type = ?").get(id, type.id) as ContentRow | undefined;
  return row ? parseRow(row) : null;
}

function uniqueSlug(type: ContentType, wanted: string, exceptId?: number): string {
  const base = wanted || "item";
  const db = getDb();
  let slug = base;
  for (let i = 2; db.prepare("SELECT 1 FROM content_items WHERE type = ? AND slug = ? AND id IS NOT ?").get(type.id, slug, exceptId ?? null); i++) {
    slug = `${base}-${i}`;
  }
  return slug;
}

const publishedAt = (day: string, fallback: string) => (day ? `${day}T09:00:00.000Z` : fallback);

export function createContent(type: ContentType, input: ContentInput, status: "draft" | "published"): number {
  const t = now();
  const info = getDb()
    .prepare(
      `INSERT INTO content_items (type, slug, title, excerpt, body, category, cover_image, cover_alt, author, data,
         status, published_at, created_at, updated_at)
       VALUES (@type, @slug, @title, @excerpt, @body, @category, @cover_image, @cover_alt, @author, @data,
         @status, @published_at, @t, @t)`,
    )
    .run({
      ...input,
      type: type.id,
      slug: uniqueSlug(type, input.slug || slugify(input.title)),
      data: JSON.stringify(input.data),
      status,
      published_at: status === "published" ? publishedAt(input.published_on, t) : input.published_on ? publishedAt(input.published_on, t) : null,
      t,
    });
  return Number(info.lastInsertRowid);
}

/** Updates an item. Its address is kept once it has been published,
    unless the editor typed a new one on purpose. */
export function updateContent(type: ContentType, id: number, input: ContentInput) {
  const existing = getContent(type, id);
  if (!existing) return false;
  const wanted = input.slug || (existing.published_at ? existing.slug : slugify(input.title));
  getDb()
    .prepare(
      `UPDATE content_items SET slug=@slug, title=@title, excerpt=@excerpt, body=@body, category=@category,
         cover_image=@cover_image, cover_alt=@cover_alt, author=@author, data=@data,
         published_at=@published_at, updated_at=@t WHERE id=@id`,
    )
    .run({
      ...input,
      id,
      slug: uniqueSlug(type, wanted, id),
      data: JSON.stringify(input.data),
      published_at: input.published_on ? publishedAt(input.published_on, now()) : existing.published_at,
      t: now(),
    });
  return true;
}

export function setContentStatus(type: ContentType, id: number, status: "draft" | "published") {
  const t = now();
  getDb()
    .prepare(
      `UPDATE content_items SET status = ?, published_at = CASE WHEN ? = 'published' AND published_at IS NULL THEN ? ELSE published_at END,
         updated_at = ? WHERE id = ? AND type = ?`,
    )
    .run(status, status, t, t, id, type.id);
}

export function deleteContent(type: ContentType, id: number) {
  getDb().prepare("DELETE FROM content_items WHERE id = ? AND type = ?").run(id, type.id);
}

export function contentCounts() {
  return getDb()
    .prepare("SELECT type, status, COUNT(*) AS n FROM content_items GROUP BY type, status")
    .all() as { type: string; status: string; n: number }[];
}

/** An item as editor values (the inverse of parseContentForm). */
export function contentToValues(type: ContentType, item: ContentItem): ContentFormValues {
  const values: ContentFormValues = {
    title: item.title,
    slug: item.slug,
    excerpt: item.excerpt,
    body: item.body,
    category: item.category,
    cover_image: item.cover_image,
    cover_alt: item.cover_alt,
    author: item.author,
    published_on: item.published_at ? item.published_at.slice(0, 10) : "",
  };
  for (const f of type.extra) {
    const raw = item.data[f.name] ?? "";
    values[`x_${f.name}`] = f.kind === "datetime" ? isoToCentral(raw) : String(raw);
  }
  return values;
}

/** Where a published item can be seen on the site. */
export function publicUrl(type: ContentType, item: Pick<ContentItem, "slug">): string {
  return type.hasDetailPage ? `${type.publicPath}/${item.slug}` : type.publicPath;
}

import "server-only";
import { getDb } from "@/lib/db";
import type { ContentTypeId } from "@/lib/content-types";
import type { InsightCategory, InsightPost } from "@/config/insights";
import type { Whitepaper } from "@/config/resources";

/* Public reads of the content table. Only published rows leave this
   file; the admin has its own queries (lib/admin/content.ts).

   The Insights and whitepaper helpers return exactly the shapes the
   existing pages and blocks already render, so those pages only
   changed where they import from. */

export type ContentRow = {
  id: number;
  type: ContentTypeId;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  cover_image: string;
  cover_alt: string;
  author: string;
  data: string;
  status: "draft" | "published";
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ContentItem = Omit<ContentRow, "data"> & { data: Record<string, string> };

export function parseRow(row: ContentRow): ContentItem {
  let data: Record<string, string> = {};
  try {
    data = JSON.parse(row.data) as Record<string, string>;
  } catch {
    /* a damaged data field renders without its extras */
  }
  return { ...row, data };
}

/** Body text as blocks: blank lines separate them. */
export function bodyBlocks(body: string): string[] {
  return body
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean);
}

export function readingMinutes(item: Pick<ContentItem, "body" | "data">): number {
  const set = Number(item.data.readingMinutes);
  if (Number.isFinite(set) && set > 0) return Math.round(set);
  const words = item.body.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export function listPublished(type: ContentTypeId, limit?: number): ContentItem[] {
  const rows = getDb()
    .prepare(
      `SELECT * FROM content_items WHERE type = ? AND status = 'published'
       ORDER BY published_at DESC, id DESC ${limit ? "LIMIT ?" : ""}`,
    )
    .all(...(limit ? [type, limit] : [type])) as ContentRow[];
  return rows.map(parseRow);
}

export function getPublished(type: ContentTypeId, slug: string): ContentItem | null {
  const row = getDb()
    .prepare("SELECT * FROM content_items WHERE type = ? AND slug = ? AND status = 'published'")
    .get(type, slug) as ContentRow | undefined;
  return row ? parseRow(row) : null;
}

export function hasPublished(type: ContentTypeId): boolean {
  return Boolean(
    getDb()
      .prepare("SELECT 1 FROM content_items WHERE type = ? AND status = 'published' LIMIT 1")
      .get(type),
  );
}

/* ── Insights (blog posts), in the shape the site already uses ──── */

const FALLBACK_COVER = { src: "/photos/insight-staffing-plan.jpg", alt: "" };

export function toInsightPost(item: ContentItem): InsightPost {
  return {
    slug: item.slug,
    title: item.title,
    excerpt: item.excerpt,
    category: (item.category || "Industry") as InsightCategory,
    date: (item.published_at ?? item.created_at).slice(0, 10),
    readingMinutes: readingMinutes(item),
    image: item.cover_image
      ? { src: item.cover_image, alt: item.cover_alt }
      : FALLBACK_COVER,
    body: bodyBlocks(item.body),
  };
}

export function getInsights(): InsightPost[] {
  return listPublished("blog").map(toInsightPost);
}

export function getLatestInsights(count = 3): InsightPost[] {
  return listPublished("blog", count).map(toInsightPost);
}

export function getInsight(slug: string): InsightPost | null {
  const item = getPublished("blog", slug);
  return item ? toInsightPost(item) : null;
}

/* ── Whitepapers, in the shape the site already uses ────────────── */

export function getWhitepapers(): Whitepaper[] {
  return listPublished("whitepaper").map((item) => ({
    slug: item.slug,
    title: item.title,
    summary: item.excerpt,
    audience: item.data.audience ?? "",
    pages: Number(item.data.pages) || 0,
    file: item.data.file || null,
  }));
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight, CalendarDays, Clock } from "lucide-react";
import { Container, Eyebrow, Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { HireTalentButton } from "@/components/hire/HireTalentButton";
import { Prose } from "@/components/content/Prose";
import { formatInsightDate } from "@/config/insights";
import { contentType, type ContentTypeId } from "@/lib/content-types";
import {
  bodyBlocks,
  getPublished,
  listPublished,
  readingMinutes,
  type ContentItem,
} from "@/lib/data/content";

/* ============================================================
   PUBLIC PAGES FOR CASE STUDIES, WEBINARS AND NEWS

   Built from the same parts as Insights (the editorial list, the
   narrow article column, Prose) so they read as part of the site.
   An index with nothing published returns 404 and stays out of the
   sitemap, so there is never an empty page to find.
   ============================================================ */

const INTRO: Record<"case-study" | "webinar" | "news", { eyebrow: string; heading: string; line: string }> = {
  "case-study": {
    eyebrow: "Case studies",
    heading: "Work we have done.",
    line: "Real placements and programmes, what the client needed, and how it turned out.",
  },
  webinar: {
    eyebrow: "Webinars",
    heading: "Talks from our recruiters.",
    line: "Live sessions and recordings on hiring, staffing plans and the job market.",
  },
  news: {
    eyebrow: "News & press",
    heading: "News from Vertis Global.",
    line: "Announcements, press releases and coverage elsewhere.",
  },
};

type ListableId = keyof typeof INTRO;

/* ── Shared bits ───────────────────────────────────────────── */

function itemDate(item: ContentItem) {
  return (item.published_at ?? item.created_at).slice(0, 10);
}

/** "Thu, Oct 22, 2026, 11:00 AM CDT", or null if unset/invalid. */
export function formatEventAt(value: string | undefined): string | null {
  if (!value) return null;
  const d = new Date(`${value}${/[zZ]|[+-]\d\d:?\d\d$/.test(value) ? "" : "-05:00"}`);
  if (Number.isNaN(d.getTime())) return null;
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(d);
}

function eventIsPast(value: string | undefined): boolean {
  if (!value) return false;
  const d = new Date(`${value}${/[zZ]|[+-]\d\d:?\d\d$/.test(value) ? "" : "-05:00"}`);
  return !Number.isNaN(d.getTime()) && d.getTime() < Date.now();
}

function hrefFor(type: ListableId, item: ContentItem): { href: string; external: boolean } {
  if (type === "news" && item.data.externalUrl) return { href: item.data.externalUrl, external: true };
  return { href: `${contentType(type).publicPath}/${item.slug}`, external: false };
}

function metaLine(type: ListableId, item: ContentItem): string {
  if (type === "webinar") return formatEventAt(item.data.eventAt) ?? formatInsightDate(itemDate(item));
  const parts = [item.category, item.data.source, formatInsightDate(itemDate(item))].filter(Boolean);
  return parts.join(" · ");
}

/* ── Index ─────────────────────────────────────────────────── */

export function contentIndexMetadata(type: ListableId): Metadata {
  const t = contentType(type);
  return {
    title: t.label,
    description: INTRO[type].line,
    alternates: { canonical: t.publicPath },
  };
}

export function ContentIndexPage({ type }: { type: ListableId }) {
  const items = listPublished(type);
  if (items.length === 0) notFound();
  const intro = INTRO[type];

  return (
    <Section background="paper" spacing="none" className="pt-16 pb-24 md:pt-20 md:pb-32 lg:pb-44">
      <Container>
        <Eyebrow>{intro.eyebrow}</Eyebrow>
        <div className="mt-7 grid gap-10 lg:grid-cols-12 lg:items-end">
          <h1 className="max-w-[14ch] lg:col-span-7">{intro.heading}</h1>
          <p className="max-w-[40ch] text-lg text-n-500 lg:col-span-5">{intro.line}</p>
        </div>

        <ul className="mt-16 border-t border-n-200 lg:mt-24">
          {items.map((item, i) => {
            const { href, external } = hrefFor(type, item);
            const inner = (
              <>
                <div className="relative aspect-[3/2] overflow-hidden bg-paper-2 md:col-span-4">
                  {item.cover_image ? (
                    <Image
                      src={item.cover_image}
                      alt=""
                      fill
                      priority={i === 0}
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                    />
                  ) : null}
                </div>
                <div className="min-w-0 md:col-span-8">
                  <p className="tabular text-[0.9375rem] text-n-500">{metaLine(type, item)}</p>
                  <h2 className="mt-3 max-w-[24ch] text-[clamp(1.5rem,2.6vw,2.25rem)] text-ink transition-colors group-hover:text-accent">
                    {item.title}
                  </h2>
                  {item.excerpt ? (
                    <p className="mt-4 max-w-[56ch] text-[1.0625rem] leading-relaxed text-n-500">{item.excerpt}</p>
                  ) : null}
                  <span className="link-underline mt-6 text-[1.0625rem] text-ink">
                    {external ? `Read at ${item.data.source || "the source"}` : "Read more"}
                    <ArrowUpRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                </div>
              </>
            );
            const cls = "group grid gap-6 py-10 md:grid-cols-12 md:items-center md:gap-10 lg:py-12";
            return (
              <li key={item.id} className="border-b border-n-200">
                {external ? (
                  <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
                    {inner}
                  </a>
                ) : (
                  <Link href={href} className={cls}>
                    {inner}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}

/* ── Detail ────────────────────────────────────────────────── */

export function contentStaticParams(type: ListableId) {
  return listPublished(type).map((i) => ({ slug: i.slug }));
}

export function contentDetailMetadata(type: ListableId, slug: string): Metadata {
  const item = getPublished(type, slug);
  if (!item) return {};
  const t = contentType(type);
  return {
    title: item.title,
    description: item.excerpt,
    alternates: { canonical: `${t.publicPath}/${item.slug}` },
    openGraph: {
      type: "article",
      title: item.title,
      description: item.excerpt,
      ...(item.cover_image ? { images: [{ url: item.cover_image, alt: item.cover_alt }] } : {}),
    },
  };
}

export function ContentDetailPage({ type, slug }: { type: ListableId; slug: string }) {
  const item = getPublished(type, slug);
  if (!item) notFound();
  return <ContentArticle type={type} item={item} />;
}

/** The article itself; also used by the admin preview. */
export function ContentArticle({ type, item }: { type: ContentTypeId; item: ContentItem }) {
  const t = contentType(type);
  const date = itemDate(item);
  const results = (item.data.results ?? "")
    .split("\n")
    .map((r) => r.replace(/^\s*[-*•]\s*/, "").trim())
    .filter(Boolean);
  const speakers = (item.data.speakers ?? "")
    .split("\n")
    .map((r) => r.trim())
    .filter(Boolean);
  const eventAt = formatEventAt(item.data.eventAt);
  const past = eventIsPast(item.data.eventAt);
  const backLabel = type === "blog" ? "All insights" : `All ${t.label.toLowerCase()}`;

  return (
    <Section background="paper" spacing="none" className="pt-16 pb-24 md:pt-20 md:pb-32">
      <Container size="narrow">
        <Link href={t.publicPath} className="link-underline text-[0.9375rem] text-n-500">
          <ArrowLeft className="size-4" strokeWidth={1.75} aria-hidden="true" />
          {backLabel}
        </Link>
        <article className="mt-12">
          <header>
            <Eyebrow>{item.category || t.singular}</Eyebrow>
            <h1 className="mt-7 max-w-[22ch] text-[clamp(2.25rem,5vw,4rem)]">{item.title}</h1>
            <p className="tabular mt-8 text-[0.9375rem] text-n-500">
              {type === "webinar" && eventAt ? (
                <>
                  <CalendarDays className="mr-1.5 inline size-4 align-[-2px]" strokeWidth={1.75} aria-hidden="true" />
                  {eventAt}
                  {item.data.durationMinutes ? (
                    <>
                      <span aria-hidden="true"> · </span>
                      <Clock className="mr-1 inline size-4 align-[-2px]" strokeWidth={1.75} aria-hidden="true" />
                      {item.data.durationMinutes} minutes
                    </>
                  ) : null}
                </>
              ) : (
                <>
                  <time dateTime={date}>{formatInsightDate(date)}</time>
                  {type === "news" && item.data.source ? (
                    <>
                      <span aria-hidden="true"> · </span>
                      {item.data.source}
                    </>
                  ) : null}
                  {type === "blog" || type === "case-study" ? (
                    <>
                      <span aria-hidden="true"> · </span>
                      {readingMinutes(item)} min read
                    </>
                  ) : null}
                </>
              )}
            </p>
            {type === "case-study" && item.data.client ? (
              <p className="mt-2 text-[1.0625rem] text-n-600">Client: {item.data.client}</p>
            ) : null}
          </header>

          {item.cover_image ? (
            <div className="relative mt-12 aspect-[3/2] overflow-hidden bg-paper-2">
              <Image
                src={item.cover_image}
                alt={item.cover_alt}
                fill
                priority
                sizes="(max-width: 880px) 100vw, 880px"
                className="object-cover"
              />
            </div>
          ) : null}

          {results.length ? (
            <section className="mt-12 rounded-lg bg-ink p-8 sm:p-10">
              <p className="eyebrow text-on-ink-muted">Results</p>
              <ul className="mt-6 space-y-4">
                {results.map((r) => (
                  <li key={r} className="flex gap-3 text-[1.125rem] leading-relaxed text-white">
                    <span aria-hidden="true" className="mt-3 size-1.5 shrink-0 rounded-full bg-amber" />
                    {r}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {speakers.length ? (
            <section className="mt-12">
              <p className="eyebrow">Speakers</p>
              <ul className="mt-4 space-y-2 text-[1.125rem] text-n-600">
                {speakers.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </section>
          ) : null}

          <Prose blocks={bodyBlocks(item.body)} />

          <footer className="mt-16 border-t border-n-200 pt-10">
            {type === "webinar" && !past && item.data.registrationUrl ? (
              <Button href={item.data.registrationUrl} target="_blank" rel="noopener noreferrer">
                Register for this webinar
                <ArrowUpRight strokeWidth={2} aria-hidden="true" />
              </Button>
            ) : type === "webinar" && item.data.recordingUrl ? (
              <Button href={item.data.recordingUrl} target="_blank" rel="noopener noreferrer">
                Watch the recording
                <ArrowUpRight strokeWidth={2} aria-hidden="true" />
              </Button>
            ) : type === "news" && item.data.externalUrl ? (
              <a href={item.data.externalUrl} target="_blank" rel="noopener noreferrer" className="link-underline text-[1.0625rem]">
                Read at {item.data.source || "the source"}
                <ArrowUpRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
              </a>
            ) : (
              <>
                <p className="max-w-[40ch] text-lg text-n-500">
                  Need people? Tell us what you are working on and a recruiter will be in touch within a business day.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-x-10 gap-y-5">
                  <HireTalentButton />
                  <Link href="/jobs" className="link-underline text-[1.0625rem]">
                    Browse jobs
                    <ArrowRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
                  </Link>
                </div>
              </>
            )}
          </footer>
        </article>
      </Container>
    </Section>
  );
}

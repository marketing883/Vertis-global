import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container, Eyebrow, Section } from "@/components/ui/Section";
import { formatInsightDate, type InsightPost } from "@/config/insights";
import type { Whitepaper } from "@/config/resources";

/* Three articles and one whitepaper, as a four up row. Used at the
   foot of the interior pages, where the visitor is either ready to
   talk or wants to read something first. */
export function ResourceGrid({
  posts,
  paper,
  heading = "Worth reading before you hire.",
  eyebrow = "Resources",
}: {
  posts: InsightPost[];
  /** WHITEPAPERS[0] is possibly undefined, so this takes undefined. */
  paper?: Whitepaper;
  heading?: string;
  eyebrow?: string;
}) {
  return (
    <Section background="paper">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
          <div>
            <Eyebrow>{eyebrow}</Eyebrow>
            <h2 className="mt-7 max-w-[16ch]">{heading}</h2>
          </div>
          <Link href="/insights" className="link-underline text-[1.0625rem]">
            All insights
            <ArrowUpRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
          </Link>
        </div>

        <ul className="mt-16 grid gap-5 md:grid-cols-2 lg:mt-20 lg:grid-cols-4 lg:gap-6">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link href={`/insights/${post.slug}`} className="group flex h-full flex-col">
                <span className="relative block aspect-[3/2] overflow-hidden rounded-lg bg-paper-2">
                  <Image
                    src={post.image.src}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                  />
                </span>
                <span className="tabular mt-5 block text-[0.875rem] text-n-400">
                  <span className="text-accent-dark">{post.category}</span>
                  <span aria-hidden="true"> · </span>
                  <time dateTime={post.date}>{formatInsightDate(post.date)}</time>
                </span>
                <span className="mt-2 block text-[1.125rem] leading-snug font-semibold text-ink transition-colors group-hover:text-accent">
                  {post.title}
                </span>
              </Link>
            </li>
          ))}

          {paper ? (
            <li>
              <Link
                href="/whitepapers"
                className="group flex h-full flex-col justify-between rounded-lg bg-ink p-7 text-on-ink on-ink"
              >
                <div>
                  <p className="eyebrow">Whitepaper</p>
                  <p className="mt-6 text-[1.125rem] leading-snug font-semibold text-white transition-colors group-hover:text-amber">
                    {paper.title}
                  </p>
                  <p className="mt-3 text-[0.9375rem] leading-relaxed text-on-ink-muted">
                    {paper.audience}, {paper.pages} pages.
                  </p>
                </div>
                <span className="link-underline mt-8 text-[1.0625rem] text-white">
                  Browse whitepapers
                  <ArrowUpRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
                </span>
              </Link>
            </li>
          ) : null}
        </ul>
      </Container>
    </Section>
  );
}

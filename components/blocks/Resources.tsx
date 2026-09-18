import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BookOpen, Mail } from "lucide-react";
import { Container, Eyebrow, Section } from "@/components/ui/Section";
import { NewsletterForm } from "@/components/blocks/NewsletterForm";
import { formatInsightDate, getLatestInsights, type InsightPost } from "@/config/insights";
import { NEWSLETTER, WHITEPAPERS } from "@/config/resources";
import { cn } from "@/lib/utils";

/* The resources grid: the three latest Insights articles as
   photographic tiles, plus whitepapers and the newsletter, which
   are their own resources and live outside Insights. The newest
   article stands tall on the left, the rest fill two columns
   beside it. Publishing a post in config/insights.ts rotates it in
   automatically; whitepapers come from config/resources.ts. */
export function Resources() {
  const [lead, second, third] = getLatestInsights(3);
  if (!lead) return null;

  return (
    <Section background="paper" id="resources">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
          <div>
            <Eyebrow>Resources</Eyebrow>
            <h2 className="mt-7 max-w-[16ch]">Straight talk about work and hiring.</h2>
          </div>
          <Link href="/insights" className="link-underline text-[1.0625rem]">
            Read the blog
            <ArrowUpRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:mt-20 lg:grid-cols-3 lg:grid-rows-[repeat(2,minmax(300px,auto))]">
          <PostTile post={lead} tall className="md:row-span-2 lg:col-start-1 lg:row-start-1" />

          <ResourceTile
            className="lg:col-start-2 lg:row-start-1"
            tone="paper"
            eyebrow="Deep dives"
            icon={<BookOpen className="size-5" strokeWidth={1.75} aria-hidden="true" />}
            title="Whitepapers"
            line={`${WHITEPAPERS.length} guides for the people who sign off: contract-to-hire, peak season planning and more.`}
            href="/whitepapers"
            cta="Browse whitepapers"
          />

          {second ? <PostTile post={second} className="lg:col-start-2 lg:row-start-2" /> : null}
          {third ? <PostTile post={third} className="lg:col-start-3 lg:row-start-1" /> : null}

          <ResourceTile
            className="lg:col-start-3 lg:row-start-2"
            tone="ink"
            eyebrow="Newsletter"
            icon={<Mail className="size-5" strokeWidth={1.75} aria-hidden="true" />}
            title={NEWSLETTER.name}
            line={NEWSLETTER.line}
          >
            <NewsletterForm tone="ink" className="mt-8" />
          </ResourceTile>
        </div>
      </Container>
    </Section>
  );
}

function PostTile({ post, tall = false, className }: { post: InsightPost; tall?: boolean; className?: string }) {
  return (
    <Link
      href={`/insights/${post.slug}`}
      className={cn(
        "group relative flex flex-col justify-end overflow-hidden rounded-lg bg-ink p-7 text-white on-ink",
        tall ? "min-h-[520px] lg:min-h-0" : "min-h-[360px] lg:min-h-0",
        className,
      )}
    >
      <Image
        src={post.image.src}
        alt=""
        fill
        sizes={tall ? "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" : "(max-width: 768px) 100vw, 33vw"}
        className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
      />
      <div aria-hidden="true" className="scrim-caption absolute inset-0" />
      <p className="eyebrow absolute top-7 left-7">{post.category}</p>
      <div className="relative">
        <p className="tabular text-[0.9375rem] text-on-ink-muted">
          <time dateTime={post.date}>{formatInsightDate(post.date)}</time>
          <span aria-hidden="true"> · </span>
          {post.readingMinutes} min read
        </p>
        <h3
          className={cn(
            "mt-3 text-white transition-colors group-hover:text-amber",
            tall ? "max-w-[18ch] text-[clamp(1.5rem,2.4vw,2.125rem)]" : "max-w-[22ch] text-[clamp(1.25rem,1.7vw,1.5rem)]",
          )}
        >
          {post.title}
        </h3>
      </div>
    </Link>
  );
}

function ResourceTile({
  tone,
  eyebrow,
  icon,
  title,
  line,
  href,
  cta,
  children,
  className,
}: {
  tone: "paper" | "ink";
  eyebrow: string;
  icon: React.ReactNode;
  title: string;
  line: string;
  href?: string;
  cta?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const onInk = tone === "ink";
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-lg p-7",
        onInk ? "bg-ink text-on-ink on-ink" : "bg-paper-2",
        className,
      )}
    >
      <p className="eyebrow">{eyebrow}</p>
      <div className="mt-6 flex items-center gap-4">
        <span
          className={cn(
            "grid size-11 shrink-0 place-items-center rounded-md",
            onInk ? "bg-white/10 text-amber" : "bg-white text-orange",
          )}
        >
          {icon}
        </span>
        <h3 className={cn("text-[1.5rem]", onInk ? "text-white" : "text-ink")}>{title}</h3>
      </div>
      <p className={cn("mt-5 max-w-[34ch] text-[1.0625rem] leading-relaxed", onInk ? "text-on-ink-muted" : "text-n-500")}>
        {line}
      </p>
      {href && cta ? (
        <Link href={href} className={cn("link-underline mt-auto pt-8 text-[1.0625rem]", !onInk && "text-ink")}>
          {cta}
          <ArrowUpRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
        </Link>
      ) : null}
      {children}
    </div>
  );
}

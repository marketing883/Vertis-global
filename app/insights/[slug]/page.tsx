import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Container, Eyebrow, Section } from "@/components/ui/Section";
import { HireTalentButton } from "@/components/hire/HireTalentButton";
import { InsightList } from "@/components/blocks/InsightList";
import { formatInsightDate, getInsight, getInsights } from "@/config/insights";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return getInsights().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const post = getInsight((await params).slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/insights/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
      images: [{ url: post.image.src, alt: post.image.alt }],
    },
  };
}

export default async function InsightArticlePage({ params }: { params: Params }) {
  const post = getInsight((await params).slug);
  if (!post) notFound();

  const more = getInsights()
    .filter((p) => p.slug !== post.slug)
    .slice(0, 2);
  const employer = post.category === "For employers";

  return (
    <>
      <Section background="paper" spacing="none" className="pt-16 pb-24 md:pt-20 md:pb-32">
        <Container size="narrow">
          <Link href="/insights" className="link-underline text-[0.9375rem] text-n-500">
            <ArrowLeft className="size-4" strokeWidth={1.75} aria-hidden="true" />
            All insights
          </Link>
          <article className="mt-12">
            <header>
              <Eyebrow>{post.category}</Eyebrow>
              <h1 className="mt-7 max-w-[22ch] text-[clamp(2.25rem,5vw,4rem)]">{post.title}</h1>
              <p className="tabular mt-8 text-[0.9375rem] text-n-500">
                <time dateTime={post.date}>{formatInsightDate(post.date)}</time>
                <span aria-hidden="true"> · </span>
                {post.readingMinutes} min read
              </p>
            </header>

            <div className="relative mt-12 aspect-[3/2] overflow-hidden bg-paper-2">
              <Image
                src={post.image.src}
                alt={post.image.alt}
                fill
                priority
                sizes="(max-width: 880px) 100vw, 880px"
                className="object-cover"
              />
            </div>

            <div className="mt-14 max-w-[64ch]">
              {post.body.map((block, i) =>
                block.startsWith("## ") ? (
                  <h2
                    key={i}
                    className="mt-12 text-[clamp(1.5rem,2.4vw,1.875rem)] leading-snug first:mt-0"
                  >
                    {block.slice(3)}
                  </h2>
                ) : (
                  <p key={i} className="mt-6 text-[1.125rem] leading-[1.75] text-n-600">
                    {block}
                  </p>
                ),
              )}
            </div>

            <footer className="mt-16 border-t border-n-200 pt-10">
              <p className="max-w-[40ch] text-lg text-n-500">
                {employer
                  ? "Need people? Tell us what you are working on and a recruiter will be in touch within a business day."
                  : "Looking for work? Browse open roles, or send us your resume and we will call when something fits."}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-10 gap-y-5">
                {employer ? (
                  <HireTalentButton />
                ) : (
                  <Link href="/jobs" className="link-underline text-[1.0625rem]">
                    Browse jobs
                    <ArrowRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
                  </Link>
                )}
              </div>
            </footer>
          </article>
        </Container>
      </Section>

      {more.length > 0 ? (
        <Section background="white" spacing="compact">
          <Container>
            <Eyebrow>Keep reading</Eyebrow>
            <InsightList posts={more} className="mt-10" />
          </Container>
        </Section>
      ) : null}
    </>
  );
}

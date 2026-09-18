import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { formatInsightDate, type InsightPost } from "@/config/insights";
import { cn } from "@/lib/utils";

/* One editorial row per article: photograph, then the words. Used
   by the homepage (three latest) and the Insights index (all). The
   whole row is the link. */
export function InsightList({ posts, className }: { posts: InsightPost[]; className?: string }) {
  return (
    <ul className={cn("border-t border-n-200", className)}>
      {posts.map((post) => (
        <li key={post.slug} className="border-b border-n-200">
          <Link
            href={`/insights/${post.slug}`}
            className="group grid gap-6 py-10 md:grid-cols-12 md:items-center md:gap-10 lg:py-12"
          >
            <div className="relative aspect-[3/2] overflow-hidden bg-paper-2 md:col-span-4">
              <Image
                src={post.image.src}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
              />
            </div>
            <div className="min-w-0 md:col-span-8">
              <p className="tabular text-[0.9375rem] text-n-400">
                <span className="text-accent-dark">{post.category}</span>
                <span aria-hidden="true"> · </span>
                <time dateTime={post.date}>{formatInsightDate(post.date)}</time>
                <span aria-hidden="true"> · </span>
                {post.readingMinutes} min read
              </p>
              <h3 className="mt-3 max-w-[24ch] text-[clamp(1.5rem,2.6vw,2.25rem)] text-ink transition-colors group-hover:text-accent">
                {post.title}
              </h3>
              <p className="mt-4 max-w-[56ch] text-[1.0625rem] leading-relaxed text-n-500">{post.excerpt}</p>
              <span className="link-underline mt-6 text-[1.0625rem] text-ink">
                Read the article
                <ArrowUpRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

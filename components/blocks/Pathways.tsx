"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Photo } from "@/components/media/Photo";
import { useHireTalent } from "@/components/hire/HireTalentProvider";

/* The close. Two customers, two panels, equal weight. The employer
   panel opens the inquiry modal; the candidate panel goes to jobs. */
export function Pathways() {
  const { open } = useHireTalent();

  const panels = [
    {
      photo: "pathEmployer" as const,
      kicker: "Need people?",
      title: "Let's find them.",
      body: "Tell us what you need. A person will be in touch within a business day.",
      cta: "Hire talent",
      onClick: open,
    },
    {
      photo: "pathCandidate" as const,
      kicker: "Looking for work?",
      title: "Let's find it.",
      body: "Browse open roles, or send us your resume and we'll call when something fits.",
      cta: "Explore jobs",
      href: "/jobs",
    },
  ];

  return (
    <Section background="ink" spacing="none">
      <h2 className="sr-only">Get started</h2>
      <div className="grid md:grid-cols-2">
        {panels.map((p) => {
          const inner = (
            <>
              <Photo
                slot={p.photo}
                fill
                overlay="strong"
                sizes="(max-width: 768px) 100vw, 50vw"
                className="absolute inset-0 h-full w-full transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
              />
              <div className="relative">
                <p className="eyebrow text-white/70">{p.kicker}</p>
                <h3 className="mt-5 text-[clamp(2rem,3.6vw,3rem)] leading-[1.02] font-bold tracking-[-0.03em] text-white">
                  {p.title}
                </h3>
                <p className="mt-5 max-w-[36ch] text-lg leading-relaxed text-white/75">{p.body}</p>
                <span className="link-underline mt-8 text-[1.0625rem] text-white">
                  {p.cta}
                  <ArrowRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
                </span>
              </div>
            </>
          );
          const cls =
            "group relative flex min-h-[520px] w-full flex-col justify-end overflow-hidden p-10 text-left lg:min-h-[640px] lg:p-16";
          return "href" in p && p.href ? (
            <Link key={p.kicker} href={p.href} className={cls}>
              {inner}
            </Link>
          ) : (
            <button key={p.kicker} type="button" onClick={p.onClick} className={cls}>
              {inner}
            </button>
          );
        })}
      </div>
    </Section>
  );
}

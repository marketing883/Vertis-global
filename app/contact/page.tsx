import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Briefcase, Mail, MessageSquare, UserRound } from "lucide-react";
import { Container, Eyebrow, Section } from "@/components/ui/Section";
import { Photo } from "@/components/media/Photo";
import { HireTalentButton } from "@/components/hire/HireTalentButton";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Talk to Vertis Global about the people you need to hire, or about the work you are looking for. A person replies within a business day.",
  alternates: { canonical: "/contact" },
};

/* A light page: /contact is in LIGHT_HEADER_ROUTES, so the header
   stays solid and the hero opens on paper.

   Deliberately one form on the site, not two. The employer enquiry
   is the Hire Talent modal, which already validates, emails and
   confirms, so this page routes an employer into it rather than
   asking the same eight questions on a second form. Job seekers get
   the careers inbox and the resume form. Everything else gets the
   general inbox. Three doors, each clearly marked. */

const WAYS = [
  {
    icon: Briefcase,
    eyebrow: "Employers",
    title: "Need people?",
    body: "Tell us the role, the numbers and the start date. A recruiter who knows your industry comes back within a business day with an honest read on the market.",
    action: "modal" as const,
  },
  {
    icon: UserRound,
    eyebrow: "Job seekers",
    title: "Looking for work?",
    body: "Send your resume or portfolio to our recruiters, or use the short form. A person reads it, and you hear back either way.",
    action: "careers" as const,
  },
  {
    icon: MessageSquare,
    eyebrow: "Everything else",
    title: "Something else?",
    body: "Partnerships, press, an existing placement, or a question that does not fit a form. Write to us and it reaches the right person.",
    action: "general" as const,
  },
];

const NEXT = [
  { title: "You write or call", body: "Through the form, the inbox, or the button. Whichever is easiest." },
  { title: "A person replies", body: "Within a business day. Not an autoresponder, and not a ticket number." },
  { title: "We get specific", body: "Roles, numbers, dates and rates for employers. The work you want and where for job seekers." },
];

export default function ContactPage() {
  return (
    <>
      {/* ── 1 · Hero ─────────────────────────────────────────── */}
      <Section background="paper" spacing="none" className="pt-16 pb-20 md:pt-20 md:pb-28">
        <Container>
          <Eyebrow>Contact</Eyebrow>
          <div className="mt-7 grid gap-10 lg:grid-cols-12 lg:items-end">
            <h1 className="max-w-[13ch] lg:col-span-7">Talk to a person, not a portal.</h1>
            <p className="max-w-[40ch] text-lg text-n-500 lg:col-span-5">
              Whether you need your next hire or your next opportunity, the fastest way to start is
              a conversation. Every message reaches a recruiter, and you hear back within a
              business day.
            </p>
          </div>
        </Container>
      </Section>

      {/* ── 2 · Three doors ──────────────────────────────────── */}
      <Section background="white" spacing="none" className="pb-24 md:pb-32">
        <Container>
          <ul className="grid gap-px overflow-hidden rounded-lg border border-n-200 bg-n-200 lg:grid-cols-3">
            {WAYS.map((w) => {
              const Icon = w.icon;
              return (
                <li key={w.title} className="flex flex-col bg-white p-8 lg:p-10">
                  <Icon className="size-6 text-orange" strokeWidth={1.75} aria-hidden="true" />
                  <p className="eyebrow mt-8">{w.eyebrow}</p>
                  <h2 className="mt-4 text-[clamp(1.5rem,2.2vw,1.875rem)] text-ink">{w.title}</h2>
                  <p className="mt-4 max-w-[38ch] flex-1 text-[1.0625rem] leading-relaxed text-n-500">
                    {w.body}
                  </p>
                  <div className="mt-8">
                    {w.action === "modal" ? (
                      <>
                        <HireTalentButton size="md">Hire Talent</HireTalentButton>
                        <p className="mt-4 text-[0.9375rem] text-n-500">
                          Or email{" "}
                          <a href={`mailto:${SITE.staffingEmail}`} className="link-underline text-ink">
                            {SITE.staffingEmail}
                          </a>
                        </p>
                      </>
                    ) : w.action === "careers" ? (
                      <>
                        <a
                          href={`mailto:${SITE.careersEmail}?subject=${encodeURIComponent("Resume for Vertis Global")}`}
                          className="link-underline inline-flex items-center gap-2 text-[1.0625rem] text-ink"
                        >
                          <Mail className="size-4 text-orange" strokeWidth={1.75} aria-hidden="true" />
                          {SITE.careersEmail}
                        </a>
                        <p className="mt-4 text-[0.9375rem] text-n-500">
                          Or{" "}
                          <Link href="/candidates#submit-resume" className="link-underline text-ink">
                            use the short form
                          </Link>
                        </p>
                      </>
                    ) : (
                      <a
                        href={`mailto:${SITE.staffingEmail}`}
                        className="link-underline inline-flex items-center gap-2 text-[1.0625rem] text-ink"
                      >
                        <Mail className="size-4 text-orange" strokeWidth={1.75} aria-hidden="true" />
                        {SITE.staffingEmail}
                      </a>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </Container>
      </Section>

      {/* ── 3 · What happens next, with a picture ────────────── */}
      <Section background="paper">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:items-center lg:gap-16">
            <div className="lg:col-span-6">
              <Eyebrow>What happens next</Eyebrow>
              <h2 className="mt-7 max-w-[15ch]">A reply within a business day.</h2>
              <ol className="mt-10 border-t border-n-200">
                {NEXT.map((n, i) => (
                  <li key={n.title} className="grid gap-3 border-b border-n-200 py-6 sm:grid-cols-12 sm:gap-6">
                    <span className="font-mono text-[0.8125rem] tracking-[0.1em] text-n-400 sm:col-span-2">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="sm:col-span-10">
                      <p className="text-[1.25rem] font-semibold text-ink">{n.title}</p>
                      <p className="mt-2 max-w-[46ch] text-[1.0625rem] leading-relaxed text-n-500">
                        {n.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <div className="lg:col-span-6">
              <Photo slot="candidateConversation" sizes="(max-width: 1024px) 100vw, 48vw" className="rounded-lg" />
            </div>
          </div>
        </Container>
      </Section>

      {/* ── 4 · Where we are ─────────────────────────────────── */}
      <Section background="white" id="offices" className="scroll-mt-24">
        <Container>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Eyebrow>Where we are</Eyebrow>
              <h2 className="mt-7 max-w-[15ch]">Onshore, offshore, one standard.</h2>
            </div>
            <p className="max-w-[40ch] text-lg text-n-500 lg:col-span-5">
              Recruiting and delivery run from the United States and from India, so the work can
              sit wherever it makes sense for you.
            </p>
          </div>

          <div className="mt-16 grid gap-px overflow-hidden rounded-lg border border-n-200 bg-n-200 md:grid-cols-2 lg:mt-20">
            <div className="bg-white p-8 lg:p-10">
              <p className="text-[1.25rem] font-semibold text-ink">United States</p>
              <p className="mt-2 text-[1.0625rem] leading-relaxed text-n-500">
                Onshore recruiting, client delivery and every role that has to be in the room.
              </p>
              <a href={`mailto:${SITE.staffingEmail}`} className="link-underline mt-6 inline-flex text-[1.0625rem] text-ink">
                {SITE.staffingEmail}
              </a>
            </div>
            <div className="bg-white p-8 lg:p-10">
              <p className="text-[1.25rem] font-semibold text-ink">India</p>
              <p className="mt-2 text-[1.0625rem] leading-relaxed text-n-500">
                Offshore delivery for the work that travels well: design, analysis, support and
                back office.
              </p>
              <a href={`mailto:${SITE.staffingEmail}`} className="link-underline mt-6 inline-flex text-[1.0625rem] text-ink">
                {SITE.staffingEmail}
              </a>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── 5 · Close ────────────────────────────────────────── */}
      <Section background="ink" spacing="compact">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <h2 className="max-w-[18ch] text-white">
                Ready when <span className="text-amber">you are.</span>
              </h2>
              <p className="mt-6 max-w-[46ch] text-lg text-on-ink-muted">
                Tell us what you need and a person will be in touch within a business day.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-x-10 gap-y-5 lg:col-span-5 lg:justify-end">
              <HireTalentButton variant="onInk" />
              <Link href="/jobs" className="link-underline text-[1.0625rem]">
                Find a job
                <ArrowRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

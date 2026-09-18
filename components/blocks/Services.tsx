import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container, Eyebrow, Section } from "@/components/ui/Section";

/* Five ways to work with us, in plain language. An editorial list —
   each row is the link; the detail sits alongside on desktop. */
const SERVICES = [
  {
    name: "Temporary staffing",
    line: "People for a day, a week or a season.",
    detail: "Cover a rush, an absence or a project spike without adding headcount. We handle payroll, onboarding and compliance.",
    href: "/services/temporary-staffing",
  },
  {
    name: "Contract staffing",
    line: "Specialists for as long as the work lasts.",
    detail: "Skilled people on a defined contract, employed by us and working for you. Good for programmes, backfills and anything with an end date.",
    href: "/services/contract-staffing",
  },
  {
    name: "Contract-to-hire",
    line: "Work together first. Then decide.",
    detail: "Bring someone on for a set period, see how they fit, and hire them permanently when you're sure.",
    href: "/services/contract-to-hire",
  },
  {
    name: "Direct hire",
    line: "We find them. You hire them.",
    detail: "A permanent hire, sourced and shortlisted by people who know the role. You interview two or three, not twenty.",
    href: "/services/direct-hire",
  },
  {
    name: "Project & team staffing",
    line: "A whole team, ready to go.",
    detail: "Several people across roles, assembled around a piece of work, with a lead if you want one. Onshore, offshore, or both.",
    href: "/services/project-team-staffing",
  },
];

export function Services() {
  return (
    <Section background="paper2">
      <Container>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Eyebrow>How we help</Eyebrow>
            <h2 className="mt-7 max-w-[14ch]">Hire the way that suits the work.</h2>
          </div>
          <p className="max-w-[40ch] text-lg text-n-500 lg:col-span-5">
            One person or a whole team. A week or a permanent hire. We'll tell you
            honestly which of these fits.
          </p>
        </div>

        <ul className="mt-16 border-t border-n-300/60 lg:mt-20">
          {SERVICES.map((s) => (
            <li key={s.href} className="border-b border-n-300/60">
              <Link
                href={s.href}
                className="group grid items-start gap-y-3 py-9 transition-colors hover:bg-paper md:grid-cols-12 md:gap-8 md:px-6 md:py-10"
              >
                <div className="md:col-span-5">
                  <h3 className="text-[clamp(1.5rem,2.4vw,2rem)] text-ink transition-colors group-hover:text-accent">
                    {s.name}
                  </h3>
                  <p className="mt-2 text-lg text-n-600">{s.line}</p>
                </div>
                <p className="max-w-[44ch] text-[1.0625rem] leading-relaxed text-n-500 md:col-span-6">
                  {s.detail}
                </p>
                <ArrowUpRight
                  className="hidden size-6 justify-self-end text-n-400 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent md:col-span-1 md:block"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

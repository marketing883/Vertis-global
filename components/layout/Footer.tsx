import Link from "next/link";
import { Linkedin } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Container, Section } from "@/components/ui/Section";
import { FOOTER_COLUMNS, LEGAL_LINKS } from "@/config/navigation";
import { SITE } from "@/config/site";
import { hasPublished } from "@/lib/data/content";

/* Case studies, webinars and news get a footer link (under Company,
   after Whitepapers) once something of that kind is published. */
const OPTIONAL_LINKS = [
  { type: "case-study", label: "Case studies", href: "/case-studies" },
  { type: "webinar", label: "Webinars", href: "/webinars" },
  { type: "news", label: "News & press", href: "/news" },
] as const;

function footerColumns() {
  let extra: { label: string; href: string }[] = [];
  try {
    extra = OPTIONAL_LINKS.filter((l) => hasPublished(l.type)).map(({ label, href }) => ({ label, href }));
  } catch {
    /* no database: the footer as it always was */
  }
  if (!extra.length) return FOOTER_COLUMNS;
  return FOOTER_COLUMNS.map((col) => {
    const at = col.links.findIndex((l) => l.href === "/whitepapers");
    return at === -1 ? col : { ...col, links: [...col.links.slice(0, at + 1), ...extra, ...col.links.slice(at + 1)] };
  });
}

export function Footer() {
  const columns = footerColumns();
  return (
    <Section as="footer" background="ink" spacing="none" className="pt-24 lg:pt-32">
      <Container>
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <Logo variant="light" />
            <p className="font-display mt-8 max-w-[16ch] text-3xl leading-[1.1] font-bold tracking-[-0.03em] text-white">
              {SITE.tagline}
            </p>
            <a
              href={`mailto:${SITE.staffingEmail}`}
              className="link-underline mt-8 inline-flex text-[1.0625rem]"
            >
              {SITE.staffingEmail}
            </a>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-4 lg:col-span-8">
            {columns.map((col) => (
              <div key={col.heading}>
                <p className="text-[0.9375rem] font-medium text-white">{col.heading}</p>
                <ul className="mt-5 space-y-3">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-[0.9375rem] text-on-ink-muted transition-colors duration-200 hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-24 grid gap-8 border-t border-ink-line py-10 text-[0.9375rem] text-on-ink-quiet lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p>© {new Date().getFullYear()} Vertis Global</p>
            <div className="mt-4 flex gap-4">
              <a
                href="https://www.linkedin.com/company/vertis-global"
                aria-label="Vertis Global on LinkedIn"
                className="grid size-10 place-items-center rounded-md border border-ink-line transition-colors hover:border-mauve hover:text-white"
              >
                <Linkedin className="size-4" strokeWidth={1.5} />
              </a>
            </div>
          </div>

          <div className="lg:col-span-4">
            <p className="text-white">Offices</p>
            <address className="mt-3 not-italic">
              {SITE.usAddress.street}
              <br />
              {SITE.usAddress.city}, {SITE.usAddress.region} {SITE.usAddress.postalCode},{" "}
              {SITE.usAddress.country}
            </address>
            <p className="mt-3">India</p>
          </div>

          <ul className="flex flex-wrap gap-x-6 gap-y-2 lg:col-span-4 lg:justify-end">
            {LEGAL_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}

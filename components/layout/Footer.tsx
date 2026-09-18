import Link from "next/link";
import { Linkedin } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Container, Section } from "@/components/ui/Section";
import { FOOTER_COLUMNS, LEGAL_LINKS } from "@/config/navigation";
import { SITE } from "@/config/site";

export function Footer() {
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
            {FOOTER_COLUMNS.map((col) => (
              <div key={col.heading}>
                <p className="text-[0.9375rem] font-medium text-white">{col.heading}</p>
                <ul className="mt-5 space-y-3">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-[0.9375rem] text-n-400 transition-colors duration-200 hover:text-white"
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

        <div className="mt-24 grid gap-8 border-t border-ink-line py-10 text-[0.9375rem] text-n-500 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p>© {new Date().getFullYear()} Vertis Global</p>
            <div className="mt-4 flex gap-4">
              <a
                href="https://www.linkedin.com/company/vertis-global"
                aria-label="Vertis Global on LinkedIn"
                className="grid size-10 place-items-center rounded-md border border-ink-line transition-colors hover:border-n-500 hover:text-white"
              >
                <Linkedin className="size-4" strokeWidth={1.5} />
              </a>
            </div>
          </div>

          <div className="lg:col-span-4">
            <p className="text-white">Offices</p>
            <p className="mt-3">United States: [CONFIRM]</p>
            <p>India: [CONFIRM]</p>
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

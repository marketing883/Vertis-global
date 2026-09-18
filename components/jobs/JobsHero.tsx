import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container, Eyebrow, Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { INDUSTRY_COUNT } from "@/config/industries";

/* The /jobs hero: the homepage hero's shape, with a clip shot for the
   job seeker rather than the employer. A candidate walking into a
   bright lobby on a weekday morning, toward the camera, which is the
   feeling the page is selling: forward, and welcome.

   Same rules as the homepage clip. The subject is framed right with
   clear floor on the left so the headline has room; `cover` trims
   the sides on a tall window, so desktop stays centred and a phone
   pulls right onto her (see README, The hero). Muted, looped, and
   reduced-motion users get the poster. Encoded with
   `scripts/encode-hero-video.mjs <clip> --out public/jobs-video --name jobs-hero`. */

const VIDEO = {
  src: "/jobs-video/jobs-hero.mp4",
  mobile: "/jobs-video/jobs-hero-mobile.mp4",
  poster: "/jobs-video/jobs-hero-poster.jpg",
};

export function JobsHero() {
  return (
    <Section background="ink" spacing="none" className="relative overflow-hidden">
      <video
        className="absolute inset-0 h-full w-full object-cover object-[62%_40%] motion-reduce:hidden md:object-[50%_40%]"
        poster={VIDEO.poster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      >
        <source src={VIDEO.src} type="video/mp4" media="(min-width: 768px)" />
        <source src={VIDEO.mobile} type="video/mp4" />
      </video>
      <div
        aria-hidden="true"
        className="absolute inset-0 hidden bg-cover bg-[62%_40%] motion-reduce:block md:bg-[50%_40%]"
        style={{ backgroundImage: `url(${VIDEO.poster})` }}
      />
      <div aria-hidden="true" className="scrim-photo absolute inset-0" />

      <Container className="relative">
        <div className="grid lg:grid-cols-12">
          <div className="flex min-w-0 flex-col justify-center pt-32 pb-24 lg:col-span-7 lg:min-h-[620px] lg:pt-40 lg:pb-32">
            <Eyebrow>Jobs</Eyebrow>
            <h1 className="mt-8 max-w-[13ch] text-white">
              Find work that <span className="text-amber">moves you forward.</span>
            </h1>
            <p className="mt-8 max-w-[46ch] text-xl leading-relaxed text-on-ink-muted">
              Temporary, contract, contract-to-hire and permanent roles across {INDUSTRY_COUNT}{" "}
              industries, from the front line to the specialist. Free to you, and a real person
              reads what you send.
            </p>
            <div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-5">
              <Button href="#roles" variant="onInk">
                Browse roles
              </Button>
              <Link href="/candidates#submit-resume" className="link-underline text-[1.0625rem]">
                Send us your resume
                <ArrowRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </Container>

      <div aria-hidden="true" className="relative h-1 w-full" style={{ background: "var(--vg-gradient)" }} />
    </Section>
  );
}

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container, Eyebrow, Section } from "@/components/ui/Section";
import { Photo } from "@/components/media/Photo";
import { HireTalentButton } from "@/components/hire/HireTalentButton";
import selection from "@/config/hero-video.json";
import { cn } from "@/lib/utils";

/* The hero carries one message: people who keep businesses moving,
   and the engineers, IT and beyond, who make that true.

   Behind the text, a soft cinematic clip plays muted on a loop: a
   group walking toward camera who between them do every kind of work
   Vertis staffs, frontline through professional, so the picture makes
   the same claim the headline does. A purple gradient sits between the footage and
   the type so the headline always reads. Until a clip is chosen on
   /dev/hero-video the hero falls back to the photograph, so nothing
   is decided by default. Motion is the footage itself; the only
   animation is the text rising in once. Reduced-motion users get the
   poster frame. */

/* `src` is the desktop encode, `mobile` a lighter one for phones.
   Browsers that support `media` on <source> pick by viewport; the
   rest take the first source, which is the full-quality file. */
const video = selection.src
  ? {
      src: selection.src,
      mobile: (selection as { mobile?: string | null }).mobile ?? null,
      poster: selection.poster ?? undefined,
    }
  : null;

export function Hero() {
  return (
    <Section background="ink" spacing="none" className="relative overflow-hidden">
      {/* ── Backdrop ─────────────────────────────────────────── */}
      {/* Framing differs by breakpoint, because `cover` on a 16:9
          clip trims the sides and a phone trims far more of them.
          Desktop stays centred: the clip is framed with margin at
          both edges so a centred crop keeps the whole group, and
          anchoring left instead cut the last two people off on a
          tall window. A phone shows so narrow a slice that centring
          would land between people, so it pulls right onto them.
          The vertical bias keeps heads in frame rather than centring
          on torsos. */}
      {video ? (
        <video
          className="absolute inset-0 h-full w-full object-cover object-[62%_45%] motion-reduce:hidden md:object-[50%_42%]"
          poster={video.poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        >
          {video.mobile ? (
            <>
              <source src={video.src} type="video/mp4" media="(min-width: 768px)" />
              <source src={video.mobile} type="video/mp4" />
            </>
          ) : (
            <source src={video.src} type="video/mp4" />
          )}
        </video>
      ) : null}
      {video?.poster ? (
        // Reduced-motion fallback: the poster frame, no playback.
        <div
          aria-hidden="true"
          className="absolute inset-0 hidden bg-cover bg-[62%_45%] motion-reduce:block md:bg-[50%_42%]"
          style={{ backgroundImage: `url(${video.poster})` }}
        />
      ) : null}
      {!video ? (
        <div className="absolute inset-y-0 right-0 hidden w-[52%] lg:block xl:w-[50%]">
          <Photo
            slot="heroMain"
            fill
            priority
            sizes="(max-width: 1024px) 0px, 52vw"
            className="absolute inset-0 h-full w-full bg-ink"
          />
        </div>
      ) : null}

      {/* Readability: the shared `.scrim-photo` well under the text on
          the left, a short close on brand at the base, and the footage
          left clear where the people are. Without a video the photo
          only occupies the right half, so its own edge fade is enough. */}
      <div
        aria-hidden="true"
        className={cn("absolute inset-0", video && "scrim-photo")}
        style={
          video
            ? undefined
            : {
                background:
                  "linear-gradient(to right, #27196D 0%, rgba(39,25,109,0.92) 10%, rgba(39,25,109,0.45) 26%, rgba(39,25,109,0) 46%), linear-gradient(to top, #27196D 0%, rgba(39,25,109,0.4) 24%, rgba(39,25,109,0.06) 55%, rgba(39,25,109,0) 100%)",
              }
        }
      />

      {/* ── Content ──────────────────────────────────────────── */}
      <Container className="relative">
        <div className="grid lg:grid-cols-12">
          <div className="flex flex-col justify-center pt-32 pb-24 lg:col-span-7 lg:min-h-[calc(100svh-6rem)] lg:max-h-[880px] lg:pt-40 lg:pb-32 motion-safe:animate-[reveal_700ms_cubic-bezier(0.16,1,0.3,1)_both]">
            <Eyebrow>IT and engineering talent</Eyebrow>
            <h1 className="mt-8 max-w-[11ch] text-white">
              People who keep businesses <span className="text-amber">moving.</span>
            </h1>
            <p className="mt-8 max-w-[44ch] text-xl leading-relaxed text-on-ink-muted lg:text-[1.375rem]">
              Whether you need your next opportunity or your next hire, we get you
              there faster, with people who fit.
            </p>
            <div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-5">
              <HireTalentButton variant="onInk" />
              <Link href="/jobs" className="link-underline text-[1.0625rem]">
                Find a job
                <ArrowRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </Container>

      {/* Below lg without a video, the photograph follows the text. */}
      {!video ? (
        <div className="relative mx-6 lg:hidden md:mx-10">
          <Photo slot="heroMain" priority sizes="100vw" className="w-full" />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3"
            style={{ background: "linear-gradient(to top, #27196D 0%, rgba(39,25,109,0) 100%)" }}
          />
        </div>
      ) : null}

      <div aria-hidden="true" className="relative h-1 w-full" style={{ background: "var(--vg-gradient)" }} />
    </Section>
  );
}

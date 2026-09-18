import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HERO_VIDEO_OPTIONS } from "@/config/hero-video-options";
import selection from "@/config/hero-video.json";
import { Container, Eyebrow, Section } from "@/components/ui/Section";
import { HeroVideoPicker } from "./picker";

export const metadata: Metadata = {
  title: "Choose the hero video",
  robots: { index: false, follow: false },
};

/* A development-only page. Six real previews, one button each. */
export default function HeroVideoPickerPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <Section background="paper" spacing="compact">
      <Container>
        <Eyebrow>Development · Hero video</Eyebrow>
        <h1 className="mt-6 max-w-[16ch] text-[clamp(2rem,4vw,3rem)]">
          Choose the video for the hero.
        </h1>
        <p className="mt-5 max-w-[62ch] text-lg text-n-500">
          The first group was generated to our own brief and is final quality: 1080p,
          nothing to license. The stock group shows watermarked, low-resolution
          previews; the clean file is licensed after you choose. Choosing any option
          puts it into the hero straight away so you can judge it in place. The
          selected clip is then encoded to web weight (see README, The hero) before
          it ships.
        </p>
        <HeroVideoPicker options={HERO_VIDEO_OPTIONS} selected={selection.selected} />
      </Container>
    </Section>
  );
}

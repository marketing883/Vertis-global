"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { selectHeroVideo } from "@/app/actions/hero-video";
import { Button } from "@/components/ui/Button";
import type { HeroVideoOption } from "@/config/hero-video-options";
import { cn } from "@/lib/utils";

export function HeroVideoPicker({
  options,
  selected,
}: {
  options: HeroVideoOption[];
  selected: string | null;
}) {
  const [current, setCurrent] = useState<string | null>(selected);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, start] = useTransition();

  return (
    <div className="mt-12">
      {message && (
        <p role="status" className="mb-6 rounded-md bg-white px-4 py-3 text-[0.9375rem] text-ink">
          {message}
        </p>
      )}

      <ol className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {options.map((o, i) => {
          const isSelected = o.id === current;
          return (
            <li
              key={o.id}
              className={cn(
                "flex flex-col overflow-hidden rounded-lg bg-white",
                isSelected && "outline outline-2 outline-orange",
              )}
            >
              <div className="relative aspect-video bg-ink">
                <video
                  src={o.preview}
                  poster={o.poster}
                  muted
                  loop
                  playsInline
                  autoPlay
                  preload="metadata"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="font-mono text-[0.8125rem] tracking-[0.1em] text-n-400">
                  {String(i + 1).padStart(2, "0")} · {o.category}
                </p>
                <h2 className="mt-2 text-[1.25rem] leading-snug font-semibold text-ink">
                  {o.title}
                </h2>
                <p className="mt-2 text-[0.9375rem] text-n-500">{o.note}</p>
                <div className="mt-6 flex items-center justify-between gap-4">
                  <span className="text-[0.8125rem] text-n-400">
                    {o.kind === "generated"
                      ? "Generated to brief · final quality"
                      : `Stock preview · ${o.credits} credits to license`}
                  </span>
                  <Button
                    size="md"
                    variant={isSelected ? "secondary" : "primary"}
                    disabled={pending}
                    onClick={() =>
                      start(async () => {
                        const r = await selectHeroVideo(o.id);
                        if (r.ok) {
                          setCurrent(r.id);
                          setMessage(`Using "${o.title}". Open the homepage to see it in the hero.`);
                        } else setMessage(r.message);
                      })
                    }
                  >
                    {isSelected ? (
                      <>
                        <Check aria-hidden="true" /> Selected
                      </>
                    ) : (
                      "Use This Video"
                    )}
                  </Button>
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      <Link href="/" className="link-underline mt-12 text-[1.0625rem]">
        View the homepage
        <ArrowRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
      </Link>
    </div>
  );
}

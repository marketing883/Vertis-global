"use server";

import { promises as fs } from "node:fs";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { getHeroVideoOption } from "@/config/hero-video-options";

/* Records the chosen hero clip. Development only: this writes to the
   repository, which is exactly what a content decision should do
   here and exactly what a production server must never do. */

export type HeroVideoState = { ok: true; id: string } | { ok: false; message: string };

export async function selectHeroVideo(id: string): Promise<HeroVideoState> {
  if (process.env.NODE_ENV === "production") {
    return { ok: false, message: "Selection is only available in development." };
  }
  const option = getHeroVideoOption(id);
  if (!option) return { ok: false, message: "Unknown option." };

  const file = path.join(process.cwd(), "config", "hero-video.json");
  await fs.writeFile(
    file,
    JSON.stringify(
      { selected: option.id, src: option.preview, mobile: null, poster: option.poster },
      null,
      2,
    ) + "\n",
    "utf8",
  );
  revalidatePath("/");
  revalidatePath("/dev/hero-video");
  return { ok: true, id: option.id };
}

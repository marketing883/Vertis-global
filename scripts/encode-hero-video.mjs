/* Encodes a chosen hero clip to web weight.

   Usage:  node scripts/encode-hero-video.mjs public/hero-video/options/gen-all-trades-atrium.mp4
           node scripts/encode-hero-video.mjs <clip> --slow 1.4
           node scripts/encode-hero-video.mjs <clip> --out public/jobs-video --name jobs-hero

   Writes <out>/<name>.mp4 (1080p, ~2 MB for 5 s), <name>-mobile.mp4
   (540p, ~0.5 MB) and <name>-poster.jpg, all muted, faststart,
   H.264 so they play everywhere. Defaults are the homepage hero:
   public/hero-video/hero.*; then point config/hero-video.json at
   them. Uses the ffmpeg binary that ffmpeg-static installs; no
   system ffmpeg is needed.

   `--slow <factor>` stretches the clip: 1.4 makes a 5 s clip run
   7 s. It is done here rather than with `playbackRate` in the
   browser so the hero needs no JavaScript to look right, and it is
   a real retime (`setpts` plus frame interpolation to 30 fps), not
   a stutter. Generated clips tend to walk a little briskly for a
   background loop, so this is usually worth 1.3 to 1.5. */

import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const ffmpeg = createRequire(import.meta.url)("ffmpeg-static");
const argv = process.argv.slice(2);
const input = argv.find((a) => !a.startsWith("--"));
if (!input) {
  console.error("Pass the source clip, e.g. public/hero-video/options/gen-all-trades-atrium.mp4");
  process.exit(1);
}

const slowFlag = argv.indexOf("--slow");
const slow = slowFlag === -1 ? 1 : Number(argv[slowFlag + 1]);
if (!Number.isFinite(slow) || slow < 1 || slow > 4) {
  console.error("--slow takes a factor between 1 and 4, e.g. --slow 1.4");
  process.exit(1);
}

/* Retime first, then scale. Interpolating back up to 30 fps keeps
   the walk smooth instead of showing the same frame twice. */
const retime = slow === 1 ? "" : `setpts=${slow}*PTS,fps=30,`;

const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i === -1 ? fallback : argv[i + 1];
};
const out = flag("--out", path.join("public", "hero-video"));
const name = flag("--name", "hero");
mkdirSync(out, { recursive: true });

const common = ["-y", "-loglevel", "error", "-i", input, "-an", "-pix_fmt", "yuv420p", "-movflags", "+faststart"];

const jobs = [
  [...common, "-c:v", "libx264", "-preset", "slow", "-crf", "27", "-profile:v", "high", "-vf", `${retime}scale=1920:1080`, path.join(out, `${name}.mp4`)],
  [...common, "-c:v", "libx264", "-preset", "slow", "-crf", "28", "-profile:v", "main", "-vf", `${retime}scale=960:540`, path.join(out, `${name}-mobile.mp4`)],
  ["-y", "-loglevel", "error", "-i", input, "-vframes", "1", "-vf", "scale=1920:1080", "-q:v", "4", path.join(out, `${name}-poster.jpg`)],
];

for (const args of jobs) {
  execFileSync(ffmpeg, args, { stdio: "inherit" });
  console.log("wrote", args[args.length - 1]);
}
if (slow !== 1) console.log(`retimed to ${slow}x slower`);

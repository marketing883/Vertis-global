// Derive the three shipped hero assets from a video master.
//
//   npm run encode:hero -- path/to/hero.master.mp4
//
// Deliberately NOT part of `npm run build`. The outputs are committed, so a
// normal build needs neither this script nor a master file. Run it only when
// the hero footage changes, then commit what it writes.
//
// Masters are gitignored (*.master.mp4) — keep yours in shared storage. The
// three outputs below are what src/index.njk actually references.

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import ffmpeg from "@ffmpeg-installer/ffmpeg";

const run = promisify(execFile);
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(projectRoot, "src", "public", "video");

const source = process.argv[2];
if (!source) {
  console.error("usage: npm run encode:hero -- <path-to-master>");
  process.exit(1);
}
try {
  await fs.access(source);
} catch {
  console.error(`no such file: ${source}`);
  process.exit(1);
}

// The hero sits behind an overlay at 0.55 opacity with mix-blend-mode:luminosity
// (see .hero-video__media in main.css), so it is never viewed at full fidelity.
// 1600px wide and a soft bitrate ceiling is plenty and keeps first paint cheap.
const SCALE = "scale=1600:-2";
const POSTER_AT = "00:00:01.5";

const jobs = [
  {
    label: "mp4 (H.264)",
    out: "hero-bg.mp4",
    args: (input, output) => [
      "-y", "-i", input,
      "-an",
      "-vf", SCALE,
      "-c:v", "libx264",
      "-profile:v", "high",
      "-pix_fmt", "yuv420p",      // required for Safari/iOS playback
      "-crf", "28",
      "-preset", "slow",
      "-movflags", "+faststart",  // moov atom first, so it streams
      output,
    ],
  },
  {
    label: "webm (VP9)",
    out: "hero-bg.webm",
    args: (input, output) => [
      "-y", "-i", input,
      "-an",
      "-vf", SCALE,
      "-c:v", "libvpx-vp9",
      "-crf", "36",
      "-b:v", "0",
      "-row-mt", "1",
      output,
    ],
  },
  {
    label: "poster (JPEG)",
    out: "hero-bg-poster.jpg",
    args: (input, output) => [
      "-y", "-ss", POSTER_AT, "-i", input,
      "-frames:v", "1",
      "-vf", SCALE,
      "-q:v", "6",
      output,
    ],
  },
];

await fs.mkdir(outDir, { recursive: true });

for (const job of jobs) {
  const output = path.join(outDir, job.out);
  process.stdout.write(`[hero] ${job.label} → ${job.out} … `);
  try {
    await run(ffmpeg.path, job.args(source, output));
    const { size } = await fs.stat(output);
    console.log(`${(size / 1024 / 1024).toFixed(2)} MB`);
  } catch (err) {
    console.log("failed");
    console.error(err.stderr || err.message);
    process.exit(1);
  }
}

console.log("\n[hero] done. Commit the three files in src/public/video/.");

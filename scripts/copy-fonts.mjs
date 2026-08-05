// Copy the WOFF2 files we actually ship from @fontsource-variable packages
// into src/fonts/ so Eleventy passthrough can serve them from /assets/fonts/.
// Keep this tight — we don't want every weight/subset, only what we reference
// in @font-face declarations in main.css.

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const nodeModules = path.join(projectRoot, "node_modules");
const destDir = path.join(projectRoot, "src", "fonts");

// Variable fonts only — one file per family, both optical-size and weight axes.
// Fontsource variable packages put files under files/<family>-<subset>-<axes>-<style>.woff2
const families = [
  {
    family: "fraunces",
    pkg: "@fontsource-variable/fraunces",
    files: [
      "fraunces-latin-wght-normal.woff2",
      "fraunces-latin-wght-italic.woff2",
    ],
  },
  {
    family: "inter",
    pkg: "@fontsource-variable/inter",
    files: [
      "inter-latin-wght-normal.woff2",
    ],
  },
  {
    family: "jetbrains-mono",
    pkg: "@fontsource-variable/jetbrains-mono",
    files: [
      "jetbrains-mono-latin-wght-normal.woff2",
    ],
  },
];

await fs.mkdir(destDir, { recursive: true });

for (const { family, pkg, files } of families) {
  const srcDir = path.join(nodeModules, pkg, "files");
  for (const file of files) {
    const srcFile = path.join(srcDir, file);
    const destFile = path.join(destDir, file);
    try {
      await fs.copyFile(srcFile, destFile);
      console.log(`[fonts] ${family} → ${file}`);
    } catch (err) {
      console.warn(`[fonts] missing: ${srcFile} (skipping)`);
    }
  }
}

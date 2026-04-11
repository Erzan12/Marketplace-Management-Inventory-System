// Link hoisted workspace `next` into apps/frontend so Netlify's Next runtime can require it.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import os from "node:os";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(root, "node_modules", "next");
const destDir = path.join(root, "apps", "frontend", "node_modules");
const dest = path.join(destDir, "next");

if (!fs.existsSync(src)) {
  process.exit(0);
}

if (fs.existsSync(dest)) {
  process.exit(0);
}

fs.mkdirSync(destDir, { recursive: true });

if (os.platform() === "win32") {
  fs.symlinkSync(src, dest, "junction");
} else {
  const rel = path.relative(destDir, src);
  fs.symlinkSync(rel, dest, "dir");
}

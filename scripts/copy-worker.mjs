import fs from "fs";
import path from "path";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

try {
  // Resolve pdfjs-dist path
  const pdfDistPath = path.dirname(require.resolve("pdfjs-dist/package.json"));
  const workerSrc = path.join(pdfDistPath, "build", "pdf.worker.min.mjs");
  const workerDest = path.join(process.cwd(), "public", "pdf.worker.min.mjs");

  // Ensure public dir exists
  const publicDir = path.join(process.cwd(), "public");
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Copy file
  fs.copyFileSync(workerSrc, workerDest);
} catch (error) {
  console.error("Error copying worker:", error);
  process.exit(1);
}

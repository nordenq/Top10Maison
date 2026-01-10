import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const distPath = join(process.cwd(), "dist");

function readAllHtml(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  let contents = "";
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      contents += readAllHtml(fullPath);
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      contents += readFileSync(fullPath, "utf8");
    }
  }
  return contents;
}

try {
  statSync(distPath);
} catch (err) {
  console.error("Expected dist/ folder. Run 'npm run build' before this check.");
  process.exit(1);
}

const html = readAllHtml(distPath);
const bad = ["fonts.googleapis.com", "fonts.gstatic.com"].filter((host) => html.includes(host));
if (bad.length) {
  console.error("Build failed: Google Fonts references found in dist HTML:");
  for (const host of bad) {
    console.error(`- ${host}`);
  }
  process.exit(1);
}

console.log("OK: No Google Fonts references found in dist HTML.");

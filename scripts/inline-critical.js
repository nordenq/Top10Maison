import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import Critters from "critters";

const distPath = join(process.cwd(), "dist");

function listHtml(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...listHtml(fullPath));
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      files.push(fullPath);
    }
  }
  return files;
}

try {
  statSync(distPath);
} catch (err) {
  console.error("Expected dist/ folder. Run 'npm run build' before this step.");
  process.exit(1);
}

const critters = new Critters({
  path: distPath,
  preload: "swap",
  pruneSource: true,
  compress: true
});

const htmlFiles = listHtml(distPath);
for (const filePath of htmlFiles) {
  const html = readFileSync(filePath, "utf8");
  const output = await critters.process(html);
  writeFileSync(filePath, output);
}

console.log(`Inlined critical CSS for ${htmlFiles.length} HTML files.`);

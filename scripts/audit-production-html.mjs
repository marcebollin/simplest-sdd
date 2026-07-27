import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const distDirectory = fileURLToPath(new URL("../dist/", import.meta.url));

const findHtmlFiles = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...await findHtmlFiles(entryPath));
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      files.push(entryPath);
    }
  }

  return files;
};

const htmlFiles = await findHtmlFiles(distDirectory);
const violations = [];

for (const htmlFile of htmlFiles) {
  const html = await readFile(htmlFile, "utf8");
  const displayPath = relative(distDirectory, htmlFile);

  if (/\sstyle\s*=/i.test(html)) {
    violations.push(`${displayPath}: inline style attribute`);
  }

  if (/<script\b(?![^>]*\bsrc\s*=)[^>]*>/i.test(html)) {
    violations.push(`${displayPath}: inline script`);
  }
}

if (violations.length) {
  console.error("Production HTML violates the deployed Content Security Policy:");
  violations.forEach((violation) => console.error(`- ${violation}`));
  process.exitCode = 1;
} else {
  console.log(`Audited ${htmlFiles.length} production HTML files for CSP parity.`);
}

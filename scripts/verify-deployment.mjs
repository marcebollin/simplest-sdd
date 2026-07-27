import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const distDirectory = fileURLToPath(new URL("../dist/", import.meta.url));
const deploymentUrl = new URL(
  process.env.DEPLOYMENT_URL ?? "https://sd2.marcebollin.com"
);
const verificationToken = Date.now().toString(36);
const retryCount = 6;
const retryDelayMs = 2_000;

const pages = [
  { path: "/", file: "index.html", status: 200 },
  { path: "/about/", file: "about/index.html", status: 200 },
  { path: "/how/", file: "how/index.html", status: 200 },
  {
    path: `/deployment-verification-${verificationToken}`,
    file: "404.html",
    status: 404
  }
];

const assetExtensions = new Set([
  ".css",
  ".js",
  ".woff2",
  ".png",
  ".svg",
  ".ico",
  ".webmanifest"
]);

const digest = (value) => createHash("sha256").update(value).digest("hex");
const wait = (duration) => new Promise((resolve) => setTimeout(resolve, duration));

const fetchBytes = async (pathname) => {
  const url = new URL(pathname, deploymentUrl);
  url.searchParams.set("deployment-verification", verificationToken);

  const response = await fetch(url, {
    headers: {
      "cache-control": "no-cache",
      pragma: "no-cache"
    }
  });

  return {
    bytes: Buffer.from(await response.arrayBuffer()),
    response,
    url
  };
};

const assetPathsFromHtml = (html) => {
  const paths = new Set();
  const attributePattern = /\b(?:href|src)="([^"]+)"/g;

  for (const [, reference] of html.matchAll(attributePattern)) {
    const url = new URL(reference, deploymentUrl);

    if (
      url.origin === deploymentUrl.origin &&
      assetExtensions.has(extname(url.pathname))
    ) {
      paths.add(url.pathname);
    }
  }

  return paths;
};

const verify = async () => {
  const assets = new Set();

  for (const page of pages) {
    const localBytes = await readFile(join(distDirectory, page.file));
    const { bytes: liveBytes, response, url } = await fetchBytes(page.path);

    if (response.status !== page.status) {
      throw new Error(
        `${url.pathname} returned ${response.status}; expected ${page.status}`
      );
    }

    if (digest(liveBytes) !== digest(localBytes)) {
      throw new Error(
        `${url.pathname} does not match the freshly built ${page.file}`
      );
    }

    for (const asset of assetPathsFromHtml(localBytes.toString("utf8"))) {
      assets.add(asset);
    }
  }

  for (const pathname of assets) {
    const localBytes = await readFile(join(distDirectory, pathname));
    const { bytes: liveBytes, response } = await fetchBytes(pathname);

    if (!response.ok) {
      throw new Error(`${pathname} returned ${response.status}`);
    }

    if (digest(liveBytes) !== digest(localBytes)) {
      throw new Error(`${pathname} differs from the freshly built asset`);
    }
  }

  return assets.size;
};

let lastError;

for (let attempt = 1; attempt <= retryCount; attempt += 1) {
  try {
    const assetCount = await verify();
    console.log(
      `Verified ${pages.length} live pages and ${assetCount} deployed assets against dist.`
    );
    process.exit(0);
  } catch (error) {
    lastError = error;

    if (attempt < retryCount) {
      console.warn(
        `Deployment parity check ${attempt}/${retryCount} failed: ${error.message}`
      );
      await wait(retryDelayMs);
    }
  }
}

console.error(
  `Deployment parity verification failed after ${retryCount} attempts: ${lastError.message}`
);
process.exit(1);

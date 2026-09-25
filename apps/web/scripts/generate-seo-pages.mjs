import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const appDirectory = path.resolve(scriptDirectory, "..");
const distDirectory = path.join(appDirectory, "dist");
const template = await readFile(path.join(distDirectory, "index.html"), "utf8");

const pages = {
  about: {
    title: "About Growile - Building a Free Digital Tool Ecosystem",
    description: "Discover the vision behind Growile. We are dedicated to simplifying your daily tasks by building a completely free ecosystem of essential digital tools.",
  },
  products: {
    title: "All Products - Growile Suite",
    description: "Explore Growile's complete suite of free utilities and tools.",
  },
  "terms-of-service": {
    title: "Terms of Service | Growile",
    description: "Read the Terms of Service governing your use of the Growile website and tools.",
  },
  "privacy-policy": {
    title: "Privacy Policy for Growile",
    description: "Read the Growile Privacy Policy to understand how we collect, protect, and use your information across our tools.",
  },
};

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

for (const [route, metadata] of Object.entries(pages)) {
  const canonical = `https://growile.com/${route}`;
  const html = template
    .replace(/<title>.*?<\/title>/i, `<title>${escapeHtml(metadata.title)}</title>`)
    .replace(
      /<meta name="description" content=".*?"\s*\/?>/i,
      `<meta name="description" content="${escapeHtml(metadata.description)}" />`,
    )
    .replace(
      /<meta name="robots" content=".*?"\s*\/?>/i,
      '<meta name="robots" content="index, follow" />',
    )
    .replace(
      /<\/head>/i,
      `  <link rel="canonical" href="${canonical}" />\n  <meta property="og:title" content="${escapeHtml(metadata.title)}" />\n  <meta property="og:description" content="${escapeHtml(metadata.description)}" />\n  <meta property="og:url" content="${canonical}" />\n  </head>`,
    );

  const outputDirectory = path.join(distDirectory, "seo", route);
  await mkdir(outputDirectory, { recursive: true });
  await writeFile(path.join(outputDirectory, "index.html"), html);
}

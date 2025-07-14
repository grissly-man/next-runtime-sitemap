import path from "node:path";
import { readdir } from "fs/promises";
import { introspectFile } from "./introspect-file";
import { SiteMapURL } from "next-dynamic-sitemap/dist/types";
import { generateURL } from "next-dynamic-sitemap/dist/util";

const JSON_RE = /(?:\.js\.nft)?\.json$/;
const FILE_SUFFIX_RE = /(?:(?:^|\/)?index)?(?:\.js\.nft)?\.json$/;

export async function introspectPages(cwd: string) {
  const pagesDir = path.join(cwd, "pages");
  const files = await readdir(pagesDir, { recursive: true });
  const allFiles = new Set(files);
  const filteredFiles = files
    .filter((f) => JSON_RE.test(f)) // include everything with a manifest
    .filter((f) => !f.includes("[")) // exclude dynamic paths
    .filter((f) => allFiles.has(f.replace(JSON_RE, ".html"))); // ensure we're only including webpages
  const filesParsed = await Promise.all(
    filteredFiles.map((f) => introspectFile(pagesDir, f, FILE_SUFFIX_RE)),
  );
  return filesParsed.map((f) => {
    const url: SiteMapURL = {
      changefreq: "hourly",
      lastmod: f.stats && new Date(f.stats.mtime).toISOString(),
      loc: generateURL(f.path),
      priority: (f.path && 0.8) || 1,
    };
    return url;
  });
}

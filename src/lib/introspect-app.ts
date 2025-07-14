import path from "node:path";
import { readdir, readFile, stat } from "fs/promises";
import { SiteMapURL } from "next-dynamic-sitemap/dist/types";
import { generateURL } from "next-dynamic-sitemap/dist/util";

const META_RE = /\.meta$/;
const NEXT_RESERVED_RE = /^_/;

const FILE_SUFFIX_RE = /(?:(?:^|\/)?index)?\.meta$/;

async function introspectPage(dir: string, page: string) {
  const fullPath = path.join(dir, page);
  try {
    const [pageContent, stats] = await Promise.all([
      readFile(fullPath, "utf8"),
      stat(fullPath),
    ]);
    const pageParsed = JSON.parse(pageContent);
    return {
      path: page.replace(FILE_SUFFIX_RE, ""),
      status: pageParsed.status,
      stats,
    };
  } catch (err) {
    return {
      path: (err as Error).message,
      status: 500,
    };
  }
}

export async function introspectApp(cwd: string): Promise<SiteMapURL[]> {
  const appDir = path.join(cwd, "app");
  const files = await readdir(appDir, { recursive: true });
  const allPages = new Set(files);
  const metaFiles = files
    .filter((f) => META_RE.test(f))
    .filter((f) => !NEXT_RESERVED_RE.test(f))
    .filter((f) => allPages.has(f.replace(META_RE, ".html")));
  const filesParsed = await Promise.all(
    metaFiles.map((file) => {
      return introspectPage(appDir, file);
    }),
  );
  const validFiles = filesParsed.filter(
    (file) =>
      !file.status ||
      (typeof file.status === "number" &&
        file.status >= 200 &&
        file.status < 400),
  );
  return validFiles.map((f) => {
    const url: SiteMapURL = {
      changefreq: "hourly",
      lastmod: f.stats && new Date(f.stats.mtime).toISOString(),
      loc: generateURL(f.path),
      priority: (f.path && 0.8) || 1,
    };
    return url;
  });
}

import path from "node:path";
import {readdir} from "fs/promises";
import {ChangeFreq, SiteMapURL} from "next-dynamic-sitemap/dist/types";
import {generateURL} from "next-dynamic-sitemap/dist/util";
import {introspectFile} from "./introspect-file";

const META_RE = /\.meta$/;
const NEXT_RESERVED_RE = /^_/;

const FILE_SUFFIX_RE = /(?:(?:^|\/)?index)?\.meta$/;

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
      return introspectFile(appDir, file, FILE_SUFFIX_RE);
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
      changefreq: ChangeFreq.HOURLY,
      lastmod: f.stats && new Date(f.stats.mtime).toISOString(),
      loc: generateURL(f.path),
      priority: (f.path && 0.8) || 1,
    };
    return url;
  });
}

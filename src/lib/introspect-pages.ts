import path from "node:path";
import { readdir } from "fs/promises";
import { introspectFile } from "./introspect-file";
import { SiteMapURL } from "next-dynamic-sitemap/dist/types";
import { generateURL } from "next-dynamic-sitemap/dist/util";
import type { FileIntrospectionProps } from "./introspect-files";

const JSON_RE = /(?:\.js\.nft)?\.json$/;
const FILE_SUFFIX_RE = /(?:(?:^|\/)?index)?(?:\.js\.nft)?\.json$/;

type ParsedFileMetadata = Awaited<ReturnType<typeof introspectFile>>;

function deLocalizeFiles(
  files: ParsedFileMetadata[],
  locale: string,
): ParsedFileMetadata[] {
  const delocalizedFiles: ParsedFileMetadata[] = [];
  const localizedRegex = new RegExp(`^${locale}/`);

  for (let file of files) {
    if (localizedRegex.test(file.path)) {
      delocalizedFiles.push({
        ...file,
        path: file.path.replace(localizedRegex, ""),
      });
    } else if (!file.path) {
      delocalizedFiles.push({
        ...file,
        path: `${locale}/`,
      });
    }
  }

  return delocalizedFiles;
}

export async function introspectPages(
  cwd: string,
  props?: FileIntrospectionProps,
) {
  const pagesDir = path.join(cwd, "pages");
  const files = await readdir(pagesDir, { recursive: true });
  const allFiles = new Set(files);

  if (props?.defaultLocale && allFiles.has(`${props.defaultLocale}.html`)) {
    allFiles.add("index.html");
  }

  const filteredFiles = files
    .filter((f) => JSON_RE.test(f)) // include everything with a manifest
    .filter((f) => !f.includes("[")) // exclude dynamic paths
    .filter((f) => allFiles.has(f.replace(JSON_RE, ".html"))); // ensure we're only including webpages

  const filesParsed: ParsedFileMetadata[] = await Promise.all(
    filteredFiles.map((f) => introspectFile(pagesDir, f, FILE_SUFFIX_RE)),
  );

  if (props?.defaultLocale) {
    filesParsed.push(...deLocalizeFiles(filesParsed, props.defaultLocale));
  }

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

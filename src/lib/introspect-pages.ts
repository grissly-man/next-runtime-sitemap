import path from "node:path";
import { readdir } from "fs/promises";
import { introspectFile } from "./introspect-file";
import { ChangeFreq, SiteMapURL } from "next-dynamic-sitemap/dist/types";
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

  const filesStatusFiltered = filesParsed.filter(f => {
    const value = typeof f.status === "number" && f.status >= 200 && f.status < 400;
    if (!value) {
      console.error("not indexing file due to invalid status code", f)
    }
    return value;
  });

  if (props?.defaultLocale) {
    filesStatusFiltered.push(...deLocalizeFiles(filesStatusFiltered, props.defaultLocale));
  }

  return filesStatusFiltered.map((f) => {
    const url: SiteMapURL = {
      changefreq: ChangeFreq.HOURLY,
      lastmod: f.stats && new Date(f.stats.mtime).toISOString(),
      loc: generateURL(f.path),
      priority: (f.path && 0.8) || 1,
    };
    return url;
  });
}

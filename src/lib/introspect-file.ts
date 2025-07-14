import path from "node:path";
import { readFile, stat } from "fs/promises";

export async function introspectFile(
  dir: string,
  page: string,
  fileSuffixRE: RegExp,
) {
  const fullPath = path.join(dir, page);
  try {
    const [pageContent, stats] = await Promise.all([
      readFile(fullPath, "utf8"),
      stat(fullPath),
    ]);
    const pageParsed = JSON.parse(pageContent);
    return {
      path: page.replace(fileSuffixRE, ""),
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

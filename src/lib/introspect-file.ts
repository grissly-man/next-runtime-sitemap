import path from "node:path";
import { readFile, stat } from "fs/promises";

async function getPageStatus(path: string) {
  const result = await fetch(
    `http://${process.env.HOSTNAME || "localhost"}:${process.env.PORT || 3000}/${path}`,
    {
      method: "HEAD",
    },
  );

  return result.status;
}

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
    const pathname = page.replace(fileSuffixRE, "");
    const status = pageParsed.status || (await getPageStatus(pathname));
    return {
      path: pathname,
      status,
      stats,
    };
  } catch (err) {
    return {
      path: (err as Error).message,
      status: 500,
    };
  }
}

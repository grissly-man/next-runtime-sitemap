import path from "node:path";
import { introspectApp } from "./introspect-app";
import { generateXMLSitemap } from "next-dynamic-sitemap/dist/util";
import { introspectPages } from "./introspect-pages";

export type FileIntrospectionProps = {
  defaultLocale: string;
};

export async function introspectFiles(props?: FileIntrospectionProps) {
  const serverDir = path.join(process.cwd(), ".next", "server");
  const [appFiles, pagesFiles] = await Promise.all([
    introspectApp(serverDir).catch(() => []),
    introspectPages(serverDir, props).catch(() => []),
  ]);

  const all = [...appFiles, ...pagesFiles].sort((f1, f2) => {
    if (f1.priority && f2.priority && f1.priority > f2.priority) return -1;
    if (f1.priority && f2.priority && f1.priority < f2.priority) return 1;
    if (f1.priority && !f2.priority) return -1;
    if (!f1.priority && f2.priority) return 1;

    return f1.loc.localeCompare(f2.loc);
  });

  return generateXMLSitemap(all);
}

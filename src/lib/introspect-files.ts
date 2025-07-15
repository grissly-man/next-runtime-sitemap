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

  return generateXMLSitemap([...appFiles, ...pagesFiles]);
}

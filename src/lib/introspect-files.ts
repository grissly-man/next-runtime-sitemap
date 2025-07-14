import path from "node:path";
import { introspectApp } from "./introspect-app";
import { generateXMLSitemap } from "next-dynamic-sitemap/dist/util";

export async function introspectFiles() {
  const serverDir = path.join(process.cwd(), ".next", "server");
  const appFiles = await introspectApp(serverDir);

  return generateXMLSitemap(appFiles);
}

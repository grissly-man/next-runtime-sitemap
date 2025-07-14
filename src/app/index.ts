import { NextRequest, NextResponse } from "next/server";
import { introspectFiles } from "../lib/introspect-files";
import { notFound } from "next/navigation";

export function generateAppRouterSitemap() {
  return {
    async GET(
      request: NextRequest,
      props: Promise<any>,
    ): Promise<NextResponse> {
      const { params } = await props;
      if (params.sitemap !== "sitemap.xml") {
        console.error(params);
        return notFound();
      }

      const files = await introspectFiles();

      return new NextResponse(files, {
        headers: {
          "Content-Type": "application/xml",
        },
      });
    },
    dynamic: "force-static",
    revalidate: 100,
  };
}

import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{
    slug1: string;
    slug2: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { slug1, slug2 } = await params;
  if (slug1 === "notfound" && slug2 === "notfound") {
    return notFound();
  }
  return <></>;
}

export const dynamic = "force-static";
export const revalidate = 300;

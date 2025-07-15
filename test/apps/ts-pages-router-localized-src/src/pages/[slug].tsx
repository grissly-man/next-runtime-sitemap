export async function getStaticPaths() {
  return Promise.resolve({
    paths: [
      {
        params: {
          slug: "such-a-slug",
        },
      },
    ],
    fallback: true,
  });
}

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function getStaticProps({ params }: Props) {
  const { slug } = await params;

  if (slug === "dont-find-me") {
    return { notFound: true };
  }

  return Promise.resolve({
    props: {},
  });
}

export default function Slug() {
  return <></>;
}

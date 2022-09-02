import { AnimeQuery } from "../../utils/AnimeQuery";
import Image from "next/future/image";
import { GetStaticPropsContext, InferGetStaticPropsType } from "next";

async function getAnime(slug: string) {
  const URL = `https://kitsu.io/api/edge/anime?filter[slug]=${slug}`;
  const { data } = await fetch(URL).then((res) => res.json());
  return data[0] as AnimeQuery | undefined;
}
export function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

export async function getStaticProps(ctx: GetStaticPropsContext) {
  const slug = ctx.params!.slug as string;
  const anime = await getAnime(slug);
  if (!anime) {
    return {
      notFound: true,
    } as const;
  }
  return {
    props: { anime },
  };
}
export default function index({
  anime,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <section className="container mx-auto mb-8">
      <div className="flex flex-col gap-4">
        <Image
          className="aspect-[16/4]"
          src={anime.attributes.coverImage.large}
          width={1536}
          height={384}
        />
        <div className="flex gap-2">
          <div className="flex flex-col">
            <Image
              className="aspect-[3/4]"
              src={anime.attributes.posterImage.small}
              width={600}
              height={250}
            />
            <div className="text-xl">{anime.attributes.canonicalTitle}</div>
          </div>
          <div className="text-md">{anime.attributes.description}</div>
        </div>
      </div>
    </section>
  );
}

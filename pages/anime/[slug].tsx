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
          className="aspect-[16/3]"
          src={anime.attributes.coverImage.large}
          width={1536}
          height={288}
          priority
        />
        <div className="flex gap-4">
          <div className="flex shrink-0 flex-col gap-4">
            <Image
              className="aspect-[3/4]"
              src={anime.attributes.posterImage.small}
              width={284}
              height={380}
              priority
            />
            <div className="text-2xl">{anime.attributes.canonicalTitle}</div>
            <div className="rounded-sm bg-slate-50 p-2 shadow-md">
              <div className="text-xl">Anime Details</div>
              <div className="flex flex-col gap-2 text-base">
                <div className="flex justify-between">
                  <div className="">English</div>
                  <div>{anime.attributes.titles.en}</div>
                </div>
                <div className="flex justify-between">
                  <div className="">Japanese</div>
                  <div>{anime.attributes.titles.en_jp}</div>
                </div>
                <div className="flex justify-between">
                  <div className="">Japranese (Romaji)</div>
                  <div>{anime.attributes.titles.ja_jp}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="text-base">{anime.attributes.description}</div>
        </div>
      </div>
    </section>
  );
}

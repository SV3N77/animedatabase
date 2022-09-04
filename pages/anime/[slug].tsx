import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import Image from "next/future/image";
import { AnimeQuery } from "../../utils/AnimeQuery";

async function getAnime(slug: string) {
  const URL = `https://kitsu.io/api/edge/anime?filter[slug]=${slug}&include=genres`;
  const { data, included } = await fetch(URL).then((res) => res.json());
  let results = data[0] as AnimeQuery;
  results.genresArray = included;
  return results as AnimeQuery;
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
          className="aspect-[18/3]"
          src={anime.attributes.coverImage.large}
          width={1536}
          height={256}
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
            <div className="rounded-sm bg-slate-50 p-2 shadow-md">
              <div className="mb-4 text-2xl">
                {anime.attributes.canonicalTitle}
              </div>
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
                <div className="flex justify-between">
                  <div className="">Type</div>
                  <div>{anime.attributes.subtype}</div>
                </div>
                <div className="flex justify-between">
                  <div className="">Episodes</div>
                  <div>{anime.attributes.episodeCount}</div>
                </div>
                <div className="flex justify-between">
                  <div className="">Status</div>
                  <div>{anime.attributes.status}</div>
                </div>
                <div className="flex justify-between">
                  <div className="">Aired</div>
                  <div>
                    {anime.attributes.startDate} to
                    {anime.attributes.endDate}
                  </div>
                </div>
                {anime.attributes.ageRatingGuide ? (
                  <div className="flex justify-between">
                    <div className="">Rating</div>
                    <div>{anime.attributes.ageRatingGuide}</div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-base">{anime.attributes.description}</div>
            <div className="flex gap-4">
              {anime.genresArray.map((genre) => (
                <div key={genre.id} className="p-1">
                  {genre.attributes.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

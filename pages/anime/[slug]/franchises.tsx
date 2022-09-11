import { GetStaticPropsContext } from "next";
import Link from "next/link";
import { AnimeQuery } from "../../../utils/AnimeQuery";

type FranchiseProps = { anime: AnimeQuery; franchises: AnimeQuery[] };

async function getAnime(slug: string) {
  const URL = `https://kitsu.io/api/edge/anime?filter[slug]=${slug}`;
  const { data } = await fetch(URL).then((res) => res.json());
  return data[0] as AnimeQuery;
}

async function getAllFranchises(id: string) {
  const URL = `https://kitsu.io/api/edge/media-relationships?filter[source_id]=${id}&filter[source_type]=Anime&include=destination&page[limit]=20&sort=role`;
  const { included } = await fetch(URL).then((res) => res.json());
  return included as AnimeQuery[];
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
  const franchises = await getAllFranchises(anime.id);
  if (!franchises) {
    return {
      notFound: true,
    } as const;
  }
  return {
    props: { anime, franchises },
  };
}
export default function franchises({ anime, franchises }: FranchiseProps) {
  return (
    <section className="container mx-auto py-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl">
          {anime.attributes.canonicalTitle} Franchise
        </h1>
        <div className="flex flex-wrap gap-6">
          {franchises.map((franchise) => (
            <div key={franchise.id} className="w-56">
              <Link
                href={
                  franchise.type === "anime"
                    ? {
                        pathname: "/anime/[slug]",
                        query: { slug: franchise.attributes.slug },
                      }
                    : {
                        pathname: "/manga/[slug]",
                        query: { slug: franchise.attributes.slug },
                      }
                }
              >
                <a>
                  <img
                    className="aspect-[3/4] w-full"
                    src={franchise.attributes.posterImage.original}
                  />
                  <div className="">{franchise.attributes.canonicalTitle}</div>
                </a>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

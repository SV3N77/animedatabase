import { GetStaticPropsContext } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { MoreFranchises } from "../../../utils/MangaQuery";
import { MangaQuery } from "../../../utils/MangaQuery";

type FranchiseProps = { manga: MangaQuery; franchises: MangaQuery[] };

async function getManga(slug: string) {
  const URL = `https://kitsu.io/api/edge/manga?filter[slug]=${slug}`;
  const { data } = await fetch(URL).then((res) => res.json());
  return data[0] as MangaQuery;
}

async function getAllFranchises(id: string) {
  const URL = `https://kitsu.io/api/edge/media-relationships?filter[source_id]=${id}&filter[source_type]=Manga&include=destination&page[limit]=20&sort=role`;
  const { included } = await fetch(URL).then((res) => res.json());
  return included as MangaQuery[];
}

async function getMoreFranchises(id: string, page: number) {
  const URL = `https://kitsu.io/api/edge/media-relationships?filter[source_id]=${id}&filter[source_type]=Manga&include=destination&page[limit]=20&page[offset]=${page}&sort=role`;
  const { included, links } = await fetch(URL).then((res) => res.json());
  let results = { franchises: included, links: links } as MoreFranchises;
  return results;
}

export function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

export async function getStaticProps(ctx: GetStaticPropsContext) {
  const slug = ctx.params!.slug as string;
  const manga = await getManga(slug);
  const franchises = await getAllFranchises(manga.id);
  if (!franchises) {
    return {
      notFound: true,
    } as const;
  }
  return {
    props: { manga, franchises },
  };
}
export default function Franchises({ manga, franchises }: FranchiseProps) {
  const [relatedFranchises, setRelatedFranchises] =
    useState<MangaQuery[]>(franchises);
  const [nextPage, setNextPage] = useState(true);
  const [page, setPage] = useState(20);
  const { ref, inView } = useInView();

  // checks if ref is in view
  useEffect(() => {
    if (inView && nextPage) {
      loadMore();
    }
  }, [inView]);

  async function loadMore() {
    const nextLoad = await getMoreFranchises(manga.id, page);
    if (nextLoad.links.next) {
      setPage((prev) => prev + 10);
      setRelatedFranchises((prev) => {
        const spreadArray = [...prev, ...nextLoad.franchises];
        // deDuped = [...new Map(arr.map(v => [v.id, v])).values()]
        // creates a new map where Object.values(spreadArray).map((character) => [character.id, character,])).values()
        // returns a new object array with no duplicated objects
        const deDuped = [
          ...new Map(
            Object.values(spreadArray).map((character) => [
              character.id,
              character,
            ])
          ).values(),
        ];
        return deDuped;
      });
    } else {
      setNextPage(false);
    }
  }
  return (
    <section className="container mx-auto py-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl">
          {manga.attributes.canonicalTitle} Franchise
        </h1>
        <div className="flex flex-wrap gap-6 p-2 md:p-0">
          {relatedFranchises.map((franchise) => (
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
                    onError={(e) => {
                      e.currentTarget.src =
                        franchise.attributes.posterImage.medium;
                    }}
                  />
                  <div className="">{franchise.attributes.canonicalTitle}</div>
                </a>
              </Link>
            </div>
          ))}
        </div>
      </div>
      <button ref={ref} onClick={() => loadMore()} className="invisible">
        load more
      </button>
    </section>
  );
}

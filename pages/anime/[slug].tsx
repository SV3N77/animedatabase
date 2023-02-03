import { format, parseISO } from "date-fns";
import { GetStaticPropsContext } from "next";
import Link from "next/link";
import { AnimeQuery, Character } from "../../utils/AnimeQuery";

// props for page
type AnimeProps = {
  anime: AnimeQuery;
  relatedAnime: AnimeQuery[];
  characters: Character[];
};

// using slug of anime to get anime details with categories
async function getAnime(slug: string) {
  const URL = `https://kitsu.io/api/edge/anime?filter[slug]=${slug}&include=categories`;
  const { data, included } = await fetch(URL).then((res) => res.json());
  let results = data[0] as AnimeQuery;
  results.categoriesArray = included;
  return results as AnimeQuery;
}

// using anime id to get 4 of the featured characters
async function getCharacters(id: string) {
  const URL = `https://kitsu.io/api/edge/castings?filter[media_id]=${id}&filter[media_type]=Anime&filter[is_character]=true&include=character&page[limit]=4&sort=-featured`;
  const { included } = await fetch(URL).then((res) => res.json());
  // if included is empty then return empty array
  return (included || []) as Character[];
}

async function getRelated(id: string) {
  const URL = `https://kitsu.io/api/edge/media-relationships?filter[source_id]=${id}&filter[source_type]=Anime&include=destination&page[limit]=4&sort=role`;
  const { included } = await fetch(URL).then((res) => res.json());
  // if included is empty then return empty array
  return (included || []) as AnimeQuery[];
}

// blocks page until it data is loaded
export function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}
// Next js getStaticProps data fetching for static site
export async function getStaticProps(ctx: GetStaticPropsContext) {
  // get params of link to get slug as string
  const slug = ctx.params!.slug as string;
  const anime = await getAnime(slug);
  const characters = await getCharacters(anime.id);
  const relatedAnime = await getRelated(anime.id);
  // if anime does not exist then return notFound
  if (!anime) {
    return {
      notFound: true,
    } as const;
  }
  return {
    props: { anime, characters, relatedAnime },
  };
}

export default function Anime({ anime, characters, relatedAnime }: AnimeProps) {
  // using date-fns to change the style of date
  let endDate;
  const startDate = format(parseISO(anime.attributes.startDate), "do MMM yyyy");
  if (anime.attributes.endDate) {
    endDate = format(parseISO(anime.attributes.endDate), "do MMM yyyy");
  }

  return (
    <section className="container mx-auto mb-8">
      <div className="flex flex-col gap-4">
        <img
          className="aspect-[18/3] w-full object-cover"
          src={
            anime.attributes.coverImage?.large ||
            "https://www.treehugger.com/thmb/QolJfOYFmxwIH6Sxv5SBqY8Kq-M=/1885x1414/smart/filters:no_upscale()/GettyImages-1273584292-cbcd5f85f4c646d58f7a7fa158dcaaeb.jpg"
          }
        />
        <div className="flex flex-col gap-4 p-2 md:flex-row">
          <div className="flex shrink-0 flex-col gap-4">
            <img
              className="mx-auto aspect-[3/4] w-full"
              src={anime.attributes.posterImage.small}
            />
            <div className="rounded-sm bg-slate-50 p-2 capitalize shadow-md">
              <h1 className="pb-2 text-xl">Anime Details</h1>
              <div className="flex flex-col gap-2 text-sm">
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
                  <div>{anime.attributes.showType}</div>
                </div>
                <div className="flex justify-between">
                  <div className="">Episodes</div>
                  <div>{anime.attributes.episodeCount}</div>
                </div>
                <div className="flex justify-between">
                  <div className="">Status</div>
                  <div>{anime.attributes.status}</div>
                </div>
                {anime.attributes.status === "current" ? (
                  <div className="flex justify-between">
                    <div className="">Airing</div> <div>Currently airing</div>
                  </div>
                ) : (
                  <div className="flex justify-between">
                    <div className="">Aired</div>
                    <div>
                      {startDate} to {endDate}
                    </div>
                  </div>
                )}
                {anime.attributes.ageRatingGuide ? (
                  <div className="flex justify-between">
                    <div className="">Rating</div>
                    <div>{anime.attributes.ageRatingGuide}</div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          <div className="flex grow flex-col gap-2 rounded-sm bg-slate-50 p-4 shadow-md md:flex-row">
            <div className="flex grow flex-col gap-4 text-base md:w-2/3">
              <div className="mb-4 text-2xl">
                {anime.attributes.canonicalTitle}
              </div>
              {anime.attributes.description}
              <div className="flex flex-wrap gap-4">
                {anime.categoriesArray.map((category) => (
                  <span
                    key={category.id}
                    className="rounded-lg bg-emerald-50 p-1 shadow-sm"
                  >
                    {category.attributes.title}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {characters.length > 0 && (
                <div>
                  <div className="text-xl">Characters</div>
                  <div className="flex gap-2">
                    {characters.map((character) => (
                      <div key={character.id} className="flex w-20 flex-col">
                        <img
                          className="aspect-[3/4] w-full"
                          src={character.attributes.image.original}
                        />
                        <div className="text-sm">
                          {character.attributes.canonicalName}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link
                    href={{
                      pathname: "/anime/[slug]/characters",
                      query: { slug: anime.attributes.slug },
                    }}
                  >
                    <a className="text-neutral-400 underline hover:opacity-50 ">
                      View all characters
                    </a>
                  </Link>
                </div>
              )}
              {relatedAnime.length > 0 && (
                <div>
                  <div className="text-xl">Related Anime</div>
                  <div className="flex gap-2">
                    {relatedAnime.map((related) => (
                      <div key={related.id} className="flex w-20 flex-col">
                        <Link
                          href={
                            related.type === "anime"
                              ? {
                                  pathname: "/anime/[slug]",
                                  query: { slug: related.attributes.slug },
                                }
                              : {
                                  pathname: "/manga/[slug]",
                                  query: { slug: related.attributes.slug },
                                }
                          }
                        >
                          <a>
                            <img
                              className="aspect-[3/4] w-full"
                              src={related.attributes.posterImage.original}
                            />
                            <div className="text-sm">
                              {related.attributes.canonicalTitle}
                            </div>
                          </a>
                        </Link>
                      </div>
                    ))}
                  </div>
                  <Link
                    href={{
                      pathname: "/anime/[slug]/franchises",
                      query: { slug: anime.attributes.slug },
                    }}
                  >
                    <a className="text-neutral-400 underline hover:opacity-50 ">
                      View all in {anime.attributes.canonicalTitle}
                    </a>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

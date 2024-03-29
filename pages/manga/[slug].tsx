import { format, parseISO } from "date-fns";
import { GetStaticPropsContext } from "next";
import Link from "next/link";
import { Character } from "../../utils/AnimeQuery";
import { MangaQuery } from "../../utils/MangaQuery";

// props for page
type MangaProps = {
  manga: MangaQuery;
  relatedManga: MangaQuery[];
  characters: Character[];
};

async function getManga(slug: string) {
  const URL = `https://kitsu.io/api/edge/manga?filter[slug]=${slug}&include=categories`;
  const { data, included } = await fetch(URL).then((res) => res.json());
  let results = data[0] as MangaQuery;
  results.categoriesArray = included;
  return results as MangaQuery;
}

async function getCharacters(id: string) {
  const URL = `https://kitsu.io/api/edge/castings?filter[media_id]=${id}&filter[media_type]=Manga&filter[is_character]=true&include=character&page[limit]=4&sort=-featured`;
  const { included } = await fetch(URL).then((res) => res.json());
  return (included || []) as Character[];
}

async function getRelated(id: string) {
  const URL = `https://kitsu.io/api/edge/media-relationships?filter[source_id]=${id}&filter[source_type]=Manga&include=destination&page[limit]=4&sort=role`;
  const { included } = await fetch(URL).then((res) => res.json());
  return (included || []) as MangaQuery[];
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
  const characters = await getCharacters(manga.id);
  const relatedManga = await getRelated(manga.id);
  if (!manga) {
    return {
      notFound: true,
    } as const;
  }
  return {
    props: { manga, relatedManga, characters },
  };
}

export default function Manga({ manga, relatedManga, characters }: MangaProps) {
  const startDate = format(parseISO(manga.attributes.startDate), "do MMM yyyy");
  const endDate = format(parseISO(manga.attributes.endDate), "do MMM yyyy");

  return (
    <section className="container mx-auto mb-8">
      <div className="flex flex-col gap-4">
        <img
          className="aspect-[18/3] w-full object-cover"
          src={
            manga.attributes.coverImage ||
            "https://www.treehugger.com/thmb/QolJfOYFmxwIH6Sxv5SBqY8Kq-M=/1885x1414/smart/filters:no_upscale()/GettyImages-1273584292-cbcd5f85f4c646d58f7a7fa158dcaaeb.jpg"
          }
        />
        <div className="flex flex-col gap-4 p-2 md:flex-row">
          <div className="flex shrink-0 flex-col gap-4">
            <img
              className="mx-auto aspect-[3/4] w-full"
              src={manga.attributes.posterImage.small}
            />
            <div className="rounded-sm bg-slate-50 p-2 capitalize shadow-md">
              <div className="text-xl">Manga Details</div>
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between">
                  <div className="">English</div>
                  <div>{manga.attributes.titles.en}</div>
                </div>
                <div className="flex justify-between">
                  <div className="">Japanese</div>
                  <div>{manga.attributes.titles.en_jp}</div>
                </div>
                <div className="flex justify-between">
                  <div className="">Type</div>
                  <div>{manga.attributes.mangaType}</div>
                </div>
                <div className="flex justify-between">
                  <div className="">Chapters</div>
                  <div>{manga.attributes.chapterCount}</div>
                </div>
                <div className="flex justify-between">
                  <div className="">Volumes</div>
                  <div>{manga.attributes.volumeCount}</div>
                </div>
                <div className="flex justify-between">
                  <div className="">Status</div>
                  <div>{manga.attributes.status}</div>
                </div>
                <div className="flex justify-between">
                  <div className="">Aired</div>
                  <div>
                    {startDate} to {endDate}
                  </div>
                </div>
                {manga.attributes.ageRatingGuide ? (
                  <div className="flex justify-between">
                    <div className="">Rating</div>
                    <div>{manga.attributes.ageRatingGuide}</div>
                  </div>
                ) : null}
                <div className="flex justify-between">
                  <div className="">Serialization</div>
                  <div>{manga.attributes.serialization}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex grow flex-col gap-2 rounded-sm bg-slate-50 p-4 shadow-md md:flex-row">
            <div className="flex grow flex-col gap-4 text-base md:w-2/3">
              <div className="mb-4 text-2xl">
                {manga.attributes.canonicalTitle}
              </div>
              {manga.attributes.description}
              <div className="flex flex-wrap gap-4">
                {manga.categoriesArray.map((category) => (
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
                      query: { slug: manga.attributes.slug },
                    }}
                  >
                    <a className="text-neutral-400 underline hover:opacity-50 ">
                      View all characters
                    </a>
                  </Link>
                </div>
              )}
              {relatedManga.length > 0 && (
                <div>
                  <div className="text-xl">Related manga</div>
                  <div className="flex gap-2">
                    {relatedManga.map((related) => (
                      <div key={related.id} className="flex w-20 flex-col">
                        <img
                          className="aspect-[3/4] w-full"
                          src={related.attributes.posterImage.original}
                        />
                        <div className="text-sm">
                          {related.attributes.canonicalTitle}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link
                    href={{
                      pathname: "/manga/[slug]/franchises",
                      query: { slug: manga.attributes.slug },
                    }}
                  >
                    <a className="text-neutral-400 underline hover:opacity-50 ">
                      View all in {manga.attributes.canonicalTitle}
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

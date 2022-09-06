import { format, parseISO } from "date-fns";
import { GetStaticPropsContext } from "next";
import Link from "next/link";
import { MangaQuery } from "../../utils/MangaQuery";

type MangaProps = {
  manga: MangaQuery;
  relatedManga: MangaQuery[];
};

async function getManga(slug: string) {
  const URL = `https://kitsu.io/api/edge/manga?filter[slug]=${slug}&include=genres`;
  const { data, included } = await fetch(URL).then((res) => res.json());
  let results = data[0] as MangaQuery;
  results.genresArray = included;
  return results as MangaQuery;
}

async function getRelated(id: string) {
  const URL = `https://kitsu.io/api/edge/media-relationships?filter[source_id]=${id}&filter[source_type]=Manga&include=destination&page[limit]=4&sort=role`;
  const { included } = await fetch(URL).then((res) => res.json());
  return included as MangaQuery[];
}

async function getDefaultImage(id: string) {
  const URL = `https://media.kitsu.io/anime/12/cover_image/`;
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
  const relatedManga = await getRelated(manga.id);
  if (!manga) {
    return {
      notFound: true,
    } as const;
  }
  return {
    props: { manga, relatedManga },
  };
}

export default function Manga({ manga, relatedManga }: MangaProps) {
  const startDate = format(parseISO(manga.attributes.startDate), "do MMM yyyy");
  const endDate = format(parseISO(manga.attributes.endDate), "do MMM yyyy");

  return (
    <section className="container mx-auto mb-8">
      <div className="flex flex-col gap-4">
        <img
          className="aspect-[18/3] w-full"
          src={manga.attributes.coverImage}
        />
        <div className="flex gap-4">
          <div className="flex shrink-0 flex-col gap-4">
            <img
              className="mx-auto aspect-[3/4] w-full"
              src={manga.attributes.posterImage.small}
            />
            <div className="rounded-sm bg-slate-50 p-2 shadow-md">
              <div className="mb-4 text-2xl">
                {manga.attributes.canonicalTitle}
              </div>
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
              </div>
            </div>
          </div>
          <div className="flex gap-2 rounded-sm bg-slate-50 p-4 shadow-md">
            <div className="flex w-2/3 grow flex-col gap-4 text-base">
              {manga.attributes.description}
              <div className="flex gap-4">
                {manga.genresArray.map((genre) => (
                  <span
                    key={genre.id}
                    className="rounded-lg bg-emerald-50 p-1 shadow-sm"
                  >
                    {genre.attributes.name}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3">
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
          </div>
        </div>
      </div>
    </section>
  );
}

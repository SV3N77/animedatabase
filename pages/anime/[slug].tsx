import { GetStaticPropsContext } from "next";
import Image from "next/future/image";
import { AnimeQuery, Character, Genre } from "../../utils/AnimeQuery";
import { format, parseISO } from "date-fns";

type AnimeProps = {
  anime: AnimeQuery;
  characters: Character[];
};

async function getAnime(slug: string) {
  const URL = `https://kitsu.io/api/edge/anime?filter[slug]=${slug}&include=genres`;
  const { data, included } = await fetch(URL).then((res) => res.json());
  let results = data[0] as AnimeQuery;

  results.genresArray = included;
  return results as AnimeQuery;
}

async function getCharacters(id: string) {
  const URL = `https://kitsu.io/api/edge/castings?filter[media_id]=${id}&filter[media_type]=Anime&filter[is_character]=true&filter[language]=Japanese&include=character&page[limit]=4&sort=-featured`;
  const { included } = await fetch(URL).then((res) => res.json());
  return included as Character[];
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
  const characters = await getCharacters(anime.id);

  if (!anime) {
    return {
      notFound: true,
    } as const;
  }
  return {
    props: { anime, characters },
  };
}

export default function index({ anime, characters }: AnimeProps) {
  const startDate = format(parseISO(anime.attributes.startDate), "do MMM yyyy");
  const endDate = format(parseISO(anime.attributes.endDate), "do MMM yyyy");

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
              className="mx-auto aspect-[3/4]"
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
                <div className="flex justify-between">
                  <div className="">Aired</div>
                  <div>
                    {startDate} to {endDate}
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
          <div className="flex gap-2 rounded-sm bg-slate-50 p-4 shadow-md">
            <div className="flex w-2/3 grow flex-col gap-4 text-base">
              {anime.attributes.description}
              <div className="flex gap-4">
                {anime.genresArray.map((genre: Genre) => (
                  <span
                    key={genre.id}
                    className="rounded-lg bg-emerald-50 p-1 shadow-sm"
                  >
                    {genre.attributes.name}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col">
              {characters.map((character) => (
                <div key={character.id} className="flex flex-col ">
                  <Image
                    className="aspect-[3/4]"
                    src={character.attributes.image.original}
                    width={72}
                    height={96}
                  />
                  <div className="text-sm">
                    {character.attributes.canonicalName}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

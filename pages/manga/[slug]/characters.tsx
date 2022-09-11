import { GetStaticPropsContext } from "next";
import { Character } from "../../../utils/AnimeQuery";
import { MangaQuery } from "../../../utils/MangaQuery";

type CharacterProps = { manga: MangaQuery; mangaCharacters: Character[] };

async function getManaga(slug: string) {
  const URL = `https://kitsu.io/api/edge/manga?filter[slug]=${slug}`;
  const { data } = await fetch(URL).then((res) => res.json());
  return data[0] as MangaQuery;
}

async function getAllCharacters(id: string) {
  const URL = `https://kitsu.io/api/edge/castings?filter[media_type]=Manga&filter[media_id]=${id}&filter[is_character]=true&filter[language]=Japanese&include=character,person&page[limit]=20&sort=-featured`;
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
  const manga = await getManaga(slug);
  const allCharacters = await getAllCharacters(manga.id);
  const mangaCharacters = allCharacters.filter(
    (character) => character.type === "characters"
  );
  const voiceActors = allCharacters.filter(
    (character) => character.type === "people"
  );

  if (!allCharacters) {
    return {
      notFound: true,
    } as const;
  }
  return {
    props: { manga, mangaCharacters },
  };
}
export default function characters({ manga, mangaCharacters }: CharacterProps) {
  return (
    <section className="container mx-auto py-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl">
          {manga.attributes.canonicalTitle} Characters
        </h1>
        <div className="flex flex-wrap gap-6">
          {mangaCharacters.map((character) => (
            <div key={character.id} className="w-56">
              <img
                className="aspect-[3/4] w-full"
                src={character.attributes.image.original}
              />
              <div className="">{character.attributes.canonicalName}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { GetStaticPropsContext } from "next";
import Image from "next/future/image";
import { AnimeQuery, Character } from "../../../utils/AnimeQuery";

type CharacterProps = { anime: AnimeQuery; allCharacters: Character[] };

async function getAnime(slug: string) {
  const URL = `https://kitsu.io/api/edge/anime?filter[slug]=${slug}`;
  const { data } = await fetch(URL).then((res) => res.json());
  return data[0] as AnimeQuery;
}

async function getAllCharacters(id: string) {
  const URL = `https://kitsu.io/api/edge/castings?filter[media_type]=Anime&filter[media_id]=${id}&filter[is_character]=true&filter[language]=Japanese&include=character,person&sort=-featured`;
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
  const allCharacters = await getAllCharacters(anime.id);
  if (!allCharacters) {
    return {
      notFound: true,
    } as const;
  }
  return {
    props: { anime, allCharacters },
  };
}
export default function characters({ anime, allCharacters }: CharacterProps) {
  return (
    <section className="container mx-auto py-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl">
          {anime.attributes.canonicalTitle} Characters
        </h1>
        <div className="flex flex-wrap gap-6">
          {allCharacters.map((character) => (
            <div key={character.id} className="w-56">
              <Image
                className="aspect-[3/4]"
                src={character.attributes.image.original}
                width={224}
                height={288}
              />
              <div className="">{character.attributes.canonicalName}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

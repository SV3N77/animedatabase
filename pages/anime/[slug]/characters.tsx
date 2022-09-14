import { GetStaticPropsContext } from "next";
import { useState } from "react";
import {
  AnimeQuery,
  Character,
  Links,
  MoreCharacters,
} from "../../../utils/AnimeQuery";

type CharacterProps = { anime: AnimeQuery; animeCharacters: Character[] };

async function getAnime(slug: string) {
  const URL = `https://kitsu.io/api/edge/anime?filter[slug]=${slug}`;
  const { data } = await fetch(URL).then((res) => res.json());
  return data[0] as AnimeQuery;
}

async function getAllCharacters(id: string) {
  const URL = `https://kitsu.io/api/edge/castings?filter[media_type]=Anime&filter[media_id]=${id}&filter[is_character]=true&filter[language]=Japanese&include=character&page[limit]=10&sort=-featured`;
  const { included } = await fetch(URL).then((res) => res.json());
  return included as Character[];
}

async function getMoreCharacters(id: string, page: number) {
  const URL = `https://kitsu.io/api/edge/castings?filter[media_type]=Anime&filter[media_id]=${id}&filter[is_character]=true&filter[language]=Japanese&include=character&page[limit]=10&page[offset]=${page}&sort=-featured`;
  const { included, links } = await fetch(URL).then((res) => res.json());
  let results = { characters: included, links: links } as MoreCharacters;
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
  const anime = await getAnime(slug);
  const allCharacters = await getAllCharacters(anime.id);
  const animeCharacters = allCharacters.filter(
    (character) => character.type === "characters"
  );

  if (!allCharacters) {
    return {
      notFound: true,
    } as const;
  }
  return {
    props: { anime, animeCharacters },
  };
}

export default function characters({ anime, animeCharacters }: CharacterProps) {
  const [characters, setCharacters] = useState<Character[]>(animeCharacters);
  const [isNextPage, setIsNextPage] = useState(true);
  const [page, setPage] = useState(10);

  async function loadMore() {
    const nextLoad = await getMoreCharacters(anime.id, page);
    if (nextLoad.links.next) {
      setPage((prev) => prev + 10);
      setCharacters((prev) => {
        const spreadArray = [...prev, ...nextLoad.characters];
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
      setIsNextPage(false);
    }
  }
  return (
    <section className="container mx-auto py-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl">
          {anime.attributes.canonicalTitle} Characters
        </h1>
        <div className="flex flex-wrap gap-6">
          {characters.map((character) => (
            <div key={character.id}>
              <div className="w-56">
                <img
                  className="aspect-[3/4] w-full"
                  src={character.attributes.image.original}
                />
                <div className="">{character.attributes.canonicalName}</div>
              </div>
            </div>
          ))}
        </div>
        {isNextPage && <button onClick={loadMore}>load more</button>}
      </div>
    </section>
  );
}

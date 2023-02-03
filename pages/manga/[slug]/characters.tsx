import { GetStaticPropsContext } from "next";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import Button from "../../../components/Button";
import { Character, MoreCharacters } from "../../../utils/AnimeQuery";
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

async function getMoreCharacters(id: string, page: number) {
  const URL = `https://kitsu.io/api/edge/castings?filter[media_type]=Manga&filter[media_id]=${id}&filter[is_character]=true&filter[language]=Japanese&include=character&page[limit]=10&page[offset]=${page}&sort=-featured`;
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
  const manga = await getManaga(slug);
  const allCharacters = await getAllCharacters(manga.id);
  const mangaCharacters = allCharacters.filter(
    (character) => character.type === "characters"
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
export default function Characters({ manga, mangaCharacters }: CharacterProps) {
  const [characters, setCharacters] = useState<Character[]>(mangaCharacters);
  const [isNextPage, setIsNextPage] = useState(true);
  const [page, setPage] = useState(10);
  const { ref, inView } = useInView();
  // checks if ref is in view
  useEffect(() => {
    if (inView && isNextPage) {
      loadMore();
    }
  }, [inView]);

  async function loadMore() {
    const nextLoad = await getMoreCharacters(manga.id, page);
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
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl">
          {manga.attributes.canonicalTitle} Characters
        </h1>
        <div className="flex flex-wrap gap-6 p-2 md:p-0">
          {characters.map((character) => (
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
      <button ref={ref} onClick={() => loadMore()} className="invisible">
        load more
      </button>
    </section>
  );
}

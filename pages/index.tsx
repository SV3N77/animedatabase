import { useQuery } from "@tanstack/react-query";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { AnimeQuery } from "../utils/AnimeQuery";

async function getAnimes(query: string) {
  const URL = `https://kitsu.io/api/edge/anime?filter[text]=${query}`;
  const { data } = await fetch(URL).then((res) => res.json());
  return data as AnimeQuery[];
}

function Home() {
  const [query, setQuery] = useState<string>("");

  const search = useQuery({
    queryKey: ["search", query],
    queryFn: () => getAnimes(query),
    enabled: query.length > 3,
    keepPreviousData: true,
  });

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const queryText = formData.get("query") as string;
    setQuery(queryText);
  }

  return (
    <div className="flex flex-col">
      <Head>
        <title>AnimeDB</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="container mx-auto flex flex-col gap-4 py-8">
        <h1 className="text-2xl">Search Anime</h1>
        <form onSubmit={onSubmit}>
          <label
            htmlFor="query"
            className="sr-only mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Search
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                className="h-5 w-5 text-gray-500 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
            <input
              type="search"
              id="query"
              name="query"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 pl-10 text-sm text-gray-900"
              placeholder="Search Animes"
            />
            <button
              type="submit"
              className="absolute right-2.5 bottom-2.5 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800 "
            >
              Search
            </button>
          </div>
        </form>
        <section className="mt-4 grid grid-cols-2 gap-4">
          {search.data?.map((attribute) => (
            <AnimeCard key={attribute.id} anime={attribute} />
          ))}
        </section>
      </section>
    </div>
  );
}

export default Home;

// internal components

type AnimeCardProps = {
  anime: AnimeQuery;
};

function AnimeCard({ anime }: AnimeCardProps) {
  return (
    <div className="flex h-64 rounded-md bg-neutral-50 shadow-lg">
      <Link
        href={{
          pathname: "/anime/[slug]",
          query: { slug: anime.attributes.slug },
        }}
      >
        <a>
          <div
            className="relative flex aspect-[3/4] h-full flex-row bg-cover"
            style={{
              backgroundImage: `url(${anime.attributes.posterImage.small})`,
            }}
          >
            <div className="absolute inset-x-0 bottom-0 flex bg-black/50 p-2 backdrop-blur-md">
              <div className="text-white">
                <h2 className="text-md">{anime.attributes.canonicalTitle}</h2>
              </div>
            </div>
          </div>
        </a>
      </Link>
      <div className="flex grow flex-col gap-2">
        <div className="flex justify-end gap-2 bg-emerald-50 px-4 py-3 text-sm">
          {anime.attributes.averageRating ? (
            <div>{anime.attributes.averageRating} Average Rating</div>
          ) : null}
          <div className="">{anime.attributes.episodeCount} episodes</div>
        </div>
        <div className="grow overflow-auto p-4 text-sm">
          {anime.attributes.synopsis}
        </div>
      </div>
    </div>
  );
}

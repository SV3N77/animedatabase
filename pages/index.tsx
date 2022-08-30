import Head from "next/head";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

async function getAnimeQuery(query: string) {
  const URL = `https://kitsu.io/api/edge/anime?filter[text]=${query}`;
  const { data } = await fetch(URL).then((res) => res.json());
  return data;
}

function Home() {
  const [query, setQuery] = useState<string>("");

  const search = useQuery({
    queryKey: ["search", query],
    queryFn: () => getAnimeQuery(query),
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
      <section className="container mx-auto flex flex-col py-8">
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
          {search.data?.map((anime: any) => (
            <AnimeCard anime={anime} />
          ))}
        </section>
      </section>
    </div>
  );
}

export default Home;

// internal components
type AnimeCardProps = {};

function AnimeCard({ anime }: any) {
  return (
    <div className="flex h-64 gap-3 rounded-md shadow-lg">
      <div
        className="relative flex aspect-[3/4] h-full flex-row bg-cover"
        style={{
          backgroundImage: `url(${anime.attributes.posterImage.small})`,
        }}
      >
        <div className="absolute inset-x-0 bottom-0 flex bg-black/50 p-2 backdrop-blur-md">
          <div className="text-white">
            <h2 className="text-md">{anime.attributes.canonicalTitle}</h2>
            <h3></h3>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between p-2">
          <div className="text-sm">
            {anime.attributes.episodeCount} episodes
          </div>
        </div>
        <div className="overflow-auto text-sm">{anime.attributes.synopsis}</div>
      </div>
    </div>
  );
}

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import Head from "next/head";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { AnimeCardProps, AnimeQuery } from "../utils/AnimeQuery";

type QueryProps = {
  anime: AnimeQuery[];
  next?: number;
};

// passing query string to get query data from api
async function getAnimes(query: string, pageParam: number) {
  const url = `https://kitsu.io/api/edge/anime?filter[text]=${query}&page[limit]=10&page[offset]=${pageParam}`;
  const { data, links } = await fetch(url).then((res) => res.json());
  // gets next link and if there is a next link
  const nextPageURL = links.next ? new URL(links.next) : undefined;
  // ternary for if there is a next page and get page[offset]
  let results = {
    anime: data,
    next: nextPageURL
      ? nextPageURL.searchParams.get("page[offset]")
      : undefined,
  } as QueryProps;

  return results;
}

async function getTrending() {
  const { data } = await fetch(
    `https://kitsu.io/api/edge/trending/anime?limit=10`
  ).then((res) => res.json());
  return data as AnimeQuery[];
}

function Home() {
  const [query, setQuery] = useState<string>("");

  // initiate react-intersection-observer ref
  const { ref, inView } = useInView();

  const trending = useQuery(["trending"], getTrending);

  // useinfinitequery
  // pass search query and pageParam
  const { data, isFetching, fetchNextPage, hasNextPage } = useInfiniteQuery(
    ["search", query],
    ({ pageParam = 0 }) => getAnimes(query, pageParam),
    {
      getNextPageParam: (lastPage) => {
        return lastPage.next || undefined;
      },
      keepPreviousData: true,
      enabled: query.length > 3,
    }
  );
  // checks if ref is in view
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  // form submit
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
      <section className="container mx-auto flex flex-col gap-5 py-8">
        <h1 className="text-2xl">
          Search Anime{" "}
          {isFetching && (
            <svg
              className="ml-2 inline h-6 w-6 animate-spin fill-green-500 text-gray-200 dark:text-gray-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          )}
        </h1>
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
        {data ? (
          <div>
            {data.pages.at(0)?.anime.length === 0 && (
              <div className="text-center">{query} Not Found</div>
            )}
            <section className="mt-4 flex flex-col gap-4 py-4 lg:grid lg:grid-cols-2">
              {data?.pages?.map((animes, i) => (
                <React.Fragment key={i}>
                  {animes.anime.map((ani) => (
                    <AnimeCard key={ani.id} anime={ani} />
                  ))}
                </React.Fragment>
              ))}
            </section>
            {hasNextPage && (
              <button
                ref={ref}
                onClick={() => fetchNextPage()}
                className="invisible"
              >
                load more
              </button>
            )}
          </div>
        ) : (
          <section className="flex flex-col gap-2">
            <div className="text-2xl">Trending Anime</div>
            <div className="flex flex-wrap gap-2">
              {trending.data?.map((trendingAnime) => (
                <React.Fragment key={trendingAnime.id}>
                  <SmallAnimeCard anime={trendingAnime} />
                </React.Fragment>
              ))}
            </div>
            <Link href="/trending">
              <a className="text-neutral-400 underline hover:opacity-50 ">
                View More...
              </a>
            </Link>
          </section>
        )}
      </section>
    </div>
  );
}

export default Home;

// internal components

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
      <div className="flex flex-col gap-2 lg:grow">
        <div className="flex justify-end gap-2 bg-emerald-50 px-4 py-3 text-sm">
          {anime.attributes.averageRating && (
            <div>{anime.attributes.averageRating} Average Rating</div>
          )}
          <div className="">{anime.attributes.episodeCount} episodes</div>
        </div>
        <div className="overflow-y-auto p-4 text-sm lg:grow">
          {anime.attributes.synopsis}
        </div>
      </div>
    </div>
  );
}

function SmallAnimeCard({ anime }: AnimeCardProps) {
  return (
    <div className="flex h-48 rounded-md bg-neutral-50 shadow-lg">
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
                <h2 className="text-sm">{anime.attributes.canonicalTitle}</h2>
              </div>
            </div>
          </div>
        </a>
      </Link>
    </div>
  );
}

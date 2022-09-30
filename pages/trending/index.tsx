import Link from "next/link";
import React from "react";
import { AnimeCardProps, AnimeQuery } from "../../utils/AnimeQuery";

type TrendingProps = {
  trending: AnimeQuery[];
};

export async function getStaticProps() {
  const { data } = await fetch(
    `https://kitsu.io/api/edge/trending/anime?limit=18`
  ).then((res) => res.json());
  return {
    props: {
      trending: data,
    },
  };
}

export default function index({ trending }: TrendingProps) {
  return (
    <section className="container mx-auto flex flex-col gap-4 py-8">
      <div className="text-2xl">Trending Anime</div>
      <div className="flex flex-wrap gap-8">
        {trending.map((trendAnime) => (
          <React.Fragment key={trendAnime.id}>
            <SmallAnimeCard anime={trendAnime} />
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}

// internal compenents

function SmallAnimeCard({ anime }: AnimeCardProps) {
  return (
    <div className="flex h-72 rounded-md bg-neutral-50 shadow-lg">
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

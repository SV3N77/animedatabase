import { AnimeQuery } from "../../utils/AnimeQuery";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import Image from "next/future/image";

async function getAnime(id: string) {
  let results;
  if (id) {
    const URL = `https://kitsu.io/api/edge/anime/${id}`;
    const { data } = await fetch(URL).then((res) => res.json());
    results = data;
  }
  return results as AnimeQuery;
}

function index() {
  const router = useRouter();
  const { id } = router.query;

  const { data } = useQuery({
    queryKey: ["search", id],
    queryFn: () => getAnime(id! as string),
    keepPreviousData: true,
  });
  console.log(data?.attributes.coverImage.large);
  return (
    <section className="container mx-auto mt-8">
      {data ? (
        <div className="flex flex-col">
          <Image
            className=""
            src={data.attributes.coverImage.large}
            width={970}
            height={230}
          />
          <div className="">{data.attributes.description}</div>
        </div>
      ) : (
        "not available"
      )}
    </section>
  );
}

export default index;

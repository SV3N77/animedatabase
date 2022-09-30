import Link from "next/link";
import { useRouter } from "next/router";

export default function Header() {
  const router = useRouter();
  return (
    <header className="flex bg-emerald-600 p-4">
      <div className="container mx-auto flex items-center justify-between">
        <button
          onClick={() =>
            router.pathname === "/" ? router.reload() : router.push("/")
          }
        >
          <a className="text-2xl text-white">AnimeDB</a>
        </button>
        <Link href="/">
          <a className="text-white">Home</a>
        </Link>
      </div>
    </header>
  );
}

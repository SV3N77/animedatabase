import Link from "next/link";

export default function Header() {
  return (
    <header className="flex bg-emerald-600 p-4">
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="text-2xl text-white">AnimeDB</h1>
        <Link href="/">
          <a className="text-white">Home</a>
        </Link>
      </div>
    </header>
  );
}

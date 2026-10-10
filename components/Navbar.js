import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-10 border-b border-white/10 bg-black/30 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/team" className="text-lg font-bold tracking-wide">
          The <span className="text-purple-400">Embrione</span>
        </Link>
        <div className="flex gap-5 text-sm text-neutral-300">
          <Link href="/team" className="hover:text-white">Team</Link>
          <Link href="/register" className="hover:text-white">Register</Link>
          <Link href="/admin" className="hover:text-white">Admin</Link>
        </div>
      </div>
    </nav>
  );
}
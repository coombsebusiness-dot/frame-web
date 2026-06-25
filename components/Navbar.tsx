import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="border-b border-white/10 bg-black">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
         <img
  src="/frame-icon.png"
  alt="Frame"
  className="h-9 w-9 rounded-xl"
/>
          <span className="text-lg font-bold tracking-wide text-white">
            FRAME
          </span>
        </Link>

        <div className="flex items-center gap-6 text-sm text-zinc-300">
          <Link href="/explore" className="hover:text-white">
            Explore
          </Link>

          <a
            href="https://apps.apple.com/app/frame-creative-network/id6777236011"
            target="_blank"
            className="rounded-full bg-white px-4 py-2 font-semibold text-black hover:bg-zinc-200"
          >
            Download App
          </a>
        </div>
      </div>
    </nav>
  );
}
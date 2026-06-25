import Image from 'next/image';

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <nav className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Image
              src="/frame-icon.png"
              alt="Frame"
              width={40}
              height={40}
              className="rounded-xl"
            />
            <span className="text-lg font-bold tracking-wide">FRAME</span>
          </div>

          <div className="hidden items-center gap-8 text-sm text-zinc-300 md:flex">
            <a href="#" className="hover:text-white">Home</a>
            <a href="#" className="hover:text-white">Explore</a>
            <a href="#" className="hover:text-white">About</a>
            <a href="#" className="hover:text-white">Login</a>
          </div>

          <a
            href="https://apps.apple.com/app/frame-creative-network/id6777236011"
            className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black"
          >
            Download
          </a>
        </div>
      </nav>

      <section className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 pt-24 text-center">
        <Image
          src="/frame-icon.png"
          alt="Frame"
          width={96}
          height={96}
          className="mb-8 rounded-3xl shadow-2xl"
        />

        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-zinc-400">
          Frame Creative Network
        </p>

        <h1 className="max-w-4xl text-5xl font-bold tracking-tight sm:text-7xl">
          The creative network for photographers, artists and visual storytellers.
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-zinc-300 sm:text-xl">
          Share your work, discover other creatives, follow inspiring profiles and build your visual community.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <a
            href="https://apps.apple.com/app/frame-creative-network/id6777236011"
            className="rounded-full bg-white px-8 py-4 text-base font-semibold text-black"
          >
            Download on the App Store
          </a>

          <a
            href="#"
            className="rounded-full border border-white/20 px-8 py-4 text-base font-semibold text-white"
          >
            Explore Frame
          </a>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-6 py-24">
  <div className="mb-12 text-center">
    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-zinc-400">
      Frame In Action
    </p>

    <h2 className="mt-4 text-4xl font-bold">
      Built for creatives.
    </h2>

    <p className="mt-4 text-zinc-400">
      Discover, share and connect with photographers, artists and visual storytellers.
    </p>
  </div>

  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    <Image
      src="/screenshots/feed.jpg"
      alt="Feed"
      width={500}
      height={1000}
      className="rounded-3xl border border-white/10 shadow-xl transition duration-300 hover:-translate-y-2 hover:scale-[1.02]"
    />

    <Image
      src="/screenshots/explore.jpg"
      alt="Explore"
      width={500}
      height={1000}
      className="rounded-3xl border border-white/10 shadow-xl transition duration-300 hover:-translate-y-2 hover:scale-[1.02]"
    />

    <Image
      src="/screenshots/photo.jpg"
      alt="Photo"
      width={500}
      height={1000}
      className="rounded-3xl border border-white/10 shadow-xl transition duration-300 hover:-translate-y-2 hover:scale-[1.02]"
    />

    <Image
      src="/screenshots/profile.jpg"
      alt="Profile"
      width={500}
      height={1000}
      className="rounded-3xl border border-white/10 shadow-xl transition duration-300 hover:-translate-y-2 hover:scale-[1.02]"
    />

    <Image
      src="/screenshots/messages.jpg"
      alt="Messages"
      width={500}
      height={1000}
      className="rounded-3xl border border-white/10 shadow-xl transition duration-300 hover:-translate-y-2 hover:scale-[1.02]"
    />
    <Image
  src="/screenshots/stories.jpg"
  alt="Stories"
  width={500}
  height={1000}
  className="rounded-3xl border border-white/10 shadow-xl transition duration-300 hover:-translate-y-2 hover:scale-[1.02]"
/>
  </div>
</section>
<section className="mx-auto max-w-6xl px-6 py-24">
  <div className="mb-12 text-center">
    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-zinc-400">
      Why Frame?
    </p>

    <h2 className="mt-4 text-4xl font-bold">
      A creative space built around your work.
    </h2>
  </div>

  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
    {[
      {
        title: 'Share Your Work',
        text: 'Post photography, artwork and visual projects in a space designed for creatives.',
      },
      {
        title: 'Discover Creatives',
        text: 'Explore inspiring photographers, artists, designers and visual storytellers.',
      },
      {
        title: 'Build Connections',
        text: 'Follow profiles, like posts, comment on work and message other creatives.',
      },
      {
        title: 'Grow Your Audience',
        text: 'Share your Frame profile and posts beyond the app with proper web links.',
      },
    ].map((feature) => (
      <div
        key={feature.title}
        className="rounded-3xl border border-white/10 bg-white/[0.03] p-6"
      >
        <h3 className="text-xl font-semibold">{feature.title}</h3>
        <p className="mt-3 text-sm leading-6 text-zinc-400">
          {feature.text}
        </p>
      </div>
    ))}
  </div>
</section>

<section className="mx-auto max-w-5xl px-6 py-24 text-center">
  <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] px-6 py-16">
    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-zinc-400">
      Join Frame
    </p>

    <h2 className="mt-4 text-4xl font-bold">
      Ready to share your creative world?
    </h2>

    <p className="mx-auto mt-4 max-w-2xl text-zinc-400">
      Download Frame and join a growing creative network for photographers, artists and visual storytellers.
    </p>

    <a
      href="https://apps.apple.com/app/frame-creative-network/id6777236011"
      className="mt-8 inline-flex rounded-full bg-white px-8 py-4 text-base font-semibold text-black"
    >
      Download on the App Store
    </a>
  </div>
</section>

<footer className="border-t border-white/10 px-6 py-8">
  <div className="mx-auto flex max-w-6xl flex-col gap-4 text-sm text-zinc-500 md:flex-row md:items-center md:justify-between">
    <p>© 2026 Frame Creative Network</p>

    <div className="flex gap-6">
      <a href="#" className="hover:text-white">Privacy Policy</a>
      <a href="#" className="hover:text-white">Terms</a>
      <a href="#" className="hover:text-white">Support</a>
    </div>
  </div>
</footer>
    </main>
  );
}
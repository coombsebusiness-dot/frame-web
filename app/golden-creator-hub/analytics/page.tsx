import Link from "next/link";
import Image from "next/image";

export default function GoldFrameAnalyticsPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-20">

        <Link
          href="/golden-creator-hub"
          className="inline-flex rounded-full border border-white/10 px-5 py-3 text-sm font-bold text-zinc-300 transition hover:bg-white/10"
        >
          ← Back to The Gold Frame
        </Link>

        <section className="mt-16 text-center">

          <Image
            src="/assets/gold-frame-512.png"
            alt="The Gold Frame"
            width={120}
            height={120}
            className="mx-auto"
          />

          <p className="mt-8 text-sm font-bold uppercase tracking-[0.4em] text-yellow-400">
            Creator Analytics
          </p>

          <h1 className="mt-5 text-5xl font-black md:text-7xl">
            Understand your creative journey.
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-zinc-400">
            Gold Frame creators receive powerful insights into their creative
            growth, audience engagement and community impact.
          </p>
        </section>

        <section className="mt-20 grid gap-6 md:grid-cols-3">

          {[
            ["Posts", "Your published work"],
            ["Videos", "Creative video content"],
            ["Stories", "Story activity"],
            ["Followers", "Community growth"],
            ["Engagement", "Likes & comments"],
            ["Creator Score", "Overall creator impact"],
          ].map(([title, description]) => (
            <div
              key={title}
              className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8"
            >
              <h3 className="text-2xl font-black">{title}</h3>

              <p className="mt-4 leading-7 text-zinc-400">
                {description}
              </p>
            </div>
          ))}

        </section>

        <section className="mt-20 rounded-[2rem] border border-yellow-400/20 bg-gradient-to-br from-yellow-400/10 to-black p-10 text-center">

          <Image
            src="/assets/gold-frame-64.png"
            alt="The Gold Frame"
            width={64}
            height={64}
            className="mx-auto"
          />

          <h2 className="mt-6 text-4xl font-black">
            Available inside Frame
          </h2>

          <p className="mx-auto mt-6 max-w-2xl leading-8 text-zinc-300">
            Creator Analytics is available exclusively inside the Frame mobile
            app for approved Gold Frame creators.
          </p>

          <p className="mx-auto mt-4 max-w-xl text-zinc-500">
            Sign in to the app to view your personal creator dashboard,
            engagement insights, creator score and future AI-powered analytics.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">

            <Link
              href="https://apps.apple.com/app/frame-creative-network/id6777236011"
              className="rounded-full bg-yellow-400 px-8 py-4 font-bold text-black transition hover:bg-yellow-300"
            >
              Download Frame
            </Link>

            <Link
              href="/golden-creator-hub"
              className="rounded-full border border-white/10 px-8 py-4 font-bold text-white transition hover:bg-white/10"
            >
              Return to Creator Hub
            </Link>

          </div>

        </section>

      </div>
    </main>
  );
}

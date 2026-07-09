import Link from "next/link";
import GoldenCreatorsSection from "@/components/GoldenCreatorsSection";

export default function GoldenCreatorHubPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="relative overflow-hidden px-6 py-28 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/20 via-black to-black" />

        <div className="relative z-10 mx-auto max-w-5xl">
          <p className="text-sm font-bold uppercase tracking-[0.45em] text-yellow-400">
            Golden Creator Collective
          </p>

          <h1 className="mt-6 text-5xl font-black leading-tight md:text-7xl">
            The creator hub for Frame’s founding creators.
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg text-zinc-300 md:text-2xl">
            Get access to creator tools, resources, competitions, early features
            and opportunities to help shape the future of Frame.
          </p>
<GoldenCreatorsSection />
<section className="mx-auto max-w-7xl px-6 py-28">
  <div className="text-center">
    <p className="text-sm font-bold uppercase tracking-[0.35em] text-yellow-400">
      Creator Hub Tools
    </p>

    <h2 className="mt-5 text-4xl font-black md:text-6xl">
      Inside The Gold Frame.
    </h2>

    <p className="mx-auto mt-5 max-w-2xl text-zinc-400">
      Golden Creators get access to tools designed to help them grow, create,
      learn and shape the future of Frame.
    </p>
  </div>

  <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    {[
      ["📊", "Creator Analytics", "View insights into your creative journey."],
      ["🏆", "Creator Achievements", "Unlock milestones as your creative journey grows."],
      ["👀", "Audience", "Understand who is discovering your work."],
      ["🎯", "Challenges", "Exclusive monthly creator challenges."],
      ["🎁", "Rewards", "Gold Frame member rewards."],
      ["🚀", "Early Access", "Try new Frame features before everyone else."],
      ["💬", "Creator Feedback", "Help shape the future of Frame."],
      ["💡", "Creator Tips", "Practical ideas to help build a loyal creative community."],
      ["🤖", "Frame Intelligence", "AI-powered creator insights and future growth tools."],
    ].map(([icon, title, body]) => (
      <div
        key={title}
        className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 transition-all duration-300 hover:-translate-y-1 hover:border-yellow-400/40 hover:bg-yellow-400/10"
      >
        <div className="text-4xl">{icon}</div>
        <h3 className="mt-6 text-2xl font-black text-white">{title}</h3>
        <p className="mt-4 leading-7 text-zinc-400">{body}</p>
      </div>
    ))}
  </div>
</section>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/#golden-creator-application"
              className="rounded-full bg-yellow-400 px-8 py-4 font-bold text-black hover:bg-yellow-300"
            >
              Apply to Join
            </Link>

            <Link
              href="https://apps.apple.com/app/frame-creative-network/id6777236011"
              className="rounded-full border border-white/20 px-8 py-4 font-bold text-white hover:bg-white/10"
            >
              Download Frame
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            [
              "Creator Tools",
              "Access tools built to help you grow, plan, create and improve your work inside Frame.",
            ],
            [
              "Early Feature Access",
              "Golden Creators help test new Frame features before they launch publicly.",
            ],
            [
              "Featured Opportunities",
              "Stand out across Frame with featured creator spots, competitions and community showcases.",
            ],
            [
              "Creator Resources",
              "Guides, ideas, prompts and resources to help you create more consistently.",
            ],
            [
              "Competitions",
              "Take part in creative challenges designed to spotlight great work from the community.",
            ],
            [
              "Shape Frame",
              "Give feedback directly and help influence what Frame becomes next.",
            ],
          ].map(([title, body]) => (
            <div
              key={title}
              className="rounded-3xl border border-white/10 bg-white/[0.04] p-8"
            >
              <h2 className="text-2xl font-black text-yellow-400">{title}</h2>
              <p className="mt-4 text-zinc-400">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-zinc-950 px-6 py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.35em] text-yellow-400">
              Inside the Hub
            </p>

            <h2 className="mt-5 text-4xl font-black md:text-6xl">
              More than a badge.
            </h2>

            <p className="mt-6 text-lg text-zinc-400">
              The Golden Creator Hub is where founding creators can access
              tools, resources, announcements, opportunities and future
              creator-only features.
            </p>
          </div>

          <div className="rounded-[2rem] border border-yellow-400/20 bg-gradient-to-br from-yellow-400/20 to-white/[0.03] p-8">
            <div className="rounded-[1.5rem] border border-white/10 bg-black/70 p-8">
              <p className="text-sm uppercase tracking-[0.25em] text-yellow-400">
                Golden Creator
              </p>

              <h3 className="mt-4 text-4xl font-black">
                Founder Badge
              </h3>

              <p className="mt-4 text-zinc-400">
                Golden Creators receive a founding badge inside Frame and early
                access to the Creator Hub.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-24 text-center">
        <h2 className="mx-auto max-w-4xl text-4xl font-black md:text-6xl">
          Want to become a Golden Creator?
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400">
          Apply to join the Golden Creator Collective and help build the future
          of Frame from the beginning.
        </p>

        <div className="mt-10">
          <Link
            href="/#golden-creator-application"
            className="rounded-full bg-yellow-400 px-10 py-4 text-lg font-bold text-black hover:bg-yellow-300"
          >
            Apply Now
          </Link>
        </div>
      </section>
    </main>
  );
}
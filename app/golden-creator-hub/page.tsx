import Link from "next/link";
import GoldenCreatorsSection from "@/components/GoldenCreatorsSection";

const creatorTools = [
  {
    icon: "📊",
    title: "Creator Analytics",
    body: "View insights into your creative journey.",
    href: "/golden-creator-hub/analytics",
    available: true,
  },
  {
    icon: "🏆",
    title: "Creator Achievements",
    body: "Unlock milestones as your creative journey grows.",
    href: "/golden-creator-hub/achievements",
    available: true,
  },
  {
    icon: "👀",
    title: "Audience",
    body: "Understand who is discovering your work.",
    available: false,
  },
  {
    icon: "🎯",
    title: "Challenges",
    body: "Exclusive monthly creator challenges.",
    available: false,
  },
  {
    icon: "🎁",
    title: "Rewards",
    body: "Gold Frame member rewards.",
    available: false,
  },
  {
    icon: "🚀",
    title: "Early Access",
    body: "Try new Frame features before everyone else.",
    available: false,
  },
  {
    icon: "💬",
    title: "Creator Feedback",
    body: "Help shape the future of Frame.",
    href: "/golden-creator-hub/feedback",
    available: true,
  },
  {
    icon: "💡",
    title: "Creator Tips",
    body: "Practical ideas to help build a loyal creative community.",
    available: false,
  },
  {
    icon: "🤖",
    title: "Frame Intelligence",
    body: "AI-powered creator insights and future growth tools.",
    available: false,
  },
];

const creatorBenefits = [
  {
    title: "Creator Tools",
    body: "Access tools built to help you grow, plan, create and improve your work inside Frame.",
  },
  {
    title: "Early Feature Access",
    body: "Golden Creators help test new Frame features before they launch publicly.",
  },
  {
    title: "Featured Opportunities",
    body: "Stand out across Frame with featured creator spots, competitions and community showcases.",
  },
  {
    title: "Creator Resources",
    body: "Guides, ideas, prompts and resources to help you create more consistently.",
  },
  {
    title: "Competitions",
    body: "Take part in creative challenges designed to spotlight great work from the community.",
  },
  {
    title: "Shape Frame",
    body: "Give feedback directly and help influence what Frame becomes next.",
  },
];

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
            The creator hub for Frame&apos;s founding creators.
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg text-zinc-300 md:text-2xl">
            Get access to creator tools, resources, competitions, early
            features and opportunities to help shape the future of Frame.
          </p>

          <GoldenCreatorsSection />

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/#golden-creator-application"
              className="rounded-full bg-yellow-400 px-8 py-4 font-bold text-black transition hover:bg-yellow-300"
            >
              Apply to Join
            </Link>

            <Link
              href="https://apps.apple.com/app/frame-creative-network/id6777236011"
              className="rounded-full border border-white/20 px-8 py-4 font-bold text-white transition hover:bg-white/10"
            >
              Download Frame
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-yellow-400">
            Creator Hub Tools
          </p>

          <h2 className="mt-5 text-4xl font-black md:text-6xl">
            Inside The Gold Frame.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-zinc-400">
            Golden Creators get access to tools designed to help them grow,
            create, learn and shape the future of Frame.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {creatorTools.map((tool) => {
            const cardContent = (
              <>
                <div className="flex items-start justify-between gap-4">
                  <div className="text-4xl">{tool.icon}</div>

                  {!tool.available && (
                    <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Coming soon
                    </span>
                  )}
                </div>

                <h3 className="mt-6 text-2xl font-black text-white">
                  {tool.title}
                </h3>

                <p className="mt-4 leading-7 text-zinc-400">{tool.body}</p>

                {tool.available && (
                  <div className="mt-7 inline-flex items-center gap-2 text-sm font-black text-yellow-400">
                    Open tool
                    <span aria-hidden="true">→</span>
                  </div>
                )}
              </>
            );

            if (tool.available && tool.href) {
              return (
                <Link
                  key={tool.title}
                  href={tool.href}
                  className="group rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 transition-all duration-300 hover:-translate-y-1 hover:border-yellow-400/50 hover:bg-yellow-400/10 hover:shadow-[0_18px_60px_rgba(250,204,21,0.10)] focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  {cardContent}
                </Link>
              );
            }

            return (
              <div
                key={tool.title}
                className="rounded-[2rem] border border-white/10 bg-white/[0.025] p-8 opacity-75"
              >
                {cardContent}
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-6 md:grid-cols-3">
          {creatorBenefits.map((benefit) => (
            <div
              key={benefit.title}
              className="rounded-3xl border border-white/10 bg-white/[0.04] p-8"
            >
              <h2 className="text-2xl font-black text-yellow-400">
                {benefit.title}
              </h2>

              <p className="mt-4 text-zinc-400">{benefit.body}</p>
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

              <h3 className="mt-4 text-4xl font-black">Founder Badge</h3>

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
            className="rounded-full bg-yellow-400 px-10 py-4 text-lg font-bold text-black transition hover:bg-yellow-300"
          >
            Apply Now
          </Link>
        </div>
      </section>
    </main>
  );
}
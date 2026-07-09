import Link from "next/link";
import Image from "next/image";

const achievements = [
  ["🥇", "Gold Frame Founder", "Accepted into The Gold Frame founding programme.", "Unlocked"],
  ["📷", "First Post", "Share your first creative post on Frame.", "Unlocked"],
  ["🎥", "First Video", "Upload your first creative video.", "Locked"],
  ["❤️", "10 Likes", "Receive your first 10 likes from the community.", "Unlocked"],
  ["🔥", "100 Likes", "Reach 100 total likes across your work.", "Locked"],
  ["💬", "Conversation Starter", "Start meaningful conversations through comments.", "Unlocked"],
  ["⭐", "Featured Creator", "Be selected as a featured creator on Frame.", "Locked"],
  ["🌍", "Community Builder", "Support and engage with other creators.", "Locked"],
  ["🚀", "Early Adopter", "Help shape Frame during the founding stage.", "Unlocked"],
];

export default function GoldFrameAchievementsPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <Link
          href="/golden-creator-hub"
          className="inline-flex rounded-full border border-white/10 px-5 py-3 text-sm font-bold text-zinc-300 hover:bg-white/10"
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
            Creator Achievements
          </p>

          <h1 className="mt-5 text-5xl font-black md:text-7xl">
            Celebrate every milestone.
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-zinc-400">
            Gold Frame achievements recognise creativity, consistency,
            contribution and community impact.
          </p>
        </section>

        <section className="mt-20 grid gap-6 md:grid-cols-3">
          {achievements.map(([icon, title, description, status]) => (
            <div
              key={title}
              className={`rounded-[2rem] border p-8 ${
                status === "Unlocked"
                  ? "border-yellow-400/30 bg-yellow-400/10"
                  : "border-white/10 bg-white/[0.04]"
              }`}
            >
              <div className="text-4xl">{icon}</div>
              <h3 className="mt-6 text-2xl font-black">{title}</h3>
              <p className="mt-4 leading-7 text-zinc-400">{description}</p>

              <span
                className={`mt-6 inline-flex rounded-full px-4 py-2 text-xs font-bold ${
                  status === "Unlocked"
                    ? "bg-yellow-400 text-black"
                    : "border border-white/10 text-zinc-400"
                }`}
              >
                {status}
              </span>
            </div>
          ))}
        </section>

        <section className="mt-20 rounded-[2rem] border border-yellow-400/20 bg-gradient-to-br from-yellow-400/10 to-black p-10 text-center">
          <h2 className="text-4xl font-black">Available inside Frame</h2>

          <p className="mx-auto mt-6 max-w-2xl leading-8 text-zinc-300">
            Personal achievement progress is available inside the Frame app for
            approved Gold Frame creators.
          </p>

          <div className="mt-10">
            <Link
              href="https://apps.apple.com/app/frame-creative-network/id6777236011"
              className="rounded-full bg-yellow-400 px-8 py-4 font-bold text-black hover:bg-yellow-300"
            >
              Open Frame
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
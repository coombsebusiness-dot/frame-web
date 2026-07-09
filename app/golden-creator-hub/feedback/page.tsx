import Link from "next/link";
import Image from "next/image";

const feedbackTypes = [
  ["💡", "Feature Request", "Suggest a new tool or improvement."],
  ["🐞", "Bug Report", "Tell us about something not working."],
  ["🎨", "Creator Idea", "Share an idea for the creative community."],
  ["❤️", "General Feedback", "Tell us what you think about Frame."],
];

export default function GoldFrameFeedbackPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-20">
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
            Creator Feedback
          </p>

          <h1 className="mt-5 text-5xl font-black md:text-7xl">
            Help shape Frame.
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-zinc-400">
            Gold Frame creators help guide what Frame becomes next. Share ideas,
            report issues, suggest improvements or tell us what would make the
            platform better for creators.
          </p>
        </section>

        <section className="mt-20 grid gap-6 md:grid-cols-2">
          {feedbackTypes.map(([icon, title, description]) => (
            <div
              key={title}
              className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8"
            >
              <div className="text-4xl">{icon}</div>
              <h3 className="mt-6 text-2xl font-black">{title}</h3>
              <p className="mt-4 leading-7 text-zinc-400">{description}</p>
            </div>
          ))}
        </section>

        <section className="mt-20 rounded-[2rem] border border-yellow-400/20 bg-gradient-to-br from-yellow-400/10 to-black p-10">
          <h2 className="text-4xl font-black">Submit feedback</h2>

          <p className="mt-4 max-w-2xl text-zinc-400">
            The full creator feedback portal is available inside the Frame app
            for approved Gold Frame creators.
          </p>

          <div className="mt-10 grid gap-5">
            <input
              disabled
              placeholder="Feedback title"
              className="rounded-2xl border border-white/10 bg-black px-5 py-4 text-white placeholder:text-zinc-600"
            />

            <textarea
              disabled
              placeholder="Tell us more..."
              rows={6}
              className="rounded-2xl border border-white/10 bg-black px-5 py-4 text-white placeholder:text-zinc-600"
            />

            <button
              disabled
              className="rounded-2xl bg-zinc-800 px-6 py-4 font-bold text-zinc-500"
            >
              Available inside Frame
            </button>
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="https://apps.apple.com/app/frame-creative-network/id6777236011"
              className="rounded-full bg-yellow-400 px-8 py-4 font-bold text-black hover:bg-yellow-300"
            >
              Open Frame
            </Link>

            <Link
              href="/golden-creator-hub"
              className="rounded-full border border-white/10 px-8 py-4 font-bold text-white hover:bg-white/10"
            >
              Return to Creator Hub
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
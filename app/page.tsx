"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [submitting, setSubmitting] = useState(false);
const [submitted, setSubmitted] = useState(false);

async function handleGoldenCreatorSubmit(
  e: React.FormEvent<HTMLFormElement>
) {
  e.preventDefault();
  setSubmitting(true);

  const formData = new FormData(e.currentTarget);

  const { error } = await supabase
    .from("golden_creator_applications")
    .insert({
      first_name: formData.get("first_name"),
      last_name: formData.get("last_name"),
      email: formData.get("email"),
      country: formData.get("country"),
      creator_type: formData.get("creator_type"),
      instagram: formData.get("instagram"),
      website: formData.get("website"),
      bio: formData.get("bio"),
      reason: formData.get("reason"),
    });

  setSubmitting(false);

  if (error) {
    alert("Something went wrong. Please try again.");
    console.error(error);
    return;
  }

  setSubmitted(true);
  e.currentTarget.reset();
}
  return (
    <main className="min-h-screen bg-black text-white">
      <nav className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/frame-icon.png"
              alt="Frame"
              width={40}
              height={40}
              className="rounded-xl"
            />
            <span className="text-lg font-bold tracking-wide">FRAME</span>
          </Link>

          <div className="hidden items-center gap-8 text-sm text-zinc-300 md:flex">
            <Link href="/explore" className="hover:text-white">Explore</Link>
            <Link href="/login" className="hover:text-white">Login</Link>
            <Link
              href="https://apps.apple.com/app/frame-creative-network/id6777236011"
              className="rounded-full bg-white px-5 py-2 font-semibold text-black hover:bg-zinc-200"
            >
              Download
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 text-center">
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-55"
          src="/videos/frame-hero.mp4"
          autoPlay
          muted
          loop
          playsInline
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/70 to-black" />

        <div className="relative z-10 mx-auto max-w-5xl pt-24">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.45em] text-yellow-400">
            Frame Creative Network
          </p>

          <h1 className="text-5xl font-black leading-tight md:text-7xl">
            Where creativity finds its home.
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg text-zinc-200 md:text-2xl">
            Join photographers, filmmakers, artists and creators building a
            community where creativity comes first.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="https://apps.apple.com/app/frame-creative-network/id6777236011"
              className="rounded-full bg-yellow-400 px-8 py-4 text-base font-bold text-black hover:bg-yellow-300"
            >
              Download Frame
            </Link>

            <Link
              href="/explore"
              className="rounded-full border border-white/25 px-8 py-4 text-base font-bold text-white hover:bg-white/10"
            >
              Explore the Network
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-yellow-400">
            Why Frame exists
          </p>
          <h2 className="mt-5 text-4xl font-black md:text-6xl">
            Social media forgot about creativity.
          </h2>
          <p className="mt-6 text-lg text-zinc-400">
            Frame is built for photographers, filmmakers, artists, designers and
            visual storytellers who want something more meaningful than chasing
            algorithms.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {[
            ["Share your work", "Post photos, videos and creative projects in a space built for visual creators."],
            ["Tell the story", "Use captions, stories and behind-the-shot details to give your work more meaning."],
            ["Find your people", "Discover creators, follow their journey and build real creative connections."],
          ].map(([title, body]) => (
            <div
              key={title}
              className="rounded-3xl border border-white/10 bg-white/[0.04] p-8"
            >
              <h3 className="text-2xl font-bold">{title}</h3>
              <p className="mt-4 text-zinc-400">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-zinc-950 px-6 py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-yellow-400">
              Meet the Founder
            </p>

            <h2 className="mt-5 text-4xl font-black md:text-6xl">
              Why I built Frame.
            </h2>

            <p className="mt-6 text-lg leading-8 text-zinc-400">
              Frame was built by a photographer who wanted a better place for
              creatives to share their work, connect with others, and build
              something meaningful together.
            </p>
          </div>

          <div className="mt-14 overflow-hidden rounded-3xl border border-white/10 bg-black shadow-2xl">
            <video
              className="w-full"
              controls
              preload="metadata"
              playsInline
            >
              <source src="/videos/frame-landing.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-black px-6 py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-yellow-400">
              Frame Studio
            </p>
            <h2 className="mt-5 text-4xl font-black md:text-6xl">
              Create, edit and share in one place.
            </h2>
            <p className="mt-6 text-lg text-zinc-400">
              Frame Studio gives creators built-in tools for editing photos and
              videos before sharing them with the community.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-black p-4 shadow-2xl">

  <div className="overflow-hidden rounded-[1.5rem]">

    <video
      className="w-full rounded-[1.5rem]"
      src="/videos/frame-demo.mp4"
      autoPlay
      muted
      loop
      playsInline
    />

  </div>

</div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            ["Photo Feed", "Share finished work, projects, edits and daily creative moments."],
            ["Video Feed", "Post cinematic clips, reels and creative process videos."],
            ["Stories", "Show what you're making right now with quick photo and video stories."],
          ].map(([title, body]) => (
            <div
              key={title}
              className="min-h-72 rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-8"
            >
              <h3 className="text-3xl font-black">{title}</h3>
              <p className="mt-4 text-zinc-400">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-b from-yellow-500 to-yellow-700 px-6 py-24 text-black">
  <div className="mx-auto max-w-5xl text-center">

    <p className="text-sm font-bold uppercase tracking-[0.35em]">
      Golden Creator Hub
    </p>

    <h2 className="mt-5 text-4xl font-black md:text-6xl">
      Everything creators need.
      <br />
      All in one place.
    </h2>

    <p className="mx-auto mt-8 max-w-3xl text-xl text-black/80 leading-8">
      Join Frame Gold, As Early Access Creator, and unlock exclusive access to the
      Golden Creator Hub — a growing collection of creator tools,
      resources, collaborations, educational content,
      exclusive competitions and early access to new Frame features.
    </p>

    <div className="mt-12 grid gap-6 md:grid-cols-3 text-left">

      <div className="rounded-3xl bg-black/10 p-6 backdrop-blur">
        <h3 className="text-2xl font-bold">Creator Tools</h3>
        <p className="mt-3">
          Powerful tools and resources to help you grow as a creator.
        </p>
      </div>

      <div className="rounded-3xl bg-black/10 p-6 backdrop-blur">
        <h3 className="text-2xl font-bold">Exclusive Perks</h3>
        <p className="mt-3">
          Discounts, competitions, collaborations and member-only opportunities.
        </p>
      </div>

      <div className="rounded-3xl bg-black/10 p-6 backdrop-blur">
        <h3 className="text-2xl font-bold">Early Access</h3>
        <p className="mt-3">
          Be the first to test new Frame features before anyone else.
        </p>
      </div>

    </div>
    <section className="bg-black px-6 py-28">
  <div className="mx-auto max-w-4xl">
    <div className="text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-yellow-400">
        Applications Open
      </p>

      <h2 className="mt-5 text-4xl font-black md:text-6xl">
        Apply to join the Golden Creator Collective.
      </h2>

      <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400">
        We are not looking for the biggest creators. We are looking for
        passionate creatives who want to help build a better creative community.
      </p>
    </div>

    {submitted ? (
      <div className="mt-14 rounded-3xl border border-yellow-400/30 bg-yellow-400/10 p-10 text-center">
        <h3 className="text-3xl font-black text-yellow-400">
          Application received.
        </h3>
        <p className="mt-4 text-zinc-300">
          Thank you for applying. We will review your application and get back
          to you soon.
        </p>
      </div>
    ) : (
      <form
        onSubmit={handleGoldenCreatorSubmit}
        className="mt-14 grid gap-5 rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-10"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <input name="first_name" required placeholder="First name" className="rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none placeholder:text-zinc-500" />
          <input name="last_name" required placeholder="Last name" className="rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none placeholder:text-zinc-500" />
        </div>

        <input name="email" type="email" required placeholder="Email address" className="rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none placeholder:text-zinc-500" />

        <div className="grid gap-5 md:grid-cols-2">
          <input name="country" placeholder="Country" className="rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none placeholder:text-zinc-500" />

          <select name="creator_type" required className="rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none">
            <option value="">What do you create?</option>
            <option>Photography</option>
            <option>Videography</option>
            <option>Film Photography</option>
            <option>Digital Art</option>
            <option>Illustration</option>
            <option>Design</option>
            <option>Other</option>
          </select>
        </div>

        <input name="instagram" placeholder="Instagram / social link" className="rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none placeholder:text-zinc-500" />
        <input name="website" placeholder="Website or portfolio" className="rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none placeholder:text-zinc-500" />

        <textarea name="bio" placeholder="Tell us about yourself" rows={4} className="rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none placeholder:text-zinc-500" />

        <textarea name="reason" placeholder="Why would you like to become a Golden Creator?" rows={4} className="rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none placeholder:text-zinc-500" />

        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-yellow-400 px-8 py-4 text-lg font-bold text-black hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Submitting..." : "Apply Now"}
        </button>
      </form>
    )}
  </div>
</section>

  </div>
</section>

      <section className="px-6 py-28 text-center">
        <h2 className="mx-auto max-w-4xl text-4xl font-black md:text-6xl">
          Ready to join a creative network built differently?
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400">
          Download Frame and become part of a growing community of creatives.
        </p>

        <div className="mt-10">
          <Link
            href="https://apps.apple.com/app/frame-creative-network/id6777236011"
            className="rounded-full bg-white px-10 py-4 text-lg font-bold text-black hover:bg-zinc-200"
          >
            Download Frame
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-10 text-center text-sm text-zinc-500">
        © {new Date().getFullYear()} Frame Creative Network. All rights reserved.
      </footer>
    </main>
  );
}
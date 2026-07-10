"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type AnalyticsData = {
  creatorName: string;
  postsCount: number;
  videosCount: number;
  storiesCount: number;
  followersCount: number;
  likesCount: number;
  commentsCount: number;
  totalEngagement: number;
  engagementRate: number;
  creatorScore: number;
};

export default function GoldFrameAnalyticsPage() {
  const router = useRouter();

  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function loadAnalytics() {
    setLoading(true);
    setErrorMessage("");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      router.replace("/login");
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select(
        "id, username, display_name, avatar_url, is_founding_creator"
      )
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      setErrorMessage("We could not load your creator profile.");
      setLoading(false);
      return;
    }

    if (!profile.is_founding_creator) {
      router.replace("/golden-creator-hub");
      return;
    }

    const [postsResult, storiesResult, followersResult] =
      await Promise.all([
        supabase
          .from("posts")
          .select("id, media_type")
          .eq("user_id", user.id),

        supabase
          .from("stories")
          .select("id", {
            count: "exact",
            head: true,
          })
          .eq("user_id", user.id),

        supabase
          .from("follows")
          .select("id", {
            count: "exact",
            head: true,
          })
          .eq("following_id", user.id),
      ]);

    const posts = postsResult.data ?? [];
    const postIds = posts.map((post) => post.id);

    const postsCount = posts.length;

    const videosCount = posts.filter(
      (post) => post.media_type === "video"
    ).length;

    let likesCount = 0;
    let commentsCount = 0;

    if (postIds.length > 0) {
      const [likesResult, commentsResult] = await Promise.all([
        supabase
          .from("likes")
          .select("id", {
            count: "exact",
            head: true,
          })
          .in("post_id", postIds),

        supabase
          .from("comments")
          .select("id", {
            count: "exact",
            head: true,
          })
          .in("post_id", postIds),
      ]);

      likesCount = likesResult.count ?? 0;
      commentsCount = commentsResult.count ?? 0;
    }

    const storiesCount = storiesResult.count ?? 0;
    const followersCount = followersResult.count ?? 0;
    const totalEngagement = likesCount + commentsCount;

    const engagementRate =
      postsCount > 0
        ? Math.round((totalEngagement / postsCount) * 10) / 10
        : 0;

    const creatorScore = Math.min(
      100,
      Math.round(
        postsCount * 2 +
          videosCount * 3 +
          storiesCount +
          followersCount +
          totalEngagement
      )
    );

    setAnalytics({
      creatorName:
        profile.display_name ||
        profile.username ||
        "Golden Creator",
      postsCount,
      videosCount,
      storiesCount,
      followersCount,
      likesCount,
      commentsCount,
      totalEngagement,
      engagementRate,
      creatorScore,
    });

    setLoading(false);
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-center">
          <Image
            src="/assets/gold-frame-64.png"
            alt=""
            width={64}
            height={64}
            className="mx-auto animate-pulse"
          />

          <p className="mt-5 text-zinc-400">
            Loading your creator analytics...
          </p>
        </div>
      </main>
    );
  }

  if (errorMessage || !analytics) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
        <div className="max-w-lg text-center">
          <h1 className="text-3xl font-black">
            Analytics unavailable
          </h1>

          <p className="mt-4 text-zinc-400">
            {errorMessage ||
              "We could not load your creator analytics."}
          </p>

          <Link
            href="/golden-creator-hub"
            className="mt-8 inline-flex rounded-full bg-yellow-400 px-7 py-3 font-bold text-black"
          >
            Return to Creator Hub
          </Link>
        </div>
      </main>
    );
  }

  const cards = [
    {
      title: "Posts",
      value: analytics.postsCount,
      description: "Your total published work",
    },
    {
      title: "Videos",
      value: analytics.videosCount,
      description: "Creative videos published",
    },
    {
      title: "Stories",
      value: analytics.storiesCount,
      description: "Stories shared with the community",
    },
    {
      title: "Followers",
      value: analytics.followersCount,
      description: "Creators following your journey",
    },
    {
      title: "Total Engagement",
      value: analytics.totalEngagement,
      description: `${analytics.likesCount} likes and ${analytics.commentsCount} comments`,
    },
    {
      title: "Creator Score",
      value: analytics.creatorScore,
      description: "Your overall Frame activity score",
    },
  ];

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
            priority
          />

          <p className="mt-8 text-sm font-bold uppercase tracking-[0.4em] text-yellow-400">
            Creator Analytics
          </p>

          <h1 className="mt-5 text-5xl font-black md:text-7xl">
            Welcome back, {analytics.creatorName}.
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-zinc-400">
            Track your creative growth, audience engagement and
            community impact across Frame.
          </p>
        </section>

        <section className="mt-20 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <div
              key={card.title}
              className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8"
            >
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-zinc-500">
                {card.title}
              </p>

              <p className="mt-5 text-5xl font-black text-yellow-400">
                {card.value}
              </p>

              <p className="mt-4 leading-7 text-zinc-400">
                {card.description}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-20 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-yellow-400/20 bg-gradient-to-br from-yellow-400/10 to-black p-10">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-yellow-400">
              Engagement
            </p>

            <p className="mt-6 text-6xl font-black">
              {analytics.engagementRate}
            </p>

            <p className="mt-3 text-zinc-400">
              Average likes and comments received per post.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
                <p className="text-3xl font-black text-yellow-400">
                  {analytics.likesCount}
                </p>

                <p className="mt-2 text-sm text-zinc-500">
                  Likes received
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
                <p className="text-3xl font-black text-yellow-400">
                  {analytics.commentsCount}
                </p>

                <p className="mt-2 text-sm text-zinc-500">
                  Comments received
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-10">
            <div className="flex items-center gap-4">
              <Image
                src="/assets/gold-frame-64.png"
                alt=""
                width={52}
                height={52}
              />

              <div>
                <p className="text-sm font-bold uppercase tracking-[0.25em] text-yellow-400">
                  Frame Creator Score
                </p>

                <p className="mt-1 text-sm text-zinc-500">
                  Activity and community contribution
                </p>
              </div>
            </div>

            <div className="mt-8 flex items-end gap-2">
              <p className="text-7xl font-black">
                {analytics.creatorScore}
              </p>

              <p className="pb-2 text-xl font-bold text-zinc-500">
                / 100
              </p>
            </div>

            <div className="mt-8 h-3 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-200"
                style={{
                  width: `${analytics.creatorScore}%`,
                }}
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
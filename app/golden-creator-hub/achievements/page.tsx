"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type CreatorStats = {
  posts: number;
  videos: number;
  stories: number;
  followers: number;
  likesReceived: number;
  commentsMade: number;
  isGoldenCreator: boolean;
};

type Achievement = {
  id: string;
  icon: string;
  title: string;
  description: string;
  unlocked: boolean;
  current: number;
  target: number;
  progressLabel: string;
};

export default function GoldFrameAchievementsPage() {
  const router = useRouter();

  const [creatorName, setCreatorName] = useState("Golden Creator");
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadAchievements();
  }, []);

  async function loadAchievements() {
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
      .select("id, username, display_name, is_founding_creator")
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

    setCreatorName(
      profile.display_name ||
        profile.username ||
        "Golden Creator"
    );

    const [
      postsResult,
      storiesResult,
      followersResult,
      commentsMadeResult,
    ] = await Promise.all([
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

      supabase
        .from("comments")
        .select("id", {
          count: "exact",
          head: true,
        })
        .eq("user_id", user.id),
    ]);

    const posts = postsResult.data ?? [];
    const postIds = posts.map((post) => post.id);

    const postCount = posts.length;

    const videoCount = posts.filter(
      (post) => post.media_type === "video"
    ).length;

    let likesReceived = 0;

    if (postIds.length > 0) {
      const likesResult = await supabase
        .from("likes")
        .select("id", {
          count: "exact",
          head: true,
        })
        .in("post_id", postIds);

      likesReceived = likesResult.count ?? 0;
    }

    const stats: CreatorStats = {
      posts: postCount,
      videos: videoCount,
      stories: storiesResult.count ?? 0,
      followers: followersResult.count ?? 0,
      likesReceived,
      commentsMade: commentsMadeResult.count ?? 0,
      isGoldenCreator:
        profile.is_founding_creator === true,
    };

    setAchievements(buildAchievements(stats));
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
            Loading your achievements...
          </p>
        </div>
      </main>
    );
  }

  if (errorMessage) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
        <div className="max-w-lg text-center">
          <h1 className="text-3xl font-black">
            Achievements unavailable
          </h1>

          <p className="mt-4 text-zinc-400">
            {errorMessage}
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

  const unlockedCount = achievements.filter(
    (achievement) => achievement.unlocked
  ).length;

  const completionPercentage =
    achievements.length > 0
      ? Math.round(
          (unlockedCount / achievements.length) * 100
        )
      : 0;

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <Link
          href="/golden-creator-hub"
          className="inline-flex rounded-full border border-white/10 px-5 py-3 text-sm font-bold text-zinc-300 transition hover:bg-white/10"
        >
          ← Back to The Gold Frame
        </Link>

        <section className="mt-16 text-center">
          <div className="relative mx-auto h-32 w-32">
            <div className="absolute inset-0 rounded-full bg-yellow-400/20 blur-2xl" />

            <Image
              src="/assets/gold-frame-512.png"
              alt="The Gold Frame"
              width={120}
              height={120}
              className="relative mx-auto"
              priority
            />
          </div>

          <p className="mt-8 text-sm font-bold uppercase tracking-[0.4em] text-yellow-400">
            Creator Achievements
          </p>

          <h1 className="mt-5 text-5xl font-black md:text-7xl">
            Celebrate every milestone.
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-zinc-400">
            Welcome, {creatorName}. Your achievements update
            automatically as your creative journey grows.
          </p>
        </section>

        <section className="mt-16 rounded-[2rem] border border-yellow-400/20 bg-gradient-to-br from-yellow-400/10 to-black p-8 md:p-10">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-yellow-400">
                Achievement Progress
              </p>

              <h2 className="mt-4 text-4xl font-black">
                {unlockedCount} of {achievements.length} unlocked
              </h2>

              <p className="mt-3 text-zinc-400">
                Keep creating, sharing and supporting the Frame
                community.
              </p>
            </div>

            <div className="text-left md:text-right">
              <p className="text-6xl font-black text-yellow-400">
                {completionPercentage}%
              </p>

              <p className="mt-2 text-sm text-zinc-500">
                Collection complete
              </p>
            </div>
          </div>

          <div className="mt-8 h-3 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-yellow-700 via-yellow-400 to-yellow-200 transition-all duration-700"
              style={{
                width: `${completionPercentage}%`,
              }}
            />
          </div>
        </section>

        <section className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {achievements.map((achievement) => {
            const progressPercentage = achievement.unlocked
              ? 100
              : Math.min(
                  100,
                  Math.round(
                    (achievement.current /
                      achievement.target) *
                      100
                  )
                );

            return (
              <article
                key={achievement.id}
                className={`relative overflow-hidden rounded-[2rem] border p-8 transition-all duration-300 ${
                  achievement.unlocked
                    ? "border-yellow-400/40 bg-gradient-to-br from-yellow-400/15 to-white/[0.03] shadow-[0_18px_60px_rgba(250,204,21,0.08)]"
                    : "border-white/10 bg-white/[0.03]"
                }`}
              >
                {achievement.unlocked && (
                  <div className="absolute right-0 top-0 h-32 w-32 translate-x-1/3 -translate-y-1/3 rounded-full bg-yellow-400/10 blur-2xl" />
                )}

                <div className="relative">
                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-2xl text-4xl ${
                      achievement.unlocked
                        ? "border border-yellow-400/30 bg-yellow-400/10"
                        : "border border-white/10 bg-black/40 grayscale"
                    }`}
                  >
                    {achievement.icon}
                  </div>

                  <h3
                    className={`mt-6 text-2xl font-black ${
                      achievement.unlocked
                        ? "text-white"
                        : "text-zinc-400"
                    }`}
                  >
                    {achievement.title}
                  </h3>

                  <p className="mt-4 min-h-14 leading-7 text-zinc-400">
                    {achievement.description}
                  </p>

                  <div className="mt-7 flex items-center justify-between gap-4">
                    <span
                      className={`inline-flex rounded-full px-4 py-2 text-xs font-black uppercase tracking-wider ${
                        achievement.unlocked
                          ? "bg-yellow-400 text-black"
                          : "border border-white/10 text-zinc-500"
                      }`}
                    >
                      {achievement.unlocked
                        ? "Unlocked"
                        : "Locked"}
                    </span>

                    <span className="text-sm font-bold text-zinc-500">
                      {achievement.progressLabel}
                    </span>
                  </div>

                  <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        achievement.unlocked
                          ? "bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-200"
                          : "bg-zinc-600"
                      }`}
                      style={{
                        width: `${progressPercentage}%`,
                      }}
                    />
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        <section className="mt-20 rounded-[2rem] border border-white/10 bg-white/[0.03] p-10 text-center">
          <Image
            src="/assets/gold-frame-64.png"
            alt="The Gold Frame"
            width={64}
            height={64}
            className="mx-auto"
          />

          <h2 className="mt-6 text-4xl font-black">
            Your journey is only beginning
          </h2>

          <p className="mx-auto mt-6 max-w-2xl leading-8 text-zinc-400">
            New achievements will be added as Frame grows,
            including creator challenges, competition awards and
            community milestones.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/upload"
              className="rounded-full bg-yellow-400 px-8 py-4 font-bold text-black transition hover:bg-yellow-300"
            >
              Create a Post
            </Link>

            <Link
              href="/golden-creator-hub/analytics"
              className="rounded-full border border-white/10 px-8 py-4 font-bold text-white transition hover:bg-white/10"
            >
              View Analytics
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

function buildAchievements(
  stats: CreatorStats
): Achievement[] {
  return [
    {
      id: "gold-frame-founder",
      icon: "🥇",
      title: "Gold Frame Founder",
      description:
        "Accepted into The Gold Frame founding programme.",
      unlocked: stats.isGoldenCreator,
      current: stats.isGoldenCreator ? 1 : 0,
      target: 1,
      progressLabel: stats.isGoldenCreator
        ? "Complete"
        : "0 / 1",
    },
    {
      id: "first-post",
      icon: "📷",
      title: "First Post",
      description:
        "Share your first creative post on Frame.",
      unlocked: stats.posts >= 1,
      current: stats.posts,
      target: 1,
      progressLabel:
        stats.posts >= 1
          ? "Complete"
          : `${stats.posts} / 1`,
    },
    {
      id: "first-video",
      icon: "🎥",
      title: "First Video",
      description:
        "Upload your first creative video.",
      unlocked: stats.videos >= 1,
      current: stats.videos,
      target: 1,
      progressLabel:
        stats.videos >= 1
          ? "Complete"
          : `${stats.videos} / 1`,
    },
    {
      id: "ten-likes",
      icon: "❤️",
      title: "10 Likes",
      description:
        "Receive 10 likes from the Frame community.",
      unlocked: stats.likesReceived >= 10,
      current: stats.likesReceived,
      target: 10,
      progressLabel: `${Math.min(
        stats.likesReceived,
        10
      )} / 10`,
    },
    {
      id: "hundred-likes",
      icon: "🔥",
      title: "100 Likes",
      description:
        "Reach 100 total likes across your creative work.",
      unlocked: stats.likesReceived >= 100,
      current: stats.likesReceived,
      target: 100,
      progressLabel: `${Math.min(
        stats.likesReceived,
        100
      )} / 100`,
    },
    {
      id: "conversation-starter",
      icon: "💬",
      title: "Conversation Starter",
      description:
        "Contribute 5 comments to creative conversations.",
      unlocked: stats.commentsMade >= 5,
      current: stats.commentsMade,
      target: 5,
      progressLabel: `${Math.min(
        stats.commentsMade,
        5
      )} / 5`,
    },
    {
      id: "storyteller",
      icon: "📖",
      title: "Storyteller",
      description:
        "Share your first Frame story.",
      unlocked: stats.stories >= 1,
      current: stats.stories,
      target: 1,
      progressLabel:
        stats.stories >= 1
          ? "Complete"
          : `${stats.stories} / 1`,
    },
    {
      id: "community-builder",
      icon: "🌍",
      title: "Community Builder",
      description:
        "Grow your creative community to 10 followers.",
      unlocked: stats.followers >= 10,
      current: stats.followers,
      target: 10,
      progressLabel: `${Math.min(
        stats.followers,
        10
      )} / 10`,
    },
    {
      id: "early-adopter",
      icon: "🚀",
      title: "Early Adopter",
      description:
        "Help shape Frame during its founding stage.",
      unlocked: stats.isGoldenCreator,
      current: stats.isGoldenCreator ? 1 : 0,
      target: 1,
      progressLabel: stats.isGoldenCreator
        ? "Complete"
        : "0 / 1",
    },
  ];
}
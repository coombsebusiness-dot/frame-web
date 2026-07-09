"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

type UserProfile = {
  id: string;
  username?: string | null;
  full_name?: string | null;
  email?: string | null;
  bio?: string | null;
  avatar_url?: string | null;
  created_at?: string | null;
};

type Post = {
  id: string;
  created_at: string;
  caption?: string | null;
  image_url?: string | null;
  media_url?: string | null;
  video_url?: string | null;
  media_type?: string | null;
};

type UserStats = {
  posts: number;
  videos: number;
  stories: number;
  reports: number;
};

export default function AdminUserDetailPage() {
  const params = useParams();
  const userId = params.id as string;

  const [user, setUser] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [stats, setStats] = useState<UserStats>({
    posts: 0,
    videos: 0,
    stories: 0,
    reports: 0,
  });
  const [loading, setLoading] = useState(true);

  async function loadUser() {
    setLoading(true);

    const [
      userRes,
      recentPostsRes,
      postsCountRes,
      videosCountRes,
      storiesCountRes,
      reportsCountRes,
    ] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", userId).single(),

      supabase
        .from("posts")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(6),

      supabase
        .from("posts")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId),

      supabase
        .from("posts")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("media_type", "video"),

      supabase
        .from("stories")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId),

      supabase
        .from("reports")
        .select("id", { count: "exact", head: true })
        .or(`user_id.eq.${userId},reported_user_id.eq.${userId}`),
    ]);

    if (!userRes.error) setUser(userRes.data);
    if (!recentPostsRes.error) setPosts(recentPostsRes.data || []);

    setStats({
      posts: postsCountRes.count || 0,
      videos: videosCountRes.count || 0,
      stories: storiesCountRes.count || 0,
      reports: reportsCountRes.count || 0,
    });

    setLoading(false);
  }

  useEffect(() => {
    if (userId) loadUser();
  }, [userId]);

  if (loading) {
    return <p className="text-zinc-400">Loading user profile...</p>;
  }

  if (!user) {
    return (
      <div>
        <h2 className="text-4xl font-black">User not found</h2>
        <Link
          href="/admin/users"
          className="mt-6 inline-block rounded-full bg-yellow-400 px-6 py-3 font-bold text-black"
        >
          Back to users
        </Link>
      </div>
    );
  }

  return (
    <>
      <Link
        href="/admin/users"
        className="mb-8 inline-block rounded-full border border-white/10 px-5 py-3 text-sm font-bold text-white hover:bg-white/10"
      >
        Back to Users
      </Link>

      <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-center">
          <div className="h-28 w-28 overflow-hidden rounded-3xl border border-white/10 bg-zinc-900">
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-4xl font-black text-yellow-400">
                {(user.username || user.full_name || "U")[0].toUpperCase()}
              </div>
            )}
          </div>

          <div className="flex-1">
            <p className="text-sm uppercase tracking-[0.35em] text-yellow-400">
              User Profile
            </p>

            <h1 className="mt-3 text-4xl font-black md:text-6xl">
              {user.username || user.full_name || "Unnamed user"}
            </h1>

            <p className="mt-3 text-zinc-400">{user.email || user.id}</p>

            {user.bio && (
              <p className="mt-5 max-w-3xl text-zinc-300">{user.bio}</p>
            )}

            <p className="mt-4 text-sm text-zinc-500">
              Joined:{" "}
              {user.created_at
                ? new Date(user.created_at).toLocaleString()
                : "Unknown"}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-4">
        <StatCard title="Posts" value={stats.posts} />
        <StatCard title="Videos" value={stats.videos} />
        <StatCard title="Stories" value={stats.stories} />
        <StatCard
          title="Reports"
          value={stats.reports}
          danger={stats.reports > 0}
        />
      </section>

      <section className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-3xl font-black">Recent Posts</h2>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {posts.length === 0 ? (
              <EmptyState text="No recent posts." />
            ) : (
              posts.map((post) => {
                const media = post.video_url || post.media_url || post.image_url;

                return (
                  <div
                    key={post.id}
                    className="overflow-hidden rounded-2xl border border-white/10 bg-black"
                  >
                    {media ? (
                      post.media_type === "video" ? (
                        <video
                          src={media}
                          className="h-56 w-full object-cover"
                          controls
                        />
                      ) : (
                        <img
                          src={media}
                          alt=""
                          className="h-56 w-full object-cover"
                        />
                      )
                    ) : (
                      <div className="flex h-56 items-center justify-center text-zinc-500">
                        No media
                      </div>
                    )}

                    <div className="p-4">
                      <p className="line-clamp-3 text-sm text-zinc-300">
                        {post.caption || "No caption"}
                      </p>
                      <p className="mt-3 text-xs text-zinc-500">
                        {post.created_at
                          ? new Date(post.created_at).toLocaleString()
                          : ""}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <aside className="grid gap-6">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-2xl font-black">Community Health</h2>

            <div
              className={`mt-5 rounded-2xl border p-5 ${
                stats.reports > 0
                  ? "border-red-500/30 bg-red-500/10"
                  : "border-green-500/30 bg-green-500/10"
              }`}
            >
              <p
                className={`text-2xl font-black ${
                  stats.reports > 0 ? "text-red-400" : "text-green-400"
                }`}
              >
                {stats.reports > 0 ? "Needs Review" : "Excellent"}
              </p>

              <p className="mt-2 text-sm text-zinc-400">
                {stats.reports > 0
                  ? "This user has reports connected to their account."
                  : "No reports connected to this user."}
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-2xl font-black">Moderator Actions</h2>

            <div className="mt-5 flex flex-col gap-3">
              <button className="rounded-2xl bg-yellow-400 px-5 py-3 font-bold text-black hover:bg-yellow-300">
                View Public Profile
              </button>

              <button className="rounded-2xl border border-white/10 px-5 py-3 font-bold text-white hover:bg-white/10">
                Send Email
              </button>

              <button className="rounded-2xl border border-white/10 px-5 py-3 font-bold text-white hover:bg-white/10">
                Suspend User
              </button>

              <button className="rounded-2xl bg-red-500 px-5 py-3 font-bold text-white hover:bg-red-400">
                Delete User
              </button>
            </div>
          </div>
        </aside>
      </section>
    </>
  );
}

function StatCard({
  title,
  value,
  danger = false,
}: {
  title: string;
  value: number;
  danger?: boolean;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
      <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
        {title}
      </p>

      <p
        className={`mt-3 text-4xl font-black ${
          danger ? "text-red-400" : "text-yellow-400"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-zinc-500">
      {text}
    </div>
  );
}
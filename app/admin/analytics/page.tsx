"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type AnalyticsStats = {
  users: number;
  posts: number;
  videos: number;
  stories: number;
  applications: number;
  reports: number;
};

export default function AnalyticsPage() {
  const [stats, setStats] = useState<AnalyticsStats>({
    users: 0,
    posts: 0,
    videos: 0,
    stories: 0,
    applications: 0,
    reports: 0,
  });

  const [loading, setLoading] = useState(true);

  async function loadAnalytics() {
    setLoading(true);

    const [
      usersRes,
      postsRes,
      videosRes,
      storiesRes,
      applicationsRes,
      reportsRes,
    ] = await Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("posts").select("id", { count: "exact", head: true }),
      supabase
        .from("posts")
        .select("id", { count: "exact", head: true })
        .eq("media_type", "video"),
      supabase.from("stories").select("id", { count: "exact", head: true }),
      supabase
        .from("golden_creator_applications")
        .select("id", { count: "exact", head: true }),
      supabase.from("reports").select("id", { count: "exact", head: true }),
    ]);

    setStats({
      users: usersRes.count || 0,
      posts: postsRes.count || 0,
      videos: videosRes.count || 0,
      stories: storiesRes.count || 0,
      applications: applicationsRes.count || 0,
      reports: reportsRes.count || 0,
    });

    setLoading(false);
  }

  useEffect(() => {
    loadAnalytics();
  }, []);

  return (
    <>
      <div>
        <p className="text-sm uppercase tracking-[0.35em] text-yellow-400">
          Analytics
        </p>

        <h2 className="mt-3 text-4xl font-black md:text-5xl">
          Frame Growth
        </h2>

        <p className="mt-4 max-w-2xl text-zinc-400">
          Track users, posts, videos, stories, applications and reports across
          Frame.
        </p>
      </div>

      {loading ? (
        <EmptyState text="Loading analytics..." />
      ) : (
        <>
          <section className="mt-10 grid gap-5 md:grid-cols-3 xl:grid-cols-6">
            <StatCard title="Users" value={stats.users} />
            <StatCard title="Posts" value={stats.posts} />
            <StatCard title="Videos" value={stats.videos} />
            <StatCard title="Stories" value={stats.stories} />
            <StatCard title="Applications" value={stats.applications} />
            <StatCard title="Reports" value={stats.reports} danger={stats.reports > 0} />
          </section>

          <section className="mt-10 grid gap-8 lg:grid-cols-2">
            <Panel title="Growth Overview">
              <div className="mt-6 h-64 rounded-2xl border border-white/10 bg-black/40 p-6">
                <div className="flex h-full items-end gap-3">
                  {[35, 55, 40, 70, 62, 86, 78].map((height, index) => (
                    <div
                      key={index}
                      className="flex-1 rounded-t-xl bg-yellow-400/80"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
              </div>
              <p className="mt-4 text-sm text-zinc-500">
                Placeholder chart for now. We’ll connect this to daily growth
                data next.
              </p>
            </Panel>

            <Panel title="Community Health">
              <div className="mt-6 grid gap-4">
                <HealthRow label="Reports" value={stats.reports} />
                <HealthRow label="Pending Applications" value={stats.applications} />
                <HealthRow label="Video Uploads" value={stats.videos} />
                <HealthRow label="Story Activity" value={stats.stories} />
              </div>
            </Panel>
          </section>

          <section className="mt-10 grid gap-8 lg:grid-cols-2">
            <Panel title="Top Creators">
              <EmptyState text="Top creator analytics coming soon." />
            </Panel>

            <Panel title="Trending Content">
              <EmptyState text="Trending posts and videos coming soon." />
            </Panel>
          </section>
        </>
      )}
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
      <p className={`mt-3 text-4xl font-black ${danger ? "text-red-400" : "text-yellow-400"}`}>
        {value}
      </p>
    </div>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
      <h3 className="text-2xl font-black">{title}</h3>
      {children}
    </div>
  );
}

function HealthRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/40 px-5 py-4">
      <span className="text-zinc-400">{label}</span>
      <span className="font-black text-yellow-400">{value}</span>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-zinc-500">
      {text}
    </div>
  );
}
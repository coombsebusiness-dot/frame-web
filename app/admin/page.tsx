"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import StatsGrid from "../admin/widgets/StatsGrid";
import RecentUsers from "../admin/widgets/RecentUsers";
import WelcomeHero from "../admin/widgets/WelcomeHero";
import ActivityFeed from "../admin/widgets/ActivityFeed";

const ADMIN_EMAILS = ["leecoombsphotography@gmail.com"];

type Application = {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
  country: string | null;
  creator_type: string | null;
  instagram: string | null;
  website: string | null;
  bio: string | null;
  reason: string | null;
  status: string;
};

type Report = {
  id: string;
  created_at: string;
  reason?: string | null;
  post_id?: string | null;
  user_id?: string | null;
  status?: string | null;
};

type UserProfile = {
  id: string;
  username?: string | null;
  full_name?: string | null;
  email?: string | null;
  created_at?: string | null;
};

type DashboardStats = {
  totalUsers: number;
  totalPosts: number;
  totalVideos: number;
  pendingApplications: number;
  pendingReports: number;
};

export default function AdminPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalPosts: 0,
    totalVideos: 0,
    pendingApplications: 0,
    pendingReports: 0,
  });

  const [loading, setLoading] = useState(true);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const activity = [
    {
      id: "1",
      icon: "👤",
      title: "New user joined",
      subtitle: "Sarah Johnson joined Frame",
      time: "2 mins",
    },
    {
      id: "2",
      icon: "📸",
      title: "Photo uploaded",
      subtitle: "James uploaded a landscape photo",
      time: "5 mins",
    },
    {
      id: "3",
      icon: "🥇",
      title: "Golden Creator Application",
      subtitle: "Michael Brown applied",
      time: "8 mins",
    },
    {
      id: "4",
      icon: "🚩",
      title: "Post Reported",
      subtitle: "Community report received",
      time: "12 mins",
    },
  ];

  async function loadAdminData() {
    setLoading(true);

    const [
      appsRes,
      reportsRes,
      usersRes,
      usersCountRes,
      postsCountRes,
      videosCountRes,
      pendingAppsCountRes,
      pendingReportsCountRes,
    ] = await Promise.all([
      supabase
        .from("golden_creator_applications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10),

      supabase
        .from("reports")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10),

      supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10),

      supabase.from("profiles").select("id", { count: "exact", head: true }),

      supabase.from("posts").select("id", { count: "exact", head: true }),

      supabase
        .from("posts")
        .select("id", { count: "exact", head: true })
        .eq("media_type", "video"),

      supabase
        .from("golden_creator_applications")
        .select("id", { count: "exact", head: true })
        .eq("status", "Pending"),

      supabase
        .from("reports")
        .select("id", { count: "exact", head: true }),
    ]);

    if (!appsRes.error) setApplications(appsRes.data || []);
    if (!reportsRes.error) setReports(reportsRes.data || []);
    if (!usersRes.error) setUsers(usersRes.data || []);

    setStats({
      totalUsers: usersCountRes.count || 0,
      totalPosts: postsCountRes.count || 0,
      totalVideos: videosCountRes.count || 0,
      pendingApplications: pendingAppsCountRes.count || 0,
      pendingReports: pendingReportsCountRes.count || 0,
    });

    setLoading(false);
  }

  async function updateApplicationStatus(id: string, status: string) {
    const { error } = await supabase
      .from("golden_creator_applications")
      .update({ status })
      .eq("id", id);

    if (error) {
      alert("Could not update application.");
      console.error(error);
      return;
    }

    await loadAdminData();
  }

  useEffect(() => {
    async function checkAdminAccess() {
      const { data } = await supabase.auth.getUser();
      const email = data.user?.email;

      if (!email || !ADMIN_EMAILS.includes(email)) {
        setIsAdmin(false);
        setCheckingAuth(false);
        return;
      }

      setIsAdmin(true);
      setCheckingAuth(false);
      await loadAdminData();
    }

    checkAdminAccess();
  }, []);

  if (checkingAuth) {
    return <p className="text-zinc-400">Checking admin access...</p>;
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-center">
        <div>
          <h1 className="text-4xl font-black">Access denied</h1>
          <p className="mt-4 text-zinc-400">
            You do not have permission to view Frame HQ.
          </p>
          <Link
            href="/login"
            className="mt-8 inline-block rounded-full bg-yellow-400 px-6 py-3 font-bold text-black"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return <p className="text-zinc-400">Loading admin dashboard...</p>;
  }

  return (
    <>
      <WelcomeHero
        users={stats.totalUsers}
        posts={stats.totalPosts}
        videos={stats.totalVideos}
        applications={stats.pendingApplications}
        reports={stats.pendingReports}
      />

      <div className="mt-10">
        <StatsGrid
          users={stats.totalUsers}
          posts={stats.totalPosts}
          videos={stats.totalVideos}
          applications={stats.pendingApplications}
        />
        
      </div>

      <section className="mt-12">
        <h2 className="text-3xl font-black">Golden Creator Applications</h2>

        <div className="mt-6 grid gap-5">
          {applications.length === 0 ? (
            <EmptyState text="No applications yet." />
          ) : (
            applications.map((app) => (
              <div
                key={app.id}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-6"
              >
                <div className="flex flex-col justify-between gap-4 md:flex-row">
                  <div>
                    <h3 className="text-2xl font-bold">
                      {app.first_name} {app.last_name}
                    </h3>
                    <p className="mt-1 text-zinc-400">{app.email}</p>
                    <p className="mt-2 text-sm text-yellow-400">
                      {app.creator_type || "Creator"} ·{" "}
                      {app.country || "Country not added"}
                    </p>
                  </div>

                  <span className="h-fit rounded-full bg-yellow-400 px-4 py-2 text-sm font-bold text-black">
                    {app.status}
                  </span>
                </div>

                <div className="mt-5 grid gap-4 text-sm text-zinc-300 md:grid-cols-2">
                  <p>
                    <strong>Instagram:</strong>{" "}
                    {app.instagram || "Not added"}
                  </p>
                  <p>
                    <strong>Website:</strong> {app.website || "Not added"}
                  </p>
                </div>

                {app.bio && (
                  <p className="mt-5 text-zinc-300">
                    <strong>Bio:</strong> {app.bio}
                  </p>
                )}

                {app.reason && (
                  <p className="mt-4 text-zinc-300">
                    <strong>Reason:</strong> {app.reason}
                  </p>
                )}

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    onClick={() => updateApplicationStatus(app.id, "Approved")}
                    className="rounded-full bg-green-500 px-5 py-3 font-bold text-black hover:bg-green-400"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => updateApplicationStatus(app.id, "Rejected")}
                    className="rounded-full bg-red-500 px-5 py-3 font-bold text-white hover:bg-red-400"
                  >
                    Reject
                  </button>

                  <button
                    onClick={() => updateApplicationStatus(app.id, "Pending")}
                    className="rounded-full border border-white/10 px-5 py-3 font-bold text-white hover:bg-white/10"
                  >
                    Mark Pending
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="mt-16 grid gap-8 lg:grid-cols-2">

  <RecentUsers users={users} />

  <ActivityFeed
    activities={activity}
  />

</section>
    </>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-zinc-500">
      {text}
    </div>
  );
}
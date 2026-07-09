import { SupabaseClient } from "npm:@supabase/supabase-js@2";

export async function buildFrameContext(
  supabase: SupabaseClient
) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayIso = today.toISOString();

  const [
    totalUsers,
    usersToday,
    totalPosts,
    postsToday,
    totalVideos,
    videosToday,
    totalStories,
    storiesToday,
    pendingApplications,
    openReports,
  ] = await Promise.all([

    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true }),

    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .gte("created_at", todayIso),

    supabase
      .from("posts")
      .select("id", { count: "exact", head: true }),

    supabase
      .from("posts")
      .select("id", { count: "exact", head: true })
      .gte("created_at", todayIso),

    supabase
      .from("posts")
      .select("id", { count: "exact", head: true })
      .eq("media_type", "video"),

    supabase
      .from("posts")
      .select("id", { count: "exact", head: true })
      .eq("media_type", "video")
      .gte("created_at", todayIso),

    supabase
      .from("stories")
      .select("id", { count: "exact", head: true }),

    supabase
      .from("stories")
      .select("id", { count: "exact", head: true })
      .gte("created_at", todayIso),

    supabase
      .from("golden_creator_applications")
      .select("id", { count: "exact", head: true })
      .eq("status", "Pending"),

    supabase
      .from("reports")
      .select("id", { count: "exact", head: true })
      .neq("status", "Reviewed"),
  ]);

  return {
    generatedAt: new Date().toISOString(),

    totalUsers: totalUsers.count ?? 0,
    usersToday: usersToday.count ?? 0,

    totalPosts: totalPosts.count ?? 0,
    postsToday: postsToday.count ?? 0,

    totalVideos: totalVideos.count ?? 0,
    videosToday: videosToday.count ?? 0,

    totalStories: totalStories.count ?? 0,
    storiesToday: storiesToday.count ?? 0,

    pendingApplications:
      pendingApplications.count ?? 0,

    openReports:
      openReports.count ?? 0,
  };
}

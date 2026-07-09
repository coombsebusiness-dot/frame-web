import { supabase } from "@/lib/supabase";

function startOfTodayIso() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now.toISOString();
}

export async function getFrameContext() {
  const today = startOfTodayIso();

  const [
    totalUsersRes,
    usersTodayRes,
    totalPostsRes,
    postsTodayRes,
    totalVideosRes,
    videosTodayRes,
    totalStoriesRes,
    storiesTodayRes,
    pendingApplicationsRes,
    openReportsRes,
  ] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),

    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .gte("created_at", today),

    supabase.from("posts").select("id", { count: "exact", head: true }),

    supabase
      .from("posts")
      .select("id", { count: "exact", head: true })
      .gte("created_at", today),

    supabase
      .from("posts")
      .select("id", { count: "exact", head: true })
      .eq("media_type", "video"),

    supabase
      .from("posts")
      .select("id", { count: "exact", head: true })
      .eq("media_type", "video")
      .gte("created_at", today),

    supabase.from("stories").select("id", { count: "exact", head: true }),

    supabase
      .from("stories")
      .select("id", { count: "exact", head: true })
      .gte("created_at", today),

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

    totalUsers: totalUsersRes.count || 0,
    usersToday: usersTodayRes.count || 0,

    totalPosts: totalPostsRes.count || 0,
    postsToday: postsTodayRes.count || 0,

    totalVideos: totalVideosRes.count || 0,
    videosToday: videosTodayRes.count || 0,

    totalStories: totalStoriesRes.count || 0,
    storiesToday: storiesTodayRes.count || 0,

    pendingApplications: pendingApplicationsRes.count || 0,
    openReports: openReportsRes.count || 0,
  };
}
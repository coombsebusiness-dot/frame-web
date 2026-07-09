import { supabase } from "@/lib/supabase";

export type CreatorAnalytics = {
  posts: number;
  videos: number;
  stories: number;
  likesReceived: number;
  commentsReceived: number;
  savesReceived: number;
  followers: number;
  following: number;
  profileViews: number;
  creatorScore: number;
  creatorHealth: "Growing" | "Active" | "Needs Momentum";
};

export async function getCreatorAnalytics(userId: string): Promise<CreatorAnalytics> {
  const [
    postsRes,
    videosRes,
    storiesRes,
    followersRes,
    followingRes,
    profileViewsRes,
  ] = await Promise.all([
    supabase.from("posts").select("id", { count: "exact", head: true }).eq("user_id", userId),

    supabase
      .from("posts")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("media_type", "video"),

    supabase.from("stories").select("id", { count: "exact", head: true }).eq("user_id", userId),

    supabase.from("follows").select("id", { count: "exact", head: true }).eq("following_id", userId),

    supabase.from("follows").select("id", { count: "exact", head: true }).eq("follower_id", userId),

    supabase.from("profile_views").select("id", { count: "exact", head: true }).eq("profile_id", userId),
  ]);

  const { data: creatorPosts } = await supabase
    .from("posts")
    .select("id")
    .eq("user_id", userId);

  const postIds = creatorPosts?.map((post) => post.id) || [];

  let likesReceived = 0;
  let commentsReceived = 0;
  let savesReceived = 0;

  if (postIds.length > 0) {
    const [likesRes, commentsRes, savesRes] = await Promise.all([
      supabase.from("likes").select("id", { count: "exact", head: true }).in("post_id", postIds),
      supabase.from("comments").select("id", { count: "exact", head: true }).in("post_id", postIds),
      supabase.from("saves").select("id", { count: "exact", head: true }).in("post_id", postIds),
    ]);

    likesReceived = likesRes.count || 0;
    commentsReceived = commentsRes.count || 0;
    savesReceived = savesRes.count || 0;
  }

  const posts = postsRes.count || 0;
  const videos = videosRes.count || 0;
  const stories = storiesRes.count || 0;
  const followers = followersRes.count || 0;
  const following = followingRes.count || 0;
  const profileViews = profileViewsRes.count || 0;

  const creatorScore =
    posts * 5 +
    videos * 8 +
    stories * 2 +
    likesReceived * 2 +
    commentsReceived * 3 +
    savesReceived * 4 +
    followers +
    profileViews;

  const creatorHealth =
    creatorScore >= 100 ? "Growing" : creatorScore >= 30 ? "Active" : "Needs Momentum";

  return {
    posts,
    videos,
    stories,
    likesReceived,
    commentsReceived,
    savesReceived,
    followers,
    following,
    profileViews,
    creatorScore,
    creatorHealth,
  };
}
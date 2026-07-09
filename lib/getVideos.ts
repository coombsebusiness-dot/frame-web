import { supabase } from "@/lib/supabase";

export type VideoPost = {
  id: string;
  user_id: string;
  caption: string | null;
  video_url: string | null;
  created_at: string;

  like_count: number;
  comment_count: number;
  save_count: number;

  user_has_liked: boolean;   // <-- move it here

  profiles?: {
    username: string | null;
    display_name: string | null;
    avatar_url: string | null;
    is_founding_creator: boolean | null;
    is_golden_creator: boolean | null;
  } | null;
};

export async function getVideos(): Promise<VideoPost[]> {
  const { data: videos, error } = await supabase
    .from("posts")
    .select(`
      id,
      user_id,
      caption,
      video_url,
      
      created_at,
      profiles:user_id (
        username,
        display_name,
        avatar_url,
        is_founding_creator,
        is_golden_creator
      )
    `)
    .eq("media_type", "video")
    .order("created_at", { ascending: false })
    .limit(20);

  if (error || !videos) {
    console.error("Could not load videos:", JSON.stringify(error, null, 2));
    return [];
  }

  const videoIds = videos.map((video) => video.id);
  const { data: userData } = await supabase.auth.getUser();
const userId = userData.user?.id;

let userLikedPostIds = new Set<string>();

if (userId) {
  const { data: userLikes } = await supabase
    .from("likes")
    .select("post_id")
    .eq("user_id", userId)
    .in("post_id", videoIds);

  userLikedPostIds = new Set(userLikes?.map((like) => like.post_id) || []);
}

  const [likesRes, commentsRes, savesRes] = await Promise.all([
    supabase.from("likes").select("post_id").in("post_id", videoIds),
    supabase.from("comments").select("post_id").in("post_id", videoIds),
    supabase.from("saves").select("post_id").in("post_id", videoIds),
  ]);

  function countByPost(rows: any[] | null) {
    const counts: Record<string, number> = {};

    rows?.forEach((row) => {
      counts[row.post_id] = (counts[row.post_id] || 0) + 1;
    });

    return counts;
  }

  const likeCounts = countByPost(likesRes.data);
  const commentCounts = countByPost(commentsRes.data);
  console.log("VIDEO IDS:", videoIds);
console.log("COMMENTS RES:", commentsRes.data);
console.log("COMMENT COUNTS:", commentCounts);
  const saveCounts = countByPost(savesRes.data);

return videos.map((video) => ({
  ...(video as any),
  like_count: likeCounts[video.id] || 0,
  comment_count: commentCounts[video.id] || 0,
  save_count: saveCounts[video.id] || 0,
  user_has_liked: userLikedPostIds.has(video.id),
})) as VideoPost[];
}
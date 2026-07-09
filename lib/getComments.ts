import { supabase } from "@/lib/supabase";

export async function getComments(postId: string) {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;

  const { data: comments, error } = await supabase
    .from("comments")
    .select(`
      id,
      body,
      created_at,
      user_id,
      profiles:user_id (
        username,
        display_name,
        avatar_url,
        is_founding_creator,
        is_golden_creator
      )
    `)
    .eq("post_id", postId)
    .is("parent_comment_id", null)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error || !comments) {
    console.error("Could not load comments:", JSON.stringify(error, null, 2));
    return [];
  }

  const commentIds = comments.map((comment) => comment.id);
  
  const { data: replies } = await supabase
  .from("comments")
  .select(`
    id,
    body,
    created_at,
    parent_comment_id,
    user_id,
    profiles:user_id (
      username,
      display_name,
      avatar_url,
      is_founding_creator,
      is_golden_creator
    )
  `)
  .in("parent_comment_id", commentIds)
  .order("created_at", { ascending: true });

  const { data: likes } = await supabase
    .from("comment_likes")
    .select("comment_id")
    .in("comment_id", commentIds);

  const likeCounts: Record<string, number> = {};

  likes?.forEach((like) => {
    likeCounts[like.comment_id] = (likeCounts[like.comment_id] || 0) + 1;
  });

  let likedCommentIds = new Set<string>();

  if (userId) {
    const { data: userLikes } = await supabase
      .from("comment_likes")
      .select("comment_id")
      .eq("user_id", userId)
      .in("comment_id", commentIds);

    likedCommentIds = new Set(
      userLikes?.map((like) => like.comment_id) || []
    );
  }

 return comments.map((comment) => ({
  ...(comment as any),

  like_count: likeCounts[comment.id] || 0,
  user_has_liked: likedCommentIds.has(comment.id),

  replies:
    replies?.filter(
      (reply) => reply.parent_comment_id === comment.id
    ) || [],
}));
}
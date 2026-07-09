import { supabase } from "@/lib/supabase";

export async function toggleCommentLike(commentId: string) {
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    throw new Error("You must be signed in to like comments.");
  }

  const userId = userData.user.id;

  const { data: existingLike, error: findError } = await supabase
    .from("comment_likes")
    .select("id")
    .eq("comment_id", commentId)
    .eq("user_id", userId)
    .maybeSingle();

  if (findError) throw findError;

  if (existingLike) {
    const { error } = await supabase
      .from("comment_likes")
      .delete()
      .eq("id", existingLike.id);

    if (error) throw error;

    return { liked: false };
  }

  const { error } = await supabase
    .from("comment_likes")
    .insert({
      comment_id: commentId,
      user_id: userId,
    });

  if (error) throw error;

  return { liked: true };
}
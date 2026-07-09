import { supabase } from "@/lib/supabase";

export async function addComment(
  postId: string,
  text: string,
  parentCommentId?: string | null
) {
  const cleanText = text.trim();

  if (!cleanText) {
    throw new Error("Comment cannot be empty.");
  }

  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    throw new Error("You must be signed in to comment.");
  }

  const userId = userData.user.id;

 const { data, error } = await supabase
  .from("comments")
 .insert({
  post_id: postId,
  user_id: userId,
  body: cleanText,
  parent_comment_id: parentCommentId || null,
})
 .select("id, post_id, user_id, body, created_at, parent_comment_id")
  .single();

  if (error) throw error;

  return data;
}
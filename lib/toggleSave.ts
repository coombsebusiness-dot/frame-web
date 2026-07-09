import { supabase } from "@/lib/supabase";

export async function toggleSave(postId: string) {
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    throw new Error("You must be signed in to save videos.");
  }

  const userId = userData.user.id;

  const { data: existingSave, error: findError } = await supabase
    .from("saves")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .maybeSingle();

  if (findError) {
    throw findError;
  }

  if (existingSave) {
    const { error } = await supabase
      .from("saves")
      .delete()
      .eq("id", existingSave.id);

    if (error) throw error;

    return { saved: false };
  }

  const { error } = await supabase.from("saves").insert({
    post_id: postId,
    user_id: userId,
  });

  if (error) throw error;

  return { saved: true };
}
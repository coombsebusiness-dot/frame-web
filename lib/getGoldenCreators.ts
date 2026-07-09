import { supabase } from "@/lib/supabase";

export type GoldenCreator = {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  creator_type: string | null;
  created_at: string | null;
  founding_creator_since: string | null;
};

export async function getGoldenCreators() {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("is_founding_creator", true)
    .order("created_at", { ascending: true })
    .limit(6);

 if (error) {
  console.error("Could not load Golden Creators:", JSON.stringify(error, null, 2));
  return [];
}

  return data || [];
}
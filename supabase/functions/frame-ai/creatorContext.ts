import { SupabaseClient } from "npm:@supabase/supabase-js@2";
import { buildCreatorRecommendation } from "./recommendationEngine.ts";

type CreatorScore = {
  id: string;
  username: string | null;
  fullName: string | null;
  bio: string | null;
  joinedAt: string | null;
  posts: number;
  likes: number;
  comments: number;
  saves: number;
  followers: number;
  reports: number;
  creatorScore: number;
};

export async function buildCreatorContext(supabase: SupabaseClient) {
 const { data: creators, error: creatorsError } = await supabase
  .from("profiles")
  .select("*")
  .order("created_at", { ascending: false })
  .limit(25);

if (creatorsError) {
  return {
    error: `Could not load creators: ${creatorsError.message}`,
    featuredCandidates: [],
    newestCreators: [],
  };
}
function isRealCreator(username: string | null) {
  if (!username) return false;

  const value = username.toLowerCase();

  const blocked = [
    "test",
    "testing",
    "apple",
    "review",
    "frametesting",
    "example.com",
    "@example",
  ];

  return !blocked.some((word) => value.includes(word));
}

  const scoredCreators: CreatorScore[] = [];

  for (const creator of creators) {
    const userId = creator.id;

    const [
      postsRes,
      likesRes,
      commentsRes,
      savesRes,
      followersRes,
      reportsRes,
    ] = await Promise.all([
      supabase
        .from("posts")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId),

      supabase
        .from("likes")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId),

      supabase
        .from("comments")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId),

      supabase
        .from("saves")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId),

      supabase
        .from("follows")
        .select("id", { count: "exact", head: true })
        .eq("following_id", userId),

      supabase
        .from("reports")
        .select("id", { count: "exact", head: true })
        .eq("reported_user_id", userId),
    ]);

    const posts = postsRes.count ?? 0;
    const likes = likesRes.count ?? 0;
    const comments = commentsRes.count ?? 0;
    const saves = savesRes.count ?? 0;
    const followers = followersRes.count ?? 0;
    const reports = reportsRes.count ?? 0;

    const creatorScore =
      posts * 5 +
      likes * 2 +
      comments * 3 +
      saves * 4 +
      followers * 1 -
      reports * 20;

    scoredCreators.push({
      id: userId,
      username: creator.username,
      fullName: creator.display_name,
      bio: creator.bio,
      joinedAt: creator.created_at,
      posts,
      likes,
      comments,
      saves,
      followers,
      reports,
      creatorScore,
    });
  }

 const featuredCandidates = scoredCreators
  .filter((creator) => isRealCreator(creator.username))
  .sort((a, b) => b.creatorScore - a.creatorScore)
  .slice(0, 10);

    const creatorRecommendation =
  buildCreatorRecommendation(featuredCandidates);

    const recommendedCreator = featuredCandidates[0] ?? null;

let recommendation = null;

if (recommendedCreator) {
  recommendation = {
    username: recommendedCreator.username,
    score: recommendedCreator.creatorScore,
    confidence:
      recommendedCreator.creatorScore > 100
        ? "Very High"
        : recommendedCreator.creatorScore > 60
        ? "High"
        : recommendedCreator.creatorScore > 30
        ? "Medium"
        : "Low",

    reasons: [
      `${recommendedCreator.posts} posts`,
      `${recommendedCreator.likes} likes`,
      `${recommendedCreator.comments} comments`,
      `${recommendedCreator.saves} saves`,
      `${recommendedCreator.followers} followers`,
      `${recommendedCreator.reports} reports`,
    ],
  };
}

 return {
  creatorRecommendation,
  featuredCandidates,
  newestCreators: creators.map((creator) => ({
    id: creator.id,
    username: creator.username ?? null,
    fullName: creator.display_name?? creator.name ?? null,
    bio: creator.bio ?? null,
    joinedAt: creator.created_at ?? null,
  })),
};
}
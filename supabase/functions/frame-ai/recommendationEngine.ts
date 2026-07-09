export type CreatorCandidate = {
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

export function buildCreatorRecommendation(candidates: CreatorCandidate[]) {
  if (!candidates || candidates.length === 0) {
    return null;
  }

  const ranked = candidates
    .map((creator) => {
      const strengths: string[] = [];
      const warnings: string[] = [];

      let score = creator.creatorScore;

      if (creator.posts >= 5) {
        strengths.push("Consistent posting");
        score += 20;
      }

      if (creator.likes >= 25) {
        strengths.push("Strong like engagement");
        score += 15;
      }

      if (creator.comments >= 5) {
        strengths.push("Good conversation around their work");
        score += 15;
      }

      if (creator.saves >= 5) {
        strengths.push("People are saving their work");
        score += 20;
      }

      if (creator.followers >= 10) {
        strengths.push("Growing audience");
        score += 10;
      }

      if (creator.reports > 0) {
        warnings.push("Has moderation reports");
        score -= creator.reports * 50;
      } else {
        strengths.push("No reports against this creator");
      }

      const confidence =
        score >= 120 ? "Very High" : score >= 80 ? "High" : score >= 40 ? "Medium" : "Low";

      return {
        ...creator,
        recommendationScore: score,
        confidence,
        strengths,
        warnings,
        recommendation:
          score >= 80
            ? "Strong candidate for a featured creator slot."
            : score >= 40
            ? "Possible candidate, but more engagement would improve confidence."
            : "Not enough signal yet for a confident recommendation.",
      };
    })
    .sort((a, b) => b.recommendationScore - a.recommendationScore);

  return {
    recommendedCreator: ranked[0],
    alternatives: ranked.slice(1, 4),
  };
}
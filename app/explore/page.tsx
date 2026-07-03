import Image from 'next/image';
import { supabase } from '../../lib/supabase';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import FollowButton from '../../components/FollowButton';

export default async function ExplorePage() {
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(30);
    const { data: allPosts } = await supabase
  .from('posts')
  .select(`
    *,
    likes (
      id
    )
  `);

const popularPosts = (allPosts ?? [])
  .sort((a: any, b: any) => {
    const aLikes = a.likes?.length || 0;
    const bLikes = b.likes?.length || 0;
    return bLikes - aLikes;
  })
  .slice(0, 6);

  const { data: creators } = await supabase
    .from('profiles')
    .select('id, username, display_name, avatar_url');

  const { data: follows } = await supabase
    .from('follows')
    .select('following_id');

  const followerCounts = new Map<string, number>();

  (follows ?? []).forEach((follow) => {
    followerCounts.set(
      follow.following_id,
      (followerCounts.get(follow.following_id) || 0) + 1
    );
  });

  const trendingCreators = (creators ?? [])
    .map((creator) => ({
      ...creator,
      followers_count: followerCounts.get(creator.id) || 0,
    }))
    .sort((a, b) => b.followers_count - a.followers_count)
    .slice(0, 6);

  if (error) {
    console.error('SUPABASE ERROR:', JSON.stringify(error, null, 2));
  }

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <Navbar />

      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <h1 className="text-5xl font-bold">Explore</h1>
          <p className="mt-3 text-zinc-400">
            Discover creative work from the Frame community.
          </p>
        </div>

        <h2 className="mb-4 text-2xl font-bold">🔥 Trending Creators</h2>

        <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-3">
          {trendingCreators.map((creator) => (
            <Link
              key={creator.id}
              href={`/profile/${creator.username}`}
              className="rounded-2xl border border-white/10 bg-zinc-950 p-4 text-center"
            >
              {creator.avatar_url ? (
                <img
                  src={creator.avatar_url}
                  alt=""
                  className="mx-auto mb-3 h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <div className="mx-auto mb-3 h-16 w-16 rounded-full bg-zinc-800" />
              )}

              <p className="font-semibold">
                {creator.display_name || creator.username}
              </p>

              <p className="text-sm text-zinc-500">@{creator.username}</p>

              <p className="mt-1 text-xs text-zinc-500">
                {creator.followers_count || 0} followers
              </p>
              <div className="mt-3">
  <FollowButton profileId={creator.id} />
</div>
            </Link>
          ))}
        </div>
        <h2 className="mb-4 text-2xl font-bold">🔥 Popular Posts</h2>

<div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
  {popularPosts.map((post: any) => (
    <Link
      key={post.id}
      href={`/post/${post.id}`}
      className="block overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]"
    >
      <img
        src={post.image_url}
        alt={post.caption || 'Frame Post'}
        className="w-full"
      />
    </Link>
  ))}
</div>

        <h2 className="mb-4 text-2xl font-bold">🆕 Latest Posts</h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(posts ?? []).map((post) => (
            <Link
              key={post.id}
              href={`/post/${post.id}`}
              className="block overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]"
            >
              <img
                src={post.image_url}
                alt={post.caption || 'Frame Post'}
                className="w-full"
              />
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
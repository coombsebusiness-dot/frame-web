import { supabase } from '../../../lib/supabase';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import type { Metadata } from 'next';

type PageProps = {
  params: Promise<{ username: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, username, bio, avatar_url')
    .eq('username', username)
    .single();

  if (!profile) {
    return {
      title: 'Frame Profile',
      description: 'View this creator profile on Frame.',
    };
  }

  const title = `${profile.display_name || profile.username} on Frame`;
  const description = profile.bio || 'View this creator profile on Frame.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: profile.avatar_url ? [profile.avatar_url] : ['https://frameapp.uk/frame-icon.png'],
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: profile.avatar_url ? [profile.avatar_url] : ['https://frameapp.uk/frame-icon.png'],
    },
  };
}
export default async function ProfilePage({ params }: PageProps) {
  const { username } = await params;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single();

  if (!profile) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <Navbar />
        <h1>User not found</h1>
      </main>
      
    );
  }

  const { data: posts } = await supabase
    .from('posts')
    .select('id, image_url, thumbnail_url, caption, created_at')
    .eq('user_id', profile.id)
    .order('created_at', { ascending: false });
    const { count: postsCount } = await supabase
  .from('posts')
  .select('*', { count: 'exact', head: true })
  .eq('user_id', profile.id);

const { count: followersCount } = await supabase
  .from('follows')
  .select('*', { count: 'exact', head: true })
  .eq('following_id', profile.id);

const { count: followingCount } = await supabase
  .from('follows')
  .select('*', { count: 'exact', head: true })
  .eq('follower_id', profile.id);

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 flex flex-col items-center text-center">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.display_name}
              className="h-32 w-32 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-white/10 text-4xl">
              {profile.display_name?.charAt(0)}
            </div>
          )}

          <div>
            <h1 className="text-4xl font-bold">{profile.display_name}</h1>

            <p className="text-zinc-400">@{profile.username}</p>

            <p className="mt-3 text-zinc-300">{profile.bio}</p>

            <p className="mt-2 text-sm text-zinc-500">{profile.gear}</p>

            <div className="mt-6 flex w-full justify-center gap-12">
  <div>
    <p className="text-2xl font-bold">{postsCount || 0}</p>
    <p className="text-sm text-zinc-500">Posts</p>
  </div>

  <div>
    <p className="text-2xl font-bold">{followersCount || 0}</p>
    <p className="text-sm text-zinc-500">Followers</p>
  </div>

  <div>
    <p className="text-2xl font-bold">{followingCount || 0}</p>
    <p className="text-sm text-zinc-500">Following</p>
  </div>
</div>
          </div>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(posts ?? []).map((post) => (
            <Link
              key={post.id}
              href={`/post/${post.id}`}
              className="block overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]"
            >
              <img
                src={post.thumbnail_url || post.image_url}
                alt={post.caption || 'Frame post'}
                className="w-full"
              />
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
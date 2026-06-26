import { supabase } from '../../../../lib/supabase';
import Link from 'next/link';
import Navbar from '../../../../components/Navbar';

type PageProps = {
  params: Promise<{ username: string }>;
};

export default async function FollowersPage({ params }: PageProps) {
  const { username } = await params;

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, username, display_name')
    .eq('username', username)
    .single();

  if (!profile) {
    return <main className="min-h-screen bg-black text-white">User not found</main>;
  }

  const { data: followers } = await supabase
    .from('follows')
    .select(`
      follower_id,
      profiles!follows_follower_id_fkey (
        username,
        display_name,
        avatar_url,
        bio
      )
    `)
    .eq('following_id', profile.id);

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="mx-auto max-w-2xl px-6 py-10">
        <h1 className="mb-8 text-3xl font-bold">
          Followers
        </h1>

        <div className="space-y-4">
          {(followers ?? []).map((item: any) => {
            const user = item.profiles;

            return (
              <Link
                key={item.follower_id}
                href={`/profile/${user.username}`}
                className="flex items-center gap-4 rounded-2xl border border-white/10 bg-zinc-950 p-4 hover:bg-zinc-900"
              >
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt=""
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-zinc-800" />
                )}

                <div>
                  <p className="font-semibold">
                    {user.display_name || user.username}
                  </p>
                  <p className="text-sm text-zinc-500">@{user.username}</p>
                  {user.bio && (
                    <p className="mt-1 text-sm text-zinc-400">{user.bio}</p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
import Image from 'next/image';
import { supabase } from '../../lib/supabase';
import Link from 'next/link';

export default async function ExplorePage() {
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(30);
    

  if (error) {
  console.error('SUPABASE ERROR:', JSON.stringify(error, null, 2));
}

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <h1 className="text-5xl font-bold">Explore</h1>
          <p className="mt-3 text-zinc-400">
            Discover creative work from the Frame community.
          </p>
        </div>

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
          ))
        </div>
      </div>
    </main>
  );
}
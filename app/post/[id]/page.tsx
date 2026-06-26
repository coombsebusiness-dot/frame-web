import Link from 'next/link';
import { supabase } from '../../../lib/supabase';
import Navbar from '../../../components/Navbar';
import type { Metadata } from 'next';
type PageProps = {
  params: Promise<{ id: string }>;
};

type FramePost = {
  id: string;
  user_id: string;
  image_url: string;
  thumbnail_url?: string | null;
  caption?: string | null;
  created_at?: string;
  tags?: string[] | null;
};
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {

  const { id } = await params;

  

  const { data: post } = await supabase
    .from('posts')
    .select('id, image_url, caption, user_id')
    .eq('id', id)
    .single();

  if (!post) {
    return {
      title: 'Frame Post',
      description: 'View this creative post on Frame.',
    };
  }

  const { data: creator } = await supabase
    .from('profiles')
    .select('display_name, username')
    .eq('id', post.user_id)
    .single();

  const title = creator?.display_name
    ? `${creator.display_name} on Frame`
    : 'Frame Post';

  const description =
    post.caption || 'View this creative post on Frame.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [post.image_url],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [post.image_url],
    },
  };
}
export default async function PostPage({ params }: PageProps) {
  const { id } = await params;

  const { data: post, error } = await supabase
    .from('posts')
    .select('id, user_id, image_url, thumbnail_url, caption, created_at, tags')
    .eq('id', id)
    .single();

  if (error || !post) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
        <Navbar />
        <div className="text-center">
          <h1 className="text-3xl font-bold">Post not found</h1>
          <Link href="/explore" className="mt-6 inline-block text-zinc-400 hover:text-white">
            Back to Explore
          </Link>
        </div>
      </main>
    );
  }

  const framePost = post as FramePost;

  const { data: creator } = await supabase
    .from('profiles')
    .select('id, username, display_name, bio, gear, avatar_url')
    .eq('id', framePost.user_id)
    .single();

  return (
   <main className="min-h-screen bg-black text-white">
  <Navbar />

  <div className="mx-auto max-w-5xl px-6 py-8">
        

        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03]">
            <img
              src={framePost.image_url}
              alt={framePost.caption || 'Frame post'}
              className="w-full"
            />
          </div>

          <aside className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
         
         
          {creator && (
            
  <a
  href={`/profile/${creator.username}`}
  className="mb-6 flex w-full cursor-pointer items-center gap-4 border-b border-white/10 pb-6 hover:opacity-80"
>
    
    {creator.avatar_url ? (
      <img
        src={creator.avatar_url}
        alt={creator.display_name || creator.username || 'Creator'}
        className="h-14 w-14 rounded-full object-cover"
      />
    ) : (
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-lg font-bold">
        {(creator.display_name || creator.username || 'F').charAt(0).toUpperCase()}
      </div>
    )}

    <div>
      <p className="font-semibold">
        {creator.display_name || 'Frame Creator'}
      </p>
      <p className="text-sm text-zinc-500">
        @{creator.username || 'creator'}
      </p>
    </div>
  </a>
)}
            

            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">
              Frame Post
            </p>

            <h1 className="mt-4 text-3xl font-bold">
              Shared on Frame
            </h1>

            {framePost.caption ? (
              <p className="mt-6 whitespace-pre-line leading-8 text-zinc-300">
                {framePost.caption}
              </p>
            ) : (
              <p className="mt-6 text-zinc-500">No caption added.</p>
            )}

            {framePost.tags && framePost.tags.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {framePost.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-400"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-8 border-t border-white/10 pt-6">
              <p className="text-sm text-zinc-500">
                Discover more creative work inside Frame.
              </p>
            <Link
  href={`/post/${framePost.id}`}
  className="mt-3 inline-flex w-full justify-center rounded-full border border-white/10 px-6 py-3 text-sm font-semibold text-white"
>
  Share Post
</Link>

              <a
                href="https://apps.apple.com/app/frame-creative-network/id6777236011"
                className="mt-5 inline-flex w-full justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black"
              >
                Download Frame
              </a>

              <Link
                href="/explore"
                className="mt-3 inline-flex w-full justify-center rounded-full border border-white/10 px-6 py-3 text-sm font-semibold text-white"
              >
                Explore more posts
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
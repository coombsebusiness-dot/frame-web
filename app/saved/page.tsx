'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { supabase } from '@/lib/supabase';

export default function SavedPage() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    loadSavedPosts();
  }, []);

  async function loadSavedPosts() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data: saves } = await supabase
      .from('saves')
      .select('post_id')
      .eq('user_id', user.id);

    const postIds = (saves || []).map((save) => save.post_id);

    if (postIds.length === 0) {
      setPosts([]);
      return;
    }

    const { data: postsData } = await supabase
      .from('posts')
      .select(`
        *,
        profiles!posts_user_id_fkey (
          username,
          display_name,
          avatar_url
        )
      `)
      .in('id', postIds)
      .order('created_at', { ascending: false });

    setPosts(postsData || []);
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="mb-8 text-center text-4xl font-bold">
          Saved Posts
        </h1>

        {posts.length === 0 ? (
          <p className="text-center text-zinc-500">
            No saved posts yet.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/post/${post.id}`}
                className="overflow-hidden rounded-2xl border border-white/10"
              >
                <img
                  src={post.image_url}
                  alt=""
                  className="aspect-square w-full object-cover"
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
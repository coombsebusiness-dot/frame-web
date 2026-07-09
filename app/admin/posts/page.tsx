"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Post = {
  id: string;
  created_at: string;
  user_id: string | null;
  caption?: string | null;
  image_url?: string | null;
  media_url?: string | null;
  media_type?: string | null;
};

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  async function loadPosts() {
    setLoading(true);

    let query = supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (search.trim()) {
      query = query.or(`caption.ilike.%${search}%,user_id.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error(error);
      alert("Could not load posts.");
    } else {
      setPosts(data || []);
    }

    setLoading(false);
  }

  async function deletePost(id: string) {
    const confirmed = confirm("Delete this post? This cannot be undone.");

    if (!confirmed) return;

    const { error } = await supabase.from("posts").delete().eq("id", id);

    if (error) {
      console.error(error);
      alert("Could not delete post.");
      return;
    }

    await loadPosts();
  }

  useEffect(() => {
    loadPosts();
  }, []);

  return (
    <>
      <div>
        <p className="text-sm uppercase tracking-[0.35em] text-yellow-400">
          Posts
        </p>
        <h2 className="mt-3 text-4xl font-black md:text-5xl">
          Content Review
        </h2>
        <p className="mt-4 max-w-2xl text-zinc-400">
          Review recent posts, search captions and remove content if needed.
        </p>
      </div>

      <section className="mt-10 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
        <div className="grid gap-4 md:grid-cols-[1fr_auto]">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search caption or user ID..."
            className="rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none placeholder:text-zinc-500"
          />

          <button
            onClick={loadPosts}
            className="rounded-2xl bg-yellow-400 px-6 py-4 font-bold text-black hover:bg-yellow-300"
          >
            Search
          </button>
        </div>
      </section>

      <section className="mt-8 grid gap-5">
        {loading ? (
          <EmptyState text="Loading posts..." />
        ) : posts.length === 0 ? (
          <EmptyState text="No posts found." />
        ) : (
          posts.map((post) => {
            const media = post.image_url || post.media_url;

            return (
              <div
                key={post.id}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-6"
              >
                <div className="grid gap-6 md:grid-cols-[180px_1fr]">
                  <div className="overflow-hidden rounded-2xl border border-white/10 bg-black">
                    {media ? (
                      post.media_type === "video" ? (
                        <video
                          src={media}
                          className="h-44 w-full object-cover"
                          controls
                        />
                      ) : (
                        <img
                          src={media}
                          alt="Post media"
                          className="h-44 w-full object-cover"
                        />
                      )
                    ) : (
                      <div className="flex h-44 items-center justify-center text-sm text-zinc-500">
                        No media
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex flex-col justify-between gap-4 md:flex-row">
                      <div>
                        <h3 className="text-xl font-bold">
                          Post #{post.id.slice(0, 8)}
                        </h3>
                        <p className="mt-1 text-sm text-zinc-500">
                          User: {post.user_id || "Unknown"}
                        </p>
                        <p className="mt-1 text-sm text-zinc-500">
                          {post.created_at
                            ? new Date(post.created_at).toLocaleString()
                            : "Unknown date"}
                        </p>
                      </div>

                      <span className="h-fit rounded-full bg-yellow-400 px-4 py-2 text-sm font-bold text-black">
                        {post.media_type || "photo"}
                      </span>
                    </div>

                    <p className="mt-5 text-zinc-300">
                      {post.caption || "No caption"}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <button className="rounded-full border border-white/10 px-5 py-3 text-sm font-bold text-white hover:bg-white/10">
                        View
                      </button>

                      <button className="rounded-full border border-yellow-400/40 px-5 py-3 text-sm font-bold text-yellow-400 hover:bg-yellow-400/10">
                        Feature
                      </button>

                      <button
                        onClick={() => deletePost(post.id)}
                        className="rounded-full bg-red-500 px-5 py-3 text-sm font-bold text-white hover:bg-red-400"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </section>
    </>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-zinc-500">
      {text}
    </div>
  );
}
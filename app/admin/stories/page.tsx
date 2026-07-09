"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Story = {
  id: string;
  created_at: string;
  user_id: string | null;
  image_url?: string | null;
  video_url?: string | null;
  media_type?: string | null;
};

export default function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  async function loadStories() {
    setLoading(true);

    let query = supabase
      .from("stories")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (search.trim()) {
      query = query.ilike("user_id", `%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error(error);
      alert("Could not load stories.");
    } else {
      setStories(data || []);
    }

    setLoading(false);
  }

  async function deleteStory(id: string) {
    if (!confirm("Delete this story?")) return;

    const { error } = await supabase
      .from("stories")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("Could not delete story.");
      return;
    }

    await loadStories();
  }

  useEffect(() => {
    loadStories();
  }, []);

  return (
    <>
      <div>
        <p className="text-sm uppercase tracking-[0.35em] text-yellow-400">
          Stories
        </p>

        <h2 className="mt-3 text-4xl font-black md:text-5xl">
          Story Moderation
        </h2>

        <p className="mt-4 max-w-2xl text-zinc-400">
          View and moderate the latest stories shared on Frame.
        </p>
      </div>

      <section className="mt-10 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
        <div className="grid gap-4 md:grid-cols-[1fr_auto]">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by user ID..."
            className="rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none placeholder:text-zinc-500"
          />

          <button
            onClick={loadStories}
            className="rounded-2xl bg-yellow-400 px-6 py-4 font-bold text-black hover:bg-yellow-300"
          >
            Search
          </button>
        </div>
      </section>

      <section className="mt-8 grid gap-5">
        {loading ? (
          <EmptyState text="Loading stories..." />
        ) : stories.length === 0 ? (
          <EmptyState text="No stories found." />
        ) : (
          stories.map((story) => (
            <div
              key={story.id}
              className="rounded-3xl border border-white/10 bg-white/[0.04] p-6"
            >
              <div className="grid gap-6 md:grid-cols-[220px_1fr]">
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-black">
  {story.media_type === "video" && story.video_url ? (
    <video
      src={story.video_url}
      controls
      className="h-72 w-full object-cover"
    />
  ) : story.image_url ? (
    <img
      src={story.image_url}
      alt="Story media"
      className="h-72 w-full object-cover"
    />
  ) : (
    <div className="flex h-72 w-full items-center justify-center text-sm text-zinc-500">
      No media
    </div>
  )}
</div>

                <div>

                  <h3 className="text-xl font-bold">
                    Story #{story.id.slice(0,8)}
                  </h3>

                  <p className="mt-2 text-zinc-400">
                    User: {story.user_id}
                  </p>

                  <p className="mt-1 text-sm text-zinc-500">
                    {story.created_at
                      ? new Date(story.created_at).toLocaleString()
                      : ""}
                  </p>

                  <div className="mt-8 flex gap-3">

                    <button
                      className="rounded-full border border-white/10 px-5 py-3 text-sm font-bold hover:bg-white/10"
                    >
                      View
                    </button>

                    <button
                      onClick={() => deleteStory(story.id)}
                      className="rounded-full bg-red-500 px-5 py-3 text-sm font-bold text-white hover:bg-red-400"
                    >
                      Delete
                    </button>

                  </div>

                </div>
              </div>
            </div>
          ))
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
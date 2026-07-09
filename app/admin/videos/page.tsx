"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type VideoPost = {
  id: string;
  created_at: string;
  user_id: string | null;
  caption?: string | null;
  image_url?: string | null;
  media_url?: string | null;
  video_url?: string | null;
  media_type?: string | null;
};

export default function VideosPage() {
  const [videos, setVideos] = useState<VideoPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  async function loadVideos() {
    setLoading(true);

    let query = supabase
      .from("posts")
      .select("*")
      .eq("media_type", "video")
      .order("created_at", { ascending: false })
      .limit(50);

    if (search.trim()) {
      query = query.or(`caption.ilike.%${search}%,user_id.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error(error);
      alert("Could not load videos.");
    } else {
      setVideos(data || []);
    }

    setLoading(false);
  }

  async function deleteVideo(id: string) {
    const confirmed = confirm("Delete this video post? This cannot be undone.");

    if (!confirmed) return;

    const { error } = await supabase.from("posts").delete().eq("id", id);

    if (error) {
      console.error(error);
      alert("Could not delete video.");
      return;
    }

    await loadVideos();
  }

  useEffect(() => {
    loadVideos();
  }, []);

  return (
    <>
      <div>
        <p className="text-sm uppercase tracking-[0.35em] text-yellow-400">
          Videos
        </p>

        <h2 className="mt-3 text-4xl font-black md:text-5xl">
          Video Moderation
        </h2>

        <p className="mt-4 max-w-2xl text-zinc-400">
          Review recent video uploads, search captions and remove video content
          if needed.
        </p>
      </div>

      <section className="mt-10 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
        <div className="grid gap-4 md:grid-cols-[1fr_auto]">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search video captions or user ID..."
            className="rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none placeholder:text-zinc-500"
          />

          <button
            onClick={loadVideos}
            className="rounded-2xl bg-yellow-400 px-6 py-4 font-bold text-black hover:bg-yellow-300"
          >
            Search
          </button>
        </div>
      </section>

      <section className="mt-8 grid gap-5">
        {loading ? (
          <EmptyState text="Loading videos..." />
        ) : videos.length === 0 ? (
          <EmptyState text="No videos found." />
        ) : (
          videos.map((video) => {
            const media =
              video.video_url || video.media_url || video.image_url || "";

            return (
              <div
                key={video.id}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-6"
              >
                <div className="grid gap-6 md:grid-cols-[220px_1fr]">
                  <div className="overflow-hidden rounded-2xl border border-white/10 bg-black">
                    {media ? (
                      <video
                        src={media}
                        className="h-72 w-full object-cover"
                        controls
                      />
                    ) : (
                      <div className="flex h-72 items-center justify-center text-sm text-zinc-500">
                        No video
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex flex-col justify-between gap-4 md:flex-row">
                      <div>
                        <h3 className="text-xl font-bold">
                          Video #{video.id.slice(0, 8)}
                        </h3>

                        <p className="mt-1 text-sm text-zinc-500">
                          User: {video.user_id || "Unknown"}
                        </p>

                        <p className="mt-1 text-sm text-zinc-500">
                          {video.created_at
                            ? new Date(video.created_at).toLocaleString()
                            : "Unknown date"}
                        </p>
                      </div>

                      <span className="h-fit rounded-full bg-yellow-400 px-4 py-2 text-sm font-bold text-black">
                        Video
                      </span>
                    </div>

                    <p className="mt-5 text-zinc-300">
                      {video.caption || "No caption"}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <button className="rounded-full border border-white/10 px-5 py-3 text-sm font-bold text-white hover:bg-white/10">
                        Preview
                      </button>

                      <button className="rounded-full border border-yellow-400/40 px-5 py-3 text-sm font-bold text-yellow-400 hover:bg-yellow-400/10">
                        Feature
                      </button>

                      <button
                        onClick={() => deleteVideo(video.id)}
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
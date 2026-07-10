"use client";

import type { VideoPost } from "@/lib/getVideos";
import FrameSlide from "./FrameSlide";

export default function FramePlayer({ videos }: { videos: VideoPost[] }) {
  if (videos.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black px-6 text-center text-white">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-12">
          <h1 className="text-3xl font-black">No videos yet</h1>
          <p className="mt-4 text-zinc-400">
            As creators begin sharing videos, they&apos;ll appear here.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide bg-black text-white touch-pan-y overscroll-contain">
      {videos.map((video) => (
        <FrameSlide key={video.id} video={video} />
      ))}
    </main>
  );
}
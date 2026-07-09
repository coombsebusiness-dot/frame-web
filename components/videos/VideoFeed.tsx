"use client";

import type { VideoPost } from "@/lib/getVideos";
import VideoCard from "./VideoCard";

export default function VideoFeed({ videos }: { videos: VideoPost[] }) {
    console.log("VIDEOS COUNT:", videos.length);
  if (videos.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-black px-6 text-center">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-12">
          <h2 className="text-3xl font-black">No videos yet</h2>
          <p className="mt-4 text-zinc-400">
            As creators begin sharing videos, they'll appear here.
          </p>
        </div>
      </div>
    );
  }

return (
  <div className="h-screen overflow-y-scroll snap-y snap-mandatory scrollbar-hide bg-black touch-pan-y overscroll-contain">
    {videos.map((video) => (
      <section
        key={video.id}
        className="flex h-screen snap-start items-center justify-center px-4 touch-pan-y"
      >
        <div className="aspect-[9/16] h-[92vh] max-h-[820px] max-w-[430px] overflow-hidden rounded-[2rem] bg-black shadow-2xl">
          <VideoCard video={video} />
        </div>
      </section>
    ))}
  </div>
);
}
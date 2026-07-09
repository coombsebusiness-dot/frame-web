"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { VideoPost } from "@/lib/getVideos";
import { useVideoVisibility } from "@/hooks/useVideoVisibility";

export default function VideoCard({ video }: { video: VideoPost }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isVisible = useVideoVisibility(videoRef);
  console.log("VISIBLE VIDEO:", video.id, isVisible);
  const [muted, setMuted] = useState(true);
  const [likes, setLikes] = useState(video.like_count || 0);
  const [liked, setLiked] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const lastTap = useRef(0);

  const src = video.video_url;
  const creator = video.profiles;
  const name = creator?.display_name || creator?.username || "Frame Creator";

  if (!src) return null;

  function handleTap() {
    const now = Date.now();

    if (now - lastTap.current < 300) {
      setLiked(true);
      setLikes((current) => current + (liked ? 0 : 1));
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 650);
      return;
    }

    lastTap.current = now;

    setTimeout(() => {
      if (Date.now() - lastTap.current >= 300) {
        const nextMuted = !muted;
        setMuted(nextMuted);
        if (videoRef.current) {
          videoRef.current.muted = nextMuted;
        }
      }
    }, 300);
  }

  return (
    <article className="relative h-full w-full overflow-hidden bg-black">
     <video
  ref={videoRef}
  src={src}
  muted={muted}
  loop
  playsInline
  preload="metadata"
  onClick={handleTap}
  className="h-full w-full object-cover"
/>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

      {showHeart && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-7xl">
          ❤️
        </div>
      )}

      <div className="absolute bottom-6 left-5 right-20 z-10">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 overflow-hidden rounded-2xl bg-zinc-900">
            {creator?.avatar_url ? (
              <img
                src={creator.avatar_url}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center font-black text-yellow-400">
                {name[0].toUpperCase()}
              </div>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="truncate font-black">{name}</p>

              {(creator?.is_founding_creator || creator?.is_golden_creator) && (
                <Image
                  src="/assets/gold-frame-64.png"
                  alt="The Gold Frame"
                  width={20}
                  height={20}
                />
              )}
            </div>

            <p className="text-xs text-zinc-400">
              {muted ? "Tap for sound" : "Tap to mute"}
            </p>
          </div>
        </div>

        {video.caption && (
          <p className="mt-4 line-clamp-3 text-sm leading-6 text-zinc-200">
            {video.caption}
          </p>
        )}
      </div>

      <div className="absolute bottom-8 right-4 z-10 grid gap-5 text-center">
        <button
          onClick={() => {
            setLiked(true);
            setLikes((current) => current + (liked ? 0 : 1));
          }}
          className="grid gap-1 text-white"
        >
          <span className="text-3xl">{liked ? "❤️" : "🤍"}</span>
          <span className="text-xs font-bold">{likes}</span>
        </button>

        <button className="grid gap-1 text-white">
          <span className="text-3xl">💬</span>
          <span className="text-xs font-bold">{video.comment_count}</span>
        </button>

        <button className="grid gap-1 text-white">
          <span className="text-3xl">🔖</span>
          <span className="text-xs font-bold">{video.save_count}</span>
        </button>

        <button className="grid gap-1 text-white">
          <span className="text-3xl">↗️</span>
          <span className="text-xs font-bold">Share</span>
        </button>
      </div>
    </article>
  );
}
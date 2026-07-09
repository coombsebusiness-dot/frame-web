"use client";

import { forwardRef, useRef, useState } from "react";
import type { VideoPost } from "@/lib/getVideos";

const FrameVideo = forwardRef<HTMLVideoElement, { video: VideoPost }>(
  function FrameVideo({ video }, ref) {
    const [muted, setMuted] = useState(true);
    const lastTap = useRef(0);
    const src = video.video_url;

    if (!src) return null;

    function handleTap() {
      const now = Date.now();

      if (now - lastTap.current < 300) {
        window.dispatchEvent(
          new CustomEvent("frame-video-like", { detail: { postId: video.id } })
        );
        return;
      }

      lastTap.current = now;

      setTimeout(() => {
        if (Date.now() - lastTap.current >= 300) {
          setMuted((current) => !current);
        }
      }, 300);
    }

    return (
      <video
        ref={ref}
        src={src}
        muted={muted}
        loop
        playsInline
        preload="metadata"
        onClick={handleTap}
        className="h-full w-full object-cover"
      />
    );
  }
);

export default FrameVideo;
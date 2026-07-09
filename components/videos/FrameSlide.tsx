"use client";

import { useEffect, useRef, useState } from "react";
import type { VideoPost } from "@/lib/getVideos";
import FrameVideo from "./FrameVideo";
import FrameOverlay from "./FrameOverlay";

export default function FrameSlide({ video }: { video: VideoPost }) {
  const slideRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const slide = slideRef.current;
    if (!slide) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setActive(entry.isIntersecting && entry.intersectionRatio >= 0.65);
      },
      { threshold: [0, 0.25, 0.5, 0.65, 0.85, 1] }
    );

    observer.observe(slide);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    if (active) {
      videoEl.play().catch(() => {});
    } else {
      videoEl.pause();
    }
  }, [active]);

  return (
    <section
      ref={slideRef}
      className="flex h-screen snap-start items-center justify-center px-4 touch-pan-y"
    >
      <div className="relative aspect-[9/16] h-[92vh] max-h-[820px] max-w-[430px] overflow-hidden rounded-[2rem] bg-black shadow-2xl">
        <FrameVideo ref={videoRef} video={video} />
        <FrameOverlay video={video} />
      </div>
    </section>
  );
}
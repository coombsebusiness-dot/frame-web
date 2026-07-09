"use client";

import { RefObject, useEffect, useState } from "react";

export function useVideoVisibility(
  videoRef: RefObject<HTMLVideoElement | null>
) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting && entry.intersectionRatio >= 0.7;
        setIsVisible(visible);

        if (visible) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      {
        threshold: [0, 0.25, 0.5, 0.7, 1],
      }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, [videoRef]);

  return isVisible;
}
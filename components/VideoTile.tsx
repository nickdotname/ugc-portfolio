"use client";

import { useEffect, useRef, useState } from "react";
import type { Video } from "@/content/types";
import { buildCaption, streamHlsUrl, streamThumbnailUrl } from "@/content/types";

type VideoTileProps = {
  video: Video;
  onOpen: (video: Video) => void;
  caption?: boolean;
};

export default function VideoTile({ video, onOpen, caption = true }: VideoTileProps) {
  const [hovered, setHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const tileRef = useRef<HTMLButtonElement>(null);
  const loopSrc = video.previewLoopId
    ? streamHlsUrl(video.previewLoopId)
    : video.localLoopSrc;
  const hasPlayableLoop = Boolean(loopSrc);
  const posterSrc =
    video.poster || (video.streamId ? streamThumbnailUrl(video.streamId) : undefined);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !hasPlayableLoop) return;
    if (hovered) {
      el.play().catch(() => {});
    } else {
      el.pause();
      el.currentTime = 0;
    }
  }, [hovered, hasPlayableLoop]);

  // Mobile: play the loop once the tile is mostly in view, since there's no hover.
  useEffect(() => {
    const el = tileRef.current;
    if (!el || !hasPlayableLoop) return;
    const observer = new IntersectionObserver(
      ([entry]) => setHovered(entry.isIntersecting),
      { threshold: 0.6 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasPlayableLoop]);

  return (
    <div className="flex-shrink-0 w-[72vw] sm:w-auto snap-center">
      <button
        ref={tileRef}
        type="button"
        onClick={() => onOpen(video)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative aspect-[9/16] w-full bg-ink block text-left"
      >
        {hasPlayableLoop ? (
          <video
            ref={videoRef}
            className={`h-full w-full object-cover transition-[filter] duration-500 ${
              hovered ? "grayscale-0" : "grayscale"
            }`}
            src={loopSrc}
            poster={posterSrc}
            muted
            loop
            playsInline
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 mono text-[10px] text-ghost/60 text-center px-4">
            <span>{video.brand}</span>
            <span>[ NO FOOTAGE YET ]</span>
          </div>
        )}
      </button>
      {caption && (
        <p className="mono text-[10px] sm:text-[11px] mt-2 text-muted">
          {buildCaption(video)}
        </p>
      )}
    </div>
  );
}

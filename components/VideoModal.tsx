"use client";

import { useEffect } from "react";
import type { Video } from "@/content/types";
import { buildCaption, streamHlsUrl, streamThumbnailUrl } from "@/content/types";

type VideoModalProps = {
  video: Video | null;
  onClose: () => void;
};

export default function VideoModal({ video, onClose }: VideoModalProps) {
  useEffect(() => {
    if (!video) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [video, onClose]);

  if (!video) return null;

  const fullSrc = video.streamId ? streamHlsUrl(video.streamId) : video.localSrc;
  const posterSrc =
    video.poster || (video.streamId ? streamThumbnailUrl(video.streamId) : undefined);

  return (
    <div
      className="fixed inset-0 z-[60] bg-ink/95 flex items-center justify-center p-4 sm:p-10"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="mono absolute top-4 right-4 sm:top-8 sm:right-8 text-ghost text-[12px] border border-ghost/40 px-3 py-2 hover:bg-ghost hover:text-ink transition-colors"
      >
        [ CLOSE ✕ ]
      </button>

      <div
        className="flex flex-col items-center gap-4 max-h-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-[9/16] h-[70vh] bg-black">
          {fullSrc ? (
            <video
              className="h-full w-full object-contain"
              src={fullSrc}
              poster={posterSrc}
              controls
              autoPlay
              playsInline
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 mono text-[11px] text-ghost/60 text-center px-6">
              <span>{video.brand}</span>
              <span>[ NO FOOTAGE YET ]</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between w-full max-w-[400px] mono text-[11px] text-ghost">
          <span>{buildCaption(video)}</span>
          {video.liveUrl && (
            <a
              href={video.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-signal transition-colors"
            >
              VIEW LIVE ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

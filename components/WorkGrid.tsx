"use client";

import { useMemo, useState } from "react";
import videosData from "@/content/videos.json";
import type { Video, VideoCategory } from "@/content/types";
import { CATEGORY_LABELS, buildCaption } from "@/content/types";
import VideoTile from "./VideoTile";
import VideoModal from "./VideoModal";

const videos = videosData as Video[];

const FILTERS: { label: string; value: VideoCategory | "all" }[] = [
  { label: "ALL", value: "all" },
  { label: CATEGORY_LABELS["product-demo"], value: "product-demo" },
  { label: CATEGORY_LABELS["testimonial"], value: "testimonial" },
  { label: CATEGORY_LABELS["skit"], value: "skit" },
  { label: CATEGORY_LABELS["ai-walkthrough"], value: "ai-walkthrough" },
];

export default function WorkGrid() {
  const [filter, setFilter] = useState<VideoCategory | "all">("all");
  const [openVideo, setOpenVideo] = useState<Video | null>(null);
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const list =
      filter === "all" ? videos : videos.filter((v) => v.category === filter);
    return [...list].sort((a, b) => Number(b.featured) - Number(a.featured));
  }, [filter]);

  return (
    <section id="work" className="relative px-4 sm:px-8 py-24 sm:py-32">
      <h2
        className="display text-ink"
        style={{ fontSize: "clamp(3.5rem, 12vw, 10rem)" }}
      >
        WORK
      </h2>

      <div className="mono text-[11px] sm:text-[12px] flex flex-wrap gap-x-6 gap-y-2 mt-8 mb-12 border-t border-b border-ink/15 py-4">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`transition-colors ${
              filter === f.value ? "text-ink" : "text-muted hover:text-ink"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-x-4 gap-y-10">
        {/* Credits-sheet index, left column on desktop */}
        <div className="col-span-12 lg:col-span-4 order-2 lg:order-1">
          <dl className="mono text-[11px] leading-relaxed">
            {filtered.map((video) => (
              <div
                key={video.slug}
                onMouseEnter={() => setHoveredSlug(video.slug)}
                onMouseLeave={() => setHoveredSlug(null)}
                onClick={() => setOpenVideo(video)}
                className={`flex justify-between gap-4 py-2 border-t border-ink/15 cursor-pointer transition-colors ${
                  hoveredSlug === video.slug ? "text-signal" : ""
                }`}
              >
                <dt>{buildCaption(video)}</dt>
                <dd className="text-muted shrink-0">{video.date}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Video grid: 3-across desktop, horizontal snap-scroll on mobile */}
        <div
          className="col-span-12 lg:col-span-8 order-1 lg:order-2
            flex lg:grid lg:grid-cols-3 gap-4
            overflow-x-auto lg:overflow-visible snap-x snap-mandatory
            -mx-4 px-4 lg:mx-0 lg:px-0"
        >
          {filtered.map((video) => (
            <VideoTile
              key={video.slug}
              video={video}
              highlighted={hoveredSlug === video.slug}
              onOpen={setOpenVideo}
              onHoverChange={setHoveredSlug}
            />
          ))}
        </div>
      </div>

      <VideoModal video={openVideo} onClose={() => setOpenVideo(null)} />
    </section>
  );
}

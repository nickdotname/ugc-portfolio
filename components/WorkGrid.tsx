"use client";

import { useMemo, useState } from "react";
import videosData from "@/content/videos.json";
import type { Video } from "@/content/types";
import VideoTile from "./VideoTile";
import VideoModal from "./VideoModal";

const videos = videosData as Video[];

export default function WorkGrid() {
  const [openVideo, setOpenVideo] = useState<Video | null>(null);

  const sorted = useMemo(
    () => [...videos].sort((a, b) => Number(b.featured) - Number(a.featured)),
    []
  );

  return (
    <section id="work" className="relative px-4 sm:px-8 py-24 sm:py-32">
      <h2
        className="display text-ink mb-12 sm:mb-16"
        style={{ fontSize: "clamp(3.5rem, 12vw, 10rem)" }}
      >
        WORK
      </h2>

      <div
        className="flex lg:grid lg:grid-cols-3 gap-4
          overflow-x-auto lg:overflow-visible snap-x snap-mandatory
          -mx-4 px-4 lg:mx-0 lg:px-0"
      >
        {sorted.map((video) => (
          <VideoTile key={video.slug} video={video} onOpen={setOpenVideo} caption={false} />
        ))}
      </div>

      <VideoModal video={openVideo} onClose={() => setOpenVideo(null)} />
    </section>
  );
}

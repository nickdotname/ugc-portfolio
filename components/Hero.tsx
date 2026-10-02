"use client";

import { useState, useRef } from "react";
import GhostType from "./GhostType";
import CreditsList from "./CreditsList";
import { site } from "@/content/site";

export default function Hero() {
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  function toggleSound() {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  }

  function scrollToContact() {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section className="relative min-h-screen grid grid-cols-12 gap-x-4 px-4 sm:px-8 pt-28 pb-16 overflow-hidden">
      {/* Headline + manifesto: ghost type painted over the mono paragraph so
          mix-blend-difference inverts wherever the two overlap. No z-index
          here on purpose — z-index would open a new stacking context and
          isolate the blend from the paragraph behind it. */}
      <div className="col-span-12 lg:col-span-8 relative">
        <p className="mono text-[11px] sm:text-[13px] leading-loose max-w-xl">
          {site.manifesto}
        </p>
        <div className="absolute top-0 left-0 w-full">
          <GhostType lines={["NICK", "BENAK"]} />
          <div
            className="display text-ink mt-2"
            style={{ fontSize: "clamp(1.5rem, 4vw, 3rem)" }}
          >
            UGC CREATOR
          </div>
        </div>
      </div>

      {/* Credits index + CTA, right column */}
      <div className="col-span-12 lg:col-span-4 lg:col-start-9 relative mt-12 lg:mt-0 flex flex-col justify-between gap-12">
        <CreditsList
          rows={[
            { label: "CURRENTLY CREATING FOR", values: site.currentlyCreatingFor },
            { label: "BASED IN", values: [site.basedIn] },
            { label: "AVAILABLE FOR", values: [site.availableFor] },
          ]}
        />

        <div className="flex flex-col gap-6">
          {/* Sizzle reel tile */}
          <div className="relative aspect-[9/16] w-full max-w-[240px] bg-ink">
            <video
              ref={videoRef}
              className="h-full w-full object-cover grayscale"
              autoPlay
              muted
              loop
              playsInline
              poster=""
            >
              {/* [FILL IN]: replace with sizzle reel source once ingested */}
            </video>
            <div className="absolute inset-0 flex items-center justify-center mono text-[10px] text-ghost/60 text-center px-4">
              SIZZLE REEL
              <br />
              [ DROP 15–30S LOOP HERE ]
            </div>
            <button
              onClick={toggleSound}
              className="mono absolute bottom-3 left-3 text-[10px] px-2 py-1 border border-ghost/40 text-ghost hover:bg-ghost hover:text-ink transition-colors"
            >
              [ SOUND {muted ? "OFF" : "ON"} ]
            </button>
          </div>

          <button
            onClick={scrollToContact}
            className="mono text-[13px] border border-ink px-5 py-3 text-left hover:bg-ink hover:text-ghost transition-colors w-full max-w-[240px]"
          >
            WORK WITH ME →
          </button>
        </div>
      </div>
    </section>
  );
}

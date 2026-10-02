import GhostType from "./GhostType";
import CreditsList from "./CreditsList";
import { site } from "@/content/site";

export default function Hero() {
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

      {/* Credits index + manifesto (clean, fully readable copy), right column */}
      <div className="col-span-12 lg:col-span-4 lg:col-start-9 relative mt-12 lg:mt-0 flex flex-col justify-between gap-12">
        <CreditsList
          rows={[
            { label: "CURRENTLY CREATING FOR", values: site.currentlyCreatingFor },
            { label: "BASED IN", values: [site.basedIn] },
            { label: "AVAILABLE FOR", values: [site.availableFor] },
          ]}
        />

        <p className="mono text-[11px] leading-relaxed text-muted max-w-xs">
          {site.manifesto}
        </p>
      </div>
    </section>
  );
}

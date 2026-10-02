import CreditsList from "./CreditsList";
import { site } from "@/content/site";

export default function Hero() {
  return (
    <section className="relative min-h-screen grid grid-cols-12 gap-x-4 px-4 sm:px-8 pt-28 pb-16 overflow-hidden">
      <div className="col-span-12 lg:col-span-8">
        <h1 className="display text-ink">
          <span className="block" style={{ fontSize: "clamp(5rem, 18vw, 22rem)" }}>
            NICK
          </span>
          <span className="block" style={{ fontSize: "clamp(5rem, 18vw, 22rem)" }}>
            BENAK
          </span>
        </h1>
        <div
          className="display text-ink mt-2"
          style={{ fontSize: "clamp(1.5rem, 4vw, 3rem)" }}
        >
          UGC CREATOR
        </div>
      </div>

      {/* Credits index + manifesto, right column */}
      <div className="col-span-12 lg:col-span-4 lg:col-start-9 relative mt-12 lg:mt-0 flex flex-col justify-between gap-12">
        <CreditsList
          rows={[
            { label: "CREATED FOR", values: site.createdFor },
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

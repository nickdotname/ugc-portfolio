export type VideoCategory =
  | "product-demo"
  | "testimonial"
  | "skit"
  | "ai-walkthrough"
  | "ai-generated";

export type VideoStats = {
  views: number | null;
  likes: number | null;
  shares: number | null;
  saves: number | null;
};

export type Video = {
  slug: string;
  title: string;
  brand: string;
  category: VideoCategory;
  platform: string;
  liveUrl: string;
  /** Cloudflare Stream UID. Leave blank while hosting locally via localSrc/localLoopSrc. */
  streamId: string;
  /** Cloudflare Stream UID for the muted hover loop. */
  previewLoopId: string;
  /** Poster image: an absolute Stream thumbnail URL, or a /public-relative path. */
  poster: string;
  /** Full clip served from /public, used when streamId is blank. */
  localSrc?: string;
  /** Muted hover loop served from /public, used when previewLoopId is blank. */
  localLoopSrc?: string;
  stats: VideoStats;
  featured: boolean;
  date: string;
};

export const CATEGORY_LABELS: Record<VideoCategory, string> = {
  "product-demo": "PRODUCT DEMO",
  testimonial: "TESTIMONIAL",
  skit: "SKIT",
  "ai-walkthrough": "AI WALKTHROUGH",
  "ai-generated": "AI GENERATED",
};

export function formatViews(views: number | null): string | null {
  if (views === null) return null;
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M VIEWS`;
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}K VIEWS`;
  return `${views} VIEWS`;
}

export function buildCaption(video: Video): string {
  const parts = [video.brand, CATEGORY_LABELS[video.category]];
  const views = formatViews(video.stats.views);
  if (views) parts.push(views);
  return parts.join(" · ");
}

export function streamThumbnailUrl(streamId: string): string {
  return `https://videodelivery.net/${streamId}/thumbnails/thumbnail.jpg`;
}

export function streamHlsUrl(streamId: string): string {
  return `https://videodelivery.net/${streamId}/manifest/video.m3u8`;
}

export function streamIframeUrl(streamId: string): string {
  return `https://iframe.videodelivery.net/${streamId}`;
}

/**
 * Ingests a raw video export into the portfolio:
 *   1. ffmpeg -> compressed 1080x1920 H.264 copy + a muted 4-6s hover loop
 *   2. uploads both to Cloudflare Stream
 *   3. appends a (mostly blank) entry to content/videos.json for Nick to fill in
 *
 * Usage:
 *   npm run ingest -- raw-videos/lovable-demo.mov --brand "Lovable" --category product-demo
 */
import "dotenv/config";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import fs from "node:fs";
import type { Video, VideoCategory } from "../content/types";

const execFileAsync = promisify(execFile);

const VIDEOS_JSON = path.join(process.cwd(), "content", "videos.json");
const VALID_CATEGORIES: VideoCategory[] = [
  "product-demo",
  "testimonial",
  "skit",
  "ai-walkthrough",
  "ai-generated",
];

function parseArgs(argv: string[]) {
  const [input, ...rest] = argv;
  if (!input) {
    throw new Error(
      "Usage: npm run ingest -- <path-to-raw-video> [--brand NAME] [--category product-demo]"
    );
  }
  const opts: Record<string, string> = {};
  for (let i = 0; i < rest.length; i += 2) {
    const key = rest[i]?.replace(/^--/, "");
    const value = rest[i + 1];
    if (key && value) opts[key] = value;
  }
  const category = (opts.category ?? "product-demo") as VideoCategory;
  if (!VALID_CATEGORIES.includes(category)) {
    throw new Error(
      `Invalid --category "${category}". Must be one of: ${VALID_CATEGORIES.join(", ")}`
    );
  }
  return {
    input,
    brand: opts.brand ?? "[FILL IN]",
    category,
    platform: opts.platform ?? "tiktok",
  };
}

async function transcode(input: string, outDir: string) {
  const fullCopy = path.join(outDir, "full.mp4");
  const loop = path.join(outDir, "loop.mp4");

  // Full compressed copy, scaled/cropped to 1080x1920, H.264 + AAC.
  await execFileAsync("ffmpeg", [
    "-y",
    "-i", input,
    "-vf", "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920",
    "-c:v", "libx264",
    "-preset", "slow",
    "-crf", "21",
    "-c:a", "aac",
    "-b:a", "128k",
    "-movflags", "+faststart",
    fullCopy,
  ]);

  // Muted 5s hover-preview loop from the start of the clip.
  await execFileAsync("ffmpeg", [
    "-y",
    "-i", input,
    "-t", "5",
    "-vf", "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920",
    "-an",
    "-c:v", "libx264",
    "-preset", "slow",
    "-crf", "23",
    "-movflags", "+faststart",
    loop,
  ]);

  return { fullCopy, loop };
}

async function uploadToStream(filePath: string, accountId: string, token: string) {
  const buffer = await readFile(filePath);
  const form = new FormData();
  form.append("file", new Blob([buffer]), path.basename(filePath));

  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    }
  );

  const json = (await res.json()) as {
    success: boolean;
    result?: { uid: string; thumbnail: string };
    errors?: unknown;
  };

  if (!json.success || !json.result) {
    throw new Error(`Cloudflare Stream upload failed: ${JSON.stringify(json.errors)}`);
  }

  return json.result;
}

async function main() {
  const { input, brand, category, platform } = parseArgs(process.argv.slice(2));

  const accountId = process.env.CF_ACCOUNT_ID;
  const token = process.env.CF_STREAM_API_TOKEN;
  if (!accountId || !token) {
    throw new Error(
      "Missing CF_ACCOUNT_ID / CF_STREAM_API_TOKEN in .env.local (Stream-edit-only token)."
    );
  }
  if (!fs.existsSync(input)) {
    throw new Error(`Input file not found: ${input}`);
  }

  const outDir = await mkdtemp(path.join(tmpdir(), "ingest-"));
  try {
    console.log(`Transcoding ${input}...`);
    const { fullCopy, loop } = await transcode(input, outDir);

    console.log("Uploading full copy to Cloudflare Stream...");
    const fullResult = await uploadToStream(fullCopy, accountId, token);

    console.log("Uploading hover loop to Cloudflare Stream...");
    const loopResult = await uploadToStream(loop, accountId, token);

    const slug = path
      .basename(input, path.extname(input))
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const entry: Video = {
      slug,
      title: "[FILL IN]",
      brand,
      category,
      platform,
      liveUrl: "",
      streamId: fullResult.uid,
      previewLoopId: loopResult.uid,
      poster: fullResult.thumbnail,
      stats: { views: null, likes: null, shares: null, saves: null },
      featured: false,
      date: new Date().toISOString().slice(0, 7),
    };

    const existing: Video[] = JSON.parse(await readFile(VIDEOS_JSON, "utf-8"));
    existing.push(entry);
    await fs.promises.writeFile(VIDEOS_JSON, JSON.stringify(existing, null, 2) + "\n");

    console.log(`Appended "${slug}" to content/videos.json. Fill in title/stats by hand.`);
  } finally {
    await rm(outDir, { recursive: true, force: true });
  }
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});

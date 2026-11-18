// Turns the raw phone photos into graded, cropped, plate-blurred, responsive images.
//
//   npm run images            (everything)
//   npm run images -- --logo-only
//   npm run images:lowglow    (only the LowGlow example photos + videos; keeps everything else as-is)
//
// Input:  .raw-photos/*.jpg   (originals from Google Drive — gitignored, never served)
// Output: public/images/site/<slug>-<width>.{avif,webp}
//         public/images/logo.png (transparent), app/icon.png, app/apple-icon.png
//         content/images.generated.ts (sizes + blur placeholders)
//
// Every crop / blur box is written as fractions of the ORIGINAL image (0–1),
// so boxes are easy to adjust after eyeballing a photo.

import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const RAW = path.join(ROOT, ".raw-photos");
const OUT = path.join(ROOT, "public/images/site");
const WIDTHS = [480, 768, 1200, 1600];

/** @type {Array<{slug:string, file:string, rotate?:number, blur?:number[][], crop:number[], grade?:boolean}>} */
const PHOTOS = [
  // Photo 02 has flyer text baked in. Two text-free crops: Mike portrait + wide car strip.
  { slug: "mike-polisher-c8", file: "02-hero-mike-with-black-c8-corvette-igl-certified.jpg", crop: [0.557, 0.385, 1, 0.88] },
  { slug: "c8-mike-wide", file: "02-hero-mike-with-black-c8-corvette-igl-certified.jpg", crop: [0, 0.51, 1, 0.74] },
  {
    slug: "gmc-at4x-igl",
    file: "03-gmc-2500hd-at4x-4yr-igl-ceramic-coating.jpg",
    blur: [[0.765, 0.565, 0.87, 0.635]],
    crop: [0, 0.2, 1, 0.82],
  },
  {
    slug: "jeep-gladiator",
    file: "04-jeep-gladiator-decon-ceramic-sealant.jpg",
    blur: [[0.295, 0.55, 0.405, 0.61]],
    crop: [0.08, 0.27, 0.86, 0.72],
  },
  {
    slug: "ford-explorer",
    file: "05-ford-explorer-full-exterior-detail.jpg",
    blur: [[0.71, 0.585, 0.765, 0.645]],
    crop: [0.12, 0.22, 0.9, 0.84],
  },
  { slug: "z06-frunk-engine-bay", file: "06-c8-z06-frunk-engine-bay-detail.jpg", crop: [0.02, 0, 0.98, 1] },
  { slug: "z06-foam-wash", file: "08-z06-foam-cannon-wash.jpg", crop: [0, 0.12, 1, 0.75] },
  { slug: "monte-carlo-gloss", file: "09-86-monte-carlo-ceramic-coating-gloss.jpg", crop: [0, 0, 1, 0.755] },
  {
    slug: "mike-pressure-wash",
    file: "10-mike-on-site-pressure-wash.jpg",
    blur: [[0.86, 0.43, 1, 0.51]],
    crop: [0, 0.12, 1, 0.75],
  },
  {
    slug: "chevy-trax",
    file: "11-2025-chevy-trax-polish-ceramic.jpg",
    blur: [[0.715, 0.585, 0.915, 0.67]],
    crop: [0, 0.115, 1, 0.765],
  },
  { slug: "toyota-tacoma", file: "12-toyota-tacoma-exterior-detail.jpg", crop: [0.05, 0, 0.665, 1] },
  { slug: "shop-hex-bay", file: "13-shop-interior-hex-lights-c8.jpg", rotate: -11, crop: [0.18, 0.12, 0.82, 0.86] },
  { slug: "shop-hex-ceiling", file: "13-shop-interior-hex-lights-c8.jpg", rotate: -11, crop: [0.24, 0.12, 0.82, 0.4] },
];

// LowGlow example media for the Lighting page — stand-ins until Mike has his own
// ambient / starlight install photos. Pulled from LowGlow's public product pages
// (lowglow.shop; Mike is a LowGlow Certified Dealer) and credited on the page.
// Originals are cached in .raw-photos/lowglow/ (gitignored). Not graded: they're
// already professionally shot. Swap or delete entries here when real photos arrive.
const LOWGLOW_CDN = "https://cdn.shopify.com/s/files/1/0540/6867/4745/files/";
const LOWGLOW_VIDEO = "https://lowglow.shop/cdn/shop/videos/c/vp/";
const LOWGLOW_PHOTOS = [
  { slug: "lowglow-ambient-rainbow", url: `${LOWGLOW_CDN}lowglow-ambient-product-17.jpg` },
  { slug: "lowglow-ambient-green", url: `${LOWGLOW_CDN}lowglow-ambient-product-3.jpg` },
  { slug: "lowglow-ambient-rear", url: `${LOWGLOW_CDN}lowglow-ambient-product-34.jpg` },
  { slug: "lowglow-starlight-red", url: `${LOWGLOW_CDN}AMCJPHOTOS_JordanBRZ_NewWrap_02-26-2026-58.jpg` },
  { slug: "lowglow-starlight-seats", url: `${LOWGLOW_CDN}AMCJPHOTOS_JordanBRZ_NewWrap_02-26-2026-48.jpg` },
  { slug: "lowglow-starlight-pink", url: `${LOWGLOW_CDN}AMCJPHOTOS_JordanBRZ_NewWrap_02-26-2026-44.jpg` },
].map((p) => ({ ...p, file: `lowglow/${p.slug}.jpg`, crop: [0, 0, 1, 1], grade: false }));

/** Short, silent, looping clips. `clips` are [start, end] seconds, joined in order. */
const LOWGLOW_VIDEOS = [
  {
    slug: "lowglow-ambient",
    url: `${LOWGLOW_VIDEO}5922be6f3ed94dbcb20da328d96c8099/5922be6f3ed94dbcb20da328d96c8099.HD-1080p-2.5Mbps-62755644.mp4`,
    clips: [[7.4, 12.9], [17.4, 23.2]], // skips the blurry camera swings
    filter: "",
    crf: 24,
    posterAt: 2,
  },
  {
    slug: "lowglow-starlight",
    url: `${LOWGLOW_VIDEO}1d72983e5aad43f795c3b8fde6ecebdc/1d72983e5aad43f795c3b8fde6ecebdc.HD-1080p-2.5Mbps-85879890.mp4`,
    clips: [[1.5, 13.2]], // starts after the lights-off intro
    filter: ",eq=gamma=1.12:saturation=1.08",
    crf: 25,
    posterAt: 5,
  },
];
const VIDEO_OUT = path.join(ROOT, "public/images/video");
const VIDEO_MAX_W = 720;

const px = (f, n) => Math.round(f * n);

/** Download a remote original once into .raw-photos/ (cache). */
async function fetchOnce(url, rel) {
  const dest = path.join(RAW, rel);
  try {
    await fs.access(dest);
    return dest;
  } catch {}
  await fs.mkdir(path.dirname(dest), { recursive: true });
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (site image pipeline)" } });
  if (!res.ok) throw new Error(`Download failed (${res.status}): ${url}`);
  await fs.writeFile(dest, Buffer.from(await res.arrayBuffer()));
  return dest;
}

/** Trim + re-encode a clip to a small, silent, fast-start H.264 MP4 plus a WebP poster (needs ffmpeg). */
async function processVideo(v, videoManifest) {
  const src = await fetchOnce(v.url, `lowglow/${v.slug}.mp4`);
  const probe = execFileSync("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "csv=p=0", src]).toString().trim();
  const [srcW] = probe.split(",").map(Number);
  const scale = srcW > VIDEO_MAX_W ? `,scale=${VIDEO_MAX_W}:-2:flags=lanczos` : "";
  const parts = v.clips.map(([a, b], i) => `[0:v]trim=${a}:${b},setpts=PTS-STARTPTS[c${i}]`).join(";");
  const joined = v.clips.map((_, i) => `[c${i}]`).join("");
  const graph = `${parts};${joined}concat=n=${v.clips.length}:v=1:a=0,fps=30${scale}${v.filter}[v]`;
  await fs.mkdir(VIDEO_OUT, { recursive: true });
  const mp4 = path.join(VIDEO_OUT, `${v.slug}.mp4`);
  execFileSync("ffmpeg", ["-v", "error", "-y", "-i", src, "-filter_complex", graph, "-map", "[v]", "-an", "-c:v", "libx264", "-preset", "slow", "-crf", String(v.crf), "-profile:v", "high", "-pix_fmt", "yuv420p", "-movflags", "+faststart", mp4]);
  const frame = execFileSync("ffmpeg", ["-v", "error", "-ss", String(v.posterAt), "-i", mp4, "-frames:v", "1", "-f", "image2pipe", "-vcodec", "png", "-"], { maxBuffer: 64 * 1024 * 1024 });
  await sharp(frame).webp({ quality: 70 }).toFile(path.join(VIDEO_OUT, `${v.slug}-poster.webp`));
  const out = execFileSync("ffprobe", ["-v", "error", "-show_entries", "stream=width,height:format=duration", "-of", "json", mp4]).toString();
  const { streams, format } = JSON.parse(out);
  videoManifest[v.slug] = {
    src: `/images/video/${v.slug}.mp4`,
    poster: `/images/video/${v.slug}-poster.webp`,
    width: streams[0].width,
    height: streams[0].height,
    duration: Math.round(Number(format.duration) * 10) / 10,
  };
  const kb = Math.round((await fs.stat(mp4)).size / 1024);
  console.log(`✓ video ${v.slug} ${streams[0].width}x${streams[0].height} ${format.duration}s ${kb} KB`);
}

/** Pixelate + blur a box so nothing is readable. */
async function blurBoxes(buf, boxes) {
  const img = sharp(buf);
  const { width: W, height: H } = await img.metadata();
  const composites = [];
  for (const [x0, y0, x1, y1] of boxes) {
    const left = px(x0, W), top = px(y0, H);
    const width = Math.min(W - left, px(x1 - x0, W)), height = Math.min(H - top, px(y1 - y0, H));
    const region = await sharp(buf).extract({ left, top, width, height }).toBuffer();
    const tiny = await sharp(region).resize(Math.max(2, Math.round(width / 14)), Math.max(2, Math.round(height / 14))).toBuffer();
    const smeared = await sharp(tiny).resize(width, height, { kernel: "cubic" }).blur(Math.max(4, width / 10)).toBuffer();
    composites.push({ input: smeared, left, top });
  }
  return sharp(buf).composite(composites).toBuffer();
}

/** One consistent "night in the bay" grade: lifted blacks, cooler shadows, richer reds. */
function grade(pipeline) {
  return pipeline
    .linear([0.95, 0.95, 0.93], [7, 8, 15])
    .modulate({ saturation: 1.12, brightness: 0.97 })
    .recomb([
      [1.06, -0.03, -0.03],
      [-0.01, 1.0, 0.01],
      [-0.01, 0.0, 1.01],
    ])
    .sharpen({ sigma: 0.6 });
}

async function processPhoto(p, manifest) {
  let buf = await fs.readFile(path.join(RAW, p.file));
  buf = await sharp(buf).rotate().toBuffer(); // honour EXIF
  if (p.blur) buf = await blurBoxes(buf, p.blur); // blur on the original before anything else
  if (p.rotate) buf = await sharp(buf).rotate(p.rotate, { background: "#0a0a0b" }).toBuffer();
  const { width: W, height: H } = await sharp(buf).metadata();
  const [x0, y0, x1, y1] = p.crop;
  const box = { left: px(x0, W), top: px(y0, H), width: px(x1 - x0, W), height: px(y1 - y0, H) };
  box.width = Math.min(box.width, W - box.left);
  box.height = Math.min(box.height, H - box.top);
  const cropped = sharp(buf).extract(box);
  const master = await (p.grade === false ? cropped : grade(cropped)).toBuffer();
  const nativeW = box.width;
  const widths = [...new Set([...WIDTHS.filter((w) => w < nativeW), Math.min(nativeW, 1600)])].sort((a, b) => a - b);
  for (const w of widths) {
    const resized = sharp(master).resize({ width: w, withoutEnlargement: true });
    await resized.clone().avif({ quality: 52, effort: 6 }).toFile(path.join(OUT, `${p.slug}-${w}.avif`));
    await resized.clone().webp({ quality: 74, effort: 5 }).toFile(path.join(OUT, `${p.slug}-${w}.webp`));
  }
  const tiny = await sharp(master).resize(16).webp({ quality: 40 }).toBuffer();
  manifest[p.slug] = {
    width: nativeW,
    height: box.height,
    widths,
    blurDataURL: `data:image/webp;base64,${tiny.toString("base64")}`,
  };
  console.log(`✓ ${p.slug} ${nativeW}x${box.height} → ${widths.join("/")}`);
}

/** Logo: knock out the white page background (flood fill from the edges only). */
async function processLogo() {
  const src = path.join(RAW, "01-logo-mikes-automotive-detailing.jpg");
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;
  const isBg = (i) => data[i] > 222 && data[i + 1] > 222 && data[i + 2] > 222;
  const seen = new Uint8Array(W * H);
  const stack = [];
  for (let x = 0; x < W; x++) stack.push(x, (H - 1) * W + x);
  for (let y = 0; y < H; y++) stack.push(y * W, y * W + W - 1);
  while (stack.length) {
    const p = stack.pop();
    if (seen[p]) continue;
    seen[p] = 1;
    if (!isBg(p * 4)) continue;
    data[p * 4 + 3] = 0;
    const x = p % W, y = (p / W) | 0;
    if (x > 0) stack.push(p - 1);
    if (x < W - 1) stack.push(p + 1);
    if (y > 0) stack.push(p - W);
    if (y < H - 1) stack.push(p + W);
  }
  // Soften the cut edge: semi-transparent for light-grey fringe pixels next to removed ones.
  for (let p = 0; p < W * H; p++) {
    const i = p * 4;
    if (data[i + 3] === 0) continue;
    const lum = (data[i] + data[i + 1] + data[i + 2]) / 3;
    const x = p % W, y = (p / W) | 0;
    const nearCut = [p - 1, p + 1, p - W, p + W].some((q) => q >= 0 && q < W * H && data[q * 4 + 3] === 0 && Math.abs((q % W) - x) <= 1 && Math.abs(((q / W) | 0) - y) <= 1);
    if (nearCut && lum > 170) data[i + 3] = Math.round(255 * (1 - (lum - 170) / 85) * 0.9);
  }
  // Crop to the badge: rows/columns with a meaningful number of opaque pixels
  // (ignores stray JPEG edge pixels).
  const rowCount = new Array(H).fill(0), colCount = new Array(W).fill(0);
  for (let p = 0; p < W * H; p++) {
    if (data[p * 4 + 3] < 60) continue;
    rowCount[(p / W) | 0]++;
    colCount[p % W]++;
  }
  // Clear stray edge lines (1–2px columns/rows of JPEG junk along the borders).
  for (let y = 0; y < H; y++)
    for (const x of [0, 1, 2, W - 3, W - 2, W - 1]) data[(y * W + x) * 4 + 3] = 0;
  for (let x = 0; x < W; x++)
    for (const y of [0, 1, 2, H - 3, H - 2, H - 1]) data[(y * W + x) * 4 + 3] = 0;
  rowCount.fill(0);
  colCount.fill(0);
  for (let p = 0; p < W * H; p++) {
    if (data[p * 4 + 3] < 60) continue;
    rowCount[(p / W) | 0]++;
    colCount[p % W]++;
  }
  const first = (arr) => arr.findIndex((n) => n > 12);
  const last = (arr) => arr.length - 1 - [...arr].reverse().findIndex((n) => n > 12);
  const minX = first(colCount), maxX = last(colCount), minY = first(rowCount), maxY = last(rowCount);
  const trimmed = await sharp(data, { raw: { width: W, height: H, channels: 4 } })
    .extract({ left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 })
    .png()
    .toBuffer();
  await sharp(trimmed).resize({ width: 640 }).png({ compressionLevel: 9, palette: true, quality: 90 }).toFile(path.join(ROOT, "public/images/logo.png"));
  await sharp(trimmed).resize({ width: 320 }).webp({ quality: 88 }).toFile(path.join(ROOT, "public/images/logo-320.webp"));
  // Favicons: logo badge centred on jet black so it reads in browser tabs.
  const square = async (size, pad) =>
    sharp({ create: { width: size, height: size, channels: 4, background: "#0a0a0b" } })
      .composite([{ input: await sharp(trimmed).resize({ width: size - pad * 2, height: size - pad * 2, fit: "inside" }).toBuffer(), gravity: "center" }])
      .png();
  await (await square(512, 28)).toFile(path.join(ROOT, "app/icon.png"));
  await (await square(180, 12)).toFile(path.join(ROOT, "app/apple-icon.png"));
  await (await square(512, 28)).toFile(path.join(ROOT, "public/images/logo-square.png"));
  console.log("✓ logo + icons");
}

await fs.mkdir(OUT, { recursive: true });
const GENERATED = path.join(ROOT, "content/images.generated.ts");
const lowglowOnly = process.argv.includes("--lowglow-only");
let manifest = {};
let videoManifest = {};
if (lowglowOnly) {
  // Keep every other photo's entry exactly as it is; only (re)build the LowGlow media.
  const prev = await fs.readFile(GENERATED, "utf8");
  manifest = JSON.parse(prev.match(/PHOTOS: Record<PhotoSlug, PhotoMeta> = (\{[\s\S]*?\n\});/)[1]);
} else {
  await processLogo();
  if (process.argv.includes("--logo-only")) process.exit(0);
  for (const p of PHOTOS) await processPhoto(p, manifest);
}
for (const p of LOWGLOW_PHOTOS) {
  await fetchOnce(p.url, p.file);
  await processPhoto(p, manifest);
}
for (const v of LOWGLOW_VIDEOS) await processVideo(v, videoManifest);

const ts = `// AUTO-GENERATED by scripts/process-images.mjs — do not edit by hand.
export type PhotoSlug = ${Object.keys(manifest).map((k) => JSON.stringify(k)).join(" | ")};
export type PhotoMeta = { width: number; height: number; widths: number[]; blurDataURL: string };
export const PHOTOS: Record<PhotoSlug, PhotoMeta> = ${JSON.stringify(manifest, null, 2)};

export type VideoSlug = ${Object.keys(videoManifest).map((k) => JSON.stringify(k)).join(" | ")};
export type VideoMeta = { src: string; poster: string; width: number; height: number; duration: number };
export const VIDEOS: Record<VideoSlug, VideoMeta> = ${JSON.stringify(videoManifest, null, 2)};
`;
await fs.writeFile(GENERATED, ts);
console.log("✓ content/images.generated.ts");

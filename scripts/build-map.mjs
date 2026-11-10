// Builds the custom "night map" around the shop from OpenStreetMap data.
//
//   npm run map
//
// Downloads the area once into .osm/area.osm (git-ignored), then writes
// public/images/map/shop-map.svg — dark ground, glowing roads, MD 5 lit up.
// The shop sits exactly in the centre of the drawing, so the page can place
// its pin at 50% / 50% no matter how the image is cropped.
//
// Map data © OpenStreetMap contributors (ODbL) — credited on the page.

import fs from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const CACHE = path.join(ROOT, ".osm/area.osm");
const OUT = path.join(ROOT, "public/images/map/shop-map.svg");

const SHOP = { lat: 38.3039, lon: -76.6558 }; // 26005 Point Lookout Rd
const DOWNTOWN = { lat: 38.2912, lon: -76.6358 }; // Leonardtown (OSM / Nominatim)
const HALF_W = 1150; // metres either side of the shop
const HALF_H = 760;
const BBOX = "-76.672,38.294,-76.640,38.313";

async function loadOsm() {
  try {
    return await fs.readFile(CACHE, "utf8");
  } catch {
    const res = await fetch(`https://api.openstreetmap.org/api/0.6/map?bbox=${BBOX}`, {
      headers: { "User-Agent": "site-build-script" },
    });
    if (!res.ok) throw new Error(`OSM download failed: ${res.status}`);
    const xml = await res.text();
    await fs.mkdir(path.dirname(CACHE), { recursive: true });
    await fs.writeFile(CACHE, xml);
    return xml;
  }
}

// Local metres, y down, shop at (HALF_W, HALF_H)
const M_PER_DEG_LAT = 111_320;
const M_PER_DEG_LON = 111_320 * Math.cos((SHOP.lat * Math.PI) / 180);
const project = (lat, lon) => [HALF_W + (lon - SHOP.lon) * M_PER_DEG_LON, HALF_H - (lat - SHOP.lat) * M_PER_DEG_LAT];

function parse(xml) {
  const nodes = new Map();
  for (const m of xml.matchAll(/<node id="(\d+)"[^>]*?lat="([-\d.]+)" lon="([-\d.]+)"/g)) nodes.set(m[1], project(+m[2], +m[3]));
  const ways = [];
  for (const m of xml.matchAll(/<way id="\d+"[^>]*>([\s\S]*?)<\/way>/g)) {
    const body = m[1];
    const pts = [...body.matchAll(/<nd ref="(\d+)"\/>/g)].map((n) => nodes.get(n[1])).filter(Boolean);
    const tags = Object.fromEntries([...body.matchAll(/<tag k="([^"]+)" v="([^"]*)"\/>/g)].map((t) => [t[1], t[2]]));
    if (pts.length > 1) ways.push({ pts, tags });
  }
  return ways;
}

const M = 250; // keep features a little past the frame
const visible = (pts) => pts.some(([x, y]) => x > -M && x < HALF_W * 2 + M && y > -M && y < HALF_H * 2 + M);
const d = (pts, close = false) => "M" + pts.map(([x, y]) => `${x.toFixed(0)} ${y.toFixed(0)}`).join("L") + (close ? "Z" : "");
const join = (list, close) => list.map((w) => d(w.pts, close)).join("");

function classify(t) {
  const h = t.highway;
  if (h === "primary" || h === "primary_link" || h === "trunk") return "primary";
  if (h === "secondary" || h === "tertiary") return "tertiary";
  if (h === "residential" || h === "unclassified" || h === "living_street") return "local";
  if (h === "service" || h === "track") return "service";
  if (h === "footway" || h === "path" || h === "cycleway") return "foot";
  if (t.natural === "water" || t.waterway === "riverbank") return "water";
  if (t.waterway) return "stream";
  if (t.building) return "building";
  if (t.landuse || t.leisure || t.amenity === "parking") return "land";
  return null;
}

/** Longest named way for a label, oriented left→right so text reads upright. */
function labelPath(ways, test) {
  const w = ways.filter((x) => test(x.tags)).sort((a, b) => b.pts.length - a.pts.length)[0];
  if (!w) return null;
  const inFrame = w.pts.filter(([x, y]) => x > 40 && x < HALF_W * 2 - 40 && y > 40 && y < HALF_H * 2 - 40);
  const pts = inFrame.length > 3 ? inFrame : w.pts;
  return pts[0][0] > pts[pts.length - 1][0] ? [...pts].reverse() : pts;
}

const xml = await loadOsm();
const ways = parse(xml).filter((w) => visible(w.pts));
const by = {};
for (const w of ways) {
  const c = classify(w.tags);
  if (c) (by[c] ??= []).push(w);
}

const W = HALF_W * 2;
const H = HALF_H * 2;
const md5Label = labelPath(ways, (t) => t.ref === "MD 5");
const md243Label = labelPath(ways, (t) => t.ref === "MD 243");
const [dx, dy] = project(DOWNTOWN.lat, DOWNTOWN.lon);
const ang = Math.atan2(dy - HALF_H, dx - HALF_W);
// Where the direction marker sits: on the frame edge toward downtown.
const t = Math.min((HALF_W - 120) / Math.abs(Math.cos(ang)), (HALF_H - 110) / Math.abs(Math.sin(ang)));
const ex = HALF_W + Math.cos(ang) * t;
const ey = HALF_H + Math.sin(ang) * t;
const deg = (ang * 180) / Math.PI;

const hex = (cx, cy, r) =>
  "M" +
  Array.from({ length: 6 }, (_, i) => `${(cx + r * Math.cos((Math.PI / 3) * i)).toFixed(1)} ${(cy + r * Math.sin((Math.PI / 3) * i)).toFixed(1)}`).join("L") +
  "Z";

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">
<title>Map: Mike's Automotive Detailing, 26005 Point Lookout Rd, Leonardtown, MD</title>
<defs>
  <pattern id="hx" width="78" height="135" patternUnits="userSpaceOnUse">
    <path d="${hex(39, 22.5, 26)}${hex(0, 90, 26)}${hex(78, 90, 26)}" fill="none" stroke="#fff" stroke-opacity=".035" stroke-width="1.5"/>
  </pattern>
  <radialGradient id="vig" cx="50%" cy="50%" r="70%">
    <stop offset="0" stop-color="#e3191f" stop-opacity=".16"/>
    <stop offset=".35" stop-color="#0a0a0b" stop-opacity="0"/>
    <stop offset="1" stop-color="#000" stop-opacity=".75"/>
  </radialGradient>
  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="9"/></filter>
  ${md5Label ? `<path id="l5" d="${d(md5Label)}"/>` : ""}
  ${md243Label ? `<path id="l243" d="${d(md243Label)}"/>` : ""}
  <style>
    .sweep{stroke-dasharray:180 2600;animation:sw 7s linear infinite}
    @keyframes sw{from{stroke-dashoffset:2780}to{stroke-dashoffset:0}}
    .ring{transform-origin:${HALF_W}px ${HALF_H}px;animation:ring 3.2s ease-out infinite}
    @keyframes ring{from{transform:scale(.25);opacity:.9}to{transform:scale(1);opacity:0}}
    @media (prefers-reduced-motion:reduce){.sweep,.ring{animation:none}.ring{opacity:0}}
    text{font-family:Arial,Helvetica,sans-serif;font-weight:700;letter-spacing:.22em;text-transform:uppercase}
  </style>
</defs>
<rect width="${W}" height="${H}" fill="#0b0b0d"/>
<rect width="${W}" height="${H}" fill="url(#hx)"/>
<path d="${join(by.land ?? [], true)}" fill="#111215"/>
<path d="${join(by.water ?? [], true)}" fill="#0d1a26"/>
<path d="${join(by.stream ?? [])}" fill="none" stroke="#173049" stroke-width="5" stroke-linecap="round"/>
<path d="${join(by.building ?? [], true)}" fill="#18191d" stroke="#202227" stroke-width="2"/>
<path d="${join(by.foot ?? [])}" fill="none" stroke="#24262b" stroke-width="2" stroke-dasharray="6 7"/>
<path d="${join(by.service ?? [])}" fill="none" stroke="#25272c" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="${join(by.local ?? [])}" fill="none" stroke="#34373e" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
<path d="${join(by.tertiary ?? [])}" fill="none" stroke="#4b4f58" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/>
<path d="${join(by.primary ?? [])}" fill="none" stroke="#e3191f" stroke-opacity=".55" stroke-width="40" stroke-linecap="round" stroke-linejoin="round" filter="url(#glow)"/>
<path d="${join(by.primary ?? [])}" fill="none" stroke="#c9ccd1" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>
<path d="${join(by.primary ?? [])}" fill="none" stroke="#0b0b0d" stroke-width="1.6" stroke-dasharray="22 26"/>
${md5Label ? `<path d="${d(md5Label)}" class="sweep" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round"/>` : ""}
${md5Label ? `<text font-size="24" fill="#f5f6f7" dy="-26"><textPath href="#l5" startOffset="22%">Point Lookout Rd · MD 5</textPath></text>` : ""}
${md243Label ? `<text font-size="19" fill="#8a8e96" dy="-16"><textPath href="#l243" startOffset="30%">Newtowne Neck Rd · MD 243</textPath></text>` : ""}
<g fill="none" stroke="#e3191f">
  <circle cx="${HALF_W}" cy="${HALF_H}" r="250" stroke-opacity=".28" stroke-width="2" stroke-dasharray="4 12"/>
  <circle cx="${HALF_W}" cy="${HALF_H}" r="520" stroke-opacity=".16" stroke-width="2" stroke-dasharray="4 14"/>
  <circle class="ring" cx="${HALF_W}" cy="${HALF_H}" r="190" stroke-opacity=".8" stroke-width="3"/>
</g>
<g transform="translate(${ex.toFixed(0)} ${ey.toFixed(0)})">
  <g transform="rotate(${deg.toFixed(1)})"><path d="M-26 -16L8 0L-26 16" fill="none" stroke="#ff5a5f" stroke-width="5" stroke-linejoin="round"/></g>
  <text font-size="19" fill="#c9ccd1" text-anchor="${Math.cos(ang) > 0 ? "end" : "start"}" x="${Math.cos(ang) > 0 ? -46 : 46}" y="${Math.sin(ang) > 0 ? -18 : 34}">Downtown Leonardtown</text>
</g>
<g transform="translate(${W - 90} 90)" opacity=".7">
  <circle r="34" fill="none" stroke="#c9ccd1" stroke-opacity=".35" stroke-width="2"/>
  <path d="M0 -24L9 6L0 0L-9 6Z" fill="#f5f6f7"/>
  <text font-size="16" fill="#c9ccd1" text-anchor="middle" y="28" letter-spacing="0">N</text>
</g>
<rect width="${W}" height="${H}" fill="url(#vig)"/>
</svg>
`;

await fs.mkdir(path.dirname(OUT), { recursive: true });
await fs.writeFile(OUT, svg);
console.log(`✓ ${path.relative(ROOT, OUT)} (${(svg.length / 1024).toFixed(1)} KB) — ${ways.length} ways`, Object.fromEntries(Object.entries(by).map(([k, v]) => [k, v.length])));

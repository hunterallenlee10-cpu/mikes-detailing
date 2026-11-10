import type { MetadataRoute } from "next";
import { business, services } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = business.siteUrl.replace(/\/$/, "");
  const pages = [
    { path: "/", priority: 1 },
    ...services.map((s) => ({ path: `/${s.slug}`, priority: s.slug === "fleet" ? 0.6 : 0.9 })),
    { path: "/gallery", priority: 0.7 },
    { path: "/reviews", priority: 0.7 },
    { path: "/about", priority: 0.6 },
    { path: "/contact", priority: 0.8 },
    { path: "/privacy", priority: 0.2 },
  ];
  return pages.map((p) => ({ url: `${base}${p.path}`, changeFrequency: "monthly", priority: p.priority }));
}

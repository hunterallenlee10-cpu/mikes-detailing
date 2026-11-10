import type { MetadataRoute } from "next";
import { business } from "@/content/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: business.name,
    short_name: "Mike's Detailing",
    description: `${business.tagline}. Detailing & ceramic coating in Leonardtown, MD.`,
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0b",
    theme_color: "#0a0a0b",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}

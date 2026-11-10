import { getImageProps, type ImageLoader } from "next/image";
import { PHOTOS, type PhotoSlug } from "@/content/images.generated";
import { cn } from "@/lib/cn";

/**
 * Serves the pre-graded, plate-blurred images from scripts/process-images.mjs
 * through next/image's srcset logic, as AVIF with a WebP fallback.
 * Never upscales: the loader picks the nearest generated width ≤ native size.
 */
function loaderFor(slug: PhotoSlug, ext: "avif" | "webp"): ImageLoader {
  const { widths } = PHOTOS[slug];
  return ({ width }) => {
    const w = widths.find((x) => x >= width) ?? widths[widths.length - 1];
    return `/images/site/${slug}-${w}.${ext}`;
  };
}

type Props = {
  slug: PhotoSlug;
  alt: string;
  sizes: string;
  className?: string;
  imgClassName?: string;
  /** Use for the above-the-fold LCP image only. */
  eager?: boolean;
  /** CSS object-position to keep the subject in frame. */
  position?: string;
  fill?: boolean;
};

export function Photo({ slug, alt, sizes, className, imgClassName, eager, position = "50% 50%", fill = true }: Props) {
  const meta = PHOTOS[slug];
  const common = {
    alt,
    sizes,
    width: meta.width,
    height: meta.height,
    loading: eager ? ("eager" as const) : ("lazy" as const),
    fetchPriority: eager ? ("high" as const) : undefined,
    quality: 75,
  };
  const avif = getImageProps({ ...common, src: `/${slug}.avif`, loader: loaderFor(slug, "avif") }).props;
  const { props: webp } = getImageProps({ ...common, src: `/${slug}.webp`, loader: loaderFor(slug, "webp") });

  return (
    <picture
      className={cn(fill ? "absolute inset-0 block h-full w-full" : "block", "overflow-hidden bg-carbon", className)}
      style={{
        backgroundImage: `url(${meta.blurDataURL})`,
        backgroundSize: "cover",
        backgroundPosition: position,
      }}
    >
      <source type="image/avif" srcSet={avif.srcSet} sizes={avif.sizes} />
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <img
        {...webp}
        decoding={eager ? "sync" : "async"}
        className={cn(fill ? "h-full w-full object-cover" : "h-auto w-full", imgClassName)}
        style={{ objectPosition: position }}
      />
    </picture>
  );
}

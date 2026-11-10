import { business, links } from "@/content/site";
import { ArrowIcon, PinIcon } from "../icons";

/**
 * Custom "night map" of the shop's surroundings (generated from OpenStreetMap by
 * scripts/build-map.mjs). The shop is the exact centre of the drawing, so the pin
 * sits at 50% / 50% however the image is cropped.
 */
export function ShopMap() {
  const { street, city, region, postalCode } = business.address;
  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-[2rem] bg-jet ring-1 ring-white/10 sm:block sm:min-h-[26rem]">
      <div className="relative h-[19rem] shrink-0 sm:absolute sm:inset-0 sm:h-auto">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/map/shop-map.svg"
          alt={`Map showing ${business.name} on Point Lookout Rd (MD 5) just east of Newtowne Neck Rd (MD 243), northwest of downtown Leonardtown`}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Pin */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full"
        >
          <div className="relative flex flex-col items-center">
            <span className="mb-2 rounded-full bg-jet/85 px-3 py-1 text-[0.65rem] font-extrabold tracking-[0.2em] whitespace-nowrap text-white uppercase ring-1 ring-red/60 backdrop-blur">
              Mike&apos;s · The Bay
            </span>
            <span className="hex-clip flex h-11 w-12 items-center justify-center bg-red shadow-[0_0_30px_rgb(227_25_31/0.9)]">
              <span className="hex-clip h-5 w-6 bg-white" />
            </span>
            <span className="h-3 w-0.5 bg-red" />
            <span className="h-1.5 w-6 rounded-full bg-red/50 blur-[2px]" />
          </div>
        </div>

        <p className="absolute top-3 left-4 text-[0.6rem] text-white/45">
          Map data © OpenStreetMap contributors
        </p>
      </div>

      {/* Address card: below the map on phones, floating on larger screens */}
      <div className="relative p-3 sm:absolute sm:bottom-5 sm:left-5 sm:max-w-sm sm:p-0">
        <div className="glass flex items-center justify-between gap-4 rounded-2xl p-4 ring-1 ring-white/12">
          <address className="min-w-0 not-italic">
            <span className="eyebrow flex items-center gap-1.5 text-red-text">
              <PinIcon size={14} /> Find us
            </span>
            <span className="mt-1 block font-extrabold text-white">
              {street}
            </span>
            <span className="block text-sm text-chrome">
              {city}, {region} {postalCode}
            </span>
            <span className="mt-1 block text-xs text-muted">
              Look for our sign on the road board.
            </span>
          </address>
          <a
            href={links.directions}
            target="_blank"
            rel="noopener noreferrer"
            data-track="directions"
            className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full bg-red px-4 text-sm font-extrabold text-white transition hover:bg-[#f0262c]"
          >
            Directions <ArrowIcon size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { business, links } from "@/content/site";
import { PinIcon } from "../icons";

/** Google Map that only loads once it scrolls into view (or on tap) — keeps the page fast. */
export function MapEmbed({ eager = false }: { eager?: boolean }) {
  const [load, setLoad] = useState(eager);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (load || !ref.current) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setLoad(true), { rootMargin: "200px" });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [load]);

  return (
    <div ref={ref} className="relative h-full min-h-72 overflow-hidden rounded-[2rem] bg-graphite ring-1 ring-white/10">
      {load ? (
        <iframe
          title={`Map to ${business.name}, ${business.address.street}, ${business.address.city}`}
          src={links.mapEmbed}
          className="absolute inset-0 h-full w-full border-0 [filter:invert(.92)_hue-rotate(180deg)_saturate(.6)_contrast(.95)]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <button type="button" onClick={() => setLoad(true)} className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white">
          <span
            aria-hidden
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "linear-gradient(rgb(255 255 255 / .06) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / .06) 1px, transparent 1px)",
              backgroundSize: "36px 36px",
            }}
          />
          <PinIcon size={36} className="relative text-red-text" />
          <span className="relative font-extrabold">Load map</span>
        </button>
      )}
    </div>
  );
}

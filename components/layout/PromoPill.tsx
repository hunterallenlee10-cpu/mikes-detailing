"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { promos, type Promo } from "@/content/site";
import { activeItems, nowFromSearch } from "@/lib/time";
import { CloseIcon } from "../icons";

/** Slim promo pill under the nav. Shows only promos inside their start/end window. */
export function PromoPill() {
  const [promo, setPromo] = useState<Promo | null>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const active = activeItems(promos, nowFromSearch(window.location.search));
    let dismissed = "";
    try {
      dismissed = sessionStorage.getItem("promo-dismissed") ?? "";
    } catch {}
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPromo(active.find((p) => p.id !== dismissed) ?? null);
    const onScroll = () => setHidden(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!promo) return null;
  return (
    <div
      className={`pointer-events-auto mx-auto mt-2 flex w-fit max-w-full items-center gap-1 rounded-full bg-red-deep/90 py-1 pr-1 pl-4 text-xs font-bold text-white shadow-[0_10px_30px_-12px_rgb(227_25_31/0.9)] ring-1 ring-red/60 backdrop-blur transition-all duration-500 sm:text-sm ${
        hidden ? "invisible -translate-y-2 opacity-0" : "fade-up"
      }`}
      data-promo={promo.id}
    >
      <Link href="/#specials" className="truncate hover:underline" data-track="promo_banner">
        <span aria-hidden className="mr-2 inline-block h-2 w-2 animate-[pulse-dot_1.6s_infinite] rounded-full bg-white text-white/60" />
        {promo.banner}
      </Link>
      <button
        type="button"
        aria-label="Dismiss promotion"
        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full hover:bg-white/15"
        onClick={() => {
          try {
            sessionStorage.setItem("promo-dismissed", promo.id);
          } catch {}
          setPromo(null);
        }}
      >
        <CloseIcon size={14} />
      </button>
    </div>
  );
}

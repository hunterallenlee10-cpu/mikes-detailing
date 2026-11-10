"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { ArrowIcon, CloseIcon } from "../icons";

export type Tile = {
  key: string;
  title: string;
  caption: string;
  categories: string[];
  thumb: ReactNode;
  large: ReactNode | null;
  tall?: boolean;
};

export function GalleryGrid({
  tiles,
  categories,
  filterable = true,
}: {
  tiles: Tile[];
  categories: string[];
  filterable?: boolean;
}) {
  const [filter, setFilter] = useState<string>("All");
  const [open, setOpen] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const shown = tiles.filter(
    (t) => filter === "All" || t.categories.includes(filter),
  );

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open !== null && !d.open) d.showModal();
    if (open === null && d.open) d.close();
  }, [open]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight")
        setOpen((i) => (i === null ? i : (i + 1) % shown.length));
      if (e.key === "ArrowLeft")
        setOpen((i) =>
          i === null ? i : (i - 1 + shown.length) % shown.length,
        );
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, shown.length]);

  const current = open !== null ? shown[open] : null;

  return (
    <div>
      {filterable && (
        <div
          role="group"
          aria-label="Filter gallery"
          className="mb-8 flex flex-wrap gap-2"
        >
          {["All", ...categories].map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={filter === c}
              onClick={() => setFilter(c)}
              className={cn(
                "min-h-11 rounded-full px-5 text-sm font-extrabold ring-1 transition",
                filter === c
                  ? "bg-red text-white ring-red"
                  : "bg-white/5 text-chrome ring-white/15 hover:bg-white/10 hover:text-white",
              )}
            >
              {c}
            </button>
          ))}
        </div>
      )}
      <ul
        className={cn(
          "gap-4",
          filterable
            ? "columns-1 sm:columns-2 lg:columns-3 [&>li]:mb-4"
            : "grid sm:grid-cols-2 lg:grid-cols-3",
        )}
      >
        {shown.map((t, i) => (
          <li key={t.key} className="break-inside-avoid">
            {filterable ? (
              <button
                type="button"
                onClick={() => setOpen(i)}
                className="group relative block w-full overflow-hidden rounded-3xl bg-carbon text-left ring-1 ring-white/10 transition hover:ring-white/30"
                aria-label={`Open photo: ${t.title}`}
              >
                <div
                  className={cn(
                    "relative w-full",
                    t.tall && filterable ? "aspect-[4/5]" : "aspect-[4/3]",
                  )}
                >
                  <div className="absolute inset-0 transition duration-700 group-hover:scale-[1.04]">
                    {t.thumb}
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-jet via-jet/45 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="eyebrow text-white/75">
                    {t.categories.join(" · ")}
                  </p>
                  <p className="font-wide mt-1 text-base font-black text-white uppercase">
                    {t.title}
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm text-chrome/85">
                    {t.caption}
                  </p>
                </div>
              </button>
            ) : (
              <Link
                href="/gallery"
                className="group relative block w-full overflow-hidden rounded-3xl bg-carbon ring-1 ring-white/10 transition hover:ring-white/30"
              >
                <div
                  className={cn(
                    "relative w-full",
                    t.tall && filterable ? "aspect-[4/5]" : "aspect-[4/3]",
                  )}
                >
                  <div className="absolute inset-0 transition duration-700 group-hover:scale-[1.04]">
                    {t.thumb}
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-jet via-jet/45 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="eyebrow text-white/75">
                    {t.categories.join(" · ")}
                  </p>
                  <p className="font-wide mt-1 text-base font-black text-white uppercase">
                    {t.title}
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm text-chrome/85">
                    {t.caption}
                  </p>
                </div>
              </Link>
            )}
          </li>
        ))}
      </ul>

      {filterable && (
        <dialog
          ref={dialogRef}
          onClose={() => setOpen(null)}
          onClick={(e) => e.target === dialogRef.current && setOpen(null)}
          aria-label={current ? current.title : "Photo"}
          className="m-auto max-h-[100dvh] w-full max-w-5xl bg-transparent p-3 backdrop:bg-black/85 backdrop:backdrop-blur-sm sm:p-6"
        >
          {current && (
            <figure className="relative overflow-hidden rounded-3xl bg-carbon ring-1 ring-white/15">
              <div className="relative h-[62dvh] w-full bg-jet">
                {current.large}
              </div>
              <figcaption className="p-5 sm:p-6">
                <p className="eyebrow text-red-text">
                  {current.categories.join(" · ")}
                </p>
                <p className="font-wide mt-1 text-xl font-black text-white uppercase">
                  {current.title}
                </p>
                <p className="mt-2 text-chrome/90">{current.caption}</p>
              </figcaption>
              <div className="absolute top-3 right-3 flex gap-2">
                <button
                  type="button"
                  aria-label="Previous photo"
                  onClick={() =>
                    setOpen((i) =>
                      i === null ? i : (i - 1 + shown.length) % shown.length,
                    )
                  }
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white ring-1 ring-white/20 hover:bg-black/80"
                >
                  <ArrowIcon size={18} className="rotate-180" />
                </button>
                <button
                  type="button"
                  aria-label="Next photo"
                  onClick={() =>
                    setOpen((i) => (i === null ? i : (i + 1) % shown.length))
                  }
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white ring-1 ring-white/20 hover:bg-black/80"
                >
                  <ArrowIcon size={18} />
                </button>
                <button
                  type="button"
                  aria-label="Close"
                  onClick={() => setOpen(null)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white ring-1 ring-white/20 hover:bg-black/80"
                  autoFocus
                >
                  <CloseIcon size={18} />
                </button>
              </div>
            </figure>
          )}
        </dialog>
      )}
    </div>
  );
}

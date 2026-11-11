"use client";

import { useEffect, useRef, useState } from "react";
import { videos, type VideoSlug } from "@/content/site";
import { cn } from "@/lib/cn";

/**
 * Short vertical clips from public/videos.
 *  - Silent clips loop muted while on screen (and stay paused for reduced-motion users until tapped).
 *  - Clips with sound show a poster + play button; tapping plays with sound and native controls.
 */
export function VideoClip({ slug, className, showCaption = true }: { slug: VideoSlug; className?: string; showCaption?: boolean }) {
  const v = videos[slug];
  const ref = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || v.sound) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.play().then(() => setStarted(true), () => {});
        } else el.pause();
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [v.sound]);

  const play = () => {
    const el = ref.current;
    if (!el) return;
    el.muted = !v.sound;
    el.play().then(
      () => setStarted(true),
      () => {},
    );
    import("@vercel/analytics").then(({ track }) => track("video_play", { video: slug }));
  };

  return (
    <figure className={cn("relative", className)}>
      <div className="relative overflow-hidden rounded-[2rem] bg-carbon ring-1 ring-white/15 shadow-[0_40px_80px_-30px_rgb(0_0_0/0.9)]" style={{ aspectRatio: `${v.width} / ${v.height}` }}>
        <video
          ref={ref}
          className="absolute inset-0 h-full w-full object-cover"
          poster={`/videos/${slug}.webp`}
          width={v.width}
          height={v.height}
          playsInline
          preload="none"
          muted={!v.sound}
          loop={!v.sound}
          controls={v.sound && started}
          aria-label={v.label}
          onEnded={() => v.sound && setStarted(false)}
        >
          <source src={`/videos/${slug}.mp4`} type="video/mp4" />
        </video>
        {!started && (
          <button
            type="button"
            onClick={play}
            className="group absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-t from-jet/70 via-transparent to-transparent text-white"
            aria-label={`Play video: ${v.title.replace(/[“”]/g, "")}${v.sound ? " (with sound)" : ""}`}
          >
            <span className="hex-clip flex h-16 w-[4.5rem] items-center justify-center bg-red shadow-[0_10px_30px_-10px_rgb(227_25_31/0.9)] transition group-hover:scale-105">
              <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden fill="currentColor">
                <path d="M8 5.5v13l11-6.5z" />
              </svg>
            </span>
            {v.sound && <span className="rounded-full bg-jet/70 px-3 py-1 text-xs font-extrabold tracking-wider uppercase ring-1 ring-white/15">Tap for sound</span>}
          </button>
        )}
      </div>
      {showCaption && (
        <figcaption className="mt-4">
          <span className="block font-extrabold text-white">{v.title}</span>
          <span className="mt-1 block text-sm leading-snug text-muted">{v.caption}</span>
        </figcaption>
      )}
    </figure>
  );
}
